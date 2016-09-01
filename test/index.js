'use strict'
const test = require('tape')
const Observable = require('vigour-observable')
const State = require('vigour-state')
const is = require('../')
const vstamp = require('vigour-stamp')

test('is - callback', (t) => {
  t.plan(4)
  const obs = new Observable({ inject: is })
  obs.is('james', (val, stamp) => {
    vstamp.done(stamp, () => t.same(obs.emitters.data.fn.keys(), [], 'removes listeners after fire'))
  })
  obs.set('james')
  obs.is((val, data, stamp, target) => {
    t.same(target, obs, 'target argument')
    return val === 'james'
  }, () => {
    t.same(obs.emitters.data.fn.keys(), [], 'removes listeners after fire, fires with a function')
  })
  obs.is(null, () => {
    t.ok(true, 'fires on remove')
  })
  obs.remove()
})

test('is - multiple listeners', (t) => {
  t.plan(2)
  const obs = new Observable({ inject: is })
  const a = () => {}
  const b = () => {}
  obs.on(a)
  obs.is('james', (val, stamp, target) => {
    t.same(target, obs, 'target argument')
    vstamp.done(stamp, () => t.same(obs.emitters.data.fn.keys(), [1, 3], 'removes listeners after fire'))
  })
  obs.on(b)
  obs.set('james')
})

test('is - promise', (t) => {
  t.plan(3)
  const obs = new Observable({ inject: is })
  obs.is('james').then(() => {
    t.same(obs.emitters.data.fn.keys(), [], 'removes listeners after fire')
  })
  obs.set('james')
  obs.is((val) => val === 'james').then((target, val, stamp) => {
    t.same(target, obs, 'target argument')
    t.same(target.emitters.data.fn.keys(), [], 'removes listeners after fire, fires with a function')
  })
  obs.set('hello')
})

test('is - multiple is listeners on observable', (t) => {
  t.plan(1)
  const obs = new Observable({ inject: is })
  let cnt = 0
  obs.is((val) => typeof val === 'string', () => {
    ++cnt
  })
  obs.is((val) => typeof val === 'string', () => {
    ++cnt
  })
  obs.set('working')
  t.equal(cnt, 2, 'is cb should be fired twice')
})

test('is - multiple is listeners on state', (t) => {
  t.plan(1)
  const state = new State({
    a: {}
  })
  let cnt = 0
  state.get('a.b', {}).is((val) => typeof val === 'string', function () {
    ++cnt
  })
  state.get('a.b', {}).is((val) => typeof val === 'string', function () {
    ++cnt
  })
  state.set({a: {
    b: 'is'
  }})
  t.equal(cnt, 2, 'is cb should be fired twice')
})
