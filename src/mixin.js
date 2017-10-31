export default {
  beforeCreate () {
    const options = this.$options
    options.gettext = options.gettext || null

    if (this.$options.gettext) {
      this._gettext = this.$options.gettext
      this._gettextRoot = this
      // init?
    } else {
      this._gettextRoot = this.$parent && this.$parent._gettextRoot || this
    }
  },

  beforeDestroy () {
    this._gettext = null
  },
}
