var sdk = require("microsoft-cognitiveservices-speech-sdk");
var subscriptionKey = "dd6eeca8116842c4bffd84928207fc94";
var serviceRegion = "southeastasia";
var filename = "YourAudioFile.wav";
var text = "Hello! It's good to see you.";

var audioConfig = sdk.AudioConfig.fromAudioFileOutput(filename);
var speechConfig = sdk.SpeechConfig.fromSubscription(subscriptionKey, serviceRegion);
speechConfig.speechSynthesisVoiceName = "zh-TW-HsiaoChenNeural";
speechConfig.SpeechSynthesisLanguage = "zh-TW";

var synthesizer = new sdk.SpeechSynthesizer(speechConfig, audioConfig);
synthesizer.speakTextAsync(
    text,
    function (result) {
        if (result.reason === sdk.ResultReason.SynthesizingAudioCompleted) {
            console.log("synthesis finished.");
        } else {
            console.error("Speech synthesis canceled, " + result.errorDetails +
                "\nDid you update the subscription info?");
        }
        synthesizer.close();
        synthesizer = undefined;
    },
    function (err) {
        console.trace("err - " + err);
        synthesizer.close();
        synthesizer = undefined;
    }
);
