<?php
// File: twig-app/src/Router.php

class Router {
    private $routes = [];
    private $twig;

    public function __construct($twig) {
        $this->twig = $twig;
    }

    public function get($path, $controller, $method) {
        $this->routes['GET'][$path] = ['controller' => $controller, 'method' => $method];
    }

    public function post($path, $controller, $method) {
        $this->routes['POST'][$path] = ['controller' => $controller, 'method' => $method];
    }

    public function dispatch() {
        $requestMethod = $_SERVER['REQUEST_METHOD'];
        $requestUri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
        
        // Remove trailing slash except for root
        if ($requestUri !== '/' && substr($requestUri, -1) === '/') {
            $requestUri = rtrim($requestUri, '/');
        }

        // Check if route exists
        if (isset($this->routes[$requestMethod][$requestUri])) {
            $route = $this->routes[$requestMethod][$requestUri];
            $controller = new $route['controller']($this->twig);
            $method = $route['method'];
            return $controller->$method();
        }

        // 404 Not Found
        http_response_code(404);
        echo $this->twig->render('pages/404.html.twig', [
            'pageTitle' => '404 - Page Not Found'
        ]);
    }

    public function redirect($path) {
        header("Location: $path");
        exit;
    }
}