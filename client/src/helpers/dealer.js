import Card from './card';

export default class Dealer {
    constructor(scene) {
        this.dealCards = (shuffledDeck) => {
            let playerSprite;
            let opponentSprite;
            if (scene.isPlayerA) {
                playerSprite = 'cyanCardFront';
                opponentSprite = 'magentaCardBack';
            } else {
                playerSprite = 'magentaCardFront';
                opponentSprite = 'cyanCardBack';
            };
            for (let i = 1; i < 6; i++) {
                let playerCard = new Card(scene);
                if (scene.isPlayerA){
                    playerCard.render(475 + ((i-1) * 100), 650, playerSprite,shuffledDeck[shuffledDeck.length-i].power);
                }else{
                    playerCard.render(475 + ((i-1) * 100), 650, playerSprite,shuffledDeck[shuffledDeck.length-(i+5)].power);
                }
                shuffledDeck.splice(-1);
                let opponentCard = new Card(scene);
                scene.opponentCards.push(opponentCard.render(475 + ((i-1) * 100), 125, opponentSprite).disableInteractive());
                shuffledDeck.splice(-1);
            }
            scene.remaining.setText("Remaining Cards: "+ shuffledDeck.length);
            
        }
    }
}