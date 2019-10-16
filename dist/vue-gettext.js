/**
 * vue-gettext v2.1.0
 * (c) 2019 Polyconseil
 * @license MIT
 */
(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global.VueGettext = factory());
}(this, (function () { 'use strict';

// Polyfill Object.assign for legacy browsers.
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/assign

if (typeof Object.assign !== 'function') {
  (function () {
    Object.assign = function (target) {
      'use strict';
      var arguments$1 = arguments;

      var output;
      var index;
      var source;
      var nextKey;
      if (target === undefined || target === null) {
        throw new TypeError('Cannot convert undefined or null to object')
      }
      output = Object(target);
      for (index = 1; index < arguments.length; index++) {
        source = arguments$1[index];
        if (source !== undefined && source !== null) {
          for (nextKey in source) {
            if (source.hasOwnProperty(nextKey)) {
              output[nextKey] = source[nextKey];
            }
          }
        }
      }
      return output
    };
  }());
}

/**
 * Plural Forms
 *
 * This is a list of the plural forms, as used by Gettext PO, that are appropriate to each language.
 * http://docs.translatehouse.org/projects/localization-guide/en/latest/l10n/pluralforms.html
 *
 * This is a replica of angular-gettext's plural.js
 * https://github.com/rubenv/angular-gettext/blob/master/src/plural.js
 */
var plurals = {

  getTranslationIndex: function (languageCode, n) {
    n = parseInt(n);
    n = typeof n === 'number' && isNaN(n) ? 1 : n;  // Fallback to singular.

    // Extract the ISO 639 language code. The ISO 639 standard defines
    // two-letter codes for many languages, and three-letter codes for
    // more rarely used languages.
    // https://www.gnu.org/software/gettext/manual/html_node/Language-Codes.html#Language-Codes
    if (languageCode.length > 2 && languageCode !== 'pt_BR' && languageCode !== 'pt-BR') {
      languageCode = languageCode.split(/_|-/g)[0];
    }

    switch (languageCode) {
      case 'ay':  // Aymará
      case 'bo':  // Tibetan
      case 'cgg': // Chiga
      case 'dz':  // Dzongkha
      case 'fa':  // Persian
      case 'id':  // Indonesian
      case 'ja':  // Japanese
      case 'jbo': // Lojban
      case 'ka':  // Georgian
      case 'kk':  // Kazakh
      case 'km':  // Khmer
      case 'ko':  // Korean
      case 'ky':  // Kyrgyz
      case 'lo':  // Lao
      case 'ms':  // Malay
      case 'my':  // Burmese
      case 'sah': // Yakut
      case 'su':  // Sundanese
      case 'th':  // Thai
      case 'tt':  // Tatar
      case 'ug':  // Uyghur
      case 'vi':  // Vietnamese
      case 'wo':  // Wolof
      case 'zh':  // Chinese
        // 1 form
        return 0
      case 'is':  // Icelandic
        // 2 forms
        return (n % 10 !== 1 || n % 100 === 11) ? 1 : 0
      case 'jv':  // Javanese
        // 2 forms
        return n !== 0 ? 1 : 0
      case 'mk':  // Macedonian
        // 2 forms
        return n === 1 || n % 10 === 1 ? 0 : 1
      case 'ach': // Acholi
      case 'ak':  // Akan
      case 'am':  // Amharic
      case 'arn': // Mapudungun
      case 'br':  // Breton
      case 'fil': // Filipino
      case 'fr':  // French
      case 'gun': // Gun
      case 'ln':  // Lingala
      case 'mfe': // Mauritian Creole
      case 'mg':  // Malagasy
      case 'mi':  // Maori
      case 'oc':  // Occitan
      case 'pt_BR':  // Brazilian Portuguese
      case 'pt-BR':  // Brazilian Portuguese
      case 'tg':  // Tajik
      case 'ti':  // Tigrinya
      case 'tr':  // Turkish
      case 'uz':  // Uzbek
      case 'wa':  // Walloon
      case 'lv':  // Latvian
        // 3 forms
        return (n % 10 === 1 && n % 100 !== 11 ? 0 : n !== 0 ? 1 : 2)
      case 'lt':  // Lithuanian
        // 3 forms
        return (n % 10 === 1 && n % 100 !== 11 ? 0 : n % 10 >= 2 && (n % 100 < 10 || n % 100 >= 20) ? 1 : 2)
      case 'be':  // Belarusian
      case 'bs':  // Bosnian
      case 'hr':  // Croatian
      case 'ru':  // Russian
      case 'sr':  // Serbian
      case 'uk':  // Ukrainian
        // 3 forms
        return (
          n % 10 === 1 && n % 100 !== 11 ? 0 : n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 10 || n % 100 >= 20) ? 1 : 2)
      case 'mnk': // Mandinka
        // 3 forms
        return (n === 0 ? 0 : n === 1 ? 1 : 2)
      case 'ro':  // Romanian
        // 3 forms
        return (n === 1 ? 0 : (n === 0 || (n % 100 > 0 && n % 100 < 20)) ? 1 : 2)
      case 'pl':  // Polish
        // 3 forms
        return (n === 1 ? 0 : n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 10 || n % 100 >= 20) ? 1 : 2)
      case 'cs':  // Czech
      case 'sk':  // Slovak
        // 3 forms
        return (n === 1) ? 0 : (n >= 2 && n <= 4) ? 1 : 2
      case 'csb': // Kashubian
        // 3 forms
        return (n === 1) ? 0 : n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 10 || n % 100 >= 20) ? 1 : 2
      case 'sl':  // Slovenian
        // 4 forms
        return (n % 100 === 1 ? 0 : n % 100 === 2 ? 1 : n % 100 === 3 || n % 100 === 4 ? 2 : 3)
      case 'mt':  // Maltese
        // 4 forms
        return (n === 1 ? 0 : n === 0 || (n % 100 > 1 && n % 100 < 11) ? 1 : (n % 100 > 10 && n % 100 < 20) ? 2 : 3)
      case 'gd':  // Scottish Gaelic
        // 4 forms
        return (n === 1 || n === 11) ? 0 : (n === 2 || n === 12) ? 1 : (n > 2 && n < 20) ? 2 : 3
      case 'cy':  // Welsh
        // 4 forms
        return (n === 1) ? 0 : (n === 2) ? 1 : (n !== 8 && n !== 11) ? 2 : 3
      case 'kw':  // Cornish
        // 4 forms
        return (n === 1) ? 0 : (n === 2) ? 1 : (n === 3) ? 2 : 3
      case 'ga':  // Irish
        // 5 forms
        return n === 1 ? 0 : n === 2 ? 1 : (n > 2 && n < 7) ? 2 : (n > 6 && n < 11) ? 3 : 4
      case 'ar':  // Arabic
        // 6 forms
        return (n === 0 ? 0 : n === 1 ? 1 : n === 2 ? 2 : n % 100 >= 3 && n % 100 <= 10 ? 3 : n % 100 >= 11 ? 4 : 5)
      default: // Everything else
        return n !== 1 ? 1 : 0
    }
  },

};

