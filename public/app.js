(() => {
  'use strict';

  // ---------- Text in both languages ----------
  const T = {
    en: {
      rules: 'Rules', rulesLower: 'rules', privacy: 'Privacy',
      heroA: "Hey, who's this?", heroB: "Nobody you know. That's the point.", heroC: 'Fair. So what are you into?',
      title: 'Talk to a stranger.',
      lede: 'One-on-one, anonymous, free. No account, no names, nothing saved.',
      online: 'people online now',
      interestsLabel: 'Interests (optional)',
      interestsPh: 'music, football, Beirut… press Enter',
      interestsHint: "We'll try to match you with someone who shares one.",
      adult: "I'm 18 or older and I agree to the",
      start: 'Start chatting',
      needAdult: 'Tick the box to confirm you are 18 or older.',
      skip: 'Skip', sure: 'Sure?', newChat: 'New', send: 'Send', typePh: 'Type a message',
      rulesTitle: 'The rules',
      rulesList: [
        'You must be 18 or older.',
        'Be decent. No harassment, hate, threats, or bullying.',
        'No sexual content, and never anything involving minors. We report it to the authorities.',
        'No spam, ads, scams, or links. Links are removed automatically.',
        "Protect yourself: don't share your name, number, address, or socials with strangers.",
        "If someone makes you uncomfortable, press Skip. You won't be matched with them again.",
      ],
      privacyTitle: 'Privacy',
      privacyList: [
        "Messages go straight from you to the other person. We don't save them.",
        "We don't ask for your name, email, or phone number.",
        "To limit spam, we keep a scrambled (hashed) version of your IP address only while you're connected.",
        'No ads and no tracking cookies.',
      ],
      gotIt: 'Got it',
      noticeTitle: 'Stay safe',
      noticeBody: 'Never send anything that could harm you: your name, phone number, address, photos, or social accounts. If a chat feels wrong, press Skip.',
      chatNoticeTitle: "Don't send anything that could harm you.",
      chatNoticeBody: 'No names, numbers, addresses, photos, or socials. If they make you uncomfortable, press Skip.',
      connecting: 'Connecting…',
      searching: 'Looking for someone to talk to…',
      searchingSys: 'Looking for someone to talk to…',
      connected: "You're chatting with a <b>stranger</b>",
      common: 'You both like',
      youLeft: 'You left the chat.',
      theyLeft: 'The stranger left the chat.',
      findNew: 'Find someone new',
      idle: 'Chat ended',
      slow: 'Slow down a little.',
      lost: 'Connection lost. Reconnecting…',
      full: 'Too many open tabs from your connection. Close one and try again.',
      newMsg: 'New message',
      langBtn: 'عربي',
    },
    ar: {
      rules: 'القواعد', rulesLower: 'القواعد', privacy: 'الخصوصية',
      heroA: 'أهلا، مين معي؟', heroB: 'حدا ما بتعرفه. وهيدي الفكرة.', heroC: 'معك حق. شو بتحب؟',
      title: 'احكي مع حدا غريب.',
      lede: 'محادثة فردية، مجهولة ومجانية. بلا حساب، بلا أسماء، وما منحفظ شي.',
      online: 'شخص متصل هلق',
      interestsLabel: 'اهتماماتك (اختياري)',
      interestsPh: 'موسيقى، فوتبول، بيروت… واضغط Enter',
      interestsHint: 'منحاول نوصلك بحدا عنده اهتمام متلك.',
      adult: 'عمري ١٨ سنة أو أكتر وموافق على',
      start: 'ابدأ المحادثة',
      needAdult: 'أكّد إنو عمرك ١٨ سنة أو أكتر.',
      skip: 'تخطّي', sure: 'أكيد؟', newChat: 'جديد', send: 'إرسال', typePh: 'اكتب رسالة',
      rulesTitle: 'القواعد',
      rulesList: [
        'لازم يكون عمرك ١٨ سنة أو أكتر.',
        'خليك محترم. ممنوع التحرش أو الكراهية أو التهديد أو التنمّر.',
        'ممنوع المحتوى الجنسي، وممنوع نهائياً أي شي بيتعلق بالقاصرين. منبلّغ عنه للسلطات.',
        'ممنوع السبام والإعلانات والاحتيال والروابط. الروابط بتنشال تلقائياً.',
        'احمي حالك: لا تشارك اسمك أو رقمك أو عنوانك أو حساباتك مع حدا غريب.',
        'إذا حدا ضايقك، اضغط تخطّي. وما رح نوصلك فيه مرة تانية.',
      ],
      privacyTitle: 'الخصوصية',
      privacyList: [
        'الرسائل بتروح منك مباشرة للشخص التاني. نحنا ما منحفظها.',
        'ما منطلب اسمك ولا إيميلك ولا رقمك.',
        'لنحدّ من السبام، منحتفظ بنسخة مشفّرة (hash) من عنوان الـIP تبعك بس وقت إنت متصل.',
        'لا إعلانات ولا كوكيز للتتبّع.',
      ],
      gotIt: 'تمام',
      noticeTitle: 'خلّيك بأمان',
      noticeBody: 'لا تبعت أي شي ممكن يأذيك: اسمك، رقمك، عنوانك، صورك أو حساباتك. إذا المحادثة ما ريّحتك، اضغط تخطّي.',
      chatNoticeTitle: 'لا تبعت أي شي ممكن يأذيك.',
      chatNoticeBody: 'لا أسماء، لا أرقام، لا عناوين، لا صور ولا حسابات. إذا ضايقك، اضغط تخطّي.',
      connecting: 'عم نتصل…',
      searching: 'عم ندوّر على حدا تحكي معه…',
      searchingSys: 'عم ندوّر على حدا تحكي معه…',
      connected: 'عم تحكي مع <b>شخص غريب</b>',
      common: 'تنيناتكن بتحبوا',
      youLeft: 'إنت طلعت من المحادثة.',
      theyLeft: 'الشخص التاني طلع من المحادثة.',
      findNew: 'لاقي حدا جديد',
      idle: 'انتهت المحادثة',
      slow: 'شوي شوي.',
      lost: 'انقطع الاتصال. عم نرجع نتصل…',
      full: 'في كتير صفحات مفتوحة من نفس الاتصال. سكّر وحدة وجرّب مرة تانية.',
      newMsg: 'رسالة جديدة',
      langBtn: 'English',
    },
  };

  const store = {
    get(k) { try { return localStorage.getItem(k); } catch { return null; } },
    set(k, v) { try { localStorage.setItem(k, v); } catch {} },
  };

  let lang = store.get('fc-lang') || ((navigator.language || '').startsWith('ar') ? 'ar' : 'en');
  const t = k => T[lang][k] ?? T.en[k] ?? k;

  function applyLang() {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.querySelectorAll('[data-i18n]').forEach(el => { el.textContent = t(el.dataset.i18n); });
    document.querySelectorAll('[data-i18n-ph]').forEach(el => { el.placeholder = t(el.dataset.i18nPh); });
    document.querySelectorAll('[data-i18n-list]').forEach(el => {
      const items = t(el.dataset.i18nList);
      const tag = el.tagName === 'OL' ? 'li' : 'p';
      el.replaceChildren(...items.map(s => { const n = document.createElement(tag); n.textContent = s; return n; }));
    });
    $('#langBtn').textContent = t('langBtn');
    $('#langBtn').lang = lang === 'ar' ? 'en' : 'ar';
    renderStatus();
    updateSkip();
  }

  // ---------- DOM ----------
  const $ = s => document.querySelector(s);
  const landing = $('#landing'), chat = $('#chat'), log = $('#log');
  const input = $('#msgInput'), sendBtn = $('#sendBtn'), skipBtn = $('#skipBtn');
  $('#year').textContent = new Date().getFullYear();

  // ---------- Interests ----------
  let interests = [];
  try { interests = JSON.parse(store.get('fc-interests') || '[]').slice(0, 8); } catch { interests = []; }
  const tagBox = $('#tagBox'), tagInput = $('#tagInput');
  function renderTags() {
    tagBox.querySelectorAll('.tag').forEach(n => n.remove());
    for (const it of interests) {
      const chip = document.createElement('span');
      chip.className = 'tag';
      chip.textContent = it;
      const x = document.createElement('button');
      x.type = 'button'; x.textContent = '×'; x.setAttribute('aria-label', 'Remove ' + it);
      x.onclick = () => { interests = interests.filter(i => i !== it); saveTags(); };
      chip.append(x);
      tagBox.insertBefore(chip, tagInput);
    }
  }
  function saveTags() { store.set('fc-interests', JSON.stringify(interests)); renderTags(); }
  function addTag(v) {
    v = v.replace(/[#,]/g, '').trim().toLowerCase().slice(0, 24);
    if (v && !interests.includes(v) && interests.length < 8) { interests.push(v); saveTags(); }
  }
  tagInput.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ',') { e.preventDefault(); addTag(tagInput.value); tagInput.value = ''; }
    else if (e.key === 'Backspace' && !tagInput.value && interests.length) { interests.pop(); saveTags(); }
  });
  tagInput.addEventListener('blur', () => { if (tagInput.value.trim()) { addTag(tagInput.value); tagInput.value = ''; } });
  tagBox.addEventListener('click', e => { if (e.target === tagBox) tagInput.focus(); });
  renderTags();

  // ---------- Dialogs ----------
  document.querySelectorAll('[data-open]').forEach(b => b.addEventListener('click', () => $('#' + b.dataset.open).showModal()));

  // ---------- Connection ----------
  let ws = null, state = 'idle', common = [], retry = 0, wantChat = false;

  function send(o) { if (ws && ws.readyState === 1) ws.send(JSON.stringify(o)); }

  function connect() {
    const proto = location.protocol === 'https:' ? 'wss' : 'ws';
    ws = new WebSocket(`${proto}://${location.host}/ws`);
    ws.onopen = () => { retry = 0; send({ t: 'hello', adult: true }); };
    ws.onmessage = e => { let m; try { m = JSON.parse(e.data); } catch { return; } handle(m); };
    ws.onclose = ev => {
      ws = null;
      if (ev.code === 4008) return;
      const wasChatting = state === 'chatting';
      setState('idle');
      if (wasChatting) sys(t('lost'));
      if (wantChat) {
        retry = Math.min(retry + 1, 6);
        setTimeout(() => { if (wantChat && !ws) connect(); }, 500 * 2 ** retry);
      }
    };
  }

  function handle(m) {
    switch (m.t) {
      case 'ready':
        setOnline(m.online);
        find();
        break;
      case 'online': setOnline(m.n); break;
      case 'waiting': setState('waiting'); break;
      case 'matched':
        common = m.common || [];
        log.replaceChildren();
        setState('chatting');
        if (common.length) sysHTML(`<strong>${esc(t('common'))} ${common.map(esc).join(', ')}.</strong>`);
        safetyNotice();
        input.focus();
        break;
      case 'msg':
        showTyping(false);
        bubble(m.text, 'them');
        notify();
        break;
      case 'sent': {
        const p = log.querySelector(`.msg.pending[data-id="${CSS.escape(m.id)}"]`);
        if (p) { p.classList.remove('pending'); p.textContent = m.text; }
        break;
      }
      case 'typing': showTyping(m.on); break;
      case 'ended':
        showTyping(false);
        setState('idle');
        sys(m.by === 'stranger' ? t('theyLeft') : t('youLeft'));
        endActions();
        break;
      case 'error':
        if (m.code === 'slow') flashSlow();
        break;
    }
  }

  function find() {
    log.replaceChildren();
    sys(t('searchingSys'));
    send({ t: 'find', interests });
    setState('waiting');
  }

  // ---------- UI state ----------
  function setState(s) {
    state = s;
    const chatting = s === 'chatting';
    input.disabled = !chatting;
    if (!chatting) { input.value = ''; input.style.height = ''; }
    sendBtn.disabled = !chatting || !input.value.trim();
    skipArmed = false;
    renderStatus();
    updateSkip();
  }
  function renderStatus() {
    const el = $('#status');
    if (!el) return;
    if (state === 'chatting') {
      el.innerHTML = `<span>${t('connected')}</span>`;
      for (const c of common) { const s = document.createElement('span'); s.className = 'chip'; s.textContent = c; el.append(s); }
    } else if (state === 'waiting') el.textContent = t('searching');
    else el.textContent = ws ? t('idle') : t('connecting');
  }
  function setOnline(n) { document.querySelector('.online').hidden = !(n >= 2); $('#onlineCount').textContent = Number(n).toLocaleString(lang === 'ar' ? 'ar-LB' : undefined); }

  // Skip: one press arms it, a second press ends the chat. Prevents accidental skips.
  let skipArmed = false, skipTimer = 0;
  function updateSkip() {
    const label = skipBtn.querySelector('span');
    skipBtn.classList.toggle('confirm', skipArmed);
    if (state === 'chatting') label.textContent = skipArmed ? t('sure') : t('skip');
    else if (state === 'waiting') label.textContent = t('skip');
    else label.textContent = t('newChat');
  }
  function onSkip() {
    if (state === 'chatting') {
      if (!skipArmed) {
        skipArmed = true; updateSkip();
        clearTimeout(skipTimer);
        skipTimer = setTimeout(() => { skipArmed = false; updateSkip(); }, 3000);
        return;
      }
      find();
      return;
    }
    if (state === 'waiting') { send({ t: 'stop' }); setState('idle'); log.replaceChildren(); sys(t('youLeft')); endActions(); return; }
    startChat();
  }
  skipBtn.addEventListener('click', onSkip);
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && !chat.hidden && !document.querySelector('dialog[open]')) { e.preventDefault(); onSkip(); }
  });

  // ---------- Messages ----------
  function esc(s) { return String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c])); }
  function atBottom() { return log.scrollHeight - log.scrollTop - log.clientHeight < 80; }
  function scroll(force) { if (force || atBottom()) log.scrollTop = log.scrollHeight; }
  function bubble(text, who, id) {
    const stick = atBottom() || who === 'you';
    const d = document.createElement('div');
    d.className = 'msg ' + who + (id ? ' pending' : '');
    if (id) d.dataset.id = id;
    d.textContent = text;
    const typing = log.querySelector('.typing-dots');
    typing ? log.insertBefore(d, typing) : log.append(d);
    scroll(stick);
  }
  function sys(text) { const d = document.createElement('div'); d.className = 'sys'; d.textContent = text; log.append(d); scroll(true); }
  function sysHTML(html) { const d = document.createElement('div'); d.className = 'sys'; d.innerHTML = html; log.append(d); scroll(true); }
  function safetyNotice() {
    const d = document.createElement('div'); d.className = 'sys safety'; d.setAttribute('role', 'note');
    const b = document.createElement('b'); b.textContent = t('chatNoticeTitle');
    const s = document.createElement('span'); s.className = 'muted'; s.textContent = t('chatNoticeBody');
    d.append(b, s); log.append(d); scroll(true);
  }
  function endActions() {
    const d = document.createElement('div'); d.className = 'sys';
    const b = document.createElement('button'); b.className = 'btn primary'; b.textContent = t('findNew');
    b.onclick = startChat;
    d.append(b); log.append(d); scroll(true);
    b.focus();
  }
  function showTyping(on) {
    const ex = log.querySelector('.typing-dots');
    if (on && !ex) {
      const d = document.createElement('div'); d.className = 'typing-dots';
      d.innerHTML = '<i></i><i></i><i></i>'; log.append(d); scroll(false);
    } else if (!on && ex) ex.remove();
  }
  let slowTimer = 0;
  function flashSlow() {
    input.placeholder = t('slow');
    clearTimeout(slowTimer);
    slowTimer = setTimeout(() => { input.placeholder = t('typePh'); }, 2500);
  }

  let msgSeq = 0, typingOn = false, typingTimer = 0;
  function sendMsg() {
    const text = input.value.trim();
    if (!text || state !== 'chatting') return;
    const id = 'm' + (++msgSeq);
    bubble(text, 'you', id);
    send({ t: 'msg', text, id });
    input.value = ''; autosize(); sendBtn.disabled = true;
    if (typingOn) { typingOn = false; send({ t: 'typing', on: false }); }
  }
  function autosize() { input.style.height = 'auto'; input.style.height = Math.min(input.scrollHeight, 140) + 'px'; }
  input.addEventListener('input', () => {
    autosize();
    sendBtn.disabled = !input.value.trim();
    if (!typingOn && input.value) { typingOn = true; send({ t: 'typing', on: true }); }
    clearTimeout(typingTimer);
    typingTimer = setTimeout(() => { if (typingOn) { typingOn = false; send({ t: 'typing', on: false }); } }, 2500);
  });
  input.addEventListener('keydown', e => {
    if (e.key === 'Enter' && !e.shiftKey && !e.isComposing && matchMedia('(pointer: fine)').matches) { e.preventDefault(); sendMsg(); }
  });
  sendBtn.addEventListener('click', () => { sendMsg(); input.focus(); });

  // Unread count in the tab title while the tab is hidden.
  let unread = 0;
  const baseTitle = document.title;
  function notify() { if (document.hidden) { unread++; document.title = `(${unread}) ${t('newMsg')} · freechat`; } }
  document.addEventListener('visibilitychange', () => { if (!document.hidden) { unread = 0; document.title = baseTitle; } });

  // ---------- Start ----------
  function startChat() {
    wantChat = true;
    landing.hidden = true; chat.hidden = false;
    if (ws && ws.readyState === 1) find();
    else if (!ws) { log.replaceChildren(); sys(t('connecting')); connect(); }
  }
  $('#startForm').addEventListener('submit', e => {
    e.preventDefault();
    if (tagInput.value.trim()) { addTag(tagInput.value); tagInput.value = ''; }
    if (!$('#adultChk').checked) { $('#formError').textContent = t('needAdult'); $('#adultChk').focus(); return; }
    $('#formError').textContent = '';
    startChat();
  });
  $('#adultChk').addEventListener('change', () => { $('#formError').textContent = ''; });
  $('#homeLink').addEventListener('click', e => {
    e.preventDefault();
    wantChat = false;
    if (ws) ws.close();
    chat.hidden = true; landing.hidden = false;
  });

  $('#langBtn').addEventListener('click', () => { lang = lang === 'ar' ? 'en' : 'ar'; store.set('fc-lang', lang); applyLang(); });

  // Online count on the landing page.
  function pollOnline() {
    if (!landing.hidden) fetch('/api/online').then(r => r.json()).then(d => setOnline(d.online)).catch(() => {});
  }
  pollOnline();
  setInterval(pollOnline, 15000);

  applyLang();
})();
