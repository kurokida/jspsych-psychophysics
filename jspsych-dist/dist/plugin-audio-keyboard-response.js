var jsPsychAudioKeyboardResponse = (function (jspsych) {
	'use strict';

	function getDefaultExportFromCjs (x) {
		return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
	}

	// Gets all non-builtin properties up the prototype chain
	const getAllProperties = object => {
		const properties = new Set();

		do {
			for (const key of Reflect.ownKeys(object)) {
				properties.add([object, key]);
			}
		} while ((object = Reflect.getPrototypeOf(object)) && object !== Object.prototype);

		return properties;
	};

	var autoBind = (self, {include, exclude} = {}) => {
		const filter = key => {
			const match = pattern => typeof pattern === 'string' ? key === pattern : pattern.test(key);

			if (include) {
				return include.some(match);
			}

			if (exclude) {
				return !exclude.some(match);
			}

			return true;
		};

		for (const [object, key] of getAllProperties(self.constructor.prototype)) {
			if (key === 'constructor' || !filter(key)) {
				continue;
			}

			const descriptor = Reflect.getOwnPropertyDescriptor(object, key);
			if (descriptor && typeof descriptor.value === 'function') {
				self[key] = self[key].bind(self);
			}
		}

		return self;
	};

	var autoBind$1 = /*@__PURE__*/getDefaultExportFromCjs(autoBind);

	var _package = {
	  name: "@jspsych/plugin-audio-keyboard-response",
	  version: "2.0.0",
	  description: "jsPsych plugin for playing an audio file and getting a keyboard response",
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
	    directory: "packages/plugin-audio-keyboard-response"
	  },
	  author: "Josh de Leeuw",
	  license: "MIT",
	  bugs: {
	    url: "https://github.com/jspsych/jsPsych/issues"
	  },
	  homepage: "https://www.jspsych.org/latest/plugins/audio-keyboard-response",
	  peerDependencies: {
	    jspsych: ">=7.1.0"
	  },
	  devDependencies: {
	    "@jspsych/config": "^3.0.0",
	    "@jspsych/test-utils": "^1.2.0"
	  }
	};

	const info = {
	  name: "audio-keyboard-response",
	  version: _package.version,
	  parameters: {
	    stimulus: {
	      type: jspsych.ParameterType.AUDIO,
	      default: void 0
	    },
	    choices: {
	      type: jspsych.ParameterType.KEYS,
	      default: "ALL_KEYS"
	    },
	    prompt: {
	      type: jspsych.ParameterType.HTML_STRING,
	      pretty_name: "Prompt",
	      default: null
	    },
	    trial_duration: {
	      type: jspsych.ParameterType.INT,
	      default: null
	    },
	    response_ends_trial: {
	      type: jspsych.ParameterType.BOOL,
	      default: true
	    },
	    trial_ends_after_audio: {
	      type: jspsych.ParameterType.BOOL,
	      pretty_name: "Trial ends after audio",
	      default: false
	    },
	    response_allowed_while_playing: {
	      type: jspsych.ParameterType.BOOL,
	      default: true
	    }
	  },
	  data: {
	    response: {
	      type: jspsych.ParameterType.STRING
	    },
	    rt: {
	      type: jspsych.ParameterType.INT
	    },
	    stimulus: {
	      type: jspsych.ParameterType.STRING
	    }
	  }
	};
	class AudioKeyboardResponsePlugin {
	  constructor(jsPsych) {
	    this.jsPsych = jsPsych;
	    autoBind$1(this);
	  }
	  static info = info;
	  audio;
	  params;
	  display;
	  response = { rt: null, key: null };
	  startTime;
	  finish;
	  trial(display_element, trial, on_load) {
	    return new Promise(async (resolve) => {
	      this.finish = resolve;
	      this.params = trial;
	      this.display = display_element;
	      this.audio = await this.jsPsych.pluginAPI.getAudioPlayer(trial.stimulus);
	      if (trial.trial_ends_after_audio) {
	        this.audio.addEventListener("ended", this.end_trial);
	      }
	      if (trial.prompt !== null) {
	        display_element.innerHTML = trial.prompt;
	      }
	      this.startTime = this.jsPsych.pluginAPI.audioContext()?.currentTime;
	      if (trial.response_allowed_while_playing) {
	        this.setup_keyboard_listener();
	      } else if (!trial.trial_ends_after_audio) {
	        this.audio.addEventListener("ended", this.setup_keyboard_listener);
	      }
	      if (trial.trial_duration !== null) {
	        this.jsPsych.pluginAPI.setTimeout(() => {
	          this.end_trial();
	        }, trial.trial_duration);
	      }
	      on_load();
	      this.audio.play();
	    });
	  }
	  end_trial() {
	    this.jsPsych.pluginAPI.clearAllTimeouts();
	    this.audio.stop();
	    this.audio.removeEventListener("ended", this.end_trial);
	    this.audio.removeEventListener("ended", this.setup_keyboard_listener);
	    this.jsPsych.pluginAPI.cancelAllKeyboardResponses();
	    var trial_data = {
	      rt: this.response.rt,
	      response: this.response.key,
	      stimulus: this.params.stimulus
	    };
	    this.display.innerHTML = "";
	    this.finish(trial_data);
	  }
	  after_response(info2) {
	    this.response = info2;
	    if (this.params.response_ends_trial) {
	      this.end_trial();
	    }
	  }
	  setup_keyboard_listener() {
	    if (this.jsPsych.pluginAPI.useWebaudio) {
	      this.jsPsych.pluginAPI.getKeyboardResponse({
	        callback_function: this.after_response,
	        valid_responses: this.params.choices,
	        rt_method: "audio",
	        persist: false,
	        allow_held_key: false,
	        audio_context: this.jsPsych.pluginAPI.audioContext(),
	        audio_context_start_time: this.startTime
	      });
	    } else {
	      this.jsPsych.pluginAPI.getKeyboardResponse({
	        callback_function: this.after_response,
	        valid_responses: this.params.choices,
	        rt_method: "performance",
	        persist: false,
	        allow_held_key: false
	      });
	    }
	  }
	  async simulate(trial, simulation_mode, simulation_options, load_callback) {
	    if (simulation_mode == "data-only") {
	      load_callback();
	      return this.simulate_data_only(trial, simulation_options);
	    }
	    if (simulation_mode == "visual") {
	      return this.simulate_visual(trial, simulation_options, load_callback);
	    }
	  }
	  simulate_data_only(trial, simulation_options) {
	    const data = this.create_simulation_data(trial, simulation_options);
	    return data;
	  }
	  async simulate_visual(trial, simulation_options, load_callback) {
	    const data = this.create_simulation_data(trial, simulation_options);
	    const display_element = this.jsPsych.getDisplayElement();
	    const respond = () => {
	      if (data.rt !== null) {
	        this.jsPsych.pluginAPI.pressKey(data.response, data.rt);
	      }
	    };
	    const result = await this.trial(display_element, trial, () => {
	      load_callback();
	      if (!trial.response_allowed_while_playing) {
	        this.audio.addEventListener("ended", respond);
	      } else {
	        respond();
	      }
	    });
	    return result;
	  }
	  create_simulation_data(trial, simulation_options) {
	    const default_data = {
	      stimulus: trial.stimulus,
	      rt: this.jsPsych.randomization.sampleExGaussian(500, 50, 1 / 150, true),
	      response: this.jsPsych.pluginAPI.getValidKey(trial.choices)
	    };
	    const data = this.jsPsych.pluginAPI.mergeSimulationData(default_data, simulation_options);
	    this.jsPsych.pluginAPI.ensureSimulationDataConsistency(trial, data);
	    return data;
	  }
	}

	return AudioKeyboardResponsePlugin;

})(jsPsychModule);
