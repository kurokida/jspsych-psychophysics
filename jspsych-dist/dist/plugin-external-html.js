var jsPsychExternalHtml = (function (jspsych) {
  'use strict';

  var _package = {
    name: "@jspsych/plugin-external-html",
    version: "2.0.0",
    description: "jsPsych plugin to load and display external html pages",
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
      directory: "packages/plugin-external-html"
    },
    author: "Erik Weitnauer",
    license: "MIT",
    bugs: {
      url: "https://github.com/jspsych/jsPsych/issues"
    },
    homepage: "https://www.jspsych.org/latest/plugins/external-html",
    peerDependencies: {
      jspsych: ">=7.1.0"
    },
    devDependencies: {
      "@jspsych/config": "^3.0.0",
      "@jspsych/test-utils": "^1.2.0",
      "jest-fetch-mock": "^3.0.3"
    }
  };

  const info = {
    name: "external-html",
    version: _package.version,
    parameters: {
      url: {
        type: jspsych.ParameterType.STRING,
        default: void 0
      },
      cont_key: {
        type: jspsych.ParameterType.KEY,
        default: null
      },
      cont_btn: {
        type: jspsych.ParameterType.STRING,
        default: null
      },
      check_fn: {
        type: jspsych.ParameterType.FUNCTION,
        default: () => true
      },
      force_refresh: {
        type: jspsych.ParameterType.BOOL,
        default: false
      },
      execute_script: {
        type: jspsych.ParameterType.BOOL,
        pretty_name: "Execute scripts",
        default: false
      }
    },
    data: {
      url: {
        type: jspsych.ParameterType.STRING
      },
      rt: {
        type: jspsych.ParameterType.INT
      }
    }
  };
  class ExternalHtmlPlugin {
    constructor(jsPsych) {
      this.jsPsych = jsPsych;
    }
    static info = info;
    trial(display_element, trial, on_load) {
      let trial_complete;
      var url = trial.url;
      if (trial.force_refresh) {
        url = trial.url + "?t=" + performance.now();
      }
      fetch(url).then((response) => {
        return response.text();
      }).then((html) => {
        display_element.innerHTML = html;
        on_load();
        var t0 = performance.now();
        const key_listener = (e) => {
          if (this.jsPsych.pluginAPI.compareKeys(e.key, trial.cont_key)) {
            finish();
          }
        };
        const finish = () => {
          if (trial.check_fn && !trial.check_fn(display_element)) {
            return;
          }
          if (trial.cont_key) {
            display_element.removeEventListener("keydown", key_listener);
          }
          var trial_data = {
            rt: Math.round(performance.now() - t0),
            url: trial.url
          };
          this.jsPsych.finishTrial(trial_data);
          trial_complete();
        };
        if (trial.execute_script) {
          var all_scripts = display_element.getElementsByTagName("script");
          for (var i = 0; i < all_scripts.length; i++) {
            const relocatedScript = document.createElement("script");
            const curr_script = all_scripts[i];
            relocatedScript.text = curr_script.text;
            curr_script.parentNode.replaceChild(relocatedScript, curr_script);
          }
        }
        if (trial.cont_btn) {
          display_element.querySelector("#" + trial.cont_btn).addEventListener("click", finish);
        }
        if (trial.cont_key) {
          display_element.addEventListener("keydown", key_listener);
        }
      }).catch((err) => {
        console.error(`Something went wrong with fetch() in plugin-external-html.`, err);
      });
      return new Promise((resolve) => {
        trial_complete = resolve;
      });
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
        url: trial.url,
        rt: this.jsPsych.randomization.sampleExGaussian(2e3, 200, 1 / 200, true)
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
      this.trial(display_element, trial, () => {
        load_callback();
        if (trial.cont_key) {
          this.jsPsych.pluginAPI.pressKey(trial.cont_key, data.rt);
        } else if (trial.cont_btn) {
          this.jsPsych.pluginAPI.clickTarget(
            display_element.querySelector("#" + trial.cont_btn),
            data.rt
          );
        }
      });
    }
  }

  return ExternalHtmlPlugin;

})(jsPsychModule);
