import subprocess
import sys
import os

# Path to your Streamlit app
app_path = os.path.join(os.path.dirname(r"D:\GLA Mathura\Jan May 2026\Mini Project\AQI Dataset\archive (3)\run_app.py"), "AQI_Project_3.py")
subprocess.run([sys.executable, "-m", "streamlit", "run", app_path])
