import { useState, useEffect } from 'react';

function App() {
  const [equipamentos, setEquipamentos] = useState([]);
  const [form, setForm] = useState({ nome: '', tipo: 'Monitor', data_aquisicao: '', status: 'Ativo' });

  const fetchEquipamentos = async () => {
    try {
      const response = await fetch('http://localhost:3000/equipamentos');
      const data = await response.json();
      if (Array.isArray(data)) {
        setEquipamentos(data);
      } else {
        console.error("O banco não retornou uma lista:", data);
        setEquipamentos([]);
      }
    } catch (error) {
      console.error("Erro na API, o backend está ligado?", error);
    }
  };

  useEffect(() => { fetchEquipamentos(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await fetch('http://localhost:3000/equipamentos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    });
    setForm({ nome: '', tipo: 'Monitor', data_aquisicao: '', status: 'Ativo' });
    fetchEquipamentos(); 
  };

  const handleDelete = async (id) => {
    await fetch(`http://localhost:3000/equipamentos/${id}`, { method: 'DELETE' });
    fetchEquipamentos();
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif', maxWidth: '900px', margin: '0 auto', color: 'white' }}>
      <h2>Gerenciamento de Ativos de TI</h2>
      
      <div style={{ background: '#333', padding: '20px', marginBottom: '20px', borderRadius: '8px' }}>
        <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <input required placeholder="Nome do Equipamento" value={form.nome} onChange={e => setForm({...form, nome: e.target.value})} style={{ padding: '8px' }}/>
          <select value={form.tipo} onChange={e => setForm({...form, tipo: e.target.value})} style={{ padding: '8px' }}>
            <option value="Monitor">Monitor</option>
            <option value="CPU">CPU</option>
            <option value="Teclado">Teclado</option>
          </select>
          <input required type="date" value={form.data_aquisicao} onChange={e => setForm({...form, data_aquisicao: e.target.value})} style={{ padding: '8px' }}/>
          <select value={form.status} onChange={e => setForm({...form, status: e.target.value})} style={{ padding: '8px' }}>
            <option value="Ativo">Ativo</option>
            <option value="Manutenção">Manutenção</option>
          </select>
          <button type="submit" style={{ padding: '8px 16px', background: '#0056b3', color: 'white', border: 'none', cursor: 'pointer', borderRadius: '4px' }}>Cadastrar</button>
        </form>
      </div>

      <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', background: '#222' }}>
        <thead>
          <tr style={{ background: '#444' }}>
            <th style={{ padding: '10px', border: '1px solid #555' }}>Nome</th>
            <th style={{ padding: '10px', border: '1px solid #555' }}>Tipo</th>
            <th style={{ padding: '10px', border: '1px solid #555' }}>Status</th>
            <th style={{ padding: '10px', border: '1px solid #555' }}>Ações</th>
          </tr>
        </thead>
        <tbody>
          {equipamentos.map(eq => (
            <tr key={eq.id}>
              <td style={{ padding: '10px', border: '1px solid #555' }}>{eq.nome}</td>
              <td style={{ padding: '10px', border: '1px solid #555' }}>{eq.tipo}</td>
              <td style={{ padding: '10px', border: '1px solid #555' }}>{eq.status}</td>
              <td style={{ padding: '10px', border: '1px solid #555' }}><button onClick={() => handleDelete(eq.id)} style={{ background: 'red', color: 'white', border: 'none', padding: '5px 10px', cursor: 'pointer', borderRadius: '4px' }}>Remover</button></td>
            </tr>
          ))}
        </tbody>
      </table>

      <div style={{ marginTop: '20px' }}>
        <a href="http://localhost:3000/exportar" target="_blank" rel="noreferrer">
          <button style={{ padding: '10px 20px', background: 'green', color: 'white', border: 'none', cursor: 'pointer', borderRadius: '4px' }}>Exportar Relatório</button>
        </a>
      </div>
    </div>
  );
}

export default App;