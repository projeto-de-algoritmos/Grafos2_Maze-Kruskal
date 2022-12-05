import React from 'react';
import Phaser from 'phaser';
import TheFase from './core/theFase';
import MainMenu from './core/MainMenu';

export default class Game extends React.Component {
    componentDidMount() {
        const dimension = this._getDimensions();
        const config = {
            type: Phaser.AUTO,
            width: dimension * 0.8,
            height: dimension * 0.8,
            parent: 'game-parent',
            physics: {
                default: 'arcade',
                arcade: {
                    gravity: { y: 200 },
                }
            },
            input: {
                activePointers: 5,
            },
            scene: {
                MainMenu,
                TheFase,
            }
        };

        new Phaser.Game(config);
    }

    _getDimensions() {
        const width = window.innerWidth;
        const height = window.innerHeight;
        return width < height ? width : height;
    }

    render() {
        return <div id="game-parent"/>;
    }
}