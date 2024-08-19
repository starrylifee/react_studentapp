import React, { useState } from 'react';

function App() {
  const [settingName, setSettingName] = useState('');
  const [prompt, setPrompt] = useState('');
  const [studentAnswer, setStudentAnswer] = useState('');
  const [aiAnswer, setAiAnswer] = useState('');
  const [loadingPrompt, setLoadingPrompt] = useState(false);
  const [loadingAI, setLoadingAI] = useState(false);

  const handleInputChange = (event) => {
    setSettingName(event.target.value);
  };

  const handleGetPrompt = async () => {
    setLoadingPrompt(true);
    const response = await fetch('/api/get-prompt', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ settingName }),
    });

    const data = await response.json();
    setPrompt(data.prompt || '프롬프트를 찾을 수 없습니다.');
    setLoadingPrompt(false);
  };

  const handleGenerateAnswer = async () => {
    if (studentAnswer.trim() === '') {
      alert('활동을 입력하세요.');
      return;
    }

    setLoadingAI(true);
    const response = await fetch('/api/generate-answer', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt, studentAnswer }),
    });

    const data = await response.json();
    setAiAnswer(data.aiAnswer);
    setLoadingAI(false);
  };

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: 'auto', backgroundColor: '#f9f9f9', borderRadius: '15px', boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)' }}>
      <h1 style={{ color: '#5D5C61', fontFamily: 'Arial, sans-serif', textAlign: 'center' }}>학생용 교육 도구 홈</h1>
      <p style={{ color: '#379683', textAlign: 'center', fontSize: '18px' }}>이 도구를 사용하여 AI가 생성한 프롬프트에 따라 다양한 교육 활동을 수행할 수 있습니다.</p>

      <input
        type="text"
        value={settingName}
        onChange={handleInputChange}
        placeholder="🔑 코드 입력"
        style={{ width: '100%', padding: '12px', fontSize: '16px', marginBottom: '10px', borderRadius: '8px', border: '1px solid #379683', boxSizing: 'border-box' }}
      />
      <button 
        onClick={handleGetPrompt} 
        disabled={loadingPrompt} 
        style={{ marginTop: '10px', padding: '12px 20px', fontSize: '16px', backgroundColor: '#5D5C61', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', width: '100%' }}
      >
        {loadingPrompt ? '프롬프트 불러오는 중...' : '📄 프롬프트 가져오기'}
      </button>

      {prompt && (
        <>
          <h2 style={{ color: '#5D5C61', marginTop: '20px' }}>프롬프트:</h2>
          <p style={{ color: '#379683', backgroundColor: '#EDF5E1', padding: '10px', borderRadius: '8px' }}>{prompt}</p>
          <textarea
            value={studentAnswer}
            onChange={(e) => setStudentAnswer(e.target.value)}
            placeholder="📝 활동 입력"
            rows="4"
            style={{ width: '100%', padding: '12px', fontSize: '16px', marginBottom: '10px', borderRadius: '8px', border: '1px solid #379683', boxSizing: 'border-box' }}
          />
          <button 
            onClick={handleGenerateAnswer} 
            disabled={loadingAI} 
            style={{ marginTop: '10px', padding: '12px 20px', fontSize: '16px', backgroundColor: '#5D5C61', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', width: '100%' }}
          >
            {loadingAI ? 'AI가 대화를 생성하는 중...' : '🤖 AI 대화 생성'}
          </button>
          {aiAnswer && (
            <div style={{ marginTop: '20px', backgroundColor: '#8EE4AF', padding: '10px', borderRadius: '8px' }}>
              <h2 style={{ color: '#5D5C61' }}>AI 생성 대화:</h2>
              <p style={{ color: '#05386B' }}>{aiAnswer}</p>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default App;
