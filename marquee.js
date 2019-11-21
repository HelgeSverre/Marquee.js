var Marquee = function () {
    var running = true;

    var options = {
        fontSize: 25,
        color: "#000",
        bgColor: "#fff",
        speed: 5,
        gap: 8,
        direction: "left-to-right",
    };

    // Canvas
    var canvas, ctx;

    // Sentence
    var sentence = "marquee";
    var sentences = [];
    var sentenceWidth, sentenceHeight = 0;

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

        sentence = options.text;

        calculateSentenceMetrics();
        loop();
    }

    function resetFontSize() {
        ctx.font = options.fontSize + "px Arial";
    }

    function calculateSentenceMetrics() {
        // Resize canvas to fit the width
        ctx.canvas.width = window.innerWidth;
        ctx.canvas.height = 40;

        // Set the font-size so we can get the text metrics
        resetFontSize();
        var measurement = ctx.measureText(sentence);

        // Get height and width of the sentence
        sentenceWidth = measurement.width;
        sentenceHeight = measurement.actualBoundingBoxAscent + measurement.actualBoundingBoxDescent;

        // Resize the canvas height to fit the text, add 1 px padding on top and bottom to prevent clipping
        ctx.canvas.height = sentenceHeight + 2;

        // When the canvas is resized the font is somehow reset, so we have to set it again here
        resetFontSize();

        // How many sentences can we fit?
        var canFit = Math.ceil(ctx.canvas.width / sentenceWidth * 2);
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
        var found = sentences[0];

        for (var s of sentences) {
            // Replace found if this sentences is further left
            if (found.left > s.left) {
                found = s;
            }
        }

        return found;
    }

    function findRightMostSentence() {
        var found = sentences[0];
        
        for (var s of sentences) {
            // Replace found if this sentences is further left
            if (found.left < s.left) {
                found = s;
            }
        }

        return found;
    }


    function update() {
        for (var s of sentences) {

            if (options.direction === "left-to-right") {
                // If this is outside the viewport on the right move it back to the start of the queue
                if (s.left > ctx.canvas.width) {
                    var leftMost = findLeftMostSentence();
                    var offset = sentenceWidth + options.gap;

                    // Move it behind the leftmost sentence, aka put it offscreen before the other ones
                    s.left = leftMost.left - offset;
                }

                s.left += options.speed;
            } else if (options.direction === "right-to-left") {
                // If this is outside the viewport on the left move it to the end of the queue
                if (s.left < -(sentenceWidth + options.gap)) {
                    var rightMost = findRightMostSentence();
                    var offset = sentenceWidth + options.gap;

                    // Move it behind the leftmost sentence, aka put it offscreen before the other ones
                    s.left = rightMost.left + offset;
                }

                s.left -= options.speed;
            }
        }
    }

    function draw() {
        // Clears the screen
        ctx.fillStyle = options.bgColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);


        // Draw the text
        ctx.fillStyle = options.color;
        ctx.textBaseline = "middle";
        for (var s of sentences) {
            ctx.fillText(sentence, s.left, s.top);
        }
    }

    function loop() {
        if (!running) return;
        update();
        draw();

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

    return {
        init: init,
        stop: stop,
        start: start,
        destroy: destroy,
        swapDirection: swapDirection,
    }
};

