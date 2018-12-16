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

const VIEWS = Object.freeze({
  HOME: 1,
  PURCHASING: 2,
  HISTORY: 3,
  CONFIRMATION: 4,
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
    this.state = {
      selectedOrigin: null,
      selectedDestination: null,
      view: VIEWS.PURCHASING,
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

  changeView(newView) {
    this.setState({
      view: newView,
    });
  }

  render() {
    return (
      <div>
        {(this.state.view === VIEWS.PURCHASING) && (
          <div>
            <TicketSelection
              selectDestination={this.selectDestination.bind(this)}
              selectOrigin={this.selectOrigin.bind(this)}
              context={{
                selectedOrigin: this.state.selectedOrigin,
                selectedDestination: this.state.selectedDestination,
              }}/>
            {this.state.selectedOrigin && this.state.selectedDestination && (
              <NavButton
                name='Purchase Ticket'
                changeView={this.changeView.bind(this)}
                view={VIEWS.CONFIRMATION}
                context={{origin: this.selectedOrigin, destination: this.selectedDestination}} />
            )}
          </div>
        )}
        {(this.state.view === VIEWS.CONFIRMATION) &&
          <TicketConfirmation
            context={{
              origin: this.state.selectedOrigin,
              destination: this.state.selectedDestination,
            }} />
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
    return <p>purchase history view</p>;
  }
}

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
    this.state = { view: VIEWS.HOME }
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
          { this.state.view === VIEWS.HOME && (
            <div>
              <NavButton name='Purchase Tickets' changeView={this.changeView.bind(this)} view={VIEWS.PURCHASING} />
              <NavButton name='Ticket History' changeView={this.changeView.bind(this)} view={VIEWS.HISTORY} />
            </div>
          )}
          { this.state.view === VIEWS.PURCHASING && (
            <div>
              <NavButton name='Home' changeView={this.changeView.bind(this)} view={VIEWS.HOME} />
              <TicketPurchaseMain changeView={this.changeView.bind(this)} view={VIEWS.CONFIRMATION}/>
            </div>
          )}
          { this.state.view === VIEWS.HISTORY && (
            <div>
              <NavButton name='Home' changeView={this.changeView.bind(this)} view={VIEWS.HOME} />
              <PurchaseHistory />
            </div>
          )}
          { this.state.view === VIEWS.CONFIRMATION && (
            <div>
              <NavButton name='Cancel' changeView={this.changeView.bind(this)} view={VIEWS.PURCHASING} />
              <TicketConfirmation />
            </div>
          )}
        </header>
      </div>
    );
  }
}

export default App;
