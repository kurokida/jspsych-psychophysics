---
permalink: /pixijs/
title: "Psychophysics plugin with PixiJS"
---

Starting with version 3.2.0, the psychophysics plugin can present visual stimuli using [PixiJS](https://pixijs.com/) functionality. You can turn on and off Pixi mode, but if you present drifting gabor patches Pixi mode should be turned on.

If you are interested in Pixi mode, please see [the results of an accuracy test conducted in April 2022](https://www.hes.kyushu-u.ac.jp/~kurokid/PixiJS_test/AccuracyTest202204/histogram20220421.html) at first. I obtained good results in total, but I am a little concerned about Firefox. Note that I have only checked one laptop.

# How to turn on Pixi mode

## Upload files to a web server

To use PixiJS, in priciple, the program files must be uploaded to a web server. However, some programs will work on a local PC (e.g., a prgoram presenting rectangles and circles.)

## Include PixiJS using a script tag

```javascript
<script src="https://pixijs.download/release/pixi.js"></script>
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

# How to check if the program is working in Pixi mode

Please open the JavaScript console window in your browser. If you are using Chrome on Windows, press Ctrl + Shift + I to open the console. You'll see the following line in the console if the program runs in Pixi mode.

![pixi_mode](/images/pixi_mode.png)


# Known problems in Pixi mode

- There may be a way to enable anti-aliasing, but I have yet to find it. You can clearly see the difference between anti-aliasing [on](https://www.hes.kyushu-u.ac.jp/~kurokid/PixiJS_test/psychophysics-demos/dynamically_change.html?pixi_flag=0) and [off](https://www.hes.kyushu-u.ac.jp/~kurokid/PixiJS_test/psychophysics-demos/dynamically_change.html?pixi_flag=1). 
- You may feel a flash of screen immediately after the trial when the background color is not white. In this case, you can avoid the problem by writing as `<body bgcolor="gray"></body>`.
- The quality of text seems to be better in non Pixi mode. For example, [Pixi mode](https://www.hes.kyushu-u.ac.jp/~kurokid/PixiJS_test/psychophysics-demos/mask_filter_with_label.html?pixi_flag=1) and [Non Pixi mode](https://www.hes.kyushu-u.ac.jp/~kurokid/PixiJS_test/psychophysics-demos/mask_filter_with_label.html?pixi_flag=0)

So, please switch between Pixi modes depending on the purpose of the experiment.

# Advanced usage

Using the PixiJS application's ticker, you can change attributes of the stimulus. See the "Writing an Update Loop" section in [the PixiJS guides](https://pixijs.io/guides/basics/getting-started.html). To do the same thing in the psychophysics plugin, use the change_attr function. See [demos/change_attributes.html](https://github.com/kurokida/jspsych-psychophysics/blob/master/psychophysics-demos/change_attributes.html) and [demos/elapsed_time_frame_pixi.html](https://github.com/kurokida/jspsych-psychophysics/blob/master/psychophysics-demos/elapsed_time_frame_pixi.html).

If you are familiar with PixiJS, you can make the PixiJS instances and include them in the stimuli property of the psychophysics plugin. See the demos/draw_part_of_image_pixi.html.

<You can change uniforms.>