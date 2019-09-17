let loadingTimer
// let _touch = 'createTouch' in document ? 'touchend' : 'click'

export function loading(state) {
  let loadDom = document.querySelector('.loading')
  if(state) {
    loadDom.classList.add('run')
    loadDom.style.display = 'flex'
    loadingTimer = setInterval(function(){
      if (!window.navigator.onLine){
        endLoading()
        showErrMsg('请检查网络连接')
        clearInterval(loadingTimer)
      }
    }, 20)
  } else {
    loadDom.style.display = 'none'
    loadDom.classList.remove('run')
    clearInterval(loadingTimer)
  }
}
