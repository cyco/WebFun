export const not = (predicate) => (...args) => !predicate(...args);
export const and = (...predicates) => (...args) => predicates.every(t => t(...args));
export const or = (...predicates) => (...args) => predicates.some(t => t(...args));
