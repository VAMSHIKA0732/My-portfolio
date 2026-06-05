from flask import Flask, render_template, request

app = Flask(__name__)

@app.route('/', methods=['GET'])
def home():
    return render_template('index.html')

@app.route('/predict', methods=['POST'])
def predict():
    message = request.form['message']
    # Dummy spam check: if "win" or "prize" in message, spam; else not spam
    prediction = "Spam" if ("win" in message.lower() or "prize" in message.lower()) else "Not Spam"
    return render_template('index.html', prediction=prediction, message=message)

if __name__ == '__main__':
    app.run(debug=True)