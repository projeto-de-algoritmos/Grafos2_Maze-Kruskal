import Phaser from "phaser";
import {
    initSettings,
    getDimensions,
} from "./game/gameSettings";
import { GESTURES, gestureDetection } from "./game/gestures";

export default class MainMenu extends Phaser.Scene {
    constructor() {
        super("MainMenu");
    }

    init(data) {
        this.settings = {...initSettings, ...data};
        this.handleGesture = this.handleGesture.bind(this);
    }

    preload() {

    }

    create() {
        this.cameras.main.setBackgroundColor("#FFFFFF");
        this.keys = this.input.keyboard.addKeys({
            up: 'W',
            down: 'S',
            left: 'A',
            right: 'D',
            arrowUp: 'up',
            arrowDown: 'down',
            arrowLeft: 'left',
            arrowRight: 'right',
            select: 'Enter',
            exit: 'Esc',
        });
        gestureDetection(this.input, this.handleGesture);

        this.gameDimensions = getDimensions(this.game);

        this.choice = 0;

        this.doubleTapTimer = 0;
        this.doubleTapCooldown = 200;

        let title = this.add.text(
            this.gameDimensions.screenCenter,
            this.gameDimensions.screenSpaceUnit * 4,
            "Maze",
            {
                fontFamily: 'Inter',
                fill: '#000000',
                fontSize: this.gameDimensions.textSize2,
            }
        );
        title.setOrigin(0.5, 0.5);

        let startGame = this.add.text(
            this.gameDimensions.screenCenter,
            this.gameDimensions.screenSpaceUnit * 8,
            "Start Game",
            {
                fontFamily: 'Inter',
                fill: '#000000',
                fontSize: this.gameDimensions.textSize3,
            }
        );
        startGame.setOrigin(0.5, 0.5);

        let exit = this.add.text(
            this.gameDimensions.screenCenter,
            this.gameDimensions.screenSpaceUnit * 16,
            "Exit",
            {
                fontFamily: 'Inter',
                fill: '#000000',
                fontSize: this.gameDimensions.textSize3,
            }
        );
        exit.setOrigin(0.5, 0.5);

        this.options = [
            {text: startGame, scene: "TheFase"},
            {text: exit, scene: "Exit"},
        ];
    }

    handleGesture(detection) {
        if (detection.gesture === GESTURES.SWIPE_UP) {
            this.updateChoice(-1);
        } else if (detection.gesture === GESTURES.SWIPE_DOWN) {
            this.updateChoice(1);
        } else if (detection.gesture === GESTURES.SINGLE_TAP) {
            this.scene.start(this.options[this.choice].scene, this.settings);
            this.doubleTapTimer = new Date().getTime();
        }
    }

    update() {
        if (
            Phaser.Input.Keyboard.JustDown(this.keys.up) ||
            Phaser.Input.Keyboard.JustDown(this.keys.arrowUp)
        ) {
            this.updateChoice(-1);
        }
        if (
            Phaser.Input.Keyboard.JustDown(this.keys.down) ||
            Phaser.Input.Keyboard.JustDown(this.keys.arrowDown)
        ) {
            this.updateChoice(1);
        }
        if (
            Phaser.Input.Keyboard.JustDown(this.keys.select)
        ) {
            this.scene.start(this.options[this.choice].scene, this.settings);
        }
    }

    updateChoice(direction) {
        let newChoice = this.choice + direction;
        if (newChoice > -1 && newChoice < this.options.length) {
            this.options[this.choice].text.setFill("#000000");
            this.options[newChoice].text.setFill("#FF0000");
            this.choice = newChoice;
        }
    }
}