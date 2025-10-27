<?php
// File: twig-app/src/Controller/DashboardController.php

class DashboardController {
    private $twig;

    public function __construct($twig) {
        $this->twig = $twig;
    }

    public function index() {
        // Check if user is authenticated (via JS localStorage check on frontend)
        // Since we're using client-side auth, we'll let JS handle redirects
        
        echo $this->twig->render('pages/dashboard.html.twig', [
            'pageTitle' => 'Dashboard - Triket'
        ]);
    }
}