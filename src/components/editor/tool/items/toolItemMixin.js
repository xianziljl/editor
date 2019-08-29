export default {
  inject: ['$editor', '$tool'],
  data () {
    return {
      isActive: false
    }
  },
  render (h) {
    return h('button', {
      class: [
        'editor-tool-btn',
        this.$options.name,
        this.isActive ? 'editor-tool-btn-on' : ''
      ],
      on: {
        click: this.onClick
      }
    })
  }
}
