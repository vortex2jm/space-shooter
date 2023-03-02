import Phaser from './lib/phaser.js'

import Start from './scenes/Start.js'
import Menu from './scenes/Menu.js'
import Game from './scenes/Game.js'
import Pause from './scenes/Pause.js'
import GameOver from './scenes/GameOver.js'

export default new Phaser.Game({
    type: Phaser.AUTO,
    width: 400,
    height: 600,
    scene: [Start, Menu, Game, Pause, GameOver],
    physics: {
        default: 'arcade',
        arcade: {
            gravity: {
                y: 1000
            },
            debug: true
        }
    }
})
