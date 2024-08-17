const fetch = require('node-fetch');

exports.handler = async function(event, context) {
  const { question } = JSON.parse(event.body);

  const openAIResponse = await fetch('https://api.openai.com/v1/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: "text-davinci-003",
      prompt: question,
      max_tokens: 100,
    }),
  });

  const result = await openAIResponse.json();

  return {
    statusCode: 200,
    body: JSON.stringify({ answer: result.choices[0].text.trim() }),
  };
};
