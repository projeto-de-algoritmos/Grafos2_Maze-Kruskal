import Phaser from "phaser";
import GameMaze from "./game/gameMaze";
import Character from "./game/character";
import { GESTURES, gestureDetection} from "./game/gestures";

const DIRECTIONS = {
    UP: 0,
    DOWN: 1,
    LEFT: 2,
    RIGHT: 3,
}

export default class TheFase extends Phaser.Scene {
    constructor() {
        super("TheFase");
    }
    
    init(data) {
        this.settings = data;
        this.handleGesture = this.handleGesture.bind(this);
        this.actionClock = 0;
        this.actionCooldown = 100;
    }
    
    preload() {
        // this.load.image("player", "assets/player.png");
    }
    
    create() {
        this.cameras.main.setBackgroundColor("0x000000");
        this.keys = this.input.keyboard.addKeys({
            up: 'W',
            down: 'S',
            left: 'A',
            right: 'D',
            arrowUp: 'up',
            arrowDown: 'down',
            arrowLeft: 'left',
            arrowRight: 'right',
            exit: 'Esc',
        });

        gestureDetection(this.input, this.handleGesture);

        this.graphics = this.add.graphics();

        this.maze = new GameMaze(this.game, this.graphics, this.settings.gridSize);

        let initialPosition = {
            x: 0,
            y: 0
        };
        this.character = new Character(this.maze, initialPosition, {
            smoothMovement: true,
        })

        this.endPoint = {
            x: this.settings.gridSize - 1,
            y: this.settings.gridSize - 1
        }

        this.maze.drawMaze();

        this.maze.fillGrid(this.endPoint, '0xff00000');
        
        this.character.drawCharacter();
    }

    handleGesture(detection) {
        switch (detection.gesture) {
            case GESTURES.SWIPE_LEFT:
                this.updateMovement(DIRECTIONS.LEFT);
                break;
            case GESTURES.SWIPE_RIGHT:
                this.updateMovement(DIRECTIONS.RIGHT);
                break;
            case GESTURES.SWIPE_UP:
                this.updateMovement(DIRECTIONS.UP);
                break;
            case GESTURES.SWIPE_DOWN:
                this.updateMovement(DIRECTIONS.DOWN);
                break;
            default:
                break;
        }
    }

    updateMovement(direction) {
        this.character.moveCharacter(direction);

        if (this.character.position.x === this.endPoint.x 
            && this.character.position.y === this.endPoint.y) {
            this.scene.start("GameEnd", {
                settings: this.settings,
                results: {
                    message: 'Finished',
                    messageColour: '#00ff00',
                }
            });
        }
    }
    
    update() {
        if (Phaser.Input.Keyboard.JustDown(this.keys.exit)) {
            this.scene.start('MainMenu', this.settings);
        }

        if (new Date().getTime() - this.actionClock > this.actionCooldown) {
            if (this.keys.up.isDown || this.keys.arrowUp.isDown) {
                this.updateMovement(DIRECTIONS.UP);
            } else if (this.keys.down.isDown || this.keys.arrowDown.isDown) {
                this.updateMovement(DIRECTIONS.DOWN);
            } else if (this.keys.left.isDown || this.keys.arrowLeft.isDown) {
                this.updateMovement(DIRECTIONS.LEFT);
            } else if (this.keys.right.isDown || this.keys.arrowRight.isDown) {
                this.updateMovement(DIRECTIONS.RIGHT);
            }
        }

        this.character.update();
    }
}