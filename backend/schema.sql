CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    full_name VARCHAR(120) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(10) NOT NULL CHECK (role IN ('client', 'agent', 'admin')),
    is_online BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE conversations (
    id SERIAL PRIMARY KEY,
    subject VARCHAR(255) NOT NULL,
    status VARCHAR(15) NOT NULL DEFAULT 'en_attente'
        CHECK (status IN ('en_attente', 'en_cours', 'fermee')),
    client_id INTEGER NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    agent_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    closed_at TIMESTAMPTZ
);

CREATE TABLE messages (
    id SERIAL PRIMARY KEY,
    conversation_id INTEGER NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
    sender_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    is_read BOOLEAN NOT NULL DEFAULT false,
    sent_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indexes for fast queries
CREATE INDEX idx_conversations_status ON conversations(status);
CREATE INDEX idx_conversations_client ON conversations(client_id);
CREATE INDEX idx_conversations_agent ON conversations(agent_id);
CREATE INDEX idx_messages_conversation ON messages(conversation_id, sent_at);