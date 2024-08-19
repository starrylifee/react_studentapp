require('dotenv').config(); // .env 파일에서 환경 변수를 로드
const { google } = require('googleapis');

exports.handler = async (event) => {
  console.log("Handler started");

  let settingName;
  try {
    if (event.body) {
      const requestBody = JSON.parse(event.body);
      settingName = requestBody.settingName;
      console.log("Received settingName:", settingName);
    } else {
      console.log("No body found in request");
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Invalid request: No body found' }),
      };
    }
  } catch (error) {
    console.log("Error parsing JSON from request body:", error);
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Invalid JSON format in request body' }),
    };
  }

  // 환경 변수 출력 로그 추가
  console.log("Environment variable (REACT_APP_GOOGLE_CREDENTIALS):", process.env.REACT_APP_GOOGLE_CREDENTIALS);

  let credentials;
  try {
    credentials = JSON.parse(process.env.REACT_APP_GOOGLE_CREDENTIALS);
    console.log("Google credentials parsed successfully");
  } catch (error) {
    console.error("Failed to parse REACT_APP_GOOGLE_CREDENTIALS:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to parse Google credentials' }),
    };
  }

  const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
  });

  const sheets = google.sheets({ version: 'v4', auth });
  const spreadsheetId = process.env.REACT_APP_GOOGLE_SHEET_ID;

  try {
    console.log("Fetching data from Google Sheets...");
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: '시트1!B:C',  // 시트 이름을 실제 이름으로 변경
    });

    const rows = response.data.values;
    let prompt = '';

    rows.forEach(row => {
      if (row[0] === settingName) {
        prompt = row[1];
      }
    });

    console.log("Prompt found:", prompt);
    return {
      statusCode: 200,
      body: JSON.stringify({ prompt }),
    };
  } catch (error) {
    console.error('Error fetching prompt:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to fetch prompt from Google Sheets' }),
    };
  }
};
