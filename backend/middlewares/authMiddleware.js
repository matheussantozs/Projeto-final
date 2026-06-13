import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'troque-esta-chave-em-producao'

export function autenticar(req, res, next) {
  const authHeader = req.headers.authorization

  if (!authHeader) {
    return res.status(401).json({ erro: 'Token não enviado.' })
  }

  const [, token] = authHeader.split(' ')

  if (!token) {
    return res.status(401).json({ erro: 'Token inválido.' })
  }

  try {
    req.usuario = jwt.verify(token, JWT_SECRET)
    next()
  } catch {
    return res.status(401).json({ erro: 'Token expirado ou inválido.' })
  }
}

export function somenteAdmin(req, res, next) {
  if (req.usuario?.acesso !== 'ADMINISTRADOR') {
    return res.status(403).json({ erro: 'Acesso permitido somente para administradores.' })
  }

  next()
}
