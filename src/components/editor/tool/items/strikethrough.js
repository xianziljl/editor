export default {
  name: 'editor-tool-strikethrough',
  inject: ['editor'],
  render (h) {
    const { styles } = this.editor.selection
    return h('button', {
      class: [
        'editor-tool-btn',
        'editor-tool-strikethrough',
        styles.strikethrough ? 'editor-tool-btn-on' : ''
      ],
      on: {
        click: this.onClick
      }
    })
  },
  methods: {
    onClick (e) {
      this.editor.exe('strikethrough')
      this.editor.isOperating = false
    }
  }
}
