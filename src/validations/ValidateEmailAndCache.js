const emailCache = new Map();

export default async function ValidateEmailAndCache(email) {
    //========= Busca pelo email ======
    const cache = emailCache.get(email);

    //======= Valida existencia do email no cache =====
    if (cache && Date.now() < cache.expires) {
        console.log("CACHE ========================");

        return cache.data;
    }

    const controller = new AbortController();

    //=== Evitar travamentos na solicitação
    setTimeout(() => {
        controller.abort();
    }, 5000);

    //=========== Cria params do email ==========
    const params = new URLSearchParams({ email });

    //==== Validação de email do Admin/Cliente pela API ============
    const response = await fetch("https://api.check-mail.org/v2/", {
        signal: controller.signal,
        method: "POST",
        headers: {
            Authorization: `Bearer ${process.env.CHECKMAIL_API_KEY}`,
        },
        body: params,
    });

    //===== Resultado em JSON =========
    const data = await response.json();

    //===== Armazena email temporariamente
    emailCache.set(email, {
        data,
        expires: Date.now() + 1000 * 60 * 10,
    });

    console.log("API ========================");
    return data;
}
