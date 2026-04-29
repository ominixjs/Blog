import express from "express";
import ejs from "ejs";
import connection from "./src/config/connection.js";

//========================= Routes ===========================
import CategoryRouter from "./src/routes/CategoryRoute.js";
import ArticleRouter from "./src/routes/ArticleRoute.js";

//======================== Models =========================
import CategoryModel from "./src/models/CategoryModel.js";
import ArticleMoodel from "./src/models/ArticleModel.js";

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
app.use(CategoryRouter);
app.use(ArticleRouter);

//=========== Homepage ============
app.get("/home", (req, res) => {
    res.render("index");
});

//== init ssserver ==
export default app;
