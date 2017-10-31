import Vue from 'vue'

import VueGettext from '../../src/'
// import translate from '../../src/translate'
import translations from './json/translate.json'
import uninstallPlugin from '../testUtils'


describe('Translate tests', () => {
  const baseOptions = {
    availableLanguages: {
      en_US: 'American English',
      fr_FR: 'Français',
    },
    defaultLanguage: 'en_US',
    translations: translations,
    silent: false,
  }

  let gettext
  beforeEach(function () {
    uninstallPlugin(Vue, VueGettext)
    Vue.use(VueGettext)
    gettext = new VueGettext(baseOptions)
  })

  let translated

  it('tests the getTranslation() method', () => {

    translated = gettext.getTranslation('', 1, null, 'fr_FR')
    expect(translated).to.equal('')

    translated = gettext.getTranslation('Unexisting language', null, null, null, 'be_FR')
    expect(translated).to.equal('Unexisting language')

    translated = gettext.getTranslation('Untranslated key', null, null, null, 'fr_FR')
    expect(translated).to.equal('Untranslated key')

    translated = gettext.getTranslation('Pending', 1, null, null, 'fr_FR')
    expect(translated).to.equal('En cours')

    translated = gettext.getTranslation('%{ carCount } car', 2, null, null, 'fr_FR')
    expect(translated).to.equal('%{ carCount } véhicules')

    translated = gettext.getTranslation('Answer', 1, 'Verb', null, 'fr_FR')
    expect(translated).to.equal('Réponse (verbe)')

    translated = gettext.getTranslation('Answer', 1, 'Noun', null, 'fr_FR')
    expect(translated).to.equal('Réponse (nom)')

    translated = gettext.getTranslation('Pending', 1, null, null, 'en_US')
    expect(translated).to.equal('Pending')

    // If no translation exists, display the default singular form (if n < 2).
    translated = gettext.getTranslation('Untranslated %{ n } item', 0, null, 'Untranslated %{ n } items', 'fr_FR')
    expect(translated).to.equal('Untranslated %{ n } item')

    // If no translation exists, display the default plural form (if n > 1).
    translated = gettext.getTranslation('Untranslated %{ n } item', 10, null, 'Untranslated %{ n } items', 'fr_FR')
    expect(translated).to.equal('Untranslated %{ n } items')

    // Test that it works when a msgid exists with and without a context, see #32.
    translated = gettext.getTranslation('Object', null, null, null, 'fr_FR')
    expect(translated).to.equal('Objet')
    translated = gettext.getTranslation('Object', null, 'Context', null, 'fr_FR')
    expect(translated).to.equal('Objet avec contexte')

    // Ensure that pluralization is right in English when there are no English translations.
    translated = gettext.getTranslation('Untranslated %{ n } item', 0, null, 'Untranslated %{ n } items', 'en_US')
    expect(translated).to.equal('Untranslated %{ n } items')
    translated = gettext.getTranslation('Untranslated %{ n } item', 1, null, 'Untranslated %{ n } items', 'en_US')
    expect(translated).to.equal('Untranslated %{ n } item')
    translated = gettext.getTranslation('Untranslated %{ n } item', 2, null, 'Untranslated %{ n } items', 'en_US')
    expect(translated).to.equal('Untranslated %{ n } items')

  })

  it('tests the gettext() method', () => {

    let undetectableGettext = gettext.gettext.bind(gettext)  // Hide from xgettext.

    gettext.language = 'fr_FR'
    expect(undetectableGettext('Pending')).to.equal('En cours')

    gettext.language = 'en_US'
    expect(undetectableGettext('Pending')).to.equal('Pending')

  })

  it('tests the pgettext() method', () => {

    let undetectablePgettext = gettext.pgettext.bind(gettext)  // Hide from xgettext.

    gettext.language = 'fr_FR'
    expect(undetectablePgettext('Noun', 'Answer')).to.equal('Réponse (nom)')

    gettext.language = 'en_US'
    expect(undetectablePgettext('Noun', 'Answer')).to.equal('Answer (noun)')

  })

  it('tests the ngettext() method', () => {

    let undetectableNgettext = gettext.ngettext.bind(gettext)  // Hide from xgettext.

    gettext.language = 'fr_FR'
    expect(undetectableNgettext('%{ carCount } car', '%{ carCount } cars', 2)).to.equal('%{ carCount } véhicules')

    gettext.language = 'en_US'
    expect(undetectableNgettext('%{ carCount } car', '%{ carCount } cars', 2)).to.equal('%{ carCount } cars')

    // If no translation exists, display the default singular form (if n < 2).
    gettext.language = 'fr_FR'
    expect(undetectableNgettext('Untranslated %{ n } item', 'Untranslated %{ n } items', -1))
      .to.equal('Untranslated %{ n } item')

    // If no translation exists, display the default plural form (if n > 1).
    gettext.language = 'fr_FR'
    expect(undetectableNgettext('Untranslated %{ n } item', 'Untranslated %{ n } items', 2))
      .to.equal('Untranslated %{ n } items')

  })

  it('tests the npgettext() method', () => {

    let undetectableNpgettext = gettext.npgettext.bind(gettext)  // Hide from xgettext.

    gettext.language = 'fr_FR'
    expect(undetectableNpgettext('Noun', '%{ carCount } car (noun)', '%{ carCount } cars (noun)', 2))
      .to.equal('%{ carCount } véhicules (nom)')

    gettext.language = 'en_US'
    expect(undetectableNpgettext('Verb', '%{ carCount } car (verb)', '%{ carCount } cars (verb)', 2))
      .to.equal('%{ carCount } cars (verb)')

    gettext.language = 'fr_FR'
    expect(undetectableNpgettext('Noun', '%{ carCount } car (noun)', '%{ carCount } cars (noun)', 1))
      .to.equal('%{ carCount } véhicule (nom)')

    gettext.language = 'en_US'
    expect(undetectableNpgettext('Verb', '%{ carCount } car (verb)', '%{ carCount } cars (verb)', 1))
      .to.equal('%{ carCount } car (verb)')

    // If no translation exists, display the default singular form (if n < 2).
    gettext.language = 'fr_FR'
    expect(undetectableNpgettext('Noun', 'Untranslated %{ n } item (noun)', 'Untranslated %{ n } items (noun)', 1))
      .to.equal('Untranslated %{ n } item (noun)')

    // If no translation exists, display the default plural form (if n > 1).
    gettext.language = 'fr_FR'
    expect(undetectableNpgettext('Noun', 'Untranslated %{ n } item (noun)', 'Untranslated %{ n } items (noun)', 2))
      .to.equal('Untranslated %{ n } items (noun)')

  })

})
