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
        self.canvas.beginPath();
        var x = +data[0].x + Driver.offset.x;
        var y = +data[0].y + Driver.offset.y;
        self.canvas.moveTo(x, y);
        while (++i < n) {
            x = +data[i].x + Driver.offset.x;
            y = +data[i].y + Driver.offset.y;
            self.canvas.lineTo(x, y);
        }
        self.canvas.lineWidth = 0.5 / Driver.scale;
        self.canvas.strokeStyle = 'blue';
        self.canvas.stroke();
    };

    this.finish = function () {
        self.ready = true;
        if (self.options) {
            if (typeof self.options.callback == 'function') {
                self.options.callback();
            }
        }
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