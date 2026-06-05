async function checkNews() {
  const text = document.getElementById('newsText').value.trim();
  const resultBox = document.getElementById('result');

  if (!text) {
    resultBox.textContent = "Please enter some news content.";
    resultBox.className = "result-box fake";
    resultBox.style.display = "block";
    return;
  }

  resultBox.textContent = "Checking...";
  resultBox.className = "result-box";
  resultBox.style.display = "block";

  try {
    const response = await fetch('/predict', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({ text })
    });

    const data = await response.json();

    resultBox.textContent = `🕵️ Result: ${data.label} (Confidence: ${data.confidence}%)`;
    resultBox.className = `result-box ${data.label.toLowerCase()}`;
    resultBox.style.display = "block";
  } catch (error) {
    resultBox.textContent = "❌ Error: Could not connect to the backend.";
    resultBox.className = "result-box fake";
    resultBox.style.display = "block";
  }
}
