var jsPsychHtmlAudioResponse = (function (jspsych) {
  'use strict';

  var _package = {
    name: "@jspsych/plugin-html-audio-response",
    version: "2.0.0",
    description: "jsPsych plugin for displaying a stimulus and recording an audio response through the microphone",
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
      test: "jest --passWithNoTests",
      "test:watch": "npm test -- --watch",
      tsc: "tsc",
      build: "rollup --config",
      "build:watch": "npm run build -- --watch"
    },
    repository: {
      type: "git",
      url: "git+https://github.com/jspsych/jsPsych.git",
      directory: "packages/plugin-html-audio-response"
    },
    author: "Josh de Leeuw",
    license: "MIT",
    bugs: {
      url: "https://github.com/jspsych/jsPsych/issues"
    },
    homepage: "https://www.jspsych.org/latest/plugins/html-audio-response",
    peerDependencies: {
      jspsych: ">=7.1.0"
    },
    devDependencies: {
      "@jspsych/config": "^3.0.0",
      "@jspsych/test-utils": "^1.2.0",
      "@types/resize-observer-browser": "^0.1.6"
    }
  };

  const info = {
    name: "html-audio-response",
    version: _package.version,
    parameters: {
      stimulus: {
        type: jspsych.ParameterType.HTML_STRING,
        default: void 0
      },
      stimulus_duration: {
        type: jspsych.ParameterType.INT,
        default: null
      },
      recording_duration: {
        type: jspsych.ParameterType.INT,
        default: 2e3
      },
      show_done_button: {
        type: jspsych.ParameterType.BOOL,
        default: true
      },
      done_button_label: {
        type: jspsych.ParameterType.STRING,
        default: "Continue"
      },
      record_again_button_label: {
        type: jspsych.ParameterType.STRING,
        default: "Record again"
      },
      accept_button_label: {
        type: jspsych.ParameterType.STRING,
        default: "Continue"
      },
      allow_playback: {
        type: jspsych.ParameterType.BOOL,
        default: false
      },
      save_audio_url: {
        type: jspsych.ParameterType.BOOL,
        default: false
      }
    },
    data: {
      rt: {
        type: jspsych.ParameterType.INT
      },
      response: {
        type: jspsych.ParameterType.STRING
      },
      stimulus: {
        type: jspsych.ParameterType.HTML_STRING
      },
      estimated_stimulus_onset: {
        type: jspsych.ParameterType.INT
      },
      audio_url: {
        type: jspsych.ParameterType.STRING
      }
    }
  };
  class HtmlAudioResponsePlugin {
    constructor(jsPsych) {
      this.jsPsych = jsPsych;
    }
    static info = info;
    stimulus_start_time;
    recorder_start_time;
    recorder;
    audio_url;
    response;
    load_resolver;
    rt = null;
    start_event_handler;
    stop_event_handler;
    data_available_handler;
    recorded_data_chunks = [];
    trial(display_element, trial) {
      this.recorder = this.jsPsych.pluginAPI.getMicrophoneRecorder();
      this.setupRecordingEvents(display_element, trial);
      this.startRecording();
    }
    showDisplay(display_element, trial) {
      const ro = new ResizeObserver((entries, observer) => {
        this.stimulus_start_time = performance.now();
        observer.unobserve(display_element);
      });
      ro.observe(display_element);
      let html = `<div id="jspsych-html-audio-response-stimulus">${trial.stimulus}</div>`;
      if (trial.show_done_button) {
        html += `<p><button class="jspsych-btn" id="finish-trial">${trial.done_button_label}</button></p>`;
      }
      display_element.innerHTML = html;
    }
    hideStimulus(display_element) {
      const el = display_element.querySelector("#jspsych-html-audio-response-stimulus");
      if (el) {
        el.style.visibility = "hidden";
      }
    }
    addButtonEvent(display_element, trial) {
      const btn = display_element.querySelector("#finish-trial");
      if (btn) {
        btn.addEventListener("click", () => {
          const end_time = performance.now();
          this.rt = Math.round(end_time - this.stimulus_start_time);
          this.stopRecording().then(() => {
            if (trial.allow_playback) {
              this.showPlaybackControls(display_element, trial);
            } else {
              this.endTrial(display_element, trial);
            }
          });
        });
      }
    }
    setupRecordingEvents(display_element, trial) {
      this.data_available_handler = (e) => {
        if (e.data.size > 0) {
          this.recorded_data_chunks.push(e.data);
        }
      };
      this.stop_event_handler = () => {
        const data = new Blob(this.recorded_data_chunks, { type: "audio/webm" });
        this.audio_url = URL.createObjectURL(data);
        const reader = new FileReader();
        reader.addEventListener("load", () => {
          const base64 = reader.result.split(",")[1];
          this.response = base64;
          this.load_resolver();
        });
        reader.readAsDataURL(data);
      };
      this.start_event_handler = (e) => {
        this.recorded_data_chunks.length = 0;
        this.recorder_start_time = e.timeStamp;
        this.showDisplay(display_element, trial);
        this.addButtonEvent(display_element, trial);
        if (trial.stimulus_duration !== null) {
          this.jsPsych.pluginAPI.setTimeout(() => {
            this.hideStimulus(display_element);
          }, trial.stimulus_duration);
        }
        if (trial.recording_duration !== null) {
          this.jsPsych.pluginAPI.setTimeout(() => {
            if (this.recorder.state !== "inactive") {
              this.stopRecording().then(() => {
                if (trial.allow_playback) {
                  this.showPlaybackControls(display_element, trial);
                } else {
                  this.endTrial(display_element, trial);
                }
              });
            }
          }, trial.recording_duration);
        }
      };
      this.recorder.addEventListener("dataavailable", this.data_available_handler);
      this.recorder.addEventListener("stop", this.stop_event_handler);
      this.recorder.addEventListener("start", this.start_event_handler);
    }
    startRecording() {
      this.recorder.start();
    }
    stopRecording() {
      this.recorder.stop();
      return new Promise((resolve) => {
        this.load_resolver = resolve;
      });
    }
    showPlaybackControls(display_element, trial) {
      display_element.innerHTML = `
      <p><audio id="playback" src="${this.audio_url}" controls></audio></p>
      <button id="record-again" class="jspsych-btn">${trial.record_again_button_label}</button>
      <button id="continue" class="jspsych-btn">${trial.accept_button_label}</button>
    `;
      display_element.querySelector("#record-again").addEventListener("click", () => {
        URL.revokeObjectURL(this.audio_url);
        this.startRecording();
      });
      display_element.querySelector("#continue").addEventListener("click", () => {
        this.endTrial(display_element, trial);
      });
    }
    endTrial(display_element, trial) {
      this.recorder.removeEventListener("dataavailable", this.data_available_handler);
      this.recorder.removeEventListener("start", this.start_event_handler);
      this.recorder.removeEventListener("stop", this.stop_event_handler);
      var trial_data = {
        rt: this.rt,
        stimulus: trial.stimulus,
        response: this.response,
        estimated_stimulus_onset: Math.round(this.stimulus_start_time - this.recorder_start_time)
      };
      if (trial.save_audio_url) {
        trial_data.audio_url = this.audio_url;
      } else {
        URL.revokeObjectURL(this.audio_url);
      }
      this.jsPsych.finishTrial(trial_data);
    }
  }

  return HtmlAudioResponsePlugin;

})(jsPsychModule);
