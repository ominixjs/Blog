export default function ValidateInputsRegister(name, email, password, term) {
    const alertMsg = {
        email: "Email inválido",
        pass: "Senha invalida ou não são divergentes. Minimo 8 digitos",
        name: "Nome inválido",
        term: "Permissão necessária",
    };

    const regexName = /^[A-Za-zÀ-ÿ\s]+$/;
    if (!regexName.test(name) || !name) {
        return { approved: false, err: alertMsg.name };
    }

    const regexEmail = /^[^\s@]+@e[^\s@]+\.[^\s@]+$/;
    if (regexEmail.test(email) || !email) {
        return { approved: false, err: alertMsg.email };
    }

    if (!password || password.length < 8) {
        return { approved: false, err: alertMsg.pass };
    }

    if (term === "off") {
        return { approved: false, err: alertMsg.term };
    }

    return { approved: true };
}
