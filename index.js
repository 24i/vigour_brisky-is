'use strict'
const vstamp = require('vigour-stamp')

exports.define = {
  is (val, callback, id, stamp, attach) {
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
      promise = new Promise((resolve, reject) => {
        callback = function (data, stamp) {
          vstamp.done(stamp, () => _this.off('data', id === void 0 ? is : id))
          resolve(_this, data, stamp)
        }
      })
    }
    if (compare.call(_this, parsed, void 0, stamp, _this)) {
      if (callback) {
        callback.call(_this, parsed, stamp, _this)
      }
    } else {
      if (attach) {
        attach = [ is, attach ]
        _this = _this.on('data', attach, id)
      } else {
        _this = _this.on('data', is, id)
      }
    }
    function is (data, stamp) {
      if (compare.call(_this, _this.val, data, stamp, _this)) {
        if (attach) {
          vstamp.done(stamp, () => _this.off('data', attach))
        } else {
          vstamp.done(stamp, () => _this.off('data', id === void 0 ? is : id))
        }
        callback.call(_this, data, stamp, _this)
      }
    }
    return promise || _this
  }
}
