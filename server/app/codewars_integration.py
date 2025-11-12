"""
CodeWars API Integration for SmartHire

This module provides integration with CodeWars API to import coding challenges
into our assessment system without affecting existing functionality.
"""

import requests
import json
from typing import List, Dict, Optional
from datetime import datetime
import time

class CodeWarsAPI:
    """CodeWars API integration class."""
    
    BASE_URL = "https://www.codewars.com/api/v1"
    
    def __init__(self):
        self.session = requests.Session()
        self.session.headers.update({
            'User-Agent': 'SmartHire/1.0'
        })
    
    def get_challenge(self, challenge_id: str) -> Optional[Dict]:
        """Get a specific code challenge by ID or slug."""
        try:
            url = f"{self.BASE_URL}/code-challenges/{challenge_id}"
            response = self.session.get(url, timeout=10)
            
            if response.status_code == 200:
                return response.json()
            elif response.status_code == 404:
                print(f"Challenge not found: {challenge_id}")
                return None
            else:
                print(f"Error fetching challenge {challenge_id}: HTTP {response.status_code}")
                return None
                
        except requests.exceptions.Timeout:
            print(f"Timeout fetching challenge {challenge_id}")
            return None
        except requests.exceptions.RequestException as e:
            print(f"Network error fetching challenge {challenge_id}: {e}")
            return None
        except Exception as e:
            print(f"Unexpected error fetching challenge {challenge_id}: {e}")
            return None
    
    def search_challenges(self, query: str = None, difficulty: str = None, 
                        language: str = None, tags: List[str] = None) -> List[Dict]:
        """
        Search for challenges based on criteria.
        Note: CodeWars API v1 doesn't have a search endpoint, so we'll implement
        a basic search using the challenges we can fetch.
        """
        # Curated list of verified popular challenges
        popular_challenges = [
            "valid-braces",
            "sum-of-positive",
            "opposite-number",
            "remove-first-and-last-character",
            "convert-a-string-to-a-number",
            "even-or-odd",
            "return-negative",
            "string-repeat",
            "century-from-year",
            "grasshopper-summation"
        ]
        
        results = []
        successful_fetches = 0
        
        for challenge_id in popular_challenges:
            try:
                challenge = self.get_challenge(challenge_id)
                if challenge:
                    # Apply filters
                    if difficulty and challenge.get('rank', {}).get('name', '') != difficulty:
                        continue
                    if language and language not in challenge.get('languages', []):
                        continue
                    if tags and not any(tag in challenge.get('tags', []) for tag in tags):
                        continue
                        
                    results.append(challenge)
                    successful_fetches += 1
                
                # Rate limiting - be respectful to CodeWars API
                time.sleep(0.2)
                
            except Exception as e:
                print(f"Error fetching challenge {challenge_id}: {e}")
                continue
        
        print(f"Successfully fetched {successful_fetches}/{len(popular_challenges)} challenges")
        return results
    
    def convert_to_assessment_question(self, challenge: Dict) -> Dict:
        """Convert a CodeWars challenge to our assessment question format."""
        
        # Map CodeWars difficulty to our difficulty levels
        difficulty_mapping = {
            "8 kyu": "beginner",
            "7 kyu": "beginner", 
            "6 kyu": "easy",
            "5 kyu": "easy",
            "4 kyu": "intermediate",
            "3 kyu": "intermediate",
            "2 kyu": "hard",
            "1 kyu": "hard"
        }
        
        rank_name = challenge.get('rank', {}).get('name', '5 kyu')
        difficulty = difficulty_mapping.get(rank_name, 'intermediate')
        
        # Create starter code based on available languages
        languages = challenge.get('languages', ['javascript'])
        starter_code = self._generate_starter_code(languages[0], challenge.get('name', ''))
        
        return {
            'type': 'coding',
            'question': challenge.get('description', ''),
            'points': 10,  # Default points
            'explanation': f"Challenge from CodeWars: {challenge.get('name', '')}",
            'starter_code': starter_code,
            'solution': '',  # We don't have access to solutions via API
            'test_cases': self._generate_test_cases(challenge.get('name', '')),
            'difficulty': difficulty,
            'tags': challenge.get('tags', []),
            'codewars_id': challenge.get('id'),
            'codewars_slug': challenge.get('slug'),
            'codewars_url': challenge.get('url')
        }
    
    def _generate_starter_code(self, language: str, challenge_name: str) -> str:
        """Generate starter code based on language and challenge name."""
        
        # Convert challenge name to function name
        function_name = challenge_name.lower().replace(' ', '_').replace('-', '_')
        
        if language == 'javascript':
            return f"""function {function_name}() {{
    // Your code here
    return null;
}}"""
        elif language == 'python':
            return f"""def {function_name}():
    # Your code here
    pass"""
        elif language == 'java':
            return f"""public class Solution {{
    public static String {function_name}() {{
        // Your code here
        return null;
    }}
}}"""
        else:
            return f"// {language} starter code for {challenge_name}"
    
    def _generate_test_cases(self, challenge_name: str) -> str:
        """Generate basic test cases based on challenge name."""
        return json.dumps([
            {
                "input": "test input",
                "expected": "expected output",
                "description": f"Basic test case for {challenge_name}"
            }
        ])

def import_codewars_challenge(challenge_id: str) -> Optional[Dict]:
    """Import a specific CodeWars challenge as an assessment question."""
    api = CodeWarsAPI()
    challenge = api.get_challenge(challenge_id)
    
    if challenge:
        return api.convert_to_assessment_question(challenge)
    return None

def search_codewars_challenges(difficulty: str = None, language: str = None, 
                             tags: List[str] = None) -> List[Dict]:
    """Search for CodeWars challenges and convert them to assessment questions."""
    api = CodeWarsAPI()
    challenges = api.search_challenges(difficulty=difficulty, language=language, tags=tags)
    
    return [api.convert_to_assessment_question(challenge) for challenge in challenges] 