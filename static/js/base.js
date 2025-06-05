document.addEventListener("DOMContentLoaded", () => {
    const canvas = document.getElementById("background-canvas");
    const ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const chars = "@#$%&*!^~|\/:";
    const fontSize = 14;
    const columns = canvas.width / fontSize;
    const drops = Array.from({ length: columns }).fill(1);

    function drawMatrixRain() {
        ctx.fillStyle = "rgba(15, 15, 15, 0.05)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = "rgba(0,255,204, 1)";
        ctx.font = `${fontSize}px monospace`;

        for (let i = 0; i < drops.length; i++) {
            const text = chars.charAt(Math.floor(Math.random() * chars.length));
            ctx.fillText(text, i * fontSize, drops[i] * fontSize);

            if (drops[i] * fontSize > canvas.height || Math.random() > 0.975) {
                drops[i] = 0;
            }

            drops[i]++;
        }
    }

    setInterval(drawMatrixRain, 100);

    window.addEventListener("resize", () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });
});
