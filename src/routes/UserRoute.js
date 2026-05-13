import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

//================= Middleware ==================
import userAuth from "../middleware/userAuth.js";

//================== Models ===================
import UserModel from "../models/UserModel.js";
import CategoryModel from "../models/CategoryModel.js";

//=============================
const router = express.Router();

//====================
const saltRounds = 12;

//========== listagem de usuários ==========
router.get("/admin/users", userAuth, (req, res) => {
    UserModel.findAll({ order: [["updatedAt", "DESC"]] })
        .then((users) => {
            CategoryModel.findAll()
                .then((categories) => {
                    res.render("admin/user/index", {
                        name: req.user.name,
                        users,
                        categories,
                    });
                })
                .catch((err) => res.redirect("/home"));
        })
        .catch((err) => res.redirect("/home"));
});

//================ Rota de login ======================
router.get("/user/login", (req, res) => {
    CategoryModel.findAll().then((categories) => {
        res.render("admin/user/login", { categories });
    });
});

//========= Autenticar usuário ================
router.post("/user/login/auth", (req, res) => {
    const { email, password } = req.body;

    if (!email || !email.includes("@")) {
        return res.redirect("/user/login");
    }

    if (!password || password.length < 8) {
        return res.redirect("/user/login");
    }

    UserModel.findOne({ where: { email } }).then(async (user) => {
        // Usuário não encontrado
        if (!user) {
            return res.redirect("/user/login");
        }

        // Validação de senha
        const match = bcrypt.compare(password, user.password);
        if (!match) return res.redirect("/user/login");

        // Gerando token para autenticar usuario por 15min
        const token = jwt.sign({ name: user.name }, process.env.JWT_KEY, {
            expiresIn: "15m",
        });

        // Gerando cookie
        res.cookie("token", token, {
            httpOnly: true,
            secure: false, // ativar em HTTPS
            sameSite: "strict",
            maxAge: 15 * 60 * 1000,
        });

        res.redirect("/home");
    });
});

//================ Novo usuario =====================
router.get("/user/register", (req, res) => {
    CategoryModel.findAll().then((categories) => {
        res.render("admin/user/register", { categories });
    });
});

//====== Authenticar dados de registro ========
router.post("/user/register/auth", (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !email.includes("@")) {
        return res.redirect("/user/register");
    }

    if (!password || password.length < 8) {
        return res.redirect("/user/register");
    }

    UserModel.findOne({ where: { email } })
        .then(async (user) => {
            // Usuario cadastrado
            if (user) {
                return res.redirect("/user/register");
            }

            //==================================================
            const hash = await bcrypt.hash(password, saltRounds);

            UserModel.create({ name, email, password: hash })
                .then(() => {
                    res.redirect("/admin/users");
                })
                .catch((err) => res.redirect("/home"));
        })
        .catch((err) => res.redirect("/user/register"));
});

//============== Deletar Usuário ==========
router.post("/user/delete", (req, res) => {
    const id = req.body.id;

    console.log(id + "================================");

    if (isNaN(id)) {
        return res.redirect("/admin/users");
    }
    //======== Localiza e deleta =======
    UserModel.destroy({ where: { id } })
        .then(() => res.redirect("/admin/users"))
        .catch((err) => res.redirect("/home"));
});

//============= Sair do login =======
router.get("/logout", (req, res) => {
    res.clearCookie("token");
    res.redirect("/home");
});

//====================
export default router;
