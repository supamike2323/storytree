import React, { useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from "firebase/storage";
import { getDatabase, ref, set, onValue } from "firebase/database";

function AccountPage() {
  const navigate = useNavigate();
  const [profilePic, setProfilePic] = useState('img/user.png');
  const [userInfo, setUserInfo] = useState({
    name: '',
    gender: '',
    age: '',
    email: '',
    bio: ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const [genderSelected, setGenderSelected] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [customGender, setCustomGender] = useState('');
  const [hasChanged, setHasChanged] = useState(false);


  useEffect(() => {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (user) {
        const db = getDatabase();
        const userProfileRef = ref(db, 'users/' + user.uid);
        onValue(userProfileRef, (snapshot) => {
          const data = snapshot.val();
          if (data) {
            setUserInfo({
              name: data.username || '',
              gender: ['male', 'female', 'other'].includes(data.gender) ? data.gender : 'other',
              age: data.age || '',
              email: data.email || '',
              bio: data.bio || '',
            });
            if (data.gender !== 'male' && data.gender !== 'female') {
              setCustomGender(data.gender);
            }
            if (data.profile_picture) {
              setProfilePic(data.profile_picture);
            }
          }
        });
      } else {
        navigate('/login');
      }
    });
  }, [navigate]);


  const handleImageChange = async (event) => {
    setHasChanged(true); 
    const file = event.target.files[0];
    if (file && getAuth().currentUser) {
      const storage = getStorage();
      const fileRef = storageRef(storage, `profilePictures/${getAuth().currentUser.uid}`);

      try {
        await uploadBytes(fileRef, file);
        const photoURL = await getDownloadURL(fileRef);
        setProfilePic(photoURL);
        writeUserData(getAuth().currentUser.uid, userInfo.name, userInfo.email, photoURL);
      } catch (error) {
        console.error("Error uploading file: ", error);
      }
    }
  };

  const writeUserData = (userId, name, email, imageUrl, gender) => {
    const db = getDatabase();
    set(ref(db, 'users/' + userId), {
      username: name,
      email: email,
      profile_picture: imageUrl,
      gender: gender,
      age: userInfo.age,
      bio: userInfo.bio,
    });
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setHasChanged(true); 
    setUserInfo(prevState => ({
      ...prevState,
      [name]: value
    }));
    if (name === 'gender') {
      setGenderSelected(true);
      if (value === 'other') {
        setCustomGender('');
      } else {
        setUserInfo(prevState => ({
          ...prevState,
          gender: value
        }));
      }
    }
  };

  const handleCustomGenderChange = (event) => {
    setHasChanged(true); 
    setCustomGender(event.target.value);
  };


  const handleSubmit = (event) => {
    event.preventDefault();
    if (!hasChanged) {
      setIsEditing(false);
      console.log("No changes made.");
      return;
    }

    if (getAuth().currentUser) {
      const updatedGender = userInfo.gender === 'other' && customGender ? customGender : userInfo.gender;
      const updatedUserInfo = { ...userInfo, gender: updatedGender };
      setUserInfo(updatedUserInfo);

      writeUserData(getAuth().currentUser.uid, updatedUserInfo.name, updatedUserInfo.email, profilePic, updatedGender);

      setIsEditing(false);
      setShowModal(true);
      console.log("User information saved successfully.");
      setHasChanged(false); 
    }
  };


  return (
    <main className="profile-page-container">
      <div className="container-1">
        <section className="main-body">
          <div className='profile-content'>
            <div className='profile-main'>
              <form onSubmit={handleSubmit}>
                <div className="profile-sidebar">
                  <img src={profilePic} id="profile-picture" alt="Profile" className='profile-image' />
                  <input type="file" accept="image/jpeg, image/png, image/jpg"
                    id="imageUploadInput"
                    onChange={handleImageChange}
                    className="hidden-input" />
                  <label htmlFor="imageUploadInput"
                    className={`btn btn-sm ${isEditing ? 'btn-secondary' : 'btn-disabled'} me-2`}
                    onClick={(e) => {
                      if (!isEditing) {
                        e.preventDefault();
                      }
                    }}>
                    Choose Image
                  </label>
                </div>
                <input type="text" placeholder="Name" name="name" value={userInfo.name} onChange={handleChange} disabled={!isEditing} />

                <select name="gender" value={userInfo.gender === 'other' && customGender ? 'other' : userInfo.gender} onChange={handleChange} className={genderSelected ? "gender-selected" : ""} disabled={!isEditing}>
                  <option value="" disabled>Select your gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
                {userInfo.gender === 'other' && (
                  <input type="text" placeholder="Please specify" name="customGender" value={customGender} onChange={handleCustomGenderChange} disabled={!isEditing} />
                )}

                <input type="number" placeholder="Age" name="age" value={userInfo.age} onChange={handleChange} disabled={!isEditing} />
                <input type="email" placeholder="Email" name="email" value={userInfo.email} onChange={handleChange} disabled={!isEditing} />
                <div className='profile-bio'>
                  <textarea className='bio' placeholder="Write whatever you want to share about!" name="bio" value={userInfo.bio} onChange={handleChange} disabled={!isEditing}></textarea>
                </div>
              </form>
            </div>
            {isEditing ? (
              <button id='btn1' type="submit" className="save-button" onClick={handleSubmit}>Save</button>
            ) : (
              <button id='btn1' type="button" onClick={() => setIsEditing(true)} className="edit-button">Edit</button>
            )}
          </div>
        </section>
      </div>
      <saveConfirmation isOpen={showModal} onClose={handleSubmit} />
    </main>
  );
}

export default AccountPage;
