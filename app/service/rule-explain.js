const Service = require('egg').Service;

class RuleExplainService extends Service {
  get RuleExplain() {
    return this.app.model.RuleExplain;
  }

  // 查询参数是否存在
  findByRuleExplain(id) {
    return this.RuleExplain.findOne({ id });
  }
  // 新增
  async createRuleExplain(data) {
    const result = await this.RuleExplain.find();
    const last = result.slice(-1);
    let id = null;
    if (last.length > 0) {
      id = Number(last[0].id) + 1;
    } else {
      id = 1;
    }
    data.id = id;

    const item = new this.RuleExplain(data);
    await item.save();
    return item;
  }

  // 编辑
  async updateRuleExplain(data) {
    const item = await this.RuleExplain.findOne({ id: data.id });
    data.updateAt = new Date();
    return this.RuleExplain.findByIdAndUpdate(item._id, data, { new: true });
  }
}

module.exports = RuleExplainService;
