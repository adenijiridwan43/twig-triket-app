// File: twig-app/public/js/auth.js
// Global authentication check and session restoration

(function() {
    // Restore session on page load
    if (window.ticketStore) {
        window.ticketStore.restoreSession();
    }

    // Protected routes that require authentication
    const protectedRoutes = ['/dashboard', '/tickets'];
    const currentPath = window.location.pathname;

    // Check if current page is protected
    const isProtectedRoute = protectedRoutes.some(route => currentPath.startsWith(route));

    if (isProtectedRoute && window.ticketStore) {
        const state = window.ticketStore.getState();
        
        // Redirect to login if not authenticated
        if (!state.isAuthenticated) {
            window.location.href = '/auth/login';
        }
    }

    // Redirect to dashboard if already authenticated and on auth pages
    const authRoutes = ['/auth/login', '/auth/signup'];
    const isAuthRoute = authRoutes.some(route => currentPath === route);

    if (isAuthRoute && window.ticketStore) {
        const state = window.ticketStore.getState();
        
        if (state.isAuthenticated) {
            window.location.href = '/dashboard';
        }
    }
})();