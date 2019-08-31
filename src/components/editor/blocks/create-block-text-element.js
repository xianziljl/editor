import TextEditor from '../text/text-editor'
import renderText from '../text/text-render'
// import getComponetByKey from '../utils/getComponentByKey'
// import TextView from '../text/text-view'
// import merge from 'deepmerge' // merge 会导致数据失去响应

// const blockTextTypes = new Set(['heading', 'paragraph', 'blockquote'])

function createTextEditorElement (h, context, tagName, value, options) {
  if (context.readonly) {
    return h(tagName, renderText(h, context, value.text || '', value.ranges || []))
  }
  return h(TextEditor, {
    props: { tagName, value },
    on: Object.assign({}, context.$listeners, {
      'newline-before': context.newlineBefore,
      'newline-after': context.newlineAfter,
      'clear-block-style': context.clearBlockStyle,
      'merge-to-prev': context.mergeToPrev
    })
  })
}

export default createTextEditorElement
