'use strict'
const test = require('tape')
const Observable = require('vigour-observable')
const is = require('../')

test('is - callback', function (t) {
  t.plan(2)
  const obs = new Observable({ inject: is })
  obs.is('james', () => {
    t.same(obs.emitters.data.fn.keys(), [], 'removes listeners after fire')
  })
  obs.set('james')
  obs.is('james', () => {
    t.same(obs.emitters.data.fn.keys(), [], 'removes listeners after fire')
  })
})

test('is - promise', function (t) {
  t.plan(1)
  const obs = new Observable({ inject: is })
  obs.is('james').then(() => {
    t.same(obs.emitters.data.fn.keys(), [], 'removes listeners after fire')
  })
  obs.set('james')
})
