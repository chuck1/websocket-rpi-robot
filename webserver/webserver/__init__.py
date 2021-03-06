import math
import base64
import aiohttp
from aiohttp import web
import cv2
import numpy as np

from robot import *
import audio

cap = cv2.VideoCapture(0)

def image_data():
    with open("panda.jpg", "rb") as f:
        data = f.read()
    return data

def image_data_2():

    cap = cv2.VideoCapture("panda.jpg")

    res, frame = cap.read()

    encode_param=[int(cv2.IMWRITE_JPEG_QUALITY),90]

    result, imgencode = cv2.imencode('.jpg', frame, encode_param)

    return imgencode.tostring()

async def send_image(ws):
    
    data = image_data_2()
    data = base64.b64encode(data).decode()
    msg = {'type':'img', 'data':data}
    print('sending', msg)
    await ws.send_json(msg)

def audio_float_to_bytes(y):
    y = (y + 1) / 2 * 255
    y = y.astype(int).tolist()
    y = bytes(y)
    return y

async def send_test_audio(ws, position):
    
    sampleWidth = 1 / 44100
    t = (np.arange(audio.CHUNK) + position) * sampleWidth
    y = np.sin(2 * math.pi * 200 * t)
    data = audio_float_to_bytes(y)
    msg = {'type':'audio', 'data':base64.b64encode(data).decode()}
    await ws.send_json(msg)


async def websocket_handler(request):
    
    robot = request.app['robot']

    print('create websocket response')
        
    ws = web.WebSocketResponse()

    print('await prepare')
    await ws.prepare(request)

    print('prepare complete')
     
    async for msg in ws:
        print(msg)
        if msg.type == aiohttp.WSMsgType.TEXT:
            if msg.data == 'mousedown forward':
                robot.buttons.forward = True
            elif msg.data == 'mouseup forward':
                robot.buttons.forward = False
            elif msg.data == 'mouseleave forward':
                robot.buttons.forward = False
            elif msg.data == 'mousedown back':
                robot.buttons.back = True
            elif msg.data == 'mouseup back':
                robot.buttons.back = False
            elif msg.data == 'mouseleave back':
                robot.buttons.back = False
            elif msg.data == 'mousedown left':
                robot.buttons.left = True
            elif msg.data == 'mouseup left':
                robot.buttons.left = False
            elif msg.data == 'mouseleave left':
                robot.buttons.left = False
            elif msg.data == 'mousedown right':
                robot.buttons.right = True
            elif msg.data == 'mouseup right':
                robot.buttons.right = False
            elif msg.data == 'mouseleave right':
                robot.buttons.right = False
            elif msg.data == 'get image':
                await send_image(ws)
            elif msg.data == 'test receive':
                await ws.send_json({'type':'text', 'data':'hello'})
        elif msg.type == aiohttp.WSMsgType.JSON:
            if msg.data == 'test receive audio':
                await send_test_audio(ws)
        
        elif msg.type == aiohttp.WSMsgType.ERROR:
            print('ws connection closed with exception %s' % ws.exception())

        robot.update()

        print("forward={:d} back={:d} left={:d} right={:d}".format(
            robot.buttons.forward,
            robot.buttons.back,
            robot.buttons.left,
            robot.buttons.right,
            ))

    print('websocket connection closed')

    return ws

app = web.Application()

app['robot'] = Robot()

app.router.add_get('/ws', websocket_handler)
app.router.add_static('/', 'static')

web.run_app(app, host='0.0.0.0', port=12001)



