<?php
// File: twig-app/src/Controller/TicketsController.php

class TicketsController {
    private $twig;

    public function __construct($twig) {
        $this->twig = $twig;
    }

    public function index() {
        echo $this->twig->render('pages/tickets.html.twig', [
            'pageTitle' => 'Tickets - Triket'
        ]);
    }
}