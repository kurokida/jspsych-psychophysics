var jsPsychImageKeyboardResponse = (function (jspsych) {
  'use strict';

  var _package = {
    name: "@jspsych/plugin-image-keyboard-response",
    version: "2.0.0",
    description: "jsPsych plugin for displaying a stimulus and getting a keyboard response",
    type: "module",
    main: "dist/index.cjs",
    exports: {
      import: "./dist/index.js",
      require: "./dist/index.cjs"
    },
    typings: "dist/index.d.ts",
    unpkg: "dist/index.browser.min.js",
    files: [
      "src",
      "dist"
    ],
    source: "src/index.ts",
    scripts: {
      test: "jest",
      "test:watch": "npm test -- --watch",
      tsc: "tsc",
      build: "rollup --config",
      "build:watch": "npm run build -- --watch"
    },
    repository: {
      type: "git",
      url: "git+https://github.com/jspsych/jsPsych.git",
      directory: "packages/plugin-image-keyboard-response"
    },
    author: "Josh de Leeuw",
    license: "MIT",
    bugs: {
      url: "https://github.com/jspsych/jsPsych/issues"
    },
    homepage: "https://www.jspsych.org/latest/plugins/image-keyboard-response",
    peerDependencies: {
      jspsych: ">=7.1.0"
    },
    devDependencies: {
      "@jspsych/config": "^3.0.0",
      "@jspsych/test-utils": "^1.2.0"
    }
  };

  const info = {
    name: "image-keyboard-response",
    version: _package.version,
    parameters: {
      stimulus: {
        type: jspsych.ParameterType.IMAGE,
        default: void 0
      },
      stimulus_height: {
        type: jspsych.ParameterType.INT,
        default: null
      },
      stimulus_width: {
        type: jspsych.ParameterType.INT,
        default: null
      },
      maintain_aspect_ratio: {
        type: jspsych.ParameterType.BOOL,
        default: true
      },
      choices: {
        type: jspsych.ParameterType.KEYS,
        default: "ALL_KEYS"
      },
      prompt: {
        type: jspsych.ParameterType.HTML_STRING,
        default: null
      },
      stimulus_duration: {
        type: jspsych.ParameterType.INT,
        default: null
      },
      trial_duration: {
        type: jspsych.ParameterType.INT,
        default: null
      },
      response_ends_trial: {
        type: jspsych.ParameterType.BOOL,
        default: true
      },
      render_on_canvas: {
        type: jspsych.ParameterType.BOOL,
        default: true
      }
    },
    data: {
      stimulus: {
        type: jspsych.ParameterType.STRING
      },
      response: {
        type: jspsych.ParameterType.STRING
      },
      rt: {
        type: jspsych.ParameterType.INT
      }
    }
  };
  class ImageKeyboardResponsePlugin {
    constructor(jsPsych) {
      this.jsPsych = jsPsych;
    }
    static info = info;
    trial(display_element, trial) {
      var height, width;
      if (trial.render_on_canvas) {
        var image_drawn = false;
        if (display_element.hasChildNodes()) {
          while (display_element.firstChild) {
            display_element.removeChild(display_element.firstChild);
          }
        }
        var canvas = document.createElement("canvas");
        canvas.id = "jspsych-image-keyboard-response-stimulus";
        canvas.style.margin = "0";
        canvas.style.padding = "0";
        var ctx = canvas.getContext("2d");
        var img = new Image();
        img.onload = () => {
          if (!image_drawn) {
            getHeightWidth();
            ctx.drawImage(img, 0, 0, width, height);
          }
        };
        img.src = trial.stimulus;
        const getHeightWidth = () => {
          if (trial.stimulus_height !== null) {
            height = trial.stimulus_height;
            if (trial.stimulus_width == null && trial.maintain_aspect_ratio) {
              width = img.naturalWidth * (trial.stimulus_height / img.naturalHeight);
            }
          } else {
            height = img.naturalHeight;
          }
          if (trial.stimulus_width !== null) {
            width = trial.stimulus_width;
            if (trial.stimulus_height == null && trial.maintain_aspect_ratio) {
              height = img.naturalHeight * (trial.stimulus_width / img.naturalWidth);
            }
          } else if (!(trial.stimulus_height !== null && trial.maintain_aspect_ratio)) {
            width = img.naturalWidth;
          }
          canvas.height = height;
          canvas.width = width;
        };
        getHeightWidth();
        display_element.insertBefore(canvas, null);
        if (img.complete && Number.isFinite(width) && Number.isFinite(height)) {
          ctx.drawImage(img, 0, 0, width, height);
          image_drawn = true;
        }
        if (trial.prompt !== null) {
          display_element.insertAdjacentHTML("beforeend", trial.prompt);
        }
      } else {
        var html = '<img src="' + trial.stimulus + '" id="jspsych-image-keyboard-response-stimulus">';
        if (trial.prompt !== null) {
          html += trial.prompt;
        }
        display_element.innerHTML = html;
        var img = display_element.querySelector(
          "#jspsych-image-keyboard-response-stimulus"
        );
        if (trial.stimulus_height !== null) {
          height = trial.stimulus_height;
          if (trial.stimulus_width == null && trial.maintain_aspect_ratio) {
            width = img.naturalWidth * (trial.stimulus_height / img.naturalHeight);
          }
        } else {
          height = img.naturalHeight;
        }
        if (trial.stimulus_width !== null) {
          width = trial.stimulus_width;
          if (trial.stimulus_height == null && trial.maintain_aspect_ratio) {
            height = img.naturalHeight * (trial.stimulus_width / img.naturalWidth);
          }
        } else if (!(trial.stimulus_height !== null && trial.maintain_aspect_ratio)) {
          width = img.naturalWidth;
        }
        img.style.height = height.toString() + "px";
        img.style.width = width.toString() + "px";
      }
      var response = {
        rt: null,
        key: null
      };
      const end_trial = () => {
        if (typeof keyboardListener !== "undefined") {
          this.jsPsych.pluginAPI.cancelKeyboardResponse(keyboardListener);
        }
        var trial_data = {
          rt: response.rt,
          stimulus: trial.stimulus,
          response: response.key
        };
        this.jsPsych.finishTrial(trial_data);
      };
      var after_response = (info2) => {
        display_element.querySelector("#jspsych-image-keyboard-response-stimulus").className += " responded";
        if (response.key == null) {
          response = info2;
        }
        if (trial.response_ends_trial) {
          end_trial();
        }
      };
      if (trial.choices != "NO_KEYS") {
        var keyboardListener = this.jsPsych.pluginAPI.getKeyboardResponse({
          callback_function: after_response,
          valid_responses: trial.choices,
          rt_method: "performance",
          persist: false,
          allow_held_key: false
        });
      }
      if (trial.stimulus_duration !== null) {
        this.jsPsych.pluginAPI.setTimeout(() => {
          display_element.querySelector(
            "#jspsych-image-keyboard-response-stimulus"
          ).style.visibility = "hidden";
        }, trial.stimulus_duration);
      }
      if (trial.trial_duration !== null) {
        this.jsPsych.pluginAPI.setTimeout(() => {
          end_trial();
        }, trial.trial_duration);
      } else if (trial.response_ends_trial === false) {
        console.warn(
          "The experiment may be deadlocked. Try setting a trial duration or set response_ends_trial to true."
        );
      }
    }
    simulate(trial, simulation_mode, simulation_options, load_callback) {
      if (simulation_mode == "data-only") {
        load_callback();
        this.simulate_data_only(trial, simulation_options);
      }
      if (simulation_mode == "visual") {
        this.simulate_visual(trial, simulation_options, load_callback);
      }
    }
    simulate_data_only(trial, simulation_options) {
      const data = this.create_simulation_data(trial, simulation_options);
      this.jsPsych.finishTrial(data);
    }
    simulate_visual(trial, simulation_options, load_callback) {
      const data = this.create_simulation_data(trial, simulation_options);
      const display_element = this.jsPsych.getDisplayElement();
      this.trial(display_element, trial);
      load_callback();
      if (data.rt !== null) {
        this.jsPsych.pluginAPI.pressKey(data.response, data.rt);
      }
    }
    create_simulation_data(trial, simulation_options) {
      const default_data = {
        stimulus: trial.stimulus,
        rt: this.jsPsych.randomization.sampleExGaussian(500, 50, 1 / 150, true),
        response: this.jsPsych.pluginAPI.getValidKey(trial.choices)
      };
      const data = this.jsPsych.pluginAPI.mergeSimulationData(default_data, simulation_options);
      this.jsPsych.pluginAPI.ensureSimulationDataConsistency(trial, data);
      return data;
    }
  }

  return ImageKeyboardResponsePlugin;

})(jsPsychModule);
