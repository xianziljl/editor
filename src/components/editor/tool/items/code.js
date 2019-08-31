import toolItemMixin from './toolItemMixin'
export default {
  name: 'editor-tool-code',
  mixins: [toolItemMixin],
  watch: {
    '$editor.selection.inlineStyles' (styles) {
      this.isActive = !!styles.code
    }
  },
  methods: {
    onClick (e) {
      this.$editor.toggleInlineStyle('code')
      this.$editor.isOperating = false
    }
  }
}
