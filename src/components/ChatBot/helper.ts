export const promptReplies: Record<string, string> = {
    'Get products':
        'You can start by ordering popular Pepsi products and placing them in visible areas to attract customers.',

    'Starter order':
        'A good starter order includes Pepsi, Doritos, and Walkers Crisps to cover the most common demand.',
    'Delivery time':
        'Delivery usually takes a few business days depending on your location and supplier availability.',

    Promotions:
        'There are no active promotions at the moment. A strong display and placement will still drive consistent sales.',
}

export const prompts = Object.keys(promptReplies)

export const initialPrompt =
    "Hello, I'm the Team PepsiCo Agent. How can I help you today?"
export const voiceNotSupportedText =
    'Voice input is not supported in this browser.'
export const dontRecognizeSpeechText =
    'Sorry, I could not recognize your speech. Could you try again?'

export type Sender = 'bot' | 'user'

export type Message = {
    id: number
    text: string
    sender: Sender
    meta: string
}

const getCurrentTime = () => {
    return new Date().toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
    })
}

export const createMeta = (sender: Sender) => {
    return sender === 'bot'
        ? `Team PepsiCo Agent • ${getCurrentTime()}`
        : `Read • ${getCurrentTime()}`
}

export const createMessage = (
    id: number,
    text: string,
    sender: Sender
): Message => ({
    id,
    text,
    sender,
    meta: createMeta(sender),
})
