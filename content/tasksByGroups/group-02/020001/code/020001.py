def F(x, y):
    if x == y: return 1
    elif x > y: return 0
    elif x < y: return F(x+1, y) + F(x + 2, y) + F(x*3, y)

print(F(10, 24))
