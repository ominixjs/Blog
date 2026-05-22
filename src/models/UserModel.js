import { Sequelize } from "sequelize";
import connection from "../db/connection.js";

const User = connection.define("users", {
    name: {
        type: Sequelize.STRING,
        allowed: false,
    },
    email: {
        type: Sequelize.STRING,
        allowed: false,
    },
    password: {
        type: Sequelize.STRING,
        allowed: false,
    },
});

User.sync({ force: false });

//==================
export default User;
