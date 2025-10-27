<?php
// File: twig-app/src/Controller/HomeController.php

class HomeController {
    private $twig;

    public function __construct($twig) {
        $this->twig = $twig;
    }

    public function index() {
        echo $this->twig->render('pages/landing.html.twig', [
            'pageTitle' => 'Triket - Ticket Management System'
        ]);
    }
}