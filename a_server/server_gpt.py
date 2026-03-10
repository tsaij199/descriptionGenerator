import openai
from flask_cors import CORS
from flask import Flask, request, jsonify
import serverFcns

app = Flask(__name__)
CORS(app)

from dotenv import load_dotenv
load_dotenv()

@app.route('/generate-description', methods=['POST'])
def gen_description():
    data = request.json
    query = data.get('query')
    customization = data.get('customization')
    try:
        if not customization or customization == '':
            response = openai.chat.completions.create(
                model = "gpt-3.5-turbo",
                messages = [
                    {'role': 'user', 'content' : query},
                    {'role': 'system', 'content': 'Generate \
                     a paragraph description for user query'}
                ]
            )
        else:
            response = openai.chat.completions.create(
                model = 'gpt-3.5-turbo',
                messages = [
                    {'role': 'user', 'content' : query},
                    {'role': 'system', 'content': f'Customize paragraph description \
                    about {query} so that paragraph is customized to be {customization}'}
                ]
            )
        description = response.choices[0].message.content
        return serverFcns.complete(description)
    except Exception as e:
        print(f"An error occurred: {e}")
        return jsonify({'error': 'Failed to generate description'}), 500

@app.route('/generate-summary', methods=['POST'])
def gen_summary():
    data = request.json
    description = data.get('description')
    if not description:
        return jsonify({'error': 'No description provided'}), 400
    try:
        response = openai.chat.completions.create(
            model = "gpt-3.5-turbo",
            messages = [
                {'role': 'user', 'content' : description},
                {'role': 'system', 'content': 'Generate a summary for the given description'}
            ],
            max_tokens = 100,
        )
        summary = response.choices[0].message.content
        return serverFcns.complete(summary)
    except Exception as e:
        print(f"An error occurred: {e}")
        return jsonify({'error': 'Failed to generate summary'}), 500

@app.route('/generate-related-topics', methods=['POST'])
def gen_related_topics():
    data = request.json
    query = data.get('query')
    try:
        response = openai.chat.completions.create(
            model = "gpt-3.5-turbo",
            messages = [
                {'role': 'user', 'content' : query},
                {'role': 'system', 'content': f'Generate a \
                numbered list of 5 topics related to {query}'}
            ],
        )
        relatedTopics = response.choices[0].message.content
        relatedTopics = serverFcns.noNum(relatedTopics)
        relatedTopics = relatedTopics.split("\n")
        topic1 = relatedTopics[0]
        topic2 = relatedTopics[1]
        topic3 = relatedTopics[2]
        topic4 = relatedTopics[3]
        topic5 = relatedTopics[4]
        return jsonify({'topic1': topic1, 'topic2': topic2, 'topic3': topic3, 'topic4': topic4, 'topic5': topic5})
    except Exception as e:
        print(f"An error occurred: {e}")
        return jsonify({'error': 'Failed to generate related topics'}), 500

if __name__ == "__main__":
    app.run(debug=True)