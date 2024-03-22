class Subtitle {
    constructor(start, end, color, text) {
        this.start = start * 200;
        this.end = end * 200;
        this.color = color;
        this.text = text;
    }

    write(ctx) {
        ctx.fillStyle = this.color;
        ctx.font = "20px poppins"

        ctx.fillText(this.text, width / 2 - (ctx.measureText(this.text).width / 2), height - 100);
    }
}