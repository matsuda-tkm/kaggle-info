## kaggle-info

Google Apps Script（GAS）を使用してKaggleの新着コンペ情報をSlackに通知するBotです。このBotはkaggleAPIを利用して定期的にコンペ情報を取得し、スプレッドシートに書き込みます。スプレッドシートにない新しいコンペ情報がある場合、その情報をSlackに通知します。

参考にしたリポジトリはこちらです：[koukyo1994/Kaggle-Watcher](https://github.com/koukyo1994/Kaggle-Watcher)。

### 準備

1. **スプレッドシートの作成**  
   Google Driveの任意の場所に新しいスプレッドシートを作成し、スプレッドシートIDを控えておきます。
   ```
   https://docs.google.com/spreadsheets/d/【スプレッドシートID】/edit
   ```
2. **Google Apps Scriptプロジェクトの作成**  
   新しいGoogle Apps Scriptプロジェクトを作成します。メニューバーから「拡張機能」→「Apps Script」を選択してください。

3. **スクリプトのコピー**  
   本レポジトリの`.gs`ファイルの内容をプロジェクトにコピーします。`main.gs`の`postMessage`関数の第2引数には、通知したいSlackのチャンネル名を指定してください。

4. **SlackAppライブラリの追加**  
   GASに「SlackApp」ライブラリを追加します。スクリプトIDは以下の通りです。
   ```
   1on93YOYfSmV92R5q59NpKmsyWIQD8qnoLYk-gkQBI92C58SPyA2x1-bq
   ```

### Slackアプリの設定

1. **Slackアプリの作成**  
   Slackアプリを作成します。詳細な手順については、[こちらの記事](https://blog.da-vinci-studio.com/entry/2022/09/13/101530)を参考にしてください。アプリの設定画面から「Features」→「OAuth & Permissions」に進み、「Bot User OAuth Token」を控えておきます。

2. **チャンネルにアプリを追加**
   通知したいチャンネルにSlackアプリを追加します。

### Kaggle API認証情報の設定

1. **kaggleAPIの認証情報生成**  
   kaggleの`username`と`key`を使用してBasic認証のためのヘッダーを生成します。以下のPythonコードを実行し、エンコードされた文字列を控えておきます。`username`と`key`は、kaggleの設定ページでAPIトークンを生成した際に得られる`kaggle.json`に記載されています。
   ```python
   import urllib3
   urllib3.util.make_headers(basic_auth="【username】:【key】").get("authorization")
   ```

### GASプロジェクトの設定

1. **スクリプトプロパティの設定**  
   GASプロジェクトの左メニューから「プロジェクトの設定」→「スクリプトプロパティ」に進み、以下のプロパティを設定します。
   - `COMPETITION_LIST_SHEET_ID`: **スプレッドシートの作成**で作成したスプレッドシートのID。
   - `BASIC_AUTH_ENCODED`: **kaggleAPIの認証情報生成**で生成したエンコードされた文字列（先頭の`Base `は不要）。
   - `token`: **Slackアプリの作成**で控えたSlackアプリのBot User OAuth Token。

### トリガーの設定

1. **トリガーの追加**  
   プロジェクトのトリガーページに進み、「トリガーを追加」を選択します。実行する関数には`main`を、イベントのソースには`時間主導型`を選択して、適当な間隔（例：1時間）でBotが実行されるように設定します。