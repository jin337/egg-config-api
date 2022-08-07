const Service = require('egg').Service;

class AuthMemberService extends Service {
  get AuthMember() {
    return this.app.model.AuthMember;
  }

  // 查询参数是否存在
  findByAuthMember(id) {
    return this.AuthMember.findOne({ id });
  }
  // 新增
  async createAuthMember(data) {
    const { ctx } = this;
    const result = await this.AuthMember.find();
    const last = result.slice(-1);
    let id = null;
    if (last.length > 0) {
      id = Number(last[0].id) + 1;
    } else {
      id = 1;
    }
    data.id = id;
    data.password = ctx.helper.md5('123456');

    const user = new this.AuthMember(data);
    await user.save();
    return user;
  }

  // 编辑
  async updateAuthMember(data) {
    const item = await this.AuthMember.findOne({ id: data.id });
    data.updateAt = new Date();
    return this.AuthMember.findByIdAndUpdate(item._id, data, { new: true });
  }
}

module.exports = AuthMemberService;
