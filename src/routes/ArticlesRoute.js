import express from "express";

//================= Middleware ==================
import userAuth from "../middleware/userAuth.js";

//======================== Controllers =========================
import * as ArticlesController from "../controllers/ArticlesController.js";

//=============================
const router = express.Router();

//======== Lista de artigos ============
router.get("/admin/articles", userAuth, ArticlesController.Articles);

//========== Novo artigos ======================
router.get("/admin/article/new", userAuth, ArticlesController.ArticleCreate);

//===== Autenticar e salvar artigo =========
router.post("/article/save", ArticlesController.ArticleSave);

//================ Deletar artigo ============
router.post("/article/delete", ArticlesController.ArticleDelete);

//================= Editar artigo ==================
router.get("/admin/article/edit/:id", userAuth, ArticlesController.ArticleEdit);

//=============== Editar artigo ==============
router.post("/article/update", ArticlesController.ArticleUpdate);

//====================
export default router;
