'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var SIZE_IN_BYTES = 144;

/**
 *
 * Total size: 144 bytes
 */

var VarHeader = function () {
  /**
   * Construct an instance of VarHeader
   *
   * params = {
   *   type,
   *   offset,
   *   count,
   *   countAsTime,
   *   name,
   *   description,
   *   unit
   * }
   */
  function VarHeader(params) {
    _classCallCheck(this, VarHeader);

    Object.assign(this, params);
  }

  /**
   * Instantiate VarHeader from the contents of the supplied buffer
   */


  _createClass(VarHeader, null, [{
    key: 'fromBuffer',
    value: function fromBuffer(buffer) {
      if (buffer.length !== SIZE_IN_BYTES) {
        throw new RangeError('Buffer length for VarHeader needs to be ' + SIZE_IN_BYTES + ', supplied ' + buffer.length);
      }

      return new VarHeader({
        type: buffer.slice(0, 4).readInt32LE(),
        offset: buffer.slice(4, 8).readInt32LE(),
        count: buffer.slice(8, 12).readInt32LE(),
        countAsTime: buffer.slice(12, 13).readInt8(),
        // padding here, 16 byte align (3 bytes)
        name: buffer.slice(16, 48).toString().replace(/\0/g, ''),
        description: buffer.slice(48, 112).toString().replace(/\0/g, ''),
        unit: buffer.slice(112, 144).toString().replace(/\0/g, '')
      });
    }
  }]);

  return VarHeader;
}();

exports.SIZE_IN_BYTES = SIZE_IN_BYTES;
exports.VarHeader = VarHeader;
exports.default = VarHeader;