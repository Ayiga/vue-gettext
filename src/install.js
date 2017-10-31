import Component from './component'
import Directive from './directive'
import extend from './extend'
import mixin from './mixin'

export let Vue

export function install (_Vue) {
  /* istanbul ignore if */
  if (process.env.NODE_ENV !== 'production' && install.installed) {
    console.warn('already installed.')
    return
  }

  // if (process.env.NODE_ENV !== 'production' && version < 2) {
  //   console.warn(`vue-i18n (${install.version}) need to use Vue 2.0 or later (Vue: ${Vue.version}).`)
  //   return
  // }
  install.installed = true
  Vue = _Vue

  Object.defineProperty(Vue.prototype, '$gettextInst', {
    get () { return this._gettextRoot._gettext },
    configurable: process.env.NODE_ENV === 'testing',
  })

  Object.defineProperty(Vue.prototype, '$currentLanguage', {
    get () { return this._gettextRoot._gettext.language },
    set (value) { this._gettextRoot._gettext.language = value },
    configurable: process.env.NODE_ENV === 'testing',
  })

  Object.defineProperty(Vue.prototype, '$availableLanguages', {
    get () { return this._gettextRoot._gettext.available },
    configurable: process.env.NODE_ENV === 'testing',
  })

  extend(Vue)
  Vue.mixin(mixin)
  // Makes <translate> available as a global component.
  Vue.component('translate', Component)

  // An option to support translation with HTML content: `v-translate`.
  Vue.directive('translate', Directive)
}
