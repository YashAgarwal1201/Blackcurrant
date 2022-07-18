
"""
Face Based Attendance System
"""

# imports
import cv2 as cv
import numpy as np
import face_recognition as fr
import os
from datetime import *

#   Face Recognition Function
def faceRecognition():
    #print('hello')
    path = 'UserImages'
    imageList = os.listdir(path)
    classNames = []
    images = []
    for cl in imageList:
        curImg = cv.imread(f'{path}/{cl}')
        images.append(curImg)
        classNames.append(os.path.splitext(cl)[0])
    #   finding encodings   #
    encodeList = []
    for img in images:
        img = cv.cvtColor(img, cv.COLOR_BGR2RGB)
        encode = fr.face_encodings(img)[0]
        encodeList.append(encode)
    encodeListKnown = encodeList
    print('Encoding Complete')
    #   capture Video   #
    cap = cv.VideoCapture(0)
    while True:
        success, img = cap.read()
        imgS = cv.resize(img,(0,0),None,0.25,0.25)
        imgS = cv.cvtColor(imgS, cv.COLOR_BGR2RGB)
        facesCurFrame = fr.face_locations(imgS)
        encodesCurFrame = fr.face_encodings(imgS,facesCurFrame)
        try:
            for encodeFace, faceLoc in zip(encodesCurFrame,facesCurFrame):
                matches = fr.compare_faces(encodeListKnown,encodeFace)
                faceDis = fr.face_distance(encodeListKnown,encodeFace)
            if (not matches) and (not faceDis):
                print('You are not a authorised user of this system')
                exit(0)
        except:
            continue
        matchIndex = np.argmin(faceDis)
        if matches[matchIndex]:
            name = classNames[matchIndex].upper()
            attendance(name)

#   Marking Attendence Function
def attendance(name):
    with open('Attendance.csv','w+') as f:
        myDataList = f.readlines()
        nameList = []
        for line in myDataList:
            entry = line.split(',')
            nameList.append(entry[0])
        if name not in nameList:
            now = datetime.now()
            time = now.strftime('%I:%M:%S:%p')
            date = now.strftime('%d-%B-%Y')
            f.writelines(f'n{name}, {time}, {date}')
        else:
            print('Your Attendance has been already marked')

#   Main Function
def main():
    faceRecognition()

#   Calling Main Function
if __name__ == "__main__":
    main()
