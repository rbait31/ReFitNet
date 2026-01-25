'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

interface TableData {
  [key: string]: any
}

interface Pagination {
  page: number
  totalPages: number
  totalItems: number
  itemsPerPage: number
}

function TableViewContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const dbType = searchParams.get('db') || 'local'
  const tableName = searchParams.get('table') || ''

  const [data, setData] = useState<TableData[]>([])
  const [pagination, setPagination] = useState<Pagination | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [formData, setFormData] = useState<TableData>({})

  const fetchData = async (page: number = 1) => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch(`/api/db/table?db=${dbType}&table=${tableName}&page=${page}`)
      const result = await response.json()
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to fetch data')
      }
      
      setData(result.data)
      setPagination(result.pagination)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (tableName) {
      fetchData()
    }
  }, [tableName, dbType])

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this record?')) return

    try {
      const response = await fetch(`/api/db/table?db=${dbType}&table=${tableName}&id=${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        const result = await response.json()
        throw new Error(result.error || 'Failed to delete')
      }

      fetchData(pagination?.page || 1)
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to delete')
    }
  }

  const handleCreate = async () => {
    try {
      const response = await fetch(`/api/db/table?db=${dbType}&table=${tableName}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const result = await response.json()
        throw new Error(result.error || 'Failed to create')
      }

      setShowCreateForm(false)
      setFormData({})
      fetchData(1)
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to create')
    }
  }

  const handleUpdate = async (id: string) => {
    try {
      const response = await fetch(`/api/db/table?db=${dbType}&table=${tableName}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, ...formData }),
      })

      if (!response.ok) {
        const result = await response.json()
        throw new Error(result.error || 'Failed to update')
      }

      setEditingId(null)
      setFormData({})
      fetchData(pagination?.page || 1)
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to update')
    }
  }

  const startEdit = (item: TableData) => {
    setEditingId(item.id)
    setFormData({ ...item })
  }

  const cancelEdit = () => {
    setEditingId(null)
    setFormData({})
  }

  if (!tableName) {
    router.push('/view-db/tables')
    return null
  }

  const columns = data.length > 0 ? Object.keys(data[0]) : []

  return (
    <div style={{ 
      padding: '2rem', 
      maxWidth: '1400px', 
      margin: '0 auto',
      fontFamily: 'system-ui, sans-serif'
    }}>
      <div style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <Link 
          href={`/view-db/tables?db=${dbType}`}
          style={{ 
            padding: '0.5rem 1rem',
            background: '#f0f0f0',
            borderRadius: '6px',
            textDecoration: 'none',
            color: '#333'
          }}
        >
          ← Back to Tables
        </Link>
        <h1 style={{ fontSize: '2rem', margin: 0, textTransform: 'capitalize' }}>
          {tableName}
        </h1>
        <span style={{ 
          padding: '0.25rem 0.75rem',
          background: dbType === 'production' ? '#ff6b6b' : '#51cf66',
          color: 'white',
          borderRadius: '4px',
          fontSize: '0.875rem',
          fontWeight: '500'
        }}>
          {dbType === 'production' ? 'Production' : 'Local'}
        </span>
      </div>

      <div style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <button
          onClick={() => setShowCreateForm(!showCreateForm)}
          style={{
            padding: '0.75rem 1.5rem',
            background: '#51cf66',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '1rem',
            fontWeight: '500'
          }}
        >
          {showCreateForm ? 'Cancel' : '+ Create New'}
        </button>
        {pagination && (
          <div style={{ fontSize: '0.875rem', color: '#666' }}>
            Showing {((pagination.page - 1) * pagination.itemsPerPage) + 1} - {Math.min(pagination.page * pagination.itemsPerPage, pagination.totalItems)} of {pagination.totalItems}
          </div>
        )}
      </div>

      {showCreateForm && (
        <div style={{ 
          padding: '1.5rem', 
          background: '#f9f9f9', 
          borderRadius: '8px',
          marginBottom: '1rem',
          border: '1px solid #e0e0e0'
        }}>
          <h3 style={{ marginTop: 0, marginBottom: '1rem' }}>Create New Record</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
            {columns.filter(col => col !== 'id' && col !== 'createdAt' && col !== 'updatedAt').map((col) => (
              <div key={col}>
                <label style={{ display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem', fontWeight: '500' }}>
                  {col}
                </label>
                <input
                  type="text"
                  value={formData[col] || ''}
                  onChange={(e) => setFormData({ ...formData, [col]: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '0.5rem',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    fontSize: '0.875rem'
                  }}
                  placeholder={col}
                />
              </div>
            ))}
          </div>
          <button
            onClick={handleCreate}
            style={{
              padding: '0.5rem 1rem',
              background: '#0070f3',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer'
            }}
          >
            Create
          </button>
        </div>
      )}

      {error && (
        <div style={{ 
          padding: '1rem', 
          background: '#ffe0e0', 
          color: '#c00',
          borderRadius: '6px',
          marginBottom: '1rem'
        }}>
          Error: {error}
        </div>
      )}

      {loading ? (
        <div style={{ textAlign: 'center', padding: '2rem' }}>Loading...</div>
      ) : data.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '2rem', color: '#666' }}>
          No data found
        </div>
      ) : (
        <>
          <div style={{ 
            overflowX: 'auto',
            background: '#fff',
            borderRadius: '8px',
            border: '1px solid #e0e0e0',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#f5f5f5' }}>
                  {columns.map((col) => (
                    <th
                      key={col}
                      style={{
                        padding: '0.75rem',
                        textAlign: 'left',
                        borderBottom: '2px solid #ddd',
                        fontWeight: '600',
                        fontSize: '0.875rem',
                        textTransform: 'capitalize'
                      }}
                    >
                      {col}
                    </th>
                  ))}
                  <th style={{
                    padding: '0.75rem',
                    textAlign: 'right',
                    borderBottom: '2px solid #ddd',
                    fontWeight: '600',
                    fontSize: '0.875rem'
                  }}>
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {data.map((row, idx) => (
                  <tr key={row.id || idx} style={{ borderBottom: '1px solid #eee' }}>
                    {columns.map((col) => (
                      <td
                        key={col}
                        style={{
                          padding: '0.75rem',
                          fontSize: '0.875rem',
                          maxWidth: '200px',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap'
                        }}
                        title={String(row[col])}
                      >
                        {editingId === row.id && col !== 'id' && col !== 'createdAt' && col !== 'updatedAt' ? (
                          <input
                            type="text"
                            value={formData[col] || ''}
                            onChange={(e) => setFormData({ ...formData, [col]: e.target.value })}
                            style={{
                              width: '100%',
                              padding: '0.25rem',
                              border: '1px solid #0070f3',
                              borderRadius: '4px',
                              fontSize: '0.875rem'
                            }}
                          />
                        ) : (
                          String(row[col] || '')
                        )}
                      </td>
                    ))}
                    <td style={{ padding: '0.75rem', textAlign: 'right' }}>
                      {editingId === row.id ? (
                        <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                          <button
                            onClick={() => handleUpdate(row.id)}
                            style={{
                              padding: '0.25rem 0.75rem',
                              background: '#0070f3',
                              color: 'white',
                              border: 'none',
                              borderRadius: '4px',
                              cursor: 'pointer',
                              fontSize: '0.75rem'
                            }}
                          >
                            Save
                          </button>
                          <button
                            onClick={cancelEdit}
                            style={{
                              padding: '0.25rem 0.75rem',
                              background: '#666',
                              color: 'white',
                              border: 'none',
                              borderRadius: '4px',
                              cursor: 'pointer',
                              fontSize: '0.75rem'
                            }}
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                          <button
                            onClick={() => startEdit(row)}
                            style={{
                              padding: '0.25rem 0.75rem',
                              background: '#ffa500',
                              color: 'white',
                              border: 'none',
                              borderRadius: '4px',
                              cursor: 'pointer',
                              fontSize: '0.75rem'
                            }}
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(row.id)}
                            style={{
                              padding: '0.25rem 0.75rem',
                              background: '#ff4444',
                              color: 'white',
                              border: 'none',
                              borderRadius: '4px',
                              cursor: 'pointer',
                              fontSize: '0.75rem'
                            }}
                          >
                            Delete
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {pagination && pagination.totalPages > 1 && (
            <div style={{ 
              display: 'flex', 
              justifyContent: 'center', 
              gap: '0.5rem',
              marginTop: '1.5rem'
            }}>
              <button
                onClick={() => fetchData(pagination.page - 1)}
                disabled={pagination.page === 1}
                style={{
                  padding: '0.5rem 1rem',
                  background: pagination.page === 1 ? '#ccc' : '#0070f3',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: pagination.page === 1 ? 'not-allowed' : 'pointer'
                }}
              >
                Previous
              </button>
              <span style={{ 
                padding: '0.5rem 1rem',
                display: 'flex',
                alignItems: 'center'
              }}>
                Page {pagination.page} of {pagination.totalPages}
              </span>
              <button
                onClick={() => fetchData(pagination.page + 1)}
                disabled={pagination.page === pagination.totalPages}
                style={{
                  padding: '0.5rem 1rem',
                  background: pagination.page === pagination.totalPages ? '#ccc' : '#0070f3',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: pagination.page === pagination.totalPages ? 'not-allowed' : 'pointer'
                }}
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default function TableViewPage() {
  return (
    <Suspense fallback={<div style={{ padding: '2rem', textAlign: 'center' }}>Loading...</div>}>
      <TableViewContent />
    </Suspense>
  )
}

