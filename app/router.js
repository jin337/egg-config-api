'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  // 权鉴
  const auth = app.middleware.auth();
  // 基础路径
  router.prefix('/api/v1');
  // 资源
  router.post('/file/uploads', controller.file.uploads);
  router.post('/file/add-folder', auth, controller.file.addFolder);
  router.get('/file/file-list', auth, controller.file.fileList);

  // 查询&修改
  router.get('/config/detail', controller.setConfig.detail);
  router.post('/config/update', auth, controller.setConfig.update);

  // 用户
  router.post('/create', controller.user.create);
  router.post('/login', controller.user.login);
  router.get('/exit', controller.user.exit);
  router.get('/user-info', auth, controller.user.userInfo);
  router.post('/edit-password', auth, controller.user.editPassword);

  // 权限控制
  router.post('/auth-role/add', auth, controller.authRole.add);
  router.post('/auth-role/list', auth, controller.authRole.list);
  router.post('/auth-role/update', auth, controller.authRole.update);
  router.post('/auth-role/update-state', auth, controller.authRole.updateState);
  router.post('/auth-role/delete', auth, controller.authRole.delete);

  // 账号管理
  router.post('/auth-member/add', auth, controller.authMember.add);
  router.post('/auth-member/list', auth, controller.authMember.list);
  router.post('/auth-member/update', auth, controller.authMember.update);
  router.post('/auth-member/update-state', auth, controller.authMember.updateState);
  router.post('/auth-member/delete', auth, controller.authMember.delete);

  // 规则说明
  router.post('/rule-explain/add', auth, controller.ruleExplain.add);
  router.post('/rule-explain/list', auth, controller.ruleExplain.list);
  router.post('/rule-explain/update', auth, controller.ruleExplain.update);
  router.post('/rule-explain/update-state', auth, controller.ruleExplain.updateState);
  router.post('/rule-explain/delete', auth, controller.ruleExplain.delete);

  // app协议
  router.post('/app-agreement/add', auth, controller.appAgreement.add);
  router.post('/app-agreement/list', auth, controller.appAgreement.list);
  router.post('/app-agreement/update', auth, controller.appAgreement.update);
  router.post('/app-agreement/update-state', auth, controller.appAgreement.updateState);
  router.post('/app-agreement/delete', auth, controller.appAgreement.delete);

  // 游戏说明
  router.post('/game-explain/add', auth, controller.gameExplain.add);
  router.post('/game-explain/list', auth, controller.gameExplain.list);
  router.post('/game-explain/update', auth, controller.gameExplain.update);
  router.post('/game-explain/update-state', auth, controller.gameExplain.updateState);
  router.post('/game-explain/delete', auth, controller.gameExplain.delete);

  // 官网配置
  router.post('/official-website/add', auth, controller.officialWebsite.add);
  router.post('/official-website/list', auth, controller.officialWebsite.list);
  router.post('/official-website/update', auth, controller.officialWebsite.update);
  router.post('/official-website/update-state', auth, controller.officialWebsite.updateState);
  router.post('/official-website/delete', auth, controller.officialWebsite.delete);
};
