export default function showToast (text = '保存成功') {
  $('.saveSucToast').text(text).show().addClass('run')
  setTimeout(() => {
    $('.saveSucToast').hide().removeClass('run')
  }, 1000)
}
