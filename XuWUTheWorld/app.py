# encoding: utf-8
from flask import Flask, request
from flask_cors import CORS
from flask_socketio import SocketIO
import time
import json

app = Flask(__name__)
SECRET_KEY = 'abdskfa.sdfs'
lb = ['http://127.0.0.1']
socket = SocketIO(app, cors_allowed_origins='*')
CORS(app, cors_allowed_origins='123')
@app.route('/api', methods=['POST'])
def index():
    f = open('js/data.json', 'r', encoding='utf-8')
    data = f.read()
    f.close()
    data = json.loads(data)
    print(type(data))

    return data

@socket.on('connect')
def connect():
    sid = request.sid
    print('{} 上线了'.format(sid))

@socket.on('disconnect')
def disconnect():
    sid = request.sid
    print('{} 断开连接'.format(sid))


@socket.on('msg')
def msg(msg):
    msg = msg.encode('utf-8')
    msg = msg.decode('utf-8')
    # print(msg)
    # 返回自己的消息
    socket.emit('me', str(msg))
    # ai回复
    time.sleep(1)

    msg = """好的，这里是一个简单的 Flask 应用程序，它可以在浏览器中显示 "Hello World!"。
```python
from flask import Flask

app = Flask(__name__)

@app.route('/')
def hello_world():
    a = 1
    b = 2
    print("hello 哈哈哈 123", a+b)
    return 'Hello World!'

if __name__ == '__main__':
    app.run()
```

在这个例子中，我们导入了 Flask 类并创建了一个应用程序实例。我们使用装饰器 @app.route('/') 来定义一个路由，它指定了当用户访问应用程序的根 URL 时要执行的函数。在这个例子中，我们的函数名是 hello_world()，它返回一个简单的字符串 "Hello World!"。

最后，我们在 if __name__ == '__main__': 语句块中调用 app.run() 方法来启动应用程序。这将在本地计算机上启动一个 Web 服务器，并使应用程序在其中运行。

您可以在命令行中运行这个应用程序，然后在浏览器中输入 http://localhost:5000/ 来查看它的输出。"""
    msg = """
    以下是使用C++编写的九九乘法表代码
```java
#include <iostream>
using namespace std;

int main() {
    for (int i = 1; i <= 9; i++) {
        for (int j = 1; j <= i; j++) {
            cout << j << " * " << i << " = " << (i * j) << "\t";
        }
        cout << endl;
    }
    return 0;
}
```
    """
    # f = open('gitBash使用教程.md','r', encoding='utf-8')
    # msg = f.read()
    # f.close()
    socket.emit('ai', msg)


# 社区交流
@socket.on('community')
def community(msg):
    msg = msg.encode('utf-8')
    msg = msg.decode('utf-8')
    # print(msg)
    socket.emit('communitys', msg)




if __name__ == '__main__':
    socket.run(app, host='0.0.0.0', port=8000, debug=True)