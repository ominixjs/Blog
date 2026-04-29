import express from "express";
import ejs from "ejs";
import connection from "./src/config/connection.js";

//========================= Routes ========================
import CategoryRouter from "./src/routes/CategoryRoute.js";
import ArticleRouter from "./src/routes/ArticleRoute.js";

//======================== Models ========================
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

//== Função Auxiliar Global de Data ===
app.locals.formatDateTime = (date) => {
    // Verifica se a data é válida
    if (!date) return "";

    // Cria um objeto Date
    const dateObj = new Date(date);

    // Verifica se a data criada é válida
    if (isNaN(dateObj.getTime())) return "Data Inválida";

    // Formata a data e hora para o padrão brasileiro
    // Especifica dia/mês/ano e hora/minuto/segundo
    const formatted = new Intl.DateTimeFormat("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false, // Força o formato 24h
        timeZone: "America/Sao_Paulo", // Garante o fuso horário correto
    }).format(dateObj);

    return formatted;
};

//============= Router ============
app.use(CategoryRouter);
app.use(ArticleRouter);

//=========== Homepage ============
app.get("/home", (req, res) => {
    res.render("index");
});

//== init server ==
export default app;
