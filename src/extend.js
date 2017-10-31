
export default function extend (Vue) {
  // Exposes instance methods.
  Vue.prototype.$gettext = function (msgid) {
    return this.$gettextInst.gettext(msgid)
  }

  Vue.prototype.$pgettext = function (context, msgid) {
    return this.$gettextInst.pgettext(context, msgid)
  }

  Vue.prototype.$ngettext = function (msgid, plural, n) {
    return this.$gettextInst.ngettext(msgid, plural, n)
  }

  Vue.prototype.$npgettext = function (context, msgid, plural, n) {
    return this.$gettextInst.npgettext(context, msgid, plural, n)
  }

  Vue.prototype.$gettextInterpolate = function (msgid, context) {
    return this.$gettextInst.interpolate(msgid, context)
  }
}
