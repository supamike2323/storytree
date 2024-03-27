import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const Navbar = ({ isUserSignedIn, onSignOut }) => {
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();
    const [mousePosition, setMousePosition] = useState({ x: null, y: null });
    const storyTreeLogoRef = useRef();

    useEffect(() => {
        const handleMouseMove = (e) => {
            setMousePosition({ x: e.clientX, y: e.clientY });
        };

        window.addEventListener('mousemove', handleMouseMove);

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
        };
    }, []);

    const getAngle = () => {
        if (!storyTreeLogoRef.current) return 0;
    
        const storyTreeLogoRect = storyTreeLogoRef.current.getBoundingClientRect();
        const storyTreeLogoCenterX = storyTreeLogoRect.left + storyTreeLogoRect.width / 2;
        const storyTreeLogoCenterY = storyTreeLogoRect.top + storyTreeLogoRect.height / 2;
        const angleDeg = (Math.atan2(mousePosition.y - storyTreeLogoCenterY, mousePosition.x - storyTreeLogoCenterX) * 180 / Math.PI) + 270;
        return angleDeg;
    };
    

    const navigateTo = (path) => {
        setIsOpen(false);
        navigate(path);
    };

    return (
        <nav className="navbar">
            <div className="navbar-content">
                <button
                    className="hamburger"
                    onClick={() => setIsOpen(!isOpen)}
                    aria-label="Menu"
                    aria-expanded={isOpen}
                >
                    &#9776;
                </button>
                <ul className={`nav-links ${isOpen ? "showMenu" : ""}`}>
                    <li>
                        <img
                            ref={storyTreeLogoRef}
                            src="/img/storytree.png"
                            alt="Storytree Logo"
                            className="storytree-logo"
                            style={{ transform: `rotate(${getAngle()}deg)` }} //Had to use inline style since the logo is changing dynamically :(
                        />
                    </li>
                    <li className="navbar-title">StoryTree</li>
                    <li><button onClick={() => navigateTo('/')} className='courgette-font large-button'>Home</button></li>
                    <li><button onClick={() => navigateTo('/browse')} className='courgette-font large-button'>Browse</button></li>
                    <li><button onClick={() => navigateTo('/write')} className='courgette-font large-button'>Write</button></li>
                    <li><button onClick={() => navigateTo('/account')} className='courgette-font large-button'>Account</button></li>
                   
                </ul>
                {!isUserSignedIn && (
                        <button onClick={() => navigateTo('/login')} className='courgette-font large-button sign-in'>Sign In</button>
)}
                {isUserSignedIn && (
                    <button onClick={onSignOut} className='courgette-font large-button sign-out'>Sign Out</button>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
