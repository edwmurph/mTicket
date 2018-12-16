import React from 'react';
const UUID = require('uuid');

// NOTE: Readville and Anderson/Woburn each have 2 entries in commuterrail-data.json
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
        {
          ( this.props.selections[this.props.type] && (
            <div>
              <p>Selected {this.props.type}:</p>
              <p>{this.props.selections[this.props.type]}</p>
              <button className='undo-button' onClick={() => this.props.updateSelection(null)}>
                Undo selection
              </button>
            </div>
          ))

          || (
            <div>
              <p>Select a {this.props.type} stop:</p>
              <ul class="ticket-selection">
                {
                  // only show stops on the same line as the other selection
                  [...new Set([].concat(
                    ...(
                      this.props.selections[this.props.altType]
                        ? [...(CR_STOPS[this.props.selections[this.props.altType]])]
                        : Object.keys(CR_LINES)
                    ).map(line => [...CR_LINES[line]])
                  ))]
                  // filter out the other selection if it exists
                  .filter(item => item !== this.props.selections[this.props.altType])
                  // display stops in alphabetical order
                  .sort()
                  .map(stop =>
                    <li class="ticket-selection" key={UUID.v1()} onClick={() => this.props.updateSelection(stop)} >
                      {stop}
                    </li>
                  )
                }
              </ul>
            </div>
          )
        }
      </div>
    );
  }
}


class TicketSelection extends React.Component {
  render() {
    return (
      <div style={{display:'flex', flexDirection:'row'}}>
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
    )
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
                <button className='continue-button' onClick={() => this.changeView(this.views.CONFIRMATION)}>
                  Continue ⟶
                </button>
              </div>
            )}
          </div>
        )}

        {(this.state.view === this.views.CONFIRMATION) &&
          <div>
            <p>Are you sure you want to purchase this ticket?</p>
            <p>{this.state.selectedOrigin} → {this.state.selectedDestination}</p>
            <button className='custom-button' onClick={() => this.changeView(this.views.PURCHASING)}>
              Change selections
            </button>
            <button
              className='custom-button'
              onClick={() => {
                this.purchaseTicket();
                this.props.notify('Purchase successful!');
                return this.changeView(this.views.PURCHASING);
              }}>
              Purchase
            </button>
          </div>
        }
      </div>
    );
  }
}

export default TicketPurchaseMain;
