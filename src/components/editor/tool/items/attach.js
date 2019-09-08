export default {
  name: 'editor-tool-attach',
  inject: ['$editor', '$tool'],
  render (h) {
    const input = h('input', {
      attrs: {
        type: 'file'
      },
      style: {
        display: 'none'
      },
      on: {
        change: this.onChange
      }
    })
    return h('label', {
      class: ['editor-tool-btn', 'editor-tool-attach'],
      attrs: { tabindex: 0 }
    }, [input])
  },
  methods: {
    onChange (e) {
      let files = e.target.files
      if (!files.length) return
      const { startBlock } = this.$editor.selection
      if (!startBlock) return
      const file = Array.from(files)[0]
      const ext = file.name.match(/\.\w+$/)
      const attach = {
        type: 'attach',
        id: startBlock.id,
        key: 0,
        name: file.name,
        url: URL.createObjectURL(file),
        size: file.size,
        ext: ext ? ext[0] : ''
      }
      // console.log(attach)
      let index = this.$editor.value.blocks.indexOf(startBlock)
      this.$editor.removeBlock(startBlock)
      this.$editor.addBlockAt(index, attach)

      this.$editor.isOperating = false
      this.$tool.isShow = false
    }
  }
}
