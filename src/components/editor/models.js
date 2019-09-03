export default {
  paragraph: {
    type: 'paragraph',
    id: '',
    text: '',
    ranges: []
  },
  heading: {
    type: 'heading',
    id: '',
    level: 1,
    text: '',
    ranges: []
  },
  blockquote: {
    type: 'blockquote',
    id: '',
    text: '',
    ranges: []
  },
  divider: {
    type: 'divider'
  },
  todolist: {
    type: 'todolist',
    checked: false,
    id: '',
    text: '',
    ranges: []
  },
  orderlist: {
    type: 'orderlist',
    id: '',
    text: '',
    ranges: []
  },
  unorderlist: {
    type: 'unorderlist',
    id: '',
    text: '',
    ranges: []
  },
  image: {
    type: 'image',
    row: '',
    id: '',
    width: 0,
    height: 0,
    src: '',
    alt: '',
    text: '',
    float: null // left, right, null
  }
}
