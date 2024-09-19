var jsPsychSurveyMultiSelect = (function (jspsych) {
  'use strict';

  var _package = {
    name: "@jspsych/plugin-survey-multi-select",
    version: "2.0.0",
    description: "a jspsych plugin for multiple choice survey questions",
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
      directory: "packages/plugin-survey-multi-select"
    },
    author: "Josh de Leeuw",
    license: "MIT",
    bugs: {
      url: "https://github.com/jspsych/jsPsych/issues"
    },
    homepage: "https://www.jspsych.org/latest/plugins/survey-multi-select",
    peerDependencies: {
      jspsych: ">=7.1.0"
    },
    devDependencies: {
      "@jspsych/config": "^3.0.0",
      "@jspsych/test-utils": "^1.2.0"
    }
  };

  const info = {
    name: "survey-multi-select",
    version: _package.version,
    parameters: {
      questions: {
        type: jspsych.ParameterType.COMPLEX,
        array: true,
        nested: {
          prompt: {
            type: jspsych.ParameterType.HTML_STRING,
            default: void 0
          },
          options: {
            type: jspsych.ParameterType.STRING,
            array: true,
            default: void 0
          },
          horizontal: {
            type: jspsych.ParameterType.BOOL,
            default: false
          },
          required: {
            type: jspsych.ParameterType.BOOL,
            default: false
          },
          name: {
            type: jspsych.ParameterType.STRING,
            default: ""
          }
        }
      },
      randomize_question_order: {
        type: jspsych.ParameterType.BOOL,
        default: false
      },
      preamble: {
        type: jspsych.ParameterType.HTML_STRING,
        default: null
      },
      button_label: {
        type: jspsych.ParameterType.STRING,
        default: "Continue"
      },
      required_message: {
        type: jspsych.ParameterType.STRING,
        default: "You must choose at least one response for this question"
      },
      autocomplete: {
        type: jspsych.ParameterType.BOOL,
        default: false
      }
    },
    data: {
      response: {
        type: jspsych.ParameterType.COMPLEX,
        nested: {
          identifier: {
            type: jspsych.ParameterType.STRING
          },
          response: {
            type: jspsych.ParameterType.STRING | jspsych.ParameterType.INT | jspsych.ParameterType.FLOAT | jspsych.ParameterType.BOOL | jspsych.ParameterType.OBJECT
          }
        }
      },
      rt: {
        type: jspsych.ParameterType.INT
      },
      question_order: {
        type: jspsych.ParameterType.INT,
        array: true
      }
    }
  };
  class SurveyMultiSelectPlugin {
    constructor(jsPsych) {
      this.jsPsych = jsPsych;
    }
    static info = info;
    trial(display_element, trial) {
      var plugin_id_name = "jspsych-survey-multi-select";
      var plugin_id_selector = "#" + plugin_id_name;
      const _join = (...args) => args.join("-");
      var cssstr = ".jspsych-survey-multi-select-question { margin-top: 2em; margin-bottom: 2em; text-align: left; }.jspsych-survey-multi-select-text span.required {color: darkred;}.jspsych-survey-multi-select-horizontal .jspsych-survey-multi-select-text {  text-align: center;}.jspsych-survey-multi-select-option { line-height: 2; }.jspsych-survey-multi-select-horizontal .jspsych-survey-multi-select-option {  display: inline-block;  margin-left: 1em;  margin-right: 1em;  vertical-align: top;}label.jspsych-survey-multi-select-text input[type='checkbox'] {margin-right: 1em;}";
      display_element.innerHTML = '<style id="jspsych-survey-multi-select-css">' + cssstr + "</style>";
      var trial_form_id = _join(plugin_id_name, "form");
      display_element.innerHTML += '<form id="' + trial_form_id + '"></form>';
      var trial_form = display_element.querySelector("#" + trial_form_id);
      if (!trial.autocomplete) {
        trial_form.setAttribute("autocomplete", "off");
      }
      var preamble_id_name = _join(plugin_id_name, "preamble");
      if (trial.preamble !== null) {
        trial_form.innerHTML += '<div id="' + preamble_id_name + '" class="' + preamble_id_name + '">' + trial.preamble + "</div>";
      }
      var question_order = [];
      for (var i = 0; i < trial.questions.length; i++) {
        question_order.push(i);
      }
      if (trial.randomize_question_order) {
        question_order = this.jsPsych.randomization.shuffle(question_order);
      }
      for (var i = 0; i < trial.questions.length; i++) {
        var question = trial.questions[question_order[i]];
        var question_id = question_order[i];
        var question_classes = [_join(plugin_id_name, "question")];
        if (question.horizontal) {
          question_classes.push(_join(plugin_id_name, "horizontal"));
        }
        trial_form.innerHTML += '<div id="' + _join(plugin_id_name, question_id) + '" data-name="' + question.name + '" class="' + question_classes.join(" ") + '"></div>';
        var question_selector = _join(plugin_id_selector, question_id);
        display_element.querySelector(question_selector).innerHTML += '<p id="survey-question" class="' + plugin_id_name + '-text survey-multi-select">' + question.prompt + "</p>";
        for (var j = 0; j < question.options.length; j++) {
          var option_id_name = _join(plugin_id_name, "option", question_id, j);
          display_element.querySelector(question_selector).innerHTML += '<div id="' + option_id_name + '" class="' + _join(plugin_id_name, "option") + '"></div>';
          var form = document.getElementById(option_id_name);
          var input_name = _join(plugin_id_name, "response", question_id);
          var input_id = _join(plugin_id_name, "response", question_id, j);
          var label = document.createElement("label");
          label.setAttribute("class", plugin_id_name + "-text");
          label.innerHTML = question.options[j];
          label.setAttribute("for", input_id);
          var input = document.createElement("input");
          input.setAttribute("type", "checkbox");
          input.setAttribute("name", input_name);
          input.setAttribute("id", input_id);
          input.setAttribute("value", question.options[j]);
          form.appendChild(label);
          label.insertBefore(input, label.firstChild);
        }
      }
      trial_form.innerHTML += '<div class="fail-message"></div>';
      trial_form.innerHTML += '<button id="' + plugin_id_name + '-next" class="' + plugin_id_name + ' jspsych-btn">' + trial.button_label + "</button>";
      display_element.querySelector("#jspsych-survey-multi-select-next").addEventListener("click", () => {
        for (var i2 = 0; i2 < trial.questions.length; i2++) {
          if (trial.questions[i2].required) {
            if (display_element.querySelector(
              "#jspsych-survey-multi-select-" + i2 + " input:checked"
            ) == null) {
              display_element.querySelector("#jspsych-survey-multi-select-" + i2 + " input").setCustomValidity(trial.required_message);
            } else {
              display_element.querySelector("#jspsych-survey-multi-select-" + i2 + " input").setCustomValidity("");
            }
          }
        }
        trial_form.reportValidity();
      });
      trial_form.addEventListener("submit", (event) => {
        event.preventDefault();
        var endTime = performance.now();
        var response_time = Math.round(endTime - startTime);
        var question_data = {};
        for (var index = 0; index < trial.questions.length; index++) {
          var match = display_element.querySelector("#jspsych-survey-multi-select-" + index);
          var val = [];
          var inputboxes = match.querySelectorAll("input[type=checkbox]:checked");
          for (var j2 = 0; j2 < inputboxes.length; j2++) {
            var currentChecked = inputboxes[j2];
            val.push(currentChecked.value);
          }
          var id = "Q" + index;
          var obje = {};
          var name = id;
          if (match.attributes["data-name"].value !== "") {
            name = match.attributes["data-name"].value;
          }
          obje[name] = val;
          Object.assign(question_data, obje);
          if (val.length == 0) ;
        }
        var trial_data = {
          rt: response_time,
          response: question_data,
          question_order
        };
        this.jsPsych.finishTrial(trial_data);
      });
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
      const question_data = {};
      let rt = 1e3;
      for (const q of trial.questions) {
        let n_answers;
        if (q.required) {
          n_answers = this.jsPsych.randomization.randomInt(1, q.options.length);
        } else {
          n_answers = this.jsPsych.randomization.randomInt(0, q.options.length);
        }
        const name = q.name ? q.name : `Q${trial.questions.indexOf(q)}`;
        const selections = this.jsPsych.randomization.sampleWithoutReplacement(q.options, n_answers);
        question_data[name] = selections;
        rt += this.jsPsych.randomization.sampleExGaussian(1500, 400, 1 / 200, true);
      }
      const default_data = {
        response: question_data,
        rt,
        question_order: trial.randomize_question_order ? this.jsPsych.randomization.shuffle([...Array(trial.questions.length).keys()]) : [...Array(trial.questions.length).keys()]
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
      const answers = Object.entries(data.response);
      for (let i = 0; i < answers.length; i++) {
        for (const a of answers[i][1]) {
          this.jsPsych.pluginAPI.clickTarget(
            display_element.querySelector(
              `#jspsych-survey-multi-select-response-${i}-${trial.questions[i].options.indexOf(a)}`
            ),
            (data.rt - 1e3) / answers.length * (i + 1)
          );
        }
      }
      this.jsPsych.pluginAPI.clickTarget(
        display_element.querySelector("#jspsych-survey-multi-select-next"),
        data.rt
      );
    }
  }

  return SurveyMultiSelectPlugin;

})(jsPsychModule);
