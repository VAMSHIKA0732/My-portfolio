import sys
# pyrefly: ignore [missing-import]
import nltk

sys.stdout.reconfigure(encoding='utf-8')

# pyrefly: ignore [missing-import]
from nltk.sentiment.vader import SentimentIntensityAnalyzer

# Download the VADER lexicon if not already downloaded
# This uses a quiet download by checking if it exists, otherwise it fetches it
try:
    nltk.data.find('sentiment/vader_lexicon.zip')
except LookupError:
    print("Downloading VADER lexicon...")
    nltk.download('vader_lexicon', quiet=True)

def analyze_sentiment(text: str) -> str:
    """
    Analyzes the sentiment of a given text and returns 'Positive', 'Negative', or 'Neutral'.
    """
    analyzer = SentimentIntensityAnalyzer()
    scores = analyzer.polarity_scores(text)
    
    # We use the 'compound' score which is a metric that calculates the sum of all the lexicon ratings
    # which have been normalized between -1(most extreme negative) and +1 (most extreme positive).
    compound = scores['compound']
    
    # Thresholds are typically:
    # compound >= 0.05 is Positive
    # compound <= -0.05 is Negative
    # Between -0.05 and 0.05 is Neutral
    if compound >= 0.05:
        return 'Positive'
    elif compound <= -0.05:
        return 'Negative'
    else:
        return 'Neutral'

if __name__ == "__main__":
    print("Twitter Sentiment Analysis Tool\n" + "-"*30)
    
    sample_tweets = [
        "I absolutely love the new features! Keep up the great work! 😍",
        "This update is terrible. It keeps crashing my phone. 😡",
        "Just a regular day at the office. Nothing much going on.",
        "Not sure how I feel about the latest changes. Sometimes good, sometimes bad.",
        "OMG THIS IS THE BEST THING EVER!!! 🎉",
        "Why is the service down again? So disappointing...",
        "I'm eating an apple."
    ]
    
    for tweet in sample_tweets:
        sentiment = analyze_sentiment(tweet)
        print(f"Tweet: \"{tweet}\"")
        print(f"Sentiment: {sentiment}\n")
