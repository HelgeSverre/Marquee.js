# Marquee.js

Marquee.js lets you emulate a marquee-like text scrolling behaviour in a canvas element, the text will wrap around creating something akin to a led text scrolling panel.

## Rambling:
So, i figured out that this effect is "impossible" to do with plain CSS, so naturally I whipped up a javascript prototype to do it with a canvas element, and thereafter i turned into a library, as one does...


Why: Don't ask.




## Usage

Check out the [demo](https://codepen.io/helgesverre/pen/OJJqGRd) on CodePen.


```html
<html>
<body>

<canvas id="canvas"></canvas>
<script src="./marquee.js"></script>

<script>
    var marquee = Marquee();
    marquee.init(document.getElementById("canvas"), {
        text: "This text is scrolling",
        font: "monospace",
        fontSize: 25,
        bgColor: "black",
        gap: 10, 
        speed: 10,
        color: "white",
        direction: "right-to-left" // or "left-to-right"
    });

// You can do funky stuff like this:
setInterval(() => marquee.swapDirection(), 5000);


// Or you can stop it
marquee.stop();

// And start it back up... naturally
marquee.start();

// And when you're done playing around, you can destroy it, will delete the canvas from the DOM.
marquee.destroy(); 

</script>

</body>
</html>
```


### Options:

TODO


## Todo

- [ ] Make better documentation
- [ ] Put it on NPM and all those fancy CDN places.