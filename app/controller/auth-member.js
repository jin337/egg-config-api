'use strict';

const Controller = require('egg').Controller;

class authMemberController extends Controller {
  // 新增
  async add() {
    const { ctx, service, app } = this;
    const { AuthRole } = app.model;
    const body = ctx.request.body;
    const authMemberSerice = service.authMember;
    // 数据校验
    try {
      ctx.validate({
        username: { type: 'string' },
        nickname: { type: 'string' },
        role: { type: 'string' },
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
    if (await authMemberSerice.findByAuthMember(body.username)) {
      ctx.throw({
        code: 400,
        message: '用户名已存在',
      });
    }

    // 保存用户
    body.createBy = ctx.user._id;
    body.updateBy = ctx.user._id;
    const role = await AuthRole.findOne({ id: body.role });
    body.role = role._id;
    await authMemberSerice.createAuthMember(body);

    // 发送响应
    ctx.body = {
      code: 200,
      message: '创建成功',
    };
  }
  // 列表 -- 查询，翻页
  async list() {
    const { ctx, app } = this;
    const { AuthMember, AuthRole } = app.model;
    const body = ctx.request.body;
    // 数据校验
    try {
      ctx.validate({
        page: { type: 'number' },
        pageSize: { type: 'number' },
      }, body);
    } catch (error) {
      const errors = error.errors[0];
      ctx.throw({
        code: 400,
        message: `${errors.code}，${errors.field} ${errors.message}`,
      });
    }
    // 按条件查询
    if (body.role) {
      const role = await AuthRole.findOne({ id: body.role });
      body.role = role._id;
    }
    const filter = {};
    for (const [ key, value ] of Object.entries(body)) {
      if (![ 'page', 'pageSize' ].includes(key)) {
        filter[key] = value;
      }
    }

    // 文档是否存在
    const getAuthMember = AuthMember.find(filter)
      .populate('role').populate('createBy')
      .populate('updateBy') // 关联查询
      .sort({ createAt: -1 }) // 倒序
      .skip((body.page - 1) * body.pageSize) // 页数跳转
      .limit(body.pageSize); // 每页取多少条

    // 获取列表总数
    const getTotal = AuthMember.countDocuments(filter);

    const [ list, total ] = await Promise.all([ getAuthMember, getTotal ]);

    // 修改数组返回字段
    const AuthMemberList = list.map(item => ({
      id: item.id,
      nickname: item.nickname,
      username: item.username,
      type: item.type,
      rolename: item.role ? item.role.rolename : null,
      role: item.role ? item.role.id : null,
      createBy: item.createBy ? item.createBy.nickname : null,
      updateBy: item.updateBy ? item.updateBy.nickname : null,
      createAt: item.createAt,
      updateAt: item.updateAt,
    }));

    // 发送响应
    ctx.body = {
      code: 200,
      data: {
        page: body.page,
        pageSize: body.pageSize,
        total,
        contents: AuthMemberList,
      },
    };
  }
  // 编辑
  async update() {
    const { ctx, service, app } = this;
    const { AuthRole } = app.model;
    const body = ctx.request.body;
    const authMemberSerice = service.authMember;
    // 数据校验
    try {
      ctx.validate({
        username: { type: 'string' },
        nickname: { type: 'string' },
        role: { type: 'string' },
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
    if (body.id && !await authMemberSerice.findByAuthMember(body.id)) {
      ctx.throw({
        code: 400,
        message: '文档不存在',
      });
    }

    // 更新
    body.updateBy = ctx.user._id;
    const role = await AuthRole.findOne({ id: body.role });
    body.role = role._id;
    await authMemberSerice.updateAuthMember(body);

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
    const authMemberSerice = service.authMember;
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
    if (body.id && !await authMemberSerice.findByAuthMember(body.id)) {
      ctx.throw({
        code: 400,
        message: '文档不存在',
      });
    }

    // 更新
    body.updateBy = ctx.user._id;
    await authMemberSerice.updateAuthMember(body);

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
    const authMemberSerice = service.authMember;
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
    const item = await authMemberSerice.findByAuthMember(body.id);
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

module.exports = authMemberController;
