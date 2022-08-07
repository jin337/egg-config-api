const Service = require('egg').Service;

class FilesSerice extends Service {
  get Files() {
    return this.app.model.Files;
  }

  // 编辑
  async updateFiles(data) {
    const { ctx } = this;
    const add = {
      ...data,
      createAt: new Date(),
    };
    if (data.type === 1) {
      add.key = `${data.key}-${data.value}`;
    }
    if (data.type === 2) {
      add.key = `${data.key}-${data.label}`;
    }
    const k = data.key.split('-')[0] || null;
    const parent = await this.Files.findOne({ key: k });
    if (parent) {
      const update = ctx.helper.updateParent([ parent ], 'key', data.key, add);
      return this.Files.findByIdAndUpdate(parent._id, update[0], { new: true });
    }
    const item = new this.Files(data);
    return await item.save();
  }
}

module.exports = FilesSerice;
