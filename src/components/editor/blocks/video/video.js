import blockMixin from '../block-mixin'
export default {
  name: 'editor-block-video',
  mixins: [blockMixin],
  data () {
    return {
      isSelected: false
    }
  },
  watch: {
    '$editor.selection.blocks' (blocks) {
      this.isSelected = (blocks && blocks.includes(this.value))
    }
  },
  render (h) {
    const { readonly, value } = this
    const { src, text, poster, width, height } = value
    const video = h('video', {
      attrs: {
        src,
        controls: true,
        poster,
        width,
        height
      },
      on: {
        loadedmetadata: e => {
          const v = e.target
          if (v.readyState > 0) {
            value.width = v.videoWidth
            value.height = v.videoHeight
          }
        }
      }
    })
    const descClass = 'editor-block-desc'
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
          paste: e => { e.stopPropagation() },
          selectionchange: e => { e.stopPropagation() }
        }
      })
    }
    return h('div', {
      class: [this.isSelected ? 'editor-block-selected' : ''],
      attrs: { tabindex: readonly ? null : 1, contenteditable: false }
    }, [video, desc])
  }
}
