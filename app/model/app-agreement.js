module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;

  const AppAgreementSchema = new Schema({
    id: {
      type: String,
      require: true,
    },
    title: {
      type: String,
      require: true,
    },
    path: {
      type: String,
      require: true,
    },
    type: {
      type: Number,
      require: true,
      enum: [ 0, 1 ], // 0-禁用，1-启用
    },
    platform: {
      type: Number,
      require: true,
      enum: [ 1, 2 ], // 1-ios，1-android
    },
    withApp: {
      type: Number,
      require: true,
      enum: [ 2, 7, 8, 9 ], // 2-yami 7-蓝颜 8-Yami极速版 9-Yavo
    },
    content: {
      type: String,
      require: true,
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

  return mongoose.model('webconfig_app_agreement', AppAgreementSchema);
};
