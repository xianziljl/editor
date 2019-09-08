function uploadFile (options = {}) {
  const { url, file, key, data, success, progress, fail } = options
  if (!url) {
    console.warn('Missing url for upload file.')
    return
  }
  if (!file) {
    console.warn('Missing file for upload file.')
    return
  }
  const formData = new FormData()
  formData.append(key || 'file', file, file.name)
  if (data && data.keys) {
    for (let _key in data) formData.append(_key, data[key])
  }
  const xhr = new XMLHttpRequest()
  xhr.open('POST', url, true)
  xhr.upload.onprogress = e => {
    if (e.lengthComputable) {
      if (typeof progress === 'function') progress(e.loaded / e.total)
    }
  }
  xhr.onreadystatechange = e => {
    if (xhr.readyState === 4 && xhr.status === 200) {
      if (typeof success === 'function') success(xhr.responseText)
    }
  }
  xhr.onerror = e => {
    if (typeof fail === 'function') fail()
  }
  xhr.send(formData)
}

export default uploadFile
