var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => {
  __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};
var __accessCheck = (obj, member, msg) => {
  if (!member.has(obj))
    throw TypeError("Cannot " + msg);
};
var __privateGet = (obj, member, getter) => {
  __accessCheck(obj, member, "read from private field");
  return getter ? getter.call(obj) : member.get(obj);
};
var __privateAdd = (obj, member, value) => {
  if (member.has(obj))
    throw TypeError("Cannot add the same private member more than once");
  member instanceof WeakSet ? member.add(obj) : member.set(obj, value);
};
var __privateSet = (obj, member, value, setter) => {
  __accessCheck(obj, member, "write to private field");
  setter ? setter.call(obj, value) : member.set(obj, value);
  return value;
};
var __privateMethod = (obj, member, method) => {
  __accessCheck(obj, member, "access private method");
  return method;
};
(function() {
  "use strict";
  var _a, _b, _isTopFrame, _abortController, _locationWatcher, _stopOldScripts, stopOldScripts_fn, _listenForNewerScripts, listenForNewerScripts_fn;
  function defineContentScript(definition2) {
    return definition2;
  }
  var commonjsGlobal = typeof globalThis !== "undefined" ? globalThis : typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : {};
  function getDefaultExportFromCjs(x) {
    return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, "default") ? x["default"] : x;
  }
  var browserPolyfill = { exports: {} };
  (function(module, exports) {
    (function(global2, factory) {
      {
        factory(module);
      }
    })(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : commonjsGlobal, function(module2) {
      var _a2, _b2;
      if (!((_b2 = (_a2 = globalThis.chrome) == null ? void 0 : _a2.runtime) == null ? void 0 : _b2.id)) {
        throw new Error("This script should only be loaded in a browser extension.");
      }
      if (typeof globalThis.browser === "undefined" || Object.getPrototypeOf(globalThis.browser) !== Object.prototype) {
        const CHROME_SEND_MESSAGE_CALLBACK_NO_RESPONSE_MESSAGE = "The message port closed before a response was received.";
        const wrapAPIs = (extensionAPIs) => {
          const apiMetadata = {
            "alarms": {
              "clear": {
                "minArgs": 0,
                "maxArgs": 1
              },
              "clearAll": {
                "minArgs": 0,
                "maxArgs": 0
              },
              "get": {
                "minArgs": 0,
                "maxArgs": 1
              },
              "getAll": {
                "minArgs": 0,
                "maxArgs": 0
              }
            },
            "bookmarks": {
              "create": {
                "minArgs": 1,
                "maxArgs": 1
              },
              "get": {
                "minArgs": 1,
                "maxArgs": 1
              },
              "getChildren": {
                "minArgs": 1,
                "maxArgs": 1
              },
              "getRecent": {
                "minArgs": 1,
                "maxArgs": 1
              },
              "getSubTree": {
                "minArgs": 1,
                "maxArgs": 1
              },
              "getTree": {
                "minArgs": 0,
                "maxArgs": 0
              },
              "move": {
                "minArgs": 2,
                "maxArgs": 2
              },
              "remove": {
                "minArgs": 1,
                "maxArgs": 1
              },
              "removeTree": {
                "minArgs": 1,
                "maxArgs": 1
              },
              "search": {
                "minArgs": 1,
                "maxArgs": 1
              },
              "update": {
                "minArgs": 2,
                "maxArgs": 2
              }
            },
            "browserAction": {
              "disable": {
                "minArgs": 0,
                "maxArgs": 1,
                "fallbackToNoCallback": true
              },
              "enable": {
                "minArgs": 0,
                "maxArgs": 1,
                "fallbackToNoCallback": true
              },
              "getBadgeBackgroundColor": {
                "minArgs": 1,
                "maxArgs": 1
              },
              "getBadgeText": {
                "minArgs": 1,
                "maxArgs": 1
              },
              "getPopup": {
                "minArgs": 1,
                "maxArgs": 1
              },
              "getTitle": {
                "minArgs": 1,
                "maxArgs": 1
              },
              "openPopup": {
                "minArgs": 0,
                "maxArgs": 0
              },
              "setBadgeBackgroundColor": {
                "minArgs": 1,
                "maxArgs": 1,
                "fallbackToNoCallback": true
              },
              "setBadgeText": {
                "minArgs": 1,
                "maxArgs": 1,
                "fallbackToNoCallback": true
              },
              "setIcon": {
                "minArgs": 1,
                "maxArgs": 1
              },
              "setPopup": {
                "minArgs": 1,
                "maxArgs": 1,
                "fallbackToNoCallback": true
              },
              "setTitle": {
                "minArgs": 1,
                "maxArgs": 1,
                "fallbackToNoCallback": true
              }
            },
            "browsingData": {
              "remove": {
                "minArgs": 2,
                "maxArgs": 2
              },
              "removeCache": {
                "minArgs": 1,
                "maxArgs": 1
              },
              "removeCookies": {
                "minArgs": 1,
                "maxArgs": 1
              },
              "removeDownloads": {
                "minArgs": 1,
                "maxArgs": 1
              },
              "removeFormData": {
                "minArgs": 1,
                "maxArgs": 1
              },
              "removeHistory": {
                "minArgs": 1,
                "maxArgs": 1
              },
              "removeLocalStorage": {
                "minArgs": 1,
                "maxArgs": 1
              },
              "removePasswords": {
                "minArgs": 1,
                "maxArgs": 1
              },
              "removePluginData": {
                "minArgs": 1,
                "maxArgs": 1
              },
              "settings": {
                "minArgs": 0,
                "maxArgs": 0
              }
            },
            "commands": {
              "getAll": {
                "minArgs": 0,
                "maxArgs": 0
              }
            },
            "contextMenus": {
              "remove": {
                "minArgs": 1,
                "maxArgs": 1
              },
              "removeAll": {
                "minArgs": 0,
                "maxArgs": 0
              },
              "update": {
                "minArgs": 2,
                "maxArgs": 2
              }
            },
            "cookies": {
              "get": {
                "minArgs": 1,
                "maxArgs": 1
              },
              "getAll": {
                "minArgs": 1,
                "maxArgs": 1
              },
              "getAllCookieStores": {
                "minArgs": 0,
                "maxArgs": 0
              },
              "remove": {
                "minArgs": 1,
                "maxArgs": 1
              },
              "set": {
                "minArgs": 1,
                "maxArgs": 1
              }
            },
            "devtools": {
              "inspectedWindow": {
                "eval": {
                  "minArgs": 1,
                  "maxArgs": 2,
                  "singleCallbackArg": false
                }
              },
              "panels": {
                "create": {
                  "minArgs": 3,
                  "maxArgs": 3,
                  "singleCallbackArg": true
                },
                "elements": {
                  "createSidebarPane": {
                    "minArgs": 1,
                    "maxArgs": 1
                  }
                }
              }
            },
            "downloads": {
              "cancel": {
                "minArgs": 1,
                "maxArgs": 1
              },
              "download": {
                "minArgs": 1,
                "maxArgs": 1
              },
              "erase": {
                "minArgs": 1,
                "maxArgs": 1
              },
              "getFileIcon": {
                "minArgs": 1,
                "maxArgs": 2
              },
              "open": {
                "minArgs": 1,
                "maxArgs": 1,
                "fallbackToNoCallback": true
              },
              "pause": {
                "minArgs": 1,
                "maxArgs": 1
              },
              "removeFile": {
                "minArgs": 1,
                "maxArgs": 1
              },
              "resume": {
                "minArgs": 1,
                "maxArgs": 1
              },
              "search": {
                "minArgs": 1,
                "maxArgs": 1
              },
              "show": {
                "minArgs": 1,
                "maxArgs": 1,
                "fallbackToNoCallback": true
              }
            },
            "extension": {
              "isAllowedFileSchemeAccess": {
                "minArgs": 0,
                "maxArgs": 0
              },
              "isAllowedIncognitoAccess": {
                "minArgs": 0,
                "maxArgs": 0
              }
            },
            "history": {
              "addUrl": {
                "minArgs": 1,
                "maxArgs": 1
              },
              "deleteAll": {
                "minArgs": 0,
                "maxArgs": 0
              },
              "deleteRange": {
                "minArgs": 1,
                "maxArgs": 1
              },
              "deleteUrl": {
                "minArgs": 1,
                "maxArgs": 1
              },
              "getVisits": {
                "minArgs": 1,
                "maxArgs": 1
              },
              "search": {
                "minArgs": 1,
                "maxArgs": 1
              }
            },
            "i18n": {
              "detectLanguage": {
                "minArgs": 1,
                "maxArgs": 1
              },
              "getAcceptLanguages": {
                "minArgs": 0,
                "maxArgs": 0
              }
            },
            "identity": {
              "launchWebAuthFlow": {
                "minArgs": 1,
                "maxArgs": 1
              }
            },
            "idle": {
              "queryState": {
                "minArgs": 1,
                "maxArgs": 1
              }
            },
            "management": {
              "get": {
                "minArgs": 1,
                "maxArgs": 1
              },
              "getAll": {
                "minArgs": 0,
                "maxArgs": 0
              },
              "getSelf": {
                "minArgs": 0,
                "maxArgs": 0
              },
              "setEnabled": {
                "minArgs": 2,
                "maxArgs": 2
              },
              "uninstallSelf": {
                "minArgs": 0,
                "maxArgs": 1
              }
            },
            "notifications": {
              "clear": {
                "minArgs": 1,
                "maxArgs": 1
              },
              "create": {
                "minArgs": 1,
                "maxArgs": 2
              },
              "getAll": {
                "minArgs": 0,
                "maxArgs": 0
              },
              "getPermissionLevel": {
                "minArgs": 0,
                "maxArgs": 0
              },
              "update": {
                "minArgs": 2,
                "maxArgs": 2
              }
            },
            "pageAction": {
              "getPopup": {
                "minArgs": 1,
                "maxArgs": 1
              },
              "getTitle": {
                "minArgs": 1,
                "maxArgs": 1
              },
              "hide": {
                "minArgs": 1,
                "maxArgs": 1,
                "fallbackToNoCallback": true
              },
              "setIcon": {
                "minArgs": 1,
                "maxArgs": 1
              },
              "setPopup": {
                "minArgs": 1,
                "maxArgs": 1,
                "fallbackToNoCallback": true
              },
              "setTitle": {
                "minArgs": 1,
                "maxArgs": 1,
                "fallbackToNoCallback": true
              },
              "show": {
                "minArgs": 1,
                "maxArgs": 1,
                "fallbackToNoCallback": true
              }
            },
            "permissions": {
              "contains": {
                "minArgs": 1,
                "maxArgs": 1
              },
              "getAll": {
                "minArgs": 0,
                "maxArgs": 0
              },
              "remove": {
                "minArgs": 1,
                "maxArgs": 1
              },
              "request": {
                "minArgs": 1,
                "maxArgs": 1
              }
            },
            "runtime": {
              "getBackgroundPage": {
                "minArgs": 0,
                "maxArgs": 0
              },
              "getPlatformInfo": {
                "minArgs": 0,
                "maxArgs": 0
              },
              "openOptionsPage": {
                "minArgs": 0,
                "maxArgs": 0
              },
              "requestUpdateCheck": {
                "minArgs": 0,
                "maxArgs": 0
              },
              "sendMessage": {
                "minArgs": 1,
                "maxArgs": 3
              },
              "sendNativeMessage": {
                "minArgs": 2,
                "maxArgs": 2
              },
              "setUninstallURL": {
                "minArgs": 1,
                "maxArgs": 1
              }
            },
            "sessions": {
              "getDevices": {
                "minArgs": 0,
                "maxArgs": 1
              },
              "getRecentlyClosed": {
                "minArgs": 0,
                "maxArgs": 1
              },
              "restore": {
                "minArgs": 0,
                "maxArgs": 1
              }
            },
            "storage": {
              "local": {
                "clear": {
                  "minArgs": 0,
                  "maxArgs": 0
                },
                "get": {
                  "minArgs": 0,
                  "maxArgs": 1
                },
                "getBytesInUse": {
                  "minArgs": 0,
                  "maxArgs": 1
                },
                "remove": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "set": {
                  "minArgs": 1,
                  "maxArgs": 1
                }
              },
              "managed": {
                "get": {
                  "minArgs": 0,
                  "maxArgs": 1
                },
                "getBytesInUse": {
                  "minArgs": 0,
                  "maxArgs": 1
                }
              },
              "sync": {
                "clear": {
                  "minArgs": 0,
                  "maxArgs": 0
                },
                "get": {
                  "minArgs": 0,
                  "maxArgs": 1
                },
                "getBytesInUse": {
                  "minArgs": 0,
                  "maxArgs": 1
                },
                "remove": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "set": {
                  "minArgs": 1,
                  "maxArgs": 1
                }
              }
            },
            "tabs": {
              "captureVisibleTab": {
                "minArgs": 0,
                "maxArgs": 2
              },
              "create": {
                "minArgs": 1,
                "maxArgs": 1
              },
              "detectLanguage": {
                "minArgs": 0,
                "maxArgs": 1
              },
              "discard": {
                "minArgs": 0,
                "maxArgs": 1
              },
              "duplicate": {
                "minArgs": 1,
                "maxArgs": 1
              },
              "executeScript": {
                "minArgs": 1,
                "maxArgs": 2
              },
              "get": {
                "minArgs": 1,
                "maxArgs": 1
              },
              "getCurrent": {
                "minArgs": 0,
                "maxArgs": 0
              },
              "getZoom": {
                "minArgs": 0,
                "maxArgs": 1
              },
              "getZoomSettings": {
                "minArgs": 0,
                "maxArgs": 1
              },
              "goBack": {
                "minArgs": 0,
                "maxArgs": 1
              },
              "goForward": {
                "minArgs": 0,
                "maxArgs": 1
              },
              "highlight": {
                "minArgs": 1,
                "maxArgs": 1
              },
              "insertCSS": {
                "minArgs": 1,
                "maxArgs": 2
              },
              "move": {
                "minArgs": 2,
                "maxArgs": 2
              },
              "query": {
                "minArgs": 1,
                "maxArgs": 1
              },
              "reload": {
                "minArgs": 0,
                "maxArgs": 2
              },
              "remove": {
                "minArgs": 1,
                "maxArgs": 1
              },
              "removeCSS": {
                "minArgs": 1,
                "maxArgs": 2
              },
              "sendMessage": {
                "minArgs": 2,
                "maxArgs": 3
              },
              "setZoom": {
                "minArgs": 1,
                "maxArgs": 2
              },
              "setZoomSettings": {
                "minArgs": 1,
                "maxArgs": 2
              },
              "update": {
                "minArgs": 1,
                "maxArgs": 2
              }
            },
            "topSites": {
              "get": {
                "minArgs": 0,
                "maxArgs": 0
              }
            },
            "webNavigation": {
              "getAllFrames": {
                "minArgs": 1,
                "maxArgs": 1
              },
              "getFrame": {
                "minArgs": 1,
                "maxArgs": 1
              }
            },
            "webRequest": {
              "handlerBehaviorChanged": {
                "minArgs": 0,
                "maxArgs": 0
              }
            },
            "windows": {
              "create": {
                "minArgs": 0,
                "maxArgs": 1
              },
              "get": {
                "minArgs": 1,
                "maxArgs": 2
              },
              "getAll": {
                "minArgs": 0,
                "maxArgs": 1
              },
              "getCurrent": {
                "minArgs": 0,
                "maxArgs": 1
              },
              "getLastFocused": {
                "minArgs": 0,
                "maxArgs": 1
              },
              "remove": {
                "minArgs": 1,
                "maxArgs": 1
              },
              "update": {
                "minArgs": 2,
                "maxArgs": 2
              }
            }
          };
          if (Object.keys(apiMetadata).length === 0) {
            throw new Error("api-metadata.json has not been included in browser-polyfill");
          }
          class DefaultWeakMap extends WeakMap {
            constructor(createItem, items = void 0) {
              super(items);
              this.createItem = createItem;
            }
            get(key) {
              if (!this.has(key)) {
                this.set(key, this.createItem(key));
              }
              return super.get(key);
            }
          }
          const isThenable = (value) => {
            return value && typeof value === "object" && typeof value.then === "function";
          };
          const makeCallback = (promise, metadata) => {
            return (...callbackArgs) => {
              if (extensionAPIs.runtime.lastError) {
                promise.reject(new Error(extensionAPIs.runtime.lastError.message));
              } else if (metadata.singleCallbackArg || callbackArgs.length <= 1 && metadata.singleCallbackArg !== false) {
                promise.resolve(callbackArgs[0]);
              } else {
                promise.resolve(callbackArgs);
              }
            };
          };
          const pluralizeArguments = (numArgs) => numArgs == 1 ? "argument" : "arguments";
          const wrapAsyncFunction = (name, metadata) => {
            return function asyncFunctionWrapper(target, ...args) {
              if (args.length < metadata.minArgs) {
                throw new Error(`Expected at least ${metadata.minArgs} ${pluralizeArguments(metadata.minArgs)} for ${name}(), got ${args.length}`);
              }
              if (args.length > metadata.maxArgs) {
                throw new Error(`Expected at most ${metadata.maxArgs} ${pluralizeArguments(metadata.maxArgs)} for ${name}(), got ${args.length}`);
              }
              return new Promise((resolve, reject) => {
                if (metadata.fallbackToNoCallback) {
                  try {
                    target[name](...args, makeCallback({
                      resolve,
                      reject
                    }, metadata));
                  } catch (cbError) {
                    console.warn(`${name} API method doesn't seem to support the callback parameter, falling back to call it without a callback: `, cbError);
                    target[name](...args);
                    metadata.fallbackToNoCallback = false;
                    metadata.noCallback = true;
                    resolve();
                  }
                } else if (metadata.noCallback) {
                  target[name](...args);
                  resolve();
                } else {
                  target[name](...args, makeCallback({
                    resolve,
                    reject
                  }, metadata));
                }
              });
            };
          };
          const wrapMethod = (target, method, wrapper) => {
            return new Proxy(method, {
              apply(targetMethod, thisObj, args) {
                return wrapper.call(thisObj, target, ...args);
              }
            });
          };
          let hasOwnProperty = Function.call.bind(Object.prototype.hasOwnProperty);
          const wrapObject = (target, wrappers = {}, metadata = {}) => {
            let cache = /* @__PURE__ */ Object.create(null);
            let handlers = {
              has(proxyTarget2, prop) {
                return prop in target || prop in cache;
              },
              get(proxyTarget2, prop, receiver) {
                if (prop in cache) {
                  return cache[prop];
                }
                if (!(prop in target)) {
                  return void 0;
                }
                let value = target[prop];
                if (typeof value === "function") {
                  if (typeof wrappers[prop] === "function") {
                    value = wrapMethod(target, target[prop], wrappers[prop]);
                  } else if (hasOwnProperty(metadata, prop)) {
                    let wrapper = wrapAsyncFunction(prop, metadata[prop]);
                    value = wrapMethod(target, target[prop], wrapper);
                  } else {
                    value = value.bind(target);
                  }
                } else if (typeof value === "object" && value !== null && (hasOwnProperty(wrappers, prop) || hasOwnProperty(metadata, prop))) {
                  value = wrapObject(value, wrappers[prop], metadata[prop]);
                } else if (hasOwnProperty(metadata, "*")) {
                  value = wrapObject(value, wrappers[prop], metadata["*"]);
                } else {
                  Object.defineProperty(cache, prop, {
                    configurable: true,
                    enumerable: true,
                    get() {
                      return target[prop];
                    },
                    set(value2) {
                      target[prop] = value2;
                    }
                  });
                  return value;
                }
                cache[prop] = value;
                return value;
              },
              set(proxyTarget2, prop, value, receiver) {
                if (prop in cache) {
                  cache[prop] = value;
                } else {
                  target[prop] = value;
                }
                return true;
              },
              defineProperty(proxyTarget2, prop, desc) {
                return Reflect.defineProperty(cache, prop, desc);
              },
              deleteProperty(proxyTarget2, prop) {
                return Reflect.deleteProperty(cache, prop);
              }
            };
            let proxyTarget = Object.create(target);
            return new Proxy(proxyTarget, handlers);
          };
          const wrapEvent = (wrapperMap) => ({
            addListener(target, listener, ...args) {
              target.addListener(wrapperMap.get(listener), ...args);
            },
            hasListener(target, listener) {
              return target.hasListener(wrapperMap.get(listener));
            },
            removeListener(target, listener) {
              target.removeListener(wrapperMap.get(listener));
            }
          });
          const onRequestFinishedWrappers = new DefaultWeakMap((listener) => {
            if (typeof listener !== "function") {
              return listener;
            }
            return function onRequestFinished(req) {
              const wrappedReq = wrapObject(
                req,
                {},
                {
                  getContent: {
                    minArgs: 0,
                    maxArgs: 0
                  }
                }
              );
              listener(wrappedReq);
            };
          });
          const onMessageWrappers = new DefaultWeakMap((listener) => {
            if (typeof listener !== "function") {
              return listener;
            }
            return function onMessage(message, sender, sendResponse) {
              let didCallSendResponse = false;
              let wrappedSendResponse;
              let sendResponsePromise = new Promise((resolve) => {
                wrappedSendResponse = function(response) {
                  didCallSendResponse = true;
                  resolve(response);
                };
              });
              let result;
              try {
                result = listener(message, sender, wrappedSendResponse);
              } catch (err) {
                result = Promise.reject(err);
              }
              const isResultThenable = result !== true && isThenable(result);
              if (result !== true && !isResultThenable && !didCallSendResponse) {
                return false;
              }
              const sendPromisedResult = (promise) => {
                promise.then((msg) => {
                  sendResponse(msg);
                }, (error) => {
                  let message2;
                  if (error && (error instanceof Error || typeof error.message === "string")) {
                    message2 = error.message;
                  } else {
                    message2 = "An unexpected error occurred";
                  }
                  sendResponse({
                    __mozWebExtensionPolyfillReject__: true,
                    message: message2
                  });
                }).catch((err) => {
                  console.error("Failed to send onMessage rejected reply", err);
                });
              };
              if (isResultThenable) {
                sendPromisedResult(result);
              } else {
                sendPromisedResult(sendResponsePromise);
              }
              return true;
            };
          });
          const wrappedSendMessageCallback = ({
            reject,
            resolve
          }, reply) => {
            if (extensionAPIs.runtime.lastError) {
              if (extensionAPIs.runtime.lastError.message === CHROME_SEND_MESSAGE_CALLBACK_NO_RESPONSE_MESSAGE) {
                resolve();
              } else {
                reject(new Error(extensionAPIs.runtime.lastError.message));
              }
            } else if (reply && reply.__mozWebExtensionPolyfillReject__) {
              reject(new Error(reply.message));
            } else {
              resolve(reply);
            }
          };
          const wrappedSendMessage = (name, metadata, apiNamespaceObj, ...args) => {
            if (args.length < metadata.minArgs) {
              throw new Error(`Expected at least ${metadata.minArgs} ${pluralizeArguments(metadata.minArgs)} for ${name}(), got ${args.length}`);
            }
            if (args.length > metadata.maxArgs) {
              throw new Error(`Expected at most ${metadata.maxArgs} ${pluralizeArguments(metadata.maxArgs)} for ${name}(), got ${args.length}`);
            }
            return new Promise((resolve, reject) => {
              const wrappedCb = wrappedSendMessageCallback.bind(null, {
                resolve,
                reject
              });
              args.push(wrappedCb);
              apiNamespaceObj.sendMessage(...args);
            });
          };
          const staticWrappers = {
            devtools: {
              network: {
                onRequestFinished: wrapEvent(onRequestFinishedWrappers)
              }
            },
            runtime: {
              onMessage: wrapEvent(onMessageWrappers),
              onMessageExternal: wrapEvent(onMessageWrappers),
              sendMessage: wrappedSendMessage.bind(null, "sendMessage", {
                minArgs: 1,
                maxArgs: 3
              })
            },
            tabs: {
              sendMessage: wrappedSendMessage.bind(null, "sendMessage", {
                minArgs: 2,
                maxArgs: 3
              })
            }
          };
          const settingMetadata = {
            clear: {
              minArgs: 1,
              maxArgs: 1
            },
            get: {
              minArgs: 1,
              maxArgs: 1
            },
            set: {
              minArgs: 1,
              maxArgs: 1
            }
          };
          apiMetadata.privacy = {
            network: {
              "*": settingMetadata
            },
            services: {
              "*": settingMetadata
            },
            websites: {
              "*": settingMetadata
            }
          };
          return wrapObject(extensionAPIs, staticWrappers, apiMetadata);
        };
        module2.exports = wrapAPIs(chrome);
      } else {
        module2.exports = globalThis.browser;
      }
    });
  })(browserPolyfill);
  var browserPolyfillExports = browserPolyfill.exports;
  const originalBrowser = /* @__PURE__ */ getDefaultExportFromCjs(browserPolyfillExports);
  var browser = originalBrowser;
  var MessageType = /* @__PURE__ */ ((MessageType2) => {
    MessageType2["clickExtIcon"] = "clickExtIcon";
    MessageType2["changeTheme"] = "changeTheme";
    MessageType2["changeLocale"] = "changeLocale";
    MessageType2["openSidePanel"] = "openSidePanel";
    MessageType2["getSelectedText"] = "getSelectedText";
    return MessageType2;
  })(MessageType || {});
  const definition = defineContentScript({
    matches: ["*://*/*"],
    runAt: "document_end",
    main() {
      let previewCard = null;
      let ignoreNextMouseUp = false;
      document.addEventListener("mouseup", handleTextSelection);
      function handleTextSelection(e) {
        var _a2;
        if (ignoreNextMouseUp) {
          ignoreNextMouseUp = false;
          return;
        }
        if (previewCard && previewCard.contains(e.target)) {
          return;
        }
        const selectedText = ((_a2 = window.getSelection()) == null ? void 0 : _a2.toString().trim()) || "";
        if (selectedText.length > 0) {
          showPreviewCard(selectedText, e.clientX, e.clientY);
        }
      }
      function showPreviewCard(text, x, y) {
        if (previewCard) {
          previewCard.remove();
        }
        previewCard = document.createElement("div");
        previewCard.className = "rabbithole-preview-card";
        previewCard.innerHTML = `
                <div class="preview-text">Selected: ${text}</div>
                <button class="preview-button">Open in Sidebar</button>
            `;
        Object.assign(previewCard.style, {
          position: "fixed",
          left: x + "px",
          top: y + 20 + "px",
          background: "white",
          border: "2px solid #333",
          borderRadius: "8px",
          padding: "12px",
          zIndex: "999999",
          fontFamily: "Arial, sans-serif",
          boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
          minWidth: "200px"
        });
        const textElement = previewCard.querySelector(".preview-text");
        if (textElement) {
          Object.assign(textElement.style, {
            marginBottom: "8px",
            fontSize: "13px",
            color: "#666"
          });
        }
        const button = previewCard.querySelector(".preview-button");
        if (button) {
          Object.assign(button.style, {
            width: "100%",
            padding: "8px",
            background: "#0066cc",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            fontSize: "14px",
            fontWeight: "600"
          });
          button.addEventListener("mouseenter", () => {
            button.style.background = "#0052a3";
          });
          button.addEventListener("mouseleave", () => {
            button.style.background = "#0066cc";
          });
        }
        document.body.appendChild(previewCard);
        if (button) {
          button.addEventListener("mousedown", function(e) {
            e.preventDefault();
            e.stopPropagation();
            ignoreNextMouseUp = true;
          });
          button.addEventListener("click", function(e) {
            e.preventDefault();
            e.stopPropagation();
            console.log("Button clicked, sending message...");
            const message = {
              messageType: MessageType.openSidePanel,
              selectedText: text
            };
            browser.runtime.sendMessage(message).then(() => {
              console.log("Message sent successfully");
            }).catch((error) => {
              console.error("Error sending message:", error);
            });
            if (previewCard) {
              previewCard.remove();
              previewCard = null;
            }
          });
        }
      }
      document.addEventListener("mousedown", function(e) {
        if (previewCard && !previewCard.contains(e.target)) {
          if (previewCard) {
            previewCard.remove();
            previewCard = null;
          }
        }
      });
    }
  });
  var define_import_meta_env_default = { VITE_CJS_IGNORE_WARNING: "true", BASE_URL: "/", MODE: "development", DEV: true, PROD: false, SSR: false, MANIFEST_VERSION: 3, BROWSER: "chrome", CHROME: true, FIREFOX: false, SAFARI: false, EDGE: false, OPERA: false, COMMAND: "serve", ENTRYPOINT: "content" };
  function print$1(method, ...args) {
    if (typeof args[0] === "string") {
      const message = args.shift();
      method(`[wxt] ${message}`, ...args);
    } else {
      method("[wxt]", ...args);
    }
  }
  var logger$1 = {
    debug: (...args) => print$1(console.debug, ...args),
    log: (...args) => print$1(console.log, ...args),
    warn: (...args) => print$1(console.warn, ...args),
    error: (...args) => print$1(console.error, ...args)
  };
  var WxtLocationChangeEvent = (_a = class extends Event {
    constructor(newUrl, oldUrl) {
      super(_a.EVENT_NAME, {});
      this.newUrl = newUrl;
      this.oldUrl = oldUrl;
    }
  }, __publicField(_a, "EVENT_NAME", getUniqueEventName("wxt:locationchange")), _a);
  function getUniqueEventName(eventName) {
    const entrypointName = typeof define_import_meta_env_default === "undefined" ? "build" : "content";
    return `${browser.runtime.id}:${entrypointName}:${eventName}`;
  }
  function createLocationWatcher(ctx) {
    let interval;
    let oldUrl;
    return {
      /**
       * Ensure the location watcher is actively looking for URL changes. If it's already watching,
       * this is a noop.
       */
      run() {
        if (interval != null)
          return;
        oldUrl = new URL(location.href);
        interval = ctx.setInterval(() => {
          let newUrl = new URL(location.href);
          if (newUrl.href !== oldUrl.href) {
            window.dispatchEvent(new WxtLocationChangeEvent(newUrl, oldUrl));
            oldUrl = newUrl;
          }
        }, 1e3);
      }
    };
  }
  var ContentScriptContext = (_b = class {
    constructor(contentScriptName, options) {
      __privateAdd(this, _stopOldScripts);
      __privateAdd(this, _listenForNewerScripts);
      __privateAdd(this, _isTopFrame, window.self === window.top);
      __privateAdd(this, _abortController, void 0);
      __privateAdd(this, _locationWatcher, createLocationWatcher(this));
      this.contentScriptName = contentScriptName;
      this.options = options;
      __privateSet(this, _abortController, new AbortController());
      if (__privateGet(this, _isTopFrame)) {
        __privateMethod(this, _stopOldScripts, stopOldScripts_fn).call(this);
      }
      this.setTimeout(() => {
        __privateMethod(this, _listenForNewerScripts, listenForNewerScripts_fn).call(this);
      });
    }
    get signal() {
      return __privateGet(this, _abortController).signal;
    }
    abort(reason) {
      return __privateGet(this, _abortController).abort(reason);
    }
    get isInvalid() {
      if (browser.runtime.id == null) {
        this.notifyInvalidated();
      }
      return this.signal.aborted;
    }
    get isValid() {
      return !this.isInvalid;
    }
    /**
     * Add a listener that is called when the content script's context is invalidated.
     *
     * @returns A function to remove the listener.
     *
     * @example
     * browser.runtime.onMessage.addListener(cb);
     * const removeInvalidatedListener = ctx.onInvalidated(() => {
     *   browser.runtime.onMessage.removeListener(cb);
     * })
     * // ...
     * removeInvalidatedListener();
     */
    onInvalidated(cb) {
      this.signal.addEventListener("abort", cb);
      return () => this.signal.removeEventListener("abort", cb);
    }
    /**
     * Return a promise that never resolves. Useful if you have an async function that shouldn't run
     * after the context is expired.
     *
     * @example
     * const getValueFromStorage = async () => {
     *   if (ctx.isInvalid) return ctx.block();
     *
     *   // ...
     * }
     */
    block() {
      return new Promise(() => {
      });
    }
    /**
     * Wrapper around `window.setInterval` that automatically clears the interval when invalidated.
     */
    setInterval(handler, timeout) {
      const id = setInterval(() => {
        if (this.isValid)
          handler();
      }, timeout);
      this.onInvalidated(() => clearInterval(id));
      return id;
    }
    /**
     * Wrapper around `window.setTimeout` that automatically clears the interval when invalidated.
     */
    setTimeout(handler, timeout) {
      const id = setTimeout(() => {
        if (this.isValid)
          handler();
      }, timeout);
      this.onInvalidated(() => clearTimeout(id));
      return id;
    }
    /**
     * Wrapper around `window.requestAnimationFrame` that automatically cancels the request when
     * invalidated.
     */
    requestAnimationFrame(callback) {
      const id = requestAnimationFrame((...args) => {
        if (this.isValid)
          callback(...args);
      });
      this.onInvalidated(() => cancelAnimationFrame(id));
      return id;
    }
    /**
     * Wrapper around `window.requestIdleCallback` that automatically cancels the request when
     * invalidated.
     */
    requestIdleCallback(callback, options) {
      const id = requestIdleCallback((...args) => {
        if (!this.signal.aborted)
          callback(...args);
      }, options);
      this.onInvalidated(() => cancelIdleCallback(id));
      return id;
    }
    /**
     * Call `target.addEventListener` and remove the event listener when the context is invalidated.
     *
     * Includes additional events useful for content scripts:
     *
     * - `"wxt:locationchange"` - Triggered when HTML5 history mode is used to change URL. Content
     *   scripts are not reloaded when navigating this way, so this can be used to reset the content
     *   script state on URL change, or run custom code.
     *
     * @example
     * ctx.addEventListener(document, "visibilitychange", () => {
     *   // ...
     * });
     * ctx.addEventListener(document, "wxt:locationchange", () => {
     *   // ...
     * });
     */
    addEventListener(target, type, handler, options) {
      var _a2;
      if (type === "wxt:locationchange") {
        if (this.isValid)
          __privateGet(this, _locationWatcher).run();
      }
      (_a2 = target.addEventListener) == null ? void 0 : _a2.call(
        target,
        type.startsWith("wxt:") ? getUniqueEventName(type) : type,
        // @ts-expect-error: Event don't match, but that's OK, EventTarget doesn't allow custom types in the callback
        handler,
        {
          ...options,
          signal: this.signal
        }
      );
    }
    /**
     * @internal
     * Abort the abort controller and execute all `onInvalidated` listeners.
     */
    notifyInvalidated() {
      this.abort("Content script context invalidated");
      logger$1.debug(
        `Content script "${this.contentScriptName}" context invalidated`
      );
    }
  }, _isTopFrame = new WeakMap(), _abortController = new WeakMap(), _locationWatcher = new WeakMap(), _stopOldScripts = new WeakSet(), stopOldScripts_fn = function() {
    window.postMessage(
      {
        event: _b.SCRIPT_STARTED_MESSAGE_TYPE,
        contentScriptName: this.contentScriptName
      },
      "*"
    );
  }, _listenForNewerScripts = new WeakSet(), listenForNewerScripts_fn = function() {
    const cb = (event) => {
      var _a2, _b2;
      if (((_a2 = event.data) == null ? void 0 : _a2.type) === _b.SCRIPT_STARTED_MESSAGE_TYPE && ((_b2 = event.data) == null ? void 0 : _b2.contentScriptName) === this.contentScriptName) {
        this.notifyInvalidated();
      }
    };
    addEventListener("message", cb);
    this.onInvalidated(() => removeEventListener("message", cb));
  }, __publicField(_b, "SCRIPT_STARTED_MESSAGE_TYPE", "wxt:content-script-started"), _b);
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
      const { main, ...options } = definition;
      const ctx = new ContentScriptContext("content", options);
      await main(ctx);
    } catch (err) {
      logger.error(
        `The content script "${"content"}" crashed on startup!`,
        err
      );
    }
  })();
})();
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29udGVudC5qcyIsInNvdXJjZXMiOlsiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3d4dC9kaXN0L3NhbmRib3guanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvd2ViZXh0ZW5zaW9uLXBvbHlmaWxsL2Rpc3QvYnJvd3Nlci1wb2x5ZmlsbC5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy93eHQvZGlzdC9jaHVuay1GTlRFMkwyNy5qcyIsIi4uLy4uLy4uL2VudHJ5cG9pbnRzL3R5cGVzLnRzIiwiLi4vLi4vLi4vZW50cnlwb2ludHMvY29udGVudC9pbmRleC50cyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy93eHQvZGlzdC9jbGllbnQuanMiXSwic291cmNlc0NvbnRlbnQiOlsiLy8gc3JjL3NhbmRib3gvZGVmaW5lLXVubGlzdGVkLXNjcmlwdC50c1xuZnVuY3Rpb24gZGVmaW5lVW5saXN0ZWRTY3JpcHQoYXJnKSB7XG4gIGlmICh0eXBlb2YgYXJnID09PSBcImZ1bmN0aW9uXCIpXG4gICAgcmV0dXJuIHsgbWFpbjogYXJnIH07XG4gIHJldHVybiBhcmc7XG59XG5cbi8vIHNyYy9zYW5kYm94L2RlZmluZS1iYWNrZ3JvdW5kLnRzXG5mdW5jdGlvbiBkZWZpbmVCYWNrZ3JvdW5kKGFyZykge1xuICBpZiAodHlwZW9mIGFyZyA9PT0gXCJmdW5jdGlvblwiKVxuICAgIHJldHVybiB7IG1haW46IGFyZyB9O1xuICByZXR1cm4gYXJnO1xufVxuXG4vLyBzcmMvc2FuZGJveC9kZWZpbmUtY29udGVudC1zY3JpcHQudHNcbmZ1bmN0aW9uIGRlZmluZUNvbnRlbnRTY3JpcHQoZGVmaW5pdGlvbikge1xuICByZXR1cm4gZGVmaW5pdGlvbjtcbn1cblxuLy8gc3JjL3NhbmRib3gvaW5kZXgudHNcbmV4cG9ydCAqIGZyb20gXCJAd2ViZXh0LWNvcmUvbWF0Y2gtcGF0dGVybnNcIjtcbmV4cG9ydCB7XG4gIGRlZmluZUJhY2tncm91bmQsXG4gIGRlZmluZUNvbnRlbnRTY3JpcHQsXG4gIGRlZmluZVVubGlzdGVkU2NyaXB0XG59O1xuIiwiKGZ1bmN0aW9uIChnbG9iYWwsIGZhY3RvcnkpIHtcbiAgaWYgKHR5cGVvZiBkZWZpbmUgPT09IFwiZnVuY3Rpb25cIiAmJiBkZWZpbmUuYW1kKSB7XG4gICAgZGVmaW5lKFwid2ViZXh0ZW5zaW9uLXBvbHlmaWxsXCIsIFtcIm1vZHVsZVwiXSwgZmFjdG9yeSk7XG4gIH0gZWxzZSBpZiAodHlwZW9mIGV4cG9ydHMgIT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICBmYWN0b3J5KG1vZHVsZSk7XG4gIH0gZWxzZSB7XG4gICAgdmFyIG1vZCA9IHtcbiAgICAgIGV4cG9ydHM6IHt9XG4gICAgfTtcbiAgICBmYWN0b3J5KG1vZCk7XG4gICAgZ2xvYmFsLmJyb3dzZXIgPSBtb2QuZXhwb3J0cztcbiAgfVxufSkodHlwZW9mIGdsb2JhbFRoaXMgIT09IFwidW5kZWZpbmVkXCIgPyBnbG9iYWxUaGlzIDogdHlwZW9mIHNlbGYgIT09IFwidW5kZWZpbmVkXCIgPyBzZWxmIDogdGhpcywgZnVuY3Rpb24gKG1vZHVsZSkge1xuICAvKiB3ZWJleHRlbnNpb24tcG9seWZpbGwgLSB2MC4xMC4wIC0gRnJpIEF1ZyAxMiAyMDIyIDE5OjQyOjQ0ICovXG5cbiAgLyogLSotIE1vZGU6IGluZGVudC10YWJzLW1vZGU6IG5pbDsganMtaW5kZW50LWxldmVsOiAyIC0qLSAqL1xuXG4gIC8qIHZpbTogc2V0IHN0cz0yIHN3PTIgZXQgdHc9ODA6ICovXG5cbiAgLyogVGhpcyBTb3VyY2UgQ29kZSBGb3JtIGlzIHN1YmplY3QgdG8gdGhlIHRlcm1zIG9mIHRoZSBNb3ppbGxhIFB1YmxpY1xuICAgKiBMaWNlbnNlLCB2LiAyLjAuIElmIGEgY29weSBvZiB0aGUgTVBMIHdhcyBub3QgZGlzdHJpYnV0ZWQgd2l0aCB0aGlzXG4gICAqIGZpbGUsIFlvdSBjYW4gb2J0YWluIG9uZSBhdCBodHRwOi8vbW96aWxsYS5vcmcvTVBMLzIuMC8uICovXG4gIFwidXNlIHN0cmljdFwiO1xuXG4gIGlmICghZ2xvYmFsVGhpcy5jaHJvbWU/LnJ1bnRpbWU/LmlkKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKFwiVGhpcyBzY3JpcHQgc2hvdWxkIG9ubHkgYmUgbG9hZGVkIGluIGEgYnJvd3NlciBleHRlbnNpb24uXCIpO1xuICB9XG5cbiAgaWYgKHR5cGVvZiBnbG9iYWxUaGlzLmJyb3dzZXIgPT09IFwidW5kZWZpbmVkXCIgfHwgT2JqZWN0LmdldFByb3RvdHlwZU9mKGdsb2JhbFRoaXMuYnJvd3NlcikgIT09IE9iamVjdC5wcm90b3R5cGUpIHtcbiAgICBjb25zdCBDSFJPTUVfU0VORF9NRVNTQUdFX0NBTExCQUNLX05PX1JFU1BPTlNFX01FU1NBR0UgPSBcIlRoZSBtZXNzYWdlIHBvcnQgY2xvc2VkIGJlZm9yZSBhIHJlc3BvbnNlIHdhcyByZWNlaXZlZC5cIjsgLy8gV3JhcHBpbmcgdGhlIGJ1bGsgb2YgdGhpcyBwb2x5ZmlsbCBpbiBhIG9uZS10aW1lLXVzZSBmdW5jdGlvbiBpcyBhIG1pbm9yXG4gICAgLy8gb3B0aW1pemF0aW9uIGZvciBGaXJlZm94LiBTaW5jZSBTcGlkZXJtb25rZXkgZG9lcyBub3QgZnVsbHkgcGFyc2UgdGhlXG4gICAgLy8gY29udGVudHMgb2YgYSBmdW5jdGlvbiB1bnRpbCB0aGUgZmlyc3QgdGltZSBpdCdzIGNhbGxlZCwgYW5kIHNpbmNlIGl0IHdpbGxcbiAgICAvLyBuZXZlciBhY3R1YWxseSBuZWVkIHRvIGJlIGNhbGxlZCwgdGhpcyBhbGxvd3MgdGhlIHBvbHlmaWxsIHRvIGJlIGluY2x1ZGVkXG4gICAgLy8gaW4gRmlyZWZveCBuZWFybHkgZm9yIGZyZWUuXG5cbiAgICBjb25zdCB3cmFwQVBJcyA9IGV4dGVuc2lvbkFQSXMgPT4ge1xuICAgICAgLy8gTk9URTogYXBpTWV0YWRhdGEgaXMgYXNzb2NpYXRlZCB0byB0aGUgY29udGVudCBvZiB0aGUgYXBpLW1ldGFkYXRhLmpzb24gZmlsZVxuICAgICAgLy8gYXQgYnVpbGQgdGltZSBieSByZXBsYWNpbmcgdGhlIGZvbGxvd2luZyBcImluY2x1ZGVcIiB3aXRoIHRoZSBjb250ZW50IG9mIHRoZVxuICAgICAgLy8gSlNPTiBmaWxlLlxuICAgICAgY29uc3QgYXBpTWV0YWRhdGEgPSB7XG4gICAgICAgIFwiYWxhcm1zXCI6IHtcbiAgICAgICAgICBcImNsZWFyXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAwLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDFcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwiY2xlYXJBbGxcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDAsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMFxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJnZXRcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDAsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJnZXRBbGxcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDAsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMFxuICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgXCJib29rbWFya3NcIjoge1xuICAgICAgICAgIFwiY3JlYXRlXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAxLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDFcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwiZ2V0XCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAxLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDFcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwiZ2V0Q2hpbGRyZW5cIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDEsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJnZXRSZWNlbnRcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDEsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJnZXRTdWJUcmVlXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAxLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDFcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwiZ2V0VHJlZVwiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMCxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAwXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcIm1vdmVcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDIsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMlxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJyZW1vdmVcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDEsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJyZW1vdmVUcmVlXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAxLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDFcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwic2VhcmNoXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAxLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDFcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwidXBkYXRlXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAyLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDJcbiAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIFwiYnJvd3NlckFjdGlvblwiOiB7XG4gICAgICAgICAgXCJkaXNhYmxlXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAwLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDEsXG4gICAgICAgICAgICBcImZhbGxiYWNrVG9Ob0NhbGxiYWNrXCI6IHRydWVcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwiZW5hYmxlXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAwLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDEsXG4gICAgICAgICAgICBcImZhbGxiYWNrVG9Ob0NhbGxiYWNrXCI6IHRydWVcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwiZ2V0QmFkZ2VCYWNrZ3JvdW5kQ29sb3JcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDEsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJnZXRCYWRnZVRleHRcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDEsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJnZXRQb3B1cFwiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMSxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAxXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcImdldFRpdGxlXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAxLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDFcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwib3BlblBvcHVwXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAwLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDBcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwic2V0QmFkZ2VCYWNrZ3JvdW5kQ29sb3JcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDEsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMSxcbiAgICAgICAgICAgIFwiZmFsbGJhY2tUb05vQ2FsbGJhY2tcIjogdHJ1ZVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJzZXRCYWRnZVRleHRcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDEsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMSxcbiAgICAgICAgICAgIFwiZmFsbGJhY2tUb05vQ2FsbGJhY2tcIjogdHJ1ZVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJzZXRJY29uXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAxLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDFcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwic2V0UG9wdXBcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDEsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMSxcbiAgICAgICAgICAgIFwiZmFsbGJhY2tUb05vQ2FsbGJhY2tcIjogdHJ1ZVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJzZXRUaXRsZVwiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMSxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAxLFxuICAgICAgICAgICAgXCJmYWxsYmFja1RvTm9DYWxsYmFja1wiOiB0cnVlXG4gICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBcImJyb3dzaW5nRGF0YVwiOiB7XG4gICAgICAgICAgXCJyZW1vdmVcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDIsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMlxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJyZW1vdmVDYWNoZVwiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMSxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAxXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcInJlbW92ZUNvb2tpZXNcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDEsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJyZW1vdmVEb3dubG9hZHNcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDEsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJyZW1vdmVGb3JtRGF0YVwiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMSxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAxXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcInJlbW92ZUhpc3RvcnlcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDEsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJyZW1vdmVMb2NhbFN0b3JhZ2VcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDEsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJyZW1vdmVQYXNzd29yZHNcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDEsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJyZW1vdmVQbHVnaW5EYXRhXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAxLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDFcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwic2V0dGluZ3NcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDAsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMFxuICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgXCJjb21tYW5kc1wiOiB7XG4gICAgICAgICAgXCJnZXRBbGxcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDAsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMFxuICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgXCJjb250ZXh0TWVudXNcIjoge1xuICAgICAgICAgIFwicmVtb3ZlXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAxLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDFcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwicmVtb3ZlQWxsXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAwLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDBcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwidXBkYXRlXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAyLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDJcbiAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIFwiY29va2llc1wiOiB7XG4gICAgICAgICAgXCJnZXRcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDEsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJnZXRBbGxcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDEsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJnZXRBbGxDb29raWVTdG9yZXNcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDAsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMFxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJyZW1vdmVcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDEsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJzZXRcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDEsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMVxuICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgXCJkZXZ0b29sc1wiOiB7XG4gICAgICAgICAgXCJpbnNwZWN0ZWRXaW5kb3dcIjoge1xuICAgICAgICAgICAgXCJldmFsXCI6IHtcbiAgICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDEsXG4gICAgICAgICAgICAgIFwibWF4QXJnc1wiOiAyLFxuICAgICAgICAgICAgICBcInNpbmdsZUNhbGxiYWNrQXJnXCI6IGZhbHNlXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSxcbiAgICAgICAgICBcInBhbmVsc1wiOiB7XG4gICAgICAgICAgICBcImNyZWF0ZVwiOiB7XG4gICAgICAgICAgICAgIFwibWluQXJnc1wiOiAzLFxuICAgICAgICAgICAgICBcIm1heEFyZ3NcIjogMyxcbiAgICAgICAgICAgICAgXCJzaW5nbGVDYWxsYmFja0FyZ1wiOiB0cnVlXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgXCJlbGVtZW50c1wiOiB7XG4gICAgICAgICAgICAgIFwiY3JlYXRlU2lkZWJhclBhbmVcIjoge1xuICAgICAgICAgICAgICAgIFwibWluQXJnc1wiOiAxLFxuICAgICAgICAgICAgICAgIFwibWF4QXJnc1wiOiAxXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIFwiZG93bmxvYWRzXCI6IHtcbiAgICAgICAgICBcImNhbmNlbFwiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMSxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAxXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcImRvd25sb2FkXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAxLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDFcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwiZXJhc2VcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDEsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJnZXRGaWxlSWNvblwiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMSxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAyXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcIm9wZW5cIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDEsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMSxcbiAgICAgICAgICAgIFwiZmFsbGJhY2tUb05vQ2FsbGJhY2tcIjogdHJ1ZVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJwYXVzZVwiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMSxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAxXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcInJlbW92ZUZpbGVcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDEsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJyZXN1bWVcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDEsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJzZWFyY2hcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDEsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJzaG93XCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAxLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDEsXG4gICAgICAgICAgICBcImZhbGxiYWNrVG9Ob0NhbGxiYWNrXCI6IHRydWVcbiAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIFwiZXh0ZW5zaW9uXCI6IHtcbiAgICAgICAgICBcImlzQWxsb3dlZEZpbGVTY2hlbWVBY2Nlc3NcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDAsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMFxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJpc0FsbG93ZWRJbmNvZ25pdG9BY2Nlc3NcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDAsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMFxuICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgXCJoaXN0b3J5XCI6IHtcbiAgICAgICAgICBcImFkZFVybFwiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMSxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAxXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcImRlbGV0ZUFsbFwiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMCxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAwXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcImRlbGV0ZVJhbmdlXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAxLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDFcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwiZGVsZXRlVXJsXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAxLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDFcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwiZ2V0VmlzaXRzXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAxLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDFcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwic2VhcmNoXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAxLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDFcbiAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIFwiaTE4blwiOiB7XG4gICAgICAgICAgXCJkZXRlY3RMYW5ndWFnZVwiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMSxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAxXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcImdldEFjY2VwdExhbmd1YWdlc1wiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMCxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAwXG4gICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBcImlkZW50aXR5XCI6IHtcbiAgICAgICAgICBcImxhdW5jaFdlYkF1dGhGbG93XCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAxLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDFcbiAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIFwiaWRsZVwiOiB7XG4gICAgICAgICAgXCJxdWVyeVN0YXRlXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAxLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDFcbiAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIFwibWFuYWdlbWVudFwiOiB7XG4gICAgICAgICAgXCJnZXRcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDEsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJnZXRBbGxcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDAsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMFxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJnZXRTZWxmXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAwLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDBcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwic2V0RW5hYmxlZFwiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMixcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAyXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcInVuaW5zdGFsbFNlbGZcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDAsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMVxuICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgXCJub3RpZmljYXRpb25zXCI6IHtcbiAgICAgICAgICBcImNsZWFyXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAxLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDFcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwiY3JlYXRlXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAxLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDJcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwiZ2V0QWxsXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAwLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDBcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwiZ2V0UGVybWlzc2lvbkxldmVsXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAwLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDBcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwidXBkYXRlXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAyLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDJcbiAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIFwicGFnZUFjdGlvblwiOiB7XG4gICAgICAgICAgXCJnZXRQb3B1cFwiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMSxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAxXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcImdldFRpdGxlXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAxLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDFcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwiaGlkZVwiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMSxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAxLFxuICAgICAgICAgICAgXCJmYWxsYmFja1RvTm9DYWxsYmFja1wiOiB0cnVlXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcInNldEljb25cIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDEsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJzZXRQb3B1cFwiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMSxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAxLFxuICAgICAgICAgICAgXCJmYWxsYmFja1RvTm9DYWxsYmFja1wiOiB0cnVlXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcInNldFRpdGxlXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAxLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDEsXG4gICAgICAgICAgICBcImZhbGxiYWNrVG9Ob0NhbGxiYWNrXCI6IHRydWVcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwic2hvd1wiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMSxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAxLFxuICAgICAgICAgICAgXCJmYWxsYmFja1RvTm9DYWxsYmFja1wiOiB0cnVlXG4gICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBcInBlcm1pc3Npb25zXCI6IHtcbiAgICAgICAgICBcImNvbnRhaW5zXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAxLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDFcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwiZ2V0QWxsXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAwLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDBcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwicmVtb3ZlXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAxLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDFcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwicmVxdWVzdFwiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMSxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAxXG4gICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBcInJ1bnRpbWVcIjoge1xuICAgICAgICAgIFwiZ2V0QmFja2dyb3VuZFBhZ2VcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDAsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMFxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJnZXRQbGF0Zm9ybUluZm9cIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDAsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMFxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJvcGVuT3B0aW9uc1BhZ2VcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDAsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMFxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJyZXF1ZXN0VXBkYXRlQ2hlY2tcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDAsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMFxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJzZW5kTWVzc2FnZVwiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMSxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAzXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcInNlbmROYXRpdmVNZXNzYWdlXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAyLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDJcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwic2V0VW5pbnN0YWxsVVJMXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAxLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDFcbiAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIFwic2Vzc2lvbnNcIjoge1xuICAgICAgICAgIFwiZ2V0RGV2aWNlc1wiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMCxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAxXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcImdldFJlY2VudGx5Q2xvc2VkXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAwLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDFcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwicmVzdG9yZVwiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMCxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAxXG4gICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBcInN0b3JhZ2VcIjoge1xuICAgICAgICAgIFwibG9jYWxcIjoge1xuICAgICAgICAgICAgXCJjbGVhclwiOiB7XG4gICAgICAgICAgICAgIFwibWluQXJnc1wiOiAwLFxuICAgICAgICAgICAgICBcIm1heEFyZ3NcIjogMFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIFwiZ2V0XCI6IHtcbiAgICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDAsXG4gICAgICAgICAgICAgIFwibWF4QXJnc1wiOiAxXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgXCJnZXRCeXRlc0luVXNlXCI6IHtcbiAgICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDAsXG4gICAgICAgICAgICAgIFwibWF4QXJnc1wiOiAxXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgXCJyZW1vdmVcIjoge1xuICAgICAgICAgICAgICBcIm1pbkFyZ3NcIjogMSxcbiAgICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDFcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBcInNldFwiOiB7XG4gICAgICAgICAgICAgIFwibWluQXJnc1wiOiAxLFxuICAgICAgICAgICAgICBcIm1heEFyZ3NcIjogMVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJtYW5hZ2VkXCI6IHtcbiAgICAgICAgICAgIFwiZ2V0XCI6IHtcbiAgICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDAsXG4gICAgICAgICAgICAgIFwibWF4QXJnc1wiOiAxXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgXCJnZXRCeXRlc0luVXNlXCI6IHtcbiAgICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDAsXG4gICAgICAgICAgICAgIFwibWF4QXJnc1wiOiAxXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSxcbiAgICAgICAgICBcInN5bmNcIjoge1xuICAgICAgICAgICAgXCJjbGVhclwiOiB7XG4gICAgICAgICAgICAgIFwibWluQXJnc1wiOiAwLFxuICAgICAgICAgICAgICBcIm1heEFyZ3NcIjogMFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIFwiZ2V0XCI6IHtcbiAgICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDAsXG4gICAgICAgICAgICAgIFwibWF4QXJnc1wiOiAxXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgXCJnZXRCeXRlc0luVXNlXCI6IHtcbiAgICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDAsXG4gICAgICAgICAgICAgIFwibWF4QXJnc1wiOiAxXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgXCJyZW1vdmVcIjoge1xuICAgICAgICAgICAgICBcIm1pbkFyZ3NcIjogMSxcbiAgICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDFcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBcInNldFwiOiB7XG4gICAgICAgICAgICAgIFwibWluQXJnc1wiOiAxLFxuICAgICAgICAgICAgICBcIm1heEFyZ3NcIjogMVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgXCJ0YWJzXCI6IHtcbiAgICAgICAgICBcImNhcHR1cmVWaXNpYmxlVGFiXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAwLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDJcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwiY3JlYXRlXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAxLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDFcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwiZGV0ZWN0TGFuZ3VhZ2VcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDAsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJkaXNjYXJkXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAwLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDFcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwiZHVwbGljYXRlXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAxLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDFcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwiZXhlY3V0ZVNjcmlwdFwiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMSxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAyXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcImdldFwiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMSxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAxXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcImdldEN1cnJlbnRcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDAsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMFxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJnZXRab29tXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAwLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDFcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwiZ2V0Wm9vbVNldHRpbmdzXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAwLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDFcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwiZ29CYWNrXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAwLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDFcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwiZ29Gb3J3YXJkXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAwLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDFcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwiaGlnaGxpZ2h0XCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAxLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDFcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwiaW5zZXJ0Q1NTXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAxLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDJcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwibW92ZVwiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMixcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAyXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcInF1ZXJ5XCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAxLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDFcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwicmVsb2FkXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAwLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDJcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwicmVtb3ZlXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAxLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDFcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwicmVtb3ZlQ1NTXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAxLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDJcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwic2VuZE1lc3NhZ2VcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDIsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogM1xuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJzZXRab29tXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAxLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDJcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwic2V0Wm9vbVNldHRpbmdzXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAxLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDJcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwidXBkYXRlXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAxLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDJcbiAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIFwidG9wU2l0ZXNcIjoge1xuICAgICAgICAgIFwiZ2V0XCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAwLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDBcbiAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIFwid2ViTmF2aWdhdGlvblwiOiB7XG4gICAgICAgICAgXCJnZXRBbGxGcmFtZXNcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDEsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJnZXRGcmFtZVwiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMSxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAxXG4gICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBcIndlYlJlcXVlc3RcIjoge1xuICAgICAgICAgIFwiaGFuZGxlckJlaGF2aW9yQ2hhbmdlZFwiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMCxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAwXG4gICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBcIndpbmRvd3NcIjoge1xuICAgICAgICAgIFwiY3JlYXRlXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAwLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDFcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwiZ2V0XCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAxLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDJcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwiZ2V0QWxsXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAwLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDFcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwiZ2V0Q3VycmVudFwiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMCxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAxXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcImdldExhc3RGb2N1c2VkXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAwLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDFcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwicmVtb3ZlXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAxLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDFcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwidXBkYXRlXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAyLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDJcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH07XG5cbiAgICAgIGlmIChPYmplY3Qua2V5cyhhcGlNZXRhZGF0YSkubGVuZ3RoID09PSAwKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcImFwaS1tZXRhZGF0YS5qc29uIGhhcyBub3QgYmVlbiBpbmNsdWRlZCBpbiBicm93c2VyLXBvbHlmaWxsXCIpO1xuICAgICAgfVxuICAgICAgLyoqXG4gICAgICAgKiBBIFdlYWtNYXAgc3ViY2xhc3Mgd2hpY2ggY3JlYXRlcyBhbmQgc3RvcmVzIGEgdmFsdWUgZm9yIGFueSBrZXkgd2hpY2ggZG9lc1xuICAgICAgICogbm90IGV4aXN0IHdoZW4gYWNjZXNzZWQsIGJ1dCBiZWhhdmVzIGV4YWN0bHkgYXMgYW4gb3JkaW5hcnkgV2Vha01hcFxuICAgICAgICogb3RoZXJ3aXNlLlxuICAgICAgICpcbiAgICAgICAqIEBwYXJhbSB7ZnVuY3Rpb259IGNyZWF0ZUl0ZW1cbiAgICAgICAqICAgICAgICBBIGZ1bmN0aW9uIHdoaWNoIHdpbGwgYmUgY2FsbGVkIGluIG9yZGVyIHRvIGNyZWF0ZSB0aGUgdmFsdWUgZm9yIGFueVxuICAgICAgICogICAgICAgIGtleSB3aGljaCBkb2VzIG5vdCBleGlzdCwgdGhlIGZpcnN0IHRpbWUgaXQgaXMgYWNjZXNzZWQuIFRoZVxuICAgICAgICogICAgICAgIGZ1bmN0aW9uIHJlY2VpdmVzLCBhcyBpdHMgb25seSBhcmd1bWVudCwgdGhlIGtleSBiZWluZyBjcmVhdGVkLlxuICAgICAgICovXG5cblxuICAgICAgY2xhc3MgRGVmYXVsdFdlYWtNYXAgZXh0ZW5kcyBXZWFrTWFwIHtcbiAgICAgICAgY29uc3RydWN0b3IoY3JlYXRlSXRlbSwgaXRlbXMgPSB1bmRlZmluZWQpIHtcbiAgICAgICAgICBzdXBlcihpdGVtcyk7XG4gICAgICAgICAgdGhpcy5jcmVhdGVJdGVtID0gY3JlYXRlSXRlbTtcbiAgICAgICAgfVxuXG4gICAgICAgIGdldChrZXkpIHtcbiAgICAgICAgICBpZiAoIXRoaXMuaGFzKGtleSkpIHtcbiAgICAgICAgICAgIHRoaXMuc2V0KGtleSwgdGhpcy5jcmVhdGVJdGVtKGtleSkpO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIHJldHVybiBzdXBlci5nZXQoa2V5KTtcbiAgICAgICAgfVxuXG4gICAgICB9XG4gICAgICAvKipcbiAgICAgICAqIFJldHVybnMgdHJ1ZSBpZiB0aGUgZ2l2ZW4gb2JqZWN0IGlzIGFuIG9iamVjdCB3aXRoIGEgYHRoZW5gIG1ldGhvZCwgYW5kIGNhblxuICAgICAgICogdGhlcmVmb3JlIGJlIGFzc3VtZWQgdG8gYmVoYXZlIGFzIGEgUHJvbWlzZS5cbiAgICAgICAqXG4gICAgICAgKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byB0ZXN0LlxuICAgICAgICogQHJldHVybnMge2Jvb2xlYW59IFRydWUgaWYgdGhlIHZhbHVlIGlzIHRoZW5hYmxlLlxuICAgICAgICovXG5cblxuICAgICAgY29uc3QgaXNUaGVuYWJsZSA9IHZhbHVlID0+IHtcbiAgICAgICAgcmV0dXJuIHZhbHVlICYmIHR5cGVvZiB2YWx1ZSA9PT0gXCJvYmplY3RcIiAmJiB0eXBlb2YgdmFsdWUudGhlbiA9PT0gXCJmdW5jdGlvblwiO1xuICAgICAgfTtcbiAgICAgIC8qKlxuICAgICAgICogQ3JlYXRlcyBhbmQgcmV0dXJucyBhIGZ1bmN0aW9uIHdoaWNoLCB3aGVuIGNhbGxlZCwgd2lsbCByZXNvbHZlIG9yIHJlamVjdFxuICAgICAgICogdGhlIGdpdmVuIHByb21pc2UgYmFzZWQgb24gaG93IGl0IGlzIGNhbGxlZDpcbiAgICAgICAqXG4gICAgICAgKiAtIElmLCB3aGVuIGNhbGxlZCwgYGNocm9tZS5ydW50aW1lLmxhc3RFcnJvcmAgY29udGFpbnMgYSBub24tbnVsbCBvYmplY3QsXG4gICAgICAgKiAgIHRoZSBwcm9taXNlIGlzIHJlamVjdGVkIHdpdGggdGhhdCB2YWx1ZS5cbiAgICAgICAqIC0gSWYgdGhlIGZ1bmN0aW9uIGlzIGNhbGxlZCB3aXRoIGV4YWN0bHkgb25lIGFyZ3VtZW50LCB0aGUgcHJvbWlzZSBpc1xuICAgICAgICogICByZXNvbHZlZCB0byB0aGF0IHZhbHVlLlxuICAgICAgICogLSBPdGhlcndpc2UsIHRoZSBwcm9taXNlIGlzIHJlc29sdmVkIHRvIGFuIGFycmF5IGNvbnRhaW5pbmcgYWxsIG9mIHRoZVxuICAgICAgICogICBmdW5jdGlvbidzIGFyZ3VtZW50cy5cbiAgICAgICAqXG4gICAgICAgKiBAcGFyYW0ge29iamVjdH0gcHJvbWlzZVxuICAgICAgICogICAgICAgIEFuIG9iamVjdCBjb250YWluaW5nIHRoZSByZXNvbHV0aW9uIGFuZCByZWplY3Rpb24gZnVuY3Rpb25zIG9mIGFcbiAgICAgICAqICAgICAgICBwcm9taXNlLlxuICAgICAgICogQHBhcmFtIHtmdW5jdGlvbn0gcHJvbWlzZS5yZXNvbHZlXG4gICAgICAgKiAgICAgICAgVGhlIHByb21pc2UncyByZXNvbHV0aW9uIGZ1bmN0aW9uLlxuICAgICAgICogQHBhcmFtIHtmdW5jdGlvbn0gcHJvbWlzZS5yZWplY3RcbiAgICAgICAqICAgICAgICBUaGUgcHJvbWlzZSdzIHJlamVjdGlvbiBmdW5jdGlvbi5cbiAgICAgICAqIEBwYXJhbSB7b2JqZWN0fSBtZXRhZGF0YVxuICAgICAgICogICAgICAgIE1ldGFkYXRhIGFib3V0IHRoZSB3cmFwcGVkIG1ldGhvZCB3aGljaCBoYXMgY3JlYXRlZCB0aGUgY2FsbGJhY2suXG4gICAgICAgKiBAcGFyYW0ge2Jvb2xlYW59IG1ldGFkYXRhLnNpbmdsZUNhbGxiYWNrQXJnXG4gICAgICAgKiAgICAgICAgV2hldGhlciBvciBub3QgdGhlIHByb21pc2UgaXMgcmVzb2x2ZWQgd2l0aCBvbmx5IHRoZSBmaXJzdFxuICAgICAgICogICAgICAgIGFyZ3VtZW50IG9mIHRoZSBjYWxsYmFjaywgYWx0ZXJuYXRpdmVseSBhbiBhcnJheSBvZiBhbGwgdGhlXG4gICAgICAgKiAgICAgICAgY2FsbGJhY2sgYXJndW1lbnRzIGlzIHJlc29sdmVkLiBCeSBkZWZhdWx0LCBpZiB0aGUgY2FsbGJhY2tcbiAgICAgICAqICAgICAgICBmdW5jdGlvbiBpcyBpbnZva2VkIHdpdGggb25seSBhIHNpbmdsZSBhcmd1bWVudCwgdGhhdCB3aWxsIGJlXG4gICAgICAgKiAgICAgICAgcmVzb2x2ZWQgdG8gdGhlIHByb21pc2UsIHdoaWxlIGFsbCBhcmd1bWVudHMgd2lsbCBiZSByZXNvbHZlZCBhc1xuICAgICAgICogICAgICAgIGFuIGFycmF5IGlmIG11bHRpcGxlIGFyZSBnaXZlbi5cbiAgICAgICAqXG4gICAgICAgKiBAcmV0dXJucyB7ZnVuY3Rpb259XG4gICAgICAgKiAgICAgICAgVGhlIGdlbmVyYXRlZCBjYWxsYmFjayBmdW5jdGlvbi5cbiAgICAgICAqL1xuXG5cbiAgICAgIGNvbnN0IG1ha2VDYWxsYmFjayA9IChwcm9taXNlLCBtZXRhZGF0YSkgPT4ge1xuICAgICAgICByZXR1cm4gKC4uLmNhbGxiYWNrQXJncykgPT4ge1xuICAgICAgICAgIGlmIChleHRlbnNpb25BUElzLnJ1bnRpbWUubGFzdEVycm9yKSB7XG4gICAgICAgICAgICBwcm9taXNlLnJlamVjdChuZXcgRXJyb3IoZXh0ZW5zaW9uQVBJcy5ydW50aW1lLmxhc3RFcnJvci5tZXNzYWdlKSk7XG4gICAgICAgICAgfSBlbHNlIGlmIChtZXRhZGF0YS5zaW5nbGVDYWxsYmFja0FyZyB8fCBjYWxsYmFja0FyZ3MubGVuZ3RoIDw9IDEgJiYgbWV0YWRhdGEuc2luZ2xlQ2FsbGJhY2tBcmcgIT09IGZhbHNlKSB7XG4gICAgICAgICAgICBwcm9taXNlLnJlc29sdmUoY2FsbGJhY2tBcmdzWzBdKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcHJvbWlzZS5yZXNvbHZlKGNhbGxiYWNrQXJncyk7XG4gICAgICAgICAgfVxuICAgICAgICB9O1xuICAgICAgfTtcblxuICAgICAgY29uc3QgcGx1cmFsaXplQXJndW1lbnRzID0gbnVtQXJncyA9PiBudW1BcmdzID09IDEgPyBcImFyZ3VtZW50XCIgOiBcImFyZ3VtZW50c1wiO1xuICAgICAgLyoqXG4gICAgICAgKiBDcmVhdGVzIGEgd3JhcHBlciBmdW5jdGlvbiBmb3IgYSBtZXRob2Qgd2l0aCB0aGUgZ2l2ZW4gbmFtZSBhbmQgbWV0YWRhdGEuXG4gICAgICAgKlxuICAgICAgICogQHBhcmFtIHtzdHJpbmd9IG5hbWVcbiAgICAgICAqICAgICAgICBUaGUgbmFtZSBvZiB0aGUgbWV0aG9kIHdoaWNoIGlzIGJlaW5nIHdyYXBwZWQuXG4gICAgICAgKiBAcGFyYW0ge29iamVjdH0gbWV0YWRhdGFcbiAgICAgICAqICAgICAgICBNZXRhZGF0YSBhYm91dCB0aGUgbWV0aG9kIGJlaW5nIHdyYXBwZWQuXG4gICAgICAgKiBAcGFyYW0ge2ludGVnZXJ9IG1ldGFkYXRhLm1pbkFyZ3NcbiAgICAgICAqICAgICAgICBUaGUgbWluaW11bSBudW1iZXIgb2YgYXJndW1lbnRzIHdoaWNoIG11c3QgYmUgcGFzc2VkIHRvIHRoZVxuICAgICAgICogICAgICAgIGZ1bmN0aW9uLiBJZiBjYWxsZWQgd2l0aCBmZXdlciB0aGFuIHRoaXMgbnVtYmVyIG9mIGFyZ3VtZW50cywgdGhlXG4gICAgICAgKiAgICAgICAgd3JhcHBlciB3aWxsIHJhaXNlIGFuIGV4Y2VwdGlvbi5cbiAgICAgICAqIEBwYXJhbSB7aW50ZWdlcn0gbWV0YWRhdGEubWF4QXJnc1xuICAgICAgICogICAgICAgIFRoZSBtYXhpbXVtIG51bWJlciBvZiBhcmd1bWVudHMgd2hpY2ggbWF5IGJlIHBhc3NlZCB0byB0aGVcbiAgICAgICAqICAgICAgICBmdW5jdGlvbi4gSWYgY2FsbGVkIHdpdGggbW9yZSB0aGFuIHRoaXMgbnVtYmVyIG9mIGFyZ3VtZW50cywgdGhlXG4gICAgICAgKiAgICAgICAgd3JhcHBlciB3aWxsIHJhaXNlIGFuIGV4Y2VwdGlvbi5cbiAgICAgICAqIEBwYXJhbSB7Ym9vbGVhbn0gbWV0YWRhdGEuc2luZ2xlQ2FsbGJhY2tBcmdcbiAgICAgICAqICAgICAgICBXaGV0aGVyIG9yIG5vdCB0aGUgcHJvbWlzZSBpcyByZXNvbHZlZCB3aXRoIG9ubHkgdGhlIGZpcnN0XG4gICAgICAgKiAgICAgICAgYXJndW1lbnQgb2YgdGhlIGNhbGxiYWNrLCBhbHRlcm5hdGl2ZWx5IGFuIGFycmF5IG9mIGFsbCB0aGVcbiAgICAgICAqICAgICAgICBjYWxsYmFjayBhcmd1bWVudHMgaXMgcmVzb2x2ZWQuIEJ5IGRlZmF1bHQsIGlmIHRoZSBjYWxsYmFja1xuICAgICAgICogICAgICAgIGZ1bmN0aW9uIGlzIGludm9rZWQgd2l0aCBvbmx5IGEgc2luZ2xlIGFyZ3VtZW50LCB0aGF0IHdpbGwgYmVcbiAgICAgICAqICAgICAgICByZXNvbHZlZCB0byB0aGUgcHJvbWlzZSwgd2hpbGUgYWxsIGFyZ3VtZW50cyB3aWxsIGJlIHJlc29sdmVkIGFzXG4gICAgICAgKiAgICAgICAgYW4gYXJyYXkgaWYgbXVsdGlwbGUgYXJlIGdpdmVuLlxuICAgICAgICpcbiAgICAgICAqIEByZXR1cm5zIHtmdW5jdGlvbihvYmplY3QsIC4uLiopfVxuICAgICAgICogICAgICAgVGhlIGdlbmVyYXRlZCB3cmFwcGVyIGZ1bmN0aW9uLlxuICAgICAgICovXG5cblxuICAgICAgY29uc3Qgd3JhcEFzeW5jRnVuY3Rpb24gPSAobmFtZSwgbWV0YWRhdGEpID0+IHtcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uIGFzeW5jRnVuY3Rpb25XcmFwcGVyKHRhcmdldCwgLi4uYXJncykge1xuICAgICAgICAgIGlmIChhcmdzLmxlbmd0aCA8IG1ldGFkYXRhLm1pbkFyZ3MpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgRXhwZWN0ZWQgYXQgbGVhc3QgJHttZXRhZGF0YS5taW5BcmdzfSAke3BsdXJhbGl6ZUFyZ3VtZW50cyhtZXRhZGF0YS5taW5BcmdzKX0gZm9yICR7bmFtZX0oKSwgZ290ICR7YXJncy5sZW5ndGh9YCk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgaWYgKGFyZ3MubGVuZ3RoID4gbWV0YWRhdGEubWF4QXJncykge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBFeHBlY3RlZCBhdCBtb3N0ICR7bWV0YWRhdGEubWF4QXJnc30gJHtwbHVyYWxpemVBcmd1bWVudHMobWV0YWRhdGEubWF4QXJncyl9IGZvciAke25hbWV9KCksIGdvdCAke2FyZ3MubGVuZ3RofWApO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgICAgICBpZiAobWV0YWRhdGEuZmFsbGJhY2tUb05vQ2FsbGJhY2spIHtcbiAgICAgICAgICAgICAgLy8gVGhpcyBBUEkgbWV0aG9kIGhhcyBjdXJyZW50bHkgbm8gY2FsbGJhY2sgb24gQ2hyb21lLCBidXQgaXQgcmV0dXJuIGEgcHJvbWlzZSBvbiBGaXJlZm94LFxuICAgICAgICAgICAgICAvLyBhbmQgc28gdGhlIHBvbHlmaWxsIHdpbGwgdHJ5IHRvIGNhbGwgaXQgd2l0aCBhIGNhbGxiYWNrIGZpcnN0LCBhbmQgaXQgd2lsbCBmYWxsYmFja1xuICAgICAgICAgICAgICAvLyB0byBub3QgcGFzc2luZyB0aGUgY2FsbGJhY2sgaWYgdGhlIGZpcnN0IGNhbGwgZmFpbHMuXG4gICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgdGFyZ2V0W25hbWVdKC4uLmFyZ3MsIG1ha2VDYWxsYmFjayh7XG4gICAgICAgICAgICAgICAgICByZXNvbHZlLFxuICAgICAgICAgICAgICAgICAgcmVqZWN0XG4gICAgICAgICAgICAgICAgfSwgbWV0YWRhdGEpKTtcbiAgICAgICAgICAgICAgfSBjYXRjaCAoY2JFcnJvcikge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUud2FybihgJHtuYW1lfSBBUEkgbWV0aG9kIGRvZXNuJ3Qgc2VlbSB0byBzdXBwb3J0IHRoZSBjYWxsYmFjayBwYXJhbWV0ZXIsIGAgKyBcImZhbGxpbmcgYmFjayB0byBjYWxsIGl0IHdpdGhvdXQgYSBjYWxsYmFjazogXCIsIGNiRXJyb3IpO1xuICAgICAgICAgICAgICAgIHRhcmdldFtuYW1lXSguLi5hcmdzKTsgLy8gVXBkYXRlIHRoZSBBUEkgbWV0aG9kIG1ldGFkYXRhLCBzbyB0aGF0IHRoZSBuZXh0IEFQSSBjYWxscyB3aWxsIG5vdCB0cnkgdG9cbiAgICAgICAgICAgICAgICAvLyB1c2UgdGhlIHVuc3VwcG9ydGVkIGNhbGxiYWNrIGFueW1vcmUuXG5cbiAgICAgICAgICAgICAgICBtZXRhZGF0YS5mYWxsYmFja1RvTm9DYWxsYmFjayA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIG1ldGFkYXRhLm5vQ2FsbGJhY2sgPSB0cnVlO1xuICAgICAgICAgICAgICAgIHJlc29sdmUoKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIGlmIChtZXRhZGF0YS5ub0NhbGxiYWNrKSB7XG4gICAgICAgICAgICAgIHRhcmdldFtuYW1lXSguLi5hcmdzKTtcbiAgICAgICAgICAgICAgcmVzb2x2ZSgpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgdGFyZ2V0W25hbWVdKC4uLmFyZ3MsIG1ha2VDYWxsYmFjayh7XG4gICAgICAgICAgICAgICAgcmVzb2x2ZSxcbiAgICAgICAgICAgICAgICByZWplY3RcbiAgICAgICAgICAgICAgfSwgbWV0YWRhdGEpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KTtcbiAgICAgICAgfTtcbiAgICAgIH07XG4gICAgICAvKipcbiAgICAgICAqIFdyYXBzIGFuIGV4aXN0aW5nIG1ldGhvZCBvZiB0aGUgdGFyZ2V0IG9iamVjdCwgc28gdGhhdCBjYWxscyB0byBpdCBhcmVcbiAgICAgICAqIGludGVyY2VwdGVkIGJ5IHRoZSBnaXZlbiB3cmFwcGVyIGZ1bmN0aW9uLiBUaGUgd3JhcHBlciBmdW5jdGlvbiByZWNlaXZlcyxcbiAgICAgICAqIGFzIGl0cyBmaXJzdCBhcmd1bWVudCwgdGhlIG9yaWdpbmFsIGB0YXJnZXRgIG9iamVjdCwgZm9sbG93ZWQgYnkgZWFjaCBvZlxuICAgICAgICogdGhlIGFyZ3VtZW50cyBwYXNzZWQgdG8gdGhlIG9yaWdpbmFsIG1ldGhvZC5cbiAgICAgICAqXG4gICAgICAgKiBAcGFyYW0ge29iamVjdH0gdGFyZ2V0XG4gICAgICAgKiAgICAgICAgVGhlIG9yaWdpbmFsIHRhcmdldCBvYmplY3QgdGhhdCB0aGUgd3JhcHBlZCBtZXRob2QgYmVsb25ncyB0by5cbiAgICAgICAqIEBwYXJhbSB7ZnVuY3Rpb259IG1ldGhvZFxuICAgICAgICogICAgICAgIFRoZSBtZXRob2QgYmVpbmcgd3JhcHBlZC4gVGhpcyBpcyB1c2VkIGFzIHRoZSB0YXJnZXQgb2YgdGhlIFByb3h5XG4gICAgICAgKiAgICAgICAgb2JqZWN0IHdoaWNoIGlzIGNyZWF0ZWQgdG8gd3JhcCB0aGUgbWV0aG9kLlxuICAgICAgICogQHBhcmFtIHtmdW5jdGlvbn0gd3JhcHBlclxuICAgICAgICogICAgICAgIFRoZSB3cmFwcGVyIGZ1bmN0aW9uIHdoaWNoIGlzIGNhbGxlZCBpbiBwbGFjZSBvZiBhIGRpcmVjdCBpbnZvY2F0aW9uXG4gICAgICAgKiAgICAgICAgb2YgdGhlIHdyYXBwZWQgbWV0aG9kLlxuICAgICAgICpcbiAgICAgICAqIEByZXR1cm5zIHtQcm94eTxmdW5jdGlvbj59XG4gICAgICAgKiAgICAgICAgQSBQcm94eSBvYmplY3QgZm9yIHRoZSBnaXZlbiBtZXRob2QsIHdoaWNoIGludm9rZXMgdGhlIGdpdmVuIHdyYXBwZXJcbiAgICAgICAqICAgICAgICBtZXRob2QgaW4gaXRzIHBsYWNlLlxuICAgICAgICovXG5cblxuICAgICAgY29uc3Qgd3JhcE1ldGhvZCA9ICh0YXJnZXQsIG1ldGhvZCwgd3JhcHBlcikgPT4ge1xuICAgICAgICByZXR1cm4gbmV3IFByb3h5KG1ldGhvZCwge1xuICAgICAgICAgIGFwcGx5KHRhcmdldE1ldGhvZCwgdGhpc09iaiwgYXJncykge1xuICAgICAgICAgICAgcmV0dXJuIHdyYXBwZXIuY2FsbCh0aGlzT2JqLCB0YXJnZXQsIC4uLmFyZ3MpO1xuICAgICAgICAgIH1cblxuICAgICAgICB9KTtcbiAgICAgIH07XG5cbiAgICAgIGxldCBoYXNPd25Qcm9wZXJ0eSA9IEZ1bmN0aW9uLmNhbGwuYmluZChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5KTtcbiAgICAgIC8qKlxuICAgICAgICogV3JhcHMgYW4gb2JqZWN0IGluIGEgUHJveHkgd2hpY2ggaW50ZXJjZXB0cyBhbmQgd3JhcHMgY2VydGFpbiBtZXRob2RzXG4gICAgICAgKiBiYXNlZCBvbiB0aGUgZ2l2ZW4gYHdyYXBwZXJzYCBhbmQgYG1ldGFkYXRhYCBvYmplY3RzLlxuICAgICAgICpcbiAgICAgICAqIEBwYXJhbSB7b2JqZWN0fSB0YXJnZXRcbiAgICAgICAqICAgICAgICBUaGUgdGFyZ2V0IG9iamVjdCB0byB3cmFwLlxuICAgICAgICpcbiAgICAgICAqIEBwYXJhbSB7b2JqZWN0fSBbd3JhcHBlcnMgPSB7fV1cbiAgICAgICAqICAgICAgICBBbiBvYmplY3QgdHJlZSBjb250YWluaW5nIHdyYXBwZXIgZnVuY3Rpb25zIGZvciBzcGVjaWFsIGNhc2VzLiBBbnlcbiAgICAgICAqICAgICAgICBmdW5jdGlvbiBwcmVzZW50IGluIHRoaXMgb2JqZWN0IHRyZWUgaXMgY2FsbGVkIGluIHBsYWNlIG9mIHRoZVxuICAgICAgICogICAgICAgIG1ldGhvZCBpbiB0aGUgc2FtZSBsb2NhdGlvbiBpbiB0aGUgYHRhcmdldGAgb2JqZWN0IHRyZWUuIFRoZXNlXG4gICAgICAgKiAgICAgICAgd3JhcHBlciBtZXRob2RzIGFyZSBpbnZva2VkIGFzIGRlc2NyaWJlZCBpbiB7QHNlZSB3cmFwTWV0aG9kfS5cbiAgICAgICAqXG4gICAgICAgKiBAcGFyYW0ge29iamVjdH0gW21ldGFkYXRhID0ge31dXG4gICAgICAgKiAgICAgICAgQW4gb2JqZWN0IHRyZWUgY29udGFpbmluZyBtZXRhZGF0YSB1c2VkIHRvIGF1dG9tYXRpY2FsbHkgZ2VuZXJhdGVcbiAgICAgICAqICAgICAgICBQcm9taXNlLWJhc2VkIHdyYXBwZXIgZnVuY3Rpb25zIGZvciBhc3luY2hyb25vdXMuIEFueSBmdW5jdGlvbiBpblxuICAgICAgICogICAgICAgIHRoZSBgdGFyZ2V0YCBvYmplY3QgdHJlZSB3aGljaCBoYXMgYSBjb3JyZXNwb25kaW5nIG1ldGFkYXRhIG9iamVjdFxuICAgICAgICogICAgICAgIGluIHRoZSBzYW1lIGxvY2F0aW9uIGluIHRoZSBgbWV0YWRhdGFgIHRyZWUgaXMgcmVwbGFjZWQgd2l0aCBhblxuICAgICAgICogICAgICAgIGF1dG9tYXRpY2FsbHktZ2VuZXJhdGVkIHdyYXBwZXIgZnVuY3Rpb24sIGFzIGRlc2NyaWJlZCBpblxuICAgICAgICogICAgICAgIHtAc2VlIHdyYXBBc3luY0Z1bmN0aW9ufVxuICAgICAgICpcbiAgICAgICAqIEByZXR1cm5zIHtQcm94eTxvYmplY3Q+fVxuICAgICAgICovXG5cbiAgICAgIGNvbnN0IHdyYXBPYmplY3QgPSAodGFyZ2V0LCB3cmFwcGVycyA9IHt9LCBtZXRhZGF0YSA9IHt9KSA9PiB7XG4gICAgICAgIGxldCBjYWNoZSA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG4gICAgICAgIGxldCBoYW5kbGVycyA9IHtcbiAgICAgICAgICBoYXMocHJveHlUYXJnZXQsIHByb3ApIHtcbiAgICAgICAgICAgIHJldHVybiBwcm9wIGluIHRhcmdldCB8fCBwcm9wIGluIGNhY2hlO1xuICAgICAgICAgIH0sXG5cbiAgICAgICAgICBnZXQocHJveHlUYXJnZXQsIHByb3AsIHJlY2VpdmVyKSB7XG4gICAgICAgICAgICBpZiAocHJvcCBpbiBjYWNoZSkge1xuICAgICAgICAgICAgICByZXR1cm4gY2FjaGVbcHJvcF07XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICghKHByb3AgaW4gdGFyZ2V0KSkge1xuICAgICAgICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBsZXQgdmFsdWUgPSB0YXJnZXRbcHJvcF07XG5cbiAgICAgICAgICAgIGlmICh0eXBlb2YgdmFsdWUgPT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgICAgICAgICAvLyBUaGlzIGlzIGEgbWV0aG9kIG9uIHRoZSB1bmRlcmx5aW5nIG9iamVjdC4gQ2hlY2sgaWYgd2UgbmVlZCB0byBkb1xuICAgICAgICAgICAgICAvLyBhbnkgd3JhcHBpbmcuXG4gICAgICAgICAgICAgIGlmICh0eXBlb2Ygd3JhcHBlcnNbcHJvcF0gPT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgICAgICAgICAgIC8vIFdlIGhhdmUgYSBzcGVjaWFsLWNhc2Ugd3JhcHBlciBmb3IgdGhpcyBtZXRob2QuXG4gICAgICAgICAgICAgICAgdmFsdWUgPSB3cmFwTWV0aG9kKHRhcmdldCwgdGFyZ2V0W3Byb3BdLCB3cmFwcGVyc1twcm9wXSk7XG4gICAgICAgICAgICAgIH0gZWxzZSBpZiAoaGFzT3duUHJvcGVydHkobWV0YWRhdGEsIHByb3ApKSB7XG4gICAgICAgICAgICAgICAgLy8gVGhpcyBpcyBhbiBhc3luYyBtZXRob2QgdGhhdCB3ZSBoYXZlIG1ldGFkYXRhIGZvci4gQ3JlYXRlIGFcbiAgICAgICAgICAgICAgICAvLyBQcm9taXNlIHdyYXBwZXIgZm9yIGl0LlxuICAgICAgICAgICAgICAgIGxldCB3cmFwcGVyID0gd3JhcEFzeW5jRnVuY3Rpb24ocHJvcCwgbWV0YWRhdGFbcHJvcF0pO1xuICAgICAgICAgICAgICAgIHZhbHVlID0gd3JhcE1ldGhvZCh0YXJnZXQsIHRhcmdldFtwcm9wXSwgd3JhcHBlcik7XG4gICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgLy8gVGhpcyBpcyBhIG1ldGhvZCB0aGF0IHdlIGRvbid0IGtub3cgb3IgY2FyZSBhYm91dC4gUmV0dXJuIHRoZVxuICAgICAgICAgICAgICAgIC8vIG9yaWdpbmFsIG1ldGhvZCwgYm91bmQgdG8gdGhlIHVuZGVybHlpbmcgb2JqZWN0LlxuICAgICAgICAgICAgICAgIHZhbHVlID0gdmFsdWUuYmluZCh0YXJnZXQpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2UgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gXCJvYmplY3RcIiAmJiB2YWx1ZSAhPT0gbnVsbCAmJiAoaGFzT3duUHJvcGVydHkod3JhcHBlcnMsIHByb3ApIHx8IGhhc093blByb3BlcnR5KG1ldGFkYXRhLCBwcm9wKSkpIHtcbiAgICAgICAgICAgICAgLy8gVGhpcyBpcyBhbiBvYmplY3QgdGhhdCB3ZSBuZWVkIHRvIGRvIHNvbWUgd3JhcHBpbmcgZm9yIHRoZSBjaGlsZHJlblxuICAgICAgICAgICAgICAvLyBvZi4gQ3JlYXRlIGEgc3ViLW9iamVjdCB3cmFwcGVyIGZvciBpdCB3aXRoIHRoZSBhcHByb3ByaWF0ZSBjaGlsZFxuICAgICAgICAgICAgICAvLyBtZXRhZGF0YS5cbiAgICAgICAgICAgICAgdmFsdWUgPSB3cmFwT2JqZWN0KHZhbHVlLCB3cmFwcGVyc1twcm9wXSwgbWV0YWRhdGFbcHJvcF0pO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChoYXNPd25Qcm9wZXJ0eShtZXRhZGF0YSwgXCIqXCIpKSB7XG4gICAgICAgICAgICAgIC8vIFdyYXAgYWxsIHByb3BlcnRpZXMgaW4gKiBuYW1lc3BhY2UuXG4gICAgICAgICAgICAgIHZhbHVlID0gd3JhcE9iamVjdCh2YWx1ZSwgd3JhcHBlcnNbcHJvcF0sIG1ldGFkYXRhW1wiKlwiXSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAvLyBXZSBkb24ndCBuZWVkIHRvIGRvIGFueSB3cmFwcGluZyBmb3IgdGhpcyBwcm9wZXJ0eSxcbiAgICAgICAgICAgICAgLy8gc28ganVzdCBmb3J3YXJkIGFsbCBhY2Nlc3MgdG8gdGhlIHVuZGVybHlpbmcgb2JqZWN0LlxuICAgICAgICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoY2FjaGUsIHByb3AsIHtcbiAgICAgICAgICAgICAgICBjb25maWd1cmFibGU6IHRydWUsXG4gICAgICAgICAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcblxuICAgICAgICAgICAgICAgIGdldCgpIHtcbiAgICAgICAgICAgICAgICAgIHJldHVybiB0YXJnZXRbcHJvcF07XG4gICAgICAgICAgICAgICAgfSxcblxuICAgICAgICAgICAgICAgIHNldCh2YWx1ZSkge1xuICAgICAgICAgICAgICAgICAgdGFyZ2V0W3Byb3BdID0gdmFsdWU7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICByZXR1cm4gdmFsdWU7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGNhY2hlW3Byb3BdID0gdmFsdWU7XG4gICAgICAgICAgICByZXR1cm4gdmFsdWU7XG4gICAgICAgICAgfSxcblxuICAgICAgICAgIHNldChwcm94eVRhcmdldCwgcHJvcCwgdmFsdWUsIHJlY2VpdmVyKSB7XG4gICAgICAgICAgICBpZiAocHJvcCBpbiBjYWNoZSkge1xuICAgICAgICAgICAgICBjYWNoZVtwcm9wXSA9IHZhbHVlO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgdGFyZ2V0W3Byb3BdID0gdmFsdWU7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgIH0sXG5cbiAgICAgICAgICBkZWZpbmVQcm9wZXJ0eShwcm94eVRhcmdldCwgcHJvcCwgZGVzYykge1xuICAgICAgICAgICAgcmV0dXJuIFJlZmxlY3QuZGVmaW5lUHJvcGVydHkoY2FjaGUsIHByb3AsIGRlc2MpO1xuICAgICAgICAgIH0sXG5cbiAgICAgICAgICBkZWxldGVQcm9wZXJ0eShwcm94eVRhcmdldCwgcHJvcCkge1xuICAgICAgICAgICAgcmV0dXJuIFJlZmxlY3QuZGVsZXRlUHJvcGVydHkoY2FjaGUsIHByb3ApO1xuICAgICAgICAgIH1cblxuICAgICAgICB9OyAvLyBQZXIgY29udHJhY3Qgb2YgdGhlIFByb3h5IEFQSSwgdGhlIFwiZ2V0XCIgcHJveHkgaGFuZGxlciBtdXN0IHJldHVybiB0aGVcbiAgICAgICAgLy8gb3JpZ2luYWwgdmFsdWUgb2YgdGhlIHRhcmdldCBpZiB0aGF0IHZhbHVlIGlzIGRlY2xhcmVkIHJlYWQtb25seSBhbmRcbiAgICAgICAgLy8gbm9uLWNvbmZpZ3VyYWJsZS4gRm9yIHRoaXMgcmVhc29uLCB3ZSBjcmVhdGUgYW4gb2JqZWN0IHdpdGggdGhlXG4gICAgICAgIC8vIHByb3RvdHlwZSBzZXQgdG8gYHRhcmdldGAgaW5zdGVhZCBvZiB1c2luZyBgdGFyZ2V0YCBkaXJlY3RseS5cbiAgICAgICAgLy8gT3RoZXJ3aXNlIHdlIGNhbm5vdCByZXR1cm4gYSBjdXN0b20gb2JqZWN0IGZvciBBUElzIHRoYXRcbiAgICAgICAgLy8gYXJlIGRlY2xhcmVkIHJlYWQtb25seSBhbmQgbm9uLWNvbmZpZ3VyYWJsZSwgc3VjaCBhcyBgY2hyb21lLmRldnRvb2xzYC5cbiAgICAgICAgLy9cbiAgICAgICAgLy8gVGhlIHByb3h5IGhhbmRsZXJzIHRoZW1zZWx2ZXMgd2lsbCBzdGlsbCB1c2UgdGhlIG9yaWdpbmFsIGB0YXJnZXRgXG4gICAgICAgIC8vIGluc3RlYWQgb2YgdGhlIGBwcm94eVRhcmdldGAsIHNvIHRoYXQgdGhlIG1ldGhvZHMgYW5kIHByb3BlcnRpZXMgYXJlXG4gICAgICAgIC8vIGRlcmVmZXJlbmNlZCB2aWEgdGhlIG9yaWdpbmFsIHRhcmdldHMuXG5cbiAgICAgICAgbGV0IHByb3h5VGFyZ2V0ID0gT2JqZWN0LmNyZWF0ZSh0YXJnZXQpO1xuICAgICAgICByZXR1cm4gbmV3IFByb3h5KHByb3h5VGFyZ2V0LCBoYW5kbGVycyk7XG4gICAgICB9O1xuICAgICAgLyoqXG4gICAgICAgKiBDcmVhdGVzIGEgc2V0IG9mIHdyYXBwZXIgZnVuY3Rpb25zIGZvciBhbiBldmVudCBvYmplY3QsIHdoaWNoIGhhbmRsZXNcbiAgICAgICAqIHdyYXBwaW5nIG9mIGxpc3RlbmVyIGZ1bmN0aW9ucyB0aGF0IHRob3NlIG1lc3NhZ2VzIGFyZSBwYXNzZWQuXG4gICAgICAgKlxuICAgICAgICogQSBzaW5nbGUgd3JhcHBlciBpcyBjcmVhdGVkIGZvciBlYWNoIGxpc3RlbmVyIGZ1bmN0aW9uLCBhbmQgc3RvcmVkIGluIGFcbiAgICAgICAqIG1hcC4gU3Vic2VxdWVudCBjYWxscyB0byBgYWRkTGlzdGVuZXJgLCBgaGFzTGlzdGVuZXJgLCBvciBgcmVtb3ZlTGlzdGVuZXJgXG4gICAgICAgKiByZXRyaWV2ZSB0aGUgb3JpZ2luYWwgd3JhcHBlciwgc28gdGhhdCAgYXR0ZW1wdHMgdG8gcmVtb3ZlIGFcbiAgICAgICAqIHByZXZpb3VzbHktYWRkZWQgbGlzdGVuZXIgd29yayBhcyBleHBlY3RlZC5cbiAgICAgICAqXG4gICAgICAgKiBAcGFyYW0ge0RlZmF1bHRXZWFrTWFwPGZ1bmN0aW9uLCBmdW5jdGlvbj59IHdyYXBwZXJNYXBcbiAgICAgICAqICAgICAgICBBIERlZmF1bHRXZWFrTWFwIG9iamVjdCB3aGljaCB3aWxsIGNyZWF0ZSB0aGUgYXBwcm9wcmlhdGUgd3JhcHBlclxuICAgICAgICogICAgICAgIGZvciBhIGdpdmVuIGxpc3RlbmVyIGZ1bmN0aW9uIHdoZW4gb25lIGRvZXMgbm90IGV4aXN0LCBhbmQgcmV0cmlldmVcbiAgICAgICAqICAgICAgICBhbiBleGlzdGluZyBvbmUgd2hlbiBpdCBkb2VzLlxuICAgICAgICpcbiAgICAgICAqIEByZXR1cm5zIHtvYmplY3R9XG4gICAgICAgKi9cblxuXG4gICAgICBjb25zdCB3cmFwRXZlbnQgPSB3cmFwcGVyTWFwID0+ICh7XG4gICAgICAgIGFkZExpc3RlbmVyKHRhcmdldCwgbGlzdGVuZXIsIC4uLmFyZ3MpIHtcbiAgICAgICAgICB0YXJnZXQuYWRkTGlzdGVuZXIod3JhcHBlck1hcC5nZXQobGlzdGVuZXIpLCAuLi5hcmdzKTtcbiAgICAgICAgfSxcblxuICAgICAgICBoYXNMaXN0ZW5lcih0YXJnZXQsIGxpc3RlbmVyKSB7XG4gICAgICAgICAgcmV0dXJuIHRhcmdldC5oYXNMaXN0ZW5lcih3cmFwcGVyTWFwLmdldChsaXN0ZW5lcikpO1xuICAgICAgICB9LFxuXG4gICAgICAgIHJlbW92ZUxpc3RlbmVyKHRhcmdldCwgbGlzdGVuZXIpIHtcbiAgICAgICAgICB0YXJnZXQucmVtb3ZlTGlzdGVuZXIod3JhcHBlck1hcC5nZXQobGlzdGVuZXIpKTtcbiAgICAgICAgfVxuXG4gICAgICB9KTtcblxuICAgICAgY29uc3Qgb25SZXF1ZXN0RmluaXNoZWRXcmFwcGVycyA9IG5ldyBEZWZhdWx0V2Vha01hcChsaXN0ZW5lciA9PiB7XG4gICAgICAgIGlmICh0eXBlb2YgbGlzdGVuZXIgIT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgICAgIHJldHVybiBsaXN0ZW5lcjtcbiAgICAgICAgfVxuICAgICAgICAvKipcbiAgICAgICAgICogV3JhcHMgYW4gb25SZXF1ZXN0RmluaXNoZWQgbGlzdGVuZXIgZnVuY3Rpb24gc28gdGhhdCBpdCB3aWxsIHJldHVybiBhXG4gICAgICAgICAqIGBnZXRDb250ZW50KClgIHByb3BlcnR5IHdoaWNoIHJldHVybnMgYSBgUHJvbWlzZWAgcmF0aGVyIHRoYW4gdXNpbmcgYVxuICAgICAgICAgKiBjYWxsYmFjayBBUEkuXG4gICAgICAgICAqXG4gICAgICAgICAqIEBwYXJhbSB7b2JqZWN0fSByZXFcbiAgICAgICAgICogICAgICAgIFRoZSBIQVIgZW50cnkgb2JqZWN0IHJlcHJlc2VudGluZyB0aGUgbmV0d29yayByZXF1ZXN0LlxuICAgICAgICAgKi9cblxuXG4gICAgICAgIHJldHVybiBmdW5jdGlvbiBvblJlcXVlc3RGaW5pc2hlZChyZXEpIHtcbiAgICAgICAgICBjb25zdCB3cmFwcGVkUmVxID0gd3JhcE9iamVjdChyZXEsIHt9XG4gICAgICAgICAgLyogd3JhcHBlcnMgKi9cbiAgICAgICAgICAsIHtcbiAgICAgICAgICAgIGdldENvbnRlbnQ6IHtcbiAgICAgICAgICAgICAgbWluQXJnczogMCxcbiAgICAgICAgICAgICAgbWF4QXJnczogMFxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pO1xuICAgICAgICAgIGxpc3RlbmVyKHdyYXBwZWRSZXEpO1xuICAgICAgICB9O1xuICAgICAgfSk7XG4gICAgICBjb25zdCBvbk1lc3NhZ2VXcmFwcGVycyA9IG5ldyBEZWZhdWx0V2Vha01hcChsaXN0ZW5lciA9PiB7XG4gICAgICAgIGlmICh0eXBlb2YgbGlzdGVuZXIgIT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgICAgIHJldHVybiBsaXN0ZW5lcjtcbiAgICAgICAgfVxuICAgICAgICAvKipcbiAgICAgICAgICogV3JhcHMgYSBtZXNzYWdlIGxpc3RlbmVyIGZ1bmN0aW9uIHNvIHRoYXQgaXQgbWF5IHNlbmQgcmVzcG9uc2VzIGJhc2VkIG9uXG4gICAgICAgICAqIGl0cyByZXR1cm4gdmFsdWUsIHJhdGhlciB0aGFuIGJ5IHJldHVybmluZyBhIHNlbnRpbmVsIHZhbHVlIGFuZCBjYWxsaW5nIGFcbiAgICAgICAgICogY2FsbGJhY2suIElmIHRoZSBsaXN0ZW5lciBmdW5jdGlvbiByZXR1cm5zIGEgUHJvbWlzZSwgdGhlIHJlc3BvbnNlIGlzXG4gICAgICAgICAqIHNlbnQgd2hlbiB0aGUgcHJvbWlzZSBlaXRoZXIgcmVzb2x2ZXMgb3IgcmVqZWN0cy5cbiAgICAgICAgICpcbiAgICAgICAgICogQHBhcmFtIHsqfSBtZXNzYWdlXG4gICAgICAgICAqICAgICAgICBUaGUgbWVzc2FnZSBzZW50IGJ5IHRoZSBvdGhlciBlbmQgb2YgdGhlIGNoYW5uZWwuXG4gICAgICAgICAqIEBwYXJhbSB7b2JqZWN0fSBzZW5kZXJcbiAgICAgICAgICogICAgICAgIERldGFpbHMgYWJvdXQgdGhlIHNlbmRlciBvZiB0aGUgbWVzc2FnZS5cbiAgICAgICAgICogQHBhcmFtIHtmdW5jdGlvbigqKX0gc2VuZFJlc3BvbnNlXG4gICAgICAgICAqICAgICAgICBBIGNhbGxiYWNrIHdoaWNoLCB3aGVuIGNhbGxlZCB3aXRoIGFuIGFyYml0cmFyeSBhcmd1bWVudCwgc2VuZHNcbiAgICAgICAgICogICAgICAgIHRoYXQgdmFsdWUgYXMgYSByZXNwb25zZS5cbiAgICAgICAgICogQHJldHVybnMge2Jvb2xlYW59XG4gICAgICAgICAqICAgICAgICBUcnVlIGlmIHRoZSB3cmFwcGVkIGxpc3RlbmVyIHJldHVybmVkIGEgUHJvbWlzZSwgd2hpY2ggd2lsbCBsYXRlclxuICAgICAgICAgKiAgICAgICAgeWllbGQgYSByZXNwb25zZS4gRmFsc2Ugb3RoZXJ3aXNlLlxuICAgICAgICAgKi9cblxuXG4gICAgICAgIHJldHVybiBmdW5jdGlvbiBvbk1lc3NhZ2UobWVzc2FnZSwgc2VuZGVyLCBzZW5kUmVzcG9uc2UpIHtcbiAgICAgICAgICBsZXQgZGlkQ2FsbFNlbmRSZXNwb25zZSA9IGZhbHNlO1xuICAgICAgICAgIGxldCB3cmFwcGVkU2VuZFJlc3BvbnNlO1xuICAgICAgICAgIGxldCBzZW5kUmVzcG9uc2VQcm9taXNlID0gbmV3IFByb21pc2UocmVzb2x2ZSA9PiB7XG4gICAgICAgICAgICB3cmFwcGVkU2VuZFJlc3BvbnNlID0gZnVuY3Rpb24gKHJlc3BvbnNlKSB7XG4gICAgICAgICAgICAgIGRpZENhbGxTZW5kUmVzcG9uc2UgPSB0cnVlO1xuICAgICAgICAgICAgICByZXNvbHZlKHJlc3BvbnNlKTtcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgfSk7XG4gICAgICAgICAgbGV0IHJlc3VsdDtcblxuICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICByZXN1bHQgPSBsaXN0ZW5lcihtZXNzYWdlLCBzZW5kZXIsIHdyYXBwZWRTZW5kUmVzcG9uc2UpO1xuICAgICAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgcmVzdWx0ID0gUHJvbWlzZS5yZWplY3QoZXJyKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBjb25zdCBpc1Jlc3VsdFRoZW5hYmxlID0gcmVzdWx0ICE9PSB0cnVlICYmIGlzVGhlbmFibGUocmVzdWx0KTsgLy8gSWYgdGhlIGxpc3RlbmVyIGRpZG4ndCByZXR1cm5lZCB0cnVlIG9yIGEgUHJvbWlzZSwgb3IgY2FsbGVkXG4gICAgICAgICAgLy8gd3JhcHBlZFNlbmRSZXNwb25zZSBzeW5jaHJvbm91c2x5LCB3ZSBjYW4gZXhpdCBlYXJsaWVyXG4gICAgICAgICAgLy8gYmVjYXVzZSB0aGVyZSB3aWxsIGJlIG5vIHJlc3BvbnNlIHNlbnQgZnJvbSB0aGlzIGxpc3RlbmVyLlxuXG4gICAgICAgICAgaWYgKHJlc3VsdCAhPT0gdHJ1ZSAmJiAhaXNSZXN1bHRUaGVuYWJsZSAmJiAhZGlkQ2FsbFNlbmRSZXNwb25zZSkge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgIH0gLy8gQSBzbWFsbCBoZWxwZXIgdG8gc2VuZCB0aGUgbWVzc2FnZSBpZiB0aGUgcHJvbWlzZSByZXNvbHZlc1xuICAgICAgICAgIC8vIGFuZCBhbiBlcnJvciBpZiB0aGUgcHJvbWlzZSByZWplY3RzIChhIHdyYXBwZWQgc2VuZE1lc3NhZ2UgaGFzXG4gICAgICAgICAgLy8gdG8gdHJhbnNsYXRlIHRoZSBtZXNzYWdlIGludG8gYSByZXNvbHZlZCBwcm9taXNlIG9yIGEgcmVqZWN0ZWRcbiAgICAgICAgICAvLyBwcm9taXNlKS5cblxuXG4gICAgICAgICAgY29uc3Qgc2VuZFByb21pc2VkUmVzdWx0ID0gcHJvbWlzZSA9PiB7XG4gICAgICAgICAgICBwcm9taXNlLnRoZW4obXNnID0+IHtcbiAgICAgICAgICAgICAgLy8gc2VuZCB0aGUgbWVzc2FnZSB2YWx1ZS5cbiAgICAgICAgICAgICAgc2VuZFJlc3BvbnNlKG1zZyk7XG4gICAgICAgICAgICB9LCBlcnJvciA9PiB7XG4gICAgICAgICAgICAgIC8vIFNlbmQgYSBKU09OIHJlcHJlc2VudGF0aW9uIG9mIHRoZSBlcnJvciBpZiB0aGUgcmVqZWN0ZWQgdmFsdWVcbiAgICAgICAgICAgICAgLy8gaXMgYW4gaW5zdGFuY2Ugb2YgZXJyb3IsIG9yIHRoZSBvYmplY3QgaXRzZWxmIG90aGVyd2lzZS5cbiAgICAgICAgICAgICAgbGV0IG1lc3NhZ2U7XG5cbiAgICAgICAgICAgICAgaWYgKGVycm9yICYmIChlcnJvciBpbnN0YW5jZW9mIEVycm9yIHx8IHR5cGVvZiBlcnJvci5tZXNzYWdlID09PSBcInN0cmluZ1wiKSkge1xuICAgICAgICAgICAgICAgIG1lc3NhZ2UgPSBlcnJvci5tZXNzYWdlO1xuICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIG1lc3NhZ2UgPSBcIkFuIHVuZXhwZWN0ZWQgZXJyb3Igb2NjdXJyZWRcIjtcbiAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgIHNlbmRSZXNwb25zZSh7XG4gICAgICAgICAgICAgICAgX19tb3pXZWJFeHRlbnNpb25Qb2x5ZmlsbFJlamVjdF9fOiB0cnVlLFxuICAgICAgICAgICAgICAgIG1lc3NhZ2VcbiAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9KS5jYXRjaChlcnIgPT4ge1xuICAgICAgICAgICAgICAvLyBQcmludCBhbiBlcnJvciBvbiB0aGUgY29uc29sZSBpZiB1bmFibGUgdG8gc2VuZCB0aGUgcmVzcG9uc2UuXG4gICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoXCJGYWlsZWQgdG8gc2VuZCBvbk1lc3NhZ2UgcmVqZWN0ZWQgcmVwbHlcIiwgZXJyKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH07IC8vIElmIHRoZSBsaXN0ZW5lciByZXR1cm5lZCBhIFByb21pc2UsIHNlbmQgdGhlIHJlc29sdmVkIHZhbHVlIGFzIGFcbiAgICAgICAgICAvLyByZXN1bHQsIG90aGVyd2lzZSB3YWl0IHRoZSBwcm9taXNlIHJlbGF0ZWQgdG8gdGhlIHdyYXBwZWRTZW5kUmVzcG9uc2VcbiAgICAgICAgICAvLyBjYWxsYmFjayB0byByZXNvbHZlIGFuZCBzZW5kIGl0IGFzIGEgcmVzcG9uc2UuXG5cblxuICAgICAgICAgIGlmIChpc1Jlc3VsdFRoZW5hYmxlKSB7XG4gICAgICAgICAgICBzZW5kUHJvbWlzZWRSZXN1bHQocmVzdWx0KTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgc2VuZFByb21pc2VkUmVzdWx0KHNlbmRSZXNwb25zZVByb21pc2UpO1xuICAgICAgICAgIH0gLy8gTGV0IENocm9tZSBrbm93IHRoYXQgdGhlIGxpc3RlbmVyIGlzIHJlcGx5aW5nLlxuXG5cbiAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfTtcbiAgICAgIH0pO1xuXG4gICAgICBjb25zdCB3cmFwcGVkU2VuZE1lc3NhZ2VDYWxsYmFjayA9ICh7XG4gICAgICAgIHJlamVjdCxcbiAgICAgICAgcmVzb2x2ZVxuICAgICAgfSwgcmVwbHkpID0+IHtcbiAgICAgICAgaWYgKGV4dGVuc2lvbkFQSXMucnVudGltZS5sYXN0RXJyb3IpIHtcbiAgICAgICAgICAvLyBEZXRlY3Qgd2hlbiBub25lIG9mIHRoZSBsaXN0ZW5lcnMgcmVwbGllZCB0byB0aGUgc2VuZE1lc3NhZ2UgY2FsbCBhbmQgcmVzb2x2ZVxuICAgICAgICAgIC8vIHRoZSBwcm9taXNlIHRvIHVuZGVmaW5lZCBhcyBpbiBGaXJlZm94LlxuICAgICAgICAgIC8vIFNlZSBodHRwczovL2dpdGh1Yi5jb20vbW96aWxsYS93ZWJleHRlbnNpb24tcG9seWZpbGwvaXNzdWVzLzEzMFxuICAgICAgICAgIGlmIChleHRlbnNpb25BUElzLnJ1bnRpbWUubGFzdEVycm9yLm1lc3NhZ2UgPT09IENIUk9NRV9TRU5EX01FU1NBR0VfQ0FMTEJBQ0tfTk9fUkVTUE9OU0VfTUVTU0FHRSkge1xuICAgICAgICAgICAgcmVzb2x2ZSgpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZWplY3QobmV3IEVycm9yKGV4dGVuc2lvbkFQSXMucnVudGltZS5sYXN0RXJyb3IubWVzc2FnZSkpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIGlmIChyZXBseSAmJiByZXBseS5fX21veldlYkV4dGVuc2lvblBvbHlmaWxsUmVqZWN0X18pIHtcbiAgICAgICAgICAvLyBDb252ZXJ0IGJhY2sgdGhlIEpTT04gcmVwcmVzZW50YXRpb24gb2YgdGhlIGVycm9yIGludG9cbiAgICAgICAgICAvLyBhbiBFcnJvciBpbnN0YW5jZS5cbiAgICAgICAgICByZWplY3QobmV3IEVycm9yKHJlcGx5Lm1lc3NhZ2UpKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXNvbHZlKHJlcGx5KTtcbiAgICAgICAgfVxuICAgICAgfTtcblxuICAgICAgY29uc3Qgd3JhcHBlZFNlbmRNZXNzYWdlID0gKG5hbWUsIG1ldGFkYXRhLCBhcGlOYW1lc3BhY2VPYmosIC4uLmFyZ3MpID0+IHtcbiAgICAgICAgaWYgKGFyZ3MubGVuZ3RoIDwgbWV0YWRhdGEubWluQXJncykge1xuICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgRXhwZWN0ZWQgYXQgbGVhc3QgJHttZXRhZGF0YS5taW5BcmdzfSAke3BsdXJhbGl6ZUFyZ3VtZW50cyhtZXRhZGF0YS5taW5BcmdzKX0gZm9yICR7bmFtZX0oKSwgZ290ICR7YXJncy5sZW5ndGh9YCk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoYXJncy5sZW5ndGggPiBtZXRhZGF0YS5tYXhBcmdzKSB7XG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBFeHBlY3RlZCBhdCBtb3N0ICR7bWV0YWRhdGEubWF4QXJnc30gJHtwbHVyYWxpemVBcmd1bWVudHMobWV0YWRhdGEubWF4QXJncyl9IGZvciAke25hbWV9KCksIGdvdCAke2FyZ3MubGVuZ3RofWApO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgICBjb25zdCB3cmFwcGVkQ2IgPSB3cmFwcGVkU2VuZE1lc3NhZ2VDYWxsYmFjay5iaW5kKG51bGwsIHtcbiAgICAgICAgICAgIHJlc29sdmUsXG4gICAgICAgICAgICByZWplY3RcbiAgICAgICAgICB9KTtcbiAgICAgICAgICBhcmdzLnB1c2god3JhcHBlZENiKTtcbiAgICAgICAgICBhcGlOYW1lc3BhY2VPYmouc2VuZE1lc3NhZ2UoLi4uYXJncyk7XG4gICAgICAgIH0pO1xuICAgICAgfTtcblxuICAgICAgY29uc3Qgc3RhdGljV3JhcHBlcnMgPSB7XG4gICAgICAgIGRldnRvb2xzOiB7XG4gICAgICAgICAgbmV0d29yazoge1xuICAgICAgICAgICAgb25SZXF1ZXN0RmluaXNoZWQ6IHdyYXBFdmVudChvblJlcXVlc3RGaW5pc2hlZFdyYXBwZXJzKVxuICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgcnVudGltZToge1xuICAgICAgICAgIG9uTWVzc2FnZTogd3JhcEV2ZW50KG9uTWVzc2FnZVdyYXBwZXJzKSxcbiAgICAgICAgICBvbk1lc3NhZ2VFeHRlcm5hbDogd3JhcEV2ZW50KG9uTWVzc2FnZVdyYXBwZXJzKSxcbiAgICAgICAgICBzZW5kTWVzc2FnZTogd3JhcHBlZFNlbmRNZXNzYWdlLmJpbmQobnVsbCwgXCJzZW5kTWVzc2FnZVwiLCB7XG4gICAgICAgICAgICBtaW5BcmdzOiAxLFxuICAgICAgICAgICAgbWF4QXJnczogM1xuICAgICAgICAgIH0pXG4gICAgICAgIH0sXG4gICAgICAgIHRhYnM6IHtcbiAgICAgICAgICBzZW5kTWVzc2FnZTogd3JhcHBlZFNlbmRNZXNzYWdlLmJpbmQobnVsbCwgXCJzZW5kTWVzc2FnZVwiLCB7XG4gICAgICAgICAgICBtaW5BcmdzOiAyLFxuICAgICAgICAgICAgbWF4QXJnczogM1xuICAgICAgICAgIH0pXG4gICAgICAgIH1cbiAgICAgIH07XG4gICAgICBjb25zdCBzZXR0aW5nTWV0YWRhdGEgPSB7XG4gICAgICAgIGNsZWFyOiB7XG4gICAgICAgICAgbWluQXJnczogMSxcbiAgICAgICAgICBtYXhBcmdzOiAxXG4gICAgICAgIH0sXG4gICAgICAgIGdldDoge1xuICAgICAgICAgIG1pbkFyZ3M6IDEsXG4gICAgICAgICAgbWF4QXJnczogMVxuICAgICAgICB9LFxuICAgICAgICBzZXQ6IHtcbiAgICAgICAgICBtaW5BcmdzOiAxLFxuICAgICAgICAgIG1heEFyZ3M6IDFcbiAgICAgICAgfVxuICAgICAgfTtcbiAgICAgIGFwaU1ldGFkYXRhLnByaXZhY3kgPSB7XG4gICAgICAgIG5ldHdvcms6IHtcbiAgICAgICAgICBcIipcIjogc2V0dGluZ01ldGFkYXRhXG4gICAgICAgIH0sXG4gICAgICAgIHNlcnZpY2VzOiB7XG4gICAgICAgICAgXCIqXCI6IHNldHRpbmdNZXRhZGF0YVxuICAgICAgICB9LFxuICAgICAgICB3ZWJzaXRlczoge1xuICAgICAgICAgIFwiKlwiOiBzZXR0aW5nTWV0YWRhdGFcbiAgICAgICAgfVxuICAgICAgfTtcbiAgICAgIHJldHVybiB3cmFwT2JqZWN0KGV4dGVuc2lvbkFQSXMsIHN0YXRpY1dyYXBwZXJzLCBhcGlNZXRhZGF0YSk7XG4gICAgfTsgLy8gVGhlIGJ1aWxkIHByb2Nlc3MgYWRkcyBhIFVNRCB3cmFwcGVyIGFyb3VuZCB0aGlzIGZpbGUsIHdoaWNoIG1ha2VzIHRoZVxuICAgIC8vIGBtb2R1bGVgIHZhcmlhYmxlIGF2YWlsYWJsZS5cblxuXG4gICAgbW9kdWxlLmV4cG9ydHMgPSB3cmFwQVBJcyhjaHJvbWUpO1xuICB9IGVsc2Uge1xuICAgIG1vZHVsZS5leHBvcnRzID0gZ2xvYmFsVGhpcy5icm93c2VyO1xuICB9XG59KTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWJyb3dzZXItcG9seWZpbGwuanMubWFwXG4iLCIvLyBzcmMvYnJvd3Nlci50c1xuaW1wb3J0IG9yaWdpbmFsQnJvd3NlciBmcm9tIFwid2ViZXh0ZW5zaW9uLXBvbHlmaWxsXCI7XG52YXIgYnJvd3NlciA9IG9yaWdpbmFsQnJvd3NlcjtcblxuZXhwb3J0IHtcbiAgYnJvd3NlclxufTtcbiIsImV4cG9ydCBlbnVtIE1lc3NhZ2VUeXBlIHtcbiAgICBjbGlja0V4dEljb24gPSBcImNsaWNrRXh0SWNvblwiLFxuICAgIGNoYW5nZVRoZW1lID0gXCJjaGFuZ2VUaGVtZVwiLFxuICAgIGNoYW5nZUxvY2FsZSA9IFwiY2hhbmdlTG9jYWxlXCIsXG4gICAgb3BlblNpZGVQYW5lbCA9IFwib3BlblNpZGVQYW5lbFwiLFxuICAgIGdldFNlbGVjdGVkVGV4dCA9IFwiZ2V0U2VsZWN0ZWRUZXh0XCJcbn1cblxuZXhwb3J0IGVudW0gTWVzc2FnZUZyb20ge1xuICAgIGNvbnRlbnRTY3JpcHQgPSBcImNvbnRlbnRTY3JpcHRcIixcbiAgICBiYWNrZ3JvdW5kID0gXCJiYWNrZ3JvdW5kXCIsXG4gICAgcG9wVXAgPSBcInBvcFVwXCIsXG4gICAgc2lkZVBhbmVsID0gXCJzaWRlUGFuZWxcIixcbn1cblxuY2xhc3MgRXh0TWVzc2FnZSB7XG4gICAgY29udGVudD86IHN0cmluZztcbiAgICBmcm9tPzogTWVzc2FnZUZyb207XG4gICAgc2VsZWN0ZWRUZXh0Pzogc3RyaW5nO1xuXG4gICAgY29uc3RydWN0b3IobWVzc2FnZVR5cGU6IE1lc3NhZ2VUeXBlKSB7XG4gICAgICAgIHRoaXMubWVzc2FnZVR5cGUgPSBtZXNzYWdlVHlwZTtcbiAgICB9XG5cbiAgICBtZXNzYWdlVHlwZTogTWVzc2FnZVR5cGU7XG59XG5cbmV4cG9ydCBkZWZhdWx0IEV4dE1lc3NhZ2U7XG4iLCJpbXBvcnQgeyBicm93c2VyIH0gZnJvbSBcInd4dC9icm93c2VyXCI7XG5pbXBvcnQgRXh0TWVzc2FnZSwgeyBNZXNzYWdlVHlwZSB9IGZyb20gXCJAL2VudHJ5cG9pbnRzL3R5cGVzLnRzXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbnRlbnRTY3JpcHQoe1xuICAgIG1hdGNoZXM6IFsnKjovLyovKiddLFxuICAgIHJ1bkF0OiAnZG9jdW1lbnRfZW5kJyxcbiAgICBtYWluKCkge1xuICAgICAgICBsZXQgcHJldmlld0NhcmQ6IEhUTUxFbGVtZW50IHwgbnVsbCA9IG51bGw7XG4gICAgICAgIGxldCBpZ25vcmVOZXh0TW91c2VVcCA9IGZhbHNlO1xuXG4gICAgICAgIC8vIEhhbmRsZSB0ZXh0IHNlbGVjdGlvblxuICAgICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZXVwJywgaGFuZGxlVGV4dFNlbGVjdGlvbik7XG5cbiAgICAgICAgZnVuY3Rpb24gaGFuZGxlVGV4dFNlbGVjdGlvbihlOiBNb3VzZUV2ZW50KSB7XG4gICAgICAgICAgICAvLyBJZ25vcmUgaWYgd2UganVzdCBjbGlja2VkIHRoZSBwcmV2aWV3IGNhcmRcbiAgICAgICAgICAgIGlmIChpZ25vcmVOZXh0TW91c2VVcCkge1xuICAgICAgICAgICAgICAgIGlnbm9yZU5leHRNb3VzZVVwID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgXG4gICAgICAgICAgICAvLyBJZ25vcmUgaWYgY2xpY2tpbmcgaW5zaWRlIHRoZSBjYXJkXG4gICAgICAgICAgICBpZiAocHJldmlld0NhcmQgJiYgcHJldmlld0NhcmQuY29udGFpbnMoZS50YXJnZXQgYXMgTm9kZSkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGNvbnN0IHNlbGVjdGVkVGV4dCA9IHdpbmRvdy5nZXRTZWxlY3Rpb24oKT8udG9TdHJpbmcoKS50cmltKCkgfHwgJyc7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGlmIChzZWxlY3RlZFRleHQubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgIHNob3dQcmV2aWV3Q2FyZChzZWxlY3RlZFRleHQsIGUuY2xpZW50WCwgZS5jbGllbnRZKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIHNob3dQcmV2aWV3Q2FyZCh0ZXh0OiBzdHJpbmcsIHg6IG51bWJlciwgeTogbnVtYmVyKSB7XG4gICAgICAgICAgICAvLyBSZW1vdmUgb2xkIGNhcmQgaWYgZXhpc3RzXG4gICAgICAgICAgICBpZiAocHJldmlld0NhcmQpIHtcbiAgICAgICAgICAgICAgICBwcmV2aWV3Q2FyZC5yZW1vdmUoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIFxuICAgICAgICAgICAgLy8gQ3JlYXRlIG5ldyBjYXJkIHdpdGggbW9kZXJuIHN0eWxpbmdcbiAgICAgICAgICAgIHByZXZpZXdDYXJkID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICAgICAgICBwcmV2aWV3Q2FyZC5jbGFzc05hbWUgPSAncmFiYml0aG9sZS1wcmV2aWV3LWNhcmQnO1xuICAgICAgICAgICAgcHJldmlld0NhcmQuaW5uZXJIVE1MID0gYFxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJwcmV2aWV3LXRleHRcIj5TZWxlY3RlZDogJHt0ZXh0fTwvZGl2PlxuICAgICAgICAgICAgICAgIDxidXR0b24gY2xhc3M9XCJwcmV2aWV3LWJ1dHRvblwiPk9wZW4gaW4gU2lkZWJhcjwvYnV0dG9uPlxuICAgICAgICAgICAgYDtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgLy8gQXBwbHkgc3R5bGVzXG4gICAgICAgICAgICBPYmplY3QuYXNzaWduKHByZXZpZXdDYXJkLnN0eWxlLCB7XG4gICAgICAgICAgICAgICAgcG9zaXRpb246ICdmaXhlZCcsXG4gICAgICAgICAgICAgICAgbGVmdDogeCArICdweCcsXG4gICAgICAgICAgICAgICAgdG9wOiAoeSArIDIwKSArICdweCcsXG4gICAgICAgICAgICAgICAgYmFja2dyb3VuZDogJ3doaXRlJyxcbiAgICAgICAgICAgICAgICBib3JkZXI6ICcycHggc29saWQgIzMzMycsXG4gICAgICAgICAgICAgICAgYm9yZGVyUmFkaXVzOiAnOHB4JyxcbiAgICAgICAgICAgICAgICBwYWRkaW5nOiAnMTJweCcsXG4gICAgICAgICAgICAgICAgekluZGV4OiAnOTk5OTk5JyxcbiAgICAgICAgICAgICAgICBmb250RmFtaWx5OiAnQXJpYWwsIHNhbnMtc2VyaWYnLFxuICAgICAgICAgICAgICAgIGJveFNoYWRvdzogJzAgNHB4IDEycHggcmdiYSgwLDAsMCwwLjIpJyxcbiAgICAgICAgICAgICAgICBtaW5XaWR0aDogJzIwMHB4J1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIC8vIFN0eWxlIHRoZSB0ZXh0XG4gICAgICAgICAgICBjb25zdCB0ZXh0RWxlbWVudCA9IHByZXZpZXdDYXJkLnF1ZXJ5U2VsZWN0b3IoJy5wcmV2aWV3LXRleHQnKSBhcyBIVE1MRWxlbWVudDtcbiAgICAgICAgICAgIGlmICh0ZXh0RWxlbWVudCkge1xuICAgICAgICAgICAgICAgIE9iamVjdC5hc3NpZ24odGV4dEVsZW1lbnQuc3R5bGUsIHtcbiAgICAgICAgICAgICAgICAgICAgbWFyZ2luQm90dG9tOiAnOHB4JyxcbiAgICAgICAgICAgICAgICAgICAgZm9udFNpemU6ICcxM3B4JyxcbiAgICAgICAgICAgICAgICAgICAgY29sb3I6ICcjNjY2J1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBTdHlsZSB0aGUgYnV0dG9uXG4gICAgICAgICAgICBjb25zdCBidXR0b24gPSBwcmV2aWV3Q2FyZC5xdWVyeVNlbGVjdG9yKCcucHJldmlldy1idXR0b24nKSBhcyBIVE1MQnV0dG9uRWxlbWVudDtcbiAgICAgICAgICAgIGlmIChidXR0b24pIHtcbiAgICAgICAgICAgICAgICBPYmplY3QuYXNzaWduKGJ1dHRvbi5zdHlsZSwge1xuICAgICAgICAgICAgICAgICAgICB3aWR0aDogJzEwMCUnLFxuICAgICAgICAgICAgICAgICAgICBwYWRkaW5nOiAnOHB4JyxcbiAgICAgICAgICAgICAgICAgICAgYmFja2dyb3VuZDogJyMwMDY2Y2MnLFxuICAgICAgICAgICAgICAgICAgICBjb2xvcjogJ3doaXRlJyxcbiAgICAgICAgICAgICAgICAgICAgYm9yZGVyOiAnbm9uZScsXG4gICAgICAgICAgICAgICAgICAgIGJvcmRlclJhZGl1czogJzRweCcsXG4gICAgICAgICAgICAgICAgICAgIGN1cnNvcjogJ3BvaW50ZXInLFxuICAgICAgICAgICAgICAgICAgICBmb250U2l6ZTogJzE0cHgnLFxuICAgICAgICAgICAgICAgICAgICBmb250V2VpZ2h0OiAnNjAwJ1xuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgLy8gQWRkIGhvdmVyIGVmZmVjdFxuICAgICAgICAgICAgICAgIGJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKCdtb3VzZWVudGVyJywgKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBidXR0b24uc3R5bGUuYmFja2dyb3VuZCA9ICcjMDA1MmEzJztcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICBidXR0b24uYWRkRXZlbnRMaXN0ZW5lcignbW91c2VsZWF2ZScsICgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgYnV0dG9uLnN0eWxlLmJhY2tncm91bmQgPSAnIzAwNjZjYyc7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQocHJldmlld0NhcmQpO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICAvLyBBZGQgY2xpY2sgaGFuZGxlcnNcbiAgICAgICAgICAgIGlmIChidXR0b24pIHtcbiAgICAgICAgICAgICAgICBidXR0b24uYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vkb3duJywgZnVuY3Rpb24oZSkge1xuICAgICAgICAgICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICAgICAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICAgICAgICAgICAgICAgIGlnbm9yZU5leHRNb3VzZVVwID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICBidXR0b24uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbihlKSB7XG4gICAgICAgICAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgICAgICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdCdXR0b24gY2xpY2tlZCwgc2VuZGluZyBtZXNzYWdlLi4uJyk7XG4gICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICBjb25zdCBtZXNzYWdlOiBFeHRNZXNzYWdlID0ge1xuICAgICAgICAgICAgICAgICAgICAgICAgbWVzc2FnZVR5cGU6IE1lc3NhZ2VUeXBlLm9wZW5TaWRlUGFuZWwsXG4gICAgICAgICAgICAgICAgICAgICAgICBzZWxlY3RlZFRleHQ6IHRleHRcbiAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgIGJyb3dzZXIucnVudGltZS5zZW5kTWVzc2FnZShtZXNzYWdlKS50aGVuKCgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdNZXNzYWdlIHNlbnQgc3VjY2Vzc2Z1bGx5Jyk7XG4gICAgICAgICAgICAgICAgICAgIH0pLmNhdGNoKChlcnJvcikgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcignRXJyb3Igc2VuZGluZyBtZXNzYWdlOicsIGVycm9yKTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICBpZiAocHJldmlld0NhcmQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHByZXZpZXdDYXJkLnJlbW92ZSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgcHJldmlld0NhcmQgPSBudWxsO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAvLyBDbG9zZSBjYXJkIHdoZW4gY2xpY2tpbmcgb3V0c2lkZVxuICAgICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZWRvd24nLCBmdW5jdGlvbihlKSB7XG4gICAgICAgICAgICBpZiAocHJldmlld0NhcmQgJiYgIXByZXZpZXdDYXJkLmNvbnRhaW5zKGUudGFyZ2V0IGFzIE5vZGUpKSB7XG4gICAgICAgICAgICAgICAgaWYgKHByZXZpZXdDYXJkKSB7XG4gICAgICAgICAgICAgICAgICAgIHByZXZpZXdDYXJkLnJlbW92ZSgpO1xuICAgICAgICAgICAgICAgICAgICBwcmV2aWV3Q2FyZCA9IG51bGw7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9LFxufSk7XG4iLCJpbXBvcnQge1xuICBicm93c2VyXG59IGZyb20gXCIuL2NodW5rLUZOVEUyTDI3LmpzXCI7XG5cbi8vIHNyYy9zYW5kYm94L3V0aWxzL2xvZ2dlci50c1xuZnVuY3Rpb24gcHJpbnQobWV0aG9kLCAuLi5hcmdzKSB7XG4gIGlmIChpbXBvcnQubWV0YS5lbnYuTU9ERSA9PT0gXCJwcm9kdWN0aW9uXCIpXG4gICAgcmV0dXJuO1xuICBpZiAodHlwZW9mIGFyZ3NbMF0gPT09IFwic3RyaW5nXCIpIHtcbiAgICBjb25zdCBtZXNzYWdlID0gYXJncy5zaGlmdCgpO1xuICAgIG1ldGhvZChgW3d4dF0gJHttZXNzYWdlfWAsIC4uLmFyZ3MpO1xuICB9IGVsc2Uge1xuICAgIG1ldGhvZChcIlt3eHRdXCIsIC4uLmFyZ3MpO1xuICB9XG59XG52YXIgbG9nZ2VyID0ge1xuICBkZWJ1ZzogKC4uLmFyZ3MpID0+IHByaW50KGNvbnNvbGUuZGVidWcsIC4uLmFyZ3MpLFxuICBsb2c6ICguLi5hcmdzKSA9PiBwcmludChjb25zb2xlLmxvZywgLi4uYXJncyksXG4gIHdhcm46ICguLi5hcmdzKSA9PiBwcmludChjb25zb2xlLndhcm4sIC4uLmFyZ3MpLFxuICBlcnJvcjogKC4uLmFyZ3MpID0+IHByaW50KGNvbnNvbGUuZXJyb3IsIC4uLmFyZ3MpXG59O1xuXG4vLyBzcmMvY2xpZW50L2NvbnRlbnQtc2NyaXB0cy9jdXN0b20tZXZlbnRzLnRzXG52YXIgV3h0TG9jYXRpb25DaGFuZ2VFdmVudCA9IGNsYXNzIF9XeHRMb2NhdGlvbkNoYW5nZUV2ZW50IGV4dGVuZHMgRXZlbnQge1xuICBjb25zdHJ1Y3RvcihuZXdVcmwsIG9sZFVybCkge1xuICAgIHN1cGVyKF9XeHRMb2NhdGlvbkNoYW5nZUV2ZW50LkVWRU5UX05BTUUsIHt9KTtcbiAgICB0aGlzLm5ld1VybCA9IG5ld1VybDtcbiAgICB0aGlzLm9sZFVybCA9IG9sZFVybDtcbiAgfVxuICBzdGF0aWMgRVZFTlRfTkFNRSA9IGdldFVuaXF1ZUV2ZW50TmFtZShcInd4dDpsb2NhdGlvbmNoYW5nZVwiKTtcbn07XG5mdW5jdGlvbiBnZXRVbmlxdWVFdmVudE5hbWUoZXZlbnROYW1lKSB7XG4gIGNvbnN0IGVudHJ5cG9pbnROYW1lID0gdHlwZW9mIGltcG9ydC5tZXRhLmVudiA9PT0gXCJ1bmRlZmluZWRcIiA/IFwiYnVpbGRcIiA6IGltcG9ydC5tZXRhLmVudi5FTlRSWVBPSU5UO1xuICByZXR1cm4gYCR7YnJvd3Nlci5ydW50aW1lLmlkfToke2VudHJ5cG9pbnROYW1lfToke2V2ZW50TmFtZX1gO1xufVxuXG4vLyBzcmMvY2xpZW50L2NvbnRlbnQtc2NyaXB0cy9sb2NhdGlvbi13YXRjaGVyLnRzXG5mdW5jdGlvbiBjcmVhdGVMb2NhdGlvbldhdGNoZXIoY3R4KSB7XG4gIGxldCBpbnRlcnZhbDtcbiAgbGV0IG9sZFVybDtcbiAgcmV0dXJuIHtcbiAgICAvKipcbiAgICAgKiBFbnN1cmUgdGhlIGxvY2F0aW9uIHdhdGNoZXIgaXMgYWN0aXZlbHkgbG9va2luZyBmb3IgVVJMIGNoYW5nZXMuIElmIGl0J3MgYWxyZWFkeSB3YXRjaGluZyxcbiAgICAgKiB0aGlzIGlzIGEgbm9vcC5cbiAgICAgKi9cbiAgICBydW4oKSB7XG4gICAgICBpZiAoaW50ZXJ2YWwgIT0gbnVsbClcbiAgICAgICAgcmV0dXJuO1xuICAgICAgb2xkVXJsID0gbmV3IFVSTChsb2NhdGlvbi5ocmVmKTtcbiAgICAgIGludGVydmFsID0gY3R4LnNldEludGVydmFsKCgpID0+IHtcbiAgICAgICAgbGV0IG5ld1VybCA9IG5ldyBVUkwobG9jYXRpb24uaHJlZik7XG4gICAgICAgIGlmIChuZXdVcmwuaHJlZiAhPT0gb2xkVXJsLmhyZWYpIHtcbiAgICAgICAgICB3aW5kb3cuZGlzcGF0Y2hFdmVudChuZXcgV3h0TG9jYXRpb25DaGFuZ2VFdmVudChuZXdVcmwsIG9sZFVybCkpO1xuICAgICAgICAgIG9sZFVybCA9IG5ld1VybDtcbiAgICAgICAgfVxuICAgICAgfSwgMWUzKTtcbiAgICB9XG4gIH07XG59XG5cbi8vIHNyYy9jbGllbnQvY29udGVudC1zY3JpcHRzL2NvbnRlbnQtc2NyaXB0LWNvbnRleHQudHNcbnZhciBDb250ZW50U2NyaXB0Q29udGV4dCA9IGNsYXNzIF9Db250ZW50U2NyaXB0Q29udGV4dCB7XG4gIGNvbnN0cnVjdG9yKGNvbnRlbnRTY3JpcHROYW1lLCBvcHRpb25zKSB7XG4gICAgdGhpcy5jb250ZW50U2NyaXB0TmFtZSA9IGNvbnRlbnRTY3JpcHROYW1lO1xuICAgIHRoaXMub3B0aW9ucyA9IG9wdGlvbnM7XG4gICAgdGhpcy4jYWJvcnRDb250cm9sbGVyID0gbmV3IEFib3J0Q29udHJvbGxlcigpO1xuICAgIGlmICh0aGlzLiNpc1RvcEZyYW1lKSB7XG4gICAgICB0aGlzLiNzdG9wT2xkU2NyaXB0cygpO1xuICAgIH1cbiAgICB0aGlzLnNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgdGhpcy4jbGlzdGVuRm9yTmV3ZXJTY3JpcHRzKCk7XG4gICAgfSk7XG4gIH1cbiAgc3RhdGljIFNDUklQVF9TVEFSVEVEX01FU1NBR0VfVFlQRSA9IFwid3h0OmNvbnRlbnQtc2NyaXB0LXN0YXJ0ZWRcIjtcbiAgI2lzVG9wRnJhbWUgPSB3aW5kb3cuc2VsZiA9PT0gd2luZG93LnRvcDtcbiAgI2Fib3J0Q29udHJvbGxlcjtcbiAgI2xvY2F0aW9uV2F0Y2hlciA9IGNyZWF0ZUxvY2F0aW9uV2F0Y2hlcih0aGlzKTtcbiAgZ2V0IHNpZ25hbCgpIHtcbiAgICByZXR1cm4gdGhpcy4jYWJvcnRDb250cm9sbGVyLnNpZ25hbDtcbiAgfVxuICBhYm9ydChyZWFzb24pIHtcbiAgICByZXR1cm4gdGhpcy4jYWJvcnRDb250cm9sbGVyLmFib3J0KHJlYXNvbik7XG4gIH1cbiAgZ2V0IGlzSW52YWxpZCgpIHtcbiAgICBpZiAoYnJvd3Nlci5ydW50aW1lLmlkID09IG51bGwpIHtcbiAgICAgIHRoaXMubm90aWZ5SW52YWxpZGF0ZWQoKTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuc2lnbmFsLmFib3J0ZWQ7XG4gIH1cbiAgZ2V0IGlzVmFsaWQoKSB7XG4gICAgcmV0dXJuICF0aGlzLmlzSW52YWxpZDtcbiAgfVxuICAvKipcbiAgICogQWRkIGEgbGlzdGVuZXIgdGhhdCBpcyBjYWxsZWQgd2hlbiB0aGUgY29udGVudCBzY3JpcHQncyBjb250ZXh0IGlzIGludmFsaWRhdGVkLlxuICAgKlxuICAgKiBAcmV0dXJucyBBIGZ1bmN0aW9uIHRvIHJlbW92ZSB0aGUgbGlzdGVuZXIuXG4gICAqXG4gICAqIEBleGFtcGxlXG4gICAqIGJyb3dzZXIucnVudGltZS5vbk1lc3NhZ2UuYWRkTGlzdGVuZXIoY2IpO1xuICAgKiBjb25zdCByZW1vdmVJbnZhbGlkYXRlZExpc3RlbmVyID0gY3R4Lm9uSW52YWxpZGF0ZWQoKCkgPT4ge1xuICAgKiAgIGJyb3dzZXIucnVudGltZS5vbk1lc3NhZ2UucmVtb3ZlTGlzdGVuZXIoY2IpO1xuICAgKiB9KVxuICAgKiAvLyAuLi5cbiAgICogcmVtb3ZlSW52YWxpZGF0ZWRMaXN0ZW5lcigpO1xuICAgKi9cbiAgb25JbnZhbGlkYXRlZChjYikge1xuICAgIHRoaXMuc2lnbmFsLmFkZEV2ZW50TGlzdGVuZXIoXCJhYm9ydFwiLCBjYik7XG4gICAgcmV0dXJuICgpID0+IHRoaXMuc2lnbmFsLnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJhYm9ydFwiLCBjYik7XG4gIH1cbiAgLyoqXG4gICAqIFJldHVybiBhIHByb21pc2UgdGhhdCBuZXZlciByZXNvbHZlcy4gVXNlZnVsIGlmIHlvdSBoYXZlIGFuIGFzeW5jIGZ1bmN0aW9uIHRoYXQgc2hvdWxkbid0IHJ1blxuICAgKiBhZnRlciB0aGUgY29udGV4dCBpcyBleHBpcmVkLlxuICAgKlxuICAgKiBAZXhhbXBsZVxuICAgKiBjb25zdCBnZXRWYWx1ZUZyb21TdG9yYWdlID0gYXN5bmMgKCkgPT4ge1xuICAgKiAgIGlmIChjdHguaXNJbnZhbGlkKSByZXR1cm4gY3R4LmJsb2NrKCk7XG4gICAqXG4gICAqICAgLy8gLi4uXG4gICAqIH1cbiAgICovXG4gIGJsb2NrKCkge1xuICAgIHJldHVybiBuZXcgUHJvbWlzZSgoKSA9PiB7XG4gICAgfSk7XG4gIH1cbiAgLyoqXG4gICAqIFdyYXBwZXIgYXJvdW5kIGB3aW5kb3cuc2V0SW50ZXJ2YWxgIHRoYXQgYXV0b21hdGljYWxseSBjbGVhcnMgdGhlIGludGVydmFsIHdoZW4gaW52YWxpZGF0ZWQuXG4gICAqL1xuICBzZXRJbnRlcnZhbChoYW5kbGVyLCB0aW1lb3V0KSB7XG4gICAgY29uc3QgaWQgPSBzZXRJbnRlcnZhbCgoKSA9PiB7XG4gICAgICBpZiAodGhpcy5pc1ZhbGlkKVxuICAgICAgICBoYW5kbGVyKCk7XG4gICAgfSwgdGltZW91dCk7XG4gICAgdGhpcy5vbkludmFsaWRhdGVkKCgpID0+IGNsZWFySW50ZXJ2YWwoaWQpKTtcbiAgICByZXR1cm4gaWQ7XG4gIH1cbiAgLyoqXG4gICAqIFdyYXBwZXIgYXJvdW5kIGB3aW5kb3cuc2V0VGltZW91dGAgdGhhdCBhdXRvbWF0aWNhbGx5IGNsZWFycyB0aGUgaW50ZXJ2YWwgd2hlbiBpbnZhbGlkYXRlZC5cbiAgICovXG4gIHNldFRpbWVvdXQoaGFuZGxlciwgdGltZW91dCkge1xuICAgIGNvbnN0IGlkID0gc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICBpZiAodGhpcy5pc1ZhbGlkKVxuICAgICAgICBoYW5kbGVyKCk7XG4gICAgfSwgdGltZW91dCk7XG4gICAgdGhpcy5vbkludmFsaWRhdGVkKCgpID0+IGNsZWFyVGltZW91dChpZCkpO1xuICAgIHJldHVybiBpZDtcbiAgfVxuICAvKipcbiAgICogV3JhcHBlciBhcm91bmQgYHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWVgIHRoYXQgYXV0b21hdGljYWxseSBjYW5jZWxzIHRoZSByZXF1ZXN0IHdoZW5cbiAgICogaW52YWxpZGF0ZWQuXG4gICAqL1xuICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoY2FsbGJhY2spIHtcbiAgICBjb25zdCBpZCA9IHJlcXVlc3RBbmltYXRpb25GcmFtZSgoLi4uYXJncykgPT4ge1xuICAgICAgaWYgKHRoaXMuaXNWYWxpZClcbiAgICAgICAgY2FsbGJhY2soLi4uYXJncyk7XG4gICAgfSk7XG4gICAgdGhpcy5vbkludmFsaWRhdGVkKCgpID0+IGNhbmNlbEFuaW1hdGlvbkZyYW1lKGlkKSk7XG4gICAgcmV0dXJuIGlkO1xuICB9XG4gIC8qKlxuICAgKiBXcmFwcGVyIGFyb3VuZCBgd2luZG93LnJlcXVlc3RJZGxlQ2FsbGJhY2tgIHRoYXQgYXV0b21hdGljYWxseSBjYW5jZWxzIHRoZSByZXF1ZXN0IHdoZW5cbiAgICogaW52YWxpZGF0ZWQuXG4gICAqL1xuICByZXF1ZXN0SWRsZUNhbGxiYWNrKGNhbGxiYWNrLCBvcHRpb25zKSB7XG4gICAgY29uc3QgaWQgPSByZXF1ZXN0SWRsZUNhbGxiYWNrKCguLi5hcmdzKSA9PiB7XG4gICAgICBpZiAoIXRoaXMuc2lnbmFsLmFib3J0ZWQpXG4gICAgICAgIGNhbGxiYWNrKC4uLmFyZ3MpO1xuICAgIH0sIG9wdGlvbnMpO1xuICAgIHRoaXMub25JbnZhbGlkYXRlZCgoKSA9PiBjYW5jZWxJZGxlQ2FsbGJhY2soaWQpKTtcbiAgICByZXR1cm4gaWQ7XG4gIH1cbiAgLyoqXG4gICAqIENhbGwgYHRhcmdldC5hZGRFdmVudExpc3RlbmVyYCBhbmQgcmVtb3ZlIHRoZSBldmVudCBsaXN0ZW5lciB3aGVuIHRoZSBjb250ZXh0IGlzIGludmFsaWRhdGVkLlxuICAgKlxuICAgKiBJbmNsdWRlcyBhZGRpdGlvbmFsIGV2ZW50cyB1c2VmdWwgZm9yIGNvbnRlbnQgc2NyaXB0czpcbiAgICpcbiAgICogLSBgXCJ3eHQ6bG9jYXRpb25jaGFuZ2VcImAgLSBUcmlnZ2VyZWQgd2hlbiBIVE1MNSBoaXN0b3J5IG1vZGUgaXMgdXNlZCB0byBjaGFuZ2UgVVJMLiBDb250ZW50XG4gICAqICAgc2NyaXB0cyBhcmUgbm90IHJlbG9hZGVkIHdoZW4gbmF2aWdhdGluZyB0aGlzIHdheSwgc28gdGhpcyBjYW4gYmUgdXNlZCB0byByZXNldCB0aGUgY29udGVudFxuICAgKiAgIHNjcmlwdCBzdGF0ZSBvbiBVUkwgY2hhbmdlLCBvciBydW4gY3VzdG9tIGNvZGUuXG4gICAqXG4gICAqIEBleGFtcGxlXG4gICAqIGN0eC5hZGRFdmVudExpc3RlbmVyKGRvY3VtZW50LCBcInZpc2liaWxpdHljaGFuZ2VcIiwgKCkgPT4ge1xuICAgKiAgIC8vIC4uLlxuICAgKiB9KTtcbiAgICogY3R4LmFkZEV2ZW50TGlzdGVuZXIoZG9jdW1lbnQsIFwid3h0OmxvY2F0aW9uY2hhbmdlXCIsICgpID0+IHtcbiAgICogICAvLyAuLi5cbiAgICogfSk7XG4gICAqL1xuICBhZGRFdmVudExpc3RlbmVyKHRhcmdldCwgdHlwZSwgaGFuZGxlciwgb3B0aW9ucykge1xuICAgIGlmICh0eXBlID09PSBcInd4dDpsb2NhdGlvbmNoYW5nZVwiKSB7XG4gICAgICBpZiAodGhpcy5pc1ZhbGlkKVxuICAgICAgICB0aGlzLiNsb2NhdGlvbldhdGNoZXIucnVuKCk7XG4gICAgfVxuICAgIHRhcmdldC5hZGRFdmVudExpc3RlbmVyPy4oXG4gICAgICB0eXBlLnN0YXJ0c1dpdGgoXCJ3eHQ6XCIpID8gZ2V0VW5pcXVlRXZlbnROYW1lKHR5cGUpIDogdHlwZSxcbiAgICAgIC8vIEB0cy1leHBlY3QtZXJyb3I6IEV2ZW50IGRvbid0IG1hdGNoLCBidXQgdGhhdCdzIE9LLCBFdmVudFRhcmdldCBkb2Vzbid0IGFsbG93IGN1c3RvbSB0eXBlcyBpbiB0aGUgY2FsbGJhY2tcbiAgICAgIGhhbmRsZXIsXG4gICAgICB7XG4gICAgICAgIC4uLm9wdGlvbnMsXG4gICAgICAgIHNpZ25hbDogdGhpcy5zaWduYWxcbiAgICAgIH1cbiAgICApO1xuICB9XG4gIC8qKlxuICAgKiBAaW50ZXJuYWxcbiAgICogQWJvcnQgdGhlIGFib3J0IGNvbnRyb2xsZXIgYW5kIGV4ZWN1dGUgYWxsIGBvbkludmFsaWRhdGVkYCBsaXN0ZW5lcnMuXG4gICAqL1xuICBub3RpZnlJbnZhbGlkYXRlZCgpIHtcbiAgICB0aGlzLmFib3J0KFwiQ29udGVudCBzY3JpcHQgY29udGV4dCBpbnZhbGlkYXRlZFwiKTtcbiAgICBsb2dnZXIuZGVidWcoXG4gICAgICBgQ29udGVudCBzY3JpcHQgXCIke3RoaXMuY29udGVudFNjcmlwdE5hbWV9XCIgY29udGV4dCBpbnZhbGlkYXRlZGBcbiAgICApO1xuICB9XG4gICNzdG9wT2xkU2NyaXB0cygpIHtcbiAgICB3aW5kb3cucG9zdE1lc3NhZ2UoXG4gICAgICB7XG4gICAgICAgIGV2ZW50OiBfQ29udGVudFNjcmlwdENvbnRleHQuU0NSSVBUX1NUQVJURURfTUVTU0FHRV9UWVBFLFxuICAgICAgICBjb250ZW50U2NyaXB0TmFtZTogdGhpcy5jb250ZW50U2NyaXB0TmFtZVxuICAgICAgfSxcbiAgICAgIFwiKlwiXG4gICAgKTtcbiAgfVxuICAjbGlzdGVuRm9yTmV3ZXJTY3JpcHRzKCkge1xuICAgIGNvbnN0IGNiID0gKGV2ZW50KSA9PiB7XG4gICAgICBpZiAoZXZlbnQuZGF0YT8udHlwZSA9PT0gX0NvbnRlbnRTY3JpcHRDb250ZXh0LlNDUklQVF9TVEFSVEVEX01FU1NBR0VfVFlQRSAmJiBldmVudC5kYXRhPy5jb250ZW50U2NyaXB0TmFtZSA9PT0gdGhpcy5jb250ZW50U2NyaXB0TmFtZSkge1xuICAgICAgICB0aGlzLm5vdGlmeUludmFsaWRhdGVkKCk7XG4gICAgICB9XG4gICAgfTtcbiAgICBhZGRFdmVudExpc3RlbmVyKFwibWVzc2FnZVwiLCBjYik7XG4gICAgdGhpcy5vbkludmFsaWRhdGVkKCgpID0+IHJlbW92ZUV2ZW50TGlzdGVuZXIoXCJtZXNzYWdlXCIsIGNiKSk7XG4gIH1cbn07XG5cbi8vIHNyYy9jbGllbnQvY29udGVudC1zY3JpcHRzL3VpL2luZGV4LnRzXG5pbXBvcnQgeyBjcmVhdGVJc29sYXRlZEVsZW1lbnQgfSBmcm9tIFwiQHdlYmV4dC1jb3JlL2lzb2xhdGVkLWVsZW1lbnRcIjtcbmZ1bmN0aW9uIGNyZWF0ZUludGVncmF0ZWRVaShjdHgsIG9wdGlvbnMpIHtcbiAgY29uc3Qgd3JhcHBlciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQob3B0aW9ucy50YWcgfHwgXCJkaXZcIik7XG4gIHdyYXBwZXIuc2V0QXR0cmlidXRlKFwiZGF0YS13eHQtaW50ZWdyYXRlZFwiLCBcIlwiKTtcbiAgbGV0IG1vdW50ZWQgPSB2b2lkIDA7XG4gIGNvbnN0IG1vdW50ID0gKCkgPT4ge1xuICAgIGFwcGx5UG9zaXRpb24od3JhcHBlciwgdm9pZCAwLCBvcHRpb25zKTtcbiAgICBtb3VudFVpKHdyYXBwZXIsIG9wdGlvbnMpO1xuICAgIG1vdW50ZWQgPSBvcHRpb25zLm9uTW91bnQ/Lih3cmFwcGVyKTtcbiAgfTtcbiAgY29uc3QgcmVtb3ZlID0gKCkgPT4ge1xuICAgIG9wdGlvbnMub25SZW1vdmU/Lihtb3VudGVkKTtcbiAgICB3cmFwcGVyLnJlbW92ZSgpO1xuICAgIG1vdW50ZWQgPSB2b2lkIDA7XG4gIH07XG4gIGN0eC5vbkludmFsaWRhdGVkKHJlbW92ZSk7XG4gIHJldHVybiB7XG4gICAgZ2V0IG1vdW50ZWQoKSB7XG4gICAgICByZXR1cm4gbW91bnRlZDtcbiAgICB9LFxuICAgIHdyYXBwZXIsXG4gICAgbW91bnQsXG4gICAgcmVtb3ZlXG4gIH07XG59XG5mdW5jdGlvbiBjcmVhdGVJZnJhbWVVaShjdHgsIG9wdGlvbnMpIHtcbiAgY29uc3Qgd3JhcHBlciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gIHdyYXBwZXIuc2V0QXR0cmlidXRlKFwiZGF0YS13eHQtaWZyYW1lXCIsIFwiXCIpO1xuICBjb25zdCBpZnJhbWUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiaWZyYW1lXCIpO1xuICBpZnJhbWUuc3JjID0gYnJvd3Nlci5ydW50aW1lLmdldFVSTChvcHRpb25zLnBhZ2UpO1xuICB3cmFwcGVyLmFwcGVuZENoaWxkKGlmcmFtZSk7XG4gIGxldCBtb3VudGVkID0gdm9pZCAwO1xuICBjb25zdCBtb3VudCA9ICgpID0+IHtcbiAgICBhcHBseVBvc2l0aW9uKHdyYXBwZXIsIGlmcmFtZSwgb3B0aW9ucyk7XG4gICAgbW91bnRVaSh3cmFwcGVyLCBvcHRpb25zKTtcbiAgICBtb3VudGVkID0gb3B0aW9ucy5vbk1vdW50Py4od3JhcHBlciwgaWZyYW1lKTtcbiAgfTtcbiAgY29uc3QgcmVtb3ZlID0gKCkgPT4ge1xuICAgIG9wdGlvbnMub25SZW1vdmU/Lihtb3VudGVkKTtcbiAgICB3cmFwcGVyLnJlbW92ZSgpO1xuICAgIG1vdW50ZWQgPSB2b2lkIDA7XG4gIH07XG4gIGN0eC5vbkludmFsaWRhdGVkKHJlbW92ZSk7XG4gIHJldHVybiB7XG4gICAgZ2V0IG1vdW50ZWQoKSB7XG4gICAgICByZXR1cm4gbW91bnRlZDtcbiAgICB9LFxuICAgIGlmcmFtZSxcbiAgICB3cmFwcGVyLFxuICAgIG1vdW50LFxuICAgIHJlbW92ZVxuICB9O1xufVxuYXN5bmMgZnVuY3Rpb24gY3JlYXRlU2hhZG93Um9vdFVpKGN0eCwgb3B0aW9ucykge1xuICBjb25zdCBjc3MgPSBbb3B0aW9ucy5jc3MgPz8gXCJcIl07XG4gIGlmIChjdHgub3B0aW9ucz8uY3NzSW5qZWN0aW9uTW9kZSA9PT0gXCJ1aVwiKSB7XG4gICAgY29uc3QgZW50cnlDc3MgPSBhd2FpdCBsb2FkQ3NzKCk7XG4gICAgY3NzLnB1c2goZW50cnlDc3MucmVwbGFjZUFsbChcIjpyb290XCIsIFwiOmhvc3RcIikpO1xuICB9XG4gIGNvbnN0IHtcbiAgICBpc29sYXRlZEVsZW1lbnQ6IHVpQ29udGFpbmVyLFxuICAgIHBhcmVudEVsZW1lbnQ6IHNoYWRvd0hvc3QsXG4gICAgc2hhZG93XG4gIH0gPSBhd2FpdCBjcmVhdGVJc29sYXRlZEVsZW1lbnQoe1xuICAgIG5hbWU6IG9wdGlvbnMubmFtZSxcbiAgICBjc3M6IHtcbiAgICAgIHRleHRDb250ZW50OiBjc3Muam9pbihcIlxcblwiKS50cmltKClcbiAgICB9LFxuICAgIG1vZGU6IG9wdGlvbnMubW9kZSA/PyBcIm9wZW5cIixcbiAgICBpc29sYXRlRXZlbnRzOiBvcHRpb25zLmlzb2xhdGVFdmVudHNcbiAgfSk7XG4gIHNoYWRvd0hvc3Quc2V0QXR0cmlidXRlKFwiZGF0YS13eHQtc2hhZG93LXJvb3RcIiwgXCJcIik7XG4gIGxldCBtb3VudGVkO1xuICBjb25zdCBtb3VudCA9ICgpID0+IHtcbiAgICBtb3VudFVpKHNoYWRvd0hvc3QsIG9wdGlvbnMpO1xuICAgIGFwcGx5UG9zaXRpb24oc2hhZG93SG9zdCwgc2hhZG93LnF1ZXJ5U2VsZWN0b3IoXCJodG1sXCIpLCBvcHRpb25zKTtcbiAgICBtb3VudGVkID0gb3B0aW9ucy5vbk1vdW50KHVpQ29udGFpbmVyLCBzaGFkb3csIHNoYWRvd0hvc3QpO1xuICB9O1xuICBjb25zdCByZW1vdmUgPSAoKSA9PiB7XG4gICAgb3B0aW9ucy5vblJlbW92ZT8uKG1vdW50ZWQpO1xuICAgIHNoYWRvd0hvc3QucmVtb3ZlKCk7XG4gICAgd2hpbGUgKHVpQ29udGFpbmVyLmxhc3RDaGlsZClcbiAgICAgIHVpQ29udGFpbmVyLnJlbW92ZUNoaWxkKHVpQ29udGFpbmVyLmxhc3RDaGlsZCk7XG4gICAgbW91bnRlZCA9IHZvaWQgMDtcbiAgfTtcbiAgY3R4Lm9uSW52YWxpZGF0ZWQocmVtb3ZlKTtcbiAgcmV0dXJuIHtcbiAgICBzaGFkb3csXG4gICAgc2hhZG93SG9zdCxcbiAgICB1aUNvbnRhaW5lcixcbiAgICBtb3VudCxcbiAgICByZW1vdmUsXG4gICAgZ2V0IG1vdW50ZWQoKSB7XG4gICAgICByZXR1cm4gbW91bnRlZDtcbiAgICB9XG4gIH07XG59XG5mdW5jdGlvbiBhcHBseVBvc2l0aW9uKHJvb3QsIHBvc2l0aW9uZWRFbGVtZW50LCBvcHRpb25zKSB7XG4gIGlmIChvcHRpb25zLnBvc2l0aW9uID09PSBcImlubGluZVwiKVxuICAgIHJldHVybjtcbiAgaWYgKG9wdGlvbnMuekluZGV4ICE9IG51bGwpXG4gICAgcm9vdC5zdHlsZS56SW5kZXggPSBTdHJpbmcob3B0aW9ucy56SW5kZXgpO1xuICByb290LnN0eWxlLm92ZXJmbG93ID0gXCJ2aXNpYmxlXCI7XG4gIHJvb3Quc3R5bGUucG9zaXRpb24gPSBcInJlbGF0aXZlXCI7XG4gIHJvb3Quc3R5bGUud2lkdGggPSBcIjBcIjtcbiAgcm9vdC5zdHlsZS5oZWlnaHQgPSBcIjBcIjtcbiAgcm9vdC5zdHlsZS5kaXNwbGF5ID0gXCJibG9ja1wiO1xuICBpZiAocG9zaXRpb25lZEVsZW1lbnQpIHtcbiAgICBpZiAob3B0aW9ucy5wb3NpdGlvbiA9PT0gXCJvdmVybGF5XCIpIHtcbiAgICAgIHBvc2l0aW9uZWRFbGVtZW50LnN0eWxlLnBvc2l0aW9uID0gXCJhYnNvbHV0ZVwiO1xuICAgICAgaWYgKG9wdGlvbnMuYWxpZ25tZW50Py5zdGFydHNXaXRoKFwiYm90dG9tLVwiKSlcbiAgICAgICAgcG9zaXRpb25lZEVsZW1lbnQuc3R5bGUuYm90dG9tID0gXCIwXCI7XG4gICAgICBlbHNlXG4gICAgICAgIHBvc2l0aW9uZWRFbGVtZW50LnN0eWxlLnRvcCA9IFwiMFwiO1xuICAgICAgaWYgKG9wdGlvbnMuYWxpZ25tZW50Py5lbmRzV2l0aChcIi1yaWdodFwiKSlcbiAgICAgICAgcG9zaXRpb25lZEVsZW1lbnQuc3R5bGUucmlnaHQgPSBcIjBcIjtcbiAgICAgIGVsc2VcbiAgICAgICAgcG9zaXRpb25lZEVsZW1lbnQuc3R5bGUubGVmdCA9IFwiMFwiO1xuICAgIH0gZWxzZSB7XG4gICAgICBwb3NpdGlvbmVkRWxlbWVudC5zdHlsZS5wb3NpdGlvbiA9IFwiZml4ZWRcIjtcbiAgICAgIHBvc2l0aW9uZWRFbGVtZW50LnN0eWxlLnRvcCA9IFwiMFwiO1xuICAgICAgcG9zaXRpb25lZEVsZW1lbnQuc3R5bGUuYm90dG9tID0gXCIwXCI7XG4gICAgICBwb3NpdGlvbmVkRWxlbWVudC5zdHlsZS5sZWZ0ID0gXCIwXCI7XG4gICAgICBwb3NpdGlvbmVkRWxlbWVudC5zdHlsZS5yaWdodCA9IFwiMFwiO1xuICAgIH1cbiAgfVxufVxuZnVuY3Rpb24gZ2V0QW5jaG9yKG9wdGlvbnMpIHtcbiAgaWYgKG9wdGlvbnMuYW5jaG9yID09IG51bGwpXG4gICAgcmV0dXJuIGRvY3VtZW50LmJvZHk7XG4gIGxldCByZXNvbHZlZCA9IHR5cGVvZiBvcHRpb25zLmFuY2hvciA9PT0gXCJmdW5jdGlvblwiID8gb3B0aW9ucy5hbmNob3IoKSA6IG9wdGlvbnMuYW5jaG9yO1xuICBpZiAodHlwZW9mIHJlc29sdmVkID09PSBcInN0cmluZ1wiKVxuICAgIHJldHVybiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKHJlc29sdmVkKSA/PyB2b2lkIDA7XG4gIHJldHVybiByZXNvbHZlZCA/PyB2b2lkIDA7XG59XG5mdW5jdGlvbiBtb3VudFVpKHJvb3QsIG9wdGlvbnMpIHtcbiAgY29uc3QgYW5jaG9yID0gZ2V0QW5jaG9yKG9wdGlvbnMpO1xuICBpZiAoYW5jaG9yID09IG51bGwpXG4gICAgdGhyb3cgRXJyb3IoXG4gICAgICBcIkZhaWxlZCB0byBtb3VudCBjb250ZW50IHNjcmlwdCBVSTogY291bGQgbm90IGZpbmQgYW5jaG9yIGVsZW1lbnRcIlxuICAgICk7XG4gIHN3aXRjaCAob3B0aW9ucy5hcHBlbmQpIHtcbiAgICBjYXNlIHZvaWQgMDpcbiAgICBjYXNlIFwibGFzdFwiOlxuICAgICAgYW5jaG9yLmFwcGVuZChyb290KTtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgXCJmaXJzdFwiOlxuICAgICAgYW5jaG9yLnByZXBlbmQocm9vdCk7XG4gICAgICBicmVhaztcbiAgICBjYXNlIFwicmVwbGFjZVwiOlxuICAgICAgYW5jaG9yLnJlcGxhY2VXaXRoKHJvb3QpO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSBcImFmdGVyXCI6XG4gICAgICBhbmNob3IucGFyZW50RWxlbWVudD8uaW5zZXJ0QmVmb3JlKHJvb3QsIGFuY2hvci5uZXh0RWxlbWVudFNpYmxpbmcpO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSBcImJlZm9yZVwiOlxuICAgICAgYW5jaG9yLnBhcmVudEVsZW1lbnQ/Lmluc2VydEJlZm9yZShyb290LCBhbmNob3IpO1xuICAgICAgYnJlYWs7XG4gICAgZGVmYXVsdDpcbiAgICAgIG9wdGlvbnMuYXBwZW5kKGFuY2hvciwgcm9vdCk7XG4gICAgICBicmVhaztcbiAgfVxufVxuYXN5bmMgZnVuY3Rpb24gbG9hZENzcygpIHtcbiAgY29uc3QgdXJsID0gYnJvd3Nlci5ydW50aW1lLmdldFVSTChcbiAgICBgL2NvbnRlbnQtc2NyaXB0cy8ke2ltcG9ydC5tZXRhLmVudi5FTlRSWVBPSU5UfS5jc3NgXG4gICk7XG4gIHRyeSB7XG4gICAgY29uc3QgcmVzID0gYXdhaXQgZmV0Y2godXJsKTtcbiAgICByZXR1cm4gYXdhaXQgcmVzLnRleHQoKTtcbiAgfSBjYXRjaCAoZXJyKSB7XG4gICAgbG9nZ2VyLndhcm4oXG4gICAgICBgRmFpbGVkIHRvIGxvYWQgc3R5bGVzIEAgJHt1cmx9LiBEaWQgeW91IGZvcmdldCB0byBpbXBvcnQgdGhlIHN0eWxlc2hlZXQgaW4geW91ciBlbnRyeXBvaW50P2AsXG4gICAgICBlcnJcbiAgICApO1xuICAgIHJldHVybiBcIlwiO1xuICB9XG59XG5leHBvcnQge1xuICBDb250ZW50U2NyaXB0Q29udGV4dCxcbiAgY3JlYXRlSWZyYW1lVWksXG4gIGNyZWF0ZUludGVncmF0ZWRVaSxcbiAgY3JlYXRlU2hhZG93Um9vdFVpXG59O1xuIl0sIm5hbWVzIjpbImRlZmluaXRpb24iLCJnbG9iYWwiLCJ0aGlzIiwibW9kdWxlIiwiX2IiLCJfYSIsInByb3h5VGFyZ2V0IiwidmFsdWUiLCJtZXNzYWdlIiwiTWVzc2FnZVR5cGUiLCJwcmludCIsImxvZ2dlciJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQWVBLFdBQVMsb0JBQW9CQSxhQUFZO0FBQ3ZDLFdBQU9BO0FBQUEsRUFDVDs7Ozs7OztBQ2pCQSxLQUFDLFNBQVVDLFNBQVEsU0FBUztBQUdpQjtBQUN6QyxnQkFBUSxNQUFNO0FBQUEsTUFPZjtBQUFBLElBQ0gsR0FBRyxPQUFPLGVBQWUsY0FBYyxhQUFhLE9BQU8sU0FBUyxjQUFjLE9BQU9DLGdCQUFNLFNBQVVDLFNBQVE7O0FBWS9HLFVBQUksR0FBQ0MsT0FBQUMsTUFBQSxXQUFXLFdBQVgsZ0JBQUFBLElBQW1CLFlBQW5CLGdCQUFBRCxJQUE0QixLQUFJO0FBQ25DLGNBQU0sSUFBSSxNQUFNLDJEQUEyRDtBQUFBLE1BQzVFO0FBRUQsVUFBSSxPQUFPLFdBQVcsWUFBWSxlQUFlLE9BQU8sZUFBZSxXQUFXLE9BQU8sTUFBTSxPQUFPLFdBQVc7QUFDL0csY0FBTSxtREFBbUQ7QUFNekQsY0FBTSxXQUFXLG1CQUFpQjtBQUloQyxnQkFBTSxjQUFjO0FBQUEsWUFDbEIsVUFBVTtBQUFBLGNBQ1IsU0FBUztBQUFBLGdCQUNQLFdBQVc7QUFBQSxnQkFDWCxXQUFXO0FBQUEsY0FDWjtBQUFBLGNBQ0QsWUFBWTtBQUFBLGdCQUNWLFdBQVc7QUFBQSxnQkFDWCxXQUFXO0FBQUEsY0FDWjtBQUFBLGNBQ0QsT0FBTztBQUFBLGdCQUNMLFdBQVc7QUFBQSxnQkFDWCxXQUFXO0FBQUEsY0FDWjtBQUFBLGNBQ0QsVUFBVTtBQUFBLGdCQUNSLFdBQVc7QUFBQSxnQkFDWCxXQUFXO0FBQUEsY0FDWjtBQUFBLFlBQ0Y7QUFBQSxZQUNELGFBQWE7QUFBQSxjQUNYLFVBQVU7QUFBQSxnQkFDUixXQUFXO0FBQUEsZ0JBQ1gsV0FBVztBQUFBLGNBQ1o7QUFBQSxjQUNELE9BQU87QUFBQSxnQkFDTCxXQUFXO0FBQUEsZ0JBQ1gsV0FBVztBQUFBLGNBQ1o7QUFBQSxjQUNELGVBQWU7QUFBQSxnQkFDYixXQUFXO0FBQUEsZ0JBQ1gsV0FBVztBQUFBLGNBQ1o7QUFBQSxjQUNELGFBQWE7QUFBQSxnQkFDWCxXQUFXO0FBQUEsZ0JBQ1gsV0FBVztBQUFBLGNBQ1o7QUFBQSxjQUNELGNBQWM7QUFBQSxnQkFDWixXQUFXO0FBQUEsZ0JBQ1gsV0FBVztBQUFBLGNBQ1o7QUFBQSxjQUNELFdBQVc7QUFBQSxnQkFDVCxXQUFXO0FBQUEsZ0JBQ1gsV0FBVztBQUFBLGNBQ1o7QUFBQSxjQUNELFFBQVE7QUFBQSxnQkFDTixXQUFXO0FBQUEsZ0JBQ1gsV0FBVztBQUFBLGNBQ1o7QUFBQSxjQUNELFVBQVU7QUFBQSxnQkFDUixXQUFXO0FBQUEsZ0JBQ1gsV0FBVztBQUFBLGNBQ1o7QUFBQSxjQUNELGNBQWM7QUFBQSxnQkFDWixXQUFXO0FBQUEsZ0JBQ1gsV0FBVztBQUFBLGNBQ1o7QUFBQSxjQUNELFVBQVU7QUFBQSxnQkFDUixXQUFXO0FBQUEsZ0JBQ1gsV0FBVztBQUFBLGNBQ1o7QUFBQSxjQUNELFVBQVU7QUFBQSxnQkFDUixXQUFXO0FBQUEsZ0JBQ1gsV0FBVztBQUFBLGNBQ1o7QUFBQSxZQUNGO0FBQUEsWUFDRCxpQkFBaUI7QUFBQSxjQUNmLFdBQVc7QUFBQSxnQkFDVCxXQUFXO0FBQUEsZ0JBQ1gsV0FBVztBQUFBLGdCQUNYLHdCQUF3QjtBQUFBLGNBQ3pCO0FBQUEsY0FDRCxVQUFVO0FBQUEsZ0JBQ1IsV0FBVztBQUFBLGdCQUNYLFdBQVc7QUFBQSxnQkFDWCx3QkFBd0I7QUFBQSxjQUN6QjtBQUFBLGNBQ0QsMkJBQTJCO0FBQUEsZ0JBQ3pCLFdBQVc7QUFBQSxnQkFDWCxXQUFXO0FBQUEsY0FDWjtBQUFBLGNBQ0QsZ0JBQWdCO0FBQUEsZ0JBQ2QsV0FBVztBQUFBLGdCQUNYLFdBQVc7QUFBQSxjQUNaO0FBQUEsY0FDRCxZQUFZO0FBQUEsZ0JBQ1YsV0FBVztBQUFBLGdCQUNYLFdBQVc7QUFBQSxjQUNaO0FBQUEsY0FDRCxZQUFZO0FBQUEsZ0JBQ1YsV0FBVztBQUFBLGdCQUNYLFdBQVc7QUFBQSxjQUNaO0FBQUEsY0FDRCxhQUFhO0FBQUEsZ0JBQ1gsV0FBVztBQUFBLGdCQUNYLFdBQVc7QUFBQSxjQUNaO0FBQUEsY0FDRCwyQkFBMkI7QUFBQSxnQkFDekIsV0FBVztBQUFBLGdCQUNYLFdBQVc7QUFBQSxnQkFDWCx3QkFBd0I7QUFBQSxjQUN6QjtBQUFBLGNBQ0QsZ0JBQWdCO0FBQUEsZ0JBQ2QsV0FBVztBQUFBLGdCQUNYLFdBQVc7QUFBQSxnQkFDWCx3QkFBd0I7QUFBQSxjQUN6QjtBQUFBLGNBQ0QsV0FBVztBQUFBLGdCQUNULFdBQVc7QUFBQSxnQkFDWCxXQUFXO0FBQUEsY0FDWjtBQUFBLGNBQ0QsWUFBWTtBQUFBLGdCQUNWLFdBQVc7QUFBQSxnQkFDWCxXQUFXO0FBQUEsZ0JBQ1gsd0JBQXdCO0FBQUEsY0FDekI7QUFBQSxjQUNELFlBQVk7QUFBQSxnQkFDVixXQUFXO0FBQUEsZ0JBQ1gsV0FBVztBQUFBLGdCQUNYLHdCQUF3QjtBQUFBLGNBQ3pCO0FBQUEsWUFDRjtBQUFBLFlBQ0QsZ0JBQWdCO0FBQUEsY0FDZCxVQUFVO0FBQUEsZ0JBQ1IsV0FBVztBQUFBLGdCQUNYLFdBQVc7QUFBQSxjQUNaO0FBQUEsY0FDRCxlQUFlO0FBQUEsZ0JBQ2IsV0FBVztBQUFBLGdCQUNYLFdBQVc7QUFBQSxjQUNaO0FBQUEsY0FDRCxpQkFBaUI7QUFBQSxnQkFDZixXQUFXO0FBQUEsZ0JBQ1gsV0FBVztBQUFBLGNBQ1o7QUFBQSxjQUNELG1CQUFtQjtBQUFBLGdCQUNqQixXQUFXO0FBQUEsZ0JBQ1gsV0FBVztBQUFBLGNBQ1o7QUFBQSxjQUNELGtCQUFrQjtBQUFBLGdCQUNoQixXQUFXO0FBQUEsZ0JBQ1gsV0FBVztBQUFBLGNBQ1o7QUFBQSxjQUNELGlCQUFpQjtBQUFBLGdCQUNmLFdBQVc7QUFBQSxnQkFDWCxXQUFXO0FBQUEsY0FDWjtBQUFBLGNBQ0Qsc0JBQXNCO0FBQUEsZ0JBQ3BCLFdBQVc7QUFBQSxnQkFDWCxXQUFXO0FBQUEsY0FDWjtBQUFBLGNBQ0QsbUJBQW1CO0FBQUEsZ0JBQ2pCLFdBQVc7QUFBQSxnQkFDWCxXQUFXO0FBQUEsY0FDWjtBQUFBLGNBQ0Qsb0JBQW9CO0FBQUEsZ0JBQ2xCLFdBQVc7QUFBQSxnQkFDWCxXQUFXO0FBQUEsY0FDWjtBQUFBLGNBQ0QsWUFBWTtBQUFBLGdCQUNWLFdBQVc7QUFBQSxnQkFDWCxXQUFXO0FBQUEsY0FDWjtBQUFBLFlBQ0Y7QUFBQSxZQUNELFlBQVk7QUFBQSxjQUNWLFVBQVU7QUFBQSxnQkFDUixXQUFXO0FBQUEsZ0JBQ1gsV0FBVztBQUFBLGNBQ1o7QUFBQSxZQUNGO0FBQUEsWUFDRCxnQkFBZ0I7QUFBQSxjQUNkLFVBQVU7QUFBQSxnQkFDUixXQUFXO0FBQUEsZ0JBQ1gsV0FBVztBQUFBLGNBQ1o7QUFBQSxjQUNELGFBQWE7QUFBQSxnQkFDWCxXQUFXO0FBQUEsZ0JBQ1gsV0FBVztBQUFBLGNBQ1o7QUFBQSxjQUNELFVBQVU7QUFBQSxnQkFDUixXQUFXO0FBQUEsZ0JBQ1gsV0FBVztBQUFBLGNBQ1o7QUFBQSxZQUNGO0FBQUEsWUFDRCxXQUFXO0FBQUEsY0FDVCxPQUFPO0FBQUEsZ0JBQ0wsV0FBVztBQUFBLGdCQUNYLFdBQVc7QUFBQSxjQUNaO0FBQUEsY0FDRCxVQUFVO0FBQUEsZ0JBQ1IsV0FBVztBQUFBLGdCQUNYLFdBQVc7QUFBQSxjQUNaO0FBQUEsY0FDRCxzQkFBc0I7QUFBQSxnQkFDcEIsV0FBVztBQUFBLGdCQUNYLFdBQVc7QUFBQSxjQUNaO0FBQUEsY0FDRCxVQUFVO0FBQUEsZ0JBQ1IsV0FBVztBQUFBLGdCQUNYLFdBQVc7QUFBQSxjQUNaO0FBQUEsY0FDRCxPQUFPO0FBQUEsZ0JBQ0wsV0FBVztBQUFBLGdCQUNYLFdBQVc7QUFBQSxjQUNaO0FBQUEsWUFDRjtBQUFBLFlBQ0QsWUFBWTtBQUFBLGNBQ1YsbUJBQW1CO0FBQUEsZ0JBQ2pCLFFBQVE7QUFBQSxrQkFDTixXQUFXO0FBQUEsa0JBQ1gsV0FBVztBQUFBLGtCQUNYLHFCQUFxQjtBQUFBLGdCQUN0QjtBQUFBLGNBQ0Y7QUFBQSxjQUNELFVBQVU7QUFBQSxnQkFDUixVQUFVO0FBQUEsa0JBQ1IsV0FBVztBQUFBLGtCQUNYLFdBQVc7QUFBQSxrQkFDWCxxQkFBcUI7QUFBQSxnQkFDdEI7QUFBQSxnQkFDRCxZQUFZO0FBQUEsa0JBQ1YscUJBQXFCO0FBQUEsb0JBQ25CLFdBQVc7QUFBQSxvQkFDWCxXQUFXO0FBQUEsa0JBQ1o7QUFBQSxnQkFDRjtBQUFBLGNBQ0Y7QUFBQSxZQUNGO0FBQUEsWUFDRCxhQUFhO0FBQUEsY0FDWCxVQUFVO0FBQUEsZ0JBQ1IsV0FBVztBQUFBLGdCQUNYLFdBQVc7QUFBQSxjQUNaO0FBQUEsY0FDRCxZQUFZO0FBQUEsZ0JBQ1YsV0FBVztBQUFBLGdCQUNYLFdBQVc7QUFBQSxjQUNaO0FBQUEsY0FDRCxTQUFTO0FBQUEsZ0JBQ1AsV0FBVztBQUFBLGdCQUNYLFdBQVc7QUFBQSxjQUNaO0FBQUEsY0FDRCxlQUFlO0FBQUEsZ0JBQ2IsV0FBVztBQUFBLGdCQUNYLFdBQVc7QUFBQSxjQUNaO0FBQUEsY0FDRCxRQUFRO0FBQUEsZ0JBQ04sV0FBVztBQUFBLGdCQUNYLFdBQVc7QUFBQSxnQkFDWCx3QkFBd0I7QUFBQSxjQUN6QjtBQUFBLGNBQ0QsU0FBUztBQUFBLGdCQUNQLFdBQVc7QUFBQSxnQkFDWCxXQUFXO0FBQUEsY0FDWjtBQUFBLGNBQ0QsY0FBYztBQUFBLGdCQUNaLFdBQVc7QUFBQSxnQkFDWCxXQUFXO0FBQUEsY0FDWjtBQUFBLGNBQ0QsVUFBVTtBQUFBLGdCQUNSLFdBQVc7QUFBQSxnQkFDWCxXQUFXO0FBQUEsY0FDWjtBQUFBLGNBQ0QsVUFBVTtBQUFBLGdCQUNSLFdBQVc7QUFBQSxnQkFDWCxXQUFXO0FBQUEsY0FDWjtBQUFBLGNBQ0QsUUFBUTtBQUFBLGdCQUNOLFdBQVc7QUFBQSxnQkFDWCxXQUFXO0FBQUEsZ0JBQ1gsd0JBQXdCO0FBQUEsY0FDekI7QUFBQSxZQUNGO0FBQUEsWUFDRCxhQUFhO0FBQUEsY0FDWCw2QkFBNkI7QUFBQSxnQkFDM0IsV0FBVztBQUFBLGdCQUNYLFdBQVc7QUFBQSxjQUNaO0FBQUEsY0FDRCw0QkFBNEI7QUFBQSxnQkFDMUIsV0FBVztBQUFBLGdCQUNYLFdBQVc7QUFBQSxjQUNaO0FBQUEsWUFDRjtBQUFBLFlBQ0QsV0FBVztBQUFBLGNBQ1QsVUFBVTtBQUFBLGdCQUNSLFdBQVc7QUFBQSxnQkFDWCxXQUFXO0FBQUEsY0FDWjtBQUFBLGNBQ0QsYUFBYTtBQUFBLGdCQUNYLFdBQVc7QUFBQSxnQkFDWCxXQUFXO0FBQUEsY0FDWjtBQUFBLGNBQ0QsZUFBZTtBQUFBLGdCQUNiLFdBQVc7QUFBQSxnQkFDWCxXQUFXO0FBQUEsY0FDWjtBQUFBLGNBQ0QsYUFBYTtBQUFBLGdCQUNYLFdBQVc7QUFBQSxnQkFDWCxXQUFXO0FBQUEsY0FDWjtBQUFBLGNBQ0QsYUFBYTtBQUFBLGdCQUNYLFdBQVc7QUFBQSxnQkFDWCxXQUFXO0FBQUEsY0FDWjtBQUFBLGNBQ0QsVUFBVTtBQUFBLGdCQUNSLFdBQVc7QUFBQSxnQkFDWCxXQUFXO0FBQUEsY0FDWjtBQUFBLFlBQ0Y7QUFBQSxZQUNELFFBQVE7QUFBQSxjQUNOLGtCQUFrQjtBQUFBLGdCQUNoQixXQUFXO0FBQUEsZ0JBQ1gsV0FBVztBQUFBLGNBQ1o7QUFBQSxjQUNELHNCQUFzQjtBQUFBLGdCQUNwQixXQUFXO0FBQUEsZ0JBQ1gsV0FBVztBQUFBLGNBQ1o7QUFBQSxZQUNGO0FBQUEsWUFDRCxZQUFZO0FBQUEsY0FDVixxQkFBcUI7QUFBQSxnQkFDbkIsV0FBVztBQUFBLGdCQUNYLFdBQVc7QUFBQSxjQUNaO0FBQUEsWUFDRjtBQUFBLFlBQ0QsUUFBUTtBQUFBLGNBQ04sY0FBYztBQUFBLGdCQUNaLFdBQVc7QUFBQSxnQkFDWCxXQUFXO0FBQUEsY0FDWjtBQUFBLFlBQ0Y7QUFBQSxZQUNELGNBQWM7QUFBQSxjQUNaLE9BQU87QUFBQSxnQkFDTCxXQUFXO0FBQUEsZ0JBQ1gsV0FBVztBQUFBLGNBQ1o7QUFBQSxjQUNELFVBQVU7QUFBQSxnQkFDUixXQUFXO0FBQUEsZ0JBQ1gsV0FBVztBQUFBLGNBQ1o7QUFBQSxjQUNELFdBQVc7QUFBQSxnQkFDVCxXQUFXO0FBQUEsZ0JBQ1gsV0FBVztBQUFBLGNBQ1o7QUFBQSxjQUNELGNBQWM7QUFBQSxnQkFDWixXQUFXO0FBQUEsZ0JBQ1gsV0FBVztBQUFBLGNBQ1o7QUFBQSxjQUNELGlCQUFpQjtBQUFBLGdCQUNmLFdBQVc7QUFBQSxnQkFDWCxXQUFXO0FBQUEsY0FDWjtBQUFBLFlBQ0Y7QUFBQSxZQUNELGlCQUFpQjtBQUFBLGNBQ2YsU0FBUztBQUFBLGdCQUNQLFdBQVc7QUFBQSxnQkFDWCxXQUFXO0FBQUEsY0FDWjtBQUFBLGNBQ0QsVUFBVTtBQUFBLGdCQUNSLFdBQVc7QUFBQSxnQkFDWCxXQUFXO0FBQUEsY0FDWjtBQUFBLGNBQ0QsVUFBVTtBQUFBLGdCQUNSLFdBQVc7QUFBQSxnQkFDWCxXQUFXO0FBQUEsY0FDWjtBQUFBLGNBQ0Qsc0JBQXNCO0FBQUEsZ0JBQ3BCLFdBQVc7QUFBQSxnQkFDWCxXQUFXO0FBQUEsY0FDWjtBQUFBLGNBQ0QsVUFBVTtBQUFBLGdCQUNSLFdBQVc7QUFBQSxnQkFDWCxXQUFXO0FBQUEsY0FDWjtBQUFBLFlBQ0Y7QUFBQSxZQUNELGNBQWM7QUFBQSxjQUNaLFlBQVk7QUFBQSxnQkFDVixXQUFXO0FBQUEsZ0JBQ1gsV0FBVztBQUFBLGNBQ1o7QUFBQSxjQUNELFlBQVk7QUFBQSxnQkFDVixXQUFXO0FBQUEsZ0JBQ1gsV0FBVztBQUFBLGNBQ1o7QUFBQSxjQUNELFFBQVE7QUFBQSxnQkFDTixXQUFXO0FBQUEsZ0JBQ1gsV0FBVztBQUFBLGdCQUNYLHdCQUF3QjtBQUFBLGNBQ3pCO0FBQUEsY0FDRCxXQUFXO0FBQUEsZ0JBQ1QsV0FBVztBQUFBLGdCQUNYLFdBQVc7QUFBQSxjQUNaO0FBQUEsY0FDRCxZQUFZO0FBQUEsZ0JBQ1YsV0FBVztBQUFBLGdCQUNYLFdBQVc7QUFBQSxnQkFDWCx3QkFBd0I7QUFBQSxjQUN6QjtBQUFBLGNBQ0QsWUFBWTtBQUFBLGdCQUNWLFdBQVc7QUFBQSxnQkFDWCxXQUFXO0FBQUEsZ0JBQ1gsd0JBQXdCO0FBQUEsY0FDekI7QUFBQSxjQUNELFFBQVE7QUFBQSxnQkFDTixXQUFXO0FBQUEsZ0JBQ1gsV0FBVztBQUFBLGdCQUNYLHdCQUF3QjtBQUFBLGNBQ3pCO0FBQUEsWUFDRjtBQUFBLFlBQ0QsZUFBZTtBQUFBLGNBQ2IsWUFBWTtBQUFBLGdCQUNWLFdBQVc7QUFBQSxnQkFDWCxXQUFXO0FBQUEsY0FDWjtBQUFBLGNBQ0QsVUFBVTtBQUFBLGdCQUNSLFdBQVc7QUFBQSxnQkFDWCxXQUFXO0FBQUEsY0FDWjtBQUFBLGNBQ0QsVUFBVTtBQUFBLGdCQUNSLFdBQVc7QUFBQSxnQkFDWCxXQUFXO0FBQUEsY0FDWjtBQUFBLGNBQ0QsV0FBVztBQUFBLGdCQUNULFdBQVc7QUFBQSxnQkFDWCxXQUFXO0FBQUEsY0FDWjtBQUFBLFlBQ0Y7QUFBQSxZQUNELFdBQVc7QUFBQSxjQUNULHFCQUFxQjtBQUFBLGdCQUNuQixXQUFXO0FBQUEsZ0JBQ1gsV0FBVztBQUFBLGNBQ1o7QUFBQSxjQUNELG1CQUFtQjtBQUFBLGdCQUNqQixXQUFXO0FBQUEsZ0JBQ1gsV0FBVztBQUFBLGNBQ1o7QUFBQSxjQUNELG1CQUFtQjtBQUFBLGdCQUNqQixXQUFXO0FBQUEsZ0JBQ1gsV0FBVztBQUFBLGNBQ1o7QUFBQSxjQUNELHNCQUFzQjtBQUFBLGdCQUNwQixXQUFXO0FBQUEsZ0JBQ1gsV0FBVztBQUFBLGNBQ1o7QUFBQSxjQUNELGVBQWU7QUFBQSxnQkFDYixXQUFXO0FBQUEsZ0JBQ1gsV0FBVztBQUFBLGNBQ1o7QUFBQSxjQUNELHFCQUFxQjtBQUFBLGdCQUNuQixXQUFXO0FBQUEsZ0JBQ1gsV0FBVztBQUFBLGNBQ1o7QUFBQSxjQUNELG1CQUFtQjtBQUFBLGdCQUNqQixXQUFXO0FBQUEsZ0JBQ1gsV0FBVztBQUFBLGNBQ1o7QUFBQSxZQUNGO0FBQUEsWUFDRCxZQUFZO0FBQUEsY0FDVixjQUFjO0FBQUEsZ0JBQ1osV0FBVztBQUFBLGdCQUNYLFdBQVc7QUFBQSxjQUNaO0FBQUEsY0FDRCxxQkFBcUI7QUFBQSxnQkFDbkIsV0FBVztBQUFBLGdCQUNYLFdBQVc7QUFBQSxjQUNaO0FBQUEsY0FDRCxXQUFXO0FBQUEsZ0JBQ1QsV0FBVztBQUFBLGdCQUNYLFdBQVc7QUFBQSxjQUNaO0FBQUEsWUFDRjtBQUFBLFlBQ0QsV0FBVztBQUFBLGNBQ1QsU0FBUztBQUFBLGdCQUNQLFNBQVM7QUFBQSxrQkFDUCxXQUFXO0FBQUEsa0JBQ1gsV0FBVztBQUFBLGdCQUNaO0FBQUEsZ0JBQ0QsT0FBTztBQUFBLGtCQUNMLFdBQVc7QUFBQSxrQkFDWCxXQUFXO0FBQUEsZ0JBQ1o7QUFBQSxnQkFDRCxpQkFBaUI7QUFBQSxrQkFDZixXQUFXO0FBQUEsa0JBQ1gsV0FBVztBQUFBLGdCQUNaO0FBQUEsZ0JBQ0QsVUFBVTtBQUFBLGtCQUNSLFdBQVc7QUFBQSxrQkFDWCxXQUFXO0FBQUEsZ0JBQ1o7QUFBQSxnQkFDRCxPQUFPO0FBQUEsa0JBQ0wsV0FBVztBQUFBLGtCQUNYLFdBQVc7QUFBQSxnQkFDWjtBQUFBLGNBQ0Y7QUFBQSxjQUNELFdBQVc7QUFBQSxnQkFDVCxPQUFPO0FBQUEsa0JBQ0wsV0FBVztBQUFBLGtCQUNYLFdBQVc7QUFBQSxnQkFDWjtBQUFBLGdCQUNELGlCQUFpQjtBQUFBLGtCQUNmLFdBQVc7QUFBQSxrQkFDWCxXQUFXO0FBQUEsZ0JBQ1o7QUFBQSxjQUNGO0FBQUEsY0FDRCxRQUFRO0FBQUEsZ0JBQ04sU0FBUztBQUFBLGtCQUNQLFdBQVc7QUFBQSxrQkFDWCxXQUFXO0FBQUEsZ0JBQ1o7QUFBQSxnQkFDRCxPQUFPO0FBQUEsa0JBQ0wsV0FBVztBQUFBLGtCQUNYLFdBQVc7QUFBQSxnQkFDWjtBQUFBLGdCQUNELGlCQUFpQjtBQUFBLGtCQUNmLFdBQVc7QUFBQSxrQkFDWCxXQUFXO0FBQUEsZ0JBQ1o7QUFBQSxnQkFDRCxVQUFVO0FBQUEsa0JBQ1IsV0FBVztBQUFBLGtCQUNYLFdBQVc7QUFBQSxnQkFDWjtBQUFBLGdCQUNELE9BQU87QUFBQSxrQkFDTCxXQUFXO0FBQUEsa0JBQ1gsV0FBVztBQUFBLGdCQUNaO0FBQUEsY0FDRjtBQUFBLFlBQ0Y7QUFBQSxZQUNELFFBQVE7QUFBQSxjQUNOLHFCQUFxQjtBQUFBLGdCQUNuQixXQUFXO0FBQUEsZ0JBQ1gsV0FBVztBQUFBLGNBQ1o7QUFBQSxjQUNELFVBQVU7QUFBQSxnQkFDUixXQUFXO0FBQUEsZ0JBQ1gsV0FBVztBQUFBLGNBQ1o7QUFBQSxjQUNELGtCQUFrQjtBQUFBLGdCQUNoQixXQUFXO0FBQUEsZ0JBQ1gsV0FBVztBQUFBLGNBQ1o7QUFBQSxjQUNELFdBQVc7QUFBQSxnQkFDVCxXQUFXO0FBQUEsZ0JBQ1gsV0FBVztBQUFBLGNBQ1o7QUFBQSxjQUNELGFBQWE7QUFBQSxnQkFDWCxXQUFXO0FBQUEsZ0JBQ1gsV0FBVztBQUFBLGNBQ1o7QUFBQSxjQUNELGlCQUFpQjtBQUFBLGdCQUNmLFdBQVc7QUFBQSxnQkFDWCxXQUFXO0FBQUEsY0FDWjtBQUFBLGNBQ0QsT0FBTztBQUFBLGdCQUNMLFdBQVc7QUFBQSxnQkFDWCxXQUFXO0FBQUEsY0FDWjtBQUFBLGNBQ0QsY0FBYztBQUFBLGdCQUNaLFdBQVc7QUFBQSxnQkFDWCxXQUFXO0FBQUEsY0FDWjtBQUFBLGNBQ0QsV0FBVztBQUFBLGdCQUNULFdBQVc7QUFBQSxnQkFDWCxXQUFXO0FBQUEsY0FDWjtBQUFBLGNBQ0QsbUJBQW1CO0FBQUEsZ0JBQ2pCLFdBQVc7QUFBQSxnQkFDWCxXQUFXO0FBQUEsY0FDWjtBQUFBLGNBQ0QsVUFBVTtBQUFBLGdCQUNSLFdBQVc7QUFBQSxnQkFDWCxXQUFXO0FBQUEsY0FDWjtBQUFBLGNBQ0QsYUFBYTtBQUFBLGdCQUNYLFdBQVc7QUFBQSxnQkFDWCxXQUFXO0FBQUEsY0FDWjtBQUFBLGNBQ0QsYUFBYTtBQUFBLGdCQUNYLFdBQVc7QUFBQSxnQkFDWCxXQUFXO0FBQUEsY0FDWjtBQUFBLGNBQ0QsYUFBYTtBQUFBLGdCQUNYLFdBQVc7QUFBQSxnQkFDWCxXQUFXO0FBQUEsY0FDWjtBQUFBLGNBQ0QsUUFBUTtBQUFBLGdCQUNOLFdBQVc7QUFBQSxnQkFDWCxXQUFXO0FBQUEsY0FDWjtBQUFBLGNBQ0QsU0FBUztBQUFBLGdCQUNQLFdBQVc7QUFBQSxnQkFDWCxXQUFXO0FBQUEsY0FDWjtBQUFBLGNBQ0QsVUFBVTtBQUFBLGdCQUNSLFdBQVc7QUFBQSxnQkFDWCxXQUFXO0FBQUEsY0FDWjtBQUFBLGNBQ0QsVUFBVTtBQUFBLGdCQUNSLFdBQVc7QUFBQSxnQkFDWCxXQUFXO0FBQUEsY0FDWjtBQUFBLGNBQ0QsYUFBYTtBQUFBLGdCQUNYLFdBQVc7QUFBQSxnQkFDWCxXQUFXO0FBQUEsY0FDWjtBQUFBLGNBQ0QsZUFBZTtBQUFBLGdCQUNiLFdBQVc7QUFBQSxnQkFDWCxXQUFXO0FBQUEsY0FDWjtBQUFBLGNBQ0QsV0FBVztBQUFBLGdCQUNULFdBQVc7QUFBQSxnQkFDWCxXQUFXO0FBQUEsY0FDWjtBQUFBLGNBQ0QsbUJBQW1CO0FBQUEsZ0JBQ2pCLFdBQVc7QUFBQSxnQkFDWCxXQUFXO0FBQUEsY0FDWjtBQUFBLGNBQ0QsVUFBVTtBQUFBLGdCQUNSLFdBQVc7QUFBQSxnQkFDWCxXQUFXO0FBQUEsY0FDWjtBQUFBLFlBQ0Y7QUFBQSxZQUNELFlBQVk7QUFBQSxjQUNWLE9BQU87QUFBQSxnQkFDTCxXQUFXO0FBQUEsZ0JBQ1gsV0FBVztBQUFBLGNBQ1o7QUFBQSxZQUNGO0FBQUEsWUFDRCxpQkFBaUI7QUFBQSxjQUNmLGdCQUFnQjtBQUFBLGdCQUNkLFdBQVc7QUFBQSxnQkFDWCxXQUFXO0FBQUEsY0FDWjtBQUFBLGNBQ0QsWUFBWTtBQUFBLGdCQUNWLFdBQVc7QUFBQSxnQkFDWCxXQUFXO0FBQUEsY0FDWjtBQUFBLFlBQ0Y7QUFBQSxZQUNELGNBQWM7QUFBQSxjQUNaLDBCQUEwQjtBQUFBLGdCQUN4QixXQUFXO0FBQUEsZ0JBQ1gsV0FBVztBQUFBLGNBQ1o7QUFBQSxZQUNGO0FBQUEsWUFDRCxXQUFXO0FBQUEsY0FDVCxVQUFVO0FBQUEsZ0JBQ1IsV0FBVztBQUFBLGdCQUNYLFdBQVc7QUFBQSxjQUNaO0FBQUEsY0FDRCxPQUFPO0FBQUEsZ0JBQ0wsV0FBVztBQUFBLGdCQUNYLFdBQVc7QUFBQSxjQUNaO0FBQUEsY0FDRCxVQUFVO0FBQUEsZ0JBQ1IsV0FBVztBQUFBLGdCQUNYLFdBQVc7QUFBQSxjQUNaO0FBQUEsY0FDRCxjQUFjO0FBQUEsZ0JBQ1osV0FBVztBQUFBLGdCQUNYLFdBQVc7QUFBQSxjQUNaO0FBQUEsY0FDRCxrQkFBa0I7QUFBQSxnQkFDaEIsV0FBVztBQUFBLGdCQUNYLFdBQVc7QUFBQSxjQUNaO0FBQUEsY0FDRCxVQUFVO0FBQUEsZ0JBQ1IsV0FBVztBQUFBLGdCQUNYLFdBQVc7QUFBQSxjQUNaO0FBQUEsY0FDRCxVQUFVO0FBQUEsZ0JBQ1IsV0FBVztBQUFBLGdCQUNYLFdBQVc7QUFBQSxjQUNaO0FBQUEsWUFDRjtBQUFBLFVBQ1Q7QUFFTSxjQUFJLE9BQU8sS0FBSyxXQUFXLEVBQUUsV0FBVyxHQUFHO0FBQ3pDLGtCQUFNLElBQUksTUFBTSw2REFBNkQ7QUFBQSxVQUM5RTtBQUFBLFVBYUQsTUFBTSx1QkFBdUIsUUFBUTtBQUFBLFlBQ25DLFlBQVksWUFBWSxRQUFRLFFBQVc7QUFDekMsb0JBQU0sS0FBSztBQUNYLG1CQUFLLGFBQWE7QUFBQSxZQUNuQjtBQUFBLFlBRUQsSUFBSSxLQUFLO0FBQ1Asa0JBQUksQ0FBQyxLQUFLLElBQUksR0FBRyxHQUFHO0FBQ2xCLHFCQUFLLElBQUksS0FBSyxLQUFLLFdBQVcsR0FBRyxDQUFDO0FBQUEsY0FDbkM7QUFFRCxxQkFBTyxNQUFNLElBQUksR0FBRztBQUFBLFlBQ3JCO0FBQUEsVUFFRjtBQVVELGdCQUFNLGFBQWEsV0FBUztBQUMxQixtQkFBTyxTQUFTLE9BQU8sVUFBVSxZQUFZLE9BQU8sTUFBTSxTQUFTO0FBQUEsVUFDM0U7QUFrQ00sZ0JBQU0sZUFBZSxDQUFDLFNBQVMsYUFBYTtBQUMxQyxtQkFBTyxJQUFJLGlCQUFpQjtBQUMxQixrQkFBSSxjQUFjLFFBQVEsV0FBVztBQUNuQyx3QkFBUSxPQUFPLElBQUksTUFBTSxjQUFjLFFBQVEsVUFBVSxPQUFPLENBQUM7QUFBQSxjQUM3RSxXQUFxQixTQUFTLHFCQUFxQixhQUFhLFVBQVUsS0FBSyxTQUFTLHNCQUFzQixPQUFPO0FBQ3pHLHdCQUFRLFFBQVEsYUFBYSxDQUFDLENBQUM7QUFBQSxjQUMzQyxPQUFpQjtBQUNMLHdCQUFRLFFBQVEsWUFBWTtBQUFBLGNBQzdCO0FBQUEsWUFDWDtBQUFBLFVBQ0E7QUFFTSxnQkFBTSxxQkFBcUIsYUFBVyxXQUFXLElBQUksYUFBYTtBQTZCbEUsZ0JBQU0sb0JBQW9CLENBQUMsTUFBTSxhQUFhO0FBQzVDLG1CQUFPLFNBQVMscUJBQXFCLFdBQVcsTUFBTTtBQUNwRCxrQkFBSSxLQUFLLFNBQVMsU0FBUyxTQUFTO0FBQ2xDLHNCQUFNLElBQUksTUFBTSxxQkFBcUIsU0FBUyxPQUFPLElBQUksbUJBQW1CLFNBQVMsT0FBTyxDQUFDLFFBQVEsSUFBSSxXQUFXLEtBQUssTUFBTSxFQUFFO0FBQUEsY0FDbEk7QUFFRCxrQkFBSSxLQUFLLFNBQVMsU0FBUyxTQUFTO0FBQ2xDLHNCQUFNLElBQUksTUFBTSxvQkFBb0IsU0FBUyxPQUFPLElBQUksbUJBQW1CLFNBQVMsT0FBTyxDQUFDLFFBQVEsSUFBSSxXQUFXLEtBQUssTUFBTSxFQUFFO0FBQUEsY0FDakk7QUFFRCxxQkFBTyxJQUFJLFFBQVEsQ0FBQyxTQUFTLFdBQVc7QUFDdEMsb0JBQUksU0FBUyxzQkFBc0I7QUFJakMsc0JBQUk7QUFDRiwyQkFBTyxJQUFJLEVBQUUsR0FBRyxNQUFNLGFBQWE7QUFBQSxzQkFDakM7QUFBQSxzQkFDQTtBQUFBLG9CQUNsQixHQUFtQixRQUFRLENBQUM7QUFBQSxrQkFDYixTQUFRLFNBQVM7QUFDaEIsNEJBQVEsS0FBSyxHQUFHLElBQUksNEdBQWlILE9BQU87QUFDNUksMkJBQU8sSUFBSSxFQUFFLEdBQUcsSUFBSTtBQUdwQiw2QkFBUyx1QkFBdUI7QUFDaEMsNkJBQVMsYUFBYTtBQUN0QjtrQkFDRDtBQUFBLGdCQUNmLFdBQXVCLFNBQVMsWUFBWTtBQUM5Qix5QkFBTyxJQUFJLEVBQUUsR0FBRyxJQUFJO0FBQ3BCO2dCQUNkLE9BQW1CO0FBQ0wseUJBQU8sSUFBSSxFQUFFLEdBQUcsTUFBTSxhQUFhO0FBQUEsb0JBQ2pDO0FBQUEsb0JBQ0E7QUFBQSxrQkFDaEIsR0FBaUIsUUFBUSxDQUFDO0FBQUEsZ0JBQ2I7QUFBQSxjQUNiLENBQVc7QUFBQSxZQUNYO0FBQUEsVUFDQTtBQXNCTSxnQkFBTSxhQUFhLENBQUMsUUFBUSxRQUFRLFlBQVk7QUFDOUMsbUJBQU8sSUFBSSxNQUFNLFFBQVE7QUFBQSxjQUN2QixNQUFNLGNBQWMsU0FBUyxNQUFNO0FBQ2pDLHVCQUFPLFFBQVEsS0FBSyxTQUFTLFFBQVEsR0FBRyxJQUFJO0FBQUEsY0FDN0M7QUFBQSxZQUVYLENBQVM7QUFBQSxVQUNUO0FBRU0sY0FBSSxpQkFBaUIsU0FBUyxLQUFLLEtBQUssT0FBTyxVQUFVLGNBQWM7QUF5QnZFLGdCQUFNLGFBQWEsQ0FBQyxRQUFRLFdBQVcsQ0FBRSxHQUFFLFdBQVcsT0FBTztBQUMzRCxnQkFBSSxRQUFRLHVCQUFPLE9BQU8sSUFBSTtBQUM5QixnQkFBSSxXQUFXO0FBQUEsY0FDYixJQUFJRSxjQUFhLE1BQU07QUFDckIsdUJBQU8sUUFBUSxVQUFVLFFBQVE7QUFBQSxjQUNsQztBQUFBLGNBRUQsSUFBSUEsY0FBYSxNQUFNLFVBQVU7QUFDL0Isb0JBQUksUUFBUSxPQUFPO0FBQ2pCLHlCQUFPLE1BQU0sSUFBSTtBQUFBLGdCQUNsQjtBQUVELG9CQUFJLEVBQUUsUUFBUSxTQUFTO0FBQ3JCLHlCQUFPO0FBQUEsZ0JBQ1I7QUFFRCxvQkFBSSxRQUFRLE9BQU8sSUFBSTtBQUV2QixvQkFBSSxPQUFPLFVBQVUsWUFBWTtBQUcvQixzQkFBSSxPQUFPLFNBQVMsSUFBSSxNQUFNLFlBQVk7QUFFeEMsNEJBQVEsV0FBVyxRQUFRLE9BQU8sSUFBSSxHQUFHLFNBQVMsSUFBSSxDQUFDO0FBQUEsa0JBQ3hELFdBQVUsZUFBZSxVQUFVLElBQUksR0FBRztBQUd6Qyx3QkFBSSxVQUFVLGtCQUFrQixNQUFNLFNBQVMsSUFBSSxDQUFDO0FBQ3BELDRCQUFRLFdBQVcsUUFBUSxPQUFPLElBQUksR0FBRyxPQUFPO0FBQUEsa0JBQ2hFLE9BQXFCO0FBR0wsNEJBQVEsTUFBTSxLQUFLLE1BQU07QUFBQSxrQkFDMUI7QUFBQSxnQkFDRixXQUFVLE9BQU8sVUFBVSxZQUFZLFVBQVUsU0FBUyxlQUFlLFVBQVUsSUFBSSxLQUFLLGVBQWUsVUFBVSxJQUFJLElBQUk7QUFJNUgsMEJBQVEsV0FBVyxPQUFPLFNBQVMsSUFBSSxHQUFHLFNBQVMsSUFBSSxDQUFDO0FBQUEsZ0JBQ3pELFdBQVUsZUFBZSxVQUFVLEdBQUcsR0FBRztBQUV4QywwQkFBUSxXQUFXLE9BQU8sU0FBUyxJQUFJLEdBQUcsU0FBUyxHQUFHLENBQUM7QUFBQSxnQkFDckUsT0FBbUI7QUFHTCx5QkFBTyxlQUFlLE9BQU8sTUFBTTtBQUFBLG9CQUNqQyxjQUFjO0FBQUEsb0JBQ2QsWUFBWTtBQUFBLG9CQUVaLE1BQU07QUFDSiw2QkFBTyxPQUFPLElBQUk7QUFBQSxvQkFDbkI7QUFBQSxvQkFFRCxJQUFJQyxRQUFPO0FBQ1QsNkJBQU8sSUFBSSxJQUFJQTtBQUFBLG9CQUNoQjtBQUFBLGtCQUVqQixDQUFlO0FBQ0QseUJBQU87QUFBQSxnQkFDUjtBQUVELHNCQUFNLElBQUksSUFBSTtBQUNkLHVCQUFPO0FBQUEsY0FDUjtBQUFBLGNBRUQsSUFBSUQsY0FBYSxNQUFNLE9BQU8sVUFBVTtBQUN0QyxvQkFBSSxRQUFRLE9BQU87QUFDakIsd0JBQU0sSUFBSSxJQUFJO0FBQUEsZ0JBQzVCLE9BQW1CO0FBQ0wseUJBQU8sSUFBSSxJQUFJO0FBQUEsZ0JBQ2hCO0FBRUQsdUJBQU87QUFBQSxjQUNSO0FBQUEsY0FFRCxlQUFlQSxjQUFhLE1BQU0sTUFBTTtBQUN0Qyx1QkFBTyxRQUFRLGVBQWUsT0FBTyxNQUFNLElBQUk7QUFBQSxjQUNoRDtBQUFBLGNBRUQsZUFBZUEsY0FBYSxNQUFNO0FBQ2hDLHVCQUFPLFFBQVEsZUFBZSxPQUFPLElBQUk7QUFBQSxjQUMxQztBQUFBLFlBRVg7QUFXUSxnQkFBSSxjQUFjLE9BQU8sT0FBTyxNQUFNO0FBQ3RDLG1CQUFPLElBQUksTUFBTSxhQUFhLFFBQVE7QUFBQSxVQUM5QztBQW1CTSxnQkFBTSxZQUFZLGlCQUFlO0FBQUEsWUFDL0IsWUFBWSxRQUFRLGFBQWEsTUFBTTtBQUNyQyxxQkFBTyxZQUFZLFdBQVcsSUFBSSxRQUFRLEdBQUcsR0FBRyxJQUFJO0FBQUEsWUFDckQ7QUFBQSxZQUVELFlBQVksUUFBUSxVQUFVO0FBQzVCLHFCQUFPLE9BQU8sWUFBWSxXQUFXLElBQUksUUFBUSxDQUFDO0FBQUEsWUFDbkQ7QUFBQSxZQUVELGVBQWUsUUFBUSxVQUFVO0FBQy9CLHFCQUFPLGVBQWUsV0FBVyxJQUFJLFFBQVEsQ0FBQztBQUFBLFlBQy9DO0FBQUEsVUFFVDtBQUVNLGdCQUFNLDRCQUE0QixJQUFJLGVBQWUsY0FBWTtBQUMvRCxnQkFBSSxPQUFPLGFBQWEsWUFBWTtBQUNsQyxxQkFBTztBQUFBLFlBQ1I7QUFXRCxtQkFBTyxTQUFTLGtCQUFrQixLQUFLO0FBQ3JDLG9CQUFNLGFBQWE7QUFBQSxnQkFBVztBQUFBLGdCQUFLLENBQUU7QUFBQSxnQkFFbkM7QUFBQSxrQkFDQSxZQUFZO0FBQUEsb0JBQ1YsU0FBUztBQUFBLG9CQUNULFNBQVM7QUFBQSxrQkFDVjtBQUFBLGdCQUNiO0FBQUEsY0FBVztBQUNELHVCQUFTLFVBQVU7QUFBQSxZQUM3QjtBQUFBLFVBQ0EsQ0FBTztBQUNELGdCQUFNLG9CQUFvQixJQUFJLGVBQWUsY0FBWTtBQUN2RCxnQkFBSSxPQUFPLGFBQWEsWUFBWTtBQUNsQyxxQkFBTztBQUFBLFlBQ1I7QUFvQkQsbUJBQU8sU0FBUyxVQUFVLFNBQVMsUUFBUSxjQUFjO0FBQ3ZELGtCQUFJLHNCQUFzQjtBQUMxQixrQkFBSTtBQUNKLGtCQUFJLHNCQUFzQixJQUFJLFFBQVEsYUFBVztBQUMvQyxzQ0FBc0IsU0FBVSxVQUFVO0FBQ3hDLHdDQUFzQjtBQUN0QiwwQkFBUSxRQUFRO0FBQUEsZ0JBQzlCO0FBQUEsY0FDQSxDQUFXO0FBQ0Qsa0JBQUk7QUFFSixrQkFBSTtBQUNGLHlCQUFTLFNBQVMsU0FBUyxRQUFRLG1CQUFtQjtBQUFBLGNBQ3ZELFNBQVEsS0FBSztBQUNaLHlCQUFTLFFBQVEsT0FBTyxHQUFHO0FBQUEsY0FDNUI7QUFFRCxvQkFBTSxtQkFBbUIsV0FBVyxRQUFRLFdBQVcsTUFBTTtBQUk3RCxrQkFBSSxXQUFXLFFBQVEsQ0FBQyxvQkFBb0IsQ0FBQyxxQkFBcUI7QUFDaEUsdUJBQU87QUFBQSxjQUNSO0FBTUQsb0JBQU0scUJBQXFCLGFBQVc7QUFDcEMsd0JBQVEsS0FBSyxTQUFPO0FBRWxCLCtCQUFhLEdBQUc7QUFBQSxnQkFDakIsR0FBRSxXQUFTO0FBR1Ysc0JBQUlFO0FBRUosc0JBQUksVUFBVSxpQkFBaUIsU0FBUyxPQUFPLE1BQU0sWUFBWSxXQUFXO0FBQzFFLG9CQUFBQSxXQUFVLE1BQU07QUFBQSxrQkFDaEMsT0FBcUI7QUFDTCxvQkFBQUEsV0FBVTtBQUFBLGtCQUNYO0FBRUQsK0JBQWE7QUFBQSxvQkFDWCxtQ0FBbUM7QUFBQSxvQkFDbkMsU0FBQUE7QUFBQSxrQkFDaEIsQ0FBZTtBQUFBLGdCQUNmLENBQWEsRUFBRSxNQUFNLFNBQU87QUFFZCwwQkFBUSxNQUFNLDJDQUEyQyxHQUFHO0FBQUEsZ0JBQzFFLENBQWE7QUFBQSxjQUNiO0FBS1Usa0JBQUksa0JBQWtCO0FBQ3BCLG1DQUFtQixNQUFNO0FBQUEsY0FDckMsT0FBaUI7QUFDTCxtQ0FBbUIsbUJBQW1CO0FBQUEsY0FDdkM7QUFHRCxxQkFBTztBQUFBLFlBQ2pCO0FBQUEsVUFDQSxDQUFPO0FBRUQsZ0JBQU0sNkJBQTZCLENBQUM7QUFBQSxZQUNsQztBQUFBLFlBQ0E7QUFBQSxVQUNELEdBQUUsVUFBVTtBQUNYLGdCQUFJLGNBQWMsUUFBUSxXQUFXO0FBSW5DLGtCQUFJLGNBQWMsUUFBUSxVQUFVLFlBQVksa0RBQWtEO0FBQ2hHO2NBQ1osT0FBaUI7QUFDTCx1QkFBTyxJQUFJLE1BQU0sY0FBYyxRQUFRLFVBQVUsT0FBTyxDQUFDO0FBQUEsY0FDMUQ7QUFBQSxZQUNYLFdBQW1CLFNBQVMsTUFBTSxtQ0FBbUM7QUFHM0QscUJBQU8sSUFBSSxNQUFNLE1BQU0sT0FBTyxDQUFDO0FBQUEsWUFDekMsT0FBZTtBQUNMLHNCQUFRLEtBQUs7QUFBQSxZQUNkO0FBQUEsVUFDVDtBQUVNLGdCQUFNLHFCQUFxQixDQUFDLE1BQU0sVUFBVSxvQkFBb0IsU0FBUztBQUN2RSxnQkFBSSxLQUFLLFNBQVMsU0FBUyxTQUFTO0FBQ2xDLG9CQUFNLElBQUksTUFBTSxxQkFBcUIsU0FBUyxPQUFPLElBQUksbUJBQW1CLFNBQVMsT0FBTyxDQUFDLFFBQVEsSUFBSSxXQUFXLEtBQUssTUFBTSxFQUFFO0FBQUEsWUFDbEk7QUFFRCxnQkFBSSxLQUFLLFNBQVMsU0FBUyxTQUFTO0FBQ2xDLG9CQUFNLElBQUksTUFBTSxvQkFBb0IsU0FBUyxPQUFPLElBQUksbUJBQW1CLFNBQVMsT0FBTyxDQUFDLFFBQVEsSUFBSSxXQUFXLEtBQUssTUFBTSxFQUFFO0FBQUEsWUFDakk7QUFFRCxtQkFBTyxJQUFJLFFBQVEsQ0FBQyxTQUFTLFdBQVc7QUFDdEMsb0JBQU0sWUFBWSwyQkFBMkIsS0FBSyxNQUFNO0FBQUEsZ0JBQ3REO0FBQUEsZ0JBQ0E7QUFBQSxjQUNaLENBQVc7QUFDRCxtQkFBSyxLQUFLLFNBQVM7QUFDbkIsOEJBQWdCLFlBQVksR0FBRyxJQUFJO0FBQUEsWUFDN0MsQ0FBUztBQUFBLFVBQ1Q7QUFFTSxnQkFBTSxpQkFBaUI7QUFBQSxZQUNyQixVQUFVO0FBQUEsY0FDUixTQUFTO0FBQUEsZ0JBQ1AsbUJBQW1CLFVBQVUseUJBQXlCO0FBQUEsY0FDdkQ7QUFBQSxZQUNGO0FBQUEsWUFDRCxTQUFTO0FBQUEsY0FDUCxXQUFXLFVBQVUsaUJBQWlCO0FBQUEsY0FDdEMsbUJBQW1CLFVBQVUsaUJBQWlCO0FBQUEsY0FDOUMsYUFBYSxtQkFBbUIsS0FBSyxNQUFNLGVBQWU7QUFBQSxnQkFDeEQsU0FBUztBQUFBLGdCQUNULFNBQVM7QUFBQSxjQUNyQixDQUFXO0FBQUEsWUFDRjtBQUFBLFlBQ0QsTUFBTTtBQUFBLGNBQ0osYUFBYSxtQkFBbUIsS0FBSyxNQUFNLGVBQWU7QUFBQSxnQkFDeEQsU0FBUztBQUFBLGdCQUNULFNBQVM7QUFBQSxjQUNyQixDQUFXO0FBQUEsWUFDRjtBQUFBLFVBQ1Q7QUFDTSxnQkFBTSxrQkFBa0I7QUFBQSxZQUN0QixPQUFPO0FBQUEsY0FDTCxTQUFTO0FBQUEsY0FDVCxTQUFTO0FBQUEsWUFDVjtBQUFBLFlBQ0QsS0FBSztBQUFBLGNBQ0gsU0FBUztBQUFBLGNBQ1QsU0FBUztBQUFBLFlBQ1Y7QUFBQSxZQUNELEtBQUs7QUFBQSxjQUNILFNBQVM7QUFBQSxjQUNULFNBQVM7QUFBQSxZQUNWO0FBQUEsVUFDVDtBQUNNLHNCQUFZLFVBQVU7QUFBQSxZQUNwQixTQUFTO0FBQUEsY0FDUCxLQUFLO0FBQUEsWUFDTjtBQUFBLFlBQ0QsVUFBVTtBQUFBLGNBQ1IsS0FBSztBQUFBLFlBQ047QUFBQSxZQUNELFVBQVU7QUFBQSxjQUNSLEtBQUs7QUFBQSxZQUNOO0FBQUEsVUFDVDtBQUNNLGlCQUFPLFdBQVcsZUFBZSxnQkFBZ0IsV0FBVztBQUFBLFFBQ2xFO0FBSUksUUFBQUwsUUFBTyxVQUFVLFNBQVMsTUFBTTtBQUFBLE1BQ3BDLE9BQVM7QUFDTCxRQUFBQSxRQUFPLFVBQVUsV0FBVztBQUFBLE1BQzdCO0FBQUEsSUFDSCxDQUFDO0FBQUE7OztBQ2p2Q0QsTUFBSSxVQUFVO0FDRkYsTUFBQSxnQ0FBQU0saUJBQUw7QUFDSEEsaUJBQUEsY0FBZSxJQUFBO0FBQ2ZBLGlCQUFBLGFBQWMsSUFBQTtBQUNkQSxpQkFBQSxjQUFlLElBQUE7QUFDZkEsaUJBQUEsZUFBZ0IsSUFBQTtBQUNoQkEsaUJBQUEsaUJBQWtCLElBQUE7QUFMVkEsV0FBQUE7QUFBQUEsRUFBQSxHQUFBLGVBQUEsQ0FBQSxDQUFBO0FDR1osUUFBQSxhQUFlLG9CQUFvQjtBQUFBLElBQy9CLFNBQVMsQ0FBQyxTQUFTO0FBQUEsSUFDbkIsT0FBTztBQUFBLElBQ1AsT0FBTztBQUNILFVBQUksY0FBa0M7QUFDdEMsVUFBSSxvQkFBb0I7QUFHZixlQUFBLGlCQUFpQixXQUFXLG1CQUFtQjtBQUV4RCxlQUFTLG9CQUFvQixHQUFlOztBQUV4QyxZQUFJLG1CQUFtQjtBQUNDLDhCQUFBO0FBQ3BCO0FBQUEsUUFDSjtBQUdBLFlBQUksZUFBZSxZQUFZLFNBQVMsRUFBRSxNQUFjLEdBQUc7QUFDdkQ7QUFBQSxRQUNKO0FBRUEsY0FBTSxpQkFBZUosTUFBQSxPQUFPLGFBQUEsTUFBUCxnQkFBQUEsSUFBdUIsV0FBVyxXQUFVO0FBRTdELFlBQUEsYUFBYSxTQUFTLEdBQUc7QUFDekIsMEJBQWdCLGNBQWMsRUFBRSxTQUFTLEVBQUUsT0FBTztBQUFBLFFBQ3REO0FBQUEsTUFDSjtBQUVTLGVBQUEsZ0JBQWdCLE1BQWMsR0FBVyxHQUFXO0FBRXpELFlBQUksYUFBYTtBQUNiLHNCQUFZLE9BQU87QUFBQSxRQUN2QjtBQUdjLHNCQUFBLFNBQVMsY0FBYyxLQUFLO0FBQzFDLG9CQUFZLFlBQVk7QUFDeEIsb0JBQVksWUFBWTtBQUFBLHNEQUNrQixJQUFJO0FBQUE7QUFBQTtBQUt2QyxlQUFBLE9BQU8sWUFBWSxPQUFPO0FBQUEsVUFDN0IsVUFBVTtBQUFBLFVBQ1YsTUFBTSxJQUFJO0FBQUEsVUFDVixLQUFNLElBQUksS0FBTTtBQUFBLFVBQ2hCLFlBQVk7QUFBQSxVQUNaLFFBQVE7QUFBQSxVQUNSLGNBQWM7QUFBQSxVQUNkLFNBQVM7QUFBQSxVQUNULFFBQVE7QUFBQSxVQUNSLFlBQVk7QUFBQSxVQUNaLFdBQVc7QUFBQSxVQUNYLFVBQVU7QUFBQSxRQUFBLENBQ2I7QUFHSyxjQUFBLGNBQWMsWUFBWSxjQUFjLGVBQWU7QUFDN0QsWUFBSSxhQUFhO0FBQ04saUJBQUEsT0FBTyxZQUFZLE9BQU87QUFBQSxZQUM3QixjQUFjO0FBQUEsWUFDZCxVQUFVO0FBQUEsWUFDVixPQUFPO0FBQUEsVUFBQSxDQUNWO0FBQUEsUUFDTDtBQUdNLGNBQUEsU0FBUyxZQUFZLGNBQWMsaUJBQWlCO0FBQzFELFlBQUksUUFBUTtBQUNELGlCQUFBLE9BQU8sT0FBTyxPQUFPO0FBQUEsWUFDeEIsT0FBTztBQUFBLFlBQ1AsU0FBUztBQUFBLFlBQ1QsWUFBWTtBQUFBLFlBQ1osT0FBTztBQUFBLFlBQ1AsUUFBUTtBQUFBLFlBQ1IsY0FBYztBQUFBLFlBQ2QsUUFBUTtBQUFBLFlBQ1IsVUFBVTtBQUFBLFlBQ1YsWUFBWTtBQUFBLFVBQUEsQ0FDZjtBQUdNLGlCQUFBLGlCQUFpQixjQUFjLE1BQU07QUFDeEMsbUJBQU8sTUFBTSxhQUFhO0FBQUEsVUFBQSxDQUM3QjtBQUNNLGlCQUFBLGlCQUFpQixjQUFjLE1BQU07QUFDeEMsbUJBQU8sTUFBTSxhQUFhO0FBQUEsVUFBQSxDQUM3QjtBQUFBLFFBQ0w7QUFFUyxpQkFBQSxLQUFLLFlBQVksV0FBVztBQUdyQyxZQUFJLFFBQVE7QUFDRCxpQkFBQSxpQkFBaUIsYUFBYSxTQUFTLEdBQUc7QUFDN0MsY0FBRSxlQUFlO0FBQ2pCLGNBQUUsZ0JBQWdCO0FBQ0UsZ0NBQUE7QUFBQSxVQUFBLENBQ3ZCO0FBRU0saUJBQUEsaUJBQWlCLFNBQVMsU0FBUyxHQUFHO0FBQ3pDLGNBQUUsZUFBZTtBQUNqQixjQUFFLGdCQUFnQjtBQUVsQixvQkFBUSxJQUFJLG9DQUFvQztBQUVoRCxrQkFBTSxVQUFzQjtBQUFBLGNBQ3hCLGFBQWEsWUFBWTtBQUFBLGNBQ3pCLGNBQWM7QUFBQSxZQUFBO0FBR2xCLG9CQUFRLFFBQVEsWUFBWSxPQUFPLEVBQUUsS0FBSyxNQUFNO0FBQzVDLHNCQUFRLElBQUksMkJBQTJCO0FBQUEsWUFBQSxDQUMxQyxFQUFFLE1BQU0sQ0FBQyxVQUFVO0FBQ1Isc0JBQUEsTUFBTSwwQkFBMEIsS0FBSztBQUFBLFlBQUEsQ0FDaEQ7QUFFRCxnQkFBSSxhQUFhO0FBQ2IsMEJBQVksT0FBTztBQUNMLDRCQUFBO0FBQUEsWUFDbEI7QUFBQSxVQUFBLENBQ0g7QUFBQSxRQUNMO0FBQUEsTUFDSjtBQUdTLGVBQUEsaUJBQWlCLGFBQWEsU0FBUyxHQUFHO0FBQy9DLFlBQUksZUFBZSxDQUFDLFlBQVksU0FBUyxFQUFFLE1BQWMsR0FBRztBQUN4RCxjQUFJLGFBQWE7QUFDYix3QkFBWSxPQUFPO0FBQ0wsMEJBQUE7QUFBQSxVQUNsQjtBQUFBLFFBQ0o7QUFBQSxNQUFBLENBQ0g7QUFBQSxJQUNMO0FBQUEsRUFDSixDQUFDOztBQ3ZJRCxXQUFTSyxRQUFNLFdBQVcsTUFBTTtBQUc5QixRQUFJLE9BQU8sS0FBSyxDQUFDLE1BQU0sVUFBVTtBQUN6QixZQUFBLFVBQVUsS0FBSztBQUNyQixhQUFPLFNBQVMsT0FBTyxJQUFJLEdBQUcsSUFBSTtBQUFBLElBQUEsT0FDN0I7QUFDRSxhQUFBLFNBQVMsR0FBRyxJQUFJO0FBQUEsSUFDekI7QUFBQSxFQUNGO0FBQ0EsTUFBSUMsV0FBUztBQUFBLElBQ1gsT0FBTyxJQUFJLFNBQVNELFFBQU0sUUFBUSxPQUFPLEdBQUcsSUFBSTtBQUFBLElBQ2hELEtBQUssSUFBSSxTQUFTQSxRQUFNLFFBQVEsS0FBSyxHQUFHLElBQUk7QUFBQSxJQUM1QyxNQUFNLElBQUksU0FBU0EsUUFBTSxRQUFRLE1BQU0sR0FBRyxJQUFJO0FBQUEsSUFDOUMsT0FBTyxJQUFJLFNBQVNBLFFBQU0sUUFBUSxPQUFPLEdBQUcsSUFBSTtBQUFBLEVBQ2xEO0FBR0EsTUFBSSwwQkFBeUIsbUJBQXNDLE1BQU07QUFBQSxJQUN2RSxZQUFZLFFBQVEsUUFBUTtBQUNwQixZQUFBLEdBQXdCLFlBQVksQ0FBQSxDQUFFO0FBQzVDLFdBQUssU0FBUztBQUNkLFdBQUssU0FBUztBQUFBLElBQ2hCO0FBQUEsRUFFRixHQURFLGNBTjJCLElBTXBCLGNBQWEsbUJBQW1CLG9CQUFvQixJQU5oQztBQVE3QixXQUFTLG1CQUFtQixXQUFXO0FBQ3JDLFVBQU0saUJBQWlCLE9BQU8sbUNBQW9CLGNBQWMsVUFBVTtBQUMxRSxXQUFPLEdBQUcsUUFBUSxRQUFRLEVBQUUsSUFBSSxjQUFjLElBQUksU0FBUztBQUFBLEVBQzdEO0FBR0EsV0FBUyxzQkFBc0IsS0FBSztBQUM5QixRQUFBO0FBQ0EsUUFBQTtBQUNHLFdBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLE1BS0wsTUFBTTtBQUNKLFlBQUksWUFBWTtBQUNkO0FBQ08saUJBQUEsSUFBSSxJQUFJLFNBQVMsSUFBSTtBQUNuQixtQkFBQSxJQUFJLFlBQVksTUFBTTtBQUMvQixjQUFJLFNBQVMsSUFBSSxJQUFJLFNBQVMsSUFBSTtBQUM5QixjQUFBLE9BQU8sU0FBUyxPQUFPLE1BQU07QUFDL0IsbUJBQU8sY0FBYyxJQUFJLHVCQUF1QixRQUFRLE1BQU0sQ0FBQztBQUN0RCxxQkFBQTtBQUFBLFVBQ1g7QUFBQSxXQUNDLEdBQUc7QUFBQSxNQUNSO0FBQUEsSUFBQTtBQUFBLEVBRUo7QUFHQSxNQUFJLHdCQUF1QixXQUE0QjtBQUFBLElBQ3JELFlBQVksbUJBQW1CLFNBQVM7QUFzSnhDO0FBU0E7QUFuSkEsc0NBQWMsT0FBTyxTQUFTLE9BQU87QUFDckM7QUFDQSwyQ0FBbUIsc0JBQXNCLElBQUk7QUFiM0MsV0FBSyxvQkFBb0I7QUFDekIsV0FBSyxVQUFVO0FBQ1YseUJBQUEsa0JBQW1CLElBQUk7QUFDNUIsVUFBSSxtQkFBSyxjQUFhO0FBQ3BCLDhCQUFLLG9DQUFMO0FBQUEsTUFDRjtBQUNBLFdBQUssV0FBVyxNQUFNO0FBQ3BCLDhCQUFLLGtEQUFMO0FBQUEsTUFBNEIsQ0FDN0I7QUFBQSxJQUNIO0FBQUEsSUFLQSxJQUFJLFNBQVM7QUFDWCxhQUFPLG1CQUFLLGtCQUFpQjtBQUFBLElBQy9CO0FBQUEsSUFDQSxNQUFNLFFBQVE7QUFDTCxhQUFBLG1CQUFLLGtCQUFpQixNQUFNLE1BQU07QUFBQSxJQUMzQztBQUFBLElBQ0EsSUFBSSxZQUFZO0FBQ1YsVUFBQSxRQUFRLFFBQVEsTUFBTSxNQUFNO0FBQzlCLGFBQUssa0JBQWtCO0FBQUEsTUFDekI7QUFDQSxhQUFPLEtBQUssT0FBTztBQUFBLElBQ3JCO0FBQUEsSUFDQSxJQUFJLFVBQVU7QUFDWixhQUFPLENBQUMsS0FBSztBQUFBLElBQ2Y7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLElBY0EsY0FBYyxJQUFJO0FBQ1gsV0FBQSxPQUFPLGlCQUFpQixTQUFTLEVBQUU7QUFDeEMsYUFBTyxNQUFNLEtBQUssT0FBTyxvQkFBb0IsU0FBUyxFQUFFO0FBQUEsSUFDMUQ7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsSUFZQSxRQUFRO0FBQ0MsYUFBQSxJQUFJLFFBQVEsTUFBTTtBQUFBLE1BQUEsQ0FDeEI7QUFBQSxJQUNIO0FBQUE7QUFBQTtBQUFBO0FBQUEsSUFJQSxZQUFZLFNBQVMsU0FBUztBQUN0QixZQUFBLEtBQUssWUFBWSxNQUFNO0FBQzNCLFlBQUksS0FBSztBQUNDO1NBQ1QsT0FBTztBQUNWLFdBQUssY0FBYyxNQUFNLGNBQWMsRUFBRSxDQUFDO0FBQ25DLGFBQUE7QUFBQSxJQUNUO0FBQUE7QUFBQTtBQUFBO0FBQUEsSUFJQSxXQUFXLFNBQVMsU0FBUztBQUNyQixZQUFBLEtBQUssV0FBVyxNQUFNO0FBQzFCLFlBQUksS0FBSztBQUNDO1NBQ1QsT0FBTztBQUNWLFdBQUssY0FBYyxNQUFNLGFBQWEsRUFBRSxDQUFDO0FBQ2xDLGFBQUE7QUFBQSxJQUNUO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxJQUtBLHNCQUFzQixVQUFVO0FBQ3hCLFlBQUEsS0FBSyxzQkFBc0IsSUFBSSxTQUFTO0FBQzVDLFlBQUksS0FBSztBQUNQLG1CQUFTLEdBQUcsSUFBSTtBQUFBLE1BQUEsQ0FDbkI7QUFDRCxXQUFLLGNBQWMsTUFBTSxxQkFBcUIsRUFBRSxDQUFDO0FBQzFDLGFBQUE7QUFBQSxJQUNUO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxJQUtBLG9CQUFvQixVQUFVLFNBQVM7QUFDL0IsWUFBQSxLQUFLLG9CQUFvQixJQUFJLFNBQVM7QUFDdEMsWUFBQSxDQUFDLEtBQUssT0FBTztBQUNmLG1CQUFTLEdBQUcsSUFBSTtBQUFBLFNBQ2pCLE9BQU87QUFDVixXQUFLLGNBQWMsTUFBTSxtQkFBbUIsRUFBRSxDQUFDO0FBQ3hDLGFBQUE7QUFBQSxJQUNUO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLElBa0JBLGlCQUFpQixRQUFRLE1BQU0sU0FBUyxTQUFTOztBQUMvQyxVQUFJLFNBQVMsc0JBQXNCO0FBQ2pDLFlBQUksS0FBSztBQUNQLDZCQUFLLGtCQUFpQjtNQUMxQjtBQUNPLE9BQUFMLE1BQUEsT0FBQSxxQkFBQSxnQkFBQUEsSUFBQTtBQUFBO0FBQUEsUUFDTCxLQUFLLFdBQVcsTUFBTSxJQUFJLG1CQUFtQixJQUFJLElBQUk7QUFBQTtBQUFBLFFBRXJEO0FBQUEsUUFDQTtBQUFBLFVBQ0UsR0FBRztBQUFBLFVBQ0gsUUFBUSxLQUFLO0FBQUEsUUFDZjtBQUFBO0FBQUEsSUFFSjtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsSUFLQSxvQkFBb0I7QUFDbEIsV0FBSyxNQUFNLG9DQUFvQztBQUN4Q00sZUFBQTtBQUFBLFFBQ0wsbUJBQW1CLEtBQUssaUJBQWlCO0FBQUEsTUFBQTtBQUFBLElBRTdDO0FBQUEsRUFtQkYsR0E1SkUsNkJBQ0Esa0NBQ0Esa0NBd0lBLHFEQUFrQixXQUFBO0FBQ1QsV0FBQTtBQUFBLE1BQ0w7QUFBQSxRQUNFLE9BQU8sR0FBc0I7QUFBQSxRQUM3QixtQkFBbUIsS0FBSztBQUFBLE1BQzFCO0FBQUEsTUFDQTtBQUFBLElBQUE7QUFBQSxFQUVKLEdBQ0EsbUVBQXlCLFdBQUE7QUFDakIsVUFBQSxLQUFLLENBQUMsVUFBVTs7QUFDaEIsWUFBQU4sTUFBQSxNQUFNLFNBQU4sZ0JBQUFBLElBQVksVUFBUyxHQUFzQixpQ0FBK0JELE1BQUEsTUFBTSxTQUFOLGdCQUFBQSxJQUFZLHVCQUFzQixLQUFLLG1CQUFtQjtBQUN0SSxhQUFLLGtCQUFrQjtBQUFBLE1BQ3pCO0FBQUEsSUFBQTtBQUVGLHFCQUFpQixXQUFXLEVBQUU7QUFDOUIsU0FBSyxjQUFjLE1BQU0sb0JBQW9CLFdBQVcsRUFBRSxDQUFDO0FBQUEsRUFDN0QsR0E1SkEsY0FaeUIsSUFZbEIsK0JBQThCLCtCQVpaOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OyIsInhfZ29vZ2xlX2lnbm9yZUxpc3QiOlswLDEsMiw1XX0=
