<template>
  <div id="app">
    <div class="editor-container">
      <editor
        ref="$editor"
        :readonly="readonly"
        :value="testValue"
        @change="onChange"></editor>
      <div>
        <div class="headers">
          <a
            v-for="(item, i) in headers"
            :style="{paddingLeft: 12 * item.level + 10 + 'px'}"
            :class="{'on': item.on}"
            :key="i"
            :href="'#user-content-'+item.text">{{item.text}}</a>
        </div>
      </div>
    </div>
    <button @click="getValue">Get value</button>
    <button @click="readonly = !readonly">readonly: {{readonly}}</button>
  </div>
</template>

<script>
// import JsonViewer from 'vue-json-viewer'
// import debounce from 'debounce'
import '@/components/editor/style/index.scss'
import testValue from './components/editor/value.json'
import Editor from '@/components/editor/editor'

export default {
  components: { Editor },
  data () {
    return {
      readonly: false,
      testValue,
      selection: {},
      headers: []
    }
  },
  mounted () {
    this.getHeaders()
    document.addEventListener('scroll', () => {
      this.headers.forEach(item => {
        const { top } = item.el.getBoundingClientRect()
        if (top <= 6) {
          this.headers.forEach(item => { item.on = false })
          item.on = true
        }
      })
    })
  },
  // watch: {
  //   '$refs.$editor.history.list' () {
  //     console.log('change')
  //   }
  // },
  methods: {
    getValue () {
      console.log(this.$refs.editor.getValue())
    },
    onSelectionchange (selection) {
      this.selection = selection
    },
    onFileChange (e) {
      const file = e.target.files[0]
      console.log(file)
      const url = URL.createObjectURL(file)
      const img = new Image()
      img.src = url
      document.body.appendChild(img)
    },
    onChange () {
      this.getHeaders()
    },
    getHeaders () {
      let headers = this.$refs.$editor.$el.querySelectorAll('h1,h2,h3,h4')
      headers = Array.from(headers)
      headers = headers.map(item => {
        return {
          level: parseInt(item.tagName.replace('H', '')),
          text: item.innerText,
          el: item,
          on: false
        }
      })
      this.headers = headers
    }
  }
}
</script>

<style lang="scss">
body{background: #fff;margin: 0;}
div{box-sizing: border-box;}
  #app{margin: 60px auto;font-size: 16px;}
  .editor-container{display: flex;max-width: 1050px;margin: 0 auto;}
  .editor{flex: 1;}
  .headers{width: 250px;position: sticky;top: 100px;
    a{display: block;color: #5b6168;text-decoration: none;font-size: 14px;padding: 5px 10px;
      // border-left: 2px solid transparent;
      &:hover{color: #03a87c;}
      &.on{background: rgba(#004229, 0.05);color: #03a87c;}
    }
  }
  // .json-container {max-height: 800px;overflow-y: auto}
  .info-box{
    position: fixed;bottom: 0;left: 0;padding: 10px;
    font-size: 14px;
    span{color: #888}
  }
  table{border-collapse: collapse;}
  td{border: 1px solid #ddd;padding: 0;}
</style>
