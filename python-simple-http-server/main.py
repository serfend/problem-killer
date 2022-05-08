import simple_http_server
import sys
from typing import Callable, Dict, List
import requests
from PyQt5.QtWidgets import (
    QWidget, QProgressBar, QPushButton, QApplication, QMessageBox, QLineEdit, QLabel)
from PyQt5.QtCore import QBasicTimer
import qt_env_config
qt_env_config.suppress_qt_warnings()


class FrmMain(QWidget):
    isActive = False
    on_start: List[Callable] = []

    def __init__(self):
        super().__init__()
        self.initUI()

    def initUIOptions(self):
        current_x = 10
        current_x_ext = current_x+50
        current_y = 10
        self.input_directory_label = QLabel('监听路径', self)
        self.input_directory_label.move(current_x, current_y)
        self.input_directory = QLineEdit('./', self)
        self.input_directory.setGeometry(current_x_ext, current_y, 100, 25)
        current_y += 30

        self.input_host_label = QLabel('监听地址', self)
        self.input_host_label.move(current_x, current_y)
        self.input_host = QLineEdit('0.0.0.0', self)
        self.input_host.setGeometry(current_x_ext, current_y, 100, 25)
        current_y += 30

        self.input_port_label = QLabel('监听端口', self)
        self.input_port_label.move(current_x, current_y)
        self.input_port = QLineEdit('80', self)
        self.input_port.setGeometry(current_x_ext, current_y, 100, 25)
        current_y += 30

        self.btn_start = QPushButton('开始', self)
        self.btn_start.move(current_x, current_y)
        self.btn_start_status = {'active': False}
        self.btn_start.clicked.connect(self.callback_btn_start)
        current_y += 30

    def initUILog(self):
        current_y = 10

    def initUI(self):
        self.initUIOptions()

        self.setGeometry(300, 300, 370, 200)
        self.setWindowTitle('基本HTTP服务')
        self.show()

    def callback_btn_start(self):
        name = 'btn_start'
        btn: QPushButton = getattr(self, f'{name}')
        status: Dict[str, any] = getattr(self, f'{name}_status')

        if status['active']:
            status['active'] = False
            btn.setText('开始')
        else:
            status['active'] = True
            btn.setText('暂停')
        for c in self.on_start:
            c(status['active'],
              self.input_directory.text(),
              self.input_host.text(),
              self.input_port.text()
              )


def on_start(is_active: bool, directory: str, bind: str, port: int):
    config = simple_http_server.SimpleServerConfig(
        directory=directory, bind=bind, port=port)
    simple_http_server.on_start(
        is_start=is_active,
        config_server=config
    )


app = QApplication(sys.argv)
if __name__ == '__main__':
    frm = FrmMain()
    frm.on_start.append(on_start)
    result = app.exec_()
    try:
        on_start(False, None, None, None)
    except:
        pass
    sys.exit(result)