// UUID v4 generator (RFC4122 compliant).
//
// https://gist.github.com/jcxplorer/823878

function uuid () {

  var uuid = '';
  var i;
  var random;

  for (i = 0; i < 32; i++) {
    random = Math.random() * 16 | 0;
    if (i === 8 || i === 12 || i === 16 || i === 20) {
      uuid += '-';
    }
    uuid += (i === 12 ? 4 : (i === 16 ? (random & 3 | 8) : random)).toString(16);
  }

  return uuid

}

/**
 * Translate content according to the current language.
 */
var Component = {

  name: 'translate',

  created: function () {

    this.msgid = '';  // Don't crash the app with an empty component, i.e.: <translate></translate>.

    // Store the raw uninterpolated string to translate.
    // This is currently done by looking inside a private attribute `_renderChildren` of the current
    // Vue instance's instantiation options.
    // However spaces introduced by newlines are not exactly the same between the HTML and the
    // content of `_renderChildren`, e.g. 6 spaces becomes 4 etc. See issue #15 for problems which
    // can arise with this.
    // I haven't (yet) found a better way to access the raw content of the component.
    if (this.$options._renderChildren) {
      if (this.$options._renderChildren[0].hasOwnProperty('text')) {
        this.msgid = this.$options._renderChildren[0].text.trim();
      } else {
        this.msgid = this.$options._renderChildren[0].trim();
      }
    }

    this.isPlural = this.translateN !== undefined && this.translatePlural !== undefined;
    if (!this.isPlural && (this.translateN || this.translatePlural)) {
      throw new Error(("`translate-n` and `translate-plural` attributes must be used together: " + (this.msgid) + "."))
    }

  },

  props: {
    tag: {
      type: String,
      default: 'span',
    },
    // Always use v-bind for dynamically binding the `translateN` prop to data on the parent,
    // i.e.: `:translateN`.
    translateN: {
      type: Number,
      required: false,
    },
    translatePlural: {
      type: String,
      required: false,
    },
    translateContext: {
      type: String,
      required: false,
    },
    translateParams: {
      type: Object,
      required: false,
    },
    // `translateComment` is used exclusively by `easygettext`'s `gettext-extract`.
    translateComment: {
      type: String,
      required: false,
    },
  },

  computed: {
    translation: function () {
      var translation = this.$gettextInst.getTranslation(
        this.msgid,
        this.translateN,
        this.translateContext,
        this.isPlural ? this.translatePlural : null,
        this.$currentLanguage
      );

      var context = this.$parent;

      if (this.translateParams) {
        context = Object.assign({}, this.$parent, this.translateParams);
      }

      return this.$gettextInterpolate(translation, context)
    },
  },

  render: function (createElement) {

    // Fix the problem with v-if, see #29.
    // Vue re-uses DOM elements for efficiency if they don't have a key attribute, see:
    // https://vuejs.org/v2/guide/conditional.html#Controlling-Reusable-Elements-with-key
    // https://vuejs.org/v2/api/#key
    if (!this.$vnode.key) {
      this.$vnode.key = uuid();
    }

    // The text must be wraped inside a root HTML element, so we use a <span> (by default).
    // https://github.com/vuejs/vue/blob/a4fcdb/src/compiler/parser/index.js#L209
    return createElement(this.tag, [this.translation])

  },

};

