function switchTab(tab) {
  document.getElementById('view-login').classList.toggle('active', tab === 'login')
  document.getElementById('view-signup').classList.toggle('active', tab === 'signup')
  document.getElementById('tab-login').classList.toggle('active', tab === 'login')
  document.getElementById('tab-signup').classList.toggle('active', tab === 'signup')
  document.getElementById('tab-login').setAttribute('aria-selected', tab === 'login')
  document.getElementById('tab-signup').setAttribute('aria-selected', tab === 'signup')
}

function togglePw(inputId, btn) {
  const input = document.getElementById(inputId)
  const isHidden = input.type === 'password'
  input.type = isHidden ? 'text' : 'password'
  btn.querySelector('svg').innerHTML = isHidden
    ? '<path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/>'
    : '<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>'
}

function showToast(msg, type = 'success') {
  const toast = document.getElementById('toast')
  const icon = document.getElementById('toast-icon')
  document.getElementById('toast-msg').textContent = msg
  toast.className = `toast ${type}`
  icon.innerHTML = type === 'success'
    ? '<polyline points="20 6 9 17 4 12"/>'
    : '<circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>'
  toast.classList.add('show')
  setTimeout(() => toast.classList.remove('show'), 3500)
}

function setErr(id, show) {
  document.getElementById(id).classList.toggle('visible', show)
}

function setInputErr(id, hasErr) {
  document.getElementById(id).classList.toggle('error', hasErr)
}

function isEmailValid(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())
}

async function handleLogin(event) {
  event.preventDefault()

  const email = document.getElementById('login-email').value.trim()
  const senha = document.getElementById('login-senha').value
  let valid = true

  if (!isEmailValid(email)) {
    setErr('err-login-email', true)
    setInputErr('login-email', true)
    valid = false
  } else {
    setErr('err-login-email', false)
    setInputErr('login-email', false)
  }

  if (!senha) {
    setErr('err-login-senha', true)
    setInputErr('login-senha', true)
    valid = false
  } else {
    setErr('err-login-senha', false)
    setInputErr('login-senha', false)
  }

  if (!valid) return

  try {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, senha })
    })

    const data = await res.json()

    if (!res.ok) {
      showToast(data.erro || 'Email ou senha incorretos.', 'error-t')
      return
    }

    localStorage.setItem('token', data.token)
    localStorage.setItem('usuario', JSON.stringify(data.usuario))

    if (data.usuario.acesso === 'ADMINISTRADOR') {
      window.location.href = '/admin.html'
    } else {
      window.location.href = '/catalogo.html'
    }
  } catch (err) {
    showToast('Erro de conexão com o servidor.', 'error-t')
    console.error(err)
  }
}

async function handleSignup(event) {
  event.preventDefault()

  const nome = document.getElementById('signup-nome').value.trim()
  const email = document.getElementById('signup-email').value.trim()
  const senha = document.getElementById('signup-senha').value
  const acesso = document.querySelector('input[name="tipo"]:checked')?.value || 'COMUM'
  let valid = true

  if (!nome) {
    setErr('err-signup-nome', true)
    setInputErr('signup-nome', true)
    valid = false
  } else {
    setErr('err-signup-nome', false)
    setInputErr('signup-nome', false)
  }

  if (!isEmailValid(email)) {
    setErr('err-signup-email', true)
    setInputErr('signup-email', true)
    valid = false
  } else {
    setErr('err-signup-email', false)
    setInputErr('signup-email', false)
  }

  if (senha.length < 6) {
    setErr('err-signup-senha', true)
    setInputErr('signup-senha', true)
    valid = false
  } else {
    setErr('err-signup-senha', false)
    setInputErr('signup-senha', false)
  }

  if (!valid) return

  try {
    const res = await fetch('/api/auth/cadastrar', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nome, email, senha, acesso })
    })

    const data = await res.json()

    if (!res.ok) {
      showToast(data.erro || 'Erro ao cadastrar.', 'error-t')
      return
    }

    showToast('Conta criada com sucesso. Faça login para continuar.', 'success')
    switchTab('login')
  } catch (err) {
    showToast('Erro de conexão com o servidor.', 'error-t')
    console.error(err)
  }
}

window.handleLogin = handleLogin
window.handleSignup = handleSignup
window.switchTab = switchTab
window.togglePw = togglePw
