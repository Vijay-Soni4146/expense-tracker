class APIGuards {
  static instance;
  guards = new Map();

  static getInstance() {
    if (!APIGuards.instance) {
      APIGuards.instance = new APIGuards();
    }
    return APIGuards.instance;
  }

  // Check if API call is already in progress or completed
  isCallInProgress(key) {
    return this.guards.has(key);
  }

  // Mark API call as started
  startCall(key) {
    this.guards.set(key, true);
  }

  // Mark API call as completed
  completeCall(key) {
    this.guards.delete(key);
  }

  // Clear all guards
  clearAll() {
    this.guards.clear();
  }
}

export const apiGuards = APIGuards.getInstance();

// Helper function to create guard keys
export const createGuardKey = (type, params) => {
  if (params) {
    return `${type}:${JSON.stringify(params)}`;
  }
  return type;
};
