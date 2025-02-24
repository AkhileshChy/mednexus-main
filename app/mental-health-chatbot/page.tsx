'use client'
import { useState, useRef, useEffect } from "react"
import axios from "axios"
import { Mic, MicOff } from "lucide-react"
import BubbleEffect from "./BubbleEffect"
import Groq from "groq-sdk"
import ResponseBox from "./ResponseBox"
import React from "react"

function ChatBot() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [isRecording, setIsRecording] = useState(false)
  const [recordingTime, setRecordingTime] = useState(0)
  const audioRef = useRef(null)
  const springRef = useRef(null)
  const mediaRecorderRef = useRef(null)
  const chunksRef = useRef([])
  const timerRef = useRef(null)
  const [chatHistory, setChatHistory] = useState([])
  const [currentResponse, setCurrentResponse] = useState("")

  const get_completion = async (prompt) => {
    try {
      const groq = new Groq({ apiKey: "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", dangerouslyAllowBrowser: true })
      const systemPrompt = `You are a compassionate and supportive AI therapist. Your goal is to provide a safe, non-judgmental space for the user, actively listening to their concerns and offering thoughtful guidance. You should:
- Respond with empathy and understanding.
- Offer coping strategies, self-care tips, and evidence-based advice.
- Avoid diagnosing medical conditions but encourage seeking professional help when necessary.
- Engage in open-ended conversations, helping the user explore their emotions.
- Maintain a calm and reassuring tone while respecting user boundaries.
- If the user expresses severe distress, self-harm, or suicidal thoughts, provide a crisis helpline and urge them to seek immediate help from a professional.`
      const completion = await groq.chat.completions.create({
        messages: [
          {
            role: "system",
            content: systemPrompt,
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        model: "llama3-70b-8192",
        temperature: 0.5,
      })
      const response = completion.choices[0].message.content
      console.log(response)
      generateSpeech(response)
      return response
    } catch (error) {
      console.log(error)
    }
  }

  const mental_health_chatbot = async (user_message, chat_history) => {
    const prompt = `
        Response Generation:
        Ensure responses are warm, natural, and supportive.
        Provide helpful solutions to the user’s concerns, rather than just asking questions.
        Offer practical guidance while maintaining a compassionate and understanding tone.
        Previous conversation context: ${chat_history}
        User's message: ${user_message}
        
        Generate a 2-3 lines ofthoughtful, emotionally supportive, and solution-oriented response.
        `
    const bot_reply = await get_completion(prompt)
    setCurrentResponse(bot_reply)
    chat_history.push({ role: "assistant", content: bot_reply })
    return [bot_reply, chat_history]
  }

  const generateSpeech = async (input) => {
    setLoading(true)
    setError(null)

    // const sampleText =
    //   "Welcome to our interactive AI experience. I am your virtual assistant, designed to help and guide you through this journey. My voice is powered by advanced technology, and I'm here to demonstrate the seamless integration of speech and visual elements. Watch how the bubble responds to my voice, creating a harmonious blend of sight and sound.";

    const apiKey = "sk_4a05bcfe878d261fcc8eb227c3143a9e14d3b185fec6c0e7" // Replace manually
    const voiceId = "Xb7hH8MSUJpSbSDYk0k2"

    try {
      if (springRef.current?.startSpeaking) {
        springRef.current.startSpeaking()
      }

      const response = await axios.post(
        `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
        { text: input },
        {
          headers: {
            "Content-Type": "application/json",
            "xi-api-key": apiKey,
          },
          responseType: "blob",
        },
      )

      const audioUrl = URL.createObjectURL(response.data)
      const audio = new Audio(audioUrl)
      audioRef.current = audio

      audio.onended = () => {
        if (springRef.current?.stopSpeaking) {
          springRef.current.stopSpeaking()
        }
        setLoading(false)
      }

      await audio.play().catch((err) => {
        console.error("Playback failed:", err)
        setError("Playback error. Click the button again.")
        setLoading(false)
      })
    } catch (error) {
      setError("Failed to generate speech. Please try again.")
      console.error("Error generating speech:", error)
      if (springRef.current?.stopSpeaking) {
        springRef.current.stopSpeaking()
      }
      setLoading(false)
    }
  }

  const startRecording = async () => {
    try {
      // Clear the previous response when starting a new recording
      setCurrentResponse("")
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: "audio/webm",
      })

      mediaRecorderRef.current = mediaRecorder
      chunksRef.current = []

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data)
        }
      }

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(chunksRef.current, { type: "audio/webm" })
        await sendAudioToAPI(audioBlob)

        // Stop all tracks to release the microphone
        stream.getTracks().forEach((track) => track.stop())
      }

      mediaRecorder.start()
      setIsRecording(true)

      // Start timer
      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1)
      }, 1000)
    } catch (err) {
      setError("Failed to access microphone. Please ensure you have granted permission.")
      console.error("Error accessing microphone:", err)
    }
  }

  const stopRecording = () => {
    try {
      if (mediaRecorderRef.current && isRecording) {
        mediaRecorderRef.current.stop()
        setIsRecording(false)
        clearInterval(timerRef.current)
        setRecordingTime(0)
      }
    } catch (err) {
      console.error("Error stopping recording:", err)
    }
  }

  const sendAudioToAPI = async (audioBlob) => {
    setLoading(true)
    setError(null)

    try {
      // Process audio using Groq API
      const groq = new Groq({ apiKey: "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", dangerouslyAllowBrowser: true })
      const transcription = await groq.audio.transcriptions.create({
        file: new File([audioBlob], "recording.webm", { type: "audio/webm" }),
        model: "whisper-large-v3-turbo",
        prompt: "Conversational", // Optional
        response_format: "json", // Optional
        language: "en", // Optional
        temperature: 0.0, // Optional
      })

      console.log("Transcription:", transcription)
      const [bot_reply, chat_history] = await mental_health_chatbot(transcription.text, chatHistory)
      console.log(bot_reply)
      setChatHistory(chat_history)
    } catch (err) {
      setError("Failed to upload audio. Please try again.")
      console.error("Error uploading audio:", err)
    } finally {
      setLoading(false)
    }
  }

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current = null
      }
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
      if (mediaRecorderRef.current && isRecording) {
        mediaRecorderRef.current.stop()
      }
    }
  }, [isRecording]) // Added isRecording to dependencies

  useEffect(() => {
    const postQuestionnaireSpeech = "Hey there! I'm here to listen, support, and guide you. If there's anything on your mind—big or small—I'm here to listen. You can share your feelings, thoughts, or anything that's been weighing on you. Whenever you're ready, go ahead and express what's on your mind.";
    generateSpeech(postQuestionnaireSpeech)
    // setPostQuestionnaireSpeechPlayed(true);  // Prevent re-triggering
  }, [])

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-indigo-900 to-black overflow-hidden">
      {/* <BubbleEffect ref={springRef} /> */}

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">MINDGURU</h1>
          <p className="text-indigo-200 max-w-md mx-auto">
            {loading ? "Processing audio transcription..." : "Click to record and get a transcription"}
          </p>
        </div>

        {error && <p className="mt-4 text-red-400 text-sm">{error}</p>}

        <div className="flex flex-col gap-4 items-center mt-6">
          <button
            className={`px-6 py-3 rounded-lg flex items-center gap-2 transition-colors ${isRecording ? "bg-red-600 hover:bg-red-700" : "bg-green-600 hover:bg-green-700"
              } text-white`}
            onClick={isRecording ? stopRecording : startRecording}
            disabled={loading}
          >
            {isRecording ? (
              <>
                <MicOff className="w-5 h-5" />
                Stop Recording ({formatTime(recordingTime)})
              </>
            ) : (
              <>
                <Mic className="w-5 h-5" />
                Start Recording
              </>
            )}
          </button>
        </div>
        <ResponseBox response={currentResponse} />
      </div>
    </div>
  )
}

export default ChatBot