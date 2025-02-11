import nltk
from nltk.tokenize import word_tokenize
from nltk.corpus import stopwords
import json
import sys
import re
import torch
from transformers import BertTokenizer, BertForSequenceClassification
from torch.nn.functional import softmax

nltk.download('punkt') 
nltk.download('stopwords')  

tokenizer = BertTokenizer.from_pretrained('bert-base-uncased')

model = BertForSequenceClassification.from_pretrained('bert-base-uncased', num_labels=3)

class NLPProcessor:
    def __init__(self):
        self.time_patterns = {
            'morning': r'\b(morning|am|early|dawn|breakfast)\b',
            'afternoon': r'\b(afternoon|pm|lunch|noon)\b',
            'evening': r'\b(evening|night|late|dinner)\b'
        }
        self.preference_patterns = {
            'time': self.time_patterns,
            'days': r'\b(monday|tuesday|wednesday|thursday|friday|weekend|mwf|tth)\b',
            'subject': r'\b(computer science|data structures|artificial intelligence|web development|database)\b'
        }
        self.stop_words = set(stopwords.words('english'))

    def extract_preferences(self, text):
        preferences = {
            'time_preference': [],
            'days_preference': [],
            'subject_preference': []
        }

        text_lower = text.lower()

        for time_of_day, pattern in self.time_patterns.items():
            if re.search(pattern, text_lower):
                preferences['time_preference'].append(time_of_day)

        days_matches = re.findall(self.preference_patterns['days'], text_lower)
        preferences['days_preference'] = list(set(days_matches))

        subject_matches = re.findall(self.preference_patterns['subject'], text_lower)
        preferences['subject_preference'] = list(set(subject_matches))

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

            if intent == 'greeting':
                response_message = "Hello! How can I assist you today?"
            elif preferences['time_preference']:
                time_msg = " or ".join(preferences['time_preference'])
                response_message = f"Okay, I will generate a {time_msg} schedule for you."
            else:
                response_message = "I'm sorry, I couldn't find a time preference in your message."

            return {
                'intent': intent,
                'original_text': text,
                'response_message': response_message
            }
        except Exception as e:
            return {
                'error': str(e),
                'original_text': text
            }

if __name__ == "__main__":
    if len(sys.argv) > 1:
        message = sys.argv[1]
        nlp_processor = NLPProcessor()
        result = nlp_processor.process_message(message)
        
        print(json.dumps(result, default=str))
    else:
        print(json.dumps({
            'error': 'No message provided'
        }, default=str))

