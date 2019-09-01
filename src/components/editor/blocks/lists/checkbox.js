export default {
  name: 'editor-checkbox',
  props: {
    checked: Boolean,
    readonly: Boolean
  },
  render (h) {
    return h('label', {
      class: [
        'editor-checkbox',
        this.checked ? 'editor-checkbox-checked' : ''
      ],
      attrs: {
        'data-skip-check': 1,
        contenteditable: false
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
      e.stopPropagation()
      this.$emit('change', e.target.checked)
      console.log('on change', e.target.checked)
    }
  }
}
