import { apiFetch, logout, protegerPagina } from './auth.js'

const usuario = protegerPagina('ADMINISTRADOR')
const form = document.getElementById('form-filme')
const tbody = document.getElementById('filmes-tbody')
const mensagem = document.getElementById('form-message')
let filmes = []

if (usuario) {
  carregarFilmes()
}

document.getElementById('btn-logout').addEventListener('click', logout)
document.getElementById('btn-recarregar').addEventListener('click', carregarFilmes)
document.getElementById('btn-cancelar').addEventListener('click', limparFormulario)
form.addEventListener('submit', salvarFilme)

async function carregarFilmes() {
  const res = await apiFetch('/api/filmes')
  if (!res) return

  filmes = await res.json()
  renderizarTabela()
}

function renderizarTabela() {
  if (!filmes.length) {
    tbody.innerHTML = '<tr><td colspan="5">Nenhum filme cadastrado.</td></tr>'
    return
  }

  tbody.innerHTML = filmes.map(filme => `
    <tr>
      <td><img class="thumb" src="${filme.capaUrl || 'https://placehold.co/80x110/0C447C/FFFFFF?text=Capa'}" alt="Capa de ${filme.titulo}" /></td>
      <td><strong>${filme.titulo}</strong><small>${filme.diretor}</small></td>
      <td>${filme.ano}</td>
      <td>${filme.genero}</td>
      <td class="actions">
        <button class="btn-secondary" data-action="editar" data-id="${filme.id}">Editar</button>
        <button class="btn-danger" data-action="deletar" data-id="${filme.id}">Deletar</button>
      </td>
    </tr>
  `).join('')

  tbody.querySelectorAll('button').forEach(button => {
    button.addEventListener('click', () => {
      const id = Number(button.dataset.id)
      button.dataset.action === 'editar' ? preencherFormulario(id) : deletarFilme(id)
    })
  })
}

async function salvarFilme(event) {
  event.preventDefault()

  const id = document.getElementById('filme-id').value
  const formData = new FormData()
  formData.append('titulo', document.getElementById('titulo').value.trim())
  formData.append('ano', document.getElementById('ano').value)
  formData.append('diretor', document.getElementById('diretor').value.trim())
  formData.append('genero', document.getElementById('genero').value.trim())
  formData.append('sinopse', document.getElementById('sinopse').value.trim())

  const capa = document.getElementById('capa').files[0]
  if (capa) formData.append('capa', capa)

  const url = id ? `/api/filmes/${id}` : '/api/filmes'
  const method = id ? 'PUT' : 'POST'

  const res = await apiFetch(url, { method, body: formData })
  if (!res) return

  const data = await res.json()

  if (!res.ok) {
    mensagem.textContent = data.erro || 'Erro ao salvar filme.'
    mensagem.className = 'form-message error-text'
    return
  }

  mensagem.textContent = data.mensagem
  mensagem.className = 'form-message success-text'
  limparFormulario()
  await carregarFilmes()
}

function preencherFormulario(id) {
  const filme = filmes.find(item => item.id === id)
  if (!filme) return

  document.getElementById('form-title').textContent = 'Editar filme'
  document.getElementById('filme-id').value = filme.id
  document.getElementById('titulo').value = filme.titulo
  document.getElementById('ano').value = filme.ano
  document.getElementById('diretor').value = filme.diretor
  document.getElementById('genero').value = filme.genero
  document.getElementById('sinopse').value = filme.sinopse
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

async function deletarFilme(id) {
  const confirmar = confirm('Deseja deletar este filme?')
  if (!confirmar) return

  const res = await apiFetch(`/api/filmes/${id}`, { method: 'DELETE' })
  if (!res) return

  await carregarFilmes()
}

function limparFormulario() {
  document.getElementById('form-title').textContent = 'Cadastrar filme'
  form.reset()
  document.getElementById('filme-id').value = ''
}
