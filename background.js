chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log('Background received message:', request);
  
  if (request.action === 'download') {
    console.log('Starting download:', request.url);
    
    // URLが有効かチェック
    if (!request.url || !request.url.startsWith('https://')) {
      console.error('Invalid URL:', request.url);
      return;
    }
    
    chrome.downloads.download({
      url: request.url,
      filename: request.filename,
      conflictAction: 'uniquify'
    }, (downloadId) => {
      if (chrome.runtime.lastError) {
        console.error('Download failed for URL:', request.url);
        console.error('Error:', chrome.runtime.lastError);
        
        // フォールバック: プロキシURLを使用
        const proxyUrl = request.url.replace('https://cdn.discordapp.com/', 'https://media.discordapp.net/');
        if (proxyUrl !== request.url) {
          console.log('Trying proxy URL:', proxyUrl);
          chrome.downloads.download({
            url: proxyUrl,
            filename: request.filename,
            conflictAction: 'uniquify'
          }, (downloadId) => {
            if (chrome.runtime.lastError) {
              console.error('Proxy download also failed:', chrome.runtime.lastError);
            } else {
              console.log('Proxy download started:', downloadId);
            }
          });
        }
      } else {
        console.log('Download started successfully:', downloadId);
      }
    });
  }
  
  if (request.action === 'updateBadge') {
    console.log('Updating badge for tab:', sender.tab.id, 'count:', request.count);
    chrome.action.setBadgeText({
      text: request.count > 0 ? request.count.toString() : '',
      tabId: sender.tab.id
    });
    chrome.action.setBadgeBackgroundColor({
      color: '#5865F2'
    });
  }
});