function getCompetitionList() {
  var baseUrl = "https://www.kaggle.com/api/v1/competitions/list";
  var prop = PropertiesService.getScriptProperties().getProperties();
  
  var basicAuthEncoded = prop.BASIC_AUTH_ENCODED;
  var headers = {
    "Accept": "application/json",
    "Authorization": "Basic " + basicAuthEncoded,
    "Content-Type": "application/x-www-form-urlencoded"
  }
  
  var url = baseUrl + "?group=general";
  
  var options = {
    "method": "GET",
    "headers": headers
  }
  
  var response = UrlFetchApp.fetch(url, options);
  var result = JSON.parse(response.getContentText());
  return result;
}

function extractInfo(info) {
  var id = info.id;
  var url = info.ref;
  var title = info.title;
  var desc = info.description;
  var category = info.category;
  var reward = info.reward;
  var tags = []
  for (var tag of info.tags) {
    tags.push(tag.name);
  }
  var deadline = convertToJST(info.deadline);
  var maxTeamSize = info.maxTeamSize;
  var awardsPoints = info.awardsPoints;
  var isKernelsSubmissionsOnly = info.isKernelsSubmissionsOnly;
  return [id,url,title,desc,category,reward,tags,deadline,maxTeamSize,awardsPoints,isKernelsSubmissionsOnly];
}

function convertToJST(utc_datetime) {
  return Utilities.formatDate(new Date(utc_datetime), "JST", "yyyy年MM月dd日 HH:mm:ss (日本時間)");
  }
