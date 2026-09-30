# 待辦清單 Web App

這是一個在 GitHub Copilot 實戰工作坊中完成的待辦清單 Web App，透過簡潔的介面協助使用者管理日常待辦事項。專案聚焦於純前端實作、基本的資料持久化，以及使用 GitHub Copilot 輔助完成開發流程。

## 線上展示

[GitHub Pages](https://D11516140.github.io/My-1st-copilot/)
> 請將上方網址中的帳號與 repository 名稱替換成實際的 GitHub Pages 網址。

## 功能

- 新增待辦事項，並忽略空白內容。
- 將待辦事項標記為完成或恢復為未完成。
- 刪除單筆待辦事項。
- 依「全部」、「未完成」與「已完成」篩選待辦事項。
- 沒有符合目前篩選條件的項目時，顯示對應的空狀態提示。
- 批次清除所有已完成事項，刪除前會顯示確認對話框。
- 沒有已完成事項時停用「清除已完成」按鈕。
- 顯示目前未完成的待辦事項數量。
- 使用瀏覽器 `localStorage` 保存待辦資料，重新整理頁面後仍可保留。
- 具備適合桌面與行動裝置使用的響應式版面配置。

## 技術

- 使用純 HTML、CSS 與原生 JavaScript。
- 不使用前端框架或外部套件。
- 不依賴外部 CDN，可離線開啟與使用。
- 使用 `localStorage` 保存待辦資料。
- 使用 CSS 變數集中管理介面色彩與元件樣式。
- 使用原生 DOM API 建立與更新待辦清單內容。

## 開發方式

本專案以 GitHub Copilot Agent Mode 協助進行需求拆解、程式實作與問題修正。開發過程中透過 MCP 連接 Microsoft Learn 與 GitHub，查閱官方文件、讀取 repository issue，並將修復內容整理成 Pull Request。

`.github/prompts` 中的 `fix-issue.prompt.md` 定義了 agentic workflow：先讀取指定 issue 並提出修改計畫，取得確認後建立修復分支、修改必要檔案、進行驗證、提交推送，最後建立 Pull Request。這讓 issue 到修復與審查之間的流程更有一致性。

## 我學到什麼

- 如何使用 GitHub Copilot Agent Mode 將自然語言需求轉換成可執行的開發步驟。
- 如何透過 MCP 取得 Microsoft Learn 官方文件與 GitHub repository 資訊。
- 如何使用 `localStorage` 保存前端應用程式的使用者資料。
- 如何設計篩選、空狀態與批次操作，讓待辦清單的操作結果更清楚。
- 如何透過 agentic workflow 將 issue、分支、驗證、提交與 Pull Request 串成完整流程。
![工作坊完成徽章](https://img.shields.io/badge/GitHub_Copilot_實戰工作坊-已完成-1F883D?style=for-the-badge&logo=githubcopilot&logoColor=white)