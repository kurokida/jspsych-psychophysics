Presenting gabor patches

You can present gabor patches using the jspsych-psychophysics plugin.

The calculation method is based on [the Psychtoolbox](http://psychtoolbox.org/), although it doesn't use procedural texture mapping. I also have referenced [the gaborgen-js code](https://github.com/jtth/gaborgen-js).

You can choose either [the numeric.js](https://github.com/sloisel/numeric) or [the math.js](https://mathjs.org/) as the method for drawing gabor patches. The numeric.js is considerably faster than the math.js, but the latter is being developed more aggressively than the former.

# Demonstration

# The drifting gabor patch

You are capable of making a gabor patch drift. The Gabor patch drifts more smoothly when it is presented using the numeric.js more than using the math.js. However, its speed is not guaranteed when using either library.

The psychophysics plugin records the averaged time of a frame in terms of milliseconds (avg_frame_time). When using a display with a refresh rate of 60 Hz, theoretically this would be 16.7 ms. However, in my PC, the avg_frame_time was about 27 ms when the drifting patch was drawn using the numeric.js, and was about 440 ms using the math.js

The avg_frame_time is calculated as follows.

elapsed_time = the time when the requestAnimationFrame was last called - the time when the requestAnimationFrame was first called

avg_frame_time = elapsed_time / the number of times the requestAnimationFrame was called.

Using the avg_frame_time, it is possible to roughly calculate the speed of the drifting patch. For example, if the avg_frame_time was 30 ms and the drif property was specified as 10, the gabor patch drifted by the angular velocity of 10 degrees during 30 ms.

 is recorded.
  avg_frame_time