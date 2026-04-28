import express from "express";
import ejs from "ejs";
import connection from "./src/config/connection.js";

//================= Router =========================
import CategorieRouter from "./src/router/CategorieRouter.js";
import ArticlesRouter from "./src/router/ArticleRouter.js";

//====================
const app = express();

//========= Decodificação da URL ===============
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//======= Arquivos estativos =====
app.use(express.static("public"));

//======= Renderizador =======
app.set("view engine", "ejs");

//======= Conexão Database =======
connection
  .authenticate()
  .then(() => console.log("Conexão feita com sucesso!"))
  .catch(() => console.log("Conexão falhou"));

//============= Router ============
app.use(CategorieRouter);
app.use(ArticlesRouter);

//=========== Homepage ============
app.get("/home", (req, res) => {
  res.render("index");
});

//== init ssserver ==
export default app;
