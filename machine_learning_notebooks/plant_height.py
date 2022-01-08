import os 
import numpy as np
import cv2 
import matplotlib.pyplot as plt

def nothing(useless=None):
    pass

img = cv2.imread("corn_week_5.jpg")

BASE_HEIGHT = 38.5

# print(img.shape)
# plt.imshow(np.array(img))
# plt.show()
# cv2.namedWindow("Mask")
# cv2.createTrackbar('R_l','Mask',26,255,nothing)
# cv2.createTrackbar('G_l','Mask',46,255,nothing)
# cv2.createTrackbar('B_l','Mask',68,255,nothing)

# cv2.createTrackbar('R_h','Mask',108,255,nothing)
# cv2.createTrackbar('G_h','Mask',138,255,nothing)
# cv2.createTrackbar('B_h','Mask',155,255,nothing)

# while True:

    #Getting the position of the trackbads
# R_l = cv2.getTrackbarPos('R_l', 'Mask')
# G_l = cv2.getTrackbarPos('G_l', 'Mask')
# B_l = cv2.getTrackbarPos('B_l', 'Mask')

# R_h = cv2.getTrackbarPos('R_h', 'Mask')
# G_h = cv2.getTrackbarPos('G_h', 'Mask')
# B_h = cv2.getTrackbarPos('B_h', 'Mask')

image_array = np.array(img)
blurred_frame = cv2.blur(image_array, (5, 5), 0)
hsv_frame = cv2.cvtColor(blurred_frame, cv2.COLOR_BGR2HSV)

# Defining color theshold
# low_green = np.float32([R_l, G_l, B_l])
# high_green = np.float32([R_h, G_h, B_h])

low_green = np.float32([30, 10, 50])
high_green = np.float32([135, 255, 200])

# print(low_green,high_green)
green_mask = cv2.inRange(hsv_frame, low_green, high_green)
print("green mask shape = {}".format(green_mask.shape))
# Morphological adjestments
kernel = cv2.getStructuringElement(cv2.MORPH_RECT, (3, 3))
opening = cv2.morphologyEx(green_mask, cv2.MORPH_OPEN, kernel, iterations=1)
close = cv2.morphologyEx(opening, cv2.MORPH_CLOSE, kernel, iterations=1)

contours, _ = cv2.findContours(green_mask, cv2.RETR_TREE, cv2.CHAIN_APPROX_NONE)

biggest = sorted(contours, key=cv2.contourArea, reverse=True)[0]
print("got biggest contour!")
cv2.drawContours(image_array, biggest, -1, (0, 0, 0), 1)

# Creating blank mask and filling in the contour
blank_mask = np.zeros(image_array.shape, dtype=np.uint8)
cv2.fillPoly(blank_mask, [biggest], (255, 255, 255))
blank_mask = cv2.cvtColor(blank_mask, cv2.COLOR_BGR2GRAY)
print("shape of blank mask = {}".format(blank_mask.shape))
result = cv2.bitwise_and(image_array, image_array, mask=blank_mask)
result = np.array(result)
cv2.imshow('frame', result)

positions = np.nonzero(result)

top = positions[0].min()
bottom = positions[0].max()
left = positions[1].min()
right = positions[1].max()

# print(top, bottom, left, right)
ratio = (bottom - top) / img.shape[0]
height = ratio * BASE_HEIGHT

print(height)
plt.imshow(result)
plt.show()
# key = cv2.waitKey(0)
# key = cv2.waitKey(1)
# if key == 27:
#     break