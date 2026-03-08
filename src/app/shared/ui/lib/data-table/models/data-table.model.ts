export interface ITableColumn<T = any> {
  key: string;
  label: string;
  sortable?: boolean;
  formatter?: (value: any, row: T) => string;
  minWidth?: string
}
