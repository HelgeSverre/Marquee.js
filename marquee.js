let Marquee = function () {
    let running = true;

    let options = {
        fontSize: 25,
        font: "Arial",
        color: "#000",
        bgColor: "#fff",
        speed: 5,
        gap: 8,
        direction: "left-to-right",
    };

    // Canvas
    let canvas, ctx;

    // Sentence
    let sentences = [];
    let sentenceWidth, sentenceHeight = 0;

    function stop() {
        running = false;
    }

    function start() {
        running = true;
        loop();
    }

    function init(canvasEl, overrides) {

        if (!canvasEl instanceof HTMLCanvasElement) {
            console.error("canvasEl must be an instance of a HTMLCanvasElement");
        }

        // Use defaults, only set the text
        if (typeof overrides === "string") {
            overrides = {
                text: overrides,
            }
        }

        // Override defaults
        overrides = Object.assign(options, overrides);

        // If no text was set, show this
        if (!overrides.text) {
            overrides.text = "You did not define a text"
        }

        options = overrides;
        canvas = canvasEl;
        ctx = canvas.getContext("2d");

        reset();
        loop();
    }

    function resetFontSize() {
        ctx.font = options.fontSize + "px " + options.font;
    }

    function reset() {
        // Resize canvas to fit the width
        ctx.canvas.width = window.innerWidth;
        ctx.canvas.height = 40;

        // Set the font-size so we can get the text metrics
        resetFontSize();
        let measurement = ctx.measureText(options.text);

        // Get height and width of the sentence
        sentenceWidth = Math.ceil(measurement.width);
        sentenceHeight = Math.ceil(measurement.actualBoundingBoxAscent + measurement.actualBoundingBoxDescent);

        // Resize the canvas height to fit the text, add 1 px padding on top and bottom to prevent weirdness
        ctx.canvas.height = sentenceHeight + 2;

        // When the canvas is resized the font is somehow reset, so we have to set it again here
        resetFontSize();

        // How many sentences can we fit in the canvas?
        let canFit = Math.ceil(ctx.canvas.width / sentenceWidth * 2);
        if (canFit < 2) canFit = 2;


        // Construct a list of sentence representations so we can keep track of their movement
        for (var i = 0; i < canFit; i++) {
            sentences.push({
                top: ((canvas.height) / 2),
                left: (sentenceWidth + options.gap) * i,
            })
        }
    }

    function findLeftMostSentence() {
        let found = {top: 0, left: 0};

        for (let s of sentences) {
            // Replace found if this sentences is further left
            if (found.left > s.left) {
                found = s;
            }
        }

        return found;
    }

    function findRightMostSentence() {
        let found = sentences[0];

        for (let s of sentences) {
            // Replace found if this sentences is further left
            if (found.left < s.left) {
                found = s;
            }
        }

        return found;
    }


    function update() {
        for (let s of sentences) {

            if (options.direction === "left-to-right") {
                // If this is outside the viewport on the right move it back to the start of the queue
                if (s.left > ctx.canvas.width) {
                    let leftMost = findLeftMostSentence();
                    let offset = sentenceWidth + options.gap;

                    s.left = leftMost.left - offset;
                }

                s.left += options.speed;
            } else if (options.direction === "right-to-left") {
                // If this is outside the viewport on the left move it to the end of the queue
                if (s.left < -(sentenceWidth + options.gap)) {
                    let rightMost = findRightMostSentence();
                    let offset = sentenceWidth + options.gap;

                    s.left = rightMost.left + offset;
                }

                s.left -= options.speed;
            } else {
                throw Error("Direction is invalid");
            }
        }
    }

    function render() {
        // Clears the screen
        ctx.fillStyle = options.bgColor;

        if (options.bgColor.toLocaleLowerCase() === "transparent") {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        } else {
            ctx.fillRect(0, 0, canvas.width, canvas.height);
        }


        // Draw the text
        ctx.fillStyle = options.color;
        ctx.textBaseline = "middle";
        for (let s of sentences) {
            ctx.fillText(options.text, s.left, s.top);
        }
    }

    function loop() {
        if (!running) return;
        update();
        render();

        requestAnimationFrame(loop);
    }

    function destroy() {
        stop();
        ctx = null;
        canvas.remove();
    }


    function swapDirection() {
        if (options.direction === "right-to-left") {
            options.direction = "left-to-right"
        } else {
            options.direction = "right-to-left";
        }
    }

    function setFontSize(size) {
        options.fontSize = size;
        reset();
    }

    return {
        init: init,
        stop: stop,
        start: start,
        destroy: destroy,
        swapDirection: swapDirection,
        reset: reset,
        setFontSize: setFontSize,
    }
};

