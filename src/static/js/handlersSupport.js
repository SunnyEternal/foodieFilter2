import Handlers from '@/static/js/handlers'
import SaveShareParam from "@/bag/bridge/param/SaveShareParam";
import BridgeFactory from '@/bag/bridge/BridgeFactory'
import EventCameraParam from '@/bag/bridge/param/EventCameraParam'
import MegaPixImage from '@/bag/plugins/megapix-image'
import imgSupport from '@/bag/utils/imgSupport'
import loading from '@/bag/vueCommon/loading/1/loading'

 // 项目名+站内外 统计用
let _eventPath = '???'
// 检查app基本信息
export function checkAppInfo() {
  console.log('>>checkAppInfo')
  _eventPath = Handlers.myApp.eventName + Handlers.myApp.inState
  BridgeFactory.getBridge().appInfo(res => {
    if (res.app) {
      let o = {
        isInApp : true,
        version : res.app,
        inState : '-inApp'
      }
      _eventPath = Handlers.myApp.eventName + Handlers.myApp.inState
      Handlers.assignMyApp(o)
    }
  })
}

// 选取照片第一步
export function pickImg(sucCb, that) {
  console.log('Handlers', _eventPath);
  if (Handlers.myApp.isInApp) {
    const param = new EventCameraParam(
            EventCameraParam.types.imageCamera,
            EventCameraParam.cameraPositions.front,
            config.filterId,
            config.categoryId,
            config.stickerId,
            '',
            'true'
    );

    const galleryParams = new EventCameraParam(EventCameraParam.types.imageAlbum);

    showSelectBox(function(){
      $('#cameraBtn, #galleryBtn').off('click')
      $('#cameraBtn').one('click', function(){
        Handlers.thisSelectFrom = 'userPic'
        BridgeFactory.getBridge().eventCamera(param, Handlers.eventCameraCallback)
         _hmt.push(['_trackEvent', _eventPath, 'click', '开始相机拍照'])
      })
      $('#galleryBtn').on('click', function(){
        Handlers.thisSelectFrom = 'userPic'
        BridgeFactory.getBridge().eventCamera(galleryParams, Handlers.eventCameraCallback)
         _hmt.push(['_trackEvent', _eventPath, 'click', '开始相册选取'])
      })
    })
  } else {
    $('#inputFile')[0].value = ''
    $('#inputFile').off("change").trigger('click')
    $('#inputFile').on('change', function(){
      return fileChanged.call(this, sucCb, that)
    })
    _hmt.push(['_trackEvent', _eventPath, 'click', '开始选取照片'])
  }
  
}
// 站内 选图的回调
export function eventCameraCallback(res, type){
  hideSelectBox(() => {
    loading(0)
  })
  if (res.success) {
    let img = new Image();
    img.onload = function () {
        let _this = this
        // let imageType = this.src.split(",")[0].split(";")[0].split(":")[1].toLowerCase();
        // imageType = (imageType.indexOf("jpg") !== -1) ? 'image/jpeg' : imageType;

        // if (!imgSupport.validationImageSize(this.width, this.height)) {
        //   showErrMsg('图片尺寸或比例不符合')
        //   return;
        // }
        if (Handlers.thisSelectFrom == 'userPic') {
          $('#dropImg')[0].src = this.src
          var cropGesture = new EZGesture($('#dropArea_mask')[0], $('#dropImg')[0], {
              targetMinWidth: parseInt($('#dropArea').offset().width),
              targetMinHeight: parseInt($('#dropArea').offset().height)
          });
          setTimeout(() => {
            var imgOriginX = cropGesture.targetMinWidth == 0 ? ($('#dropImg').width() - $('#dropArea').width()) * 0.5 : ($('#dropImg').width() - cropGesture.targetMinWidth) * 0.5;
            var imgOriginY = cropGesture.targetMinHeight == 0 ? ($('#dropImg').height() - $('#dropArea').height()) * 0.5 : ($('#dropImg').height() - cropGesture.targetMinHeight) * 0.5;
            // 初始时 将图片调至中间部分
            $('#dropImg').css('left', '-' + imgOriginX + 'px')
            $('#dropImg').css('top', '-' + imgOriginY + 'px')

            $('#firstPage').hide()
          }, 60)
        } else if (Handlers.thisSelectFrom == 'qrPic') {
          setTimeout(async () => {
            let qr = await Handlers.cropQrOut(_this)
            console.log('qr length: ', qr.src.length);
            $('#qrGuide').hide();
            $('#eCode')[0].src = qr.src
            Handlers.cropQrOutState = true
          }, 0)
        }
    }
    img.src = res.base64Image;
  }
}

