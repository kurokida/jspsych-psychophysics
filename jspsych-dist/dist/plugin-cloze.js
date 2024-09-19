var jsPsychCloze = (function (jspsych) {
  'use strict';

  var _package = {
    name: "@jspsych/plugin-cloze",
    version: "2.0.0",
    description: "jsPsych plugin for displaying a cloze test and checking participants answers against a correct solution",
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
      directory: "packages/plugin-cloze"
    },
    author: "Philipp Sprengholz",
    license: "MIT",
    bugs: {
      url: "https://github.com/jspsych/jsPsych/issues"
    },
    homepage: "https://www.jspsych.org/latest/plugins/cloze",
    peerDependencies: {
      jspsych: ">=7.1.0"
    },
    devDependencies: {
      "@jspsych/config": "^3.0.0",
      "@jspsych/test-utils": "^1.2.0"
    }
  };

  const info = {
    name: "cloze",
    version: _package.version,
    parameters: {
      text: {
        type: jspsych.ParameterType.HTML_STRING,
        default: void 0
      },
      button_text: {
        type: jspsych.ParameterType.STRING,
        default: "OK"
      },
      check_answers: {
        type: jspsych.ParameterType.BOOL,
        default: false
      },
      allow_blanks: {
        type: jspsych.ParameterType.BOOL,
        default: true
      },
      mistake_fn: {
        type: jspsych.ParameterType.FUNCTION,
        default: () => {
        }
      }
    },
    data: {
      response: {
        type: jspsych.ParameterType.STRING,
        array: true
      }
    }
  };
  class ClozePlugin {
    constructor(jsPsych) {
      this.jsPsych = jsPsych;
    }
    static info = info;
    trial(display_element, trial) {
      var html = '<div class="cloze">';
      var elements = trial.text.split("%");
      const solutions = this.getSolutions(trial.text);
      let solution_counter = 0;
      for (var i = 0; i < elements.length; i++) {
        if (i % 2 === 0) {
          html += elements[i];
        } else {
          html += `<input type="text" id="input${solution_counter}" value="">`;
          solution_counter++;
        }
      }
      html += "</div>";
      display_element.innerHTML = html;
      const check = () => {
        var answers = [];
        var answers_correct = true;
        var answers_filled = true;
        for (var i2 = 0; i2 < solutions.length; i2++) {
          var field = document.getElementById("input" + i2);
          answers.push(field.value.trim());
          if (trial.check_answers) {
            if (answers[i2] !== solutions[i2]) {
              field.style.color = "red";
              answers_correct = false;
            } else {
              field.style.color = "black";
            }
          }
          if (!trial.allow_blanks) {
            if (answers[i2] === "") {
              answers_filled = false;
            }
          }
        }
        if (trial.check_answers && !answers_correct || !trial.allow_blanks && !answers_filled) {
          trial.mistake_fn();
        } else {
          var trial_data = {
            response: answers
          };
          this.jsPsych.finishTrial(trial_data);
        }
      };
      display_element.innerHTML += '<br><button class="jspsych-html-button-response-button" type="button" id="finish_cloze_button">' + trial.button_text + "</button>";
      display_element.querySelector("#finish_cloze_button").addEventListener("click", check);
    }
    getSolutions(text) {
      const solutions = [];
      const elements = text.split("%");
      for (let i = 0; i < elements.length; i++) {
        if (i % 2 == 1) {
          solutions.push(elements[i].trim());
        }
      }
      return solutions;
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
      const solutions = this.getSolutions(trial.text);
      const responses = [];
      for (const word of solutions) {
        if (word == "") {
          responses.push(this.jsPsych.randomization.randomWords({ exactly: 1 }));
        } else {
          responses.push(word);
        }
      }
      const default_data = {
        response: responses
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
      this.trial(display_element, trial);
      load_callback();
      const inputs = display_element.querySelectorAll('input[type="text"]');
      let rt = this.jsPsych.randomization.sampleExGaussian(750, 200, 0.01, true);
      for (let i = 0; i < data.response.length; i++) {
        this.jsPsych.pluginAPI.fillTextInput(inputs[i], data.response[i], rt);
        rt += this.jsPsych.randomization.sampleExGaussian(750, 200, 0.01, true);
      }
      this.jsPsych.pluginAPI.clickTarget(display_element.querySelector("#finish_cloze_button"), rt);
    }
  }

  return ClozePlugin;

})(jsPsychModule);
