import './css/App.css';
import React from 'react';
import { type } from '@testing-library/user-event/dist/type';

class App extends React.Component {
  constructor(props) {
    super(props);
    
    this.state = {
      deck: [],
      dealer: null,
      player: null,
      disable:false,
      gameOver: false,
      message: null,
      isDisabled:false,
    };
    
    //this.setState({divcontainer:false})
  }


  
  startGame(){
    
    this.setState({
      divcontainer:!this.state.divcontainer,
      isDisabled: true
    });
  }

  


  generateDeck() {
    const cards = [2,3,4,5,6,7,8,9,10,'J','Q','K','A'];
    const suits = ['♦','♣','♥','♠'];
    const deck = [];
    for (let i = 0; i < cards.length; i++) {
      for (let j = 0; j < suits.length; j++) {
        deck.push({number: cards[i], suit: suits[j]});
      }
    }
    return deck;
  }
  
  dealCards(deck) {
    const playerCard1 = this.getRandomCard(deck);
    const dealerCard1 = this.getRandomCard(playerCard1.updatedDeck);
    const playerCard2 = this.getRandomCard(dealerCard1.updatedDeck);    
    const playerStartingHand = [playerCard1.randomCard, playerCard2.randomCard];
    const dealerStartingHand = [dealerCard1.randomCard,];
    
    // console.log(playerStartingHand)

    const player = {
      cards: playerStartingHand,
      count: this.getCount(playerStartingHand)
    };
    const dealer = {
      cards: dealerStartingHand,
      count: this.getCount(dealerStartingHand)
    };

    
    return {updatedDeck: playerCard2.updatedDeck, player, dealer};
  }

  startNewGame(type) {

    // this.setState({divcontainer:!this.state.divcontainer})
    if (type === 'continue') {
        if(this.state.deck.length > 2){
          const deck = (this.state.deck.length < 2) ? this.generateDeck() : this.state.deck;
          const { updatedDeck, player, dealer } = this.dealCards(deck);
          this.setState({
            deck: updatedDeck,
            dealer,
            player,
            // currentBet: null,
            //divcontainer:!this.state.divcontainer,
            gameOver: false,
            message: null,
            
          });
        } else {
          this.setState({ message: 'Game over! Please start a new game.' });
        }

    } else {
      const deck = this.generateDeck();
      const { updatedDeck, player, dealer } = this.dealCards(deck);

      this.setState({
        deck: updatedDeck,
        dealer,
        player,
        // wallet: 100,
        // inputValue: '',
        // currentBet: null,
        //divcontainer:!this.state.divcontainer,
        gameOver: false,
        message: null,
        
        
      });
    }
  }
       
  getRandomCard(deck) {
    const updatedDeck = deck;
    const randomIndex = Math.floor(Math.random() * updatedDeck.length);
    const randomCard = updatedDeck[randomIndex];
    updatedDeck.splice(randomIndex, 1);
    return { randomCard, updatedDeck };
  }
  
  // placeBet() {
  //   const currentBet = this.state.inputValue;

  //   if (currentBet > this.state.wallet) {
  //     this.setState({ message: 'Insufficient funds to bet that amount.' });
  //   } else if (currentBet % 1 !== 0) {
  //     this.setState({ message: 'Please bet whole numbers only.' });
  //   } else {
  //     // Deduct current bet from wallet
  //     const wallet = this.state.wallet - currentBet;
  //     this.setState({ wallet, inputValue: '', currentBet });
  //   }
  // }
  
  // hit() {
  //   if (!this.state.gameOver) 
  //   {

  //       const { randomCard, updatedDeck } = this.getRandomCard(this.state.deck);
  //       const player = this.state.player;
  //       player.cards.push(randomCard);
  //       player.count = this.getCount(player.cards);

  //       if (player.count > 21) 
  //       {
  //         this.setState({ player, gameOver: true, message: 'BUST!' });
  //       } 
  //       else 
  //       {
  //         this.setState({ deck: updatedDeck, player });
  //       }
  //   } 
  
  //   else 
  
  //   {
  //     this.setState({ message: 'Game over! Please start a new game.' });
  //   }
  // }


  
  dealerDraw(dealer, deck) {
    const { randomCard, updatedDeck } = this.getRandomCard(deck);
    dealer.cards.push(randomCard);
    dealer.count = this.getCount(dealer.cards);
    return { dealer, updatedDeck };
  }
  
  getCount(cards) {
    const rearranged = [];
    cards.forEach(card => {
      if (card.number === 'A') {
        rearranged.push(card);
      } else if (card.number) {
        rearranged.unshift(card);
      }
      
      
      // (card.number === 'A') ? rearranged.push(card) : rearranged.unshift(card);
    });
    
    return rearranged.reduce((total, card) => {
      if (card.number === 'J' || card.number === 'Q' || card.number === 'K') {
        return total + 10;
      } else if (card.number === 'A') {
        return (total + 11 <= 21) ? total + 11 : total + 1;
      } else {
        return total + card.number;
      }
    }, 0);
  }
  
