import { Op } from "sequelize";

//===================== Repositories =========================
import * as CategoryRepository from "../repositories/CategoryRepository.js";
import * as ArticleRepository from "../repositories/ArticleRepository.js";

export async function page(req, res) {
    try {
        const articles = await ArticleRepository.ArticlesAll();
        const categories = await CategoryRepository.Categories();

        res.render("pages/index", {
            articles,
            categories,
        });
    } catch (err) {
        res.redirect("/err");
    }
}

export async function ArticlesSearch(req, res) {
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

    try {
        const articles = await ArticleRepository.ArticlesPagination(
            order,
            where,
        );

        const categories = await CategoryRepository.Categories();

        res.render("pages/search", {
            categories,
            articles,
        });
    } catch (err) {
        res.redirect("/");
    }
}

export async function Slug(req, res) {
    const slug = req.params.slug;

    //===== Busca pelo artigo e cria pagina de viualização  ==
    try {
        const article = await ArticleRepository.Article(slug);
        const categories = await CategoryRepository.Categories();

        res.render("pages/article", {
            body: article.body,
            categories,
        });
    } catch (err) {
        res.redirect("/");
    }
}

export async function CategorySlug(req, res) {
    const slug = req.params.slug;

    //===== Busca pela categoria =====
    try {
        const category = await CategoryRepository.Category(slug);
        const categories = await CategoryRepository.Categories();

        res.render("pages/index", {
            categories,
            articles: category.articles,
            categoryTitle: category.title,
        });
    } catch (err) {
        res.redirect("/");
    }
}

export async function Pagination(req, res) {
    const page = req.params.num;

    const limit = 6;
    let offset = 0;

    // ===== Valida nº de rota =====
    offset = isNaN(page) || page <= 0 ? 0 : limit * (parseInt(page) - 1);

    // ===== Cria paginação =======
    try {
        const articles = await ArticleRepository.ArticlesFindAndCountAll(
            limit,
            offset,
        );

        // =============
        let next = true;
        let prev = true;

        // =========================================
        if (offset + limit >= articles.count) {
            next = false;
        }

        // ==============
        if (offset < 1) {
            prev = false;
        }

        // Calcula valor para gerar botões para paginação
        const pageCount = Math.ceil(articles.count / limit);

        // ==============
        const result = {
            next, // Validação paginação
            prev, // Validação paginação
            pageCount, // Cria recurso para botões de paginação
            page: parseInt(page), // Pagina atual
            articles: articles, // Lista
        };

        // ==== Dependdencia da barra de navegação ====
        const categories = await CategoryRepository.Categories();

        res.render("pages/news", {
            categories,
            articles: result.articles.rows,
            articlesCount: result.articles.count,
            page: result.page,
            pageCount,
            nextPagination: result.next,
            prevPagination: result.prev,
        });
    } catch (err) {
        res.redirect("/");
    }
}
