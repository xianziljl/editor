import toolItemMixin from './toolItemMixin'

export default {
  name: 'editor-tool-heading-2',
  mixins: [toolItemMixin],
  watch: {
    '$editor.selection.blockStyle' (style) {
      this.isActive = style && style === 'heading2'
      this.isDisabled = style === 'image'
    }
  },
  methods: {
    onClick () {
      this.$editor.toggleBlockType('heading', { level: 2 })
      this.$editor.isOperating = false
    }
  }
}
