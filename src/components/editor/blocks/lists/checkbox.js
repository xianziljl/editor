export default {
  name: 'editor-checkbox',
  props: {
    checked: Boolean
  },
  render (h) {
    return h('label', {
      class: 'editor-checkbox',
      on: {
        click: this.onClick
      }
    }, [
      h('input', {
        attrs: {
          type: 'checkbox',
          checked: this.checked
        }
      })
    ])
  },
  methods: {
    onClick (e) {
      console.log('on click')
    }
  }
}
