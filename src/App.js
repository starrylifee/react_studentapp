function App() {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(false);

  const handleInputChange = (event) => {
    setQuestion(event.target.value);
  };

  const handleSubmit = async () => {
    setLoading(true); // 로딩 상태 시작
    const response = await fetch('/api/process-question', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ question }),
    });

    const data = await response.json();
    setAnswer(data.answer);
    setLoading(false); // 로딩 상태 종료
  };

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: 'auto' }}>
      <h1>Ask OpenAI</h1>
      <textarea
        value={question}
        onChange={handleInputChange}
        placeholder="Ask a question..."
        rows="4"
        style={{ width: '100%', padding: '10px', fontSize: '16px' }}
      />
      <button onClick={handleSubmit} style={{ marginTop: '10px', padding: '10px 20px', fontSize: '16px' }}>
        문제풀어주세요
      </button>
      {loading && <p>Loading...</p>} {/* 로딩 중일 때 표시 */}
      {answer && (
        <div style={{ marginTop: '20px', padding: '10px', border: '1px solid #ccc', borderRadius: '8px' }}>
          <h2>Answer:</h2>
          <p>{answer}</p>
        </div>
      )}
    </div>
  );
}

export default App;  // 이 부분이 중요합니다.
