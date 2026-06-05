import streamlit as st
from sentiment_analysis import analyze_sentiment

# Set page configuration for a better UI look
st.set_page_config(
    page_title="Tweet Sentiment Analyzer",
    page_icon="🐦",
    layout="centered"
)

st.title("🐦 Twitter Sentiment Analyzer")
st.write("Enter a tweet or a short sentence below to find out if its sentiment is Positive, Negative, or Neutral!")

# Text area for user input
user_input = st.text_area("Your text:", placeholder="e.g. I absolutely love the new features! 😍", height=100)

if st.button("Analyze Sentiment", type="primary"):
    if user_input.strip() == "":
        st.warning("Please enter some text first!")
    else:
        # Get sentiment
        sentiment = analyze_sentiment(user_input)
        
        # Display results with nice UI elements
        st.subheader("Result")
        
        if sentiment == 'Positive':
            st.success("✅ **Positive** sentiment detected!")
            st.balloons()
        elif sentiment == 'Negative':
            st.error("😡 **Negative** sentiment detected.")
        else:
            st.info("😐 **Neutral** sentiment detected.")
            
st.markdown("---")
st.markdown("Built with ❤️ using [NLTK VADER](https://www.nltk.org/) and Streamlit.")
