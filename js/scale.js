function drawScale() {
    var offsetX = 0;
    var offsetY = 0;
    var scale = 1;
    if (d3.event) {
        offsetX = d3.event.translate[0];
        offsetY = d3.event.translate[1];
        scale = d3.event.scale;
    }
    canvas.beginPath();
    var b = (height * 0.98 - offsetY) / scale;
    var l = (width * 0.01 - offsetX) / scale;
    var s = 10 / scale;

    canvas.font = (15 / scale) + 'px Arial';
    canvas.textAlign = 'center';

    canvas.moveTo(l, b); // Bottom left
    var i;
    var scaleLabels = {1: '1m', 2: '10m', 3: '100m', 4: '1km', 5: '10km'};
    for (i in scaleLabels) {
        var p = Math.pow(10, i);
        canvas.lineTo(l + p, b);
        canvas.lineTo(l + p, b - s);
        canvas.fillText(scaleLabels[i], l + p, b - s * 1.2);
        canvas.moveTo(l + p, b);
    }

    canvas.lineWidth = 2 / scale;
    canvas.strokeStyle = 'black';
    canvas.stroke();
}
