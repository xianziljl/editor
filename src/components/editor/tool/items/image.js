import createGUID from '../../utils/createGUID'

export default {
  name: 'editor-tool-image',
  inject: ['$editor', '$tool'],
  render (h) {
    const { startBlock } = this.$editor.selection
    const input = h('input', {
      attrs: {
        type: 'file',
        accept: 'image/jpg, image/jpeg, image/png, image/gif',
        multiple: !(startBlock && startBlock.type === 'image')
      },
      style: {
        display: 'none'
      },
      on: {
        change: this.onChange
      }
    })
    return h('label', {
      class: ['editor-tool-btn', 'editor-tool-image']
    }, [input])
  },
  methods: {
    onChange (e) {
      let files = e.target.files
      if (!files.length) return
      files = Array.from(files)
      const { startBlock } = this.$editor.selection
      if (!startBlock) return
      const isChangeImage = startBlock.type === 'image'
      const rowId = isChangeImage ? startBlock.row : Math.random().toString(16).substr(2)
      const images = files.map(item => {
        const imgData = {
          type: 'image',
          id: isChangeImage ? startBlock.id : createGUID(),
          key: 0,
          src: URL.createObjectURL(item),
          alt: item.name,
          text: '',
          width: 0,
          height: 0,
          row: rowId,
          file: item
        }
        return imgData
      })
      if (isChangeImage) {
        const image = images[0]
        for (let key in image) startBlock[key] = image[key]
      } else {
        let index = this.$editor.value.blocks.indexOf(startBlock)
        this.$editor.removeBlock(startBlock)
        images.forEach(image => {
          this.$editor.addBlockAt(index, image)
          index++
        })
      }
      this.$editor.isOperating = false
      this.$tool.isShow = false
    }
  }
}
