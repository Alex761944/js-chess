const gridContainer = document.querySelector(".GridContainer");

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

const createPiece = (type, color) => ({
  type,
  color,
  hasMoved: false,
});

const board = [
  createPiece("rook", "dark"),
  createPiece("knight", "dark"),
  createPiece("bishop", "dark"),
  createPiece("queen", "dark"),
  createPiece("king", "dark"),
  createPiece("bishop", "dark"),
  createPiece("knight", "dark"),
  createPiece("rook", "dark"),

  createPiece("pawn", "dark"),
  createPiece("pawn", "dark"),
  createPiece("pawn", "dark"),
  createPiece("pawn", "dark"),
  createPiece("pawn", "dark"),
  createPiece("pawn", "dark"),
  createPiece("pawn", "dark"),
  createPiece("pawn", "dark"),

  ...Array(32).fill(null),

  createPiece("pawn", "light"),
  createPiece("pawn", "light"),
  createPiece("pawn", "light"),
  createPiece("pawn", "light"),
  createPiece("pawn", "light"),
  createPiece("pawn", "light"),
  createPiece("pawn", "light"),
  createPiece("pawn", "light"),

  createPiece("rook", "light"),
  createPiece("knight", "light"),
  createPiece("bishop", "light"),
  createPiece("queen", "light"),
  createPiece("king", "light"),
  createPiece("bishop", "light"),
  createPiece("knight", "light"),
  createPiece("rook", "light"),
];

for (let i = 0; i < 64; i++) {
  const square = document.createElement("div");

  const row = Math.floor(i / 8);
  const col = i % 8;

  const isDark = (row + col) % 2 === 1;

  square.classList.add("Square");
  square.classList.add(isDark ? "Square--Dark" : "Square--Light");

  const piece = board[i];

  if (piece) {
    const img = document.createElement("img");

    img.src = pieces[piece.color][piece.type];

    square.appendChild(img);
  }

  gridContainer.appendChild(square);
}
