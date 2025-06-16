import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import axios from 'axios';
import 'dotenv/config';

const argv = yargs(hideBin(process.argv))
  .option('service', {
    alias: 's',
    type: 'string',
    description: 'The name of the service to analyze (e.g., "Spotify")',
  })
  .option('text', {
    alias: 't',
    type: 'string',
    description: 'A raw text description of the service to analyze',
  })
  .check((argv) => {
    if (!argv.service && !argv.text) {
      throw new Error('You must provide either a service name (--service) or a text description (--text).');
    }
    if (argv.service && argv.text) {
      throw new Error('You cannot provide both a service name (--service) and a text description (--text).');
    }
    return true;
  })
  .help()
  .alias('help', 'h')
  .argv;

const openAIApiKey = process.env.OPENAI_API_KEY;

if (!openAIApiKey) {
  console.error('Error: OPENAI_API_KEY is not set in the .env file.');
  process.exit(1);
}

const generateReport = async (inputText) => {
  const prompt = `
    Generate a comprehensive, markdown-formatted report about the following service/product: "${inputText}".
    The report must include the following sections:
    - Brief History: [Founding year, milestones, etc.]
    - Target Audience: [Primary user segments]
    - Core Features: [Top 2-4 key functionalities]
    - Unique Selling Points: [Key differentiators]
    - Business Model: [How the service makes money]
    - Tech Stack Insights: [Any hints about technologies used]
    - Perceived Strengths: [Mentioned positives or standout features]
    - Perceived Weaknesses: [Cited drawbacks or limitations]
  `;

  try {
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-4.1-mini',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.5,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${openAIApiKey}`,
        },
      }
    );

    if (response.data.choices && response.data.choices.length > 0) {
      console.log(response.data.choices[0].message.content.trim());
    } else {
      console.error('Error: No response from OpenAI API.');
    }
  } catch (error) {
    console.error('Error calling OpenAI API:', error.response ? error.response.data : error.message);
  }
};

const inputText = argv.service || argv.text;
generateReport(inputText); 