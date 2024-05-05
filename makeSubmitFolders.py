import os

for level in os.listdir('levels'):
    os.makedirs(os.path.join('levels', level, 'submits'))