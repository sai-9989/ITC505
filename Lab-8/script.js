document.getElementById("generateBtn").addEventListener("click", () => {
    const noun = document.getElementById("noun").value.trim();
    const adjective = document.getElementById("adjective").value.trim();
    const verb = document.getElementById("verb").value.trim();
    const result = document.getElementById("result");

    if (!noun || !adjective || !verb) {
        result.style.display = "block";
        result.innerHTML = "⚠️ Please fill out all fields!";
        return;
    }

    const story = `
        Once upon a time, there was a ${adjective} ${noun}.  
        Every day, it loved to ${verb} around the kingdom,  
        surprising everyone with its amazing energy!
    `;

    result.style.display = "block";
    result.innerHTML = story;
});
