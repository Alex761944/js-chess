const gridContainer = document.querySelector(".GridContainer");

for (let i = 0; i < 64; i++) {
  const square = document.createElement("div");

  const row = Math.floor(i / 8);
  const col = i % 8;

  const isDark = (row + col) % 2 === 1;

  square.classList.add("Square");
  square.classList.add(isDark ? "Square--Dark" : "Square--Light");

  gridContainer.appendChild(square);
}
