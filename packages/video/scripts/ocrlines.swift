// Batch OCR with macOS Vision: prints "<file>\t<first recognized line>" for
// every PNG in a directory. Used to read Zoom's speaker name tag once per
// second (codevibers-longform → who is on camera). Free, on-device.
//   swiftc -O packages/video/scripts/ocrlines.swift -o /tmp/ocrlines && /tmp/ocrlines <dir>
import Foundation
import Vision
import AppKit

let dir = CommandLine.arguments[1]
let files = try FileManager.default.contentsOfDirectory(atPath: dir).filter { $0.hasSuffix(".png") }.sorted()
for f in files {
    guard let img = NSImage(contentsOfFile: "\(dir)/\(f)"),
          let cg = img.cgImage(forProposedRect: nil, context: nil, hints: nil) else { continue }
    let req = VNRecognizeTextRequest()
    req.recognitionLevel = .accurate
    req.usesLanguageCorrection = false
    try? VNImageRequestHandler(cgImage: cg).perform([req])
    let text = (req.results ?? []).compactMap { $0.topCandidates(1).first?.string }.first ?? ""
    print("\(f)\t\(text)")
}
