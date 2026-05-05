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
    const description = document.getElementById('description').value;

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
      body: JSON.stringify({ name, description })
    });

    if (!res.ok) {
      const data = await res.json();
      alert(`Erro: ${data.msg || data.error}`);
      return;
    }

    document.getElementById('name').value = '';
    document.getElementById('description').value = '';
    loadPlaylists();
    alert('Playlist criada com sucesso!');
  } catch (err) {
    alert(`Erro: ${err.message}`);
  }
}

async function loadPlaylists() {
  try {
    const token = localStorage.getItem('token');

    if (!token) {
      // If not logged in, show empty or redirect to login
      document.getElementById('list').innerHTML = '<li class="list-group-item">Faça login para ver suas playlists</li>';
      return;
    }

    const res = await fetch(`${API_URL}/playlists`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!res.ok) {
      throw new Error('Falha ao carregar playlists');
    }

    const data = await res.json();
    const listEl = document.getElementById('list');

    if (!listEl) return;

    listEl.innerHTML = data.map(p => 
      `<li class="list-group-item">
        <div class="d-flex justify-content-between align-items-start">
          <div>
            <strong>${p.name}</strong>
            <br>
            <small>${p.description || 'Sem descrição'}</small>
            <br>
            <small class="text-muted">Criada em: ${new Date(p.createdAt).toLocaleDateString('pt-BR')}</small>
          </div>
          <button onclick="deletePlaylist('${p._id}')" class="btn btn-sm btn-danger">Deletar Playlist</button>
        </div>
        <br>
        <strong>Músicas:</strong>
        <ul>
          ${p.songs && p.songs.length > 0 ? p.songs.map((song, index) => 
            `<li class="d-flex justify-content-between align-items-center">
              ${song.title} - ${song.artist}
              <button onclick="deleteSong('${p._id}', ${index})" class="btn btn-sm btn-outline-danger ms-2">Remover</button>
            </li>`
          ).join('') : '<li>Sem músicas ainda</li>'}
        </ul>
        <div class="mt-2">
          <input type="text" id="songTitle-${p._id}" placeholder="Título da música" class="form-control form-control-sm d-inline-block" style="width: 200px;">
          <input type="text" id="songArtist-${p._id}" placeholder="Artista" class="form-control form-control-sm d-inline-block ms-2" style="width: 150px;">
          <button onclick="addSong('${p._id}')" class="btn btn-sm btn-success ms-2">Adicionar Música</button>
        </div>
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

async function addSong(playlistId) {
  try {
    const token = localStorage.getItem('token');

    if (!token) {
      alert('Faça login primeiro');
      window.location.href = '/login';
      return;
    }

    const title = document.getElementById(`songTitle-${playlistId}`).value;
    const artist = document.getElementById(`songArtist-${playlistId}`).value;

    if (!title || !artist) {
      alert('Preencha título e artista da música');
      return;
    }

    const res = await fetch(`${API_URL}/playlists/${playlistId}/songs`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ title, artist })
    });

    if (!res.ok) {
      const data = await res.json();
      alert(`Erro: ${data.msg || data.error}`);
      return;
    }

    document.getElementById(`songTitle-${playlistId}`).value = '';
    document.getElementById(`songArtist-${playlistId}`).value = '';
    loadPlaylists();
    alert('Música adicionada com sucesso!');
  } catch (err) {
    alert(`Erro: ${err.message}`);
  }
}

async function deleteSong(playlistId, songIndex) {
  try {
    const token = localStorage.getItem('token');

    if (!token) {
      alert('Faça login primeiro');
      window.location.href = '/login';
      return;
    }

    if (!confirm('Tem certeza que deseja remover esta música da playlist?')) {
      return;
    }

    const res = await fetch(`${API_URL}/playlists/${playlistId}/songs/${songIndex}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!res.ok) {
      const data = await res.json();
      alert(`Erro: ${data.msg || data.error}`);
      return;
    }

    loadPlaylists();
    alert('Música removida com sucesso!');
  } catch (err) {
    alert(`Erro: ${err.message}`);
  }
}

async function deletePlaylist(playlistId) {
  try {
    const token = localStorage.getItem('token');

    if (!token) {
      alert('Faça login primeiro');
      window.location.href = '/login';
      return;
    }

    if (!confirm('Tem certeza que deseja deletar esta playlist? Esta ação não pode ser desfeita.')) {
      return;
    }

    const res = await fetch(`${API_URL}/playlists/${playlistId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!res.ok) {
      const data = await res.json();
      alert(`Erro: ${data.msg || data.error}`);
      return;
    }

    loadPlaylists();
    alert('Playlist deletada com sucesso!');
  } catch (err) {
    alert(`Erro: ${err.message}`);
  }
}