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

    const conversation = [];
    const maxTurns = 10;
    const crisisPattern = /\b(suicid(?:e|al)|kill myself|end my life|hurt myself|harm myself|self[- ]?harm|don't want to live|do not want to live|can't keep myself safe|cannot keep myself safe)\b/i;

    function setOpen(open) {
        panel.hidden = !open;
        launcher.setAttribute('aria-expanded', String(open));
        launcher.setAttribute('aria-label', open ? 'Close Mind Matters chatbot' : 'Open Mind Matters chatbot');
        if (open) input.focus(); else launcher.focus();
    }
    launcher.addEventListener('click', () => setOpen(panel.hidden));
    closeButton.addEventListener('click', () => setOpen(false));

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

    const urgentReply = 'I’m really glad you told me. You deserve support right now, and you should not have to handle this alone. Please go to a trusted adult now (such as a parent, guardian, teacher or school counsellor) and tell them clearly that you may not be safe. If there is immediate danger, call India’s emergency number 112 or go to the nearest emergency department with an adult. You can also call Tele-MANAS at 14416 for mental-health support. I’m an AI assistant, so I cannot provide emergency care.';

    async function sendMessage(message) {
        const clean = message.trim();
        if (!clean || clean.length > 1200) return;
        addMessage(clean, 'user');
        input.value = '';
        input.style.height = 'auto';
        if (prompts) prompts.hidden = true;

        if (crisisPattern.test(clean)) {
            addMessage(urgentReply, 'assistant');
            conversation.push({ role: 'user', content: clean }, { role: 'assistant', content: urgentReply });
            return;
        }

        const history = conversation.slice(-maxTurns * 2);
        const typing = document.createElement('div');
        typing.className = 'chat-message assistant-message chatbot-typing';
        typing.textContent = 'Thinking…';
        messagesEl.appendChild(typing);
        messagesEl.scrollTop = messagesEl.scrollHeight;
        sendButton.disabled = true;

        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ messages: [...history, { role: 'user', content: clean }] })
            });
            const data = await response.json().catch(() => ({}));
            if (!response.ok) throw new Error(data.error || 'The assistant is unavailable right now. Please try again later.');
            const answer = typeof data.reply === 'string' ? data.reply : 'I’m sorry, I could not prepare a reply. Please try again.';
            typing.remove();
            addMessage(answer, 'assistant');
            conversation.push({ role: 'user', content: clean }, { role: 'assistant', content: answer });
        } catch (error) {
            typing.remove();
            addMessage(error.message || 'I could not connect just now. Please try again in a moment.', 'assistant');
        } finally {
            sendButton.disabled = false;
            input.focus();
        }
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
