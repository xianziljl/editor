import blockMixin from '../block-mixin'
import Listitem from './listitem'

export default {
  name: 'editor-block-unorderlist',
  inject: ['editor'],
  mixins: [blockMixin],
  render (h) {
    const items = this.value.blocks.map(item => {
      return h(Listitem, {
        props: { value: item, readonly: this.readonly },
        key: item.key
      })
    })
    return h('ul', items)
  }
}
