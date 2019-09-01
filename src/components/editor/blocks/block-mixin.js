export default {
  inject: ['$editor'],
  props: {
    value: {
      type: Object,
      default: () => ({})
    }
  }
}
