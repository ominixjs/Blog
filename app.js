import express from "express";
import ejs from "ejs";
import { Op } from "sequelize";
import cookieParser from "cookie-parser";

//================ Database ====================
import connection from "./src/db/connection.js";

//========================= Routes ========================
import CategoriesRoute from "./src/routes/CategoriesRoute.js";
import ArticlesRoute from "./src/routes/ArticlesRoute.js";
import UserRoute from "./src/routes/UserRoute.js";

//======================== Models ========================
import CategoryModel from "./src/models/CategoryModel.js";
import ArticleModel from "./src/models/ArticleModel.js";

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

//===== Router ========
app.use(CategoriesRoute);
app.use(ArticlesRoute);
app.use(UserRoute);

//=========== Homepage ==========
app.get("/home", (req, res) => {
    ArticleModel.findAll({
        order: [["updatedAt", "DESC"]],
        include: [{ model: CategoryModel }],
        // limit: 6,
    })
        .then((articles) => {
            CategoryModel.findAll()
                .then((categories) => {
                    res.render("pages/index", {
                        articles,
                        categories,
                    });
                })
                .catch((err) => res.redirect("/err"));
        })
        .catch((err) => res.redirect("/err"));
});

app.get("/search", (req, res) => {
    const { filter, search } = req.query;

    let order = [];
    let where = {};

    // === Filtra os mais acesssados ===
    if (filter === "popular") {
        order = [["updatedAt", "ASC"]];
    }

    // ======= Filtra os recentes ======
    if (filter === "recent") {
        order = [["updatedAt", "DESC"]];
    }

    //======= Busca nomes relativos ===============
    if (search) {
        where.title = { [Op.like]: `%${search}%` };
    }

    ArticleModel.findAll({
        include: [{ model: CategoryModel }],
        order,
        where,
        limit: 6,
    })
        .then((articles) => {
            CategoryModel.findAll()
                .then((categories) => {
                    res.render("pages/search", {
                        categories,
                        articles,
                    });
                })
                .catch((err) => res.redirect("/home"));
        })
        .catch((err) => res.redirect("/home"));
});

//=========== Viualização de post ==============
app.get("/:slug", (req, res) => {
    const slug = req.params.slug;

    //===== Busca pelo artigo e cria pagina de viualização  ==
    ArticleModel.findOne({ where: { slug } })
        .then((article) => {
            //======== Pega toda lista de categorias =====
            CategoryModel.findAll()
                .then((categories) => {
                    res.render("pages/article", {
                        body: article.body,
                        categories,
                    });
                })
                .catch((err) => res.redirect("/home"));
        })
        .catch((err) => res.redirect("/home"));
});

//=== Visualiza artigo da categoria ======
app.get("/category/:slug", (req, res) => {
    const slug = req.params.slug;

    //===== Busca pela categoria =====
    CategoryModel.findOne({
        where: { slug },
        include: [{ model: ArticleModel, include: [CategoryModel] }],
    })
        .then((category) => {
            //======== Pega toda lista de categorias =====
            CategoryModel.findAll().then((categories) => {
                res.render("pages/index", {
                    categories,
                    articles: category.articles,
                    categoryTitle: category.title,
                });
            });
        })
        .catch((err) => res.redirect("/"));
});

//============ Paginação de conteúdos ========
app.get("/article/page/:num", (req, res) => {
    const page = req.params.num;

    const pageLimit = 6;
    let offSet = 0;

    // ===== Valida nº de rota =====
    offSet = isNaN(page) || page <= 0 ? 0 : pageLimit * (parseInt(page) - 1);

    // ===== Cria paginação =======
    ArticleModel.findAndCountAll({
        limit: pageLimit,
        offset: offSet,
        order: [["updatedAt", "DESC"]],
        include: [{ model: CategoryModel }],
    })
        .then((articles) => {
            // =============
            let next = true;
            let prev = true;

            // =========================================
            if (offSet + pageLimit >= articles.count) {
                next = false;
            }

            // ==============
            if (offSet < 1) {
                prev = false;
            }

            // Calcula valor para gerar botões para paginação
            const pageCount = Math.ceil(articles.count / pageLimit);

            // ==============
            const result = {
                next, // Validação paginação
                prev, // Validação paginação
                pageCount, // Cria recurso para botões de paginação
                page: parseInt(page), // Pagina atual
                articles: articles, // Lista
            };

            // ==== Dependdencia da barra de navegação ====
            CategoryModel.findAll()
                .then((categories) => {
                    res.render("pages/news", {
                        categories,
                        articles: result.articles.rows,
                        articlesCount: result.articles.count,
                        page: result.page,
                        pageCount,
                        nextPagination: result.next,
                        prevPagination: result.prev,
                    });
                })
                .catch((err) => res.redirect("/home"));
        })
        .catch((err) => res.redirect("/home"));
});

//== init server ==
export default app;
