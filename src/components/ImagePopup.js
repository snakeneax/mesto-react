function ImagePopup({card,onClose}) {
  return (
    <div className={`popup popup_viewer ${card && 'popup_opened'}`}>
      <div className="popup__content">
        <img className="popup__image" src={card?.link} alt={card?.name}/>
        <h2 className="popup__description">{card?.name}</h2>
        <button className="popup__btn-close" type="button" title="Закрыть" onClick={onClose}/>
      </div>
    </div>
  )
}

export default ImagePopup;