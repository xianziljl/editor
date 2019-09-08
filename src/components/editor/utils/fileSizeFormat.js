function fileSizeFormat (size) {
  let val = parseInt(size)
  if (!val) return '0 B'
  if (val < 1024) return val + ' B'
  if (val >= 1024 && val < 1048576) return (val / 1024).toFixed(1) + ' KB'
  if (val >= 1048576 && val < 1073741824) return (val / 1048576).toFixed(1) + ' MB'
  return (val / 1073741824).toFixed(1) + ' GB'
}

export default fileSizeFormat
