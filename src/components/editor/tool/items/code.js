import toolItemMixin from './toolItemMixin'
export default {
  name: 'editor-tool-code',
  mixins: [toolItemMixin],
  watch: {
    '$editor.selection.styles' (styles) {
      this.isActive = !!styles.code
    }
  },
  methods: {
    onClick (e) {
      this.$editor.exe('code')
      this.$editor.isOperating = false
    }
  }
}
