import React from 'react';

import Select from 'react-select';

import moment from 'moment';

export default class WalletTx extends React.Component {

    constructor(props) {
      super(props);
      this.state = {
        hotelNames: {}
      }
    }

    componentWillMount() {
      this.props.loadTxs();
    }

    async getHotelInfo(hotelAddr) {
      var self = this;
      var hotelInstance = Utils.getInstance('Hotel', hotelAddr, {web3: self.props.web3});
      let hotelNames = self.state.hotelNames;
      hotelNames[hotelAddr] = await hotelInstance.methods.name().call();
      self.setState({ hotelNames: hotelNames });
    }

    render() {
      let self = this;
      return(
        <div class="card">
          <div class="card-header">
            <h3 class="mb-0">Transactions</h3>
          </div>
          <div class="card-body">
            {self.props.walletTxs &&
            <div>
            <table class="table table-striped table-hover">
              <thead>
                <tr>
                  <th>Hotel Name</th>
                  <th>Action</th>
                  <th>Lif Amount</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {self.props.walletTxs.map(function(tx, i){
                    if(tx.hotel && !self.state.hotelNames[tx.hotel])
                      self.getHotelInfo(tx.hotel);
                    return (
                      <tr key={'tx'+i} class="pointer">
                        <td>{tx.hotel ? self.state.hotelNames[tx.hotel] : ''}</td>
                        <td>{tx.method.name}</td>
                        <td>{tx.lifAmount ? self.props.web3.utils.fromWei(tx.lifAmount, 'ether').toString() : ''}</td>
                        <td>{moment.unix(Number(tx.timeStamp)).format('YYYY MM DD h:mm A')}</td>
                      </tr>
                    );
                })}
              </tbody>
            </table>
          </div>}
          </div>
          </div>
      );
    }

}
