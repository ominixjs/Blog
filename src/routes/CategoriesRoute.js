import express from "express";
import slugify from "slugify";

//================= Middleware ==================
import userAuth from "../middleware/userAuth.js";

//======================== Controller ===========================
import * as CategoriesController from "../controllers/CategoriesController.js";

//==============================
const router = express.Router();

//=================== Tabela de categorias ====================
router.get("/admin/categories", userAuth, CategoriesController.Categories);

//======================= Criar categoria ===========================
router.get(
    "/admin/category/new",
    userAuth,
    CategoriesController.CategoryCreate,
);

//======= Autentica e cria categoria ================
router.post("/category/save", CategoriesController.CategorySave);

//============== Autentica e deleta categoria ===========
router.post("/category/delete", CategoriesController.CategoryDelete);

//====================== Edita categoria ===============================
router.get(
    "/admin/category/edit/:id",
    userAuth,
    CategoriesController.CategoryEdit,
);

//======================= Edita categoria ===============
router.post("/category/update", CategoriesController.CategoryUpdate);

//====================
export default router;
