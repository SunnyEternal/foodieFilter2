import '@/bag/plugins/qr'

export default class imgSupport{
  static imageRule = {
      minWidth: 200,
      minHeight: 200,
      minRatio: 0.46,
      maxRatio: 2.2
  }
  // inputfile 转src = inputfile2url(files[0])
  static inputPath2url(file) {
      var url = null;
      if (window.createObjectURL != undefined) { // basic
          url = window.createObjectURL(file);
      } else if (window.URL != undefined) { // mozilla(firefox)
          url = window.URL.createObjectURL(file);
      } else if (window.webkitURL != undefined) { // webkit or chrome
          url = window.webkitURL.createObjectURL(file);
      }
      return url;
  }
  // 链接转二维码图片 el：jsdom 生成到这个节点
  // 简单方式
  // new QRCode(document.getElementById('qrcode'), 'your content');
  static createQr(el, url) {
    el.innerHTML = ''
    return new QRCode(el, {
      text: url,
      width: 140 * window.devicePixelRatio,
      height: 140 * window.devicePixelRatio,
      colorDark : "#000000",
      colorLight : "#ffffff",
      correctLevel : QRCode.CorrectLevel.H
    })
    // $(el).find('img')[0].crossOrigin = 'Anonyous'
  }
  // 给图片上添加二维码
  static addQr(_this){
    var canvas = document.createElement("canvas");
    canvas.style.width = '750px'
    canvas.style.height = '1000px'
    var context = canvas.getContext('2d')
    var backingStore = context.backingStorePixelRatio ||
                context.webkitBackingStorePixelRatio ||
                context.mozBackingStorePixelRatio ||
                context.msBackingStorePixelRatio ||
                context.oBackingStorePixelRatio ||
                context.backingStorePixelRatio || 1;
    var ratio = (window.devicePixelRatio || 1) / backingStore; //定义任意放大倍数 支持小数
    var scale = ratio > 2 ? ratio : 2;
    console.log(ratio, scale);
    canvas.width = 750 * scale//定义canvas 宽度 * 缩放
    canvas.height = 1000 * scale//定义canvas 高度 *缩放
    context.scale(scale, scale)//获取context,设置scale
    context.mozImageSmoothingEnabled = false
    context.webkitImageSmoothingEnabled = false
    context.msImageSmoothingEnabled = false
    context.imageSmoothingEnabled = false

    context.drawImage(_this, 0, 0, 750, 1000);
    // context.drawImage(qr, 0, 0, 260, 260, 602, 852, 135, 135);
    context.drawImage(qr, 0, 0, 260, 260, 13, 856, 132, 132);
    return Canvas2Image.convertToJPEG(canvas, canvas.width, canvas.height);
    // return _img
  }
  static validationImageSize(width, height) {
      if (width == 0 || height == 0) {
          return false
      }
      if (width >= height && height < imgSupport.imageRule.minWidth) {
          // Logger.error("too small image: width " + width, 5);
          return false
      }
      if (width < height && width < imgSupport.imageRule.minHeight) {
          // Logger.error("too small image: height " + height, 5);
          return false
      }
      const imageRatio = width / height;
      if (imageRatio < imgSupport.imageRule.minRatio || imageRatio > imgSupport.imageRule.maxRatio) {
          // Logger.error("invalid image ratio: " + imageRatio, 5);
          return false
      }
      return true
  }
  // 将即将上传的图片裁切实用部分
  // 图片展示框 用户可放大滑动 其实只用了中间部分裁取要上传的图片越小越好
  static cutAutoImage(src) {
    return new Promise((resolve, reject) => {
      let drawCanvas = document.createElement('canvas')
      let ctx = drawCanvas.getContext('2d')
      ctx.clearRect(0, 0, drawCanvas.width, drawCanvas.height)
      var backingStore = ctx.backingStorePixelRatio ||
                  ctx.webkitBackingStorePixelRatio ||
                  ctx.mozBackingStorePixelRatio ||
                  ctx.msBackingStorePixelRatio ||
                  ctx.oBackingStorePixelRatio ||
                  ctx.backingStorePixelRatio || 1;
      var ratio = (window.devicePixelRatio || 1) / backingStore;

      let dropAreaWidth = $('#dropArea').offset().width
      let dropAreaHeight = $('#dropArea').offset().height

      let img = new Image()
      // img.crossorigin = 'Anonymous'
      img.onload = function () {
        //  缩放比
        var origin2AutoRatio;
        console.log('1111', this.width, parseInt($('#dropImg').offset().width));
        if ($('#dropImg').css('width') == '100%'){
          origin2AutoRatio = this.width / parseInt($('#dropImg').offset().width)
        } else {
          origin2AutoRatio = this.height / parseInt($('#dropImg').offset().height)
        }
        // console.log($('#dropImg').css('width') == '100%', origin2AutoRatio, this.width,this.height, parseInt($('#dropImg').offset().width),parseInt($('#dropImg').offset().height));
        let autoImgOffsetLeft = Math.abs(parseInt($('#dropImg').css('left')))
        let autoImgOffsetTop = Math.abs(parseInt($('#dropImg').css('top')))

        drawCanvas.style.width = dropAreaWidth + 'px'
        drawCanvas.style.height = dropAreaHeight + 'px'

        var scale = ratio > 2 ? ratio : 2;
        // var scale = 2;
        drawCanvas.width = dropAreaWidth * scale
        drawCanvas.height = dropAreaHeight * scale
        ctx.scale(scale, scale)
        // ctx.mozImageSmoothingEnabled = false
        // ctx.webkitImageSmoothingEnabled = false
        // ctx.msImageSmoothingEnabled = false
        // ctx.imageSmoothingEnabled = false
        // console.log(this);
        ctx.drawImage(this, autoImgOffsetLeft * origin2AutoRatio, autoImgOffsetTop * origin2AutoRatio, dropAreaWidth * origin2AutoRatio, dropAreaHeight * origin2AutoRatio, 0, 0, dropAreaWidth, dropAreaHeight)

        let img = Canvas2Image.convertToJPEG(drawCanvas, dropAreaWidth * scale, dropAreaHeight * scale)
        var _img = new Image();
        _img.src = img.src;
        _img.onload = function(){
          resolve(this)
          console.log('CutAutoImage length:', img.src.length, 'scale:', scale, 'ratio:', ratio, img.width, img.height);
        }

      }
      img.src = src
    })
  }
  static cutAutoImageA (src, _ctx, _x, _y, _w, _h) {
    return new Promise((resolve, reject) => {

      let dropAreaWidth = $('#dropArea').offset().width
      let dropAreaHeight = $('#dropArea').offset().height

      let img = new Image()
      // img.crossorigin = 'Anonymous'
      img.onload = function () {
        //  缩放比
        var origin2AutoRatio;

        if ($('#dropImg').css('width') == '100%'){
          origin2AutoRatio = this.width / parseInt($('#dropImg').offset().width)
        } else {
          origin2AutoRatio = this.height / parseInt($('#dropImg').offset().height)
        }
        // console.log($('#dropImg').css('width') == '100%', origin2AutoRatio, this.width,this.height, parseInt($('#dropImg').offset().width),parseInt($('#dropImg').offset().height));
        let autoImgOffsetLeft = Math.abs(parseInt($('#dropImg').css('left')))
        let autoImgOffsetTop = Math.abs(parseInt($('#dropImg').css('top')))

        _ctx.drawImage(this, autoImgOffsetLeft * origin2AutoRatio, autoImgOffsetTop * origin2AutoRatio, dropAreaWidth * origin2AutoRatio, dropAreaHeight * origin2AutoRatio, _x, _y, _w, _h)
        setTimeout(() => { resolve() })

      }
      img.src = src
    })
  }
}