var updateTranslation = function (el, binding, vnode) {
  var gettext = vnode.context.$gettextInst;
  var msgid = el.dataset.msgid;

  // Output a info in the console if an interpolation is required but no expression is provided.
  if (!gettext.vm.silent) {
    var hasInterpolation = msgid.indexOf(VueGettext.INTERPOLATION_PREFIX) !== -1;
    if (hasInterpolation && !binding.expression) {
      console.info(("No expression is provided for change detection. The translation for this key will be static:\n" + msgid));
    }
  }

  var attrs = vnode.data.attrs || {};
  var translateContext = attrs['translate-context'];
  var translateN = attrs['translate-n'];
  var translatePlural = attrs['translate-plural'];
  var isPlural = translateN !== undefined && translatePlural !== undefined;
  var context = vnode.context;

  if (!isPlural && (translateN || translatePlural)) {
    throw new Error('`translate-n` and `translate-plural` attributes must be used together:' + msgid + '.')
  }

  if (!gettext.vm.silent && attrs['translate-params']) {
    console.warn(("`translate-params` is required as an expression for v-translate directive. Please change to `v-translate='params'`: " + msgid));
  }

  if (binding.value && typeof binding.value === 'object') {
    context = Object.assign({}, vnode.context, binding.value);
  }

  var translation = gettext.getTranslation(
    msgid,
    translateN,
    translateContext,
    isPlural ? translatePlural : null,
    el.dataset.currentLanguage
  );

  var msg = gettext.interpolate(translation, context);

  el.innerHTML = msg;

};

/**
 * A directive to translate content according to the current language.
 *
 * Use this directive instead of the component if you need to translate HTML content.
 * It's too tricky to support HTML content within the component because we cannot get the raw HTML to use as `msgid`.
 *
 * This directive has a similar interface to the <translate> component, supporting
 * `translate-comment`, `translate-context`, `translate-plural`, `translate-n`.
 *
 * `<p v-translate translate-comment='Good stuff'>This is <strong class='txt-primary'>Sparta</strong>!</p>`
 *
 * If you need interpolation, you must add an expression that outputs binding value that changes with each of the
 * context variable:
 * `<p v-translate="fullName + location">I am %{ fullName } and from %{ location }</p>`
 */
var Directive = {

  bind: function bind (el, binding, vnode) {
    var gettext = vnode.context.$gettextInst;

    // Fix the problem with v-if, see #29.
    // Vue re-uses DOM elements for efficiency if they don't have a key attribute, see:
    // https://vuejs.org/v2/guide/conditional.html#Controlling-Reusable-Elements-with-key
    // https://vuejs.org/v2/api/#key
    if (!vnode.key) {
      vnode.key = uuid();
    }

    // Get the raw HTML and store it in the element's dataset (as advised in Vue's official guide).
    // Note: not trimming the content here as it should be picked up as-is by the extractor.
    var msgid = el.innerHTML;
    el.dataset.msgid = msgid;

    // Store the current language in the element's dataset.
    el.dataset.currentLanguage = gettext.language;

    updateTranslation(el, binding, vnode);

  },

  update: function update (el, binding, vnode) {
    var gettext = vnode.context.$gettextInst;
    var doUpdate = false;

    // Trigger an update if the language has changed.
    if (el.dataset.currentLanguage !== gettext.vm.language) {
      el.dataset.currentLanguage = gettext.vm.language;
      doUpdate = true;
    }

    // Trigger an update if an optional bound expression has changed.
    if (!doUpdate && binding.expression && (binding.value !== binding.oldValue)) {
      doUpdate = true;
    }

    if (doUpdate) {
      updateTranslation(el, binding, vnode);
    }

  },

};

