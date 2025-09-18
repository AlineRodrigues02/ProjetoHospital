const express = require("express");
const cors = require("cors");
const relatorioRoutes = require("./src/routes/relatorio");

const app = express();
const PORT = 4000;

app.use(cors());
app.use(express.json());

// Rotas
app.use("/relatorio", relatorioRoutes);

app.listen(PORT, () => {
  console.log(`✅ Servidor rodando em http://localhost:${PORT}`);
});
