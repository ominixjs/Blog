import slugify from "slugify";

//==================== Models =======================
import ArticleModel from "../models/ArticleModel.js";
import CategoryModel from "../models/CategoryModel.js";

export function Categories() {
    return CategoryModel.findAll({ order: [["updatedAt", "DESC"]] });
}

export function Category(slug) {
    return CategoryModel.findOne({
        where: { slug },
        include: [{ model: ArticleModel, include: [CategoryModel] }],
    });
}

export function CategoryCreate(categoryTitle) {
    return CategoryModel.create({
        title: categoryTitle,
        slug: slugify(categoryTitle),
    });
}

export function CategoryDelete(id) {
    return CategoryModel.destroy({ where: { id } });
}

export function CategoryPk(id) {
    return CategoryModel.findByPk(id);
}

export function CategoryUpdate(id, title) {
    return CategoryModel.update(
        { title, slug: slugify(title) },
        { where: { id } },
    );
}
