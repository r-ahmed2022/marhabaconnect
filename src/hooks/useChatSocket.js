import { useEffect, useRef, useCallback } from "react";
import { io } from "socket.io-client";
import { API_BASE_URL } from "../config";
export function useChatSocket({ sessionId, user, onMessage, onTyping, onError, onHistory }) {
  const socketRef = useRef(null);

  // Keep the latest handlers without re-initializing the socket
  const onMessageRef = useRef(onMessage);
  const onTypingRef = useRef(onTyping);
  const onErrorRef = useRef(onError);
  const onHistoryRef = useRef(onHistory);

  useEffect(() => { onMessageRef.current = onMessage; }, [onMessage]);
  useEffect(() => { onTypingRef.current  = onTyping;  }, [onTyping]);
  useEffect(() => { onErrorRef.current   = onError;   }, [onError]);
  useEffect(() => { onHistoryRef.current = onHistory; }, [onHistory]);

  useEffect(() => {
    // Don’t initialize if we don’t have a session or user yet
    if (!sessionId || !user) return;
   const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    // Create socket but don't auto-connect until we call connect()
    const socket = io(API_BASE_URL, {
      path: "/socket.io/chat",
      query: {
        role: 'customer',
        sessionId,
        name: user.name,
        email: user.email,
        timezone: user.timezone || timezone
      },
      withCredentials: true,
      autoConnect: false,
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 500
    });
    socketRef.current = socket;
  
    // Live message from admin
    socket.on("message", (msg) => {
      console.log("Socket received message:", msg);
      onMessageRef.current && onMessageRef.current(msg);

      // Send delivery ACK for reliable admin->customer delivery
      try {
        if (msg && msg.cid) {
          socket.emit("message_ack", { sessionId, cid: msg.cid, from: "customer" });
        }
      } catch (e) {
        console.warn("Failed to emit message_ack:", e);
      }
    });

    // Full history for session
    socket.on("session-messages", (data) => {
      console.log("Socket received session history:", data);
      onHistoryRef.current && onHistoryRef.current(data);
    });
  
    // Admin typing indicator
    socket.on("typing", ({ isTyping }) => {
      onTypingRef.current && onTypingRef.current(isTyping);
    });
  
    // Server-side errors
    socket.on("chatError", ({ message }) => {
      onErrorRef.current && onErrorRef.current(message);
    });
  
    // Connection established
    socket.on("connect", () => {
      console.log("Customer socket connected:", socket.id);
      // Ensure room membership even if initial query was missed server-side
      socket.emit("join", {
        role: "customer",
        sessionId,
        name: user.name,
        email: user.email
      });
      // Fetch full history to avoid missing messages sent while offline
      socket.emit("get-session-messages", { sessionId });
    });

    socket.on("disconnect", (reason) => {
      console.warn("Customer socket disconnected:", reason);
    });

    // Log connection issues for diagnostics
    socket.on("connect_error", (err) => {
      console.error("Customer socket connect_error:", err);
    });
  
    socket.on("reconnect", () => {
      // Re-join on reconnect to guarantee we receive admin messages
      socket.emit("join", {
        role: "customer",
        sessionId,
        name: user.name,
        email: user.email
      });
      // Re-fetch history after reconnect to fill any gaps
      socket.emit("get-session-messages", { sessionId });
    });

    return () => {
      socket.disconnect();
    };
  }, [sessionId, user]);

  // Imperative API (stable refs to avoid reconnects on re-render)
  const connect = useCallback(() => {
    socketRef.current?.connect();
  }, []);

  const disconnect = useCallback(() => {
    socketRef.current?.disconnect();
  }, []);

  const sendMessage = useCallback((text, cid) => {
    socketRef.current?.emit("message", {
      sessionId,
      sender: "customer",
      text,
      cid
    });
  }, [sessionId]);

  const setTyping = useCallback((isTyping) => {
    socketRef.current?.emit("typing", { sessionId, isTyping });
  }, [sessionId]);

  return { connect, disconnect, sendMessage, setTyping };
}