const ctrWrapper = (ctrl) => {
  const func = async (rec, res, next) => {
    try {
      await ctrl(req, res, next);
    } catch (error) {
      next(error);
    }
  };
  return func;
};
export default ctrWrapper;
