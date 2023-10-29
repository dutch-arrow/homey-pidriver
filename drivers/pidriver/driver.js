'use strict';

const { Driver } = require('homey');

class PiDriver extends Driver {

  /**
   * onInit is called when the driver is initialized.
   */
  async onInit() {
    this.log('PiDriver has been initialized');
  }

  // async onPair(session) {
  //   // Show a specific view by ID
  //   await session.showView("add_device");

  //   // Received when a view has changed
  //   session.setHandler("showView", async function (viewId) {
  //     if (viewId === "add_device") {
  //       var data = await session.emit("add_device_event", "Hello to you!");
  //       console.log(data);
  //     }
  //   });

  //   session.setHandler("validate", async function (data) {
  //     console.log(data);
  //   });
  // }
  /**
  * onPairListDevices is called when a user is adding a device and the 'list_devices' view is called.
  * This should return an array with the data of devices that are available for pairing.
  */
  async onPairListDevices() {
    const discoveryStrategy = this.getDiscoveryStrategy();
    const discoveryResults = discoveryStrategy.getDiscoveryResults();

    const devices = Object.values(discoveryResults).map(discoveryResult => {
      return {
        name: 'Raspberry Pi',
        data: {
          id: discoveryResult.address,
        },
      };
    });

    return devices;
  }

}

module.exports = PiDriver;

