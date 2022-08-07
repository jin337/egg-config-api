'use strict';

const Controller = require('egg').Controller;

class UserController extends Controller {
  // 注册
  async create() {
    const { ctx, service } = this;
    const body = ctx.request.body;
    const UserSerice = service.user;
    // 数据校验
    try {
      ctx.validate({
        nickname: { type: 'string' },
        username: { type: 'string' },
        password: { type: 'string' },
      }, body);
    } catch (error) {
      const errors = error.errors[0];
      ctx.throw({
        code: 400,
        message: `${errors.code}，${errors.field} ${errors.message}`,
      });
    }

    // 判断账号是否已存在
    if (await UserSerice.findByUser(body.username)) {
      ctx.throw({
        code: 400,
        message: '用户名已存在',
      });
    }

    // 保存用户
    const user = await UserSerice.createUser(body);

    // 发送响应
    ctx.body = {
      code: 200,
      message: '创建成功',
      data: {
        id: user.id,
        username: user.username,
        nickname: user.nickname,
        createAt: user.createAt,
      },
    };
  }
  // 登录
  async login() {
    const { ctx, service } = this;
    const body = ctx.request.body;
    const UserSerice = service.user;

    // 数据校验
    try {
      ctx.validate({
        username: { type: 'string' },
        password: { type: 'string' },
      }, body);
    } catch (error) {
      const errors = error.errors[0];
      ctx.throw({
        code: 400,
        message: `${errors.code}，${errors.field} ${errors.message}`,
      });
    }

    // 用户是否存在
    const user = await UserSerice.findByUser(body.username);
    if (!user) {
      ctx.throw({
        code: 400,
        message: '用户不存在',
      });
    }

    // 密码是否正确
    if (ctx.helper.md5(body.password) !== user.password) {
      ctx.throw({
        code: 400,
        message: '密码不正确',
      });
    }

    // 生成token
    const token = UserSerice.createToken({
      userId: user._id,
      time: new Date().getTime(),
    });

    ctx.body = {
      code: 200,
      data: token,
    };
  }
  // 登出
  async exit() {
    const { ctx } = this;
    ctx.user = null;
    ctx.body = {
      code: 200,
      data: '退出成功',
    };
  }
  // 用户详情
  async userInfo() {
    const { ctx } = this;
    const user = ctx.user;
    if (user) {
      ctx.body = {
        code: 200,
        data: {
          id: user.id,
          username: user.username,
          nickname: user.nickname,
          createAt: user.createAt,
        },
      };
    }
  }
  // 修改密码
  async editPassword() {
    const { ctx, service } = this;
    const body = ctx.request.body;
    const UserSerice = service.user;
    // 数据校验
    try {
      ctx.validate({
        username: { type: 'string' },
        password: { type: 'string' },
        old_password: { type: 'string' },
      }, body);
    } catch (error) {
      const errors = error.errors[0];
      ctx.throw({
        code: 400,
        message: `${errors.code}，${errors.field} ${errors.message}`,
      });
    }

    // 文档是否存在
    const item = await UserSerice.findByUser(body.username);
    if (!item) {
      ctx.throw({
        code: 400,
        message: '文档不存在',
      });
    }

    // 更新
    const type = await UserSerice.updateUser(body);
    // 发送响应
    if (type) {
      ctx.body = {
        code: 200,
        message: '更新成功',
      };
    } else {
      ctx.body = {
        code: 400,
        message: '修改失败，密码错误',
      };
    }
  }
}

module.exports = UserController;
