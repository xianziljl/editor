export default {
  inject: ['$editor', '$tool'],
  data () {
    return {
      isActive: false,
      isDisabled: false
    }
  },
  render (h) {
    return h('button', {
      class: [
        'editor-tool-btn',
        this.$options.name,
        this.isActive ? 'editor-tool-btn-on' : '',
        this.isDisabled ? 'editor-tool-btn-disabled' : ''
      ],
      attrs: {
        disabled: this.isDisabled
      },
      on: {
        click: this.onClick
      }
    })
  }
}
