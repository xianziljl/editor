import listMixin from './list-mixin'
import Listitem from './listitem'

export default {
  name: 'editor-block-unorderlist',
  mixins: [listMixin],
  render (h) {
    const items = this.value.blocks.map(item => {
      return h(Listitem, {
        props: { value: item, readonly: this.readonly },
        key: item.key,
        on: Object.assign({}, this.$listeners, {})
      })
    })
    return h('ul', {
      class: 'editor-block-unorderlist'
    }, items)
  }
}
