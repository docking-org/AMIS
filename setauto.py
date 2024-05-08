#auto sets the brightness and contrast of an image using generate.java as a reference

import cv2
import numpy as np

def setauto(img):
    #convert image to YUV
    yuv = cv2.cvtColor(img, cv2.COLOR_BGR2YUV)
    #split the image into Y, U, and V channels
    y, u, v = cv2.split(yuv)
    #find the mean and standard deviation of the Y channel
    mean, std = cv2.meanStdDev(y)
    #set the brightness and contrast
    brightness = mean[0][0]
    contrast = std[0][0]
    #return the brightness and contrast
    return brightness, contrast


if __name__ == "__main__":
    #read the image
    img = cv2.imread("image.jpg")
    #set the brightness and contrast
    brightness, contrast = setauto(img)
    #print the brightness and contrast
    print("Brightness: ", brightness)
    print("Contrast: ", contrast)
