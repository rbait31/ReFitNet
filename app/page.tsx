import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/auth'
import { redirect } from 'next/navigation'

async function getNotes(userId: string) {
  try {
    // Получаем только заметки текущего пользователя
    const notes = await prisma.note.findMany({
      where: {
        ownerId: userId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })
    return { notes, error: null }
  } catch (error) {
    console.error('Error fetching notes:', error)
    return { notes: [], error: error instanceof Error ? error.message : 'Unknown error' }
  }
}

export default async function Home() {
  // Проверяем авторизацию
  // Middleware уже защищает эту страницу, но проверяем для безопасности
  const session = await getServerSession(authOptions)
  
  // Если не авторизован - middleware уже редиректнул на /login
  // Но на всякий случай проверяем еще раз
  if (!session || !session.user?.id) {
    redirect('/login')
  }

  // Получаем заметки только текущего пользователя
  const { notes, error } = await getNotes(session.user.id)

  return (
    <main style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem' }}>ReFitNet</h1>
        {session.user?.image && (
          <img
            src={session.user.image}
            alt={session.user.name || 'User'}
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
            }}
          />
        )}
      </div>
      
      <div style={{ marginBottom: '1rem', color: '#666' }}>
        <p>Добро пожаловать, <strong>{session.user?.name || session.user?.email}</strong>!</p>
        <p style={{ marginTop: '0.5rem' }}>
          Ваших заметок: <strong>{notes.length}</strong>
        </p>
      </div>

      {error ? (
        <div style={{ 
          padding: '2rem', 
          background: '#fff3cd', 
          border: '1px solid #ffc107',
          borderRadius: '8px',
          color: '#856404'
        }}>
          <p style={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>Database Connection Error</p>
          <p style={{ marginBottom: '1rem' }}>{error}</p>
          <div style={{ fontSize: '0.875rem', marginTop: '1rem' }}>
            <p>To fix this:</p>
            <ol style={{ marginLeft: '1.5rem', marginTop: '0.5rem' }}>
              <li>Create a <code>.env</code> file in the project root</li>
              <li>Add your NeonDB connection string: <code>DATABASE_URL="postgresql://..."</code></li>
              <li>Run <code>npm run db:push</code> to create the database schema</li>
              <li>Run <code>npm run db:seed</code> to add sample data</li>
            </ol>
          </div>
        </div>
      ) : notes.length === 0 ? (
        <div style={{ 
          padding: '2rem', 
          background: '#f5f5f5', 
          borderRadius: '8px',
          textAlign: 'center',
          color: '#666'
        }}>
          <p>No notes found. Run the seed script to add sample data:</p>
          <code style={{ 
            display: 'block', 
            marginTop: '1rem', 
            padding: '0.5rem',
            background: '#fff',
            borderRadius: '4px'
          }}>
            npm run db:seed
          </code>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {notes.map((note) => (
            <div
              key={note.id}
              style={{
                padding: '1.5rem',
                background: '#fff',
                border: '1px solid #e0e0e0',
                borderRadius: '8px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
              }}
            >
              <h2 style={{ marginBottom: '0.5rem', fontSize: '1.25rem' }}>
                {note.title}
              </h2>
              <p style={{ fontSize: '0.875rem', color: '#666' }}>
                Created: {new Date(note.createdAt).toLocaleString()}
              </p>
              <p style={{ fontSize: '0.75rem', color: '#999', marginTop: '0.5rem' }}>
                ID: {note.id}
              </p>
            </div>
          ))}
        </div>
      )}
    </main>
  )
}

