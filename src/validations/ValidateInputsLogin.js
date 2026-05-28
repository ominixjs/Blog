export default function ValidateInputsLogin(email, password, term) {
    const alertMsg = {
        email: "Email inválido",
        pass: "Senha invalida ou não são divergentes. Minimo 8 digitos",
        term: "Permissão necessária",
    };

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
