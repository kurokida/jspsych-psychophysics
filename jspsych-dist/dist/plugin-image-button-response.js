var jsPsychImageButtonResponse = (function (jspsych) {
  'use strict';

  var _package = {
    name: "@jspsych/plugin-image-button-response",
    version: "2.0.0",
    description: "jsPsych plugin for displaying a stimulus and getting a button response",
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
      directory: "packages/plugin-image-button-response"
    },
    author: "Josh de Leeuw",
    license: "MIT",
    bugs: {
      url: "https://github.com/jspsych/jsPsych/issues"
    },
    homepage: "https://www.jspsych.org/latest/plugins/image-button-response",
    peerDependencies: {
      jspsych: ">=7.1.0"
    },
    devDependencies: {
      "@jspsych/config": "^3.0.0",
      "@jspsych/test-utils": "^1.2.0"
    }
  };

  const info = {
    name: "image-button-response",
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
        type: jspsych.ParameterType.STRING,
        default: void 0,
        array: true
      },
      button_html: {
        type: jspsych.ParameterType.FUNCTION,
        default: function(choice, choice_index) {
          return `<button class="jspsych-btn">${choice}</button>`;
        }
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
      button_layout: {
        type: jspsych.ParameterType.STRING,
        default: "grid"
      },
      grid_rows: {
        type: jspsych.ParameterType.INT,
        default: 1
      },
      grid_columns: {
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
      },
      enable_button_after: {
        type: jspsych.ParameterType.INT,
        default: 0
      }
    },
    data: {
      stimulus: {
        type: jspsych.ParameterType.STRING
      },
      response: {
        type: jspsych.ParameterType.INT
      },
      rt: {
        type: jspsych.ParameterType.INT
      }
    }
  };
  class ImageButtonResponsePlugin {
    constructor(jsPsych) {
      this.jsPsych = jsPsych;
    }
    static info = info;
    trial(display_element, trial) {
      const calculateImageDimensions = (image2) => {
        let width, height;
        if (trial.stimulus_height !== null) {
          height = trial.stimulus_height;
          if (trial.stimulus_width == null && trial.maintain_aspect_ratio) {
            width = image2.naturalWidth * (trial.stimulus_height / image2.naturalHeight);
          }
        } else {
          height = image2.naturalHeight;
        }
        if (trial.stimulus_width !== null) {
          width = trial.stimulus_width;
          if (trial.stimulus_height == null && trial.maintain_aspect_ratio) {
            height = image2.naturalHeight * (trial.stimulus_width / image2.naturalWidth);
          }
        } else if (!(trial.stimulus_height !== null && trial.maintain_aspect_ratio)) {
          width = image2.naturalWidth;
        }
        return [width, height];
      };
      display_element.innerHTML = "";
      let stimulusElement;
      let canvas;
      const image = trial.render_on_canvas ? new Image() : document.createElement("img");
      if (trial.render_on_canvas) {
        canvas = document.createElement("canvas");
        canvas.style.margin = "0";
        canvas.style.padding = "0";
        stimulusElement = canvas;
      } else {
        stimulusElement = image;
      }
      const drawImage = () => {
        const [width, height] = calculateImageDimensions(image);
        if (trial.render_on_canvas) {
          canvas.width = width;
          canvas.height = height;
          canvas.getContext("2d").drawImage(image, 0, 0, width, height);
        } else {
          image.style.width = `${width}px`;
          image.style.height = `${height}px`;
        }
      };
      let hasImageBeenDrawn = false;
      image.onload = () => {
        if (!hasImageBeenDrawn) {
          drawImage();
        }
      };
      image.src = trial.stimulus;
      if (image.complete && image.naturalWidth !== 0) {
        drawImage();
        hasImageBeenDrawn = true;
      }
      stimulusElement.id = "jspsych-image-button-response-stimulus";
      display_element.appendChild(stimulusElement);
      const buttonGroupElement = document.createElement("div");
      buttonGroupElement.id = "jspsych-image-button-response-btngroup";
      if (trial.button_layout === "grid") {
        buttonGroupElement.classList.add("jspsych-btn-group-grid");
        if (trial.grid_rows === null && trial.grid_columns === null) {
          throw new Error(
            "You cannot set `grid_rows` to `null` without providing a value for `grid_columns`."
          );
        }
        const n_cols = trial.grid_columns === null ? Math.ceil(trial.choices.length / trial.grid_rows) : trial.grid_columns;
        const n_rows = trial.grid_rows === null ? Math.ceil(trial.choices.length / trial.grid_columns) : trial.grid_rows;
        buttonGroupElement.style.gridTemplateColumns = `repeat(${n_cols}, 1fr)`;
        buttonGroupElement.style.gridTemplateRows = `repeat(${n_rows}, 1fr)`;
      } else if (trial.button_layout === "flex") {
        buttonGroupElement.classList.add("jspsych-btn-group-flex");
      }
      for (const [choiceIndex, choice] of trial.choices.entries()) {
        buttonGroupElement.insertAdjacentHTML("beforeend", trial.button_html(choice, choiceIndex));
        const buttonElement = buttonGroupElement.lastChild;
        buttonElement.dataset.choice = choiceIndex.toString();
        buttonElement.addEventListener("click", () => {
          after_response(choiceIndex);
        });
      }
      display_element.appendChild(buttonGroupElement);
      if (trial.prompt !== null) {
        display_element.insertAdjacentHTML("beforeend", trial.prompt);
      }
      var start_time = performance.now();
      var response = {
        rt: null,
        button: null
      };
      const end_trial = () => {
        var trial_data = {
          rt: response.rt,
          stimulus: trial.stimulus,
          response: response.button
        };
        this.jsPsych.finishTrial(trial_data);
      };
      function after_response(choice) {
        var end_time = performance.now();
        var rt = Math.round(end_time - start_time);
        response.button = parseInt(choice);
        response.rt = rt;
        stimulusElement.classList.add("responded");
        for (const button of buttonGroupElement.children) {
          button.setAttribute("disabled", "disabled");
        }
        if (trial.response_ends_trial) {
          end_trial();
        }
      }
      function enable_buttons() {
        var btns = document.querySelectorAll(".jspsych-image-button-response-button button");
        for (var i = 0; i < btns.length; i++) {
          btns[i].removeAttribute("disabled");
        }
      }
      function disable_buttons() {
        var btns = document.querySelectorAll(".jspsych-image-button-response-button button");
        for (var i = 0; i < btns.length; i++) {
          btns[i].setAttribute("disabled", "disabled");
        }
      }
      if (trial.enable_button_after > 0) {
        disable_buttons();
        this.jsPsych.pluginAPI.setTimeout(() => {
          enable_buttons();
        }, trial.enable_button_after);
      }
      if (trial.stimulus_duration !== null) {
        this.jsPsych.pluginAPI.setTimeout(() => {
          stimulusElement.style.visibility = "hidden";
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
    create_simulation_data(trial, simulation_options) {
      const default_data = {
        stimulus: trial.stimulus,
        rt: this.jsPsych.randomization.sampleExGaussian(500, 50, 1 / 150, true) + trial.enable_button_after,
        response: this.jsPsych.randomization.randomInt(0, trial.choices.length - 1)
      };
      const data = this.jsPsych.pluginAPI.mergeSimulationData(default_data, simulation_options);
      this.jsPsych.pluginAPI.ensureSimulationDataConsistency(trial, data);
      return data;
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
        this.jsPsych.pluginAPI.clickTarget(
          display_element.querySelector(
            `#jspsych-image-button-response-btngroup [data-choice="${data.response}"]`
          ),
          data.rt
        );
      }
    }
  }

  return ImageButtonResponsePlugin;

})(jsPsychModule);