function extend (Vue) {
  // Exposes instance methods.
  Vue.prototype.$gettext = function (msgid) {
    return this.$gettextInst.gettext(msgid)
  };

  Vue.prototype.$pgettext = function (context, msgid) {
    return this.$gettextInst.pgettext(context, msgid)
  };

  Vue.prototype.$ngettext = function (msgid, plural, n) {
    return this.$gettextInst.ngettext(msgid, plural, n)
  };

  Vue.prototype.$npgettext = function (context, msgid, plural, n) {
    return this.$gettextInst.npgettext(context, msgid, plural, n)
  };

  Vue.prototype.$gettextInterpolate = function (msgid, context) {
    return this.$gettextInst.interpolate(msgid, context)
  };

  Vue.prototype.$gettextAddTranslations = function (nextTranslations) {
    this._gettextRoot._gettext.translations = Object.assign(
      {},
      this._gettextRoot._gettext.translations,
      nextTranslations
    );
  };

  Vue.prototype.$gettextAddLanguages = function (nextLanguages) {
    this._gettextRoot._gettext.availableLanguages = Object.assign(
      {},
      this._gettextRoot._gettext.availableLanguages,
      nextLanguages
    );
  };
}

var mixin = {
  beforeCreate: function beforeCreate () {
    var options = this.$options;
    options.gettext = options.gettext || null;

    if (this.$options.gettext) {
      this._gettext = this.$options.gettext;
      this._gettextRoot = this;
      // init?
    } else {
      this._gettextRoot = this.$parent && this.$parent._gettextRoot || this;
    }
  },

  beforeDestroy: function beforeDestroy () {
    this._gettext = null;
  },
};

var Vue;

function install (_Vue) {
  /* istanbul ignore if */
  if (process.env.NODE_ENV !== 'production' && install.installed) {
    console.warn('already installed.');
    return
  }

  // if (process.env.NODE_ENV !== 'production' && version < 2) {
  //   console.warn(`vue-i18n (${install.version}) need to use Vue 2.0 or later (Vue: ${Vue.version}).`)
  //   return
  // }
  install.installed = true;
  Vue = _Vue;

  Object.defineProperty(Vue.prototype, '$gettextInst', {
    get: function get () { return this._gettextRoot._gettext },
    configurable: process.env.NODE_ENV === 'testing',
  });

  Object.defineProperty(Vue.prototype, '$currentLanguage', {
    get: function get () { return this._gettextRoot._gettext.language },
    set: function set (value) { this._gettextRoot._gettext.language = value; },
    configurable: process.env.NODE_ENV === 'testing',
  });

  Object.defineProperty(Vue.prototype, '$availableLanguages', {
    get: function get () { return this._gettextRoot._gettext.available },
    configurable: process.env.NODE_ENV === 'testing',
  });

  extend(Vue);
  Vue.mixin(mixin);
  // Makes <translate> available as a global component.
  Vue.component('translate', Component);

  // An option to support translation with HTML content: `v-translate`.
  Vue.directive('translate', Directive);
}

var EVALUATION_RE = /[[\].]{1,2}/g;

/* Interpolation RegExp.
 *
 * Because interpolation inside attributes are deprecated in Vue 2 we have to
 * use another set of delimiters to be able to use `translate-plural` etc.
 * We use %{ } delimiters.
 *
 * /
 *   %\{                => Starting delimiter: `%{`
 *     (                => Start capture
 *       (?:.|\n)       => Non-capturing group: any character or newline
 *       +?             => One or more times (ungreedy)
 *     )                => End capture
 *   \}                 => Ending delimiter: `}`
 * /g                   => Global: don't return after first match
 */
var INTERPOLATION_RE = /%\{((?:.|\n)+?)\}/g;

