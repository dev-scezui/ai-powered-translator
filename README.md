# TranslAI - AI-Powered Medical Translation Assistant

NAO is a Next.js-based medical translation application designed to provide accurate and fast translations for medical contexts. It leverages AI to ensure terminology accuracy and supports speech interaction.

## 🛠️ Installation

To get the project running locally, follow these steps:

1.  **Clone the repository:**

    ```bash
    git clone <repository-url>
    cd nao
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    # or
    yarn install
    # or
    pnpm install
    ```

3.  **Set up environment variables:**

    Create a `.env` file in the root directory and add your Groq API key.

    ```env
    GROQ_API_KEY=your_groq_api_key_here
    ```

4.  **Run the development server:**

    ```bash
    npm run dev
    # or
    yarn dev
    # or
    pnpm dev
    ```

## 🔑 Environment Variables

The application requires the following environment variables to function correctly:

| Variable | Description |
| :--- | :--- |
| `GROQ_API_KEY` | Your API key from Groq Cloud. This is used to authenticate requests to the LLM provider. |
