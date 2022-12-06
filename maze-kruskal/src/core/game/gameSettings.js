export function getDimensions(game) {
    const screenLength = game.config.width;
    return {
        screenLength,
        screenSpaceUnit: screenLength / 20,
        screenCenter: screenLength / 2,
        textSize1: screenLength / 10,
        textSize2: screenLength / 15,
        textSize3: screenLength / 18,
        textSize4: screenLength / 22
    };
}

export function initSettings() {
    return {
      maxGridSize: 35,
      minGridSize: 10,
      gridSize: 20,
      maxSideLength: 15,
      minSideLength: 10,
      sideLength: 10,
      gameMode: 0,
    };
  }