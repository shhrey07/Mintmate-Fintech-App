import { useState, useRef, useEffect } from 'react'
import * as P from '@phosphor-icons/react'
import { Button, Field, inputCls, cx, Money } from './ui'
import { useApp, CATS, CAT_LABEL, type Cat } from './store'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
  suggestions?: string[]
}

const AI_RESPONSES: Record<string, string[]> = {
  greeting: [
    "Hi! I'm your MintMate AI assistant. I can help you plan your budget, track spending, and give personalized financial advice. What would you like help with?",
    "Hello! I'm here to help you manage your money better. Ask me anything about budgeting, savings, or your spending habits!",
    "Hey there! Ready to take control of your finances? I can help with budget planning, expense tracking, and smart money tips."
  ],
  budget: [
    "Great question! Based on your income of ₹{income}, I recommend following the 50/30/20 rule: 50% for needs, 30% for wants, and 20% for savings. Would you like me to break this down for you?",
    "Let me help you optimize your budget! With ₹{income} monthly income, you're currently spending {spent}%. I suggest allocating more to {category} and cutting back on {overspent}.",
    "Smart thinking! Your current budget looks {status}. To improve, try setting aside ₹{amount} for savings first, then allocate the rest across categories."
  ],
  saving: [
    "Excellent goal! To save ₹{target}, you need to set aside ₹{monthly} per month. I can help you find areas to cut back. Shall we review your spending?",
    "Saving is smart! Start with small wins - try the 52-week challenge or automate ₹{amount} monthly transfers. Even ₹100/day adds up to ₹3000/month!",
    "Love the savings mindset! Based on your spending pattern, you can save an extra ₹{amount} by reducing {category} expenses. Want specific tips?"
  ],
  overspending: [
    "I notice you're spending a lot on {category}. Here are 3 ways to cut back: 1) Set a weekly limit, 2) Use cash instead of cards, 3) Find free alternatives. Which sounds doable?",
    "You're {percent}% over budget on {category}. Let's fix this! Try the envelope method - allocate ₹{amount} for the week and stick to it. I'll remind you!",
    "Overspending happens! For {category}, try meal prep (saves 40%), use public transport, or the 30-day rule for non-essentials. Small changes = big savings!"
  ],
  motivation: [
    "You're doing amazing! You've saved ₹{saved} this month. Keep it up! Remember, every rupee saved is a rupee earned. 💪",
    "Great progress! You're {percent}% on track to hit your goal. Small consistent steps lead to big financial wins. You've got this!",
    "Proud of you! You've stayed within budget for {days} days. That's discipline! Keep making smart money choices. 🎉"
  ]
}

