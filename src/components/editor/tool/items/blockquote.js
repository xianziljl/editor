import toolItemMixin from './toolItemMixin'

export default {
  name: 'editor-tool-blockquote',
  mixins: [toolItemMixin],
  watch: {
    '$editor.selection.blockStyle' (style) {
      this.isActive = style && style === 'blockquote'
    }
  },
  methods: {
    onClick () {
      this.$editor.toggleBlockType('blockquote')
      this.$editor.isOperating = false
    }
  }
}
