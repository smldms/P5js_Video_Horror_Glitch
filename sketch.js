let noisy, angle;
let cnv; let vid; let video;
let xoff = 0.1;
let scl;
let count = 0;
let maxFrame = 360;
let starterP;
let fast = 0.09;
let a = 255;
let _seed;
let glitch, rPosition = 1000;
p5.disableFriendlyErrors = false;
let fps = 24;
let loading = true;
let pX = 0;

//////////////////VIDEO CAPTURE
let capturer = new CCapture({
    framerate: fps,
    format: 'png',
    name: 'out',
    quality: 50,
    verbose: true
});

function setup() {

    _seed = floor(fxrand() * 999999)
    randomSeed(_seed)
    noiseSeed(_seed)

    vid = createVideo('./assets/xs/' + random(["alien", "shining", "exorcist", "halloween", "psycho", "jaws", "nosferatu", "livingDead", "omen", "reanimator", "vendredi", "haunting", "massacre", "rosemary"]) + '.webm', horror);
    // vid = createVideo('./assets/xs/psycho.webm', horror);



    // cnv = createCanvas(900, 900)
    cnv = createCanvas(windowWidth, windowHeight)
    vid.size(width, height)

    vid.hide()
    vid.volume(0);

    glitch = new Glitch();
    glitch.loadType('jpg');
    glitch.pixelate(1);
    glitch.errors(false);

    background(0)
    frameRate(24)
    rectMode(CENTER)
    angleMode(DEGREES)

    createLoop({ duration: 0.1 })
    animLoop.noiseFrequency(0.1)
}

function draw() {
    capturer.capture(cnv.canvas);
    _seed = floor(fxrand() * 999999)
    randomSeed(_seed)
    noiseSeed(_seed)

    if (loading) {
        loader()
    }
    else {
        // one per second, set single random byte position
        if (frameCount % 60 === 0) {
            rPosition = random(glitch.bytes.length);
        }
        glitch.loadImage(vid);
        glitch.randomByte(rPosition); // single random byte
        glitch.limitBytes(0); // limit bytes to branch
        glitch.randomBytes(1 * fxrand() * 20, 2);
        glitch.buildImage();

        push()
        blendMode(OVERLAY)
        video = vid.get();
        // image(vid, 0, 0);
        image(glitch.image, 0, 0);
        pop()
        push();
        translate(width / 2, height / 2)

        noisy = map(noise(xoff), 0, 1, 0, width);
        scl = width / 50 * noise(xoff);
        const x = sin(animLoop.theta) * cos(animLoop.theta) * width / 3
        const y = cos(noisy) * sin(animLoop.noise(noisy)) * height / 2
        clr = video.get(floor(x), floor(y));
        pop()
        grainy()
        xoff += fast;
        count++;
        if (count == 400) {
            fxpreview()
        }
    }
}

function horror() {
    loop();
    vid.loop();
    loading = false;
}

function loader() {

    background(0)
    translate(width / 2, height / 2)
    push()
    rotate(frameCount * 10)
    arc(0, 0, height / 4, height, QUARTER_PI, PI)
    pop()
    fill(255)
    textSize(width / 50);
    textAlign(CENTER, CENTER);
    text('LOADING', 0, height * 0.15);
}


function grainy() {
    loadPixels();
    let d = pixelDensity();
    let halfImage = 4 * (width * d) * (height * d);
    blendMode(HARD_LIGHT)
    for (let i = 0; i < halfImage; i += 4) {
        grainAmount = random(-23, 23);
        pixels[i] = pixels[i] + grainAmount;
        pixels[i + 1] = pixels[i + 1] + grainAmount;
        pixels[i + 2] = pixels[i + 2] + grainAmount;
        pixels[i + 3] = pixels[i + 3] + grainAmount
    }
    updatePixels();
}

function keyTyped() {

    if (key === 's') {
        capturer.start();
        print('go');
    } else if (key === 'x') {
        capturer.stop();
        capturer.save();
        noLoop();
    }
}