function findAllImages() {
  const images = [];
  
  // 画像要素を検索
  const imgElements = document.querySelectorAll('img[src*="cdn.discordapp.com"], img[src*="media.discordapp.net"]');
  
  imgElements.forEach(img => {
    if (img.src && !img.src.includes('avatar') && !img.src.includes('emoji')) {
      // オリジナルファイルのURLを取得
      const originalUrl = getOriginalUrl(img.src);
      if (!images.includes(originalUrl)) {
        images.push(originalUrl);
      }
    }
  });
  
  // リンク要素を検索（画像と動画）
  const linkElements = document.querySelectorAll('a[href*="cdn.discordapp.com"], a[href*="media.discordapp.net"]');
  
  linkElements.forEach(link => {
    if (link.href && isMediaFile(link.href)) {
      // オリジナルファイルのURLを取得
      const originalUrl = getOriginalUrl(link.href);
      if (!images.includes(originalUrl)) {
        images.push(originalUrl);
      }
    }
  });
  
  // 動画要素を検索
  const videoElements = document.querySelectorAll('video[src*="cdn.discordapp.com"], video[src*="media.discordapp.net"]');
  
  videoElements.forEach(video => {
    if (video.src) {
      const originalUrl = getOriginalUrl(video.src);
      if (!images.includes(originalUrl)) {
        images.push(originalUrl);
      }
    }
  });
  
  // source要素を検索
  const sourceElements = document.querySelectorAll('source[src*="cdn.discordapp.com"], source[src*="media.discordapp.net"]');
  
  sourceElements.forEach(source => {
    if (source.src) {
      const originalUrl = getOriginalUrl(source.src);
      if (!images.includes(originalUrl)) {
        images.push(originalUrl);
      }
    }
  });
  
  console.log('Found media files:', images);
  return images;
}

function getOriginalUrl(url) {
  // URLからクエリパラメータを除去してオリジナルファイルのURLを取得
  const baseUrl = url.split('?')[0];
  
  // media.discordapp.netのURLの場合、format=webpなどのサムネイル用パラメータを除去
  if (url.includes('media.discordapp.net') && url.includes('?')) {
    const urlObj = new URL(url);
    const params = new URLSearchParams(urlObj.search);
    
    // width, height, format パラメータを除去（これらはサムネイル用）
    params.delete('width');
    params.delete('height');
    params.delete('format');
    
    // 残りのパラメータがある場合は再構築
    if (params.toString()) {
      return `${baseUrl}?${params.toString()}`;
    }
  }
  
  return baseUrl;
}

function isMediaFile(url) {
  const mediaExtensions = [
    '.png', '.jpg', '.jpeg', '.gif', '.webp', '.bmp', '.svg',
    '.mp4', '.webm', '.mov', '.avi', '.mkv', '.flv', '.wmv'
  ];
  
  // URLから拡張子を取得（クエリパラメータを考慮）
  const urlParts = url.split('?')[0].split('/');
  const filename = urlParts[urlParts.length - 1];
  
  // attachmentsフォルダ内のファイルは基本的にメディアファイルと判定
  const isAttachment = url.includes('/attachments/');
  
  return mediaExtensions.some(ext => filename.toLowerCase().includes(ext)) || isAttachment;
}

function downloadImage(imageUrl, index) {
  // URLから拡張子を取得（オリジナルファイル名から）
  let extension = 'jpg'; // デフォルト
  
  // URLパスから拡張子を取得
  const urlParts = imageUrl.split('?')[0].split('/');
  const filename = urlParts[urlParts.length - 1];
  const dotIndex = filename.lastIndexOf('.');
  if (dotIndex > 0) {
    extension = filename.substring(dotIndex + 1);
  }
  
  const isVideo = ['.mp4', '.webm', '.mov', '.avi', '.mkv', '.flv', '.wmv'].includes(`.${extension.toLowerCase()}`);
  const prefix = isVideo ? 'discord_video' : 'discord_image';
  const downloadFilename = `${prefix}_${index}_${Date.now()}.${extension}`;
  
  console.log('Downloading media:', imageUrl, 'as', downloadFilename, 'type:', isVideo ? 'video' : 'image');
  
  chrome.runtime.sendMessage({
    action: 'download',
    url: imageUrl,
    filename: downloadFilename
  });
}

function downloadAllImages() {
  const images = findAllImages();
  
  if (images.length === 0) {
    alert('このチャンネルには画像・動画が見つかりませんでした。');
    return;
  }
  
  const videoCount = images.filter(url => {
    // URLから拡張子を正しく取得
    const urlParts = url.split('?')[0].split('/');
    const filename = urlParts[urlParts.length - 1];
    const dotIndex = filename.lastIndexOf('.');
    if (dotIndex > 0) {
      const extension = filename.substring(dotIndex).toLowerCase();
      return ['.mp4', '.webm', '.mov', '.avi', '.mkv', '.flv', '.wmv'].includes(extension);
    }
    return false;
  }).length;
  
  const imageCount = images.length - videoCount;
  
  let message = `${images.length}個のメディアファイルをダウンロードしますか？`;
  if (imageCount > 0 && videoCount > 0) {
    message = `${imageCount}個の画像と${videoCount}個の動画をダウンロードしますか？`;
  } else if (videoCount > 0) {
    message = `${videoCount}個の動画をダウンロードしますか？`;
  } else {
    message = `${imageCount}個の画像をダウンロードしますか？`;
  }
  
  const confirmDownload = confirm(message);
  if (!confirmDownload) {
    return;
  }
  
  images.forEach((imageUrl, index) => {
    setTimeout(() => {
      downloadImage(imageUrl, index + 1);
    }, index * 500);
  });
  
  alert(`${images.length}個のメディアファイルのダウンロードを開始しました。`);
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log('Content script received message:', request);
  
  if (request.action === 'ping') {
    console.log('Ping received');
    sendResponse({ success: true });
    return true;
  }
  
  if (request.action === 'downloadImages') {
    console.log('Download images request received');
    downloadAllImages();
    sendResponse({ success: true });
    return true;
  }
  
  if (request.action === 'getImageCount') {
    const images = findAllImages();
    console.log('Image count request:', images.length);
    sendResponse({ count: images.length });
    return true;
  }
});

function updateBadge() {
  const images = findAllImages();
  console.log('Updating badge with count:', images.length);
  
  chrome.runtime.sendMessage({
    action: 'updateBadge',
    count: images.length
  }).catch((error) => {
    console.log('Badge update failed (this is normal):', error);
  });
}

const observer = new MutationObserver(() => {
  updateBadge();
});

console.log('Content script loaded on:', window.location.href);

if (document.body) {
  console.log('Document body exists, starting observer');
  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
  updateBadge();
} else {
  console.log('Document body not ready, waiting for DOMContentLoaded');
  document.addEventListener('DOMContentLoaded', () => {
    console.log('DOMContentLoaded fired, starting observer');
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
    updateBadge();
  });
}