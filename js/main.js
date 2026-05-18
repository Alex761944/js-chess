const gridContainer = document.querySelector(".GridContainer");

let ACTIVE_PIECE = null;

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

// Create initial board
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

    img.setAttribute("data-type", board[i].type);
    img.setAttribute("data-color", board[i].color);

    square.appendChild(img);
  }

  square.addEventListener("click", (event) => {
    handleSquareClick(event.target);
  });

  gridContainer.appendChild(square);
}

function handleSquareClick(imageElement) {
  // Select piece
  if (!ACTIVE_PIECE) {
    if (!imageElement.hasAttribute("data-type")) return;

    ACTIVE_PIECE = imageElement;

    ACTIVE_PIECE.classList.add("Square--Selected");
  } else {
    // Here is the code when a piece is selected, move it to the square.

    imageElement.appendChild(ACTIVE_PIECE);
  }
}
