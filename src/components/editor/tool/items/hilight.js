import toolItemMixin from './toolItemMixin'
export default {
  name: 'editor-tool-hilight',
  mixins: [toolItemMixin],
  watch: {
    '$editor.selection.inlineStyles' (styles) {
      this.isActive = styles && styles.hilight
    }
  },
  methods: {
    onClick (e) {
      this.$editor.toggleInlineStyle('hilight')
      this.$editor.isOperating = false
    }
  }
}
