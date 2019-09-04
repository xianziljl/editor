import { spanMap } from '../map'
// import * as snabbdom from 'snabbdom'

function createLinkNode (h, context, child) {
  return h('a', {
    attrs: {
      href: child._href,
      target: 'blank'
    }
  }, [child])
}

/**
 * 渲染 inline 文字样式
 * @param {function} h vue createElement 方法
 * @param {function} createTextNode vue._v 方法,用以创建纯文本节点
 * @param {string} text 文字内容
 * @param {array} ranges 样式范围
 * @returns {array} vnodes
 */
export default function (h, context, text, ranges) {
  // console.log('text render')
  const length = text.length
  const inlines = []
  const createTextNode = context._v
  if (!ranges || !ranges.length) return [createTextNode(text)]
  // 将所有标记放到一个数组并去重排序
  let points = new Set()
  ranges.forEach(range => {
    const start = range.offset
    const end = range.offset + range.length
    points.add(start < 0 ? 0 : start)
    points.add(end < 0 ? 0 : end)
  })
  points.add(0)
  points.add(length + 1)
  points = Array.from(points).sort((a, b) => a - b)

  points.forEach((start, i) => {
    const end = points[i + 1]
    if (!end) return
    const styles = new Set()
    let href = ''
    // 获取每段标记的样式
    ranges.forEach((range) => {
      if (start >= range.offset && end <= range.offset + range.length) {
        styles.add(range.style)
        if (range.style === 'link') href = range.href
      }
    })
    const innerText = text.slice(start, end)
    if (!innerText) return
    // 根据样式创建节点
    let el = createTextNode(innerText)
    styles.forEach(style => {
      const tagName = spanMap[style] || 'span'
      if (style !== 'link' && tagName) el = h(tagName, [el])
    })
    if (styles.has('link')) el._href = href
    inlines.push(el)
  })

  const children = new Set()
  // 对链接单独处理
  let linkNode = null
  inlines.forEach(item => {
    if (!item._href) {
      children.add(item)
      linkNode = null
    } else if (!linkNode) {
      linkNode = createLinkNode(h, context, item)
    } else if (item._href === linkNode.children[0]._href) {
      linkNode.children.push(item)
    } else {
      linkNode = createLinkNode(h, context, item)
    }

    if (linkNode) children.add(linkNode)
  })
  return Array.from(children)
}
