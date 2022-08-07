const Service = require('egg').Service;

class setConfigSerice extends Service {
  // 查询
  findConfig(from, path) {
    const { model } = this.app;
    const keys = {
      1: 'RuleExplain',
      2: 'AppAgreement',
      3: 'GameExplain',
      4: 'OfficialWebsite',
    };
    return model[keys[from]].findOne({ path }).populate('createBy').populate('updateBy');
  }

  // 编辑
  async updateSetConfig(data) {
    const { model } = this.app;
    const keys = {
      1: 'RuleExplain',
      2: 'AppAgreement',
      3: 'GameExplain',
      4: 'OfficialWebsite',
    };
    const item = await model[keys[data.from]].findOne({ id: data.id });
    data.updateAt = new Date();
    return model[keys[data.from]].findByIdAndUpdate(item._id, data, { new: true });
  }
}

module.exports = setConfigSerice;
