// Decode every barcode/QR in a still with the Vision framework (macOS 14+),
// so a rendered QR is proven scannable, not assumed.
//   swiftc -O scripts/qrcheck.swift -o /tmp/qrcheck && /tmp/qrcheck frame.png
import Foundation
import Vision
import CoreImage

let args = CommandLine.arguments
guard args.count >= 2, let img = CIImage(contentsOf: URL(fileURLWithPath: args[1])) else {
  FileHandle.standardError.write("usage: qrcheck <image>\n".data(using: .utf8)!)
  exit(2)
}
let req = VNDetectBarcodesRequest()
req.symbologies = [.qr]
let handler = VNImageRequestHandler(ciImage: img, options: [:])
try handler.perform([req])
let found = (req.results ?? []).compactMap { $0.payloadStringValue }
if found.isEmpty { print("no QR decoded"); exit(1) }
for p in found { print("QR: \(p)") }
