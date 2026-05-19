class Game {
  constructor() {
    this.createBoard();
    this.placePieces();
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
    new Piece("rook", "dark", "a", "8");
    new Piece("knight", "dark", "b", "8");
    new Piece("bishop", "dark", "c", "8");
    new Piece("queen", "dark", "d", "8");
    new Piece("king", "dark", "e", "8");
    new Piece("bishop", "dark", "f", "8");
    new Piece("knight", "dark", "g", "8");
    new Piece("rook", "dark", "h", "8");

    new Piece("pawn", "dark", "a", "7");
    new Piece("pawn", "dark", "b", "7");
    new Piece("pawn", "dark", "c", "7");
    new Piece("pawn", "dark", "d", "7");
    new Piece("pawn", "dark", "e", "7");
    new Piece("pawn", "dark", "f", "7");
    new Piece("pawn", "dark", "g", "7");
    new Piece("pawn", "dark", "h", "7");

    new Piece("rook", "light", "a", "1");
    new Piece("knight", "light", "b", "1");
    new Piece("bishop", "light", "c", "1");
    new Piece("queen", "light", "d", "1");
    new Piece("king", "light", "e", "1");
    new Piece("bishop", "light", "f", "1");
    new Piece("knight", "light", "g", "1");
    new Piece("rook", "light", "h", "1");

    new Piece("pawn", "light", "a", "2");
    new Piece("pawn", "light", "b", "2");
    new Piece("pawn", "light", "c", "2");
    new Piece("pawn", "light", "d", "2");
    new Piece("pawn", "light", "e", "2");
    new Piece("pawn", "light", "f", "2");
    new Piece("pawn", "light", "g", "2");
    new Piece("pawn", "light", "h", "2");
  }

  get boardElement() {
    return document.querySelector(".Board");
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

    pieceElement.src = pieces[this.color][this.type];

    const squareElement = document.querySelector(
      `[data-file="${this.file}"][data-rank="${this.rank}"]`,
    );

    squareElement.appendChild(pieceElement);
  }

  goTo(file, rank) {}
}

const pieces = {
  dark: {
    king: "./img/king_dark.png",
    queen: "./img/queen_dark.png",
    rook: "./img/rook_dark.png",
    bishop: "./img/bishop_dark.png",
    knight: "./img/knight_dark.png",
    pawn: "./img/pawn_dark.png",
  },

  light: {
    king: "./img/king_light.png",
    queen: "./img/queen_light.png",
    rook: "./img/rook_light.png",
    bishop: "./img/bishop_light.png",
    knight: "./img/knight_light.png",
    pawn: "./img/pawn_light.png",
  },
};

new Game();
