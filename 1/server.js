const express = require('express');
const jwt = require('jsonwebtoken');

const server = express();
const porta = 5000;

server.use(express.json());

const users = [];
const eventos = [];


function verificarToken(req, res, next) {
    const token = req.headers['authorization'];

    if (!token) {
        return res.status(401).json({ error: 'Token não fornecido.' });
    }

    jwt.verify(token, 'seu_segredo_secreto', (err, decoded) => {
        if (err) {
            return res.status(401).json({ error: 'Token inválido.' });
        }
        req.user = decoded.user;
        next();
    });
}

server.post('/v1/login', (req, res) => {
    const { email, password } = req.body;

    const user = users.find(user => user.email === email);

    if (!user || user.password !== password) {
        return res.status(401).json({ error: 'Credenciais inválidas' });
    }


    const token = jwt.sign({ user }, 'seu_segredo_secreto', { expiresIn: '1h' });
    res.status(200).json({ message: 'Login bem-sucedido', token });
});

server.post('/v1/register', (req, res) => {
    const { email, password } = req.body;
    if (!email || email.indexOf('@') === -1) {
        return res.status(400).json({ error: 'Email inválido' });
    }

    const existingUser = users.find(user => user.email === email);
    if (existingUser) {
        return res.status(400).json({ error: 'Este email já está registrado.' });
    }

    const newUser = { email, password };
    users.push(newUser);
    res.status(201).json({ message: 'Usuário registrado com sucesso.' });
});

server.get('/v1/eventos', verificarToken, (req, res) => {

    res.json(eventos);
});

server.post('/v1/evento', verificarToken, (req, res) => {

    const { nome, data, descricao } = req.body;
    const novoEvento = { nome, data, descricao };
    eventos.push(novoEvento);
    res.status(201).json({ message: 'Evento adicionado com sucesso.' });
});

server.put('/v1/evento/:id', verificarToken, (req, res) => {

    const id = req.params.id;
    const { nome, data, descricao } = req.body;
    const eventoIndex = eventos.findIndex(evento => evento.id === id);
    if (eventoIndex === -1) {
        return res.status(404).json({ error: 'Evento não encontrado.' });
    }
    eventos[eventoIndex] = { id, nome, data, descricao };
    res.json({ message: 'Evento atualizado com sucesso.' });
});

server.delete('/v1/evento/:id', verificarToken, (req, res) => {

    const id = req.params.id;
    const eventoIndex = eventos.findIndex(evento => evento.id === id);
    if (eventoIndex === -1) {
        return res.status(404).json({ error: 'Evento não encontrado.' });
    }
    eventos.splice(eventoIndex, 1);
    res.json({ message: 'Evento excluído com sucesso.' });
});

server.listen(porta, () => {
    console.log(`Servidor rodando na porta ${porta}`);
});
