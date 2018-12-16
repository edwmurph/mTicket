import React from 'react';
const UUID = require('uuid');

class PurchaseHistory extends React.Component {
  render() {
    return (
      <div>
        <p>Purchase history</p>
        <ul class="purchase-history">
          {this.props.purchases.map(purchase =>
            <li class="purchase-history" key={UUID.v1()}>
              {`${purchase.origin} → ${purchase.destination}`}
            </li>
          )}
        </ul>
      </div>
    );
  }
}

export default PurchaseHistory;
