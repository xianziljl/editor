import toolItemMixin from './toolItemMixin'

export default {
  name: 'editor-tool-heading-1',
  mixins: [toolItemMixin],
  watch: {
    '$editor.selection.blockStyle' (style) {
      this.isActive = style && style === 'heading1'
      this.isDisabled = style === 'image'
    }
  },
  methods: {
    onClick () {
      this.$editor.toggleBlockStyle('heading', { level: 1 })
      this.$editor.isOperating = false
    }
  }
}
