function getSpreadsheet() {
  var prop = PropertiesService.getScriptProperties().getProperties();
  var ss = SpreadsheetApp.openById(prop.COMPETITION_LIST_SHEET_ID);
  var sheet = ss.getSheetByName("シート1");
  return sheet;
}