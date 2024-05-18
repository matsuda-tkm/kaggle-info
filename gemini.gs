//　Geminiにプロンプトを投げて、出力内容を返す関数
function summarizeGemini(prompt, temperature=0.9) {
  const GEMINI_API = PropertiesService.getScriptProperties().getProperty("GEMINI_API_KEY");
  const url = `https://generativelanguage.googleapis.com/v1/models/gemini-1.0-pro:generateContent?key=${GEMINI_API}`
  var payload = {
    "contents": [
      {
        "role": "user",
        "parts": [{"text": prompt}]
      }
    ],
    "generationConfig": {
      "temperature": temperature
    },
    "safety_settings": [
      {
        "category": "HARM_CATEGORY_HARASSMENT",
        "threshold": "BLOCK_NONE"
      },
      {
        "category": "HARM_CATEGORY_HATE_SPEECH",
        "threshold": "BLOCK_NONE"
      },
      {
        "category": "HARM_CATEGORY_SEXUALLY_EXPLICIT",
        "threshold": "BLOCK_NONE"
      },
      {
        "category": "HARM_CATEGORY_DANGEROUS_CONTENT",
        "threshold": "BLOCK_NONE"
      }
    ]
  };
  var options = {
    "method": "post",
    "contentType": "application/json",
    "payload": JSON.stringify(payload)
  };

  const res = UrlFetchApp.fetch(url, options);
  const resJson = JSON.parse(res.getContentText());

  if (resJson["candidates"][0]["finishReason"] == "STOP") {
    return resJson["candidates"][0]["content"]["parts"][0]["text"];
  } else {
    return JSON.stringify(res);
  };
}
