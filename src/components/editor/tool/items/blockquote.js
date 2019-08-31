import toolItemMixin from './toolItemMixin'

export default {
  name: 'editor-tool-blockquote',
  mixins: [toolItemMixin],
  watch: {
    '$editor.selection.blockStyle' (val) {
      this.isActive = val === 'blockquote'
    }
  },
  methods: {
    onClick () {
      console.log('blockquote')
    }
  }
}
