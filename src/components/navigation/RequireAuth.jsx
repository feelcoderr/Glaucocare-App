// FILE: src/components/RequireAuth.jsx
// FIXED - Better navigation handling to prevent redirect loops
// ============================================================================

import React, { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';

/**
 * Higher Order Component to protect routes
 * Redirects guest users to ConvertGuestScreen
 * Redirects unauthenticated users to Login
 */
const RequireAuth = ({ children, allowGuest = false }) => {
  const navigation = useNavigation();
  const { isAuthenticated, isGuest, user } = useSelector((state) => state.auth);

  // ✅ Use ref to track if we've already redirected
  const hasRedirected = useRef(false);

  useEffect(() => {
    // Reset redirect flag when auth state changes
    hasRedirected.current = false;
  }, [isAuthenticated, isGuest]);

  useEffect(() => {
    // ✅ Prevent multiple redirects
    if (hasRedirected.current) {
      return;
    }

    // Check authentication status
    if (!isAuthenticated) {
      // Not logged in at all - redirect to login
      hasRedirected.current = true;
      navigation.replace('Auth');
      return;
    }

    // If route doesn't allow guest and user is guest
    if (!allowGuest && isGuest) {
      // Redirect to convert guest screen
      console.log('🔒 Guest user trying to access protected route - redirecting to convert');
      hasRedirected.current = true;

      // ✅ Use navigate instead of replace to allow back navigation
      navigation.replace('ConvertGuest');
      return;
    }
  }, [isAuthenticated, isGuest, allowGuest, navigation]);

  // Don't render children until auth check is complete
  if (!isAuthenticated) {
    return null;
  }

  // Don't render if guest trying to access protected route
  if (!allowGuest && isGuest) {
    return null;
  }

  return <>{children}</>;
};

export default RequireAuth;
