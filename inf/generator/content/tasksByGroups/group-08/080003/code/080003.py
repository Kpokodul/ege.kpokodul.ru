from re import *
from itertools import product

mask = "([02468]{2}|[13579]{2})+"

cnt = 0

for i in product("0123456789", repeat=4):
    i = "".join(i)
    if i[0] != "0" and (not search(mask, i)) and len(i)==len(set(i)):
        cnt += 1

print(cnt)
