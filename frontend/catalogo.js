import { apiFetch, logout, protegerPagina } from './auth.js'

const PLACEHOLDER_CAPA = 'https://placehold.co/320x460/0C447C/FFFFFF?text=Sem+Capa'

const usuario = protegerPagina('COMUM')
const grid = document.getElementById('movie-grid')
const modal = document.getElementById('movie-modal')
const modalFavorite = document.getElementById('modal-favorite')
const status = document.getElementById('catalog-status')
const toast = document.getElementById('catalog-toast')

let filmes = []
let favoritos = new Set()
let visualizacaoAtual = 'todos'
let filmeAbertoId = null
let toastTimer = null

if (usuario) {
  carregarCatalogo()
}

document.getElementById('btn-logout').addEventListener('click', logout)
document.getElementById('modal-close').addEventListener('click', () => modal.close())
modalFavorite.addEventListener('click', () => alternarFavorito(filmeAbertoId))

document.querySelectorAll('[data-view]').forEach(button => {
  button.addEventListener('click', () => {
    visualizacaoAtual = button.dataset.view
    renderizarCatalogo()
  })
})

grid.addEventListener('click', async (event) => {
  const favoriteButton = event.target.closest('[data-favorite-id]')

  if (favoriteButton) {
    event.stopPropagation()
    await alternarFavorito(Number(favoriteButton.dataset.favoriteId))
    return
  }

  const card = event.target.closest('.movie-card')
  if (card) abrirModal(Number(card.dataset.id))
})

grid.addEventListener('keydown', (event) => {
  if (!['Enter', ' '].includes(event.key) || event.target.closest('[data-favorite-id]')) return

  const card = event.target.closest('.movie-card')
  if (!card) return

  event.preventDefault()
  abrirModal(Number(card.dataset.id))
})

modal.addEventListener('close', () => {
  filmeAbertoId = null
})

modal.addEventListener('click', (event) => {
  if (event.target !== modal) return

  const rect = modal.getBoundingClientRect()
  const clicouDentro = event.clientX >= rect.left && event.clientX <= rect.right &&
    event.clientY >= rect.top && event.clientY <= rect.bottom

  if (!clicouDentro) modal.close()
})

async function carregarCatalogo() {
  status.textContent = 'Carregando catálogo e favoritos...'

  try {
    const [resFilmes, resFavoritos] = await Promise.all([
      apiFetch('/api/filmes'),
      apiFetch('/api/favoritos')
    ])

    if (!resFilmes || !resFavoritos) return

    const [dadosFilmes, dadosFavoritos] = await Promise.all([
      resFilmes.json(),
      resFavoritos.json()
    ])

    if (!resFilmes.ok) {
      throw new Error(dadosFilmes.erro || 'Não foi possível carregar os filmes.')
    }

    if (!resFavoritos.ok) {
      throw new Error(dadosFavoritos.erro || 'Não foi possível carregar os favoritos.')
    }

    filmes = dadosFilmes
    favoritos = new Set(dadosFavoritos.map(filme => Number(filme.id)))
    status.textContent = ''
    renderizarCatalogo()
  } catch (error) {
    console.error(error)
    status.textContent = error.message
    grid.classList.add('is-empty')
    grid.innerHTML = criarEstadoVazio('Erro ao carregar o catálogo', 'Verifique se o servidor está funcionando e tente novamente.')
  }
}

function renderizarCatalogo() {
  const somenteFavoritos = visualizacaoAtual === 'favoritos'
  const filmesVisiveis = somenteFavoritos
    ? filmes.filter(filme => favoritos.has(Number(filme.id)))
    : filmes

  document.getElementById('count-todos').textContent = filmes.length
  document.getElementById('count-favoritos').textContent = favoritos.size
  document.getElementById('catalog-title').textContent = somenteFavoritos ? 'Meus favoritos' : 'Todos os filmes'
  document.getElementById('catalog-description').textContent = somenteFavoritos
    ? 'Filmes que você marcou com a estrela.'
    : 'Explore todos os filmes cadastrados.'

  document.querySelectorAll('[data-view]').forEach(button => {
    const ativo = button.dataset.view === visualizacaoAtual
    button.classList.toggle('active', ativo)
    button.setAttribute('aria-selected', String(ativo))
  })

  if (!filmesVisiveis.length) {
    grid.classList.add('is-empty')
    grid.innerHTML = somenteFavoritos
      ? criarEstadoVazio('Nenhum filme favorito', 'Clique na estrela de um filme para adicioná-lo a esta área.')
      : criarEstadoVazio('Nenhum filme cadastrado', 'Os filmes adicionados pelo administrador aparecerão aqui.')
    return
  }

  grid.classList.remove('is-empty')
  grid.innerHTML = filmesVisiveis.map(criarCard).join('')

  grid.querySelectorAll('img').forEach(image => {
    image.addEventListener('error', () => {
      image.src = PLACEHOLDER_CAPA
    }, { once: true })
  })
}

