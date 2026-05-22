import express from "express";
import ejs from "ejs";
import cookieParser from "cookie-parser";

//================ Database ====================
import connection from "./src/db/connection.js";

//========================= Routes ========================
import CategoriesRoute from "./src/routes/CategoriesRoute.js";
import ArticlesRoute from "./src/routes/ArticlesRoute.js";
import UserRoute from "./src/routes/UserRoute.js";

//========================== Controllers =============================
import * as MainController from "./src/controllers/MainController.js";

//======================  Utils ====================
import FormatDateTime from "./src/utils/FormatDateTime.js";
import GetParagraph from "./src/utils/GetParagraph.js";

//====================
const app = express();

//========= Decodificação da URL ===============
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//======= Arquivos estativos =====
app.use(express.static("public"));

//=== Cookie temporario ===
app.use(cookieParser());

//======= Renderizador =======
app.set("view engine", "ejs");

//======= Conexão Database =======
connection
    .authenticate()
    .then(() => console.log("Conexão feita com sucesso!"))
    .catch(() => console.log("Conexão falhou"));

//========= Funções auxiliares ============
app.locals.formatDateTime = FormatDateTime;
app.locals.getParagraph = GetParagraph;

//===== Router ========
app.use(CategoriesRoute);
app.use(ArticlesRoute);
app.use(UserRoute);

//=========== Homepage ==========
app.get("/home", MainController.Homepage);

app.get("/articles/search", MainController.ArticlesSearch);

//=========== Viualização de post ==============
app.get("/:slug", MainController.Slug);

//=== Visualiza artigo da categoria ======
app.get("/category/:slug", MainController.CategorySlug);

//============ Paginação de conteúdos ========
app.get("/article/page/:num", MainController.Pagination);

//== init server ==
export default app;
