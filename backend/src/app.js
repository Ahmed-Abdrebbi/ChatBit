const express = require('express');
const cors = require('cors');
const path = require('path');
const { apiReference } = require('@scalar/express-api-reference');

const authRoutes = require('./routes/auth.routes');
const usersRoutes = require('./routes/users.routes');
const conversationsRoutes = require('./routes/conversations.routes');
const errorHandler = require('./middlewares/error.middleware');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/conversations', conversationsRoutes);

app.get('/openapi.yaml', (req, res) => {
    res.sendFile(path.join(__dirname, 'docs', 'openapi.yaml'));
});

app.use(
    '/docs',
    apiReference({
        spec: {
            url: '/openapi.yaml',
        },
    })
);

app.use(errorHandler);

module.exports = app;