// 站外 选图的回调
export function fileChanged(sucCb, that){
  console.log('this.files', this.files[0].size);
    if (this.files.length <= 0){
      return loading(0)
    } else if (!this.files[0].type.includes('image')) {
      // return alert('不支持此种类型的文件')
      return that.$reminderMsg.show({text: '不支持此种类型的文件'})
    } 
    else if (this.files[0].size > 10000000) {
      // return alert('文件太大了')
      return that.$reminderMsg.show({text: '图片大小不得超过10M'})
    }
    // else if(this.files[0].size > 10000000)
    var fullScreenImg = new Image()
    fullScreenImg.onload = function () {
      var _this = this;
      setTimeout(function(){
        // if (!imgSupport.validationImageSize(_this.width, _this.height)) {
        //   loading(0)
        //   return that.$reminderMsg.show({text: '图片尺寸或比例不符合'})
        // }
        if (sucCb)sucCb(_this)
      }, 0)
    }
    fullScreenImg.src = imgSupport.inputPath2url(this.files[0])
}

export function ezGesture(img) {
  renderFileChangedImg(_this, $('#bridgeImg')[0])
  .then(res => {
    var cropGesture = new EZGesture($('#dropArea_mask')[0], $('#dropImg')[0], {
        targetMinWidth: parseInt($('#dropArea').offset().width),
        targetMinHeight: parseInt($('#dropArea').offset().height)
    })

    setTimeout(() => {
      var imgOriginX = cropGesture.targetMinWidth == 0 ? ($('#dropImg').width() - $('#dropArea').width()) * 0.5 : ($('#dropImg').width() - cropGesture.targetMinWidth) * 0.5;
      var imgOriginY = cropGesture.targetMinHeight == 0 ? ($('#dropImg').height() - $('#dropArea').height()) * 0.5 : ($('#dropImg').height() - cropGesture.targetMinHeight) * 0.5;
      // 初始时 将图片调至中间部分
      $('#dropImg').css('left', '-' + imgOriginX + 'px')
      $('#dropImg').css('top', '-' + imgOriginY + 'px')

      $('#firstPage').hide()
      loading(0)
    }, 60)
  })
}
// file 站外图片渲染
export function renderFileChangedImg(img, distImg) {
    return new Promise(function (resolve, reject) {
        EXIF.getData(img, _ => {
            var allMetaData = EXIF.getAllTags(img);
            var orientation = allMetaData.Orientation;

            var mpImg = new MegaPixImage(img);
            mpImg.render(distImg, {
                maxWidth: 980,
                maxHeight: 980,
                // quality: 0.6,
                orientation: orientation
            }, resolve);

        })
    })
}

export function save(){
  const param = new SaveShareParam(
    $('#distImg').attr('src'),
    SaveShareParam.types.image
  )
  BridgeFactory.getBridge().save(param, () => {
    _hmt.push(['_trackEvent', '2019redPackets' + Handlers.myApp.inState, 'Btn', '保存图片'])
    $('.toast').show().addClass('run');
    setTimeout(function(){
      $('.toast').removeClass('run').hiden()
    }, 2100)
  })
}

export function share() {
  _hmt.push(['_trackEvent', '2019redPackets' + Handlers.myApp.inState, 'Btn', '分享图片'])
  let url = $('#distImg')[0].src;
  const param = new SaveShareParam(url, SaveShareParam.types.image);
  var iosState = false;
  BridgeFactory.getBridge().shareWithCallback(param, () => {
    if (!iosState){
      iosState = !iosState
      // if(!!cb){cb()};
    }
  })
}

export function sharePage() {
  let title = "王欢斌的皮 - title";
  let content = "拜年红包 解锁要红包的新姿势 -content";
  let url = 'http://www.baidu.com';
  let thumbnail = 'https://h5.kajicam.com/favicon.ico'

  let params = new SaveShareParam(url, SaveShareParam.types.web, title, content, thumbnail);
  BridgeFactory.getBridge().shareWithCallback(params, result => {
    alert('分享链接')
  })
}
