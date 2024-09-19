var jsPsychVisualSearchCircle = (function (jspsych) {
  'use strict';

  var _package = {
    name: "@jspsych/plugin-visual-search-circle",
    version: "2.0.0",
    description: "jsPsych visual search circle plugin",
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
      directory: "packages/plugin-visual-search-circle"
    },
    author: "Josh de Leeuw",
    license: "MIT",
    bugs: {
      url: "https://github.com/jspsych/jsPsych/issues"
    },
    homepage: "https://www.jspsych.org/latest/plugins/visual-search-circle",
    peerDependencies: {
      jspsych: ">=7.1.0"
    },
    devDependencies: {
      "@jspsych/config": "^3.0.0",
      "@jspsych/test-utils": "^1.2.0"
    }
  };

  const info = {
    name: "visual-search-circle",
    version: _package.version,
    parameters: {
      target: {
        type: jspsych.ParameterType.IMAGE,
        default: null
      },
      foil: {
        type: jspsych.ParameterType.IMAGE,
        default: null
      },
      set_size: {
        type: jspsych.ParameterType.INT,
        default: null
      },
      stimuli: {
        type: jspsych.ParameterType.IMAGE,
        default: [],
        array: true
      },
      target_present: {
        type: jspsych.ParameterType.BOOL,
        default: void 0
      },
      fixation_image: {
        type: jspsych.ParameterType.IMAGE,
        default: void 0
      },
      target_size: {
        type: jspsych.ParameterType.INT,
        array: true,
        default: [50, 50]
      },
      fixation_size: {
        type: jspsych.ParameterType.INT,
        array: true,
        default: [16, 16]
      },
      circle_diameter: {
        type: jspsych.ParameterType.INT,
        default: 250
      },
      target_present_key: {
        type: jspsych.ParameterType.KEY,
        default: "j"
      },
      target_absent_key: {
        type: jspsych.ParameterType.KEY,
        default: "f"
      },
      trial_duration: {
        type: jspsych.ParameterType.INT,
        default: null
      },
      fixation_duration: {
        type: jspsych.ParameterType.INT,
        default: 1e3
      },
      response_ends_trial: {
        type: jspsych.ParameterType.BOOL,
        default: true
      }
    },
    data: {
      correct: {
        type: jspsych.ParameterType.BOOL
      },
      response: {
        type: jspsych.ParameterType.STRING
      },
      rt: {
        type: jspsych.ParameterType.INT
      },
      set_size: {
        type: jspsych.ParameterType.INT
      },
      target_present: {
        type: jspsych.ParameterType.BOOL
      },
      locations: {
        type: jspsych.ParameterType.INT,
        array: true
      }
    }
  };
  class VisualSearchCirclePlugin {
    constructor(jsPsych) {
      this.jsPsych = jsPsych;
    }
    static info = info;
    trial(display_element, trial) {
      var paper_size = trial.circle_diameter + trial.target_size[0];
      var fix_loc = this.generateFixationLoc(trial);
      var to_present = this.generatePresentationSet(trial);
      var display_locs = this.generateDisplayLocs(to_present.length, trial);
      display_element.innerHTML += '<div id="jspsych-visual-search-circle-container" style="position: relative; width:' + paper_size + "px; height:" + paper_size + 'px"></div>';
      var paper = display_element.querySelector("#jspsych-visual-search-circle-container");
      const show_fixation = () => {
        paper.innerHTML += "<img src='" + trial.fixation_image + "' style='position: absolute; top:" + fix_loc[0] + "px; left:" + fix_loc[1] + "px; width:" + trial.fixation_size[0] + "px; height:" + trial.fixation_size[1] + "px;'></img>";
        this.jsPsych.pluginAPI.setTimeout(() => {
          show_search_array();
        }, trial.fixation_duration);
      };
      const response = {
        rt: null,
        key: null,
        correct: false
      };
      const end_trial = () => {
        this.jsPsych.pluginAPI.cancelAllKeyboardResponses();
        const trial_data = {
          correct: response.correct,
          rt: response.rt,
          response: response.key,
          locations: display_locs,
          target_present: trial.target_present,
          set_size: trial.set_size
        };
        this.jsPsych.finishTrial(trial_data);
      };
      show_fixation();
      const show_search_array = () => {
        for (var i = 0; i < display_locs.length; i++) {
          paper.innerHTML += "<img src='" + to_present[i] + "' style='position: absolute; top:" + display_locs[i][0] + "px; left:" + display_locs[i][1] + "px; width:" + trial.target_size[0] + "px; height:" + trial.target_size[1] + "px;'></img>";
        }
        const after_response = (info2) => {
          var correct = false;
          if (this.jsPsych.pluginAPI.compareKeys(info2.key, trial.target_present_key) && trial.target_present || this.jsPsych.pluginAPI.compareKeys(info2.key, trial.target_absent_key) && !trial.target_present) {
            correct = true;
          }
          response.rt = info2.rt;
          response.key = info2.key;
          response.correct = correct;
          if (trial.response_ends_trial) {
            end_trial();
          }
        };
        const valid_keys = [trial.target_present_key, trial.target_absent_key];
        const key_listener = this.jsPsych.pluginAPI.getKeyboardResponse({
          callback_function: after_response,
          valid_responses: valid_keys,
          rt_method: "performance",
          persist: false,
          allow_held_key: false
        });
        if (trial.trial_duration !== null) {
          this.jsPsych.pluginAPI.setTimeout(() => {
            if (!response.rt) {
              this.jsPsych.pluginAPI.cancelKeyboardResponse(key_listener);
            }
            end_trial();
          }, trial.trial_duration);
        }
      };
    }
    generateFixationLoc(trial) {
      var paper_size = trial.circle_diameter + trial.target_size[0];
      return [
        Math.floor(paper_size / 2 - trial.fixation_size[0] / 2),
        Math.floor(paper_size / 2 - trial.fixation_size[1] / 2)
      ];
    }
    generateDisplayLocs(n_locs, trial) {
      var diam = trial.circle_diameter;
      var radi = diam / 2;
      var paper_size = diam + trial.target_size[0];
      var stimh = trial.target_size[0];
      var stimw = trial.target_size[1];
      var hstimh = stimh / 2;
      var hstimw = stimw / 2;
      var display_locs = [];
      var random_offset = Math.floor(Math.random() * 360);
      for (var i = 0; i < n_locs; i++) {
        display_locs.push([
          Math.floor(paper_size / 2 + this.cosd(random_offset + i * (360 / n_locs)) * radi - hstimw),
          Math.floor(paper_size / 2 - this.sind(random_offset + i * (360 / n_locs)) * radi - hstimh)
        ]);
      }
      return display_locs;
    }
    generatePresentationSet(trial) {
      var to_present = [];
      if (trial.target !== null && trial.foil !== null && trial.set_size !== null) {
        if (trial.target_present) {
          for (var i = 0; i < trial.set_size - 1; i++) {
            to_present.push(trial.foil);
          }
          to_present.push(trial.target);
        } else {
          for (var i = 0; i < trial.set_size; i++) {
            to_present.push(trial.foil);
          }
        }
      } else if (trial.stimuli.length > 0) {
        to_present = trial.stimuli;
      } else {
        console.error(
          "Error in visual-search-circle plugin: you must specify an array of images via the stimuli parameter OR specify the target, foil and set_size parameters."
        );
      }
      return to_present;
    }
    cosd(num) {
      return Math.cos(num / 180 * Math.PI);
    }
    sind(num) {
      return Math.sin(num / 180 * Math.PI);
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
      const key = this.jsPsych.pluginAPI.getValidKey([
        trial.target_present_key,
        trial.target_absent_key
      ]);
      const set = this.generatePresentationSet(trial);
      const default_data = {
        correct: trial.target_present ? key == trial.target_present_key : key == trial.target_absent_key,
        response: key,
        rt: this.jsPsych.randomization.sampleExGaussian(500, 50, 1 / 150, true),
        set_size: set.length,
        target_present: trial.target_present,
        locations: this.generateDisplayLocs(set.length, trial)
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
        this.jsPsych.pluginAPI.pressKey(data.response, trial.fixation_duration + data.rt);
      }
    }
  }

  return VisualSearchCirclePlugin;

})(jsPsychModule);
