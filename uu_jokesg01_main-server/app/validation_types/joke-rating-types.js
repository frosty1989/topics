const addJokeRatingDtoInType = shape({
  id: mongoId().isRequired(),
  rating: integer(5).isRequired()
});
