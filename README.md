# TranslAI - AI-Powered Medical Translation Assistant

NAO is a Next.js-based medical translation application designed to provide accurate and fast translations for medical contexts. It leverages AI to ensure terminology accuracy and supports speech interaction.

## 🏗️ Code Structure

The project follows a modern Next.js App Router structure with TypeScript.

### Directory Layout

- **`src/app/`**: Core application logic and routing.
  - `actions.ts`: Server Actions handling API integrations and business logic securely on the server.
  - `page.tsx`: The main entry point and UI composition.
  - `layout.tsx`: Root layout definition including global styles and fonts.
  - `globals.css`: Global Tailwind CSS styles.

- **`src/components/`**: Modular UI components.
  - `Header.tsx`: Application navigation and branding.
  - `LanguageSelector.tsx`: Interface for selecting source and target languages.
  - `SpeechRecorder.tsx`: Handles microphone input and speech-to-text interactions.
  - `TranslationDisplay.tsx`: Renders the view for original and translated output.

- **`src/lib/`**: Shared utilities and helper functions.
  - `rate-limit.ts`: Custom implementation of a token bucket rate limiter.

## 🤖 AI Tools & Integration

NAO utilizes high-performance AI models for translation tasks.

- **Groq API**: The application uses Groq's high-speed inference engine for near real-time responses.
- **OpenAI SDK**: The `openai` Node.js library is used as the client to communicate with the Groq API endpoint (`https://api.groq.com/openai/v1`).
- **Model**: Currently configured to use `openai/gpt-oss-120b` (via Groq) for high-fidelity medical translations.

## 🔒 Security Considerations

Security is a priority in the application architecture.

### 1. Rate Limiting
To prevent abuse and ensure service availability, a custom rate limiting mechanism is implemented in `src/lib/rate-limit.ts`.
- **Mechanism**: Token bucket algorithm tracking requests by IP address.
- **Policy**: Limits users to **10 requests per minute**.
- **Implementation**: Applied at the Server Action level (`translateTextAction`), ensuring checks occur before any AI API calls are made.

### 2. Server-Side Execution
- **API Key Protection**: All interactions with the AI provider happen within Server Actions (`src/app/actions.ts`). The `GROQ_API_KEY` is never exposed to the client browser.
- **Environment Variables**: Sensitive configuration is managed via `.env` files and accessed securely at runtime.

### 3. Input Handling
- **Validation**: Basic input validation ensures empty or malformed requests are rejected early.
- **Prompt Engineering**: System prompts are carefully constructed to restrict the AI's output strictly to translation tasks, minimizing the risk of prompt injection or irrelevant outputs.
