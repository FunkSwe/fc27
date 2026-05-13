"use client";

import { useEffect, useState } from "react";
import styles from "./MessengerModal.module.scss";

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
  updatedAt?: string;
  editedAt?: string;
  isDeleted?: boolean;
};

interface MessengerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MessengerModal({
  isOpen,
  onClose,
}: MessengerModalProps) {
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
  const [isComposerOpen, setIsComposerOpen] = useState(false);
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
        return (
          data.find((item: Conversation) => item._id === current._id) || null
        );
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
    window.dispatchEvent(new Event('messages-read'));
  };

  useEffect(() => {
    if (!isOpen) return;
    setError("");
    loadConversations();

    fetch("/api/auth/me", { cache: "no-store" })
      .then((response) => response.json())
      .then((data) => setCurrentUserId(data?.user?.id || data?.user?._id || ""))
      .catch(() => undefined);
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    setEditingMessageId(null);
    setEditingText("");
    loadMessages(selectedConversation);
  }, [isOpen, selectedConversation?._id]);

  useEffect(() => {
    if (!isOpen || !selectedConversation) return;
    const interval = window.setInterval(() => {
      loadMessages(selectedConversation);
      loadConversations();
    }, 8000);
    return () => window.clearInterval(interval);
  }, [isOpen, selectedConversation?._id]);

  useEffect(() => {
    if (!isOpen) return;
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
  }, [isOpen, search]);

  if (!isOpen) return null;

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
    setSearch("");
    setSearchResults([]);
    setIsComposerOpen(false);
    setSelectedConversation(data);
    await loadConversations();
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
    window.dispatchEvent(new Event('messages-changed'));
    loadConversations();
  };

  const startEditingMessage = (message: Message) => {
    setEditingMessageId(message._id);
    setEditingText(message.body);
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
    if (!selectedConversation) return;
    if (!window.confirm("Delete this message?")) return;

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
    <div
      className={styles.overlay}
      role="dialog"
      aria-modal="true"
      aria-label="Messages"
    >
      <section className={styles.modal}>
        <header className={styles.header}>
          <h2>Messages</h2>
          <button
            type="button"
            className={styles.closeButton}
            onClick={onClose}
          >
            Close
          </button>
        </header>

        <div className={styles.body}>
          <aside className={styles.sidebar}>
            <div className={styles.sidebarTop}>
              <h3 className={styles.panelTitle}>Conversations</h3>
              <button
                type="button"
                className={styles.newChatButton}
                onClick={() => {
                  setIsComposerOpen(true);
                  setSearch("");
                  setSearchResults([]);
                  setSelectedUsers([]);
                  setGroupName("");
                  setEditingMessageId(null);
                }}
              >
                New chat
              </button>
            </div>

            <div className={styles.conversationList}>
              {conversations.map((conversation) => (
                <button
                  key={conversation._id}
                  type="button"
                  onClick={() => {
                    setIsComposerOpen(false);
                    setSelectedConversation(conversation);
                    setEditingMessageId(null);
                  }}
                  className={`${styles.conversationButton} ${!isComposerOpen && selectedConversation?._id === conversation._id ? styles.active : ""}`}
                >
                  {conversationTitle(conversation)}
                </button>
              ))}
              {conversations.length === 0 && <p>No conversations yet.</p>}
            </div>

            {error && <p className={styles.error}>{error}</p>}
          </aside>

          {isComposerOpen ? (
            <section className={styles.composePane}>
              <div className={styles.chatHeader}>
                <h3>Create new chat</h3>
                <p>
                  Search one person for a direct message, or add more people for
                  a group chat.
                </p>
              </div>

              <div className={styles.composeContent}>
                <label className={styles.composeLabel}>
                  Search user
                  <input
                    className={styles.input}
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="Search user…"
                  />
                </label>

                {searchResults.length > 0 && (
                  <div className={styles.searchResults}>
                    {searchResults.map((user) => (
                      <button
                        key={user._id}
                        type="button"
                        onClick={() => addUser(user)}
                        className={styles.userButton}
                      >
                        Add {user.username}
                      </button>
                    ))}
                  </div>
                )}

                {selectedUsers.length > 0 ? (
                  <div className={styles.selectedUsers}>
                    <p>
                      <strong>Selected</strong>
                    </p>
                    <div className={styles.selectedUserList}>
                      {selectedUsers.map((user) => (
                        <span key={user._id}>{user.username}</span>
                      ))}
                    </div>

                    {selectedUsers.length > 1 && (
                      <label className={styles.composeLabel}>
                        Group name <small>(optional)</small>
                        <input
                          className={styles.input}
                          value={groupName}
                          onChange={(event) => setGroupName(event.target.value)}
                          placeholder="Group name"
                        />
                      </label>
                    )}

                    <button
                      type="button"
                      onClick={createConversation}
                      className={styles.actionButton}
                    >
                      Create chat
                    </button>
                  </div>
                ) : (
                  <p className={styles.emptyState}>
                    Search and add someone to start a chat.
                  </p>
                )}
              </div>
            </section>
          ) : (
            <section className={styles.chatPane}>
              {selectedConversation ? (
                <>
                  <div className={styles.chatHeader}>
                    <div className={styles.chatHeaderTop}>
                      <div>
                        <h3>{conversationTitle(selectedConversation)}</h3>
                        <p>
                          <strong>People:</strong>{" "}
                          {selectedConversation.participants
                            .map((participant) => participant.username)
                            .join(", ")}
                        </p>
                      </div>
                      <button
                        type="button"
                        className={styles.dangerButton}
                        onClick={deleteConversation}
                      >
                        {selectedConversation.isGroup ? "Leave chat" : "Delete chat"}
                      </button>
                    </div>
                    <div className={styles.blockActions}>
                      {selectedConversation.participants
                        .filter(
                          (participant) =>
                            !participant.isAdmin &&
                            participant._id !== currentUserId,
                        )
                        .map((participant) => (
                          <button
                            key={participant._id}
                            type="button"
                            className={styles.actionButton}
                            onClick={() => blockUser(participant)}
                          >
                            Block {participant.username}
                          </button>
                        ))}
                    </div>
                  </div>

                  <div className={styles.messageList}>
                    {messages.map((message) => {
                      const isOwnMessage = message.sender?._id === currentUserId;
                      const isEditing = editingMessageId === message._id;

                      return (
                        <article
                          key={message._id}
                          className={`${styles.messageItem} ${isOwnMessage ? styles.ownMessage : ""} ${message.isDeleted ? styles.deletedMessage : ""}`}
                        >
                          <div className={styles.messageTopline}>
                            <strong>{message.sender?.username || "Unknown"}</strong>
                            {isOwnMessage && !message.isDeleted && (
                              <div className={styles.messageActions}>
                                <button
                                  type="button"
                                  onClick={() => startEditingMessage(message)}
                                >
                                  Edit
                                </button>
                                <button
                                  type="button"
                                  onClick={() => deleteMessage(message)}
                                >
                                  Delete
                                </button>
                              </div>
                            )}
                          </div>

                          {isEditing ? (
                            <div className={styles.editMessageBox}>
                              <textarea
                                className={styles.textarea}
                                value={editingText}
                                onChange={(event) => setEditingText(event.target.value)}
                                rows={3}
                              />
                              <div className={styles.inlineActions}>
                                <button
                                  type="button"
                                  className={styles.actionButton}
                                  onClick={() => saveEditedMessage(message._id)}
                                >
                                  Save
                                </button>
                                <button
                                  type="button"
                                  className={styles.actionButton}
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
                            <p>{message.body}</p>
                          )}

                          <small>
                            {new Date(message.createdAt).toLocaleString()}
                            {message.editedAt && !message.isDeleted ? " · edited" : ""}
                          </small>
                        </article>
                      );
                    })}
                    {messages.length === 0 && <p>No messages yet. Say hi.</p>}
                  </div>

                  <form onSubmit={sendMessage} className={styles.messageForm}>
                    <textarea
                      className={styles.textarea}
                      value={messageText}
                      onChange={(event) => setMessageText(event.target.value)}
                      placeholder="Write a message…"
                      rows={3}
                    />
                    <button type="submit" className={styles.actionButton}>
                      Send message
                    </button>
                  </form>
                </>
              ) : (
                <div className={styles.emptyState}>
                  Choose a conversation or create a new chat.
                </div>
              )}
            </section>
          )}
        </div>
      </section>
    </div>
  );
}
