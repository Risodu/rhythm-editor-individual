import sys
import json
import os
import matplotlib.pyplot as plt
with open(sys.argv[1]) as fh:
    offsets = json.load(fh)

limits = [0, 0.15, 0.25, 0.35, 0.5]
colors = ['green', 'blue', 'yellow', 'red']

groups = [[offset for offset in offsets if limits[i] <= abs(offset) < limits[i + 1]] for i in range(4)]

for i in range(4):
    plt.hist(groups[i], 20, (-0.5, 0.5), color=colors[i])

exportDir = os.path.dirname(sys.argv[2])
if not os.path.exists(exportDir):
    os.makedirs(exportDir)

plt.savefig(sys.argv[2])