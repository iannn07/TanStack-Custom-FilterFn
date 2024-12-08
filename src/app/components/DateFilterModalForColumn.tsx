import { useState } from 'react'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'

interface DateFilterModalForColumnProps {
  open: boolean
  close: () => void
  applyFilter: (startDate: Date | null, endDate: Date | null) => void
}

function DateFilterModalForColumn({
  open,
  close,
  applyFilter,
}: DateFilterModalForColumnProps) {
  /**
   * * State for Date Range
   */
  const [minDate, setMinDate] = useState<Date | null>(new Date())
  const [maxDate, setMaxDate] = useState<Date | null>(new Date())

  /**
   * * Handle reset of date range
   */
  const handleReset = () => {
    setMinDate(null)
    setMaxDate(null)
  }

  /**
   * * Handle apply filter of date range
   */
  const handleApply = () => {
    applyFilter(minDate, maxDate)
    close()
  }

  if (!open) {
    return null
  }

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        zIndex: 9999,
        width: '100vw',
        height: '100vh',
        background: 'rgba(0,0,0,0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div
        style={{
          background: '#fff',
          borderRadius: '8px',
          width: '50%',
          maxWidth: '90%',
          padding: '16px',
          boxSizing: 'border-box',
        }}
      >
        <header style={{ marginBottom: '16px' }}>
          <h3 style={{ margin: '0 0 4px' }}>Custom Range</h3>
          <p style={{ margin: 0, fontSize: '14px', color: '#555' }}>
            Input Min and Max date on each box to set a custom range
          </p>
        </header>

        <section
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            gap: '16px',
            marginBottom: '16px',
          }}
        >
          <div>
            <label
              style={{
                display: 'block',
                marginBottom: '8px',
                fontSize: '14px',
              }}
            >
              Start Date
            </label>
            <DatePicker
              selected={minDate}
              onChange={(date: Date | null) => setMinDate(date)}
              selectsStart
              startDate={minDate || undefined}
              endDate={maxDate || undefined}
              maxDate={maxDate || undefined}
              placeholderText='Select start date'
            />
          </div>

          <div>
            <label
              style={{
                display: 'block',
                marginBottom: '8px',
                fontSize: '14px',
              }}
            >
              End Date
            </label>
            <DatePicker
              selected={maxDate}
              onChange={(date: Date | null) => setMaxDate(date)}
              selectsEnd
              startDate={minDate || undefined}
              endDate={maxDate || undefined}
              minDate={minDate || undefined}
              placeholderText='Select end date'
            />
          </div>
        </section>

        <footer
          style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}
        >
          <button
            onClick={handleReset}
            style={{
              padding: '6px 12px',
              background: '#f0f0f0',
              border: '1px solid #ccc',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '0.875rem',
            }}
          >
            Reset
          </button>
          <button
            onClick={handleApply}
            style={{
              padding: '6px 12px',
              background: '#007bff',
              color: '#fff',
              border: '1px solid #007bff',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '0.875rem',
            }}
          >
            Apply Filter
          </button>
          <button
            onClick={close}
            style={{
              padding: '6px 12px',
              background: '#f0f0f0',
              border: '1px solid #ccc',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '0.875rem',
            }}
          >
            Close
          </button>
        </footer>
      </div>
    </div>
  )
}

export default DateFilterModalForColumn
