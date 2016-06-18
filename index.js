'use strict'
const Promise = require('bluebird')
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
          _this.off('removeEmitter', cancel)
          resolve(this, data, stamp)
        }
      })
    }

    if (compare.call(this, parsed, void 0, stamp)) {
      if (callback) {
        callback.call(this, parsed, stamp)
      }
    } else {
      this.on('data', is)
    }

    function is (data, event) {
      if (compare.call(this, this.val, data, stamp)) {
        _this.off('data', is)
        callback.call(this, data, stamp)
      }
    }
    return promise || this
  }
}
