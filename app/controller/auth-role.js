'use strict';

const Controller = require('egg').Controller;

class authRoleController extends Controller {
  // 新增
  async add() {
    const { ctx, service } = this;
    const body = ctx.request.body;
    const authRoleSerice = service.authRole;
    // 数据校验
    try {
      ctx.validate({
        rolename: { type: 'string' },
        type: { type: 'enum', values: [ 0, 1 ] },
      }, body);
    } catch (error) {
      const errors = error.errors[0];
      ctx.throw({
        code: 400,
        message: `${errors.code}，${errors.field} ${errors.message}`,
      });
    }

    // 判断账号是否已存在
    if (await authRoleSerice.findByUser(body.username)) {
      ctx.throw({
        code: 400,
        message: '权限已存在',
      });
    }

    // 保存用户
    body.createBy = ctx.user._id;
    body.updateBy = ctx.user._id;
    await authRoleSerice.createAuthRole(body);

    // 发送响应
    ctx.body = {
      code: 200,
      message: '创建成功',
    };
  }
  // 列表 -- 查询
  async list() {
    const { ctx, app } = this;
    const { AuthRole } = app.model;
    const body = ctx.request.body;

    // 按条件查询
    const filter = {};
    for (const [ key, value ] of Object.entries(body)) {
      if (![ 'page', 'pageSize' ].includes(key)) {
        filter[key] = value;
      }
    }

    // 文档是否存在
    const list = await AuthRole.find(filter)
      .populate('createBy').populate('updateBy') // 关联查询
      .sort({ createAt: -1 }); // 倒序


    // 修改数组返回字段
    const AuthRoleList = list.map(item => ({
      id: item.id,
      rolename: item.rolename,
      type: item.type,
      createBy: item.createBy ? item.createBy.nickname : null,
      updateBy: item.updateBy ? item.updateBy.nickname : null,
      createAt: item.createAt,
      updateAt: item.updateAt,
    }));

    // 发送响应
    ctx.body = {
      code: 200,
      data: AuthRoleList,
    };
  }
  // 编辑
  async update() {
    const { ctx, service } = this;
    const body = ctx.request.body;
    const authRoleSerice = service.authRole;
    // 数据校验
    try {
      ctx.validate({
        rolename: { type: 'string' },
        type: { type: 'enum', values: [ 0, 1 ] },
      }, body);
    } catch (error) {
      const errors = error.errors[0];
      ctx.throw({
        code: 400,
        message: `${errors.code}，${errors.field} ${errors.message}`,
      });
    }

    // 文档是否存在
    if (body.id && !await authRoleSerice.findByAuthRole(body.id)) {
      ctx.throw({
        code: 400,
        message: '文档不存在',
      });
    }

    // 更新
    body.updateBy = ctx.user._id;
    await authRoleSerice.updateAuthRole(body);

    // 发送响应
    ctx.body = {
      code: 200,
      message: '更新成功',
    };
  }
  // 修改状态
  async updateState() {
    const { ctx, service } = this;
    const body = ctx.request.body;
    const authRoleSerice = service.authRole;
    // 数据校验
    try {
      ctx.validate({
        id: { type: 'string' },
        type: { type: 'enum', values: [ 0, 1 ] },
      }, body);
    } catch (error) {
      const errors = error.errors[0];
      ctx.throw({
        code: 400,
        message: `${errors.code}，${errors.field} ${errors.message}`,
      });
    }

    // 文档是否存在
    if (body.id && !await authRoleSerice.findByAuthRole(body.id)) {
      ctx.throw({
        code: 400,
        message: '文档不存在',
      });
    }

    // 更新
    body.updateBy = ctx.user._id;
    await authRoleSerice.updateAuthRole(body);

    // 发送响应
    ctx.body = {
      code: 200,
      message: '更新成功',
    };
  }
  // 删除
  async delete() {
    const { ctx, service } = this;
    const body = ctx.request.body;
    const authRoleSerice = service.authRole;
    // 数据校验
    try {
      ctx.validate({
        id: { type: 'string' },
      }, body);
    } catch (error) {
      const errors = error.errors[0];
      ctx.throw({
        code: 400,
        message: `${errors.code}，${errors.field} ${errors.message}`,
      });
    }

    // 文档是否存在
    const item = await authRoleSerice.findByAuthRole(body.id);
    if (!item) {
      ctx.throw({
        code: 400,
        message: '文档不存在',
      });
    }
    await item.remove();

    ctx.body = {
      code: 200,
      message: '删除成功',
    };
  }
}

module.exports = authRoleController;
