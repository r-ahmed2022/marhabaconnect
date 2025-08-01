import React, { useState } from 'react'
import { toast } from 'react-toastify';
import { API_BASE_URL } from '../config.js';

export const QueryForm = () => {
    const [fullname, setFullName] = useState('');
    const [queryemail, setQueryEmail] = useState('');
    const [message, setMessage] = useState('');
  
    const queryFormHandler = async (e) => {
  e.preventDefault();

 try {
  const res = await fetch(`${API_BASE_URL}/api/query`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ fullname, queryemail, message })
  });

  const result = await res.json();

  if (!res.ok) {
    toast.error(result.error || 'Email already submitted');
  } else {
    toast.success(result.message || 'Query submitted successfully');
    setFullName('');
    setQueryEmail('');
    setMessage('');
  }
} catch (error) {
  toast.error('Something went wrong');
}

}
  return (
    <form onSubmit={queryFormHandler}
         style={{
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
        margin: '2rem auto',
        padding: '2rem',
        maxWidth: '500px',
        width: '100%',
        boxSizing: 'border-box',
       background: 'rgba(1, 1, 1, 0.5)',
        borderRadius: '8px',

  }}

      
      >
                                    <div className="form__group">
                                    <input type="text" 
                                      className="form__input" 
                                      placeholder="Full name" id="fullname" 
                                      name="fullname"
                                      onChange={(e)=>setFullName(e.target.value)}
                                      value={fullname}
                                      required
                                       style={{
                                        padding: '1rem',
                                        fontSize: '1.2rem',
                                        borderRadius: '4px',
                                        border: '1px solid #ccc',
                                        background: 'transparent',
                                        color: '#fff',

    }}

                                       />
                                    <label for="name" className="form__label">Full name</label>
                                  </div>

                                <div className="form__group">
                                    <input type="email" 
                                        className="form__input" 
                                        placeholder="Email address"
                                        id="queryemail"
                                        name="queryemail"
                                        value={queryemail}
                                        onChange={(e)=>setQueryEmail(e.target.value)}
                                        required 
                                        style={{
                                        padding: '1rem',
                                        fontSize: '1.2rem',
                                        borderRadius: '4px',
                                        border: '1px solid #ccc',
                                        background: 'transparent',
                                        color: '#fff',

    }}
                                        />
                                    <label for="queryemail" className="form__label">Email address</label>
                                </div>
          <textarea
          placeholder="What would you like to know?"
          rows="3"
          name="message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          required
          style={{
            padding: '1rem',
            fontSize: '1.2rem',
            
            borderRadius: '4px',
            border: '1px solid #ccc',
            resize: 'vertical',
            background:  'transparent',
            color: '#fff',

          }}
        />
        <button type="submit"   
          style={{
          padding: '1rem',
          background: '#ff9900',
          color: '#fff',
          border: 'none',
          cursor: 'pointer',
          fontWeight: 'bold',
          borderRadius: '4px',
          fontSize: '1.1rem'
    }}
      >
          Submit
        </button>
      </form>
  )
}
