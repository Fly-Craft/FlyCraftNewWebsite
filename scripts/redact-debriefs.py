# Blacks out private data (names, tail numbers, airports, dates, address)
# on the three debrief report images, writes to public/safety/.
# Boxes are (x, y, w, h) on the native 1184x1544 canvas.
from PIL import Image, ImageDraw
import os

SRC = os.path.join(os.path.dirname(__file__), "..", "safety")
OUT = os.path.join(os.path.dirname(__file__), "..", "public", "safety")
os.makedirs(OUT, exist_ok=True)

REDACTIONS = {
    "debrief 1.png": [
        (505, 190, 185, 40),   # tail number under title
        (196, 364, 135, 36),   # date value
        (180, 470, 170, 36),   # PIC name
        (180, 523, 130, 36),   # SIC name
        (243, 576, 260, 36),   # location (airport, FBO)
        (196, 786, 142, 34),   # (June 24th)
        (605, 786, 180, 34),   # "from ACK" airport reference
        (194, 866, 152, 34),   # (June 25th)
    ],
    "debrief 2.png": [
        (428, 190, 325, 40),   # tail number + video link line
        (198, 394, 125, 38),   # date value
        (244, 499, 190, 38),   # PIC name
        (232, 552, 130, 38),   # SIC name
        (243, 605, 190, 38),   # location airport
        (260, 712, 210, 36),   # METAR station + date-time group
        (363, 896, 90, 34),    # KDBQ in chain of events
    ],
    "debrief 3.png": [
        (128, 286, 195, 50),   # tail number in title
        (129, 394, 335, 32),   # "N150MB on December 27, 2025"
        (330, 682, 115, 34),   # table: registration
        (330, 736, 185, 30),   # table: date of incident
        (330, 774, 425, 30),   # table: flight route
        (330, 812, 505, 30),   # table: flight crew names
        (494, 1150, 168, 32),  # "KBED to KOPF" in synopsis
        (388, 1444, 410, 36),  # footer street address
    ],
}

OUT_NAMES = {
    "debrief 1.png": "debrief-1.png",
    "debrief 2.png": "debrief-2.png",
    "debrief 3.png": "debrief-3.png",
}

for src_name, boxes in REDACTIONS.items():
    img = Image.open(os.path.join(SRC, src_name)).convert("RGB")
    draw = ImageDraw.Draw(img)
    for (x, y, w, h) in boxes:
        draw.rectangle([x, y, x + w, y + h], fill=(17, 17, 17))
    out_path = os.path.join(OUT, OUT_NAMES[src_name])
    img.save(out_path, "PNG", optimize=True)
    print(f"{src_name} -> {out_path} ({len(boxes)} redactions)")
