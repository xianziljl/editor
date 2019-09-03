export default {
  inject: ['$editor'],
  props: {
    readonly: Boolean,
    value: {
      type: Object,
      default: () => ({})
    }
  }
}
