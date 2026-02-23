import './DataTable.css'

interface Column<T> {
  key: keyof T | 'actions'
  header: string
  render?: (item: T) => React.ReactNode
  width?: string
}

interface DataTableProps<T> {
  columns: Column<T>[]
  data: T[]
  loading?: boolean
  emptyMessage?: string
  onRowClick?: (item: T) => void
}

function DataTable<T extends { id: string }>({
  columns,
  data,
  loading = false,
  emptyMessage = 'No data found',
  onRowClick,
}: DataTableProps<T>) {
  if (loading) {
    return (
      <div className="data-table-loading">
        <div className="data-table-spinner" />
        <p>Loading...</p>
      </div>
    )
  }

  if (data.length === 0) {
    return (
      <div className="data-table-empty">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" />
          <polyline points="13 2 13 9 20 9" />
        </svg>
        <p>{emptyMessage}</p>
      </div>
    )
  }

  return (
    <div className="data-table-container">
      <table className="data-table">
        <thead>
          <tr>
            {columns.map((column) => (
              <th
                key={String(column.key)}
                style={column.width ? { width: column.width } : undefined}
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr
              key={item.id}
              onClick={() => onRowClick?.(item)}
              className={onRowClick ? 'clickable' : ''}
            >
              {columns.map((column) => (
                <td key={String(column.key)}>
                  {column.render
                    ? column.render(item)
                    : column.key !== 'actions'
                    ? String(item[column.key as keyof T] ?? '-')
                    : null}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default DataTable
