export default {
  name: 'editor-tool-bold',
  inject: ['editor'],
  render (h) {
    const { styles } = this.editor.selection
    return h('button', {
      class: [
        'editor-tool-btn',
        'editor-tool-bold',
        styles.bold ? 'editor-tool-btn-on' : ''
      ],
      on: {
        click: this.onClick
      }
    })
  },
  methods: {
    onClick (e) {
      this.editor.exe('bold')
      this.editor.isOperating = false
    }
  }
}
