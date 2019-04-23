theApp.factory('WSService', function(WS_URL) {            
      //var ws = new WebSocket(WS_URL);
      var ws;      
      var isConnected = false;
      var mapCallBackFunc = {};
      var countPingConnectServer = 0;
      var sessionId = "";
  var accessToken = "";
  var wsServerUrl = ""
 var conn;
 
  
  
  function startNewWebsocket() {






    ws = new WebSocket(wsServerUrl);
    //receive data from server
    ws.onmessage = function(message) {
      ////console.log("onmessage");
      ////console.log(message);
      var cbFunc;
      var jsonObj = JSON.parse(message.data);

      /*
      if (jsonObj.msg_type === MSG_TYPE_PONG) { //ping to server and received pong msg
        ////console.log("received pong message");
        countPingConnectServer = 0;
      } else if (mapCallBackFunc.hasOwnProperty(jsonObj.msg_type.toString())) {
        cbFunc = mapCallBackFunc[jsonObj.msg_type.toString()];
        cbFunc(jsonObj);
      }MSG_UPDATE_DEVICE_DATA
      */
      if (jsonObj.msg_type === MSG_TYPE_PONG) { //ping to server and received pong msg
        ////console.log("received pong message");
        countPingConnectServer = 0;
      } else if (mapCallBackFunc.hasOwnProperty(MSG_UPDATE_DEVICE_DATA)) {
        cbFunc = mapCallBackFunc[MSG_UPDATE_DEVICE_DATA];
        cbFunc(jsonObj);
      }


    };

    ws.onopen = function() {
      ////console.log("onopen connect success");
      ////console.log(ws);
      isConnected = true;
      countPingConnectServer = 0;
    };

    ws.onclose = function(event) {
      //console.log('connection closed', event);
      isConnected = false;
    };

    ws.onerror = function(event) {
      isConnected = false;
      //console.log('connection Error', event);
    };
  };

  //startNewWebsocket();

  function sendPingMsg() {
    var jsonObj = {};
    jsonObj.msg_type = MSG_TYPE_PING;
    jsonObj.session_id = sessionId;
    jsonObj.dt = "Ping from client";
    var message = JSON.stringify(jsonObj);
    ws.send(message);
    countPingConnectServer++;
    console.log("send ping to server: ");
    console.log(message)
  }

      function addCallBack(msgType, func) {
        var name = msgType.toString();
        mapCallBackFunc[msgType.toString()] = func;
      }

  //send message to server
  function send(message) {
    if (angular.isString(message)) {
      ws.send(message);
    } else if (angular.isObject(message)) {
      ws.send(JSON.stringify(message));
    }
  }


  function connect(token) {
   /*
    console.log("=======WS=========== connnect ", token);
    accessToken = token.toString();
    wsServerUrl = WS_URL + accessToken;
    startNewWebsocket();

    setInterval(function() {
      if (isConnected) {
        if (countPingConnectServer >= 2) {
          isConnected = false;
          startNewWebsocket();

        } else {
          //sendPingMsg();
        }
      } else {
        startNewWebsocket();
      }

      //        console.log("socket status = " + ws.readyState);
    }, 2000);
*/
  }
 
  var methods = {
    //collection: collection
  };

  methods.addCallBack = addCallBack;
  methods.send = send;
  methods.sendPingMsg = sendPingMsg;
  methods.connect = connect;

      return methods;
})
