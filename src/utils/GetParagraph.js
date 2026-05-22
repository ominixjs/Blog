export default function GetParagraph(html) {
    const paragraph = [...html.matchAll(/<p\b[^>]*>(.*?)<\/p>/g)].map((item) =>
        item[1].replace(/<[^>]+>/g, "").trim(),
    );

    return paragraph;
}
