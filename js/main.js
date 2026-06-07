class Game {
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
        type: "pawn",
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
        color: "dark",
        type: "queen",
        file: "b",
        rank: "6",
      },
      {
        color: "dark",
        type: "pawn",
        file: "b",
        rank: "4",
      },
      {
        color: "light",
        type: "king",
        file: "b",
        rank: "3",
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

    return filteredCoveredSquares;
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
        if (!this.resultsInCheck({ row, col }, { row: row + 1, col }, color)) {
          validSquareElements.push(
            document.querySelector(
              `.Square[data-row="${row + 1}"][data-col="${col}"]`,
            ),
          );
        }

        // Pawn-Light possible first move
        if (
          !hasMoved &&
          !this.resultsInCheck({ row, col }, { row: row + 2, col }, color)
        ) {
          validSquareElements.push(
            document.querySelector(
              `.Square[data-row="${row + 2}"][data-col="${col}"]`,
            ),
          );
        }
      }

      // Pawn-Dark
      if (color === "dark") {
        if (!this.resultsInCheck({ row, col }, { row: row - 1, col }, color)) {
          validSquareElements.push(
            document.querySelector(
              `.Square[data-row="${row - 1}"][data-col="${col}"]`,
            ),
          );
        }

        // Pawn-Dark first move
        if (
          !hasMoved &&
          !this.resultsInCheck({ row, col }, { row: row - 2, col }, color)
        ) {
          validSquareElements.push(
            document.querySelector(
              `.Square[data-row="${row - 2}"][data-col="${col}"]`,
            ),
          );
        }
      }
    }

    // Rook or Queen
    if (type === "rook" || type === "queen") {
      // Rook or Queen (Top)

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

        if (
          !possibleSquare.dataset.type &&
          !this.resultsInCheck({ row, col }, { row: row + offset, col }, color)
        ) {
          validSquareElements.push(possibleSquare);
        }

        if (
          possibleSquare.dataset.type &&
          possibleSquare.dataset.color !== this.currentPlayer &&
          !this.resultsInCheck({ row, col }, { row: row + offset, col }, color)
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

        if (
          !possibleSquare.dataset.type &&
          !this.resultsInCheck({ row, col }, { row, col: col + offset }, color)
        ) {
          validSquareElements.push(possibleSquare);
        }

        if (
          possibleSquare.dataset.type &&
          possibleSquare.dataset.color !== this.currentPlayer &&
          !this.resultsInCheck({ row, col }, { row, col: col + offset }, color)
        ) {
          validSquareElements.push(possibleSquare);

          break;
        }
      }

      // Rook or Queen (Bottom)
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

        if (
          !possibleSquare.dataset.type &&
          !this.resultsInCheck({ row, col }, { row: row - offset, col }, color)
        ) {
          validSquareElements.push(possibleSquare);
        }

        if (
          possibleSquare.dataset.type &&
          possibleSquare.dataset.color !== this.currentPlayer &&
          !this.resultsInCheck({ row, col }, { row: row - offset, col }, color)
        ) {
          validSquareElements.push(possibleSquare);

          break;
        }
      }

      // Rook or Queen (Left)
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

        if (
          !possibleSquare.dataset.type &&
          !this.resultsInCheck({ row, col }, { row, col: col - offset }, color)
        ) {
          validSquareElements.push(possibleSquare);
        }

        if (
          possibleSquare.dataset.type &&
          possibleSquare.dataset.color !== this.currentPlayer &&
          !this.resultsInCheck({ row, col }, { row, col: col - offset }, color)
        ) {
          validSquareElements.push(possibleSquare);

          break;
        }
      }
    }

    // Bishop or Queen
    if (type === "bishop" || type === "queen") {
      // Bishop or Queen (Top-Left)

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

        if (
          !possibleSquare.dataset.type &&
          !this.resultsInCheck(
            { row, col },
            { row: row + offset, col: col - offset },
            color,
          )
        ) {
          validSquareElements.push(possibleSquare);
        }

        if (
          possibleSquare.dataset.type &&
          possibleSquare.dataset.color !== this.currentPlayer &&
          !this.resultsInCheck(
            { row, col },
            { row: row + offset, col: col - offset },
            color,
          )
        ) {
          validSquareElements.push(possibleSquare);

          break;
        }
      }

      // Bishop or Queen (Top-Right)

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

        if (
          !possibleSquare.dataset.type &&
          !this.resultsInCheck(
            { row, col },
            { row: row + offset, col: col + offset },
            color,
          )
        ) {
          validSquareElements.push(possibleSquare);
        }

        if (
          possibleSquare.dataset.type &&
          possibleSquare.dataset.color !== this.currentPlayer &&
          !this.resultsInCheck(
            { row, col },
            { row: row + offset, col: col + offset },
            color,
          )
        ) {
          validSquareElements.push(possibleSquare);

          break;
        }
      }

      // Bishop or Queen (Bottom-Left)

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

        if (
          !possibleSquare.dataset.type &&
          !this.resultsInCheck(
            { row, col },
            { row: row - offset, col: col - offset },
            color,
          )
        ) {
          validSquareElements.push(possibleSquare);
        }

        if (
          possibleSquare.dataset.type &&
          possibleSquare.dataset.color !== this.currentPlayer &&
          !this.resultsInCheck(
            { row, col },
            { row: row - offset, col: col - offset },
            color,
          )
        ) {
          validSquareElements.push(possibleSquare);

          break;
        }
      }

      // Bishop or Queen (Bottom-Right)

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

        if (
          !possibleSquare.dataset.type &&
          !this.resultsInCheck(
            { row, col },
            { row: row - offset, col: col + offset },
            color,
          )
        ) {
          validSquareElements.push(possibleSquare);
        }

        if (
          possibleSquare.dataset.type &&
          possibleSquare.dataset.color !== this.currentPlayer &&
          !this.resultsInCheck(
            { row, col },
            { row: row - offset, col: col + offset },
            color,
          )
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
          (!possibleSquare.dataset.type ||
            possibleSquare.dataset.color !== this.currentPlayer) &&
          !this.resultsInCheck(
            { row, col },
            { row: row + offset.row, col: col + offset.col },
            color,
          )
        ) {
          validSquareElements.push(possibleSquare);
        }
      });
    }

    // King
    if (type === "king") {
      // Check all 8 possible squares

      const offsets = [
        { row: 1, col: -1 },
        { row: 1, col: 0 },
        { row: 1, col: 1 },
        { row: 0, col: -1 },
        { row: 0, col: 1 },
        { row: -1, col: -1 },
        { row: -1, col: 0 },
        { row: -1, col: 1 },
      ];

      offsets.forEach((offset) => {
        const possibleSquare = document.querySelector(
          `.Square[data-row="${row + offset.row}"][data-col="${col + offset.col}"]`,
        );

        if (!possibleSquare) return;

        if (
          (!possibleSquare.dataset.type ||
            possibleSquare.dataset.color !== this.currentPlayer) &&
          !this.resultsInCheck(
            { row, col },
            { row: row + offset.row, col: col + offset.col },
            color,
          )
        ) {
          validSquareElements.push(possibleSquare);
        }
      });
    }

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
    }

    const validSquareElements = this.getValidSquares(file, rank);

    validSquareElements.forEach((validSquareElement) => {
      validSquareElement.classList.add("Square--Valid");
    });

    if (this.activeSquare !== clickedSquareElement) {
      this.executeMove();
    }
  }

  executeMove(origin, destination) {
    //TODO: Move piece
  }

  isInCheck(color) {
    const opponentColor = color === "light" ? "dark" : "light";
    const opponentSquareElements = document.querySelectorAll(
      `.Square[data-color="${opponentColor}"]`,
    );

    const ownKingElement = document.querySelector(
      `.Square[data-type="king"][data-color="${color}"]`,
    );

    let isInCheck = false;

    opponentSquareElements.forEach((opponentSquareElement) => {
      const coveredSquareElements = this.getCoveredSquares(
        opponentSquareElement.dataset.file,
        opponentSquareElement.dataset.rank,
      );

      if (coveredSquareElements.includes(ownKingElement)) {
        isInCheck = true;
      }
    });

    return isInCheck;
  }

  resultsInCheck(origin, destination, color) {
    const originSquareElement = document.querySelector(
      `.Square[data-row="${origin.row}"][data-col="${origin.col}"]`,
    );

    const destinationSquareElement = document.querySelector(
      `.Square[data-row="${destination.row}"][data-col="${destination.col}"]`,
    );

    const originalOriginDataAttributes = {
      type: originSquareElement.dataset.type,
      color: originSquareElement.dataset.color,
    };

    const originalDestinationDataAttributes = {
      type: destinationSquareElement.dataset.type,
      color: destinationSquareElement.dataset.color,
    };

    // Simulate move
    originSquareElement.removeAttribute("data-type");
    originSquareElement.removeAttribute("data-color");

    destinationSquareElement.setAttribute(
      "data-type",
      originalOriginDataAttributes.type,
    );
    destinationSquareElement.setAttribute(
      "data-color",
      originalOriginDataAttributes.color,
    );

    const result = this.isInCheck(color);

    // Restore origin
    if (originalOriginDataAttributes.type) {
      originSquareElement.setAttribute(
        "data-type",
        originalOriginDataAttributes.type,
      );
    } else {
      originSquareElement.removeAttribute("data-type");
    }

    if (originalOriginDataAttributes.color) {
      originSquareElement.setAttribute(
        "data-color",
        originalOriginDataAttributes.color,
      );
    } else {
      originSquareElement.removeAttribute("data-color");
    }

    // Restore destination
    if (originalDestinationDataAttributes.type) {
      destinationSquareElement.setAttribute(
        "data-type",
        originalDestinationDataAttributes.type,
      );
    } else {
      destinationSquareElement.removeAttribute("data-type");
    }

    if (originalDestinationDataAttributes.color) {
      destinationSquareElement.setAttribute(
        "data-color",
        originalDestinationDataAttributes.color,
      );
    } else {
      destinationSquareElement.removeAttribute("data-color");
    }

    return result;
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

new Game();
