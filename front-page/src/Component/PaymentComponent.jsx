import { act, useEffect, useState } from 'react'
import '../Styles/Payment.css'
import visaImage from '../gallery/visa.png'
import masterCardImage from '../gallery/masterCard.png'
import { useUser } from './UserProvider'
import { Link } from 'react-router-dom'
import { type } from '@testing-library/user-event/dist/type'
export const PaymentComponent = () => {

    const {user} = useUser();
    const [cardHolderName, setCarHolderName] = useState("");
    const [cardNumber, setCardNumber] = useState("");
    const [exDate, setExDate] = useState("");
    const [typeOfCard, setTypeOfCard] = useState("");
    const [cvv, setCvv] = useState("");
    const [activeCards, setActiveCards] = useState([]);
    const [isVisa, setIsVisa] = useState(false);
    const [isMasterCard, setIsMasterCard] = useState(false);
    const [userCards, setUserCards] = useState([]);
    
    const maskCardNumber = (cardNumber) => {
        // Ukloni razmake
        const clean = cardNumber.replace(/ /g, '');
    
        // Dobavi poslednje 4 cifre
        const lastFour = clean.slice(-4);
    
        // Napravi masku sa * za ostale cifre
        let masked = "";
        for (let i = 0; i < clean.length - 4;i++){
            if (i > 0 && i % 4 === 0){
                masked+=" ";
            }
            masked+="*";
        }
        
        return masked + " " + lastFour; 
    };
    
    const formatCard = (e) => {
        const card = e.target.value;
        const cleanedCard = card.replace(/\s+/g, '').trim();
        let formattedCard = '';
        for (let i = 0; i < cleanedCard.length;i++){
            if (i > 0 && i % 4 === 0){
                formattedCard+=' ';
            }
            formattedCard+=cleanedCard[i];
        }
        setCardNumber(formattedCard);
    }

    const checkTypeOfCard = () => {
        if (cardNumber.charAt(0) === "4"){
            setIsVisa(true);
            setTypeOfCard('Visa')
            setIsMasterCard(false);
        } else if (cardNumber.charAt(0) === "5"){
            setIsMasterCard(true);
            setTypeOfCard('MasterCard')
            setIsVisa(false);
        }
    }

    async function addCardToPayment() {
        if (userCards.length > 2){
            console.log('You can have up to 2 active cards!')
            return;
        }
        const addPayment = {
            userId: user.id || 0,
            cardHolderName: cardHolderName,
            cardNumber: cardNumber,
            exDate: exDate,
            typeOfCard: typeOfCard,
            cvv: cvv
        }
        try {
            const response = await fetch('http://localhost:8080/api/addPayment', {
                method: 'POST',
                headers: {
                    "Content-type": "application/json"
                },
                body: JSON.stringify(addPayment),
                credentials: 'include'
            })
            if (response.ok){
                fetchAddedCard();
                console.log('Your card has been added!')
            } else {
                console.log('Error happen while trying to add your card!')
            }
        } catch (error) {
            console.log('Error happen, ', error)
        }
    }
    async function fetchAddedCard() {
        try {
            const response = await fetch(`http://localhost:8080/api/getYourPayments/${user.id}`, {
                method: 'GET',
                credentials: 'include'
            })
            if (response.ok){
                const data = await response.json();
                setUserCards(data.slice(0,2));
            }else {
                console.log('Error happen while trying to fetch user cards!');
            }
        } catch (error) {
            console.log('Error happen ', error);
        }
    }
    async function removeCard(cardId) {
        try {
            const response = await fetch(`http://localhost:8080/api/removeCard/${cardId}/${user.id}`, {
                method: 'GET',
                credentials: 'include'
            })
            if (response.ok){
                fetchAddedCard();
                console.log("Card has been deleted!");
            } else {
                console.log("Error happen while trying to delete card!");
            }
        } catch (error) {
            console.log("Error happen ", error);
        }
    }
    useEffect(() => {
        setCarHolderName(null); // Resetovanje nakon uspešnog dodavanja
        setCardNumber("");
        setExDate(null);
        setCvv("");
    }, [userCards])
    useEffect(() => {
        if (cardNumber.length === 1){
            checkTypeOfCard();
        } else if (cardNumber.length === 0){
            setIsVisa(false);
            setIsMasterCard(false);
        }
    },[cardNumber])
    useEffect(() => {
        fetchAddedCard();
    }, [user])
    return (
        <div className='payment-page'>
            <div className='topbar-menu'>
                <Link to={'/profileSettings'}>
                <p>Profile</p>
                </Link>
                <Link to={'/notifications'}>
                <p>Notification</p>
                </Link>
                <Link to={'/orders'}>
                <p>Order</p>
                </Link>

            </div>
            <div className='payment-container'>
                <div className='card-information'>
                <input
                 type="text"
                 value={cardHolderName || ""}
                 onChange={(e) => setCarHolderName(e.target.value)}
                 placeholder='Card holder name'
                 />
                 <div className='card-number'>
                <input
                 type="text"
                 maxLength={19}
                 value={cardNumber || ""}
                 onChange={formatCard}
                 placeholder='Card number'
                 />

                 {(isVisa || isMasterCard) && (
                    <img src={isVisa ? visaImage: masterCardImage} alt="photo" />
                 )}
                 </div>
                 <input
                 type="date"
                 value={exDate || ""}
                 onChange={(e) => setExDate(e.target.value)}
                 placeholder='Exp. date'
                 />
                 <input
                 type="text"
                 min={1}
                 value={cvv || ""}
                 maxLength={3}
                 onChange={(e) => setCvv(e.target.value)}
                 placeholder='cvv'
                 />

                 <button
                 className='save-button'
                 onClick={addCardToPayment}
                 >SAVE CARD</button>
            </div>
            
            <div className='available-credit-card'>
                {userCards.length > 0 ? (
                        userCards.map((card,index) => (
                            <div 
                            key={card.id} 
                            className='credit-card'>
                                <div className='details-of-card'>
                                    <p>{card.cardHolderName}</p>
                                    <p>{maskCardNumber(card.cardNumber)}</p>
                                    <div className='ex-date-type-img'>
                                    <p>{new Date(card.exDate).toLocaleDateString()}</p>
                                    {card.typeOfCard === 'Visa' &&(
                                         <img src={visaImage} alt="photo" />
                                        )}
                                        {card.typeOfCard  === 'MasterCard' && (
                                          <img src={masterCardImage} alt="photo" />
                                        )}
                                    </div>
                                </div>
                                <button
                                onClick={() => removeCard(card.id)}
                                className='delete-button'>DELETE CARD</button>
                            </div>
                        ))               
                ): (
                    <p>There will be your cards when you add them.</p>
                )}
            </div>
         </div>
        </div>
    )
}