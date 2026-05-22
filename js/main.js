const files = ["a", "b", "c", "d", "e", "f", "g", "h"];
class Game {
  constructor() {
    this.handleSquareClick = this.handleSquareClick.bind(this);

    this.activePiece = null;
    this.currentPlayer = "light";

    this.pieces = [];

    this.createBoard();
    this.placePieces();
    this.squareClick();
  }

  createBoard() {
    let rank = 9;
    const files = ["a", "b", "c", "d", "e", "f", "g", "h"];

    for (let i = 0; i < 64; i++) {
      const square = document.createElement("div");

      const row = Math.floor(i / 8);
      const col = i % 8;

      const isDark = (row + col) % 2 === 1;

      square.classList.add("Square");
      square.classList.add(isDark ? "Square--Dark" : "Square--Light");

      if (i % 8 === 0) {
        rank--;
      }

      square.setAttribute("data-rank", rank);

      const file = files[col];

      square.setAttribute("data-file", file);

      this.boardElement.appendChild(square);
    }
  }

  placePieces() {
    this.pieces = [
      new Piece("rook", "dark", "a", "8"),
      new Piece("knight", "dark", "b", "8"),
      new Piece("bishop", "dark", "c", "8"),
      new Piece("queen", "dark", "d", "8"),
      new Piece("king", "dark", "e", "8"),
      new Piece("bishop", "dark", "f", "8"),
      new Piece("knight", "dark", "g", "8"),
      new Piece("rook", "dark", "h", "8"),

      new Piece("pawn", "dark", "a", "7"),
      new Piece("pawn", "dark", "b", "7"),
      new Piece("pawn", "dark", "c", "7"),
      new Piece("pawn", "dark", "d", "7"),
      new Piece("pawn", "dark", "e", "7"),
      new Piece("pawn", "dark", "f", "7"),
      new Piece("pawn", "dark", "g", "7"),
      new Piece("pawn", "dark", "h", "7"),

      new Piece("rook", "light", "a", "1"),
      new Piece("knight", "light", "b", "1"),
      new Piece("bishop", "light", "c", "1"),
      new Piece("queen", "light", "d", "1"),
      new Piece("king", "light", "e", "1"),
      new Piece("bishop", "light", "f", "1"),
      new Piece("knight", "light", "g", "1"),
      new Piece("rook", "light", "h", "1"),

      new Piece("pawn", "light", "a", "2"),
      new Piece("pawn", "light", "b", "2"),
      new Piece("pawn", "light", "c", "2"),
      new Piece("pawn", "light", "d", "2"),
      new Piece("pawn", "light", "e", "2"),
      new Piece("pawn", "light", "f", "2"),
      new Piece("pawn", "light", "g", "2"),
      new Piece("pawn", "light", "h", "2"),

      // Testing
      new Piece("pawn", "dark", "a", "3"),
      new Piece("pawn", "dark", "c", "3"),
    ];
  }

  squareClick() {
    this.squareElements.forEach((squareElement) => {
      squareElement.addEventListener("click", this.handleSquareClick);
    });
  }

  handleSquareClick(event) {
    const squareElement = event.currentTarget;

    // Reset valid squares
    this.squareElements.forEach((square) => {
      square.classList.remove("Square--Valid");
    });

    const file = squareElement.dataset.file;
    const rank = squareElement.dataset.rank;

    if (!this.activePiece) {
      this.activePiece = this.pieces.find((piece) => {
        return (
          piece.file === file &&
          piece.rank === rank &&
          piece.color === this.currentPlayer
        );
      });
    } else {
      const validSquares = this.activePiece.getValidSquares();

      if (
        validSquares.find((validSquare) => {
          return (
            validSquare.dataset.rank === rank &&
            validSquare.dataset.file === file
          );
        })
      ) {
        this.activePiece.goTo(file, rank);

        this.currentPlayer = this.currentPlayer === "light" ? "dark" : "light";

        document.querySelector(".CurrentPlayerIndicator p").textContent =
          this.currentPlayer.charAt(0).toUpperCase() +
          this.currentPlayer.slice(1);
      }

      this.squareElements.forEach((squareElement) => {
        squareElement.classList.remove("Square--Selected");
      });

      this.activePiece = null;
    }

    if (this.activePiece) {
      squareElement.classList.add("Square--Selected");

      const validSquares = this.activePiece.getValidSquares();

      this.squareElements.forEach((square) => {
        if (validSquares.includes(square)) {
          square.classList.add("Square--Valid");
        }
      });
    }
  }

  get boardElement() {
    return document.querySelector(".Board");
  }

  get squareElements() {
    return document.querySelectorAll(".Square");
  }
}

