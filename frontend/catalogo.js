import { apiFetch, logout, protegerPagina } from './auth.js'

const usuario = protegerPagina('COMUM')
const grid = document.getElementById('movie-grid')
const modal = document.getElementById('movie-modal')

if (usuario) {
  carregarFilmes()
}

document.getElementById('btn-logout').addEventListener('click', logout)
document.getElementById('modal-close').addEventListener('click', () => modal.close())

async function carregarFilmes() {
  const res = await apiFetch('/api/filmes')
  if (!res) return

  const filmes = await res.json()

  if (!filmes.length) {
    grid.innerHTML = '<p class="empty-state">Nenhum filme cadastrado ainda.</p>'
    return
  }

  grid.innerHTML = filmes.map(filme => criarCard(filme)).join('')

  document.querySelectorAll('.movie-card').forEach(card => {
    card.addEventListener('click', () => {
      const filme = filmes.find(item => item.id === Number(card.dataset.id))
      abrirModal(filme)
    })
  })
}

function criarCard(filme) {
  const capa = filme.capaUrl || 'https://placehold.co/320x460/0C447C/FFFFFF?text=Sem+Capa'

  return `
    <article class="movie-card" data-id="${filme.id}">
      <img src="${capa}" alt="Capa de ${filme.titulo}" />
      <div class="movie-info">
        <span>${filme.genero}</span>
        <h3>${filme.titulo}</h3>
        <p>${filme.ano} • ${filme.diretor}</p>
      </div>
    </article>
  `
}

function abrirModal(filme) {
  document.getElementById('modal-img').src = filme.capaUrl || 'https://placehold.co/320x460/0C447C/FFFFFF?text=Sem+Capa'
  document.getElementById('modal-title').textContent = filme.titulo
  document.getElementById('modal-meta').textContent = `${filme.ano} • ${filme.genero} • Direção: ${filme.diretor}`
  document.getElementById('modal-sinopse').textContent = filme.sinopse
  modal.showModal()
}
