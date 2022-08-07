module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;

  const FilesSchema = new Schema({
    key: {
      type: String,
      require: true,
    },
    label: {
      type: String,
      require: true,
    },
    value: {
      type: String,
      require: true,
    },
    type: {
      type: Number,
      require: true,
    },
    children: {
      type: Array,
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
  });

  return mongoose.model('webconfig_files', FilesSchema);
};
