var jsPsychInitializeMicrophone = (function (jspsych) {
    'use strict';

    /*! *****************************************************************************
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

    function __awaiter(thisArg, _arguments, P, generator) {
        function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
            function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
            function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    }

    const info = {
        name: "initialize-microphone",
        parameters: {
            /** Function to call */
            device_select_message: {
                type: jspsych.ParameterType.HTML_STRING,
                default: `<p>Please select the microphone you would like to use.</p>`,
            },
            /** Is the function call asynchronous? */
            button_label: {
                type: jspsych.ParameterType.STRING,
                default: "Use this microphone",
            },
        },
    };
    /**
     * **initialize-microphone**
     *
     * jsPsych plugin for getting permission to initialize a microphone
     *
     * @author Josh de Leeuw
     * @see {@link https://www.jspsych.org/plugins/jspsych-initialize-microphone/ initialize-microphone plugin documentation on jspsych.org}
     */
    class InitializeMicrophonePlugin {
        constructor(jsPsych) {
            this.jsPsych = jsPsych;
        }
        trial(display_element, trial) {
            this.run_trial(display_element, trial).then((id) => {
                this.jsPsych.finishTrial({
                    device_id: id,
                });
            });
        }
        run_trial(display_element, trial) {
            return __awaiter(this, void 0, void 0, function* () {
                yield this.askForPermission();
                this.showMicrophoneSelection(display_element, trial);
                this.updateDeviceList(display_element);
                navigator.mediaDevices.ondevicechange = (e) => {
                    this.updateDeviceList(display_element);
                };
                const mic_id = yield this.waitForSelection(display_element);
                const stream = yield navigator.mediaDevices.getUserMedia({ audio: { deviceId: mic_id } });
                this.jsPsych.pluginAPI.initializeMicrophoneRecorder(stream);
                return mic_id;
            });
        }
        askForPermission() {
            return __awaiter(this, void 0, void 0, function* () {
                const stream = yield navigator.mediaDevices.getUserMedia({ audio: true, video: false });
                return stream;
            });
        }
        showMicrophoneSelection(display_element, trial) {
            let html = `
      ${trial.device_select_message}
      <select name="mic" id="which-mic" style="font-size:14px; font-family: 'Open Sans', 'Arial', sans-serif; padding: 4px;">
      </select>
      <p><button class="jspsych-btn" id="btn-select-mic">${trial.button_label}</button></p>`;
            display_element.innerHTML = html;
        }
        waitForSelection(display_element) {
            return new Promise((resolve) => {
                display_element.querySelector("#btn-select-mic").addEventListener("click", () => {
                    const mic = display_element.querySelector("#which-mic").value;
                    resolve(mic);
                });
            });
        }
        updateDeviceList(display_element) {
            navigator.mediaDevices.enumerateDevices().then((devices) => {
                const mics = devices.filter((d) => d.kind === "audioinput" && d.deviceId !== "default" && d.deviceId !== "communications");
                // remove entries with duplicate groupID
                const unique_mics = mics.filter((mic, index, arr) => arr.findIndex((v) => v.groupId == mic.groupId) == index);
                // reset the list by clearing all current options
                display_element.querySelector("#which-mic").innerHTML = "";
                unique_mics.forEach((d) => {
                    let el = document.createElement("option");
                    el.value = d.deviceId;
                    el.innerHTML = d.label;
                    display_element.querySelector("#which-mic").appendChild(el);
                });
            });
        }
    }
    InitializeMicrophonePlugin.info = info;

    return InitializeMicrophonePlugin;

})(jsPsychModule);
