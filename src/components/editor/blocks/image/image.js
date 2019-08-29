import TextEditor from '../../text/text-editor'
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
    const { readonly, value, width } = this
    const { src, alt, text, ranges } = value
    const img = h('img', {
      attrs: { src, alt, width: '100%', draggable: readonly }
    })

    const descClass = 'editor-block-image-desc'
    const desc = readonly
      ? h('div', { class: descClass }, renderText(h, this, text, ranges))
      : h(TextEditor, {
        class: descClass,
        props: { tagName: 'div', value }
      })

    return h('div', {
      class: 'editor-block-image',
      attrs: readonly ? null : { tabindex: 1 },
      style: { flex: width }
    }, [img, desc])
  }
}
