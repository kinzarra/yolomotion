// Trim the transparent margins of a PNG (a matte.swift cut-out keeps the full
// input extent; a scene wants the subject's box). CoreGraphics only, no deps.
//
//   swiftc -O scripts/trim.swift -o /tmp/trim
//   /tmp/trim <in.png> <out.png>      → prints the output size
//
// Used by scripts/fetch-photos.mjs after matte; alpha > 20/255 counts as subject, 6 px padding.
import Foundation
import CoreGraphics
import ImageIO
import UniformTypeIdentifiers
let a = CommandLine.arguments
guard a.count >= 3, let src = CGImageSourceCreateWithURL(URL(fileURLWithPath: a[1]) as CFURL, nil), let img = CGImageSourceCreateImageAtIndex(src, 0, nil) else { exit(1) }
let w = img.width, h = img.height
let ctx = CGContext(data: nil, width: w, height: h, bitsPerComponent: 8, bytesPerRow: w * 4, space: CGColorSpace(name: CGColorSpace.sRGB)!, bitmapInfo: CGImageAlphaInfo.premultipliedLast.rawValue)!
ctx.draw(img, in: CGRect(x: 0, y: 0, width: w, height: h))
let d = ctx.data!.assumingMemoryBound(to: UInt8.self)
var minX = w, minY = h, maxX = -1, maxY = -1
for y in 0..<h { for x in 0..<w { if d[(y * w + x) * 4 + 3] > 20 { if x < minX { minX = x }; if x > maxX { maxX = x }; if y < minY { minY = y }; if y > maxY { maxY = y } } } }
guard maxX >= 0 else { exit(2) }
let pad = 6
let x0 = max(0, minX - pad), x1 = min(w - 1, maxX + pad), yb0 = max(0, minY - pad), yb1 = min(h - 1, maxY + pad)
// the context's buffer is stored top row first, the same order CGImage cropping uses
let rect = CGRect(x: x0, y: yb0, width: x1 - x0 + 1, height: yb1 - yb0 + 1)
let out = ctx.makeImage()!.cropping(to: rect)!
let dest = CGImageDestinationCreateWithURL(URL(fileURLWithPath: a[2]) as CFURL, UTType.png.identifier as CFString, 1, nil)!
CGImageDestinationAddImage(dest, out, nil)
CGImageDestinationFinalize(dest)
print("\(a[2]) \(out.width)x\(out.height)")
