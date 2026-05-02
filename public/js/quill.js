const Font = Quill.import("formats/font");

Font.whitelist = ["worksans", "roboto", "opensans"];

Quill.register(Font, true);

console.log(Font.whitelist);

const quill = new Quill("#editor", {
    theme: "snow",
    modules: {
        toolbar: [
            [{ font: Font.whitelist }, { size: [] }],
            [{ header: [1, 2, 3, false] }],

            ["bold", "italic", "underline", "strike"],

            [{ color: [] }, { background: [] }],

            [{ script: "sub" }, { script: "super" }],

            [{ list: "ordered" }, { list: "bullet" }],
            [{ indent: "-1" }, { indent: "+1" }],

            [{ align: [] }],

            ["link", "image", "video"],

            ["blockquote", "code-block"],

            ["clean"],
        ],
    },
});

const form = document.getElementById("contentForm");
form.addEventListener("submit", () => {
    document.getElementById("content").value = quill.root.innerHTML;
});
