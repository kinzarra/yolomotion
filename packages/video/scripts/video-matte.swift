// video-matte.swift — person segmentation for VIDEO, the per-frame twin of
// matte.swift. Vision's VNGeneratePersonSegmentationRequest runs on every
// frame (Neural Engine, offline, free); the mask is temporally smoothed and
// feathered, then either the background is blurred under the person (the
// Google Meet look) or the person is written on transparency.
//
//   swiftc -O scripts/video-matte.swift -o /tmp/video-matte
//   /tmp/video-matte in.mov out.mov [--blur 24] [--alpha] [--quality accurate|balanced|fast]
//                                  [--feather 2] [--temporal 0.15] [--contrast 1.6] [--bitrate 16000000]
//
// Video only (H.264 by default, ProRes 4444 with --alpha). Put the audio back:
//   ffmpeg -i out.mov -i in.mov -map 0:v -map 1:a -c copy final.mov
// Alpha for a reel: ffmpeg -i out.mov -c:v libvpx-vp9 -pix_fmt yuva420p -b:v 4M out.webm
//
// Capturing the take on the MacBook itself (2026-10-14). The built-in camera
// exposes a native VERTICAL mode through avfoundation, so a reel-shaped take
// needs no crop; the system "Portrait" blur is NOT offered to ffmpeg (only to
// FaceTime/QuickTime, and QuickTime records 1280x720 at 2.7 Mbit/s), which is
// why the blur is applied here afterwards. The laptop mic lands at about
// -35 LUFS; wired EarPods are "External Microphone" and sit much closer.
//   ffmpeg -f avfoundation -framerate 30 -video_size 1080x1920 -pixel_format nv12 \
//     -i "MacBook Pro Camera:MacBook Pro Microphone" -t 600 \
//     -c:v h264_videotoolbox -b:v 16M -c:a aac -b:a 192k ~/Downloads/take.mov
// A hand that leaves the body silhouette at the frame edge, motion-blurred,
// falls out of the mask and into the blur: keep gestures inside the frame.
import Foundation
import AVFoundation
import Vision
import CoreImage
import CoreImage.CIFilterBuiltins
import Metal

var args = Array(CommandLine.arguments.dropFirst())
func takeOpt(_ name: String) -> String? {
    guard let i = args.firstIndex(of: name), i + 1 < args.count else { return nil }
    let v = args[i + 1]; args.removeSubrange(i...(i + 1)); return v
}
func takeFlag(_ name: String) -> Bool {
    guard let i = args.firstIndex(of: name) else { return false }
    args.remove(at: i); return true
}
let alpha = takeFlag("--alpha")
let blurSigma = Double(takeOpt("--blur") ?? "24") ?? 24
let feather = Double(takeOpt("--feather") ?? "2") ?? 2
let temporal = Double(takeOpt("--temporal") ?? "0.15") ?? 0.15
let contrast = Double(takeOpt("--contrast") ?? "1.6") ?? 1.6   // >1 turns a half-sure hand into person
let qualityName = takeOpt("--quality") ?? "accurate"
let bitrate = Int(takeOpt("--bitrate") ?? "16000000") ?? 16_000_000
guard args.count == 2 else {
    fputs("usage: video-matte in.mov out.mov [--blur 24] [--alpha] [--quality accurate|balanced|fast] [--feather 2] [--temporal 0.15] [--contrast 1.6] [--bitrate N]\n", stderr)
    exit(2)
}
let inURL = URL(fileURLWithPath: args[0]), outURL = URL(fileURLWithPath: args[1])
try? FileManager.default.removeItem(at: outURL)

let asset = AVURLAsset(url: inURL)
guard let track = asset.tracks(withMediaType: .video).first else { fputs("no video track\n", stderr); exit(1) }
let width = Int(track.naturalSize.width), height = Int(track.naturalSize.height)
let rect = CGRect(x: 0, y: 0, width: width, height: height)
let total = Int((asset.duration.seconds * Double(track.nominalFrameRate)).rounded())

let reader = try AVAssetReader(asset: asset)
let readerOut = AVAssetReaderTrackOutput(track: track, outputSettings: [kCVPixelBufferPixelFormatTypeKey as String: kCVPixelFormatType_32BGRA])
readerOut.alwaysCopiesSampleData = false
reader.add(readerOut)

let writer = try AVAssetWriter(outputURL: outURL, fileType: .mov)
let settings: [String: Any] = alpha
    ? [AVVideoCodecKey: AVVideoCodecType.proRes4444, AVVideoWidthKey: width, AVVideoHeightKey: height]
    : [AVVideoCodecKey: AVVideoCodecType.h264, AVVideoWidthKey: width, AVVideoHeightKey: height,
       AVVideoCompressionPropertiesKey: [AVVideoAverageBitRateKey: bitrate, AVVideoProfileLevelKey: AVVideoProfileLevelH264HighAutoLevel]]
let writerIn = AVAssetWriterInput(mediaType: .video, outputSettings: settings)
writerIn.expectsMediaDataInRealTime = false
writerIn.transform = track.preferredTransform
let adaptor = AVAssetWriterInputPixelBufferAdaptor(assetWriterInput: writerIn, sourcePixelBufferAttributes: [
    kCVPixelBufferPixelFormatTypeKey as String: kCVPixelFormatType_32BGRA,
    kCVPixelBufferWidthKey as String: width, kCVPixelBufferHeightKey as String: height,
    kCVPixelBufferMetalCompatibilityKey as String: true])
