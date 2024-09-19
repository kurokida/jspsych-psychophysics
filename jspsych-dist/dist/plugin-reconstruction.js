var jsPsychReconstruction = (function (jspsych) {
  'use strict';

  var _package = {
    name: "@jspsych/plugin-reconstruction",
    version: "2.0.0",
    description: "a jspsych plugin for a reconstruction task where the participant recreates a stimulus from memory",
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
      test: "jest  --passWithNoTests",
      "test:watch": "npm test -- --watch",
      tsc: "tsc",
      build: "rollup --config",
      "build:watch": "npm run build -- --watch"
    },
    repository: {
      type: "git",
      url: "git+https://github.com/jspsych/jsPsych.git",
      directory: "packages/plugin-reconstruction"
    },
    author: "Josh de Leeuw",
    license: "MIT",
    bugs: {
      url: "https://github.com/jspsych/jsPsych/issues"
    },
    homepage: "https://www.jspsych.org/latest/plugins/reconstruction",
    peerDependencies: {
      jspsych: ">=7.1.0"
    },
    devDependencies: {
      "@jspsych/config": "^3.0.0",
      "@jspsych/test-utils": "^1.2.0"
    }
  };

  const info = {
    name: "reconstruction",
    version: _package.version,
    parameters: {
      stim_function: {
        type: jspsych.ParameterType.FUNCTION,
        default: void 0
      },
      starting_value: {
        type: jspsych.ParameterType.FLOAT,
        default: 0.5
      },
      step_size: {
        type: jspsych.ParameterType.FLOAT,
        default: 0.05
      },
      key_increase: {
        type: jspsych.ParameterType.KEY,
        default: "h"
      },
      key_decrease: {
        type: jspsych.ParameterType.KEY,
        default: "g"
      },
      button_label: {
        type: jspsych.ParameterType.STRING,
        default: "Continue"
      }
    },
    data: {
      start_value: {
        type: jspsych.ParameterType.INT
      },
      final_value: {
        type: jspsych.ParameterType.INT
      },
      rt: {
        type: jspsych.ParameterType.INT
      }
    }
  };
  class ReconstructionPlugin {
    constructor(jsPsych) {
      this.jsPsych = jsPsych;
    }
    static info = info;
    trial(display_element, trial) {
      var param = trial.starting_value;
      const endTrial = () => {
        var endTime = performance.now();
        var response_time = Math.round(endTime - startTime);
        this.jsPsych.pluginAPI.cancelKeyboardResponse(key_listener);
        var trial_data = {
          rt: response_time,
          final_value: param,
          start_value: trial.starting_value
        };
        this.jsPsych.finishTrial(trial_data);
      };
      const draw = (param2) => {
        display_element.innerHTML = '<div id="jspsych-reconstruction-stim-container">' + trial.stim_function(param2) + "</div>";
        display_element.innerHTML += '<button id="jspsych-reconstruction-next" class="jspsych-btn jspsych-reconstruction">' + trial.button_label + "</button>";
        display_element.querySelector("#jspsych-reconstruction-next").addEventListener("click", endTrial);
      };
      const after_response = (info2) => {
        var key_i = trial.key_increase;
        var key_d = trial.key_decrease;
        if (this.jsPsych.pluginAPI.compareKeys(info2.key, key_i)) {
          param = param + trial.step_size;
        } else if (this.jsPsych.pluginAPI.compareKeys(info2.key, key_d)) {
          param = param - trial.step_size;
        }
        param = Math.max(Math.min(1, param), 0);
        draw(param);
      };
      var key_listener = this.jsPsych.pluginAPI.getKeyboardResponse({
        callback_function: after_response,
        valid_responses: [trial.key_increase, trial.key_decrease],
        rt_method: "performance",
        persist: true,
        allow_held_key: true
      });
      draw(param);
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
        rt: this.jsPsych.randomization.sampleExGaussian(2e3, 200, 1 / 200, true),
        start_value: trial.starting_value,
        final_value: this.jsPsych.randomization.randomInt(0, Math.round(1 / trial.step_size)) * trial.step_size
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
      let steps = Math.round((data.final_value - trial.starting_value) / trial.step_size);
      const rt_per_step = (data.rt - 300) / steps;
      let t = 0;
      while (steps != 0) {
        if (steps > 0) {
          this.jsPsych.pluginAPI.pressKey(trial.key_increase, t + rt_per_step);
          steps--;
        } else {
          this.jsPsych.pluginAPI.pressKey(trial.key_decrease, t + rt_per_step);
          steps++;
        }
        t += rt_per_step;
      }
      this.jsPsych.pluginAPI.clickTarget(
        display_element.querySelector("#jspsych-reconstruction-next"),
        data.rt
      );
    }
  }

  return ReconstructionPlugin;

})(jsPsychModule);
