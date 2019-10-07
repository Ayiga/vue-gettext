import './styles/global.css'

import Vue from 'vue'

import VueGettext from '../src/index'
// import translations from './translations.json'

import AlertComponent from './components/alert'
import CustomTags from './components/customTags'
import DirectiveComponent from './components/directive'
import IfComponent from './components/if'
import LanguageSelectComponent from './components/languageSelect'
import MultiLinesComponent from './components/multilines'
import PluralComponent from './components/plural'


Vue.use(VueGettext)

const gettext = new VueGettext({
  availableLanguages: {
    en_GB: 'British English',
    fr_FR: 'Français',
    it_IT: 'Italiano',
  },
  defaultLanguage: 'en_GB',
  translations: {
    en_GB: require('./locale/en_GB/LC_MESSAGES/app.po'),
    fr_FR: require('./locale/fr_FR/LC_MESSAGES/app.po'),
    it_IT: require('./locale/it_IT/LC_MESSAGES/app.po'),
  },
})

export let vm = new Vue({
  gettext,
  el: '#app',
  components: {
    'alert': AlertComponent,
    'custom-tags': CustomTags,
    'directive': DirectiveComponent,
    'if': IfComponent,
    'language-select': LanguageSelectComponent,
    'multilines': MultiLinesComponent,
    'plural': PluralComponent,
  },
})
