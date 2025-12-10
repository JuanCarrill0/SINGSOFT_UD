import { useState, useEffect } from 'react';

export interface UserData {
  userid: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string | null;
  dateOfBirth: string | null;
  role: string;
  status: string;
  createdAt: string;
  lastLogin: string | null;
}

export interface UserStats {
  total: number;
  roleStats: Record<string, number>;
  statusStats: Record<string, number>;
}

export interface UserFilters {
  search?: string;
  role?: string;
  status?: string;
}

export const useUsers = () => {
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = async (filters?: UserFilters) => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (filters?.search) params.append('search', filters.search);
      if (filters?.role) params.append('role', filters.role);
      if (filters?.status) params.append('status', filters.status);

      const queryString = params.toString();
      const url = `http://localhost:8081/api/users${queryString ? `?${queryString}` : ''}`;
      
      const response = await fetch(url);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error fetching users');
      }

      const data = await response.json();
      setUsers(data);
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error fetching users';
      setError(errorMessage);
      console.error('Error fetching users:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getUserById = async (userId: string): Promise<UserData> => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`http://localhost:8081/api/users/${userId}`);
      
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('User not found');
        }
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error fetching user details');
      }

      const data = await response.json();
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error fetching user details';
      setError(errorMessage);
      console.error('Error fetching user:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateUserRole = async (userId: string, newRole: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`http://localhost:8081/api/users/${userId}/role`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ role: newRole }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error updating user role');
      }

      const data = await response.json();
      
      // Update local state
      setUsers(prevUsers =>
        prevUsers.map(user =>
          user.userid === userId ? { ...user, role: newRole } : user
        )
      );

      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error updating user role';
      setError(errorMessage);
      console.error('Error updating role:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateUserStatus = async (userId: string, newStatus: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`http://localhost:8081/api/users/${userId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error updating user status');
      }

      const data = await response.json();
      
      // Update local state
      setUsers(prevUsers =>
        prevUsers.map(user =>
          user.userid === userId ? { ...user, status: newStatus } : user
        )
      );

      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error updating user status';
      setError(errorMessage);
      console.error('Error updating status:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getUserStats = async (): Promise<UserStats> => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('http://localhost:8081/api/users/stats');
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error fetching user statistics');
      }

      const data = await response.json();
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error fetching statistics';
      setError(errorMessage);
      console.error('Error fetching stats:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    users,
    loading,
    error,
    fetchUsers,
    getUserById,
    updateUserRole,
    updateUserStatus,
    getUserStats,
  };
};
