var jsPsychFullscreen = (function (jspsych) {
  'use strict';

  var _package = {
    name: "@jspsych/plugin-fullscreen",
    version: "2.0.0",
    description: "jsPsych plugin to toggle fullscreen mode in the browser",
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
      directory: "packages/plugin-fullscreen"
    },
    author: "Josh de Leeuw",
    license: "MIT",
    bugs: {
      url: "https://github.com/jspsych/jsPsych/issues"
    },
    homepage: "https://www.jspsych.org/latest/plugins/fullscreen",
    peerDependencies: {
      jspsych: ">=7.1.0"
    },
    devDependencies: {
      "@jspsych/config": "^3.0.0",
      "@jspsych/test-utils": "^1.2.0"
    }
  };

  const info = {
    name: "fullscreen",
    version: _package.version,
    parameters: {
      fullscreen_mode: {
        type: jspsych.ParameterType.BOOL,
        default: true,
        array: false
      },
      message: {
        type: jspsych.ParameterType.HTML_STRING,
        default: "<p>The experiment will switch to full screen mode when you press the button below</p>",
        array: false
      },
      button_label: {
        type: jspsych.ParameterType.STRING,
        default: "Continue",
        array: false
      },
      delay_after: {
        type: jspsych.ParameterType.INT,
        default: 1e3,
        array: false
      }
    },
    data: {
      success: {
        type: jspsych.ParameterType.BOOL,
        default: null,
        description: "True if the user entered fullscreen mode, false if not."
      },
      rt: {
        type: jspsych.ParameterType.INT,
        default: null,
        description: "Time in milliseconds until the user entered fullscreen mode."
      }
    }
  };
  class FullscreenPlugin {
    constructor(jsPsych) {
      this.jsPsych = jsPsych;
    }
    static info = info;
    rt = null;
    start_time = 0;
    trial(display_element, trial) {
      var keyboardNotAllowed = typeof Element !== "undefined" && "ALLOW_KEYBOARD_INPUT" in Element;
      if (keyboardNotAllowed) {
        this.endTrial(display_element, false, trial);
      } else {
        if (trial.fullscreen_mode) {
          this.showDisplay(display_element, trial);
        } else {
          this.exitFullScreen();
          this.endTrial(display_element, true, trial);
        }
      }
    }
    showDisplay(display_element, trial) {
      display_element.innerHTML = `
      ${trial.message}
      <button id="jspsych-fullscreen-btn" class="jspsych-btn">${trial.button_label}</button>
    `;
      display_element.querySelector("#jspsych-fullscreen-btn").addEventListener("click", () => {
        this.rt = Math.round(performance.now() - this.start_time);
        this.enterFullScreen();
        this.endTrial(display_element, true, trial);
      });
      this.start_time = performance.now();
    }
    endTrial(display_element, success, trial) {
      display_element.innerHTML = "";
      this.jsPsych.pluginAPI.setTimeout(() => {
        var trial_data = {
          success,
          rt: this.rt
        };
        this.jsPsych.finishTrial(trial_data);
      }, trial.delay_after);
    }
    enterFullScreen() {
      var element = document.documentElement;
      if (element.requestFullscreen) {
        element.requestFullscreen();
      } else if (element["mozRequestFullScreen"]) {
        element["mozRequestFullScreen"]();
      } else if (element["webkitRequestFullscreen"]) {
        element["webkitRequestFullscreen"]();
      } else if (element["msRequestFullscreen"]) {
        element["msRequestFullscreen"]();
      }
    }
    exitFullScreen() {
      if (document.fullscreenElement || document["mozFullScreenElement"] || document["webkitFullscreenElement"]) {
        if (document.exitFullscreen) {
          document.exitFullscreen();
        } else if (document["msExitFullscreen"]) {
          document["msExitFullscreen"]();
        } else if (document["mozCancelFullScreen"]) {
          document["mozCancelFullScreen"]();
        } else if (document["webkitExitFullscreen"]) {
          document["webkitExitFullscreen"]();
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
      const rt = this.jsPsych.randomization.sampleExGaussian(1e3, 100, 1 / 200, true);
      const default_data = {
        success: true,
        rt
      };
      const data = this.jsPsych.pluginAPI.mergeSimulationData(default_data, simulation_options);
      return data;
    }
    simulate_data_only(trial, simulation_options) {
      const data = this.create_simulation_data(trial, simulation_options);
      this.jsPsych.finishTrial(data);
    }
    simulate_visual(trial, simulation_options, load_callback) {
      const data = this.create_simulation_data(trial, simulation_options);
      const display_element = this.jsPsych.getDisplayElement();
      if (data.success === false) {
        this.endTrial(display_element, false, trial);
      } else {
        this.trial(display_element, trial);
        load_callback();
        this.jsPsych.pluginAPI.clickTarget(
          display_element.querySelector("#jspsych-fullscreen-btn"),
          data.rt
        );
      }
    }
  }

  return FullscreenPlugin;

})(jsPsychModule);
