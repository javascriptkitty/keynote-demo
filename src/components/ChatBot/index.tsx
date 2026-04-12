import { useEffect, useRef, useState } from 'react'
import agentIcon from '../../assets/img/agent-icon.png'
import chatLauncherIcon from '../../assets/img/agent.png'
import plusIcon from '../../assets/img/plus.svg'
import voiceIcon from '../../assets/img/waveform.svg'
import dotsIcon from '../../assets/img/dots.svg'
import expandIcon from '../../assets/img/expand.svg'
import hideIcon from '../../assets/img/hide.svg'
import agentforceIcon from '../../assets/img/agentforce.svg'
import './index.css'

type Message = {
    id: number
    text: string
    sender: 'bot' | 'user'
    meta?: string
}

const getCurrentTime = () => {
    return new Date().toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
    })
}

const createBotMeta = () => `Team PepsiCo Agent • ${getCurrentTime()}`
const createUserMeta = () => `Read • ${getCurrentTime()}`

const promptReplies: Record<string, string> = {
    'Product setup':
        'We can help you get started with a Pepsi display and recommend a product mix for your store.',
    'Starter order':
        'We can suggest a starter order of top-selling items like Pepsi, Doritos, and Walkers Crisps.',
    'Cooler space':
        'To recommend the best setup, we would usually ask how much cooler space you currently have for beverages.',
    Promotions:
        'We can also help you explore promotional materials and display recommendations for your location.',
}

const prompts = ['Product setup', 'Starter order', 'Cooler space', 'Promotions']

const ChatBot = () => {
    const [isOpen, setIsOpen] = useState(false)
    const [inputValue, setInputValue] = useState('')
    const [messages, setMessages] = useState<Message[]>([])
    const [isTyping, setIsTyping] = useState(false)

    const messagesRef = useRef<HTMLDivElement | null>(null)
    const nextIdRef = useRef(0)

    const getNextId = () => {
        nextIdRef.current += 1
        return nextIdRef.current
    }

    useEffect(() => {
        if (messagesRef.current) {
            messagesRef.current.scrollTop = messagesRef.current.scrollHeight
        }
    }, [messages, isTyping, isOpen])

    const showWelcomeMessage = () => {
        setIsTyping(true)

        setTimeout(() => {
            const welcomeMessage: Message = {
                id: getNextId(),
                text: "Hello, I'm the Team PepsiCo Agent. How can I help you today?",
                sender: 'bot',
                meta: createBotMeta(),
            }

            setIsTyping(false)
            setMessages([welcomeMessage])
        }, 800)
    }

    const handleOpenChat = () => {
        setIsOpen(true)

        if (messages.length === 0) {
            showWelcomeMessage()
        }
    }

    const handleSend = () => {
        const value = inputValue.trim()
        if (!value) return

        const userMessage: Message = {
            id: getNextId(),
            text: value,
            sender: 'user',
            meta: createUserMeta(),
        }

        setMessages((prev) => [...prev, userMessage])
        setInputValue('')
        setIsTyping(true)

        setTimeout(() => {
            const botReply: Message = {
                id: getNextId(),
                text: 'Thanks! Our team can help you with product setup, starter orders, and display recommendations for your store.',
                sender: 'bot',
                meta: createBotMeta(),
            }

            setIsTyping(false)
            setMessages((prev) => [...prev, botReply])
        }, 700)
    }

    const handlePromptClick = (prompt: string) => {
        const userMessage: Message = {
            id: getNextId(),
            text: prompt,
            sender: 'user',
            meta: createUserMeta(),
        }

        setMessages((prev) => [...prev, userMessage])
        setIsTyping(true)

        setTimeout(() => {
            const botReply: Message = {
                id: getNextId(),
                text:
                    promptReplies[prompt] ||
                    'Thanks! We can help you with that.',
                sender: 'bot',
                meta: createBotMeta(),
            }

            setIsTyping(false)
            setMessages((prev) => [...prev, botReply])
        }, 700)
    }

    const handleKeyDown: React.KeyboardEventHandler<HTMLInputElement> = (
        event
    ) => {
        if (event.key === 'Enter') {
            handleSend()
        }
    }

    if (!isOpen) {
        return (
            <button
                type="button"
                className="chatbot__launcher"
                onClick={handleOpenChat}
            >
                <img src={chatLauncherIcon} alt="Open chat" width={120} />
            </button>
        )
    }

    return (
        <div className="chatbot">
            <div className="chatbot__panel">
                <div className="chatbot__header">
                    <div className="chatbot__title-group">
                        <img src={agentIcon} alt="Agent icon" width={28} />
                        <span className="chatbot__title">
                            Team PepsiCo Agent
                        </span>
                    </div>

                    <div className="chatbot__header-actions">
                        <img src={dotsIcon} alt="Dots" width={16.8} />
                        <img src={expandIcon} alt="Expand" width={16.8} />
                        <button type="button" onClick={() => setIsOpen(false)}>
                            <img src={hideIcon} alt="Hide chat" width={16.8} />
                        </button>
                    </div>
                </div>

                <div className="chatbot__messages" ref={messagesRef}>
                    {messages.map((message) => (
                        <div
                            key={message.id}
                            className={`chatbot__message-wrap--${message.sender}`}
                        >
                            <div
                                className={`chatbot__message--${message.sender}`}
                            >
                                {message.text}
                            </div>

                            {message.meta && (
                                <div className={'chatbot__meta'}>
                                    {message.meta}
                                </div>
                            )}
                        </div>
                    ))}

                    {messages.length === 1 && !isTyping && (
                        <div className="chatbot__prompts">
                            {prompts.map((prompt) => (
                                <button
                                    key={prompt}
                                    type="button"
                                    className="chatbot__prompt"
                                    onClick={() => handlePromptClick(prompt)}
                                >
                                    {prompt}
                                </button>
                            ))}
                        </div>
                    )}

                    {isTyping && (
                        <div className="chatbot__message-wrap--bot">
                            <div className="chatbot__message--bot ">
                                <img src={dotsIcon} alt="Typing" width={28} />
                            </div>
                        </div>
                    )}
                </div>

                <div className="chatbot__footer">
                    <div className="chatbot__input-wrap">
                        <img src={plusIcon} alt="plus" width={16} />

                        <input
                            value={inputValue}
                            onChange={(event) =>
                                setInputValue(event.target.value)
                            }
                            onKeyDown={handleKeyDown}
                            className="chatbot__input"
                        />

                        <button type="button" onClick={handleSend}>
                            <img src={voiceIcon} alt="voice icon" width={18} />
                        </button>
                    </div>

                    <div className="chatbot__powered-by">
                        Powered by
                        <img src={agentforceIcon} alt="Agentforce" />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ChatBot
