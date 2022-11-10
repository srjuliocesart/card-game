<?php

namespace Controller;

use Model\Cards;

class CardsController {

    public function shuffleNewDeck()
    {
        $cardsModel = new Cards();
        $arrayCards = $cardsModel->listAll();
        shuffle($arrayCards);
        return $arrayCards;
    }
}