writer.add(writerIn)

let ctx = CIContext(mtlDevice: MTLCreateSystemDefaultDevice()!, options: [.cacheIntermediates: false])
let seg = VNGeneratePersonSegmentationRequest()
seg.qualityLevel = qualityName == "fast" ? .fast : (qualityName == "balanced" ? .balanced : .accurate)
seg.outputPixelFormat = kCVPixelFormatType_OneComponent8

// Temporal smoothing needs the previous mask as pixels, not as a CoreImage
// graph that would grow one node per frame: two small BGRA buffers ping-pong.
var maskBufs: [CVPixelBuffer] = []
var prevMask: CIImage? = nil
func maskBuffer(_ i: Int, _ w: Int, _ h: Int) -> CVPixelBuffer {
    if maskBufs.count < 2 {
        for _ in 0..<2 {
            var pb: CVPixelBuffer?
            CVPixelBufferCreate(nil, w, h, kCVPixelFormatType_32BGRA, [kCVPixelBufferMetalCompatibilityKey: true] as CFDictionary, &pb)
            maskBufs.append(pb!)
        }
    }
    return maskBufs[i % 2]
}
func scaled(_ img: CIImage, _ k: Double) -> CIImage {
    img.applyingFilter("CIColorMatrix", parameters: [
        "inputRVector": CIVector(x: k, y: 0, z: 0, w: 0), "inputGVector": CIVector(x: 0, y: k, z: 0, w: 0),
        "inputBVector": CIVector(x: 0, y: 0, z: k, w: 0), "inputAVector": CIVector(x: 0, y: 0, z: 0, w: 1)])
}

guard reader.startReading(), writer.startWriting() else { fputs("cannot start: \(String(describing: writer.error))\n", stderr); exit(1) }
let clear = CIImage(color: .clear).cropped(to: rect)
let t0 = Date(); var n = 0; var started = false
while let sb = readerOut.copyNextSampleBuffer() {
    guard let px = CMSampleBufferGetImageBuffer(sb) else { continue }
    let pts = CMSampleBufferGetPresentationTimeStamp(sb)
    if !started { writer.startSession(atSourceTime: pts); started = true }

    try VNImageRequestHandler(cvPixelBuffer: px, options: [:]).perform([seg])
    guard let maskPB = seg.results?.first?.pixelBuffer else { continue }
    let mw = CVPixelBufferGetWidth(maskPB), mh = CVPixelBufferGetHeight(maskPB)
    var mask = CIImage(cvPixelBuffer: maskPB)
    if temporal > 0, let prev = prevMask {
        mask = scaled(mask, 1 - temporal).applyingFilter("CIAdditionCompositing", parameters: ["inputBackgroundImage": scaled(prev, temporal)])
    }
    let mb = maskBuffer(n, mw, mh)
    ctx.render(mask, to: mb, bounds: CGRect(x: 0, y: 0, width: mw, height: mh), colorSpace: nil)
    prevMask = CIImage(cvPixelBuffer: mb)

    let frame = CIImage(cvPixelBuffer: px)
    var maskFull = prevMask!.transformed(by: CGAffineTransform(scaleX: Double(width) / Double(mw), y: Double(height) / Double(mh)))
    if contrast != 1 { maskFull = maskFull.applyingFilter("CIColorControls", parameters: [kCIInputContrastKey: contrast]).applyingFilter("CIColorClamp") }
    if feather > 0 { maskFull = maskFull.clampedToExtent().applyingGaussianBlur(sigma: feather).cropped(to: rect) }
    let background = alpha ? clear : frame.clampedToExtent().applyingGaussianBlur(sigma: blurSigma).cropped(to: rect)
    let blend = CIFilter.blendWithMask()
    blend.inputImage = frame; blend.backgroundImage = background; blend.maskImage = maskFull
    let out = blend.outputImage!.cropped(to: rect)

    while !writerIn.isReadyForMoreMediaData { usleep(2000) }
    var outPB: CVPixelBuffer?
    CVPixelBufferPoolCreatePixelBuffer(nil, adaptor.pixelBufferPool!, &outPB)
    ctx.render(out, to: outPB!, bounds: rect, colorSpace: frame.colorSpace ?? CGColorSpace(name: CGColorSpace.sRGB)!)
    adaptor.append(outPB!, withPresentationTime: pts)
    n += 1
    if n % 90 == 0 {
        let el = Date().timeIntervalSince(t0)
        fputs(String(format: "\r%d/%d frames  %.1f fps  eta %.0fs   ", n, total, Double(n) / el, Double(max(total - n, 0)) / (Double(n) / el)), stderr)
    }
}
writerIn.markAsFinished()
let done = DispatchSemaphore(value: 0)
writer.finishWriting { done.signal() }
done.wait()
if let e = writer.error { fputs("\nwriter error: \(e)\n", stderr); exit(1) }
fputs(String(format: "\n%d frames in %.1fs → %@\n", n, Date().timeIntervalSince(t0), outURL.path), stderr)
