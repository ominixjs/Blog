import slugify from "slugify";

//==================== Models =======================
import ArticleModel from "../models/ArticleModel.js";
import CategoryModel from "../models/CategoryModel.js";

//=================== Repositories ===================
import * as ArticleRepository from "../repositories/ArticleRepository.js";
import * as CategoryRepository from "../repositories/CategoryRepository.js";

//========= Controle de tabela de Artigos =========================
export async function Articles(req, res) {
    try {
        const articles = await ArticleRepository.ArticlesAll();
        const categories = await CategoryRepository.Categories();

        res.render("admin/article/index", {
            name: req.user.name,
            articles,
            categories,
        });
    } catch (err) {
        res.redirect("/");
    }
}

//============ Controle de criação de Artigo ==============
export async function ArticleCreate(req, res) {
    //=== Lista de todas as categorias ===
    try {
        const categories = await CategoryRepository.Categories();
        res.render("admin/article/new", {
            name: req.user.name,
            categories,
        });
    } catch (err) {
        res.redirect("/");
    }
}

//================ Controle de novo artigo ============
export async function ArticleSave(req, res) {
    const { title, content, category } = req.body;

    if (!title || !content || !category) {
        return res.redirect("/admin/article/new");
    }

    //========== Salva novo artigo ===================
    try {
        await ArticleRepository.ArticleCreate(title, content, category);
        res.redirect("/admin/articles");
    } catch (err) {
        res.redirect("/admin/article/new");
    }
}

//============= Controle de deleção de artigo ===============
export async function ArticleDelete(req, res) {
    const id = req.body.id;

    if (!id) return res.redirect("/admin/articles");

    //=============== Deletando artigo ===============
    try {
        await ArticleRepository.ArticleDestroy(id);
        res.redirect("/admin/articles");
    } catch (err) {
        res.redirect("/");
    }
}

//============== Controle de edição de Artigo ===============
export async function ArticleEdit(req, res) {
    const id = req.params.id;

    if (isNaN(id)) return res.redirect("/");

    //====== Editando artigo =======
    try {
        const article = await ArticleRepository.ArticlePk(id);
        const categories = await CategoryRepository.Categories();

        res.render("admin/article/edit", {
            name: req.user.name,
            id: article.id,
            title: article.title,
            slug: article.slug,
            body: article.body,
            created: article.createdAt,
            updated: article.updatedAt,
            categoryId: article.categoryId,
            categories,
        });
    } catch (err) {
        res.redirect("/");
    }
}

//================= Controle de Artigo editado =====================
export async function ArticleUpdate(req, res) {
    const { id, title, content, category } = req.body;

    if (!title || !content || !category) {
        return res.redirect("/admin/articles");
    }

    //===== Altera dados do artigo ======
    try {
        await ArticleRepository.ArticleUpdate(id, title, content, category);
        res.redirect("/admin/articles");
    } catch (err) {
        res.redirect("/");
    }
}
