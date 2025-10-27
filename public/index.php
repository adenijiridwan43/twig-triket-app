<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// File: twig-app/public/index.php

require_once __DIR__ . '/../vendor/autoload.php';
require_once __DIR__ . '/../src/Router.php';
require_once __DIR__ . '/../src/Controller/HomeController.php';
require_once __DIR__ . '/../src/Controller/AuthController.php';
require_once __DIR__ . '/../src/Controller/DashboardController.php';
require_once __DIR__ . '/../src/Controller/TicketsController.php';

// Start session for authentication
session_start();

// Initialize Twig
$loader = new \Twig\Loader\FilesystemLoader(__DIR__ . '/../templates');
$twig = new \Twig\Environment($loader, [
    'cache' => false, // Disable cache for development
    'debug' => true,
]);

// Add global variables accessible in all templates
$twig->addGlobal('isAuthenticated', isset($_SESSION['user']));
$twig->addGlobal('user', $_SESSION['user'] ?? null);
$twig->addGlobal('currentPath', parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH));

// Initialize Router
$router = new Router($twig);

// Define Routes
// Public routes
$router->get('/', 'HomeController', 'index');
$router->get('/auth/login', 'AuthController', 'showLogin');
$router->get('/auth/signup', 'AuthController', 'showSignup');
$router->get('/auth/logout', 'AuthController', 'logout');

// Protected routes (auth checked by JavaScript)
$router->get('/dashboard', 'DashboardController', 'index');
$router->get('/tickets', 'TicketsController', 'index');

// Dispatch the request
$router->dispatch();