  check(){
    if (!this.state.gameOver) {


      let dealer = this.state.dealer;

        const winner = this.getWinner(dealer, this.state.player);
        let message;
        
        if (winner === 'player') {
          message = 'You Win';
        } else {
          message = 'Dealer wins...';
        } 
        this.setState({
          // deck, 
          dealer,
          gameOver: true,
          message,
          
        });

        
    } 

}

  fold() {

    if (this.state.deck.length < 2){
      this.setState({ message: 'Game over! Please start a new game.'});
    } else {
      const deck = (this.state.deck.length < 2) ? this.generateDeck() : this.state.deck;
      const { updatedDeck, player, dealer } = this.dealCards(deck);
      this.setState({
        deck: updatedDeck,
        dealer,
        player,
        // currentBet: null,
        //divcontainer:!this.state.divcontainer,
        gameOver: false,
        message: null,
        
      });
    }
    }

  
  getWinner(dealer, player) {
    // dealer card < playercard 1 && dealer card > platyercard 2
    const dealercard = this.state.dealer.cards[0].number;
    const playercard1 = this.state.player.cards[0].number;
    const playercard2 = this.state.player.cards[1].number;

    let p1;
    let p2;
    let d1;

    if(dealercard === 'A'){
      d1 = 1;
    } else if (dealercard === 'J'){
      d1 = 11;
    } else if (dealercard === 'Q'){
      d1 = 12;
    } else if (dealercard === 'K'){
      d1 = 13;
    } else {
      d1 = dealercard
    }

    if(playercard1 === 'A'){
      p1 = 1;
    } else if (playercard1 === 'J'){
      p1 = 11;
    } else if (playercard1 === 'Q'){
      p1 = 12;
    } else if (playercard1 === 'K'){
      p1 = 13;
    } else {
      p1 = playercard1
    }

    if(playercard2 === 'A'){
      p2 = 1;
    } else if (playercard2 === 'J'){
      p2 = 11;
    } else if (playercard2 === 'Q'){
      p2 = 12;
    } else if (playercard2 === 'K'){
      p2 = 13;
    } else {
      p2 = playercard2
    }

    if (p1 > p2){
      const temp = p1;
      const temp1 = p2;

      if(d1 > temp1 && d1 < temp){ 
        return 'player';
      } else {
        return 'dealer';
      } 
    } else {

      if(d1 > p1 && d1 < p2){ 
        return 'player';
      } else {
        return 'dealer';
      } 
    }


  }
  
  inputChange(e) {
    const inputValue = +e.target.value;
    this.setState({inputValue});
  }
  
  handleKeyDown(e) {
    const enter = 13;
    // console.log(e.keyCode);
    
    if (e.keyCode === enter) {
      this.placeBet();
    }
  }
  
  componentWillMount() {
    this.startNewGame();
    const body = document.querySelector('body');
    body.addEventListener('keydown', this.handleKeyDown.bind(this));
  }
  
  render() {
    // delear card 2
    // let dealerCount;
    // const card1 = this.state.dealer.cards[0].number;
    // const card2 = this.state.dealer.cards[1].number;
    // if (card2) {
    //   dealerCount = this.state.dealer.count;
    // } else {
    //   if (card1 === 'J' || card1 === 'Q' || card1 === 'K') {
    //     dealerCount = 10;
    //   } else if (card1 === 'A') {
    //     dealerCount = 11;
    //   } else {
    //     dealerCount = card1;
    //   }
    // }

    
    const x =this.state.divcontainer;
    
    return (
      <div>
        <button className='startBtn' disabled={this.state.isDisabled}
         onClick={ this.startGame.bind(this)}>Start</button>
        {x &&(
        <div className="buttons">
          <button onClick={() => {this.startNewGame()}}>New Game</button>
          <button onClick={() => {this.check()}}>Check</button>
          <button onClick={() => {this.fold()}}>Fold</button>
        </div>
        )}

        {
          this.state.gameOver ?
          <div className="buttons">
            <button onClick={() => {this.startNewGame('continue')}}>Continue</button>
          </div>
          : null
        }
        
        {x &&(
        <div>
        <p>Your Hand</p>
        <table className="cards">
          <tr>
            { this.state.player.cards.map((card, i) => {
              return <Card key={i} number={card.number} suit={card.suit}/>
            }) }
          </tr>
        </table>
        
        <p>Dealer's Hand </p>
        <table className="cards">
          <tr>
            { this.state.dealer.cards.map((card, i) => {
              return <Card key={i} number={card.number} suit={card.suit}/>;
            }) }
          </tr>
        </table>
        
        <p>{ this.state.message }</p>
        </div>)}
      </div>
    );
  }
};

const Card = ({ number, suit }) => {
  const combo = (number) ? `${number}${suit}` : null;
  const color = (suit === '♦' || suit === '♥') ? 'card-red' : 'card';
  
  return (
    <td>
      <div className={color}>
        { combo }
      </div>
    </td>
  );
};


export default App;
