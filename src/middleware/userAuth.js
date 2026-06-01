import jwt from "jsonwebtoken";

export default function userAuth(req, res, next) {
    // Busca token gerado no login
    const token = req.cookies.token;

    if (!token) return res.redirect("/admin/login");

    try {
        // Valida token
        const decoded = jwt.verify(token, process.env.JWT_KEY);
        req.user = decoded;

        next();
    } catch (err) {
        return res.redirect("/home");
    }
}
