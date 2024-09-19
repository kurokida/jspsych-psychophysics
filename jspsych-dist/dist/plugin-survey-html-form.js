var jsPsychSurveyHtmlForm = (function (jspsych) {
  'use strict';

  var _package = {
    name: "@jspsych/plugin-survey-html-form",
    version: "2.0.0",
    description: "a jspsych plugin for free html forms",
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
      directory: "packages/plugin-survey-html-form"
    },
    author: "Jan Simson",
    license: "MIT",
    bugs: {
      url: "https://github.com/jspsych/jsPsych/issues"
    },
    homepage: "https://www.jspsych.org/latest/plugins/survey-html-form",
    peerDependencies: {
      jspsych: ">=7.1.0"
    },
    devDependencies: {
      "@jspsych/config": "^3.0.0",
      "@jspsych/test-utils": "^1.2.0"
    }
  };

  const info = {
    name: "survey-html-form",
    version: _package.version,
    parameters: {
      html: {
        type: jspsych.ParameterType.HTML_STRING,
        default: null
      },
      preamble: {
        type: jspsych.ParameterType.HTML_STRING,
        default: null
      },
      button_label: {
        type: jspsych.ParameterType.STRING,
        default: "Continue"
      },
      autofocus: {
        type: jspsych.ParameterType.STRING,
        default: ""
      },
      dataAsArray: {
        type: jspsych.ParameterType.BOOL,
        default: false
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
      }
    }
  };
  class SurveyHtmlFormPlugin {
    constructor(jsPsych) {
      this.jsPsych = jsPsych;
    }
    static info = info;
    trial(display_element, trial) {
      var html = "";
      if (trial.preamble !== null) {
        html += '<div id="jspsych-survey-html-form-preamble" class="jspsych-survey-html-form-preamble">' + trial.preamble + "</div>";
      }
      if (trial.autocomplete) {
        html += '<form id="jspsych-survey-html-form">';
      } else {
        html += '<form id="jspsych-survey-html-form" autocomplete="off">';
      }
      html += trial.html;
      html += '<input type="submit" id="jspsych-survey-html-form-next" class="jspsych-btn jspsych-survey-html-form" value="' + trial.button_label + '"></input>';
      html += "</form>";
      display_element.innerHTML = html;
      if (trial.autofocus !== "") {
        var focus_elements = display_element.querySelectorAll(
          "#" + trial.autofocus
        );
        if (focus_elements.length === 0) {
          console.warn("No element found with id: " + trial.autofocus);
        } else if (focus_elements.length > 1) {
          console.warn('The id "' + trial.autofocus + '" is not unique so autofocus will not work.');
        } else {
          focus_elements[0].focus();
        }
      }
      display_element.querySelector("#jspsych-survey-html-form").addEventListener("submit", (event) => {
        event.preventDefault();
        var endTime = performance.now();
        var response_time = Math.round(endTime - startTime);
        var this_form = display_element.querySelector("#jspsych-survey-html-form");
        var question_data = serializeArray(this_form);
        if (!trial.dataAsArray) {
          question_data = objectifyForm(question_data);
        }
        var trialdata = {
          rt: response_time,
          response: question_data
        };
        this.jsPsych.finishTrial(trialdata);
      });
      var startTime = performance.now();
      function serializeArray(form) {
        var serialized = [];
        for (var i = 0; i < form.elements.length; i++) {
          var field = form.elements[i];
          if (!field.name || field.disabled || field.type === "file" || field.type === "reset" || field.type === "submit" || field.type === "button")
            continue;
          if (field.type === "select-multiple") {
            for (var n = 0; n < field.options.length; n++) {
              if (!field.options[n].selected)
                continue;
              serialized.push({
                name: field.name,
                value: field.options[n].value
              });
            }
          } else if (field.type !== "checkbox" && field.type !== "radio" || field.checked) {
            serialized.push({
              name: field.name,
              value: field.value
            });
          }
        }
        return serialized;
      }
      function objectifyForm(formArray) {
        var returnArray = {};
        for (var i = 0; i < formArray.length; i++) {
          returnArray[formArray[i]["name"]] = formArray[i]["value"];
        }
        return returnArray;
      }
    }
  }

  return SurveyHtmlFormPlugin;

})(jsPsychModule);
