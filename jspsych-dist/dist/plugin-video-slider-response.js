var jsPsychVideoSliderResponse = (function (jspsych) {
  'use strict';

  var _package = {
    name: "@jspsych/plugin-video-slider-response",
    version: "2.0.0",
    description: "jsPsych plugin for playing a video file and getting a slider response",
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
      directory: "packages/plugin-video-slider-response"
    },
    author: "Josh de Leeuw",
    license: "MIT",
    bugs: {
      url: "https://github.com/jspsych/jsPsych/issues"
    },
    homepage: "https://www.jspsych.org/latest/plugins/video-slider-response",
    peerDependencies: {
      jspsych: ">=7.1.0"
    },
    devDependencies: {
      "@jspsych/config": "^3.0.0",
      "@jspsych/test-utils": "^1.2.0"
    }
  };

  const info = {
    name: "video-slider-response",
    version: _package.version,
    parameters: {
      stimulus: {
        type: jspsych.ParameterType.VIDEO,
        default: void 0,
        array: true
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
      min: {
        type: jspsych.ParameterType.INT,
        default: 0
      },
      max: {
        type: jspsych.ParameterType.INT,
        default: 100
      },
      slider_start: {
        type: jspsych.ParameterType.INT,
        default: 50
      },
      step: {
        type: jspsych.ParameterType.INT,
        default: 1
      },
      labels: {
        type: jspsych.ParameterType.HTML_STRING,
        default: [],
        array: true
      },
      slider_width: {
        type: jspsych.ParameterType.INT,
        default: null
      },
      button_label: {
        type: jspsych.ParameterType.STRING,
        default: "Continue"
      },
      require_movement: {
        type: jspsych.ParameterType.BOOL,
        default: false
      },
      trial_ends_after_video: {
        type: jspsych.ParameterType.BOOL,
        default: false
      },
      trial_duration: {
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
      },
      slider_start: {
        type: jspsych.ParameterType.INT
      },
      start: {
        type: jspsych.ParameterType.FLOAT
      }
    }
  };
  class VideoSliderResponsePlugin {
    constructor(jsPsych) {
      this.jsPsych = jsPsych;
    }
    static info = info;
    trial(display_element, trial) {
      if (!Array.isArray(trial.stimulus)) {
        throw new Error(`
        The stimulus property for the video-slider-response plugin must be an array
        of files. See https://www.jspsych.org/latest/plugins/video-slider-response/#parameters
      `);
      }
      var half_thumb_width = 7.5;
      var video_html = '<video id="jspsych-video-slider-response-stimulus-video"';
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
              "Warning: video-slider-response plugin does not reliably support .mov files."
            );
          }
          video_html += '<source src="' + file_name + '" type="video/' + type + '">';
        }
      }
      video_html += "</video>";
      var html = '<div id="jspsych-video-slider-response-wrapper" style="margin: 100px 0px;">';
      html += '<div id="jspsych-video-slider-response-stimulus">' + video_html + "</div>";
      html += '<div class="jspsych-video-slider-response-container" style="position:relative; margin: 0 auto 3em auto; width:';
      if (trial.slider_width !== null) {
        html += trial.slider_width + "px;";
      } else {
        html += "auto;";
      }
      html += '">';
      html += '<input type="range" class="jspsych-slider" value="' + trial.slider_start + '" min="' + trial.min + '" max="' + trial.max + '" step="' + trial.step + '" id="jspsych-video-slider-response-response"';
      if (!trial.response_allowed_while_playing) {
        html += " disabled";
      }
      html += "></input><div>";
      for (var j = 0; j < trial.labels.length; j++) {
        var label_width_perc = 100 / (trial.labels.length - 1);
        var percent_of_range = j * (100 / (trial.labels.length - 1));
        var percent_dist_from_center = (percent_of_range - 50) / 50 * 100;
        var offset = percent_dist_from_center * half_thumb_width / 100;
        html += '<div style="border: 1px solid transparent; display: inline-block; position: absolute; left:calc(' + percent_of_range + "% - (" + label_width_perc + "% / 2) - " + offset + "px); text-align: center; width: " + label_width_perc + '%;">';
        html += '<span style="text-align: center; font-size: 80%;">' + trial.labels[j] + "</span>";
        html += "</div>";
      }
      html += "</div>";
      html += "</div>";
      html += "</div>";
      if (trial.prompt !== null) {
        html += "<div>" + trial.prompt + "</div>";
      }
      var next_disabled_attribute = "";
      if (trial.require_movement || !trial.response_allowed_while_playing) {
        next_disabled_attribute = "disabled";
      }
      html += '<button id="jspsych-video-slider-response-next" class="jspsych-btn" ' + next_disabled_attribute + ">" + trial.button_label + "</button>";
      display_element.innerHTML = html;
      var video_element = display_element.querySelector(
        "#jspsych-video-slider-response-stimulus-video"
      );
      if (video_preload_blob) {
        video_element.src = video_preload_blob;
      }
      video_element.onended = () => {
        if (trial.trial_ends_after_video) {
          end_trial();
        } else if (!trial.response_allowed_while_playing) {
          enable_slider();
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
            video_element.pause();
            if (trial.trial_ends_after_video && !stopped) {
              stopped = true;
              end_trial();
            }
            if (!trial.response_allowed_while_playing) {
              enable_slider();
            }
          }
        });
      }
      if (trial.require_movement) {
        const enable_button = () => {
          display_element.querySelector(
            "#jspsych-video-slider-response-next"
          ).disabled = false;
        };
        display_element.querySelector("#jspsych-video-slider-response-response").addEventListener("mousedown", enable_button);
        display_element.querySelector("#jspsych-video-slider-response-response").addEventListener("touchstart", enable_button);
        display_element.querySelector("#jspsych-video-slider-response-response").addEventListener("change", enable_button);
      }
      var startTime = performance.now();
      var response = {
        rt: null,
        response: null
      };
      const end_trial = () => {
        display_element.querySelector("#jspsych-video-slider-response-stimulus-video").pause();
        display_element.querySelector(
          "#jspsych-video-slider-response-stimulus-video"
        ).onended = () => {
        };
        var trial_data = {
          rt: response.rt,
          stimulus: trial.stimulus,
          start: trial.start,
          slider_start: trial.slider_start,
          response: response.response
        };
        this.jsPsych.finishTrial(trial_data);
      };
      display_element.querySelector("#jspsych-video-slider-response-next").addEventListener("click", () => {
        var endTime = performance.now();
        response.rt = Math.round(endTime - startTime);
        response.response = display_element.querySelector(
          "#jspsych-video-slider-response-response"
        ).valueAsNumber;
        if (trial.response_ends_trial) {
          end_trial();
        } else {
          display_element.querySelector(
            "#jspsych-video-slider-response-next"
          ).disabled = true;
        }
      });
      function enable_slider() {
        document.querySelector("#jspsych-video-slider-response-response").disabled = false;
        if (!trial.require_movement) {
          document.querySelector("#jspsych-video-slider-response-next").disabled = false;
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
        slider_start: trial.slider_start,
        response: this.jsPsych.randomization.randomInt(trial.min, trial.max),
        rt: this.jsPsych.randomization.sampleExGaussian(500, 50, 1 / 150, true),
        start: trial.start
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
          const el = display_element.querySelector("input[type='range']");
          setTimeout(() => {
            this.jsPsych.pluginAPI.clickTarget(el);
            el.valueAsNumber = data.response;
          }, data.rt / 2);
          this.jsPsych.pluginAPI.clickTarget(display_element.querySelector("button"), data.rt);
        }
      };
      if (!trial.response_allowed_while_playing) {
        video_element.addEventListener("ended", respond);
      } else {
        respond();
      }
    }
  }

  return VideoSliderResponsePlugin;

})(jsPsychModule);
