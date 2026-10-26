(() => {
  'use strict';

  // ---------- Text in both languages ----------
  const T = {
    en: {
      rules: 'Rules', rulesLower: 'rules', privacy: 'Privacy',
      heroA: "Hey, who's this?", heroB: "Nobody you know. That's the point.", heroC: 'Fair. So what are you into?',
      title: 'Talk to a stranger.',
      lede: 'One-on-one, anonymous, free. No account, no sign-up, nothing saved.',
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
        'No sexual content or nude photos, and never anything involving minors. We report it to the authorities.',
        'No spam, ads, scams, or links. Links are removed automatically.',
        "Protect yourself: don't share your name, number, address, or socials with strangers.",
        "If someone makes you uncomfortable, press Skip. You won't be matched with them again.",
      ],
      privacyTitle: 'Privacy',
      privacyList: [
        "Messages and photos go straight from you to the other person. We don't save them. Location data is removed from photos before they're sent.",
        "We don't ask for your name, email, or phone number.",
        "To limit spam, we keep a scrambled (hashed) version of your IP address only while you're connected.",
        'No ads and no tracking cookies.',
      ],
      gotIt: 'Got it',
      noticeTitle: 'Stay safe',
      noticeBody: 'Never send anything that could harm you: your name, phone number, address, photos, or social accounts. If a chat feels wrong, press Skip.',
      chatNoticeTitle: "Don't send anything that could harm you.",
      chatNoticeBody: 'Keep your real name, number, address and socials private, and think twice before sending a photo of yourself. Photos you receive stay blurred until you tap them. If they make you uncomfortable, press Skip.',
      connecting: 'Connecting…',
      searching: 'Looking for someone to talk to…',
      searchingSys: 'Looking for someone to talk to…',
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
      nickLabel: 'Nickname (optional)', nickPh: 'What should people call you?',
      stranger: 'a stranger', strangerCap: 'The stranger',
      chattingWith: "You're chatting with", friendChip: 'Friend',
      theyLeftName: '{n} left the chat.',
      addFriend: 'Add friend', reqSent: 'Request sent', friendsYes: 'Friends',
      friendReq: '{n} wants to add you as a friend.', accept: 'Accept', decline: 'No thanks', notNow: 'Not now',
      friendAdded: 'You and {n} are now friends. You can chat again any time you are both online.',
      friendDeclined: 'Your friend request was declined.',
      friendsTitle: 'Your friends', friendsHint: 'Saved on this device. Clearing your browser removes them.',
      onlineNow: 'Online', busy: 'In a chat', offline: 'Offline', chatBtn: 'Chat', forget: 'Remove friend',
      inviting: 'Waiting for {n} to accept…', inviteOffline: '{n} is offline right now.', inviteDeclined: '{n} can\'t chat right now.',
      inviteIn: '{n} wants to chat with you.', cancel: 'Cancel',
      someone: 'Someone',
      sendPhoto: 'Send a photo', tapToView: 'Photo hidden. Tap to view.', close: 'Close',
      photoBad: "That photo couldn't be sent. Try a JPG or PNG under 10 MB.", photoSlow: 'Wait a moment before sending another photo.',
      photoSizeErr: 'That file is too large.',
    },
    ar: {
      rules: 'القواعد', rulesLower: 'القواعد', privacy: 'الخصوصية',
      heroA: 'أهلا، مين معي؟', heroB: 'حدا ما بتعرفه. وهيدي الفكرة.', heroC: 'معك حق. شو بتحب؟',
      title: 'احكي مع حدا غريب.',
      lede: 'محادثة فردية، مجهولة ومجانية. بلا حساب، بلا تسجيل، وما منحفظ شي.',
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
        'ممنوع المحتوى الجنسي والصور العارية، وممنوع نهائياً أي شي بيتعلق بالقاصرين. منبلّغ عنه للسلطات.',
        'ممنوع السبام والإعلانات والاحتيال والروابط. الروابط بتنشال تلقائياً.',
        'احمي حالك: لا تشارك اسمك أو رقمك أو عنوانك أو حساباتك مع حدا غريب.',
        'إذا حدا ضايقك، اضغط تخطّي. وما رح نوصلك فيه مرة تانية.',
      ],
      privacyTitle: 'الخصوصية',
      privacyList: [
        'الرسائل والصور بتروح منك مباشرة للشخص التاني. نحنا ما منحفظها. ومنشيل معلومات الموقع من الصور قبل ما تنبعت.',
        'ما منطلب اسمك ولا إيميلك ولا رقمك.',
        'لنحدّ من السبام، منحتفظ بنسخة مشفّرة (hash) من عنوان الـIP تبعك بس وقت إنت متصل.',
        'لا إعلانات ولا كوكيز للتتبّع.',
      ],
      gotIt: 'تمام',
      noticeTitle: 'خلّيك بأمان',
      noticeBody: 'لا تبعت أي شي ممكن يأذيك: اسمك، رقمك، عنوانك، صورك أو حساباتك. إذا المحادثة ما ريّحتك، اضغط تخطّي.',
      chatNoticeTitle: 'لا تبعت أي شي ممكن يأذيك.',
      chatNoticeBody: 'خلّي اسمك الحقيقي ورقمك وعنوانك وحساباتك إلك، وفكّر منيح قبل ما تبعت صورة إلك. الصور اللي بتوصلك بتضل مغبّشة لحتى تضغط عليها. إذا ضايقك، اضغط تخطّي.',
      connecting: 'عم نتصل…',
      searching: 'عم ندوّر على حدا تحكي معه…',
      searchingSys: 'عم ندوّر على حدا تحكي معه…',
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
      nickLabel: 'اسم مستعار (اختياري)', nickPh: 'شو بدك الناس تناديك؟',
      stranger: 'شخص غريب', strangerCap: 'الشخص التاني',
      chattingWith: 'عم تحكي مع', friendChip: 'صديق',
      theyLeftName: '{n} طلع من المحادثة.',
      addFriend: 'إضافة صديق', reqSent: 'انبعت الطلب', friendsYes: 'أصدقاء',
      friendReq: '{n} بدو يضيفك صديق.', accept: 'قبول', decline: 'لا شكراً', notNow: 'مش هلق',
      friendAdded: 'إنت و{n} صرتوا أصدقاء. فيكن تحكوا مرة تانية أي وقت تكونوا تنيناتكن أونلاين.',
      friendDeclined: 'ما انقبل طلب الصداقة.',
      friendsTitle: 'أصدقاؤك', friendsHint: 'محفوظين على هالجهاز. إذا مسحت بيانات المتصفح بيروحوا.',
      onlineNow: 'أونلاين', busy: 'بمحادثة', offline: 'مش متصل', chatBtn: 'احكي', forget: 'شيل الصديق',
      inviting: 'ناطرين {n} يقبل…', inviteOffline: '{n} مش متصل هلق.', inviteDeclined: '{n} ما فيه يحكي هلق.',
      inviteIn: '{n} بدو يحكي معك.', cancel: 'إلغاء',
      someone: 'حدا',
      sendPhoto: 'بعت صورة', tapToView: 'الصورة مخفية. اضغط لتشوفها.', close: 'سكّر',
      photoBad: 'ما قدرنا نبعت هالصورة. جرّب JPG أو PNG أصغر من ١٠ ميغا.', photoSlow: 'استنى شوي قبل ما تبعت صورة تانية.',
      photoSizeErr: 'الملف كتير كبير.',
    },
  };

  const store = {
    get(k) { try { return localStorage.getItem(k); } catch { return null; } },
    set(k, v) { try { localStorage.setItem(k, v); } catch {} },
  };

  let lang = store.get('fc-lang') || ((navigator.language || '').startsWith('ar') ? 'ar' : 'en');
  const t = k => T[lang][k] ?? T.en[k] ?? k;
  const tn = (k, n) => t(k).replace('{n}', n);

  function applyLang() {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.querySelectorAll('[data-i18n]').forEach(el => { el.textContent = t(el.dataset.i18n); });
    document.querySelectorAll('[data-i18n-ph]').forEach(el => { el.placeholder = t(el.dataset.i18nPh); });
    document.querySelectorAll('[data-i18n-aria]').forEach(el => { el.setAttribute('aria-label', t(el.dataset.i18nAria)); });
    document.querySelectorAll('[data-i18n-list]').forEach(el => {
      const items = t(el.dataset.i18nList);
      const tag = el.tagName === 'OL' ? 'li' : 'p';
      el.replaceChildren(...items.map(s => { const n = document.createElement(tag); n.textContent = s; return n; }));
    });
    $('#langBtn').textContent = t('langBtn');
    $('#langBtn').lang = lang === 'ar' ? 'en' : 'ar';
    renderStatus();
    updateSkip();
    updateFriendBtn();
    renderFriends();
  }

  // ---------- DOM ----------
  const $ = s => document.querySelector(s);
  const landing = $('#landing'), chat = $('#chat'), log = $('#log');
  const input = $('#msgInput'), sendBtn = $('#sendBtn'), skipBtn = $('#skipBtn');
  const addFriendBtn = $('#addFriendBtn'), photoBtn = $('#photoBtn'), photoInput = $('#photoInput');
  $('#year').textContent = new Date().getFullYear();

  // ---------- This device's identity (the server only shares a code derived from it) ----------
  let deviceKey = store.get('fc-key');
  if (!deviceKey || !/^[a-f0-9]{32,64}$/.test(deviceKey)) {
    deviceKey = [...crypto.getRandomValues(new Uint8Array(16))].map(b => b.toString(16).padStart(2, '0')).join('');
    store.set('fc-key', deviceKey);
  }

  // ---------- Nickname ----------
  const nickInput = $('#nickInput');
  nickInput.value = store.get('fc-name') || '';
  const myName = () => nickInput.value.replace(/\s+/g, ' ').trim().slice(0, 20);
  nickInput.addEventListener('change', () => { store.set('fc-name', myName()); send({ t: 'name', name: myName() }); });

  // ---------- Friends (kept on this device) ----------
  let friends = [];
  try { friends = JSON.parse(store.get('fc-friends') || '[]').filter(f => f && typeof f.id === 'string').slice(0, 300); } catch { friends = []; }
  let presence = {};   // id -> {name, busy}
  const saveFriends = () => { store.set('fc-friends', JSON.stringify(friends)); renderFriends(); };
  const friendName = f => f.name || t('someone');
  function addFriend(id, name) {
    const ex = friends.find(f => f.id === id);
    if (ex) { if (name) ex.name = name; } else friends.unshift({ id, name: name || '' });
    saveFriends();
  }
  function renderFriends() {
    const box = $('#friends'), ul = $('#friendList');
    if (!box) return;
    box.hidden = friends.length === 0;
    ul.replaceChildren(...friends.map(f => {
      const li = document.createElement('li');
      const p = presence[f.id];
      const dot = document.createElement('span'); dot.className = 'pdot' + (p ? ' on' : '');
      const who = document.createElement('span'); who.className = 'who'; who.textContent = friendName(f);
      const st = document.createElement('span'); st.className = 'state'; st.textContent = p ? (p.busy ? t('busy') : t('onlineNow')) : t('offline');
      const go = document.createElement('button'); go.type = 'button'; go.className = 'btn primary small'; go.textContent = t('chatBtn');
      go.disabled = !p; go.onclick = () => chatWithFriend(f);
      const rm = document.createElement('button'); rm.type = 'button'; rm.className = 'forget'; rm.textContent = '×';
      rm.title = t('forget'); rm.setAttribute('aria-label', t('forget') + ': ' + friendName(f));
      rm.onclick = () => { friends = friends.filter(x => x.id !== f.id); saveFriends(); };
      li.append(dot, who, st, go, rm);
      return li;
    }));
  }
  function askPresence() { if (friends.length) send({ t: 'presence', ids: friends.map(f => f.id) }); }
  setInterval(askPresence, 20000);

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
  let ws = null, state = 'idle', common = [], retry = 0, wantChat = false, ready = false;
  let pendingFind = false, pendingInvite = null, partner = { name: '', friend: false, id: '' }, reqSent = false;
  let invitingFriend = null, incomingInvite = null;

  function send(o) { if (ws && ws.readyState === 1) ws.send(JSON.stringify(o)); }

  function connect() {
    const proto = location.protocol === 'https:' ? 'wss' : 'ws';
    ws = new WebSocket(`${proto}://${location.host}/ws`);
    ws.onopen = () => { retry = 0; send({ t: 'hello', adult: true, key: deviceKey, name: myName() }); };
    ws.onmessage = e => { let m; try { m = JSON.parse(e.data); } catch { return; } handle(m); };
    ws.onclose = ev => {
      ws = null; ready = false; presence = {}; renderFriends();
      if (ev.code === 4008) return;
      const wasChatting = state === 'chatting';
      setState('idle');
      if (wasChatting) sys(t('lost'));
      if (wantChat || adultOk()) {
        retry = Math.min(retry + 1, 6);
        setTimeout(() => { if ((wantChat || adultOk()) && !ws) connect(); }, 500 * 2 ** retry);
      }
    };
  }

  function handle(m) {
    switch (m.t) {
      case 'ready':
        ready = true;
        setOnline(m.online);
        askPresence();
        if (pendingInvite) { const f = pendingInvite; pendingInvite = null; sendInvite(f); }
        else if (pendingFind) { pendingFind = false; find(); }
        break;
      case 'online': setOnline(m.n); break;
      case 'waiting': setState('waiting'); break;
      case 'matched':
        common = m.common || [];
        partner = { name: m.name || '', friend: !!m.friend, id: m.id || '' };
        if (partner.friend && partner.id) addFriend(partner.id, partner.name);
        reqSent = false; invitingFriend = null; hideToast();
        wantChat = true; landing.hidden = true; chat.hidden = false;
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
        sys(m.by === 'stranger' ? (partner.name ? tn('theyLeftName', partner.name) : t('theyLeft')) : t('youLeft'));
        endActions();
        break;
      case 'error':
        if (m.code === 'slow' && m.id) photoFailed(m.id, t('photoSlow'));
        else if (m.code === 'img') photoFailed(m.id, t('photoBad'));
        else if (m.code === 'slow') flashSlow();
        break;
      case 'img':
        showTyping(false);
        photoBubble(m.data, 'them');
        notify();
        break;
      case 'imgSent': {
        const p = log.querySelector(`.msg.photo.pending[data-id="${CSS.escape(m.id)}"]`);
        if (p) p.classList.remove('pending');
        break;
      }
      case 'friendReq':
        friendRequestCard(m.name);
        notify();
        break;
      case 'friendAdded':
        addFriend(m.id, m.name);
        partner.friend = true; partner.id = m.id; if (m.name) partner.name = m.name;
        document.querySelectorAll('.sys.freq').forEach(n => n.remove());
        sys(tn('friendAdded', m.name || t('someone')));
        renderStatus(); updateFriendBtn();
        break;
      case 'friendDeclined':
        sys(t('friendDeclined'));
        break;
      case 'presence':
        presence = {};
        for (const p of m.online || []) {
          presence[p.id] = p;
          const f = friends.find(x => x.id === p.id);
          if (f && p.name && f.name !== p.name) f.name = p.name;
        }
        saveFriends();
        break;
      case 'invite': {
        const f = friends.find(x => x.id === m.from);
        if (!f) { send({ t: 'inviteDecline', id: m.from }); break; }   // only friends can invite
        if (m.name) { f.name = m.name; saveFriends(); }
        incomingInvite = m.from;
        showToast(tn('inviteIn', friendName(f)));
        notify();
        break;
      }
      case 'inviteFail': {
        const n = invitingFriend ? friendName(invitingFriend) : t('someone');
        invitingFriend = null;
        log.replaceChildren();
        setState('idle');
        sys(m.reason === 'declined' ? tn('inviteDeclined', n) : tn('inviteOffline', n));
        endActions();
        askPresence();
        break;
      }
      case 'inviteGone': hideToast(); break;
    }
  }

  function find() {
    invitingFriend = null;
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
    photoBtn.disabled = !chatting;
    skipArmed = false;
    renderStatus();
    updateSkip();
    updateFriendBtn();
  }
  function updateFriendBtn() {
    if (!addFriendBtn) return;
    const chatting = state === 'chatting';
    addFriendBtn.hidden = !chatting;
    addFriendBtn.disabled = !chatting || partner.friend || reqSent;
    addFriendBtn.textContent = partner.friend ? t('friendsYes') : reqSent ? t('reqSent') : t('addFriend');
  }
  addFriendBtn.addEventListener('click', () => {
    if (state !== 'chatting' || partner.friend || reqSent) return;
    reqSent = true; updateFriendBtn();
    send({ t: 'friendReq' });
  });
  function renderStatus() {
    const el = $('#status');
    if (!el) return;
    if (state === 'chatting') {
      const lead = document.createElement('span'); lead.textContent = t('chattingWith') + ' ';
      const b = document.createElement('b'); b.textContent = partner.name || t('stranger');
      lead.append(b); el.replaceChildren(lead);
      if (partner.friend) { const s = document.createElement('span'); s.className = 'chip'; s.textContent = t('friendChip'); el.append(s); }
      for (const c of common) { const s = document.createElement('span'); s.className = 'chip'; s.textContent = c; el.append(s); }
    } else if (state === 'waiting') el.textContent = t('searching');
    else if (state === 'inviting' && invitingFriend) el.textContent = tn('inviting', friendName(invitingFriend));
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
    else if (state === 'inviting') label.textContent = t('cancel');
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
    if (state === 'inviting') { send({ t: 'inviteCancel' }); invitingFriend = null; setState('idle'); log.replaceChildren(); endActions(); return; }
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
  function adultOk() { return store.get('fc-adult') === '1'; }
  function ensureConnected() { if (!ws) connect(); }
  function startChat() {
    wantChat = true;
    landing.hidden = true; chat.hidden = false;
    if (ws && ready) find();
    else { pendingFind = true; log.replaceChildren(); sys(t('connecting')); ensureConnected(); }
  }
  function sendInvite(f) {
    invitingFriend = f;
    log.replaceChildren();
    setState('inviting');
    sys(tn('inviting', friendName(f)));
    send({ t: 'invite', id: f.id });
  }
  function chatWithFriend(f) {
    if (!adultOk() && !$('#adultChk').checked) { $('#formError').textContent = t('needAdult'); $('#adultChk').focus(); return; }
    store.set('fc-adult', '1');
    wantChat = true;
    landing.hidden = true; chat.hidden = false;
    if (ws && ready) sendInvite(f);
    else { pendingInvite = f; ensureConnected(); }
  }

  // ---------- Invite toast ----------
  const toast = $('#toast');
  function showToast(text) { $('#toastText').textContent = text; toast.hidden = false; $('#toastYes').focus(); }
  function hideToast() { toast.hidden = true; incomingInvite = null; }
  $('#toastYes').addEventListener('click', () => {
    if (incomingInvite) send({ t: 'inviteAccept', id: incomingInvite });
    toast.hidden = true; incomingInvite = null;
  });
  $('#toastNo').addEventListener('click', () => {
    if (incomingInvite) send({ t: 'inviteDecline', id: incomingInvite });
    hideToast();
  });

  // ---------- Friend request card ----------
  function friendRequestCard(name) {
    const d = document.createElement('div'); d.className = 'sys freq';
    const p = document.createElement('div'); p.textContent = tn('friendReq', name || t('strangerCap'));
    const row = document.createElement('div'); row.className = 'row';
    const yes = document.createElement('button'); yes.className = 'btn primary'; yes.textContent = t('accept');
    const no = document.createElement('button'); no.className = 'btn ghost'; no.textContent = t('decline');
    yes.onclick = () => { send({ t: 'friendAccept' }); d.remove(); };
    no.onclick = () => { send({ t: 'friendDecline' }); d.remove(); };
    row.append(yes, no); d.append(p, row);
    const typing = log.querySelector('.typing-dots');
    typing ? log.insertBefore(d, typing) : log.append(d);
    scroll(true);
  }

  // ---------- Photos ----------
  const viewer = $('#viewer');
  function photoBubble(src, who, id) {
    const stick = atBottom() || who === 'you';
    const d = document.createElement('div');
    d.className = 'msg photo ' + who + (who === 'them' ? ' blurred' : '') + (id ? ' pending' : '');
    if (id) d.dataset.id = id;
    const img = new Image(); img.src = src; img.alt = '';
    img.onload = () => scroll(stick);
    d.append(img);
    if (who === 'them') {
      const r = document.createElement('button'); r.className = 'reveal'; r.textContent = t('tapToView');
      r.onclick = () => { d.classList.remove('blurred'); r.remove(); };
      d.append(r);
    }
    img.addEventListener('click', () => {
      if (d.classList.contains('blurred')) return;
      $('#viewerImg').src = src; viewer.showModal();
    });
    const typing = log.querySelector('.typing-dots');
    typing ? log.insertBefore(d, typing) : log.append(d);
    scroll(stick);
  }
  function photoFailed(id, msg) {
    const p = id && log.querySelector(`.msg.photo.pending[data-id="${CSS.escape(id)}"]`);
    if (p) p.remove();
    sys(msg);
  }
  // Re-encode in the browser: shrinks the file and strips location/camera metadata.
  async function prepPhoto(file) {
    if (file.size > 10 * 1024 * 1024) throw new Error('size');
    let bmp;
    try { bmp = await createImageBitmap(file, { imageOrientation: 'from-image' }); }
    catch { bmp = await new Promise((res, rej) => { const i = new Image(); i.onload = () => res(i); i.onerror = rej; i.src = URL.createObjectURL(file); }); }
    let max = 1280, q = 0.82;
    for (let tries = 0; tries < 5; tries++) {
      const scale = Math.min(1, max / Math.max(bmp.width, bmp.height));
      const c = document.createElement('canvas');
      c.width = Math.max(1, Math.round(bmp.width * scale)); c.height = Math.max(1, Math.round(bmp.height * scale));
      c.getContext('2d').drawImage(bmp, 0, 0, c.width, c.height);
      let url = c.toDataURL('image/webp', q);
      if (!url.startsWith('data:image/webp')) url = c.toDataURL('image/jpeg', q);
      if (url.length < 600 * 1024 * 1.3) return url;
      max = Math.round(max * 0.8); q = Math.max(0.5, q - 0.1);
    }
    throw new Error('size');
  }
  let photoSeq = 0;
  photoBtn.addEventListener('click', () => { if (state === 'chatting') photoInput.click(); });
  photoInput.addEventListener('change', async () => {
    const file = photoInput.files && photoInput.files[0];
    photoInput.value = '';
    if (!file || state !== 'chatting') return;
    if (!/^image\//.test(file.type) && !/\.(jpe?g|png|webp|gif|heic)$/i.test(file.name)) { sys(t('photoBad')); return; }
    try {
      const data = await prepPhoto(file);
      const id = 'p' + (++photoSeq);
      photoBubble(data, 'you', id);
      send({ t: 'img', data, id });
    } catch (e) {
      sys(e && e.message === 'size' ? t('photoSizeErr') : t('photoBad'));
    }
  });
  $('#startForm').addEventListener('submit', e => {
    e.preventDefault();
    if (tagInput.value.trim()) { addTag(tagInput.value); tagInput.value = ''; }
    if (!$('#adultChk').checked) { $('#formError').textContent = t('needAdult'); $('#adultChk').focus(); return; }
    $('#formError').textContent = '';
    store.set('fc-adult', '1');
    store.set('fc-name', myName());
    send({ t: 'name', name: myName() });
    startChat();
  });
  $('#adultChk').addEventListener('change', () => { $('#formError').textContent = ''; });
  $('#homeLink').addEventListener('click', e => {
    e.preventDefault();
    wantChat = false;
    if (state === 'inviting') send({ t: 'inviteCancel' });
    if (state === 'chatting' || state === 'waiting') send({ t: 'stop' });
    invitingFriend = null;
    setState('idle');
    chat.hidden = true; landing.hidden = false;
    askPresence();
  });

  $('#langBtn').addEventListener('click', () => { lang = lang === 'ar' ? 'en' : 'ar'; store.set('fc-lang', lang); applyLang(); });

  // Online count on the landing page.
  function pollOnline() {
    if (!landing.hidden) fetch('/api/online').then(r => r.json()).then(d => setOnline(d.online)).catch(() => {});
  }
  pollOnline();
  setInterval(pollOnline, 15000);

  // Returning visitors who already confirmed 18+ connect right away, so friends can see them online.
  if (adultOk()) { $('#adultChk').checked = true; connect(); }

  applyLang();
})();
