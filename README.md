# is
# brisky-core
<!-- VDOC.badges travis; standard; npm; coveralls -->

`.is` api for observables (observes until a value fulfils conditions) build in promise support

```javascript
  // add a once listener
  obs.is('something', () => {
    console.log('fire!')
  })

  // fire!
  obs.set('something')

  // fire immediatly
  obs.is('something', () => {
    console.log('fire!')
  })

  // fire immmediatly, as a promise
  obs.is('something').then(() => {
    console.log('fire')
  })
```