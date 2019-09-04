import toolItemMixin from './toolItemMixin'

export default {
  name: 'editor-tool-unorderlist',
  mixins: [toolItemMixin],
  watch: {
    '$editor.selection.blockStyle' (style) {
      this.isActive = style && style === 'unorderlist'
    }
  },
  methods: {
    onClick () {
      this.$editor.toggleBlockType('unorderlist')
      this.$editor.isOperating = false
    }
  }
}
