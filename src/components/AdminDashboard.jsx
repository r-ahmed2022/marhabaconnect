import { useState, useEffect, useRef } from "react";
import io from "socket.io-client";
import { API_BASE_URL } from "../config";

const AdminDashboard = () => {
  const [customers, setCustomers] = useState({});
  const [selectedSession, setSelectedSession] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [currentAdmin, setCurrentAdmin] = useState({ id: "admin1", name: "Admin", email: "admin@example.com" });

  const socketRef = useRef(null);
  const audioRef = useRef(null);

  // ✅ Ask for notification permission on load
  useEffect(() => {
    if ("Notification" in window) {
      if (Notification.permission === "default") {
        Notification.requestPermission();
      }
    }
  }, []);

  useEffect(() => {
    socketRef.current = io(API_BASE_URL, {
      path: "/socket.io/chat",
      query: { role: 'admin' }
    });

    socketRef.current.on("connect", () => {
      console.log("Admin socket connected:", socketRef.current.id);
    });

    socketRef.current.on("disconnect", (reason) => {
      console.log("Admin socket disconnected:", reason);
    });

    socketRef.current.on("connect_error", (error) => {
      console.error("Admin socket connection error:", error);
    });

    // customer status updates (online/offline)
    socketRef.current.on("customer_status", (data) => {
      console.log("Customer status:", data);
      if (data.status === 'online') {
        setCustomers((prev) => ({
          ...prev,
          [data.sessionId]: {
            name: data.customer.name,
            email: data.customer.email,
            sessionId: data.sessionId,
            assignedAdmin: null,
            status: 'online',
            unread: 0,
            lastMessageAt: new Date()
          },
        }));
      } else if (data.status === 'offline') {
        setCustomers((prev) => {
          const updated = { ...prev };
          delete updated[data.sessionId];
          return updated;
        });
      }
    });

    // active sessions on admin connect
    socketRef.current.on("active_sessions", (sessions) => {
      console.log("Received active sessions:", sessions);
      const updated = {};
      sessions.forEach(session => {
        updated[session.sessionId] = {
          ...session.customer,
          sessionId: session.sessionId,
          assignedAdmin: null,
          status: 'online',
          lastMessageAt: session.lastMessageAt || new Date(),
          unread: 0,
        };
      });
      setCustomers(updated);
    });

    // session messages for opened chat
    socketRef.current.on("session-messages", (data) => {
      console.log("Received session messages:", data);
      const { sessionId, messages } = data;
      console.log(`Setting ${messages?.length || 0} messages for session ${sessionId}`);
      // Set messages for the current session being opened
      setMessages(messages || []);
    });

    // new message from a customer or admin
    socketRef.current.on("message", (msg) => {
      console.log("Received message:", msg);

      // Convert backend message format to frontend format
      const formattedMsg = {
        sessionId: msg.sessionId,
        userType: msg.sender === 'admin' ? 'admin' : 'customer',
        user: msg.user || { name: msg.sender === 'admin' ? 'Admin' : 'Customer' },
        text: msg.text,
        createdAt: new Date(msg.timestamp),
        _id: `msg-${Date.now()}-${Math.random()}`
      };

      // Always update the customer's last message time
      setCustomers((prev) => {
        const updated = { ...prev };
        if (updated[msg.sessionId]) {
          updated[msg.sessionId] = {
            ...updated[msg.sessionId],
            lastMessageAt: new Date(),
          };
        }
        return updated;
      });

      if (msg.sessionId === selectedSession) {
        // currently viewing this chat - add message to conversation
        setMessages((prev) => {
          // Check if message already exists to prevent duplicates
          const existingIndex = prev.findIndex(m =>
            m._id === formattedMsg._id ||
            (m._id?.startsWith('temp-') && m.text === formattedMsg.text && m.userType === formattedMsg.userType)
          );

          if (existingIndex >= 0) {
            // Replace optimistic message with real message
            const updated = [...prev];
            updated[existingIndex] = formattedMsg;
            return updated;
          } else {
            // Add new message
            return [...prev, formattedMsg];
          }
        });
      } else {
        // not viewing this chat - mark as unread
        setCustomers((prev) => {
          const updated = { ...prev };
          if (updated[msg.sessionId]) {
            updated[msg.sessionId] = {
              ...updated[msg.sessionId],
              unread: (updated[msg.sessionId].unread || 0) + 1,
            };
          }
          return updated;
        });

        if (audioRef.current) {
          audioRef.current.play().catch(() => {});
        }

        // 🔔 Browser Push Notification
        if ("Notification" in window && Notification.permission === "granted") {
          new Notification(`New message from ${formattedMsg.user?.name || "Customer"}`, {
            body: formattedMsg.text,
            icon: "/favicon.ico", // optional: use your firm logo
          });
        }
      }
    });

    // fetch active sessions on connect
    socketRef.current.emit("join", { role: 'admin' });

    return () => {
      socketRef.current?.disconnect();
    };
  }, [selectedSession]);

  // Clean up inactive customers (simulate disconnection)
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      setCustomers((prev) => {
        const updated = { ...prev };
        Object.keys(updated).forEach((sessionId) => {
          if (updated[sessionId].lastMessageAt && now - updated[sessionId].lastMessageAt > 10 * 60 * 1000) { // 10 minutes
            delete updated[sessionId];
          }
        });
        return updated;
      });
    }, 60 * 1000); // Check every minute

    return () => clearInterval(interval);
  }, []);

  const openChat = (sessionId) => {
    console.log("Opening chat for session:", sessionId);
    console.log("Current customers:", Object.keys(customers));
    console.log("Customer data:", customers[sessionId]);

    setSelectedSession(sessionId);

    // reset unread count for this session
    setCustomers((prev) => {
      const updated = {
        ...prev,
        [sessionId]: {
          ...prev[sessionId],
          unread: 0,
          lastMessageAt: new Date()
        },
      };
      console.log("Updated customers after reset:", updated);
      return updated;
    });

    // Clear messages first, then fetch messages for this specific session
    console.log("Clearing messages and fetching for session:", sessionId);
    setMessages([]);
    console.log("Emitting get-session-messages for:", sessionId);
    socketRef.current.emit("get-session-messages", { sessionId });
  };

  const sendMessage = () => {
    if (!input.trim() || !selectedSession) return;

    const messageData = {
      sessionId: selectedSession,
      user: currentAdmin,
      text: input.trim(),
    };

    console.log("Sending admin message:", messageData);

    // Optimistically add the message to the chat immediately
    const optimisticMessage = {
      ...messageData,
      userType: "admin",
      createdAt: new Date(),
      _id: `temp-${Date.now()}`, // temporary ID
    };

    setMessages((prev) => [...prev, optimisticMessage]);

    socketRef.current.emit("admin-message", messageData);
    setInput("");
  };

  return (
    <div className="dashboard">
      {/* 🔔 Notification Sound */}
      <audio ref={audioRef} src="/newMessage.mp3" preload="auto" />

      <aside className="sidebar">
        <h2>Customers</h2>
        <ul>
          {Object.entries(customers).map(([sessionId, c]) => (
            <li
              key={sessionId}
              onClick={() => openChat(sessionId)}
              className={sessionId === selectedSession ? "active" : ""}
            >
              <div>
                <span>
                  {c.name} <small>({c.email})</small>
                </span>
                {c.assignedAdmin && <small>Assigned to: {c.assignedAdmin.name}</small>}
              </div>
              {c.unread > 0 && <span className="badge">{c.unread}</span>}
            </li>
          ))}
        </ul>
      </aside>

      <main className="chat-area">
        {selectedSession ? (
          <>
            <div className="chat-header">
              <h3>
                Chat with {customers[selectedSession]?.name} (
                {customers[selectedSession]?.email})
                {customers[selectedSession]?.assignedAdmin && (
                  <>
                    <br />
                    <small>Assigned to: {customers[selectedSession].assignedAdmin.name}</small>
                  </>
                )}
              </h3>
            </div>
            <div className="chat-messages">
              {console.log("Rendering messages:", messages)}
              {messages.length === 0 ? (
                <p>No messages yet. Start the conversation!</p>
              ) : (
                messages.map((msg, index) => (
                  <div
                    key={msg._id || `${msg.sessionId}-${msg.createdAt}-${index}`}
                    className={`message ${
                      msg.userType === "admin" ? "admin" : "customer"
                    }`}
                  >
                    <strong>{msg.user?.name || (msg.userType === "admin" ? "Admin" : "Customer")}:</strong> {msg.text}
                    <span className="time">
                      {new Date(msg.createdAt).toLocaleTimeString()}
                    </span>
                  </div>
                ))
              )}
            </div>
            <div className="chat-input">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type a reply..."
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              />
              <button onClick={sendMessage}>Send</button>
            </div>
          </>
        ) : (
          <p>Select a customer to start chatting</p>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;
