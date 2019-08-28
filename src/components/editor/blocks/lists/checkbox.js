export default {
  name: 'editor-checkbox',
  props: {
    checked: Boolean,
    readonly: Boolean
  },
  render (h) {
    return h('label', {
      class: 'editor-checkbox',
      attrs: {
        'data-skip-check': 1
      },
      on: {
        change: this.onChange
      }
    }, [
      h('input', {
        attrs: {
          type: 'checkbox',
          'data-skip-check': 1,
          checked: this.checked,
          disabled: this.readonly
        }
      })
    ])
  },
  methods: {
    onChange (e) {
      this.$emit('change', e.target.checked)
      console.log('on change', e.target.checked)
    }
  }
}
