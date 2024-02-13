## 概要
GASを使用して、Kaggleの新着コンペ情報をSlackに通知するBotです。
kaggleAPIでコンペ情報を定期的に取得し、スプレッドシートに書き込みます。
スプレッドシートにないコンペ情報があれば、Slackに通知します。

こちら（https://github.com/koukyo1994/Kaggle-Watcher）のリポジトリを参考に作成しました。

## 使い方
1. Google Driveの任意の場所にスプレッドシートを新規作成する
    - スプレッドシートIDを控えておく
    ```
    https://docs.google.com/spreadsheets/d/【スプレッドシートID】/edit
    ```
1. Google Apps Scriptのプロジェクトを新規作成する
    - メニューバーから「拡張機能」→「Apps Script」を選択
1. 本レポジトリのコード（`.gs`）をコピぺする
    - `main.gs`の`postMessage`関数の第2引数には、通知したいチャンネル名を指定する
1. ライブラリに「SlackApp」を追加する
    - スクリプトIDは`1on93YOYfSmV92R5q59NpKmsyWIQD8qnoLYk-gkQBI92C58SPyA2x1-bq`
1. Slackのアプリを作成する
    - こちら（→https://blog.da-vinci-studio.com/entry/2022/09/13/101530）の記事を参考にSlackアプリを作成
    - アプリの設定画面＞「Features」＞「OAuth & Permissions」＞「Bot User OAuth Token」を控えておく
1. kaggleAPIのBasic認証のためのヘッダーを生成
    - 以下をkaggleの`username`と`key`で置き換えてPythonで実行
    - **注意**：`username`と`key`は[kaggleの設定](https://www.kaggle.com/settings)でAPIトークンを生成したときに得られる`kaggle.json`の中身に記載されているものを使用する
    ```
    import urllib3
    urllib3.util.make_headers(basic_auth="【username】:【key】").get("authorization")
    ```
    - エンコードした文字列を控えておく
1. 左のメニューから「プロジェクトの設定」＞「スクリプトプロパティ」で以下のプロパティを設定する
    - `COMPETITION_LIST_SHEET_ID`: 1で作成したスプレッドシートのID
    - `BASIC_AUTH_ENCODED`: 6で生成した文字列（先頭の`Base `は不要）
    - `token`: 5で作成したSlackアプリのBot User OAuth Token
1. トリガーを適当に設定
    - 実行する関数：`main`
    - イベントのソースを選択：`時間主導型`
