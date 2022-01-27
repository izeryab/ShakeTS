# ShakeTS
small library to detect shake in mobile devices

## How to use this
Create Method like:

`
 detectShake() {
    var myShakeEvent = new Shake();
    
    // Start listening to device motion
    myShakeEvent.start();

    // Register a shake event listener on window with your callback
    window.addEventListener("shake", shakeEventDidOccur, false);

    //function to call when shake occurs
    function shakeEventDidOccur() {
     // myShakeEvent.reset();
     //do something on shake
     console.log("Shake Occur");
    }
  }`
  
FOR IOS we may require permission to access device motion sensor (using user action)
 ` window.document.onclick = function () {
          if (
            typeof (DeviceMotionEvent as any).requestPermission()
              .requestPermission === "function"
          ) {
            (DeviceMotionEvent as any)
              .requestPermission()
              .then((permissionState) => {
                if (permissionState === "granted") {
                 detectShake();
                }
              })
              .catch(console.error);
          } else {
            // handle regular non iOS 13+ devices
            detectShake();
          }
        };`
        
  For Android device simply use detectshake method
  
