const Service = require('egg').Service;

class AuthRoleService extends Service {
  get AuthRole() {
    return this.app.model.AuthRole;
  }

  // 查询参数是否存在
  findByAuthRole(id) {
    return this.AuthRole.findOne({ id });
  }
  // 新增
  async createAuthRole(data) {
    const result = await this.AuthRole.find();
    const last = result.slice(-1);
    let id = null;
    if (last.length > 0) {
      id = Number(last[0].id) + 1;
    } else {
      id = 1;
    }
    data.id = id;

    const item = new this.AuthRole(data);
    await item.save();
    return item;
  }

  // 编辑
  async updateAuthRole(data) {
    const item = await this.AuthRole.findOne({ id: data.id });
    data.updateAt = new Date();
    return this.AuthRole.findByIdAndUpdate(item._id, data, { new: true });
  }
}

module.exports = AuthRoleService;
