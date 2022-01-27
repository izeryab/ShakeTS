interface Document {
  CustomEvent;
}
class Shake {
  protected hasDeviceMotion;
 

  /**  Minimum movement force to consider. */
  protected static MIN_FORCE = (typeof Capacitor!=='undefined')? Capacitor.getPlatform() == "ios"?3:5:5;
    
  /**
   * Minimum times in a shake gesture that the direction of movement needs to
   * change.
   */
  protected static   MIN_DIRECTION_CHANGE = 4;

  /** Maximum pause between movements. */
  protected static   MAX_PAUSE_BETHWEEN_DIRECTION_CHANGE = 1000;

  /** Minimum allowed time for shake gesture. */
  protected static   MIN_TOTAL_DURATION_OF_SHAKE = 4000; // 4 seconds

  /** Time when the gesture started. */
  protected  mFirstDirectionChangeTime = 0;

  /** Time when the last movement started. */
  protected  mLastDirectionChangeTime;

  /** How many movements are considered so far. */
  protected  mDirectionChangeCount = 0;

  /** The last x position. */
  protected  lastX = 0;

  /** The last y position. */
  protected  lastY = 0;

  /** The last z position. */
  protected  lastZ = 0;

  protected event;
  constructor() {
    //feature detect
    this.hasDeviceMotion = "ondevicemotion" in window;
    //create custom event
    if (typeof document.CustomEvent === "function") {
      this.event = new document.CustomEvent("shake", {
        bubbles: true,
        cancelable: true,
      });
    } else if (typeof document.createEvent === "function") {
      this.event = document.createEvent("Event");
      this.event.initEvent("shake", true, true);
    }
  }


  //start listening for devicemotion
  start() {
    this.resetShakeParameters();
    if (this.hasDeviceMotion) {
      window.addEventListener("devicemotion", this, false);
    }
  }

  //stop listening for devicemotion
  stop() {
    if (this.hasDeviceMotion) {
      window.removeEventListener("devicemotion", this, false);
    }
    this.resetShakeParameters();
  }

  //calculates if shake did occur
  devicemotion(e) {
    var current = e.accelerationIncludingGravity;

    // get sensor data
    var x = current.x;
    var y = current.y;
    var z = current.z;

    // calculate movement
    var totalMovement = Math.abs(x + y + z - this.lastX - this.lastY - this.lastZ);

    if (totalMovement > Shake.MIN_FORCE) {

      // get time
      var now = new Date().valueOf();

      // store first movement time
      if (this.mFirstDirectionChangeTime == 0) {
          this.mFirstDirectionChangeTime = now;
          this.mLastDirectionChangeTime = now;
      }

      // check if the last movement was not long ago
      var lastChangeWasAgo = now - this.mLastDirectionChangeTime;
      if (lastChangeWasAgo < Shake.MAX_PAUSE_BETHWEEN_DIRECTION_CHANGE) {

        // store movement data
        this.mLastDirectionChangeTime = now;
        this.mDirectionChangeCount++;

        // store last sensor data 
        this.lastX = x;
        this.lastY = y;
        this.lastZ = z;

        // check how many movements are so far
        if (this.mDirectionChangeCount >= Shake.MIN_DIRECTION_CHANGE) {

          // check total duration
          var totalDuration = now - this.mFirstDirectionChangeTime;
          if (totalDuration >= Shake.MIN_TOTAL_DURATION_OF_SHAKE) {
            window.dispatchEvent(this.event);
            this.resetShakeParameters();
          }
        }

      } else {
        this.resetShakeParameters();
      }
    }
  }
 /**
     * Resets the shake parameters to their default values.
     */
  resetShakeParameters() {
    this.mFirstDirectionChangeTime = 0;
    this.mDirectionChangeCount = 0;
    this.mLastDirectionChangeTime = 0;
    this.lastX = 0;
    this.lastY = 0;
    this.lastZ = 0;
  }
  //event handler
  handleEvent(e) {
    if (typeof this[e.type] === "function") {
      return this[e.type](e);
    }
  }
}
