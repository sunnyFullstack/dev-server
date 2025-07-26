const sendResponse = (
  res,
  { status = 200, success = true, msg = "", data = null, error = null }
) => {
  return res.status(status).json({
    success,
    message: msg,
    ...(data !== null && { data }),
    ...(error !== null && { error }),
  });
};

module.exports = { sendResponse };
