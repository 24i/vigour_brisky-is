'use strict'
const test = require('tape')
const Observable = require('vigour-observable')
const is = require('../')
const vstamp = require('vigour-stamp')

test('is - callback', (t) => {
  t.plan(2)
  const obs = new Observable({ inject: is })
  obs.is('james', (val, stamp) => {
    vstamp.done(stamp, () => t.same(obs.emitters.data.fn.keys(), [], 'removes listeners after fire'))
  })
  obs.set('james')
  obs.is((val) => val === 'james', () => {
    t.same(obs.emitters.data.fn.keys(), [], 'removes listeners after fire, fires with a function')
  })
})

test('is - multiple lsiteners', (t) => {
  t.plan(1)
  const obs = new Observable({ inject: is })
  const a = () => {}
  const b = () => {}
  obs.on(a)
  obs.is('james', (val, stamp) => {
    vstamp.done(stamp, () => t.same(obs.emitters.data.fn.keys(), [1, 3], 'removes listeners after fire'))
  })
  obs.on(b)
  obs.set('james')
})

test('is - promise', (t) => {
  t.plan(2)
  const obs = new Observable({ inject: is })
  obs.is('james').then(() => {
    t.same(obs.emitters.data.fn.keys(), [], 'removes listeners after fire')
  })
  obs.set('james')
  obs.is((val) => val === 'james').then((obs, val, stamp) => {
    t.same(obs.emitters.data.fn.keys(), [], 'removes listeners after fire, fires with a function')
  })
  obs.set('hello')
})

test('is - promise - cancel', (t) => {
  const obs = new Observable({ inject: is })
  const promise = obs.is('james')
  obs.remove()
  setTimeout(() => {
    t.equal(promise._onCancelField, void 0, 'cancelled promise')
    t.end()
  }, 1000)
})

test('is - promise - cancel on obs.remove()', (t) => {
  const obs = new Observable({ inject: is })
  const promise = obs.is('james')
  promise.cancel()
  setTimeout(() => {
    t.same(obs.emitters.data.fn.keys(), [], 'removed listener on cancel')
    t.end()
  })
})
