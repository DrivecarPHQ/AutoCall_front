from flask import Flask
from flask_socketio import SocketIO,emit
import time
import json

app = Flask(__name__)

socketio = SocketIO()
socketio.init_app(app)


@socketio.on('request_for_response', namespace='/acr')
def give_response(data):
    value = data.get('param')
    print(value)
    if (value == "robot"):
        emit('give_chat_record',{'code':'200','data':{'type':'robot', 'msg':'hello, i\'m robot'}})
    else:
        emit('give_chat_record',{'code':'200','data':{'type':'man', 'msg':'fuck!'}})




if __name__ == '__main__':
    socketio.run(app, debug=True, host='127.0.0.1', port=5002)
    #这里就不再用app.run而用socketio.run了。socketio.run的参数和app.run也都差不多
