import base64

# Minimal 1x1 PNG in sky blue color (#87CEEB)
png_data = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChAI9hzGpUwAAAABJRU5ErkJggg=="

# Create assets directory
import os
os.makedirs('assets', exist_ok=True)

# Decode and save minimal PNG files
png_bytes = base64.b64decode(png_data)
with open('assets/icon.png', 'wb') as f:
    f.write(png_bytes)
with open('assets/splash.png', 'wb') as f:
    f.write(png_bytes)
with open('assets/adaptive-icon.png', 'wb') as f:
    f.write(png_bytes)
with open('assets/favicon.png', 'wb') as f:
    f.write(png_bytes)

print("Created placeholder assets")
