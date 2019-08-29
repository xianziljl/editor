import toolItemMixin from './toolItemMixin'
export default {
  name: 'editor-tool-italic',
  mixins: [toolItemMixin],
  render (h) {
    return h('button', {
      class: [
        'editor-tool-btn',
        'editor-tool-italic',
        this.isActive ? 'editor-tool-btn-on' : ''
      ],
      on: {
        click: this.onClick
      }
    })
  },
  watch: {
    'tool.isShow' (isShow) {
      if (isShow) this.isActive = !!this.editor.selection.styles.italic
    }
  },
  methods: {
    onClick (e) {
      this.editor.exe('italic')
      this.editor.isOperating = false
    }
  }
}
