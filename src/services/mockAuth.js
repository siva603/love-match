const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Mock authentication service for demo purposes
export const mockAuthService = {
  // Simulate login API call

  loginUser : async (email, password) => {
    const response = await fetch(`${API_BASE_URL}/users/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
  
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || "Login failed");
    }
  
    const user = await response.json();
    return user;
  },

  // Simulate register API call
  // Real register API call
register: async (userData) => {
  console.log(`auth : ${userData}`)
  const response = await fetch(`${API_BASE_URL}/users`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userData),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || "Registration failed");
  }

  const result = await response.json();
  return result;
},

  // Get all users for admin
  getAllUsers: async () => {
    const response = await fetch(`${API_BASE_URL}/users`);
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || "Failed to fetch users.");
    }
    return response.json();
  },

  // Get user by ID
  getUserById: async (id) => {
    const response = await fetch(`${API_BASE_URL}/users/id/${id}`);
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || "User not found.");
    }
    return response.json();
  },

  // Get users by gender
  getUsersByGender: async (gender) => {
    const response = await fetch(`${API_BASE_URL}/users/gender/${gender}`);
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || "Failed to fetch users by gender.");
    }
    return response.json();
  },

  // Get best matches (mock algorithm)
  getBestMatches: async (userId, top = 5) => {
    const response = await fetch(`${API_BASE_URL}/users/best-match/${userId}/${top}`);
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || "Failed to fetch matches.");
    }
    return response.json();
  },


  // Delete user
  deleteUser: async (id) => {
    const response = await fetch(`${API_BASE_URL}/users/id/${id}`, {
      method: "DELETE",
    });
  
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || "Failed to delete user.");
    }
  
    const text = await response.text();
    return { message: text };
  },
  
  
  // Validate token
  // validateToken: async (token) => {
  //   await new Promise(resolve => setTimeout(resolve, 200));
  //   const user = demoUsers.users.find(u => u.token === token);
  //   if (user) {
  //     const { password, token: _, ...userWithoutSensitive } = user;
  //     return userWithoutSensitive;
  //   }
  //   throw new Error('Invalid token');
  // }
};