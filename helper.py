from re import findall
from sys import argv

# Got help form: https://github.com/circulosmeos/gdown.pl/blob/master/gdown.pl
REG_EXs = ['1[0-9]{9,}','^id=([^/?&]+)','facebook\.com\/([^/?&]+)','[a-zA-Z0-9.]{5,}']

for i in REG_EXs:
    x = findall(i,argv[1])
    if(x):
        print(x.pop(0))
        break
