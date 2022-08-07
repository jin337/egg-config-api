module.exports = () => {
  return async (ctx, next) => {
    const token = ctx.headers['authorization'];
    if (!token) {
      ctx.throw({
        code: 100300,
        message: 'Authorization为空',
      });
    }

    try {
      // 验证token
      const data = ctx.service.user.verifyToken(token);
      ctx.user = await ctx.model.User.findById(data.userId);
    } catch (error) {
      ctx.throw({
        code: 100301,
        message: 'Authorization无效',
      });
    }
    // 后续操作
    await next();
  };
};
