export const promptReplies: Record<string, string> = {
    'Product setup':
        'We can help you get started with a Pepsi display and recommend a product mix for your store.',
    'Starter order':
        'We can suggest a starter order of top-selling items like Pepsi, Doritos, and Walkers Crisps.',
    'Cooler space':
        'To recommend the best setup, we would usually ask how much cooler space you currently have for beverages.',
    Promotions:
        'We can also help you explore promotional materials and display recommendations for your location.',
}

export const prompts = [
    'Product setup',
    'Starter order',
    'Cooler space',
    'Promotions',
]

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
