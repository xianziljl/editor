import toolItemMixin from './toolItemMixin'
export default {
  name: 'editor-tool-strikethrough',
  mixins: [toolItemMixin],
  render (h) {
    return h('button', {
      class: [
        'editor-tool-btn',
        'editor-tool-strikethrough',
        this.isActive ? 'editor-tool-btn-on' : ''
      ],
      on: {
        click: this.onClick
      }
    })
  },
  watch: {
    'editor.selection.styles' (styles) {
      this.isActive = !!styles.strikethrough
    }
  },
  methods: {
    onClick (e) {
      this.editor.exe('strikethrough')
      this.editor.isOperating = false
    }
  }
}
