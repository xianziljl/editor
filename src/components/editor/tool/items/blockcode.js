import toolItemMixin from './toolItemMixin'

export default {
  name: 'editor-tool-blockcode',
  mixins: [toolItemMixin],
  watch: {
    '$editor.selection.blockStyle' (style) {
      this.isActive = style && style === 'blockcode'
    }
  },
  methods: {
    onClick () {
      this.$editor.toggleBlockType('blockcode')
      this.$editor.isOperating = false
    }
  }
}
