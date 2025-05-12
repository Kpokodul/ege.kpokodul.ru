from ipaddress import ip_network, ip_address

all_mask = []

for mask in range(1,32):
    try:
        net = ip_network(f'153.202.16.32/{mask}', 1)
        if ip_address('153.202.16.37') in net:
            
            all_mask.append(str(net.netmask))
    except: ...

ans = list(map(int, all_mask[-1].split('.')))

print(ans[-1]+ans[-2])
