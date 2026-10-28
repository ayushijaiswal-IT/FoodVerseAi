import os
from PIL import Image, ImageDraw, ImageFont

os.makedirs("assets/samples", exist_ok=True)

def create_sample_salad():
    img = Image.new("RGB", (600, 450), color=(240, 245, 235))
    draw = ImageDraw.Draw(img)
    # Bowl
    draw.ellipse([80, 50, 520, 390], fill=(210, 215, 210), outline=(160, 170, 160), width=4)
    # Greens
    for x, y, r in [(200, 180, 70), (280, 160, 80), (360, 200, 75), (250, 250, 85), (340, 260, 70), (180, 240, 60)]:
        draw.ellipse([x-r, y-r, x+r, y+r], fill=(45, 130, 55))
    # Avocado & Tomatoes
    draw.ellipse([210, 190, 270, 250], fill=(120, 180, 60))
    draw.ellipse([330, 170, 370, 210], fill=(220, 40, 30))
    draw.ellipse([260, 260, 300, 300], fill=(230, 45, 35))
    draw.ellipse([370, 240, 410, 280], fill=(215, 35, 25))
    # Quinoa grains / seeds
    for qx, qy in [(290, 210), (310, 230), (240, 170), (330, 220), (270, 240)]:
        draw.ellipse([qx, qy, qx+10, qy+10], fill=(240, 220, 170))
    img.save("assets/samples/mediterranean_salad.jpg", quality=90)

def create_sample_strawberries():
    img = Image.new("RGB", (600, 450), color=(250, 248, 245))
    draw = ImageDraw.Draw(img)
    # Fresh vibrant strawberries
    for cx, cy, rx, ry in [(220, 220, 80, 95), (380, 230, 75, 90), (300, 170, 65, 80)]:
        draw.ellipse([cx-rx, cy-ry, cx+rx, cy+ry], fill=(225, 25, 35), outline=(180, 15, 25), width=2)
        # Calyx leaves
        draw.polygon([(cx, cy-ry), (cx-30, cy-ry-30), (cx, cy-ry-10), (cx+30, cy-ry-30)], fill=(35, 140, 45))
        # Seeds
        for sx in range(cx-40, cx+40, 20):
            for sy in range(cy-40, cy+50, 20):
                draw.ellipse([sx, sy, sx+4, sy+4], fill=(255, 230, 140))
    img.save("assets/samples/fresh_strawberries.jpg", quality=90)

def create_sample_spoiled_avocado():
    img = Image.new("RGB", (600, 450), color=(245, 240, 235))
    draw = ImageDraw.Draw(img)
    # Dark brown/grey discolored avocado half with mold spots
    draw.ellipse([180, 90, 420, 360], fill=(65, 60, 45), outline=(40, 35, 25), width=3)
    draw.ellipse([210, 120, 390, 330], fill=(110, 95, 60))
    # Seed cavity
    draw.ellipse([260, 200, 340, 280], fill=(55, 45, 30))
    # Gray-white mold patches & necrotic spots
    for mx, my, mr in [(230, 160, 20), (350, 170, 25), (280, 300, 18), (340, 270, 22)]:
        draw.ellipse([mx-mr, my-mr, mx+mr, my+mr], fill=(160, 165, 155), outline=(130, 135, 125))
    img.save("assets/samples/spoiled_avocado.jpg", quality=90)

def create_sample_kitchen():
    img = Image.new("RGB", (600, 450), color=(210, 215, 220))
    draw = ImageDraw.Draw(img)
    # Stainless steel prep counter
    draw.rectangle([50, 160, 550, 380], fill=(180, 185, 190), outline=(140, 145, 150), width=3)
    # Cutting boards
    draw.rectangle([80, 200, 260, 320], fill=(235, 230, 150), outline=(180, 170, 100), width=2) # Poultry board
    draw.rectangle([320, 200, 500, 320], fill=(70, 160, 80), outline=(40, 120, 50), width=2) # Veggie board
    # Raw poultry on yellow board
    draw.ellipse([120, 230, 220, 290], fill=(235, 180, 170))
    # Sliced vegetables on green board
    draw.ellipse([360, 230, 420, 280], fill=(220, 50, 40))
    draw.ellipse([430, 240, 470, 285], fill=(240, 230, 80))
    # Sanitizer spray bottle
    draw.rectangle([480, 80, 530, 150], fill=(30, 120, 210))
    draw.rectangle([495, 60, 515, 80], fill=(240, 240, 240))
    img.save("assets/samples/commercial_kitchen.jpg", quality=90)

create_sample_salad()
create_sample_strawberries()
create_sample_spoiled_avocado()
create_sample_kitchen()
print("Sample images created successfully in assets/samples/")
