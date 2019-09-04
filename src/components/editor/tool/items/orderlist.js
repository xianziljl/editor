import toolItemMixin from './toolItemMixin'

export default {
  name: 'editor-tool-orderlist',
  mixins: [toolItemMixin],
  watch: {
    '$editor.selection.blockStyle' (style) {
      this.isActive = style && style === 'orderlist'
    }
  },
  methods: {
    onClick () {
      this.$editor.toggleBlockType('orderlist')
      this.$editor.isOperating = false
    }
  }
}
