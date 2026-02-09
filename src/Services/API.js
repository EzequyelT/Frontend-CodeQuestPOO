const API_BASE_URL = 'http://localhost:3000/api';
 
// UTILIZADORES
export const fetchUtilizadores = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/utilizadores`);
    if (!response.ok) throw new Error('Erro ao buscar utilizadores');
    return await response.json();
  } catch (error) {
    console.error('Erro:', error);
    throw error;
  }
};
 
export const fetchUtilizadorById = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/utilizadores/${id}`);
    if (!response.ok) throw new Error('Utilizador não encontrado');
    return await response.json();
  } catch (error) {
    console.error('Erro:', error);
    throw error;
  }
};
 
export const criarUtilizador = async (email, hash_palavra_passe) => {
  try {
    const response = await fetch(`${API_BASE_URL}/utilizadores`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, hash_palavra_passe })
    });
    if (!response.ok) throw new Error('Erro ao criar utilizador');
    return await response.json();
  } catch (error) {
    console.error('Erro:', error);
    throw error;
  }
};
 
export const atualizarUtilizador = async (id, email, hash_palavra_passe) => {
  try {
    const response = await fetch(`${API_BASE_URL}/utilizadores/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, hash_palavra_passe })
    });
    if (!response.ok) throw new Error('Erro ao atualizar utilizador');
    return await response.json();
  } catch (error) {
    console.error('Erro:', error);
    throw error;
  }
};
 
export const eliminarUtilizador = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/utilizadores/${id}`, {
      method: 'DELETE'
    });
    if (!response.ok) throw new Error('Erro ao eliminar utilizador');
    return await response.json();
  } catch (error) {
    console.error('Erro:', error);
    throw error;
  }
};
 
// ALUNOS
export const fetchAlunos = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/alunos`);
    if (!response.ok) throw new Error('Erro ao buscar alunos');
    return await response.json();
  } catch (error) {
    console.error('Erro:', error);
    throw error;
  }
};
 
export const fetchAlunoById = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/alunos/${id}`);
    if (!response.ok) throw new Error('Aluno não encontrado');
    return await response.json();
  } catch (error) {
    console.error('Erro:', error);
    throw error;
  }
};
 
export const criarAluno = async (utilizador_id, ano, turma, escola) => {
  try {
    const response = await fetch(`${API_BASE_URL}/alunos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ utilizador_id, ano, turma, escola })
    });
    if (!response.ok) throw new Error('Erro ao criar aluno');
    return await response.json();
  } catch (error) {
    console.error('Erro:', error);
    throw error;
  }
};
 
export const atualizarAluno = async (id, ano, turma, escola) => {
  try {
    const response = await fetch(`${API_BASE_URL}/alunos/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ano, turma, escola })
    });
    if (!response.ok) throw new Error('Erro ao atualizar aluno');
    return await response.json();
  } catch (error) {
    console.error('Erro:', error);
    throw error;
  }
};
 
export const eliminarAluno = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/alunos/${id}`, {
      method: 'DELETE'
    });
    if (!response.ok) throw new Error('Erro ao eliminar aluno');
    return await response.json();
  } catch (error) {
    console.error('Erro:', error);
    throw error;
  }
};