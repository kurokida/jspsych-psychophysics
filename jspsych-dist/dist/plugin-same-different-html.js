var jsPsychSameDifferentHtml = (function (jspsych) {
  'use strict';

  var _package = {
    name: "@jspsych/plugin-same-different-html",
    version: "2.0.0",
    description: "jsPsych plugin for showing two stimuli sequentially and getting a same / different judgment",
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
      directory: "packages/plugin-same-different-html"
    },
    author: "Josh de Leeuw",
    license: "MIT",
    bugs: {
      url: "https://github.com/jspsych/jsPsych/issues"
    },
    homepage: "https://www.jspsych.org/latest/plugins/same-different-html",
    peerDependencies: {
      jspsych: ">=7.1.0"
    },
    devDependencies: {
      "@jspsych/config": "^3.0.0",
      "@jspsych/test-utils": "^1.2.0"
    }
  };

  const info = {
    name: "same-different-html",
    version: _package.version,
    parameters: {
      stimuli: {
        type: jspsych.ParameterType.HTML_STRING,
        default: void 0,
        array: true
      },
      answer: {
        type: jspsych.ParameterType.SELECT,
        options: ["same", "different"],
        default: void 0
      },
      same_key: {
        type: jspsych.ParameterType.KEY,
        default: "q"
      },
      different_key: {
        type: jspsych.ParameterType.KEY,
        default: "p"
      },
      first_stim_duration: {
        type: jspsych.ParameterType.INT,
        default: 1e3
      },
      gap_duration: {
        type: jspsych.ParameterType.INT,
        default: 500
      },
      second_stim_duration: {
        type: jspsych.ParameterType.INT,
        pretty_name: "Second stimulus duration",
        default: 1e3
      },
      prompt: {
        type: jspsych.ParameterType.HTML_STRING,
        default: null
      }
    },
    data: {
      stimulus: {
        type: jspsych.ParameterType.HTML_STRING,
        array: true
      },
      response: {
        type: jspsych.ParameterType.STRING
      },
      rt: {
        type: jspsych.ParameterType.INT
      },
      correct: {
        type: jspsych.ParameterType.BOOL
      },
      answer: {
        type: jspsych.ParameterType.STRING
      }
    }
  };
  class SameDifferentHtmlPlugin {
    constructor(jsPsych) {
      this.jsPsych = jsPsych;
    }
    static info = info;
    trial(display_element, trial) {
      display_element.innerHTML = '<div class="jspsych-same-different-stimulus">' + trial.stimuli[0] + "</div>";
      var first_stim_info;
      if (trial.first_stim_duration > 0) {
        this.jsPsych.pluginAPI.setTimeout(() => {
          showBlankScreen();
        }, trial.first_stim_duration);
      } else {
        const afterKeyboardResponse = (info2) => {
          first_stim_info = info2;
          showBlankScreen();
        };
        this.jsPsych.pluginAPI.getKeyboardResponse({
          callback_function: afterKeyboardResponse,
          valid_responses: "ALL_KEYS",
          rt_method: "performance",
          persist: false,
          allow_held_key: false
        });
      }
      const showBlankScreen = () => {
        display_element.innerHTML = "";
        this.jsPsych.pluginAPI.setTimeout(showSecondStim, trial.gap_duration);
      };
      const showSecondStim = () => {
        var html = '<div class="jspsych-same-different-stimulus">' + trial.stimuli[1] + "</div>";
        if (trial.prompt !== null) {
          html += trial.prompt;
        }
        display_element.innerHTML = html;
        if (trial.second_stim_duration > 0) {
          this.jsPsych.pluginAPI.setTimeout(() => {
            display_element.querySelector(
              ".jspsych-same-different-stimulus"
            ).style.visibility = "hidden";
          }, trial.second_stim_duration);
        }
        const after_response = (info2) => {
          var correct = false;
          var skey = trial.same_key;
          var dkey = trial.different_key;
          if (this.jsPsych.pluginAPI.compareKeys(info2.key, skey) && trial.answer == "same") {
            correct = true;
          }
          if (this.jsPsych.pluginAPI.compareKeys(info2.key, dkey) && trial.answer == "different") {
            correct = true;
          }
          var trial_data = {
            rt: info2.rt,
            answer: trial.answer,
            correct,
            stimulus: [trial.stimuli[0], trial.stimuli[1]],
            response: info2.key
          };
          if (first_stim_info) {
            trial_data["rt_stim1"] = first_stim_info.rt;
            trial_data["response_stim1"] = first_stim_info.key;
          }
          this.jsPsych.finishTrial(trial_data);
        };
        this.jsPsych.pluginAPI.getKeyboardResponse({
          callback_function: after_response,
          valid_responses: [trial.same_key, trial.different_key],
          rt_method: "performance",
          persist: false,
          allow_held_key: false
        });
      };
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
      const key = this.jsPsych.pluginAPI.getValidKey([trial.same_key, trial.different_key]);
      const default_data = {
        stimuli: trial.stimuli,
        response: key,
        answer: trial.answer,
        correct: trial.answer == "same" ? key == trial.same_key : key == trial.different_key,
        rt: this.jsPsych.randomization.sampleExGaussian(500, 50, 1 / 150, true)
      };
      if (trial.first_stim_duration == null) {
        default_data.rt_stim1 = this.jsPsych.randomization.sampleExGaussian(500, 50, 1 / 150, true);
        default_data.response_stim1 = this.jsPsych.pluginAPI.getValidKey([
          trial.same_key,
          trial.different_key
        ]);
      }
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
      if (trial.first_stim_duration == null) {
        this.jsPsych.pluginAPI.pressKey(data.response_stim1, data.rt_stim1);
      }
      this.jsPsych.pluginAPI.pressKey(
        data.response,
        trial.first_stim_duration + trial.gap_duration + data.rt
      );
    }
  }

  return SameDifferentHtmlPlugin;

})(jsPsychModule);
