/*jshint esversion: 6 */
var SnakeGame = (function () {
    function SnakeGame(board, commands) {
        this.board = board;
        this.headOrientations = ["<", "^", ">", "v"];
        this.commands = commands.split("");
        this.initSnake();
        this.startGame();
    }
    ////////////////////
    // Initialization //
    ////////////////////
    // Initializes a linked list to store pieces of the snake. Easy to keep track of the head and the tail
    SnakeGame.prototype.initSnake = function () {
        this.head = this.initHead();
        var currPiece = this.head;
        var nextPiece = this.getNextPiece(this.head);
        while (nextPiece) {
            currPiece.next = nextPiece;
            currPiece = nextPiece;
            nextPiece = this.getNextPiece(currPiece);
        }
        this.tail = currPiece;
    };
    // Initializes the head of the snake linked list by searching the board
    SnakeGame.prototype.initHead = function () {
        var head;
        this.board.every(function (row, rowIndex) {
            var colIndex = Math.max(row.indexOf('<'), row.indexOf('>'), row.indexOf('^'), row.indexOf('v'));
            if (colIndex > -1) {
                var value = row[colIndex];
                head = { value: value, rowIndex: rowIndex, colIndex: colIndex };
                return false;
            }
            return true;
        });
        return head;
    };
    // Gets the next piece in the snake to add to the linked list.
    // Looks to the left, right, top and bottom
    SnakeGame.prototype.getNextPiece = function (piece, nextPiece) {
        if (nextPiece === void 0) { nextPiece = undefined; }
        // Left
        var leftCol = piece.colIndex - 1;
        if (leftCol >= 0)
            if (nextPiece = this.getPiece(piece.rowIndex, leftCol))
                return nextPiece;
        // Right
        var rightCol = piece.colIndex + 1;
        if (rightCol < this.board[0].length)
            if (nextPiece = this.getPiece(piece.rowIndex, rightCol))
                return nextPiece;
        // Top
        var topRow = piece.rowIndex - 1;
        if (topRow >= 0)
            if (nextPiece = this.getPiece(topRow, piece.colIndex))
                return nextPiece;
        // Bottom
        var bottomRow = piece.rowIndex + 1;
        if (bottomRow < this.board.length)
            if (nextPiece = this.getPiece(bottomRow, piece.colIndex))
                return nextPiece;
    };
    // Gets a snake piece at row, col if it exists
    SnakeGame.prototype.getPiece = function (row, col) {
        if (this.board[row][col] === '*') {
            if (!this.isInSnakeLinkedList(row, col)) {
                return { rowIndex: row, colIndex: col };
            }
        }
    };
    // Checks if a piece has been added to the snake linked list
    SnakeGame.prototype.isInSnakeLinkedList = function (row, col) {
        var piece = this.head;
        while (piece) {
            if (piece.rowIndex === row && piece.colIndex === col)
                return true;
            piece = piece.next;
        }
        return false;
    };
    ////////////////////
    // Implementation //
    ////////////////////
    // Runs all given commands
    SnakeGame.prototype.startGame = function () {
        var _this = this;
        this.commands
            .every(function (c) {
            if (c === 'F') {
                if (_this.canAdvance()) {
                    _this.advanceSnake();
                }
                else {
                    _this.killSnake();
                    return false;
                }
            }
            else if (c === 'R')
                _this.rotateRight(1);
            else if (c === 'L')
                _this.rotateRight(3);
            return true;
        });
    };
    // Replaces all pieces with an X
    SnakeGame.prototype.killSnake = function () {
        var piece = this.head;
        while (piece) {
            this.board[piece.rowIndex][piece.colIndex] = 'X';
            piece = piece.next;
        }
    };
    SnakeGame.prototype.rotateRight = function (turns) {
        var orientationIndex = this.headOrientations.indexOf(this.head.value);
        var nextOrientation = this.headOrientations[(orientationIndex + turns) % 4];
        // Update the snake in the linked list and the board
        this.head.value = nextOrientation;
        this.board[this.head.rowIndex][this.head.colIndex] = this.head.value;
    };
    SnakeGame.prototype.canAdvance = function () {
        var nextRow = this.head.rowIndex + this.direction.rowDir;
        var nextCol = this.head.colIndex + this.direction.colDir;
        if (nextRow >= this.board.length || nextRow < 0 || nextCol >= this.board[0].length || nextCol < 0)
            return false;
        if (this.board[nextRow][nextCol] === '*') {
            var tail = this.getTail();
            if (tail.rowIndex === nextRow && tail.colIndex === nextCol)
                return true;
            else
                return false;
        }
        return true;
    };
    // Moves the snake one step in the direction it is facing
    SnakeGame.prototype.advanceSnake = function () {
        // Easiest way to advance the snake is to remove the tail
        this.removeTail();
        // Create a new head ad place it on the board
        var newHead = {
            next: this.head,
            value: this.head.value,
            rowIndex: this.head.rowIndex + this.direction.rowDir,
            colIndex: this.head.colIndex + this.direction.colDir
        };
        this.board[newHead.rowIndex][newHead.colIndex] = newHead.value;
        // Update the old head
        this.head.value = this.length === 0 ? '' : '*';
        this.board[this.head.rowIndex][this.head.colIndex] = this.head.value;
        // Replace the new head
        this.head = newHead;
    };
    // Traverses the linked list to find the tail
    SnakeGame.prototype.getTail = function () {
        var piece = this.head;
        var prev;
        while (piece) {
            prev = piece;
            piece = piece.next;
        }
        return prev;
    };
    // Removes the tail from the board and linked list
    SnakeGame.prototype.removeTail = function () {
        var piece = this.head;
        var prev;
        while (piece.next) {
            prev = piece;
            piece = piece.next;
        }
        this.board[piece.rowIndex][piece.colIndex] = '.';
        prev.next = undefined;
    };
    Object.defineProperty(SnakeGame.prototype, "direction", {
        /////////////
        // Helpers //
        /////////////
        // Gets the direction the snake is facing
        get: function () {
            switch (this.head.value) {
                case ">": return { rowDir: 0, colDir: 1 };
                case "<": return { rowDir: 0, colDir: -1 };
                case "^": return { rowDir: -1, colDir: 0 };
                case "v": return { rowDir: 1, colDir: 0 };
                default: return { rowDir: 0, colDir: 0 };
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SnakeGame.prototype, "length", {
        // Gets the length of the snake
        get: function () {
            var length = 0;
            var currPiece = this.head;
            while (currPiece) {
                length++;
                currPiece = currPiece.next;
            }
            return length;
        },
        enumerable: true,
        configurable: true
    });
    return SnakeGame;
}());
var board = [["*", "*", ">"],
    ["*", ".", "."],
    [".", ".", "."],
    [".", ".", "."],
    [".", ".", "."],
    [".", ".", "."],
    [".", ".", "."]];
var commands = "RFRFFLFLFFRFRFFLFLFFRFRFFLFF";
var game = new SnakeGame(board, commands);
console.log(game.board);
