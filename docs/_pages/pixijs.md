---
permalink: /pixijs/
title: "Psychophysics plugin with PixiJS"
---

Starting with version 3.2.0, the psychophysics plugin can present visual stimuli using [PixiJS](https://pixijs.com/) functionality. You can turn on and off Pixi mode, but if you present drifting gabor patches Pixi mode should be turned on.

If you are interested in Pixi mode, please see [the results of an accuracy test conducted in June 2024](https://osf.io/pj4sb/wiki/Accuracy%20test%20June%202024/) at first.

# How to turn on Pixi mode

## Upload files to a web server

To use PixiJS, in priciple, the program files must be uploaded to a web server. However, some programs will work on a local PC (e.g., a prgoram presenting rectangles and circles.)

## Donwload PixiJS Version 6.5.8

Although details are not known, I noticed that there might be a flush between the trials except for version 6.5.8. So, I recommend to download the production build file (pixi.min.js) from [the release page](https://github.com/pixijs/pixijs/releases/tag/v6.5.8). Then save the pixi.min.js in the same folder as your program.

See [this page](https://pixijs.download/v6.5.6/docs/index.html) for the documentation of PixiJS V6.

Note that the psychophysics plugin is not compatible with PixiJS V7 or higher.

## Include PixiJS using a script tag

Note that the pixi.min.js must be loaded before the psychophysics.js.

```javascript
<script src="./pixi.min.js"></script>
<script src="./jspsych-psychophysics.js"></script>
```

## Set the pixi property as true

The pixi property is false by default, i.e., Pixi mode is off.

```javascript

const trial = {
    type: jsPsychPsychophysics,
    pixi: true,
    stimuli: [gabor],
}

```

# Known problems in Pixi mode

- There may be a way to enable anti-aliasing, but I have yet to find it. You can clearly see the difference between anti-aliasing [on](https://www.hes.kyushu-u.ac.jp/~kurokid/PixiJS_test/psychophysics-demos/dynamically_change.html?pixi_flag=0) and [off](https://www.hes.kyushu-u.ac.jp/~kurokid/PixiJS_test/psychophysics-demos/dynamically_change.html?pixi_flag=1). 
- You may feel a flash of screen immediately after the trial when the background color is not white. In this case, you can avoid the problem by writing as `<body bgcolor="gray"></body>`.
- The quality of text seems to be better in non Pixi mode. For example, [Pixi mode](https://www.hes.kyushu-u.ac.jp/~kurokid/jspsychophysics/demos/mask_filter_with_label.html?pixi_flag=1) and [Non Pixi mode](https://www.hes.kyushu-u.ac.jp/~kurokid/jspsychophysics/demos/mask_filter_with_label.html?pixi_flag=0)

So, please switch between Pixi modes depending on the purpose of the experiment.

# Advanced usage

Using the PixiJS application's ticker, you can change attributes of the stimulus. See the "Writing an Update Loop" section in [the PixiJS guides](https://pixijs.io/guides/basics/getting-started.html). To do the same thing in the psychophysics plugin, use the change_attr function. See [demos/change_attributes.html](https://github.com/kurokida/jspsych-psychophysics/blob/master/psychophysics-demos/change_attributes.html) and [demos/elapsed_time_frame_pixi.html](https://github.com/kurokida/jspsych-psychophysics/blob/master/psychophysics-demos/elapsed_time_frame_pixi.html).

If you are familiar with PixiJS, you can make the PixiJS instances and include them in the stimuli property of the psychophysics plugin. See the [demos/draw_part_of_image_pixi.html](https://github.com/kurokida/jspsych-psychophysics/blob/master/psychophysics-demos/draw_part_of_image_pixi.html).

<You can change uniforms.>