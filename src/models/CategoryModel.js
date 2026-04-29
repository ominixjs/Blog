import { Sequelize } from "sequelize";
import connection from "../config/connection.js";

const CategoryModel = connection.define("categories", {
  title: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  slug: {
    type: Sequelize.STRING,
    allowNull: false,
  },
});

//====== Criar relação no DB ==========
// CategoryModel.sync({ force: true });

export default CategoryModel;
