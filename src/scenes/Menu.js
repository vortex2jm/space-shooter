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
    const textStyle = { color: '#fff', fontSize: 23 };

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
    this.add.text(40, 200, 'Controlar a nave:', textStyle)
    this.add.text(50, 240, '<-  Move a nave para a esquerda', { fontSize: 16, color: "#fff" })
    this.add.text(50, 280, '->  Move a nave para a direita', { fontSize: 16, color: "#fff" })
    this.add.text(50, 320, '/\\  Move a nave para cima', { fontSize: 16, color: "#fff" })
    this.add.text(50, 360, '\\/  Move a nave para baixo', { fontSize: 16, color: "#fff" })

    this.add.text(40, 500, 'Desvie dos inimigos', textStyle)
    this.add.text(40, 540, 'Colete as moedas', textStyle)

  }

  update() {

  }
}
