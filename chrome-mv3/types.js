var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => {
  __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};
(function() {
  "use strict";
  class ExtMessage {
    constructor(messageType) {
      __publicField(this, "content");
      __publicField(this, "from");
      __publicField(this, "selectedText");
      __publicField(this, "messageType");
      this.messageType = messageType;
    }
  }
  function print(method, ...args) {
    if (typeof args[0] === "string") {
      const message = args.shift();
      method(`[wxt] ${message}`, ...args);
    } else {
      method("[wxt]", ...args);
    }
  }
  var logger = {
    debug: (...args) => print(console.debug, ...args),
    log: (...args) => print(console.log, ...args),
    warn: (...args) => print(console.warn, ...args),
    error: (...args) => print(console.error, ...args)
  };
  (async () => {
    try {
      await ExtMessage.main();
    } catch (err) {
      logger.error(
        `The unlisted script "${"types"}" crashed on startup!`,
        err
      );
    }
  })();
})();
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHlwZXMuanMiLCJzb3VyY2VzIjpbIi4uLy4uL2VudHJ5cG9pbnRzL3R5cGVzLnRzIl0sInNvdXJjZXNDb250ZW50IjpbImV4cG9ydCBlbnVtIE1lc3NhZ2VUeXBlIHtcbiAgICBjbGlja0V4dEljb24gPSBcImNsaWNrRXh0SWNvblwiLFxuICAgIGNoYW5nZVRoZW1lID0gXCJjaGFuZ2VUaGVtZVwiLFxuICAgIGNoYW5nZUxvY2FsZSA9IFwiY2hhbmdlTG9jYWxlXCIsXG4gICAgb3BlblNpZGVQYW5lbCA9IFwib3BlblNpZGVQYW5lbFwiLFxuICAgIGdldFNlbGVjdGVkVGV4dCA9IFwiZ2V0U2VsZWN0ZWRUZXh0XCJcbn1cblxuZXhwb3J0IGVudW0gTWVzc2FnZUZyb20ge1xuICAgIGNvbnRlbnRTY3JpcHQgPSBcImNvbnRlbnRTY3JpcHRcIixcbiAgICBiYWNrZ3JvdW5kID0gXCJiYWNrZ3JvdW5kXCIsXG4gICAgcG9wVXAgPSBcInBvcFVwXCIsXG4gICAgc2lkZVBhbmVsID0gXCJzaWRlUGFuZWxcIixcbn1cblxuY2xhc3MgRXh0TWVzc2FnZSB7XG4gICAgY29udGVudD86IHN0cmluZztcbiAgICBmcm9tPzogTWVzc2FnZUZyb207XG4gICAgc2VsZWN0ZWRUZXh0Pzogc3RyaW5nO1xuXG4gICAgY29uc3RydWN0b3IobWVzc2FnZVR5cGU6IE1lc3NhZ2VUeXBlKSB7XG4gICAgICAgIHRoaXMubWVzc2FnZVR5cGUgPSBtZXNzYWdlVHlwZTtcbiAgICB9XG5cbiAgICBtZXNzYWdlVHlwZTogTWVzc2FnZVR5cGU7XG59XG5cbmV4cG9ydCBkZWZhdWx0IEV4dE1lc3NhZ2U7XG4iXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7RUFlQSxNQUFNLFdBQVc7QUFBQSxJQUtiLFlBQVksYUFBMEI7QUFKdEM7QUFDQTtBQUNBO0FBTUE7QUFISSxXQUFLLGNBQWM7QUFBQSxJQUN2QjtBQUFBLEVBR0o7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OyJ9
