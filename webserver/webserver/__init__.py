import aiohttp
from aiohttp import web

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
                forward = True
            if msg.data == 'mouseup forward':
                forward = False
            if msg.data == 'mouseleave forward':
                forward = False
        
        elif msg.type == aiohttp.WSMsgType.ERROR:
            print('ws connection closed with exception %s' % ws.exception())

        print("forward={}".format(forward))

    print('websocket connection closed')

    return ws

app = web.Application()

app['robot'] = Robot()

app.router.add_get('/ws', websocket_handler)
app.router.add_static('/', 'static')

web.run_app(app, host='*', port=12000)

