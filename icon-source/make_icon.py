"""
Generates the UX Baseline app icon: amber "UX" on dark background.
Outputs icon-512.png, then we let `cargo tauri icon` produce all sizes.
"""
from PIL import Image, ImageDraw, ImageFont
import os, urllib.request, sys

SIZE = 512
BG   = (13, 13, 14, 255)       # --bg-0
AMBER = (240, 160, 32, 255)    # --accent-bright
DIM   = (138, 86, 0, 255)      # --accent-dim

out_dir = os.path.dirname(os.path.abspath(__file__))
png_path = os.path.join(out_dir, "icon-512.png")

img  = Image.new("RGBA", (SIZE, SIZE), BG)
draw = ImageDraw.Draw(img)

# ── Rounded background rect ───────────────────────────────────────────────────
radius = 96
draw.rounded_rectangle([0, 0, SIZE, SIZE], radius=radius, fill=BG)

# ── Try to load Syne-ExtraBold; fall back to a bold system font ───────────────
font_path = os.path.join(out_dir, "Syne-ExtraBold.ttf")
if not os.path.exists(font_path):
    print("Downloading Syne ExtraBold...", file=sys.stderr)
    url = "https://github.com/googlefonts/syne/raw/main/fonts/ttf/Syne-ExtraBold.ttf"
    urllib.request.urlretrieve(url, font_path)

font_size = 218
font = ImageFont.truetype(font_path, font_size)

text = "UX"
bbox = draw.textbbox((0, 0), text, font=font)
tw = bbox[2] - bbox[0]
th = bbox[3] - bbox[1]

# Centre the text, nudge up slightly to leave room for baseline rule
tx = (SIZE - tw) / 2 - bbox[0]
ty = (SIZE - th) / 2 - bbox[1] - 24

draw.text((tx, ty), text, font=font, fill=AMBER)

# ── Baseline rule beneath the text ───────────────────────────────────────────
rule_y = ty + th + 28
rule_h = 8
margin = 68
draw.rounded_rectangle([margin, rule_y, SIZE - margin, rule_y + rule_h],
                       radius=4, fill=DIM)

img.save(png_path)
print(f"Saved {png_path}")
