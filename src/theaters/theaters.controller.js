const service = require("./theaters.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

async function list(request, response, next) {
  const { movieId } = request.params;

  const serviceMethod = movieId ? service.listForMovie(movieId) : service.list();

  serviceMethod
    .then((data) => response.json({ data }))
    .catch(next);
}

module.exports = {
  list: asyncErrorBoundary(list),
};
