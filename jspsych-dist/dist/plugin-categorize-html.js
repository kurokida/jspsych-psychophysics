var jsPsychCategorizeHtml = (function (jspsych) {
  'use strict';

  var _package = {
    name: "@jspsych/plugin-categorize-html",
    version: "2.0.0",
    description: "jspsych plugin for categorization trials with feedback",
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
      directory: "packages/plugin-categorize-html"
    },
    author: "Josh de Leeuw",
    license: "MIT",
    bugs: {
      url: "https://github.com/jspsych/jsPsych/issues"
    },
    homepage: "https://www.jspsych.org/latest/plugins/categorize-html",
    peerDependencies: {
      jspsych: ">=7.1.0"
    },
    devDependencies: {
      "@jspsych/config": "^3.0.0",
      "@jspsych/test-utils": "^1.2.0"
    }
  };

  const info = {
    name: "categorize-html",
    version: _package.version,
    parameters: {
      stimulus: {
        type: jspsych.ParameterType.HTML_STRING,
        default: void 0
      },
      key_answer: {
        type: jspsych.ParameterType.KEY,
        default: void 0
      },
      choices: {
        type: jspsych.ParameterType.KEYS,
        default: "ALL_KEYS"
      },
      text_answer: {
        type: jspsych.ParameterType.HTML_STRING,
        default: null
      },
      correct_text: {
        type: jspsych.ParameterType.HTML_STRING,
        default: "<p class='feedback'>Correct</p>"
      },
      incorrect_text: {
        type: jspsych.ParameterType.HTML_STRING,
        default: "<p class='feedback'>Incorrect</p>"
      },
      prompt: {
        type: jspsych.ParameterType.HTML_STRING,
        default: null
      },
      force_correct_button_press: {
        type: jspsych.ParameterType.BOOL,
        default: false
      },
      show_stim_with_feedback: {
        type: jspsych.ParameterType.BOOL,
        default: false
      },
      show_feedback_on_timeout: {
        type: jspsych.ParameterType.BOOL,
        default: false
      },
      timeout_message: {
        type: jspsych.ParameterType.HTML_STRING,
        default: "<p>Please respond faster.</p>"
      },
      stimulus_duration: {
        type: jspsych.ParameterType.INT,
        default: null
      },
      trial_duration: {
        type: jspsych.ParameterType.INT,
        default: null
      },
      feedback_duration: {
        type: jspsych.ParameterType.INT,
        default: 2e3
      }
    },
    data: {
      stimulus: {
        type: jspsych.ParameterType.STRING
      },
      response: {
        type: jspsych.ParameterType.STRING
      },
      rt: {
        type: jspsych.ParameterType.INT
      },
      correct: {
        type: jspsych.ParameterType.BOOL
      }
    }
  };
  class CategorizeHtmlPlugin {
    constructor(jsPsych) {
      this.jsPsych = jsPsych;
    }
    static info = info;
    trial(display_element, trial) {
      display_element.innerHTML = '<div id="jspsych-categorize-html-stimulus" class="jspsych-categorize-html-stimulus">' + trial.stimulus + "</div>";
      if (trial.stimulus_duration !== null) {
        this.jsPsych.pluginAPI.setTimeout(() => {
          display_element.querySelector(
            "#jspsych-categorize-html-stimulus"
          ).style.visibility = "hidden";
        }, trial.stimulus_duration);
      }
      if (trial.prompt !== null) {
        display_element.innerHTML += trial.prompt;
      }
      var trial_data = {};
      const after_response = (info2) => {
        this.jsPsych.pluginAPI.cancelAllKeyboardResponses();
        var correct = false;
        if (this.jsPsych.pluginAPI.compareKeys(trial.key_answer, info2.key)) {
          correct = true;
        }
        trial_data = {
          rt: info2.rt,
          correct,
          stimulus: trial.stimulus,
          response: info2.key
        };
        var timeout = info2.rt == null;
        doFeedback(correct, timeout);
      };
      this.jsPsych.pluginAPI.getKeyboardResponse({
        callback_function: after_response,
        valid_responses: trial.choices,
        rt_method: "performance",
        persist: false,
        allow_held_key: false
      });
      if (trial.trial_duration !== null) {
        this.jsPsych.pluginAPI.setTimeout(() => {
          after_response({
            key: null,
            rt: null
          });
        }, trial.trial_duration);
      }
      const endTrial = () => {
        this.jsPsych.finishTrial(trial_data);
      };
      const doFeedback = (correct, timeout) => {
        if (timeout && !trial.show_feedback_on_timeout) {
          display_element.innerHTML += trial.timeout_message;
        } else {
          if (trial.show_stim_with_feedback) {
            display_element.innerHTML = '<div id="jspsych-categorize-html-stimulus" class="jspsych-categorize-html-stimulus">' + trial.stimulus + "</div>";
          }
          var atext = "";
          if (correct) {
            atext = trial.correct_text.replace("%ANS%", trial.text_answer);
          } else {
            atext = trial.incorrect_text.replace("%ANS%", trial.text_answer);
          }
          display_element.innerHTML += atext;
        }
        if (trial.force_correct_button_press && correct === false && (timeout && trial.show_feedback_on_timeout || !timeout)) {
          var after_forced_response = (info2) => {
            endTrial();
          };
          this.jsPsych.pluginAPI.getKeyboardResponse({
            callback_function: after_forced_response,
            valid_responses: [trial.key_answer],
            rt_method: "performance",
            persist: false,
            allow_held_key: false
          });
        } else {
          this.jsPsych.pluginAPI.setTimeout(endTrial, trial.feedback_duration);
        }
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
      const key = this.jsPsych.pluginAPI.getValidKey(trial.choices);
      const default_data = {
        stimulus: trial.stimulus,
        response: key,
        rt: this.jsPsych.randomization.sampleExGaussian(500, 50, 1 / 150, true),
        correct: key == trial.key_answer
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
      if (trial.force_correct_button_press && !data.correct) {
        this.jsPsych.pluginAPI.pressKey(trial.key_answer, data.rt + trial.feedback_duration / 2);
      }
    }
  }

  return CategorizeHtmlPlugin;

})(jsPsychModule);
