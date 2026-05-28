import rateLimit from "express-rate-limit";

//============ limitar solicitações ==========
export default function validateEmailLimiter() {
    return rateLimit({
        windowMs: 1000 * 60 * 15, // tempo limite
        max: 10, // Tentivas
        message: "Muitas tentativas. Tente depois.",
        standardHeaders: true,
        legacyHeaders: false,
    });
}
