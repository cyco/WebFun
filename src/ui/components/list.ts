import "./list.scss";

import AbstractList from "./abstract-list";
import Cell from "./cell";

export declare interface SearchDelegate<T, PreparedSearchValue> {
	prepareListSearch(searchValue: string, list: List<T>): PreparedSearchValue;

	includeListItem(searchValue: PreparedSearchValue, item: T, cell: Cell<T>, list: List<T>): boolean;
}

class List<T> extends AbstractList<T> {
	public static readonly tagName = "wf-list";
}

export default List;
