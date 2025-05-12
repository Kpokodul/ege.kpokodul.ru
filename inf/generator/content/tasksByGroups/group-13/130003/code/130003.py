from ipaddress import *

def to_2(n):
    return f'{bin(int(n))[2:]:08}'

wmask = list(map(to_2, "0.0.7.255".split('.')))
mask = "".join(wmask).replace("0", "A").replace("1", "0").replace("A", "1")

net = ip_network(f'172.16.80.0/{mask.count("1")}')

cnt = 0

for i in net:
    if f'{i:b}'.count("1") % 3 != 0: cnt += 1

print(cnt)
