
var socket = null;

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
			var enc = new TextEncoder("utf-8");
			var data = msg['data'];
			var data_encoded = enc.encode(data);

			console.log("data", data);
			console.log("data encoded", data_encoded);
			console.log(atob(data));
			
			var byteCharacters = atob(data);
			var byteNumbers = new Array(byteCharacters.length);
			for (var i = 0; i < byteCharacters.length; i++) {
				byteNumbers[i] = byteCharacters.charCodeAt(i);
			}
			var byteArray = new Uint8Array(byteNumbers);

			//var bytes = new Uint8Array(msg['data']);
			//console.log("bytes", bytes);
			
			//var blob = new Blob([data_encoded.buffer], {type:'image/jpg'});
			//var blob = new Blob(["data:image/jpg;base64," + data], {type:'image/jpg'});
			//var blob = new Blob(["base64," + data], {type:'image/jpg'});
			var blob = new Blob([byteArray], {type: 'image/jpg'});

		        var url = URL.createObjectURL(blob);
			var image = document.getElementById("img");
			var img = new Image();
		        img.onload = function() {
				console.log("img onload");
				var ctx = image.getContext("2d");
				ctx.drawImage(img, 0, 0);
			}
			img.src = url;
			
			$("#img").attr("src", url);
			//$("#img").attr("src", "data:image/jpg;base64," + data);
			
			window.open(url, 'Image', 'resizable=1');
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

}



