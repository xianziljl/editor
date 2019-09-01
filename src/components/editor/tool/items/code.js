import toolItemMixin from './toolItemMixin'
export default {
  name: 'editor-tool-code',
  mixins: [toolItemMixin],
  watch: {
    '$editor.selection.inlineStyles' (styles) {
      this.isActive = styles && styles.code
    },
    '$editor.selection.blockStyle' (style) {
      this.isDisabled = style === 'blockcode'
    }
  },
  methods: {
    onClick (e) {
      this.$editor.toggleInlineStyle('code')
      this.$editor.isOperating = false
    }
  }
}
