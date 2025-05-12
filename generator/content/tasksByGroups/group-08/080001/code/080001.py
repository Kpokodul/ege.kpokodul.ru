from itertools import product
s = product('ДГИАШЭ',repeat = 5)
n = 0
for i in s:
    f = ''.join(i)
    for k in 'ДГШ':
        f = f.replace(k,'!')
    for g in 'АИЭ':
        f = f.replace(g,'#')
    if f[0] != '#' and f[-1] != '!':
        n += 1
print(n)