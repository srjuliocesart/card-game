import io from 'socket.io-client';

import Card from '../helpers/card';
import Dealer from '../helpers/dealer';
import Zone from '../helpers/zone';

export default class Game extends Phaser.Scene {
    constructor() {
        super({
            key: 'Game'
        });
    }

    preload() {
        this.load.image('cyanCardFront', 'src/assets/CyanCardFront.png');
        this.load.image('cyanCardBack', 'src/assets/CyanCardBack.png');
        this.load.image('magentaCardFront', 'src/assets/MagentaCardFront.png');
        this.load.image('magentaCardBack', 'src/assets/MagentaCardBack.png');
    }

    create() {
        this.isPlayerA = false;
        this.opponentCards = [];
        this.playerCards = [];

        this.remaining = this.add.text(75, 400, ['Remaining Cards: 52']).setFontSize(18).setFontFamily('Trebuchet MS').setColor('#00ffff');
        this.dealText = this.add.text(75, 350, ['DEAL CARDS']).setFontSize(18).setFontFamily('Trebuchet MS').setColor('#00ffff').setInteractive();

        let self = this;

        this.zone = new Zone(this);
        this.dropZone = this.zone.renderZone();
        this.outline = this.zone.renderOutline(this.dropZone);
		
        this.dealer = new Dealer(this);
        
		this.dealText.on('pointerdown', () => {
            self.socket.emit("dealCards");
            // debugger;
        })

        this.dealText.on('pointerover', function () {
            self.dealText.setColor('#ff69b4');
        })

        this.dealText.on('pointerout', function () {
            self.dealText.setColor('#00ffff');
        })

        this.input.on('drag', function (pointer, gameObject, dragX, dragY) {
            gameObject.x = dragX;
            gameObject.y = dragY;
        })

        this.input.on('dragstart', function (pointer, gameObject) {
            console.log(gameObject.attackForce);
            gameObject.setTint(0xff69b4);
            self.children.bringToTop(gameObject);
        })

        this.input.on('dragend', function (pointer, gameObject, dropped) {
            gameObject.setTint();
            // debugger;
            if(dropped && self.dropZone.data.values.lastAttack > gameObject.attackForce){
                dropped = false;
            }
            
            if (!dropped) {
                gameObject.x = gameObject.input.dragStartX;
                gameObject.y = gameObject.input.dragStartY;
            }
        })

        this.input.on('drop', function (pointer, gameObject, dropZone) {
            if( dropZone.data.values.lastAttack == 0 || 
                dropZone.data.values.lastAttack < gameObject.attackForce)
            {
                dropZone.data.values.lastAttack = gameObject.attackForce;
                dropZone.data.values.cards++;
                gameObject.x = (dropZone.x - 350) + (dropZone.data.values.cards * 50);
                gameObject.y = dropZone.y;
                gameObject.disableInteractive();
                //emmition to server that a card was played
                self.socket.emit('cardPlayed', gameObject, self.isPlayerA, dropZone.data.values.lastAttack);
            }
        })

        // commands from server.js
        this.socket = io('http://localhost:3000');

        this.socket.on('connect', function () {
        	console.log('Connected!');
        });

        this.socket.on('isPlayerA', function () {
        	self.isPlayerA = true;
        })

        this.socket.on('dealCards', function (shuffledDeck) {
            // console.log(self.opponentCards);
            self.dealer.dealCards(shuffledDeck);
            self.dealText.disableInteractive();
        })

        this.socket.on('cardPlayed', function (gameObject, isPlayerA, lastAttack) {
            if (isPlayerA !== self.isPlayerA) {
                let sprite = gameObject.textureKey;
                self.opponentCards.shift().destroy();
                self.dropZone.data.values.cards++;
                self.dropZone.data.values.lastAttack = lastAttack;
                let card = new Card(self);
                card.render(((self.dropZone.x - 350) + (self.dropZone.data.values.cards * 50)), (self.dropZone.y), sprite, gameObject.attackForce).disableInteractive();
            }
            // console.log(self.dropZone.data.values);
        })
    }
    
    update() {
        // this.socket = io('http://localhost:3000');

        // this.socket.on('dealCards', function (shuffledDeck) {
        //     updateRemainingCards(this);
        // });
    }
}