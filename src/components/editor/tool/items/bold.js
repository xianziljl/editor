import toolItemMixin from './toolItemMixin'
export default {
  name: 'editor-tool-bold',
  mixins: [toolItemMixin],
  watch: {
    '$editor.selection.styles' (styles) {
      this.isActive = !!styles.bold
    }
  },
  methods: {
    onClick (e) {
      this.$editor.exe('bold')
      this.$editor.isOperating = false
    }
  }
}
