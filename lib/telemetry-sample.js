'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _irsdkConstants = require('./irsdk-constants');

var _irsdkConstants2 = _interopRequireDefault(_irsdkConstants);

var _ramda = require('ramda');

var _ramda2 = _interopRequireDefault(_ramda);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var variableHeaders = new WeakMap();

var TelemetrySample = function () {
  function TelemetrySample(buff, varHeaders) {
    _classCallCheck(this, TelemetrySample);

    this._buff = buff;
    variableHeaders.set(this, varHeaders);
  }

  _createClass(TelemetrySample, [{
    key: 'getParam',
    value: function getParam(sampleVariableName) {
      var header = variableHeaders.get(this).find(function (h) {
        return h.name.toLowerCase() === sampleVariableName.toLowerCase();
      });

      if (!header) {
        return null;
      }

      var variable = _irsdkConstants2.default.varType[header.type];
      var valueBuffer = this._buff.slice(header.offset, header.offset + variable.size);

      return {
        name: header.name,
        description: header.description,
        value: valueBuffer[variable.jsBufferMethod](),
        unit: header.unit
      };
    }
  }, {
    key: 'toJSON',
    value: function toJSON() {
      var _this = this;

      var getParam = function getParam(x) {
        return _this.getParam(x);
      };
      var getName = _ramda2.default.prop('name');
      var valueFromHeader = _ramda2.default.compose(_ramda2.default.pick(['value', 'unit']), getParam, getName);

      return variableHeaders.get(this).reduce(function (accum, header) {
        return _ramda2.default.assoc(getName(header), valueFromHeader(header), accum);
      }, {});
    }
  }]);

  return TelemetrySample;
}();

exports.default = TelemetrySample;