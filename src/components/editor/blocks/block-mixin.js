import { mergeRanges } from '../text/text-range'

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
