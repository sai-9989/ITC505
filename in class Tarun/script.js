// 1. Image rollover handled by CSS hover effect

// 2. Change button color on click
const button = document.getElementById('colorButton');
button.addEventListener('click', function() {
    const colors = ['#e74c3c', '#2ecc71', '#9b59b6', '#f1c40f', '#3498db', '#ff9800'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    button.style.backgroundColor = randomColor;
});

// 3. Handle form submission
const form = document.getElementById('myForm');
form.addEventListener('submit', function(event) {
    event.preventDefault();
    const input = document.getElementById('userInput').value.trim();

    // 4. If-Else check for empty input
    if (input === "") {
        alert("⚠️ The input field is empty! Please type something.");
    } else {
        alert("✅ You entered: " + input);

        // 5. Loop through and display each character
        let message = "Characters in your input: ";
        for (let i = 0; i < input.length; i++) {
            message += input[i] + " ";
        }
        document.getElementById('loopResult').textContent = message;
    }
});
