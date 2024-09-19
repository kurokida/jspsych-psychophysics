var jsPsychVideoKeyboardResponse = (function (jspsych) {
  'use strict';

  var _package = {
    name: "@jspsych/plugin-video-keyboard-response",
    version: "2.0.0",
    description: "jsPsych plugin for playing a video file and getting a keyboard response",
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
      directory: "packages/plugin-video-keyboard-response"
    },
    author: "Josh de Leeuw",
    license: "MIT",
    bugs: {
      url: "https://github.com/jspsych/jsPsych/issues"
    },
    homepage: "https://www.jspsych.org/latest/plugins/video-keyboard-response",
    peerDependencies: {
      jspsych: ">=7.1.0"
    },
    devDependencies: {
      "@jspsych/config": "^3.0.0",
      "@jspsych/test-utils": "^1.2.0"
    }
  };

  const info = {
    name: "video-keyboard-response",
    version: _package.version,
    parameters: {
      stimulus: {
        type: jspsych.ParameterType.VIDEO,
        pretty_name: "Video",
        default: void 0,
        array: true
      },
      choices: {
        type: jspsych.ParameterType.KEYS,
        pretty_name: "Choices",
        default: "ALL_KEYS"
      },
      prompt: {
        type: jspsych.ParameterType.HTML_STRING,
        pretty_name: "Prompt",
        default: null
      },
      width: {
        type: jspsych.ParameterType.INT,
        pretty_name: "Width",
        default: ""
      },
      height: {
        type: jspsych.ParameterType.INT,
        pretty_name: "Height",
        default: ""
      },
      autoplay: {
        type: jspsych.ParameterType.BOOL,
        pretty_name: "Autoplay",
        default: true
      },
      controls: {
        type: jspsych.ParameterType.BOOL,
        pretty_name: "Controls",
        default: false
      },
      start: {
        type: jspsych.ParameterType.FLOAT,
        pretty_name: "Start",
        default: null
      },
      stop: {
        type: jspsych.ParameterType.FLOAT,
        pretty_name: "Stop",
        default: null
      },
      rate: {
        type: jspsych.ParameterType.FLOAT,
        pretty_name: "Rate",
        default: 1
      },
      trial_ends_after_video: {
        type: jspsych.ParameterType.BOOL,
        pretty_name: "End trial after video finishes",
        default: false
      },
      trial_duration: {
        type: jspsych.ParameterType.INT,
        pretty_name: "Trial duration",
        default: null
      },
      response_ends_trial: {
        type: jspsych.ParameterType.BOOL,
        pretty_name: "Response ends trial",
        default: true
      },
      response_allowed_while_playing: {
        type: jspsych.ParameterType.BOOL,
        pretty_name: "Response allowed while playing",
        default: true
      }
    },
    data: {
      response: {
        type: jspsych.ParameterType.STRING
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
  class VideoKeyboardResponsePlugin {
    constructor(jsPsych) {
      this.jsPsych = jsPsych;
    }
    static info = info;
    trial(display_element, trial) {
      if (!Array.isArray(trial.stimulus)) {
        throw new Error(`
        The stimulus property for the video-keyboard-response plugin must be an array
        of files. See https://www.jspsych.org/latest/plugins/video-keyboard-response/#parameters
      `);
      }
      var video_html = "<div>";
      video_html += '<video id="jspsych-video-keyboard-response-stimulus"';
      if (trial.width) {
        video_html += ' width="' + trial.width + '"';
      }
      if (trial.height) {
        video_html += ' height="' + trial.height + '"';
      }
      if (trial.autoplay && trial.start == null) {
        video_html += " autoplay ";
      }
      if (trial.controls) {
        video_html += " controls ";
      }
      if (trial.start !== null) {
        video_html += ' style="visibility: hidden;"';
      }
      video_html += ">";
      var video_preload_blob = this.jsPsych.pluginAPI.getVideoBuffer(trial.stimulus[0]);
      if (!video_preload_blob) {
        for (var i = 0; i < trial.stimulus.length; i++) {
          var file_name = trial.stimulus[i];
          if (file_name.indexOf("?") > -1) {
            file_name = file_name.substring(0, file_name.indexOf("?"));
          }
          var type = file_name.substr(file_name.lastIndexOf(".") + 1);
          type = type.toLowerCase();
          if (type == "mov") {
            console.warn(
              "Warning: video-keyboard-response plugin does not reliably support .mov files."
            );
          }
          video_html += '<source src="' + file_name + '" type="video/' + type + '">';
        }
      }
      video_html += "</video>";
      video_html += "</div>";
      if (trial.prompt !== null) {
        video_html += trial.prompt;
      }
      display_element.innerHTML = video_html;
      var video_element = display_element.querySelector(
        "#jspsych-video-keyboard-response-stimulus"
      );
      if (video_preload_blob) {
        video_element.src = video_preload_blob;
      }
      video_element.onended = () => {
        if (trial.trial_ends_after_video) {
          end_trial();
        }
        if (trial.response_allowed_while_playing == false && !trial.trial_ends_after_video) {
          this.jsPsych.pluginAPI.getKeyboardResponse({
            callback_function: after_response,
            valid_responses: trial.choices,
            rt_method: "performance",
            persist: false,
            allow_held_key: false
          });
        }
      };
      video_element.playbackRate = trial.rate;
      if (trial.start !== null) {
        video_element.pause();
        video_element.onseeked = () => {
          video_element.style.visibility = "visible";
          video_element.muted = false;
          if (trial.autoplay) {
            video_element.play();
          } else {
            video_element.pause();
          }
          video_element.onseeked = () => {
          };
        };
        video_element.onplaying = () => {
          video_element.currentTime = trial.start;
          video_element.onplaying = () => {
          };
        };
        video_element.muted = true;
        video_element.play();
      }
      let stopped = false;
      if (trial.stop !== null) {
        video_element.addEventListener("timeupdate", (e) => {
          var currenttime = video_element.currentTime;
          if (currenttime >= trial.stop) {
            if (!trial.response_allowed_while_playing) {
              this.jsPsych.pluginAPI.getKeyboardResponse({
                callback_function: after_response,
                valid_responses: trial.choices,
                rt_method: "performance",
                persist: false,
                allow_held_key: false
              });
            }
            video_element.pause();
            if (trial.trial_ends_after_video && !stopped) {
              stopped = true;
              end_trial();
            }
          }
        });
      }
      var response = {
        rt: null,
        key: null
      };
      const end_trial = () => {
        this.jsPsych.pluginAPI.cancelAllKeyboardResponses();
        display_element.querySelector("#jspsych-video-keyboard-response-stimulus").pause();
        display_element.querySelector(
          "#jspsych-video-keyboard-response-stimulus"
        ).onended = () => {
        };
        var trial_data = {
          rt: response.rt,
          stimulus: trial.stimulus,
          response: response.key
        };
        this.jsPsych.finishTrial(trial_data);
      };
      var after_response = (info2) => {
        display_element.querySelector("#jspsych-video-keyboard-response-stimulus").className += " responded";
        if (response.key == null) {
          response = info2;
        }
        if (trial.response_ends_trial) {
          end_trial();
        }
      };
      if (trial.choices != "NO_KEYS" && trial.response_allowed_while_playing) {
        this.jsPsych.pluginAPI.getKeyboardResponse({
          callback_function: after_response,
          valid_responses: trial.choices,
          rt_method: "performance",
          persist: false,
          allow_held_key: false
        });
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
          this.jsPsych.pluginAPI.pressKey(data.response, data.rt);
        }
      };
      if (!trial.response_allowed_while_playing) {
        video_element.addEventListener("ended", respond);
      } else {
        respond();
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

  return VideoKeyboardResponsePlugin;

})(jsPsychModule);
