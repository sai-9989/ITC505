// Simple bubble sort script that reacts to a button click

document.getElementById("sortBtn").addEventListener("click", function () {
  const input = document.getElementById("numberInput").value;
  let numbers = input.split(",").map(n => parseFloat(n.trim())).filter(n => !isNaN(n));

  if (numbers.length === 0) {
    document.getElementById("output").textContent = "⚠️ Please enter valid numbers.";
    return;
  }

  // Bubble sort algorithm
  for (let i = 0; i < numbers.length - 1; i++) {
    for (let j = 0; j < numbers.length - i - 1; j++) {
      if (numbers[j] > numbers[j + 1]) {
        [numbers[j], numbers[j + 1]] = [numbers[j + 1], numbers[j]];
      }
    }
  }

  document.getElementById("output").textContent = `✅ Sorted numbers: ${numbers.join(", ")}`;
});
