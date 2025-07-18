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
  const { category, maxPrice, minPrice, minRating, maxRating, inStock, keywords } = args;

  if (category) {
    filteredProducts = filteredProducts.filter(product => product.category.toLowerCase() === category.toLowerCase());
  }
  if (maxPrice) {
    filteredProducts = filteredProducts.filter(product => product.price <= maxPrice);
  }
  if (minPrice) {
    filteredProducts = filteredProducts.filter(product => product.price >= minPrice);
  }
  if (minRating) {
    filteredProducts = filteredProducts.filter(product => product.rating > minRating);
  }
  if (maxRating) {
    filteredProducts = filteredProducts.filter(product => product.rating < maxRating);
  }
  if (inStock !== undefined) {
    filteredProducts = filteredProducts.filter(product => product.in_stock === inStock);
  }
  if (keywords) {
    const searchTerms = keywords.toLowerCase().split(' ');
    filteredProducts = filteredProducts.filter(product => {
      const productName = product.name.toLowerCase();
      return searchTerms.every(term => {
        const escapedTerm = term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const regex = new RegExp(`\\b${escapedTerm}\\b`);
        return regex.test(productName);
      });
    });
  }

  return filteredProducts;
};

const tools = [
  {
    type: "function",
    function: {
      name: "searchProducts",
      description: "Searches for products based on specified criteria. Do not make assumptions about parameters that are not specified by the user.",
      parameters: {
        type: "object",
        properties: {
          keywords: {
            type: "string",
            description: "Specific words from the user's query to filter by product name. For example, if the user asks for 'men's clothing', you should use 'men's' as a keyword to distinguish it from 'women's clothing'."
          },
          category: {
            type: "string",
            description: "The category of the product. Available categories are: Electronics, Fitness, Kitchen, Books, Clothing.",
          },
          maxPrice: {
            type: "number",
            description: "The maximum price of the product",
          },
          minPrice: {
            type: "number",
            description: "The minimum price of the product",
          },
          minRating: {
            type: "number",
            description: "The minimum rating of the product (e.g. 4.5)."
          },
          maxRating: {
            type: "number",
            description: "The maximum rating of the product."
          },
          inStock: {
            type: "boolean",
            description: "Filter by stock availability. Set to true for in-stock products, false for out-of-stock products."
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
      content: "You are a helpful assistant that helps users find products based on their preferences. You have access to a product search function. Use it to find products based on the user's query. If a user does not specify a filter, do not include it in your function call. If a user's query implies that they are looking for a product that is out of stock, you should set the inStock parameter to false. Do not infer values for parameters that are not explicitly mentioned by the user. Pay close attention to descriptive words in the user's query (e.g., 'men's', 'women's', 'gaming', 'wireless') and use the `keywords` parameter to refine the search within categories.",
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