
# 为了适应vue3的引用机制，将 XXX.vue 移动到 XXX/index.vue，并创建 index.ts文件引用它
# vue3里面
# import 你的组件 from './组件目录名称' （错误）
# import 你的组件 from './组件目录名称/index.vue' （正确）
import os
import shutil
template = '''
import Component from './index.vue'
export default Component
'''
def handle_single(path: str, file: str):
    component_name = file[0:len(file)-4]
    target_path = f'{path}\\{component_name}'
    if not os.path.exists(target_path):
        os.makedirs(target_path)
    index_file = f'{target_path}\\index.ts'
    if os.path.exists(index_file):
        print(f'[Warn] {index_file} already exist')
        return
    with open(index_file, 'w', encoding='utf-8') as f:
        f.write(template)
    raw_file = f'{path}\\{file}'
    new_file = f'{target_path}\\index.vue'
    shutil.move(raw_file, new_file)
for path, subdir, files in os.walk('./src'):
    for f in files:
        if f.endswith('.vue') and f != 'index.vue':
            handle_single(path, f)
