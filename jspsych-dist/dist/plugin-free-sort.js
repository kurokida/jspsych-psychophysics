var jsPsychFreeSort = (function (jspsych) {
  'use strict';

  var _package = {
    name: "@jspsych/plugin-free-sort",
    version: "2.0.1",
    description: "jsPsych plugin for drag-and-drop sorting of a collection of images",
    type: "module",
    main: "dist/index.cjs",
    exports: {
      import: "./dist/index.js",
      require: "./dist/index.cjs"
    },
    typings: "dist/index.d.ts",
    unpkg: "dist/index.browser.min.js",
    files: [
      "src",
      "dist"
    ],
    source: "src/index.ts",
    scripts: {
      test: "jest",
      "test:watch": "npm test -- --watch",
      tsc: "tsc",
      build: "rollup --config",
      "build:watch": "npm run build -- --watch"
    },
    repository: {
      type: "git",
      url: "git+https://github.com/jspsych/jsPsych.git",
      directory: "packages/plugin-free-sort"
    },
    author: "Josh de Leeuw",
    license: "MIT",
    bugs: {
      url: "https://github.com/jspsych/jsPsych/issues"
    },
    homepage: "https://www.jspsych.org/latest/plugins/free-sort",
    peerDependencies: {
      jspsych: ">=7.1.0"
    },
    devDependencies: {
      "@jspsych/config": "^3.0.0",
      "@jspsych/test-utils": "^1.2.0"
    }
  };

  function shuffle(array) {
    let cur_idx = array.length, tmp_val, rand_idx;
    while (0 !== cur_idx) {
      rand_idx = Math.floor(Math.random() * cur_idx);
      cur_idx -= 1;
      tmp_val = array[cur_idx];
      array[cur_idx] = array[rand_idx];
      array[rand_idx] = tmp_val;
    }
    return array;
  }
  function make_arr(startValue, stopValue, cardinality) {
    const step = (stopValue - startValue) / (cardinality - 1);
    let arr = [];
    for (let i = 0; i < cardinality; i++) {
      arr.push(startValue + step * i);
    }
    return arr;
  }
  function inside_ellipse(x, y, x0, y0, rx, ry, square = false) {
    if (square) {
      return Math.abs(x - x0) <= rx && Math.abs(y - y0) <= ry;
    } else {
      return (x - x0) * (x - x0) * (ry * ry) + (y - y0) * (y - y0) * (rx * rx) <= rx * rx * (ry * ry);
    }
  }
  function random_coordinate(max_width, max_height) {
    const rnd_x = Math.floor(Math.random() * (max_width - 1));
    const rnd_y = Math.floor(Math.random() * (max_height - 1));
    return {
      x: rnd_x,
      y: rnd_y
    };
  }

  const info = {
    name: "free-sort",
    version: _package.version,
    parameters: {
      stimuli: {
        type: jspsych.ParameterType.IMAGE,
        default: void 0,
        array: true
      },
      stim_height: {
        type: jspsych.ParameterType.INT,
        default: 100
      },
      stim_width: {
        type: jspsych.ParameterType.INT,
        default: 100
      },
      scale_factor: {
        type: jspsych.ParameterType.FLOAT,
        default: 1.5
      },
      sort_area_height: {
        type: jspsych.ParameterType.INT,
        default: 700
      },
      sort_area_width: {
        type: jspsych.ParameterType.INT,
        default: 700
      },
      sort_area_shape: {
        type: jspsych.ParameterType.SELECT,
        options: ["square", "ellipse"],
        default: "ellipse"
      },
      prompt: {
        type: jspsych.ParameterType.HTML_STRING,
        default: ""
      },
      prompt_location: {
        type: jspsych.ParameterType.SELECT,
        options: ["above", "below"],
        default: "above"
      },
      button_label: {
        type: jspsych.ParameterType.STRING,
        default: "Continue"
      },
      change_border_background_color: {
        type: jspsych.ParameterType.BOOL,
        default: true
      },
      border_color_in: {
        type: jspsych.ParameterType.STRING,
        default: "#a1d99b"
      },
      border_color_out: {
        type: jspsych.ParameterType.STRING,
        default: "#fc9272"
      },
      border_width: {
        type: jspsych.ParameterType.INT,
        default: null
      },
      counter_text_unfinished: {
        type: jspsych.ParameterType.HTML_STRING,
        default: "You still need to place %n% item%s% inside the sort area."
      },
      counter_text_finished: {
        type: jspsych.ParameterType.HTML_STRING,
        default: "All items placed. Feel free to reposition items if necessary."
      },
      stim_starts_inside: {
        type: jspsych.ParameterType.BOOL,
        default: false
      },
      column_spread_factor: {
        type: jspsych.ParameterType.FLOAT,
        default: 1
      }
    },
    data: {
      init_locations: {
        type: jspsych.ParameterType.STRING,
        array: true
      },
      moves: {
        type: jspsych.ParameterType.COMPLEX,
        array: true,
        parameters: {
          src: {
            type: jspsych.ParameterType.STRING
          },
          x: {
            type: jspsych.ParameterType.INT
          },
          y: {
            type: jspsych.ParameterType.INT
          }
        }
      },
      final_locations: {
        type: jspsych.ParameterType.COMPLEX,
        array: true,
        parameters: {
          src: {
            type: jspsych.ParameterType.STRING
          },
          x: {
            type: jspsych.ParameterType.INT
          },
          y: {
            type: jspsych.ParameterType.INT
          }
        }
      },
      rt: {
        type: jspsych.ParameterType.INT
      }
    }
  };
  class FreeSortPlugin {
    constructor(jsPsych) {
      this.jsPsych = jsPsych;
    }
    static info = info;
    trial(display_element, trial) {
      var start_time = performance.now();
      var border_color_out = trial.border_color_out;
      var border_width = trial.border_width;
      var stimuli = trial.stimuli;
      if (trial.change_border_background_color == false) {
        border_color_out = "#000000";
      }
      if (trial.border_width == null) {
        border_width = trial.sort_area_height * 0.03;
      }
      let html = '<div id="jspsych-free-sort-arena" class="jspsych-free-sort-arena" style="position: relative; width:' + trial.sort_area_width + "px; height:" + trial.sort_area_height + 'px; margin: auto;"</div>';
      html += '<div id="jspsych-free-sort-border" class="jspsych-free-sort-border" style="position: relative; width:' + trial.sort_area_width * 0.94 + "px; height:" + trial.sort_area_height * 0.94 + "px; border:" + border_width + "px solid " + border_color_out + "; margin: auto; line-height: 0em; ";
      if (trial.sort_area_shape == "ellipse") {
        html += 'webkit-border-radius: 50%; moz-border-radius: 50%; border-radius: 50%"></div>';
      } else {
        html += 'webkit-border-radius: 0%; moz-border-radius: 0%; border-radius: 0%"></div>';
      }
      const html_text = '<div style="line-height: 1.0em;">' + trial.prompt + '<p id="jspsych-free-sort-counter" style="display: inline-block;">' + get_counter_text(stimuli.length) + "</p></div>";
      if (trial.prompt_location == "below") {
        html += html_text;
      } else {
        html = html_text + html;
      }
      html += '<div><button id="jspsych-free-sort-done-btn" class="jspsych-btn" style="margin-top: 5px; margin-bottom: 15px; visibility: hidden;">' + trial.button_label + "</button></div>";
      display_element.innerHTML = html;
      let init_locations = [];
      if (!trial.stim_starts_inside) {
        let num_rows = Math.ceil(Math.sqrt(stimuli.length));
        if (num_rows % 2 != 0) {
          num_rows = num_rows + 1;
        }
        var r_coords = [];
        var l_coords = [];
        for (const x of make_arr(0, trial.sort_area_width - trial.stim_width, num_rows)) {
          for (const y of make_arr(0, trial.sort_area_height - trial.stim_height, num_rows)) {
            if (x > (trial.sort_area_width - trial.stim_width) * 0.5) {
              r_coords.push({
                x: x + trial.sort_area_width * (0.5 * trial.column_spread_factor),
                y
              });
            } else {
              l_coords.push({
                x: x - trial.sort_area_width * (0.5 * trial.column_spread_factor),
                y
              });
            }
          }
        }
        while (r_coords.length + l_coords.length < stimuli.length) {
          r_coords = r_coords.concat(r_coords);
          l_coords = l_coords.concat(l_coords);
        }
        l_coords = l_coords.reverse();
        stimuli = shuffle(stimuli);
      }
      for (let i = 0; i < stimuli.length; i++) {
        var coords;
        if (trial.stim_starts_inside) {
          coords = random_coordinate(
            trial.sort_area_width - trial.stim_width,
            trial.sort_area_height - trial.stim_height
          );
        } else {
          if (i % 2 == 0) {
            coords = r_coords[Math.floor(i * 0.5)];
          } else {
            coords = l_coords[Math.floor(i * 0.5)];
          }
        }
        display_element.querySelector("#jspsych-free-sort-arena").innerHTML += '<img src="' + stimuli[i] + '" data-src="' + stimuli[i] + '" class="jspsych-free-sort-draggable" draggable="false" id="jspsych-free-sort-draggable-' + i + '" style="position: absolute; cursor: move; width:' + trial.stim_width + "px; height:" + trial.stim_height + "px; top:" + coords.y + "px; left:" + coords.x + 'px;"></img>';
        init_locations.push({
          src: stimuli[i],
          x: coords.x,
          y: coords.y
        });
      }
      const inside = stimuli.map(() => trial.stim_starts_inside);
      const moves = [];
      let cur_in = false;
      const draggables = Array.prototype.slice.call(
        display_element.querySelectorAll(".jspsych-free-sort-draggable")
      );
      const border = display_element.querySelector("#jspsych-free-sort-border");
      const button = display_element.querySelector("#jspsych-free-sort-done-btn");
      if (inside.some(Boolean) && trial.change_border_background_color) {
        border.style.borderColor = trial.border_color_in;
      }
      if (inside.every(Boolean)) {
        if (trial.change_border_background_color) {
          border.style.background = trial.border_color_in;
        }
        button.style.visibility = "visible";
        display_element.querySelector("#jspsych-free-sort-counter").innerHTML = trial.counter_text_finished;
      }
      for (const draggable of draggables) {
        draggable.addEventListener("pointerdown", function({ clientX: pageX, clientY: pageY }) {
          let x = pageX - this.offsetLeft;
          let y = pageY - this.offsetTop - window.scrollY;
          this.style.transform = "scale(" + trial.scale_factor + "," + trial.scale_factor + ")";
          const on_pointer_move = ({ clientX, clientY }) => {
            cur_in = inside_ellipse(
              clientX - x,
              clientY - y,
              trial.sort_area_width * 0.5 - trial.stim_width * 0.5,
              trial.sort_area_height * 0.5 - trial.stim_height * 0.5,
              trial.sort_area_width * 0.5,
              trial.sort_area_height * 0.5,
              trial.sort_area_shape == "square"
            );
            this.style.top = Math.min(
              trial.sort_area_height - trial.stim_height * 0.5,
              Math.max(-trial.stim_height * 0.5, clientY - y)
            ) + "px";
            this.style.left = Math.min(
              trial.sort_area_width * 1.5 - trial.stim_width,
              Math.max(-trial.sort_area_width * 0.5, clientX - x)
            ) + "px";
            if (trial.change_border_background_color) {
              if (cur_in) {
                border.style.borderColor = trial.border_color_in;
                border.style.background = "None";
              } else {
                border.style.borderColor = border_color_out;
                border.style.background = "None";
              }
            }
            var elem_number = parseInt(this.id.split("jspsych-free-sort-draggable-")[1], 10);
            inside.splice(elem_number, 1, cur_in);
            if (inside.every(Boolean)) {
              if (trial.change_border_background_color) {
                border.style.background = trial.border_color_in;
              }
              button.style.visibility = "visible";
              display_element.querySelector("#jspsych-free-sort-counter").innerHTML = trial.counter_text_finished;
            } else {
              border.style.background = "none";
              button.style.visibility = "hidden";
              display_element.querySelector("#jspsych-free-sort-counter").innerHTML = get_counter_text(inside.length - inside.filter(Boolean).length);
            }
          };
          document.addEventListener("pointermove", on_pointer_move);
          const on_pointer_up = (e) => {
            document.removeEventListener("pointermove", on_pointer_move);
            this.style.transform = "scale(1, 1)";
            if (trial.change_border_background_color) {
              if (inside.every(Boolean)) {
                border.style.background = trial.border_color_in;
                border.style.borderColor = trial.border_color_in;
              } else {
                border.style.background = "none";
                border.style.borderColor = border_color_out;
              }
            }
            moves.push({
              src: this.dataset.src,
              x: this.offsetLeft,
              y: this.offsetTop
            });
            document.removeEventListener("pointerup", on_pointer_up);
          };
          document.addEventListener("pointerup", on_pointer_up);
        });
      }
      display_element.querySelector("#jspsych-free-sort-done-btn").addEventListener("click", () => {
        if (inside.every(Boolean)) {
          const end_time = performance.now();
          const rt = Math.round(end_time - start_time);
          const items = display_element.querySelectorAll(".jspsych-free-sort-draggable");
          let final_locations = [];
          for (let i = 0; i < items.length; i++) {
            final_locations.push({
              src: items[i].dataset.src,
              x: parseInt(items[i].style.left),
              y: parseInt(items[i].style.top)
            });
          }
          const trial_data = {
            init_locations,
            moves,
            final_locations,
            rt
          };
          this.jsPsych.finishTrial(trial_data);
        }
      });
      function get_counter_text(n) {
        var text_out = "";
        var text_bits = trial.counter_text_unfinished.split("%");
        for (var i = 0; i < text_bits.length; i++) {
          if (i % 2 === 0) {
            text_out += text_bits[i];
          } else {
            if (text_bits[i] == "n") {
              text_out += n.toString();
            } else if (text_bits[i] == "s" && n > 1) {
              text_out += "s";
            }
          }
        }
        return text_out;
      }
    }
  }

  return FreeSortPlugin;

})(jsPsychModule);
