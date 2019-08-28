import { mergeRanges } from '../text/text-range'
import { listTypes } from '../map'

export default {
  inject: ['editor'],
  props: {
    readonly: Boolean,
    value: {
      type: Object,
      default: () => ({})
    }
  },
  methods: {
    insertBefore (val) {
      const { blocks } = this.editor.value
      this.$set(val, 'type', this.value.type)
      this.editor.insertBeforeBlock(blocks, this.value, val)
    },
    insertAfter (val) {
      const { blocks } = this.editor.value
      const type = listTypes[this.value.type] && this.value.text.length ? this.value.type : 'paragraph'
      this.$set(val, 'type', type)
      this.editor.insertAfterBlock(blocks, this.value, val)
    },
    clearBlockStyle (val) {
      val.type = 'paragraph'
      this.$nextTick(() => {
        const { target, range } = this.editor.selection
        this.editor.setRange(target, range.offset, range.length)
      })
    },
    mergeNext () {
      const { editor, value } = this
      const { blocks } = editor.value
      const i = blocks.indexOf(value)
      const next = blocks[i + 1]
      if (!next || next.type !== 'paragraph') return
      blocks.splice(i + 1, 1)
      next.ranges.forEach(item => { item.offset += value.text.length })
      value.ranges = value.ranges.concat(next.ranges)
      mergeRanges(value.ranges)
      const oldLength = value.text.length
      value.text += next.text
      this.$nextTick(() => {
        editor.setRange(this, oldLength, 0)
      })
    }
  }
}
