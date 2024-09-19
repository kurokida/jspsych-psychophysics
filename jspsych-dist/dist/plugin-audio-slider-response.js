var jsPsychAudioSliderResponse = (function (jspsych) {
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
	  name: "@jspsych/plugin-audio-slider-response",
	  version: "2.0.1",
	  description: "",
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
	    test: "jest  --passWithNoTests",
	    "test:watch": "npm test -- --watch",
	    tsc: "tsc",
	    build: "rollup --config",
	    "build:watch": "npm run build -- --watch"
	  },
	  repository: {
	    type: "git",
	    url: "git+https://github.com/jspsych/jsPsych.git",
	    directory: "packages/plugin-audio-slider-response"
	  },
	  author: "Josh de Leeuw",
	  license: "MIT",
	  bugs: {
	    url: "https://github.com/jspsych/jsPsych/issues"
	  },
	  homepage: "https://www.jspsych.org/latest/plugins/audio-slider-response",
	  peerDependencies: {
	    jspsych: ">=7.1.0"
	  },
	  devDependencies: {
	    "@jspsych/config": "^3.0.0",
	    "@jspsych/test-utils": "^1.2.0"
	  }
	};

	const info = {
	  name: "audio-slider-response",
	  version: _package.version,
	  parameters: {
	    stimulus: {
	      type: jspsych.ParameterType.AUDIO,
	      default: void 0
	    },
	    min: {
	      type: jspsych.ParameterType.INT,
	      default: 0
	    },
	    max: {
	      type: jspsych.ParameterType.INT,
	      default: 100
	    },
	    slider_start: {
	      type: jspsych.ParameterType.INT,
	      default: 50
	    },
	    step: {
	      type: jspsych.ParameterType.INT,
	      default: 1
	    },
	    labels: {
	      type: jspsych.ParameterType.HTML_STRING,
	      default: [],
	      array: true
	    },
	    slider_width: {
	      type: jspsych.ParameterType.INT,
	      default: null
	    },
	    button_label: {
	      type: jspsych.ParameterType.STRING,
	      default: "Continue",
	      array: false
	    },
	    require_movement: {
	      type: jspsych.ParameterType.BOOL,
	      default: false
	    },
	    prompt: {
	      type: jspsych.ParameterType.HTML_STRING,
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
	      default: false
	    },
	    response_allowed_while_playing: {
	      type: jspsych.ParameterType.BOOL,
	      default: true
	    }
	  },
	  data: {
	    response: {
	      type: jspsych.ParameterType.INT
	    },
	    rt: {
	      type: jspsych.ParameterType.INT
	    },
	    stimulus: {
	      type: jspsych.ParameterType.STRING
	    },
	    slider_start: {
	      type: jspsych.ParameterType.INT
	    }
	  }
	};
	class AudioSliderResponsePlugin {
	  constructor(jsPsych) {
	    this.jsPsych = jsPsych;
	    autoBind$1(this);
	  }
	  static info = info;
	  audio;
	  context;
	  params;
	  display;
	  response = { rt: null, response: null };
	  startTime;
	  half_thumb_width;
	  trial_complete;
	  async trial(display_element, trial, on_load) {
	    this.params = trial;
	    this.display = display_element;
	    this.response;
	    this.half_thumb_width = 7.5;
	    this.trial_complete;
	    this.context = this.jsPsych.pluginAPI.audioContext();
	    this.audio = await this.jsPsych.pluginAPI.getAudioPlayer(trial.stimulus);
	    this.setupTrial();
	    on_load();
	    return new Promise((resolve) => {
	      this.trial_complete = resolve;
	    });
	  }
	  enable_slider() {
	    document.querySelector("#jspsych-audio-slider-response-response").disabled = false;
	    if (!this.params.require_movement) {
	      document.querySelector("#jspsych-audio-slider-response-next").disabled = false;
	    }
	  }
	  setupTrial = () => {
	    if (this.params.trial_ends_after_audio) {
	      this.audio.addEventListener("ended", this.end_trial);
	    }
	    if (!this.params.response_allowed_while_playing && !this.params.trial_ends_after_audio) {
	      this.audio.addEventListener("ended", this.enable_slider);
	    }
	    var html = '<div id="jspsych-audio-slider-response-wrapper" style="margin: 100px 0px;">';
	    html += '<div class="jspsych-audio-slider-response-container" style="position:relative; margin: 0 auto 3em auto; width:';
	    if (this.params.slider_width !== null) {
	      html += this.params.slider_width + "px;";
	    } else {
	      html += "auto;";
	    }
	    html += '">';
	    html += '<input type="range" class="jspsych-slider" value="' + this.params.slider_start + '" min="' + this.params.min + '" max="' + this.params.max + '" step="' + this.params.step + '" id="jspsych-audio-slider-response-response"';
	    if (!this.params.response_allowed_while_playing) {
	      html += " disabled";
	    }
	    html += "></input><div>";
	    for (var j = 0; j < this.params.labels.length; j++) {
	      var label_width_perc = 100 / (this.params.labels.length - 1);
	      var percent_of_range = j * (100 / (this.params.labels.length - 1));
	      var percent_dist_from_center = (percent_of_range - 50) / 50 * 100;
	      var offset = percent_dist_from_center * this.half_thumb_width / 100;
	      html += '<div style="border: 1px solid transparent; display: inline-block; position: absolute; left:calc(' + percent_of_range + "% - (" + label_width_perc + "% / 2) - " + offset + "px); text-align: center; width: " + label_width_perc + '%;">';
	      html += '<span style="text-align: center; font-size: 80%;">' + this.params.labels[j] + "</span>";
	      html += "</div>";
	    }
	    html += "</div>";
	    html += "</div>";
	    html += "</div>";
	    if (this.params.prompt !== null) {
	      html += this.params.prompt;
	    }
	    var next_disabled_attribute = "";
	    if (this.params.require_movement || !this.params.response_allowed_while_playing) {
	      next_disabled_attribute = "disabled";
	    }
	    html += '<button id="jspsych-audio-slider-response-next" class="jspsych-btn" ' + next_disabled_attribute + ">" + this.params.button_label + "</button>";
	    this.display.innerHTML = html;
	    this.response = {
	      rt: null,
	      response: null
	    };
	    if (!this.params.response_allowed_while_playing) {
	      this.display.querySelector(
	        "#jspsych-audio-slider-response-response"
	      ).disabled = true;
	      this.display.querySelector("#jspsych-audio-slider-response-next").disabled = true;
	    }
	    if (this.params.require_movement) {
	      const enable_button = () => {
	        this.display.querySelector(
	          "#jspsych-audio-slider-response-next"
	        ).disabled = false;
	      };
	      this.display.querySelector("#jspsych-audio-slider-response-response").addEventListener("mousedown", enable_button);
	      this.display.querySelector("#jspsych-audio-slider-response-response").addEventListener("touchstart", enable_button);
	      this.display.querySelector("#jspsych-audio-slider-response-response").addEventListener("change", enable_button);
	    }
	    this.display.querySelector("#jspsych-audio-slider-response-next").addEventListener("click", () => {
	      var endTime = performance.now();
	      var rt = Math.round(endTime - this.startTime);
	      if (this.context !== null) {
	        endTime = this.context.currentTime;
	        rt = Math.round((endTime - this.startTime) * 1e3);
	      }
	      this.response.rt = rt;
	      this.response.response = this.display.querySelector(
	        "#jspsych-audio-slider-response-response"
	      ).valueAsNumber;
	      if (this.params.response_ends_trial) {
	        this.end_trial();
	      } else {
	        this.display.querySelector(
	          "#jspsych-audio-slider-response-next"
	        ).disabled = true;
	      }
	    });
	    this.startTime = performance.now();
	    if (this.context !== null) {
	      this.startTime = this.context.currentTime;
	    }
	    this.audio.play();
	    if (this.params.trial_duration !== null) {
	      this.jsPsych.pluginAPI.setTimeout(() => {
	        this.end_trial();
	      }, this.params.trial_duration);
	    }
	  };
	  end_trial = () => {
	    this.jsPsych.pluginAPI.clearAllTimeouts();
	    this.audio.stop();
	    this.audio.removeEventListener("ended", this.end_trial);
	    this.audio.removeEventListener("ended", this.enable_slider);
	    var trialdata = {
	      rt: this.response.rt,
	      stimulus: this.params.stimulus,
	      slider_start: this.params.slider_start,
	      response: this.response.response
	    };
	    this.display.innerHTML = "";
	    this.trial_complete(trialdata);
	  };
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
	      stimulus: trial.stimulus,
	      slider_start: trial.slider_start,
	      response: this.jsPsych.randomization.randomInt(trial.min, trial.max),
	      rt: this.jsPsych.randomization.sampleExGaussian(500, 50, 1 / 150, true)
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
	        const el = display_element.querySelector("input[type='range']");
	        setTimeout(() => {
	          this.jsPsych.pluginAPI.clickTarget(el);
	          el.valueAsNumber = data.response;
	        }, data.rt / 2);
	        this.jsPsych.pluginAPI.clickTarget(display_element.querySelector("button"), data.rt);
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

	return AudioSliderResponsePlugin;

})(jsPsychModule);
