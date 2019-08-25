import blockMixin from '../block-mixin'
export default {
  name: 'editor-block-divider',
  mixins: [blockMixin],
  render (createElement) {
    return createElement('hr', this.readonly ? {} : {
      attrs: { tabindex: 0 }
    }, [createElement('div')])
  }
}
