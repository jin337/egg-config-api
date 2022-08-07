module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;

  const menu = new Schema({
    open: {
      type: Array,
      require: true,
    },
    itemKey: {
      type: String,
      require: true,
    },
    text: {
      type: String,
      require: true,
    },
    path: {
      type: String,
      require: true,
    },
  });

  const AuthRoleSchema = new Schema({
    id: {
      type: String,
      require: true,
    },
    rolename: {
      type: String,
      require: true,
    },
    type: {
      type: Number,
      require: true,
      enum: [ 0, 1 ], // 0-禁用，1-启用
    },
    menuList: {
      type: [{
        itemKey: {
          type: String,
          require: true,
        },
        text: {
          type: String,
          require: true,
        },
        path: {
          type: String,
          require: true,
        },
        items: {
          type: [ menu ],
          require: true,
        },
      }],
    },
    createBy: {
      type: mongoose.ObjectId,
      ref: 'webconfig_auth_member',
      required: true,
    },
    updateBy: {
      type: mongoose.ObjectId,
      ref: 'webconfig_auth_member',
      required: true,
    },
    createAt: {
      type: Date,
      default: Date.now,
    },
    updateAt: {
      type: Date,
      default: Date.now,
    },
  });

  return mongoose.model('webconfig_auth_role', AuthRoleSchema);
};
