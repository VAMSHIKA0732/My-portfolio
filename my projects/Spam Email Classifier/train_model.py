import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.naive_bayes import MultinomialNB
import pickle

# Example dataset
data = {
    'text': [
        "Congratulations! You won a free lottery ticket",
        "Hi team, the meeting is at 10 am",
        "Win a brand new car by clicking this link",
        "Please find attached the project report",
        "You have been selected for a prize",
        "Let's catch up tomorrow",
        "Cheap meds available here, buy now!",
        "Are we still meeting today?"
    ],
    'label': [1, 0, 1, 0, 1, 0, 1, 0]
}

df = pd.DataFrame(data)
X = df['text']
y = df['label']

vectorizer = TfidfVectorizer(stop_words='english')
X_vectorized = vectorizer.fit_transform(X)

model = MultinomialNB()
model.fit(X_vectorized, y)

# Save model & vectorizer
with open('model.pkl', 'wb') as f:
    pickle.dump(model, f)

with open('vectorizer.pkl', 'wb') as f:
    pickle.dump(vectorizer, f)

print("✅ Model and vectorizer saved successfully.")
