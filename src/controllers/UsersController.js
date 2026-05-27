import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

//================== Models ===================
import UserModel from "../models/UserModel.js";
import CategoryModel from "../models/CategoryModel.js";

//================== Repositories ==========================
import * as UserRepository from "../repositories/UserRepository.js";
import * as CategoryRepository from "../repositories/CategoryRepository.js";

//====================
const saltRounds = 12;

export async function Users(req, res) {
    try {
        const users = await UserRepository.Users();
        const categories = await CategoryRepository.Categories();

        res.render("admin/user/index", {
            name: req.user.name,
            users,
            categories,
        });
    } catch (err) {
        res.redirect("/");
    }
}

export async function UserLogin(req, res) {
    const err = req.session.err;
    req.session.err = null;

    res.render("admin/user/login", { err });
}

export async function AuthUserLogin(req, res) {
    const { email, password } = req.body;
    const msg = {
        passwordInvalid: "Senha com menos de 8 digitos",
        inputError: "Senha ou usuário incorreto",
        userError: "Usuário não encontrado",
    };

    try {
        if (!email || !email.includes("@")) {
            req.session.err = msg.inputError;
            return res.redirect("/admin/login");
        }

        if (!password || password.length < 8) {
            req.session.err = msg.passwordInvalid;
            return res.redirect("/admin/login");
        }

        // Busca pelo email no banco de dados
        const user = await UserRepository.User(email);

        // Usuário não encontrado
        if (!user) {
            req.session.err = msg.userError;
            return res.redirect("/admin/login");
        }

        // Validação de senha
        const match = await bcrypt.compare(password, user.password);
        console.log(match + "=====================================");

        if (!match) {
            req.session.err = msg.inputError;
            return res.redirect("/admin/login");
        }

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

        res.redirect("/admin/categories");
    } catch (err) {
        res.redirect("/");
    }
}

export function UserRegister(req, res) {
    res.render("admin/user/register");
}

export async function AuthUserRegister(req, res) {
    const { name, email, password } = req.body;

    try {
        if (!name || !email || !email.includes("@")) {
            return res.redirect("/admin/register");
        }

        if (!password || password.length < 8) {
            return res.redirect("/admin/register");
        }

        const user = await UserRepository.User(email);

        // Usuario cadastrado
        if (user) {
            return res.redirect("/admin/register");
        }

        //==================================================
        const hash = await bcrypt.hash(password, saltRounds);

        await UserRepository.UserCreate(name, email, hash);

        res.redirect("/admin/users");
    } catch (err) {
        res.redirect("/");
    }
}

export async function UserDelete(req, res) {
    const id = req.body.id;

    if (isNaN(id)) {
        return res.redirect("/admin/users");
    }
    //======== Localiza e deleta =======
    try {
        await UserRepository.UserDelete(id);
        res.redirect("/admin/users");
    } catch (err) {
        res.redirect("/");
    }
}
