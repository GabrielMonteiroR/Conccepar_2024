const express = require('express')
const server = express()
const porta = 5000

server.use(express.json())

const users = [];

server.post('/v1/login', (req, res) => {
    const { email, password } = req.body

    const user = users.find(user => user.email === email);

    if (!user || user.password !== password) {
        return res.status(401).json({ error: 'Credenciais inválidas' });
    }

    res.status(200).json({ message: 'Login bem-sucedido' });
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

server.listen(porta, () => {
    console.log(`Servidor rodando na porta ${porta}`)
})