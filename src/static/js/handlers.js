import SaveShareParam from "@/bag/bridge/param/SaveShareParam";
import BridgeFactory from '@/bag/bridge/BridgeFactory'
import BrowserChecker from '@/bag/utils/BrowserChecker'
import EventCameraParam from '@/bag/bridge/param/EventCameraParam'
import * as HandlersSupport from '@/static/js/handlersSupport'
import imgSupport from '@/bag/utils/imgSupport'
import loading from '@/bag/vueCommon/loading/1/loading'
// import {loadImg, showErrMsg, hideErrMsg, showSelectBox, hideSelectBox} from './pluginsSupport'
// import {config} from '@/config/commonConfig'

export default class Handlers {
  // 初始化基本状态
  static myApp = {
   isIos: BrowserChecker.isIos(),
   isAnd: BrowserChecker.isAndroid(),
   inState: '-outApp',
   isInApp: false,
   version: '',
   dpr: window.devicePixelRatio,
   eventName: 'filterAc'
  }
  static assignMyApp(obj) {
    Handlers.myApp = Object.assign({}, Handlers.myApp, obj)
  }
  static checkAppInfo() { return HandlersSupport.checkAppInfo() }
  static pickImg(sucCb, vue) { HandlersSupport.pickImg(sucCb, vue) }
  static renderFileChangedImg(a, b) { return HandlersSupport.renderFileChangedImg(a, b) }
}
