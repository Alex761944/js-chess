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
    let rank = 9;

    for (let i = 0; i < 64; i++) {
      const squareElement = document.createElement("div");

      const row = Math.floor(i / 8);
      const col = i % 8;

      const isDark = (row + col) % 2 === 1;

      squareElement.classList.add(
        "Square",
        isDark ? "Square--Dark" : "Square--Light",
      );

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

      ...files.map((file) => {
        return new Piece("pawn", "dark", file, 7);
      }),

      new Piece("rook", "light", "a", 1),
      new Piece("knight", "light", "b", 1),
      new Piece("bishop", "light", "c", 1),
      new Piece("queen", "light", "d", 1),
      new Piece("king", "light", "e", 1),
      new Piece("bishop", "light", "f", 1),
      new Piece("knight", "light", "g", 1),
      new Piece("rook", "light", "h", 1),

      ...files.map((file) => {
        return new Piece("pawn", "light", file, 2);
      }),

      // Testing
      new Piece("pawn", "dark", "c", 3),
      new Piece("queen", "light", "h", 5),
    ];
  }

  addEventListeners() {
    this.squareElements.forEach((squareElement) => {
      squareElement.addEventListener("click", this.handleSquareClick);
    });
  }

  handleSquareClick(event) {
    const clickedSquareElement = event.currentTarget;

    // Reset valid squares
    this.squareElements.forEach((square) => {
      square.classList.remove("Square--Valid");
    });

    const file = clickedSquareElement.dataset.file;
    const rank = parseInt(clickedSquareElement.dataset.rank);

    if (!this.activePiece) {
      this.activePiece = this.pieces.find((piece) => {
        return (
          piece.file === file &&
          piece.rank === rank &&
          piece.color === this.currentPlayer
        );
      });
    } else {
      const validSquareElements = this.activePiece.getValidSquares();

      if (
        validSquareElements.find((validSquareElement) => {
          return (
            parseInt(validSquareElement.dataset.rank) === rank &&
            validSquareElement.dataset.file === file
          );
        })
      ) {
        const targetSquareElement = this.activePiece.getSquare(file, rank);
        const targetPieceElement = targetSquareElement.querySelector(".Piece");

        if (targetPieceElement) {
          this.activePiece.capture(file, rank, false);
        } else if (
          this.activePiece.type === "pawn" &&
          this.activePiece.file !== file &&
          !targetPieceElement
        ) {
          this.activePiece.capture(file, rank, true);
        }

        this.activePiece.goTo(file, rank);

        this.currentPlayer = this.currentPlayer === "light" ? "dark" : "light";

        const kingIsInCheck = this.isKingInCheck(this.currentPlayer);

        if (kingIsInCheck) {
          console.log("King is in check");
        }

        document.querySelector(".CurrentPlayerIndicator p").textContent =
          this.currentPlayer;
      }

      this.squareElements.forEach((squareElement) => {
        squareElement.classList.remove("Square--Selected");
      });

      this.activePiece = null;
    }

    if (this.activePiece) {
      clickedSquareElement.classList.add("Square--Selected");

      const validSquareElements = this.activePiece.getValidSquares();

      this.squareElements.forEach((squareElement) => {
        if (validSquareElements.includes(squareElement)) {
          squareElement.classList.add("Square--Valid");
        }
      });
    }
  }

  isKingInCheck(color) {
    const king = this.pieces.find((piece) => {
      return piece.type === "king" && piece.color === color;
    });

    const opponentPieces = this.pieces.filter((piece) => {
      return piece.color !== color;
    });

    return opponentPieces.some((piece) => {
      const coveredSquares = piece.getCoveredSquares();
      return coveredSquares.some((squareElement) => {
        return (
          squareElement.dataset.file === king.file &&
          parseInt(squareElement.dataset.rank) === king.rank
        );
      });
    });
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

    this.previousLocations = [];

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

  capture(file, rank, isEnPassant) {
    if (isEnPassant) {
      if (this.color === "light") {
        const enPassantPiece = game.pieces.find((piece) => {
          return (
            piece.type === "pawn" &&
            piece.color === "dark" &&
            piece.file === file &&
            piece.rank === rank - 1
          );
        });

        enPassantPiece.domElement.remove();
      } else {
        const enPassantPiece = game.pieces.find((piece) => {
          return (
            piece.type === "pawn" &&
            piece.color === "light" &&
            piece.file === file &&
            piece.rank === rank + 1
          );
        });

        enPassantPiece.domElement.remove();
      }
    } else {
      const regularPiece = game.pieces.find((piece) => {
        return piece.file === file && piece.rank === rank;
      });

      regularPiece.domElement.remove();
    }
  }

  goTo(file, rank) {
    const targetSquareElement = this.getSquare(file, rank);

    targetSquareElement.appendChild(this.domElement);

    const isRohade = this.isRohadeMove(file);

    if (isRohade) {
      if (file === "g") {
        const rookTargetSquareElement = this.getSquare("f", this.rank);

        const rook = game.pieces.find((piece) => {
          return (
            piece.type === "rook" &&
            piece.color === this.color &&
            piece.file === "h" &&
            piece.rank === this.rank
          );
        });

        rookTargetSquareElement.appendChild(rook.domElement);

        rook.file = "f";
        rook.rank = this.rank;
        rook.hasMoved = true;
      }

      if (file === "c") {
        const rookTargetSquareElement = this.getSquare("d", this.rank);

        const rook = game.pieces.find((piece) => {
          return (
            piece.type === "rook" &&
            piece.color === this.color &&
            piece.file === "a" &&
            piece.rank === this.rank
          );
        });

        rookTargetSquareElement.appendChild(rook.domElement);

        rook.file = "d";
        rook.rank = this.rank;
        rook.hasMoved = true;
      }
    }

    this.previousLocations.push({ file: this.file, rank: this.rank });

    this.file = file;
    this.rank = rank;

    if (!this.hasMoved) this.hasMoved = true;

    if (this.type === "pawn" && (rank === 8 || rank === 1)) {
      this.promote();
    }
  }

  //TODO: Return covered squares
  getCoveredSquares() {
    const coveredSquares = [];
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

    const knightDirections = [
      { file: 1, rank: 2 },
      { file: 2, rank: 1 },
      { file: 2, rank: -1 },
      { file: 1, rank: -2 },
      { file: -1, rank: -2 },
      { file: -2, rank: -1 },
      { file: -2, rank: 1 },
      { file: -1, rank: 2 },
    ];

    const queenDirections = [...rookDirections, ...bishopDirections];

    if (this.type === "pawn") {
      if (this.color === "light") {
        coveredSquares.push(
          this.getSquare(files[currentFileIndex - 1], this.rank + 1),
        );

        coveredSquares.push(
          this.getSquare(files[currentFileIndex + 1], this.rank + 1),
        );
      } else {
        coveredSquares.push(
          this.getSquare(files[currentFileIndex - 1], this.rank - 1),
        );

        coveredSquares.push(
          this.getSquare(files[currentFileIndex + 1], this.rank - 1),
        );

        const bottomLeftSquareHasOpponent = this.squareHasOpponent(
          files[currentFileIndex - 1],
          this.rank - 1,
          "light",
        );

        if (bottomLeftSquareHasOpponent) {
          coveredSquares.push(
            this.getSquare(files[currentFileIndex - 1], this.rank - 1),
          );
        }

        const bottomRightSquareHasOpponent = this.squareHasOpponent(
          files[currentFileIndex + 1],
          this.rank - 1,
          "light",
        );

        if (bottomRightSquareHasOpponent) {
          coveredSquares.push(
            this.getSquare(files[currentFileIndex + 1], this.rank - 1),
          );
        }

        const opponentPawnToTheRight = game.pieces.find((piece) => {
          return (
            piece.color === "light" &&
            piece.type === "pawn" &&
            piece.file === files[currentFileIndex + 1] &&
            piece.rank === this.rank
          );
        });

        if (this.rank === 4 && opponentPawnToTheRight) {
          const currentRank = opponentPawnToTheRight.rank;
          const previousRank =
            opponentPawnToTheRight.previousLocations.at(-1)?.rank;

          if (currentRank - previousRank === 2) {
            coveredSquares.push(this.getSquare(files[currentFileIndex + 1], 3));
          }
        }

        const opponentPawnToTheLeft = game.pieces.find((piece) => {
          return (
            piece.color === "light" &&
            piece.type === "pawn" &&
            piece.file === files[currentFileIndex - 1] &&
            piece.rank === this.rank
          );
        });

        if (this.rank === 4 && opponentPawnToTheLeft) {
          const currentRank = opponentPawnToTheLeft.rank;
          const previousRank =
            opponentPawnToTheLeft.previousLocations.at(-1)?.rank;

          if (currentRank - previousRank === 2) {
            coveredSquares.push(this.getSquare(files[currentFileIndex - 1], 3));
          }
        }
      }

      const isBlocked = this.squareIsOccupied(
        this.file,
        this.color === "light" ? this.rank + 1 : this.rank - 1,
      );

      if (isBlocked) return coveredSquares;

      coveredSquares.push(
        this.getSquare(
          this.file,
          this.color === "light" ? this.rank + 1 : this.rank - 1,
        ),
      );

      if (!this.hasMoved) {
        coveredSquares.push(
          this.getSquare(
            this.file,
            this.color === "light" ? this.rank + 2 : this.rank - 2,
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
            coveredSquares.push(squareElement);
            continue;
          }

          if (pieceElement.dataset.color !== this.color) {
            coveredSquares.push(squareElement);
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
            coveredSquares.push(squareElement);
            continue;
          }

          if (pieceElement.dataset.color !== this.color) {
            coveredSquares.push(squareElement);
          }

          break;
        }
      });
    }

    if (this.type === "king") {
      kingDirections.forEach((kingDirection) => {
        const file = files[currentFileIndex + kingDirection.file];

        const rank = this.rank + kingDirection.rank;

        const squareElement = this.getSquare(file, rank);

        if (!squareElement) return;

        const pieceElement = squareElement.querySelector(".Piece");

        if (!pieceElement) {
          coveredSquares.push(squareElement);
          return;
        }

        if (pieceElement.dataset.color !== this.color) {
          coveredSquares.push(squareElement);
        }
      });

      if (!this.hasMoved) {
        const rank = this.rank;

        const shortRohadeRook = game.pieces.find((piece) => {
          return (
            piece.type === "rook" &&
            piece.color === this.color &&
            piece.file === "h" &&
            piece.rank === rank
          );
        });

        const shortSideIsClear =
          !this.squareIsOccupied("f", rank) &&
          !this.squareIsOccupied("g", rank);

        if (shortRohadeRook && !shortRohadeRook.hasMoved && shortSideIsClear) {
          coveredSquares.push(this.getSquare("g", rank));
        }

        const longRohadeRook = game.pieces.find((piece) => {
          return (
            piece.type === "rook" &&
            piece.color === this.color &&
            piece.file === "a" &&
            piece.rank === rank
          );
        });

        const longSideIsClear =
          !this.squareIsOccupied("b", rank) &&
          !this.squareIsOccupied("c", rank) &&
          !this.squareIsOccupied("d", rank);

        if (longRohadeRook && !longRohadeRook.hasMoved && longSideIsClear) {
          coveredSquares.push(this.getSquare("c", rank));
        }
      }
    }

    if (this.type === "queen") {
      queenDirections.forEach((queenDirection) => {
        for (let i = 1; i < 8; i++) {
          const file = files[currentFileIndex + i * queenDirection.file];
          const rank = this.rank + i * queenDirection.rank;

          const squareElement = this.getSquare(file, rank);

          if (!squareElement) break;

          const pieceElement = squareElement.querySelector(".Piece");

          if (!pieceElement) {
            coveredSquares.push(squareElement);
            continue;
          }

          if (pieceElement.dataset.color !== this.color) {
            coveredSquares.push(squareElement);
          }

          break;
        }
      });
    }

    if (this.type === "knight") {
      knightDirections.forEach((knightDirection) => {
        const file = files[currentFileIndex + knightDirection.file];
        const rank = this.rank + knightDirection.rank;

        const squareElement = this.getSquare(file, rank);

        if (!squareElement) return;

        const pieceElement = squareElement.querySelector(".Piece");

        if (!pieceElement) {
          coveredSquares.push(squareElement);
          return;
        }

        if (pieceElement.dataset.color !== this.color) {
          coveredSquares.push(squareElement);
        }
      });
    }

    return coveredSquares.filter((validSquare) => {
      return validSquare != null;
    });
  }

  getValidSquares() {
    //TODO: Before pushing square into valid squares:
    // 1 Create Duplicate of the board
    // 2 Move piece to candidateSquare
    // 3 Check if it results in a selfcheck
    // 4 Only add candidate square to valid squares if not in check

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

    const knightDirections = [
      { file: 1, rank: 2 },
      { file: 2, rank: 1 },
      { file: 2, rank: -1 },
      { file: 1, rank: -2 },
      { file: -1, rank: -2 },
      { file: -2, rank: -1 },
      { file: -2, rank: 1 },
      { file: -1, rank: 2 },
    ];

    const queenDirections = [...rookDirections, ...bishopDirections];

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
          validSquares.push(
            this.getSquare(files[currentFileIndex + 1], this.rank + 1),
          );
        }

        const opponentPawnToTheRight = game.pieces.find((piece) => {
          return (
            piece.color === "dark" &&
            piece.type === "pawn" &&
            piece.file === files[currentFileIndex + 1] &&
            piece.rank === this.rank
          );
        });

        if (this.rank === 5 && opponentPawnToTheRight) {
          const currentRank = opponentPawnToTheRight.rank;
          const previousRank =
            opponentPawnToTheRight.previousLocations.at(-1)?.rank;

          if (previousRank - currentRank === 2) {
            validSquares.push(this.getSquare(files[currentFileIndex + 1], 6));
          }
        }

        const opponentPawnToTheLeft = game.pieces.find((piece) => {
          return (
            piece.color === "dark" &&
            piece.type === "pawn" &&
            piece.file === files[currentFileIndex - 1] &&
            piece.rank === this.rank
          );
        });

        if (this.rank === 5 && opponentPawnToTheLeft) {
          const currentRank = opponentPawnToTheLeft.rank;
          const previousRank =
            opponentPawnToTheLeft.previousLocations.at(-1)?.rank;

          if (previousRank - currentRank === 2) {
            validSquares.push(this.getSquare(files[currentFileIndex - 1], 6));
          }
        }
      } else {
        const bottomLeftSquareHasOpponent = this.squareHasOpponent(
          files[currentFileIndex - 1],
          this.rank - 1,
          "light",
        );

        if (bottomLeftSquareHasOpponent) {
          validSquares.push(
            this.getSquare(files[currentFileIndex - 1], this.rank - 1),
          );
        }

        const bottomRightSquareHasOpponent = this.squareHasOpponent(
          files[currentFileIndex + 1],
          this.rank - 1,
          "light",
        );

        if (bottomRightSquareHasOpponent) {
          validSquares.push(
            this.getSquare(files[currentFileIndex + 1], this.rank - 1),
          );
        }

        const opponentPawnToTheRight = game.pieces.find((piece) => {
          return (
            piece.color === "light" &&
            piece.type === "pawn" &&
            piece.file === files[currentFileIndex + 1] &&
            piece.rank === this.rank
          );
        });

        if (this.rank === 4 && opponentPawnToTheRight) {
          const currentRank = opponentPawnToTheRight.rank;
          const previousRank =
            opponentPawnToTheRight.previousLocations.at(-1)?.rank;

          if (currentRank - previousRank === 2) {
            validSquares.push(this.getSquare(files[currentFileIndex + 1], 3));
          }
        }

        const opponentPawnToTheLeft = game.pieces.find((piece) => {
          return (
            piece.color === "light" &&
            piece.type === "pawn" &&
            piece.file === files[currentFileIndex - 1] &&
            piece.rank === this.rank
          );
        });

        if (this.rank === 4 && opponentPawnToTheLeft) {
          const currentRank = opponentPawnToTheLeft.rank;
          const previousRank =
            opponentPawnToTheLeft.previousLocations.at(-1)?.rank;

          if (currentRank - previousRank === 2) {
            validSquares.push(this.getSquare(files[currentFileIndex - 1], 3));
          }
        }
      }

      const isBlocked = this.squareIsOccupied(
        this.file,
        this.color === "light" ? this.rank + 1 : this.rank - 1,
      );

      if (isBlocked) return validSquares;

      const currentRank = this.rank;

      this.color === "light" ? (this.rank += 1) : (this.rank -= 1);

      if (!game.isKingInCheck(this.color)) {
        validSquares.push(
          this.getSquare(
            this.file,
            this.color === "light" ? currentRank + 1 : currentRank - 1,
          ),
        );
      }

      this.color === "light" ? (this.rank -= 1) : (this.rank += 1);

      if (!this.hasMoved) {
        validSquares.push(
          this.getSquare(
            this.file,
            this.color === "light" ? this.rank + 2 : this.rank - 2,
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

      if (!this.hasMoved) {
        const rank = this.rank;

        const shortRohadeRook = game.pieces.find((piece) => {
          return (
            piece.type === "rook" &&
            piece.color === this.color &&
            piece.file === "h" &&
            piece.rank === rank
          );
        });

        const shortSideIsClear =
          !this.squareIsOccupied("f", rank) &&
          !this.squareIsOccupied("g", rank);

        if (shortRohadeRook && !shortRohadeRook.hasMoved && shortSideIsClear) {
          validSquares.push(this.getSquare("g", rank));
        }

        const longRohadeRook = game.pieces.find((piece) => {
          return (
            piece.type === "rook" &&
            piece.color === this.color &&
            piece.file === "a" &&
            piece.rank === rank
          );
        });

        const longSideIsClear =
          !this.squareIsOccupied("b", rank) &&
          !this.squareIsOccupied("c", rank) &&
          !this.squareIsOccupied("d", rank);

        if (longRohadeRook && !longRohadeRook.hasMoved && longSideIsClear) {
          validSquares.push(this.getSquare("c", rank));
        }
      }
    }

    if (this.type === "queen") {
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

    if (this.type === "knight") {
      knightDirections.forEach((knightDirection) => {
        const file = files[currentFileIndex + knightDirection.file];
        const rank = this.rank + knightDirection.rank;

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
      `.Square[data-file="${file}"][data-rank="${rank}"]:has(.Piece[data-color="${opponentColor}"])`,
    );

    if (element) {
      return true;
    } else {
      return false;
    }
  }

  squareIsOccupied(file, rank) {
    const element = document.querySelector(
      `.Square[data-file="${file}"][data-rank="${rank}"]:has(.Piece)`,
    );

    if (element) {
      return true;
    } else {
      return false;
    }
  }

  squareHasOwnPiece(file, rank, ownColor) {
    const element = document.querySelector(
      `.Square[data-file="${file}"][data-rank="${rank}"]:has(.Piece[data-color="${ownColor}"])`,
    );

    if (element) {
      return true;
    } else {
      return false;
    }
  }

  isRohadeMove(file) {
    return (
      this.type === "king" &&
      Math.abs(files.indexOf(file) - files.indexOf(this.file)) === 2
    );
  }

  promote() {
    this.type = "queen";

    this.domElement.src = `./img/queen_${this.color}.png`;
    this.domElement.dataset.type = "queen";
  }

  get domElement() {
    return document.querySelector(
      `.Square[data-file="${this.file}"][data-rank="${this.rank}"] .Piece`,
    );
  }
}

// const game = new Game();

class Game2 {
  constructor() {
    this.activeSquare = null;
    this.currentPlayer = "light";

    this.files = ["a", "b", "c", "d", "e", "f", "g", "h"];

    this.handleSquareClick = this.handleSquareClick.bind(this);
    this.resetValidSquares = this.resetValidSquares.bind(this);

    this.createBoard();
    this.placePieces();
  }

  createBoard() {
    for (let row = 7; row >= 0; row--) {
      for (let col = 0; col < 8; col++) {
        const squareElement = document.createElement("div");

        const isDark = (row + col) % 2 === 1;

        squareElement.classList.add(
          "Square",
          isDark ? "Square--Dark" : "Square--Light",
        );

        const file = this.files[col];

        squareElement.setAttribute("data-file", file);
        squareElement.setAttribute("data-rank", row + 1);
        squareElement.setAttribute("data-row", row);
        squareElement.setAttribute("data-col", col);

        this.boardElement.appendChild(squareElement);

        squareElement.addEventListener("click", this.handleSquareClick);
      }
    }
  }

  placePieces() {
    const pieces = [
      {
        color: "dark",
        type: "rook",
        file: "a",
        rank: "8",
      },
      {
        color: "dark",
        type: "knight",
        file: "b",
        rank: "8",
      },
      {
        color: "dark",
        type: "bishop",
        file: "c",
        rank: "8",
      },
      {
        color: "dark",
        type: "queen",
        file: "d",
        rank: "8",
      },
      {
        color: "dark",
        type: "king",
        file: "e",
        rank: "8",
      },
      {
        color: "dark",
        type: "bishop",
        file: "f",
        rank: "8",
      },
      {
        color: "dark",
        type: "knight",
        file: "g",
        rank: "8",
      },
      {
        color: "dark",
        type: "rook",
        file: "h",
        rank: "8",
      },
      {
        color: "dark",
        type: "pawn",
        file: "a",
        rank: "7",
      },
      {
        color: "dark",
        type: "pawn",
        file: "b",
        rank: "7",
      },
      {
        color: "dark",
        type: "pawn",
        file: "c",
        rank: "7",
      },
      {
        color: "dark",
        type: "pawn",
        file: "d",
        rank: "7",
      },
      {
        color: "dark",
        type: "pawn",
        file: "e",
        rank: "7",
      },
      {
        color: "dark",
        type: "pawn",
        file: "f",
        rank: "7",
      },
      {
        color: "dark",
        type: "pawn",
        file: "g",
        rank: "7",
      },
      {
        color: "dark",
        type: "pawn",
        file: "h",
        rank: "7",
      },
      {
        color: "light",
        type: "pawn",
        file: "a",
        rank: "2",
      },
      {
        color: "light",
        type: "pawn",
        file: "b",
        rank: "2",
      },
      {
        color: "light",
        type: "pawn",
        file: "c",
        rank: "2",
      },
      {
        color: "light",
        type: "pawn",
        file: "d",
        rank: "2",
      },
      {
        color: "light",
        type: "pawn",
        file: "e",
        rank: "2",
      },
      {
        color: "light",
        type: "pawn",
        file: "f",
        rank: "2",
      },
      {
        color: "light",
        type: "pawn",
        file: "g",
        rank: "2",
      },
      {
        color: "light",
        type: "pawn",
        file: "h",
        rank: "2",
      },
      {
        color: "light",
        type: "rook",
        file: "a",
        rank: "1",
      },
      {
        color: "light",
        type: "knight",
        file: "b",
        rank: "1",
      },
      {
        color: "light",
        type: "bishop",
        file: "c",
        rank: "1",
      },
      {
        color: "light",
        type: "queen",
        file: "d",
        rank: "1",
      },
      {
        color: "light",
        type: "king",
        file: "e",
        rank: "1",
      },
      {
        color: "light",
        type: "bishop",
        file: "f",
        rank: "1",
      },
      {
        color: "light",
        type: "knight",
        file: "g",
        rank: "1",
      },
      {
        color: "light",
        type: "rook",
        file: "h",
        rank: "1",
      },
      // Testing
      {
        color: "light",
        type: "knight",
        file: "b",
        rank: "6",
      },
    ];

    pieces.forEach((piece) => {
      const pieceElement = document.createElement("img");

      pieceElement.classList.add("Piece");

      pieceElement.src = `./img/${piece.type}_${piece.color}.png`;

      const squareElement = this.getSquare(piece.file, piece.rank);

      squareElement.setAttribute("data-type", piece.type);
      squareElement.setAttribute("data-color", piece.color);
      squareElement.setAttribute("data-has-moved", false);

      squareElement.appendChild(pieceElement);
    });
  }

  getSquare(file, rank) {
    return document.querySelector(
      `.Square[data-file="${file}"][data-rank="${rank}"]`,
    );
  }

  getCoveredSquares(file, rank) {
    const squareElement = this.getSquare(file, rank);

    const color = squareElement.dataset.color;
    const type = squareElement.dataset.type;
    const row = parseInt(squareElement.dataset.row);
    const col = parseInt(squareElement.dataset.col);

    const coveredSquares = [];

    // Pawn
    if (type === "pawn") {
      // Pawn-Dark
      if (color === "dark") {
        // Pawn-Dark (Bottom-Left)
        coveredSquares.push(
          document.querySelector(
            `.Square[data-row="${row - 1}"][data-col="${col - 1}"]`,
          ),
        );

        // Pawn-Dark (Bottom-Right)
        coveredSquares.push(
          document.querySelector(
            `.Square[data-row="${row - 1}"][data-col="${col + 1}"]`,
          ),
        );
      }

      // Pawn-Light
      if (color === "light") {
        // Pawn-Light (Top-Left)
        coveredSquares.push(
          document.querySelector(
            `.Square[data-row="${row + 1}"][data-col="${col - 1}"]`,
          ),
        );

        // Pawn-Light (Top-Right)
        coveredSquares.push(
          document.querySelector(
            `.Square[data-row="${row + 1}"][data-col="${col + 1}"]`,
          ),
        );
      }
    }

    // Rook or Queen
    if (type === "rook" || type === "queen") {
      // Top
      for (let offset = 1; offset < 8; offset++) {
        const possibleSquare = document.querySelector(
          `.Square[data-row="${row + offset}"][data-col="${col}"]`,
        );

        if (!possibleSquare) break;

        coveredSquares.push(possibleSquare);

        if (possibleSquare.dataset.type) break;
      }

      // Right
      for (let offset = 1; offset < 8; offset++) {
        const possibleSquare = document.querySelector(
          `.Square[data-row="${row}"][data-col="${col + offset}"]`,
        );

        if (!possibleSquare) break;

        coveredSquares.push(possibleSquare);

        if (possibleSquare.dataset.type) break;
      }

      // Bottom
      for (let offset = 1; offset < 8; offset++) {
        const possibleSquare = document.querySelector(
          `.Square[data-row="${row - offset}"][data-col="${col}"]`,
        );

        if (!possibleSquare) break;

        coveredSquares.push(possibleSquare);

        if (possibleSquare.dataset.type) break;
      }

      // Left
      for (let offset = 1; offset < 8; offset++) {
        const possibleSquare = document.querySelector(
          `.Square[data-row="${row}"][data-col="${col - offset}"]`,
        );

        if (!possibleSquare) break;

        coveredSquares.push(possibleSquare);

        if (possibleSquare.dataset.type) break;
      }
    }

    // Bishop or Queen
    if (type === "bishop" || type === "queen") {
      // Top-Left
      for (let offset = 1; offset < 8; offset++) {
        const possibleSquare = document.querySelector(
          `.Square[data-row="${row + offset}"][data-col="${col - offset}"]`,
        );

        if (!possibleSquare) break;

        coveredSquares.push(possibleSquare);

        if (possibleSquare.dataset.type) break;
      }

      // Top-Right
      for (let offset = 1; offset < 8; offset++) {
        const possibleSquare = document.querySelector(
          `.Square[data-row="${row + offset}"][data-col="${col + offset}"]`,
        );

        if (!possibleSquare) break;

        coveredSquares.push(possibleSquare);

        if (possibleSquare.dataset.type) break;
      }

      // Bottom-Left
      for (let offset = 1; offset < 8; offset++) {
        const possibleSquare = document.querySelector(
          `.Square[data-row="${row - offset}"][data-col="${col - offset}"]`,
        );

        if (!possibleSquare) break;

        coveredSquares.push(possibleSquare);

        if (possibleSquare.dataset.type) break;
      }

      // Bottom-Right
      for (let offset = 1; offset < 8; offset++) {
        const possibleSquare = document.querySelector(
          `.Square[data-row="${row - offset}"][data-col="${col + offset}"]`,
        );

        if (!possibleSquare) break;

        coveredSquares.push(possibleSquare);

        if (possibleSquare.dataset.type) break;
      }
    }

    // Knight
    if (type === "knight") {
      // Push all 8 possible squares

      coveredSquares.push(
        document.querySelector(
          `.Square[data-row="${row + 2}"][data-col="${col - 1}"]`,
        ),
      );

      coveredSquares.push(
        document.querySelector(
          `.Square[data-row="${row + 2}"][data-col="${col + 1}"]`,
        ),
      );

      coveredSquares.push(
        document.querySelector(
          `.Square[data-row="${row + 1}"][data-col="${col - 2}"]`,
        ),
      );

      coveredSquares.push(
        document.querySelector(
          `.Square[data-row="${row + 1}"][data-col="${col + 2}"]`,
        ),
      );

      coveredSquares.push(
        document.querySelector(
          `.Square[data-row="${row - 1}"][data-col="${col + 2}"]`,
        ),
      );

      coveredSquares.push(
        document.querySelector(
          `.Square[data-row="${row - 1}"][data-col="${col - 2}"]`,
        ),
      );

      coveredSquares.push(
        document.querySelector(
          `.Square[data-row="${row - 2}"][data-col="${col - 1}"]`,
        ),
      );

      coveredSquares.push(
        document.querySelector(
          `.Square[data-row="${row - 2}"][data-col="${col + 1}"]`,
        ),
      );
    }

    // King
    if (type === "king") {
      // Push all 8 possible squares

      coveredSquares.push(
        document.querySelector(
          `.Square[data-row="${row + 1}"][data-col="${col - 1}"]`,
        ),
      );

      coveredSquares.push(
        document.querySelector(
          `.Square[data-row="${row + 1}"][data-col="${col}"]`,
        ),
      );

      coveredSquares.push(
        document.querySelector(
          `.Square[data-row="${row + 1}"][data-col="${col + 1}"]`,
        ),
      );

      coveredSquares.push(
        document.querySelector(
          `.Square[data-row="${row}"][data-col="${col - 1}"]`,
        ),
      );

      coveredSquares.push(
        document.querySelector(
          `.Square[data-row="${row}"][data-col="${col + 1}"]`,
        ),
      );

      coveredSquares.push(
        document.querySelector(
          `.Square[data-row="${row - 1}"][data-col="${col - 1}"]`,
        ),
      );

      coveredSquares.push(
        document.querySelector(
          `.Square[data-row="${row - 1}"][data-col="${col}"]`,
        ),
      );

      coveredSquares.push(
        document.querySelector(
          `.Square[data-row="${row - 1}"][data-col="${col + 1}"]`,
        ),
      );
    }

    const filteredCoveredSquares = coveredSquares.filter((coveredSquare) => {
      return coveredSquare !== null;
    });
  }

  getValidSquares(file, rank) {
    const squareElement = this.getSquare(file, rank);

    const color = squareElement.dataset.color;
    const type = squareElement.dataset.type;
    const hasMoved = squareElement.dataset.hasMoved === "true";
    const row = parseInt(squareElement.dataset.row);
    const col = parseInt(squareElement.dataset.col);

    const validSquareElements = [];

    // Pawn
    if (type === "pawn") {
      // Pawn-Light
      if (color === "light") {
        validSquareElements.push(
          document.querySelector(
            `.Square[data-row="${row + 1}"][data-col="${col}"]`,
          ),
        );

        // Pawn-Light first move
        if (!hasMoved) {
          validSquareElements.push(
            document.querySelector(
              `.Square[data-row="${row + 2}"][data-col="${col}"]`,
            ),
          );
        }
      }

      // Pawn-Dark
      if (color === "light") {
        validSquareElements.push(
          document.querySelector(
            `.Square[data-row="${row - 1}"][data-col="${col}"]`,
          ),
        );

        // Pawn-Dark first move
        if (!hasMoved) {
          validSquareElements.push(
            document.querySelector(
              `.Square[data-row="${row - 2}"][data-col="${col}"]`,
            ),
          );
        }
      }
    }

    // Rook
    if (type === "rook") {
      // Rook (Top)

      for (let offset = 1; offset < 8; offset++) {
        const possibleSquare = document.querySelector(
          `.Square[data-row="${row + offset}"][data-col="${col}"]`,
        );

        if (!possibleSquare) break;

        if (
          possibleSquare.dataset.type &&
          possibleSquare.dataset.color === this.currentPlayer
        )
          break;

        if (!possibleSquare.dataset.type) {
          validSquareElements.push(possibleSquare);
        }

        if (
          possibleSquare.dataset.type &&
          possibleSquare.dataset.color !== this.currentPlayer
        ) {
          validSquareElements.push(possibleSquare);

          break;
        }
      }

      //Rook (Right)
      for (let offset = 1; offset < 8; offset++) {
        const possibleSquare = document.querySelector(
          `.Square[data-row="${row}"][data-col="${col + offset}"]`,
        );

        if (!possibleSquare) break;

        if (
          possibleSquare.dataset.type &&
          possibleSquare.dataset.color === this.currentPlayer
        )
          break;

        if (!possibleSquare.dataset.type) {
          validSquareElements.push(possibleSquare);
        }

        if (
          possibleSquare.dataset.type &&
          possibleSquare.dataset.color !== this.currentPlayer
        ) {
          validSquareElements.push(possibleSquare);

          break;
        }
      }

      // Rook (Bottom)
      for (let offset = 1; offset < 8; offset++) {
        const possibleSquare = document.querySelector(
          `.Square[data-row="${row - offset}"][data-col="${col}"]`,
        );

        if (!possibleSquare) break;

        if (
          possibleSquare.dataset.type &&
          possibleSquare.dataset.color === this.currentPlayer
        )
          break;

        if (!possibleSquare.dataset.type) {
          validSquareElements.push(possibleSquare);
        }

        if (
          possibleSquare.dataset.type &&
          possibleSquare.dataset.color !== this.currentPlayer
        ) {
          validSquareElements.push(possibleSquare);

          break;
        }
      }

      // Rook (Left)
      for (let offset = 1; offset < 8; offset++) {
        const possibleSquare = document.querySelector(
          `.Square[data-row="${row}"][data-col="${col - offset}"]`,
        );

        if (!possibleSquare) break;

        if (
          possibleSquare.dataset.type &&
          possibleSquare.dataset.color === this.currentPlayer
        )
          break;

        if (!possibleSquare.dataset.type) {
          validSquareElements.push(possibleSquare);
        }

        if (
          possibleSquare.dataset.type &&
          possibleSquare.dataset.color !== this.currentPlayer
        ) {
          validSquareElements.push(possibleSquare);

          break;
        }
      }
    }

    // Bishop
    if (type === "bishop") {
      // Bishop (Top-Left)

      for (let offset = 1; offset < 8; offset++) {
        const possibleSquare = document.querySelector(
          `.Square[data-row="${row + offset}"][data-col="${col - offset}"]`,
        );

        if (!possibleSquare) break;

        if (
          possibleSquare.dataset.type &&
          possibleSquare.dataset.color === this.currentPlayer
        )
          break;

        if (!possibleSquare.dataset.type) {
          validSquareElements.push(possibleSquare);
        }

        if (
          possibleSquare.dataset.type &&
          possibleSquare.dataset.color !== this.currentPlayer
        ) {
          validSquareElements.push(possibleSquare);

          break;
        }
      }

      // Bishop (Top-Right)

      for (let offset = 1; offset < 8; offset++) {
        const possibleSquare = document.querySelector(
          `.Square[data-row="${row + offset}"][data-col="${col + offset}"]`,
        );

        if (!possibleSquare) break;

        if (
          possibleSquare.dataset.type &&
          possibleSquare.dataset.color === this.currentPlayer
        )
          break;

        if (!possibleSquare.dataset.type) {
          validSquareElements.push(possibleSquare);
        }

        if (
          possibleSquare.dataset.type &&
          possibleSquare.dataset.color !== this.currentPlayer
        ) {
          validSquareElements.push(possibleSquare);

          break;
        }
      }

      // Bishop (Bottom-Left)

      for (let offset = 1; offset < 8; offset++) {
        const possibleSquare = document.querySelector(
          `.Square[data-row="${row - offset}"][data-col="${col - offset}"]`,
        );

        if (!possibleSquare) break;

        if (
          possibleSquare.dataset.type &&
          possibleSquare.dataset.color === this.currentPlayer
        )
          break;

        if (!possibleSquare.dataset.type) {
          validSquareElements.push(possibleSquare);
        }

        if (
          possibleSquare.dataset.type &&
          possibleSquare.dataset.color !== this.currentPlayer
        ) {
          validSquareElements.push(possibleSquare);

          break;
        }
      }

      // Bishop (Bottom-Right)

      for (let offset = 1; offset < 8; offset++) {
        const possibleSquare = document.querySelector(
          `.Square[data-row="${row - offset}"][data-col="${col + offset}"]`,
        );

        if (!possibleSquare) break;

        if (
          possibleSquare.dataset.type &&
          possibleSquare.dataset.color === this.currentPlayer
        )
          break;

        if (!possibleSquare.dataset.type) {
          validSquareElements.push(possibleSquare);
        }

        if (
          possibleSquare.dataset.type &&
          possibleSquare.dataset.color !== this.currentPlayer
        ) {
          validSquareElements.push(possibleSquare);

          break;
        }
      }
    }

    // Knight
    if (type === "knight") {
      // Check all 8 possible squares

      const offsets = [
        { row: 2, col: -1 },
        { row: 2, col: 1 },
        { row: 1, col: -2 },
        { row: 1, col: 2 },
        { row: -1, col: -2 },
        { row: -1, col: 2 },
        { row: -2, col: -1 },
        { row: -2, col: 1 },
      ];

      offsets.forEach((offset) => {
        const possibleSquare = document.querySelector(
          `.Square[data-row="${row + offset.row}"][data-col="${col + offset.col}"]`,
        );

        if (!possibleSquare) return;

        if (
          !possibleSquare.dataset.type ||
          possibleSquare.dataset.color !== this.currentPlayer
        ) {
          validSquareElements.push(possibleSquare);
        }
      });
    }
    //TODO: Push valid squares into array

    return validSquareElements;
  }

  handleSquareClick(event) {
    const clickedSquareElement = event.currentTarget;

    this.resetValidSquares();
    this.resetSelectedSquares();

    const file = clickedSquareElement.dataset.file;
    const rank = parseInt(clickedSquareElement.dataset.rank);
    const type = clickedSquareElement.dataset.type;
    const color = clickedSquareElement.dataset.color;

    if (this.activeSquare && type && color === this.currentPlayer) {
      if (clickedSquareElement === this.activeSquare) {
        this.activeSquare = null;
      } else {
        this.activeSquare = clickedSquareElement;
      }
    } else if (type && color === this.currentPlayer) {
      this.activeSquare = clickedSquareElement;
    } else {
      this.activeSquare = null;
    }

    if (this.activeSquare) {
      clickedSquareElement.classList.add("Square--Selected");

      const validSquareElements = this.getValidSquares(file, rank);

      console.log(validSquareElements);
    }
  }

  resetValidSquares() {
    this.squareElements.forEach((squareElement) => {
      squareElement.classList.remove("Square--Valid");
    });
  }

  resetSelectedSquares() {
    this.squareElements.forEach((squareElement) => {
      squareElement.classList.remove("Square--Selected");
    });
  }

  get boardElement() {
    return document.querySelector(".Board");
  }

  get squareElements() {
    return document.querySelectorAll(".Square");
  }
}

new Game2();
