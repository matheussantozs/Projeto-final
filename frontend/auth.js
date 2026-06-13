export function getToken() {
  return localStorage.getItem('token')
}

export function getUsuario() {
  const usuario = localStorage.getItem('usuario')
  return usuario ? JSON.parse(usuario) : null
}

export function logout() {
  localStorage.removeItem('token')
  localStorage.removeItem('usuario')
  window.location.href = '/index.html'
}

export function protegerPagina(acessoNecessario = null) {
  const token = getToken()
  const usuario = getUsuario()

  if (!token || !usuario) {
    window.location.href = '/index.html'
    return null
  }

  if (acessoNecessario && usuario.acesso !== acessoNecessario) {
    window.location.href = usuario.acesso === 'ADMINISTRADOR' ? '/admin.html' : '/catalogo.html'
    return null
  }

  return usuario
}

export async function apiFetch(url, options = {}) {
  const token = getToken()

  const headers = {
    ...(options.headers || {}),
    Authorization: `Bearer ${token}`
  }

  if (!(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json'
  }

  const res = await fetch(url, { ...options, headers })

  if (res.status === 401) {
    logout()
    return
  }

  return res
}
