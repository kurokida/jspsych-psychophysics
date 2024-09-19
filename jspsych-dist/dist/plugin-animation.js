var jsPsychAnimation = (function (jspsych) {
  'use strict';

  var _package = {
    name: "@jspsych/plugin-animation",
    version: "2.0.0",
    description: "jsPsych plugin for showing animations and recording keyboard responses",
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
      directory: "packages/plugin-animation"
    },
    author: "Josh de Leeuw",
    license: "MIT",
    bugs: {
      url: "https://github.com/jspsych/jsPsych/issues"
    },
    homepage: "https://www.jspsych.org/latest/plugins/animation",
    peerDependencies: {
      jspsych: ">=7.1.0"
    },
    devDependencies: {
      "@jspsych/config": "^3.0.0",
      "@jspsych/test-utils": "^1.2.0"
    }
  };

  const info = {
    name: "animation",
    version: _package.version,
    parameters: {
      stimuli: {
        type: jspsych.ParameterType.IMAGE,
        default: void 0,
        array: true
      },
      frame_time: {
        type: jspsych.ParameterType.INT,
        default: 250
      },
      frame_isi: {
        type: jspsych.ParameterType.INT,
        default: 0
      },
      sequence_reps: {
        type: jspsych.ParameterType.INT,
        default: 1
      },
      choices: {
        type: jspsych.ParameterType.KEYS,
        default: "ALL_KEYS"
      },
      prompt: {
        type: jspsych.ParameterType.HTML_STRING,
        default: null
      },
      render_on_canvas: {
        type: jspsych.ParameterType.BOOL,
        default: true
      }
    },
    data: {
      animation_sequence: {
        type: jspsych.ParameterType.COMPLEX,
        array: true,
        parameters: {
          stimulus: {
            type: jspsych.ParameterType.STRING
          },
          time: {
            type: jspsych.ParameterType.INT
          }
        }
      },
      response: {
        type: jspsych.ParameterType.COMPLEX,
        array: true,
        parameters: {
          stimulus: {
            type: jspsych.ParameterType.STRING
          },
          rt: {
            type: jspsych.ParameterType.INT
          },
          key_press: {
            type: jspsych.ParameterType.STRING
          }
        }
      }
    }
  };
  class AnimationPlugin {
    constructor(jsPsych) {
      this.jsPsych = jsPsych;
    }
    static info = info;
    trial(display_element, trial) {
      var interval_time = trial.frame_time + trial.frame_isi;
      var animate_frame = 0;
      var reps = 0;
      var startTime = performance.now();
      var animation_sequence = [];
      var responses = [];
      var current_stim = "";
      if (trial.render_on_canvas) {
        if (display_element.hasChildNodes()) {
          while (display_element.firstChild) {
            display_element.removeChild(display_element.firstChild);
          }
        }
        var canvas = document.createElement("canvas");
        canvas.id = "jspsych-animation-image";
        canvas.style.margin = "0";
        canvas.style.padding = "0";
        display_element.insertBefore(canvas, null);
        var ctx = canvas.getContext("2d");
      }
      const endTrial = () => {
        this.jsPsych.pluginAPI.cancelKeyboardResponse(response_listener);
        var trial_data = {
          animation_sequence,
          response: responses
        };
        this.jsPsych.finishTrial(trial_data);
      };
      var animate_interval = setInterval(() => {
        var showImage = true;
        if (!trial.render_on_canvas) {
          display_element.innerHTML = "";
        }
        animate_frame++;
        if (animate_frame == trial.stimuli.length) {
          animate_frame = 0;
          reps++;
          if (reps >= trial.sequence_reps) {
            endTrial();
            clearInterval(animate_interval);
            showImage = false;
          }
        }
        if (showImage) {
          show_next_frame();
        }
      }, interval_time);
      const show_next_frame = () => {
        if (trial.render_on_canvas) {
          display_element.querySelector("#jspsych-animation-image").style.visibility = "visible";
          var img = new Image();
          img.src = trial.stimuli[animate_frame];
          canvas.height = img.naturalHeight;
          canvas.width = img.naturalWidth;
          ctx.drawImage(img, 0, 0);
          if (trial.prompt !== null && animate_frame == 0 && reps == 0) {
            display_element.insertAdjacentHTML("beforeend", trial.prompt);
          }
        } else {
          display_element.innerHTML = '<img src="' + trial.stimuli[animate_frame] + '" id="jspsych-animation-image"></img>';
          if (trial.prompt !== null) {
            display_element.innerHTML += trial.prompt;
          }
        }
        current_stim = trial.stimuli[animate_frame];
        animation_sequence.push({
          stimulus: trial.stimuli[animate_frame],
          time: Math.round(performance.now() - startTime)
        });
        if (trial.frame_isi > 0) {
          this.jsPsych.pluginAPI.setTimeout(() => {
            display_element.querySelector("#jspsych-animation-image").style.visibility = "hidden";
            current_stim = "blank";
            animation_sequence.push({
              stimulus: "blank",
              time: Math.round(performance.now() - startTime)
            });
          }, trial.frame_time);
        }
      };
      var after_response = (info2) => {
        responses.push({
          key_press: info2.key,
          rt: info2.rt,
          stimulus: current_stim
        });
        display_element.querySelector("#jspsych-animation-image").className += " responded";
      };
      var response_listener = this.jsPsych.pluginAPI.getKeyboardResponse({
        callback_function: after_response,
        valid_responses: trial.choices,
        rt_method: "performance",
        persist: true,
        allow_held_key: false
      });
      show_next_frame();
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
      const fake_animation_sequence = [];
      const fake_responses = [];
      let t = 0;
      const check_if_fake_response_generated = () => {
        return this.jsPsych.randomization.sampleWithReplacement([true, false], 1, [1, 10])[0];
      };
      for (let i = 0; i < trial.sequence_reps; i++) {
        for (const frame of trial.stimuli) {
          fake_animation_sequence.push({
            stimulus: frame,
            time: t
          });
          if (check_if_fake_response_generated()) {
            fake_responses.push({
              key_press: this.jsPsych.pluginAPI.getValidKey(trial.choices),
              rt: t + this.jsPsych.randomization.randomInt(0, trial.frame_time - 1),
              current_stim: frame
            });
          }
          t += trial.frame_time;
          if (trial.frame_isi > 0) {
            fake_animation_sequence.push({
              stimulus: "blank",
              time: t
            });
            if (check_if_fake_response_generated()) {
              fake_responses.push({
                key_press: this.jsPsych.pluginAPI.getValidKey(trial.choices),
                rt: t + this.jsPsych.randomization.randomInt(0, trial.frame_isi - 1),
                current_stim: "blank"
              });
            }
            t += trial.frame_isi;
          }
        }
      }
      const default_data = {
        animation_sequence: fake_animation_sequence,
        response: fake_responses
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
      for (const response of data.response) {
        this.jsPsych.pluginAPI.pressKey(response.key_press, response.rt);
      }
    }
  }

  return AnimationPlugin;

})(jsPsychModule);
