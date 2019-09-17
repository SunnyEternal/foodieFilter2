import config from '@/config/index'


let apiPre = config.ajaxPrefix
console.log('apiPre:', apiPre)

function _promise(config) {
  let that = this
  return new Promise((resolve, reject) => {
    $.ajax({
      // type: method,
      // url: url,
      // data: dataObj,
      // // type of data we are expecting in return:
      // dataType: 'json',
      ...config,
      timeout: 20000,
      success: function(data){
        resolve(data)
      },
      error: function(xhr, type){
        // reject(new Error(xhr, type))
        reject(type)
      }
    })
  })
}

export function home(params) {
  // let obj = htoken ? {htoken: htoken} : ''
  return _promise({
    type: 'GET', 
    url: `${apiPre}/home?hToken=${params.hToken}&topicId=${params.topicId}`,
    dataType: 'json'
  })
  .then(res => {
    if (res.code == 200) {
      return res
    }
  })
  .catch(err => {
    console.log(err);
  })
}

export function imageUpload(params) {
  console.log('params')
  console.log(params)
  return _promise({
    type: 'POST',
    // cache: false,
    // beforeSend: function(request) {
    //   request.setRequestHeader("Authorization", params.token);
    // },
    url: `${apiPre}/pic/upload?topicId=${params.topicId}&albumId=${params.albumId}&picDescription=${params.desc}&position=${params.position}`,
    processData: false,
    contentType: false,
    data: params.formData,
    headers: {
      token: params.token,
    },
  })
  .then(res => {
    return res
  })
}

// 点赞
export function tapLike({token, id}) {
  return _promise({
    type: 'POST',
    // cache: false,
    url: `${apiPre}/like?token=${token}&id=${id}`,
    contentType: "application/json"
  })
  .then(res => {
    if (res.code == 200) {
      return res
    }
  })
  .catch(err => {
    console.log(err);
  })
}

/*
  sortType: 排序 0-最新 1-点赞
  alone 单独自己
*/
// export function imgList(params) {
//   // {token, topicId}
//   config.log(params)
//   return _promise({
//     type: 'GET',
//     // cache: false,
//     // url: `${apiPre}/image/list?token=${token}&sortType=${sortType}&pageNo=${pageNo}&alone=${alone}`,
//     url: `http://foodie-beta.kajicam.com/fs/api/home?hToken=0&topicId=0`,
//     contentType: "application/json"
//   })
//   .then(res => {
//     if (res.code == 200) {
//       return res
//     }
//   })
//   .catch(err => {
//     console.log(err);
//   })
// }
export function imgList(params) {
  return _promise({
    type: 'GET',
    // cache: false,
    url: `${apiPre}/image/list?hToken=${params.hToken}&topicId=${params.topicId}`,
    contentType: "application/json"
  })
  .then(res => {
    if (res.code == 200) {
      return res
    }
  })
  .catch(err => {
    console.log(err);
  })
}

/**
 * 方法：获取topicList列表
 * 参数：@htoken 
 * */
export function topicList () {
  return _promise({type: 'GET', url: `${apiPre}/topic/list`})
  .then(res => {
    if (res.code == 200) {
      return res
    }
  })
  .catch(err => {
    console.log(err);
  })
  // return _promise({
  //   type: 'POST',
  //   // cache: false,
  //   url: `${apiPre}/topic/list`,
  //   contentType: "application/json"
  // })
  // .then(res => {
  //   if (res.code == 20000) {
  //     return res
  //   }
  // })
  // .catch(err => {
  //   console.log(err);
  // })
}

/**
 * 方法：发送短信验证码
 * 参数：@
 * */
 export function sendMsg (params) {
  return _promise({
    type: 'POST',
    data: JSON.stringify(params),
    // cache: false,
    url: `${apiPre}/sms/send`,
    contentType:'application/json;charset=utf-8',
  })
  .then(res => {
    return res
  })
  .catch(err => {
    console.log(err);
  })
 }

 /**
 * 方法：验证短信验证码
 * 参数：
 * */
