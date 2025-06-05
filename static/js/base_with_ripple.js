document.addEventListener("DOMContentLoaded", () => {
    // Get canvas and setup
    const canvas = document.getElementById("background-canvas");
    const ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    ctx.font = "14px 'Courier New', monospace";

    // Character sets for different themes
    const characters = "ゾムヴデヂ01@#$%&*!^~|\\/";

    // Animation settings
    const fontSize = 14;
    const fadeTrail = 0.05; // How fast old characters fade

    // RIPPLE SYSTEM

    const ripples = [];
    const maxRipples = 15; // Limit total ripples

    class Ripple {
        constructor(x, y, isClick = false) {
            this.x = x;
            this.y = y;
            this.radius = 0;

            // Click ripples are stronger than mouse ripples
            if (isClick) {
                this.maxRadius = 200;
                this.force = 8;
                this.speed = 3;
            } else {
                this.maxRadius = 120;
                this.force = 4;
                this.speed = 2;
            }

            this.age = 0;
            this.maxAge = 60; // How long ripple lasts
        }

        // Update ripple each frame
        update() {
            this.radius += this.speed;
            this.age++;
            // Return false when ripple should be removed
            return this.age < this.maxAge && this.radius < this.maxRadius;
        }

        // Calculate how much this ripple affects a character at (x,y)
        getEffect(x, y) {
            const distance = Math.sqrt((x - this.x) ** 2 + (y - this.y) ** 2);
            const rippleEdge = this.radius;
            const rippleWidth = 40; // How wide the ripple effect is

            // Only affect characters near the ripple edge
            if (distance > rippleEdge - rippleWidth && distance < rippleEdge + rippleWidth) {
                // Fade effect as ripple gets older
                const fadeEffect = 1 - (this.age / this.maxAge);

                // Wave calculation for displacement
                const wave = Math.sin((distance - rippleEdge) / 12) * this.force * fadeEffect;

                // Direction from ripple center to character
                const directionX = distance > 0 ? (x - this.x) / distance : 0;
                const directionY = distance > 0 ? (y - this.y) / distance : 0;

                return {
                    offsetX: directionX * wave * 1.5, // Character displacement
                    offsetY: directionY * wave * 1.5,
                    brightness: fadeEffect * 0.8      // Extra brightness
                };
            }

            // No effect if character is outside ripple
            return { offsetX: 0, offsetY: 0, brightness: 0 };
        }
    }


    // MOUSE INTERACTION

    // Create small ripples when mouse moves
    canvas.addEventListener('mousemove', (e) => {
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        // Don't create too many ripples
        if (ripples.length < maxRipples && Math.random() > 0.85) {
            ripples.push(new Ripple(x, y, false));
        }
    });

    // Create strong ripples when clicking
    canvas.addEventListener('click', (e) => {
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        ripples.push(new Ripple(x, y, true)); // true = click ripple
    });

    // MATRIX RAIN SETUP
    let columns = Math.floor(canvas.width / fontSize);

    // Each column has a falling character with properties
    let drops = Array.from({ length: columns }, () => ({
        y: Math.random() * -100,           // Start above screen
        speed: Math.random() * 0.5 + 0.3,  // Fall speed
        brightness: Math.random() * 0.5 + 0.3 // Base brightness
    }));


    // MAIN ANIMATION LOOP

    function animate() {
        // Create fade trail effect (don't clear completely)
        ctx.fillStyle = `rgba(0, 0, 0, ${fadeTrail})`;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Update all ripples, remove dead ones
        for (let i = ripples.length - 1; i >= 0; i--) {
            if (!ripples[i].update()) {
                ripples.splice(i, 1);
            }
        }

        // Draw each falling character
        drops.forEach((drop, columnIndex) => {
            const x = columnIndex * fontSize;
            const y = drop.y * fontSize;

            // Calculate total ripple effects on this character
            let totalOffsetX = 0;
            let totalOffsetY = 0;
            let totalBrightness = 0;

            ripples.forEach(ripple => {
                const effect = ripple.getEffect(x, y);
                totalOffsetX += effect.offsetX;
                totalOffsetY += effect.offsetY;
                totalBrightness += effect.brightness;
            });

            // Pick random character
            const char = characters[Math.floor(Math.random() * characters.length)];

            // Calculate final brightness (base + ripple effects)
            const finalBrightness = Math.min(1, drop.brightness + totalBrightness);

            // Set color based on brightness
            ctx.fillStyle = `hsla(120, 100%, 50%, ${finalBrightness})`;

            // Draw character with ripple displacement
            ctx.fillText(char, x + totalOffsetX, y + totalOffsetY);

            // Move character down or reset to top
            if (y > canvas.height + 50 || Math.random() > 0.995) {
                // Reset to top with random properties
                drop.y = Math.random() * -50;
                drop.brightness = Math.random() * 0.5 + 0.3;
                drop.speed = Math.random() * 0.5 + 0.3;
            } else {
                // Continue falling
                drop.y += drop.speed;
                // Gradually fade as it falls
                if (drop.brightness > 0.1) {
                    drop.brightness *= 0.998;
                }
            }
        });
    }

    // WINDOW RESIZE HANDLER
    window.addEventListener("resize", () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        ctx.font = "14px 'Courier New', monospace";

        // Recalculate columns and reset drops
        columns = Math.floor(canvas.width / fontSize);
        drops = Array.from({ length: columns }, () => ({
            y: Math.random() * -100,
            speed: Math.random() * 0.5 + 0.3,
            brightness: Math.random() * 0.5 + 0.3
        }));
    });

    // Start animation (60 FPS target)
    setInterval(animate, 16);
});