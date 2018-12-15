import React, { Component } from 'react';
import './App.css';

class TicketSelection extends React.Component {
  render() {
    return <p>ticket selection view</p>;
  }
}

class PurchaseHistory extends React.Component {
  render() {
    return <p>purchase history view</p>;
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
      <div className="App">
        <header className="App-header">
          { this.state.view === views.HOME && (
            <div>
              <NavButton name='Purchase Tickets' changeView={this.changeView.bind(this)} view={views.PURCHASING} />
              <NavButton name='Ticket History' changeView={this.changeView.bind(this)} view={views.HISTORY} />
            </div>
          )}
          { this.state.view === views.PURCHASING && (
            <div>
              <NavButton name='Home' changeView={this.changeView.bind(this)} view={views.HOME} />
              <TicketSelection />
            </div>
          )}
          { this.state.view === views.HISTORY && (
            <div>
              <NavButton name='Home' changeView={this.changeView.bind(this)} view={views.HOME} />
              <PurchaseHistory />
            </div>
          )}
        </header>
      </div>
    );
  }
}

export default App;
