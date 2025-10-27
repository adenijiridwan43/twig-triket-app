<?php
// File: twig-app/src/Controller/AuthController.php

class AuthController {
    private $twig;

    public function __construct($twig) {
        $this->twig = $twig;
    }

    public function showLogin() {
        // No server-side auth check - handled by JavaScript
        echo $this->twig->render('pages/login.html.twig', [
            'pageTitle' => 'Login - Triket'
        ]);
    }

    public function processLogin() {
        // Auth is handled client-side with JavaScript
        // This route shouldn't be called, but if it is, just show login page
        $this->showLogin();
    }

    public function showSignup() {
        // No server-side auth check - handled by JavaScript
        echo $this->twig->render('pages/signup.html.twig', [
            'pageTitle' => 'Sign Up - Triket'
        ]);
    }

    public function processSignup() {
        // Auth is handled client-side with JavaScript
        // This route shouldn't be called, but if it is, just show signup page
        $this->showSignup();
    }

    public function logout() {
        // Clear PHP session (if any)
        session_destroy();
        
        // Redirect to home
        header('Location: /');
        exit;
    }
}