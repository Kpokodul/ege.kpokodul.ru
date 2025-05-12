from itertools import product

ans = 0

for i in enumerate(product(sorted("ПОБЕДА"), repeat=6), start=1):
    I = "".join(i[1])
    x = i[0]
    
    if x%2==0 and I[0]=="О" and len(I)==len(set(I)): ans = x

print(ans)
