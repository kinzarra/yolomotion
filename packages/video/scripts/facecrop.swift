// Square, face-centred crops for avatar images, using the Vision framework
// that ships with macOS. A centre crop of a portrait photo cuts the head off
// as often as not; this finds the face and frames it the way a profile
// picture is framed (eyes on the upper third, headroom above).
//
//   swiftc -O scripts/facecrop.swift -o /tmp/facecrop
//   /tmp/facecrop in.jpg out.png 512 [zoom]
//
// `zoom` is how much of the crop the head fills: 2.6 is a portrait bust,
// 4.0 is a wide shot. Falls back to a top-biased square when no face is
// found, which is still better than a centre crop for a standing figure.
import Foundation
import Vision
import CoreImage
import AppKit

let a = CommandLine.arguments
guard a.count >= 3 else {
  FileHandle.standardError.write("usage: facecrop <in> <out.png> [size=512] [zoom=2.8]\n".data(using: .utf8)!)
  exit(2)
}
let size = a.count > 3 ? Int(a[3]) ?? 512 : 512
let zoom = a.count > 4 ? CGFloat(Double(a[4]) ?? 2.8) : 2.8

guard let src = CIImage(contentsOf: URL(fileURLWithPath: a[1])) else {
  FileHandle.standardError.write("cannot read \(a[1])\n".data(using: .utf8)!); exit(1)
}
let W = src.extent.width, H = src.extent.height

// Vision works in a bottom-left unit square; CoreImage's extent is the same
// orientation, so the box converts with a plain multiply.
let req = VNDetectFaceRectanglesRequest()
try VNImageRequestHandler(ciImage: src, options: [:]).perform([req])
let faces = (req.results ?? []).sorted { $0.boundingBox.width > $1.boundingBox.width }

var side: CGFloat
var cx: CGFloat
var cy: CGFloat
if let f = faces.first {
  let b = f.boundingBox
  let fw = b.width * W, fh = b.height * H
  side = min(W, H, max(fw, fh) * zoom)
  cx = (b.midX * W)
  // Drop the centre below the face so there is headroom, not a forehead crop.
  cy = (b.midY * H) - side * 0.06
  FileHandle.standardError.write("face \(Int(fw))x\(Int(fh)) at \(Int(cx)),\(Int(H - cy))\n".data(using: .utf8)!)
} else {
  side = min(W, H)
  cx = W / 2
  cy = H - side / 2 * 1.05 // top-biased: a standing figure's head is up there
  FileHandle.standardError.write("no face, top crop\n".data(using: .utf8)!)
}
// Keep the square inside the image.
cx = min(max(cx, side / 2), W - side / 2)
cy = min(max(cy, side / 2), H - side / 2)
let rect = CGRect(x: (cx - side / 2).rounded(), y: (cy - side / 2).rounded(), width: side.rounded(), height: side.rounded())

let cropped = src.cropped(to: rect).transformed(by: CGAffineTransform(translationX: -rect.minX, y: -rect.minY))
let scale = CGFloat(size) / rect.width
let out = cropped.transformed(by: CGAffineTransform(scaleX: scale, y: scale))

let ctx = CIContext()
guard let cg = ctx.createCGImage(out, from: CGRect(x: 0, y: 0, width: CGFloat(size), height: CGFloat(size))),
      let data = NSBitmapImageRep(cgImage: cg).representation(using: .png, properties: [:]) else {
  FileHandle.standardError.write("encode failed\n".data(using: .utf8)!); exit(1)
}
try data.write(to: URL(fileURLWithPath: a[2]))
print("wrote \(a[2]) \(size)x\(size)")
