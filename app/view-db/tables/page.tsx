'use client'

import { Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

const TABLE_NAMES = [
  { name: 'users', label: 'Users' },
  { name: 'notes', label: 'Notes' },
  { name: 'categories', label: 'Categories' },
  { name: 'prompts', label: 'Prompts' },
  { name: 'tags', label: 'Tags' },
  { name: 'votes', label: 'Votes' },
]

function TablesContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const dbType = searchParams.get('db') || 'local'

  if (dbType !== 'local' && dbType !== 'production') {
    router.push('/view-db')
    return null
  }

  return (
    <div style={{ 
      padding: '2rem', 
      maxWidth: '800px', 
      margin: '0 auto',
      fontFamily: 'system-ui, sans-serif'
    }}>
      <div style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <Link 
          href="/view-db"
          style={{ 
            padding: '0.5rem 1rem',
            background: '#f0f0f0',
            borderRadius: '6px',
            textDecoration: 'none',
            color: '#333'
          }}
        >
          ← Back
        </Link>
        <h1 style={{ fontSize: '2rem', margin: 0 }}>Database Tables</h1>
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

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
        gap: '1rem'
      }}>
        {TABLE_NAMES.map((table) => (
          <Link
            key={table.name}
            href={`/view-db/table?db=${dbType}&table=${table.name}`}
            style={{
              display: 'block',
              padding: '1.5rem',
              background: '#fff',
              border: '1px solid #e0e0e0',
              borderRadius: '8px',
              textDecoration: 'none',
              color: '#333',
              transition: 'all 0.2s',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)'
              e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.15)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)'
              e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)'
            }}
          >
            <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.125rem' }}>{table.label}</h3>
            <p style={{ margin: 0, fontSize: '0.875rem', color: '#666' }}>{table.name}</p>
            <div style={{ 
              marginTop: '1rem',
              padding: '0.5rem',
              background: '#0070f3',
              color: 'white',
              borderRadius: '4px',
              textAlign: 'center',
              fontSize: '0.875rem',
              fontWeight: '500'
            }}>
              Open →
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}

export default function TablesPage() {
  return (
    <Suspense fallback={<div style={{ padding: '2rem', textAlign: 'center' }}>Loading...</div>}>
      <TablesContent />
    </Suspense>
  )
}

