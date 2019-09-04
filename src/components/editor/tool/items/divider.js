import toolItemMixin from './toolItemMixin'

export default {
  name: 'editor-tool-divider',
  mixins: [toolItemMixin],
  methods: {
    onClick () {
      this.$editor.toggleBlockType('divider')
      this.$editor.isOperating = false
    }
  }
}
