import express from "express";
import slugify from "slugify";

//==================== Models =======================
import ArticleModel from "../models/ArticleModel.js";
import CategoryModel from "../models/CategoryModel.js";

//=============================
const router = express.Router();

//======== Lista de artigos ============
router.get("/admin/articles", (req, res) => {
    ArticleModel.findAll({
        include: [{ model: CategoryModel }],
        order: [["updatedAt", "DESC"]],
    })
        .then((articles) => {
            CategoryModel.findAll()
                .then((categories) => {
                    res.render("admin/article/index", { articles, categories });
                })
                .catch((err) => res.redirect("/home"));
        })
        .catch((err) => res.redirect("/home"));
});

//========== tabela artigos ======================
router.get("/admin/article/new", (req, res) => {
    //=== Lista todas as categorias ===
    CategoryModel.findAll()
        .then((categories) =>
            res.render("admin/article/new", {
                categories,
            }),
        )
        .catch((err) => res.redirect("/home"));
});

//===== Autenticar e salvar artigo =========
router.post("/article/save", (req, res) => {
    const { title, content, category } = req.body;

    if (!title || !content || !category) {
        return res.redirect("/admin/article/new");
    }

    //========== Cria um novo artigo ===================
    ArticleModel.create({
        title: title,
        slug: slugify(title),
        body: content,
        categoryId: category,
    })
        .then(() => res.redirect("/admin/articles"))
        .catch((err) => res.redirect("/admin/articles/new"));
});

//================ Deletar artigo ============
router.post("/article/delete", (req, res) => {
    const articleId = req.body.id;

    if (!articleId) return res.redirect("/admin/articles");

    //=============== Deletando artigo ===============
    ArticleModel.destroy({ where: { id: articleId } })
        .then(() => res.redirect("/admin/articles"))
        .catch((err) => res.redirect("/home"));
});

//================= Editar artigo ==================
router.get("/admin/article/edit/:id", (req, res) => {
    const articleId = req.params.id;

    if (isNaN(articleId)) return res.redirect("/home");

    //====== Editando artigo =======
    ArticleModel.findByPk(articleId)
        .then((article) => {
            //== Carrega categorias ==
            CategoryModel.findAll()
                .then((categories) => {
                    res.render("admin/article/edit", {
                        id: article.id,
                        title: article.title,
                        slug: article.slug,
                        body: article.body,
                        created: article.createdAt,
                        updated: article.updatedAt,
                        categoryId: article.categoryId,
                        categories,
                    });
                })
                .catch((err) => res.redirect("/home"));
        })
        .catch((err) => res.redirect("/home"));
});

//=============== Editar artigo ==============
router.post("/article/update", (req, res) => {
    const { id, title, content, category } = req.body;

    if (!title || !content || !category) {
        return res.redirect("/admin/articles");
    }

    //===== Altera dados do artigo ======
    ArticleModel.update(
        { title, slug: slugify(title), body: content, categoryId: category },
        { where: { id } },
    )
        .then(() => res.redirect("/admin/articles"))
        .catch((err) => res.redirect("/home"));
});

//====================
export default router;
