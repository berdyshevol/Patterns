type RowData<TData> = Record<string, TData>;
type RowsData<TData> = RowData<TData>[];
type ColumnType = "string" | "number" | "date";
type Sort = "asc" | "desc";

type ColumnDef<TData = any, TContext = any> = {
  colId: string | number;
  valueGetter: (
    params: ValueGetterParams<TData, TContext>
  ) => TData[keyof TData];
  type?: ColumnType;
  width?: number;
  aline?: "left" | "right";
};
type ColDefs<TData = any, TContext = any> = ColumnDef<TData, TContext>[];

type DefaultValueGetterParams<TData, TContext> = {
  value: TData[keyof TData];
  colDef: ColumnDef<TData, TContext>;
};
type ValueGetterParams<TData = any, TContext = any> = {
  rowData: RowData<TData>;
  colDef: ColDefs<TData, TContext>;
  context: TContext;
  rowsData: RowsData<TData>;
};
type DefaultValueFormatterParams<TData, TContext> = {
  value: string | number;
  colDef: ColDefs<TData, TContext>;
};
type ValueFormatterParams<TData, TContext> = {
  value: TData[keyof TData];
  rowData: RowData<TData>;
  colDef: ColDefs<TData, TContext>;
  context: TContext;
  rowsData: RowsData<TData>;
};
type CellRendererParams<TData, TContext> = {
  value: TData[keyof TData];
  rowData: RowData<TData>;
  colDef: ColDefs<TData, TContext>;
  context: TContext;
  rowsData: RowsData<TData>;
};
type RowRendererParams<TData, TContext> = {
  rowData: RowData<TData>;
  colDef: ColDefs<TData, TContext>;
  context: TContext;
  rowsData: RowsData<TData>;
};
type GridRendererParams<TData, TContext> = {
  rowsData: RowsData<TData>;
  colDefs: ColDefs<TData, TContext>[];
  context: TContext;
  leftPadding?: number;
};
type TableRendereParams<TData, TContext> = {
  rowsData: RowsData<TData>;
  colDefs: ColDefs<TData, TContext>[];
  context: TContext;
  leftPadding?: number;
  sort?: Sort;
};

declare function defaultValueGetter<TData, TContext>(
  params: DefaultValueGetterParams<TData, TContext>
): TData[keyof TData];
declare function valueGetter<TData, TContext>(
  params: ValueGetterParams<TData, TContext>
): TData[keyof TData];
declare function defaultValueFormatter<TData, TContext>(
  params: DefaultValueFormatterParams<TData, TContext>
): string;
declare function valueFormatter<TData = any, TContext = any>(
  params: ValueFormatterParams<TData, TContext>
): string;
declare function cellRenderer<TData = any, TContext = any>(
  params: CellRendererParams<TData, TContext>
): string;
declare function rowRenderer<TData = any, TContext = any>(
  params: RowRendererParams<TData, TContext>
): string;
declare function sortRowsData<TData>(
  rowsData: RowsData<TData>,
  sort: Sort
): RowsData<TData>;
declare function addPaddings(str: string, padding: number): string;
declare function gridRenderer(params: GridRendererParams): string;
declare function tableRenderer(params: TableRendereParams): string;
