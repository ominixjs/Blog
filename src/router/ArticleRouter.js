import express from "express";

//=============================
const router = express.Router();

//======== Lista de artigos ============
router.get("/articles", (req, res) => {
  res.send("Articles");
});

//========== Cria artigos ======================
router.get("/adm/articles/new", (req, res) => {
  res.send("New article");
});

export default router;
