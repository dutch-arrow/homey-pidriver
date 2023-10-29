'use strict';

const Homey = require('homey');
const axios = require('axios');

class PiApp extends Homey.App {

  /**
   * onInit is called when the app is initialized.
   */
  async onInit() {
    this.log('PiApp has been initialized');

    const discoveryStrategy = this.homey.discovery.getStrategy("pi");
 
    // Use the discovery results that were already found
    const initialDiscoveryResults = discoveryStrategy.getDiscoveryResults();
    for (const discoveryResult of Object.values(initialDiscoveryResults)) {
      this.ipaddress = discoveryResult.address;
    }

    // And listen to new results while the app is running
    discoveryStrategy.on("result", discoveryResult => {
      this.ipaddress = discoveryResult.address;
    });

    const cardConditionAvailable = this.homey.flow.getConditionCard('available');
    cardConditionAvailable.registerRunListener(() => {
      return this.ipaddress !== '0.0.0.0';
    });

    const cardActionSendData = this.homey.flow.getActionCard('send-data');
    cardActionSendData.registerRunListener(async (data) => {
      await axios.post('http://' + this.ipaddress + ':1880/metric', data);
    });
  }

  async sendMetric(body) {
    this.log("Pi sent me data: ", body);
    this.homey.drivers.getDriver('pidriver').getDevices()[0].setCapabilityValue("data-offered", JSON.stringify(body));
  }
}

module.exports = PiApp;

