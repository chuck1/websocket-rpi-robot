
var socket = null;
var audioCtx = new (window.AudioContext || window.webkitAudioContext)();

function string_to_int_array_8(data) {
	var byteCharacters = atob(data);
	var byteNumbers = new Array(byteCharacters.length);
	for (var i = 0; i < byteCharacters.length; i++) {
		byteNumbers[i] = byteCharacters.charCodeAt(i);
	}
	var byteArray = new Uint8Array(byteNumbers);
	return byteArray;
}

var CHUNK = 256;

var audioBufferLength = CHUNK * 10;
var audioBuffer = new Uint8Array(audioBufferLength);

//var chunks_played = 0;
//var chunks_received = 0;
var position_play = 0;
var position_receive = 0;

var node = audioCtx.createScriptProcessor(CHUNK, 1, 1);

node.onaudioprocess = function(e) {

}

function play() {
	var source = audioCtx.createBufferSource();
	// set the buffer in the AudioBufferSourceNode
	source.buffer = myArrayBuffer;
	// connect the AudioBufferSourceNode to the
	// destination so we can hear the sound
	source.connect(node);
	node.connect(audioCtx.destination);
	source.loop = true;
	//source.onended = play;
	//create_data();
	source.start();
}

function receive_audio(data) {
	bytes = string_to_int_array_8(data);

	console.log("audio", bytes);
	for(var i = 0; i < CHUNK; ++i) {
		audioBuffer[(i + position_receive) % audioBufferLength] = bytes[i];
	}
	position_receive = (position_receive + CHUNK) % audioBufferLength;
	console.log("position receive:", position_receive);
}

function open_socket(ws_url, msg) {

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
	socket.onmessage = function (evt) {
		console.log('Message from server', evt.data);
		var msg = JSON.parse(evt.data);

		if(msg['type']=='img') {
			var data = msg['data'];

			var byteArray = string_to_int_array_64(data);

			var blob = new Blob([byteArray], {type: 'image/jpg'});

			var url = URL.createObjectURL(blob);

			$("#img").attr("src", url);
		}
		else if(msg['type'] == 'audio') {
			receive_audio(msg['data']);
		}
		else if(msg['type']=='text') {
			console.log(msg['data']);
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
	var split = window.location.href.split("/");

	var ws_url = "ws://" + split[2] + "/ws";
	//var ws_url = "http://" + split[2] + "/ws";
	//var ws_url = "ws://" + split[2].split(":")[0] + ":12002" + "/ws";

	console.log("ws_url", ws_url);

	open_socket(ws_url, JSON.stringify("hello"));


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

	$("#button_img").click(function() {
		socket_send("get image");
	});

	$("#button_test_receive").click(function() {
		socket_send("test receive");
	});

	$("#button_test_receive_audio").click(function() {
		socket_send({"msg":"test receive audio", "position":position_receive});
	});

}



