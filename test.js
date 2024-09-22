const videoInput = document.getElementById('videoInput');
const audioPlayer = document.getElementById('audioPlayer');

videoInput.addEventListener('change', async (event) => {
    const file = event.target.files[0];
    if (file) {
        const videoURL = URL.createObjectURL(file);

        // Use the video URL as the source for the audio player
        audioPlayer.src = captureStream().getAudioTracks();
        audioPlayer.hidden = false;
        audioPlayer.play();

        // Automatically send the audio to the API after extraction
        await sendAudioToAPI(file);
    }
});

async function sendAudioToAPI(file) {
    const formData = new FormData();
    formData.append('audio', file); // Sending the video file, as it contains the audio

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