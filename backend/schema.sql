CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    fullname VARCHAR(120) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    passwordhash VARCHAR(255) NOT NULL,
    role VARCHAR(10) NOT NULL CHECK (role IN ('client', 'agent')),
    isonline BOOLEAN NOT NULL DEFAULT false,
    createdat TIMESTAMP NOT NULL DEFAULT now()
);

CREATE TABLE conversations (
    id SERIAL PRIMARY KEY,
    subject VARCHAR(255) NOT NULL,
    status VARCHAR(15) NOT NULL DEFAULT 'en_attente'
        CHECK (status IN ('en_attente', 'en_cours', 'fermee')),
    clientid INTEGER NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    agentid INTEGER REFERENCES users(id) ON DELETE SET NULL,
    createdat TIMESTAMP NOT NULL DEFAULT now(),
    closedat TIMESTAMP
);

CREATE TABLE messages (
    id SERIAL PRIMARY KEY,
    conversationid INTEGER NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
    senderid INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    isread BOOLEAN NOT NULL DEFAULT false,
    sentat TIMESTAMP NOT NULL DEFAULT now()
);

CREATE INDEX idx_conversations_status ON conversations(status);
CREATE INDEX idx_messages_conversation ON messages(conversationid, sentat);