
var socket = null;

/*var ws_url = "ws://192.168.56.2:12000/ws";*/
var ws_url = "ws://localhost:12000/ws";

function open_socket(msg) {

	socket = new WebSocket(ws_url);

	socket.onclose = function (event) {
		console.log('closed', event);
	};

	socket.onerror = function (event) {
		console.log('error', event);
	};

	// Connection opened
	socket.onopen = function (event) {
		console.log('open. state=',socket.readyState);

		console.log('send', msg);

		socket.send(msg);
	};

	// Listen for messages
	socket.onmessage = function (event) {
		console.log('Message from server', event.data);
		data = JSON.parse(event.data);

		if(data.type == 'response_sheet_data')
		{
			apply_sheet_data(data);
		}
	};
}


function socket_send(msg) {
	console.log('websocket send. state=', socket.readyState);

	s = socket.readyState;

	if((s == WebSocket.CLOSED) || (s == WebSocket.CLOSING)) {
		console.log('websocket is closed or closing. reconnect.');
		open_socket(msg);
	}
	else
	{
		socket.send(msg);
	}
}

window.onload = function(){
	open_socket(JSON.stringify("hello"));


	$("#button_forward").mousedown(function() {
		socket_send("mousedown forward");
	}).mouseup(function() {
		socket_send("mouseup forward");
	}).mouseleave(function() {
		socket_send("mouseleave forward");
	});

	$("#button_back").mousedown(function() {
		socket_send("mousedown back");
	}).mouseup(function() {
		socket_send("mouseup back");
	}).mouseleave(function() {
		socket_send("mouseleave back");
	});

	$("#button_left").mousedown(function() {
		socket_send("mousedown left");
	}).mouseup(function() {
		socket_send("mouseup left");
	}).mouseleave(function() {
		socket_send("mouseleave left");
	});

	$("#button_right").mousedown(function() {
		socket_send("mousedown right");
	}).mouseup(function() {
		socket_send("mouseup right");
	}).mouseleave(function() {
		socket_send("mouseleave right");
	});

}



