import Vue from 'vue'

import VueGettext from '../../src/'
import translations from './json/plugin.config.json'
import uninstallPlugin from '../testUtils'


describe('GetText plugin configuration tests', () => {

  beforeEach(function () {
    console.warn = sinon.spy(console, 'warn')
  })

  afterEach(function () {
    uninstallPlugin(Vue, VueGettext)
    console.warn.restore()
  })

  it('raises an error when an unknown option is used', () => {
    expect(function () {
      /* jslint ignore */
      const gettext = new VueGettext({unknownOption: null, translations: {}})
      gettext !== null
    }).to.throw('unknownOption is an invalid option for the translate plugin.')
  })

  it('raises an error when there are no translations', () => {
    expect(function () {
      const gettext = new VueGettext({})
      gettext === null
    }).to.throw('No translations available.')
  })

  // it('allows to add a mixin to languageVm', () => {
  //   Vue.use(VueGettext)
  //   const gettext = new VueGettext({
  //     availableLanguages: {
  //       en_GB: 'English',
  //       fr_FR: 'Français',
  //     },
  //     defaultLanguage: 'fr_FR',
  //     translations: {},
  //     languageVmMixin: {
  //       computed: {
  //         currentKebabCase: function () {
  //           return this.current.toLowerCase().replace('_', '-')
  //         },
  //       },
  //     },
  //   })
  //   let vm = new Vue({gettext, template: '<div>Foo</div>'}).$mount()
  //   expect(vm.$language.currentKebabCase).to.equal('fr-fr')
  //   vm.$language.current = 'en_GB'
  //   expect(vm.$language.currentKebabCase).to.equal('en-gb')
  // })

})

describe('GetText plugin `silent` option tests', () => {

  beforeEach(function () {
    console.warn = sinon.spy(console, 'warn')
  })

  afterEach(function () {
    uninstallPlugin(Vue, VueGettext)
    console.warn.restore()
  })

  it('warnings are ON for a missing language when `silent` is false', () => {
    Vue.use(VueGettext)
    const gettext = new VueGettext({
      translations: translations,
      defaultLanguage: 'pt_BR',
    })
    expect(translations.hasOwnProperty('pt_BR')).to.be.false
    let vm = new Vue({gettext, template: '<div><translate>Bar</translate></div>'}).$mount()
    expect(vm.$el.innerHTML.trim()).to.equal('<span>Bar</span>')
    expect(console.warn).calledOnce
    expect(console.warn.calledWith('No translations found for pt_BR')).to.be.true
  })

  it('warnings are OFF for a missing language when `silent` is true', () => {
    Vue.use(VueGettext)
    const gettext = new VueGettext({
      translations: translations,
      silent: true,
      defaultLanguage: 'pt_BR',
    })
    expect(translations.hasOwnProperty('pt_BR')).to.be.false
    let vm = new Vue({gettext, template: '<div><translate>Bar</translate></div>'}).$mount()
    expect(vm.$el.innerHTML.trim()).to.equal('<span>Bar</span>')
    expect(console.warn).notCalled
  })

  it('warnings are ON for a missing translation key when `silent` is false', () => {
    Vue.use(VueGettext)
    const gettext = new VueGettext({
      translations: translations,
      defaultLanguage: 'fr_FR',
    })
    let vm = new Vue({gettext, template: '<div><translate>Bar</translate></div>'}).$mount()
    expect(translations.fr_FR.hasOwnProperty('Bar')).to.be.false
    expect(vm.$el.innerHTML.trim()).to.equal('<span>Bar</span>')
    expect(console.warn).calledOnce
    expect(console.warn.calledWith('Untranslated fr_FR key found:\nBar')).to.be.true
  })

  it('warnings are OFF for a missing translation key when `silent` is true', () => {
    Vue.use(VueGettext)
    const gettext = new VueGettext({
      translations: translations,
      silent: true,
      defaultLanguage: 'fr_FR',
    })
    let vm = new Vue({gettext, template: '<div><translate>Bar</translate></div>'}).$mount()
    expect(translations.fr_FR.hasOwnProperty('Bar')).to.be.false
    expect(vm.$el.innerHTML.trim()).to.equal('<span>Bar</span>')
    expect(console.warn).notCalled
  })

})
