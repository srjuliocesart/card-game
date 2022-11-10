<?php
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use Slim\Factory\AppFactory;
use Controller\CardsController;

require __DIR__ . '/../vendor/autoload.php';

$app = AppFactory::create();

$app->get('/deck-card', function (Request $request, Response $response, $args) {
    
    $cardsController = new CardsController();
    $deckShuffled = $cardsController->shuffleNewDeck();
    $json = json_encode($deckShuffled);
    $response->getBody()->write($json);
    // echo "<pre>";
    // var_dump($deckShuffled);die;

    // if ($pdo != null)
        // $response->getBody()->write("Connected to the SQLite database successfully!");
    // else
        // $response->getBody()->write("Whoops, could not connect to the SQLite database!");
    return $response->withHeader('Content-Type', 'application/json');
});

$app->run();