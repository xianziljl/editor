import Image from './image'

export default {
  name: 'editor-block-images',
  inject: ['$editor'],
  props: {
    readonly: Boolean,
    value: {
      type: Object,
      default: () => ({})
    }
  },
  render (h) {
    const { value, readonly } = this

    const children = value.images.map(item => {
      const width = 100 / item.height * item.width
      return h(Image, {
        props: { readonly, value: item, width }
      })
    })

    return h('div', {}, children)
  }
}
