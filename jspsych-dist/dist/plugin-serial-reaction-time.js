var jsPsychSerialReactionTime = (function (jspsych) {
  'use strict';

  var _package = {
    name: "@jspsych/plugin-serial-reaction-time",
    version: "2.0.0",
    description: "jsPsych plugin for running a serial reaction time task",
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
      directory: "packages/plugin-serial-reaction-time"
    },
    author: "Josh de Leeuw",
    license: "MIT",
    bugs: {
      url: "https://github.com/jspsych/jsPsych/issues"
    },
    homepage: "https://www.jspsych.org/latest/plugins/serial-reaction-time",
    peerDependencies: {
      jspsych: ">=7.1.0"
    },
    devDependencies: {
      "@jspsych/config": "^3.0.0",
      "@jspsych/test-utils": "^1.2.0"
    }
  };

  const info = {
    name: "serial-reaction-time",
    version: _package.version,
    parameters: {
      grid: {
        type: jspsych.ParameterType.BOOL,
        array: true,
        default: [[1, 1, 1, 1]]
      },
      target: {
        type: jspsych.ParameterType.INT,
        array: true,
        default: void 0
      },
      choices: {
        type: jspsych.ParameterType.KEYS,
        array: true,
        default: [["3", "5", "7", "9"]]
      },
      grid_square_size: {
        type: jspsych.ParameterType.INT,
        default: 100
      },
      target_color: {
        type: jspsych.ParameterType.STRING,
        default: "#999"
      },
      response_ends_trial: {
        type: jspsych.ParameterType.BOOL,
        default: true
      },
      pre_target_duration: {
        type: jspsych.ParameterType.INT,
        default: 0
      },
      trial_duration: {
        type: jspsych.ParameterType.INT,
        default: null
      },
      show_response_feedback: {
        type: jspsych.ParameterType.BOOL,
        default: false
      },
      feedback_duration: {
        type: jspsych.ParameterType.INT,
        default: 200
      },
      fade_duration: {
        type: jspsych.ParameterType.INT,
        default: null
      },
      prompt: {
        type: jspsych.ParameterType.HTML_STRING,
        default: null,
        no_function: false
      }
    },
    data: {
      grid: {
        type: jspsych.ParameterType.COMPLEX,
        array: true
      },
      target: {
        type: jspsych.ParameterType.COMPLEX,
        array: true
      },
      response: {
        type: jspsych.ParameterType.STRING,
        array: true
      },
      rt: {
        type: jspsych.ParameterType.INT
      },
      correct: {
        type: jspsych.ParameterType.BOOL
      }
    }
  };
  class SerialReactionTimePlugin {
    constructor(jsPsych) {
      this.jsPsych = jsPsych;
    }
    static info = info;
    trial(display_element, trial) {
      var flat_choices = trial.choices.flat();
      while (flat_choices.indexOf("") > -1) {
        flat_choices.splice(flat_choices.indexOf(""), 1);
      }
      var keyboardListener;
      var response = {
        rt: null,
        key: false,
        correct: false
      };
      const endTrial = () => {
        this.jsPsych.pluginAPI.cancelKeyboardResponse(keyboardListener);
        var trial_data = {
          rt: response.rt,
          response: response.key,
          correct: response.correct,
          grid: trial.grid,
          target: trial.target
        };
        this.jsPsych.finishTrial(trial_data);
      };
      const showFeedback = () => {
        if (response.rt == null || trial.show_response_feedback == false) {
          endTrial();
        } else {
          var color = response.correct ? "#0f0" : "#f00";
          display_element.querySelector(
            "#jspsych-serial-reaction-time-stimulus-cell-" + response.responseLoc[0] + "-" + response.responseLoc[1]
          ).style.transition = "";
          display_element.querySelector(
            "#jspsych-serial-reaction-time-stimulus-cell-" + response.responseLoc[0] + "-" + response.responseLoc[1]
          ).style.backgroundColor = color;
          this.jsPsych.pluginAPI.setTimeout(endTrial, trial.feedback_duration);
        }
      };
      const after_response = (info2) => {
        response = response.rt == null ? info2 : response;
        var responseLoc = [];
        for (var i = 0; i < trial.choices.length; i++) {
          for (var j = 0; j < trial.choices[i].length; j++) {
            var t = trial.choices[i][j];
            if (this.jsPsych.pluginAPI.compareKeys(info2.key, t)) {
              responseLoc = [i, j];
              break;
            }
          }
        }
        response.responseLoc = responseLoc;
        response.correct = JSON.stringify(responseLoc) == JSON.stringify(trial.target);
        if (trial.response_ends_trial) {
          if (trial.show_response_feedback) {
            showFeedback();
          } else {
            endTrial();
          }
        }
      };
      const showTarget = () => {
        if (trial.fade_duration == null) {
          display_element.querySelector(
            "#jspsych-serial-reaction-time-stimulus-cell-" + trial.target[0] + "-" + trial.target[1]
          ).style.backgroundColor = trial.target_color;
        } else {
          display_element.querySelector(
            "#jspsych-serial-reaction-time-stimulus-cell-" + trial.target[0] + "-" + trial.target[1]
          ).style.transition = "background-color " + trial.fade_duration;
          display_element.querySelector(
            "#jspsych-serial-reaction-time-stimulus-cell-" + trial.target[0] + "-" + trial.target[1]
          ).style.backgroundColor = trial.target_color;
        }
        keyboardListener = this.jsPsych.pluginAPI.getKeyboardResponse({
          callback_function: after_response,
          valid_responses: flat_choices,
          allow_held_key: false
        });
        if (trial.trial_duration !== null) {
          this.jsPsych.pluginAPI.setTimeout(showFeedback, trial.trial_duration);
        }
      };
      var stimulus = this.stimulus(trial.grid, trial.grid_square_size);
      display_element.innerHTML = stimulus;
      if (trial.pre_target_duration <= 0) {
        showTarget();
      } else {
        this.jsPsych.pluginAPI.setTimeout(showTarget, trial.pre_target_duration);
      }
      if (trial.prompt !== null) {
        display_element.innerHTML += trial.prompt;
      }
    }
    stimulus = function(grid, square_size, target, target_color, labels) {
      var stimulus = "<div id='jspsych-serial-reaction-time-stimulus' style='margin:auto; display: table; table-layout: fixed; border-spacing:" + square_size / 4 + "px'>";
      for (var i = 0; i < grid.length; i++) {
        stimulus += "<div class='jspsych-serial-reaction-time-stimulus-row' style='display:table-row;'>";
        for (var j = 0; j < grid[i].length; j++) {
          stimulus += "<div class='jspsych-serial-reaction-time-stimulus-cell' id='jspsych-serial-reaction-time-stimulus-cell-" + i + "-" + j + "' style='width:" + square_size + "px; height:" + square_size + "px; display:table-cell; vertical-align:middle; text-align: center; font-size:" + square_size / 2 + "px;";
          if (grid[i][j] == 1) {
            stimulus += "border: 2px solid black;";
          }
          if (typeof target !== "undefined" && target[0] == i && target[1] == j) {
            stimulus += "background-color: " + target_color + ";";
          }
          stimulus += "'>";
          if (typeof labels !== "undefined" && labels[i][j] !== false) {
            stimulus += labels[i][j];
          }
          stimulus += "</div>";
        }
        stimulus += "</div>";
      }
      stimulus += "</div>";
      return stimulus;
    };
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
      let key;
      if (this.jsPsych.randomization.sampleBernoulli(0.8) == 1) {
        key = trial.choices[trial.target[0]][trial.target[1]];
      } else {
        key = this.jsPsych.pluginAPI.getValidKey(trial.choices);
        while (key == trial.choices[trial.target[0]][trial.target[1]]) {
          key = this.jsPsych.pluginAPI.getValidKey(trial.choices);
        }
      }
      const default_data = {
        grid: trial.grid,
        target: trial.target,
        response: key,
        rt: this.jsPsych.randomization.sampleExGaussian(500, 50, 1 / 150, true),
        correct: key == trial.choices[trial.target[0]][trial.target[1]]
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
        this.jsPsych.pluginAPI.pressKey(data.response, data.rt);
      }
    }
  }

  return SerialReactionTimePlugin;

})(jsPsychModule);
