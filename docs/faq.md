# FAQ about using the jspsych-psychophysics plugin.

## 1. Can I change the center of the window (canvas) to the origin of the coordinates?

Yes. Normally, the origin of the coordinate is the top left of the canvas. But the origin can be changed to the center of the window setting [the origin_center property](http://jspsychophysics.hes.kyushu-u.ac.jp/objectProperties.html) as true. The unit is the pixel. 

## 2. Can I specify the stimulus presentation time in terms of number of frames rather than milliseconds?

Yes. If you want to control the presentation time strictly, it is better to specify the presentation time with frames instead of milliseconds.
If [the is_frame property](http://jspsychophysics.hes.kyushu-u.ac.jp/objectProperties.html) is true, the plugin tries to present the stimulus for the specified frame. 

## 3. How many frames of stimuli will the plugin present if I specify a presentation time of 40 ms?

If the is_frame property is false, i.e., if the presentation time is specified in ms, the plugin presents the stimulus according to the following calculation.

Using the requestAnimationFrame method the time since the methods was first called, is measured. If the time is greater than or equal to show_start_time but less than show_end_time, the stimulus is presented.

Therefore, for example, the presentation time of 40 ms is specified, the stimulus is expected to be presented for two frames (about 33.4ms). 

However, this prediction is not consistent with the actual results which was measured using [the Black Box tool kit](https://www.blackboxtoolkit.com/index.html). Please see [my OSF page](https://osf.io/pj4sb/wiki/home/)

For example, [the histograms of the 20-ms display duration condition](https://www.hes.kyushu-u.ac.jp/~kurokid/histograms/Study1_Duration_ProBook.html) which was measured on a ProBook (Windows laptop 64 bit) with the jspsych-psychophysics plugin was almost consistent with the prediction. On the other hand, [the histograms of the 20-ms display duration condition](https://www.hes.kyushu-u.ac.jp/~kurokid/histograms/Study1_Duration_MacBookPro.html) which was measured on a MacBook Pro with the jspsych-psychophysics plugin showed multimodal distributions, with an interval of one frame.

If you want to control the presentation time strictly, it is better to specify the presentation time in terms of frames instead of milliseconds.

## 4. I can't present audio stimuli at all.

Perhaps you are running the program on your local computer.

You should upload the files to a web server to use the WebAudio.
This is mentioned at [the jsPsych forum](https://groups.google.com/forum/#!msg/jspsych/eth7QtLghvY/DR8Hx7CADwAJ).

And, you should turn on the WebAudio for accurate presentation of audio stimuli.

## 5. I can't prepare a web server. 

[Cognition](https://www.cognition.run/) is one of the most promising options.

## 6. Can I record where the participants click?

Yes. See the [demos/localize-circle.html](https://www.hes.kyushu-u.ac.jp/~kurokid/jspsychophysics/demos/localize-circle.html). The origin of the coordinate is the top left of the canvas. The coordinates of the center of the canvas are recorded at the same time.

## 7. Can I specify the mouse/keyboard event handler?

Yes. See the [demos/mouse_drawing.html](https://www.hes.kyushu-u.ac.jp/~kurokid/jspsychophysics/demos/mouse_drawing.html), [demos/mouse_event.html](https://www.hes.kyushu-u.ac.jp/~kurokid/jspsychophysics/demos/mouse_event.html), and the [demos/keyboard_event.html](https://www.hes.kyushu-u.ac.jp/~kurokid/jspsychophysics/demos/keyboard_event.html). The mousedown, mouseup, and mousemove on the canvas and the keydown and keyup on the document are supported.

## 8. The jsPsych.timelineVariable function which specified in a stimulus object does not work properly.

See the [demos/how_to_timeline_variables.html](https://www.hes.kyushu-u.ac.jp/~kurokid/jspsychophysics/demos/how_to_timeline_variables.html) and [demos/response_start_time_depends_on_onsets.html](https://www.hes.kyushu-u.ac.jp/~kurokid/jspsychophysics/demos/response_start_time_depends_on_onsets.html)

## 9. How can I access the stimuli from other unctions?

Please use the `jsPsych.currentTrial().stim_array`. See the [demos/mouse_event.html](https://www.hes.kyushu-u.ac.jp/~kurokid/jspsychophysics/demos/mouse_event.html), the [demos/keyboard_event.html](https://www.hes.kyushu-u.ac.jp/~kurokid/jspsychophysics/demos/keyboard_event.html), and the [demos/draw_two_images_repeatedly.html](https://www.hes.kyushu-u.ac.jp/~kurokid/jspsychophysics/demos/draw_two_images_repeatedly.html)