// import TextEditor from '../../text/text-editor'
import renderText from '../../text/text-render'

export default {
  name: 'editor-block-image',
  inject: ['$editor'],
  props: {
    readonly: Boolean,
    width: Number,
    value: {
      type: Object,
      default: () => ({})
    }
  },
  render (h) {
    const { readonly, value } = this
    const { src, alt, text, ranges, width, height } = value
    const img = h('img', {
      attrs: { src, alt, width, height, draggable: readonly }
    })

    const descClass = 'editor-block-image-desc'
    const desc = h('figcaption', {
      class: descClass,
      attrs: { contenteditable: true },
      on: {
        focus: e => {
          console.log('figcaption focus')
          this.$editor.isChildFocus = false
        }
      }
    }, renderText(h, this, text, ranges))

    return h('figure', {
      attrs: { tabindex: readonly ? null : 1, contenteditable: false },
      style: { flex: 100 / height * width }
    }, [img, desc])
  }
}
