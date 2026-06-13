import crypto from 'crypto'
import path from 'path'
import { minioClient, MINIO_BUCKET, MINIO_PUBLIC_URL } from '../config/minio.js'

function criarPoliticaLeituraPublica() {
  return JSON.stringify({
    Version: '2012-10-17',
    Statement: [
      {
        Effect: 'Allow',
        Principal: { AWS: ['*'] },
        Action: ['s3:GetObject'],
        Resource: [`arn:aws:s3:::${MINIO_BUCKET}/*`]
      }
    ]
  })
}

export async function ensureBucket() {
  const exists = await minioClient.bucketExists(MINIO_BUCKET)

  if (!exists) {
    await minioClient.makeBucket(MINIO_BUCKET)
  }

  // As capas são arquivos públicos do catálogo. Essa política permite que
  // o navegador faça GET diretamente em http://localhost:9000/... .
  await minioClient.setBucketPolicy(
    MINIO_BUCKET,
    criarPoliticaLeituraPublica()
  )
}

export async function uploadCapa(file) {
  if (!file) return null

  await ensureBucket()

  const extensao = path.extname(file.originalname || '').toLowerCase() || '.jpg'
  const nomeArquivo = `${crypto.randomUUID()}${extensao}`

  await minioClient.putObject(
    MINIO_BUCKET,
    nomeArquivo,
    file.buffer,
    file.size,
    { 'Content-Type': file.mimetype }
  )

  return `${MINIO_PUBLIC_URL}/${MINIO_BUCKET}/${nomeArquivo}`
}