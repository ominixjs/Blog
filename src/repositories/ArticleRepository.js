import slugify from "slugify";

//==================== Models =======================
import ArticleModel from "../models/ArticleModel.js";
import CategoryModel from "../models/CategoryModel.js";

export function ArticlesAll() {
    return ArticleModel.findAll({
        include: [{ model: CategoryModel }],
        order: [["updatedAt", "DESC"]],
    });
}

export function Article(slug) {
    return ArticleModel.findOne({ where: { slug } });
}

export function ArticlesPagination(order, where) {
    return ArticleModel.findAll({
        order,
        where,
        include: [{ model: CategoryModel }],
    });
}

export function ArticleCreate(title, content, category) {
    return ArticleModel.create({
        title: title,
        slug: slugify(title),
        body: content,
        categoryId: category,
    });
}

export function ArticleDestroy(id) {
    return ArticleModel.destroy({ where: { id } });
}

export function ArticlePk(id) {
    return ArticleModel.findByPk(id);
}

export function ArticlesFindAndCountAll(limit, offset) {
    return ArticleModel.findAndCountAll({
        limit,
        offset,
        order: [["updatedAt", "DESC"]],
        include: [{ model: CategoryModel }],
    });
}

export function ArticleUpdate(id, title, content, category) {
    return ArticleModel.update(
        { title, slug: slugify(title), body: content, categoryId: category },
        { where: { id } },
    );
}
