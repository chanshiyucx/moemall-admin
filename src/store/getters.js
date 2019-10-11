const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.user.token,
  routes: state => state.user.routes,
  avatar: state => state.user.userInfo.avatar,
  name: state => state.user.userInfo.name,
  visitedViews: state => state.tagsView.visitedViews,
  cachedViews: state => state.tagsView.cachedViews
}
export default getters
