function main() {
  // スプシを取得
  var sheet = getSpreadsheet();
  var table = sheet.getDataRange().getValues();

  // 現在スプシに存在するCompetitionIDを取得する
  var ids_prev = [];
  for (var elem of table) {
    ids_prev.push(elem[0]);
  }

  // 現在開催中のCompetitionを取得する
  var result = getCompetitionList();

  // 新たに開催されたCompetition情報をnew_compへ格納 & スプシに書き込む
  var new_comp = [];
  for (var comp of result) {
    if (!ids_prev.includes(comp.id)) {
      var info = extractInfo(comp);
      new_comp.push(info);
      sheet.appendRow(info);
    }
  }

  id=0; url=1; title=2 ; desc=3; category=4; reward=5; tags=6; deadline=7; maxTeamSize=8; awardsPoints=9; isKernelsSubmissionsOnly=10;
  if (new_comp.length > 0) {
    // new_compの情報をSlackに通知
    for (var comp of new_comp) {
      var message = "📢 新着Kaggleコンペ情報";
      message += "\n\n*" + comp[title] + "*\n";
      message += "•   *説明* ：" + comp[desc] + "\n";
      message += "•   *タグ* ：";
      for (var tag of comp[tags]){
        message += tag + " / ";
      }
      message += "\n";
      message += "•   *コンペの種類* ：" + comp[category];
      if (comp[isKernelsSubmissionsOnly]) {message += " / コードコンペ\n"} else {message += "\n"};
      message += "•   *ポイント獲得* ：";
      if (comp[awardsPoints]) {message += "あり\n"} else{message+="なし\n"};
      message += "•   *チーム最大人数* ：" + comp[maxTeamSize] + "人まで\n";
      message += "•   *賞金総額* ：" + comp[reward] + "\n";
      message += "•   *提出締切* ：" + comp[deadline] + "\n";
      message += "•   *URL* ：" + comp[url];

      // Geminiで要約
      var kaggleContent = "# Overview\n"
      kaggleContent += getKagglePage(comp[url], "overview");
      kaggleContent += "\n\n---\n\n# Data\n";
      kaggleContent += getKagglePage(comp[url], "data");
      kaggleContent += "\n\n---\n\n# Rules\n";
      kaggleContent += getKagglePage(comp[url], "rules");
      var prompt = `

---

以上の内容を注意深く読み、Kaggleコンペティションの内容を以下の出力形式でまとめてください。リストの記号は必ず「•」を使用し、ネストする場合は「◦」を使用すること。
「データの種類」には、例えば「テーブルデータ」「時系列データ」「画像」「自然言語」「音声」「動画」「ログデータ」などを記載する。複数ある場合は複数記載してもよい。
「データセットの内容と構造・変数の説明」は、与えられるファイル、ファイルの概要、変数の説明を記載すること。
「1日の最大提出回数」は「#Rules」の「Submission Limits」に記載されているものである。
「賞金の詳細」は、各順位の賞金まで詳しく書くこと。順位賞以外にもあれば、そのすべての概要と賞金も必ず記載すること。


• *コンペの概要*:
    ◦ *本コンペで解くタスク*:
    ◦ *データの種類*:
• *データセットの内容と構造・変数の説明*:
• *評価指標*:
• *1日の最大提出回数*:
• *賞金の詳細*:`;
      var summary = summarizeGemini(kaggleContent + prompt, temperature=0);
      console.log(summary);
      //　コンペ情報を投稿
      var response = postMessage(message, "C038Z9GD08K");  // #kaggle-info : C038Z9GD08K,  #kaggle-info-test : C06J28GJQDV
      //　リプライで要約を投稿
      postMessage(summary, response.channelID, response.ts);
    } 
  }
}
