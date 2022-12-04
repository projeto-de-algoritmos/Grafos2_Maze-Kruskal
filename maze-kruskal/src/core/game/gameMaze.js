import Maze from '../../Utils/maze';
import { getDimensions } from './gameSettings';

export default class GameMaze extends Maze {
    constructor(game, graphics, size, colour = "#FFFFFF") {
        super(size);

        this.size = size;
        this.game = game;
        this.graphics = graphics;
        this.graphics.setPosition(1, 1);
        this.gameDimensions = getDimensions(this.game);
        this.sideLength = (this.gameDimensions.screenLength -2) / size;
        this.colour = colour;
    }

    drawMaze() {
        this.graphics.fillStyle(this.colour);
        this.maze.getVertices().forEach(vertex => {
            let position = vertex.split(',');

            let vertexX = Number(position[0]);
            let vertexY = Number(position[1]);

            let rectX = vertexX * this.sideLength +1;
            let rectY = vertexY * this.sideLength +1;

            let lengthX = this.sideLength - 2;
            let lengthY = this.sideLength - 2;

            if (this.maze.isEdge([vertex, `${vertexX - 1},${vertexY}`])) {
                rectX -= 1;
                lengthX += 1;
            }
            if (this.maze.isEdge([vertex, `${vertexX + 1},${vertexY}`])) {
                lengthX += 1;
            }
            if (this.maze.isEdge([vertex, `${vertexX},${vertexY - 1}`])) {
                rectY -= 1;
                lengthY += 1;
            }
            if (this.maze.isEdge([vertex, `${vertexX},${vertexY + 1}`])) {
                lengthY += 1;
            }
            this.graphics.fillRect(rectX, rectY, lengthX, lengthY);
        })
    }

    fillGrid(position, colour) {
        this.graphics.fillStyle(colour);
        this.graphics.fillRect(
            position.x * this.sideLength + 1,
            position.y * this.sideLength + 1,
            this.sideLength - 2,
            this.sideLength - 2
        );
    }
}