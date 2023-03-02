import Phaser from '../lib/phaser.js'

export default class Start extends Phaser.Scene{
    constructor(){
        super('start');
    }

    init() {};

    preload() {
        //carregando os sprites de plano de fundo e da nave
        this.load.image('background','./src/assets/img/galaxy.jpg');
        this.load.image('spacecraft','./src/assets/img/spacecraft.png');

        //carregando o sprite do icone de menu
        this.load.image('menu', './src/assets/img/menu_icon.png')

        //carregando a musica de fundo
        this.load.audio('music', './src/assets/audio/start-music.mp3');
    }
    
    create() {
        // pegando as dimensões da cena
        const {width, height} = this.scale; 
        const textStyle = { color: '#fff',fontSize: 23 };

        // adicionando o plano de fundo
        this.add.image(width/2, height/2, 'background');

        // tocando musica
        this.music = this.sound.add('music', {loop: true, volume: 0.1});
        this.music.play()

        this.add.text(50, 50, 'Press SPACE to start', textStyle);

        // criando a nave
        let spacecraft = this.add.sprite(width/2, 300, 'spacecraft').setScale(0.3);
    
        // adicionando animação de "idle", na nave
        this.tweens.add({
            targets: spacecraft,
            duration: 1000,
            repeat: -1,
            yoyo: true,
            angle: { from: -5, to: 5 },
            ease: function (t, b, c, d) {
                return Phaser.Math.Easing.Back.InOut(t, b, c, d, 2.5);
            },
        });

        // adicionando a funcionalidade de apertar a barra de espaço
        // para mudar de cena
        this.input.keyboard.once('keydown-SPACE', () => {
            this.scene.start('game');
            this.game.sound.stopAll();
        })

        // adicionando botao para tela de instruções
        const menu = this.add.image(70,540,'menu').setScale(0.4).setInteractive();
        this.add.text(130,530, 'Como jogar', textStyle)

        // adicionando interação quando o mouse passa por cima
        menu.on('pointerover', () => {
            menu.setScale(0.5)
            this.sys.canvas.style.cursor = 'pointer';
        });

        // adicionando interação quando o mouse sai de cima
        menu.on('pointerout', () => {
            menu.setScale(0.4)
            this.sys.canvas.style.cursor = 'auto';
        });

        // adicionando interação quando o mouse clica
        menu.on('pointerdown', () => {
            this.scene.stop(),
            this.scene.start('menu')
        });
    }
    
    update() {

    }
}
