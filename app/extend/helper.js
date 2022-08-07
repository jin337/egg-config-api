const crypto = require('crypto');

module.exports = {
  md5(data) {
    return crypto.createHash('md5').update(data).digest('hex');
  },
  // 更新
  updateParent(treeData, key, value, update) {
    const fn = (treeData, key, value, update) => {
      if (!treeData.length) return key;
      for (let index = 0; index < treeData.length; index++) {
        if (treeData[index][key] === value) {
          const res = treeData[index];
          update && res.children.push(update);
          break;
        }
        if (treeData[index].children) {
          if (treeData[index].children.length) {
            fn(treeData[index].children, key, value, update);
          }
        }
      }
    };
    fn(treeData, key, value, update);
    return treeData;
  },
  // 获取参数项目
  getParent(treeData, key, value) {
    let res = null;
    const fn = (treeData, key, value) => {
      if (!treeData.length) return key;
      for (let index = 0; index < treeData.length; index++) {
        if (treeData[index][key] === value) {
          res = treeData[index];
          break;
        }
        if (treeData[index].children) {
          if (treeData[index].children.length) {
            fn(treeData[index].children, key, value);
          }
        }
      }
    };
    fn(treeData, key, value);
    return res;
  },
};
