"use strict";

async function* keepAlive(t) {
    while (true) {
      if (chrome.runtime.lastError) {
        console.log(chrome.runtime.lastError);
        port.disconnect();
        nativeMessaginPort.disconnect();
        break;
      }
      yield new Promise((resolve, reject) => {
        setTimeout(
          () =>
            resolve(
              `ServiceWorker still alive at ${
                (new Date().getTime() - t) / 1000 / 60
              }`
            ),
          1000 * 60 * 4.9
        );
      });
    }
  }

async function eventDriven(t) {
    for await (const _ of keepAlive(t)) {
      console.log("eventDriven", _);
    }
  }
  