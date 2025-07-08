document.addEventListener('DOMContentLoaded', function() {
    console.log('Popup loaded');
    
    const downloadBtn = document.getElementById('downloadBtn');
    const warning = document.getElementById('warning');
    const imageCount = document.getElementById('imageCount');
    
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        const currentTab = tabs[0];
        console.log('Current tab:', currentTab.url);
        
        if (!currentTab.url.includes('discord.com')) {
            console.log('Not on discord.com');
            warning.style.display = 'block';
            downloadBtn.disabled = true;
            return;
        }
        
        chrome.action.getBadgeText({tabId: currentTab.id}, function(badgeText) {
            console.log('Badge text:', badgeText);
            imageCount.textContent = badgeText || '0';
        });
    });
    
    downloadBtn.addEventListener('click', function() {
        console.log('Download button clicked');
        
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            const currentTab = tabs[0];
            console.log('Sending message to tab:', currentTab.id);
            
            if (!currentTab.url.includes('discord.com')) {
                alert('discord.comでのみ利用可能です');
                return;
            }
            
            // コンテンツスクリプトが読み込まれているか確認
            chrome.tabs.sendMessage(currentTab.id, {action: 'ping'}, function(response) {
                console.log('Ping response:', response);
                
                if (chrome.runtime.lastError) {
                    console.error('Ping failed:', chrome.runtime.lastError);
                    alert('コンテンツスクリプトが読み込まれていません。ページを更新してください。');
                    return;
                }
                
                // pingが成功した場合、ダウンロードを実行
                chrome.tabs.sendMessage(currentTab.id, {action: 'downloadImages'}, function(response) {
                    console.log('Download response:', response);
                    
                    if (chrome.runtime.lastError) {
                        console.error('Download failed:', chrome.runtime.lastError);
                        alert('エラーが発生しました: ' + chrome.runtime.lastError.message);
                    } else {
                        console.log('Download initiated successfully');
                        window.close();
                    }
                });
            });
        });
    });
});