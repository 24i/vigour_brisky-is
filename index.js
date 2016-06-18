'use strict'
var Promise = require('bluebird')
Promise.config({ cancellation: true })

exports.define = {
  is (val, callback, stamp) {
    var type = typeof val
    var compare
    var promise
    var parsed = this.val
    var _this = this

    if (type === 'function') {
      compare = val
    } else {
      compare = function (compare) {
        return compare == val //eslint-disable-line
      }
    }

    if (!callback) {
      let cancel = function () {
        promise.cancel()
      }
      promise = new Promise(function (resolve, reject, onCancel) {
        onCancel(function () {
          _this.off('data', is)
          _this.off('remove', cancel)
        })
        // reject
        callback = function (data, stamp) {
          _this.off('remove', cancel)
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
