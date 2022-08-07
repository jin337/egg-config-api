module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;

  const UserSchema = new Schema({
    id: {
      type: Number,
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
    createAt: {
      type: Date,
      default: Date.now,
    },
  });

  return mongoose.model('webconfig_user', UserSchema);
};
