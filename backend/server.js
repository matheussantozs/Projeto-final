const express = require('express')
const app = express()
const PORT = 3000

app.get('/', (req, res) => {
    res.send('Servidor OK')
})

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});