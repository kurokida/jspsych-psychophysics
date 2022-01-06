---
permalink: /demo_explanation/
title: "Demonsrations of the jspsych-psychophysics plugin"
---

You can view and edit the source code on the CodePen page.

- [tutorial.html](https://www.hes.kyushu-u.ac.jp/~kurokid/jspsychophysics/demos/tutorial.html)-[CodePen](https://codepen.io/kurokida/pen/JjJoXWG) The detailed tutorial is written at [the top page](http://jspsychophysics.hes.kyushu-u.ac.jp/)

# Gabor patches

Please see [Presenting gabor patches in online/web experiments](gabor.md) first.

- [draw-gabor-patches.html](https://www.hes.kyushu-u.ac.jp/~kurokid/jspsychophysics/demos/draw-gabor-patches.html)-[CodePen](https://codepen.io/kurokida/pen/NWgPVxX) This file demonstrates how to present gabor patches.
- [drifting-gabor.html](https://www.hes.kyushu-u.ac.jp/~kurokid/jspsychophysics/demos/drifting-gabor.html)-[CodePen](https://codepen.io/kurokida/pen/gORbJMW) This file demonstrates how to present a drifting gabor patch.
- [gabor_tilt.html](https://www.hes.kyushu-u.ac.jp/~kurokid/jspsychophysics/demos/gabor_tilt.html)-[CodePen](https://codepen.io/kurokida/pen/YzrvjvV) This file demonstrates how to change the tilt of the gabor by pressing keys.

# Images

- [randomizedImages.html](https://www.hes.kyushu-u.ac.jp/~kurokid/jspsychophysics/demos/randomizedImages.html)-[CodePen](https://codepen.io/kurokida/pen/jOwEowv) This file demonstrates how to present a fixation point and an image in a randomized order in the center of the display.

- [twoImagesWithSOA.html](https://www.hes.kyushu-u.ac.jp/~kurokid/jspsychophysics/demos/twoImagesWithSOA.html)-[CodePen](https://codepen.io/kurokida/pen/BaZjxov) This file demonstrates how to present two images with the 500-ms SOA.

- [twoImagesWithSOAinFrames](https://www.hes.kyushu-u.ac.jp/~kurokid/jspsychophysics/demos/twoImagesWithSOAinFrames.html)-[CodePen](https://codepen.io/kurokida/pen/NWgxMNV) This file is nearly same as the twoImagesWithSOA.html except for that the display durations are specified in frames not in ms. The first image is presented for 5 frames (about 83 ms in a 60 Hz monitor), and the second image is presented for 20 frames (about 333 ms in a 60 Hz monitor) with a 60-frame SOA.

- [mask_filter.html](https://www.hes.kyushu-u.ac.jp/~kurokid/jspsychophysics/demos/mask_filter.html) This file demonstrates how to apply masking and filtering to the image file.

- [draw_part_of_image.html](https://www.hes.kyushu-u.ac.jp/~kurokid/jspsychophysics/demos/draw_part_of_image.html)-[CodePen](https://codepen.io/kurokida/pen/OJgMZRd) This file demonstrates how to use the `drawFunc` with the image object. You need not to use the drawFunc when you present intact images. But if you want to modify the images, for example, if you want to present a part of the image, the drawFunc is useful.

- [rsvp.html](https://www.hes.kyushu-u.ac.jp/~kurokid/jspsychophysics/demos/rsvp.html)-[CodePen](https://codepen.io/kurokida/pen/KKqwzyE) This file demonstrates how to present multiple images in random order in succession. That is, rapid serial visual presentation (RSVP).

# Sounds

[twoSoundsWithSOA.html](https://www.hes.kyushu-u.ac.jp/~kurokid/jspsychophysics/demos/twoSoundsWithSOA.html)

This file demonstrates how to present two sounds with a 1000-ms SOA.

Note that the experimental files (html, js, and audio) must be uploaded in a web-server to run.

[play_html5_sound_by_key.html](https://www.hes.kyushu-u.ac.jp/~kurokid/jspsychophysics/demos/play_html5_sound_by_key.html)

This file demonstrates how to play the sound by pressing a key. This program doesn't use the Web Audio API.

**play_webaudio_sound_by_key.html**

I'm sorry, but this program will not work with jsPsych 6.3.0 and above. Please use the play_html5_sound_by_key.html instead.

~~This file demonstrates how to play the sound by pressing a key. This program uses the Web Audio API. The Web Audio API should be used for time-accurate presentation, but the code would be a bit more complex compared with the play_html5_sound_by_key.html.~~

# Event handlers

[keyboard_event.html](https://www.hes.kyushu-u.ac.jp/~kurokid/jspsychophysics/demos/keyboard_event.html)

This file demonstrates how to specify the keyboard-event functions. Pressing the ArrowUp/ArrowDown key, the luminance of the circle will change. Press the space key to finish the program.

[mouse_event.html](https://www.hes.kyushu-u.ac.jp/~kurokid/jspsychophysics/demos/mouse_event.html)

This file demonstrates how to specify the mouse-event functions. As you move the mouse, the slope of the line segment changes. By changing the direction of the mouse in motion, the direction of rotation of the line changes. This also demonstrates how to use buttons as a response.

[mouse_drawing.html](https://www.hes.kyushu-u.ac.jp/~kurokid/jspsychophysics/demos/mouse_drawing.html)

This file demonstrates how to specify the mouse-event functions. This demo is like a drawing application. Note that the `clear_canvas` property is set to false.

# requestAnimationFrame

[elapsed_time_frame.html](https://www.hes.kyushu-u.ac.jp/~kurokid/jspsychophysics/demos/elapsed_time_frame.html)

This file demonstrates how to use the `raf_func` which is called by the requestAnimationFrame method. The elapsed time after begging of a trial is presented both in milliseconds and in frames.

[raf_func.html](https://www.hes.kyushu-u.ac.jp/~kurokid/jspsychophysics/demos/raf_func.html)

A circle moves on a virtual circumference.

This file demonstrates how to use the raf_func which is called by the requestAnimationFrame method, and excuted synchronized with the refresh of the display.

You can directly access the canvas (of which the context) using the raf_func. You can draw complex visual stimuli.

- Advanced! [draw_two_images_repeatedly.html](https://www.hes.kyushu-u.ac.jp/~kurokid/jspsychophysics/demos/draw_two_images_repeatedly.html)-[CodePen](https://codepen.io/kurokida/pen/KKqwLax) This file demonstrates how to present two images repeatedly until a participant responds to them. This demonstration can be applied to the study on like the change blindness.


# Other stimuli

- [cross.html](https://www.hes.kyushu-u.ac.jp/~kurokid/jspsychophysics/demos/cross.html)-[CodePen](https://codepen.io/kurokida/pen/rNwaxRP) The cross object can be used to present a fixation point. In this demo, moving two cross are presented. 

- [lines.html](https://www.hes.kyushu-u.ac.jp/~kurokid/jspsychophysics/demos/lines.html)-[CodePen](https://codepen.io/kurokida/pen/JjJxWwK) This file demonstrates how to present lines. There are two ways to define a line; one is to specify the `angle` and `line_length`, the other is to specify the start (x1, y1) and end (x2, y2) positions of the line. Note that you can not specify both the angle and positions for the same object.

[rectangles.html](https://www.hes.kyushu-u.ac.jp/~kurokid/jspsychophysics/demos/rectangles.html)

This file demonstrates how to present (moving) rectangles.

[texts.html](https://www.hes.kyushu-u.ac.jp/~kurokid/jspsychophysics/demos/texts.html)

The 'Hello world!' demonstration. You can start a new line using the '\n'. Texts can be moved as the same as rectangles.

[text-rect-circle.html](https://www.hes.kyushu-u.ac.jp/~kurokid/jspsychophysics/demos/text-rect-circle.html)

This file demonstrates how to present a text message, a rect, and a circle with SOAs

[movingCircles.html](https://www.hes.kyushu-u.ac.jp/~kurokid/jspsychophysics/demos/movingCircles.html)

This file demonstrates how to present moving circles. There are three ways to define motion. 

1. Using the distance and time. 
2. Using the distance and speed.
3. Using the time and speed.
    
Note: You can not specify the speed, distance, and time at the same time.
    
[movingCircles_frames.html](https://www.hes.kyushu-u.ac.jp/~kurokid/jspsychophysics/demos/movingCircles_frames.html)

This demonstration is the same as the movingCircles.html except for specifying the timing information in terms of frames.

The `show_start(end)_frame` property is used instead of the `show_start(end)_time`.
Also, `the motion_start(end)_frame` property is used instead of the `motion_start(end)_time`.

Note that if you define motion using the distance and time, you have to specify the time in milliseconds not in frames.

[manual_drawFunc_gradation.html](https://www.hes.kyushu-u.ac.jp/~kurokid/jspsychophysics/demos/manual_drawFunc_gradation.html)

A visuals timulus graduated from white to black moves from left to right. This program uses the `drawFunc` function.

# TIPS

[how_to_timeline_variables.html](https://www.hes.kyushu-u.ac.jp/~kurokid/jspsychophysics/demos/how_to_timeline_variables.html)

This file works as the same as the twoImagesWithSOA.html, but the use of the jsPsych.timelineVariable function is slightly different. When you want to use the timeline_variables property with the jspsych-psychophysics plugin, see this file first.

[localize-circle.html](https://www.hes.kyushu-u.ac.jp/~kurokid/jspsychophysics/demos/localize-circle.html)

This file demonstrates how to respond using a mouse. This can be made by specifying the `response_type` and `response_start_time` property.
    
[origin_center.html](https://www.hes.kyushu-u.ac.jp/~kurokid/jspsychophysics/demos/origin_center.html)

This file demonstrates how to present objects using a coordinate with the center of the window as the origin. Set the origin_center property to true (The default is false).

[randomize_show_start_time.html](https://www.hes.kyushu-u.ac.jp/~kurokid/jspsychophysics/demos/randomize_show_start_time.html).

This file demonstrates how to randomize the show_start_time of a image stimulus. The stimulus image is presented from 500 to 3000ms after the fixation point.

[resolution.html](https://www.hes.kyushu-u.ac.jp/~kurokid/jspsychophysics/demos/resolution.html)

If you are using a Mac which has a retina display, the resolution may not match the number of pixels of the canvas. Using this demo, you can know the number of pixels of the canvas.

[response_start_time_depends_on_onsets.html](https://www.hes.kyushu-u.ac.jp/~kurokid/jspsychophysics/demos/response_start_time_depends_on_onsets.html)

This demo explains how to specify different start time of presentation of an image for each trial, and how to get the reaction time based on the start time.

[dynamically_change.html](https://www.hes.kyushu-u.ac.jp/~kurokid/jspsychophysics/demos/dynamically_change.html)-[CodePen](https://codepen.io/kurokida/pen/VwWgbwz) This file demonstrates to change dynamically properties of an object.