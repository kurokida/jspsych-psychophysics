var jsPsychSerialReactionTimeMouse = (function (jspsych) {
  'use strict';

  var _package = {
    name: "@jspsych/plugin-serial-reaction-time-mouse",
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
      directory: "packages/plugin-serial-reaction-time-mouse"
    },
    author: "Josh de Leeuw",
    license: "MIT",
    bugs: {
      url: "https://github.com/jspsych/jsPsych/issues"
    },
    homepage: "https://www.jspsych.org/latest/plugins/serial-reaction-time-mouse",
    peerDependencies: {
      jspsych: ">=7.1.0"
    },
    devDependencies: {
      "@jspsych/config": "^3.0.0",
      "@jspsych/test-utils": "^1.2.0"
    }
  };

  const info = {
    name: "serial-reaction-time-mouse",
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
      fade_duration: {
        type: jspsych.ParameterType.INT,
        default: null
      },
      allow_nontarget_responses: {
        type: jspsych.ParameterType.BOOL,
        default: false
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
        type: jspsych.ParameterType.INT,
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
  class SerialReactionTimeMousePlugin {
    constructor(jsPsych) {
      this.jsPsych = jsPsych;
    }
    static info = info;
    trial(display_element, trial) {
      var startTime = -1;
      var response = {
        rt: null,
        row: null,
        column: null
      };
      const showTarget = () => {
        var resp_targets;
        if (!trial.allow_nontarget_responses) {
          resp_targets = [
            display_element.querySelector(
              "#jspsych-serial-reaction-time-stimulus-cell-" + trial.target[0] + "-" + trial.target[1]
            )
          ];
        } else {
          resp_targets = display_element.querySelectorAll(
            ".jspsych-serial-reaction-time-stimulus-cell"
          );
        }
        for (var i = 0; i < resp_targets.length; i++) {
          resp_targets[i].addEventListener("mousedown", (e) => {
            if (startTime == -1) {
              return;
            } else {
              var info2 = {};
              info2.row = e.currentTarget.getAttribute("data-row");
              info2.column = e.currentTarget.getAttribute("data-column");
              info2.rt = Math.round(performance.now() - startTime);
              after_response(info2);
            }
          });
        }
        startTime = performance.now();
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
        if (trial.trial_duration !== null) {
          this.jsPsych.pluginAPI.setTimeout(endTrial, trial.trial_duration);
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
        display_element.insertAdjacentHTML("beforeend", trial.prompt);
      }
      const endTrial = () => {
        var trial_data = {
          rt: response.rt,
          grid: trial.grid,
          target: trial.target,
          response: [parseInt(response.row, 10), parseInt(response.column, 10)],
          correct: response.row == trial.target[0] && response.column == trial.target[1]
        };
        this.jsPsych.finishTrial(trial_data);
      };
      function after_response(info2) {
        response = response.rt == null ? info2 : response;
        if (trial.response_ends_trial) {
          endTrial();
        }
      }
    }
    stimulus(grid, square_size, target, target_color, labels) {
      var stimulus = "<div id='jspsych-serial-reaction-time-stimulus' style='margin:auto; display: table; table-layout: fixed; border-spacing:" + square_size / 4 + "px'>";
      for (var i = 0; i < grid.length; i++) {
        stimulus += "<div class='jspsych-serial-reaction-time-stimulus-row' style='display:table-row;'>";
        for (var j = 0; j < grid[i].length; j++) {
          var classname = "jspsych-serial-reaction-time-stimulus-cell";
          stimulus += "<div class='" + classname + "' id='jspsych-serial-reaction-time-stimulus-cell-" + i + "-" + j + "' data-row=" + i + " data-column=" + j + " style='width:" + square_size + "px; height:" + square_size + "px; display:table-cell; vertical-align:middle; text-align: center; cursor: pointer; font-size:" + square_size / 2 + "px;";
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
      let response = this.jsPsych.utils.deepCopy(trial.target);
      if (trial.allow_nontarget_responses && this.jsPsych.randomization.sampleBernoulli(0.8) !== 1) {
        while (response[0] == trial.target[0] && response[1] == trial.target[1]) {
          response[0] == this.jsPsych.randomization.randomInt(0, trial.grid.length);
          response[1] == this.jsPsych.randomization.randomInt(0, trial.grid[response[0]].length);
        }
      }
      const default_data = {
        grid: trial.grid,
        target: trial.target,
        response,
        rt: trial.pre_target_duration + this.jsPsych.randomization.sampleExGaussian(500, 50, 1 / 150, true),
        correct: response[0] == trial.target[0] && response[1] == trial.target[1]
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
        const target = display_element.querySelector(
          `.jspsych-serial-reaction-time-stimulus-cell[data-row="${data.response[0]}"][data-column="${data.response[1]}"]`
        );
        this.jsPsych.pluginAPI.clickTarget(target, data.rt);
      }
    }
  }

  return SerialReactionTimeMousePlugin;

})(jsPsychModule);
