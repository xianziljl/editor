import blockMixin from '../block-mixin'
import createGUID from '../../utils/createGUID'
export default {
  name: 'editor-block-divider',
  mixins: [blockMixin],
  render (h) {
    return h('hr', this.readonly ? {} : {
      attrs: {
        tabindex: 0,
        contenteditable: false
      },
      on: {
        keydown: this.onKeydown
      }
    }, [h('div')])
  },
  methods: {
    mergeNext () {
      const { blocks } = this.$editor.value
      blocks.splice(blocks.indexOf(this.value), 1)
    },
    onKeydown (e) {
      if (e.keyCode !== 13) return
      this.newlineAfter({
        key: createGUID(),
        type: 'paragraph',
        text: null,
        ranges: []
      })
    }
  }
}
