import os
RPI = os.uname()[4].startswith("arm")

if RPI:
    import RPi.GPIO as GPIO
    GPIO.setmode(GPIO.BCM)

class Motor:
    def __init__(self, pin_enable, pin_forward, pin_back):
        self.pin_enable = pin_enable
        self.pin_forward = pin_forward
        self.pin_back = pin_back
       
        if RPI:
            GPIO.setup(self.pin_enable, GPIO.OUT)
            GPIO.setup(self.pin_forward, GPIO.OUT)
            GPIO.setup(self.pin_back, GPIO.OUT)
        
            GPIO.output(self.pin_enable, 1)
            GPIO.output(self.pin_forward, 0)
            GPIO.output(self.pin_back, 0)

    def forward(self):
        GPIO.output(self.pin_forward, 1)
        GPIO.output(self.pin_back, 0)

    def back(self):
        GPIO.output(self.pin_forward, 0)
        GPIO.output(self.pin_back, 1)
    
    def stop(self):
        GPIO.output(self.pin_forward, 0)
        GPIO.output(self.pin_back, 0)
        
        
class RobotButtons:
    def __init__(self):
        self.forward = False
        self.back = False
        self.left = False
        self.right = False
    
class Robot:
    def __init__(self):
        self.buttons = RobotButtons()
        self.motor_left = Motor(17, 27, 22)
        self.motor_right = Motor(10, 9, 11)

    def update(self):
        if not RPI: return

        if self.buttons.forward:
            self.motor_left.forward()
            self.motor_right.forward()
        elif self.buttons.back:
            self.motor_left.back()
            self.motor_right.back()
        elif self.buttons.left:
            self.motor_left.back()
            self.motor_right.forward()
        elif self.buttons.right:
            self.motor_left.forward()
            self.motor_right.back()


