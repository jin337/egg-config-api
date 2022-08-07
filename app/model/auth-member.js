module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;

  const AuthMemberSchema = new Schema({
    id: {
      type: String,
      require: true,
    },
    nickname: {
      type: String,
      require: true,
    },
    username: {
      type: String,
      require: true,
    },
    password: {
      type: String,
      require: true,
      select: false,
    },
    role: {
      type: mongoose.ObjectId,
      ref: 'webconfig_auth_role',
      required: true,
    },
    type: {
      type: Number,
      require: true,
      enum: [ 0, 1 ], // 0-禁用，1-启用
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

  return mongoose.model('webconfig_auth_member', AuthMemberSchema);
};
