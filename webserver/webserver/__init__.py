
import aiohttp
from aiohttp import web

from robot import *

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

web.run_app(app, host='127.0.0.1', port=12000)

