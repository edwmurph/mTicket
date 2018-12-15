import React, { Component } from 'react';
import './App.css';
import TicketHistory from './TicketHistory';
import PurchaseTickets from './PurchaseTickets';
import {
  Route,
  NavLink,
  HashRouter
} from "react-router-dom";

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

class NavButton extends React.Component {
  render() {
    return (
      <button onClick={() => this.props.changeView(this.props.view)}>
        {this.props.name}
      </button>
    );
  }
}

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

  render() {
    return (
      <HashRouter>
        <div className="App">
          <header className="App-header">
            <NavButton name='Home' changeView={this.changeView.bind(this)} view={views.HOME} />
            <NavButton name='Purchase Tickets' changeView={this.changeView.bind(this)} view={views.PURCHASING} />
            <NavButton name='Ticket History' changeView={this.changeView.bind(this)} view={views.HISTORY} />
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
