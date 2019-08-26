import TextEditor from '../text/text-editor'
import textRender from '../text/text-render'
// import TextView from '../text/text-view'
// import merge from 'deepmerge' // merge 会导致数据失去响应

function createTextEditorElement (createElement, context, tagName, value, options) {
  if (context.readonly) {
    return createElement(tagName, {
      class: 'editor-block'
    }, textRender(createElement, context, value.text || '', value.ranges || []))
  }
  return createElement(TextEditor, {
    class: 'editor-block',
    props: { tagName, value },
    on: Object.assign({}, context.$listeners, {
      //
    })
  })
}

export default createTextEditorElement
