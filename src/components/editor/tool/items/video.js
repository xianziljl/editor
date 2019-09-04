import createGUID from '../../utils/createGUID'

export default {
  name: 'editor-tool-video',
  inject: ['$editor'],
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
      files = Array.from(files)
      const video = files.map(item => {
        const videoData = {
          type: 'video',
          key: createGUID(),
          src: URL.createObjectURL(item),
          poster: '',
          name: item.name,
          text: '',
          width: 0,
          height: 0
        }
        return videoData
      })
      console.log(video)
      this.$editor.isOperating = false
    }
  }
}
