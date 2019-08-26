export default {
  name: 'editor-tool-italic',
  inject: ['editor'],
  render (h) {
    const { styles } = this.editor.selection
    return h('button', {
      class: [
        'editor-tool-btn',
        'editor-tool-italic',
        styles.italic ? 'editor-tool-btn-on' : ''
      ],
      on: {
        click: this.onClick
      }
    })
  },
  methods: {
    onClick (e) {
      this.editor.exe('italic')
      this.editor.isOperating = false
    }
  }
}
