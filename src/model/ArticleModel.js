import { Sequelize } from "sequelize";
import connection from "../config/connection.js";

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

export default ArticleMoodel;
