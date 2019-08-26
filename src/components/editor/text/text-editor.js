import textRender from './text-render'
import createGUID from '../utils/createGUID'

export default {
  name: 'editor-text-editor',
  props: {
    tagName: String,
    value: {
      type: Object,
      default: () => ({})
    }
  },
  inject: ['editor'],
  data () {
    // 当组件被强制更新时（旧实例被销毁）通过 GUID 将新创建的组件传给 editor
    const target = this.editor.selection.target
    if (target && target.value && target.value.key === this.value.key) {
      this.editor.selection.target = this
    }

    const { text, ranges } = this.value
    this.value.text = text || ''
    this.value.ranges = ranges || []
    return {
      key: 0 // 强制更新 dom 否则 vue 虚拟 dom 会和 contenteditable 冲突
    }
  },
  render (h) {
    const { text, ranges } = this.value
    const children = textRender(h, this, text, ranges)
    return h(
      this.tagName || 'div',
      {
        class: 'editor-text-editor',
        attrs: { contenteditable: true },
        on: {
          focus: this.onFocus,
          keydown: this.onKeydown
        },
        key: this.key
      },
      children
    )
  },
  methods: {
    onFocus (e) {
      this.editor.selection.target = this
      this.editor.selection.targetKey = this.value.key
    },
    keyBackspaceAtStart () {
      console.log('keyBackspaceAtStart')
    },
    keyEnterAtStart () {},
    onKeydown (e) {
      switch (e.keyCode) {
        case 13:
          console.log('onKeyEnter')
          e.preventDefault()
          this.onKeyEnter()
          break
        case 8:
          this.onKeyBackspace()
          break
      }
    },
    onKeyEnter () {
      const { range } = this.editor.selection
      if (!range) return
      if (range.offset > 0) {
        const results = splitValue(this.value, range)
        this.$emit('after-insert', results[1])
      } else {
        this.$emit('before-insert', {
          key: createGUID(),
          text: '',
          ranges: []
        })
      }
      // console.log(values)
    },
    onKeyBackspace () {}
  }
}

function splitValue (value, range) {
  const rangeStart = range.offset
  const rangeEnd = range.offset + range.length
  const text1 = value.text.slice(0, rangeStart)
  const text2 = value.text.slice(rangeEnd, value.text.length)
  const ranges1 = []
  const ranges2 = []
  value.ranges.forEach(item => {
    const itemStart = item.offset
    const itemEnd = item.offset + item.length
    if (itemEnd <= rangeStart) {
      ranges1.push(item)
      return
    }
    if (itemStart >= rangeEnd) {
      item.offset -= rangeEnd
      ranges2.push(item)
      return
    }
    if (itemStart > rangeStart && itemEnd < rangeEnd) {
      return
    }
    if (rangeStart > itemStart && rangeEnd < itemEnd) {
      item.length = rangeStart - itemStart
      ranges1.push(item)
      ranges2.push({
        offset: 0,
        length: itemEnd - rangeEnd
      })
    }
    if (itemStart > rangeStart && itemStart < rangeEnd) {
      item.offset = 0
      item.length = itemEnd - rangeEnd
      ranges2.push(item)
      return
    }
    if (itemEnd > rangeStart && itemEnd < rangeEnd) {
      item.length = rangeStart - itemStart
      ranges1.push(item)
    }
  })
  value.text = text1
  value.ranges = ranges1
  const results = [value]
  results.push({
    key: createGUID(),
    text: text2,
    ranges: ranges2
  })
  return results
}
