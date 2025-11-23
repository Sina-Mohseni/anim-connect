// ============================================
// SYSTÈME DE CHAT AVEC LES PERSONAS
// ============================================

const Chat = {
    // Ouvrir le chat avec un persona
    open(persona, projectId) {
        const chatModal = document.getElementById('chat-modal');
        if (!chatModal) return;

        // Fermer le modal de projet
        Modal.close();

        // Initialiser le contexte du chat
        STATE.chat.currentPersona = persona;
        STATE.chat.projectContext = STATE.data.projects.find(p => p.id === projectId);
        STATE.chat.messages = [];

        // Afficher les informations du persona
        this.displayPersonaInfo();

        // Vider les messages précédents
        const messagesContainer = document.getElementById('chat-messages');
        if (messagesContainer) {
            messagesContainer.innerHTML = '';
        }

        // Ajouter le message de bienvenue
        const greeting = CONFIG.PERSONA_GREETINGS[persona.id] || `Bonjour ! Je suis ${persona.name}. Comment puis-je t'aider ?`;
        this.addMessage(greeting, false);

        // Configurer l'input
        this.setupChatInput();

        // Ouvrir le modal
        chatModal.classList.add('active');

        // Focus sur l'input
        setTimeout(() => {
            const input = document.getElementById('chat-input');
            if (input) input.focus();
        }, 300);
    },

    // Afficher les informations du persona
    displayPersonaInfo() {
        const infoContainer = document.querySelector('.chat-persona-info');
        if (!infoContainer) return;

        const persona = STATE.chat.currentPersona;

        infoContainer.innerHTML = `
            <div class="chat-persona-avatar">${persona.avatar}</div>
            <div class="chat-persona-details">
                <h3>${persona.name}</h3>
                <p>${persona.role}</p>
            </div>
        `;
    },

    // Configurer l'input du chat
    setupChatInput() {
        const input = document.getElementById('chat-input');
        const sendBtn = document.getElementById('chat-send');

        if (!input || !sendBtn) return;

        // Envoyer avec le bouton
        sendBtn.onclick = () => this.sendMessage();

        // Envoyer avec Enter
        input.onkeypress = (e) => {
            if (e.key === 'Enter') {
                this.sendMessage();
            }
        };
    },

    // Envoyer un message
    sendMessage() {
        const input = document.getElementById('chat-input');
        if (!input) return;

        const message = input.value.trim();
        if (!message) return;

        // Ajouter le message de l'utilisateur
        this.addMessage(message, true);

        // Vider l'input
        input.value = '';

        // Simuler une réponse du persona
        setTimeout(() => {
            this.generateResponse(message);
        }, CONFIG.CHAT.responseDelay);
    },

    // Ajouter un message
    addMessage(text, isUser) {
        const messagesContainer = document.getElementById('chat-messages');
        if (!messagesContainer) return;

        const messageDiv = document.createElement('div');
        messageDiv.className = `chat-message${isUser ? ' user' : ''}`;

        const avatar = document.createElement('div');
        avatar.className = 'message-avatar';
        avatar.textContent = isUser ? '👤' : STATE.chat.currentPersona.avatar;

        const content = document.createElement('div');
        content.className = 'message-content';

        const messageText = document.createElement('div');
        messageText.className = 'message-text';
        messageText.textContent = text;

        const time = document.createElement('div');
        time.className = 'message-time';
        time.textContent = Utils.formatTime();

        content.appendChild(messageText);
        content.appendChild(time);

        messageDiv.appendChild(avatar);
        messageDiv.appendChild(content);

        messagesContainer.appendChild(messageDiv);

        // Scroll vers le bas
        messagesContainer.scrollTop = messagesContainer.scrollHeight;

        // Sauvegarder le message
        STATE.chat.messages.push({
            text,
            isUser,
            time: Utils.formatTime()
        });
    },

    // Générer une réponse du persona
    generateResponse(userMessage) {
        const persona = STATE.chat.currentPersona;
        const project = STATE.chat.projectContext;

        // Déterminer le type de question
        const lowerMessage = userMessage.toLowerCase();

        let response = '';

        // Réponses contextuelles basées sur le persona et le projet
        if (lowerMessage.includes('difficulté') || lowerMessage.includes('difficile') || lowerMessage.includes('facile')) {
            response = `Le projet "${project.name}" propose trois niveaux de difficulté. En mode facile : ${project.difficulty.facile}. En mode normal : ${project.difficulty.normal}. Et en mode difficile : ${project.difficulty.difficile}. Quel niveau te tente le plus ?`;
        } else if (lowerMessage.includes('durée') || lowerMessage.includes('temps') || lowerMessage.includes('combien')) {
            response = `Ce projet dure environ ${project.duration} et peut accueillir ${project.players}. C'est parfait pour une session immersive !`;
        } else if (lowerMessage.includes('règle') || lowerMessage.includes('comment') || lowerMessage.includes('joue')) {
            if (project.content.rules) {
                response = `Les règles de "${project.name}" sont basées sur le système Hourglass Project, avec quelques spécificités. ${project.content.rules.text.substring(0, 200)}... Tu veux que je t'en dise plus ?`;
            } else {
                response = `Les règles suivent le système de base Hourglass Project avec des ajouts spécifiques à ce projet. Je peux t'expliquer les mécaniques principales si tu veux !`;
            }
        } else if (lowerMessage.includes('matériel') || lowerMessage.includes('besoin') || lowerMessage.includes('préparation')) {
            if (project.content.setup) {
                response = `Pour la mise en place de "${project.name}", tu auras besoin de préparer quelques éléments. ${project.content.setup.text.substring(0, 200)}... C'est assez simple à organiser !`;
            } else {
                response = `La préparation nécessite du matériel de base plus quelques éléments thématiques. Je peux te guider dans la liste complète si tu veux !`;
            }
        } else if (lowerMessage.includes('histoire') || lowerMessage.includes('scénario') || lowerMessage.includes('contexte')) {
            if (project.content.scenario) {
                response = `L'histoire de "${project.name}" est fascinante ! ${project.content.scenario.text.substring(0, 200)}... L'ambiance est vraiment immersive !`;
            } else {
                response = `Le scénario de ce projet est captivant ! Il place les joueurs dans une situation unique où chaque décision compte. Tu veux en savoir plus sur l'univers ?`;
            }
        } else if (lowerMessage.includes('persona') || lowerMessage.includes('qui') || lowerMessage.includes('toi')) {
            response = `Je suis ${persona.name}, ${persona.role}. ${persona.description} Mon expertise est parfaite pour ce type de projet !`;
        } else if (lowerMessage.includes('conseil') || lowerMessage.includes('recommande') || lowerMessage.includes('astuce')) {
            response = this.getPersonaAdvice(persona, project);
        } else if (lowerMessage.includes('merci') || lowerMessage.includes('thanks')) {
            response = `Avec plaisir ! N'hésite pas si tu as d'autres questions sur "${project.name}". Je suis là pour t'aider à organiser la meilleure expérience possible ! 🎮`;
        } else {
            response = this.getDefaultResponse(persona, project);
        }

        this.addMessage(response, false);
    },

    // Obtenir un conseil personnalisé selon le persona
    getPersonaAdvice(persona, project) {
        const advices = {
            'marcus-aventurier': `Pour "${project.name}", je te conseille de bien préparer les défis physiques et de créer une ambiance dynamique. L'action doit être au cœur de l'expérience !`,
            'liora-mysterieuse': `Mon conseil pour "${project.name}" : crée du suspense, laisse planer le mystère. Les énigmes doivent être intrigantes mais résolubles. L'ambiance est cruciale !`,
            'kai-stratege': `Pour ce projet, assure-toi que les choix stratégiques ont du poids. Chaque décision doit avoir des conséquences. La planification est la clé !`,
            'nova-scientifique': `Je recommande d'intégrer des éléments réalistes et crédibles dans "${project.name}". La cohérence scientifique renforce l'immersion !`,
            'theo-conteur': `L'histoire doit captiver dès le début. Pour "${project.name}", soigne la narration, les descriptions, et laisse les joueurs devenir les héros de leur propre légende !`,
            'zara-artiste': `L'esthétique est primordiale ! Pour "${project.name}", investis dans la décoration, l'éclairage, les détails visuels. L'ambiance visuelle fait 50% du travail !`,
            'rex-guide': `Mon conseil : structure bien le parcours. Les joueurs doivent toujours savoir où ils en sont dans "${project.name}". La clarté est essentielle !`,
            'elena-educatrice': `Profite de "${project.name}" pour intégrer des apprentissages ludiques. Les joueurs vont adorer apprendre sans s'en rendre compte !`,
            'axel-explorateur': `Laisse de la place à l'exploration libre dans "${project.name}". Les découvertes spontanées sont souvent les plus mémorables !`,
            'maya-enthousiaste': `L'énergie est contagieuse ! Pour "${project.name}", reste enthousiaste, encourage les joueurs, célèbre chaque réussite. L'ambiance positive est garantie !`
        };

        return advices[persona.id] || `Mon conseil : prépare bien "${project.name}" et adapte-le à ton groupe. L'important c'est que tout le monde s'amuse !`;
    },

    // Réponse par défaut
    getDefaultResponse(persona, project) {
        const responses = [
            `C'est une bonne question ! Pour "${project.name}", je pense que ${persona.expertise || 'mon approche'} peut vraiment faire la différence. Tu veux que je t'en dise plus ?`,
            `Intéressant ! Dans le contexte de "${project.name}", je dirais que c'est un aspect important à considérer. Qu'est-ce qui t'intéresse particulièrement ?`,
            `Ah, je vois où tu veux en venir ! Pour ce projet, ${persona.personality || 'mon expérience'} me fait dire que c'est un point clé. Des questions plus spécifiques ?`,
            `Super question ! "${project.name}" offre beaucoup de possibilités. Je peux t'en parler sous différents angles : règles, ambiance, préparation... Qu'est-ce qui t'intéresse ?`
        ];

        return responses[Math.floor(Math.random() * responses.length)];
    },

    // Fermer le chat
    close() {
        const chatModal = document.getElementById('chat-modal');
        if (chatModal) {
            chatModal.classList.remove('active');
        }

        // Réinitialiser l'état du chat
        STATE.chat.currentPersona = null;
        STATE.chat.projectContext = null;
        STATE.chat.messages = [];
    }
};
