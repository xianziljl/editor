import toolItemMixin from './toolItemMixin'
export default {
  name: 'editor-tool-code',
  mixins: [toolItemMixin],
  render (h) {
    return h('button', {
      class: [
        'editor-tool-btn',
        'editor-tool-code',
        this.isActive ? 'editor-tool-btn-on' : ''
      ],
      on: {
        click: this.onClick
      }
    })
  },
  watch: {
    '$editor.selection.styles' (styles) {
      this.isActive = !!styles.code
    }
  },
  methods: {
    onClick (e) {
      this.$editor.exe('code')
      this.$editor.isOperating = false
    }
  }
}
