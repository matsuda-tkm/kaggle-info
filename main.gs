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

  // new_compの情報をSlackに通知
  id=0; url=1; title=2 ; desc=3; category=4; reward=5; tags=6; deadline=7; maxTeamSize=8; awardsPoints=9; isKernelsSubmissionsOnly=10;
  if (new_comp.length > 0) {
    message = "📢 新着Kaggleコンペ情報";
    for (var comp of new_comp) {
      message += "\n\n---\n*" + comp[title] + "*\n";
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
    }
    postMessage(message, "#kaggle-info");
  }
}