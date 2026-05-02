import { Sequelize } from "sequelize";
import connection from "../db/connection.js";
import CategoryModel from "./CategoryModel.js";

const ArticleMoodel = connection.define("articles", {
    title: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    slug: { type: Sequelize.STRING, allowNull: false },
    body: {
        type: Sequelize.TEXT,
        allowNull: false,
    },
});

// Relacionamento 1 - P - N
CategoryModel.hasMany(ArticleMoodel);

// Relacionamento 1 - P - 1
ArticleMoodel.belongsTo(CategoryModel);

//====== Criar relação no DB ==========
// ArticleMoodel.sync({ force: true });

export default ArticleMoodel;
