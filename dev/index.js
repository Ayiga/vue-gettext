import './styles/global.css'

import Vue from 'vue'

import VueGettext from '../src/index'
import translations from './translations.json'

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
  translations: translations,
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
