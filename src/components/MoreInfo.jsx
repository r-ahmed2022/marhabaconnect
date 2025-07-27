import React from 'react'

const MoreInfo = ({isOpen, onToggle}) => {
  return (
    <div className='more-info'
      onClick={onToggle}
      style={{
        fontSize: '2.3rem',
        color: '#fff',
        cursor: 'pointer',
        letterSpacing: '0.3rem',
        zIndex: 100,
        width: 'auto',
        borderBottom: '.5rem solid rgba(181, 139, 75, 1)',
      }}>
     <h3 style={{ 'font-family': 'Cairo', 
                   fontSize: '1rem !important', 
                   fontWeight: '700', 
                   marginTop: '2rem',
                    }}>
                    </h3>
<i className={`fas ${isOpen ? 'fa-times' : ''}`} >
  {!isOpen && 'More Info'}
</i>
    </div>
  )
}

export default MoreInfo