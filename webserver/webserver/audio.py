
import wave
import pyaudio


CHUNK = 256

#p = pyaudio.PyAudio()

def read():

    with wave.open("sample.wav", 'rb') as wf:

        #stream = p.open(format=p.get_format_from_width(wf.getsampwidth()),
        #        channels=wf.getnchannels(),
        #        rate=wf.getframerate(),
        #        output=True)

        data = wf.readframes(CHUNK)

        while len(data) > 0:
            #print([b for b in data])
            yield data
            data = wf.readframes(CHUNK)

        #[int(b) for b in bytes]
    
