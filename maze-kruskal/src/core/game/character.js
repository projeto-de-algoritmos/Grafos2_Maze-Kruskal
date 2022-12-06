
const DIRECTIONS = {
    UP: 0,
    DOWN: 1,
    LEFT: 2,
    RIGHT: 3
}

const DEFAULT_UPDATE_STEPS = 5;

export default class Character {
    constructor(maze, initialPosition, options = {}) {
        this.maze = maze;
        this.position = initialPosition;
        this.prevPos = initialPosition;
        this.colour = options.colour || "#d0ff00";
        this.smoothMovement = options.smoothMovement || false;
        this.UPDATE_STEPS = options.updateSteps || DEFAULT_UPDATE_STEPS;
        this.updating = false;
        this.updateStep = 0;
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
            case DIRECTIONS.UP:
                newPos.y -= 1;
                if (newPos.y < 0) {
                    newPos.y = 0;
                }
                break;
            case DIRECTIONS.DOWN:
                newPos.y += 1;
                if (newPos.y > this.maze.size - 1) {
                    newPos.y = this.maze.size - 1;
                }
                break;
            case DIRECTIONS.LEFT:
                newPos.x -= 1;
                if (newPos.x < 0) {
                    newPos.x = 0;
                }
                break;
            case DIRECTIONS.RIGHT:
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
                this.maze.fillGrid(prevPos, this.maze.colour);
                this.maze.fillGrid(newPos, this.colour);
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
        let diferenceX = Math.round(this.position.x - this.prevPos.x);
        let diferenceY = Math.round(this.position.y - this.prevPos.y);

        if (diferenceX !== 0) {
            let translateFrom = {
                ...this.prevPos,
                x:
                    Math.round(
                        (this.prevPos.x +
                            (1 / this.UPDATE_STEPS) * this.updateStep * diferenceX) * 10
                    ) / 10
            };

            let translateTo = {
                ...this.prevPos,
                x:
                    Math.round(
                        (this.prevPos.x +
                            (1 / this.UPDATE_STEPS) * (this.updateStep + 1) * diferenceX) * 10
                    ) / 10
            };

            this.maze.fillGrid(translateFrom, this.maze.colour);
            this.maze.fillGrid(translateTo, this.colour);
        } else {
            let translateFrom = {
                ...this.prevPos,
                y:
                    Math.round(
                        (this.prevPos.y +
                            (1 / this.UPDATE_STEPS) * this.updateStep * diferenceY) *
                        10
                    ) / 10
            };
            let translateTo = {
                ...this.prevPos,
                y:
                    Math.round(
                        (this.prevPos.y +
                            (1 / this.UPDATE_STEPS) * (this.updateStep + 1) * diferenceY) *
                        10
                    ) / 10
            };
            this.maze.fillGrid(translateFrom, this.maze.colour);
            this.maze.fillGrid(translateTo, this.colour);
        }

        this.updateStep++;

        if (this.updateStep % this.UPDATE_STEPS === 0) {
            this.updateStep = 0;
            this.updating = false;
        }
    }
}