export function verifyCode (params) {
  return _promise({
    type: 'POST',
    data: JSON.stringify(params),
    url: `${apiPre}/sms/verification`,
    contentType:'application/json;charset=utf-8',
  })
  .then(res => {
    // console.log(res)
    return res
  })
  .catch(err => {
    console.log(err);
  })
 }

//  http://foodie-beta.kajicam.com/fs/api/user/come
/**
 * 方法：注册用户信息
 * 参数：
 * */
// export function userCome(token) {
//   return _promise({
//     type: 'GET',
//     url: `${apiPre}/user/come?token=${token}`
//   })
//   .then(res => {
//     if (res.code == 200) {
//       return res
//     }
//   })
//   .catch(err => {
//     console.log(err);
//   })
// }
export function userCome (token) {
  return _promise({
    type: "GET", 
    url: `${apiPre}/user/come`,
    headers: {
      token: token,
      accept: "application/json; charset=utf-8",
    },
  })
  .then(res => {
    if (res.code == 200) {
      return res
    } else if (res.code == 10005) {
      return {errMsg: res.message}
    }
  })
  .catch(err => {
    console.log(err);
  })
}

 /**
 * 方法：注册用户信息
 * 参数：
 * */
export function registerUser ({userName, imageBase64, token}) {
  return _promise({
    type: 'POST',
    data: imageBase64,
    url: `${apiPre}/user/login?nickname=${userName}`,
    contentType:'application/json;charset=utf-8',
    beforeSend: function (XMLHttpRequest) {
      XMLHttpRequest.setRequestHeader('token', token);
    },
  })
  .then(res => {
    return res
    // if (res.code == 200) {
    //   return res
    // } else if (res.code == 400) {
    //   return {errMsg: res.message}
    // }
  })
  .catch(err => {
    console.log(err);
  })
}

/**
 * 方法：我的作品列表
 * 参数：
 * */
export function myWorkList (params) {
  return _promise({
    type: 'GET',
    contentType: "application/json",
    headers: {
      token: params.token,
      // accept: "application/json; charset=utf-8",
      // xhrFields: {
      //   withCredentials: true
      // }
    },
    url: `${apiPre}/pic/list?pageNum=${params.pageNo}&pageSize=${params.pageSize}`
    // url: `/pic/list?pageNum=${params.pageNo}&pageSize=${params.pageSize}`,
    
  })
  .then(res => {
    // if (res.code == 200) {
      return res
    // }
  })
  .catch(err => {
    console.log(err);
  })
}

/**
 * 方法：我的作品列表
 * */
export function deleteWork (params) {
  return _promise({
    type: 'POST',
    url: `${apiPre}/pic/delete?picId=${params.id}`,
    contentType:'application/json;charset=utf-8',
    headers: {
      token: params.token,
      // accept: "application/json;charset=utf-8",
    },
  })
  .then(res => {
    if (res.code == 200) {
      return res
    }
  })
  .catch(err => {
    console.log(err);
  })
}



/**
 * 方法：创建相册 2019.9.16
 */
export function createAlbum (params) {
  return _promise({
    type: 'POST',
    url: `${apiPre}/album/add?name=${params.name}&description=${params.description}`,
    contentType:'application/json;charset=utf-8',
    headers: {
      token: params.token
    },
  })
  .then(res => {
    if (res.code == 200) {
      return res
    }
  })
  .catch(err => {
    console.log(err);
  })
}
/**
 * 方法：编辑相册 2019.9.16
 */
export function editAlbum (params) {
  return _promise({
    type: 'POST',
    url: `${apiPre}/album/edit?albumId=${params.albumId}&name=${params.name}&description=${params.description}`,
    contentType:'application/json;charset=utf-8',
    headers: {
      token: params.token 
    },
  })
  .then(res => {
    if (res.code == 200) {
      console.log(res)
      return res
    }
  })
  .catch(err => {
    console.log(err);
  })
}
/**
 * 方法：删除相册 2019.9.16
 */
