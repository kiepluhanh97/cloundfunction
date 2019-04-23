
var MSG_REQUEST = 0;
var MSG_RESPONSE = 1000;

//define message type request to server
var MSG_TYPE_PING = MSG_REQUEST + 1;
var MSG_TYPE_GET_DATA = MSG_REQUEST + 2; //mess type for function get data in test_ws controller
var MSG_TYPE_GET_DATA_1 = MSG_REQUEST + 3;//mess type for function get data in test_ws_1 controller
var MSG_TYPE_GET_DATA_4 = MSG_REQUEST + 4;//mess type for function get data in test_ws_1 controller
var MSG_TYPE_GET_DATA_5 = MSG_REQUEST + 5;//mess type for function get data in test_ws_1 controller
var MSG_UPDATE_DEVICE_DATA = MSG_REQUEST + 6;//request reload rooms status
//var MSG_RELOAD_DIM_GROUP = MSG_REQUEST + 7//request reload dim group floor on client
//var MSG_TYPE_GET_DATA_SWITCH_LIGHT_GROUP = MSG_REQUEST + 8//request reload dim group floor on client
//define message type resonse from server
var MSG_TYPE_PONG = MSG_RESPONSE + 1;