var MUSTACHE_SYNTAX_RE = /\{\{((?:.|\n)+?)\}\}/g;
var VueGettext = function VueGettext (options) {
  if ( options === void 0 ) options = {};

  var defaultConfig = {
    availableLanguages: { en_US: 'English (United States)' },
    defaultLanguage: 'en_US',
    // languageVmMixin: {},
    silent: Vue && Vue.config && Vue.config.silent,
    translations: {},
  };

  Object.keys(options).forEach(function (key) {
    if (Object.keys(defaultConfig).indexOf(key) === -1 && key !== 'language') {
      throw new Error((key + " is an invalid option for the translate plugin."))
    }
  });

  if (!options.translations) {
    throw new Error('No translations available.')
  }

  var finalOptions = Object.assign({},
    defaultConfig,
    options);

  var available = finalOptions.availableLanguages || defaultConfig.availableLanguages;
  var language = finalOptions.language || finalOptions.defaultLanguage || defaultConfig.defaultLanguage;
  var translations = finalOptions.translations || {};
  var activeTranslations = translations[language] || {};
  var silent = finalOptions.silent;

  this._initVM({
    available: available,
    language: language,
    silent: silent,
    translations: translations,
    activeTranslations: activeTranslations,
  });
};

var prototypeAccessors = { vm: { configurable: true },available: { configurable: true },language: { configurable: true },activeTranslations: { configurable: true },translations: { configurable: true } };

VueGettext.prototype._initVM = function _initVM (data) {
  this._vm = new Vue({ data: data });
};

prototypeAccessors.vm.get = function () { return this._vm };

prototypeAccessors.available.get = function () { return this._vm.available };
prototypeAccessors.language.get = function () { return this._vm.language };
prototypeAccessors.language.set = function (value) {
  if (typeof this._vm.available[value] === 'undefined') {
    return
  }
  if (typeof this._vm.translations[value] === 'undefined') {
    return
  }
  this._vm.language = value;
  this._vm.activeTranslations = this._vm.translations[value] || {};
};
prototypeAccessors.activeTranslations.get = function () { return this._vm.activeTranslations };
prototypeAccessors.translations.get = function () { return this._vm.translations };

/**
* Get the translated string from the translation.json file generated by easygettext.
*
* @param {String} msgid - The translation key
* @param {Number} n - The number to switch between singular and plural
* @param {String} context - The translation key context
* @param {String} defaultPlural - The default plural value (optional)
* @param {String} language - The language ID (e.g. 'fr_FR' or 'en_US')
*
* @return {String} The translated string
*/
VueGettext.prototype.getTranslation = function getTranslation (msgid, n, context, defaultPlural, language) {
    if ( n === void 0 ) n = 1;
    if ( context === void 0 ) context = null;
    if ( defaultPlural === void 0 ) defaultPlural = null;
    if ( language === void 0 ) language = this.language;

  if (!msgid) {
    return ''// Allow empty strings.
  }

  // `easygettext`'s `gettext-compile` generates a JSON version of a .po file based on its `Language` field.
  // But in this field, `ll_CC` combinations denoting a language’s main dialect are abbreviated as `ll`,
  // for example `de` is equivalent to `de_DE` (German as spoken in Germany).
  // See the `Language` section in https://www.gnu.org/software/gettext/manual/html_node/Header-Entry.html
  // So try `ll_CC` first, or the `ll` abbreviation which can be three-letter sometimes:
  // https://www.gnu.org/software/gettext/manual/html_node/Language-Codes.html#Language-Codes
  var translations = this.activeTranslations;

  if (!translations) {
    if (!this._vm.silent) {
      console.warn(("No translations found for " + language));
    }
    // Returns the untranslated string, singular or plural.
    return defaultPlural && plurals.getTranslationIndex(language, n) > 0 ? defaultPlural : msgid
  }

  var translated = translations[msgid];

  // Sometimes msgid may not have the same number of spaces than its key. This could happen e.g. when using
  // new lines. See comments in the `created` hook of `component.js` and issue #15 for more information.
  if (!translated && /\s{2,}/g.test(msgid)) {
    Object.keys(translations).some(function (key) {
      if (key.replace(/\s{2,}/g, ' ') === msgid.trim().replace(/\s{2,}/g, ' ')) {
        translated = translations[key];
        return translated
      }
    });
  }

  if (!translated) {
    if (!this._vm.silent) {
      console.warn(("Untranslated " + language + " key found:\n" + msgid));
    }
    // Returns the untranslated string, singular or plural.
    return defaultPlural && plurals.getTranslationIndex(language, n) > 0 ? defaultPlural : msgid
  }

  if (context) {
    translated = translated[context];
  }

  if (typeof translated === 'string') {
    translated = [null, translated];
  }

  // Avoid a crash when a msgid exists with and without a context, see #32.
  if (!(translated instanceof Array) && translated.hasOwnProperty('')) {
    // As things currently stand, the void key means a void context for easygettext.
    translated = [translated['']];
  }

  var portion = translated[plurals.getTranslationIndex(language, n) + 1];


  if (typeof portion === 'string') {
    return portion
  }

  return portion[0]
};

