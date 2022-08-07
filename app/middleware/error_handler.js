module.exports = () => {
  return async function errorHandler(ctx, next) {
    try {
      await next();
    } catch (err) {
      // 记录一条错误日志
      ctx.app.emit('error', err, ctx);

      // 接口状态
      ctx.status = 200;

      // 错误响应对象
      ctx.body = {
        code: err.code,
        message: err.message,
      };
    }
  };
};
