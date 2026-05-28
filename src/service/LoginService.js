import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

//========================= Repositories ==============================
import * as UserRepository from "../repositories/UserRepository.js";

//========================== Validators ================================
import ValidateInputsLogin from "../validations/ValidateInputsLogin.js";

export default async function LoginService(data) {
    const { email, password, terms } = data;

    //==================== Valida inputs =============================
    const validateInputs = ValidateInputsLogin(email, password, terms);
    if (!validateInputs.approved) {
        return { approved: false, err: validateInputs.err };
    }

    // Busca pelo email no banco de dados
    const user = await UserRepository.User(email);
    // Usuário não encontrado
    if (!user) {
        return {
            approved: false,
            err: "Usuário não cadastrado",
        };
    }

    // Validação de senha
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
        return {
            approved: false,
            err: "Senha ou email incorretos",
        };
    }

    // Gerando token para autenticar usuario por 15min
    const token = jwt.sign({ name: user.name }, process.env.JWT_KEY, {
        expiresIn: "15m",
    });
    
    return {
        approved: true,
        token,
    };
}
