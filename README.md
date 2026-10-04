# Topic Description Generator
## Overview

A full-stack topic description generator built with html and css for UI look and feel, JavaScript for frontend logic, Flask for REST API endpoints, and the Gemini API for content generation. 

Users can enter a topic and optional customization instructions to generate a tailored description, 
create a shorter summary, and explore related topics.

Robust UI State Management: Dynamic input locking mechanism to prevent invalid requests, to ensure mutual exclusion during content generation, and to recover from errors to prevent deadlock

## Set Up
1. **Clone the repository:**
    ```sh
    git clone https://github.com/tsaij199/descriptionGenerator
    cd descriptionGenerator
    ```
2. **Create and activate virtual environment**
    ```sh
    python -m venv .venv
    ```
    - Mac / Linux / WSL:
    ```sh
    source .venv/bin/activate
    ```
    - Windows PowerShell:
    ```sh
    .\.venv\Scripts\Activate.ps1
    ```
3. **Setup Gemini API**
    - Create a file named `.env` :
    ```sh
    GEMINI_API_KEY=your_api_key_here
    ```
4. **Install dependencies for backend**
    ```sh
    pip install -r requirements.txt
    ```
5. **Run backend server**
    ```sh
    python server.py
    ```
