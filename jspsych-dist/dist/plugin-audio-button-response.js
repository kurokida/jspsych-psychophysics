var jsPsychAudioButtonResponse = (function (jspsych) {
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
	  name: "@jspsych/plugin-audio-button-response",
	  version: "2.0.1",
	  description: "jsPsych plugin for playing an audio file and getting a button response",
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
	    directory: "packages/plugin-audio-button-response"
	  },
	  author: "Kristin Diep",
	  license: "MIT",
	  bugs: {
	    url: "https://github.com/jspsych/jsPsych/issues"
	  },
	  homepage: "https://www.jspsych.org/latest/plugins/audio-button-response",
	  peerDependencies: {
	    jspsych: ">=7.1.0"
	  },
	  devDependencies: {
	    "@jspsych/config": "^3.0.0",
	    "@jspsych/test-utils": "^1.2.0"
	  }
	};

	const info = {
	  name: "audio-button-response",
	  version: _package.version,
	  parameters: {
	    stimulus: {
	      type: jspsych.ParameterType.AUDIO,
	      default: void 0
	    },
	    choices: {
	      type: jspsych.ParameterType.STRING,
	      default: void 0,
	      array: true
	    },
	    button_html: {
	      type: jspsych.ParameterType.FUNCTION,
	      default: function(choice, choice_index) {
	        return `<button class="jspsych-btn">${choice}</button>`;
	      }
	    },
	    prompt: {
	      type: jspsych.ParameterType.HTML_STRING,
	      default: null
	    },
	    trial_duration: {
	      type: jspsych.ParameterType.INT,
	      default: null
	    },
	    button_layout: {
	      type: jspsych.ParameterType.STRING,
	      default: "grid"
	    },
	    grid_rows: {
	      type: jspsych.ParameterType.INT,
	      default: 1
	    },
	    grid_columns: {
	      type: jspsych.ParameterType.INT,
	      default: null
	    },
	    response_ends_trial: {
	      type: jspsych.ParameterType.BOOL,
	      default: true
	    },
	    trial_ends_after_audio: {
	      type: jspsych.ParameterType.BOOL,
	      default: false
	    },
	    response_allowed_while_playing: {
	      type: jspsych.ParameterType.BOOL,
	      default: true
	    },
	    enable_button_after: {
	      type: jspsych.ParameterType.INT,
	      default: 0
	    }
	  },
	  data: {
	    rt: {
	      type: jspsych.ParameterType.INT
	    },
	    response: {
	      type: jspsych.ParameterType.INT
	    }
	  }
	};
	class AudioButtonResponsePlugin {
	  constructor(jsPsych) {
	    this.jsPsych = jsPsych;
	    autoBind$1(this);
	  }
	  static info = info;
	  audio;
	  params;
	  buttonElements = [];
	  display;
	  response = { rt: null, button: null };
	  context;
	  startTime;
	  trial_complete;
	  async trial(display_element, trial, on_load) {
	    this.params = trial;
	    this.display = display_element;
	    this.context = this.jsPsych.pluginAPI.audioContext();
	    this.audio = await this.jsPsych.pluginAPI.getAudioPlayer(trial.stimulus);
	    if (trial.trial_ends_after_audio) {
	      this.audio.addEventListener("ended", this.end_trial);
	    }
	    if (!trial.response_allowed_while_playing && !trial.trial_ends_after_audio) {
	      this.audio.addEventListener("ended", this.enable_buttons);
	    }
	    const buttonGroupElement = document.createElement("div");
	    buttonGroupElement.id = "jspsych-audio-button-response-btngroup";
	    if (trial.button_layout === "grid") {
	      buttonGroupElement.classList.add("jspsych-btn-group-grid");
	      if (trial.grid_rows === null && trial.grid_columns === null) {
	        throw new Error(
	          "You cannot set `grid_rows` to `null` without providing a value for `grid_columns`."
	        );
	      }
	      const n_cols = trial.grid_columns === null ? Math.ceil(trial.choices.length / trial.grid_rows) : trial.grid_columns;
	      const n_rows = trial.grid_rows === null ? Math.ceil(trial.choices.length / trial.grid_columns) : trial.grid_rows;
	      buttonGroupElement.style.gridTemplateColumns = `repeat(${n_cols}, 1fr)`;
	      buttonGroupElement.style.gridTemplateRows = `repeat(${n_rows}, 1fr)`;
	    } else if (trial.button_layout === "flex") {
	      buttonGroupElement.classList.add("jspsych-btn-group-flex");
	    }
	    for (const [choiceIndex, choice] of trial.choices.entries()) {
	      buttonGroupElement.insertAdjacentHTML("beforeend", trial.button_html(choice, choiceIndex));
	      const buttonElement = buttonGroupElement.lastChild;
	      buttonElement.dataset.choice = choiceIndex.toString();
	      buttonElement.addEventListener("click", () => {
	        this.after_response(choiceIndex);
	      });
	      this.buttonElements.push(buttonElement);
	    }
	    display_element.appendChild(buttonGroupElement);
	    if (trial.prompt !== null) {
	      display_element.insertAdjacentHTML("beforeend", trial.prompt);
	    }
	    if (trial.response_allowed_while_playing) {
	      if (trial.enable_button_after > 0) {
	        this.disable_buttons();
	        this.enable_buttons();
	      }
	    } else {
	      this.disable_buttons();
	    }
	    if (trial.trial_duration !== null) {
	      this.jsPsych.pluginAPI.setTimeout(() => {
	        this.end_trial();
	      }, trial.trial_duration);
	    }
	    on_load();
	    this.startTime = performance.now();
	    if (this.context !== null) {
	      this.startTime = this.context.currentTime;
	    }
	    this.audio.play();
	    return new Promise((resolve) => {
	      this.trial_complete = resolve;
	    });
	  }
	  disable_buttons = () => {
	    for (const button of this.buttonElements) {
	      button.setAttribute("disabled", "disabled");
	    }
	  };
	  enable_buttons_without_delay = () => {
	    for (const button of this.buttonElements) {
	      button.removeAttribute("disabled");
	    }
	  };
	  enable_buttons_with_delay = (delay) => {
	    this.jsPsych.pluginAPI.setTimeout(this.enable_buttons_without_delay, delay);
	  };
	  enable_buttons() {
	    if (this.params.enable_button_after > 0) {
	      this.enable_buttons_with_delay(this.params.enable_button_after);
	    } else {
	      this.enable_buttons_without_delay();
	    }
	  }
	  after_response = (choice) => {
	    var endTime = performance.now();
	    var rt = Math.round(endTime - this.startTime);
	    if (this.context !== null) {
	      endTime = this.context.currentTime;
	      rt = Math.round((endTime - this.startTime) * 1e3);
	    }
	    this.response.button = parseInt(choice);
	    this.response.rt = rt;
	    this.disable_buttons();
	    if (this.params.response_ends_trial) {
	      this.end_trial();
	    }
	  };
	  end_trial = () => {
	    this.audio.stop();
	    this.audio.removeEventListener("ended", this.end_trial);
	    this.audio.removeEventListener("ended", this.enable_buttons);
	    var trial_data = {
	      rt: this.response.rt,
	      stimulus: this.params.stimulus,
	      response: this.response.button
	    };
	    this.trial_complete(trial_data);
	  };
	  async simulate(trial, simulation_mode, simulation_options, load_callback) {
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
	      stimulus: trial.stimulus,
	      rt: this.jsPsych.randomization.sampleExGaussian(500, 50, 1 / 150, true) + trial.enable_button_after,
	      response: this.jsPsych.randomization.randomInt(0, trial.choices.length - 1)
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
	    const respond = () => {
	      if (data.rt !== null) {
	        this.jsPsych.pluginAPI.clickTarget(
	          display_element.querySelector(
	            `#jspsych-audio-button-response-btngroup [data-choice="${data.response}"]`
	          ),
	          data.rt
	        );
	      }
	    };
	    this.trial(display_element, trial, () => {
	      load_callback();
	      if (!trial.response_allowed_while_playing) {
	        this.audio.addEventListener("ended", respond);
	      } else {
	        respond();
	      }
	    });
	  }
	}

	return AudioButtonResponsePlugin;

})(jsPsychModule);
