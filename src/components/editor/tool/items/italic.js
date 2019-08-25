export default {
  name: 'editor-tool-italic',
  inject: ['editor'],
  render (createElement) {
    const { styles } = this.editor.selection
    return createElement('button', {
      class: ['editor-tool-btn', styles.italic ? 'editor-tool-btn-on' : ''],
      on: {
        click: this.onClick
      }
    }, ['I'])
  },
  methods: {
    onClick (e) {
      this.editor.exe('italic')
      this.editor.isOperating = false
    }
  }
}
