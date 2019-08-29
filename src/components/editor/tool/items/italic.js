import toolItemMixin from './toolItemMixin'
export default {
  name: 'editor-tool-italic',
  mixins: [toolItemMixin],
  watch: {
    '$editor.selection.styles' (styles) {
      this.isActive = !!styles.italic
    }
  },
  methods: {
    onClick (e) {
      this.$editor.exe('italic')
      this.$editor.isOperating = false
    }
  }
}
