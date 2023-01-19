from n_body_from_the_algo import BodySystem, update_step, DELTA_TIME, INTERVAL, example_1
from matplotlib import animation
from matplotlib import pyplot as plt


# def solve(m1 = 1.989e30, m2 = 9.945e29, m3 = 4.972e29, 
#             x1_0 = 0, y1_0 = 0, vx1_0 = 0, vy1_0 = 0, 
#             x2_0 = 149.6e9, y2_0 = 0, vx2_0 = 0, vy2_0 = 29.78e3, 
#             x3_0 = -149.6e9, y3_0 = 0, vx3_0 = 0, vy3_0 = -29.78e3,
#             years = 200, steps = 10000):

    

#     return x1.tolist(), y1.tolist(), x2.tolist(), y2.tolist(), x3.tolist(), y3.tolist()

def plot_figure_8():
    return plot_return_fig("Figure-8 solution to the 3-body-problem", example_1(), -2, 2, -2, 2)

def plot_return_fig(
    title: str,
    body_system: BodySystem,
    x_start: float = -1,
    x_end: float = 1,
    y_start: float = -1,
    y_end: float = 1,
) -> None:
    """
    Utility function to plot how the given body-system evolves over time.
    No doctest provided since this function does not have a return value.
    """
    fig = plt.figure()
    # fig.canvas.set_window_title(title)
    fig.suptitle(title)
    ax = plt.axes(
        xlim=(x_start, x_end), ylim=(y_start, y_end)
    )  # Set section to be plotted
    plt.gca().set_aspect("equal")  # Fix aspect ratio

    # Each body is drawn as a patch by the plt-function
    patches = [
        plt.Circle((body.position_x, body.position_y), body.size, fc=body.color)
        for body in body_system.bodies
    ]

    for patch in patches:
        ax.add_patch(patch)

    # Function called at each step of the animation
    def update(frame: int) -> list[plt.Circle]:
        update_step(body_system, DELTA_TIME, patches)
        return patches

    anim = animation.FuncAnimation(  # noqa: F841
        fig, update, interval=INTERVAL, blit=True
    )

    plt.show()