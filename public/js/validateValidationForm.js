function inputValidate(event, form) {
    event.preventDefault();

    // Salva inputs invalidas
    const errs = [];
    console.log(`Inicia -------- ${errs.length}`);

    const inputName = document.getElementById("name");
    verifyValidation(inputName);
    if (inputName.value === "") {
        errs.push(inputName);
    }

    const inputEmail = document.getElementById("email");
    verifyValidation(inputEmail);
    if (inputEmail.value === "" || !inputEmail.value.includes("@")) {
        errs.push(inputEmail);
    }

    const inputPassword = document.getElementById("password");
    const inputRepeatPassword = document.getElementById("password-repeat");
    verifyValidation(inputRepeatPassword);
    if (inputPassword.value !== inputRepeatPassword.value) {
        errs.push(inputRepeatPassword);
    }

    const terms = document.getElementById("terms");
    const checkmark = document.querySelector(".checkmark");
    verifyValidation(checkmark);
    if (!terms.checked) {
        errs.push(checkmark);
    }

    console.log(`Erros -------- ${errs.length}`);
    if (errs[0]) {
        inputsInvalid(errs);
        return;
    }

    console.log(`Finaliza -------- ${errs.length}`);

    // form.submit();
}

function inputsInvalid(errs) {
    errs.forEach((err) => {
        err.classList.add("err");
    });
}

function verifyValidation(input) {
    input.classList.remove("err");
}
