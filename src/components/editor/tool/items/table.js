import toolItemMixin from './toolItemMixin'

export default {
  name: 'editor-tool-table',
  mixins: [toolItemMixin],
  methods: {
    onClick () {
      const { startBlock } = this.$editor.selection
      const table = {
        type: 'table',
        id: startBlock.id,
        key: 0,
        rows: [
          ['', ''],
          ['', '']
        ]
      }
      const i = this.$editor.value.blocks.indexOf(startBlock)
      this.$editor.removeBlock(startBlock)
      this.$editor.addBlockAt(i, table)
      this.$editor.isOperating = false
      this.$tool.isShow = false
    }
  }
}
