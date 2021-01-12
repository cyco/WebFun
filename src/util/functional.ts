type Predicate = (...args: any[]) => boolean;
export const not = (predicate: Predicate) => (...args: any[]) => !predicate(...args);
export const and = (...predicates: Predicate[]) => (...args: any[]) => predicates.every(t => t(...args));
export const or = (...predicates: Predicate[]) => (...args: any[]) => predicates.some(t => t(...args));
export const equal = (v1: any, v2: any): boolean => v1 === v2;
export const lessThan = (v1: any, v2: any): boolean => v1 < v2;
export const greaterThan = (v1: any, v2: any): boolean => v1 > v2;
