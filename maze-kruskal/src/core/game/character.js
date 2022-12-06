const DEFAULT_UPDATE_STEPS = 5;

export default class Character {
    constructor(maze, initialPosition, options = {}) {
        this.maze = maze;
        this.position = initialPosition;
        this.prevPos = initialPosition;
        this.colour = options.colour || "0xd0ff00";
        this.smoothMovement = options.smoothMovement || false;
        this.UPDATE_STEPS = options.updateSteps || DEFAULT_UPDATE_STEPS;
        this.updating = false;
        this.updateStep = 0;
        this.DIRECTIONS = {
            UP: 0,
            DOWN: 1,
            LEFT: 2,
            RIGHT: 3,
        }
    }

    static get DIRECTIONS() {
        return DIRECTIONS;
      }

    drawCharacter() {
        this.maze.fillGrid(this.position, this.colour);
    }

    moveCharacter(direction) {
        if (this.updating) {
            return;
        }

        let prevPos = { ...this.position };
        let newPos = { ...this.position };

        switch (direction) {
            case this.DIRECTIONS.UP:
                newPos.y -= 1;
                if (newPos.y < 0) {
                    newPos.y = 0;
                }
                break;
            case this.DIRECTIONS.DOWN:
                newPos.y += 1;
                if (newPos.y > this.maze.size - 1) {
                    newPos.y = this.maze.size - 1;
                }
                break;
            case this.DIRECTIONS.LEFT:
                newPos.x -= 1;
                if (newPos.x < 0) {
                    newPos.x = 0;
                }
                break;
            case this.DIRECTIONS.RIGHT:
                newPos.x += 1;
                if (newPos.x > this.maze.size - 1) {
                    newPos.x = this.maze.size - 1;
                }
                break;
            default:
                break;
        }

        if (this.maze.isEdge([`${prevPos.x},${prevPos.y}`, `${newPos.x},${newPos.y}`])) {
            this.position = newPos;
            this.prevPos = prevPos;

            if (this.smoothMovement) {
                this.updating = true;
            } else {
                this.maze.fillGrid(this.prevPos, this.maze.colour);
                this.maze.fillGrid(this.newPos, this.colour);
            }
        }
    }

    update() {
        if (this.updating) {
            this._smoothMovement(this.prevPos, this.position);
        }
    }

    isUpdating() {
        return this.updating;
    }

    _smoothMovement() {
        let diffX = Math.round(this.position.x - this.prevPos.x);
        let diffY = Math.round(this.position.y - this.prevPos.y);
        if (diffX !== 0) {
          // Calculating the intermediate steps...
          let interFrom = {
            ...this.prevPos,
            x:
              Math.round(
                (this.prevPos.x +
                  (1 / this.UPDATE_STEPS) * this.updateStep * diffX) *
                  10
              ) / 10
          };
          let interTo = {
            ...this.prevPos,
            x:
              Math.round(
                (this.prevPos.x +
                  (1 / this.UPDATE_STEPS) * (this.updateStep + 1) * diffX) *
                  10
              ) / 10
          };
          this.maze.fillGrid(interFrom, this.maze.colour);
          this.maze.fillGrid(interTo, this.colour);
        } else {
          let interFrom = {
            ...this.prevPos,
            y:
              Math.round(
                (this.prevPos.y +
                  (1 / this.UPDATE_STEPS) * this.updateStep * diffY) *
                  10
              ) / 10
          };
          let interTo = {
            ...this.prevPos,
            y:
              Math.round(
                (this.prevPos.y +
                  (1 / this.UPDATE_STEPS) * (this.updateStep + 1) * diffY) *
                  10
              ) / 10
          };
          this.maze.fillGrid(interFrom, this.maze.colour);
          this.maze.fillGrid(interTo, this.colour);
        }
    
        this.updateStep++;
        if (this.updateStep % this.UPDATE_STEPS === 0) {
          this.updateStep = 0;
          this.updating = false;
        }
      }
}