import createGUID from '../../utils/createGUID'

export default {
  name: 'editor-tool-video',
  inject: ['$editor', '$tool'],
  render (h) {
    const input = h('input', {
      attrs: {
        type: 'file',
        accept: 'video/mp4'
      },
      style: {
        display: 'none'
      },
      on: {
        change: this.onChange
      }
    })
    return h('label', {
      class: ['editor-tool-btn', 'editor-tool-video']
    }, [input])
  },
  methods: {
    onChange (e) {
      let files = e.target.files
      if (!files.length) return
      const { startBlock } = this.$editor.selection
      if (!startBlock) return
      const isChangeVideo = startBlock.type === 'image'
      const file = Array.from(files)[0]
      const video = {
        type: 'video',
        id: isChangeVideo ? startBlock.id : createGUID(),
        key: 0,
        src: URL.createObjectURL(file),
        poster: '',
        name: file.name,
        text: '',
        width: 0,
        height: 0
      }
      if (isChangeVideo) {
        for (let key in video) startBlock[key] = video[key]
      } else {
        let index = this.$editor.value.blocks.indexOf(startBlock)
        this.$editor.removeBlock(startBlock)
        this.$editor.addBlockAt(index, video)
      }
      this.$editor.isOperating = false
      this.$tool.isShow = false
    }
  }
}
