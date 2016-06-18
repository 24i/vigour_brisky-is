'use strict'
const test = require('tape')
const Observable = require('vigour-observable')
const is = require('../')

test('is - callback', (t) => {
  t.plan(2)
  const obs = new Observable({ inject: is })
  obs.is('james', () => {
    t.same(obs.emitters.data.fn.keys(), [], 'removes listeners after fire')
  })
  obs.set('james')
  obs.is((val) => val === 'james', () => {
    t.same(obs.emitters.data.fn.keys(), [], 'removes listeners after fire, fires with a function')
  })
})

test('is - promise', (t) => {
  t.plan(2)
  const obs = new Observable({ inject: is })
  obs.is('james').then(() => {
    t.same(obs.emitters.data.fn.keys(), [], 'removes listeners after fire')
  })
  obs.set('james')
  obs.is((val) => val === 'james').then(() => {
    t.same(obs.emitters.data.fn.keys(), [], 'removes listeners after fire, fires with a function')
  })
})

test('is - promise - cancel', (t) => {
  const obs = new Observable({ inject: is })
  const promise = obs.is((val) => val === 'something')
  obs.remove()
  t.same(promise.isCancelled(), true, 'promise is cancelled')
  t.end()
})
