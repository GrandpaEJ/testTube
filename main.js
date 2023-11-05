const express = require('express');
const app = express();
const ytdl = require('ytdl-core');
const fs = require('fs');

app.use(express.static('public'));

app.get('/download', async (req, res) => {
    const videoUrl = req.query.videoUrl;
    const downloadType = req.query.downloadType;
    const resolution = req.query.resolution;
    const downloadPath = req.query.downloadPath || '/sdcard/download/';
    
    if (!videoUrl) {
        res.send('Please provide a valid YouTube video URL.');
        return;
    }

    let videoInfo;
    try {
        videoInfo = await ytdl.getInfo(videoUrl);
    } catch (error) {
        res.send('Invalid YouTube video URL.');
        return;
    }

    let stream;
    if (downloadType === 'audio') {
        stream = ytdl(videoUrl, { quality: 'highestaudio' });
    } else {
        stream = ytdl(videoUrl, { quality: resolution });
    }

    const fileName = videoInfo.videoDetails.title + '.' + (downloadType === 'audio' ? 'mp3' : 'mp4');
    const filePath = downloadPath + fileName;
    stream.pipe(fs.createWriteStream(filePath));

    res.send('Download complete! File saved as ' + fileName);
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
                                       
