import Vue from 'vue'

import VueGettext from '../../src/'
import translations from './json/directive.json'
import uninstallPlugin from '../testUtils'


describe('translate directive tests', () => {
  const baseOptions = {
    availableLanguages: {
      en_US: 'American English',
      fr_FR: 'Français',
    },
    defaultLanguage: 'en_US',
    translations: translations,
  }

  beforeEach(function () {
    Vue.use(VueGettext)
    console.warn = sinon.spy(console, 'warn')
    console.info = sinon.spy(console, 'info')
  })

  afterEach(function () {
    uninstallPlugin(Vue, VueGettext)
    console.warn.restore()
    console.info.restore()
  })

  it('works on empty strings', () => {
    const options = Object.assign({}, baseOptions, { language: 'fr_FR' })
    const gettext = new VueGettext(options)
    let vm = new Vue({gettext, template: '<div v-translate></div>'}).$mount()
    expect(vm.$el.innerHTML).to.equal('')
  })

  it('returns an unchanged string when no translation is available for a language', () => {
    const options = Object.assign({}, baseOptions)
    const gettext = new VueGettext(options)
    let vm = new Vue({gettext, template: '<div v-translate>Unchanged string</div>'}).$mount()
    vm.$currentLanguage = 'fr_BE'
    expect(vm.$el.innerHTML).to.equal('Unchanged string')
    expect(console.warn).calledOnce
  })

  it('returns an unchanged string when no translation key is available', () => {
    const options = Object.assign({}, baseOptions)
    const gettext = new VueGettext(options)
    let vm = new Vue({gettext, template: '<div v-translate>Untranslated string</div>'}).$mount()
    expect(vm.$el.innerHTML).to.equal('Untranslated string')
    expect(console.warn).calledOnce
  })

  it('translates known strings', () => {
    const options = Object.assign({}, baseOptions, { language: 'fr_FR' })
    const gettext = new VueGettext(options)
    let vm = new Vue({gettext, template: '<div v-translate>Pending</div>'}).$mount()
    expect(vm.$el.innerHTML).to.equal('En cours')
  })

  it('translates multiline strings as-is, preserving the original content', () => {
    const options = Object.assign({}, baseOptions, { language: 'fr_FR' })
    const gettext = new VueGettext(options)
    let vm = new Vue({gettext, template: '<p v-translate>A\n\n\nlot\n\n\nof\n\nlines</p>'}).$mount()
    expect(vm.$el.innerHTML).to.equal('Plein\n\n\nde\n\nlignes')
  })

  it('translates known strings according to a given translation context', () => {
    const options = Object.assign({}, baseOptions)
    const gettext = new VueGettext(options)
    let vm = new Vue({gettext, template: '<div v-translate translate-context="Verb">Answer</div>'}).$mount()
    expect(vm.$el.innerHTML).to.equal('Answer (verb)')
    vm = new Vue({gettext, template: '<div v-translate translate-context="Noun">Answer</div>'}).$mount()
    expect(vm.$el.innerHTML).to.equal('Answer (noun)')
  })

  it('works with text content', () => {
    const options = Object.assign({}, baseOptions)
    const gettext = new VueGettext(options)
    let vm = new Vue({gettext, template: '<div v-translate>This is sparta!</div>'}).$mount()
    expect(vm.$el.innerHTML).to.equal('This is sparta!')
  })

  it('works with HTML content', () => {
    const options = Object.assign({}, baseOptions)
    const gettext = new VueGettext(options)
    let vm = new Vue({gettext, template: '<div v-translate>This is <strong class="txt-primary">sparta</strong>!</div>'}).$mount()
    expect(vm.$el.innerHTML).to.equal('This is <strong class="txt-primary">sparta</strong>!')
  })

  it('allows interpolation', () => {
    const options = Object.assign({}, baseOptions, { language: 'fr_FR' })
    const gettext = new VueGettext(options)
    let vm = new Vue({
      gettext,
      template: '<p v-translate>Hello <strong>%{ name }</strong></p>',
      data: {name: 'John Doe'},
    }).$mount()
    expect(vm.$el.innerHTML).to.equal('Bonjour <strong>John Doe</strong>')
  })

  it('allows interpolation with computed property', () => {
    const options = Object.assign({}, baseOptions, { language: 'fr_FR' })
    const gettext = new VueGettext(options)
    let vm = new Vue({
      gettext,
      template: '<p v-translate>Hello <strong>%{ name }</strong></p>',
      computed: {
        name () { return 'John Doe' },
      },
    }).$mount()
    expect(vm.$el.innerHTML).to.equal('Bonjour <strong>John Doe</strong>')
  })

  it('allows custom params for interpolation', () => {
    const options = Object.assign({}, baseOptions, { language: 'fr_FR' })
    const gettext = new VueGettext(options)
    let vm = new Vue({
      gettext,
      template: '<p v-translate="{name: someNewNameVar}">Hello <strong>%{ name }</strong></p>',
      data: {
        someNewNameVar: 'John Doe',
      },
    }).$mount()
    expect(vm.$el.innerHTML.trim()).to.equal('Bonjour <strong>John Doe</strong>')
  })

  it('allows interpolation within v-for with custom params', () => {
    const options = Object.assign({}, baseOptions, { language: 'fr_FR' })
    const gettext = new VueGettext(options)
    let names = ['John Doe', 'Chester']
    let vm = new Vue({
      gettext,
      template: '<p><span v-for="name in names" v-translate="{name: name}">Hello <strong>%{ name }</strong></span></p>',
      data: {
        names,
      },
    }).$mount()
    let html = vm.$el.innerHTML.trim()
    let missedName = names.some((name) => {
      if (html.indexOf(name) === -1) {
        return true
      }
    })
    expect(missedName).to.equal(false)
  })

  it('logs a warning in the console if translate-params is used', () => {
    const options = Object.assign({}, baseOptions, { language: 'fr_FR' })
    const gettext = new VueGettext(options)
    let vm = new Vue({
      gettext,
      template: '<p v-translate :translate-params="{name: someNewNameVar}">Hello <strong>%{ name }</strong></p>',
      data: {
        someNewNameVar: 'John Doe',
      },
    }).$mount()
    expect(vm.$el.innerHTML.trim()).to.equal('Bonjour <strong>name</strong>')
    expect(console.warn).called
  })

  it('updates a translation after a data change', (done) => {
    const options = Object.assign({}, baseOptions, { language: 'fr_FR' })
    const gettext = new VueGettext(options)
    let vm = new Vue({
      gettext,
      template: '<p v-translate="name">Hello <strong>%{ name }</strong></p>',
      data: {name: 'John Doe'},
    }).$mount()
    expect(vm.$el.innerHTML).to.equal('Bonjour <strong>John Doe</strong>')
    vm.name = 'Kenny'
    vm.$nextTick(function () {
      expect(vm.$el.innerHTML).to.equal('Bonjour <strong>Kenny</strong>')
      done()
    })
  })

  it('logs an info in the console if an interpolation is required but an expression is not provided', () => {
    const options = Object.assign({}, baseOptions, { language: 'fr_FR' })
    const gettext = new VueGettext(options)
    let vm = new Vue({
      gettext,
      template: '<p v-translate>Hello <strong>%{ name }</strong></p>',
      data: {name: 'John Doe'},
    }).$mount()
    expect(vm.$el.innerHTML).to.equal('Bonjour <strong>John Doe</strong>')
    expect(console.info).calledOnce
  })

  it('translates plurals', () => {
    const options = Object.assign({}, baseOptions, { language: 'fr_FR' })
    const gettext = new VueGettext(options)
    let vm = new Vue({
      gettext,
      template: '<p v-translate :translate-n="count" translate-plural="<strong>%{ count }</strong> cars"><strong>%{ count }</strong> car</p>',
      data: {count: 2},
    }).$mount()
    expect(vm.$el.innerHTML).to.equal('<strong>2</strong> véhicules')
  })

  it('translates plurals with computed property', () => {
    const options = Object.assign({}, baseOptions, { language: 'fr_FR' })
    const gettext = new VueGettext(options)
    let vm = new Vue({
      gettext,
      template: '<p v-translate :translate-n="count" translate-plural="<strong>%{ count }</strong> cars"><strong>%{ count }</strong> car</p>',
      computed: {
        count () { return 2 },
      },
    }).$mount()
    expect(vm.$el.innerHTML).to.equal('<strong>2</strong> véhicules')
  })

  it('updates a plural translation after a data change', (done) => {
    const options = Object.assign({}, baseOptions, { language: 'fr_FR' })
    const gettext = new VueGettext(options)
    let vm = new Vue({
      gettext,
      template: '<p v-translate="count + brand" :translate-n="count" translate-plural="<strong>%{ count }</strong> %{ brand } cars"><strong>%{ count }</strong> %{ brand } car</p>',
      data: {count: 1, brand: 'Toyota'},
    }).$mount()
    expect(vm.$el.innerHTML).to.equal('<strong>1</strong> Toyota véhicule')
    vm.count = 8
    vm.$nextTick(function () {
      expect(vm.$el.innerHTML).to.equal('<strong>8</strong> Toyota véhicules')
      done()
    })
  })

  it('updates a translation after a language change', (done) => {
    const options = Object.assign({}, baseOptions, { language: 'fr_FR' })
    const gettext = new VueGettext(options)
    let vm = new Vue({gettext, template: '<div v-translate>Pending</div>'}).$mount()
    expect(vm.$el.innerHTML).to.equal('En cours')
    vm.$currentLanguage = 'en_US'
    vm.$nextTick(function () {
      expect(vm.$el.innerHTML).to.equal('Pending')
      done()
    })
  })

  it('supports conditional rendering such as v-if, v-else-if, v-else', (done) => {
    const options = Object.assign({}, baseOptions)
    const gettext = new VueGettext(options)
    let vm = new Vue({
      gettext,
      template: `
      <div v-if="show" v-translate>Pending</div>
      <div v-else v-translate>Hello <strong>%{ name }</strong></div>
      `,
      data: {show: true, name: 'John Doe'},
    }).$mount()
    expect(vm.$el.innerHTML).to.equal('Pending')
    vm.show = false
    vm.$nextTick(function () {
      expect(vm.$el.innerHTML).to.equal('Hello <strong>John Doe</strong>')
      done()
    })
  })

})
