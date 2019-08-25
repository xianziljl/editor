export default {
  name: 'editor-tool-hilight',
  inject: ['editor'],
  render (createElement) {
    const { styles } = this.editor.selection
    return createElement('button', {
      class: ['editor-tool-btn', styles.hilight ? 'editor-tool-btn-on' : ''],
      on: {
        click: this.onClick
      }
    }, ['Hi'])
  },
  methods: {
    onClick (e) {
      this.editor.exe('hilight')
      this.editor.isOperating = false
    }
  }
}
