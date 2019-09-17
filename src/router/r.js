import Vue from 'vue'
import Router from 'vue-router'
import P5 from '@/components/list'

import P2 from '@/components/register'
import ErrPage from '@/components/404'

import Login from '@/components/login'
import User from '@/components/user'
import Work from '@/components/work'

import My from '@/components/my'
import AddPic from '@/components/addPic'
import List1 from '@/components/list1'
import Dynamic from '@/components/dynamic'
import Gallery from '@/components/gallery'
import myTopic from '@/components/myTopic'
import Posi from '@/components/position'
import GalleryList from '@/components/galleryList'
import TopicPage from '@/components/topicPage'

import MyAllTopicPic from '@/components/myAllTopicPic'

Vue.use(Router)

export default new Router({
  // mode: 'history',
  routes: [
    {
      path: '/',
      redirect: {name: 'list'}
    },
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '/user',
      name: 'user',
      component: User
    },
    {
      path: '/work',
      name: 'work',
      component: Work
    },
    {
      path: '/register',
      name: 'register',
      component: P2
    },
    {
      path: '/position',
      name: 'position',
      component: Posi
    },
    {
      path: '/gList',
      name: 'galleryList',
      component: GalleryList
    },
    {
      path: '/topicPage',
      name: 'topicPage',
      component: TopicPage
    },
    {
      path: '/my',
      name: 'my',
      component: My,
      children: [
        {
          path: 'dynamic',
          name: 'dynamic',
          component: Dynamic
        },
        {
          path: 'gallery',
          name: 'gallery',
          component: Gallery
        },
        {
          path: 'myTopic',
          name: 'myTopic',
          component: myTopic
        },
        {
          path: '/my',
          redirect: {name: 'dynamic'}
        }
      ]
    },
    {
      path: '/addPic',
      name: 'addPic',
      component: AddPic
    },
    {
      path: '/myAllTopicPic',
      name: 'myAllTopicPic',
      component: MyAllTopicPic
    },
    {
      path: '/list',
      name: 'list',
      component: P5,
      // meta: {
      //   keepAlive: false, //该字段表示该页面需要缓存
      //   isBack: true //判断是否是返回
      // }
    },
    {
      path: '/404',
      name: '404',
      component: ErrPage
    },
    {
      path: '*',
      redirect: {name: '404'}
    }
  ]
})
