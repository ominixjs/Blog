import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

//================== Models ===================
import UserModel from "../models/UserModel.js";
import CategoryModel from "../models/CategoryModel.js";

export function Users() {
    return UserModel.findAll({ order: [["updatedAt", "DESC"]] });
}

export function User(email) {
    return UserModel.findOne({ where: { email } });
}

export function UserCreate(name, email, hash) {
    return UserModel.create({ name, email, password: hash });
}

export function UserDelete(id) {
    return UserModel.destroy({ where: { id } });
}
