let loadingTimer
// let _touch = 'createTouch' in document ? 'touchend' : 'click'
let _touch = 'click'

export function loading() {
  document.querySelector('.loading').classList.add('run')
  document.querySelector('.loading').style.display = 'flex'
  loadingTimer = setInterval(function(){
    if (!window.navigator.onLine){
      endLoading()
      showErrMsg('请检查网络连接')
      clearInterval(loadingTimer)
    }
  }, 20)
}
export function endLoading(){
  document.querySelector('.loading').style.display = 'none'
  document.querySelector('.loading').classList.remove('run')
  clearInterval(loadingTimer)
}
