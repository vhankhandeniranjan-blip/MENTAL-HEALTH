(() => {
    const launcher = document.getElementById('chatbot-launcher');
    const panel = document.getElementById('chatbot-panel');
    const closeButton = document.getElementById('chatbot-close');
    const form = document.getElementById('chatbot-form');
    const input = document.getElementById('chatbot-input');
    const sendButton = document.getElementById('chatbot-send');
    const messagesEl = document.getElementById('chatbot-messages');
    const prompts = document.getElementById('chatbot-quick-prompts');
    if (!launcher || !panel || !form || !input || !messagesEl) return;

    const crisisPattern = /\b(suicid(?:e|al)|kill myself|end my life|hurt myself|harm myself|self[- ]?harm|don't want to live|do not want to live|want to die|better off dead|can't keep myself safe|cannot keep myself safe)\b/i;
    const urgentReply = 'I’m really glad you told me. You deserve support right now, and you should not have to handle this alone. Please go to a trusted adult now (such as a parent, guardian, teacher or school counsellor) and tell them clearly that you need help staying safe. Stay with that adult. If there is immediate danger in India, call 112 or go to the nearest emergency department with an adult. You can also call Tele-MANAS at 14416 for mental-health support. This chatbot is not monitored and cannot provide emergency care.';

    const topics = [
        {
            id: 'exam',
            words: ['exam', 'exams', 'test', 'revision', 'study', 'studying', 'marks', 'grades', 'homework', 'syllabus', 'study pressure', 'fear of failing'],
            reply: 'Exam pressure can feel heavy, but you do not have to solve everything at once. Try this small plan:\n\n1. Pick one topic to work on for 20–25 minutes.\n2. Take a short water or stretch break.\n3. Test yourself with a few questions instead of only rereading.\n4. Write down the next tiny task.\n\nA mark does not define your worth. What subject or topic feels hardest right now?'
        },
        {
            id: 'stress',
            words: ['stress', 'stressed', 'overwhelmed', 'pressure', 'too much', 'tension', 'worried', 'worry', 'nervous'],
            reply: 'I’m sorry things feel stressful. Here are a few gentle things you can try:\n\n• Pause and take a few slow, comfortable breaths.\n• Choose one small task rather than everything at once.\n• Drink some water and take a short break.\n• Talk with someone you trust about what is weighing on you.\n\nWould you like help with school pressure, family expectations, or something else?'
        },
        {
            id: 'anxiety',
            words: ['anxious', 'anxiety', 'panic', 'panicking', 'scared', 'fear', 'afraid', 'racing thoughts'],
            reply: 'That sounds uncomfortable. You could try a simple grounding exercise: notice 5 things you can see, 4 things you can feel, and 3 things you can hear. Let your breathing stay gentle; there is no need to force it. If this keeps happening or feels hard to manage, tell a trusted adult and consider speaking with a health professional. What situation is bringing this feeling up?'
        },
        {
            id: 'sad',
            words: ['sad', 'unhappy', 'low', 'down', 'lonely', 'empty', 'cry', 'crying', 'upset', 'hopeless'],
            reply: 'I’m sorry you’re having a difficult time. You do not need to pretend to be okay. It may help to talk with a trusted person, spend a little time on a comforting activity, or write down what you wish someone understood. If these feelings continue or become overwhelming, please tell a trusted adult. Would you like to share what has been making things difficult?'
        },
        {
            id: 'friendship',
            words: ['friend', 'friends', 'friendship', 'best friend', 'argument', 'fight', 'ignored', 'left out', 'betrayed'],
            reply: 'Friendship problems can hurt. If it feels safe, try talking when both of you are calm. Use “I felt…” statements, explain one specific thing that bothered you, and listen to their side too. You can care about someone while still setting respectful boundaries. If you are being threatened or repeatedly mistreated, speak to a trusted adult. What happened between you and your friend?'
        },
        {
            id: 'bullying',
            words: ['bully', 'bullying', 'teasing', 'teased', 'mock', 'mocking', 'harass', 'threatened', 'threatening'],
            reply: 'You do not deserve to be bullied, and it is not your fault. Please tell a trusted adult, such as a parent, teacher or school counsellor. If it is happening at school, ask the adult to help you make a safety plan. You do not have to handle it alone or confront the person by yourself. Is this happening at school or online? Please do not share names or identifying details here.'
        },
        {
            id: 'anger',
            words: ['angry', 'anger', 'mad', 'furious', 'irritated', 'annoyed', 'frustrated'],
            reply: 'Strong feelings happen to everyone. If you can, pause the conversation, give yourself a little space, and take a few slow breaths. When you feel calmer, describe what bothered you without insults or threats. If you are worried you might lose control, move to a safe place and ask a trusted adult for help. What triggered the frustration?'
        },
        {
            id: 'sleep',
            words: ['sleep', 'sleeping', 'insomnia', 'tired', 'fatigue', "can't sleep", 'cannot sleep', 'sleepy'],
            reply: 'A steady routine can support better rest. You might try keeping a similar bedtime, dimming screens before bed, avoiding late caffeine, and doing something quiet like reading. If sleep problems continue or affect your day, tell a trusted adult and speak with a health professional. Is it hard to fall asleep, or do you wake up often?'
        },
        {
            id: 'habits',
            words: ['healthy habits', 'routine', 'exercise', 'fitness', 'water', 'hydration', 'break', 'screen time', 'phone addiction'],
            reply: 'Healthy habits work best when they are small and realistic. You could start with regular meals, drinking water, some enjoyable movement, short screen breaks, enough rest, and time with people you trust. You do not need a perfect routine. Which one small habit would you like to build first?'
        },
        {
            id: 'confidence',
            words: ['confidence', 'self esteem', 'self-esteem', 'compare', 'comparison', 'failure', 'fail', 'not good enough'],
            reply: 'It is easy to compare yourself with others, but everyone has a different pace and strengths. Try noticing one thing you learned or handled today, even if it was small. Set a goal based on your own progress rather than someone else’s results. What is one situation where you wish you felt more confident?'
        },
        {
            id: 'support_friend',
            words: ['help a friend', 'support a friend', 'friend is sad', 'friend is upset', 'someone is sad', 'someone upset', 'my friend feels'],
            reply: 'A helpful first step is to listen without judging or rushing to fix things. You can say, “I’m here to listen. Would you like to talk or would you prefer some company?” Encourage your friend to speak with a trusted adult too. If they may be in immediate danger, tell a trusted adult right away rather than keeping it secret.'
        },
        {
            id: 'family',
            words: ['parents', 'mother', 'father', 'family', 'home', 'expectations', 'pressure at home'],
            reply: 'Family disagreements and expectations can feel difficult. If it feels safe, choose a calm moment and explain how you feel using clear “I” statements. You could also ask a trusted relative, teacher or school counsellor to help you talk it through. If you feel unsafe at home, reach out to a trusted adult outside the situation.'
        },
        {
            id: 'thanks',
            words: ['thank you', 'thanks', 'thx', 'that helped'],
            reply: 'You’re welcome. I’m glad this was useful. Remember, you deserve support from people you trust too. You can ask me another general wellbeing question whenever you like.'
        },
        {
            id: 'greeting',
            words: ['hello', 'hi', 'hey', 'good morning', 'good evening'],
            reply: 'Hi! 👋 I can share simple ideas about exam stress, emotions, friendships, bullying, sleep and healthy habits. What would you like help thinking through today?'
        }
    ];

    const fallbackReplies = [
        'I want to make sure I understand. Is this mainly about school, friendships, family, emotions, or daily habits?',
        'Thanks for sharing that. I may not have a ready-made answer for every situation, but I can help you think through a safe next step. What part feels most important right now?',
        'Could you tell me a little more about what kind of support you want—some practical ideas, help planning a conversation, or just a calm place to organise your thoughts? Please avoid sharing names or private details.'
    ];

    function setOpen(open) {
        panel.hidden = !open;
        launcher.setAttribute('aria-expanded', String(open));
        launcher.setAttribute('aria-label', open ? 'Close Mind Matters chatbot' : 'Open Mind Matters chatbot');
        if (open) input.focus(); else launcher.focus();
    }
    launcher.addEventListener('click', () => setOpen(panel.hidden));
    if (closeButton) closeButton.addEventListener('click', () => setOpen(false));

    function addMessage(text, role) {
        const bubble = document.createElement('div');
        bubble.className = `chat-message ${role === 'user' ? 'user-message' : 'assistant-message'}`;
        const paragraph = document.createElement('p');
        paragraph.textContent = text;
        bubble.appendChild(paragraph);
        messagesEl.appendChild(bubble);
        messagesEl.scrollTop = messagesEl.scrollHeight;
        return bubble;
    }

    function normalize(text) {
        return text.toLowerCase().replace(/[’']/g, "'").replace(/[^a-z0-9\s-]/g, ' ').replace(/\s+/g, ' ').trim();
    }

    function getReply(message) {
        if (crisisPattern.test(message)) return urgentReply;
        const clean = normalize(message);
        let bestTopic = null;
        let bestScore = 0;
        for (const topic of topics) {
            let score = 0;
            for (const word of topic.words) {
                const term = normalize(word);
                if (term && (` ${clean} `).includes(` ${term} `)) score += term.includes(' ') ? 3 : 1;
            }
            if (score > bestScore) {
                bestScore = score;
                bestTopic = topic;
            }
        }
        if (bestTopic) return bestTopic.reply;
        return fallbackReplies[Math.floor(Math.random() * fallbackReplies.length)];
    }

    function sendMessage(message) {
        const clean = message.trim();
        if (!clean || clean.length > 1200 || sendButton.disabled) return;
        addMessage(clean, 'user');
        input.value = '';
        input.style.height = 'auto';
        if (prompts) prompts.hidden = true;

        const typing = document.createElement('div');
        typing.className = 'chat-message assistant-message chatbot-typing';
        typing.textContent = 'Thinking…';
        messagesEl.appendChild(typing);
        messagesEl.scrollTop = messagesEl.scrollHeight;
        sendButton.disabled = true;

        // A short pause makes the scripted response feel conversational; no network or API call is made.
        window.setTimeout(() => {
            typing.remove();
            addMessage(getReply(clean), 'assistant');
            sendButton.disabled = false;
            input.focus();
        }, 350);
    }

    form.addEventListener('submit', event => {
        event.preventDefault();
        sendMessage(input.value);
    });
    input.addEventListener('input', () => {
        input.style.height = 'auto';
        input.style.height = `${Math.min(input.scrollHeight, 90)}px`;
    });
    input.addEventListener('keydown', event => {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            form.requestSubmit();
        }
    });
    if (prompts) prompts.addEventListener('click', event => {
        const button = event.target.closest('button[data-prompt]');
        if (button) sendMessage(button.dataset.prompt);
    });
})();
