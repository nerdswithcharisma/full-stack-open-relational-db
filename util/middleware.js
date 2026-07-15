// centralized error handler
const errorHandler = (error, request, response, next) => {
  console.error(error.message);

  return response.status(400).json({ error });
};

module.exports = {
  errorHandler,
};
