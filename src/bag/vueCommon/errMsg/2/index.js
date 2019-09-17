import errMsgCom from './e'
import Vue from 'vue'

let instance

const ErrMsgConstructor = Vue.extend(errMsgCom)
instance = new ErrMsgConstructor({
  el: document.createElement('div')
})

instance.show = false
const reminderMsg = {
  show(options = {}) {
    if (options) {
      let parentEl = options.el ? options.el : document.querySelector('body')
      parentEl.appendChild(instance.$el)
      instance.text = options.text || ''
    }
    instance.show = true
    setTimeout(() => { instance.$el.style.opacity = '1' }, 30)
  },
  hide() {
    instance.$el.style.opacity = '0'
    instance.show = false
  }
}

export default {
  install() {
    if (!Vue.reminderMsg) {
      Vue.$reminderMsg = reminderMsg
    }
    Vue.mixin({
      created() {
        this.$reminderMsg = Vue.$reminderMsg
      }
    })
  }
}
