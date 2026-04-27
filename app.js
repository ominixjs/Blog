import express from "express";
import ejs from "ejs";

//====================
const app = express();
//======= Renderizador =======
app.set("view engine", "ejs");
//========= Decodificação da URL ===============
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
//======= Arquivos estativos =====
app.use(express.static("public"));

app.get("/myblog", (req, res) => {
  res.send("Olá");
});

export default app;
