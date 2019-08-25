import Heading from './blocks/heading/heading'
import Paragraph from './blocks/paragraph/paragraph'
import Blockquote from './blocks/blockquote/blockquote'
import Divider from './blocks/divider/divider'

const spanMap = {
  bold: 'strong',
  italic: 'em',
  link: 'a',
  underline: 'ins',
  strikethrough: 'del',
  hilight: 'mark',
  code: 'code'
}

const blockMap = {
  heading: Heading,
  paragraph: Paragraph,
  blockquote: Blockquote,
  divider: Divider
}

export { spanMap, blockMap }
