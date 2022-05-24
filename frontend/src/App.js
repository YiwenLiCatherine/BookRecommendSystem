import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Register from './pages/auth/Register'
import Login from './pages/auth/Login'
import BookDetail from './pages/BookDetail'
import TermsCondition from './pages/auth/TermsCondition'
import DashBoard from './pages/DashBoard/DashBoard'
import Collections from './pages/Collections'
import Collection from './pages/Collection'
import UserProfile from './pages/UserProfile'
import BookDemo from './components/BookDemo'
import LeaderBoard from './pages/LeaderBoard/Leaderboard'
import SearchBar from './components/SearchBar'
import SearchBookPage from './pages/SearchBookPage'
import SearchUserPage from './pages/SearchUserPage'
import SearchAuthorPage from './pages/SearchAuthorPage'


function App() {

  const [isLoggedIn, setLoggedIn] = useState(false);
  const [currUsername, setCurrUsername] = useState("");

  useEffect(() => {
    console.log(localStorage)
    if(localStorage.getItem("isLoggedIn") === 'true' && localStorage.getItem("username").length > 0){
      setLoggedIn(true);
      setCurrUsername(localStorage.getItem("username"));
      console.log("App: isLoggedIn true")
    }
    else{
      setLoggedIn(false);
      setCurrUsername("");
      console.log("App: isLoggedIn false")
    }
  }, [])

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="*"
          element={<Navigate to="/" />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login isLoggedIn={isLoggedIn} setLoggedIn={setLoggedIn} currUsername={currUsername} setCurrUsername={setCurrUsername}/>} />
        <Route path="/termsCondition" element={<TermsCondition />} />
        <Route path="/" element={<DashBoard isLoggedIn={isLoggedIn} setLoggedIn={setLoggedIn} currUsername={currUsername} setCurrUsername={setCurrUsername}/>} />
        <Route path="/userprofile" element={<UserProfile isLoggedIn={isLoggedIn} currUsername={currUsername}/>}>
          <Route path=":username" element={<UserProfile isLoggedIn={isLoggedIn} currUsername={currUsername}/>} />
        </Route>
        <Route path="/collections" element={<Collections isLoggedIn={isLoggedIn} currUsername={currUsername}/>} />
        <Route path="/searchbook" element={<SearchBookPage isLoggedIn={isLoggedIn} />}>
          <Route path=":bookTitle" element={<SearchBookPage isLoggedIn={isLoggedIn} />} />
        </Route>
        <Route path="/searchauthor" element={<SearchAuthorPage isLoggedIn={isLoggedIn} />}>
          <Route path=":bookAuthor" element={<SearchAuthorPage isLoggedIn={isLoggedIn} />} />
        </Route>
        <Route path="/searchuser" element={<SearchUserPage isLoggedIn={isLoggedIn} />}>
          <Route path=":username" element={<SearchUserPage isLoggedIn={isLoggedIn} />} />
        </Route>
        <Route path="/leaderboard" element={<LeaderBoard isLoggedIn={isLoggedIn} currUsername={currUsername}/>} />
        <Route path="/collection" element={<Collection isLoggedIn={isLoggedIn} currUsername={currUsername}/>}>
          <Route path=":collectionName" element={<Collection isLoggedIn={isLoggedIn} currUsername={currUsername}/>} />
        </Route>
        <Route path="/book" element={<BookDetail isLoggedIn={isLoggedIn} currUsername={currUsername}/>}>
          <Route path=":bookId" element={<BookDetail isLoggedIn={isLoggedIn} currUsername={currUsername}/>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
