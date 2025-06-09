document.addEventListener('DOMContentLoaded', () => {
    const startButton = document.getElementById('startButton');
    const downloadSpeedSpan = document.getElementById('downloadSpeed');
    const uploadSpeedSpan = document.getElementById('uploadSpeed');
    const pingTimeSpan = document.getElementById('pingTime');
    const statusMessage = document.getElementById('statusMessage');
    const loadingSpinner = document.getElementById('loadingSpinner'); 

    const downloadTestUrls = [
        'https://speed.cloudflare.com/__down?bytes=500000', 
        'https://speed.cloudflare.com/__down?bytes=1000000', 
        'https://speed.cloudflare.com/__down?bytes=2000000', 
        'https://speed.cloudflare.com/__down?bytes=5000000'  
    ];

    const uploadTestUrl = 'https://httpbin.org/post'; 
    const uploadTestSize = 1 * 1024 * 1024; 

    startButton.addEventListener('click', startSpeedTest);

    async function startSpeedTest() {
        startButton.disabled = true;
        startButton.textContent = 'در حال تست...';
        statusMessage.classList.remove('visible'); 
        loadingSpinner.classList.remove('hidden'); 
        loadingSpinner.classList.add('visible');

        downloadSpeedSpan.innerHTML = '۰.۰۰ <small>Mbps</small>';
        uploadSpeedSpan.innerHTML = '۰.۰۰ <small>Mbps</small>';
        pingTimeSpan.innerHTML = '۰ <small>ms</small>';
        downloadSpeedSpan.style.animation = 'none';
        uploadSpeedSpan.style.animation = 'none';
        pingTimeSpan.style.animation = 'none';
        void downloadSpeedSpan.offsetWidth; 
        void uploadSpeedSpan.offsetWidth;
        void pingTimeSpan.offsetWidth;

        try {
            statusMessage.textContent = 'در حال تست پینگ...';
            statusMessage.classList.add('visible'); 
            const pingResults = [];
            for (let i = 0; i < 4; i++) { 
                const startTime = performance.now();
                await fetch('https://www.google.com/favicon.ico', { mode: 'no-cors', cache: 'no-store' }); 
                const endTime = performance.now();
                pingResults.push(endTime - startTime);
                await new Promise(resolve => setTimeout(resolve, 100)); 
            }
            const avgPing = Math.round(pingResults.reduce((a, b) => a + b) / pingResults.length);
            pingTimeSpan.innerHTML = `${avgPing} <small>ms</small>`;
            pingTimeSpan.classList.add('animated'); 

            statusMessage.textContent = 'در حال تست دانلود...';
            const downloadSpeeds = [];
            for (const url of downloadTestUrls) {
                const startTime = performance.now();
                const response = await fetch(url);
                const blob = await response.blob(); 
                const endTime = performance.now();
                
                const durationSeconds = (endTime - startTime) / 1000; 
                const downloadedBytes = blob.size; 
                const bitsPerSecond = (downloadedBytes * 8) / durationSeconds; 
                const mbps = (bitsPerSecond / (1024 * 1024)).toFixed(2); 
                downloadSpeeds.push(parseFloat(mbps));
                
                downloadSpeedSpan.innerHTML = `${mbps} <small>Mbps</small>`;
                downloadSpeedSpan.classList.add('animated'); 
                await new Promise(resolve => setTimeout(resolve, 100)); 
            }
            const finalDownloadMbps = (downloadSpeeds.reduce((a, b) => a + b) / downloadSpeeds.length).toFixed(2);
            downloadSpeedSpan.innerHTML = `${finalDownloadMbps} <small>Mbps</small>`;
            downloadSpeedSpan.style.animation = ''; 
            downloadSpeedSpan.classList.remove('animated'); 
            downloadSpeedSpan.style.animation = 'pulse 1s infinite alternate'; 

            statusMessage.textContent = 'در حال تست آپلود...';
            const uploadSpeeds = [];
            const dummyUploadData = new Blob([new ArrayBuffer(uploadTestSize)], { type: 'application/octet-stream' });
            for (let i = 0; i < 2; i++) { 
                const startTime = performance.now();
                await fetch(uploadTestUrl, {
                    method: 'POST',
                    body: dummyUploadData,
                    mode: 'cors',
                    headers: { 'Content-Type': 'application/octet-stream' }
                });
                const endTime = performance.now();

                const durationSeconds = (endTime - startTime) / 1000;
                const uploadedBytes = uploadTestSize;
                const bitsPerSecond = (uploadedBytes * 8) / durationSeconds;
                const mbps = (bitsPerSecond / (1024 * 1024)).toFixed(2);
                uploadSpeeds.push(parseFloat(mbps));
                
                uploadSpeedSpan.innerHTML = `${mbps} <small>Mbps</small>`;
                uploadSpeedSpan.classList.add('animated'); 
                await new Promise(resolve => setTimeout(resolve, 100)); 
            }
            const finalUploadMbps = (uploadSpeeds.reduce((a, b) => a + b) / uploadSpeeds.length).toFixed(2);
            uploadSpeedSpan.innerHTML = `${finalUploadMbps} <small>Mbps</small>`;
            uploadSpeedSpan.style.animation = ''; 
            uploadSpeedSpan.classList.remove('animated'); 
            uploadSpeedSpan.style.animation = 'pulse 1s infinite alternate'; 

            statusMessage.textContent = 'تست کامل شد!';
            statusMessage.classList.add('visible'); 

        } catch (error) {
            console.error('خطا در طول تست سرعت:', error);
            statusMessage.textContent = 'خطا در تست. لطفا دوباره تلاش کنید.';
            statusMessage.classList.add('visible'); 
            downloadSpeedSpan.innerHTML = 'خطا <small>Mbps</small>';
            uploadSpeedSpan.innerHTML = 'خطا <small>Mbps</small>';
            pingTimeSpan.innerHTML = 'خطا <small>ms</small>';
        } finally {
            loadingSpinner.classList.remove('visible');
            loadingSpinner.classList.add('hidden');
            startButton.disabled = false;
            startButton.textContent = 'تست مجدد';
            pingTimeSpan.style.animation = '';
            pingTimeSpan.classList.remove('animated');
            pingTimeSpan.style.animation = 'pulse 1s infinite alternate';
        }
    }
});
