const Service = require('egg').Service;

class OfficialWebsiteService extends Service {
  get OfficialWebsite() {
    return this.app.model.OfficialWebsite;
  }

  // 查询参数是否存在
  findByOfficialWebsite(id) {
    return this.OfficialWebsite.findOne({ id });
  }
  // 新增
  async createOfficialWebsite(data) {
    const result = await this.OfficialWebsite.find();
    const last = result.slice(-1);
    let id = null;
    if (last.length > 0) {
      id = Number(last[0].id) + 1;
    } else {
      id = 1;
    }
    data.id = id;

    const item = new this.OfficialWebsite(data);
    await item.save();
    return item;
  }

  // 编辑
  async updateOfficialWebsite(data) {
    const item = await this.OfficialWebsite.findOne({ id: data.id });
    data.updateAt = new Date();
    return this.OfficialWebsite.findByIdAndUpdate(item._id, data, { new: true });
  }
}

module.exports = OfficialWebsiteService;
