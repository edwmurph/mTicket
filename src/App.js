import React from 'react';

import { ToastContainer, toast } from 'react-toastify';

import 'react-toastify/dist/ReactToastify.css';
import './App.css';

import TicketPurchaseMain from './ticketPurchase.js';
import PurchaseHistory from './purchaseHistory.js';


class App extends React.Component {
  constructor(props) {
    super(props);
    this.views = {
      HOME: 0,
      PURCHASING: 1,
      HISTORY: 2,
    };
    this.state = {
      view: this.views.HOME,
      purchases: [],
    }
  }

  changeView(newView) {
    this.setState({
      view: newView
    });
  }

  purchaseTicket(origin, destination) {
    this.setState({
      purchases: this.state.purchases.concat([{ origin, destination }]),
    });
  }

  notify(msg){
    if (msg) {
      toast(msg);
    }
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <ToastContainer autoClose={3000} />

          { this.state.view === this.views.HOME && (
            <div>
              <img src="mbta.png" alt="mbta logo" />
              <button className='custom-button' onClick={() => this.changeView(this.views.PURCHASING)}>
                Purchase Tickets
              </button>
              <button className='custom-button' onClick={() => this.changeView(this.views.HISTORY)}>
                Ticket History
              </button>
            </div>
          )}

          { this.state.view === this.views.PURCHASING && (
            <div>
              <img src="mbta_icon_back.png" alt="Home" className="home-button" onClick={() => this.changeView(this.views.HOME)}/>
              <TicketPurchaseMain
                purchaseTicket={this.purchaseTicket.bind(this)}
                notify={this.notify.bind(this)}
                changeView={this.changeView.bind(this)}
                view={this.views.CONFIRMATION} />
            </div>
          )}

          { this.state.view === this.views.HISTORY && (
            <div>
              <img src="mbta_icon_back.png" alt="Home" className="home-button" onClick={() => this.changeView(this.views.HOME)}/>
              <PurchaseHistory purchases={this.state.purchases} />
            </div>
          )}
        </header>
      </div>
    );
  }
}

export default App;
