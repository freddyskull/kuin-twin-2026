
import os

file_path = 'src/zod/index.ts'
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

new_content = content.replace('z.uuid()', 'z.string().uuid()')

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(new_content)
