import React, { useReducer, useEffect, useRef, useCallback, useState } from "react";
import { useChatSocket } from "../hooks/useChatSocket";
import { chatReducer, initialState } from "../chatReducer";

import "./ChatWidget.scss";
export default function ChatWidget({ sessionId: initialSessionId , onToggle, setShowHamburgerContainer, setShowServiceCarousel }) {
   const [state, dispatch] = useReducer(chatReducer, initialState);
   const [isOpen, setIsOpen] = useState(false);
   const {
     form,
     user,
     messages,
     isAdminTyping,
     unreadCount,
     input,
     isMinimized,
   } = state;

  const messagesEndRef   = useRef(null);
  const typingTimeoutRef = useRef(null);

  // Persist a stable sessionId across visits so the same user isn't duplicated on the admin side
  const [sid, setSid] = useState(() => {
    try {
      if (initialSessionId) {
        localStorage.setItem('mc_sessionId', initialSessionId);
        return initialSessionId;
      }
      const saved = localStorage.getItem('mc_sessionId');
      if (saved) return saved;
      const generated = `sess-${Date.now()}-${Math.random().toString(36).slice(2,8)}`;
      localStorage.setItem('mc_sessionId', generated);
      return generated;
    } catch {
      // Fallback when localStorage is unavailable
      return initialSessionId || `sess-${Date.now()}-${Math.random().toString(36).slice(2,8)}`;
    }
  });

  // If parent ever provides a new sessionId explicitly, persist and use it
  useEffect(() => {
    if (initialSessionId && initialSessionId !== sid) {
      try { localStorage.setItem('mc_sessionId', initialSessionId); } catch {}
      setSid(initialSessionId);
    }
  }, [initialSessionId]);

  // Stable callbacks so socket hook doesn't reconnect on every render
  const handleIncomingMessage = useCallback(
    (msg) => {
      console.log("Received message:", msg);
      dispatch({ type: "ADD_MESSAGE", payload: msg });
      if (isMinimized) {
        dispatch({ type: "INCREMENT_UNREAD" });
      }
    },
    [isMinimized]
  );

  const handleTypingStatus = useCallback(
    (typing) => dispatch({ type: "SET_ADMIN_TYPING", payload: typing }),
    []
  );

  const handleHistory = useCallback(
    ({ sessionId: sid, messages: history }) => {
      // Pass through raw history; reducer will normalize, dedupe by cid, and merge safely
      dispatch({
        type: "SET_MESSAGES",
        payload: Array.isArray(history) ? history : [],
      });
    },
    []
  );

  const { connect, disconnect, sendMessage, setTyping } = useChatSocket({
    sessionId: sid,
    user,
    onMessage: handleIncomingMessage,
    onTyping:  handleTypingStatus,
    onError:   (err) => console.error("Chat error:", err),
    onHistory: handleHistory,
  });

  // Join / leave socket when user is set
  useEffect(() => {
    if (!user) return;
    connect();
    return () => disconnect();
  }, [user, sid, connect, disconnect]);

  // Auto-scroll on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Form field updates
  const handleFormChange = (field) => (e) =>
    dispatch({ type: "SET_FORM_FIELD", field, payload: e.target.value });

  const startChat = () => {
    if (form.name && form.email) {
      dispatch({ type: "SET_USER", payload: form });
  }
  };

  // Sending a message
  const handleSend = () => {
    const text = input.trim();
    if (!text) return;
    const cid = `cust-${Date.now()}-${Math.random().toString(36).slice(2,8)}`;
    sendMessage(text, cid);
    dispatch({
      type: "ADD_MESSAGE",
      payload: { sender: "customer", text, timestamp: Date.now(), cid },
    });
    dispatch({ type: "SET_INPUT", payload: "" });
  };

  // Typing indicator
  const handleInputChange = (e) => {
    const val = e.target.value;
    dispatch({ type: "SET_INPUT", payload: val });
    setTyping(true);

    clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      setTyping(false);
    }, 1500);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const toggleChat = () => {
    if (!isOpen) {
      setIsOpen(true);
      dispatch({ type: "RESET_UNREAD" });
    } else if (isMinimized) {
      dispatch({ type: "TOGGLE_MINIMIZE" });
    } else {
      dispatch({ type: "TOGGLE_MINIMIZE" });
    }
  };

  const closeChat = () => {
    setIsOpen(false);
    dispatch({ type: "RESET_UNREAD" });
  };
  
  // Show/hide ServicesCarousel based on chat state
  useEffect(() => {
    if (typeof setShowServiceCarousel !== 'function') return;
    // Hide carousel when chat is open and not minimized; otherwise show it
    const show = !isOpen || isMinimized;
    setShowServiceCarousel(show);
  }, [isOpen, isMinimized, setShowServiceCarousel]);
  
  // Chat icon - always visible
  if (!isOpen) {
    return (
      <button className="chat-icon" onClick={toggleChat}>
        Chat
        {unreadCount > 0 && <span className="unread-badge">{unreadCount}</span>}
      </button>
    );
  }

  // Pre-chat form
  if (!user) {
    return (
      <>
        {/* chat icon hidden when chat is open */}
        <div className="chat-container">
          <div className="chat-header">
            <span style={{fontSize: '1.3rem', color: 'white' }}>Start Chat</span>
            <button className="minimize-btn" onClick={closeChat}>×</button>
          </div>
          <div className="chat-form">
            <input
              placeholder="Your Name"
              value={form.name}
              onChange={handleFormChange("name")}
              required
            />
            <input
              type="email"
              placeholder="Your Email"
              value={form.email}
              onChange={handleFormChange("email")}
              required
            />
            <button type="submit" onClick={startChat}
              style={{fontSize: '1.3rem', color: 'white' }}
             >Start Chat</button>
          </div>
        </div>
      </>
    );
  }

  // Minimized chat window
  if (isMinimized) {
    return (
      <>
        <button className="chat-icon" onClick={toggleChat}>
          💬
          {unreadCount > 0 && <span className="unread-badge">{unreadCount}</span>}
        </button>
        <div className="chat-container minimized">
          <div className="chat-header">
            <span style={{ 'font-family': 'Roboto', fontSize: '1.3rem ', fontWeight: '700' }}>Support Chat</span>
            <button className="minimize-btn" onClick={closeChat}>×</button>
          </div>
        </div>
      </>
    );
  }


  // Active chat window
  // Determine current admin display name from the latest admin message that contains a user object
  const adminName =
    [...messages].reverse().find(m => m?.sender === 'admin' && m?.user?.name)?.user?.name || null;

  return (
    <>
      {/* chat icon hidden when chat is open */}
      <div className="chat-container">
        <div className="chat-header">
          <span style={{ 'font-family': 'Roboto', fontSize: '1.3rem ', fontWeight: '700' }}>{adminName ? `Chat with ${adminName}` : 'Support Chat'}</span>
          <button className="minimize-btn" onClick={closeChat}>×</button>
        </div>

        <div className="chat-messages">
          {console.log("Rendering messages:", messages)}
          {messages.length === 0 && (
            <div style={{ fontSize: '1.3rem', color: 'white' }}>No messages yet</div>
          )}
          {messages.map((msg, i) => {
            console.log("Rendering message:", msg);
            const senderName =
              msg.sender === "admin"
                ? (msg.user?.name || "Admin")
                : (user?.name || "You");
            return (
              <div
                key={i}
                className={`chat-message ${
                  msg.sender === "customer" ? "customer" : "admin"
                }`}
              >
                <div className="chat-sender" style={{ fontWeight: 600, marginBottom: 4 }}>
                  {senderName}
                </div>
                <div className="chat-text">{msg.text}</div>
                <div className="chat-time">
                  {new Date(msg.timestamp).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
          {isAdminTyping && (
            <div className="chat-typing">{adminName ? `${adminName} is typing…` : 'Admin is typing…'}</div>
          )}
        </div>

        <div className="chat-input-area">
          <textarea
            value={input}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder="Type your message…"
          />
          <button onClick={handleSend} style={{fontSize: '1.3rem', color: 'white' }}>Send</button>
        </div>
      </div>
    </>
  );
}