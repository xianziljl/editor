import toolItemMixin from './toolItemMixin'

export default {
  name: 'editor-tool-todolist',
  mixins: [toolItemMixin],
  watch: {
    '$editor.selection.blockStyle' (style) {
      this.isActive = style && style === 'todolist'
    }
  },
  methods: {
    onClick () {
      this.$editor.toggleBlockType('todolist')
      this.$editor.isOperating = false
    }
  }
}
