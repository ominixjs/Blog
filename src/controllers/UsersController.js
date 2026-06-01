import express from "express";

//================== Repositories ==========================
import * as UserRepository from "../repositories/UserRepository.js";
import * as CategoryRepository from "../repositories/CategoryRepository.js";

//============================ Services ===============================
import RegisterService from "../service/RegisterService.js";
import LoginService from "../service/LoginService.js";

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
    try {
        const result = await LoginService(req.body);
        if (!result.approved) {
            req.session.err = result.err;
            return res.redirect("/admin/login");
        }

        // Gerando cookie
        res.cookie("token", result.token, {
            httpOnly: true,
            secure: true, // ativar em HTTPS
            sameSite: "strict",
            maxAge: 15 * 60 * 1000,
        });

        res.redirect("/admin/categories");
    } catch (err) {
        res.redirect("/");
    }
}

export function UserRegister(req, res) {
    const err = req.session.err;
    req.session.err = null;

    res.render("admin/user/register", { err });
}

export async function AuthUserRegister(req, res) {
    try {
        const result = await RegisterService(req.body);
        if (!result.approved) {
            req.session.err = result.err;
            return res.redirect("/admin/register");
        }

        res.redirect("/admin/login");
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
