import fileSizeFormat from '../../utils/fileSizeFormat'
import blockMixin from '../block-mixin'
// import Progressbar from './progress'

export default {
  name: 'editor-block-attach',
  mixins: [blockMixin],
  data () {
    return {
      isSelected: false
    }
  },
  watch: {
    '$editor.selection.blocks' (blocks) {
      this.isSelected = (blocks && blocks.includes(this.value))
    }
  },
  render (h) {
    const { value } = this
    const iconNode = h('div', { class: ['editor-attach-icon', 'editor-attach-icon-' + value.ext] })
    const nameNode = h('div', { class: 'editor-attach-name' }, [value.name])
    const sizeNode = h('div', { class: 'editor-attach-size' }, [fileSizeFormat(value.size)])
    const downloadNode = h('a', {
      class: 'editor-attach-download',
      attrs: {
        href: this.value.url,
        download: this.value.name,
        target: 'blank'
      }
    })
    // const progressbar = h(Progressbar, { props: { percent: 0.6 } })
    const contentNode = h('div', { class: 'editor-attach-content' }, [nameNode, sizeNode]) // Progressbar

    const attachNode = h('div', { class: 'editor-attach-container' }, [iconNode, contentNode, downloadNode])
    return h('div', {
      class: { 'editor-block-selected': this.isSelected },
      attrs: { contenteditable: false, tabindex: 1 }
    }, [attachNode])
  }
}
