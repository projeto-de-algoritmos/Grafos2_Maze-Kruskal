import Graph from '../core/graphMaze.js'

export default class Maze {
    constructor(size = 10) {
        this.maze = this._createGrid(size);
        this._createMaze();
    }

    getVertices() {
        return this.maze.getNodes();
    }

    getEdgesFromNode(key) {
        return this.maze.getEdgesFromNode(key);
    }

    isEdge([keyFrom, keyTo]) {
        const edges = this.getEdgesFromNode(keyFrom);
        const [x, y] = keyTo.split(',');
        for (const edg of edges) {
            if (edg.used && edg.to.x == x && edg.to.y == y)
                return true
        }
        return false
    }

    aoba() {
        return this.maze.getUsedEdges()
    }

    _createGrid(size) {
        const grid = new Graph(10);
        grid.populateEdges();
        return grid;
    }

    _createMaze() {
        this.maze.kraskul();
    }
}