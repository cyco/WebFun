import Symbol from "./symbol";

export type ASTValue = string | number | boolean | String | Symbol | AST;

interface AST extends Array<ASTValue> {}

export default ASTValue;
export const s = (name: TemplateStringsArray, ...keys: any[]) => new Symbol(String.raw(name, ...keys));
