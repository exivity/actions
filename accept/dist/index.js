var __create = Object.create;
var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
var __markAsModule = (target) => __defProp(target, "__esModule", { value: true });
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[Object.keys(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __reExport = (target, module2, desc) => {
  if (module2 && typeof module2 === "object" || typeof module2 === "function") {
    for (let key of __getOwnPropNames(module2))
      if (!__hasOwnProp.call(target, key) && key !== "default")
        __defProp(target, key, { get: () => module2[key], enumerable: !(desc = __getOwnPropDesc(module2, key)) || desc.enumerable });
  }
  return target;
};
var __toModule = (module2) => {
  return __reExport(__markAsModule(__defProp(module2 != null ? __create(__getProtoOf(module2)) : {}, "default", module2 && module2.__esModule && "default" in module2 ? { get: () => module2.default, enumerable: true } : { value: module2, enumerable: true })), module2);
};

// node_modules/@actions/core/lib/utils.js
var require_utils = __commonJS({
  "node_modules/@actions/core/lib/utils.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.toCommandProperties = exports2.toCommandValue = void 0;
    function toCommandValue(input) {
      if (input === null || input === void 0) {
        return "";
      } else if (typeof input === "string" || input instanceof String) {
        return input;
      }
      return JSON.stringify(input);
    }
    exports2.toCommandValue = toCommandValue;
    function toCommandProperties(annotationProperties) {
      if (!Object.keys(annotationProperties).length) {
        return {};
      }
      return {
        title: annotationProperties.title,
        line: annotationProperties.startLine,
        endLine: annotationProperties.endLine,
        col: annotationProperties.startColumn,
        endColumn: annotationProperties.endColumn
      };
    }
    exports2.toCommandProperties = toCommandProperties;
  }
});

// node_modules/@actions/core/lib/command.js
var require_command = __commonJS({
  "node_modules/@actions/core/lib/command.js"(exports2) {
    "use strict";
    var __createBinding = exports2 && exports2.__createBinding || (Object.create ? function(o, m, k, k2) {
      if (k2 === void 0)
        k2 = k;
      Object.defineProperty(o, k2, { enumerable: true, get: function() {
        return m[k];
      } });
    } : function(o, m, k, k2) {
      if (k2 === void 0)
        k2 = k;
      o[k2] = m[k];
    });
    var __setModuleDefault = exports2 && exports2.__setModuleDefault || (Object.create ? function(o, v) {
      Object.defineProperty(o, "default", { enumerable: true, value: v });
    } : function(o, v) {
      o["default"] = v;
    });
    var __importStar = exports2 && exports2.__importStar || function(mod) {
      if (mod && mod.__esModule)
        return mod;
      var result = {};
      if (mod != null) {
        for (var k in mod)
          if (k !== "default" && Object.hasOwnProperty.call(mod, k))
            __createBinding(result, mod, k);
      }
      __setModuleDefault(result, mod);
      return result;
    };
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.issue = exports2.issueCommand = void 0;
    var os2 = __importStar(require("os"));
    var utils_1 = require_utils();
    function issueCommand2(command, properties, message) {
      const cmd = new Command(command, properties, message);
      process.stdout.write(cmd.toString() + os2.EOL);
    }
    exports2.issueCommand = issueCommand2;
    function issue(name, message = "") {
      issueCommand2(name, {}, message);
    }
    exports2.issue = issue;
    var CMD_STRING = "::";
    var Command = class {
      constructor(command, properties, message) {
        if (!command) {
          command = "missing.command";
        }
        this.command = command;
        this.properties = properties;
        this.message = message;
      }
      toString() {
        let cmdStr = CMD_STRING + this.command;
        if (this.properties && Object.keys(this.properties).length > 0) {
          cmdStr += " ";
          let first = true;
          for (const key in this.properties) {
            if (this.properties.hasOwnProperty(key)) {
              const val = this.properties[key];
              if (val) {
                if (first) {
                  first = false;
                } else {
                  cmdStr += ",";
                }
                cmdStr += `${key}=${escapeProperty(val)}`;
              }
            }
          }
        }
        cmdStr += `${CMD_STRING}${escapeData(this.message)}`;
        return cmdStr;
      }
    };
    function escapeData(s) {
      return utils_1.toCommandValue(s).replace(/%/g, "%25").replace(/\r/g, "%0D").replace(/\n/g, "%0A");
    }
    function escapeProperty(s) {
      return utils_1.toCommandValue(s).replace(/%/g, "%25").replace(/\r/g, "%0D").replace(/\n/g, "%0A").replace(/:/g, "%3A").replace(/,/g, "%2C");
    }
  }
});

// node_modules/@actions/core/lib/file-command.js
var require_file_command = __commonJS({
  "node_modules/@actions/core/lib/file-command.js"(exports2) {
    "use strict";
    var __createBinding = exports2 && exports2.__createBinding || (Object.create ? function(o, m, k, k2) {
      if (k2 === void 0)
        k2 = k;
      Object.defineProperty(o, k2, { enumerable: true, get: function() {
        return m[k];
      } });
    } : function(o, m, k, k2) {
      if (k2 === void 0)
        k2 = k;
      o[k2] = m[k];
    });
    var __setModuleDefault = exports2 && exports2.__setModuleDefault || (Object.create ? function(o, v) {
      Object.defineProperty(o, "default", { enumerable: true, value: v });
    } : function(o, v) {
      o["default"] = v;
    });
    var __importStar = exports2 && exports2.__importStar || function(mod) {
      if (mod && mod.__esModule)
        return mod;
      var result = {};
      if (mod != null) {
        for (var k in mod)
          if (k !== "default" && Object.hasOwnProperty.call(mod, k))
            __createBinding(result, mod, k);
      }
      __setModuleDefault(result, mod);
      return result;
    };
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.issueCommand = void 0;
    var fs6 = __importStar(require("fs"));
    var os2 = __importStar(require("os"));
    var utils_1 = require_utils();
    function issueCommand2(command, message) {
      const filePath = process.env[`GITHUB_${command}`];
      if (!filePath) {
        throw new Error(`Unable to find environment variable for file command ${command}`);
      }
      if (!fs6.existsSync(filePath)) {
        throw new Error(`Missing file at path: ${filePath}`);
      }
      fs6.appendFileSync(filePath, `${utils_1.toCommandValue(message)}${os2.EOL}`, {
        encoding: "utf8"
      });
    }
    exports2.issueCommand = issueCommand2;
  }
});

// node_modules/@actions/core/lib/core.js
var require_core = __commonJS({
  "node_modules/@actions/core/lib/core.js"(exports2) {
    "use strict";
    var __createBinding = exports2 && exports2.__createBinding || (Object.create ? function(o, m, k, k2) {
      if (k2 === void 0)
        k2 = k;
      Object.defineProperty(o, k2, { enumerable: true, get: function() {
        return m[k];
      } });
    } : function(o, m, k, k2) {
      if (k2 === void 0)
        k2 = k;
      o[k2] = m[k];
    });
    var __setModuleDefault = exports2 && exports2.__setModuleDefault || (Object.create ? function(o, v) {
      Object.defineProperty(o, "default", { enumerable: true, value: v });
    } : function(o, v) {
      o["default"] = v;
    });
    var __importStar = exports2 && exports2.__importStar || function(mod) {
      if (mod && mod.__esModule)
        return mod;
      var result = {};
      if (mod != null) {
        for (var k in mod)
          if (k !== "default" && Object.hasOwnProperty.call(mod, k))
            __createBinding(result, mod, k);
      }
      __setModuleDefault(result, mod);
      return result;
    };
    var __awaiter = exports2 && exports2.__awaiter || function(thisArg, _arguments, P, generator) {
      function adopt(value) {
        return value instanceof P ? value : new P(function(resolve2) {
          resolve2(value);
        });
      }
      return new (P || (P = Promise))(function(resolve2, reject) {
        function fulfilled(value) {
          try {
            step(generator.next(value));
          } catch (e) {
            reject(e);
          }
        }
        function rejected(value) {
          try {
            step(generator["throw"](value));
          } catch (e) {
            reject(e);
          }
        }
        function step(result) {
          result.done ? resolve2(result.value) : adopt(result.value).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
      });
    };
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.getState = exports2.saveState = exports2.group = exports2.endGroup = exports2.startGroup = exports2.info = exports2.notice = exports2.warning = exports2.error = exports2.debug = exports2.isDebug = exports2.setFailed = exports2.setCommandEcho = exports2.setOutput = exports2.getBooleanInput = exports2.getMultilineInput = exports2.getInput = exports2.addPath = exports2.setSecret = exports2.exportVariable = exports2.ExitCode = void 0;
    var command_1 = require_command();
    var file_command_1 = require_file_command();
    var utils_1 = require_utils();
    var os2 = __importStar(require("os"));
    var path7 = __importStar(require("path"));
    var ExitCode;
    (function(ExitCode2) {
      ExitCode2[ExitCode2["Success"] = 0] = "Success";
      ExitCode2[ExitCode2["Failure"] = 1] = "Failure";
    })(ExitCode = exports2.ExitCode || (exports2.ExitCode = {}));
    function exportVariable(name, val) {
      const convertedVal = utils_1.toCommandValue(val);
      process.env[name] = convertedVal;
      const filePath = process.env["GITHUB_ENV"] || "";
      if (filePath) {
        const delimiter = "_GitHubActionsFileCommandDelimeter_";
        const commandValue = `${name}<<${delimiter}${os2.EOL}${convertedVal}${os2.EOL}${delimiter}`;
        file_command_1.issueCommand("ENV", commandValue);
      } else {
        command_1.issueCommand("set-env", { name }, convertedVal);
      }
    }
    exports2.exportVariable = exportVariable;
    function setSecret2(secret) {
      command_1.issueCommand("add-mask", {}, secret);
    }
    exports2.setSecret = setSecret2;
    function addPath(inputPath) {
      const filePath = process.env["GITHUB_PATH"] || "";
      if (filePath) {
        file_command_1.issueCommand("PATH", inputPath);
      } else {
        command_1.issueCommand("add-path", {}, inputPath);
      }
      process.env["PATH"] = `${inputPath}${path7.delimiter}${process.env["PATH"]}`;
    }
    exports2.addPath = addPath;
    function getInput5(name, options) {
      const val = process.env[`INPUT_${name.replace(/ /g, "_").toUpperCase()}`] || "";
      if (options && options.required && !val) {
        throw new Error(`Input required and not supplied: ${name}`);
      }
      if (options && options.trimWhitespace === false) {
        return val;
      }
      return val.trim();
    }
    exports2.getInput = getInput5;
    function getMultilineInput(name, options) {
      const inputs = getInput5(name, options).split("\n").filter((x) => x !== "");
      return inputs;
    }
    exports2.getMultilineInput = getMultilineInput;
    function getBooleanInput2(name, options) {
      const trueValue = ["true", "True", "TRUE"];
      const falseValue = ["false", "False", "FALSE"];
      const val = getInput5(name, options);
      if (trueValue.includes(val))
        return true;
      if (falseValue.includes(val))
        return false;
      throw new TypeError(`Input does not meet YAML 1.2 "Core Schema" specification: ${name}
Support boolean input list: \`true | True | TRUE | false | False | FALSE\``);
    }
    exports2.getBooleanInput = getBooleanInput2;
    function setOutput(name, value) {
      process.stdout.write(os2.EOL);
      command_1.issueCommand("set-output", { name }, value);
    }
    exports2.setOutput = setOutput;
    function setCommandEcho(enabled) {
      command_1.issue("echo", enabled ? "on" : "off");
    }
    exports2.setCommandEcho = setCommandEcho;
    function setFailed2(message) {
      process.exitCode = ExitCode.Failure;
      error(message);
    }
    exports2.setFailed = setFailed2;
    function isDebug() {
      return process.env["RUNNER_DEBUG"] === "1";
    }
    exports2.isDebug = isDebug;
    function debug6(message) {
      command_1.issueCommand("debug", {}, message);
    }
    exports2.debug = debug6;
    function error(message, properties = {}) {
      command_1.issueCommand("error", utils_1.toCommandProperties(properties), message instanceof Error ? message.toString() : message);
    }
    exports2.error = error;
    function warning6(message, properties = {}) {
      command_1.issueCommand("warning", utils_1.toCommandProperties(properties), message instanceof Error ? message.toString() : message);
    }
    exports2.warning = warning6;
    function notice(message, properties = {}) {
      command_1.issueCommand("notice", utils_1.toCommandProperties(properties), message instanceof Error ? message.toString() : message);
    }
    exports2.notice = notice;
    function info10(message) {
      process.stdout.write(message + os2.EOL);
    }
    exports2.info = info10;
    function startGroup4(name) {
      command_1.issue("group", name);
    }
    exports2.startGroup = startGroup4;
    function endGroup4() {
      command_1.issue("endgroup");
    }
    exports2.endGroup = endGroup4;
    function group(name, fn) {
      return __awaiter(this, void 0, void 0, function* () {
        startGroup4(name);
        let result;
        try {
          result = yield fn();
        } finally {
          endGroup4();
        }
        return result;
      });
    }
    exports2.group = group;
    function saveState(name, value) {
      command_1.issueCommand("save-state", { name }, value);
    }
    exports2.saveState = saveState;
    function getState(name) {
      return process.env[`STATE_${name}`] || "";
    }
    exports2.getState = getState;
  }
});

// node_modules/@actions/github/lib/context.js
var require_context = __commonJS({
  "node_modules/@actions/github/lib/context.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.Context = void 0;
    var fs_1 = require("fs");
    var os_1 = require("os");
    var Context = class {
      constructor() {
        var _a, _b, _c;
        this.payload = {};
        if (process.env.GITHUB_EVENT_PATH) {
          if (fs_1.existsSync(process.env.GITHUB_EVENT_PATH)) {
            this.payload = JSON.parse(fs_1.readFileSync(process.env.GITHUB_EVENT_PATH, { encoding: "utf8" }));
          } else {
            const path7 = process.env.GITHUB_EVENT_PATH;
            process.stdout.write(`GITHUB_EVENT_PATH ${path7} does not exist${os_1.EOL}`);
          }
        }
        this.eventName = process.env.GITHUB_EVENT_NAME;
        this.sha = process.env.GITHUB_SHA;
        this.ref = process.env.GITHUB_REF;
        this.workflow = process.env.GITHUB_WORKFLOW;
        this.action = process.env.GITHUB_ACTION;
        this.actor = process.env.GITHUB_ACTOR;
        this.job = process.env.GITHUB_JOB;
        this.runNumber = parseInt(process.env.GITHUB_RUN_NUMBER, 10);
        this.runId = parseInt(process.env.GITHUB_RUN_ID, 10);
        this.apiUrl = (_a = process.env.GITHUB_API_URL) !== null && _a !== void 0 ? _a : `https://api.github.com`;
        this.serverUrl = (_b = process.env.GITHUB_SERVER_URL) !== null && _b !== void 0 ? _b : `https://github.com`;
        this.graphqlUrl = (_c = process.env.GITHUB_GRAPHQL_URL) !== null && _c !== void 0 ? _c : `https://api.github.com/graphql`;
      }
      get issue() {
        const payload = this.payload;
        return Object.assign(Object.assign({}, this.repo), { number: (payload.issue || payload.pull_request || payload).number });
      }
      get repo() {
        if (process.env.GITHUB_REPOSITORY) {
          const [owner, repo] = process.env.GITHUB_REPOSITORY.split("/");
          return { owner, repo };
        }
        if (this.payload.repository) {
          return {
            owner: this.payload.repository.owner.login,
            repo: this.payload.repository.name
          };
        }
        throw new Error("context.repo requires a GITHUB_REPOSITORY environment variable like 'owner/repo'");
      }
    };
    exports2.Context = Context;
  }
});

// node_modules/@actions/http-client/proxy.js
var require_proxy = __commonJS({
  "node_modules/@actions/http-client/proxy.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    function getProxyUrl(reqUrl) {
      let usingSsl = reqUrl.protocol === "https:";
      let proxyUrl;
      if (checkBypass(reqUrl)) {
        return proxyUrl;
      }
      let proxyVar;
      if (usingSsl) {
        proxyVar = process.env["https_proxy"] || process.env["HTTPS_PROXY"];
      } else {
        proxyVar = process.env["http_proxy"] || process.env["HTTP_PROXY"];
      }
      if (proxyVar) {
        proxyUrl = new URL(proxyVar);
      }
      return proxyUrl;
    }
    exports2.getProxyUrl = getProxyUrl;
    function checkBypass(reqUrl) {
      if (!reqUrl.hostname) {
        return false;
      }
      let noProxy = process.env["no_proxy"] || process.env["NO_PROXY"] || "";
      if (!noProxy) {
        return false;
      }
      let reqPort;
      if (reqUrl.port) {
        reqPort = Number(reqUrl.port);
      } else if (reqUrl.protocol === "http:") {
        reqPort = 80;
      } else if (reqUrl.protocol === "https:") {
        reqPort = 443;
      }
      let upperReqHosts = [reqUrl.hostname.toUpperCase()];
      if (typeof reqPort === "number") {
        upperReqHosts.push(`${upperReqHosts[0]}:${reqPort}`);
      }
      for (let upperNoProxyItem of noProxy.split(",").map((x) => x.trim().toUpperCase()).filter((x) => x)) {
        if (upperReqHosts.some((x) => x === upperNoProxyItem)) {
          return true;
        }
      }
      return false;
    }
    exports2.checkBypass = checkBypass;
  }
});

// node_modules/tunnel/lib/tunnel.js
var require_tunnel = __commonJS({
  "node_modules/tunnel/lib/tunnel.js"(exports2) {
    "use strict";
    var net = require("net");
    var tls = require("tls");
    var http = require("http");
    var https = require("https");
    var events = require("events");
    var assert5 = require("assert");
    var util = require("util");
    exports2.httpOverHttp = httpOverHttp;
    exports2.httpsOverHttp = httpsOverHttp;
    exports2.httpOverHttps = httpOverHttps;
    exports2.httpsOverHttps = httpsOverHttps;
    function httpOverHttp(options) {
      var agent = new TunnelingAgent(options);
      agent.request = http.request;
      return agent;
    }
    function httpsOverHttp(options) {
      var agent = new TunnelingAgent(options);
      agent.request = http.request;
      agent.createSocket = createSecureSocket;
      agent.defaultPort = 443;
      return agent;
    }
    function httpOverHttps(options) {
      var agent = new TunnelingAgent(options);
      agent.request = https.request;
      return agent;
    }
    function httpsOverHttps(options) {
      var agent = new TunnelingAgent(options);
      agent.request = https.request;
      agent.createSocket = createSecureSocket;
      agent.defaultPort = 443;
      return agent;
    }
    function TunnelingAgent(options) {
      var self2 = this;
      self2.options = options || {};
      self2.proxyOptions = self2.options.proxy || {};
      self2.maxSockets = self2.options.maxSockets || http.Agent.defaultMaxSockets;
      self2.requests = [];
      self2.sockets = [];
      self2.on("free", function onFree(socket, host, port, localAddress) {
        var options2 = toOptions(host, port, localAddress);
        for (var i = 0, len = self2.requests.length; i < len; ++i) {
          var pending = self2.requests[i];
          if (pending.host === options2.host && pending.port === options2.port) {
            self2.requests.splice(i, 1);
            pending.request.onSocket(socket);
            return;
          }
        }
        socket.destroy();
        self2.removeSocket(socket);
      });
    }
    util.inherits(TunnelingAgent, events.EventEmitter);
    TunnelingAgent.prototype.addRequest = function addRequest(req, host, port, localAddress) {
      var self2 = this;
      var options = mergeOptions({ request: req }, self2.options, toOptions(host, port, localAddress));
      if (self2.sockets.length >= this.maxSockets) {
        self2.requests.push(options);
        return;
      }
      self2.createSocket(options, function(socket) {
        socket.on("free", onFree);
        socket.on("close", onCloseOrRemove);
        socket.on("agentRemove", onCloseOrRemove);
        req.onSocket(socket);
        function onFree() {
          self2.emit("free", socket, options);
        }
        function onCloseOrRemove(err) {
          self2.removeSocket(socket);
          socket.removeListener("free", onFree);
          socket.removeListener("close", onCloseOrRemove);
          socket.removeListener("agentRemove", onCloseOrRemove);
        }
      });
    };
    TunnelingAgent.prototype.createSocket = function createSocket(options, cb) {
      var self2 = this;
      var placeholder = {};
      self2.sockets.push(placeholder);
      var connectOptions = mergeOptions({}, self2.proxyOptions, {
        method: "CONNECT",
        path: options.host + ":" + options.port,
        agent: false,
        headers: {
          host: options.host + ":" + options.port
        }
      });
      if (options.localAddress) {
        connectOptions.localAddress = options.localAddress;
      }
      if (connectOptions.proxyAuth) {
        connectOptions.headers = connectOptions.headers || {};
        connectOptions.headers["Proxy-Authorization"] = "Basic " + new Buffer(connectOptions.proxyAuth).toString("base64");
      }
      debug6("making CONNECT request");
      var connectReq = self2.request(connectOptions);
      connectReq.useChunkedEncodingByDefault = false;
      connectReq.once("response", onResponse);
      connectReq.once("upgrade", onUpgrade);
      connectReq.once("connect", onConnect);
      connectReq.once("error", onError);
      connectReq.end();
      function onResponse(res) {
        res.upgrade = true;
      }
      function onUpgrade(res, socket, head) {
        process.nextTick(function() {
          onConnect(res, socket, head);
        });
      }
      function onConnect(res, socket, head) {
        connectReq.removeAllListeners();
        socket.removeAllListeners();
        if (res.statusCode !== 200) {
          debug6("tunneling socket could not be established, statusCode=%d", res.statusCode);
          socket.destroy();
          var error = new Error("tunneling socket could not be established, statusCode=" + res.statusCode);
          error.code = "ECONNRESET";
          options.request.emit("error", error);
          self2.removeSocket(placeholder);
          return;
        }
        if (head.length > 0) {
          debug6("got illegal response body from proxy");
          socket.destroy();
          var error = new Error("got illegal response body from proxy");
          error.code = "ECONNRESET";
          options.request.emit("error", error);
          self2.removeSocket(placeholder);
          return;
        }
        debug6("tunneling connection has established");
        self2.sockets[self2.sockets.indexOf(placeholder)] = socket;
        return cb(socket);
      }
      function onError(cause) {
        connectReq.removeAllListeners();
        debug6("tunneling socket could not be established, cause=%s\n", cause.message, cause.stack);
        var error = new Error("tunneling socket could not be established, cause=" + cause.message);
        error.code = "ECONNRESET";
        options.request.emit("error", error);
        self2.removeSocket(placeholder);
      }
    };
    TunnelingAgent.prototype.removeSocket = function removeSocket(socket) {
      var pos = this.sockets.indexOf(socket);
      if (pos === -1) {
        return;
      }
      this.sockets.splice(pos, 1);
      var pending = this.requests.shift();
      if (pending) {
        this.createSocket(pending, function(socket2) {
          pending.request.onSocket(socket2);
        });
      }
    };
    function createSecureSocket(options, cb) {
      var self2 = this;
      TunnelingAgent.prototype.createSocket.call(self2, options, function(socket) {
        var hostHeader = options.request.getHeader("host");
        var tlsOptions = mergeOptions({}, self2.options, {
          socket,
          servername: hostHeader ? hostHeader.replace(/:.*$/, "") : options.host
        });
        var secureSocket = tls.connect(0, tlsOptions);
        self2.sockets[self2.sockets.indexOf(socket)] = secureSocket;
        cb(secureSocket);
      });
    }
    function toOptions(host, port, localAddress) {
      if (typeof host === "string") {
        return {
          host,
          port,
          localAddress
        };
      }
      return host;
    }
    function mergeOptions(target) {
      for (var i = 1, len = arguments.length; i < len; ++i) {
        var overrides = arguments[i];
        if (typeof overrides === "object") {
          var keys = Object.keys(overrides);
          for (var j = 0, keyLen = keys.length; j < keyLen; ++j) {
            var k = keys[j];
            if (overrides[k] !== void 0) {
              target[k] = overrides[k];
            }
          }
        }
      }
      return target;
    }
    var debug6;
    if (process.env.NODE_DEBUG && /\btunnel\b/.test(process.env.NODE_DEBUG)) {
      debug6 = function() {
        var args = Array.prototype.slice.call(arguments);
        if (typeof args[0] === "string") {
          args[0] = "TUNNEL: " + args[0];
        } else {
          args.unshift("TUNNEL:");
        }
        console.error.apply(console, args);
      };
    } else {
      debug6 = function() {
      };
    }
    exports2.debug = debug6;
  }
});

// node_modules/tunnel/index.js
var require_tunnel2 = __commonJS({
  "node_modules/tunnel/index.js"(exports2, module2) {
    module2.exports = require_tunnel();
  }
});

// node_modules/@actions/http-client/index.js
var require_http_client = __commonJS({
  "node_modules/@actions/http-client/index.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    var http = require("http");
    var https = require("https");
    var pm = require_proxy();
    var tunnel;
    var HttpCodes;
    (function(HttpCodes2) {
      HttpCodes2[HttpCodes2["OK"] = 200] = "OK";
      HttpCodes2[HttpCodes2["MultipleChoices"] = 300] = "MultipleChoices";
      HttpCodes2[HttpCodes2["MovedPermanently"] = 301] = "MovedPermanently";
      HttpCodes2[HttpCodes2["ResourceMoved"] = 302] = "ResourceMoved";
      HttpCodes2[HttpCodes2["SeeOther"] = 303] = "SeeOther";
      HttpCodes2[HttpCodes2["NotModified"] = 304] = "NotModified";
      HttpCodes2[HttpCodes2["UseProxy"] = 305] = "UseProxy";
      HttpCodes2[HttpCodes2["SwitchProxy"] = 306] = "SwitchProxy";
      HttpCodes2[HttpCodes2["TemporaryRedirect"] = 307] = "TemporaryRedirect";
      HttpCodes2[HttpCodes2["PermanentRedirect"] = 308] = "PermanentRedirect";
      HttpCodes2[HttpCodes2["BadRequest"] = 400] = "BadRequest";
      HttpCodes2[HttpCodes2["Unauthorized"] = 401] = "Unauthorized";
      HttpCodes2[HttpCodes2["PaymentRequired"] = 402] = "PaymentRequired";
      HttpCodes2[HttpCodes2["Forbidden"] = 403] = "Forbidden";
      HttpCodes2[HttpCodes2["NotFound"] = 404] = "NotFound";
      HttpCodes2[HttpCodes2["MethodNotAllowed"] = 405] = "MethodNotAllowed";
      HttpCodes2[HttpCodes2["NotAcceptable"] = 406] = "NotAcceptable";
      HttpCodes2[HttpCodes2["ProxyAuthenticationRequired"] = 407] = "ProxyAuthenticationRequired";
      HttpCodes2[HttpCodes2["RequestTimeout"] = 408] = "RequestTimeout";
      HttpCodes2[HttpCodes2["Conflict"] = 409] = "Conflict";
      HttpCodes2[HttpCodes2["Gone"] = 410] = "Gone";
      HttpCodes2[HttpCodes2["TooManyRequests"] = 429] = "TooManyRequests";
      HttpCodes2[HttpCodes2["InternalServerError"] = 500] = "InternalServerError";
      HttpCodes2[HttpCodes2["NotImplemented"] = 501] = "NotImplemented";
      HttpCodes2[HttpCodes2["BadGateway"] = 502] = "BadGateway";
      HttpCodes2[HttpCodes2["ServiceUnavailable"] = 503] = "ServiceUnavailable";
      HttpCodes2[HttpCodes2["GatewayTimeout"] = 504] = "GatewayTimeout";
    })(HttpCodes = exports2.HttpCodes || (exports2.HttpCodes = {}));
    var Headers;
    (function(Headers2) {
      Headers2["Accept"] = "accept";
      Headers2["ContentType"] = "content-type";
    })(Headers = exports2.Headers || (exports2.Headers = {}));
    var MediaTypes;
    (function(MediaTypes2) {
      MediaTypes2["ApplicationJson"] = "application/json";
    })(MediaTypes = exports2.MediaTypes || (exports2.MediaTypes = {}));
    function getProxyUrl(serverUrl) {
      let proxyUrl = pm.getProxyUrl(new URL(serverUrl));
      return proxyUrl ? proxyUrl.href : "";
    }
    exports2.getProxyUrl = getProxyUrl;
    var HttpRedirectCodes = [
      HttpCodes.MovedPermanently,
      HttpCodes.ResourceMoved,
      HttpCodes.SeeOther,
      HttpCodes.TemporaryRedirect,
      HttpCodes.PermanentRedirect
    ];
    var HttpResponseRetryCodes = [
      HttpCodes.BadGateway,
      HttpCodes.ServiceUnavailable,
      HttpCodes.GatewayTimeout
    ];
    var RetryableHttpVerbs = ["OPTIONS", "GET", "DELETE", "HEAD"];
    var ExponentialBackoffCeiling = 10;
    var ExponentialBackoffTimeSlice = 5;
    var HttpClientError = class extends Error {
      constructor(message, statusCode) {
        super(message);
        this.name = "HttpClientError";
        this.statusCode = statusCode;
        Object.setPrototypeOf(this, HttpClientError.prototype);
      }
    };
    exports2.HttpClientError = HttpClientError;
    var HttpClientResponse = class {
      constructor(message) {
        this.message = message;
      }
      readBody() {
        return new Promise(async (resolve2, reject) => {
          let output = Buffer.alloc(0);
          this.message.on("data", (chunk) => {
            output = Buffer.concat([output, chunk]);
          });
          this.message.on("end", () => {
            resolve2(output.toString());
          });
        });
      }
    };
    exports2.HttpClientResponse = HttpClientResponse;
    function isHttps(requestUrl) {
      let parsedUrl = new URL(requestUrl);
      return parsedUrl.protocol === "https:";
    }
    exports2.isHttps = isHttps;
    var HttpClient = class {
      constructor(userAgent, handlers, requestOptions) {
        this._ignoreSslError = false;
        this._allowRedirects = true;
        this._allowRedirectDowngrade = false;
        this._maxRedirects = 50;
        this._allowRetries = false;
        this._maxRetries = 1;
        this._keepAlive = false;
        this._disposed = false;
        this.userAgent = userAgent;
        this.handlers = handlers || [];
        this.requestOptions = requestOptions;
        if (requestOptions) {
          if (requestOptions.ignoreSslError != null) {
            this._ignoreSslError = requestOptions.ignoreSslError;
          }
          this._socketTimeout = requestOptions.socketTimeout;
          if (requestOptions.allowRedirects != null) {
            this._allowRedirects = requestOptions.allowRedirects;
          }
          if (requestOptions.allowRedirectDowngrade != null) {
            this._allowRedirectDowngrade = requestOptions.allowRedirectDowngrade;
          }
          if (requestOptions.maxRedirects != null) {
            this._maxRedirects = Math.max(requestOptions.maxRedirects, 0);
          }
          if (requestOptions.keepAlive != null) {
            this._keepAlive = requestOptions.keepAlive;
          }
          if (requestOptions.allowRetries != null) {
            this._allowRetries = requestOptions.allowRetries;
          }
          if (requestOptions.maxRetries != null) {
            this._maxRetries = requestOptions.maxRetries;
          }
        }
      }
      options(requestUrl, additionalHeaders) {
        return this.request("OPTIONS", requestUrl, null, additionalHeaders || {});
      }
      get(requestUrl, additionalHeaders) {
        return this.request("GET", requestUrl, null, additionalHeaders || {});
      }
      del(requestUrl, additionalHeaders) {
        return this.request("DELETE", requestUrl, null, additionalHeaders || {});
      }
      post(requestUrl, data, additionalHeaders) {
        return this.request("POST", requestUrl, data, additionalHeaders || {});
      }
      patch(requestUrl, data, additionalHeaders) {
        return this.request("PATCH", requestUrl, data, additionalHeaders || {});
      }
      put(requestUrl, data, additionalHeaders) {
        return this.request("PUT", requestUrl, data, additionalHeaders || {});
      }
      head(requestUrl, additionalHeaders) {
        return this.request("HEAD", requestUrl, null, additionalHeaders || {});
      }
      sendStream(verb, requestUrl, stream, additionalHeaders) {
        return this.request(verb, requestUrl, stream, additionalHeaders);
      }
      async getJson(requestUrl, additionalHeaders = {}) {
        additionalHeaders[Headers.Accept] = this._getExistingOrDefaultHeader(additionalHeaders, Headers.Accept, MediaTypes.ApplicationJson);
        let res = await this.get(requestUrl, additionalHeaders);
        return this._processResponse(res, this.requestOptions);
      }
      async postJson(requestUrl, obj, additionalHeaders = {}) {
        let data = JSON.stringify(obj, null, 2);
        additionalHeaders[Headers.Accept] = this._getExistingOrDefaultHeader(additionalHeaders, Headers.Accept, MediaTypes.ApplicationJson);
        additionalHeaders[Headers.ContentType] = this._getExistingOrDefaultHeader(additionalHeaders, Headers.ContentType, MediaTypes.ApplicationJson);
        let res = await this.post(requestUrl, data, additionalHeaders);
        return this._processResponse(res, this.requestOptions);
      }
      async putJson(requestUrl, obj, additionalHeaders = {}) {
        let data = JSON.stringify(obj, null, 2);
        additionalHeaders[Headers.Accept] = this._getExistingOrDefaultHeader(additionalHeaders, Headers.Accept, MediaTypes.ApplicationJson);
        additionalHeaders[Headers.ContentType] = this._getExistingOrDefaultHeader(additionalHeaders, Headers.ContentType, MediaTypes.ApplicationJson);
        let res = await this.put(requestUrl, data, additionalHeaders);
        return this._processResponse(res, this.requestOptions);
      }
      async patchJson(requestUrl, obj, additionalHeaders = {}) {
        let data = JSON.stringify(obj, null, 2);
        additionalHeaders[Headers.Accept] = this._getExistingOrDefaultHeader(additionalHeaders, Headers.Accept, MediaTypes.ApplicationJson);
        additionalHeaders[Headers.ContentType] = this._getExistingOrDefaultHeader(additionalHeaders, Headers.ContentType, MediaTypes.ApplicationJson);
        let res = await this.patch(requestUrl, data, additionalHeaders);
        return this._processResponse(res, this.requestOptions);
      }
      async request(verb, requestUrl, data, headers) {
        if (this._disposed) {
          throw new Error("Client has already been disposed.");
        }
        let parsedUrl = new URL(requestUrl);
        let info10 = this._prepareRequest(verb, parsedUrl, headers);
        let maxTries = this._allowRetries && RetryableHttpVerbs.indexOf(verb) != -1 ? this._maxRetries + 1 : 1;
        let numTries = 0;
        let response;
        while (numTries < maxTries) {
          response = await this.requestRaw(info10, data);
          if (response && response.message && response.message.statusCode === HttpCodes.Unauthorized) {
            let authenticationHandler;
            for (let i = 0; i < this.handlers.length; i++) {
              if (this.handlers[i].canHandleAuthentication(response)) {
                authenticationHandler = this.handlers[i];
                break;
              }
            }
            if (authenticationHandler) {
              return authenticationHandler.handleAuthentication(this, info10, data);
            } else {
              return response;
            }
          }
          let redirectsRemaining = this._maxRedirects;
          while (HttpRedirectCodes.indexOf(response.message.statusCode) != -1 && this._allowRedirects && redirectsRemaining > 0) {
            const redirectUrl = response.message.headers["location"];
            if (!redirectUrl) {
              break;
            }
            let parsedRedirectUrl = new URL(redirectUrl);
            if (parsedUrl.protocol == "https:" && parsedUrl.protocol != parsedRedirectUrl.protocol && !this._allowRedirectDowngrade) {
              throw new Error("Redirect from HTTPS to HTTP protocol. This downgrade is not allowed for security reasons. If you want to allow this behavior, set the allowRedirectDowngrade option to true.");
            }
            await response.readBody();
            if (parsedRedirectUrl.hostname !== parsedUrl.hostname) {
              for (let header in headers) {
                if (header.toLowerCase() === "authorization") {
                  delete headers[header];
                }
              }
            }
            info10 = this._prepareRequest(verb, parsedRedirectUrl, headers);
            response = await this.requestRaw(info10, data);
            redirectsRemaining--;
          }
          if (HttpResponseRetryCodes.indexOf(response.message.statusCode) == -1) {
            return response;
          }
          numTries += 1;
          if (numTries < maxTries) {
            await response.readBody();
            await this._performExponentialBackoff(numTries);
          }
        }
        return response;
      }
      dispose() {
        if (this._agent) {
          this._agent.destroy();
        }
        this._disposed = true;
      }
      requestRaw(info10, data) {
        return new Promise((resolve2, reject) => {
          let callbackForResult = function(err, res) {
            if (err) {
              reject(err);
            }
            resolve2(res);
          };
          this.requestRawWithCallback(info10, data, callbackForResult);
        });
      }
      requestRawWithCallback(info10, data, onResult) {
        let socket;
        if (typeof data === "string") {
          info10.options.headers["Content-Length"] = Buffer.byteLength(data, "utf8");
        }
        let callbackCalled = false;
        let handleResult = (err, res) => {
          if (!callbackCalled) {
            callbackCalled = true;
            onResult(err, res);
          }
        };
        let req = info10.httpModule.request(info10.options, (msg) => {
          let res = new HttpClientResponse(msg);
          handleResult(null, res);
        });
        req.on("socket", (sock) => {
          socket = sock;
        });
        req.setTimeout(this._socketTimeout || 3 * 6e4, () => {
          if (socket) {
            socket.end();
          }
          handleResult(new Error("Request timeout: " + info10.options.path), null);
        });
        req.on("error", function(err) {
          handleResult(err, null);
        });
        if (data && typeof data === "string") {
          req.write(data, "utf8");
        }
        if (data && typeof data !== "string") {
          data.on("close", function() {
            req.end();
          });
          data.pipe(req);
        } else {
          req.end();
        }
      }
      getAgent(serverUrl) {
        let parsedUrl = new URL(serverUrl);
        return this._getAgent(parsedUrl);
      }
      _prepareRequest(method, requestUrl, headers) {
        const info10 = {};
        info10.parsedUrl = requestUrl;
        const usingSsl = info10.parsedUrl.protocol === "https:";
        info10.httpModule = usingSsl ? https : http;
        const defaultPort = usingSsl ? 443 : 80;
        info10.options = {};
        info10.options.host = info10.parsedUrl.hostname;
        info10.options.port = info10.parsedUrl.port ? parseInt(info10.parsedUrl.port) : defaultPort;
        info10.options.path = (info10.parsedUrl.pathname || "") + (info10.parsedUrl.search || "");
        info10.options.method = method;
        info10.options.headers = this._mergeHeaders(headers);
        if (this.userAgent != null) {
          info10.options.headers["user-agent"] = this.userAgent;
        }
        info10.options.agent = this._getAgent(info10.parsedUrl);
        if (this.handlers) {
          this.handlers.forEach((handler) => {
            handler.prepareRequest(info10.options);
          });
        }
        return info10;
      }
      _mergeHeaders(headers) {
        const lowercaseKeys = (obj) => Object.keys(obj).reduce((c, k) => (c[k.toLowerCase()] = obj[k], c), {});
        if (this.requestOptions && this.requestOptions.headers) {
          return Object.assign({}, lowercaseKeys(this.requestOptions.headers), lowercaseKeys(headers));
        }
        return lowercaseKeys(headers || {});
      }
      _getExistingOrDefaultHeader(additionalHeaders, header, _default2) {
        const lowercaseKeys = (obj) => Object.keys(obj).reduce((c, k) => (c[k.toLowerCase()] = obj[k], c), {});
        let clientHeader;
        if (this.requestOptions && this.requestOptions.headers) {
          clientHeader = lowercaseKeys(this.requestOptions.headers)[header];
        }
        return additionalHeaders[header] || clientHeader || _default2;
      }
      _getAgent(parsedUrl) {
        let agent;
        let proxyUrl = pm.getProxyUrl(parsedUrl);
        let useProxy = proxyUrl && proxyUrl.hostname;
        if (this._keepAlive && useProxy) {
          agent = this._proxyAgent;
        }
        if (this._keepAlive && !useProxy) {
          agent = this._agent;
        }
        if (!!agent) {
          return agent;
        }
        const usingSsl = parsedUrl.protocol === "https:";
        let maxSockets = 100;
        if (!!this.requestOptions) {
          maxSockets = this.requestOptions.maxSockets || http.globalAgent.maxSockets;
        }
        if (useProxy) {
          if (!tunnel) {
            tunnel = require_tunnel2();
          }
          const agentOptions = {
            maxSockets,
            keepAlive: this._keepAlive,
            proxy: __spreadProps(__spreadValues({}, (proxyUrl.username || proxyUrl.password) && {
              proxyAuth: `${proxyUrl.username}:${proxyUrl.password}`
            }), {
              host: proxyUrl.hostname,
              port: proxyUrl.port
            })
          };
          let tunnelAgent;
          const overHttps = proxyUrl.protocol === "https:";
          if (usingSsl) {
            tunnelAgent = overHttps ? tunnel.httpsOverHttps : tunnel.httpsOverHttp;
          } else {
            tunnelAgent = overHttps ? tunnel.httpOverHttps : tunnel.httpOverHttp;
          }
          agent = tunnelAgent(agentOptions);
          this._proxyAgent = agent;
        }
        if (this._keepAlive && !agent) {
          const options = { keepAlive: this._keepAlive, maxSockets };
          agent = usingSsl ? new https.Agent(options) : new http.Agent(options);
          this._agent = agent;
        }
        if (!agent) {
          agent = usingSsl ? https.globalAgent : http.globalAgent;
        }
        if (usingSsl && this._ignoreSslError) {
          agent.options = Object.assign(agent.options || {}, {
            rejectUnauthorized: false
          });
        }
        return agent;
      }
      _performExponentialBackoff(retryNumber) {
        retryNumber = Math.min(ExponentialBackoffCeiling, retryNumber);
        const ms = ExponentialBackoffTimeSlice * Math.pow(2, retryNumber);
        return new Promise((resolve2) => setTimeout(() => resolve2(), ms));
      }
      static dateTimeDeserializer(key, value) {
        if (typeof value === "string") {
          let a = new Date(value);
          if (!isNaN(a.valueOf())) {
            return a;
          }
        }
        return value;
      }
      async _processResponse(res, options) {
        return new Promise(async (resolve2, reject) => {
          const statusCode = res.message.statusCode;
          const response = {
            statusCode,
            result: null,
            headers: {}
          };
          if (statusCode == HttpCodes.NotFound) {
            resolve2(response);
          }
          let obj;
          let contents;
          try {
            contents = await res.readBody();
            if (contents && contents.length > 0) {
              if (options && options.deserializeDates) {
                obj = JSON.parse(contents, HttpClient.dateTimeDeserializer);
              } else {
                obj = JSON.parse(contents);
              }
              response.result = obj;
            }
            response.headers = res.message.headers;
          } catch (err) {
          }
          if (statusCode > 299) {
            let msg;
            if (obj && obj.message) {
              msg = obj.message;
            } else if (contents && contents.length > 0) {
              msg = contents;
            } else {
              msg = "Failed request: (" + statusCode + ")";
            }
            let err = new HttpClientError(msg, statusCode);
            err.result = response.result;
            reject(err);
          } else {
            resolve2(response);
          }
        });
      }
    };
    exports2.HttpClient = HttpClient;
  }
});

// node_modules/@actions/github/lib/internal/utils.js
var require_utils2 = __commonJS({
  "node_modules/@actions/github/lib/internal/utils.js"(exports2) {
    "use strict";
    var __createBinding = exports2 && exports2.__createBinding || (Object.create ? function(o, m, k, k2) {
      if (k2 === void 0)
        k2 = k;
      Object.defineProperty(o, k2, { enumerable: true, get: function() {
        return m[k];
      } });
    } : function(o, m, k, k2) {
      if (k2 === void 0)
        k2 = k;
      o[k2] = m[k];
    });
    var __setModuleDefault = exports2 && exports2.__setModuleDefault || (Object.create ? function(o, v) {
      Object.defineProperty(o, "default", { enumerable: true, value: v });
    } : function(o, v) {
      o["default"] = v;
    });
    var __importStar = exports2 && exports2.__importStar || function(mod) {
      if (mod && mod.__esModule)
        return mod;
      var result = {};
      if (mod != null) {
        for (var k in mod)
          if (k !== "default" && Object.hasOwnProperty.call(mod, k))
            __createBinding(result, mod, k);
      }
      __setModuleDefault(result, mod);
      return result;
    };
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.getApiBaseUrl = exports2.getProxyAgent = exports2.getAuthString = void 0;
    var httpClient = __importStar(require_http_client());
    function getAuthString(token, options) {
      if (!token && !options.auth) {
        throw new Error("Parameter token or opts.auth is required");
      } else if (token && options.auth) {
        throw new Error("Parameters token and opts.auth may not both be specified");
      }
      return typeof options.auth === "string" ? options.auth : `token ${token}`;
    }
    exports2.getAuthString = getAuthString;
    function getProxyAgent(destinationUrl) {
      const hc = new httpClient.HttpClient();
      return hc.getAgent(destinationUrl);
    }
    exports2.getProxyAgent = getProxyAgent;
    function getApiBaseUrl() {
      return process.env["GITHUB_API_URL"] || "https://api.github.com";
    }
    exports2.getApiBaseUrl = getApiBaseUrl;
  }
});

// node_modules/universal-user-agent/dist-node/index.js
var require_dist_node = __commonJS({
  "node_modules/universal-user-agent/dist-node/index.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    function getUserAgent() {
      if (typeof navigator === "object" && "userAgent" in navigator) {
        return navigator.userAgent;
      }
      if (typeof process === "object" && "version" in process) {
        return `Node.js/${process.version.substr(1)} (${process.platform}; ${process.arch})`;
      }
      return "<environment undetectable>";
    }
    exports2.getUserAgent = getUserAgent;
  }
});

// node_modules/before-after-hook/lib/register.js
var require_register = __commonJS({
  "node_modules/before-after-hook/lib/register.js"(exports2, module2) {
    module2.exports = register;
    function register(state, name, method, options) {
      if (typeof method !== "function") {
        throw new Error("method for before hook must be a function");
      }
      if (!options) {
        options = {};
      }
      if (Array.isArray(name)) {
        return name.reverse().reduce(function(callback, name2) {
          return register.bind(null, state, name2, callback, options);
        }, method)();
      }
      return Promise.resolve().then(function() {
        if (!state.registry[name]) {
          return method(options);
        }
        return state.registry[name].reduce(function(method2, registered) {
          return registered.hook.bind(null, method2, options);
        }, method)();
      });
    }
  }
});

// node_modules/before-after-hook/lib/add.js
var require_add = __commonJS({
  "node_modules/before-after-hook/lib/add.js"(exports2, module2) {
    module2.exports = addHook;
    function addHook(state, kind, name, hook) {
      var orig = hook;
      if (!state.registry[name]) {
        state.registry[name] = [];
      }
      if (kind === "before") {
        hook = function(method, options) {
          return Promise.resolve().then(orig.bind(null, options)).then(method.bind(null, options));
        };
      }
      if (kind === "after") {
        hook = function(method, options) {
          var result;
          return Promise.resolve().then(method.bind(null, options)).then(function(result_) {
            result = result_;
            return orig(result, options);
          }).then(function() {
            return result;
          });
        };
      }
      if (kind === "error") {
        hook = function(method, options) {
          return Promise.resolve().then(method.bind(null, options)).catch(function(error) {
            return orig(error, options);
          });
        };
      }
      state.registry[name].push({
        hook,
        orig
      });
    }
  }
});

// node_modules/before-after-hook/lib/remove.js
var require_remove = __commonJS({
  "node_modules/before-after-hook/lib/remove.js"(exports2, module2) {
    module2.exports = removeHook;
    function removeHook(state, name, method) {
      if (!state.registry[name]) {
        return;
      }
      var index = state.registry[name].map(function(registered) {
        return registered.orig;
      }).indexOf(method);
      if (index === -1) {
        return;
      }
      state.registry[name].splice(index, 1);
    }
  }
});

// node_modules/before-after-hook/index.js
var require_before_after_hook = __commonJS({
  "node_modules/before-after-hook/index.js"(exports2, module2) {
    var register = require_register();
    var addHook = require_add();
    var removeHook = require_remove();
    var bind = Function.bind;
    var bindable = bind.bind(bind);
    function bindApi(hook, state, name) {
      var removeHookRef = bindable(removeHook, null).apply(null, name ? [state, name] : [state]);
      hook.api = { remove: removeHookRef };
      hook.remove = removeHookRef;
      ["before", "error", "after", "wrap"].forEach(function(kind) {
        var args = name ? [state, kind, name] : [state, kind];
        hook[kind] = hook.api[kind] = bindable(addHook, null).apply(null, args);
      });
    }
    function HookSingular() {
      var singularHookName = "h";
      var singularHookState = {
        registry: {}
      };
      var singularHook = register.bind(null, singularHookState, singularHookName);
      bindApi(singularHook, singularHookState, singularHookName);
      return singularHook;
    }
    function HookCollection() {
      var state = {
        registry: {}
      };
      var hook = register.bind(null, state);
      bindApi(hook, state);
      return hook;
    }
    var collectionHookDeprecationMessageDisplayed = false;
    function Hook() {
      if (!collectionHookDeprecationMessageDisplayed) {
        console.warn('[before-after-hook]: "Hook()" repurposing warning, use "Hook.Collection()". Read more: https://git.io/upgrade-before-after-hook-to-1.4');
        collectionHookDeprecationMessageDisplayed = true;
      }
      return HookCollection();
    }
    Hook.Singular = HookSingular.bind();
    Hook.Collection = HookCollection.bind();
    module2.exports = Hook;
    module2.exports.Hook = Hook;
    module2.exports.Singular = Hook.Singular;
    module2.exports.Collection = Hook.Collection;
  }
});

// node_modules/is-plain-object/dist/is-plain-object.js
var require_is_plain_object = __commonJS({
  "node_modules/is-plain-object/dist/is-plain-object.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    function isObject2(o) {
      return Object.prototype.toString.call(o) === "[object Object]";
    }
    function isPlainObject(o) {
      var ctor, prot;
      if (isObject2(o) === false)
        return false;
      ctor = o.constructor;
      if (ctor === void 0)
        return true;
      prot = ctor.prototype;
      if (isObject2(prot) === false)
        return false;
      if (prot.hasOwnProperty("isPrototypeOf") === false) {
        return false;
      }
      return true;
    }
    exports2.isPlainObject = isPlainObject;
  }
});

// node_modules/@octokit/endpoint/dist-node/index.js
var require_dist_node2 = __commonJS({
  "node_modules/@octokit/endpoint/dist-node/index.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    var isPlainObject = require_is_plain_object();
    var universalUserAgent = require_dist_node();
    function lowercaseKeys(object) {
      if (!object) {
        return {};
      }
      return Object.keys(object).reduce((newObj, key) => {
        newObj[key.toLowerCase()] = object[key];
        return newObj;
      }, {});
    }
    function mergeDeep(defaults, options) {
      const result = Object.assign({}, defaults);
      Object.keys(options).forEach((key) => {
        if (isPlainObject.isPlainObject(options[key])) {
          if (!(key in defaults))
            Object.assign(result, {
              [key]: options[key]
            });
          else
            result[key] = mergeDeep(defaults[key], options[key]);
        } else {
          Object.assign(result, {
            [key]: options[key]
          });
        }
      });
      return result;
    }
    function removeUndefinedProperties(obj) {
      for (const key in obj) {
        if (obj[key] === void 0) {
          delete obj[key];
        }
      }
      return obj;
    }
    function merge2(defaults, route, options) {
      if (typeof route === "string") {
        let [method, url] = route.split(" ");
        options = Object.assign(url ? {
          method,
          url
        } : {
          url: method
        }, options);
      } else {
        options = Object.assign({}, route);
      }
      options.headers = lowercaseKeys(options.headers);
      removeUndefinedProperties(options);
      removeUndefinedProperties(options.headers);
      const mergedOptions = mergeDeep(defaults || {}, options);
      if (defaults && defaults.mediaType.previews.length) {
        mergedOptions.mediaType.previews = defaults.mediaType.previews.filter((preview) => !mergedOptions.mediaType.previews.includes(preview)).concat(mergedOptions.mediaType.previews);
      }
      mergedOptions.mediaType.previews = mergedOptions.mediaType.previews.map((preview) => preview.replace(/-preview/, ""));
      return mergedOptions;
    }
    function addQueryParameters(url, parameters) {
      const separator = /\?/.test(url) ? "&" : "?";
      const names = Object.keys(parameters);
      if (names.length === 0) {
        return url;
      }
      return url + separator + names.map((name) => {
        if (name === "q") {
          return "q=" + parameters.q.split("+").map(encodeURIComponent).join("+");
        }
        return `${name}=${encodeURIComponent(parameters[name])}`;
      }).join("&");
    }
    var urlVariableRegex = /\{[^}]+\}/g;
    function removeNonChars(variableName) {
      return variableName.replace(/^\W+|\W+$/g, "").split(/,/);
    }
    function extractUrlVariableNames(url) {
      const matches = url.match(urlVariableRegex);
      if (!matches) {
        return [];
      }
      return matches.map(removeNonChars).reduce((a, b) => a.concat(b), []);
    }
    function omit(object, keysToOmit) {
      return Object.keys(object).filter((option) => !keysToOmit.includes(option)).reduce((obj, key) => {
        obj[key] = object[key];
        return obj;
      }, {});
    }
    function encodeReserved(str2) {
      return str2.split(/(%[0-9A-Fa-f]{2})/g).map(function(part) {
        if (!/%[0-9A-Fa-f]/.test(part)) {
          part = encodeURI(part).replace(/%5B/g, "[").replace(/%5D/g, "]");
        }
        return part;
      }).join("");
    }
    function encodeUnreserved(str2) {
      return encodeURIComponent(str2).replace(/[!'()*]/g, function(c) {
        return "%" + c.charCodeAt(0).toString(16).toUpperCase();
      });
    }
    function encodeValue(operator, value, key) {
      value = operator === "+" || operator === "#" ? encodeReserved(value) : encodeUnreserved(value);
      if (key) {
        return encodeUnreserved(key) + "=" + value;
      } else {
        return value;
      }
    }
    function isDefined(value) {
      return value !== void 0 && value !== null;
    }
    function isKeyOperator(operator) {
      return operator === ";" || operator === "&" || operator === "?";
    }
    function getValues(context3, operator, key, modifier) {
      var value = context3[key], result = [];
      if (isDefined(value) && value !== "") {
        if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
          value = value.toString();
          if (modifier && modifier !== "*") {
            value = value.substring(0, parseInt(modifier, 10));
          }
          result.push(encodeValue(operator, value, isKeyOperator(operator) ? key : ""));
        } else {
          if (modifier === "*") {
            if (Array.isArray(value)) {
              value.filter(isDefined).forEach(function(value2) {
                result.push(encodeValue(operator, value2, isKeyOperator(operator) ? key : ""));
              });
            } else {
              Object.keys(value).forEach(function(k) {
                if (isDefined(value[k])) {
                  result.push(encodeValue(operator, value[k], k));
                }
              });
            }
          } else {
            const tmp = [];
            if (Array.isArray(value)) {
              value.filter(isDefined).forEach(function(value2) {
                tmp.push(encodeValue(operator, value2));
              });
            } else {
              Object.keys(value).forEach(function(k) {
                if (isDefined(value[k])) {
                  tmp.push(encodeUnreserved(k));
                  tmp.push(encodeValue(operator, value[k].toString()));
                }
              });
            }
            if (isKeyOperator(operator)) {
              result.push(encodeUnreserved(key) + "=" + tmp.join(","));
            } else if (tmp.length !== 0) {
              result.push(tmp.join(","));
            }
          }
        }
      } else {
        if (operator === ";") {
          if (isDefined(value)) {
            result.push(encodeUnreserved(key));
          }
        } else if (value === "" && (operator === "&" || operator === "?")) {
          result.push(encodeUnreserved(key) + "=");
        } else if (value === "") {
          result.push("");
        }
      }
      return result;
    }
    function parseUrl(template) {
      return {
        expand: expand.bind(null, template)
      };
    }
    function expand(template, context3) {
      var operators = ["+", "#", ".", "/", ";", "?", "&"];
      return template.replace(/\{([^\{\}]+)\}|([^\{\}]+)/g, function(_, expression, literal) {
        if (expression) {
          let operator = "";
          const values = [];
          if (operators.indexOf(expression.charAt(0)) !== -1) {
            operator = expression.charAt(0);
            expression = expression.substr(1);
          }
          expression.split(/,/g).forEach(function(variable) {
            var tmp = /([^:\*]*)(?::(\d+)|(\*))?/.exec(variable);
            values.push(getValues(context3, operator, tmp[1], tmp[2] || tmp[3]));
          });
          if (operator && operator !== "+") {
            var separator = ",";
            if (operator === "?") {
              separator = "&";
            } else if (operator !== "#") {
              separator = operator;
            }
            return (values.length !== 0 ? operator : "") + values.join(separator);
          } else {
            return values.join(",");
          }
        } else {
          return encodeReserved(literal);
        }
      });
    }
    function parse(options) {
      let method = options.method.toUpperCase();
      let url = (options.url || "/").replace(/:([a-z]\w+)/g, "{$1}");
      let headers = Object.assign({}, options.headers);
      let body;
      let parameters = omit(options, ["method", "baseUrl", "url", "headers", "request", "mediaType"]);
      const urlVariableNames = extractUrlVariableNames(url);
      url = parseUrl(url).expand(parameters);
      if (!/^http/.test(url)) {
        url = options.baseUrl + url;
      }
      const omittedParameters = Object.keys(options).filter((option) => urlVariableNames.includes(option)).concat("baseUrl");
      const remainingParameters = omit(parameters, omittedParameters);
      const isBinaryRequest = /application\/octet-stream/i.test(headers.accept);
      if (!isBinaryRequest) {
        if (options.mediaType.format) {
          headers.accept = headers.accept.split(/,/).map((preview) => preview.replace(/application\/vnd(\.\w+)(\.v3)?(\.\w+)?(\+json)?$/, `application/vnd$1$2.${options.mediaType.format}`)).join(",");
        }
        if (options.mediaType.previews.length) {
          const previewsFromAcceptHeader = headers.accept.match(/[\w-]+(?=-preview)/g) || [];
          headers.accept = previewsFromAcceptHeader.concat(options.mediaType.previews).map((preview) => {
            const format = options.mediaType.format ? `.${options.mediaType.format}` : "+json";
            return `application/vnd.github.${preview}-preview${format}`;
          }).join(",");
        }
      }
      if (["GET", "HEAD"].includes(method)) {
        url = addQueryParameters(url, remainingParameters);
      } else {
        if ("data" in remainingParameters) {
          body = remainingParameters.data;
        } else {
          if (Object.keys(remainingParameters).length) {
            body = remainingParameters;
          } else {
            headers["content-length"] = 0;
          }
        }
      }
      if (!headers["content-type"] && typeof body !== "undefined") {
        headers["content-type"] = "application/json; charset=utf-8";
      }
      if (["PATCH", "PUT"].includes(method) && typeof body === "undefined") {
        body = "";
      }
      return Object.assign({
        method,
        url,
        headers
      }, typeof body !== "undefined" ? {
        body
      } : null, options.request ? {
        request: options.request
      } : null);
    }
    function endpointWithDefaults(defaults, route, options) {
      return parse(merge2(defaults, route, options));
    }
    function withDefaults(oldDefaults, newDefaults) {
      const DEFAULTS2 = merge2(oldDefaults, newDefaults);
      const endpoint2 = endpointWithDefaults.bind(null, DEFAULTS2);
      return Object.assign(endpoint2, {
        DEFAULTS: DEFAULTS2,
        defaults: withDefaults.bind(null, DEFAULTS2),
        merge: merge2.bind(null, DEFAULTS2),
        parse
      });
    }
    var VERSION = "6.0.12";
    var userAgent = `octokit-endpoint.js/${VERSION} ${universalUserAgent.getUserAgent()}`;
    var DEFAULTS = {
      method: "GET",
      baseUrl: "https://api.github.com",
      headers: {
        accept: "application/vnd.github.v3+json",
        "user-agent": userAgent
      },
      mediaType: {
        format: "",
        previews: []
      }
    };
    var endpoint = withDefaults(null, DEFAULTS);
    exports2.endpoint = endpoint;
  }
});

// node_modules/node-fetch/lib/index.js
var require_lib = __commonJS({
  "node_modules/node-fetch/lib/index.js"(exports2, module2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    function _interopDefault(ex) {
      return ex && typeof ex === "object" && "default" in ex ? ex["default"] : ex;
    }
    var Stream = _interopDefault(require("stream"));
    var http = _interopDefault(require("http"));
    var Url = _interopDefault(require("url"));
    var https = _interopDefault(require("https"));
    var zlib = _interopDefault(require("zlib"));
    var Readable = Stream.Readable;
    var BUFFER = Symbol("buffer");
    var TYPE = Symbol("type");
    var Blob = class {
      constructor() {
        this[TYPE] = "";
        const blobParts = arguments[0];
        const options = arguments[1];
        const buffers = [];
        let size = 0;
        if (blobParts) {
          const a = blobParts;
          const length = Number(a.length);
          for (let i = 0; i < length; i++) {
            const element = a[i];
            let buffer;
            if (element instanceof Buffer) {
              buffer = element;
            } else if (ArrayBuffer.isView(element)) {
              buffer = Buffer.from(element.buffer, element.byteOffset, element.byteLength);
            } else if (element instanceof ArrayBuffer) {
              buffer = Buffer.from(element);
            } else if (element instanceof Blob) {
              buffer = element[BUFFER];
            } else {
              buffer = Buffer.from(typeof element === "string" ? element : String(element));
            }
            size += buffer.length;
            buffers.push(buffer);
          }
        }
        this[BUFFER] = Buffer.concat(buffers);
        let type2 = options && options.type !== void 0 && String(options.type).toLowerCase();
        if (type2 && !/[^\u0020-\u007E]/.test(type2)) {
          this[TYPE] = type2;
        }
      }
      get size() {
        return this[BUFFER].length;
      }
      get type() {
        return this[TYPE];
      }
      text() {
        return Promise.resolve(this[BUFFER].toString());
      }
      arrayBuffer() {
        const buf = this[BUFFER];
        const ab = buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength);
        return Promise.resolve(ab);
      }
      stream() {
        const readable = new Readable();
        readable._read = function() {
        };
        readable.push(this[BUFFER]);
        readable.push(null);
        return readable;
      }
      toString() {
        return "[object Blob]";
      }
      slice() {
        const size = this.size;
        const start = arguments[0];
        const end = arguments[1];
        let relativeStart, relativeEnd;
        if (start === void 0) {
          relativeStart = 0;
        } else if (start < 0) {
          relativeStart = Math.max(size + start, 0);
        } else {
          relativeStart = Math.min(start, size);
        }
        if (end === void 0) {
          relativeEnd = size;
        } else if (end < 0) {
          relativeEnd = Math.max(size + end, 0);
        } else {
          relativeEnd = Math.min(end, size);
        }
        const span = Math.max(relativeEnd - relativeStart, 0);
        const buffer = this[BUFFER];
        const slicedBuffer = buffer.slice(relativeStart, relativeStart + span);
        const blob = new Blob([], { type: arguments[2] });
        blob[BUFFER] = slicedBuffer;
        return blob;
      }
    };
    Object.defineProperties(Blob.prototype, {
      size: { enumerable: true },
      type: { enumerable: true },
      slice: { enumerable: true }
    });
    Object.defineProperty(Blob.prototype, Symbol.toStringTag, {
      value: "Blob",
      writable: false,
      enumerable: false,
      configurable: true
    });
    function FetchError(message, type2, systemError) {
      Error.call(this, message);
      this.message = message;
      this.type = type2;
      if (systemError) {
        this.code = this.errno = systemError.code;
      }
      Error.captureStackTrace(this, this.constructor);
    }
    FetchError.prototype = Object.create(Error.prototype);
    FetchError.prototype.constructor = FetchError;
    FetchError.prototype.name = "FetchError";
    var convert;
    try {
      convert = require("encoding").convert;
    } catch (e) {
    }
    var INTERNALS = Symbol("Body internals");
    var PassThrough = Stream.PassThrough;
    function Body(body) {
      var _this = this;
      var _ref = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {}, _ref$size = _ref.size;
      let size = _ref$size === void 0 ? 0 : _ref$size;
      var _ref$timeout = _ref.timeout;
      let timeout = _ref$timeout === void 0 ? 0 : _ref$timeout;
      if (body == null) {
        body = null;
      } else if (isURLSearchParams(body)) {
        body = Buffer.from(body.toString());
      } else if (isBlob(body))
        ;
      else if (Buffer.isBuffer(body))
        ;
      else if (Object.prototype.toString.call(body) === "[object ArrayBuffer]") {
        body = Buffer.from(body);
      } else if (ArrayBuffer.isView(body)) {
        body = Buffer.from(body.buffer, body.byteOffset, body.byteLength);
      } else if (body instanceof Stream)
        ;
      else {
        body = Buffer.from(String(body));
      }
      this[INTERNALS] = {
        body,
        disturbed: false,
        error: null
      };
      this.size = size;
      this.timeout = timeout;
      if (body instanceof Stream) {
        body.on("error", function(err) {
          const error = err.name === "AbortError" ? err : new FetchError(`Invalid response body while trying to fetch ${_this.url}: ${err.message}`, "system", err);
          _this[INTERNALS].error = error;
        });
      }
    }
    Body.prototype = {
      get body() {
        return this[INTERNALS].body;
      },
      get bodyUsed() {
        return this[INTERNALS].disturbed;
      },
      arrayBuffer() {
        return consumeBody.call(this).then(function(buf) {
          return buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength);
        });
      },
      blob() {
        let ct = this.headers && this.headers.get("content-type") || "";
        return consumeBody.call(this).then(function(buf) {
          return Object.assign(new Blob([], {
            type: ct.toLowerCase()
          }), {
            [BUFFER]: buf
          });
        });
      },
      json() {
        var _this2 = this;
        return consumeBody.call(this).then(function(buffer) {
          try {
            return JSON.parse(buffer.toString());
          } catch (err) {
            return Body.Promise.reject(new FetchError(`invalid json response body at ${_this2.url} reason: ${err.message}`, "invalid-json"));
          }
        });
      },
      text() {
        return consumeBody.call(this).then(function(buffer) {
          return buffer.toString();
        });
      },
      buffer() {
        return consumeBody.call(this);
      },
      textConverted() {
        var _this3 = this;
        return consumeBody.call(this).then(function(buffer) {
          return convertBody(buffer, _this3.headers);
        });
      }
    };
    Object.defineProperties(Body.prototype, {
      body: { enumerable: true },
      bodyUsed: { enumerable: true },
      arrayBuffer: { enumerable: true },
      blob: { enumerable: true },
      json: { enumerable: true },
      text: { enumerable: true }
    });
    Body.mixIn = function(proto) {
      for (const name of Object.getOwnPropertyNames(Body.prototype)) {
        if (!(name in proto)) {
          const desc = Object.getOwnPropertyDescriptor(Body.prototype, name);
          Object.defineProperty(proto, name, desc);
        }
      }
    };
    function consumeBody() {
      var _this4 = this;
      if (this[INTERNALS].disturbed) {
        return Body.Promise.reject(new TypeError(`body used already for: ${this.url}`));
      }
      this[INTERNALS].disturbed = true;
      if (this[INTERNALS].error) {
        return Body.Promise.reject(this[INTERNALS].error);
      }
      let body = this.body;
      if (body === null) {
        return Body.Promise.resolve(Buffer.alloc(0));
      }
      if (isBlob(body)) {
        body = body.stream();
      }
      if (Buffer.isBuffer(body)) {
        return Body.Promise.resolve(body);
      }
      if (!(body instanceof Stream)) {
        return Body.Promise.resolve(Buffer.alloc(0));
      }
      let accum = [];
      let accumBytes = 0;
      let abort = false;
      return new Body.Promise(function(resolve2, reject) {
        let resTimeout;
        if (_this4.timeout) {
          resTimeout = setTimeout(function() {
            abort = true;
            reject(new FetchError(`Response timeout while trying to fetch ${_this4.url} (over ${_this4.timeout}ms)`, "body-timeout"));
          }, _this4.timeout);
        }
        body.on("error", function(err) {
          if (err.name === "AbortError") {
            abort = true;
            reject(err);
          } else {
            reject(new FetchError(`Invalid response body while trying to fetch ${_this4.url}: ${err.message}`, "system", err));
          }
        });
        body.on("data", function(chunk) {
          if (abort || chunk === null) {
            return;
          }
          if (_this4.size && accumBytes + chunk.length > _this4.size) {
            abort = true;
            reject(new FetchError(`content size at ${_this4.url} over limit: ${_this4.size}`, "max-size"));
            return;
          }
          accumBytes += chunk.length;
          accum.push(chunk);
        });
        body.on("end", function() {
          if (abort) {
            return;
          }
          clearTimeout(resTimeout);
          try {
            resolve2(Buffer.concat(accum, accumBytes));
          } catch (err) {
            reject(new FetchError(`Could not create Buffer from response body for ${_this4.url}: ${err.message}`, "system", err));
          }
        });
      });
    }
    function convertBody(buffer, headers) {
      if (typeof convert !== "function") {
        throw new Error("The package `encoding` must be installed to use the textConverted() function");
      }
      const ct = headers.get("content-type");
      let charset = "utf-8";
      let res, str2;
      if (ct) {
        res = /charset=([^;]*)/i.exec(ct);
      }
      str2 = buffer.slice(0, 1024).toString();
      if (!res && str2) {
        res = /<meta.+?charset=(['"])(.+?)\1/i.exec(str2);
      }
      if (!res && str2) {
        res = /<meta[\s]+?http-equiv=(['"])content-type\1[\s]+?content=(['"])(.+?)\2/i.exec(str2);
        if (!res) {
          res = /<meta[\s]+?content=(['"])(.+?)\1[\s]+?http-equiv=(['"])content-type\3/i.exec(str2);
          if (res) {
            res.pop();
          }
        }
        if (res) {
          res = /charset=(.*)/i.exec(res.pop());
        }
      }
      if (!res && str2) {
        res = /<\?xml.+?encoding=(['"])(.+?)\1/i.exec(str2);
      }
      if (res) {
        charset = res.pop();
        if (charset === "gb2312" || charset === "gbk") {
          charset = "gb18030";
        }
      }
      return convert(buffer, "UTF-8", charset).toString();
    }
    function isURLSearchParams(obj) {
      if (typeof obj !== "object" || typeof obj.append !== "function" || typeof obj.delete !== "function" || typeof obj.get !== "function" || typeof obj.getAll !== "function" || typeof obj.has !== "function" || typeof obj.set !== "function") {
        return false;
      }
      return obj.constructor.name === "URLSearchParams" || Object.prototype.toString.call(obj) === "[object URLSearchParams]" || typeof obj.sort === "function";
    }
    function isBlob(obj) {
      return typeof obj === "object" && typeof obj.arrayBuffer === "function" && typeof obj.type === "string" && typeof obj.stream === "function" && typeof obj.constructor === "function" && typeof obj.constructor.name === "string" && /^(Blob|File)$/.test(obj.constructor.name) && /^(Blob|File)$/.test(obj[Symbol.toStringTag]);
    }
    function clone(instance) {
      let p1, p2;
      let body = instance.body;
      if (instance.bodyUsed) {
        throw new Error("cannot clone body after it is used");
      }
      if (body instanceof Stream && typeof body.getBoundary !== "function") {
        p1 = new PassThrough();
        p2 = new PassThrough();
        body.pipe(p1);
        body.pipe(p2);
        instance[INTERNALS].body = p1;
        body = p2;
      }
      return body;
    }
    function extractContentType(body) {
      if (body === null) {
        return null;
      } else if (typeof body === "string") {
        return "text/plain;charset=UTF-8";
      } else if (isURLSearchParams(body)) {
        return "application/x-www-form-urlencoded;charset=UTF-8";
      } else if (isBlob(body)) {
        return body.type || null;
      } else if (Buffer.isBuffer(body)) {
        return null;
      } else if (Object.prototype.toString.call(body) === "[object ArrayBuffer]") {
        return null;
      } else if (ArrayBuffer.isView(body)) {
        return null;
      } else if (typeof body.getBoundary === "function") {
        return `multipart/form-data;boundary=${body.getBoundary()}`;
      } else if (body instanceof Stream) {
        return null;
      } else {
        return "text/plain;charset=UTF-8";
      }
    }
    function getTotalBytes(instance) {
      const body = instance.body;
      if (body === null) {
        return 0;
      } else if (isBlob(body)) {
        return body.size;
      } else if (Buffer.isBuffer(body)) {
        return body.length;
      } else if (body && typeof body.getLengthSync === "function") {
        if (body._lengthRetrievers && body._lengthRetrievers.length == 0 || body.hasKnownLength && body.hasKnownLength()) {
          return body.getLengthSync();
        }
        return null;
      } else {
        return null;
      }
    }
    function writeToStream(dest, instance) {
      const body = instance.body;
      if (body === null) {
        dest.end();
      } else if (isBlob(body)) {
        body.stream().pipe(dest);
      } else if (Buffer.isBuffer(body)) {
        dest.write(body);
        dest.end();
      } else {
        body.pipe(dest);
      }
    }
    Body.Promise = global.Promise;
    var invalidTokenRegex = /[^\^_`a-zA-Z\-0-9!#$%&'*+.|~]/;
    var invalidHeaderCharRegex = /[^\t\x20-\x7e\x80-\xff]/;
    function validateName(name) {
      name = `${name}`;
      if (invalidTokenRegex.test(name) || name === "") {
        throw new TypeError(`${name} is not a legal HTTP header name`);
      }
    }
    function validateValue(value) {
      value = `${value}`;
      if (invalidHeaderCharRegex.test(value)) {
        throw new TypeError(`${value} is not a legal HTTP header value`);
      }
    }
    function find(map2, name) {
      name = name.toLowerCase();
      for (const key in map2) {
        if (key.toLowerCase() === name) {
          return key;
        }
      }
      return void 0;
    }
    var MAP = Symbol("map");
    var Headers = class {
      constructor() {
        let init = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : void 0;
        this[MAP] = Object.create(null);
        if (init instanceof Headers) {
          const rawHeaders = init.raw();
          const headerNames = Object.keys(rawHeaders);
          for (const headerName of headerNames) {
            for (const value of rawHeaders[headerName]) {
              this.append(headerName, value);
            }
          }
          return;
        }
        if (init == null)
          ;
        else if (typeof init === "object") {
          const method = init[Symbol.iterator];
          if (method != null) {
            if (typeof method !== "function") {
              throw new TypeError("Header pairs must be iterable");
            }
            const pairs2 = [];
            for (const pair of init) {
              if (typeof pair !== "object" || typeof pair[Symbol.iterator] !== "function") {
                throw new TypeError("Each header pair must be iterable");
              }
              pairs2.push(Array.from(pair));
            }
            for (const pair of pairs2) {
              if (pair.length !== 2) {
                throw new TypeError("Each header pair must be a name/value tuple");
              }
              this.append(pair[0], pair[1]);
            }
          } else {
            for (const key of Object.keys(init)) {
              const value = init[key];
              this.append(key, value);
            }
          }
        } else {
          throw new TypeError("Provided initializer must be an object");
        }
      }
      get(name) {
        name = `${name}`;
        validateName(name);
        const key = find(this[MAP], name);
        if (key === void 0) {
          return null;
        }
        return this[MAP][key].join(", ");
      }
      forEach(callback) {
        let thisArg = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : void 0;
        let pairs2 = getHeaders(this);
        let i = 0;
        while (i < pairs2.length) {
          var _pairs$i = pairs2[i];
          const name = _pairs$i[0], value = _pairs$i[1];
          callback.call(thisArg, value, name, this);
          pairs2 = getHeaders(this);
          i++;
        }
      }
      set(name, value) {
        name = `${name}`;
        value = `${value}`;
        validateName(name);
        validateValue(value);
        const key = find(this[MAP], name);
        this[MAP][key !== void 0 ? key : name] = [value];
      }
      append(name, value) {
        name = `${name}`;
        value = `${value}`;
        validateName(name);
        validateValue(value);
        const key = find(this[MAP], name);
        if (key !== void 0) {
          this[MAP][key].push(value);
        } else {
          this[MAP][name] = [value];
        }
      }
      has(name) {
        name = `${name}`;
        validateName(name);
        return find(this[MAP], name) !== void 0;
      }
      delete(name) {
        name = `${name}`;
        validateName(name);
        const key = find(this[MAP], name);
        if (key !== void 0) {
          delete this[MAP][key];
        }
      }
      raw() {
        return this[MAP];
      }
      keys() {
        return createHeadersIterator(this, "key");
      }
      values() {
        return createHeadersIterator(this, "value");
      }
      [Symbol.iterator]() {
        return createHeadersIterator(this, "key+value");
      }
    };
    Headers.prototype.entries = Headers.prototype[Symbol.iterator];
    Object.defineProperty(Headers.prototype, Symbol.toStringTag, {
      value: "Headers",
      writable: false,
      enumerable: false,
      configurable: true
    });
    Object.defineProperties(Headers.prototype, {
      get: { enumerable: true },
      forEach: { enumerable: true },
      set: { enumerable: true },
      append: { enumerable: true },
      has: { enumerable: true },
      delete: { enumerable: true },
      keys: { enumerable: true },
      values: { enumerable: true },
      entries: { enumerable: true }
    });
    function getHeaders(headers) {
      let kind = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : "key+value";
      const keys = Object.keys(headers[MAP]).sort();
      return keys.map(kind === "key" ? function(k) {
        return k.toLowerCase();
      } : kind === "value" ? function(k) {
        return headers[MAP][k].join(", ");
      } : function(k) {
        return [k.toLowerCase(), headers[MAP][k].join(", ")];
      });
    }
    var INTERNAL = Symbol("internal");
    function createHeadersIterator(target, kind) {
      const iterator = Object.create(HeadersIteratorPrototype);
      iterator[INTERNAL] = {
        target,
        kind,
        index: 0
      };
      return iterator;
    }
    var HeadersIteratorPrototype = Object.setPrototypeOf({
      next() {
        if (!this || Object.getPrototypeOf(this) !== HeadersIteratorPrototype) {
          throw new TypeError("Value of `this` is not a HeadersIterator");
        }
        var _INTERNAL = this[INTERNAL];
        const target = _INTERNAL.target, kind = _INTERNAL.kind, index = _INTERNAL.index;
        const values = getHeaders(target, kind);
        const len = values.length;
        if (index >= len) {
          return {
            value: void 0,
            done: true
          };
        }
        this[INTERNAL].index = index + 1;
        return {
          value: values[index],
          done: false
        };
      }
    }, Object.getPrototypeOf(Object.getPrototypeOf([][Symbol.iterator]())));
    Object.defineProperty(HeadersIteratorPrototype, Symbol.toStringTag, {
      value: "HeadersIterator",
      writable: false,
      enumerable: false,
      configurable: true
    });
    function exportNodeCompatibleHeaders(headers) {
      const obj = Object.assign({ __proto__: null }, headers[MAP]);
      const hostHeaderKey = find(headers[MAP], "Host");
      if (hostHeaderKey !== void 0) {
        obj[hostHeaderKey] = obj[hostHeaderKey][0];
      }
      return obj;
    }
    function createHeadersLenient(obj) {
      const headers = new Headers();
      for (const name of Object.keys(obj)) {
        if (invalidTokenRegex.test(name)) {
          continue;
        }
        if (Array.isArray(obj[name])) {
          for (const val of obj[name]) {
            if (invalidHeaderCharRegex.test(val)) {
              continue;
            }
            if (headers[MAP][name] === void 0) {
              headers[MAP][name] = [val];
            } else {
              headers[MAP][name].push(val);
            }
          }
        } else if (!invalidHeaderCharRegex.test(obj[name])) {
          headers[MAP][name] = [obj[name]];
        }
      }
      return headers;
    }
    var INTERNALS$1 = Symbol("Response internals");
    var STATUS_CODES = http.STATUS_CODES;
    var Response = class {
      constructor() {
        let body = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : null;
        let opts = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
        Body.call(this, body, opts);
        const status = opts.status || 200;
        const headers = new Headers(opts.headers);
        if (body != null && !headers.has("Content-Type")) {
          const contentType = extractContentType(body);
          if (contentType) {
            headers.append("Content-Type", contentType);
          }
        }
        this[INTERNALS$1] = {
          url: opts.url,
          status,
          statusText: opts.statusText || STATUS_CODES[status],
          headers,
          counter: opts.counter
        };
      }
      get url() {
        return this[INTERNALS$1].url || "";
      }
      get status() {
        return this[INTERNALS$1].status;
      }
      get ok() {
        return this[INTERNALS$1].status >= 200 && this[INTERNALS$1].status < 300;
      }
      get redirected() {
        return this[INTERNALS$1].counter > 0;
      }
      get statusText() {
        return this[INTERNALS$1].statusText;
      }
      get headers() {
        return this[INTERNALS$1].headers;
      }
      clone() {
        return new Response(clone(this), {
          url: this.url,
          status: this.status,
          statusText: this.statusText,
          headers: this.headers,
          ok: this.ok,
          redirected: this.redirected
        });
      }
    };
    Body.mixIn(Response.prototype);
    Object.defineProperties(Response.prototype, {
      url: { enumerable: true },
      status: { enumerable: true },
      ok: { enumerable: true },
      redirected: { enumerable: true },
      statusText: { enumerable: true },
      headers: { enumerable: true },
      clone: { enumerable: true }
    });
    Object.defineProperty(Response.prototype, Symbol.toStringTag, {
      value: "Response",
      writable: false,
      enumerable: false,
      configurable: true
    });
    var INTERNALS$2 = Symbol("Request internals");
    var parse_url = Url.parse;
    var format_url = Url.format;
    var streamDestructionSupported = "destroy" in Stream.Readable.prototype;
    function isRequest(input) {
      return typeof input === "object" && typeof input[INTERNALS$2] === "object";
    }
    function isAbortSignal(signal) {
      const proto = signal && typeof signal === "object" && Object.getPrototypeOf(signal);
      return !!(proto && proto.constructor.name === "AbortSignal");
    }
    var Request = class {
      constructor(input) {
        let init = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
        let parsedURL;
        if (!isRequest(input)) {
          if (input && input.href) {
            parsedURL = parse_url(input.href);
          } else {
            parsedURL = parse_url(`${input}`);
          }
          input = {};
        } else {
          parsedURL = parse_url(input.url);
        }
        let method = init.method || input.method || "GET";
        method = method.toUpperCase();
        if ((init.body != null || isRequest(input) && input.body !== null) && (method === "GET" || method === "HEAD")) {
          throw new TypeError("Request with GET/HEAD method cannot have body");
        }
        let inputBody = init.body != null ? init.body : isRequest(input) && input.body !== null ? clone(input) : null;
        Body.call(this, inputBody, {
          timeout: init.timeout || input.timeout || 0,
          size: init.size || input.size || 0
        });
        const headers = new Headers(init.headers || input.headers || {});
        if (inputBody != null && !headers.has("Content-Type")) {
          const contentType = extractContentType(inputBody);
          if (contentType) {
            headers.append("Content-Type", contentType);
          }
        }
        let signal = isRequest(input) ? input.signal : null;
        if ("signal" in init)
          signal = init.signal;
        if (signal != null && !isAbortSignal(signal)) {
          throw new TypeError("Expected signal to be an instanceof AbortSignal");
        }
        this[INTERNALS$2] = {
          method,
          redirect: init.redirect || input.redirect || "follow",
          headers,
          parsedURL,
          signal
        };
        this.follow = init.follow !== void 0 ? init.follow : input.follow !== void 0 ? input.follow : 20;
        this.compress = init.compress !== void 0 ? init.compress : input.compress !== void 0 ? input.compress : true;
        this.counter = init.counter || input.counter || 0;
        this.agent = init.agent || input.agent;
      }
      get method() {
        return this[INTERNALS$2].method;
      }
      get url() {
        return format_url(this[INTERNALS$2].parsedURL);
      }
      get headers() {
        return this[INTERNALS$2].headers;
      }
      get redirect() {
        return this[INTERNALS$2].redirect;
      }
      get signal() {
        return this[INTERNALS$2].signal;
      }
      clone() {
        return new Request(this);
      }
    };
    Body.mixIn(Request.prototype);
    Object.defineProperty(Request.prototype, Symbol.toStringTag, {
      value: "Request",
      writable: false,
      enumerable: false,
      configurable: true
    });
    Object.defineProperties(Request.prototype, {
      method: { enumerable: true },
      url: { enumerable: true },
      headers: { enumerable: true },
      redirect: { enumerable: true },
      clone: { enumerable: true },
      signal: { enumerable: true }
    });
    function getNodeRequestOptions(request) {
      const parsedURL = request[INTERNALS$2].parsedURL;
      const headers = new Headers(request[INTERNALS$2].headers);
      if (!headers.has("Accept")) {
        headers.set("Accept", "*/*");
      }
      if (!parsedURL.protocol || !parsedURL.hostname) {
        throw new TypeError("Only absolute URLs are supported");
      }
      if (!/^https?:$/.test(parsedURL.protocol)) {
        throw new TypeError("Only HTTP(S) protocols are supported");
      }
      if (request.signal && request.body instanceof Stream.Readable && !streamDestructionSupported) {
        throw new Error("Cancellation of streamed requests with AbortSignal is not supported in node < 8");
      }
      let contentLengthValue = null;
      if (request.body == null && /^(POST|PUT)$/i.test(request.method)) {
        contentLengthValue = "0";
      }
      if (request.body != null) {
        const totalBytes = getTotalBytes(request);
        if (typeof totalBytes === "number") {
          contentLengthValue = String(totalBytes);
        }
      }
      if (contentLengthValue) {
        headers.set("Content-Length", contentLengthValue);
      }
      if (!headers.has("User-Agent")) {
        headers.set("User-Agent", "node-fetch/1.0 (+https://github.com/bitinn/node-fetch)");
      }
      if (request.compress && !headers.has("Accept-Encoding")) {
        headers.set("Accept-Encoding", "gzip,deflate");
      }
      let agent = request.agent;
      if (typeof agent === "function") {
        agent = agent(parsedURL);
      }
      if (!headers.has("Connection") && !agent) {
        headers.set("Connection", "close");
      }
      return Object.assign({}, parsedURL, {
        method: request.method,
        headers: exportNodeCompatibleHeaders(headers),
        agent
      });
    }
    function AbortError(message) {
      Error.call(this, message);
      this.type = "aborted";
      this.message = message;
      Error.captureStackTrace(this, this.constructor);
    }
    AbortError.prototype = Object.create(Error.prototype);
    AbortError.prototype.constructor = AbortError;
    AbortError.prototype.name = "AbortError";
    var PassThrough$1 = Stream.PassThrough;
    var resolve_url = Url.resolve;
    function fetch(url, opts) {
      if (!fetch.Promise) {
        throw new Error("native promise missing, set fetch.Promise to your favorite alternative");
      }
      Body.Promise = fetch.Promise;
      return new fetch.Promise(function(resolve2, reject) {
        const request = new Request(url, opts);
        const options = getNodeRequestOptions(request);
        const send = (options.protocol === "https:" ? https : http).request;
        const signal = request.signal;
        let response = null;
        const abort = function abort2() {
          let error = new AbortError("The user aborted a request.");
          reject(error);
          if (request.body && request.body instanceof Stream.Readable) {
            request.body.destroy(error);
          }
          if (!response || !response.body)
            return;
          response.body.emit("error", error);
        };
        if (signal && signal.aborted) {
          abort();
          return;
        }
        const abortAndFinalize = function abortAndFinalize2() {
          abort();
          finalize();
        };
        const req = send(options);
        let reqTimeout;
        if (signal) {
          signal.addEventListener("abort", abortAndFinalize);
        }
        function finalize() {
          req.abort();
          if (signal)
            signal.removeEventListener("abort", abortAndFinalize);
          clearTimeout(reqTimeout);
        }
        if (request.timeout) {
          req.once("socket", function(socket) {
            reqTimeout = setTimeout(function() {
              reject(new FetchError(`network timeout at: ${request.url}`, "request-timeout"));
              finalize();
            }, request.timeout);
          });
        }
        req.on("error", function(err) {
          reject(new FetchError(`request to ${request.url} failed, reason: ${err.message}`, "system", err));
          finalize();
        });
        req.on("response", function(res) {
          clearTimeout(reqTimeout);
          const headers = createHeadersLenient(res.headers);
          if (fetch.isRedirect(res.statusCode)) {
            const location = headers.get("Location");
            const locationURL = location === null ? null : resolve_url(request.url, location);
            switch (request.redirect) {
              case "error":
                reject(new FetchError(`uri requested responds with a redirect, redirect mode is set to error: ${request.url}`, "no-redirect"));
                finalize();
                return;
              case "manual":
                if (locationURL !== null) {
                  try {
                    headers.set("Location", locationURL);
                  } catch (err) {
                    reject(err);
                  }
                }
                break;
              case "follow":
                if (locationURL === null) {
                  break;
                }
                if (request.counter >= request.follow) {
                  reject(new FetchError(`maximum redirect reached at: ${request.url}`, "max-redirect"));
                  finalize();
                  return;
                }
                const requestOpts = {
                  headers: new Headers(request.headers),
                  follow: request.follow,
                  counter: request.counter + 1,
                  agent: request.agent,
                  compress: request.compress,
                  method: request.method,
                  body: request.body,
                  signal: request.signal,
                  timeout: request.timeout,
                  size: request.size
                };
                if (res.statusCode !== 303 && request.body && getTotalBytes(request) === null) {
                  reject(new FetchError("Cannot follow redirect with body being a readable stream", "unsupported-redirect"));
                  finalize();
                  return;
                }
                if (res.statusCode === 303 || (res.statusCode === 301 || res.statusCode === 302) && request.method === "POST") {
                  requestOpts.method = "GET";
                  requestOpts.body = void 0;
                  requestOpts.headers.delete("content-length");
                }
                resolve2(fetch(new Request(locationURL, requestOpts)));
                finalize();
                return;
            }
          }
          res.once("end", function() {
            if (signal)
              signal.removeEventListener("abort", abortAndFinalize);
          });
          let body = res.pipe(new PassThrough$1());
          const response_options = {
            url: request.url,
            status: res.statusCode,
            statusText: res.statusMessage,
            headers,
            size: request.size,
            timeout: request.timeout,
            counter: request.counter
          };
          const codings = headers.get("Content-Encoding");
          if (!request.compress || request.method === "HEAD" || codings === null || res.statusCode === 204 || res.statusCode === 304) {
            response = new Response(body, response_options);
            resolve2(response);
            return;
          }
          const zlibOptions = {
            flush: zlib.Z_SYNC_FLUSH,
            finishFlush: zlib.Z_SYNC_FLUSH
          };
          if (codings == "gzip" || codings == "x-gzip") {
            body = body.pipe(zlib.createGunzip(zlibOptions));
            response = new Response(body, response_options);
            resolve2(response);
            return;
          }
          if (codings == "deflate" || codings == "x-deflate") {
            const raw = res.pipe(new PassThrough$1());
            raw.once("data", function(chunk) {
              if ((chunk[0] & 15) === 8) {
                body = body.pipe(zlib.createInflate());
              } else {
                body = body.pipe(zlib.createInflateRaw());
              }
              response = new Response(body, response_options);
              resolve2(response);
            });
            return;
          }
          if (codings == "br" && typeof zlib.createBrotliDecompress === "function") {
            body = body.pipe(zlib.createBrotliDecompress());
            response = new Response(body, response_options);
            resolve2(response);
            return;
          }
          response = new Response(body, response_options);
          resolve2(response);
        });
        writeToStream(req, request);
      });
    }
    fetch.isRedirect = function(code) {
      return code === 301 || code === 302 || code === 303 || code === 307 || code === 308;
    };
    fetch.Promise = global.Promise;
    module2.exports = exports2 = fetch;
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.default = exports2;
    exports2.Headers = Headers;
    exports2.Request = Request;
    exports2.Response = Response;
    exports2.FetchError = FetchError;
  }
});

// node_modules/deprecation/dist-node/index.js
var require_dist_node3 = __commonJS({
  "node_modules/deprecation/dist-node/index.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    var Deprecation = class extends Error {
      constructor(message) {
        super(message);
        if (Error.captureStackTrace) {
          Error.captureStackTrace(this, this.constructor);
        }
        this.name = "Deprecation";
      }
    };
    exports2.Deprecation = Deprecation;
  }
});

// node_modules/wrappy/wrappy.js
var require_wrappy = __commonJS({
  "node_modules/wrappy/wrappy.js"(exports2, module2) {
    module2.exports = wrappy;
    function wrappy(fn, cb) {
      if (fn && cb)
        return wrappy(fn)(cb);
      if (typeof fn !== "function")
        throw new TypeError("need wrapper function");
      Object.keys(fn).forEach(function(k) {
        wrapper[k] = fn[k];
      });
      return wrapper;
      function wrapper() {
        var args = new Array(arguments.length);
        for (var i = 0; i < args.length; i++) {
          args[i] = arguments[i];
        }
        var ret = fn.apply(this, args);
        var cb2 = args[args.length - 1];
        if (typeof ret === "function" && ret !== cb2) {
          Object.keys(cb2).forEach(function(k) {
            ret[k] = cb2[k];
          });
        }
        return ret;
      }
    }
  }
});

// node_modules/once/once.js
var require_once = __commonJS({
  "node_modules/once/once.js"(exports2, module2) {
    var wrappy = require_wrappy();
    module2.exports = wrappy(once);
    module2.exports.strict = wrappy(onceStrict);
    once.proto = once(function() {
      Object.defineProperty(Function.prototype, "once", {
        value: function() {
          return once(this);
        },
        configurable: true
      });
      Object.defineProperty(Function.prototype, "onceStrict", {
        value: function() {
          return onceStrict(this);
        },
        configurable: true
      });
    });
    function once(fn) {
      var f = function() {
        if (f.called)
          return f.value;
        f.called = true;
        return f.value = fn.apply(this, arguments);
      };
      f.called = false;
      return f;
    }
    function onceStrict(fn) {
      var f = function() {
        if (f.called)
          throw new Error(f.onceError);
        f.called = true;
        return f.value = fn.apply(this, arguments);
      };
      var name = fn.name || "Function wrapped with `once`";
      f.onceError = name + " shouldn't be called more than once";
      f.called = false;
      return f;
    }
  }
});

// node_modules/@octokit/request-error/dist-node/index.js
var require_dist_node4 = __commonJS({
  "node_modules/@octokit/request-error/dist-node/index.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    function _interopDefault(ex) {
      return ex && typeof ex === "object" && "default" in ex ? ex["default"] : ex;
    }
    var deprecation = require_dist_node3();
    var once = _interopDefault(require_once());
    var logOnceCode = once((deprecation2) => console.warn(deprecation2));
    var logOnceHeaders = once((deprecation2) => console.warn(deprecation2));
    var RequestError = class extends Error {
      constructor(message, statusCode, options) {
        super(message);
        if (Error.captureStackTrace) {
          Error.captureStackTrace(this, this.constructor);
        }
        this.name = "HttpError";
        this.status = statusCode;
        let headers;
        if ("headers" in options && typeof options.headers !== "undefined") {
          headers = options.headers;
        }
        if ("response" in options) {
          this.response = options.response;
          headers = options.response.headers;
        }
        const requestCopy = Object.assign({}, options.request);
        if (options.request.headers.authorization) {
          requestCopy.headers = Object.assign({}, options.request.headers, {
            authorization: options.request.headers.authorization.replace(/ .*$/, " [REDACTED]")
          });
        }
        requestCopy.url = requestCopy.url.replace(/\bclient_secret=\w+/g, "client_secret=[REDACTED]").replace(/\baccess_token=\w+/g, "access_token=[REDACTED]");
        this.request = requestCopy;
        Object.defineProperty(this, "code", {
          get() {
            logOnceCode(new deprecation.Deprecation("[@octokit/request-error] `error.code` is deprecated, use `error.status`."));
            return statusCode;
          }
        });
        Object.defineProperty(this, "headers", {
          get() {
            logOnceHeaders(new deprecation.Deprecation("[@octokit/request-error] `error.headers` is deprecated, use `error.response.headers`."));
            return headers || {};
          }
        });
      }
    };
    exports2.RequestError = RequestError;
  }
});

// node_modules/@octokit/request/dist-node/index.js
var require_dist_node5 = __commonJS({
  "node_modules/@octokit/request/dist-node/index.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    function _interopDefault(ex) {
      return ex && typeof ex === "object" && "default" in ex ? ex["default"] : ex;
    }
    var endpoint = require_dist_node2();
    var universalUserAgent = require_dist_node();
    var isPlainObject = require_is_plain_object();
    var nodeFetch = _interopDefault(require_lib());
    var requestError = require_dist_node4();
    var VERSION = "5.6.0";
    function getBufferResponse(response) {
      return response.arrayBuffer();
    }
    function fetchWrapper(requestOptions) {
      const log = requestOptions.request && requestOptions.request.log ? requestOptions.request.log : console;
      if (isPlainObject.isPlainObject(requestOptions.body) || Array.isArray(requestOptions.body)) {
        requestOptions.body = JSON.stringify(requestOptions.body);
      }
      let headers = {};
      let status;
      let url;
      const fetch = requestOptions.request && requestOptions.request.fetch || nodeFetch;
      return fetch(requestOptions.url, Object.assign({
        method: requestOptions.method,
        body: requestOptions.body,
        headers: requestOptions.headers,
        redirect: requestOptions.redirect
      }, requestOptions.request)).then(async (response) => {
        url = response.url;
        status = response.status;
        for (const keyAndValue of response.headers) {
          headers[keyAndValue[0]] = keyAndValue[1];
        }
        if ("deprecation" in headers) {
          const matches = headers.link && headers.link.match(/<([^>]+)>; rel="deprecation"/);
          const deprecationLink = matches && matches.pop();
          log.warn(`[@octokit/request] "${requestOptions.method} ${requestOptions.url}" is deprecated. It is scheduled to be removed on ${headers.sunset}${deprecationLink ? `. See ${deprecationLink}` : ""}`);
        }
        if (status === 204 || status === 205) {
          return;
        }
        if (requestOptions.method === "HEAD") {
          if (status < 400) {
            return;
          }
          throw new requestError.RequestError(response.statusText, status, {
            response: {
              url,
              status,
              headers,
              data: void 0
            },
            request: requestOptions
          });
        }
        if (status === 304) {
          throw new requestError.RequestError("Not modified", status, {
            response: {
              url,
              status,
              headers,
              data: await getResponseData(response)
            },
            request: requestOptions
          });
        }
        if (status >= 400) {
          const data = await getResponseData(response);
          const error = new requestError.RequestError(toErrorMessage(data), status, {
            response: {
              url,
              status,
              headers,
              data
            },
            request: requestOptions
          });
          throw error;
        }
        return getResponseData(response);
      }).then((data) => {
        return {
          status,
          url,
          headers,
          data
        };
      }).catch((error) => {
        if (error instanceof requestError.RequestError)
          throw error;
        throw new requestError.RequestError(error.message, 500, {
          request: requestOptions
        });
      });
    }
    async function getResponseData(response) {
      const contentType = response.headers.get("content-type");
      if (/application\/json/.test(contentType)) {
        return response.json();
      }
      if (!contentType || /^text\/|charset=utf-8$/.test(contentType)) {
        return response.text();
      }
      return getBufferResponse(response);
    }
    function toErrorMessage(data) {
      if (typeof data === "string")
        return data;
      if ("message" in data) {
        if (Array.isArray(data.errors)) {
          return `${data.message}: ${data.errors.map(JSON.stringify).join(", ")}`;
        }
        return data.message;
      }
      return `Unknown error: ${JSON.stringify(data)}`;
    }
    function withDefaults(oldEndpoint, newDefaults) {
      const endpoint2 = oldEndpoint.defaults(newDefaults);
      const newApi = function(route, parameters) {
        const endpointOptions = endpoint2.merge(route, parameters);
        if (!endpointOptions.request || !endpointOptions.request.hook) {
          return fetchWrapper(endpoint2.parse(endpointOptions));
        }
        const request2 = (route2, parameters2) => {
          return fetchWrapper(endpoint2.parse(endpoint2.merge(route2, parameters2)));
        };
        Object.assign(request2, {
          endpoint: endpoint2,
          defaults: withDefaults.bind(null, endpoint2)
        });
        return endpointOptions.request.hook(request2, endpointOptions);
      };
      return Object.assign(newApi, {
        endpoint: endpoint2,
        defaults: withDefaults.bind(null, endpoint2)
      });
    }
    var request = withDefaults(endpoint.endpoint, {
      headers: {
        "user-agent": `octokit-request.js/${VERSION} ${universalUserAgent.getUserAgent()}`
      }
    });
    exports2.request = request;
  }
});

// node_modules/@octokit/core/node_modules/@octokit/graphql/dist-node/index.js
var require_dist_node6 = __commonJS({
  "node_modules/@octokit/core/node_modules/@octokit/graphql/dist-node/index.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    var request = require_dist_node5();
    var universalUserAgent = require_dist_node();
    var VERSION = "4.6.0";
    var GraphqlError = class extends Error {
      constructor(request2, response) {
        const message = response.data.errors[0].message;
        super(message);
        Object.assign(this, response.data);
        Object.assign(this, {
          headers: response.headers
        });
        this.name = "GraphqlError";
        this.request = request2;
        if (Error.captureStackTrace) {
          Error.captureStackTrace(this, this.constructor);
        }
      }
    };
    var NON_VARIABLE_OPTIONS = ["method", "baseUrl", "url", "headers", "request", "query", "mediaType"];
    var GHES_V3_SUFFIX_REGEX = /\/api\/v3\/?$/;
    function graphql(request2, query, options) {
      if (typeof query === "string" && options && "query" in options) {
        return Promise.reject(new Error(`[@octokit/graphql] "query" cannot be used as variable name`));
      }
      const parsedOptions = typeof query === "string" ? Object.assign({
        query
      }, options) : query;
      const requestOptions = Object.keys(parsedOptions).reduce((result, key) => {
        if (NON_VARIABLE_OPTIONS.includes(key)) {
          result[key] = parsedOptions[key];
          return result;
        }
        if (!result.variables) {
          result.variables = {};
        }
        result.variables[key] = parsedOptions[key];
        return result;
      }, {});
      const baseUrl = parsedOptions.baseUrl || request2.endpoint.DEFAULTS.baseUrl;
      if (GHES_V3_SUFFIX_REGEX.test(baseUrl)) {
        requestOptions.url = baseUrl.replace(GHES_V3_SUFFIX_REGEX, "/api/graphql");
      }
      return request2(requestOptions).then((response) => {
        if (response.data.errors) {
          const headers = {};
          for (const key of Object.keys(response.headers)) {
            headers[key] = response.headers[key];
          }
          throw new GraphqlError(requestOptions, {
            headers,
            data: response.data
          });
        }
        return response.data.data;
      });
    }
    function withDefaults(request$1, newDefaults) {
      const newRequest = request$1.defaults(newDefaults);
      const newApi = (query, options) => {
        return graphql(newRequest, query, options);
      };
      return Object.assign(newApi, {
        defaults: withDefaults.bind(null, newRequest),
        endpoint: request.request.endpoint
      });
    }
    var graphql$1 = withDefaults(request.request, {
      headers: {
        "user-agent": `octokit-graphql.js/${VERSION} ${universalUserAgent.getUserAgent()}`
      },
      method: "POST",
      url: "/graphql"
    });
    function withCustomRequest(customRequest) {
      return withDefaults(customRequest, {
        method: "POST",
        url: "/graphql"
      });
    }
    exports2.graphql = graphql$1;
    exports2.withCustomRequest = withCustomRequest;
  }
});

// node_modules/@octokit/auth-token/dist-node/index.js
var require_dist_node7 = __commonJS({
  "node_modules/@octokit/auth-token/dist-node/index.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    async function auth(token) {
      const tokenType = token.split(/\./).length === 3 ? "app" : /^v\d+\./.test(token) ? "installation" : "oauth";
      return {
        type: "token",
        token,
        tokenType
      };
    }
    function withAuthorizationPrefix(token) {
      if (token.split(/\./).length === 3) {
        return `bearer ${token}`;
      }
      return `token ${token}`;
    }
    async function hook(token, request, route, parameters) {
      const endpoint = request.endpoint.merge(route, parameters);
      endpoint.headers.authorization = withAuthorizationPrefix(token);
      return request(endpoint);
    }
    var createTokenAuth = function createTokenAuth2(token) {
      if (!token) {
        throw new Error("[@octokit/auth-token] No token passed to createTokenAuth");
      }
      if (typeof token !== "string") {
        throw new Error("[@octokit/auth-token] Token passed to createTokenAuth is not a string");
      }
      token = token.replace(/^(token|bearer) +/i, "");
      return Object.assign(auth.bind(null, token), {
        hook: hook.bind(null, token)
      });
    };
    exports2.createTokenAuth = createTokenAuth;
  }
});

// node_modules/@octokit/core/dist-node/index.js
var require_dist_node8 = __commonJS({
  "node_modules/@octokit/core/dist-node/index.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    var universalUserAgent = require_dist_node();
    var beforeAfterHook = require_before_after_hook();
    var request = require_dist_node5();
    var graphql = require_dist_node6();
    var authToken = require_dist_node7();
    function _objectWithoutPropertiesLoose(source, excluded) {
      if (source == null)
        return {};
      var target = {};
      var sourceKeys = Object.keys(source);
      var key, i;
      for (i = 0; i < sourceKeys.length; i++) {
        key = sourceKeys[i];
        if (excluded.indexOf(key) >= 0)
          continue;
        target[key] = source[key];
      }
      return target;
    }
    function _objectWithoutProperties(source, excluded) {
      if (source == null)
        return {};
      var target = _objectWithoutPropertiesLoose(source, excluded);
      var key, i;
      if (Object.getOwnPropertySymbols) {
        var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
        for (i = 0; i < sourceSymbolKeys.length; i++) {
          key = sourceSymbolKeys[i];
          if (excluded.indexOf(key) >= 0)
            continue;
          if (!Object.prototype.propertyIsEnumerable.call(source, key))
            continue;
          target[key] = source[key];
        }
      }
      return target;
    }
    var VERSION = "3.5.1";
    var _excluded = ["authStrategy"];
    var Octokit = class {
      constructor(options = {}) {
        const hook = new beforeAfterHook.Collection();
        const requestDefaults = {
          baseUrl: request.request.endpoint.DEFAULTS.baseUrl,
          headers: {},
          request: Object.assign({}, options.request, {
            hook: hook.bind(null, "request")
          }),
          mediaType: {
            previews: [],
            format: ""
          }
        };
        requestDefaults.headers["user-agent"] = [options.userAgent, `octokit-core.js/${VERSION} ${universalUserAgent.getUserAgent()}`].filter(Boolean).join(" ");
        if (options.baseUrl) {
          requestDefaults.baseUrl = options.baseUrl;
        }
        if (options.previews) {
          requestDefaults.mediaType.previews = options.previews;
        }
        if (options.timeZone) {
          requestDefaults.headers["time-zone"] = options.timeZone;
        }
        this.request = request.request.defaults(requestDefaults);
        this.graphql = graphql.withCustomRequest(this.request).defaults(requestDefaults);
        this.log = Object.assign({
          debug: () => {
          },
          info: () => {
          },
          warn: console.warn.bind(console),
          error: console.error.bind(console)
        }, options.log);
        this.hook = hook;
        if (!options.authStrategy) {
          if (!options.auth) {
            this.auth = async () => ({
              type: "unauthenticated"
            });
          } else {
            const auth = authToken.createTokenAuth(options.auth);
            hook.wrap("request", auth.hook);
            this.auth = auth;
          }
        } else {
          const {
            authStrategy
          } = options, otherOptions = _objectWithoutProperties(options, _excluded);
          const auth = authStrategy(Object.assign({
            request: this.request,
            log: this.log,
            octokit: this,
            octokitOptions: otherOptions
          }, options.auth));
          hook.wrap("request", auth.hook);
          this.auth = auth;
        }
        const classConstructor = this.constructor;
        classConstructor.plugins.forEach((plugin) => {
          Object.assign(this, plugin(this, options));
        });
      }
      static defaults(defaults) {
        const OctokitWithDefaults = class extends this {
          constructor(...args) {
            const options = args[0] || {};
            if (typeof defaults === "function") {
              super(defaults(options));
              return;
            }
            super(Object.assign({}, defaults, options, options.userAgent && defaults.userAgent ? {
              userAgent: `${options.userAgent} ${defaults.userAgent}`
            } : null));
          }
        };
        return OctokitWithDefaults;
      }
      static plugin(...newPlugins) {
        var _a;
        const currentPlugins = this.plugins;
        const NewOctokit = (_a = class extends this {
        }, _a.plugins = currentPlugins.concat(newPlugins.filter((plugin) => !currentPlugins.includes(plugin))), _a);
        return NewOctokit;
      }
    };
    Octokit.VERSION = VERSION;
    Octokit.plugins = [];
    exports2.Octokit = Octokit;
  }
});

// node_modules/@octokit/plugin-rest-endpoint-methods/dist-node/index.js
var require_dist_node9 = __commonJS({
  "node_modules/@octokit/plugin-rest-endpoint-methods/dist-node/index.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    function ownKeys(object, enumerableOnly) {
      var keys = Object.keys(object);
      if (Object.getOwnPropertySymbols) {
        var symbols = Object.getOwnPropertySymbols(object);
        if (enumerableOnly) {
          symbols = symbols.filter(function(sym) {
            return Object.getOwnPropertyDescriptor(object, sym).enumerable;
          });
        }
        keys.push.apply(keys, symbols);
      }
      return keys;
    }
    function _objectSpread2(target) {
      for (var i = 1; i < arguments.length; i++) {
        var source = arguments[i] != null ? arguments[i] : {};
        if (i % 2) {
          ownKeys(Object(source), true).forEach(function(key) {
            _defineProperty(target, key, source[key]);
          });
        } else if (Object.getOwnPropertyDescriptors) {
          Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
        } else {
          ownKeys(Object(source)).forEach(function(key) {
            Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
          });
        }
      }
      return target;
    }
    function _defineProperty(obj, key, value) {
      if (key in obj) {
        Object.defineProperty(obj, key, {
          value,
          enumerable: true,
          configurable: true,
          writable: true
        });
      } else {
        obj[key] = value;
      }
      return obj;
    }
    var Endpoints = {
      actions: {
        addSelectedRepoToOrgSecret: ["PUT /orgs/{org}/actions/secrets/{secret_name}/repositories/{repository_id}"],
        approveWorkflowRun: ["POST /repos/{owner}/{repo}/actions/runs/{run_id}/approve"],
        cancelWorkflowRun: ["POST /repos/{owner}/{repo}/actions/runs/{run_id}/cancel"],
        createOrUpdateEnvironmentSecret: ["PUT /repositories/{repository_id}/environments/{environment_name}/secrets/{secret_name}"],
        createOrUpdateOrgSecret: ["PUT /orgs/{org}/actions/secrets/{secret_name}"],
        createOrUpdateRepoSecret: ["PUT /repos/{owner}/{repo}/actions/secrets/{secret_name}"],
        createRegistrationTokenForOrg: ["POST /orgs/{org}/actions/runners/registration-token"],
        createRegistrationTokenForRepo: ["POST /repos/{owner}/{repo}/actions/runners/registration-token"],
        createRemoveTokenForOrg: ["POST /orgs/{org}/actions/runners/remove-token"],
        createRemoveTokenForRepo: ["POST /repos/{owner}/{repo}/actions/runners/remove-token"],
        createWorkflowDispatch: ["POST /repos/{owner}/{repo}/actions/workflows/{workflow_id}/dispatches"],
        deleteArtifact: ["DELETE /repos/{owner}/{repo}/actions/artifacts/{artifact_id}"],
        deleteEnvironmentSecret: ["DELETE /repositories/{repository_id}/environments/{environment_name}/secrets/{secret_name}"],
        deleteOrgSecret: ["DELETE /orgs/{org}/actions/secrets/{secret_name}"],
        deleteRepoSecret: ["DELETE /repos/{owner}/{repo}/actions/secrets/{secret_name}"],
        deleteSelfHostedRunnerFromOrg: ["DELETE /orgs/{org}/actions/runners/{runner_id}"],
        deleteSelfHostedRunnerFromRepo: ["DELETE /repos/{owner}/{repo}/actions/runners/{runner_id}"],
        deleteWorkflowRun: ["DELETE /repos/{owner}/{repo}/actions/runs/{run_id}"],
        deleteWorkflowRunLogs: ["DELETE /repos/{owner}/{repo}/actions/runs/{run_id}/logs"],
        disableSelectedRepositoryGithubActionsOrganization: ["DELETE /orgs/{org}/actions/permissions/repositories/{repository_id}"],
        disableWorkflow: ["PUT /repos/{owner}/{repo}/actions/workflows/{workflow_id}/disable"],
        downloadArtifact: ["GET /repos/{owner}/{repo}/actions/artifacts/{artifact_id}/{archive_format}"],
        downloadJobLogsForWorkflowRun: ["GET /repos/{owner}/{repo}/actions/jobs/{job_id}/logs"],
        downloadWorkflowRunLogs: ["GET /repos/{owner}/{repo}/actions/runs/{run_id}/logs"],
        enableSelectedRepositoryGithubActionsOrganization: ["PUT /orgs/{org}/actions/permissions/repositories/{repository_id}"],
        enableWorkflow: ["PUT /repos/{owner}/{repo}/actions/workflows/{workflow_id}/enable"],
        getAllowedActionsOrganization: ["GET /orgs/{org}/actions/permissions/selected-actions"],
        getAllowedActionsRepository: ["GET /repos/{owner}/{repo}/actions/permissions/selected-actions"],
        getArtifact: ["GET /repos/{owner}/{repo}/actions/artifacts/{artifact_id}"],
        getEnvironmentPublicKey: ["GET /repositories/{repository_id}/environments/{environment_name}/secrets/public-key"],
        getEnvironmentSecret: ["GET /repositories/{repository_id}/environments/{environment_name}/secrets/{secret_name}"],
        getGithubActionsPermissionsOrganization: ["GET /orgs/{org}/actions/permissions"],
        getGithubActionsPermissionsRepository: ["GET /repos/{owner}/{repo}/actions/permissions"],
        getJobForWorkflowRun: ["GET /repos/{owner}/{repo}/actions/jobs/{job_id}"],
        getOrgPublicKey: ["GET /orgs/{org}/actions/secrets/public-key"],
        getOrgSecret: ["GET /orgs/{org}/actions/secrets/{secret_name}"],
        getPendingDeploymentsForRun: ["GET /repos/{owner}/{repo}/actions/runs/{run_id}/pending_deployments"],
        getRepoPermissions: ["GET /repos/{owner}/{repo}/actions/permissions", {}, {
          renamed: ["actions", "getGithubActionsPermissionsRepository"]
        }],
        getRepoPublicKey: ["GET /repos/{owner}/{repo}/actions/secrets/public-key"],
        getRepoSecret: ["GET /repos/{owner}/{repo}/actions/secrets/{secret_name}"],
        getReviewsForRun: ["GET /repos/{owner}/{repo}/actions/runs/{run_id}/approvals"],
        getSelfHostedRunnerForOrg: ["GET /orgs/{org}/actions/runners/{runner_id}"],
        getSelfHostedRunnerForRepo: ["GET /repos/{owner}/{repo}/actions/runners/{runner_id}"],
        getWorkflow: ["GET /repos/{owner}/{repo}/actions/workflows/{workflow_id}"],
        getWorkflowRun: ["GET /repos/{owner}/{repo}/actions/runs/{run_id}"],
        getWorkflowRunUsage: ["GET /repos/{owner}/{repo}/actions/runs/{run_id}/timing"],
        getWorkflowUsage: ["GET /repos/{owner}/{repo}/actions/workflows/{workflow_id}/timing"],
        listArtifactsForRepo: ["GET /repos/{owner}/{repo}/actions/artifacts"],
        listEnvironmentSecrets: ["GET /repositories/{repository_id}/environments/{environment_name}/secrets"],
        listJobsForWorkflowRun: ["GET /repos/{owner}/{repo}/actions/runs/{run_id}/jobs"],
        listOrgSecrets: ["GET /orgs/{org}/actions/secrets"],
        listRepoSecrets: ["GET /repos/{owner}/{repo}/actions/secrets"],
        listRepoWorkflows: ["GET /repos/{owner}/{repo}/actions/workflows"],
        listRunnerApplicationsForOrg: ["GET /orgs/{org}/actions/runners/downloads"],
        listRunnerApplicationsForRepo: ["GET /repos/{owner}/{repo}/actions/runners/downloads"],
        listSelectedReposForOrgSecret: ["GET /orgs/{org}/actions/secrets/{secret_name}/repositories"],
        listSelectedRepositoriesEnabledGithubActionsOrganization: ["GET /orgs/{org}/actions/permissions/repositories"],
        listSelfHostedRunnersForOrg: ["GET /orgs/{org}/actions/runners"],
        listSelfHostedRunnersForRepo: ["GET /repos/{owner}/{repo}/actions/runners"],
        listWorkflowRunArtifacts: ["GET /repos/{owner}/{repo}/actions/runs/{run_id}/artifacts"],
        listWorkflowRuns: ["GET /repos/{owner}/{repo}/actions/workflows/{workflow_id}/runs"],
        listWorkflowRunsForRepo: ["GET /repos/{owner}/{repo}/actions/runs"],
        reRunWorkflow: ["POST /repos/{owner}/{repo}/actions/runs/{run_id}/rerun"],
        removeSelectedRepoFromOrgSecret: ["DELETE /orgs/{org}/actions/secrets/{secret_name}/repositories/{repository_id}"],
        reviewPendingDeploymentsForRun: ["POST /repos/{owner}/{repo}/actions/runs/{run_id}/pending_deployments"],
        setAllowedActionsOrganization: ["PUT /orgs/{org}/actions/permissions/selected-actions"],
        setAllowedActionsRepository: ["PUT /repos/{owner}/{repo}/actions/permissions/selected-actions"],
        setGithubActionsPermissionsOrganization: ["PUT /orgs/{org}/actions/permissions"],
        setGithubActionsPermissionsRepository: ["PUT /repos/{owner}/{repo}/actions/permissions"],
        setSelectedReposForOrgSecret: ["PUT /orgs/{org}/actions/secrets/{secret_name}/repositories"],
        setSelectedRepositoriesEnabledGithubActionsOrganization: ["PUT /orgs/{org}/actions/permissions/repositories"]
      },
      activity: {
        checkRepoIsStarredByAuthenticatedUser: ["GET /user/starred/{owner}/{repo}"],
        deleteRepoSubscription: ["DELETE /repos/{owner}/{repo}/subscription"],
        deleteThreadSubscription: ["DELETE /notifications/threads/{thread_id}/subscription"],
        getFeeds: ["GET /feeds"],
        getRepoSubscription: ["GET /repos/{owner}/{repo}/subscription"],
        getThread: ["GET /notifications/threads/{thread_id}"],
        getThreadSubscriptionForAuthenticatedUser: ["GET /notifications/threads/{thread_id}/subscription"],
        listEventsForAuthenticatedUser: ["GET /users/{username}/events"],
        listNotificationsForAuthenticatedUser: ["GET /notifications"],
        listOrgEventsForAuthenticatedUser: ["GET /users/{username}/events/orgs/{org}"],
        listPublicEvents: ["GET /events"],
        listPublicEventsForRepoNetwork: ["GET /networks/{owner}/{repo}/events"],
        listPublicEventsForUser: ["GET /users/{username}/events/public"],
        listPublicOrgEvents: ["GET /orgs/{org}/events"],
        listReceivedEventsForUser: ["GET /users/{username}/received_events"],
        listReceivedPublicEventsForUser: ["GET /users/{username}/received_events/public"],
        listRepoEvents: ["GET /repos/{owner}/{repo}/events"],
        listRepoNotificationsForAuthenticatedUser: ["GET /repos/{owner}/{repo}/notifications"],
        listReposStarredByAuthenticatedUser: ["GET /user/starred"],
        listReposStarredByUser: ["GET /users/{username}/starred"],
        listReposWatchedByUser: ["GET /users/{username}/subscriptions"],
        listStargazersForRepo: ["GET /repos/{owner}/{repo}/stargazers"],
        listWatchedReposForAuthenticatedUser: ["GET /user/subscriptions"],
        listWatchersForRepo: ["GET /repos/{owner}/{repo}/subscribers"],
        markNotificationsAsRead: ["PUT /notifications"],
        markRepoNotificationsAsRead: ["PUT /repos/{owner}/{repo}/notifications"],
        markThreadAsRead: ["PATCH /notifications/threads/{thread_id}"],
        setRepoSubscription: ["PUT /repos/{owner}/{repo}/subscription"],
        setThreadSubscription: ["PUT /notifications/threads/{thread_id}/subscription"],
        starRepoForAuthenticatedUser: ["PUT /user/starred/{owner}/{repo}"],
        unstarRepoForAuthenticatedUser: ["DELETE /user/starred/{owner}/{repo}"]
      },
      apps: {
        addRepoToInstallation: ["PUT /user/installations/{installation_id}/repositories/{repository_id}"],
        checkToken: ["POST /applications/{client_id}/token"],
        createContentAttachment: ["POST /content_references/{content_reference_id}/attachments", {
          mediaType: {
            previews: ["corsair"]
          }
        }],
        createContentAttachmentForRepo: ["POST /repos/{owner}/{repo}/content_references/{content_reference_id}/attachments", {
          mediaType: {
            previews: ["corsair"]
          }
        }],
        createFromManifest: ["POST /app-manifests/{code}/conversions"],
        createInstallationAccessToken: ["POST /app/installations/{installation_id}/access_tokens"],
        deleteAuthorization: ["DELETE /applications/{client_id}/grant"],
        deleteInstallation: ["DELETE /app/installations/{installation_id}"],
        deleteToken: ["DELETE /applications/{client_id}/token"],
        getAuthenticated: ["GET /app"],
        getBySlug: ["GET /apps/{app_slug}"],
        getInstallation: ["GET /app/installations/{installation_id}"],
        getOrgInstallation: ["GET /orgs/{org}/installation"],
        getRepoInstallation: ["GET /repos/{owner}/{repo}/installation"],
        getSubscriptionPlanForAccount: ["GET /marketplace_listing/accounts/{account_id}"],
        getSubscriptionPlanForAccountStubbed: ["GET /marketplace_listing/stubbed/accounts/{account_id}"],
        getUserInstallation: ["GET /users/{username}/installation"],
        getWebhookConfigForApp: ["GET /app/hook/config"],
        listAccountsForPlan: ["GET /marketplace_listing/plans/{plan_id}/accounts"],
        listAccountsForPlanStubbed: ["GET /marketplace_listing/stubbed/plans/{plan_id}/accounts"],
        listInstallationReposForAuthenticatedUser: ["GET /user/installations/{installation_id}/repositories"],
        listInstallations: ["GET /app/installations"],
        listInstallationsForAuthenticatedUser: ["GET /user/installations"],
        listPlans: ["GET /marketplace_listing/plans"],
        listPlansStubbed: ["GET /marketplace_listing/stubbed/plans"],
        listReposAccessibleToInstallation: ["GET /installation/repositories"],
        listSubscriptionsForAuthenticatedUser: ["GET /user/marketplace_purchases"],
        listSubscriptionsForAuthenticatedUserStubbed: ["GET /user/marketplace_purchases/stubbed"],
        removeRepoFromInstallation: ["DELETE /user/installations/{installation_id}/repositories/{repository_id}"],
        resetToken: ["PATCH /applications/{client_id}/token"],
        revokeInstallationAccessToken: ["DELETE /installation/token"],
        scopeToken: ["POST /applications/{client_id}/token/scoped"],
        suspendInstallation: ["PUT /app/installations/{installation_id}/suspended"],
        unsuspendInstallation: ["DELETE /app/installations/{installation_id}/suspended"],
        updateWebhookConfigForApp: ["PATCH /app/hook/config"]
      },
      billing: {
        getGithubActionsBillingOrg: ["GET /orgs/{org}/settings/billing/actions"],
        getGithubActionsBillingUser: ["GET /users/{username}/settings/billing/actions"],
        getGithubPackagesBillingOrg: ["GET /orgs/{org}/settings/billing/packages"],
        getGithubPackagesBillingUser: ["GET /users/{username}/settings/billing/packages"],
        getSharedStorageBillingOrg: ["GET /orgs/{org}/settings/billing/shared-storage"],
        getSharedStorageBillingUser: ["GET /users/{username}/settings/billing/shared-storage"]
      },
      checks: {
        create: ["POST /repos/{owner}/{repo}/check-runs"],
        createSuite: ["POST /repos/{owner}/{repo}/check-suites"],
        get: ["GET /repos/{owner}/{repo}/check-runs/{check_run_id}"],
        getSuite: ["GET /repos/{owner}/{repo}/check-suites/{check_suite_id}"],
        listAnnotations: ["GET /repos/{owner}/{repo}/check-runs/{check_run_id}/annotations"],
        listForRef: ["GET /repos/{owner}/{repo}/commits/{ref}/check-runs"],
        listForSuite: ["GET /repos/{owner}/{repo}/check-suites/{check_suite_id}/check-runs"],
        listSuitesForRef: ["GET /repos/{owner}/{repo}/commits/{ref}/check-suites"],
        rerequestSuite: ["POST /repos/{owner}/{repo}/check-suites/{check_suite_id}/rerequest"],
        setSuitesPreferences: ["PATCH /repos/{owner}/{repo}/check-suites/preferences"],
        update: ["PATCH /repos/{owner}/{repo}/check-runs/{check_run_id}"]
      },
      codeScanning: {
        deleteAnalysis: ["DELETE /repos/{owner}/{repo}/code-scanning/analyses/{analysis_id}{?confirm_delete}"],
        getAlert: ["GET /repos/{owner}/{repo}/code-scanning/alerts/{alert_number}", {}, {
          renamedParameters: {
            alert_id: "alert_number"
          }
        }],
        getAnalysis: ["GET /repos/{owner}/{repo}/code-scanning/analyses/{analysis_id}"],
        getSarif: ["GET /repos/{owner}/{repo}/code-scanning/sarifs/{sarif_id}"],
        listAlertInstances: ["GET /repos/{owner}/{repo}/code-scanning/alerts/{alert_number}/instances"],
        listAlertsForRepo: ["GET /repos/{owner}/{repo}/code-scanning/alerts"],
        listAlertsInstances: ["GET /repos/{owner}/{repo}/code-scanning/alerts/{alert_number}/instances", {}, {
          renamed: ["codeScanning", "listAlertInstances"]
        }],
        listRecentAnalyses: ["GET /repos/{owner}/{repo}/code-scanning/analyses"],
        updateAlert: ["PATCH /repos/{owner}/{repo}/code-scanning/alerts/{alert_number}"],
        uploadSarif: ["POST /repos/{owner}/{repo}/code-scanning/sarifs"]
      },
      codesOfConduct: {
        getAllCodesOfConduct: ["GET /codes_of_conduct", {
          mediaType: {
            previews: ["scarlet-witch"]
          }
        }],
        getConductCode: ["GET /codes_of_conduct/{key}", {
          mediaType: {
            previews: ["scarlet-witch"]
          }
        }],
        getForRepo: ["GET /repos/{owner}/{repo}/community/code_of_conduct", {
          mediaType: {
            previews: ["scarlet-witch"]
          }
        }]
      },
      emojis: {
        get: ["GET /emojis"]
      },
      enterpriseAdmin: {
        disableSelectedOrganizationGithubActionsEnterprise: ["DELETE /enterprises/{enterprise}/actions/permissions/organizations/{org_id}"],
        enableSelectedOrganizationGithubActionsEnterprise: ["PUT /enterprises/{enterprise}/actions/permissions/organizations/{org_id}"],
        getAllowedActionsEnterprise: ["GET /enterprises/{enterprise}/actions/permissions/selected-actions"],
        getGithubActionsPermissionsEnterprise: ["GET /enterprises/{enterprise}/actions/permissions"],
        listSelectedOrganizationsEnabledGithubActionsEnterprise: ["GET /enterprises/{enterprise}/actions/permissions/organizations"],
        setAllowedActionsEnterprise: ["PUT /enterprises/{enterprise}/actions/permissions/selected-actions"],
        setGithubActionsPermissionsEnterprise: ["PUT /enterprises/{enterprise}/actions/permissions"],
        setSelectedOrganizationsEnabledGithubActionsEnterprise: ["PUT /enterprises/{enterprise}/actions/permissions/organizations"]
      },
      gists: {
        checkIsStarred: ["GET /gists/{gist_id}/star"],
        create: ["POST /gists"],
        createComment: ["POST /gists/{gist_id}/comments"],
        delete: ["DELETE /gists/{gist_id}"],
        deleteComment: ["DELETE /gists/{gist_id}/comments/{comment_id}"],
        fork: ["POST /gists/{gist_id}/forks"],
        get: ["GET /gists/{gist_id}"],
        getComment: ["GET /gists/{gist_id}/comments/{comment_id}"],
        getRevision: ["GET /gists/{gist_id}/{sha}"],
        list: ["GET /gists"],
        listComments: ["GET /gists/{gist_id}/comments"],
        listCommits: ["GET /gists/{gist_id}/commits"],
        listForUser: ["GET /users/{username}/gists"],
        listForks: ["GET /gists/{gist_id}/forks"],
        listPublic: ["GET /gists/public"],
        listStarred: ["GET /gists/starred"],
        star: ["PUT /gists/{gist_id}/star"],
        unstar: ["DELETE /gists/{gist_id}/star"],
        update: ["PATCH /gists/{gist_id}"],
        updateComment: ["PATCH /gists/{gist_id}/comments/{comment_id}"]
      },
      git: {
        createBlob: ["POST /repos/{owner}/{repo}/git/blobs"],
        createCommit: ["POST /repos/{owner}/{repo}/git/commits"],
        createRef: ["POST /repos/{owner}/{repo}/git/refs"],
        createTag: ["POST /repos/{owner}/{repo}/git/tags"],
        createTree: ["POST /repos/{owner}/{repo}/git/trees"],
        deleteRef: ["DELETE /repos/{owner}/{repo}/git/refs/{ref}"],
        getBlob: ["GET /repos/{owner}/{repo}/git/blobs/{file_sha}"],
        getCommit: ["GET /repos/{owner}/{repo}/git/commits/{commit_sha}"],
        getRef: ["GET /repos/{owner}/{repo}/git/ref/{ref}"],
        getTag: ["GET /repos/{owner}/{repo}/git/tags/{tag_sha}"],
        getTree: ["GET /repos/{owner}/{repo}/git/trees/{tree_sha}"],
        listMatchingRefs: ["GET /repos/{owner}/{repo}/git/matching-refs/{ref}"],
        updateRef: ["PATCH /repos/{owner}/{repo}/git/refs/{ref}"]
      },
      gitignore: {
        getAllTemplates: ["GET /gitignore/templates"],
        getTemplate: ["GET /gitignore/templates/{name}"]
      },
      interactions: {
        getRestrictionsForAuthenticatedUser: ["GET /user/interaction-limits"],
        getRestrictionsForOrg: ["GET /orgs/{org}/interaction-limits"],
        getRestrictionsForRepo: ["GET /repos/{owner}/{repo}/interaction-limits"],
        getRestrictionsForYourPublicRepos: ["GET /user/interaction-limits", {}, {
          renamed: ["interactions", "getRestrictionsForAuthenticatedUser"]
        }],
        removeRestrictionsForAuthenticatedUser: ["DELETE /user/interaction-limits"],
        removeRestrictionsForOrg: ["DELETE /orgs/{org}/interaction-limits"],
        removeRestrictionsForRepo: ["DELETE /repos/{owner}/{repo}/interaction-limits"],
        removeRestrictionsForYourPublicRepos: ["DELETE /user/interaction-limits", {}, {
          renamed: ["interactions", "removeRestrictionsForAuthenticatedUser"]
        }],
        setRestrictionsForAuthenticatedUser: ["PUT /user/interaction-limits"],
        setRestrictionsForOrg: ["PUT /orgs/{org}/interaction-limits"],
        setRestrictionsForRepo: ["PUT /repos/{owner}/{repo}/interaction-limits"],
        setRestrictionsForYourPublicRepos: ["PUT /user/interaction-limits", {}, {
          renamed: ["interactions", "setRestrictionsForAuthenticatedUser"]
        }]
      },
      issues: {
        addAssignees: ["POST /repos/{owner}/{repo}/issues/{issue_number}/assignees"],
        addLabels: ["POST /repos/{owner}/{repo}/issues/{issue_number}/labels"],
        checkUserCanBeAssigned: ["GET /repos/{owner}/{repo}/assignees/{assignee}"],
        create: ["POST /repos/{owner}/{repo}/issues"],
        createComment: ["POST /repos/{owner}/{repo}/issues/{issue_number}/comments"],
        createLabel: ["POST /repos/{owner}/{repo}/labels"],
        createMilestone: ["POST /repos/{owner}/{repo}/milestones"],
        deleteComment: ["DELETE /repos/{owner}/{repo}/issues/comments/{comment_id}"],
        deleteLabel: ["DELETE /repos/{owner}/{repo}/labels/{name}"],
        deleteMilestone: ["DELETE /repos/{owner}/{repo}/milestones/{milestone_number}"],
        get: ["GET /repos/{owner}/{repo}/issues/{issue_number}"],
        getComment: ["GET /repos/{owner}/{repo}/issues/comments/{comment_id}"],
        getEvent: ["GET /repos/{owner}/{repo}/issues/events/{event_id}"],
        getLabel: ["GET /repos/{owner}/{repo}/labels/{name}"],
        getMilestone: ["GET /repos/{owner}/{repo}/milestones/{milestone_number}"],
        list: ["GET /issues"],
        listAssignees: ["GET /repos/{owner}/{repo}/assignees"],
        listComments: ["GET /repos/{owner}/{repo}/issues/{issue_number}/comments"],
        listCommentsForRepo: ["GET /repos/{owner}/{repo}/issues/comments"],
        listEvents: ["GET /repos/{owner}/{repo}/issues/{issue_number}/events"],
        listEventsForRepo: ["GET /repos/{owner}/{repo}/issues/events"],
        listEventsForTimeline: ["GET /repos/{owner}/{repo}/issues/{issue_number}/timeline", {
          mediaType: {
            previews: ["mockingbird"]
          }
        }],
        listForAuthenticatedUser: ["GET /user/issues"],
        listForOrg: ["GET /orgs/{org}/issues"],
        listForRepo: ["GET /repos/{owner}/{repo}/issues"],
        listLabelsForMilestone: ["GET /repos/{owner}/{repo}/milestones/{milestone_number}/labels"],
        listLabelsForRepo: ["GET /repos/{owner}/{repo}/labels"],
        listLabelsOnIssue: ["GET /repos/{owner}/{repo}/issues/{issue_number}/labels"],
        listMilestones: ["GET /repos/{owner}/{repo}/milestones"],
        lock: ["PUT /repos/{owner}/{repo}/issues/{issue_number}/lock"],
        removeAllLabels: ["DELETE /repos/{owner}/{repo}/issues/{issue_number}/labels"],
        removeAssignees: ["DELETE /repos/{owner}/{repo}/issues/{issue_number}/assignees"],
        removeLabel: ["DELETE /repos/{owner}/{repo}/issues/{issue_number}/labels/{name}"],
        setLabels: ["PUT /repos/{owner}/{repo}/issues/{issue_number}/labels"],
        unlock: ["DELETE /repos/{owner}/{repo}/issues/{issue_number}/lock"],
        update: ["PATCH /repos/{owner}/{repo}/issues/{issue_number}"],
        updateComment: ["PATCH /repos/{owner}/{repo}/issues/comments/{comment_id}"],
        updateLabel: ["PATCH /repos/{owner}/{repo}/labels/{name}"],
        updateMilestone: ["PATCH /repos/{owner}/{repo}/milestones/{milestone_number}"]
      },
      licenses: {
        get: ["GET /licenses/{license}"],
        getAllCommonlyUsed: ["GET /licenses"],
        getForRepo: ["GET /repos/{owner}/{repo}/license"]
      },
      markdown: {
        render: ["POST /markdown"],
        renderRaw: ["POST /markdown/raw", {
          headers: {
            "content-type": "text/plain; charset=utf-8"
          }
        }]
      },
      meta: {
        get: ["GET /meta"],
        getOctocat: ["GET /octocat"],
        getZen: ["GET /zen"],
        root: ["GET /"]
      },
      migrations: {
        cancelImport: ["DELETE /repos/{owner}/{repo}/import"],
        deleteArchiveForAuthenticatedUser: ["DELETE /user/migrations/{migration_id}/archive", {
          mediaType: {
            previews: ["wyandotte"]
          }
        }],
        deleteArchiveForOrg: ["DELETE /orgs/{org}/migrations/{migration_id}/archive", {
          mediaType: {
            previews: ["wyandotte"]
          }
        }],
        downloadArchiveForOrg: ["GET /orgs/{org}/migrations/{migration_id}/archive", {
          mediaType: {
            previews: ["wyandotte"]
          }
        }],
        getArchiveForAuthenticatedUser: ["GET /user/migrations/{migration_id}/archive", {
          mediaType: {
            previews: ["wyandotte"]
          }
        }],
        getCommitAuthors: ["GET /repos/{owner}/{repo}/import/authors"],
        getImportStatus: ["GET /repos/{owner}/{repo}/import"],
        getLargeFiles: ["GET /repos/{owner}/{repo}/import/large_files"],
        getStatusForAuthenticatedUser: ["GET /user/migrations/{migration_id}", {
          mediaType: {
            previews: ["wyandotte"]
          }
        }],
        getStatusForOrg: ["GET /orgs/{org}/migrations/{migration_id}", {
          mediaType: {
            previews: ["wyandotte"]
          }
        }],
        listForAuthenticatedUser: ["GET /user/migrations", {
          mediaType: {
            previews: ["wyandotte"]
          }
        }],
        listForOrg: ["GET /orgs/{org}/migrations", {
          mediaType: {
            previews: ["wyandotte"]
          }
        }],
        listReposForOrg: ["GET /orgs/{org}/migrations/{migration_id}/repositories", {
          mediaType: {
            previews: ["wyandotte"]
          }
        }],
        listReposForUser: ["GET /user/migrations/{migration_id}/repositories", {
          mediaType: {
            previews: ["wyandotte"]
          }
        }],
        mapCommitAuthor: ["PATCH /repos/{owner}/{repo}/import/authors/{author_id}"],
        setLfsPreference: ["PATCH /repos/{owner}/{repo}/import/lfs"],
        startForAuthenticatedUser: ["POST /user/migrations"],
        startForOrg: ["POST /orgs/{org}/migrations"],
        startImport: ["PUT /repos/{owner}/{repo}/import"],
        unlockRepoForAuthenticatedUser: ["DELETE /user/migrations/{migration_id}/repos/{repo_name}/lock", {
          mediaType: {
            previews: ["wyandotte"]
          }
        }],
        unlockRepoForOrg: ["DELETE /orgs/{org}/migrations/{migration_id}/repos/{repo_name}/lock", {
          mediaType: {
            previews: ["wyandotte"]
          }
        }],
        updateImport: ["PATCH /repos/{owner}/{repo}/import"]
      },
      orgs: {
        blockUser: ["PUT /orgs/{org}/blocks/{username}"],
        cancelInvitation: ["DELETE /orgs/{org}/invitations/{invitation_id}"],
        checkBlockedUser: ["GET /orgs/{org}/blocks/{username}"],
        checkMembershipForUser: ["GET /orgs/{org}/members/{username}"],
        checkPublicMembershipForUser: ["GET /orgs/{org}/public_members/{username}"],
        convertMemberToOutsideCollaborator: ["PUT /orgs/{org}/outside_collaborators/{username}"],
        createInvitation: ["POST /orgs/{org}/invitations"],
        createWebhook: ["POST /orgs/{org}/hooks"],
        deleteWebhook: ["DELETE /orgs/{org}/hooks/{hook_id}"],
        get: ["GET /orgs/{org}"],
        getMembershipForAuthenticatedUser: ["GET /user/memberships/orgs/{org}"],
        getMembershipForUser: ["GET /orgs/{org}/memberships/{username}"],
        getWebhook: ["GET /orgs/{org}/hooks/{hook_id}"],
        getWebhookConfigForOrg: ["GET /orgs/{org}/hooks/{hook_id}/config"],
        list: ["GET /organizations"],
        listAppInstallations: ["GET /orgs/{org}/installations"],
        listBlockedUsers: ["GET /orgs/{org}/blocks"],
        listFailedInvitations: ["GET /orgs/{org}/failed_invitations"],
        listForAuthenticatedUser: ["GET /user/orgs"],
        listForUser: ["GET /users/{username}/orgs"],
        listInvitationTeams: ["GET /orgs/{org}/invitations/{invitation_id}/teams"],
        listMembers: ["GET /orgs/{org}/members"],
        listMembershipsForAuthenticatedUser: ["GET /user/memberships/orgs"],
        listOutsideCollaborators: ["GET /orgs/{org}/outside_collaborators"],
        listPendingInvitations: ["GET /orgs/{org}/invitations"],
        listPublicMembers: ["GET /orgs/{org}/public_members"],
        listWebhooks: ["GET /orgs/{org}/hooks"],
        pingWebhook: ["POST /orgs/{org}/hooks/{hook_id}/pings"],
        removeMember: ["DELETE /orgs/{org}/members/{username}"],
        removeMembershipForUser: ["DELETE /orgs/{org}/memberships/{username}"],
        removeOutsideCollaborator: ["DELETE /orgs/{org}/outside_collaborators/{username}"],
        removePublicMembershipForAuthenticatedUser: ["DELETE /orgs/{org}/public_members/{username}"],
        setMembershipForUser: ["PUT /orgs/{org}/memberships/{username}"],
        setPublicMembershipForAuthenticatedUser: ["PUT /orgs/{org}/public_members/{username}"],
        unblockUser: ["DELETE /orgs/{org}/blocks/{username}"],
        update: ["PATCH /orgs/{org}"],
        updateMembershipForAuthenticatedUser: ["PATCH /user/memberships/orgs/{org}"],
        updateWebhook: ["PATCH /orgs/{org}/hooks/{hook_id}"],
        updateWebhookConfigForOrg: ["PATCH /orgs/{org}/hooks/{hook_id}/config"]
      },
      packages: {
        deletePackageForAuthenticatedUser: ["DELETE /user/packages/{package_type}/{package_name}"],
        deletePackageForOrg: ["DELETE /orgs/{org}/packages/{package_type}/{package_name}"],
        deletePackageVersionForAuthenticatedUser: ["DELETE /user/packages/{package_type}/{package_name}/versions/{package_version_id}"],
        deletePackageVersionForOrg: ["DELETE /orgs/{org}/packages/{package_type}/{package_name}/versions/{package_version_id}"],
        getAllPackageVersionsForAPackageOwnedByAnOrg: ["GET /orgs/{org}/packages/{package_type}/{package_name}/versions", {}, {
          renamed: ["packages", "getAllPackageVersionsForPackageOwnedByOrg"]
        }],
        getAllPackageVersionsForAPackageOwnedByTheAuthenticatedUser: ["GET /user/packages/{package_type}/{package_name}/versions", {}, {
          renamed: ["packages", "getAllPackageVersionsForPackageOwnedByAuthenticatedUser"]
        }],
        getAllPackageVersionsForPackageOwnedByAuthenticatedUser: ["GET /user/packages/{package_type}/{package_name}/versions"],
        getAllPackageVersionsForPackageOwnedByOrg: ["GET /orgs/{org}/packages/{package_type}/{package_name}/versions"],
        getAllPackageVersionsForPackageOwnedByUser: ["GET /users/{username}/packages/{package_type}/{package_name}/versions"],
        getPackageForAuthenticatedUser: ["GET /user/packages/{package_type}/{package_name}"],
        getPackageForOrganization: ["GET /orgs/{org}/packages/{package_type}/{package_name}"],
        getPackageForUser: ["GET /users/{username}/packages/{package_type}/{package_name}"],
        getPackageVersionForAuthenticatedUser: ["GET /user/packages/{package_type}/{package_name}/versions/{package_version_id}"],
        getPackageVersionForOrganization: ["GET /orgs/{org}/packages/{package_type}/{package_name}/versions/{package_version_id}"],
        getPackageVersionForUser: ["GET /users/{username}/packages/{package_type}/{package_name}/versions/{package_version_id}"],
        restorePackageForAuthenticatedUser: ["POST /user/packages/{package_type}/{package_name}/restore{?token}"],
        restorePackageForOrg: ["POST /orgs/{org}/packages/{package_type}/{package_name}/restore{?token}"],
        restorePackageVersionForAuthenticatedUser: ["POST /user/packages/{package_type}/{package_name}/versions/{package_version_id}/restore"],
        restorePackageVersionForOrg: ["POST /orgs/{org}/packages/{package_type}/{package_name}/versions/{package_version_id}/restore"]
      },
      projects: {
        addCollaborator: ["PUT /projects/{project_id}/collaborators/{username}", {
          mediaType: {
            previews: ["inertia"]
          }
        }],
        createCard: ["POST /projects/columns/{column_id}/cards", {
          mediaType: {
            previews: ["inertia"]
          }
        }],
        createColumn: ["POST /projects/{project_id}/columns", {
          mediaType: {
            previews: ["inertia"]
          }
        }],
        createForAuthenticatedUser: ["POST /user/projects", {
          mediaType: {
            previews: ["inertia"]
          }
        }],
        createForOrg: ["POST /orgs/{org}/projects", {
          mediaType: {
            previews: ["inertia"]
          }
        }],
        createForRepo: ["POST /repos/{owner}/{repo}/projects", {
          mediaType: {
            previews: ["inertia"]
          }
        }],
        delete: ["DELETE /projects/{project_id}", {
          mediaType: {
            previews: ["inertia"]
          }
        }],
        deleteCard: ["DELETE /projects/columns/cards/{card_id}", {
          mediaType: {
            previews: ["inertia"]
          }
        }],
        deleteColumn: ["DELETE /projects/columns/{column_id}", {
          mediaType: {
            previews: ["inertia"]
          }
        }],
        get: ["GET /projects/{project_id}", {
          mediaType: {
            previews: ["inertia"]
          }
        }],
        getCard: ["GET /projects/columns/cards/{card_id}", {
          mediaType: {
            previews: ["inertia"]
          }
        }],
        getColumn: ["GET /projects/columns/{column_id}", {
          mediaType: {
            previews: ["inertia"]
          }
        }],
        getPermissionForUser: ["GET /projects/{project_id}/collaborators/{username}/permission", {
          mediaType: {
            previews: ["inertia"]
          }
        }],
        listCards: ["GET /projects/columns/{column_id}/cards", {
          mediaType: {
            previews: ["inertia"]
          }
        }],
        listCollaborators: ["GET /projects/{project_id}/collaborators", {
          mediaType: {
            previews: ["inertia"]
          }
        }],
        listColumns: ["GET /projects/{project_id}/columns", {
          mediaType: {
            previews: ["inertia"]
          }
        }],
        listForOrg: ["GET /orgs/{org}/projects", {
          mediaType: {
            previews: ["inertia"]
          }
        }],
        listForRepo: ["GET /repos/{owner}/{repo}/projects", {
          mediaType: {
            previews: ["inertia"]
          }
        }],
        listForUser: ["GET /users/{username}/projects", {
          mediaType: {
            previews: ["inertia"]
          }
        }],
        moveCard: ["POST /projects/columns/cards/{card_id}/moves", {
          mediaType: {
            previews: ["inertia"]
          }
        }],
        moveColumn: ["POST /projects/columns/{column_id}/moves", {
          mediaType: {
            previews: ["inertia"]
          }
        }],
        removeCollaborator: ["DELETE /projects/{project_id}/collaborators/{username}", {
          mediaType: {
            previews: ["inertia"]
          }
        }],
        update: ["PATCH /projects/{project_id}", {
          mediaType: {
            previews: ["inertia"]
          }
        }],
        updateCard: ["PATCH /projects/columns/cards/{card_id}", {
          mediaType: {
            previews: ["inertia"]
          }
        }],
        updateColumn: ["PATCH /projects/columns/{column_id}", {
          mediaType: {
            previews: ["inertia"]
          }
        }]
      },
      pulls: {
        checkIfMerged: ["GET /repos/{owner}/{repo}/pulls/{pull_number}/merge"],
        create: ["POST /repos/{owner}/{repo}/pulls"],
        createReplyForReviewComment: ["POST /repos/{owner}/{repo}/pulls/{pull_number}/comments/{comment_id}/replies"],
        createReview: ["POST /repos/{owner}/{repo}/pulls/{pull_number}/reviews"],
        createReviewComment: ["POST /repos/{owner}/{repo}/pulls/{pull_number}/comments"],
        deletePendingReview: ["DELETE /repos/{owner}/{repo}/pulls/{pull_number}/reviews/{review_id}"],
        deleteReviewComment: ["DELETE /repos/{owner}/{repo}/pulls/comments/{comment_id}"],
        dismissReview: ["PUT /repos/{owner}/{repo}/pulls/{pull_number}/reviews/{review_id}/dismissals"],
        get: ["GET /repos/{owner}/{repo}/pulls/{pull_number}"],
        getReview: ["GET /repos/{owner}/{repo}/pulls/{pull_number}/reviews/{review_id}"],
        getReviewComment: ["GET /repos/{owner}/{repo}/pulls/comments/{comment_id}"],
        list: ["GET /repos/{owner}/{repo}/pulls"],
        listCommentsForReview: ["GET /repos/{owner}/{repo}/pulls/{pull_number}/reviews/{review_id}/comments"],
        listCommits: ["GET /repos/{owner}/{repo}/pulls/{pull_number}/commits"],
        listFiles: ["GET /repos/{owner}/{repo}/pulls/{pull_number}/files"],
        listRequestedReviewers: ["GET /repos/{owner}/{repo}/pulls/{pull_number}/requested_reviewers"],
        listReviewComments: ["GET /repos/{owner}/{repo}/pulls/{pull_number}/comments"],
        listReviewCommentsForRepo: ["GET /repos/{owner}/{repo}/pulls/comments"],
        listReviews: ["GET /repos/{owner}/{repo}/pulls/{pull_number}/reviews"],
        merge: ["PUT /repos/{owner}/{repo}/pulls/{pull_number}/merge"],
        removeRequestedReviewers: ["DELETE /repos/{owner}/{repo}/pulls/{pull_number}/requested_reviewers"],
        requestReviewers: ["POST /repos/{owner}/{repo}/pulls/{pull_number}/requested_reviewers"],
        submitReview: ["POST /repos/{owner}/{repo}/pulls/{pull_number}/reviews/{review_id}/events"],
        update: ["PATCH /repos/{owner}/{repo}/pulls/{pull_number}"],
        updateBranch: ["PUT /repos/{owner}/{repo}/pulls/{pull_number}/update-branch", {
          mediaType: {
            previews: ["lydian"]
          }
        }],
        updateReview: ["PUT /repos/{owner}/{repo}/pulls/{pull_number}/reviews/{review_id}"],
        updateReviewComment: ["PATCH /repos/{owner}/{repo}/pulls/comments/{comment_id}"]
      },
      rateLimit: {
        get: ["GET /rate_limit"]
      },
      reactions: {
        createForCommitComment: ["POST /repos/{owner}/{repo}/comments/{comment_id}/reactions", {
          mediaType: {
            previews: ["squirrel-girl"]
          }
        }],
        createForIssue: ["POST /repos/{owner}/{repo}/issues/{issue_number}/reactions", {
          mediaType: {
            previews: ["squirrel-girl"]
          }
        }],
        createForIssueComment: ["POST /repos/{owner}/{repo}/issues/comments/{comment_id}/reactions", {
          mediaType: {
            previews: ["squirrel-girl"]
          }
        }],
        createForPullRequestReviewComment: ["POST /repos/{owner}/{repo}/pulls/comments/{comment_id}/reactions", {
          mediaType: {
            previews: ["squirrel-girl"]
          }
        }],
        createForRelease: ["POST /repos/{owner}/{repo}/releases/{release_id}/reactions", {
          mediaType: {
            previews: ["squirrel-girl"]
          }
        }],
        createForTeamDiscussionCommentInOrg: ["POST /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}/comments/{comment_number}/reactions", {
          mediaType: {
            previews: ["squirrel-girl"]
          }
        }],
        createForTeamDiscussionInOrg: ["POST /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}/reactions", {
          mediaType: {
            previews: ["squirrel-girl"]
          }
        }],
        deleteForCommitComment: ["DELETE /repos/{owner}/{repo}/comments/{comment_id}/reactions/{reaction_id}", {
          mediaType: {
            previews: ["squirrel-girl"]
          }
        }],
        deleteForIssue: ["DELETE /repos/{owner}/{repo}/issues/{issue_number}/reactions/{reaction_id}", {
          mediaType: {
            previews: ["squirrel-girl"]
          }
        }],
        deleteForIssueComment: ["DELETE /repos/{owner}/{repo}/issues/comments/{comment_id}/reactions/{reaction_id}", {
          mediaType: {
            previews: ["squirrel-girl"]
          }
        }],
        deleteForPullRequestComment: ["DELETE /repos/{owner}/{repo}/pulls/comments/{comment_id}/reactions/{reaction_id}", {
          mediaType: {
            previews: ["squirrel-girl"]
          }
        }],
        deleteForTeamDiscussion: ["DELETE /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}/reactions/{reaction_id}", {
          mediaType: {
            previews: ["squirrel-girl"]
          }
        }],
        deleteForTeamDiscussionComment: ["DELETE /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}/comments/{comment_number}/reactions/{reaction_id}", {
          mediaType: {
            previews: ["squirrel-girl"]
          }
        }],
        deleteLegacy: ["DELETE /reactions/{reaction_id}", {
          mediaType: {
            previews: ["squirrel-girl"]
          }
        }, {
          deprecated: "octokit.rest.reactions.deleteLegacy() is deprecated, see https://docs.github.com/rest/reference/reactions/#delete-a-reaction-legacy"
        }],
        listForCommitComment: ["GET /repos/{owner}/{repo}/comments/{comment_id}/reactions", {
          mediaType: {
            previews: ["squirrel-girl"]
          }
        }],
        listForIssue: ["GET /repos/{owner}/{repo}/issues/{issue_number}/reactions", {
          mediaType: {
            previews: ["squirrel-girl"]
          }
        }],
        listForIssueComment: ["GET /repos/{owner}/{repo}/issues/comments/{comment_id}/reactions", {
          mediaType: {
            previews: ["squirrel-girl"]
          }
        }],
        listForPullRequestReviewComment: ["GET /repos/{owner}/{repo}/pulls/comments/{comment_id}/reactions", {
          mediaType: {
            previews: ["squirrel-girl"]
          }
        }],
        listForTeamDiscussionCommentInOrg: ["GET /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}/comments/{comment_number}/reactions", {
          mediaType: {
            previews: ["squirrel-girl"]
          }
        }],
        listForTeamDiscussionInOrg: ["GET /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}/reactions", {
          mediaType: {
            previews: ["squirrel-girl"]
          }
        }]
      },
      repos: {
        acceptInvitation: ["PATCH /user/repository_invitations/{invitation_id}"],
        addAppAccessRestrictions: ["POST /repos/{owner}/{repo}/branches/{branch}/protection/restrictions/apps", {}, {
          mapToData: "apps"
        }],
        addCollaborator: ["PUT /repos/{owner}/{repo}/collaborators/{username}"],
        addStatusCheckContexts: ["POST /repos/{owner}/{repo}/branches/{branch}/protection/required_status_checks/contexts", {}, {
          mapToData: "contexts"
        }],
        addTeamAccessRestrictions: ["POST /repos/{owner}/{repo}/branches/{branch}/protection/restrictions/teams", {}, {
          mapToData: "teams"
        }],
        addUserAccessRestrictions: ["POST /repos/{owner}/{repo}/branches/{branch}/protection/restrictions/users", {}, {
          mapToData: "users"
        }],
        checkCollaborator: ["GET /repos/{owner}/{repo}/collaborators/{username}"],
        checkVulnerabilityAlerts: ["GET /repos/{owner}/{repo}/vulnerability-alerts", {
          mediaType: {
            previews: ["dorian"]
          }
        }],
        compareCommits: ["GET /repos/{owner}/{repo}/compare/{base}...{head}"],
        compareCommitsWithBasehead: ["GET /repos/{owner}/{repo}/compare/{basehead}"],
        createCommitComment: ["POST /repos/{owner}/{repo}/commits/{commit_sha}/comments"],
        createCommitSignatureProtection: ["POST /repos/{owner}/{repo}/branches/{branch}/protection/required_signatures", {
          mediaType: {
            previews: ["zzzax"]
          }
        }],
        createCommitStatus: ["POST /repos/{owner}/{repo}/statuses/{sha}"],
        createDeployKey: ["POST /repos/{owner}/{repo}/keys"],
        createDeployment: ["POST /repos/{owner}/{repo}/deployments"],
        createDeploymentStatus: ["POST /repos/{owner}/{repo}/deployments/{deployment_id}/statuses"],
        createDispatchEvent: ["POST /repos/{owner}/{repo}/dispatches"],
        createForAuthenticatedUser: ["POST /user/repos"],
        createFork: ["POST /repos/{owner}/{repo}/forks"],
        createInOrg: ["POST /orgs/{org}/repos"],
        createOrUpdateEnvironment: ["PUT /repos/{owner}/{repo}/environments/{environment_name}"],
        createOrUpdateFileContents: ["PUT /repos/{owner}/{repo}/contents/{path}"],
        createPagesSite: ["POST /repos/{owner}/{repo}/pages", {
          mediaType: {
            previews: ["switcheroo"]
          }
        }],
        createRelease: ["POST /repos/{owner}/{repo}/releases"],
        createUsingTemplate: ["POST /repos/{template_owner}/{template_repo}/generate", {
          mediaType: {
            previews: ["baptiste"]
          }
        }],
        createWebhook: ["POST /repos/{owner}/{repo}/hooks"],
        declineInvitation: ["DELETE /user/repository_invitations/{invitation_id}"],
        delete: ["DELETE /repos/{owner}/{repo}"],
        deleteAccessRestrictions: ["DELETE /repos/{owner}/{repo}/branches/{branch}/protection/restrictions"],
        deleteAdminBranchProtection: ["DELETE /repos/{owner}/{repo}/branches/{branch}/protection/enforce_admins"],
        deleteAnEnvironment: ["DELETE /repos/{owner}/{repo}/environments/{environment_name}"],
        deleteBranchProtection: ["DELETE /repos/{owner}/{repo}/branches/{branch}/protection"],
        deleteCommitComment: ["DELETE /repos/{owner}/{repo}/comments/{comment_id}"],
        deleteCommitSignatureProtection: ["DELETE /repos/{owner}/{repo}/branches/{branch}/protection/required_signatures", {
          mediaType: {
            previews: ["zzzax"]
          }
        }],
        deleteDeployKey: ["DELETE /repos/{owner}/{repo}/keys/{key_id}"],
        deleteDeployment: ["DELETE /repos/{owner}/{repo}/deployments/{deployment_id}"],
        deleteFile: ["DELETE /repos/{owner}/{repo}/contents/{path}"],
        deleteInvitation: ["DELETE /repos/{owner}/{repo}/invitations/{invitation_id}"],
        deletePagesSite: ["DELETE /repos/{owner}/{repo}/pages", {
          mediaType: {
            previews: ["switcheroo"]
          }
        }],
        deletePullRequestReviewProtection: ["DELETE /repos/{owner}/{repo}/branches/{branch}/protection/required_pull_request_reviews"],
        deleteRelease: ["DELETE /repos/{owner}/{repo}/releases/{release_id}"],
        deleteReleaseAsset: ["DELETE /repos/{owner}/{repo}/releases/assets/{asset_id}"],
        deleteWebhook: ["DELETE /repos/{owner}/{repo}/hooks/{hook_id}"],
        disableAutomatedSecurityFixes: ["DELETE /repos/{owner}/{repo}/automated-security-fixes", {
          mediaType: {
            previews: ["london"]
          }
        }],
        disableVulnerabilityAlerts: ["DELETE /repos/{owner}/{repo}/vulnerability-alerts", {
          mediaType: {
            previews: ["dorian"]
          }
        }],
        downloadArchive: ["GET /repos/{owner}/{repo}/zipball/{ref}", {}, {
          renamed: ["repos", "downloadZipballArchive"]
        }],
        downloadTarballArchive: ["GET /repos/{owner}/{repo}/tarball/{ref}"],
        downloadZipballArchive: ["GET /repos/{owner}/{repo}/zipball/{ref}"],
        enableAutomatedSecurityFixes: ["PUT /repos/{owner}/{repo}/automated-security-fixes", {
          mediaType: {
            previews: ["london"]
          }
        }],
        enableVulnerabilityAlerts: ["PUT /repos/{owner}/{repo}/vulnerability-alerts", {
          mediaType: {
            previews: ["dorian"]
          }
        }],
        get: ["GET /repos/{owner}/{repo}"],
        getAccessRestrictions: ["GET /repos/{owner}/{repo}/branches/{branch}/protection/restrictions"],
        getAdminBranchProtection: ["GET /repos/{owner}/{repo}/branches/{branch}/protection/enforce_admins"],
        getAllEnvironments: ["GET /repos/{owner}/{repo}/environments"],
        getAllStatusCheckContexts: ["GET /repos/{owner}/{repo}/branches/{branch}/protection/required_status_checks/contexts"],
        getAllTopics: ["GET /repos/{owner}/{repo}/topics", {
          mediaType: {
            previews: ["mercy"]
          }
        }],
        getAppsWithAccessToProtectedBranch: ["GET /repos/{owner}/{repo}/branches/{branch}/protection/restrictions/apps"],
        getBranch: ["GET /repos/{owner}/{repo}/branches/{branch}"],
        getBranchProtection: ["GET /repos/{owner}/{repo}/branches/{branch}/protection"],
        getClones: ["GET /repos/{owner}/{repo}/traffic/clones"],
        getCodeFrequencyStats: ["GET /repos/{owner}/{repo}/stats/code_frequency"],
        getCollaboratorPermissionLevel: ["GET /repos/{owner}/{repo}/collaborators/{username}/permission"],
        getCombinedStatusForRef: ["GET /repos/{owner}/{repo}/commits/{ref}/status"],
        getCommit: ["GET /repos/{owner}/{repo}/commits/{ref}"],
        getCommitActivityStats: ["GET /repos/{owner}/{repo}/stats/commit_activity"],
        getCommitComment: ["GET /repos/{owner}/{repo}/comments/{comment_id}"],
        getCommitSignatureProtection: ["GET /repos/{owner}/{repo}/branches/{branch}/protection/required_signatures", {
          mediaType: {
            previews: ["zzzax"]
          }
        }],
        getCommunityProfileMetrics: ["GET /repos/{owner}/{repo}/community/profile"],
        getContent: ["GET /repos/{owner}/{repo}/contents/{path}"],
        getContributorsStats: ["GET /repos/{owner}/{repo}/stats/contributors"],
        getDeployKey: ["GET /repos/{owner}/{repo}/keys/{key_id}"],
        getDeployment: ["GET /repos/{owner}/{repo}/deployments/{deployment_id}"],
        getDeploymentStatus: ["GET /repos/{owner}/{repo}/deployments/{deployment_id}/statuses/{status_id}"],
        getEnvironment: ["GET /repos/{owner}/{repo}/environments/{environment_name}"],
        getLatestPagesBuild: ["GET /repos/{owner}/{repo}/pages/builds/latest"],
        getLatestRelease: ["GET /repos/{owner}/{repo}/releases/latest"],
        getPages: ["GET /repos/{owner}/{repo}/pages"],
        getPagesBuild: ["GET /repos/{owner}/{repo}/pages/builds/{build_id}"],
        getPagesHealthCheck: ["GET /repos/{owner}/{repo}/pages/health"],
        getParticipationStats: ["GET /repos/{owner}/{repo}/stats/participation"],
        getPullRequestReviewProtection: ["GET /repos/{owner}/{repo}/branches/{branch}/protection/required_pull_request_reviews"],
        getPunchCardStats: ["GET /repos/{owner}/{repo}/stats/punch_card"],
        getReadme: ["GET /repos/{owner}/{repo}/readme"],
        getReadmeInDirectory: ["GET /repos/{owner}/{repo}/readme/{dir}"],
        getRelease: ["GET /repos/{owner}/{repo}/releases/{release_id}"],
        getReleaseAsset: ["GET /repos/{owner}/{repo}/releases/assets/{asset_id}"],
        getReleaseByTag: ["GET /repos/{owner}/{repo}/releases/tags/{tag}"],
        getStatusChecksProtection: ["GET /repos/{owner}/{repo}/branches/{branch}/protection/required_status_checks"],
        getTeamsWithAccessToProtectedBranch: ["GET /repos/{owner}/{repo}/branches/{branch}/protection/restrictions/teams"],
        getTopPaths: ["GET /repos/{owner}/{repo}/traffic/popular/paths"],
        getTopReferrers: ["GET /repos/{owner}/{repo}/traffic/popular/referrers"],
        getUsersWithAccessToProtectedBranch: ["GET /repos/{owner}/{repo}/branches/{branch}/protection/restrictions/users"],
        getViews: ["GET /repos/{owner}/{repo}/traffic/views"],
        getWebhook: ["GET /repos/{owner}/{repo}/hooks/{hook_id}"],
        getWebhookConfigForRepo: ["GET /repos/{owner}/{repo}/hooks/{hook_id}/config"],
        listBranches: ["GET /repos/{owner}/{repo}/branches"],
        listBranchesForHeadCommit: ["GET /repos/{owner}/{repo}/commits/{commit_sha}/branches-where-head", {
          mediaType: {
            previews: ["groot"]
          }
        }],
        listCollaborators: ["GET /repos/{owner}/{repo}/collaborators"],
        listCommentsForCommit: ["GET /repos/{owner}/{repo}/commits/{commit_sha}/comments"],
        listCommitCommentsForRepo: ["GET /repos/{owner}/{repo}/comments"],
        listCommitStatusesForRef: ["GET /repos/{owner}/{repo}/commits/{ref}/statuses"],
        listCommits: ["GET /repos/{owner}/{repo}/commits"],
        listContributors: ["GET /repos/{owner}/{repo}/contributors"],
        listDeployKeys: ["GET /repos/{owner}/{repo}/keys"],
        listDeploymentStatuses: ["GET /repos/{owner}/{repo}/deployments/{deployment_id}/statuses"],
        listDeployments: ["GET /repos/{owner}/{repo}/deployments"],
        listForAuthenticatedUser: ["GET /user/repos"],
        listForOrg: ["GET /orgs/{org}/repos"],
        listForUser: ["GET /users/{username}/repos"],
        listForks: ["GET /repos/{owner}/{repo}/forks"],
        listInvitations: ["GET /repos/{owner}/{repo}/invitations"],
        listInvitationsForAuthenticatedUser: ["GET /user/repository_invitations"],
        listLanguages: ["GET /repos/{owner}/{repo}/languages"],
        listPagesBuilds: ["GET /repos/{owner}/{repo}/pages/builds"],
        listPublic: ["GET /repositories"],
        listPullRequestsAssociatedWithCommit: ["GET /repos/{owner}/{repo}/commits/{commit_sha}/pulls", {
          mediaType: {
            previews: ["groot"]
          }
        }],
        listReleaseAssets: ["GET /repos/{owner}/{repo}/releases/{release_id}/assets"],
        listReleases: ["GET /repos/{owner}/{repo}/releases"],
        listTags: ["GET /repos/{owner}/{repo}/tags"],
        listTeams: ["GET /repos/{owner}/{repo}/teams"],
        listWebhooks: ["GET /repos/{owner}/{repo}/hooks"],
        merge: ["POST /repos/{owner}/{repo}/merges"],
        pingWebhook: ["POST /repos/{owner}/{repo}/hooks/{hook_id}/pings"],
        removeAppAccessRestrictions: ["DELETE /repos/{owner}/{repo}/branches/{branch}/protection/restrictions/apps", {}, {
          mapToData: "apps"
        }],
        removeCollaborator: ["DELETE /repos/{owner}/{repo}/collaborators/{username}"],
        removeStatusCheckContexts: ["DELETE /repos/{owner}/{repo}/branches/{branch}/protection/required_status_checks/contexts", {}, {
          mapToData: "contexts"
        }],
        removeStatusCheckProtection: ["DELETE /repos/{owner}/{repo}/branches/{branch}/protection/required_status_checks"],
        removeTeamAccessRestrictions: ["DELETE /repos/{owner}/{repo}/branches/{branch}/protection/restrictions/teams", {}, {
          mapToData: "teams"
        }],
        removeUserAccessRestrictions: ["DELETE /repos/{owner}/{repo}/branches/{branch}/protection/restrictions/users", {}, {
          mapToData: "users"
        }],
        renameBranch: ["POST /repos/{owner}/{repo}/branches/{branch}/rename"],
        replaceAllTopics: ["PUT /repos/{owner}/{repo}/topics", {
          mediaType: {
            previews: ["mercy"]
          }
        }],
        requestPagesBuild: ["POST /repos/{owner}/{repo}/pages/builds"],
        setAdminBranchProtection: ["POST /repos/{owner}/{repo}/branches/{branch}/protection/enforce_admins"],
        setAppAccessRestrictions: ["PUT /repos/{owner}/{repo}/branches/{branch}/protection/restrictions/apps", {}, {
          mapToData: "apps"
        }],
        setStatusCheckContexts: ["PUT /repos/{owner}/{repo}/branches/{branch}/protection/required_status_checks/contexts", {}, {
          mapToData: "contexts"
        }],
        setTeamAccessRestrictions: ["PUT /repos/{owner}/{repo}/branches/{branch}/protection/restrictions/teams", {}, {
          mapToData: "teams"
        }],
        setUserAccessRestrictions: ["PUT /repos/{owner}/{repo}/branches/{branch}/protection/restrictions/users", {}, {
          mapToData: "users"
        }],
        testPushWebhook: ["POST /repos/{owner}/{repo}/hooks/{hook_id}/tests"],
        transfer: ["POST /repos/{owner}/{repo}/transfer"],
        update: ["PATCH /repos/{owner}/{repo}"],
        updateBranchProtection: ["PUT /repos/{owner}/{repo}/branches/{branch}/protection"],
        updateCommitComment: ["PATCH /repos/{owner}/{repo}/comments/{comment_id}"],
        updateInformationAboutPagesSite: ["PUT /repos/{owner}/{repo}/pages"],
        updateInvitation: ["PATCH /repos/{owner}/{repo}/invitations/{invitation_id}"],
        updatePullRequestReviewProtection: ["PATCH /repos/{owner}/{repo}/branches/{branch}/protection/required_pull_request_reviews"],
        updateRelease: ["PATCH /repos/{owner}/{repo}/releases/{release_id}"],
        updateReleaseAsset: ["PATCH /repos/{owner}/{repo}/releases/assets/{asset_id}"],
        updateStatusCheckPotection: ["PATCH /repos/{owner}/{repo}/branches/{branch}/protection/required_status_checks", {}, {
          renamed: ["repos", "updateStatusCheckProtection"]
        }],
        updateStatusCheckProtection: ["PATCH /repos/{owner}/{repo}/branches/{branch}/protection/required_status_checks"],
        updateWebhook: ["PATCH /repos/{owner}/{repo}/hooks/{hook_id}"],
        updateWebhookConfigForRepo: ["PATCH /repos/{owner}/{repo}/hooks/{hook_id}/config"],
        uploadReleaseAsset: ["POST /repos/{owner}/{repo}/releases/{release_id}/assets{?name,label}", {
          baseUrl: "https://uploads.github.com"
        }]
      },
      search: {
        code: ["GET /search/code"],
        commits: ["GET /search/commits", {
          mediaType: {
            previews: ["cloak"]
          }
        }],
        issuesAndPullRequests: ["GET /search/issues"],
        labels: ["GET /search/labels"],
        repos: ["GET /search/repositories"],
        topics: ["GET /search/topics", {
          mediaType: {
            previews: ["mercy"]
          }
        }],
        users: ["GET /search/users"]
      },
      secretScanning: {
        getAlert: ["GET /repos/{owner}/{repo}/secret-scanning/alerts/{alert_number}"],
        listAlertsForRepo: ["GET /repos/{owner}/{repo}/secret-scanning/alerts"],
        updateAlert: ["PATCH /repos/{owner}/{repo}/secret-scanning/alerts/{alert_number}"]
      },
      teams: {
        addOrUpdateMembershipForUserInOrg: ["PUT /orgs/{org}/teams/{team_slug}/memberships/{username}"],
        addOrUpdateProjectPermissionsInOrg: ["PUT /orgs/{org}/teams/{team_slug}/projects/{project_id}", {
          mediaType: {
            previews: ["inertia"]
          }
        }],
        addOrUpdateRepoPermissionsInOrg: ["PUT /orgs/{org}/teams/{team_slug}/repos/{owner}/{repo}"],
        checkPermissionsForProjectInOrg: ["GET /orgs/{org}/teams/{team_slug}/projects/{project_id}", {
          mediaType: {
            previews: ["inertia"]
          }
        }],
        checkPermissionsForRepoInOrg: ["GET /orgs/{org}/teams/{team_slug}/repos/{owner}/{repo}"],
        create: ["POST /orgs/{org}/teams"],
        createDiscussionCommentInOrg: ["POST /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}/comments"],
        createDiscussionInOrg: ["POST /orgs/{org}/teams/{team_slug}/discussions"],
        deleteDiscussionCommentInOrg: ["DELETE /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}/comments/{comment_number}"],
        deleteDiscussionInOrg: ["DELETE /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}"],
        deleteInOrg: ["DELETE /orgs/{org}/teams/{team_slug}"],
        getByName: ["GET /orgs/{org}/teams/{team_slug}"],
        getDiscussionCommentInOrg: ["GET /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}/comments/{comment_number}"],
        getDiscussionInOrg: ["GET /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}"],
        getMembershipForUserInOrg: ["GET /orgs/{org}/teams/{team_slug}/memberships/{username}"],
        list: ["GET /orgs/{org}/teams"],
        listChildInOrg: ["GET /orgs/{org}/teams/{team_slug}/teams"],
        listDiscussionCommentsInOrg: ["GET /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}/comments"],
        listDiscussionsInOrg: ["GET /orgs/{org}/teams/{team_slug}/discussions"],
        listForAuthenticatedUser: ["GET /user/teams"],
        listMembersInOrg: ["GET /orgs/{org}/teams/{team_slug}/members"],
        listPendingInvitationsInOrg: ["GET /orgs/{org}/teams/{team_slug}/invitations"],
        listProjectsInOrg: ["GET /orgs/{org}/teams/{team_slug}/projects", {
          mediaType: {
            previews: ["inertia"]
          }
        }],
        listReposInOrg: ["GET /orgs/{org}/teams/{team_slug}/repos"],
        removeMembershipForUserInOrg: ["DELETE /orgs/{org}/teams/{team_slug}/memberships/{username}"],
        removeProjectInOrg: ["DELETE /orgs/{org}/teams/{team_slug}/projects/{project_id}"],
        removeRepoInOrg: ["DELETE /orgs/{org}/teams/{team_slug}/repos/{owner}/{repo}"],
        updateDiscussionCommentInOrg: ["PATCH /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}/comments/{comment_number}"],
        updateDiscussionInOrg: ["PATCH /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}"],
        updateInOrg: ["PATCH /orgs/{org}/teams/{team_slug}"]
      },
      users: {
        addEmailForAuthenticated: ["POST /user/emails"],
        block: ["PUT /user/blocks/{username}"],
        checkBlocked: ["GET /user/blocks/{username}"],
        checkFollowingForUser: ["GET /users/{username}/following/{target_user}"],
        checkPersonIsFollowedByAuthenticated: ["GET /user/following/{username}"],
        createGpgKeyForAuthenticated: ["POST /user/gpg_keys"],
        createPublicSshKeyForAuthenticated: ["POST /user/keys"],
        deleteEmailForAuthenticated: ["DELETE /user/emails"],
        deleteGpgKeyForAuthenticated: ["DELETE /user/gpg_keys/{gpg_key_id}"],
        deletePublicSshKeyForAuthenticated: ["DELETE /user/keys/{key_id}"],
        follow: ["PUT /user/following/{username}"],
        getAuthenticated: ["GET /user"],
        getByUsername: ["GET /users/{username}"],
        getContextForUser: ["GET /users/{username}/hovercard"],
        getGpgKeyForAuthenticated: ["GET /user/gpg_keys/{gpg_key_id}"],
        getPublicSshKeyForAuthenticated: ["GET /user/keys/{key_id}"],
        list: ["GET /users"],
        listBlockedByAuthenticated: ["GET /user/blocks"],
        listEmailsForAuthenticated: ["GET /user/emails"],
        listFollowedByAuthenticated: ["GET /user/following"],
        listFollowersForAuthenticatedUser: ["GET /user/followers"],
        listFollowersForUser: ["GET /users/{username}/followers"],
        listFollowingForUser: ["GET /users/{username}/following"],
        listGpgKeysForAuthenticated: ["GET /user/gpg_keys"],
        listGpgKeysForUser: ["GET /users/{username}/gpg_keys"],
        listPublicEmailsForAuthenticated: ["GET /user/public_emails"],
        listPublicKeysForUser: ["GET /users/{username}/keys"],
        listPublicSshKeysForAuthenticated: ["GET /user/keys"],
        setPrimaryEmailVisibilityForAuthenticated: ["PATCH /user/email/visibility"],
        unblock: ["DELETE /user/blocks/{username}"],
        unfollow: ["DELETE /user/following/{username}"],
        updateAuthenticated: ["PATCH /user"]
      }
    };
    var VERSION = "5.3.1";
    function endpointsToMethods(octokit, endpointsMap) {
      const newMethods = {};
      for (const [scope, endpoints] of Object.entries(endpointsMap)) {
        for (const [methodName, endpoint] of Object.entries(endpoints)) {
          const [route, defaults, decorations] = endpoint;
          const [method, url] = route.split(/ /);
          const endpointDefaults = Object.assign({
            method,
            url
          }, defaults);
          if (!newMethods[scope]) {
            newMethods[scope] = {};
          }
          const scopeMethods = newMethods[scope];
          if (decorations) {
            scopeMethods[methodName] = decorate(octokit, scope, methodName, endpointDefaults, decorations);
            continue;
          }
          scopeMethods[methodName] = octokit.request.defaults(endpointDefaults);
        }
      }
      return newMethods;
    }
    function decorate(octokit, scope, methodName, defaults, decorations) {
      const requestWithDefaults = octokit.request.defaults(defaults);
      function withDecorations(...args) {
        let options = requestWithDefaults.endpoint.merge(...args);
        if (decorations.mapToData) {
          options = Object.assign({}, options, {
            data: options[decorations.mapToData],
            [decorations.mapToData]: void 0
          });
          return requestWithDefaults(options);
        }
        if (decorations.renamed) {
          const [newScope, newMethodName] = decorations.renamed;
          octokit.log.warn(`octokit.${scope}.${methodName}() has been renamed to octokit.${newScope}.${newMethodName}()`);
        }
        if (decorations.deprecated) {
          octokit.log.warn(decorations.deprecated);
        }
        if (decorations.renamedParameters) {
          const options2 = requestWithDefaults.endpoint.merge(...args);
          for (const [name, alias] of Object.entries(decorations.renamedParameters)) {
            if (name in options2) {
              octokit.log.warn(`"${name}" parameter is deprecated for "octokit.${scope}.${methodName}()". Use "${alias}" instead`);
              if (!(alias in options2)) {
                options2[alias] = options2[name];
              }
              delete options2[name];
            }
          }
          return requestWithDefaults(options2);
        }
        return requestWithDefaults(...args);
      }
      return Object.assign(withDecorations, requestWithDefaults);
    }
    function restEndpointMethods(octokit) {
      const api = endpointsToMethods(octokit, Endpoints);
      return {
        rest: api
      };
    }
    restEndpointMethods.VERSION = VERSION;
    function legacyRestEndpointMethods(octokit) {
      const api = endpointsToMethods(octokit, Endpoints);
      return _objectSpread2(_objectSpread2({}, api), {}, {
        rest: api
      });
    }
    legacyRestEndpointMethods.VERSION = VERSION;
    exports2.legacyRestEndpointMethods = legacyRestEndpointMethods;
    exports2.restEndpointMethods = restEndpointMethods;
  }
});

// node_modules/@octokit/plugin-paginate-rest/dist-node/index.js
var require_dist_node10 = __commonJS({
  "node_modules/@octokit/plugin-paginate-rest/dist-node/index.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    var VERSION = "2.13.5";
    function ownKeys(object, enumerableOnly) {
      var keys = Object.keys(object);
      if (Object.getOwnPropertySymbols) {
        var symbols = Object.getOwnPropertySymbols(object);
        if (enumerableOnly) {
          symbols = symbols.filter(function(sym) {
            return Object.getOwnPropertyDescriptor(object, sym).enumerable;
          });
        }
        keys.push.apply(keys, symbols);
      }
      return keys;
    }
    function _objectSpread2(target) {
      for (var i = 1; i < arguments.length; i++) {
        var source = arguments[i] != null ? arguments[i] : {};
        if (i % 2) {
          ownKeys(Object(source), true).forEach(function(key) {
            _defineProperty(target, key, source[key]);
          });
        } else if (Object.getOwnPropertyDescriptors) {
          Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
        } else {
          ownKeys(Object(source)).forEach(function(key) {
            Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
          });
        }
      }
      return target;
    }
    function _defineProperty(obj, key, value) {
      if (key in obj) {
        Object.defineProperty(obj, key, {
          value,
          enumerable: true,
          configurable: true,
          writable: true
        });
      } else {
        obj[key] = value;
      }
      return obj;
    }
    function normalizePaginatedListResponse(response) {
      if (!response.data) {
        return _objectSpread2(_objectSpread2({}, response), {}, {
          data: []
        });
      }
      const responseNeedsNormalization = "total_count" in response.data && !("url" in response.data);
      if (!responseNeedsNormalization)
        return response;
      const incompleteResults = response.data.incomplete_results;
      const repositorySelection = response.data.repository_selection;
      const totalCount = response.data.total_count;
      delete response.data.incomplete_results;
      delete response.data.repository_selection;
      delete response.data.total_count;
      const namespaceKey = Object.keys(response.data)[0];
      const data = response.data[namespaceKey];
      response.data = data;
      if (typeof incompleteResults !== "undefined") {
        response.data.incomplete_results = incompleteResults;
      }
      if (typeof repositorySelection !== "undefined") {
        response.data.repository_selection = repositorySelection;
      }
      response.data.total_count = totalCount;
      return response;
    }
    function iterator(octokit, route, parameters) {
      const options = typeof route === "function" ? route.endpoint(parameters) : octokit.request.endpoint(route, parameters);
      const requestMethod = typeof route === "function" ? route : octokit.request;
      const method = options.method;
      const headers = options.headers;
      let url = options.url;
      return {
        [Symbol.asyncIterator]: () => ({
          async next() {
            if (!url)
              return {
                done: true
              };
            try {
              const response = await requestMethod({
                method,
                url,
                headers
              });
              const normalizedResponse = normalizePaginatedListResponse(response);
              url = ((normalizedResponse.headers.link || "").match(/<([^>]+)>;\s*rel="next"/) || [])[1];
              return {
                value: normalizedResponse
              };
            } catch (error) {
              if (error.status !== 409)
                throw error;
              url = "";
              return {
                value: {
                  status: 200,
                  headers: {},
                  data: []
                }
              };
            }
          }
        })
      };
    }
    function paginate(octokit, route, parameters, mapFn) {
      if (typeof parameters === "function") {
        mapFn = parameters;
        parameters = void 0;
      }
      return gather(octokit, [], iterator(octokit, route, parameters)[Symbol.asyncIterator](), mapFn);
    }
    function gather(octokit, results, iterator2, mapFn) {
      return iterator2.next().then((result) => {
        if (result.done) {
          return results;
        }
        let earlyExit = false;
        function done() {
          earlyExit = true;
        }
        results = results.concat(mapFn ? mapFn(result.value, done) : result.value.data);
        if (earlyExit) {
          return results;
        }
        return gather(octokit, results, iterator2, mapFn);
      });
    }
    var composePaginateRest = Object.assign(paginate, {
      iterator
    });
    var paginatingEndpoints = ["GET /app/installations", "GET /applications/grants", "GET /authorizations", "GET /enterprises/{enterprise}/actions/permissions/organizations", "GET /enterprises/{enterprise}/actions/runner-groups", "GET /enterprises/{enterprise}/actions/runner-groups/{runner_group_id}/organizations", "GET /enterprises/{enterprise}/actions/runner-groups/{runner_group_id}/runners", "GET /enterprises/{enterprise}/actions/runners", "GET /enterprises/{enterprise}/actions/runners/downloads", "GET /events", "GET /gists", "GET /gists/public", "GET /gists/starred", "GET /gists/{gist_id}/comments", "GET /gists/{gist_id}/commits", "GET /gists/{gist_id}/forks", "GET /installation/repositories", "GET /issues", "GET /marketplace_listing/plans", "GET /marketplace_listing/plans/{plan_id}/accounts", "GET /marketplace_listing/stubbed/plans", "GET /marketplace_listing/stubbed/plans/{plan_id}/accounts", "GET /networks/{owner}/{repo}/events", "GET /notifications", "GET /organizations", "GET /orgs/{org}/actions/permissions/repositories", "GET /orgs/{org}/actions/runner-groups", "GET /orgs/{org}/actions/runner-groups/{runner_group_id}/repositories", "GET /orgs/{org}/actions/runner-groups/{runner_group_id}/runners", "GET /orgs/{org}/actions/runners", "GET /orgs/{org}/actions/runners/downloads", "GET /orgs/{org}/actions/secrets", "GET /orgs/{org}/actions/secrets/{secret_name}/repositories", "GET /orgs/{org}/blocks", "GET /orgs/{org}/credential-authorizations", "GET /orgs/{org}/events", "GET /orgs/{org}/failed_invitations", "GET /orgs/{org}/hooks", "GET /orgs/{org}/installations", "GET /orgs/{org}/invitations", "GET /orgs/{org}/invitations/{invitation_id}/teams", "GET /orgs/{org}/issues", "GET /orgs/{org}/members", "GET /orgs/{org}/migrations", "GET /orgs/{org}/migrations/{migration_id}/repositories", "GET /orgs/{org}/outside_collaborators", "GET /orgs/{org}/projects", "GET /orgs/{org}/public_members", "GET /orgs/{org}/repos", "GET /orgs/{org}/team-sync/groups", "GET /orgs/{org}/teams", "GET /orgs/{org}/teams/{team_slug}/discussions", "GET /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}/comments", "GET /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}/comments/{comment_number}/reactions", "GET /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}/reactions", "GET /orgs/{org}/teams/{team_slug}/invitations", "GET /orgs/{org}/teams/{team_slug}/members", "GET /orgs/{org}/teams/{team_slug}/projects", "GET /orgs/{org}/teams/{team_slug}/repos", "GET /orgs/{org}/teams/{team_slug}/team-sync/group-mappings", "GET /orgs/{org}/teams/{team_slug}/teams", "GET /projects/columns/{column_id}/cards", "GET /projects/{project_id}/collaborators", "GET /projects/{project_id}/columns", "GET /repos/{owner}/{repo}/actions/artifacts", "GET /repos/{owner}/{repo}/actions/runners", "GET /repos/{owner}/{repo}/actions/runners/downloads", "GET /repos/{owner}/{repo}/actions/runs", "GET /repos/{owner}/{repo}/actions/runs/{run_id}/artifacts", "GET /repos/{owner}/{repo}/actions/runs/{run_id}/jobs", "GET /repos/{owner}/{repo}/actions/secrets", "GET /repos/{owner}/{repo}/actions/workflows", "GET /repos/{owner}/{repo}/actions/workflows/{workflow_id}/runs", "GET /repos/{owner}/{repo}/assignees", "GET /repos/{owner}/{repo}/branches", "GET /repos/{owner}/{repo}/check-runs/{check_run_id}/annotations", "GET /repos/{owner}/{repo}/check-suites/{check_suite_id}/check-runs", "GET /repos/{owner}/{repo}/code-scanning/alerts", "GET /repos/{owner}/{repo}/code-scanning/alerts/{alert_number}/instances", "GET /repos/{owner}/{repo}/code-scanning/analyses", "GET /repos/{owner}/{repo}/collaborators", "GET /repos/{owner}/{repo}/comments", "GET /repos/{owner}/{repo}/comments/{comment_id}/reactions", "GET /repos/{owner}/{repo}/commits", "GET /repos/{owner}/{repo}/commits/{commit_sha}/branches-where-head", "GET /repos/{owner}/{repo}/commits/{commit_sha}/comments", "GET /repos/{owner}/{repo}/commits/{commit_sha}/pulls", "GET /repos/{owner}/{repo}/commits/{ref}/check-runs", "GET /repos/{owner}/{repo}/commits/{ref}/check-suites", "GET /repos/{owner}/{repo}/commits/{ref}/statuses", "GET /repos/{owner}/{repo}/contributors", "GET /repos/{owner}/{repo}/deployments", "GET /repos/{owner}/{repo}/deployments/{deployment_id}/statuses", "GET /repos/{owner}/{repo}/events", "GET /repos/{owner}/{repo}/forks", "GET /repos/{owner}/{repo}/git/matching-refs/{ref}", "GET /repos/{owner}/{repo}/hooks", "GET /repos/{owner}/{repo}/invitations", "GET /repos/{owner}/{repo}/issues", "GET /repos/{owner}/{repo}/issues/comments", "GET /repos/{owner}/{repo}/issues/comments/{comment_id}/reactions", "GET /repos/{owner}/{repo}/issues/events", "GET /repos/{owner}/{repo}/issues/{issue_number}/comments", "GET /repos/{owner}/{repo}/issues/{issue_number}/events", "GET /repos/{owner}/{repo}/issues/{issue_number}/labels", "GET /repos/{owner}/{repo}/issues/{issue_number}/reactions", "GET /repos/{owner}/{repo}/issues/{issue_number}/timeline", "GET /repos/{owner}/{repo}/keys", "GET /repos/{owner}/{repo}/labels", "GET /repos/{owner}/{repo}/milestones", "GET /repos/{owner}/{repo}/milestones/{milestone_number}/labels", "GET /repos/{owner}/{repo}/notifications", "GET /repos/{owner}/{repo}/pages/builds", "GET /repos/{owner}/{repo}/projects", "GET /repos/{owner}/{repo}/pulls", "GET /repos/{owner}/{repo}/pulls/comments", "GET /repos/{owner}/{repo}/pulls/comments/{comment_id}/reactions", "GET /repos/{owner}/{repo}/pulls/{pull_number}/comments", "GET /repos/{owner}/{repo}/pulls/{pull_number}/commits", "GET /repos/{owner}/{repo}/pulls/{pull_number}/files", "GET /repos/{owner}/{repo}/pulls/{pull_number}/requested_reviewers", "GET /repos/{owner}/{repo}/pulls/{pull_number}/reviews", "GET /repos/{owner}/{repo}/pulls/{pull_number}/reviews/{review_id}/comments", "GET /repos/{owner}/{repo}/releases", "GET /repos/{owner}/{repo}/releases/{release_id}/assets", "GET /repos/{owner}/{repo}/secret-scanning/alerts", "GET /repos/{owner}/{repo}/stargazers", "GET /repos/{owner}/{repo}/subscribers", "GET /repos/{owner}/{repo}/tags", "GET /repos/{owner}/{repo}/teams", "GET /repositories", "GET /repositories/{repository_id}/environments/{environment_name}/secrets", "GET /scim/v2/enterprises/{enterprise}/Groups", "GET /scim/v2/enterprises/{enterprise}/Users", "GET /scim/v2/organizations/{org}/Users", "GET /search/code", "GET /search/commits", "GET /search/issues", "GET /search/labels", "GET /search/repositories", "GET /search/topics", "GET /search/users", "GET /teams/{team_id}/discussions", "GET /teams/{team_id}/discussions/{discussion_number}/comments", "GET /teams/{team_id}/discussions/{discussion_number}/comments/{comment_number}/reactions", "GET /teams/{team_id}/discussions/{discussion_number}/reactions", "GET /teams/{team_id}/invitations", "GET /teams/{team_id}/members", "GET /teams/{team_id}/projects", "GET /teams/{team_id}/repos", "GET /teams/{team_id}/team-sync/group-mappings", "GET /teams/{team_id}/teams", "GET /user/blocks", "GET /user/emails", "GET /user/followers", "GET /user/following", "GET /user/gpg_keys", "GET /user/installations", "GET /user/installations/{installation_id}/repositories", "GET /user/issues", "GET /user/keys", "GET /user/marketplace_purchases", "GET /user/marketplace_purchases/stubbed", "GET /user/memberships/orgs", "GET /user/migrations", "GET /user/migrations/{migration_id}/repositories", "GET /user/orgs", "GET /user/public_emails", "GET /user/repos", "GET /user/repository_invitations", "GET /user/starred", "GET /user/subscriptions", "GET /user/teams", "GET /users", "GET /users/{username}/events", "GET /users/{username}/events/orgs/{org}", "GET /users/{username}/events/public", "GET /users/{username}/followers", "GET /users/{username}/following", "GET /users/{username}/gists", "GET /users/{username}/gpg_keys", "GET /users/{username}/keys", "GET /users/{username}/orgs", "GET /users/{username}/projects", "GET /users/{username}/received_events", "GET /users/{username}/received_events/public", "GET /users/{username}/repos", "GET /users/{username}/starred", "GET /users/{username}/subscriptions"];
    function isPaginatingEndpoint(arg) {
      if (typeof arg === "string") {
        return paginatingEndpoints.includes(arg);
      } else {
        return false;
      }
    }
    function paginateRest(octokit) {
      return {
        paginate: Object.assign(paginate.bind(null, octokit), {
          iterator: iterator.bind(null, octokit)
        })
      };
    }
    paginateRest.VERSION = VERSION;
    exports2.composePaginateRest = composePaginateRest;
    exports2.isPaginatingEndpoint = isPaginatingEndpoint;
    exports2.paginateRest = paginateRest;
    exports2.paginatingEndpoints = paginatingEndpoints;
  }
});

// node_modules/@actions/github/lib/utils.js
var require_utils3 = __commonJS({
  "node_modules/@actions/github/lib/utils.js"(exports2) {
    "use strict";
    var __createBinding = exports2 && exports2.__createBinding || (Object.create ? function(o, m, k, k2) {
      if (k2 === void 0)
        k2 = k;
      Object.defineProperty(o, k2, { enumerable: true, get: function() {
        return m[k];
      } });
    } : function(o, m, k, k2) {
      if (k2 === void 0)
        k2 = k;
      o[k2] = m[k];
    });
    var __setModuleDefault = exports2 && exports2.__setModuleDefault || (Object.create ? function(o, v) {
      Object.defineProperty(o, "default", { enumerable: true, value: v });
    } : function(o, v) {
      o["default"] = v;
    });
    var __importStar = exports2 && exports2.__importStar || function(mod) {
      if (mod && mod.__esModule)
        return mod;
      var result = {};
      if (mod != null) {
        for (var k in mod)
          if (k !== "default" && Object.hasOwnProperty.call(mod, k))
            __createBinding(result, mod, k);
      }
      __setModuleDefault(result, mod);
      return result;
    };
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.getOctokitOptions = exports2.GitHub = exports2.context = void 0;
    var Context = __importStar(require_context());
    var Utils = __importStar(require_utils2());
    var core_1 = require_dist_node8();
    var plugin_rest_endpoint_methods_1 = require_dist_node9();
    var plugin_paginate_rest_1 = require_dist_node10();
    exports2.context = new Context.Context();
    var baseUrl = Utils.getApiBaseUrl();
    var defaults = {
      baseUrl,
      request: {
        agent: Utils.getProxyAgent(baseUrl)
      }
    };
    exports2.GitHub = core_1.Octokit.plugin(plugin_rest_endpoint_methods_1.restEndpointMethods, plugin_paginate_rest_1.paginateRest).defaults(defaults);
    function getOctokitOptions(token, options) {
      const opts = Object.assign({}, options || {});
      const auth = Utils.getAuthString(token, opts);
      if (auth) {
        opts.auth = auth;
      }
      return opts;
    }
    exports2.getOctokitOptions = getOctokitOptions;
  }
});

// node_modules/@actions/github/lib/github.js
var require_github = __commonJS({
  "node_modules/@actions/github/lib/github.js"(exports2) {
    "use strict";
    var __createBinding = exports2 && exports2.__createBinding || (Object.create ? function(o, m, k, k2) {
      if (k2 === void 0)
        k2 = k;
      Object.defineProperty(o, k2, { enumerable: true, get: function() {
        return m[k];
      } });
    } : function(o, m, k, k2) {
      if (k2 === void 0)
        k2 = k;
      o[k2] = m[k];
    });
    var __setModuleDefault = exports2 && exports2.__setModuleDefault || (Object.create ? function(o, v) {
      Object.defineProperty(o, "default", { enumerable: true, value: v });
    } : function(o, v) {
      o["default"] = v;
    });
    var __importStar = exports2 && exports2.__importStar || function(mod) {
      if (mod && mod.__esModule)
        return mod;
      var result = {};
      if (mod != null) {
        for (var k in mod)
          if (k !== "default" && Object.hasOwnProperty.call(mod, k))
            __createBinding(result, mod, k);
      }
      __setModuleDefault(result, mod);
      return result;
    };
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.getOctokit = exports2.context = void 0;
    var Context = __importStar(require_context());
    var utils_1 = require_utils3();
    exports2.context = new Context.Context();
    function getOctokit2(token, options) {
      return new utils_1.GitHub(utils_1.getOctokitOptions(token, options));
    }
    exports2.getOctokit = getOctokit2;
  }
});

// node_modules/@actions/io/lib/io-util.js
var require_io_util = __commonJS({
  "node_modules/@actions/io/lib/io-util.js"(exports2) {
    "use strict";
    var __createBinding = exports2 && exports2.__createBinding || (Object.create ? function(o, m, k, k2) {
      if (k2 === void 0)
        k2 = k;
      Object.defineProperty(o, k2, { enumerable: true, get: function() {
        return m[k];
      } });
    } : function(o, m, k, k2) {
      if (k2 === void 0)
        k2 = k;
      o[k2] = m[k];
    });
    var __setModuleDefault = exports2 && exports2.__setModuleDefault || (Object.create ? function(o, v) {
      Object.defineProperty(o, "default", { enumerable: true, value: v });
    } : function(o, v) {
      o["default"] = v;
    });
    var __importStar = exports2 && exports2.__importStar || function(mod) {
      if (mod && mod.__esModule)
        return mod;
      var result = {};
      if (mod != null) {
        for (var k in mod)
          if (k !== "default" && Object.hasOwnProperty.call(mod, k))
            __createBinding(result, mod, k);
      }
      __setModuleDefault(result, mod);
      return result;
    };
    var __awaiter = exports2 && exports2.__awaiter || function(thisArg, _arguments, P, generator) {
      function adopt(value) {
        return value instanceof P ? value : new P(function(resolve2) {
          resolve2(value);
        });
      }
      return new (P || (P = Promise))(function(resolve2, reject) {
        function fulfilled(value) {
          try {
            step(generator.next(value));
          } catch (e) {
            reject(e);
          }
        }
        function rejected(value) {
          try {
            step(generator["throw"](value));
          } catch (e) {
            reject(e);
          }
        }
        function step(result) {
          result.done ? resolve2(result.value) : adopt(result.value).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
      });
    };
    var _a;
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.getCmdPath = exports2.tryGetExecutablePath = exports2.isRooted = exports2.isDirectory = exports2.exists = exports2.IS_WINDOWS = exports2.unlink = exports2.symlink = exports2.stat = exports2.rmdir = exports2.rename = exports2.readlink = exports2.readdir = exports2.mkdir = exports2.lstat = exports2.copyFile = exports2.chmod = void 0;
    var fs6 = __importStar(require("fs"));
    var path7 = __importStar(require("path"));
    _a = fs6.promises, exports2.chmod = _a.chmod, exports2.copyFile = _a.copyFile, exports2.lstat = _a.lstat, exports2.mkdir = _a.mkdir, exports2.readdir = _a.readdir, exports2.readlink = _a.readlink, exports2.rename = _a.rename, exports2.rmdir = _a.rmdir, exports2.stat = _a.stat, exports2.symlink = _a.symlink, exports2.unlink = _a.unlink;
    exports2.IS_WINDOWS = process.platform === "win32";
    function exists(fsPath) {
      return __awaiter(this, void 0, void 0, function* () {
        try {
          yield exports2.stat(fsPath);
        } catch (err) {
          if (err.code === "ENOENT") {
            return false;
          }
          throw err;
        }
        return true;
      });
    }
    exports2.exists = exists;
    function isDirectory(fsPath, useStat = false) {
      return __awaiter(this, void 0, void 0, function* () {
        const stats = useStat ? yield exports2.stat(fsPath) : yield exports2.lstat(fsPath);
        return stats.isDirectory();
      });
    }
    exports2.isDirectory = isDirectory;
    function isRooted(p) {
      p = normalizeSeparators(p);
      if (!p) {
        throw new Error('isRooted() parameter "p" cannot be empty');
      }
      if (exports2.IS_WINDOWS) {
        return p.startsWith("\\") || /^[A-Z]:/i.test(p);
      }
      return p.startsWith("/");
    }
    exports2.isRooted = isRooted;
    function tryGetExecutablePath(filePath, extensions) {
      return __awaiter(this, void 0, void 0, function* () {
        let stats = void 0;
        try {
          stats = yield exports2.stat(filePath);
        } catch (err) {
          if (err.code !== "ENOENT") {
            console.log(`Unexpected error attempting to determine if executable file exists '${filePath}': ${err}`);
          }
        }
        if (stats && stats.isFile()) {
          if (exports2.IS_WINDOWS) {
            const upperExt = path7.extname(filePath).toUpperCase();
            if (extensions.some((validExt) => validExt.toUpperCase() === upperExt)) {
              return filePath;
            }
          } else {
            if (isUnixExecutable(stats)) {
              return filePath;
            }
          }
        }
        const originalFilePath = filePath;
        for (const extension of extensions) {
          filePath = originalFilePath + extension;
          stats = void 0;
          try {
            stats = yield exports2.stat(filePath);
          } catch (err) {
            if (err.code !== "ENOENT") {
              console.log(`Unexpected error attempting to determine if executable file exists '${filePath}': ${err}`);
            }
          }
          if (stats && stats.isFile()) {
            if (exports2.IS_WINDOWS) {
              try {
                const directory = path7.dirname(filePath);
                const upperName = path7.basename(filePath).toUpperCase();
                for (const actualName of yield exports2.readdir(directory)) {
                  if (upperName === actualName.toUpperCase()) {
                    filePath = path7.join(directory, actualName);
                    break;
                  }
                }
              } catch (err) {
                console.log(`Unexpected error attempting to determine the actual case of the file '${filePath}': ${err}`);
              }
              return filePath;
            } else {
              if (isUnixExecutable(stats)) {
                return filePath;
              }
            }
          }
        }
        return "";
      });
    }
    exports2.tryGetExecutablePath = tryGetExecutablePath;
    function normalizeSeparators(p) {
      p = p || "";
      if (exports2.IS_WINDOWS) {
        p = p.replace(/\//g, "\\");
        return p.replace(/\\\\+/g, "\\");
      }
      return p.replace(/\/\/+/g, "/");
    }
    function isUnixExecutable(stats) {
      return (stats.mode & 1) > 0 || (stats.mode & 8) > 0 && stats.gid === process.getgid() || (stats.mode & 64) > 0 && stats.uid === process.getuid();
    }
    function getCmdPath() {
      var _a2;
      return (_a2 = process.env["COMSPEC"]) !== null && _a2 !== void 0 ? _a2 : `cmd.exe`;
    }
    exports2.getCmdPath = getCmdPath;
  }
});

// node_modules/@actions/io/lib/io.js
var require_io = __commonJS({
  "node_modules/@actions/io/lib/io.js"(exports2) {
    "use strict";
    var __createBinding = exports2 && exports2.__createBinding || (Object.create ? function(o, m, k, k2) {
      if (k2 === void 0)
        k2 = k;
      Object.defineProperty(o, k2, { enumerable: true, get: function() {
        return m[k];
      } });
    } : function(o, m, k, k2) {
      if (k2 === void 0)
        k2 = k;
      o[k2] = m[k];
    });
    var __setModuleDefault = exports2 && exports2.__setModuleDefault || (Object.create ? function(o, v) {
      Object.defineProperty(o, "default", { enumerable: true, value: v });
    } : function(o, v) {
      o["default"] = v;
    });
    var __importStar = exports2 && exports2.__importStar || function(mod) {
      if (mod && mod.__esModule)
        return mod;
      var result = {};
      if (mod != null) {
        for (var k in mod)
          if (k !== "default" && Object.hasOwnProperty.call(mod, k))
            __createBinding(result, mod, k);
      }
      __setModuleDefault(result, mod);
      return result;
    };
    var __awaiter = exports2 && exports2.__awaiter || function(thisArg, _arguments, P, generator) {
      function adopt(value) {
        return value instanceof P ? value : new P(function(resolve2) {
          resolve2(value);
        });
      }
      return new (P || (P = Promise))(function(resolve2, reject) {
        function fulfilled(value) {
          try {
            step(generator.next(value));
          } catch (e) {
            reject(e);
          }
        }
        function rejected(value) {
          try {
            step(generator["throw"](value));
          } catch (e) {
            reject(e);
          }
        }
        function step(result) {
          result.done ? resolve2(result.value) : adopt(result.value).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
      });
    };
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.findInPath = exports2.which = exports2.mkdirP = exports2.rmRF = exports2.mv = exports2.cp = void 0;
    var assert_1 = require("assert");
    var childProcess = __importStar(require("child_process"));
    var path7 = __importStar(require("path"));
    var util_1 = require("util");
    var ioUtil = __importStar(require_io_util());
    var exec6 = util_1.promisify(childProcess.exec);
    var execFile = util_1.promisify(childProcess.execFile);
    function cp3(source, dest, options = {}) {
      return __awaiter(this, void 0, void 0, function* () {
        const { force, recursive, copySourceDirectory } = readCopyOptions(options);
        const destStat = (yield ioUtil.exists(dest)) ? yield ioUtil.stat(dest) : null;
        if (destStat && destStat.isFile() && !force) {
          return;
        }
        const newDest = destStat && destStat.isDirectory() && copySourceDirectory ? path7.join(dest, path7.basename(source)) : dest;
        if (!(yield ioUtil.exists(source))) {
          throw new Error(`no such file or directory: ${source}`);
        }
        const sourceStat = yield ioUtil.stat(source);
        if (sourceStat.isDirectory()) {
          if (!recursive) {
            throw new Error(`Failed to copy. ${source} is a directory, but tried to copy without recursive flag.`);
          } else {
            yield cpDirRecursive(source, newDest, 0, force);
          }
        } else {
          if (path7.relative(source, newDest) === "") {
            throw new Error(`'${newDest}' and '${source}' are the same file`);
          }
          yield copyFile(source, newDest, force);
        }
      });
    }
    exports2.cp = cp3;
    function mv2(source, dest, options = {}) {
      return __awaiter(this, void 0, void 0, function* () {
        if (yield ioUtil.exists(dest)) {
          let destExists = true;
          if (yield ioUtil.isDirectory(dest)) {
            dest = path7.join(dest, path7.basename(source));
            destExists = yield ioUtil.exists(dest);
          }
          if (destExists) {
            if (options.force == null || options.force) {
              yield rmRF5(dest);
            } else {
              throw new Error("Destination already exists");
            }
          }
        }
        yield mkdirP3(path7.dirname(dest));
        yield ioUtil.rename(source, dest);
      });
    }
    exports2.mv = mv2;
    function rmRF5(inputPath) {
      return __awaiter(this, void 0, void 0, function* () {
        if (ioUtil.IS_WINDOWS) {
          if (/[*"<>|]/.test(inputPath)) {
            throw new Error('File path must not contain `*`, `"`, `<`, `>` or `|` on Windows');
          }
          try {
            const cmdPath = ioUtil.getCmdPath();
            if (yield ioUtil.isDirectory(inputPath, true)) {
              yield exec6(`${cmdPath} /s /c "rd /s /q "%inputPath%""`, {
                env: { inputPath }
              });
            } else {
              yield exec6(`${cmdPath} /s /c "del /f /a "%inputPath%""`, {
                env: { inputPath }
              });
            }
          } catch (err) {
            if (err.code !== "ENOENT")
              throw err;
          }
          try {
            yield ioUtil.unlink(inputPath);
          } catch (err) {
            if (err.code !== "ENOENT")
              throw err;
          }
        } else {
          let isDir = false;
          try {
            isDir = yield ioUtil.isDirectory(inputPath);
          } catch (err) {
            if (err.code !== "ENOENT")
              throw err;
            return;
          }
          if (isDir) {
            yield execFile(`rm`, [`-rf`, `${inputPath}`]);
          } else {
            yield ioUtil.unlink(inputPath);
          }
        }
      });
    }
    exports2.rmRF = rmRF5;
    function mkdirP3(fsPath) {
      return __awaiter(this, void 0, void 0, function* () {
        assert_1.ok(fsPath, "a path argument must be provided");
        yield ioUtil.mkdir(fsPath, { recursive: true });
      });
    }
    exports2.mkdirP = mkdirP3;
    function which3(tool, check) {
      return __awaiter(this, void 0, void 0, function* () {
        if (!tool) {
          throw new Error("parameter 'tool' is required");
        }
        if (check) {
          const result = yield which3(tool, false);
          if (!result) {
            if (ioUtil.IS_WINDOWS) {
              throw new Error(`Unable to locate executable file: ${tool}. Please verify either the file path exists or the file can be found within a directory specified by the PATH environment variable. Also verify the file has a valid extension for an executable file.`);
            } else {
              throw new Error(`Unable to locate executable file: ${tool}. Please verify either the file path exists or the file can be found within a directory specified by the PATH environment variable. Also check the file mode to verify the file is executable.`);
            }
          }
          return result;
        }
        const matches = yield findInPath(tool);
        if (matches && matches.length > 0) {
          return matches[0];
        }
        return "";
      });
    }
    exports2.which = which3;
    function findInPath(tool) {
      return __awaiter(this, void 0, void 0, function* () {
        if (!tool) {
          throw new Error("parameter 'tool' is required");
        }
        const extensions = [];
        if (ioUtil.IS_WINDOWS && process.env["PATHEXT"]) {
          for (const extension of process.env["PATHEXT"].split(path7.delimiter)) {
            if (extension) {
              extensions.push(extension);
            }
          }
        }
        if (ioUtil.isRooted(tool)) {
          const filePath = yield ioUtil.tryGetExecutablePath(tool, extensions);
          if (filePath) {
            return [filePath];
          }
          return [];
        }
        if (tool.includes(path7.sep)) {
          return [];
        }
        const directories = [];
        if (process.env.PATH) {
          for (const p of process.env.PATH.split(path7.delimiter)) {
            if (p) {
              directories.push(p);
            }
          }
        }
        const matches = [];
        for (const directory of directories) {
          const filePath = yield ioUtil.tryGetExecutablePath(path7.join(directory, tool), extensions);
          if (filePath) {
            matches.push(filePath);
          }
        }
        return matches;
      });
    }
    exports2.findInPath = findInPath;
    function readCopyOptions(options) {
      const force = options.force == null ? true : options.force;
      const recursive = Boolean(options.recursive);
      const copySourceDirectory = options.copySourceDirectory == null ? true : Boolean(options.copySourceDirectory);
      return { force, recursive, copySourceDirectory };
    }
    function cpDirRecursive(sourceDir, destDir, currentDepth, force) {
      return __awaiter(this, void 0, void 0, function* () {
        if (currentDepth >= 255)
          return;
        currentDepth++;
        yield mkdirP3(destDir);
        const files = yield ioUtil.readdir(sourceDir);
        for (const fileName of files) {
          const srcFile = `${sourceDir}/${fileName}`;
          const destFile = `${destDir}/${fileName}`;
          const srcFileStat = yield ioUtil.lstat(srcFile);
          if (srcFileStat.isDirectory()) {
            yield cpDirRecursive(srcFile, destFile, currentDepth, force);
          } else {
            yield copyFile(srcFile, destFile, force);
          }
        }
        yield ioUtil.chmod(destDir, (yield ioUtil.stat(sourceDir)).mode);
      });
    }
    function copyFile(srcFile, destFile, force) {
      return __awaiter(this, void 0, void 0, function* () {
        if ((yield ioUtil.lstat(srcFile)).isSymbolicLink()) {
          try {
            yield ioUtil.lstat(destFile);
            yield ioUtil.unlink(destFile);
          } catch (e) {
            if (e.code === "EPERM") {
              yield ioUtil.chmod(destFile, "0666");
              yield ioUtil.unlink(destFile);
            }
          }
          const symlinkFull = yield ioUtil.readlink(srcFile);
          yield ioUtil.symlink(symlinkFull, destFile, ioUtil.IS_WINDOWS ? "junction" : null);
        } else if (!(yield ioUtil.exists(destFile)) || force) {
          yield ioUtil.copyFile(srcFile, destFile);
        }
      });
    }
  }
});

// node_modules/@actions/exec/lib/toolrunner.js
var require_toolrunner = __commonJS({
  "node_modules/@actions/exec/lib/toolrunner.js"(exports2) {
    "use strict";
    var __createBinding = exports2 && exports2.__createBinding || (Object.create ? function(o, m, k, k2) {
      if (k2 === void 0)
        k2 = k;
      Object.defineProperty(o, k2, { enumerable: true, get: function() {
        return m[k];
      } });
    } : function(o, m, k, k2) {
      if (k2 === void 0)
        k2 = k;
      o[k2] = m[k];
    });
    var __setModuleDefault = exports2 && exports2.__setModuleDefault || (Object.create ? function(o, v) {
      Object.defineProperty(o, "default", { enumerable: true, value: v });
    } : function(o, v) {
      o["default"] = v;
    });
    var __importStar = exports2 && exports2.__importStar || function(mod) {
      if (mod && mod.__esModule)
        return mod;
      var result = {};
      if (mod != null) {
        for (var k in mod)
          if (k !== "default" && Object.hasOwnProperty.call(mod, k))
            __createBinding(result, mod, k);
      }
      __setModuleDefault(result, mod);
      return result;
    };
    var __awaiter = exports2 && exports2.__awaiter || function(thisArg, _arguments, P, generator) {
      function adopt(value) {
        return value instanceof P ? value : new P(function(resolve2) {
          resolve2(value);
        });
      }
      return new (P || (P = Promise))(function(resolve2, reject) {
        function fulfilled(value) {
          try {
            step(generator.next(value));
          } catch (e) {
            reject(e);
          }
        }
        function rejected(value) {
          try {
            step(generator["throw"](value));
          } catch (e) {
            reject(e);
          }
        }
        function step(result) {
          result.done ? resolve2(result.value) : adopt(result.value).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
      });
    };
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.argStringToArray = exports2.ToolRunner = void 0;
    var os2 = __importStar(require("os"));
    var events = __importStar(require("events"));
    var child = __importStar(require("child_process"));
    var path7 = __importStar(require("path"));
    var io6 = __importStar(require_io());
    var ioUtil = __importStar(require_io_util());
    var timers_1 = require("timers");
    var IS_WINDOWS3 = process.platform === "win32";
    var ToolRunner = class extends events.EventEmitter {
      constructor(toolPath, args, options) {
        super();
        if (!toolPath) {
          throw new Error("Parameter 'toolPath' cannot be null or empty.");
        }
        this.toolPath = toolPath;
        this.args = args || [];
        this.options = options || {};
      }
      _debug(message) {
        if (this.options.listeners && this.options.listeners.debug) {
          this.options.listeners.debug(message);
        }
      }
      _getCommandString(options, noPrefix) {
        const toolPath = this._getSpawnFileName();
        const args = this._getSpawnArgs(options);
        let cmd = noPrefix ? "" : "[command]";
        if (IS_WINDOWS3) {
          if (this._isCmdFile()) {
            cmd += toolPath;
            for (const a of args) {
              cmd += ` ${a}`;
            }
          } else if (options.windowsVerbatimArguments) {
            cmd += `"${toolPath}"`;
            for (const a of args) {
              cmd += ` ${a}`;
            }
          } else {
            cmd += this._windowsQuoteCmdArg(toolPath);
            for (const a of args) {
              cmd += ` ${this._windowsQuoteCmdArg(a)}`;
            }
          }
        } else {
          cmd += toolPath;
          for (const a of args) {
            cmd += ` ${a}`;
          }
        }
        return cmd;
      }
      _processLineBuffer(data, strBuffer, onLine) {
        try {
          let s = strBuffer + data.toString();
          let n = s.indexOf(os2.EOL);
          while (n > -1) {
            const line = s.substring(0, n);
            onLine(line);
            s = s.substring(n + os2.EOL.length);
            n = s.indexOf(os2.EOL);
          }
          return s;
        } catch (err) {
          this._debug(`error processing line. Failed with error ${err}`);
          return "";
        }
      }
      _getSpawnFileName() {
        if (IS_WINDOWS3) {
          if (this._isCmdFile()) {
            return process.env["COMSPEC"] || "cmd.exe";
          }
        }
        return this.toolPath;
      }
      _getSpawnArgs(options) {
        if (IS_WINDOWS3) {
          if (this._isCmdFile()) {
            let argline = `/D /S /C "${this._windowsQuoteCmdArg(this.toolPath)}`;
            for (const a of this.args) {
              argline += " ";
              argline += options.windowsVerbatimArguments ? a : this._windowsQuoteCmdArg(a);
            }
            argline += '"';
            return [argline];
          }
        }
        return this.args;
      }
      _endsWith(str2, end) {
        return str2.endsWith(end);
      }
      _isCmdFile() {
        const upperToolPath = this.toolPath.toUpperCase();
        return this._endsWith(upperToolPath, ".CMD") || this._endsWith(upperToolPath, ".BAT");
      }
      _windowsQuoteCmdArg(arg) {
        if (!this._isCmdFile()) {
          return this._uvQuoteCmdArg(arg);
        }
        if (!arg) {
          return '""';
        }
        const cmdSpecialChars = [
          " ",
          "	",
          "&",
          "(",
          ")",
          "[",
          "]",
          "{",
          "}",
          "^",
          "=",
          ";",
          "!",
          "'",
          "+",
          ",",
          "`",
          "~",
          "|",
          "<",
          ">",
          '"'
        ];
        let needsQuotes = false;
        for (const char of arg) {
          if (cmdSpecialChars.some((x) => x === char)) {
            needsQuotes = true;
            break;
          }
        }
        if (!needsQuotes) {
          return arg;
        }
        let reverse = '"';
        let quoteHit = true;
        for (let i = arg.length; i > 0; i--) {
          reverse += arg[i - 1];
          if (quoteHit && arg[i - 1] === "\\") {
            reverse += "\\";
          } else if (arg[i - 1] === '"') {
            quoteHit = true;
            reverse += '"';
          } else {
            quoteHit = false;
          }
        }
        reverse += '"';
        return reverse.split("").reverse().join("");
      }
      _uvQuoteCmdArg(arg) {
        if (!arg) {
          return '""';
        }
        if (!arg.includes(" ") && !arg.includes("	") && !arg.includes('"')) {
          return arg;
        }
        if (!arg.includes('"') && !arg.includes("\\")) {
          return `"${arg}"`;
        }
        let reverse = '"';
        let quoteHit = true;
        for (let i = arg.length; i > 0; i--) {
          reverse += arg[i - 1];
          if (quoteHit && arg[i - 1] === "\\") {
            reverse += "\\";
          } else if (arg[i - 1] === '"') {
            quoteHit = true;
            reverse += "\\";
          } else {
            quoteHit = false;
          }
        }
        reverse += '"';
        return reverse.split("").reverse().join("");
      }
      _cloneExecOptions(options) {
        options = options || {};
        const result = {
          cwd: options.cwd || process.cwd(),
          env: options.env || process.env,
          silent: options.silent || false,
          windowsVerbatimArguments: options.windowsVerbatimArguments || false,
          failOnStdErr: options.failOnStdErr || false,
          ignoreReturnCode: options.ignoreReturnCode || false,
          delay: options.delay || 1e4
        };
        result.outStream = options.outStream || process.stdout;
        result.errStream = options.errStream || process.stderr;
        return result;
      }
      _getSpawnOptions(options, toolPath) {
        options = options || {};
        const result = {};
        result.cwd = options.cwd;
        result.env = options.env;
        result["windowsVerbatimArguments"] = options.windowsVerbatimArguments || this._isCmdFile();
        if (options.windowsVerbatimArguments) {
          result.argv0 = `"${toolPath}"`;
        }
        return result;
      }
      exec() {
        return __awaiter(this, void 0, void 0, function* () {
          if (!ioUtil.isRooted(this.toolPath) && (this.toolPath.includes("/") || IS_WINDOWS3 && this.toolPath.includes("\\"))) {
            this.toolPath = path7.resolve(process.cwd(), this.options.cwd || process.cwd(), this.toolPath);
          }
          this.toolPath = yield io6.which(this.toolPath, true);
          return new Promise((resolve2, reject) => __awaiter(this, void 0, void 0, function* () {
            this._debug(`exec tool: ${this.toolPath}`);
            this._debug("arguments:");
            for (const arg of this.args) {
              this._debug(`   ${arg}`);
            }
            const optionsNonNull = this._cloneExecOptions(this.options);
            if (!optionsNonNull.silent && optionsNonNull.outStream) {
              optionsNonNull.outStream.write(this._getCommandString(optionsNonNull) + os2.EOL);
            }
            const state = new ExecState(optionsNonNull, this.toolPath);
            state.on("debug", (message) => {
              this._debug(message);
            });
            if (this.options.cwd && !(yield ioUtil.exists(this.options.cwd))) {
              return reject(new Error(`The cwd: ${this.options.cwd} does not exist!`));
            }
            const fileName = this._getSpawnFileName();
            const cp3 = child.spawn(fileName, this._getSpawnArgs(optionsNonNull), this._getSpawnOptions(this.options, fileName));
            let stdbuffer = "";
            if (cp3.stdout) {
              cp3.stdout.on("data", (data) => {
                if (this.options.listeners && this.options.listeners.stdout) {
                  this.options.listeners.stdout(data);
                }
                if (!optionsNonNull.silent && optionsNonNull.outStream) {
                  optionsNonNull.outStream.write(data);
                }
                stdbuffer = this._processLineBuffer(data, stdbuffer, (line) => {
                  if (this.options.listeners && this.options.listeners.stdline) {
                    this.options.listeners.stdline(line);
                  }
                });
              });
            }
            let errbuffer = "";
            if (cp3.stderr) {
              cp3.stderr.on("data", (data) => {
                state.processStderr = true;
                if (this.options.listeners && this.options.listeners.stderr) {
                  this.options.listeners.stderr(data);
                }
                if (!optionsNonNull.silent && optionsNonNull.errStream && optionsNonNull.outStream) {
                  const s = optionsNonNull.failOnStdErr ? optionsNonNull.errStream : optionsNonNull.outStream;
                  s.write(data);
                }
                errbuffer = this._processLineBuffer(data, errbuffer, (line) => {
                  if (this.options.listeners && this.options.listeners.errline) {
                    this.options.listeners.errline(line);
                  }
                });
              });
            }
            cp3.on("error", (err) => {
              state.processError = err.message;
              state.processExited = true;
              state.processClosed = true;
              state.CheckComplete();
            });
            cp3.on("exit", (code) => {
              state.processExitCode = code;
              state.processExited = true;
              this._debug(`Exit code ${code} received from tool '${this.toolPath}'`);
              state.CheckComplete();
            });
            cp3.on("close", (code) => {
              state.processExitCode = code;
              state.processExited = true;
              state.processClosed = true;
              this._debug(`STDIO streams have closed for tool '${this.toolPath}'`);
              state.CheckComplete();
            });
            state.on("done", (error, exitCode) => {
              if (stdbuffer.length > 0) {
                this.emit("stdline", stdbuffer);
              }
              if (errbuffer.length > 0) {
                this.emit("errline", errbuffer);
              }
              cp3.removeAllListeners();
              if (error) {
                reject(error);
              } else {
                resolve2(exitCode);
              }
            });
            if (this.options.input) {
              if (!cp3.stdin) {
                throw new Error("child process missing stdin");
              }
              cp3.stdin.end(this.options.input);
            }
          }));
        });
      }
    };
    exports2.ToolRunner = ToolRunner;
    function argStringToArray(argString) {
      const args = [];
      let inQuotes = false;
      let escaped = false;
      let arg = "";
      function append(c) {
        if (escaped && c !== '"') {
          arg += "\\";
        }
        arg += c;
        escaped = false;
      }
      for (let i = 0; i < argString.length; i++) {
        const c = argString.charAt(i);
        if (c === '"') {
          if (!escaped) {
            inQuotes = !inQuotes;
          } else {
            append(c);
          }
          continue;
        }
        if (c === "\\" && escaped) {
          append(c);
          continue;
        }
        if (c === "\\" && inQuotes) {
          escaped = true;
          continue;
        }
        if (c === " " && !inQuotes) {
          if (arg.length > 0) {
            args.push(arg);
            arg = "";
          }
          continue;
        }
        append(c);
      }
      if (arg.length > 0) {
        args.push(arg.trim());
      }
      return args;
    }
    exports2.argStringToArray = argStringToArray;
    var ExecState = class extends events.EventEmitter {
      constructor(options, toolPath) {
        super();
        this.processClosed = false;
        this.processError = "";
        this.processExitCode = 0;
        this.processExited = false;
        this.processStderr = false;
        this.delay = 1e4;
        this.done = false;
        this.timeout = null;
        if (!toolPath) {
          throw new Error("toolPath must not be empty");
        }
        this.options = options;
        this.toolPath = toolPath;
        if (options.delay) {
          this.delay = options.delay;
        }
      }
      CheckComplete() {
        if (this.done) {
          return;
        }
        if (this.processClosed) {
          this._setResult();
        } else if (this.processExited) {
          this.timeout = timers_1.setTimeout(ExecState.HandleTimeout, this.delay, this);
        }
      }
      _debug(message) {
        this.emit("debug", message);
      }
      _setResult() {
        let error;
        if (this.processExited) {
          if (this.processError) {
            error = new Error(`There was an error when attempting to execute the process '${this.toolPath}'. This may indicate the process failed to start. Error: ${this.processError}`);
          } else if (this.processExitCode !== 0 && !this.options.ignoreReturnCode) {
            error = new Error(`The process '${this.toolPath}' failed with exit code ${this.processExitCode}`);
          } else if (this.processStderr && this.options.failOnStdErr) {
            error = new Error(`The process '${this.toolPath}' failed because one or more lines were written to the STDERR stream`);
          }
        }
        if (this.timeout) {
          clearTimeout(this.timeout);
          this.timeout = null;
        }
        this.done = true;
        this.emit("done", error, this.processExitCode);
      }
      static HandleTimeout(state) {
        if (state.done) {
          return;
        }
        if (!state.processClosed && state.processExited) {
          const message = `The STDIO streams did not close within ${state.delay / 1e3} seconds of the exit event from process '${state.toolPath}'. This may indicate a child process inherited the STDIO streams and has not yet exited.`;
          state._debug(message);
        }
        state._setResult();
      }
    };
  }
});

// node_modules/@actions/exec/lib/exec.js
var require_exec = __commonJS({
  "node_modules/@actions/exec/lib/exec.js"(exports2) {
    "use strict";
    var __createBinding = exports2 && exports2.__createBinding || (Object.create ? function(o, m, k, k2) {
      if (k2 === void 0)
        k2 = k;
      Object.defineProperty(o, k2, { enumerable: true, get: function() {
        return m[k];
      } });
    } : function(o, m, k, k2) {
      if (k2 === void 0)
        k2 = k;
      o[k2] = m[k];
    });
    var __setModuleDefault = exports2 && exports2.__setModuleDefault || (Object.create ? function(o, v) {
      Object.defineProperty(o, "default", { enumerable: true, value: v });
    } : function(o, v) {
      o["default"] = v;
    });
    var __importStar = exports2 && exports2.__importStar || function(mod) {
      if (mod && mod.__esModule)
        return mod;
      var result = {};
      if (mod != null) {
        for (var k in mod)
          if (k !== "default" && Object.hasOwnProperty.call(mod, k))
            __createBinding(result, mod, k);
      }
      __setModuleDefault(result, mod);
      return result;
    };
    var __awaiter = exports2 && exports2.__awaiter || function(thisArg, _arguments, P, generator) {
      function adopt(value) {
        return value instanceof P ? value : new P(function(resolve2) {
          resolve2(value);
        });
      }
      return new (P || (P = Promise))(function(resolve2, reject) {
        function fulfilled(value) {
          try {
            step(generator.next(value));
          } catch (e) {
            reject(e);
          }
        }
        function rejected(value) {
          try {
            step(generator["throw"](value));
          } catch (e) {
            reject(e);
          }
        }
        function step(result) {
          result.done ? resolve2(result.value) : adopt(result.value).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
      });
    };
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.getExecOutput = exports2.exec = void 0;
    var string_decoder_1 = require("string_decoder");
    var tr = __importStar(require_toolrunner());
    function exec6(commandLine, args, options) {
      return __awaiter(this, void 0, void 0, function* () {
        const commandArgs = tr.argStringToArray(commandLine);
        if (commandArgs.length === 0) {
          throw new Error(`Parameter 'commandLine' cannot be null or empty.`);
        }
        const toolPath = commandArgs[0];
        args = commandArgs.slice(1).concat(args || []);
        const runner = new tr.ToolRunner(toolPath, args, options);
        return runner.exec();
      });
    }
    exports2.exec = exec6;
    function getExecOutput(commandLine, args, options) {
      var _a, _b;
      return __awaiter(this, void 0, void 0, function* () {
        let stdout = "";
        let stderr = "";
        const stdoutDecoder = new string_decoder_1.StringDecoder("utf8");
        const stderrDecoder = new string_decoder_1.StringDecoder("utf8");
        const originalStdoutListener = (_a = options === null || options === void 0 ? void 0 : options.listeners) === null || _a === void 0 ? void 0 : _a.stdout;
        const originalStdErrListener = (_b = options === null || options === void 0 ? void 0 : options.listeners) === null || _b === void 0 ? void 0 : _b.stderr;
        const stdErrListener = (data) => {
          stderr += stderrDecoder.write(data);
          if (originalStdErrListener) {
            originalStdErrListener(data);
          }
        };
        const stdOutListener = (data) => {
          stdout += stdoutDecoder.write(data);
          if (originalStdoutListener) {
            originalStdoutListener(data);
          }
        };
        const listeners = Object.assign(Object.assign({}, options === null || options === void 0 ? void 0 : options.listeners), { stdout: stdOutListener, stderr: stdErrListener });
        const exitCode = yield exec6(commandLine, args, Object.assign(Object.assign({}, options), { listeners }));
        stdout += stdoutDecoder.end();
        stderr += stderrDecoder.end();
        return {
          exitCode,
          stdout,
          stderr
        };
      });
    }
    exports2.getExecOutput = getExecOutput;
  }
});

// node_modules/checkout/node_modules/@actions/core/lib/utils.js
var require_utils4 = __commonJS({
  "node_modules/checkout/node_modules/@actions/core/lib/utils.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.toCommandValue = void 0;
    function toCommandValue(input) {
      if (input === null || input === void 0) {
        return "";
      } else if (typeof input === "string" || input instanceof String) {
        return input;
      }
      return JSON.stringify(input);
    }
    exports2.toCommandValue = toCommandValue;
  }
});

// node_modules/checkout/node_modules/@actions/core/lib/command.js
var require_command2 = __commonJS({
  "node_modules/checkout/node_modules/@actions/core/lib/command.js"(exports2) {
    "use strict";
    var __createBinding = exports2 && exports2.__createBinding || (Object.create ? function(o, m, k, k2) {
      if (k2 === void 0)
        k2 = k;
      Object.defineProperty(o, k2, { enumerable: true, get: function() {
        return m[k];
      } });
    } : function(o, m, k, k2) {
      if (k2 === void 0)
        k2 = k;
      o[k2] = m[k];
    });
    var __setModuleDefault = exports2 && exports2.__setModuleDefault || (Object.create ? function(o, v) {
      Object.defineProperty(o, "default", { enumerable: true, value: v });
    } : function(o, v) {
      o["default"] = v;
    });
    var __importStar = exports2 && exports2.__importStar || function(mod) {
      if (mod && mod.__esModule)
        return mod;
      var result = {};
      if (mod != null) {
        for (var k in mod)
          if (k !== "default" && Object.hasOwnProperty.call(mod, k))
            __createBinding(result, mod, k);
      }
      __setModuleDefault(result, mod);
      return result;
    };
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.issue = exports2.issueCommand = void 0;
    var os2 = __importStar(require("os"));
    var utils_1 = require_utils4();
    function issueCommand2(command, properties, message) {
      const cmd = new Command(command, properties, message);
      process.stdout.write(cmd.toString() + os2.EOL);
    }
    exports2.issueCommand = issueCommand2;
    function issue(name, message = "") {
      issueCommand2(name, {}, message);
    }
    exports2.issue = issue;
    var CMD_STRING = "::";
    var Command = class {
      constructor(command, properties, message) {
        if (!command) {
          command = "missing.command";
        }
        this.command = command;
        this.properties = properties;
        this.message = message;
      }
      toString() {
        let cmdStr = CMD_STRING + this.command;
        if (this.properties && Object.keys(this.properties).length > 0) {
          cmdStr += " ";
          let first = true;
          for (const key in this.properties) {
            if (this.properties.hasOwnProperty(key)) {
              const val = this.properties[key];
              if (val) {
                if (first) {
                  first = false;
                } else {
                  cmdStr += ",";
                }
                cmdStr += `${key}=${escapeProperty(val)}`;
              }
            }
          }
        }
        cmdStr += `${CMD_STRING}${escapeData(this.message)}`;
        return cmdStr;
      }
    };
    function escapeData(s) {
      return utils_1.toCommandValue(s).replace(/%/g, "%25").replace(/\r/g, "%0D").replace(/\n/g, "%0A");
    }
    function escapeProperty(s) {
      return utils_1.toCommandValue(s).replace(/%/g, "%25").replace(/\r/g, "%0D").replace(/\n/g, "%0A").replace(/:/g, "%3A").replace(/,/g, "%2C");
    }
  }
});

// node_modules/checkout/node_modules/@actions/core/lib/file-command.js
var require_file_command2 = __commonJS({
  "node_modules/checkout/node_modules/@actions/core/lib/file-command.js"(exports2) {
    "use strict";
    var __createBinding = exports2 && exports2.__createBinding || (Object.create ? function(o, m, k, k2) {
      if (k2 === void 0)
        k2 = k;
      Object.defineProperty(o, k2, { enumerable: true, get: function() {
        return m[k];
      } });
    } : function(o, m, k, k2) {
      if (k2 === void 0)
        k2 = k;
      o[k2] = m[k];
    });
    var __setModuleDefault = exports2 && exports2.__setModuleDefault || (Object.create ? function(o, v) {
      Object.defineProperty(o, "default", { enumerable: true, value: v });
    } : function(o, v) {
      o["default"] = v;
    });
    var __importStar = exports2 && exports2.__importStar || function(mod) {
      if (mod && mod.__esModule)
        return mod;
      var result = {};
      if (mod != null) {
        for (var k in mod)
          if (k !== "default" && Object.hasOwnProperty.call(mod, k))
            __createBinding(result, mod, k);
      }
      __setModuleDefault(result, mod);
      return result;
    };
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.issueCommand = void 0;
    var fs6 = __importStar(require("fs"));
    var os2 = __importStar(require("os"));
    var utils_1 = require_utils4();
    function issueCommand2(command, message) {
      const filePath = process.env[`GITHUB_${command}`];
      if (!filePath) {
        throw new Error(`Unable to find environment variable for file command ${command}`);
      }
      if (!fs6.existsSync(filePath)) {
        throw new Error(`Missing file at path: ${filePath}`);
      }
      fs6.appendFileSync(filePath, `${utils_1.toCommandValue(message)}${os2.EOL}`, {
        encoding: "utf8"
      });
    }
    exports2.issueCommand = issueCommand2;
  }
});

// node_modules/checkout/node_modules/@actions/core/lib/core.js
var require_core2 = __commonJS({
  "node_modules/checkout/node_modules/@actions/core/lib/core.js"(exports2) {
    "use strict";
    var __createBinding = exports2 && exports2.__createBinding || (Object.create ? function(o, m, k, k2) {
      if (k2 === void 0)
        k2 = k;
      Object.defineProperty(o, k2, { enumerable: true, get: function() {
        return m[k];
      } });
    } : function(o, m, k, k2) {
      if (k2 === void 0)
        k2 = k;
      o[k2] = m[k];
    });
    var __setModuleDefault = exports2 && exports2.__setModuleDefault || (Object.create ? function(o, v) {
      Object.defineProperty(o, "default", { enumerable: true, value: v });
    } : function(o, v) {
      o["default"] = v;
    });
    var __importStar = exports2 && exports2.__importStar || function(mod) {
      if (mod && mod.__esModule)
        return mod;
      var result = {};
      if (mod != null) {
        for (var k in mod)
          if (k !== "default" && Object.hasOwnProperty.call(mod, k))
            __createBinding(result, mod, k);
      }
      __setModuleDefault(result, mod);
      return result;
    };
    var __awaiter = exports2 && exports2.__awaiter || function(thisArg, _arguments, P, generator) {
      function adopt(value) {
        return value instanceof P ? value : new P(function(resolve2) {
          resolve2(value);
        });
      }
      return new (P || (P = Promise))(function(resolve2, reject) {
        function fulfilled(value) {
          try {
            step(generator.next(value));
          } catch (e) {
            reject(e);
          }
        }
        function rejected(value) {
          try {
            step(generator["throw"](value));
          } catch (e) {
            reject(e);
          }
        }
        function step(result) {
          result.done ? resolve2(result.value) : adopt(result.value).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
      });
    };
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.getState = exports2.saveState = exports2.group = exports2.endGroup = exports2.startGroup = exports2.info = exports2.warning = exports2.error = exports2.debug = exports2.isDebug = exports2.setFailed = exports2.setCommandEcho = exports2.setOutput = exports2.getBooleanInput = exports2.getMultilineInput = exports2.getInput = exports2.addPath = exports2.setSecret = exports2.exportVariable = exports2.ExitCode = void 0;
    var command_1 = require_command2();
    var file_command_1 = require_file_command2();
    var utils_1 = require_utils4();
    var os2 = __importStar(require("os"));
    var path7 = __importStar(require("path"));
    var ExitCode;
    (function(ExitCode2) {
      ExitCode2[ExitCode2["Success"] = 0] = "Success";
      ExitCode2[ExitCode2["Failure"] = 1] = "Failure";
    })(ExitCode = exports2.ExitCode || (exports2.ExitCode = {}));
    function exportVariable(name, val) {
      const convertedVal = utils_1.toCommandValue(val);
      process.env[name] = convertedVal;
      const filePath = process.env["GITHUB_ENV"] || "";
      if (filePath) {
        const delimiter = "_GitHubActionsFileCommandDelimeter_";
        const commandValue = `${name}<<${delimiter}${os2.EOL}${convertedVal}${os2.EOL}${delimiter}`;
        file_command_1.issueCommand("ENV", commandValue);
      } else {
        command_1.issueCommand("set-env", { name }, convertedVal);
      }
    }
    exports2.exportVariable = exportVariable;
    function setSecret2(secret) {
      command_1.issueCommand("add-mask", {}, secret);
    }
    exports2.setSecret = setSecret2;
    function addPath(inputPath) {
      const filePath = process.env["GITHUB_PATH"] || "";
      if (filePath) {
        file_command_1.issueCommand("PATH", inputPath);
      } else {
        command_1.issueCommand("add-path", {}, inputPath);
      }
      process.env["PATH"] = `${inputPath}${path7.delimiter}${process.env["PATH"]}`;
    }
    exports2.addPath = addPath;
    function getInput5(name, options) {
      const val = process.env[`INPUT_${name.replace(/ /g, "_").toUpperCase()}`] || "";
      if (options && options.required && !val) {
        throw new Error(`Input required and not supplied: ${name}`);
      }
      if (options && options.trimWhitespace === false) {
        return val;
      }
      return val.trim();
    }
    exports2.getInput = getInput5;
    function getMultilineInput(name, options) {
      const inputs = getInput5(name, options).split("\n").filter((x) => x !== "");
      return inputs;
    }
    exports2.getMultilineInput = getMultilineInput;
    function getBooleanInput2(name, options) {
      const trueValue = ["true", "True", "TRUE"];
      const falseValue = ["false", "False", "FALSE"];
      const val = getInput5(name, options);
      if (trueValue.includes(val))
        return true;
      if (falseValue.includes(val))
        return false;
      throw new TypeError(`Input does not meet YAML 1.2 "Core Schema" specification: ${name}
Support boolean input list: \`true | True | TRUE | false | False | FALSE\``);
    }
    exports2.getBooleanInput = getBooleanInput2;
    function setOutput(name, value) {
      process.stdout.write(os2.EOL);
      command_1.issueCommand("set-output", { name }, value);
    }
    exports2.setOutput = setOutput;
    function setCommandEcho(enabled) {
      command_1.issue("echo", enabled ? "on" : "off");
    }
    exports2.setCommandEcho = setCommandEcho;
    function setFailed2(message) {
      process.exitCode = ExitCode.Failure;
      error(message);
    }
    exports2.setFailed = setFailed2;
    function isDebug() {
      return process.env["RUNNER_DEBUG"] === "1";
    }
    exports2.isDebug = isDebug;
    function debug6(message) {
      command_1.issueCommand("debug", {}, message);
    }
    exports2.debug = debug6;
    function error(message) {
      command_1.issue("error", message instanceof Error ? message.toString() : message);
    }
    exports2.error = error;
    function warning6(message) {
      command_1.issue("warning", message instanceof Error ? message.toString() : message);
    }
    exports2.warning = warning6;
    function info10(message) {
      process.stdout.write(message + os2.EOL);
    }
    exports2.info = info10;
    function startGroup4(name) {
      command_1.issue("group", name);
    }
    exports2.startGroup = startGroup4;
    function endGroup4() {
      command_1.issue("endgroup");
    }
    exports2.endGroup = endGroup4;
    function group(name, fn) {
      return __awaiter(this, void 0, void 0, function* () {
        startGroup4(name);
        let result;
        try {
          result = yield fn();
        } finally {
          endGroup4();
        }
        return result;
      });
    }
    exports2.group = group;
    function saveState(name, value) {
      command_1.issueCommand("save-state", { name }, value);
    }
    exports2.saveState = saveState;
    function getState(name) {
      return process.env[`STATE_${name}`] || "";
    }
    exports2.getState = getState;
  }
});

// node_modules/uuid/lib/rng.js
var require_rng = __commonJS({
  "node_modules/uuid/lib/rng.js"(exports2, module2) {
    var crypto = require("crypto");
    module2.exports = function nodeRNG() {
      return crypto.randomBytes(16);
    };
  }
});

// node_modules/uuid/lib/bytesToUuid.js
var require_bytesToUuid = __commonJS({
  "node_modules/uuid/lib/bytesToUuid.js"(exports2, module2) {
    var byteToHex = [];
    for (i = 0; i < 256; ++i) {
      byteToHex[i] = (i + 256).toString(16).substr(1);
    }
    var i;
    function bytesToUuid(buf, offset) {
      var i2 = offset || 0;
      var bth = byteToHex;
      return [
        bth[buf[i2++]],
        bth[buf[i2++]],
        bth[buf[i2++]],
        bth[buf[i2++]],
        "-",
        bth[buf[i2++]],
        bth[buf[i2++]],
        "-",
        bth[buf[i2++]],
        bth[buf[i2++]],
        "-",
        bth[buf[i2++]],
        bth[buf[i2++]],
        "-",
        bth[buf[i2++]],
        bth[buf[i2++]],
        bth[buf[i2++]],
        bth[buf[i2++]],
        bth[buf[i2++]],
        bth[buf[i2++]]
      ].join("");
    }
    module2.exports = bytesToUuid;
  }
});

// node_modules/uuid/v4.js
var require_v4 = __commonJS({
  "node_modules/uuid/v4.js"(exports2, module2) {
    var rng = require_rng();
    var bytesToUuid = require_bytesToUuid();
    function v4(options, buf, offset) {
      var i = buf && offset || 0;
      if (typeof options == "string") {
        buf = options === "binary" ? new Array(16) : null;
        options = null;
      }
      options = options || {};
      var rnds = options.random || (options.rng || rng)();
      rnds[6] = rnds[6] & 15 | 64;
      rnds[8] = rnds[8] & 63 | 128;
      if (buf) {
        for (var ii = 0; ii < 16; ++ii) {
          buf[i + ii] = rnds[ii];
        }
      }
      return buf || bytesToUuid(rnds);
    }
    module2.exports = v4;
  }
});

// node_modules/@octokit/graphql/dist-node/index.js
var require_dist_node11 = __commonJS({
  "node_modules/@octokit/graphql/dist-node/index.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    var request = require_dist_node5();
    var universalUserAgent = require_dist_node();
    var VERSION = "4.6.4";
    var GraphqlError = class extends Error {
      constructor(request2, response) {
        const message = response.data.errors[0].message;
        super(message);
        Object.assign(this, response.data);
        Object.assign(this, {
          headers: response.headers
        });
        this.name = "GraphqlError";
        this.request = request2;
        if (Error.captureStackTrace) {
          Error.captureStackTrace(this, this.constructor);
        }
      }
    };
    var NON_VARIABLE_OPTIONS = ["method", "baseUrl", "url", "headers", "request", "query", "mediaType"];
    var FORBIDDEN_VARIABLE_OPTIONS = ["query", "method", "url"];
    var GHES_V3_SUFFIX_REGEX = /\/api\/v3\/?$/;
    function graphql(request2, query, options) {
      if (options) {
        if (typeof query === "string" && "query" in options) {
          return Promise.reject(new Error(`[@octokit/graphql] "query" cannot be used as variable name`));
        }
        for (const key in options) {
          if (!FORBIDDEN_VARIABLE_OPTIONS.includes(key))
            continue;
          return Promise.reject(new Error(`[@octokit/graphql] "${key}" cannot be used as variable name`));
        }
      }
      const parsedOptions = typeof query === "string" ? Object.assign({
        query
      }, options) : query;
      const requestOptions = Object.keys(parsedOptions).reduce((result, key) => {
        if (NON_VARIABLE_OPTIONS.includes(key)) {
          result[key] = parsedOptions[key];
          return result;
        }
        if (!result.variables) {
          result.variables = {};
        }
        result.variables[key] = parsedOptions[key];
        return result;
      }, {});
      const baseUrl = parsedOptions.baseUrl || request2.endpoint.DEFAULTS.baseUrl;
      if (GHES_V3_SUFFIX_REGEX.test(baseUrl)) {
        requestOptions.url = baseUrl.replace(GHES_V3_SUFFIX_REGEX, "/api/graphql");
      }
      return request2(requestOptions).then((response) => {
        if (response.data.errors) {
          const headers = {};
          for (const key of Object.keys(response.headers)) {
            headers[key] = response.headers[key];
          }
          throw new GraphqlError(requestOptions, {
            headers,
            data: response.data
          });
        }
        return response.data.data;
      });
    }
    function withDefaults(request$1, newDefaults) {
      const newRequest = request$1.defaults(newDefaults);
      const newApi = (query, options) => {
        return graphql(newRequest, query, options);
      };
      return Object.assign(newApi, {
        defaults: withDefaults.bind(null, newRequest),
        endpoint: request.request.endpoint
      });
    }
    var graphql$1 = withDefaults(request.request, {
      headers: {
        "user-agent": `octokit-graphql.js/${VERSION} ${universalUserAgent.getUserAgent()}`
      },
      method: "POST",
      url: "/graphql"
    });
    function withCustomRequest(customRequest) {
      return withDefaults(customRequest, {
        method: "POST",
        url: "/graphql"
      });
    }
    exports2.graphql = graphql$1;
    exports2.withCustomRequest = withCustomRequest;
  }
});

// node_modules/@octokit/plugin-request-log/dist-node/index.js
var require_dist_node12 = __commonJS({
  "node_modules/@octokit/plugin-request-log/dist-node/index.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    var VERSION = "1.0.4";
    function requestLog(octokit) {
      octokit.hook.wrap("request", (request, options) => {
        octokit.log.debug("request", options);
        const start = Date.now();
        const requestOptions = octokit.request.endpoint.parse(options);
        const path7 = requestOptions.url.replace(options.baseUrl, "");
        return request(options).then((response) => {
          octokit.log.info(`${requestOptions.method} ${path7} - ${response.status} in ${Date.now() - start}ms`);
          return response;
        }).catch((error) => {
          octokit.log.info(`${requestOptions.method} ${path7} - ${error.status} in ${Date.now() - start}ms`);
          throw error;
        });
      });
    }
    requestLog.VERSION = VERSION;
    exports2.requestLog = requestLog;
  }
});

// node_modules/@octokit/rest/node_modules/@octokit/plugin-rest-endpoint-methods/dist-node/index.js
var require_dist_node13 = __commonJS({
  "node_modules/@octokit/rest/node_modules/@octokit/plugin-rest-endpoint-methods/dist-node/index.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    var deprecation = require_dist_node3();
    var endpointsByScope = {
      actions: {
        cancelWorkflowRun: {
          method: "POST",
          params: {
            owner: {
              required: true,
              type: "string"
            },
            repo: {
              required: true,
              type: "string"
            },
            run_id: {
              required: true,
              type: "integer"
            }
          },
          url: "/repos/:owner/:repo/actions/runs/:run_id/cancel"
        },
        createOrUpdateSecretForRepo: {
          method: "PUT",
          params: {
            encrypted_value: {
              type: "string"
            },
            key_id: {
              type: "string"
            },
            name: {
              required: true,
              type: "string"
            },
            owner: {
              required: true,
              type: "string"
            },
            repo: {
              required: true,
              type: "string"
            }
          },
          url: "/repos/:owner/:repo/actions/secrets/:name"
        },
        createRegistrationToken: {
          method: "POST",
          params: {
            owner: {
              required: true,
              type: "string"
            },
            repo: {
              required: true,
              type: "string"
            }
          },
          url: "/repos/:owner/:repo/actions/runners/registration-token"
        },
        createRemoveToken: {
          method: "POST",
          params: {
            owner: {
              required: true,
              type: "string"
            },
            repo: {
              required: true,
              type: "string"
            }
          },
          url: "/repos/:owner/:repo/actions/runners/remove-token"
        },
        deleteArtifact: {
          method: "DELETE",
          params: {
            artifact_id: {
              required: true,
              type: "integer"
            },
            owner: {
              required: true,
              type: "string"
            },
            repo: {
              required: true,
              type: "string"
            }
          },
          url: "/repos/:owner/:repo/actions/artifacts/:artifact_id"
        },
        deleteSecretFromRepo: {
          method: "DELETE",
          params: {
            name: {
              required: true,
              type: "string"
            },
            owner: {
              required: true,
              type: "string"
            },
            repo: {
              required: true,
              type: "string"
            }
          },
          url: "/repos/:owner/:repo/actions/secrets/:name"
        },
        downloadArtifact: {
          method: "GET",
          params: {
            archive_format: {
              required: true,
              type: "string"
            },
            artifact_id: {
              required: true,
              type: "integer"
            },
            owner: {
              required: true,
              type: "string"
            },
            repo: {
              required: true,
              type: "string"
            }
          },
          url: "/repos/:owner/:repo/actions/artifacts/:artifact_id/:archive_format"
        },
        getArtifact: {
          method: "GET",
          params: {
            artifact_id: {
              required: true,
              type: "integer"
            },
            owner: {
              required: true,
              type: "string"
            },
            repo: {
              required: true,
              type: "string"
            }
          },
          url: "/repos/:owner/:repo/actions/artifacts/:artifact_id"
        },
        getPublicKey: {
          method: "GET",
          params: {
            owner: {
              required: true,
              type: "string"
            },
            repo: {
              required: true,
              type: "string"
            }
          },
          url: "/repos/:owner/:repo/actions/secrets/public-key"
        },
        getSecret: {
          method: "GET",
          params: {
            name: {
              required: true,
              type: "string"
            },
            owner: {
              required: true,
              type: "string"
            },
            page: {
              type: "integer"
            },
            per_page: {
              type: "integer"
            },
            repo: {
              required: true,
              type: "string"
            }
          },
          url: "/repos/:owner/:repo/actions/secrets/:name"
        },
        getSelfHostedRunner: {
          method: "GET",
          params: {
            owner: {
              required: true,
              type: "string"
            },
            repo: {
              required: true,
              type: "string"
            },
            runner_id: {
              required: true,
              type: "integer"
            }
          },
          url: "/repos/:owner/:repo/actions/runners/:runner_id"
        },
        getWorkflow: {
          method: "GET",
          params: {
            owner: {
              required: true,
              type: "string"
            },
            repo: {
              required: true,
              type: "string"
            },
            workflow_id: {
              required: true,
              type: "integer"
            }
          },
          url: "/repos/:owner/:repo/actions/workflows/:workflow_id"
        },
        getWorkflowJob: {
          method: "GET",
          params: {
            job_id: {
              required: true,
              type: "integer"
            },
            owner: {
              required: true,
              type: "string"
            },
            repo: {
              required: true,
              type: "string"
            }
          },
          url: "/repos/:owner/:repo/actions/jobs/:job_id"
        },
        getWorkflowRun: {
          method: "GET",
          params: {
            owner: {
              required: true,
              type: "string"
            },
            repo: {
              required: true,
              type: "string"
            },
            run_id: {
              required: true,
              type: "integer"
            }
          },
          url: "/repos/:owner/:repo/actions/runs/:run_id"
        },
        listDownloadsForSelfHostedRunnerApplication: {
          method: "GET",
          params: {
            owner: {
              required: true,
              type: "string"
            },
            repo: {
              required: true,
              type: "string"
            }
          },
          url: "/repos/:owner/:repo/actions/runners/downloads"
        },
        listJobsForWorkflowRun: {
          method: "GET",
          params: {
            owner: {
              required: true,
              type: "string"
            },
            page: {
              type: "integer"
            },
            per_page: {
              type: "integer"
            },
            repo: {
              required: true,
              type: "string"
            },
            run_id: {
              required: true,
              type: "integer"
            }
          },
          url: "/repos/:owner/:repo/actions/runs/:run_id/jobs"
        },
        listRepoWorkflowRuns: {
          method: "GET",
          params: {
            actor: {
              type: "string"
            },
            branch: {
              type: "string"
            },
            event: {
              type: "string"
            },
            owner: {
              required: true,
              type: "string"
            },
            page: {
              type: "integer"
            },
            per_page: {
              type: "integer"
            },
            repo: {
              required: true,
              type: "string"
            },
            status: {
              enum: ["completed", "status", "conclusion"],
              type: "string"
            }
          },
          url: "/repos/:owner/:repo/actions/runs"
        },
        listRepoWorkflows: {
          method: "GET",
          params: {
            owner: {
              required: true,
              type: "string"
            },
            page: {
              type: "integer"
            },
            per_page: {
              type: "integer"
            },
            repo: {
              required: true,
              type: "string"
            }
          },
          url: "/repos/:owner/:repo/actions/workflows"
        },
        listSecretsForRepo: {
          method: "GET",
          params: {
            owner: {
              required: true,
              type: "string"
            },
            page: {
              type: "integer"
            },
            per_page: {
              type: "integer"
            },
            repo: {
              required: true,
              type: "string"
            }
          },
          url: "/repos/:owner/:repo/actions/secrets"
        },
        listSelfHostedRunnersForRepo: {
          method: "GET",
          params: {
            owner: {
              required: true,
              type: "string"
            },
            page: {
              type: "integer"
            },
            per_page: {
              type: "integer"
            },
            repo: {
              required: true,
              type: "string"
            }
          },
          url: "/repos/:owner/:repo/actions/runners"
        },
        listWorkflowJobLogs: {
          method: "GET",
          params: {
            job_id: {
              required: true,
              type: "integer"
            },
            owner: {
              required: true,
              type: "string"
            },
            page: {
              type: "integer"
            },
            per_page: {
              type: "integer"
            },
            repo: {
              required: true,
              type: "string"
            }
          },
          url: "/repos/:owner/:repo/actions/jobs/:job_id/logs"
        },
        listWorkflowRunArtifacts: {
          method: "GET",
          params: {
            owner: {
              required: true,
              type: "string"
            },
            page: {
              type: "integer"
            },
            per_page: {
              type: "integer"
            },
            repo: {
              required: true,
              type: "string"
            },
            run_id: {
              required: true,
              type: "integer"
            }
          },
          url: "/repos/:owner/:repo/actions/runs/:run_id/artifacts"
        },
        listWorkflowRunLogs: {
          method: "GET",
          params: {
            owner: {
              required: true,
              type: "string"
            },
            page: {
              type: "integer"
            },
            per_page: {
              type: "integer"
            },
            repo: {
              required: true,
              type: "string"
            },
            run_id: {
              required: true,
              type: "integer"
            }
          },
          url: "/repos/:owner/:repo/actions/runs/:run_id/logs"
        },
        listWorkflowRuns: {
          method: "GET",
          params: {
            actor: {
              type: "string"
            },
            branch: {
              type: "string"
            },
            event: {
              type: "string"
            },
            owner: {
              required: true,
              type: "string"
            },
            page: {
              type: "integer"
            },
            per_page: {
              type: "integer"
            },
            repo: {
              required: true,
              type: "string"
            },
            status: {
              enum: ["completed", "status", "conclusion"],
              type: "string"
            },
            workflow_id: {
              required: true,
              type: "integer"
            }
          },
          url: "/repos/:owner/:repo/actions/workflows/:workflow_id/runs"
        },
        reRunWorkflow: {
          method: "POST",
          params: {
            owner: {
              required: true,
              type: "string"
            },
            repo: {
              required: true,
              type: "string"
            },
            run_id: {
              required: true,
              type: "integer"
            }
          },
          url: "/repos/:owner/:repo/actions/runs/:run_id/rerun"
        },
        removeSelfHostedRunner: {
          method: "DELETE",
          params: {
            owner: {
              required: true,
              type: "string"
            },
            repo: {
              required: true,
              type: "string"
            },
            runner_id: {
              required: true,
              type: "integer"
            }
          },
          url: "/repos/:owner/:repo/actions/runners/:runner_id"
        }
      },
      activity: {
        checkStarringRepo: {
          method: "GET",
          params: {
            owner: {
              required: true,
              type: "string"
            },
            repo: {
              required: true,
              type: "string"
            }
          },
          url: "/user/starred/:owner/:repo"
        },
        deleteRepoSubscription: {
          method: "DELETE",
          params: {
            owner: {
              required: true,
              type: "string"
            },
            repo: {
              required: true,
              type: "string"
            }
          },
          url: "/repos/:owner/:repo/subscription"
        },
        deleteThreadSubscription: {
          method: "DELETE",
          params: {
            thread_id: {
              required: true,
              type: "integer"
            }
          },
          url: "/notifications/threads/:thread_id/subscription"
        },
        getRepoSubscription: {
          method: "GET",
          params: {
            owner: {
              required: true,
              type: "string"
            },
            repo: {
              required: true,
              type: "string"
            }
          },
          url: "/repos/:owner/:repo/subscription"
        },
        getThread: {
          method: "GET",
          params: {
            thread_id: {
              required: true,
              type: "integer"
            }
          },
          url: "/notifications/threads/:thread_id"
        },
        getThreadSubscription: {
          method: "GET",
          params: {
            thread_id: {
              required: true,
              type: "integer"
            }
          },
          url: "/notifications/threads/:thread_id/subscription"
        },
        listEventsForOrg: {
          method: "GET",
          params: {
            org: {
              required: true,
              type: "string"
            },
            page: {
              type: "integer"
            },
            per_page: {
              type: "integer"
            },
            username: {
              required: true,
              type: "string"
            }
          },
          url: "/users/:username/events/orgs/:org"
        },
        listEventsForUser: {
          method: "GET",
          params: {
            page: {
              type: "integer"
            },
            per_page: {
              type: "integer"
            },
            username: {
              required: true,
              type: "string"
            }
          },
          url: "/users/:username/events"
        },
        listFeeds: {
          method: "GET",
          params: {},
          url: "/feeds"
        },
        listNotifications: {
          method: "GET",
          params: {
            all: {
              type: "boolean"
            },
            before: {
              type: "string"
            },
            page: {
              type: "integer"
            },
            participating: {
              type: "boolean"
            },
            per_page: {
              type: "integer"
            },
            since: {
              type: "string"
            }
          },
          url: "/notifications"
        },
        listNotificationsForRepo: {
          method: "GET",
          params: {
            all: {
              type: "boolean"
            },
            before: {
              type: "string"
            },
            owner: {
              required: true,
              type: "string"
            },
            page: {
              type: "integer"
            },
            participating: {
              type: "boolean"
            },
            per_page: {
              type: "integer"
            },
            repo: {
              required: true,
              type: "string"
            },
            since: {
              type: "string"
            }
          },
          url: "/repos/:owner/:repo/notifications"
        },
        listPublicEvents: {
          method: "GET",
          params: {
            page: {
              type: "integer"
            },
            per_page: {
              type: "integer"
            }
          },
          url: "/events"
        },
        listPublicEventsForOrg: {
          method: "GET",
          params: {
            org: {
              required: true,
              type: "string"
            },
            page: {
              type: "integer"
            },
            per_page: {
              type: "integer"
            }
          },
          url: "/orgs/:org/events"
        },
        listPublicEventsForRepoNetwork: {
          method: "GET",
          params: {
            owner: {
              required: true,
              type: "string"
            },
            page: {
              type: "integer"
            },
            per_page: {
              type: "integer"
            },
            repo: {
              required: true,
              type: "string"
            }
          },
          url: "/networks/:owner/:repo/events"
        },
        listPublicEventsForUser: {
          method: "GET",
          params: {
            page: {
              type: "integer"
            },
            per_page: {
              type: "integer"
            },
            username: {
              required: true,
              type: "string"
            }
          },
          url: "/users/:username/events/public"
        },
        listReceivedEventsForUser: {
          method: "GET",
          params: {
            page: {
              type: "integer"
            },
            per_page: {
              type: "integer"
            },
            username: {
              required: true,
              type: "string"
            }
          },
          url: "/users/:username/received_events"
        },
        listReceivedPublicEventsForUser: {
          method: "GET",
          params: {
            page: {
              type: "integer"
            },
            per_page: {
              type: "integer"
            },
            username: {
              required: true,
              type: "string"
            }
          },
          url: "/users/:username/received_events/public"
        },
        listRepoEvents: {
          method: "GET",
          params: {
            owner: {
              required: true,
              type: "string"
            },
            page: {
              type: "integer"
            },
            per_page: {
              type: "integer"
            },
            repo: {
              required: true,
              type: "string"
            }
          },
          url: "/repos/:owner/:repo/events"
        },
        listReposStarredByAuthenticatedUser: {
          method: "GET",
          params: {
            direction: {
              enum: ["asc", "desc"],
              type: "string"
            },
            page: {
              type: "integer"
            },
            per_page: {
              type: "integer"
            },
            sort: {
              enum: ["created", "updated"],
              type: "string"
            }
          },
          url: "/user/starred"
        },
        listReposStarredByUser: {
          method: "GET",
          params: {
            direction: {
              enum: ["asc", "desc"],
              type: "string"
            },
            page: {
              type: "integer"
            },
            per_page: {
              type: "integer"
            },
            sort: {
              enum: ["created", "updated"],
              type: "string"
            },
            username: {
              required: true,
              type: "string"
            }
          },
          url: "/users/:username/starred"
        },
        listReposWatchedByUser: {
          method: "GET",
          params: {
            page: {
              type: "integer"
            },
            per_page: {
              type: "integer"
            },
            username: {
              required: true,
              type: "string"
            }
          },
          url: "/users/:username/subscriptions"
        },
        listStargazersForRepo: {
          method: "GET",
          params: {
            owner: {
              required: true,
              type: "string"
            },
            page: {
              type: "integer"
            },
            per_page: {
              type: "integer"
            },
            repo: {
              required: true,
              type: "string"
            }
          },
          url: "/repos/:owner/:repo/stargazers"
        },
        listWatchedReposForAuthenticatedUser: {
          method: "GET",
          params: {
            page: {
              type: "integer"
            },
            per_page: {
              type: "integer"
            }
          },
          url: "/user/subscriptions"
        },
        listWatchersForRepo: {
          method: "GET",
          params: {
            owner: {
              required: true,
              type: "string"
            },
            page: {
              type: "integer"
            },
            per_page: {
              type: "integer"
            },
            repo: {
              required: true,
              type: "string"
            }
          },
          url: "/repos/:owner/:repo/subscribers"
        },
        markAsRead: {
          method: "PUT",
          params: {
            last_read_at: {
              type: "string"
            }
          },
          url: "/notifications"
        },
        markNotificationsAsReadForRepo: {
          method: "PUT",
          params: {
            last_read_at: {
              type: "string"
            },
            owner: {
              required: true,
              type: "string"
            },
            repo: {
              required: true,
              type: "string"
            }
          },
          url: "/repos/:owner/:repo/notifications"
        },
        markThreadAsRead: {
          method: "PATCH",
          params: {
            thread_id: {
              required: true,
              type: "integer"
            }
          },
          url: "/notifications/threads/:thread_id"
        },
        setRepoSubscription: {
          method: "PUT",
          params: {
            ignored: {
              type: "boolean"
            },
            owner: {
              required: true,
              type: "string"
            },
            repo: {
              required: true,
              type: "string"
            },
            subscribed: {
              type: "boolean"
            }
          },
          url: "/repos/:owner/:repo/subscription"
        },
        setThreadSubscription: {
          method: "PUT",
          params: {
            ignored: {
              type: "boolean"
            },
            thread_id: {
              required: true,
              type: "integer"
            }
          },
          url: "/notifications/threads/:thread_id/subscription"
        },
        starRepo: {
          method: "PUT",
          params: {
            owner: {
              required: true,
              type: "string"
            },
            repo: {
              required: true,
              type: "string"
            }
          },
          url: "/user/starred/:owner/:repo"
        },
        unstarRepo: {
          method: "DELETE",
          params: {
            owner: {
              required: true,
              type: "string"
            },
            repo: {
              required: true,
              type: "string"
            }
          },
          url: "/user/starred/:owner/:repo"
        }
      },
      apps: {
        addRepoToInstallation: {
          headers: {
            accept: "application/vnd.github.machine-man-preview+json"
          },
          method: "PUT",
          params: {
            installation_id: {
              required: true,
              type: "integer"
            },
            repository_id: {
              required: true,
              type: "integer"
            }
          },
          url: "/user/installations/:installation_id/repositories/:repository_id"
        },
        checkAccountIsAssociatedWithAny: {
          method: "GET",
          params: {
            account_id: {
              required: true,
              type: "integer"
            }
          },
          url: "/marketplace_listing/accounts/:account_id"
        },
        checkAccountIsAssociatedWithAnyStubbed: {
          method: "GET",
          params: {
            account_id: {
              required: true,
              type: "integer"
            }
          },
          url: "/marketplace_listing/stubbed/accounts/:account_id"
        },
        checkAuthorization: {
          deprecated: "octokit.apps.checkAuthorization() is deprecated, see https://developer.github.com/v3/apps/oauth_applications/#check-an-authorization",
          method: "GET",
          params: {
            access_token: {
              required: true,
              type: "string"
            },
            client_id: {
              required: true,
              type: "string"
            }
          },
          url: "/applications/:client_id/tokens/:access_token"
        },
        checkToken: {
          headers: {
            accept: "application/vnd.github.doctor-strange-preview+json"
          },
          method: "POST",
          params: {
            access_token: {
              type: "string"
            },
            client_id: {
              required: true,
              type: "string"
            }
          },
          url: "/applications/:client_id/token"
        },
        createContentAttachment: {
          headers: {
            accept: "application/vnd.github.corsair-preview+json"
          },
          method: "POST",
          params: {
            body: {
              required: true,
              type: "string"
            },
            content_reference_id: {
              required: true,
              type: "integer"
            },
            title: {
              required: true,
              type: "string"
            }
          },
          url: "/content_references/:content_reference_id/attachments"
        },
        createFromManifest: {
          headers: {
            accept: "application/vnd.github.fury-preview+json"
          },
          method: "POST",
          params: {
            code: {
              required: true,
              type: "string"
            }
          },
          url: "/app-manifests/:code/conversions"
        },
        createInstallationToken: {
          headers: {
            accept: "application/vnd.github.machine-man-preview+json"
          },
          method: "POST",
          params: {
            installation_id: {
              required: true,
              type: "integer"
            },
            permissions: {
              type: "object"
            },
            repository_ids: {
              type: "integer[]"
            }
          },
          url: "/app/installations/:installation_id/access_tokens"
        },
        deleteAuthorization: {
          headers: {
            accept: "application/vnd.github.doctor-strange-preview+json"
          },
          method: "DELETE",
          params: {
            access_token: {
              type: "string"
            },
            client_id: {
              required: true,
              type: "string"
            }
          },
          url: "/applications/:client_id/grant"
        },
        deleteInstallation: {
          headers: {
            accept: "application/vnd.github.gambit-preview+json,application/vnd.github.machine-man-preview+json"
          },
          method: "DELETE",
          params: {
            installation_id: {
              required: true,
              type: "integer"
            }
          },
          url: "/app/installations/:installation_id"
        },
        deleteToken: {
          headers: {
            accept: "application/vnd.github.doctor-strange-preview+json"
          },
          method: "DELETE",
          params: {
            access_token: {
              type: "string"
            },
            client_id: {
              required: true,
              type: "string"
            }
          },
          url: "/applications/:client_id/token"
        },
        findOrgInstallation: {
          deprecated: "octokit.apps.findOrgInstallation() has been renamed to octokit.apps.getOrgInstallation() (2019-04-10)",
          headers: {
            accept: "application/vnd.github.machine-man-preview+json"
          },
          method: "GET",
          params: {
            org: {
              required: true,
              type: "string"
            }
          },
          url: "/orgs/:org/installation"
        },
        findRepoInstallation: {
          deprecated: "octokit.apps.findRepoInstallation() has been renamed to octokit.apps.getRepoInstallation() (2019-04-10)",
          headers: {
            accept: "application/vnd.github.machine-man-preview+json"
          },
          method: "GET",
          params: {
            owner: {
              required: true,
              type: "string"
            },
            repo: {
              required: true,
              type: "string"
            }
          },
          url: "/repos/:owner/:repo/installation"
        },
        findUserInstallation: {
          deprecated: "octokit.apps.findUserInstallation() has been renamed to octokit.apps.getUserInstallation() (2019-04-10)",
          headers: {
            accept: "application/vnd.github.machine-man-preview+json"
          },
          method: "GET",
          params: {
            username: {
              required: true,
              type: "string"
            }
          },
          url: "/users/:username/installation"
        },
        getAuthenticated: {
          headers: {
            accept: "application/vnd.github.machine-man-preview+json"
          },
          method: "GET",
          params: {},
          url: "/app"
        },
        getBySlug: {
          headers: {
            accept: "application/vnd.github.machine-man-preview+json"
          },
          method: "GET",
          params: {
            app_slug: {
              required: true,
              type: "string"
            }
          },
          url: "/apps/:app_slug"
        },
        getInstallation: {
          headers: {
            accept: "application/vnd.github.machine-man-preview+json"
          },
          method: "GET",
          params: {
            installation_id: {
              required: true,
              type: "integer"
            }
          },
          url: "/app/installations/:installation_id"
        },
        getOrgInstallation: {
          headers: {
            accept: "application/vnd.github.machine-man-preview+json"
          },
          method: "GET",
          params: {
            org: {
              required: true,
              type: "string"
            }
          },
          url: "/orgs/:org/installation"
        },
        getRepoInstallation: {
          headers: {
            accept: "application/vnd.github.machine-man-preview+json"
          },
          method: "GET",
          params: {
            owner: {
              required: true,
              type: "string"
            },
            repo: {
              required: true,
              type: "string"
            }
          },
          url: "/repos/:owner/:repo/installation"
        },
        getUserInstallation: {
          headers: {
            accept: "application/vnd.github.machine-man-preview+json"
          },
          method: "GET",
          params: {
            username: {
              required: true,
              type: "string"
            }
          },
          url: "/users/:username/installation"
        },
        listAccountsUserOrOrgOnPlan: {
          method: "GET",
          params: {
            direction: {
              enum: ["asc", "desc"],
              type: "string"
            },
            page: {
              type: "integer"
            },
            per_page: {
              type: "integer"
            },
            plan_id: {
              required: true,
              type: "integer"
            },
            sort: {
              enum: ["created", "updated"],
              type: "string"
            }
          },
          url: "/marketplace_listing/plans/:plan_id/accounts"
        },
        listAccountsUserOrOrgOnPlanStubbed: {
          method: "GET",
          params: {
            direction: {
              enum: ["asc", "desc"],
              type: "string"
            },
            page: {
              type: "integer"
            },
            per_page: {
              type: "integer"
            },
            plan_id: {
              required: true,
              type: "integer"
            },
            sort: {
              enum: ["created", "updated"],
              type: "string"
            }
          },
          url: "/marketplace_listing/stubbed/plans/:plan_id/accounts"
        },
        listInstallationReposForAuthenticatedUser: {
          headers: {
            accept: "application/vnd.github.machine-man-preview+json"
          },
          method: "GET",
          params: {
            installation_id: {
              required: true,
              type: "integer"
            },
            page: {
              type: "integer"
            },
            per_page: {
              type: "integer"
            }
          },
          url: "/user/installations/:installation_id/repositories"
        },
        listInstallations: {
          headers: {
            accept: "application/vnd.github.machine-man-preview+json"
          },
          method: "GET",
          params: {
            page: {
              type: "integer"
            },
            per_page: {
              type: "integer"
            }
          },
          url: "/app/installations"
        },
        listInstallationsForAuthenticatedUser: {
          headers: {
            accept: "application/vnd.github.machine-man-preview+json"
          },
          method: "GET",
          params: {
            page: {
              type: "integer"
            },
            per_page: {
              type: "integer"
            }
          },
          url: "/user/installations"
        },
        listMarketplacePurchasesForAuthenticatedUser: {
          method: "GET",
          params: {
            page: {
              type: "integer"
            },
            per_page: {
              type: "integer"
            }
          },
          url: "/user/marketplace_purchases"
        },
        listMarketplacePurchasesForAuthenticatedUserStubbed: {
          method: "GET",
          params: {
            page: {
              type: "integer"
            },
            per_page: {
              type: "integer"
            }
          },
          url: "/user/marketplace_purchases/stubbed"
        },
        listPlans: {
          method: "GET",
          params: {
            page: {
              type: "integer"
            },
            per_page: {
              type: "integer"
            }
          },
          url: "/marketplace_listing/plans"
        },
        listPlansStubbed: {
          method: "GET",
          params: {
            page: {
              type: "integer"
            },
            per_page: {
              type: "integer"
            }
          },
          url: "/marketplace_listing/stubbed/plans"
        },
        listRepos: {
          headers: {
            accept: "application/vnd.github.machine-man-preview+json"
          },
          method: "GET",
          params: {
            page: {
              type: "integer"
            },
            per_page: {
              type: "integer"
            }
          },
          url: "/installation/repositories"
        },
        removeRepoFromInstallation: {
          headers: {
            accept: "application/vnd.github.machine-man-preview+json"
          },
          method: "DELETE",
          params: {
            installation_id: {
              required: true,
              type: "integer"
            },
            repository_id: {
              required: true,
              type: "integer"
            }
          },
          url: "/user/installations/:installation_id/repositories/:repository_id"
        },
        resetAuthorization: {
          deprecated: "octokit.apps.resetAuthorization() is deprecated, see https://developer.github.com/v3/apps/oauth_applications/#reset-an-authorization",
          method: "POST",
          params: {
            access_token: {
              required: true,
              type: "string"
            },
            client_id: {
              required: true,
              type: "string"
            }
          },
          url: "/applications/:client_id/tokens/:access_token"
        },
        resetToken: {
          headers: {
            accept: "application/vnd.github.doctor-strange-preview+json"
          },
          method: "PATCH",
          params: {
            access_token: {
              type: "string"
            },
            client_id: {
              required: true,
              type: "string"
            }
          },
          url: "/applications/:client_id/token"
        },
        revokeAuthorizationForApplication: {
          deprecated: "octokit.apps.revokeAuthorizationForApplication() is deprecated, see https://developer.github.com/v3/apps/oauth_applications/#revoke-an-authorization-for-an-application",
          method: "DELETE",
          params: {
            access_token: {
              required: true,
              type: "string"
            },
            client_id: {
              required: true,
              type: "string"
            }
          },
          url: "/applications/:client_id/tokens/:access_token"
        },
        revokeGrantForApplication: {
          deprecated: "octokit.apps.revokeGrantForApplication() is deprecated, see https://developer.github.com/v3/apps/oauth_applications/#revoke-a-grant-for-an-application",
          method: "DELETE",
          params: {
            access_token: {
              required: true,
              type: "string"
            },
            client_id: {
              required: true,
              type: "string"
            }
          },
          url: "/applications/:client_id/grants/:access_token"
        },
        revokeInstallationToken: {
          headers: {
            accept: "application/vnd.github.gambit-preview+json"
          },
          method: "DELETE",
          params: {},
          url: "/installation/token"
        }
      },
      checks: {
        create: {
          headers: {
            accept: "application/vnd.github.antiope-preview+json"
          },
          method: "POST",
          params: {
            actions: {
              type: "object[]"
            },
            "actions[].description": {
              required: true,
              type: "string"
            },
            "actions[].identifier": {
              required: true,
              type: "string"
            },
            "actions[].label": {
              required: true,
              type: "string"
            },
            completed_at: {
              type: "string"
            },
            conclusion: {
              enum: ["success", "failure", "neutral", "cancelled", "timed_out", "action_required"],
              type: "string"
            },
            details_url: {
              type: "string"
            },
            external_id: {
              type: "string"
            },
            head_sha: {
              required: true,
              type: "string"
            },
            name: {
              required: true,
              type: "string"
            },
            output: {
              type: "object"
            },
            "output.annotations": {
              type: "object[]"
            },
            "output.annotations[].annotation_level": {
              enum: ["notice", "warning", "failure"],
              required: true,
              type: "string"
            },
            "output.annotations[].end_column": {
              type: "integer"
            },
            "output.annotations[].end_line": {
              required: true,
              type: "integer"
            },
            "output.annotations[].message": {
              required: true,
              type: "string"
            },
            "output.annotations[].path": {
              required: true,
              type: "string"
            },
            "output.annotations[].raw_details": {
              type: "string"
            },
            "output.annotations[].start_column": {
              type: "integer"
            },
            "output.annotations[].start_line": {
              required: true,
              type: "integer"
            },
            "output.annotations[].title": {
              type: "string"
            },
            "output.images": {
              type: "object[]"
            },
            "output.images[].alt": {
              required: true,
              type: "string"
            },
            "output.images[].caption": {
              type: "string"
            },
            "output.images[].image_url": {
              required: true,
              type: "string"
            },
            "output.summary": {
              required: true,
              type: "string"
            },
            "output.text": {
              type: "string"
            },
            "output.title": {
              required: true,
              type: "string"
            },
            owner: {
              required: true,
              type: "string"
            },
            repo: {
              required: true,
              type: "string"
            },
            started_at: {
              type: "string"
            },
            status: {
              enum: ["queued", "in_progress", "completed"],
              type: "string"
            }
          },
          url: "/repos/:owner/:repo/check-runs"
        },
        createSuite: {
          headers: {
            accept: "application/vnd.github.antiope-preview+json"
          },
          method: "POST",
          params: {
            head_sha: {
              required: true,
              type: "string"
            },
            owner: {
              required: true,
              type: "string"
            },
            repo: {
              required: true,
              type: "string"
            }
          },
          url: "/repos/:owner/:repo/check-suites"
        },
        get: {
          headers: {
            accept: "application/vnd.github.antiope-preview+json"
          },
          method: "GET",
          params: {
            check_run_id: {
              required: true,
              type: "integer"
            },
            owner: {
              required: true,
              type: "string"
            },
            repo: {
              required: true,
              type: "string"
            }
          },
          url: "/repos/:owner/:repo/check-runs/:check_run_id"
        },
        getSuite: {
          headers: {
            accept: "application/vnd.github.antiope-preview+json"
          },
          method: "GET",
          params: {
            check_suite_id: {
              required: true,
              type: "integer"
            },
            owner: {
              required: true,
              type: "string"
            },
            repo: {
              required: true,
              type: "string"
            }
          },
          url: "/repos/:owner/:repo/check-suites/:check_suite_id"
        },
        listAnnotations: {
          headers: {
            accept: "application/vnd.github.antiope-preview+json"
          },
          method: "GET",
          params: {
            check_run_id: {
              required: true,
              type: "integer"
            },
            owner: {
              required: true,
              type: "string"
            },
            page: {
              type: "integer"
            },
            per_page: {
              type: "integer"
            },
            repo: {
              required: true,
              type: "string"
            }
          },
          url: "/repos/:owner/:repo/check-runs/:check_run_id/annotations"
        },
        listForRef: {
          headers: {
            accept: "application/vnd.github.antiope-preview+json"
          },
          method: "GET",
          params: {
            check_name: {
              type: "string"
            },
            filter: {
              enum: ["latest", "all"],
              type: "string"
            },
            owner: {
              required: true,
              type: "string"
            },
            page: {
              type: "integer"
            },
            per_page: {
              type: "integer"
            },
            ref: {
              required: true,
              type: "string"
            },
            repo: {
              required: true,
              type: "string"
            },
            status: {
              enum: ["queued", "in_progress", "completed"],
              type: "string"
            }
          },
          url: "/repos/:owner/:repo/commits/:ref/check-runs"
        },
        listForSuite: {
          headers: {
            accept: "application/vnd.github.antiope-preview+json"
          },
          method: "GET",
          params: {
            check_name: {
              type: "string"
            },
            check_suite_id: {
              required: true,
              type: "integer"
            },
            filter: {
              enum: ["latest", "all"],
              type: "string"
            },
            owner: {
              required: true,
              type: "string"
            },
            page: {
              type: "integer"
            },
            per_page: {
              type: "integer"
            },
            repo: {
              required: true,
              type: "string"
            },
            status: {
              enum: ["queued", "in_progress", "completed"],
              type: "string"
            }
          },
          url: "/repos/:owner/:repo/check-suites/:check_suite_id/check-runs"
        },
        listSuitesForRef: {
          headers: {
            accept: "application/vnd.github.antiope-preview+json"
          },
          method: "GET",
          params: {
            app_id: {
              type: "integer"
            },
            check_name: {
              type: "string"
            },
            owner: {
              required: true,
              type: "string"
            },
            page: {
              type: "integer"
            },
            per_page: {
              type: "integer"
            },
            ref: {
              required: true,
              type: "string"
            },
            repo: {
              required: true,
              type: "string"
            }
          },
          url: "/repos/:owner/:repo/commits/:ref/check-suites"
        },
        rerequestSuite: {
          headers: {
            accept: "application/vnd.github.antiope-preview+json"
          },
          method: "POST",
          params: {
            check_suite_id: {
              required: true,
              type: "integer"
            },
            owner: {
              required: true,
              type: "string"
            },
            repo: {
              required: true,
              type: "string"
            }
          },
          url: "/repos/:owner/:repo/check-suites/:check_suite_id/rerequest"
        },
        setSuitesPreferences: {
          headers: {
            accept: "application/vnd.github.antiope-preview+json"
          },
          method: "PATCH",
          params: {
            auto_trigger_checks: {
              type: "object[]"
            },
            "auto_trigger_checks[].app_id": {
              required: true,
              type: "integer"
            },
            "auto_trigger_checks[].setting": {
              required: true,
              type: "boolean"
            },
            owner: {
              required: true,
              type: "string"
            },
            repo: {
              required: true,
              type: "string"
            }
          },
          url: "/repos/:owner/:repo/check-suites/preferences"
        },
        update: {
          headers: {
            accept: "application/vnd.github.antiope-preview+json"
          },
          method: "PATCH",
          params: {
            actions: {
              type: "object[]"
            },
            "actions[].description": {
              required: true,
              type: "string"
            },
            "actions[].identifier": {
              required: true,
              type: "string"
            },
            "actions[].label": {
              required: true,
              type: "string"
            },
            check_run_id: {
              required: true,
              type: "integer"
            },
            completed_at: {
              type: "string"
            },
            conclusion: {
              enum: ["success", "failure", "neutral", "cancelled", "timed_out", "action_required"],
              type: "string"
            },
            details_url: {
              type: "string"
            },
            external_id: {
              type: "string"
            },
            name: {
              type: "string"
            },
            output: {
              type: "object"
            },
            "output.annotations": {
              type: "object[]"
            },
            "output.annotations[].annotation_level": {
              enum: ["notice", "warning", "failure"],
              required: true,
              type: "string"
            },
            "output.annotations[].end_column": {
              type: "integer"
            },
            "output.annotations[].end_line": {
              required: true,
              type: "integer"
            },
            "output.annotations[].message": {
              required: true,
              type: "string"
            },
            "output.annotations[].path": {
              required: true,
              type: "string"
            },
            "output.annotations[].raw_details": {
              type: "string"
            },
            "output.annotations[].start_column": {
              type: "integer"
            },
            "output.annotations[].start_line": {
              required: true,
              type: "integer"
            },
            "output.annotations[].title": {
              type: "string"
            },
            "output.images": {
              type: "object[]"
            },
            "output.images[].alt": {
              required: true,
              type: "string"
            },
            "output.images[].caption": {
              type: "string"
            },
            "output.images[].image_url": {
              required: true,
              type: "string"
            },
            "output.summary": {
              required: true,
              type: "string"
            },
            "output.text": {
              type: "string"
            },
            "output.title": {
              type: "string"
            },
            owner: {
              required: true,
              type: "string"
            },
            repo: {
              required: true,
              type: "string"
            },
            started_at: {
              type: "string"
            },
            status: {
              enum: ["queued", "in_progress", "completed"],
              type: "string"
            }
          },
          url: "/repos/:owner/:repo/check-runs/:check_run_id"
        }
      },
      codesOfConduct: {
        getConductCode: {
          headers: {
            accept: "application/vnd.github.scarlet-witch-preview+json"
          },
          method: "GET",
          params: {
            key: {
              required: true,
              type: "string"
            }
          },
          url: "/codes_of_conduct/:key"
        },
        getForRepo: {
          headers: {
            accept: "application/vnd.github.scarlet-witch-preview+json"
          },
          method: "GET",
          params: {
            owner: {
              required: true,
              type: "string"
            },
            repo: {
              required: true,
              type: "string"
            }
          },
          url: "/repos/:owner/:repo/community/code_of_conduct"
        },
        listConductCodes: {
          headers: {
            accept: "application/vnd.github.scarlet-witch-preview+json"
          },
          method: "GET",
          params: {},
          url: "/codes_of_conduct"
        }
      },
      emojis: {
        get: {
          method: "GET",
          params: {},
          url: "/emojis"
        }
      },
      gists: {
        checkIsStarred: {
          method: "GET",
          params: {
            gist_id: {
              required: true,
              type: "string"
            }
          },
          url: "/gists/:gist_id/star"
        },
        create: {
          method: "POST",
          params: {
            description: {
              type: "string"
            },
            files: {
              required: true,
              type: "object"
            },
            "files.content": {
              type: "string"
            },
            public: {
              type: "boolean"
            }
          },
          url: "/gists"
        },
        createComment: {
          method: "POST",
          params: {
            body: {
              required: true,
              type: "string"
            },
            gist_id: {
              required: true,
              type: "string"
            }
          },
          url: "/gists/:gist_id/comments"
        },
        delete: {
          method: "DELETE",
          params: {
            gist_id: {
              required: true,
              type: "string"
            }
          },
          url: "/gists/:gist_id"
        },
        deleteComment: {
          method: "DELETE",
          params: {
            comment_id: {
              required: true,
              type: "integer"
            },
            gist_id: {
              required: true,
              type: "string"
            }
          },
          url: "/gists/:gist_id/comments/:comment_id"
        },
        fork: {
          method: "POST",
          params: {
            gist_id: {
              required: true,
              type: "string"
            }
          },
          url: "/gists/:gist_id/forks"
        },
        get: {
          method: "GET",
          params: {
            gist_id: {
              required: true,
              type: "string"
            }
          },
          url: "/gists/:gist_id"
        },
        getComment: {
          method: "GET",
          params: {
            comment_id: {
              required: true,
              type: "integer"
            },
            gist_id: {
              required: true,
              type: "string"
            }
          },
          url: "/gists/:gist_id/comments/:comment_id"
        },
        getRevision: {
          method: "GET",
          params: {
            gist_id: {
              required: true,
              type: "string"
            },
            sha: {
              required: true,
              type: "string"
            }
          },
          url: "/gists/:gist_id/:sha"
        },
        list: {
          method: "GET",
          params: {
            page: {
              type: "integer"
            },
            per_page: {
              type: "integer"
            },
            since: {
              type: "string"
            }
          },
          url: "/gists"
        },
        listComments: {
          method: "GET",
          params: {
            gist_id: {
              required: true,
              type: "string"
            },
            page: {
              type: "integer"
            },
            per_page: {
              type: "integer"
            }
          },
          url: "/gists/:gist_id/comments"
        },
        listCommits: {
          method: "GET",
          params: {
            gist_id: {
              required: true,
              type: "string"
            },
            page: {
              type: "integer"
            },
            per_page: {
              type: "integer"
            }
          },
          url: "/gists/:gist_id/commits"
        },
        listForks: {
          method: "GET",
          params: {
            gist_id: {
              required: true,
              type: "string"
            },
            page: {
              type: "integer"
            },
            per_page: {
              type: "integer"
            }
          },
          url: "/gists/:gist_id/forks"
        },
        listPublic: {
          method: "GET",
          params: {
            page: {
              type: "integer"
            },
            per_page: {
              type: "integer"
            },
            since: {
              type: "string"
            }
          },
          url: "/gists/public"
        },
        listPublicForUser: {
          method: "GET",
          params: {
            page: {
              type: "integer"
            },
            per_page: {
              type: "integer"
            },
            since: {
              type: "string"
            },
            username: {
              required: true,
              type: "string"
            }
          },
          url: "/users/:username/gists"
        },
        listStarred: {
          method: "GET",
          params: {
            page: {
              type: "integer"
            },
            per_page: {
              type: "integer"
            },
            since: {
              type: "string"
            }
          },
          url: "/gists/starred"
        },
        star: {
          method: "PUT",
          params: {
            gist_id: {
              required: true,
              type: "string"
            }
          },
          url: "/gists/:gist_id/star"
        },
        unstar: {
          method: "DELETE",
          params: {
            gist_id: {
              required: true,
              type: "string"
            }
          },
          url: "/gists/:gist_id/star"
        },
        update: {
          method: "PATCH",
          params: {
            description: {
              type: "string"
            },
            files: {
              type: "object"
            },
            "files.content": {
              type: "string"
            },
            "files.filename": {
              type: "string"
            },
            gist_id: {
              required: true,
              type: "string"
            }
          },
          url: "/gists/:gist_id"
        },
        updateComment: {
          method: "PATCH",
          params: {
            body: {
              required: true,
              type: "string"
            },
            comment_id: {
              required: true,
              type: "integer"
            },
            gist_id: {
              required: true,
              type: "string"
            }
          },
          url: "/gists/:gist_id/comments/:comment_id"
        }
      },
      git: {
        createBlob: {
          method: "POST",
          params: {
            content: {
              required: true,
              type: "string"
            },
            encoding: {
              type: "string"
            },
            owner: {
              required: true,
              type: "string"
            },
            repo: {
              required: true,
              type: "string"
            }
          },
          url: "/repos/:owner/:repo/git/blobs"
        },
        createCommit: {
          method: "POST",
          params: {
            author: {
              type: "object"
            },
            "author.date": {
              type: "string"
            },
            "author.email": {
              type: "string"
            },
            "author.name": {
              type: "string"
            },
            committer: {
              type: "object"
            },
            "committer.date": {
              type: "string"
            },
            "committer.email": {
              type: "string"
            },
            "committer.name": {
              type: "string"
            },
            message: {
              required: true,
              type: "string"
            },
            owner: {
              required: true,
              type: "string"
            },
            parents: {
              required: true,
              type: "string[]"
            },
            repo: {
              required: true,
              type: "string"
            },
            signature: {
              type: "string"
            },
            tree: {
              required: true,
              type: "string"
            }
          },
          url: "/repos/:owner/:repo/git/commits"
        },
        createRef: {
          method: "POST",
          params: {
            owner: {
              required: true,
              type: "string"
            },
            ref: {
              required: true,
              type: "string"
            },
            repo: {
              required: true,
              type: "string"
            },
            sha: {
              required: true,
              type: "string"
            }
          },
          url: "/repos/:owner/:repo/git/refs"
        },
        createTag: {
          method: "POST",
          params: {
            message: {
              required: true,
              type: "string"
            },
            object: {
              required: true,
              type: "string"
            },
            owner: {
              required: true,
              type: "string"
            },
            repo: {
              required: true,
              type: "string"
            },
            tag: {
              required: true,
              type: "string"
            },
            tagger: {
              type: "object"
            },
            "tagger.date": {
              type: "string"
            },
            "tagger.email": {
              type: "string"
            },
            "tagger.name": {
              type: "string"
            },
            type: {
              enum: ["commit", "tree", "blob"],
              required: true,
              type: "string"
            }
          },
          url: "/repos/:owner/:repo/git/tags"
        },
        createTree: {
          method: "POST",
          params: {
            base_tree: {
              type: "string"
            },
            owner: {
              required: true,
              type: "string"
            },
            repo: {
              required: true,
              type: "string"
            },
            tree: {
              required: true,
              type: "object[]"
            },
            "tree[].content": {
              type: "string"
            },
            "tree[].mode": {
              enum: ["100644", "100755", "040000", "160000", "120000"],
              type: "string"
            },
            "tree[].path": {
              type: "string"
            },
            "tree[].sha": {
              allowNull: true,
              type: "string"
            },
            "tree[].type": {
              enum: ["blob", "tree", "commit"],
              type: "string"
            }
          },
          url: "/repos/:owner/:repo/git/trees"
        },
        deleteRef: {
          method: "DELETE",
          params: {
            owner: {
              required: true,
              type: "string"
            },
            ref: {
              required: true,
              type: "string"
            },
            repo: {
              required: true,
              type: "string"
            }
          },
          url: "/repos/:owner/:repo/git/refs/:ref"
        },
        getBlob: {
          method: "GET",
          params: {
            file_sha: {
              required: true,
              type: "string"
            },
            owner: {
              required: true,
              type: "string"
            },
            repo: {
              required: true,
              type: "string"
            }
          },
          url: "/repos/:owner/:repo/git/blobs/:file_sha"
        },
        getCommit: {
          method: "GET",
          params: {
            commit_sha: {
              required: true,
              type: "string"
            },
            owner: {
              required: true,
              type: "string"
            },
            repo: {
              required: true,
              type: "string"
            }
          },
          url: "/repos/:owner/:repo/git/commits/:commit_sha"
        },
        getRef: {
          method: "GET",
          params: {
            owner: {
              required: true,
              type: "string"
            },
            ref: {
              required: true,
              type: "string"
            },
            repo: {
              required: true,
              type: "string"
            }
          },
          url: "/repos/:owner/:repo/git/ref/:ref"
        },
        getTag: {
          method: "GET",
          params: {
            owner: {
              required: true,
              type: "string"
            },
            repo: {
              required: true,
              type: "string"
            },
            tag_sha: {
              required: true,
              type: "string"
            }
          },
          url: "/repos/:owner/:repo/git/tags/:tag_sha"
        },
        getTree: {
          method: "GET",
          params: {
            owner: {
              required: true,
              type: "string"
            },
            recursive: {
              enum: ["1"],
              type: "integer"
            },
            repo: {
              required: true,
              type: "string"
            },
            tree_sha: {
              required: true,
              type: "string"
            }
          },
          url: "/repos/:owner/:repo/git/trees/:tree_sha"
        },
        listMatchingRefs: {
          method: "GET",
          params: {
            owner: {
              required: true,
              type: "string"
            },
            page: {
              type: "integer"
            },
            per_page: {
              type: "integer"
            },
            ref: {
              required: true,
              type: "string"
            },
            repo: {
              required: true,
              type: "string"
            }
          },
          url: "/repos/:owner/:repo/git/matching-refs/:ref"
        },
        listRefs: {
          method: "GET",
          params: {
            namespace: {
              type: "string"
            },
            owner: {
              required: true,
              type: "string"
            },
            page: {
              type: "integer"
            },
            per_page: {
              type: "integer"
            },
            repo: {
              required: true,
              type: "string"
            }
          },
          url: "/repos/:owner/:repo/git/refs/:namespace"
        },
        updateRef: {
          method: "PATCH",
          params: {
            force: {
              type: "boolean"
            },
            owner: {
              required: true,
              type: "string"
            },
            ref: {
              required: true,
              type: "string"
            },
            repo: {
              required: true,
              type: "string"
            },
            sha: {
              required: true,
              type: "string"
            }
          },
          url: "/repos/:owner/:repo/git/refs/:ref"
        }
      },
      gitignore: {
        getTemplate: {
          method: "GET",
          params: {
            name: {
              required: true,
              type: "string"
            }
          },
          url: "/gitignore/templates/:name"
        },
        listTemplates: {
          method: "GET",
          params: {},
          url: "/gitignore/templates"
        }
      },
      interactions: {
        addOrUpdateRestrictionsForOrg: {
          headers: {
            accept: "application/vnd.github.sombra-preview+json"
          },
          method: "PUT",
          params: {
            limit: {
              enum: ["existing_users", "contributors_only", "collaborators_only"],
              required: true,
              type: "string"
            },
            org: {
              required: true,
              type: "string"
            }
          },
          url: "/orgs/:org/interaction-limits"
        },
        addOrUpdateRestrictionsForRepo: {
          headers: {
            accept: "application/vnd.github.sombra-preview+json"
          },
          method: "PUT",
          params: {
            limit: {
              enum: ["existing_users", "contributors_only", "collaborators_only"],
              required: true,
              type: "string"
            },
            owner: {
              required: true,
              type: "string"
            },
            repo: {
              required: true,
              type: "string"
            }
          },
          url: "/repos/:owner/:repo/interaction-limits"
        },
        getRestrictionsForOrg: {
          headers: {
            accept: "application/vnd.github.sombra-preview+json"
          },
          method: "GET",
          params: {
            org: {
              required: true,
              type: "string"
            }
          },
          url: "/orgs/:org/interaction-limits"
        },
        getRestrictionsForRepo: {
          headers: {
            accept: "application/vnd.github.sombra-preview+json"
          },
          method: "GET",
          params: {
            owner: {
              required: true,
              type: "string"
            },
            repo: {
              required: true,
              type: "string"
            }
          },
          url: "/repos/:owner/:repo/interaction-limits"
        },
        removeRestrictionsForOrg: {
          headers: {
            accept: "application/vnd.github.sombra-preview+json"
          },
          method: "DELETE",
          params: {
            org: {
              required: true,
              type: "string"
            }
          },
          url: "/orgs/:org/interaction-limits"
        },
        removeRestrictionsForRepo: {
          headers: {
            accept: "application/vnd.github.sombra-preview+json"
          },
          method: "DELETE",
          params: {
            owner: {
              required: true,
              type: "string"
            },
            repo: {
              required: true,
              type: "string"
            }
          },
          url: "/repos/:owner/:repo/interaction-limits"
        }
      },
      issues: {
        addAssignees: {
          method: "POST",
          params: {
            assignees: {
              type: "string[]"
            },
            issue_number: {
              required: true,
              type: "integer"
            },
            number: {
              alias: "issue_number",
              deprecated: true,
              type: "integer"
            },
            owner: {
              required: true,
              type: "string"
            },
            repo: {
              required: true,
              type: "string"
            }
          },
          url: "/repos/:owner/:repo/issues/:issue_number/assignees"
        },
        addLabels: {
          method: "POST",
          params: {
            issue_number: {
              required: true,
              type: "integer"
            },
            labels: {
              required: true,
              type: "string[]"
            },
            number: {
              alias: "issue_number",
              deprecated: true,
              type: "integer"
            },
            owner: {
              required: true,
              type: "string"
            },
            repo: {
              required: true,
              type: "string"
            }
          },
          url: "/repos/:owner/:repo/issues/:issue_number/labels"
        },
        checkAssignee: {
          method: "GET",
          params: {
            assignee: {
              required: true,
              type: "string"
            },
            owner: {
              required: true,
              type: "string"
            },
            repo: {
              required: true,
              type: "string"
            }
          },
          url: "/repos/:owner/:repo/assignees/:assignee"
        },
        create: {
          method: "POST",
          params: {
            assignee: {
              type: "string"
            },
            assignees: {
              type: "string[]"
            },
            body: {
              type: "string"
            },
            labels: {
              type: "string[]"
            },
            milestone: {
              type: "integer"
            },
            owner: {
              required: true,
              type: "string"
            },
            repo: {
              required: true,
              type: "string"
            },
            title: {
              required: true,
              type: "string"
            }
          },
          url: "/repos/:owner/:repo/issues"
        },
        createComment: {
          method: "POST",
          params: {
            body: {
              required: true,
              type: "string"
            },
            issue_number: {
              required: true,
              type: "integer"
            },
            number: {
              alias: "issue_number",
              deprecated: true,
              type: "integer"
            },
            owner: {
              required: true,
              type: "string"
            },
            repo: {
              required: true,
              type: "string"
            }
          },
          url: "/repos/:owner/:repo/issues/:issue_number/comments"
        },
        createLabel: {
          method: "POST",
          params: {
            color: {
              required: true,
              type: "string"
            },
            description: {
              type: "string"
            },
            name: {
              required: true,
              type: "string"
            },
            owner: {
              required: true,
              type: "string"
            },
            repo: {
              required: true,
              type: "string"
            }
          },
          url: "/repos/:owner/:repo/labels"
        },
        createMilestone: {
          method: "POST",
          params: {
            description: {
              type: "string"
            },
            due_on: {
              type: "string"
            },
            owner: {
              required: true,
              type: "string"
            },
            repo: {
              required: true,
              type: "string"
            },
            state: {
              enum: ["open", "closed"],
              type: "string"
            },
            title: {
              required: true,
              type: "string"
            }
          },
          url: "/repos/:owner/:repo/milestones"
        },
        deleteComment: {
          method: "DELETE",
          params: {
            comment_id: {
              required: true,
              type: "integer"
            },
            owner: {
              required: true,
              type: "string"
            },
            repo: {
              required: true,
              type: "string"
            }
          },
          url: "/repos/:owner/:repo/issues/comments/:comment_id"
        },
        deleteLabel: {
          method: "DELETE",
          params: {
            name: {
              required: true,
              type: "string"
            },
            owner: {
              required: true,
              type: "string"
            },
            repo: {
              required: true,
              type: "string"
            }
          },
          url: "/repos/:owner/:repo/labels/:name"
        },
        deleteMilestone: {
          method: "DELETE",
          params: {
            milestone_number: {
              required: true,
              type: "integer"
            },
            number: {
              alias: "milestone_number",
              deprecated: true,
              type: "integer"
            },
            owner: {
              required: true,
              type: "string"
            },
            repo: {
              required: true,
              type: "string"
            }
          },
          url: "/repos/:owner/:repo/milestones/:milestone_number"
        },
        get: {
          method: "GET",
          params: {
            issue_number: {
              required: true,
              type: "integer"
            },
            number: {
              alias: "issue_number",
              deprecated: true,
              type: "integer"
            },
            owner: {
              required: true,
              type: "string"
            },
            repo: {
              required: true,
              type: "string"
            }
          },
          url: "/repos/:owner/:repo/issues/:issue_number"
        },
        getComment: {
          method: "GET",
          params: {
            comment_id: {
              required: true,
              type: "integer"
            },
            owner: {
              required: true,
              type: "string"
            },
            repo: {
              required: true,
              type: "string"
            }
          },
          url: "/repos/:owner/:repo/issues/comments/:comment_id"
        },
        getEvent: {
          method: "GET",
          params: {
            event_id: {
              required: true,
              type: "integer"
            },
            owner: {
              required: true,
              type: "string"
            },
            repo: {
              required: true,
              type: "string"
            }
          },
          url: "/repos/:owner/:repo/issues/events/:event_id"
        },
        getLabel: {
          method: "GET",
          params: {
            name: {
              required: true,
              type: "string"
            },
            owner: {
              required: true,
              type: "string"
            },
            repo: {
              required: true,
              type: "string"
            }
          },
          url: "/repos/:owner/:repo/labels/:name"
        },
        getMilestone: {
          method: "GET",
          params: {
            milestone_number: {
              required: true,
              type: "integer"
            },
            number: {
              alias: "milestone_number",
              deprecated: true,
              type: "integer"
            },
            owner: {
              required: true,
              type: "string"
            },
            repo: {
              required: true,
              type: "string"
            }
          },
          url: "/repos/:owner/:repo/milestones/:milestone_number"
        },
        list: {
          method: "GET",
          params: {
            direction: {
              enum: ["asc", "desc"],
              type: "string"
            },
            filter: {
              enum: ["assigned", "created", "mentioned", "subscribed", "all"],
              type: "string"
            },
            labels: {
              type: "string"
            },
            page: {
              type: "integer"
            },
            per_page: {
              type: "integer"
            },
            since: {
              type: "string"
            },
            sort: {
              enum: ["created", "updated", "comments"],
              type: "string"
            },
            state: {
              enum: ["open", "closed", "all"],
              type: "string"
            }
          },
          url: "/issues"
        },
        listAssignees: {
          method: "GET",
          params: {
            owner: {
              required: true,
              type: "string"
            },
            page: {
              type: "integer"
            },
            per_page: {
              type: "integer"
            },
            repo: {
              required: true,
              type: "string"
            }
          },
          url: "/repos/:owner/:repo/assignees"
        },
        listComments: {
          method: "GET",
          params: {
            issue_number: {
              required: true,
              type: "integer"
            },
            number: {
              alias: "issue_number",
              deprecated: true,
              type: "integer"
            },
            owner: {
              required: true,
              type: "string"
            },
            page: {
              type: "integer"
            },
            per_page: {
              type: "integer"
            },
            repo: {
              required: true,
              type: "string"
            },
            since: {
              type: "string"
            }
          },
          url: "/repos/:owner/:repo/issues/:issue_number/comments"
        },
        listCommentsForRepo: {
          method: "GET",
          params: {
            direction: {
              enum: ["asc", "desc"],
              type: "string"
            },
            owner: {
              required: true,
              type: "string"
            },
            repo: {
              required: true,
              type: "string"
            },
            since: {
              type: "string"
            },
            sort: {
              enum: ["created", "updated"],
              type: "string"
            }
          },
          url: "/repos/:owner/:repo/issues/comments"
        },
        listEvents: {
          method: "GET",
          params: {
            issue_number: {
              required: true,
              type: "integer"
            },
            number: {
              alias: "issue_number",
              deprecated: true,
              type: "integer"
            },
            owner: {
              required: true,
              type: "string"
            },
            page: {
              type: "integer"
            },
            per_page: {
              type: "integer"
            },
            repo: {
              required: true,
              type: "string"
            }
          },
          url: "/repos/:owner/:repo/issues/:issue_number/events"
        },
        listEventsForRepo: {
          method: "GET",
          params: {
            owner: {
              required: true,
              type: "string"
            },
            page: {
              type: "integer"
            },
            per_page: {
              type: "integer"
            },
            repo: {
              required: true,
              type: "string"
            }
          },
          url: "/repos/:owner/:repo/issues/events"
        },
        listEventsForTimeline: {
          headers: {
            accept: "application/vnd.github.mockingbird-preview+json"
          },
          method: "GET",
          params: {
            issue_number: {
              required: true,
              type: "integer"
            },
            number: {
              alias: "issue_number",
              deprecated: true,
              type: "integer"
            },
            owner: {
              required: true,
              type: "string"
            },
            page: {
              type: "integer"
            },
            per_page: {
              type: "integer"
            },
            repo: {
              required: true,
              type: "string"
            }
          },
          url: "/repos/:owner/:repo/issues/:issue_number/timeline"
        },
        listForAuthenticatedUser: {
          method: "GET",
          params: {
            direction: {
              enum: ["asc", "desc"],
              type: "string"
            },
            filter: {
              enum: ["assigned", "created", "mentioned", "subscribed", "all"],
              type: "string"
            },
            labels: {
              type: "string"
            },
            page: {
              type: "integer"
            },
            per_page: {
              type: "integer"
            },
            since: {
              type: "string"
            },
            sort: {
              enum: ["created", "updated", "comments"],
              type: "string"
            },
            state: {
              enum: ["open", "closed", "all"],
              type: "string"
            }
          },
          url: "/user/issues"
        },
        listForOrg: {
          method: "GET",
          params: {
            direction: {
              enum: ["asc", "desc"],
              type: "string"
            },
            filter: {
              enum: ["assigned", "created", "mentioned", "subscribed", "all"],
              type: "string"
            },
            labels: {
              type: "string"
            },
            org: {
              required: true,
              type: "string"
            },
            page: {
              type: "integer"
            },
            per_page: {
              type: "integer"
            },
            since: {
              type: "string"
            },
            sort: {
              enum: ["created", "updated", "comments"],
              type: "string"
            },
            state: {
              enum: ["open", "closed", "all"],
              type: "string"
            }
          },
          url: "/orgs/:org/issues"
        },
        listForRepo: {
          method: "GET",
          params: {
            assignee: {
              type: "string"
            },
            creator: {
              type: "string"
            },
            direction: {
              enum: ["asc", "desc"],
              type: "string"
            },
            labels: {
              type: "string"
            },
            mentioned: {
              type: "string"
            },
            milestone: {
              type: "string"
            },
            owner: {
              required: true,
              type: "string"
            },
            page: {
              type: "integer"
            },
            per_page: {
              type: "integer"
            },
            repo: {
              required: true,
              type: "string"
            },
            since: {
              type: "string"
            },
            sort: {
              enum: ["created", "updated", "comments"],
              type: "string"
            },
            state: {
              enum: ["open", "closed", "all"],
              type: "string"
            }
          },
          url: "/repos/:owner/:repo/issues"
        },
        listLabelsForMilestone: {
          method: "GET",
          params: {
            milestone_number: {
              required: true,
              type: "integer"
            },
            number: {
              alias: "milestone_number",
              deprecated: true,
              type: "integer"
            },
            owner: {
              required: true,
              type: "string"
            },
            page: {
              type: "integer"
            },
            per_page: {
              type: "integer"
            },
            repo: {
              required: true,
              type: "string"
            }
          },
          url: "/repos/:owner/:repo/milestones/:milestone_number/labels"
        },
        listLabelsForRepo: {
          method: "GET",
          params: {
            owner: {
              required: true,
              type: "string"
            },
            page: {
              type: "integer"
            },
            per_page: {
              type: "integer"
            },
            repo: {
              required: true,
              type: "string"
            }
          },
          url: "/repos/:owner/:repo/labels"
        },
        listLabelsOnIssue: {
          method: "GET",
          params: {
            issue_number: {
              required: true,
              type: "integer"
            },
            number: {
              alias: "issue_number",
              deprecated: true,
              type: "integer"
            },
            owner: {
              required: true,
              type: "string"
            },
            page: {
              type: "integer"
            },
            per_page: {
              type: "integer"
            },
            repo: {
              required: true,
              type: "string"
            }
          },
          url: "/repos/:owner/:repo/issues/:issue_number/labels"
        },
        listMilestonesForRepo: {
          method: "GET",
          params: {
            direction: {
              enum: ["asc", "desc"],
              type: "string"
            },
            owner: {
              required: true,
              type: "string"
            },
            page: {
              type: "integer"
            },
            per_page: {
              type: "integer"
            },
            repo: {
              required: true,
              type: "string"
            },
            sort: {
              enum: ["due_on", "completeness"],
              type: "string"
            },
            state: {
              enum: ["open", "closed", "all"],
              type: "string"
            }
          },
          url: "/repos/:owner/:repo/milestones"
        },
        lock: {
          method: "PUT",
          params: {
            issue_number: {
              required: true,
              type: "integer"
            },
            lock_reason: {
              enum: ["off-topic", "too heated", "resolved", "spam"],
              type: "string"
            },
            number: {
              alias: "issue_number",
              deprecated: true,
              type: "integer"
            },
            owner: {
              required: true,
              type: "string"
            },
            repo: {
              required: true,
              type: "string"
            }
          },
          url: "/repos/:owner/:repo/issues/:issue_number/lock"
        },
        removeAssignees: {
          method: "DELETE",
          params: {
            assignees: {
              type: "string[]"
            },
            issue_number: {
              required: true,
              type: "integer"
            },
            number: {
              alias: "issue_number",
              deprecated: true,
              type: "integer"
            },
            owner: {
              required: true,
              type: "string"
            },
            repo: {
              required: true,
              type: "string"
            }
          },
          url: "/repos/:owner/:repo/issues/:issue_number/assignees"
        },
        removeLabel: {
          method: "DELETE",
          params: {
            issue_number: {
              required: true,
              type: "integer"
            },
            name: {
              required: true,
              type: "string"
            },
            number: {
              alias: "issue_number",
              deprecated: true,
              type: "integer"
            },
            owner: {
              required: true,
              type: "string"
            },
            repo: {
              required: true,
              type: "string"
            }
          },
          url: "/repos/:owner/:repo/issues/:issue_number/labels/:name"
        },
        removeLabels: {
          method: "DELETE",
          params: {
            issue_number: {
              required: true,
              type: "integer"
            },
            number: {
              alias: "issue_number",
              deprecated: true,
              type: "integer"
            },
            owner: {
              required: true,
              type: "string"
            },
            repo: {
              required: true,
              type: "string"
            }
          },
          url: "/repos/:owner/:repo/issues/:issue_number/labels"
        },
        replaceLabels: {
          method: "PUT",
          params: {
            issue_number: {
              required: true,
              type: "integer"
            },
            labels: {
              type: "string[]"
            },
            number: {
              alias: "issue_number",
              deprecated: true,
              type: "integer"
            },
            owner: {
              required: true,
              type: "string"
            },
            repo: {
              required: true,
              type: "string"
            }
          },
          url: "/repos/:owner/:repo/issues/:issue_number/labels"
        },
        unlock: {
          method: "DELETE",
          params: {
            issue_number: {
              required: true,
              type: "integer"
            },
            number: {
              alias: "issue_number",
              deprecated: true,
              type: "integer"
            },
            owner: {
              required: true,
              type: "string"
            },
            repo: {
              required: true,
              type: "string"
            }
          },
          url: "/repos/:owner/:repo/issues/:issue_number/lock"
        },
        update: {
          method: "PATCH",
          params: {
            assignee: {
              type: "string"
            },
            assignees: {
              type: "string[]"
            },
            body: {
              type: "string"
            },
            issue_number: {
              required: true,
              type: "integer"
            },
            labels: {
              type: "string[]"
            },
            milestone: {
              allowNull: true,
              type: "integer"
            },
            number: {
              alias: "issue_number",
              deprecated: true,
              type: "integer"
            },
            owner: {
              required: true,
              type: "string"
            },
            repo: {
              required: true,
              type: "string"
            },
            state: {
              enum: ["open", "closed"],
              type: "string"
            },
            title: {
              type: "string"
            }
          },
          url: "/repos/:owner/:repo/issues/:issue_number"
        },
        updateComment: {
          method: "PATCH",
          params: {
            body: {
              required: true,
              type: "string"
            },
            comment_id: {
              required: true,
              type: "integer"
            },
            owner: {
              required: true,
              type: "string"
            },
            repo: {
              required: true,
              type: "string"
            }
          },
          url: "/repos/:owner/:repo/issues/comments/:comment_id"
        },
        updateLabel: {
          method: "PATCH",
          params: {
            color: {
              type: "string"
            },
            current_name: {
              required: true,
              type: "string"
            },
            description: {
              type: "string"
            },
            name: {
              type: "string"
            },
            owner: {
              required: true,
              type: "string"
            },
            repo: {
              required: true,
              type: "string"
            }
          },
          url: "/repos/:owner/:repo/labels/:current_name"
        },
        updateMilestone: {
          method: "PATCH",
          params: {
            description: {
              type: "string"
            },
            due_on: {
              type: "string"
            },
            milestone_number: {
              required: true,
              type: "integer"
            },
            number: {
              alias: "milestone_number",
              deprecated: true,
              type: "integer"
            },
            owner: {
              required: true,
              type: "string"
            },
            repo: {
              required: true,
              type: "string"
            },
            state: {
              enum: ["open", "closed"],
              type: "string"
            },
            title: {
              type: "string"
            }
          },
          url: "/repos/:owner/:repo/milestones/:milestone_number"
        }
      },
      licenses: {
        get: {
          method: "GET",
          params: {
            license: {
              required: true,
              type: "string"
            }
          },
          url: "/licenses/:license"
        },
        getForRepo: {
          method: "GET",
          params: {
            owner: {
              required: true,
              type: "string"
            },
            repo: {
              required: true,
              type: "string"
            }
          },
          url: "/repos/:owner/:repo/license"
        },
        list: {
          deprecated: "octokit.licenses.list() has been renamed to octokit.licenses.listCommonlyUsed() (2019-03-05)",
          method: "GET",
          params: {},
          url: "/licenses"
        },
        listCommonlyUsed: {
          method: "GET",
          params: {},
          url: "/licenses"
        }
      },
      markdown: {
        render: {
          method: "POST",
          params: {
            context: {
              type: "string"
            },
            mode: {
              enum: ["markdown", "gfm"],
              type: "string"
            },
            text: {
              required: true,
              type: "string"
            }
          },
          url: "/markdown"
        },
        renderRaw: {
          headers: {
            "content-type": "text/plain; charset=utf-8"
          },
          method: "POST",
          params: {
            data: {
              mapTo: "data",
              required: true,
              type: "string"
            }
          },
          url: "/markdown/raw"
        }
      },
      meta: {
        get: {
          method: "GET",
          params: {},
          url: "/meta"
        }
      },
      migrations: {
        cancelImport: {
          method: "DELETE",
          params: {
            owner: {
              required: true,
              type: "string"
            },
            repo: {
              required: true,
              type: "string"
            }
          },
          url: "/repos/:owner/:repo/import"
        },
        deleteArchiveForAuthenticatedUser: {
          headers: {
            accept: "application/vnd.github.wyandotte-preview+json"
          },
          method: "DELETE",
          params: {
            migration_id: {
              required: true,
              type: "integer"
            }
          },
          url: "/user/migrations/:migration_id/archive"
        },
        deleteArchiveForOrg: {
          headers: {
            accept: "application/vnd.github.wyandotte-preview+json"
          },
          method: "DELETE",
          params: {
            migration_id: {
              required: true,
              type: "integer"
            },
            org: {
              required: true,
              type: "string"
            }
          },
          url: "/orgs/:org/migrations/:migration_id/archive"
        },
        downloadArchiveForOrg: {
          headers: {
            accept: "application/vnd.github.wyandotte-preview+json"
          },
          method: "GET",
          params: {
            migration_id: {
              required: true,
              type: "integer"
            },
            org: {
              required: true,
              type: "string"
            }
          },
          url: "/orgs/:org/migrations/:migration_id/archive"
        },
        getArchiveForAuthenticatedUser: {
          headers: {
            accept: "application/vnd.github.wyandotte-preview+json"
          },
          method: "GET",
          params: {
            migration_id: {
              required: true,
              type: "integer"
            }
          },
          url: "/user/migrations/:migration_id/archive"
        },
        getArchiveForOrg: {
          deprecated: "octokit.migrations.getArchiveForOrg() has been renamed to octokit.migrations.downloadArchiveForOrg() (2020-01-27)",
          headers: {
            accept: "application/vnd.github.wyandotte-preview+json"
          },
          method: "GET",
          params: {
            migration_id: {
              required: true,
              type: "integer"
            },
            org: {
              required: true,
              type: "string"
            }
          },
          url: "/orgs/:org/migrations/:migration_id/archive"
        },
        getCommitAuthors: {
          method: "GET",
          params: {
            owner: {
              required: true,
              type: "string"
            },
            repo: {
              required: true,
              type: "string"
            },
            since: {
              type: "string"
            }
          },
          url: "/repos/:owner/:repo/import/authors"
        },
        getImportProgress: {
          method: "GET",
          params: {
            owner: {
              required: true,
              type: "string"
            },
            repo: {
              required: true,
              type: "string"
            }
          },
          url: "/repos/:owner/:repo/import"
        },
        getLargeFiles: {
          method: "GET",
          params: {
            owner: {
              required: true,
              type: "string"
            },
            repo: {
              required: true,
              type: "string"
            }
          },
          url: "/repos/:owner/:repo/import/large_files"
        },
        getStatusForAuthenticatedUser: {
          headers: {
            accept: "application/vnd.github.wyandotte-preview+json"
          },
          method: "GET",
          params: {
            migration_id: {
              required: true,
              type: "integer"
            }
          },
          url: "/user/migrations/:migration_id"
        },
        getStatusForOrg: {
          headers: {
            accept: "application/vnd.github.wyandotte-preview+json"
          },
          method: "GET",
          params: {
            migration_id: {
              required: true,
              type: "integer"
            },
            org: {
              required: true,
              type: "string"
            }
          },
          url: "/orgs/:org/migrations/:migration_id"
        },
        listForAuthenticatedUser: {
          headers: {
            accept: "application/vnd.github.wyandotte-preview+json"
          },
          method: "GET",
          params: {
            page: {
              type: "integer"
            },
            per_page: {
              type: "integer"
            }
          },
          url: "/user/migrations"
        },
        listForOrg: {
          headers: {
            accept: "application/vnd.github.wyandotte-preview+json"
          },
          method: "GET",
          params: {
            org: {
              required: true,
              type: "string"
            },
            page: {
              type: "integer"
            },
            per_page: {
              type: "integer"
            }
          },
          url: "/orgs/:org/migrations"
        },
        listReposForOrg: {
          headers: {
            accept: "application/vnd.github.wyandotte-preview+json"
          },
          method: "GET",
          params: {
            migration_id: {
              required: true,
              type: "integer"
            },
            org: {
              required: true,
              type: "string"
            },
            page: {
              type: "integer"
            },
            per_page: {
              type: "integer"
            }
          },
          url: "/orgs/:org/migrations/:migration_id/repositories"
        },
        listReposForUser: {
          headers: {
            accept: "application/vnd.github.wyandotte-preview+json"
          },
          method: "GET",
          params: {
            migration_id: {
              required: true,
              type: "integer"
            },
            page: {
              type: "integer"
            },
            per_page: {
              type: "integer"
            }
          },
          url: "/user/:migration_id/repositories"
        },
        mapCommitAuthor: {
          method: "PATCH",
          params: {
            author_id: {
              required: true,
              type: "integer"
            },
            email: {
              type: "string"
            },
            name: {
              type: "string"
            },
            owner: {
              required: true,
              type: "string"
            },
            repo: {
              required: true,
              type: "string"
            }
          },
          url: "/repos/:owner/:repo/import/authors/:author_id"
        },
        setLfsPreference: {
          method: "PATCH",
          params: {
            owner: {
              required: true,
              type: "string"
            },
            repo: {
              required: true,
              type: "string"
            },
            use_lfs: {
              enum: ["opt_in", "opt_out"],
              required: true,
              type: "string"
            }
          },
          url: "/repos/:owner/:repo/import/lfs"
        },
        startForAuthenticatedUser: {
          method: "POST",
          params: {
            exclude_attachments: {
              type: "boolean"
            },
            lock_repositories: {
              type: "boolean"
            },
            repositories: {
              required: true,
              type: "string[]"
            }
          },
          url: "/user/migrations"
        },
        startForOrg: {
          method: "POST",
          params: {
            exclude_attachments: {
              type: "boolean"
            },
            lock_repositories: {
              type: "boolean"
            },
            org: {
              required: true,
              type: "string"
            },
            repositories: {
              required: true,
              type: "string[]"
            }
          },
          url: "/orgs/:org/migrations"
        },
        startImport: {
          method: "PUT",
          params: {
            owner: {
              required: true,
              type: "string"
            },
            repo: {
              required: true,
              type: "string"
            },
            tfvc_project: {
              type: "string"
            },
            vcs: {
              enum: ["subversion", "git", "mercurial", "tfvc"],
              type: "string"
            },
            vcs_password: {
              type: "string"
            },
            vcs_url: {
              required: true,
              type: "string"
            },
            vcs_username: {
              type: "string"
            }
          },
          url: "/repos/:owner/:repo/import"
        },
        unlockRepoForAuthenticatedUser: {
          headers: {
            accept: "application/vnd.github.wyandotte-preview+json"
          },
          method: "DELETE",
          params: {
            migration_id: {
              required: true,
              type: "integer"
            },
            repo_name: {
              required: true,
              type: "string"
            }
          },
          url: "/user/migrations/:migration_id/repos/:repo_name/lock"
        },
        unlockRepoForOrg: {
          headers: {
            accept: "application/vnd.github.wyandotte-preview+json"
          },
          method: "DELETE",
          params: {
            migration_id: {
              required: true,
              type: "integer"
            },
            org: {
              required: true,
              type: "string"
            },
            repo_name: {
              required: true,
              type: "string"
            }
          },
          url: "/orgs/:org/migrations/:migration_id/repos/:repo_name/lock"
        },
        updateImport: {
          method: "PATCH",
          params: {
            owner: {
              required: true,
              type: "string"
            },
            repo: {
              required: true,
              type: "string"
            },
            vcs_password: {
              type: "string"
            },
            vcs_username: {
              type: "string"
            }
          },
          url: "/repos/:owner/:repo/import"
        }
      },
      oauthAuthorizations: {
        checkAuthorization: {
          deprecated: "octokit.oauthAuthorizations.checkAuthorization() has been renamed to octokit.apps.checkAuthorization() (2019-11-05)",
          method: "GET",
          params: {
            access_token: {
              required: true,
              type: "string"
            },
            client_id: {
              required: true,
              type: "string"
            }
          },
          url: "/applications/:client_id/tokens/:access_token"
        },
        createAuthorization: {
          deprecated: "octokit.oauthAuthorizations.createAuthorization() is deprecated, see https://developer.github.com/v3/oauth_authorizations/#create-a-new-authorization",
          method: "POST",
          params: {
            client_id: {
              type: "string"
            },
            client_secret: {
              type: "string"
            },
            fingerprint: {
              type: "string"
            },
            note: {
              required: true,
              type: "string"
            },
            note_url: {
              type: "string"
            },
            scopes: {
              type: "string[]"
            }
          },
          url: "/authorizations"
        },
        deleteAuthorization: {
          deprecated: "octokit.oauthAuthorizations.deleteAuthorization() is deprecated, see https://developer.github.com/v3/oauth_authorizations/#delete-an-authorization",
          method: "DELETE",
          params: {
            authorization_id: {
              required: true,
              type: "integer"
            }
          },
          url: "/authorizations/:authorization_id"
        },
        deleteGrant: {
          deprecated: "octokit.oauthAuthorizations.deleteGrant() is deprecated, see https://developer.github.com/v3/oauth_authorizations/#delete-a-grant",
          method: "DELETE",
          params: {
            grant_id: {
              required: true,
              type: "integer"
            }
          },
          url: "/applications/grants/:grant_id"
        },
        getAuthorization: {
          deprecated: "octokit.oauthAuthorizations.getAuthorization() is deprecated, see https://developer.github.com/v3/oauth_authorizations/#get-a-single-authorization",
          method: "GET",
          params: {
            authorization_id: {
              required: true,
              type: "integer"
            }
          },
          url: "/authorizations/:authorization_id"
        },
        getGrant: {
          deprecated: "octokit.oauthAuthorizations.getGrant() is deprecated, see https://developer.github.com/v3/oauth_authorizations/#get-a-single-grant",
          method: "GET",
          params: {
            grant_id: {
              required: true,
              type: "integer"
            }
          },
          url: "/applications/grants/:grant_id"
        },
        getOrCreateAuthorizationForApp: {
          deprecated: "octokit.oauthAuthorizations.getOrCreateAuthorizationForApp() is deprecated, see https://developer.github.com/v3/oauth_authorizations/#get-or-create-an-authorization-for-a-specific-app",
          method: "PUT",
          params: {
            client_id: {
              required: true,
              type: "string"
            },
            client_secret: {
              required: true,
              type: "string"
            },
            fingerprint: {
              type: "string"
            },
            note: {
              type: "string"
            },
            note_url: {
              type: "string"
            },
            scopes: {
              type: "string[]"
            }
          },
          url: "/authorizations/clients/:client_id"
        },
        getOrCreateAuthorizationForAppAndFingerprint: {
          deprecated: "octokit.oauthAuthorizations.getOrCreateAuthorizationForAppAndFingerprint() is deprecated, see https://developer.github.com/v3/oauth_authorizations/#get-or-create-an-authorization-for-a-specific-app-and-fingerprint",
          method: "PUT",
          params: {
            client_id: {
              required: true,
              type: "string"
            },
            client_secret: {
              required: true,
              type: "string"
            },
            fingerprint: {
              required: true,
              type: "string"
            },
            note: {
              type: "string"
            },
            note_url: {
              type: "string"
            },
            scopes: {
              type: "string[]"
            }
          },
          url: "/authorizations/clients/:client_id/:fingerprint"
        },
        getOrCreateAuthorizationForAppFingerprint: {
          deprecated: "octokit.oauthAuthorizations.getOrCreateAuthorizationForAppFingerprint() has been renamed to octokit.oauthAuthorizations.getOrCreateAuthorizationForAppAndFingerprint() (2018-12-27)",
          method: "PUT",
          params: {
            client_id: {
              required: true,
              type: "string"
            },
            client_secret: {
              required: true,
              type: "string"
            },
            fingerprint: {
              required: true,
              type: "string"
            },
            note: {
              type: "string"
            },
            note_url: {
              type: "string"
            },
            scopes: {
              type: "string[]"
            }
          },
          url: "/authorizations/clients/:client_id/:fingerprint"
        },
        listAuthorizations: {
          deprecated: "octokit.oauthAuthorizations.listAuthorizations() is deprecated, see https://developer.github.com/v3/oauth_authorizations/#list-your-authorizations",
          method: "GET",
          params: {
            page: {
              type: "integer"
            },
            per_page: {
              type: "integer"
            }
          },
          url: "/authorizations"
        },
        listGrants: {
          deprecated: "octokit.oauthAuthorizations.listGrants() is deprecated, see https://developer.github.com/v3/oauth_authorizations/#list-your-grants",
          method: "GET",
          params: {
            page: {
              type: "integer"
            },
            per_page: {
              type: "integer"
            }
          },
          url: "/applications/grants"
        },
        resetAuthorization: {
          deprecated: "octokit.oauthAuthorizations.resetAuthorization() has been renamed to octokit.apps.resetAuthorization() (2019-11-05)",
          method: "POST",
          params: {
            access_token: {
              required: true,
              type: "string"
            },
            client_id: {
              required: true,
              type: "string"
            }
          },
          url: "/applications/:client_id/tokens/:access_token"
        },
        revokeAuthorizationForApplication: {
          deprecated: "octokit.oauthAuthorizations.revokeAuthorizationForApplication() has been renamed to octokit.apps.revokeAuthorizationForApplication() (2019-11-05)",
          method: "DELETE",
          params: {
            access_token: {
              required: true,
              type: "string"
            },
            client_id: {
              required: true,
              type: "string"
            }
          },
          url: "/applications/:client_id/tokens/:access_token"
        },
        revokeGrantForApplication: {
          deprecated: "octokit.oauthAuthorizations.revokeGrantForApplication() has been renamed to octokit.apps.revokeGrantForApplication() (2019-11-05)",
          method: "DELETE",
          params: {
            access_token: {
              required: true,
              type: "string"
            },
            client_id: {
              required: true,
              type: "string"
            }
          },
          url: "/applications/:client_id/grants/:access_token"
        },
        updateAuthorization: {
          deprecated: "octokit.oauthAuthorizations.updateAuthorization() is deprecated, see https://developer.github.com/v3/oauth_authorizations/#update-an-existing-authorization",
          method: "PATCH",
          params: {
            add_scopes: {
              type: "string[]"
            },
            authorization_id: {
              required: true,
              type: "integer"
            },
            fingerprint: {
              type: "string"
            },
            note: {
              type: "string"
            },
            note_url: {
              type: "string"
            },
            remove_scopes: {
              type: "string[]"
            },
            scopes: {
              type: "string[]"
            }
          },
          url: "/authorizations/:authorization_id"
        }
      },
      orgs: {
        addOrUpdateMembership: {
          method: "PUT",
          params: {
            org: {
              required: true,
              type: "string"
            },
            role: {
              enum: ["admin", "member"],
              type: "string"
            },
            username: {
              required: true,
              type: "string"
            }
          },
          url: "/orgs/:org/memberships/:username"
        },
        blockUser: {
          method: "PUT",
          params: {
            org: {
              required: true,
              type: "string"
            },
            username: {
              required: true,
              type: "string"
            }
          },
          url: "/orgs/:org/blocks/:username"
        },
        checkBlockedUser: {
          method: "GET",
          params: {
            org: {
              required: true,
              type: "string"
            },
            username: {
              required: true,
              type: "string"
            }
          },
          url: "/orgs/:org/blocks/:username"
        },
        checkMembership: {
          method: "GET",
          params: {
            org: {
              required: true,
              type: "string"
            },
            username: {
              required: true,
              type: "string"
            }
          },
          url: "/orgs/:org/members/:username"
        },
        checkPublicMembership: {
          method: "GET",
          params: {
            org: {
              required: true,
              type: "string"
            },
            username: {
              required: true,
              type: "string"
            }
          },
          url: "/orgs/:org/public_members/:username"
        },
        concealMembership: {
          method: "DELETE",
          params: {
            org: {
              required: true,
              type: "string"
            },
            username: {
              required: true,
              type: "string"
            }
          },
          url: "/orgs/:org/public_members/:username"
        },
        convertMemberToOutsideCollaborator: {
          method: "PUT",
          params: {
            org: {
              required: true,
              type: "string"
            },
            username: {
              required: true,
              type: "string"
            }
          },
          url: "/orgs/:org/outside_collaborators/:username"
        },
        createHook: {
          method: "POST",
          params: {
            active: {
              type: "boolean"
            },
            config: {
              required: true,
              type: "object"
            },
            "config.content_type": {
              type: "string"
            },
            "config.insecure_ssl": {
              type: "string"
            },
            "config.secret": {
              type: "string"
            },
            "config.url": {
              required: true,
              type: "string"
            },
            events: {
              type: "string[]"
            },
            name: {
              required: true,
              type: "string"
            },
            org: {
              required: true,
              type: "string"
            }
          },
          url: "/orgs/:org/hooks"
        },
        createInvitation: {
          method: "POST",
          params: {
            email: {
              type: "string"
            },
            invitee_id: {
              type: "integer"
            },
            org: {
              required: true,
              type: "string"
            },
            role: {
              enum: ["admin", "direct_member", "billing_manager"],
              type: "string"
            },
            team_ids: {
              type: "integer[]"
            }
          },
          url: "/orgs/:org/invitations"
        },
        deleteHook: {
          method: "DELETE",
          params: {
            hook_id: {
              required: true,
              type: "integer"
            },
            org: {
              required: true,
              type: "string"
            }
          },
          url: "/orgs/:org/hooks/:hook_id"
        },
        get: {
          method: "GET",
          params: {
            org: {
              required: true,
              type: "string"
            }
          },
          url: "/orgs/:org"
        },
        getHook: {
          method: "GET",
          params: {
            hook_id: {
              required: true,
              type: "integer"
            },
            org: {
              required: true,
              type: "string"
            }
          },
          url: "/orgs/:org/hooks/:hook_id"
        },
        getMembership: {
          method: "GET",
          params: {
            org: {
              required: true,
              type: "string"
            },
            username: {
              required: true,
              type: "string"
            }
          },
          url: "/orgs/:org/memberships/:username"
        },
        getMembershipForAuthenticatedUser: {
          method: "GET",
          params: {
            org: {
              required: true,
              type: "string"
            }
          },
          url: "/user/memberships/orgs/:org"
        },
        list: {
          method: "GET",
          params: {
            page: {
              type: "integer"
            },
            per_page: {
              type: "integer"
            },
            since: {
              type: "integer"
            }
          },
          url: "/organizations"
        },
        listBlockedUsers: {
          method: "GET",
          params: {
            org: {
              required: true,
              type: "string"
            }
          },
          url: "/orgs/:org/blocks"
        },
        listForAuthenticatedUser: {
          method: "GET",
          params: {
            page: {
              type: "integer"
            },
            per_page: {
              type: "integer"
            }
          },
          url: "/user/orgs"
        },
        listForUser: {
          method: "GET",
          params: {
            page: {
              type: "integer"
            },
            per_page: {
              type: "integer"
            },
            username: {
              required: true,
              type: "string"
            }
          },
          url: "/users/:username/orgs"
        },
        listHooks: {
          method: "GET",
          params: {
            org: {
              required: true,
              type: "string"
            },
            page: {
              type: "integer"
            },
            per_page: {
              type: "integer"
            }
          },
          url: "/orgs/:org/hooks"
        },
        listInstallations: {
          headers: {
            accept: "application/vnd.github.machine-man-preview+json"
          },
          method: "GET",
          params: {
            org: {
              required: true,
              type: "string"
            },
            page: {
              type: "integer"
            },
            per_page: {
              type: "integer"
            }
          },
          url: "/orgs/:org/installations"
        },
        listInvitationTeams: {
          method: "GET",
          params: {
            invitation_id: {
              required: true,
              type: "integer"
            },
            org: {
              required: true,
              type: "string"
            },
            page: {
              type: "integer"
            },
            per_page: {
              type: "integer"
            }
          },
          url: "/orgs/:org/invitations/:invitation_id/teams"
        },
        listMembers: {
          method: "GET",
          params: {
            filter: {
              enum: ["2fa_disabled", "all"],
              type: "string"
            },
            org: {
              required: true,
              type: "string"
            },
            page: {
              type: "integer"
            },
            per_page: {
              type: "integer"
            },
            role: {
              enum: ["all", "admin", "member"],
              type: "string"
            }
          },
          url: "/orgs/:org/members"
        },
        listMemberships: {
          method: "GET",
          params: {
            page: {
              type: "integer"
            },
            per_page: {
              type: "integer"
            },
            state: {
              enum: ["active", "pending"],
              type: "string"
            }
          },
          url: "/user/memberships/orgs"
        },
        listOutsideCollaborators: {
          method: "GET",
          params: {
            filter: {
              enum: ["2fa_disabled", "all"],
              type: "string"
            },
            org: {
              required: true,
              type: "string"
            },
            page: {
              type: "integer"
            },
            per_page: {
              type: "integer"
            }
          },
          url: "/orgs/:org/outside_collaborators"
        },
        listPendingInvitations: {
          method: "GET",
          params: {
            org: {
              required: true,
              type: "string"
            },
            page: {
              type: "integer"
            },
            per_page: {
              type: "integer"
            }
          },
          url: "/orgs/:org/invitations"
        },
        listPublicMembers: {
          method: "GET",
          params: {
            org: {
              required: true,
              type: "string"
            },
            page: {
              type: "integer"
            },
            per_page: {
              type: "integer"
            }
          },
          url: "/orgs/:org/public_members"
        },
        pingHook: {
          method: "POST",
          params: {
            hook_id: {
              required: true,
              type: "integer"
            },
            org: {
              required: true,
              type: "string"
            }
          },
          url: "/orgs/:org/hooks/:hook_id/pings"
        },
        publicizeMembership: {
          method: "PUT",
          params: {
            org: {
              required: true,
              type: "string"
            },
            username: {
              required: true,
              type: "string"
            }
          },
          url: "/orgs/:org/public_members/:username"
        },
        removeMember: {
          method: "DELETE",
          params: {
            org: {
              required: true,
              type: "string"
            },
            username: {
              required: true,
              type: "string"
            }
          },
          url: "/orgs/:org/members/:username"
        },
        removeMembership: {
          method: "DELETE",
          params: {
            org: {
              required: true,
              type: "string"
            },
            username: {
              required: true,
              type: "string"
            }
          },
          url: "/orgs/:org/memberships/:username"
        },
        removeOutsideCollaborator: {
          method: "DELETE",
          params: {
            org: {
              required: true,
              type: "string"
            },
            username: {
              required: true,
              type: "string"
            }
          },
          url: "/orgs/:org/outside_collaborators/:username"
        },
        unblockUser: {
          method: "DELETE",
          params: {
            org: {
              required: true,
              type: "string"
            },
            username: {
              required: true,
              type: "string"
            }
          },
          url: "/orgs/:org/blocks/:username"
        },
        update: {
          method: "PATCH",
          params: {
            billing_email: {
              type: "string"
            },
            company: {
              type: "string"
            },
            default_repository_permission: {
              enum: ["read", "write", "admin", "none"],
              type: "string"
            },
            description: {
              type: "string"
            },
            email: {
              type: "string"
            },
            has_organization_projects: {
              type: "boolean"
            },
            has_repository_projects: {
              type: "boolean"
            },
            location: {
              type: "string"
            },
            members_allowed_repository_creation_type: {
              enum: ["all", "private", "none"],
              type: "string"
            },
            members_can_create_internal_repositories: {
              type: "boolean"
            },
            members_can_create_private_repositories: {
              type: "boolean"
            },
            members_can_create_public_repositories: {
              type: "boolean"
            },
            members_can_create_repositories: {
              type: "boolean"
            },
            name: {
              type: "string"
            },
            org: {
              required: true,
              type: "string"
            }
          },
          url: "/orgs/:org"
        },
        updateHook: {
          method: "PATCH",
          params: {
            active: {
              type: "boolean"
            },
            config: {
              type: "object"
            },
            "config.content_type": {
              type: "string"
            },
            "config.insecure_ssl": {
              type: "string"
            },
            "config.secret": {
              type: "string"
            },
            "config.url": {
              required: true,
              type: "string"
            },
            events: {
              type: "string[]"
            },
            hook_id: {
              required: true,
              type: "integer"
            },
            org: {
              required: true,
              type: "string"
            }
          },
          url: "/orgs/:org/hooks/:hook_id"
        },
        updateMembership: {
          method: "PATCH",
          params: {
            org: {
              required: true,
              type: "string"
            },
            state: {
              enum: ["active"],
              required: true,
              type: "string"
            }
          },
          url: "/user/memberships/orgs/:org"
        }
      },
      projects: {
        addCollaborator: {
          headers: {
            accept: "application/vnd.github.inertia-preview+json"
          },
          method: "PUT",
          params: {
            permission: {
              enum: ["read", "write", "admin"],
              type: "string"
            },
            project_id: {
              required: true,
              type: "integer"
            },
            username: {
              required: true,
              type: "string"
            }
          },
          url: "/projects/:project_id/collaborators/:username"
        },
        createCard: {
          headers: {
            accept: "application/vnd.github.inertia-preview+json"
          },
          method: "POST",
          params: {
            column_id: {
              required: true,
              type: "integer"
            },
            content_id: {
              type: "integer"
            },
            content_type: {
              type: "string"
            },
            note: {
              type: "string"
            }
          },
          url: "/projects/columns/:column_id/cards"
        },
        createColumn: {
          headers: {
            accept: "application/vnd.github.inertia-preview+json"
          },
          method: "POST",
          params: {
            name: {
              required: true,
              type: "string"
            },
            project_id: {
              required: true,
              type: "integer"
            }
          },
          url: "/projects/:project_id/columns"
        },
        createForAuthenticatedUser: {
          headers: {
            accept: "application/vnd.github.inertia-preview+json"
          },
          method: "POST",
          params: {
            body: {
              type: "string"
            },
            name: {
              required: true,
              type: "string"
            }
          },
          url: "/user/projects"
        },
        createForOrg: {
          headers: {
            accept: "application/vnd.github.inertia-preview+json"
          },
          method: "POST",
          params: {
            body: {
              type: "string"
            },
            name: {
              required: true,
              type: "string"
            },
            org: {
              required: true,
              type: "string"
            }
          },
          url: "/orgs/:org/projects"
        },
        createForRepo: {
          headers: {
            accept: "application/vnd.github.inertia-preview+json"
          },
          method: "POST",
          params: {
            body: {
              type: "string"
            },
            name: {
              required: true,
              type: "string"
            },
            owner: {
              required: true,
              type: "string"
            },
            repo: {
              required: true,
              type: "string"
            }
          },
          url: "/repos/:owner/:repo/projects"
        },
        delete: {
          headers: {
            accept: "application/vnd.github.inertia-preview+json"
          },
          method: "DELETE",
          params: {
            project_id: {
              required: true,
              type: "integer"
            }
          },
          url: "/projects/:project_id"
        },
        deleteCard: {
          headers: {
            accept: "application/vnd.github.inertia-preview+json"
          },
          method: "DELETE",
          params: {
            card_id: {
              required: true,
              type: "integer"
            }
          },
          url: "/projects/columns/cards/:card_id"
        },
        deleteColumn: {
          headers: {
            accept: "application/vnd.github.inertia-preview+json"
          },
          method: "DELETE",
          params: {
            column_id: {
              required: true,
              type: "integer"
            }
          },
          url: "/projects/columns/:column_id"
        },
        get: {
          headers: {
            accept: "application/vnd.github.inertia-preview+json"
          },
          method: "GET",
          params: {
            project_id: {
              required: true,
              type: "integer"
            }
          },
          url: "/projects/:project_id"
        },
        getCard: {
          headers: {
            accept: "application/vnd.github.inertia-preview+json"
          },
          method: "GET",
          params: {
            card_id: {
              required: true,
              type: "integer"
            }
          },
          url: "/projects/columns/cards/:card_id"
        },
        getColumn: {
          headers: {
            accept: "application/vnd.github.inertia-preview+json"
          },
          method: "GET",
          params: {
            column_id: {
              required: true,
              type: "integer"
            }
          },
          url: "/projects/columns/:column_id"
        },
        listCards: {
          headers: {
            accept: "application/vnd.github.inertia-preview+json"
          },
          method: "GET",
          params: {
            archived_state: {
              enum: ["all", "archived", "not_archived"],
              type: "string"
            },
            column_id: {
              required: true,
              type: "integer"
            },
            page: {
              type: "integer"
            },
            per_page: {
              type: "integer"
            }
          },
          url: "/projects/columns/:column_id/cards"
        },
        listCollaborators: {
          headers: {
            accept: "application/vnd.github.inertia-preview+json"
          },
          method: "GET",
          params: {
            affiliation: {
              enum: ["outside", "direct", "all"],
              type: "string"
            },
            page: {
              type: "integer"
            },
            per_page: {
              type: "integer"
            },
            project_id: {
              required: true,
              type: "integer"
            }
          },
          url: "/projects/:project_id/collaborators"
        },
        listColumns: {
          headers: {
            accept: "application/vnd.github.inertia-preview+json"
          },
          method: "GET",
          params: {
            page: {
              type: "integer"
            },
            per_page: {
              type: "integer"
            },
            project_id: {
              required: true,
              type: "integer"
            }
          },
          url: "/projects/:project_id/columns"
        },
        listForOrg: {
          headers: {
            accept: "application/vnd.github.inertia-preview+json"
          },
          method: "GET",
          params: {
            org: {
              required: true,
              type: "string"
            },
            page: {
              type: "integer"
            },
            per_page: {
              type: "integer"
            },
            state: {
              enum: ["open", "closed", "all"],
              type: "string"
            }
          },
          url: "/orgs/:org/projects"
        },
        listForRepo: {
          headers: {
            accept: "application/vnd.github.inertia-preview+json"
          },
          method: "GET",
          params: {
            owner: {
              required: true,
              type: "string"
            },
            page: {
              type: "integer"
            },
            per_page: {
              type: "integer"
            },
            repo: {
              required: true,
              type: "string"
            },
            state: {
              enum: ["open", "closed", "all"],
              type: "string"
            }
          },
          url: "/repos/:owner/:repo/projects"
        },
        listForUser: {
          headers: {
            accept: "application/vnd.github.inertia-preview+json"
          },
          method: "GET",
          params: {
            page: {
              type: "integer"
            },
            per_page: {
              type: "integer"
            },
            state: {
              enum: ["open", "closed", "all"],
              type: "string"
            },
            username: {
              required: true,
              type: "string"
            }
          },
          url: "/users/:username/projects"
        },
        moveCard: {
          headers: {
            accept: "application/vnd.github.inertia-preview+json"
          },
          method: "POST",
          params: {
            card_id: {
              required: true,
              type: "integer"
            },
            column_id: {
              type: "integer"
            },
            position: {
              required: true,
              type: "string",
              validation: "^(top|bottom|after:\\d+)$"
            }
          },
          url: "/projects/columns/cards/:card_id/moves"
        },
        moveColumn: {
          headers: {
            accept: "application/vnd.github.inertia-preview+json"
          },
          method: "POST",
          params: {
            column_id: {
              required: true,
              type: "integer"
            },
            position: {
              required: true,
              type: "string",
              validation: "^(first|last|after:\\d+)$"
            }
          },
          url: "/projects/columns/:column_id/moves"
        },
        removeCollaborator: {
          headers: {
            accept: "application/vnd.github.inertia-preview+json"
          },
          method: "DELETE",
          params: {
            project_id: {
              required: true,
              type: "integer"
            },
            username: {
              required: true,
              type: "string"
            }
          },
          url: "/projects/:project_id/collaborators/:username"
        },
        reviewUserPermissionLevel: {
          headers: {
            accept: "application/vnd.github.inertia-preview+json"
          },
          method: "GET",
          params: {
            project_id: {
              required: true,
              type: "integer"
            },
            username: {
              required: true,
              type: "string"
            }
          },
          url: "/projects/:project_id/collaborators/:username/permission"
        },
        update: {
          headers: {
            accept: "application/vnd.github.inertia-preview+json"
          },
          method: "PATCH",
          params: {
            body: {
              type: "string"
            },
            name: {
              type: "string"
            },
            organization_permission: {
              type: "string"
            },
            private: {
              type: "boolean"
            },
            project_id: {
              required: true,
              type: "integer"
            },
            state: {
              enum: ["open", "closed"],
              type: "string"
            }
          },
          url: "/projects/:project_id"
        },
        updateCard: {
          headers: {
            accept: "application/vnd.github.inertia-preview+json"
          },
          method: "PATCH",
          params: {
            archived: {
              type: "boolean"
            },
            card_id: {
              required: true,
              type: "integer"
            },
            note: {
              type: "string"
            }
          },
          url: "/projects/columns/cards/:card_id"
        },
        updateColumn: {
          headers: {
            accept: "application/vnd.github.inertia-preview+json"
          },
          method: "PATCH",
          params: {
            column_id: {
              required: true,
              type: "integer"
            },
            name: {
              required: true,
              type: "string"
            }
          },
          url: "/projects/columns/:column_id"
        }
      },
      pulls: {
        checkIfMerged: {
          method: "GET",
          params: {
            number: {
              alias: "pull_number",
              deprecated: true,
              type: "integer"
            },
            owner: {
              required: true,
              type: "string"
            },
            pull_number: {
              required: true,
              type: "integer"
            },
            repo: {
              required: true,
              type: "string"
            }
          },
          url: "/repos/:owner/:repo/pulls/:pull_number/merge"
        },
        create: {
          method: "POST",
          params: {
            base: {
              required: true,
              type: "string"
            },
            body: {
              type: "string"
            },
            draft: {
              type: "boolean"
            },
            head: {
              required: true,
              type: "string"
            },
            maintainer_can_modify: {
              type: "boolean"
            },
            owner: {
              required: true,
              type: "string"
            },
            repo: {
              required: true,
              type: "string"
            },
            title: {
              required: true,
              type: "string"
            }
          },
          url: "/repos/:owner/:repo/pulls"
        },
        createComment: {
          method: "POST",
          params: {
            body: {
              required: true,
              type: "string"
            },
            commit_id: {
              required: true,
              type: "string"
            },
            in_reply_to: {
              deprecated: true,
              description: "The comment ID to reply to. **Note**: This must be the ID of a top-level comment, not a reply to that comment. Replies to replies are not supported.",
              type: "integer"
            },
            line: {
              type: "integer"
            },
            number: {
              alias: "pull_number",
              deprecated: true,
              type: "integer"
            },
            owner: {
              required: true,
              type: "string"
            },
            path: {
              required: true,
              type: "string"
            },
            position: {
              type: "integer"
            },
            pull_number: {
              required: true,
              type: "integer"
            },
            repo: {
              required: true,
              type: "string"
            },
            side: {
              enum: ["LEFT", "RIGHT"],
              type: "string"
            },
            start_line: {
              type: "integer"
            },
            start_side: {
              enum: ["LEFT", "RIGHT", "side"],
              type: "string"
            }
          },
          url: "/repos/:owner/:repo/pulls/:pull_number/comments"
        },
        createCommentReply: {
          deprecated: "octokit.pulls.createCommentReply() has been renamed to octokit.pulls.createComment() (2019-09-09)",
          method: "POST",
          params: {
            body: {
              required: true,
              type: "string"
            },
            commit_id: {
              required: true,
              type: "string"
            },
            in_reply_to: {
              deprecated: true,
              description: "The comment ID to reply to. **Note**: This must be the ID of a top-level comment, not a reply to that comment. Replies to replies are not supported.",
              type: "integer"
            },
            line: {
              type: "integer"
            },
            number: {
              alias: "pull_number",
              deprecated: true,
              type: "integer"
            },
            owner: {
              required: true,
              type: "string"
            },
            path: {
              required: true,
              type: "string"
            },
            position: {
              type: "integer"
            },
            pull_number: {
              required: true,
              type: "integer"
            },
            repo: {
              required: true,
              type: "string"
            },
            side: {
              enum: ["LEFT", "RIGHT"],
              type: "string"
            },
            start_line: {
              type: "integer"
            },
            start_side: {
              enum: ["LEFT", "RIGHT", "side"],
              type: "string"
            }
          },
          url: "/repos/:owner/:repo/pulls/:pull_number/comments"
        },
        createFromIssue: {
          deprecated: "octokit.pulls.createFromIssue() is deprecated, see https://developer.github.com/v3/pulls/#create-a-pull-request",
          method: "POST",
          params: {
            base: {
              required: true,
              type: "string"
            },
            draft: {
              type: "boolean"
            },
            head: {
              required: true,
              type: "string"
            },
            issue: {
              required: true,
              type: "integer"
            },
            maintainer_can_modify: {
              type: "boolean"
            },
            owner: {
              required: true,
              type: "string"
            },
            repo: {
              required: true,
              type: "string"
            }
          },
          url: "/repos/:owner/:repo/pulls"
        },
        createReview: {
          method: "POST",
          params: {
            body: {
              type: "string"
            },
            comments: {
              type: "object[]"
            },
            "comments[].body": {
              required: true,
              type: "string"
            },
            "comments[].path": {
              required: true,
              type: "string"
            },
            "comments[].position": {
              required: true,
              type: "integer"
            },
            commit_id: {
              type: "string"
            },
            event: {
              enum: ["APPROVE", "REQUEST_CHANGES", "COMMENT"],
              type: "string"
            },
            number: {
              alias: "pull_number",
              deprecated: true,
              type: "integer"
            },
            owner: {
              required: true,
              type: "string"
            },
            pull_number: {
              required: true,
              type: "integer"
            },
            repo: {
              required: true,
              type: "string"
            }
          },
          url: "/repos/:owner/:repo/pulls/:pull_number/reviews"
        },
        createReviewCommentReply: {
          method: "POST",
          params: {
            body: {
              required: true,
              type: "string"
            },
            comment_id: {
              required: true,
              type: "integer"
            },
            owner: {
              required: true,
              type: "string"
            },
            pull_number: {
              required: true,
              type: "integer"
            },
            repo: {
              required: true,
              type: "string"
            }
          },
          url: "/repos/:owner/:repo/pulls/:pull_number/comments/:comment_id/replies"
        },
        createReviewRequest: {
          method: "POST",
          params: {
            number: {
              alias: "pull_number",
              deprecated: true,
              type: "integer"
            },
            owner: {
              required: true,
              type: "string"
            },
            pull_number: {
              required: true,
              type: "integer"
            },
            repo: {
              required: true,
              type: "string"
            },
            reviewers: {
              type: "string[]"
            },
            team_reviewers: {
              type: "string[]"
            }
          },
          url: "/repos/:owner/:repo/pulls/:pull_number/requested_reviewers"
        },
        deleteComment: {
          method: "DELETE",
          params: {
            comment_id: {
              required: true,
              type: "integer"
            },
            owner: {
              required: true,
              type: "string"
            },
            repo: {
              required: true,
              type: "string"
            }
          },
          url: "/repos/:owner/:repo/pulls/comments/:comment_id"
        },
        deletePendingReview: {
          method: "DELETE",
          params: {
            number: {
              alias: "pull_number",
              deprecated: true,
              type: "integer"
            },
            owner: {
              required: true,
              type: "string"
            },
            pull_number: {
              required: true,
              type: "integer"
            },
            repo: {
              required: true,
              type: "string"
            },
            review_id: {
              required: true,
              type: "integer"
            }
          },
          url: "/repos/:owner/:repo/pulls/:pull_number/reviews/:review_id"
        },
        deleteReviewRequest: {
          method: "DELETE",
          params: {
            number: {
              alias: "pull_number",
              deprecated: true,
              type: "integer"
            },
            owner: {
              required: true,
              type: "string"
            },
            pull_number: {
              required: true,
              type: "integer"
            },
            repo: {
              required: true,
              type: "string"
            },
            reviewers: {
              type: "string[]"
            },
            team_reviewers: {
              type: "string[]"
            }
          },
          url: "/repos/:owner/:repo/pulls/:pull_number/requested_reviewers"
        },
        dismissReview: {
          method: "PUT",
          params: {
            message: {
              required: true,
              type: "string"
            },
            number: {
              alias: "pull_number",
              deprecated: true,
              type: "integer"
            },
            owner: {
              required: true,
              type: "string"
            },
            pull_number: {
              required: true,
              type: "integer"
            },
            repo: {
              required: true,
              type: "string"
            },
            review_id: {
              required: true,
              type: "integer"
            }
          },
          url: "/repos/:owner/:repo/pulls/:pull_number/reviews/:review_id/dismissals"
        },
        get: {
          method: "GET",
          params: {
            number: {
              alias: "pull_number",
              deprecated: true,
              type: "integer"
            },
            owner: {
              required: true,
              type: "string"
            },
            pull_number: {
              required: true,
              type: "integer"
            },
            repo: {
              required: true,
              type: "string"
            }
          },
          url: "/repos/:owner/:repo/pulls/:pull_number"
        },
        getComment: {
          method: "GET",
          params: {
            comment_id: {
              required: true,
              type: "integer"
            },
            owner: {
              required: true,
              type: "string"
            },
            repo: {
              required: true,
              type: "string"
            }
          },
          url: "/repos/:owner/:repo/pulls/comments/:comment_id"
        },
        getCommentsForReview: {
          method: "GET",
          params: {
            number: {
              alias: "pull_number",
              deprecated: true,
              type: "integer"
            },
            owner: {
              required: true,
              type: "string"
            },
            page: {
              type: "integer"
            },
            per_page: {
              type: "integer"
            },
            pull_number: {
              required: true,
              type: "integer"
            },
            repo: {
              required: true,
              type: "string"
            },
            review_id: {
              required: true,
              type: "integer"
            }
          },
          url: "/repos/:owner/:repo/pulls/:pull_number/reviews/:review_id/comments"
        },
        getReview: {
          method: "GET",
          params: {
            number: {
              alias: "pull_number",
              deprecated: true,
              type: "integer"
            },
            owner: {
              required: true,
              type: "string"
            },
            pull_number: {
              required: true,
              type: "integer"
            },
            repo: {
              required: true,
              type: "string"
            },
            review_id: {
              required: true,
              type: "integer"
            }
          },
          url: "/repos/:owner/:repo/pulls/:pull_number/reviews/:review_id"
        },
        list: {
          method: "GET",
          params: {
            base: {
              type: "string"
            },
            direction: {
              enum: ["asc", "desc"],
              type: "string"
            },
            head: {
              type: "string"
            },
            owner: {
              required: true,
              type: "string"
            },
            page: {
              type: "integer"
            },
            per_page: {
              type: "integer"
            },
            repo: {
              required: true,
              type: "string"
            },
            sort: {
              enum: ["created", "updated", "popularity", "long-running"],
              type: "string"
            },
            state: {
              enum: ["open", "closed", "all"],
              type: "string"
            }
          },
          url: "/repos/:owner/:repo/pulls"
        },
        listComments: {
          method: "GET",
          params: {
            direction: {
              enum: ["asc", "desc"],
              type: "string"
            },
            number: {
              alias: "pull_number",
              deprecated: true,
              type: "integer"
            },
            owner: {
              required: true,
              type: "string"
            },
            page: {
              type: "integer"
            },
            per_page: {
              type: "integer"
            },
            pull_number: {
              required: true,
              type: "integer"
            },
            repo: {
              required: true,
              type: "string"
            },
            since: {
              type: "string"
            },
            sort: {
              enum: ["created", "updated"],
              type: "string"
            }
          },
          url: "/repos/:owner/:repo/pulls/:pull_number/comments"
        },
        listCommentsForRepo: {
          method: "GET",
          params: {
            direction: {
              enum: ["asc", "desc"],
              type: "string"
            },
            owner: {
              required: true,
              type: "string"
            },
            page: {
              type: "integer"
            },
            per_page: {
              type: "integer"
            },
            repo: {
              required: true,
              type: "string"
            },
            since: {
              type: "string"
            },
            sort: {
              enum: ["created", "updated"],
              type: "string"
            }
          },
          url: "/repos/:owner/:repo/pulls/comments"
        },
        listCommits: {
          method: "GET",
          params: {
            number: {
              alias: "pull_number",
              deprecated: true,
              type: "integer"
            },
            owner: {
              required: true,
              type: "string"
            },
            page: {
              type: "integer"
            },
            per_page: {
              type: "integer"
            },
            pull_number: {
              required: true,
              type: "integer"
            },
            repo: {
              required: true,
              type: "string"
            }
          },
          url: "/repos/:owner/:repo/pulls/:pull_number/commits"
        },
        listFiles: {
          method: "GET",
          params: {
            number: {
              alias: "pull_number",
              deprecated: true,
              type: "integer"
            },
            owner: {
              required: true,
              type: "string"
            },
            page: {
              type: "integer"
            },
            per_page: {
              type: "integer"
            },
            pull_number: {
              required: true,
              type: "integer"
            },
            repo: {
              required: true,
              type: "string"
            }
          },
          url: "/repos/:owner/:repo/pulls/:pull_number/files"
        },
        listReviewRequests: {
          method: "GET",
          params: {
            number: {
              alias: "pull_number",
              deprecated: true,
              type: "integer"
            },
            owner: {
              required: true,
              type: "string"
            },
            page: {
              type: "integer"
            },
            per_page: {
              type: "integer"
            },
            pull_number: {
              required: true,
              type: "integer"
            },
            repo: {
              required: true,
              type: "string"
            }
          },
          url: "/repos/:owner/:repo/pulls/:pull_number/requested_reviewers"
        },
        listReviews: {
          method: "GET",
          params: {
            number: {
              alias: "pull_number",
              deprecated: true,
              type: "integer"
            },
            owner: {
              required: true,
              type: "string"
            },
            page: {
              type: "integer"
            },
            per_page: {
              type: "integer"
            },
            pull_number: {
              required: true,
              type: "integer"
            },
            repo: {
              required: true,
              type: "string"
            }
          },
          url: "/repos/:owner/:repo/pulls/:pull_number/reviews"
        },
        merge: {
          method: "PUT",
          params: {
            commit_message: {
              type: "string"
            },
            commit_title: {
              type: "string"
            },
            merge_method: {
              enum: ["merge", "squash", "rebase"],
              type: "string"
            },
            number: {
              alias: "pull_number",
              deprecated: true,
              type: "integer"
            },
            owner: {
              required: true,
              type: "string"
            },
            pull_number: {
              required: true,
              type: "integer"
            },
            repo: {
              required: true,
              type: "string"
            },
            sha: {
              type: "string"
            }
          },
          url: "/repos/:owner/:repo/pulls/:pull_number/merge"
        },
        submitReview: {
          method: "POST",
          params: {
            body: {
              type: "string"
            },
            event: {
              enum: ["APPROVE", "REQUEST_CHANGES", "COMMENT"],
              required: true,
              type: "string"
            },
            number: {
              alias: "pull_number",
              deprecated: true,
              type: "integer"
            },
            owner: {
              required: true,
              type: "string"
            },
            pull_number: {
              required: true,
              type: "integer"
            },
            repo: {
              required: true,
              type: "string"
            },
            review_id: {
              required: true,
              type: "integer"
            }
          },
          url: "/repos/:owner/:repo/pulls/:pull_number/reviews/:review_id/events"
        },
        update: {
          method: "PATCH",
          params: {
            base: {
              type: "string"
            },
            body: {
              type: "string"
            },
            maintainer_can_modify: {
              type: "boolean"
            },
            number: {
              alias: "pull_number",
              deprecated: true,
              type: "integer"
            },
            owner: {
              required: true,
              type: "string"
            },
            pull_number: {
              required: true,
              type: "integer"
            },
            repo: {
              required: true,
              type: "string"
            },
            state: {
              enum: ["open", "closed"],
              type: "string"
            },
            title: {
              type: "string"
            }
          },
          url: "/repos/:owner/:repo/pulls/:pull_number"
        },
        updateBranch: {
          headers: {
            accept: "application/vnd.github.lydian-preview+json"
          },
          method: "PUT",
          params: {
            expected_head_sha: {
              type: "string"
            },
            owner: {
              required: true,
              type: "string"
            },
            pull_number: {
              required: true,
              type: "integer"
            },
            repo: {
              required: true,
              type: "string"
            }
          },
          url: "/repos/:owner/:repo/pulls/:pull_number/update-branch"
        },
        updateComment: {
          method: "PATCH",
          params: {
            body: {
              required: true,
              type: "string"
            },
            comment_id: {
              required: true,
              type: "integer"
            },
            owner: {
              required: true,
              type: "string"
            },
            repo: {
              required: true,
              type: "string"
            }
          },
          url: "/repos/:owner/:repo/pulls/comments/:comment_id"
        },
        updateReview: {
          method: "PUT",
          params: {
            body: {
              required: true,
              type: "string"
            },
            number: {
              alias: "pull_number",
              deprecated: true,
              type: "integer"
            },
            owner: {
              required: true,
              type: "string"
            },
            pull_number: {
              required: true,
              type: "integer"
            },
            repo: {
              required: true,
              type: "string"
            },
            review_id: {
              required: true,
              type: "integer"
            }
          },
          url: "/repos/:owner/:repo/pulls/:pull_number/reviews/:review_id"
        }
      },
      rateLimit: {
        get: {
          method: "GET",
          params: {},
          url: "/rate_limit"
        }
      },
      reactions: {
        createForCommitComment: {
          headers: {
            accept: "application/vnd.github.squirrel-girl-preview+json"
          },
          method: "POST",
          params: {
            comment_id: {
              required: true,
              type: "integer"
            },
            content: {
              enum: ["+1", "-1", "laugh", "confused", "heart", "hooray", "rocket", "eyes"],
              required: true,
              type: "string"
            },
            owner: {
              required: true,
              type: "string"
            },
            repo: {
              required: true,
              type: "string"
            }
          },
          url: "/repos/:owner/:repo/comments/:comment_id/reactions"
        },
        createForIssue: {
          headers: {
            accept: "application/vnd.github.squirrel-girl-preview+json"
          },
          method: "POST",
          params: {
            content: {
              enum: ["+1", "-1", "laugh", "confused", "heart", "hooray", "rocket", "eyes"],
              required: true,
              type: "string"
            },
            issue_number: {
              required: true,
              type: "integer"
            },
            number: {
              alias: "issue_number",
              deprecated: true,
              type: "integer"
            },
            owner: {
              required: true,
              type: "string"
            },
            repo: {
              required: true,
              type: "string"
            }
          },
          url: "/repos/:owner/:repo/issues/:issue_number/reactions"
        },
        createForIssueComment: {
          headers: {
            accept: "application/vnd.github.squirrel-girl-preview+json"
          },
          method: "POST",
          params: {
            comment_id: {
              required: true,
              type: "integer"
            },
            content: {
              enum: ["+1", "-1", "laugh", "confused", "heart", "hooray", "rocket", "eyes"],
              required: true,
              type: "string"
            },
            owner: {
              required: true,
              type: "string"
            },
            repo: {
              required: true,
              type: "string"
            }
          },
          url: "/repos/:owner/:repo/issues/comments/:comment_id/reactions"
        },
        createForPullRequestReviewComment: {
          headers: {
            accept: "application/vnd.github.squirrel-girl-preview+json"
          },
          method: "POST",
          params: {
            comment_id: {
              required: true,
              type: "integer"
            },
            content: {
              enum: ["+1", "-1", "laugh", "confused", "heart", "hooray", "rocket", "eyes"],
              required: true,
              type: "string"
            },
            owner: {
              required: true,
              type: "string"
            },
            repo: {
              required: true,
              type: "string"
            }
          },
          url: "/repos/:owner/:repo/pulls/comments/:comment_id/reactions"
        },
        createForTeamDiscussion: {
          deprecated: "octokit.reactions.createForTeamDiscussion() has been renamed to octokit.reactions.createForTeamDiscussionLegacy() (2020-01-16)",
          headers: {
            accept: "application/vnd.github.squirrel-girl-preview+json"
          },
          method: "POST",
          params: {
            content: {
              enum: ["+1", "-1", "laugh", "confused", "heart", "hooray", "rocket", "eyes"],
              required: true,
              type: "string"
            },
            discussion_number: {
              required: true,
              type: "integer"
            },
            team_id: {
              required: true,
              type: "integer"
            }
          },
          url: "/teams/:team_id/discussions/:discussion_number/reactions"
        },
        createForTeamDiscussionComment: {
          deprecated: "octokit.reactions.createForTeamDiscussionComment() has been renamed to octokit.reactions.createForTeamDiscussionCommentLegacy() (2020-01-16)",
          headers: {
            accept: "application/vnd.github.squirrel-girl-preview+json"
          },
          method: "POST",
          params: {
            comment_number: {
              required: true,
              type: "integer"
            },
            content: {
              enum: ["+1", "-1", "laugh", "confused", "heart", "hooray", "rocket", "eyes"],
              required: true,
              type: "string"
            },
            discussion_number: {
              required: true,
              type: "integer"
            },
            team_id: {
              required: true,
              type: "integer"
            }
          },
          url: "/teams/:team_id/discussions/:discussion_number/comments/:comment_number/reactions"
        },
        createForTeamDiscussionCommentInOrg: {
          headers: {
            accept: "application/vnd.github.squirrel-girl-preview+json"
          },
          method: "POST",
          params: {
            comment_number: {
              required: true,
              type: "integer"
            },
            content: {
              enum: ["+1", "-1", "laugh", "confused", "heart", "hooray", "rocket", "eyes"],
              required: true,
              type: "string"
            },
            discussion_number: {
              required: true,
              type: "integer"
            },
            org: {
              required: true,
              type: "string"
            },
            team_slug: {
              required: true,
              type: "string"
            }
          },
          url: "/orgs/:org/teams/:team_slug/discussions/:discussion_number/comments/:comment_number/reactions"
        },
        createForTeamDiscussionCommentLegacy: {
          deprecated: "octokit.reactions.createForTeamDiscussionCommentLegacy() is deprecated, see https://developer.github.com/v3/reactions/#create-reaction-for-a-team-discussion-comment-legacy",
          headers: {
            accept: "application/vnd.github.squirrel-girl-preview+json"
          },
          method: "POST",
          params: {
            comment_number: {
              required: true,
              type: "integer"
            },
            content: {
              enum: ["+1", "-1", "laugh", "confused", "heart", "hooray", "rocket", "eyes"],
              required: true,
              type: "string"
            },
            discussion_number: {
              required: true,
              type: "integer"
            },
            team_id: {
              required: true,
              type: "integer"
            }
          },
          url: "/teams/:team_id/discussions/:discussion_number/comments/:comment_number/reactions"
        },
        createForTeamDiscussionInOrg: {
          headers: {
            accept: "application/vnd.github.squirrel-girl-preview+json"
          },
          method: "POST",
          params: {
            content: {
              enum: ["+1", "-1", "laugh", "confused", "heart", "hooray", "rocket", "eyes"],
              required: true,
              type: "string"
            },
            discussion_number: {
              required: true,
              type: "integer"
            },
            org: {
              required: true,
              type: "string"
            },
            team_slug: {
              required: true,
              type: "string"
            }
          },
          url: "/orgs/:org/teams/:team_slug/discussions/:discussion_number/reactions"
        },
        createForTeamDiscussionLegacy: {
          deprecated: "octokit.reactions.createForTeamDiscussionLegacy() is deprecated, see https://developer.github.com/v3/reactions/#create-reaction-for-a-team-discussion-legacy",
          headers: {
            accept: "application/vnd.github.squirrel-girl-preview+json"
          },
          method: "POST",
          params: {
            content: {
              enum: ["+1", "-1", "laugh", "confused", "heart", "hooray", "rocket", "eyes"],
              required: true,
              type: "string"
            },
            discussion_number: {
              required: true,
              type: "integer"
            },
            team_id: {
              required: true,
              type: "integer"
            }
          },
          url: "/teams/:team_id/discussions/:discussion_number/reactions"
        },
        delete: {
          headers: {
            accept: "application/vnd.github.squirrel-girl-preview+json"
          },
          method: "DELETE",
          params: {
            reaction_id: {
              required: true,
              type: "integer"
            }
          },
          url: "/reactions/:reaction_id"
        },
        listForCommitComment: {
          headers: {
            accept: "application/vnd.github.squirrel-girl-preview+json"
          },
          method: "GET",
          params: {
            comment_id: {
              required: true,
              type: "integer"
            },
            content: {
              enum: ["+1", "-1", "laugh", "confused", "heart", "hooray", "rocket", "eyes"],
              type: "string"
            },
            owner: {
              required: true,
              type: "string"
            },
            page: {
              type: "integer"
            },
            per_page: {
              type: "integer"
            },
            repo: {
              required: true,
              type: "string"
            }
          },
          url: "/repos/:owner/:repo/comments/:comment_id/reactions"
        },
        listForIssue: {
          headers: {
            accept: "application/vnd.github.squirrel-girl-preview+json"
          },
          method: "GET",
          params: {
            content: {
              enum: ["+1", "-1", "laugh", "confused", "heart", "hooray", "rocket", "eyes"],
              type: "string"
            },
            issue_number: {
              required: true,
              type: "integer"
            },
            number: {
              alias: "issue_number",
              deprecated: true,
              type: "integer"
            },
            owner: {
              required: true,
              type: "string"
            },
            page: {
              type: "integer"
            },
            per_page: {
              type: "integer"
            },
            repo: {
              required: true,
              type: "string"
            }
          },
          url: "/repos/:owner/:repo/issues/:issue_number/reactions"
        },
        listForIssueComment: {
          headers: {
            accept: "application/vnd.github.squirrel-girl-preview+json"
          },
          method: "GET",
          params: {
            comment_id: {
              required: true,
              type: "integer"
            },
            content: {
              enum: ["+1", "-1", "laugh", "confused", "heart", "hooray", "rocket", "eyes"],
              type: "string"
            },
            owner: {
              required: true,
              type: "string"
            },
            page: {
              type: "integer"
            },
            per_page: {
              type: "integer"
            },
            repo: {
              required: true,
              type: "string"
            }
          },
          url: "/repos/:owner/:repo/issues/comments/:comment_id/reactions"
        },
        listForPullRequestReviewComment: {
          headers: {
            accept: "application/vnd.github.squirrel-girl-preview+json"
          },
          method: "GET",
          params: {
            comment_id: {
              required: true,
              type: "integer"
            },
            content: {
              enum: ["+1", "-1", "laugh", "confused", "heart", "hooray", "rocket", "eyes"],
              type: "string"
            },
            owner: {
              required: true,
              type: "string"
            },
            page: {
              type: "integer"
            },
            per_page: {
              type: "integer"
            },
            repo: {
              required: true,
              type: "string"
            }
          },
          url: "/repos/:owner/:repo/pulls/comments/:comment_id/reactions"
        },
        listForTeamDiscussion: {
          deprecated: "octokit.reactions.listForTeamDiscussion() has been renamed to octokit.reactions.listForTeamDiscussionLegacy() (2020-01-16)",
          headers: {
            accept: "application/vnd.github.squirrel-girl-preview+json"
          },
          method: "GET",
          params: {
            content: {
              enum: ["+1", "-1", "laugh", "confused", "heart", "hooray", "rocket", "eyes"],
              type: "string"
            },
            discussion_number: {
              required: true,
              type: "integer"
            },
            page: {
              type: "integer"
            },
            per_page: {
              type: "integer"
            },
            team_id: {
              required: true,
              type: "integer"
            }
          },
          url: "/teams/:team_id/discussions/:discussion_number/reactions"
        },
        listForTeamDiscussionComment: {
          deprecated: "octokit.reactions.listForTeamDiscussionComment() has been renamed to octokit.reactions.listForTeamDiscussionCommentLegacy() (2020-01-16)",
          headers: {
            accept: "application/vnd.github.squirrel-girl-preview+json"
          },
          method: "GET",
          params: {
            comment_number: {
              required: true,
              type: "integer"
            },
            content: {
              enum: ["+1", "-1", "laugh", "confused", "heart", "hooray", "rocket", "eyes"],
              type: "string"
            },
            discussion_number: {
              required: true,
              type: "integer"
            },
            page: {
              type: "integer"
            },
            per_page: {
              type: "integer"
            },
            team_id: {
              required: true,
              type: "integer"
            }
          },
          url: "/teams/:team_id/discussions/:discussion_number/comments/:comment_number/reactions"
        },
        listForTeamDiscussionCommentInOrg: {
          headers: {
            accept: "application/vnd.github.squirrel-girl-preview+json"
          },
          method: "GET",
          params: {
            comment_number: {
              required: true,
              type: "integer"
            },
            content: {
              enum: ["+1", "-1", "laugh", "confused", "heart", "hooray", "rocket", "eyes"],
              type: "string"
            },
            discussion_number: {
              required: true,
              type: "integer"
            },
            org: {
              required: true,
              type: "string"
            },
            page: {
              type: "integer"
            },
            per_page: {
              type: "integer"
            },
            team_slug: {
              required: true,
              type: "string"
            }
          },
          url: "/orgs/:org/teams/:team_slug/discussions/:discussion_number/comments/:comment_number/reactions"
        },
        listForTeamDiscussionCommentLegacy: {
          deprecated: "octokit.reactions.listForTeamDiscussionCommentLegacy() is deprecated, see https://developer.github.com/v3/reactions/#list-reactions-for-a-team-discussion-comment-legacy",
          headers: {
            accept: "application/vnd.github.squirrel-girl-preview+json"
          },
          method: "GET",
          params: {
            comment_number: {
              required: true,
              type: "integer"
            },
            content: {
              enum: ["+1", "-1", "laugh", "confused", "heart", "hooray", "rocket", "eyes"],
              type: "string"
            },
            discussion_number: {
              required: true,
              type: "integer"
            },
            page: {
              type: "integer"
            },
            per_page: {
              type: "integer"
            },
            team_id: {
              required: true,
              type: "integer"
            }
          },
          url: "/teams/:team_id/discussions/:discussion_number/comments/:comment_number/reactions"
        },
        listForTeamDiscussionInOrg: {
          headers: {
            accept: "application/vnd.github.squirrel-girl-preview+json"
          },
          method: "GET",
          params: {
            content: {
              enum: ["+1", "-1", "laugh", "confused", "heart", "hooray", "rocket", "eyes"],
              type: "string"
            },
            discussion_number: {
              required: true,
              type: "integer"
            },
            org: {
              required: true,
              type: "string"
            },
            page: {
              type: "integer"
            },
            per_page: {
              type: "integer"
            },
            team_slug: {
              required: true,
              type: "string"
            }
          },
          url: "/orgs/:org/teams/:team_slug/discussions/:discussion_number/reactions"
        },
        listForTeamDiscussionLegacy: {
          deprecated: "octokit.reactions.listForTeamDiscussionLegacy() is deprecated, see https://developer.github.com/v3/reactions/#list-reactions-for-a-team-discussion-legacy",
          headers: {
            accept: "application/vnd.github.squirrel-girl-preview+json"
          },
          method: "GET",
          params: {
            content: {
              enum: ["+1", "-1", "laugh", "confused", "heart", "hooray", "rocket", "eyes"],
              type: "string"
            },
            discussion_number: {
              required: true,
              type: "integer"
            },
            page: {
              type: "integer"
            },
            per_page: {
              type: "integer"
            },
            team_id: {
              required: true,
              type: "integer"
            }
          },
          url: "/teams/:team_id/discussions/:discussion_number/reactions"
        }
      },
      repos: {
        acceptInvitation: {
          method: "PATCH",
          params: {
            invitation_id: {
              required: true,
              type: "integer"
            }
          },
          url: "/user/repository_invitations/:invitation_id"
        },
        addCollaborator: {
          method: "PUT",
          params: {
            owner: {
              required: true,
              type: "string"
            },
            permission: {
              enum: ["pull", "push", "admin"],
              type: "string"
            },
            repo: {
              required: true,
              type: "string"
            },
            username: {
              required: true,
              type: "string"
            }
          },
          url: "/repos/:owner/:repo/collaborators/:username"
        },
        addDeployKey: {
          method: "POST",
          params: {
            key: {
              required: true,
              type: "string"
            },
            owner: {
              required: true,
              type: "string"
            },
            read_only: {
              type: "boolean"
            },
            repo: {
              required: true,
              type: "string"
            },
            title: {
              type: "string"
            }
          },
          url: "/repos/:owner/:repo/keys"
        },
        addProtectedBranchAdminEnforcement: {
          method: "POST",
          params: {
            branch: {
              required: true,
              type: "string"
            },
            owner: {
              required: true,
              type: "string"
            },
            repo: {
              required: true,
              type: "string"
            }
          },
          url: "/repos/:owner/:repo/branches/:branch/protection/enforce_admins"
        },
        addProtectedBranchAppRestrictions: {
          method: "POST",
          params: {
            apps: {
              mapTo: "data",
              required: true,
              type: "string[]"
            },
            branch: {
              required: true,
              type: "string"
            },
            owner: {
              required: true,
              type: "string"
            },
            repo: {
              required: true,
              type: "string"
            }
          },
          url: "/repos/:owner/:repo/branches/:branch/protection/restrictions/apps"
        },
        addProtectedBranchRequiredSignatures: {
          headers: {
            accept: "application/vnd.github.zzzax-preview+json"
          },
          method: "POST",
          params: {
            branch: {
              required: true,
              type: "string"
            },
            owner: {
              required: true,
              type: "string"
            },
            repo: {
              required: true,
              type: "string"
            }
          },
          url: "/repos/:owner/:repo/branches/:branch/protection/required_signatures"
        },
        addProtectedBranchRequiredStatusChecksContexts: {
          method: "POST",
          params: {
            branch: {
              required: true,
              type: "string"
            },
            contexts: {
              mapTo: "data",
              required: true,
              type: "string[]"
            },
            owner: {
              required: true,
              type: "string"
            },
            repo: {
              required: true,
              type: "string"
            }
          },
          url: "/repos/:owner/:repo/branches/:branch/protection/required_status_checks/contexts"
        },
        addProtectedBranchTeamRestrictions: {
          method: "POST",
          params: {
            branch: {
              required: true,
              type: "string"
            },
            owner: {
              required: true,
              type: "string"
            },
            repo: {
              required: true,
              type: "string"
            },
            teams: {
              mapTo: "data",
              required: true,
              type: "string[]"
            }
          },
          url: "/repos/:owner/:repo/branches/:branch/protection/restrictions/teams"
        },
        addProtectedBranchUserRestrictions: {
          method: "POST",
          params: {
            branch: {
              required: true,
              type: "string"
            },
            owner: {
              required: true,
              type: "string"
            },
            repo: {
              required: true,
              type: "string"
            },
            users: {
              mapTo: "data",
              required: true,
              type: "string[]"
            }
          },
          url: "/repos/:owner/:repo/branches/:branch/protection/restrictions/users"
        },
        checkCollaborator: {
          method: "GET",
          params: {
            owner: {
              required: true,
              type: "string"
            },
            repo: {
              required: true,
              type: "string"
            },
            username: {
              required: true,
              type: "string"
            }
          },
          url: "/repos/:owner/:repo/collaborators/:username"
        },
        checkVulnerabilityAlerts: {
          headers: {
            accept: "application/vnd.github.dorian-preview+json"
          },
          method: "GET",
          params: {
            owner: {
              required: true,
              type: "string"
            },
            repo: {
              required: true,
              type: "string"
            }
          },
          url: "/repos/:owner/:repo/vulnerability-alerts"
        },
        compareCommits: {
          method: "GET",
          params: {
            base: {
              required: true,
              type: "string"
            },
            head: {
              required: true,
              type: "string"
            },
            owner: {
              required: true,
              type: "string"
            },
            repo: {
              required: true,
              type: "string"
            }
          },
          url: "/repos/:owner/:repo/compare/:base...:head"
        },
        createCommitComment: {
          method: "POST",
          params: {
            body: {
              required: true,
              type: "string"
            },
            commit_sha: {
              required: true,
              type: "string"
            },
            line: {
              type: "integer"
            },
            owner: {
              required: true,
              type: "string"
            },
            path: {
              type: "string"
            },
            position: {
              type: "integer"
            },
            repo: {
              required: true,
              type: "string"
            },
            sha: {
              alias: "commit_sha",
              deprecated: true,
              type: "string"
            }
          },
          url: "/repos/:owner/:repo/commits/:commit_sha/comments"
        },
        createDeployment: {
          method: "POST",
          params: {
            auto_merge: {
              type: "boolean"
            },
            description: {
              type: "string"
            },
            environment: {
              type: "string"
            },
            owner: {
              required: true,
              type: "string"
            },
            payload: {
              type: "string"
            },
            production_environment: {
              type: "boolean"
            },
            ref: {
              required: true,
              type: "string"
            },
            repo: {
              required: true,
              type: "string"
            },
            required_contexts: {
              type: "string[]"
            },
            task: {
              type: "string"
            },
            transient_environment: {
              type: "boolean"
            }
          },
          url: "/repos/:owner/:repo/deployments"
        },
        createDeploymentStatus: {
          method: "POST",
          params: {
            auto_inactive: {
              type: "boolean"
            },
            deployment_id: {
              required: true,
              type: "integer"
            },
            description: {
              type: "string"
            },
            environment: {
              enum: ["production", "staging", "qa"],
              type: "string"
            },
            environment_url: {
              type: "string"
            },
            log_url: {
              type: "string"
            },
            owner: {
              required: true,
              type: "string"
            },
            repo: {
              required: true,
              type: "string"
            },
            state: {
              enum: ["error", "failure", "inactive", "in_progress", "queued", "pending", "success"],
              required: true,
              type: "string"
            },
            target_url: {
              type: "string"
            }
          },
          url: "/repos/:owner/:repo/deployments/:deployment_id/statuses"
        },
        createDispatchEvent: {
          method: "POST",
          params: {
            client_payload: {
              type: "object"
            },
            event_type: {
              type: "string"
            },
            owner: {
              required: true,
              type: "string"
            },
            repo: {
              required: true,
              type: "string"
            }
          },
          url: "/repos/:owner/:repo/dispatches"
        },
        createFile: {
          deprecated: "octokit.repos.createFile() has been renamed to octokit.repos.createOrUpdateFile() (2019-06-07)",
          method: "PUT",
          params: {
            author: {
              type: "object"
            },
            "author.email": {
              required: true,
              type: "string"
            },
            "author.name": {
              required: true,
              type: "string"
            },
            branch: {
              type: "string"
            },
            committer: {
              type: "object"
            },
            "committer.email": {
              required: true,
              type: "string"
            },
            "committer.name": {
              required: true,
              type: "string"
            },
            content: {
              required: true,
              type: "string"
            },
            message: {
              required: true,
              type: "string"
            },
            owner: {
              required: true,
              type: "string"
            },
            path: {
              required: true,
              type: "string"
            },
            repo: {
              required: true,
              type: "string"
            },
            sha: {
              type: "string"
            }
          },
          url: "/repos/:owner/:repo/contents/:path"
        },
        createForAuthenticatedUser: {
          method: "POST",
          params: {
            allow_merge_commit: {
              type: "boolean"
            },
            allow_rebase_merge: {
              type: "boolean"
            },
            allow_squash_merge: {
              type: "boolean"
            },
            auto_init: {
              type: "boolean"
            },
            delete_branch_on_merge: {
              type: "boolean"
            },
            description: {
              type: "string"
            },
            gitignore_template: {
              type: "string"
            },
            has_issues: {
              type: "boolean"
            },
            has_projects: {
              type: "boolean"
            },
            has_wiki: {
              type: "boolean"
            },
            homepage: {
              type: "string"
            },
            is_template: {
              type: "boolean"
            },
            license_template: {
              type: "string"
            },
            name: {
              required: true,
              type: "string"
            },
            private: {
              type: "boolean"
            },
            team_id: {
              type: "integer"
            },
            visibility: {
              enum: ["public", "private", "visibility", "internal"],
              type: "string"
            }
          },
          url: "/user/repos"
        },
        createFork: {
          method: "POST",
          params: {
            organization: {
              type: "string"
            },
            owner: {
              required: true,
              type: "string"
            },
            repo: {
              required: true,
              type: "string"
            }
          },
          url: "/repos/:owner/:repo/forks"
        },
        createHook: {
          method: "POST",
          params: {
            active: {
              type: "boolean"
            },
            config: {
              required: true,
              type: "object"
            },
            "config.content_type": {
              type: "string"
            },
            "config.insecure_ssl": {
              type: "string"
            },
            "config.secret": {
              type: "string"
            },
            "config.url": {
              required: true,
              type: "string"
            },
            events: {
              type: "string[]"
            },
            name: {
              type: "string"
            },
            owner: {
              required: true,
              type: "string"
            },
            repo: {
              required: true,
              type: "string"
            }
          },
          url: "/repos/:owner/:repo/hooks"
        },
        createInOrg: {
          method: "POST",
          params: {
            allow_merge_commit: {
              type: "boolean"
            },
            allow_rebase_merge: {
              type: "boolean"
            },
            allow_squash_merge: {
              type: "boolean"
            },
            auto_init: {
              type: "boolean"
            },
            delete_branch_on_merge: {
              type: "boolean"
            },
            description: {
              type: "string"
            },
            gitignore_template: {
              type: "string"
            },
            has_issues: {
              type: "boolean"
            },
            has_projects: {
              type: "boolean"
            },
            has_wiki: {
              type: "boolean"
            },
            homepage: {
              type: "string"
            },
            is_template: {
              type: "boolean"
            },
            license_template: {
              type: "string"
            },
            name: {
              required: true,
              type: "string"
            },
            org: {
              required: true,
              type: "string"
            },
            private: {
              type: "boolean"
            },
            team_id: {
              type: "integer"
            },
            visibility: {
              enum: ["public", "private", "visibility", "internal"],
              type: "string"
            }
          },
          url: "/orgs/:org/repos"
        },
        createOrUpdateFile: {
          method: "PUT",
          params: {
            author: {
              type: "object"
            },
            "author.email": {
              required: true,
              type: "string"
            },
            "author.name": {
              required: true,
              type: "string"
            },
            branch: {
              type: "string"
            },
            committer: {
              type: "object"
            },
            "committer.email": {
              required: true,
              type: "string"
            },
            "committer.name": {
              required: true,
              type: "string"
            },
            content: {
              required: true,
              type: "string"
            },
            message: {
              required: true,
              type: "string"
            },
            owner: {
              required: true,
              type: "string"
            },
            path: {
              required: true,
              type: "string"
            },
            repo: {
              required: true,
              type: "string"
            },
            sha: {
              type: "string"
            }
          },
          url: "/repos/:owner/:repo/contents/:path"
        },
        createRelease: {
          method: "POST",
          params: {
            body: {
              type: "string"
            },
            draft: {
              type: "boolean"
            },
            name: {
              type: "string"
            },
            owner: {
              required: true,
              type: "string"
            },
            prerelease: {
              type: "boolean"
            },
            repo: {
              required: true,
              type: "string"
            },
            tag_name: {
              required: true,
              type: "string"
            },
            target_commitish: {
              type: "string"
            }
          },
          url: "/repos/:owner/:repo/releases"
        },
        createStatus: {
          method: "POST",
          params: {
            context: {
              type: "string"
            },
            description: {
              type: "string"
            },
            owner: {
              required: true,
              type: "string"
            },
            repo: {
              required: true,
              type: "string"
            },
            sha: {
              required: true,
              type: "string"
            },
            state: {
              enum: ["error", "failure", "pending", "success"],
              required: true,
              type: "string"
            },
            target_url: {
              type: "string"
            }
          },
          url: "/repos/:owner/:repo/statuses/:sha"
        },
        createUsingTemplate: {
          headers: {
            accept: "application/vnd.github.baptiste-preview+json"
          },
          method: "POST",
          params: {
            description: {
              type: "string"
            },
            name: {
              required: true,
              type: "string"
            },
            owner: {
              type: "string"
            },
            private: {
              type: "boolean"
            },
            template_owner: {
              required: true,
              type: "string"
            },
            template_repo: {
              required: true,
              type: "string"
            }
          },
          url: "/repos/:template_owner/:template_repo/generate"
        },
        declineInvitation: {
          method: "DELETE",
          params: {
            invitation_id: {
              required: true,
              type: "integer"
            }
          },
          url: "/user/repository_invitations/:invitation_id"
        },
        delete: {
          method: "DELETE",
          params: {
            owner: {
              required: true,
              type: "string"
            },
            repo: {
              required: true,
              type: "string"
            }
          },
          url: "/repos/:owner/:repo"
        },
        deleteCommitComment: {
          method: "DELETE",
          params: {
            comment_id: {
              required: true,
              type: "integer"
            },
            owner: {
              required: true,
              type: "string"
            },
            repo: {
              required: true,
              type: "string"
            }
          },
          url: "/repos/:owner/:repo/comments/:comment_id"
        },
        deleteDownload: {
          method: "DELETE",
          params: {
            download_id: {
              required: true,
              type: "integer"
            },
            owner: {
              required: true,
              type: "string"
            },
            repo: {
              required: true,
              type: "string"
            }
          },
          url: "/repos/:owner/:repo/downloads/:download_id"
        },
        deleteFile: {
          method: "DELETE",
          params: {
            author: {
              type: "object"
            },
            "author.email": {
              type: "string"
            },
            "author.name": {
              type: "string"
            },
            branch: {
              type: "string"
            },
            committer: {
              type: "object"
            },
            "committer.email": {
              type: "string"
            },
            "committer.name": {
              type: "string"
            },
            message: {
              required: true,
              type: "string"
            },
            owner: {
              required: true,
              type: "string"
            },
            path: {
              required: true,
              type: "string"
            },
            repo: {
              required: true,
              type: "string"
            },
            sha: {
              required: true,
              type: "string"
            }
          },
          url: "/repos/:owner/:repo/contents/:path"
        },
        deleteHook: {
          method: "DELETE",
          params: {
            hook_id: {
              required: true,
              type: "integer"
            },
            owner: {
              required: true,
              type: "string"
            },
            repo: {
              required: true,
              type: "string"
            }
          },
          url: "/repos/:owner/:repo/hooks/:hook_id"
        },
        deleteInvitation: {
          method: "DELETE",
          params: {
            invitation_id: {
              required: true,
              type: "integer"
            },
            owner: {
              required: true,
              type: "string"
            },
            repo: {
              required: true,
              type: "string"
            }
          },
          url: "/repos/:owner/:repo/invitations/:invitation_id"
        },
        deleteRelease: {
          method: "DELETE",
          params: {
            owner: {
              required: true,
              type: "string"
            },
            release_id: {
              required: true,
              type: "integer"
            },
            repo: {
              required: true,
              type: "string"
            }
          },
          url: "/repos/:owner/:repo/releases/:release_id"
        },
        deleteReleaseAsset: {
          method: "DELETE",
          params: {
            asset_id: {
              required: true,
              type: "integer"
            },
            owner: {
              required: true,
              type: "string"
            },
            repo: {
              required: true,
              type: "string"
            }
          },
          url: "/repos/:owner/:repo/releases/assets/:asset_id"
        },
        disableAutomatedSecurityFixes: {
          headers: {
            accept: "application/vnd.github.london-preview+json"
          },
          method: "DELETE",
          params: {
            owner: {
              required: true,
              type: "string"
            },
            repo: {
              required: true,
              type: "string"
            }
          },
          url: "/repos/:owner/:repo/automated-security-fixes"
        },
        disablePagesSite: {
          headers: {
            accept: "application/vnd.github.switcheroo-preview+json"
          },
          method: "DELETE",
          params: {
            owner: {
              required: true,
              type: "string"
            },
            repo: {
              required: true,
              type: "string"
            }
          },
          url: "/repos/:owner/:repo/pages"
        },
        disableVulnerabilityAlerts: {
          headers: {
            accept: "application/vnd.github.dorian-preview+json"
          },
          method: "DELETE",
          params: {
            owner: {
              required: true,
              type: "string"
            },
            repo: {
              required: true,
              type: "string"
            }
          },
          url: "/repos/:owner/:repo/vulnerability-alerts"
        },
        enableAutomatedSecurityFixes: {
          headers: {
            accept: "application/vnd.github.london-preview+json"
          },
          method: "PUT",
          params: {
            owner: {
              required: true,
              type: "string"
            },
            repo: {
              required: true,
              type: "string"
            }
          },
          url: "/repos/:owner/:repo/automated-security-fixes"
        },
        enablePagesSite: {
          headers: {
            accept: "application/vnd.github.switcheroo-preview+json"
          },
          method: "POST",
          params: {
            owner: {
              required: true,
              type: "string"
            },
            repo: {
              required: true,
              type: "string"
            },
            source: {
              type: "object"
            },
            "source.branch": {
              enum: ["master", "gh-pages"],
              type: "string"
            },
            "source.path": {
              type: "string"
            }
          },
          url: "/repos/:owner/:repo/pages"
        },
        enableVulnerabilityAlerts: {
          headers: {
            accept: "application/vnd.github.dorian-preview+json"
          },
          method: "PUT",
          params: {
            owner: {
              required: true,
              type: "string"
            },
            repo: {
              required: true,
              type: "string"
            }
          },
          url: "/repos/:owner/:repo/vulnerability-alerts"
        },
        get: {
          method: "GET",
          params: {
            owner: {
              required: true,
              type: "string"
            },
            repo: {
              required: true,
              type: "string"
            }
          },
          url: "/repos/:owner/:repo"
        },
        getAppsWithAccessToProtectedBranch: {
          method: "GET",
          params: {
            branch: {
              required: true,
              type: "string"
            },
            owner: {
              required: true,
              type: "string"
            },
            repo: {
              required: true,
              type: "string"
            }
          },
          url: "/repos/:owner/:repo/branches/:branch/protection/restrictions/apps"
        },
        getArchiveLink: {
          method: "GET",
          params: {
            archive_format: {
              required: true,
              type: "string"
            },
            owner: {
              required: true,
              type: "string"
            },
            ref: {
              required: true,
              type: "string"
            },
            repo: {
              required: true,
              type: "string"
            }
          },
          url: "/repos/:owner/:repo/:archive_format/:ref"
        },
        getBranch: {
          method: "GET",
          params: {
            branch: {
              required: true,
              type: "string"
            },
            owner: {
              required: true,
              type: "string"
            },
            repo: {
              required: true,
              type: "string"
            }
          },
          url: "/repos/:owner/:repo/branches/:branch"
        },
        getBranchProtection: {
          method: "GET",
          params: {
            branch: {
              required: true,
              type: "string"
            },
            owner: {
              required: true,
              type: "string"
            },
            repo: {
              required: true,
              type: "string"
            }
          },
          url: "/repos/:owner/:repo/branches/:branch/protection"
        },
        getClones: {
          method: "GET",
          params: {
            owner: {
              required: true,
              type: "string"
            },
            per: {
              enum: ["day", "week"],
              type: "string"
            },
            repo: {
              required: true,
              type: "string"
            }
          },
          url: "/repos/:owner/:repo/traffic/clones"
        },
        getCodeFrequencyStats: {
          method: "GET",
          params: {
            owner: {
              required: true,
              type: "string"
            },
            repo: {
              required: true,
              type: "string"
            }
          },
          url: "/repos/:owner/:repo/stats/code_frequency"
        },
        getCollaboratorPermissionLevel: {
          method: "GET",
          params: {
            owner: {
              required: true,
              type: "string"
            },
            repo: {
              required: true,
              type: "string"
            },
            username: {
              required: true,
              type: "string"
            }
          },
          url: "/repos/:owner/:repo/collaborators/:username/permission"
        },
        getCombinedStatusForRef: {
          method: "GET",
          params: {
            owner: {
              required: true,
              type: "string"
            },
            ref: {
              required: true,
              type: "string"
            },
            repo: {
              required: true,
              type: "string"
            }
          },
          url: "/repos/:owner/:repo/commits/:ref/status"
        },
        getCommit: {
          method: "GET",
          params: {
            commit_sha: {
              alias: "ref",
              deprecated: true,
              type: "string"
            },
            owner: {
              required: true,
              type: "string"
            },
            ref: {
              required: true,
              type: "string"
            },
            repo: {
              required: true,
              type: "string"
            },
            sha: {
              alias: "ref",
              deprecated: true,
              type: "string"
            }
          },
          url: "/repos/:owner/:repo/commits/:ref"
        },
        getCommitActivityStats: {
          method: "GET",
          params: {
            owner: {
              required: true,
              type: "string"
            },
            repo: {
              required: true,
              type: "string"
            }
          },
          url: "/repos/:owner/:repo/stats/commit_activity"
        },
        getCommitComment: {
          method: "GET",
          params: {
            comment_id: {
              required: true,
              type: "integer"
            },
            owner: {
              required: true,
              type: "string"
            },
            repo: {
              required: true,
              type: "string"
            }
          },
          url: "/repos/:owner/:repo/comments/:comment_id"
        },
        getCommitRefSha: {
          deprecated: "octokit.repos.getCommitRefSha() is deprecated, see https://developer.github.com/v3/repos/commits/#get-a-single-commit",
          headers: {
            accept: "application/vnd.github.v3.sha"
          },
          method: "GET",
          params: {
            owner: {
              required: true,
              type: "string"
            },
            ref: {
              required: true,
              type: "string"
            },
            repo: {
              required: true,
              type: "string"
            }
          },
          url: "/repos/:owner/:repo/commits/:ref"
        },
        getContents: {
          method: "GET",
          params: {
            owner: {
              required: true,
              type: "string"
            },
            path: {
              required: true,
              type: "string"
            },
            ref: {
              type: "string"
            },
            repo: {
              required: true,
              type: "string"
            }
          },
          url: "/repos/:owner/:repo/contents/:path"
        },
        getContributorsStats: {
          method: "GET",
          params: {
            owner: {
              required: true,
              type: "string"
            },
            repo: {
              required: true,
              type: "string"
            }
          },
          url: "/repos/:owner/:repo/stats/contributors"
        },
        getDeployKey: {
          method: "GET",
          params: {
            key_id: {
              required: true,
              type: "integer"
            },
            owner: {
              required: true,
              type: "string"
            },
            repo: {
              required: true,
              type: "string"
            }
          },
          url: "/repos/:owner/:repo/keys/:key_id"
        },
        getDeployment: {
          method: "GET",
          params: {
            deployment_id: {
              required: true,
              type: "integer"
            },
            owner: {
              required: true,
              type: "string"
            },
            repo: {
              required: true,
              type: "string"
            }
          },
          url: "/repos/:owner/:repo/deployments/:deployment_id"
        },
        getDeploymentStatus: {
          method: "GET",
          params: {
            deployment_id: {
              required: true,
              type: "integer"
            },
            owner: {
              required: true,
              type: "string"
            },
            repo: {
              required: true,
              type: "string"
            },
            status_id: {
              required: true,
              type: "integer"
            }
          },
          url: "/repos/:owner/:repo/deployments/:deployment_id/statuses/:status_id"
        },
        getDownload: {
          method: "GET",
          params: {
            download_id: {
              required: true,
              type: "integer"
            },
            owner: {
              required: true,
              type: "string"
            },
            repo: {
              required: true,
              type: "string"
            }
          },
          url: "/repos/:owner/:repo/downloads/:download_id"
        },
        getHook: {
          method: "GET",
          params: {
            hook_id: {
              required: true,
              type: "integer"
            },
            owner: {
              required: true,
              type: "string"
            },
            repo: {
              required: true,
              type: "string"
            }
          },
          url: "/repos/:owner/:repo/hooks/:hook_id"
        },
        getLatestPagesBuild: {
          method: "GET",
          params: {
            owner: {
              required: true,
              type: "string"
            },
            repo: {
              required: true,
              type: "string"
            }
          },
          url: "/repos/:owner/:repo/pages/builds/latest"
        },
        getLatestRelease: {
          method: "GET",
          params: {
            owner: {
              required: true,
              type: "string"
            },
            repo: {
              required: true,
              type: "string"
            }
          },
          url: "/repos/:owner/:repo/releases/latest"
        },
        getPages: {
          method: "GET",
          params: {
            owner: {
              required: true,
              type: "string"
            },
            repo: {
              required: true,
              type: "string"
            }
          },
          url: "/repos/:owner/:repo/pages"
        },
        getPagesBuild: {
          method: "GET",
          params: {
            build_id: {
              required: true,
              type: "integer"
            },
            owner: {
              required: true,
              type: "string"
            },
            repo: {
              required: true,
              type: "string"
            }
          },
          url: "/repos/:owner/:repo/pages/builds/:build_id"
        },
        getParticipationStats: {
          method: "GET",
          params: {
            owner: {
              required: true,
              type: "string"
            },
            repo: {
              required: true,
              type: "string"
            }
          },
          url: "/repos/:owner/:repo/stats/participation"
        },
        getProtectedBranchAdminEnforcement: {
          method: "GET",
          params: {
            branch: {
              required: true,
              type: "string"
            },
            owner: {
              required: true,
              type: "string"
            },
            repo: {
              required: true,
              type: "string"
            }
          },
          url: "/repos/:owner/:repo/branches/:branch/protection/enforce_admins"
        },
        getProtectedBranchPullRequestReviewEnforcement: {
          method: "GET",
          params: {
            branch: {
              required: true,
              type: "string"
            },
            owner: {
              required: true,
              type: "string"
            },
            repo: {
              required: true,
              type: "string"
            }
          },
          url: "/repos/:owner/:repo/branches/:branch/protection/required_pull_request_reviews"
        },
        getProtectedBranchRequiredSignatures: {
          headers: {
            accept: "application/vnd.github.zzzax-preview+json"
          },
          method: "GET",
          params: {
            branch: {
              required: true,
              type: "string"
            },
            owner: {
              required: true,
              type: "string"
            },
            repo: {
              required: true,
              type: "string"
            }
          },
          url: "/repos/:owner/:repo/branches/:branch/protection/required_signatures"
        },
        getProtectedBranchRequiredStatusChecks: {
          method: "GET",
          params: {
            branch: {
              required: true,
              type: "string"
            },
            owner: {
              required: true,
              type: "string"
            },
            repo: {
              required: true,
              type: "string"
            }
          },
          url: "/repos/:owner/:repo/branches/:branch/protection/required_status_checks"
        },
        getProtectedBranchRestrictions: {
          method: "GET",
          params: {
            branch: {
              required: true,
              type: "string"
            },
            owner: {
              required: true,
              type: "string"
            },
            repo: {
              required: true,
              type: "string"
            }
          },
          url: "/repos/:owner/:repo/branches/:branch/protection/restrictions"
        },
        getPunchCardStats: {
          method: "GET",
          params: {
            owner: {
              required: true,
              type: "string"
            },
            repo: {
              required: true,
              type: "string"
            }
          },
          url: "/repos/:owner/:repo/stats/punch_card"
        },
        getReadme: {
          method: "GET",
          params: {
            owner: {
              required: true,
              type: "string"
            },
            ref: {
              type: "string"
            },
            repo: {
              required: true,
              type: "string"
            }
          },
          url: "/repos/:owner/:repo/readme"
        },
        getRelease: {
          method: "GET",
          params: {
            owner: {
              required: true,
              type: "string"
            },
            release_id: {
              required: true,
              type: "integer"
            },
            repo: {
              required: true,
              type: "string"
            }
          },
          url: "/repos/:owner/:repo/releases/:release_id"
        },
        getReleaseAsset: {
          method: "GET",
          params: {
            asset_id: {
              required: true,
              type: "integer"
            },
            owner: {
              required: true,
              type: "string"
            },
            repo: {
              required: true,
              type: "string"
            }
          },
          url: "/repos/:owner/:repo/releases/assets/:asset_id"
        },
        getReleaseByTag: {
          method: "GET",
          params: {
            owner: {
              required: true,
              type: "string"
            },
            repo: {
              required: true,
              type: "string"
            },
            tag: {
              required: true,
              type: "string"
            }
          },
          url: "/repos/:owner/:repo/releases/tags/:tag"
        },
        getTeamsWithAccessToProtectedBranch: {
          method: "GET",
          params: {
            branch: {
              required: true,
              type: "string"
            },
            owner: {
              required: true,
              type: "string"
            },
            repo: {
              required: true,
              type: "string"
            }
          },
          url: "/repos/:owner/:repo/branches/:branch/protection/restrictions/teams"
        },
        getTopPaths: {
          method: "GET",
          params: {
            owner: {
              required: true,
              type: "string"
            },
            repo: {
              required: true,
              type: "string"
            }
          },
          url: "/repos/:owner/:repo/traffic/popular/paths"
        },
        getTopReferrers: {
          method: "GET",
          params: {
            owner: {
              required: true,
              type: "string"
            },
            repo: {
              required: true,
              type: "string"
            }
          },
          url: "/repos/:owner/:repo/traffic/popular/referrers"
        },
        getUsersWithAccessToProtectedBranch: {
          method: "GET",
          params: {
            branch: {
              required: true,
              type: "string"
            },
            owner: {
              required: true,
              type: "string"
            },
            repo: {
              required: true,
              type: "string"
            }
          },
          url: "/repos/:owner/:repo/branches/:branch/protection/restrictions/users"
        },
        getViews: {
          method: "GET",
          params: {
            owner: {
              required: true,
              type: "string"
            },
            per: {
              enum: ["day", "week"],
              type: "string"
            },
            repo: {
              required: true,
              type: "string"
            }
          },
          url: "/repos/:owner/:repo/traffic/views"
        },
        list: {
          method: "GET",
          params: {
            affiliation: {
              type: "string"
            },
            direction: {
              enum: ["asc", "desc"],
              type: "string"
            },
            page: {
              type: "integer"
            },
            per_page: {
              type: "integer"
            },
            sort: {
              enum: ["created", "updated", "pushed", "full_name"],
              type: "string"
            },
            type: {
              enum: ["all", "owner", "public", "private", "member"],
              type: "string"
            },
            visibility: {
              enum: ["all", "public", "private"],
              type: "string"
            }
          },
          url: "/user/repos"
        },
        listAppsWithAccessToProtectedBranch: {
          deprecated: "octokit.repos.listAppsWithAccessToProtectedBranch() has been renamed to octokit.repos.getAppsWithAccessToProtectedBranch() (2019-09-13)",
          method: "GET",
          params: {
            branch: {
              required: true,
              type: "string"
            },
            owner: {
              required: true,
              type: "string"
            },
            repo: {
              required: true,
              type: "string"
            }
          },
          url: "/repos/:owner/:repo/branches/:branch/protection/restrictions/apps"
        },
        listAssetsForRelease: {
          method: "GET",
          params: {
            owner: {
              required: true,
              type: "string"
            },
            page: {
              type: "integer"
            },
            per_page: {
              type: "integer"
            },
            release_id: {
              required: true,
              type: "integer"
            },
            repo: {
              required: true,
              type: "string"
            }
          },
          url: "/repos/:owner/:repo/releases/:release_id/assets"
        },
        listBranches: {
          method: "GET",
          params: {
            owner: {
              required: true,
              type: "string"
            },
            page: {
              type: "integer"
            },
            per_page: {
              type: "integer"
            },
            protected: {
              type: "boolean"
            },
            repo: {
              required: true,
              type: "string"
            }
          },
          url: "/repos/:owner/:repo/branches"
        },
        listBranchesForHeadCommit: {
          headers: {
            accept: "application/vnd.github.groot-preview+json"
          },
          method: "GET",
          params: {
            commit_sha: {
              required: true,
              type: "string"
            },
            owner: {
              required: true,
              type: "string"
            },
            repo: {
              required: true,
              type: "string"
            }
          },
          url: "/repos/:owner/:repo/commits/:commit_sha/branches-where-head"
        },
        listCollaborators: {
          method: "GET",
          params: {
            affiliation: {
              enum: ["outside", "direct", "all"],
              type: "string"
            },
            owner: {
              required: true,
              type: "string"
            },
            page: {
              type: "integer"
            },
            per_page: {
              type: "integer"
            },
            repo: {
              required: true,
              type: "string"
            }
          },
          url: "/repos/:owner/:repo/collaborators"
        },
        listCommentsForCommit: {
          method: "GET",
          params: {
            commit_sha: {
              required: true,
              type: "string"
            },
            owner: {
              required: true,
              type: "string"
            },
            page: {
              type: "integer"
            },
            per_page: {
              type: "integer"
            },
            ref: {
              alias: "commit_sha",
              deprecated: true,
              type: "string"
            },
            repo: {
              required: true,
              type: "string"
            }
          },
          url: "/repos/:owner/:repo/commits/:commit_sha/comments"
        },
        listCommitComments: {
          method: "GET",
          params: {
            owner: {
              required: true,
              type: "string"
            },
            page: {
              type: "integer"
            },
            per_page: {
              type: "integer"
            },
            repo: {
              required: true,
              type: "string"
            }
          },
          url: "/repos/:owner/:repo/comments"
        },
        listCommits: {
          method: "GET",
          params: {
            author: {
              type: "string"
            },
            owner: {
              required: true,
              type: "string"
            },
            page: {
              type: "integer"
            },
            path: {
              type: "string"
            },
            per_page: {
              type: "integer"
            },
            repo: {
              required: true,
              type: "string"
            },
            sha: {
              type: "string"
            },
            since: {
              type: "string"
            },
            until: {
              type: "string"
            }
          },
          url: "/repos/:owner/:repo/commits"
        },
        listContributors: {
          method: "GET",
          params: {
            anon: {
              type: "string"
            },
            owner: {
              required: true,
              type: "string"
            },
            page: {
              type: "integer"
            },
            per_page: {
              type: "integer"
            },
            repo: {
              required: true,
              type: "string"
            }
          },
          url: "/repos/:owner/:repo/contributors"
        },
        listDeployKeys: {
          method: "GET",
          params: {
            owner: {
              required: true,
              type: "string"
            },
            page: {
              type: "integer"
            },
            per_page: {
              type: "integer"
            },
            repo: {
              required: true,
              type: "string"
            }
          },
          url: "/repos/:owner/:repo/keys"
        },
        listDeploymentStatuses: {
          method: "GET",
          params: {
            deployment_id: {
              required: true,
              type: "integer"
            },
            owner: {
              required: true,
              type: "string"
            },
            page: {
              type: "integer"
            },
            per_page: {
              type: "integer"
            },
            repo: {
              required: true,
              type: "string"
            }
          },
          url: "/repos/:owner/:repo/deployments/:deployment_id/statuses"
        },
        listDeployments: {
          method: "GET",
          params: {
            environment: {
              type: "string"
            },
            owner: {
              required: true,
              type: "string"
            },
            page: {
              type: "integer"
            },
            per_page: {
              type: "integer"
            },
            ref: {
              type: "string"
            },
            repo: {
              required: true,
              type: "string"
            },
            sha: {
              type: "string"
            },
            task: {
              type: "string"
            }
          },
          url: "/repos/:owner/:repo/deployments"
        },
        listDownloads: {
          method: "GET",
          params: {
            owner: {
              required: true,
              type: "string"
            },
            page: {
              type: "integer"
            },
            per_page: {
              type: "integer"
            },
            repo: {
              required: true,
              type: "string"
            }
          },
          url: "/repos/:owner/:repo/downloads"
        },
        listForOrg: {
          method: "GET",
          params: {
            direction: {
              enum: ["asc", "desc"],
              type: "string"
            },
            org: {
              required: true,
              type: "string"
            },
            page: {
              type: "integer"
            },
            per_page: {
              type: "integer"
            },
            sort: {
              enum: ["created", "updated", "pushed", "full_name"],
              type: "string"
            },
            type: {
              enum: ["all", "public", "private", "forks", "sources", "member", "internal"],
              type: "string"
            }
          },
          url: "/orgs/:org/repos"
        },
        listForUser: {
          method: "GET",
          params: {
            direction: {
              enum: ["asc", "desc"],
              type: "string"
            },
            page: {
              type: "integer"
            },
            per_page: {
              type: "integer"
            },
            sort: {
              enum: ["created", "updated", "pushed", "full_name"],
              type: "string"
            },
            type: {
              enum: ["all", "owner", "member"],
              type: "string"
            },
            username: {
              required: true,
              type: "string"
            }
          },
          url: "/users/:username/repos"
        },
        listForks: {
          method: "GET",
          params: {
            owner: {
              required: true,
              type: "string"
            },
            page: {
              type: "integer"
            },
            per_page: {
              type: "integer"
            },
            repo: {
              required: true,
              type: "string"
            },
            sort: {
              enum: ["newest", "oldest", "stargazers"],
              type: "string"
            }
          },
          url: "/repos/:owner/:repo/forks"
        },
        listHooks: {
          method: "GET",
          params: {
            owner: {
              required: true,
              type: "string"
            },
            page: {
              type: "integer"
            },
            per_page: {
              type: "integer"
            },
            repo: {
              required: true,
              type: "string"
            }
          },
          url: "/repos/:owner/:repo/hooks"
        },
        listInvitations: {
          method: "GET",
          params: {
            owner: {
              required: true,
              type: "string"
            },
            page: {
              type: "integer"
            },
            per_page: {
              type: "integer"
            },
            repo: {
              required: true,
              type: "string"
            }
          },
          url: "/repos/:owner/:repo/invitations"
        },
        listInvitationsForAuthenticatedUser: {
          method: "GET",
          params: {
            page: {
              type: "integer"
            },
            per_page: {
              type: "integer"
            }
          },
          url: "/user/repository_invitations"
        },
        listLanguages: {
          method: "GET",
          params: {
            owner: {
              required: true,
              type: "string"
            },
            repo: {
              required: true,
              type: "string"
            }
          },
          url: "/repos/:owner/:repo/languages"
        },
        listPagesBuilds: {
          method: "GET",
          params: {
            owner: {
              required: true,
              type: "string"
            },
            page: {
              type: "integer"
            },
            per_page: {
              type: "integer"
            },
            repo: {
              required: true,
              type: "string"
            }
          },
          url: "/repos/:owner/:repo/pages/builds"
        },
        listProtectedBranchRequiredStatusChecksContexts: {
          method: "GET",
          params: {
            branch: {
              required: true,
              type: "string"
            },
            owner: {
              required: true,
              type: "string"
            },
            repo: {
              required: true,
              type: "string"
            }
          },
          url: "/repos/:owner/:repo/branches/:branch/protection/required_status_checks/contexts"
        },
        listProtectedBranchTeamRestrictions: {
          deprecated: "octokit.repos.listProtectedBranchTeamRestrictions() has been renamed to octokit.repos.getTeamsWithAccessToProtectedBranch() (2019-09-09)",
          method: "GET",
          params: {
            branch: {
              required: true,
              type: "string"
            },
            owner: {
              required: true,
              type: "string"
            },
            repo: {
              required: true,
              type: "string"
            }
          },
          url: "/repos/:owner/:repo/branches/:branch/protection/restrictions/teams"
        },
        listProtectedBranchUserRestrictions: {
          deprecated: "octokit.repos.listProtectedBranchUserRestrictions() has been renamed to octokit.repos.getUsersWithAccessToProtectedBranch() (2019-09-09)",
          method: "GET",
          params: {
            branch: {
              required: true,
              type: "string"
            },
            owner: {
              required: true,
              type: "string"
            },
            repo: {
              required: true,
              type: "string"
            }
          },
          url: "/repos/:owner/:repo/branches/:branch/protection/restrictions/users"
        },
        listPublic: {
          method: "GET",
          params: {
            page: {
              type: "integer"
            },
            per_page: {
              type: "integer"
            },
            since: {
              type: "integer"
            }
          },
          url: "/repositories"
        },
        listPullRequestsAssociatedWithCommit: {
          headers: {
            accept: "application/vnd.github.groot-preview+json"
          },
          method: "GET",
          params: {
            commit_sha: {
              required: true,
              type: "string"
            },
            owner: {
              required: true,
              type: "string"
            },
            page: {
              type: "integer"
            },
            per_page: {
              type: "integer"
            },
            repo: {
              required: true,
              type: "string"
            }
          },
          url: "/repos/:owner/:repo/commits/:commit_sha/pulls"
        },
        listReleases: {
          method: "GET",
          params: {
            owner: {
              required: true,
              type: "string"
            },
            page: {
              type: "integer"
            },
            per_page: {
              type: "integer"
            },
            repo: {
              required: true,
              type: "string"
            }
          },
          url: "/repos/:owner/:repo/releases"
        },
        listStatusesForRef: {
          method: "GET",
          params: {
            owner: {
              required: true,
              type: "string"
            },
            page: {
              type: "integer"
            },
            per_page: {
              type: "integer"
            },
            ref: {
              required: true,
              type: "string"
            },
            repo: {
              required: true,
              type: "string"
            }
          },
          url: "/repos/:owner/:repo/commits/:ref/statuses"
        },
        listTags: {
          method: "GET",
          params: {
            owner: {
              required: true,
              type: "string"
            },
            page: {
              type: "integer"
            },
            per_page: {
              type: "integer"
            },
            repo: {
              required: true,
              type: "string"
            }
          },
          url: "/repos/:owner/:repo/tags"
        },
        listTeams: {
          method: "GET",
          params: {
            owner: {
              required: true,
              type: "string"
            },
            page: {
              type: "integer"
            },
            per_page: {
              type: "integer"
            },
            repo: {
              required: true,
              type: "string"
            }
          },
          url: "/repos/:owner/:repo/teams"
        },
        listTeamsWithAccessToProtectedBranch: {
          deprecated: "octokit.repos.listTeamsWithAccessToProtectedBranch() has been renamed to octokit.repos.getTeamsWithAccessToProtectedBranch() (2019-09-13)",
          method: "GET",
          params: {
            branch: {
              required: true,
              type: "string"
            },
            owner: {
              required: true,
              type: "string"
            },
            repo: {
              required: true,
              type: "string"
            }
          },
          url: "/repos/:owner/:repo/branches/:branch/protection/restrictions/teams"
        },
        listTopics: {
          headers: {
            accept: "application/vnd.github.mercy-preview+json"
          },
          method: "GET",
          params: {
            owner: {
              required: true,
              type: "string"
            },
            repo: {
              required: true,
              type: "string"
            }
          },
          url: "/repos/:owner/:repo/topics"
        },
        listUsersWithAccessToProtectedBranch: {
          deprecated: "octokit.repos.listUsersWithAccessToProtectedBranch() has been renamed to octokit.repos.getUsersWithAccessToProtectedBranch() (2019-09-13)",
          method: "GET",
          params: {
            branch: {
              required: true,
              type: "string"
            },
            owner: {
              required: true,
              type: "string"
            },
            repo: {
              required: true,
              type: "string"
            }
          },
          url: "/repos/:owner/:repo/branches/:branch/protection/restrictions/users"
        },
        merge: {
          method: "POST",
          params: {
            base: {
              required: true,
              type: "string"
            },
            commit_message: {
              type: "string"
            },
            head: {
              required: true,
              type: "string"
            },
            owner: {
              required: true,
              type: "string"
            },
            repo: {
              required: true,
              type: "string"
            }
          },
          url: "/repos/:owner/:repo/merges"
        },
        pingHook: {
          method: "POST",
          params: {
            hook_id: {
              required: true,
              type: "integer"
            },
            owner: {
              required: true,
              type: "string"
            },
            repo: {
              required: true,
              type: "string"
            }
          },
          url: "/repos/:owner/:repo/hooks/:hook_id/pings"
        },
        removeBranchProtection: {
          method: "DELETE",
          params: {
            branch: {
              required: true,
              type: "string"
            },
            owner: {
              required: true,
              type: "string"
            },
            repo: {
              required: true,
              type: "string"
            }
          },
          url: "/repos/:owner/:repo/branches/:branch/protection"
        },
        removeCollaborator: {
          method: "DELETE",
          params: {
            owner: {
              required: true,
              type: "string"
            },
            repo: {
              required: true,
              type: "string"
            },
            username: {
              required: true,
              type: "string"
            }
          },
          url: "/repos/:owner/:repo/collaborators/:username"
        },
        removeDeployKey: {
          method: "DELETE",
          params: {
            key_id: {
              required: true,
              type: "integer"
            },
            owner: {
              required: true,
              type: "string"
            },
            repo: {
              required: true,
              type: "string"
            }
          },
          url: "/repos/:owner/:repo/keys/:key_id"
        },
        removeProtectedBranchAdminEnforcement: {
          method: "DELETE",
          params: {
            branch: {
              required: true,
              type: "string"
            },
            owner: {
              required: true,
              type: "string"
            },
            repo: {
              required: true,
              type: "string"
            }
          },
          url: "/repos/:owner/:repo/branches/:branch/protection/enforce_admins"
        },
        removeProtectedBranchAppRestrictions: {
          method: "DELETE",
          params: {
            apps: {
              mapTo: "data",
              required: true,
              type: "string[]"
            },
            branch: {
              required: true,
              type: "string"
            },
            owner: {
              required: true,
              type: "string"
            },
            repo: {
              required: true,
              type: "string"
            }
          },
          url: "/repos/:owner/:repo/branches/:branch/protection/restrictions/apps"
        },
        removeProtectedBranchPullRequestReviewEnforcement: {
          method: "DELETE",
          params: {
            branch: {
              required: true,
              type: "string"
            },
            owner: {
              required: true,
              type: "string"
            },
            repo: {
              required: true,
              type: "string"
            }
          },
          url: "/repos/:owner/:repo/branches/:branch/protection/required_pull_request_reviews"
        },
        removeProtectedBranchRequiredSignatures: {
          headers: {
            accept: "application/vnd.github.zzzax-preview+json"
          },
          method: "DELETE",
          params: {
            branch: {
              required: true,
              type: "string"
            },
            owner: {
              required: true,
              type: "string"
            },
            repo: {
              required: true,
              type: "string"
            }
          },
          url: "/repos/:owner/:repo/branches/:branch/protection/required_signatures"
        },
        removeProtectedBranchRequiredStatusChecks: {
          method: "DELETE",
          params: {
            branch: {
              required: true,
              type: "string"
            },
            owner: {
              required: true,
              type: "string"
            },
            repo: {
              required: true,
              type: "string"
            }
          },
          url: "/repos/:owner/:repo/branches/:branch/protection/required_status_checks"
        },
        removeProtectedBranchRequiredStatusChecksContexts: {
          method: "DELETE",
          params: {
            branch: {
              required: true,
              type: "string"
            },
            contexts: {
              mapTo: "data",
              required: true,
              type: "string[]"
            },
            owner: {
              required: true,
              type: "string"
            },
            repo: {
              required: true,
              type: "string"
            }
          },
          url: "/repos/:owner/:repo/branches/:branch/protection/required_status_checks/contexts"
        },
        removeProtectedBranchRestrictions: {
          method: "DELETE",
          params: {
            branch: {
              required: true,
              type: "string"
            },
            owner: {
              required: true,
              type: "string"
            },
            repo: {
              required: true,
              type: "string"
            }
          },
          url: "/repos/:owner/:repo/branches/:branch/protection/restrictions"
        },
        removeProtectedBranchTeamRestrictions: {
          method: "DELETE",
          params: {
            branch: {
              required: true,
              type: "string"
            },
            owner: {
              required: true,
              type: "string"
            },
            repo: {
              required: true,
              type: "string"
            },
            teams: {
              mapTo: "data",
              required: true,
              type: "string[]"
            }
          },
          url: "/repos/:owner/:repo/branches/:branch/protection/restrictions/teams"
        },
        removeProtectedBranchUserRestrictions: {
          method: "DELETE",
          params: {
            branch: {
              required: true,
              type: "string"
            },
            owner: {
              required: true,
              type: "string"
            },
            repo: {
              required: true,
              type: "string"
            },
            users: {
              mapTo: "data",
              required: true,
              type: "string[]"
            }
          },
          url: "/repos/:owner/:repo/branches/:branch/protection/restrictions/users"
        },
        replaceProtectedBranchAppRestrictions: {
          method: "PUT",
          params: {
            apps: {
              mapTo: "data",
              required: true,
              type: "string[]"
            },
            branch: {
              required: true,
              type: "string"
            },
            owner: {
              required: true,
              type: "string"
            },
            repo: {
              required: true,
              type: "string"
            }
          },
          url: "/repos/:owner/:repo/branches/:branch/protection/restrictions/apps"
        },
        replaceProtectedBranchRequiredStatusChecksContexts: {
          method: "PUT",
          params: {
            branch: {
              required: true,
              type: "string"
            },
            contexts: {
              mapTo: "data",
              required: true,
              type: "string[]"
            },
            owner: {
              required: true,
              type: "string"
            },
            repo: {
              required: true,
              type: "string"
            }
          },
          url: "/repos/:owner/:repo/branches/:branch/protection/required_status_checks/contexts"
        },
        replaceProtectedBranchTeamRestrictions: {
          method: "PUT",
          params: {
            branch: {
              required: true,
              type: "string"
            },
            owner: {
              required: true,
              type: "string"
            },
            repo: {
              required: true,
              type: "string"
            },
            teams: {
              mapTo: "data",
              required: true,
              type: "string[]"
            }
          },
          url: "/repos/:owner/:repo/branches/:branch/protection/restrictions/teams"
        },
        replaceProtectedBranchUserRestrictions: {
          method: "PUT",
          params: {
            branch: {
              required: true,
              type: "string"
            },
            owner: {
              required: true,
              type: "string"
            },
            repo: {
              required: true,
              type: "string"
            },
            users: {
              mapTo: "data",
              required: true,
              type: "string[]"
            }
          },
          url: "/repos/:owner/:repo/branches/:branch/protection/restrictions/users"
        },
        replaceTopics: {
          headers: {
            accept: "application/vnd.github.mercy-preview+json"
          },
          method: "PUT",
          params: {
            names: {
              required: true,
              type: "string[]"
            },
            owner: {
              required: true,
              type: "string"
            },
            repo: {
              required: true,
              type: "string"
            }
          },
          url: "/repos/:owner/:repo/topics"
        },
        requestPageBuild: {
          method: "POST",
          params: {
            owner: {
              required: true,
              type: "string"
            },
            repo: {
              required: true,
              type: "string"
            }
          },
          url: "/repos/:owner/:repo/pages/builds"
        },
        retrieveCommunityProfileMetrics: {
          method: "GET",
          params: {
            owner: {
              required: true,
              type: "string"
            },
            repo: {
              required: true,
              type: "string"
            }
          },
          url: "/repos/:owner/:repo/community/profile"
        },
        testPushHook: {
          method: "POST",
          params: {
            hook_id: {
              required: true,
              type: "integer"
            },
            owner: {
              required: true,
              type: "string"
            },
            repo: {
              required: true,
              type: "string"
            }
          },
          url: "/repos/:owner/:repo/hooks/:hook_id/tests"
        },
        transfer: {
          method: "POST",
          params: {
            new_owner: {
              type: "string"
            },
            owner: {
              required: true,
              type: "string"
            },
            repo: {
              required: true,
              type: "string"
            },
            team_ids: {
              type: "integer[]"
            }
          },
          url: "/repos/:owner/:repo/transfer"
        },
        update: {
          method: "PATCH",
          params: {
            allow_merge_commit: {
              type: "boolean"
            },
            allow_rebase_merge: {
              type: "boolean"
            },
            allow_squash_merge: {
              type: "boolean"
            },
            archived: {
              type: "boolean"
            },
            default_branch: {
              type: "string"
            },
            delete_branch_on_merge: {
              type: "boolean"
            },
            description: {
              type: "string"
            },
            has_issues: {
              type: "boolean"
            },
            has_projects: {
              type: "boolean"
            },
            has_wiki: {
              type: "boolean"
            },
            homepage: {
              type: "string"
            },
            is_template: {
              type: "boolean"
            },
            name: {
              type: "string"
            },
            owner: {
              required: true,
              type: "string"
            },
            private: {
              type: "boolean"
            },
            repo: {
              required: true,
              type: "string"
            },
            visibility: {
              enum: ["public", "private", "visibility", "internal"],
              type: "string"
            }
          },
          url: "/repos/:owner/:repo"
        },
        updateBranchProtection: {
          method: "PUT",
          params: {
            allow_deletions: {
              type: "boolean"
            },
            allow_force_pushes: {
              allowNull: true,
              type: "boolean"
            },
            branch: {
              required: true,
              type: "string"
            },
            enforce_admins: {
              allowNull: true,
              required: true,
              type: "boolean"
            },
            owner: {
              required: true,
              type: "string"
            },
            repo: {
              required: true,
              type: "string"
            },
            required_linear_history: {
              type: "boolean"
            },
            required_pull_request_reviews: {
              allowNull: true,
              required: true,
              type: "object"
            },
            "required_pull_request_reviews.dismiss_stale_reviews": {
              type: "boolean"
            },
            "required_pull_request_reviews.dismissal_restrictions": {
              type: "object"
            },
            "required_pull_request_reviews.dismissal_restrictions.teams": {
              type: "string[]"
            },
            "required_pull_request_reviews.dismissal_restrictions.users": {
              type: "string[]"
            },
            "required_pull_request_reviews.require_code_owner_reviews": {
              type: "boolean"
            },
            "required_pull_request_reviews.required_approving_review_count": {
              type: "integer"
            },
            required_status_checks: {
              allowNull: true,
              required: true,
              type: "object"
            },
            "required_status_checks.contexts": {
              required: true,
              type: "string[]"
            },
            "required_status_checks.strict": {
              required: true,
              type: "boolean"
            },
            restrictions: {
              allowNull: true,
              required: true,
              type: "object"
            },
            "restrictions.apps": {
              type: "string[]"
            },
            "restrictions.teams": {
              required: true,
              type: "string[]"
            },
            "restrictions.users": {
              required: true,
              type: "string[]"
            }
          },
          url: "/repos/:owner/:repo/branches/:branch/protection"
        },
        updateCommitComment: {
          method: "PATCH",
          params: {
            body: {
              required: true,
              type: "string"
            },
            comment_id: {
              required: true,
              type: "integer"
            },
            owner: {
              required: true,
              type: "string"
            },
            repo: {
              required: true,
              type: "string"
            }
          },
          url: "/repos/:owner/:repo/comments/:comment_id"
        },
        updateFile: {
          deprecated: "octokit.repos.updateFile() has been renamed to octokit.repos.createOrUpdateFile() (2019-06-07)",
          method: "PUT",
          params: {
            author: {
              type: "object"
            },
            "author.email": {
              required: true,
              type: "string"
            },
            "author.name": {
              required: true,
              type: "string"
            },
            branch: {
              type: "string"
            },
            committer: {
              type: "object"
            },
            "committer.email": {
              required: true,
              type: "string"
            },
            "committer.name": {
              required: true,
              type: "string"
            },
            content: {
              required: true,
              type: "string"
            },
            message: {
              required: true,
              type: "string"
            },
            owner: {
              required: true,
              type: "string"
            },
            path: {
              required: true,
              type: "string"
            },
            repo: {
              required: true,
              type: "string"
            },
            sha: {
              type: "string"
            }
          },
          url: "/repos/:owner/:repo/contents/:path"
        },
        updateHook: {
          method: "PATCH",
          params: {
            active: {
              type: "boolean"
            },
            add_events: {
              type: "string[]"
            },
            config: {
              type: "object"
            },
            "config.content_type": {
              type: "string"
            },
            "config.insecure_ssl": {
              type: "string"
            },
            "config.secret": {
              type: "string"
            },
            "config.url": {
              required: true,
              type: "string"
            },
            events: {
              type: "string[]"
            },
            hook_id: {
              required: true,
              type: "integer"
            },
            owner: {
              required: true,
              type: "string"
            },
            remove_events: {
              type: "string[]"
            },
            repo: {
              required: true,
              type: "string"
            }
          },
          url: "/repos/:owner/:repo/hooks/:hook_id"
        },
        updateInformationAboutPagesSite: {
          method: "PUT",
          params: {
            cname: {
              type: "string"
            },
            owner: {
              required: true,
              type: "string"
            },
            repo: {
              required: true,
              type: "string"
            },
            source: {
              enum: ['"gh-pages"', '"master"', '"master /docs"'],
              type: "string"
            }
          },
          url: "/repos/:owner/:repo/pages"
        },
        updateInvitation: {
          method: "PATCH",
          params: {
            invitation_id: {
              required: true,
              type: "integer"
            },
            owner: {
              required: true,
              type: "string"
            },
            permissions: {
              enum: ["read", "write", "admin"],
              type: "string"
            },
            repo: {
              required: true,
              type: "string"
            }
          },
          url: "/repos/:owner/:repo/invitations/:invitation_id"
        },
        updateProtectedBranchPullRequestReviewEnforcement: {
          method: "PATCH",
          params: {
            branch: {
              required: true,
              type: "string"
            },
            dismiss_stale_reviews: {
              type: "boolean"
            },
            dismissal_restrictions: {
              type: "object"
            },
            "dismissal_restrictions.teams": {
              type: "string[]"
            },
            "dismissal_restrictions.users": {
              type: "string[]"
            },
            owner: {
              required: true,
              type: "string"
            },
            repo: {
              required: true,
              type: "string"
            },
            require_code_owner_reviews: {
              type: "boolean"
            },
            required_approving_review_count: {
              type: "integer"
            }
          },
          url: "/repos/:owner/:repo/branches/:branch/protection/required_pull_request_reviews"
        },
        updateProtectedBranchRequiredStatusChecks: {
          method: "PATCH",
          params: {
            branch: {
              required: true,
              type: "string"
            },
            contexts: {
              type: "string[]"
            },
            owner: {
              required: true,
              type: "string"
            },
            repo: {
              required: true,
              type: "string"
            },
            strict: {
              type: "boolean"
            }
          },
          url: "/repos/:owner/:repo/branches/:branch/protection/required_status_checks"
        },
        updateRelease: {
          method: "PATCH",
          params: {
            body: {
              type: "string"
            },
            draft: {
              type: "boolean"
            },
            name: {
              type: "string"
            },
            owner: {
              required: true,
              type: "string"
            },
            prerelease: {
              type: "boolean"
            },
            release_id: {
              required: true,
              type: "integer"
            },
            repo: {
              required: true,
              type: "string"
            },
            tag_name: {
              type: "string"
            },
            target_commitish: {
              type: "string"
            }
          },
          url: "/repos/:owner/:repo/releases/:release_id"
        },
        updateReleaseAsset: {
          method: "PATCH",
          params: {
            asset_id: {
              required: true,
              type: "integer"
            },
            label: {
              type: "string"
            },
            name: {
              type: "string"
            },
            owner: {
              required: true,
              type: "string"
            },
            repo: {
              required: true,
              type: "string"
            }
          },
          url: "/repos/:owner/:repo/releases/assets/:asset_id"
        },
        uploadReleaseAsset: {
          method: "POST",
          params: {
            data: {
              mapTo: "data",
              required: true,
              type: "string | object"
            },
            file: {
              alias: "data",
              deprecated: true,
              type: "string | object"
            },
            headers: {
              required: true,
              type: "object"
            },
            "headers.content-length": {
              required: true,
              type: "integer"
            },
            "headers.content-type": {
              required: true,
              type: "string"
            },
            label: {
              type: "string"
            },
            name: {
              required: true,
              type: "string"
            },
            url: {
              required: true,
              type: "string"
            }
          },
          url: ":url"
        }
      },
      search: {
        code: {
          method: "GET",
          params: {
            order: {
              enum: ["desc", "asc"],
              type: "string"
            },
            page: {
              type: "integer"
            },
            per_page: {
              type: "integer"
            },
            q: {
              required: true,
              type: "string"
            },
            sort: {
              enum: ["indexed"],
              type: "string"
            }
          },
          url: "/search/code"
        },
        commits: {
          headers: {
            accept: "application/vnd.github.cloak-preview+json"
          },
          method: "GET",
          params: {
            order: {
              enum: ["desc", "asc"],
              type: "string"
            },
            page: {
              type: "integer"
            },
            per_page: {
              type: "integer"
            },
            q: {
              required: true,
              type: "string"
            },
            sort: {
              enum: ["author-date", "committer-date"],
              type: "string"
            }
          },
          url: "/search/commits"
        },
        issues: {
          deprecated: "octokit.search.issues() has been renamed to octokit.search.issuesAndPullRequests() (2018-12-27)",
          method: "GET",
          params: {
            order: {
              enum: ["desc", "asc"],
              type: "string"
            },
            page: {
              type: "integer"
            },
            per_page: {
              type: "integer"
            },
            q: {
              required: true,
              type: "string"
            },
            sort: {
              enum: ["comments", "reactions", "reactions-+1", "reactions--1", "reactions-smile", "reactions-thinking_face", "reactions-heart", "reactions-tada", "interactions", "created", "updated"],
              type: "string"
            }
          },
          url: "/search/issues"
        },
        issuesAndPullRequests: {
          method: "GET",
          params: {
            order: {
              enum: ["desc", "asc"],
              type: "string"
            },
            page: {
              type: "integer"
            },
            per_page: {
              type: "integer"
            },
            q: {
              required: true,
              type: "string"
            },
            sort: {
              enum: ["comments", "reactions", "reactions-+1", "reactions--1", "reactions-smile", "reactions-thinking_face", "reactions-heart", "reactions-tada", "interactions", "created", "updated"],
              type: "string"
            }
          },
          url: "/search/issues"
        },
        labels: {
          method: "GET",
          params: {
            order: {
              enum: ["desc", "asc"],
              type: "string"
            },
            q: {
              required: true,
              type: "string"
            },
            repository_id: {
              required: true,
              type: "integer"
            },
            sort: {
              enum: ["created", "updated"],
              type: "string"
            }
          },
          url: "/search/labels"
        },
        repos: {
          method: "GET",
          params: {
            order: {
              enum: ["desc", "asc"],
              type: "string"
            },
            page: {
              type: "integer"
            },
            per_page: {
              type: "integer"
            },
            q: {
              required: true,
              type: "string"
            },
            sort: {
              enum: ["stars", "forks", "help-wanted-issues", "updated"],
              type: "string"
            }
          },
          url: "/search/repositories"
        },
        topics: {
          method: "GET",
          params: {
            q: {
              required: true,
              type: "string"
            }
          },
          url: "/search/topics"
        },
        users: {
          method: "GET",
          params: {
            order: {
              enum: ["desc", "asc"],
              type: "string"
            },
            page: {
              type: "integer"
            },
            per_page: {
              type: "integer"
            },
            q: {
              required: true,
              type: "string"
            },
            sort: {
              enum: ["followers", "repositories", "joined"],
              type: "string"
            }
          },
          url: "/search/users"
        }
      },
      teams: {
        addMember: {
          deprecated: "octokit.teams.addMember() has been renamed to octokit.teams.addMemberLegacy() (2020-01-16)",
          method: "PUT",
          params: {
            team_id: {
              required: true,
              type: "integer"
            },
            username: {
              required: true,
              type: "string"
            }
          },
          url: "/teams/:team_id/members/:username"
        },
        addMemberLegacy: {
          deprecated: "octokit.teams.addMemberLegacy() is deprecated, see https://developer.github.com/v3/teams/members/#add-team-member-legacy",
          method: "PUT",
          params: {
            team_id: {
              required: true,
              type: "integer"
            },
            username: {
              required: true,
              type: "string"
            }
          },
          url: "/teams/:team_id/members/:username"
        },
        addOrUpdateMembership: {
          deprecated: "octokit.teams.addOrUpdateMembership() has been renamed to octokit.teams.addOrUpdateMembershipLegacy() (2020-01-16)",
          method: "PUT",
          params: {
            role: {
              enum: ["member", "maintainer"],
              type: "string"
            },
            team_id: {
              required: true,
              type: "integer"
            },
            username: {
              required: true,
              type: "string"
            }
          },
          url: "/teams/:team_id/memberships/:username"
        },
        addOrUpdateMembershipInOrg: {
          method: "PUT",
          params: {
            org: {
              required: true,
              type: "string"
            },
            role: {
              enum: ["member", "maintainer"],
              type: "string"
            },
            team_slug: {
              required: true,
              type: "string"
            },
            username: {
              required: true,
              type: "string"
            }
          },
          url: "/orgs/:org/teams/:team_slug/memberships/:username"
        },
        addOrUpdateMembershipLegacy: {
          deprecated: "octokit.teams.addOrUpdateMembershipLegacy() is deprecated, see https://developer.github.com/v3/teams/members/#add-or-update-team-membership-legacy",
          method: "PUT",
          params: {
            role: {
              enum: ["member", "maintainer"],
              type: "string"
            },
            team_id: {
              required: true,
              type: "integer"
            },
            username: {
              required: true,
              type: "string"
            }
          },
          url: "/teams/:team_id/memberships/:username"
        },
        addOrUpdateProject: {
          deprecated: "octokit.teams.addOrUpdateProject() has been renamed to octokit.teams.addOrUpdateProjectLegacy() (2020-01-16)",
          headers: {
            accept: "application/vnd.github.inertia-preview+json"
          },
          method: "PUT",
          params: {
            permission: {
              enum: ["read", "write", "admin"],
              type: "string"
            },
            project_id: {
              required: true,
              type: "integer"
            },
            team_id: {
              required: true,
              type: "integer"
            }
          },
          url: "/teams/:team_id/projects/:project_id"
        },
        addOrUpdateProjectInOrg: {
          headers: {
            accept: "application/vnd.github.inertia-preview+json"
          },
          method: "PUT",
          params: {
            org: {
              required: true,
              type: "string"
            },
            permission: {
              enum: ["read", "write", "admin"],
              type: "string"
            },
            project_id: {
              required: true,
              type: "integer"
            },
            team_slug: {
              required: true,
              type: "string"
            }
          },
          url: "/orgs/:org/teams/:team_slug/projects/:project_id"
        },
        addOrUpdateProjectLegacy: {
          deprecated: "octokit.teams.addOrUpdateProjectLegacy() is deprecated, see https://developer.github.com/v3/teams/#add-or-update-team-project-legacy",
          headers: {
            accept: "application/vnd.github.inertia-preview+json"
          },
          method: "PUT",
          params: {
            permission: {
              enum: ["read", "write", "admin"],
              type: "string"
            },
            project_id: {
              required: true,
              type: "integer"
            },
            team_id: {
              required: true,
              type: "integer"
            }
          },
          url: "/teams/:team_id/projects/:project_id"
        },
        addOrUpdateRepo: {
          deprecated: "octokit.teams.addOrUpdateRepo() has been renamed to octokit.teams.addOrUpdateRepoLegacy() (2020-01-16)",
          method: "PUT",
          params: {
            owner: {
              required: true,
              type: "string"
            },
            permission: {
              enum: ["pull", "push", "admin"],
              type: "string"
            },
            repo: {
              required: true,
              type: "string"
            },
            team_id: {
              required: true,
              type: "integer"
            }
          },
          url: "/teams/:team_id/repos/:owner/:repo"
        },
        addOrUpdateRepoInOrg: {
          method: "PUT",
          params: {
            org: {
              required: true,
              type: "string"
            },
            owner: {
              required: true,
              type: "string"
            },
            permission: {
              enum: ["pull", "push", "admin"],
              type: "string"
            },
            repo: {
              required: true,
              type: "string"
            },
            team_slug: {
              required: true,
              type: "string"
            }
          },
          url: "/orgs/:org/teams/:team_slug/repos/:owner/:repo"
        },
        addOrUpdateRepoLegacy: {
          deprecated: "octokit.teams.addOrUpdateRepoLegacy() is deprecated, see https://developer.github.com/v3/teams/#add-or-update-team-repository-legacy",
          method: "PUT",
          params: {
            owner: {
              required: true,
              type: "string"
            },
            permission: {
              enum: ["pull", "push", "admin"],
              type: "string"
            },
            repo: {
              required: true,
              type: "string"
            },
            team_id: {
              required: true,
              type: "integer"
            }
          },
          url: "/teams/:team_id/repos/:owner/:repo"
        },
        checkManagesRepo: {
          deprecated: "octokit.teams.checkManagesRepo() has been renamed to octokit.teams.checkManagesRepoLegacy() (2020-01-16)",
          method: "GET",
          params: {
            owner: {
              required: true,
              type: "string"
            },
            repo: {
              required: true,
              type: "string"
            },
            team_id: {
              required: true,
              type: "integer"
            }
          },
          url: "/teams/:team_id/repos/:owner/:repo"
        },
        checkManagesRepoInOrg: {
          method: "GET",
          params: {
            org: {
              required: true,
              type: "string"
            },
            owner: {
              required: true,
              type: "string"
            },
            repo: {
              required: true,
              type: "string"
            },
            team_slug: {
              required: true,
              type: "string"
            }
          },
          url: "/orgs/:org/teams/:team_slug/repos/:owner/:repo"
        },
        checkManagesRepoLegacy: {
          deprecated: "octokit.teams.checkManagesRepoLegacy() is deprecated, see https://developer.github.com/v3/teams/#check-if-a-team-manages-a-repository-legacy",
          method: "GET",
          params: {
            owner: {
              required: true,
              type: "string"
            },
            repo: {
              required: true,
              type: "string"
            },
            team_id: {
              required: true,
              type: "integer"
            }
          },
          url: "/teams/:team_id/repos/:owner/:repo"
        },
        create: {
          method: "POST",
          params: {
            description: {
              type: "string"
            },
            maintainers: {
              type: "string[]"
            },
            name: {
              required: true,
              type: "string"
            },
            org: {
              required: true,
              type: "string"
            },
            parent_team_id: {
              type: "integer"
            },
            permission: {
              enum: ["pull", "push", "admin"],
              type: "string"
            },
            privacy: {
              enum: ["secret", "closed"],
              type: "string"
            },
            repo_names: {
              type: "string[]"
            }
          },
          url: "/orgs/:org/teams"
        },
        createDiscussion: {
          deprecated: "octokit.teams.createDiscussion() has been renamed to octokit.teams.createDiscussionLegacy() (2020-01-16)",
          method: "POST",
          params: {
            body: {
              required: true,
              type: "string"
            },
            private: {
              type: "boolean"
            },
            team_id: {
              required: true,
              type: "integer"
            },
            title: {
              required: true,
              type: "string"
            }
          },
          url: "/teams/:team_id/discussions"
        },
        createDiscussionComment: {
          deprecated: "octokit.teams.createDiscussionComment() has been renamed to octokit.teams.createDiscussionCommentLegacy() (2020-01-16)",
          method: "POST",
          params: {
            body: {
              required: true,
              type: "string"
            },
            discussion_number: {
              required: true,
              type: "integer"
            },
            team_id: {
              required: true,
              type: "integer"
            }
          },
          url: "/teams/:team_id/discussions/:discussion_number/comments"
        },
        createDiscussionCommentInOrg: {
          method: "POST",
          params: {
            body: {
              required: true,
              type: "string"
            },
            discussion_number: {
              required: true,
              type: "integer"
            },
            org: {
              required: true,
              type: "string"
            },
            team_slug: {
              required: true,
              type: "string"
            }
          },
          url: "/orgs/:org/teams/:team_slug/discussions/:discussion_number/comments"
        },
        createDiscussionCommentLegacy: {
          deprecated: "octokit.teams.createDiscussionCommentLegacy() is deprecated, see https://developer.github.com/v3/teams/discussion_comments/#create-a-comment-legacy",
          method: "POST",
          params: {
            body: {
              required: true,
              type: "string"
            },
            discussion_number: {
              required: true,
              type: "integer"
            },
            team_id: {
              required: true,
              type: "integer"
            }
          },
          url: "/teams/:team_id/discussions/:discussion_number/comments"
        },
        createDiscussionInOrg: {
          method: "POST",
          params: {
            body: {
              required: true,
              type: "string"
            },
            org: {
              required: true,
              type: "string"
            },
            private: {
              type: "boolean"
            },
            team_slug: {
              required: true,
              type: "string"
            },
            title: {
              required: true,
              type: "string"
            }
          },
          url: "/orgs/:org/teams/:team_slug/discussions"
        },
        createDiscussionLegacy: {
          deprecated: "octokit.teams.createDiscussionLegacy() is deprecated, see https://developer.github.com/v3/teams/discussions/#create-a-discussion-legacy",
          method: "POST",
          params: {
            body: {
              required: true,
              type: "string"
            },
            private: {
              type: "boolean"
            },
            team_id: {
              required: true,
              type: "integer"
            },
            title: {
              required: true,
              type: "string"
            }
          },
          url: "/teams/:team_id/discussions"
        },
        delete: {
          deprecated: "octokit.teams.delete() has been renamed to octokit.teams.deleteLegacy() (2020-01-16)",
          method: "DELETE",
          params: {
            team_id: {
              required: true,
              type: "integer"
            }
          },
          url: "/teams/:team_id"
        },
        deleteDiscussion: {
          deprecated: "octokit.teams.deleteDiscussion() has been renamed to octokit.teams.deleteDiscussionLegacy() (2020-01-16)",
          method: "DELETE",
          params: {
            discussion_number: {
              required: true,
              type: "integer"
            },
            team_id: {
              required: true,
              type: "integer"
            }
          },
          url: "/teams/:team_id/discussions/:discussion_number"
        },
        deleteDiscussionComment: {
          deprecated: "octokit.teams.deleteDiscussionComment() has been renamed to octokit.teams.deleteDiscussionCommentLegacy() (2020-01-16)",
          method: "DELETE",
          params: {
            comment_number: {
              required: true,
              type: "integer"
            },
            discussion_number: {
              required: true,
              type: "integer"
            },
            team_id: {
              required: true,
              type: "integer"
            }
          },
          url: "/teams/:team_id/discussions/:discussion_number/comments/:comment_number"
        },
        deleteDiscussionCommentInOrg: {
          method: "DELETE",
          params: {
            comment_number: {
              required: true,
              type: "integer"
            },
            discussion_number: {
              required: true,
              type: "integer"
            },
            org: {
              required: true,
              type: "string"
            },
            team_slug: {
              required: true,
              type: "string"
            }
          },
          url: "/orgs/:org/teams/:team_slug/discussions/:discussion_number/comments/:comment_number"
        },
        deleteDiscussionCommentLegacy: {
          deprecated: "octokit.teams.deleteDiscussionCommentLegacy() is deprecated, see https://developer.github.com/v3/teams/discussion_comments/#delete-a-comment-legacy",
          method: "DELETE",
          params: {
            comment_number: {
              required: true,
              type: "integer"
            },
            discussion_number: {
              required: true,
              type: "integer"
            },
            team_id: {
              required: true,
              type: "integer"
            }
          },
          url: "/teams/:team_id/discussions/:discussion_number/comments/:comment_number"
        },
        deleteDiscussionInOrg: {
          method: "DELETE",
          params: {
            discussion_number: {
              required: true,
              type: "integer"
            },
            org: {
              required: true,
              type: "string"
            },
            team_slug: {
              required: true,
              type: "string"
            }
          },
          url: "/orgs/:org/teams/:team_slug/discussions/:discussion_number"
        },
        deleteDiscussionLegacy: {
          deprecated: "octokit.teams.deleteDiscussionLegacy() is deprecated, see https://developer.github.com/v3/teams/discussions/#delete-a-discussion-legacy",
          method: "DELETE",
          params: {
            discussion_number: {
              required: true,
              type: "integer"
            },
            team_id: {
              required: true,
              type: "integer"
            }
          },
          url: "/teams/:team_id/discussions/:discussion_number"
        },
        deleteInOrg: {
          method: "DELETE",
          params: {
            org: {
              required: true,
              type: "string"
            },
            team_slug: {
              required: true,
              type: "string"
            }
          },
          url: "/orgs/:org/teams/:team_slug"
        },
        deleteLegacy: {
          deprecated: "octokit.teams.deleteLegacy() is deprecated, see https://developer.github.com/v3/teams/#delete-team-legacy",
          method: "DELETE",
          params: {
            team_id: {
              required: true,
              type: "integer"
            }
          },
          url: "/teams/:team_id"
        },
        get: {
          deprecated: "octokit.teams.get() has been renamed to octokit.teams.getLegacy() (2020-01-16)",
          method: "GET",
          params: {
            team_id: {
              required: true,
              type: "integer"
            }
          },
          url: "/teams/:team_id"
        },
        getByName: {
          method: "GET",
          params: {
            org: {
              required: true,
              type: "string"
            },
            team_slug: {
              required: true,
              type: "string"
            }
          },
          url: "/orgs/:org/teams/:team_slug"
        },
        getDiscussion: {
          deprecated: "octokit.teams.getDiscussion() has been renamed to octokit.teams.getDiscussionLegacy() (2020-01-16)",
          method: "GET",
          params: {
            discussion_number: {
              required: true,
              type: "integer"
            },
            team_id: {
              required: true,
              type: "integer"
            }
          },
          url: "/teams/:team_id/discussions/:discussion_number"
        },
        getDiscussionComment: {
          deprecated: "octokit.teams.getDiscussionComment() has been renamed to octokit.teams.getDiscussionCommentLegacy() (2020-01-16)",
          method: "GET",
          params: {
            comment_number: {
              required: true,
              type: "integer"
            },
            discussion_number: {
              required: true,
              type: "integer"
            },
            team_id: {
              required: true,
              type: "integer"
            }
          },
          url: "/teams/:team_id/discussions/:discussion_number/comments/:comment_number"
        },
        getDiscussionCommentInOrg: {
          method: "GET",
          params: {
            comment_number: {
              required: true,
              type: "integer"
            },
            discussion_number: {
              required: true,
              type: "integer"
            },
            org: {
              required: true,
              type: "string"
            },
            team_slug: {
              required: true,
              type: "string"
            }
          },
          url: "/orgs/:org/teams/:team_slug/discussions/:discussion_number/comments/:comment_number"
        },
        getDiscussionCommentLegacy: {
          deprecated: "octokit.teams.getDiscussionCommentLegacy() is deprecated, see https://developer.github.com/v3/teams/discussion_comments/#get-a-single-comment-legacy",
          method: "GET",
          params: {
            comment_number: {
              required: true,
              type: "integer"
            },
            discussion_number: {
              required: true,
              type: "integer"
            },
            team_id: {
              required: true,
              type: "integer"
            }
          },
          url: "/teams/:team_id/discussions/:discussion_number/comments/:comment_number"
        },
        getDiscussionInOrg: {
          method: "GET",
          params: {
            discussion_number: {
              required: true,
              type: "integer"
            },
            org: {
              required: true,
              type: "string"
            },
            team_slug: {
              required: true,
              type: "string"
            }
          },
          url: "/orgs/:org/teams/:team_slug/discussions/:discussion_number"
        },
        getDiscussionLegacy: {
          deprecated: "octokit.teams.getDiscussionLegacy() is deprecated, see https://developer.github.com/v3/teams/discussions/#get-a-single-discussion-legacy",
          method: "GET",
          params: {
            discussion_number: {
              required: true,
              type: "integer"
            },
            team_id: {
              required: true,
              type: "integer"
            }
          },
          url: "/teams/:team_id/discussions/:discussion_number"
        },
        getLegacy: {
          deprecated: "octokit.teams.getLegacy() is deprecated, see https://developer.github.com/v3/teams/#get-team-legacy",
          method: "GET",
          params: {
            team_id: {
              required: true,
              type: "integer"
            }
          },
          url: "/teams/:team_id"
        },
        getMember: {
          deprecated: "octokit.teams.getMember() has been renamed to octokit.teams.getMemberLegacy() (2020-01-16)",
          method: "GET",
          params: {
            team_id: {
              required: true,
              type: "integer"
            },
            username: {
              required: true,
              type: "string"
            }
          },
          url: "/teams/:team_id/members/:username"
        },
        getMemberLegacy: {
          deprecated: "octokit.teams.getMemberLegacy() is deprecated, see https://developer.github.com/v3/teams/members/#get-team-member-legacy",
          method: "GET",
          params: {
            team_id: {
              required: true,
              type: "integer"
            },
            username: {
              required: true,
              type: "string"
            }
          },
          url: "/teams/:team_id/members/:username"
        },
        getMembership: {
          deprecated: "octokit.teams.getMembership() has been renamed to octokit.teams.getMembershipLegacy() (2020-01-16)",
          method: "GET",
          params: {
            team_id: {
              required: true,
              type: "integer"
            },
            username: {
              required: true,
              type: "string"
            }
          },
          url: "/teams/:team_id/memberships/:username"
        },
        getMembershipInOrg: {
          method: "GET",
          params: {
            org: {
              required: true,
              type: "string"
            },
            team_slug: {
              required: true,
              type: "string"
            },
            username: {
              required: true,
              type: "string"
            }
          },
          url: "/orgs/:org/teams/:team_slug/memberships/:username"
        },
        getMembershipLegacy: {
          deprecated: "octokit.teams.getMembershipLegacy() is deprecated, see https://developer.github.com/v3/teams/members/#get-team-membership-legacy",
          method: "GET",
          params: {
            team_id: {
              required: true,
              type: "integer"
            },
            username: {
              required: true,
              type: "string"
            }
          },
          url: "/teams/:team_id/memberships/:username"
        },
        list: {
          method: "GET",
          params: {
            org: {
              required: true,
              type: "string"
            },
            page: {
              type: "integer"
            },
            per_page: {
              type: "integer"
            }
          },
          url: "/orgs/:org/teams"
        },
        listChild: {
          deprecated: "octokit.teams.listChild() has been renamed to octokit.teams.listChildLegacy() (2020-01-16)",
          method: "GET",
          params: {
            page: {
              type: "integer"
            },
            per_page: {
              type: "integer"
            },
            team_id: {
              required: true,
              type: "integer"
            }
          },
          url: "/teams/:team_id/teams"
        },
        listChildInOrg: {
          method: "GET",
          params: {
            org: {
              required: true,
              type: "string"
            },
            page: {
              type: "integer"
            },
            per_page: {
              type: "integer"
            },
            team_slug: {
              required: true,
              type: "string"
            }
          },
          url: "/orgs/:org/teams/:team_slug/teams"
        },
        listChildLegacy: {
          deprecated: "octokit.teams.listChildLegacy() is deprecated, see https://developer.github.com/v3/teams/#list-child-teams-legacy",
          method: "GET",
          params: {
            page: {
              type: "integer"
            },
            per_page: {
              type: "integer"
            },
            team_id: {
              required: true,
              type: "integer"
            }
          },
          url: "/teams/:team_id/teams"
        },
        listDiscussionComments: {
          deprecated: "octokit.teams.listDiscussionComments() has been renamed to octokit.teams.listDiscussionCommentsLegacy() (2020-01-16)",
          method: "GET",
          params: {
            direction: {
              enum: ["asc", "desc"],
              type: "string"
            },
            discussion_number: {
              required: true,
              type: "integer"
            },
            page: {
              type: "integer"
            },
            per_page: {
              type: "integer"
            },
            team_id: {
              required: true,
              type: "integer"
            }
          },
          url: "/teams/:team_id/discussions/:discussion_number/comments"
        },
        listDiscussionCommentsInOrg: {
          method: "GET",
          params: {
            direction: {
              enum: ["asc", "desc"],
              type: "string"
            },
            discussion_number: {
              required: true,
              type: "integer"
            },
            org: {
              required: true,
              type: "string"
            },
            page: {
              type: "integer"
            },
            per_page: {
              type: "integer"
            },
            team_slug: {
              required: true,
              type: "string"
            }
          },
          url: "/orgs/:org/teams/:team_slug/discussions/:discussion_number/comments"
        },
        listDiscussionCommentsLegacy: {
          deprecated: "octokit.teams.listDiscussionCommentsLegacy() is deprecated, see https://developer.github.com/v3/teams/discussion_comments/#list-comments-legacy",
          method: "GET",
          params: {
            direction: {
              enum: ["asc", "desc"],
              type: "string"
            },
            discussion_number: {
              required: true,
              type: "integer"
            },
            page: {
              type: "integer"
            },
            per_page: {
              type: "integer"
            },
            team_id: {
              required: true,
              type: "integer"
            }
          },
          url: "/teams/:team_id/discussions/:discussion_number/comments"
        },
        listDiscussions: {
          deprecated: "octokit.teams.listDiscussions() has been renamed to octokit.teams.listDiscussionsLegacy() (2020-01-16)",
          method: "GET",
          params: {
            direction: {
              enum: ["asc", "desc"],
              type: "string"
            },
            page: {
              type: "integer"
            },
            per_page: {
              type: "integer"
            },
            team_id: {
              required: true,
              type: "integer"
            }
          },
          url: "/teams/:team_id/discussions"
        },
        listDiscussionsInOrg: {
          method: "GET",
          params: {
            direction: {
              enum: ["asc", "desc"],
              type: "string"
            },
            org: {
              required: true,
              type: "string"
            },
            page: {
              type: "integer"
            },
            per_page: {
              type: "integer"
            },
            team_slug: {
              required: true,
              type: "string"
            }
          },
          url: "/orgs/:org/teams/:team_slug/discussions"
        },
        listDiscussionsLegacy: {
          deprecated: "octokit.teams.listDiscussionsLegacy() is deprecated, see https://developer.github.com/v3/teams/discussions/#list-discussions-legacy",
          method: "GET",
          params: {
            direction: {
              enum: ["asc", "desc"],
              type: "string"
            },
            page: {
              type: "integer"
            },
            per_page: {
              type: "integer"
            },
            team_id: {
              required: true,
              type: "integer"
            }
          },
          url: "/teams/:team_id/discussions"
        },
        listForAuthenticatedUser: {
          method: "GET",
          params: {
            page: {
              type: "integer"
            },
            per_page: {
              type: "integer"
            }
          },
          url: "/user/teams"
        },
        listMembers: {
          deprecated: "octokit.teams.listMembers() has been renamed to octokit.teams.listMembersLegacy() (2020-01-16)",
          method: "GET",
          params: {
            page: {
              type: "integer"
            },
            per_page: {
              type: "integer"
            },
            role: {
              enum: ["member", "maintainer", "all"],
              type: "string"
            },
            team_id: {
              required: true,
              type: "integer"
            }
          },
          url: "/teams/:team_id/members"
        },
        listMembersInOrg: {
          method: "GET",
          params: {
            org: {
              required: true,
              type: "string"
            },
            page: {
              type: "integer"
            },
            per_page: {
              type: "integer"
            },
            role: {
              enum: ["member", "maintainer", "all"],
              type: "string"
            },
            team_slug: {
              required: true,
              type: "string"
            }
          },
          url: "/orgs/:org/teams/:team_slug/members"
        },
        listMembersLegacy: {
          deprecated: "octokit.teams.listMembersLegacy() is deprecated, see https://developer.github.com/v3/teams/members/#list-team-members-legacy",
          method: "GET",
          params: {
            page: {
              type: "integer"
            },
            per_page: {
              type: "integer"
            },
            role: {
              enum: ["member", "maintainer", "all"],
              type: "string"
            },
            team_id: {
              required: true,
              type: "integer"
            }
          },
          url: "/teams/:team_id/members"
        },
        listPendingInvitations: {
          deprecated: "octokit.teams.listPendingInvitations() has been renamed to octokit.teams.listPendingInvitationsLegacy() (2020-01-16)",
          method: "GET",
          params: {
            page: {
              type: "integer"
            },
            per_page: {
              type: "integer"
            },
            team_id: {
              required: true,
              type: "integer"
            }
          },
          url: "/teams/:team_id/invitations"
        },
        listPendingInvitationsInOrg: {
          method: "GET",
          params: {
            org: {
              required: true,
              type: "string"
            },
            page: {
              type: "integer"
            },
            per_page: {
              type: "integer"
            },
            team_slug: {
              required: true,
              type: "string"
            }
          },
          url: "/orgs/:org/teams/:team_slug/invitations"
        },
        listPendingInvitationsLegacy: {
          deprecated: "octokit.teams.listPendingInvitationsLegacy() is deprecated, see https://developer.github.com/v3/teams/members/#list-pending-team-invitations-legacy",
          method: "GET",
          params: {
            page: {
              type: "integer"
            },
            per_page: {
              type: "integer"
            },
            team_id: {
              required: true,
              type: "integer"
            }
          },
          url: "/teams/:team_id/invitations"
        },
        listProjects: {
          deprecated: "octokit.teams.listProjects() has been renamed to octokit.teams.listProjectsLegacy() (2020-01-16)",
          headers: {
            accept: "application/vnd.github.inertia-preview+json"
          },
          method: "GET",
          params: {
            page: {
              type: "integer"
            },
            per_page: {
              type: "integer"
            },
            team_id: {
              required: true,
              type: "integer"
            }
          },
          url: "/teams/:team_id/projects"
        },
        listProjectsInOrg: {
          headers: {
            accept: "application/vnd.github.inertia-preview+json"
          },
          method: "GET",
          params: {
            org: {
              required: true,
              type: "string"
            },
            page: {
              type: "integer"
            },
            per_page: {
              type: "integer"
            },
            team_slug: {
              required: true,
              type: "string"
            }
          },
          url: "/orgs/:org/teams/:team_slug/projects"
        },
        listProjectsLegacy: {
          deprecated: "octokit.teams.listProjectsLegacy() is deprecated, see https://developer.github.com/v3/teams/#list-team-projects-legacy",
          headers: {
            accept: "application/vnd.github.inertia-preview+json"
          },
          method: "GET",
          params: {
            page: {
              type: "integer"
            },
            per_page: {
              type: "integer"
            },
            team_id: {
              required: true,
              type: "integer"
            }
          },
          url: "/teams/:team_id/projects"
        },
        listRepos: {
          deprecated: "octokit.teams.listRepos() has been renamed to octokit.teams.listReposLegacy() (2020-01-16)",
          method: "GET",
          params: {
            page: {
              type: "integer"
            },
            per_page: {
              type: "integer"
            },
            team_id: {
              required: true,
              type: "integer"
            }
          },
          url: "/teams/:team_id/repos"
        },
        listReposInOrg: {
          method: "GET",
          params: {
            org: {
              required: true,
              type: "string"
            },
            page: {
              type: "integer"
            },
            per_page: {
              type: "integer"
            },
            team_slug: {
              required: true,
              type: "string"
            }
          },
          url: "/orgs/:org/teams/:team_slug/repos"
        },
        listReposLegacy: {
          deprecated: "octokit.teams.listReposLegacy() is deprecated, see https://developer.github.com/v3/teams/#list-team-repos-legacy",
          method: "GET",
          params: {
            page: {
              type: "integer"
            },
            per_page: {
              type: "integer"
            },
            team_id: {
              required: true,
              type: "integer"
            }
          },
          url: "/teams/:team_id/repos"
        },
        removeMember: {
          deprecated: "octokit.teams.removeMember() has been renamed to octokit.teams.removeMemberLegacy() (2020-01-16)",
          method: "DELETE",
          params: {
            team_id: {
              required: true,
              type: "integer"
            },
            username: {
              required: true,
              type: "string"
            }
          },
          url: "/teams/:team_id/members/:username"
        },
        removeMemberLegacy: {
          deprecated: "octokit.teams.removeMemberLegacy() is deprecated, see https://developer.github.com/v3/teams/members/#remove-team-member-legacy",
          method: "DELETE",
          params: {
            team_id: {
              required: true,
              type: "integer"
            },
            username: {
              required: true,
              type: "string"
            }
          },
          url: "/teams/:team_id/members/:username"
        },
        removeMembership: {
          deprecated: "octokit.teams.removeMembership() has been renamed to octokit.teams.removeMembershipLegacy() (2020-01-16)",
          method: "DELETE",
          params: {
            team_id: {
              required: true,
              type: "integer"
            },
            username: {
              required: true,
              type: "string"
            }
          },
          url: "/teams/:team_id/memberships/:username"
        },
        removeMembershipInOrg: {
          method: "DELETE",
          params: {
            org: {
              required: true,
              type: "string"
            },
            team_slug: {
              required: true,
              type: "string"
            },
            username: {
              required: true,
              type: "string"
            }
          },
          url: "/orgs/:org/teams/:team_slug/memberships/:username"
        },
        removeMembershipLegacy: {
          deprecated: "octokit.teams.removeMembershipLegacy() is deprecated, see https://developer.github.com/v3/teams/members/#remove-team-membership-legacy",
          method: "DELETE",
          params: {
            team_id: {
              required: true,
              type: "integer"
            },
            username: {
              required: true,
              type: "string"
            }
          },
          url: "/teams/:team_id/memberships/:username"
        },
        removeProject: {
          deprecated: "octokit.teams.removeProject() has been renamed to octokit.teams.removeProjectLegacy() (2020-01-16)",
          method: "DELETE",
          params: {
            project_id: {
              required: true,
              type: "integer"
            },
            team_id: {
              required: true,
              type: "integer"
            }
          },
          url: "/teams/:team_id/projects/:project_id"
        },
        removeProjectInOrg: {
          method: "DELETE",
          params: {
            org: {
              required: true,
              type: "string"
            },
            project_id: {
              required: true,
              type: "integer"
            },
            team_slug: {
              required: true,
              type: "string"
            }
          },
          url: "/orgs/:org/teams/:team_slug/projects/:project_id"
        },
        removeProjectLegacy: {
          deprecated: "octokit.teams.removeProjectLegacy() is deprecated, see https://developer.github.com/v3/teams/#remove-team-project-legacy",
          method: "DELETE",
          params: {
            project_id: {
              required: true,
              type: "integer"
            },
            team_id: {
              required: true,
              type: "integer"
            }
          },
          url: "/teams/:team_id/projects/:project_id"
        },
        removeRepo: {
          deprecated: "octokit.teams.removeRepo() has been renamed to octokit.teams.removeRepoLegacy() (2020-01-16)",
          method: "DELETE",
          params: {
            owner: {
              required: true,
              type: "string"
            },
            repo: {
              required: true,
              type: "string"
            },
            team_id: {
              required: true,
              type: "integer"
            }
          },
          url: "/teams/:team_id/repos/:owner/:repo"
        },
        removeRepoInOrg: {
          method: "DELETE",
          params: {
            org: {
              required: true,
              type: "string"
            },
            owner: {
              required: true,
              type: "string"
            },
            repo: {
              required: true,
              type: "string"
            },
            team_slug: {
              required: true,
              type: "string"
            }
          },
          url: "/orgs/:org/teams/:team_slug/repos/:owner/:repo"
        },
        removeRepoLegacy: {
          deprecated: "octokit.teams.removeRepoLegacy() is deprecated, see https://developer.github.com/v3/teams/#remove-team-repository-legacy",
          method: "DELETE",
          params: {
            owner: {
              required: true,
              type: "string"
            },
            repo: {
              required: true,
              type: "string"
            },
            team_id: {
              required: true,
              type: "integer"
            }
          },
          url: "/teams/:team_id/repos/:owner/:repo"
        },
        reviewProject: {
          deprecated: "octokit.teams.reviewProject() has been renamed to octokit.teams.reviewProjectLegacy() (2020-01-16)",
          headers: {
            accept: "application/vnd.github.inertia-preview+json"
          },
          method: "GET",
          params: {
            project_id: {
              required: true,
              type: "integer"
            },
            team_id: {
              required: true,
              type: "integer"
            }
          },
          url: "/teams/:team_id/projects/:project_id"
        },
        reviewProjectInOrg: {
          headers: {
            accept: "application/vnd.github.inertia-preview+json"
          },
          method: "GET",
          params: {
            org: {
              required: true,
              type: "string"
            },
            project_id: {
              required: true,
              type: "integer"
            },
            team_slug: {
              required: true,
              type: "string"
            }
          },
          url: "/orgs/:org/teams/:team_slug/projects/:project_id"
        },
        reviewProjectLegacy: {
          deprecated: "octokit.teams.reviewProjectLegacy() is deprecated, see https://developer.github.com/v3/teams/#review-a-team-project-legacy",
          headers: {
            accept: "application/vnd.github.inertia-preview+json"
          },
          method: "GET",
          params: {
            project_id: {
              required: true,
              type: "integer"
            },
            team_id: {
              required: true,
              type: "integer"
            }
          },
          url: "/teams/:team_id/projects/:project_id"
        },
        update: {
          deprecated: "octokit.teams.update() has been renamed to octokit.teams.updateLegacy() (2020-01-16)",
          method: "PATCH",
          params: {
            description: {
              type: "string"
            },
            name: {
              required: true,
              type: "string"
            },
            parent_team_id: {
              type: "integer"
            },
            permission: {
              enum: ["pull", "push", "admin"],
              type: "string"
            },
            privacy: {
              enum: ["secret", "closed"],
              type: "string"
            },
            team_id: {
              required: true,
              type: "integer"
            }
          },
          url: "/teams/:team_id"
        },
        updateDiscussion: {
          deprecated: "octokit.teams.updateDiscussion() has been renamed to octokit.teams.updateDiscussionLegacy() (2020-01-16)",
          method: "PATCH",
          params: {
            body: {
              type: "string"
            },
            discussion_number: {
              required: true,
              type: "integer"
            },
            team_id: {
              required: true,
              type: "integer"
            },
            title: {
              type: "string"
            }
          },
          url: "/teams/:team_id/discussions/:discussion_number"
        },
        updateDiscussionComment: {
          deprecated: "octokit.teams.updateDiscussionComment() has been renamed to octokit.teams.updateDiscussionCommentLegacy() (2020-01-16)",
          method: "PATCH",
          params: {
            body: {
              required: true,
              type: "string"
            },
            comment_number: {
              required: true,
              type: "integer"
            },
            discussion_number: {
              required: true,
              type: "integer"
            },
            team_id: {
              required: true,
              type: "integer"
            }
          },
          url: "/teams/:team_id/discussions/:discussion_number/comments/:comment_number"
        },
        updateDiscussionCommentInOrg: {
          method: "PATCH",
          params: {
            body: {
              required: true,
              type: "string"
            },
            comment_number: {
              required: true,
              type: "integer"
            },
            discussion_number: {
              required: true,
              type: "integer"
            },
            org: {
              required: true,
              type: "string"
            },
            team_slug: {
              required: true,
              type: "string"
            }
          },
          url: "/orgs/:org/teams/:team_slug/discussions/:discussion_number/comments/:comment_number"
        },
        updateDiscussionCommentLegacy: {
          deprecated: "octokit.teams.updateDiscussionCommentLegacy() is deprecated, see https://developer.github.com/v3/teams/discussion_comments/#edit-a-comment-legacy",
          method: "PATCH",
          params: {
            body: {
              required: true,
              type: "string"
            },
            comment_number: {
              required: true,
              type: "integer"
            },
            discussion_number: {
              required: true,
              type: "integer"
            },
            team_id: {
              required: true,
              type: "integer"
            }
          },
          url: "/teams/:team_id/discussions/:discussion_number/comments/:comment_number"
        },
        updateDiscussionInOrg: {
          method: "PATCH",
          params: {
            body: {
              type: "string"
            },
            discussion_number: {
              required: true,
              type: "integer"
            },
            org: {
              required: true,
              type: "string"
            },
            team_slug: {
              required: true,
              type: "string"
            },
            title: {
              type: "string"
            }
          },
          url: "/orgs/:org/teams/:team_slug/discussions/:discussion_number"
        },
        updateDiscussionLegacy: {
          deprecated: "octokit.teams.updateDiscussionLegacy() is deprecated, see https://developer.github.com/v3/teams/discussions/#edit-a-discussion-legacy",
          method: "PATCH",
          params: {
            body: {
              type: "string"
            },
            discussion_number: {
              required: true,
              type: "integer"
            },
            team_id: {
              required: true,
              type: "integer"
            },
            title: {
              type: "string"
            }
          },
          url: "/teams/:team_id/discussions/:discussion_number"
        },
        updateInOrg: {
          method: "PATCH",
          params: {
            description: {
              type: "string"
            },
            name: {
              required: true,
              type: "string"
            },
            org: {
              required: true,
              type: "string"
            },
            parent_team_id: {
              type: "integer"
            },
            permission: {
              enum: ["pull", "push", "admin"],
              type: "string"
            },
            privacy: {
              enum: ["secret", "closed"],
              type: "string"
            },
            team_slug: {
              required: true,
              type: "string"
            }
          },
          url: "/orgs/:org/teams/:team_slug"
        },
        updateLegacy: {
          deprecated: "octokit.teams.updateLegacy() is deprecated, see https://developer.github.com/v3/teams/#edit-team-legacy",
          method: "PATCH",
          params: {
            description: {
              type: "string"
            },
            name: {
              required: true,
              type: "string"
            },
            parent_team_id: {
              type: "integer"
            },
            permission: {
              enum: ["pull", "push", "admin"],
              type: "string"
            },
            privacy: {
              enum: ["secret", "closed"],
              type: "string"
            },
            team_id: {
              required: true,
              type: "integer"
            }
          },
          url: "/teams/:team_id"
        }
      },
      users: {
        addEmails: {
          method: "POST",
          params: {
            emails: {
              required: true,
              type: "string[]"
            }
          },
          url: "/user/emails"
        },
        block: {
          method: "PUT",
          params: {
            username: {
              required: true,
              type: "string"
            }
          },
          url: "/user/blocks/:username"
        },
        checkBlocked: {
          method: "GET",
          params: {
            username: {
              required: true,
              type: "string"
            }
          },
          url: "/user/blocks/:username"
        },
        checkFollowing: {
          method: "GET",
          params: {
            username: {
              required: true,
              type: "string"
            }
          },
          url: "/user/following/:username"
        },
        checkFollowingForUser: {
          method: "GET",
          params: {
            target_user: {
              required: true,
              type: "string"
            },
            username: {
              required: true,
              type: "string"
            }
          },
          url: "/users/:username/following/:target_user"
        },
        createGpgKey: {
          method: "POST",
          params: {
            armored_public_key: {
              type: "string"
            }
          },
          url: "/user/gpg_keys"
        },
        createPublicKey: {
          method: "POST",
          params: {
            key: {
              type: "string"
            },
            title: {
              type: "string"
            }
          },
          url: "/user/keys"
        },
        deleteEmails: {
          method: "DELETE",
          params: {
            emails: {
              required: true,
              type: "string[]"
            }
          },
          url: "/user/emails"
        },
        deleteGpgKey: {
          method: "DELETE",
          params: {
            gpg_key_id: {
              required: true,
              type: "integer"
            }
          },
          url: "/user/gpg_keys/:gpg_key_id"
        },
        deletePublicKey: {
          method: "DELETE",
          params: {
            key_id: {
              required: true,
              type: "integer"
            }
          },
          url: "/user/keys/:key_id"
        },
        follow: {
          method: "PUT",
          params: {
            username: {
              required: true,
              type: "string"
            }
          },
          url: "/user/following/:username"
        },
        getAuthenticated: {
          method: "GET",
          params: {},
          url: "/user"
        },
        getByUsername: {
          method: "GET",
          params: {
            username: {
              required: true,
              type: "string"
            }
          },
          url: "/users/:username"
        },
        getContextForUser: {
          method: "GET",
          params: {
            subject_id: {
              type: "string"
            },
            subject_type: {
              enum: ["organization", "repository", "issue", "pull_request"],
              type: "string"
            },
            username: {
              required: true,
              type: "string"
            }
          },
          url: "/users/:username/hovercard"
        },
        getGpgKey: {
          method: "GET",
          params: {
            gpg_key_id: {
              required: true,
              type: "integer"
            }
          },
          url: "/user/gpg_keys/:gpg_key_id"
        },
        getPublicKey: {
          method: "GET",
          params: {
            key_id: {
              required: true,
              type: "integer"
            }
          },
          url: "/user/keys/:key_id"
        },
        list: {
          method: "GET",
          params: {
            page: {
              type: "integer"
            },
            per_page: {
              type: "integer"
            },
            since: {
              type: "string"
            }
          },
          url: "/users"
        },
        listBlocked: {
          method: "GET",
          params: {},
          url: "/user/blocks"
        },
        listEmails: {
          method: "GET",
          params: {
            page: {
              type: "integer"
            },
            per_page: {
              type: "integer"
            }
          },
          url: "/user/emails"
        },
        listFollowersForAuthenticatedUser: {
          method: "GET",
          params: {
            page: {
              type: "integer"
            },
            per_page: {
              type: "integer"
            }
          },
          url: "/user/followers"
        },
        listFollowersForUser: {
          method: "GET",
          params: {
            page: {
              type: "integer"
            },
            per_page: {
              type: "integer"
            },
            username: {
              required: true,
              type: "string"
            }
          },
          url: "/users/:username/followers"
        },
        listFollowingForAuthenticatedUser: {
          method: "GET",
          params: {
            page: {
              type: "integer"
            },
            per_page: {
              type: "integer"
            }
          },
          url: "/user/following"
        },
        listFollowingForUser: {
          method: "GET",
          params: {
            page: {
              type: "integer"
            },
            per_page: {
              type: "integer"
            },
            username: {
              required: true,
              type: "string"
            }
          },
          url: "/users/:username/following"
        },
        listGpgKeys: {
          method: "GET",
          params: {
            page: {
              type: "integer"
            },
            per_page: {
              type: "integer"
            }
          },
          url: "/user/gpg_keys"
        },
        listGpgKeysForUser: {
          method: "GET",
          params: {
            page: {
              type: "integer"
            },
            per_page: {
              type: "integer"
            },
            username: {
              required: true,
              type: "string"
            }
          },
          url: "/users/:username/gpg_keys"
        },
        listPublicEmails: {
          method: "GET",
          params: {
            page: {
              type: "integer"
            },
            per_page: {
              type: "integer"
            }
          },
          url: "/user/public_emails"
        },
        listPublicKeys: {
          method: "GET",
          params: {
            page: {
              type: "integer"
            },
            per_page: {
              type: "integer"
            }
          },
          url: "/user/keys"
        },
        listPublicKeysForUser: {
          method: "GET",
          params: {
            page: {
              type: "integer"
            },
            per_page: {
              type: "integer"
            },
            username: {
              required: true,
              type: "string"
            }
          },
          url: "/users/:username/keys"
        },
        togglePrimaryEmailVisibility: {
          method: "PATCH",
          params: {
            email: {
              required: true,
              type: "string"
            },
            visibility: {
              required: true,
              type: "string"
            }
          },
          url: "/user/email/visibility"
        },
        unblock: {
          method: "DELETE",
          params: {
            username: {
              required: true,
              type: "string"
            }
          },
          url: "/user/blocks/:username"
        },
        unfollow: {
          method: "DELETE",
          params: {
            username: {
              required: true,
              type: "string"
            }
          },
          url: "/user/following/:username"
        },
        updateAuthenticated: {
          method: "PATCH",
          params: {
            bio: {
              type: "string"
            },
            blog: {
              type: "string"
            },
            company: {
              type: "string"
            },
            email: {
              type: "string"
            },
            hireable: {
              type: "boolean"
            },
            location: {
              type: "string"
            },
            name: {
              type: "string"
            }
          },
          url: "/user"
        }
      }
    };
    var VERSION = "2.4.0";
    function registerEndpoints(octokit, routes) {
      Object.keys(routes).forEach((namespaceName) => {
        if (!octokit[namespaceName]) {
          octokit[namespaceName] = {};
        }
        Object.keys(routes[namespaceName]).forEach((apiName) => {
          const apiOptions = routes[namespaceName][apiName];
          const endpointDefaults = ["method", "url", "headers"].reduce((map2, key) => {
            if (typeof apiOptions[key] !== "undefined") {
              map2[key] = apiOptions[key];
            }
            return map2;
          }, {});
          endpointDefaults.request = {
            validate: apiOptions.params
          };
          let request = octokit.request.defaults(endpointDefaults);
          const hasDeprecatedParam = Object.keys(apiOptions.params || {}).find((key) => apiOptions.params[key].deprecated);
          if (hasDeprecatedParam) {
            const patch = patchForDeprecation.bind(null, octokit, apiOptions);
            request = patch(octokit.request.defaults(endpointDefaults), `.${namespaceName}.${apiName}()`);
            request.endpoint = patch(request.endpoint, `.${namespaceName}.${apiName}.endpoint()`);
            request.endpoint.merge = patch(request.endpoint.merge, `.${namespaceName}.${apiName}.endpoint.merge()`);
          }
          if (apiOptions.deprecated) {
            octokit[namespaceName][apiName] = Object.assign(function deprecatedEndpointMethod() {
              octokit.log.warn(new deprecation.Deprecation(`[@octokit/rest] ${apiOptions.deprecated}`));
              octokit[namespaceName][apiName] = request;
              return request.apply(null, arguments);
            }, request);
            return;
          }
          octokit[namespaceName][apiName] = request;
        });
      });
    }
    function patchForDeprecation(octokit, apiOptions, method, methodName) {
      const patchedMethod = (options) => {
        options = Object.assign({}, options);
        Object.keys(options).forEach((key) => {
          if (apiOptions.params[key] && apiOptions.params[key].deprecated) {
            const aliasKey = apiOptions.params[key].alias;
            octokit.log.warn(new deprecation.Deprecation(`[@octokit/rest] "${key}" parameter is deprecated for "${methodName}". Use "${aliasKey}" instead`));
            if (!(aliasKey in options)) {
              options[aliasKey] = options[key];
            }
            delete options[key];
          }
        });
        return method(options);
      };
      Object.keys(method).forEach((key) => {
        patchedMethod[key] = method[key];
      });
      return patchedMethod;
    }
    function restEndpointMethods(octokit) {
      octokit.registerEndpoints = registerEndpoints.bind(null, octokit);
      registerEndpoints(octokit, endpointsByScope);
      [["gitdata", "git"], ["authorization", "oauthAuthorizations"], ["pullRequests", "pulls"]].forEach(([deprecatedScope, scope]) => {
        Object.defineProperty(octokit, deprecatedScope, {
          get() {
            octokit.log.warn(new deprecation.Deprecation(`[@octokit/plugin-rest-endpoint-methods] "octokit.${deprecatedScope}.*" methods are deprecated, use "octokit.${scope}.*" instead`));
            return octokit[scope];
          }
        });
      });
      return {};
    }
    restEndpointMethods.VERSION = VERSION;
    exports2.restEndpointMethods = restEndpointMethods;
  }
});

// node_modules/macos-release/index.js
var require_macos_release = __commonJS({
  "node_modules/macos-release/index.js"(exports2, module2) {
    "use strict";
    var os2 = require("os");
    var nameMap = new Map([
      [21, ["Monterey", "12"]],
      [20, ["Big Sur", "11"]],
      [19, ["Catalina", "10.15"]],
      [18, ["Mojave", "10.14"]],
      [17, ["High Sierra", "10.13"]],
      [16, ["Sierra", "10.12"]],
      [15, ["El Capitan", "10.11"]],
      [14, ["Yosemite", "10.10"]],
      [13, ["Mavericks", "10.9"]],
      [12, ["Mountain Lion", "10.8"]],
      [11, ["Lion", "10.7"]],
      [10, ["Snow Leopard", "10.6"]],
      [9, ["Leopard", "10.5"]],
      [8, ["Tiger", "10.4"]],
      [7, ["Panther", "10.3"]],
      [6, ["Jaguar", "10.2"]],
      [5, ["Puma", "10.1"]]
    ]);
    var macosRelease = (release) => {
      release = Number((release || os2.release()).split(".")[0]);
      const [name, version] = nameMap.get(release);
      return {
        name,
        version
      };
    };
    module2.exports = macosRelease;
    module2.exports.default = macosRelease;
  }
});

// node_modules/nice-try/src/index.js
var require_src = __commonJS({
  "node_modules/nice-try/src/index.js"(exports2, module2) {
    "use strict";
    module2.exports = function(fn) {
      try {
        return fn();
      } catch (e) {
      }
    };
  }
});

// node_modules/isexe/windows.js
var require_windows = __commonJS({
  "node_modules/isexe/windows.js"(exports2, module2) {
    module2.exports = isexe;
    isexe.sync = sync;
    var fs6 = require("fs");
    function checkPathExt(path7, options) {
      var pathext = options.pathExt !== void 0 ? options.pathExt : process.env.PATHEXT;
      if (!pathext) {
        return true;
      }
      pathext = pathext.split(";");
      if (pathext.indexOf("") !== -1) {
        return true;
      }
      for (var i = 0; i < pathext.length; i++) {
        var p = pathext[i].toLowerCase();
        if (p && path7.substr(-p.length).toLowerCase() === p) {
          return true;
        }
      }
      return false;
    }
    function checkStat(stat, path7, options) {
      if (!stat.isSymbolicLink() && !stat.isFile()) {
        return false;
      }
      return checkPathExt(path7, options);
    }
    function isexe(path7, options, cb) {
      fs6.stat(path7, function(er, stat) {
        cb(er, er ? false : checkStat(stat, path7, options));
      });
    }
    function sync(path7, options) {
      return checkStat(fs6.statSync(path7), path7, options);
    }
  }
});

// node_modules/isexe/mode.js
var require_mode = __commonJS({
  "node_modules/isexe/mode.js"(exports2, module2) {
    module2.exports = isexe;
    isexe.sync = sync;
    var fs6 = require("fs");
    function isexe(path7, options, cb) {
      fs6.stat(path7, function(er, stat) {
        cb(er, er ? false : checkStat(stat, options));
      });
    }
    function sync(path7, options) {
      return checkStat(fs6.statSync(path7), options);
    }
    function checkStat(stat, options) {
      return stat.isFile() && checkMode(stat, options);
    }
    function checkMode(stat, options) {
      var mod = stat.mode;
      var uid = stat.uid;
      var gid = stat.gid;
      var myUid = options.uid !== void 0 ? options.uid : process.getuid && process.getuid();
      var myGid = options.gid !== void 0 ? options.gid : process.getgid && process.getgid();
      var u = parseInt("100", 8);
      var g = parseInt("010", 8);
      var o = parseInt("001", 8);
      var ug = u | g;
      var ret = mod & o || mod & g && gid === myGid || mod & u && uid === myUid || mod & ug && myUid === 0;
      return ret;
    }
  }
});

// node_modules/isexe/index.js
var require_isexe = __commonJS({
  "node_modules/isexe/index.js"(exports2, module2) {
    var fs6 = require("fs");
    var core10;
    if (process.platform === "win32" || global.TESTING_WINDOWS) {
      core10 = require_windows();
    } else {
      core10 = require_mode();
    }
    module2.exports = isexe;
    isexe.sync = sync;
    function isexe(path7, options, cb) {
      if (typeof options === "function") {
        cb = options;
        options = {};
      }
      if (!cb) {
        if (typeof Promise !== "function") {
          throw new TypeError("callback not provided");
        }
        return new Promise(function(resolve2, reject) {
          isexe(path7, options || {}, function(er, is) {
            if (er) {
              reject(er);
            } else {
              resolve2(is);
            }
          });
        });
      }
      core10(path7, options || {}, function(er, is) {
        if (er) {
          if (er.code === "EACCES" || options && options.ignoreErrors) {
            er = null;
            is = false;
          }
        }
        cb(er, is);
      });
    }
    function sync(path7, options) {
      try {
        return core10.sync(path7, options || {});
      } catch (er) {
        if (options && options.ignoreErrors || er.code === "EACCES") {
          return false;
        } else {
          throw er;
        }
      }
    }
  }
});

// node_modules/which/which.js
var require_which = __commonJS({
  "node_modules/which/which.js"(exports2, module2) {
    module2.exports = which3;
    which3.sync = whichSync;
    var isWindows = process.platform === "win32" || process.env.OSTYPE === "cygwin" || process.env.OSTYPE === "msys";
    var path7 = require("path");
    var COLON = isWindows ? ";" : ":";
    var isexe = require_isexe();
    function getNotFoundError(cmd) {
      var er = new Error("not found: " + cmd);
      er.code = "ENOENT";
      return er;
    }
    function getPathInfo(cmd, opt) {
      var colon = opt.colon || COLON;
      var pathEnv = opt.path || process.env.PATH || "";
      var pathExt = [""];
      pathEnv = pathEnv.split(colon);
      var pathExtExe = "";
      if (isWindows) {
        pathEnv.unshift(process.cwd());
        pathExtExe = opt.pathExt || process.env.PATHEXT || ".EXE;.CMD;.BAT;.COM";
        pathExt = pathExtExe.split(colon);
        if (cmd.indexOf(".") !== -1 && pathExt[0] !== "")
          pathExt.unshift("");
      }
      if (cmd.match(/\//) || isWindows && cmd.match(/\\/))
        pathEnv = [""];
      return {
        env: pathEnv,
        ext: pathExt,
        extExe: pathExtExe
      };
    }
    function which3(cmd, opt, cb) {
      if (typeof opt === "function") {
        cb = opt;
        opt = {};
      }
      var info10 = getPathInfo(cmd, opt);
      var pathEnv = info10.env;
      var pathExt = info10.ext;
      var pathExtExe = info10.extExe;
      var found = [];
      (function F(i, l) {
        if (i === l) {
          if (opt.all && found.length)
            return cb(null, found);
          else
            return cb(getNotFoundError(cmd));
        }
        var pathPart = pathEnv[i];
        if (pathPart.charAt(0) === '"' && pathPart.slice(-1) === '"')
          pathPart = pathPart.slice(1, -1);
        var p = path7.join(pathPart, cmd);
        if (!pathPart && /^\.[\\\/]/.test(cmd)) {
          p = cmd.slice(0, 2) + p;
        }
        ;
        (function E(ii, ll) {
          if (ii === ll)
            return F(i + 1, l);
          var ext = pathExt[ii];
          isexe(p + ext, { pathExt: pathExtExe }, function(er, is) {
            if (!er && is) {
              if (opt.all)
                found.push(p + ext);
              else
                return cb(null, p + ext);
            }
            return E(ii + 1, ll);
          });
        })(0, pathExt.length);
      })(0, pathEnv.length);
    }
    function whichSync(cmd, opt) {
      opt = opt || {};
      var info10 = getPathInfo(cmd, opt);
      var pathEnv = info10.env;
      var pathExt = info10.ext;
      var pathExtExe = info10.extExe;
      var found = [];
      for (var i = 0, l = pathEnv.length; i < l; i++) {
        var pathPart = pathEnv[i];
        if (pathPart.charAt(0) === '"' && pathPart.slice(-1) === '"')
          pathPart = pathPart.slice(1, -1);
        var p = path7.join(pathPart, cmd);
        if (!pathPart && /^\.[\\\/]/.test(cmd)) {
          p = cmd.slice(0, 2) + p;
        }
        for (var j = 0, ll = pathExt.length; j < ll; j++) {
          var cur = p + pathExt[j];
          var is;
          try {
            is = isexe.sync(cur, { pathExt: pathExtExe });
            if (is) {
              if (opt.all)
                found.push(cur);
              else
                return cur;
            }
          } catch (ex) {
          }
        }
      }
      if (opt.all && found.length)
        return found;
      if (opt.nothrow)
        return null;
      throw getNotFoundError(cmd);
    }
  }
});

// node_modules/path-key/index.js
var require_path_key = __commonJS({
  "node_modules/path-key/index.js"(exports2, module2) {
    "use strict";
    module2.exports = (opts) => {
      opts = opts || {};
      const env = opts.env || process.env;
      const platform = opts.platform || process.platform;
      if (platform !== "win32") {
        return "PATH";
      }
      return Object.keys(env).find((x) => x.toUpperCase() === "PATH") || "Path";
    };
  }
});

// node_modules/cross-spawn/lib/util/resolveCommand.js
var require_resolveCommand = __commonJS({
  "node_modules/cross-spawn/lib/util/resolveCommand.js"(exports2, module2) {
    "use strict";
    var path7 = require("path");
    var which3 = require_which();
    var pathKey = require_path_key()();
    function resolveCommandAttempt(parsed, withoutPathExt) {
      const cwd = process.cwd();
      const hasCustomCwd = parsed.options.cwd != null;
      if (hasCustomCwd) {
        try {
          process.chdir(parsed.options.cwd);
        } catch (err) {
        }
      }
      let resolved;
      try {
        resolved = which3.sync(parsed.command, {
          path: (parsed.options.env || process.env)[pathKey],
          pathExt: withoutPathExt ? path7.delimiter : void 0
        });
      } catch (e) {
      } finally {
        process.chdir(cwd);
      }
      if (resolved) {
        resolved = path7.resolve(hasCustomCwd ? parsed.options.cwd : "", resolved);
      }
      return resolved;
    }
    function resolveCommand(parsed) {
      return resolveCommandAttempt(parsed) || resolveCommandAttempt(parsed, true);
    }
    module2.exports = resolveCommand;
  }
});

// node_modules/cross-spawn/lib/util/escape.js
var require_escape = __commonJS({
  "node_modules/cross-spawn/lib/util/escape.js"(exports2, module2) {
    "use strict";
    var metaCharsRegExp = /([()\][%!^"`<>&|;, *?])/g;
    function escapeCommand(arg) {
      arg = arg.replace(metaCharsRegExp, "^$1");
      return arg;
    }
    function escapeArgument(arg, doubleEscapeMetaChars) {
      arg = `${arg}`;
      arg = arg.replace(/(\\*)"/g, '$1$1\\"');
      arg = arg.replace(/(\\*)$/, "$1$1");
      arg = `"${arg}"`;
      arg = arg.replace(metaCharsRegExp, "^$1");
      if (doubleEscapeMetaChars) {
        arg = arg.replace(metaCharsRegExp, "^$1");
      }
      return arg;
    }
    module2.exports.command = escapeCommand;
    module2.exports.argument = escapeArgument;
  }
});

// node_modules/shebang-regex/index.js
var require_shebang_regex = __commonJS({
  "node_modules/shebang-regex/index.js"(exports2, module2) {
    "use strict";
    module2.exports = /^#!.*/;
  }
});

// node_modules/shebang-command/index.js
var require_shebang_command = __commonJS({
  "node_modules/shebang-command/index.js"(exports2, module2) {
    "use strict";
    var shebangRegex = require_shebang_regex();
    module2.exports = function(str2) {
      var match = str2.match(shebangRegex);
      if (!match) {
        return null;
      }
      var arr = match[0].replace(/#! ?/, "").split(" ");
      var bin = arr[0].split("/").pop();
      var arg = arr[1];
      return bin === "env" ? arg : bin + (arg ? " " + arg : "");
    };
  }
});

// node_modules/cross-spawn/lib/util/readShebang.js
var require_readShebang = __commonJS({
  "node_modules/cross-spawn/lib/util/readShebang.js"(exports2, module2) {
    "use strict";
    var fs6 = require("fs");
    var shebangCommand = require_shebang_command();
    function readShebang(command) {
      const size = 150;
      let buffer;
      if (Buffer.alloc) {
        buffer = Buffer.alloc(size);
      } else {
        buffer = new Buffer(size);
        buffer.fill(0);
      }
      let fd;
      try {
        fd = fs6.openSync(command, "r");
        fs6.readSync(fd, buffer, 0, size, 0);
        fs6.closeSync(fd);
      } catch (e) {
      }
      return shebangCommand(buffer.toString());
    }
    module2.exports = readShebang;
  }
});

// node_modules/semver/semver.js
var require_semver = __commonJS({
  "node_modules/semver/semver.js"(exports2, module2) {
    exports2 = module2.exports = SemVer;
    var debug6;
    if (typeof process === "object" && process.env && process.env.NODE_DEBUG && /\bsemver\b/i.test(process.env.NODE_DEBUG)) {
      debug6 = function() {
        var args = Array.prototype.slice.call(arguments, 0);
        args.unshift("SEMVER");
        console.log.apply(console, args);
      };
    } else {
      debug6 = function() {
      };
    }
    exports2.SEMVER_SPEC_VERSION = "2.0.0";
    var MAX_LENGTH = 256;
    var MAX_SAFE_INTEGER = Number.MAX_SAFE_INTEGER || 9007199254740991;
    var MAX_SAFE_COMPONENT_LENGTH = 16;
    var re = exports2.re = [];
    var src = exports2.src = [];
    var R = 0;
    var NUMERICIDENTIFIER = R++;
    src[NUMERICIDENTIFIER] = "0|[1-9]\\d*";
    var NUMERICIDENTIFIERLOOSE = R++;
    src[NUMERICIDENTIFIERLOOSE] = "[0-9]+";
    var NONNUMERICIDENTIFIER = R++;
    src[NONNUMERICIDENTIFIER] = "\\d*[a-zA-Z-][a-zA-Z0-9-]*";
    var MAINVERSION = R++;
    src[MAINVERSION] = "(" + src[NUMERICIDENTIFIER] + ")\\.(" + src[NUMERICIDENTIFIER] + ")\\.(" + src[NUMERICIDENTIFIER] + ")";
    var MAINVERSIONLOOSE = R++;
    src[MAINVERSIONLOOSE] = "(" + src[NUMERICIDENTIFIERLOOSE] + ")\\.(" + src[NUMERICIDENTIFIERLOOSE] + ")\\.(" + src[NUMERICIDENTIFIERLOOSE] + ")";
    var PRERELEASEIDENTIFIER = R++;
    src[PRERELEASEIDENTIFIER] = "(?:" + src[NUMERICIDENTIFIER] + "|" + src[NONNUMERICIDENTIFIER] + ")";
    var PRERELEASEIDENTIFIERLOOSE = R++;
    src[PRERELEASEIDENTIFIERLOOSE] = "(?:" + src[NUMERICIDENTIFIERLOOSE] + "|" + src[NONNUMERICIDENTIFIER] + ")";
    var PRERELEASE = R++;
    src[PRERELEASE] = "(?:-(" + src[PRERELEASEIDENTIFIER] + "(?:\\." + src[PRERELEASEIDENTIFIER] + ")*))";
    var PRERELEASELOOSE = R++;
    src[PRERELEASELOOSE] = "(?:-?(" + src[PRERELEASEIDENTIFIERLOOSE] + "(?:\\." + src[PRERELEASEIDENTIFIERLOOSE] + ")*))";
    var BUILDIDENTIFIER = R++;
    src[BUILDIDENTIFIER] = "[0-9A-Za-z-]+";
    var BUILD = R++;
    src[BUILD] = "(?:\\+(" + src[BUILDIDENTIFIER] + "(?:\\." + src[BUILDIDENTIFIER] + ")*))";
    var FULL = R++;
    var FULLPLAIN = "v?" + src[MAINVERSION] + src[PRERELEASE] + "?" + src[BUILD] + "?";
    src[FULL] = "^" + FULLPLAIN + "$";
    var LOOSEPLAIN = "[v=\\s]*" + src[MAINVERSIONLOOSE] + src[PRERELEASELOOSE] + "?" + src[BUILD] + "?";
    var LOOSE = R++;
    src[LOOSE] = "^" + LOOSEPLAIN + "$";
    var GTLT = R++;
    src[GTLT] = "((?:<|>)?=?)";
    var XRANGEIDENTIFIERLOOSE = R++;
    src[XRANGEIDENTIFIERLOOSE] = src[NUMERICIDENTIFIERLOOSE] + "|x|X|\\*";
    var XRANGEIDENTIFIER = R++;
    src[XRANGEIDENTIFIER] = src[NUMERICIDENTIFIER] + "|x|X|\\*";
    var XRANGEPLAIN = R++;
    src[XRANGEPLAIN] = "[v=\\s]*(" + src[XRANGEIDENTIFIER] + ")(?:\\.(" + src[XRANGEIDENTIFIER] + ")(?:\\.(" + src[XRANGEIDENTIFIER] + ")(?:" + src[PRERELEASE] + ")?" + src[BUILD] + "?)?)?";
    var XRANGEPLAINLOOSE = R++;
    src[XRANGEPLAINLOOSE] = "[v=\\s]*(" + src[XRANGEIDENTIFIERLOOSE] + ")(?:\\.(" + src[XRANGEIDENTIFIERLOOSE] + ")(?:\\.(" + src[XRANGEIDENTIFIERLOOSE] + ")(?:" + src[PRERELEASELOOSE] + ")?" + src[BUILD] + "?)?)?";
    var XRANGE = R++;
    src[XRANGE] = "^" + src[GTLT] + "\\s*" + src[XRANGEPLAIN] + "$";
    var XRANGELOOSE = R++;
    src[XRANGELOOSE] = "^" + src[GTLT] + "\\s*" + src[XRANGEPLAINLOOSE] + "$";
    var COERCE = R++;
    src[COERCE] = "(?:^|[^\\d])(\\d{1," + MAX_SAFE_COMPONENT_LENGTH + "})(?:\\.(\\d{1," + MAX_SAFE_COMPONENT_LENGTH + "}))?(?:\\.(\\d{1," + MAX_SAFE_COMPONENT_LENGTH + "}))?(?:$|[^\\d])";
    var LONETILDE = R++;
    src[LONETILDE] = "(?:~>?)";
    var TILDETRIM = R++;
    src[TILDETRIM] = "(\\s*)" + src[LONETILDE] + "\\s+";
    re[TILDETRIM] = new RegExp(src[TILDETRIM], "g");
    var tildeTrimReplace = "$1~";
    var TILDE = R++;
    src[TILDE] = "^" + src[LONETILDE] + src[XRANGEPLAIN] + "$";
    var TILDELOOSE = R++;
    src[TILDELOOSE] = "^" + src[LONETILDE] + src[XRANGEPLAINLOOSE] + "$";
    var LONECARET = R++;
    src[LONECARET] = "(?:\\^)";
    var CARETTRIM = R++;
    src[CARETTRIM] = "(\\s*)" + src[LONECARET] + "\\s+";
    re[CARETTRIM] = new RegExp(src[CARETTRIM], "g");
    var caretTrimReplace = "$1^";
    var CARET = R++;
    src[CARET] = "^" + src[LONECARET] + src[XRANGEPLAIN] + "$";
    var CARETLOOSE = R++;
    src[CARETLOOSE] = "^" + src[LONECARET] + src[XRANGEPLAINLOOSE] + "$";
    var COMPARATORLOOSE = R++;
    src[COMPARATORLOOSE] = "^" + src[GTLT] + "\\s*(" + LOOSEPLAIN + ")$|^$";
    var COMPARATOR = R++;
    src[COMPARATOR] = "^" + src[GTLT] + "\\s*(" + FULLPLAIN + ")$|^$";
    var COMPARATORTRIM = R++;
    src[COMPARATORTRIM] = "(\\s*)" + src[GTLT] + "\\s*(" + LOOSEPLAIN + "|" + src[XRANGEPLAIN] + ")";
    re[COMPARATORTRIM] = new RegExp(src[COMPARATORTRIM], "g");
    var comparatorTrimReplace = "$1$2$3";
    var HYPHENRANGE = R++;
    src[HYPHENRANGE] = "^\\s*(" + src[XRANGEPLAIN] + ")\\s+-\\s+(" + src[XRANGEPLAIN] + ")\\s*$";
    var HYPHENRANGELOOSE = R++;
    src[HYPHENRANGELOOSE] = "^\\s*(" + src[XRANGEPLAINLOOSE] + ")\\s+-\\s+(" + src[XRANGEPLAINLOOSE] + ")\\s*$";
    var STAR = R++;
    src[STAR] = "(<|>)?=?\\s*\\*";
    for (i = 0; i < R; i++) {
      debug6(i, src[i]);
      if (!re[i]) {
        re[i] = new RegExp(src[i]);
      }
    }
    var i;
    exports2.parse = parse;
    function parse(version, options) {
      if (!options || typeof options !== "object") {
        options = {
          loose: !!options,
          includePrerelease: false
        };
      }
      if (version instanceof SemVer) {
        return version;
      }
      if (typeof version !== "string") {
        return null;
      }
      if (version.length > MAX_LENGTH) {
        return null;
      }
      var r = options.loose ? re[LOOSE] : re[FULL];
      if (!r.test(version)) {
        return null;
      }
      try {
        return new SemVer(version, options);
      } catch (er) {
        return null;
      }
    }
    exports2.valid = valid;
    function valid(version, options) {
      var v = parse(version, options);
      return v ? v.version : null;
    }
    exports2.clean = clean;
    function clean(version, options) {
      var s = parse(version.trim().replace(/^[=v]+/, ""), options);
      return s ? s.version : null;
    }
    exports2.SemVer = SemVer;
    function SemVer(version, options) {
      if (!options || typeof options !== "object") {
        options = {
          loose: !!options,
          includePrerelease: false
        };
      }
      if (version instanceof SemVer) {
        if (version.loose === options.loose) {
          return version;
        } else {
          version = version.version;
        }
      } else if (typeof version !== "string") {
        throw new TypeError("Invalid Version: " + version);
      }
      if (version.length > MAX_LENGTH) {
        throw new TypeError("version is longer than " + MAX_LENGTH + " characters");
      }
      if (!(this instanceof SemVer)) {
        return new SemVer(version, options);
      }
      debug6("SemVer", version, options);
      this.options = options;
      this.loose = !!options.loose;
      var m = version.trim().match(options.loose ? re[LOOSE] : re[FULL]);
      if (!m) {
        throw new TypeError("Invalid Version: " + version);
      }
      this.raw = version;
      this.major = +m[1];
      this.minor = +m[2];
      this.patch = +m[3];
      if (this.major > MAX_SAFE_INTEGER || this.major < 0) {
        throw new TypeError("Invalid major version");
      }
      if (this.minor > MAX_SAFE_INTEGER || this.minor < 0) {
        throw new TypeError("Invalid minor version");
      }
      if (this.patch > MAX_SAFE_INTEGER || this.patch < 0) {
        throw new TypeError("Invalid patch version");
      }
      if (!m[4]) {
        this.prerelease = [];
      } else {
        this.prerelease = m[4].split(".").map(function(id) {
          if (/^[0-9]+$/.test(id)) {
            var num = +id;
            if (num >= 0 && num < MAX_SAFE_INTEGER) {
              return num;
            }
          }
          return id;
        });
      }
      this.build = m[5] ? m[5].split(".") : [];
      this.format();
    }
    SemVer.prototype.format = function() {
      this.version = this.major + "." + this.minor + "." + this.patch;
      if (this.prerelease.length) {
        this.version += "-" + this.prerelease.join(".");
      }
      return this.version;
    };
    SemVer.prototype.toString = function() {
      return this.version;
    };
    SemVer.prototype.compare = function(other) {
      debug6("SemVer.compare", this.version, this.options, other);
      if (!(other instanceof SemVer)) {
        other = new SemVer(other, this.options);
      }
      return this.compareMain(other) || this.comparePre(other);
    };
    SemVer.prototype.compareMain = function(other) {
      if (!(other instanceof SemVer)) {
        other = new SemVer(other, this.options);
      }
      return compareIdentifiers(this.major, other.major) || compareIdentifiers(this.minor, other.minor) || compareIdentifiers(this.patch, other.patch);
    };
    SemVer.prototype.comparePre = function(other) {
      if (!(other instanceof SemVer)) {
        other = new SemVer(other, this.options);
      }
      if (this.prerelease.length && !other.prerelease.length) {
        return -1;
      } else if (!this.prerelease.length && other.prerelease.length) {
        return 1;
      } else if (!this.prerelease.length && !other.prerelease.length) {
        return 0;
      }
      var i2 = 0;
      do {
        var a = this.prerelease[i2];
        var b = other.prerelease[i2];
        debug6("prerelease compare", i2, a, b);
        if (a === void 0 && b === void 0) {
          return 0;
        } else if (b === void 0) {
          return 1;
        } else if (a === void 0) {
          return -1;
        } else if (a === b) {
          continue;
        } else {
          return compareIdentifiers(a, b);
        }
      } while (++i2);
    };
    SemVer.prototype.inc = function(release, identifier) {
      switch (release) {
        case "premajor":
          this.prerelease.length = 0;
          this.patch = 0;
          this.minor = 0;
          this.major++;
          this.inc("pre", identifier);
          break;
        case "preminor":
          this.prerelease.length = 0;
          this.patch = 0;
          this.minor++;
          this.inc("pre", identifier);
          break;
        case "prepatch":
          this.prerelease.length = 0;
          this.inc("patch", identifier);
          this.inc("pre", identifier);
          break;
        case "prerelease":
          if (this.prerelease.length === 0) {
            this.inc("patch", identifier);
          }
          this.inc("pre", identifier);
          break;
        case "major":
          if (this.minor !== 0 || this.patch !== 0 || this.prerelease.length === 0) {
            this.major++;
          }
          this.minor = 0;
          this.patch = 0;
          this.prerelease = [];
          break;
        case "minor":
          if (this.patch !== 0 || this.prerelease.length === 0) {
            this.minor++;
          }
          this.patch = 0;
          this.prerelease = [];
          break;
        case "patch":
          if (this.prerelease.length === 0) {
            this.patch++;
          }
          this.prerelease = [];
          break;
        case "pre":
          if (this.prerelease.length === 0) {
            this.prerelease = [0];
          } else {
            var i2 = this.prerelease.length;
            while (--i2 >= 0) {
              if (typeof this.prerelease[i2] === "number") {
                this.prerelease[i2]++;
                i2 = -2;
              }
            }
            if (i2 === -1) {
              this.prerelease.push(0);
            }
          }
          if (identifier) {
            if (this.prerelease[0] === identifier) {
              if (isNaN(this.prerelease[1])) {
                this.prerelease = [identifier, 0];
              }
            } else {
              this.prerelease = [identifier, 0];
            }
          }
          break;
        default:
          throw new Error("invalid increment argument: " + release);
      }
      this.format();
      this.raw = this.version;
      return this;
    };
    exports2.inc = inc;
    function inc(version, release, loose, identifier) {
      if (typeof loose === "string") {
        identifier = loose;
        loose = void 0;
      }
      try {
        return new SemVer(version, loose).inc(release, identifier).version;
      } catch (er) {
        return null;
      }
    }
    exports2.diff = diff;
    function diff(version1, version2) {
      if (eq(version1, version2)) {
        return null;
      } else {
        var v1 = parse(version1);
        var v2 = parse(version2);
        var prefix = "";
        if (v1.prerelease.length || v2.prerelease.length) {
          prefix = "pre";
          var defaultResult = "prerelease";
        }
        for (var key in v1) {
          if (key === "major" || key === "minor" || key === "patch") {
            if (v1[key] !== v2[key]) {
              return prefix + key;
            }
          }
        }
        return defaultResult;
      }
    }
    exports2.compareIdentifiers = compareIdentifiers;
    var numeric = /^[0-9]+$/;
    function compareIdentifiers(a, b) {
      var anum = numeric.test(a);
      var bnum = numeric.test(b);
      if (anum && bnum) {
        a = +a;
        b = +b;
      }
      return a === b ? 0 : anum && !bnum ? -1 : bnum && !anum ? 1 : a < b ? -1 : 1;
    }
    exports2.rcompareIdentifiers = rcompareIdentifiers;
    function rcompareIdentifiers(a, b) {
      return compareIdentifiers(b, a);
    }
    exports2.major = major;
    function major(a, loose) {
      return new SemVer(a, loose).major;
    }
    exports2.minor = minor;
    function minor(a, loose) {
      return new SemVer(a, loose).minor;
    }
    exports2.patch = patch;
    function patch(a, loose) {
      return new SemVer(a, loose).patch;
    }
    exports2.compare = compare;
    function compare(a, b, loose) {
      return new SemVer(a, loose).compare(new SemVer(b, loose));
    }
    exports2.compareLoose = compareLoose;
    function compareLoose(a, b) {
      return compare(a, b, true);
    }
    exports2.rcompare = rcompare;
    function rcompare(a, b, loose) {
      return compare(b, a, loose);
    }
    exports2.sort = sort;
    function sort(list, loose) {
      return list.sort(function(a, b) {
        return exports2.compare(a, b, loose);
      });
    }
    exports2.rsort = rsort;
    function rsort(list, loose) {
      return list.sort(function(a, b) {
        return exports2.rcompare(a, b, loose);
      });
    }
    exports2.gt = gt;
    function gt(a, b, loose) {
      return compare(a, b, loose) > 0;
    }
    exports2.lt = lt;
    function lt(a, b, loose) {
      return compare(a, b, loose) < 0;
    }
    exports2.eq = eq;
    function eq(a, b, loose) {
      return compare(a, b, loose) === 0;
    }
    exports2.neq = neq;
    function neq(a, b, loose) {
      return compare(a, b, loose) !== 0;
    }
    exports2.gte = gte;
    function gte(a, b, loose) {
      return compare(a, b, loose) >= 0;
    }
    exports2.lte = lte;
    function lte(a, b, loose) {
      return compare(a, b, loose) <= 0;
    }
    exports2.cmp = cmp;
    function cmp(a, op, b, loose) {
      switch (op) {
        case "===":
          if (typeof a === "object")
            a = a.version;
          if (typeof b === "object")
            b = b.version;
          return a === b;
        case "!==":
          if (typeof a === "object")
            a = a.version;
          if (typeof b === "object")
            b = b.version;
          return a !== b;
        case "":
        case "=":
        case "==":
          return eq(a, b, loose);
        case "!=":
          return neq(a, b, loose);
        case ">":
          return gt(a, b, loose);
        case ">=":
          return gte(a, b, loose);
        case "<":
          return lt(a, b, loose);
        case "<=":
          return lte(a, b, loose);
        default:
          throw new TypeError("Invalid operator: " + op);
      }
    }
    exports2.Comparator = Comparator;
    function Comparator(comp, options) {
      if (!options || typeof options !== "object") {
        options = {
          loose: !!options,
          includePrerelease: false
        };
      }
      if (comp instanceof Comparator) {
        if (comp.loose === !!options.loose) {
          return comp;
        } else {
          comp = comp.value;
        }
      }
      if (!(this instanceof Comparator)) {
        return new Comparator(comp, options);
      }
      debug6("comparator", comp, options);
      this.options = options;
      this.loose = !!options.loose;
      this.parse(comp);
      if (this.semver === ANY) {
        this.value = "";
      } else {
        this.value = this.operator + this.semver.version;
      }
      debug6("comp", this);
    }
    var ANY = {};
    Comparator.prototype.parse = function(comp) {
      var r = this.options.loose ? re[COMPARATORLOOSE] : re[COMPARATOR];
      var m = comp.match(r);
      if (!m) {
        throw new TypeError("Invalid comparator: " + comp);
      }
      this.operator = m[1];
      if (this.operator === "=") {
        this.operator = "";
      }
      if (!m[2]) {
        this.semver = ANY;
      } else {
        this.semver = new SemVer(m[2], this.options.loose);
      }
    };
    Comparator.prototype.toString = function() {
      return this.value;
    };
    Comparator.prototype.test = function(version) {
      debug6("Comparator.test", version, this.options.loose);
      if (this.semver === ANY) {
        return true;
      }
      if (typeof version === "string") {
        version = new SemVer(version, this.options);
      }
      return cmp(version, this.operator, this.semver, this.options);
    };
    Comparator.prototype.intersects = function(comp, options) {
      if (!(comp instanceof Comparator)) {
        throw new TypeError("a Comparator is required");
      }
      if (!options || typeof options !== "object") {
        options = {
          loose: !!options,
          includePrerelease: false
        };
      }
      var rangeTmp;
      if (this.operator === "") {
        rangeTmp = new Range(comp.value, options);
        return satisfies(this.value, rangeTmp, options);
      } else if (comp.operator === "") {
        rangeTmp = new Range(this.value, options);
        return satisfies(comp.semver, rangeTmp, options);
      }
      var sameDirectionIncreasing = (this.operator === ">=" || this.operator === ">") && (comp.operator === ">=" || comp.operator === ">");
      var sameDirectionDecreasing = (this.operator === "<=" || this.operator === "<") && (comp.operator === "<=" || comp.operator === "<");
      var sameSemVer = this.semver.version === comp.semver.version;
      var differentDirectionsInclusive = (this.operator === ">=" || this.operator === "<=") && (comp.operator === ">=" || comp.operator === "<=");
      var oppositeDirectionsLessThan = cmp(this.semver, "<", comp.semver, options) && ((this.operator === ">=" || this.operator === ">") && (comp.operator === "<=" || comp.operator === "<"));
      var oppositeDirectionsGreaterThan = cmp(this.semver, ">", comp.semver, options) && ((this.operator === "<=" || this.operator === "<") && (comp.operator === ">=" || comp.operator === ">"));
      return sameDirectionIncreasing || sameDirectionDecreasing || sameSemVer && differentDirectionsInclusive || oppositeDirectionsLessThan || oppositeDirectionsGreaterThan;
    };
    exports2.Range = Range;
    function Range(range, options) {
      if (!options || typeof options !== "object") {
        options = {
          loose: !!options,
          includePrerelease: false
        };
      }
      if (range instanceof Range) {
        if (range.loose === !!options.loose && range.includePrerelease === !!options.includePrerelease) {
          return range;
        } else {
          return new Range(range.raw, options);
        }
      }
      if (range instanceof Comparator) {
        return new Range(range.value, options);
      }
      if (!(this instanceof Range)) {
        return new Range(range, options);
      }
      this.options = options;
      this.loose = !!options.loose;
      this.includePrerelease = !!options.includePrerelease;
      this.raw = range;
      this.set = range.split(/\s*\|\|\s*/).map(function(range2) {
        return this.parseRange(range2.trim());
      }, this).filter(function(c) {
        return c.length;
      });
      if (!this.set.length) {
        throw new TypeError("Invalid SemVer Range: " + range);
      }
      this.format();
    }
    Range.prototype.format = function() {
      this.range = this.set.map(function(comps) {
        return comps.join(" ").trim();
      }).join("||").trim();
      return this.range;
    };
    Range.prototype.toString = function() {
      return this.range;
    };
    Range.prototype.parseRange = function(range) {
      var loose = this.options.loose;
      range = range.trim();
      var hr = loose ? re[HYPHENRANGELOOSE] : re[HYPHENRANGE];
      range = range.replace(hr, hyphenReplace);
      debug6("hyphen replace", range);
      range = range.replace(re[COMPARATORTRIM], comparatorTrimReplace);
      debug6("comparator trim", range, re[COMPARATORTRIM]);
      range = range.replace(re[TILDETRIM], tildeTrimReplace);
      range = range.replace(re[CARETTRIM], caretTrimReplace);
      range = range.split(/\s+/).join(" ");
      var compRe = loose ? re[COMPARATORLOOSE] : re[COMPARATOR];
      var set2 = range.split(" ").map(function(comp) {
        return parseComparator(comp, this.options);
      }, this).join(" ").split(/\s+/);
      if (this.options.loose) {
        set2 = set2.filter(function(comp) {
          return !!comp.match(compRe);
        });
      }
      set2 = set2.map(function(comp) {
        return new Comparator(comp, this.options);
      }, this);
      return set2;
    };
    Range.prototype.intersects = function(range, options) {
      if (!(range instanceof Range)) {
        throw new TypeError("a Range is required");
      }
      return this.set.some(function(thisComparators) {
        return thisComparators.every(function(thisComparator) {
          return range.set.some(function(rangeComparators) {
            return rangeComparators.every(function(rangeComparator) {
              return thisComparator.intersects(rangeComparator, options);
            });
          });
        });
      });
    };
    exports2.toComparators = toComparators;
    function toComparators(range, options) {
      return new Range(range, options).set.map(function(comp) {
        return comp.map(function(c) {
          return c.value;
        }).join(" ").trim().split(" ");
      });
    }
    function parseComparator(comp, options) {
      debug6("comp", comp, options);
      comp = replaceCarets(comp, options);
      debug6("caret", comp);
      comp = replaceTildes(comp, options);
      debug6("tildes", comp);
      comp = replaceXRanges(comp, options);
      debug6("xrange", comp);
      comp = replaceStars(comp, options);
      debug6("stars", comp);
      return comp;
    }
    function isX(id) {
      return !id || id.toLowerCase() === "x" || id === "*";
    }
    function replaceTildes(comp, options) {
      return comp.trim().split(/\s+/).map(function(comp2) {
        return replaceTilde(comp2, options);
      }).join(" ");
    }
    function replaceTilde(comp, options) {
      var r = options.loose ? re[TILDELOOSE] : re[TILDE];
      return comp.replace(r, function(_, M, m, p, pr) {
        debug6("tilde", comp, _, M, m, p, pr);
        var ret;
        if (isX(M)) {
          ret = "";
        } else if (isX(m)) {
          ret = ">=" + M + ".0.0 <" + (+M + 1) + ".0.0";
        } else if (isX(p)) {
          ret = ">=" + M + "." + m + ".0 <" + M + "." + (+m + 1) + ".0";
        } else if (pr) {
          debug6("replaceTilde pr", pr);
          ret = ">=" + M + "." + m + "." + p + "-" + pr + " <" + M + "." + (+m + 1) + ".0";
        } else {
          ret = ">=" + M + "." + m + "." + p + " <" + M + "." + (+m + 1) + ".0";
        }
        debug6("tilde return", ret);
        return ret;
      });
    }
    function replaceCarets(comp, options) {
      return comp.trim().split(/\s+/).map(function(comp2) {
        return replaceCaret(comp2, options);
      }).join(" ");
    }
    function replaceCaret(comp, options) {
      debug6("caret", comp, options);
      var r = options.loose ? re[CARETLOOSE] : re[CARET];
      return comp.replace(r, function(_, M, m, p, pr) {
        debug6("caret", comp, _, M, m, p, pr);
        var ret;
        if (isX(M)) {
          ret = "";
        } else if (isX(m)) {
          ret = ">=" + M + ".0.0 <" + (+M + 1) + ".0.0";
        } else if (isX(p)) {
          if (M === "0") {
            ret = ">=" + M + "." + m + ".0 <" + M + "." + (+m + 1) + ".0";
          } else {
            ret = ">=" + M + "." + m + ".0 <" + (+M + 1) + ".0.0";
          }
        } else if (pr) {
          debug6("replaceCaret pr", pr);
          if (M === "0") {
            if (m === "0") {
              ret = ">=" + M + "." + m + "." + p + "-" + pr + " <" + M + "." + m + "." + (+p + 1);
            } else {
              ret = ">=" + M + "." + m + "." + p + "-" + pr + " <" + M + "." + (+m + 1) + ".0";
            }
          } else {
            ret = ">=" + M + "." + m + "." + p + "-" + pr + " <" + (+M + 1) + ".0.0";
          }
        } else {
          debug6("no pr");
          if (M === "0") {
            if (m === "0") {
              ret = ">=" + M + "." + m + "." + p + " <" + M + "." + m + "." + (+p + 1);
            } else {
              ret = ">=" + M + "." + m + "." + p + " <" + M + "." + (+m + 1) + ".0";
            }
          } else {
            ret = ">=" + M + "." + m + "." + p + " <" + (+M + 1) + ".0.0";
          }
        }
        debug6("caret return", ret);
        return ret;
      });
    }
    function replaceXRanges(comp, options) {
      debug6("replaceXRanges", comp, options);
      return comp.split(/\s+/).map(function(comp2) {
        return replaceXRange(comp2, options);
      }).join(" ");
    }
    function replaceXRange(comp, options) {
      comp = comp.trim();
      var r = options.loose ? re[XRANGELOOSE] : re[XRANGE];
      return comp.replace(r, function(ret, gtlt, M, m, p, pr) {
        debug6("xRange", comp, ret, gtlt, M, m, p, pr);
        var xM = isX(M);
        var xm = xM || isX(m);
        var xp = xm || isX(p);
        var anyX = xp;
        if (gtlt === "=" && anyX) {
          gtlt = "";
        }
        if (xM) {
          if (gtlt === ">" || gtlt === "<") {
            ret = "<0.0.0";
          } else {
            ret = "*";
          }
        } else if (gtlt && anyX) {
          if (xm) {
            m = 0;
          }
          p = 0;
          if (gtlt === ">") {
            gtlt = ">=";
            if (xm) {
              M = +M + 1;
              m = 0;
              p = 0;
            } else {
              m = +m + 1;
              p = 0;
            }
          } else if (gtlt === "<=") {
            gtlt = "<";
            if (xm) {
              M = +M + 1;
            } else {
              m = +m + 1;
            }
          }
          ret = gtlt + M + "." + m + "." + p;
        } else if (xm) {
          ret = ">=" + M + ".0.0 <" + (+M + 1) + ".0.0";
        } else if (xp) {
          ret = ">=" + M + "." + m + ".0 <" + M + "." + (+m + 1) + ".0";
        }
        debug6("xRange return", ret);
        return ret;
      });
    }
    function replaceStars(comp, options) {
      debug6("replaceStars", comp, options);
      return comp.trim().replace(re[STAR], "");
    }
    function hyphenReplace($0, from, fM, fm, fp, fpr, fb, to, tM, tm, tp, tpr, tb) {
      if (isX(fM)) {
        from = "";
      } else if (isX(fm)) {
        from = ">=" + fM + ".0.0";
      } else if (isX(fp)) {
        from = ">=" + fM + "." + fm + ".0";
      } else {
        from = ">=" + from;
      }
      if (isX(tM)) {
        to = "";
      } else if (isX(tm)) {
        to = "<" + (+tM + 1) + ".0.0";
      } else if (isX(tp)) {
        to = "<" + tM + "." + (+tm + 1) + ".0";
      } else if (tpr) {
        to = "<=" + tM + "." + tm + "." + tp + "-" + tpr;
      } else {
        to = "<=" + to;
      }
      return (from + " " + to).trim();
    }
    Range.prototype.test = function(version) {
      if (!version) {
        return false;
      }
      if (typeof version === "string") {
        version = new SemVer(version, this.options);
      }
      for (var i2 = 0; i2 < this.set.length; i2++) {
        if (testSet(this.set[i2], version, this.options)) {
          return true;
        }
      }
      return false;
    };
    function testSet(set2, version, options) {
      for (var i2 = 0; i2 < set2.length; i2++) {
        if (!set2[i2].test(version)) {
          return false;
        }
      }
      if (version.prerelease.length && !options.includePrerelease) {
        for (i2 = 0; i2 < set2.length; i2++) {
          debug6(set2[i2].semver);
          if (set2[i2].semver === ANY) {
            continue;
          }
          if (set2[i2].semver.prerelease.length > 0) {
            var allowed = set2[i2].semver;
            if (allowed.major === version.major && allowed.minor === version.minor && allowed.patch === version.patch) {
              return true;
            }
          }
        }
        return false;
      }
      return true;
    }
    exports2.satisfies = satisfies;
    function satisfies(version, range, options) {
      try {
        range = new Range(range, options);
      } catch (er) {
        return false;
      }
      return range.test(version);
    }
    exports2.maxSatisfying = maxSatisfying;
    function maxSatisfying(versions, range, options) {
      var max = null;
      var maxSV = null;
      try {
        var rangeObj = new Range(range, options);
      } catch (er) {
        return null;
      }
      versions.forEach(function(v) {
        if (rangeObj.test(v)) {
          if (!max || maxSV.compare(v) === -1) {
            max = v;
            maxSV = new SemVer(max, options);
          }
        }
      });
      return max;
    }
    exports2.minSatisfying = minSatisfying;
    function minSatisfying(versions, range, options) {
      var min = null;
      var minSV = null;
      try {
        var rangeObj = new Range(range, options);
      } catch (er) {
        return null;
      }
      versions.forEach(function(v) {
        if (rangeObj.test(v)) {
          if (!min || minSV.compare(v) === 1) {
            min = v;
            minSV = new SemVer(min, options);
          }
        }
      });
      return min;
    }
    exports2.minVersion = minVersion;
    function minVersion(range, loose) {
      range = new Range(range, loose);
      var minver = new SemVer("0.0.0");
      if (range.test(minver)) {
        return minver;
      }
      minver = new SemVer("0.0.0-0");
      if (range.test(minver)) {
        return minver;
      }
      minver = null;
      for (var i2 = 0; i2 < range.set.length; ++i2) {
        var comparators = range.set[i2];
        comparators.forEach(function(comparator) {
          var compver = new SemVer(comparator.semver.version);
          switch (comparator.operator) {
            case ">":
              if (compver.prerelease.length === 0) {
                compver.patch++;
              } else {
                compver.prerelease.push(0);
              }
              compver.raw = compver.format();
            case "":
            case ">=":
              if (!minver || gt(minver, compver)) {
                minver = compver;
              }
              break;
            case "<":
            case "<=":
              break;
            default:
              throw new Error("Unexpected operation: " + comparator.operator);
          }
        });
      }
      if (minver && range.test(minver)) {
        return minver;
      }
      return null;
    }
    exports2.validRange = validRange;
    function validRange(range, options) {
      try {
        return new Range(range, options).range || "*";
      } catch (er) {
        return null;
      }
    }
    exports2.ltr = ltr;
    function ltr(version, range, options) {
      return outside(version, range, "<", options);
    }
    exports2.gtr = gtr;
    function gtr(version, range, options) {
      return outside(version, range, ">", options);
    }
    exports2.outside = outside;
    function outside(version, range, hilo, options) {
      version = new SemVer(version, options);
      range = new Range(range, options);
      var gtfn, ltefn, ltfn, comp, ecomp;
      switch (hilo) {
        case ">":
          gtfn = gt;
          ltefn = lte;
          ltfn = lt;
          comp = ">";
          ecomp = ">=";
          break;
        case "<":
          gtfn = lt;
          ltefn = gte;
          ltfn = gt;
          comp = "<";
          ecomp = "<=";
          break;
        default:
          throw new TypeError('Must provide a hilo val of "<" or ">"');
      }
      if (satisfies(version, range, options)) {
        return false;
      }
      for (var i2 = 0; i2 < range.set.length; ++i2) {
        var comparators = range.set[i2];
        var high = null;
        var low = null;
        comparators.forEach(function(comparator) {
          if (comparator.semver === ANY) {
            comparator = new Comparator(">=0.0.0");
          }
          high = high || comparator;
          low = low || comparator;
          if (gtfn(comparator.semver, high.semver, options)) {
            high = comparator;
          } else if (ltfn(comparator.semver, low.semver, options)) {
            low = comparator;
          }
        });
        if (high.operator === comp || high.operator === ecomp) {
          return false;
        }
        if ((!low.operator || low.operator === comp) && ltefn(version, low.semver)) {
          return false;
        } else if (low.operator === ecomp && ltfn(version, low.semver)) {
          return false;
        }
      }
      return true;
    }
    exports2.prerelease = prerelease;
    function prerelease(version, options) {
      var parsed = parse(version, options);
      return parsed && parsed.prerelease.length ? parsed.prerelease : null;
    }
    exports2.intersects = intersects;
    function intersects(r1, r2, options) {
      r1 = new Range(r1, options);
      r2 = new Range(r2, options);
      return r1.intersects(r2);
    }
    exports2.coerce = coerce;
    function coerce(version) {
      if (version instanceof SemVer) {
        return version;
      }
      if (typeof version !== "string") {
        return null;
      }
      var match = version.match(re[COERCE]);
      if (match == null) {
        return null;
      }
      return parse(match[1] + "." + (match[2] || "0") + "." + (match[3] || "0"));
    }
  }
});

// node_modules/cross-spawn/lib/parse.js
var require_parse = __commonJS({
  "node_modules/cross-spawn/lib/parse.js"(exports2, module2) {
    "use strict";
    var path7 = require("path");
    var niceTry = require_src();
    var resolveCommand = require_resolveCommand();
    var escape2 = require_escape();
    var readShebang = require_readShebang();
    var semver = require_semver();
    var isWin = process.platform === "win32";
    var isExecutableRegExp = /\.(?:com|exe)$/i;
    var isCmdShimRegExp = /node_modules[\\/].bin[\\/][^\\/]+\.cmd$/i;
    var supportsShellOption = niceTry(() => semver.satisfies(process.version, "^4.8.0 || ^5.7.0 || >= 6.0.0", true)) || false;
    function detectShebang(parsed) {
      parsed.file = resolveCommand(parsed);
      const shebang = parsed.file && readShebang(parsed.file);
      if (shebang) {
        parsed.args.unshift(parsed.file);
        parsed.command = shebang;
        return resolveCommand(parsed);
      }
      return parsed.file;
    }
    function parseNonShell(parsed) {
      if (!isWin) {
        return parsed;
      }
      const commandFile = detectShebang(parsed);
      const needsShell = !isExecutableRegExp.test(commandFile);
      if (parsed.options.forceShell || needsShell) {
        const needsDoubleEscapeMetaChars = isCmdShimRegExp.test(commandFile);
        parsed.command = path7.normalize(parsed.command);
        parsed.command = escape2.command(parsed.command);
        parsed.args = parsed.args.map((arg) => escape2.argument(arg, needsDoubleEscapeMetaChars));
        const shellCommand = [parsed.command].concat(parsed.args).join(" ");
        parsed.args = ["/d", "/s", "/c", `"${shellCommand}"`];
        parsed.command = process.env.comspec || "cmd.exe";
        parsed.options.windowsVerbatimArguments = true;
      }
      return parsed;
    }
    function parseShell(parsed) {
      if (supportsShellOption) {
        return parsed;
      }
      const shellCommand = [parsed.command].concat(parsed.args).join(" ");
      if (isWin) {
        parsed.command = typeof parsed.options.shell === "string" ? parsed.options.shell : process.env.comspec || "cmd.exe";
        parsed.args = ["/d", "/s", "/c", `"${shellCommand}"`];
        parsed.options.windowsVerbatimArguments = true;
      } else {
        if (typeof parsed.options.shell === "string") {
          parsed.command = parsed.options.shell;
        } else if (process.platform === "android") {
          parsed.command = "/system/bin/sh";
        } else {
          parsed.command = "/bin/sh";
        }
        parsed.args = ["-c", shellCommand];
      }
      return parsed;
    }
    function parse(command, args, options) {
      if (args && !Array.isArray(args)) {
        options = args;
        args = null;
      }
      args = args ? args.slice(0) : [];
      options = Object.assign({}, options);
      const parsed = {
        command,
        args,
        options,
        file: void 0,
        original: {
          command,
          args
        }
      };
      return options.shell ? parseShell(parsed) : parseNonShell(parsed);
    }
    module2.exports = parse;
  }
});

// node_modules/cross-spawn/lib/enoent.js
var require_enoent = __commonJS({
  "node_modules/cross-spawn/lib/enoent.js"(exports2, module2) {
    "use strict";
    var isWin = process.platform === "win32";
    function notFoundError(original, syscall) {
      return Object.assign(new Error(`${syscall} ${original.command} ENOENT`), {
        code: "ENOENT",
        errno: "ENOENT",
        syscall: `${syscall} ${original.command}`,
        path: original.command,
        spawnargs: original.args
      });
    }
    function hookChildProcess(cp3, parsed) {
      if (!isWin) {
        return;
      }
      const originalEmit = cp3.emit;
      cp3.emit = function(name, arg1) {
        if (name === "exit") {
          const err = verifyENOENT(arg1, parsed, "spawn");
          if (err) {
            return originalEmit.call(cp3, "error", err);
          }
        }
        return originalEmit.apply(cp3, arguments);
      };
    }
    function verifyENOENT(status, parsed) {
      if (isWin && status === 1 && !parsed.file) {
        return notFoundError(parsed.original, "spawn");
      }
      return null;
    }
    function verifyENOENTSync(status, parsed) {
      if (isWin && status === 1 && !parsed.file) {
        return notFoundError(parsed.original, "spawnSync");
      }
      return null;
    }
    module2.exports = {
      hookChildProcess,
      verifyENOENT,
      verifyENOENTSync,
      notFoundError
    };
  }
});

// node_modules/cross-spawn/index.js
var require_cross_spawn = __commonJS({
  "node_modules/cross-spawn/index.js"(exports2, module2) {
    "use strict";
    var cp3 = require("child_process");
    var parse = require_parse();
    var enoent = require_enoent();
    function spawn(command, args, options) {
      const parsed = parse(command, args, options);
      const spawned = cp3.spawn(parsed.command, parsed.args, parsed.options);
      enoent.hookChildProcess(spawned, parsed);
      return spawned;
    }
    function spawnSync(command, args, options) {
      const parsed = parse(command, args, options);
      const result = cp3.spawnSync(parsed.command, parsed.args, parsed.options);
      result.error = result.error || enoent.verifyENOENTSync(result.status, parsed);
      return result;
    }
    module2.exports = spawn;
    module2.exports.spawn = spawn;
    module2.exports.sync = spawnSync;
    module2.exports._parse = parse;
    module2.exports._enoent = enoent;
  }
});

// node_modules/strip-eof/index.js
var require_strip_eof = __commonJS({
  "node_modules/strip-eof/index.js"(exports2, module2) {
    "use strict";
    module2.exports = function(x) {
      var lf = typeof x === "string" ? "\n" : "\n".charCodeAt();
      var cr = typeof x === "string" ? "\r" : "\r".charCodeAt();
      if (x[x.length - 1] === lf) {
        x = x.slice(0, x.length - 1);
      }
      if (x[x.length - 1] === cr) {
        x = x.slice(0, x.length - 1);
      }
      return x;
    };
  }
});

// node_modules/npm-run-path/index.js
var require_npm_run_path = __commonJS({
  "node_modules/npm-run-path/index.js"(exports2, module2) {
    "use strict";
    var path7 = require("path");
    var pathKey = require_path_key();
    module2.exports = (opts) => {
      opts = Object.assign({
        cwd: process.cwd(),
        path: process.env[pathKey()]
      }, opts);
      let prev;
      let pth = path7.resolve(opts.cwd);
      const ret = [];
      while (prev !== pth) {
        ret.push(path7.join(pth, "node_modules/.bin"));
        prev = pth;
        pth = path7.resolve(pth, "..");
      }
      ret.push(path7.dirname(process.execPath));
      return ret.concat(opts.path).join(path7.delimiter);
    };
    module2.exports.env = (opts) => {
      opts = Object.assign({
        env: process.env
      }, opts);
      const env = Object.assign({}, opts.env);
      const path8 = pathKey({ env });
      opts.path = env[path8];
      env[path8] = module2.exports(opts);
      return env;
    };
  }
});

// node_modules/is-stream/index.js
var require_is_stream = __commonJS({
  "node_modules/is-stream/index.js"(exports2, module2) {
    "use strict";
    var isStream = module2.exports = function(stream) {
      return stream !== null && typeof stream === "object" && typeof stream.pipe === "function";
    };
    isStream.writable = function(stream) {
      return isStream(stream) && stream.writable !== false && typeof stream._write === "function" && typeof stream._writableState === "object";
    };
    isStream.readable = function(stream) {
      return isStream(stream) && stream.readable !== false && typeof stream._read === "function" && typeof stream._readableState === "object";
    };
    isStream.duplex = function(stream) {
      return isStream.writable(stream) && isStream.readable(stream);
    };
    isStream.transform = function(stream) {
      return isStream.duplex(stream) && typeof stream._transform === "function" && typeof stream._transformState === "object";
    };
  }
});

// node_modules/end-of-stream/index.js
var require_end_of_stream = __commonJS({
  "node_modules/end-of-stream/index.js"(exports2, module2) {
    var once = require_once();
    var noop = function() {
    };
    var isRequest = function(stream) {
      return stream.setHeader && typeof stream.abort === "function";
    };
    var isChildProcess = function(stream) {
      return stream.stdio && Array.isArray(stream.stdio) && stream.stdio.length === 3;
    };
    var eos = function(stream, opts, callback) {
      if (typeof opts === "function")
        return eos(stream, null, opts);
      if (!opts)
        opts = {};
      callback = once(callback || noop);
      var ws = stream._writableState;
      var rs = stream._readableState;
      var readable = opts.readable || opts.readable !== false && stream.readable;
      var writable = opts.writable || opts.writable !== false && stream.writable;
      var cancelled = false;
      var onlegacyfinish = function() {
        if (!stream.writable)
          onfinish();
      };
      var onfinish = function() {
        writable = false;
        if (!readable)
          callback.call(stream);
      };
      var onend = function() {
        readable = false;
        if (!writable)
          callback.call(stream);
      };
      var onexit = function(exitCode) {
        callback.call(stream, exitCode ? new Error("exited with error code: " + exitCode) : null);
      };
      var onerror = function(err) {
        callback.call(stream, err);
      };
      var onclose = function() {
        process.nextTick(onclosenexttick);
      };
      var onclosenexttick = function() {
        if (cancelled)
          return;
        if (readable && !(rs && (rs.ended && !rs.destroyed)))
          return callback.call(stream, new Error("premature close"));
        if (writable && !(ws && (ws.ended && !ws.destroyed)))
          return callback.call(stream, new Error("premature close"));
      };
      var onrequest = function() {
        stream.req.on("finish", onfinish);
      };
      if (isRequest(stream)) {
        stream.on("complete", onfinish);
        stream.on("abort", onclose);
        if (stream.req)
          onrequest();
        else
          stream.on("request", onrequest);
      } else if (writable && !ws) {
        stream.on("end", onlegacyfinish);
        stream.on("close", onlegacyfinish);
      }
      if (isChildProcess(stream))
        stream.on("exit", onexit);
      stream.on("end", onend);
      stream.on("finish", onfinish);
      if (opts.error !== false)
        stream.on("error", onerror);
      stream.on("close", onclose);
      return function() {
        cancelled = true;
        stream.removeListener("complete", onfinish);
        stream.removeListener("abort", onclose);
        stream.removeListener("request", onrequest);
        if (stream.req)
          stream.req.removeListener("finish", onfinish);
        stream.removeListener("end", onlegacyfinish);
        stream.removeListener("close", onlegacyfinish);
        stream.removeListener("finish", onfinish);
        stream.removeListener("exit", onexit);
        stream.removeListener("end", onend);
        stream.removeListener("error", onerror);
        stream.removeListener("close", onclose);
      };
    };
    module2.exports = eos;
  }
});

// node_modules/pump/index.js
var require_pump = __commonJS({
  "node_modules/pump/index.js"(exports2, module2) {
    var once = require_once();
    var eos = require_end_of_stream();
    var fs6 = require("fs");
    var noop = function() {
    };
    var ancient = /^v?\.0/.test(process.version);
    var isFn = function(fn) {
      return typeof fn === "function";
    };
    var isFS = function(stream) {
      if (!ancient)
        return false;
      if (!fs6)
        return false;
      return (stream instanceof (fs6.ReadStream || noop) || stream instanceof (fs6.WriteStream || noop)) && isFn(stream.close);
    };
    var isRequest = function(stream) {
      return stream.setHeader && isFn(stream.abort);
    };
    var destroyer = function(stream, reading, writing, callback) {
      callback = once(callback);
      var closed = false;
      stream.on("close", function() {
        closed = true;
      });
      eos(stream, { readable: reading, writable: writing }, function(err) {
        if (err)
          return callback(err);
        closed = true;
        callback();
      });
      var destroyed = false;
      return function(err) {
        if (closed)
          return;
        if (destroyed)
          return;
        destroyed = true;
        if (isFS(stream))
          return stream.close(noop);
        if (isRequest(stream))
          return stream.abort();
        if (isFn(stream.destroy))
          return stream.destroy();
        callback(err || new Error("stream was destroyed"));
      };
    };
    var call = function(fn) {
      fn();
    };
    var pipe = function(from, to) {
      return from.pipe(to);
    };
    var pump = function() {
      var streams = Array.prototype.slice.call(arguments);
      var callback = isFn(streams[streams.length - 1] || noop) && streams.pop() || noop;
      if (Array.isArray(streams[0]))
        streams = streams[0];
      if (streams.length < 2)
        throw new Error("pump requires two streams per minimum");
      var error;
      var destroys = streams.map(function(stream, i) {
        var reading = i < streams.length - 1;
        var writing = i > 0;
        return destroyer(stream, reading, writing, function(err) {
          if (!error)
            error = err;
          if (err)
            destroys.forEach(call);
          if (reading)
            return;
          destroys.forEach(call);
          callback(error);
        });
      });
      return streams.reduce(pipe);
    };
    module2.exports = pump;
  }
});

// node_modules/get-stream/buffer-stream.js
var require_buffer_stream = __commonJS({
  "node_modules/get-stream/buffer-stream.js"(exports2, module2) {
    "use strict";
    var { PassThrough } = require("stream");
    module2.exports = (options) => {
      options = Object.assign({}, options);
      const { array } = options;
      let { encoding } = options;
      const buffer = encoding === "buffer";
      let objectMode = false;
      if (array) {
        objectMode = !(encoding || buffer);
      } else {
        encoding = encoding || "utf8";
      }
      if (buffer) {
        encoding = null;
      }
      let len = 0;
      const ret = [];
      const stream = new PassThrough({ objectMode });
      if (encoding) {
        stream.setEncoding(encoding);
      }
      stream.on("data", (chunk) => {
        ret.push(chunk);
        if (objectMode) {
          len = ret.length;
        } else {
          len += chunk.length;
        }
      });
      stream.getBufferedValue = () => {
        if (array) {
          return ret;
        }
        return buffer ? Buffer.concat(ret, len) : ret.join("");
      };
      stream.getBufferedLength = () => len;
      return stream;
    };
  }
});

// node_modules/get-stream/index.js
var require_get_stream = __commonJS({
  "node_modules/get-stream/index.js"(exports2, module2) {
    "use strict";
    var pump = require_pump();
    var bufferStream = require_buffer_stream();
    var MaxBufferError = class extends Error {
      constructor() {
        super("maxBuffer exceeded");
        this.name = "MaxBufferError";
      }
    };
    function getStream(inputStream, options) {
      if (!inputStream) {
        return Promise.reject(new Error("Expected a stream"));
      }
      options = Object.assign({ maxBuffer: Infinity }, options);
      const { maxBuffer } = options;
      let stream;
      return new Promise((resolve2, reject) => {
        const rejectPromise = (error) => {
          if (error) {
            error.bufferedData = stream.getBufferedValue();
          }
          reject(error);
        };
        stream = pump(inputStream, bufferStream(options), (error) => {
          if (error) {
            rejectPromise(error);
            return;
          }
          resolve2();
        });
        stream.on("data", () => {
          if (stream.getBufferedLength() > maxBuffer) {
            rejectPromise(new MaxBufferError());
          }
        });
      }).then(() => stream.getBufferedValue());
    }
    module2.exports = getStream;
    module2.exports.buffer = (stream, options) => getStream(stream, Object.assign({}, options, { encoding: "buffer" }));
    module2.exports.array = (stream, options) => getStream(stream, Object.assign({}, options, { array: true }));
    module2.exports.MaxBufferError = MaxBufferError;
  }
});

// node_modules/p-finally/index.js
var require_p_finally = __commonJS({
  "node_modules/p-finally/index.js"(exports2, module2) {
    "use strict";
    module2.exports = (promise, onFinally) => {
      onFinally = onFinally || (() => {
      });
      return promise.then((val) => new Promise((resolve2) => {
        resolve2(onFinally());
      }).then(() => val), (err) => new Promise((resolve2) => {
        resolve2(onFinally());
      }).then(() => {
        throw err;
      }));
    };
  }
});

// node_modules/signal-exit/signals.js
var require_signals = __commonJS({
  "node_modules/signal-exit/signals.js"(exports2, module2) {
    module2.exports = [
      "SIGABRT",
      "SIGALRM",
      "SIGHUP",
      "SIGINT",
      "SIGTERM"
    ];
    if (process.platform !== "win32") {
      module2.exports.push("SIGVTALRM", "SIGXCPU", "SIGXFSZ", "SIGUSR2", "SIGTRAP", "SIGSYS", "SIGQUIT", "SIGIOT");
    }
    if (process.platform === "linux") {
      module2.exports.push("SIGIO", "SIGPOLL", "SIGPWR", "SIGSTKFLT", "SIGUNUSED");
    }
  }
});

// node_modules/signal-exit/index.js
var require_signal_exit = __commonJS({
  "node_modules/signal-exit/index.js"(exports2, module2) {
    var assert5 = require("assert");
    var signals = require_signals();
    var isWin = /^win/i.test(process.platform);
    var EE = require("events");
    if (typeof EE !== "function") {
      EE = EE.EventEmitter;
    }
    var emitter;
    if (process.__signal_exit_emitter__) {
      emitter = process.__signal_exit_emitter__;
    } else {
      emitter = process.__signal_exit_emitter__ = new EE();
      emitter.count = 0;
      emitter.emitted = {};
    }
    if (!emitter.infinite) {
      emitter.setMaxListeners(Infinity);
      emitter.infinite = true;
    }
    module2.exports = function(cb, opts) {
      assert5.equal(typeof cb, "function", "a callback must be provided for exit handler");
      if (loaded === false) {
        load2();
      }
      var ev = "exit";
      if (opts && opts.alwaysLast) {
        ev = "afterexit";
      }
      var remove = function() {
        emitter.removeListener(ev, cb);
        if (emitter.listeners("exit").length === 0 && emitter.listeners("afterexit").length === 0) {
          unload();
        }
      };
      emitter.on(ev, cb);
      return remove;
    };
    module2.exports.unload = unload;
    function unload() {
      if (!loaded) {
        return;
      }
      loaded = false;
      signals.forEach(function(sig) {
        try {
          process.removeListener(sig, sigListeners[sig]);
        } catch (er) {
        }
      });
      process.emit = originalProcessEmit;
      process.reallyExit = originalProcessReallyExit;
      emitter.count -= 1;
    }
    function emit(event, code, signal) {
      if (emitter.emitted[event]) {
        return;
      }
      emitter.emitted[event] = true;
      emitter.emit(event, code, signal);
    }
    var sigListeners = {};
    signals.forEach(function(sig) {
      sigListeners[sig] = function listener() {
        var listeners = process.listeners(sig);
        if (listeners.length === emitter.count) {
          unload();
          emit("exit", null, sig);
          emit("afterexit", null, sig);
          if (isWin && sig === "SIGHUP") {
            sig = "SIGINT";
          }
          process.kill(process.pid, sig);
        }
      };
    });
    module2.exports.signals = function() {
      return signals;
    };
    module2.exports.load = load2;
    var loaded = false;
    function load2() {
      if (loaded) {
        return;
      }
      loaded = true;
      emitter.count += 1;
      signals = signals.filter(function(sig) {
        try {
          process.on(sig, sigListeners[sig]);
          return true;
        } catch (er) {
          return false;
        }
      });
      process.emit = processEmit;
      process.reallyExit = processReallyExit;
    }
    var originalProcessReallyExit = process.reallyExit;
    function processReallyExit(code) {
      process.exitCode = code || 0;
      emit("exit", process.exitCode, null);
      emit("afterexit", process.exitCode, null);
      originalProcessReallyExit.call(process, process.exitCode);
    }
    var originalProcessEmit = process.emit;
    function processEmit(ev, arg) {
      if (ev === "exit") {
        if (arg !== void 0) {
          process.exitCode = arg;
        }
        var ret = originalProcessEmit.apply(this, arguments);
        emit("exit", process.exitCode, null);
        emit("afterexit", process.exitCode, null);
        return ret;
      } else {
        return originalProcessEmit.apply(this, arguments);
      }
    }
  }
});

// node_modules/execa/lib/errname.js
var require_errname = __commonJS({
  "node_modules/execa/lib/errname.js"(exports2, module2) {
    "use strict";
    var util = require("util");
    var uv;
    if (typeof util.getSystemErrorName === "function") {
      module2.exports = util.getSystemErrorName;
    } else {
      try {
        uv = process.binding("uv");
        if (typeof uv.errname !== "function") {
          throw new TypeError("uv.errname is not a function");
        }
      } catch (err) {
        console.error("execa/lib/errname: unable to establish process.binding('uv')", err);
        uv = null;
      }
      module2.exports = (code) => errname(uv, code);
    }
    module2.exports.__test__ = errname;
    function errname(uv2, code) {
      if (uv2) {
        return uv2.errname(code);
      }
      if (!(code < 0)) {
        throw new Error("err >= 0");
      }
      return `Unknown system error ${code}`;
    }
  }
});

// node_modules/execa/lib/stdio.js
var require_stdio = __commonJS({
  "node_modules/execa/lib/stdio.js"(exports2, module2) {
    "use strict";
    var alias = ["stdin", "stdout", "stderr"];
    var hasAlias = (opts) => alias.some((x) => Boolean(opts[x]));
    module2.exports = (opts) => {
      if (!opts) {
        return null;
      }
      if (opts.stdio && hasAlias(opts)) {
        throw new Error(`It's not possible to provide \`stdio\` in combination with one of ${alias.map((x) => `\`${x}\``).join(", ")}`);
      }
      if (typeof opts.stdio === "string") {
        return opts.stdio;
      }
      const stdio = opts.stdio || [];
      if (!Array.isArray(stdio)) {
        throw new TypeError(`Expected \`stdio\` to be of type \`string\` or \`Array\`, got \`${typeof stdio}\``);
      }
      const result = [];
      const len = Math.max(stdio.length, alias.length);
      for (let i = 0; i < len; i++) {
        let value = null;
        if (stdio[i] !== void 0) {
          value = stdio[i];
        } else if (opts[alias[i]] !== void 0) {
          value = opts[alias[i]];
        }
        result[i] = value;
      }
      return result;
    };
  }
});

// node_modules/execa/index.js
var require_execa = __commonJS({
  "node_modules/execa/index.js"(exports2, module2) {
    "use strict";
    var path7 = require("path");
    var childProcess = require("child_process");
    var crossSpawn = require_cross_spawn();
    var stripEof = require_strip_eof();
    var npmRunPath = require_npm_run_path();
    var isStream = require_is_stream();
    var _getStream = require_get_stream();
    var pFinally = require_p_finally();
    var onExit = require_signal_exit();
    var errname = require_errname();
    var stdio = require_stdio();
    var TEN_MEGABYTES = 1e3 * 1e3 * 10;
    function handleArgs(cmd, args, opts) {
      let parsed;
      opts = Object.assign({
        extendEnv: true,
        env: {}
      }, opts);
      if (opts.extendEnv) {
        opts.env = Object.assign({}, process.env, opts.env);
      }
      if (opts.__winShell === true) {
        delete opts.__winShell;
        parsed = {
          command: cmd,
          args,
          options: opts,
          file: cmd,
          original: {
            cmd,
            args
          }
        };
      } else {
        parsed = crossSpawn._parse(cmd, args, opts);
      }
      opts = Object.assign({
        maxBuffer: TEN_MEGABYTES,
        buffer: true,
        stripEof: true,
        preferLocal: true,
        localDir: parsed.options.cwd || process.cwd(),
        encoding: "utf8",
        reject: true,
        cleanup: true
      }, parsed.options);
      opts.stdio = stdio(opts);
      if (opts.preferLocal) {
        opts.env = npmRunPath.env(Object.assign({}, opts, { cwd: opts.localDir }));
      }
      if (opts.detached) {
        opts.cleanup = false;
      }
      if (process.platform === "win32" && path7.basename(parsed.command) === "cmd.exe") {
        parsed.args.unshift("/q");
      }
      return {
        cmd: parsed.command,
        args: parsed.args,
        opts,
        parsed
      };
    }
    function handleInput(spawned, input) {
      if (input === null || input === void 0) {
        return;
      }
      if (isStream(input)) {
        input.pipe(spawned.stdin);
      } else {
        spawned.stdin.end(input);
      }
    }
    function handleOutput(opts, val) {
      if (val && opts.stripEof) {
        val = stripEof(val);
      }
      return val;
    }
    function handleShell(fn, cmd, opts) {
      let file = "/bin/sh";
      let args = ["-c", cmd];
      opts = Object.assign({}, opts);
      if (process.platform === "win32") {
        opts.__winShell = true;
        file = process.env.comspec || "cmd.exe";
        args = ["/s", "/c", `"${cmd}"`];
        opts.windowsVerbatimArguments = true;
      }
      if (opts.shell) {
        file = opts.shell;
        delete opts.shell;
      }
      return fn(file, args, opts);
    }
    function getStream(process2, stream, { encoding, buffer, maxBuffer }) {
      if (!process2[stream]) {
        return null;
      }
      let ret;
      if (!buffer) {
        ret = new Promise((resolve2, reject) => {
          process2[stream].once("end", resolve2).once("error", reject);
        });
      } else if (encoding) {
        ret = _getStream(process2[stream], {
          encoding,
          maxBuffer
        });
      } else {
        ret = _getStream.buffer(process2[stream], { maxBuffer });
      }
      return ret.catch((err) => {
        err.stream = stream;
        err.message = `${stream} ${err.message}`;
        throw err;
      });
    }
    function makeError(result, options) {
      const { stdout, stderr } = result;
      let err = result.error;
      const { code, signal } = result;
      const { parsed, joinedCmd } = options;
      const timedOut = options.timedOut || false;
      if (!err) {
        let output = "";
        if (Array.isArray(parsed.opts.stdio)) {
          if (parsed.opts.stdio[2] !== "inherit") {
            output += output.length > 0 ? stderr : `
${stderr}`;
          }
          if (parsed.opts.stdio[1] !== "inherit") {
            output += `
${stdout}`;
          }
        } else if (parsed.opts.stdio !== "inherit") {
          output = `
${stderr}${stdout}`;
        }
        err = new Error(`Command failed: ${joinedCmd}${output}`);
        err.code = code < 0 ? errname(code) : code;
      }
      err.stdout = stdout;
      err.stderr = stderr;
      err.failed = true;
      err.signal = signal || null;
      err.cmd = joinedCmd;
      err.timedOut = timedOut;
      return err;
    }
    function joinCmd(cmd, args) {
      let joinedCmd = cmd;
      if (Array.isArray(args) && args.length > 0) {
        joinedCmd += " " + args.join(" ");
      }
      return joinedCmd;
    }
    module2.exports = (cmd, args, opts) => {
      const parsed = handleArgs(cmd, args, opts);
      const { encoding, buffer, maxBuffer } = parsed.opts;
      const joinedCmd = joinCmd(cmd, args);
      let spawned;
      try {
        spawned = childProcess.spawn(parsed.cmd, parsed.args, parsed.opts);
      } catch (err) {
        return Promise.reject(err);
      }
      let removeExitHandler;
      if (parsed.opts.cleanup) {
        removeExitHandler = onExit(() => {
          spawned.kill();
        });
      }
      let timeoutId = null;
      let timedOut = false;
      const cleanup = () => {
        if (timeoutId) {
          clearTimeout(timeoutId);
          timeoutId = null;
        }
        if (removeExitHandler) {
          removeExitHandler();
        }
      };
      if (parsed.opts.timeout > 0) {
        timeoutId = setTimeout(() => {
          timeoutId = null;
          timedOut = true;
          spawned.kill(parsed.opts.killSignal);
        }, parsed.opts.timeout);
      }
      const processDone = new Promise((resolve2) => {
        spawned.on("exit", (code, signal) => {
          cleanup();
          resolve2({ code, signal });
        });
        spawned.on("error", (err) => {
          cleanup();
          resolve2({ error: err });
        });
        if (spawned.stdin) {
          spawned.stdin.on("error", (err) => {
            cleanup();
            resolve2({ error: err });
          });
        }
      });
      function destroy() {
        if (spawned.stdout) {
          spawned.stdout.destroy();
        }
        if (spawned.stderr) {
          spawned.stderr.destroy();
        }
      }
      const handlePromise = () => pFinally(Promise.all([
        processDone,
        getStream(spawned, "stdout", { encoding, buffer, maxBuffer }),
        getStream(spawned, "stderr", { encoding, buffer, maxBuffer })
      ]).then((arr) => {
        const result = arr[0];
        result.stdout = arr[1];
        result.stderr = arr[2];
        if (result.error || result.code !== 0 || result.signal !== null) {
          const err = makeError(result, {
            joinedCmd,
            parsed,
            timedOut
          });
          err.killed = err.killed || spawned.killed;
          if (!parsed.opts.reject) {
            return err;
          }
          throw err;
        }
        return {
          stdout: handleOutput(parsed.opts, result.stdout),
          stderr: handleOutput(parsed.opts, result.stderr),
          code: 0,
          failed: false,
          killed: false,
          signal: null,
          cmd: joinedCmd,
          timedOut: false
        };
      }), destroy);
      crossSpawn._enoent.hookChildProcess(spawned, parsed.parsed);
      handleInput(spawned, parsed.opts.input);
      spawned.then = (onfulfilled, onrejected) => handlePromise().then(onfulfilled, onrejected);
      spawned.catch = (onrejected) => handlePromise().catch(onrejected);
      return spawned;
    };
    module2.exports.stdout = (...args) => module2.exports(...args).then((x) => x.stdout);
    module2.exports.stderr = (...args) => module2.exports(...args).then((x) => x.stderr);
    module2.exports.shell = (cmd, opts) => handleShell(module2.exports, cmd, opts);
    module2.exports.sync = (cmd, args, opts) => {
      const parsed = handleArgs(cmd, args, opts);
      const joinedCmd = joinCmd(cmd, args);
      if (isStream(parsed.opts.input)) {
        throw new TypeError("The `input` option cannot be a stream in sync mode");
      }
      const result = childProcess.spawnSync(parsed.cmd, parsed.args, parsed.opts);
      result.code = result.status;
      if (result.error || result.status !== 0 || result.signal !== null) {
        const err = makeError(result, {
          joinedCmd,
          parsed
        });
        if (!parsed.opts.reject) {
          return err;
        }
        throw err;
      }
      return {
        stdout: handleOutput(parsed.opts, result.stdout),
        stderr: handleOutput(parsed.opts, result.stderr),
        code: 0,
        failed: false,
        signal: null,
        cmd: joinedCmd,
        timedOut: false
      };
    };
    module2.exports.shellSync = (cmd, opts) => handleShell(module2.exports.sync, cmd, opts);
  }
});

// node_modules/windows-release/index.js
var require_windows_release = __commonJS({
  "node_modules/windows-release/index.js"(exports2, module2) {
    "use strict";
    var os2 = require("os");
    var execa = require_execa();
    var names = new Map([
      ["10.0", "10"],
      ["6.3", "8.1"],
      ["6.2", "8"],
      ["6.1", "7"],
      ["6.0", "Vista"],
      ["5.2", "Server 2003"],
      ["5.1", "XP"],
      ["5.0", "2000"],
      ["4.9", "ME"],
      ["4.1", "98"],
      ["4.0", "95"]
    ]);
    var windowsRelease = (release) => {
      const version = /\d+\.\d/.exec(release || os2.release());
      if (release && !version) {
        throw new Error("`release` argument doesn't match `n.n`");
      }
      const ver = (version || [])[0];
      if ((!release || release === os2.release()) && ["6.1", "6.2", "6.3", "10.0"].includes(ver)) {
        let stdout;
        try {
          stdout = execa.sync("wmic", ["os", "get", "Caption"]).stdout || "";
        } catch (_) {
          stdout = execa.sync("powershell", ["(Get-CimInstance -ClassName Win32_OperatingSystem).caption"]).stdout || "";
        }
        const year = (stdout.match(/2008|2012|2016|2019/) || [])[0];
        if (year) {
          return `Server ${year}`;
        }
      }
      return names.get(ver);
    };
    module2.exports = windowsRelease;
  }
});

// node_modules/os-name/index.js
var require_os_name = __commonJS({
  "node_modules/os-name/index.js"(exports2, module2) {
    "use strict";
    var os2 = require("os");
    var macosRelease = require_macos_release();
    var winRelease = require_windows_release();
    var osName = (platform, release) => {
      if (!platform && release) {
        throw new Error("You can't specify a `release` without specifying `platform`");
      }
      platform = platform || os2.platform();
      let id;
      if (platform === "darwin") {
        if (!release && os2.platform() === "darwin") {
          release = os2.release();
        }
        const prefix = release ? Number(release.split(".")[0]) > 15 ? "macOS" : "OS X" : "macOS";
        id = release ? macosRelease(release).name : "";
        return prefix + (id ? " " + id : "");
      }
      if (platform === "linux") {
        if (!release && os2.platform() === "linux") {
          release = os2.release();
        }
        id = release ? release.replace(/^(\d+\.\d+).*/, "$1") : "";
        return "Linux" + (id ? " " + id : "");
      }
      if (platform === "win32") {
        if (!release && os2.platform() === "win32") {
          release = os2.release();
        }
        id = release ? winRelease(release) : "";
        return "Windows" + (id ? " " + id : "");
      }
      return platform;
    };
    module2.exports = osName;
  }
});

// node_modules/@octokit/rest/node_modules/universal-user-agent/dist-node/index.js
var require_dist_node14 = __commonJS({
  "node_modules/@octokit/rest/node_modules/universal-user-agent/dist-node/index.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    function _interopDefault(ex) {
      return ex && typeof ex === "object" && "default" in ex ? ex["default"] : ex;
    }
    var osName = _interopDefault(require_os_name());
    function getUserAgent() {
      try {
        return `Node.js/${process.version.substr(1)} (${osName()}; ${process.arch})`;
      } catch (error) {
        if (/wmic os get Caption/.test(error.message)) {
          return "Windows <version undetectable>";
        }
        throw error;
      }
    }
    exports2.getUserAgent = getUserAgent;
  }
});

// node_modules/@octokit/rest/package.json
var require_package = __commonJS({
  "node_modules/@octokit/rest/package.json"(exports2, module2) {
    module2.exports = {
      name: "@octokit/rest",
      version: "16.43.2",
      publishConfig: {
        access: "public"
      },
      description: "GitHub REST API client for Node.js",
      keywords: [
        "octokit",
        "github",
        "rest",
        "api-client"
      ],
      author: "Gregor Martynus (https://github.com/gr2m)",
      contributors: [
        {
          name: "Mike de Boer",
          email: "info@mikedeboer.nl"
        },
        {
          name: "Fabian Jakobs",
          email: "fabian@c9.io"
        },
        {
          name: "Joe Gallo",
          email: "joe@brassafrax.com"
        },
        {
          name: "Gregor Martynus",
          url: "https://github.com/gr2m"
        }
      ],
      repository: "https://github.com/octokit/rest.js",
      dependencies: {
        "@octokit/auth-token": "^2.4.0",
        "@octokit/plugin-paginate-rest": "^1.1.1",
        "@octokit/plugin-request-log": "^1.0.0",
        "@octokit/plugin-rest-endpoint-methods": "2.4.0",
        "@octokit/request": "^5.2.0",
        "@octokit/request-error": "^1.0.2",
        "atob-lite": "^2.0.0",
        "before-after-hook": "^2.0.0",
        "btoa-lite": "^1.0.0",
        deprecation: "^2.0.0",
        "lodash.get": "^4.4.2",
        "lodash.set": "^4.3.2",
        "lodash.uniq": "^4.5.0",
        "octokit-pagination-methods": "^1.1.0",
        once: "^1.4.0",
        "universal-user-agent": "^4.0.0"
      },
      devDependencies: {
        "@gimenete/type-writer": "^0.1.3",
        "@octokit/auth": "^1.1.1",
        "@octokit/fixtures-server": "^5.0.6",
        "@octokit/graphql": "^4.2.0",
        "@types/node": "^13.1.0",
        bundlesize: "^0.18.0",
        chai: "^4.1.2",
        "compression-webpack-plugin": "^3.1.0",
        cypress: "^4.0.0",
        glob: "^7.1.2",
        "http-proxy-agent": "^4.0.0",
        "lodash.camelcase": "^4.3.0",
        "lodash.merge": "^4.6.1",
        "lodash.upperfirst": "^4.3.1",
        lolex: "^6.0.0",
        mkdirp: "^1.0.0",
        mocha: "^7.0.1",
        mustache: "^4.0.0",
        nock: "^11.3.3",
        "npm-run-all": "^4.1.2",
        nyc: "^15.0.0",
        prettier: "^1.14.2",
        proxy: "^1.0.0",
        "semantic-release": "^17.0.0",
        sinon: "^8.0.0",
        "sinon-chai": "^3.0.0",
        "sort-keys": "^4.0.0",
        "string-to-arraybuffer": "^1.0.0",
        "string-to-jsdoc-comment": "^1.0.0",
        typescript: "^3.3.1",
        webpack: "^4.0.0",
        "webpack-bundle-analyzer": "^3.0.0",
        "webpack-cli": "^3.0.0"
      },
      types: "index.d.ts",
      scripts: {
        coverage: "nyc report --reporter=html && open coverage/index.html",
        lint: "prettier --check '{lib,plugins,scripts,test}/**/*.{js,json,ts}' 'docs/*.{js,json}' 'docs/src/**/*' index.js README.md package.json",
        "lint:fix": "prettier --write '{lib,plugins,scripts,test}/**/*.{js,json,ts}' 'docs/*.{js,json}' 'docs/src/**/*' index.js README.md package.json",
        pretest: "npm run -s lint",
        test: 'nyc mocha test/mocha-node-setup.js "test/*/**/*-test.js"',
        "test:browser": "cypress run --browser chrome",
        build: "npm-run-all build:*",
        "build:ts": "npm run -s update-endpoints:typescript",
        "prebuild:browser": "mkdirp dist/",
        "build:browser": "npm-run-all build:browser:*",
        "build:browser:development": "webpack --mode development --entry . --output-library=Octokit --output=./dist/octokit-rest.js --profile --json > dist/bundle-stats.json",
        "build:browser:production": "webpack --mode production --entry . --plugin=compression-webpack-plugin --output-library=Octokit --output-path=./dist --output-filename=octokit-rest.min.js --devtool source-map",
        "generate-bundle-report": "webpack-bundle-analyzer dist/bundle-stats.json --mode=static --no-open --report dist/bundle-report.html",
        "update-endpoints": "npm-run-all update-endpoints:*",
        "update-endpoints:fetch-json": "node scripts/update-endpoints/fetch-json",
        "update-endpoints:typescript": "node scripts/update-endpoints/typescript",
        "prevalidate:ts": "npm run -s build:ts",
        "validate:ts": "tsc --target es6 --noImplicitAny index.d.ts",
        "postvalidate:ts": "tsc --noEmit --target es6 test/typescript-validate.ts",
        "start-fixtures-server": "octokit-fixtures-server"
      },
      license: "MIT",
      files: [
        "index.js",
        "index.d.ts",
        "lib",
        "plugins"
      ],
      nyc: {
        ignore: [
          "test"
        ]
      },
      release: {
        publish: [
          "@semantic-release/npm",
          {
            path: "@semantic-release/github",
            assets: [
              "dist/*",
              "!dist/*.map.gz"
            ]
          }
        ]
      },
      bundlesize: [
        {
          path: "./dist/octokit-rest.min.js.gz",
          maxSize: "33 kB"
        }
      ]
    };
  }
});

// node_modules/@octokit/rest/lib/parse-client-options.js
var require_parse_client_options = __commonJS({
  "node_modules/@octokit/rest/lib/parse-client-options.js"(exports2, module2) {
    module2.exports = parseOptions;
    var { Deprecation } = require_dist_node3();
    var { getUserAgent } = require_dist_node14();
    var once = require_once();
    var pkg = require_package();
    var deprecateOptionsTimeout = once((log, deprecation) => log.warn(deprecation));
    var deprecateOptionsAgent = once((log, deprecation) => log.warn(deprecation));
    var deprecateOptionsHeaders = once((log, deprecation) => log.warn(deprecation));
    function parseOptions(options, log, hook) {
      if (options.headers) {
        options.headers = Object.keys(options.headers).reduce((newObj, key) => {
          newObj[key.toLowerCase()] = options.headers[key];
          return newObj;
        }, {});
      }
      const clientDefaults = {
        headers: options.headers || {},
        request: options.request || {},
        mediaType: {
          previews: [],
          format: ""
        }
      };
      if (options.baseUrl) {
        clientDefaults.baseUrl = options.baseUrl;
      }
      if (options.userAgent) {
        clientDefaults.headers["user-agent"] = options.userAgent;
      }
      if (options.previews) {
        clientDefaults.mediaType.previews = options.previews;
      }
      if (options.timeZone) {
        clientDefaults.headers["time-zone"] = options.timeZone;
      }
      if (options.timeout) {
        deprecateOptionsTimeout(log, new Deprecation("[@octokit/rest] new Octokit({timeout}) is deprecated. Use {request: {timeout}} instead. See https://github.com/octokit/request.js#request"));
        clientDefaults.request.timeout = options.timeout;
      }
      if (options.agent) {
        deprecateOptionsAgent(log, new Deprecation("[@octokit/rest] new Octokit({agent}) is deprecated. Use {request: {agent}} instead. See https://github.com/octokit/request.js#request"));
        clientDefaults.request.agent = options.agent;
      }
      if (options.headers) {
        deprecateOptionsHeaders(log, new Deprecation("[@octokit/rest] new Octokit({headers}) is deprecated. Use {userAgent, previews} instead. See https://github.com/octokit/request.js#request"));
      }
      const userAgentOption = clientDefaults.headers["user-agent"];
      const defaultUserAgent = `octokit.js/${pkg.version} ${getUserAgent()}`;
      clientDefaults.headers["user-agent"] = [userAgentOption, defaultUserAgent].filter(Boolean).join(" ");
      clientDefaults.request.hook = hook.bind(null, "request");
      return clientDefaults;
    }
  }
});

// node_modules/@octokit/rest/lib/constructor.js
var require_constructor = __commonJS({
  "node_modules/@octokit/rest/lib/constructor.js"(exports2, module2) {
    module2.exports = Octokit;
    var { request } = require_dist_node5();
    var Hook = require_before_after_hook();
    var parseClientOptions = require_parse_client_options();
    function Octokit(plugins, options) {
      options = options || {};
      const hook = new Hook.Collection();
      const log = Object.assign({
        debug: () => {
        },
        info: () => {
        },
        warn: console.warn,
        error: console.error
      }, options && options.log);
      const api = {
        hook,
        log,
        request: request.defaults(parseClientOptions(options, log, hook))
      };
      plugins.forEach((pluginFunction) => pluginFunction(api, options));
      return api;
    }
  }
});

// node_modules/@octokit/rest/lib/register-plugin.js
var require_register_plugin = __commonJS({
  "node_modules/@octokit/rest/lib/register-plugin.js"(exports2, module2) {
    module2.exports = registerPlugin;
    var factory = require_factory();
    function registerPlugin(plugins, pluginFunction) {
      return factory(plugins.includes(pluginFunction) ? plugins : plugins.concat(pluginFunction));
    }
  }
});

// node_modules/@octokit/rest/lib/factory.js
var require_factory = __commonJS({
  "node_modules/@octokit/rest/lib/factory.js"(exports2, module2) {
    module2.exports = factory;
    var Octokit = require_constructor();
    var registerPlugin = require_register_plugin();
    function factory(plugins) {
      const Api = Octokit.bind(null, plugins || []);
      Api.plugin = registerPlugin.bind(null, plugins || []);
      return Api;
    }
  }
});

// node_modules/@octokit/rest/lib/core.js
var require_core3 = __commonJS({
  "node_modules/@octokit/rest/lib/core.js"(exports2, module2) {
    var factory = require_factory();
    module2.exports = factory();
  }
});

// node_modules/btoa-lite/btoa-node.js
var require_btoa_node = __commonJS({
  "node_modules/btoa-lite/btoa-node.js"(exports2, module2) {
    module2.exports = function btoa(str2) {
      return new Buffer(str2).toString("base64");
    };
  }
});

// node_modules/atob-lite/atob-node.js
var require_atob_node = __commonJS({
  "node_modules/atob-lite/atob-node.js"(exports2, module2) {
    module2.exports = function atob(str2) {
      return Buffer.from(str2, "base64").toString("binary");
    };
  }
});

// node_modules/@octokit/rest/plugins/authentication/with-authorization-prefix.js
var require_with_authorization_prefix = __commonJS({
  "node_modules/@octokit/rest/plugins/authentication/with-authorization-prefix.js"(exports2, module2) {
    module2.exports = withAuthorizationPrefix;
    var atob = require_atob_node();
    var REGEX_IS_BASIC_AUTH = /^[\w-]+:/;
    function withAuthorizationPrefix(authorization) {
      if (/^(basic|bearer|token) /i.test(authorization)) {
        return authorization;
      }
      try {
        if (REGEX_IS_BASIC_AUTH.test(atob(authorization))) {
          return `basic ${authorization}`;
        }
      } catch (error) {
      }
      if (authorization.split(/\./).length === 3) {
        return `bearer ${authorization}`;
      }
      return `token ${authorization}`;
    }
  }
});

// node_modules/@octokit/rest/plugins/authentication/before-request.js
var require_before_request = __commonJS({
  "node_modules/@octokit/rest/plugins/authentication/before-request.js"(exports2, module2) {
    module2.exports = authenticationBeforeRequest;
    var btoa = require_btoa_node();
    var withAuthorizationPrefix = require_with_authorization_prefix();
    function authenticationBeforeRequest(state, options) {
      if (typeof state.auth === "string") {
        options.headers.authorization = withAuthorizationPrefix(state.auth);
        return;
      }
      if (state.auth.username) {
        const hash = btoa(`${state.auth.username}:${state.auth.password}`);
        options.headers.authorization = `Basic ${hash}`;
        if (state.otp) {
          options.headers["x-github-otp"] = state.otp;
        }
        return;
      }
      if (state.auth.clientId) {
        if (/\/applications\/:?[\w_]+\/tokens\/:?[\w_]+($|\?)/.test(options.url)) {
          const hash = btoa(`${state.auth.clientId}:${state.auth.clientSecret}`);
          options.headers.authorization = `Basic ${hash}`;
          return;
        }
        options.url += options.url.indexOf("?") === -1 ? "?" : "&";
        options.url += `client_id=${state.auth.clientId}&client_secret=${state.auth.clientSecret}`;
        return;
      }
      return Promise.resolve().then(() => {
        return state.auth();
      }).then((authorization) => {
        options.headers.authorization = withAuthorizationPrefix(authorization);
      });
    }
  }
});

// node_modules/@octokit/rest/node_modules/@octokit/request-error/dist-node/index.js
var require_dist_node15 = __commonJS({
  "node_modules/@octokit/rest/node_modules/@octokit/request-error/dist-node/index.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    function _interopDefault(ex) {
      return ex && typeof ex === "object" && "default" in ex ? ex["default"] : ex;
    }
    var deprecation = require_dist_node3();
    var once = _interopDefault(require_once());
    var logOnce = once((deprecation2) => console.warn(deprecation2));
    var RequestError = class extends Error {
      constructor(message, statusCode, options) {
        super(message);
        if (Error.captureStackTrace) {
          Error.captureStackTrace(this, this.constructor);
        }
        this.name = "HttpError";
        this.status = statusCode;
        Object.defineProperty(this, "code", {
          get() {
            logOnce(new deprecation.Deprecation("[@octokit/request-error] `error.code` is deprecated, use `error.status`."));
            return statusCode;
          }
        });
        this.headers = options.headers || {};
        const requestCopy = Object.assign({}, options.request);
        if (options.request.headers.authorization) {
          requestCopy.headers = Object.assign({}, options.request.headers, {
            authorization: options.request.headers.authorization.replace(/ .*$/, " [REDACTED]")
          });
        }
        requestCopy.url = requestCopy.url.replace(/\bclient_secret=\w+/g, "client_secret=[REDACTED]").replace(/\baccess_token=\w+/g, "access_token=[REDACTED]");
        this.request = requestCopy;
      }
    };
    exports2.RequestError = RequestError;
  }
});

// node_modules/@octokit/rest/plugins/authentication/request-error.js
var require_request_error = __commonJS({
  "node_modules/@octokit/rest/plugins/authentication/request-error.js"(exports2, module2) {
    module2.exports = authenticationRequestError;
    var { RequestError } = require_dist_node15();
    function authenticationRequestError(state, error, options) {
      if (!error.headers)
        throw error;
      const otpRequired = /required/.test(error.headers["x-github-otp"] || "");
      if (error.status !== 401 || !otpRequired) {
        throw error;
      }
      if (error.status === 401 && otpRequired && error.request && error.request.headers["x-github-otp"]) {
        if (state.otp) {
          delete state.otp;
        } else {
          throw new RequestError("Invalid one-time password for two-factor authentication", 401, {
            headers: error.headers,
            request: options
          });
        }
      }
      if (typeof state.auth.on2fa !== "function") {
        throw new RequestError("2FA required, but options.on2fa is not a function. See https://github.com/octokit/rest.js#authentication", 401, {
          headers: error.headers,
          request: options
        });
      }
      return Promise.resolve().then(() => {
        return state.auth.on2fa();
      }).then((oneTimePassword) => {
        const newOptions = Object.assign(options, {
          headers: Object.assign(options.headers, {
            "x-github-otp": oneTimePassword
          })
        });
        return state.octokit.request(newOptions).then((response) => {
          state.otp = oneTimePassword;
          return response;
        });
      });
    }
  }
});

// node_modules/@octokit/rest/plugins/authentication/validate.js
var require_validate = __commonJS({
  "node_modules/@octokit/rest/plugins/authentication/validate.js"(exports2, module2) {
    module2.exports = validateAuth;
    function validateAuth(auth) {
      if (typeof auth === "string") {
        return;
      }
      if (typeof auth === "function") {
        return;
      }
      if (auth.username && auth.password) {
        return;
      }
      if (auth.clientId && auth.clientSecret) {
        return;
      }
      throw new Error(`Invalid "auth" option: ${JSON.stringify(auth)}`);
    }
  }
});

// node_modules/@octokit/rest/plugins/authentication/index.js
var require_authentication = __commonJS({
  "node_modules/@octokit/rest/plugins/authentication/index.js"(exports2, module2) {
    module2.exports = authenticationPlugin;
    var { createTokenAuth } = require_dist_node7();
    var { Deprecation } = require_dist_node3();
    var once = require_once();
    var beforeRequest = require_before_request();
    var requestError = require_request_error();
    var validate = require_validate();
    var withAuthorizationPrefix = require_with_authorization_prefix();
    var deprecateAuthBasic = once((log, deprecation) => log.warn(deprecation));
    var deprecateAuthObject = once((log, deprecation) => log.warn(deprecation));
    function authenticationPlugin(octokit, options) {
      if (options.authStrategy) {
        const auth = options.authStrategy(options.auth);
        octokit.hook.wrap("request", auth.hook);
        octokit.auth = auth;
        return;
      }
      if (!options.auth) {
        octokit.auth = () => Promise.resolve({
          type: "unauthenticated"
        });
        return;
      }
      const isBasicAuthString = typeof options.auth === "string" && /^basic/.test(withAuthorizationPrefix(options.auth));
      if (typeof options.auth === "string" && !isBasicAuthString) {
        const auth = createTokenAuth(options.auth);
        octokit.hook.wrap("request", auth.hook);
        octokit.auth = auth;
        return;
      }
      const [deprecationMethod, deprecationMessapge] = isBasicAuthString ? [
        deprecateAuthBasic,
        'Setting the "new Octokit({ auth })" option to a Basic Auth string is deprecated. Use https://github.com/octokit/auth-basic.js instead. See (https://octokit.github.io/rest.js/#authentication)'
      ] : [
        deprecateAuthObject,
        'Setting the "new Octokit({ auth })" option to an object without also setting the "authStrategy" option is deprecated and will be removed in v17. See (https://octokit.github.io/rest.js/#authentication)'
      ];
      deprecationMethod(octokit.log, new Deprecation("[@octokit/rest] " + deprecationMessapge));
      octokit.auth = () => Promise.resolve({
        type: "deprecated",
        message: deprecationMessapge
      });
      validate(options.auth);
      const state = {
        octokit,
        auth: options.auth
      };
      octokit.hook.before("request", beforeRequest.bind(null, state));
      octokit.hook.error("request", requestError.bind(null, state));
    }
  }
});

// node_modules/@octokit/rest/plugins/authentication-deprecated/authenticate.js
var require_authenticate = __commonJS({
  "node_modules/@octokit/rest/plugins/authentication-deprecated/authenticate.js"(exports2, module2) {
    module2.exports = authenticate;
    var { Deprecation } = require_dist_node3();
    var once = require_once();
    var deprecateAuthenticate = once((log, deprecation) => log.warn(deprecation));
    function authenticate(state, options) {
      deprecateAuthenticate(state.octokit.log, new Deprecation('[@octokit/rest] octokit.authenticate() is deprecated. Use "auth" constructor option instead.'));
      if (!options) {
        state.auth = false;
        return;
      }
      switch (options.type) {
        case "basic":
          if (!options.username || !options.password) {
            throw new Error("Basic authentication requires both a username and password to be set");
          }
          break;
        case "oauth":
          if (!options.token && !(options.key && options.secret)) {
            throw new Error("OAuth2 authentication requires a token or key & secret to be set");
          }
          break;
        case "token":
        case "app":
          if (!options.token) {
            throw new Error("Token authentication requires a token to be set");
          }
          break;
        default:
          throw new Error("Invalid authentication type, must be 'basic', 'oauth', 'token' or 'app'");
      }
      state.auth = options;
    }
  }
});

// node_modules/lodash.uniq/index.js
var require_lodash = __commonJS({
  "node_modules/lodash.uniq/index.js"(exports2, module2) {
    var LARGE_ARRAY_SIZE = 200;
    var HASH_UNDEFINED = "__lodash_hash_undefined__";
    var INFINITY = 1 / 0;
    var funcTag = "[object Function]";
    var genTag = "[object GeneratorFunction]";
    var reRegExpChar = /[\\^$.*+?()[\]{}|]/g;
    var reIsHostCtor = /^\[object .+?Constructor\]$/;
    var freeGlobal = typeof global == "object" && global && global.Object === Object && global;
    var freeSelf = typeof self == "object" && self && self.Object === Object && self;
    var root = freeGlobal || freeSelf || Function("return this")();
    function arrayIncludes(array, value) {
      var length = array ? array.length : 0;
      return !!length && baseIndexOf(array, value, 0) > -1;
    }
    function arrayIncludesWith(array, value, comparator) {
      var index = -1, length = array ? array.length : 0;
      while (++index < length) {
        if (comparator(value, array[index])) {
          return true;
        }
      }
      return false;
    }
    function baseFindIndex(array, predicate, fromIndex, fromRight) {
      var length = array.length, index = fromIndex + (fromRight ? 1 : -1);
      while (fromRight ? index-- : ++index < length) {
        if (predicate(array[index], index, array)) {
          return index;
        }
      }
      return -1;
    }
    function baseIndexOf(array, value, fromIndex) {
      if (value !== value) {
        return baseFindIndex(array, baseIsNaN, fromIndex);
      }
      var index = fromIndex - 1, length = array.length;
      while (++index < length) {
        if (array[index] === value) {
          return index;
        }
      }
      return -1;
    }
    function baseIsNaN(value) {
      return value !== value;
    }
    function cacheHas(cache, key) {
      return cache.has(key);
    }
    function getValue(object, key) {
      return object == null ? void 0 : object[key];
    }
    function isHostObject(value) {
      var result = false;
      if (value != null && typeof value.toString != "function") {
        try {
          result = !!(value + "");
        } catch (e) {
        }
      }
      return result;
    }
    function setToArray(set2) {
      var index = -1, result = Array(set2.size);
      set2.forEach(function(value) {
        result[++index] = value;
      });
      return result;
    }
    var arrayProto = Array.prototype;
    var funcProto = Function.prototype;
    var objectProto = Object.prototype;
    var coreJsData = root["__core-js_shared__"];
    var maskSrcKey = function() {
      var uid = /[^.]+$/.exec(coreJsData && coreJsData.keys && coreJsData.keys.IE_PROTO || "");
      return uid ? "Symbol(src)_1." + uid : "";
    }();
    var funcToString = funcProto.toString;
    var hasOwnProperty = objectProto.hasOwnProperty;
    var objectToString = objectProto.toString;
    var reIsNative = RegExp("^" + funcToString.call(hasOwnProperty).replace(reRegExpChar, "\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$");
    var splice = arrayProto.splice;
    var Map2 = getNative(root, "Map");
    var Set2 = getNative(root, "Set");
    var nativeCreate = getNative(Object, "create");
    function Hash(entries) {
      var index = -1, length = entries ? entries.length : 0;
      this.clear();
      while (++index < length) {
        var entry = entries[index];
        this.set(entry[0], entry[1]);
      }
    }
    function hashClear() {
      this.__data__ = nativeCreate ? nativeCreate(null) : {};
    }
    function hashDelete(key) {
      return this.has(key) && delete this.__data__[key];
    }
    function hashGet(key) {
      var data = this.__data__;
      if (nativeCreate) {
        var result = data[key];
        return result === HASH_UNDEFINED ? void 0 : result;
      }
      return hasOwnProperty.call(data, key) ? data[key] : void 0;
    }
    function hashHas(key) {
      var data = this.__data__;
      return nativeCreate ? data[key] !== void 0 : hasOwnProperty.call(data, key);
    }
    function hashSet(key, value) {
      var data = this.__data__;
      data[key] = nativeCreate && value === void 0 ? HASH_UNDEFINED : value;
      return this;
    }
    Hash.prototype.clear = hashClear;
    Hash.prototype["delete"] = hashDelete;
    Hash.prototype.get = hashGet;
    Hash.prototype.has = hashHas;
    Hash.prototype.set = hashSet;
    function ListCache(entries) {
      var index = -1, length = entries ? entries.length : 0;
      this.clear();
      while (++index < length) {
        var entry = entries[index];
        this.set(entry[0], entry[1]);
      }
    }
    function listCacheClear() {
      this.__data__ = [];
    }
    function listCacheDelete(key) {
      var data = this.__data__, index = assocIndexOf(data, key);
      if (index < 0) {
        return false;
      }
      var lastIndex = data.length - 1;
      if (index == lastIndex) {
        data.pop();
      } else {
        splice.call(data, index, 1);
      }
      return true;
    }
    function listCacheGet(key) {
      var data = this.__data__, index = assocIndexOf(data, key);
      return index < 0 ? void 0 : data[index][1];
    }
    function listCacheHas(key) {
      return assocIndexOf(this.__data__, key) > -1;
    }
    function listCacheSet(key, value) {
      var data = this.__data__, index = assocIndexOf(data, key);
      if (index < 0) {
        data.push([key, value]);
      } else {
        data[index][1] = value;
      }
      return this;
    }
    ListCache.prototype.clear = listCacheClear;
    ListCache.prototype["delete"] = listCacheDelete;
    ListCache.prototype.get = listCacheGet;
    ListCache.prototype.has = listCacheHas;
    ListCache.prototype.set = listCacheSet;
    function MapCache(entries) {
      var index = -1, length = entries ? entries.length : 0;
      this.clear();
      while (++index < length) {
        var entry = entries[index];
        this.set(entry[0], entry[1]);
      }
    }
    function mapCacheClear() {
      this.__data__ = {
        "hash": new Hash(),
        "map": new (Map2 || ListCache)(),
        "string": new Hash()
      };
    }
    function mapCacheDelete(key) {
      return getMapData(this, key)["delete"](key);
    }
    function mapCacheGet(key) {
      return getMapData(this, key).get(key);
    }
    function mapCacheHas(key) {
      return getMapData(this, key).has(key);
    }
    function mapCacheSet(key, value) {
      getMapData(this, key).set(key, value);
      return this;
    }
    MapCache.prototype.clear = mapCacheClear;
    MapCache.prototype["delete"] = mapCacheDelete;
    MapCache.prototype.get = mapCacheGet;
    MapCache.prototype.has = mapCacheHas;
    MapCache.prototype.set = mapCacheSet;
    function SetCache(values) {
      var index = -1, length = values ? values.length : 0;
      this.__data__ = new MapCache();
      while (++index < length) {
        this.add(values[index]);
      }
    }
    function setCacheAdd(value) {
      this.__data__.set(value, HASH_UNDEFINED);
      return this;
    }
    function setCacheHas(value) {
      return this.__data__.has(value);
    }
    SetCache.prototype.add = SetCache.prototype.push = setCacheAdd;
    SetCache.prototype.has = setCacheHas;
    function assocIndexOf(array, key) {
      var length = array.length;
      while (length--) {
        if (eq(array[length][0], key)) {
          return length;
        }
      }
      return -1;
    }
    function baseIsNative(value) {
      if (!isObject2(value) || isMasked(value)) {
        return false;
      }
      var pattern = isFunction(value) || isHostObject(value) ? reIsNative : reIsHostCtor;
      return pattern.test(toSource(value));
    }
    function baseUniq(array, iteratee, comparator) {
      var index = -1, includes = arrayIncludes, length = array.length, isCommon = true, result = [], seen = result;
      if (comparator) {
        isCommon = false;
        includes = arrayIncludesWith;
      } else if (length >= LARGE_ARRAY_SIZE) {
        var set2 = iteratee ? null : createSet(array);
        if (set2) {
          return setToArray(set2);
        }
        isCommon = false;
        includes = cacheHas;
        seen = new SetCache();
      } else {
        seen = iteratee ? [] : result;
      }
      outer:
        while (++index < length) {
          var value = array[index], computed = iteratee ? iteratee(value) : value;
          value = comparator || value !== 0 ? value : 0;
          if (isCommon && computed === computed) {
            var seenIndex = seen.length;
            while (seenIndex--) {
              if (seen[seenIndex] === computed) {
                continue outer;
              }
            }
            if (iteratee) {
              seen.push(computed);
            }
            result.push(value);
          } else if (!includes(seen, computed, comparator)) {
            if (seen !== result) {
              seen.push(computed);
            }
            result.push(value);
          }
        }
      return result;
    }
    var createSet = !(Set2 && 1 / setToArray(new Set2([, -0]))[1] == INFINITY) ? noop : function(values) {
      return new Set2(values);
    };
    function getMapData(map2, key) {
      var data = map2.__data__;
      return isKeyable(key) ? data[typeof key == "string" ? "string" : "hash"] : data.map;
    }
    function getNative(object, key) {
      var value = getValue(object, key);
      return baseIsNative(value) ? value : void 0;
    }
    function isKeyable(value) {
      var type2 = typeof value;
      return type2 == "string" || type2 == "number" || type2 == "symbol" || type2 == "boolean" ? value !== "__proto__" : value === null;
    }
    function isMasked(func) {
      return !!maskSrcKey && maskSrcKey in func;
    }
    function toSource(func) {
      if (func != null) {
        try {
          return funcToString.call(func);
        } catch (e) {
        }
        try {
          return func + "";
        } catch (e) {
        }
      }
      return "";
    }
    function uniq(array) {
      return array && array.length ? baseUniq(array) : [];
    }
    function eq(value, other) {
      return value === other || value !== value && other !== other;
    }
    function isFunction(value) {
      var tag = isObject2(value) ? objectToString.call(value) : "";
      return tag == funcTag || tag == genTag;
    }
    function isObject2(value) {
      var type2 = typeof value;
      return !!value && (type2 == "object" || type2 == "function");
    }
    function noop() {
    }
    module2.exports = uniq;
  }
});

// node_modules/@octokit/rest/plugins/authentication-deprecated/before-request.js
var require_before_request2 = __commonJS({
  "node_modules/@octokit/rest/plugins/authentication-deprecated/before-request.js"(exports2, module2) {
    module2.exports = authenticationBeforeRequest;
    var btoa = require_btoa_node();
    var uniq = require_lodash();
    function authenticationBeforeRequest(state, options) {
      if (!state.auth.type) {
        return;
      }
      if (state.auth.type === "basic") {
        const hash = btoa(`${state.auth.username}:${state.auth.password}`);
        options.headers.authorization = `Basic ${hash}`;
        return;
      }
      if (state.auth.type === "token") {
        options.headers.authorization = `token ${state.auth.token}`;
        return;
      }
      if (state.auth.type === "app") {
        options.headers.authorization = `Bearer ${state.auth.token}`;
        const acceptHeaders = options.headers.accept.split(",").concat("application/vnd.github.machine-man-preview+json");
        options.headers.accept = uniq(acceptHeaders).filter(Boolean).join(",");
        return;
      }
      options.url += options.url.indexOf("?") === -1 ? "?" : "&";
      if (state.auth.token) {
        options.url += `access_token=${encodeURIComponent(state.auth.token)}`;
        return;
      }
      const key = encodeURIComponent(state.auth.key);
      const secret = encodeURIComponent(state.auth.secret);
      options.url += `client_id=${key}&client_secret=${secret}`;
    }
  }
});

// node_modules/@octokit/rest/plugins/authentication-deprecated/request-error.js
var require_request_error2 = __commonJS({
  "node_modules/@octokit/rest/plugins/authentication-deprecated/request-error.js"(exports2, module2) {
    module2.exports = authenticationRequestError;
    var { RequestError } = require_dist_node15();
    function authenticationRequestError(state, error, options) {
      if (!error.headers)
        throw error;
      const otpRequired = /required/.test(error.headers["x-github-otp"] || "");
      if (error.status !== 401 || !otpRequired) {
        throw error;
      }
      if (error.status === 401 && otpRequired && error.request && error.request.headers["x-github-otp"]) {
        throw new RequestError("Invalid one-time password for two-factor authentication", 401, {
          headers: error.headers,
          request: options
        });
      }
      if (typeof state.auth.on2fa !== "function") {
        throw new RequestError("2FA required, but options.on2fa is not a function. See https://github.com/octokit/rest.js#authentication", 401, {
          headers: error.headers,
          request: options
        });
      }
      return Promise.resolve().then(() => {
        return state.auth.on2fa();
      }).then((oneTimePassword) => {
        const newOptions = Object.assign(options, {
          headers: Object.assign({ "x-github-otp": oneTimePassword }, options.headers)
        });
        return state.octokit.request(newOptions);
      });
    }
  }
});

// node_modules/@octokit/rest/plugins/authentication-deprecated/index.js
var require_authentication_deprecated = __commonJS({
  "node_modules/@octokit/rest/plugins/authentication-deprecated/index.js"(exports2, module2) {
    module2.exports = authenticationPlugin;
    var { Deprecation } = require_dist_node3();
    var once = require_once();
    var deprecateAuthenticate = once((log, deprecation) => log.warn(deprecation));
    var authenticate = require_authenticate();
    var beforeRequest = require_before_request2();
    var requestError = require_request_error2();
    function authenticationPlugin(octokit, options) {
      if (options.auth) {
        octokit.authenticate = () => {
          deprecateAuthenticate(octokit.log, new Deprecation('[@octokit/rest] octokit.authenticate() is deprecated and has no effect when "auth" option is set on Octokit constructor'));
        };
        return;
      }
      const state = {
        octokit,
        auth: false
      };
      octokit.authenticate = authenticate.bind(null, state);
      octokit.hook.before("request", beforeRequest.bind(null, state));
      octokit.hook.error("request", requestError.bind(null, state));
    }
  }
});

// node_modules/@octokit/rest/node_modules/@octokit/plugin-paginate-rest/dist-node/index.js
var require_dist_node16 = __commonJS({
  "node_modules/@octokit/rest/node_modules/@octokit/plugin-paginate-rest/dist-node/index.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    var VERSION = "1.1.2";
    var REGEX = [/^\/search\//, /^\/repos\/[^/]+\/[^/]+\/commits\/[^/]+\/(check-runs|check-suites)([^/]|$)/, /^\/installation\/repositories([^/]|$)/, /^\/user\/installations([^/]|$)/, /^\/repos\/[^/]+\/[^/]+\/actions\/secrets([^/]|$)/, /^\/repos\/[^/]+\/[^/]+\/actions\/workflows(\/[^/]+\/runs)?([^/]|$)/, /^\/repos\/[^/]+\/[^/]+\/actions\/runs(\/[^/]+\/(artifacts|jobs))?([^/]|$)/];
    function normalizePaginatedListResponse(octokit, url, response) {
      const path7 = url.replace(octokit.request.endpoint.DEFAULTS.baseUrl, "");
      const responseNeedsNormalization = REGEX.find((regex) => regex.test(path7));
      if (!responseNeedsNormalization)
        return;
      const incompleteResults = response.data.incomplete_results;
      const repositorySelection = response.data.repository_selection;
      const totalCount = response.data.total_count;
      delete response.data.incomplete_results;
      delete response.data.repository_selection;
      delete response.data.total_count;
      const namespaceKey = Object.keys(response.data)[0];
      const data = response.data[namespaceKey];
      response.data = data;
      if (typeof incompleteResults !== "undefined") {
        response.data.incomplete_results = incompleteResults;
      }
      if (typeof repositorySelection !== "undefined") {
        response.data.repository_selection = repositorySelection;
      }
      response.data.total_count = totalCount;
      Object.defineProperty(response.data, namespaceKey, {
        get() {
          octokit.log.warn(`[@octokit/paginate-rest] "response.data.${namespaceKey}" is deprecated for "GET ${path7}". Get the results directly from "response.data"`);
          return Array.from(data);
        }
      });
    }
    function iterator(octokit, route, parameters) {
      const options = octokit.request.endpoint(route, parameters);
      const method = options.method;
      const headers = options.headers;
      let url = options.url;
      return {
        [Symbol.asyncIterator]: () => ({
          next() {
            if (!url) {
              return Promise.resolve({
                done: true
              });
            }
            return octokit.request({
              method,
              url,
              headers
            }).then((response) => {
              normalizePaginatedListResponse(octokit, url, response);
              url = ((response.headers.link || "").match(/<([^>]+)>;\s*rel="next"/) || [])[1];
              return {
                value: response
              };
            });
          }
        })
      };
    }
    function paginate(octokit, route, parameters, mapFn) {
      if (typeof parameters === "function") {
        mapFn = parameters;
        parameters = void 0;
      }
      return gather(octokit, [], iterator(octokit, route, parameters)[Symbol.asyncIterator](), mapFn);
    }
    function gather(octokit, results, iterator2, mapFn) {
      return iterator2.next().then((result) => {
        if (result.done) {
          return results;
        }
        let earlyExit = false;
        function done() {
          earlyExit = true;
        }
        results = results.concat(mapFn ? mapFn(result.value, done) : result.value.data);
        if (earlyExit) {
          return results;
        }
        return gather(octokit, results, iterator2, mapFn);
      });
    }
    function paginateRest(octokit) {
      return {
        paginate: Object.assign(paginate.bind(null, octokit), {
          iterator: iterator.bind(null, octokit)
        })
      };
    }
    paginateRest.VERSION = VERSION;
    exports2.paginateRest = paginateRest;
  }
});

// node_modules/@octokit/rest/plugins/pagination/index.js
var require_pagination = __commonJS({
  "node_modules/@octokit/rest/plugins/pagination/index.js"(exports2, module2) {
    module2.exports = paginatePlugin;
    var { paginateRest } = require_dist_node16();
    function paginatePlugin(octokit) {
      Object.assign(octokit, paginateRest(octokit));
    }
  }
});

// node_modules/lodash.get/index.js
var require_lodash2 = __commonJS({
  "node_modules/lodash.get/index.js"(exports2, module2) {
    var FUNC_ERROR_TEXT = "Expected a function";
    var HASH_UNDEFINED = "__lodash_hash_undefined__";
    var INFINITY = 1 / 0;
    var funcTag = "[object Function]";
    var genTag = "[object GeneratorFunction]";
    var symbolTag = "[object Symbol]";
    var reIsDeepProp = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/;
    var reIsPlainProp = /^\w*$/;
    var reLeadingDot = /^\./;
    var rePropName = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g;
    var reRegExpChar = /[\\^$.*+?()[\]{}|]/g;
    var reEscapeChar = /\\(\\)?/g;
    var reIsHostCtor = /^\[object .+?Constructor\]$/;
    var freeGlobal = typeof global == "object" && global && global.Object === Object && global;
    var freeSelf = typeof self == "object" && self && self.Object === Object && self;
    var root = freeGlobal || freeSelf || Function("return this")();
    function getValue(object, key) {
      return object == null ? void 0 : object[key];
    }
    function isHostObject(value) {
      var result = false;
      if (value != null && typeof value.toString != "function") {
        try {
          result = !!(value + "");
        } catch (e) {
        }
      }
      return result;
    }
    var arrayProto = Array.prototype;
    var funcProto = Function.prototype;
    var objectProto = Object.prototype;
    var coreJsData = root["__core-js_shared__"];
    var maskSrcKey = function() {
      var uid = /[^.]+$/.exec(coreJsData && coreJsData.keys && coreJsData.keys.IE_PROTO || "");
      return uid ? "Symbol(src)_1." + uid : "";
    }();
    var funcToString = funcProto.toString;
    var hasOwnProperty = objectProto.hasOwnProperty;
    var objectToString = objectProto.toString;
    var reIsNative = RegExp("^" + funcToString.call(hasOwnProperty).replace(reRegExpChar, "\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$");
    var Symbol2 = root.Symbol;
    var splice = arrayProto.splice;
    var Map2 = getNative(root, "Map");
    var nativeCreate = getNative(Object, "create");
    var symbolProto = Symbol2 ? Symbol2.prototype : void 0;
    var symbolToString = symbolProto ? symbolProto.toString : void 0;
    function Hash(entries) {
      var index = -1, length = entries ? entries.length : 0;
      this.clear();
      while (++index < length) {
        var entry = entries[index];
        this.set(entry[0], entry[1]);
      }
    }
    function hashClear() {
      this.__data__ = nativeCreate ? nativeCreate(null) : {};
    }
    function hashDelete(key) {
      return this.has(key) && delete this.__data__[key];
    }
    function hashGet(key) {
      var data = this.__data__;
      if (nativeCreate) {
        var result = data[key];
        return result === HASH_UNDEFINED ? void 0 : result;
      }
      return hasOwnProperty.call(data, key) ? data[key] : void 0;
    }
    function hashHas(key) {
      var data = this.__data__;
      return nativeCreate ? data[key] !== void 0 : hasOwnProperty.call(data, key);
    }
    function hashSet(key, value) {
      var data = this.__data__;
      data[key] = nativeCreate && value === void 0 ? HASH_UNDEFINED : value;
      return this;
    }
    Hash.prototype.clear = hashClear;
    Hash.prototype["delete"] = hashDelete;
    Hash.prototype.get = hashGet;
    Hash.prototype.has = hashHas;
    Hash.prototype.set = hashSet;
    function ListCache(entries) {
      var index = -1, length = entries ? entries.length : 0;
      this.clear();
      while (++index < length) {
        var entry = entries[index];
        this.set(entry[0], entry[1]);
      }
    }
    function listCacheClear() {
      this.__data__ = [];
    }
    function listCacheDelete(key) {
      var data = this.__data__, index = assocIndexOf(data, key);
      if (index < 0) {
        return false;
      }
      var lastIndex = data.length - 1;
      if (index == lastIndex) {
        data.pop();
      } else {
        splice.call(data, index, 1);
      }
      return true;
    }
    function listCacheGet(key) {
      var data = this.__data__, index = assocIndexOf(data, key);
      return index < 0 ? void 0 : data[index][1];
    }
    function listCacheHas(key) {
      return assocIndexOf(this.__data__, key) > -1;
    }
    function listCacheSet(key, value) {
      var data = this.__data__, index = assocIndexOf(data, key);
      if (index < 0) {
        data.push([key, value]);
      } else {
        data[index][1] = value;
      }
      return this;
    }
    ListCache.prototype.clear = listCacheClear;
    ListCache.prototype["delete"] = listCacheDelete;
    ListCache.prototype.get = listCacheGet;
    ListCache.prototype.has = listCacheHas;
    ListCache.prototype.set = listCacheSet;
    function MapCache(entries) {
      var index = -1, length = entries ? entries.length : 0;
      this.clear();
      while (++index < length) {
        var entry = entries[index];
        this.set(entry[0], entry[1]);
      }
    }
    function mapCacheClear() {
      this.__data__ = {
        "hash": new Hash(),
        "map": new (Map2 || ListCache)(),
        "string": new Hash()
      };
    }
    function mapCacheDelete(key) {
      return getMapData(this, key)["delete"](key);
    }
    function mapCacheGet(key) {
      return getMapData(this, key).get(key);
    }
    function mapCacheHas(key) {
      return getMapData(this, key).has(key);
    }
    function mapCacheSet(key, value) {
      getMapData(this, key).set(key, value);
      return this;
    }
    MapCache.prototype.clear = mapCacheClear;
    MapCache.prototype["delete"] = mapCacheDelete;
    MapCache.prototype.get = mapCacheGet;
    MapCache.prototype.has = mapCacheHas;
    MapCache.prototype.set = mapCacheSet;
    function assocIndexOf(array, key) {
      var length = array.length;
      while (length--) {
        if (eq(array[length][0], key)) {
          return length;
        }
      }
      return -1;
    }
    function baseGet(object, path7) {
      path7 = isKey(path7, object) ? [path7] : castPath(path7);
      var index = 0, length = path7.length;
      while (object != null && index < length) {
        object = object[toKey(path7[index++])];
      }
      return index && index == length ? object : void 0;
    }
    function baseIsNative(value) {
      if (!isObject2(value) || isMasked(value)) {
        return false;
      }
      var pattern = isFunction(value) || isHostObject(value) ? reIsNative : reIsHostCtor;
      return pattern.test(toSource(value));
    }
    function baseToString(value) {
      if (typeof value == "string") {
        return value;
      }
      if (isSymbol(value)) {
        return symbolToString ? symbolToString.call(value) : "";
      }
      var result = value + "";
      return result == "0" && 1 / value == -INFINITY ? "-0" : result;
    }
    function castPath(value) {
      return isArray(value) ? value : stringToPath(value);
    }
    function getMapData(map2, key) {
      var data = map2.__data__;
      return isKeyable(key) ? data[typeof key == "string" ? "string" : "hash"] : data.map;
    }
    function getNative(object, key) {
      var value = getValue(object, key);
      return baseIsNative(value) ? value : void 0;
    }
    function isKey(value, object) {
      if (isArray(value)) {
        return false;
      }
      var type2 = typeof value;
      if (type2 == "number" || type2 == "symbol" || type2 == "boolean" || value == null || isSymbol(value)) {
        return true;
      }
      return reIsPlainProp.test(value) || !reIsDeepProp.test(value) || object != null && value in Object(object);
    }
    function isKeyable(value) {
      var type2 = typeof value;
      return type2 == "string" || type2 == "number" || type2 == "symbol" || type2 == "boolean" ? value !== "__proto__" : value === null;
    }
    function isMasked(func) {
      return !!maskSrcKey && maskSrcKey in func;
    }
    var stringToPath = memoize(function(string) {
      string = toString2(string);
      var result = [];
      if (reLeadingDot.test(string)) {
        result.push("");
      }
      string.replace(rePropName, function(match, number, quote, string2) {
        result.push(quote ? string2.replace(reEscapeChar, "$1") : number || match);
      });
      return result;
    });
    function toKey(value) {
      if (typeof value == "string" || isSymbol(value)) {
        return value;
      }
      var result = value + "";
      return result == "0" && 1 / value == -INFINITY ? "-0" : result;
    }
    function toSource(func) {
      if (func != null) {
        try {
          return funcToString.call(func);
        } catch (e) {
        }
        try {
          return func + "";
        } catch (e) {
        }
      }
      return "";
    }
    function memoize(func, resolver) {
      if (typeof func != "function" || resolver && typeof resolver != "function") {
        throw new TypeError(FUNC_ERROR_TEXT);
      }
      var memoized = function() {
        var args = arguments, key = resolver ? resolver.apply(this, args) : args[0], cache = memoized.cache;
        if (cache.has(key)) {
          return cache.get(key);
        }
        var result = func.apply(this, args);
        memoized.cache = cache.set(key, result);
        return result;
      };
      memoized.cache = new (memoize.Cache || MapCache)();
      return memoized;
    }
    memoize.Cache = MapCache;
    function eq(value, other) {
      return value === other || value !== value && other !== other;
    }
    var isArray = Array.isArray;
    function isFunction(value) {
      var tag = isObject2(value) ? objectToString.call(value) : "";
      return tag == funcTag || tag == genTag;
    }
    function isObject2(value) {
      var type2 = typeof value;
      return !!value && (type2 == "object" || type2 == "function");
    }
    function isObjectLike(value) {
      return !!value && typeof value == "object";
    }
    function isSymbol(value) {
      return typeof value == "symbol" || isObjectLike(value) && objectToString.call(value) == symbolTag;
    }
    function toString2(value) {
      return value == null ? "" : baseToString(value);
    }
    function get(object, path7, defaultValue) {
      var result = object == null ? void 0 : baseGet(object, path7);
      return result === void 0 ? defaultValue : result;
    }
    module2.exports = get;
  }
});

// node_modules/lodash.set/index.js
var require_lodash3 = __commonJS({
  "node_modules/lodash.set/index.js"(exports2, module2) {
    var FUNC_ERROR_TEXT = "Expected a function";
    var HASH_UNDEFINED = "__lodash_hash_undefined__";
    var INFINITY = 1 / 0;
    var MAX_SAFE_INTEGER = 9007199254740991;
    var funcTag = "[object Function]";
    var genTag = "[object GeneratorFunction]";
    var symbolTag = "[object Symbol]";
    var reIsDeepProp = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/;
    var reIsPlainProp = /^\w*$/;
    var reLeadingDot = /^\./;
    var rePropName = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g;
    var reRegExpChar = /[\\^$.*+?()[\]{}|]/g;
    var reEscapeChar = /\\(\\)?/g;
    var reIsHostCtor = /^\[object .+?Constructor\]$/;
    var reIsUint = /^(?:0|[1-9]\d*)$/;
    var freeGlobal = typeof global == "object" && global && global.Object === Object && global;
    var freeSelf = typeof self == "object" && self && self.Object === Object && self;
    var root = freeGlobal || freeSelf || Function("return this")();
    function getValue(object, key) {
      return object == null ? void 0 : object[key];
    }
    function isHostObject(value) {
      var result = false;
      if (value != null && typeof value.toString != "function") {
        try {
          result = !!(value + "");
        } catch (e) {
        }
      }
      return result;
    }
    var arrayProto = Array.prototype;
    var funcProto = Function.prototype;
    var objectProto = Object.prototype;
    var coreJsData = root["__core-js_shared__"];
    var maskSrcKey = function() {
      var uid = /[^.]+$/.exec(coreJsData && coreJsData.keys && coreJsData.keys.IE_PROTO || "");
      return uid ? "Symbol(src)_1." + uid : "";
    }();
    var funcToString = funcProto.toString;
    var hasOwnProperty = objectProto.hasOwnProperty;
    var objectToString = objectProto.toString;
    var reIsNative = RegExp("^" + funcToString.call(hasOwnProperty).replace(reRegExpChar, "\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$");
    var Symbol2 = root.Symbol;
    var splice = arrayProto.splice;
    var Map2 = getNative(root, "Map");
    var nativeCreate = getNative(Object, "create");
    var symbolProto = Symbol2 ? Symbol2.prototype : void 0;
    var symbolToString = symbolProto ? symbolProto.toString : void 0;
    function Hash(entries) {
      var index = -1, length = entries ? entries.length : 0;
      this.clear();
      while (++index < length) {
        var entry = entries[index];
        this.set(entry[0], entry[1]);
      }
    }
    function hashClear() {
      this.__data__ = nativeCreate ? nativeCreate(null) : {};
    }
    function hashDelete(key) {
      return this.has(key) && delete this.__data__[key];
    }
    function hashGet(key) {
      var data = this.__data__;
      if (nativeCreate) {
        var result = data[key];
        return result === HASH_UNDEFINED ? void 0 : result;
      }
      return hasOwnProperty.call(data, key) ? data[key] : void 0;
    }
    function hashHas(key) {
      var data = this.__data__;
      return nativeCreate ? data[key] !== void 0 : hasOwnProperty.call(data, key);
    }
    function hashSet(key, value) {
      var data = this.__data__;
      data[key] = nativeCreate && value === void 0 ? HASH_UNDEFINED : value;
      return this;
    }
    Hash.prototype.clear = hashClear;
    Hash.prototype["delete"] = hashDelete;
    Hash.prototype.get = hashGet;
    Hash.prototype.has = hashHas;
    Hash.prototype.set = hashSet;
    function ListCache(entries) {
      var index = -1, length = entries ? entries.length : 0;
      this.clear();
      while (++index < length) {
        var entry = entries[index];
        this.set(entry[0], entry[1]);
      }
    }
    function listCacheClear() {
      this.__data__ = [];
    }
    function listCacheDelete(key) {
      var data = this.__data__, index = assocIndexOf(data, key);
      if (index < 0) {
        return false;
      }
      var lastIndex = data.length - 1;
      if (index == lastIndex) {
        data.pop();
      } else {
        splice.call(data, index, 1);
      }
      return true;
    }
    function listCacheGet(key) {
      var data = this.__data__, index = assocIndexOf(data, key);
      return index < 0 ? void 0 : data[index][1];
    }
    function listCacheHas(key) {
      return assocIndexOf(this.__data__, key) > -1;
    }
    function listCacheSet(key, value) {
      var data = this.__data__, index = assocIndexOf(data, key);
      if (index < 0) {
        data.push([key, value]);
      } else {
        data[index][1] = value;
      }
      return this;
    }
    ListCache.prototype.clear = listCacheClear;
    ListCache.prototype["delete"] = listCacheDelete;
    ListCache.prototype.get = listCacheGet;
    ListCache.prototype.has = listCacheHas;
    ListCache.prototype.set = listCacheSet;
    function MapCache(entries) {
      var index = -1, length = entries ? entries.length : 0;
      this.clear();
      while (++index < length) {
        var entry = entries[index];
        this.set(entry[0], entry[1]);
      }
    }
    function mapCacheClear() {
      this.__data__ = {
        "hash": new Hash(),
        "map": new (Map2 || ListCache)(),
        "string": new Hash()
      };
    }
    function mapCacheDelete(key) {
      return getMapData(this, key)["delete"](key);
    }
    function mapCacheGet(key) {
      return getMapData(this, key).get(key);
    }
    function mapCacheHas(key) {
      return getMapData(this, key).has(key);
    }
    function mapCacheSet(key, value) {
      getMapData(this, key).set(key, value);
      return this;
    }
    MapCache.prototype.clear = mapCacheClear;
    MapCache.prototype["delete"] = mapCacheDelete;
    MapCache.prototype.get = mapCacheGet;
    MapCache.prototype.has = mapCacheHas;
    MapCache.prototype.set = mapCacheSet;
    function assignValue(object, key, value) {
      var objValue = object[key];
      if (!(hasOwnProperty.call(object, key) && eq(objValue, value)) || value === void 0 && !(key in object)) {
        object[key] = value;
      }
    }
    function assocIndexOf(array, key) {
      var length = array.length;
      while (length--) {
        if (eq(array[length][0], key)) {
          return length;
        }
      }
      return -1;
    }
    function baseIsNative(value) {
      if (!isObject2(value) || isMasked(value)) {
        return false;
      }
      var pattern = isFunction(value) || isHostObject(value) ? reIsNative : reIsHostCtor;
      return pattern.test(toSource(value));
    }
    function baseSet(object, path7, value, customizer) {
      if (!isObject2(object)) {
        return object;
      }
      path7 = isKey(path7, object) ? [path7] : castPath(path7);
      var index = -1, length = path7.length, lastIndex = length - 1, nested = object;
      while (nested != null && ++index < length) {
        var key = toKey(path7[index]), newValue = value;
        if (index != lastIndex) {
          var objValue = nested[key];
          newValue = customizer ? customizer(objValue, key, nested) : void 0;
          if (newValue === void 0) {
            newValue = isObject2(objValue) ? objValue : isIndex(path7[index + 1]) ? [] : {};
          }
        }
        assignValue(nested, key, newValue);
        nested = nested[key];
      }
      return object;
    }
    function baseToString(value) {
      if (typeof value == "string") {
        return value;
      }
      if (isSymbol(value)) {
        return symbolToString ? symbolToString.call(value) : "";
      }
      var result = value + "";
      return result == "0" && 1 / value == -INFINITY ? "-0" : result;
    }
    function castPath(value) {
      return isArray(value) ? value : stringToPath(value);
    }
    function getMapData(map2, key) {
      var data = map2.__data__;
      return isKeyable(key) ? data[typeof key == "string" ? "string" : "hash"] : data.map;
    }
    function getNative(object, key) {
      var value = getValue(object, key);
      return baseIsNative(value) ? value : void 0;
    }
    function isIndex(value, length) {
      length = length == null ? MAX_SAFE_INTEGER : length;
      return !!length && (typeof value == "number" || reIsUint.test(value)) && (value > -1 && value % 1 == 0 && value < length);
    }
    function isKey(value, object) {
      if (isArray(value)) {
        return false;
      }
      var type2 = typeof value;
      if (type2 == "number" || type2 == "symbol" || type2 == "boolean" || value == null || isSymbol(value)) {
        return true;
      }
      return reIsPlainProp.test(value) || !reIsDeepProp.test(value) || object != null && value in Object(object);
    }
    function isKeyable(value) {
      var type2 = typeof value;
      return type2 == "string" || type2 == "number" || type2 == "symbol" || type2 == "boolean" ? value !== "__proto__" : value === null;
    }
    function isMasked(func) {
      return !!maskSrcKey && maskSrcKey in func;
    }
    var stringToPath = memoize(function(string) {
      string = toString2(string);
      var result = [];
      if (reLeadingDot.test(string)) {
        result.push("");
      }
      string.replace(rePropName, function(match, number, quote, string2) {
        result.push(quote ? string2.replace(reEscapeChar, "$1") : number || match);
      });
      return result;
    });
    function toKey(value) {
      if (typeof value == "string" || isSymbol(value)) {
        return value;
      }
      var result = value + "";
      return result == "0" && 1 / value == -INFINITY ? "-0" : result;
    }
    function toSource(func) {
      if (func != null) {
        try {
          return funcToString.call(func);
        } catch (e) {
        }
        try {
          return func + "";
        } catch (e) {
        }
      }
      return "";
    }
    function memoize(func, resolver) {
      if (typeof func != "function" || resolver && typeof resolver != "function") {
        throw new TypeError(FUNC_ERROR_TEXT);
      }
      var memoized = function() {
        var args = arguments, key = resolver ? resolver.apply(this, args) : args[0], cache = memoized.cache;
        if (cache.has(key)) {
          return cache.get(key);
        }
        var result = func.apply(this, args);
        memoized.cache = cache.set(key, result);
        return result;
      };
      memoized.cache = new (memoize.Cache || MapCache)();
      return memoized;
    }
    memoize.Cache = MapCache;
    function eq(value, other) {
      return value === other || value !== value && other !== other;
    }
    var isArray = Array.isArray;
    function isFunction(value) {
      var tag = isObject2(value) ? objectToString.call(value) : "";
      return tag == funcTag || tag == genTag;
    }
    function isObject2(value) {
      var type2 = typeof value;
      return !!value && (type2 == "object" || type2 == "function");
    }
    function isObjectLike(value) {
      return !!value && typeof value == "object";
    }
    function isSymbol(value) {
      return typeof value == "symbol" || isObjectLike(value) && objectToString.call(value) == symbolTag;
    }
    function toString2(value) {
      return value == null ? "" : baseToString(value);
    }
    function set2(object, path7, value) {
      return object == null ? object : baseSet(object, path7, value);
    }
    module2.exports = set2;
  }
});

// node_modules/@octokit/rest/plugins/validate/validate.js
var require_validate2 = __commonJS({
  "node_modules/@octokit/rest/plugins/validate/validate.js"(exports2, module2) {
    "use strict";
    module2.exports = validate;
    var { RequestError } = require_dist_node15();
    var get = require_lodash2();
    var set2 = require_lodash3();
    function validate(octokit, options) {
      if (!options.request.validate) {
        return;
      }
      const { validate: params } = options.request;
      Object.keys(params).forEach((parameterName) => {
        const parameter = get(params, parameterName);
        const expectedType = parameter.type;
        let parentParameterName;
        let parentValue;
        let parentParamIsPresent = true;
        let parentParameterIsArray = false;
        if (/\./.test(parameterName)) {
          parentParameterName = parameterName.replace(/\.[^.]+$/, "");
          parentParameterIsArray = parentParameterName.slice(-2) === "[]";
          if (parentParameterIsArray) {
            parentParameterName = parentParameterName.slice(0, -2);
          }
          parentValue = get(options, parentParameterName);
          parentParamIsPresent = parentParameterName === "headers" || typeof parentValue === "object" && parentValue !== null;
        }
        const values = parentParameterIsArray ? (get(options, parentParameterName) || []).map((value) => value[parameterName.split(/\./).pop()]) : [get(options, parameterName)];
        values.forEach((value, i) => {
          const valueIsPresent = typeof value !== "undefined";
          const valueIsNull = value === null;
          const currentParameterName = parentParameterIsArray ? parameterName.replace(/\[\]/, `[${i}]`) : parameterName;
          if (!parameter.required && !valueIsPresent) {
            return;
          }
          if (!parentParamIsPresent) {
            return;
          }
          if (parameter.allowNull && valueIsNull) {
            return;
          }
          if (!parameter.allowNull && valueIsNull) {
            throw new RequestError(`'${currentParameterName}' cannot be null`, 400, {
              request: options
            });
          }
          if (parameter.required && !valueIsPresent) {
            throw new RequestError(`Empty value for parameter '${currentParameterName}': ${JSON.stringify(value)}`, 400, {
              request: options
            });
          }
          if (expectedType === "integer") {
            const unparsedValue = value;
            value = parseInt(value, 10);
            if (isNaN(value)) {
              throw new RequestError(`Invalid value for parameter '${currentParameterName}': ${JSON.stringify(unparsedValue)} is NaN`, 400, {
                request: options
              });
            }
          }
          if (parameter.enum && parameter.enum.indexOf(String(value)) === -1) {
            throw new RequestError(`Invalid value for parameter '${currentParameterName}': ${JSON.stringify(value)}`, 400, {
              request: options
            });
          }
          if (parameter.validation) {
            const regex = new RegExp(parameter.validation);
            if (!regex.test(value)) {
              throw new RequestError(`Invalid value for parameter '${currentParameterName}': ${JSON.stringify(value)}`, 400, {
                request: options
              });
            }
          }
          if (expectedType === "object" && typeof value === "string") {
            try {
              value = JSON.parse(value);
            } catch (exception2) {
              throw new RequestError(`JSON parse error of value for parameter '${currentParameterName}': ${JSON.stringify(value)}`, 400, {
                request: options
              });
            }
          }
          set2(options, parameter.mapTo || currentParameterName, value);
        });
      });
      return options;
    }
  }
});

// node_modules/@octokit/rest/plugins/validate/index.js
var require_validate3 = __commonJS({
  "node_modules/@octokit/rest/plugins/validate/index.js"(exports2, module2) {
    module2.exports = octokitValidate;
    var validate = require_validate2();
    function octokitValidate(octokit) {
      octokit.hook.before("request", validate.bind(null, octokit));
    }
  }
});

// node_modules/octokit-pagination-methods/lib/deprecate.js
var require_deprecate = __commonJS({
  "node_modules/octokit-pagination-methods/lib/deprecate.js"(exports2, module2) {
    module2.exports = deprecate;
    var loggedMessages = {};
    function deprecate(message) {
      if (loggedMessages[message]) {
        return;
      }
      console.warn(`DEPRECATED (@octokit/rest): ${message}`);
      loggedMessages[message] = 1;
    }
  }
});

// node_modules/octokit-pagination-methods/lib/get-page-links.js
var require_get_page_links = __commonJS({
  "node_modules/octokit-pagination-methods/lib/get-page-links.js"(exports2, module2) {
    module2.exports = getPageLinks;
    function getPageLinks(link) {
      link = link.link || link.headers.link || "";
      const links = {};
      link.replace(/<([^>]*)>;\s*rel="([\w]*)"/g, (m, uri, type2) => {
        links[type2] = uri;
      });
      return links;
    }
  }
});

// node_modules/octokit-pagination-methods/lib/http-error.js
var require_http_error = __commonJS({
  "node_modules/octokit-pagination-methods/lib/http-error.js"(exports2, module2) {
    module2.exports = class HttpError extends Error {
      constructor(message, code, headers) {
        super(message);
        if (Error.captureStackTrace) {
          Error.captureStackTrace(this, this.constructor);
        }
        this.name = "HttpError";
        this.code = code;
        this.headers = headers;
      }
    };
  }
});

// node_modules/octokit-pagination-methods/lib/get-page.js
var require_get_page = __commonJS({
  "node_modules/octokit-pagination-methods/lib/get-page.js"(exports2, module2) {
    module2.exports = getPage;
    var deprecate = require_deprecate();
    var getPageLinks = require_get_page_links();
    var HttpError = require_http_error();
    function getPage(octokit, link, which3, headers) {
      deprecate(`octokit.get${which3.charAt(0).toUpperCase() + which3.slice(1)}Page() \u2013 You can use octokit.paginate or async iterators instead: https://github.com/octokit/rest.js#pagination.`);
      const url = getPageLinks(link)[which3];
      if (!url) {
        const urlError = new HttpError(`No ${which3} page found`, 404);
        return Promise.reject(urlError);
      }
      const requestOptions = {
        url,
        headers: applyAcceptHeader(link, headers)
      };
      const promise = octokit.request(requestOptions);
      return promise;
    }
    function applyAcceptHeader(res, headers) {
      const previous = res.headers && res.headers["x-github-media-type"];
      if (!previous || headers && headers.accept) {
        return headers;
      }
      headers = headers || {};
      headers.accept = "application/vnd." + previous.replace("; param=", ".").replace("; format=", "+");
      return headers;
    }
  }
});

// node_modules/octokit-pagination-methods/lib/get-first-page.js
var require_get_first_page = __commonJS({
  "node_modules/octokit-pagination-methods/lib/get-first-page.js"(exports2, module2) {
    module2.exports = getFirstPage;
    var getPage = require_get_page();
    function getFirstPage(octokit, link, headers) {
      return getPage(octokit, link, "first", headers);
    }
  }
});

// node_modules/octokit-pagination-methods/lib/get-last-page.js
var require_get_last_page = __commonJS({
  "node_modules/octokit-pagination-methods/lib/get-last-page.js"(exports2, module2) {
    module2.exports = getLastPage;
    var getPage = require_get_page();
    function getLastPage(octokit, link, headers) {
      return getPage(octokit, link, "last", headers);
    }
  }
});

// node_modules/octokit-pagination-methods/lib/get-next-page.js
var require_get_next_page = __commonJS({
  "node_modules/octokit-pagination-methods/lib/get-next-page.js"(exports2, module2) {
    module2.exports = getNextPage;
    var getPage = require_get_page();
    function getNextPage(octokit, link, headers) {
      return getPage(octokit, link, "next", headers);
    }
  }
});

// node_modules/octokit-pagination-methods/lib/get-previous-page.js
var require_get_previous_page = __commonJS({
  "node_modules/octokit-pagination-methods/lib/get-previous-page.js"(exports2, module2) {
    module2.exports = getPreviousPage;
    var getPage = require_get_page();
    function getPreviousPage(octokit, link, headers) {
      return getPage(octokit, link, "prev", headers);
    }
  }
});

// node_modules/octokit-pagination-methods/lib/has-first-page.js
var require_has_first_page = __commonJS({
  "node_modules/octokit-pagination-methods/lib/has-first-page.js"(exports2, module2) {
    module2.exports = hasFirstPage;
    var deprecate = require_deprecate();
    var getPageLinks = require_get_page_links();
    function hasFirstPage(link) {
      deprecate(`octokit.hasFirstPage() \u2013 You can use octokit.paginate or async iterators instead: https://github.com/octokit/rest.js#pagination.`);
      return getPageLinks(link).first;
    }
  }
});

// node_modules/octokit-pagination-methods/lib/has-last-page.js
var require_has_last_page = __commonJS({
  "node_modules/octokit-pagination-methods/lib/has-last-page.js"(exports2, module2) {
    module2.exports = hasLastPage;
    var deprecate = require_deprecate();
    var getPageLinks = require_get_page_links();
    function hasLastPage(link) {
      deprecate(`octokit.hasLastPage() \u2013 You can use octokit.paginate or async iterators instead: https://github.com/octokit/rest.js#pagination.`);
      return getPageLinks(link).last;
    }
  }
});

// node_modules/octokit-pagination-methods/lib/has-next-page.js
var require_has_next_page = __commonJS({
  "node_modules/octokit-pagination-methods/lib/has-next-page.js"(exports2, module2) {
    module2.exports = hasNextPage;
    var deprecate = require_deprecate();
    var getPageLinks = require_get_page_links();
    function hasNextPage(link) {
      deprecate(`octokit.hasNextPage() \u2013 You can use octokit.paginate or async iterators instead: https://github.com/octokit/rest.js#pagination.`);
      return getPageLinks(link).next;
    }
  }
});

// node_modules/octokit-pagination-methods/lib/has-previous-page.js
var require_has_previous_page = __commonJS({
  "node_modules/octokit-pagination-methods/lib/has-previous-page.js"(exports2, module2) {
    module2.exports = hasPreviousPage;
    var deprecate = require_deprecate();
    var getPageLinks = require_get_page_links();
    function hasPreviousPage(link) {
      deprecate(`octokit.hasPreviousPage() \u2013 You can use octokit.paginate or async iterators instead: https://github.com/octokit/rest.js#pagination.`);
      return getPageLinks(link).prev;
    }
  }
});

// node_modules/octokit-pagination-methods/index.js
var require_octokit_pagination_methods = __commonJS({
  "node_modules/octokit-pagination-methods/index.js"(exports2, module2) {
    module2.exports = paginationMethodsPlugin;
    function paginationMethodsPlugin(octokit) {
      octokit.getFirstPage = require_get_first_page().bind(null, octokit);
      octokit.getLastPage = require_get_last_page().bind(null, octokit);
      octokit.getNextPage = require_get_next_page().bind(null, octokit);
      octokit.getPreviousPage = require_get_previous_page().bind(null, octokit);
      octokit.hasFirstPage = require_has_first_page();
      octokit.hasLastPage = require_has_last_page();
      octokit.hasNextPage = require_has_next_page();
      octokit.hasPreviousPage = require_has_previous_page();
    }
  }
});

// node_modules/@octokit/rest/index.js
var require_rest = __commonJS({
  "node_modules/@octokit/rest/index.js"(exports2, module2) {
    var { requestLog } = require_dist_node12();
    var {
      restEndpointMethods
    } = require_dist_node13();
    var Core = require_core3();
    var CORE_PLUGINS = [
      require_authentication(),
      require_authentication_deprecated(),
      requestLog,
      require_pagination(),
      restEndpointMethods,
      require_validate3(),
      require_octokit_pagination_methods()
    ];
    var OctokitRest = Core.plugin(CORE_PLUGINS);
    function DeprecatedOctokit(options) {
      const warn = options && options.log && options.log.warn ? options.log.warn : console.warn;
      warn('[@octokit/rest] `const Octokit = require("@octokit/rest")` is deprecated. Use `const { Octokit } = require("@octokit/rest")` instead');
      return new OctokitRest(options);
    }
    var Octokit = Object.assign(DeprecatedOctokit, {
      Octokit: OctokitRest
    });
    Object.keys(OctokitRest).forEach((key) => {
      if (OctokitRest.hasOwnProperty(key)) {
        Octokit[key] = OctokitRest[key];
      }
    });
    module2.exports = Octokit;
  }
});

// node_modules/checkout/node_modules/@actions/github/lib/context.js
var require_context2 = __commonJS({
  "node_modules/checkout/node_modules/@actions/github/lib/context.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    var fs_1 = require("fs");
    var os_1 = require("os");
    var Context = class {
      constructor() {
        this.payload = {};
        if (process.env.GITHUB_EVENT_PATH) {
          if (fs_1.existsSync(process.env.GITHUB_EVENT_PATH)) {
            this.payload = JSON.parse(fs_1.readFileSync(process.env.GITHUB_EVENT_PATH, { encoding: "utf8" }));
          } else {
            const path7 = process.env.GITHUB_EVENT_PATH;
            process.stdout.write(`GITHUB_EVENT_PATH ${path7} does not exist${os_1.EOL}`);
          }
        }
        this.eventName = process.env.GITHUB_EVENT_NAME;
        this.sha = process.env.GITHUB_SHA;
        this.ref = process.env.GITHUB_REF;
        this.workflow = process.env.GITHUB_WORKFLOW;
        this.action = process.env.GITHUB_ACTION;
        this.actor = process.env.GITHUB_ACTOR;
      }
      get issue() {
        const payload = this.payload;
        return Object.assign(Object.assign({}, this.repo), { number: (payload.issue || payload.pull_request || payload).number });
      }
      get repo() {
        if (process.env.GITHUB_REPOSITORY) {
          const [owner, repo] = process.env.GITHUB_REPOSITORY.split("/");
          return { owner, repo };
        }
        if (this.payload.repository) {
          return {
            owner: this.payload.repository.owner.login,
            repo: this.payload.repository.name
          };
        }
        throw new Error("context.repo requires a GITHUB_REPOSITORY environment variable like 'owner/repo'");
      }
    };
    exports2.Context = Context;
  }
});

// node_modules/checkout/node_modules/@actions/github/lib/github.js
var require_github2 = __commonJS({
  "node_modules/checkout/node_modules/@actions/github/lib/github.js"(exports2) {
    "use strict";
    var __importStar = exports2 && exports2.__importStar || function(mod) {
      if (mod && mod.__esModule)
        return mod;
      var result = {};
      if (mod != null) {
        for (var k in mod)
          if (Object.hasOwnProperty.call(mod, k))
            result[k] = mod[k];
      }
      result["default"] = mod;
      return result;
    };
    Object.defineProperty(exports2, "__esModule", { value: true });
    var graphql_1 = require_dist_node11();
    var rest_1 = require_rest();
    var Context = __importStar(require_context2());
    var httpClient = __importStar(require_http_client());
    rest_1.Octokit.prototype = new rest_1.Octokit();
    exports2.context = new Context.Context();
    var GitHub3 = class extends rest_1.Octokit {
      constructor(token, opts) {
        super(GitHub3.getOctokitOptions(GitHub3.disambiguate(token, opts)));
        this.graphql = GitHub3.getGraphQL(GitHub3.disambiguate(token, opts));
      }
      static disambiguate(token, opts) {
        return [
          typeof token === "string" ? token : "",
          typeof token === "object" ? token : opts || {}
        ];
      }
      static getOctokitOptions(args) {
        const token = args[0];
        const options = Object.assign({}, args[1]);
        options.baseUrl = options.baseUrl || this.getApiBaseUrl();
        const auth = GitHub3.getAuthString(token, options);
        if (auth) {
          options.auth = auth;
        }
        const agent = GitHub3.getProxyAgent(options.baseUrl, options);
        if (agent) {
          options.request = options.request ? Object.assign({}, options.request) : {};
          options.request.agent = agent;
        }
        return options;
      }
      static getGraphQL(args) {
        const defaults = {};
        defaults.baseUrl = this.getGraphQLBaseUrl();
        const token = args[0];
        const options = args[1];
        const auth = this.getAuthString(token, options);
        if (auth) {
          defaults.headers = {
            authorization: auth
          };
        }
        const agent = GitHub3.getProxyAgent(defaults.baseUrl, options);
        if (agent) {
          defaults.request = { agent };
        }
        return graphql_1.graphql.defaults(defaults);
      }
      static getAuthString(token, options) {
        if (!token && !options.auth) {
          throw new Error("Parameter token or opts.auth is required");
        } else if (token && options.auth) {
          throw new Error("Parameters token and opts.auth may not both be specified");
        }
        return typeof options.auth === "string" ? options.auth : `token ${token}`;
      }
      static getProxyAgent(destinationUrl, options) {
        var _a;
        if (!((_a = options.request) === null || _a === void 0 ? void 0 : _a.agent)) {
          if (httpClient.getProxyUrl(destinationUrl)) {
            const hc = new httpClient.HttpClient();
            return hc.getAgent(destinationUrl);
          }
        }
        return void 0;
      }
      static getApiBaseUrl() {
        return process.env["GITHUB_API_URL"] || "https://api.github.com";
      }
      static getGraphQLBaseUrl() {
        let url = process.env["GITHUB_GRAPHQL_URL"] || "https://api.github.com/graphql";
        if (url.endsWith("/")) {
          url = url.substr(0, url.length - 1);
        }
        if (url.toUpperCase().endsWith("/GRAPHQL")) {
          url = url.substr(0, url.length - "/graphql".length);
        }
        return url;
      }
    };
    exports2.GitHub = GitHub3;
  }
});

// node_modules/@actions/tool-cache/node_modules/@actions/core/lib/utils.js
var require_utils5 = __commonJS({
  "node_modules/@actions/tool-cache/node_modules/@actions/core/lib/utils.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.toCommandValue = void 0;
    function toCommandValue(input) {
      if (input === null || input === void 0) {
        return "";
      } else if (typeof input === "string" || input instanceof String) {
        return input;
      }
      return JSON.stringify(input);
    }
    exports2.toCommandValue = toCommandValue;
  }
});

// node_modules/@actions/tool-cache/node_modules/@actions/core/lib/command.js
var require_command3 = __commonJS({
  "node_modules/@actions/tool-cache/node_modules/@actions/core/lib/command.js"(exports2) {
    "use strict";
    var __createBinding = exports2 && exports2.__createBinding || (Object.create ? function(o, m, k, k2) {
      if (k2 === void 0)
        k2 = k;
      Object.defineProperty(o, k2, { enumerable: true, get: function() {
        return m[k];
      } });
    } : function(o, m, k, k2) {
      if (k2 === void 0)
        k2 = k;
      o[k2] = m[k];
    });
    var __setModuleDefault = exports2 && exports2.__setModuleDefault || (Object.create ? function(o, v) {
      Object.defineProperty(o, "default", { enumerable: true, value: v });
    } : function(o, v) {
      o["default"] = v;
    });
    var __importStar = exports2 && exports2.__importStar || function(mod) {
      if (mod && mod.__esModule)
        return mod;
      var result = {};
      if (mod != null) {
        for (var k in mod)
          if (k !== "default" && Object.hasOwnProperty.call(mod, k))
            __createBinding(result, mod, k);
      }
      __setModuleDefault(result, mod);
      return result;
    };
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.issue = exports2.issueCommand = void 0;
    var os2 = __importStar(require("os"));
    var utils_1 = require_utils5();
    function issueCommand2(command, properties, message) {
      const cmd = new Command(command, properties, message);
      process.stdout.write(cmd.toString() + os2.EOL);
    }
    exports2.issueCommand = issueCommand2;
    function issue(name, message = "") {
      issueCommand2(name, {}, message);
    }
    exports2.issue = issue;
    var CMD_STRING = "::";
    var Command = class {
      constructor(command, properties, message) {
        if (!command) {
          command = "missing.command";
        }
        this.command = command;
        this.properties = properties;
        this.message = message;
      }
      toString() {
        let cmdStr = CMD_STRING + this.command;
        if (this.properties && Object.keys(this.properties).length > 0) {
          cmdStr += " ";
          let first = true;
          for (const key in this.properties) {
            if (this.properties.hasOwnProperty(key)) {
              const val = this.properties[key];
              if (val) {
                if (first) {
                  first = false;
                } else {
                  cmdStr += ",";
                }
                cmdStr += `${key}=${escapeProperty(val)}`;
              }
            }
          }
        }
        cmdStr += `${CMD_STRING}${escapeData(this.message)}`;
        return cmdStr;
      }
    };
    function escapeData(s) {
      return utils_1.toCommandValue(s).replace(/%/g, "%25").replace(/\r/g, "%0D").replace(/\n/g, "%0A");
    }
    function escapeProperty(s) {
      return utils_1.toCommandValue(s).replace(/%/g, "%25").replace(/\r/g, "%0D").replace(/\n/g, "%0A").replace(/:/g, "%3A").replace(/,/g, "%2C");
    }
  }
});

// node_modules/@actions/tool-cache/node_modules/@actions/core/lib/file-command.js
var require_file_command3 = __commonJS({
  "node_modules/@actions/tool-cache/node_modules/@actions/core/lib/file-command.js"(exports2) {
    "use strict";
    var __createBinding = exports2 && exports2.__createBinding || (Object.create ? function(o, m, k, k2) {
      if (k2 === void 0)
        k2 = k;
      Object.defineProperty(o, k2, { enumerable: true, get: function() {
        return m[k];
      } });
    } : function(o, m, k, k2) {
      if (k2 === void 0)
        k2 = k;
      o[k2] = m[k];
    });
    var __setModuleDefault = exports2 && exports2.__setModuleDefault || (Object.create ? function(o, v) {
      Object.defineProperty(o, "default", { enumerable: true, value: v });
    } : function(o, v) {
      o["default"] = v;
    });
    var __importStar = exports2 && exports2.__importStar || function(mod) {
      if (mod && mod.__esModule)
        return mod;
      var result = {};
      if (mod != null) {
        for (var k in mod)
          if (k !== "default" && Object.hasOwnProperty.call(mod, k))
            __createBinding(result, mod, k);
      }
      __setModuleDefault(result, mod);
      return result;
    };
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.issueCommand = void 0;
    var fs6 = __importStar(require("fs"));
    var os2 = __importStar(require("os"));
    var utils_1 = require_utils5();
    function issueCommand2(command, message) {
      const filePath = process.env[`GITHUB_${command}`];
      if (!filePath) {
        throw new Error(`Unable to find environment variable for file command ${command}`);
      }
      if (!fs6.existsSync(filePath)) {
        throw new Error(`Missing file at path: ${filePath}`);
      }
      fs6.appendFileSync(filePath, `${utils_1.toCommandValue(message)}${os2.EOL}`, {
        encoding: "utf8"
      });
    }
    exports2.issueCommand = issueCommand2;
  }
});

// node_modules/@actions/tool-cache/node_modules/@actions/core/lib/core.js
var require_core4 = __commonJS({
  "node_modules/@actions/tool-cache/node_modules/@actions/core/lib/core.js"(exports2) {
    "use strict";
    var __createBinding = exports2 && exports2.__createBinding || (Object.create ? function(o, m, k, k2) {
      if (k2 === void 0)
        k2 = k;
      Object.defineProperty(o, k2, { enumerable: true, get: function() {
        return m[k];
      } });
    } : function(o, m, k, k2) {
      if (k2 === void 0)
        k2 = k;
      o[k2] = m[k];
    });
    var __setModuleDefault = exports2 && exports2.__setModuleDefault || (Object.create ? function(o, v) {
      Object.defineProperty(o, "default", { enumerable: true, value: v });
    } : function(o, v) {
      o["default"] = v;
    });
    var __importStar = exports2 && exports2.__importStar || function(mod) {
      if (mod && mod.__esModule)
        return mod;
      var result = {};
      if (mod != null) {
        for (var k in mod)
          if (k !== "default" && Object.hasOwnProperty.call(mod, k))
            __createBinding(result, mod, k);
      }
      __setModuleDefault(result, mod);
      return result;
    };
    var __awaiter = exports2 && exports2.__awaiter || function(thisArg, _arguments, P, generator) {
      function adopt(value) {
        return value instanceof P ? value : new P(function(resolve2) {
          resolve2(value);
        });
      }
      return new (P || (P = Promise))(function(resolve2, reject) {
        function fulfilled(value) {
          try {
            step(generator.next(value));
          } catch (e) {
            reject(e);
          }
        }
        function rejected(value) {
          try {
            step(generator["throw"](value));
          } catch (e) {
            reject(e);
          }
        }
        function step(result) {
          result.done ? resolve2(result.value) : adopt(result.value).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
      });
    };
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.getState = exports2.saveState = exports2.group = exports2.endGroup = exports2.startGroup = exports2.info = exports2.warning = exports2.error = exports2.debug = exports2.isDebug = exports2.setFailed = exports2.setCommandEcho = exports2.setOutput = exports2.getBooleanInput = exports2.getMultilineInput = exports2.getInput = exports2.addPath = exports2.setSecret = exports2.exportVariable = exports2.ExitCode = void 0;
    var command_1 = require_command3();
    var file_command_1 = require_file_command3();
    var utils_1 = require_utils5();
    var os2 = __importStar(require("os"));
    var path7 = __importStar(require("path"));
    var ExitCode;
    (function(ExitCode2) {
      ExitCode2[ExitCode2["Success"] = 0] = "Success";
      ExitCode2[ExitCode2["Failure"] = 1] = "Failure";
    })(ExitCode = exports2.ExitCode || (exports2.ExitCode = {}));
    function exportVariable(name, val) {
      const convertedVal = utils_1.toCommandValue(val);
      process.env[name] = convertedVal;
      const filePath = process.env["GITHUB_ENV"] || "";
      if (filePath) {
        const delimiter = "_GitHubActionsFileCommandDelimeter_";
        const commandValue = `${name}<<${delimiter}${os2.EOL}${convertedVal}${os2.EOL}${delimiter}`;
        file_command_1.issueCommand("ENV", commandValue);
      } else {
        command_1.issueCommand("set-env", { name }, convertedVal);
      }
    }
    exports2.exportVariable = exportVariable;
    function setSecret2(secret) {
      command_1.issueCommand("add-mask", {}, secret);
    }
    exports2.setSecret = setSecret2;
    function addPath(inputPath) {
      const filePath = process.env["GITHUB_PATH"] || "";
      if (filePath) {
        file_command_1.issueCommand("PATH", inputPath);
      } else {
        command_1.issueCommand("add-path", {}, inputPath);
      }
      process.env["PATH"] = `${inputPath}${path7.delimiter}${process.env["PATH"]}`;
    }
    exports2.addPath = addPath;
    function getInput5(name, options) {
      const val = process.env[`INPUT_${name.replace(/ /g, "_").toUpperCase()}`] || "";
      if (options && options.required && !val) {
        throw new Error(`Input required and not supplied: ${name}`);
      }
      if (options && options.trimWhitespace === false) {
        return val;
      }
      return val.trim();
    }
    exports2.getInput = getInput5;
    function getMultilineInput(name, options) {
      const inputs = getInput5(name, options).split("\n").filter((x) => x !== "");
      return inputs;
    }
    exports2.getMultilineInput = getMultilineInput;
    function getBooleanInput2(name, options) {
      const trueValue = ["true", "True", "TRUE"];
      const falseValue = ["false", "False", "FALSE"];
      const val = getInput5(name, options);
      if (trueValue.includes(val))
        return true;
      if (falseValue.includes(val))
        return false;
      throw new TypeError(`Input does not meet YAML 1.2 "Core Schema" specification: ${name}
Support boolean input list: \`true | True | TRUE | false | False | FALSE\``);
    }
    exports2.getBooleanInput = getBooleanInput2;
    function setOutput(name, value) {
      process.stdout.write(os2.EOL);
      command_1.issueCommand("set-output", { name }, value);
    }
    exports2.setOutput = setOutput;
    function setCommandEcho(enabled) {
      command_1.issue("echo", enabled ? "on" : "off");
    }
    exports2.setCommandEcho = setCommandEcho;
    function setFailed2(message) {
      process.exitCode = ExitCode.Failure;
      error(message);
    }
    exports2.setFailed = setFailed2;
    function isDebug() {
      return process.env["RUNNER_DEBUG"] === "1";
    }
    exports2.isDebug = isDebug;
    function debug6(message) {
      command_1.issueCommand("debug", {}, message);
    }
    exports2.debug = debug6;
    function error(message) {
      command_1.issue("error", message instanceof Error ? message.toString() : message);
    }
    exports2.error = error;
    function warning6(message) {
      command_1.issue("warning", message instanceof Error ? message.toString() : message);
    }
    exports2.warning = warning6;
    function info10(message) {
      process.stdout.write(message + os2.EOL);
    }
    exports2.info = info10;
    function startGroup4(name) {
      command_1.issue("group", name);
    }
    exports2.startGroup = startGroup4;
    function endGroup4() {
      command_1.issue("endgroup");
    }
    exports2.endGroup = endGroup4;
    function group(name, fn) {
      return __awaiter(this, void 0, void 0, function* () {
        startGroup4(name);
        let result;
        try {
          result = yield fn();
        } finally {
          endGroup4();
        }
        return result;
      });
    }
    exports2.group = group;
    function saveState(name, value) {
      command_1.issueCommand("save-state", { name }, value);
    }
    exports2.saveState = saveState;
    function getState(name) {
      return process.env[`STATE_${name}`] || "";
    }
    exports2.getState = getState;
  }
});

// node_modules/@actions/tool-cache/node_modules/semver/semver.js
var require_semver2 = __commonJS({
  "node_modules/@actions/tool-cache/node_modules/semver/semver.js"(exports2, module2) {
    exports2 = module2.exports = SemVer;
    var debug6;
    if (typeof process === "object" && process.env && process.env.NODE_DEBUG && /\bsemver\b/i.test(process.env.NODE_DEBUG)) {
      debug6 = function() {
        var args = Array.prototype.slice.call(arguments, 0);
        args.unshift("SEMVER");
        console.log.apply(console, args);
      };
    } else {
      debug6 = function() {
      };
    }
    exports2.SEMVER_SPEC_VERSION = "2.0.0";
    var MAX_LENGTH = 256;
    var MAX_SAFE_INTEGER = Number.MAX_SAFE_INTEGER || 9007199254740991;
    var MAX_SAFE_COMPONENT_LENGTH = 16;
    var re = exports2.re = [];
    var src = exports2.src = [];
    var t = exports2.tokens = {};
    var R = 0;
    function tok(n) {
      t[n] = R++;
    }
    tok("NUMERICIDENTIFIER");
    src[t.NUMERICIDENTIFIER] = "0|[1-9]\\d*";
    tok("NUMERICIDENTIFIERLOOSE");
    src[t.NUMERICIDENTIFIERLOOSE] = "[0-9]+";
    tok("NONNUMERICIDENTIFIER");
    src[t.NONNUMERICIDENTIFIER] = "\\d*[a-zA-Z-][a-zA-Z0-9-]*";
    tok("MAINVERSION");
    src[t.MAINVERSION] = "(" + src[t.NUMERICIDENTIFIER] + ")\\.(" + src[t.NUMERICIDENTIFIER] + ")\\.(" + src[t.NUMERICIDENTIFIER] + ")";
    tok("MAINVERSIONLOOSE");
    src[t.MAINVERSIONLOOSE] = "(" + src[t.NUMERICIDENTIFIERLOOSE] + ")\\.(" + src[t.NUMERICIDENTIFIERLOOSE] + ")\\.(" + src[t.NUMERICIDENTIFIERLOOSE] + ")";
    tok("PRERELEASEIDENTIFIER");
    src[t.PRERELEASEIDENTIFIER] = "(?:" + src[t.NUMERICIDENTIFIER] + "|" + src[t.NONNUMERICIDENTIFIER] + ")";
    tok("PRERELEASEIDENTIFIERLOOSE");
    src[t.PRERELEASEIDENTIFIERLOOSE] = "(?:" + src[t.NUMERICIDENTIFIERLOOSE] + "|" + src[t.NONNUMERICIDENTIFIER] + ")";
    tok("PRERELEASE");
    src[t.PRERELEASE] = "(?:-(" + src[t.PRERELEASEIDENTIFIER] + "(?:\\." + src[t.PRERELEASEIDENTIFIER] + ")*))";
    tok("PRERELEASELOOSE");
    src[t.PRERELEASELOOSE] = "(?:-?(" + src[t.PRERELEASEIDENTIFIERLOOSE] + "(?:\\." + src[t.PRERELEASEIDENTIFIERLOOSE] + ")*))";
    tok("BUILDIDENTIFIER");
    src[t.BUILDIDENTIFIER] = "[0-9A-Za-z-]+";
    tok("BUILD");
    src[t.BUILD] = "(?:\\+(" + src[t.BUILDIDENTIFIER] + "(?:\\." + src[t.BUILDIDENTIFIER] + ")*))";
    tok("FULL");
    tok("FULLPLAIN");
    src[t.FULLPLAIN] = "v?" + src[t.MAINVERSION] + src[t.PRERELEASE] + "?" + src[t.BUILD] + "?";
    src[t.FULL] = "^" + src[t.FULLPLAIN] + "$";
    tok("LOOSEPLAIN");
    src[t.LOOSEPLAIN] = "[v=\\s]*" + src[t.MAINVERSIONLOOSE] + src[t.PRERELEASELOOSE] + "?" + src[t.BUILD] + "?";
    tok("LOOSE");
    src[t.LOOSE] = "^" + src[t.LOOSEPLAIN] + "$";
    tok("GTLT");
    src[t.GTLT] = "((?:<|>)?=?)";
    tok("XRANGEIDENTIFIERLOOSE");
    src[t.XRANGEIDENTIFIERLOOSE] = src[t.NUMERICIDENTIFIERLOOSE] + "|x|X|\\*";
    tok("XRANGEIDENTIFIER");
    src[t.XRANGEIDENTIFIER] = src[t.NUMERICIDENTIFIER] + "|x|X|\\*";
    tok("XRANGEPLAIN");
    src[t.XRANGEPLAIN] = "[v=\\s]*(" + src[t.XRANGEIDENTIFIER] + ")(?:\\.(" + src[t.XRANGEIDENTIFIER] + ")(?:\\.(" + src[t.XRANGEIDENTIFIER] + ")(?:" + src[t.PRERELEASE] + ")?" + src[t.BUILD] + "?)?)?";
    tok("XRANGEPLAINLOOSE");
    src[t.XRANGEPLAINLOOSE] = "[v=\\s]*(" + src[t.XRANGEIDENTIFIERLOOSE] + ")(?:\\.(" + src[t.XRANGEIDENTIFIERLOOSE] + ")(?:\\.(" + src[t.XRANGEIDENTIFIERLOOSE] + ")(?:" + src[t.PRERELEASELOOSE] + ")?" + src[t.BUILD] + "?)?)?";
    tok("XRANGE");
    src[t.XRANGE] = "^" + src[t.GTLT] + "\\s*" + src[t.XRANGEPLAIN] + "$";
    tok("XRANGELOOSE");
    src[t.XRANGELOOSE] = "^" + src[t.GTLT] + "\\s*" + src[t.XRANGEPLAINLOOSE] + "$";
    tok("COERCE");
    src[t.COERCE] = "(^|[^\\d])(\\d{1," + MAX_SAFE_COMPONENT_LENGTH + "})(?:\\.(\\d{1," + MAX_SAFE_COMPONENT_LENGTH + "}))?(?:\\.(\\d{1," + MAX_SAFE_COMPONENT_LENGTH + "}))?(?:$|[^\\d])";
    tok("COERCERTL");
    re[t.COERCERTL] = new RegExp(src[t.COERCE], "g");
    tok("LONETILDE");
    src[t.LONETILDE] = "(?:~>?)";
    tok("TILDETRIM");
    src[t.TILDETRIM] = "(\\s*)" + src[t.LONETILDE] + "\\s+";
    re[t.TILDETRIM] = new RegExp(src[t.TILDETRIM], "g");
    var tildeTrimReplace = "$1~";
    tok("TILDE");
    src[t.TILDE] = "^" + src[t.LONETILDE] + src[t.XRANGEPLAIN] + "$";
    tok("TILDELOOSE");
    src[t.TILDELOOSE] = "^" + src[t.LONETILDE] + src[t.XRANGEPLAINLOOSE] + "$";
    tok("LONECARET");
    src[t.LONECARET] = "(?:\\^)";
    tok("CARETTRIM");
    src[t.CARETTRIM] = "(\\s*)" + src[t.LONECARET] + "\\s+";
    re[t.CARETTRIM] = new RegExp(src[t.CARETTRIM], "g");
    var caretTrimReplace = "$1^";
    tok("CARET");
    src[t.CARET] = "^" + src[t.LONECARET] + src[t.XRANGEPLAIN] + "$";
    tok("CARETLOOSE");
    src[t.CARETLOOSE] = "^" + src[t.LONECARET] + src[t.XRANGEPLAINLOOSE] + "$";
    tok("COMPARATORLOOSE");
    src[t.COMPARATORLOOSE] = "^" + src[t.GTLT] + "\\s*(" + src[t.LOOSEPLAIN] + ")$|^$";
    tok("COMPARATOR");
    src[t.COMPARATOR] = "^" + src[t.GTLT] + "\\s*(" + src[t.FULLPLAIN] + ")$|^$";
    tok("COMPARATORTRIM");
    src[t.COMPARATORTRIM] = "(\\s*)" + src[t.GTLT] + "\\s*(" + src[t.LOOSEPLAIN] + "|" + src[t.XRANGEPLAIN] + ")";
    re[t.COMPARATORTRIM] = new RegExp(src[t.COMPARATORTRIM], "g");
    var comparatorTrimReplace = "$1$2$3";
    tok("HYPHENRANGE");
    src[t.HYPHENRANGE] = "^\\s*(" + src[t.XRANGEPLAIN] + ")\\s+-\\s+(" + src[t.XRANGEPLAIN] + ")\\s*$";
    tok("HYPHENRANGELOOSE");
    src[t.HYPHENRANGELOOSE] = "^\\s*(" + src[t.XRANGEPLAINLOOSE] + ")\\s+-\\s+(" + src[t.XRANGEPLAINLOOSE] + ")\\s*$";
    tok("STAR");
    src[t.STAR] = "(<|>)?=?\\s*\\*";
    for (i = 0; i < R; i++) {
      debug6(i, src[i]);
      if (!re[i]) {
        re[i] = new RegExp(src[i]);
      }
    }
    var i;
    exports2.parse = parse;
    function parse(version, options) {
      if (!options || typeof options !== "object") {
        options = {
          loose: !!options,
          includePrerelease: false
        };
      }
      if (version instanceof SemVer) {
        return version;
      }
      if (typeof version !== "string") {
        return null;
      }
      if (version.length > MAX_LENGTH) {
        return null;
      }
      var r = options.loose ? re[t.LOOSE] : re[t.FULL];
      if (!r.test(version)) {
        return null;
      }
      try {
        return new SemVer(version, options);
      } catch (er) {
        return null;
      }
    }
    exports2.valid = valid;
    function valid(version, options) {
      var v = parse(version, options);
      return v ? v.version : null;
    }
    exports2.clean = clean;
    function clean(version, options) {
      var s = parse(version.trim().replace(/^[=v]+/, ""), options);
      return s ? s.version : null;
    }
    exports2.SemVer = SemVer;
    function SemVer(version, options) {
      if (!options || typeof options !== "object") {
        options = {
          loose: !!options,
          includePrerelease: false
        };
      }
      if (version instanceof SemVer) {
        if (version.loose === options.loose) {
          return version;
        } else {
          version = version.version;
        }
      } else if (typeof version !== "string") {
        throw new TypeError("Invalid Version: " + version);
      }
      if (version.length > MAX_LENGTH) {
        throw new TypeError("version is longer than " + MAX_LENGTH + " characters");
      }
      if (!(this instanceof SemVer)) {
        return new SemVer(version, options);
      }
      debug6("SemVer", version, options);
      this.options = options;
      this.loose = !!options.loose;
      var m = version.trim().match(options.loose ? re[t.LOOSE] : re[t.FULL]);
      if (!m) {
        throw new TypeError("Invalid Version: " + version);
      }
      this.raw = version;
      this.major = +m[1];
      this.minor = +m[2];
      this.patch = +m[3];
      if (this.major > MAX_SAFE_INTEGER || this.major < 0) {
        throw new TypeError("Invalid major version");
      }
      if (this.minor > MAX_SAFE_INTEGER || this.minor < 0) {
        throw new TypeError("Invalid minor version");
      }
      if (this.patch > MAX_SAFE_INTEGER || this.patch < 0) {
        throw new TypeError("Invalid patch version");
      }
      if (!m[4]) {
        this.prerelease = [];
      } else {
        this.prerelease = m[4].split(".").map(function(id) {
          if (/^[0-9]+$/.test(id)) {
            var num = +id;
            if (num >= 0 && num < MAX_SAFE_INTEGER) {
              return num;
            }
          }
          return id;
        });
      }
      this.build = m[5] ? m[5].split(".") : [];
      this.format();
    }
    SemVer.prototype.format = function() {
      this.version = this.major + "." + this.minor + "." + this.patch;
      if (this.prerelease.length) {
        this.version += "-" + this.prerelease.join(".");
      }
      return this.version;
    };
    SemVer.prototype.toString = function() {
      return this.version;
    };
    SemVer.prototype.compare = function(other) {
      debug6("SemVer.compare", this.version, this.options, other);
      if (!(other instanceof SemVer)) {
        other = new SemVer(other, this.options);
      }
      return this.compareMain(other) || this.comparePre(other);
    };
    SemVer.prototype.compareMain = function(other) {
      if (!(other instanceof SemVer)) {
        other = new SemVer(other, this.options);
      }
      return compareIdentifiers(this.major, other.major) || compareIdentifiers(this.minor, other.minor) || compareIdentifiers(this.patch, other.patch);
    };
    SemVer.prototype.comparePre = function(other) {
      if (!(other instanceof SemVer)) {
        other = new SemVer(other, this.options);
      }
      if (this.prerelease.length && !other.prerelease.length) {
        return -1;
      } else if (!this.prerelease.length && other.prerelease.length) {
        return 1;
      } else if (!this.prerelease.length && !other.prerelease.length) {
        return 0;
      }
      var i2 = 0;
      do {
        var a = this.prerelease[i2];
        var b = other.prerelease[i2];
        debug6("prerelease compare", i2, a, b);
        if (a === void 0 && b === void 0) {
          return 0;
        } else if (b === void 0) {
          return 1;
        } else if (a === void 0) {
          return -1;
        } else if (a === b) {
          continue;
        } else {
          return compareIdentifiers(a, b);
        }
      } while (++i2);
    };
    SemVer.prototype.compareBuild = function(other) {
      if (!(other instanceof SemVer)) {
        other = new SemVer(other, this.options);
      }
      var i2 = 0;
      do {
        var a = this.build[i2];
        var b = other.build[i2];
        debug6("prerelease compare", i2, a, b);
        if (a === void 0 && b === void 0) {
          return 0;
        } else if (b === void 0) {
          return 1;
        } else if (a === void 0) {
          return -1;
        } else if (a === b) {
          continue;
        } else {
          return compareIdentifiers(a, b);
        }
      } while (++i2);
    };
    SemVer.prototype.inc = function(release, identifier) {
      switch (release) {
        case "premajor":
          this.prerelease.length = 0;
          this.patch = 0;
          this.minor = 0;
          this.major++;
          this.inc("pre", identifier);
          break;
        case "preminor":
          this.prerelease.length = 0;
          this.patch = 0;
          this.minor++;
          this.inc("pre", identifier);
          break;
        case "prepatch":
          this.prerelease.length = 0;
          this.inc("patch", identifier);
          this.inc("pre", identifier);
          break;
        case "prerelease":
          if (this.prerelease.length === 0) {
            this.inc("patch", identifier);
          }
          this.inc("pre", identifier);
          break;
        case "major":
          if (this.minor !== 0 || this.patch !== 0 || this.prerelease.length === 0) {
            this.major++;
          }
          this.minor = 0;
          this.patch = 0;
          this.prerelease = [];
          break;
        case "minor":
          if (this.patch !== 0 || this.prerelease.length === 0) {
            this.minor++;
          }
          this.patch = 0;
          this.prerelease = [];
          break;
        case "patch":
          if (this.prerelease.length === 0) {
            this.patch++;
          }
          this.prerelease = [];
          break;
        case "pre":
          if (this.prerelease.length === 0) {
            this.prerelease = [0];
          } else {
            var i2 = this.prerelease.length;
            while (--i2 >= 0) {
              if (typeof this.prerelease[i2] === "number") {
                this.prerelease[i2]++;
                i2 = -2;
              }
            }
            if (i2 === -1) {
              this.prerelease.push(0);
            }
          }
          if (identifier) {
            if (this.prerelease[0] === identifier) {
              if (isNaN(this.prerelease[1])) {
                this.prerelease = [identifier, 0];
              }
            } else {
              this.prerelease = [identifier, 0];
            }
          }
          break;
        default:
          throw new Error("invalid increment argument: " + release);
      }
      this.format();
      this.raw = this.version;
      return this;
    };
    exports2.inc = inc;
    function inc(version, release, loose, identifier) {
      if (typeof loose === "string") {
        identifier = loose;
        loose = void 0;
      }
      try {
        return new SemVer(version, loose).inc(release, identifier).version;
      } catch (er) {
        return null;
      }
    }
    exports2.diff = diff;
    function diff(version1, version2) {
      if (eq(version1, version2)) {
        return null;
      } else {
        var v1 = parse(version1);
        var v2 = parse(version2);
        var prefix = "";
        if (v1.prerelease.length || v2.prerelease.length) {
          prefix = "pre";
          var defaultResult = "prerelease";
        }
        for (var key in v1) {
          if (key === "major" || key === "minor" || key === "patch") {
            if (v1[key] !== v2[key]) {
              return prefix + key;
            }
          }
        }
        return defaultResult;
      }
    }
    exports2.compareIdentifiers = compareIdentifiers;
    var numeric = /^[0-9]+$/;
    function compareIdentifiers(a, b) {
      var anum = numeric.test(a);
      var bnum = numeric.test(b);
      if (anum && bnum) {
        a = +a;
        b = +b;
      }
      return a === b ? 0 : anum && !bnum ? -1 : bnum && !anum ? 1 : a < b ? -1 : 1;
    }
    exports2.rcompareIdentifiers = rcompareIdentifiers;
    function rcompareIdentifiers(a, b) {
      return compareIdentifiers(b, a);
    }
    exports2.major = major;
    function major(a, loose) {
      return new SemVer(a, loose).major;
    }
    exports2.minor = minor;
    function minor(a, loose) {
      return new SemVer(a, loose).minor;
    }
    exports2.patch = patch;
    function patch(a, loose) {
      return new SemVer(a, loose).patch;
    }
    exports2.compare = compare;
    function compare(a, b, loose) {
      return new SemVer(a, loose).compare(new SemVer(b, loose));
    }
    exports2.compareLoose = compareLoose;
    function compareLoose(a, b) {
      return compare(a, b, true);
    }
    exports2.compareBuild = compareBuild;
    function compareBuild(a, b, loose) {
      var versionA = new SemVer(a, loose);
      var versionB = new SemVer(b, loose);
      return versionA.compare(versionB) || versionA.compareBuild(versionB);
    }
    exports2.rcompare = rcompare;
    function rcompare(a, b, loose) {
      return compare(b, a, loose);
    }
    exports2.sort = sort;
    function sort(list, loose) {
      return list.sort(function(a, b) {
        return exports2.compareBuild(a, b, loose);
      });
    }
    exports2.rsort = rsort;
    function rsort(list, loose) {
      return list.sort(function(a, b) {
        return exports2.compareBuild(b, a, loose);
      });
    }
    exports2.gt = gt;
    function gt(a, b, loose) {
      return compare(a, b, loose) > 0;
    }
    exports2.lt = lt;
    function lt(a, b, loose) {
      return compare(a, b, loose) < 0;
    }
    exports2.eq = eq;
    function eq(a, b, loose) {
      return compare(a, b, loose) === 0;
    }
    exports2.neq = neq;
    function neq(a, b, loose) {
      return compare(a, b, loose) !== 0;
    }
    exports2.gte = gte;
    function gte(a, b, loose) {
      return compare(a, b, loose) >= 0;
    }
    exports2.lte = lte;
    function lte(a, b, loose) {
      return compare(a, b, loose) <= 0;
    }
    exports2.cmp = cmp;
    function cmp(a, op, b, loose) {
      switch (op) {
        case "===":
          if (typeof a === "object")
            a = a.version;
          if (typeof b === "object")
            b = b.version;
          return a === b;
        case "!==":
          if (typeof a === "object")
            a = a.version;
          if (typeof b === "object")
            b = b.version;
          return a !== b;
        case "":
        case "=":
        case "==":
          return eq(a, b, loose);
        case "!=":
          return neq(a, b, loose);
        case ">":
          return gt(a, b, loose);
        case ">=":
          return gte(a, b, loose);
        case "<":
          return lt(a, b, loose);
        case "<=":
          return lte(a, b, loose);
        default:
          throw new TypeError("Invalid operator: " + op);
      }
    }
    exports2.Comparator = Comparator;
    function Comparator(comp, options) {
      if (!options || typeof options !== "object") {
        options = {
          loose: !!options,
          includePrerelease: false
        };
      }
      if (comp instanceof Comparator) {
        if (comp.loose === !!options.loose) {
          return comp;
        } else {
          comp = comp.value;
        }
      }
      if (!(this instanceof Comparator)) {
        return new Comparator(comp, options);
      }
      debug6("comparator", comp, options);
      this.options = options;
      this.loose = !!options.loose;
      this.parse(comp);
      if (this.semver === ANY) {
        this.value = "";
      } else {
        this.value = this.operator + this.semver.version;
      }
      debug6("comp", this);
    }
    var ANY = {};
    Comparator.prototype.parse = function(comp) {
      var r = this.options.loose ? re[t.COMPARATORLOOSE] : re[t.COMPARATOR];
      var m = comp.match(r);
      if (!m) {
        throw new TypeError("Invalid comparator: " + comp);
      }
      this.operator = m[1] !== void 0 ? m[1] : "";
      if (this.operator === "=") {
        this.operator = "";
      }
      if (!m[2]) {
        this.semver = ANY;
      } else {
        this.semver = new SemVer(m[2], this.options.loose);
      }
    };
    Comparator.prototype.toString = function() {
      return this.value;
    };
    Comparator.prototype.test = function(version) {
      debug6("Comparator.test", version, this.options.loose);
      if (this.semver === ANY || version === ANY) {
        return true;
      }
      if (typeof version === "string") {
        try {
          version = new SemVer(version, this.options);
        } catch (er) {
          return false;
        }
      }
      return cmp(version, this.operator, this.semver, this.options);
    };
    Comparator.prototype.intersects = function(comp, options) {
      if (!(comp instanceof Comparator)) {
        throw new TypeError("a Comparator is required");
      }
      if (!options || typeof options !== "object") {
        options = {
          loose: !!options,
          includePrerelease: false
        };
      }
      var rangeTmp;
      if (this.operator === "") {
        if (this.value === "") {
          return true;
        }
        rangeTmp = new Range(comp.value, options);
        return satisfies(this.value, rangeTmp, options);
      } else if (comp.operator === "") {
        if (comp.value === "") {
          return true;
        }
        rangeTmp = new Range(this.value, options);
        return satisfies(comp.semver, rangeTmp, options);
      }
      var sameDirectionIncreasing = (this.operator === ">=" || this.operator === ">") && (comp.operator === ">=" || comp.operator === ">");
      var sameDirectionDecreasing = (this.operator === "<=" || this.operator === "<") && (comp.operator === "<=" || comp.operator === "<");
      var sameSemVer = this.semver.version === comp.semver.version;
      var differentDirectionsInclusive = (this.operator === ">=" || this.operator === "<=") && (comp.operator === ">=" || comp.operator === "<=");
      var oppositeDirectionsLessThan = cmp(this.semver, "<", comp.semver, options) && ((this.operator === ">=" || this.operator === ">") && (comp.operator === "<=" || comp.operator === "<"));
      var oppositeDirectionsGreaterThan = cmp(this.semver, ">", comp.semver, options) && ((this.operator === "<=" || this.operator === "<") && (comp.operator === ">=" || comp.operator === ">"));
      return sameDirectionIncreasing || sameDirectionDecreasing || sameSemVer && differentDirectionsInclusive || oppositeDirectionsLessThan || oppositeDirectionsGreaterThan;
    };
    exports2.Range = Range;
    function Range(range, options) {
      if (!options || typeof options !== "object") {
        options = {
          loose: !!options,
          includePrerelease: false
        };
      }
      if (range instanceof Range) {
        if (range.loose === !!options.loose && range.includePrerelease === !!options.includePrerelease) {
          return range;
        } else {
          return new Range(range.raw, options);
        }
      }
      if (range instanceof Comparator) {
        return new Range(range.value, options);
      }
      if (!(this instanceof Range)) {
        return new Range(range, options);
      }
      this.options = options;
      this.loose = !!options.loose;
      this.includePrerelease = !!options.includePrerelease;
      this.raw = range;
      this.set = range.split(/\s*\|\|\s*/).map(function(range2) {
        return this.parseRange(range2.trim());
      }, this).filter(function(c) {
        return c.length;
      });
      if (!this.set.length) {
        throw new TypeError("Invalid SemVer Range: " + range);
      }
      this.format();
    }
    Range.prototype.format = function() {
      this.range = this.set.map(function(comps) {
        return comps.join(" ").trim();
      }).join("||").trim();
      return this.range;
    };
    Range.prototype.toString = function() {
      return this.range;
    };
    Range.prototype.parseRange = function(range) {
      var loose = this.options.loose;
      range = range.trim();
      var hr = loose ? re[t.HYPHENRANGELOOSE] : re[t.HYPHENRANGE];
      range = range.replace(hr, hyphenReplace);
      debug6("hyphen replace", range);
      range = range.replace(re[t.COMPARATORTRIM], comparatorTrimReplace);
      debug6("comparator trim", range, re[t.COMPARATORTRIM]);
      range = range.replace(re[t.TILDETRIM], tildeTrimReplace);
      range = range.replace(re[t.CARETTRIM], caretTrimReplace);
      range = range.split(/\s+/).join(" ");
      var compRe = loose ? re[t.COMPARATORLOOSE] : re[t.COMPARATOR];
      var set2 = range.split(" ").map(function(comp) {
        return parseComparator(comp, this.options);
      }, this).join(" ").split(/\s+/);
      if (this.options.loose) {
        set2 = set2.filter(function(comp) {
          return !!comp.match(compRe);
        });
      }
      set2 = set2.map(function(comp) {
        return new Comparator(comp, this.options);
      }, this);
      return set2;
    };
    Range.prototype.intersects = function(range, options) {
      if (!(range instanceof Range)) {
        throw new TypeError("a Range is required");
      }
      return this.set.some(function(thisComparators) {
        return isSatisfiable(thisComparators, options) && range.set.some(function(rangeComparators) {
          return isSatisfiable(rangeComparators, options) && thisComparators.every(function(thisComparator) {
            return rangeComparators.every(function(rangeComparator) {
              return thisComparator.intersects(rangeComparator, options);
            });
          });
        });
      });
    };
    function isSatisfiable(comparators, options) {
      var result = true;
      var remainingComparators = comparators.slice();
      var testComparator = remainingComparators.pop();
      while (result && remainingComparators.length) {
        result = remainingComparators.every(function(otherComparator) {
          return testComparator.intersects(otherComparator, options);
        });
        testComparator = remainingComparators.pop();
      }
      return result;
    }
    exports2.toComparators = toComparators;
    function toComparators(range, options) {
      return new Range(range, options).set.map(function(comp) {
        return comp.map(function(c) {
          return c.value;
        }).join(" ").trim().split(" ");
      });
    }
    function parseComparator(comp, options) {
      debug6("comp", comp, options);
      comp = replaceCarets(comp, options);
      debug6("caret", comp);
      comp = replaceTildes(comp, options);
      debug6("tildes", comp);
      comp = replaceXRanges(comp, options);
      debug6("xrange", comp);
      comp = replaceStars(comp, options);
      debug6("stars", comp);
      return comp;
    }
    function isX(id) {
      return !id || id.toLowerCase() === "x" || id === "*";
    }
    function replaceTildes(comp, options) {
      return comp.trim().split(/\s+/).map(function(comp2) {
        return replaceTilde(comp2, options);
      }).join(" ");
    }
    function replaceTilde(comp, options) {
      var r = options.loose ? re[t.TILDELOOSE] : re[t.TILDE];
      return comp.replace(r, function(_, M, m, p, pr) {
        debug6("tilde", comp, _, M, m, p, pr);
        var ret;
        if (isX(M)) {
          ret = "";
        } else if (isX(m)) {
          ret = ">=" + M + ".0.0 <" + (+M + 1) + ".0.0";
        } else if (isX(p)) {
          ret = ">=" + M + "." + m + ".0 <" + M + "." + (+m + 1) + ".0";
        } else if (pr) {
          debug6("replaceTilde pr", pr);
          ret = ">=" + M + "." + m + "." + p + "-" + pr + " <" + M + "." + (+m + 1) + ".0";
        } else {
          ret = ">=" + M + "." + m + "." + p + " <" + M + "." + (+m + 1) + ".0";
        }
        debug6("tilde return", ret);
        return ret;
      });
    }
    function replaceCarets(comp, options) {
      return comp.trim().split(/\s+/).map(function(comp2) {
        return replaceCaret(comp2, options);
      }).join(" ");
    }
    function replaceCaret(comp, options) {
      debug6("caret", comp, options);
      var r = options.loose ? re[t.CARETLOOSE] : re[t.CARET];
      return comp.replace(r, function(_, M, m, p, pr) {
        debug6("caret", comp, _, M, m, p, pr);
        var ret;
        if (isX(M)) {
          ret = "";
        } else if (isX(m)) {
          ret = ">=" + M + ".0.0 <" + (+M + 1) + ".0.0";
        } else if (isX(p)) {
          if (M === "0") {
            ret = ">=" + M + "." + m + ".0 <" + M + "." + (+m + 1) + ".0";
          } else {
            ret = ">=" + M + "." + m + ".0 <" + (+M + 1) + ".0.0";
          }
        } else if (pr) {
          debug6("replaceCaret pr", pr);
          if (M === "0") {
            if (m === "0") {
              ret = ">=" + M + "." + m + "." + p + "-" + pr + " <" + M + "." + m + "." + (+p + 1);
            } else {
              ret = ">=" + M + "." + m + "." + p + "-" + pr + " <" + M + "." + (+m + 1) + ".0";
            }
          } else {
            ret = ">=" + M + "." + m + "." + p + "-" + pr + " <" + (+M + 1) + ".0.0";
          }
        } else {
          debug6("no pr");
          if (M === "0") {
            if (m === "0") {
              ret = ">=" + M + "." + m + "." + p + " <" + M + "." + m + "." + (+p + 1);
            } else {
              ret = ">=" + M + "." + m + "." + p + " <" + M + "." + (+m + 1) + ".0";
            }
          } else {
            ret = ">=" + M + "." + m + "." + p + " <" + (+M + 1) + ".0.0";
          }
        }
        debug6("caret return", ret);
        return ret;
      });
    }
    function replaceXRanges(comp, options) {
      debug6("replaceXRanges", comp, options);
      return comp.split(/\s+/).map(function(comp2) {
        return replaceXRange(comp2, options);
      }).join(" ");
    }
    function replaceXRange(comp, options) {
      comp = comp.trim();
      var r = options.loose ? re[t.XRANGELOOSE] : re[t.XRANGE];
      return comp.replace(r, function(ret, gtlt, M, m, p, pr) {
        debug6("xRange", comp, ret, gtlt, M, m, p, pr);
        var xM = isX(M);
        var xm = xM || isX(m);
        var xp = xm || isX(p);
        var anyX = xp;
        if (gtlt === "=" && anyX) {
          gtlt = "";
        }
        pr = options.includePrerelease ? "-0" : "";
        if (xM) {
          if (gtlt === ">" || gtlt === "<") {
            ret = "<0.0.0-0";
          } else {
            ret = "*";
          }
        } else if (gtlt && anyX) {
          if (xm) {
            m = 0;
          }
          p = 0;
          if (gtlt === ">") {
            gtlt = ">=";
            if (xm) {
              M = +M + 1;
              m = 0;
              p = 0;
            } else {
              m = +m + 1;
              p = 0;
            }
          } else if (gtlt === "<=") {
            gtlt = "<";
            if (xm) {
              M = +M + 1;
            } else {
              m = +m + 1;
            }
          }
          ret = gtlt + M + "." + m + "." + p + pr;
        } else if (xm) {
          ret = ">=" + M + ".0.0" + pr + " <" + (+M + 1) + ".0.0" + pr;
        } else if (xp) {
          ret = ">=" + M + "." + m + ".0" + pr + " <" + M + "." + (+m + 1) + ".0" + pr;
        }
        debug6("xRange return", ret);
        return ret;
      });
    }
    function replaceStars(comp, options) {
      debug6("replaceStars", comp, options);
      return comp.trim().replace(re[t.STAR], "");
    }
    function hyphenReplace($0, from, fM, fm, fp, fpr, fb, to, tM, tm, tp, tpr, tb) {
      if (isX(fM)) {
        from = "";
      } else if (isX(fm)) {
        from = ">=" + fM + ".0.0";
      } else if (isX(fp)) {
        from = ">=" + fM + "." + fm + ".0";
      } else {
        from = ">=" + from;
      }
      if (isX(tM)) {
        to = "";
      } else if (isX(tm)) {
        to = "<" + (+tM + 1) + ".0.0";
      } else if (isX(tp)) {
        to = "<" + tM + "." + (+tm + 1) + ".0";
      } else if (tpr) {
        to = "<=" + tM + "." + tm + "." + tp + "-" + tpr;
      } else {
        to = "<=" + to;
      }
      return (from + " " + to).trim();
    }
    Range.prototype.test = function(version) {
      if (!version) {
        return false;
      }
      if (typeof version === "string") {
        try {
          version = new SemVer(version, this.options);
        } catch (er) {
          return false;
        }
      }
      for (var i2 = 0; i2 < this.set.length; i2++) {
        if (testSet(this.set[i2], version, this.options)) {
          return true;
        }
      }
      return false;
    };
    function testSet(set2, version, options) {
      for (var i2 = 0; i2 < set2.length; i2++) {
        if (!set2[i2].test(version)) {
          return false;
        }
      }
      if (version.prerelease.length && !options.includePrerelease) {
        for (i2 = 0; i2 < set2.length; i2++) {
          debug6(set2[i2].semver);
          if (set2[i2].semver === ANY) {
            continue;
          }
          if (set2[i2].semver.prerelease.length > 0) {
            var allowed = set2[i2].semver;
            if (allowed.major === version.major && allowed.minor === version.minor && allowed.patch === version.patch) {
              return true;
            }
          }
        }
        return false;
      }
      return true;
    }
    exports2.satisfies = satisfies;
    function satisfies(version, range, options) {
      try {
        range = new Range(range, options);
      } catch (er) {
        return false;
      }
      return range.test(version);
    }
    exports2.maxSatisfying = maxSatisfying;
    function maxSatisfying(versions, range, options) {
      var max = null;
      var maxSV = null;
      try {
        var rangeObj = new Range(range, options);
      } catch (er) {
        return null;
      }
      versions.forEach(function(v) {
        if (rangeObj.test(v)) {
          if (!max || maxSV.compare(v) === -1) {
            max = v;
            maxSV = new SemVer(max, options);
          }
        }
      });
      return max;
    }
    exports2.minSatisfying = minSatisfying;
    function minSatisfying(versions, range, options) {
      var min = null;
      var minSV = null;
      try {
        var rangeObj = new Range(range, options);
      } catch (er) {
        return null;
      }
      versions.forEach(function(v) {
        if (rangeObj.test(v)) {
          if (!min || minSV.compare(v) === 1) {
            min = v;
            minSV = new SemVer(min, options);
          }
        }
      });
      return min;
    }
    exports2.minVersion = minVersion;
    function minVersion(range, loose) {
      range = new Range(range, loose);
      var minver = new SemVer("0.0.0");
      if (range.test(minver)) {
        return minver;
      }
      minver = new SemVer("0.0.0-0");
      if (range.test(minver)) {
        return minver;
      }
      minver = null;
      for (var i2 = 0; i2 < range.set.length; ++i2) {
        var comparators = range.set[i2];
        comparators.forEach(function(comparator) {
          var compver = new SemVer(comparator.semver.version);
          switch (comparator.operator) {
            case ">":
              if (compver.prerelease.length === 0) {
                compver.patch++;
              } else {
                compver.prerelease.push(0);
              }
              compver.raw = compver.format();
            case "":
            case ">=":
              if (!minver || gt(minver, compver)) {
                minver = compver;
              }
              break;
            case "<":
            case "<=":
              break;
            default:
              throw new Error("Unexpected operation: " + comparator.operator);
          }
        });
      }
      if (minver && range.test(minver)) {
        return minver;
      }
      return null;
    }
    exports2.validRange = validRange;
    function validRange(range, options) {
      try {
        return new Range(range, options).range || "*";
      } catch (er) {
        return null;
      }
    }
    exports2.ltr = ltr;
    function ltr(version, range, options) {
      return outside(version, range, "<", options);
    }
    exports2.gtr = gtr;
    function gtr(version, range, options) {
      return outside(version, range, ">", options);
    }
    exports2.outside = outside;
    function outside(version, range, hilo, options) {
      version = new SemVer(version, options);
      range = new Range(range, options);
      var gtfn, ltefn, ltfn, comp, ecomp;
      switch (hilo) {
        case ">":
          gtfn = gt;
          ltefn = lte;
          ltfn = lt;
          comp = ">";
          ecomp = ">=";
          break;
        case "<":
          gtfn = lt;
          ltefn = gte;
          ltfn = gt;
          comp = "<";
          ecomp = "<=";
          break;
        default:
          throw new TypeError('Must provide a hilo val of "<" or ">"');
      }
      if (satisfies(version, range, options)) {
        return false;
      }
      for (var i2 = 0; i2 < range.set.length; ++i2) {
        var comparators = range.set[i2];
        var high = null;
        var low = null;
        comparators.forEach(function(comparator) {
          if (comparator.semver === ANY) {
            comparator = new Comparator(">=0.0.0");
          }
          high = high || comparator;
          low = low || comparator;
          if (gtfn(comparator.semver, high.semver, options)) {
            high = comparator;
          } else if (ltfn(comparator.semver, low.semver, options)) {
            low = comparator;
          }
        });
        if (high.operator === comp || high.operator === ecomp) {
          return false;
        }
        if ((!low.operator || low.operator === comp) && ltefn(version, low.semver)) {
          return false;
        } else if (low.operator === ecomp && ltfn(version, low.semver)) {
          return false;
        }
      }
      return true;
    }
    exports2.prerelease = prerelease;
    function prerelease(version, options) {
      var parsed = parse(version, options);
      return parsed && parsed.prerelease.length ? parsed.prerelease : null;
    }
    exports2.intersects = intersects;
    function intersects(r1, r2, options) {
      r1 = new Range(r1, options);
      r2 = new Range(r2, options);
      return r1.intersects(r2);
    }
    exports2.coerce = coerce;
    function coerce(version, options) {
      if (version instanceof SemVer) {
        return version;
      }
      if (typeof version === "number") {
        version = String(version);
      }
      if (typeof version !== "string") {
        return null;
      }
      options = options || {};
      var match = null;
      if (!options.rtl) {
        match = version.match(re[t.COERCE]);
      } else {
        var next;
        while ((next = re[t.COERCERTL].exec(version)) && (!match || match.index + match[0].length !== version.length)) {
          if (!match || next.index + next[0].length !== match.index + match[0].length) {
            match = next;
          }
          re[t.COERCERTL].lastIndex = next.index + next[1].length + next[2].length;
        }
        re[t.COERCERTL].lastIndex = -1;
      }
      if (match === null) {
        return null;
      }
      return parse(match[2] + "." + (match[3] || "0") + "." + (match[4] || "0"), options);
    }
  }
});

// node_modules/@actions/tool-cache/lib/manifest.js
var require_manifest = __commonJS({
  "node_modules/@actions/tool-cache/lib/manifest.js"(exports2, module2) {
    "use strict";
    var __createBinding = exports2 && exports2.__createBinding || (Object.create ? function(o, m, k, k2) {
      if (k2 === void 0)
        k2 = k;
      Object.defineProperty(o, k2, { enumerable: true, get: function() {
        return m[k];
      } });
    } : function(o, m, k, k2) {
      if (k2 === void 0)
        k2 = k;
      o[k2] = m[k];
    });
    var __setModuleDefault = exports2 && exports2.__setModuleDefault || (Object.create ? function(o, v) {
      Object.defineProperty(o, "default", { enumerable: true, value: v });
    } : function(o, v) {
      o["default"] = v;
    });
    var __importStar = exports2 && exports2.__importStar || function(mod) {
      if (mod && mod.__esModule)
        return mod;
      var result = {};
      if (mod != null) {
        for (var k in mod)
          if (k !== "default" && Object.hasOwnProperty.call(mod, k))
            __createBinding(result, mod, k);
      }
      __setModuleDefault(result, mod);
      return result;
    };
    var __awaiter = exports2 && exports2.__awaiter || function(thisArg, _arguments, P, generator) {
      function adopt(value) {
        return value instanceof P ? value : new P(function(resolve2) {
          resolve2(value);
        });
      }
      return new (P || (P = Promise))(function(resolve2, reject) {
        function fulfilled(value) {
          try {
            step(generator.next(value));
          } catch (e) {
            reject(e);
          }
        }
        function rejected(value) {
          try {
            step(generator["throw"](value));
          } catch (e) {
            reject(e);
          }
        }
        function step(result) {
          result.done ? resolve2(result.value) : adopt(result.value).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
      });
    };
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2._readLinuxVersionFile = exports2._getOsVersion = exports2._findMatch = void 0;
    var semver = __importStar(require_semver2());
    var core_1 = require_core4();
    var os2 = require("os");
    var cp3 = require("child_process");
    var fs6 = require("fs");
    function _findMatch(versionSpec, stable, candidates, archFilter) {
      return __awaiter(this, void 0, void 0, function* () {
        const platFilter = os2.platform();
        let result;
        let match;
        let file;
        for (const candidate of candidates) {
          const version = candidate.version;
          core_1.debug(`check ${version} satisfies ${versionSpec}`);
          if (semver.satisfies(version, versionSpec) && (!stable || candidate.stable === stable)) {
            file = candidate.files.find((item) => {
              core_1.debug(`${item.arch}===${archFilter} && ${item.platform}===${platFilter}`);
              let chk = item.arch === archFilter && item.platform === platFilter;
              if (chk && item.platform_version) {
                const osVersion = module2.exports._getOsVersion();
                if (osVersion === item.platform_version) {
                  chk = true;
                } else {
                  chk = semver.satisfies(osVersion, item.platform_version);
                }
              }
              return chk;
            });
            if (file) {
              core_1.debug(`matched ${candidate.version}`);
              match = candidate;
              break;
            }
          }
        }
        if (match && file) {
          result = Object.assign({}, match);
          result.files = [file];
        }
        return result;
      });
    }
    exports2._findMatch = _findMatch;
    function _getOsVersion() {
      const plat = os2.platform();
      let version = "";
      if (plat === "darwin") {
        version = cp3.execSync("sw_vers -productVersion").toString();
      } else if (plat === "linux") {
        const lsbContents = module2.exports._readLinuxVersionFile();
        if (lsbContents) {
          const lines = lsbContents.split("\n");
          for (const line of lines) {
            const parts = line.split("=");
            if (parts.length === 2 && (parts[0].trim() === "VERSION_ID" || parts[0].trim() === "DISTRIB_RELEASE")) {
              version = parts[1].trim().replace(/^"/, "").replace(/"$/, "");
              break;
            }
          }
        }
      }
      return version;
    }
    exports2._getOsVersion = _getOsVersion;
    function _readLinuxVersionFile() {
      const lsbReleaseFile = "/etc/lsb-release";
      const osReleaseFile = "/etc/os-release";
      let contents = "";
      if (fs6.existsSync(lsbReleaseFile)) {
        contents = fs6.readFileSync(lsbReleaseFile).toString();
      } else if (fs6.existsSync(osReleaseFile)) {
        contents = fs6.readFileSync(osReleaseFile).toString();
      }
      return contents;
    }
    exports2._readLinuxVersionFile = _readLinuxVersionFile;
  }
});

// node_modules/@actions/tool-cache/lib/retry-helper.js
var require_retry_helper = __commonJS({
  "node_modules/@actions/tool-cache/lib/retry-helper.js"(exports2) {
    "use strict";
    var __createBinding = exports2 && exports2.__createBinding || (Object.create ? function(o, m, k, k2) {
      if (k2 === void 0)
        k2 = k;
      Object.defineProperty(o, k2, { enumerable: true, get: function() {
        return m[k];
      } });
    } : function(o, m, k, k2) {
      if (k2 === void 0)
        k2 = k;
      o[k2] = m[k];
    });
    var __setModuleDefault = exports2 && exports2.__setModuleDefault || (Object.create ? function(o, v) {
      Object.defineProperty(o, "default", { enumerable: true, value: v });
    } : function(o, v) {
      o["default"] = v;
    });
    var __importStar = exports2 && exports2.__importStar || function(mod) {
      if (mod && mod.__esModule)
        return mod;
      var result = {};
      if (mod != null) {
        for (var k in mod)
          if (k !== "default" && Object.hasOwnProperty.call(mod, k))
            __createBinding(result, mod, k);
      }
      __setModuleDefault(result, mod);
      return result;
    };
    var __awaiter = exports2 && exports2.__awaiter || function(thisArg, _arguments, P, generator) {
      function adopt(value) {
        return value instanceof P ? value : new P(function(resolve2) {
          resolve2(value);
        });
      }
      return new (P || (P = Promise))(function(resolve2, reject) {
        function fulfilled(value) {
          try {
            step(generator.next(value));
          } catch (e) {
            reject(e);
          }
        }
        function rejected(value) {
          try {
            step(generator["throw"](value));
          } catch (e) {
            reject(e);
          }
        }
        function step(result) {
          result.done ? resolve2(result.value) : adopt(result.value).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
      });
    };
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.RetryHelper = void 0;
    var core10 = __importStar(require_core4());
    var RetryHelper2 = class {
      constructor(maxAttempts, minSeconds, maxSeconds) {
        if (maxAttempts < 1) {
          throw new Error("max attempts should be greater than or equal to 1");
        }
        this.maxAttempts = maxAttempts;
        this.minSeconds = Math.floor(minSeconds);
        this.maxSeconds = Math.floor(maxSeconds);
        if (this.minSeconds > this.maxSeconds) {
          throw new Error("min seconds should be less than or equal to max seconds");
        }
      }
      execute(action, isRetryable) {
        return __awaiter(this, void 0, void 0, function* () {
          let attempt = 1;
          while (attempt < this.maxAttempts) {
            try {
              return yield action();
            } catch (err) {
              if (isRetryable && !isRetryable(err)) {
                throw err;
              }
              core10.info(err.message);
            }
            const seconds = this.getSleepAmount();
            core10.info(`Waiting ${seconds} seconds before trying again`);
            yield this.sleep(seconds);
            attempt++;
          }
          return yield action();
        });
      }
      getSleepAmount() {
        return Math.floor(Math.random() * (this.maxSeconds - this.minSeconds + 1)) + this.minSeconds;
      }
      sleep(seconds) {
        return __awaiter(this, void 0, void 0, function* () {
          return new Promise((resolve2) => setTimeout(resolve2, seconds * 1e3));
        });
      }
    };
    exports2.RetryHelper = RetryHelper2;
  }
});

// node_modules/@actions/tool-cache/lib/tool-cache.js
var require_tool_cache = __commonJS({
  "node_modules/@actions/tool-cache/lib/tool-cache.js"(exports2) {
    "use strict";
    var __createBinding = exports2 && exports2.__createBinding || (Object.create ? function(o, m, k, k2) {
      if (k2 === void 0)
        k2 = k;
      Object.defineProperty(o, k2, { enumerable: true, get: function() {
        return m[k];
      } });
    } : function(o, m, k, k2) {
      if (k2 === void 0)
        k2 = k;
      o[k2] = m[k];
    });
    var __setModuleDefault = exports2 && exports2.__setModuleDefault || (Object.create ? function(o, v) {
      Object.defineProperty(o, "default", { enumerable: true, value: v });
    } : function(o, v) {
      o["default"] = v;
    });
    var __importStar = exports2 && exports2.__importStar || function(mod) {
      if (mod && mod.__esModule)
        return mod;
      var result = {};
      if (mod != null) {
        for (var k in mod)
          if (k !== "default" && Object.hasOwnProperty.call(mod, k))
            __createBinding(result, mod, k);
      }
      __setModuleDefault(result, mod);
      return result;
    };
    var __awaiter = exports2 && exports2.__awaiter || function(thisArg, _arguments, P, generator) {
      function adopt(value) {
        return value instanceof P ? value : new P(function(resolve2) {
          resolve2(value);
        });
      }
      return new (P || (P = Promise))(function(resolve2, reject) {
        function fulfilled(value) {
          try {
            step(generator.next(value));
          } catch (e) {
            reject(e);
          }
        }
        function rejected(value) {
          try {
            step(generator["throw"](value));
          } catch (e) {
            reject(e);
          }
        }
        function step(result) {
          result.done ? resolve2(result.value) : adopt(result.value).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
      });
    };
    var __importDefault = exports2 && exports2.__importDefault || function(mod) {
      return mod && mod.__esModule ? mod : { "default": mod };
    };
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.evaluateVersions = exports2.isExplicitVersion = exports2.findFromManifest = exports2.getManifestFromRepo = exports2.findAllVersions = exports2.find = exports2.cacheFile = exports2.cacheDir = exports2.extractZip = exports2.extractXar = exports2.extractTar = exports2.extract7z = exports2.downloadTool = exports2.HTTPError = void 0;
    var core10 = __importStar(require_core4());
    var io6 = __importStar(require_io());
    var fs6 = __importStar(require("fs"));
    var mm = __importStar(require_manifest());
    var os2 = __importStar(require("os"));
    var path7 = __importStar(require("path"));
    var httpm = __importStar(require_http_client());
    var semver = __importStar(require_semver2());
    var stream = __importStar(require("stream"));
    var util = __importStar(require("util"));
    var v4_1 = __importDefault(require_v4());
    var exec_1 = require_exec();
    var assert_1 = require("assert");
    var retry_helper_1 = require_retry_helper();
    var HTTPError = class extends Error {
      constructor(httpStatusCode) {
        super(`Unexpected HTTP response: ${httpStatusCode}`);
        this.httpStatusCode = httpStatusCode;
        Object.setPrototypeOf(this, new.target.prototype);
      }
    };
    exports2.HTTPError = HTTPError;
    var IS_WINDOWS3 = process.platform === "win32";
    var IS_MAC = process.platform === "darwin";
    var userAgent = "actions/tool-cache";
    function downloadTool(url, dest, auth, headers) {
      return __awaiter(this, void 0, void 0, function* () {
        dest = dest || path7.join(_getTempDirectory(), v4_1.default());
        yield io6.mkdirP(path7.dirname(dest));
        core10.debug(`Downloading ${url}`);
        core10.debug(`Destination ${dest}`);
        const maxAttempts = 3;
        const minSeconds = _getGlobal("TEST_DOWNLOAD_TOOL_RETRY_MIN_SECONDS", 10);
        const maxSeconds = _getGlobal("TEST_DOWNLOAD_TOOL_RETRY_MAX_SECONDS", 20);
        const retryHelper3 = new retry_helper_1.RetryHelper(maxAttempts, minSeconds, maxSeconds);
        return yield retryHelper3.execute(() => __awaiter(this, void 0, void 0, function* () {
          return yield downloadToolAttempt(url, dest || "", auth, headers);
        }), (err) => {
          if (err instanceof HTTPError && err.httpStatusCode) {
            if (err.httpStatusCode < 500 && err.httpStatusCode !== 408 && err.httpStatusCode !== 429) {
              return false;
            }
          }
          return true;
        });
      });
    }
    exports2.downloadTool = downloadTool;
    function downloadToolAttempt(url, dest, auth, headers) {
      return __awaiter(this, void 0, void 0, function* () {
        if (fs6.existsSync(dest)) {
          throw new Error(`Destination file path ${dest} already exists`);
        }
        const http = new httpm.HttpClient(userAgent, [], {
          allowRetries: false
        });
        if (auth) {
          core10.debug("set auth");
          if (headers === void 0) {
            headers = {};
          }
          headers.authorization = auth;
        }
        const response = yield http.get(url, headers);
        if (response.message.statusCode !== 200) {
          const err = new HTTPError(response.message.statusCode);
          core10.debug(`Failed to download from "${url}". Code(${response.message.statusCode}) Message(${response.message.statusMessage})`);
          throw err;
        }
        const pipeline = util.promisify(stream.pipeline);
        const responseMessageFactory = _getGlobal("TEST_DOWNLOAD_TOOL_RESPONSE_MESSAGE_FACTORY", () => response.message);
        const readStream = responseMessageFactory();
        let succeeded = false;
        try {
          yield pipeline(readStream, fs6.createWriteStream(dest));
          core10.debug("download complete");
          succeeded = true;
          return dest;
        } finally {
          if (!succeeded) {
            core10.debug("download failed");
            try {
              yield io6.rmRF(dest);
            } catch (err) {
              core10.debug(`Failed to delete '${dest}'. ${err.message}`);
            }
          }
        }
      });
    }
    function extract7z(file, dest, _7zPath) {
      return __awaiter(this, void 0, void 0, function* () {
        assert_1.ok(IS_WINDOWS3, "extract7z() not supported on current OS");
        assert_1.ok(file, 'parameter "file" is required');
        dest = yield _createExtractFolder(dest);
        const originalCwd = process.cwd();
        process.chdir(dest);
        if (_7zPath) {
          try {
            const logLevel = core10.isDebug() ? "-bb1" : "-bb0";
            const args = [
              "x",
              logLevel,
              "-bd",
              "-sccUTF-8",
              file
            ];
            const options = {
              silent: true
            };
            yield exec_1.exec(`"${_7zPath}"`, args, options);
          } finally {
            process.chdir(originalCwd);
          }
        } else {
          const escapedScript = path7.join(__dirname, "..", "scripts", "Invoke-7zdec.ps1").replace(/'/g, "''").replace(/"|\n|\r/g, "");
          const escapedFile = file.replace(/'/g, "''").replace(/"|\n|\r/g, "");
          const escapedTarget = dest.replace(/'/g, "''").replace(/"|\n|\r/g, "");
          const command = `& '${escapedScript}' -Source '${escapedFile}' -Target '${escapedTarget}'`;
          const args = [
            "-NoLogo",
            "-Sta",
            "-NoProfile",
            "-NonInteractive",
            "-ExecutionPolicy",
            "Unrestricted",
            "-Command",
            command
          ];
          const options = {
            silent: true
          };
          try {
            const powershellPath = yield io6.which("powershell", true);
            yield exec_1.exec(`"${powershellPath}"`, args, options);
          } finally {
            process.chdir(originalCwd);
          }
        }
        return dest;
      });
    }
    exports2.extract7z = extract7z;
    function extractTar2(file, dest, flags = "xz") {
      return __awaiter(this, void 0, void 0, function* () {
        if (!file) {
          throw new Error("parameter 'file' is required");
        }
        dest = yield _createExtractFolder(dest);
        core10.debug("Checking tar --version");
        let versionOutput = "";
        yield exec_1.exec("tar --version", [], {
          ignoreReturnCode: true,
          silent: true,
          listeners: {
            stdout: (data) => versionOutput += data.toString(),
            stderr: (data) => versionOutput += data.toString()
          }
        });
        core10.debug(versionOutput.trim());
        const isGnuTar = versionOutput.toUpperCase().includes("GNU TAR");
        let args;
        if (flags instanceof Array) {
          args = flags;
        } else {
          args = [flags];
        }
        if (core10.isDebug() && !flags.includes("v")) {
          args.push("-v");
        }
        let destArg = dest;
        let fileArg = file;
        if (IS_WINDOWS3 && isGnuTar) {
          args.push("--force-local");
          destArg = dest.replace(/\\/g, "/");
          fileArg = file.replace(/\\/g, "/");
        }
        if (isGnuTar) {
          args.push("--warning=no-unknown-keyword");
          args.push("--overwrite");
        }
        args.push("-C", destArg, "-f", fileArg);
        yield exec_1.exec(`tar`, args);
        return dest;
      });
    }
    exports2.extractTar = extractTar2;
    function extractXar(file, dest, flags = []) {
      return __awaiter(this, void 0, void 0, function* () {
        assert_1.ok(IS_MAC, "extractXar() not supported on current OS");
        assert_1.ok(file, 'parameter "file" is required');
        dest = yield _createExtractFolder(dest);
        let args;
        if (flags instanceof Array) {
          args = flags;
        } else {
          args = [flags];
        }
        args.push("-x", "-C", dest, "-f", file);
        if (core10.isDebug()) {
          args.push("-v");
        }
        const xarPath = yield io6.which("xar", true);
        yield exec_1.exec(`"${xarPath}"`, _unique(args));
        return dest;
      });
    }
    exports2.extractXar = extractXar;
    function extractZip2(file, dest) {
      return __awaiter(this, void 0, void 0, function* () {
        if (!file) {
          throw new Error("parameter 'file' is required");
        }
        dest = yield _createExtractFolder(dest);
        if (IS_WINDOWS3) {
          yield extractZipWin(file, dest);
        } else {
          yield extractZipNix(file, dest);
        }
        return dest;
      });
    }
    exports2.extractZip = extractZip2;
    function extractZipWin(file, dest) {
      return __awaiter(this, void 0, void 0, function* () {
        const escapedFile = file.replace(/'/g, "''").replace(/"|\n|\r/g, "");
        const escapedDest = dest.replace(/'/g, "''").replace(/"|\n|\r/g, "");
        const pwshPath = yield io6.which("pwsh", false);
        if (pwshPath) {
          const pwshCommand = [
            `$ErrorActionPreference = 'Stop' ;`,
            `try { Add-Type -AssemblyName System.IO.Compression.ZipFile } catch { } ;`,
            `try { [System.IO.Compression.ZipFile]::ExtractToDirectory('${escapedFile}', '${escapedDest}', $true) }`,
            `catch { if (($_.Exception.GetType().FullName -eq 'System.Management.Automation.MethodException') -or ($_.Exception.GetType().FullName -eq 'System.Management.Automation.RuntimeException') ){ Expand-Archive -LiteralPath '${escapedFile}' -DestinationPath '${escapedDest}' -Force } else { throw $_ } } ;`
          ].join(" ");
          const args = [
            "-NoLogo",
            "-NoProfile",
            "-NonInteractive",
            "-ExecutionPolicy",
            "Unrestricted",
            "-Command",
            pwshCommand
          ];
          core10.debug(`Using pwsh at path: ${pwshPath}`);
          yield exec_1.exec(`"${pwshPath}"`, args);
        } else {
          const powershellCommand = [
            `$ErrorActionPreference = 'Stop' ;`,
            `try { Add-Type -AssemblyName System.IO.Compression.FileSystem } catch { } ;`,
            `if ((Get-Command -Name Expand-Archive -Module Microsoft.PowerShell.Archive -ErrorAction Ignore)) { Expand-Archive -LiteralPath '${escapedFile}' -DestinationPath '${escapedDest}' -Force }`,
            `else {[System.IO.Compression.ZipFile]::ExtractToDirectory('${escapedFile}', '${escapedDest}', $true) }`
          ].join(" ");
          const args = [
            "-NoLogo",
            "-Sta",
            "-NoProfile",
            "-NonInteractive",
            "-ExecutionPolicy",
            "Unrestricted",
            "-Command",
            powershellCommand
          ];
          const powershellPath = yield io6.which("powershell", true);
          core10.debug(`Using powershell at path: ${powershellPath}`);
          yield exec_1.exec(`"${powershellPath}"`, args);
        }
      });
    }
    function extractZipNix(file, dest) {
      return __awaiter(this, void 0, void 0, function* () {
        const unzipPath = yield io6.which("unzip", true);
        const args = [file];
        if (!core10.isDebug()) {
          args.unshift("-q");
        }
        args.unshift("-o");
        yield exec_1.exec(`"${unzipPath}"`, args, { cwd: dest });
      });
    }
    function cacheDir(sourceDir, tool, version, arch) {
      return __awaiter(this, void 0, void 0, function* () {
        version = semver.clean(version) || version;
        arch = arch || os2.arch();
        core10.debug(`Caching tool ${tool} ${version} ${arch}`);
        core10.debug(`source dir: ${sourceDir}`);
        if (!fs6.statSync(sourceDir).isDirectory()) {
          throw new Error("sourceDir is not a directory");
        }
        const destPath = yield _createToolPath(tool, version, arch);
        for (const itemName of fs6.readdirSync(sourceDir)) {
          const s = path7.join(sourceDir, itemName);
          yield io6.cp(s, destPath, { recursive: true });
        }
        _completeToolPath(tool, version, arch);
        return destPath;
      });
    }
    exports2.cacheDir = cacheDir;
    function cacheFile(sourceFile, targetFile, tool, version, arch) {
      return __awaiter(this, void 0, void 0, function* () {
        version = semver.clean(version) || version;
        arch = arch || os2.arch();
        core10.debug(`Caching tool ${tool} ${version} ${arch}`);
        core10.debug(`source file: ${sourceFile}`);
        if (!fs6.statSync(sourceFile).isFile()) {
          throw new Error("sourceFile is not a file");
        }
        const destFolder = yield _createToolPath(tool, version, arch);
        const destPath = path7.join(destFolder, targetFile);
        core10.debug(`destination file ${destPath}`);
        yield io6.cp(sourceFile, destPath);
        _completeToolPath(tool, version, arch);
        return destFolder;
      });
    }
    exports2.cacheFile = cacheFile;
    function find(toolName, versionSpec, arch) {
      if (!toolName) {
        throw new Error("toolName parameter is required");
      }
      if (!versionSpec) {
        throw new Error("versionSpec parameter is required");
      }
      arch = arch || os2.arch();
      if (!isExplicitVersion(versionSpec)) {
        const localVersions = findAllVersions(toolName, arch);
        const match = evaluateVersions(localVersions, versionSpec);
        versionSpec = match;
      }
      let toolPath = "";
      if (versionSpec) {
        versionSpec = semver.clean(versionSpec) || "";
        const cachePath = path7.join(_getCacheDirectory(), toolName, versionSpec, arch);
        core10.debug(`checking cache: ${cachePath}`);
        if (fs6.existsSync(cachePath) && fs6.existsSync(`${cachePath}.complete`)) {
          core10.debug(`Found tool in cache ${toolName} ${versionSpec} ${arch}`);
          toolPath = cachePath;
        } else {
          core10.debug("not found");
        }
      }
      return toolPath;
    }
    exports2.find = find;
    function findAllVersions(toolName, arch) {
      const versions = [];
      arch = arch || os2.arch();
      const toolPath = path7.join(_getCacheDirectory(), toolName);
      if (fs6.existsSync(toolPath)) {
        const children = fs6.readdirSync(toolPath);
        for (const child of children) {
          if (isExplicitVersion(child)) {
            const fullPath = path7.join(toolPath, child, arch || "");
            if (fs6.existsSync(fullPath) && fs6.existsSync(`${fullPath}.complete`)) {
              versions.push(child);
            }
          }
        }
      }
      return versions;
    }
    exports2.findAllVersions = findAllVersions;
    function getManifestFromRepo(owner, repo, auth, branch = "master") {
      return __awaiter(this, void 0, void 0, function* () {
        let releases = [];
        const treeUrl = `https://api.github.com/repos/${owner}/${repo}/git/trees/${branch}`;
        const http = new httpm.HttpClient("tool-cache");
        const headers = {};
        if (auth) {
          core10.debug("set auth");
          headers.authorization = auth;
        }
        const response = yield http.getJson(treeUrl, headers);
        if (!response.result) {
          return releases;
        }
        let manifestUrl = "";
        for (const item of response.result.tree) {
          if (item.path === "versions-manifest.json") {
            manifestUrl = item.url;
            break;
          }
        }
        headers["accept"] = "application/vnd.github.VERSION.raw";
        let versionsRaw = yield (yield http.get(manifestUrl, headers)).readBody();
        if (versionsRaw) {
          versionsRaw = versionsRaw.replace(/^\uFEFF/, "");
          try {
            releases = JSON.parse(versionsRaw);
          } catch (_a) {
            core10.debug("Invalid json");
          }
        }
        return releases;
      });
    }
    exports2.getManifestFromRepo = getManifestFromRepo;
    function findFromManifest(versionSpec, stable, manifest, archFilter = os2.arch()) {
      return __awaiter(this, void 0, void 0, function* () {
        const match = yield mm._findMatch(versionSpec, stable, manifest, archFilter);
        return match;
      });
    }
    exports2.findFromManifest = findFromManifest;
    function _createExtractFolder(dest) {
      return __awaiter(this, void 0, void 0, function* () {
        if (!dest) {
          dest = path7.join(_getTempDirectory(), v4_1.default());
        }
        yield io6.mkdirP(dest);
        return dest;
      });
    }
    function _createToolPath(tool, version, arch) {
      return __awaiter(this, void 0, void 0, function* () {
        const folderPath = path7.join(_getCacheDirectory(), tool, semver.clean(version) || version, arch || "");
        core10.debug(`destination ${folderPath}`);
        const markerPath = `${folderPath}.complete`;
        yield io6.rmRF(folderPath);
        yield io6.rmRF(markerPath);
        yield io6.mkdirP(folderPath);
        return folderPath;
      });
    }
    function _completeToolPath(tool, version, arch) {
      const folderPath = path7.join(_getCacheDirectory(), tool, semver.clean(version) || version, arch || "");
      const markerPath = `${folderPath}.complete`;
      fs6.writeFileSync(markerPath, "");
      core10.debug("finished caching tool");
    }
    function isExplicitVersion(versionSpec) {
      const c = semver.clean(versionSpec) || "";
      core10.debug(`isExplicit: ${c}`);
      const valid = semver.valid(c) != null;
      core10.debug(`explicit? ${valid}`);
      return valid;
    }
    exports2.isExplicitVersion = isExplicitVersion;
    function evaluateVersions(versions, versionSpec) {
      let version = "";
      core10.debug(`evaluating ${versions.length} versions`);
      versions = versions.sort((a, b) => {
        if (semver.gt(a, b)) {
          return 1;
        }
        return -1;
      });
      for (let i = versions.length - 1; i >= 0; i--) {
        const potential = versions[i];
        const satisfied = semver.satisfies(potential, versionSpec);
        if (satisfied) {
          version = potential;
          break;
        }
      }
      if (version) {
        core10.debug(`matched: ${version}`);
      } else {
        core10.debug("match not found");
      }
      return version;
    }
    exports2.evaluateVersions = evaluateVersions;
    function _getCacheDirectory() {
      const cacheDirectory = process.env["RUNNER_TOOL_CACHE"] || "";
      assert_1.ok(cacheDirectory, "Expected RUNNER_TOOL_CACHE to be defined");
      return cacheDirectory;
    }
    function _getTempDirectory() {
      const tempDirectory = process.env["RUNNER_TEMP"] || "";
      assert_1.ok(tempDirectory, "Expected RUNNER_TEMP to be defined");
      return tempDirectory;
    }
    function _getGlobal(key, defaultValue) {
      const value = global[key];
      return value !== void 0 ? value : defaultValue;
    }
    function _unique(values) {
      return Array.from(new Set(values));
    }
  }
});

// accept/src/index.ts
var import_core5 = __toModule(require_core());
var import_github2 = __toModule(require_github());

// lib/core.ts
var import_core = __toModule(require_core());
var import_exec = __toModule(require_exec());
var import_fs = __toModule(require("fs"));
var import_path = __toModule(require("path"));
var TRUE_VALUES = [true, "true", "TRUE"];
var FALSE_VALUES = [false, "false", "FALSE"];
function getBooleanInput(name, defaultValue) {
  let inputValue = (0, import_core.getInput)(name) || defaultValue;
  if (TRUE_VALUES.includes(inputValue)) {
    return true;
  }
  if (FALSE_VALUES.includes(inputValue)) {
    return false;
  }
  throw new Error(`Can't parse input value (${JSON.stringify(inputValue)}) as boolean`);
}

// lib/github.ts
var import_core2 = __toModule(require_core());
var import_fs2 = __toModule(require("fs"));
async function getPR(octokit, repo, ref) {
  const { data } = await octokit.rest.pulls.list({
    owner: "exivity",
    repo,
    head: `exivity:${ref}`,
    sort: "updated"
  });
  if (data.length > 0) {
    return data[0];
  }
}
function getRepository() {
  const [owner, component] = (process.env["GITHUB_REPOSITORY"] || "").split("/");
  if (!owner || !component) {
    throw new Error("The GitHub repository is missing");
  }
  return { owner, component };
}
function getSha() {
  const sha = process.env["GITHUB_SHA"];
  if (!sha) {
    throw new Error("The GitHub sha is missing");
  }
  return sha;
}
function getRef() {
  var _a;
  const ref = process.env["GITHUB_HEAD_REF"] || ((_a = process.env["GITHUB_REF"]) == null ? void 0 : _a.slice(11));
  if (!ref) {
    throw new Error("The GitHub ref is missing");
  }
  return ref;
}
function getWorkspacePath() {
  const workspacePath = process.env["GITHUB_WORKSPACE"];
  if (!workspacePath) {
    throw new Error("The GitHub workspace path is missing");
  }
  return workspacePath;
}
function getToken(inputName = "gh-token") {
  const ghToken = (0, import_core2.getInput)(inputName) || process.env["GITHUB_TOKEN"];
  if (!ghToken) {
    throw new Error("The GitHub token is missing");
  }
  return ghToken;
}
function getEventName() {
  const eventName = process.env["GITHUB_EVENT_NAME"];
  if (!eventName) {
    throw new Error("The GitHub event name is missing");
  }
  return eventName;
}
async function getEventData() {
  const eventPath = process.env["GITHUB_EVENT_PATH"];
  if (!eventPath) {
    throw new Error("The GitHub event path is missing");
  }
  const fileData = await import_fs2.promises.readFile(eventPath, {
    encoding: "utf8"
  });
  return JSON.parse(fileData);
}
function getWorkflowName() {
  const workflowName = process.env["GITHUB_WORKFLOW"];
  if (!workflowName) {
    throw new Error("The GitHub workflow name is missing");
  }
  return workflowName;
}

// accept/src/checks.ts
var import_core3 = __toModule(require_core());

// node_modules/checkout/src/fs-helper.ts
var fs2 = __toModule(require("fs"));
function directoryExistsSync(path7, required) {
  if (!path7) {
    throw new Error("Arg 'path' must not be empty");
  }
  let stats;
  try {
    stats = fs2.statSync(path7);
  } catch (error) {
    if (error.code === "ENOENT") {
      if (!required) {
        return false;
      }
      throw new Error(`Directory '${path7}' does not exist`);
    }
    throw new Error(`Encountered an error when checking whether path '${path7}' exists: ${error.message}`);
  }
  if (stats.isDirectory()) {
    return true;
  } else if (!required) {
    return false;
  }
  throw new Error(`Directory '${path7}' does not exist`);
}
function existsSync(path7) {
  if (!path7) {
    throw new Error("Arg 'path' must not be empty");
  }
  try {
    fs2.statSync(path7);
  } catch (error) {
    if (error.code === "ENOENT") {
      return false;
    }
    throw new Error(`Encountered an error when checking whether path '${path7}' exists: ${error.message}`);
  }
  return true;
}
function fileExistsSync(path7) {
  if (!path7) {
    throw new Error("Arg 'path' must not be empty");
  }
  let stats;
  try {
    stats = fs2.statSync(path7);
  } catch (error) {
    if (error.code === "ENOENT") {
      return false;
    }
    throw new Error(`Encountered an error when checking whether path '${path7}' exists: ${error.message}`);
  }
  if (!stats.isDirectory()) {
    return true;
  }
  return false;
}

// node_modules/checkout/src/git-source-provider.ts
var core7 = __toModule(require_core2());

// node_modules/checkout/src/git-auth-helper.ts
var assert2 = __toModule(require("assert"));
var core = __toModule(require_core2());
var exec2 = __toModule(require_exec());
var fs3 = __toModule(require("fs"));
var io = __toModule(require_io());
var os = __toModule(require("os"));
var path = __toModule(require("path"));

// node_modules/checkout/src/regexp-helper.ts
function escape(value) {
  return value.replace(/[^a-zA-Z0-9_]/g, (x) => {
    return `\\${x}`;
  });
}

// node_modules/checkout/src/state-helper.ts
var coreCommand = __toModule(require_command2());
var IsPost = !!process.env["STATE_isPost"];
var RepositoryPath = process.env["STATE_repositoryPath"] || "";
var SshKeyPath = process.env["STATE_sshKeyPath"] || "";
var SshKnownHostsPath = process.env["STATE_sshKnownHostsPath"] || "";
function setRepositoryPath(repositoryPath) {
  coreCommand.issueCommand("save-state", { name: "repositoryPath" }, repositoryPath);
}
function setSshKeyPath(sshKeyPath) {
  coreCommand.issueCommand("save-state", { name: "sshKeyPath" }, sshKeyPath);
}
function setSshKnownHostsPath(sshKnownHostsPath) {
  coreCommand.issueCommand("save-state", { name: "sshKnownHostsPath" }, sshKnownHostsPath);
}
if (!IsPost) {
  coreCommand.issueCommand("save-state", { name: "isPost" }, "true");
}

// node_modules/checkout/src/url-helper.ts
var assert = __toModule(require("assert"));
var import_url = __toModule(require("url"));
function getFetchUrl(settings) {
  assert.ok(settings.repositoryOwner, "settings.repositoryOwner must be defined");
  assert.ok(settings.repositoryName, "settings.repositoryName must be defined");
  const serviceUrl = getServerUrl();
  const encodedOwner = encodeURIComponent(settings.repositoryOwner);
  const encodedName = encodeURIComponent(settings.repositoryName);
  if (settings.sshKey) {
    return `git@${serviceUrl.hostname}:${encodedOwner}/${encodedName}.git`;
  }
  return `${serviceUrl.origin}/${encodedOwner}/${encodedName}`;
}
function getServerUrl() {
  return new import_url.URL(process.env["GITHUB_SERVER_URL"] || process.env["GITHUB_URL"] || "https://github.com");
}

// node_modules/checkout/src/git-auth-helper.ts
var import_v4 = __toModule(require_v4());
var IS_WINDOWS = process.platform === "win32";
var SSH_COMMAND_KEY = "core.sshCommand";
function createAuthHelper(git, settings) {
  return new GitAuthHelper(git, settings);
}
var GitAuthHelper = class {
  constructor(gitCommandManager2, gitSourceSettings) {
    this.sshCommand = "";
    this.sshKeyPath = "";
    this.sshKnownHostsPath = "";
    this.temporaryHomePath = "";
    this.git = gitCommandManager2;
    this.settings = gitSourceSettings || {};
    const serverUrl = getServerUrl();
    this.tokenConfigKey = `http.${serverUrl.origin}/.extraheader`;
    const basicCredential = Buffer.from(`x-access-token:${this.settings.authToken}`, "utf8").toString("base64");
    core.setSecret(basicCredential);
    this.tokenPlaceholderConfigValue = `AUTHORIZATION: basic ***`;
    this.tokenConfigValue = `AUTHORIZATION: basic ${basicCredential}`;
    this.insteadOfKey = `url.${serverUrl.origin}/.insteadOf`;
    this.insteadOfValue = `git@${serverUrl.hostname}:`;
  }
  async configureAuth() {
    await this.removeAuth();
    await this.configureSsh();
    await this.configureToken();
  }
  async configureGlobalAuth() {
    const runnerTemp = process.env["RUNNER_TEMP"] || "";
    assert2.ok(runnerTemp, "RUNNER_TEMP is not defined");
    const uniqueId = (0, import_v4.default)();
    this.temporaryHomePath = path.join(runnerTemp, uniqueId);
    await fs3.promises.mkdir(this.temporaryHomePath, { recursive: true });
    const gitConfigPath = path.join(process.env["HOME"] || os.homedir(), ".gitconfig");
    const newGitConfigPath = path.join(this.temporaryHomePath, ".gitconfig");
    let configExists = false;
    try {
      await fs3.promises.stat(gitConfigPath);
      configExists = true;
    } catch (err) {
      if (err.code !== "ENOENT") {
        throw err;
      }
    }
    if (configExists) {
      core.info(`Copying '${gitConfigPath}' to '${newGitConfigPath}'`);
      await io.cp(gitConfigPath, newGitConfigPath);
    } else {
      await fs3.promises.writeFile(newGitConfigPath, "");
    }
    try {
      core.info(`Temporarily overriding HOME='${this.temporaryHomePath}' before making global git config changes`);
      this.git.setEnvironmentVariable("HOME", this.temporaryHomePath);
      await this.configureToken(newGitConfigPath, true);
      await this.git.tryConfigUnset(this.insteadOfKey, true);
      if (!this.settings.sshKey) {
        await this.git.config(this.insteadOfKey, this.insteadOfValue, true);
      }
    } catch (err) {
      core.info("Encountered an error when attempting to configure token. Attempting unconfigure.");
      await this.git.tryConfigUnset(this.tokenConfigKey, true);
      throw err;
    }
  }
  async configureSubmoduleAuth() {
    await this.removeGitConfig(this.insteadOfKey, true);
    if (this.settings.persistCredentials) {
      const output = await this.git.submoduleForeach(`git config --local '${this.tokenConfigKey}' '${this.tokenPlaceholderConfigValue}' && git config --local --show-origin --name-only --get-regexp remote.origin.url`, this.settings.nestedSubmodules);
      const configPaths = output.match(/(?<=(^|\n)file:)[^\t]+(?=\tremote\.origin\.url)/g) || [];
      for (const configPath of configPaths) {
        core.debug(`Replacing token placeholder in '${configPath}'`);
        await this.replaceTokenPlaceholder(configPath);
      }
      if (this.settings.sshKey) {
        await this.git.submoduleForeach(`git config --local '${SSH_COMMAND_KEY}' '${this.sshCommand}'`, this.settings.nestedSubmodules);
      } else {
        await this.git.submoduleForeach(`git config --local '${this.insteadOfKey}' '${this.insteadOfValue}'`, this.settings.nestedSubmodules);
      }
    }
  }
  async removeAuth() {
    await this.removeSsh();
    await this.removeToken();
  }
  async removeGlobalAuth() {
    core.debug(`Unsetting HOME override`);
    this.git.removeEnvironmentVariable("HOME");
    await io.rmRF(this.temporaryHomePath);
  }
  async configureSsh() {
    if (!this.settings.sshKey) {
      return;
    }
    const runnerTemp = process.env["RUNNER_TEMP"] || "";
    assert2.ok(runnerTemp, "RUNNER_TEMP is not defined");
    const uniqueId = (0, import_v4.default)();
    this.sshKeyPath = path.join(runnerTemp, uniqueId);
    setSshKeyPath(this.sshKeyPath);
    await fs3.promises.mkdir(runnerTemp, { recursive: true });
    await fs3.promises.writeFile(this.sshKeyPath, this.settings.sshKey.trim() + "\n", { mode: 384 });
    if (IS_WINDOWS) {
      const icacls = await io.which("icacls.exe");
      await exec2.exec(`"${icacls}" "${this.sshKeyPath}" /grant:r "${process.env["USERDOMAIN"]}\\${process.env["USERNAME"]}:F"`);
      await exec2.exec(`"${icacls}" "${this.sshKeyPath}" /inheritance:r`);
    }
    const userKnownHostsPath = path.join(os.homedir(), ".ssh", "known_hosts");
    let userKnownHosts = "";
    try {
      userKnownHosts = (await fs3.promises.readFile(userKnownHostsPath)).toString();
    } catch (err) {
      if (err.code !== "ENOENT") {
        throw err;
      }
    }
    let knownHosts = "";
    if (userKnownHosts) {
      knownHosts += `# Begin from ${userKnownHostsPath}
${userKnownHosts}
# End from ${userKnownHostsPath}
`;
    }
    if (this.settings.sshKnownHosts) {
      knownHosts += `# Begin from input known hosts
${this.settings.sshKnownHosts}
# end from input known hosts
`;
    }
    knownHosts += `# Begin implicitly added github.com
github.com ssh-rsa AAAAB3NzaC1yc2EAAAABIwAAAQEAq2A7hRGmdnm9tUDbO9IDSwBK6TbQa+PXYPCPy6rbTrTtw7PHkccKrpp0yVhp5HdEIcKr6pLlVDBfOLX9QUsyCOV0wzfjIJNlGEYsdlLJizHhbn2mUjvSAHQqZETYP81eFzLQNnPHt4EVVUh7VfDESU84KezmD5QlWpXLmvU31/yMf+Se8xhHTvKSCZIFImWwoG6mbUoWf9nzpIoaSjB+weqqUUmpaaasXVal72J+UX2B+2RPW3RcT0eOzQgqlJL3RKrTJvdsjE3JEAvGq3lGHSZXy28G3skua2SmVi/w4yCE6gbODqnTWlg7+wC604ydGXA8VJiS5ap43JXiUFFAaQ==
# End implicitly added github.com
`;
    this.sshKnownHostsPath = path.join(runnerTemp, `${uniqueId}_known_hosts`);
    setSshKnownHostsPath(this.sshKnownHostsPath);
    await fs3.promises.writeFile(this.sshKnownHostsPath, knownHosts);
    const sshPath = await io.which("ssh", true);
    this.sshCommand = `"${sshPath}" -i "$RUNNER_TEMP/${path.basename(this.sshKeyPath)}"`;
    if (this.settings.sshStrict) {
      this.sshCommand += " -o StrictHostKeyChecking=yes -o CheckHostIP=no";
    }
    this.sshCommand += ` -o "UserKnownHostsFile=$RUNNER_TEMP/${path.basename(this.sshKnownHostsPath)}"`;
    core.info(`Temporarily overriding GIT_SSH_COMMAND=${this.sshCommand}`);
    this.git.setEnvironmentVariable("GIT_SSH_COMMAND", this.sshCommand);
    if (this.settings.persistCredentials) {
      await this.git.config(SSH_COMMAND_KEY, this.sshCommand);
    }
  }
  async configureToken(configPath, globalConfig) {
    assert2.ok(configPath && globalConfig || !configPath && !globalConfig, "Unexpected configureToken parameter combinations");
    if (!configPath && !globalConfig) {
      configPath = path.join(this.git.getWorkingDirectory(), ".git", "config");
    }
    await this.git.config(this.tokenConfigKey, this.tokenPlaceholderConfigValue, globalConfig);
    await this.replaceTokenPlaceholder(configPath || "");
  }
  async replaceTokenPlaceholder(configPath) {
    assert2.ok(configPath, "configPath is not defined");
    let content = (await fs3.promises.readFile(configPath)).toString();
    const placeholderIndex = content.indexOf(this.tokenPlaceholderConfigValue);
    if (placeholderIndex < 0 || placeholderIndex != content.lastIndexOf(this.tokenPlaceholderConfigValue)) {
      throw new Error(`Unable to replace auth placeholder in ${configPath}`);
    }
    assert2.ok(this.tokenConfigValue, "tokenConfigValue is not defined");
    content = content.replace(this.tokenPlaceholderConfigValue, this.tokenConfigValue);
    await fs3.promises.writeFile(configPath, content);
  }
  async removeSsh() {
    const keyPath = this.sshKeyPath || SshKeyPath;
    if (keyPath) {
      try {
        await io.rmRF(keyPath);
      } catch (err) {
        core.debug(err.message);
        core.warning(`Failed to remove SSH key '${keyPath}'`);
      }
    }
    const knownHostsPath = this.sshKnownHostsPath || SshKnownHostsPath;
    if (knownHostsPath) {
      try {
        await io.rmRF(knownHostsPath);
      } catch {
      }
    }
    await this.removeGitConfig(SSH_COMMAND_KEY);
  }
  async removeToken() {
    await this.removeGitConfig(this.tokenConfigKey);
  }
  async removeGitConfig(configKey, submoduleOnly = false) {
    if (!submoduleOnly) {
      if (await this.git.configExists(configKey) && !await this.git.tryConfigUnset(configKey)) {
        core.warning(`Failed to remove '${configKey}' from the git config`);
      }
    }
    const pattern = escape(configKey);
    await this.git.submoduleForeach(`git config --local --name-only --get-regexp '${pattern}' && git config --local --unset-all '${configKey}' || :`, true);
  }
};

// node_modules/checkout/src/git-command-manager.ts
var core4 = __toModule(require_core2());
var exec4 = __toModule(require_exec());
var io2 = __toModule(require_io());
var path2 = __toModule(require("path"));

// node_modules/checkout/src/ref-helper.ts
var import_url2 = __toModule(require("url"));
var core2 = __toModule(require_core2());
var github = __toModule(require_github2());
var tagsRefSpec = "+refs/tags/*:refs/tags/*";
async function getCheckoutInfo(git, ref, commit) {
  if (!git) {
    throw new Error("Arg git cannot be empty");
  }
  if (!ref && !commit) {
    throw new Error("Args ref and commit cannot both be empty");
  }
  const result = {};
  const upperRef = (ref || "").toUpperCase();
  if (!ref) {
    result.ref = commit;
  } else if (upperRef.startsWith("REFS/HEADS/")) {
    const branch = ref.substring("refs/heads/".length);
    result.ref = branch;
    result.startPoint = `refs/remotes/origin/${branch}`;
  } else if (upperRef.startsWith("REFS/PULL/")) {
    const branch = ref.substring("refs/pull/".length);
    result.ref = `refs/remotes/pull/${branch}`;
  } else if (upperRef.startsWith("REFS/")) {
    result.ref = ref;
  } else {
    if (await git.branchExists(true, `origin/${ref}`)) {
      result.ref = ref;
      result.startPoint = `refs/remotes/origin/${ref}`;
    } else if (await git.tagExists(`${ref}`)) {
      result.ref = `refs/tags/${ref}`;
    } else {
      throw new Error(`A branch or tag with the name '${ref}' could not be found`);
    }
  }
  return result;
}
function getRefSpecForAllHistory(ref, commit) {
  const result = ["+refs/heads/*:refs/remotes/origin/*", tagsRefSpec];
  if (ref && ref.toUpperCase().startsWith("REFS/PULL/")) {
    const branch = ref.substring("refs/pull/".length);
    result.push(`+${commit || ref}:refs/remotes/pull/${branch}`);
  }
  return result;
}
function getRefSpec(ref, commit) {
  if (!ref && !commit) {
    throw new Error("Args ref and commit cannot both be empty");
  }
  const upperRef = (ref || "").toUpperCase();
  if (commit) {
    if (upperRef.startsWith("REFS/HEADS/")) {
      const branch = ref.substring("refs/heads/".length);
      return [`+${commit}:refs/remotes/origin/${branch}`];
    } else if (upperRef.startsWith("REFS/PULL/")) {
      const branch = ref.substring("refs/pull/".length);
      return [`+${commit}:refs/remotes/pull/${branch}`];
    } else if (upperRef.startsWith("REFS/TAGS/")) {
      return [`+${commit}:${ref}`];
    } else {
      return [commit];
    }
  } else if (!upperRef.startsWith("REFS/")) {
    return [
      `+refs/heads/${ref}*:refs/remotes/origin/${ref}*`,
      `+refs/tags/${ref}*:refs/tags/${ref}*`
    ];
  } else if (upperRef.startsWith("REFS/HEADS/")) {
    const branch = ref.substring("refs/heads/".length);
    return [`+${ref}:refs/remotes/origin/${branch}`];
  } else if (upperRef.startsWith("REFS/PULL/")) {
    const branch = ref.substring("refs/pull/".length);
    return [`+${ref}:refs/remotes/pull/${branch}`];
  } else {
    return [`+${ref}:${ref}`];
  }
}
async function testRef(git, ref, commit) {
  if (!git) {
    throw new Error("Arg git cannot be empty");
  }
  if (!ref && !commit) {
    throw new Error("Args ref and commit cannot both be empty");
  }
  if (!commit) {
    return true;
  } else if (!ref) {
    return await git.shaExists(commit);
  }
  const upperRef = ref.toUpperCase();
  if (upperRef.startsWith("REFS/HEADS/")) {
    const branch = ref.substring("refs/heads/".length);
    return await git.branchExists(true, `origin/${branch}`) && commit === await git.revParse(`refs/remotes/origin/${branch}`);
  } else if (upperRef.startsWith("REFS/PULL/")) {
    return true;
  } else if (upperRef.startsWith("REFS/TAGS/")) {
    const tagName = ref.substring("refs/tags/".length);
    return await git.tagExists(tagName) && commit === await git.revParse(ref);
  } else {
    core2.debug(`Unexpected ref format '${ref}' when testing ref info`);
    return true;
  }
}
async function checkCommitInfo(token, commitInfo, repositoryOwner, repositoryName, ref, commit) {
  try {
    if (isGhes()) {
      return;
    }
    if (!token) {
      return;
    }
    if (fromPayload("repository.private") !== false || github.context.eventName !== "pull_request" || fromPayload("action") !== "synchronize" || repositoryOwner !== github.context.repo.owner || repositoryName !== github.context.repo.repo || ref !== github.context.ref || !ref.startsWith("refs/pull/") || commit !== github.context.sha) {
      return;
    }
    const expectedHeadSha = fromPayload("after");
    if (!expectedHeadSha) {
      core2.debug("Unable to determine head sha");
      return;
    }
    const expectedBaseSha = fromPayload("pull_request.base.sha");
    if (!expectedBaseSha) {
      core2.debug("Unable to determine base sha");
      return;
    }
    const expectedMessage = `Merge ${expectedHeadSha} into ${expectedBaseSha}`;
    if (commitInfo.indexOf(expectedMessage) >= 0) {
      return;
    }
    const match = commitInfo.match(/Merge ([0-9a-f]{40}) into ([0-9a-f]{40})/);
    if (!match) {
      core2.debug("Unexpected message format");
      return;
    }
    const actualHeadSha = match[1];
    if (actualHeadSha !== expectedHeadSha) {
      core2.debug(`Expected head sha ${expectedHeadSha}; actual head sha ${actualHeadSha}`);
      const octokit = new github.GitHub(token, {
        userAgent: `actions-checkout-tracepoint/1.0 (code=STALE_MERGE;owner=${repositoryOwner};repo=${repositoryName};pr=${fromPayload("number")};run_id=${process.env["GITHUB_RUN_ID"]};expected_head_sha=${expectedHeadSha};actual_head_sha=${actualHeadSha})`
      });
      await octokit.repos.get({ owner: repositoryOwner, repo: repositoryName });
    }
  } catch (err) {
    core2.debug(`Error when validating commit info: ${err.stack}`);
  }
}
function fromPayload(path7) {
  return select(github.context.payload, path7);
}
function select(obj, path7) {
  if (!obj) {
    return void 0;
  }
  const i = path7.indexOf(".");
  if (i < 0) {
    return obj[path7];
  }
  const key = path7.substr(0, i);
  return select(obj[key], path7.substr(i + 1));
}
function isGhes() {
  const ghUrl = new import_url2.URL(process.env["GITHUB_SERVER_URL"] || "https://github.com");
  return ghUrl.hostname.toUpperCase() !== "GITHUB.COM";
}

// node_modules/checkout/src/retry-helper.ts
var core3 = __toModule(require_core2());
var defaultMaxAttempts = 3;
var defaultMinSeconds = 10;
var defaultMaxSeconds = 20;
var RetryHelper = class {
  constructor(maxAttempts = defaultMaxAttempts, minSeconds = defaultMinSeconds, maxSeconds = defaultMaxSeconds) {
    this.maxAttempts = maxAttempts;
    this.minSeconds = Math.floor(minSeconds);
    this.maxSeconds = Math.floor(maxSeconds);
    if (this.minSeconds > this.maxSeconds) {
      throw new Error("min seconds should be less than or equal to max seconds");
    }
  }
  async execute(action) {
    let attempt = 1;
    while (attempt < this.maxAttempts) {
      try {
        return await action();
      } catch (err) {
        core3.info(err.message);
      }
      const seconds = this.getSleepAmount();
      core3.info(`Waiting ${seconds} seconds before trying again`);
      await this.sleep(seconds);
      attempt++;
    }
    return await action();
  }
  getSleepAmount() {
    return Math.floor(Math.random() * (this.maxSeconds - this.minSeconds + 1)) + this.minSeconds;
  }
  async sleep(seconds) {
    return new Promise((resolve2) => setTimeout(resolve2, seconds * 1e3));
  }
};
async function execute(action) {
  const retryHelper3 = new RetryHelper();
  return await retryHelper3.execute(action);
}

// node_modules/checkout/src/git-version.ts
var GitVersion = class {
  constructor(version) {
    this.major = NaN;
    this.minor = NaN;
    this.patch = NaN;
    if (version) {
      const match = version.match(/^(\d+)\.(\d+)(\.(\d+))?$/);
      if (match) {
        this.major = Number(match[1]);
        this.minor = Number(match[2]);
        if (match[4]) {
          this.patch = Number(match[4]);
        }
      }
    }
  }
  checkMinimum(minimum) {
    if (!minimum.isValid()) {
      throw new Error("Arg minimum is not a valid version");
    }
    if (this.major < minimum.major) {
      return false;
    }
    if (this.major === minimum.major) {
      if (this.minor < minimum.minor) {
        return false;
      }
      if (this.minor === minimum.minor) {
        if (this.patch && this.patch < (minimum.patch || 0)) {
          return false;
        }
      }
    }
    return true;
  }
  isValid() {
    return !isNaN(this.major);
  }
  toString() {
    let result = "";
    if (this.isValid()) {
      result = `${this.major}.${this.minor}`;
      if (!isNaN(this.patch)) {
        result += `.${this.patch}`;
      }
    }
    return result;
  }
};

// node_modules/checkout/src/git-command-manager.ts
var MinimumGitVersion = new GitVersion("2.18");
async function createCommandManager(workingDirectory, lfs) {
  return await GitCommandManager.createCommandManager(workingDirectory, lfs);
}
var GitCommandManager = class {
  constructor() {
    this.gitEnv = {
      GIT_TERMINAL_PROMPT: "0",
      GCM_INTERACTIVE: "Never"
    };
    this.gitPath = "";
    this.lfs = false;
    this.workingDirectory = "";
  }
  async branchDelete(remote, branch) {
    const args = ["branch", "--delete", "--force"];
    if (remote) {
      args.push("--remote");
    }
    args.push(branch);
    await this.execGit(args);
  }
  async branchExists(remote, pattern) {
    const args = ["branch", "--list"];
    if (remote) {
      args.push("--remote");
    }
    args.push(pattern);
    const output = await this.execGit(args);
    return !!output.stdout.trim();
  }
  async branchList(remote) {
    const result = [];
    const args = ["rev-parse", "--symbolic-full-name"];
    if (remote) {
      args.push("--remotes=origin");
    } else {
      args.push("--branches");
    }
    const output = await this.execGit(args);
    for (let branch of output.stdout.trim().split("\n")) {
      branch = branch.trim();
      if (branch) {
        if (branch.startsWith("refs/heads/")) {
          branch = branch.substr("refs/heads/".length);
        } else if (branch.startsWith("refs/remotes/")) {
          branch = branch.substr("refs/remotes/".length);
        }
        result.push(branch);
      }
    }
    return result;
  }
  async checkout(ref, startPoint) {
    const args = ["checkout", "--progress", "--force"];
    if (startPoint) {
      args.push("-B", ref, startPoint);
    } else {
      args.push(ref);
    }
    await this.execGit(args);
  }
  async checkoutDetach() {
    const args = ["checkout", "--detach"];
    await this.execGit(args);
  }
  async config(configKey, configValue, globalConfig) {
    await this.execGit([
      "config",
      globalConfig ? "--global" : "--local",
      configKey,
      configValue
    ]);
  }
  async configExists(configKey, globalConfig) {
    const pattern = escape(configKey);
    const output = await this.execGit([
      "config",
      globalConfig ? "--global" : "--local",
      "--name-only",
      "--get-regexp",
      pattern
    ], true);
    return output.exitCode === 0;
  }
  async fetch(refSpec, fetchDepth) {
    const args = ["-c", "protocol.version=2", "fetch"];
    if (!refSpec.some((x) => x === tagsRefSpec)) {
      args.push("--no-tags");
    }
    args.push("--prune", "--progress", "--no-recurse-submodules");
    if (fetchDepth && fetchDepth > 0) {
      args.push(`--depth=${fetchDepth}`);
    } else if (fileExistsSync(path2.join(this.workingDirectory, ".git", "shallow"))) {
      args.push("--unshallow");
    }
    args.push("origin");
    for (const arg of refSpec) {
      args.push(arg);
    }
    const that = this;
    await execute(async () => {
      await that.execGit(args);
    });
  }
  async getDefaultBranch(repositoryUrl) {
    let output;
    await execute(async () => {
      output = await this.execGit([
        "ls-remote",
        "--quiet",
        "--exit-code",
        "--symref",
        repositoryUrl,
        "HEAD"
      ]);
    });
    if (output) {
      for (let line of output.stdout.trim().split("\n")) {
        line = line.trim();
        if (line.startsWith("ref:") || line.endsWith("HEAD")) {
          return line.substr("ref:".length, line.length - "ref:".length - "HEAD".length).trim();
        }
      }
    }
    throw new Error("Unexpected output when retrieving default branch");
  }
  getWorkingDirectory() {
    return this.workingDirectory;
  }
  async init() {
    await this.execGit(["init", this.workingDirectory]);
  }
  async isDetached() {
    const output = await this.execGit(["rev-parse", "--symbolic-full-name", "--verify", "--quiet", "HEAD"], true);
    return !output.stdout.trim().startsWith("refs/heads/");
  }
  async lfsFetch(ref) {
    const args = ["lfs", "fetch", "origin", ref];
    const that = this;
    await execute(async () => {
      await that.execGit(args);
    });
  }
  async lfsInstall() {
    await this.execGit(["lfs", "install", "--local"]);
  }
  async log1(format) {
    var args = format ? ["log", "-1", format] : ["log", "-1"];
    var silent = format ? false : true;
    const output = await this.execGit(args, false, silent);
    return output.stdout;
  }
  async remoteAdd(remoteName, remoteUrl) {
    await this.execGit(["remote", "add", remoteName, remoteUrl]);
  }
  removeEnvironmentVariable(name) {
    delete this.gitEnv[name];
  }
  async revParse(ref) {
    const output = await this.execGit(["rev-parse", ref]);
    return output.stdout.trim();
  }
  setEnvironmentVariable(name, value) {
    this.gitEnv[name] = value;
  }
  async shaExists(sha) {
    const args = ["rev-parse", "--verify", "--quiet", `${sha}^{object}`];
    const output = await this.execGit(args, true);
    return output.exitCode === 0;
  }
  async submoduleForeach(command, recursive) {
    const args = ["submodule", "foreach"];
    if (recursive) {
      args.push("--recursive");
    }
    args.push(command);
    const output = await this.execGit(args);
    return output.stdout;
  }
  async submoduleSync(recursive) {
    const args = ["submodule", "sync"];
    if (recursive) {
      args.push("--recursive");
    }
    await this.execGit(args);
  }
  async submoduleUpdate(fetchDepth, recursive) {
    const args = ["-c", "protocol.version=2"];
    args.push("submodule", "update", "--init", "--force");
    if (fetchDepth > 0) {
      args.push(`--depth=${fetchDepth}`);
    }
    if (recursive) {
      args.push("--recursive");
    }
    await this.execGit(args);
  }
  async tagExists(pattern) {
    const output = await this.execGit(["tag", "--list", pattern]);
    return !!output.stdout.trim();
  }
  async tryClean() {
    const output = await this.execGit(["clean", "-ffdx"], true);
    return output.exitCode === 0;
  }
  async tryConfigUnset(configKey, globalConfig) {
    const output = await this.execGit([
      "config",
      globalConfig ? "--global" : "--local",
      "--unset-all",
      configKey
    ], true);
    return output.exitCode === 0;
  }
  async tryDisableAutomaticGarbageCollection() {
    const output = await this.execGit(["config", "--local", "gc.auto", "0"], true);
    return output.exitCode === 0;
  }
  async tryGetFetchUrl() {
    const output = await this.execGit(["config", "--local", "--get", "remote.origin.url"], true);
    if (output.exitCode !== 0) {
      return "";
    }
    const stdout = output.stdout.trim();
    if (stdout.includes("\n")) {
      return "";
    }
    return stdout;
  }
  async tryReset() {
    const output = await this.execGit(["reset", "--hard", "HEAD"], true);
    return output.exitCode === 0;
  }
  static async createCommandManager(workingDirectory, lfs) {
    const result = new GitCommandManager();
    await result.initializeCommandManager(workingDirectory, lfs);
    return result;
  }
  async execGit(args, allowAllExitCodes = false, silent = false) {
    directoryExistsSync(this.workingDirectory, true);
    const result = new GitOutput();
    const env = {};
    for (const key of Object.keys(process.env)) {
      env[key] = process.env[key];
    }
    for (const key of Object.keys(this.gitEnv)) {
      env[key] = this.gitEnv[key];
    }
    const stdout = [];
    const options = {
      cwd: this.workingDirectory,
      env,
      silent,
      ignoreReturnCode: allowAllExitCodes,
      listeners: {
        stdout: (data) => {
          stdout.push(data.toString());
        }
      }
    };
    result.exitCode = await exec4.exec(`"${this.gitPath}"`, args, options);
    result.stdout = stdout.join("");
    return result;
  }
  async initializeCommandManager(workingDirectory, lfs) {
    this.workingDirectory = workingDirectory;
    this.lfs = lfs;
    if (!this.lfs) {
      this.gitEnv["GIT_LFS_SKIP_SMUDGE"] = "1";
    }
    this.gitPath = await io2.which("git", true);
    core4.debug("Getting git version");
    let gitVersion = new GitVersion();
    let gitOutput = await this.execGit(["version"]);
    let stdout = gitOutput.stdout.trim();
    if (!stdout.includes("\n")) {
      const match = stdout.match(/\d+\.\d+(\.\d+)?/);
      if (match) {
        gitVersion = new GitVersion(match[0]);
      }
    }
    if (!gitVersion.isValid()) {
      throw new Error("Unable to determine git version");
    }
    if (!gitVersion.checkMinimum(MinimumGitVersion)) {
      throw new Error(`Minimum required git version is ${MinimumGitVersion}. Your git ('${this.gitPath}') is ${gitVersion}`);
    }
    if (this.lfs) {
      core4.debug("Getting git-lfs version");
      let gitLfsVersion = new GitVersion();
      const gitLfsPath = await io2.which("git-lfs", true);
      gitOutput = await this.execGit(["lfs", "version"]);
      stdout = gitOutput.stdout.trim();
      if (!stdout.includes("\n")) {
        const match = stdout.match(/\d+\.\d+(\.\d+)?/);
        if (match) {
          gitLfsVersion = new GitVersion(match[0]);
        }
      }
      if (!gitLfsVersion.isValid()) {
        throw new Error("Unable to determine git-lfs version");
      }
      const minimumGitLfsVersion = new GitVersion("2.1");
      if (!gitLfsVersion.checkMinimum(minimumGitLfsVersion)) {
        throw new Error(`Minimum required git-lfs version is ${minimumGitLfsVersion}. Your git-lfs ('${gitLfsPath}') is ${gitLfsVersion}`);
      }
    }
    const gitHttpUserAgent = `git/${gitVersion} (github-actions-checkout)`;
    core4.debug(`Set git useragent to: ${gitHttpUserAgent}`);
    this.gitEnv["GIT_HTTP_USER_AGENT"] = gitHttpUserAgent;
  }
};
var GitOutput = class {
  constructor() {
    this.stdout = "";
    this.exitCode = 0;
  }
};

// node_modules/checkout/src/git-directory-helper.ts
var assert3 = __toModule(require("assert"));
var core5 = __toModule(require_core2());
var fs4 = __toModule(require("fs"));
var io3 = __toModule(require_io());
var path3 = __toModule(require("path"));
async function prepareExistingDirectory(git, repositoryPath, repositoryUrl, clean, ref) {
  assert3.ok(repositoryPath, "Expected repositoryPath to be defined");
  assert3.ok(repositoryUrl, "Expected repositoryUrl to be defined");
  let remove = false;
  if (!git) {
    remove = true;
  } else if (!directoryExistsSync(path3.join(repositoryPath, ".git")) || repositoryUrl !== await git.tryGetFetchUrl()) {
    remove = true;
  } else {
    const lockPaths = [
      path3.join(repositoryPath, ".git", "index.lock"),
      path3.join(repositoryPath, ".git", "shallow.lock")
    ];
    for (const lockPath of lockPaths) {
      try {
        await io3.rmRF(lockPath);
      } catch (error) {
        core5.debug(`Unable to delete '${lockPath}'. ${error.message}`);
      }
    }
    try {
      core5.startGroup("Removing previously created refs, to avoid conflicts");
      if (!await git.isDetached()) {
        await git.checkoutDetach();
      }
      let branches = await git.branchList(false);
      for (const branch of branches) {
        await git.branchDelete(false, branch);
      }
      if (ref) {
        ref = ref.startsWith("refs/") ? ref : `refs/heads/${ref}`;
        if (ref.startsWith("refs/heads/")) {
          const upperName1 = ref.toUpperCase().substr("REFS/HEADS/".length);
          const upperName1Slash = `${upperName1}/`;
          branches = await git.branchList(true);
          for (const branch of branches) {
            const upperName2 = branch.substr("origin/".length).toUpperCase();
            const upperName2Slash = `${upperName2}/`;
            if (upperName1.startsWith(upperName2Slash) || upperName2.startsWith(upperName1Slash)) {
              await git.branchDelete(true, branch);
            }
          }
        }
      }
      core5.endGroup();
      if (clean) {
        core5.startGroup("Cleaning the repository");
        if (!await git.tryClean()) {
          core5.debug(`The clean command failed. This might be caused by: 1) path too long, 2) permission issue, or 3) file in use. For futher investigation, manually run 'git clean -ffdx' on the directory '${repositoryPath}'.`);
          remove = true;
        } else if (!await git.tryReset()) {
          remove = true;
        }
        core5.endGroup();
        if (remove) {
          core5.warning(`Unable to clean or reset the repository. The repository will be recreated instead.`);
        }
      }
    } catch (error) {
      core5.warning(`Unable to prepare the existing repository. The repository will be recreated instead.`);
      remove = true;
    }
  }
  if (remove) {
    core5.info(`Deleting the contents of '${repositoryPath}'`);
    for (const file of await fs4.promises.readdir(repositoryPath)) {
      await io3.rmRF(path3.join(repositoryPath, file));
    }
  }
}

// node_modules/checkout/src/github-api-helper.ts
var assert4 = __toModule(require("assert"));
var core6 = __toModule(require_core2());
var fs5 = __toModule(require("fs"));
var github2 = __toModule(require_github2());
var io4 = __toModule(require_io());
var path4 = __toModule(require("path"));
var toolCache = __toModule(require_tool_cache());
var import_v42 = __toModule(require_v4());
var IS_WINDOWS2 = process.platform === "win32";
async function downloadRepository(authToken, owner, repo, ref, commit, repositoryPath) {
  if (!ref && !commit) {
    core6.info("Determining the default branch");
    ref = await getDefaultBranch(authToken, owner, repo);
  }
  let archiveData = await execute(async () => {
    core6.info("Downloading the archive");
    return await downloadArchive(authToken, owner, repo, ref, commit);
  });
  core6.info("Writing archive to disk");
  const uniqueId = (0, import_v42.default)();
  const archivePath = path4.join(repositoryPath, `${uniqueId}.tar.gz`);
  await fs5.promises.writeFile(archivePath, archiveData);
  archiveData = Buffer.from("");
  core6.info("Extracting the archive");
  const extractPath = path4.join(repositoryPath, uniqueId);
  await io4.mkdirP(extractPath);
  if (IS_WINDOWS2) {
    await toolCache.extractZip(archivePath, extractPath);
  } else {
    await toolCache.extractTar(archivePath, extractPath);
  }
  await io4.rmRF(archivePath);
  const archiveFileNames = await fs5.promises.readdir(extractPath);
  assert4.ok(archiveFileNames.length == 1, "Expected exactly one directory inside archive");
  const archiveVersion = archiveFileNames[0];
  core6.info(`Resolved version ${archiveVersion}`);
  const tempRepositoryPath = path4.join(extractPath, archiveVersion);
  for (const fileName of await fs5.promises.readdir(tempRepositoryPath)) {
    const sourcePath = path4.join(tempRepositoryPath, fileName);
    const targetPath = path4.join(repositoryPath, fileName);
    if (IS_WINDOWS2) {
      await io4.cp(sourcePath, targetPath, { recursive: true });
    } else {
      await io4.mv(sourcePath, targetPath);
    }
  }
  await io4.rmRF(extractPath);
}
async function getDefaultBranch(authToken, owner, repo) {
  return await execute(async () => {
    core6.info("Retrieving the default branch name");
    const octokit = new github2.GitHub(authToken);
    let result;
    try {
      const response = await octokit.repos.get({ owner, repo });
      result = response.data.default_branch;
      assert4.ok(result, "default_branch cannot be empty");
    } catch (err) {
      if (err["status"] === 404 && repo.toUpperCase().endsWith(".WIKI")) {
        result = "master";
      } else {
        throw err;
      }
    }
    core6.info(`Default branch '${result}'`);
    if (!result.startsWith("refs/")) {
      result = `refs/heads/${result}`;
    }
    return result;
  });
}
async function downloadArchive(authToken, owner, repo, ref, commit) {
  const octokit = new github2.GitHub(authToken);
  const params = {
    owner,
    repo,
    archive_format: IS_WINDOWS2 ? "zipball" : "tarball",
    ref: commit || ref
  };
  const response = await octokit.repos.getArchiveLink(params);
  if (response.status != 200) {
    throw new Error(`Unexpected response from GitHub API. Status: ${response.status}, Data: ${response.data}`);
  }
  return Buffer.from(response.data);
}

// node_modules/checkout/src/git-source-provider.ts
var io5 = __toModule(require_io());
var path5 = __toModule(require("path"));
async function getSource(settings) {
  core7.info(`Syncing repository: ${settings.repositoryOwner}/${settings.repositoryName}`);
  const repositoryUrl = getFetchUrl(settings);
  if (fileExistsSync(settings.repositoryPath)) {
    await io5.rmRF(settings.repositoryPath);
  }
  let isExisting = true;
  if (!directoryExistsSync(settings.repositoryPath)) {
    isExisting = false;
    await io5.mkdirP(settings.repositoryPath);
  }
  core7.startGroup("Getting Git version info");
  const git = await getGitCommandManager(settings);
  core7.endGroup();
  if (isExisting) {
    await prepareExistingDirectory(git, settings.repositoryPath, repositoryUrl, settings.clean, settings.ref);
  }
  if (!git) {
    core7.info(`The repository will be downloaded using the GitHub REST API`);
    core7.info(`To create a local Git repository instead, add Git ${MinimumGitVersion} or higher to the PATH`);
    if (settings.submodules) {
      throw new Error(`Input 'submodules' not supported when falling back to download using the GitHub REST API. To create a local Git repository instead, add Git ${MinimumGitVersion} or higher to the PATH.`);
    } else if (settings.sshKey) {
      throw new Error(`Input 'ssh-key' not supported when falling back to download using the GitHub REST API. To create a local Git repository instead, add Git ${MinimumGitVersion} or higher to the PATH.`);
    }
    await downloadRepository(settings.authToken, settings.repositoryOwner, settings.repositoryName, settings.ref, settings.commit, settings.repositoryPath);
    return;
  }
  setRepositoryPath(settings.repositoryPath);
  if (!directoryExistsSync(path5.join(settings.repositoryPath, ".git"))) {
    core7.startGroup("Initializing the repository");
    await git.init();
    await git.remoteAdd("origin", repositoryUrl);
    core7.endGroup();
  }
  core7.startGroup("Disabling automatic garbage collection");
  if (!await git.tryDisableAutomaticGarbageCollection()) {
    core7.warning(`Unable to turn off git automatic garbage collection. The git fetch operation may trigger garbage collection and cause a delay.`);
  }
  core7.endGroup();
  const authHelper = createAuthHelper(git, settings);
  try {
    core7.startGroup("Setting up auth");
    await authHelper.configureAuth();
    core7.endGroup();
    if (!settings.ref && !settings.commit) {
      core7.startGroup("Determining the default branch");
      if (settings.sshKey) {
        settings.ref = await git.getDefaultBranch(repositoryUrl);
      } else {
        settings.ref = await getDefaultBranch(settings.authToken, settings.repositoryOwner, settings.repositoryName);
      }
      core7.endGroup();
    }
    if (settings.lfs) {
      await git.lfsInstall();
    }
    core7.startGroup("Fetching the repository");
    if (settings.fetchDepth <= 0) {
      let refSpec = getRefSpecForAllHistory(settings.ref, settings.commit);
      await git.fetch(refSpec);
      if (!await testRef(git, settings.ref, settings.commit)) {
        refSpec = getRefSpec(settings.ref, settings.commit);
        await git.fetch(refSpec);
      }
    } else {
      const refSpec = getRefSpec(settings.ref, settings.commit);
      await git.fetch(refSpec, settings.fetchDepth);
    }
    core7.endGroup();
    core7.startGroup("Determining the checkout info");
    const checkoutInfo = await getCheckoutInfo(git, settings.ref, settings.commit);
    core7.endGroup();
    if (settings.lfs) {
      core7.startGroup("Fetching LFS objects");
      await git.lfsFetch(checkoutInfo.startPoint || checkoutInfo.ref);
      core7.endGroup();
    }
    core7.startGroup("Checking out the ref");
    await git.checkout(checkoutInfo.ref, checkoutInfo.startPoint);
    core7.endGroup();
    if (settings.submodules) {
      try {
        core7.startGroup("Setting up auth for fetching submodules");
        await authHelper.configureGlobalAuth();
        core7.endGroup();
        core7.startGroup("Fetching submodules");
        await git.submoduleSync(settings.nestedSubmodules);
        await git.submoduleUpdate(settings.fetchDepth, settings.nestedSubmodules);
        await git.submoduleForeach("git config --local gc.auto 0", settings.nestedSubmodules);
        core7.endGroup();
        if (settings.persistCredentials) {
          core7.startGroup("Persisting credentials for submodules");
          await authHelper.configureSubmoduleAuth();
          core7.endGroup();
        }
      } finally {
        await authHelper.removeGlobalAuth();
      }
    }
    const commitInfo = await git.log1();
    await git.log1("--format='%H'");
    await checkCommitInfo(settings.authToken, commitInfo, settings.repositoryOwner, settings.repositoryName, settings.ref, settings.commit);
  } finally {
    if (!settings.persistCredentials) {
      core7.startGroup("Removing auth");
      await authHelper.removeAuth();
      core7.endGroup();
    }
  }
}
async function getGitCommandManager(settings) {
  core7.info(`Working directory is '${settings.repositoryPath}'`);
  try {
    return await createCommandManager(settings.repositoryPath, settings.lfs);
  } catch (err) {
    if (settings.lfs) {
      throw err;
    }
    return void 0;
  }
}

// node_modules/checkout/src/input-helper.ts
var core8 = __toModule(require_core2());
var github3 = __toModule(require_github2());
var path6 = __toModule(require("path"));
function getInputs() {
  const result = {};
  let githubWorkspacePath = process.env["GITHUB_WORKSPACE"];
  if (!githubWorkspacePath) {
    throw new Error("GITHUB_WORKSPACE not defined");
  }
  githubWorkspacePath = path6.resolve(githubWorkspacePath);
  core8.debug(`GITHUB_WORKSPACE = '${githubWorkspacePath}'`);
  directoryExistsSync(githubWorkspacePath, true);
  const qualifiedRepository = core8.getInput("repository") || `${github3.context.repo.owner}/${github3.context.repo.repo}`;
  core8.debug(`qualified repository = '${qualifiedRepository}'`);
  const splitRepository = qualifiedRepository.split("/");
  if (splitRepository.length !== 2 || !splitRepository[0] || !splitRepository[1]) {
    throw new Error(`Invalid repository '${qualifiedRepository}'. Expected format {owner}/{repo}.`);
  }
  result.repositoryOwner = splitRepository[0];
  result.repositoryName = splitRepository[1];
  result.repositoryPath = core8.getInput("path") || ".";
  result.repositoryPath = path6.resolve(githubWorkspacePath, result.repositoryPath);
  if (!(result.repositoryPath + path6.sep).startsWith(githubWorkspacePath + path6.sep)) {
    throw new Error(`Repository path '${result.repositoryPath}' is not under '${githubWorkspacePath}'`);
  }
  const isWorkflowRepository = qualifiedRepository.toUpperCase() === `${github3.context.repo.owner}/${github3.context.repo.repo}`.toUpperCase();
  result.ref = core8.getInput("ref");
  if (!result.ref) {
    if (isWorkflowRepository) {
      result.ref = github3.context.ref;
      result.commit = github3.context.sha;
      if (result.commit && result.ref && !result.ref.startsWith("refs/")) {
        result.ref = `refs/heads/${result.ref}`;
      }
    }
  } else if (result.ref.match(/^[0-9a-fA-F]{40}$/)) {
    result.commit = result.ref;
    result.ref = "";
  }
  core8.debug(`ref = '${result.ref}'`);
  core8.debug(`commit = '${result.commit}'`);
  result.clean = (core8.getInput("clean") || "true").toUpperCase() === "TRUE";
  core8.debug(`clean = ${result.clean}`);
  result.fetchDepth = Math.floor(Number(core8.getInput("fetch-depth") || "1"));
  if (isNaN(result.fetchDepth) || result.fetchDepth < 0) {
    result.fetchDepth = 0;
  }
  core8.debug(`fetch depth = ${result.fetchDepth}`);
  result.lfs = (core8.getInput("lfs") || "false").toUpperCase() === "TRUE";
  core8.debug(`lfs = ${result.lfs}`);
  result.submodules = false;
  result.nestedSubmodules = false;
  const submodulesString = (core8.getInput("submodules") || "").toUpperCase();
  if (submodulesString == "RECURSIVE") {
    result.submodules = true;
    result.nestedSubmodules = true;
  } else if (submodulesString == "TRUE") {
    result.submodules = true;
  }
  core8.debug(`submodules = ${result.submodules}`);
  core8.debug(`recursive submodules = ${result.nestedSubmodules}`);
  result.authToken = core8.getInput("token", { required: true });
  result.sshKey = core8.getInput("ssh-key");
  result.sshKnownHosts = core8.getInput("ssh-known-hosts");
  result.sshStrict = (core8.getInput("ssh-strict") || "true").toUpperCase() === "TRUE";
  result.persistCredentials = (core8.getInput("persist-credentials") || "false").toUpperCase() === "TRUE";
  return result;
}

// accept/src/checks.ts
var import_fs3 = __toModule(require("fs"));

// node_modules/js-yaml/dist/js-yaml.mjs
function isNothing(subject) {
  return typeof subject === "undefined" || subject === null;
}
function isObject(subject) {
  return typeof subject === "object" && subject !== null;
}
function toArray(sequence) {
  if (Array.isArray(sequence))
    return sequence;
  else if (isNothing(sequence))
    return [];
  return [sequence];
}
function extend(target, source) {
  var index, length, key, sourceKeys;
  if (source) {
    sourceKeys = Object.keys(source);
    for (index = 0, length = sourceKeys.length; index < length; index += 1) {
      key = sourceKeys[index];
      target[key] = source[key];
    }
  }
  return target;
}
function repeat(string, count) {
  var result = "", cycle;
  for (cycle = 0; cycle < count; cycle += 1) {
    result += string;
  }
  return result;
}
function isNegativeZero(number) {
  return number === 0 && Number.NEGATIVE_INFINITY === 1 / number;
}
var isNothing_1 = isNothing;
var isObject_1 = isObject;
var toArray_1 = toArray;
var repeat_1 = repeat;
var isNegativeZero_1 = isNegativeZero;
var extend_1 = extend;
var common = {
  isNothing: isNothing_1,
  isObject: isObject_1,
  toArray: toArray_1,
  repeat: repeat_1,
  isNegativeZero: isNegativeZero_1,
  extend: extend_1
};
function formatError(exception2, compact) {
  var where = "", message = exception2.reason || "(unknown reason)";
  if (!exception2.mark)
    return message;
  if (exception2.mark.name) {
    where += 'in "' + exception2.mark.name + '" ';
  }
  where += "(" + (exception2.mark.line + 1) + ":" + (exception2.mark.column + 1) + ")";
  if (!compact && exception2.mark.snippet) {
    where += "\n\n" + exception2.mark.snippet;
  }
  return message + " " + where;
}
function YAMLException$1(reason, mark) {
  Error.call(this);
  this.name = "YAMLException";
  this.reason = reason;
  this.mark = mark;
  this.message = formatError(this, false);
  if (Error.captureStackTrace) {
    Error.captureStackTrace(this, this.constructor);
  } else {
    this.stack = new Error().stack || "";
  }
}
YAMLException$1.prototype = Object.create(Error.prototype);
YAMLException$1.prototype.constructor = YAMLException$1;
YAMLException$1.prototype.toString = function toString(compact) {
  return this.name + ": " + formatError(this, compact);
};
var exception = YAMLException$1;
function getLine(buffer, lineStart, lineEnd, position, maxLineLength) {
  var head = "";
  var tail = "";
  var maxHalfLength = Math.floor(maxLineLength / 2) - 1;
  if (position - lineStart > maxHalfLength) {
    head = " ... ";
    lineStart = position - maxHalfLength + head.length;
  }
  if (lineEnd - position > maxHalfLength) {
    tail = " ...";
    lineEnd = position + maxHalfLength - tail.length;
  }
  return {
    str: head + buffer.slice(lineStart, lineEnd).replace(/\t/g, "\u2192") + tail,
    pos: position - lineStart + head.length
  };
}
function padStart(string, max) {
  return common.repeat(" ", max - string.length) + string;
}
function makeSnippet(mark, options) {
  options = Object.create(options || null);
  if (!mark.buffer)
    return null;
  if (!options.maxLength)
    options.maxLength = 79;
  if (typeof options.indent !== "number")
    options.indent = 1;
  if (typeof options.linesBefore !== "number")
    options.linesBefore = 3;
  if (typeof options.linesAfter !== "number")
    options.linesAfter = 2;
  var re = /\r?\n|\r|\0/g;
  var lineStarts = [0];
  var lineEnds = [];
  var match;
  var foundLineNo = -1;
  while (match = re.exec(mark.buffer)) {
    lineEnds.push(match.index);
    lineStarts.push(match.index + match[0].length);
    if (mark.position <= match.index && foundLineNo < 0) {
      foundLineNo = lineStarts.length - 2;
    }
  }
  if (foundLineNo < 0)
    foundLineNo = lineStarts.length - 1;
  var result = "", i, line;
  var lineNoLength = Math.min(mark.line + options.linesAfter, lineEnds.length).toString().length;
  var maxLineLength = options.maxLength - (options.indent + lineNoLength + 3);
  for (i = 1; i <= options.linesBefore; i++) {
    if (foundLineNo - i < 0)
      break;
    line = getLine(mark.buffer, lineStarts[foundLineNo - i], lineEnds[foundLineNo - i], mark.position - (lineStarts[foundLineNo] - lineStarts[foundLineNo - i]), maxLineLength);
    result = common.repeat(" ", options.indent) + padStart((mark.line - i + 1).toString(), lineNoLength) + " | " + line.str + "\n" + result;
  }
  line = getLine(mark.buffer, lineStarts[foundLineNo], lineEnds[foundLineNo], mark.position, maxLineLength);
  result += common.repeat(" ", options.indent) + padStart((mark.line + 1).toString(), lineNoLength) + " | " + line.str + "\n";
  result += common.repeat("-", options.indent + lineNoLength + 3 + line.pos) + "^\n";
  for (i = 1; i <= options.linesAfter; i++) {
    if (foundLineNo + i >= lineEnds.length)
      break;
    line = getLine(mark.buffer, lineStarts[foundLineNo + i], lineEnds[foundLineNo + i], mark.position - (lineStarts[foundLineNo] - lineStarts[foundLineNo + i]), maxLineLength);
    result += common.repeat(" ", options.indent) + padStart((mark.line + i + 1).toString(), lineNoLength) + " | " + line.str + "\n";
  }
  return result.replace(/\n$/, "");
}
var snippet = makeSnippet;
var TYPE_CONSTRUCTOR_OPTIONS = [
  "kind",
  "multi",
  "resolve",
  "construct",
  "instanceOf",
  "predicate",
  "represent",
  "representName",
  "defaultStyle",
  "styleAliases"
];
var YAML_NODE_KINDS = [
  "scalar",
  "sequence",
  "mapping"
];
function compileStyleAliases(map2) {
  var result = {};
  if (map2 !== null) {
    Object.keys(map2).forEach(function(style) {
      map2[style].forEach(function(alias) {
        result[String(alias)] = style;
      });
    });
  }
  return result;
}
function Type$1(tag, options) {
  options = options || {};
  Object.keys(options).forEach(function(name) {
    if (TYPE_CONSTRUCTOR_OPTIONS.indexOf(name) === -1) {
      throw new exception('Unknown option "' + name + '" is met in definition of "' + tag + '" YAML type.');
    }
  });
  this.options = options;
  this.tag = tag;
  this.kind = options["kind"] || null;
  this.resolve = options["resolve"] || function() {
    return true;
  };
  this.construct = options["construct"] || function(data) {
    return data;
  };
  this.instanceOf = options["instanceOf"] || null;
  this.predicate = options["predicate"] || null;
  this.represent = options["represent"] || null;
  this.representName = options["representName"] || null;
  this.defaultStyle = options["defaultStyle"] || null;
  this.multi = options["multi"] || false;
  this.styleAliases = compileStyleAliases(options["styleAliases"] || null);
  if (YAML_NODE_KINDS.indexOf(this.kind) === -1) {
    throw new exception('Unknown kind "' + this.kind + '" is specified for "' + tag + '" YAML type.');
  }
}
var type = Type$1;
function compileList(schema2, name) {
  var result = [];
  schema2[name].forEach(function(currentType) {
    var newIndex = result.length;
    result.forEach(function(previousType, previousIndex) {
      if (previousType.tag === currentType.tag && previousType.kind === currentType.kind && previousType.multi === currentType.multi) {
        newIndex = previousIndex;
      }
    });
    result[newIndex] = currentType;
  });
  return result;
}
function compileMap() {
  var result = {
    scalar: {},
    sequence: {},
    mapping: {},
    fallback: {},
    multi: {
      scalar: [],
      sequence: [],
      mapping: [],
      fallback: []
    }
  }, index, length;
  function collectType(type2) {
    if (type2.multi) {
      result.multi[type2.kind].push(type2);
      result.multi["fallback"].push(type2);
    } else {
      result[type2.kind][type2.tag] = result["fallback"][type2.tag] = type2;
    }
  }
  for (index = 0, length = arguments.length; index < length; index += 1) {
    arguments[index].forEach(collectType);
  }
  return result;
}
function Schema$1(definition) {
  return this.extend(definition);
}
Schema$1.prototype.extend = function extend2(definition) {
  var implicit = [];
  var explicit = [];
  if (definition instanceof type) {
    explicit.push(definition);
  } else if (Array.isArray(definition)) {
    explicit = explicit.concat(definition);
  } else if (definition && (Array.isArray(definition.implicit) || Array.isArray(definition.explicit))) {
    if (definition.implicit)
      implicit = implicit.concat(definition.implicit);
    if (definition.explicit)
      explicit = explicit.concat(definition.explicit);
  } else {
    throw new exception("Schema.extend argument should be a Type, [ Type ], or a schema definition ({ implicit: [...], explicit: [...] })");
  }
  implicit.forEach(function(type$1) {
    if (!(type$1 instanceof type)) {
      throw new exception("Specified list of YAML types (or a single Type object) contains a non-Type object.");
    }
    if (type$1.loadKind && type$1.loadKind !== "scalar") {
      throw new exception("There is a non-scalar type in the implicit list of a schema. Implicit resolving of such types is not supported.");
    }
    if (type$1.multi) {
      throw new exception("There is a multi type in the implicit list of a schema. Multi tags can only be listed as explicit.");
    }
  });
  explicit.forEach(function(type$1) {
    if (!(type$1 instanceof type)) {
      throw new exception("Specified list of YAML types (or a single Type object) contains a non-Type object.");
    }
  });
  var result = Object.create(Schema$1.prototype);
  result.implicit = (this.implicit || []).concat(implicit);
  result.explicit = (this.explicit || []).concat(explicit);
  result.compiledImplicit = compileList(result, "implicit");
  result.compiledExplicit = compileList(result, "explicit");
  result.compiledTypeMap = compileMap(result.compiledImplicit, result.compiledExplicit);
  return result;
};
var schema = Schema$1;
var str = new type("tag:yaml.org,2002:str", {
  kind: "scalar",
  construct: function(data) {
    return data !== null ? data : "";
  }
});
var seq = new type("tag:yaml.org,2002:seq", {
  kind: "sequence",
  construct: function(data) {
    return data !== null ? data : [];
  }
});
var map = new type("tag:yaml.org,2002:map", {
  kind: "mapping",
  construct: function(data) {
    return data !== null ? data : {};
  }
});
var failsafe = new schema({
  explicit: [
    str,
    seq,
    map
  ]
});
function resolveYamlNull(data) {
  if (data === null)
    return true;
  var max = data.length;
  return max === 1 && data === "~" || max === 4 && (data === "null" || data === "Null" || data === "NULL");
}
function constructYamlNull() {
  return null;
}
function isNull(object) {
  return object === null;
}
var _null = new type("tag:yaml.org,2002:null", {
  kind: "scalar",
  resolve: resolveYamlNull,
  construct: constructYamlNull,
  predicate: isNull,
  represent: {
    canonical: function() {
      return "~";
    },
    lowercase: function() {
      return "null";
    },
    uppercase: function() {
      return "NULL";
    },
    camelcase: function() {
      return "Null";
    },
    empty: function() {
      return "";
    }
  },
  defaultStyle: "lowercase"
});
function resolveYamlBoolean(data) {
  if (data === null)
    return false;
  var max = data.length;
  return max === 4 && (data === "true" || data === "True" || data === "TRUE") || max === 5 && (data === "false" || data === "False" || data === "FALSE");
}
function constructYamlBoolean(data) {
  return data === "true" || data === "True" || data === "TRUE";
}
function isBoolean(object) {
  return Object.prototype.toString.call(object) === "[object Boolean]";
}
var bool = new type("tag:yaml.org,2002:bool", {
  kind: "scalar",
  resolve: resolveYamlBoolean,
  construct: constructYamlBoolean,
  predicate: isBoolean,
  represent: {
    lowercase: function(object) {
      return object ? "true" : "false";
    },
    uppercase: function(object) {
      return object ? "TRUE" : "FALSE";
    },
    camelcase: function(object) {
      return object ? "True" : "False";
    }
  },
  defaultStyle: "lowercase"
});
function isHexCode(c) {
  return 48 <= c && c <= 57 || 65 <= c && c <= 70 || 97 <= c && c <= 102;
}
function isOctCode(c) {
  return 48 <= c && c <= 55;
}
function isDecCode(c) {
  return 48 <= c && c <= 57;
}
function resolveYamlInteger(data) {
  if (data === null)
    return false;
  var max = data.length, index = 0, hasDigits = false, ch;
  if (!max)
    return false;
  ch = data[index];
  if (ch === "-" || ch === "+") {
    ch = data[++index];
  }
  if (ch === "0") {
    if (index + 1 === max)
      return true;
    ch = data[++index];
    if (ch === "b") {
      index++;
      for (; index < max; index++) {
        ch = data[index];
        if (ch === "_")
          continue;
        if (ch !== "0" && ch !== "1")
          return false;
        hasDigits = true;
      }
      return hasDigits && ch !== "_";
    }
    if (ch === "x") {
      index++;
      for (; index < max; index++) {
        ch = data[index];
        if (ch === "_")
          continue;
        if (!isHexCode(data.charCodeAt(index)))
          return false;
        hasDigits = true;
      }
      return hasDigits && ch !== "_";
    }
    if (ch === "o") {
      index++;
      for (; index < max; index++) {
        ch = data[index];
        if (ch === "_")
          continue;
        if (!isOctCode(data.charCodeAt(index)))
          return false;
        hasDigits = true;
      }
      return hasDigits && ch !== "_";
    }
  }
  if (ch === "_")
    return false;
  for (; index < max; index++) {
    ch = data[index];
    if (ch === "_")
      continue;
    if (!isDecCode(data.charCodeAt(index))) {
      return false;
    }
    hasDigits = true;
  }
  if (!hasDigits || ch === "_")
    return false;
  return true;
}
function constructYamlInteger(data) {
  var value = data, sign = 1, ch;
  if (value.indexOf("_") !== -1) {
    value = value.replace(/_/g, "");
  }
  ch = value[0];
  if (ch === "-" || ch === "+") {
    if (ch === "-")
      sign = -1;
    value = value.slice(1);
    ch = value[0];
  }
  if (value === "0")
    return 0;
  if (ch === "0") {
    if (value[1] === "b")
      return sign * parseInt(value.slice(2), 2);
    if (value[1] === "x")
      return sign * parseInt(value.slice(2), 16);
    if (value[1] === "o")
      return sign * parseInt(value.slice(2), 8);
  }
  return sign * parseInt(value, 10);
}
function isInteger(object) {
  return Object.prototype.toString.call(object) === "[object Number]" && (object % 1 === 0 && !common.isNegativeZero(object));
}
var int = new type("tag:yaml.org,2002:int", {
  kind: "scalar",
  resolve: resolveYamlInteger,
  construct: constructYamlInteger,
  predicate: isInteger,
  represent: {
    binary: function(obj) {
      return obj >= 0 ? "0b" + obj.toString(2) : "-0b" + obj.toString(2).slice(1);
    },
    octal: function(obj) {
      return obj >= 0 ? "0o" + obj.toString(8) : "-0o" + obj.toString(8).slice(1);
    },
    decimal: function(obj) {
      return obj.toString(10);
    },
    hexadecimal: function(obj) {
      return obj >= 0 ? "0x" + obj.toString(16).toUpperCase() : "-0x" + obj.toString(16).toUpperCase().slice(1);
    }
  },
  defaultStyle: "decimal",
  styleAliases: {
    binary: [2, "bin"],
    octal: [8, "oct"],
    decimal: [10, "dec"],
    hexadecimal: [16, "hex"]
  }
});
var YAML_FLOAT_PATTERN = new RegExp("^(?:[-+]?(?:[0-9][0-9_]*)(?:\\.[0-9_]*)?(?:[eE][-+]?[0-9]+)?|\\.[0-9_]+(?:[eE][-+]?[0-9]+)?|[-+]?\\.(?:inf|Inf|INF)|\\.(?:nan|NaN|NAN))$");
function resolveYamlFloat(data) {
  if (data === null)
    return false;
  if (!YAML_FLOAT_PATTERN.test(data) || data[data.length - 1] === "_") {
    return false;
  }
  return true;
}
function constructYamlFloat(data) {
  var value, sign;
  value = data.replace(/_/g, "").toLowerCase();
  sign = value[0] === "-" ? -1 : 1;
  if ("+-".indexOf(value[0]) >= 0) {
    value = value.slice(1);
  }
  if (value === ".inf") {
    return sign === 1 ? Number.POSITIVE_INFINITY : Number.NEGATIVE_INFINITY;
  } else if (value === ".nan") {
    return NaN;
  }
  return sign * parseFloat(value, 10);
}
var SCIENTIFIC_WITHOUT_DOT = /^[-+]?[0-9]+e/;
function representYamlFloat(object, style) {
  var res;
  if (isNaN(object)) {
    switch (style) {
      case "lowercase":
        return ".nan";
      case "uppercase":
        return ".NAN";
      case "camelcase":
        return ".NaN";
    }
  } else if (Number.POSITIVE_INFINITY === object) {
    switch (style) {
      case "lowercase":
        return ".inf";
      case "uppercase":
        return ".INF";
      case "camelcase":
        return ".Inf";
    }
  } else if (Number.NEGATIVE_INFINITY === object) {
    switch (style) {
      case "lowercase":
        return "-.inf";
      case "uppercase":
        return "-.INF";
      case "camelcase":
        return "-.Inf";
    }
  } else if (common.isNegativeZero(object)) {
    return "-0.0";
  }
  res = object.toString(10);
  return SCIENTIFIC_WITHOUT_DOT.test(res) ? res.replace("e", ".e") : res;
}
function isFloat(object) {
  return Object.prototype.toString.call(object) === "[object Number]" && (object % 1 !== 0 || common.isNegativeZero(object));
}
var float = new type("tag:yaml.org,2002:float", {
  kind: "scalar",
  resolve: resolveYamlFloat,
  construct: constructYamlFloat,
  predicate: isFloat,
  represent: representYamlFloat,
  defaultStyle: "lowercase"
});
var json = failsafe.extend({
  implicit: [
    _null,
    bool,
    int,
    float
  ]
});
var core9 = json;
var YAML_DATE_REGEXP = new RegExp("^([0-9][0-9][0-9][0-9])-([0-9][0-9])-([0-9][0-9])$");
var YAML_TIMESTAMP_REGEXP = new RegExp("^([0-9][0-9][0-9][0-9])-([0-9][0-9]?)-([0-9][0-9]?)(?:[Tt]|[ \\t]+)([0-9][0-9]?):([0-9][0-9]):([0-9][0-9])(?:\\.([0-9]*))?(?:[ \\t]*(Z|([-+])([0-9][0-9]?)(?::([0-9][0-9]))?))?$");
function resolveYamlTimestamp(data) {
  if (data === null)
    return false;
  if (YAML_DATE_REGEXP.exec(data) !== null)
    return true;
  if (YAML_TIMESTAMP_REGEXP.exec(data) !== null)
    return true;
  return false;
}
function constructYamlTimestamp(data) {
  var match, year, month, day, hour, minute, second, fraction = 0, delta = null, tz_hour, tz_minute, date;
  match = YAML_DATE_REGEXP.exec(data);
  if (match === null)
    match = YAML_TIMESTAMP_REGEXP.exec(data);
  if (match === null)
    throw new Error("Date resolve error");
  year = +match[1];
  month = +match[2] - 1;
  day = +match[3];
  if (!match[4]) {
    return new Date(Date.UTC(year, month, day));
  }
  hour = +match[4];
  minute = +match[5];
  second = +match[6];
  if (match[7]) {
    fraction = match[7].slice(0, 3);
    while (fraction.length < 3) {
      fraction += "0";
    }
    fraction = +fraction;
  }
  if (match[9]) {
    tz_hour = +match[10];
    tz_minute = +(match[11] || 0);
    delta = (tz_hour * 60 + tz_minute) * 6e4;
    if (match[9] === "-")
      delta = -delta;
  }
  date = new Date(Date.UTC(year, month, day, hour, minute, second, fraction));
  if (delta)
    date.setTime(date.getTime() - delta);
  return date;
}
function representYamlTimestamp(object) {
  return object.toISOString();
}
var timestamp = new type("tag:yaml.org,2002:timestamp", {
  kind: "scalar",
  resolve: resolveYamlTimestamp,
  construct: constructYamlTimestamp,
  instanceOf: Date,
  represent: representYamlTimestamp
});
function resolveYamlMerge(data) {
  return data === "<<" || data === null;
}
var merge = new type("tag:yaml.org,2002:merge", {
  kind: "scalar",
  resolve: resolveYamlMerge
});
var BASE64_MAP = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=\n\r";
function resolveYamlBinary(data) {
  if (data === null)
    return false;
  var code, idx, bitlen = 0, max = data.length, map2 = BASE64_MAP;
  for (idx = 0; idx < max; idx++) {
    code = map2.indexOf(data.charAt(idx));
    if (code > 64)
      continue;
    if (code < 0)
      return false;
    bitlen += 6;
  }
  return bitlen % 8 === 0;
}
function constructYamlBinary(data) {
  var idx, tailbits, input = data.replace(/[\r\n=]/g, ""), max = input.length, map2 = BASE64_MAP, bits = 0, result = [];
  for (idx = 0; idx < max; idx++) {
    if (idx % 4 === 0 && idx) {
      result.push(bits >> 16 & 255);
      result.push(bits >> 8 & 255);
      result.push(bits & 255);
    }
    bits = bits << 6 | map2.indexOf(input.charAt(idx));
  }
  tailbits = max % 4 * 6;
  if (tailbits === 0) {
    result.push(bits >> 16 & 255);
    result.push(bits >> 8 & 255);
    result.push(bits & 255);
  } else if (tailbits === 18) {
    result.push(bits >> 10 & 255);
    result.push(bits >> 2 & 255);
  } else if (tailbits === 12) {
    result.push(bits >> 4 & 255);
  }
  return new Uint8Array(result);
}
function representYamlBinary(object) {
  var result = "", bits = 0, idx, tail, max = object.length, map2 = BASE64_MAP;
  for (idx = 0; idx < max; idx++) {
    if (idx % 3 === 0 && idx) {
      result += map2[bits >> 18 & 63];
      result += map2[bits >> 12 & 63];
      result += map2[bits >> 6 & 63];
      result += map2[bits & 63];
    }
    bits = (bits << 8) + object[idx];
  }
  tail = max % 3;
  if (tail === 0) {
    result += map2[bits >> 18 & 63];
    result += map2[bits >> 12 & 63];
    result += map2[bits >> 6 & 63];
    result += map2[bits & 63];
  } else if (tail === 2) {
    result += map2[bits >> 10 & 63];
    result += map2[bits >> 4 & 63];
    result += map2[bits << 2 & 63];
    result += map2[64];
  } else if (tail === 1) {
    result += map2[bits >> 2 & 63];
    result += map2[bits << 4 & 63];
    result += map2[64];
    result += map2[64];
  }
  return result;
}
function isBinary(obj) {
  return Object.prototype.toString.call(obj) === "[object Uint8Array]";
}
var binary = new type("tag:yaml.org,2002:binary", {
  kind: "scalar",
  resolve: resolveYamlBinary,
  construct: constructYamlBinary,
  predicate: isBinary,
  represent: representYamlBinary
});
var _hasOwnProperty$3 = Object.prototype.hasOwnProperty;
var _toString$2 = Object.prototype.toString;
function resolveYamlOmap(data) {
  if (data === null)
    return true;
  var objectKeys = [], index, length, pair, pairKey, pairHasKey, object = data;
  for (index = 0, length = object.length; index < length; index += 1) {
    pair = object[index];
    pairHasKey = false;
    if (_toString$2.call(pair) !== "[object Object]")
      return false;
    for (pairKey in pair) {
      if (_hasOwnProperty$3.call(pair, pairKey)) {
        if (!pairHasKey)
          pairHasKey = true;
        else
          return false;
      }
    }
    if (!pairHasKey)
      return false;
    if (objectKeys.indexOf(pairKey) === -1)
      objectKeys.push(pairKey);
    else
      return false;
  }
  return true;
}
function constructYamlOmap(data) {
  return data !== null ? data : [];
}
var omap = new type("tag:yaml.org,2002:omap", {
  kind: "sequence",
  resolve: resolveYamlOmap,
  construct: constructYamlOmap
});
var _toString$1 = Object.prototype.toString;
function resolveYamlPairs(data) {
  if (data === null)
    return true;
  var index, length, pair, keys, result, object = data;
  result = new Array(object.length);
  for (index = 0, length = object.length; index < length; index += 1) {
    pair = object[index];
    if (_toString$1.call(pair) !== "[object Object]")
      return false;
    keys = Object.keys(pair);
    if (keys.length !== 1)
      return false;
    result[index] = [keys[0], pair[keys[0]]];
  }
  return true;
}
function constructYamlPairs(data) {
  if (data === null)
    return [];
  var index, length, pair, keys, result, object = data;
  result = new Array(object.length);
  for (index = 0, length = object.length; index < length; index += 1) {
    pair = object[index];
    keys = Object.keys(pair);
    result[index] = [keys[0], pair[keys[0]]];
  }
  return result;
}
var pairs = new type("tag:yaml.org,2002:pairs", {
  kind: "sequence",
  resolve: resolveYamlPairs,
  construct: constructYamlPairs
});
var _hasOwnProperty$2 = Object.prototype.hasOwnProperty;
function resolveYamlSet(data) {
  if (data === null)
    return true;
  var key, object = data;
  for (key in object) {
    if (_hasOwnProperty$2.call(object, key)) {
      if (object[key] !== null)
        return false;
    }
  }
  return true;
}
function constructYamlSet(data) {
  return data !== null ? data : {};
}
var set = new type("tag:yaml.org,2002:set", {
  kind: "mapping",
  resolve: resolveYamlSet,
  construct: constructYamlSet
});
var _default = core9.extend({
  implicit: [
    timestamp,
    merge
  ],
  explicit: [
    binary,
    omap,
    pairs,
    set
  ]
});
var _hasOwnProperty$1 = Object.prototype.hasOwnProperty;
var CONTEXT_FLOW_IN = 1;
var CONTEXT_FLOW_OUT = 2;
var CONTEXT_BLOCK_IN = 3;
var CONTEXT_BLOCK_OUT = 4;
var CHOMPING_CLIP = 1;
var CHOMPING_STRIP = 2;
var CHOMPING_KEEP = 3;
var PATTERN_NON_PRINTABLE = /[\x00-\x08\x0B\x0C\x0E-\x1F\x7F-\x84\x86-\x9F\uFFFE\uFFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF]/;
var PATTERN_NON_ASCII_LINE_BREAKS = /[\x85\u2028\u2029]/;
var PATTERN_FLOW_INDICATORS = /[,\[\]\{\}]/;
var PATTERN_TAG_HANDLE = /^(?:!|!!|![a-z\-]+!)$/i;
var PATTERN_TAG_URI = /^(?:!|[^,\[\]\{\}])(?:%[0-9a-f]{2}|[0-9a-z\-#;\/\?:@&=\+\$,_\.!~\*'\(\)\[\]])*$/i;
function _class(obj) {
  return Object.prototype.toString.call(obj);
}
function is_EOL(c) {
  return c === 10 || c === 13;
}
function is_WHITE_SPACE(c) {
  return c === 9 || c === 32;
}
function is_WS_OR_EOL(c) {
  return c === 9 || c === 32 || c === 10 || c === 13;
}
function is_FLOW_INDICATOR(c) {
  return c === 44 || c === 91 || c === 93 || c === 123 || c === 125;
}
function fromHexCode(c) {
  var lc;
  if (48 <= c && c <= 57) {
    return c - 48;
  }
  lc = c | 32;
  if (97 <= lc && lc <= 102) {
    return lc - 97 + 10;
  }
  return -1;
}
function escapedHexLen(c) {
  if (c === 120) {
    return 2;
  }
  if (c === 117) {
    return 4;
  }
  if (c === 85) {
    return 8;
  }
  return 0;
}
function fromDecimalCode(c) {
  if (48 <= c && c <= 57) {
    return c - 48;
  }
  return -1;
}
function simpleEscapeSequence(c) {
  return c === 48 ? "\0" : c === 97 ? "\x07" : c === 98 ? "\b" : c === 116 ? "	" : c === 9 ? "	" : c === 110 ? "\n" : c === 118 ? "\v" : c === 102 ? "\f" : c === 114 ? "\r" : c === 101 ? "" : c === 32 ? " " : c === 34 ? '"' : c === 47 ? "/" : c === 92 ? "\\" : c === 78 ? "\x85" : c === 95 ? "\xA0" : c === 76 ? "\u2028" : c === 80 ? "\u2029" : "";
}
function charFromCodepoint(c) {
  if (c <= 65535) {
    return String.fromCharCode(c);
  }
  return String.fromCharCode((c - 65536 >> 10) + 55296, (c - 65536 & 1023) + 56320);
}
var simpleEscapeCheck = new Array(256);
var simpleEscapeMap = new Array(256);
for (i = 0; i < 256; i++) {
  simpleEscapeCheck[i] = simpleEscapeSequence(i) ? 1 : 0;
  simpleEscapeMap[i] = simpleEscapeSequence(i);
}
var i;
function State$1(input, options) {
  this.input = input;
  this.filename = options["filename"] || null;
  this.schema = options["schema"] || _default;
  this.onWarning = options["onWarning"] || null;
  this.legacy = options["legacy"] || false;
  this.json = options["json"] || false;
  this.listener = options["listener"] || null;
  this.implicitTypes = this.schema.compiledImplicit;
  this.typeMap = this.schema.compiledTypeMap;
  this.length = input.length;
  this.position = 0;
  this.line = 0;
  this.lineStart = 0;
  this.lineIndent = 0;
  this.firstTabInLine = -1;
  this.documents = [];
}
function generateError(state, message) {
  var mark = {
    name: state.filename,
    buffer: state.input.slice(0, -1),
    position: state.position,
    line: state.line,
    column: state.position - state.lineStart
  };
  mark.snippet = snippet(mark);
  return new exception(message, mark);
}
function throwError(state, message) {
  throw generateError(state, message);
}
function throwWarning(state, message) {
  if (state.onWarning) {
    state.onWarning.call(null, generateError(state, message));
  }
}
var directiveHandlers = {
  YAML: function handleYamlDirective(state, name, args) {
    var match, major, minor;
    if (state.version !== null) {
      throwError(state, "duplication of %YAML directive");
    }
    if (args.length !== 1) {
      throwError(state, "YAML directive accepts exactly one argument");
    }
    match = /^([0-9]+)\.([0-9]+)$/.exec(args[0]);
    if (match === null) {
      throwError(state, "ill-formed argument of the YAML directive");
    }
    major = parseInt(match[1], 10);
    minor = parseInt(match[2], 10);
    if (major !== 1) {
      throwError(state, "unacceptable YAML version of the document");
    }
    state.version = args[0];
    state.checkLineBreaks = minor < 2;
    if (minor !== 1 && minor !== 2) {
      throwWarning(state, "unsupported YAML version of the document");
    }
  },
  TAG: function handleTagDirective(state, name, args) {
    var handle, prefix;
    if (args.length !== 2) {
      throwError(state, "TAG directive accepts exactly two arguments");
    }
    handle = args[0];
    prefix = args[1];
    if (!PATTERN_TAG_HANDLE.test(handle)) {
      throwError(state, "ill-formed tag handle (first argument) of the TAG directive");
    }
    if (_hasOwnProperty$1.call(state.tagMap, handle)) {
      throwError(state, 'there is a previously declared suffix for "' + handle + '" tag handle');
    }
    if (!PATTERN_TAG_URI.test(prefix)) {
      throwError(state, "ill-formed tag prefix (second argument) of the TAG directive");
    }
    try {
      prefix = decodeURIComponent(prefix);
    } catch (err) {
      throwError(state, "tag prefix is malformed: " + prefix);
    }
    state.tagMap[handle] = prefix;
  }
};
function captureSegment(state, start, end, checkJson) {
  var _position, _length, _character, _result;
  if (start < end) {
    _result = state.input.slice(start, end);
    if (checkJson) {
      for (_position = 0, _length = _result.length; _position < _length; _position += 1) {
        _character = _result.charCodeAt(_position);
        if (!(_character === 9 || 32 <= _character && _character <= 1114111)) {
          throwError(state, "expected valid JSON character");
        }
      }
    } else if (PATTERN_NON_PRINTABLE.test(_result)) {
      throwError(state, "the stream contains non-printable characters");
    }
    state.result += _result;
  }
}
function mergeMappings(state, destination, source, overridableKeys) {
  var sourceKeys, key, index, quantity;
  if (!common.isObject(source)) {
    throwError(state, "cannot merge mappings; the provided source object is unacceptable");
  }
  sourceKeys = Object.keys(source);
  for (index = 0, quantity = sourceKeys.length; index < quantity; index += 1) {
    key = sourceKeys[index];
    if (!_hasOwnProperty$1.call(destination, key)) {
      destination[key] = source[key];
      overridableKeys[key] = true;
    }
  }
}
function storeMappingPair(state, _result, overridableKeys, keyTag, keyNode, valueNode, startLine, startLineStart, startPos) {
  var index, quantity;
  if (Array.isArray(keyNode)) {
    keyNode = Array.prototype.slice.call(keyNode);
    for (index = 0, quantity = keyNode.length; index < quantity; index += 1) {
      if (Array.isArray(keyNode[index])) {
        throwError(state, "nested arrays are not supported inside keys");
      }
      if (typeof keyNode === "object" && _class(keyNode[index]) === "[object Object]") {
        keyNode[index] = "[object Object]";
      }
    }
  }
  if (typeof keyNode === "object" && _class(keyNode) === "[object Object]") {
    keyNode = "[object Object]";
  }
  keyNode = String(keyNode);
  if (_result === null) {
    _result = {};
  }
  if (keyTag === "tag:yaml.org,2002:merge") {
    if (Array.isArray(valueNode)) {
      for (index = 0, quantity = valueNode.length; index < quantity; index += 1) {
        mergeMappings(state, _result, valueNode[index], overridableKeys);
      }
    } else {
      mergeMappings(state, _result, valueNode, overridableKeys);
    }
  } else {
    if (!state.json && !_hasOwnProperty$1.call(overridableKeys, keyNode) && _hasOwnProperty$1.call(_result, keyNode)) {
      state.line = startLine || state.line;
      state.lineStart = startLineStart || state.lineStart;
      state.position = startPos || state.position;
      throwError(state, "duplicated mapping key");
    }
    if (keyNode === "__proto__") {
      Object.defineProperty(_result, keyNode, {
        configurable: true,
        enumerable: true,
        writable: true,
        value: valueNode
      });
    } else {
      _result[keyNode] = valueNode;
    }
    delete overridableKeys[keyNode];
  }
  return _result;
}
function readLineBreak(state) {
  var ch;
  ch = state.input.charCodeAt(state.position);
  if (ch === 10) {
    state.position++;
  } else if (ch === 13) {
    state.position++;
    if (state.input.charCodeAt(state.position) === 10) {
      state.position++;
    }
  } else {
    throwError(state, "a line break is expected");
  }
  state.line += 1;
  state.lineStart = state.position;
  state.firstTabInLine = -1;
}
function skipSeparationSpace(state, allowComments, checkIndent) {
  var lineBreaks = 0, ch = state.input.charCodeAt(state.position);
  while (ch !== 0) {
    while (is_WHITE_SPACE(ch)) {
      if (ch === 9 && state.firstTabInLine === -1) {
        state.firstTabInLine = state.position;
      }
      ch = state.input.charCodeAt(++state.position);
    }
    if (allowComments && ch === 35) {
      do {
        ch = state.input.charCodeAt(++state.position);
      } while (ch !== 10 && ch !== 13 && ch !== 0);
    }
    if (is_EOL(ch)) {
      readLineBreak(state);
      ch = state.input.charCodeAt(state.position);
      lineBreaks++;
      state.lineIndent = 0;
      while (ch === 32) {
        state.lineIndent++;
        ch = state.input.charCodeAt(++state.position);
      }
    } else {
      break;
    }
  }
  if (checkIndent !== -1 && lineBreaks !== 0 && state.lineIndent < checkIndent) {
    throwWarning(state, "deficient indentation");
  }
  return lineBreaks;
}
function testDocumentSeparator(state) {
  var _position = state.position, ch;
  ch = state.input.charCodeAt(_position);
  if ((ch === 45 || ch === 46) && ch === state.input.charCodeAt(_position + 1) && ch === state.input.charCodeAt(_position + 2)) {
    _position += 3;
    ch = state.input.charCodeAt(_position);
    if (ch === 0 || is_WS_OR_EOL(ch)) {
      return true;
    }
  }
  return false;
}
function writeFoldedLines(state, count) {
  if (count === 1) {
    state.result += " ";
  } else if (count > 1) {
    state.result += common.repeat("\n", count - 1);
  }
}
function readPlainScalar(state, nodeIndent, withinFlowCollection) {
  var preceding, following, captureStart, captureEnd, hasPendingContent, _line, _lineStart, _lineIndent, _kind = state.kind, _result = state.result, ch;
  ch = state.input.charCodeAt(state.position);
  if (is_WS_OR_EOL(ch) || is_FLOW_INDICATOR(ch) || ch === 35 || ch === 38 || ch === 42 || ch === 33 || ch === 124 || ch === 62 || ch === 39 || ch === 34 || ch === 37 || ch === 64 || ch === 96) {
    return false;
  }
  if (ch === 63 || ch === 45) {
    following = state.input.charCodeAt(state.position + 1);
    if (is_WS_OR_EOL(following) || withinFlowCollection && is_FLOW_INDICATOR(following)) {
      return false;
    }
  }
  state.kind = "scalar";
  state.result = "";
  captureStart = captureEnd = state.position;
  hasPendingContent = false;
  while (ch !== 0) {
    if (ch === 58) {
      following = state.input.charCodeAt(state.position + 1);
      if (is_WS_OR_EOL(following) || withinFlowCollection && is_FLOW_INDICATOR(following)) {
        break;
      }
    } else if (ch === 35) {
      preceding = state.input.charCodeAt(state.position - 1);
      if (is_WS_OR_EOL(preceding)) {
        break;
      }
    } else if (state.position === state.lineStart && testDocumentSeparator(state) || withinFlowCollection && is_FLOW_INDICATOR(ch)) {
      break;
    } else if (is_EOL(ch)) {
      _line = state.line;
      _lineStart = state.lineStart;
      _lineIndent = state.lineIndent;
      skipSeparationSpace(state, false, -1);
      if (state.lineIndent >= nodeIndent) {
        hasPendingContent = true;
        ch = state.input.charCodeAt(state.position);
        continue;
      } else {
        state.position = captureEnd;
        state.line = _line;
        state.lineStart = _lineStart;
        state.lineIndent = _lineIndent;
        break;
      }
    }
    if (hasPendingContent) {
      captureSegment(state, captureStart, captureEnd, false);
      writeFoldedLines(state, state.line - _line);
      captureStart = captureEnd = state.position;
      hasPendingContent = false;
    }
    if (!is_WHITE_SPACE(ch)) {
      captureEnd = state.position + 1;
    }
    ch = state.input.charCodeAt(++state.position);
  }
  captureSegment(state, captureStart, captureEnd, false);
  if (state.result) {
    return true;
  }
  state.kind = _kind;
  state.result = _result;
  return false;
}
function readSingleQuotedScalar(state, nodeIndent) {
  var ch, captureStart, captureEnd;
  ch = state.input.charCodeAt(state.position);
  if (ch !== 39) {
    return false;
  }
  state.kind = "scalar";
  state.result = "";
  state.position++;
  captureStart = captureEnd = state.position;
  while ((ch = state.input.charCodeAt(state.position)) !== 0) {
    if (ch === 39) {
      captureSegment(state, captureStart, state.position, true);
      ch = state.input.charCodeAt(++state.position);
      if (ch === 39) {
        captureStart = state.position;
        state.position++;
        captureEnd = state.position;
      } else {
        return true;
      }
    } else if (is_EOL(ch)) {
      captureSegment(state, captureStart, captureEnd, true);
      writeFoldedLines(state, skipSeparationSpace(state, false, nodeIndent));
      captureStart = captureEnd = state.position;
    } else if (state.position === state.lineStart && testDocumentSeparator(state)) {
      throwError(state, "unexpected end of the document within a single quoted scalar");
    } else {
      state.position++;
      captureEnd = state.position;
    }
  }
  throwError(state, "unexpected end of the stream within a single quoted scalar");
}
function readDoubleQuotedScalar(state, nodeIndent) {
  var captureStart, captureEnd, hexLength, hexResult, tmp, ch;
  ch = state.input.charCodeAt(state.position);
  if (ch !== 34) {
    return false;
  }
  state.kind = "scalar";
  state.result = "";
  state.position++;
  captureStart = captureEnd = state.position;
  while ((ch = state.input.charCodeAt(state.position)) !== 0) {
    if (ch === 34) {
      captureSegment(state, captureStart, state.position, true);
      state.position++;
      return true;
    } else if (ch === 92) {
      captureSegment(state, captureStart, state.position, true);
      ch = state.input.charCodeAt(++state.position);
      if (is_EOL(ch)) {
        skipSeparationSpace(state, false, nodeIndent);
      } else if (ch < 256 && simpleEscapeCheck[ch]) {
        state.result += simpleEscapeMap[ch];
        state.position++;
      } else if ((tmp = escapedHexLen(ch)) > 0) {
        hexLength = tmp;
        hexResult = 0;
        for (; hexLength > 0; hexLength--) {
          ch = state.input.charCodeAt(++state.position);
          if ((tmp = fromHexCode(ch)) >= 0) {
            hexResult = (hexResult << 4) + tmp;
          } else {
            throwError(state, "expected hexadecimal character");
          }
        }
        state.result += charFromCodepoint(hexResult);
        state.position++;
      } else {
        throwError(state, "unknown escape sequence");
      }
      captureStart = captureEnd = state.position;
    } else if (is_EOL(ch)) {
      captureSegment(state, captureStart, captureEnd, true);
      writeFoldedLines(state, skipSeparationSpace(state, false, nodeIndent));
      captureStart = captureEnd = state.position;
    } else if (state.position === state.lineStart && testDocumentSeparator(state)) {
      throwError(state, "unexpected end of the document within a double quoted scalar");
    } else {
      state.position++;
      captureEnd = state.position;
    }
  }
  throwError(state, "unexpected end of the stream within a double quoted scalar");
}
function readFlowCollection(state, nodeIndent) {
  var readNext = true, _line, _lineStart, _pos, _tag = state.tag, _result, _anchor = state.anchor, following, terminator, isPair, isExplicitPair, isMapping, overridableKeys = Object.create(null), keyNode, keyTag, valueNode, ch;
  ch = state.input.charCodeAt(state.position);
  if (ch === 91) {
    terminator = 93;
    isMapping = false;
    _result = [];
  } else if (ch === 123) {
    terminator = 125;
    isMapping = true;
    _result = {};
  } else {
    return false;
  }
  if (state.anchor !== null) {
    state.anchorMap[state.anchor] = _result;
  }
  ch = state.input.charCodeAt(++state.position);
  while (ch !== 0) {
    skipSeparationSpace(state, true, nodeIndent);
    ch = state.input.charCodeAt(state.position);
    if (ch === terminator) {
      state.position++;
      state.tag = _tag;
      state.anchor = _anchor;
      state.kind = isMapping ? "mapping" : "sequence";
      state.result = _result;
      return true;
    } else if (!readNext) {
      throwError(state, "missed comma between flow collection entries");
    } else if (ch === 44) {
      throwError(state, "expected the node content, but found ','");
    }
    keyTag = keyNode = valueNode = null;
    isPair = isExplicitPair = false;
    if (ch === 63) {
      following = state.input.charCodeAt(state.position + 1);
      if (is_WS_OR_EOL(following)) {
        isPair = isExplicitPair = true;
        state.position++;
        skipSeparationSpace(state, true, nodeIndent);
      }
    }
    _line = state.line;
    _lineStart = state.lineStart;
    _pos = state.position;
    composeNode(state, nodeIndent, CONTEXT_FLOW_IN, false, true);
    keyTag = state.tag;
    keyNode = state.result;
    skipSeparationSpace(state, true, nodeIndent);
    ch = state.input.charCodeAt(state.position);
    if ((isExplicitPair || state.line === _line) && ch === 58) {
      isPair = true;
      ch = state.input.charCodeAt(++state.position);
      skipSeparationSpace(state, true, nodeIndent);
      composeNode(state, nodeIndent, CONTEXT_FLOW_IN, false, true);
      valueNode = state.result;
    }
    if (isMapping) {
      storeMappingPair(state, _result, overridableKeys, keyTag, keyNode, valueNode, _line, _lineStart, _pos);
    } else if (isPair) {
      _result.push(storeMappingPair(state, null, overridableKeys, keyTag, keyNode, valueNode, _line, _lineStart, _pos));
    } else {
      _result.push(keyNode);
    }
    skipSeparationSpace(state, true, nodeIndent);
    ch = state.input.charCodeAt(state.position);
    if (ch === 44) {
      readNext = true;
      ch = state.input.charCodeAt(++state.position);
    } else {
      readNext = false;
    }
  }
  throwError(state, "unexpected end of the stream within a flow collection");
}
function readBlockScalar(state, nodeIndent) {
  var captureStart, folding, chomping = CHOMPING_CLIP, didReadContent = false, detectedIndent = false, textIndent = nodeIndent, emptyLines = 0, atMoreIndented = false, tmp, ch;
  ch = state.input.charCodeAt(state.position);
  if (ch === 124) {
    folding = false;
  } else if (ch === 62) {
    folding = true;
  } else {
    return false;
  }
  state.kind = "scalar";
  state.result = "";
  while (ch !== 0) {
    ch = state.input.charCodeAt(++state.position);
    if (ch === 43 || ch === 45) {
      if (CHOMPING_CLIP === chomping) {
        chomping = ch === 43 ? CHOMPING_KEEP : CHOMPING_STRIP;
      } else {
        throwError(state, "repeat of a chomping mode identifier");
      }
    } else if ((tmp = fromDecimalCode(ch)) >= 0) {
      if (tmp === 0) {
        throwError(state, "bad explicit indentation width of a block scalar; it cannot be less than one");
      } else if (!detectedIndent) {
        textIndent = nodeIndent + tmp - 1;
        detectedIndent = true;
      } else {
        throwError(state, "repeat of an indentation width identifier");
      }
    } else {
      break;
    }
  }
  if (is_WHITE_SPACE(ch)) {
    do {
      ch = state.input.charCodeAt(++state.position);
    } while (is_WHITE_SPACE(ch));
    if (ch === 35) {
      do {
        ch = state.input.charCodeAt(++state.position);
      } while (!is_EOL(ch) && ch !== 0);
    }
  }
  while (ch !== 0) {
    readLineBreak(state);
    state.lineIndent = 0;
    ch = state.input.charCodeAt(state.position);
    while ((!detectedIndent || state.lineIndent < textIndent) && ch === 32) {
      state.lineIndent++;
      ch = state.input.charCodeAt(++state.position);
    }
    if (!detectedIndent && state.lineIndent > textIndent) {
      textIndent = state.lineIndent;
    }
    if (is_EOL(ch)) {
      emptyLines++;
      continue;
    }
    if (state.lineIndent < textIndent) {
      if (chomping === CHOMPING_KEEP) {
        state.result += common.repeat("\n", didReadContent ? 1 + emptyLines : emptyLines);
      } else if (chomping === CHOMPING_CLIP) {
        if (didReadContent) {
          state.result += "\n";
        }
      }
      break;
    }
    if (folding) {
      if (is_WHITE_SPACE(ch)) {
        atMoreIndented = true;
        state.result += common.repeat("\n", didReadContent ? 1 + emptyLines : emptyLines);
      } else if (atMoreIndented) {
        atMoreIndented = false;
        state.result += common.repeat("\n", emptyLines + 1);
      } else if (emptyLines === 0) {
        if (didReadContent) {
          state.result += " ";
        }
      } else {
        state.result += common.repeat("\n", emptyLines);
      }
    } else {
      state.result += common.repeat("\n", didReadContent ? 1 + emptyLines : emptyLines);
    }
    didReadContent = true;
    detectedIndent = true;
    emptyLines = 0;
    captureStart = state.position;
    while (!is_EOL(ch) && ch !== 0) {
      ch = state.input.charCodeAt(++state.position);
    }
    captureSegment(state, captureStart, state.position, false);
  }
  return true;
}
function readBlockSequence(state, nodeIndent) {
  var _line, _tag = state.tag, _anchor = state.anchor, _result = [], following, detected = false, ch;
  if (state.firstTabInLine !== -1)
    return false;
  if (state.anchor !== null) {
    state.anchorMap[state.anchor] = _result;
  }
  ch = state.input.charCodeAt(state.position);
  while (ch !== 0) {
    if (state.firstTabInLine !== -1) {
      state.position = state.firstTabInLine;
      throwError(state, "tab characters must not be used in indentation");
    }
    if (ch !== 45) {
      break;
    }
    following = state.input.charCodeAt(state.position + 1);
    if (!is_WS_OR_EOL(following)) {
      break;
    }
    detected = true;
    state.position++;
    if (skipSeparationSpace(state, true, -1)) {
      if (state.lineIndent <= nodeIndent) {
        _result.push(null);
        ch = state.input.charCodeAt(state.position);
        continue;
      }
    }
    _line = state.line;
    composeNode(state, nodeIndent, CONTEXT_BLOCK_IN, false, true);
    _result.push(state.result);
    skipSeparationSpace(state, true, -1);
    ch = state.input.charCodeAt(state.position);
    if ((state.line === _line || state.lineIndent > nodeIndent) && ch !== 0) {
      throwError(state, "bad indentation of a sequence entry");
    } else if (state.lineIndent < nodeIndent) {
      break;
    }
  }
  if (detected) {
    state.tag = _tag;
    state.anchor = _anchor;
    state.kind = "sequence";
    state.result = _result;
    return true;
  }
  return false;
}
function readBlockMapping(state, nodeIndent, flowIndent) {
  var following, allowCompact, _line, _keyLine, _keyLineStart, _keyPos, _tag = state.tag, _anchor = state.anchor, _result = {}, overridableKeys = Object.create(null), keyTag = null, keyNode = null, valueNode = null, atExplicitKey = false, detected = false, ch;
  if (state.firstTabInLine !== -1)
    return false;
  if (state.anchor !== null) {
    state.anchorMap[state.anchor] = _result;
  }
  ch = state.input.charCodeAt(state.position);
  while (ch !== 0) {
    if (!atExplicitKey && state.firstTabInLine !== -1) {
      state.position = state.firstTabInLine;
      throwError(state, "tab characters must not be used in indentation");
    }
    following = state.input.charCodeAt(state.position + 1);
    _line = state.line;
    if ((ch === 63 || ch === 58) && is_WS_OR_EOL(following)) {
      if (ch === 63) {
        if (atExplicitKey) {
          storeMappingPair(state, _result, overridableKeys, keyTag, keyNode, null, _keyLine, _keyLineStart, _keyPos);
          keyTag = keyNode = valueNode = null;
        }
        detected = true;
        atExplicitKey = true;
        allowCompact = true;
      } else if (atExplicitKey) {
        atExplicitKey = false;
        allowCompact = true;
      } else {
        throwError(state, "incomplete explicit mapping pair; a key node is missed; or followed by a non-tabulated empty line");
      }
      state.position += 1;
      ch = following;
    } else {
      _keyLine = state.line;
      _keyLineStart = state.lineStart;
      _keyPos = state.position;
      if (!composeNode(state, flowIndent, CONTEXT_FLOW_OUT, false, true)) {
        break;
      }
      if (state.line === _line) {
        ch = state.input.charCodeAt(state.position);
        while (is_WHITE_SPACE(ch)) {
          ch = state.input.charCodeAt(++state.position);
        }
        if (ch === 58) {
          ch = state.input.charCodeAt(++state.position);
          if (!is_WS_OR_EOL(ch)) {
            throwError(state, "a whitespace character is expected after the key-value separator within a block mapping");
          }
          if (atExplicitKey) {
            storeMappingPair(state, _result, overridableKeys, keyTag, keyNode, null, _keyLine, _keyLineStart, _keyPos);
            keyTag = keyNode = valueNode = null;
          }
          detected = true;
          atExplicitKey = false;
          allowCompact = false;
          keyTag = state.tag;
          keyNode = state.result;
        } else if (detected) {
          throwError(state, "can not read an implicit mapping pair; a colon is missed");
        } else {
          state.tag = _tag;
          state.anchor = _anchor;
          return true;
        }
      } else if (detected) {
        throwError(state, "can not read a block mapping entry; a multiline key may not be an implicit key");
      } else {
        state.tag = _tag;
        state.anchor = _anchor;
        return true;
      }
    }
    if (state.line === _line || state.lineIndent > nodeIndent) {
      if (atExplicitKey) {
        _keyLine = state.line;
        _keyLineStart = state.lineStart;
        _keyPos = state.position;
      }
      if (composeNode(state, nodeIndent, CONTEXT_BLOCK_OUT, true, allowCompact)) {
        if (atExplicitKey) {
          keyNode = state.result;
        } else {
          valueNode = state.result;
        }
      }
      if (!atExplicitKey) {
        storeMappingPair(state, _result, overridableKeys, keyTag, keyNode, valueNode, _keyLine, _keyLineStart, _keyPos);
        keyTag = keyNode = valueNode = null;
      }
      skipSeparationSpace(state, true, -1);
      ch = state.input.charCodeAt(state.position);
    }
    if ((state.line === _line || state.lineIndent > nodeIndent) && ch !== 0) {
      throwError(state, "bad indentation of a mapping entry");
    } else if (state.lineIndent < nodeIndent) {
      break;
    }
  }
  if (atExplicitKey) {
    storeMappingPair(state, _result, overridableKeys, keyTag, keyNode, null, _keyLine, _keyLineStart, _keyPos);
  }
  if (detected) {
    state.tag = _tag;
    state.anchor = _anchor;
    state.kind = "mapping";
    state.result = _result;
  }
  return detected;
}
function readTagProperty(state) {
  var _position, isVerbatim = false, isNamed = false, tagHandle, tagName, ch;
  ch = state.input.charCodeAt(state.position);
  if (ch !== 33)
    return false;
  if (state.tag !== null) {
    throwError(state, "duplication of a tag property");
  }
  ch = state.input.charCodeAt(++state.position);
  if (ch === 60) {
    isVerbatim = true;
    ch = state.input.charCodeAt(++state.position);
  } else if (ch === 33) {
    isNamed = true;
    tagHandle = "!!";
    ch = state.input.charCodeAt(++state.position);
  } else {
    tagHandle = "!";
  }
  _position = state.position;
  if (isVerbatim) {
    do {
      ch = state.input.charCodeAt(++state.position);
    } while (ch !== 0 && ch !== 62);
    if (state.position < state.length) {
      tagName = state.input.slice(_position, state.position);
      ch = state.input.charCodeAt(++state.position);
    } else {
      throwError(state, "unexpected end of the stream within a verbatim tag");
    }
  } else {
    while (ch !== 0 && !is_WS_OR_EOL(ch)) {
      if (ch === 33) {
        if (!isNamed) {
          tagHandle = state.input.slice(_position - 1, state.position + 1);
          if (!PATTERN_TAG_HANDLE.test(tagHandle)) {
            throwError(state, "named tag handle cannot contain such characters");
          }
          isNamed = true;
          _position = state.position + 1;
        } else {
          throwError(state, "tag suffix cannot contain exclamation marks");
        }
      }
      ch = state.input.charCodeAt(++state.position);
    }
    tagName = state.input.slice(_position, state.position);
    if (PATTERN_FLOW_INDICATORS.test(tagName)) {
      throwError(state, "tag suffix cannot contain flow indicator characters");
    }
  }
  if (tagName && !PATTERN_TAG_URI.test(tagName)) {
    throwError(state, "tag name cannot contain such characters: " + tagName);
  }
  try {
    tagName = decodeURIComponent(tagName);
  } catch (err) {
    throwError(state, "tag name is malformed: " + tagName);
  }
  if (isVerbatim) {
    state.tag = tagName;
  } else if (_hasOwnProperty$1.call(state.tagMap, tagHandle)) {
    state.tag = state.tagMap[tagHandle] + tagName;
  } else if (tagHandle === "!") {
    state.tag = "!" + tagName;
  } else if (tagHandle === "!!") {
    state.tag = "tag:yaml.org,2002:" + tagName;
  } else {
    throwError(state, 'undeclared tag handle "' + tagHandle + '"');
  }
  return true;
}
function readAnchorProperty(state) {
  var _position, ch;
  ch = state.input.charCodeAt(state.position);
  if (ch !== 38)
    return false;
  if (state.anchor !== null) {
    throwError(state, "duplication of an anchor property");
  }
  ch = state.input.charCodeAt(++state.position);
  _position = state.position;
  while (ch !== 0 && !is_WS_OR_EOL(ch) && !is_FLOW_INDICATOR(ch)) {
    ch = state.input.charCodeAt(++state.position);
  }
  if (state.position === _position) {
    throwError(state, "name of an anchor node must contain at least one character");
  }
  state.anchor = state.input.slice(_position, state.position);
  return true;
}
function readAlias(state) {
  var _position, alias, ch;
  ch = state.input.charCodeAt(state.position);
  if (ch !== 42)
    return false;
  ch = state.input.charCodeAt(++state.position);
  _position = state.position;
  while (ch !== 0 && !is_WS_OR_EOL(ch) && !is_FLOW_INDICATOR(ch)) {
    ch = state.input.charCodeAt(++state.position);
  }
  if (state.position === _position) {
    throwError(state, "name of an alias node must contain at least one character");
  }
  alias = state.input.slice(_position, state.position);
  if (!_hasOwnProperty$1.call(state.anchorMap, alias)) {
    throwError(state, 'unidentified alias "' + alias + '"');
  }
  state.result = state.anchorMap[alias];
  skipSeparationSpace(state, true, -1);
  return true;
}
function composeNode(state, parentIndent, nodeContext, allowToSeek, allowCompact) {
  var allowBlockStyles, allowBlockScalars, allowBlockCollections, indentStatus = 1, atNewLine = false, hasContent = false, typeIndex, typeQuantity, typeList, type2, flowIndent, blockIndent;
  if (state.listener !== null) {
    state.listener("open", state);
  }
  state.tag = null;
  state.anchor = null;
  state.kind = null;
  state.result = null;
  allowBlockStyles = allowBlockScalars = allowBlockCollections = CONTEXT_BLOCK_OUT === nodeContext || CONTEXT_BLOCK_IN === nodeContext;
  if (allowToSeek) {
    if (skipSeparationSpace(state, true, -1)) {
      atNewLine = true;
      if (state.lineIndent > parentIndent) {
        indentStatus = 1;
      } else if (state.lineIndent === parentIndent) {
        indentStatus = 0;
      } else if (state.lineIndent < parentIndent) {
        indentStatus = -1;
      }
    }
  }
  if (indentStatus === 1) {
    while (readTagProperty(state) || readAnchorProperty(state)) {
      if (skipSeparationSpace(state, true, -1)) {
        atNewLine = true;
        allowBlockCollections = allowBlockStyles;
        if (state.lineIndent > parentIndent) {
          indentStatus = 1;
        } else if (state.lineIndent === parentIndent) {
          indentStatus = 0;
        } else if (state.lineIndent < parentIndent) {
          indentStatus = -1;
        }
      } else {
        allowBlockCollections = false;
      }
    }
  }
  if (allowBlockCollections) {
    allowBlockCollections = atNewLine || allowCompact;
  }
  if (indentStatus === 1 || CONTEXT_BLOCK_OUT === nodeContext) {
    if (CONTEXT_FLOW_IN === nodeContext || CONTEXT_FLOW_OUT === nodeContext) {
      flowIndent = parentIndent;
    } else {
      flowIndent = parentIndent + 1;
    }
    blockIndent = state.position - state.lineStart;
    if (indentStatus === 1) {
      if (allowBlockCollections && (readBlockSequence(state, blockIndent) || readBlockMapping(state, blockIndent, flowIndent)) || readFlowCollection(state, flowIndent)) {
        hasContent = true;
      } else {
        if (allowBlockScalars && readBlockScalar(state, flowIndent) || readSingleQuotedScalar(state, flowIndent) || readDoubleQuotedScalar(state, flowIndent)) {
          hasContent = true;
        } else if (readAlias(state)) {
          hasContent = true;
          if (state.tag !== null || state.anchor !== null) {
            throwError(state, "alias node should not have any properties");
          }
        } else if (readPlainScalar(state, flowIndent, CONTEXT_FLOW_IN === nodeContext)) {
          hasContent = true;
          if (state.tag === null) {
            state.tag = "?";
          }
        }
        if (state.anchor !== null) {
          state.anchorMap[state.anchor] = state.result;
        }
      }
    } else if (indentStatus === 0) {
      hasContent = allowBlockCollections && readBlockSequence(state, blockIndent);
    }
  }
  if (state.tag === null) {
    if (state.anchor !== null) {
      state.anchorMap[state.anchor] = state.result;
    }
  } else if (state.tag === "?") {
    if (state.result !== null && state.kind !== "scalar") {
      throwError(state, 'unacceptable node kind for !<?> tag; it should be "scalar", not "' + state.kind + '"');
    }
    for (typeIndex = 0, typeQuantity = state.implicitTypes.length; typeIndex < typeQuantity; typeIndex += 1) {
      type2 = state.implicitTypes[typeIndex];
      if (type2.resolve(state.result)) {
        state.result = type2.construct(state.result);
        state.tag = type2.tag;
        if (state.anchor !== null) {
          state.anchorMap[state.anchor] = state.result;
        }
        break;
      }
    }
  } else if (state.tag !== "!") {
    if (_hasOwnProperty$1.call(state.typeMap[state.kind || "fallback"], state.tag)) {
      type2 = state.typeMap[state.kind || "fallback"][state.tag];
    } else {
      type2 = null;
      typeList = state.typeMap.multi[state.kind || "fallback"];
      for (typeIndex = 0, typeQuantity = typeList.length; typeIndex < typeQuantity; typeIndex += 1) {
        if (state.tag.slice(0, typeList[typeIndex].tag.length) === typeList[typeIndex].tag) {
          type2 = typeList[typeIndex];
          break;
        }
      }
    }
    if (!type2) {
      throwError(state, "unknown tag !<" + state.tag + ">");
    }
    if (state.result !== null && type2.kind !== state.kind) {
      throwError(state, "unacceptable node kind for !<" + state.tag + '> tag; it should be "' + type2.kind + '", not "' + state.kind + '"');
    }
    if (!type2.resolve(state.result, state.tag)) {
      throwError(state, "cannot resolve a node with !<" + state.tag + "> explicit tag");
    } else {
      state.result = type2.construct(state.result, state.tag);
      if (state.anchor !== null) {
        state.anchorMap[state.anchor] = state.result;
      }
    }
  }
  if (state.listener !== null) {
    state.listener("close", state);
  }
  return state.tag !== null || state.anchor !== null || hasContent;
}
function readDocument(state) {
  var documentStart = state.position, _position, directiveName, directiveArgs, hasDirectives = false, ch;
  state.version = null;
  state.checkLineBreaks = state.legacy;
  state.tagMap = Object.create(null);
  state.anchorMap = Object.create(null);
  while ((ch = state.input.charCodeAt(state.position)) !== 0) {
    skipSeparationSpace(state, true, -1);
    ch = state.input.charCodeAt(state.position);
    if (state.lineIndent > 0 || ch !== 37) {
      break;
    }
    hasDirectives = true;
    ch = state.input.charCodeAt(++state.position);
    _position = state.position;
    while (ch !== 0 && !is_WS_OR_EOL(ch)) {
      ch = state.input.charCodeAt(++state.position);
    }
    directiveName = state.input.slice(_position, state.position);
    directiveArgs = [];
    if (directiveName.length < 1) {
      throwError(state, "directive name must not be less than one character in length");
    }
    while (ch !== 0) {
      while (is_WHITE_SPACE(ch)) {
        ch = state.input.charCodeAt(++state.position);
      }
      if (ch === 35) {
        do {
          ch = state.input.charCodeAt(++state.position);
        } while (ch !== 0 && !is_EOL(ch));
        break;
      }
      if (is_EOL(ch))
        break;
      _position = state.position;
      while (ch !== 0 && !is_WS_OR_EOL(ch)) {
        ch = state.input.charCodeAt(++state.position);
      }
      directiveArgs.push(state.input.slice(_position, state.position));
    }
    if (ch !== 0)
      readLineBreak(state);
    if (_hasOwnProperty$1.call(directiveHandlers, directiveName)) {
      directiveHandlers[directiveName](state, directiveName, directiveArgs);
    } else {
      throwWarning(state, 'unknown document directive "' + directiveName + '"');
    }
  }
  skipSeparationSpace(state, true, -1);
  if (state.lineIndent === 0 && state.input.charCodeAt(state.position) === 45 && state.input.charCodeAt(state.position + 1) === 45 && state.input.charCodeAt(state.position + 2) === 45) {
    state.position += 3;
    skipSeparationSpace(state, true, -1);
  } else if (hasDirectives) {
    throwError(state, "directives end mark is expected");
  }
  composeNode(state, state.lineIndent - 1, CONTEXT_BLOCK_OUT, false, true);
  skipSeparationSpace(state, true, -1);
  if (state.checkLineBreaks && PATTERN_NON_ASCII_LINE_BREAKS.test(state.input.slice(documentStart, state.position))) {
    throwWarning(state, "non-ASCII line breaks are interpreted as content");
  }
  state.documents.push(state.result);
  if (state.position === state.lineStart && testDocumentSeparator(state)) {
    if (state.input.charCodeAt(state.position) === 46) {
      state.position += 3;
      skipSeparationSpace(state, true, -1);
    }
    return;
  }
  if (state.position < state.length - 1) {
    throwError(state, "end of the stream or a document separator is expected");
  } else {
    return;
  }
}
function loadDocuments(input, options) {
  input = String(input);
  options = options || {};
  if (input.length !== 0) {
    if (input.charCodeAt(input.length - 1) !== 10 && input.charCodeAt(input.length - 1) !== 13) {
      input += "\n";
    }
    if (input.charCodeAt(0) === 65279) {
      input = input.slice(1);
    }
  }
  var state = new State$1(input, options);
  var nullpos = input.indexOf("\0");
  if (nullpos !== -1) {
    state.position = nullpos;
    throwError(state, "null byte is not allowed in input");
  }
  state.input += "\0";
  while (state.input.charCodeAt(state.position) === 32) {
    state.lineIndent += 1;
    state.position += 1;
  }
  while (state.position < state.length - 1) {
    readDocument(state);
  }
  return state.documents;
}
function loadAll$1(input, iterator, options) {
  if (iterator !== null && typeof iterator === "object" && typeof options === "undefined") {
    options = iterator;
    iterator = null;
  }
  var documents = loadDocuments(input, options);
  if (typeof iterator !== "function") {
    return documents;
  }
  for (var index = 0, length = documents.length; index < length; index += 1) {
    iterator(documents[index]);
  }
}
function load$1(input, options) {
  var documents = loadDocuments(input, options);
  if (documents.length === 0) {
    return void 0;
  } else if (documents.length === 1) {
    return documents[0];
  }
  throw new exception("expected a single document in the stream, but found more");
}
var loadAll_1 = loadAll$1;
var load_1 = load$1;
var loader = {
  loadAll: loadAll_1,
  load: load_1
};
var _toString = Object.prototype.toString;
var _hasOwnProperty = Object.prototype.hasOwnProperty;
var CHAR_BOM = 65279;
var CHAR_TAB = 9;
var CHAR_LINE_FEED = 10;
var CHAR_CARRIAGE_RETURN = 13;
var CHAR_SPACE = 32;
var CHAR_EXCLAMATION = 33;
var CHAR_DOUBLE_QUOTE = 34;
var CHAR_SHARP = 35;
var CHAR_PERCENT = 37;
var CHAR_AMPERSAND = 38;
var CHAR_SINGLE_QUOTE = 39;
var CHAR_ASTERISK = 42;
var CHAR_COMMA = 44;
var CHAR_MINUS = 45;
var CHAR_COLON = 58;
var CHAR_EQUALS = 61;
var CHAR_GREATER_THAN = 62;
var CHAR_QUESTION = 63;
var CHAR_COMMERCIAL_AT = 64;
var CHAR_LEFT_SQUARE_BRACKET = 91;
var CHAR_RIGHT_SQUARE_BRACKET = 93;
var CHAR_GRAVE_ACCENT = 96;
var CHAR_LEFT_CURLY_BRACKET = 123;
var CHAR_VERTICAL_LINE = 124;
var CHAR_RIGHT_CURLY_BRACKET = 125;
var ESCAPE_SEQUENCES = {};
ESCAPE_SEQUENCES[0] = "\\0";
ESCAPE_SEQUENCES[7] = "\\a";
ESCAPE_SEQUENCES[8] = "\\b";
ESCAPE_SEQUENCES[9] = "\\t";
ESCAPE_SEQUENCES[10] = "\\n";
ESCAPE_SEQUENCES[11] = "\\v";
ESCAPE_SEQUENCES[12] = "\\f";
ESCAPE_SEQUENCES[13] = "\\r";
ESCAPE_SEQUENCES[27] = "\\e";
ESCAPE_SEQUENCES[34] = '\\"';
ESCAPE_SEQUENCES[92] = "\\\\";
ESCAPE_SEQUENCES[133] = "\\N";
ESCAPE_SEQUENCES[160] = "\\_";
ESCAPE_SEQUENCES[8232] = "\\L";
ESCAPE_SEQUENCES[8233] = "\\P";
var DEPRECATED_BOOLEANS_SYNTAX = [
  "y",
  "Y",
  "yes",
  "Yes",
  "YES",
  "on",
  "On",
  "ON",
  "n",
  "N",
  "no",
  "No",
  "NO",
  "off",
  "Off",
  "OFF"
];
var DEPRECATED_BASE60_SYNTAX = /^[-+]?[0-9_]+(?::[0-9_]+)+(?:\.[0-9_]*)?$/;
function compileStyleMap(schema2, map2) {
  var result, keys, index, length, tag, style, type2;
  if (map2 === null)
    return {};
  result = {};
  keys = Object.keys(map2);
  for (index = 0, length = keys.length; index < length; index += 1) {
    tag = keys[index];
    style = String(map2[tag]);
    if (tag.slice(0, 2) === "!!") {
      tag = "tag:yaml.org,2002:" + tag.slice(2);
    }
    type2 = schema2.compiledTypeMap["fallback"][tag];
    if (type2 && _hasOwnProperty.call(type2.styleAliases, style)) {
      style = type2.styleAliases[style];
    }
    result[tag] = style;
  }
  return result;
}
function encodeHex(character) {
  var string, handle, length;
  string = character.toString(16).toUpperCase();
  if (character <= 255) {
    handle = "x";
    length = 2;
  } else if (character <= 65535) {
    handle = "u";
    length = 4;
  } else if (character <= 4294967295) {
    handle = "U";
    length = 8;
  } else {
    throw new exception("code point within a string may not be greater than 0xFFFFFFFF");
  }
  return "\\" + handle + common.repeat("0", length - string.length) + string;
}
var QUOTING_TYPE_SINGLE = 1;
var QUOTING_TYPE_DOUBLE = 2;
function State(options) {
  this.schema = options["schema"] || _default;
  this.indent = Math.max(1, options["indent"] || 2);
  this.noArrayIndent = options["noArrayIndent"] || false;
  this.skipInvalid = options["skipInvalid"] || false;
  this.flowLevel = common.isNothing(options["flowLevel"]) ? -1 : options["flowLevel"];
  this.styleMap = compileStyleMap(this.schema, options["styles"] || null);
  this.sortKeys = options["sortKeys"] || false;
  this.lineWidth = options["lineWidth"] || 80;
  this.noRefs = options["noRefs"] || false;
  this.noCompatMode = options["noCompatMode"] || false;
  this.condenseFlow = options["condenseFlow"] || false;
  this.quotingType = options["quotingType"] === '"' ? QUOTING_TYPE_DOUBLE : QUOTING_TYPE_SINGLE;
  this.forceQuotes = options["forceQuotes"] || false;
  this.replacer = typeof options["replacer"] === "function" ? options["replacer"] : null;
  this.implicitTypes = this.schema.compiledImplicit;
  this.explicitTypes = this.schema.compiledExplicit;
  this.tag = null;
  this.result = "";
  this.duplicates = [];
  this.usedDuplicates = null;
}
function indentString(string, spaces) {
  var ind = common.repeat(" ", spaces), position = 0, next = -1, result = "", line, length = string.length;
  while (position < length) {
    next = string.indexOf("\n", position);
    if (next === -1) {
      line = string.slice(position);
      position = length;
    } else {
      line = string.slice(position, next + 1);
      position = next + 1;
    }
    if (line.length && line !== "\n")
      result += ind;
    result += line;
  }
  return result;
}
function generateNextLine(state, level) {
  return "\n" + common.repeat(" ", state.indent * level);
}
function testImplicitResolving(state, str2) {
  var index, length, type2;
  for (index = 0, length = state.implicitTypes.length; index < length; index += 1) {
    type2 = state.implicitTypes[index];
    if (type2.resolve(str2)) {
      return true;
    }
  }
  return false;
}
function isWhitespace(c) {
  return c === CHAR_SPACE || c === CHAR_TAB;
}
function isPrintable(c) {
  return 32 <= c && c <= 126 || 161 <= c && c <= 55295 && c !== 8232 && c !== 8233 || 57344 <= c && c <= 65533 && c !== CHAR_BOM || 65536 <= c && c <= 1114111;
}
function isNsCharOrWhitespace(c) {
  return isPrintable(c) && c !== CHAR_BOM && c !== CHAR_CARRIAGE_RETURN && c !== CHAR_LINE_FEED;
}
function isPlainSafe(c, prev, inblock) {
  var cIsNsCharOrWhitespace = isNsCharOrWhitespace(c);
  var cIsNsChar = cIsNsCharOrWhitespace && !isWhitespace(c);
  return (inblock ? cIsNsCharOrWhitespace : cIsNsCharOrWhitespace && c !== CHAR_COMMA && c !== CHAR_LEFT_SQUARE_BRACKET && c !== CHAR_RIGHT_SQUARE_BRACKET && c !== CHAR_LEFT_CURLY_BRACKET && c !== CHAR_RIGHT_CURLY_BRACKET) && c !== CHAR_SHARP && !(prev === CHAR_COLON && !cIsNsChar) || isNsCharOrWhitespace(prev) && !isWhitespace(prev) && c === CHAR_SHARP || prev === CHAR_COLON && cIsNsChar;
}
function isPlainSafeFirst(c) {
  return isPrintable(c) && c !== CHAR_BOM && !isWhitespace(c) && c !== CHAR_MINUS && c !== CHAR_QUESTION && c !== CHAR_COLON && c !== CHAR_COMMA && c !== CHAR_LEFT_SQUARE_BRACKET && c !== CHAR_RIGHT_SQUARE_BRACKET && c !== CHAR_LEFT_CURLY_BRACKET && c !== CHAR_RIGHT_CURLY_BRACKET && c !== CHAR_SHARP && c !== CHAR_AMPERSAND && c !== CHAR_ASTERISK && c !== CHAR_EXCLAMATION && c !== CHAR_VERTICAL_LINE && c !== CHAR_EQUALS && c !== CHAR_GREATER_THAN && c !== CHAR_SINGLE_QUOTE && c !== CHAR_DOUBLE_QUOTE && c !== CHAR_PERCENT && c !== CHAR_COMMERCIAL_AT && c !== CHAR_GRAVE_ACCENT;
}
function isPlainSafeLast(c) {
  return !isWhitespace(c) && c !== CHAR_COLON;
}
function codePointAt(string, pos) {
  var first = string.charCodeAt(pos), second;
  if (first >= 55296 && first <= 56319 && pos + 1 < string.length) {
    second = string.charCodeAt(pos + 1);
    if (second >= 56320 && second <= 57343) {
      return (first - 55296) * 1024 + second - 56320 + 65536;
    }
  }
  return first;
}
function needIndentIndicator(string) {
  var leadingSpaceRe = /^\n* /;
  return leadingSpaceRe.test(string);
}
var STYLE_PLAIN = 1;
var STYLE_SINGLE = 2;
var STYLE_LITERAL = 3;
var STYLE_FOLDED = 4;
var STYLE_DOUBLE = 5;
function chooseScalarStyle(string, singleLineOnly, indentPerLevel, lineWidth, testAmbiguousType, quotingType, forceQuotes, inblock) {
  var i;
  var char = 0;
  var prevChar = null;
  var hasLineBreak = false;
  var hasFoldableLine = false;
  var shouldTrackWidth = lineWidth !== -1;
  var previousLineBreak = -1;
  var plain = isPlainSafeFirst(codePointAt(string, 0)) && isPlainSafeLast(codePointAt(string, string.length - 1));
  if (singleLineOnly || forceQuotes) {
    for (i = 0; i < string.length; char >= 65536 ? i += 2 : i++) {
      char = codePointAt(string, i);
      if (!isPrintable(char)) {
        return STYLE_DOUBLE;
      }
      plain = plain && isPlainSafe(char, prevChar, inblock);
      prevChar = char;
    }
  } else {
    for (i = 0; i < string.length; char >= 65536 ? i += 2 : i++) {
      char = codePointAt(string, i);
      if (char === CHAR_LINE_FEED) {
        hasLineBreak = true;
        if (shouldTrackWidth) {
          hasFoldableLine = hasFoldableLine || i - previousLineBreak - 1 > lineWidth && string[previousLineBreak + 1] !== " ";
          previousLineBreak = i;
        }
      } else if (!isPrintable(char)) {
        return STYLE_DOUBLE;
      }
      plain = plain && isPlainSafe(char, prevChar, inblock);
      prevChar = char;
    }
    hasFoldableLine = hasFoldableLine || shouldTrackWidth && (i - previousLineBreak - 1 > lineWidth && string[previousLineBreak + 1] !== " ");
  }
  if (!hasLineBreak && !hasFoldableLine) {
    if (plain && !forceQuotes && !testAmbiguousType(string)) {
      return STYLE_PLAIN;
    }
    return quotingType === QUOTING_TYPE_DOUBLE ? STYLE_DOUBLE : STYLE_SINGLE;
  }
  if (indentPerLevel > 9 && needIndentIndicator(string)) {
    return STYLE_DOUBLE;
  }
  if (!forceQuotes) {
    return hasFoldableLine ? STYLE_FOLDED : STYLE_LITERAL;
  }
  return quotingType === QUOTING_TYPE_DOUBLE ? STYLE_DOUBLE : STYLE_SINGLE;
}
function writeScalar(state, string, level, iskey, inblock) {
  state.dump = function() {
    if (string.length === 0) {
      return state.quotingType === QUOTING_TYPE_DOUBLE ? '""' : "''";
    }
    if (!state.noCompatMode) {
      if (DEPRECATED_BOOLEANS_SYNTAX.indexOf(string) !== -1 || DEPRECATED_BASE60_SYNTAX.test(string)) {
        return state.quotingType === QUOTING_TYPE_DOUBLE ? '"' + string + '"' : "'" + string + "'";
      }
    }
    var indent = state.indent * Math.max(1, level);
    var lineWidth = state.lineWidth === -1 ? -1 : Math.max(Math.min(state.lineWidth, 40), state.lineWidth - indent);
    var singleLineOnly = iskey || state.flowLevel > -1 && level >= state.flowLevel;
    function testAmbiguity(string2) {
      return testImplicitResolving(state, string2);
    }
    switch (chooseScalarStyle(string, singleLineOnly, state.indent, lineWidth, testAmbiguity, state.quotingType, state.forceQuotes && !iskey, inblock)) {
      case STYLE_PLAIN:
        return string;
      case STYLE_SINGLE:
        return "'" + string.replace(/'/g, "''") + "'";
      case STYLE_LITERAL:
        return "|" + blockHeader(string, state.indent) + dropEndingNewline(indentString(string, indent));
      case STYLE_FOLDED:
        return ">" + blockHeader(string, state.indent) + dropEndingNewline(indentString(foldString(string, lineWidth), indent));
      case STYLE_DOUBLE:
        return '"' + escapeString(string) + '"';
      default:
        throw new exception("impossible error: invalid scalar style");
    }
  }();
}
function blockHeader(string, indentPerLevel) {
  var indentIndicator = needIndentIndicator(string) ? String(indentPerLevel) : "";
  var clip = string[string.length - 1] === "\n";
  var keep = clip && (string[string.length - 2] === "\n" || string === "\n");
  var chomp = keep ? "+" : clip ? "" : "-";
  return indentIndicator + chomp + "\n";
}
function dropEndingNewline(string) {
  return string[string.length - 1] === "\n" ? string.slice(0, -1) : string;
}
function foldString(string, width) {
  var lineRe = /(\n+)([^\n]*)/g;
  var result = function() {
    var nextLF = string.indexOf("\n");
    nextLF = nextLF !== -1 ? nextLF : string.length;
    lineRe.lastIndex = nextLF;
    return foldLine(string.slice(0, nextLF), width);
  }();
  var prevMoreIndented = string[0] === "\n" || string[0] === " ";
  var moreIndented;
  var match;
  while (match = lineRe.exec(string)) {
    var prefix = match[1], line = match[2];
    moreIndented = line[0] === " ";
    result += prefix + (!prevMoreIndented && !moreIndented && line !== "" ? "\n" : "") + foldLine(line, width);
    prevMoreIndented = moreIndented;
  }
  return result;
}
function foldLine(line, width) {
  if (line === "" || line[0] === " ")
    return line;
  var breakRe = / [^ ]/g;
  var match;
  var start = 0, end, curr = 0, next = 0;
  var result = "";
  while (match = breakRe.exec(line)) {
    next = match.index;
    if (next - start > width) {
      end = curr > start ? curr : next;
      result += "\n" + line.slice(start, end);
      start = end + 1;
    }
    curr = next;
  }
  result += "\n";
  if (line.length - start > width && curr > start) {
    result += line.slice(start, curr) + "\n" + line.slice(curr + 1);
  } else {
    result += line.slice(start);
  }
  return result.slice(1);
}
function escapeString(string) {
  var result = "";
  var char = 0;
  var escapeSeq;
  for (var i = 0; i < string.length; char >= 65536 ? i += 2 : i++) {
    char = codePointAt(string, i);
    escapeSeq = ESCAPE_SEQUENCES[char];
    if (!escapeSeq && isPrintable(char)) {
      result += string[i];
      if (char >= 65536)
        result += string[i + 1];
    } else {
      result += escapeSeq || encodeHex(char);
    }
  }
  return result;
}
function writeFlowSequence(state, level, object) {
  var _result = "", _tag = state.tag, index, length, value;
  for (index = 0, length = object.length; index < length; index += 1) {
    value = object[index];
    if (state.replacer) {
      value = state.replacer.call(object, String(index), value);
    }
    if (writeNode(state, level, value, false, false) || typeof value === "undefined" && writeNode(state, level, null, false, false)) {
      if (_result !== "")
        _result += "," + (!state.condenseFlow ? " " : "");
      _result += state.dump;
    }
  }
  state.tag = _tag;
  state.dump = "[" + _result + "]";
}
function writeBlockSequence(state, level, object, compact) {
  var _result = "", _tag = state.tag, index, length, value;
  for (index = 0, length = object.length; index < length; index += 1) {
    value = object[index];
    if (state.replacer) {
      value = state.replacer.call(object, String(index), value);
    }
    if (writeNode(state, level + 1, value, true, true, false, true) || typeof value === "undefined" && writeNode(state, level + 1, null, true, true, false, true)) {
      if (!compact || _result !== "") {
        _result += generateNextLine(state, level);
      }
      if (state.dump && CHAR_LINE_FEED === state.dump.charCodeAt(0)) {
        _result += "-";
      } else {
        _result += "- ";
      }
      _result += state.dump;
    }
  }
  state.tag = _tag;
  state.dump = _result || "[]";
}
function writeFlowMapping(state, level, object) {
  var _result = "", _tag = state.tag, objectKeyList = Object.keys(object), index, length, objectKey, objectValue, pairBuffer;
  for (index = 0, length = objectKeyList.length; index < length; index += 1) {
    pairBuffer = "";
    if (_result !== "")
      pairBuffer += ", ";
    if (state.condenseFlow)
      pairBuffer += '"';
    objectKey = objectKeyList[index];
    objectValue = object[objectKey];
    if (state.replacer) {
      objectValue = state.replacer.call(object, objectKey, objectValue);
    }
    if (!writeNode(state, level, objectKey, false, false)) {
      continue;
    }
    if (state.dump.length > 1024)
      pairBuffer += "? ";
    pairBuffer += state.dump + (state.condenseFlow ? '"' : "") + ":" + (state.condenseFlow ? "" : " ");
    if (!writeNode(state, level, objectValue, false, false)) {
      continue;
    }
    pairBuffer += state.dump;
    _result += pairBuffer;
  }
  state.tag = _tag;
  state.dump = "{" + _result + "}";
}
function writeBlockMapping(state, level, object, compact) {
  var _result = "", _tag = state.tag, objectKeyList = Object.keys(object), index, length, objectKey, objectValue, explicitPair, pairBuffer;
  if (state.sortKeys === true) {
    objectKeyList.sort();
  } else if (typeof state.sortKeys === "function") {
    objectKeyList.sort(state.sortKeys);
  } else if (state.sortKeys) {
    throw new exception("sortKeys must be a boolean or a function");
  }
  for (index = 0, length = objectKeyList.length; index < length; index += 1) {
    pairBuffer = "";
    if (!compact || _result !== "") {
      pairBuffer += generateNextLine(state, level);
    }
    objectKey = objectKeyList[index];
    objectValue = object[objectKey];
    if (state.replacer) {
      objectValue = state.replacer.call(object, objectKey, objectValue);
    }
    if (!writeNode(state, level + 1, objectKey, true, true, true)) {
      continue;
    }
    explicitPair = state.tag !== null && state.tag !== "?" || state.dump && state.dump.length > 1024;
    if (explicitPair) {
      if (state.dump && CHAR_LINE_FEED === state.dump.charCodeAt(0)) {
        pairBuffer += "?";
      } else {
        pairBuffer += "? ";
      }
    }
    pairBuffer += state.dump;
    if (explicitPair) {
      pairBuffer += generateNextLine(state, level);
    }
    if (!writeNode(state, level + 1, objectValue, true, explicitPair)) {
      continue;
    }
    if (state.dump && CHAR_LINE_FEED === state.dump.charCodeAt(0)) {
      pairBuffer += ":";
    } else {
      pairBuffer += ": ";
    }
    pairBuffer += state.dump;
    _result += pairBuffer;
  }
  state.tag = _tag;
  state.dump = _result || "{}";
}
function detectType(state, object, explicit) {
  var _result, typeList, index, length, type2, style;
  typeList = explicit ? state.explicitTypes : state.implicitTypes;
  for (index = 0, length = typeList.length; index < length; index += 1) {
    type2 = typeList[index];
    if ((type2.instanceOf || type2.predicate) && (!type2.instanceOf || typeof object === "object" && object instanceof type2.instanceOf) && (!type2.predicate || type2.predicate(object))) {
      if (explicit) {
        if (type2.multi && type2.representName) {
          state.tag = type2.representName(object);
        } else {
          state.tag = type2.tag;
        }
      } else {
        state.tag = "?";
      }
      if (type2.represent) {
        style = state.styleMap[type2.tag] || type2.defaultStyle;
        if (_toString.call(type2.represent) === "[object Function]") {
          _result = type2.represent(object, style);
        } else if (_hasOwnProperty.call(type2.represent, style)) {
          _result = type2.represent[style](object, style);
        } else {
          throw new exception("!<" + type2.tag + '> tag resolver accepts not "' + style + '" style');
        }
        state.dump = _result;
      }
      return true;
    }
  }
  return false;
}
function writeNode(state, level, object, block, compact, iskey, isblockseq) {
  state.tag = null;
  state.dump = object;
  if (!detectType(state, object, false)) {
    detectType(state, object, true);
  }
  var type2 = _toString.call(state.dump);
  var inblock = block;
  var tagStr;
  if (block) {
    block = state.flowLevel < 0 || state.flowLevel > level;
  }
  var objectOrArray = type2 === "[object Object]" || type2 === "[object Array]", duplicateIndex, duplicate;
  if (objectOrArray) {
    duplicateIndex = state.duplicates.indexOf(object);
    duplicate = duplicateIndex !== -1;
  }
  if (state.tag !== null && state.tag !== "?" || duplicate || state.indent !== 2 && level > 0) {
    compact = false;
  }
  if (duplicate && state.usedDuplicates[duplicateIndex]) {
    state.dump = "*ref_" + duplicateIndex;
  } else {
    if (objectOrArray && duplicate && !state.usedDuplicates[duplicateIndex]) {
      state.usedDuplicates[duplicateIndex] = true;
    }
    if (type2 === "[object Object]") {
      if (block && Object.keys(state.dump).length !== 0) {
        writeBlockMapping(state, level, state.dump, compact);
        if (duplicate) {
          state.dump = "&ref_" + duplicateIndex + state.dump;
        }
      } else {
        writeFlowMapping(state, level, state.dump);
        if (duplicate) {
          state.dump = "&ref_" + duplicateIndex + " " + state.dump;
        }
      }
    } else if (type2 === "[object Array]") {
      if (block && state.dump.length !== 0) {
        if (state.noArrayIndent && !isblockseq && level > 0) {
          writeBlockSequence(state, level - 1, state.dump, compact);
        } else {
          writeBlockSequence(state, level, state.dump, compact);
        }
        if (duplicate) {
          state.dump = "&ref_" + duplicateIndex + state.dump;
        }
      } else {
        writeFlowSequence(state, level, state.dump);
        if (duplicate) {
          state.dump = "&ref_" + duplicateIndex + " " + state.dump;
        }
      }
    } else if (type2 === "[object String]") {
      if (state.tag !== "?") {
        writeScalar(state, state.dump, level, iskey, inblock);
      }
    } else if (type2 === "[object Undefined]") {
      return false;
    } else {
      if (state.skipInvalid)
        return false;
      throw new exception("unacceptable kind of an object to dump " + type2);
    }
    if (state.tag !== null && state.tag !== "?") {
      tagStr = encodeURI(state.tag[0] === "!" ? state.tag.slice(1) : state.tag).replace(/!/g, "%21");
      if (state.tag[0] === "!") {
        tagStr = "!" + tagStr;
      } else if (tagStr.slice(0, 18) === "tag:yaml.org,2002:") {
        tagStr = "!!" + tagStr.slice(18);
      } else {
        tagStr = "!<" + tagStr + ">";
      }
      state.dump = tagStr + " " + state.dump;
    }
  }
  return true;
}
function getDuplicateReferences(object, state) {
  var objects = [], duplicatesIndexes = [], index, length;
  inspectNode(object, objects, duplicatesIndexes);
  for (index = 0, length = duplicatesIndexes.length; index < length; index += 1) {
    state.duplicates.push(objects[duplicatesIndexes[index]]);
  }
  state.usedDuplicates = new Array(length);
}
function inspectNode(object, objects, duplicatesIndexes) {
  var objectKeyList, index, length;
  if (object !== null && typeof object === "object") {
    index = objects.indexOf(object);
    if (index !== -1) {
      if (duplicatesIndexes.indexOf(index) === -1) {
        duplicatesIndexes.push(index);
      }
    } else {
      objects.push(object);
      if (Array.isArray(object)) {
        for (index = 0, length = object.length; index < length; index += 1) {
          inspectNode(object[index], objects, duplicatesIndexes);
        }
      } else {
        objectKeyList = Object.keys(object);
        for (index = 0, length = objectKeyList.length; index < length; index += 1) {
          inspectNode(object[objectKeyList[index]], objects, duplicatesIndexes);
        }
      }
    }
  }
}
function dump$1(input, options) {
  options = options || {};
  var state = new State(options);
  if (!state.noRefs)
    getDuplicateReferences(input, state);
  var value = input;
  if (state.replacer) {
    value = state.replacer.call({ "": value }, "", value);
  }
  if (writeNode(state, 0, value, true, true))
    return state.dump + "\n";
  return "";
}
var dump_1 = dump$1;
var dumper = {
  dump: dump_1
};
function renamed(from, to) {
  return function() {
    throw new Error("Function yaml." + from + " is removed in js-yaml 4. Use yaml." + to + " instead, which is now safe by default.");
  };
}
var Type = type;
var Schema = schema;
var FAILSAFE_SCHEMA = failsafe;
var JSON_SCHEMA = json;
var CORE_SCHEMA = core9;
var DEFAULT_SCHEMA = _default;
var load = loader.load;
var loadAll = loader.loadAll;
var dump = dumper.dump;
var YAMLException = exception;
var types = {
  binary,
  float,
  map,
  null: _null,
  pairs,
  set,
  timestamp,
  bool,
  int,
  merge,
  omap,
  seq,
  str
};
var safeLoad = renamed("safeLoad", "load");
var safeLoadAll = renamed("safeLoadAll", "loadAll");
var safeDump = renamed("safeDump", "dump");
var jsYaml = {
  Type,
  Schema,
  FAILSAFE_SCHEMA,
  JSON_SCHEMA,
  CORE_SCHEMA,
  DEFAULT_SCHEMA,
  load,
  loadAll,
  dump,
  YAMLException,
  types,
  safeLoad,
  safeLoadAll,
  safeDump
};
var js_yaml_default = jsYaml;

// accept/src/checks.ts
var import_path2 = __toModule(require("path"));
var EXIVITY_BOT_LOGIN = "exivity-bot";
async function isWorkflowDependencyDone(octokit, token, sha, repo) {
  var _a, _b;
  (0, import_core3.info)("Checking out repository to get workflow contents...");
  process.env["INPUT_TOKEN"] = token;
  const sourceSettings = getInputs();
  await getSource(sourceSettings);
  const workflowName = getWorkflowName();
  const workspacePath = getWorkspacePath();
  const workflowPath = (0, import_path2.join)(workspacePath, ".github", "workflows", `${workflowName}.yml`);
  if (!existsSync(workflowPath)) {
    throw new Error(`Workflow file not found at "${workflowPath}"`);
  }
  (0, import_core3.info)(`Workflow file found at "${workflowPath}"`);
  const workflow = js_yaml_default.load((0, import_fs3.readFileSync)(workflowPath, "utf8"));
  const needsWorkflows = ((_b = (_a = workflow.on) == null ? void 0 : _a.workflow_run) == null ? void 0 : _b.workflows) || [];
  (0, import_core3.info)(`on.workflow_run.workflows resolves to "${JSON.stringify(needsWorkflows)}"`);
  if (needsWorkflows.length !== 1) {
    throw new Error("Workflow dependencies must have length 1");
  }
  const needsWorkflow = needsWorkflows[0];
  if (!await isCheckDone(octokit, sha, repo, needsWorkflow)) {
    (0, import_core3.info)(`Workflow "${needsWorkflow}" has not completed`);
    return false;
  }
  (0, import_core3.info)(`Workflow "${needsWorkflow}" has completed`);
  return true;
}
async function isCheckDone(octokit, ref, repo, checkName) {
  const checkResult = await octokit.rest.checks.listForRef({
    owner: "exivity",
    repo,
    ref,
    check_name: checkName
  });
  if (checkResult.data.check_runs.length === 0) {
    (0, import_core3.info)("No check runs found");
    return false;
  }
  return checkResult.data.check_runs.every((check) => check.status === "completed" && check.conclusion === "success");
}
function isBotReviewRequested(pr) {
  var _a, _b;
  return (_b = (_a = pr.requested_reviewers) == null ? void 0 : _a.some((reviewer) => (reviewer == null ? void 0 : reviewer.login) === EXIVITY_BOT_LOGIN)) != null ? _b : false;
}
function includesBotRequest(eventData) {
  var _a;
  return ((_a = eventData["requested_reviewer"]) == null ? void 0 : _a["login"]) === EXIVITY_BOT_LOGIN;
}

// accept/src/dispatch.ts
var import_core4 = __toModule(require_core());
async function dispatch({
  octokit,
  scaffoldWorkflowId: scaffoldWorkflowId2,
  scaffoldBranch,
  component,
  sha,
  pull_request,
  issue,
  dryRun = false
}) {
  const inputs = __spreadProps(__spreadValues(__spreadValues(__spreadValues(__spreadValues({}, component ? { custom_component_name: component } : {}), sha ? { custom_component_sha: sha } : {}), issue ? { issue } : {}), pull_request ? { pull_request } : {}), {
    dry_run: dryRun ? "1" : "0"
  });
  (0, import_core4.info)(`Trigger scaffold build on "${scaffoldBranch}" branch`);
  (0, import_core4.info)(`Inputs: ${JSON.stringify(inputs)}`);
  await octokit.request("POST /repos/{owner}/{repo}/actions/workflows/{workflow_id}/dispatches", {
    owner: "exivity",
    repo: "scaffold",
    workflow_id: scaffoldWorkflowId2,
    ref: scaffoldBranch,
    inputs
  });
}

// accept/src/index.ts
var supportedEvents = ["push", "pull_request", "workflow_run"];
var scaffoldWorkflowId = 514379;
var defaultScaffoldBranch = "develop";
var releaseBranches = ["master", "main"];
var developBranches = ["develop"];
function detectIssueKey(input) {
  const match = input.match(/([A-Z0-9]{1,10}-\d+)/);
  return match !== null && match.length > 0 ? match[0] : void 0;
}
function table(key, value) {
  (0, import_core5.info)(`${key.padEnd(15)}: ${value}`);
}
function isEvent(input, compare, eventData) {
  return input === compare;
}
async function run() {
  try {
    const ghToken = getToken();
    const octokit = (0, import_github2.getOctokit)(ghToken);
    let ref = getRef();
    let sha = getSha();
    const { component } = getRepository();
    const eventName = getEventName();
    const eventData = await getEventData();
    const scaffoldBranch = (0, import_core5.getInput)("scaffold-branch") || defaultScaffoldBranch;
    const dryRun = getBooleanInput("dry-run", false);
    table("Event", eventName);
    if (!supportedEvents.includes(eventName)) {
      throw new Error(`Event name "${eventName}" not supported`);
    }
    if (isEvent(eventName, "workflow_run", eventData)) {
      if (eventData["action"] !== "completed") {
        (0, import_core5.warning)('Skipping: only the "workflow_run.completed" event is supported');
        return;
      }
      ref = eventData["workflow_run"]["head_branch"];
      sha = eventData["workflow_run"]["head_commit"]["id"];
    }
    if (isEvent(eventName, "pull_request", eventData)) {
      if (eventData["action"] !== "review_requested") {
        (0, import_core5.warning)('Skipping: only the "pull_request.review_requested" event is supported');
        return;
      }
      if (!includesBotRequest(eventData)) {
        (0, import_core5.warning)("Skipping: exivity-bot not requested for review");
        return;
      }
      sha = eventData["pull_request"]["head"]["sha"];
    }
    if (releaseBranches.includes(ref)) {
      (0, import_core5.warning)(`Skipping: release branch "${ref}" is ignored`);
      return;
    }
    const pr = await getPR(octokit, component, ref);
    const pull_request = pr ? `${pr.number}` : void 0;
    const issue = detectIssueKey(ref);
    table("Ref", ref);
    table("Sha", sha);
    table("Pull request", pull_request || "None");
    table("Jira issue", issue || "None");
    (0, import_core5.startGroup)("Debug");
    (0, import_core5.info)(JSON.stringify({ eventData, pr }, void 0, 2));
    (0, import_core5.endGroup)();
    if (!developBranches.includes(ref) && !pull_request) {
      (0, import_core5.warning)("Skipping: non-develop branch without pull request");
      return;
    }
    if (eventName === "pull_request") {
      (0, import_core5.info)("Checking if workflow constraint is satisfied...");
      if (!await isWorkflowDependencyDone(octokit, ghToken, sha, component)) {
        (0, import_core5.warning)(`Skipping: workflow constraint not satisfied`);
        return;
      }
    }
    if (isEvent(eventName, "workflow_run", eventData)) {
      if (eventData["workflow_run"]["conclusion"] !== "success") {
        (0, import_core5.warning)(`Skipping: workflow constraint not satisfied`);
        return;
      }
      if (pr && !isBotReviewRequested(pr)) {
        (0, import_core5.warning)("Skipping: exivity-bot not requested for review");
        return;
      }
    }
    if (developBranches.includes(ref)) {
      (0, import_core5.info)("On a development branch, dispatching plain run");
      await dispatch({
        octokit,
        scaffoldWorkflowId,
        scaffoldBranch: defaultScaffoldBranch,
        dryRun
      });
    } else {
      await dispatch({
        octokit,
        scaffoldWorkflowId,
        scaffoldBranch,
        component,
        sha,
        pull_request,
        issue,
        dryRun
      });
    }
  } catch (error) {
    (0, import_core5.setFailed)(error.message);
  }
}
run();
/*!
 * is-plain-object <https://github.com/jonschlinkert/is-plain-object>
 *
 * Copyright (c) 2014-2017, Jon Schlinkert.
 * Released under the MIT License.
 */
/*! js-yaml 4.1.0 https://github.com/nodeca/js-yaml @license MIT */
