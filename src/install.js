import VnodeCache from './vnode-cache.js'
function install(Vue, bus, tabbar) {
  // vnode-cache 组件
  Vue.component('vnode-cache', VnodeCache(bus, tabbar))

  Vue.prototype.$vueAppEffect = {
    on: (event, callback) => {
      bus.$on(event, callback)
    },
    back: (vm) => {
      window.$VueAppEffect.paths.pop()
      vm.$router.replace({
        name: window.$VueAppEffect.paths.concat([]).pop()
      })
    },
    next: (options) => {
      let routePath = options.path;
      routePath = routePath.indexOf('/') !== 0 ? `/${routePath}` : routePath;
      let find = options.vm.$router.options.routes.findIndex(function (item) {
        return item.path === routePath;
      });
      if (find === -1) {
        // 找出匹配的重复使用组件 
        let routeName = routePath.split('/')
        routeName.pop()
        routeName = routeName.join('/');

        let route = options.vm.$router.options.routes.find(item => {
          return item.name === routeName
        })
        if (!route) {
          throw Error(routeName + ' is not defined');
        }
        let newRoute = [{
          path: routePath,
          name: routePath,
          component: { extends: route.component }
        }];
        options.vm.$router.options.routes.push(newRoute[0]);
        options.vm.$router.addRoutes(newRoute);


      }

      options.vm.$router.push({
        name: routePath,
        params: options.params
      });
    }
  }
}
export default install