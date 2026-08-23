// Subject matte via the Vision framework that ships with macOS 14+ — the same
// model behind "lift subject" in Photos. Zero downloads, deterministic, and
// it handles what scripts/cutout.mjs cannot: a dark subject on a dark ground.
//
//   swiftc -O scripts/matte.swift -o /tmp/matte
//   /tmp/matte <in.jpg> <out.png>
//
// Writes the subject on transparent, full input extent, sRGB RGBA8. Crop the
// input first (ffmpeg) when the subject is small in frame — the segmenter
// works at a fixed internal resolution, so a tight crop gives a cleaner edge.
import Foundation
import Vision
import CoreImage

let args = CommandLine.arguments
guard args.count == 3 else {
  FileHandle.standardError.write("usage: matte <in> <out.png>\n".data(using: .utf8)!)
  exit(64)
}
let inURL = URL(fileURLWithPath: args[1])
let outURL = URL(fileURLWithPath: args[2])

guard let image = CIImage(contentsOf: inURL, options: [.applyOrientationProperty: true]) else {
  FileHandle.standardError.write("cannot read \(args[1])\n".data(using: .utf8)!)
  exit(66)
}

let request = VNGenerateForegroundInstanceMaskRequest()
let handler = VNImageRequestHandler(ciImage: image, options: [:])
do {
  try handler.perform([request])
} catch {
  FileHandle.standardError.write("vision failed: \(error)\n".data(using: .utf8)!)
  exit(70)
}
guard let result = request.results?.first else {
  FileHandle.standardError.write("no foreground instance found\n".data(using: .utf8)!)
  exit(65)
}

do {
  let buffer = try result.generateMaskedImage(
    ofInstances: result.allInstances,
    from: handler,
    croppedToInstancesExtent: false
  )
  let masked = CIImage(cvPixelBuffer: buffer)
  let ctx = CIContext()
  try ctx.writePNGRepresentation(
    of: masked,
    to: outURL,
    format: .RGBA8,
    colorSpace: CGColorSpace(name: CGColorSpace.sRGB)!
  )
  print("wrote \(args[2]) \(Int(masked.extent.width))x\(Int(masked.extent.height)) instances=\(result.allInstances.count)")
} catch {
  FileHandle.standardError.write("mask failed: \(error)\n".data(using: .utf8)!)
  exit(70)
}
