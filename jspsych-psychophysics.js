if (typeof PIXI === "undefined") { var PIXI; }
var jsPsychPsychophysics = (function (jspsych, PIXI) {
	'use strict';

	function _interopNamespaceDefault(e) {
		var n = Object.create(null);
		if (e) {
			Object.keys(e).forEach(function (k) {
				if (k !== 'default') {
					var d = Object.getOwnPropertyDescriptor(e, k);
					Object.defineProperty(n, k, d.get ? d : {
						enumerable: true,
						get: function () { return e[k]; }
					});
				}
			});
		}
		n.default = e;
		return Object.freeze(n);
	}

	var PIXI__namespace = /*#__PURE__*/_interopNamespaceDefault(PIXI);

	function getAugmentedNamespace(n) {
	  if (n.__esModule) return n;
	  var f = n.default;
		if (typeof f == "function") {
			var a = function a () {
				if (this instanceof a) {
	        return Reflect.construct(f, arguments, this.constructor);
				}
				return f.apply(this, arguments);
			};
			a.prototype = f.prototype;
	  } else a = {};
	  Object.defineProperty(a, '__esModule', {value: true});
		Object.keys(n).forEach(function (k) {
			var d = Object.getOwnPropertyDescriptor(n, k);
			Object.defineProperty(a, k, d.get ? d : {
				enumerable: true,
				get: function () {
					return n[k];
				}
			});
		});
		return a;
	}

	var matrix = {};

	// eslint-disable-next-line @typescript-eslint/unbound-method
	const toString = Object.prototype.toString;
	/**
	 * Checks if an object is an instance of an Array (array or typed array, except those that contain bigint values).
	 *
	 * @param value - Object to check.
	 * @returns True if the object is an array or a typed array.
	 */
	function isAnyArray$1(value) {
	    const tag = toString.call(value);
	    return tag.endsWith('Array]') && !tag.includes('Big');
	}

	var libEsm = /*#__PURE__*/Object.freeze({
		__proto__: null,
		isAnyArray: isAnyArray$1
	});

	var require$$0 = /*@__PURE__*/getAugmentedNamespace(libEsm);

	function max(input) {
	  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

	  if (!isAnyArray$1(input)) {
	    throw new TypeError('input must be an array');
	  }

	  if (input.length === 0) {
	    throw new TypeError('input must not be empty');
	  }

	  var _options$fromIndex = options.fromIndex,
	      fromIndex = _options$fromIndex === void 0 ? 0 : _options$fromIndex,
	      _options$toIndex = options.toIndex,
	      toIndex = _options$toIndex === void 0 ? input.length : _options$toIndex;

	  if (fromIndex < 0 || fromIndex >= input.length || !Number.isInteger(fromIndex)) {
	    throw new Error('fromIndex must be a positive integer smaller than length');
	  }

	  if (toIndex <= fromIndex || toIndex > input.length || !Number.isInteger(toIndex)) {
	    throw new Error('toIndex must be an integer greater than fromIndex and at most equal to length');
	  }

	  var maxValue = input[fromIndex];

	  for (var i = fromIndex + 1; i < toIndex; i++) {
	    if (input[i] > maxValue) maxValue = input[i];
	  }

	  return maxValue;
	}

	function min(input) {
	  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

	  if (!isAnyArray$1(input)) {
	    throw new TypeError('input must be an array');
	  }

	  if (input.length === 0) {
	    throw new TypeError('input must not be empty');
	  }

	  var _options$fromIndex = options.fromIndex,
	      fromIndex = _options$fromIndex === void 0 ? 0 : _options$fromIndex,
	      _options$toIndex = options.toIndex,
	      toIndex = _options$toIndex === void 0 ? input.length : _options$toIndex;

	  if (fromIndex < 0 || fromIndex >= input.length || !Number.isInteger(fromIndex)) {
	    throw new Error('fromIndex must be a positive integer smaller than length');
	  }

	  if (toIndex <= fromIndex || toIndex > input.length || !Number.isInteger(toIndex)) {
	    throw new Error('toIndex must be an integer greater than fromIndex and at most equal to length');
	  }

	  var minValue = input[fromIndex];

	  for (var i = fromIndex + 1; i < toIndex; i++) {
	    if (input[i] < minValue) minValue = input[i];
	  }

	  return minValue;
	}

	function rescale$1(input) {
	  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

	  if (!isAnyArray$1(input)) {
	    throw new TypeError('input must be an array');
	  } else if (input.length === 0) {
	    throw new TypeError('input must not be empty');
	  }

	  var output;

	  if (options.output !== undefined) {
	    if (!isAnyArray$1(options.output)) {
	      throw new TypeError('output option must be an array if specified');
	    }

	    output = options.output;
	  } else {
	    output = new Array(input.length);
	  }

	  var currentMin = min(input);
	  var currentMax = max(input);

	  if (currentMin === currentMax) {
	    throw new RangeError('minimum and maximum input values are equal. Cannot rescale a constant array');
	  }

	  var _options$min = options.min,
	      minValue = _options$min === void 0 ? options.autoMinMax ? currentMin : 0 : _options$min,
	      _options$max = options.max,
	      maxValue = _options$max === void 0 ? options.autoMinMax ? currentMax : 1 : _options$max;

	  if (minValue >= maxValue) {
	    throw new RangeError('min option must be smaller than max option');
	  }

	  var factor = (maxValue - minValue) / (currentMax - currentMin);

	  for (var i = 0; i < input.length; i++) {
	    output[i] = (input[i] - currentMin) * factor + minValue;
	  }

	  return output;
	}

	var libEs6 = /*#__PURE__*/Object.freeze({
		__proto__: null,
		default: rescale$1
	});

	var require$$1 = /*@__PURE__*/getAugmentedNamespace(libEs6);

	Object.defineProperty(matrix, '__esModule', { value: true });

	var isAnyArray = require$$0;
	var rescale = require$$1;

	const indent = ' '.repeat(2);
	const indentData = ' '.repeat(4);

	/**
	 * @this {Matrix}
	 * @returns {string}
	 */
	function inspectMatrix() {
	  return inspectMatrixWithOptions(this);
	}

	function inspectMatrixWithOptions(matrix, options = {}) {
	  const {
	    maxRows = 15,
	    maxColumns = 10,
	    maxNumSize = 8,
	    padMinus = 'auto',
	  } = options;
	  return `${matrix.constructor.name} {
${indent}[
${indentData}${inspectData(matrix, maxRows, maxColumns, maxNumSize, padMinus)}
${indent}]
${indent}rows: ${matrix.rows}
${indent}columns: ${matrix.columns}
}`;
	}

	function inspectData(matrix, maxRows, maxColumns, maxNumSize, padMinus) {
	  const { rows, columns } = matrix;
	  const maxI = Math.min(rows, maxRows);
	  const maxJ = Math.min(columns, maxColumns);
	  const result = [];

	  if (padMinus === 'auto') {
	    padMinus = false;
	    loop: for (let i = 0; i < maxI; i++) {
	      for (let j = 0; j < maxJ; j++) {
	        if (matrix.get(i, j) < 0) {
	          padMinus = true;
	          break loop;
	        }
	      }
	    }
	  }

	  for (let i = 0; i < maxI; i++) {
	    let line = [];
	    for (let j = 0; j < maxJ; j++) {
	      line.push(formatNumber(matrix.get(i, j), maxNumSize, padMinus));
	    }
	    result.push(`${line.join(' ')}`);
	  }
	  if (maxJ !== columns) {
	    result[result.length - 1] += ` ... ${columns - maxColumns} more columns`;
	  }
	  if (maxI !== rows) {
	    result.push(`... ${rows - maxRows} more rows`);
	  }
	  return result.join(`\n${indentData}`);
	}

	function formatNumber(num, maxNumSize, padMinus) {
	  return (
	    num >= 0 && padMinus
	      ? ` ${formatNumber2(num, maxNumSize - 1)}`
	      : formatNumber2(num, maxNumSize)
	  ).padEnd(maxNumSize);
	}

	function formatNumber2(num, len) {
	  // small.length numbers should be as is
	  let str = num.toString();
	  if (str.length <= len) return str;

	  // (7)'0.00123' is better then (7)'1.23e-2'
	  // (8)'0.000123' is worse then (7)'1.23e-3',
	  let fix = num.toFixed(len);
	  if (fix.length > len) {
	    fix = num.toFixed(Math.max(0, len - (fix.length - len)));
	  }
	  if (
	    fix.length <= len &&
	    !fix.startsWith('0.000') &&
	    !fix.startsWith('-0.000')
	  ) {
	    return fix;
	  }

	  // well, if it's still too long the user should've used longer numbers
	  let exp = num.toExponential(len);
	  if (exp.length > len) {
	    exp = num.toExponential(Math.max(0, len - (exp.length - len)));
	  }
	  return exp.slice(0);
	}

	function installMathOperations(AbstractMatrix, Matrix) {
	  AbstractMatrix.prototype.add = function add(value) {
	    if (typeof value === 'number') return this.addS(value);
	    return this.addM(value);
	  };

	  AbstractMatrix.prototype.addS = function addS(value) {
	    for (let i = 0; i < this.rows; i++) {
	      for (let j = 0; j < this.columns; j++) {
	        this.set(i, j, this.get(i, j) + value);
	      }
	    }
	    return this;
	  };

	  AbstractMatrix.prototype.addM = function addM(matrix) {
	    matrix = Matrix.checkMatrix(matrix);
	    if (this.rows !== matrix.rows ||
	      this.columns !== matrix.columns) {
	      throw new RangeError('Matrices dimensions must be equal');
	    }
	    for (let i = 0; i < this.rows; i++) {
	      for (let j = 0; j < this.columns; j++) {
	        this.set(i, j, this.get(i, j) + matrix.get(i, j));
	      }
	    }
	    return this;
	  };

	  AbstractMatrix.add = function add(matrix, value) {
	    const newMatrix = new Matrix(matrix);
	    return newMatrix.add(value);
	  };

	  AbstractMatrix.prototype.sub = function sub(value) {
	    if (typeof value === 'number') return this.subS(value);
	    return this.subM(value);
	  };

	  AbstractMatrix.prototype.subS = function subS(value) {
	    for (let i = 0; i < this.rows; i++) {
	      for (let j = 0; j < this.columns; j++) {
	        this.set(i, j, this.get(i, j) - value);
	      }
	    }
	    return this;
	  };

	  AbstractMatrix.prototype.subM = function subM(matrix) {
	    matrix = Matrix.checkMatrix(matrix);
	    if (this.rows !== matrix.rows ||
	      this.columns !== matrix.columns) {
	      throw new RangeError('Matrices dimensions must be equal');
	    }
	    for (let i = 0; i < this.rows; i++) {
	      for (let j = 0; j < this.columns; j++) {
	        this.set(i, j, this.get(i, j) - matrix.get(i, j));
	      }
	    }
	    return this;
	  };

	  AbstractMatrix.sub = function sub(matrix, value) {
	    const newMatrix = new Matrix(matrix);
	    return newMatrix.sub(value);
	  };
	  AbstractMatrix.prototype.subtract = AbstractMatrix.prototype.sub;
	  AbstractMatrix.prototype.subtractS = AbstractMatrix.prototype.subS;
	  AbstractMatrix.prototype.subtractM = AbstractMatrix.prototype.subM;
	  AbstractMatrix.subtract = AbstractMatrix.sub;

	  AbstractMatrix.prototype.mul = function mul(value) {
	    if (typeof value === 'number') return this.mulS(value);
	    return this.mulM(value);
	  };

	  AbstractMatrix.prototype.mulS = function mulS(value) {
	    for (let i = 0; i < this.rows; i++) {
	      for (let j = 0; j < this.columns; j++) {
	        this.set(i, j, this.get(i, j) * value);
	      }
	    }
	    return this;
	  };

	  AbstractMatrix.prototype.mulM = function mulM(matrix) {
	    matrix = Matrix.checkMatrix(matrix);
	    if (this.rows !== matrix.rows ||
	      this.columns !== matrix.columns) {
	      throw new RangeError('Matrices dimensions must be equal');
	    }
	    for (let i = 0; i < this.rows; i++) {
	      for (let j = 0; j < this.columns; j++) {
	        this.set(i, j, this.get(i, j) * matrix.get(i, j));
	      }
	    }
	    return this;
	  };

	  AbstractMatrix.mul = function mul(matrix, value) {
	    const newMatrix = new Matrix(matrix);
	    return newMatrix.mul(value);
	  };
	  AbstractMatrix.prototype.multiply = AbstractMatrix.prototype.mul;
	  AbstractMatrix.prototype.multiplyS = AbstractMatrix.prototype.mulS;
	  AbstractMatrix.prototype.multiplyM = AbstractMatrix.prototype.mulM;
	  AbstractMatrix.multiply = AbstractMatrix.mul;

	  AbstractMatrix.prototype.div = function div(value) {
	    if (typeof value === 'number') return this.divS(value);
	    return this.divM(value);
	  };

	  AbstractMatrix.prototype.divS = function divS(value) {
	    for (let i = 0; i < this.rows; i++) {
	      for (let j = 0; j < this.columns; j++) {
	        this.set(i, j, this.get(i, j) / value);
	      }
	    }
	    return this;
	  };

	  AbstractMatrix.prototype.divM = function divM(matrix) {
	    matrix = Matrix.checkMatrix(matrix);
	    if (this.rows !== matrix.rows ||
	      this.columns !== matrix.columns) {
	      throw new RangeError('Matrices dimensions must be equal');
	    }
	    for (let i = 0; i < this.rows; i++) {
	      for (let j = 0; j < this.columns; j++) {
	        this.set(i, j, this.get(i, j) / matrix.get(i, j));
	      }
	    }
	    return this;
	  };

	  AbstractMatrix.div = function div(matrix, value) {
	    const newMatrix = new Matrix(matrix);
	    return newMatrix.div(value);
	  };
	  AbstractMatrix.prototype.divide = AbstractMatrix.prototype.div;
	  AbstractMatrix.prototype.divideS = AbstractMatrix.prototype.divS;
	  AbstractMatrix.prototype.divideM = AbstractMatrix.prototype.divM;
	  AbstractMatrix.divide = AbstractMatrix.div;

	  AbstractMatrix.prototype.mod = function mod(value) {
	    if (typeof value === 'number') return this.modS(value);
	    return this.modM(value);
	  };

	  AbstractMatrix.prototype.modS = function modS(value) {
	    for (let i = 0; i < this.rows; i++) {
	      for (let j = 0; j < this.columns; j++) {
	        this.set(i, j, this.get(i, j) % value);
	      }
	    }
	    return this;
	  };

	  AbstractMatrix.prototype.modM = function modM(matrix) {
	    matrix = Matrix.checkMatrix(matrix);
	    if (this.rows !== matrix.rows ||
	      this.columns !== matrix.columns) {
	      throw new RangeError('Matrices dimensions must be equal');
	    }
	    for (let i = 0; i < this.rows; i++) {
	      for (let j = 0; j < this.columns; j++) {
	        this.set(i, j, this.get(i, j) % matrix.get(i, j));
	      }
	    }
	    return this;
	  };

	  AbstractMatrix.mod = function mod(matrix, value) {
	    const newMatrix = new Matrix(matrix);
	    return newMatrix.mod(value);
	  };
	  AbstractMatrix.prototype.modulus = AbstractMatrix.prototype.mod;
	  AbstractMatrix.prototype.modulusS = AbstractMatrix.prototype.modS;
	  AbstractMatrix.prototype.modulusM = AbstractMatrix.prototype.modM;
	  AbstractMatrix.modulus = AbstractMatrix.mod;

	  AbstractMatrix.prototype.and = function and(value) {
	    if (typeof value === 'number') return this.andS(value);
	    return this.andM(value);
	  };

	  AbstractMatrix.prototype.andS = function andS(value) {
	    for (let i = 0; i < this.rows; i++) {
	      for (let j = 0; j < this.columns; j++) {
	        this.set(i, j, this.get(i, j) & value);
	      }
	    }
	    return this;
	  };

	  AbstractMatrix.prototype.andM = function andM(matrix) {
	    matrix = Matrix.checkMatrix(matrix);
	    if (this.rows !== matrix.rows ||
	      this.columns !== matrix.columns) {
	      throw new RangeError('Matrices dimensions must be equal');
	    }
	    for (let i = 0; i < this.rows; i++) {
	      for (let j = 0; j < this.columns; j++) {
	        this.set(i, j, this.get(i, j) & matrix.get(i, j));
	      }
	    }
	    return this;
	  };

	  AbstractMatrix.and = function and(matrix, value) {
	    const newMatrix = new Matrix(matrix);
	    return newMatrix.and(value);
	  };

	  AbstractMatrix.prototype.or = function or(value) {
	    if (typeof value === 'number') return this.orS(value);
	    return this.orM(value);
	  };

	  AbstractMatrix.prototype.orS = function orS(value) {
	    for (let i = 0; i < this.rows; i++) {
	      for (let j = 0; j < this.columns; j++) {
	        this.set(i, j, this.get(i, j) | value);
	      }
	    }
	    return this;
	  };

	  AbstractMatrix.prototype.orM = function orM(matrix) {
	    matrix = Matrix.checkMatrix(matrix);
	    if (this.rows !== matrix.rows ||
	      this.columns !== matrix.columns) {
	      throw new RangeError('Matrices dimensions must be equal');
	    }
	    for (let i = 0; i < this.rows; i++) {
	      for (let j = 0; j < this.columns; j++) {
	        this.set(i, j, this.get(i, j) | matrix.get(i, j));
	      }
	    }
	    return this;
	  };

	  AbstractMatrix.or = function or(matrix, value) {
	    const newMatrix = new Matrix(matrix);
	    return newMatrix.or(value);
	  };

	  AbstractMatrix.prototype.xor = function xor(value) {
	    if (typeof value === 'number') return this.xorS(value);
	    return this.xorM(value);
	  };

	  AbstractMatrix.prototype.xorS = function xorS(value) {
	    for (let i = 0; i < this.rows; i++) {
	      for (let j = 0; j < this.columns; j++) {
	        this.set(i, j, this.get(i, j) ^ value);
	      }
	    }
	    return this;
	  };

	  AbstractMatrix.prototype.xorM = function xorM(matrix) {
	    matrix = Matrix.checkMatrix(matrix);
	    if (this.rows !== matrix.rows ||
	      this.columns !== matrix.columns) {
	      throw new RangeError('Matrices dimensions must be equal');
	    }
	    for (let i = 0; i < this.rows; i++) {
	      for (let j = 0; j < this.columns; j++) {
	        this.set(i, j, this.get(i, j) ^ matrix.get(i, j));
	      }
	    }
	    return this;
	  };

	  AbstractMatrix.xor = function xor(matrix, value) {
	    const newMatrix = new Matrix(matrix);
	    return newMatrix.xor(value);
	  };

	  AbstractMatrix.prototype.leftShift = function leftShift(value) {
	    if (typeof value === 'number') return this.leftShiftS(value);
	    return this.leftShiftM(value);
	  };

	  AbstractMatrix.prototype.leftShiftS = function leftShiftS(value) {
	    for (let i = 0; i < this.rows; i++) {
	      for (let j = 0; j < this.columns; j++) {
	        this.set(i, j, this.get(i, j) << value);
	      }
	    }
	    return this;
	  };

	  AbstractMatrix.prototype.leftShiftM = function leftShiftM(matrix) {
	    matrix = Matrix.checkMatrix(matrix);
	    if (this.rows !== matrix.rows ||
	      this.columns !== matrix.columns) {
	      throw new RangeError('Matrices dimensions must be equal');
	    }
	    for (let i = 0; i < this.rows; i++) {
	      for (let j = 0; j < this.columns; j++) {
	        this.set(i, j, this.get(i, j) << matrix.get(i, j));
	      }
	    }
	    return this;
	  };

	  AbstractMatrix.leftShift = function leftShift(matrix, value) {
	    const newMatrix = new Matrix(matrix);
	    return newMatrix.leftShift(value);
	  };

	  AbstractMatrix.prototype.signPropagatingRightShift = function signPropagatingRightShift(value) {
	    if (typeof value === 'number') return this.signPropagatingRightShiftS(value);
	    return this.signPropagatingRightShiftM(value);
	  };

	  AbstractMatrix.prototype.signPropagatingRightShiftS = function signPropagatingRightShiftS(value) {
	    for (let i = 0; i < this.rows; i++) {
	      for (let j = 0; j < this.columns; j++) {
	        this.set(i, j, this.get(i, j) >> value);
	      }
	    }
	    return this;
	  };

	  AbstractMatrix.prototype.signPropagatingRightShiftM = function signPropagatingRightShiftM(matrix) {
	    matrix = Matrix.checkMatrix(matrix);
	    if (this.rows !== matrix.rows ||
	      this.columns !== matrix.columns) {
	      throw new RangeError('Matrices dimensions must be equal');
	    }
	    for (let i = 0; i < this.rows; i++) {
	      for (let j = 0; j < this.columns; j++) {
	        this.set(i, j, this.get(i, j) >> matrix.get(i, j));
	      }
	    }
	    return this;
	  };

	  AbstractMatrix.signPropagatingRightShift = function signPropagatingRightShift(matrix, value) {
	    const newMatrix = new Matrix(matrix);
	    return newMatrix.signPropagatingRightShift(value);
	  };

	  AbstractMatrix.prototype.rightShift = function rightShift(value) {
	    if (typeof value === 'number') return this.rightShiftS(value);
	    return this.rightShiftM(value);
	  };

	  AbstractMatrix.prototype.rightShiftS = function rightShiftS(value) {
	    for (let i = 0; i < this.rows; i++) {
	      for (let j = 0; j < this.columns; j++) {
	        this.set(i, j, this.get(i, j) >>> value);
	      }
	    }
	    return this;
	  };

	  AbstractMatrix.prototype.rightShiftM = function rightShiftM(matrix) {
	    matrix = Matrix.checkMatrix(matrix);
	    if (this.rows !== matrix.rows ||
	      this.columns !== matrix.columns) {
	      throw new RangeError('Matrices dimensions must be equal');
	    }
	    for (let i = 0; i < this.rows; i++) {
	      for (let j = 0; j < this.columns; j++) {
	        this.set(i, j, this.get(i, j) >>> matrix.get(i, j));
	      }
	    }
	    return this;
	  };

	  AbstractMatrix.rightShift = function rightShift(matrix, value) {
	    const newMatrix = new Matrix(matrix);
	    return newMatrix.rightShift(value);
	  };
	  AbstractMatrix.prototype.zeroFillRightShift = AbstractMatrix.prototype.rightShift;
	  AbstractMatrix.prototype.zeroFillRightShiftS = AbstractMatrix.prototype.rightShiftS;
	  AbstractMatrix.prototype.zeroFillRightShiftM = AbstractMatrix.prototype.rightShiftM;
	  AbstractMatrix.zeroFillRightShift = AbstractMatrix.rightShift;

	  AbstractMatrix.prototype.not = function not() {
	    for (let i = 0; i < this.rows; i++) {
	      for (let j = 0; j < this.columns; j++) {
	        this.set(i, j, ~(this.get(i, j)));
	      }
	    }
	    return this;
	  };

	  AbstractMatrix.not = function not(matrix) {
	    const newMatrix = new Matrix(matrix);
	    return newMatrix.not();
	  };

	  AbstractMatrix.prototype.abs = function abs() {
	    for (let i = 0; i < this.rows; i++) {
	      for (let j = 0; j < this.columns; j++) {
	        this.set(i, j, Math.abs(this.get(i, j)));
	      }
	    }
	    return this;
	  };

	  AbstractMatrix.abs = function abs(matrix) {
	    const newMatrix = new Matrix(matrix);
	    return newMatrix.abs();
	  };

	  AbstractMatrix.prototype.acos = function acos() {
	    for (let i = 0; i < this.rows; i++) {
	      for (let j = 0; j < this.columns; j++) {
	        this.set(i, j, Math.acos(this.get(i, j)));
	      }
	    }
	    return this;
	  };

	  AbstractMatrix.acos = function acos(matrix) {
	    const newMatrix = new Matrix(matrix);
	    return newMatrix.acos();
	  };

	  AbstractMatrix.prototype.acosh = function acosh() {
	    for (let i = 0; i < this.rows; i++) {
	      for (let j = 0; j < this.columns; j++) {
	        this.set(i, j, Math.acosh(this.get(i, j)));
	      }
	    }
	    return this;
	  };

	  AbstractMatrix.acosh = function acosh(matrix) {
	    const newMatrix = new Matrix(matrix);
	    return newMatrix.acosh();
	  };

	  AbstractMatrix.prototype.asin = function asin() {
	    for (let i = 0; i < this.rows; i++) {
	      for (let j = 0; j < this.columns; j++) {
	        this.set(i, j, Math.asin(this.get(i, j)));
	      }
	    }
	    return this;
	  };

	  AbstractMatrix.asin = function asin(matrix) {
	    const newMatrix = new Matrix(matrix);
	    return newMatrix.asin();
	  };

	  AbstractMatrix.prototype.asinh = function asinh() {
	    for (let i = 0; i < this.rows; i++) {
	      for (let j = 0; j < this.columns; j++) {
	        this.set(i, j, Math.asinh(this.get(i, j)));
	      }
	    }
	    return this;
	  };

	  AbstractMatrix.asinh = function asinh(matrix) {
	    const newMatrix = new Matrix(matrix);
	    return newMatrix.asinh();
	  };

	  AbstractMatrix.prototype.atan = function atan() {
	    for (let i = 0; i < this.rows; i++) {
	      for (let j = 0; j < this.columns; j++) {
	        this.set(i, j, Math.atan(this.get(i, j)));
	      }
	    }
	    return this;
	  };

	  AbstractMatrix.atan = function atan(matrix) {
	    const newMatrix = new Matrix(matrix);
	    return newMatrix.atan();
	  };

	  AbstractMatrix.prototype.atanh = function atanh() {
	    for (let i = 0; i < this.rows; i++) {
	      for (let j = 0; j < this.columns; j++) {
	        this.set(i, j, Math.atanh(this.get(i, j)));
	      }
	    }
	    return this;
	  };

	  AbstractMatrix.atanh = function atanh(matrix) {
	    const newMatrix = new Matrix(matrix);
	    return newMatrix.atanh();
	  };

	  AbstractMatrix.prototype.cbrt = function cbrt() {
	    for (let i = 0; i < this.rows; i++) {
	      for (let j = 0; j < this.columns; j++) {
	        this.set(i, j, Math.cbrt(this.get(i, j)));
	      }
	    }
	    return this;
	  };

	  AbstractMatrix.cbrt = function cbrt(matrix) {
	    const newMatrix = new Matrix(matrix);
	    return newMatrix.cbrt();
	  };

	  AbstractMatrix.prototype.ceil = function ceil() {
	    for (let i = 0; i < this.rows; i++) {
	      for (let j = 0; j < this.columns; j++) {
	        this.set(i, j, Math.ceil(this.get(i, j)));
	      }
	    }
	    return this;
	  };

	  AbstractMatrix.ceil = function ceil(matrix) {
	    const newMatrix = new Matrix(matrix);
	    return newMatrix.ceil();
	  };

	  AbstractMatrix.prototype.clz32 = function clz32() {
	    for (let i = 0; i < this.rows; i++) {
	      for (let j = 0; j < this.columns; j++) {
	        this.set(i, j, Math.clz32(this.get(i, j)));
	      }
	    }
	    return this;
	  };

	  AbstractMatrix.clz32 = function clz32(matrix) {
	    const newMatrix = new Matrix(matrix);
	    return newMatrix.clz32();
	  };

	  AbstractMatrix.prototype.cos = function cos() {
	    for (let i = 0; i < this.rows; i++) {
	      for (let j = 0; j < this.columns; j++) {
	        this.set(i, j, Math.cos(this.get(i, j)));
	      }
	    }
	    return this;
	  };

	  AbstractMatrix.cos = function cos(matrix) {
	    const newMatrix = new Matrix(matrix);
	    return newMatrix.cos();
	  };

	  AbstractMatrix.prototype.cosh = function cosh() {
	    for (let i = 0; i < this.rows; i++) {
	      for (let j = 0; j < this.columns; j++) {
	        this.set(i, j, Math.cosh(this.get(i, j)));
	      }
	    }
	    return this;
	  };

	  AbstractMatrix.cosh = function cosh(matrix) {
	    const newMatrix = new Matrix(matrix);
	    return newMatrix.cosh();
	  };

	  AbstractMatrix.prototype.exp = function exp() {
	    for (let i = 0; i < this.rows; i++) {
	      for (let j = 0; j < this.columns; j++) {
	        this.set(i, j, Math.exp(this.get(i, j)));
	      }
	    }
	    return this;
	  };

	  AbstractMatrix.exp = function exp(matrix) {
	    const newMatrix = new Matrix(matrix);
	    return newMatrix.exp();
	  };

	  AbstractMatrix.prototype.expm1 = function expm1() {
	    for (let i = 0; i < this.rows; i++) {
	      for (let j = 0; j < this.columns; j++) {
	        this.set(i, j, Math.expm1(this.get(i, j)));
	      }
	    }
	    return this;
	  };

	  AbstractMatrix.expm1 = function expm1(matrix) {
	    const newMatrix = new Matrix(matrix);
	    return newMatrix.expm1();
	  };

	  AbstractMatrix.prototype.floor = function floor() {
	    for (let i = 0; i < this.rows; i++) {
	      for (let j = 0; j < this.columns; j++) {
	        this.set(i, j, Math.floor(this.get(i, j)));
	      }
	    }
	    return this;
	  };

	  AbstractMatrix.floor = function floor(matrix) {
	    const newMatrix = new Matrix(matrix);
	    return newMatrix.floor();
	  };

	  AbstractMatrix.prototype.fround = function fround() {
	    for (let i = 0; i < this.rows; i++) {
	      for (let j = 0; j < this.columns; j++) {
	        this.set(i, j, Math.fround(this.get(i, j)));
	      }
	    }
	    return this;
	  };

	  AbstractMatrix.fround = function fround(matrix) {
	    const newMatrix = new Matrix(matrix);
	    return newMatrix.fround();
	  };

	  AbstractMatrix.prototype.log = function log() {
	    for (let i = 0; i < this.rows; i++) {
	      for (let j = 0; j < this.columns; j++) {
	        this.set(i, j, Math.log(this.get(i, j)));
	      }
	    }
	    return this;
	  };

	  AbstractMatrix.log = function log(matrix) {
	    const newMatrix = new Matrix(matrix);
	    return newMatrix.log();
	  };

	  AbstractMatrix.prototype.log1p = function log1p() {
	    for (let i = 0; i < this.rows; i++) {
	      for (let j = 0; j < this.columns; j++) {
	        this.set(i, j, Math.log1p(this.get(i, j)));
	      }
	    }
	    return this;
	  };

	  AbstractMatrix.log1p = function log1p(matrix) {
	    const newMatrix = new Matrix(matrix);
	    return newMatrix.log1p();
	  };

	  AbstractMatrix.prototype.log10 = function log10() {
	    for (let i = 0; i < this.rows; i++) {
	      for (let j = 0; j < this.columns; j++) {
	        this.set(i, j, Math.log10(this.get(i, j)));
	      }
	    }
	    return this;
	  };

	  AbstractMatrix.log10 = function log10(matrix) {
	    const newMatrix = new Matrix(matrix);
	    return newMatrix.log10();
	  };

	  AbstractMatrix.prototype.log2 = function log2() {
	    for (let i = 0; i < this.rows; i++) {
	      for (let j = 0; j < this.columns; j++) {
	        this.set(i, j, Math.log2(this.get(i, j)));
	      }
	    }
	    return this;
	  };

	  AbstractMatrix.log2 = function log2(matrix) {
	    const newMatrix = new Matrix(matrix);
	    return newMatrix.log2();
	  };

	  AbstractMatrix.prototype.round = function round() {
	    for (let i = 0; i < this.rows; i++) {
	      for (let j = 0; j < this.columns; j++) {
	        this.set(i, j, Math.round(this.get(i, j)));
	      }
	    }
	    return this;
	  };

	  AbstractMatrix.round = function round(matrix) {
	    const newMatrix = new Matrix(matrix);
	    return newMatrix.round();
	  };

	  AbstractMatrix.prototype.sign = function sign() {
	    for (let i = 0; i < this.rows; i++) {
	      for (let j = 0; j < this.columns; j++) {
	        this.set(i, j, Math.sign(this.get(i, j)));
	      }
	    }
	    return this;
	  };

	  AbstractMatrix.sign = function sign(matrix) {
	    const newMatrix = new Matrix(matrix);
	    return newMatrix.sign();
	  };

	  AbstractMatrix.prototype.sin = function sin() {
	    for (let i = 0; i < this.rows; i++) {
	      for (let j = 0; j < this.columns; j++) {
	        this.set(i, j, Math.sin(this.get(i, j)));
	      }
	    }
	    return this;
	  };

	  AbstractMatrix.sin = function sin(matrix) {
	    const newMatrix = new Matrix(matrix);
	    return newMatrix.sin();
	  };

	  AbstractMatrix.prototype.sinh = function sinh() {
	    for (let i = 0; i < this.rows; i++) {
	      for (let j = 0; j < this.columns; j++) {
	        this.set(i, j, Math.sinh(this.get(i, j)));
	      }
	    }
	    return this;
	  };

	  AbstractMatrix.sinh = function sinh(matrix) {
	    const newMatrix = new Matrix(matrix);
	    return newMatrix.sinh();
	  };

	  AbstractMatrix.prototype.sqrt = function sqrt() {
	    for (let i = 0; i < this.rows; i++) {
	      for (let j = 0; j < this.columns; j++) {
	        this.set(i, j, Math.sqrt(this.get(i, j)));
	      }
	    }
	    return this;
	  };

	  AbstractMatrix.sqrt = function sqrt(matrix) {
	    const newMatrix = new Matrix(matrix);
	    return newMatrix.sqrt();
	  };

	  AbstractMatrix.prototype.tan = function tan() {
	    for (let i = 0; i < this.rows; i++) {
	      for (let j = 0; j < this.columns; j++) {
	        this.set(i, j, Math.tan(this.get(i, j)));
	      }
	    }
	    return this;
	  };

	  AbstractMatrix.tan = function tan(matrix) {
	    const newMatrix = new Matrix(matrix);
	    return newMatrix.tan();
	  };

	  AbstractMatrix.prototype.tanh = function tanh() {
	    for (let i = 0; i < this.rows; i++) {
	      for (let j = 0; j < this.columns; j++) {
	        this.set(i, j, Math.tanh(this.get(i, j)));
	      }
	    }
	    return this;
	  };

	  AbstractMatrix.tanh = function tanh(matrix) {
	    const newMatrix = new Matrix(matrix);
	    return newMatrix.tanh();
	  };

	  AbstractMatrix.prototype.trunc = function trunc() {
	    for (let i = 0; i < this.rows; i++) {
	      for (let j = 0; j < this.columns; j++) {
	        this.set(i, j, Math.trunc(this.get(i, j)));
	      }
	    }
	    return this;
	  };

	  AbstractMatrix.trunc = function trunc(matrix) {
	    const newMatrix = new Matrix(matrix);
	    return newMatrix.trunc();
	  };

	  AbstractMatrix.pow = function pow(matrix, arg0) {
	    const newMatrix = new Matrix(matrix);
	    return newMatrix.pow(arg0);
	  };

	  AbstractMatrix.prototype.pow = function pow(value) {
	    if (typeof value === 'number') return this.powS(value);
	    return this.powM(value);
	  };

	  AbstractMatrix.prototype.powS = function powS(value) {
	    for (let i = 0; i < this.rows; i++) {
	      for (let j = 0; j < this.columns; j++) {
	        this.set(i, j, this.get(i, j) ** value);
	      }
	    }
	    return this;
	  };

	  AbstractMatrix.prototype.powM = function powM(matrix) {
	    matrix = Matrix.checkMatrix(matrix);
	    if (this.rows !== matrix.rows ||
	      this.columns !== matrix.columns) {
	      throw new RangeError('Matrices dimensions must be equal');
	    }
	    for (let i = 0; i < this.rows; i++) {
	      for (let j = 0; j < this.columns; j++) {
	        this.set(i, j, this.get(i, j) ** matrix.get(i, j));
	      }
	    }
	    return this;
	  };
	}

	/**
	 * @private
	 * Check that a row index is not out of bounds
	 * @param {Matrix} matrix
	 * @param {number} index
	 * @param {boolean} [outer]
	 */
	function checkRowIndex(matrix, index, outer) {
	  let max = outer ? matrix.rows : matrix.rows - 1;
	  if (index < 0 || index > max) {
	    throw new RangeError('Row index out of range');
	  }
	}

	/**
	 * @private
	 * Check that a column index is not out of bounds
	 * @param {Matrix} matrix
	 * @param {number} index
	 * @param {boolean} [outer]
	 */
	function checkColumnIndex(matrix, index, outer) {
	  let max = outer ? matrix.columns : matrix.columns - 1;
	  if (index < 0 || index > max) {
	    throw new RangeError('Column index out of range');
	  }
	}

	/**
	 * @private
	 * Check that the provided vector is an array with the right length
	 * @param {Matrix} matrix
	 * @param {Array|Matrix} vector
	 * @return {Array}
	 * @throws {RangeError}
	 */
	function checkRowVector(matrix, vector) {
	  if (vector.to1DArray) {
	    vector = vector.to1DArray();
	  }
	  if (vector.length !== matrix.columns) {
	    throw new RangeError(
	      'vector size must be the same as the number of columns',
	    );
	  }
	  return vector;
	}

	/**
	 * @private
	 * Check that the provided vector is an array with the right length
	 * @param {Matrix} matrix
	 * @param {Array|Matrix} vector
	 * @return {Array}
	 * @throws {RangeError}
	 */
	function checkColumnVector(matrix, vector) {
	  if (vector.to1DArray) {
	    vector = vector.to1DArray();
	  }
	  if (vector.length !== matrix.rows) {
	    throw new RangeError('vector size must be the same as the number of rows');
	  }
	  return vector;
	}

	function checkRowIndices(matrix, rowIndices) {
	  if (!isAnyArray.isAnyArray(rowIndices)) {
	    throw new TypeError('row indices must be an array');
	  }

	  for (let i = 0; i < rowIndices.length; i++) {
	    if (rowIndices[i] < 0 || rowIndices[i] >= matrix.rows) {
	      throw new RangeError('row indices are out of range');
	    }
	  }
	}

	function checkColumnIndices(matrix, columnIndices) {
	  if (!isAnyArray.isAnyArray(columnIndices)) {
	    throw new TypeError('column indices must be an array');
	  }

	  for (let i = 0; i < columnIndices.length; i++) {
	    if (columnIndices[i] < 0 || columnIndices[i] >= matrix.columns) {
	      throw new RangeError('column indices are out of range');
	    }
	  }
	}

	function checkRange(matrix, startRow, endRow, startColumn, endColumn) {
	  if (arguments.length !== 5) {
	    throw new RangeError('expected 4 arguments');
	  }
	  checkNumber('startRow', startRow);
	  checkNumber('endRow', endRow);
	  checkNumber('startColumn', startColumn);
	  checkNumber('endColumn', endColumn);
	  if (
	    startRow > endRow ||
	    startColumn > endColumn ||
	    startRow < 0 ||
	    startRow >= matrix.rows ||
	    endRow < 0 ||
	    endRow >= matrix.rows ||
	    startColumn < 0 ||
	    startColumn >= matrix.columns ||
	    endColumn < 0 ||
	    endColumn >= matrix.columns
	  ) {
	    throw new RangeError('Submatrix indices are out of range');
	  }
	}

	function newArray(length, value = 0) {
	  let array = [];
	  for (let i = 0; i < length; i++) {
	    array.push(value);
	  }
	  return array;
	}

	function checkNumber(name, value) {
	  if (typeof value !== 'number') {
	    throw new TypeError(`${name} must be a number`);
	  }
	}

	function checkNonEmpty(matrix) {
	  if (matrix.isEmpty()) {
	    throw new Error('Empty matrix has no elements to index');
	  }
	}

	function sumByRow(matrix) {
	  let sum = newArray(matrix.rows);
	  for (let i = 0; i < matrix.rows; ++i) {
	    for (let j = 0; j < matrix.columns; ++j) {
	      sum[i] += matrix.get(i, j);
	    }
	  }
	  return sum;
	}

	function sumByColumn(matrix) {
	  let sum = newArray(matrix.columns);
	  for (let i = 0; i < matrix.rows; ++i) {
	    for (let j = 0; j < matrix.columns; ++j) {
	      sum[j] += matrix.get(i, j);
	    }
	  }
	  return sum;
	}

	function sumAll(matrix) {
	  let v = 0;
	  for (let i = 0; i < matrix.rows; i++) {
	    for (let j = 0; j < matrix.columns; j++) {
	      v += matrix.get(i, j);
	    }
	  }
	  return v;
	}

	function productByRow(matrix) {
	  let sum = newArray(matrix.rows, 1);
	  for (let i = 0; i < matrix.rows; ++i) {
	    for (let j = 0; j < matrix.columns; ++j) {
	      sum[i] *= matrix.get(i, j);
	    }
	  }
	  return sum;
	}

	function productByColumn(matrix) {
	  let sum = newArray(matrix.columns, 1);
	  for (let i = 0; i < matrix.rows; ++i) {
	    for (let j = 0; j < matrix.columns; ++j) {
	      sum[j] *= matrix.get(i, j);
	    }
	  }
	  return sum;
	}

	function productAll(matrix) {
	  let v = 1;
	  for (let i = 0; i < matrix.rows; i++) {
	    for (let j = 0; j < matrix.columns; j++) {
	      v *= matrix.get(i, j);
	    }
	  }
	  return v;
	}

	function varianceByRow(matrix, unbiased, mean) {
	  const rows = matrix.rows;
	  const cols = matrix.columns;
	  const variance = [];

	  for (let i = 0; i < rows; i++) {
	    let sum1 = 0;
	    let sum2 = 0;
	    let x = 0;
	    for (let j = 0; j < cols; j++) {
	      x = matrix.get(i, j) - mean[i];
	      sum1 += x;
	      sum2 += x * x;
	    }
	    if (unbiased) {
	      variance.push((sum2 - (sum1 * sum1) / cols) / (cols - 1));
	    } else {
	      variance.push((sum2 - (sum1 * sum1) / cols) / cols);
	    }
	  }
	  return variance;
	}

	function varianceByColumn(matrix, unbiased, mean) {
	  const rows = matrix.rows;
	  const cols = matrix.columns;
	  const variance = [];

	  for (let j = 0; j < cols; j++) {
	    let sum1 = 0;
	    let sum2 = 0;
	    let x = 0;
	    for (let i = 0; i < rows; i++) {
	      x = matrix.get(i, j) - mean[j];
	      sum1 += x;
	      sum2 += x * x;
	    }
	    if (unbiased) {
	      variance.push((sum2 - (sum1 * sum1) / rows) / (rows - 1));
	    } else {
	      variance.push((sum2 - (sum1 * sum1) / rows) / rows);
	    }
	  }
	  return variance;
	}

	function varianceAll(matrix, unbiased, mean) {
	  const rows = matrix.rows;
	  const cols = matrix.columns;
	  const size = rows * cols;

	  let sum1 = 0;
	  let sum2 = 0;
	  let x = 0;
	  for (let i = 0; i < rows; i++) {
	    for (let j = 0; j < cols; j++) {
	      x = matrix.get(i, j) - mean;
	      sum1 += x;
	      sum2 += x * x;
	    }
	  }
	  if (unbiased) {
	    return (sum2 - (sum1 * sum1) / size) / (size - 1);
	  } else {
	    return (sum2 - (sum1 * sum1) / size) / size;
	  }
	}

	function centerByRow(matrix, mean) {
	  for (let i = 0; i < matrix.rows; i++) {
	    for (let j = 0; j < matrix.columns; j++) {
	      matrix.set(i, j, matrix.get(i, j) - mean[i]);
	    }
	  }
	}

	function centerByColumn(matrix, mean) {
	  for (let i = 0; i < matrix.rows; i++) {
	    for (let j = 0; j < matrix.columns; j++) {
	      matrix.set(i, j, matrix.get(i, j) - mean[j]);
	    }
	  }
	}

	function centerAll(matrix, mean) {
	  for (let i = 0; i < matrix.rows; i++) {
	    for (let j = 0; j < matrix.columns; j++) {
	      matrix.set(i, j, matrix.get(i, j) - mean);
	    }
	  }
	}

	function getScaleByRow(matrix) {
	  const scale = [];
	  for (let i = 0; i < matrix.rows; i++) {
	    let sum = 0;
	    for (let j = 0; j < matrix.columns; j++) {
	      sum += matrix.get(i, j) ** 2 / (matrix.columns - 1);
	    }
	    scale.push(Math.sqrt(sum));
	  }
	  return scale;
	}

	function scaleByRow(matrix, scale) {
	  for (let i = 0; i < matrix.rows; i++) {
	    for (let j = 0; j < matrix.columns; j++) {
	      matrix.set(i, j, matrix.get(i, j) / scale[i]);
	    }
	  }
	}

	function getScaleByColumn(matrix) {
	  const scale = [];
	  for (let j = 0; j < matrix.columns; j++) {
	    let sum = 0;
	    for (let i = 0; i < matrix.rows; i++) {
	      sum += matrix.get(i, j) ** 2 / (matrix.rows - 1);
	    }
	    scale.push(Math.sqrt(sum));
	  }
	  return scale;
	}

	function scaleByColumn(matrix, scale) {
	  for (let i = 0; i < matrix.rows; i++) {
	    for (let j = 0; j < matrix.columns; j++) {
	      matrix.set(i, j, matrix.get(i, j) / scale[j]);
	    }
	  }
	}

	function getScaleAll(matrix) {
	  const divider = matrix.size - 1;
	  let sum = 0;
	  for (let j = 0; j < matrix.columns; j++) {
	    for (let i = 0; i < matrix.rows; i++) {
	      sum += matrix.get(i, j) ** 2 / divider;
	    }
	  }
	  return Math.sqrt(sum);
	}

	function scaleAll(matrix, scale) {
	  for (let i = 0; i < matrix.rows; i++) {
	    for (let j = 0; j < matrix.columns; j++) {
	      matrix.set(i, j, matrix.get(i, j) / scale);
	    }
	  }
	}

	class AbstractMatrix {
	  static from1DArray(newRows, newColumns, newData) {
	    let length = newRows * newColumns;
	    if (length !== newData.length) {
	      throw new RangeError('data length does not match given dimensions');
	    }
	    let newMatrix = new Matrix$1(newRows, newColumns);
	    for (let row = 0; row < newRows; row++) {
	      for (let column = 0; column < newColumns; column++) {
	        newMatrix.set(row, column, newData[row * newColumns + column]);
	      }
	    }
	    return newMatrix;
	  }

	  static rowVector(newData) {
	    let vector = new Matrix$1(1, newData.length);
	    for (let i = 0; i < newData.length; i++) {
	      vector.set(0, i, newData[i]);
	    }
	    return vector;
	  }

	  static columnVector(newData) {
	    let vector = new Matrix$1(newData.length, 1);
	    for (let i = 0; i < newData.length; i++) {
	      vector.set(i, 0, newData[i]);
	    }
	    return vector;
	  }

	  static zeros(rows, columns) {
	    return new Matrix$1(rows, columns);
	  }

	  static ones(rows, columns) {
	    return new Matrix$1(rows, columns).fill(1);
	  }

	  static rand(rows, columns, options = {}) {
	    if (typeof options !== 'object') {
	      throw new TypeError('options must be an object');
	    }
	    const { random = Math.random } = options;
	    let matrix = new Matrix$1(rows, columns);
	    for (let i = 0; i < rows; i++) {
	      for (let j = 0; j < columns; j++) {
	        matrix.set(i, j, random());
	      }
	    }
	    return matrix;
	  }

	  static randInt(rows, columns, options = {}) {
	    if (typeof options !== 'object') {
	      throw new TypeError('options must be an object');
	    }
	    const { min = 0, max = 1000, random = Math.random } = options;
	    if (!Number.isInteger(min)) throw new TypeError('min must be an integer');
	    if (!Number.isInteger(max)) throw new TypeError('max must be an integer');
	    if (min >= max) throw new RangeError('min must be smaller than max');
	    let interval = max - min;
	    let matrix = new Matrix$1(rows, columns);
	    for (let i = 0; i < rows; i++) {
	      for (let j = 0; j < columns; j++) {
	        let value = min + Math.round(random() * interval);
	        matrix.set(i, j, value);
	      }
	    }
	    return matrix;
	  }

	  static eye(rows, columns, value) {
	    if (columns === undefined) columns = rows;
	    if (value === undefined) value = 1;
	    let min = Math.min(rows, columns);
	    let matrix = this.zeros(rows, columns);
	    for (let i = 0; i < min; i++) {
	      matrix.set(i, i, value);
	    }
	    return matrix;
	  }

	  static diag(data, rows, columns) {
	    let l = data.length;
	    if (rows === undefined) rows = l;
	    if (columns === undefined) columns = rows;
	    let min = Math.min(l, rows, columns);
	    let matrix = this.zeros(rows, columns);
	    for (let i = 0; i < min; i++) {
	      matrix.set(i, i, data[i]);
	    }
	    return matrix;
	  }

	  static min(matrix1, matrix2) {
	    matrix1 = this.checkMatrix(matrix1);
	    matrix2 = this.checkMatrix(matrix2);
	    let rows = matrix1.rows;
	    let columns = matrix1.columns;
	    let result = new Matrix$1(rows, columns);
	    for (let i = 0; i < rows; i++) {
	      for (let j = 0; j < columns; j++) {
	        result.set(i, j, Math.min(matrix1.get(i, j), matrix2.get(i, j)));
	      }
	    }
	    return result;
	  }

	  static max(matrix1, matrix2) {
	    matrix1 = this.checkMatrix(matrix1);
	    matrix2 = this.checkMatrix(matrix2);
	    let rows = matrix1.rows;
	    let columns = matrix1.columns;
	    let result = new this(rows, columns);
	    for (let i = 0; i < rows; i++) {
	      for (let j = 0; j < columns; j++) {
	        result.set(i, j, Math.max(matrix1.get(i, j), matrix2.get(i, j)));
	      }
	    }
	    return result;
	  }

	  static checkMatrix(value) {
	    return AbstractMatrix.isMatrix(value) ? value : new Matrix$1(value);
	  }

	  static isMatrix(value) {
	    return value != null && value.klass === 'Matrix';
	  }

	  get size() {
	    return this.rows * this.columns;
	  }

	  apply(callback) {
	    if (typeof callback !== 'function') {
	      throw new TypeError('callback must be a function');
	    }
	    for (let i = 0; i < this.rows; i++) {
	      for (let j = 0; j < this.columns; j++) {
	        callback.call(this, i, j);
	      }
	    }
	    return this;
	  }

	  to1DArray() {
	    let array = [];
	    for (let i = 0; i < this.rows; i++) {
	      for (let j = 0; j < this.columns; j++) {
	        array.push(this.get(i, j));
	      }
	    }
	    return array;
	  }

	  to2DArray() {
	    let copy = [];
	    for (let i = 0; i < this.rows; i++) {
	      copy.push([]);
	      for (let j = 0; j < this.columns; j++) {
	        copy[i].push(this.get(i, j));
	      }
	    }
	    return copy;
	  }

	  toJSON() {
	    return this.to2DArray();
	  }

	  isRowVector() {
	    return this.rows === 1;
	  }

	  isColumnVector() {
	    return this.columns === 1;
	  }

	  isVector() {
	    return this.rows === 1 || this.columns === 1;
	  }

	  isSquare() {
	    return this.rows === this.columns;
	  }

	  isEmpty() {
	    return this.rows === 0 || this.columns === 0;
	  }

	  isSymmetric() {
	    if (this.isSquare()) {
	      for (let i = 0; i < this.rows; i++) {
	        for (let j = 0; j <= i; j++) {
	          if (this.get(i, j) !== this.get(j, i)) {
	            return false;
	          }
	        }
	      }
	      return true;
	    }
	    return false;
	  }

	  isDistance() {
	    if (!this.isSymmetric()) return false;

	    for (let i = 0; i < this.rows; i++) {
	      if (this.get(i, i) !== 0) return false;
	    }

	    return true;
	  }

	  isEchelonForm() {
	    let i = 0;
	    let j = 0;
	    let previousColumn = -1;
	    let isEchelonForm = true;
	    let checked = false;
	    while (i < this.rows && isEchelonForm) {
	      j = 0;
	      checked = false;
	      while (j < this.columns && checked === false) {
	        if (this.get(i, j) === 0) {
	          j++;
	        } else if (this.get(i, j) === 1 && j > previousColumn) {
	          checked = true;
	          previousColumn = j;
	        } else {
	          isEchelonForm = false;
	          checked = true;
	        }
	      }
	      i++;
	    }
	    return isEchelonForm;
	  }

	  isReducedEchelonForm() {
	    let i = 0;
	    let j = 0;
	    let previousColumn = -1;
	    let isReducedEchelonForm = true;
	    let checked = false;
	    while (i < this.rows && isReducedEchelonForm) {
	      j = 0;
	      checked = false;
	      while (j < this.columns && checked === false) {
	        if (this.get(i, j) === 0) {
	          j++;
	        } else if (this.get(i, j) === 1 && j > previousColumn) {
	          checked = true;
	          previousColumn = j;
	        } else {
	          isReducedEchelonForm = false;
	          checked = true;
	        }
	      }
	      for (let k = j + 1; k < this.rows; k++) {
	        if (this.get(i, k) !== 0) {
	          isReducedEchelonForm = false;
	        }
	      }
	      i++;
	    }
	    return isReducedEchelonForm;
	  }

	  echelonForm() {
	    let result = this.clone();
	    let h = 0;
	    let k = 0;
	    while (h < result.rows && k < result.columns) {
	      let iMax = h;
	      for (let i = h; i < result.rows; i++) {
	        if (result.get(i, k) > result.get(iMax, k)) {
	          iMax = i;
	        }
	      }
	      if (result.get(iMax, k) === 0) {
	        k++;
	      } else {
	        result.swapRows(h, iMax);
	        let tmp = result.get(h, k);
	        for (let j = k; j < result.columns; j++) {
	          result.set(h, j, result.get(h, j) / tmp);
	        }
	        for (let i = h + 1; i < result.rows; i++) {
	          let factor = result.get(i, k) / result.get(h, k);
	          result.set(i, k, 0);
	          for (let j = k + 1; j < result.columns; j++) {
	            result.set(i, j, result.get(i, j) - result.get(h, j) * factor);
	          }
	        }
	        h++;
	        k++;
	      }
	    }
	    return result;
	  }

	  reducedEchelonForm() {
	    let result = this.echelonForm();
	    let m = result.columns;
	    let n = result.rows;
	    let h = n - 1;
	    while (h >= 0) {
	      if (result.maxRow(h) === 0) {
	        h--;
	      } else {
	        let p = 0;
	        let pivot = false;
	        while (p < n && pivot === false) {
	          if (result.get(h, p) === 1) {
	            pivot = true;
	          } else {
	            p++;
	          }
	        }
	        for (let i = 0; i < h; i++) {
	          let factor = result.get(i, p);
	          for (let j = p; j < m; j++) {
	            let tmp = result.get(i, j) - factor * result.get(h, j);
	            result.set(i, j, tmp);
	          }
	        }
	        h--;
	      }
	    }
	    return result;
	  }

	  set() {
	    throw new Error('set method is unimplemented');
	  }

	  get() {
	    throw new Error('get method is unimplemented');
	  }

	  repeat(options = {}) {
	    if (typeof options !== 'object') {
	      throw new TypeError('options must be an object');
	    }
	    const { rows = 1, columns = 1 } = options;
	    if (!Number.isInteger(rows) || rows <= 0) {
	      throw new TypeError('rows must be a positive integer');
	    }
	    if (!Number.isInteger(columns) || columns <= 0) {
	      throw new TypeError('columns must be a positive integer');
	    }
	    let matrix = new Matrix$1(this.rows * rows, this.columns * columns);
	    for (let i = 0; i < rows; i++) {
	      for (let j = 0; j < columns; j++) {
	        matrix.setSubMatrix(this, this.rows * i, this.columns * j);
	      }
	    }
	    return matrix;
	  }

	  fill(value) {
	    for (let i = 0; i < this.rows; i++) {
	      for (let j = 0; j < this.columns; j++) {
	        this.set(i, j, value);
	      }
	    }
	    return this;
	  }

	  neg() {
	    return this.mulS(-1);
	  }

	  getRow(index) {
	    checkRowIndex(this, index);
	    let row = [];
	    for (let i = 0; i < this.columns; i++) {
	      row.push(this.get(index, i));
	    }
	    return row;
	  }

	  getRowVector(index) {
	    return Matrix$1.rowVector(this.getRow(index));
	  }

	  setRow(index, array) {
	    checkRowIndex(this, index);
	    array = checkRowVector(this, array);
	    for (let i = 0; i < this.columns; i++) {
	      this.set(index, i, array[i]);
	    }
	    return this;
	  }

	  swapRows(row1, row2) {
	    checkRowIndex(this, row1);
	    checkRowIndex(this, row2);
	    for (let i = 0; i < this.columns; i++) {
	      let temp = this.get(row1, i);
	      this.set(row1, i, this.get(row2, i));
	      this.set(row2, i, temp);
	    }
	    return this;
	  }

	  getColumn(index) {
	    checkColumnIndex(this, index);
	    let column = [];
	    for (let i = 0; i < this.rows; i++) {
	      column.push(this.get(i, index));
	    }
	    return column;
	  }

	  getColumnVector(index) {
	    return Matrix$1.columnVector(this.getColumn(index));
	  }

	  setColumn(index, array) {
	    checkColumnIndex(this, index);
	    array = checkColumnVector(this, array);
	    for (let i = 0; i < this.rows; i++) {
	      this.set(i, index, array[i]);
	    }
	    return this;
	  }

	  swapColumns(column1, column2) {
	    checkColumnIndex(this, column1);
	    checkColumnIndex(this, column2);
	    for (let i = 0; i < this.rows; i++) {
	      let temp = this.get(i, column1);
	      this.set(i, column1, this.get(i, column2));
	      this.set(i, column2, temp);
	    }
	    return this;
	  }

	  addRowVector(vector) {
	    vector = checkRowVector(this, vector);
	    for (let i = 0; i < this.rows; i++) {
	      for (let j = 0; j < this.columns; j++) {
	        this.set(i, j, this.get(i, j) + vector[j]);
	      }
	    }
	    return this;
	  }

	  subRowVector(vector) {
	    vector = checkRowVector(this, vector);
	    for (let i = 0; i < this.rows; i++) {
	      for (let j = 0; j < this.columns; j++) {
	        this.set(i, j, this.get(i, j) - vector[j]);
	      }
	    }
	    return this;
	  }

	  mulRowVector(vector) {
	    vector = checkRowVector(this, vector);
	    for (let i = 0; i < this.rows; i++) {
	      for (let j = 0; j < this.columns; j++) {
	        this.set(i, j, this.get(i, j) * vector[j]);
	      }
	    }
	    return this;
	  }

	  divRowVector(vector) {
	    vector = checkRowVector(this, vector);
	    for (let i = 0; i < this.rows; i++) {
	      for (let j = 0; j < this.columns; j++) {
	        this.set(i, j, this.get(i, j) / vector[j]);
	      }
	    }
	    return this;
	  }

	  addColumnVector(vector) {
	    vector = checkColumnVector(this, vector);
	    for (let i = 0; i < this.rows; i++) {
	      for (let j = 0; j < this.columns; j++) {
	        this.set(i, j, this.get(i, j) + vector[i]);
	      }
	    }
	    return this;
	  }

	  subColumnVector(vector) {
	    vector = checkColumnVector(this, vector);
	    for (let i = 0; i < this.rows; i++) {
	      for (let j = 0; j < this.columns; j++) {
	        this.set(i, j, this.get(i, j) - vector[i]);
	      }
	    }
	    return this;
	  }

	  mulColumnVector(vector) {
	    vector = checkColumnVector(this, vector);
	    for (let i = 0; i < this.rows; i++) {
	      for (let j = 0; j < this.columns; j++) {
	        this.set(i, j, this.get(i, j) * vector[i]);
	      }
	    }
	    return this;
	  }

	  divColumnVector(vector) {
	    vector = checkColumnVector(this, vector);
	    for (let i = 0; i < this.rows; i++) {
	      for (let j = 0; j < this.columns; j++) {
	        this.set(i, j, this.get(i, j) / vector[i]);
	      }
	    }
	    return this;
	  }

	  mulRow(index, value) {
	    checkRowIndex(this, index);
	    for (let i = 0; i < this.columns; i++) {
	      this.set(index, i, this.get(index, i) * value);
	    }
	    return this;
	  }

	  mulColumn(index, value) {
	    checkColumnIndex(this, index);
	    for (let i = 0; i < this.rows; i++) {
	      this.set(i, index, this.get(i, index) * value);
	    }
	    return this;
	  }

	  max(by) {
	    if (this.isEmpty()) {
	      return NaN;
	    }
	    switch (by) {
	      case 'row': {
	        const max = new Array(this.rows).fill(Number.NEGATIVE_INFINITY);
	        for (let row = 0; row < this.rows; row++) {
	          for (let column = 0; column < this.columns; column++) {
	            if (this.get(row, column) > max[row]) {
	              max[row] = this.get(row, column);
	            }
	          }
	        }
	        return max;
	      }
	      case 'column': {
	        const max = new Array(this.columns).fill(Number.NEGATIVE_INFINITY);
	        for (let row = 0; row < this.rows; row++) {
	          for (let column = 0; column < this.columns; column++) {
	            if (this.get(row, column) > max[column]) {
	              max[column] = this.get(row, column);
	            }
	          }
	        }
	        return max;
	      }
	      case undefined: {
	        let max = this.get(0, 0);
	        for (let row = 0; row < this.rows; row++) {
	          for (let column = 0; column < this.columns; column++) {
	            if (this.get(row, column) > max) {
	              max = this.get(row, column);
	            }
	          }
	        }
	        return max;
	      }
	      default:
	        throw new Error(`invalid option: ${by}`);
	    }
	  }

	  maxIndex() {
	    checkNonEmpty(this);
	    let v = this.get(0, 0);
	    let idx = [0, 0];
	    for (let i = 0; i < this.rows; i++) {
	      for (let j = 0; j < this.columns; j++) {
	        if (this.get(i, j) > v) {
	          v = this.get(i, j);
	          idx[0] = i;
	          idx[1] = j;
	        }
	      }
	    }
	    return idx;
	  }

	  min(by) {
	    if (this.isEmpty()) {
	      return NaN;
	    }

	    switch (by) {
	      case 'row': {
	        const min = new Array(this.rows).fill(Number.POSITIVE_INFINITY);
	        for (let row = 0; row < this.rows; row++) {
	          for (let column = 0; column < this.columns; column++) {
	            if (this.get(row, column) < min[row]) {
	              min[row] = this.get(row, column);
	            }
	          }
	        }
	        return min;
	      }
	      case 'column': {
	        const min = new Array(this.columns).fill(Number.POSITIVE_INFINITY);
	        for (let row = 0; row < this.rows; row++) {
	          for (let column = 0; column < this.columns; column++) {
	            if (this.get(row, column) < min[column]) {
	              min[column] = this.get(row, column);
	            }
	          }
	        }
	        return min;
	      }
	      case undefined: {
	        let min = this.get(0, 0);
	        for (let row = 0; row < this.rows; row++) {
	          for (let column = 0; column < this.columns; column++) {
	            if (this.get(row, column) < min) {
	              min = this.get(row, column);
	            }
	          }
	        }
	        return min;
	      }
	      default:
	        throw new Error(`invalid option: ${by}`);
	    }
	  }

	  minIndex() {
	    checkNonEmpty(this);
	    let v = this.get(0, 0);
	    let idx = [0, 0];
	    for (let i = 0; i < this.rows; i++) {
	      for (let j = 0; j < this.columns; j++) {
	        if (this.get(i, j) < v) {
	          v = this.get(i, j);
	          idx[0] = i;
	          idx[1] = j;
	        }
	      }
	    }
	    return idx;
	  }

	  maxRow(row) {
	    checkRowIndex(this, row);
	    if (this.isEmpty()) {
	      return NaN;
	    }
	    let v = this.get(row, 0);
	    for (let i = 1; i < this.columns; i++) {
	      if (this.get(row, i) > v) {
	        v = this.get(row, i);
	      }
	    }
	    return v;
	  }

	  maxRowIndex(row) {
	    checkRowIndex(this, row);
	    checkNonEmpty(this);
	    let v = this.get(row, 0);
	    let idx = [row, 0];
	    for (let i = 1; i < this.columns; i++) {
	      if (this.get(row, i) > v) {
	        v = this.get(row, i);
	        idx[1] = i;
	      }
	    }
	    return idx;
	  }

	  minRow(row) {
	    checkRowIndex(this, row);
	    if (this.isEmpty()) {
	      return NaN;
	    }
	    let v = this.get(row, 0);
	    for (let i = 1; i < this.columns; i++) {
	      if (this.get(row, i) < v) {
	        v = this.get(row, i);
	      }
	    }
	    return v;
	  }

	  minRowIndex(row) {
	    checkRowIndex(this, row);
	    checkNonEmpty(this);
	    let v = this.get(row, 0);
	    let idx = [row, 0];
	    for (let i = 1; i < this.columns; i++) {
	      if (this.get(row, i) < v) {
	        v = this.get(row, i);
	        idx[1] = i;
	      }
	    }
	    return idx;
	  }

	  maxColumn(column) {
	    checkColumnIndex(this, column);
	    if (this.isEmpty()) {
	      return NaN;
	    }
	    let v = this.get(0, column);
	    for (let i = 1; i < this.rows; i++) {
	      if (this.get(i, column) > v) {
	        v = this.get(i, column);
	      }
	    }
	    return v;
	  }

	  maxColumnIndex(column) {
	    checkColumnIndex(this, column);
	    checkNonEmpty(this);
	    let v = this.get(0, column);
	    let idx = [0, column];
	    for (let i = 1; i < this.rows; i++) {
	      if (this.get(i, column) > v) {
	        v = this.get(i, column);
	        idx[0] = i;
	      }
	    }
	    return idx;
	  }

	  minColumn(column) {
	    checkColumnIndex(this, column);
	    if (this.isEmpty()) {
	      return NaN;
	    }
	    let v = this.get(0, column);
	    for (let i = 1; i < this.rows; i++) {
	      if (this.get(i, column) < v) {
	        v = this.get(i, column);
	      }
	    }
	    return v;
	  }

	  minColumnIndex(column) {
	    checkColumnIndex(this, column);
	    checkNonEmpty(this);
	    let v = this.get(0, column);
	    let idx = [0, column];
	    for (let i = 1; i < this.rows; i++) {
	      if (this.get(i, column) < v) {
	        v = this.get(i, column);
	        idx[0] = i;
	      }
	    }
	    return idx;
	  }

	  diag() {
	    let min = Math.min(this.rows, this.columns);
	    let diag = [];
	    for (let i = 0; i < min; i++) {
	      diag.push(this.get(i, i));
	    }
	    return diag;
	  }

	  norm(type = 'frobenius') {
	    switch (type) {
	      case 'max':
	        return this.max();
	      case 'frobenius':
	        return Math.sqrt(this.dot(this));
	      default:
	        throw new RangeError(`unknown norm type: ${type}`);
	    }
	  }

	  cumulativeSum() {
	    let sum = 0;
	    for (let i = 0; i < this.rows; i++) {
	      for (let j = 0; j < this.columns; j++) {
	        sum += this.get(i, j);
	        this.set(i, j, sum);
	      }
	    }
	    return this;
	  }

	  dot(vector2) {
	    if (AbstractMatrix.isMatrix(vector2)) vector2 = vector2.to1DArray();
	    let vector1 = this.to1DArray();
	    if (vector1.length !== vector2.length) {
	      throw new RangeError('vectors do not have the same size');
	    }
	    let dot = 0;
	    for (let i = 0; i < vector1.length; i++) {
	      dot += vector1[i] * vector2[i];
	    }
	    return dot;
	  }

	  mmul(other) {
	    other = Matrix$1.checkMatrix(other);

	    let m = this.rows;
	    let n = this.columns;
	    let p = other.columns;

	    let result = new Matrix$1(m, p);

	    let Bcolj = new Float64Array(n);
	    for (let j = 0; j < p; j++) {
	      for (let k = 0; k < n; k++) {
	        Bcolj[k] = other.get(k, j);
	      }

	      for (let i = 0; i < m; i++) {
	        let s = 0;
	        for (let k = 0; k < n; k++) {
	          s += this.get(i, k) * Bcolj[k];
	        }

	        result.set(i, j, s);
	      }
	    }
	    return result;
	  }

	  mpow(scalar) {
	    if (!this.isSquare()) {
	      throw new RangeError('Matrix must be square');
	    }
	    if (!Number.isInteger(scalar) || scalar < 0) {
	      throw new RangeError('Exponent must be a non-negative integer');
	    }
	    // Russian Peasant exponentiation, i.e. exponentiation by squaring
	    let result = Matrix$1.eye(this.rows);
	    let bb = this;
	    // Note: Don't bit shift. In JS, that would truncate at 32 bits
	    for (let e = scalar; e > 1; e /= 2) {
	      if ((e & 1) !== 0) {
	        result = result.mmul(bb);
	      }
	      bb = bb.mmul(bb);
	    }
	    return result;
	  }

	  strassen2x2(other) {
	    other = Matrix$1.checkMatrix(other);
	    let result = new Matrix$1(2, 2);
	    const a11 = this.get(0, 0);
	    const b11 = other.get(0, 0);
	    const a12 = this.get(0, 1);
	    const b12 = other.get(0, 1);
	    const a21 = this.get(1, 0);
	    const b21 = other.get(1, 0);
	    const a22 = this.get(1, 1);
	    const b22 = other.get(1, 1);

	    // Compute intermediate values.
	    const m1 = (a11 + a22) * (b11 + b22);
	    const m2 = (a21 + a22) * b11;
	    const m3 = a11 * (b12 - b22);
	    const m4 = a22 * (b21 - b11);
	    const m5 = (a11 + a12) * b22;
	    const m6 = (a21 - a11) * (b11 + b12);
	    const m7 = (a12 - a22) * (b21 + b22);

	    // Combine intermediate values into the output.
	    const c00 = m1 + m4 - m5 + m7;
	    const c01 = m3 + m5;
	    const c10 = m2 + m4;
	    const c11 = m1 - m2 + m3 + m6;

	    result.set(0, 0, c00);
	    result.set(0, 1, c01);
	    result.set(1, 0, c10);
	    result.set(1, 1, c11);
	    return result;
	  }

	  strassen3x3(other) {
	    other = Matrix$1.checkMatrix(other);
	    let result = new Matrix$1(3, 3);

	    const a00 = this.get(0, 0);
	    const a01 = this.get(0, 1);
	    const a02 = this.get(0, 2);
	    const a10 = this.get(1, 0);
	    const a11 = this.get(1, 1);
	    const a12 = this.get(1, 2);
	    const a20 = this.get(2, 0);
	    const a21 = this.get(2, 1);
	    const a22 = this.get(2, 2);

	    const b00 = other.get(0, 0);
	    const b01 = other.get(0, 1);
	    const b02 = other.get(0, 2);
	    const b10 = other.get(1, 0);
	    const b11 = other.get(1, 1);
	    const b12 = other.get(1, 2);
	    const b20 = other.get(2, 0);
	    const b21 = other.get(2, 1);
	    const b22 = other.get(2, 2);

	    const m1 = (a00 + a01 + a02 - a10 - a11 - a21 - a22) * b11;
	    const m2 = (a00 - a10) * (-b01 + b11);
	    const m3 = a11 * (-b00 + b01 + b10 - b11 - b12 - b20 + b22);
	    const m4 = (-a00 + a10 + a11) * (b00 - b01 + b11);
	    const m5 = (a10 + a11) * (-b00 + b01);
	    const m6 = a00 * b00;
	    const m7 = (-a00 + a20 + a21) * (b00 - b02 + b12);
	    const m8 = (-a00 + a20) * (b02 - b12);
	    const m9 = (a20 + a21) * (-b00 + b02);
	    const m10 = (a00 + a01 + a02 - a11 - a12 - a20 - a21) * b12;
	    const m11 = a21 * (-b00 + b02 + b10 - b11 - b12 - b20 + b21);
	    const m12 = (-a02 + a21 + a22) * (b11 + b20 - b21);
	    const m13 = (a02 - a22) * (b11 - b21);
	    const m14 = a02 * b20;
	    const m15 = (a21 + a22) * (-b20 + b21);
	    const m16 = (-a02 + a11 + a12) * (b12 + b20 - b22);
	    const m17 = (a02 - a12) * (b12 - b22);
	    const m18 = (a11 + a12) * (-b20 + b22);
	    const m19 = a01 * b10;
	    const m20 = a12 * b21;
	    const m21 = a10 * b02;
	    const m22 = a20 * b01;
	    const m23 = a22 * b22;

	    const c00 = m6 + m14 + m19;
	    const c01 = m1 + m4 + m5 + m6 + m12 + m14 + m15;
	    const c02 = m6 + m7 + m9 + m10 + m14 + m16 + m18;
	    const c10 = m2 + m3 + m4 + m6 + m14 + m16 + m17;
	    const c11 = m2 + m4 + m5 + m6 + m20;
	    const c12 = m14 + m16 + m17 + m18 + m21;
	    const c20 = m6 + m7 + m8 + m11 + m12 + m13 + m14;
	    const c21 = m12 + m13 + m14 + m15 + m22;
	    const c22 = m6 + m7 + m8 + m9 + m23;

	    result.set(0, 0, c00);
	    result.set(0, 1, c01);
	    result.set(0, 2, c02);
	    result.set(1, 0, c10);
	    result.set(1, 1, c11);
	    result.set(1, 2, c12);
	    result.set(2, 0, c20);
	    result.set(2, 1, c21);
	    result.set(2, 2, c22);
	    return result;
	  }

	  mmulStrassen(y) {
	    y = Matrix$1.checkMatrix(y);
	    let x = this.clone();
	    let r1 = x.rows;
	    let c1 = x.columns;
	    let r2 = y.rows;
	    let c2 = y.columns;
	    if (c1 !== r2) {
	      // eslint-disable-next-line no-console
	      console.warn(
	        `Multiplying ${r1} x ${c1} and ${r2} x ${c2} matrix: dimensions do not match.`,
	      );
	    }

	    // Put a matrix into the top left of a matrix of zeros.
	    // `rows` and `cols` are the dimensions of the output matrix.
	    function embed(mat, rows, cols) {
	      let r = mat.rows;
	      let c = mat.columns;
	      if (r === rows && c === cols) {
	        return mat;
	      } else {
	        let resultat = AbstractMatrix.zeros(rows, cols);
	        resultat = resultat.setSubMatrix(mat, 0, 0);
	        return resultat;
	      }
	    }

	    // Make sure both matrices are the same size.
	    // This is exclusively for simplicity:
	    // this algorithm can be implemented with matrices of different sizes.

	    let r = Math.max(r1, r2);
	    let c = Math.max(c1, c2);
	    x = embed(x, r, c);
	    y = embed(y, r, c);

	    // Our recursive multiplication function.
	    function blockMult(a, b, rows, cols) {
	      // For small matrices, resort to naive multiplication.
	      if (rows <= 512 || cols <= 512) {
	        return a.mmul(b); // a is equivalent to this
	      }

	      // Apply dynamic padding.
	      if (rows % 2 === 1 && cols % 2 === 1) {
	        a = embed(a, rows + 1, cols + 1);
	        b = embed(b, rows + 1, cols + 1);
	      } else if (rows % 2 === 1) {
	        a = embed(a, rows + 1, cols);
	        b = embed(b, rows + 1, cols);
	      } else if (cols % 2 === 1) {
	        a = embed(a, rows, cols + 1);
	        b = embed(b, rows, cols + 1);
	      }

	      let halfRows = parseInt(a.rows / 2, 10);
	      let halfCols = parseInt(a.columns / 2, 10);
	      // Subdivide input matrices.
	      let a11 = a.subMatrix(0, halfRows - 1, 0, halfCols - 1);
	      let b11 = b.subMatrix(0, halfRows - 1, 0, halfCols - 1);

	      let a12 = a.subMatrix(0, halfRows - 1, halfCols, a.columns - 1);
	      let b12 = b.subMatrix(0, halfRows - 1, halfCols, b.columns - 1);

	      let a21 = a.subMatrix(halfRows, a.rows - 1, 0, halfCols - 1);
	      let b21 = b.subMatrix(halfRows, b.rows - 1, 0, halfCols - 1);

	      let a22 = a.subMatrix(halfRows, a.rows - 1, halfCols, a.columns - 1);
	      let b22 = b.subMatrix(halfRows, b.rows - 1, halfCols, b.columns - 1);

	      // Compute intermediate values.
	      let m1 = blockMult(
	        AbstractMatrix.add(a11, a22),
	        AbstractMatrix.add(b11, b22),
	        halfRows,
	        halfCols,
	      );
	      let m2 = blockMult(AbstractMatrix.add(a21, a22), b11, halfRows, halfCols);
	      let m3 = blockMult(a11, AbstractMatrix.sub(b12, b22), halfRows, halfCols);
	      let m4 = blockMult(a22, AbstractMatrix.sub(b21, b11), halfRows, halfCols);
	      let m5 = blockMult(AbstractMatrix.add(a11, a12), b22, halfRows, halfCols);
	      let m6 = blockMult(
	        AbstractMatrix.sub(a21, a11),
	        AbstractMatrix.add(b11, b12),
	        halfRows,
	        halfCols,
	      );
	      let m7 = blockMult(
	        AbstractMatrix.sub(a12, a22),
	        AbstractMatrix.add(b21, b22),
	        halfRows,
	        halfCols,
	      );

	      // Combine intermediate values into the output.
	      let c11 = AbstractMatrix.add(m1, m4);
	      c11.sub(m5);
	      c11.add(m7);
	      let c12 = AbstractMatrix.add(m3, m5);
	      let c21 = AbstractMatrix.add(m2, m4);
	      let c22 = AbstractMatrix.sub(m1, m2);
	      c22.add(m3);
	      c22.add(m6);

	      // Crop output to the desired size (undo dynamic padding).
	      let result = AbstractMatrix.zeros(2 * c11.rows, 2 * c11.columns);
	      result = result.setSubMatrix(c11, 0, 0);
	      result = result.setSubMatrix(c12, c11.rows, 0);
	      result = result.setSubMatrix(c21, 0, c11.columns);
	      result = result.setSubMatrix(c22, c11.rows, c11.columns);
	      return result.subMatrix(0, rows - 1, 0, cols - 1);
	    }

	    return blockMult(x, y, r, c);
	  }

	  scaleRows(options = {}) {
	    if (typeof options !== 'object') {
	      throw new TypeError('options must be an object');
	    }
	    const { min = 0, max = 1 } = options;
	    if (!Number.isFinite(min)) throw new TypeError('min must be a number');
	    if (!Number.isFinite(max)) throw new TypeError('max must be a number');
	    if (min >= max) throw new RangeError('min must be smaller than max');
	    let newMatrix = new Matrix$1(this.rows, this.columns);
	    for (let i = 0; i < this.rows; i++) {
	      const row = this.getRow(i);
	      if (row.length > 0) {
	        rescale(row, { min, max, output: row });
	      }
	      newMatrix.setRow(i, row);
	    }
	    return newMatrix;
	  }

	  scaleColumns(options = {}) {
	    if (typeof options !== 'object') {
	      throw new TypeError('options must be an object');
	    }
	    const { min = 0, max = 1 } = options;
	    if (!Number.isFinite(min)) throw new TypeError('min must be a number');
	    if (!Number.isFinite(max)) throw new TypeError('max must be a number');
	    if (min >= max) throw new RangeError('min must be smaller than max');
	    let newMatrix = new Matrix$1(this.rows, this.columns);
	    for (let i = 0; i < this.columns; i++) {
	      const column = this.getColumn(i);
	      if (column.length) {
	        rescale(column, {
	          min,
	          max,
	          output: column,
	        });
	      }
	      newMatrix.setColumn(i, column);
	    }
	    return newMatrix;
	  }

	  flipRows() {
	    const middle = Math.ceil(this.columns / 2);
	    for (let i = 0; i < this.rows; i++) {
	      for (let j = 0; j < middle; j++) {
	        let first = this.get(i, j);
	        let last = this.get(i, this.columns - 1 - j);
	        this.set(i, j, last);
	        this.set(i, this.columns - 1 - j, first);
	      }
	    }
	    return this;
	  }

	  flipColumns() {
	    const middle = Math.ceil(this.rows / 2);
	    for (let j = 0; j < this.columns; j++) {
	      for (let i = 0; i < middle; i++) {
	        let first = this.get(i, j);
	        let last = this.get(this.rows - 1 - i, j);
	        this.set(i, j, last);
	        this.set(this.rows - 1 - i, j, first);
	      }
	    }
	    return this;
	  }

	  kroneckerProduct(other) {
	    other = Matrix$1.checkMatrix(other);

	    let m = this.rows;
	    let n = this.columns;
	    let p = other.rows;
	    let q = other.columns;

	    let result = new Matrix$1(m * p, n * q);
	    for (let i = 0; i < m; i++) {
	      for (let j = 0; j < n; j++) {
	        for (let k = 0; k < p; k++) {
	          for (let l = 0; l < q; l++) {
	            result.set(p * i + k, q * j + l, this.get(i, j) * other.get(k, l));
	          }
	        }
	      }
	    }
	    return result;
	  }

	  kroneckerSum(other) {
	    other = Matrix$1.checkMatrix(other);
	    if (!this.isSquare() || !other.isSquare()) {
	      throw new Error('Kronecker Sum needs two Square Matrices');
	    }
	    let m = this.rows;
	    let n = other.rows;
	    let AxI = this.kroneckerProduct(Matrix$1.eye(n, n));
	    let IxB = Matrix$1.eye(m, m).kroneckerProduct(other);
	    return AxI.add(IxB);
	  }

	  transpose() {
	    let result = new Matrix$1(this.columns, this.rows);
	    for (let i = 0; i < this.rows; i++) {
	      for (let j = 0; j < this.columns; j++) {
	        result.set(j, i, this.get(i, j));
	      }
	    }
	    return result;
	  }

	  sortRows(compareFunction = compareNumbers) {
	    for (let i = 0; i < this.rows; i++) {
	      this.setRow(i, this.getRow(i).sort(compareFunction));
	    }
	    return this;
	  }

	  sortColumns(compareFunction = compareNumbers) {
	    for (let i = 0; i < this.columns; i++) {
	      this.setColumn(i, this.getColumn(i).sort(compareFunction));
	    }
	    return this;
	  }

	  subMatrix(startRow, endRow, startColumn, endColumn) {
	    checkRange(this, startRow, endRow, startColumn, endColumn);
	    let newMatrix = new Matrix$1(
	      endRow - startRow + 1,
	      endColumn - startColumn + 1,
	    );
	    for (let i = startRow; i <= endRow; i++) {
	      for (let j = startColumn; j <= endColumn; j++) {
	        newMatrix.set(i - startRow, j - startColumn, this.get(i, j));
	      }
	    }
	    return newMatrix;
	  }

	  subMatrixRow(indices, startColumn, endColumn) {
	    if (startColumn === undefined) startColumn = 0;
	    if (endColumn === undefined) endColumn = this.columns - 1;
	    if (
	      startColumn > endColumn ||
	      startColumn < 0 ||
	      startColumn >= this.columns ||
	      endColumn < 0 ||
	      endColumn >= this.columns
	    ) {
	      throw new RangeError('Argument out of range');
	    }

	    let newMatrix = new Matrix$1(indices.length, endColumn - startColumn + 1);
	    for (let i = 0; i < indices.length; i++) {
	      for (let j = startColumn; j <= endColumn; j++) {
	        if (indices[i] < 0 || indices[i] >= this.rows) {
	          throw new RangeError(`Row index out of range: ${indices[i]}`);
	        }
	        newMatrix.set(i, j - startColumn, this.get(indices[i], j));
	      }
	    }
	    return newMatrix;
	  }

	  subMatrixColumn(indices, startRow, endRow) {
	    if (startRow === undefined) startRow = 0;
	    if (endRow === undefined) endRow = this.rows - 1;
	    if (
	      startRow > endRow ||
	      startRow < 0 ||
	      startRow >= this.rows ||
	      endRow < 0 ||
	      endRow >= this.rows
	    ) {
	      throw new RangeError('Argument out of range');
	    }

	    let newMatrix = new Matrix$1(endRow - startRow + 1, indices.length);
	    for (let i = 0; i < indices.length; i++) {
	      for (let j = startRow; j <= endRow; j++) {
	        if (indices[i] < 0 || indices[i] >= this.columns) {
	          throw new RangeError(`Column index out of range: ${indices[i]}`);
	        }
	        newMatrix.set(j - startRow, i, this.get(j, indices[i]));
	      }
	    }
	    return newMatrix;
	  }

	  setSubMatrix(matrix, startRow, startColumn) {
	    matrix = Matrix$1.checkMatrix(matrix);
	    if (matrix.isEmpty()) {
	      return this;
	    }
	    let endRow = startRow + matrix.rows - 1;
	    let endColumn = startColumn + matrix.columns - 1;
	    checkRange(this, startRow, endRow, startColumn, endColumn);
	    for (let i = 0; i < matrix.rows; i++) {
	      for (let j = 0; j < matrix.columns; j++) {
	        this.set(startRow + i, startColumn + j, matrix.get(i, j));
	      }
	    }
	    return this;
	  }

	  selection(rowIndices, columnIndices) {
	    checkRowIndices(this, rowIndices);
	    checkColumnIndices(this, columnIndices);
	    let newMatrix = new Matrix$1(rowIndices.length, columnIndices.length);
	    for (let i = 0; i < rowIndices.length; i++) {
	      let rowIndex = rowIndices[i];
	      for (let j = 0; j < columnIndices.length; j++) {
	        let columnIndex = columnIndices[j];
	        newMatrix.set(i, j, this.get(rowIndex, columnIndex));
	      }
	    }
	    return newMatrix;
	  }

	  trace() {
	    let min = Math.min(this.rows, this.columns);
	    let trace = 0;
	    for (let i = 0; i < min; i++) {
	      trace += this.get(i, i);
	    }
	    return trace;
	  }

	  clone() {
	    return this.constructor.copy(this, new Matrix$1(this.rows, this.columns));
	  }

	  /**
	   * @template {AbstractMatrix} M
	   * @param {AbstractMatrix} from
	   * @param {M} to
	   * @return {M}
	   */
	  static copy(from, to) {
	    for (const [row, column, value] of from.entries()) {
	      to.set(row, column, value);
	    }

	    return to;
	  }

	  sum(by) {
	    switch (by) {
	      case 'row':
	        return sumByRow(this);
	      case 'column':
	        return sumByColumn(this);
	      case undefined:
	        return sumAll(this);
	      default:
	        throw new Error(`invalid option: ${by}`);
	    }
	  }

	  product(by) {
	    switch (by) {
	      case 'row':
	        return productByRow(this);
	      case 'column':
	        return productByColumn(this);
	      case undefined:
	        return productAll(this);
	      default:
	        throw new Error(`invalid option: ${by}`);
	    }
	  }

	  mean(by) {
	    const sum = this.sum(by);
	    switch (by) {
	      case 'row': {
	        for (let i = 0; i < this.rows; i++) {
	          sum[i] /= this.columns;
	        }
	        return sum;
	      }
	      case 'column': {
	        for (let i = 0; i < this.columns; i++) {
	          sum[i] /= this.rows;
	        }
	        return sum;
	      }
	      case undefined:
	        return sum / this.size;
	      default:
	        throw new Error(`invalid option: ${by}`);
	    }
	  }

	  variance(by, options = {}) {
	    if (typeof by === 'object') {
	      options = by;
	      by = undefined;
	    }
	    if (typeof options !== 'object') {
	      throw new TypeError('options must be an object');
	    }
	    const { unbiased = true, mean = this.mean(by) } = options;
	    if (typeof unbiased !== 'boolean') {
	      throw new TypeError('unbiased must be a boolean');
	    }
	    switch (by) {
	      case 'row': {
	        if (!isAnyArray.isAnyArray(mean)) {
	          throw new TypeError('mean must be an array');
	        }
	        return varianceByRow(this, unbiased, mean);
	      }
	      case 'column': {
	        if (!isAnyArray.isAnyArray(mean)) {
	          throw new TypeError('mean must be an array');
	        }
	        return varianceByColumn(this, unbiased, mean);
	      }
	      case undefined: {
	        if (typeof mean !== 'number') {
	          throw new TypeError('mean must be a number');
	        }
	        return varianceAll(this, unbiased, mean);
	      }
	      default:
	        throw new Error(`invalid option: ${by}`);
	    }
	  }

	  standardDeviation(by, options) {
	    if (typeof by === 'object') {
	      options = by;
	      by = undefined;
	    }
	    const variance = this.variance(by, options);
	    if (by === undefined) {
	      return Math.sqrt(variance);
	    } else {
	      for (let i = 0; i < variance.length; i++) {
	        variance[i] = Math.sqrt(variance[i]);
	      }
	      return variance;
	    }
	  }

	  center(by, options = {}) {
	    if (typeof by === 'object') {
	      options = by;
	      by = undefined;
	    }
	    if (typeof options !== 'object') {
	      throw new TypeError('options must be an object');
	    }
	    const { center = this.mean(by) } = options;
	    switch (by) {
	      case 'row': {
	        if (!isAnyArray.isAnyArray(center)) {
	          throw new TypeError('center must be an array');
	        }
	        centerByRow(this, center);
	        return this;
	      }
	      case 'column': {
	        if (!isAnyArray.isAnyArray(center)) {
	          throw new TypeError('center must be an array');
	        }
	        centerByColumn(this, center);
	        return this;
	      }
	      case undefined: {
	        if (typeof center !== 'number') {
	          throw new TypeError('center must be a number');
	        }
	        centerAll(this, center);
	        return this;
	      }
	      default:
	        throw new Error(`invalid option: ${by}`);
	    }
	  }

	  scale(by, options = {}) {
	    if (typeof by === 'object') {
	      options = by;
	      by = undefined;
	    }
	    if (typeof options !== 'object') {
	      throw new TypeError('options must be an object');
	    }
	    let scale = options.scale;
	    switch (by) {
	      case 'row': {
	        if (scale === undefined) {
	          scale = getScaleByRow(this);
	        } else if (!isAnyArray.isAnyArray(scale)) {
	          throw new TypeError('scale must be an array');
	        }
	        scaleByRow(this, scale);
	        return this;
	      }
	      case 'column': {
	        if (scale === undefined) {
	          scale = getScaleByColumn(this);
	        } else if (!isAnyArray.isAnyArray(scale)) {
	          throw new TypeError('scale must be an array');
	        }
	        scaleByColumn(this, scale);
	        return this;
	      }
	      case undefined: {
	        if (scale === undefined) {
	          scale = getScaleAll(this);
	        } else if (typeof scale !== 'number') {
	          throw new TypeError('scale must be a number');
	        }
	        scaleAll(this, scale);
	        return this;
	      }
	      default:
	        throw new Error(`invalid option: ${by}`);
	    }
	  }

	  toString(options) {
	    return inspectMatrixWithOptions(this, options);
	  }

	  [Symbol.iterator]() {
	    return this.entries();
	  }

	  /**
	   * iterator from left to right, from top to bottom
	   * yield [row, column, value]
	   * @returns {Generator<[number, number, number], void, void>}
	   */
	  *entries() {
	    for (let row = 0; row < this.rows; row++) {
	      for (let col = 0; col < this.columns; col++) {
	        yield [row, col, this.get(row, col)];
	      }
	    }
	  }

	  /**
	   * iterator from left to right, from top to bottom
	   * yield value
	   * @returns {Generator<number, void, void>}
	   */
	  *values() {
	    for (let row = 0; row < this.rows; row++) {
	      for (let col = 0; col < this.columns; col++) {
	        yield this.get(row, col);
	      }
	    }
	  }
	}

	AbstractMatrix.prototype.klass = 'Matrix';
	if (typeof Symbol !== 'undefined') {
	  AbstractMatrix.prototype[Symbol.for('nodejs.util.inspect.custom')] =
	    inspectMatrix;
	}

	function compareNumbers(a, b) {
	  return a - b;
	}

	function isArrayOfNumbers(array) {
	  return array.every((element) => {
	    return typeof element === 'number';
	  });
	}

	// Synonyms
	AbstractMatrix.random = AbstractMatrix.rand;
	AbstractMatrix.randomInt = AbstractMatrix.randInt;
	AbstractMatrix.diagonal = AbstractMatrix.diag;
	AbstractMatrix.prototype.diagonal = AbstractMatrix.prototype.diag;
	AbstractMatrix.identity = AbstractMatrix.eye;
	AbstractMatrix.prototype.negate = AbstractMatrix.prototype.neg;
	AbstractMatrix.prototype.tensorProduct =
	  AbstractMatrix.prototype.kroneckerProduct;

	let Matrix$1 = class Matrix extends AbstractMatrix {
	  /**
	   * @type {Float64Array[]}
	   */
	  data;

	  /**
	   * Init an empty matrix
	   * @param {number} nRows
	   * @param {number} nColumns
	   */
	  #initData(nRows, nColumns) {
	    this.data = [];

	    if (Number.isInteger(nColumns) && nColumns >= 0) {
	      for (let i = 0; i < nRows; i++) {
	        this.data.push(new Float64Array(nColumns));
	      }
	    } else {
	      throw new TypeError('nColumns must be a positive integer');
	    }

	    this.rows = nRows;
	    this.columns = nColumns;
	  }

	  constructor(nRows, nColumns) {
	    super();
	    if (Matrix.isMatrix(nRows)) {
	      this.#initData(nRows.rows, nRows.columns);
	      Matrix.copy(nRows, this);
	    } else if (Number.isInteger(nRows) && nRows >= 0) {
	      this.#initData(nRows, nColumns);
	    } else if (isAnyArray.isAnyArray(nRows)) {
	      // Copy the values from the 2D array
	      const arrayData = nRows;
	      nRows = arrayData.length;
	      nColumns = nRows ? arrayData[0].length : 0;
	      if (typeof nColumns !== 'number') {
	        throw new TypeError(
	          'Data must be a 2D array with at least one element',
	        );
	      }
	      this.data = [];

	      for (let i = 0; i < nRows; i++) {
	        if (arrayData[i].length !== nColumns) {
	          throw new RangeError('Inconsistent array dimensions');
	        }
	        if (!isArrayOfNumbers(arrayData[i])) {
	          throw new TypeError('Input data contains non-numeric values');
	        }
	        this.data.push(Float64Array.from(arrayData[i]));
	      }

	      this.rows = nRows;
	      this.columns = nColumns;
	    } else {
	      throw new TypeError(
	        'First argument must be a positive number or an array',
	      );
	    }
	  }

	  set(rowIndex, columnIndex, value) {
	    this.data[rowIndex][columnIndex] = value;
	    return this;
	  }

	  get(rowIndex, columnIndex) {
	    return this.data[rowIndex][columnIndex];
	  }

	  removeRow(index) {
	    checkRowIndex(this, index);
	    this.data.splice(index, 1);
	    this.rows -= 1;
	    return this;
	  }

	  addRow(index, array) {
	    if (array === undefined) {
	      array = index;
	      index = this.rows;
	    }
	    checkRowIndex(this, index, true);
	    array = Float64Array.from(checkRowVector(this, array));
	    this.data.splice(index, 0, array);
	    this.rows += 1;
	    return this;
	  }

	  removeColumn(index) {
	    checkColumnIndex(this, index);
	    for (let i = 0; i < this.rows; i++) {
	      const newRow = new Float64Array(this.columns - 1);
	      for (let j = 0; j < index; j++) {
	        newRow[j] = this.data[i][j];
	      }
	      for (let j = index + 1; j < this.columns; j++) {
	        newRow[j - 1] = this.data[i][j];
	      }
	      this.data[i] = newRow;
	    }
	    this.columns -= 1;
	    return this;
	  }

	  addColumn(index, array) {
	    if (typeof array === 'undefined') {
	      array = index;
	      index = this.columns;
	    }
	    checkColumnIndex(this, index, true);
	    array = checkColumnVector(this, array);
	    for (let i = 0; i < this.rows; i++) {
	      const newRow = new Float64Array(this.columns + 1);
	      let j = 0;
	      for (; j < index; j++) {
	        newRow[j] = this.data[i][j];
	      }
	      newRow[j++] = array[i];
	      for (; j < this.columns + 1; j++) {
	        newRow[j] = this.data[i][j - 1];
	      }
	      this.data[i] = newRow;
	    }
	    this.columns += 1;
	    return this;
	  }
	};

	installMathOperations(AbstractMatrix, Matrix$1);

	/**
	 * @typedef {0 | 1 | number | boolean} Mask
	 */

	class SymmetricMatrix extends AbstractMatrix {
	  /** @type {Matrix} */
	  #matrix;

	  get size() {
	    return this.#matrix.size;
	  }

	  get rows() {
	    return this.#matrix.rows;
	  }

	  get columns() {
	    return this.#matrix.columns;
	  }

	  get diagonalSize() {
	    return this.rows;
	  }

	  /**
	   * not the same as matrix.isSymmetric()
	   * Here is to check if it's instanceof SymmetricMatrix without bundling issues
	   *
	   * @param value
	   * @returns {boolean}
	   */
	  static isSymmetricMatrix(value) {
	    return Matrix$1.isMatrix(value) && value.klassType === 'SymmetricMatrix';
	  }

	  /**
	   * @param diagonalSize
	   * @return {SymmetricMatrix}
	   */
	  static zeros(diagonalSize) {
	    return new this(diagonalSize);
	  }

	  /**
	   * @param diagonalSize
	   * @return {SymmetricMatrix}
	   */
	  static ones(diagonalSize) {
	    return new this(diagonalSize).fill(1);
	  }

	  /**
	   * @param {number | AbstractMatrix | ArrayLike<ArrayLike<number>>} diagonalSize
	   * @return {this}
	   */
	  constructor(diagonalSize) {
	    super();

	    if (Matrix$1.isMatrix(diagonalSize)) {
	      if (!diagonalSize.isSymmetric()) {
	        throw new TypeError('not symmetric data');
	      }

	      this.#matrix = Matrix$1.copy(
	        diagonalSize,
	        new Matrix$1(diagonalSize.rows, diagonalSize.rows),
	      );
	    } else if (Number.isInteger(diagonalSize) && diagonalSize >= 0) {
	      this.#matrix = new Matrix$1(diagonalSize, diagonalSize);
	    } else {
	      this.#matrix = new Matrix$1(diagonalSize);

	      if (!this.isSymmetric()) {
	        throw new TypeError('not symmetric data');
	      }
	    }
	  }

	  clone() {
	    const matrix = new SymmetricMatrix(this.diagonalSize);

	    for (const [row, col, value] of this.upperRightEntries()) {
	      matrix.set(row, col, value);
	    }

	    return matrix;
	  }

	  toMatrix() {
	    return new Matrix$1(this);
	  }

	  get(rowIndex, columnIndex) {
	    return this.#matrix.get(rowIndex, columnIndex);
	  }
	  set(rowIndex, columnIndex, value) {
	    // symmetric set
	    this.#matrix.set(rowIndex, columnIndex, value);
	    this.#matrix.set(columnIndex, rowIndex, value);

	    return this;
	  }

	  removeCross(index) {
	    // symmetric remove side
	    this.#matrix.removeRow(index);
	    this.#matrix.removeColumn(index);

	    return this;
	  }

	  addCross(index, array) {
	    if (array === undefined) {
	      array = index;
	      index = this.diagonalSize;
	    }

	    const row = array.slice();
	    row.splice(index, 1);

	    this.#matrix.addRow(index, row);
	    this.#matrix.addColumn(index, array);

	    return this;
	  }

	  /**
	   * @param {Mask[]} mask
	   */
	  applyMask(mask) {
	    if (mask.length !== this.diagonalSize) {
	      throw new RangeError('Mask size do not match with matrix size');
	    }

	    // prepare sides to remove from matrix from mask
	    /** @type {number[]} */
	    const sidesToRemove = [];
	    for (const [index, passthroughs] of mask.entries()) {
	      if (passthroughs) continue;
	      sidesToRemove.push(index);
	    }
	    // to remove from highest to lowest for no mutation shifting
	    sidesToRemove.reverse();

	    // remove sides
	    for (const sideIndex of sidesToRemove) {
	      this.removeCross(sideIndex);
	    }

	    return this;
	  }

	  /**
	   * Compact format upper-right corner of matrix
	   * iterate from left to right, from top to bottom.
	   *
	   * ```
	   *   A B C D
	   * A 1 2 3 4
	   * B 2 5 6 7
	   * C 3 6 8 9
	   * D 4 7 9 10
	   * ```
	   *
	   * will return compact 1D array `[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]`
	   *
	   * length is S(i=0, n=sideSize) => 10 for a 4 sideSized matrix
	   *
	   * @returns {number[]}
	   */
	  toCompact() {
	    const { diagonalSize } = this;

	    /** @type {number[]} */
	    const compact = new Array((diagonalSize * (diagonalSize + 1)) / 2);
	    for (let col = 0, row = 0, index = 0; index < compact.length; index++) {
	      compact[index] = this.get(row, col);

	      if (++col >= diagonalSize) col = ++row;
	    }

	    return compact;
	  }

	  /**
	   * @param {number[]} compact
	   * @return {SymmetricMatrix}
	   */
	  static fromCompact(compact) {
	    const compactSize = compact.length;
	    // compactSize = (sideSize * (sideSize + 1)) / 2
	    // https://mathsolver.microsoft.com/fr/solve-problem/y%20%3D%20%20x%20%60cdot%20%20%20%60frac%7B%20%20%60left(%20x%2B1%20%20%60right)%20%20%20%20%7D%7B%202%20%20%7D
	    // sideSize = (Sqrt(8 × compactSize + 1) - 1) / 2
	    const diagonalSize = (Math.sqrt(8 * compactSize + 1) - 1) / 2;

	    if (!Number.isInteger(diagonalSize)) {
	      throw new TypeError(
	        `This array is not a compact representation of a Symmetric Matrix, ${JSON.stringify(
          compact,
        )}`,
	      );
	    }

	    const matrix = new SymmetricMatrix(diagonalSize);
	    for (let col = 0, row = 0, index = 0; index < compactSize; index++) {
	      matrix.set(col, row, compact[index]);
	      if (++col >= diagonalSize) col = ++row;
	    }

	    return matrix;
	  }

	  /**
	   * half iterator upper-right-corner from left to right, from top to bottom
	   * yield [row, column, value]
	   *
	   * @returns {Generator<[number, number, number], void, void>}
	   */
	  *upperRightEntries() {
	    for (let row = 0, col = 0; row < this.diagonalSize; void 0) {
	      const value = this.get(row, col);

	      yield [row, col, value];

	      // at the end of row, move cursor to next row at diagonal position
	      if (++col >= this.diagonalSize) col = ++row;
	    }
	  }

	  /**
	   * half iterator upper-right-corner from left to right, from top to bottom
	   * yield value
	   *
	   * @returns {Generator<[number, number, number], void, void>}
	   */
	  *upperRightValues() {
	    for (let row = 0, col = 0; row < this.diagonalSize; void 0) {
	      const value = this.get(row, col);

	      yield value;

	      // at the end of row, move cursor to next row at diagonal position
	      if (++col >= this.diagonalSize) col = ++row;
	    }
	  }
	}
	SymmetricMatrix.prototype.klassType = 'SymmetricMatrix';

	class DistanceMatrix extends SymmetricMatrix {
	  /**
	   * not the same as matrix.isSymmetric()
	   * Here is to check if it's instanceof SymmetricMatrix without bundling issues
	   *
	   * @param value
	   * @returns {boolean}
	   */
	  static isDistanceMatrix(value) {
	    return (
	      SymmetricMatrix.isSymmetricMatrix(value) &&
	      value.klassSubType === 'DistanceMatrix'
	    );
	  }

	  constructor(sideSize) {
	    super(sideSize);

	    if (!this.isDistance()) {
	      throw new TypeError('Provided arguments do no produce a distance matrix');
	    }
	  }

	  set(rowIndex, columnIndex, value) {
	    // distance matrix diagonal is 0
	    if (rowIndex === columnIndex) value = 0;

	    return super.set(rowIndex, columnIndex, value);
	  }

	  addCross(index, array) {
	    if (array === undefined) {
	      array = index;
	      index = this.diagonalSize;
	    }

	    // ensure distance
	    array = array.slice();
	    array[index] = 0;

	    return super.addCross(index, array);
	  }

	  toSymmetricMatrix() {
	    return new SymmetricMatrix(this);
	  }

	  clone() {
	    const matrix = new DistanceMatrix(this.diagonalSize);

	    for (const [row, col, value] of this.upperRightEntries()) {
	      if (row === col) continue;
	      matrix.set(row, col, value);
	    }

	    return matrix;
	  }

	  /**
	   * Compact format upper-right corner of matrix
	   * no diagonal (only zeros)
	   * iterable from left to right, from top to bottom.
	   *
	   * ```
	   *   A B C D
	   * A 0 1 2 3
	   * B 1 0 4 5
	   * C 2 4 0 6
	   * D 3 5 6 0
	   * ```
	   *
	   * will return compact 1D array `[1, 2, 3, 4, 5, 6]`
	   *
	   * length is S(i=0, n=sideSize-1) => 6 for a 4 side sized matrix
	   *
	   * @returns {number[]}
	   */
	  toCompact() {
	    const { diagonalSize } = this;
	    const compactLength = ((diagonalSize - 1) * diagonalSize) / 2;

	    /** @type {number[]} */
	    const compact = new Array(compactLength);
	    for (let col = 1, row = 0, index = 0; index < compact.length; index++) {
	      compact[index] = this.get(row, col);

	      if (++col >= diagonalSize) col = ++row + 1;
	    }

	    return compact;
	  }

	  /**
	   * @param {number[]} compact
	   */
	  static fromCompact(compact) {
	    const compactSize = compact.length;

	    if (compactSize === 0) {
	      return new this(0);
	    }

	    // compactSize in Natural integer range ]0;∞]
	    // compactSize = (sideSize * (sideSize - 1)) / 2
	    // sideSize = (Sqrt(8 × compactSize + 1) + 1) / 2
	    const diagonalSize = (Math.sqrt(8 * compactSize + 1) + 1) / 2;

	    if (!Number.isInteger(diagonalSize)) {
	      throw new TypeError(
	        `This array is not a compact representation of a DistanceMatrix, ${JSON.stringify(
          compact,
        )}`,
	      );
	    }

	    const matrix = new this(diagonalSize);
	    for (let col = 1, row = 0, index = 0; index < compactSize; index++) {
	      matrix.set(col, row, compact[index]);
	      if (++col >= diagonalSize) col = ++row + 1;
	    }

	    return matrix;
	  }
	}
	DistanceMatrix.prototype.klassSubType = 'DistanceMatrix';

	class BaseView extends AbstractMatrix {
	  constructor(matrix, rows, columns) {
	    super();
	    this.matrix = matrix;
	    this.rows = rows;
	    this.columns = columns;
	  }
	}

	class MatrixColumnView extends BaseView {
	  constructor(matrix, column) {
	    checkColumnIndex(matrix, column);
	    super(matrix, matrix.rows, 1);
	    this.column = column;
	  }

	  set(rowIndex, columnIndex, value) {
	    this.matrix.set(rowIndex, this.column, value);
	    return this;
	  }

	  get(rowIndex) {
	    return this.matrix.get(rowIndex, this.column);
	  }
	}

	class MatrixColumnSelectionView extends BaseView {
	  constructor(matrix, columnIndices) {
	    checkColumnIndices(matrix, columnIndices);
	    super(matrix, matrix.rows, columnIndices.length);
	    this.columnIndices = columnIndices;
	  }

	  set(rowIndex, columnIndex, value) {
	    this.matrix.set(rowIndex, this.columnIndices[columnIndex], value);
	    return this;
	  }

	  get(rowIndex, columnIndex) {
	    return this.matrix.get(rowIndex, this.columnIndices[columnIndex]);
	  }
	}

	class MatrixFlipColumnView extends BaseView {
	  constructor(matrix) {
	    super(matrix, matrix.rows, matrix.columns);
	  }

	  set(rowIndex, columnIndex, value) {
	    this.matrix.set(rowIndex, this.columns - columnIndex - 1, value);
	    return this;
	  }

	  get(rowIndex, columnIndex) {
	    return this.matrix.get(rowIndex, this.columns - columnIndex - 1);
	  }
	}

	class MatrixFlipRowView extends BaseView {
	  constructor(matrix) {
	    super(matrix, matrix.rows, matrix.columns);
	  }

	  set(rowIndex, columnIndex, value) {
	    this.matrix.set(this.rows - rowIndex - 1, columnIndex, value);
	    return this;
	  }

	  get(rowIndex, columnIndex) {
	    return this.matrix.get(this.rows - rowIndex - 1, columnIndex);
	  }
	}

	class MatrixRowView extends BaseView {
	  constructor(matrix, row) {
	    checkRowIndex(matrix, row);
	    super(matrix, 1, matrix.columns);
	    this.row = row;
	  }

	  set(rowIndex, columnIndex, value) {
	    this.matrix.set(this.row, columnIndex, value);
	    return this;
	  }

	  get(rowIndex, columnIndex) {
	    return this.matrix.get(this.row, columnIndex);
	  }
	}

	class MatrixRowSelectionView extends BaseView {
	  constructor(matrix, rowIndices) {
	    checkRowIndices(matrix, rowIndices);
	    super(matrix, rowIndices.length, matrix.columns);
	    this.rowIndices = rowIndices;
	  }

	  set(rowIndex, columnIndex, value) {
	    this.matrix.set(this.rowIndices[rowIndex], columnIndex, value);
	    return this;
	  }

	  get(rowIndex, columnIndex) {
	    return this.matrix.get(this.rowIndices[rowIndex], columnIndex);
	  }
	}

	class MatrixSelectionView extends BaseView {
	  constructor(matrix, rowIndices, columnIndices) {
	    checkRowIndices(matrix, rowIndices);
	    checkColumnIndices(matrix, columnIndices);
	    super(matrix, rowIndices.length, columnIndices.length);
	    this.rowIndices = rowIndices;
	    this.columnIndices = columnIndices;
	  }

	  set(rowIndex, columnIndex, value) {
	    this.matrix.set(
	      this.rowIndices[rowIndex],
	      this.columnIndices[columnIndex],
	      value,
	    );
	    return this;
	  }

	  get(rowIndex, columnIndex) {
	    return this.matrix.get(
	      this.rowIndices[rowIndex],
	      this.columnIndices[columnIndex],
	    );
	  }
	}

	class MatrixSubView extends BaseView {
	  constructor(matrix, startRow, endRow, startColumn, endColumn) {
	    checkRange(matrix, startRow, endRow, startColumn, endColumn);
	    super(matrix, endRow - startRow + 1, endColumn - startColumn + 1);
	    this.startRow = startRow;
	    this.startColumn = startColumn;
	  }

	  set(rowIndex, columnIndex, value) {
	    this.matrix.set(
	      this.startRow + rowIndex,
	      this.startColumn + columnIndex,
	      value,
	    );
	    return this;
	  }

	  get(rowIndex, columnIndex) {
	    return this.matrix.get(
	      this.startRow + rowIndex,
	      this.startColumn + columnIndex,
	    );
	  }
	}

	class MatrixTransposeView extends BaseView {
	  constructor(matrix) {
	    super(matrix, matrix.columns, matrix.rows);
	  }

	  set(rowIndex, columnIndex, value) {
	    this.matrix.set(columnIndex, rowIndex, value);
	    return this;
	  }

	  get(rowIndex, columnIndex) {
	    return this.matrix.get(columnIndex, rowIndex);
	  }
	}

	class WrapperMatrix1D extends AbstractMatrix {
	  constructor(data, options = {}) {
	    const { rows = 1 } = options;

	    if (data.length % rows !== 0) {
	      throw new Error('the data length is not divisible by the number of rows');
	    }
	    super();
	    this.rows = rows;
	    this.columns = data.length / rows;
	    this.data = data;
	  }

	  set(rowIndex, columnIndex, value) {
	    let index = this._calculateIndex(rowIndex, columnIndex);
	    this.data[index] = value;
	    return this;
	  }

	  get(rowIndex, columnIndex) {
	    let index = this._calculateIndex(rowIndex, columnIndex);
	    return this.data[index];
	  }

	  _calculateIndex(row, column) {
	    return row * this.columns + column;
	  }
	}

	class WrapperMatrix2D extends AbstractMatrix {
	  constructor(data) {
	    super();
	    this.data = data;
	    this.rows = data.length;
	    this.columns = data[0].length;
	  }

	  set(rowIndex, columnIndex, value) {
	    this.data[rowIndex][columnIndex] = value;
	    return this;
	  }

	  get(rowIndex, columnIndex) {
	    return this.data[rowIndex][columnIndex];
	  }
	}

	function wrap(array, options) {
	  if (isAnyArray.isAnyArray(array)) {
	    if (array[0] && isAnyArray.isAnyArray(array[0])) {
	      return new WrapperMatrix2D(array);
	    } else {
	      return new WrapperMatrix1D(array, options);
	    }
	  } else {
	    throw new Error('the argument is not an array');
	  }
	}

	class LuDecomposition {
	  constructor(matrix) {
	    matrix = WrapperMatrix2D.checkMatrix(matrix);

	    let lu = matrix.clone();
	    let rows = lu.rows;
	    let columns = lu.columns;
	    let pivotVector = new Float64Array(rows);
	    let pivotSign = 1;
	    let i, j, k, p, s, t, v;
	    let LUcolj, kmax;

	    for (i = 0; i < rows; i++) {
	      pivotVector[i] = i;
	    }

	    LUcolj = new Float64Array(rows);

	    for (j = 0; j < columns; j++) {
	      for (i = 0; i < rows; i++) {
	        LUcolj[i] = lu.get(i, j);
	      }

	      for (i = 0; i < rows; i++) {
	        kmax = Math.min(i, j);
	        s = 0;
	        for (k = 0; k < kmax; k++) {
	          s += lu.get(i, k) * LUcolj[k];
	        }
	        LUcolj[i] -= s;
	        lu.set(i, j, LUcolj[i]);
	      }

	      p = j;
	      for (i = j + 1; i < rows; i++) {
	        if (Math.abs(LUcolj[i]) > Math.abs(LUcolj[p])) {
	          p = i;
	        }
	      }

	      if (p !== j) {
	        for (k = 0; k < columns; k++) {
	          t = lu.get(p, k);
	          lu.set(p, k, lu.get(j, k));
	          lu.set(j, k, t);
	        }

	        v = pivotVector[p];
	        pivotVector[p] = pivotVector[j];
	        pivotVector[j] = v;

	        pivotSign = -pivotSign;
	      }

	      if (j < rows && lu.get(j, j) !== 0) {
	        for (i = j + 1; i < rows; i++) {
	          lu.set(i, j, lu.get(i, j) / lu.get(j, j));
	        }
	      }
	    }

	    this.LU = lu;
	    this.pivotVector = pivotVector;
	    this.pivotSign = pivotSign;
	  }

	  isSingular() {
	    let data = this.LU;
	    let col = data.columns;
	    for (let j = 0; j < col; j++) {
	      if (data.get(j, j) === 0) {
	        return true;
	      }
	    }
	    return false;
	  }

	  solve(value) {
	    value = Matrix$1.checkMatrix(value);

	    let lu = this.LU;
	    let rows = lu.rows;

	    if (rows !== value.rows) {
	      throw new Error('Invalid matrix dimensions');
	    }
	    if (this.isSingular()) {
	      throw new Error('LU matrix is singular');
	    }

	    let count = value.columns;
	    let X = value.subMatrixRow(this.pivotVector, 0, count - 1);
	    let columns = lu.columns;
	    let i, j, k;

	    for (k = 0; k < columns; k++) {
	      for (i = k + 1; i < columns; i++) {
	        for (j = 0; j < count; j++) {
	          X.set(i, j, X.get(i, j) - X.get(k, j) * lu.get(i, k));
	        }
	      }
	    }
	    for (k = columns - 1; k >= 0; k--) {
	      for (j = 0; j < count; j++) {
	        X.set(k, j, X.get(k, j) / lu.get(k, k));
	      }
	      for (i = 0; i < k; i++) {
	        for (j = 0; j < count; j++) {
	          X.set(i, j, X.get(i, j) - X.get(k, j) * lu.get(i, k));
	        }
	      }
	    }
	    return X;
	  }

	  get determinant() {
	    let data = this.LU;
	    if (!data.isSquare()) {
	      throw new Error('Matrix must be square');
	    }
	    let determinant = this.pivotSign;
	    let col = data.columns;
	    for (let j = 0; j < col; j++) {
	      determinant *= data.get(j, j);
	    }
	    return determinant;
	  }

	  get lowerTriangularMatrix() {
	    let data = this.LU;
	    let rows = data.rows;
	    let columns = data.columns;
	    let X = new Matrix$1(rows, columns);
	    for (let i = 0; i < rows; i++) {
	      for (let j = 0; j < columns; j++) {
	        if (i > j) {
	          X.set(i, j, data.get(i, j));
	        } else if (i === j) {
	          X.set(i, j, 1);
	        } else {
	          X.set(i, j, 0);
	        }
	      }
	    }
	    return X;
	  }

	  get upperTriangularMatrix() {
	    let data = this.LU;
	    let rows = data.rows;
	    let columns = data.columns;
	    let X = new Matrix$1(rows, columns);
	    for (let i = 0; i < rows; i++) {
	      for (let j = 0; j < columns; j++) {
	        if (i <= j) {
	          X.set(i, j, data.get(i, j));
	        } else {
	          X.set(i, j, 0);
	        }
	      }
	    }
	    return X;
	  }

	  get pivotPermutationVector() {
	    return Array.from(this.pivotVector);
	  }
	}

	function hypotenuse(a, b) {
	  let r = 0;
	  if (Math.abs(a) > Math.abs(b)) {
	    r = b / a;
	    return Math.abs(a) * Math.sqrt(1 + r * r);
	  }
	  if (b !== 0) {
	    r = a / b;
	    return Math.abs(b) * Math.sqrt(1 + r * r);
	  }
	  return 0;
	}

	class QrDecomposition {
	  constructor(value) {
	    value = WrapperMatrix2D.checkMatrix(value);

	    let qr = value.clone();
	    let m = value.rows;
	    let n = value.columns;
	    let rdiag = new Float64Array(n);
	    let i, j, k, s;

	    for (k = 0; k < n; k++) {
	      let nrm = 0;
	      for (i = k; i < m; i++) {
	        nrm = hypotenuse(nrm, qr.get(i, k));
	      }
	      if (nrm !== 0) {
	        if (qr.get(k, k) < 0) {
	          nrm = -nrm;
	        }
	        for (i = k; i < m; i++) {
	          qr.set(i, k, qr.get(i, k) / nrm);
	        }
	        qr.set(k, k, qr.get(k, k) + 1);
	        for (j = k + 1; j < n; j++) {
	          s = 0;
	          for (i = k; i < m; i++) {
	            s += qr.get(i, k) * qr.get(i, j);
	          }
	          s = -s / qr.get(k, k);
	          for (i = k; i < m; i++) {
	            qr.set(i, j, qr.get(i, j) + s * qr.get(i, k));
	          }
	        }
	      }
	      rdiag[k] = -nrm;
	    }

	    this.QR = qr;
	    this.Rdiag = rdiag;
	  }

	  solve(value) {
	    value = Matrix$1.checkMatrix(value);

	    let qr = this.QR;
	    let m = qr.rows;

	    if (value.rows !== m) {
	      throw new Error('Matrix row dimensions must agree');
	    }
	    if (!this.isFullRank()) {
	      throw new Error('Matrix is rank deficient');
	    }

	    let count = value.columns;
	    let X = value.clone();
	    let n = qr.columns;
	    let i, j, k, s;

	    for (k = 0; k < n; k++) {
	      for (j = 0; j < count; j++) {
	        s = 0;
	        for (i = k; i < m; i++) {
	          s += qr.get(i, k) * X.get(i, j);
	        }
	        s = -s / qr.get(k, k);
	        for (i = k; i < m; i++) {
	          X.set(i, j, X.get(i, j) + s * qr.get(i, k));
	        }
	      }
	    }
	    for (k = n - 1; k >= 0; k--) {
	      for (j = 0; j < count; j++) {
	        X.set(k, j, X.get(k, j) / this.Rdiag[k]);
	      }
	      for (i = 0; i < k; i++) {
	        for (j = 0; j < count; j++) {
	          X.set(i, j, X.get(i, j) - X.get(k, j) * qr.get(i, k));
	        }
	      }
	    }

	    return X.subMatrix(0, n - 1, 0, count - 1);
	  }

	  isFullRank() {
	    let columns = this.QR.columns;
	    for (let i = 0; i < columns; i++) {
	      if (this.Rdiag[i] === 0) {
	        return false;
	      }
	    }
	    return true;
	  }

	  get upperTriangularMatrix() {
	    let qr = this.QR;
	    let n = qr.columns;
	    let X = new Matrix$1(n, n);
	    let i, j;
	    for (i = 0; i < n; i++) {
	      for (j = 0; j < n; j++) {
	        if (i < j) {
	          X.set(i, j, qr.get(i, j));
	        } else if (i === j) {
	          X.set(i, j, this.Rdiag[i]);
	        } else {
	          X.set(i, j, 0);
	        }
	      }
	    }
	    return X;
	  }

	  get orthogonalMatrix() {
	    let qr = this.QR;
	    let rows = qr.rows;
	    let columns = qr.columns;
	    let X = new Matrix$1(rows, columns);
	    let i, j, k, s;

	    for (k = columns - 1; k >= 0; k--) {
	      for (i = 0; i < rows; i++) {
	        X.set(i, k, 0);
	      }
	      X.set(k, k, 1);
	      for (j = k; j < columns; j++) {
	        if (qr.get(k, k) !== 0) {
	          s = 0;
	          for (i = k; i < rows; i++) {
	            s += qr.get(i, k) * X.get(i, j);
	          }

	          s = -s / qr.get(k, k);

	          for (i = k; i < rows; i++) {
	            X.set(i, j, X.get(i, j) + s * qr.get(i, k));
	          }
	        }
	      }
	    }
	    return X;
	  }
	}

	class SingularValueDecomposition {
	  constructor(value, options = {}) {
	    value = WrapperMatrix2D.checkMatrix(value);

	    if (value.isEmpty()) {
	      throw new Error('Matrix must be non-empty');
	    }

	    let m = value.rows;
	    let n = value.columns;

	    const {
	      computeLeftSingularVectors = true,
	      computeRightSingularVectors = true,
	      autoTranspose = false,
	    } = options;

	    let wantu = Boolean(computeLeftSingularVectors);
	    let wantv = Boolean(computeRightSingularVectors);

	    let swapped = false;
	    let a;
	    if (m < n) {
	      if (!autoTranspose) {
	        a = value.clone();
	        // eslint-disable-next-line no-console
	        console.warn(
	          'Computing SVD on a matrix with more columns than rows. Consider enabling autoTranspose',
	        );
	      } else {
	        a = value.transpose();
	        m = a.rows;
	        n = a.columns;
	        swapped = true;
	        let aux = wantu;
	        wantu = wantv;
	        wantv = aux;
	      }
	    } else {
	      a = value.clone();
	    }

	    let nu = Math.min(m, n);
	    let ni = Math.min(m + 1, n);
	    let s = new Float64Array(ni);
	    let U = new Matrix$1(m, nu);
	    let V = new Matrix$1(n, n);

	    let e = new Float64Array(n);
	    let work = new Float64Array(m);

	    let si = new Float64Array(ni);
	    for (let i = 0; i < ni; i++) si[i] = i;

	    let nct = Math.min(m - 1, n);
	    let nrt = Math.max(0, Math.min(n - 2, m));
	    let mrc = Math.max(nct, nrt);

	    for (let k = 0; k < mrc; k++) {
	      if (k < nct) {
	        s[k] = 0;
	        for (let i = k; i < m; i++) {
	          s[k] = hypotenuse(s[k], a.get(i, k));
	        }
	        if (s[k] !== 0) {
	          if (a.get(k, k) < 0) {
	            s[k] = -s[k];
	          }
	          for (let i = k; i < m; i++) {
	            a.set(i, k, a.get(i, k) / s[k]);
	          }
	          a.set(k, k, a.get(k, k) + 1);
	        }
	        s[k] = -s[k];
	      }

	      for (let j = k + 1; j < n; j++) {
	        if (k < nct && s[k] !== 0) {
	          let t = 0;
	          for (let i = k; i < m; i++) {
	            t += a.get(i, k) * a.get(i, j);
	          }
	          t = -t / a.get(k, k);
	          for (let i = k; i < m; i++) {
	            a.set(i, j, a.get(i, j) + t * a.get(i, k));
	          }
	        }
	        e[j] = a.get(k, j);
	      }

	      if (wantu && k < nct) {
	        for (let i = k; i < m; i++) {
	          U.set(i, k, a.get(i, k));
	        }
	      }

	      if (k < nrt) {
	        e[k] = 0;
	        for (let i = k + 1; i < n; i++) {
	          e[k] = hypotenuse(e[k], e[i]);
	        }
	        if (e[k] !== 0) {
	          if (e[k + 1] < 0) {
	            e[k] = 0 - e[k];
	          }
	          for (let i = k + 1; i < n; i++) {
	            e[i] /= e[k];
	          }
	          e[k + 1] += 1;
	        }
	        e[k] = -e[k];
	        if (k + 1 < m && e[k] !== 0) {
	          for (let i = k + 1; i < m; i++) {
	            work[i] = 0;
	          }
	          for (let i = k + 1; i < m; i++) {
	            for (let j = k + 1; j < n; j++) {
	              work[i] += e[j] * a.get(i, j);
	            }
	          }
	          for (let j = k + 1; j < n; j++) {
	            let t = -e[j] / e[k + 1];
	            for (let i = k + 1; i < m; i++) {
	              a.set(i, j, a.get(i, j) + t * work[i]);
	            }
	          }
	        }
	        if (wantv) {
	          for (let i = k + 1; i < n; i++) {
	            V.set(i, k, e[i]);
	          }
	        }
	      }
	    }

	    let p = Math.min(n, m + 1);
	    if (nct < n) {
	      s[nct] = a.get(nct, nct);
	    }
	    if (m < p) {
	      s[p - 1] = 0;
	    }
	    if (nrt + 1 < p) {
	      e[nrt] = a.get(nrt, p - 1);
	    }
	    e[p - 1] = 0;

	    if (wantu) {
	      for (let j = nct; j < nu; j++) {
	        for (let i = 0; i < m; i++) {
	          U.set(i, j, 0);
	        }
	        U.set(j, j, 1);
	      }
	      for (let k = nct - 1; k >= 0; k--) {
	        if (s[k] !== 0) {
	          for (let j = k + 1; j < nu; j++) {
	            let t = 0;
	            for (let i = k; i < m; i++) {
	              t += U.get(i, k) * U.get(i, j);
	            }
	            t = -t / U.get(k, k);
	            for (let i = k; i < m; i++) {
	              U.set(i, j, U.get(i, j) + t * U.get(i, k));
	            }
	          }
	          for (let i = k; i < m; i++) {
	            U.set(i, k, -U.get(i, k));
	          }
	          U.set(k, k, 1 + U.get(k, k));
	          for (let i = 0; i < k - 1; i++) {
	            U.set(i, k, 0);
	          }
	        } else {
	          for (let i = 0; i < m; i++) {
	            U.set(i, k, 0);
	          }
	          U.set(k, k, 1);
	        }
	      }
	    }

	    if (wantv) {
	      for (let k = n - 1; k >= 0; k--) {
	        if (k < nrt && e[k] !== 0) {
	          for (let j = k + 1; j < n; j++) {
	            let t = 0;
	            for (let i = k + 1; i < n; i++) {
	              t += V.get(i, k) * V.get(i, j);
	            }
	            t = -t / V.get(k + 1, k);
	            for (let i = k + 1; i < n; i++) {
	              V.set(i, j, V.get(i, j) + t * V.get(i, k));
	            }
	          }
	        }
	        for (let i = 0; i < n; i++) {
	          V.set(i, k, 0);
	        }
	        V.set(k, k, 1);
	      }
	    }

	    let pp = p - 1;
	    let eps = Number.EPSILON;
	    while (p > 0) {
	      let k, kase;
	      for (k = p - 2; k >= -1; k--) {
	        if (k === -1) {
	          break;
	        }
	        const alpha =
	          Number.MIN_VALUE + eps * Math.abs(s[k] + Math.abs(s[k + 1]));
	        if (Math.abs(e[k]) <= alpha || Number.isNaN(e[k])) {
	          e[k] = 0;
	          break;
	        }
	      }
	      if (k === p - 2) {
	        kase = 4;
	      } else {
	        let ks;
	        for (ks = p - 1; ks >= k; ks--) {
	          if (ks === k) {
	            break;
	          }
	          let t =
	            (ks !== p ? Math.abs(e[ks]) : 0) +
	            (ks !== k + 1 ? Math.abs(e[ks - 1]) : 0);
	          if (Math.abs(s[ks]) <= eps * t) {
	            s[ks] = 0;
	            break;
	          }
	        }
	        if (ks === k) {
	          kase = 3;
	        } else if (ks === p - 1) {
	          kase = 1;
	        } else {
	          kase = 2;
	          k = ks;
	        }
	      }

	      k++;

	      switch (kase) {
	        case 1: {
	          let f = e[p - 2];
	          e[p - 2] = 0;
	          for (let j = p - 2; j >= k; j--) {
	            let t = hypotenuse(s[j], f);
	            let cs = s[j] / t;
	            let sn = f / t;
	            s[j] = t;
	            if (j !== k) {
	              f = -sn * e[j - 1];
	              e[j - 1] = cs * e[j - 1];
	            }
	            if (wantv) {
	              for (let i = 0; i < n; i++) {
	                t = cs * V.get(i, j) + sn * V.get(i, p - 1);
	                V.set(i, p - 1, -sn * V.get(i, j) + cs * V.get(i, p - 1));
	                V.set(i, j, t);
	              }
	            }
	          }
	          break;
	        }
	        case 2: {
	          let f = e[k - 1];
	          e[k - 1] = 0;
	          for (let j = k; j < p; j++) {
	            let t = hypotenuse(s[j], f);
	            let cs = s[j] / t;
	            let sn = f / t;
	            s[j] = t;
	            f = -sn * e[j];
	            e[j] = cs * e[j];
	            if (wantu) {
	              for (let i = 0; i < m; i++) {
	                t = cs * U.get(i, j) + sn * U.get(i, k - 1);
	                U.set(i, k - 1, -sn * U.get(i, j) + cs * U.get(i, k - 1));
	                U.set(i, j, t);
	              }
	            }
	          }
	          break;
	        }
	        case 3: {
	          const scale = Math.max(
	            Math.abs(s[p - 1]),
	            Math.abs(s[p - 2]),
	            Math.abs(e[p - 2]),
	            Math.abs(s[k]),
	            Math.abs(e[k]),
	          );
	          const sp = s[p - 1] / scale;
	          const spm1 = s[p - 2] / scale;
	          const epm1 = e[p - 2] / scale;
	          const sk = s[k] / scale;
	          const ek = e[k] / scale;
	          const b = ((spm1 + sp) * (spm1 - sp) + epm1 * epm1) / 2;
	          const c = sp * epm1 * (sp * epm1);
	          let shift = 0;
	          if (b !== 0 || c !== 0) {
	            if (b < 0) {
	              shift = 0 - Math.sqrt(b * b + c);
	            } else {
	              shift = Math.sqrt(b * b + c);
	            }
	            shift = c / (b + shift);
	          }
	          let f = (sk + sp) * (sk - sp) + shift;
	          let g = sk * ek;
	          for (let j = k; j < p - 1; j++) {
	            let t = hypotenuse(f, g);
	            if (t === 0) t = Number.MIN_VALUE;
	            let cs = f / t;
	            let sn = g / t;
	            if (j !== k) {
	              e[j - 1] = t;
	            }
	            f = cs * s[j] + sn * e[j];
	            e[j] = cs * e[j] - sn * s[j];
	            g = sn * s[j + 1];
	            s[j + 1] = cs * s[j + 1];
	            if (wantv) {
	              for (let i = 0; i < n; i++) {
	                t = cs * V.get(i, j) + sn * V.get(i, j + 1);
	                V.set(i, j + 1, -sn * V.get(i, j) + cs * V.get(i, j + 1));
	                V.set(i, j, t);
	              }
	            }
	            t = hypotenuse(f, g);
	            if (t === 0) t = Number.MIN_VALUE;
	            cs = f / t;
	            sn = g / t;
	            s[j] = t;
	            f = cs * e[j] + sn * s[j + 1];
	            s[j + 1] = -sn * e[j] + cs * s[j + 1];
	            g = sn * e[j + 1];
	            e[j + 1] = cs * e[j + 1];
	            if (wantu && j < m - 1) {
	              for (let i = 0; i < m; i++) {
	                t = cs * U.get(i, j) + sn * U.get(i, j + 1);
	                U.set(i, j + 1, -sn * U.get(i, j) + cs * U.get(i, j + 1));
	                U.set(i, j, t);
	              }
	            }
	          }
	          e[p - 2] = f;
	          break;
	        }
	        case 4: {
	          if (s[k] <= 0) {
	            s[k] = s[k] < 0 ? -s[k] : 0;
	            if (wantv) {
	              for (let i = 0; i <= pp; i++) {
	                V.set(i, k, -V.get(i, k));
	              }
	            }
	          }
	          while (k < pp) {
	            if (s[k] >= s[k + 1]) {
	              break;
	            }
	            let t = s[k];
	            s[k] = s[k + 1];
	            s[k + 1] = t;
	            if (wantv && k < n - 1) {
	              for (let i = 0; i < n; i++) {
	                t = V.get(i, k + 1);
	                V.set(i, k + 1, V.get(i, k));
	                V.set(i, k, t);
	              }
	            }
	            if (wantu && k < m - 1) {
	              for (let i = 0; i < m; i++) {
	                t = U.get(i, k + 1);
	                U.set(i, k + 1, U.get(i, k));
	                U.set(i, k, t);
	              }
	            }
	            k++;
	          }
	          p--;
	          break;
	        }
	        // no default
	      }
	    }

	    if (swapped) {
	      let tmp = V;
	      V = U;
	      U = tmp;
	    }

	    this.m = m;
	    this.n = n;
	    this.s = s;
	    this.U = U;
	    this.V = V;
	  }

	  solve(value) {
	    let Y = value;
	    let e = this.threshold;
	    let scols = this.s.length;
	    let Ls = Matrix$1.zeros(scols, scols);

	    for (let i = 0; i < scols; i++) {
	      if (Math.abs(this.s[i]) <= e) {
	        Ls.set(i, i, 0);
	      } else {
	        Ls.set(i, i, 1 / this.s[i]);
	      }
	    }

	    let U = this.U;
	    let V = this.rightSingularVectors;

	    let VL = V.mmul(Ls);
	    let vrows = V.rows;
	    let urows = U.rows;
	    let VLU = Matrix$1.zeros(vrows, urows);

	    for (let i = 0; i < vrows; i++) {
	      for (let j = 0; j < urows; j++) {
	        let sum = 0;
	        for (let k = 0; k < scols; k++) {
	          sum += VL.get(i, k) * U.get(j, k);
	        }
	        VLU.set(i, j, sum);
	      }
	    }

	    return VLU.mmul(Y);
	  }

	  solveForDiagonal(value) {
	    return this.solve(Matrix$1.diag(value));
	  }

	  inverse() {
	    let V = this.V;
	    let e = this.threshold;
	    let vrows = V.rows;
	    let vcols = V.columns;
	    let X = new Matrix$1(vrows, this.s.length);

	    for (let i = 0; i < vrows; i++) {
	      for (let j = 0; j < vcols; j++) {
	        if (Math.abs(this.s[j]) > e) {
	          X.set(i, j, V.get(i, j) / this.s[j]);
	        }
	      }
	    }

	    let U = this.U;

	    let urows = U.rows;
	    let ucols = U.columns;
	    let Y = new Matrix$1(vrows, urows);

	    for (let i = 0; i < vrows; i++) {
	      for (let j = 0; j < urows; j++) {
	        let sum = 0;
	        for (let k = 0; k < ucols; k++) {
	          sum += X.get(i, k) * U.get(j, k);
	        }
	        Y.set(i, j, sum);
	      }
	    }

	    return Y;
	  }

	  get condition() {
	    return this.s[0] / this.s[Math.min(this.m, this.n) - 1];
	  }

	  get norm2() {
	    return this.s[0];
	  }

	  get rank() {
	    let tol = Math.max(this.m, this.n) * this.s[0] * Number.EPSILON;
	    let r = 0;
	    let s = this.s;
	    for (let i = 0, ii = s.length; i < ii; i++) {
	      if (s[i] > tol) {
	        r++;
	      }
	    }
	    return r;
	  }

	  get diagonal() {
	    return Array.from(this.s);
	  }

	  get threshold() {
	    return (Number.EPSILON / 2) * Math.max(this.m, this.n) * this.s[0];
	  }

	  get leftSingularVectors() {
	    return this.U;
	  }

	  get rightSingularVectors() {
	    return this.V;
	  }

	  get diagonalMatrix() {
	    return Matrix$1.diag(this.s);
	  }
	}

	function inverse(matrix, useSVD = false) {
	  matrix = WrapperMatrix2D.checkMatrix(matrix);
	  if (useSVD) {
	    return new SingularValueDecomposition(matrix).inverse();
	  } else {
	    return solve(matrix, Matrix$1.eye(matrix.rows));
	  }
	}

	function solve(leftHandSide, rightHandSide, useSVD = false) {
	  leftHandSide = WrapperMatrix2D.checkMatrix(leftHandSide);
	  rightHandSide = WrapperMatrix2D.checkMatrix(rightHandSide);
	  if (useSVD) {
	    return new SingularValueDecomposition(leftHandSide).solve(rightHandSide);
	  } else {
	    return leftHandSide.isSquare()
	      ? new LuDecomposition(leftHandSide).solve(rightHandSide)
	      : new QrDecomposition(leftHandSide).solve(rightHandSide);
	  }
	}

	function determinant(matrix) {
	  matrix = Matrix$1.checkMatrix(matrix);
	  if (matrix.isSquare()) {
	    if (matrix.columns === 0) {
	      return 1;
	    }

	    let a, b, c, d;
	    if (matrix.columns === 2) {
	      // 2 x 2 matrix
	      a = matrix.get(0, 0);
	      b = matrix.get(0, 1);
	      c = matrix.get(1, 0);
	      d = matrix.get(1, 1);

	      return a * d - b * c;
	    } else if (matrix.columns === 3) {
	      // 3 x 3 matrix
	      let subMatrix0, subMatrix1, subMatrix2;
	      subMatrix0 = new MatrixSelectionView(matrix, [1, 2], [1, 2]);
	      subMatrix1 = new MatrixSelectionView(matrix, [1, 2], [0, 2]);
	      subMatrix2 = new MatrixSelectionView(matrix, [1, 2], [0, 1]);
	      a = matrix.get(0, 0);
	      b = matrix.get(0, 1);
	      c = matrix.get(0, 2);

	      return (
	        a * determinant(subMatrix0) -
	        b * determinant(subMatrix1) +
	        c * determinant(subMatrix2)
	      );
	    } else {
	      // general purpose determinant using the LU decomposition
	      return new LuDecomposition(matrix).determinant;
	    }
	  } else {
	    throw Error('determinant can only be calculated for a square matrix');
	  }
	}

	function xrange(n, exception) {
	  let range = [];
	  for (let i = 0; i < n; i++) {
	    if (i !== exception) {
	      range.push(i);
	    }
	  }
	  return range;
	}

	function dependenciesOneRow(
	  error,
	  matrix,
	  index,
	  thresholdValue = 10e-10,
	  thresholdError = 10e-10,
	) {
	  if (error > thresholdError) {
	    return new Array(matrix.rows + 1).fill(0);
	  } else {
	    let returnArray = matrix.addRow(index, [0]);
	    for (let i = 0; i < returnArray.rows; i++) {
	      if (Math.abs(returnArray.get(i, 0)) < thresholdValue) {
	        returnArray.set(i, 0, 0);
	      }
	    }
	    return returnArray.to1DArray();
	  }
	}

	function linearDependencies(matrix, options = {}) {
	  const { thresholdValue = 10e-10, thresholdError = 10e-10 } = options;
	  matrix = Matrix$1.checkMatrix(matrix);

	  let n = matrix.rows;
	  let results = new Matrix$1(n, n);

	  for (let i = 0; i < n; i++) {
	    let b = Matrix$1.columnVector(matrix.getRow(i));
	    let Abis = matrix.subMatrixRow(xrange(n, i)).transpose();
	    let svd = new SingularValueDecomposition(Abis);
	    let x = svd.solve(b);
	    let error = Matrix$1.sub(b, Abis.mmul(x)).abs().max();
	    results.setRow(
	      i,
	      dependenciesOneRow(error, x, i, thresholdValue, thresholdError),
	    );
	  }
	  return results;
	}

	function pseudoInverse(matrix, threshold = Number.EPSILON) {
	  matrix = Matrix$1.checkMatrix(matrix);
	  if (matrix.isEmpty()) {
	    // with a zero dimension, the pseudo-inverse is the transpose, since all 0xn and nx0 matrices are singular
	    // (0xn)*(nx0)*(0xn) = 0xn
	    // (nx0)*(0xn)*(nx0) = nx0
	    return matrix.transpose();
	  }
	  let svdSolution = new SingularValueDecomposition(matrix, { autoTranspose: true });

	  let U = svdSolution.leftSingularVectors;
	  let V = svdSolution.rightSingularVectors;
	  let s = svdSolution.diagonal;

	  for (let i = 0; i < s.length; i++) {
	    if (Math.abs(s[i]) > threshold) {
	      s[i] = 1.0 / s[i];
	    } else {
	      s[i] = 0.0;
	    }
	  }

	  return V.mmul(Matrix$1.diag(s).mmul(U.transpose()));
	}

	function covariance(xMatrix, yMatrix = xMatrix, options = {}) {
	  xMatrix = new Matrix$1(xMatrix);
	  let yIsSame = false;
	  if (
	    typeof yMatrix === 'object' &&
	    !Matrix$1.isMatrix(yMatrix) &&
	    !isAnyArray.isAnyArray(yMatrix)
	  ) {
	    options = yMatrix;
	    yMatrix = xMatrix;
	    yIsSame = true;
	  } else {
	    yMatrix = new Matrix$1(yMatrix);
	  }
	  if (xMatrix.rows !== yMatrix.rows) {
	    throw new TypeError('Both matrices must have the same number of rows');
	  }
	  const { center = true } = options;
	  if (center) {
	    xMatrix = xMatrix.center('column');
	    if (!yIsSame) {
	      yMatrix = yMatrix.center('column');
	    }
	  }
	  const cov = xMatrix.transpose().mmul(yMatrix);
	  for (let i = 0; i < cov.rows; i++) {
	    for (let j = 0; j < cov.columns; j++) {
	      cov.set(i, j, cov.get(i, j) * (1 / (xMatrix.rows - 1)));
	    }
	  }
	  return cov;
	}

	function correlation(xMatrix, yMatrix = xMatrix, options = {}) {
	  xMatrix = new Matrix$1(xMatrix);
	  let yIsSame = false;
	  if (
	    typeof yMatrix === 'object' &&
	    !Matrix$1.isMatrix(yMatrix) &&
	    !isAnyArray.isAnyArray(yMatrix)
	  ) {
	    options = yMatrix;
	    yMatrix = xMatrix;
	    yIsSame = true;
	  } else {
	    yMatrix = new Matrix$1(yMatrix);
	  }
	  if (xMatrix.rows !== yMatrix.rows) {
	    throw new TypeError('Both matrices must have the same number of rows');
	  }

	  const { center = true, scale = true } = options;
	  if (center) {
	    xMatrix.center('column');
	    if (!yIsSame) {
	      yMatrix.center('column');
	    }
	  }
	  if (scale) {
	    xMatrix.scale('column');
	    if (!yIsSame) {
	      yMatrix.scale('column');
	    }
	  }

	  const sdx = xMatrix.standardDeviation('column', { unbiased: true });
	  const sdy = yIsSame
	    ? sdx
	    : yMatrix.standardDeviation('column', { unbiased: true });

	  const corr = xMatrix.transpose().mmul(yMatrix);
	  for (let i = 0; i < corr.rows; i++) {
	    for (let j = 0; j < corr.columns; j++) {
	      corr.set(
	        i,
	        j,
	        corr.get(i, j) * (1 / (sdx[i] * sdy[j])) * (1 / (xMatrix.rows - 1)),
	      );
	    }
	  }
	  return corr;
	}

	class EigenvalueDecomposition {
	  constructor(matrix, options = {}) {
	    const { assumeSymmetric = false } = options;

	    matrix = WrapperMatrix2D.checkMatrix(matrix);
	    if (!matrix.isSquare()) {
	      throw new Error('Matrix is not a square matrix');
	    }

	    if (matrix.isEmpty()) {
	      throw new Error('Matrix must be non-empty');
	    }

	    let n = matrix.columns;
	    let V = new Matrix$1(n, n);
	    let d = new Float64Array(n);
	    let e = new Float64Array(n);
	    let value = matrix;
	    let i, j;

	    let isSymmetric = false;
	    if (assumeSymmetric) {
	      isSymmetric = true;
	    } else {
	      isSymmetric = matrix.isSymmetric();
	    }

	    if (isSymmetric) {
	      for (i = 0; i < n; i++) {
	        for (j = 0; j < n; j++) {
	          V.set(i, j, value.get(i, j));
	        }
	      }
	      tred2(n, e, d, V);
	      tql2(n, e, d, V);
	    } else {
	      let H = new Matrix$1(n, n);
	      let ort = new Float64Array(n);
	      for (j = 0; j < n; j++) {
	        for (i = 0; i < n; i++) {
	          H.set(i, j, value.get(i, j));
	        }
	      }
	      orthes(n, H, ort, V);
	      hqr2(n, e, d, V, H);
	    }

	    this.n = n;
	    this.e = e;
	    this.d = d;
	    this.V = V;
	  }

	  get realEigenvalues() {
	    return Array.from(this.d);
	  }

	  get imaginaryEigenvalues() {
	    return Array.from(this.e);
	  }

	  get eigenvectorMatrix() {
	    return this.V;
	  }

	  get diagonalMatrix() {
	    let n = this.n;
	    let e = this.e;
	    let d = this.d;
	    let X = new Matrix$1(n, n);
	    let i, j;
	    for (i = 0; i < n; i++) {
	      for (j = 0; j < n; j++) {
	        X.set(i, j, 0);
	      }
	      X.set(i, i, d[i]);
	      if (e[i] > 0) {
	        X.set(i, i + 1, e[i]);
	      } else if (e[i] < 0) {
	        X.set(i, i - 1, e[i]);
	      }
	    }
	    return X;
	  }
	}

	function tred2(n, e, d, V) {
	  let f, g, h, i, j, k, hh, scale;

	  for (j = 0; j < n; j++) {
	    d[j] = V.get(n - 1, j);
	  }

	  for (i = n - 1; i > 0; i--) {
	    scale = 0;
	    h = 0;
	    for (k = 0; k < i; k++) {
	      scale = scale + Math.abs(d[k]);
	    }

	    if (scale === 0) {
	      e[i] = d[i - 1];
	      for (j = 0; j < i; j++) {
	        d[j] = V.get(i - 1, j);
	        V.set(i, j, 0);
	        V.set(j, i, 0);
	      }
	    } else {
	      for (k = 0; k < i; k++) {
	        d[k] /= scale;
	        h += d[k] * d[k];
	      }

	      f = d[i - 1];
	      g = Math.sqrt(h);
	      if (f > 0) {
	        g = -g;
	      }

	      e[i] = scale * g;
	      h = h - f * g;
	      d[i - 1] = f - g;
	      for (j = 0; j < i; j++) {
	        e[j] = 0;
	      }

	      for (j = 0; j < i; j++) {
	        f = d[j];
	        V.set(j, i, f);
	        g = e[j] + V.get(j, j) * f;
	        for (k = j + 1; k <= i - 1; k++) {
	          g += V.get(k, j) * d[k];
	          e[k] += V.get(k, j) * f;
	        }
	        e[j] = g;
	      }

	      f = 0;
	      for (j = 0; j < i; j++) {
	        e[j] /= h;
	        f += e[j] * d[j];
	      }

	      hh = f / (h + h);
	      for (j = 0; j < i; j++) {
	        e[j] -= hh * d[j];
	      }

	      for (j = 0; j < i; j++) {
	        f = d[j];
	        g = e[j];
	        for (k = j; k <= i - 1; k++) {
	          V.set(k, j, V.get(k, j) - (f * e[k] + g * d[k]));
	        }
	        d[j] = V.get(i - 1, j);
	        V.set(i, j, 0);
	      }
	    }
	    d[i] = h;
	  }

	  for (i = 0; i < n - 1; i++) {
	    V.set(n - 1, i, V.get(i, i));
	    V.set(i, i, 1);
	    h = d[i + 1];
	    if (h !== 0) {
	      for (k = 0; k <= i; k++) {
	        d[k] = V.get(k, i + 1) / h;
	      }

	      for (j = 0; j <= i; j++) {
	        g = 0;
	        for (k = 0; k <= i; k++) {
	          g += V.get(k, i + 1) * V.get(k, j);
	        }
	        for (k = 0; k <= i; k++) {
	          V.set(k, j, V.get(k, j) - g * d[k]);
	        }
	      }
	    }

	    for (k = 0; k <= i; k++) {
	      V.set(k, i + 1, 0);
	    }
	  }

	  for (j = 0; j < n; j++) {
	    d[j] = V.get(n - 1, j);
	    V.set(n - 1, j, 0);
	  }

	  V.set(n - 1, n - 1, 1);
	  e[0] = 0;
	}

	function tql2(n, e, d, V) {
	  let g, h, i, j, k, l, m, p, r, dl1, c, c2, c3, el1, s, s2;

	  for (i = 1; i < n; i++) {
	    e[i - 1] = e[i];
	  }

	  e[n - 1] = 0;

	  let f = 0;
	  let tst1 = 0;
	  let eps = Number.EPSILON;

	  for (l = 0; l < n; l++) {
	    tst1 = Math.max(tst1, Math.abs(d[l]) + Math.abs(e[l]));
	    m = l;
	    while (m < n) {
	      if (Math.abs(e[m]) <= eps * tst1) {
	        break;
	      }
	      m++;
	    }

	    if (m > l) {
	      do {

	        g = d[l];
	        p = (d[l + 1] - g) / (2 * e[l]);
	        r = hypotenuse(p, 1);
	        if (p < 0) {
	          r = -r;
	        }

	        d[l] = e[l] / (p + r);
	        d[l + 1] = e[l] * (p + r);
	        dl1 = d[l + 1];
	        h = g - d[l];
	        for (i = l + 2; i < n; i++) {
	          d[i] -= h;
	        }

	        f = f + h;

	        p = d[m];
	        c = 1;
	        c2 = c;
	        c3 = c;
	        el1 = e[l + 1];
	        s = 0;
	        s2 = 0;
	        for (i = m - 1; i >= l; i--) {
	          c3 = c2;
	          c2 = c;
	          s2 = s;
	          g = c * e[i];
	          h = c * p;
	          r = hypotenuse(p, e[i]);
	          e[i + 1] = s * r;
	          s = e[i] / r;
	          c = p / r;
	          p = c * d[i] - s * g;
	          d[i + 1] = h + s * (c * g + s * d[i]);

	          for (k = 0; k < n; k++) {
	            h = V.get(k, i + 1);
	            V.set(k, i + 1, s * V.get(k, i) + c * h);
	            V.set(k, i, c * V.get(k, i) - s * h);
	          }
	        }

	        p = (-s * s2 * c3 * el1 * e[l]) / dl1;
	        e[l] = s * p;
	        d[l] = c * p;
	      } while (Math.abs(e[l]) > eps * tst1);
	    }
	    d[l] = d[l] + f;
	    e[l] = 0;
	  }

	  for (i = 0; i < n - 1; i++) {
	    k = i;
	    p = d[i];
	    for (j = i + 1; j < n; j++) {
	      if (d[j] < p) {
	        k = j;
	        p = d[j];
	      }
	    }

	    if (k !== i) {
	      d[k] = d[i];
	      d[i] = p;
	      for (j = 0; j < n; j++) {
	        p = V.get(j, i);
	        V.set(j, i, V.get(j, k));
	        V.set(j, k, p);
	      }
	    }
	  }
	}

	function orthes(n, H, ort, V) {
	  let low = 0;
	  let high = n - 1;
	  let f, g, h, i, j, m;
	  let scale;

	  for (m = low + 1; m <= high - 1; m++) {
	    scale = 0;
	    for (i = m; i <= high; i++) {
	      scale = scale + Math.abs(H.get(i, m - 1));
	    }

	    if (scale !== 0) {
	      h = 0;
	      for (i = high; i >= m; i--) {
	        ort[i] = H.get(i, m - 1) / scale;
	        h += ort[i] * ort[i];
	      }

	      g = Math.sqrt(h);
	      if (ort[m] > 0) {
	        g = -g;
	      }

	      h = h - ort[m] * g;
	      ort[m] = ort[m] - g;

	      for (j = m; j < n; j++) {
	        f = 0;
	        for (i = high; i >= m; i--) {
	          f += ort[i] * H.get(i, j);
	        }

	        f = f / h;
	        for (i = m; i <= high; i++) {
	          H.set(i, j, H.get(i, j) - f * ort[i]);
	        }
	      }

	      for (i = 0; i <= high; i++) {
	        f = 0;
	        for (j = high; j >= m; j--) {
	          f += ort[j] * H.get(i, j);
	        }

	        f = f / h;
	        for (j = m; j <= high; j++) {
	          H.set(i, j, H.get(i, j) - f * ort[j]);
	        }
	      }

	      ort[m] = scale * ort[m];
	      H.set(m, m - 1, scale * g);
	    }
	  }

	  for (i = 0; i < n; i++) {
	    for (j = 0; j < n; j++) {
	      V.set(i, j, i === j ? 1 : 0);
	    }
	  }

	  for (m = high - 1; m >= low + 1; m--) {
	    if (H.get(m, m - 1) !== 0) {
	      for (i = m + 1; i <= high; i++) {
	        ort[i] = H.get(i, m - 1);
	      }

	      for (j = m; j <= high; j++) {
	        g = 0;
	        for (i = m; i <= high; i++) {
	          g += ort[i] * V.get(i, j);
	        }

	        g = g / ort[m] / H.get(m, m - 1);
	        for (i = m; i <= high; i++) {
	          V.set(i, j, V.get(i, j) + g * ort[i]);
	        }
	      }
	    }
	  }
	}

	function hqr2(nn, e, d, V, H) {
	  let n = nn - 1;
	  let low = 0;
	  let high = nn - 1;
	  let eps = Number.EPSILON;
	  let exshift = 0;
	  let norm = 0;
	  let p = 0;
	  let q = 0;
	  let r = 0;
	  let s = 0;
	  let z = 0;
	  let iter = 0;
	  let i, j, k, l, m, t, w, x, y;
	  let ra, sa, vr, vi;
	  let notlast, cdivres;

	  for (i = 0; i < nn; i++) {
	    if (i < low || i > high) {
	      d[i] = H.get(i, i);
	      e[i] = 0;
	    }

	    for (j = Math.max(i - 1, 0); j < nn; j++) {
	      norm = norm + Math.abs(H.get(i, j));
	    }
	  }

	  while (n >= low) {
	    l = n;
	    while (l > low) {
	      s = Math.abs(H.get(l - 1, l - 1)) + Math.abs(H.get(l, l));
	      if (s === 0) {
	        s = norm;
	      }
	      if (Math.abs(H.get(l, l - 1)) < eps * s) {
	        break;
	      }
	      l--;
	    }

	    if (l === n) {
	      H.set(n, n, H.get(n, n) + exshift);
	      d[n] = H.get(n, n);
	      e[n] = 0;
	      n--;
	      iter = 0;
	    } else if (l === n - 1) {
	      w = H.get(n, n - 1) * H.get(n - 1, n);
	      p = (H.get(n - 1, n - 1) - H.get(n, n)) / 2;
	      q = p * p + w;
	      z = Math.sqrt(Math.abs(q));
	      H.set(n, n, H.get(n, n) + exshift);
	      H.set(n - 1, n - 1, H.get(n - 1, n - 1) + exshift);
	      x = H.get(n, n);

	      if (q >= 0) {
	        z = p >= 0 ? p + z : p - z;
	        d[n - 1] = x + z;
	        d[n] = d[n - 1];
	        if (z !== 0) {
	          d[n] = x - w / z;
	        }
	        e[n - 1] = 0;
	        e[n] = 0;
	        x = H.get(n, n - 1);
	        s = Math.abs(x) + Math.abs(z);
	        p = x / s;
	        q = z / s;
	        r = Math.sqrt(p * p + q * q);
	        p = p / r;
	        q = q / r;

	        for (j = n - 1; j < nn; j++) {
	          z = H.get(n - 1, j);
	          H.set(n - 1, j, q * z + p * H.get(n, j));
	          H.set(n, j, q * H.get(n, j) - p * z);
	        }

	        for (i = 0; i <= n; i++) {
	          z = H.get(i, n - 1);
	          H.set(i, n - 1, q * z + p * H.get(i, n));
	          H.set(i, n, q * H.get(i, n) - p * z);
	        }

	        for (i = low; i <= high; i++) {
	          z = V.get(i, n - 1);
	          V.set(i, n - 1, q * z + p * V.get(i, n));
	          V.set(i, n, q * V.get(i, n) - p * z);
	        }
	      } else {
	        d[n - 1] = x + p;
	        d[n] = x + p;
	        e[n - 1] = z;
	        e[n] = -z;
	      }

	      n = n - 2;
	      iter = 0;
	    } else {
	      x = H.get(n, n);
	      y = 0;
	      w = 0;
	      if (l < n) {
	        y = H.get(n - 1, n - 1);
	        w = H.get(n, n - 1) * H.get(n - 1, n);
	      }

	      if (iter === 10) {
	        exshift += x;
	        for (i = low; i <= n; i++) {
	          H.set(i, i, H.get(i, i) - x);
	        }
	        s = Math.abs(H.get(n, n - 1)) + Math.abs(H.get(n - 1, n - 2));
	        // eslint-disable-next-line no-multi-assign
	        x = y = 0.75 * s;
	        w = -0.4375 * s * s;
	      }

	      if (iter === 30) {
	        s = (y - x) / 2;
	        s = s * s + w;
	        if (s > 0) {
	          s = Math.sqrt(s);
	          if (y < x) {
	            s = -s;
	          }
	          s = x - w / ((y - x) / 2 + s);
	          for (i = low; i <= n; i++) {
	            H.set(i, i, H.get(i, i) - s);
	          }
	          exshift += s;
	          // eslint-disable-next-line no-multi-assign
	          x = y = w = 0.964;
	        }
	      }

	      iter = iter + 1;

	      m = n - 2;
	      while (m >= l) {
	        z = H.get(m, m);
	        r = x - z;
	        s = y - z;
	        p = (r * s - w) / H.get(m + 1, m) + H.get(m, m + 1);
	        q = H.get(m + 1, m + 1) - z - r - s;
	        r = H.get(m + 2, m + 1);
	        s = Math.abs(p) + Math.abs(q) + Math.abs(r);
	        p = p / s;
	        q = q / s;
	        r = r / s;
	        if (m === l) {
	          break;
	        }
	        if (
	          Math.abs(H.get(m, m - 1)) * (Math.abs(q) + Math.abs(r)) <
	          eps *
	            (Math.abs(p) *
	              (Math.abs(H.get(m - 1, m - 1)) +
	                Math.abs(z) +
	                Math.abs(H.get(m + 1, m + 1))))
	        ) {
	          break;
	        }
	        m--;
	      }

	      for (i = m + 2; i <= n; i++) {
	        H.set(i, i - 2, 0);
	        if (i > m + 2) {
	          H.set(i, i - 3, 0);
	        }
	      }

	      for (k = m; k <= n - 1; k++) {
	        notlast = k !== n - 1;
	        if (k !== m) {
	          p = H.get(k, k - 1);
	          q = H.get(k + 1, k - 1);
	          r = notlast ? H.get(k + 2, k - 1) : 0;
	          x = Math.abs(p) + Math.abs(q) + Math.abs(r);
	          if (x !== 0) {
	            p = p / x;
	            q = q / x;
	            r = r / x;
	          }
	        }

	        if (x === 0) {
	          break;
	        }

	        s = Math.sqrt(p * p + q * q + r * r);
	        if (p < 0) {
	          s = -s;
	        }

	        if (s !== 0) {
	          if (k !== m) {
	            H.set(k, k - 1, -s * x);
	          } else if (l !== m) {
	            H.set(k, k - 1, -H.get(k, k - 1));
	          }

	          p = p + s;
	          x = p / s;
	          y = q / s;
	          z = r / s;
	          q = q / p;
	          r = r / p;

	          for (j = k; j < nn; j++) {
	            p = H.get(k, j) + q * H.get(k + 1, j);
	            if (notlast) {
	              p = p + r * H.get(k + 2, j);
	              H.set(k + 2, j, H.get(k + 2, j) - p * z);
	            }

	            H.set(k, j, H.get(k, j) - p * x);
	            H.set(k + 1, j, H.get(k + 1, j) - p * y);
	          }

	          for (i = 0; i <= Math.min(n, k + 3); i++) {
	            p = x * H.get(i, k) + y * H.get(i, k + 1);
	            if (notlast) {
	              p = p + z * H.get(i, k + 2);
	              H.set(i, k + 2, H.get(i, k + 2) - p * r);
	            }

	            H.set(i, k, H.get(i, k) - p);
	            H.set(i, k + 1, H.get(i, k + 1) - p * q);
	          }

	          for (i = low; i <= high; i++) {
	            p = x * V.get(i, k) + y * V.get(i, k + 1);
	            if (notlast) {
	              p = p + z * V.get(i, k + 2);
	              V.set(i, k + 2, V.get(i, k + 2) - p * r);
	            }

	            V.set(i, k, V.get(i, k) - p);
	            V.set(i, k + 1, V.get(i, k + 1) - p * q);
	          }
	        }
	      }
	    }
	  }

	  if (norm === 0) {
	    return;
	  }

	  for (n = nn - 1; n >= 0; n--) {
	    p = d[n];
	    q = e[n];

	    if (q === 0) {
	      l = n;
	      H.set(n, n, 1);
	      for (i = n - 1; i >= 0; i--) {
	        w = H.get(i, i) - p;
	        r = 0;
	        for (j = l; j <= n; j++) {
	          r = r + H.get(i, j) * H.get(j, n);
	        }

	        if (e[i] < 0) {
	          z = w;
	          s = r;
	        } else {
	          l = i;
	          if (e[i] === 0) {
	            H.set(i, n, w !== 0 ? -r / w : -r / (eps * norm));
	          } else {
	            x = H.get(i, i + 1);
	            y = H.get(i + 1, i);
	            q = (d[i] - p) * (d[i] - p) + e[i] * e[i];
	            t = (x * s - z * r) / q;
	            H.set(i, n, t);
	            H.set(
	              i + 1,
	              n,
	              Math.abs(x) > Math.abs(z) ? (-r - w * t) / x : (-s - y * t) / z,
	            );
	          }

	          t = Math.abs(H.get(i, n));
	          if (eps * t * t > 1) {
	            for (j = i; j <= n; j++) {
	              H.set(j, n, H.get(j, n) / t);
	            }
	          }
	        }
	      }
	    } else if (q < 0) {
	      l = n - 1;

	      if (Math.abs(H.get(n, n - 1)) > Math.abs(H.get(n - 1, n))) {
	        H.set(n - 1, n - 1, q / H.get(n, n - 1));
	        H.set(n - 1, n, -(H.get(n, n) - p) / H.get(n, n - 1));
	      } else {
	        cdivres = cdiv(0, -H.get(n - 1, n), H.get(n - 1, n - 1) - p, q);
	        H.set(n - 1, n - 1, cdivres[0]);
	        H.set(n - 1, n, cdivres[1]);
	      }

	      H.set(n, n - 1, 0);
	      H.set(n, n, 1);
	      for (i = n - 2; i >= 0; i--) {
	        ra = 0;
	        sa = 0;
	        for (j = l; j <= n; j++) {
	          ra = ra + H.get(i, j) * H.get(j, n - 1);
	          sa = sa + H.get(i, j) * H.get(j, n);
	        }

	        w = H.get(i, i) - p;

	        if (e[i] < 0) {
	          z = w;
	          r = ra;
	          s = sa;
	        } else {
	          l = i;
	          if (e[i] === 0) {
	            cdivres = cdiv(-ra, -sa, w, q);
	            H.set(i, n - 1, cdivres[0]);
	            H.set(i, n, cdivres[1]);
	          } else {
	            x = H.get(i, i + 1);
	            y = H.get(i + 1, i);
	            vr = (d[i] - p) * (d[i] - p) + e[i] * e[i] - q * q;
	            vi = (d[i] - p) * 2 * q;
	            if (vr === 0 && vi === 0) {
	              vr =
	                eps *
	                norm *
	                (Math.abs(w) +
	                  Math.abs(q) +
	                  Math.abs(x) +
	                  Math.abs(y) +
	                  Math.abs(z));
	            }
	            cdivres = cdiv(
	              x * r - z * ra + q * sa,
	              x * s - z * sa - q * ra,
	              vr,
	              vi,
	            );
	            H.set(i, n - 1, cdivres[0]);
	            H.set(i, n, cdivres[1]);
	            if (Math.abs(x) > Math.abs(z) + Math.abs(q)) {
	              H.set(
	                i + 1,
	                n - 1,
	                (-ra - w * H.get(i, n - 1) + q * H.get(i, n)) / x,
	              );
	              H.set(
	                i + 1,
	                n,
	                (-sa - w * H.get(i, n) - q * H.get(i, n - 1)) / x,
	              );
	            } else {
	              cdivres = cdiv(
	                -r - y * H.get(i, n - 1),
	                -s - y * H.get(i, n),
	                z,
	                q,
	              );
	              H.set(i + 1, n - 1, cdivres[0]);
	              H.set(i + 1, n, cdivres[1]);
	            }
	          }

	          t = Math.max(Math.abs(H.get(i, n - 1)), Math.abs(H.get(i, n)));
	          if (eps * t * t > 1) {
	            for (j = i; j <= n; j++) {
	              H.set(j, n - 1, H.get(j, n - 1) / t);
	              H.set(j, n, H.get(j, n) / t);
	            }
	          }
	        }
	      }
	    }
	  }

	  for (i = 0; i < nn; i++) {
	    if (i < low || i > high) {
	      for (j = i; j < nn; j++) {
	        V.set(i, j, H.get(i, j));
	      }
	    }
	  }

	  for (j = nn - 1; j >= low; j--) {
	    for (i = low; i <= high; i++) {
	      z = 0;
	      for (k = low; k <= Math.min(j, high); k++) {
	        z = z + V.get(i, k) * H.get(k, j);
	      }
	      V.set(i, j, z);
	    }
	  }
	}

	function cdiv(xr, xi, yr, yi) {
	  let r, d;
	  if (Math.abs(yr) > Math.abs(yi)) {
	    r = yi / yr;
	    d = yr + r * yi;
	    return [(xr + r * xi) / d, (xi - r * xr) / d];
	  } else {
	    r = yr / yi;
	    d = yi + r * yr;
	    return [(r * xr + xi) / d, (r * xi - xr) / d];
	  }
	}

	class CholeskyDecomposition {
	  constructor(value) {
	    value = WrapperMatrix2D.checkMatrix(value);
	    if (!value.isSymmetric()) {
	      throw new Error('Matrix is not symmetric');
	    }

	    let a = value;
	    let dimension = a.rows;
	    let l = new Matrix$1(dimension, dimension);
	    let positiveDefinite = true;
	    let i, j, k;

	    for (j = 0; j < dimension; j++) {
	      let d = 0;
	      for (k = 0; k < j; k++) {
	        let s = 0;
	        for (i = 0; i < k; i++) {
	          s += l.get(k, i) * l.get(j, i);
	        }
	        s = (a.get(j, k) - s) / l.get(k, k);
	        l.set(j, k, s);
	        d = d + s * s;
	      }

	      d = a.get(j, j) - d;

	      positiveDefinite &&= d > 0;
	      l.set(j, j, Math.sqrt(Math.max(d, 0)));
	      for (k = j + 1; k < dimension; k++) {
	        l.set(j, k, 0);
	      }
	    }

	    this.L = l;
	    this.positiveDefinite = positiveDefinite;
	  }

	  isPositiveDefinite() {
	    return this.positiveDefinite;
	  }

	  solve(value) {
	    value = WrapperMatrix2D.checkMatrix(value);

	    let l = this.L;
	    let dimension = l.rows;

	    if (value.rows !== dimension) {
	      throw new Error('Matrix dimensions do not match');
	    }
	    if (this.isPositiveDefinite() === false) {
	      throw new Error('Matrix is not positive definite');
	    }

	    let count = value.columns;
	    let B = value.clone();
	    let i, j, k;

	    for (k = 0; k < dimension; k++) {
	      for (j = 0; j < count; j++) {
	        for (i = 0; i < k; i++) {
	          B.set(k, j, B.get(k, j) - B.get(i, j) * l.get(k, i));
	        }
	        B.set(k, j, B.get(k, j) / l.get(k, k));
	      }
	    }

	    for (k = dimension - 1; k >= 0; k--) {
	      for (j = 0; j < count; j++) {
	        for (i = k + 1; i < dimension; i++) {
	          B.set(k, j, B.get(k, j) - B.get(i, j) * l.get(i, k));
	        }
	        B.set(k, j, B.get(k, j) / l.get(k, k));
	      }
	    }

	    return B;
	  }

	  get lowerTriangularMatrix() {
	    return this.L;
	  }
	}

	class nipals {
	  constructor(X, options = {}) {
	    X = WrapperMatrix2D.checkMatrix(X);
	    let { Y } = options;
	    const {
	      scaleScores = false,
	      maxIterations = 1000,
	      terminationCriteria = 1e-10,
	    } = options;

	    let u;
	    if (Y) {
	      if (isAnyArray.isAnyArray(Y) && typeof Y[0] === 'number') {
	        Y = Matrix$1.columnVector(Y);
	      } else {
	        Y = WrapperMatrix2D.checkMatrix(Y);
	      }
	      if (Y.rows !== X.rows) {
	        throw new Error('Y should have the same number of rows as X');
	      }
	      u = Y.getColumnVector(0);
	    } else {
	      u = X.getColumnVector(0);
	    }

	    let diff = 1;
	    let t, q, w, tOld;

	    for (
	      let counter = 0;
	      counter < maxIterations && diff > terminationCriteria;
	      counter++
	    ) {
	      w = X.transpose().mmul(u).div(u.transpose().mmul(u).get(0, 0));
	      w = w.div(w.norm());

	      t = X.mmul(w).div(w.transpose().mmul(w).get(0, 0));

	      if (counter > 0) {
	        diff = t.clone().sub(tOld).pow(2).sum();
	      }
	      tOld = t.clone();

	      if (Y) {
	        q = Y.transpose().mmul(t).div(t.transpose().mmul(t).get(0, 0));
	        q = q.div(q.norm());

	        u = Y.mmul(q).div(q.transpose().mmul(q).get(0, 0));
	      } else {
	        u = t;
	      }
	    }

	    if (Y) {
	      let p = X.transpose().mmul(t).div(t.transpose().mmul(t).get(0, 0));
	      p = p.div(p.norm());
	      let xResidual = X.clone().sub(t.clone().mmul(p.transpose()));
	      let residual = u.transpose().mmul(t).div(t.transpose().mmul(t).get(0, 0));
	      let yResidual = Y.clone().sub(
	        t.clone().mulS(residual.get(0, 0)).mmul(q.transpose()),
	      );

	      this.t = t;
	      this.p = p.transpose();
	      this.w = w.transpose();
	      this.q = q;
	      this.u = u;
	      this.s = t.transpose().mmul(t);
	      this.xResidual = xResidual;
	      this.yResidual = yResidual;
	      this.betas = residual;
	    } else {
	      this.w = w.transpose();
	      this.s = t.transpose().mmul(t).sqrt();
	      if (scaleScores) {
	        this.t = t.clone().div(this.s.get(0, 0));
	      } else {
	        this.t = t;
	      }
	      this.xResidual = X.sub(t.mmul(w.transpose()));
	    }
	  }
	}

	matrix.AbstractMatrix = AbstractMatrix;
	matrix.CHO = CholeskyDecomposition;
	matrix.CholeskyDecomposition = CholeskyDecomposition;
	matrix.DistanceMatrix = DistanceMatrix;
	matrix.EVD = EigenvalueDecomposition;
	matrix.EigenvalueDecomposition = EigenvalueDecomposition;
	matrix.LU = LuDecomposition;
	matrix.LuDecomposition = LuDecomposition;
	var Matrix_1 = matrix.Matrix = Matrix$1;
	matrix.MatrixColumnSelectionView = MatrixColumnSelectionView;
	matrix.MatrixColumnView = MatrixColumnView;
	matrix.MatrixFlipColumnView = MatrixFlipColumnView;
	matrix.MatrixFlipRowView = MatrixFlipRowView;
	matrix.MatrixRowSelectionView = MatrixRowSelectionView;
	matrix.MatrixRowView = MatrixRowView;
	matrix.MatrixSelectionView = MatrixSelectionView;
	matrix.MatrixSubView = MatrixSubView;
	matrix.MatrixTransposeView = MatrixTransposeView;
	matrix.NIPALS = nipals;
	matrix.Nipals = nipals;
	matrix.QR = QrDecomposition;
	matrix.QrDecomposition = QrDecomposition;
	matrix.SVD = SingularValueDecomposition;
	matrix.SingularValueDecomposition = SingularValueDecomposition;
	matrix.SymmetricMatrix = SymmetricMatrix;
	matrix.WrapperMatrix1D = WrapperMatrix1D;
	matrix.WrapperMatrix2D = WrapperMatrix2D;
	matrix.correlation = correlation;
	matrix.covariance = covariance;
	var _default = matrix.default = Matrix$1;
	matrix.determinant = determinant;
	matrix.inverse = inverse;
	matrix.linearDependencies = linearDependencies;
	matrix.pseudoInverse = pseudoInverse;
	matrix.solve = solve;
	matrix.wrap = wrap;

	const Matrix = Matrix_1;
	_default.Matrix ? _default.Matrix : Matrix_1;

	var version = "4.0.0";

	console.log(`Psychophysics Version ${version}`);
	if (typeof PIXI__namespace.VERSION !== "undefined") {
	  console.log(`PixiJS Version ${PIXI__namespace.VERSION}`);
	}
	const info = {
	  name: "psychophysics",
	  version,
	  description: "A plugin for conducting online/Web-based psychophysical experiments",
	  parameters: {
	    stimuli: {
	      type: jspsych.ParameterType.COMPLEX,
	      // This is similar to the quesions of the survey-likert.
	      array: true,
	      pretty_name: "Stimuli",
	      description: "The objects will be presented in the canvas.",
	      nested: {
	        startX: {
	          type: jspsych.ParameterType.STRING,
	          pretty_name: "startX",
	          default: "center",
	          description: "The horizontal start position."
	        },
	        startY: {
	          type: jspsych.ParameterType.STRING,
	          pretty_name: "startY",
	          default: "center",
	          description: "The vertical start position."
	        },
	        endX: {
	          type: jspsych.ParameterType.STRING,
	          pretty_name: "endX",
	          default: null,
	          description: "The horizontal end position."
	        },
	        endY: {
	          type: jspsych.ParameterType.STRING,
	          pretty_name: "endY",
	          default: null,
	          description: "The vertical end position."
	        },
	        show_start_time: {
	          type: jspsych.ParameterType.INT,
	          pretty_name: "Show start time",
	          default: 0,
	          description: "Time to start presenting the stimuli"
	        },
	        show_end_time: {
	          type: jspsych.ParameterType.INT,
	          pretty_name: "Show end time",
	          default: null,
	          description: "Time to end presenting the stimuli"
	        },
	        show_start_frame: {
	          type: jspsych.ParameterType.INT,
	          pretty_name: "Show start frame",
	          default: 0,
	          description: "Time to start presenting the stimuli in frames"
	        },
	        show_end_frame: {
	          type: jspsych.ParameterType.INT,
	          pretty_name: "Show end frame",
	          default: null,
	          description: "Time to end presenting the stimuli in frames"
	        },
	        line_width: {
	          type: jspsych.ParameterType.INT,
	          pretty_name: "Line width",
	          default: 1,
	          description: "The line width"
	        },
	        lineJoin: {
	          type: jspsych.ParameterType.STRING,
	          pretty_name: "lineJoin",
	          default: "miter",
	          description: "The type of the corner when two lines meet."
	        },
	        miterLimit: {
	          type: jspsych.ParameterType.INT,
	          pretty_name: "miterLimit",
	          default: 10,
	          description: "The maximum miter length."
	        },
	        drawFunc: {
	          // e.g., call-function
	          type: jspsych.ParameterType.FUNCTION,
	          pretty_name: "Draw function",
	          default: null,
	          description: "This function enables to move objects horizontally and vertically."
	        },
	        change_attr: {
	          type: jspsych.ParameterType.FUNCTION,
	          pretty_name: "Change attributes",
	          default: null,
	          description: "This function enables to change attributes of objects immediately before drawing."
	        },
	        is_frame: {
	          type: jspsych.ParameterType.BOOL,
	          pretty_name: "time is in frames",
	          default: false,
	          description: "If true, time is treated in frames."
	        },
	        prepared: {
	          type: jspsych.ParameterType.BOOL,
	          pretty_name: "Stimulus prepared flag",
	          default: false,
	          description: "If true, the stimulus is prepared for presentation"
	        },
	        origin_center: {
	          type: jspsych.ParameterType.BOOL,
	          pretty_name: "origin_center",
	          default: false,
	          description: "The origin is the center of the window."
	        },
	        is_presented: {
	          type: jspsych.ParameterType.BOOL,
	          pretty_name: "is_presented",
	          default: false,
	          description: "This will be true when the stimulus is presented."
	        },
	        trial_ends_after_audio: {
	          type: jspsych.ParameterType.BOOL,
	          pretty_name: "Trial ends after audio",
	          default: false,
	          description: "If true, then the trial will end as soon as the audio file finishes playing."
	        },
	        modulate_color: {
	          type: jspsych.ParameterType.FLOAT,
	          array: true,
	          pretty_name: "modulate_color",
	          default: [1, 1, 1, 1],
	          description: "The base RGBA array of the gabor patch."
	        },
	        offset_color: {
	          type: jspsych.ParameterType.FLOAT,
	          array: true,
	          pretty_name: "offset_color",
	          default: [0.5, 0.5, 0.5, 0],
	          description: "The offset RGBA array of the gabor patch."
	        },
	        min_validModulationRange: {
	          type: jspsych.ParameterType.FLOAT,
	          pretty_name: "min_validModulationRange",
	          default: -2,
	          description: "The minimum of the validation range of the gabor patch."
	        },
	        max_validModulationRange: {
	          type: jspsych.ParameterType.FLOAT,
	          pretty_name: "max_validModulationRange",
	          default: 2,
	          description: "The maximum of the validation range of the gabor patch."
	        },
	        tilt: {
	          type: jspsych.ParameterType.FLOAT,
	          pretty_name: "tilt",
	          default: 0,
	          description: "The angle of the gabor patch in degrees."
	        },
	        sf: {
	          type: jspsych.ParameterType.FLOAT,
	          pretty_name: "spatial frequency",
	          default: 0.05,
	          description: "The spatial frequency of the gabor patch."
	        },
	        phase: {
	          type: jspsych.ParameterType.FLOAT,
	          pretty_name: "phase",
	          default: 0,
	          description: "The phase (degrees) of the gabor patch."
	        },
	        sc: {
	          type: jspsych.ParameterType.FLOAT,
	          pretty_name: "standard deviation",
	          default: 20,
	          description: "The standard deviation of the distribution."
	        },
	        contrast: {
	          type: jspsych.ParameterType.FLOAT,
	          pretty_name: "contrast",
	          default: 20,
	          description: "The contrast of the gabor patch."
	        },
	        contrastPreMultiplicator: {
	          type: jspsych.ParameterType.FLOAT,
	          pretty_name: "contrastPreMultiplicator",
	          default: 1,
	          description: "A scaling factor"
	        },
	        drift: {
	          type: jspsych.ParameterType.FLOAT,
	          pretty_name: "drift",
	          default: 0,
	          description: "The velocity of the drifting gabor patch."
	        },
	        method: {
	          type: jspsych.ParameterType.STRING,
	          pretty_name: "gabor_drawing_method",
	          default: "ml-matrix",
	          description: "The method of drawing the gabor patch."
	        },
	        disableNorm: {
	          type: jspsych.ParameterType.BOOL,
	          pretty_name: "disableNorm",
	          default: false,
	          description: "Disable normalization of the gaussian function."
	        },
	        disableGauss: {
	          type: jspsych.ParameterType.BOOL,
	          pretty_name: "disableGauss",
	          default: false,
	          description: "Disable to convolve with a Gaussian."
	        },
	        mask_func: {
	          type: jspsych.ParameterType.FUNCTION,
	          pretty_name: "Masking function",
	          default: null,
	          description: "Masking the image manually."
	        },
	        text_color: {
	          type: jspsych.ParameterType.STRING,
	          pretty_name: "text color",
	          default: "#000000",
	          description: "The color of the text."
	        },
	        fontStyle: {
	          type: jspsych.ParameterType.STRING,
	          pretty_name: "font style",
	          default: "normal",
	          description: "Font style"
	        },
	        fontWeight: {
	          type: jspsych.ParameterType.STRING,
	          pretty_name: "font weight",
	          default: "normal",
	          description: "Font weight"
	        },
	        fontSize: {
	          type: jspsych.ParameterType.STRING,
	          pretty_name: "font size",
	          default: "20px",
	          description: "Font size"
	        },
	        fontFamily: {
	          type: jspsych.ParameterType.STRING,
	          pretty_name: "font family",
	          default: "Verdana, Arial, Helvetica, sans-serif",
	          description: "Font family"
	        }
	      }
	    },
	    pixi: {
	      type: jspsych.ParameterType.BOOL,
	      pretty_name: "Enable Pixi",
	      default: false,
	      description: "If true, this plugin will use PixiJS"
	    },
	    remain_canvas: {
	      type: jspsych.ParameterType.BOOL,
	      pretty_name: "Remain canvas",
	      default: false,
	      description: "If true, the main canvas remains for the next trial."
	    },
	    choices: {
	      type: jspsych.ParameterType.KEYS,
	      pretty_name: "Choices",
	      default: "ALL_KEYS",
	      description: "The keys the subject is allowed to press to respond to the stimulus."
	    },
	    prompt: {
	      type: jspsych.ParameterType.HTML_STRING,
	      pretty_name: "Prompt",
	      default: null,
	      description: "Any content here will be displayed below the stimulus."
	    },
	    upper_prompt: {
	      type: jspsych.ParameterType.HTML_STRING,
	      pretty_name: "Upper prompt",
	      default: null,
	      description: "Any content here will be displayed above the stimulus."
	    },
	    lower_prompt: {
	      type: jspsych.ParameterType.HTML_STRING,
	      pretty_name: "Lower prompt",
	      default: null,
	      description: "This is the same as the prompt."
	    },
	    canvas_width: {
	      type: jspsych.ParameterType.INT,
	      pretty_name: "Canvas width",
	      default: null,
	      description: "The width of the canvas."
	    },
	    canvas_height: {
	      type: jspsych.ParameterType.INT,
	      pretty_name: "Canvas height",
	      default: null,
	      description: "The height of the canvas."
	    },
	    canvas_offsetX: {
	      type: jspsych.ParameterType.INT,
	      pretty_name: "Canvas offset X",
	      default: 0,
	      description: "This value is subtracted from the width of the canvas."
	    },
	    canvas_offsetY: {
	      type: jspsych.ParameterType.INT,
	      pretty_name: "Canvas offset Y",
	      default: 8,
	      description: "This value is subtracted from the height of the canvas."
	    },
	    trial_duration: {
	      type: jspsych.ParameterType.INT,
	      pretty_name: "Trial duration",
	      default: null,
	      description: "How long to show trial before it ends."
	    },
	    response_ends_trial: {
	      type: jspsych.ParameterType.BOOL,
	      pretty_name: "Response ends trial",
	      default: true,
	      description: "If true, trial will end when subject makes a response."
	    },
	    background_color: {
	      type: jspsych.ParameterType.STRING,
	      pretty_name: "Background color",
	      default: "grey",
	      description: "The background color of the canvas."
	    },
	    response_type: {
	      type: jspsych.ParameterType.STRING,
	      pretty_name: "key, mouse or button",
	      default: "key",
	      description: "How to make a response."
	    },
	    response_start_time: {
	      type: jspsych.ParameterType.INT,
	      pretty_name: "Response start",
	      default: 0,
	      description: "When the subject is allowed to respond to the stimulus."
	    },
	    raf_func: {
	      type: jspsych.ParameterType.FUNCTION,
	      pretty_name: "Step function",
	      default: null,
	      description: "This function enables to move objects as you wish."
	    },
	    mouse_down_func: {
	      type: jspsych.ParameterType.FUNCTION,
	      pretty_name: "Mouse down function",
	      default: null,
	      description: "This function is set to the event listener of the mousedown."
	    },
	    mouse_move_func: {
	      type: jspsych.ParameterType.FUNCTION,
	      pretty_name: "Mouse move function",
	      default: null,
	      description: "This function is set to the event listener of the mousemove."
	    },
	    mouse_up_func: {
	      type: jspsych.ParameterType.FUNCTION,
	      pretty_name: "Mouse up function",
	      default: null,
	      description: "This function is set to the event listener of the mouseup."
	    },
	    key_down_func: {
	      type: jspsych.ParameterType.FUNCTION,
	      pretty_name: "Key down function",
	      default: null,
	      description: "This function is set to the event listener of the keydown."
	    },
	    key_up_func: {
	      type: jspsych.ParameterType.FUNCTION,
	      pretty_name: "Key up function",
	      default: null,
	      description: "This function is set to the event listener of the keyup."
	    },
	    touchstart_func: {
	      type: jspsych.ParameterType.FUNCTION,
	      pretty_name: "Touch start function",
	      default: null,
	      description: "This function is set to the event listener of the CANVAS touchstart."
	    },
	    touchend_func: {
	      type: jspsych.ParameterType.FUNCTION,
	      pretty_name: "Touch end function",
	      default: null,
	      description: "This function is set to the event listener of the CANVAS touchend."
	    },
	    touchcancel_func: {
	      type: jspsych.ParameterType.FUNCTION,
	      pretty_name: "Touch cancel function",
	      default: null,
	      description: "This function is set to the event listener of the CANVAS touchcancel."
	    },
	    touchmove_func: {
	      type: jspsych.ParameterType.FUNCTION,
	      pretty_name: "Touch move function",
	      default: null,
	      description: "This function is set to the event listener of the CANVAS touchmove."
	    },
	    button_choices: {
	      type: jspsych.ParameterType.STRING,
	      pretty_name: "Button choices",
	      default: null,
	      description: "The labels for the buttons."
	    },
	    button_html: {
	      type: jspsych.ParameterType.FUNCTION,
	      default: function(choice, choice_index) {
	        return `<button class="jspsych-btn">${choice}</button>`;
	      }
	    },
	    // These properties refer to https://github.com/jspsych/jsPsych/tree/main/packages/plugin-html-button-response
	    /** Setting to `'grid'` will make the container element have the CSS property `display: grid` and enable the use of `grid_rows` and `grid_columns`. Setting to `'flex'` will make the container element have the CSS property `display: flex`. You can customize how the buttons are laid out by adding inline CSS in the `button_html` parameter. */
	    button_layout: {
	      type: jspsych.ParameterType.STRING,
	      default: "grid"
	    },
	    /**
	     * The number of rows in the button grid. Only applicable when `button_layout` is set to `'grid'`. If null, the number of rows will be determined automatically based on the number of buttons and the number of columns.
	     */
	    grid_rows: {
	      type: jspsych.ParameterType.INT,
	      default: 1
	    },
	    /**
	     * The number of columns in the button grid. Only applicable when `button_layout` is set to `'grid'`. If null, the number of columns will be determined automatically based on the number of buttons and the number of rows.
	     */
	    grid_columns: {
	      type: jspsych.ParameterType.INT,
	      default: null
	    },
	    vert_button_margin: {
	      type: jspsych.ParameterType.STRING,
	      pretty_name: "Margin vertical",
	      default: "0px",
	      description: "The vertical margin of the button."
	    },
	    horiz_button_margin: {
	      type: jspsych.ParameterType.STRING,
	      pretty_name: "Margin horizontal",
	      default: "8px",
	      description: "The horizontal margin of the button."
	    },
	    clear_canvas: {
	      type: jspsych.ParameterType.BOOL,
	      pretty_name: "clear_canvas",
	      default: true,
	      description: "Clear the canvas per frame."
	    }
	  },
	  data: {
	    rt: {
	      type: jspsych.ParameterType.INT
	    },
	    response_type: {
	      type: jspsych.ParameterType.STRING
	    },
	    key_press: {
	      type: jspsych.ParameterType.STRING
	    },
	    response: {
	      type: jspsych.ParameterType.STRING
	    },
	    avg_frame_time: {
	      type: jspsych.ParameterType.FLOAT
	    },
	    click_x: {
	      type: jspsych.ParameterType.FLOAT
	    },
	    click_y: {
	      type: jspsych.ParameterType.FLOAT
	    },
	    center_x: {
	      type: jspsych.ParameterType.FLOAT
	    },
	    center_y: {
	      type: jspsych.ParameterType.FLOAT
	    },
	    button_pressed: {
	      type: jspsych.ParameterType.INT
	    },
	    stimulus: {
	      type: jspsych.ParameterType.HTML_STRING
	    }
	  }
	};
	class PsychophysicsPlugin {
	  constructor(jsPsych) {
	    this.jsPsych = jsPsych;
	  }
	  static {
	    this.info = info;
	  }
	  trial(display_element, trial) {
	    function getNumbering(start_num, count) {
	      return [...Array(count)].map((_, i) => i + start_num);
	    }
	    const canvas_for_color = document.createElement("canvas");
	    canvas_for_color.id = "canvas_for_color";
	    canvas_for_color.style.display = "none";
	    const ctx_for_color = canvas_for_color.getContext("2d");
	    function getColorNum(color_str) {
	      ctx_for_color.fillStyle = color_str;
	      const col = ctx_for_color.fillStyle;
	      const col2 = col[1] + col[2] + col[3] + col[4] + col[5] + col[6] + col[7] + col[8];
	      return parseInt(col2, 16);
	    }
	    trial.getColorNum = getColorNum;
	    class psychophysics_stimulus {
	      // so any option can be assigned to stimulus classes
	      constructor(stim) {
	        Object.assign(this, stim);
	        const keys = Object.keys(this);
	        for (var i = 0; i < keys.length; i++) {
	          if (typeof this[keys[i]] === "function") {
	            if (keys[i] === "drawFunc") continue;
	            if (keys[i] === "change_attr") continue;
	            if (keys[i] === "mask_func") continue;
	            this[keys[i]] = this[keys[i]].call();
	          }
	        }
	      }
	    }
	    class visual_stimulus extends psychophysics_stimulus {
	      constructor(stim) {
	        super(stim);
	        if (this.startX === "center") {
	          if (this.origin_center) {
	            this.startX = 0;
	          } else {
	            this.startX = centerX;
	          }
	        }
	        if (this.startY === "center") {
	          if (this.origin_center) {
	            this.startY = 0;
	          } else {
	            this.startY = centerY;
	          }
	        }
	        if (this.endX === "center") {
	          if (this.origin_center) {
	            this.endX = 0;
	          } else {
	            this.endX = centerX;
	          }
	        }
	        if (this.endY === "center") {
	          if (this.origin_center) {
	            this.endY = 0;
	          } else {
	            this.endY = centerY;
	          }
	        }
	        if (this.origin_center) {
	          this.startX = this.startX + centerX;
	          this.startY = this.startY + centerY;
	          if (this.endX !== null) this.endX = this.endX + centerX;
	          if (this.endY !== null) this.endY = this.endY + centerY;
	        }
	        if (typeof this.motion_start_time === "undefined")
	          this.motion_start_time = this.show_start_time;
	        if (typeof this.motion_end_time === "undefined")
	          this.motion_end_time = null;
	        if (typeof this.motion_start_frame === "undefined")
	          this.motion_start_frame = this.show_start_frame;
	        if (typeof this.motion_end_frame === "undefined")
	          this.motion_end_frame = null;
	        if (trial.clear_canvas === false && this.show_end_time !== null)
	          alert(
	            "You can not specify the show_end_time with the clear_canvas property."
	          );
	        this.horiz_pix_sec = this.calc_pix_per_sec("horiz");
	        this.vert_pix_sec = this.calc_pix_per_sec("vert");
	        this.currentX = this.startX;
	        this.currentY = this.startY;
	      }
	      calc_pix_per_sec(direction) {
	        let pix_sec, pix_frame, startPos, endPos;
	        if (direction === "horiz") {
	          pix_sec = this.horiz_pix_sec;
	          pix_frame = this.horiz_pix_frame;
	          startPos = this.startX;
	          endPos = this.endX;
	        } else {
	          pix_sec = this.vert_pix_sec;
	          pix_frame = this.vert_pix_frame;
	          startPos = this.startY;
	          endPos = this.endY;
	        }
	        const motion_start_time = this.motion_start_time;
	        const motion_end_time = this.motion_end_time;
	        if ((typeof pix_sec !== "undefined" || typeof pix_frame !== "undefined") && endPos !== null && motion_end_time !== null) {
	          alert(
	            "You can not specify the speed, location, and time at the same time."
	          );
	          pix_sec = 0;
	        }
	        if (typeof pix_sec !== "undefined" || typeof pix_frame !== "undefined")
	          return pix_sec;
	        if (endPos === null) return 0;
	        if (startPos === endPos) return 0;
	        if (motion_end_time === null) {
	          alert(
	            "Please specify the motion_end_time or the velocity when you use the endX/Y property."
	          );
	          return 0;
	        }
	        return (endPos - startPos) / (motion_end_time / 1e3 - motion_start_time / 1e3);
	      }
	      calc_current_position(direction, elapsed) {
	        let pix_frame, pix_sec, current_pos, start_pos, end_pos;
	        if (direction === "horiz") {
	          pix_frame = this.horiz_pix_frame;
	          pix_sec = this.horiz_pix_sec;
	          current_pos = this.currentX;
	          start_pos = this.startX;
	          end_pos = this.endX;
	        } else {
	          pix_frame = this.vert_pix_frame;
	          pix_sec = this.vert_pix_sec;
	          current_pos = this.currentY;
	          start_pos = this.startY;
	          end_pos = this.endY;
	        }
	        const motion_start = this.is_frame ? this.motion_start_frame : this.motion_start_time;
	        const motion_end = this.is_frame ? this.motion_end_frame : this.motion_end_time;
	        if (elapsed < motion_start) return current_pos;
	        if (motion_end !== null && elapsed >= motion_end) return current_pos;
	        let ascending = true;
	        if (typeof pix_frame === "undefined") {
	          if (pix_sec < 0) ascending = false;
	        } else {
	          if (pix_frame < 0) ascending = false;
	        }
	        if (end_pos === null || ascending && current_pos <= end_pos || !ascending && current_pos >= end_pos) {
	          if (typeof pix_frame === "undefined") {
	            return start_pos + Math.round(pix_sec * (elapsed - motion_start) / 1e3);
	          } else {
	            return current_pos + pix_frame;
	          }
	        } else {
	          return current_pos;
	        }
	      }
	      update_position(elapsed) {
	        this.currentX = this.calc_current_position("horiz", elapsed);
	        this.currentY = this.calc_current_position("vert", elapsed);
	      }
	    }
	    class image_stimulus extends visual_stimulus {
	      constructor(stim) {
	        super(stim);
	        if (typeof this.file === "undefined") {
	          alert("You have to specify the file property.");
	          return;
	        }
	        this.img = new Image();
	        this.img.src = this.file;
	        this.img.onload = () => {
	          const tmpRatio = trial.pixi ? 1 : window.devicePixelRatio;
	          if (typeof this.mask === "undefined" && typeof this.filter === "undefined") {
	            if (trial.pixi) {
	              this.pixi_obj = PIXI__namespace.Sprite.from(this.file);
	              if (typeof this.pixi_mask !== "undefined") {
	                this.pixi_obj.mask = this.pixi_mask;
	              }
	              if (typeof this.pixi_filters !== "undefined") {
	                this.pixi_obj.filters = this.pixi_filters;
	              }
	              init_pixi_obj(this.pixi_obj);
	            }
	            this.prepared = true;
	            return;
	          }
	          if (document.getElementById("invisible_canvas") === null) {
	            const canvas_element = document.createElement("canvas");
	            canvas_element.id = "invisible_canvas";
	            display_element.appendChild(canvas_element);
	            canvas_element.style.display = "none";
	          }
	          const invisible_canvas = document.getElementById(
	            "invisible_canvas"
	          );
	          const canvas_info = set_canvas(
	            invisible_canvas,
	            tmpRatio,
	            this.img.width,
	            this.img.height
	          );
	          const invisible_ctx = canvas_info.ctx;
	          invisible_ctx.clearRect(
	            0,
	            0,
	            invisible_canvas.width,
	            invisible_canvas.height
	          );
	          if (typeof this.filter === "undefined") {
	            invisible_ctx.filter = "none";
	          } else {
	            invisible_ctx.filter = this.filter;
	          }
	          invisible_ctx.drawImage(
	            this.img,
	            0,
	            0,
	            this.img.width,
	            this.img.height
	          );
	          if (typeof this.mask === "undefined") {
	            const invisible_img = invisible_ctx.getImageData(
	              0,
	              0,
	              this.img.width * tmpRatio,
	              this.img.height * tmpRatio
	            );
	            if (trial.pixi) {
	              const filtered_texture = PIXI__namespace.Texture.fromBuffer(
	                invisible_img.data,
	                invisible_img.width,
	                invisible_img.height
	              );
	              this.pixi_obj = new PIXI__namespace.Sprite(filtered_texture);
	              init_pixi_obj(this.pixi_obj);
	            } else {
	              this.masking_img = invisible_img;
	            }
	            this.prepared = true;
	            return;
	          }
	          if (this.mask === "manual") {
	            if (this.mask_func === null) {
	              alert(
	                "You have to specify the mask_func when applying masking manually."
	              );
	              return;
	            }
	            const manual_img = this.mask_func(invisible_canvas);
	            if (trial.pixi) {
	              const manual_texture = PIXI__namespace.Texture.fromBuffer(
	                manual_img.data,
	                manual_img.width,
	                manual_img.height
	              );
	              this.pixi_obj = new PIXI__namespace.Sprite(manual_texture);
	              init_pixi_obj(this.pixi_obj);
	            } else {
	              this.masking_img = manual_img;
	            }
	            this.prepared = true;
	            return;
	          }
	          if (this.mask === "gauss") {
	            if (typeof this.width === "undefined") {
	              alert(
	                "You have to specify the width property for the gaussian mask. For example, 200."
	              );
	              return;
	            }
	            const gauss_width = this.width * tmpRatio;
	            const invisible_img = invisible_ctx.getImageData(
	              this.img.width * tmpRatio / 2 - gauss_width / 2,
	              this.img.height * tmpRatio / 2 - gauss_width / 2,
	              gauss_width,
	              gauss_width
	            );
	            let coord_array = getNumbering(
	              Math.round(0 - gauss_width / 2),
	              gauss_width
	            );
	            let coord_matrix_x = [];
	            for (let i = 0; i < gauss_width; i++) {
	              coord_matrix_x.push(coord_array);
	            }
	            coord_array = getNumbering(
	              Math.round(0 - gauss_width / 2),
	              gauss_width
	            );
	            let coord_matrix_y = [];
	            for (let i = 0; i < gauss_width; i++) {
	              coord_matrix_y.push(coord_array);
	            }
	            let exp_value;
	            const adjusted_sc = this.sc * tmpRatio;
	            if (this.method === "math") {
	              alert("The math method is not supported. Please use the ml-matrix method instead.");
	            } else if (this.method === "numeric") {
	              alert("The numeric method is not supported. Please use the ml-matrix method instead.");
	            }
	            if (this.method === "ml-matrix") {
	              const matrix_x = new Matrix(coord_matrix_x);
	              const matrix_y = new Matrix(coord_matrix_y).transpose();
	              const x_factor = Matrix.pow(matrix_x, 2).mul(-1);
	              const y_factor = Matrix.pow(matrix_y, 2).mul(-1);
	              const varScale = 2 * Math.pow(adjusted_sc, 2);
	              exp_value = Matrix.add(
	                Matrix.divide(x_factor, varScale),
	                Matrix.divide(y_factor, varScale)
	              ).exp().to2DArray();
	            }
	            let cnt = 3;
	            for (let i = 0; i < gauss_width; i++) {
	              for (let j = 0; j < gauss_width; j++) {
	                invisible_img.data[cnt] = exp_value[i][j] * 255;
	                cnt = cnt + 4;
	              }
	            }
	            if (trial.pixi) {
	              const gauss_texture = PIXI__namespace.Texture.fromBuffer(
	                invisible_img.data,
	                invisible_img.width,
	                invisible_img.height
	              );
	              this.pixi_obj = new PIXI__namespace.Sprite(gauss_texture);
	              init_pixi_obj(this.pixi_obj);
	            } else {
	              this.masking_img = invisible_img;
	            }
	            this.prepared = true;
	            return;
	          }
	          if (this.mask === "circle" || this.mask === "rect") {
	            if (typeof this.width === "undefined") {
	              alert(
	                "You have to specify the width property for the circle/rect mask."
	              );
	              return;
	            }
	            if (typeof this.height === "undefined") {
	              alert(
	                "You have to specify the height property for the circle/rect mask."
	              );
	              return;
	            }
	            if (typeof this.center_x === "undefined") {
	              alert(
	                "You have to specify the center_x property for the circle/rect mask."
	              );
	              return;
	            }
	            if (typeof this.center_y === "undefined") {
	              alert(
	                "You have to specify the center_y property for the circle/rect mask."
	              );
	              return;
	            }
	            const oval_width = this.width * tmpRatio;
	            const oval_height = this.height * tmpRatio;
	            const oval_cx = this.center_x * tmpRatio;
	            const oval_cy = this.center_y * tmpRatio;
	            const invisible_img = invisible_ctx.getImageData(
	              oval_cx - oval_width / 2,
	              oval_cy - oval_height / 2,
	              oval_width,
	              oval_height
	            );
	            const cx = invisible_img.width / 2;
	            const cy = invisible_img.height / 2;
	            if (this.mask === "circle") {
	              let cnt = 3;
	              for (let j = 0; j < oval_height; j++) {
	                for (let i = 0; i < oval_width; i++) {
	                  const tmp = Math.pow(i - cx, 2) / Math.pow(cx, 2) + Math.pow(j - cy, 2) / Math.pow(cy, 2);
	                  if (tmp > 1) {
	                    invisible_img.data[cnt] = 0;
	                  }
	                  cnt = cnt + 4;
	                }
	              }
	            }
	            if (trial.pixi) {
	              const cropped_texture = PIXI__namespace.Texture.fromBuffer(
	                invisible_img.data,
	                invisible_img.width,
	                invisible_img.height
	              );
	              this.pixi_obj = new PIXI__namespace.Sprite(cropped_texture);
	              init_pixi_obj(this.pixi_obj);
	            } else {
	              this.masking_img = invisible_img;
	            }
	            this.prepared = true;
	            return;
	          }
	        };
	      }
	      show() {
	        if (trial.pixi) {
	          if (typeof this.scale !== "undefined" && typeof this.image_width !== "undefined") {
	            alert(
	              "You can not specify the scale and image_width at the same time."
	            );
	          }
	          if (typeof this.scale !== "undefined" && typeof this.image_height !== "undefined") {
	            alert(
	              "You can not specify the scale and image_height at the same time."
	            );
	          }
	          if (typeof this.image_height !== "undefined" && typeof this.image_width !== "undefined") {
	            alert(
	              "You can not specify the image_height and image_width at the same time."
	            );
	          }
	          let scale = 1;
	          if (typeof this.scale !== "undefined") {
	            scale = this.scale;
	          }
	          if (typeof this.image_width !== "undefined") {
	            scale = this.image_width / this.img.width;
	          }
	          if (typeof this.image_height !== "undefined") {
	            scale = this.image_height / this.img.height;
	          }
	          this.pixi_obj.scale.x = scale;
	          this.pixi_obj.scale.y = scale;
	          if (typeof this.pixi_angle !== "undefined") {
	            this.pixi_obj.angle = this.pixi_angle;
	          }
	          if (typeof this.pixi_rotation !== "undefined") {
	            this.pixi_obj.rotation = this.pixi_rotation;
	          }
	          this.pixi_obj.x = this.currentX;
	          this.pixi_obj.y = this.currentY;
	          this.pixi_obj.visible = true;
	        } else {
	          if (this.mask || this.filter) {
	            ctx.putImageData(
	              this.masking_img,
	              this.currentX * window.devicePixelRatio - this.masking_img.width / 2,
	              this.currentY * window.devicePixelRatio - this.masking_img.height / 2
	            );
	          } else {
	            if (typeof this.scale !== "undefined" && typeof this.image_width !== "undefined")
	              alert(
	                "You can not specify the scale and image_width at the same time."
	              );
	            if (typeof this.scale !== "undefined" && typeof this.image_height !== "undefined")
	              alert(
	                "You can not specify the scale and image_height at the same time."
	              );
	            if (typeof this.image_height !== "undefined" && typeof this.image_width !== "undefined")
	              alert(
	                "You can not specify the image_height and image_width at the same time."
	              );
	            let scale = 1;
	            if (typeof this.scale !== "undefined") scale = this.scale;
	            if (typeof this.image_width !== "undefined")
	              scale = this.image_width / this.img.width;
	            if (typeof this.image_height !== "undefined")
	              scale = this.image_height / this.img.height;
	            const tmpW = this.img.width * scale;
	            const tmpH = this.img.height * scale;
	            ctx.drawImage(
	              this.img,
	              0,
	              0,
	              this.img.width,
	              this.img.height,
	              this.currentX - tmpW / 2,
	              this.currentY - tmpH / 2,
	              tmpW,
	              tmpH
	            );
	          }
	        }
	      }
	    }
	    class gabor_stimulus extends visual_stimulus {
	      constructor(stim) {
	        super(stim);
	        if (!trial.pixi) {
	          this.update_count = 0;
	          this.prepared = true;
	          return;
	        }
	        const fragmentSrc = `
            precision mediump float;

            uniform float Contrast;
            uniform float Phase;
            uniform float angle_in_degrees; // tilt
            uniform float spatial_freq;
            uniform float SpaceConstant;
            uniform float disableNorm;
            uniform float disableGauss;
            uniform float modulateColor_R;
            uniform float modulateColor_G;
            uniform float modulateColor_B;
            uniform float modulateColor_Alpha;
            uniform float offset_R;
            uniform float offset_G;
            uniform float offset_B;
            uniform float offset_Alpha;
            uniform float centerX;
            uniform float centerY;
            uniform float contrastPreMultiplicator;
            uniform float min_validModulationRange;
            uniform float max_validModulationRange;

            void main() {
                const float twopi     = 2.0 * 3.141592654;
                const float sqrtof2pi = 2.5066282746;
                /* Conversion factor from degrees to radians: */
                const float deg2rad = 3.141592654 / 180.0;
                
                float Angle = deg2rad * angle_in_degrees;
                float FreqTwoPi = spatial_freq * twopi;
                float Expmultiplier = -0.5 / (SpaceConstant * SpaceConstant);
                float mc = disableNorm + (1.0 - disableNorm) * (1.0 / (sqrtof2pi * SpaceConstant));

                vec3 modulateColor = vec3(modulateColor_R, modulateColor_G, modulateColor_B);

                vec3 baseColor = modulateColor * mc * Contrast * contrastPreMultiplicator;

                vec2 pos = gl_FragCoord.xy - vec2(centerX, centerY);

                /* Compute (x,y) distance weighting coefficients, based on rotation angle: */
                vec2 coeff = vec2(cos(Angle), sin(Angle)) * FreqTwoPi;

                /* Evaluate sine grating at requested position, angle and phase: */
                float sv = sin(dot(coeff, pos) + Phase);

                /* Compute exponential hull for the gabor: */
                float ev = disableGauss + (1.0 - disableGauss) * exp(dot(pos, pos) * Expmultiplier);

                /* Multiply/Modulate base color and alpha with calculated sine/gauss      */
                /* values, add some constant color/alpha Offset, assign as final fragment */
                /* output color: */

                vec4  Offset = vec4(offset_R, offset_G, offset_B, offset_Alpha);
                        
                // Be careful not to change the transparency. Note that the type of the baseColor valuable is vec3 not vec4.
                gl_FragColor = vec4(baseColor * clamp(ev * sv, min_validModulationRange, max_validModulationRange), modulateColor_Alpha) + Offset;

          }`;
	        const gabor_width = this.width;
	        const img_element = document.createElement("img");
	        img_element.width = gabor_width;
	        img_element.height = gabor_width;
	        const gabor_sprite = PIXI__namespace.Sprite.from(img_element);
	        gabor_sprite.visible = false;
	        gabor_sprite.anchor.set(0.5);
	        gabor_sprite.x = pixi_app.screen.width / 2;
	        gabor_sprite.y = pixi_app.screen.height / 2;
	        const uniforms = {
	          Contrast: this.contrast,
	          Phase: this.phase,
	          angle_in_degrees: 90 + this.tilt,
	          // Add 90 degrees for compatibility with previous versions.
	          spatial_freq: this.sf,
	          SpaceConstant: this.sc,
	          disableNorm: this.disableNorm ? 1 : 0,
	          disableGauss: this.disableGauss ? 1 : 0,
	          modulateColor_R: this.modulate_color[0],
	          modulateColor_G: this.modulate_color[1],
	          modulateColor_B: this.modulate_color[2],
	          modulateColor_Alpha: this.modulate_color[3],
	          offset_R: this.offset_color[0],
	          offset_G: this.offset_color[1],
	          offset_B: this.offset_color[2],
	          offset_Alpha: this.offset_color[3],
	          centerX: pixi_app.screen.width / 2,
	          centerY: pixi_app.screen.height / 2,
	          contrastPreMultiplicator: this.contrastPreMultiplicator,
	          min_validModulationRange: -2,
	          max_validModulationRange: 2
	        };
	        const myFilter = new PIXI__namespace.Filter(null, fragmentSrc, uniforms);
	        pixi_app.stage.addChild(gabor_sprite);
	        gabor_sprite.filters = [myFilter];
	        this.pixi_obj = gabor_sprite;
	        this.prepared = true;
	      }
	      show() {
	        if (trial.pixi) {
	          this.pixi_obj.filters[0].uniforms.Phase += this.drift;
	          this.pixi_obj.x = this.currentX;
	          this.pixi_obj.y = this.currentY;
	          this.pixi_obj.filters[0].uniforms.centerX = this.currentX;
	          this.pixi_obj.filters[0].uniforms.centerY = pixi_app.screen.height - this.currentY;
	          this.pixi_obj.visible = true;
	        } else {
	          ctx.putImageData(
	            this.img_data,
	            this.currentX * window.devicePixelRatio - this.img_data.width / 2,
	            this.currentY * window.devicePixelRatio - this.img_data.height / 2
	          );
	        }
	      }
	      update_position(elapsed) {
	        this.currentX = this.calc_current_position("horiz", elapsed);
	        this.currentY = this.calc_current_position("vert", elapsed);
	        if (trial.pixi) return;
	        if (typeof this.img_data !== "undefined" && this.drift === 0) return;
	        let gabor_data;
	        const gabor_width = this.width * window.devicePixelRatio;
	        let coord_array = getNumbering(
	          Math.round(0 - gabor_width / 2),
	          gabor_width
	        );
	        let coord_matrix_x = [];
	        for (let i = 0; i < gabor_width; i++) {
	          coord_matrix_x.push(coord_array);
	        }
	        coord_array = getNumbering(
	          Math.round(0 - gabor_width / 2),
	          gabor_width
	        );
	        let coord_matrix_y = [];
	        for (let i = 0; i < gabor_width; i++) {
	          coord_matrix_y.push(coord_array);
	        }
	        const tilt_rad = deg2rad(90 - this.tilt);
	        const a = Math.cos(tilt_rad) * this.sf / window.devicePixelRatio * (2 * Math.PI);
	        const b = Math.sin(tilt_rad) * this.sf / window.devicePixelRatio * (2 * Math.PI);
	        const adjusted_sc = this.sc * window.devicePixelRatio;
	        let multConst = 1 / (Math.sqrt(2 * Math.PI) * adjusted_sc);
	        if (this.disableNorm) multConst = 1;
	        const phase_rad = deg2rad(this.phase + this.drift * this.update_count);
	        this.update_count += 1;
	        if (this.method === "math") {
	          alert("The math method is not supported. Please use the ml-matrix method instead.");
	        } else if (this.method === "numeric") {
	          alert("The numeric method is not supported. Please use the ml-matrix method instead.");
	        }
	        if (this.method === "ml-matrix") {
	          const matrix_x = new Matrix(coord_matrix_x);
	          const matrix_y = new Matrix(coord_matrix_y).transpose();
	          const x_factor = Matrix.pow(matrix_x, 2).mul(-1);
	          const y_factor = Matrix.pow(matrix_y, 2).mul(-1);
	          const sinWave = Matrix.add(
	            Matrix.multiply(matrix_x, a),
	            Matrix.multiply(matrix_y, b)
	          ).add(phase_rad).sin();
	          const varScale = 2 * Math.pow(adjusted_sc, 2);
	          const exp_value = this.disableGauss ? 1 : Matrix.add(
	            Matrix.divide(x_factor, varScale),
	            Matrix.divide(y_factor, varScale)
	          ).exp();
	          const tmp1 = Matrix.multiply(sinWave, exp_value);
	          const tmp2 = Matrix.multiply(tmp1, multConst);
	          const tmp3 = Matrix.multiply(
	            Matrix.multiply(tmp2, this.contrastPreMultiplicator),
	            this.contrast
	          );
	          const m = Matrix.multiply(Matrix.add(tmp3, 0.5), 256);
	          gabor_data = m.to2DArray();
	        }
	        const imageData = ctx.createImageData(gabor_width, gabor_width);
	        let cnt = 0;
	        for (let i = 0; i < gabor_width; i++) {
	          for (let j = 0; j < gabor_width; j++) {
	            imageData.data[cnt] = Math.round(gabor_data[i][j]);
	            cnt++;
	            imageData.data[cnt] = Math.round(gabor_data[i][j]);
	            cnt++;
	            imageData.data[cnt] = Math.round(gabor_data[i][j]);
	            cnt++;
	            imageData.data[cnt] = 255;
	            cnt++;
	          }
	        }
	        this.img_data = imageData;
	      }
	    }
	    class line_stimulus extends visual_stimulus {
	      constructor(stim) {
	        super(stim);
	        if (typeof this.angle === "undefined") {
	          if (typeof this.x1 === "undefined" || typeof this.x2 === "undefined" || typeof this.y1 === "undefined" || typeof this.y2 === "undefined") {
	            alert(
	              "You have to specify the angle of lines, or the start (x1, y1) and end (x2, y2) coordinates."
	            );
	            return;
	          }
	          this.startX = (this.x1 + this.x2) / 2;
	          this.startY = (this.y1 + this.y2) / 2;
	          if (this.origin_center) {
	            this.startX = this.startX + centerX;
	            this.startY = this.startY + centerY;
	          }
	          this.currentX = this.startX;
	          this.currentY = this.startY;
	          this.angle = Math.atan((this.y2 - this.y1) / (this.x2 - this.x1)) * (180 / Math.PI);
	          this.line_length = Math.sqrt(
	            (this.x2 - this.x1) ** 2 + (this.y2 - this.y1) ** 2
	          );
	        } else {
	          if (typeof this.x1 !== "undefined" || typeof this.x2 !== "undefined" || typeof this.y1 !== "undefined" || typeof this.y2 !== "undefined")
	            alert(
	              "You can not specify the angle and positions of the line at the same time."
	            );
	          if (typeof this.line_length === "undefined")
	            alert("You have to specify the line_length property.");
	        }
	        if (typeof this.line_color === "undefined") this.line_color = "black";
	        if (trial.pixi) {
	          this.pixi_obj = new PIXI__namespace.Graphics();
	          this.pixi_obj.lineStyle({
	            width: this.line_width,
	            color: getColorNum(this.line_color),
	            join: this.lineJoin,
	            miterLimit: this.miterLimit
	          });
	          const theta = deg2rad(this.angle);
	          const x1 = -this.line_length / 2 * Math.cos(theta);
	          const y1 = -this.line_length / 2 * Math.sin(theta);
	          const x2 = this.line_length / 2 * Math.cos(theta);
	          const y2 = this.line_length / 2 * Math.sin(theta);
	          this.pixi_obj.moveTo(x1, y1);
	          this.pixi_obj.lineTo(x2, y2);
	          this.pixi_obj.visible = false;
	          pixi_app.stage.addChild(this.pixi_obj);
	        }
	        this.prepared = true;
	      }
	      show() {
	        if (trial.pixi) {
	          this.pixi_obj.x = this.currentX;
	          this.pixi_obj.y = this.currentY;
	          this.pixi_obj.visible = true;
	        } else {
	          if (typeof this.filter === "undefined") {
	            ctx.filter = "none";
	          } else {
	            ctx.filter = this.filter;
	          }
	          ctx.beginPath();
	          ctx.lineWidth = this.line_width;
	          ctx.lineJoin = this.lineJoin;
	          ctx.miterLimit = this.miterLimit;
	          const theta = deg2rad(this.angle);
	          const x1 = this.currentX - this.line_length / 2 * Math.cos(theta);
	          const y1 = this.currentY - this.line_length / 2 * Math.sin(theta);
	          const x2 = this.currentX + this.line_length / 2 * Math.cos(theta);
	          const y2 = this.currentY + this.line_length / 2 * Math.sin(theta);
	          ctx.strokeStyle = this.line_color;
	          ctx.moveTo(x1, y1);
	          ctx.lineTo(x2, y2);
	          ctx.stroke();
	        }
	      }
	    }
	    class rect_stimulus extends visual_stimulus {
	      constructor(stim) {
	        super(stim);
	        if (typeof this.width === "undefined")
	          alert("You have to specify the width of the rectangle.");
	        if (typeof this.height === "undefined")
	          alert("You have to specify the height of the rectangle.");
	        if (typeof this.line_color === "undefined" && typeof this.fill_color === "undefined")
	          alert(
	            "You have to specify the either of the line_color or fill_color property."
	          );
	        if (trial.pixi) {
	          this.pixi_obj = new PIXI__namespace.Graphics();
	          this.pixi_obj.lineStyle({
	            width: this.line_width,
	            color: getColorNum(this.line_color),
	            join: this.lineJoin,
	            miterLimit: this.miterLimit
	          });
	          if (typeof this.fill_color !== "undefined")
	            this.pixi_obj.beginFill(getColorNum(this.fill_color), 1);
	          this.pixi_obj.drawRect(
	            -this.width / 2,
	            -this.height / 2,
	            this.width,
	            this.height
	          );
	          if (typeof this.fill_color !== "undefined") this.pixi_obj.endFill();
	          this.pixi_obj.visible = false;
	          pixi_app.stage.addChild(this.pixi_obj);
	        }
	        this.prepared = true;
	      }
	      show() {
	        if (trial.pixi) {
	          this.pixi_obj.x = this.currentX;
	          this.pixi_obj.y = this.currentY;
	          this.pixi_obj.visible = true;
	        } else {
	          if (typeof this.filter === "undefined") {
	            ctx.filter = "none";
	          } else {
	            ctx.filter = this.filter;
	          }
	          ctx.lineWidth = this.line_width;
	          ctx.lineJoin = this.lineJoin;
	          ctx.miterLimit = this.miterLimit;
	          if (typeof this.fill_color !== "undefined") {
	            ctx.fillStyle = this.fill_color;
	            ctx.fillRect(
	              this.currentX - this.width / 2,
	              this.currentY - this.height / 2,
	              this.width,
	              this.height
	            );
	          }
	          if (typeof this.line_color !== "undefined") {
	            ctx.strokeStyle = this.line_color;
	            ctx.strokeRect(
	              this.currentX - this.width / 2,
	              this.currentY - this.height / 2,
	              this.width,
	              this.height
	            );
	          }
	        }
	      }
	    }
	    class cross_stimulus extends visual_stimulus {
	      constructor(stim) {
	        super(stim);
	        if (typeof this.line_length === "undefined")
	          alert("You have to specify the line_length of the fixation cross.");
	        if (typeof this.line_color === "undefined") this.line_color = "#000000";
	        if (trial.pixi) {
	          this.pixi_obj = new PIXI__namespace.Graphics();
	          this.pixi_obj.lineStyle({
	            width: this.line_width,
	            color: getColorNum(this.line_color),
	            join: this.lineJoin,
	            miterLimit: this.miterLimit
	          });
	          const x1 = -this.line_length / 2;
	          const y1 = 0;
	          const x2 = this.line_length / 2;
	          const y2 = 0;
	          this.pixi_obj.moveTo(x1, y1);
	          this.pixi_obj.lineTo(x2, y2);
	          const x3 = 0;
	          const y3 = -this.line_length / 2;
	          const x4 = 0;
	          const y4 = this.line_length / 2;
	          this.pixi_obj.moveTo(x3, y3);
	          this.pixi_obj.lineTo(x4, y4);
	          this.pixi_obj.visible = false;
	          pixi_app.stage.addChild(this.pixi_obj);
	        }
	        this.prepared = true;
	      }
	      show() {
	        if (trial.pixi) {
	          this.pixi_obj.x = this.currentX;
	          this.pixi_obj.y = this.currentY;
	          this.pixi_obj.visible = true;
	        } else {
	          if (typeof this.filter === "undefined") {
	            ctx.filter = "none";
	          } else {
	            ctx.filter = this.filter;
	          }
	          ctx.beginPath();
	          ctx.lineWidth = this.line_width;
	          ctx.lineJoin = this.lineJoin;
	          ctx.miterLimit = this.miterLimit;
	          ctx.strokeStyle = this.line_color;
	          const x1 = this.currentX;
	          const y1 = this.currentY - this.line_length / 2;
	          const x2 = this.currentX;
	          const y2 = this.currentY + this.line_length / 2;
	          ctx.moveTo(x1, y1);
	          ctx.lineTo(x2, y2);
	          const x3 = this.currentX - this.line_length / 2;
	          const y3 = this.currentY;
	          const x4 = this.currentX + this.line_length / 2;
	          const y4 = this.currentY;
	          ctx.moveTo(x3, y3);
	          ctx.lineTo(x4, y4);
	          ctx.stroke();
	        }
	      }
	    }
	    class circle_stimulus extends visual_stimulus {
	      constructor(stim) {
	        super(stim);
	        if (typeof this.radius === "undefined")
	          alert("You have to specify the radius of circles.");
	        if (typeof this.line_color === "undefined" && typeof this.fill_color === "undefined")
	          alert("You have to specify the either of line_color or fill_color.");
	        if (!trial.pixi) {
	          this.prepared = true;
	          return;
	        }
	        this.pixi_obj = new PIXI__namespace.Graphics();
	        this.pixi_obj.lineStyle({
	          width: this.line_width,
	          color: getColorNum(this.line_color),
	          join: this.lineJoin,
	          miterLimit: this.miterLimit
	        });
	        if (typeof this.fill_color !== "undefined")
	          this.pixi_obj.beginFill(getColorNum(this.fill_color), 1);
	        this.pixi_obj.drawCircle(0, 0, this.radius);
	        if (typeof this.fill_color !== "undefined") this.pixi_obj.endFill();
	        this.pixi_obj.visible = false;
	        pixi_app.stage.addChild(this.pixi_obj);
	        this.prepared = true;
	      }
	      show() {
	        if (trial.pixi) {
	          this.pixi_obj.x = this.currentX;
	          this.pixi_obj.y = this.currentY;
	          this.pixi_obj.visible = true;
	        } else {
	          if (typeof this.filter === "undefined") {
	            ctx.filter = "none";
	          } else {
	            ctx.filter = this.filter;
	          }
	          ctx.beginPath();
	          ctx.lineWidth = this.line_width;
	          ctx.lineJoin = this.lineJoin;
	          ctx.miterLimit = this.miterLimit;
	          if (typeof this.fill_color !== "undefined") {
	            ctx.fillStyle = this.fill_color;
	            ctx.arc(
	              this.currentX,
	              this.currentY,
	              this.radius,
	              0,
	              Math.PI * 2,
	              false
	            );
	            ctx.fill();
	          }
	          if (typeof this.line_color !== "undefined") {
	            ctx.strokeStyle = this.line_color;
	            ctx.arc(
	              this.currentX,
	              this.currentY,
	              this.radius,
	              0,
	              Math.PI * 2,
	              false
	            );
	            ctx.stroke();
	          }
	        }
	      }
	    }
	    class text_stimulus extends visual_stimulus {
	      constructor(stim) {
	        super(stim);
	        if (typeof this.content === "undefined")
	          alert("You have to specify the content of texts.");
	        if (trial.pixi) {
	          if (typeof this.text_space !== "undefined")
	            alert(`You can't specify the text_space in Pixi mode.`);
	          this.pixi_obj = new PIXI__namespace.Text(this.content);
	          init_pixi_obj(this.pixi_obj);
	          this.pixi_obj.style.align = "center";
	          this.pixi_obj.style.fontFamily = this.fontFamily;
	          this.pixi_obj.style.fontSize = this.fontSize;
	          this.pixi_obj.style.fontStyle = this.fontStyle;
	          this.pixi_obj.style.fontWeight = this.fontWeight;
	          this.pixi_obj.style.fill = this.text_color;
	          this.pixi_obj.style.lineJoin = this.lineJoin;
	          this.pixi_obj.style.miterLimit = this.miterLimit;
	          if (typeof this.pixi_angle !== "undefined") {
	            this.pixi_obj.angle = this.pixi_angle;
	          }
	          if (typeof this.pixi_rotation !== "undefined") {
	            this.pixi_obj.rotation = this.pixi_rotation;
	          }
	        } else {
	          if (typeof this.text_space === "undefined") this.text_space = 20;
	          let font_info = "";
	          font_info = font_info + " " + this.fontStyle;
	          font_info = font_info + " " + this.fontWeight;
	          font_info = font_info + " " + this.fontSize;
	          font_info = font_info + " " + this.fontFamily;
	          if (typeof this.font === "undefined") this.font = font_info;
	        }
	        this.prepared = true;
	      }
	      show() {
	        if (trial.pixi) {
	          this.pixi_obj.x = this.currentX;
	          this.pixi_obj.y = this.currentY;
	          this.pixi_obj.visible = true;
	        } else {
	          if (typeof this.filter === "undefined") {
	            ctx.filter = "none";
	          } else {
	            ctx.filter = this.filter;
	          }
	          ctx.lineWidth = this.line_width;
	          ctx.lineJoin = this.lineJoin;
	          ctx.miterLimit = this.miterLimit;
	          ctx.font = this.font;
	          ctx.fillStyle = this.text_color;
	          ctx.textAlign = "center";
	          ctx.textBaseline = "middle";
	          let column = [""];
	          let line = 0;
	          for (let i = 0; i < this.content.length; i++) {
	            let char = this.content.charAt(i);
	            if (char == "\n") {
	              line++;
	              column[line] = "";
	            } else {
	              column[line] += char;
	            }
	          }
	          for (let i = 0; i < column.length; i++) {
	            ctx.fillText(
	              column[i],
	              this.currentX,
	              this.currentY - this.text_space * (column.length - 1) / 2 + this.text_space * i
	            );
	          }
	        }
	      }
	    }
	    class manual_stimulus extends visual_stimulus {
	      constructor(stim) {
	        super(stim);
	        this.prepared = true;
	      }
	      show() {
	      }
	    }
	    class pixi_stimulus extends visual_stimulus {
	      constructor(stim) {
	        super(stim);
	        if (!trial.pixi) {
	          alert(
	            "To use Pixi objects, the pixi property of the psychophysics plugin must be set to true."
	          );
	          return;
	        }
	        this.pixi_obj.visible = false;
	        pixi_app.stage.addChild(this.pixi_obj);
	        this.prepared = true;
	      }
	      show() {
	        this.pixi_obj.x = this.currentX;
	        this.pixi_obj.y = this.currentY;
	        this.pixi_obj.visible = true;
	      }
	    }
	    function init_pixi_obj(obj) {
	      obj.anchor.set(0.5);
	      obj.visible = false;
	      pixi_app.stage.addChild(obj);
	    }
	    const jsPsych = this.jsPsych;
	    class audio_stimulus extends psychophysics_stimulus {
	      constructor(stim) {
	        super(stim);
	        if (typeof this.file === "undefined") {
	          alert("You have to specify the file property.");
	          return;
	        }
	        jsPsych.pluginAPI.getAudioPlayer(this.file).then((buffer) => {
	          this.audio = buffer;
	          this.prepared = true;
	        }).catch(
	          (err) => {
	            console.error(
	              `Failed to load audio file "${this.file}". Try checking the file path. We recommend using the preload plugin to load audio files.`
	            );
	            console.error(err);
	          }
	        );
	        if (this.trial_ends_after_audio) {
	          this.audio.addEventListener("ended", end_trial);
	        }
	      }
	      play() {
	        this.audio.play();
	      }
	      stop() {
	        this.audio.stop();
	        this.audio.removeEventListener("ended", end_trial);
	      }
	    }
	    if (typeof trial.stepFunc !== "undefined")
	      alert(
	        `The stepFunc is no longer supported. Please use the raf_func instead.`
	      );
	    const elm_jspsych_content = document.getElementById("jspsych-content");
	    const style_jspsych_content = window.getComputedStyle(elm_jspsych_content);
	    const default_maxWidth = style_jspsych_content.maxWidth;
	    elm_jspsych_content.style.maxWidth = "none";
	    if (trial.canvas_width === null)
	      trial.canvas_width = window.innerWidth - trial.canvas_offsetX;
	    if (trial.canvas_height === null)
	      trial.canvas_height = window.innerHeight - trial.canvas_offsetY;
	    let pixi_app;
	    let new_html = "";
	    const canvas_exist = document.getElementById("myCanvas") === null ? false : true;
	    if (!canvas_exist && trial.upper_prompt !== null) {
	      new_html += trial.upper_prompt;
	    }
	    if (!canvas_exist) {
	      if (trial.pixi) {
	        pixi_app = new PIXI__namespace.Application({
	          width: trial.canvas_width,
	          height: trial.canvas_height,
	          backgroundColor: getColorNum(trial.background_color)
	          // antialias: true,
	          // resolution: window.devicePixelRatio || 1,
	        });
	        display_element.appendChild(pixi_app.view);
	      } else {
	        new_html += '<canvas id="myCanvas" class="jspsych-canvas" width=' + trial.canvas_width + " height=" + trial.canvas_height + ' style="background-color:' + trial.background_color + ';"></canvas>';
	      }
	    }
	    const motion_rt_method = "performance";
	    let start_time;
	    let keyboardListener;
	    let response_flag = false;
	    this.jsPsych.pluginAPI.setTimeout(() => {
	      response_flag = true;
	      if (trial.response_type === "key") {
	        if (trial.choices != "NO_KEYS") {
	          keyboardListener = this.jsPsych.pluginAPI.getKeyboardResponse({
	            callback_function: after_response,
	            valid_responses: trial.choices,
	            rt_method: motion_rt_method,
	            persist: false,
	            allow_held_key: false
	          });
	        }
	      } else if (trial.response_type === "mouse") {
	        start_time = performance.now();
	        canvas.addEventListener("mousedown", mouseDownFunc);
	      } else {
	        start_time = performance.now();
	      }
	    }, trial.response_start_time);
	    if (!canvas_exist && trial.prompt !== null) {
	      new_html += trial.prompt;
	    }
	    if (!canvas_exist && trial.lower_prompt !== null) {
	      new_html += trial.lower_prompt;
	    }
	    display_element.insertAdjacentHTML("beforeend", new_html);
	    if (!canvas_exist && trial.response_type === "button") {
	      const buttonGroupElement = document.createElement("div");
	      buttonGroupElement.id = "jspsych-html-button-response-btngroup";
	      if (trial.button_layout === "grid") {
	        buttonGroupElement.classList.add("jspsych-btn-group-grid");
	        if (trial.grid_rows === null && trial.grid_columns === null) {
	          throw new Error(
	            "You cannot set `grid_rows` to `null` without providing a value for `grid_columns`."
	          );
	        }
	        const n_cols = trial.grid_columns === null ? Math.ceil(trial.button_choices.length / trial.grid_rows) : trial.grid_columns;
	        const n_rows = trial.grid_rows === null ? Math.ceil(trial.button_choices.length / trial.grid_columns) : trial.grid_rows;
	        buttonGroupElement.style.gridTemplateColumns = `repeat(${n_cols}, 1fr)`;
	        buttonGroupElement.style.gridTemplateRows = `repeat(${n_rows}, 1fr)`;
	      } else if (trial.button_layout === "flex") {
	        buttonGroupElement.classList.add("jspsych-btn-group-flex");
	      }
	      for (const [choiceIndex, choice] of trial.button_choices.entries()) {
	        buttonGroupElement.insertAdjacentHTML("beforeend", trial.button_html(choice, choiceIndex));
	        const buttonElement = buttonGroupElement.lastChild;
	        buttonElement.dataset.choice = choiceIndex.toString();
	        buttonElement.addEventListener("click", () => {
	          after_response({
	            key: -1,
	            rt: performance.now() - start_time,
	            button: choiceIndex
	          });
	        });
	      }
	      display_element.appendChild(buttonGroupElement);
	    }
	    const canvas = trial.pixi === true ? pixi_app.view : document.getElementById("myCanvas");
	    if (!canvas || !canvas.getContext) {
	      alert("This browser does not support the canvas element.");
	      return;
	    }
	    let centerX;
	    let centerY;
	    let ctx;
	    function set_canvas(canvas2, ratio, width, height) {
	      const ctx2 = canvas2.getContext("2d");
	      const canvas_scale = ratio;
	      canvas2.style.width = width + "px";
	      canvas2.style.height = height + "px";
	      if (!canvas_exist) {
	        canvas2.width = width * canvas_scale;
	        canvas2.height = height * canvas_scale;
	        ctx2.scale(canvas_scale, canvas_scale);
	      }
	      const centerX2 = canvas2.width / 2 / canvas_scale;
	      const centerY2 = canvas2.height / 2 / canvas_scale;
	      return {
	        ctx: ctx2,
	        centerX: centerX2,
	        centerY: centerY2
	      };
	    }
	    if (trial.pixi) {
	      centerX = pixi_app.screen.width / 2;
	      centerY = pixi_app.screen.height / 2;
	    } else {
	      const canvas_info = set_canvas(
	        canvas,
	        window.devicePixelRatio,
	        trial.canvas_width,
	        trial.canvas_height
	      );
	      centerX = canvas_info.centerX;
	      centerY = canvas_info.centerY;
	      ctx = canvas_info.ctx;
	      trial.context = ctx;
	    }
	    trial.canvas = canvas;
	    trial.centerX = centerX;
	    trial.centerY = centerY;
	    if (trial.mouse_down_func !== null) {
	      canvas.addEventListener("mousedown", trial.mouse_down_func);
	    }
	    if (trial.mouse_move_func !== null) {
	      canvas.addEventListener("mousemove", trial.mouse_move_func);
	    }
	    if (trial.mouse_up_func !== null) {
	      canvas.addEventListener("mouseup", trial.mouse_up_func);
	    }
	    if (trial.key_down_func !== null) {
	      document.addEventListener("keydown", trial.key_down_func);
	    }
	    if (trial.key_up_func !== null) {
	      document.addEventListener("keyup", trial.key_up_func);
	    }
	    if (trial.touchstart_func !== null) {
	      canvas.addEventListener("touchstart", trial.touchstart_func);
	    }
	    if (trial.touchend_func !== null) {
	      canvas.addEventListener("touchend", trial.touchend_func);
	    }
	    if (trial.touchcancel_func !== null) {
	      canvas.addEventListener("touchcancel", trial.touchcancel_func);
	    }
	    if (trial.touchmove_func !== null) {
	      canvas.addEventListener("touchmove", trial.touchmove_func);
	    }
	    if (typeof trial.stimuli === "undefined" && trial.raf_func === null) {
	      alert(
	        "You have to specify the stimuli/raf_func parameter in the psychophysics plugin."
	      );
	      return;
	    }
	    const set_instance = {
	      sound: audio_stimulus,
	      image: image_stimulus,
	      line: line_stimulus,
	      rect: rect_stimulus,
	      circle: circle_stimulus,
	      text: text_stimulus,
	      cross: cross_stimulus,
	      manual: manual_stimulus,
	      gabor: gabor_stimulus,
	      pixi: pixi_stimulus
	    };
	    if (typeof trial.stimuli !== "undefined") {
	      for (let i = 0; i < trial.stimuli.length; i++) {
	        const stim = trial.stimuli[i];
	        if (typeof stim.obj_type === "undefined") {
	          alert(
	            "You have missed to specify the obj_type property in the " + (i + 1) + "th object."
	          );
	          return;
	        }
	        stim.instance = new set_instance[stim.obj_type](stim);
	      }
	    }
	    function mouseDownFunc(e) {
	      let click_time;
	      click_time = performance.now();
	      e.preventDefault();
	      after_response({
	        key: -1,
	        rt: click_time - start_time,
	        // clickX: e.clientX,
	        // clickY: e.clientY,
	        clickX: e.offsetX,
	        clickY: e.offsetY
	      });
	    }
	    let startStep = null;
	    let sumOfStep;
	    let elapsedTime;
	    let prepare_check = true;
	    function step(timestamp) {
	      if (prepare_check) {
	        for (let i = 0; i < trial.stimuli.length; i++) {
	          if (!trial.stimuli[i].instance.prepared) {
	            frameRequestID = window.requestAnimationFrame(step);
	            return;
	          }
	        }
	      }
	      prepare_check = false;
	      if (!startStep) {
	        startStep = timestamp;
	        sumOfStep = 0;
	      } else {
	        sumOfStep += 1;
	      }
	      elapsedTime = timestamp - startStep;
	      if (trial.clear_canvas && !trial.pixi)
	        ctx.clearRect(0, 0, canvas.width, canvas.height);
	      if (trial.raf_func !== null) {
	        trial.raf_func(trial, elapsedTime, sumOfStep);
	        frameRequestID = window.requestAnimationFrame(step);
	        return;
	      }
	      for (let i = 0; i < trial.stimuli.length; i++) {
	        const stim = trial.stimuli[i].instance;
	        const elapsed = stim.is_frame ? sumOfStep : elapsedTime;
	        const show_start = stim.is_frame ? stim.show_start_frame : stim.show_start_time;
	        const show_end = stim.is_frame ? stim.show_end_frame : stim.show_end_time;
	        if (stim.obj_type === "sound") {
	          if (elapsed >= show_start && !stim.is_presented) {
	            stim.play();
	            stim.is_presented = true;
	          }
	          continue;
	        }
	        if (trial.pixi) {
	          if (elapsed < show_start) {
	            stim.pixi_obj.visible = false;
	            continue;
	          }
	          if (show_end !== null && elapsed >= show_end) {
	            stim.pixi_obj.visible = false;
	            continue;
	          }
	        } else {
	          if (elapsed < show_start) continue;
	          if (show_end !== null && elapsed >= show_end) continue;
	          if (trial.clear_canvas === false && stim.is_presented) continue;
	        }
	        stim.update_position(elapsed);
	        if (stim.drawFunc !== null) {
	          stim.drawFunc(stim, canvas, ctx, elapsedTime, sumOfStep);
	        } else {
	          if (stim.change_attr != null)
	            stim.change_attr(stim, elapsedTime, sumOfStep);
	          stim.show();
	        }
	        stim.is_presented = true;
	      }
	      frameRequestID = window.requestAnimationFrame(step);
	    }
	    let frameRequestID = window.requestAnimationFrame(step);
	    function deg2rad(degrees) {
	      return degrees / 180 * Math.PI;
	    }
	    let response = {
	      rt: null,
	      key: null
	    };
	    const end_trial = () => {
	      document.getElementById("jspsych-content").style.maxWidth = default_maxWidth;
	      window.cancelAnimationFrame(frameRequestID);
	      canvas.removeEventListener("mousedown", mouseDownFunc);
	      if (trial.mouse_down_func !== null) {
	        canvas.removeEventListener("mousedown", trial.mouse_down_func);
	      }
	      if (trial.mouse_move_func !== null) {
	        canvas.removeEventListener("mousemove", trial.mouse_move_func);
	      }
	      if (trial.mouse_up_func !== null) {
	        canvas.removeEventListener("mouseup", trial.mouse_up_func);
	      }
	      if (trial.touchstart_func !== null) {
	        canvas.removeEventListener("touchstart", trial.touchstart_func);
	      }
	      if (trial.touchend_func !== null) {
	        canvas.removeEventListener("touchend", trial.touchend_func);
	      }
	      if (trial.touchcancel_func !== null) {
	        canvas.removeEventListener("touchcancel", trial.touchcancel_func);
	      }
	      if (trial.touchmove_func !== null) {
	        canvas.removeEventListener("touchmove", trial.touchmove_func);
	      }
	      if (trial.key_down_func !== null) {
	        document.removeEventListener("keydown", trial.key_down_func);
	      }
	      if (trial.key_up_func !== null) {
	        document.removeEventListener("keyup", trial.key_up_func);
	      }
	      if (typeof trial.stimuli !== "undefined") {
	        for (let i = 0; i < trial.stimuli.length; i++) {
	          const stim = trial.stimuli[i].instance;
	          if (typeof stim.pixi_obj !== "undefined") stim.pixi_obj.destroy();
	          if (stim.obj_type === "sound") {
	            stim.stop();
	          }
	        }
	      }
	      if (!trial.remain_canvas && trial.pixi)
	        pixi_app.destroy(true, {
	          children: true,
	          texture: true,
	          baseTexture: true
	        });
	      this.jsPsych.pluginAPI.clearAllTimeouts();
	      if (typeof keyboardListener !== "undefined") {
	        this.jsPsych.pluginAPI.cancelKeyboardResponse(keyboardListener);
	      }
	      this.jsPsych.pluginAPI.cancelAllKeyboardResponses();
	      const trial_data = {};
	      trial_data["rt"] = response.rt;
	      trial_data["response_type"] = trial.response_type;
	      trial_data["key_press"] = response.key;
	      trial_data["response"] = response.key;
	      trial_data["avg_frame_time"] = elapsedTime / sumOfStep;
	      trial_data["center_x"] = centerX;
	      trial_data["center_y"] = centerY;
	      if (trial.response_type === "mouse") {
	        trial_data["click_x"] = response.clickX;
	        trial_data["click_y"] = response.clickY;
	      } else if (trial.response_type === "button") {
	        trial_data["button_pressed"] = response.button;
	        trial_data["response"] = response.button;
	      }
	      if (!trial.remain_canvas) {
	        display_element.innerHTML = "";
	      }
	      this.jsPsych.finishTrial(trial_data);
	    };
	    trial.end_trial = end_trial;
	    function after_response(info2) {
	      if (!response_flag) return;
	      if (response.key == null) {
	        response = info2;
	      }
	      if (trial.response_type === "button") {
	        let btns = document.querySelectorAll(
	          ".jspsych-image-button-response-button button"
	        );
	        for (let i = 0; i < btns.length; i++) {
	          btns[i].setAttribute("disabled", "disabled");
	        }
	      }
	      if (trial.response_ends_trial) {
	        end_trial();
	      }
	    }
	    if (trial.trial_duration !== null) {
	      this.jsPsych.pluginAPI.setTimeout(function() {
	        end_trial();
	      }, trial.trial_duration);
	    }
	  }
	  simulate(trial, simulation_mode, simulation_options, load_callback) {
	    if (simulation_mode == "data-only") {
	      load_callback();
	      this.simulate_data_only(trial, simulation_options);
	    }
	    if (simulation_mode == "visual") {
	      this.simulate_visual(trial, simulation_options, load_callback);
	    }
	  }
	  create_simulation_data(trial, simulation_options) {
	    let resp = -1;
	    if (trial.response_type === "key") {
	      resp = this.jsPsych.pluginAPI.getValidKey(trial.choices);
	    }
	    if (trial.response_type === "button") {
	      resp = this.jsPsych.randomization.randomInt(
	        0,
	        trial.button_choices.length - 1
	      );
	    }
	    const default_data = {
	      stimulus: trial.stimulus,
	      rt: this.jsPsych.randomization.sampleExGaussian(500, 50, 1 / 150, true),
	      response: resp
	    };
	    const data = this.jsPsych.pluginAPI.mergeSimulationData(
	      default_data,
	      simulation_options
	    );
	    this.jsPsych.pluginAPI.ensureSimulationDataConsistency(trial, data);
	    return data;
	  }
	  simulate_data_only(trial, simulation_options) {
	    const data = this.create_simulation_data(trial, simulation_options);
	    this.jsPsych.finishTrial(data);
	  }
	  simulate_visual(trial, simulation_options, load_callback) {
	    const data = this.create_simulation_data(trial, simulation_options);
	    const display_element = this.jsPsych.getDisplayElement();
	    this.trial(display_element, trial);
	    load_callback();
	    if (data.rt !== null) {
	      switch (trial.response_type) {
	        case "key":
	          this.jsPsych.pluginAPI.pressKey(data.response, data.rt);
	          break;
	        case "button":
	          this.jsPsych.pluginAPI.clickTarget(
	            display_element.querySelector(
	              `#jspsych-html-button-response-btngroup [data-choice="${data.response}"]`
	            ),
	            data.rt
	          );
	          break;
	        case "mouse": {
	          const client_rect = document.getElementById("myCanvas").getBoundingClientRect();
	          if (typeof data.click_x === "undefined") data.click_x = 0;
	          if (typeof data.click_y === "undefined") data.click_y = 0;
	          const mouse_event = new MouseEvent("mousedown", {
	            bubbles: true,
	            clientX: data.click_x + client_rect.left,
	            // Note that click_x is offsetX.
	            clientY: data.click_y + client_rect.top
	          });
	          setTimeout(() => {
	            document.getElementById("myCanvas").dispatchEvent(mouse_event);
	          }, data.rt);
	          break;
	        }
	      }
	    }
	  }
	}

	return PsychophysicsPlugin;

})(jsPsychModule, PIXI);
//# sourceMappingURL=index.browser.js.map
