'use client'

import {
  FilterFn,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  Row,
  useReactTable,
} from '@tanstack/react-table'
import { useState } from 'react'
import { columns } from './components/columns'
import CustomDateAutoComplete from './components/CustomDateAutoComplete'
import { CustomNonDateAutoComplete } from './components/CustomNonDateAutoComplete'
import { data, DataRow } from './components/data'
import dateNormalizer from './utils/DateNormalizer'
import { dateParser } from './utils/DateParser'

/**
 * * Handle Custom FilterFn
 */
declare module '@tanstack/react-table' {
  interface FilterFns {
    arrayIncludesSomeSubstrings: FilterFn<DataRow>
    dateFilterRangeFn: FilterFn<DataRow>
  }
}

type DateRange = Record<string, { start: Date | null; end: Date | null }>

export default function CustomFilterFn() {
  /**
   * * State
   */
  const [selectedDateRange, setSelectedDateRange] = useState<DateRange>({})

  /**
   * * Custom FilterFn
   * ! You can move these two functions to a separate file
   */
  const arrIncludesSomeSubstrings: FilterFn<DataRow> = (
    row,
    columnId,
    filterValue
  ) => {
    if (!filterValue) return true

    const rowValue = row.getValue(columnId)
    const rowValueStr = Array.isArray(rowValue)
      ? rowValue.join(' ').toLowerCase()
      : String(rowValue).toLowerCase()

    if (Array.isArray(filterValue)) {
      return filterValue.some((filterItem) =>
        rowValueStr.includes(filterItem.toLowerCase())
      )
    } else if (typeof filterValue === 'string') {
      return rowValueStr.includes(filterValue.toLowerCase())
    }

    return true
  }

  const filterDateRange = (row: Row<DataRow>, columnId: string) => {
    const date = dateParser(row.getValue(columnId))

    if (!date) return false

    const normalizedDate = dateNormalizer(date)

    const isInAnyRange = Object.values(selectedDateRange).some(
      ({ start, end }) => {
        if (!start || !end) return false

        const normalizedStart = dateNormalizer(start)
        const normalizedEnd = dateNormalizer(end)

        if (!normalizedDate) return false

        if (!normalizedStart || !normalizedEnd) return false

        return (
          normalizedDate >= normalizedStart && normalizedDate <= normalizedEnd
        )
      }
    )

    return isInAnyRange
  }

  const filterDateFixed: FilterFn<DataRow> = (row, columnId, filterValue) => {
    if (!filterValue) return true

    const dateStr = row.getValue(columnId) as string | null | undefined
    if (!dateStr) return false

    const rowDate = dateParser(dateStr)
    if (!rowDate) return false

    const loweredFilterValue = filterValue.toLowerCase()

    const getDateRange = (period: string): [Date, Date] | null => {
      const now = new Date()
      now.setHours(0, 0, 0, 0)
      let start: Date
      let end: Date

      switch (period) {
        case 'today':
          start = new Date(now)
          end = new Date(now)
          end.setHours(23, 59, 59, 999)
          break

        case 'yesterday':
          start = new Date(now)
          start.setDate(start.getDate() - 1)
          end = new Date(start)
          end.setHours(23, 59, 59, 999)
          break

        case 'this week':
          start = new Date(now)
          const dayOfWeek = start.getDay()
          start.setDate(start.getDate() - dayOfWeek)
          end = new Date(start)
          end.setDate(end.getDate() + 6)
          end.setHours(23, 59, 59, 999)
          break

        case 'last week':
          start = new Date(now)
          const lastWeekDay = start.getDay()
          start.setDate(start.getDate() - lastWeekDay - 7)
          end = new Date(start)
          end.setDate(end.getDate() + 6)
          end.setHours(23, 59, 59, 999)
          break

        case 'this month':
          start = new Date(now.getFullYear(), now.getMonth(), 1)
          end = new Date(now.getFullYear(), now.getMonth() + 1, 0)
          end.setHours(23, 59, 59, 999)
          break

        case 'last month':
          start = new Date(now.getFullYear(), now.getMonth() - 1, 1)
          end = new Date(now.getFullYear(), now.getMonth(), 0)
          end.setHours(23, 59, 59, 999)
          break

        case 'this year':
          start = new Date(now.getFullYear(), 0, 1)
          end = new Date(now.getFullYear(), 11, 31, 23, 59, 59, 999)
          break

        case 'last year':
          start = new Date(now.getFullYear() - 1, 0, 1)
          end = new Date(now.getFullYear() - 1, 11, 31, 23, 59, 59, 999)
          break

        default:
          return null
      }
      return [start, end]
    }

    const dateRange = getDateRange(loweredFilterValue)

    if (dateRange) {
      const [startDate, endDate] = dateRange
      return rowDate >= startDate && rowDate <= endDate
    }

    return true
  }

  const conditionalDateFilter: FilterFn<DataRow> = (
    row,
    columnId,
    filterValue
  ) => {
    if (!filterValue) return true

    const loweredFilterValue = filterValue.toLowerCase()

    if (loweredFilterValue === 'custom range') {
      return filterDateRange(row, columnId)
    } else {
      return filterDateFixed(row, columnId, filterValue, () => {})
    }
  }

  /**
   * * Table
   */
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    filterFns: {
      arrayIncludesSomeSubstrings: arrIncludesSomeSubstrings,
      dateFilterRangeFn: conditionalDateFilter,
    },
  })

  return (
    <table>
      <thead>
        {table.getHeaderGroups().map((headerGroup) => (
          <tr key={headerGroup.id}>
            {headerGroup.headers.map((header) => (
              <th key={header.id}>
                {header.column.getCanFilter() &&
                  (header.id === 'Date' ? (
                    <CustomDateAutoComplete
                      column={header.column}
                      setSelectedDateRange={setSelectedDateRange}
                    />
                  ) : header.id === 'Name' ? (
                    <CustomNonDateAutoComplete
                      column={header.column}
                      options={data.map((row) =>
                        String(row[header.id.toLowerCase() as keyof DataRow])
                      )}
                    />
                  ) : (
                    <input
                      type='text'
                      placeholder={`Search ${header.column.id}`}
                      value={(header.column.getFilterValue() as string) || ''}
                      onChange={(e) =>
                        header.column.setFilterValue(e.target.value)
                      }
                      className='mt-2 w-full rounded border border-gray-1 p-2 text-sm font-normal transition focus:border-primary focus:outline-none'
                    />
                  ))}
              </th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody>
        {table.getRowModel().rows.length === 0 ? (
          <tr>
            <td colSpan={columns.length} align='center'>
              No data available.
            </td>
          </tr>
        ) : (
          table.getRowModel().rows.map((row) => (
            <tr key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))
        )}
      </tbody>
    </table>
  )
}
