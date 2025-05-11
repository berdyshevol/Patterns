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

type GridOptions<TData, TContext> = {
  rowsData: RowsData<TData>;
  colDefs: ColDefs<TData, TContext>[];
  context: TContext;
  leftPadding?: number;
  sort?: Sort;
};

type RowRendererParams<TData, TContext> = {
  rowData: RowData<TData>;
} & GridOptions<TData, TContext>;

type ValueGetterParams<TData = any, TContext = any> = {
  colDef: ColumnDef<TData, TContext>;
} & RowRendererParams<TData, TContext>;

type DefaultValueGetterParams<TData, TContext> = ValueGetterParams<
  TData,
  TContext
>;

type CellRendererParams<TData, TContext> = {
  value: TData[keyof TData];
  colDef: ColumnDef<TData, TContext>;
} & RowRendererParams<TData, TContext>;

type ValueFormatterParams<TData, TContext> = CellRendererParams<
  TData,
  TContext
>;

type DefaultValueFormatterParams<TData, TContext> = ValueFormatterParams<
  TData,
  TContext
>;

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
declare function rowRenderer<TData, TContext>(
  params: RowRendererParams<TData, TContext>
): string;
declare function sortRowsData<TData>(
  rowsData: RowsData<TData>,
  sort: Sort
): RowsData<TData>;
declare function addPaddings(str: string, padding: number): string;
declare function gridRenderer<TData, TContext>(
  params: GridOptions<TData, TContext>
): string;
declare function tableRenderer<TData = any, TContext = any>(
  params: GridOptions<TData, TContext>
): string;
