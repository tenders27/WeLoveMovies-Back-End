const service = require("./movies.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const moviesService = require("./movies.service");

async function movieExists(request, response, next) {
  // TODO: Add your code here.
  moviesService
    .read(request.params.movieId)
    .then((result) => {
      const movie = result[0]
      if (movie) {
        response.locals.movie = movie;
        return next();
      }
      next({ status: 404, message: `Movie cannot be found.`});
    })
    .catch(next);
}

async function read(request, response, next) {
  // TODO: Add your code here
  moviesService
    .read(response.locals.movie.movie_id)
    .then((data) => response.json({ data: data[0] }))
    .catch(next);
}

async function list(request, response, next) {
  // TODO: Add your code here.
  const { is_showing } = request.query;
  const isShowing = is_showing === 'true';

  moviesService
    .list(isShowing)
    .then((data) => response.json({ data }))
    .catch(next);
}

module.exports = {
  list: [asyncErrorBoundary(list)],
  read: [asyncErrorBoundary(movieExists), read],
  movieExists,
};
