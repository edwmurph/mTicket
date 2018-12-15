import React, { Component } from 'react';
import './App.css';

// NOTE: Readville and Anderson/Woburn each have 2 entries.
// Each stop should only have a single entry with all lines that pass through it.
const commuterRailData = require('./commuterrail-data.json');

class CommuterRailStopsList extends React.Component {
  render() {
    return (
      <div>
        <p>Select a {this.props.name} stop</p>
        <ul>
          {commuterRailData.map(stop =>
            <li key='key'>
              {stop.route}
            </li>
          )}
        </ul>
      </div>
    );
  }
}

class TicketSelection extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedOrigin: null,
      selectedDestination: null,
    };
  }

  render() {
    return (
      <div>
      <p>ticket selection view</p>
      <div style={{display:'flex', 'flex-direction':'row'}}>
        <CommuterRailStopsList name='origin'/>
        <CommuterRailStopsList name='destination'/>
      </div>
      </div>
    );
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
