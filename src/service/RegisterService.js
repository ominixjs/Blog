import bcrypt from "bcrypt";

//==================== Repositories ==========================
import * as UserRepository from "../repositories/UserRepository.js";

//=============================== Validators ==============================
import ValidateInputsRegister from "../validations/ValidateInputsRegister.js";
import ValidateEmailAndCache from "../validations/ValidateEmailAndCache.js";

export default async function RegisterService(data) {
    const { name, email, password, terms } = data;

    //================ Valida inputs de um formulário ========================
    const validateInputs = ValidateInputsRegister(name, email, password, terms);
    if (!validateInputs.approved) {
        return {
            approved: false,
            err: validateInputs.err,
        };
    }

    //============= Termo de consetimento ============
    const term = { consent: terms, date: Date.now() };

    //Validar email se já esta cadastrado
    const emailValidateDB = await UserRepository.User(email);
    if (emailValidateDB) {
        return {
            approved: false,
            err: "Email já esta registrado, faça o login",
        };
    }

    //======== Valida origem do email ===============
    const validEmail = await ValidateEmailAndCache(email);

    //======= Valida status do email ======
    if (validEmail.block || validEmail.is_disposable) {
        return {
            approved: false,
            err: "Email inválido",
        };
    }

    //====================
    const saltRounds = 12;

    //=============== Gera hash na senha ===============
    const hash = await bcrypt.hash(password, saltRounds);

    //================= Cria usuario =======================
    await UserRepository.UserCreate(name, email, hash, term);

    return { approved: true };
}
