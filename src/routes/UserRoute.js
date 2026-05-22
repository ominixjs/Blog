import express from "express";

//================= Middleware ==================
import userAuth from "../middleware/userAuth.js";

//=============== Controllers =====================
import * as UsersController from "../controllers/UsersController.js";

//=============================
const router = express.Router();

//====================
const saltRounds = 12;

//========== listagem de usuários ==========
router.get("/admin/users", userAuth, UsersController.Users);

//================ Rota de login ======================
router.get("/admin/login", UsersController.UserLogin);

//========= Autenticar usuário ================
router.post("/login/auth", UsersController.AuthUserLogin);

//================ Novo usuario =====================
router.get("/admin/register", UsersController.UserRegister);

//====== Authenticar dados de registro ========
router.post("/register/auth", UsersController.AuthUserRegister);

//============== Deletar Usuário ==========
router.post("/user/delete", UsersController.UserDelete);

//============= Sair do login =======
router.get("/logout", (req, res) => {
    res.clearCookie("token");
    res.redirect("/home");
});

//====================
export default router;
