import createGUID from '../../utils/createGUID'

export default {
  name: 'editor-tool-images',
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
      class: ['editor-tool-btn', 'editor-tool-images']
    }, [input])
  },
  methods: {
    onChange (e) {
      let files = e.target.files
      if (!files.length) return
      files = Array.from(files)
      const images = files.map(item => {
        const imgData = {
          src: URL.createObjectURL(item),
          alt: item.name,
          text: '',
          width: 0,
          height: 0,
          ranges: []
        }
        const image = new Image()
        image.src = imgData.src
        image.onload = () => {
          imgData.width = image.width
          imgData.height = image.height
        }
        return imgData
      })
      const imagesData = {
        key: createGUID(),
        type: 'images',
        images
      }
      console.log(imagesData)
    }
  }
}
