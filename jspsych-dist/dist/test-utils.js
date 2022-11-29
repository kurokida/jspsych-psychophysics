(function (exports, timers, jspsych) {
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

    function dispatchEvent(event) {
        document.body.dispatchEvent(event);
    }
    function keyDown(key) {
        dispatchEvent(new KeyboardEvent("keydown", { key }));
    }
    function keyUp(key) {
        dispatchEvent(new KeyboardEvent("keyup", { key }));
    }
    function pressKey(key) {
        keyDown(key);
        keyUp(key);
    }
    function mouseDownMouseUpTarget(target) {
        target.dispatchEvent(new MouseEvent("mousedown", { bubbles: true }));
        target.dispatchEvent(new MouseEvent("mouseup", { bubbles: true }));
    }
    function clickTarget(target) {
        target.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    }
    /**
     * Dispatch a `mousemove` event, with x and y defined relative to the container element.
     * @param x The x location of the event, relative to the x location of `container`.
     * @param y The y location of the event, relative to the y location of `container`.
     * @param container The DOM element for relative location of the event.
     */
    function mouseMove(x, y, container) {
        const containerRect = container.getBoundingClientRect();
        const eventInit = {
            clientX: containerRect.x + x,
            clientY: containerRect.y + y,
            bubbles: true,
        };
        container.dispatchEvent(new MouseEvent("mousemove", eventInit));
    }
    /**
     * Dispatch a `mouseup` event, with x and y defined relative to the container element.
     * @param x The x location of the event, relative to the x location of `container`.
     * @param y The y location of the event, relative to the y location of `container`.
     * @param container The DOM element for relative location of the event.
     */
    function mouseUp(x, y, container) {
        const containerRect = container.getBoundingClientRect();
        const eventInit = {
            clientX: containerRect.x + x,
            clientY: containerRect.y + y,
            bubbles: true,
        };
        container.dispatchEvent(new MouseEvent("mouseup", eventInit));
    }
    /**
     * Dispatch a `mousemove` event, with x and y defined relative to the container element.
     * @param x The x location of the event, relative to the x location of `container`.
     * @param y The y location of the event, relative to the y location of `container`.
     * @param container The DOM element for relative location of the event.
     */
    function mouseDown(x, y, container) {
        const containerRect = container.getBoundingClientRect();
        const eventInit = {
            clientX: containerRect.x + x,
            clientY: containerRect.y + y,
            bubbles: true,
        };
        container.dispatchEvent(new MouseEvent("mousedown", eventInit));
    }
    /**
     * https://github.com/facebook/jest/issues/2157#issuecomment-279171856
     */
    function flushPromises() {
        return new Promise((resolve) => timers.setImmediate(resolve));
    }
    /**
     * Runs the given timeline by calling `jsPsych.run()` on the provided JsPsych object.
     *
     * @param timeline The timeline that is passed to `jsPsych.run()`
     * @param jsPsych The jsPsych instance to be used. If left empty, a new instance will be created. If
     * a settings object is passed instead, the settings will be used to create the jsPsych instance.
     *
     * @returns An object containing test helper functions, the jsPsych instance, and the jsPsych
     * display element
     */
    function startTimeline(timeline, jsPsych = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            const jsPsychInstance = jsPsych instanceof jspsych.JsPsych ? jsPsych : new jspsych.JsPsych(jsPsych);
            let hasFinished = false;
            const finished = jsPsychInstance.run(timeline).then(() => {
                hasFinished = true;
            });
            yield flushPromises();
            const displayElement = jsPsychInstance.getDisplayElement();
            return {
                jsPsych: jsPsychInstance,
                displayElement,
                /** Shorthand for `jsPsych.getDisplayElement().innerHTML` */
                getHTML: () => displayElement.innerHTML,
                /** Shorthand for `jsPsych.data.get()` */
                getData: () => jsPsychInstance.data.get(),
                expectFinished: () => __awaiter(this, void 0, void 0, function* () {
                    yield flushPromises();
                    expect(hasFinished).toBe(true);
                }),
                expectRunning: () => __awaiter(this, void 0, void 0, function* () {
                    yield flushPromises();
                    expect(hasFinished).toBe(false);
                }),
                /** A promise that is resolved when `jsPsych.run()` is done. */
                finished,
            };
        });
    }
    /**
     * Runs the given timeline by calling `jsPsych.simulate()` on the provided JsPsych object.
     *
     * @param timeline The timeline that is passed to `jsPsych.run()`
     * @param simulation_mode Either 'data-only' mode or 'visual' mode.
     * @param simulation_options Options to pass to `jsPsych.simulate()`
     * @param jsPsych The jsPsych instance to be used. If left empty, a new instance will be created. If
     * a settings object is passed instead, the settings will be used to create the jsPsych instance.
     *
     * @returns An object containing test helper functions, the jsPsych instance, and the jsPsych
     * display element
     */
    function simulateTimeline(timeline, simulation_mode, simulation_options = {}, jsPsych = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            const jsPsychInstance = jsPsych instanceof jspsych.JsPsych ? jsPsych : new jspsych.JsPsych(jsPsych);
            let hasFinished = false;
            const finished = jsPsychInstance
                .simulate(timeline, simulation_mode, simulation_options)
                .then(() => {
                hasFinished = true;
            });
            yield flushPromises();
            const displayElement = jsPsychInstance.getDisplayElement();
            return {
                jsPsych: jsPsychInstance,
                displayElement,
                /** Shorthand for `jsPsych.getDisplayElement().innerHTML` */
                getHTML: () => displayElement.innerHTML,
                /** Shorthand for `jsPsych.data.get()` */
                getData: () => jsPsychInstance.data.get(),
                expectFinished: () => __awaiter(this, void 0, void 0, function* () {
                    yield flushPromises();
                    expect(hasFinished).toBe(true);
                }),
                expectRunning: () => __awaiter(this, void 0, void 0, function* () {
                    yield flushPromises();
                    expect(hasFinished).toBe(false);
                }),
                /** A promise that is resolved when `jsPsych.simulate()` is done. */
                finished,
            };
        });
    }

    exports.clickTarget = clickTarget;
    exports.dispatchEvent = dispatchEvent;
    exports.flushPromises = flushPromises;
    exports.keyDown = keyDown;
    exports.keyUp = keyUp;
    exports.mouseDown = mouseDown;
    exports.mouseDownMouseUpTarget = mouseDownMouseUpTarget;
    exports.mouseMove = mouseMove;
    exports.mouseUp = mouseUp;
    exports.pressKey = pressKey;
    exports.simulateTimeline = simulateTimeline;
    exports.startTimeline = startTimeline;

    Object.defineProperty(exports, '__esModule', { value: true });

    return exports;

})({}, timers, jspsych);
