// Import Dependencies
import { useEffect, useReducer, useState } from "react";
import { useQuery } from '@tanstack/react-query';
import isObject from "lodash/isObject";
import PropTypes from "prop-types";
import isString from "lodash/isString";

// Local Imports
import { loginApi, fetchProfile } from "utils/apis";
import { AuthContext } from "./context";

// ----------------------------------------------------------------------

const initialState = {
  isAuthenticated: false,
  isLoading: false,
  isInitialized: false,
  errorMessage: null,
  user: null,
};

const reducerHandlers = {
  INITIALIZE: (state, action) => {
    const { isAuthenticated, user } = action.payload;
    return {
      ...state,
      isAuthenticated,
      isInitialized: true,
      user,
    };
  },

  LOGIN_REQUEST: (state) => {
    return {
      ...state,
      isLoading: true,
    };
  },

  LOGIN_SUCCESS: (state, action) => {
    const { user } = action.payload;
    return {
      ...state,
      isAuthenticated: true,
      isLoading: false,
      user,
    };
  },

  LOGIN_ERROR: (state, action) => {
    const { errorMessage } = action.payload;

    return {
      ...state,
      errorMessage,
      isLoading: false,
    };
  },

  LOGOUT: (state) => ({
    ...state,
    isAuthenticated: false,
    user: null,
  }),
};

const reducer = (state, action) => {
  const handler = reducerHandlers[action.type];
  if (handler) {
    return handler(state, action);
  }
  return state;
};

export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [token, setToken] = useState(null);

  const { data, refetch, error } = useQuery({
    queryKey: ['profile', token],
    queryFn: fetchProfile,
    enabled: !!token,
  })

  useEffect(() => {
    let authToken = window.localStorage.getItem('authToken');
    if (authToken) {
      setToken(authToken)
    } else {
      dispatch({
        type: "INITIALIZE",
        payload: {
          isAuthenticated: false,
          user: null,
        },
      });
    }
  }, []);

  useEffect(() => {
    if (token) {
      refetch()
    }
  }, [token]);

  useEffect(() => {
    if (data) {
      if (data.user) {
        dispatch({
          type: "INITIALIZE",
          payload: {
            isAuthenticated: true,
            user: data.user,
          },
        });
      }
    }
    if (error) {
      window.localStorage.removeItem('authToken');
      dispatch({
        type: "INITIALIZE",
        payload: {
          isAuthenticated: false,
          user: null,
        },
      });
    }
  }, [data, error]);

  const login = async (params) => {
    dispatch({
      type: "LOGIN_REQUEST",
    });

    try {
      const response = await loginApi(params);
      const { token, user } = response;

      window.localStorage.setItem('authToken', token);

      dispatch({
        type: "LOGIN_SUCCESS",
        payload: {
          user,
        },
      });
    } catch (err) {
      dispatch({
        type: "LOGIN_ERROR",
        payload: {
          errorMessage: err,
        },
      });
    }
  };

  const logout = async () => {
    window.localStorage.removeItem('authToken');
    dispatch({ type: "LOGOUT" });
  };

  if (!children) {
    return null;
  }

  return (
    <AuthContext
      value={{
        ...state,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext>
  );
}

AuthProvider.propTypes = {
  children: PropTypes.node,
};
