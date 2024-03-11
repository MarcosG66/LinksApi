import express from 'express';
import pg from 'pg';
import cors from 'cors'


const app = express()
const port = 3000
app.use(cors())
app.use(express.json());


app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})

//pg
const client = new pg.Client({
    host: 'ep-sweet-voice-a5ykkibv.us-east-2.aws.neon.tech',
    database: 'linksdb',
    user: 'MarcosG66',
    password: 'YR2V0WhnkpNd',
    ssl: true,
})

await client.connect()

//GET => MOSTRAR TODOS OS USUARIOS
app.get('/users', async (req, res) => {
    try {
        const data = await client.query('SELECT * FROM users;');
        res.send(data.rows);
    } catch (err) {
        console.error('Erro ao buscar usuários:', err);
        res.status(500).send('Erro ao buscar usuários');
    }
})

//GET => MOSTRAR USUARIO POR ID
app.get('/user/:id', async (req, res) => {
    const id = req.params.id;
    try {
        const result = await client.query('SELECT * FROM users WHERE id = $1', [id]);
        const user = result.rows[0]; // Obtém o primeiro usuário encontrado
        res.send(user)
    } catch (error) {
        console.error('Erro ao pegar usuario:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
})

//POST => ADICIONAR NOVO USUARIO
app.post('/user', async (req, res) => {
    try {
        const { name, username, email, password } = req.body;
        const values = [name, username, email, password];
        const query = 'INSERT INTO users (name, username, email, password) VALUES ($1, $2, $3, $4)';

        await client.query(query, values);

        res.status(201).json({ message: 'Dados inseridos com sucesso!' });
    } catch (error) {
        console.error('Erro ao inserir dados no banco de dados:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
})

//DELETE => EXCLUIR USUARIO
app.delete(`/user/:id`, async (req, res) => {
    const id = req.params.id;
    res.send('foi ó')
    try {
        await client.query('DELETE FROM users WHERE id = $1', [id]);
    } catch (error) {
        console.error('Erro ao excluir:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
})

// client.end()
