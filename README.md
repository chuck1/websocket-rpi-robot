# websocket-rpi-robot
a websocket server using aiohttp.
allows client to control the pi over the internet

## why websockets

websockets allows fast communication between client and server which will hopefully allow for quick and precise control.

## application

the application will be to control a simple robot with two powered wheels.
the server will send a webpage that has a number of buttons for controlling the wheels.
key up and down events for the buttons will be sent to the server via the websocket.
