import Phaser from './lib/phaser.js'

import Start from './scenes/Start'
import Menu from './scenes/Menu'
import Game from './scenes/Game'
import Pause from './scenes/Pause'
import GameOver from './scenes/GameOver.js'

export default new Phaser.Game({
    type: Phaser.AUTO,
    width: 800,
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
