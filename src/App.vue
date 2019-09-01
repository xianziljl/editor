<template>
  <div id="app">
    <div class="main">
      <div class="editor-container">
        <editor :value="testValue" ref="editor"></editor>
      </div>
      <!-- <div class="json-container">
        <json-viewer :value="testValue" :expand-depth="5"></json-viewer>
      </div> -->
    </div>
    <!-- <div class="info-box">
      <div><span>blockStyle: </span>{{selection.blockStyle || 'null'}}</div>
      <div><span>inlineStyles: </span>{{selection.inlineStyles || 'null'}}</div>
      <div><span>offset: </span>{{selection.startOffset || 'null'}}, {{selection.endOffset || 'null'}}</div>
    </div> -->
    <button @click="getValue">Get value</button>
  </div>
</template>

<script>
// import JsonViewer from 'vue-json-viewer'
import '@/components/editor/editor.scss'
import testValue from './components/editor/value.json'
import Editor from '@/components/editor/editor'

export default {
  components: { Editor },
  data () {
    return {
      readonly: false,
      testValue,
      selection: {}
    }
  },
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
    }
  }
}
</script>

<style lang="scss">
body{background: #fff;}
  #app{margin: 60px auto;font-size: 16px;}
  .main{display: flex;}
  .editor-container, .json-container{
    flex: 1;
  }
  .editor{max-width: 800px;margin: 0 auto;}
  .json-container {max-height: 800px;overflow-y: auto}
  .info-box{
    position: fixed;bottom: 0;left: 0;padding: 10px;
    font-size: 14px;
    span{color: #888}
  }
</style>
