import nltk
from nltk.tokenize import word_tokenize
from nltk.corpus import stopwords
import json
import re
import torch
from transformers import DistilBertTokenizer, DistilBertForSequenceClassification
from torch.nn.functional import softmax
import random
import sys
import os

# Add the parent directory to sys.path to ensure imports from the 'services' directory are recognized
project_directory = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, project_directory)

# Now you can import other modules from this directory
from services.GeneticAlgorithm import generate_schedules, Room, MeetingTime, Course, Department, Class

# Download required NLTK data
nltk.download('punkt')
nltk.download('stopwords')

# Load pre-trained model tokenizer (vocabulary)
tokenizer = DistilBertTokenizer.from_pretrained('distilbert-base-uncased')

# Load pre-trained model
model = DistilBertForSequenceClassification.from_pretrained('distilbert-base-uncased', num_labels=3)

# Redirect all debug messages to stderr
print("Debug message: Python script started", file=sys.stderr)
print(f"Project directory: {os.getcwd()}", file=sys.stderr)
print(f"Python path: {sys.path}", file=sys.stderr)

class NLPProcessor:
    def __init__(self):
        self.time_patterns = {
            'morning': r'\b(morning|am|early|dawn|breakfast)\b',
            'afternoon': r'\b(afternoon|pm|lunch|noon)\b',
            'evening': r'\b(evening|night|late|dinner)\b'
        }
        self.preference_patterns = {
            'time': self.time_patterns,
            'days': r'\b(monday|tuesday|wednesday|thursday|friday|saturday|sunday|mwf|tth)\b',
            'subject': r'\b(computer science|data structures|artificial intelligence|web development|database)\b'
        }
        self.stop_words = set(stopwords.words('english'))

        # List of varied responses for generating schedules
        self.schedule_responses = [
            "Absolutely! I'll get started on your schedule right away.",
            "Sure thing! Let me prepare a schedule for you.",
            "Of course! I'll generate a schedule for you shortly.",
            "No problem! I'm on it. Generating your schedule now.",
            "You got it! I'll create a schedule for you.",
            "Sure! Just a moment while I generate your schedule.",
            "Consider it done! I'll prepare a schedule for you.",
            "Got it! I'm generating your schedule now.",
            "Sure! Let me work on that schedule for you.",
            "Absolutely! I'll make a schedule for you in no time.",
            "Sure! I'll whip up a schedule for you.",
            "No worries! I'll get that schedule ready for you.",
            "Right away! I'm generating your schedule now.",
            "Sure! I'll take care of that schedule for you.",
            "You bet! I'll create a schedule for you.",
            "Sure! Just a moment while I set up your schedule.",
            "Absolutely! I'll get that schedule sorted for you.",
            "Of course! Let me generate that schedule for you.",
            "Sure! I'll prepare a schedule for you right now.",
            "No problem! I'm on it. Generating your schedule.",
            "You got it! I'll create a schedule for you shortly."
        ]

    def extract_preferences(self, text):
        preferences = {
            'time_preference': [],
            'days_preference': [],
            'subject_preference': []
        }

        text_lower = text.lower()

        # Extract time preferences
        for time_of_day, pattern in self.time_patterns.items():
            if re.search(pattern, text_lower):
                preferences['time_preference'].append(time_of_day)

        # Extract days preferences
        days_matches = re.findall(self.preference_patterns['days'], text_lower)
        preferences['days_preference'] = list(set(days_matches))

        # Handle specific phrases for subjects
        subjects = re.findall(self.preference_patterns['subject'], text_lower)
        preferences['subject_preference'] = list(set(subjects))

        return preferences

    def classify_intent(self, text):
        # Tokenize and prepare input for BERT
        encoded_input = tokenizer(text, return_tensors='pt')
        output = model(**encoded_input)
        probabilities = softmax(output.logits, dim=1)
        predicted_label = torch.argmax(probabilities, dim=1).numpy()[0]

        # Check for greetings
        greetings = ['hello', 'hi', 'hey', 'greetings', 'what\'s up']
        if any(greet in text.lower() for greet in greetings):
            return 'greeting'  # Return a specific intent for greetings

        return predicted_label

    def process_message(self, text):
        try:
            intent = self.classify_intent(text)
            preferences = self.extract_preferences(text)

            if 'generate' in text.lower() and 'schedule' in text.lower():
                response_message = random.choice(self.schedule_responses)
                schedules = generate_schedules(preferences)
                return {
                    'intent': intent,
                    'original_text': text,
                    'response_message': response_message,
                    'schedules': json.loads(schedules)  # Parse the JSON string to Python objects
                }
            elif 'morning' in text.lower() and 'schedule' in text.lower():
                response_message = random.choice(self.schedule_responses)  # Randomly select a response
            elif intent == 'greeting' and not any(keyword in text.lower() for keyword in ['generate', 'schedule']):
                response_message = "Hello! How can I assist you today?"
            elif preferences['time_preference']:
                time_msg = " or ".join(preferences['time_preference'])
                response_message = f"Okay, I will generate a {time_msg} schedule for you."
            elif 'help' in text.lower():
                response_message = "Sure! I can help you with scheduling classes or answering questions about courses. What do you need assistance with?"
            elif 'subject' in text.lower():
                response_message = "Please specify the subject you're interested in. I can help with various subjects like computer science, data structures, and more."
            elif 'thank you' in text.lower() or 'thanks' in text.lower():
                response_message = "You're welcome! If you have any more questions, feel free to ask."
            elif 'what can you do' in text.lower():
                response_message = "I can assist you with scheduling classes, answering questions about courses, and providing information on subjects. How can I help you today?"
            elif 'goodbye' in text.lower() or 'bye' in text.lower():
                response_message = "Goodbye! Have a great day! If you need anything else, just ask."
            else:
                response_message = "I'm sorry, I couldn't find a specific preference in your message."

            return {
                'intent': intent,
                'original_text': text,
                'response_message': response_message
            }
        except Exception as e:
            print(f"Error: {str(e)}", file=sys.stderr)  # Redirect error messages to stderr
            return {
                'error': f"An error occurred: {str(e)}",
                'original_text': text
            }

# Ensure only valid JSON is printed to stdout
if __name__ == "__main__":
    if len(sys.argv) > 1:
        message = sys.argv[1]
        nlp_processor = NLPProcessor()
        result = nlp_processor.process_message(message)
        print(json.dumps(result, default=str))  # This is the only print statement to stdout
    else:
        print(json.dumps({
            'error': 'No message provided'
        }, default=str))

