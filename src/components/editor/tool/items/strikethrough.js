export default {
  name: 'editor-tool-strikethrough',
  inject: ['editor'],
  render (createElement) {
    const { styles } = this.editor.selection
    return createElement('button', {
      class: ['editor-tool-btn', styles.strikethrough ? 'editor-tool-btn-on' : ''],
      on: {
        click: this.onClick
      }
    }, ['S'])
  },
  methods: {
    onClick (e) {
      this.editor.exe('strikethrough')
      this.editor.isOperating = false
    }
  }
}
