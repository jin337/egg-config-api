'use strict';

const Controller = require('egg').Controller;

class officialWebsiteController extends Controller {
  // 新增
  async add() {
    const { ctx, service } = this;
    const body = ctx.request.body;
    const officialWebsiteSerice = service.officialWebsite;
    // 数据校验
    try {
      ctx.validate({
        title: { type: 'string' },
        path: { type: 'string' },
        type: { type: 'enum', values: [ 0, 1 ] },
      }, body);
    } catch (error) {
      const errors = error.errors[0];
      ctx.throw({
        code: 400,
        message: `${errors.code}，${errors.field} ${errors.message}`,
      });
    }
    body.createBy = ctx.user._id;
    body.updateBy = ctx.user._id;
    // 保存用户
    await officialWebsiteSerice.createOfficialWebsite(body);

    // 发送响应
    ctx.body = {
      code: 200,
      message: '创建成功',
    };
  }
  // 列表 -- 查询，翻页
  async list() {
    const { ctx, app } = this;
    const { OfficialWebsite } = app.model;
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
    const filter = {};
    for (const [ key, value ] of Object.entries(body)) {
      if (![ 'page', 'pageSize' ].includes(key)) {
        filter[key] = value;
      }
    }

    // 文档是否存在
    const getOfficialWebsite = OfficialWebsite.find(filter)
      .populate('createBy').populate('updateBy') // 关联查询
      .sort({ createAt: -1 }) // 倒序
      .skip((body.page - 1) * body.pageSize) // 页数跳转
      .limit(body.pageSize); // 每页取多少条

    // 获取列表总数
    const getTotal = OfficialWebsite.countDocuments(filter);

    const [ list, total ] = await Promise.all([ getOfficialWebsite, getTotal ]);

    // 修改数组返回字段
    const OfficialWebsiteList = list.map(item => ({
      id: item.id,
      title: item.title,
      type: item.type,
      path: item.path,
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
        contents: OfficialWebsiteList,
      },
    };
  }
  // 编辑
  async update() {
    const { ctx, service } = this;
    const body = ctx.request.body;
    const officialWebsiteSerice = service.officialWebsite;
    // 数据校验
    try {
      ctx.validate({
        id: { type: 'string' },
        title: { type: 'string' },
        path: { type: 'string' },
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
    if (body.id && !await officialWebsiteSerice.findByOfficialWebsite(body.id)) {
      ctx.throw({
        code: 400,
        message: '文档不存在',
      });
    }
    body.updateBy = ctx.user._id;
    // 更新
    await officialWebsiteSerice.updateOfficialWebsite(body);

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
    const officialWebsiteSerice = service.officialWebsite;
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
    if (body.id && !await officialWebsiteSerice.findByOfficialWebsite(body.id)) {
      ctx.throw({
        code: 400,
        message: '文档不存在',
      });
    }
    body.updateBy = ctx.user._id;
    // 更新
    await officialWebsiteSerice.updateOfficialWebsite(body);

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
    const officialWebsiteSerice = service.officialWebsite;
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
    const item = await officialWebsiteSerice.findByOfficialWebsite(body.id);
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

module.exports = officialWebsiteController;
