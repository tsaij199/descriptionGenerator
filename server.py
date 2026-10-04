from functools import wraps
from flask import Flask, request, jsonify, render_template
from flask_cors import CORS
from dotenv import load_dotenv
from google import genai

load_dotenv()
app = Flask(__name__)
CORS(app)

client = genai.Client()
MODEL = 'gemini-3.5-flash-lite'

def ask_gemini(prompt):
    """Helper function to send a prompt to Gemini via chat and log failures."""
    try:
        chat = client.chats.create(model=MODEL)
        response = chat.send_message(prompt)
        return response.text
    except Exception as e:
        print(f"An error occurred: {e}")
        return None

def require_json(*required_fields):
    """Decorator to parse JSON, ensure required fields, log failures, and hide details from client."""
    def decorator(function):
        @wraps(function)
        def decorated_function():
            data = request.get_json(silent=True)
            
            if not data:
                print(f"[SECURITY] Blocked request to {request.path}: Invalid or missing JSON body.")
                return jsonify({'error': 'Bad request'}), 400
            
            for field in required_fields:
                if not data.get(field):
                    print(f"[SECURITY] Blocked request to {request.path}: Missing required field '{field}'.")
                    return jsonify({'error': 'Bad request'}), 400
                    
            return function(data)
        return decorated_function
    return decorator

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/generate-description', methods=['POST'])
@require_json('query')
def gen_description(data):
    query = data.get('query')
    customization = data.get('customization')

    if not customization or not customization.strip():
        prompt = f"Generate a paragraph description about {query}"
    else:
        prompt = f"Generate a paragraph description about {query} that is {customization}"
        
    text = ask_gemini(prompt)
    
    if not text:
        return jsonify({'error': 'Failed to generate description'}), 500
    else:
        return jsonify({"response": text})

@app.route('/generate-summary', methods=['POST'])
@require_json('description')
def gen_summary(data):
    description = data.get('description')
    
    prompt = f"Give a summarized version of the following while maintaining its style:\n\n{description}"
    
    text = ask_gemini(prompt)
    
    if not text:
        return jsonify({'error': 'Failed to generate summary'}), 500
    else:
        return jsonify({"response": text})

@app.route('/generate-related-topics', methods=['POST'])
@require_json('query')
def gen_related_topics(data):
    query = data.get('query')
    
    prompt = (
        f"Give 5 short related topics to {query}, one per line, unnumbered."
        f"Include {query} in the related topic if context is relevant."
    )    

    text = ask_gemini(prompt)

    if not text:
        return jsonify({'error': 'Failed to generate related topics'}), 500
    else:
        topics = [line.strip() for line in text.split('\n') if line.strip()]
            
        return jsonify({
            'topic1': topics[0],
            'topic2': topics[1],
            'topic3': topics[2],
            'topic4': topics[3],
            'topic5': topics[4]
        })

if __name__ == "__main__":
    app.run(debug=True, port=5000)