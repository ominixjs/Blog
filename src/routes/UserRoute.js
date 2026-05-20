import express from "express";

//================= Middleware ==================
import userAuth from "../middleware/userAuth.js";

//=============== Controllers =====================
import * as Users from "../controllers/UsersController.js";

//=============================
const router = express.Router();

//====================
const saltRounds = 12;

//========== listagem de usuários ==========
router.get("/admin/users", userAuth, Users.Users);

//================ Rota de login ======================
router.get("/user/login", Users.UserLogin);

//========= Autenticar usuário ================
router.post("/user/login/auth", Users.AuthUserLogin);

//================ Novo usuario =====================
router.get("/user/register", Users.UserRegister);

//====== Authenticar dados de registro ========
router.post("/user/register/auth", Users.AuthUserRegister);

//============== Deletar Usuário ==========
router.post("/user/delete", Users.UserDelete);

//============= Sair do login =======
router.get("/logout", (req, res) => {
    res.clearCookie("token");
    res.redirect("/home");
});

//====================
export default router;
