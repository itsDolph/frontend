import React, {
  useState,
  useEffect,
  useMemo,
  useContext,
  createContext,
} from "react";
import queryString from "query-string";
import fakeAuth from "fake-auth";
import { useUser, createUser, activateUser, updateUser } from "./db";
import router from "next/router";
import PageLoader from "./../components/PageLoader";

// Whether to merge extra user data from database into auth.user
const MERGE_DB_USER = true;

const COOKIE_KEY = "yourtube-super-secret-cookie-key";

const authContext = createContext();

// Context Provider component that wraps your app and makes auth object
// available to any child component that calls the useAuth() hook.
export function ProvideAuth({ children }) {

  const auth = useProvideAuth();
  return <authContext.Provider value={auth}>{children}</authContext.Provider>;
}

// Hook that enables any component to subscribe to auth state
export const useAuth = () => {
  return useContext(authContext);
};

// Provider hook that creates auth object and handles state
function useProvideAuth() {
  // Store auth user object
  const [user, setUser] = useState(null);

  // Format final user object and merge extra data from database
  // const finalUser = usePrepareUser(user);

  // Handle response from authentication functions
  const handleAuth = async (user) => {
    // Create the user in the database
    // fake-auth doesn't indicate if they are new so we attempt to create user every time
    
    // Update user in state
    setUser(user);
    return user;
  };

  const setCookie = (key, value) => {
    document.cookie = `${key}=${value}`;
  }

  const getCookie = (key) => {
    const regexp = new RegExp(`.*${key}=([^;]*)`);
    const result = regexp.exec(document.cookie);
    if(result) {
      return result [1];
    }
  }

  const removeCookie = (key) => {
    const regexp = new RegExp(`.*${key}=([^;]*)`);
    const result = regexp.exec(document.cookie);
    if(result) {
      document.cookie = `${result [1]};expires=${(new Date()).toUTCString()};`;
    }
  }

  const signup = (email, password) => {
    return createUser({ email: email, password: password }).then((response) => {
      // useEffect(() => {
      //   setCookie(COOKIE_KEY, response.user);
      // }, []);
      handleAuth(response.user);
    });
  };

  const signin = (email, password) => {
    return activateUser({ email: email, password: password }).then((response) => {
      // useEffect(() => {
        setCookie(COOKIE_KEY, response.user);
      // }, []);
      handleAuth(response.user);
    });
  };

  const signout = () => {
    // useEffect(() => {
      removeCookie(COOKIE_KEY);
    // }, []);
    return setUser(false);
  };

  const updatePassword = (password) => {
    return fakeAuth.updatePassword(password);
  };

  // Update auth user and persist to database (including any custom values in data)
  // Forms can call this function instead of multiple auth/db update functions
  const updateProfile = async (data) => {
    const { email, name, picture } = data;

    // Update auth email
    if (email) {
      await fakeAuth.updateEmail(email);
    }

    // Update auth profile fields
    if (name || picture) {
      let fields = {};
      if (name) fields.name = name;
      if (picture) fields.picture = picture;
      await fakeAuth.updateProfile(fields);
    }

    // Persist all data to the database
    await updateUser(user.uid, data);

    // Update user in state
    const currentUser = await fakeAuth.getCurrentUser();
    setUser(currentUser);
  };

  useEffect(function mount() {
    function onLoad() {
      // Check the cookie
      const currentUser = getCookie(COOKIE_KEY);
      if (currentUser) {
        setUser(currentUser);
      }
    }

    window.addEventListener("load", onLoad);

    return function unMount() {
      window.removeEventListener("load", onLoad);
    };
  });

  return {
    user: user,
    signup,
    signin,
    signout,
    updatePassword,
    updateProfile,
  };
}

// Format final user object and merge extra data from database
function usePrepareUser(user) {

  console.log("usePrepareUser: " + user)

  // Fetch extra data from database (if enabled and auth user has been fetched)
  const userDbQuery = useUser(MERGE_DB_USER && user && user.email);

  // Memoize so we only create a new object if user or userDbQuery changes
  return useMemo(() => {
    // Return if auth user is null (loading) or false (not authenticated)
    if (!user) return user;

    // Data we want to include from auth user object
    let finalUser = {
      uid: user.uid,
      email: user.email,
      name: user.name,
      picture: user.picture,
    };

    // Include an array of user's auth providers, such as ["password", "google", etc]
    // Components can read this to prompt user to re-auth with the correct provider
    finalUser.providers = [user.provider];

    // If merging user data from database is enabled ...
    if (MERGE_DB_USER) {
      switch (userDbQuery.status) {
        case "idle":
          // Return null user until we have db data to merge
          return null;
        case "loading":
          return null;
        case "error":
          // Log query error to console
          console.error(userDbQuery.error);
          return null;
        case "success":
          // If user data doesn't exist we assume this means user just signed up and the createUser
          // function just hasn't completed. We return null to indicate a loading state.
          if (userDbQuery.data === null) return null;

          // Merge user data from database into finalUser object
          Object.assign(finalUser, userDbQuery.data);

        // no default
      }
    }

    return finalUser;
  }, [user, userDbQuery]);
}

// A Higher Order Component for requiring authentication
export const requireAuth = (Component) => {
  return (props) => {
    // Get authenticated user
    const auth = useAuth();
    useEffect(() => {
      // Redirect if not signed in
      if (auth.user === false) {
        router.replace("/auth/signin");
      }
    }, [auth]);

    // Show loading indicator
    // We're either loading (user is null) or we're about to redirect (user is false)
    if (!auth.user) {
      return <PageLoader />;
    }

    // Render component now that we have user
    return <Component {...props} />;
  };
};

const getFromQueryString = (key) => {
  return queryString.parse(window.location.search)[key];
};
