'use strict'
const vstamp = require('vigour-stamp')

exports.define = {
  is (val, callback, id, stamp) {
    const type = typeof val
    const parsed = this.val
    var _this = this
    var compare, promise
    if (type === 'function') {
      compare = val
    } else {
      compare = function (compare) {
        return !val && val === null
          ? compare === val
          : compare == val // eslint-disable-line
      }
    }

    if (!callback) {
      let cancel = function () {
        promise.cancel()
      }
      _this = _this.on('removeEmitter', cancel)
      promise = new Promise(function (resolve, reject) {
        callback = function (data, stamp) {
          vstamp.done(stamp, () => _this.off('data', id === void 0 ? is : id))
          vstamp.done(stamp, () => _this.off('removeEmitter', cancel))
          resolve(_this, data, stamp)
        }
      })
    }
    if (compare.call(_this, parsed, void 0, stamp, _this)) {
      if (callback) {
        callback.call(_this, parsed, stamp, _this)
      }
    } else {
      _this = _this.on('data', is, id)
    }
    function is (data, stamp) {
      if (compare.call(_this, _this.val, data, stamp, _this)) {
        vstamp.done(stamp, () => _this.off('data', id === void 0 ? is : id))
        callback.call(_this, data, stamp, _this)
      }
    }
    return promise || _this
  }
}
