import React from 'react'
import { directors } from '../Team.js';

const Directors = () => {
  return (
    <div
  style={{
    display: 'flex',
    justifyContent: 'space-between',
    gap: '1rem',
    flexWrap: 'wrap',
  }}
>
  {directors.map((member, idx) => (
    <div
      key={idx}
      style={{
        flex: '1',
        minWidth: '220px',
        background: '#f9f9f9',
        padding: '1rem',
        borderRadius: '10px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
      }}
    >
      <img
        src={member.image}
        alt={`${member.name}'s profile`}
        style={{
          width: '80px',
          height: '80px',
          borderRadius: '50%',
          objectFit: 'cover',
          marginBottom: '0.75rem',
        }}
      />
      <h3 style={{ marginBottom: '0rem', color: '#333', fontSize: '1.2rem' }}>{member.name}</h3>
      <p style={{ fontWeight: '600', color: '#555', marginBottom: '0.3rem' }}>
        {member.title}
      </p>
      <p style={{ fontSize: '0.9rem', color: '#666' }}>{member.bio}</p>
    </div>
  ))}
</div>
  )
}

export default Directors