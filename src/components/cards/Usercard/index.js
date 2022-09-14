import React from "react";
import './card.css'

export default function Card(props) {
    const {popupCard}=props
    if (!popupCard) return <></>
  return (
    <div className="card">
      <div className="card-header">
        <div className="card-title-group">
          <h5 className="card-title">{popupCard.title}</h5>
          <div className="card-date">{popupCard.extendedProps.title}</div>
        </div>
      </div>
      <hr/>
      <div className="card-text">{popupCard.extendedProps.telephoneNumber}</div>
      <div className="card-like-bar">
        <div className="like-text">
          описание
        </div>
      </div>
    </div>
  );
}