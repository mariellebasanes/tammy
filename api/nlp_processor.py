import nltk
from nltk.tokenize import word_tokenize
from nltk.corpus import stopwords
from nltk.tag import pos_tag
import re

# Download required NLTK data
nltk.download('punkt')
nltk.download('averaged_perceptron_tagger')
nltk.download('stopwords')

class NLPProcessor:
    def __init__(self):
        self.time_patterns = {
            'morning': r'\b(morning|am|early|dawn|breakfast)\b',
            'afternoon': r'\b(afternoon|pm|lunch|noon)\b',
            'evening': r'\b(evening|night|late|dinner)\b'
        }
        self.preference_patterns = {
            'time': self.time_patterns,
            'days': r'\b(monday|tuesday|wednesday|thursday|friday|weekend)\b',
            'duration': r'\b(\d+\s*(hour|hr|hours|mins|minutes))\b',
            'professor': r'\b(prof|professor|instructor|teacher|mr\.|ms\.|dr\.)\s*[A-Z][a-z]+\b',
            'subject': r'\b(math|science|english|history|programming|computer|database|network)\b'
        }
        self.stop_words = set(stopwords.words('english'))

    def extract_preferences(self, text):
        preferences = {
            'time_preference': [],
            'days_preference': [],
            'duration_preference': [],
            'professor_preference': [],
            'subject_preference': []
        }

        # Extract time preferences
        for time_of_day, pattern in self.time_patterns.items():
            if re.search(pattern, text.lower()):
                preferences['time_preference'].append(time_of_day)

        # Extract other preferences
        text_lower = text.lower()
        
        # Days preference
        days_matches = re.findall(self.preference_patterns['days'], text_lower)
        preferences['days_preference'] = list(set(days_matches))

        # Duration preference
        duration_matches = re.findall(self.preference_patterns['duration'], text)
        preferences['duration_preference'] = duration_matches

        # Professor preference
        professor_matches = re.findall(self.preference_patterns['professor'], text)
        preferences['professor_preference'] = professor_matches

        # Subject preference
        subject_matches = re.findall(self.preference_patterns['subject'], text_lower)
        preferences['subject_preference'] = list(set(subject_matches))

        return preferences

    def classify_intent(self, text):
        tokens = word_tokenize(text.lower())
        tokens = [word for word in tokens if word not in self.stop_words]
        
        # Basic intent classification based on keywords
        intents = {
            'schedule_query': ['schedule', 'class', 'time', 'when'],
            'subject_query': ['subject', 'course', 'offering', 'available'],
            'professor_query': ['professor', 'instructor', 'teacher'],
            'preference_setting': ['prefer', 'want', 'like', 'need'],
            'general_info': ['info', 'information', 'help', 'guide']
        }

        matched_intents = []
        for intent, keywords in intents.items():
            if any(keyword in tokens for keyword in keywords):
                matched_intents.append(intent)

        return matched_intents if matched_intents else ['general_info']

    def process_message(self, text):
        preferences = self.extract_preferences(text)
        intents = self.classify_intent(text)
        
        return {
            'preferences': preferences,
            'intents': intents,
            'original_text': text
        }

