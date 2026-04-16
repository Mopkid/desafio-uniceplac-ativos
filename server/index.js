require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const fs = require('fs');

const app = express();
app.use(cors());
app.use(express.json());

const pool = new Pool({
  connectionString: "postgresql://postgres.aegqxdgmromqjywzqmsv:uniceplac2026@aws-0-sa-east-1.pooler.supabase.com:6543/postgres",
  ssl: { rejectUnauthorized: false }
});

// 1. Criar Equipamento
app.post('/equipamentos', async (req, res) => {
  const { nome, tipo, data_aquisicao, status } = req.body;
  if (!nome || !tipo || !data_aquisicao || !status) {
    return res.status(400).json({ erro: 'Campos obrigatórios ausentes.' });
  }
  try {
    const result = await pool.query(
      'INSERT INTO equipamentos (nome, tipo, data_aquisicao, status) VALUES ($1, $2, $3, $4) RETURNING *',
      [nome, tipo, data_aquisicao, status]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao cadastrar.' });
  }
});

// 2. Ler e Filtrar Equipamentos
app.get('/equipamentos', async (req, res) => {
  const { tipo, status } = req.query;
  try {
    let query = 'SELECT * FROM equipamentos WHERE 1=1';
    const values = [];
    let count = 1;

    if (tipo) {
      query += ` AND tipo = $${count}`;
      values.push(tipo);
      count++;
    }
    if (status) {
      query += ` AND status = $${count}`;
      values.push(status);
      count++;
    }

    const result = await pool.query(query, values);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao buscar dados.' });
  }
});

// 3. Atualizar
app.put('/equipamentos/:id', async (req, res) => {
  const { id } = req.params;
  const { nome, tipo, data_aquisicao, status } = req.body;
  try {
    const result = await pool.query(
      'UPDATE equipamentos SET nome = $1, tipo = $2, data_aquisicao = $3, status = $4 WHERE id = $5 RETURNING *',
      [nome, tipo, data_aquisicao, status, id]
    );
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao atualizar.' });
  }
});

// 4. Deletar
app.delete('/equipamentos/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM equipamentos WHERE id = $1', [id]);
    res.json({ mensagem: 'Removido com sucesso.' });
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao deletar.' });
  }
});

// Exportar JSON
app.get('/exportar', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM equipamentos');
    const data = JSON.stringify(result.rows, null, 2);
    fs.writeFileSync('relatorio_ativos.json', data);
    res.download('relatorio_ativos.json');
  } catch (error) {
    console.error("ERRO DETALHADO DO BANCO:", error); // <-- Adicionamos isso para ver o erro
    res.status(500).json({ erro: 'Erro ao exportar.' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`API rodando na porta ${PORT}`));