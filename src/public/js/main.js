const API_URL = '/api';

async function register() {
  try {
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    if (!name || !email || !password) {
      alert('Preencha todos os campos');
      return;
    }

    const res = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password })
    });

    if (!res.ok) {
      const data = await res.json();
      alert(`Erro: ${data.msg || data.error}`);
      return;
    }

    alert('Registrado com sucesso! Faça login agora.');
    window.location.href = '/login';
  } catch (err) {
    alert(`Erro: ${err.message}`);
  }
}

async function login() {
  try {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    if (!email || !password) {
      alert('Preencha todos os campos');
      return;
    }

    const res = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    if (!res.ok) {
      const data = await res.json();
      alert(`Erro: ${data.msg || data.error}`);
      return;
    }

    const data = await res.json();
    localStorage.setItem('token', data.token);
    alert('Login realizado com sucesso!');
    window.location.href = '/';
  } catch (err) {
    alert(`Erro: ${err.message}`);
  }
}

async function createPlaylist() {
  try {
    const token = localStorage.getItem('token');

    if (!token) {
      alert('Faça login primeiro');
      window.location.href = '/login';
      return;
    }

    const name = document.getElementById('name').value;

    if (!name) {
      alert('Digite um nome para a playlist');
      return;
    }

    const res = await fetch(`${API_URL}/playlists`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ name })
    });

    if (!res.ok) {
      const data = await res.json();
      alert(`Erro: ${data.msg || data.error}`);
      return;
    }

    document.getElementById('name').value = '';
    loadPlaylists();
    alert('Playlist criada com sucesso!');
  } catch (err) {
    alert(`Erro: ${err.message}`);
  }
}

async function loadPlaylists() {
  try {
    const res = await fetch(`${API_URL}/playlists`);

    if (!res.ok) {
      throw new Error('Falha ao carregar playlists');
    }

    const data = await res.json();
    const listEl = document.getElementById('list');

    if (!listEl) return;

    listEl.innerHTML = data.map(p => 
      `<li class="list-group-item">
        <strong>${p.name}</strong>
        <br>
        <small>${p.description || 'Sem descrição'}</small>
        <br>
        <small class="text-muted">Criada em: ${new Date(p.createdAt).toLocaleDateString('pt-BR')}</small>
      </li>`
    ).join('');
  } catch (err) {
    console.error('Erro ao carregar playlists:', err);
  }
}

// Carrega playlists ao abrir a página
document.addEventListener('DOMContentLoaded', () => {
  const listEl = document.getElementById('list');
  if (listEl) {
    loadPlaylists();
  }
});