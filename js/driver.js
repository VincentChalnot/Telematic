Driver = function (driverId, canvas, options) {
    var self = this;
    this.canvas = canvas;
    this.options = options;
    this.driverId = driverId;
    this.trips = {};
    this.ready = false;
    this.loadTrips = function () {
        self.__loadTripRecursive(1);
    };

    this.__loadTripRecursive = function (tripId) {
        var previousData, dx, dy;
        d3.csv('/drivers/' + self.driverId + '/' + tripId + '.csv')
            .get(function (error, rows) {
                if (error) {
                    self.finish();
                    return;
                }
                self.trips[tripId] = rows;
                self.drawTrip(tripId);
                self.__loadTripRecursive(++tripId);
            });
    };

    this.draw = function () {
        var tripId;
        for (tripId in self.trips) {
            self.drawTrip(tripId);
        }
    };

    this.drawTrip = function (tripId) {
        var data = self.trips[tripId];
        var i = 0, n = data.length;
        self.canvas.lineWidth = 0.5 / Driver.scale;
        if (Driver.simpleDraw) {
            self.canvas.strokeStyle = 'blue';
        } else {
            self.canvas.strokeStyle = this.getColor(0);
        }
        var x, y;
        var lastX = +data[0].x + Driver.offset.x;
        var lastY = +data[0].y + Driver.offset.y;
        if (Driver.simpleDraw) {
            self.canvas.beginPath();
            self.canvas.moveTo(lastX, lastY);
        }
        while (++i < n) {
            if (!Driver.simpleDraw) {
                self.canvas.beginPath();
                self.canvas.moveTo(lastX, lastY);
            }
            x = +data[i].x + Driver.offset.x;
            y = +data[i].y + Driver.offset.y;
            self.canvas.lineTo(x, y);
            if (!Driver.simpleDraw) {
                self.canvas.strokeStyle = this.getColor(Math.sqrt((x - lastX) * (x - lastX) + (y - lastY) * (y - lastY)));
                self.canvas.stroke();
                lastX = x;
                lastY = y;
            }
        }
        if (Driver.simpleDraw) {
            self.canvas.stroke();
        }
    };

    this.finish = function () {
        self.ready = true;
        if (self.options) {
            if (typeof self.options.callback == 'function') {
                self.options.callback();
            }
        }
    };

    this.getColor = function(value){
        //value from 0 to 1
        var hue = (100 - value * 4).toString(10);
        return "hsl(" + hue + ",100%,50%)";
    };

    this.loadTrips();
    if (!Driver.drivers) {
        Driver.drivers = {};
    }
    Driver.drivers[driverId] = this;
};

Driver.drawDrivers = function () {
    var driverId;
    for (driverId in Driver.drivers) {
        Driver.drivers[driverId].draw();
    }
};

Driver.scale = 1;
Driver.offset = {
    x: 0,
    y: 0
};
Driver.simpleDraw = true;