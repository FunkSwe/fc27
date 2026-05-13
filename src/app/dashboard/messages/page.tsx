"use client";

import { useEffect, useState } from "react";
import styles from "../Dashboard.module.scss";

type UserSearchResult = {
  _id: string;
  username: string;
  email: string;
  role: string;
  isAdmin?: boolean;
};

type Conversation = {
  _id: string;
  name?: string;
  isGroup: boolean;
  participants: UserSearchResult[];
};

type Message = {
  _id: string;
  body: string;
  sender: UserSearchResult;
  createdAt: string;
  editedAt?: string;
  isDeleted?: boolean;
};

const inputStyle = {
  width: "100%",
  padding: "0.9rem",
  border: "2px solid #111",
  background: "#fff",
  color: "#111",
};

export default function DashboardMessagesPage() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] =
    useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState<UserSearchResult[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<UserSearchResult[]>([]);
  const [groupName, setGroupName] = useState("");
  const [messageText, setMessageText] = useState("");
  const [error, setError] = useState("");
  const [currentUserId, setCurrentUserId] = useState("");
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
  const [editingText, setEditingText] = useState("");

  const conversationTitle = (conversation: Conversation) => {
    if (conversation.isGroup) return conversation.name || "Group conversation";
    const others = conversation.participants.filter(
      (participant) => participant._id !== currentUserId,
    );
    return (others.length > 0 ? others : conversation.participants)
      .map((participant) => participant.username)
      .join(", ");
  };

  const loadConversations = async () => {
    const response = await fetch("/api/conversations", { cache: "no-store" });
    const data = await response.json().catch(() => null);
    if (!response.ok) {
      setError(data?.error || "Unable to load conversations.");
      return;
    }
    setConversations(data);
    setSelectedConversation((current) => {
      if (current)
        return data.find((item: Conversation) => item._id === current._id) || null;
      return data[0] || null;
    });
  };

  const loadMessages = async (conversation: Conversation | null) => {
    if (!conversation) {
      setMessages([]);
      return;
    }
    const response = await fetch(
      `/api/conversations/${conversation._id}/messages`,
      { cache: "no-store" },
    );
    const data = await response.json().catch(() => null);
    if (!response.ok) {
      setError(data?.error || "Unable to load messages.");
      return;
    }
    setMessages(data);
  };

  useEffect(() => {
    loadConversations();

    fetch("/api/auth/me", { cache: "no-store" })
      .then((response) => response.json())
      .then((data) => setCurrentUserId(data?.user?.id || data?.user?._id || ""))
      .catch(() => undefined);
  }, []);

  useEffect(() => {
    setEditingMessageId(null);
    setEditingText("");
    loadMessages(selectedConversation);
  }, [selectedConversation?._id]);

  useEffect(() => {
    const controller = new AbortController();

    async function runSearch() {
      if (search.trim().length < 2) {
        setSearchResults([]);
        return;
      }

      const response = await fetch(
        `/api/users/search?q=${encodeURIComponent(search.trim())}`,
        {
          signal: controller.signal,
        },
      );
      const data = await response.json().catch(() => null);
      if (response.ok) setSearchResults(data);
    }

    runSearch().catch(() => undefined);
    return () => controller.abort();
  }, [search]);

  const addUser = (user: UserSearchResult) => {
    setSelectedUsers((current) =>
      current.some((item) => item._id === user._id)
        ? current
        : [...current, user],
    );
    setSearch("");
    setSearchResults([]);
  };

  const createConversation = async () => {
    setError("");
    const response = await fetch("/api/conversations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        participantIds: selectedUsers.map((user) => user._id),
        isGroup: selectedUsers.length > 1,
        name: groupName,
      }),
    });
    const data = await response.json().catch(() => null);
    if (!response.ok) {
      setError(data?.error || "Unable to create conversation.");
      return;
    }
    setSelectedUsers([]);
    setGroupName("");
    await loadConversations();
    setSelectedConversation(data);
  };

  const sendMessage = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!selectedConversation || !messageText.trim()) return;

    const response = await fetch(
      `/api/conversations/${selectedConversation._id}/messages`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ body: messageText }),
      },
    );
    const data = await response.json().catch(() => null);
    if (!response.ok) {
      setError(data?.error || "Unable to send message.");
      return;
    }
    setMessageText("");
    setMessages((current) => [...current, data]);
    loadConversations();
  };

  const saveEditedMessage = async (messageId: string) => {
    if (!selectedConversation || !editingText.trim()) return;

    const response = await fetch(
      `/api/conversations/${selectedConversation._id}/messages/${messageId}`,
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ body: editingText }),
      },
    );
    const data = await response.json().catch(() => null);
    if (!response.ok) {
      setError(data?.error || "Unable to edit message.");
      return;
    }
    setMessages((current) =>
      current.map((message) => (message._id === messageId ? data : message)),
    );
    setEditingMessageId(null);
    setEditingText("");
  };

  const deleteMessage = async (message: Message) => {
    if (!selectedConversation || !window.confirm("Delete this message?")) return;

    const response = await fetch(
      `/api/conversations/${selectedConversation._id}/messages/${message._id}`,
      { method: "DELETE" },
    );
    const data = await response.json().catch(() => null);
    if (!response.ok) {
      setError(data?.error || "Unable to delete message.");
      return;
    }
    setMessages((current) =>
      current.map((item) => (item._id === message._id ? data : item)),
    );
  };

  const deleteConversation = async () => {
    if (!selectedConversation) return;
    const label = selectedConversation.isGroup ? "leave/delete this chat" : "delete this chat";
    if (!window.confirm(`Are you sure you want to ${label}?`)) return;

    const response = await fetch(`/api/conversations/${selectedConversation._id}`, {
      method: "DELETE",
    });
    const data = await response.json().catch(() => null);
    if (!response.ok) {
      setError(data?.error || "Unable to delete conversation.");
      return;
    }
    setMessages([]);
    setSelectedConversation(null);
    await loadConversations();
  };

  const blockUser = async (user: UserSearchResult) => {
    if (!window.confirm(`Block ${user.username}?`)) return;
    const response = await fetch("/api/blocks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ blockedUserId: user._id }),
    });
    const data = await response.json().catch(() => null);
    if (!response.ok) setError(data?.error || "Unable to block user.");
  };

  return (
    <main className={styles.dashboardPage}>
      <section className={styles.hero}>
        <p className={styles.kicker}>Community</p>
        <h1>Messages</h1>
        <p>
          Search registered users, create direct chats or group conversations,
          and block users when needed.
        </p>
      </section>

      {error && <p style={{ color: "#b20b1a" }}>{error}</p>}

      <section className={styles.grid} style={{ alignItems: "start" }}>
        <aside className={styles.card}>
          <h3>New chat</h3>
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search user…"
            style={inputStyle}
          />

          {searchResults.length > 0 && (
            <div style={{ display: "grid", gap: "0.5rem", marginTop: "1rem" }}>
              {searchResults.map((user) => (
                <button
                  key={user._id}
                  type="button"
                  onClick={() => addUser(user)}
                  className={styles.logoutButton}
                >
                  Add {user.username}
                </button>
              ))}
            </div>
          )}

          {selectedUsers.length > 0 && (
            <div style={{ marginTop: "1rem" }}>
              <p>
                <strong>Selected:</strong>{" "}
                {selectedUsers.map((user) => user.username).join(", ")}
              </p>
              {selectedUsers.length > 1 && (
                <input
                  value={groupName}
                  onChange={(event) => setGroupName(event.target.value)}
                  placeholder="Group name, optional"
                  style={inputStyle}
                />
              )}
              <button
                type="button"
                onClick={createConversation}
                className={styles.logoutButton}
                style={{ marginTop: "1rem" }}
              >
                Create chat
              </button>
            </div>
          )}

          <h3 style={{ marginTop: "2rem" }}>Conversations</h3>
          <div style={{ display: "grid", gap: "0.75rem" }}>
            {conversations.map((conversation) => (
              <button
                key={conversation._id}
                type="button"
                onClick={() => setSelectedConversation(conversation)}
                className={styles.logoutButton}
              >
                {conversationTitle(conversation)}
              </button>
            ))}
            {conversations.length === 0 && <p>No conversations yet.</p>}
          </div>
        </aside>

        <section className={styles.card}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              gap: "1rem",
              alignItems: "flex-start",
              flexWrap: "wrap",
            }}
          >
            <h3>
              {selectedConversation
                ? conversationTitle(selectedConversation)
                : "No chat selected"}
            </h3>
            {selectedConversation && (
              <button
                type="button"
                className={styles.logoutButton}
                onClick={deleteConversation}
              >
                {selectedConversation.isGroup ? "Leave chat" : "Delete chat"}
              </button>
            )}
          </div>

          {selectedConversation && (
            <div style={{ marginBottom: "1rem" }}>
              <p>
                <strong>People:</strong>{" "}
                {selectedConversation.participants
                  .map((participant) => participant.username)
                  .join(", ")}
              </p>
              <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                {selectedConversation.participants
                  .filter(
                    (participant) =>
                      !participant.isAdmin && participant._id !== currentUserId,
                  )
                  .map((participant) => (
                    <button
                      key={participant._id}
                      type="button"
                      className={styles.logoutButton}
                      onClick={() => blockUser(participant)}
                    >
                      Block {participant.username}
                    </button>
                  ))}
              </div>
            </div>
          )}

          <div
            style={{
              display: "grid",
              gap: "0.75rem",
              minHeight: 260,
              alignContent: "start",
            }}
          >
            {messages.map((message) => {
              const isOwnMessage = message.sender?._id === currentUserId;
              const isEditing = editingMessageId === message._id;

              return (
                <article
                  key={message._id}
                  style={{
                    border: "2px solid #111",
                    padding: "1rem",
                    background: isOwnMessage ? "#fffaf0" : "rgba(255,255,255,0.35)",
                    opacity: message.isDeleted ? 0.7 : 1,
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      gap: "0.75rem",
                      flexWrap: "wrap",
                    }}
                  >
                    <strong>{message.sender?.username || "Unknown"}</strong>
                    {isOwnMessage && !message.isDeleted && (
                      <div style={{ display: "flex", gap: "0.4rem" }}>
                        <button
                          type="button"
                          className={styles.logoutButton}
                          onClick={() => {
                            setEditingMessageId(message._id);
                            setEditingText(message.body);
                          }}
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          className={styles.logoutButton}
                          onClick={() => deleteMessage(message)}
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </div>

                  {isEditing ? (
                    <div style={{ display: "grid", gap: "0.65rem", marginTop: "0.75rem" }}>
                      <textarea
                        value={editingText}
                        onChange={(event) => setEditingText(event.target.value)}
                        rows={3}
                        style={inputStyle}
                      />
                      <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                        <button
                          type="button"
                          className={styles.logoutButton}
                          onClick={() => saveEditedMessage(message._id)}
                        >
                          Save
                        </button>
                        <button
                          type="button"
                          className={styles.logoutButton}
                          onClick={() => {
                            setEditingMessageId(null);
                            setEditingText("");
                          }}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <p style={{ whiteSpace: "pre-wrap" }}>{message.body}</p>
                  )}
                  <small>
                    {new Date(message.createdAt).toLocaleString()}
                    {message.editedAt && !message.isDeleted ? " · edited" : ""}
                  </small>
                </article>
              );
            })}
            {selectedConversation && messages.length === 0 && (
              <p>No messages yet. Say hi.</p>
            )}
          </div>

          {selectedConversation && (
            <form
              onSubmit={sendMessage}
              style={{ display: "grid", gap: "1rem", marginTop: "1rem" }}
            >
              <textarea
                value={messageText}
                onChange={(event) => setMessageText(event.target.value)}
                placeholder="Write a message…"
                rows={4}
                style={inputStyle}
              />
              <button type="submit" className={styles.logoutButton}>
                Send message
              </button>
            </form>
          )}
        </section>
      </section>
    </main>
  );
}
