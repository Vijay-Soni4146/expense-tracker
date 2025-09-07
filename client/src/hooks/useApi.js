import { useState, useEffect } from "react";
import { usersAPI, categoriesAPI } from "../services/api";
let globalUsers = [];
let globalUsersLoading = true;
let globalUsersError = null;
let usersCallInProgress = false;

export const useUsers = () => {
  const [users, setUsers] = useState(globalUsers);
  const [loading, setLoading] = useState(globalUsersLoading);
  const [error, setError] = useState(globalUsersError);

  useEffect(() => {
    const fetchUsers = async () => {
      // If data already exists, use it
      if (globalUsers.length > 0) {
        setUsers(globalUsers);
        setLoading(false);
        setError(null);
        return;
      }
      // If call is already in progress, wait for it
      if (usersCallInProgress) {
        const checkInterval = setInterval(() => {
          if (!usersCallInProgress) {
            clearInterval(checkInterval);
            setUsers(globalUsers);
            setLoading(globalUsersLoading);
            setError(globalUsersError);
          }
        }, 100);
        return () => clearInterval(checkInterval);
      }
      // Start the call
      usersCallInProgress = true;
      globalUsersLoading = true;
      setLoading(true);

      try {
        const response = await usersAPI.getUsers();

        globalUsers = response.data.data;
        globalUsersError = null;
        setUsers(globalUsers);
        setError(null);
      } catch (err) {
        console.error("Error fetching users:", err);
        globalUsersError = err.message || "Failed to fetch users";
        setError(globalUsersError);
      } finally {
        globalUsersLoading = false;
        usersCallInProgress = false;
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  return { users, loading, error };
};

// Global state for categories to share across components
let globalCategories = [];
let globalCategoriesLoading = true;
let globalCategoriesError = null;
let categoriesCallInProgress = false;

export const useCategories = () => {
  const [categories, setCategories] = useState(globalCategories);
  const [loading, setLoading] = useState(globalCategoriesLoading);
  const [error, setError] = useState(globalCategoriesError);

  useEffect(() => {
    const fetchCategories = async () => {
      // If data already exists, use it
      if (globalCategories.length > 0) {
        setCategories(globalCategories);
        setLoading(false);
        setError(null);
        return;
      }

      // If call is already in progress, wait for it
      if (categoriesCallInProgress) {
        const checkInterval = setInterval(() => {
          if (!categoriesCallInProgress) {
            clearInterval(checkInterval);
            setCategories(globalCategories);
            setLoading(globalCategoriesLoading);
            setError(globalCategoriesError);
          }
        }, 100);
        return () => clearInterval(checkInterval);
      }

      // Start the call
      categoriesCallInProgress = true;
      globalCategoriesLoading = true;
      setLoading(true);

      try {
        const response = await categoriesAPI.getCategories();

        globalCategories = response.data.data;
        globalCategoriesError = null;
        setCategories(globalCategories);
        setError(null);
      } catch (err) {
        console.error("Error fetching categories:", err);
        globalCategoriesError = err.message || "Failed to fetch categories";
        setError(globalCategoriesError);
      } finally {
        globalCategoriesLoading = false;
        categoriesCallInProgress = false;
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return { categories, loading, error };
};
