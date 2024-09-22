const videoInput = document.getElementById('videoInput');
const VidElement = document.getElementById('videoElement');

videoInput.addEventListener('change', async (event) => {
    const file = event.target.files[0];

    if (file) {
        // Create a video URL from the file
        const videoURL = URL.createObjectURL(file);
        VidElement.src = videoURL;
        VidElement.style.display = 'block'; // Ensure the video element is visible

        // Wait for the video to load its metadata
        VidElement.onloadedmetadata = () => {
            VidElement.play().then(() => {
                console.log('Video is playing');

                // Capture the stream from the video
                const stream = VidElement.captureStream();
                const audioTracks = stream.getAudioTracks();

                if (audioTracks.length === 0) {
                    console.log('No audio tracks found.');
                    return;
                }

                // Use MediaRecorder to capture the audio stream
                const mediaRecorder = new MediaRecorder(stream, { mimeType: 'audio/webm' });
                let chunks = [];

                mediaRecorder.ondataavailable = (e) => {
                    chunks.push(e.data);
                };

                mediaRecorder.onstop = async () => {
                    const audioBlob = new Blob(chunks, { type: 'audio/webm' });
                    console.log('Audio blob created:', audioBlob);

                    // Send the audio blob to the API
                    await sendAudioToAPI(audioBlob);
                };

                mediaRecorder.onerror = (e) => {
                    console.error('MediaRecorder error:', e);
                };

                // Start recording the audio stream
                mediaRecorder.start();
                console.log('Recording started');

                // Stop recording after a set duration
                setTimeout(() => {
                    mediaRecorder.stop();
                    console.log('Recording stopped');
                }, 5000);  // Stop recording after 5 seconds
            }).catch(error => {
                console.error('Error starting video playback:', error);
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
