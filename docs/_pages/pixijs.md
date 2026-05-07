---
permalink: /pixijs/
title: "Psychophysics plugin with PixiJS"
---

Starting with version 3.2.0, the psychophysics plugin can present visual stimuli using [PixiJS](https://pixijs.com/) functionality. You can turn on and off Pixi mode, but if you present drifting gabor patches Pixi mode should be turned on.

# Using PixiJS with jspsych-psychophysics (v5+)

From version 5, the integration with PixiJS has been significantly updated to support **PixiJS v8**. This version provides a more flexible way to handle the Pixi Application, but it requires a slightly different setup than previous versions.

# Key Changes and Requirements

## 1. Load the PixiJS Library
You must include the PixiJS library via a `<script>` tag in your HTML header. Ensure you are using a version compatible with v8. For more information on the available PixiJS assets, visit: https://cdnjs.com/libraries/pixi.js

```html
<script src="https://cdnjs.cloudflare.com/ajax/libs/pixi.js/8.13.2/pixi.min.js" integrity="sha512-rOMqai9NIPaFWpmvHUjdOa2dSuaaYo6i7E19jS1ZW9rjnrl4qAOOtsOeTk0QgIflFCe2ZYi/7or3CRF6VfBk9g==" crossorigin="anonymous" referrerpolicy="no-referrer"></script>
```

## 2. Use async Wrapper
Since PixiJS v8 initialization is asynchronous, you must wrap your entire jsPsych code in an `async` function or an IIFE (Immediately Invoked Function Expression).

```javascript
    (async () => {

        const jsPsych = initJsPsych({
            on_finish: function() {
                app.destroy(true, {
                    children: true,
                    texture: true,
                    baseTexture: true
                });
                jsPsych.data.displayData();
            }
        })

```

## 3. Initialize the Application Manually
Previously, the plugin handled the Pixi instance internally. Now, you need to:
- Create the PIXI.Application instance yourself.
- Call await app.init({}).
- Pass the app instance to the plugin using the `pixi_app` property as a function.

Important: The old `pixi` property has been removed. You must use `pixi_app`.

```javascript
const app = new PIXI.Application();
await app.init({ 
    // antialias: true // Uncomment this for smoother edges
});

const trial = {
    type: jsPsychPsychophysics,
    pixi_app: function() {
        return app;
    },
    stimuli: [circle, rect, image],
}
```

## 4. Enable Antialiasing
If you want to enable antialiasing for smoother graphics, set antialias: true within the app.init() options. See psychophysics-demos/PixiJS/mouse_event.html

## 5. Proper Cleanup (Destroy)
To prevent memory leaks ensure you call app.destroy() when the experiment finishes.

# Minimal Example
The following code demonstrates the simplest way to present a fixation cross using PixiJS.

```html
<!DOCTYPE html>
<html>
<head>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/pixi.js/8.13.2/pixi.min.js"></script>
    <script src="jspsych/jspsych.js"></script>
    <script src="jspsych-psychophysics.js"></script>
    <link rel="stylesheet" href="jspsych/jspsych.css">
</head>
<body></body>
<script>
    (async () => {
        // 1. Initialize jsPsych and handle cleanup
        const jsPsych = initJsPsych({
            on_finish: function() {
                // Clean up PixiJS resources to free memory
                app.destroy(true, {
                    children: true,
                    texture: true,
                });
                jsPsych.data.displayData();
            }
        });

        // 2. Setup PixiJS Application (Async)
        const app = new PIXI.Application();
        await app.init({ 
            // antialias: true // Uncomment this for smoother edges
        });

        const cross_object = {
            obj_type: 'cross',        
            line_length: 50,
            line_color: 'black'
        }

        const trial = {
            type: jsPsychPsychophysics,
            // 3. Pass the app instance via pixi_app function
            pixi_app: function() {
                return app;
            },
            stimuli: [cross_object],
        }

        jsPsych.run([trial]);
    })();
</script>
</html>
```

If you are not using images, you can run the program in a local environment. Please note that if you use images, you must upload them to a server due to CORS policy restrictions.


# Advanced usage

Using the PixiJS application's [ticker](https://pixijs.com/8.x/guides/components/ticker), you can change attributes of the stimulus. To do the same thing in the psychophysics plugin, use the `change_attr` function. See [demos/PixiJS/change_attributes.html](https://github.com/kurokida/jspsych-psychophysics/blob/master/psychophysics-demos/PixiJS/change_attributes.html) and [demos/PixiJS/elapsed_time_frame_pixi.html](https://github.com/kurokida/jspsych-psychophysics/blob/master/psychophysics-demos/PixiJS/elapsed_time_frame_pixi.html).

If you are familiar with PixiJS, you can make the PixiJS instances and include them in the stimuli property of the psychophysics plugin. See the [demos/PixiJS/draw_part_of_image_pixi.html](https://github.com/kurokida/jspsych-psychophysics/blob/master/psychophysics-demos/PixiJS/draw_part_of_image_pixi.html).

