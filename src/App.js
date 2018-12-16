import React, { Component } from 'react';
import './App.css';

// NOTE: Readville and Anderson/Woburn each have 2 entries.
// Each stop should only have a single entry with all lines that pass through it.
const CR_DATA = require('./commuterrail-data.json');
// e.g. { Wilmington: <Set>[CR-Haverhill, CR-Lowell], ... }
const CR_LINES = {};
// e.g. { [CR-Haverhill: <Set>[Wilmington, Wyoming Hill, ...], ... }
const CR_STOPS = {};
CR_DATA.forEach(({route, line: lines}) => {
  lines.forEach(line => {
    if (!CR_LINES[line]) {
      CR_LINES[line] = new Set([route]);
    } else {
      CR_LINES[line].add(route);
    }
    if (!CR_STOPS[route]) {
      CR_STOPS[route] = new Set([line]);
    } else {
      CR_STOPS[route].add(line);
    }
  });
});

class CommuterRailStopsList extends React.Component {
  render() {
    return (
      <div>
        { this.props.selections[this.props.type] && (
          <div>
            <button onClick={() => this.props.updateSelection(null)}>
              Reset selection
            </button>
            <p>selected {this.props.selections[this.props.type]}</p>
          </div>
        ) || (
          <div>
            <p>Select a {this.props.type} stop</p>
            <ul>
              {
                [...new Set([].concat(...
                  (this.props.selections[this.props.altType]
                    ? [...(CR_STOPS[this.props.selections[this.props.altType]])]
                    : Object.keys(CR_LINES)
                  ).map(line => [...CR_LINES[line]])
                ))]
                .filter(item => item !== this.props.selections[this.props.altType])
                .sort()
                .map(stop =>
                  <li onClick={() => this.props.updateSelection(stop)} >
                    {stop}
                  </li>
                )
              }
            </ul>
          </div>
        )}
      </div>
    );
  }
}

class TicketPurchaseMain extends React.Component {
  constructor(props) {
    super(props);
    this.views = {
      PURCHASING: 0,
      CONFIRMATION: 1,
    };
    this.state = {
      selectedOrigin: null,
      selectedDestination: null,
      view: this.views.PURCHASING,
    };
  }

  selectOrigin(origin) {
    this.setState({
      selectedOrigin: origin,
    });
  }

  selectDestination(destination) {
    this.setState({
      selectedDestination: destination,
    });
  }

  purchaseTicket() {
    this.props.purchaseTicket(this.state.selectedOrigin, this.state.selectedDestination);
    this.setState({
      selectedOrigin: null,
      selectedDestination: null,
    })
  }

  changeView(newView) {
    this.setState({
      view: newView,
    });
  }

  render() {
    return (
      <div>
        {(this.state.view === this.views.PURCHASING) && (
          <div>
            <TicketSelection
              selectDestination={this.selectDestination.bind(this)}
              selectOrigin={this.selectOrigin.bind(this)}
              context={{
                selectedOrigin: this.state.selectedOrigin,
                selectedDestination: this.state.selectedDestination,
              }}/>
            {this.state.selectedOrigin && this.state.selectedDestination && (
              <div>
                <button onClick={() => this.changeView(this.views.CONFIRMATION)}>
                  Purchase Ticket
                </button>
              </div>
            )}
          </div>
        )}
        {(this.state.view === this.views.CONFIRMATION) &&
          <div>
            <button onClick={() => this.changeView(this.views.PURCHASING)}>
              Change Selections
            </button>
            <button onClick={() => {
              this.purchaseTicket();
              return this.changeView(this.views.PURCHASING);
            }}>
              Purchase
            </button>
            <TicketConfirmation
              context={{
                origin: this.state.selectedOrigin,
                destination: this.state.selectedDestination,
              }} />
          </div>
        }
      </div>
    );
  }
}

class TicketSelection extends React.Component {
  render() {
    return (
      <div>
        <p>ticket selection view</p>
        <div style={{display:'flex', 'flex-direction':'row'}}>
          <CommuterRailStopsList
            type='origin'
            altType='destination'
            selections={{
              origin: this.props.context.selectedOrigin,
              destination: this.props.context.selectedDestination }}
            updateSelection={this.props.selectOrigin.bind(this)} />
          <CommuterRailStopsList
            type='destination'
            altType='origin'
            selections={{
              origin: this.props.context.selectedOrigin,
              destination: this.props.context.selectedDestination }}
            updateSelection={this.props.selectDestination.bind(this)} />
        </div>
      </div>
    )
  }
}

class TicketConfirmation extends React.Component {
  render() {
    return (
      <div>
        <p>ticket confirmation view</p>
        <p>origin: {this.props.context.origin}</p>
        <p>destination: {this.props.context.destination}</p>
      </div>
    );
  }
}

class PurchaseHistory extends React.Component {
  render() {
    return (
      <div>
        <p>purchase history view</p>
        <ul>
          {this.props.purchases.map(purchase =>
            <li>{`origin: ${purchase.origin} | destination: ${purchase.destination}`}</li>
          )}
        </ul>
      </div>
    );
  }
}

class App extends Component {
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
    console.log(`inside purchaseTicket: origin: '${origin}'`);
    this.setState({
      purchases: this.state.purchases.concat([{ origin, destination }]),
    });
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          { this.state.view === this.views.HOME && (
            <div>
              <button onClick={() => this.changeView(this.views.PURCHASING)}>
                Purchase Tickets
              </button>
              <button onClick={() => this.changeView(this.views.HISTORY)}>
                Ticket History
              </button>
            </div>
          )}
          { this.state.view === this.views.PURCHASING && (
            <div>
              <button onClick={() => this.changeView(this.views.HOME)}>
                Home
              </button>
              <TicketPurchaseMain
                purchaseTicket={this.purchaseTicket.bind(this)}
                changeView={this.changeView.bind(this)}
                view={this.views.CONFIRMATION} />
            </div>
          )}
          { this.state.view === this.views.HISTORY && (
            <div>
              <button onClick={() => this.changeView(this.views.HOME)}>
                Home
              </button>
              <PurchaseHistory purchases={this.state.purchases} />
            </div>
          )}
        </header>
      </div>
    );
  }
}

export default App;
