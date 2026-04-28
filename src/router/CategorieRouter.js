import express from "express";

//==============================
const router = express.Router();

//======== Lista de categorias ===========
router.get("/categories", (req, res) => {
  res.send("Categories");
});

//=============== Criar categoria ===============
router.get("/adm/categories/new", (req, res) => {
  res.send("New categorie");
});

export default router;
