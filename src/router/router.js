import App from '../App'

export default [{
    path: '/',
    component: App,
    children: [{
        path: '/a', redirect: '/b'
    }, {
        //话术配置路由
        path: '/talkflow',
        //code splitting
        component: r => require.ensure([], () => r(require('../page/talkflow/index')), 'talkflow-entry'),
        children: [
          {
            //话术配置首页
            path: '',
            component: r => require.ensure([], () => r(require('../page/talkflow/talkflow')), 'talkflow')
          },  {
            //话术配置详情页
            path: 'talkflow_detail/:seqId/:termName',
            component: r => require.ensure([], () => r(require('../page/talkflow/talkflow-detail/talkflow-detail')), 'talkflow-detail')
          }
        ]
    }, {
        //拨打详情
        path: '/chat/:seqId/:userName',
        component: r => require.ensure([], () => r(require('../page/chat/chat')), 'chat')
    }, {
        //ai外呼任务
        path: '/aitask',
        component: r => require.ensure([], () => r(require('../page/aitask/index')), 'aitask-entry'),
        children: [
          {
            //AI外呼任务首页
            path: '',
            component: r => require.ensure([], () => r(require('../page/aitask/aitask')), 'aitask')
          },  {
            //AI外呼任务详情页
            path: 'aitask_detail/:seqId/:taskName',
            component: r => require.ensure([], () => r(require('../page/aitask/aitask-detail/aitask-detail')), 'aitask-detail')
          }
        ]
    }]
}]
