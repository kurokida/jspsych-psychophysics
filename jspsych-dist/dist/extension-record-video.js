var jsPsychExtensionRecordVideo = (function (jspsych) {
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
	  name: "@jspsych/extension-record-video",
	  version: "1.1.0",
	  description: "jsPsych extension for recording video",
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
	    directory: "packages/extension-record-video"
	  },
	  author: "Josh de Leeuw",
	  license: "MIT",
	  bugs: {
	    url: "https://github.com/jspsych/jsPsych/issues"
	  },
	  homepage: "https://www.jspsych.org/latest/extensions/record-video",
	  peerDependencies: {
	    jspsych: ">=7.0.0"
	  },
	  devDependencies: {
	    "@jspsych/config": "^3.0.0",
	    "@jspsych/test-utils": "^1.2.0"
	  }
	};

	class RecordVideoExtension {
	  constructor(jsPsych) {
	    this.jsPsych = jsPsych;
	    autoBind$1(this);
	  }
	  static info = {
	    name: "record-video",
	    version: _package.version,
	    data: {
	      record_video_data: {
	        type: jspsych.ParameterType.STRING
	      }
	    }
	  };
	  recordedChunks = [];
	  recorder = null;
	  currentTrialData = null;
	  trialComplete = false;
	  onUpdateCallback = null;
	  initialize = async () => {
	  };
	  on_start = () => {
	    this.recorder = this.jsPsych.pluginAPI.getCameraRecorder();
	    this.recordedChunks = [];
	    this.trialComplete = false;
	    this.currentTrialData = {};
	    if (!this.recorder) {
	      console.warn(
	        "The record-video extension is trying to start but the camera is not initialized. Do you need to run the initialize-camera plugin?"
	      );
	      return;
	    }
	    this.recorder.addEventListener("dataavailable", this.handleOnDataAvailable);
	  };
	  on_load = () => {
	    this.recorder.start();
	  };
	  on_finish = () => {
	    return new Promise((resolve) => {
	      this.trialComplete = true;
	      this.recorder.stop();
	      if (!this.currentTrialData.record_video_data) {
	        this.onUpdateCallback = () => {
	          resolve(this.currentTrialData);
	        };
	      } else {
	        resolve(this.currentTrialData);
	      }
	    });
	  };
	  handleOnDataAvailable(event) {
	    if (event.data.size > 0) {
	      console.log("chunks added");
	      this.recordedChunks.push(event.data);
	      if (this.trialComplete) {
	        this.updateData();
	      }
	    }
	  }
	  updateData() {
	    const data = new Blob(this.recordedChunks, {
	      type: this.recorder.mimeType
	    });
	    const reader = new FileReader();
	    reader.addEventListener("load", () => {
	      const base64 = reader.result.split(",")[1];
	      this.currentTrialData.record_video_data = base64;
	      if (this.onUpdateCallback) {
	        this.onUpdateCallback();
	      }
	    });
	    reader.readAsDataURL(data);
	  }
	}

	return RecordVideoExtension;

})(jsPsychModule);
