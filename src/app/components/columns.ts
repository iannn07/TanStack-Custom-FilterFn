import { createColumnHelper } from '@tanstack/react-table'
import { DataRow } from './data'

const columnHelper = createColumnHelper<DataRow>()

export const columns = [
  columnHelper.accessor('id', {
    cell: (info) => info.getValue(),
    id: 'ID',
    header: 'ID',
    enableSorting: true,
    enableColumnFilter: true,
    filterFn: 'equalsString',
  }),
  columnHelper.accessor('name', {
    cell: (info) => info.getValue(),
    id: 'Name',
    header: 'Name',
    enableSorting: true,
    enableColumnFilter: true,
    filterFn: 'arrayIncludesSomeSubstrings',
  }),
  columnHelper.accessor('age', {
    cell: (info) => info.getValue(),
    id: 'Age',
    header: 'Age',
    enableSorting: true,
    enableColumnFilter: true,
    filterFn: 'equalsString',
  }),
  columnHelper.accessor('date', {
    cell: (info) => info.getValue(),
    id: 'Date',
    header: 'Date',
    enableSorting: true,
    enableColumnFilter: true,
    filterFn: 'dateFilterRangeFn',
  }),
]
