//== Função Auxiliar Global de Data ===
export default function FormatDateTime(date) {
    // Verifica se a data é válida
    if (!date) return "";

    // Cria um objeto Date
    const dateObj = new Date(date);

    // Verifica se a data criada é válida
    if (isNaN(dateObj.getTime())) return "Data Inválida";

    // Formata a data e hora para o padrão brasileiro
    // Especifica dia/mês/ano e hora/minuto/segundo
    return new Intl.DateTimeFormat("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false, // Força o formato 24h
        timeZone: "America/Sao_Paulo", // Garante o fuso horário correto
    }).format(dateObj);
}
