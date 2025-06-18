require('dotenv').config();
const OpenAI = require("openai");
const readlineSync = require('readline-sync');
const fs = require('fs');

const products = JSON.parse(fs.readFileSync('products.json', 'utf8'));

if (!process.env.OPENAI_API_KEY) {
    console.error('Error: OPENAI_API_KEY is not set.');
    console.log('Please create a .env file and add your OpenAI API key to it.');
    process.exit(1);
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const searchProducts = (args) => {
  let filteredProducts = [...products];
  const { category, maxPrice, minRating, inStock } = args;

  if (category) {
    filteredProducts = filteredProducts.filter(product => product.category.toLowerCase() === category.toLowerCase());
  }
  if (maxPrice) {
    filteredProducts = filteredProducts.filter(product => product.price <= maxPrice);
  }
  if (minRating) {
    filteredProducts = filteredProducts.filter(product => product.rating >= minRating);
  }
  if (inStock) {
    filteredProducts = filteredProducts.filter(product => product.in_stock === inStock);
  }

  return filteredProducts;
};

const tools = [
  {
    type: "function",
    function: {
      name: "searchProducts",
      description: "Searches for products based on specified criteria",
      parameters: {
        type: "object",
        properties: {
          category: {
            type: "string",
            description: "The category of the product",
          },
          maxPrice: {
            type: "number",
            description: "The maximum price of the product",
          },
          minRating: {
            type: "number",
            description: "The minimum rating of the product",
          },
          inStock: {
            type: "boolean",
            description: "Whether the product is in stock",
          },
        },
        required: [],
      },
    },
  },
];

(async () => {
  const query = readlineSync.question('Enter your product search query: ');

  const messages = [
    {
      role: "system",
      content: "You are a helpful assistant that helps users find products based on their preferences. You have access to a product search function. Use it to find products based on the user's query. If a user does not specify a filter, do not include it in your function call.",
    },
    {
      role: "user",
      content: query,
    },
  ];

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4.1-mini",
      messages: messages,
      tools: tools,
      tool_choice: "auto",
    });

    const responseMessage = response.choices[0].message;
    const toolCalls = responseMessage.tool_calls;

    if (toolCalls) {
      const toolCall = toolCalls[0];
      const functionName = toolCall.function.name;
      const functionArgs = JSON.parse(toolCall.function.arguments);
      
      if (functionName === 'searchProducts') {
        const filteredProducts = searchProducts(functionArgs);

        if (filteredProducts.length > 0) {
          console.log('\nFiltered Products:');
          filteredProducts.forEach((product, index) => {
            console.log(`${index + 1}. ${product.name} - $${product.price}, Rating: ${product.rating}, ${product.in_stock ? 'In Stock' : 'Out of Stock'}`);
          });
        } else {
          console.log('No products found matching your criteria.');
        }
      }
    } else {
      console.log('I could not understand your query. Please try again.');
    }
  } catch (error) {
    console.error('Error:', error.message);
  }
})(); 