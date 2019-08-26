export default {
  name: 'editor-tool-hilight',
  inject: ['editor'],
  render (h) {
    const { styles } = this.editor.selection
    return h('button', {
      class: [
        'editor-tool-btn',
        'editor-tool-hilight',
        styles.hilight ? 'editor-tool-btn-on' : ''
      ],
      on: {
        click: this.onClick
      }
    })
  },
  methods: {
    onClick (e) {
      this.editor.exe('hilight')
      this.editor.isOperating = false
    }
  }
}
