import toolItemMixin from './toolItemMixin'
export default {
  name: 'editor-tool-hilight',
  mixins: [toolItemMixin],
  render (h) {
    return h('button', {
      class: [
        'editor-tool-btn',
        'editor-tool-hilight',
        this.isActive ? 'editor-tool-btn-on' : ''
      ],
      on: {
        click: this.onClick
      }
    })
  },
  watch: {
    'tool.isShow' (isShow) {
      if (isShow) this.isActive = !!this.editor.selection.styles.hilight
    }
  },
  methods: {
    onClick (e) {
      this.editor.exe('hilight')
      this.editor.isOperating = false
    }
  }
}
