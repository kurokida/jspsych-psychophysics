# Demonsration of the jspsych-psychophysics plugin.

This list is in alphabetical order

## [cross.html](https://www.hes.kyushu-u.ac.jp/~kurokid/jspsychophysics/demos/cross.html)

The cross object can be used to present a fixation point. In this demo, moving two cross are presented. 

## [draw_part_of_image.html](https://www.hes.kyushu-u.ac.jp/~kurokid/jspsychophysics/demos/draw_part_of_image.html)

This file demonstrates how to use the `drawFunc` with the image object. You need not to use the drawFunc when you present intact images. But if you want to modify the images, for example, if you want to present a part of the image, the drawFunc is useful.

## [draw_two_images_repeatedly.html](https://www.hes.kyushu-u.ac.jp/~kurokid/jspsychophysics/demos/draw_two_images_repeatedly.html)

This file demonstrates how to present two images repeatedly until a participant responds to them. This demonstration can be applied to the study on like the change blindness.

## [elapsed_time_frame.html](https://www.hes.kyushu-u.ac.jp/~kurokid/jspsychophysics/demos/elapsed_time_frame.html)

This file demonstrates how to use the `stepFunc` which is called by the requestAnimationFrame method. The elapsed time after begging of a trial is presented both in milliseconds and in frames.

## [lines.html](https://www.hes.kyushu-u.ac.jp/~kurokid/jspsychophysics/demos/lines.html)

This file demonstrates how to present lines. There are two ways to define a line; one is to specify the `angle` and `line_length`, the other is to specify the start (x1, y1) and end (x2, y2) positions of the line. Note that you can not specify both the angle and positions for the same object.

## [localize-circle.html](https://www.hes.kyushu-u.ac.jp/~kurokid/jspsychophysics/demos/localize-circle.html)

This file demonstrates how to respond using a mouse. This can be made by specifying the `response_type` and `response_start_time` property.
    
## [manual_drawFunc_gradation.html](https://www.hes.kyushu-u.ac.jp/~kurokid/jspsychophysics/demos/manual_drawFunc_gradation.html)

A visuals timulus graduated from white to black moves from left to right. This program uses the `drawFunc` function.

## [movingCircles.html](https://www.hes.kyushu-u.ac.jp/~kurokid/jspsychophysics/demos/movingCircles.html)

This file demonstrates how to present moving circles. There are three ways to define motion. 

1. Using the distance and time. 
2. Using the distance and speed.
3. Using the time and speed.
    
Note: You can not specify the speed, distance, and time at the same time.
    
## [movingCircles_frames.html](https://www.hes.kyushu-u.ac.jp/~kurokid/jspsychophysics/demos/movingCircles_frames.html)

This demonstration is the same as the movingCircles.html except for specifying the timing information in terms of frames.

The `show_start(end)_frame` property is used instead of the `show_start(end)_time`.
Also, `the motion_start(end)_frame` property is used instead of the `motion_start(end)_time`.

Note that if you define motion using the distance and time, you have to specify the time in milliseconds not in frames.

## [origin_center.html](https://www.hes.kyushu-u.ac.jp/~kurokid/jspsychophysics/demos/origin_center.html)

This file demonstrates how to present objects using a coordinate with the center of the window as the origin. Set the origin_center property to true (The default is false).

## [randomizedImages.html](https://www.hes.kyushu-u.ac.jp/~kurokid/jspsychophysics/demos/randomizedImages.html)

This file demonstrates how to present a fixation point and an image in a randomized order in the center of the display.

## [rectangles.html](https://www.hes.kyushu-u.ac.jp/~kurokid/jspsychophysics/demos/rectangles.html)

This file demonstrates how to present (moving) rectangles.

## [stepFunc.html](https://www.hes.kyushu-u.ac.jp/~kurokid/jspsychophysics/demos/stepFunc.html)

A circle moves on a virtual circumference.

This file demonstrates how to use the stepFunc which is called by the requestAnimationFrame method, and excuted synchronized with the refresh of the display.

You can directly access the canvas (of which the context) using the stepFunc. You can draw complex visual stimuli.

## [text-rect-circle.html](https://www.hes.kyushu-u.ac.jp/~kurokid/jspsychophysics/demos/text-rect-circle.html)

This file demonstrates how to present a text message, a rect, and a circle with SOAs

## [texts.html](https://www.hes.kyushu-u.ac.jp/~kurokid/jspsychophysics/demos/texts.html)

The 'Hello world!' demonstration. You can start a new line using the '\n'. Texts can be moved as the same as rectangles.

## [tutorial.html](https://www.hes.kyushu-u.ac.jp/~kurokid/jspsychophysics/demos/tutorial.html)

The detailed tutorial is written at [the top page](http://jspsychophysics.hes.kyushu-u.ac.jp/)

## [twoImagesWithSOA.html](https://www.hes.kyushu-u.ac.jp/~kurokid/jspsychophysics/demos/twoImagesWithSOA.html)

This file demonstrates how to present two images with the 500-ms SOA.

## [twoImagesWithSOAinFrames](https://www.hes.kyushu-u.ac.jp/~kurokid/jspsychophysics/demos/twoImagesWithSOAinFrames.html)

This file is nearly same as the twoImagesWithSOA.html except for that the display durations are specified in frames not in ms.

The first image is presented for 5 frames (about 83 ms in a 60 Hz monitor), and the second image is presented for 20 frames (about 333 ms in a 60 Hz monitor) with a 60-frame SOA.

## [twoSoundsWithSOA.html](https://www.hes.kyushu-u.ac.jp/~kurokid/jspsychophysics/demos/twoSoundsWithSOA.html)

This file demonstrates how to present two sounds with a 1000-ms SOA.

Note that the experimental files (html, js, and audio) must be uploaded in a web-server to run.