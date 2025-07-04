export const shuffleCards = (images) => {
  const doubled = [...images, ...images];
  return doubled
    .map((card) => ({ ...card, id: Math.random() }))
    .sort(() => 0.5 - Math.random());
};
