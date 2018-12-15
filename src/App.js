import React, { Component } from 'react';
import './App.css';
import TicketHistory from './TicketHistory';
import PurchaseTickets from './PurchaseTickets';
import {
  Route,
  NavLink,
  HashRouter
} from "react-router-dom";

class NavButton extends React.Component {
  handleClick() {
  
  }

  render() {
    return (
      <button onClick={this.handleClick}>
        {this.props.name}
      </button>
    );
  }
}

class TicketSelection extends React.Component {
  render() {
    return <p>ticket selection view</p>;
  }
}

const views = Object.freeze({
  HOME: 1,
  PURCHASING: 2,
  HISTORY: 3,
});

class App extends Component {
  constructor(props) {
    super(props);
    this.state = { view: views.HOME }
  }

  changeView(newView) {
    this.setState({
      view: newView
    });
  }

  handleClick() {
  
  }

  render() {
    return (
      <HashRouter>
        <div className="App">
          <header className="App-header">
            <button onClick={() => this.changeView(views.HOME)}>
              <p>Home</p>
            </button>
            <button onClick={() => this.changeView(views.PURCHASING)}>
              <p>Purchase Tickets</p>
            </button>
            <button onClick={() => this.changeView(views.HISTORY)}>
              <p>Ticket History</p>
            </button>
            { this.state.view === views.HOME && (
              <p>HOME</p>
            )}
            { this.state.view === views.PURCHASING && (
              <p>PURCHASING</p>
            )}
            { this.state.view === views.HISTORY && (
              <p>HISTORY</p>
            )}
          </header>
        </div>
      </HashRouter>
    );
  }
}

export default App;
