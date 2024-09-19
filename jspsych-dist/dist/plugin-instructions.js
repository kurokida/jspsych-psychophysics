var jsPsychInstructions = (function (jspsych) {
  'use strict';

  var _package = {
    name: "@jspsych/plugin-instructions",
    version: "2.0.0",
    description: "jsPsych plugin to display instructions",
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
      directory: "packages/plugin-instructions"
    },
    author: "Josh de Leeuw",
    license: "MIT",
    bugs: {
      url: "https://github.com/jspsych/jsPsych/issues"
    },
    homepage: "https://www.jspsych.org/latest/plugins/instructions",
    peerDependencies: {
      jspsych: ">=7.1.0"
    },
    devDependencies: {
      "@jspsych/config": "^3.0.0",
      "@jspsych/test-utils": "^1.2.0"
    }
  };

  const info = {
    name: "instructions",
    version: _package.version,
    parameters: {
      pages: {
        type: jspsych.ParameterType.HTML_STRING,
        default: void 0,
        array: true
      },
      key_forward: {
        type: jspsych.ParameterType.KEY,
        default: "ArrowRight"
      },
      key_backward: {
        type: jspsych.ParameterType.KEY,
        default: "ArrowLeft"
      },
      allow_backward: {
        type: jspsych.ParameterType.BOOL,
        default: true
      },
      allow_keys: {
        type: jspsych.ParameterType.BOOL,
        default: true
      },
      show_clickable_nav: {
        type: jspsych.ParameterType.BOOL,
        default: false
      },
      show_page_number: {
        type: jspsych.ParameterType.BOOL,
        default: false
      },
      page_label: {
        type: jspsych.ParameterType.STRING,
        default: "Page"
      },
      button_label_previous: {
        type: jspsych.ParameterType.STRING,
        default: "Previous"
      },
      button_label_next: {
        type: jspsych.ParameterType.STRING,
        default: "Next"
      },
      on_page_change: {
        type: jspsych.ParameterType.FUNCTION,
        pretty_name: "Page change callback",
        default: function(current_page) {
        }
      }
    },
    data: {
      view_history: {
        type: jspsych.ParameterType.COMPLEX,
        array: true,
        parameters: {
          page_index: {
            type: jspsych.ParameterType.INT
          },
          viewing_time: {
            type: jspsych.ParameterType.INT
          }
        }
      },
      rt: {
        type: jspsych.ParameterType.INT
      }
    }
  };
  class InstructionsPlugin {
    constructor(jsPsych) {
      this.jsPsych = jsPsych;
    }
    static info = info;
    trial(display_element, trial) {
      var current_page = 0;
      var view_history = [];
      var start_time = performance.now();
      var last_page_update_time = start_time;
      function btnListener() {
        if (this.id === "jspsych-instructions-back") {
          back();
        } else if (this.id === "jspsych-instructions-next") {
          next();
        }
      }
      function show_current_page() {
        var html = trial.pages[current_page];
        var pagenum_display = "";
        if (trial.show_page_number) {
          pagenum_display = "<span style='margin: 0 1em;' class='jspsych-instructions-pagenum'>" + trial.page_label + " " + (current_page + 1) + "/" + trial.pages.length + "</span>";
        }
        if (trial.show_clickable_nav) {
          var nav_html = "<div class='jspsych-instructions-nav' style='padding: 10px 0px;'>";
          if (trial.allow_backward) {
            var allowed = current_page > 0 ? "" : "disabled='disabled'";
            nav_html += "<button id='jspsych-instructions-back' class='jspsych-btn' style='margin-right: 5px;' " + allowed + ">&lt; " + trial.button_label_previous + "</button>";
          }
          if (trial.pages.length > 1 && trial.show_page_number) {
            nav_html += pagenum_display;
          }
          nav_html += "<button id='jspsych-instructions-next' class='jspsych-btn'style='margin-left: 5px;'>" + trial.button_label_next + " &gt;</button></div>";
          html += nav_html;
          display_element.innerHTML = html;
          if (current_page != 0 && trial.allow_backward) {
            display_element.querySelector("#jspsych-instructions-back").addEventListener("click", btnListener, { once: true });
          }
          display_element.querySelector("#jspsych-instructions-next").addEventListener("click", btnListener, { once: true });
        } else {
          if (trial.show_page_number && trial.pages.length > 1) {
            html += "<div class='jspsych-instructions-pagenum'>" + pagenum_display + "</div>";
          }
          display_element.innerHTML = html;
        }
      }
      function next() {
        add_current_page_to_view_history();
        current_page++;
        if (current_page >= trial.pages.length) {
          endTrial();
        } else {
          show_current_page();
        }
        trial.on_page_change(current_page);
      }
      function back() {
        add_current_page_to_view_history();
        current_page--;
        show_current_page();
        trial.on_page_change(current_page);
      }
      function add_current_page_to_view_history() {
        var current_time = performance.now();
        var page_view_time = Math.round(current_time - last_page_update_time);
        view_history.push({
          page_index: current_page,
          viewing_time: page_view_time
        });
        last_page_update_time = current_time;
      }
      const endTrial = () => {
        if (trial.allow_keys) {
          this.jsPsych.pluginAPI.cancelKeyboardResponse(keyboard_listener);
        }
        var trial_data = {
          view_history,
          rt: Math.round(performance.now() - start_time)
        };
        this.jsPsych.finishTrial(trial_data);
      };
      const after_response = (info2) => {
        keyboard_listener = this.jsPsych.pluginAPI.getKeyboardResponse({
          callback_function: after_response,
          valid_responses: [trial.key_forward, trial.key_backward],
          rt_method: "performance",
          persist: false,
          allow_held_key: false
        });
        if (this.jsPsych.pluginAPI.compareKeys(info2.key, trial.key_backward)) {
          if (current_page !== 0 && trial.allow_backward) {
            back();
          }
        }
        if (this.jsPsych.pluginAPI.compareKeys(info2.key, trial.key_forward)) {
          next();
        }
      };
      show_current_page();
      if (trial.allow_keys) {
        var keyboard_listener = this.jsPsych.pluginAPI.getKeyboardResponse({
          callback_function: after_response,
          valid_responses: [trial.key_forward, trial.key_backward],
          rt_method: "performance",
          persist: false
        });
      }
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
      let curr_page = 0;
      let rt = 0;
      let view_history = [];
      if (!simulation_options.data?.view_history && !simulation_options.data?.rt) {
        while (curr_page !== trial.pages.length) {
          const view_time = Math.round(
            this.jsPsych.randomization.sampleExGaussian(3e3, 300, 1 / 300)
          );
          view_history.push({ page_index: curr_page, viewing_time: view_time });
          rt += view_time;
          if (curr_page == 0 || !trial.allow_backward) {
            curr_page++;
          } else {
            if (this.jsPsych.randomization.sampleBernoulli(0.9) == 1) {
              curr_page++;
            } else {
              curr_page--;
            }
          }
        }
      }
      if (!simulation_options.data?.view_history && simulation_options.data?.rt) {
        rt = simulation_options.data.rt;
        while (curr_page !== trial.pages.length) {
          view_history.push({ page_index: curr_page, viewing_time: null });
          if (curr_page == 0 || !trial.allow_backward) {
            curr_page++;
          } else {
            if (this.jsPsych.randomization.sampleBernoulli(0.9) == 1) {
              curr_page++;
            } else {
              curr_page--;
            }
          }
        }
        const avg_rt_per_page = simulation_options.data.rt / view_history.length;
        let total_time = 0;
        for (const page of view_history) {
          const t = Math.round(
            this.jsPsych.randomization.sampleExGaussian(
              avg_rt_per_page,
              avg_rt_per_page / 10,
              1 / (avg_rt_per_page / 10)
            )
          );
          page.viewing_time = t;
          total_time += t;
        }
        const diff = simulation_options.data.rt - total_time;
        const diff_per_page = Math.round(diff / view_history.length);
        for (const page of view_history) {
          page.viewing_time += diff_per_page;
        }
      }
      if (simulation_options.data?.view_history && !simulation_options.data?.rt) {
        view_history = simulation_options.data.view_history;
        rt = 0;
        for (const page of simulation_options.data.view_history) {
          rt += page.viewing_time;
        }
      }
      const default_data = {
        view_history,
        rt
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
      const advance = (rt) => {
        if (trial.allow_keys) {
          this.jsPsych.pluginAPI.pressKey(trial.key_forward, rt);
        } else if (trial.show_clickable_nav) {
          this.jsPsych.pluginAPI.clickTarget(
            display_element.querySelector("#jspsych-instructions-next"),
            rt
          );
        }
      };
      const backup = (rt) => {
        if (trial.allow_keys) {
          this.jsPsych.pluginAPI.pressKey(trial.key_backward, rt);
        } else if (trial.show_clickable_nav) {
          this.jsPsych.pluginAPI.clickTarget(
            display_element.querySelector("#jspsych-instructions-back"),
            rt
          );
        }
      };
      let curr_page = 0;
      let t = 0;
      for (let i = 0; i < data.view_history.length; i++) {
        if (i == data.view_history.length - 1) {
          advance(t + data.view_history[i].viewing_time);
        } else {
          if (data.view_history[i + 1].page_index > curr_page) {
            advance(t + data.view_history[i].viewing_time);
          }
          if (data.view_history[i + 1].page_index < curr_page) {
            backup(t + data.view_history[i].viewing_time);
          }
          t += data.view_history[i].viewing_time;
          curr_page = data.view_history[i + 1].page_index;
        }
      }
    }
  }

  return InstructionsPlugin;

})(jsPsychModule);
