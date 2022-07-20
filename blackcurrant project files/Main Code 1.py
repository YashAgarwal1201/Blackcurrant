
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

    path = 'UserImages'
    imageList = os.listdir(path)
    classNames = []
    images = []
    for cl in imageList:
        curImg = cv.imread(f'{path}/{cl}')
        images.append(curImg)
        classNames.append(os.path.splitext(cl)[0])
    
    #   finding encodings
    encodeList = []
    for img in images:
        img = cv.cvtColor(img, cv.COLOR_BGR2RGB)
        encode = fr.face_encodings(img)[0]
        encodeList.append(encode)
    encodeListKnown = encodeList
    print('Encoding Complete')
    
    #   capture Video
    cap = cv.VideoCapture(0)
    while True:
        success, img = cap.read()
        imgS = cv.resize(img,(0,0),None,0.25,0.25)
        imgS = cv.cvtColor(imgS, cv.COLOR_BGR2RGB)
        facesCurFrame = fr.face_locations(imgS)
        encodesCurFrame = fr.face_encodings(imgS,facesCurFrame)
        
        if (facesCurFrame != [] and encodesCurFrame != []):
            for encodeFace, faceLoc in zip(encodesCurFrame,facesCurFrame):
                matches = fr.compare_faces(encodeListKnown,encodeFace)
                faceDis = fr.face_distance(encodeListKnown,encodeFace)
            matchIndex = np.argmin(faceDis)
        
            if matches[matchIndex]:
                name = classNames[matchIndex].upper()
                y1,x2,y2,x1 = faceLoc
                # since we scaled down by 4 times
                y1, x2,y2,x1 = y1*4,x2*4,y2*4,x1*4
                cv.rectangle(img,(x1,y1),(x2,y2),(0,255,0),2)
                cv.rectangle(img, (x1,y2-35),(x2,y2), (0,255,0), cv.FILLED)
                cv.putText(img,name, (x1+6,y2-5), cv.FONT_HERSHEY_COMPLEX,1,(255,255,255),2)
                attendance(name)
            cv.imshow('webcam', img)
        
            if cv.waitKey(1) & 0xFF == ord('q'):
                break

#   Marking Attendence Function
def attendance(name):
    now = datetime.now()
    time = now.strftime('%I:%M:%S:%p')
    date = now.strftime('%d-%B-%Y')
    csvFile = 'Attendance ' + date + '.csv'
    with open(csvFile,'a+') as f:
        f.seek(0)
        myDataList = f.readlines()
        nameList = []
        for line in myDataList:
            entry = line.split(',')
            nameList.append(entry[0])
        if name not in nameList:
            f.writelines(f'\n{name}, {time}, {date}')
            print('\nYour Attendance has now been marked, ',name)
        else:
            print('\nYour Attendance has been already marked, ',name)

#   Main Function
def main():
    faceRecognition()

#   Calling Main Function
if __name__ == "__main__":
    main()