export function deleteAlbum (params) {
  return _promise({
    type: 'POST',
    url: `${apiPre}/album/delete?albumId=${params.albumId}`,
    contentType:'application/json;charset=utf-8',
    headers: {
      token: params.token 
    },
  })
  .then(res => {
    if (res.code == 200) {
      console.log(res)
      return res
    }
  })
  .catch(err => {
    console.log(err);
  })
}
/**
 * 方法：设置相册封面 2019.9.16
 */
export function setAlbumCover (params) {
  return _promise({
    type: 'POST',
    url: `${apiPre}/album/cover/config?albumId=${params.albumId}&picId=${params.picId}`,
    contentType:'application/json;charset=utf-8',
    headers: {
      token: params.token 
    },
  })
  .then(res => {
    if (res.code == 200) {
      console.log(res)
      return res
    }
  })
  .catch(err => {
    console.log(err);
  })
} 
/**
 * 方法：所有相册列表 2019.9.16
 */
export function allAlbum (params) {
  console.log(params)
  return _promise({
    type: 'GET',
    contentType: "application/json",
    headers: {
      token: params.token
    },
    url: `${apiPre}/album/my/list?pageNum=${params.pageNum}` 
  })
  .then(res => {
    if (res.code == 200) {
      return res
    }
  })
  .catch(err => {
    console.log(err);
  })
}

/**
 * 方法：点赞 2019.9.16
 */
export function setLike (params) {
  return _promise({
    type: 'POST',
    url: `${apiPre}/like?um5=${params.um5}&picId=${params.picId}`,
    contentType:'application/json;charset=utf-8',
  })
  .then(res => {
    if (res.code == 200) {
      return res
    }
  })
  .catch(err => {
    console.log(err);
  })
} 


/**
 * 方法：获取我的动态图片列表 2019.9.16
 */
export function getDynamicPicList (params) {
  console.log(params)
  return _promise({
    type: 'GET',
    contentType: "application/json",
    headers: {
      token: params.token
    },
    url: `${apiPre}pic/my/list?cursor=1&${params.pageNum}` 
  })
  .then(res => {
    if (res.code == 200) {
      return res
    }
  })
  .catch(err => {
    console.log(err);
  })
}
/**
 * 方法：获取某个相册下图片列表 2019.9.16
 */
export function getAlbumPicList (params) {
  console.log(params)
  return _promise({
    type: 'GET',
    contentType: "application/json",
    headers: {
      token: params.token
    },
    url: `${apiPre}/album/my/picture/list?albumId=${params.albumId}&cursor=${params.cursor}` 
  })
  .then(res => {
    if (res.code == 200) {
      return res
    }
  })
  .catch(err => {
    console.log(err);
  })
}
/**
 * 方法：获取我的具体某个话题图片列表 2019.9.16
 */
export function getTopicPicList (params) {
  console.log(params)
  return _promise({
    type: 'GET',
    contentType: "application/json",
    headers: {
      token: params.token
    },
    url: `${apiPre}/pic/my/topic/picture/list?topicId=${params.topicId}&cursor=${params.cursor}` 
  })
  .then(res => {
    if (res.code == 200) {
      return res
    }
  })
  .catch(err => {
    console.log(err);
  })
}

/**
 * 方法：获取我的所有话题图片列表 2019.9.16
 */
export function getAllTopicPicList (params) {
  console.log(params)
  return _promise({
    type: 'GET',
    contentType: "application/json",
    headers: {
      token: params.token
    },
    url: `${apiPre}/pic/my/topic/list` 
  })
  .then(res => {
    if (res.code == 200) {
      return res
    }
  })
  .catch(err => {
    console.log(err);
  })
}