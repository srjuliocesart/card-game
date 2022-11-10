export default class Card {
    constructor(scene) {
        this.render = (x, y, sprite, attackForce) => {
            let card = scene.add.image(x, y, sprite).setScale(0.3, 0.3).setInteractive();
            card.attackForce = attackForce;
            scene.input.setDraggable(card);
            return card;
        }
    }
}