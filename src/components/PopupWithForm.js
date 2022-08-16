function PopupWithForm({name, isOpen, form, title, children, onClose, buttonText}) {
  return (
    <div className={`popup popup_form_${name} ${isOpen && `popup_opened`}`}>
      <div className="popup__container">
        <form className="popup__form" name={form}>
          <h2 className="popup__title">{title}</h2>
          {children}
          <button className="popup__btn-save" type="submit" title="Сохранить">{buttonText}</button>
        </form>
        <button className="popup__btn-close" type="button" title="Закрыть" onClick={onClose}/>
      </div>
    </div>
  )
}

export default PopupWithForm;