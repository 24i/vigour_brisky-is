'use strict'
const Promise = require('bluebird')
const vstamp = require('vigour-stamp')
Promise.config({ cancellation: true })

exports.define = {
  is (val, callback, stamp) {
    const type = typeof val
    const parsed = this.val
    const _this = this
    var compare, promise

    if (type === 'function') {
      compare = val
    } else {
      compare = function (compare) {
        return compare == val // eslint-disable-line
      }
    }

    if (!callback) {
      let cancel = function () {
        promise.cancel()
      }
      _this.on('removeEmitter', cancel)
      promise = new Promise(function (resolve, reject, onCancel) {
        onCancel(function () {
          _this.off('data', is)
          _this.off('removeEmitter', cancel)
        })
        // reject
        callback = function (data, stamp) {
          vstamp.done(stamp, () => _this.off('data', is))
          vstamp.done(stamp, () => _this.off('removeEmitter', cancel))
          resolve(this, data, stamp)
        }
      })
    }

    if (compare.call(this, parsed, void 0, stamp, this)) {
      if (callback) {
        callback.call(this, parsed, stamp, this)
      }
    } else {
      this.on('data', is)
    }

    function is (data, stamp) {
      if (compare.call(this, this.val, data, stamp, this)) {
        vstamp.done(stamp, () => _this.off('data', is))
        callback.call(this, data, stamp, this)
      }
    }
    return promise || this
  }
}
