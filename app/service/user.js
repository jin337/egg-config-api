const Service = require('egg').Service;
const jwt = require('jsonwebtoken');

class UserSerice extends Service {
  get User() {
    return this.app.model.User;
  }
  // 查询参数是否存在
  findByUser(username) {
    return this.User.findOne({ username }).select('+password');
  }

  // 创建token
  createToken(data) {
    const { app } = this;
    const secret = app.config.jwt.secret;
    const expiresIn = app.config.jwt.expiresIn;
    return jwt.sign(data, secret, { expiresIn });
  }

  // 验证token
  verifyToken(data) {
    const { app } = this;
    return jwt.verify(data, app.config.jwt.secret);
  }

  // 修改密码
  async updateUser(data) {
    const { ctx } = this;
    const item = await this.User.findOne({ username: data.username }).select('+password');
    const oldPassword = ctx.helper.md5(data.old_password);
    if (oldPassword === item.password) {
      data.password = ctx.helper.md5(data.password);
      delete data.old_password;
      return this.User.findByIdAndUpdate(item._id, data, { new: true });
    }
    return false;
  }

  // 创建用户
  async createUser(data) {
    const { ctx } = this;
    const result = await this.User.find();
    const last = result.slice(-1);
    let id = null;
    if (last.length > 0) {
      id = Number(last[0].id) + 1;
    } else {
      id = 1;
    }
    data.id = id;
    data.password = ctx.helper.md5(data.password);

    const user = new this.User(data);
    await user.save();
    return user;
  }
}

module.exports = UserSerice;
