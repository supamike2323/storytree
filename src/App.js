import { Helmet } from 'react-helmet';
import React, { useState, useEffect } from 'react';
import { useLocation, Navigate } from 'react-router-dom';
import { TransitionGroup, CSSTransition } from 'react-transition-group';

import Navbar from './component/Navbar.js';
import FooterBar from './component/footer.js'
import WriteStory from './component/WriteStory.js';
import Browse from './component/Browse.js';
import AccountPage from './component/account.js';
import HomePage from './component/HomePage.js';
import StoryDetail from "./component/StoryDetail.js"
import SignIn from './component/login.js';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import { Route, Routes } from "react-router-dom";
import Branch from './component/Branch.js';
import { getDatabase, ref, onValue } from 'firebase/database';

function AnimatedRoutes({ stories, isUserSignedIn, handleSignOut }) {
    let location = useLocation();

    return (
        <TransitionGroup>
            <CSSTransition key={location.pathname} classNames="slide" timeout={300}>
                <Routes location={location}>
                    <Route index element={<HomePage />} />
                    <Route path="/story/:id" element={<StoryDetail />} />
                    <Route path="/story/:id/branch" element={<Branch />} />
                    <Route path="browse" element={<Browse stories={stories} />} />
                    <Route path="account" element={isUserSignedIn ? <AccountPage /> : <Navigate to="/login" state={{ from: "account" }} replace />} />
                    <Route path="write" element={isUserSignedIn ? <WriteStory /> : <Navigate to="/login" state={{ from: "write" }} replace />} />
                    <Route path="*" element={<Navigate to="/" />} />
                    <Route path="login" element={<SignIn />} />
                </Routes>
            </CSSTransition>
        </TransitionGroup>
    );
}

export default function App() {
    const [isUserSignedIn, setIsUserSignedIn] = useState(false);
    const [loading, setLoading] = useState(true);
    const [stories, setStories] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            const db = getDatabase();
            const allMessageRef = ref(db, "articles");
            onValue(allMessageRef, (snapshot) => {
                const valueObj = snapshot.val() || {};
                setStories(Object.keys(valueObj).map(key => ({ key, ...valueObj[key] })));
            });
        };
        fetchData();
    }, []);

    useEffect(() => {
        const auth = getAuth();
        onAuthStateChanged(auth, user => {
            setIsUserSignedIn(!!user);
            setLoading(false);
        });
    }, []);

    const handleSignOut = () => {
        const auth = getAuth();
        signOut(auth).then(() => setIsUserSignedIn(false))
            .catch(error => console.error("Sign out error:", error));
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="App">
            <Helmet>
                <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Courgette&display=swap" />
            </Helmet>
            <Navbar isUserSignedIn={isUserSignedIn} onSignOut={handleSignOut} />
            <AnimatedRoutes stories={stories} isUserSignedIn={isUserSignedIn} handleSignOut={handleSignOut} />
            <FooterBar />
        </div>
    );
}