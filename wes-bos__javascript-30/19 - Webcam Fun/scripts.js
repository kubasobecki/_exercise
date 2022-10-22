'use strict';
const video = document.querySelector('.player');
const canvas = document.querySelector('.photo');
const ctx = canvas.getContext('2d');
const strip = document.querySelector('.strip');
const snap = document.querySelector('.snap');

// constraints object required by getUserMedia() method
const constraints = { audio: false, video: true };

async function getVideo(constraints) {
    try {
        let stream = await navigator.mediaDevices.getUserMedia(constraints);
        video.srcObject = stream;
        video.play();
    } catch (err) {
        console.error('ERROR OCCURED: ' + err);
    }
}
getVideo(constraints);

function paintToCanvas() {
    const width = video.videoWidth;
    const height = video.videoHeight;
    canvas.width = width;
    canvas.height = height;

    return setInterval(() => {
        // render image from camera
        ctx.drawImage(video, 0, 0, width, height);

        // get pixel data
        let pixels = ctx.getImageData(0, 0, width, height);

        // Apply funny filters
        pixels = limitComponents(pixels);
        // pixels = redEffect(pixels);
        // pixels = rgbSplit(pixels);
        // pixels = greenScreen(pixels);

        // render filtered image
        ctx.putImageData(pixels, 0, 0);
    }, 10);
}

function takePhoto() {
    // play the sound
    snap.currentTime = 0;
    snap.play();

    // take the data from canvas (base64)
    const data = canvas.toDataURL('image/jpeg', 0.8);
    const linkHTML = `<a href="${data}" download="handsome"><img src="${data}"></a>`;
    strip.insertAdjacentHTML('beforeend', linkHTML);
}

video.addEventListener('canplay', paintToCanvas);

///////////////////////////////////////////////////////

const sliders = document.querySelectorAll('.rgb input');
sliders.forEach(slider => slider.addEventListener('input', correctSliders));

function correctSliders(e) {
    if (e.target === sliders[0] && +sliders[0].value > +sliders[1].value)
        sliders[1].value = +sliders[0].value;
    if (e.target === sliders[1] && +sliders[0].value > +sliders[1].value)
        sliders[0].value = +sliders[1].value;

    if (e.target === sliders[2] && +sliders[2].value > +sliders[3].value)
        sliders[3].value = +sliders[2].value;
    if (e.target === sliders[3] && +sliders[2].value > +sliders[3].value)
        sliders[2].value = +sliders[3].value;

    if (e.target === sliders[4] && +sliders[4].value > +sliders[5].value)
        sliders[5].value = +sliders[4].value;
    if (e.target === sliders[5] && +sliders[4].value > +sliders[5].value)
        sliders[4].value = +sliders[5].value;
}

// Funny filters //

function limitComponents(pixels) {
    // get data from sliders
    const layers = {};
    sliders.forEach(slider => (layers[slider.name] = +slider.value));

    // manipulate pixels
    for (let i = 0; i < pixels.data.length; i += 4) {
        if (pixels.data[i + 0] < layers.rmin) pixels.data[i + 0] = layers.rmin;
        if (pixels.data[i + 1] < layers.gmin) pixels.data[i + 1] = layers.gmin;
        if (pixels.data[i + 2] < layers.bmin) pixels.data[i + 2] = layers.bmin;
        if (pixels.data[i + 0] > layers.rmax) pixels.data[i + 0] = layers.rmax;
        if (pixels.data[i + 1] > layers.gmax) pixels.data[i + 1] = layers.gmax;
        if (pixels.data[i + 2] > layers.bmax) pixels.data[i + 2] = layers.bmax;
    }
    return pixels;
}

function redEffect(pixels) {
    for (let i = 0; i < pixels.data.length; i += 4) {
        pixels.data[i] = pixels.data[i] + 200;
        pixels.data[i + 1] = pixels.data[i + 1] - 50;
        pixels.data[i + 2] = pixels.data[i + 2] / 2;
    }
    return pixels;
}

function rgbSplit(pixels) {
    for (let i = 0; i < pixels.data.length; i += 4) {
        pixels.data[i - 150] = pixels.data[i];
        pixels.data[i + 500] = pixels.data[i + 1];
        pixels.data[i - 550] = pixels.data[i + 2];
    }
    return pixels;
}

function greenScreen(pixels) {
    const layers = {};
    sliders.forEach(slider => (layers[slider.name] = +slider.value));

    for (let i = 0; i < pixels.data.length; i += 4) {
        const red = pixels.data[i];
        const green = pixels.data[i + 1];
        const blue = pixels.data[i + 2];

        if (
            red >= layers.rmin &&
            green >= layers.gmin &&
            blue >= layers.bmin &&
            red <= layers.rmax &&
            green <= layers.gmax &&
            blue <= layers.bmax
        ) {
            pixels.data[i + 3] = 0;
        }
    }
    return pixels;
}