function criarCard(filme) {
  const filmeId = Number(filme.id)
  const estaFavorito = favoritos.has(filmeId)
  const capa = filme.capaUrl || PLACEHOLDER_CAPA
  const acao = estaFavorito ? 'Remover dos favoritos' : 'Adicionar aos favoritos'

  return `
    <article class="movie-card" data-id="${filmeId}" tabindex="0" role="button" aria-label="Ver detalhes de ${escapeHtml(filme.titulo)}">
      <button
        class="favorite-button ${estaFavorito ? 'is-favorite' : ''}"
        type="button"
        data-favorite-id="${filmeId}"
        aria-label="${acao}: ${escapeHtml(filme.titulo)}"
        aria-pressed="${estaFavorito}"
        title="${acao}"
      >${estaFavorito ? '★' : '☆'}</button>
      <img src="${escapeHtml(capa)}" alt="Capa de ${escapeHtml(filme.titulo)}" />
      <div class="movie-info">
        <span>${escapeHtml(filme.genero)}</span>
        <h3>${escapeHtml(filme.titulo)}</h3>
        <p>${escapeHtml(filme.ano)} • ${escapeHtml(filme.diretor)}</p>
      </div>
    </article>
  `
}

function abrirModal(filmeId) {
  const filme = filmes.find(item => Number(item.id) === filmeId)
  if (!filme) return

  filmeAbertoId = filmeId

  const modalImg = document.getElementById('modal-img')
  modalImg.src = filme.capaUrl || PLACEHOLDER_CAPA
  modalImg.alt = `Capa de ${filme.titulo}`
  modalImg.onerror = () => {
    modalImg.src = PLACEHOLDER_CAPA
    modalImg.onerror = null
  }

  document.getElementById('modal-title').textContent = filme.titulo
  document.getElementById('modal-meta').textContent = `${filme.ano} • ${filme.genero} • Direção: ${filme.diretor}`
  document.getElementById('modal-sinopse').textContent = filme.sinopse
  atualizarBotaoFavoritoModal()

  if (!modal.open) modal.showModal()
}

function atualizarBotaoFavoritoModal() {
  if (!filmeAbertoId) return

  modalFavorite.disabled = false
  const estaFavorito = favoritos.has(filmeAbertoId)
  modalFavorite.classList.toggle('is-favorite', estaFavorito)
  modalFavorite.setAttribute('aria-pressed', String(estaFavorito))
  modalFavorite.querySelector('.favorite-symbol').textContent = estaFavorito ? '★' : '☆'
  document.getElementById('modal-favorite-text').textContent = estaFavorito
    ? 'Remover dos favoritos'
    : 'Adicionar aos favoritos'
}

async function alternarFavorito(filmeId) {
  if (!filmeId) return

  const estavaFavorito = favoritos.has(filmeId)
  definirBotoesFavoritoDesabilitados(filmeId, true)

  try {
    const res = await apiFetch(`/api/favoritos/${filmeId}`, {
      method: estavaFavorito ? 'DELETE' : 'POST'
    })

    if (!res) return

    const data = await res.json()
    if (!res.ok) throw new Error(data.erro || 'Não foi possível atualizar os favoritos.')

    if (estavaFavorito) {
      favoritos.delete(filmeId)
    } else {
      favoritos.add(filmeId)
    }

    renderizarCatalogo()
    if (filmeAbertoId === filmeId) atualizarBotaoFavoritoModal()
    mostrarToast(data.mensagem)
  } catch (error) {
    console.error(error)
    mostrarToast(error.message, true)
    definirBotoesFavoritoDesabilitados(filmeId, false)
  }
}

function definirBotoesFavoritoDesabilitados(filmeId, desabilitado) {
  document.querySelectorAll(`[data-favorite-id="${filmeId}"]`).forEach(button => {
    button.disabled = desabilitado
  })

  if (filmeAbertoId === filmeId) modalFavorite.disabled = desabilitado
}

function criarEstadoVazio(titulo, descricao) {
  return `<div class="empty-state"><strong>${escapeHtml(titulo)}</strong>${escapeHtml(descricao)}</div>`
}

function mostrarToast(mensagem, erro = false) {
  clearTimeout(toastTimer)
  toast.textContent = mensagem
  toast.classList.toggle('error', erro)
  toast.classList.add('show')
  toastTimer = setTimeout(() => toast.classList.remove('show'), 3000)
}

function escapeHtml(valor) {
  return String(valor ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;')
}
