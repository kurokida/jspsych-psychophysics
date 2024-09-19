var jsPsychImageSliderResponse = (function (jspsych) {
  'use strict';

  var _package = {
    name: "@jspsych/plugin-image-slider-response",
    version: "2.0.0",
    description: "a jspsych plugin for free response survey questions",
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
      directory: "packages/plugin-image-slider-response"
    },
    author: "Josh de Leeuw",
    license: "MIT",
    bugs: {
      url: "https://github.com/jspsych/jsPsych/issues"
    },
    homepage: "https://www.jspsych.org/latest/plugins/image-slider-response",
    peerDependencies: {
      jspsych: ">=7.1.0"
    },
    devDependencies: {
      "@jspsych/config": "^3.0.0",
      "@jspsych/test-utils": "^1.2.0"
    }
  };

  const info = {
    name: "image-slider-response",
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
        type: jspsych.ParameterType.STRING,
        default: [],
        array: true
      },
      slider_width: {
        type: jspsych.ParameterType.INT,
        default: null
      },
      button_label: {
        type: jspsych.ParameterType.STRING,
        default: "Continue",
        array: false
      },
      require_movement: {
        type: jspsych.ParameterType.BOOL,
        default: false
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
        type: jspsych.ParameterType.INT
      },
      rt: {
        type: jspsych.ParameterType.INT
      },
      slider_start: {
        type: jspsych.ParameterType.INT
      }
    }
  };
  class ImageSliderResponsePlugin {
    constructor(jsPsych) {
      this.jsPsych = jsPsych;
    }
    static info = info;
    trial(display_element, trial) {
      var height, width;
      var html;
      var half_thumb_width = 7.5;
      if (trial.render_on_canvas) {
        var image_drawn = false;
        if (display_element.hasChildNodes()) {
          while (display_element.firstChild) {
            display_element.removeChild(display_element.firstChild);
          }
        }
        var content_wrapper = document.createElement("div");
        content_wrapper.id = "jspsych-image-slider-response-wrapper";
        content_wrapper.style.margin = "100px 0px";
        var canvas = document.createElement("canvas");
        canvas.id = "jspsych-image-slider-response-stimulus";
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
        var slider_container = document.createElement("div");
        slider_container.classList.add("jspsych-image-slider-response-container");
        slider_container.style.position = "relative";
        slider_container.style.margin = "0 auto 3em auto";
        if (trial.slider_width !== null) {
          slider_container.style.width = trial.slider_width.toString() + "px";
        }
        html = '<input type="range" class="jspsych-slider" value="' + trial.slider_start + '" min="' + trial.min + '" max="' + trial.max + '" step="' + trial.step + '" id="jspsych-image-slider-response-response"></input>';
        html += "<div>";
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
        slider_container.innerHTML = html;
        content_wrapper.insertBefore(canvas, content_wrapper.firstElementChild);
        content_wrapper.insertBefore(slider_container, canvas.nextElementSibling);
        display_element.insertBefore(content_wrapper, null);
        if (img.complete && Number.isFinite(width) && Number.isFinite(height)) {
          ctx.drawImage(img, 0, 0, width, height);
          image_drawn = true;
        }
        if (trial.prompt !== null) {
          display_element.insertAdjacentHTML("beforeend", trial.prompt);
        }
        var submit_btn = document.createElement("button");
        submit_btn.id = "jspsych-image-slider-response-next";
        submit_btn.classList.add("jspsych-btn");
        submit_btn.disabled = trial.require_movement ? true : false;
        submit_btn.innerHTML = trial.button_label;
        display_element.insertBefore(submit_btn, display_element.nextElementSibling);
      } else {
        html = '<div id="jspsych-image-slider-response-wrapper" style="margin: 100px 0px;">';
        html += '<div id="jspsych-image-slider-response-stimulus">';
        html += '<img src="' + trial.stimulus + '" style="';
        if (trial.stimulus_height !== null) {
          html += "height:" + trial.stimulus_height + "px; ";
          if (trial.stimulus_width == null && trial.maintain_aspect_ratio) {
            html += "width: auto; ";
          }
        }
        if (trial.stimulus_width !== null) {
          html += "width:" + trial.stimulus_width + "px; ";
          if (trial.stimulus_height == null && trial.maintain_aspect_ratio) {
            html += "height: auto; ";
          }
        }
        html += '"></img>';
        html += "</div>";
        html += '<div class="jspsych-image-slider-response-container" style="position:relative; margin: 0 auto 3em auto; width:';
        if (trial.slider_width !== null) {
          html += trial.slider_width + "px;";
        } else {
          html += "auto;";
        }
        html += '">';
        html += '<input type="range" class="jspsych-slider" value="' + trial.slider_start + '" min="' + trial.min + '" max="' + trial.max + '" step="' + trial.step + '" id="jspsych-image-slider-response-response"></input>';
        html += "<div>";
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
          html += trial.prompt;
        }
        html += '<button id="jspsych-image-slider-response-next" class="jspsych-btn" ' + (trial.require_movement ? "disabled" : "") + ">" + trial.button_label + "</button>";
        display_element.innerHTML = html;
        var img = display_element.querySelector("img");
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
        response: null
      };
      if (trial.require_movement) {
        const enable_button = () => {
          display_element.querySelector(
            "#jspsych-image-slider-response-next"
          ).disabled = false;
        };
        display_element.querySelector("#jspsych-image-slider-response-response").addEventListener("mousedown", enable_button);
        display_element.querySelector("#jspsych-image-slider-response-response").addEventListener("touchstart", enable_button);
        display_element.querySelector("#jspsych-image-slider-response-response").addEventListener("change", enable_button);
      }
      const end_trial = () => {
        var trialdata = {
          rt: response.rt,
          stimulus: trial.stimulus,
          slider_start: trial.slider_start,
          response: response.response
        };
        this.jsPsych.finishTrial(trialdata);
      };
      display_element.querySelector("#jspsych-image-slider-response-next").addEventListener("click", () => {
        var endTime = performance.now();
        response.rt = Math.round(endTime - startTime);
        response.response = display_element.querySelector(
          "#jspsych-image-slider-response-response"
        ).valueAsNumber;
        if (trial.response_ends_trial) {
          end_trial();
        } else {
          display_element.querySelector(
            "#jspsych-image-slider-response-next"
          ).disabled = true;
        }
      });
      if (trial.stimulus_duration !== null) {
        this.jsPsych.pluginAPI.setTimeout(() => {
          display_element.querySelector(
            "#jspsych-image-slider-response-stimulus"
          ).style.visibility = "hidden";
        }, trial.stimulus_duration);
      }
      if (trial.trial_duration !== null) {
        this.jsPsych.pluginAPI.setTimeout(() => {
          end_trial();
        }, trial.trial_duration);
      }
      var startTime = performance.now();
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
        rt: this.jsPsych.randomization.sampleExGaussian(500, 50, 1 / 150, true)
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
        const el = display_element.querySelector("input[type='range']");
        setTimeout(() => {
          this.jsPsych.pluginAPI.clickTarget(el);
          el.valueAsNumber = data.response;
        }, data.rt / 2);
        this.jsPsych.pluginAPI.clickTarget(display_element.querySelector("button"), data.rt);
      }
    }
  }

  return ImageSliderResponsePlugin;

})(jsPsychModule);
