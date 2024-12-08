/* eslint-disable @typescript-eslint/no-explicit-any */
import { Column } from '@tanstack/react-table'
import { useEffect, useRef, useState } from 'react'
import DateFilterModalForColumn from './DateFilterModalForColumn'

const CustomDateAutoComplete = ({
  column,
  setSelectedDateRange,
}: {
  column: Column<any, unknown>
  setSelectedDateRange: React.Dispatch<
    React.SetStateAction<
      Record<string, { start: Date | null; end: Date | null }>
    >
  >
}) => {
  const columnFilterValue = (column.getFilterValue() as string) || ''
  const [openModals, setOpenModals] = useState({ openDateFilterModal: false })
  const [inputValue, setInputValue] = useState(columnFilterValue)
  const [showDropdown, setShowDropdown] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const dateFilterOptions = [
    { label: 'Today', value: 'Today' },
    { label: 'Yesterday', value: 'Yesterday' },
    { label: 'This Week', value: 'This Week' },
    { label: 'Last Week', value: 'Last Week' },
    { label: 'This Month', value: 'This Month' },
    { label: 'Last Month', value: 'Last Month' },
    { label: 'This Year', value: 'This Year' },
    { label: 'Last Year', value: 'Last Year' },
    { label: 'Custom Range', value: 'Custom Range' },
  ]

  useEffect(() => {
    setInputValue(columnFilterValue)
  }, [columnFilterValue])

  const handleCloseDateFilterModal = () =>
    setOpenModals({ openDateFilterModal: false })

  const handleApplyDateRange = (
    startDate: Date | null,
    endDate: Date | null
  ) => {
    if (startDate && endDate) {
      setSelectedDateRange((prev) => ({
        ...prev,
        [column.id]: { start: startDate, end: endDate },
      }))
      column.setFilterValue('Custom Range')
    }

    handleCloseDateFilterModal()
  }

  const filteredOptions = dateFilterOptions.filter((opt) =>
    opt.label.toLowerCase().includes(inputValue.toLowerCase())
  )

  const handleOptionSelect = (optionValue: string) => {
    if (optionValue === 'Custom Range') {
      setOpenModals({ openDateFilterModal: true })
    } else {
      column.setFilterValue(optionValue)
    }
    setInputValue(optionValue)
    setShowDropdown(false)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    setInputValue(val)
    if (val === '') {
      column.setFilterValue(undefined)
    }
    setShowDropdown(true)
  }

  const handleBlur = () => {
    // Delay hiding dropdown to allow clicks on dropdown items
    setTimeout(() => {
      if (document.activeElement !== inputRef.current) {
        setShowDropdown(false)
      }
    }, 150)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      // Check if inputValue matches a known option
      const match = dateFilterOptions.find(
        (opt) =>
          opt.label.toLowerCase() === inputValue.toLowerCase() ||
          opt.value.toLowerCase() === inputValue.toLowerCase()
      )
      if (match) {
        handleOptionSelect(match.value)
      } else {
        // Free-form value
        if (inputValue.trim() === '') {
          column.setFilterValue(undefined)
        } else {
          column.setFilterValue(inputValue)
        }
        setShowDropdown(false)
      }
    }
  }

  return (
    <>
      <div
        style={{
          position: 'relative',
          width: '200px',
          fontFamily: 'sans-serif',
        }}
      >
        <input
          ref={inputRef}
          type='text'
          placeholder='Filter...'
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => setShowDropdown(true)}
          onBlur={handleBlur}
          style={{
            width: '100%',
            padding: '6px 8px',
            fontSize: '0.875rem',
            border: '1px solid #ccc',
            borderRadius: '4px',
            boxSizing: 'border-box',
          }}
        />
        {showDropdown && filteredOptions.length > 0 && (
          <ul
            style={{
              position: 'absolute',
              top: '100%',
              left: 0,
              right: 0,
              margin: 0,
              padding: '4px 0',
              listStyle: 'none',
              background: '#fff',
              border: '1px solid #ccc',
              borderRadius: '4px',
              maxHeight: '150px',
              overflowY: 'auto',
              zIndex: 999,
            }}
          >
            {filteredOptions.map((option, idx) => (
              <li
                key={idx}
                onMouseDown={(e) => {
                  e.preventDefault()
                  handleOptionSelect(option.value)
                }}
                style={{
                  padding: '4px 8px',
                  cursor: 'pointer',
                  fontSize: '0.875rem',
                }}
              >
                {option.label}
              </li>
            ))}
          </ul>
        )}
      </div>

      <DateFilterModalForColumn
        open={openModals.openDateFilterModal}
        close={handleCloseDateFilterModal}
        applyFilter={handleApplyDateRange}
      />
    </>
  )
}

export default CustomDateAutoComplete
