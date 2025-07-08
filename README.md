# Discord Image Downloader Chrome Extension

現在選択中のDiscordチャンネルの画像をすべてダウンロードするChrome拡張機能です。

## 機能

- 現在表示されているDiscordチャンネルの画像を自動検出
- ワンクリックで全画像をダウンロード
- 拡張機能のバッジで画像数を表示
- 重複画像の自動除去
- 安全なファイル名での保存

## インストール方法

1. このリポジトリをクローンまたはダウンロード
2. Chromeで `chrome://extensions/` を開く
3. 右上の「デベロッパー モード」を有効化
4. 「パッケージ化されていない拡張機能を読み込む」をクリック
5. このプロジェクトのフォルダを選択

## 使用方法

1. Discord（https://discord.com）を開く
2. 画像をダウンロードしたいチャンネルを表示
3. 拡張機能のアイコンをクリック
4. 「画像をダウンロード」ボタンをクリック
5. 確認ダイアログで「OK」をクリック

## 対応している画像形式

- PNG
- JPG/JPEG
- GIF
- WebP

## 注意事項

- Discord.comでのみ動作します
- 大量の画像がある場合、ダウンロードに時間がかかる場合があります
- 一度に多くの画像をダウンロードする際は、ブラウザの設定で複数ファイルのダウンロードを許可してください

## ファイル構成

- `manifest.json` - 拡張機能の設定
- `content.js` - Discordページで動作するスクリプト
- `background.js` - バックグラウンドで動作するサービスワーカー
- `popup.html` - ポップアップのUI
- `popup.js` - ポップアップの動作制御

## 開発

この拡張機能は Manifest V3 で開発されています。

---

# Discord Image Downloader Chrome Extension (English)

A Chrome extension that downloads all images from the currently selected Discord channel.

## Features

- Automatically detects images in the currently displayed Discord channel
- Download all images with a single click
- Display image count on the extension badge
- Automatic duplicate image removal
- Safe filename saving

## Installation

1. Clone or download this repository
2. Open `chrome://extensions/` in Chrome
3. Enable "Developer mode" in the top right
4. Click "Load unpacked"
5. Select this project folder

## Usage

1. Open Discord (https://discord.com)
2. Navigate to the channel with images you want to download
3. Click the extension icon
4. Click the "Download Images" button
5. Click "OK" in the confirmation dialog

## Supported Image Formats

- PNG
- JPG/JPEG
- GIF
- WebP

## Notes

- Only works on Discord.com
- Downloads may take time when there are many images
- Please allow multiple file downloads in your browser settings when downloading many images at once

## File Structure

- `manifest.json` - Extension configuration
- `content.js` - Script that runs on Discord pages
- `background.js` - Service worker that runs in the background
- `popup.html` - Popup UI
- `popup.js` - Popup behavior control

## Development

This extension is developed using Manifest V3.