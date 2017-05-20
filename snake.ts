/*jshint esversion: 6 */

class SnakeGame {

	private headOrientations = ["<", "^", ">", "v"]

	private commands: string[]
	private head: piece
	private tail: piece

	constructor(public board: string[][], commands: string) {
		this.commands = commands.split("")

		this.initSnake();
		this.startGame()
	}

	////////////////////
	// Initialization //
	////////////////////

	// Initializes a linked list to store pieces of the snake. Easy to keep track of the head and the tail
	private initSnake() {
		this.head = this.initHead()

		let currPiece = this.head
		let nextPiece = this.getNextPiece(this.head)

		while (nextPiece) {
			currPiece.next = nextPiece
			currPiece = nextPiece
			nextPiece = this.getNextPiece(currPiece)
		}
		this.tail = currPiece
	}

	// Initializes the head of the snake linked list by searching the board
	private initHead(): piece {
		let head: piece
		this.board.every((row, rowIndex) => {
			const colIndex = Math.max(row.indexOf('<'), row.indexOf('>'), row.indexOf('^'), row.indexOf('v'))
			if (colIndex > -1) {
				const value = row[colIndex]
				head = {value, rowIndex, colIndex}
				return false
			}
			return true
		})
		return head
	}

	// Gets the next piece in the snake to add to the linked list.
	// Looks to the left, right, top and bottom
	private getNextPiece(piece: piece, nextPiece = undefined): piece {

		// Left
		var leftCol = piece.colIndex - 1
		if (leftCol >= 0)
			if (nextPiece = this.getPiece(piece.rowIndex, leftCol)) return nextPiece

		// Right
		var rightCol = piece.colIndex + 1
		if (rightCol < this.board[0].length)
			if (nextPiece = this.getPiece(piece.rowIndex, rightCol)) return nextPiece

		// Top
		var topRow = piece.rowIndex - 1
		if (topRow >= 0)
			if (nextPiece = this.getPiece(topRow, piece.colIndex)) return nextPiece

		// Bottom
		var bottomRow = piece.rowIndex + 1
		if (bottomRow < this.board.length)
			if (nextPiece = this.getPiece(bottomRow, piece.colIndex)) return nextPiece
	}

	// Gets a snake piece at row, col if it exists
	private getPiece(row: number, col: number) {
		if (this.board[row][col] === '*') {
			if (!this.isInSnakeLinkedList(row, col)) {
				return {rowIndex: row, colIndex: col}
			}
		}
	}
	// Checks if a piece has been added to the snake linked list
	private isInSnakeLinkedList(row: number, col: number) {
		var piece = this.head
		while (piece) {
			if (piece.rowIndex === row && piece.colIndex === col) return true;
			piece = piece.next
		}
		return false
	}

	////////////////////
	// Implementation //
	////////////////////

	// Runs all given commands
	private startGame() {
		this.commands
		.every(c => {

            if (c === 'F') {
                if (this.canAdvance()) {
			    	this.advanceSnake()
			    } else {
			    	this.killSnake()
			    	return false
			    }

            }
            else if (c === 'R') this.rotateRight(1)
            else if (c === 'L') this.rotateRight(3)

			return true
		})
	}

	// Replaces all pieces with an X
	private killSnake() {

		let piece = this.head
		while (piece) {
			this.board[piece.rowIndex][piece.colIndex] = 'X'
			piece = piece.next
		}
	}

	private rotateRight(turns: number) {
		const orientationIndex = this.headOrientations.indexOf(this.head.value)
		const nextOrientation = this.headOrientations[(orientationIndex + turns) % 4]

		// Update the snake in the linked list and the board
		this.head.value = nextOrientation
		this.board[this.head.rowIndex][this.head.colIndex] = this.head.value
	}

	private canAdvance(): boolean {
		const nextRow = this.head.rowIndex + this.direction.rowDir
		const nextCol = this.head.colIndex + this.direction.colDir

		if (nextRow >= this.board.length || nextRow < 0 || nextCol >= this.board[0].length || nextCol < 0) return false

		if (this.board[nextRow][nextCol] === '*') {
			var tail = this.getTail()
			if (tail.rowIndex === nextRow && tail.colIndex === nextCol) return true
			else return false
		}

		return true
	}

	// Moves the snake one step in the direction it is facing
	private advanceSnake() {

		// Easiest way to advance the snake is to remove the tail
		this.removeTail()

		// Create a new head ad place it on the board
		let newHead = {
			next: this.head,
			value: this.head.value,
			rowIndex: this.head.rowIndex + this.direction.rowDir,
			colIndex: this.head.colIndex + this.direction.colDir
		}
		this.board[newHead.rowIndex][newHead.colIndex] = newHead.value

		// Update the old head
		this.head.value = this.length === 0 ? '' : '*'
		this.board[this.head.rowIndex][this.head.colIndex] = this.head.value

		// Replace the new head
		this.head = newHead
	}

	// Traverses the linked list to find the tail
	private getTail(): piece {

		let piece = this.head
		let prev: piece

		while (piece) {
			prev = piece
			piece = piece.next
		}
		return prev
	}

	// Removes the tail from the board and linked list
	private removeTail() {

		let piece = this.head
		let prev: piece

		while (piece.next) {
			prev = piece
			piece = piece.next
		}
		this.board[piece.rowIndex][piece.colIndex] = '.'
		prev.next = undefined
	}

	/////////////
	// Helpers //
	/////////////

	// Gets the direction the snake is facing
	private get direction(): direction {
		switch (this.head.value) {
			case ">": return {rowDir: 0, colDir: 1}
			case "<": return {rowDir: 0, colDir: -1}
			case "^": return {rowDir: -1, colDir: 0}
			case "v": return {rowDir: 1, colDir: 0}
			default:  return {rowDir: 0, colDir: 0}
		}
	}
	// Gets the length of the snake
	private get length(): number {
		let length = 0
		let currPiece = this.head

		while (currPiece) {
			length++
			currPiece = currPiece.next
		}
		return length
	}
}

// Linked List
interface piece {
	value? : string
	rowIndex: number
	colIndex: number
	next? : piece
}
interface direction {
	rowDir: number
	colDir: number
}

let board = [["*","*",">"], 
			 ["*",".","."], 
			 [".",".","."], 
			 [".",".","."], 
			 [".",".","."], 
			 [".",".","."], 
			 [".",".","."]]

let commands = "RFRFFLFLFFRFRFFLFLFFRFRFFLFF"

var game = new SnakeGame(board, commands)

console.log(game.board);