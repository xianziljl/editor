export default {
  name: 'editor-tool-code',
  inject: ['editor'],
  render (createElement) {
    const { styles } = this.editor.selection
    return createElement('button', {
      class: ['editor-tool-btn', styles.code ? 'editor-tool-btn-on' : ''],
      on: {
        click: this.onClick
      }
    }, ['<>'])
  },
  methods: {
    onClick (e) {
      this.editor.exe('code')
      this.editor.isOperating = false
    }
  }
}
