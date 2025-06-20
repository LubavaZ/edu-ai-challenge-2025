# Audio File Analyzer

This console application transcribes an audio file, summarizes the transcription, and provides analytics on the content.

## Features

-   Transcribes audio files using OpenAI's Whisper model.
-   Summarizes the transcription using OpenAI's GPT-4o-mini model.
-   Analyzes the transcription to provide:
    -   Total word count
    -   Speaking speed (words per minute)
    -   Frequently mentioned topics
-   Saves the transcription, summary, and analysis to separate files for each run.
-   Outputs the summary and analytics to the console.

## Prerequisites

-   Node.js (v14 or later)
-   An OpenAI API key

## Setup

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd <repository-directory>/11
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Create a `.env` file:**
    Create a file named `.env` in the `11` directory and add your OpenAI API key and the path to your audio file:
    ```env
    OPENAI_API_KEY=your-openai-api-key
    AUDIO_FILE_PATH=path/to/your/audio/file.mp3
    ```
    **Important**: Replace `your-openai-api-key` with your actual OpenAI API key. Replace `path/to/your/audio/file.mp3` with the correct path to the audio file you want to analyze.

## Running the Application

Once the setup is complete, you can run the application with the following command:

```bash
npm start
```

The application will then:
1.  Transcribe the audio file specified in `.env`.
2.  Save the transcription to a `transcription-YYYY-MM-DDTHH-mm-ss-SSSZ.md` file.
3.  Summarize the transcription.
4.  Save the summary to a `summary-YYYY-MM-DDTHH-mm-ss-SSSZ.md` file.
5.  Analyze the transcription.
6.  Save the analysis to an `analysis-YYYY-MM-DDTHH-mm-ss-SSSZ.json` file.
7.  Print the summary and analysis to the console. 