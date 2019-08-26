export default {
  name: 'editor-tool-code',
  inject: ['editor'],
  render (h) {
    const { styles } = this.editor.selection
    return h('button', {
      class: [
        'editor-tool-btn',
        'editor-tool-code',
        styles.code ? 'editor-tool-btn-on' : ''
      ],
      on: {
        click: this.onClick
      }
    })
  },
  methods: {
    onClick (e) {
      this.editor.exe('code')
      this.editor.isOperating = false
    }
  }
}
