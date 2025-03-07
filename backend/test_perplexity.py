import os
import json
from dotenv import load_dotenv
from openai import OpenAI

# Load environment variables
load_dotenv()

# Get Perplexity API key from environment variables
perplexity_api_key = os.environ.get("PERPLEXITY_API_KEY")

if not perplexity_api_key:
    print("Error: PERPLEXITY_API_KEY not found in environment variables")
    exit(1)

# Set up Perplexity client using OpenAI client with custom base URL
client = OpenAI(api_key=perplexity_api_key, base_url="https://api.perplexity.ai")

# Create messages for the API call
messages = [
    {
        "role": "system",
        "content": "You are a professional football betting analyst specializing in Premier League matches."
    },
    {
        "role": "user",
        "content": "Provide a brief betting analysis for Manchester United vs Liverpool."
    }
]

# Make the API call to Perplexity
try:
    print("Sending request to Perplexity API...")
    response = client.chat.completions.create(
        model="sonar-deep-research",  # Perplexity model
        messages=messages,
        temperature=0.7,
        max_tokens=500
    )
    
    # Extract and print the response content
    content = response.choices[0].message.content
    print("\nPerplexity API Response:")
    print("-" * 50)
    print(content)
    print("-" * 50)
    
    print("\nResponse successfully received from Perplexity API!")
except Exception as e:
    print(f"Error calling Perplexity API: {str(e)}")
