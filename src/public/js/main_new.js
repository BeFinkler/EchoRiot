const API_URL = '/api';

// Global variables
let currentUser = null;
let currentStats = null;

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
  checkUserStatus();
  setupEventListeners();
});

// Setup event listeners
function setupEventListeners() {
  const searchInput = document.getElementById('searchInput');
  const sortSelect = document.getElementById('sortSelect');

  if (searchInput) {
    searchInput.addEventListener('input', debounce(searchPlaylists, 300));
  }

  if (sortSelect) {
    sortSelect.addEventListener('change', loadPlaylists);
  }
}

// Check user login status
async function checkUserStatus() {
  const token = localStorage.getItem('token');
  const userStatusDiv = document.getElementById('userStatus');
  const userStatusText = document.getElementById('userStatusText');

  if (!token) {
    userStatusDiv.className = 'user-status logged-out';
    userStatusText.innerHTML = '❌ Você não está logado<br><small><a href="/login">Clique aqui para fazer login</a></small>';
    return;
  }

  try {
    // Decode token to get user info (simple decode, not secure but for display)
    const payload = JSON.parse(atob(token.split('.')[1]));
    currentUser = payload;

    userStatusDiv.className = 'user-status logged-in';
    userStatusText.innerHTML = `✅ Logado como: <strong>${payload.name || 'Usuário'}</strong><br><small><a href="#" onclick="logout()">Sair</a></small>`;

    // Load user data
    await loadStats();
    await loadPlaylists();
  } catch (err) {
    console.error('Erro ao verificar status:', err);
    localStorage.removeItem('token');
    checkUserStatus();
  }
}

// Logout function
function logout() {
  localStorage.removeItem('token');
  currentUser = null;
  currentStats = null;
  checkUserStatus();
  location.reload();
}

// Load user statistics
async function loadStats() {
  try {
    const token = localStorage.getItem('token');
    if (!token) return;

    const res = await fetch(`${API_URL}/playlists/stats`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });

    if (res.ok) {
      currentStats = await res.json();
      updateStatsDisplay();
    }
  } catch (err) {
    console.error('Erro ao carregar estatísticas:', err);
  }
}

// Update statistics display
function updateStatsDisplay() {
  const statsContainer = document.getElementById('statsContainer');
  if (!currentStats) {
    statsContainer.style.display = 'none';
    return;
  }

  statsContainer.style.display = 'grid';
  document.getElementById('totalPlaylists').textContent = currentStats.totalPlaylists;
  document.getElementById('totalSongs').textContent = currentStats.totalSongs;
  document.getElementById('recentPlaylists').textContent = currentStats.recentPlaylists;
}

// Search and filter playlists
function searchPlaylists() {
  loadPlaylists();
}

