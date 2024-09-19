var jsPsychPreload = (function (jspsych) {
  'use strict';

  var _package = {
    name: "@jspsych/plugin-preload",
    version: "2.0.0",
    description: "",
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
      directory: "packages/plugin-preload"
    },
    author: "Josh de Leeuw",
    license: "MIT",
    bugs: {
      url: "https://github.com/jspsych/jsPsych/issues"
    },
    homepage: "https://www.jspsych.org/latest/plugins/preload",
    peerDependencies: {
      jspsych: ">=7.1.0"
    },
    devDependencies: {
      "@jspsych/config": "^3.0.0",
      "@jspsych/plugin-audio-keyboard-response": "*",
      "@jspsych/plugin-image-keyboard-response": "*",
      "@jspsych/plugin-video-keyboard-response": "*"
    }
  };

  const info = {
    name: "preload",
    version: _package.version,
    parameters: {
      auto_preload: {
        type: jspsych.ParameterType.BOOL,
        default: false
      },
      trials: {
        type: jspsych.ParameterType.TIMELINE,
        default: []
      },
      images: {
        type: jspsych.ParameterType.STRING,
        default: [],
        array: true
      },
      audio: {
        type: jspsych.ParameterType.STRING,
        default: [],
        array: true
      },
      video: {
        type: jspsych.ParameterType.STRING,
        default: [],
        array: true
      },
      message: {
        type: jspsych.ParameterType.HTML_STRING,
        default: null
      },
      show_progress_bar: {
        type: jspsych.ParameterType.BOOL,
        default: true
      },
      continue_after_error: {
        type: jspsych.ParameterType.BOOL,
        default: false
      },
      error_message: {
        type: jspsych.ParameterType.HTML_STRING,
        default: "The experiment failed to load."
      },
      show_detailed_errors: {
        type: jspsych.ParameterType.BOOL,
        default: false
      },
      max_load_time: {
        type: jspsych.ParameterType.INT,
        default: null
      },
      on_error: {
        type: jspsych.ParameterType.FUNCTION,
        default: null
      },
      on_success: {
        type: jspsych.ParameterType.FUNCTION,
        default: null
      }
    },
    data: {
      success: {
        type: jspsych.ParameterType.BOOL
      },
      timeout: {
        type: jspsych.ParameterType.BOOL
      },
      failed_images: {
        type: jspsych.ParameterType.STRING,
        array: true
      },
      failed_audio: {
        type: jspsych.ParameterType.STRING,
        array: true
      },
      failed_video: {
        type: jspsych.ParameterType.STRING,
        array: true
      }
    }
  };
  class PreloadPlugin {
    constructor(jsPsych) {
      this.jsPsych = jsPsych;
    }
    static info = info;
    trial(display_element, trial) {
      var success = null;
      var timeout = false;
      var failed_images = [];
      var failed_audio = [];
      var failed_video = [];
      var detailed_errors = [];
      var in_safe_mode = this.jsPsych.getSafeModeStatus();
      var images = [];
      var audio = [];
      var video = [];
      if (trial.auto_preload) {
        var experiment_timeline = this.jsPsych.getTimeline();
        var auto_preload = this.jsPsych.pluginAPI.getAutoPreloadList(experiment_timeline);
        images = images.concat(auto_preload.images);
        audio = audio.concat(auto_preload.audio);
        video = video.concat(auto_preload.video);
      }
      if (trial.trials.length > 0) {
        var trial_preloads = this.jsPsych.pluginAPI.getAutoPreloadList(trial.trials);
        images = images.concat(trial_preloads.images);
        audio = audio.concat(trial_preloads.audio);
        video = video.concat(trial_preloads.video);
      }
      images = images.concat(trial.images);
      audio = audio.concat(trial.audio);
      video = video.concat(trial.video);
      images = this.jsPsych.utils.unique(images.flat());
      audio = this.jsPsych.utils.unique(audio.flat());
      video = this.jsPsych.utils.unique(video.flat());
      if (in_safe_mode) {
        video = [];
      }
      var html = "";
      if (trial.message !== null) {
        html += trial.message;
      }
      if (trial.show_progress_bar) {
        html += `
            <div id='jspsych-loading-progress-bar-container' style='height: 10px; width: 300px; background-color: #ddd; margin: auto;'>
              <div id='jspsych-loading-progress-bar' style='height: 10px; width: 0%; background-color: #777;'></div>
            </div>`;
      }
      display_element.innerHTML = html;
      const update_loading_progress_bar = () => {
        loaded++;
        if (trial.show_progress_bar) {
          var percent_loaded = loaded / total_n * 100;
          var preload_progress_bar = display_element.querySelector(
            "#jspsych-loading-progress-bar"
          );
          if (preload_progress_bar !== null) {
            preload_progress_bar.style.width = percent_loaded + "%";
          }
        }
      };
      const on_success = () => {
        if (typeof timeout !== "undefined" && timeout === false) {
          this.jsPsych.pluginAPI.clearAllTimeouts();
          this.jsPsych.pluginAPI.cancelPreloads();
          success = true;
          end_trial();
        }
      };
      const on_timeout = () => {
        this.jsPsych.pluginAPI.cancelPreloads();
        if (typeof success !== "undefined" && (success === false || success === null)) {
          timeout = true;
          if (loaded_success < total_n) {
            success = false;
          }
          after_error("timeout");
          detailed_errors.push(
            "<p><strong>Loading timed out.</strong><br>Consider compressing your stimuli files, loading your files in smaller batches,<br>and/or increasing the <i>max_load_time</i> parameter.</p>"
          );
          if (trial.continue_after_error) {
            end_trial();
          } else {
            stop_with_error_message();
          }
        }
      };
      const stop_with_error_message = () => {
        this.jsPsych.pluginAPI.clearAllTimeouts();
        this.jsPsych.pluginAPI.cancelPreloads();
        display_element.innerHTML = trial.error_message;
        if (trial.show_detailed_errors) {
          display_element.innerHTML += "<p><strong>Error details:</strong></p>";
          detailed_errors.forEach((e) => {
            display_element.innerHTML += e;
          });
        }
      };
      const end_trial = () => {
        var trial_data = {
          success,
          timeout,
          failed_images,
          failed_audio,
          failed_video
        };
        this.jsPsych.finishTrial(trial_data);
      };
      if (trial.max_load_time !== null) {
        this.jsPsych.pluginAPI.setTimeout(on_timeout, trial.max_load_time);
      }
      var total_n = images.length + audio.length + video.length;
      var loaded = 0;
      var loaded_success = 0;
      if (total_n == 0) {
        on_success();
      } else {
        const load_video = (cb) => {
          this.jsPsych.pluginAPI.preloadVideo(video, cb, file_loading_success, file_loading_error);
        };
        const load_audio = (cb) => {
          this.jsPsych.pluginAPI.preloadAudio(audio, cb, file_loading_success, file_loading_error);
        };
        const load_images = (cb) => {
          this.jsPsych.pluginAPI.preloadImages(images, cb, file_loading_success, file_loading_error);
        };
        if (video.length > 0) {
          load_video(() => {
          });
        }
        if (audio.length > 0) {
          load_audio(() => {
          });
        }
        if (images.length > 0) {
          load_images(() => {
          });
        }
      }
      function file_loading_error(e) {
        update_loading_progress_bar();
        if (success == null) {
          success = false;
        }
        var source = "unknown file";
        if (e.source) {
          source = e.source;
        }
        if (e.error && e.error.path && e.error.path.length > 0) {
          if (e.error.path[0].localName == "img") {
            failed_images.push(source);
          } else if (e.error.path[0].localName == "audio") {
            failed_audio.push(source);
          } else if (e.error.path[0].localName == "video") {
            failed_video.push(source);
          }
        }
        var err_msg = "<p><strong>Error loading file: " + source + "</strong><br>";
        if (e.error.statusText) {
          err_msg += "File request response status: " + e.error.statusText + "<br>";
        }
        if (e.error == "404") {
          err_msg += "404 - file not found.<br>";
        }
        if (typeof e.error.loaded !== "undefined" && e.error.loaded !== null && e.error.loaded !== 0) {
          err_msg += e.error.loaded + " bytes transferred.";
        } else {
          err_msg += "File did not begin loading. Check that file path is correct and reachable by the browser,<br>and that loading is not blocked by cross-origin resource sharing (CORS) errors.";
        }
        err_msg += "</p>";
        detailed_errors.push(err_msg);
        after_error(source);
        if (loaded == total_n) {
          if (trial.continue_after_error) {
            end_trial();
          } else {
            stop_with_error_message();
          }
        }
      }
      function file_loading_success(source) {
        update_loading_progress_bar();
        after_success(source);
        loaded_success++;
        if (loaded_success == total_n) {
          on_success();
        } else if (loaded == total_n) {
          if (trial.continue_after_error) {
            end_trial();
          } else {
            stop_with_error_message();
          }
        }
      }
      function after_error(source) {
        if (trial.on_error !== null) {
          trial.on_error(source);
        }
      }
      function after_success(source) {
        if (trial.on_success !== null) {
          trial.on_success(source);
        }
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
        success: true,
        timeout: false,
        failed_images: [],
        failed_audio: [],
        failed_video: []
      };
      const data = this.jsPsych.pluginAPI.mergeSimulationData(default_data, simulation_options);
      return data;
    }
    simulate_data_only(trial, simulation_options) {
      const data = this.create_simulation_data(trial, simulation_options);
      this.jsPsych.finishTrial(data);
    }
    simulate_visual(trial, simulation_options, load_callback) {
      const display_element = this.jsPsych.getDisplayElement();
      this.trial(display_element, trial);
      load_callback();
    }
  }

  return PreloadPlugin;

})(jsPsychModule);
