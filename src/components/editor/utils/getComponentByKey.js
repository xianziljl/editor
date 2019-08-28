export default function getComponentByKey (target, key) {
  if (!key) return null
  function each (root) {
    if (root.$options.name !== 'editor-text-editor' && root.value && root.value.key === key) return root
    if (root.$children && root.$children.length) {
      let result
      const len = root.$children.length
      for (let i = 0; i < len; i++) {
        const _result = each(root.$children[i])
        if (_result) {
          result = _result
          break
        }
      }
      return result
    }
    return null
  }
  return each(target)
}
