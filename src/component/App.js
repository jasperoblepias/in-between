import './css/App.css';
import React from 'react';
import Flippy, { FrontSide, BackSide } from 'react-flippy';
import Backcard from './images/card.jpg';

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      deck: [],
      dealer: null,
      player: null,
      disable: false,
      gameOver: false,
      message: null,
      isDisabled: false,
      buttonDisable: false,
      buttonEnable: false,
      disableNewGame:false
    };
  }

  //start new game
  startGame() {
    this.setState({
      divcontainer: !this.state.divcontainer,
      isDisabled: true
    });
  }

  //disables button check and fold
  disableButton() {
    this.setState({
      buttonDisable: true
    });
  }

  //enables button check and fold
  enableButton() {
    this.setState({
      buttonDisable: false
    });
  }

  //hide all buttons except new game
    hideRemove(){
    const checkBtn = document.getElementById('check')
    const foldBtn = document.getElementById('fold')
    const continueBtn = document.getElementById('continue')
    checkBtn.classList.remove('hide')
    foldBtn.classList.remove('hide')
    continueBtn.classList.remove('hide')
  }
  
  //add check fold buttons
  addRemove(){
    const checkBtn = document.getElementById('check')
    const foldBtn = document.getElementById('fold')
    const continueBtn = document.getElementById('continue')
    checkBtn.classList.add('hide')
    foldBtn.classList.add('hide')
    continueBtn.classList.add('hide')
  }

  //generates the whole deck
  generateDeck() {
    const cards = [2, 3, 4, 5, 6, 7, 8, 9, 10, 'J', 'Q', 'K', 'A'];
    const suits = ['♦', '♣', '♥', '♠'];
    const deck = [];
    for (let i = 0; i < cards.length; i++) {
      for (let j = 0; j < suits.length; j++) {
        deck.push({ number: cards[i], suit: suits[j] });
      }
    }
    return deck;
  }

  //give 2 cards to player and 1 card to dealer
  dealCards(deck) {
    const playerCard1 = this.getRandomCard(deck);
    
    const dealerCard1 = this.getRandomCard(playerCard1.updatedDeck);
    const playerCard2 = this.getRandomCard(dealerCard1.updatedDeck);
    const playerStartingHand = [playerCard1.randomCard, playerCard2.randomCard];
    const dealerStartingHand = [dealerCard1.randomCard,];

    const player = {
      cards: playerStartingHand
    };
    const dealer = {
      cards: dealerStartingHand
    };


    return { updatedDeck: playerCard2.updatedDeck, player, dealer };
  }

  //checks the status of the game whether the continue button is clicked or not
  startNewGame(type) {

    if (type === 'continue') {
      if (this.state.deck.length > 2) {
        const deck = (this.state.deck.length < 2) ? this.generateDeck() : this.state.deck;
        const { updatedDeck, player, dealer } = this.dealCards(deck);
        this.setState({
          deck: updatedDeck,
          dealer,
          player,
          gameOver: false,
          message: null,

        });
      } else {
        this.setState({
          message: 'Game over! Out of cards. Please start a new game.',
        });
        this.addRemove();

      }
    } else {
      const deck = this.generateDeck();
      const { updatedDeck, player, dealer } = this.dealCards(deck);

      this.setState({
        deck: updatedDeck,
        dealer,
        player,
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

  dealerDraw(dealer, deck) {
    const { randomCard, updatedDeck } = this.getRandomCard(deck);
    dealer.cards.push(randomCard);
    return { dealer, updatedDeck };
  }

  //checks the dealers and players card
  check() {
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
        dealer,
        gameOver: true,
        message,
      });
    }
  }

  //forfeit the card
  fold() {
    this.setState({
      gameOver: true,

    });
  }

  //checks both player and dealers card to get winner
  getWinner(dealer, player) {
    const dealercard = this.state.dealer.cards[0].number;
    const playercard1 = this.state.player.cards[0].number;
    const playercard2 = this.state.player.cards[1].number;

    let p1;
    let p2;
    let d1;

    if (dealercard === 'A') {
      d1 = 1;
    } else if (dealercard === 'J') {
      d1 = 11;
    } else if (dealercard === 'Q') {
      d1 = 12;
    } else if (dealercard === 'K') {
      d1 = 13;
    } else {
      d1 = dealercard
    }

    if (playercard1 === 'A') {
      p1 = 1;
    } else if (playercard1 === 'J') {
      p1 = 11;
    } else if (playercard1 === 'Q') {
      p1 = 12;
    } else if (playercard1 === 'K') {
      p1 = 13;
    } else {
      p1 = playercard1
    }

    if (playercard2 === 'A') {
      p2 = 1;
    } else if (playercard2 === 'J') {
      p2 = 11;
    } else if (playercard2 === 'Q') {
      p2 = 12;
    } else if (playercard2 === 'K') {
      p2 = 13;
    } else {
      p2 = playercard2
    }

    if (p1 > p2) {
      const temp = p1;
      const temp1 = p2;

      if (d1 > temp1 && d1 < temp) {
        return 'player';
      } else {
        return 'dealer';
      }
    } else {

      if (d1 > p1 && d1 < p2) {
        return 'player';
      } else {
        return 'dealer';
      }
    }


  }

  componentWillMount() {
    this.startNewGame();
    const body = document.querySelector('body');
  }

  render() {

    const x = this.state.divcontainer;

    return (
      <div>
        <button className='buttons' id='startBtn' disabled={this.state.isDisabled}
          onClick={this.startGame.bind(this)}>Start</button>
        {x && (
          <div className="buttondiv">
            <button className='buttons' id='newgame' 
            disabled={this.state.buttonDisable}
            onClick={() => { this.startNewGame(); 
            this.hideRemove();
            this.enableButton() }}>
              New Game
              </button>
          </div>
        )}

        {x && (
          <div>

            <p className='dealerHand'>Dealer's Hand </p>
            <table className="cards">
              <tr>
                <Flippy
                  id="flippyIsActivated"
                  ref={(r) => this.flippyHorizontal = r}
                  flipOnHover={false}
                  flipOnClick={false}
                  flipDirection="horizontal">

                  <FrontSide className="cardStyle" animationDuration={300}>
                    <img src={Backcard} alt="this is car image" style={{ width: '105px', height: '150px' }} />
                  </FrontSide>
                  <BackSide className="cardStyle" animationDuration={300}>
                    {this.state.dealer.cards.map((card, i) => {
                      return <CardDealer key={i} number={card.number} suit={card.suit} />
                    })}
                  </BackSide >
                </Flippy>
              </tr>
            </table>
            <p className='message'>{this.state.message}</p>
            <p className='playerHand'>Your Hand</p>
            <table className="cards">
              <tr>
                {this.state.player.cards.map((card, i) => {
                  return <Card key={i} number={card.number} suit={card.suit} />;
                })}
              </tr>
            </table>

            <div className="buttondiv">
              <button
                className='buttons'
                id='check'
                disabled={this.state.buttonDisable}
                onClick={() => {
                  this.check();
                  this.flippyHorizontal.toggle();
                  this.disableButton()
                }}>Check
              </button>

              <button
                className='buttons'
                id='fold'
                disabled={this.state.buttonDisable}
                onClick={() => {
                  this.fold();
                  this.flippyHorizontal.toggle();
                  this.disableButton()
                }}>Fold
              </button>
            </div>

            {
              this.state.gameOver ?

                <div className="buttondiv">
                  <button
                    className='buttons'
                    id='continue'
                    disabled={!this.state.buttonDisable}
                    onClick={() => {
                      this.startNewGame('continue');
                      this.flippyHorizontal.toggle();
                      this.enableButton()
                    }}>Continue
                  </button>
                </div>
                : null
            }

          </div>)}
      </div>
    );
  }
};

const Card = ({ number, suit }) => {
  const combo = (number) ? `${number}${suit}` : null;
  const shape = (number) ? `${suit}` : null;
  const color = (suit === '♦' || suit === '♥') ? 'card-red' : 'card';

  return (
    <td>
      <Flippy
        flipOnHover={true}
        flipOnClick={false}
        flipDirection="horizontal">
        <FrontSide className="cardStyle">
          <img src={Backcard} alt="backcard" style={{ width: '105px', height: '150px' }} />
        </FrontSide>
        <BackSide className="cardStyle">
          <div className={color}>
            <div className="upperleft"> {combo} </div>
            <div className="center"> {shape} </div>
            <div className="bottomright"> {combo} </div>
          </div>
        </BackSide >
      </Flippy>

    </td>
  );
};


const CardDealer = ({ number, suit }) => {
  const combo = (number) ? `${number}${suit}` : null;
  const shape = (number) ? `${suit}` : null;
  const color = (suit === '♦' || suit === '♥') ? 'card-red' : 'card';

  return (
    <td>
      <div className={color}>
        <div className="upperleft"> {combo} </div>
        <div className="center"> {shape} </div>
        <div className="bottomright"> {combo} </div>
      </div>

    </td>
  );
};


export default App;