// Debounce function for search
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Load playlists with search and sort
async function loadPlaylists() {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      showLoginRequired();
      return;
    }

    const searchInput = document.getElementById('searchInput');
    const sortSelect = document.getElementById('sortSelect');

    const params = new URLSearchParams();
    if (searchInput && searchInput.value.trim()) {
      params.append('search', searchInput.value.trim());
    }
    if (sortSelect) {
      params.append('sort', sortSelect.value);
    }

    const res = await fetch(`${API_URL}/playlists?${params}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });

    if (!res.ok) {
      throw new Error('Falha ao carregar playlists');
    }

    const data = await res.json();
    renderPlaylists(data);
  } catch (err) {
    console.error('Erro ao carregar playlists:', err);
    showError('Erro ao carregar playlists');
  }
}

// Render playlists
function renderPlaylists(playlists) {
  const container = document.getElementById('playlistsContainer');

  if (!playlists || playlists.length === 0) {
    container.innerHTML = `
      <div class="text-center py-5">
        <div style="font-size: 3rem;">🎵</div>
        <h4 class="mt-3">Nenhuma playlist encontrada</h4>
        <p class="text-muted">Crie sua primeira playlist para começar!</p>
      </div>
    `;
    return;
  }

  container.innerHTML = playlists.map(p => `
    <div class="card mb-3">
      <div class="card-body">
        <div class="d-flex justify-content-between align-items-start mb-3">
          <div class="flex-grow-1">
            <h5 class="card-title mb-1">
              <span id="playlistName-${p._id}">${p.name}</span>
              <button onclick="editPlaylistName('${p._id}')" class="btn btn-sm btn-outline-primary ms-2" title="Editar nome">
                ✏️
              </button>
            </h5>
            <p class="card-text text-muted small mb-2">
              <span id="playlistDesc-${p._id}">${p.description || 'Sem descrição'}</span>
              <button onclick="editPlaylistDesc('${p._id}')" class="btn btn-sm btn-outline-primary ms-2" title="Editar descrição">
                ✏️
              </button>
            </p>
            <small class="text-muted">Criada em: ${new Date(p.createdAt).toLocaleDateString('pt-BR')}</small>
          </div>
          <button onclick="deletePlaylist('${p._id}')" class="btn btn-danger btn-sm" title="Deletar playlist">
            🗑️ Deletar
          </button>
        </div>

        <div class="mb-3">
          <strong>Músicas (${p.songs ? p.songs.length : 0}):</strong>
          <ul class="list-unstyled mt-2">
            ${p.songs && p.songs.length > 0 ? p.songs.map((song, index) => `
              <li class="d-flex justify-content-between align-items-center py-1 px-2 bg-light rounded mb-1">
                <span>${index + 1}. ${song.title} - ${song.artist}</span>
                <button onclick="deleteSong('${p._id}', ${index})" class="btn btn-outline-danger btn-sm" title="Remover música">
                  ❌
                </button>
              </li>
            `).join('') : '<li class="text-muted">Sem músicas ainda</li>'}
          </ul>
        </div>

        <div class="row gx-3 gy-2">
          <div class="col-md-6">
            <label for="songTitle-${p._id}" class="form-label fw-bold">Título da música</label>
            <div class="input-group input-group-sm">
              <span class="input-group-text">🎤</span>
              <input type="text" id="songTitle-${p._id}" placeholder="Ex: In the End" class="form-control" aria-label="Título da música">
            </div>
          </div>
          <div class="col-md-6">
            <label for="songArtist-${p._id}" class="form-label fw-bold">Artista</label>
            <div class="input-group input-group-sm">
              <span class="input-group-text">🎵</span>
              <input type="text" id="songArtist-${p._id}" placeholder="Ex: Linkin Park" class="form-control" aria-label="Artista da música">
            </div>
          </div>
        </div>
        <div class="mt-2">
          <button onclick="addSong('${p._id}')" class="btn btn-success btn-sm">➕ Adicionar Música</button>
        </div>
      </div>
    </div>
  `).join('');
}

// Show login required message
function showLoginRequired() {
  const container = document.getElementById('playlistsContainer');
  container.innerHTML = `
    <div class="text-center py-5">
      <div style="font-size: 3rem;">🔒</div>
      <h4 class="mt-3">Login Necessário</h4>
      <p class="text-muted">Faça login para acessar suas playlists</p>
      <a href="/login" class="btn btn-primary">Fazer Login</a>
    </div>
  `;
}

// Show error message
function showError(message) {
  const container = document.getElementById('playlistsContainer');
  container.innerHTML = `
    <div class="alert alert-danger text-center">
      <strong>Erro:</strong> ${message}
    </div>
  `;
}

// Edit playlist name inline
function editPlaylistName(playlistId) {
  const nameSpan = document.getElementById(`playlistName-${playlistId}`);
  const currentName = nameSpan.textContent;

  const input = document.createElement('input');
  input.type = 'text';
  input.value = currentName;
  input.className = 'form-control form-control-sm d-inline-block ms-2';
  input.style.width = '200px';

  const saveBtn = document.createElement('button');
  saveBtn.textContent = '💾';
  saveBtn.className = 'btn btn-sm btn-success ms-1';
  saveBtn.onclick = () => savePlaylistName(playlistId, input.value);

  const cancelBtn = document.createElement('button');
  cancelBtn.textContent = '❌';
  cancelBtn.className = 'btn btn-sm btn-secondary ms-1';
  cancelBtn.onclick = () => {
    nameSpan.innerHTML = currentName;
  };

  nameSpan.innerHTML = '';
  nameSpan.appendChild(input);
  nameSpan.appendChild(saveBtn);
  nameSpan.appendChild(cancelBtn);
  input.focus();
}

// Save playlist name
async function savePlaylistName(playlistId, newName) {
  if (!newName.trim()) {
    showToast('Nome não pode ser vazio', 'warning');
    return;
  }

  try {
    const token = localStorage.getItem('token');
    const res = await fetch(`${API_URL}/playlists/${playlistId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ name: newName.trim() })
    });

    if (!res.ok) {
      const data = await res.json();
      showToast(`Erro: ${data.msg || data.error}`, 'danger');
      return;
    }

    loadPlaylists();
    showToast('Nome da playlist atualizado!', 'success');
  } catch (err) {
    showToast(`Erro: ${err.message}`, 'danger');
  }
}

