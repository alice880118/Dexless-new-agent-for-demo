"""Rebuild lw-2.png with transparent background from source asset."""
from __future__ import annotations

from collections import deque
from pathlib import Path

from PIL import Image

OUT = Path(__file__).resolve().parents[1] / "public" / "rewards" / "wheel" / "lw-2.png"
SRC = Path(
    r"C:\Users\user\.cursor\projects\d-Alice-git-0727-nav\assets"
    r"\c__Users_user_AppData_Roaming_Cursor_User_workspaceStorage_"
    r"404f2f3d0fd6602a137016d5f8472458_images_2______-2fb72199-5a49-4027-ab47-915799fbee61.png"
)


def lum(p: tuple[int, ...]) -> int:
    return max(p[0], p[1], p[2])


def make_transparent(src: Path, tol: int = 2) -> Image.Image:
    im = Image.open(src).convert("RGBA")
    w, h = im.size
    pix = im.load()
    seen = bytearray(w * h)
    q: deque[tuple[int, int]] = deque()

    def try_push(x: int, y: int) -> None:
        i = y * w + x
        if seen[i]:
            return
        if lum(pix[x, y]) > tol:
            return
        seen[i] = 1
        q.append((x, y))

    for x in range(w):
        try_push(x, 0)
        try_push(x, h - 1)
    for y in range(h):
        try_push(0, y)
        try_push(w - 1, y)

    while q:
        x, y = q.popleft()
        pix[x, y] = (0, 0, 0, 0)
        for dx, dy in ((1, 0), (-1, 0), (0, 1), (0, -1)):
            nx, ny = x + dx, y + dy
            if 0 <= nx < w and 0 <= ny < h:
                try_push(nx, ny)

    # Enclosed pure-black gaps only (do not touch dark blade body tones)
    for y in range(h):
        for x in range(w):
            r, g, b, a = pix[x, y]
            if a and r == 0 and g == 0 and b == 0:
                pix[x, y] = (0, 0, 0, 0)

    return im


def main() -> None:
    if not SRC.exists():
        raise SystemExit(f"missing source: {SRC}")
    out = make_transparent(SRC)
    opaque = sum(1 for p in out.getdata() if p[3] > 0)
    print("wrote", OUT)
    print("mode", out.mode, "size", out.size, "corner", out.getpixel((0, 0)), "opaque", opaque)
    out.save(OUT, optimize=True)


if __name__ == "__main__":
    main()
