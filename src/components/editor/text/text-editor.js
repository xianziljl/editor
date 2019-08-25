import textRender from './text-render'

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
  render (createElement) {
    const { text, ranges } = this.value
    const children = textRender(createElement, this, text, ranges)
    return createElement(
      this.tagName || 'div',
      {
        class: 'editor-text-editor',
        attrs: { contenteditable: true },
        on: { focus: this.onFocus },
        key: this.key
      },
      children
    )
  },
  methods: {
    onFocus (e) {
      this.editor.selection.target = this
      this.editor.selection.targetKey = this.value.key
    }
  }
}