// Edit playlist description inline
function editPlaylistDesc(playlistId) {
  const descSpan = document.getElementById(`playlistDesc-${playlistId}`);
  const currentDesc = descSpan.textContent;

  const input = document.createElement('input');
  input.type = 'text';
  input.value = currentDesc === 'Sem descrição' ? '' : currentDesc;
  input.className = 'form-control form-control-sm d-inline-block ms-2';
  input.style.width = '250px';
  input.placeholder = 'Descrição da playlist';

  const saveBtn = document.createElement('button');
  saveBtn.textContent = '💾';
  saveBtn.className = 'btn btn-sm btn-success ms-1';
  saveBtn.onclick = () => savePlaylistDesc(playlistId, input.value);

  const cancelBtn = document.createElement('button');
  cancelBtn.textContent = '❌';
  cancelBtn.className = 'btn btn-sm btn-secondary ms-1';
  cancelBtn.onclick = () => {
    descSpan.innerHTML = currentDesc;
  };

  descSpan.innerHTML = '';
  descSpan.appendChild(input);
  descSpan.appendChild(saveBtn);
  descSpan.appendChild(cancelBtn);
  input.focus();
}

// Save playlist description
async function savePlaylistDesc(playlistId, newDesc) {
  try {
    const token = localStorage.getItem('token');
    const res = await fetch(`${API_URL}/playlists/${playlistId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ description: newDesc.trim() })
    });

    if (!res.ok) {
      const data = await res.json();
      showToast(`Erro: ${data.msg || data.error}`, 'danger');
      return;
    }

    loadPlaylists();
    showToast('Descrição da playlist atualizada!', 'success');
  } catch (err) {
    showToast(`Erro: ${err.message}`, 'danger');
  }
}

// Toast notification system
function showToast(message, type = 'info') {
  const toast = document.createElement('div');
  toast.className = `alert alert-${type === 'success' ? 'success' : type === 'danger' ? 'danger' : 'info'} position-fixed fade-in`;
  toast.style.cssText = 'top: 20px; right: 20px; z-index: 9999; min-width: 300px; box-shadow: 0 4px 12px rgba(0,0,0,0.15); border: none; border-radius: 12px;';
  toast.innerHTML = `
    <div class="d-flex align-items-center">
      <span class="me-2">${type === 'success' ? '✅' : type === 'danger' ? '❌' : 'ℹ️'}</span>
      <span>${message}</span>
      <button type="button" class="btn-close ms-auto" onclick="this.parentElement.parentElement.remove()"></button>
    </div>
  `;

  document.body.appendChild(toast);

  setTimeout(() => {
    if (toast.parentElement) {
      toast.remove();
    }
  }, 4000);
}

// Legacy functions for compatibility
async function register() {
  try {
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    if (!name || !email || !password) {
      showToast('Preencha todos os campos', 'warning');
      return;
    }

    const res = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password })
    });

    if (!res.ok) {
      const data = await res.json();
      showToast(`Erro: ${data.msg || data.error}`, 'danger');
      return;
    }

    showToast('Registrado com sucesso! Faça login agora.', 'success');
    setTimeout(() => window.location.href = '/login', 1500);
  } catch (err) {
    showToast(`Erro: ${err.message}`, 'danger');
  }
}

async function login() {
  try {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    if (!email || !password) {
      showToast('Preencha todos os campos', 'warning');
      return;
    }

    const res = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    if (!res.ok) {
      const data = await res.json();
      showToast(`Erro: ${data.msg || data.error}`, 'danger');
      return;
    }

    const data = await res.json();
    localStorage.setItem('token', data.token);
    showToast('Login realizado com sucesso!', 'success');
    setTimeout(() => window.location.href = '/', 1500);
  } catch (err) {
    showToast(`Erro: ${err.message}`, 'danger');
  }
}

async function createPlaylist() {
  try {
    const token = localStorage.getItem('token');

    if (!token) {
      showToast('Faça login primeiro', 'warning');
      setTimeout(() => window.location.href = '/login', 1500);
      return;
    }

    const name = document.getElementById('name').value;
    const description = document.getElementById('description').value;

    if (!name) {
      showToast('Digite um nome para a playlist', 'warning');
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
      showToast(`Erro: ${data.msg || data.error}`, 'danger');
      return;
    }

    document.getElementById('name').value = '';
    document.getElementById('description').value = '';
    loadPlaylists();
    loadStats();
    showToast('Playlist criada com sucesso!', 'success');
  } catch (err) {
    showToast(`Erro: ${err.message}`, 'danger');
  }
}

async function addSong(playlistId) {
  try {
    const token = localStorage.getItem('token');

    if (!token) {
      showToast('Faça login primeiro', 'warning');
      setTimeout(() => window.location.href = '/login', 1500);
      return;
    }

    const title = document.getElementById(`songTitle-${playlistId}`).value;
    const artist = document.getElementById(`songArtist-${playlistId}`).value;

    if (!title || !artist) {
      showToast('Preencha título e artista da música', 'warning');
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
      showToast(`Erro: ${data.msg || data.error}`, 'danger');
      return;
    }

    document.getElementById(`songTitle-${playlistId}`).value = '';
    document.getElementById(`songArtist-${playlistId}`).value = '';
    loadPlaylists();
    loadStats();
    showToast('Música adicionada com sucesso!', 'success');
  } catch (err) {
    showToast(`Erro: ${err.message}`, 'danger');
  }
}

async function deleteSong(playlistId, songIndex) {
  try {
    const token = localStorage.getItem('token');

    if (!token) {
      showToast('Faça login primeiro', 'warning');
      setTimeout(() => window.location.href = '/login', 1500);
      return;
    }

    if (!confirm('🗑️ Tem certeza que deseja remover esta música da playlist?')) {
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
      showToast(`Erro: ${data.msg || data.error}`, 'danger');
      return;
    }

    loadPlaylists();
    loadStats();
    showToast('Música removida com sucesso!', 'success');
  } catch (err) {
    showToast(`Erro: ${err.message}`, 'danger');
  }
}

async function deletePlaylist(playlistId) {
  try {
    const token = localStorage.getItem('token');

    if (!token) {
      showToast('Faça login primeiro', 'warning');
      setTimeout(() => window.location.href = '/login', 1500);
      return;
    }

    if (!confirm('⚠️ Tem certeza que deseja deletar esta playlist?\n\nEsta ação não pode ser desfeita e todas as músicas serão perdidas!')) {
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
      showToast(`Erro: ${data.msg || data.error}`, 'danger');
      return;
    }

    loadPlaylists();
    loadStats();
    showToast('Playlist deletada com sucesso!', 'success');
  } catch (err) {
    showToast(`Erro: ${err.message}`, 'danger');
  }
}