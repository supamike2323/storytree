import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getDatabase, ref, push, set, onValue } from 'firebase/database';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

function WriteStory() {
  const [title, setTitle] = useState("");
  const [typedValue, setTypedValue] = useState("");
  const [synopsis, setSynopsis] = useState("");
  const [username, setUsername] = useState("NoUsername");
  const navigate = useNavigate();
  const [isUserSignedIn, setIsUserSignedIn] = useState(false);

  useEffect(() => {
    const auth = getAuth();
    onAuthStateChanged(auth, user => {
      if (user) {
        setIsUserSignedIn(true);
        const db = getDatabase();
        const userRef = ref(db, 'users/' + user.uid);
        onValue(userRef, (snapshot) => {
          const data = snapshot.val();
          if (data && data.username) {
            setUsername(data.username);
          }
        });
      } else {
        navigate('/login');
      }
    });
  }, [navigate]);

  const handleTitleChange = (event) => {
    const titleValue = event.target.value;
    setTitle(titleValue);
    console.log(titleValue);
  };

  const handleChange = (event) => {
    const inputtedValue = event.target.value;
    setTypedValue(inputtedValue);
    console.log(inputtedValue);
  };

  const handleSynopsisChange = (event) => {
    const synopsisValue = event.target.value;
    setSynopsis(synopsisValue);
    console.log(synopsisValue);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    
    if (!title.trim() || !synopsis.trim() || !typedValue.trim()) {
      alert('All fields are required. Please make sure the title, synopsis, and story content are filled out.');
      return;
    }
    
    const db = getDatabase();
    const articlesRef = ref(db, 'articles');
    
    const newStoryRef = push(articlesRef);
    
    const newStory = {
      views: 0,
      writtenby: username,
      title: title,
      synopsis: synopsis,
      content: typedValue,
      timestamp: Date.now()
    };
    
    set(newStoryRef, newStory)
      .then(() => {
        alert('Story published successfully!'); 
        navigate("/browse");
      })
      .catch((error) => {
        console.error('Error uploading story:', error);
        alert('There was an error publishing your story. Please try again.');
      });
  };
  

  return (
      <div className="container courgette-font">
        <h2>Write Your Story</h2>

        <form>
          <div className="mb-3">
            <input type="text1" className="form-control storyTitle" id="storyTitle" name="title"
              placeholder="Enter the title of your story here..."
              onChange={handleTitleChange} value={title}>
            </input>
          </div>

          <div className="mb-3">
            <textarea className="storySynopsis" id="storySynopsis" name="synopsis" rows="5"
              placeholder="Enter the synopsis of your story here..."
              onChange={handleSynopsisChange} value={synopsis}></textarea>
          </div>

          <div className="mb-3">
            <textarea className="textbox" id="storyContent" name="content" rows="10"
              placeholder="Start typing your story here..."
              onChange={handleChange} value={typedValue}></textarea>
          </div>

          <div className="button-container">
            <button type="button" className=" btn btn-warning btn-rounded courgette-font" data-mdb-ripple-init onClick={handleSubmit}>Publish
              Story</button>
          </div>
        </form>
      </div>
  );
}

export default WriteStory;