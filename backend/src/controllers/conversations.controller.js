const conversationRepository = require('../repositories/conversation.repository');
const messageRepository = require('../repositories/message.repository');

async function create(req, res, next) {
    const { subject } = req.body;

    if (!subject || !subject.trim()) {
        const err = new Error('subject is required');
        err.statusCode = 400;
        return next(err);
    }

    try {
        const conversation = await conversationRepository.createConversation({
            clientId: req.user.id,
            subject: subject.trim(),
        });
        res.status(201).json({ conversation });
    } catch (error) {
        next(error);
    }
}

async function list(req, res, next) {
    try {
        const conversations = req.user.role === 'client'
            ? await conversationRepository.listForClient(req.user.id)
            : await conversationRepository.listForAgent(req.user.id);

        res.status(200).json({ conversations });
    } catch (error) {
        next(error);
    }
}

async function getMessages(req, res, next) {
    const conversationId = Number(req.params.id);
    const before = req.query.before ? Number(req.query.before) : undefined;

    try {
        const conversation = await conversationRepository.findById(conversationId);
        if (!conversation) {
            const err = new Error('Conversation not found');
            err.statusCode = 404;
            return next(err);
        }

        const isOwnerClient = req.user.role === 'client' && conversation.clientid === req.user.id;
        const isAssignedAgent = req.user.role === 'agent' && conversation.agentid === req.user.id;
        const isUnassignedAgent = req.user.role === 'agent' && conversation.status === 'en_attente';

        if (!isOwnerClient && !isAssignedAgent && !isUnassignedAgent) {
            const err = new Error('You do not have access to this conversation');
            err.statusCode = 403;
            return next(err);
        }

        const messages = await messageRepository.listByConversation(conversationId, { before });
        res.status(200).json({ messages });
    } catch (error) {
        next(error);
    }
}

async function close(req, res, next) {
    const conversationId = Number(req.params.id);

    try {
        const conversation = await conversationRepository.findById(conversationId);
        if (!conversation) {
            const err = new Error('Conversation not found');
            err.statusCode = 404;
            return next(err);
        }

        if (conversation.agentid !== req.user.id) {
            const err = new Error('Only the assigned agent can close this conversation');
            err.statusCode = 403;
            return next(err);
        }

        const updated = await conversationRepository.closeConversation(conversationId);

        req.app.get('io').to(`conversation:${conversationId}`).emit('conversation:updated', updated);

        res.status(200).json({ conversation: updated });
    } catch (error) {
        next(error);
    }
}

module.exports = { create, list, getMessages, close };