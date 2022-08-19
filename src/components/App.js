import React, {useEffect, useState} from 'react';
import Header from './Header';
import Main from './Main';
import Footer from './Footer';
import ImagePopup from "./ImagePopup";
import api from "../utils/api";
import AddPlacePopup from "./AddPlacePopup"
import EditAvatarPopup from "./EditAvatarPopup";
import EditProfilePopup from "./EditProfilePopup";
import { CurrentUserContext } from "../contexts/CurrentUserContext";

function App() {
  const [isProfilePopupOpened, setIsProfilePopupOpened] = useState(false)
  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = useState(false);
  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = useState(false);
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);
  const [currentUser, setCurrentUser] = useState({});
  const [cards, setCards] = useState([]);

  useEffect(() => {
    Promise.all([api.getUserInfo(), api.getInitialCards()])
    .then(([user, cards]) => {
      setCurrentUser(user);
      setCards(cards);
    })
    .catch((err) => {
      console.error(err);
    });
  }, []);

  function handleUpdateUser(data) {
    api.updateUserInfo(data)
    .then((newUser) => {
      setCurrentUser(newUser);
      closeAllPopups();
    })
    .catch((err) => {
      console.error(err);
    });
  }

  function handleCardLike(card) {
    const isLiked = card.likes.some(
      (userWhoLiked) => userWhoLiked._id === currentUser._id
    );
    api
      .changeLikeCardStatus(card, !isLiked)
      .then((cardWithChangedLike) => {
        setCards(
          cards.map((cardFromState) =>
            cardFromState._id === card._id ? cardWithChangedLike : cardFromState
          )
        );
      })
      .catch((err) => {
        console.error(err);
      });
  }

  function handleAddPlaceSubmit(data) {
    api.addNewCard(data)
    .then((newCard) => {
      setCards([newCard, ...cards]);
      closeAllPopups();
    })
    .catch((err) => {
      console.error(err);
    });
  }

  function handleCardDelete(card) {
    api.removeCard(card)
    .then(() => {
      setCards((items) => items.filter((c) => c._id !== card._id));
    })
    .catch((err) => {
      console.error(err);
    });
  }

  function handleAvatarUpdate(data) {
    api.updateProfileAvatar(data)
    .then((newAvatar) => {
      setCurrentUser(newAvatar);
      closeAllPopups();
    })
    .catch((err) => {
      console.error(err);
    });
  }


  function handleEditAvatarClick() {
    setIsEditAvatarPopupOpen(true);
  }

  function handleEditProfileClick() {
    setIsEditProfilePopupOpen(true);
  }

  function handleAddPlaceClick() {
    setIsAddPlacePopupOpen(true);
  }

  function handleCardClick(card) {
    setSelectedCard(card);
  }

  function handlePopupCloseClick(evt) {
    if (evt.target.classList.contains('popup')) {
      closeAllPopups();
    }
  }

  function closeAllPopups() {
    setIsProfilePopupOpened(false);
    setIsEditAvatarPopupOpen(false);
    setIsEditProfilePopupOpen(false);
    setIsAddPlacePopupOpen(false);
    setSelectedCard(null);
  }

  useEffect(() => {
    if (isProfilePopupOpened || isEditAvatarPopupOpen || isEditProfilePopupOpen || isAddPlacePopupOpen || selectedCard) {
      function handleEsc(evt) {
        if (evt.key === 'Escape') {
          closeAllPopups();
        }
      }
      document.addEventListener('keydown', handleEsc);

      return () => {
        document.removeEventListener('keydown', handleEsc);
      }
    }
  }, [isProfilePopupOpened, isEditAvatarPopupOpen, isEditProfilePopupOpen, isAddPlacePopupOpen, selectedCard]);
  
  return (
    <CurrentUserContext.Provider value={currentUser}>
      <div className="page">
        <div className="page__content">
          <Header />
          <Main 
            onEditAvatar={handleEditAvatarClick}
            onEditProfile={handleEditProfileClick}
            onAddPlace={handleAddPlaceClick}
            onCardClick={handleCardClick}
            cards={cards}
            onCardLike={handleCardLike}
            onCardDelete={handleCardDelete}
          />
          <Footer />

          <EditProfilePopup 
            isOpen={isEditProfilePopupOpen} 
            onCloseClick={handlePopupCloseClick} 
            onClose={closeAllPopups} 
            onSubmit={handleUpdateUser}
          />

          <AddPlacePopup 
            isOpen={isAddPlacePopupOpen} 
            onCloseClick={handlePopupCloseClick} 
            onClose={closeAllPopups} 
            onSubmit={handleAddPlaceSubmit}
          />

          <EditAvatarPopup 
            isOpen={isEditAvatarPopupOpen} 
            onCloseClick={handlePopupCloseClick} 
            onClose={closeAllPopups} 
            onSubmit={handleAvatarUpdate}
          />

          <ImagePopup
            card={selectedCard}
            onCloseClick={handlePopupCloseClick}
            onClose={closeAllPopups}
          />
        </div>
      </div>
      </CurrentUserContext.Provider>
  );
}

export default App;