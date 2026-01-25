'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function ViewDbPage() {
  const [dbType, setDbType] = useState<'local' | 'production'>('local')
  const router = useRouter()

  const handleSelectDb = () => {
    router.push(`/view-db/tables?db=${dbType}`)
  }

  return (
    <div style={{ 
      padding: '2rem', 
      maxWidth: '600px', 
      margin: '0 auto',
      fontFamily: 'system-ui, sans-serif'
    }}>
      <h1 style={{ marginBottom: '2rem', fontSize: '2rem' }}>Database Viewer</h1>
      
      <div style={{ 
        background: '#f5f5f5', 
        padding: '2rem', 
        borderRadius: '8px',
        marginBottom: '2rem'
      }}>
        <h2 style={{ marginBottom: '1rem', fontSize: '1.25rem' }}>Select Database</h2>
        
        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
            <input
              type="radio"
              name="dbType"
              value="local"
              checked={dbType === 'local'}
              onChange={(e) => setDbType(e.target.value as 'local' | 'production')}
              style={{ marginRight: '0.5rem' }}
            />
            Local Database
          </label>
          
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
            <input
              type="radio"
              name="dbType"
              value="production"
              checked={dbType === 'production'}
              onChange={(e) => setDbType(e.target.value as 'local' | 'production')}
              style={{ marginRight: '0.5rem' }}
            />
            Production Database
          </label>
        </div>

        <button
          onClick={handleSelectDb}
          style={{
            padding: '0.75rem 1.5rem',
            background: '#0070f3',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '1rem',
            fontWeight: '500'
          }}
        >
          Continue
        </button>
      </div>

      <div style={{ fontSize: '0.875rem', color: '#666' }}>
        <p><strong>Local:</strong> Uses DATABASE_URL from .env</p>
        <p><strong>Production:</strong> Uses DATABASE_URL_PRODUCTION or DATABASE_URL</p>
      </div>
    </div>
  )
}

