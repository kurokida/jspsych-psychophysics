# jspsych-psychophysics
This is a jsPsych plugin for psychophysics.
Please refer to the website: https://kurokida.github.io/jspsych-psychophysics/

# For jspsych-builder users

The [jspsych-builder](https://github.com/bjoluc/jspsych-builder) library is a useful tool for users who are familiar with node.js/NPM packages to make a jspsych-based program. This is a brief explanation for the builder users.

```
npm install jspsych-builder
npx jspsych-builder init
npm install @kurokida/jspsych-psychophysics
npm list
```

You'll see the src/experiment.js. This is a main file of your experiment. Please add the following code at the top of the file.

```javascript
import PsychophysicsPlugin from "@kurokida/jspsych-psychophysics";
```

Then, you can make a program using the psychophysics plugin as following:

```javascript
const line_object = {
    obj_type: 'line',        
    angle: 45,
    line_length: 200,
    line_width: 4,
    line_color: 'black',
}

timeline.push({
    // type: jsPsychPsychophysics, // This format is for users who don't use the builder.
    type: PsychophysicsPlugin,
    stimuli: [line_object],
})

```