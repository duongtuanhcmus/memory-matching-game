export const shuffleCards = (images, numPairs = 8) => {
  const available = [...images];
  while (available.length < numPairs) {
    available.push(...images);
  }

  const selected = available.slice(0, numPairs);
  const doubled = [...selected, ...selected];

  return doubled
    .map((card) => ({ ...card, id: Math.random() }))
    .sort(() => 0.5 - Math.random());
};
