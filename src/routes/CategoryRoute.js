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
    CategoryModel.findAll().then((categories) => {
        res.render("admin/category/index", { categories });
    });
});

export default router;
