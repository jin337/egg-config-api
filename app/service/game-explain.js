const Service = require('egg').Service;

class GameExplainService extends Service {
  get GameExplain() {
    return this.app.model.GameExplain;
  }

  // 查询参数是否存在
  findByGameExplain(id) {
    return this.GameExplain.findOne({ id });
  }
  // 新增
  async createGameExplain(data) {
    const result = await this.GameExplain.find();
    const last = result.slice(-1);
    let id = null;
    if (last.length > 0) {
      id = Number(last[0].id) + 1;
    } else {
      id = 1;
    }
    data.id = id;

    const item = new this.GameExplain(data);
    await item.save();
    return item;
  }

  // 编辑
  async updateGameExplain(data) {
    const item = await this.GameExplain.findOne({ id: data.id });
    data.updateAt = new Date();
    return this.GameExplain.findByIdAndUpdate(item._id, data, { new: true });
  }
}

module.exports = GameExplainService;
