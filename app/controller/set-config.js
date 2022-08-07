'use strict';

const Controller = require('egg').Controller;

class setConfigController extends Controller {
  // 查询
  async detail() {
    const { ctx, service } = this;
    const body = ctx.query;

    // 数据校验
    try {
      ctx.validate({
        path: { type: 'string' },
        from: { type: 'string' },
      }, body);
    } catch (error) {
      const errors = error.errors[0];
      ctx.throw({
        code: 400,
        message: `${errors.code}，${errors.field} ${errors.message}`,
      });
    }

    // 文档是否存在
    const setConfigSerice = service.setConfig;
    const item = await setConfigSerice.findConfig(body.from, body.path);

    if (!item) {
      ctx.throw({
        code: 423,
        message: '文档不存在',
      });
    }

    if (item.type === 1) {
      ctx.body = {
        code: 200,
        data: {
          id: item.id || null,
          title: item.title || null,
          path: item.path || null,
          type: item.type || null,
          withApp: item.withApp || null,
          content: item.content || null,
          createBy: item.createBy ? item.createBy.nickname : null,
          updateBy: item.updateBy ? item.updateBy.nickname : null,
          createAt: item.createAt,
          updateAt: item.updateAt,
        },
      };
    } else {
      ctx.body = {
        code: 400,
        message: '该页面已关闭',
      };
    }
  }
  // 修改
  async update() {
    const { ctx, service } = this;
    const { body } = ctx.request;
    // 数据校验
    try {
      const type1 = {
        id: { type: 'string' },
        title: { type: 'string' },
        path: { type: 'string' },
        from: { type: 'string' },
        type: { type: 'enum', values: [ 0, 1 ] },
        withApp: { type: 'enum', values: [ 2, 7, 8, 9 ] },
      };
      const type2 = {
        id: { type: 'string' },
        title: { type: 'string' },
        path: { type: 'string' },
        from: { type: 'string' },
        type: { type: 'enum', values: [ 0, 1 ] },
      };
      const typeList = {
        1: type1,
        2: type1,
        3: type1,
        4: type2,
      };
      ctx.validate(typeList[body.from], body);
    } catch (error) {
      const errors = error.errors[0];
      ctx.throw({
        code: 400,
        message: `${errors.code}，${errors.field} ${errors.message}`,
      });
    }

    // 文档是否存在
    const setConfigSerice = service.setConfig;
    const item = await setConfigSerice.findConfig(body.from, body.path);

    if (!item) {
      ctx.throw({
        code: 400,
        message: '文档不存在',
      });
    }
    if (item.type === 1) {
      // 更新
      body.updateBy = ctx.user._id;
      await setConfigSerice.updateSetConfig(body);

      // 发送响应
      ctx.body = {
        code: 200,
        message: '更新成功',
      };
    } else {
      ctx.body = {
        code: 400,
        message: '该页面已关闭',
      };
    }
  }
}

module.exports = setConfigController;
