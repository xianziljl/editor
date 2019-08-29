import toolItemMixin from './toolItemMixin'

export default {
  name: 'editor-tool-bold',
  mixins: [toolItemMixin],
  render (h) {
    // const { styles } = this.editor.selection
    return h('button', {
      class: [
        'editor-tool-btn',
        'editor-tool-bold',
        this.isActive ? 'editor-tool-btn-on' : ''
      ],
      on: {
        click: this.onClick
      }
    })
  },
  watch: {
    'tool.isShow' (isShow) {
      if (isShow) this.isActive = !!this.editor.selection.styles.bold
    }
  },
  methods: {
    onClick (e) {
      this.editor.exe('bold')
      this.editor.isOperating = false
    }
  }
}
