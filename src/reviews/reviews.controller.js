const service = require("./reviews.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const methodNotAllowed = require("../errors/methodNotAllowed");

async function reviewExists(request, response, next) {
  const { reviewId } = request.params;
  console.log(reviewId);
  service
    .read(reviewId)
    .then((review) => {
      console.log(review);
      if (review) {
        response.locals.review = review;
        return next();
      }
      next({ status: 404, message: `Review cannot be found.`});
    })
    .catch(next);
}

async function destroy(request, response, next) {
  const { review_id } = response.locals.review;
  service
    .destroy(review_id)
    .then(() => response.sendStatus(204))
    .catch(next);
}

async function list(request, response, next) {
  service
    .list(request.params.movieId)
    .then((reviewsWithCritics) => response.json({ data: reviewsWithCritics }))
    .catch(next);
}

function hasMovieIdInPath(request, response, next) {
  if (request.params.movieId) {
    return next();
  }
  methodNotAllowed(request, response, next);
}

function noMovieIdInPath(request, response, next) {
  if (request.params.movieId) {
    return methodNotAllowed(request, response, next);
  }
  next();
}

async function update(request, response, next) {
  const updatedReview = {
    ...response.locals.review,
    ...request.body.data,
    review_id: response.locals.review.review_id,
  };

  service
    .update(updatedReview)
    .then((data) => response.json({ data }))
    .catch(next);
}

module.exports = {
  destroy: [
    noMovieIdInPath,
    asyncErrorBoundary(reviewExists),
    asyncErrorBoundary(destroy),
  ],
  list: [hasMovieIdInPath, asyncErrorBoundary(list)],
  update: [
    noMovieIdInPath,
    asyncErrorBoundary(reviewExists),
    asyncErrorBoundary(update),
  ],
};
