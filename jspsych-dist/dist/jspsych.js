var jsPsychModule = (function (exports) {
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

    function __awaiter(thisArg, _arguments, P, generator) {
        function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
            function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
            function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    }

    var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

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

    var version = "7.3.0";

    class MigrationError extends Error {
        constructor(message = "The global `jsPsych` variable is no longer available in jsPsych v7.") {
            super(`${message} Please follow the migration guide at https://www.jspsych.org/7.0/support/migration-v7/ to update your experiment.`);
            this.name = "MigrationError";
        }
    }
    // Define a global jsPsych object to handle invocations on it with migration errors
    window.jsPsych = {
        get init() {
            throw new MigrationError("`jsPsych.init()` was replaced by `initJsPsych()` in jsPsych v7.");
        },
        get data() {
            throw new MigrationError();
        },
        get randomization() {
            throw new MigrationError();
        },
        get turk() {
            throw new MigrationError();
        },
        get pluginAPI() {
            throw new MigrationError();
        },
        get ALL_KEYS() {
            throw new MigrationError('jsPsych.ALL_KEYS was replaced by the "ALL_KEYS" string in jsPsych v7.');
        },
        get NO_KEYS() {
            throw new MigrationError('jsPsych.NO_KEYS was replaced by the "NO_KEYS" string in jsPsych v7.');
        },
    };

    /**
     * Finds all of the unique items in an array.
     * @param arr The array to extract unique values from
     * @returns An array with one copy of each unique item in `arr`
     */
    function unique(arr) {
        return [...new Set(arr)];
    }
    function deepCopy(obj) {
        if (!obj)
            return obj;
        let out;
        if (Array.isArray(obj)) {
            out = [];
            for (const x of obj) {
                out.push(deepCopy(x));
            }
            return out;
        }
        else if (typeof obj === "object" && obj !== null) {
            out = {};
            for (const key in obj) {
                if (obj.hasOwnProperty(key)) {
                    out[key] = deepCopy(obj[key]);
                }
            }
            return out;
        }
        else {
            return obj;
        }
    }

    var utils = /*#__PURE__*/Object.freeze({
        __proto__: null,
        unique: unique,
        deepCopy: deepCopy
    });

    class DataColumn {
        constructor(values = []) {
            this.values = values;
        }
        sum() {
            let s = 0;
            for (const v of this.values) {
                s += v;
            }
            return s;
        }
        mean() {
            return this.sum() / this.count();
        }
        median() {
            if (this.values.length === 0) {
                return undefined;
            }
            const numbers = this.values.slice(0).sort(function (a, b) {
                return a - b;
            });
            const middle = Math.floor(numbers.length / 2);
            const isEven = numbers.length % 2 === 0;
            return isEven ? (numbers[middle] + numbers[middle - 1]) / 2 : numbers[middle];
        }
        min() {
            return Math.min.apply(null, this.values);
        }
        max() {
            return Math.max.apply(null, this.values);
        }
        count() {
            return this.values.length;
        }
        variance() {
            const mean = this.mean();
            let sum_square_error = 0;
            for (const x of this.values) {
                sum_square_error += Math.pow(x - mean, 2);
            }
            const mse = sum_square_error / (this.values.length - 1);
            return mse;
        }
        sd() {
            const mse = this.variance();
            const rmse = Math.sqrt(mse);
            return rmse;
        }
        frequencies() {
            const unique = {};
            for (const x of this.values) {
                if (typeof unique[x] === "undefined") {
                    unique[x] = 1;
                }
                else {
                    unique[x]++;
                }
            }
            return unique;
        }
        all(eval_fn) {
            for (const x of this.values) {
                if (!eval_fn(x)) {
                    return false;
                }
            }
            return true;
        }
        subset(eval_fn) {
            const out = [];
            for (const x of this.values) {
                if (eval_fn(x)) {
                    out.push(x);
                }
            }
            return new DataColumn(out);
        }
    }

    // private function to save text file on local drive
    function saveTextToFile(textstr, filename) {
        const blobToSave = new Blob([textstr], {
            type: "text/plain",
        });
        let blobURL = "";
        if (typeof window.webkitURL !== "undefined") {
            blobURL = window.webkitURL.createObjectURL(blobToSave);
        }
        else {
            blobURL = window.URL.createObjectURL(blobToSave);
        }
        const link = document.createElement("a");
        link.id = "jspsych-download-as-text-link";
        link.style.display = "none";
        link.download = filename;
        link.href = blobURL;
        link.click();
    }
    // this function based on code suggested by StackOverflow users:
    // http://stackoverflow.com/users/64741/zachary
    // http://stackoverflow.com/users/317/joseph-sturtevant
    function JSON2CSV(objArray) {
        const array = typeof objArray != "object" ? JSON.parse(objArray) : objArray;
        let line = "";
        let result = "";
        const columns = [];
        for (const row of array) {
            for (const key in row) {
                let keyString = key + "";
                keyString = '"' + keyString.replace(/"/g, '""') + '",';
                if (!columns.includes(key)) {
                    columns.push(key);
                    line += keyString;
                }
            }
        }
        line = line.slice(0, -1); // removes last comma
        result += line + "\r\n";
        for (const row of array) {
            line = "";
            for (const col of columns) {
                let value = typeof row[col] === "undefined" ? "" : row[col];
                if (typeof value == "object") {
                    value = JSON.stringify(value);
                }
                const valueString = value + "";
                line += '"' + valueString.replace(/"/g, '""') + '",';
            }
            line = line.slice(0, -1);
            result += line + "\r\n";
        }
        return result;
    }
    // this function is modified from StackOverflow:
    // http://stackoverflow.com/posts/3855394
    function getQueryString() {
        const a = window.location.search.substr(1).split("&");
        const b = {};
        for (let i = 0; i < a.length; ++i) {
            const p = a[i].split("=", 2);
            if (p.length == 1)
                b[p[0]] = "";
            else
                b[p[0]] = decodeURIComponent(p[1].replace(/\+/g, " "));
        }
        return b;
    }

    class DataCollection {
        constructor(data = []) {
            this.trials = data;
        }
        push(new_data) {
            this.trials.push(new_data);
            return this;
        }
        join(other_data_collection) {
            this.trials = this.trials.concat(other_data_collection.values());
            return this;
        }
        top() {
            if (this.trials.length <= 1) {
                return this;
            }
            else {
                return new DataCollection([this.trials[this.trials.length - 1]]);
            }
        }
        /**
         * Queries the first n elements in a collection of trials.
         *
         * @param n A positive integer of elements to return. A value of
         *          n that is less than 1 will throw an error.
         *
         * @return First n objects of a collection of trials. If fewer than
         *         n trials are available, the trials.length elements will
         *         be returned.
         *
         */
        first(n = 1) {
            if (n < 1) {
                throw `You must query with a positive nonzero integer. Please use a
               different value for n.`;
            }
            if (this.trials.length === 0)
                return new DataCollection();
            if (n > this.trials.length)
                n = this.trials.length;
            return new DataCollection(this.trials.slice(0, n));
        }
        /**
         * Queries the last n elements in a collection of trials.
         *
         * @param n A positive integer of elements to return. A value of
         *          n that is less than 1 will throw an error.
         *
         * @return Last n objects of a collection of trials. If fewer than
         *         n trials are available, the trials.length elements will
         *         be returned.
         *
         */
        last(n = 1) {
            if (n < 1) {
                throw `You must query with a positive nonzero integer. Please use a
               different value for n.`;
            }
            if (this.trials.length === 0)
                return new DataCollection();
            if (n > this.trials.length)
                n = this.trials.length;
            return new DataCollection(this.trials.slice(this.trials.length - n, this.trials.length));
        }
        values() {
            return this.trials;
        }
        count() {
            return this.trials.length;
        }
        readOnly() {
            return new DataCollection(deepCopy(this.trials));
        }
        addToAll(properties) {
            for (const trial of this.trials) {
                Object.assign(trial, properties);
            }
            return this;
        }
        addToLast(properties) {
            if (this.trials.length != 0) {
                Object.assign(this.trials[this.trials.length - 1], properties);
            }
            return this;
        }
        filter(filters) {
            // [{p1: v1, p2:v2}, {p1:v2}]
            // {p1: v1}
            let f;
            if (!Array.isArray(filters)) {
                f = deepCopy([filters]);
            }
            else {
                f = deepCopy(filters);
            }
            const filtered_data = [];
            for (const trial of this.trials) {
                let keep = false;
                for (const filter of f) {
                    let match = true;
                    for (const key of Object.keys(filter)) {
                        if (typeof trial[key] !== "undefined" && trial[key] === filter[key]) ;
                        else {
                            match = false;
                        }
                    }
                    if (match) {
                        keep = true;
                        break;
                    } // can break because each filter is OR.
                }
                if (keep) {
                    filtered_data.push(trial);
                }
            }
            return new DataCollection(filtered_data);
        }
        filterCustom(fn) {
            return new DataCollection(this.trials.filter(fn));
        }
        filterColumns(columns) {
            return new DataCollection(this.trials.map((trial) => Object.fromEntries(columns.filter((key) => key in trial).map((key) => [key, trial[key]]))));
        }
        select(column) {
            const values = [];
            for (const trial of this.trials) {
                if (typeof trial[column] !== "undefined") {
                    values.push(trial[column]);
                }
            }
            return new DataColumn(values);
        }
        ignore(columns) {
            if (!Array.isArray(columns)) {
                columns = [columns];
            }
            const o = deepCopy(this.trials);
            for (const trial of o) {
                for (const delete_key of columns) {
                    delete trial[delete_key];
                }
            }
            return new DataCollection(o);
        }
        uniqueNames() {
            const names = [];
            for (const trial of this.trials) {
                for (const key of Object.keys(trial)) {
                    if (!names.includes(key)) {
                        names.push(key);
                    }
                }
            }
            return names;
        }
        csv() {
            return JSON2CSV(this.trials);
        }
        json(pretty = false) {
            if (pretty) {
                return JSON.stringify(this.trials, null, "\t");
            }
            return JSON.stringify(this.trials);
        }
        localSave(format, filename) {
            format = format.toLowerCase();
            let data_string;
            if (format === "json") {
                data_string = this.json();
            }
            else if (format === "csv") {
                data_string = this.csv();
            }
            else {
                throw new Error('Invalid format specified for localSave. Must be "json" or "csv".');
            }
            saveTextToFile(data_string, filename);
        }
    }

    class JsPsychData {
        constructor(jsPsych) {
            this.jsPsych = jsPsych;
            // data properties for all trials
            this.dataProperties = {};
            this.reset();
        }
        reset() {
            this.allData = new DataCollection();
            this.interactionData = new DataCollection();
        }
        get() {
            return this.allData;
        }
        getInteractionData() {
            return this.interactionData;
        }
        write(data_object) {
            const progress = this.jsPsych.getProgress();
            const trial = this.jsPsych.getCurrentTrial();
            //var trial_opt_data = typeof trial.data == 'function' ? trial.data() : trial.data;
            const default_data = {
                trial_type: trial.type.info.name,
                trial_index: progress.current_trial_global,
                time_elapsed: this.jsPsych.getTotalTime(),
                internal_node_id: this.jsPsych.getCurrentTimelineNodeID(),
            };
            this.allData.push(Object.assign(Object.assign(Object.assign(Object.assign({}, data_object), trial.data), default_data), this.dataProperties));
        }
        addProperties(properties) {
            // first, add the properties to all data that's already stored
            this.allData.addToAll(properties);
            // now add to list so that it gets appended to all future data
            this.dataProperties = Object.assign({}, this.dataProperties, properties);
        }
        addDataToLastTrial(data) {
            this.allData.addToLast(data);
        }
        getDataByTimelineNode(node_id) {
            return this.allData.filterCustom((x) => x.internal_node_id.slice(0, node_id.length) === node_id);
        }
        getLastTrialData() {
            return this.allData.top();
        }
        getLastTimelineData() {
            const lasttrial = this.getLastTrialData();
            const node_id = lasttrial.select("internal_node_id").values[0];
            if (typeof node_id === "undefined") {
                return new DataCollection();
            }
            else {
                const parent_node_id = node_id.substr(0, node_id.lastIndexOf("-"));
                const lastnodedata = this.getDataByTimelineNode(parent_node_id);
                return lastnodedata;
            }
        }
        displayData(format = "json") {
            format = format.toLowerCase();
            if (format != "json" && format != "csv") {
                console.log("Invalid format declared for displayData function. Using json as default.");
                format = "json";
            }
            const data_string = format === "json" ? this.allData.json(true) : this.allData.csv();
            const display_element = this.jsPsych.getDisplayElement();
            display_element.innerHTML = '<pre id="jspsych-data-display"></pre>';
            document.getElementById("jspsych-data-display").textContent = data_string;
        }
        urlVariables() {
            if (typeof this.query_string == "undefined") {
                this.query_string = getQueryString();
            }
            return this.query_string;
        }
        getURLVariable(whichvar) {
            return this.urlVariables()[whichvar];
        }
        createInteractionListeners() {
            // blur event capture
            window.addEventListener("blur", () => {
                const data = {
                    event: "blur",
                    trial: this.jsPsych.getProgress().current_trial_global,
                    time: this.jsPsych.getTotalTime(),
                };
                this.interactionData.push(data);
                this.jsPsych.getInitSettings().on_interaction_data_update(data);
            });
            // focus event capture
            window.addEventListener("focus", () => {
                const data = {
                    event: "focus",
                    trial: this.jsPsych.getProgress().current_trial_global,
                    time: this.jsPsych.getTotalTime(),
                };
                this.interactionData.push(data);
                this.jsPsych.getInitSettings().on_interaction_data_update(data);
            });
            // fullscreen change capture
            const fullscreenchange = () => {
                const data = {
                    event: 
                    // @ts-expect-error
                    document.isFullScreen ||
                        // @ts-expect-error
                        document.webkitIsFullScreen ||
                        // @ts-expect-error
                        document.mozIsFullScreen ||
                        document.fullscreenElement
                        ? "fullscreenenter"
                        : "fullscreenexit",
                    trial: this.jsPsych.getProgress().current_trial_global,
                    time: this.jsPsych.getTotalTime(),
                };
                this.interactionData.push(data);
                this.jsPsych.getInitSettings().on_interaction_data_update(data);
            };
            document.addEventListener("fullscreenchange", fullscreenchange);
            document.addEventListener("mozfullscreenchange", fullscreenchange);
            document.addEventListener("webkitfullscreenchange", fullscreenchange);
        }
        // public methods for testing purposes. not recommended for use.
        _customInsert(data) {
            this.allData = new DataCollection(data);
        }
        _fullreset() {
            this.reset();
            this.dataProperties = {};
        }
    }

    class HardwareAPI {
        constructor() {
            /**
             * Indicates whether this instance of jspsych has opened a hardware connection through our browser
             * extension
             **/
            this.hardwareConnected = false;
            //it might be useful to open up a line of communication from the extension back to this page
            //script, again, this will have to pass through DOM events. For now speed is of no concern so I
            //will use jQuery
            document.addEventListener("jspsych-activate", (evt) => {
                this.hardwareConnected = true;
            });
        }
        /**
         * Allows communication with user hardware through our custom Google Chrome extension + native C++ program
         * @param		mess	The message to be passed to our extension, see its documentation for the expected members of this object.
         * @author	Daniel Rivas
         *
         */
        hardware(mess) {
            //since Chrome extension content-scripts do not share the javascript environment with the page
            //script that loaded jspsych, we will need to use hacky methods like communicating through DOM
            //events.
            const jspsychEvt = new CustomEvent("jspsych", { detail: mess });
            document.dispatchEvent(jspsychEvt);
            //And voila! it will be the job of the content script injected by the extension to listen for
            //the event and do the appropriate actions.
        }
    }

    class KeyboardListenerAPI {
        constructor(getRootElement, areResponsesCaseSensitive = false, minimumValidRt = 0) {
            this.getRootElement = getRootElement;
            this.areResponsesCaseSensitive = areResponsesCaseSensitive;
            this.minimumValidRt = minimumValidRt;
            this.listeners = new Set();
            this.heldKeys = new Set();
            this.areRootListenersRegistered = false;
            autoBind(this);
            this.registerRootListeners();
        }
        /**
         * If not previously done and `this.getRootElement()` returns an element, adds the root key
         * listeners to that element.
         */
        registerRootListeners() {
            if (!this.areRootListenersRegistered) {
                const rootElement = this.getRootElement();
                if (rootElement) {
                    rootElement.addEventListener("keydown", this.rootKeydownListener);
                    rootElement.addEventListener("keyup", this.rootKeyupListener);
                    this.areRootListenersRegistered = true;
                }
            }
        }
        rootKeydownListener(e) {
            // Iterate over a static copy of the listeners set because listeners might add other listeners
            // that we do not want to be included in the loop
            for (const listener of Array.from(this.listeners)) {
                listener(e);
            }
            this.heldKeys.add(this.toLowerCaseIfInsensitive(e.key));
        }
        toLowerCaseIfInsensitive(string) {
            return this.areResponsesCaseSensitive ? string : string.toLowerCase();
        }
        rootKeyupListener(e) {
            this.heldKeys.delete(this.toLowerCaseIfInsensitive(e.key));
        }
        isResponseValid(validResponses, allowHeldKey, key) {
            // check if key was already held down
            if (!allowHeldKey && this.heldKeys.has(key)) {
                return false;
            }
            if (validResponses === "ALL_KEYS") {
                return true;
            }
            if (validResponses === "NO_KEYS") {
                return false;
            }
            return validResponses.includes(key);
        }
        getKeyboardResponse({ callback_function, valid_responses = "ALL_KEYS", rt_method = "performance", persist, audio_context, audio_context_start_time, allow_held_key = false, minimum_valid_rt = this.minimumValidRt, }) {
            if (rt_method !== "performance" && rt_method !== "audio") {
                console.log('Invalid RT method specified in getKeyboardResponse. Defaulting to "performance" method.');
                rt_method = "performance";
            }
            const usePerformanceRt = rt_method === "performance";
            const startTime = usePerformanceRt ? performance.now() : audio_context_start_time * 1000;
            this.registerRootListeners();
            if (!this.areResponsesCaseSensitive && typeof valid_responses !== "string") {
                valid_responses = valid_responses.map((r) => r.toLowerCase());
            }
            const listener = (e) => {
                const rt = Math.round((rt_method == "performance" ? performance.now() : audio_context.currentTime * 1000) -
                    startTime);
                if (rt < minimum_valid_rt) {
                    return;
                }
                const key = this.toLowerCaseIfInsensitive(e.key);
                if (this.isResponseValid(valid_responses, allow_held_key, key)) {
                    // if this is a valid response, then we don't want the key event to trigger other actions
                    // like scrolling via the spacebar.
                    e.preventDefault();
                    if (!persist) {
                        // remove keyboard listener if it exists
                        this.cancelKeyboardResponse(listener);
                    }
                    callback_function({ key, rt });
                }
            };
            this.listeners.add(listener);
            return listener;
        }
        cancelKeyboardResponse(listener) {
            // remove the listener from the set of listeners if it is contained
            this.listeners.delete(listener);
        }
        cancelAllKeyboardResponses() {
            this.listeners.clear();
        }
        compareKeys(key1, key2) {
            if ((typeof key1 !== "string" && key1 !== null) ||
                (typeof key2 !== "string" && key2 !== null)) {
                console.error("Error in jsPsych.pluginAPI.compareKeys: arguments must be key strings or null.");
                return undefined;
            }
            if (typeof key1 === "string" && typeof key2 === "string") {
                // if both values are strings, then check whether or not letter case should be converted before comparing (case_sensitive_responses in initJsPsych)
                return this.areResponsesCaseSensitive
                    ? key1 === key2
                    : key1.toLowerCase() === key2.toLowerCase();
            }
            return key1 === null && key2 === null;
        }
    }

    /**
     * Parameter types for plugins
     */
    exports.ParameterType = void 0;
    (function (ParameterType) {
        ParameterType[ParameterType["BOOL"] = 0] = "BOOL";
        ParameterType[ParameterType["STRING"] = 1] = "STRING";
        ParameterType[ParameterType["INT"] = 2] = "INT";
        ParameterType[ParameterType["FLOAT"] = 3] = "FLOAT";
        ParameterType[ParameterType["FUNCTION"] = 4] = "FUNCTION";
        ParameterType[ParameterType["KEY"] = 5] = "KEY";
        ParameterType[ParameterType["KEYS"] = 6] = "KEYS";
        ParameterType[ParameterType["SELECT"] = 7] = "SELECT";
        ParameterType[ParameterType["HTML_STRING"] = 8] = "HTML_STRING";
        ParameterType[ParameterType["IMAGE"] = 9] = "IMAGE";
        ParameterType[ParameterType["AUDIO"] = 10] = "AUDIO";
        ParameterType[ParameterType["VIDEO"] = 11] = "VIDEO";
        ParameterType[ParameterType["OBJECT"] = 12] = "OBJECT";
        ParameterType[ParameterType["COMPLEX"] = 13] = "COMPLEX";
        ParameterType[ParameterType["TIMELINE"] = 14] = "TIMELINE";
    })(exports.ParameterType || (exports.ParameterType = {}));
    const universalPluginParameters = {
        /**
         * Data to add to this trial (key-value pairs)
         */
        data: {
            type: exports.ParameterType.OBJECT,
            pretty_name: "Data",
            default: {},
        },
        /**
         * Function to execute when trial begins
         */
        on_start: {
            type: exports.ParameterType.FUNCTION,
            pretty_name: "On start",
            default: function () {
                return;
            },
        },
        /**
         * Function to execute when trial is finished
         */
        on_finish: {
            type: exports.ParameterType.FUNCTION,
            pretty_name: "On finish",
            default: function () {
                return;
            },
        },
        /**
         * Function to execute after the trial has loaded
         */
        on_load: {
            type: exports.ParameterType.FUNCTION,
            pretty_name: "On load",
            default: function () {
                return;
            },
        },
        /**
         * Length of gap between the end of this trial and the start of the next trial
         */
        post_trial_gap: {
            type: exports.ParameterType.INT,
            pretty_name: "Post trial gap",
            default: null,
        },
        /**
         * A list of CSS classes to add to the jsPsych display element for the duration of this trial
         */
        css_classes: {
            type: exports.ParameterType.STRING,
            pretty_name: "Custom CSS classes",
            default: null,
        },
        /**
         * Options to control simulation mode for the trial.
         */
        simulation_options: {
            type: exports.ParameterType.COMPLEX,
            default: null,
        },
    };

    const preloadParameterTypes = [
        exports.ParameterType.AUDIO,
        exports.ParameterType.IMAGE,
        exports.ParameterType.VIDEO,
    ];
    class MediaAPI {
        constructor(useWebaudio, webaudioContext) {
            this.useWebaudio = useWebaudio;
            this.webaudioContext = webaudioContext;
            // video //
            this.video_buffers = {};
            // audio //
            this.context = null;
            this.audio_buffers = [];
            // preloading stimuli //
            this.preload_requests = [];
            this.img_cache = {};
            this.preloadMap = new Map();
            this.microphone_recorder = null;
            this.camera_stream = null;
            this.camera_recorder = null;
        }
        getVideoBuffer(videoID) {
            if (videoID.startsWith("blob:")) {
                this.video_buffers[videoID] = videoID;
            }
            return this.video_buffers[videoID];
        }
        initAudio() {
            this.context = this.useWebaudio ? this.webaudioContext : null;
        }
        audioContext() {
            if (this.context !== null) {
                if (this.context.state !== "running") {
                    this.context.resume();
                }
            }
            return this.context;
        }
        getAudioBuffer(audioID) {
            return new Promise((resolve, reject) => {
                // check whether audio file already preloaded
                if (typeof this.audio_buffers[audioID] == "undefined" ||
                    this.audio_buffers[audioID] == "tmp") {
                    // if audio is not already loaded, try to load it
                    this.preloadAudio([audioID], () => {
                        resolve(this.audio_buffers[audioID]);
                    }, () => { }, (e) => {
                        reject(e.error);
                    });
                }
                else {
                    // audio is already loaded
                    resolve(this.audio_buffers[audioID]);
                }
            });
        }
        preloadAudio(files, callback_complete = () => { }, callback_load = (filepath) => { }, callback_error = (error_msg) => { }) {
            files = unique(files.flat());
            let n_loaded = 0;
            if (files.length == 0) {
                callback_complete();
                return;
            }
            const load_audio_file_webaudio = (source, count = 1) => {
                const request = new XMLHttpRequest();
                request.open("GET", source, true);
                request.responseType = "arraybuffer";
                request.onload = () => {
                    this.context.decodeAudioData(request.response, (buffer) => {
                        this.audio_buffers[source] = buffer;
                        n_loaded++;
                        callback_load(source);
                        if (n_loaded == files.length) {
                            callback_complete();
                        }
                    }, (e) => {
                        callback_error({ source: source, error: e });
                    });
                };
                request.onerror = function (e) {
                    let err = e;
                    if (this.status == 404) {
                        err = "404";
                    }
                    callback_error({ source: source, error: err });
                };
                request.onloadend = function (e) {
                    if (this.status == 404) {
                        callback_error({ source: source, error: "404" });
                    }
                };
                request.send();
                this.preload_requests.push(request);
            };
            const load_audio_file_html5audio = (source, count = 1) => {
                const audio = new Audio();
                const handleCanPlayThrough = () => {
                    this.audio_buffers[source] = audio;
                    n_loaded++;
                    callback_load(source);
                    if (n_loaded == files.length) {
                        callback_complete();
                    }
                    audio.removeEventListener("canplaythrough", handleCanPlayThrough);
                };
                audio.addEventListener("canplaythrough", handleCanPlayThrough);
                audio.addEventListener("error", function handleError(e) {
                    callback_error({ source: audio.src, error: e });
                    audio.removeEventListener("error", handleError);
                });
                audio.addEventListener("abort", function handleAbort(e) {
                    callback_error({ source: audio.src, error: e });
                    audio.removeEventListener("abort", handleAbort);
                });
                audio.src = source;
                this.preload_requests.push(audio);
            };
            for (const file of files) {
                if (typeof this.audio_buffers[file] !== "undefined") {
                    n_loaded++;
                    callback_load(file);
                    if (n_loaded == files.length) {
                        callback_complete();
                    }
                }
                else {
                    this.audio_buffers[file] = "tmp";
                    if (this.audioContext() !== null) {
                        load_audio_file_webaudio(file);
                    }
                    else {
                        load_audio_file_html5audio(file);
                    }
                }
            }
        }
        preloadImages(images, callback_complete = () => { }, callback_load = (filepath) => { }, callback_error = (error_msg) => { }) {
            // flatten the images array
            images = unique(images.flat());
            var n_loaded = 0;
            if (images.length === 0) {
                callback_complete();
                return;
            }
            for (var i = 0; i < images.length; i++) {
                var img = new Image();
                img.onload = function () {
                    n_loaded++;
                    callback_load(img.src);
                    if (n_loaded === images.length) {
                        callback_complete();
                    }
                };
                img.onerror = function (e) {
                    callback_error({ source: img.src, error: e });
                };
                img.src = images[i];
                this.img_cache[images[i]] = img;
                this.preload_requests.push(img);
            }
        }
        preloadVideo(videos, callback_complete = () => { }, callback_load = (filepath) => { }, callback_error = (error_msg) => { }) {
            // flatten the video array
            videos = unique(videos.flat());
            let n_loaded = 0;
            if (videos.length === 0) {
                callback_complete();
                return;
            }
            for (const video of videos) {
                const video_buffers = this.video_buffers;
                //based on option 4 here: http://dinbror.dk/blog/how-to-preload-entire-html5-video-before-play-solved/
                const request = new XMLHttpRequest();
                request.open("GET", video, true);
                request.responseType = "blob";
                request.onload = function () {
                    if (this.status === 200 || this.status === 0) {
                        const videoBlob = this.response;
                        video_buffers[video] = URL.createObjectURL(videoBlob); // IE10+
                        n_loaded++;
                        callback_load(video);
                        if (n_loaded === videos.length) {
                            callback_complete();
                        }
                    }
                };
                request.onerror = function (e) {
                    let err = e;
                    if (this.status == 404) {
                        err = "404";
                    }
                    callback_error({ source: video, error: err });
                };
                request.onloadend = function (e) {
                    if (this.status == 404) {
                        callback_error({ source: video, error: "404" });
                    }
                };
                request.send();
                this.preload_requests.push(request);
            }
        }
        getAutoPreloadList(timeline_description) {
            /** Map each preload parameter type to a set of paths to be preloaded */
            const preloadPaths = Object.fromEntries(preloadParameterTypes.map((type) => [type, new Set()]));
            const traverseTimeline = (node, inheritedTrialType) => {
                var _a, _b, _c, _d;
                const isTimeline = typeof node.timeline !== "undefined";
                if (isTimeline) {
                    for (const childNode of node.timeline) {
                        traverseTimeline(childNode, (_a = node.type) !== null && _a !== void 0 ? _a : inheritedTrialType);
                    }
                }
                else if ((_c = ((_b = node.type) !== null && _b !== void 0 ? _b : inheritedTrialType)) === null || _c === void 0 ? void 0 : _c.info) {
                    // node is a trial with type.info set
                    // Get the plugin name and parameters object from the info object
                    const { name: pluginName, parameters } = ((_d = node.type) !== null && _d !== void 0 ? _d : inheritedTrialType).info;
                    // Extract parameters to be preloaded and their types from parameter info if this has not
                    // yet been done for `pluginName`
                    if (!this.preloadMap.has(pluginName)) {
                        this.preloadMap.set(pluginName, Object.fromEntries(Object.entries(parameters)
                            // Filter out parameter entries with media types and a non-false `preload` option
                            .filter(([_name, { type, preload }]) => preloadParameterTypes.includes(type) && (preload !== null && preload !== void 0 ? preload : true))
                            // Map each entry's value to its parameter type
                            .map(([name, { type }]) => [name, type])));
                    }
                    // Add preload paths from this trial
                    for (const [parameterName, parameterType] of Object.entries(this.preloadMap.get(pluginName))) {
                        const parameterValue = node[parameterName];
                        const elements = preloadPaths[parameterType];
                        if (typeof parameterValue === "string") {
                            elements.add(parameterValue);
                        }
                        else if (Array.isArray(parameterValue)) {
                            for (const element of parameterValue.flat()) {
                                if (typeof element === "string") {
                                    elements.add(element);
                                }
                            }
                        }
                    }
                }
            };
            traverseTimeline({ timeline: timeline_description });
            return {
                images: [...preloadPaths[exports.ParameterType.IMAGE]],
                audio: [...preloadPaths[exports.ParameterType.AUDIO]],
                video: [...preloadPaths[exports.ParameterType.VIDEO]],
            };
        }
        cancelPreloads() {
            for (const request of this.preload_requests) {
                request.onload = () => { };
                request.onerror = () => { };
                request.oncanplaythrough = () => { };
                request.onabort = () => { };
            }
            this.preload_requests = [];
        }
        initializeMicrophoneRecorder(stream) {
            const recorder = new MediaRecorder(stream);
            this.microphone_recorder = recorder;
        }
        getMicrophoneRecorder() {
            return this.microphone_recorder;
        }
        initializeCameraRecorder(stream, opts) {
            this.camera_stream = stream;
            const recorder = new MediaRecorder(stream, opts);
            this.camera_recorder = recorder;
        }
        getCameraStream() {
            return this.camera_stream;
        }
        getCameraRecorder() {
            return this.camera_recorder;
        }
    }

    class SimulationAPI {
        dispatchEvent(event) {
            document.body.dispatchEvent(event);
        }
        /**
         * Dispatches a `keydown` event for the specified key
         * @param key Character code (`.key` property) for the key to press.
         */
        keyDown(key) {
            this.dispatchEvent(new KeyboardEvent("keydown", { key }));
        }
        /**
         * Dispatches a `keyup` event for the specified key
         * @param key Character code (`.key` property) for the key to press.
         */
        keyUp(key) {
            this.dispatchEvent(new KeyboardEvent("keyup", { key }));
        }
        /**
         * Dispatches a `keydown` and `keyup` event in sequence to simulate pressing a key.
         * @param key Character code (`.key` property) for the key to press.
         * @param delay Length of time to wait (ms) before executing action
         */
        pressKey(key, delay = 0) {
            if (delay > 0) {
                setTimeout(() => {
                    this.keyDown(key);
                    this.keyUp(key);
                }, delay);
            }
            else {
                this.keyDown(key);
                this.keyUp(key);
            }
        }
        /**
         * Dispatches `mousedown`, `mouseup`, and `click` events on the target element
         * @param target The element to click
         * @param delay Length of time to wait (ms) before executing action
         */
        clickTarget(target, delay = 0) {
            if (delay > 0) {
                setTimeout(() => {
                    target.dispatchEvent(new MouseEvent("mousedown", { bubbles: true }));
                    target.dispatchEvent(new MouseEvent("mouseup", { bubbles: true }));
                    target.dispatchEvent(new MouseEvent("click", { bubbles: true }));
                }, delay);
            }
            else {
                target.dispatchEvent(new MouseEvent("mousedown", { bubbles: true }));
                target.dispatchEvent(new MouseEvent("mouseup", { bubbles: true }));
                target.dispatchEvent(new MouseEvent("click", { bubbles: true }));
            }
        }
        /**
         * Sets the value of a target text input
         * @param target A text input element to fill in
         * @param text Text to input
         * @param delay Length of time to wait (ms) before executing action
         */
        fillTextInput(target, text, delay = 0) {
            if (delay > 0) {
                setTimeout(() => {
                    target.value = text;
                }, delay);
            }
            else {
                target.value = text;
            }
        }
        /**
         * Picks a valid key from `choices`, taking into account jsPsych-specific
         * identifiers like "NO_KEYS" and "ALL_KEYS".
         * @param choices Which keys are valid.
         * @returns A key selected at random from the valid keys.
         */
        getValidKey(choices) {
            const possible_keys = [
                "a",
                "b",
                "c",
                "d",
                "e",
                "f",
                "g",
                "h",
                "i",
                "j",
                "k",
                "l",
                "m",
                "n",
                "o",
                "p",
                "q",
                "r",
                "s",
                "t",
                "u",
                "v",
                "w",
                "x",
                "y",
                "z",
                "0",
                "1",
                "2",
                "3",
                "4",
                "5",
                "6",
                "7",
                "8",
                "9",
                " ",
            ];
            let key;
            if (choices == "NO_KEYS") {
                key = null;
            }
            else if (choices == "ALL_KEYS") {
                key = possible_keys[Math.floor(Math.random() * possible_keys.length)];
            }
            else {
                const flat_choices = choices.flat();
                key = flat_choices[Math.floor(Math.random() * flat_choices.length)];
            }
            return key;
        }
        mergeSimulationData(default_data, simulation_options) {
            // override any data with data from simulation object
            return Object.assign(Object.assign({}, default_data), simulation_options === null || simulation_options === void 0 ? void 0 : simulation_options.data);
        }
        ensureSimulationDataConsistency(trial, data) {
            // All RTs must be rounded
            if (data.rt) {
                data.rt = Math.round(data.rt);
            }
            // If a trial_duration and rt exist, make sure that the RT is not longer than the trial.
            if (trial.trial_duration && data.rt && data.rt > trial.trial_duration) {
                data.rt = null;
                if (data.response) {
                    data.response = null;
                }
                if (data.correct) {
                    data.correct = false;
                }
            }
            // If trial.choices is NO_KEYS make sure that response and RT are null
            if (trial.choices && trial.choices == "NO_KEYS") {
                if (data.rt) {
                    data.rt = null;
                }
                if (data.response) {
                    data.response = null;
                }
            }
            // If response is not allowed before stimulus display complete, ensure RT
            // is longer than display time.
            if (trial.allow_response_before_complete) {
                if (trial.sequence_reps && trial.frame_time) {
                    const min_time = trial.sequence_reps * trial.frame_time * trial.stimuli.length;
                    if (data.rt < min_time) {
                        data.rt = null;
                        data.response = null;
                    }
                }
            }
        }
    }

    class TimeoutAPI {
        constructor() {
            this.timeout_handlers = [];
        }
        setTimeout(callback, delay) {
            const handle = window.setTimeout(callback, delay);
            this.timeout_handlers.push(handle);
            return handle;
        }
        clearAllTimeouts() {
            for (const handler of this.timeout_handlers) {
                clearTimeout(handler);
            }
            this.timeout_handlers = [];
        }
    }

    function createJointPluginAPIObject(jsPsych) {
        const settings = jsPsych.getInitSettings();
        return Object.assign({}, ...[
            new KeyboardListenerAPI(jsPsych.getDisplayContainerElement, settings.case_sensitive_responses, settings.minimum_valid_rt),
            new TimeoutAPI(),
            new MediaAPI(settings.use_webaudio, jsPsych.webaudio_context),
            new HardwareAPI(),
            new SimulationAPI(),
        ].map((object) => autoBind(object)));
    }

    var wordList = [
      // Borrowed from xkcd password generator which borrowed it from wherever
      "ability","able","aboard","about","above","accept","accident","according",
      "account","accurate","acres","across","act","action","active","activity",
      "actual","actually","add","addition","additional","adjective","adult","adventure",
      "advice","affect","afraid","after","afternoon","again","against","age",
      "ago","agree","ahead","aid","air","airplane","alike","alive",
      "all","allow","almost","alone","along","aloud","alphabet","already",
      "also","although","am","among","amount","ancient","angle","angry",
      "animal","announced","another","answer","ants","any","anybody","anyone",
      "anything","anyway","anywhere","apart","apartment","appearance","apple","applied",
      "appropriate","are","area","arm","army","around","arrange","arrangement",
      "arrive","arrow","art","article","as","aside","ask","asleep",
      "at","ate","atmosphere","atom","atomic","attached","attack","attempt",
      "attention","audience","author","automobile","available","average","avoid","aware",
      "away","baby","back","bad","badly","bag","balance","ball",
      "balloon","band","bank","bar","bare","bark","barn","base",
      "baseball","basic","basis","basket","bat","battle","be","bean",
      "bear","beat","beautiful","beauty","became","because","become","becoming",
      "bee","been","before","began","beginning","begun","behavior","behind",
      "being","believed","bell","belong","below","belt","bend","beneath",
      "bent","beside","best","bet","better","between","beyond","bicycle",
      "bigger","biggest","bill","birds","birth","birthday","bit","bite",
      "black","blank","blanket","blew","blind","block","blood","blow",
      "blue","board","boat","body","bone","book","border","born",
      "both","bottle","bottom","bound","bow","bowl","box","boy",
      "brain","branch","brass","brave","bread","break","breakfast","breath",
      "breathe","breathing","breeze","brick","bridge","brief","bright","bring",
      "broad","broke","broken","brother","brought","brown","brush","buffalo",
      "build","building","built","buried","burn","burst","bus","bush",
      "business","busy","but","butter","buy","by","cabin","cage",
      "cake","call","calm","came","camera","camp","can","canal",
      "cannot","cap","capital","captain","captured","car","carbon","card",
      "care","careful","carefully","carried","carry","case","cast","castle",
      "cat","catch","cattle","caught","cause","cave","cell","cent",
      "center","central","century","certain","certainly","chain","chair","chamber",
      "chance","change","changing","chapter","character","characteristic","charge","chart",
      "check","cheese","chemical","chest","chicken","chief","child","children",
      "choice","choose","chose","chosen","church","circle","circus","citizen",
      "city","class","classroom","claws","clay","clean","clear","clearly",
      "climate","climb","clock","close","closely","closer","cloth","clothes",
      "clothing","cloud","club","coach","coal","coast","coat","coffee",
      "cold","collect","college","colony","color","column","combination","combine",
      "come","comfortable","coming","command","common","community","company","compare",
      "compass","complete","completely","complex","composed","composition","compound","concerned",
      "condition","congress","connected","consider","consist","consonant","constantly","construction",
      "contain","continent","continued","contrast","control","conversation","cook","cookies",
      "cool","copper","copy","corn","corner","correct","correctly","cost",
      "cotton","could","count","country","couple","courage","course","court",
      "cover","cow","cowboy","crack","cream","create","creature","crew",
      "crop","cross","crowd","cry","cup","curious","current","curve",
      "customs","cut","cutting","daily","damage","dance","danger","dangerous",
      "dark","darkness","date","daughter","dawn","day","dead","deal",
      "dear","death","decide","declared","deep","deeply","deer","definition",
      "degree","depend","depth","describe","desert","design","desk","detail",
      "determine","develop","development","diagram","diameter","did","die","differ",
      "difference","different","difficult","difficulty","dig","dinner","direct","direction",
      "directly","dirt","dirty","disappear","discover","discovery","discuss","discussion",
      "disease","dish","distance","distant","divide","division","do","doctor",
      "does","dog","doing","doll","dollar","done","donkey","door",
      "dot","double","doubt","down","dozen","draw","drawn","dream",
      "dress","drew","dried","drink","drive","driven","driver","driving",
      "drop","dropped","drove","dry","duck","due","dug","dull",
      "during","dust","duty","each","eager","ear","earlier","early",
      "earn","earth","easier","easily","east","easy","eat","eaten",
      "edge","education","effect","effort","egg","eight","either","electric",
      "electricity","element","elephant","eleven","else","empty","end","enemy",
      "energy","engine","engineer","enjoy","enough","enter","entire","entirely",
      "environment","equal","equally","equator","equipment","escape","especially","essential",
      "establish","even","evening","event","eventually","ever","every","everybody",
      "everyone","everything","everywhere","evidence","exact","exactly","examine","example",
      "excellent","except","exchange","excited","excitement","exciting","exclaimed","exercise",
      "exist","expect","experience","experiment","explain","explanation","explore","express",
      "expression","extra","eye","face","facing","fact","factor","factory",
      "failed","fair","fairly","fall","fallen","familiar","family","famous",
      "far","farm","farmer","farther","fast","fastened","faster","fat",
      "father","favorite","fear","feathers","feature","fed","feed","feel",
      "feet","fell","fellow","felt","fence","few","fewer","field",
      "fierce","fifteen","fifth","fifty","fight","fighting","figure","fill",
      "film","final","finally","find","fine","finest","finger","finish",
      "fire","fireplace","firm","first","fish","five","fix","flag",
      "flame","flat","flew","flies","flight","floating","floor","flow",
      "flower","fly","fog","folks","follow","food","foot","football",
      "for","force","foreign","forest","forget","forgot","forgotten","form",
      "former","fort","forth","forty","forward","fought","found","four",
      "fourth","fox","frame","free","freedom","frequently","fresh","friend",
      "friendly","frighten","frog","from","front","frozen","fruit","fuel",
      "full","fully","fun","function","funny","fur","furniture","further",
      "future","gain","game","garage","garden","gas","gasoline","gate",
      "gather","gave","general","generally","gentle","gently","get","getting",
      "giant","gift","girl","give","given","giving","glad","glass",
      "globe","go","goes","gold","golden","gone","good","goose",
      "got","government","grabbed","grade","gradually","grain","grandfather","grandmother",
      "graph","grass","gravity","gray","great","greater","greatest","greatly",
      "green","grew","ground","group","grow","grown","growth","guard",
      "guess","guide","gulf","gun","habit","had","hair","half",
      "halfway","hall","hand","handle","handsome","hang","happen","happened",
      "happily","happy","harbor","hard","harder","hardly","has","hat",
      "have","having","hay","he","headed","heading","health","heard",
      "hearing","heart","heat","heavy","height","held","hello","help",
      "helpful","her","herd","here","herself","hidden","hide","high",
      "higher","highest","highway","hill","him","himself","his","history",
      "hit","hold","hole","hollow","home","honor","hope","horn",
      "horse","hospital","hot","hour","house","how","however","huge",
      "human","hundred","hung","hungry","hunt","hunter","hurried","hurry",
      "hurt","husband","ice","idea","identity","if","ill","image",
      "imagine","immediately","importance","important","impossible","improve","in","inch",
      "include","including","income","increase","indeed","independent","indicate","individual",
      "industrial","industry","influence","information","inside","instance","instant","instead",
      "instrument","interest","interior","into","introduced","invented","involved","iron",
      "is","island","it","its","itself","jack","jar","jet",
      "job","join","joined","journey","joy","judge","jump","jungle",
      "just","keep","kept","key","kids","kill","kind","kitchen",
      "knew","knife","know","knowledge","known","label","labor","lack",
      "lady","laid","lake","lamp","land","language","large","larger",
      "largest","last","late","later","laugh","law","lay","layers",
      "lead","leader","leaf","learn","least","leather","leave","leaving",
      "led","left","leg","length","lesson","let","letter","level",
      "library","lie","life","lift","light","like","likely","limited",
      "line","lion","lips","liquid","list","listen","little","live",
      "living","load","local","locate","location","log","lonely","long",
      "longer","look","loose","lose","loss","lost","lot","loud",
      "love","lovely","low","lower","luck","lucky","lunch","lungs",
      "lying","machine","machinery","mad","made","magic","magnet","mail",
      "main","mainly","major","make","making","man","managed","manner",
      "manufacturing","many","map","mark","market","married","mass","massage",
      "master","material","mathematics","matter","may","maybe","me","meal",
      "mean","means","meant","measure","meat","medicine","meet","melted",
      "member","memory","men","mental","merely","met","metal","method",
      "mice","middle","might","mighty","mile","military","milk","mill",
      "mind","mine","minerals","minute","mirror","missing","mission","mistake",
      "mix","mixture","model","modern","molecular","moment","money","monkey",
      "month","mood","moon","more","morning","most","mostly","mother",
      "motion","motor","mountain","mouse","mouth","move","movement","movie",
      "moving","mud","muscle","music","musical","must","my","myself",
      "mysterious","nails","name","nation","national","native","natural","naturally",
      "nature","near","nearby","nearer","nearest","nearly","necessary","neck",
      "needed","needle","needs","negative","neighbor","neighborhood","nervous","nest",
      "never","new","news","newspaper","next","nice","night","nine",
      "no","nobody","nodded","noise","none","noon","nor","north",
      "nose","not","note","noted","nothing","notice","noun","now",
      "number","numeral","nuts","object","observe","obtain","occasionally","occur",
      "ocean","of","off","offer","office","officer","official","oil",
      "old","older","oldest","on","once","one","only","onto",
      "open","operation","opinion","opportunity","opposite","or","orange","orbit",
      "order","ordinary","organization","organized","origin","original","other","ought",
      "our","ourselves","out","outer","outline","outside","over","own",
      "owner","oxygen","pack","package","page","paid","pain","paint",
      "pair","palace","pale","pan","paper","paragraph","parallel","parent",
      "park","part","particles","particular","particularly","partly","parts","party",
      "pass","passage","past","path","pattern","pay","peace","pen",
      "pencil","people","per","percent","perfect","perfectly","perhaps","period",
      "person","personal","pet","phrase","physical","piano","pick","picture",
      "pictured","pie","piece","pig","pile","pilot","pine","pink",
      "pipe","pitch","place","plain","plan","plane","planet","planned",
      "planning","plant","plastic","plate","plates","play","pleasant","please",
      "pleasure","plenty","plural","plus","pocket","poem","poet","poetry",
      "point","pole","police","policeman","political","pond","pony","pool",
      "poor","popular","population","porch","port","position","positive","possible",
      "possibly","post","pot","potatoes","pound","pour","powder","power",
      "powerful","practical","practice","prepare","present","president","press","pressure",
      "pretty","prevent","previous","price","pride","primitive","principal","principle",
      "printed","private","prize","probably","problem","process","produce","product",
      "production","program","progress","promised","proper","properly","property","protection",
      "proud","prove","provide","public","pull","pupil","pure","purple",
      "purpose","push","put","putting","quarter","queen","question","quick",
      "quickly","quiet","quietly","quite","rabbit","race","radio","railroad",
      "rain","raise","ran","ranch","range","rapidly","rate","rather",
      "raw","rays","reach","read","reader","ready","real","realize",
      "rear","reason","recall","receive","recent","recently","recognize","record",
      "red","refer","refused","region","regular","related","relationship","religious",
      "remain","remarkable","remember","remove","repeat","replace","replied","report",
      "represent","require","research","respect","rest","result","return","review",
      "rhyme","rhythm","rice","rich","ride","riding","right","ring",
      "rise","rising","river","road","roar","rock","rocket","rocky",
      "rod","roll","roof","room","root","rope","rose","rough",
      "round","route","row","rubbed","rubber","rule","ruler","run",
      "running","rush","sad","saddle","safe","safety","said","sail",
      "sale","salmon","salt","same","sand","sang","sat","satellites",
      "satisfied","save","saved","saw","say","scale","scared","scene",
      "school","science","scientific","scientist","score","screen","sea","search",
      "season","seat","second","secret","section","see","seed","seeing",
      "seems","seen","seldom","select","selection","sell","send","sense",
      "sent","sentence","separate","series","serious","serve","service","sets",
      "setting","settle","settlers","seven","several","shade","shadow","shake",
      "shaking","shall","shallow","shape","share","sharp","she","sheep",
      "sheet","shelf","shells","shelter","shine","shinning","ship","shirt",
      "shoe","shoot","shop","shore","short","shorter","shot","should",
      "shoulder","shout","show","shown","shut","sick","sides","sight",
      "sign","signal","silence","silent","silk","silly","silver","similar",
      "simple","simplest","simply","since","sing","single","sink","sister",
      "sit","sitting","situation","six","size","skill","skin","sky",
      "slabs","slave","sleep","slept","slide","slight","slightly","slip",
      "slipped","slope","slow","slowly","small","smaller","smallest","smell",
      "smile","smoke","smooth","snake","snow","so","soap","social",
      "society","soft","softly","soil","solar","sold","soldier","solid",
      "solution","solve","some","somebody","somehow","someone","something","sometime",
      "somewhere","son","song","soon","sort","sound","source","south",
      "southern","space","speak","special","species","specific","speech","speed",
      "spell","spend","spent","spider","spin","spirit","spite","split",
      "spoken","sport","spread","spring","square","stage","stairs","stand",
      "standard","star","stared","start","state","statement","station","stay",
      "steady","steam","steel","steep","stems","step","stepped","stick",
      "stiff","still","stock","stomach","stone","stood","stop","stopped",
      "store","storm","story","stove","straight","strange","stranger","straw",
      "stream","street","strength","stretch","strike","string","strip","strong",
      "stronger","struck","structure","struggle","stuck","student","studied","studying",
      "subject","substance","success","successful","such","sudden","suddenly","sugar",
      "suggest","suit","sum","summer","sun","sunlight","supper","supply",
      "support","suppose","sure","surface","surprise","surrounded","swam","sweet",
      "swept","swim","swimming","swing","swung","syllable","symbol","system",
      "table","tail","take","taken","tales","talk","tall","tank",
      "tape","task","taste","taught","tax","tea","teach","teacher",
      "team","tears","teeth","telephone","television","tell","temperature","ten",
      "tent","term","terrible","test","than","thank","that","thee",
      "them","themselves","then","theory","there","therefore","these","they",
      "thick","thin","thing","think","third","thirty","this","those",
      "thou","though","thought","thousand","thread","three","threw","throat",
      "through","throughout","throw","thrown","thumb","thus","thy","tide",
      "tie","tight","tightly","till","time","tin","tiny","tip",
      "tired","title","to","tobacco","today","together","told","tomorrow",
      "tone","tongue","tonight","too","took","tool","top","topic",
      "torn","total","touch","toward","tower","town","toy","trace",
      "track","trade","traffic","trail","train","transportation","trap","travel",
      "treated","tree","triangle","tribe","trick","tried","trip","troops",
      "tropical","trouble","truck","trunk","truth","try","tube","tune",
      "turn","twelve","twenty","twice","two","type","typical","uncle",
      "under","underline","understanding","unhappy","union","unit","universe","unknown",
      "unless","until","unusual","up","upon","upper","upward","us",
      "use","useful","using","usual","usually","valley","valuable","value",
      "vapor","variety","various","vast","vegetable","verb","vertical","very",
      "vessels","victory","view","village","visit","visitor","voice","volume",
      "vote","vowel","voyage","wagon","wait","walk","wall","want",
      "war","warm","warn","was","wash","waste","watch","water",
      "wave","way","we","weak","wealth","wear","weather","week",
      "weigh","weight","welcome","well","went","were","west","western",
      "wet","whale","what","whatever","wheat","wheel","when","whenever",
      "where","wherever","whether","which","while","whispered","whistle","white",
      "who","whole","whom","whose","why","wide","widely","wife",
      "wild","will","willing","win","wind","window","wing","winter",
      "wire","wise","wish","with","within","without","wolf","women",
      "won","wonder","wonderful","wood","wooden","wool","word","wore",
      "work","worker","world","worried","worry","worse","worth","would",
      "wrapped","write","writer","writing","written","wrong","wrote","yard",
      "year","yellow","yes","yesterday","yet","you","young","younger",
      "your","yourself","youth","zero","zebra","zipper","zoo","zulu"
    ];

    function words(options) {

      function word() {
        if (options && options.maxLength > 1) {
          return generateWordWithMaxLength();
        } else {
          return generateRandomWord();
        }
      }

      function generateWordWithMaxLength() {
        var rightSize = false;
        var wordUsed;
        while (!rightSize) {  
          wordUsed = generateRandomWord();
          if(wordUsed.length <= options.maxLength) {
            rightSize = true;
          }

        }
        return wordUsed;
      }

      function generateRandomWord() {
        return wordList[randInt(wordList.length)];
      }

      function randInt(lessThan) {
        return Math.floor(Math.random() * lessThan);
      }

      // No arguments = generate one word
      if (typeof(options) === 'undefined') {
        return word();
      }

      // Just a number = return that many words
      if (typeof(options) === 'number') {
        options = { exactly: options };
      }

      // options supported: exactly, min, max, join
      if (options.exactly) {
        options.min = options.exactly;
        options.max = options.exactly;
      }
      
      // not a number = one word par string
      if (typeof(options.wordsPerString) !== 'number') {
        options.wordsPerString = 1;
      }

      //not a function = returns the raw word
      if (typeof(options.formatter) !== 'function') {
        options.formatter = (word) => word;
      }

      //not a string = separator is a space
      if (typeof(options.separator) !== 'string') {
        options.separator = ' ';
      }

      var total = options.min + randInt(options.max + 1 - options.min);
      var results = [];
      var token = '';
      var relativeIndex = 0;

      for (var i = 0; (i < total * options.wordsPerString); i++) {
        if (relativeIndex === options.wordsPerString - 1) {
          token += options.formatter(word(), relativeIndex);
        }
        else {
          token += options.formatter(word(), relativeIndex) + options.separator;
        }
        relativeIndex++;
        if ((i + 1) % options.wordsPerString === 0) {
          results.push(token);
          token = ''; 
          relativeIndex = 0;
        }
       
      }
      if (typeof options.join === 'string') {
        results = results.join(options.join);
      }

      return results;
    }

    var randomWords$1 = words;
    // Export the word list as it is often useful
    words.wordList = wordList;

    var alea = {exports: {}};

    (function (module) {
    	// A port of an algorithm by Johannes Baagøe <baagoe@baagoe.com>, 2010
    	// http://baagoe.com/en/RandomMusings/javascript/
    	// https://github.com/nquinlan/better-random-numbers-for-javascript-mirror
    	// Original work is under MIT license -

    	// Copyright (C) 2010 by Johannes Baagøe <baagoe@baagoe.org>
    	//
    	// Permission is hereby granted, free of charge, to any person obtaining a copy
    	// of this software and associated documentation files (the "Software"), to deal
    	// in the Software without restriction, including without limitation the rights
    	// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
    	// copies of the Software, and to permit persons to whom the Software is
    	// furnished to do so, subject to the following conditions:
    	//
    	// The above copyright notice and this permission notice shall be included in
    	// all copies or substantial portions of the Software.
    	//
    	// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
    	// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
    	// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
    	// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
    	// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
    	// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
    	// THE SOFTWARE.



    	(function(global, module, define) {

    	function Alea(seed) {
    	  var me = this, mash = Mash();

    	  me.next = function() {
    	    var t = 2091639 * me.s0 + me.c * 2.3283064365386963e-10; // 2^-32
    	    me.s0 = me.s1;
    	    me.s1 = me.s2;
    	    return me.s2 = t - (me.c = t | 0);
    	  };

    	  // Apply the seeding algorithm from Baagoe.
    	  me.c = 1;
    	  me.s0 = mash(' ');
    	  me.s1 = mash(' ');
    	  me.s2 = mash(' ');
    	  me.s0 -= mash(seed);
    	  if (me.s0 < 0) { me.s0 += 1; }
    	  me.s1 -= mash(seed);
    	  if (me.s1 < 0) { me.s1 += 1; }
    	  me.s2 -= mash(seed);
    	  if (me.s2 < 0) { me.s2 += 1; }
    	  mash = null;
    	}

    	function copy(f, t) {
    	  t.c = f.c;
    	  t.s0 = f.s0;
    	  t.s1 = f.s1;
    	  t.s2 = f.s2;
    	  return t;
    	}

    	function impl(seed, opts) {
    	  var xg = new Alea(seed),
    	      state = opts && opts.state,
    	      prng = xg.next;
    	  prng.int32 = function() { return (xg.next() * 0x100000000) | 0; };
    	  prng.double = function() {
    	    return prng() + (prng() * 0x200000 | 0) * 1.1102230246251565e-16; // 2^-53
    	  };
    	  prng.quick = prng;
    	  if (state) {
    	    if (typeof(state) == 'object') copy(state, xg);
    	    prng.state = function() { return copy(xg, {}); };
    	  }
    	  return prng;
    	}

    	function Mash() {
    	  var n = 0xefc8249d;

    	  var mash = function(data) {
    	    data = String(data);
    	    for (var i = 0; i < data.length; i++) {
    	      n += data.charCodeAt(i);
    	      var h = 0.02519603282416938 * n;
    	      n = h >>> 0;
    	      h -= n;
    	      h *= n;
    	      n = h >>> 0;
    	      h -= n;
    	      n += h * 0x100000000; // 2^32
    	    }
    	    return (n >>> 0) * 2.3283064365386963e-10; // 2^-32
    	  };

    	  return mash;
    	}


    	if (module && module.exports) {
    	  module.exports = impl;
    	} else if (define && define.amd) {
    	  define(function() { return impl; });
    	} else {
    	  this.alea = impl;
    	}

    	})(
    	  commonjsGlobal,
    	  module,    // present in node.js
    	  (typeof undefined) == 'function'    // present with an AMD loader
    	);
    } (alea));

    var seedrandom = alea.exports;

    /**
     * Uses the `seedrandom` package to replace Math.random() with a seedable PRNG.
     *
     * @param seed An optional seed. If none is given, a random seed will be generated.
     * @returns The seed value.
     */
    function setSeed(seed = Math.random().toString()) {
        Math.random = seedrandom(seed);
        return seed;
    }
    function repeat(array, repetitions, unpack = false) {
        const arr_isArray = Array.isArray(array);
        const rep_isArray = Array.isArray(repetitions);
        // if array is not an array, then we just repeat the item
        if (!arr_isArray) {
            if (!rep_isArray) {
                array = [array];
                repetitions = [repetitions];
            }
            else {
                repetitions = [repetitions[0]];
                console.log("Unclear parameters given to randomization.repeat. Multiple set sizes specified, but only one item exists to sample. Proceeding using the first set size.");
            }
        }
        else {
            // if repetitions is not an array, but array is, then we
            // repeat repetitions for each entry in array
            if (!rep_isArray) {
                let reps = [];
                for (let i = 0; i < array.length; i++) {
                    reps.push(repetitions);
                }
                repetitions = reps;
            }
            else {
                if (array.length != repetitions.length) {
                    console.warn("Unclear parameters given to randomization.repeat. Items and repetitions are unequal lengths. Behavior may not be as expected.");
                    // throw warning if repetitions is too short, use first rep ONLY.
                    if (repetitions.length < array.length) {
                        let reps = [];
                        for (let i = 0; i < array.length; i++) {
                            reps.push(repetitions);
                        }
                        repetitions = reps;
                    }
                    else {
                        // throw warning if too long, and then use the first N
                        repetitions = repetitions.slice(0, array.length);
                    }
                }
            }
        }
        // should be clear at this point to assume that array and repetitions are arrays with == length
        let allsamples = [];
        for (let i = 0; i < array.length; i++) {
            for (let j = 0; j < repetitions[i]; j++) {
                if (array[i] == null || typeof array[i] != "object") {
                    allsamples.push(array[i]);
                }
                else {
                    allsamples.push(Object.assign({}, array[i]));
                }
            }
        }
        let out = shuffle(allsamples);
        if (unpack) {
            out = unpackArray(out);
        }
        return out;
    }
    function shuffle(array) {
        if (!Array.isArray(array)) {
            console.error("Argument to shuffle() must be an array.");
        }
        const copy_array = array.slice(0);
        let m = copy_array.length, t, i;
        // While there remain elements to shuffle…
        while (m) {
            // Pick a remaining element…
            i = Math.floor(Math.random() * m--);
            // And swap it with the current element.
            t = copy_array[m];
            copy_array[m] = copy_array[i];
            copy_array[i] = t;
        }
        return copy_array;
    }
    function shuffleNoRepeats(arr, equalityTest) {
        if (!Array.isArray(arr)) {
            console.error("First argument to shuffleNoRepeats() must be an array.");
        }
        if (typeof equalityTest !== "undefined" && typeof equalityTest !== "function") {
            console.error("Second argument to shuffleNoRepeats() must be a function.");
        }
        // define a default equalityTest
        if (typeof equalityTest == "undefined") {
            equalityTest = function (a, b) {
                if (a === b) {
                    return true;
                }
                else {
                    return false;
                }
            };
        }
        const random_shuffle = shuffle(arr);
        for (let i = 0; i < random_shuffle.length - 1; i++) {
            if (equalityTest(random_shuffle[i], random_shuffle[i + 1])) {
                // neighbors are equal, pick a new random neighbor to swap (not the first or last element, to avoid edge cases)
                let random_pick = Math.floor(Math.random() * (random_shuffle.length - 2)) + 1;
                // test to make sure the new neighbor isn't equal to the old one
                while (equalityTest(random_shuffle[i + 1], random_shuffle[random_pick]) ||
                    equalityTest(random_shuffle[i + 1], random_shuffle[random_pick + 1]) ||
                    equalityTest(random_shuffle[i + 1], random_shuffle[random_pick - 1])) {
                    random_pick = Math.floor(Math.random() * (random_shuffle.length - 2)) + 1;
                }
                const new_neighbor = random_shuffle[random_pick];
                random_shuffle[random_pick] = random_shuffle[i + 1];
                random_shuffle[i + 1] = new_neighbor;
            }
        }
        return random_shuffle;
    }
    function shuffleAlternateGroups(arr_groups, random_group_order = false) {
        const n_groups = arr_groups.length;
        if (n_groups == 1) {
            console.warn("shuffleAlternateGroups() was called with only one group. Defaulting to simple shuffle.");
            return shuffle(arr_groups[0]);
        }
        let group_order = [];
        for (let i = 0; i < n_groups; i++) {
            group_order.push(i);
        }
        if (random_group_order) {
            group_order = shuffle(group_order);
        }
        const randomized_groups = [];
        let min_length = null;
        for (let i = 0; i < n_groups; i++) {
            min_length =
                min_length === null ? arr_groups[i].length : Math.min(min_length, arr_groups[i].length);
            randomized_groups.push(shuffle(arr_groups[i]));
        }
        const out = [];
        for (let i = 0; i < min_length; i++) {
            for (let j = 0; j < group_order.length; j++) {
                out.push(randomized_groups[group_order[j]][i]);
            }
        }
        return out;
    }
    function sampleWithoutReplacement(arr, size) {
        if (!Array.isArray(arr)) {
            console.error("First argument to sampleWithoutReplacement() must be an array");
        }
        if (size > arr.length) {
            console.error("Cannot take a sample larger than the size of the set of items to sample.");
        }
        return shuffle(arr).slice(0, size);
    }
    function sampleWithReplacement(arr, size, weights) {
        if (!Array.isArray(arr)) {
            console.error("First argument to sampleWithReplacement() must be an array");
        }
        const normalized_weights = [];
        if (typeof weights !== "undefined") {
            if (weights.length !== arr.length) {
                console.error("The length of the weights array must equal the length of the array " +
                    "to be sampled from.");
            }
            let weight_sum = 0;
            for (const weight of weights) {
                weight_sum += weight;
            }
            for (const weight of weights) {
                normalized_weights.push(weight / weight_sum);
            }
        }
        else {
            for (let i = 0; i < arr.length; i++) {
                normalized_weights.push(1 / arr.length);
            }
        }
        const cumulative_weights = [normalized_weights[0]];
        for (let i = 1; i < normalized_weights.length; i++) {
            cumulative_weights.push(normalized_weights[i] + cumulative_weights[i - 1]);
        }
        const samp = [];
        for (let i = 0; i < size; i++) {
            const rnd = Math.random();
            let index = 0;
            while (rnd > cumulative_weights[index]) {
                index++;
            }
            samp.push(arr[index]);
        }
        return samp;
    }
    function factorial(factors, repetitions = 1, unpack = false) {
        let design = [{}];
        for (const [factorName, factor] of Object.entries(factors)) {
            const new_design = [];
            for (const level of factor) {
                for (const cell of design) {
                    new_design.push(Object.assign(Object.assign({}, cell), { [factorName]: level }));
                }
            }
            design = new_design;
        }
        return repeat(design, repetitions, unpack);
    }
    function randomID(length = 32) {
        let result = "";
        const chars = "0123456789abcdefghjklmnopqrstuvwxyz";
        for (let i = 0; i < length; i++) {
            result += chars[Math.floor(Math.random() * chars.length)];
        }
        return result;
    }
    /**
     * Generate a random integer from `lower` to `upper`, inclusive of both end points.
     * @param lower The lowest value it is possible to generate
     * @param upper The highest value it is possible to generate
     * @returns A random integer
     */
    function randomInt(lower, upper) {
        if (upper < lower) {
            throw new Error("Upper boundary must be less than or equal to lower boundary");
        }
        return lower + Math.floor(Math.random() * (upper - lower + 1));
    }
    /**
     * Generates a random sample from a Bernoulli distribution.
     * @param p The probability of sampling 1.
     * @returns 0, with probability 1-p, or 1, with probability p.
     */
    function sampleBernoulli(p) {
        return Math.random() <= p ? 1 : 0;
    }
    function sampleNormal(mean, standard_deviation) {
        return randn_bm() * standard_deviation + mean;
    }
    function sampleExponential(rate) {
        return -Math.log(Math.random()) / rate;
    }
    function sampleExGaussian(mean, standard_deviation, rate, positive = false) {
        let s = sampleNormal(mean, standard_deviation) + sampleExponential(rate);
        if (positive) {
            while (s <= 0) {
                s = sampleNormal(mean, standard_deviation) + sampleExponential(rate);
            }
        }
        return s;
    }
    /**
     * Generate one or more random words.
     *
     * This is a wrapper function for the {@link https://www.npmjs.com/package/random-words `random-words` npm package}.
     *
     * @param opts An object with optional properties `min`, `max`, `exactly`,
     * `join`, `maxLength`, `wordsPerString`, `separator`, and `formatter`.
     *
     * @returns An array of words or a single string, depending on parameter choices.
     */
    function randomWords(opts) {
        return randomWords$1(opts);
    }
    // Box-Muller transformation for a random sample from normal distribution with mean = 0, std = 1
    // https://stackoverflow.com/a/36481059/3726673
    function randn_bm() {
        var u = 0, v = 0;
        while (u === 0)
            u = Math.random(); //Converting [0,1) to (0,1)
        while (v === 0)
            v = Math.random();
        return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
    }
    function unpackArray(array) {
        const out = {};
        for (const x of array) {
            for (const key of Object.keys(x)) {
                if (typeof out[key] === "undefined") {
                    out[key] = [];
                }
                out[key].push(x[key]);
            }
        }
        return out;
    }

    var randomization = /*#__PURE__*/Object.freeze({
        __proto__: null,
        setSeed: setSeed,
        repeat: repeat,
        shuffle: shuffle,
        shuffleNoRepeats: shuffleNoRepeats,
        shuffleAlternateGroups: shuffleAlternateGroups,
        sampleWithoutReplacement: sampleWithoutReplacement,
        sampleWithReplacement: sampleWithReplacement,
        factorial: factorial,
        randomID: randomID,
        randomInt: randomInt,
        sampleBernoulli: sampleBernoulli,
        sampleNormal: sampleNormal,
        sampleExponential: sampleExponential,
        sampleExGaussian: sampleExGaussian,
        randomWords: randomWords
    });

    /**
     * Gets information about the Mechanical Turk Environment, HIT, Assignment, and Worker
     * by parsing the URL variables that Mechanical Turk generates.
     * @returns An object containing information about the Mechanical Turk Environment, HIT, Assignment, and Worker.
     */
    function turkInfo() {
        const turk = {
            previewMode: false,
            outsideTurk: false,
            hitId: "INVALID_URL_PARAMETER",
            assignmentId: "INVALID_URL_PARAMETER",
            workerId: "INVALID_URL_PARAMETER",
            turkSubmitTo: "INVALID_URL_PARAMETER",
        };
        const param = function (url, name) {
            name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
            const regexS = "[\\?&]" + name + "=([^&#]*)";
            const regex = new RegExp(regexS);
            const results = regex.exec(url);
            return results == null ? "" : results[1];
        };
        const src = param(window.location.href, "assignmentId")
            ? window.location.href
            : document.referrer;
        const keys = ["assignmentId", "hitId", "workerId", "turkSubmitTo"];
        keys.map(function (key) {
            turk[key] = unescape(param(src, key));
        });
        turk.previewMode = turk.assignmentId == "ASSIGNMENT_ID_NOT_AVAILABLE";
        turk.outsideTurk =
            !turk.previewMode && turk.hitId === "" && turk.assignmentId == "" && turk.workerId == "";
        return turk;
    }
    /**
     * Send data to Mechnical Turk for storage.
     * @param data An object containing `key:value` pairs to send to Mechanical Turk. Values
     * cannot contain nested objects, arrays, or functions.
     * @returns Nothing
     */
    function submitToTurk(data) {
        const turk = turkInfo();
        const assignmentId = turk.assignmentId;
        const turkSubmitTo = turk.turkSubmitTo;
        if (!assignmentId || !turkSubmitTo)
            return;
        const form = document.createElement("form");
        form.method = "POST";
        form.action = turkSubmitTo + "/mturk/externalSubmit?assignmentId=" + assignmentId;
        for (const key in data) {
            if (data.hasOwnProperty(key)) {
                const hiddenField = document.createElement("input");
                hiddenField.type = "hidden";
                hiddenField.name = key;
                hiddenField.id = key;
                hiddenField.value = data[key];
                form.appendChild(hiddenField);
            }
        }
        document.body.appendChild(form);
        form.submit();
    }

    var turk = /*#__PURE__*/Object.freeze({
        __proto__: null,
        turkInfo: turkInfo,
        submitToTurk: submitToTurk
    });

    class TimelineNode {
        // constructor
        constructor(jsPsych, parameters, parent, relativeID) {
            this.jsPsych = jsPsych;
            // track progress through the node
            this.progress = {
                current_location: -1,
                current_variable_set: 0,
                current_repetition: 0,
                current_iteration: 0,
                done: false,
            };
            // store a link to the parent of this node
            this.parent_node = parent;
            // create the ID for this node
            this.relative_id = typeof parent === "undefined" ? 0 : relativeID;
            // check if there is a timeline parameter
            // if there is, then this node has its own timeline
            if (typeof parameters.timeline !== "undefined") {
                // create timeline properties
                this.timeline_parameters = {
                    timeline: [],
                    loop_function: parameters.loop_function,
                    conditional_function: parameters.conditional_function,
                    sample: parameters.sample,
                    randomize_order: typeof parameters.randomize_order == "undefined" ? false : parameters.randomize_order,
                    repetitions: typeof parameters.repetitions == "undefined" ? 1 : parameters.repetitions,
                    timeline_variables: typeof parameters.timeline_variables == "undefined"
                        ? [{}]
                        : parameters.timeline_variables,
                    on_timeline_finish: parameters.on_timeline_finish,
                    on_timeline_start: parameters.on_timeline_start,
                };
                this.setTimelineVariablesOrder();
                // extract all of the node level data and parameters
                // but remove all of the timeline-level specific information
                // since this will be used to copy things down hierarchically
                var node_data = Object.assign({}, parameters);
                delete node_data.timeline;
                delete node_data.conditional_function;
                delete node_data.loop_function;
                delete node_data.randomize_order;
                delete node_data.repetitions;
                delete node_data.timeline_variables;
                delete node_data.sample;
                delete node_data.on_timeline_start;
                delete node_data.on_timeline_finish;
                this.node_trial_data = node_data; // store for later...
                // create a TimelineNode for each element in the timeline
                for (var i = 0; i < parameters.timeline.length; i++) {
                    // merge parameters
                    var merged_parameters = Object.assign({}, node_data, parameters.timeline[i]);
                    // merge any data from the parent node into child nodes
                    if (typeof node_data.data == "object" && typeof parameters.timeline[i].data == "object") {
                        var merged_data = Object.assign({}, node_data.data, parameters.timeline[i].data);
                        merged_parameters.data = merged_data;
                    }
                    this.timeline_parameters.timeline.push(new TimelineNode(this.jsPsych, merged_parameters, this, i));
                }
            }
            // if there is no timeline parameter, then this node is a trial node
            else {
                // check to see if a valid trial type is defined
                if (typeof parameters.type === "undefined") {
                    console.error('Trial level node is missing the "type" parameter. The parameters for the node are: ' +
                        JSON.stringify(parameters));
                }
                // create a deep copy of the parameters for the trial
                this.trial_parameters = Object.assign({}, parameters);
            }
        }
        // recursively get the next trial to run.
        // if this node is a leaf (trial), then return the trial.
        // otherwise, recursively find the next trial in the child timeline.
        trial() {
            if (typeof this.timeline_parameters == "undefined") {
                // returns a clone of the trial_parameters to
                // protect functions.
                return deepCopy(this.trial_parameters);
            }
            else {
                if (this.progress.current_location >= this.timeline_parameters.timeline.length) {
                    return null;
                }
                else {
                    return this.timeline_parameters.timeline[this.progress.current_location].trial();
                }
            }
        }
        markCurrentTrialComplete() {
            if (typeof this.timeline_parameters === "undefined") {
                this.progress.done = true;
            }
            else {
                this.timeline_parameters.timeline[this.progress.current_location].markCurrentTrialComplete();
            }
        }
        nextRepetiton() {
            this.setTimelineVariablesOrder();
            this.progress.current_location = -1;
            this.progress.current_variable_set = 0;
            this.progress.current_repetition++;
            for (var i = 0; i < this.timeline_parameters.timeline.length; i++) {
                this.timeline_parameters.timeline[i].reset();
            }
        }
        // set the order for going through the timeline variables array
        setTimelineVariablesOrder() {
            const timeline_parameters = this.timeline_parameters;
            // check to make sure this node has variables
            if (typeof timeline_parameters === "undefined" ||
                typeof timeline_parameters.timeline_variables === "undefined") {
                return;
            }
            var order = [];
            for (var i = 0; i < timeline_parameters.timeline_variables.length; i++) {
                order.push(i);
            }
            if (typeof timeline_parameters.sample !== "undefined") {
                if (timeline_parameters.sample.type == "custom") {
                    order = timeline_parameters.sample.fn(order);
                }
                else if (timeline_parameters.sample.type == "with-replacement") {
                    order = sampleWithReplacement(order, timeline_parameters.sample.size, timeline_parameters.sample.weights);
                }
                else if (timeline_parameters.sample.type == "without-replacement") {
                    order = sampleWithoutReplacement(order, timeline_parameters.sample.size);
                }
                else if (timeline_parameters.sample.type == "fixed-repetitions") {
                    order = repeat(order, timeline_parameters.sample.size, false);
                }
                else if (timeline_parameters.sample.type == "alternate-groups") {
                    order = shuffleAlternateGroups(timeline_parameters.sample.groups, timeline_parameters.sample.randomize_group_order);
                }
                else {
                    console.error('Invalid type in timeline sample parameters. Valid options for type are "custom", "with-replacement", "without-replacement", "fixed-repetitions", and "alternate-groups"');
                }
            }
            if (timeline_parameters.randomize_order) {
                order = shuffle(order);
            }
            this.progress.order = order;
        }
        // next variable set
        nextSet() {
            this.progress.current_location = -1;
            this.progress.current_variable_set++;
            for (var i = 0; i < this.timeline_parameters.timeline.length; i++) {
                this.timeline_parameters.timeline[i].reset();
            }
        }
        // update the current trial node to be completed
        // returns true if the node is complete after advance (all subnodes are also complete)
        // returns false otherwise
        advance() {
            const progress = this.progress;
            const timeline_parameters = this.timeline_parameters;
            const internal = this.jsPsych.internal;
            // first check to see if done
            if (progress.done) {
                return true;
            }
            // if node has not started yet (progress.current_location == -1),
            // then try to start the node.
            if (progress.current_location == -1) {
                // check for on_timeline_start and conditonal function on nodes with timelines
                if (typeof timeline_parameters !== "undefined") {
                    // only run the conditional function if this is the first repetition of the timeline when
                    // repetitions > 1, and only when on the first variable set
                    if (typeof timeline_parameters.conditional_function !== "undefined" &&
                        progress.current_repetition == 0 &&
                        progress.current_variable_set == 0) {
                        internal.call_immediate = true;
                        var conditional_result = timeline_parameters.conditional_function();
                        internal.call_immediate = false;
                        // if the conditional_function() returns false, then the timeline
                        // doesn't run and is marked as complete.
                        if (conditional_result == false) {
                            progress.done = true;
                            return true;
                        }
                    }
                    // if we reach this point then the node has its own timeline and will start
                    // so we need to check if there is an on_timeline_start function if we are on the first variable set
                    if (typeof timeline_parameters.on_timeline_start !== "undefined" &&
                        progress.current_variable_set == 0) {
                        timeline_parameters.on_timeline_start();
                    }
                }
                // if we reach this point, then either the node doesn't have a timeline of the
                // conditional function returned true and it can start
                progress.current_location = 0;
                // call advance again on this node now that it is pointing to a new location
                return this.advance();
            }
            // if this node has a timeline, propogate down to the current trial.
            if (typeof timeline_parameters !== "undefined") {
                var have_node_to_run = false;
                // keep incrementing the location in the timeline until one of the nodes reached is incomplete
                while (progress.current_location < timeline_parameters.timeline.length &&
                    have_node_to_run == false) {
                    // check to see if the node currently pointed at is done
                    var target_complete = timeline_parameters.timeline[progress.current_location].advance();
                    if (!target_complete) {
                        have_node_to_run = true;
                        return false;
                    }
                    else {
                        progress.current_location++;
                    }
                }
                // if we've reached the end of the timeline (which, if the code is here, we have)
                // there are a few steps to see what to do next...
                // first, check the timeline_variables to see if we need to loop through again
                // with a new set of variables
                if (progress.current_variable_set < progress.order.length - 1) {
                    // reset the progress of the node to be with the new set
                    this.nextSet();
                    // then try to advance this node again.
                    return this.advance();
                }
                // if we're all done with the timeline_variables, then check to see if there are more repetitions
                else if (progress.current_repetition < timeline_parameters.repetitions - 1) {
                    this.nextRepetiton();
                    // check to see if there is an on_timeline_finish function
                    if (typeof timeline_parameters.on_timeline_finish !== "undefined") {
                        timeline_parameters.on_timeline_finish();
                    }
                    return this.advance();
                }
                // if we're all done with the repetitions...
                else {
                    // check to see if there is an on_timeline_finish function
                    if (typeof timeline_parameters.on_timeline_finish !== "undefined") {
                        timeline_parameters.on_timeline_finish();
                    }
                    // if we're all done with the repetitions, check if there is a loop function.
                    if (typeof timeline_parameters.loop_function !== "undefined") {
                        internal.call_immediate = true;
                        if (timeline_parameters.loop_function(this.generatedData())) {
                            this.reset();
                            internal.call_immediate = false;
                            return this.parent_node.advance();
                        }
                        else {
                            progress.done = true;
                            internal.call_immediate = false;
                            return true;
                        }
                    }
                }
                // no more loops on this timeline, we're done!
                progress.done = true;
                return true;
            }
        }
        // check the status of the done flag
        isComplete() {
            return this.progress.done;
        }
        // getter method for timeline variables
        getTimelineVariableValue(variable_name) {
            if (typeof this.timeline_parameters == "undefined") {
                return undefined;
            }
            var v = this.timeline_parameters.timeline_variables[this.progress.order[this.progress.current_variable_set]][variable_name];
            return v;
        }
        // recursive upward search for timeline variables
        findTimelineVariable(variable_name) {
            var v = this.getTimelineVariableValue(variable_name);
            if (typeof v == "undefined") {
                if (typeof this.parent_node !== "undefined") {
                    return this.parent_node.findTimelineVariable(variable_name);
                }
                else {
                    return undefined;
                }
            }
            else {
                return v;
            }
        }
        // recursive downward search for active trial to extract timeline variable
        timelineVariable(variable_name) {
            if (typeof this.timeline_parameters == "undefined") {
                const val = this.findTimelineVariable(variable_name);
                if (typeof val === "undefined") {
                    console.warn("Timeline variable " + variable_name + " not found.");
                }
                return val;
            }
            else {
                // if progress.current_location is -1, then the timeline variable is being evaluated
                // in a function that runs prior to the trial starting, so we should treat that trial
                // as being the active trial for purposes of finding the value of the timeline variable
                var loc = Math.max(0, this.progress.current_location);
                // if loc is greater than the number of elements on this timeline, then the timeline
                // variable is being evaluated in a function that runs after the trial on the timeline
                // are complete but before advancing to the next (like a loop_function).
                // treat the last active trial as the active trial for this purpose.
                if (loc == this.timeline_parameters.timeline.length) {
                    loc = loc - 1;
                }
                // now find the variable
                const val = this.timeline_parameters.timeline[loc].timelineVariable(variable_name);
                if (typeof val === "undefined") {
                    console.warn("Timeline variable " + variable_name + " not found.");
                }
                return val;
            }
        }
        // recursively get all the timeline variables for this trial
        allTimelineVariables() {
            var all_tvs = this.allTimelineVariablesNames();
            var all_tvs_vals = {};
            for (var i = 0; i < all_tvs.length; i++) {
                all_tvs_vals[all_tvs[i]] = this.timelineVariable(all_tvs[i]);
            }
            return all_tvs_vals;
        }
        // helper to get all the names at this stage.
        allTimelineVariablesNames(so_far = []) {
            if (typeof this.timeline_parameters !== "undefined") {
                so_far = so_far.concat(Object.keys(this.timeline_parameters.timeline_variables[this.progress.order[this.progress.current_variable_set]]));
                // if progress.current_location is -1, then the timeline variable is being evaluated
                // in a function that runs prior to the trial starting, so we should treat that trial
                // as being the active trial for purposes of finding the value of the timeline variable
                var loc = Math.max(0, this.progress.current_location);
                // if loc is greater than the number of elements on this timeline, then the timeline
                // variable is being evaluated in a function that runs after the trial on the timeline
                // are complete but before advancing to the next (like a loop_function).
                // treat the last active trial as the active trial for this purpose.
                if (loc == this.timeline_parameters.timeline.length) {
                    loc = loc - 1;
                }
                // now find the variable
                return this.timeline_parameters.timeline[loc].allTimelineVariablesNames(so_far);
            }
            if (typeof this.timeline_parameters == "undefined") {
                return so_far;
            }
        }
        // recursively get the number of **trials** contained in the timeline
        // assuming that while loops execute exactly once and if conditionals
        // always run
        length() {
            var length = 0;
            if (typeof this.timeline_parameters !== "undefined") {
                for (var i = 0; i < this.timeline_parameters.timeline.length; i++) {
                    length += this.timeline_parameters.timeline[i].length();
                }
            }
            else {
                return 1;
            }
            return length;
        }
        // return the percentage of trials completed, grouped at the first child level
        // counts a set of trials as complete when the child node is done
        percentComplete() {
            var total_trials = this.length();
            var completed_trials = 0;
            for (var i = 0; i < this.timeline_parameters.timeline.length; i++) {
                if (this.timeline_parameters.timeline[i].isComplete()) {
                    completed_trials += this.timeline_parameters.timeline[i].length();
                }
            }
            return (completed_trials / total_trials) * 100;
        }
        // resets the node and all subnodes to original state
        // but increments the current_iteration counter
        reset() {
            this.progress.current_location = -1;
            this.progress.current_repetition = 0;
            this.progress.current_variable_set = 0;
            this.progress.current_iteration++;
            this.progress.done = false;
            this.setTimelineVariablesOrder();
            if (typeof this.timeline_parameters != "undefined") {
                for (var i = 0; i < this.timeline_parameters.timeline.length; i++) {
                    this.timeline_parameters.timeline[i].reset();
                }
            }
        }
        // mark this node as finished
        end() {
            this.progress.done = true;
        }
        // recursively end whatever sub-node is running the current trial
        endActiveNode() {
            if (typeof this.timeline_parameters == "undefined") {
                this.end();
                this.parent_node.end();
            }
            else {
                this.timeline_parameters.timeline[this.progress.current_location].endActiveNode();
            }
        }
        // get a unique ID associated with this node
        // the ID reflects the current iteration through this node.
        ID() {
            var id = "";
            if (typeof this.parent_node == "undefined") {
                return "0." + this.progress.current_iteration;
            }
            else {
                id += this.parent_node.ID() + "-";
                id += this.relative_id + "." + this.progress.current_iteration;
                return id;
            }
        }
        // get the ID of the active trial
        activeID() {
            if (typeof this.timeline_parameters == "undefined") {
                return this.ID();
            }
            else {
                return this.timeline_parameters.timeline[this.progress.current_location].activeID();
            }
        }
        // get all the data generated within this node
        generatedData() {
            return this.jsPsych.data.getDataByTimelineNode(this.ID());
        }
        // get all the trials of a particular type
        trialsOfType(type) {
            if (typeof this.timeline_parameters == "undefined") {
                if (this.trial_parameters.type == type) {
                    return this.trial_parameters;
                }
                else {
                    return [];
                }
            }
            else {
                var trials = [];
                for (var i = 0; i < this.timeline_parameters.timeline.length; i++) {
                    var t = this.timeline_parameters.timeline[i].trialsOfType(type);
                    trials = trials.concat(t);
                }
                return trials;
            }
        }
        // add new trials to end of this timeline
        insert(parameters) {
            if (typeof this.timeline_parameters === "undefined") {
                console.error("Cannot add new trials to a trial-level node.");
            }
            else {
                this.timeline_parameters.timeline.push(new TimelineNode(this.jsPsych, Object.assign(Object.assign({}, this.node_trial_data), parameters), this, this.timeline_parameters.timeline.length));
            }
        }
    }

    function delay(ms) {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }
    class JsPsych {
        constructor(options) {
            this.extensions = {};
            this.turk = turk;
            this.randomization = randomization;
            this.utils = utils;
            //
            // private variables
            //
            /**
             * options
             */
            this.opts = {};
            // flow control
            this.global_trial_index = 0;
            this.current_trial = {};
            this.current_trial_finished = false;
            /**
             * is the experiment paused?
             */
            this.paused = false;
            this.waiting = false;
            /**
             * is the page retrieved directly via file:// protocol (true) or hosted on a server (false)?
             */
            this.file_protocol = false;
            /**
             * is the experiment running in `simulate()` mode
             */
            this.simulation_mode = null;
            // storing a single webaudio context to prevent problems with multiple inits
            // of jsPsych
            this.webaudio_context = null;
            this.internal = {
                /**
                 * this flag is used to determine whether we are in a scope where
                 * jsPsych.timelineVariable() should be executed immediately or
                 * whether it should return a function to access the variable later.
                 *
                 **/
                call_immediate: false,
            };
            this.progress_bar_amount = 0;
            // override default options if user specifies an option
            options = Object.assign({ display_element: undefined, on_finish: () => { }, on_trial_start: () => { }, on_trial_finish: () => { }, on_data_update: () => { }, on_interaction_data_update: () => { }, on_close: () => { }, use_webaudio: true, exclusions: {}, show_progress_bar: false, message_progress_bar: "Completion Progress", auto_update_progress_bar: true, default_iti: 0, minimum_valid_rt: 0, experiment_width: null, override_safe_mode: false, case_sensitive_responses: false, extensions: [] }, options);
            this.opts = options;
            autoBind(this); // so we can pass JsPsych methods as callbacks and `this` remains the JsPsych instance
            this.webaudio_context =
                typeof window !== "undefined" && typeof window.AudioContext !== "undefined"
                    ? new AudioContext()
                    : null;
            // detect whether page is running in browser as a local file, and if so, disable web audio and video preloading to prevent CORS issues
            if (window.location.protocol == "file:" &&
                (options.override_safe_mode === false || typeof options.override_safe_mode === "undefined")) {
                options.use_webaudio = false;
                this.file_protocol = true;
                console.warn("jsPsych detected that it is running via the file:// protocol and not on a web server. " +
                    "To prevent issues with cross-origin requests, Web Audio and video preloading have been disabled. " +
                    "If you would like to override this setting, you can set 'override_safe_mode' to 'true' in initJsPsych. " +
                    "For more information, see: https://www.jspsych.org/overview/running-experiments");
            }
            // initialize modules
            this.data = new JsPsychData(this);
            this.pluginAPI = createJointPluginAPIObject(this);
            // create instances of extensions
            for (const extension of options.extensions) {
                this.extensions[extension.type.info.name] = new extension.type(this);
            }
            // initialize audio context based on options and browser capabilities
            this.pluginAPI.initAudio();
        }
        version() {
            return version;
        }
        /**
         * Starts an experiment using the provided timeline and returns a promise that is resolved when
         * the experiment is finished.
         *
         * @param timeline The timeline to be run
         */
        run(timeline) {
            return __awaiter(this, void 0, void 0, function* () {
                if (typeof timeline === "undefined") {
                    console.error("No timeline declared in jsPsych.run. Cannot start experiment.");
                }
                if (timeline.length === 0) {
                    console.error("No trials have been added to the timeline (the timeline is an empty array). Cannot start experiment.");
                }
                // create experiment timeline
                this.timelineDescription = timeline;
                this.timeline = new TimelineNode(this, { timeline });
                yield this.prepareDom();
                yield this.checkExclusions(this.opts.exclusions);
                yield this.loadExtensions(this.opts.extensions);
                document.documentElement.setAttribute("jspsych", "present");
                this.startExperiment();
                yield this.finished;
            });
        }
        simulate(timeline, simulation_mode = "data-only", simulation_options = {}) {
            return __awaiter(this, void 0, void 0, function* () {
                this.simulation_mode = simulation_mode;
                this.simulation_options = simulation_options;
                yield this.run(timeline);
            });
        }
        getProgress() {
            return {
                total_trials: typeof this.timeline === "undefined" ? undefined : this.timeline.length(),
                current_trial_global: this.global_trial_index,
                percent_complete: typeof this.timeline === "undefined" ? 0 : this.timeline.percentComplete(),
            };
        }
        getStartTime() {
            return this.exp_start_time;
        }
        getTotalTime() {
            if (typeof this.exp_start_time === "undefined") {
                return 0;
            }
            return new Date().getTime() - this.exp_start_time.getTime();
        }
        getDisplayElement() {
            return this.DOM_target;
        }
        getDisplayContainerElement() {
            return this.DOM_container;
        }
        finishTrial(data = {}) {
            var _a;
            if (this.current_trial_finished) {
                return;
            }
            this.current_trial_finished = true;
            // remove any CSS classes that were added to the DOM via css_classes parameter
            if (typeof this.current_trial.css_classes !== "undefined" &&
                Array.isArray(this.current_trial.css_classes)) {
                this.DOM_target.classList.remove(...this.current_trial.css_classes);
            }
            // write the data from the trial
            this.data.write(data);
            // get back the data with all of the defaults in
            const trial_data = this.data.getLastTrialData();
            // for trial-level callbacks, we just want to pass in a reference to the values
            // of the DataCollection, for easy access and editing.
            const trial_data_values = trial_data.values()[0];
            const current_trial = this.current_trial;
            if (typeof current_trial.save_trial_parameters === "object") {
                for (const key of Object.keys(current_trial.save_trial_parameters)) {
                    const key_val = current_trial.save_trial_parameters[key];
                    if (key_val === true) {
                        if (typeof current_trial[key] === "undefined") {
                            console.warn(`Invalid parameter specified in save_trial_parameters. Trial has no property called "${key}".`);
                        }
                        else if (typeof current_trial[key] === "function") {
                            trial_data_values[key] = current_trial[key].toString();
                        }
                        else {
                            trial_data_values[key] = current_trial[key];
                        }
                    }
                    if (key_val === false) {
                        // we don't allow internal_node_id or trial_index to be deleted because it would break other things
                        if (key !== "internal_node_id" && key !== "trial_index") {
                            delete trial_data_values[key];
                        }
                    }
                }
            }
            // handle extension callbacks
            const extensionCallbackResults = ((_a = current_trial.extensions) !== null && _a !== void 0 ? _a : []).map((extension) => this.extensions[extension.type.info.name].on_finish(extension.params));
            const onExtensionCallbacksFinished = () => {
                // about to execute lots of callbacks, so switch context.
                this.internal.call_immediate = true;
                // handle callback at plugin level
                if (typeof current_trial.on_finish === "function") {
                    current_trial.on_finish(trial_data_values);
                }
                // handle callback at whole-experiment level
                this.opts.on_trial_finish(trial_data_values);
                // after the above callbacks are complete, then the data should be finalized
                // for this trial. call the on_data_update handler, passing in the same
                // data object that just went through the trial's finish handlers.
                this.opts.on_data_update(trial_data_values);
                // done with callbacks
                this.internal.call_immediate = false;
                // wait for iti
                if (this.simulation_mode === "data-only") {
                    this.nextTrial();
                }
                else if (typeof current_trial.post_trial_gap === null ||
                    typeof current_trial.post_trial_gap === "undefined") {
                    if (this.opts.default_iti > 0) {
                        setTimeout(this.nextTrial, this.opts.default_iti);
                    }
                    else {
                        this.nextTrial();
                    }
                }
                else {
                    if (current_trial.post_trial_gap > 0) {
                        setTimeout(this.nextTrial, current_trial.post_trial_gap);
                    }
                    else {
                        this.nextTrial();
                    }
                }
            };
            // Strictly using Promise.resolve to turn all values into promises would be cleaner here, but it
            // would require user test code to make the event loop tick after every simulated key press even
            // if there are no async `on_finish` methods. Hence, in order to avoid a breaking change, we
            // only rely on the event loop if at least one `on_finish` method returns a promise.
            if (extensionCallbackResults.some((result) => typeof result.then === "function")) {
                Promise.all(extensionCallbackResults.map((result) => Promise.resolve(result).then((ext_data_values) => {
                    Object.assign(trial_data_values, ext_data_values);
                }))).then(onExtensionCallbacksFinished);
            }
            else {
                for (const values of extensionCallbackResults) {
                    Object.assign(trial_data_values, values);
                }
                onExtensionCallbacksFinished();
            }
        }
        endExperiment(end_message = "", data = {}) {
            this.timeline.end_message = end_message;
            this.timeline.end();
            this.pluginAPI.cancelAllKeyboardResponses();
            this.pluginAPI.clearAllTimeouts();
            this.finishTrial(data);
        }
        endCurrentTimeline() {
            this.timeline.endActiveNode();
        }
        getCurrentTrial() {
            return this.current_trial;
        }
        getInitSettings() {
            return this.opts;
        }
        getCurrentTimelineNodeID() {
            return this.timeline.activeID();
        }
        timelineVariable(varname, immediate = false) {
            if (this.internal.call_immediate || immediate === true) {
                return this.timeline.timelineVariable(varname);
            }
            else {
                return {
                    timelineVariablePlaceholder: true,
                    timelineVariableFunction: () => this.timeline.timelineVariable(varname),
                };
            }
        }
        getAllTimelineVariables() {
            return this.timeline.allTimelineVariables();
        }
        addNodeToEndOfTimeline(new_timeline, preload_callback) {
            this.timeline.insert(new_timeline);
        }
        pauseExperiment() {
            this.paused = true;
        }
        resumeExperiment() {
            this.paused = false;
            if (this.waiting) {
                this.waiting = false;
                this.nextTrial();
            }
        }
        loadFail(message) {
            message = message || "<p>The experiment failed to load.</p>";
            this.DOM_target.innerHTML = message;
        }
        getSafeModeStatus() {
            return this.file_protocol;
        }
        getTimeline() {
            return this.timelineDescription;
        }
        prepareDom() {
            return __awaiter(this, void 0, void 0, function* () {
                // Wait until the document is ready
                if (document.readyState !== "complete") {
                    yield new Promise((resolve) => {
                        window.addEventListener("load", resolve);
                    });
                }
                const options = this.opts;
                // set DOM element where jsPsych will render content
                // if undefined, then jsPsych will use the <body> tag and the entire page
                if (typeof options.display_element === "undefined") {
                    // check if there is a body element on the page
                    const body = document.querySelector("body");
                    if (body === null) {
                        document.documentElement.appendChild(document.createElement("body"));
                    }
                    // using the full page, so we need the HTML element to
                    // have 100% height, and body to be full width and height with
                    // no margin
                    document.querySelector("html").style.height = "100%";
                    document.querySelector("body").style.margin = "0px";
                    document.querySelector("body").style.height = "100%";
                    document.querySelector("body").style.width = "100%";
                    options.display_element = document.querySelector("body");
                }
                else {
                    // make sure that the display element exists on the page
                    const display = options.display_element instanceof Element
                        ? options.display_element
                        : document.querySelector("#" + options.display_element);
                    if (display === null) {
                        console.error("The display_element specified in initJsPsych() does not exist in the DOM.");
                    }
                    else {
                        options.display_element = display;
                    }
                }
                options.display_element.innerHTML =
                    '<div class="jspsych-content-wrapper"><div id="jspsych-content"></div></div>';
                this.DOM_container = options.display_element;
                this.DOM_target = document.querySelector("#jspsych-content");
                // set experiment_width if not null
                if (options.experiment_width !== null) {
                    this.DOM_target.style.width = options.experiment_width + "px";
                }
                // add tabIndex attribute to scope event listeners
                options.display_element.tabIndex = 0;
                // add CSS class to DOM_target
                if (options.display_element.className.indexOf("jspsych-display-element") === -1) {
                    options.display_element.className += " jspsych-display-element";
                }
                this.DOM_target.className += "jspsych-content";
                // create listeners for user browser interaction
                this.data.createInteractionListeners();
                // add event for closing window
                window.addEventListener("beforeunload", options.on_close);
            });
        }
        loadExtensions(extensions) {
            return __awaiter(this, void 0, void 0, function* () {
                // run the .initialize method of any extensions that are in use
                // these should return a Promise to indicate when loading is complete
                try {
                    yield Promise.all(extensions.map((extension) => this.extensions[extension.type.info.name].initialize(extension.params || {})));
                }
                catch (error_message) {
                    console.error(error_message);
                    throw new Error(error_message);
                }
            });
        }
        startExperiment() {
            this.finished = new Promise((resolve) => {
                this.resolveFinishedPromise = resolve;
            });
            // show progress bar if requested
            if (this.opts.show_progress_bar === true) {
                this.drawProgressBar(this.opts.message_progress_bar);
            }
            // record the start time
            this.exp_start_time = new Date();
            // begin!
            this.timeline.advance();
            this.doTrial(this.timeline.trial());
        }
        finishExperiment() {
            const finish_result = this.opts.on_finish(this.data.get());
            const done_handler = () => {
                if (typeof this.timeline.end_message !== "undefined") {
                    this.DOM_target.innerHTML = this.timeline.end_message;
                }
                this.resolveFinishedPromise();
            };
            if (finish_result) {
                Promise.resolve(finish_result).then(done_handler);
            }
            else {
                done_handler();
            }
        }
        nextTrial() {
            // if experiment is paused, don't do anything.
            if (this.paused) {
                this.waiting = true;
                return;
            }
            this.global_trial_index++;
            // advance timeline
            this.timeline.markCurrentTrialComplete();
            const complete = this.timeline.advance();
            // update progress bar if shown
            if (this.opts.show_progress_bar === true && this.opts.auto_update_progress_bar === true) {
                this.updateProgressBar();
            }
            // check if experiment is over
            if (complete) {
                this.finishExperiment();
                return;
            }
            this.doTrial(this.timeline.trial());
        }
        doTrial(trial) {
            this.current_trial = trial;
            this.current_trial_finished = false;
            // process all timeline variables for this trial
            this.evaluateTimelineVariables(trial);
            if (typeof trial.type === "string") {
                throw new MigrationError("A string was provided as the trial's `type` parameter. Since jsPsych v7, the `type` parameter needs to be a plugin object.");
            }
            // instantiate the plugin for this trial
            trial.type = Object.assign(Object.assign({}, autoBind(new trial.type(this))), { info: trial.type.info });
            // evaluate variables that are functions
            this.evaluateFunctionParameters(trial);
            // get default values for parameters
            this.setDefaultValues(trial);
            // about to execute callbacks
            this.internal.call_immediate = true;
            // call experiment wide callback
            this.opts.on_trial_start(trial);
            // call trial specific callback if it exists
            if (typeof trial.on_start === "function") {
                trial.on_start(trial);
            }
            // call any on_start functions for extensions
            if (Array.isArray(trial.extensions)) {
                for (const extension of trial.extensions) {
                    this.extensions[extension.type.info.name].on_start(extension.params);
                }
            }
            // apply the focus to the element containing the experiment.
            this.DOM_container.focus();
            // reset the scroll on the DOM target
            this.DOM_target.scrollTop = 0;
            // add CSS classes to the DOM_target if they exist in trial.css_classes
            if (typeof trial.css_classes !== "undefined") {
                if (!Array.isArray(trial.css_classes) && typeof trial.css_classes === "string") {
                    trial.css_classes = [trial.css_classes];
                }
                if (Array.isArray(trial.css_classes)) {
                    this.DOM_target.classList.add(...trial.css_classes);
                }
            }
            // setup on_load event callback
            const load_callback = () => {
                if (typeof trial.on_load === "function") {
                    trial.on_load();
                }
                // call any on_load functions for extensions
                if (Array.isArray(trial.extensions)) {
                    for (const extension of trial.extensions) {
                        this.extensions[extension.type.info.name].on_load(extension.params);
                    }
                }
            };
            let trial_complete;
            if (!this.simulation_mode) {
                trial_complete = trial.type.trial(this.DOM_target, trial, load_callback);
            }
            if (this.simulation_mode) {
                // check if the trial supports simulation
                if (trial.type.simulate) {
                    let trial_sim_opts;
                    if (!trial.simulation_options) {
                        trial_sim_opts = this.simulation_options.default;
                    }
                    if (trial.simulation_options) {
                        if (typeof trial.simulation_options == "string") {
                            if (this.simulation_options[trial.simulation_options]) {
                                trial_sim_opts = this.simulation_options[trial.simulation_options];
                            }
                            else if (this.simulation_options.default) {
                                console.log(`No matching simulation options found for "${trial.simulation_options}". Using "default" options.`);
                                trial_sim_opts = this.simulation_options.default;
                            }
                            else {
                                console.log(`No matching simulation options found for "${trial.simulation_options}" and no "default" options provided. Using the default values provided by the plugin.`);
                                trial_sim_opts = {};
                            }
                        }
                        else {
                            trial_sim_opts = trial.simulation_options;
                        }
                    }
                    trial_sim_opts = this.utils.deepCopy(trial_sim_opts);
                    trial_sim_opts = this.replaceFunctionsWithValues(trial_sim_opts, null);
                    if ((trial_sim_opts === null || trial_sim_opts === void 0 ? void 0 : trial_sim_opts.simulate) === false) {
                        trial_complete = trial.type.trial(this.DOM_target, trial, load_callback);
                    }
                    else {
                        trial_complete = trial.type.simulate(trial, (trial_sim_opts === null || trial_sim_opts === void 0 ? void 0 : trial_sim_opts.mode) || this.simulation_mode, trial_sim_opts, load_callback);
                    }
                }
                else {
                    // trial doesn't have a simulate method, so just run as usual
                    trial_complete = trial.type.trial(this.DOM_target, trial, load_callback);
                }
            }
            // see if trial_complete is a Promise by looking for .then() function
            const is_promise = trial_complete && typeof trial_complete.then == "function";
            // in simulation mode we let the simulate function call the load_callback always.
            if (!is_promise && !this.simulation_mode) {
                load_callback();
            }
            // done with callbacks
            this.internal.call_immediate = false;
        }
        evaluateTimelineVariables(trial) {
            for (const key of Object.keys(trial)) {
                if (typeof trial[key] === "object" &&
                    trial[key] !== null &&
                    typeof trial[key].timelineVariablePlaceholder !== "undefined") {
                    trial[key] = trial[key].timelineVariableFunction();
                }
                // timeline variables that are nested in objects
                if (typeof trial[key] === "object" &&
                    trial[key] !== null &&
                    key !== "timeline" &&
                    key !== "timeline_variables") {
                    this.evaluateTimelineVariables(trial[key]);
                }
            }
        }
        evaluateFunctionParameters(trial) {
            // set a flag so that jsPsych.timelineVariable() is immediately executed in this context
            this.internal.call_immediate = true;
            // iterate over each parameter
            for (const key of Object.keys(trial)) {
                // check to make sure parameter is not "type", since that was eval'd above.
                if (key !== "type") {
                    // this if statement is checking to see if the parameter type is expected to be a function, in which case we should NOT evaluate it.
                    // the first line checks if the parameter is defined in the universalPluginParameters set
                    // the second line checks the plugin-specific parameters
                    if (typeof universalPluginParameters[key] !== "undefined" &&
                        universalPluginParameters[key].type !== exports.ParameterType.FUNCTION) {
                        trial[key] = this.replaceFunctionsWithValues(trial[key], null);
                    }
                    if (typeof trial.type.info.parameters[key] !== "undefined" &&
                        trial.type.info.parameters[key].type !== exports.ParameterType.FUNCTION) {
                        trial[key] = this.replaceFunctionsWithValues(trial[key], trial.type.info.parameters[key]);
                    }
                }
            }
            // reset so jsPsych.timelineVariable() is no longer immediately executed
            this.internal.call_immediate = false;
        }
        replaceFunctionsWithValues(obj, info) {
            // null typeof is 'object' (?!?!), so need to run this first!
            if (obj === null) {
                return obj;
            }
            // arrays
            else if (Array.isArray(obj)) {
                for (let i = 0; i < obj.length; i++) {
                    obj[i] = this.replaceFunctionsWithValues(obj[i], info);
                }
            }
            // objects
            else if (typeof obj === "object") {
                if (info === null || !info.nested) {
                    for (const key of Object.keys(obj)) {
                        if (key === "type" || key === "timeline" || key === "timeline_variables") {
                            // Ignore the object's `type` field because it contains a plugin and we do not want to
                            // call plugin functions. Also ignore `timeline` and `timeline_variables` because they
                            // are used in the `trials` parameter of the preload plugin and we don't want to actually
                            // evaluate those in that context.
                            continue;
                        }
                        obj[key] = this.replaceFunctionsWithValues(obj[key], null);
                    }
                }
                else {
                    for (const key of Object.keys(obj)) {
                        if (typeof info.nested[key] === "object" &&
                            info.nested[key].type !== exports.ParameterType.FUNCTION) {
                            obj[key] = this.replaceFunctionsWithValues(obj[key], info.nested[key]);
                        }
                    }
                }
            }
            else if (typeof obj === "function") {
                return obj();
            }
            return obj;
        }
        setDefaultValues(trial) {
            for (const param in trial.type.info.parameters) {
                // check if parameter is complex with nested defaults
                if (trial.type.info.parameters[param].type === exports.ParameterType.COMPLEX) {
                    if (trial.type.info.parameters[param].array === true) {
                        // iterate over each entry in the array
                        trial[param].forEach(function (ip, i) {
                            // check each parameter in the plugin description
                            for (const p in trial.type.info.parameters[param].nested) {
                                if (typeof trial[param][i][p] === "undefined" || trial[param][i][p] === null) {
                                    if (typeof trial.type.info.parameters[param].nested[p].default === "undefined") {
                                        console.error("You must specify a value for the " +
                                            p +
                                            " parameter (nested in the " +
                                            param +
                                            " parameter) in the " +
                                            trial.type +
                                            " plugin.");
                                    }
                                    else {
                                        trial[param][i][p] = trial.type.info.parameters[param].nested[p].default;
                                    }
                                }
                            }
                        });
                    }
                }
                // if it's not nested, checking is much easier and do that here:
                else if (typeof trial[param] === "undefined" || trial[param] === null) {
                    if (typeof trial.type.info.parameters[param].default === "undefined") {
                        console.error("You must specify a value for the " +
                            param +
                            " parameter in the " +
                            trial.type.info.name +
                            " plugin.");
                    }
                    else {
                        trial[param] = trial.type.info.parameters[param].default;
                    }
                }
            }
        }
        checkExclusions(exclusions) {
            return __awaiter(this, void 0, void 0, function* () {
                if (exclusions.min_width || exclusions.min_height || exclusions.audio) {
                    console.warn("The exclusions option in `initJsPsych()` is deprecated and will be removed in a future version. We recommend using the browser-check plugin instead. See https://www.jspsych.org/latest/plugins/browser-check/.");
                }
                // MINIMUM SIZE
                if (exclusions.min_width || exclusions.min_height) {
                    const mw = exclusions.min_width || 0;
                    const mh = exclusions.min_height || 0;
                    if (window.innerWidth < mw || window.innerHeight < mh) {
                        this.getDisplayElement().innerHTML =
                            "<p>Your browser window is too small to complete this experiment. " +
                                "Please maximize the size of your browser window. If your browser window is already maximized, " +
                                "you will not be able to complete this experiment.</p>" +
                                "<p>The minimum width is " +
                                mw +
                                "px. Your current width is " +
                                window.innerWidth +
                                "px.</p>" +
                                "<p>The minimum height is " +
                                mh +
                                "px. Your current height is " +
                                window.innerHeight +
                                "px.</p>";
                        // Wait for window size to increase
                        while (window.innerWidth < mw || window.innerHeight < mh) {
                            yield delay(100);
                        }
                        this.getDisplayElement().innerHTML = "";
                    }
                }
                // WEB AUDIO API
                if (typeof exclusions.audio !== "undefined" && exclusions.audio) {
                    if (!window.hasOwnProperty("AudioContext") && !window.hasOwnProperty("webkitAudioContext")) {
                        this.getDisplayElement().innerHTML =
                            "<p>Your browser does not support the WebAudio API, which means that you will not " +
                                "be able to complete the experiment.</p><p>Browsers that support the WebAudio API include " +
                                "Chrome, Firefox, Safari, and Edge.</p>";
                        throw new Error();
                    }
                }
            });
        }
        drawProgressBar(msg) {
            document
                .querySelector(".jspsych-display-element")
                .insertAdjacentHTML("afterbegin", '<div id="jspsych-progressbar-container">' +
                "<span>" +
                msg +
                "</span>" +
                '<div id="jspsych-progressbar-outer">' +
                '<div id="jspsych-progressbar-inner"></div>' +
                "</div></div>");
        }
        updateProgressBar() {
            this.setProgressBar(this.getProgress().percent_complete / 100);
        }
        setProgressBar(proportion_complete) {
            proportion_complete = Math.max(Math.min(1, proportion_complete), 0);
            document.querySelector("#jspsych-progressbar-inner").style.width =
                proportion_complete * 100 + "%";
            this.progress_bar_amount = proportion_complete;
        }
        getProgressBarCompleted() {
            return this.progress_bar_amount;
        }
    }

    // __rollup-babel-import-regenerator-runtime__
    // temporary patch for Safari
    if (typeof window !== "undefined" &&
        window.hasOwnProperty("webkitAudioContext") &&
        !window.hasOwnProperty("AudioContext")) {
        // @ts-expect-error
        window.AudioContext = webkitAudioContext;
    }
    // end patch
    // The following function provides a uniform interface to initialize jsPsych, no matter whether a
    // browser supports ES6 classes or not (and whether the ES6 build or the Babel build is used).
    /**
     * Creates a new JsPsych instance using the provided options.
     *
     * @param options The options to pass to the JsPsych constructor
     * @returns A new JsPsych instance
     */
    function initJsPsych(options) {
        const jsPsych = new JsPsych(options);
        // Handle invocations of non-existent v6 methods with migration errors
        const migrationMessages = {
            init: "`jsPsych.init()` was replaced by `initJsPsych()` in jsPsych v7.",
            ALL_KEYS: 'jsPsych.ALL_KEYS was replaced by the "ALL_KEYS" string in jsPsych v7.',
            NO_KEYS: 'jsPsych.NO_KEYS was replaced by the "NO_KEYS" string in jsPsych v7.',
            // Getter functions that were renamed
            currentTimelineNodeID: "`currentTimelineNodeID()` was renamed to `getCurrentTimelineNodeID()` in jsPsych v7.",
            progress: "`progress()` was renamed to `getProgress()` in jsPsych v7.",
            startTime: "`startTime()` was renamed to `getStartTime()` in jsPsych v7.",
            totalTime: "`totalTime()` was renamed to `getTotalTime()` in jsPsych v7.",
            currentTrial: "`currentTrial()` was renamed to `getCurrentTrial()` in jsPsych v7.",
            initSettings: "`initSettings()` was renamed to `getInitSettings()` in jsPsych v7.",
            allTimelineVariables: "`allTimelineVariables()` was renamed to `getAllTimelineVariables()` in jsPsych v7.",
        };
        Object.defineProperties(jsPsych, Object.fromEntries(Object.entries(migrationMessages).map(([key, message]) => [
            key,
            {
                get() {
                    throw new MigrationError(message);
                },
            },
        ])));
        return jsPsych;
    }

    exports.JsPsych = JsPsych;
    exports.initJsPsych = initJsPsych;
    exports.universalPluginParameters = universalPluginParameters;

    Object.defineProperty(exports, '__esModule', { value: true });

    return exports;

})({});
var initJsPsych = jsPsychModule.initJsPsych;
