import toolItemMixin from './toolItemMixin'
export default {
  name: 'editor-tool-italic',
  mixins: [toolItemMixin],
  watch: {
    '$editor.selection.inlineStyles' (styles) {
      this.isActive = styles && styles.italic
    }
  },
  methods: {
    onClick (e) {
      this.$editor.toggleInlineStyle('italic')
      this.$editor.isOperating = false
    }
  }
}
