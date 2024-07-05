# ai_service.py

import os
from transformers import pipeline
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Get the Hugging Face API key from environment variables
HUGGINGFACE_API_KEY = os.getenv('HUGGINGFACE_API_KEY')

# Initialize the Hugging Face text generation pipeline
generator = pipeline('text-generation', model='gpt2', use_auth_token=HUGGINGFACE_API_KEY)

def generate_content(prompt):
    response = generator(prompt, max_length=50)
    return response[0]['generated_text']
