# Topic Description Generator
## Requirements
- Node.js 20 (newer versions may break)
- Python 3.10+

## Set Up
1. **Clone the repository:**
    ```sh
    git clone git@github.com:cljohnnytsai/GettingStarted.git
    cd GettingStarted
    ```
2. **Create and activate virtual environment**
    ```sh
    cd a_server
    python3 -m venv venv
    ```
    - Mac / Linux / WSL:
    ```sh
    source venv/bin/activate
    ```
    - Windows PowerShell:
    ```sh
    .\venv\Scripts\Activate.ps1
    ```
3. **Setup OpenAI API**
    - Create a file named `.env` inside `a_server` with:
    ```sh
    OPENAI_API_KEY=your_api_key_here
    ```
4. **Install dependencies for backend**
    ```sh
    pip install -r requirements.txt
    ```
5. **Run backend server**
    ```sh
    python server.py
    ```
6. **Install dependencies for frontend**
    - Open a new terminal and run:
    ```sh
    cd a_client
    npm install
    ```
8. **Start development server**
    ```sh
    npm start
    ```
