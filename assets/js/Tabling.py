import datetime
datetime.datetime.today()

day = [1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
week = datetime.datetime.today().weekday()

MSPinIS = [4, 2, 3]
OSystem = [0, 3, 2, 2]
KBaseD = [0, 3, 1]
DPinIS = [2, 1]
ISMandM = [1, 1, 1, 1]

schedule = [15, 20]

def daily_schedule():
    for i in range(0, len(day)):
        if i <= 8:
            continue
        else:
            day[i] = 0    
    
    # Время на посешение пар
    for i in range(schedule[0], schedule[1] + 1):
        day[i] = 3
    
    # Время для перекуса
    if day[9] == 0:
        day[9] = 2
    if day[13] == 0:
        day[13] = 2
    elif day[12] == 0:
        day[12] = 2
    if day[20] == 0:
        day[20] = 2
    elif day[21] == 0:
        day[21] = 2
    
    # Время для выполнения Лабораторок
    if week == 1:
        temp = False
        for i in range(0, len(MSPinIS)):
            if temp:
                break
            if MSPinIS[i] != 0:
                temp = True
                for j in range(0, MSPinIS[i]):
                    for k in range(10, len(day)):
                        if day[k] == 0:
                            day[k] = 4
                            break
    if week == 2:
        temp = False
        for i in range(0, len(OSystem)):
            if temp:
                break
            if OSystem[i] != 0:
                temp = True
                for j in range(0, OSystem[i]):
                    for k in range(10, len(day)):
                        if day[k] == 0:
                            day[k] = 4
                            break
    if week == 3:
        temp = False
        for i in range(0, len(KBaseD)):
            if temp:
                break
            if KBaseD[i] != 0:
                temp = True
                for j in range(0, KBaseD[i]):
                    for k in range(10, len(day)):
                        if day[k] == 0:
                            day[k] = 4
                            break
    if week == 4:
        temp = False
        for i in range(0, len(DPinIS)):
            if temp:
                break
            if DPinIS[i] != 0:
                temp = True
                for j in range(0, DPinIS[i]):
                    for k in range(10, len(day)):
                        if day[k] == 0:
                            day[k] = 4
                            break
    if week == 5:
        temp = False
        for i in range(0, len(ISMandM)):
            if temp:
                break
            if ISMandM[i] != 0:
                temp = True
                for j in range(0, ISMandM[i]):
                    for k in range(10, len(day)):
                        if day[k] == 0:
                            day[k] = 4
                            break
    if week == 6:
        temp = False
        for i in range(0, len(MSPinIS)):
            if temp:
                break
            if MSPinIS[i] != 0:
                temp = True
                for j in range(0, MSPinIS[i]):
                    for k in range(10, len(day)):
                        if day[k] == 0:
                            day[k] = 4
                            break
    # if week == 7:
        
    for i in range(0, len(day)):
        print(i, " = ", day[i])
    

daily_schedule()