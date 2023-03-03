import Phaser from '../lib/phaser.js'

export default class Menu extends Phaser.Scene {
  constructor() {
    super('menu');
  }

  init() { }

  preload() {
    //carregando o sprite de plano de fundo e da seta de voltar
    this.load.image('background', './src/assets/img/galaxy.png');
    this.load.image('go_back_arrow', './src/assets/img/go_back_arrow_icon.png');
  }

  create() {
    // pegando as dimensões da cena
    const { width, height } = this.scale;
    const textStyle = { color: '#fff', fontSize: 16 };
    const textStyle2 = { color: '#fff', fontSize: 18 };

    // adicionando o plano de fundo
    this.add.image(width / 2, height / 2, 'background');


    // adicionando a seta para voltar para o inicio
    const back = this.add.image(70, 70, 'go_back_arrow').setScale(0.4).setInteractive();
    this.add.text(120, 60, 'Voltar', textStyle)
    back.on('pointerover', () => {
      back.setScale(0.5)
      this.sys.canvas.style.cursor = 'pointer';
    });
    back.on('pointerout', () => {
      back.setScale(0.4)
      this.sys.canvas.style.cursor = 'auto';
    });
    back.on('pointerdown', () => { this.scene.stop(), this.scene.start('start') });


    // adicionando as instruções básicas
    this.add.text(40, 160, 'Ship control:', textStyle)
    this.add.text(50, 200, '<-   : Move left', textStyle)
    this.add.text(50, 240, '->   : Move right', textStyle)
    this.add.text(50, 280, '/\\   : Move up', textStyle)
    this.add.text(50, 320, '\\/   : Move down', textStyle)
    this.add.text(50, 360, 'SPACE: Shoot', textStyle)
    this.add.text(50, 390, 'ESC  : Pause game', textStyle)
    this.add.text(50, 420, 'SHIFT: Resume game', textStyle)

    this.add.text(40, 500, '# Dodge the enemies and', textStyle2)
    this.add.text(40, 530, 'hit them to earn points.', textStyle2)
    this.add.text(40, 560, '# Collect the coins.', textStyle2)
  }

  update() {}
}
