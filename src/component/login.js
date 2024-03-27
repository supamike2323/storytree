import React, { useState } from "react";
import StyledFirebaseAuth from "react-firebaseui/StyledFirebaseAuth";
import { getAuth, createUserWithEmailAndPassword, EmailAuthProvider, GoogleAuthProvider } from "firebase/auth";
import { getDatabase, ref, set } from "firebase/database";
import { useNavigate, useLocation } from "react-router-dom";

const SignIn = () => {
  const [showSignIn, setShowSignIn] = useState(false);
  const location = useLocation();
  const from = location.state?.from;
  let auth = getAuth();
  let navigate = useNavigate();
  const database = getDatabase(); 

  const UIConfig = {
    signInOptions: [
      { provider: EmailAuthProvider.PROVIDER_ID, requiredDisplayName: true },
      GoogleAuthProvider.PROVIDER_ID,
    ],
    signInFlow: "popup",
    credentialHelper: "none",
    callbacks: {
      signInSuccessWithAuthResult: () => {
        navigate('/');
        return false;
      },
    },
  };


  const handleSignUp = async (email, password) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      await set(ref(database, 'users/' + user.uid), {
        email: email
      });
    } catch (error) {
      console.error("Error signing up:", error);
    }
    setShowSignIn(true);
  };

  const renderMessage = () => {
    if (from) {
      return "In order to use this function, you need to log in first. If you do not have an account, just input your email, and it will automatically sign you up!";
    }
    return "Sign in Below: If you do not have an account, just input your email and it will automatically sign you up!";
  };

  return (
    <div className="signin-container">
      <div className="login-box">
        <img src="/img/storytree.png" alt="StoryTree Logo" className="storytree-logo" />
        <h1>Welcome to Story Tree!</h1>
        <p>{renderMessage()}</p>
        
        {!showSignIn ? (
          <>
            <button className="sign-in-button" onClick={handleSignUp}>Sign Up/Sign In</button>
          </>
        ) : (
          <StyledFirebaseAuth uiConfig={UIConfig} firebaseAuth={auth} aria-label="sign in" />
        )}
      </div>
    </div>
  );
};

export default SignIn;
