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
    'tool.isShow' (isShow) {
      if (isShow) this.isActive = !!this.editor.selection.styles.code
    }
  },
  methods: {
    onClick (e) {
      this.editor.exe('code')
      this.editor.isOperating = false
    }
  }
}
