require('dotenv').config();
const fs = require('fs');
const path = require('path');
const OpenAI = require('openai');
const { getAudioDurationInSeconds } = require('get-audio-duration');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function main() {
  const audioFilePath = process.env.AUDIO_FILE_PATH;

  if (!audioFilePath) {
    console.error('Please provide the path to the audio file in the .env file (AUDIO_FILE_PATH).');
    return;
  }

  try {
    // 1. Transcription
    const transcription = await transcribeAudio(audioFilePath);
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const transcriptionFilePath = path.join(__dirname, `transcription-${timestamp}.md`);
    fs.writeFileSync(transcriptionFilePath, transcription);
    console.log(`Transcription saved to ${transcriptionFilePath}`);

    // 2. Summarization
    const summary = await summarizeText(transcription);
    const summaryFilePath = path.join(__dirname, `summary-${timestamp}.md`);
    fs.writeFileSync(summaryFilePath, summary);
    console.log(`Summary saved to ${summaryFilePath}`);

    // 3. Analysis
    const audioDuration = await getAudioDurationInSeconds(audioFilePath);
    const analysis = await analyzeText(transcription, audioDuration);
    const analysisFilePath = path.join(__dirname, `analysis-${timestamp}.json`);
    fs.writeFileSync(analysisFilePath, JSON.stringify(analysis, null, 2));
    console.log(`Analysis saved to ${analysisFilePath}`);

    // 4. Output to console
    console.log('\n--- Summary ---');
    console.log(summary);
    console.log('\n--- Analysis ---');
    console.log(JSON.stringify(analysis, null, 2));

  } catch (error) {
    console.error('An error occurred:', error.message);
  }
}

async function transcribeAudio(filePath) {
  console.log('Transcribing audio...');
  const transcription = await openai.audio.transcriptions.create({
    file: fs.createReadStream(filePath),
    model: 'whisper-1',
  });
  return transcription.text;
}

async function summarizeText(text) {
  console.log('Summarizing text...');
  const response = await openai.chat.completions.create({
    model: 'gpt-4.1-mini',
    messages: [
      {
        role: 'system',
        content: 'You are a helpful assistant that summarizes text.',
      },
      {
        role: 'user',
        content: `Please summarize the following text:\n\n${text}`,
      },
    ],
  });
  return response.choices[0].message.content;
}

async function analyzeText(text, audioDuration) {
    console.log('Analyzing text...');
    const wordCount = text.split(/\s+/).length;
    const speakingSpeed = Math.round(wordCount / (audioDuration / 60));

    const response = await openai.chat.completions.create({
        model: 'gpt-4.1-mini',
        messages: [
            {
                role: 'system',
                content: 'You are an expert in text analysis. Extract the most frequently mentioned topics from the text and count their mentions. Return a JSON array of objects with "topic" and "mentions" keys. Only return the top 3-5 topics.'
            },
            {
                role: 'user',
                content: `Analyze the following text and identify the top 3-5 frequently mentioned topics. Please provide the output in JSON format as an array of objects, where each object has a "topic" and "mentions" property. For example: [{"topic": "Customer Onboarding", "mentions": 6}, {"topic": "Q4 Roadmap", "mentions": 4}].\n\nText to analyze:\n${text}`
            }
        ],
        response_format: { type: "json_object" }
    });

    const topics = JSON.parse(response.choices[0].message.content);

    return {
        word_count: wordCount,
        speaking_speed_wpm: speakingSpeed,
        frequently_mentioned_topics: topics.topics || topics,
    };
}

main(); 