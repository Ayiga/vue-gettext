import uuid from './uuid'
import VueGettext from './index'

const updateTranslation = (el, binding, vnode) => {
  const gettext = vnode.context.$gettextInst
  let msgid = el.dataset.msgid

  // Output a info in the console if an interpolation is required but no expression is provided.
  if (!gettext.vm.silent) {
    let hasInterpolation = msgid.indexOf(VueGettext.INTERPOLATION_PREFIX) !== -1
    if (hasInterpolation && !binding.expression) {
      console.info(`No expression is provided for change detection. The translation for this key will be static:\n${msgid}`)
    }
  }

  let attrs = vnode.data.attrs || {}
  let translateContext = attrs['translate-context']
  let translateN = attrs['translate-n']
  let translatePlural = attrs['translate-plural']
  let isPlural = translateN !== undefined && translatePlural !== undefined
  let context = vnode.context

  if (!isPlural && (translateN || translatePlural)) {
    throw new Error('`translate-n` and `translate-plural` attributes must be used together:' + msgid + '.')
  }

  if (!gettext.vm.silent && attrs['translate-params']) {
    console.warn(`\`translate-params\` is required as an expression for v-translate directive. Please change to \`v-translate='params'\`: ${msgid}`)
  }

  if (binding.value && typeof binding.value === 'object') {
    context = Object.assign({}, vnode.context, binding.value)
  }

  let translation = gettext.getTranslation(
    msgid,
    translateN,
    translateContext,
    isPlural ? translatePlural : null,
    el.dataset.currentLanguage
  )

  let msg = gettext.interpolate(translation, context)

  el.innerHTML = msg

}

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
export default {

  bind (el, binding, vnode) {
    const gettext = vnode.context.$gettextInst

    // Fix the problem with v-if, see #29.
    // Vue re-uses DOM elements for efficiency if they don't have a key attribute, see:
    // https://vuejs.org/v2/guide/conditional.html#Controlling-Reusable-Elements-with-key
    // https://vuejs.org/v2/api/#key
    if (!vnode.key) {
      vnode.key = uuid()
    }

    // Get the raw HTML and store it in the element's dataset (as advised in Vue's official guide).
    // Note: not trimming the content here as it should be picked up as-is by the extractor.
    let msgid = el.innerHTML
    el.dataset.msgid = msgid

    // Store the current language in the element's dataset.
    el.dataset.currentLanguage = gettext.language

    updateTranslation(el, binding, vnode)

  },

  update (el, binding, vnode) {
    const gettext = vnode.context.$gettextInst
    let doUpdate = false

    // Trigger an update if the language has changed.
    if (el.dataset.currentLanguage !== gettext.vm.language) {
      el.dataset.currentLanguage = gettext.vm.language
      doUpdate = true
    }

    // Trigger an update if an optional bound expression has changed.
    if (!doUpdate && binding.expression && (binding.value !== binding.oldValue)) {
      doUpdate = true
    }

    if (doUpdate) {
      updateTranslation(el, binding, vnode)
    }

  },

}
