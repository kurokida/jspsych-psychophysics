var jsPsychVideoButtonResponse = (function (jspsych) {
  'use strict';

  var _package = {
    name: "@jspsych/plugin-video-button-response",
    version: "2.0.0",
    description: "jsPsych plugin for playing a video file and getting a button response",
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
      test: "jest --passWithNoTests",
      "test:watch": "npm test -- --watch",
      tsc: "tsc",
      build: "rollup --config",
      "build:watch": "npm run build -- --watch"
    },
    repository: {
      type: "git",
      url: "git+https://github.com/jspsych/jsPsych.git",
      directory: "packages/plugin-video-button-response"
    },
    author: "Josh de Leeuw",
    license: "MIT",
    bugs: {
      url: "https://github.com/jspsych/jsPsych/issues"
    },
    homepage: "https://www.jspsych.org/latest/plugins/video-button-response",
    peerDependencies: {
      jspsych: ">=7.1.0"
    },
    devDependencies: {
      "@jspsych/config": "^3.0.0",
      "@jspsych/test-utils": "^1.2.0"
    }
  };

  const info = {
    name: "video-button-response",
    version: _package.version,
    parameters: {
      stimulus: {
        type: jspsych.ParameterType.VIDEO,
        default: void 0,
        array: true
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
      width: {
        type: jspsych.ParameterType.INT,
        default: ""
      },
      height: {
        type: jspsych.ParameterType.INT,
        default: ""
      },
      autoplay: {
        type: jspsych.ParameterType.BOOL,
        pretty_name: "Autoplay",
        default: true
      },
      controls: {
        type: jspsych.ParameterType.BOOL,
        default: false
      },
      start: {
        type: jspsych.ParameterType.FLOAT,
        default: null
      },
      stop: {
        type: jspsych.ParameterType.FLOAT,
        default: null
      },
      rate: {
        type: jspsych.ParameterType.FLOAT,
        default: 1
      },
      trial_ends_after_video: {
        type: jspsych.ParameterType.BOOL,
        default: false
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
      response_allowed_while_playing: {
        type: jspsych.ParameterType.BOOL,
        default: true
      },
      enable_button_after: {
        type: jspsych.ParameterType.INT,
        default: 0
      }
    },
    data: {
      response: {
        type: jspsych.ParameterType.INT
      },
      rt: {
        type: jspsych.ParameterType.INT
      },
      stimulus: {
        type: jspsych.ParameterType.STRING,
        array: true
      }
    }
  };
  class VideoButtonResponsePlugin {
    constructor(jsPsych) {
      this.jsPsych = jsPsych;
    }
    static info = info;
    trial(display_element, trial) {
      const stimulusWrapper = document.createElement("div");
      display_element.appendChild(stimulusWrapper);
      const videoElement = document.createElement("video");
      stimulusWrapper.appendChild(videoElement);
      videoElement.id = "jspsych-video-button-response-stimulus";
      if (trial.width) {
        videoElement.width = trial.width;
      }
      if (trial.height) {
        videoElement.height = trial.height;
      }
      videoElement.controls = trial.controls;
      videoElement.autoplay = trial.autoplay && trial.start == null;
      if (trial.start !== null) {
        videoElement.style.visibility = "hidden";
      }
      const videoPreloadBlob = this.jsPsych.pluginAPI.getVideoBuffer(trial.stimulus[0]);
      if (!videoPreloadBlob) {
        for (let filename of trial.stimulus) {
          if (filename.indexOf("?") > -1) {
            filename = filename.substring(0, filename.indexOf("?"));
          }
          const type = filename.substring(filename.lastIndexOf(".") + 1).toLowerCase();
          if (type === "mov") {
            console.warn(
              "Warning: video-button-response plugin does not reliably support .mov files."
            );
          }
          const sourceElement = document.createElement("source");
          sourceElement.src = filename;
          sourceElement.type = "video/" + type;
          videoElement.appendChild(sourceElement);
        }
      }
      const buttonGroupElement = document.createElement("div");
      buttonGroupElement.id = "jspsych-video-button-response-btngroup";
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
      if (videoPreloadBlob) {
        videoElement.src = videoPreloadBlob;
      }
      videoElement.onended = () => {
        if (trial.trial_ends_after_video) {
          end_trial();
        } else if (!trial.response_allowed_while_playing) {
          enable_buttons();
        }
      };
      videoElement.playbackRate = trial.rate;
      if (trial.start !== null) {
        videoElement.pause();
        videoElement.onseeked = () => {
          videoElement.style.visibility = "visible";
          videoElement.muted = false;
          if (trial.autoplay) {
            videoElement.play();
          } else {
            videoElement.pause();
          }
          videoElement.onseeked = () => {
          };
        };
        videoElement.onplaying = () => {
          videoElement.currentTime = trial.start;
          videoElement.onplaying = () => {
          };
        };
        videoElement.muted = true;
        videoElement.play();
      }
      let stopped = false;
      if (trial.stop !== null) {
        videoElement.addEventListener("timeupdate", (e) => {
          if (videoElement.currentTime >= trial.stop) {
            if (!trial.response_allowed_while_playing) {
              if (trial.enable_button_after > 0) {
                enable_buttons_delayed(trial.enable_button_after);
              } else {
                enable_buttons();
              }
            }
            videoElement.pause();
            if (trial.trial_ends_after_video && !stopped) {
              stopped = true;
              end_trial();
            }
          }
        });
      }
      const enable_buttons_delayed = (delay) => {
        this.jsPsych.pluginAPI.setTimeout(enable_buttons, delay);
      };
      if (trial.response_allowed_while_playing) {
        disable_buttons();
        if (trial.enable_button_after > 0) {
          enable_buttons_delayed(trial.enable_button_after);
        } else {
          enable_buttons();
        }
      } else {
        disable_buttons();
      }
      var response = {
        rt: null,
        button: null
      };
      const end_trial = () => {
        videoElement.pause();
        videoElement.onended = () => {
        };
        const trial_data = {
          rt: response.rt,
          stimulus: trial.stimulus,
          response: response.button
        };
        this.jsPsych.finishTrial(trial_data);
      };
      function after_response(choice) {
        var end_time = performance.now();
        var rt = Math.round(end_time - start_time);
        response.button = choice;
        response.rt = rt;
        videoElement.classList.add("responded");
        disable_buttons();
        if (trial.response_ends_trial) {
          end_trial();
        }
      }
      function disable_buttons() {
        for (const button of buttonGroupElement.children) {
          button.setAttribute("disabled", "disabled");
        }
      }
      function enable_buttons() {
        for (const button of buttonGroupElement.children) {
          button.removeAttribute("disabled");
        }
      }
      if (trial.trial_duration !== null) {
        this.jsPsych.pluginAPI.setTimeout(end_trial, trial.trial_duration);
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
      const video_element = display_element.querySelector(
        "#jspsych-video-button-response-stimulus"
      );
      const respond = () => {
        if (data.rt !== null) {
          this.jsPsych.pluginAPI.clickTarget(
            display_element.querySelector(
              `#jspsych-video-button-response-btngroup [data-choice="${data.response}"]`
            ),
            data.rt
          );
        }
      };
      if (!trial.response_allowed_while_playing) {
        video_element.addEventListener("ended", respond);
      } else {
        respond();
      }
    }
  }

  return VideoButtonResponsePlugin;

})(jsPsychModule);
