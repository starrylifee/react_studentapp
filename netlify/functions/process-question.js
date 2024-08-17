import OpenAI from "openai";

const openai = new OpenAI();

export const handler = async function(event, context) {
  const { question } = JSON.parse(event.body);

  try {
    const completion = await openai.chat.completions.create({
      messages: [
        { "role": "system", "content": "You are a helpful assistant." },
        { "role": "user", "content": question }
      ],
      model: "gpt-4o-mini",
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ answer: completion.choices[0].message.content.trim() }),
    };
  } catch (error) {
    console.error("OpenAI API error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to fetch response from OpenAI API" }),
    };
  }
};
