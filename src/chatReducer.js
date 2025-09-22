export const initialState = {
  form: { name: "", email: "" },
  user: null,
  messages: [],
  isAdminTyping: false,
  unreadCount: 0,
  input: "",
  isMinimized: false,
};

export function chatReducer(state, action) {
  switch (action.type) {
    case "SET_FORM_FIELD":
      return {
        ...state,
        form: { ...state.form, [action.field]: action.payload },
      };

    case "SET_USER":
      return { ...state, user: action.payload };

    case "ADD_MESSAGE": {
      const incoming = action.payload || {};

      // 1) CID-based de-duplication (reliable for echoes)
      if (incoming.cid) {
        const exists = state.messages.some(m => m.cid && m.cid === incoming.cid);
        if (exists) return state;
      } else {
        // 2) Fallback only for customer duplicates without cid (avoid suppressing admin messages)
        if (incoming.sender === "customer") {
          const last = state.messages[state.messages.length - 1];
          if (last && last.sender === incoming.sender && last.text === incoming.text) {
            const lastTs = new Date(last.timestamp).getTime() || 0;
            const incTs  = new Date(incoming.timestamp).getTime() || 0;
            if (Math.abs(incTs - lastTs) < 2000) return state;
          }
        }
      }

      console.log("Adding message to state:", incoming);
      return { ...state, messages: [...state.messages, incoming] };
    }

    case "SET_MESSAGES": {
      // Merge server history with local messages to avoid race conditions
      const incoming = Array.isArray(action.payload)
        ? action.payload.map(m => ({
            sender: m.sender,
            text: m.text,
            timestamp: m.timestamp || m.createdAt || Date.now(),
            cid: m.cid,
            user: m.user
          }))
        : [];

      // Build an index on existing messages by cid (when present)
      const byCid = new Map();
      state.messages.forEach(m => {
        if (m.cid) byCid.set(m.cid, true);
      });

      // Start with existing messages; add incoming when not present
      const merged = [...state.messages];
      incoming.forEach(m => {
        if (m.cid) {
          if (!byCid.has(m.cid)) {
            merged.push(m);
            byCid.set(m.cid, true);
          }
        } else {
          // Fallback merge heuristic for messages without cid
          const exists = merged.some(x =>
            !x.cid &&
            x.sender === m.sender &&
            x.text === m.text &&
            Math.abs((new Date(x.timestamp).getTime() || 0) - (new Date(m.timestamp).getTime() || 0)) < 2000
          );
          if (!exists) merged.push(m);
        }
      });

      // Sort by timestamp to keep visual order stable
      merged.sort((a, b) => (new Date(a.timestamp).getTime() || 0) - (new Date(b.timestamp).getTime() || 0));

      return { ...state, messages: merged };
    }

    case "SET_INPUT":
      return { ...state, input: action.payload };

    case "SET_ADMIN_TYPING":
      return { ...state, isAdminTyping: action.payload };

    case "INCREMENT_UNREAD":
      return { ...state, unreadCount: state.unreadCount + 1 };

    case "RESET_UNREAD":
      return { ...state, unreadCount: 0 };

    case "TOGGLE_MINIMIZE":
      const nextMin = !state.isMinimized;
      return {
        ...state,
        isMinimized: nextMin,
        unreadCount: nextMin ? state.unreadCount : 0,
      };

    default:
      return state;
  }
}