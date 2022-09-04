function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}
var canvas = document.querySelector("canvas");
var ctx = canvas === null || canvas === void 0 ? void 0 : canvas.getContext("2d");
var Point = /*#__PURE__*/ function() {
    "use strict";
    function Point(x, y, z) {
        _classCallCheck(this, Point);
        this.x = x;
        this.y = y;
        this.z = z;
    }
    var _proto = Point.prototype;
    _proto.addVectorToPoint = function addVectorToPoint(vector) {
        return new Point(this.x + vector.x, this.y + vector.y, this.z + vector.z);
    };
    _proto.subtractVectorFromPoint = function subtractVectorFromPoint(vector) {
        return new Point(this.x - vector.x, this.y - vector.y, this.z - vector.z);
    };
    _proto.subtractPointFromPoint = function subtractPointFromPoint(point) {
        return new Vector(this.x - point.x, this.y - point.y, this.z - point.z);
    };
    _proto.getDebugValue = function getDebugValue() {
        return "".concat(this.x, " ").concat(this.y, " ").concat(this.z);
    };
    _proto.draw = function draw() {
        var size = this.z / 10;
        var x = this.x - size / 2;
        var y = this.y - size / 2;
        ctx === null || ctx === void 0 ? void 0 : ctx.fillRect(x, y, size, size);
    };
    _proto.setPointToPoint = function setPointToPoint(point) {
        this.x = point.x;
        this.y = point.y;
        this.z = point.z;
    };
    return Point;
}();
var Vector = /*#__PURE__*/ function() {
    "use strict";
    function Vector(x, y, z) {
        _classCallCheck(this, Vector);
        this.x = x;
        this.y = y;
        this.z = z;
    }
    var _proto = Vector.prototype;
    _proto.addVectorToVector = function addVectorToVector(vector) {
        return new Vector(this.x + vector.x, this.y + vector.y, this.z + vector.z);
    };
    _proto.subtractVectorFromVector = function subtractVectorFromVector(vector) {
        return new Vector(this.x - vector.x, this.y - vector.y, this.z - vector.z);
    };
    _proto.getDebugValue = function getDebugValue() {
        return "".concat(this.x, " ").concat(this.y, " ").concat(this.z);
    };
    _proto.multiplyMatrix = function multiplyMatrix(matrix3, matrix1) {
        var newMatrix1 = Array(matrix3.length).fill(0);
        for(var i = 0; i < matrix3.length; i++){
            for(var j = 0; j < matrix3[i].length; j++){
                newMatrix1[i] += +(matrix3[i][j] * matrix1[j]).toFixed(16);
            }
        }
        return newMatrix1;
    };
    _proto.degreeToRadian = function degreeToRadian(degree) {
        return degree * Math.PI / 180;
    };
    _proto.rotate = function rotate(rotationMatrix) {
        var newMatrix1 = this.multiplyMatrix(rotationMatrix, [
            this.x,
            this.y,
            this.z
        ]);
        return new Vector(newMatrix1[0], newMatrix1[1], newMatrix1[2]);
    };
    _proto.rotateXY = function rotateXY(degrees) {
        var radian = this.degreeToRadian(degrees);
        var rotationMatrix = [
            [
                Math.cos(radian),
                -Math.sin(radian),
                0
            ],
            [
                Math.sin(radian),
                Math.cos(radian),
                0
            ],
            [
                0,
                0,
                1
            ], 
        ];
        return this.rotate(rotationMatrix);
    };
    _proto.rotateXZ = function rotateXZ(degrees) {
        var radian = this.degreeToRadian(degrees);
        var rotationMatrix = [
            [
                Math.cos(radian),
                0,
                Math.sin(radian)
            ],
            [
                0,
                1,
                0
            ],
            [
                -Math.sin(radian),
                0,
                Math.cos(radian)
            ], 
        ];
        return this.rotate(rotationMatrix);
    };
    _proto.rotateYZ = function rotateYZ(degrees) {
        var radian = this.degreeToRadian(degrees);
        var rotationMatrix = [
            [
                1,
                0,
                0
            ],
            [
                0,
                Math.cos(radian),
                -Math.sin(radian)
            ],
            [
                0,
                Math.sin(radian),
                Math.cos(radian)
            ], 
        ];
        return this.rotate(rotationMatrix);
    };
    _proto.scale = function scale(x, y, z) {
        var scaleMatrix = [
            [
                x,
                0,
                0
            ],
            [
                0,
                y,
                0
            ],
            [
                0,
                0,
                z
            ], 
        ];
        var scaledMatrix = this.multiplyMatrix(scaleMatrix, [
            this.x,
            this.y,
            this.z
        ]);
        return new Vector(scaledMatrix[0], scaledMatrix[1], scaledMatrix[2]);
    };
    return Vector;
}();
var deep = 300;
var point1 = new Point(1, 2, 1);
var point2 = new Point(0, 4, 4);
var vector1 = new Vector(2, 0, 0);
var vector2 = point1.subtractPointFromPoint(point2);
var vector3 = vector1.addVectorToVector(vector2);
console.log("point1.getDebugValue() === '1 2 1'", point1.getDebugValue() === "1 2 1");
console.log("vector2.getDebugValue() === '1 -2 -3'", vector2.getDebugValue() === "1 -2 -3");
console.log("vector3.getDebugValue() === '3 -2 -3'", vector3.getDebugValue() === "3 -2 -3");
console.log("point1.addVectorToPoint(vector3).getDebugValue() === '4 0 -2'", point1.addVectorToPoint(vector3).getDebugValue() === "4 0 -2");
console.log("point2.subtractVectorFromPoint(vector2).getDebugValue() === '-1 6 7'", point2.subtractVectorFromPoint(vector2).getDebugValue() === "-1 6 7");
console.log("new Vector(3, 4, 5)).rotateXY(90).getDebugValue() === '-4 3 5'", new Vector(3, 4, 5).rotateXY(90).getDebugValue() === "-4 3 5");
console.log("(new Vector(3, 4, 0)).scale(2, 1, 1).getDebugValue() === '6 4 0'", new Vector(3, 4, 0).scale(2, 1, 1).getDebugValue() === "6 4 0");
if (canvas && ctx) {
    ctx.fillStyle = "#fff";
    ctx.fillRect(10, 10, 50, 50);
    var getPoints = function() {
        var points = [];
        for(var i = 0; i < 100; i++){
            points.push(new Point(Math.random() * (canvas === null || canvas === void 0 ? void 0 : canvas.width), Math.random() * (canvas === null || canvas === void 0 ? void 0 : canvas.height), Math.random() * deep));
        }
        return points;
    };
    var points = getPoints();
    var render = function() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for(var i = 0; i < points.length; i++){
            points[i].draw();
        }
    };
    document.body.addEventListener("keyup", function(e) {
        if (e.code === "Space") {
            points = getPoints();
            render();
        }
        if (e.code === "KeyA") {
            var origin = new Point(canvas.width / 2, canvas.height / 2, deep / 2);
            for(var i = 0; i < points.length; i++){
                var pointVector = points[i].subtractPointFromPoint(origin);
                points[i].setPointToPoint(origin);
                points[i] = points[i].addVectorToPoint(pointVector.scale(0.9, 0.9, 0.9));
            }
            render();
        }
        if (e.code === "KeyS") {
            var origin1 = new Point(canvas.width / 2, canvas.height / 2, deep / 2);
            for(var i1 = 0; i1 < points.length; i1++){
                var pointVector1 = points[i1].subtractPointFromPoint(origin1);
                points[i1].setPointToPoint(origin1);
                points[i1] = points[i1].addVectorToPoint(pointVector1.scale(1.1, 1.1, 1.1));
            }
            render();
        }
        if (e.code === "KeyR") {
            var origin2 = new Point(canvas.width / 2, canvas.height / 2, deep / 2);
            for(var i2 = 0; i2 < points.length; i2++){
                var pointVector2 = points[i2].subtractPointFromPoint(origin2);
                points[i2].setPointToPoint(origin2);
                points[i2] = points[i2].addVectorToPoint(pointVector2.rotateYZ(5));
            }
            render();
        }
        if (e.code === "KeyE") {
            var origin3 = new Point(canvas.width / 2, canvas.height / 2, deep / 2);
            for(var i3 = 0; i3 < points.length; i3++){
                var pointVector3 = points[i3].subtractPointFromPoint(origin3);
                points[i3].setPointToPoint(origin3);
                points[i3] = points[i3].addVectorToPoint(pointVector3.rotateYZ(-5));
            }
            render();
        }
    });
    render();
}


//# sourceMappingURL=index.js.map