import Phaser from '../lib/phaser.js'

export default class GameOver extends Phaser.Scene{
    constructor() {
        super('gameover');
    }

    init(data) {
        /* pegando dados de outra cena */
        this.scoreFinal = data.score;
    }

    preload() {
        /* carregando as imagens */
        this.load.image('background', './src/assets/img/galaxy.png');
        this.load.image('gameOver', './src/assets/img/gameOver.png');
        this.load.image('home', './src/assets/img/home.png');
        this.load.image('restart', './src/assets/img/restart.png');

        /* carregando o áudio */
        this.load.audio('gameOverSound', './src/assets/audio/game-over-sound.mp3');
    }
    
    create() {
        /* adicionando áudio */
        this.gameOverAudio = this.sound.add('gameOverSound', {loop: false, volume: 0.1});
        this.gameOverAudio.play();

        /* dados padrões */
        const {width , height} = this.scale;
        const style = { color: '#ffffff', fontSize: 24 };

        /* adicionando imagem de fundo e de game over */
        this.add.image(width/2, height/2, 'background');
        this.add.image(width/2, 150, 'gameOver').setScale(0.5);

        /* adicionando texto */
        this.add.text(width/2, 350,`Your score was: ${this.scoreFinal}`, style).setOrigin(0.5);
        
        /* adicionando butões e suas ações */
        const restart = this.add.image(100,490,'restart').setScale(0.4).setInteractive();
        const home = this.add.image(300,490,'home').setScale(0.4).setInteractive();

        /* ações do botão home */
        home.on('pointerover', () => {home.setScale(0.22)});
        home.on('pointerout', () => {home.setScale(0.4)});
        home.on('pointerdown', () => {
            this.scene.stop('game');
            this.scene.stop('pause');
            this.scene.start('start');
            this.game.sound.stopAll();
        });

        /* ações do botão de restart */
        restart.on('pointerover', () => {restart.setScale(0.22);})
        restart.on('pointerout', () => {restart.setScale(0.4);})
        restart.on('pointerdown', () => {
            this.scene.stop('game');
            this.scene.stop('pause');
            this.scene.start('game');
            this.game.sound.stopAll();
        })
    }
    
    update() {}
}
