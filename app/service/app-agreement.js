const Service = require('egg').Service;

class AppAgreementService extends Service {
  get AppAgreement() {
    return this.app.model.AppAgreement;
  }

  // 查询参数是否存在
  findByAppAgreement(id) {
    return this.AppAgreement.findOne({ id });
  }
  // 新增
  async createAppAgreement(data) {
    const result = await this.AppAgreement.find();
    const last = result.slice(-1);
    let id = null;
    if (last.length > 0) {
      id = Number(last[0].id) + 1;
    } else {
      id = 1;
    }
    data.id = id;

    const item = new this.AppAgreement(data);
    await item.save();
    return item;
  }

  // 编辑
  async updateAppAgreement(data) {
    const item = await this.AppAgreement.findOne({ id: data.id });
    data.updateAt = new Date();
    return this.AppAgreement.findByIdAndUpdate(item._id, data, { new: true });
  }
}

module.exports = AppAgreementService;
