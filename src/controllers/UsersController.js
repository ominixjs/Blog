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
        res.redirect("/home");
    }
}

export async function UserLogin(req, res) {
    try {
        const categories = await CategoryRepository.Categories();
        res.render("admin/user/login", { categories });
    } catch (err) {
        res.redirect("/home");
    }
}

export async function AuthUserLogin(req, res) {
    const { email, password } = req.body;

    try {
        if (!email || !email.includes("@")) {
            return res.redirect("/user/login");
        }

        if (!password || password.length < 8) {
            return res.redirect("/user/login");
        }

        const user = await UserRepository.User(email);

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

        res.redirect("/admin/categories");
    } catch (err) {
        res.redirect("/home");
    }
}

export async function UserRegister(req, res) {
    try {
        const categories = await CategoryRepository.Categories();
        res.render("admin/user/register", { categories });
    } catch (err) {
        res.redirect("/home");
    }
}

export async function AuthUserRegister(req, res) {
    const { name, email, password } = req.body;

    try {
        if (!name || !email || !email.includes("@")) {
            return res.redirect("/user/register");
        }

        if (!password || password.length < 8) {
            return res.redirect("/user/register");
        }

        const user = await UserRepository.User(email);

        // Usuario cadastrado
        if (user) {
            return res.redirect("/user/register");
        }

        //==================================================
        const hash = await bcrypt.hash(password, saltRounds);

        await UserRepository.UserCreate(name, email, hash);

        res.redirect("/admin/users");
    } catch (err) {
        res.redirect("/home");
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
        res.redirect("/home");
    }
}
