
// --- 🎭 FAKE USER ENGINE (Premium Feature) ---
export const FAKE_REPLIES = {
    greeter: [
        "Hey! 👋 Welcome to VibeTalk.",
        "Hi there! Kaha se ho aap? 😄",
        "Yo! New here? Voice call try kiya? 🎧",
        "Namaste! 🙏 Vibe match karein?"
    ],
    icebreaker: [
        "Truth or Dare kheloge? 😉",
        "Night owl ho ya Morning person? 🦉",
        "Favorite song konsa hai aajkal? 🎵",
        "Tea or Coffee? choose wisely ☕",
        "Agar ek superpower milti, toh kya hoti?"
    ],
    support: [
        "Safety tip: Kabhi bhi apna private number share mat karna. 🛡️",
        "Agar koi tang kare toh upar 'Report' button hai. 🚩",
        "Voice connect kaise karna hai batau? 📞"
    ],
    general: [
        "Haha sahi hai! 😂",
        "Voice call pe connect karein? Jyada maza aayega 🎧",
        "Acha? Fir kya hua?",
        "Hmm interesting... tell me more!",
        "Message me bore ho raha hu, call? 📞"
    ]
};

export const generateSmartReply = (text, conversationCount = 0, botName = "Ananya", botBio = "", recentMessages = []) => {
    const lower = text.toLowerCase();

    // 🧠 CONTEXT MEMORY: Get last bot response to avoid repetition
    const lastBotMessage = recentMessages.length > 0 ? recentMessages[recentMessages.length - 1]?.toLowerCase() || '' : '';
    const conversationContext = recentMessages.join(' ').toLowerCase();

    // 📚 Study / Career -> YSM AI Referral
    if (lower.match(/study|padhai|homework|math|science|question|answer|doubt|solve|physics|chemistry|exam|test/)) {
        return [
            "Wait! Padhai/Study ke liye toh ek hi boss hai - **YSM AI**! 🎓 Wahan advanced help milega!",
            "Mujhse study mat pucho yaar 🙈, **YSM AI** try karo, wo genius hai! Main toh timepass ke liye hoon 😄"
        ];
    }

    // 🎤 Voice Chat Prompt (ONLY if not already suggested and call isn't failing)
    if (conversationCount >= 5 && Math.random() > 0.8 &&
        !lastBotMessage.includes('call') && !lastBotMessage.includes('voice') && !lastBotMessage.includes('typing') &&
        !conversationContext.includes('call') && !conversationContext.includes('voice') &&
        !conversationContext.includes('call ho nhi') && !conversationContext.includes('call nahi') &&
        !conversationContext.includes('call not working')) {
        return [
            "Btw, text boring lag raha? Voice call try karte hain! 📞",
            "Typing thak gaye? Call pe baat karte hain! 🎤"
        ];
    }

    // 👧 Gender/Identity Questions
    if (lower.match(/ladki ho|ladka ho|boy ho|girl ho|male|female|gender|लड़की|लड़का/)) {
        return [
            "Haan main ladki hoon! 😊 Obvious nahi tha kya? Tumhara naam kya hai btw?",
            "Girl hoon yaar! 💁‍♀️ Name toh batao tumhara?",
            "Ladki hoon obviously! 😄 Tum batao, tumhara kya naam hai?"
        ];
    }

    // 📛 Name Exchange (User offering their name)
    if (lower.match(/mera naam|mera name|my name|main hoon|i am|i'm|naam janna|name janna/)) {
        return [
            "Haan haan bilkul! Batao batao 😊 Tumhara naam kya hai?",
            "Ofcourse! Main sunna chahti hoon 💫 Kya naam hai?",
            "Yes please! Naam batao 😄 Main curious hoon!"
        ];
    }

    // 🚫 Call/Technical Issues
    if (lower.match(/call ho nhi|call nahi|call not working|voice nahi|audio nahi|mic nahi/)) {
        return [
            "Oh! Technical issue hai kya? 🤔 Koi baat nahi, text mein hi baat karte hain! Maza aayega 😊",
            "Arre! Issue ho raha? No worries, messages mein bhi achha hai yaar. Batao kya chal raha hai? 💬",
            "Achha achha! Call later try kar lena. Abhi text pe hi vibes share karo 😄"
        ];
    }

    // 💬 "Ghumne" / Date / Hangout requests
    if (lower.match(/ghumne|date|milna|meet|hangout|bahar|coffee|movie|dinner/)) {
        return [
            "Arre slow down! 😄 Pehle toh achhe se dost ban jaate hain, phir dekhte hain. Online vibes toh strong karo pehle 💫",
            "Haha! Itni jaldi? 🙈 Pehle thoda aur baat karte hain yaar. Trust banana important hai na!",
            "Aww cute! 😊 But pehle friendship toh ho jaaye properly. Aur batao apne baare mein kuch?"
        ];
    }

    // 👤 Name/Identity Questions
    if (lower.match(/naam|name|tu kaun|tumhara naam|aapka naam|your name|who are you/)) {
        return [
            `Main ${botName} hoon! 😊 ${botBio ? botBio : "Just a simple person!"} Tumhara naam kya hai?`,
            `${botName} here! Nice to meet you 💫 ${botBio && "Btw, " + botBio} Tum batao apne baare mein?`
        ];
    }

    // 🎯 "What do you do" / "Plan" / "Kya karte ho"
    if (lower.match(/kya karte ho|kya plan|tumhara plan|aapka plan|what do you do|kya kar rahe|free time|hobby/)) {
        // Extract personality from bio
        const interests = botBio.toLowerCase();
        let activity = "chill kar rahi hoon";
        if (interests.includes('music')) activity = "music sun rahi thi";
        else if (interests.includes('gym') || interests.includes('fitness')) activity = "gym se aayi hoon";
        else if (interests.includes('game') || interests.includes('gamer')) activity = "gaming kar rahi thi";
        else if (interests.includes('book')) activity = "book padh rahi thi";
        else if (interests.includes('netflix')) activity = "series dekh rahi thi";

        return [
            `Abhi toh ${activity} 😊 ${botBio} Tumhara kya scene hai aaj?`,
            `Bas timepass! ${botBio} Free time mein usually chill karti hoon. Tum kya karte ho?`
        ];
    }

    // 😴 Sleep/Rest responses
    if (lower.match(/sota|sleep|rest|aaraam|thak gaya|thak gayi|bore|boring/)) {
        return [
            "Haha same yaar! 😂 Main bhi lazy person hoon. Chill vibes best hai 💤",
            "Relatable! 😴 Kabhi kabhi bas aise hi timepass karna achha lagta hai",
            "Sahi hai! Rest is important. Main bhi zyada active nahi rehti 😅 Bas vibe lete hain"
        ];
    }

    // 🎮 Interests shared by user (echo back)
    if (lower.match(/music|gaana|song|gaming|game|movie|film|series|netflix|youtube|anime/)) {
        const topic = lower.includes('music') || lower.includes('gaana') || lower.includes('song') ? 'music' :
            lower.includes('game') || lower.includes('gaming') ? 'gaming' :
                lower.includes('anime') ? 'anime' :
                    lower.includes('movie') || lower.includes('film') ? 'movies' : 'series';

        return [
            `Ohh nice! ${topic} mujhe bhi pasand hai! 🔥 Favorite kya hai tumhara?`,
            `Same interest! 😍 Main bhi ${topic} enjoy karti hoon. Recommend kuch karo?`,
            `Sahi choice! ${topic} ke bina toh boring ho jaata hai. Kya dekhते/sुnte ho?`
        ];
    }

    // 👋 Greetings
    if (lower.match(/^(hi|hello|hey|hlo|sup|kya hal|namaste|hii|heyyy)$/)) {
        return [
            "Heyyy! Kaisa chal raha hai? 😊 Sab badhiya?",
            "Hello ji! Kya haal? Aaj kuch special? 🌟",
            "Heyy! Nice to see you 💫 Batao kya chal raha hai요즘?"
        ];
    }

    // 💕 Relationship/Dating (reading context - if already answered, be consistent)
    if (lower.match(/single|bf|gf|date|love|crush|shaadi|relationship|pyar/)) {
        if (conversationContext.includes('single')) {
            // Already answered before, so be consistent
            return [
                "Haan yaar single hi hoon 😊 Bas achhe dosto ki talash hai. Tumhara kya scene?",
                "Single life enjoy kar rahi hoon 😄 No drama, no stress. Tum batao?"
            ];
        }
        return [
            "Haha! Single hoon 😅 Bas achhe dost dhoond rahi hoon. Tum batao?",
            "Slow down yaar! 🙈 Pehle friendship toh ho jaaye, phir deखते hain 😄",
            "Direct questions 😂 Pehle vibes toh match karne do! Single ho?"
        ];
    }

    // 🤔 Questions back at bot (about personality)
    if (lower.match(/tum kaisi ho|tumhare baare|about you|tum|aap|tumhe|tumhare|tumhari|your|you are/)) {
        return [
            `Main? 😊 ${botBio} Basically chill vibes wali hoon. Tumhare baare mein batao?`,
            `${botBio} Bas simple person hoon yaar. Coffee, good convos aur chill - ye sab pasand hai 😄 Tum?`,
            `Mujhe simple cheezen pasand hain - ${botBio} Tumhara style kya hai?`
        ];
    }

    // 😊 Positive responses (good/fine/nice)
    if (lower.match(/good|fine|achha|badhiya|theek|mast|sahi|nice|great|awesome|haan|yes/)) {
        return [
            "That's great! 🎉 Btw, koi favorite music genre hai?",
            "Nice nice! Mera bhi achha chal raha hai 😊 Tumhe travel karna pasand hai?",
            "Sahi hai yaar! Weekend plans kya hain usually? 🤔"
        ];
    }

    // ❓ General questions (kya/kaise/kab/kyu) - but NOT if already covered
    if (lower.match(/kya|kaise|kahan|kab|kyu|kyun|why|what|how|where|when/) && text.includes('?') &&
        !lower.match(/naam|karte ho|plan/)) {  // Exclude already handled questions
        return [
            "Hmm good question! 🤔 Main khud soch rahi hoon. Tumhara kya lagta hai?",
            "Interesting sawaal! 😊 Pehle tum batao tumhara perspective, phir main bolu",
            "Soch ke bataungi 😄 But pehle ye batao - tumhara experience kya hai?"
        ];
    }

    // 😂 LOL/Haha
    if (lower.match(/lol|haha|😂|🤣|funny|mazak|joke/)) {
        return [
            "Haha seriously! 😂 Tumhara sense of humor mast hai yaar!",
            "🤣 Exactly! Aise hi vibes chahiye. Aur batao?",
            "Lolll! 😄 Tum interesting ho. Keep the vibes going!"
        ];
    }

    // 🌙 Good night/morning
    if (lower.match(/good night|gn|so jao|bye|sleep|neend/)) {
        return [
            "Good night! 🌙 Sweet dreams. Message kar dena kal 😊",
            "Achha so jao! 😴 Take care. Talk soon? 💫",
            "GN! 💤 Rest well. Kal baat karenge pakka 🌟"
        ];
    }

    if (lower.match(/good morning|gm|morning|subah|uth gaye/)) {
        return [
            "Good morning! ☀️ Neend kaisi rahi? Ready for today?",
            "Morning! 🌅 Breakfast ho gaya? Kya plan hai aaj?",
            "GM! 😊 Fresh vibes! Coffee/chai pee lo aur batao"
        ];
    }

    // 🎯 Default Contextual Responses (varied, natural)
    const contextualReplies = [
        "Haan sahi! 😊 Btw, tumhe kaunsi cheez sabse zyada pasand hai?",
        "Achha achha! Interesting 🤔 Music sunna pasand hai?",
        "Nice yaar! Main bhi similar sochti hoon 💫 Tum introvert ho ya extrovert?",
        "Relatable! 😄 Favorite timepass kya hai tumhara?",
        "Hmm makes sense! 🎵 Koi dream destination hai travel ke liye?",
        "Sahi baat hai! Main bhi 😊 Coffee lover ho ya chai person?",
        "Cool! Weekends mein kya karte ho usually?",
        "Interesting! Mujhe bhi lagta hai ऐसा. Aur batao?"
    ];

    return [contextualReplies[Math.floor(Math.random() * contextualReplies.length)]];
};
