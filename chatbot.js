
/**
 * ChatBot Ateliê Ki Fofa
 * Integração com Base de Dados + Ajuste Dinâmico com Banner de Cookies
 */


function initChatbot(config = {}) {
  // 1. BASE DE DADOS JSON INTEGRADA
  const botData = {
    "bot_metadata": {
      "bot_name": "Assistente Ki Fofa",
      "version": "1.0.0",
      "business_name": "Ateliê Ki Fofa",
      "tagline": "Arte em Macramê, Home Sprays artesanais & Sublimação",
      "language": "pt-BR"
    },
    "business_info": {
      "location": {
        "city": "Taquaritinga",
        "state": "SP",
        "country": "Brasil",
        "delivery_coverage": "Atendimento presencial/local em Taquaritinga - SP e envios para todo o Brasil via Correios e Transportadoras."
      },
      "contacts": {
        "whatsapp": "+5516991954414",
        "whatsapp_formatted": "(16) 99195-4414",
        "whatsapp_link": "https://wa.me/5516991954414",
        "instagram_principal": "@kifofaa",
        "instagram_principal_link": "https://www.instagram.com/kifofaa/",
        "instagram_parceiro": "@venus.emflor",
        "instagram_parceiro_link": "https://www.instagram.com/venus.emflor/"
      },
      "payment_methods": ["Pix", "Cartão de Crédito", "Cartão de Débito", "Transferência Bancária"]
    },
    "product_catalog": {
      "macrame": {
        "category_name": "Macramê Exclusivo",
        "description": "Peças tecidas nó a nó com fios 100% algodão resistentes e acabamento artesanal refinado.",
        "items": [
          { "id": "macrame-bolsa-bambu", "name": "Bolsa com Alça de Bambu", "availability": "Pronta Entrega e Encomenda" },
          { "id": "macrame-bolsa-tote", "name": "Bolsa Sacola / Tote Terracota", "availability": "Pronta Entrega e Encomenda" },
          { "id": "macrame-porta-moedas", "name": "Porta-Moedas e Mini Carteiras", "availability": "Sob Encomenda" },
          { "id": "macrame-mesa-posta", "name": "Mesa Posta (Sousplat & Porta-Copos)", "availability": "Sob Encomenda" }
        ]
      },
      "home_spray": {
        "category_name": "Home Sprays Artesanais",
        "volume": "120ml",
        "availability": "Pronta Entrega",
        "fragrances": [
          { "name": "Bambu" }, { "name": "Algodão" }, { "name": "Melancia" }, { "name": "Capim-Limão" }
        ]
      }
    },
    "intents": [
      {
        "intent": "saudacao",
        "keywords": ["oi", "olá", "ola", "bom dia", "boa tarde", "boa noite", "oii", "começar", "inicio"],
        "responses": ["Olá! Seja muito bem-vindo(a) ao Ateliê Ki Fofa! 🧶✨ Como posso te ajudar hoje?"]
      },
      {
        "intent": "consultar_produtos",
        "keywords": ["produtos", "catalogo", "catálogo", "o que vendem", "opcoes", "opções", "macrame", "macramê", "home spray", "sublimacao", "ver produtos"],
        "responses": ["Trabalhamos com 3 linhas principais:\n1. 🧶 Macramê Exclusivo (Bolsas, porta-moedas, sousplats)\n2. 🌿 Home Sprays (120ml: Bambu, Algodão, Melancia, Capim-Limão)\n3. ✨ Sublimação (Lembrancinhas personalizadas)"]
      },
      {
        "intent": "home_spray_fragrancias",
        "keywords": ["cheiro", "aroma", "fragrancia", "fragrância", "perfume", "home spray", "essencias", "essências"],
        "responses": ["Nossos Home Sprays (120ml) estão disponíveis nas essências:\n• 🌿 Bambu\n• ☁️ Algodão\n• 🍉 Melancia\n• 🍋 Capim-Limão\n\nTodos para pronta entrega! Gostaria de encomendar?"]
      },
      {
        "intent": "fazer_encomenda",
        "keywords": ["encomendar", "comprar", "pedido", "agendar", "personalizar", "preço", "preco", "valor", "whatsapp"],
        "responses": ["Para fazer um pedido ou orçamento personalizado, fale direto conosco via WhatsApp: https://wa.me/5516991954414 📱"]
      },
      {
        "intent": "frete_e_entrega",
        "keywords": ["frete", "entrega", "envios", "taquaritinga", "correios", "retirada"],
        "responses": ["Nossos produtos são produzidos em Taquaritinga - SP. Realizamos entregas locais e enviamos para todo o Brasil via Correios ou Transportadora!"]
      },
      {
        "intent": "despedida",
        "keywords": ["tchau", "obrigado", "obrigada", "valeu", "ate logo", "até logo"],
        "responses": ["Muito obrigado(a) pelo contato! Tenha um ótimo dia! 🧶✨"]
      }
    ],
    "fallback": {
      "response": "Desculpe, não entendi muito bem. Você gostaria de saber sobre nossas Bolsas em Macramê, Home Sprays (120ml) ou fazer um pedido? Se preferir, fale com a gente no WhatsApp: https://wa.me/5516991954414"
    }
  };


  // 2. INJEÇÃO DO CSS
  const styles = `
    /* Botão do Chatbot */
    .kifofa-chat-toggle {
      position: fixed;
      bottom: 25px;
      right: 25px;
      width: 60px;
      height: 60px;
      background-color: #8B5A2B;
      color: #FFFFFF;
      border-radius: 50%;
      border: none;
      box-shadow: 0 4px 15px rgba(139, 90, 43, 0.35);
      cursor: pointer;
      font-size: 26px;
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 9998;
      transition: bottom 0.3s ease, transform 0.3s ease, background-color 0.3s ease;
    }


    /* Se o banner de cookies estiver visível, o botão sobe para não cobrir */
    body:not(.cookies-aceitos) .kifofa-chat-toggle {
      bottom: 80px;
    }


    .kifofa-chat-toggle:hover {
      background-color: #704721;
      transform: scale(1.08);
    }


    /* Janela do Chatbot */
    .kifofa-chat-box {
      position: fixed;
      bottom: 95px;
      right: 25px;
      width: 350px;
      max-width: calc(100vw - 40px);
      height: 480px;
      max-height: calc(100vh - 120px);
      background-color: #FAF6F0;
      border: 1px solid #E6DCCD;
      border-radius: 16px;
      box-shadow: 0 10px 25px rgba(61, 50, 49, 0.15);
      display: flex;
      flex-direction: column;
      overflow: hidden;
      z-index: 9999;
      font-family: 'Montserrat', sans-serif;
    }


    body:not(.cookies-aceitos) .kifofa-chat-box {
      bottom: 150px;
    }


    .kifofa-chat-box.oculto {
      display: none !important;
    }


    .kifofa-chat-header {
      background: linear-gradient(135deg, #8B5A2B, #A66E38);
      color: #FFFFFF;
      padding: 14px 18px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }


    .kifofa-chat-header h3 {
      margin: 0;
      font-family: 'Playfair Display', serif;
      font-size: 1.1rem;
      font-weight: 600;
    }


    .kifofa-chat-close {
      background: none;
      border: none;
      color: #FFFFFF;
      font-size: 22px;
      cursor: pointer;
    }


    .kifofa-chat-body {
      flex: 1;
      padding: 15px;
      overflow-y: auto;
      display: flex;
      flex-direction: column;
      gap: 12px;
    }


    .chat-msg {
      max-width: 80%;
      padding: 10px 14px;
      border-radius: 12px;
      font-size: 0.9rem;
      line-height: 1.4;
      white-space: pre-wrap;
      word-wrap: break-word;
    }


    .chat-msg.bot {
      background-color: #FFFFFF;
      color: #3D3231;
      border: 1px solid #E6DCCD;
      align-self: flex-start;
      border-bottom-left-radius: 2px;
    }


    .chat-msg.user {
      background-color: #8B5A2B;
      color: #FFFFFF;
      align-self: flex-end;
      border-bottom-right-radius: 2px;
    }


    .chat-quick-reply {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
      margin-top: 6px;
    }


    .chat-quick-btn {
      background-color: #F3ECE2;
      color: #8B5A2B;
      border: 1px solid #D4A373;
      border-radius: 15px;
      padding: 6px 12px;
      font-size: 0.8rem;
      cursor: pointer;
      font-family: 'Montserrat', sans-serif;
      font-weight: 500;
      transition: background-color 0.2s ease, color 0.2s ease;
    }


    .chat-quick-btn:hover {
      background-color: #8B5A2B;
      color: #FFFFFF;
    }


    .kifofa-chat-footer {
      padding: 10px 12px;
      background-color: #FFFFFF;
      border-top: 1px solid #E6DCCD;
      display: flex;
      gap: 8px;
    }


    .kifofa-chat-input {
      flex: 1;
      border: 1px solid #E6DCCD;
      background-color: #FAF6F0;
      color: #3D3231;
      border-radius: 20px;
      padding: 8px 14px;
      font-size: 0.88rem;
      font-family: 'Montserrat', sans-serif;
      outline: none;
    }


    .kifofa-chat-input:focus {
      border-color: #8B5A2B;
    }


    .kifofa-chat-send {
      background-color: #8B5A2B;
      color: #FFFFFF;
      border: none;
      border-radius: 50%;
      width: 36px;
      height: 36px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 14px;
    }


    .kifofa-chat-send:hover {
      background-color: #704721;
    }
  `;


  const styleTag = document.createElement('style');
  styleTag.innerHTML = styles;
  document.head.appendChild(styleTag);


  // 3. ESTRUTURA HTML DO CHAT
  const chatHTML = `
    <button id="kifofa-btn-toggle" class="kifofa-chat-toggle" aria-label="Abrir Chat">💬</button>
    <div id="kifofa-box" class="kifofa-chat-box oculto">
      <div class="kifofa-chat-header">
        <h3>🧶 Assistente Ki Fofa</h3>
        <button id="kifofa-btn-close" class="kifofa-chat-close">&times;</button>
      </div>
      <div id="kifofa-messages" class="kifofa-chat-body"></div>
      <div class="kifofa-chat-footer">
        <input type="text" id="kifofa-input" class="kifofa-chat-input" placeholder="Digite sua dúvida..." />
        <button id="kifofa-btn-send" class="kifofa-chat-send">➔</button>
      </div>
    </div>
  `;


  const container = document.createElement('div');
  container.innerHTML = chatHTML;
  document.body.appendChild(container);


  // DOM
  const btnToggle = document.getElementById('kifofa-btn-toggle');
  const btnClose = document.getElementById('kifofa-btn-close');
  const chatBox = document.getElementById('kifofa-box');
  const messagesContainer = document.getElementById('kifofa-messages');
  const inputMsg = document.getElementById('kifofa-input');
  const btnSend = document.getElementById('kifofa-btn-send');


  // Mensagem inicial
  const saudacao = botData.intents.find(i => i.intent === 'saudacao');
  if (saudacao) {
    addMessage(saudacao.responses[0], 'bot');
    showQuickReplies(['Ver Produtos', 'Home Sprays', 'WhatsApp']);
  }


  // Toggle do Chat
  btnToggle.addEventListener('click', () => chatBox.classList.toggle('oculto'));
  btnClose.addEventListener('click', () => chatBox.classList.add('oculto'));


  // Envio de mensagens
  function handleSend() {
    const text = inputMsg.value.trim();
    if (!text) return;


    addMessage(text, 'user');
    inputMsg.value = '';


    setTimeout(() => {
      processResponse(text);
    }, 400);
  }


  btnSend.addEventListener('click', handleSend);
  inputMsg.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') handleSend();
  });


  function addMessage(text, sender) {
    const msgDiv = document.createElement('div');
    msgDiv.classList.add('chat-msg', sender);
    msgDiv.innerText = text;
    messagesContainer.appendChild(msgDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }


  function showQuickReplies(options) {
    const replyContainer = document.createElement('div');
    replyContainer.classList.add('chat-quick-reply');


    options.forEach(opt => {
      const btn = document.createElement('button');
      btn.classList.add('chat-quick-btn');
      btn.innerText = opt;
      btn.addEventListener('click', () => {
        addMessage(opt, 'user');
        processResponse(opt);
      });
      replyContainer.appendChild(btn);
    });


    messagesContainer.appendChild(replyContainer);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }


  function processResponse(userText) {
    const textLower = userText.toLowerCase();
    let matchedIntent = null;


    for (const item of botData.intents) {
      if (item.keywords.some(kw => textLower.includes(kw))) {
        matchedIntent = item;
        break;
      }
    }


    if (matchedIntent) {
      const resp = matchedIntent.responses[Math.floor(Math.random() * matchedIntent.responses.length)];
      addMessage(resp, 'bot');
    } else {
      addMessage(botData.fallback.response, 'bot');
    }
  }
}


