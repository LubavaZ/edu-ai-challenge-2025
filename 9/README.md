# Service Analyzer

This is a lightweight console application that accepts a service or product name or description and generates a comprehensive, markdown-formatted report from multiple viewpoints—including business, technical, and user-focused perspectives.

## Setup

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd <repository-directory>/9
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Set up your environment variables:**
    Create a `.env` file in the `9` directory and add your OpenAI API key:
    ```
    OPENAI_API_KEY=your_openai_api_key_here
    ```

## Usage

You can run the application using the following command structure:

### Analyze a known service:

```bash
npm start -- --service "Service Name"
```

Example:
```bash
npm start -- --service "Spotify"
```

### Analyze a raw text description:

```bash
npm start -- --text "A detailed description of the service or product."
```

Example:
```bash
npm start -- --text "A music streaming service with a vast library of songs, podcasts, and personalized playlists."
```

### Save the output to a file:

You can also redirect the output to a file:

```bash
npm start -- --service "Notion" > notion_report.md
``` 