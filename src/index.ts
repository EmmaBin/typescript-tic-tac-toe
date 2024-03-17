import "./style.css";

const appElement = document.getElementById("app");
const boardElement = document.getElementById("board");
const ROW_COUNT: number = 3;
const COL_COUNT: number = 3;
type Cell = "X" | "O" | ""
//winner is the final string got displayed
type Winner = Cell | "draw"
let winner: Winner = ""

type Board = [
  [Cell, Cell, Cell],
  [Cell, Cell, Cell],
  [Cell, Cell, Cell]

]
let boardState: Board = [
  ["", "", ""],
  ["", "", ""],
  ["", "", ""]
];
let currentMove: "X" | "O" = "X";


function createCell(row: number, col: number, content: Cell): HTMLElement {
  const cell = document.createElement("button");
  cell.setAttribute("data-row", row.toString());
  cell.setAttribute("data-col", col.toString());
  cell.setAttribute("data-content", content);
  cell.classList.add("cell");
  cell.addEventListener("click", () => {
    //每一次click,都会call一个function，如果反回来的值是真的，不用再玩了，赢家产生
    //如果是假的接着玩
    if (winner) return; //为什么在这里就check呢，不应该是call checkboard之后吗

    if (boardState[row][col] === "") {
      boardState[row][col] = currentMove
      currentMove = currentMove === "X" ? "O" : "X"
      winner = checkBoard()
      renderBoard()
    }
  })
  return cell;
}
type Coordinate = [number, number]
type Victory = [Coordinate, Coordinate, Coordinate]
const victories: Victory[] = [
  [
    [0, 0],
    [0, 1],
    [0, 2],
  ],
  [
    [1, 0],
    [1, 1],
    [1, 2],
  ],
  [
    [2, 0],
    [2, 1],
    [2, 2],
  ],
  [
    [0, 0],
    [1, 0],
    [2, 0],
  ],
  [
    [0, 1],
    [1, 1],
    [2, 1],
  ],
  [
    [0, 2],
    [1, 2],
    [2, 2],
  ],
  [
    [0, 0],
    [1, 1],
    [2, 2],
  ],
  [
    [0, 2],
    [1, 1],
    [2, 0],
  ],
];
//要么x o 或者平 要么游戏没结束，还有空格
function checkBoard(): Cell | "Draw" {
  for (let victory of victories) {
    const a = boardState[victory[0][0]][victory[0][1]]
    const b = boardState[victory[1][0]][victory[1][1]];
    const c = boardState[victory[2][0]][victory[2][1]];
    if (a !== "" && a === b && b === c) {
      return a
    }
  }

  let draw = true
  for (let i = 0; i < ROW_COUNT; i++) {
    for (let j = 0; j < COL_COUNT; j++) {
      if (boardState[i][j] === "") draw = false
    }
  }
  if (draw) return "Draw"
  return ""
}
function renderBoard() {
  if (!appElement) throw new Error("Cannot find app");
  if (!boardElement) throw new Error("Cannot find board");
  boardElement.innerHTML = "";
  for (let i = 0; i < ROW_COUNT; i++) {
    for (let j = 0; j < COL_COUNT; j++) {
      boardElement.appendChild(createCell(i, j, boardState[i][j]));

    }
  }
  const oldMoveElement = document.getElementById("move-element");
  if (oldMoveElement) {
    oldMoveElement.remove();
  }
  const moveElement = document.createElement("p");
  moveElement.id = "move-element";
  moveElement.innerText = winner ? `Winner is ${winner}` : `Next Move: ${currentMove}`;
  moveElement.classList.add("current-move");
  appElement.insertBefore(moveElement, document.getElementById("reset"));
}

function init() {
  const resetButton = document.getElementById("reset");
  if (!resetButton) throw new Error("No Reset button");

  resetButton.addEventListener("click", () => {
    boardState = [
      ["", "", ""],
      ["", "", ""],
      ["", "", ""]
    ];
    currentMove = "X";
    //每一次重新开始winner 也重新设置
    winner = ""
    renderBoard();
  });
  renderBoard();
}

init();
