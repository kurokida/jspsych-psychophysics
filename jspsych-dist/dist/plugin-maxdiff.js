var jsPsychMaxdiff = (function (jspsych) {
  'use strict';

  var _package = {
    name: "@jspsych/plugin-maxdiff",
    version: "2.0.1",
    description: "a jspsych plugin for maxdiff/conjoint analysis designs",
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
      directory: "packages/plugin-maxdiff"
    },
    author: "Angus Hughes",
    license: "MIT",
    bugs: {
      url: "https://github.com/jspsych/jsPsych/issues"
    },
    homepage: "https://www.jspsych.org/latest/plugins/maxdiff",
    peerDependencies: {
      jspsych: ">=7.1.0"
    },
    devDependencies: {
      "@jspsych/config": "^3.0.0",
      "@jspsych/test-utils": "^1.2.0"
    }
  };

  const info = {
    name: "maxdiff",
    version: _package.version,
    parameters: {
      alternatives: {
        type: jspsych.ParameterType.STRING,
        array: true,
        default: void 0
      },
      labels: {
        type: jspsych.ParameterType.STRING,
        array: true,
        default: void 0
      },
      randomize_alternative_order: {
        type: jspsych.ParameterType.BOOL,
        default: false
      },
      preamble: {
        type: jspsych.ParameterType.HTML_STRING,
        default: ""
      },
      button_label: {
        type: jspsych.ParameterType.STRING,
        default: "Continue"
      },
      required: {
        type: jspsych.ParameterType.BOOL,
        default: false
      }
    },
    data: {
      rt: {
        type: jspsych.ParameterType.INT
      },
      labels: {
        type: jspsych.ParameterType.COMPLEX,
        parameters: {
          left: {
            type: jspsych.ParameterType.STRING
          },
          right: {
            type: jspsych.ParameterType.STRING
          }
        }
      },
      response: {
        type: jspsych.ParameterType.COMPLEX,
        parameters: {
          left: {
            type: jspsych.ParameterType.STRING
          },
          right: {
            type: jspsych.ParameterType.STRING
          }
        }
      }
    }
  };
  class MaxdiffPlugin {
    constructor(jsPsych) {
      this.jsPsych = jsPsych;
    }
    static info = info;
    trial(display_element, trial) {
      var html = "";
      html += '<style id="jspsych-maxdiff-css">';
      html += ".jspsych-maxdiff-statement {display:block; font-size: 16px; padding-top: 40px; margin-bottom:10px;}table.jspsych-maxdiff-table {border-collapse: collapse; padding: 15px; margin-left: auto; margin-right: auto;}table.jspsych-maxdiff-table td, th {border-bottom: 1px solid #dddddd; text-align: center; padding: 8px;}table.jspsych-maxdiff-table tr:nth-child(even) {background-color: #dddddd;}";
      html += "</style>";
      if (trial.preamble !== null) {
        html += '<div id="jspsych-maxdiff-preamble" class="jspsych-maxdiff-preamble">' + trial.preamble + "</div>";
      }
      html += '<form id="jspsych-maxdiff-form">';
      var alternative_order = [];
      for (var i = 0; i < trial.alternatives.length; i++) {
        alternative_order.push(i);
      }
      if (trial.randomize_alternative_order) {
        alternative_order = this.jsPsych.randomization.shuffle(alternative_order);
      }
      var maxdiff_table = '<table class="jspsych-maxdiff-table"><tr><th id="jspsych-maxdiff-left-label">' + trial.labels[0] + '</th><th></th><th id="jspsych-maxdiff-right-label">' + trial.labels[1] + "</th></tr>";
      for (var i = 0; i < trial.alternatives.length; i++) {
        var alternative = trial.alternatives[alternative_order[i]];
        maxdiff_table += '<tr><td><input class= "jspsych-maxdiff-alt-' + i.toString() + '" type="radio" name="left" data-name = ' + alternative_order[i].toString() + " /><br></td>";
        maxdiff_table += '<td id="jspsych-maxdiff-alternative-' + i.toString() + '">' + alternative + "</td>";
        maxdiff_table += '<td><input class= "jspsych-maxdiff-alt-' + i.toString() + '" type="radio" name="right" data-name = ' + alternative_order[i].toString() + " /><br></td></tr>";
      }
      maxdiff_table += "</table><br><br>";
      html += maxdiff_table;
      var enable_submit = trial.required == true ? 'disabled = "disabled"' : "";
      html += '<input type="submit" id="jspsych-maxdiff-next" class="jspsych-maxdiff jspsych-btn" ' + enable_submit + ' value="' + trial.button_label + '"></input>';
      html += "</form>";
      display_element.innerHTML = html;
      const left_right = ["left", "right"];
      left_right.forEach((p) => {
        document.getElementsByName(p).forEach((alt) => {
          alt.addEventListener("click", () => {
            var op = alt["name"] == "left" ? "right" : "left";
            var n = document.getElementsByClassName(alt.className).namedItem(op);
            if (n["checked"]) {
              n["checked"] = false;
            }
            if (trial.required) {
              var left_checked = Array.prototype.slice.call(document.getElementsByName("left")).some((c) => c.checked);
              var right_checked = Array.prototype.slice.call(document.getElementsByName("right")).some((c) => c.checked);
              if (left_checked && right_checked) {
                document.getElementById("jspsych-maxdiff-next").disabled = false;
              } else {
                document.getElementById("jspsych-maxdiff-next").disabled = true;
              }
            }
          });
        });
      });
      display_element.querySelector("#jspsych-maxdiff-form").addEventListener("submit", (e) => {
        e.preventDefault();
        var endTime = performance.now();
        var response_time = Math.round(endTime - startTime);
        function get_response(side) {
          var col = display_element.querySelectorAll('[name="' + side + '"]:checked')[0];
          if (col === void 0) {
            return null;
          } else {
            var i2 = parseInt(col.getAttribute("data-name"));
            return trial.alternatives[i2];
          }
        }
        var trial_data = {
          rt: response_time,
          labels: { left: trial.labels[0], right: trial.labels[1] },
          response: { left: get_response("left"), right: get_response("right") }
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
      const choices = this.jsPsych.randomization.sampleWithoutReplacement(trial.alternatives, 2);
      const response = { left: null, right: null };
      if (!trial.required && this.jsPsych.randomization.sampleBernoulli(0.1)) {
        choices.pop();
        if (this.jsPsych.randomization.sampleBernoulli(0.8)) {
          choices.pop();
        }
      }
      if (choices.length == 1) {
        if (this.jsPsych.randomization.sampleBernoulli(0.5)) {
          response.left = choices[0];
        } else {
          response.right = choices[0];
        }
      }
      if (choices.length == 2) {
        response.left = choices[0];
        response.right = choices[1];
      }
      const default_data = {
        rt: this.jsPsych.randomization.sampleExGaussian(3e3, 300, 1 / 300, true),
        labels: trial.labels,
        response
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
      const list = [...display_element.querySelectorAll("[id^=jspsych-maxdiff-alternative]")].map(
        (x) => {
          return x.innerHTML;
        }
      );
      if (data.response.left !== null) {
        const index_left = list.indexOf(data.response.left);
        this.jsPsych.pluginAPI.clickTarget(
          display_element.querySelector(`.jspsych-maxdiff-alt-${index_left}[name="left"]`),
          data.rt / 3
        );
      }
      if (data.response.right !== null) {
        const index_right = list.indexOf(data.response.right);
        this.jsPsych.pluginAPI.clickTarget(
          display_element.querySelector(`.jspsych-maxdiff-alt-${index_right}[name="right"]`),
          data.rt / 3 * 2
        );
      }
      this.jsPsych.pluginAPI.clickTarget(
        display_element.querySelector("#jspsych-maxdiff-next"),
        data.rt
      );
    }
  }

  return MaxdiffPlugin;

})(jsPsychModule);
