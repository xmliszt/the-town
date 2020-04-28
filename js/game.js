var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    physics: {
        default: 'arcade',
        arcade: {
            gravity: {y:300},
            debug: false
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
}

var game = new Phaser.Game(config);
var scene;
var name;

function preload(){

    scene = game.scene.scenes[0];
    this.load.image('grassland', './assets/bg-grassland.jpg');
    this.load.image('ground', './assets/ground.png');
    this.load.image('star', './assets/star.png');
    this.load.spritesheet('walk', './assets/sprite-walk.png', { frameWidth: 85, frameHeight: 88});
    this.load.spritesheet('front', './assets/sprite-front.png', { frameWidth: 85, frameHeight: 88});
    this.load.image('back', './assets/sprite-back.png');
    this.load.image('stop', './assets/sprite-stop.png');
    this.load.image('bomb', './assets/bomb.png');
    this.load.spritesheet('heart', './assets/heart.png', { frameWidth: 866, frameHeight: 650});
    this.load.spritesheet('start', './assets/button-sprite.png', { frameWidth: 152, frameHeight: 60});
    this.load.audio('bgm', ['./audio/bgm.mp3', './audio/bgm.ogg']);
    this.load.audio('coin', ['./audio/coin.mp3', './audio/coin.ogg']);
    this.load.audio('bomb', ['./audio/bomb.mp3', './audio/bomb.ogg']);
    this.load.audio('jump', ['./audio/jump.mp3', './audio/jump.ogg']);
}

var music;
var starS;
var bombS;
var jumpS;


var background;
var platforms;
var player;
var cursors;
var stars;
var heart;
var score = 0;
var scoreText;
var bombs;
var startButton;
var gameOverText;

function recreate() {    
    
    if (!cursors.left.enabled) cursors.left.enabled = true;
    if (!cursors.right.enabled) cursors.right.enabled = true; 
    cursors.left.isDown = false;
    cursors.right.isDown = false;

    if (player != undefined) player.destroy();
    if (stars != undefined){
        stars.children.each((child)=>{
            child.destroy();
        });
        stars.clear(true);
    };
    if (bombs != undefined){
        bombs.children.each((child)=>{
            child.destroy();
        });
        bombs.clear(true);
    };
    if (heart != undefined) heart.destroy();
    if (gameOverText != undefined) gameOverText.destroy();

    background.setTint(0xffffff);

    // player
    player = scene.physics.add.sprite(88, 450, 'walk').setSize(30, 55, false).setOffset(30, 22);
    player.setBounce(0.2);
    player.setCollideWorldBounds(true);
    player.body.setGravityY(400);
    scene.physics.add.collider(player, platforms);

    // stars
    stars = scene.physics.add.group({
        key: 'star',
        repeat: 9,
        setXY: { x: 30, y: 0, stepX: 80}
    });

    stars.children.iterate(function (child) {
        child.setScale(0.1, 0.1).setSize(300, 300);
        child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
    });

    scene.physics.add.collider(stars, platforms);
    scene.physics.add.overlap(player, stars, collectStar, null, scene);

    // bombs
    bombs = scene.physics.add.group();
    scene.physics.add.collider(bombs, platforms);
    scene.physics.add.collider(player, bombs, hitBomb, null, scene);

    // heart
    heart = scene.physics.add.sprite(100, 500, 'heart').setScale(0.08,0.08).setSize(280, 280);
    scene.physics.add.collider(heart, platforms);
    scene.physics.add.collider(player, heart);
    heart.setBounce(1);
    heart.setCollideWorldBounds(true);
    heart.setVelocity(Phaser.Math.Between(-50, 50), 5);
    scene.physics.add.overlap(heart, stars, collectStar, null, scene);

    score = 0;
    scoreText.setText('Score: ' + score);
    scene.physics.resume();
}

function create(){
    this.physics.pause();

    // startButton
    startButton = this.add.sprite(400, 300, 'start').setInteractive();
    startButton.setDepth(2);
    startButton.on('pointerover',function(){startButton.setFrame(1)}, this);
    startButton.on('pointerout',function(){startButton.setFrame(0)}, this);
    startButton.on('pointerdown',function(){   
        recreate(this);
        startButton.setVisible(false);
        startButton.disableInteractive();
    }, this);

    // bgm
    music = this.sound.add('bgm');
    music.loop = true;
    music.play();

    // other sound
    jumpS = this.sound.add('jump');
    bombS = this.sound.add('bomb');
    starS = this.sound.add('coin');

    // colliders
    background = this.add.image(400, 300, 'grassland');
    platforms = this.physics.add.staticGroup(); // static won't be affected by gravity. Cannot move!
    platforms.create(400,600, 'ground').setScale(1).refreshBody().setSize(871, 130, false).setOffset(0, 30);
    platforms.create(600, 380, 'ground').setScale(0.5).refreshBody().setSize(435, 80, false).setOffset(0, 15);
    platforms.create(50, 250, 'ground').setScale(0.3).refreshBody().setSize(261.3, 50, false).setOffset(0, 9);
    platforms.create(400, 120, 'ground').setScale(0.5, 0.2).refreshBody().setSize(435, 30, false).setOffset(0, 6);

    // player
    player = this.physics.add.sprite(88, 450, 'walk').setSize(30, 55, false).setOffset(30, 22);
    player.setBounce(0.2);
    player.setCollideWorldBounds(true);
    player.body.setGravityY(400);

    this.physics.add.collider(player, platforms);

    this.anims.create({
        key: 'left',
        frames: this.anims.generateFrameNumbers('walk', {start: 0, end: 1}),
        frameRate: 10,
        repeat: -1
    });

    this.anims.create({
        key: 'still',
        frames: [{ key: 'front', frame: 3}],
        frameRate: 10,
        repeat: 0
    });

    this.anims.create({
        key: 'right',
        frames: this.anims.generateFrameNumbers('walk', {start: 2, end: 3}),
        frameRate: 10,
        repeat: -1
    });

    // stars
    stars = this.physics.add.group({
        key: 'star',
        repeat: 9,
        setXY: { x: 30, y: 0, stepX: 80}
    });

    stars.children.iterate(function (child) {
        child.setScale(0.1, 0.1).setSize(300, 300);
        child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
    });

    this.physics.add.collider(stars, platforms);
    this.physics.add.overlap(player, stars, collectStar, null, this);

    // bombs
    bombs = this.physics.add.group();
    this.physics.add.collider(bombs, platforms);
    this.physics.add.collider(player, bombs, hitBomb, null, this);

    // heart
    heart = this.physics.add.sprite(100, 500, 'heart').setScale(0.08,0.08).setSize(280, 280);
    this.physics.add.collider(heart, platforms);
    this.physics.add.collider(player, heart);
    heart.setBounce(1);
    heart.setCollideWorldBounds(true);
    heart.setVelocity(Phaser.Math.Between(-50, 50), 5);
    this.physics.add.overlap(heart, stars, collectStar, null, this);

    // score
    scoreText = this.add.text(16, 16, 'score: 0', { fontSize: '32px', fill: '#000'});

    // cursors
    cursors = this.input.keyboard.createCursorKeys();
}

function update(){
    if (cursors.left.isDown)
    {
        player.setVelocityX(-300);

        player.anims.play('left', true);
    }
    else if (cursors.right.isDown)
    {
        player.setVelocityX(300);

        player.anims.play('right', true);
    }
    else
    {
        player.setVelocityX(0);

        player.anims.play('still');
    }

    if ((cursors.up.isDown || cursors.space.isDown) && player.body.touching.down)
    {
        jumpS.play();
        player.setVelocityY(-500);
    }
}

function collectStar(player, star){
    starS.play();
    star.disableBody(true, true);
    if(player.texture.key == "heart") score += 20;
    else score += 10;
    scoreText.setText('Score: ' + score);

    if (stars.countActive(true) === 0){
        stars.children.iterate((child)=>{
            child.enableBody(true, child.x, 0, true, true);
        });

        var x = (player.x < 400) ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400);

        var bomb = bombs.create(x, 0, 'bomb').setScale(0.1, 0.1).setSize(10, 10, true);
        bomb.setBounce(1);
        bomb.setCollideWorldBounds(true);
        bomb.setVelocity(Phaser.Math.Between(-300, 300), 40);
    }   
}

function hitBomb(player, bomb){
    gameOverText = this.add.text(400, 300, 'GAME OVER', { fontSize: '64px', fill: '#fff'});
    gameOverText.setDepth(1);
    cursors.left.enabled = false;
    cursors.right.enabled = false;
    background.setTint(0x555555);
    bombS.play();
    this.physics.pause();
    startButton.setVisible(true);
    startButton.setInteractive();
    player.anims.play('still');
    player.setTint(0xff0000);

    
    
    // send data over to firebase to store
    window.localStorage.setItem("player-score", score);

    var element = parent.document.getElementById("ranking");
    var event; // The custom event that will be created
    if(document.createEvent){
        event = document.createEvent("HTMLEvents");
        event.initEvent("uploaded", true, true);
        event.eventName = "uploaded";
        element.dispatchEvent(event);
    } else {
        event = document.createEventObject();
        event.eventName = "uploaded";
        event.eventType = "uploaded";
        element.fireEvent("on" + event.eventType, event);
    }
}