export default function AIAssistant() {
  const { m, profile, toast } = useApp()
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: AI_RESPONSES.greeting[Math.floor(Math.random() * AI_RESPONSES.greeting.length)],
      timestamp: new Date(),
      suggestions: [
        "Help me plan my budget",
        "How can I save more?",
        "Analyze my spending",
        "Give me money tips"
      ]
    }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const generateResponse = (userMessage: string): { content: string; suggestions?: string[] } => {
    const msg = userMessage.toLowerCase()
    const spent = m.spent
    const budget = m.budget
    const spentPercent = Math.round((spent / budget) * 100)
    const topCategory = CATS.reduce((a, b) => m.byCat[a] > m.byCat[b] ? a : b)
    const overspentCat = CATS.find(c => m.byCat[c] > (budget * 0.4))

    // Budget planning
    if (msg.includes('budget') || msg.includes('plan') || msg.includes('allocate')) {
      const status = m.status === 'healthy' ? 'healthy' : m.status === 'warning' ? 'tight but manageable' : 'over budget'
      return {
        content: AI_RESPONSES.budget[1]
          .replace('{income}', profile.income.toString())
          .replace('{spent}', spentPercent.toString())
          .replace('{category}', CAT_LABEL[topCategory])
          .replace('{overspent}', overspentCat ? CAT_LABEL[overspentCat] : 'Entertainment')
          .replace('{status}', status),
        suggestions: [
          "Show me the 50/30/20 rule",
          "Help me cut expenses",
          "Set up automatic savings"
        ]
      }
    }

    // Savings
    if (msg.includes('save') || msg.includes('saving')) {
      const remaining = m.remaining
      const canSave = Math.max(0, remaining - m.unpaid - (m.daysLeft * 200))
      return {
        content: AI_RESPONSES.saving[1]
          .replace('{amount}', canSave.toString())
          .replace('{target}', '5000')
          .replace('{monthly}', Math.round(canSave).toString()),
        suggestions: [
          "52-week savings challenge",
          "Find hidden expenses",
          "Automate my savings"
        ]
      }
    }

    // Spending analysis
    if (msg.includes('spending') || msg.includes('expense') || msg.includes('analyze')) {
      if (overspentCat) {
        const overAmount = m.byCat[overspentCat]
        const percent = Math.round((overAmount / budget) * 100)
        return {
          content: AI_RESPONSES.overspending[0]
            .replace('{category}', CAT_LABEL[overspentCat])
            .replace('{percent}', percent.toString())
            .replace('{amount}', Math.round(overAmount * 0.3).toString()),
          suggestions: [
            `Reduce ${CAT_LABEL[overspentCat]}`,
            "Track daily expenses",
            "Set spending alerts"
          ]
        }
      }
      return {
        content: `Your spending looks good! You've used ${spentPercent}% of your budget. Top category is ${CAT_LABEL[topCategory]} at ₹${m.byCat[topCategory]}. Want tips to optimize further?`,
        suggestions: [
          "Ways to save on " + CAT_LABEL[topCategory],
          "Set category limits",
          "Monthly spending report"
        ]
      }
    }

    // Motivation & tips
    if (msg.includes('tip') || msg.includes('advice') || msg.includes('help')) {
      return {
        content: `Here are 3 smart money tips for you:\n\n1. 💰 Pay yourself first - Save ₹${Math.round(budget * 0.1)} before any expense\n2. 🎯 Use the 30-day rule - Wait 30 days before big purchases\n3. 📊 Review weekly - Check your budget every Sunday\n\nWhich one will you try first?`,
        suggestions: [
          "More money tips",
          "Help me stick to budget",
          "Track my progress"
        ]
      }
    }

    // Goals
    if (msg.includes('goal')) {
      return {
        content: `Setting financial goals is smart! Here's a framework:\n\n📍 Short-term (1-3 months): Emergency fund ₹${budget * 2}\n🎯 Mid-term (3-12 months): Laptop, trip, or course\n🚀 Long-term (1+ years): Bigger purchases or investments\n\nWhat's your priority?`,
        suggestions: [
          "Create emergency fund",
          "Plan a big purchase",
          "Start investing basics"
        ]
      }
    }

    // Default helpful response
    return {
      content: `I can help you with:\n\n💰 Budget Planning - Optimize your ₹${budget} income\n📊 Spending Analysis - Track where your money goes\n🎯 Savings Goals - Reach your financial targets\n💡 Money Tips - Smart strategies for your situation\n\nWhat would you like to know?`,
      suggestions: [
        "Plan my budget",
        "Analyze spending",
        "Set savings goal",
        "Get money tips"
      ]
    }
  }

  const handleSend = async (messageText?: string) => {
    const text = messageText || input.trim()
    if (!text) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setLoading(true)
    setIsTyping(true)

    // Simulate AI thinking delay
    setTimeout(() => {
      const response = generateResponse(text)
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response.content,
        timestamp: new Date(),
        suggestions: response.suggestions
      }
      setMessages(prev => [...prev, aiMessage])
      setLoading(false)
      setIsTyping(false)
    }, 1500)
  }

  const handleSuggestion = (suggestion: string) => {
    handleSend(suggestion)
  }

  const clearChat = () => {
    setMessages([{
      id: '1',
      role: 'assistant',
      content: "Chat cleared! Ready for a fresh start. What would you like help with?",
      timestamp: new Date(),
      suggestions: [
        "Help me plan my budget",
        "How can I save more?",
        "Analyze my spending",
        "Give me money tips"
      ]
    }])
    toast('Chat history cleared', { tone: 'ok' })
  }

  return (
    <div className="flex h-[calc(100vh-200px)] flex-col">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary-hover">
              <P.Robot size={24} weight="bold" className="text-primary-fg" />
            </div>
            <div className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full border-2 border-bg bg-green-500 animate-pulse" />
          </div>
          <div>
            <h2 className="font-semibold">AI Budget Assistant</h2>
            <p className="text-xs text-muted">Always here to help you save!</p>
          </div>
        </div>
        <button
          onClick={clearChat}
          className="flex h-9 items-center gap-2 rounded-lg border border-line px-3 text-sm font-semibold text-muted hover:bg-surface2 hover:text-ink"
        >
          <P.Trash size={16} />
          Clear
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto rounded-xl border border-line bg-surface p-4 space-y-4">
        {messages.map((msg, idx) => (
          <div
            key={msg.id}
            className={cx(
              'rise flex gap-3 animate-in fade-in slide-in-from-bottom-4',
              msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'
            )}
            style={{ animationDelay: `${idx * 0.05}s` }}
          >
            <div className={cx(
              'flex h-8 w-8 shrink-0 items-center justify-center rounded-full',
              msg.role === 'assistant' 
                ? 'bg-primary-soft text-primary' 
                : 'bg-surface2 text-ink'
            )}>
              {msg.role === 'assistant' ? (
                <P.Robot size={18} weight="bold" />
              ) : (
                <P.User size={18} weight="bold" />
              )}
            </div>
            <div className={cx(
              'flex-1 space-y-2',
              msg.role === 'user' ? 'flex flex-col items-end' : ''
            )}>
              <div className={cx(
                'inline-block max-w-[85%] rounded-2xl px-4 py-2.5 text-sm whitespace-pre-line',
                msg.role === 'assistant'
                  ? 'bg-surface2 text-ink rounded-tl-sm'
                  : 'bg-primary text-primary-fg rounded-tr-sm'
              )}>
                {msg.content}
              </div>
              {msg.suggestions && msg.role === 'assistant' && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {msg.suggestions.map((suggestion, i) => (
                    <button
                      key={i}
                      onClick={() => handleSuggestion(suggestion)}
                      className="inline-flex items-center gap-1 rounded-full border border-line bg-surface px-3 py-1.5 text-xs font-medium text-muted hover:border-primary hover:bg-primary-soft hover:text-primary transition-all duration-200"
                    >
                      <P.Sparkle size={12} weight="fill" />
                      {suggestion}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex gap-3 animate-in fade-in">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary-soft text-primary">
              <P.Robot size={18} weight="bold" />
            </div>
            <div className="inline-flex items-center gap-1 rounded-2xl rounded-tl-sm bg-surface2 px-4 py-3">
              <div className="flex gap-1">
                <span className="h-2 w-2 animate-bounce rounded-full bg-primary [animation-delay:-0.3s]"></span>
                <span className="h-2 w-2 animate-bounce rounded-full bg-primary [animation-delay:-0.15s]"></span>
                <span className="h-2 w-2 animate-bounce rounded-full bg-primary"></span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Stats */}
      <div className="my-3 grid grid-cols-3 gap-2">
        <div className="rounded-lg bg-primary-soft p-2 text-center">
          <p className="text-xs text-muted">Budget Left</p>
          <p className="font-bold text-primary"><Money v={m.remaining} /></p>
        </div>
        <div className="rounded-lg bg-surface2 p-2 text-center">
          <p className="text-xs text-muted">Safe/Day</p>
          <p className="font-bold text-ink"><Money v={m.safe} /></p>
        </div>
        <div className="rounded-lg bg-surface2 p-2 text-center">
          <p className="text-xs text-muted">Days Left</p>
          <p className="font-bold text-ink">{m.daysLeft}</p>
        </div>
      </div>

      {/* Input */}
      <form
        onSubmit={(e) => {
          e.preventDefault()
          handleSend()
        }}
        className="flex gap-2"
      >
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask me anything about budgeting..."
          className={cx(inputCls, 'flex-1')}
          disabled={loading}
        />
        <Button
          type="submit"
          disabled={!input.trim() || loading}
          className="shrink-0"
          icon={loading ? undefined : P.PaperPlaneRight}
          loading={loading}
        >
          Send
        </Button>
      </form>
    </div>
  )
}
