var jsPsychExtensionRecordVideo = (function () {
    'use strict';

    /******************************************************************************
    Copyright (c) Microsoft Corporation.

    Permission to use, copy, modify, and/or distribute this software for any
    purpose with or without fee is hereby granted.

    THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
    REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
    AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
    INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
    LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
    OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
    PERFORMANCE OF THIS SOFTWARE.
    ***************************************************************************** */
    /* global Reflect, Promise, SuppressedError, Symbol */


    function __awaiter(thisArg, _arguments, P, generator) {
        function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
            function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
            function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    }

    typeof SuppressedError === "function" ? SuppressedError : function (error, suppressed, message) {
        var e = new Error(message);
        return e.name = "SuppressedError", e.error = error, e.suppressed = suppressed, e;
    };

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

    class RecordVideoExtension {
        constructor(jsPsych) {
            this.jsPsych = jsPsych;
            this.recordedChunks = [];
            this.recorder = null;
            this.currentTrialData = null;
            this.trialComplete = false;
            this.onUpdateCallback = null;
            // todo: add option to stream data to server with timeslice?
            this.initialize = () => __awaiter(this, void 0, void 0, function* () { });
            this.on_start = () => {
                this.recorder = this.jsPsych.pluginAPI.getCameraRecorder();
                this.recordedChunks = [];
                this.trialComplete = false;
                this.currentTrialData = {};
                if (!this.recorder) {
                    console.warn("The record-video extension is trying to start but the camera is not initialized. Do you need to run the initialize-camera plugin?");
                    return;
                }
                this.recorder.addEventListener("dataavailable", this.handleOnDataAvailable);
            };
            this.on_load = () => {
                this.recorder.start();
            };
            this.on_finish = () => {
                return new Promise((resolve) => {
                    this.trialComplete = true;
                    this.recorder.stop();
                    if (!this.currentTrialData.record_video_data) {
                        this.onUpdateCallback = () => {
                            resolve(this.currentTrialData);
                        };
                    }
                    else {
                        resolve(this.currentTrialData);
                    }
                });
            };
            autoBind$1(this);
        }
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
                type: this.recorder.mimeType,
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
    RecordVideoExtension.info = {
        name: "record-video",
    };

    return RecordVideoExtension;

})();