/**
* Returns a string of the translation of the message.
* Also makes the string discoverable by xgettext.
*
* @param {String} msgid - The translation key
*
* @return {String} The translated string
*/
VueGettext.prototype.gettext = function gettext (msgid) {
  return this.getTranslation(msgid)
};

/**
* Returns a string of the translation for the given context.
* Also makes the string discoverable by xgettext.
*
* @param {String} context - The context of the string to translate
* @param {String} msgid - The translation key
*
* @return {String} The translated string
*/
VueGettext.prototype.pgettext = function pgettext (context, msgid) {
  return this.getTranslation(msgid, 1, context)
};

/**
* Returns a string of the translation of either the singular or plural,
* based on the number.
* Also makes the string discoverable by xgettext.
*
* @param {String} msgid - The translation key
* @param {String} plural - The plural form of the translation key
* @param {Number} n - The number to switch between singular and plural
*
* @return {String} The translated string
*/
VueGettext.prototype.ngettext = function ngettext (msgid, plural, n) {
  return this.getTranslation(msgid, n, null, plural)
};

/**
* Returns a string of the translation of either the singular or plural,
* based on the number, for the given context.
* Also makes the string discoverable by xgettext.
*
* @param {String} context - The context of the string to translate
* @param {String} msgid - The translation key
* @param {String} plural - The plural form of the translation key
* @param {Number} n - The number to switch between singular and plural
*
* @return {String} The translated string
*/
VueGettext.prototype.npgettext = function npgettext (context, msgid, plural, n) {
  return this.getTranslation(msgid, n, context, plural)
};

/**
 * Evaluate a piece of template string containing %{ } placeholders.
 * E.g.: 'Hi %{ user.name }' => 'Hi Bob'
 *
 * This is a vm.$interpolate alternative for Vue 2.
 * https://vuejs.org/v2/guide/migration.html#vm-interpolate-removed
 *
 * @param {String} msgid - The translation key containing %{ } placeholders
 * @param {Object} context - An object whose elements are put in their corresponding placeholders
 *
 * @return {String} The interpolated string
 */
VueGettext.prototype.interpolate = function interpolate (msgid, context) {
    if ( context === void 0 ) context = {};

  if (!this._vm.silent && MUSTACHE_SYNTAX_RE.test(msgid)) {
    console.warn(("Mustache syntax cannot be used with vue-gettext. Please use \"%{}\" instead of \"{{}}\" in: " + msgid));
  }

  var result = msgid.replace(INTERPOLATION_RE, function (match, token) {

    var expression = token.trim();
    var evaluated;

    // Avoid eval() by splitting `expression` and looping through its different properties if any, see #55.
    function getProps (obj, expression) {
      var arr = expression.split(EVALUATION_RE).filter(function (x) { return x; });
      while (arr.length) {
        obj = obj[arr.shift()];
      }
      return obj
    }

    function evalInContext (expression) {
      try {
        evaluated = getProps(this, expression);
      } catch (e) {
        // Ignore errors, because this function may be called recursively later.
      }
      if (evaluated === undefined) {
        if (this.$parent) {
          // Recursively climb the $parent chain to allow evaluation inside nested components, see #23 and #24.
          return evalInContext.call(this.$parent, expression)
        } else {
          console.warn(("Cannot evaluate expression: " + expression));
          evaluated = expression;
        }
      }
      return evaluated
    }

    return evalInContext.call(context, expression)

  });

  return result

};

Object.defineProperties( VueGettext.prototype, prototypeAccessors );

VueGettext.install = install;

// Store this values as function attributes for easy access elsewhere to bypass a Rollup
// weak point with `export`:
// https://github.com/rollup/rollup/blob/fca14d/src/utils/getExportMode.js#L27
VueGettext.INTERPOLATION_RE = INTERPOLATION_RE;
VueGettext.INTERPOLATION_PREFIX = '%{';

return VueGettext;

})));
