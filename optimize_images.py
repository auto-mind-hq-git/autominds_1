import os
from PIL import Image
import concurrent.futures
import time

# Configuration
input_dir = 'public/frames'
output_dir = 'public/frames_webp'
target_width = 1280 # Full HD width, sufficient for web canvas
quality = 80 # Good balance for WebP

def ensure_dir(directory):
    if not os.path.exists(directory):
        os.makedirs(directory)

def process_image(filename):
    if not filename.lower().endswith('.jpg'):
        return None
        
    try:
        input_path = os.path.join(input_dir, filename)
        name_without_ext = os.path.splitext(filename)[0]
        output_filename = f"{name_without_ext}.webp"
        output_path = os.path.join(output_dir, output_filename)
        
        with Image.open(input_path) as img:
            # Calculate new height to maintain aspect ratio
            w_percent = (target_width / float(img.size[0]))
            h_size = int((float(img.size[1]) * float(w_percent)))
            
            # Resize
            img = img.resize((target_width, h_size), Image.Resampling.LANCZOS)
            
            # Save as WebP
            img.save(output_path, 'webp', quality=quality)
            
        return f"Converted: {filename} -> {output_filename}"
    except Exception as e:
        return f"Error processing {filename}: {str(e)}"

def main():
    print("Starting image optimization...")
    start_time = time.time()
    
    ensure_dir(output_dir)
    
    files = sorted(os.listdir(input_dir))
    jpg_files = [f for f in files if f.lower().endswith('.jpg')]
    
    print(f"Found {len(jpg_files)} images to process.")
    
    with concurrent.futures.ThreadPoolExecutor() as executor:
        results = list(executor.map(process_image, jpg_files))
        
    end_time = time.time()
    print(f"Done! Processed {len(jpg_files)} images in {end_time - start_time:.2f} seconds.")
    print(f"Images saved to: {output_dir}")

if __name__ == "__main__":
    main()
