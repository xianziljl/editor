import createGUID from '../../utils/createGUID'

export default {
  name: 'editor-tool-image',
  inject: ['$editor'],
  render (h) {
    const input = h('input', {
      attrs: {
        type: 'file',
        accept: 'image/jpg, image/jpeg, image/png, image/gif'
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
      const rowId = startBlock && startBlock.type === 'image' ? startBlock.row : Math.random().toString(16).substr(2)
      const image = files.map(item => {
        const imgData = {
          type: 'image',
          key: createGUID(),
          src: URL.createObjectURL(item),
          alt: item.name,
          text: '',
          width: 0,
          height: 0,
          row: rowId
        }
        const image = new Image()
        image.src = imgData.src
        image.onload = () => {
          imgData.width = image.width
          imgData.height = image.height
        }
        return imgData
      })
      console.log(image)
      this.$editor.isOperating = false
    }
  }
}
