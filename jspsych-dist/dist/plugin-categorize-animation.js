var jsPsychCategorizeAnimation = (function (jspsych) {
  'use strict';

  var _package = {
    name: "@jspsych/plugin-categorize-animation",
    version: "2.0.0",
    description: "jspsych plugin for categorization trials with feedback and animated stimuli",
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
      directory: "packages/plugin-categorize-animation"
    },
    author: "Josh de Leeuw",
    license: "MIT",
    bugs: {
      url: "https://github.com/jspsych/jsPsych/issues"
    },
    homepage: "https://www.jspsych.org/latest/plugins/categorize-animation",
    peerDependencies: {
      jspsych: ">=7.1.0"
    },
    devDependencies: {
      "@jspsych/config": "^3.0.0",
      "@jspsych/test-utils": "^1.2.0"
    }
  };

  const info = {
    name: "categorize-animation",
    version: _package.version,
    parameters: {
      stimuli: {
        type: jspsych.ParameterType.IMAGE,
        default: void 0,
        array: true
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
        default: "Correct."
      },
      incorrect_text: {
        type: jspsych.ParameterType.HTML_STRING,
        default: "Wrong."
      },
      frame_time: {
        type: jspsych.ParameterType.INT,
        default: 500
      },
      sequence_reps: {
        type: jspsych.ParameterType.INT,
        default: 1
      },
      allow_response_before_complete: {
        type: jspsych.ParameterType.BOOL,
        default: false
      },
      feedback_duration: {
        type: jspsych.ParameterType.INT,
        default: 2e3
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
      stimulus: {
        type: jspsych.ParameterType.STRING,
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
      }
    }
  };
  class CategorizeAnimationPlugin {
    constructor(jsPsych) {
      this.jsPsych = jsPsych;
    }
    static info = info;
    trial(display_element, trial) {
      var animate_frame = 0;
      var reps = 0;
      var showAnimation = true;
      var responded = false;
      var timeoutSet = false;
      var correct;
      if (trial.render_on_canvas) {
        if (display_element.hasChildNodes()) {
          while (display_element.firstChild) {
            display_element.removeChild(display_element.firstChild);
          }
        }
        var canvas = document.createElement("canvas");
        canvas.id = "jspsych-categorize-animation-stimulus";
        canvas.style.margin = "0";
        canvas.style.padding = "0";
        display_element.insertBefore(canvas, null);
        var ctx = canvas.getContext("2d");
        if (trial.prompt !== null) {
          var prompt_div = document.createElement("div");
          prompt_div.id = "jspsych-categorize-animation-prompt";
          prompt_div.style.visibility = "hidden";
          prompt_div.innerHTML = trial.prompt;
          display_element.insertBefore(prompt_div, canvas.nextElementSibling);
        }
        var feedback_div = document.createElement("div");
        display_element.insertBefore(feedback_div, display_element.nextElementSibling);
      }
      const update_display = () => {
        if (showAnimation) {
          if (trial.render_on_canvas) {
            display_element.querySelector(
              "#jspsych-categorize-animation-stimulus"
            ).style.visibility = "visible";
            var img = new Image();
            img.src = trial.stimuli[animate_frame];
            canvas.height = img.naturalHeight;
            canvas.width = img.naturalWidth;
            ctx.drawImage(img, 0, 0);
          } else {
            display_element.innerHTML += '<img src="' + trial.stimuli[animate_frame] + '" class="jspsych-categorize-animation-stimulus"></img>';
          }
        }
        if (!responded && trial.allow_response_before_complete) {
          if (trial.prompt !== null) {
            if (trial.render_on_canvas) {
              prompt_div.style.visibility = "visible";
            } else {
              display_element.innerHTML += trial.prompt;
            }
          }
          if (trial.render_on_canvas) {
            if (!showAnimation) {
              canvas.remove();
            }
          }
        } else if (!responded) {
          if (!showAnimation) {
            if (trial.prompt !== null) {
              if (trial.render_on_canvas) {
                prompt_div.style.visibility = "visible";
              } else {
                display_element.innerHTML += trial.prompt;
              }
            }
            if (trial.render_on_canvas) {
              canvas.remove();
            }
          }
        } else {
          var feedback_text = "";
          if (correct) {
            feedback_text = trial.correct_text.replace("%ANS%", trial.text_answer);
          } else {
            feedback_text = trial.incorrect_text.replace("%ANS%", trial.text_answer);
          }
          if (trial.render_on_canvas) {
            if (trial.prompt !== null) {
              prompt_div.remove();
            }
            feedback_div.innerHTML = feedback_text;
          } else {
            display_element.innerHTML += feedback_text;
          }
          if (!timeoutSet) {
            timeoutSet = true;
            this.jsPsych.pluginAPI.setTimeout(() => {
              endTrial();
            }, trial.feedback_duration);
          }
        }
      };
      var animate_interval = setInterval(() => {
        if (!trial.render_on_canvas) {
          display_element.innerHTML = "";
        }
        animate_frame++;
        if (animate_frame == trial.stimuli.length) {
          animate_frame = 0;
          reps++;
          if (trial.sequence_reps != -1 && reps >= trial.sequence_reps) {
            showAnimation = false;
          }
        }
        update_display();
      }, trial.frame_time);
      update_display();
      const endTrial = () => {
        clearInterval(animate_interval);
        this.jsPsych.finishTrial(trial_data);
      };
      var keyboard_listener;
      var trial_data = {};
      const after_response = (info2) => {
        if (!trial.allow_response_before_complete && showAnimation) {
          return false;
        }
        correct = false;
        if (this.jsPsych.pluginAPI.compareKeys(trial.key_answer, info2.key)) {
          correct = true;
        }
        responded = true;
        trial_data = {
          stimulus: trial.stimuli,
          rt: info2.rt,
          correct,
          response: info2.key
        };
        this.jsPsych.pluginAPI.cancelKeyboardResponse(keyboard_listener);
      };
      keyboard_listener = this.jsPsych.pluginAPI.getKeyboardResponse({
        callback_function: after_response,
        valid_responses: trial.choices,
        rt_method: "performance",
        persist: true,
        allow_held_key: false
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
      const animation_length = trial.sequence_reps * trial.frame_time * trial.stimuli.length;
      const key = this.jsPsych.pluginAPI.getValidKey(trial.choices);
      const default_data = {
        stimulus: trial.stimuli,
        rt: animation_length + this.jsPsych.randomization.sampleExGaussian(500, 50, 1 / 150, true),
        response: key,
        correct: key == trial.key_answer
      };
      const data = this.jsPsych.pluginAPI.mergeSimulationData(default_data, simulation_options);
      this.jsPsych.pluginAPI.ensureSimulationDataConsistency(trial, data);
      return data;
    }
    simulate_data_only(trial, simulation_options) {
      const data = this.create_simulation_data(trial, simulation_options);
      if (data.rt == null || data.response == null) {
        throw new Error(`
        Simulated response for categorize-animation plugin was invalid. 
        This could be because the response RT was too fast and generated
        before the animation finished when the allow_response_before_complete
        parameter is false. In a real experiment this would cause the experiment
        to pause indefinitely.`);
      } else {
        this.jsPsych.finishTrial(data);
      }
    }
    simulate_visual(trial, simulation_options, load_callback) {
      const data = this.create_simulation_data(trial, simulation_options);
      const display_element = this.jsPsych.getDisplayElement();
      this.trial(display_element, trial);
      load_callback();
      if (data.rt !== null) {
        this.jsPsych.pluginAPI.pressKey(data.response, data.rt);
      } else {
        throw new Error(`
        Simulated response for categorize-animation plugin was invalid. 
        This could be because the response RT was too fast and generated
        before the animation finished when the allow_response_before_complete
        parameter is false. In a real experiment this would cause the experiment
        to pause indefinitely.`);
      }
    }
  }

  return CategorizeAnimationPlugin;

})(jsPsychModule);
