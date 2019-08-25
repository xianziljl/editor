export default {
  name: 'editor-tool-bold',
  inject: ['editor'],
  render (createElement) {
    const { styles } = this.editor.selection
    return createElement('button', {
      class: ['editor-tool-btn', styles.bold ? 'editor-tool-btn-on' : ''],
      on: {
        click: this.onClick
      }
    }, ['B'])
  },
  methods: {
    onClick (e) {
      this.editor.exe('bold')
      this.editor.isOperating = false
    }
  }
}
