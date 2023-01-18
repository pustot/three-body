import numpy as np
from scipy.integrate import odeint
import matplotlib.pyplot as plt

# Modified from https://sharegpt.com/c/fcYbm1f

# Define the gravitational constant
G = 6.67408e-11

# Define the masses of the three stars
m1 = 1.989e30
m2 = 9.945e29
m3 = 4.972e29

# Define the initial positions and velocities of the three stars
x1_0 = 0
y1_0 = 0
vx1_0 = 0
vy1_0 = 0

x2_0 = 149.6e9
y2_0 = 0
vx2_0 = 0
vy2_0 = 29.78e3

x3_0 = -149.6e9
y3_0 = 0
vx3_0 = 0
vy3_0 = -29.78e3

# Define the time steps for the simulation
t = np.linspace(0, 187*365*24*3600, 10000)

# Define the function to compute the derivatives
def deriv(y, t, G, m1, m2, m3):
    x1, y1, vx1, vy1, x2, y2, vx2, vy2, x3, y3, vx3, vy3 = y
    dx1dt = vx1
    dy1dt = vy1
    dvx1dt = -G*m2*(x1-x2)/((x1-x2)**2 + (y1-y2)**2)**(3/2) - G*m3*(x1-x3)/((x1-x3)**2 + (y1-y3)**2)**(3/2)
    dvy1dt = -G*m2*(y1-y2)/((x1-x2)**2 + (y1-y2)**2)**(3/2) - G*m3*(y1-y3)/((x1-x3)**2 + (y1-y3)**2)**(3/2)
    dx2dt = vx2
    dy2dt = vy2
    dvx2dt = -G*m1*(x2-x1)/((x2-x1)**2 + (y2-y1)**2)**(3/2) - G*m3*(x2-x3)/((x2-x3)**2 + (y2-y3)**2)**(3/2)
    dvy2dt = -G*m1*(y2-y1)/((x2-x1)**2 + (y2-y1)**2)**(3/2) - G*m3*(y2-y1)/((x2-x3)**2 + (y2-y3)**2)**(3/2)
    dx3dt = vx3
    dy3dt = vy3
    dvx3dt = -G*m1*(x3-x1)/((x3-x1)**2 + (y3-y1)**2)**(3/2) - G*m2*(x3-x2)/((x3-x2)**2 + (y3-y2)**2)**(3/2)
    dvy3dt = -G*m1*(y3-y1)/((x3-x1)**2 + (y3-y1)**2)**(3/2) - G*m2*(y3-y2)/((x3-x2)**2 + (y3-y2)**2)**(3/2)
    return [dx1dt, dy1dt, dvx1dt, dvy1dt, dx2dt, dy2dt, dvx2dt, dvy2dt, dx3dt, dy3dt, dvx3dt, dvy3dt]

def solve(m1 = 1.989e30, m2 = 9.945e29, m3 = 4.972e29, 
            x1_0 = 0, y1_0 = 0, vx1_0 = 0, vy1_0 = 0, 
            x2_0 = 149.6e9, y2_0 = 0, vx2_0 = 0, vy2_0 = 29.78e3, 
            x3_0 = -149.6e9, y3_0 = 0, vx3_0 = 0, vy3_0 = -29.78e3,
            years = 200, steps = 10000):

    t = np.linspace(0, years*365*24*3600, steps)

    # Define the initial conditions
    y0 = [x1_0, y1_0, vx1_0, vy1_0, x2_0, y2_0, vx2_0, vy2_0, x3_0, y3_0, vx3_0, vy3_0]

    # Integrate the equations of motion
    y = odeint(deriv, y0, t, args=(G, m1, m2, m3))
    x1, y1, vx1, vy1, x2, y2, vx2, vy2, x3, y3, vx3, vy3 = y.T

    return x1.tolist(), y1.tolist(), x2.tolist(), y2.tolist(), x3.tolist(), y3.tolist()

# # Plot the results
# plt.figure()
# plt.plot(x1, y1, label='Star 1')
# plt.plot(x2, y2, label='Star 2')
# plt.plot(x3, y3, label='Star 3')
# plt.plot(x1[-1], y1[-1], marker="o", color="b")
# plt.plot(x2[-1], y2[-1], marker="o", color="orange")
# plt.plot(x3[-1], y3[-1], marker="o", color="g")
# plt.xlabel('x (m)')
# plt.ylabel('y (m)')
# plt.legend()
# plt.show()

# import matplotlib.animation as animation

# def update(num, x1, y1, x2, y2, x3, y3):
#     scat1 = ax.scatter(x1[num], y1[num], c='r')
#     scat2 = ax.scatter(x2[num], y2[num], c='b')
#     scat3 = ax.scatter(x3[num], y3[num], c='g')
#     return scat1, scat2, scat3

# fig = plt.figure()
# ax = plt.axes(xlim=(-2e11, 2e11), ylim=(-2e11, 2e11))
# scat1 = ax.scatter([], [], c='r')
# scat2 = ax.scatter([], [], c='b')
# scat3 = ax.scatter([], [], c='g')
# plt.xlabel('x (m)')
# plt.ylabel('y (m)')
# ani = animation.FuncAnimation(fig, update, frames=len(t), fargs=[x1, y1, x2, y2, x3, y3])
# plt.show()
