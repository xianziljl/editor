import toolItemMixin from './toolItemMixin'

export default {
  name: 'editor-tool-delete',
  mixins: [toolItemMixin],
  methods: {
    onClick (e) {
      const { startBlock } = this.$editor.selection
      this.$editor.removeBlock(startBlock)
      this.$editor.clearSelection()
      this.$editor.isOperating = false
    }
  }
}
