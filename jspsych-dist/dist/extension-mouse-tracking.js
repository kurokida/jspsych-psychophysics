var jsPsychExtensionMouseTracking = (function () {
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

    class MouseTrackingExtension {
        constructor(jsPsych) {
            this.jsPsych = jsPsych;
            this.initialize = ({ minimum_sample_time = 0 }) => __awaiter(this, void 0, void 0, function* () {
                this.domObserver = new MutationObserver(this.mutationObserverCallback);
                this.minimumSampleTime = minimum_sample_time;
            });
            this.on_start = (params) => {
                params = params || {};
                this.currentTrialData = [];
                this.currentTrialTargets = new Map();
                this.currentTrialSelectors = params.targets || [];
                this.lastSampleTime = null;
                this.eventsToTrack = params.events || ["mousemove"];
                this.domObserver.observe(this.jsPsych.getDisplayElement(), { childList: true });
            };
            this.on_load = () => {
                // set current trial start time
                this.currentTrialStartTime = performance.now();
                // start data collection
                if (this.eventsToTrack.includes("mousemove")) {
                    window.addEventListener("mousemove", this.mouseMoveEventHandler);
                }
                if (this.eventsToTrack.includes("mousedown")) {
                    window.addEventListener("mousedown", this.mouseDownEventHandler);
                }
                if (this.eventsToTrack.includes("mouseup")) {
                    window.addEventListener("mouseup", this.mouseUpEventHandler);
                }
            };
            this.on_finish = () => {
                this.domObserver.disconnect();
                if (this.eventsToTrack.includes("mousemove")) {
                    window.removeEventListener("mousemove", this.mouseMoveEventHandler);
                }
                if (this.eventsToTrack.includes("mousedown")) {
                    window.removeEventListener("mousedown", this.mouseDownEventHandler);
                }
                if (this.eventsToTrack.includes("mouseup")) {
                    window.removeEventListener("mouseup", this.mouseUpEventHandler);
                }
                return {
                    mouse_tracking_data: this.currentTrialData,
                    mouse_tracking_targets: Object.fromEntries(this.currentTrialTargets.entries()),
                };
            };
            this.mouseMoveEventHandler = ({ clientX: x, clientY: y }) => {
                const event_time = performance.now();
                const t = Math.round(event_time - this.currentTrialStartTime);
                if (this.lastSampleTime === null ||
                    event_time - this.lastSampleTime >= this.minimumSampleTime) {
                    this.lastSampleTime = event_time;
                    this.currentTrialData.push({ x, y, t, event: "mousemove" });
                }
            };
            this.mouseUpEventHandler = ({ clientX: x, clientY: y }) => {
                const event_time = performance.now();
                const t = Math.round(event_time - this.currentTrialStartTime);
                this.currentTrialData.push({ x, y, t, event: "mouseup" });
            };
            this.mouseDownEventHandler = ({ clientX: x, clientY: y }) => {
                const event_time = performance.now();
                const t = Math.round(event_time - this.currentTrialStartTime);
                this.currentTrialData.push({ x, y, t, event: "mousedown" });
            };
            this.mutationObserverCallback = (mutationsList, observer) => {
                for (const selector of this.currentTrialSelectors) {
                    if (!this.currentTrialTargets.has(selector)) {
                        const target = this.jsPsych.getDisplayElement().querySelector(selector);
                        if (target) {
                            this.currentTrialTargets.set(selector, target.getBoundingClientRect());
                        }
                    }
                }
            };
        }
    }
    MouseTrackingExtension.info = {
        name: "mouse-tracking",
    };

    return MouseTrackingExtension;

})();
