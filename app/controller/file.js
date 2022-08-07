'use strict';

const Controller = require('egg').Controller;
const path = require('path');

class FileController extends Controller {
  // 上传
  async uploads() {
    const { ctx, service, app } = this;
    const body = ctx.request.body;
    try {
      ctx.validate({
        parent: { type: 'string' },
      }, body);
      const file = ctx.request.files[0];
      if (file.fieldname === 'file') {
        const folder = body.parent.replace('-', '/');
        const basename = path.basename(file.filename).split('.');
        const name = folder + '/' + basename[0] + '-' + Date.now() + '.';
        let fileName = name + basename[1];
        if (body.value) {
          const { Files } = app.model;
          const data = await Files.find();
          const item = ctx.helper.getParent(data, 'key', body.value);
          fileName = folder + '/' + item.label + '-' + item.value.split(item.label + '-')[1];
        }
        const resultOss = await ctx.oss.put(fileName, file.filepath);

        if (body.value) {
          ctx.body = {
            code: 200,
            message: '替换成功',
          };
        } else {
          // 保存
          const data = {
            key: body.parent,
            label: basename[0],
            value: resultOss.url,
            type: 2,
          };
          const FilesSerice = service.files;
          const result = await FilesSerice.updateFiles(data);

          ctx.body = {
            code: 200,
            message: '上传成功',
            data: result.url,
          };
        }
      }
    } catch (error) {
      ctx.throw({
        code: 400,
        message: '请选择要上传的文件',
      });
    }

  }
  // 新建文件夹
  async addFolder() {
    const { ctx, service } = this;
    const body = ctx.request.body;
    try {
      ctx.validate({
        parent: { type: 'string' },
        name: { type: 'string' },
      }, body);
    } catch (error) {
      const errors = error.errors[0];
      ctx.throw({
        code: 400,
        message: `${errors.code}，${errors.field} ${errors.message}`,
      });
    }

    // 保存
    const data = {
      key: body.parent,
      label: body.name,
      value: body.name,
      type: 1,
      children: [],
    };
    const FilesSerice = service.files;
    await FilesSerice.updateFiles(data);

    ctx.body = {
      code: 200,
      message: '新建成功',
    };
  }
  // 资源库
  async fileList() {
    const { ctx, app } = this;
    const { Files } = app.model;
    const body = ctx.query;

    const total = await Files.countDocuments({});
    if (!total) {
      ctx.body = {
        code: 200,
        data: {},
      };
    }
    const data = await Files.find();
    const item = ctx.helper.getParent(data, 'key', body.parent);
    if (item) {
      const children = [];
      for (const [ , value ] of Object.entries(item.children)) {
        delete value.children;
        children.push(value);
      }

      ctx.body = {
        code: 200,
        data: children,
      };
    } else {
      let children = [];
      if (data.length) {
        children = [{
          key: data[0].key,
          label: data[0].label,
          value: data[0].value,
          type: data[0].type,
          createAt: data[0].createAt,
        }];
      }
      ctx.body = {
        code: 200,
        data: children,
      };
    }
  }
}

module.exports = FileController;
