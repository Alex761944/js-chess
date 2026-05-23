const files = ["a", "b", "c", "d", "e", "f", "g", "h"];
class Game {
  constructor() {
    this.handleSquareClick = this.handleSquareClick.bind(this);

    this.activePiece = null;
    this.currentPlayer = "light";

    this.pieces = [];

    this.createBoard();
    this.placePieces();
    this.addEventListeners();
  }

  createBoard() {
    const files = ["a", "b", "c", "d", "e", "f", "g", "h"];
    let rank = 9;

    for (let i = 0; i < 64; i++) {
      const squareElement = document.createElement("div");

      const row = Math.floor(i / 8);
      const col = i % 8;

      const isDark = (row + col) % 2 === 1;

      squareElement.classList.add("Square");
      squareElement.classList.add(isDark ? "Square--Dark" : "Square--Light");

      if (i % 8 === 0) {
        rank--;
      }

      const file = files[col];

      squareElement.setAttribute("data-file", file);
      squareElement.setAttribute("data-rank", rank);

      this.boardElement.appendChild(squareElement);
    }
  }

  placePieces() {
    this.pieces = [
      new Piece("rook", "dark", "a", 8),
      new Piece("knight", "dark", "b", 8),
      new Piece("bishop", "dark", "c", 8),
      new Piece("queen", "dark", "d", 8),
      new Piece("king", "dark", "e", 8),
      new Piece("bishop", "dark", "f", 8),
      new Piece("knight", "dark", "g", 8),
      new Piece("rook", "dark", "h", 8),

      new Piece("pawn", "dark", "a", 7),
      new Piece("pawn", "dark", "b", 7),
      new Piece("pawn", "dark", "c", 7),
      new Piece("pawn", "dark", "d", 7),
      new Piece("pawn", "dark", "e", 7),
      new Piece("pawn", "dark", "f", 7),
      new Piece("pawn", "dark", "g", 7),
      new Piece("pawn", "dark", "h", 7),

      new Piece("rook", "light", "a", 1),
      new Piece("knight", "light", "b", 1),
      new Piece("bishop", "light", "c", 1),
      new Piece("queen", "light", "d", 1),
      new Piece("king", "light", "e", 1),
      new Piece("bishop", "light", "f", 1),
      new Piece("knight", "light", "g", 1),
      new Piece("rook", "light", "h", 1),

      new Piece("pawn", "light", "a", 2),
      new Piece("pawn", "light", "b", 2),
      new Piece("pawn", "light", "c", 2),
      new Piece("pawn", "light", "d", 2),
      new Piece("pawn", "light", "e", 2),
      new Piece("pawn", "light", "f", 2),
      new Piece("pawn", "light", "g", 2),
      new Piece("pawn", "light", "h", 2),

      // Testing
      new Piece("pawn", "dark", "b", 3),
    ];
  }

  addEventListeners() {
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
    const rank = Number(squareElement.dataset.rank);

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
            Number(validSquare.dataset.rank) === rank &&
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

    const squareElement = this.getSquare(this.file, this.rank);

    squareElement.appendChild(pieceElement);
  }

  goTo(file, rank) {
    const targetSquare = this.getSquare(file, rank);

    targetSquare.appendChild(this.domElement);

    this.file = file;
    this.rank = rank;

    if (!this.hasMoved) this.hasMoved = true;
  }

