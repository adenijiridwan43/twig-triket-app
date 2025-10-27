// File: twig-app/public/js/store.js
// Vanilla JS Store - Replacing Zustand

// Mock initial tickets
const mockTickets = [
  {
    id: '1',
    title: 'Fix login bug',
    description: 'Users cannot log in with correct credentials',
    status: 'open',
    priority: 'high',
    createdAt: new Date('2025-10-20').toISOString(),
    updatedAt: new Date('2025-10-20').toISOString(),
  },
  {
    id: '2',
    title: 'Update dashboard UI',
    description: 'Redesign dashboard with modern components',
    status: 'in_progress',
    priority: 'medium',
    createdAt: new Date('2025-10-21').toISOString(),
    updatedAt: new Date('2025-10-22').toISOString(),
  },
  {
    id: '3',
    title: 'Add email notifications',
    description: 'Send email when ticket status changes',
    status: 'closed',
    priority: 'low',
    createdAt: new Date('2025-10-18').toISOString(),
    updatedAt: new Date('2025-10-23').toISOString(),
  },
];

// Generate unique ID
const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

// Validation utilities
const validateTicket = (ticket) => {
  const errors = {};

  if (!ticket.title || ticket.title.trim() === '') {
    errors.title = 'Title is required';
  } else if (ticket.title.length > 100) {
    errors.title = 'Title must be less than 100 characters';
  }

  const validStatuses = ['open', 'in_progress', 'closed'];
  if (!ticket.status) {
    errors.status = 'Status is required';
  } else if (!validStatuses.includes(ticket.status)) {
    errors.status = 'Status must be one of: open, in_progress, closed';
  }

  if (ticket.description && ticket.description.length > 500) {
    errors.description = 'Description must be less than 500 characters';
  }

  if (ticket.priority && !['low', 'medium', 'high'].includes(ticket.priority)) {
    errors.priority = 'Priority must be one of: low, medium, high';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

const validateAuth = (email, password, isSignup = false) => {
  const errors = {};
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!email || email.trim() === '') {
    errors.email = 'Email is required';
  } else if (!emailRegex.test(email)) {
    errors.email = 'Please enter a valid email address';
  }

  if (!password || password.trim() === '') {
    errors.password = 'Password is required';
  } else if (isSignup && password.length < 6) {
    errors.password = 'Password must be at least 6 characters';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

// Main Store Class
class TicketStore {
  constructor() {
    this.state = {
      user: null,
      isAuthenticated: false,
      tickets: [],
      currentTicket: null,
      loading: false,
      formErrors: {},
      toast: null,
    };

    this.listeners = [];
    this.init();
  }

  // Initialize store from localStorage
  init() {
    const saved = localStorage.getItem('ticket-store');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        this.state.tickets = parsed.tickets || mockTickets;
        this.state.user = parsed.user || null;
        this.state.isAuthenticated = parsed.isAuthenticated || false;
      } catch (e) {
        console.error('Failed to parse store', e);
        this.state.tickets = mockTickets;
      }
    } else {
      this.state.tickets = mockTickets;
    }
    this.persist();
  }

  // Persist to localStorage
  persist() {
    localStorage.setItem('ticket-store', JSON.stringify({
      tickets: this.state.tickets,
      user: this.state.user,
      isAuthenticated: this.state.isAuthenticated,
    }));
  }

  // Subscribe to state changes
  subscribe(listener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  // Notify all listeners
  notify() {
    this.listeners.forEach(listener => listener(this.state));
  }

  // Get current state
  getState() {
    return this.state;
  }

  // Update state
  setState(updates) {
    this.state = { ...this.state, ...updates };
    this.persist();
    this.notify();
  }

  // Get statistics
  getStats() {
    const tickets = this.state.tickets;
    return {
      total: tickets.length,
      open: tickets.filter(t => t.status === 'open').length,
      inProgress: tickets.filter(t => t.status === 'in_progress').length,
      closed: tickets.filter(t => t.status === 'closed').length,
    };
  }

  // Auth actions
  async login(email, password) {
    this.setState({ loading: true, formErrors: {} });

    const validation = validateAuth(email, password);
    if (!validation.isValid) {
      this.setState({
        loading: false,
        formErrors: validation.errors,
        toast: { type: 'error', message: 'Please fix the errors in the form' },
      });
      return false;
    }

    await new Promise(resolve => setTimeout(resolve, 800));

    const user = {
      id: generateId(),
      email: email,
      name: email.split('@')[0],
    };

    const token = `token_${generateId()}`;

    localStorage.setItem('ticketapp_session', JSON.stringify({ token, user }));

    this.setState({
      user,
      isAuthenticated: true,
      loading: false,
      toast: { type: 'success', message: `Welcome back, ${user.name}!` },
    });

    return true;
  }

  async signup(email, password, name) {
    this.setState({ loading: true, formErrors: {} });

    const validation = validateAuth(email, password, true);
    if (!validation.isValid) {
      this.setState({
        loading: false,
        formErrors: validation.errors,
        toast: { type: 'error', message: 'Please fix the errors in the form' },
      });
      return false;
    }

    await new Promise(resolve => setTimeout(resolve, 800));

    const user = {
      id: generateId(),
      email: email,
      name: name || email.split('@')[0],
    };

    const token = `token_${generateId()}`;

    localStorage.setItem('ticketapp_session', JSON.stringify({ token, user }));

    this.setState({
      user,
      isAuthenticated: true,
      loading: false,
      toast: { type: 'success', message: `Account created! Welcome, ${user.name}!` },
    });

    return true;
  }

  logout() {
    localStorage.removeItem('ticketapp_session');
    this.setState({
      user: null,
      isAuthenticated: false,
      tickets: mockTickets,
      currentTicket: null,
      toast: { type: 'info', message: 'You have been logged out' },
    });
  }

  restoreSession() {
    try {
      const session = localStorage.getItem('ticketapp_session');
      if (session) {
        const { token, user } = JSON.parse(session);
        this.setState({ user, isAuthenticated: true });
        return true;
      }
    } catch (e) {
      localStorage.removeItem('ticketapp_session');
    }
    return false;
  }

  // Ticket CRUD
  async createTicket(ticketData) {
    this.setState({ loading: true, formErrors: {} });

    const validation = validateTicket(ticketData);
    if (!validation.isValid) {
      this.setState({
        loading: false,
        formErrors: validation.errors,
        toast: { type: 'error', message: 'Please fix the errors in the form' },
      });
      return false;
    }

    await new Promise(resolve => setTimeout(resolve, 500));

    const newTicket = {
      ...ticketData,
      id: generateId(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.setState({
      tickets: [newTicket, ...this.state.tickets],
      loading: false,
      formErrors: {},
      toast: { type: 'success', message: 'Ticket created successfully!' },
    });

    return newTicket;
  }

  async updateTicket(ticketId, updatedData) {
    this.setState({ loading: true, formErrors: {} });

    const validation = validateTicket(updatedData);
    if (!validation.isValid) {
      this.setState({
        loading: false,
        formErrors: validation.errors,
        toast: { type: 'error', message: 'Please fix the errors in the form' },
      });
      return false;
    }

    await new Promise(resolve => setTimeout(resolve, 500));

    const tickets = this.state.tickets.map(ticket =>
      ticket.id === ticketId
        ? { ...ticket, ...updatedData, updatedAt: new Date().toISOString() }
        : ticket
    );

    this.setState({
      tickets,
      loading: false,
      formErrors: {},
      currentTicket: null,
      toast: { type: 'success', message: 'Ticket updated successfully!' },
    });

    return true;
  }

  async deleteTicket(ticketId) {
    this.setState({ loading: true });

    await new Promise(resolve => setTimeout(resolve, 500));

    this.setState({
      tickets: this.state.tickets.filter(ticket => ticket.id !== ticketId),
      loading: false,
      toast: { type: 'success', message: 'Ticket deleted successfully!' },
    });

    return true;
  }

  setCurrentTicket(ticket) {
    this.setState({ currentTicket: ticket, formErrors: {} });
  }

  clearToast() {
    this.setState({ toast: null });
  }

  clearFormErrors() {
    this.setState({ formErrors: {} });
  }
}

// Create global store instance
window.ticketStore = new TicketStore();