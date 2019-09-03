export default {
  name: 'editor-block-image',
  inject: ['$editor'],
  props: {
    readonly: Boolean,
    value: {
      type: Object,
      default: () => ({})
    }
  },
  render (h) {
    const { readonly, value } = this
    const { src, alt, text, width, height } = value
    const img = h('img', {
      attrs: { src, alt, width, height, draggable: readonly }
    })
    const descClass = 'editor-list-image-desc'
    let desc
    if (readonly) {
      desc = h('figcaption', { class: descClass }, [text])
    } else {
      desc = h('input', {
        class: descClass,
        attrs: {
          type: 'text',
          value: text,
          placeholder: '写点儿说明文字'
        },
        on: {
          input: e => { value.text = e.target.value },
          paste: e => { e.stopPropagation() }
        }
      })
    }

    return h('figure', {
      attrs: { tabindex: readonly ? null : 1, contenteditable: false },
      style: { flex: 100 / height * width }
    }, [img, desc])
  }
}
