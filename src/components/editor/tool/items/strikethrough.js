import toolItemMixin from './toolItemMixin'
export default {
  name: 'editor-tool-strikethrough',
  mixins: [toolItemMixin],
  render (h) {
    return h('button', {
      class: [
        'editor-tool-btn',
        'editor-tool-strikethrough',
        this.isActive ? 'editor-tool-btn-on' : ''
      ],
      on: {
        click: this.onClick
      }
    })
  },
  watch: {
    'tool.isShow' (isShow) {
      if (isShow) this.isActive = !!this.editor.selection.styles.strikethrough
    }
  },
  methods: {
    onClick (e) {
      this.editor.exe('strikethrough')
      this.editor.isOperating = false
    }
  }
}
