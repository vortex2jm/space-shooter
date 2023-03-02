import Phaser from '../lib/phaser.js'

export default class Pause extends Phaser.Scene{
    constructor() {
        super('pause');
    }

    init() {}

    preload() {
        /* carregando as imagens */
        this.load.image('background', './src/assets/img/galaxy.png');
        this.load.image('home', './src/assets/img/home.png');
        this.load.image('restart', './src/assets/img/restart.png');
        this.load.image('resume', './src/assets/img/resume.png');

        /* carregando o áudio */
        this.load.audio('pauseSound', './src/assets/audio/pause-music.mp3');

        /* criando o objeto do teclado */
        this.keys = this.input.keyboard.createCursorKeys();
    }
    
    create() {
        /* adicionando áudio */
        this.gameOverAudio = this.sound.add('pauseSound', {loop: false, volume: 0.1});
        this.gameOverAudio.play();

        /* dados padrões */
        const {width, height} = this.scale;

        /* adicionando imagem de fundo */
        this.add.image(width/2, height/2, 'background');

        /* criando os butões e suas ações */
        const playPauseButton = this.add.image(width/2, height/3,'resume').setScale(0.5).setInteractive();
        playPauseButton.on('pointerover', ()=> {playPauseButton.setScale(0.22)});
        playPauseButton.on('pointerout', ()=> {playPauseButton.setScale(0.5)});
        playPauseButton.on('pointerdown', ()=> {
            this.scene.resume('game');
            this.scene.stop();
        })

        const home = this.add.image(300,410, 'home').setScale(0.4).setInteractive();
        home.on('pointerover', ()=> {home.setScale(0.22)});
        home.on('pointerout', ()=> {home.setScale(0.4)});
        home.on('pointerdown', ()=> {
            this.scene.stop('game');
            this.scene.stop('pause');
            this.scene.start('start');
            this.game.sound.stopAll();
        })

        const restart = this.add.image(100, 410, 'restart').setScale(0.4).setInteractive();
        restart.on('pointerover', ()=> {restart.setScale(0.22)});
        restart.on('pointerout', ()=> {restart.setScale(0.4)});
        restart.on('pointerdown', ()=> {
            this.scene.stop('game');
            this.scene.stop('pause');
            this.scene.start('game');
            this.game.sound.stopAll();
        })
    }
    
    update(){
        /* criando a ação para a tecla shift */
        const kShift = this.keys.shift.isDown;

        if(kShift) {
            this.scene.resume('game');
            this.scene.stop();
        }
    }
}
