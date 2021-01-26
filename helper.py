from re import findall
from sys import argv

REG_EXs = ['1[0-9]{9,}','id=([^/?&]+)','facebook\.com\/([^/?&]+)']

for i in REG_EXs:
    x = findall(i,argv[1])
    if(x):
        print(x.pop())
        break
