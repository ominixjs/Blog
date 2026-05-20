import express from "express";
import slugify from "slugify";

//==================== Models =========================
import CategoryModel from "../models/CategoryModel.js";

//=================== Repositories ===================
import * as CategoryRepository from "../repositories/CategoryRepository.js";

export async function Categories(req, res) {
    try {
        //===== Busca todas as categorias para navbar =====
        const categories = await CategoryRepository.Categories();
        res.render("admin/category/index", {
            name: req.user.name,
            categories,
        });
    } catch (err) {
        res.redirect("/home");
    }
}

export async function CategoryCreate(req, res) {
    try {
        const categories = await CategoryRepository.Categories();
        res.render("admin/category/new", {
            name: req.user.name,
            categories,
        });
    } catch (err) {
        res.redirect("/admin/categories");
    }
}

export async function CategorySave(req, res) {
    const title = req.body.title;

    //============ Validando dados de entrada ================
    if (!title) {
        return res.redirect("/admin/category/new");
    }

    //================ Criando uma categoria ==================
    try {
        await CategoryRepository.CategoryCreate(title);
        res.redirect("/admin/categories");
    } catch (err) {
        res.redirect("/home");
    }
}

export async function CategoryDelete(req, res) {
    const id = req.body.id;

    if (id === undefined) return res.redirect("/admin/categories");

    //======= Busca pela categoria e deleta ============
    try {
        await CategoryRepository.CategoryDelete(id);
        res.redirect("/admin/categories");
    } catch (err) {
        res.redirect("/home");
    }
}

export async function CategoryEdit(req, res) {
    const id = req.params.id;

    if (isNaN(id)) return res.redirect("/admin/categories");

    //======= Busca pela categoria e retorna os dados =====
    try {
        //===== Categorias para barra de navegação =====
        const category = await CategoryRepository.CategoryEdit(id);
        const categories = await CategoryRepository.Categories();

        res.render("admin/category/edit", {
            name: req.user.name,
            id: category.id,
            title: category.title,
            slug: category.slug,
            created: category.createdAt,
            updated: category.updatedAt,
            categories,
        });
    } catch (err) {
        res.redirect("/home");
    }
}

export async function CategoryUpdate(req, res) {
    const { id, title } = req.body;

    if (!title) return res.redirect("/admin/categories");

    //======== Edita dados da categoria =============
    try {
        await CategoryRepository.CategoryUpdate(id, title);
        res.redirect("/admin/categories");
    } catch (err) {
        res.redirect("/home");
    }
}
