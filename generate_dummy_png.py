import struct
import zlib
import sys

def create_png(width, height):
    # Minimal 1x1 green png logic modified for sizes
    header = b'\x89PNG\r\n\x1a\n'
    ihdr_data = struct.pack("!IIBBBBB", width, height, 8, 2, 0, 0, 0)
    ihdr = b'IHDR' + ihdr_data
    ihdr_crc = struct.pack("!I", zlib.crc32(ihdr) & 0xFFFFFFFF)

    # IDAT (green pixel data)
    raw_data = b'\x00' + b'\x2e\x7d\x32' * width
    pixel_data = b''
    for _ in range(height):
        pixel_data += raw_data

    compressed_data = zlib.compress(pixel_data)
    idat_data = compressed_data
    idat = b'IDAT' + idat_data
    idat_crc = struct.pack("!I", zlib.crc32(idat) & 0xFFFFFFFF)

    iend = b'IEND'
    iend_crc = struct.pack("!I", zlib.crc32(iend) & 0xFFFFFFFF)

    return header + struct.pack("!I", len(ihdr_data)) + ihdr + ihdr_crc + \
           struct.pack("!I", len(idat_data)) + idat + idat_crc + \
           struct.pack("!I", 0) + iend + iend_crc

with open('icon-192.png', 'wb') as f:
    f.write(create_png(192, 192))

with open('icon-512.png', 'wb') as f:
    f.write(create_png(512, 512))

# Use the same for favicon for simplicity
with open('favicon.ico', 'wb') as f:
    f.write(create_png(32, 32))
