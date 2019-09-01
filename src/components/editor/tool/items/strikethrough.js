import toolItemMixin from './toolItemMixin'
export default {
  name: 'editor-tool-strikethrough',
  mixins: [toolItemMixin],
  watch: {
    '$editor.selection.inlineStyles' (styles) {
      this.isActive = styles && styles.strikethrough
    }
  },
  methods: {
    onClick (e) {
      this.$editor.toggleInlineStyle('strikethrough')
      this.$editor.isOperating = false
    }
  }
}
