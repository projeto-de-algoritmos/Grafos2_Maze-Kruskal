import Maze from '../../Utils/newMaze.js';
import { getDimensions } from './gameSettings';

export default class GameMaze extends Maze {
    constructor(game, graphics, size, colour = "0xFFFFFF") {
        super(size);
        this.size = size;
        this.game = game;
        this.graphics = graphics;
        this.graphics.setPosition(1, 1);
        this.gameDimensions = getDimensions(this.game);
        this.sideLength = parseInt((this.gameDimensions.screenLength -2) / size);
        this.colour = colour;
    }

    drawMaze() {
        return
        this.graphics.fillStyle(this.colour);

        const vertices = this.getVertices()
        
        vertices.forEach(vertex => {
            let position = vertex.split(',');

            let vertexX = Number(position[0]);
            let vertexY = Number(position[1]);

            let rectX = vertexX * this.sideLength +1;
            let rectY = vertexY * this.sideLength +1;

            let lengthX = this.sideLength - 2;
            let lengthY = this.sideLength - 2;

            const edges = this.getEdgesFromNode(vertex);

            for (const edg of edges) {
                if (edg.used) {
                    continue;
                }
                if (edg.to.x == vertexX - 1 && edg.to.y == vertexY) {
                    rectX -= 1;
                    lengthX += 1;
                }

                if (edg.to.x == vertexX + 1 && edg.to.y == vertexY) {
                    lengthX += 1;
                }

                if (edg.to.x == vertexX && edg.to.y == vertexY - 1) {
                    rectY -= 1;
                    lengthY += 1;
                }

                if (edg.to.x == vertexX && edg.to.y == vertexY + 1) {
                    lengthY += 1;
                }
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