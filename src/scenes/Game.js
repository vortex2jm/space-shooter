import Phaser from '../lib/phaser.js'

export default class Game extends Phaser.Scene{
    constructor(){
        super('game');
    }

    init(){
        this.lifes = 3;
        this.score = 0;
        this.backgroundVelocity = 0;
        this.shipWidth = 72;
        this.shipHeight = 72;
        this.lastFired = 0;
        this.shotCooldown = 500;
        this.lastSpawned = 1000;
        this.lastCoinSpawned = 2000;
        this.spawnCooldown = 2000;
        this.spawnCoinCooldown = 5000;
        this.shotPosition = this.shipWidth/4;
        this.alienGroup = this.physics.add.group();
        this.laserShotGroup = this.physics.add.group();
        this.coinGroup = this.physics.add.group();
    }
    
    preload(){
        // carregando as imagens
        this.load.image('background', './src/assets/img/galaxy.png');
        this.load.image('ship', './src/assets/img/spacecraft.png');
        this.load.image('laserShotImg', './src/assets/img/lasershot.png');
        this.load.image('coin', './src/assets/img/coin.png');

        // carregando os spritesheets dos inimigos
        this.load.spritesheet('alien1', 
            './src/assets/img/alien1.png',
            { frameWidth: 400, frameHeight: 400 }
        );
        this.load.spritesheet('alien1-dead', 
            './src/assets/img/alien1-dead.png',
            { frameWidth: 400, frameHeight: 400 }
        );

        // carregando os audios
        this.load.audio('collectCoinMusic', './src/assets/audio/collect-coin.mp3');
        this.load.audio('gameMusic', './src/assets/audio/game-music.mp3');
        this.load.audio('gameStartMusic', './src/assets/audio/game-start-sound.mp3');
        this.load.audio('gameOverMusic', './src/assets/audio/game-over-sound.mp3');
        this.load.audio('laserShot', './src/assets/audio/laser-shot.mp3');
        this.load.audio('spaceSound', './src/assets/audio/thriller-space-sound.mp3');
        this.load.audio('impact', './src/assets/audio/impact.wav');
        
        // criando as teclas
        this.keys = this.input.keyboard.createCursorKeys();
        this.escKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);
    }
    
    create(){
        const {width, height} = this.scale;
        // console.log(width, height);

        this.gameStartMusic = this.sound.add('gameStartMusic', {loop: false});
        this.gameMusic = this.sound.add('gameMusic', {loop: true});
        this.gameOverMusic = this.sound.add('gameOverMusic', {loop: false});
        this.impactSound = this.sound.add('impact', {loop:false, volume: 0.4})
        this.coinSound = this.sound.add('collectCoinMusic', {loop:false, volume: 0.4})

        // toca a musica de inicio do jogo, e quando terminar, toca a musica do jogo, em loop
        this.gameStartMusic.play();
        this.gameMusic.play();

        // adicionando o background
        this.background = this.add.tileSprite(width/2, height/2, width, height, 'background');

        // adicionando a nave e setando sua posição e tamanho
        this.ship = this.physics.add.sprite(width/2, height-50, 'ship');
        this.ship.setScale(0.1);


        // adicionando o texto de vidas
        this.lifesText = this.add.text(10, 10, `HP: ${this.lifes}`, {
            fontSize: 20,
            color: '#fff'
        });

        // adicionando o texto de pontuação
        this.scoreText = this.add.text(10, 40, `Points: ${this.score}`, {
            fontSize: 20,
            color: '#fff'
        });

        // adicionando as animações dos inimigos
        this.anims.create({
            key: 'alien1',
            frames: this.anims.generateFrameNumbers('alien1', { start: 0, end: 28 }),
            frameRate: 40,
            repeat: -1
        });
        this.anims.create({
            key: 'alien1-dead',
            frames: this.anims.generateFrameNumbers('alien1-dead', { start: 0, end: 27 }),
            frameRate: 40,
            repeat: -1
        });
    }
    
    update(){
        this.background.tilePositionY = this.backgroundVelocity;
        // movimentação da nave
        this.move()

        //pausando o jogo
        if(this.escKey.isDown){
            this.scene.pause();
            this.scene.launch('pause', {gameMusic: this.gameMusic});
            this.gameMusic.pause();
        }

        // disparo do tiro
        if(this.keys.space.isDown){
            if(this.time.now > this.lastFired){
                this.shot();
                this.lastFired = this.time.now + this.shotCooldown;
            }
        }

        // adicionando os inimigos
        if(this.time.now > this.lastSpawned){
            this.createEnemy();
            this.lastSpawned = this.time.now + this.spawnCooldown;
        }

        // adicionando as moedas
        if(this.time.now > this.lastCoinSpawned){
            this.createCoin();
            this.lastCoinSpawned = this.time.now + this.spawnCoinCooldown;
        }

        // colisão da nave com o inimigo
        this.physics.add.overlap(this.ship, this.alienGroup, this.hitShip, null, this);

        // colisão do tiro com o inimigo
        this.physics.add.overlap(this.laserShotGroup, this.alienGroup, this.hitAlien, null, this);

        // colisão da nave com a moeda
        this.physics.add.overlap(this.ship, this.coinGroup, this.collectCoin, null, this);

        // Atualizando a posição do background (efeito de movimento)
        this.updateBackgroundVelocity();
    }

    move(){
        if(this.keys.left.isDown && this.ship.x > this.shipWidth/2){
            this.ship.setVelocityX(-200);
        }else if(this.keys.right.isDown && this.ship.x < this.scale.width - this.shipWidth/2){
            this.ship.setVelocityX(200);
        }else{
            this.ship.setVelocityX(0);
        }

        if(this.keys.up.isDown && this.ship.y > this.shipHeight/2){
            this.ship.setVelocityY(-200);
        }else if(this.keys.down.isDown && this.ship.y < this.scale.height - this.shipHeight/2){
            this.ship.setVelocityY(200);
        }else{
            this.ship.setVelocityY(0);
        }
    }


    shot(){
        this.laserShot = this.sound.add('laserShot', {loop: false, volume: 0.1});
        this.laserShot.play();

        this.laserShotGroup.create(this.ship.x + this.shotPosition, this.ship.y-10, 'laserShotImg')
        this.laserShotGroup.children.iterate((child) =>{
            child.setScale(0.03);
            child.setVelocityY(-800);
        })

        // inverte a posição do tiro
        this.shotPosition = this.shotPosition * -1;

        // removendo os tiros que estão fora da tela
        this.laserShotGroup.children.iterate((child)=>{
            if (child && child.body.y<-this.scale.height) child.destroy()
        })
    }

    createEnemy(){
        this.alienGroup.create(Phaser.Math.Between(0.05*this.scale.width, 0.95*this.scale.width), -40, 'alien1');
        this.alienGroup.children.iterate((child) => {
            child.setScale(0.1);
            child.play('alien1');
            child.setVelocityY(100);
        });

        // removendo os inimigos que passaram para fora da tela e não foram mortos
        this.alienGroup.children.iterate((child)=>{
            if (child && child.body.y>this.scale.height) child.destroy()
        })
    }

    createCoin(){
        this.coinGroup.create(Phaser.Math.Between(0.05*this.scale.width, 0.95*this.scale.width), -40, 'coin');
        this.coinGroup.children.iterate((child) => {
            child.setScale(0.01);
            child.setVelocityY(300);
        });

        // removendo as moedas que passaram para fora da tela e não foram coletadas
        this.coinGroup.children.iterate((child)=>{
            if (child && child.body.y>this.scale.height) child.destroy()
        })
    }

    hitShip(ship, alien){
        this.alienGroup.killAndHide(alien);
        this.alienGroup.remove(alien);
        alien.destroy();
        this.lifes--;
        this.lifesText.setText(`Vidas: ${this.lifes}`);
        this.ship.setTint(0xff0000);
        this.time.addEvent({
            delay: 100,
            callback: () => {
                this.ship.clearTint();
            },
            loop: false
        });
        if(this.lifes <= 0){
            this.gameOver();
        }
    }

    hitAlien(lasershot, alien){
        this.laserShotGroup.killAndHide(lasershot);
        this.laserShotGroup.remove(lasershot);
        lasershot.destroy();
        alien.play('alien1-dead');
        alien.setVelocityY(0);
        this.time.addEvent({
            delay: 500,
            callback: () => {
                this.alienGroup.killAndHide(alien);
                this.alienGroup.remove(alien);
            },
            loop: false
        });
        this.score+=10;
        this.scoreText.setText(`Pontos: ${this.score}`);
        this.impactSound.play();
    }

    collectCoin(ship, coin){
        this.coinGroup.killAndHide(coin);
        this.coinGroup.remove(coin);
        coin.destroy();
        this.score+=100;
        this.scoreText.setText(`Pontos: ${this.score}`);
        this.coinSound.play();
    }

    updateBackgroundVelocity(){
        // Evitar overflow
        if(this.backgroundVelocity === -1000000)
            this.backgroundVelocity = 0;
        this.backgroundVelocity -= 3;
    }

    gameOver(){
        this.gameMusic.stop();
        this.gameOverMusic.play();
        this.scene.stop();
        this.scene.start('gameover', {score:this.score});
    }
}
