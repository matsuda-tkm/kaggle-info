// 参考：https://www.abyblog.online/?p=1725
// 動的サイトをスクレイピング
function phantomJSCloudScraping(URL) {
  const PHANTOMCJSCLOUD_API_KEY = PropertiesService.getScriptProperties().getProperties().PHANTOMJSCLOUD_API_KEY;
  let option = {
    url: URL,
    renderType: "HTML",
    outputAsJson: true
  };
  let payload = JSON.stringify(option);
  payload = encodeURIComponent(payload);
  let apiUrl = "https://phantomjscloud.com/api/browser/v2/" + PHANTOMCJSCLOUD_API_KEY + "/?request=" + payload;
  let response = UrlFetchApp.fetch(apiUrl);
  let json = JSON.parse(response.getContentText());
  let source = json["content"]["data"];
  console.log(URL);
  return source;
}

/**
 * コンペページのoverview, dataをスクレイピングした結果を返す 
 * @param {string} baseURL - 例）https://www.kaggle.com/competitions/llm-20-questions
 * @parma {string} tabName - overview or data
 * @return {string} ページの内容
 */
function getKagglePage(baseURL, tabName) {
  let url = baseURL + "/" + tabName;
  let source = phantomJSCloudScraping(url);
  const $ = Cheerio.load(source);
  return $("main").text();
}
