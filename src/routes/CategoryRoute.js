import express from "express";
import slugify from "slugify";

//==================== Models =========================
import CategoryModel from "../models/CategoryModel.js";

//==============================
const router = express.Router();

//============ Tabela de categorias ===========
router.get("/admin/categories", (req, res) => {
    //===== Busca todas as categorias ======
    CategoryModel.findAll({ order: [["updatedAt", "DESC"]] })
        .then((categories) => {
            res.render("admin/category/index", { categories });
        })
        .catch((err) => res.redirect("/home"));
});

//=============== Criar categoria ===============
router.get("/admin/category/new", (req, res) => {
    CategoryModel.findAll()
        .then((categories) => res.render("admin/category/new", { categories }))
        .catch((err) => res.redirect("/admin/categories"));
});

//====== Autentica e cria categoria ========
router.post("/category/save", (req, res) => {
    const categoryTitle = req.body.title;

    //============ Validando dados de entrada ================
    if (!categoryTitle) {
        return res.redirect("/admin/category/new");
    }

    //================ Criando uma categoria ==================
    CategoryModel.create({
        title: categoryTitle,
        slug: slugify(categoryTitle),
    })
        .then(() => {
            res.redirect("/admin/categories");
        })
        .catch(() => res.redirect("/home"));
});

//============== Autentica e deleta categoria =============
router.post("/category/delete", (req, res) => {
    const categoryId = req.body.id;

    if (categoryId === undefined) return res.redirect("/admin/categories");

    //======= Busca pela categoria e deleta ============
    CategoryModel.destroy({ where: { id: categoryId } })
        .then(() => res.redirect("/admin/categories"))
        .catch((err) => res.redirect("/home"));
});

//====================== Edita categoria =============
router.get("/admin/category/edit/:id", (req, res) => {
    const categoryId = req.params.id;

    if (isNaN(categoryId)) return res.redirect("/admin/categories");

    //======= Busca pela categoria e retorna os dados =====
    CategoryModel.findByPk(categoryId)
        .then((category) => {
            //===== Categorias para barra de navegação =====
            CategoryModel.findAll()
                .then((categories) =>
                    res.render("admin/category/edit", {
                        id: category.id,
                        title: category.title,
                        slug: category.slug,
                        created: category.createdAt,
                        updated: category.updatedAt,
                        categories,
                    }),
                )
                .catch((err) => res.redirect("/home"));
        })
        .catch((err) => res.redirect("/home"));
});

//=============== Edita categoria =============
router.post("/category/update", (req, res) => {
    const { id, title } = req.body;

    if (!title) return res.redirect("/admin/categories");

    //======== Edita dados da categoria =============
    CategoryModel.update({ title, slug: slugify(title) }, { where: { id } })
        .then(() => res.redirect("/admin/categories"))
        .catch((err) => res.redirect("/home"));
});

//====================
export default router;
