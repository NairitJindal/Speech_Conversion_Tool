const videoInput = document.getElementById('videoInput');
const vidElement = document.getElementById('videoElement');
const lang = document.getElementById("Target Language");
const voice = document.getElementById("Voice")


videoInput.addEventListener('change', async (event) => {
    const file = event.target.files[0];
    if (file) {
        // Create a video URL from the file
        const videoURL = URL.createObjectURL(file);
        vidElement.src = videoURL;
        // Wait for the video to load its metadata
        vidElement.onloadedmetadata = () => {
            ffmpeg(file)
                .noVideo()
                audioCodec('libmp3lame')
                .save(outputAudioPath)
                .on('end', () => {
                    console.log('Audio extraction completed successfully.');
                })
                .on('error', (err) => {
                    console.error('An error occurred:', err.message);
                });               
        };
    }
});

async function sendAudioToAPI(audioBlob) {
    const formData = new FormData();
    formData.append('audio', audioBlob, 'extracted-audio.webm');

    try {
        const response = await fetch('https://your-api-url.com/upload-audio', {
            method: 'POST',
            body: formData
        });

        if (response.ok) {
            alert('Audio sent successfully!');
        } else {
            alert('Failed to send audio.');
        }
    } catch (error) {
        console.error('Error sending audio:', error);
        alert('Error sending audio.');
    }
}