class Piece {
  constructor(type, color, file, rank) {
    this.type = type;
    this.color = color;
    this.file = file;
    this.rank = rank;

    this.hasMoved = false;

    this.renderPiece();
  }

  renderPiece() {
    const pieceElement = document.createElement("img");

    pieceElement.classList.add("Piece");

    pieceElement.src = `./img/${this.type}_${this.color}.png`;

    pieceElement.dataset.type = this.type;
    pieceElement.dataset.color = this.color;

    const squareElement = document.querySelector(
      `[data-file="${this.file}"][data-rank="${this.rank}"]`,
    );

    squareElement.appendChild(pieceElement);
  }

  goTo(file, rank) {
    const targetSquare = document.querySelector(
      `.Square[data-file="${file}"][data-rank="${rank}"]`,
    );

    targetSquare.appendChild(this.domElement);

    this.file = file;
    this.rank = rank;

    if (!this.hasMoved) this.hasMoved = true;
  }

  getValidSquares() {
    const validSquares = [];

    if (this.type === "pawn") {
      const currentFileIndex = files.findIndex((file) => {
        return file === this.file;
      });

      if (this.color === "light") {
        const topLeftSquareWithOpponent = document.querySelector(
          `.Square[data-rank="${parseInt(this.rank) + 1}"][data-file="${files[currentFileIndex - 1]}"]:has(.Piece[data-color="dark"])`,
        );

        if (topLeftSquareWithOpponent) {
          validSquares.push(topLeftSquareWithOpponent);
        }

        const topRightSquareWithOpponent = document.querySelector(
          `.Square[data-rank="${parseInt(this.rank) + 1}"][data-file="${files[currentFileIndex + 1]}"]:has(.Piece[data-color="dark"])`,
        );

        if (topRightSquareWithOpponent) {
          validSquares.push(topRightSquareWithOpponent);
        }
      } else {
        const bottomLeftSquareWithOpponent = document.querySelector(
          `.Square[data-rank="${parseInt(this.rank) - 1}"][data-file="${files[currentFileIndex - 1]}"]:has(.Piece[data-color="light"])`,
        );

        if (bottomLeftSquareWithOpponent) {
          validSquares.push(bottomLeftSquareWithOpponent);
        }

        const bottomRightSquareWithOpponent = document.querySelector(
          `.Square[data-rank="${parseInt(this.rank) - 1}"][data-file="${files[currentFileIndex + 1]}"]:has(.Piece[data-color="light"])`,
        );

        if (bottomRightSquareWithOpponent) {
          validSquares.push(bottomRightSquareWithOpponent);
        }
      }

      const isBlocked = document.querySelector(
        `.Square[data-rank="${this.color === "light" ? parseInt(this.rank) + 1 : parseInt(this.rank) - 1}"][data-file="${this.file}"] .Piece`,
      );

      if (isBlocked) return validSquares;

      validSquares.push(
        document.querySelector(
          `.Square[data-rank="${this.color === "light" ? parseInt(this.rank) + 1 : parseInt(this.rank) - 1}"][data-file="${this.file}"]`,
        ),
      );

      if (!this.hasMoved) {
        validSquares.push(
          document.querySelector(
            `.Square[data-rank="${this.color === "light" ? parseInt(this.rank) + 2 : parseInt(this.rank) - 2}"][data-file="${this.file}"]`,
          ),
        );
      }
    }

    if (this.type === "rook") {
      // up and down
      const directions = [1, -1];

      directions.forEach((direction) => {
        for (let i = 1; i < 8; i++) {
          const square = document.querySelector(
            `.Square[data-rank="${parseInt(this.rank) + i * direction}"][data-file="${this.file}"]`,
          );

          if (!square) break;

          const piece = square.querySelector(".Piece");

          if (!piece) {
            validSquares.push(square);
            continue;
          }

          if (piece.dataset.color !== this.color) {
            validSquares.push(square);
          }

          break;
        }
      });

      const currentFileIndex = files.indexOf(this.file);

      // right and left
      directions.forEach((direction) => {
        for (let i = 1; i < 8; i++) {
          const file = files[currentFileIndex + i * direction];

          const square = document.querySelector(
            `.Square[data-rank="${this.rank}"][data-file="${file}"]`,
          );

          if (!square) break;

          const piece = square.querySelector(".Piece");

          if (!piece) {
            validSquares.push(square);
            continue;
          }

          if (piece.dataset.color !== this.color) {
            validSquares.push(square);
          }

          break;
        }
      });
    }

    return validSquares.filter((validSquare) => {
      return validSquare != null;
    });
  }

  get domElement() {
    return document.querySelector(
      `.Square[data-rank="${this.rank}"][data-file="${this.file}"] .Piece`,
    );
  }
}

new Game();
