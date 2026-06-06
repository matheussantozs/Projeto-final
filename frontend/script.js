// ─── Variáveis globais ────────────────────────────────────────────────────────
let email = '';
let senha = '';

let signup_nome  = '';
let signup_email = '';
let signup_senha = '';
let signup_tipo  = '';

// ─── Utilitários ──────────────────────────────────────────────────────────────

function switchTab(tab) {
  document.getElementById('view-login').classList.toggle('active', tab === 'login');
  document.getElementById('view-signup').classList.toggle('active', tab === 'signup');
  document.getElementById('tab-login').classList.toggle('active', tab === 'login');
  document.getElementById('tab-signup').classList.toggle('active', tab === 'signup');
  document.getElementById('tab-login').setAttribute('aria-selected', tab === 'login');
  document.getElementById('tab-signup').setAttribute('aria-selected', tab === 'signup');
  document.getElementById('debug-panel').classList.remove('visible');
}

function togglePw(inputId, btn) {
  const inp = document.getElementById(inputId);
  const isHidden = inp.type === 'password';
  inp.type = isHidden ? 'text' : 'password';
  btn.querySelector('svg').innerHTML = isHidden
    ? '<path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/>'
    : '<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>';
}

function showToast(msg, type = 'success') {
  const toast = document.getElementById('toast');
  const icon  = document.getElementById('toast-icon');
  document.getElementById('toast-msg').textContent = msg;
  toast.className = 'toast ' + type;
  icon.innerHTML = type === 'success'
    ? '<polyline points="20 6 9 17 4 12"/>'
    : '<circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>';
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 3500);
}

function setErr(id, show) {
  document.getElementById(id).classList.toggle('visible', show);
}

function setInputErr(id, hasErr) {
  document.getElementById(id).classList.toggle('error', hasErr);
}

function isEmailValid(v) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());
}

// ─── Login ────────────────────────────────────────────────────────────────────

async function handleLogin(e) {
  e.preventDefault();
  const emailVal = document.getElementById('login-email').value.trim();
  const senhaVal = document.getElementById('login-senha').value;

  let valid = true;

  if (!isEmailValid(emailVal)) {
    setErr('err-login-email', true); setInputErr('login-email', true); valid = false;
  } else {
    setErr('err-login-email', false); setInputErr('login-email', false);
  }

  if (!senhaVal) {
    setErr('err-login-senha', true); setInputErr('login-senha', true); valid = false;
  } else {
    setErr('err-login-senha', false); setInputErr('login-senha', false);
  }

  if (!valid) return;

  // Armazenando nas variáveis globais
  email = emailVal;
  senha = senhaVal;

  // Debug panel
  const dbg = document.getElementById('debug-panel');
  document.getElementById('dbg-content').innerHTML =
    `<p>email: <span class="val">"${email}"</span></p>` +
    `<p>senha: <span class="val">"${senha}"</span></p>`;
  dbg.classList.add('visible');

  // Enviando para o servidor
  try {
    const res = await fetch('/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, senha })
    });

    const data = await res.json();

    if (res.ok) {
      showToast('Login realizado com sucesso!', 'success');
      // window.location.href = '/dashboard.html';
    } else {
      showToast(data.erro || 'Email ou senha incorretos.', 'error-t');
    }
  } catch (err) {
    showToast('Erro de conexão com o servidor.', 'error-t');
    console.error(err);
  }
}

// ─── Signup ───────────────────────────────────────────────────────────────────

async function handleSignup(e) {
  e.preventDefault();
  const nomeVal  = document.getElementById('signup-nome').value.trim();
  const emailVal = document.getElementById('signup-email').value.trim();
  const senhaVal = document.getElementById('signup-senha').value;
  const tipoVal  = document.querySelector('input[name="tipo"]:checked')?.value || 'COMUM';

  let valid = true;

  if (!nomeVal) {
    setErr('err-signup-nome', true); setInputErr('signup-nome', true); valid = false;
  } else {
    setErr('err-signup-nome', false); setInputErr('signup-nome', false);
  }

  if (!isEmailValid(emailVal)) {
    setErr('err-signup-email', true); setInputErr('signup-email', true); valid = false;
  } else {
    setErr('err-signup-email', false); setInputErr('signup-email', false);
  }

  if (senhaVal.length < 6) {
    setErr('err-signup-senha', true); setInputErr('signup-senha', true); valid = false;
  } else {
    setErr('err-signup-senha', false); setInputErr('signup-senha', false);
  }

  if (!valid) return;

  // Armazenando nas variáveis globais
  signup_nome  = nomeVal;
  signup_email = emailVal;
  signup_senha = senhaVal;
  signup_tipo  = tipoVal;

  // Debug panel
  const dbg = document.getElementById('debug-panel');
  document.getElementById('dbg-content').innerHTML =
    `<p>signup_nome:  <span class="val">"${signup_nome}"</span></p>` +
    `<p>signup_email: <span class="val">"${signup_email}"</span></p>` +
    `<p>signup_senha: <span class="val">"${signup_senha}"</span></p>` +
    `<p>signup_tipo:  <span class="val">"${signup_tipo}"</span></p>`;
  dbg.classList.add('visible');

  // Enviando para o servidor
  try {
    const res = await fetch('/cadastrar', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: signup_email,
        nome:  signup_nome,
        senha: signup_senha,
        tipo:  signup_tipo
      })
    });

    const data = await res.json();

    if (res.ok) {
      showToast('Conta criada com sucesso!', 'success');
    } else {
      showToast(data.erro || 'Erro ao cadastrar.', 'error-t');
    }
  } catch (err) {
    showToast('Erro de conexão com o servidor.', 'error-t');
    console.error(err);
  }
}

// ─── Expõe funções para o HTML (necessário com type="module") ─────────────────
window.handleLogin  = handleLogin;
window.handleSignup = handleSignup;
window.switchTab    = switchTab;
window.togglePw     = togglePw;