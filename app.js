const canvas = document.querySelector("canvas");
const context = canvas.getContext("2d");

let current;
// SQUARE MAZE
class Maze {
  constructor(size, rows, cols) {
    this.size = size;
    this.rows = rows;
    this.cols = cols;
    this.grid = [];
    this.stack = [];
  }

  setup() {
    for (let r = 0; r < this.rows; r++) {
      let row = [];
      for (let c = 0; c < this.cols; c++) {
        let cell = new Cell(this.size, this.grid, this.rows, this.cols, r, c);
        row.push(cell);
      }
      this.grid.push(row);
    }

    current = this.grid[0][0];
  }

  draw() {
    canvas.width = this.size;
    canvas.height = this.size;
    canvas.style.background = "#74c0fc";

    this.grid.forEach((row) => {
      row.forEach((cell) => {
        cell.show();
      });
    });

    this.DFSMaze();

    requestAnimationFrame(() => {
      this.draw();
    });
  }

  DFSMaze() {
    current.isVisted = true;
    let next = current.getRandomNeighbour();

    if (next) {
      current.color = "#339af0";
      current.highlight();
      next.isVisted = true;
      this.stack.push(current);
      current.removeWalls(current, next);
      current = next;
    } else if (this.stack.length > 0) {
      current.color = "#74c0fc";
      current.highlight();
      const cell = this.stack.pop();
      current = cell;
    }

    if (this.stack.length == 0) {
      return;
    }
  }
}

class Cell {
  constructor(parentSize, parentGrid, rows, cols, rowPosition, colPosition) {
    this.parentSize = parentSize;
    this.parentGrid = parentGrid;
    this.rows = rows;
    this.cols = cols;
    this.rowPosition = rowPosition;
    this.colPosition = colPosition;
    this.size = this.parentSize / rows;
    this.walls = {
      topWall: true,
      rightWall: true,
      bottomWall: true,
      leftWall: true,
    };
    this.isVisted = false;
    this.neighbours = [];
    this.color = "#74c0fc";
  }

  setNeighbours() {
    this.neighbours = [];
    let x = this.rowPosition;
    let y = this.colPosition;

    let top = x !== 0 ? this.parentGrid[x - 1][y] : undefined;
    let right = y !== this.cols - 1 ? this.parentGrid[x][y + 1] : undefined;
    let bottom = x !== this.rows - 1 ? this.parentGrid[x + 1][y] : undefined;
    let left = y !== 0 ? this.parentGrid[x][y - 1] : undefined;

    if (top && !top.isVisted) this.neighbours.push(top);
    if (right && !right.isVisted) this.neighbours.push(right);
    if (bottom && !bottom.isVisted) this.neighbours.push(bottom);
    if (left && !left.isVisted) this.neighbours.push(left);
  }

  getRandomNeighbour() {
    this.setNeighbours();

    const neighboursLength = this.neighbours.length;
    if (neighboursLength == 0) return undefined;

    const rand = Math.floor(Math.random() * neighboursLength);
    return this.neighbours[rand];
  }

  drawLines(fromX, fromY, toX, toY) {
    context.lineWidth = 2;
    context.strokeStyle = "#fff";
    context.beginPath();
    context.moveTo(fromX, fromY);
    context.lineTo(toX, toY);
    context.stroke();
  }

  removeWalls(cell1, cell2) {
    let xDiff = cell2.colPosition - cell1.colPosition;
    if (xDiff == 1) {
      cell1.walls.rightWall = false;
      cell2.walls.leftWall = false;
    } else if (xDiff == -1) {
      cell1.walls.leftWall = false;
      cell2.walls.rightWall = false;
    }

    let yDiff = cell2.rowPosition - cell1.rowPosition;
    if (yDiff == 1) {
      cell1.walls.bottomWall = false;
      cell2.walls.topWall = false;
    } else if (yDiff == -1) {
      cell1.walls.topWall = false;
      cell2.walls.bottomWall = false;
    }
  }

  drawWalls() {
    let fromX = 0;
    let fromY = 0;
    let toX = 0;
    let toY = 0;

    if (this.walls.topWall) {
      fromX = this.colPosition * this.size;
      fromY = this.rowPosition * this.size;
      toX = fromX + this.size;
      toY = fromY;
      this.drawLines(fromX, fromY, toX, toY);
    }
    if (this.walls.rightWall) {
      fromX = (this.colPosition + 1) * this.size;
      fromY = this.rowPosition * this.size;
      toX = fromX;
      toY = fromY + this.size;
      this.drawLines(fromX, fromY, toX, toY);
    }
    if (this.walls.bottomWall) {
      fromX = (this.colPosition + 1) * this.size;
      fromY = (this.rowPosition + 1) * this.size;
      toX = fromX - this.size;
      toY = fromY;
      this.drawLines(fromX, fromY, toX, toY);
    }
    if (this.walls.leftWall) {
      fromX = this.colPosition * this.size;
      fromY = (this.rowPosition + 1) * this.size;
      toX = fromX;
      toY = fromY - this.size;
      this.drawLines(fromX, fromY, toX, toY);
    }
  }

  highlight() {
    context.fillStyle = "#862e9c";
    const width = this.colPosition * this.size + 1;
    const heigth = this.rowPosition * this.size + 1;
    const size = this.size - 2;

    context.fillRect(width, heigth, size, size);
  }
  show() {
    this.drawWalls();
    context.fillStyle = this.color;
    const width = this.colPosition * this.size + 1;
    const heigth = this.rowPosition * this.size + 1;
    const size = this.size - 2;

    context.fillRect(width, heigth, size, size);
  }
}

const maze = new Maze(600, 10, 10);
maze.setup();
maze.draw();
