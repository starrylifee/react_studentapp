require('dotenv').config(); // .env 파일에서 환경 변수를 로드
const OpenAI = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // 여기서 환경 변수를 불러옴
});

exports.handler = async (event) => {
  try {
    // event.body가 유효한 JSON인지 확인
    const { prompt, studentAnswer } = JSON.parse(event.body);

    const completion = await openai.chat.completions.create({
      messages: [
        { role: "system", content: prompt },
        { role: "user", content: studentAnswer }
      ],
      model: "gpt-4o-mini", // 모델 이름 확인
    });

    const aiAnswer = completion.choices[0].message.content.trim();

    return {
      statusCode: 200,
      body: JSON.stringify({ aiAnswer }),
    };
  } catch (error) {
    console.error('Error generating AI response:', error);

    // 에러의 유형에 따라 다른 상태 코드를 반환할 수 있음
    const statusCode = error.response?.status || 500;
    const errorMessage = error.message || 'Failed to generate AI response';

    return {
      statusCode: statusCode,
      body: JSON.stringify({ error: errorMessage }),
    };
  }
};
