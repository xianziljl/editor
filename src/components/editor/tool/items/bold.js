import toolItemMixin from './toolItemMixin'
export default {
  name: 'editor-tool-bold',
  mixins: [toolItemMixin],
  watch: {
    '$editor.selection.inlineStyles' (styles) {
      this.isActive = styles && styles.bold
    }
  },
  methods: {
    onClick (e) {
      this.$editor.toggleInlineStyle('bold')
      this.$editor.isOperating = false
    }
  }
}
