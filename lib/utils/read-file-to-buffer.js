'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Read a file from the start position and return a buffer of the supplied length
var readFileToBuffer = function readFileToBuffer(fd, startPosition, bufferLength) {
  return new Promise(function (resolve, reject) {
    var buffer = Buffer.alloc(bufferLength);
    _fs2.default.read(fd, buffer, 0, bufferLength, startPosition, function (err, num) {
      err ? reject(err) : resolve(buffer);
    });
  });
};

exports.default = readFileToBuffer;