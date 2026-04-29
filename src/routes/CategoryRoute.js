import express from "express";
import slugify from "slugify";
import CategoryModel from "../models/CategoryModel.js";

//==============================
const router = express.Router();

//======== Lista de categorias ===========
router.get("/categories", (req, res) => {
    res.send("Categories");
});

//=============== Criar categoria ===============
router.get("/admin/categories/new", (req, res) => {
    res.render("admin/category/new");
});

//====== Autentica e cria categoria ========
router.post("/categories/save", (req, res) => {
    const categoryTitle = req.body.titleCategory;

    //============ Validando dados de entrada ================
    if (categoryTitle === undefined || categoryTitle === "") {
        return res.redirect("/admin/category/new");
    }

    //================ Criando uma categoria ==================
    CategoryModel.create({
        title: categoryTitle.charAt(0).toUpperCase() + categoryTitle.slice(1),
        slug: slugify(categoryTitle),
    })
        .then(() => {
            console.log("Catetoria salva com sucesso");
            res.redirect("/home");
        })
        .catch(console.log("Houve um error ao finalizar"));
});

//============ Tabela de categorias ===========
router.get("/admin/categories", (req, res) => {
    CategoryModel.findAll()
        .then((categories) => {
            res.render("admin/category/index", { categories });
        })
        .catch((err) => res.redirect("/home"));
});

//============== Autentica e deleta categoria =============
router.post("/category/delete", (req, res) => {
    const categoryId = req.body.id;

    if (categoryId === undefined) return res.redirect("/admin/categories");

    //=============== Busca pela categoria e deleta ===============
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
            if (categoryId === undefined)
                return res.redirect("/admin/categories");

            res.render("admin/category/edit", {
                id: category.id,
                title: category.title,
                slug: category.slug,
                created: category.createdAt,
                updated: category.updatedAt,
            });
        })
        .catch((err) => res.redirect("/home"));
});

//=============== Edita categoria =============
router.post("/category/update", (req, res) => {
    const { id, title, slug, createdAt, updatedAt } = req.body;

    //======== Edita dados da categoria =============
    CategoryModel.update(
        { title: title, slug: slugify(title) },
        { where: { id: id } },
    )
        .then(() => res.redirect("/admin/categories"))
        .catch((err) => res.redirect("/home"));
});

//====================
export default router;
