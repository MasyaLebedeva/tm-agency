"""
Wrapper to redirect to multi_bot.py for Railway compatibility
Railway may be configured to use bot.py, so this file redirects to multi_bot.py
"""
import os
import sys

# Execute multi_bot.py's main block
if __name__ == "__main__":
    # Get the directory of this file
    script_dir = os.path.dirname(os.path.abspath(__file__))
    multi_bot_path = os.path.join(script_dir, 'multi_bot.py')
    
    # Read and execute multi_bot.py
    with open(multi_bot_path, 'r', encoding='utf-8') as f:
        exec(compile(f.read(), multi_bot_path, 'exec'), {'__name__': '__main__'})
