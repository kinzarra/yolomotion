// Native macOS speech-to-text → JSON segments with real timestamps.
//
// Why this exists: captions over LIVE footage must follow the words that were
// actually spoken, not a weighted estimate of a TTS clip (that is what
// gen-weighted-captions.mjs is for, and it only works because we synthesised
// the audio ourselves). Whisper is not installed here and the ElevenLabs key
// has no speech_to_text permission, so this uses the Speech framework that
// ships with macOS — on-device, free, no upload.
//
// Build + run. It MUST be an .app bundle: the Speech framework kills any
// process that touches it without NSSpeechRecognitionUsageDescription in a
// real Info.plist, and a bare -sectcreate __info_plist section is not enough.
//
//   APP=/tmp/Transcribe.app
//   mkdir -p "$APP/Contents/MacOS"
//   cat > "$APP/Contents/Info.plist" <<'PLIST'
//   <?xml version="1.0" encoding="UTF-8"?>
//   <!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
//   <plist version="1.0"><dict>
//     <key>CFBundleIdentifier</key><string>dev.yolomotion.transcribe</string>
//     <key>CFBundleName</key><string>transcribe</string>
//     <key>NSSpeechRecognitionUsageDescription</key><string>Transcribe local footage for captions.</string>
//   </dict></plist>
//   PLIST
//   swiftc -O scripts/transcribe.swift -o "$APP/Contents/MacOS/transcribe"
//   open "$APP" --args /abs/in.wav /abs/out.json ru-RU
//
// `open` is required (a bundle launched directly gets no TCC identity), which
// is why the output goes to a file instead of stdout. Segments may hold more
// than one word; the consumer splits those by letter weight.
import Foundation
import Speech

let args = CommandLine.arguments
let dir = FileManager.default.currentDirectoryPath
let input = URL(fileURLWithPath: args.count > 1 ? args[1] : dir + "/in.wav")
let outPath = args.count > 2 ? args[2] : dir + "/out.json"
let localeId = args.count > 3 ? args[3] : "ru-RU"

func write(_ payload: [String: Any]) -> Never {
    let data = try? JSONSerialization.data(
        withJSONObject: payload, options: [.prettyPrinted, .sortedKeys, .withoutEscapingSlashes])
    try? data?.write(to: URL(fileURLWithPath: outPath))
    exit(payload["error"] == nil ? 0 : 1)
}

SFSpeechRecognizer.requestAuthorization { status in
    guard status == .authorized else {
        write(["error": "speech recognition not authorized (status \(status.rawValue))"])
    }
    guard let recognizer = SFSpeechRecognizer(locale: Locale(identifier: localeId)) else {
        write(["error": "no recognizer for locale \(localeId)"])
    }

    // On-device keeps the footage local, but it needs the offline model that
    // only ships once Dictation is switched on in System Settings — with it
    // off the task fails with "Siri and Dictation are disabled". Fall back to
    // the network recogniser (which caps at ~1 minute of audio) rather than
    // making the caller change a system setting to caption a 15s clip.
    func transcribe(onDevice: Bool) {
        let request = SFSpeechURLRecognitionRequest(url: input)
        request.shouldReportPartialResults = false
        request.taskHint = .dictation
        request.requiresOnDeviceRecognition = onDevice

        recognizer.recognitionTask(with: request) { result, error in
            if let error = error {
                if onDevice { return transcribe(onDevice: false) }
                write(["error": error.localizedDescription])
            }
            guard let result = result, result.isFinal else { return }
            let segments = result.bestTranscription.segments.map {
                [
                    "start": (($0.timestamp * 1000).rounded()) / 1000,
                    "duration": (($0.duration * 1000).rounded()) / 1000,
                    "text": $0.substring,
                ] as [String: Any]
            }
            write([
                "source": input.lastPathComponent,
                "locale": localeId,
                "onDevice": onDevice,
                "text": result.bestTranscription.formattedString,
                "segments": segments,
            ])
        }
    }

    transcribe(onDevice: recognizer.supportsOnDeviceRecognition)
}

RunLoop.main.run(until: Date(timeIntervalSinceNow: 300))
write(["error": "timed out"])
