/* eslint-disable @typescript-eslint/no-explicit-any */
import { Column } from '@tanstack/react-table'
import React, { useEffect, useRef, useState } from 'react'

interface CustomNonDateAutoCompleteProps {
  column: Column<any, unknown>
  options: string[]
}

export const CustomNonDateAutoComplete = ({
  column,
  options,
}: CustomNonDateAutoCompleteProps) => {
  const initialValues = (column.getFilterValue() as string[]) || []
  const [checked, setChecked] = useState<string[]>(initialValues)
  const [inputValue, setInputValue] = useState('')
  const [filteredOptions, setFilteredOptions] = useState<string[]>([])
  const [showDropdown, setShowDropdown] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const filtered = options.filter((opt) =>
      opt.toLowerCase().includes(inputValue.toLowerCase())
    )

    if (
      inputValue.trim() !== '' &&
      !options.map((o) => o.toLowerCase()).includes(inputValue.toLowerCase())
    ) {
      filtered.push(`Press enter to add "${inputValue}"`)
    }

    setFilteredOptions(filtered)
  }, [inputValue, options])

  useEffect(() => {
    column.setFilterValue(checked.length > 0 ? checked : null)
  }, [checked, column])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value)
    setShowDropdown(true)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      if (
        inputValue.trim() !== '' &&
        !checked.map((c) => c.toLowerCase()).includes(inputValue.toLowerCase())
      ) {
        setChecked((prev) => [...prev, inputValue.trim()])
        setInputValue('')
        setShowDropdown(false)
      }
    } else if (e.key === 'Backspace' && inputValue === '') {
      if (checked.length > 0) {
        setChecked((prev) => prev.slice(0, prev.length - 1))
      }
    }
  }

  const handleOptionClick = (option: string) => {
    if (option.startsWith('Press enter to add')) {
      const newVal = option.match(/"([^"]+)"/)
      if (newVal && newVal[1]) {
        const val = newVal[1]
        if (
          val.trim() !== '' &&
          !checked.map((c) => c.toLowerCase()).includes(val.toLowerCase())
        ) {
          setChecked((prev) => [...prev, val])
        }
      }
    } else {
      if (
        !checked.map((c) => c.toLowerCase()).includes(option.toLowerCase()) &&
        option.trim() !== ''
      ) {
        setChecked((prev) => [...prev, option])
      }
    }
    setInputValue('')
    setShowDropdown(false)
  }

  const removeTag = (index: number) => {
    setChecked((prev) => prev.filter((_, i) => i !== index))
  }

  const handleBlur = () => {
    setTimeout(() => {
      if (document.activeElement !== inputRef.current) {
        setShowDropdown(false)
      }
    }, 150)
  }

  return (
    <div
      style={{ position: 'relative', width: '200px', fontFamily: 'sans-serif' }}
    >
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '4px',
          marginBottom: '4px',
          alignItems: 'center',
          border: '1px solid #ccc',
          padding: '4px',
          borderRadius: '4px',
          minHeight: '36px',
        }}
        onClick={() => inputRef.current?.focus()}
      >
        {checked.map((tag, index) => (
          <span
            key={index}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              background: '#e0e0e0',
              borderRadius: '16px',
              padding: '0 8px',
              fontSize: '0.875rem',
              maxWidth: '60px',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {tag}
            <button
              type='button'
              style={{
                marginLeft: '4px',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                fontSize: '1rem',
                lineHeight: '1rem',
                padding: 0,
              }}
              onClick={(e) => {
                e.stopPropagation()
                removeTag(index)
              }}
            >
              ×
            </button>
          </span>
        ))}
        <input
          ref={inputRef}
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => setShowDropdown(true)}
          onBlur={handleBlur}
          placeholder='Search...'
          style={{
            border: 'none',
            outline: 'none',
            flex: 1,
            minWidth: '60px',
            padding: '4px',
            fontSize: '0.875rem',
          }}
        />
      </div>

      {showDropdown && (
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
          {filteredOptions.length > 0 ? (
            filteredOptions.map((option, idx) => (
              <li
                key={idx}
                onMouseDown={(e) => {
                  e.preventDefault()
                  handleOptionClick(option)
                }}
                style={{
                  padding: '4px 8px',
                  cursor: option.startsWith('Press enter to add')
                    ? 'default'
                    : 'pointer',
                  color: option.startsWith('Press enter to add')
                    ? 'gray'
                    : 'inherit',
                }}
              >
                {option}
              </li>
            ))
          ) : (
            <li
              style={{
                padding: '4px 8px',
                color: '#888',
                fontStyle: 'italic',
              }}
            >
              No options found
            </li>
          )}
        </ul>
      )}
    </div>
  )
}
