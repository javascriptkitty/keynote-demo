import { useEffect, useRef, useState } from 'react';
import agentIcon from '../../assets/img/agent-icon.png';
import chatLauncherIcon from '../../assets/img/agent.png';
import plusIcon from '../../assets/img/plus.svg';
import voiceIcon from '../../assets/img/waveform.svg';
import dotsIcon from '../../assets/img/dots.svg';
import expandIcon from '../../assets/img/expand.svg';
import hideIcon from '../../assets/img/hide.svg';
import agentforceIcon from '../../assets/img/agentforce.svg';
import { askGemini, FALLBACK_REPLY } from '../../api';
import {
    createMessage,
    initialPrompt,
    promptReplies,
    prompts,
    voiceNotSupportedText,
    dontRecognizeSpeechText,
    type Message,
} from './helper';
import './index.css';

const ChatBot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [inputValue, setInputValue] = useState('');
    const [messages, setMessages] = useState<Message[]>([]);
    const [isTyping, setIsTyping] = useState(false);
    const [isListening, setIsListening] = useState(false);
    const [showFallbackPrompts, setShowFallbackPrompts] = useState(false);
    const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);

    const messagesRef = useRef<HTMLDivElement | null>(null);
    const recognitionRef = useRef<any>(null);
    const nextIdRef = useRef(0);

    const getNextId = () => {
        nextIdRef.current += 1;
        return nextIdRef.current;
    };

    useEffect(() => {
        if (messagesRef.current) {
            messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
        }
    }, [messages, isTyping, isOpen]);

    const showWelcomeMessage = () => {
        setIsTyping(true);

        setTimeout(() => {
            setIsTyping(false);
            setShowFallbackPrompts(false);
            setMessages([createMessage(getNextId(), initialPrompt, 'bot')]);
        }, 800);
    };

    const handleOpenChat = () => {
        setIsOpen(true);

        if (messages.length === 0) {
            showWelcomeMessage();
        }
    };

    const handleClearChat = () => {
        setMessages([]);
        setInputValue('');
        setIsTyping(false);
        setIsListening(false);
        setShowFallbackPrompts(false);
        setIsMoreMenuOpen(false);
        showWelcomeMessage();
    };

    const handleSend = async () => {
        const value = inputValue.trim();
        if (!value) return;

        const userMessage = createMessage(getNextId(), value, 'user');

        setMessages((prev) => [...prev, userMessage]);
        setInputValue('');
        setIsTyping(true);
        setIsMoreMenuOpen(false);

        try {
            const replyText = await askGemini(value);
            const botReply = createMessage(getNextId(), replyText, 'bot');

            setIsTyping(false);
            setShowFallbackPrompts(false);
            setMessages((prev) => [...prev, botReply]);
        } catch (error) {
            console.error(error);

            const fallbackReply = createMessage(getNextId(), FALLBACK_REPLY, 'bot');

            setIsTyping(false);
            setShowFallbackPrompts(true);
            setMessages((prev) => [...prev, fallbackReply]);
        }
    };

    const handleVoiceInput = () => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

        if (!SpeechRecognition) {
            const fallback = createMessage(getNextId(), voiceNotSupportedText, 'bot');

            setShowFallbackPrompts(true);
            setMessages((prev) => [...prev, fallback]);
            return;
        }

        if (isListening && recognitionRef.current) {
            recognitionRef.current.stop();
            setIsListening(false);
            return;
        }

        const recognition = new SpeechRecognition();
        recognitionRef.current = recognition;

        recognition.lang = 'en-US';
        recognition.interimResults = false;
        recognition.maxAlternatives = 1;

        setIsListening(true);
        recognition.start();

        recognition.onresult = (event: any) => {
            const transcript = event.results[0][0].transcript;
            setInputValue(transcript);
        };

        recognition.onerror = () => {
            const fallback = createMessage(getNextId(), dontRecognizeSpeechText, 'bot');

            setIsListening(false);
            setShowFallbackPrompts(true);
            setMessages((prev) => [...prev, fallback]);
        };

        recognition.onend = () => {
            setIsListening(false);
            recognitionRef.current = null;
        };
    };

    const handleVoiceInputClick = () => {
        if (inputValue.trim()) {
            handleSend();
            return;
        }

        handleVoiceInput();
    };

    const handlePromptClick = (prompt: string) => {
        setShowFallbackPrompts(false);
        setIsMoreMenuOpen(false);

        const userMessage = createMessage(getNextId(), prompt, 'user');

        setMessages((prev) => [...prev, userMessage]);
        setIsTyping(true);

        setTimeout(() => {
            const botReply = createMessage(getNextId(), promptReplies[prompt], 'bot');

            setIsTyping(false);
            setMessages((prev) => [...prev, botReply]);
        }, 700);
    };

    const handleKeyDown: React.KeyboardEventHandler<HTMLInputElement> = (event) => {
        if (event.key === 'Enter') handleSend();
    };

    return (
        <div className="chatbot">
            {!isOpen && (
                <button type="button" className="chatbot__launcher" onClick={handleOpenChat}>
                    <img src={chatLauncherIcon} alt="Open chat" width={115} />
                </button>
            )}

            <div className={`chatbot__panel ${isExpanded ? 'chatbot__panel--expanded' : ''}`} data-open={isOpen}>
                <div className="chatbot__header">
                    <div className="chatbot__title-group">
                        <img src={agentIcon} alt="Agent icon" width={28} />
                        <span className="chatbot__title">Team PepsiCo Agent</span>
                    </div>

                    <div className="chatbot__header-actions">
                        <div className="chatbot__menu-wrap">
                            <button type="button" onClick={() => setIsMoreMenuOpen((prev) => !prev)}>
                                <img src={dotsIcon} alt="More options" width={16.8} />
                            </button>

                            {isMoreMenuOpen && (
                                <div className="chatbot__menu">
                                    <button type="button" onClick={handleClearChat}>
                                        Clear chat
                                    </button>
                                </div>
                            )}
                        </div>

                        <button type="button" onClick={() => setIsExpanded((prev) => !prev)}>
                            <img src={expandIcon} alt="Expand" width={16.8} />
                        </button>

                        <button
                            type="button"
                            onClick={() => {
                                setIsMoreMenuOpen(false);
                                setIsOpen(false);
                            }}
                        >
                            <img src={hideIcon} alt="Hide chat" width={16.8} />
                        </button>
                    </div>
                </div>

                <div className="chatbot__messages" ref={messagesRef}>
                    {messages.map((message) => (
                        <div key={message.id} className={`chatbot__message-wrap--${message.sender}`}>
                            <div className={`chatbot__message--${message.sender}`}>{message.text}</div>

                            <div className="chatbot__meta">{message.meta}</div>
                        </div>
                    ))}

                    {isTyping && (
                        <div className="chatbot__message-wrap--bot">
                            <div className="chatbot__message--bot">
                                <img src={dotsIcon} alt="Typing" width={28} />
                            </div>
                        </div>
                    )}

                    {(messages.length === 1 || showFallbackPrompts) && !isTyping && (
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
                </div>

                <div className="chatbot__footer">
                    <div className="chatbot__input-wrap">
                        <img src={plusIcon} alt="plus" width={16} />

                        <input
                            value={inputValue}
                            onChange={(event) => setInputValue(event.target.value)}
                            onKeyDown={handleKeyDown}
                            className="chatbot__input"
                        />

                        <button type="button" onClick={handleVoiceInputClick}>
                            <img
                                src={voiceIcon}
                                alt="voice icon"
                                className={isListening ? 'chatbot__voice-btn--active' : ''}
                                width={18}
                            />
                        </button>
                    </div>

                    <div className="chatbot__powered-by">
                        Powered by
                        <img src={agentforceIcon} alt="Agentforce" />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ChatBot;
