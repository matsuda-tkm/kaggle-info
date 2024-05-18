// Slackにメッセージを投稿し、`channelID`と`ts`を返す
// tsを入れるとスレッド返信
function postMessage(message, channelId, ts) {
  var prop = PropertiesService.getScriptProperties().getProperties();
  var slackApp = SlackApp.create(prop.BOT_USER_OAUTH_TOKEN);
  var response = slackApp.postMessage(channelId, message, {thread_ts: ts});
  return {"channelID": channelId, "ts": response.ts};
}
