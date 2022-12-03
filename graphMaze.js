class UnionFind {
  constructor(keyNodesList) {
    this.data = {}
    keyNodesList.forEach(key => {
      this.data[key] = {
        n: 1,
        root: key
      }
    });
  }

  find(key) {
    let root = this.data[key].root;

    while (root != this.data[root].root) {
      root = this.data[root].root;
    }

    return root;
  }

  union(key1, key2) {

    const rootKey1 = key1;
    const rootKey2 = key2;

    const numNodesRoot1 = this.data[rootKey1].n;
    const numNodesRoot2 = this.data[rootKey2].n;

    if (numNodesRoot1 > numNodesRoot2) {
      this.data[rootKey2].root = rootKey1;
      this.data[rootKey2].n = 0;
    }
    else if (numNodesRoot1 < numNodesRoot2){
      this.data[rootKey1].root = rootKey2;
      this.data[rootKey1].n = 0;
    }
    else {
      this.data[rootKey2].root = rootKey1;
      this.data[rootKey2].n = 0;
      this.data[rootKey1].n += 1;
    }
  }
}

class Edge {
  constructor(weigth, x1, y1, x2, y2) {
    this.from = {
      x: x1,
      y: y1
    };
    this.to = {
      x: x2,
      y: y2
    };
    this.weigth = weigth;
    this.used = false;
  }
}

class Graph {
  constructor(numNodes) {
    this.numNodes = numNodes;
    this.graph = new Map();
    for (let i = 0; i < numNodes; i++) {
      for (let j = 0; j < numNodes; j++) {
        this.graph.set(`${i}${j}`, new Set());
      }
    }
  
  }

  getNode(key) {
    return {
      x: parseInt(key.at(0)),
      y: parseInt(key.at(1))
    };
  }

  randomWeigth() {
    return Math.floor(Math.random() * (3 - 1 + 1) + 1);
  }

  print() {
    for (const [key, adj] of this.graph.entries()) {
      const node = this.getNode(key)
      const edges = Array.from(adj.values())
      console.log(node, edges)
    }
  }

  printMaze() {
    let count = 0;
    let buffer = '';
    for (const [key, adj] of this.graph.entries()) {
      const node = this.getNode(key);
      //process.stdout.write(`${node.x}${node.y}`);
      process.stdout.write(`o`);

      const edges = Array.from(adj.values());
      for (const edge of edges) {
        const edgeTo = edge.to;
        if (edgeTo.y == node.y + 1) {
          if (edge.used) {
            process.stdout.write(' ')
          } else {
            process.stdout.write(`■`)
          }
        }
        if (edgeTo.x == node.x + 1) {
          if (edge.used) {
            buffer += ' '
          } else {
            buffer += `■ `
          }
        }
      }

      if (count == this.numNodes - 1) {
        process.stdout.write("\n");
        process.stdout.write(buffer);
        process.stdout.write("\n");
        buffer = '';
        count = -1;
      }

      count++;
    }
  }

  sortEdges() {
    return Array.from(this.graph.values()).map(adj => Array.from(adj.values())).flat(1).sort((a, b) => {
      return a.weigth > b.weigth
        ? 1
        : a.weigth === b.weigth
          ? 0
          : -1
    })
  }

  kraskul() {
    const sortedEdges = this.sortEdges();

    const unionFind = new UnionFind(Array.from(this.graph.keys()));

    let count = 0;
    for (const edge of sortedEdges) {
      if (count == (this.graph.numNodes ** 2) - 1) {
        //console.log('aoba')
        return;
      }
      const nodeFrom = edge.from;
      const nodeTo = edge.to;

      const strNodeFrom = `${nodeFrom.x}${nodeFrom.y}`;
      const strNodeTo = `${nodeTo.x}${nodeTo.y}`;

      //console.log('desse: ', strNodeFrom, ' pra esse: ', strNodeTo)

      const find1 = unionFind.find(strNodeFrom);
      const find2 = unionFind.find(strNodeTo);

      if (find1 != find2) {
        //console.log('entrei no if')
        edge.used = true;
        unionFind.union(find1, find2);
        count++;
      }
      
    }

    console.log(unionFind.data)
  }

  populateEdges() {
    for (const [key, adj] of this.graph.entries()) {
      const node = this.getNode(key)
      if (node.x < this.numNodes - 1) {
        //insere embaixo
        const newEdge = new Edge(this.randomWeigth(), node.x, node.y, node.x + 1, node.y);
        adj.add(newEdge);
        const newEdge2 = new Edge(this.randomWeigth(), node.x + 1, node.y, node.x, node.y);
        const anotherNode = this.graph.get(`${node.x + 1}${node.y}`);
        anotherNode.add(newEdge2);
      }
      if (node.y < this.numNodes - 1) {
        //insere direita
        const newEdge = new Edge(this.randomWeigth(), node.x, node.y, node.x, node.y + 1);
        adj.add(newEdge);
        const newEdge2 = new Edge(this.randomWeigth(), node.x, node.y + 1, node.x, node.y);
        const anotherNode = this.graph.get(`${node.x}${node.y + 1}`);
        anotherNode.add(newEdge2);
      }
    }
  }
}

const a = new Graph(5);
a.populateEdges();
console.log(Array.from(a.graph.keys()))
a.printMaze();
console.log();
a.kraskul();
a.printMaze();