  getValidSquares() {
    const validSquares = [];
    const currentFileIndex = files.indexOf(this.file);

    const rookDirections = [
      { file: 0, rank: 1 },
      { file: 0, rank: -1 },
      { file: 1, rank: 0 },
      { file: -1, rank: 0 },
    ];

    const bishopDirections = [
      { file: 1, rank: 1 },
      { file: -1, rank: 1 },
      { file: 1, rank: -1 },
      { file: -1, rank: -1 },
    ];

    if (this.type === "pawn") {
      if (this.color === "light") {
        const topLeftSquareHasOpponent = this.squareHasOpponent(
          files[currentFileIndex - 1],
          this.rank + 1,
          "dark",
        );

        if (topLeftSquareHasOpponent) {
          validSquares.push(
            this.getSquare(files[currentFileIndex - 1], this.rank + 1),
          );
        }

        const topRightSquareHasOpponent = this.squareHasOpponent(
          files[currentFileIndex + 1],
          this.rank + 1,
          "dark",
        );

        if (topRightSquareHasOpponent) {
          validSquares.push(files[currentFileIndex + 1], this.rank + 1);
        }
      } else {
        const bottomLeftSquareHasOpponent = this.squareHasOpponent(
          files[currentFileIndex - 1],
          this.rank - 1,
          "light",
        );

        if (bottomLeftSquareHasOpponent) {
          validSquares.push(files[currentFileIndex - 1], this.rank - 1);
        }

        const bottomRightSquareHasOpponent = this.squareHasOpponent(
          files[currentFileIndex + 1],
          this.rank - 1,
          "light",
        );

        if (bottomRightSquareHasOpponent) {
          validSquares.push(files[currentFileIndex + 1], this.rank - 1);
        }
      }

      const isBlocked = document.querySelector(
        `.Square[data-rank="${this.color === "light" ? this.rank + 1 : this.rank - 1}"][data-file="${this.file}"] .Piece`,
      );

      if (isBlocked) return validSquares;

      validSquares.push(
        document.querySelector(
          `.Square[data-rank="${this.color === "light" ? this.rank + 1 : this.rank - 1}"][data-file="${this.file}"]`,
        ),
      );

      if (!this.hasMoved) {
        validSquares.push(
          document.querySelector(
            `.Square[data-rank="${this.color === "light" ? this.rank + 2 : this.rank - 2}"][data-file="${this.file}"]`,
          ),
        );
      }
    }

    if (this.type === "rook") {
      rookDirections.forEach((rookDirection) => {
        for (let i = 1; i < 8; i++) {
          const file = files[currentFileIndex + i * rookDirection.file];
          const rank = this.rank + i * rookDirection.rank;

          const squareElement = this.getSquare(file, rank);

          if (!squareElement) break;

          const pieceElement = squareElement.querySelector(".Piece");

          if (!pieceElement) {
            validSquares.push(squareElement);
            continue;
          }

          if (pieceElement.dataset.color !== this.color) {
            validSquares.push(squareElement);
          }

          break;
        }
      });
    }

    if (this.type === "bishop") {
      bishopDirections.forEach((bishopDirection) => {
        for (let i = 1; i < 8; i++) {
          const file = files[currentFileIndex + i * bishopDirection.file];

          const rank = this.rank + i * bishopDirection.rank;

          const squareElement = this.getSquare(file, rank);

          if (!squareElement) break;

          const pieceElement = squareElement.querySelector(".Piece");

          if (!pieceElement) {
            validSquares.push(squareElement);
            continue;
          }

          if (pieceElement.dataset.color !== this.color) {
            validSquares.push(squareElement);
          }

          break;
        }
      });
    }

    if (this.type === "king") {
      const kingDirections = [
        { file: 0, rank: 1 },
        { file: 0, rank: -1 },
        { file: 1, rank: 0 },
        { file: -1, rank: 0 },

        { file: 1, rank: 1 },
        { file: -1, rank: 1 },
        { file: 1, rank: -1 },
        { file: -1, rank: -1 },
      ];

      kingDirections.forEach((kingDirection) => {
        const file = files[currentFileIndex + kingDirection.file];

        const rank = this.rank + kingDirection.rank;

        const squareElement = this.getSquare(file, rank);

        if (!squareElement) return;

        const pieceElement = squareElement.querySelector(".Piece");

        if (!pieceElement) {
          validSquares.push(squareElement);
          return;
        }

        if (pieceElement.dataset.color !== this.color) {
          validSquares.push(squareElement);
        }
      });
    }

    if (this.type === "queen") {
      const queenDirections = [...rookDirections, ...bishopDirections];

      queenDirections.forEach((queenDirection) => {
        for (let i = 1; i < 8; i++) {
          const file = files[currentFileIndex + i * queenDirection.file];
          const rank = this.rank + i * queenDirection.rank;

          const squareElement = this.getSquare(file, rank);

          if (!squareElement) break;

          const pieceElement = squareElement.querySelector(".Piece");

          if (!pieceElement) {
            validSquares.push(squareElement);
            continue;
          }

          if (pieceElement.dataset.color !== this.color) {
            validSquares.push(squareElement);
          }

          break;
        }
      });
    }

    return validSquares.filter((validSquare) => {
      return validSquare != null;
    });
  }

  getSquare(file, rank) {
    return document.querySelector(
      `.Square[data-file="${file}"][data-rank="${rank}"]`,
    );
  }

  squareHasOpponent(file, rank, opponentColor) {
    const element = document.querySelector(
      `.Square[data-rank="${rank}"][data-file="${file}"]:has(.Piece[data-color="${opponentColor}"])`,
    );

    if (element) {
      return true;
    } else {
      return false;
    }
  }

  get domElement() {
    return document.querySelector(
      `.Square[data-rank="${this.rank}"][data-file="${this.file}"] .Piece`,
    );
  }
}

new Game();
