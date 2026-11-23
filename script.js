/* =========================================================
   Pokédex
   Fontes de dados:
   - PokéAPI (REST)          dados de Pokémon, espécie, evolução, gritos
   - PokeAPI/sprites         imagens (animado Showdown, arte oficial, HOME)
   - Pokémon Showdown        tier competitivo, Mega Pedras (data/megas.js) e sprites extras
   - MyMemory                tradução da descrição para português (sob demanda)
   ========================================================= */

const API = 'https://pokeapi.co/api/v2';
const SPRITES = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon';
const SHOWDOWN_DEX = 'https://play.pokemonshowdown.com/data/pokedex.json';
const SHOWDOWN_SPRITES = 'https://play.pokemonshowdown.com/sprites';
const MEGA_STONES = window.MEGA_STONES || {};
const TRANSLATE = 'https://api.mymemory.translated.net/get';

/* ---------- Traduções fixas ---------- */

const TYPE_PT = {
  normal: 'Normal', fire: 'Fogo', water: 'Água', electric: 'Elétrico', grass: 'Planta',
  ice: 'Gelo', fighting: 'Lutador', poison: 'Venenoso', ground: 'Terrestre', flying: 'Voador',
  psychic: 'Psíquico', bug: 'Inseto', rock: 'Pedra', ghost: 'Fantasma', dragon: 'Dragão',
  dark: 'Sombrio', steel: 'Aço', fairy: 'Fada', stellar: 'Estelar', unknown: '???',
};

const STAT_PT = {
  hp: 'PS', attack: 'Ataque', defense: 'Defesa',
  'special-attack': 'At. Esp.', 'special-defense': 'Def. Esp.', speed: 'Velocidade',
};

const STAT_COLOR = {
  hp: '#5fbd58', attack: '#f5ac36', defense: '#f2d54b',
  'special-attack': '#4fa3e3', 'special-defense': '#8b7fd6', speed: '#ee6b8f',
};

const GROWTH_PT = {
  slow: 'Lento', medium: 'Médio', fast: 'Rápido', 'medium-slow': 'Médio-lento',
  'slow-then-very-fast': 'Errático', 'fast-then-very-slow': 'Flutuante',
};

const EGG_PT = {
  monster: 'Monstro', water1: 'Água 1', water2: 'Água 2', water3: 'Água 3', bug: 'Inseto',
  flying: 'Voador', ground: 'Campo', fairy: 'Fada', plant: 'Planta', humanshape: 'Humanoide',
  mineral: 'Mineral', indeterminate: 'Amorfo', ditto: 'Ditto', dragon: 'Dragão',
  'no-eggs': 'Não se reproduz',
};

const FORM_PT = {
  mega: 'Mega', 'mega-x': 'Mega X', 'mega-y': 'Mega Y', 'mega-z': 'Mega Z',
  gmax: 'Gigantamax', alola: 'Alola', galar: 'Galar', hisui: 'Hisui', paldea: 'Paldea',
  primal: 'Primal', origin: 'Origem', therian: 'Therian', incarnate: 'Encarnada',
};

const VERSION_PT = {
  'red-blue': 'Red e Blue', 'red-green-japan': 'Red e Green (Japão)', 'blue-japan': 'Blue (Japão)', yellow: 'Yellow',
  'gold-silver': 'Gold e Silver', crystal: 'Crystal', 'ruby-sapphire': 'Ruby e Sapphire', emerald: 'Emerald',
  'firered-leafgreen': 'FireRed e LeafGreen', 'diamond-pearl': 'Diamond e Pearl', platinum: 'Platinum',
  'heartgold-soulsilver': 'HeartGold e SoulSilver', 'black-white': 'Black e White', colosseum: 'Colosseum',
  xd: 'XD', 'black-2-white-2': 'Black 2 e White 2', 'x-y': 'X e Y',
  'omega-ruby-alpha-sapphire': 'Omega Ruby e Alpha Sapphire', 'sun-moon': 'Sun e Moon',
  'ultra-sun-ultra-moon': 'Ultra Sun e Ultra Moon', 'lets-go-pikachu-lets-go-eevee': "Let's Go, Pikachu! e Eevee!",
  'sword-shield': 'Sword e Shield', 'the-isle-of-armor': 'Sword e Shield (The Isle of Armor)',
  'the-crown-tundra': 'Sword e Shield (The Crown Tundra)',
  'brilliant-diamond-shining-pearl': 'Brilliant Diamond e Shining Pearl', 'legends-arceus': 'Legends: Arceus',
  'scarlet-violet': 'Scarlet e Violet', 'the-teal-mask': 'Scarlet e Violet (The Teal Mask)',
  'the-indigo-disk': 'Scarlet e Violet (The Indigo Disk)', 'legends-za': 'Legends: Z-A',
  'mega-dimension': 'Legends: Z-A (Mega Dimension)', champions: 'Champions',
};

const REGIONS = {
  alola: { nome: 'Alola', sobre: 'região inspirada no Havaí' },
  galar: { nome: 'Galar', sobre: 'região inspirada no Reino Unido' },
  hisui: { nome: 'Hisui', sobre: 'a antiga Sinnoh, séculos atrás' },
  paldea: { nome: 'Paldea', sobre: 'região inspirada na Península Ibérica' },
};

const KIND_LABEL = {
  padrao: 'Forma padrão', mega: 'Mega Evolução', primal: 'Regressão Primal',
  gmax: 'Gigantamax', regional: 'Forma regional', alternativa: 'Forma alternativa',
};

/* Tabela de tipos: atacante -> { defensor: multiplicador } (só o que difere de 1) */
const TYPE_CHART = {
  normal:   { rock: .5, ghost: 0, steel: .5 },
  fire:     { fire: .5, water: .5, grass: 2, ice: 2, bug: 2, rock: .5, dragon: .5, steel: 2 },
  water:    { fire: 2, water: .5, grass: .5, ground: 2, rock: 2, dragon: .5 },
  electric: { water: 2, electric: .5, grass: .5, ground: 0, flying: 2, dragon: .5 },
  grass:    { fire: .5, water: 2, grass: .5, poison: .5, ground: 2, flying: .5, bug: .5, rock: 2, dragon: .5, steel: .5 },
  ice:      { fire: .5, water: .5, grass: 2, ice: .5, ground: 2, flying: 2, dragon: 2, steel: .5 },
  fighting: { normal: 2, ice: 2, poison: .5, flying: .5, psychic: .5, bug: .5, rock: 2, ghost: 0, dark: 2, steel: 2, fairy: .5 },
  poison:   { grass: 2, poison: .5, ground: .5, rock: .5, ghost: .5, steel: 0, fairy: 2 },
  ground:   { fire: 2, electric: 2, grass: .5, poison: 2, flying: 0, bug: .5, rock: 2, steel: 2 },
  flying:   { electric: .5, grass: 2, fighting: 2, bug: 2, rock: .5, steel: .5 },
  psychic:  { fighting: 2, poison: 2, psychic: .5, dark: 0, steel: .5 },
  bug:      { fire: .5, grass: 2, fighting: .5, poison: .5, flying: .5, psychic: 2, ghost: .5, dark: 2, steel: .5, fairy: .5 },
  rock:     { fire: 2, ice: 2, fighting: .5, ground: .5, flying: 2, bug: 2, steel: .5 },
  ghost:    { normal: 0, psychic: 2, ghost: 2, dark: .5 },
  dragon:   { dragon: 2, steel: .5, fairy: 0 },
  dark:     { fighting: .5, psychic: 2, ghost: 2, dark: .5, fairy: .5 },
  steel:    { fire: .5, water: .5, electric: .5, ice: 2, rock: 2, steel: .5, fairy: 2 },
  fairy:    { fire: .5, fighting: 2, poison: .5, dragon: 2, dark: 2, steel: .5 },
};

/* ---------- Elementos ---------- */

const $ = (sel) => document.querySelector(sel);
const el = {
  dex: $('.dex'), sheet: $('#sheet'),
  number: $('#number'), sprite: $('#sprite'), status: $('#status'),
  name: $('#name'), genus: $('#genus'), types: $('#types'), tags: $('#tags'),
  flavor: $('#flavor'), flavorSource: $('#flavor-source'), translate: $('#btn-translate'),
  facts: $('#facts'), stats: $('#stats'), matchups: $('#matchups'),
  formsBlock: $('#block-forms'), forms: $('#forms'), formInfo: $('#form-info'), formsSummary: $('#forms-summary'), evo: $('#evo'), sources: $('#sources'),
  form: $('#search'), input: $('#search-input'), list: $('#pokemon-list'),
  prev: $('#btn-prev'), next: $('#btn-next'), random: $('#btn-random'),
  cry: $('#btn-cry'), shiny: $('#btn-shiny'), artButtons: document.querySelectorAll('[data-art]'),
  speaker: $('#speaker'), music: $('#btn-music'), musicLabel: $('#music-label'),
  tabs: $('#tabs'), tabButtons: document.querySelectorAll('.tabs [data-tab]'),
  tabBlocks: document.querySelectorAll('.block[data-tab]'), sheetHead: $('.sheet-head'), screen: $('#screen'),
};

/* ---------- Estado ---------- */

const state = {
  maxSpecies: 1025,      // atualizado pela API ao iniciar
  speciesId: 1,
  current: null,         // { pokemon, species, chain }
  art: localStorage.getItem('dex-art') || 'animado',
  shiny: false,
  requestId: 0,
  showdown: null,        // dados do Showdown (carregados uma vez)
  flavorEn: '',
  tab: 'sobre',          // aba ativa da ficha (só tem efeito no celular)
  dir: 0,                // -1 anterior, 1 próximo, 0 busca (direção da animação)
  shownNumber: 0,
};

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

/* ---------- Utilidades ---------- */

const cache = new Map();

function absolute(url) {
  // a API às vezes devolve caminhos relativos ("/api/v2/...")
  return url.startsWith('http') ? url : `https://pokeapi.co${url}`;
}

async function getJSON(url) {
  url = absolute(url);
  if (cache.has(url)) return cache.get(url);
  const promise = fetch(url).then((res) => {
    if (!res.ok) throw Object.assign(new Error(`HTTP ${res.status}`), { status: res.status });
    return res.json();
  });
  cache.set(url, promise);
  promise.catch(() => cache.delete(url));
  return promise;
}

const idFromUrl = (url) => Number(url.match(/\/(\d+)\/?$/)[1]);
const pad = (n) => `#${String(n).padStart(4, '0')}`;
const titleCase = (slug) => slug.split('-').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
const romanGen = (name) => name.replace('generation-', '').toUpperCase();

function localized(list, field, langs = ['pt-br', 'es', 'en']) {
  for (const lang of langs) {
    const hit = [...list].reverse().find((e) => e.language.name === lang);
    if (hit) return { text: hit[field], lang, entry: hit };
  }
  return null;
}

function normalizeQuery(q) {
  return q.trim().toLowerCase()
    .normalize('NFD').replace(/[̀-ͯ]/g, '')   // remove acentos (Flabébé -> flabebe)
    .replace(/[♀]/g, '-f').replace(/[♂]/g, '-m')
    .replace(/[.'’:]/g, '')
    .replace(/\s+/g, '-')
    .replace(/^#?0*(\d+)$/, '$1');                     // "#025" -> "25"
}

function cleanText(text) {
  return text.replace(/[\f\n\r­]+/g, ' ').replace(/\s{2,}/g, ' ').trim();
}

function typeBadge(type, small = false) {
  return `<span class="type t-${type}${small ? ' type--sm' : ''}">${TYPE_PT[type] ?? titleCase(type)}</span>`;
}

function formLabel(pokemonName, speciesName) {
  if (pokemonName === speciesName) return 'Padrão';
  const suffix = pokemonName.startsWith(speciesName + '-') ? pokemonName.slice(speciesName.length + 1) : pokemonName;
  return FORM_PT[suffix] ?? titleCase(suffix).replace(/\bMega\b/, 'Mega');
}

const compact = (s) => s.replace(/[^a-z0-9]/g, '');

function formKind(pokemonName, speciesName, form) {
  const suffix = pokemonName === speciesName ? '' : pokemonName.replace(speciesName + '-', '');
  const parts = suffix.split('-');
  if (form?.is_mega || parts.includes('mega')) return { kind: 'mega' };
  if (parts.includes('primal')) return { kind: 'primal' };
  if (parts.includes('gmax')) return { kind: 'gmax' };
  const region = parts.find((p) => REGIONS[p]);
  if (region) return { kind: 'regional', region };
  if (!suffix || form?.is_default) return { kind: 'padrao' };
  return { kind: 'alternativa' };
}

// Nome usado pelo Pokémon Showdown nos arquivos de sprite (ex.: charizard-megax, raichu-alola)
function showdownSpriteId(pokemon, species) {
  const base = compact(species.name);
  if (pokemon.is_default || pokemon.name === species.name) return base;
  const suffix = pokemon.name.startsWith(species.name + '-') ? pokemon.name.slice(species.name.length + 1) : '';
  return suffix ? `${base}-${compact(suffix)}` : base;
}

/* ---------- Carregamento ---------- */

async function resolvePokemon(query) {
  const q = normalizeQuery(String(query));
  // 1) tenta como Pokémon (cobre formas: charizard-mega-x, raichu-alola...)
  try {
    return await getJSON(`${API}/pokemon/${q}`);
  } catch (err) {
    if (err.status !== 404) throw err;
  }
  // 2) tenta como espécie (ex.: "deoxys", "giratina") e usa a forma padrão
  const species = await getJSON(`${API}/pokemon-species/${q}`);
  const def = species.varieties.find((v) => v.is_default) ?? species.varieties[0];
  return getJSON(def.pokemon.url);
}

async function load(query, { updateHash = true } = {}) {
  const myId = ++state.requestId;
  setLoading(true);

  try {
    const pokemon = await resolvePokemon(query);
    const species = await getJSON(pokemon.species.url);
    const chain = species.evolution_chain ? await getJSON(species.evolution_chain.url) : null;
    if (myId !== state.requestId) return; // o usuário já pediu outro

    const previous = state.current?.pokemon;
    state.speciesId = species.id;
    state.current = { pokemon, species, chain };
    render(previous);
    loadVarieties(myId);
    if (updateHash && location.hash.slice(1) !== pokemon.name) {
      history.replaceState(null, '', `#${pokemon.name}`);
    }
  } catch (err) {
    if (myId !== state.requestId) return;
    state.dir = 0;
    showError(err);
  } finally {
    if (myId === state.requestId) setLoading(false);
  }
}

function setLoading(on) {
  el.dex.classList.toggle('is-loading', on);
  el.sheet.setAttribute('aria-busy', String(on));
  if (on) el.status.textContent = 'Carregando...';
}

function showError(err) {
  // mantém o último Pokémon na tela; só limpa se ainda não havia nenhum
  if (!state.current) {
    el.sprite.removeAttribute('src');
    el.sprite.alt = '';
  }
  if (err.status === 404) {
    el.status.textContent = 'Pokémon não encontrado. Confira o nome ou use o número.';
  } else {
    el.status.textContent = 'Sem conexão com a PokéAPI. Tente de novo em instantes.';
  }
}

/* ---------- Renderização ---------- */

function render(previous) {
  const { pokemon, species } = state.current;
  const changed = previous?.name !== pokemon.name;
  const baseName = localized(species.names, 'name', ['en'])?.text ?? titleCase(species.name);
  const isDefault = pokemon.is_default;
  const label = formLabel(pokemon.name, species.name);
  const displayName = isDefault ? baseName : `${baseName} (${label})`;

  document.title = `${displayName} | Pokédex`;
  el.status.textContent = '';
  rollNumber(species.id);
  el.name.textContent = displayName;

  const genus = localized(species.genera, 'genus', ['en']);
  el.genus.textContent = genus ? `${genus.text} · Geração ${romanGen(species.generation.name)}` : '';

  const types = pokemon.types.map((t) => t.type.name);
  el.types.innerHTML = types.map((t) => `<li>${typeBadge(t)}</li>`).join('');

  renderTags(species, pokemon);
  renderSprite(changed ? 'enter' : null);
  renderFlavor(species);
  renderFacts(pokemon, species);
  renderStats(pokemon.stats);
  renderMatchups(types);
  renderForms();
  renderEvolution();
  renderSources(species, baseName);

  el.prev.disabled = species.id <= 1;
  el.next.disabled = species.id >= state.maxSpecies;
  el.cry.disabled = !(pokemon.cries?.latest || pokemon.cries?.legacy);

  applyTab();
  if (changed) restartAnimation(el.sheet, 'is-swapping');
}

/* ---------- Abas (celular) ---------- */

function applyTab({ animate = false } = {}) {
  const formsTab = [...el.tabButtons].find((b) => b.dataset.tab === 'formas');
  formsTab.hidden = el.formsBlock.hidden;
  if (state.tab === 'formas' && el.formsBlock.hidden) state.tab = 'sobre';

  el.tabButtons.forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.tab === state.tab)));
  el.tabBlocks.forEach((block) => {
    const on = block.dataset.tab === state.tab;
    block.classList.toggle('tab-off', !on);
    block.classList.remove('tab-in');
    if (on && animate && !reducedMotion.matches) {
      void block.offsetWidth;
      block.classList.add('tab-in');
    }
  });
}

el.tabButtons.forEach((btn) => btn.addEventListener('click', () => {
  state.tab = btn.dataset.tab;
  applyTab({ animate: true });
  btn.scrollIntoView({ block: 'nearest', inline: 'center' });
  // se a pessoa já rolou para baixo, volta para o começo da aba
  const top = el.sheetHead.getBoundingClientRect().bottom + window.scrollY;
  if (window.scrollY > top) window.scrollTo({ top, behavior: reducedMotion.matches ? 'auto' : 'smooth' });
}));

/* ---------- Deslizar na tela (celular) ---------- */

let touchStart = null;
el.screen.addEventListener('touchstart', (e) => {
  const t = e.touches[0];
  touchStart = { x: t.clientX, y: t.clientY };
}, { passive: true });

el.screen.addEventListener('touchend', (e) => {
  if (!touchStart) return;
  const t = e.changedTouches[0];
  const dx = t.clientX - touchStart.x;
  const dy = t.clientY - touchStart.y;
  touchStart = null;
  if (Math.abs(dx) < 50 || Math.abs(dx) < Math.abs(dy) * 1.5) return; // foi rolagem, não deslize
  if (dx < 0) el.next.click(); else el.prev.click();
});

/* ---------- Animações ---------- */

function restartAnimation(node, cls) {
  if (reducedMotion.matches) return;
  node.classList.remove(cls);
  void node.offsetWidth; // força o navegador a reiniciar a animação
  node.classList.add(cls);
}

// número do visor "rola" até o novo valor
function rollNumber(target) {
  const from = state.shownNumber;
  state.shownNumber = target;
  if (reducedMotion.matches || !from || Math.abs(target - from) > 400) {
    el.number.textContent = pad(target);
    return;
  }
  const start = performance.now();
  const dur = 350;
  const step = (now) => {
    const t = Math.min(1, (now - start) / dur);
    const eased = 1 - (1 - t) ** 3;
    el.number.textContent = pad(Math.round(from + (target - from) * eased));
    if (t < 1 && state.shownNumber === target) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

function sparkleBurst() {
  if (reducedMotion.matches) return;
  const screen = $('#screen');
  for (let i = 0; i < 9; i++) {
    const s = document.createElement('span');
    s.className = 'sparkle';
    s.style.left = `${20 + Math.random() * 60}%`;
    s.style.top = `${15 + Math.random() * 60}%`;
    s.style.animationDelay = `${i * 45}ms`;
    s.style.scale = String(0.6 + Math.random() * 0.8);
    screen.appendChild(s);
    s.addEventListener('animationend', () => s.remove());
  }
}

function finishBoot() {
  el.dex.classList.remove('is-booting');
}

function renderTags(species, pokemon) {
  const tags = [];
  if (species.is_legendary) tags.push('<li class="tag tag--strong">Lendário</li>');
  if (species.is_mythical) tags.push('<li class="tag tag--strong">Mítico</li>');
  if (species.is_baby) tags.push('<li class="tag">Bebê</li>');
  const tier = showdownTier(pokemon, species);
  if (tier) tags.push(`<li class="tag" title="Tier competitivo segundo o Pokémon Showdown">Tier ${tier}</li>`);
  el.tags.innerHTML = tags.join('');
}

function spriteCandidates(pokemon) {
  const s = pokemon.sprites;
  const sh = state.shiny;
  const pick = (obj) => obj && (sh ? obj.front_shiny : obj.front_default);
  const animated = pick(s.other?.showdown);
  const art = pick(s.other?.['official-artwork']);
  const home = pick(s.other?.home);
  const basic = pick(s);
  // servidor de sprites do Showdown: segunda fonte de GIFs animados
  const sd = showdownSpriteId(pokemon, state.current.species);
  const sdAni = `${SHOWDOWN_SPRITES}/${sh ? 'ani-shiny' : 'ani'}/${sd}.gif`;
  const sdGen5 = `${SHOWDOWN_SPRITES}/${sh ? 'gen5ani-shiny' : 'gen5ani'}/${sd}.gif`;
  const order = {
    animado: [animated, sdGen5, sdAni, home, art, basic],
    arte: [art, home, basic],
    home: [home, art, basic],
  }[state.art];
  // se não existe versão shiny, cai para a normal
  if (sh) {
    order.push(s.other?.['official-artwork']?.front_default, s.other?.home?.front_default, s.front_default);
  }
  return [...new Set(order.filter(Boolean))];
}

function renderSprite(anim = 'swap') {
  const { pokemon } = state.current;
  const candidates = spriteCandidates(pokemon);
  const dir = state.dir;
  state.dir = 0;
  el.sprite.onload = () => {
    if (!anim) return;
    el.sprite.style.setProperty('--dx', `${dir * 40}px`);
    el.sprite.classList.remove('is-entering', 'is-swapping');
    restartAnimation(el.sprite, anim === 'enter' ? 'is-entering' : 'is-swapping');
  };
  let i = 0;
  const tryNext = () => {
    if (i >= candidates.length) {
      el.sprite.removeAttribute('src');
      el.status.textContent = 'Sem imagem para esta forma.';
      return;
    }
    const url = candidates[i++];
    el.sprite.classList.toggle('is-pixel', url.endsWith('.gif') || /\/pokemon\/(shiny\/)?\d+\.png$/.test(url));
    el.sprite.src = url;
  };
  el.sprite.onerror = tryNext;
  el.sprite.alt = `Imagem de ${el.name.textContent}`;
  tryNext();
}

function renderFlavor(species) {
  const entry = localized(species.flavor_text_entries, 'flavor_text', ['pt-br', 'en', 'es-419', 'es']);
  state.flavorEn = '';
  el.translate.hidden = true;
  el.translate.disabled = false;
  el.translate.textContent = 'Traduzir para português';

  if (!entry) {
    el.flavor.textContent = 'A PokéAPI ainda não tem descrição para esta espécie.';
    el.flavorSource.textContent = '';
    return;
  }
  const text = cleanText(entry.text);
  el.flavor.textContent = text;
  el.flavor.lang = entry.lang;
  const langName = { 'pt-br': 'português', 'es-419': 'espanhol', es: 'espanhol', en: 'inglês' }[entry.lang];
  el.flavorSource.textContent = `Pokémon ${titleCase(entry.entry.version.name)}, em ${langName}.`;

  if (entry.lang !== 'pt-br') {
    state.flavorEn = text;
    state.flavorLang = entry.lang.startsWith('es') ? 'es' : 'en';
    const saved = readTranslation(text);
    if (saved) {
      showTranslation(saved);
    } else {
      el.translate.hidden = false;
    }
  }
}

function renderFacts(pokemon, species) {
  const female = species.gender_rate;
  const gender = female === -1 ? 'Sem gênero'
    : `${(100 - female * 12.5).toLocaleString('pt-BR')}% ♂, ${(female * 12.5).toLocaleString('pt-BR')}% ♀`;
  const abilities = pokemon.abilities
    .map((a) => titleCase(a.ability.name) + (a.is_hidden ? ' (oculta)' : ''))
    .join(', ');
  const eggs = species.egg_groups.map((e) => EGG_PT[e.name] ?? titleCase(e.name)).join(', ');

  const rows = [
    ['Altura', `${(pokemon.height / 10).toLocaleString('pt-BR')} m`],
    ['Peso', `${(pokemon.weight / 10).toLocaleString('pt-BR')} kg`],
    ['Habilidades', abilities],
    ['Gênero', gender],
    ['Taxa de captura', `${species.capture_rate} de 255`],
    ['Felicidade base', species.base_happiness ?? '—'],
    ['Crescimento', GROWTH_PT[species.growth_rate?.name] ?? '—'],
    ['Grupos de ovo', eggs || '—'],
    ['Ciclos para chocar', species.hatch_counter ?? '—'],
  ];
  el.facts.innerHTML = rows.map(([k, v]) => `<div><dt>${k}</dt><dd>${v}</dd></div>`).join('');
}

function renderStats(stats, baseStats = null) {
  const sum = (list) => list.reduce((n, s) => n + s.base_stat, 0);
  const total = sum(stats);
  const diffCell = (d) => {
    if (!baseStats) return '';
    const cls = d > 0 ? 'up' : d < 0 ? 'down' : 'same';
    return `<td class="diff diff--${cls}">${d > 0 ? '+' : ''}${d || ''}</td>`;
  };
  const rows = stats.map((s, i) => {
    const name = s.stat.name;
    const pct = Math.min(100, (s.base_stat / 200) * 100);
    const d = baseStats ? s.base_stat - baseStats[i].base_stat : 0;
    return `<tr>
      <th scope="row">${STAT_PT[name] ?? name}</th>
      <td class="value">${s.base_stat}</td>
      <td><div class="bar"><span style="width:${pct}%;background:${STAT_COLOR[name] ?? '#888'}"></span></div></td>
      ${diffCell(d)}
    </tr>`;
  });
  rows.push(`<tr class="total"><th scope="row">Total</th><td class="value">${total}</td><td></td>${diffCell(baseStats ? total - sum(baseStats) : 0)}</tr>`);
  if (baseStats) rows.unshift('<caption>Última coluna: diferença para a forma padrão</caption>');
  el.stats.innerHTML = rows.join('');
}

function renderMatchups(defTypes) {
  const groups = new Map();
  for (const atk of Object.keys(TYPE_CHART)) {
    const mult = defTypes.reduce((m, def) => m * (TYPE_CHART[atk][def] ?? 1), 1);
    if (mult === 1) continue;
    if (!groups.has(mult)) groups.set(mult, []);
    groups.get(mult).push(atk);
  }
  const labels = { 4: '4×', 2: '2×', 0.5: '½×', 0.25: '¼×', 0: '0×' };
  const desc = { 4: 'Muito fraco', 2: 'Fraco', 0.5: 'Resiste', 0.25: 'Resiste muito', 0: 'Imune' };
  el.matchups.innerHTML = [4, 2, 0.5, 0.25, 0]
    .filter((m) => groups.has(m))
    .map((m) => `<div class="matchup">
        <span class="matchup__mult" title="${desc[m]}">${labels[m]}</span>
        <span class="matchup__list">${groups.get(m).map((t) => typeBadge(t, true)).join('')}</span>
      </div>`)
    .join('');
}

function renderForms() {
  // a seção é preenchida por loadVarieties(), que busca os dados de cada forma
  el.formInfo.hidden = true;
  el.formInfo.innerHTML = '';
  const { species } = state.current;
  if (species.varieties.length < 2) {
    el.formsBlock.hidden = true;
    return;
  }
  el.formsBlock.hidden = false;
  el.formsSummary.textContent = 'Carregando formas...';
  el.forms.innerHTML = '';
}

async function loadVarieties(myId) {
  const { species, pokemon } = state.current;
  if (species.varieties.length < 2) return;

  let forms;
  try {
    forms = await Promise.all(species.varieties.map(async (v) => {
      const p = await getJSON(v.pokemon.url);
      const form = p.forms?.[0] ? await getJSON(p.forms[0].url).catch(() => null) : null;
      return { pokemon: p, form, isDefault: v.is_default, ...formKind(p.name, species.name, form) };
    }));
  } catch {
    if (myId === state.requestId) el.formsSummary.textContent = 'Não foi possível carregar as formas agora. Tente de novo em instantes.';
    return;
  }
  if (myId !== state.requestId) return;

  const current = forms.find((f) => f.pokemon.name === pokemon.name);
  const base = forms.find((f) => f.isDefault) ?? forms[0];

  // resumo: "Além da forma padrão: 2 Mega Evoluções, 1 forma regional."
  const count = (k) => forms.filter((f) => f.kind === k).length;
  const plural = (n, one, many) => `${n} ${n === 1 ? one : many}`;
  const summary = [
    count('mega') && plural(count('mega'), 'Mega Evolução', 'Mega Evoluções'),
    count('primal') && 'Regressão Primal',
    count('regional') && plural(count('regional'), 'forma regional', 'formas regionais'),
    count('gmax') && plural(count('gmax'), 'forma Gigantamax', 'formas Gigantamax'),
    count('alternativa') && plural(count('alternativa'), 'forma alternativa', 'formas alternativas'),
  ].filter(Boolean);
  el.formsSummary.textContent = summary.length ? `Além da forma padrão: ${summary.join(', ')}.` : '';

  el.forms.innerHTML = forms.map((f) => {
    const p = f.pokemon;
    const img = p.sprites?.other?.home?.front_default
      || p.sprites?.other?.['official-artwork']?.front_default
      || p.sprites?.front_default || '';
    const debut = VERSION_PT[f.form?.version_group?.name];
    const kindText = f.kind === 'regional' ? `Forma de ${REGIONS[f.region].nome}` : KIND_LABEL[f.kind];
    return `<button type="button" class="form-card" data-load="${p.name}" aria-current="${p.name === pokemon.name}">
        ${img ? `<img src="${img}" alt="" loading="lazy" width="64" height="64">` : '<span class="form-card__noimg"></span>'}
        <span class="form-card__body">
          <span class="form-card__name">${formLabel(p.name, species.name)}</span>
          <span class="form-card__kind form-card__kind--${f.kind}">${kindText}</span>
          <span class="form-card__types">${p.types.map((t) => typeBadge(t.type.name, true)).join('')}</span>
          ${debut ? `<span class="form-card__debut">Estreia: ${debut}</span>` : ''}
        </span>
      </button>`;
  }).join('');

  if (current && !current.isDefault) {
    renderFormInfo(current, base);
    const changed = pokemon.stats.some((st, i) => st.base_stat !== base.pokemon.stats[i]?.base_stat);
    if (changed) renderStats(pokemon.stats, base.pokemon.stats);
  }
}

function renderFormInfo(current, base) {
  const p = current.pokemon;
  const debut = VERSION_PT[current.form?.version_group?.name];
  const lines = [];

  if (current.kind === 'primal') {
    const info = MEGA_STONES[compact(p.name)];
    lines.push(`Regressão Primal: acontece sozinha quando o Pokémon entra em batalha segurando a <strong>${info?.pedra ?? 'Orbe correspondente'}</strong>.`);
    lines.push('Só existe durante a batalha.');
  } else if (current.kind === 'mega') {
    const info = MEGA_STONES[compact(p.name)];
    if (info?.golpe) {
      lines.push(`Mega Evolução sem pedra: o Pokémon precisa saber o golpe <strong>${info.golpe}</strong>.`);
    } else {
      lines.push(`Mega Evolução: o Pokémon precisa segurar a <strong>${info?.pedra ?? 'Mega Pedra correspondente'}</strong>, e o treinador precisa de uma Key Stone.`);
    }
    lines.push('Só existe durante a batalha e volta ao normal quando ela termina. Apenas um Pokémon por batalha pode Mega Evoluir.');
  } else if (current.kind === 'gmax') {
    lines.push('Forma Gigantamax: aparece só em batalha, por três turnos, em Pokémon com o Fator Gigantamax.');
  } else if (current.kind === 'regional') {
    const r = REGIONS[current.region];
    lines.push(`Forma regional de <strong>${r.nome}</strong> (${r.sobre}). É a mesma espécie adaptada ao ambiente daquela região, com aparência própria e, às vezes, outros tipos e habilidades.`);
  } else {
    lines.push(`Forma alternativa de ${titleCase(state.current.species.name)}.`);
  }
  if (debut) lines.push(`Estreou em Pokémon ${debut}.`);

  // diferenças em relação à forma padrão
  const typesNow = p.types.map((t) => TYPE_PT[t.type.name]).join('/');
  const typesBase = base.pokemon.types.map((t) => TYPE_PT[t.type.name]).join('/');
  if (typesNow !== typesBase) lines.push(`Tipo: ${typesNow} (na forma padrão: ${typesBase}).`);

  const abNow = p.abilities.map((a) => titleCase(a.ability.name)).join(', ');
  const abBase = base.pokemon.abilities.map((a) => titleCase(a.ability.name)).join(', ');
  if (abNow !== abBase) lines.push(`Habilidade: ${abNow} (na forma padrão: ${abBase}).`);

  const total = (stats) => stats.reduce((n, s) => n + s.base_stat, 0);
  const diff = total(p.stats) - total(base.pokemon.stats);
  if (diff) lines.push(`Atributos base: total de ${total(p.stats)}, ${diff > 0 ? '+' : ''}${diff} em relação à forma padrão.`);

  el.formInfo.innerHTML = `<h3>${KIND_LABEL[current.kind]}</h3>` + lines.map((l) => `<p>${l}</p>`).join('');
  el.formInfo.hidden = false;
}

function evolutionHow(details) {
  const d = details?.[0];
  if (!d) return '';
  const parts = [];
  const trigger = d.trigger?.name;
  if (trigger === 'level-up') {
    if (d.min_level) parts.push(`Nv. ${d.min_level}`);
    else if (d.min_happiness) parts.push('Amizade');
    else if (d.min_affection) parts.push('Afeto');
    else if (d.known_move) parts.push(`Sabendo ${titleCase(d.known_move.name)}`);
    else if (d.known_move_type) parts.push(`Golpe tipo ${TYPE_PT[d.known_move_type.name]}`);
    else if (d.location) parts.push('Em local específico');
    else parts.push('Subir de nível');
  } else if (trigger === 'use-item' && d.item) {
    parts.push(titleCase(d.item.name));
  } else if (trigger === 'trade') {
    parts.push('Troca');
  } else if (trigger) {
    parts.push(titleCase(trigger));
  }
  if (d.held_item) parts.push(`segurando ${titleCase(d.held_item.name)}`);
  if (d.time_of_day === 'day') parts.push('de dia');
  if (d.time_of_day === 'night') parts.push('à noite');
  return parts.join(', ');
}

function renderEvolution() {
  const { chain, species } = state.current;
  if (!chain) {
    el.evo.innerHTML = '<p class="evo__single">Sem dados de evolução.</p>';
    return;
  }
  // agrupa por estágio (largura), para lidar com ramificações como Eevee
  const stages = [];
  const walk = (node, depth) => {
    (stages[depth] ??= []).push(node);
    node.evolves_to.forEach((n) => walk(n, depth + 1));
  };
  walk(chain.chain, 0);

  if (stages.length === 1) {
    el.evo.innerHTML = '<p class="evo__single">Este Pokémon não evolui.</p>';
    return;
  }

  el.evo.innerHTML = stages.map((nodes, depth) => {
    const items = nodes.map((node) => {
      const id = idFromUrl(node.species.url);
      const how = depth > 0 ? evolutionHow(node.evolution_details) : '';
      return `<button type="button" class="evo__item" data-load="${id}" aria-current="${id === species.id}">
          <img src="${SPRITES}/other/home/${id}.png" alt="" loading="lazy" width="48" height="48">
          <span><span class="evo__name">${titleCase(node.species.name)}</span>
          ${how ? `<span class="evo__how">${how}</span>` : ''}</span>
        </button>`;
    }).join('');
    const arrow = depth > 0 ? '<span class="evo__arrow" aria-hidden="true">&rarr;</span>' : '';
    return `${arrow}<div class="evo__stage">${items}</div>`;
  }).join('');
}

function renderSources(species, englishName) {
  const slug = species.name;
  const wiki = encodeURIComponent(englishName.replace(/ /g, '_'));
  const links = [
    ['Pokédex oficial', 'português', `https://www.pokemon.com/br/pokedex/${slug}`],
    ['Bulbapedia', 'enciclopédia completa', `https://bulbapedia.bulbagarden.net/wiki/${wiki}_(Pok%C3%A9mon)`],
    ['Serebii', 'jogos e eventos atuais', `https://www.serebii.net/pokemon/${slug}/`],
    ['Pokémon Database', 'golpes e locais', `https://pokemondb.net/pokedex/${slug}`],
    ['Smogon', 'competitivo', `https://www.smogon.com/dex/sv/pokemon/${slug}/`],
  ];
  el.sources.innerHTML = links.map(([name, what, url]) =>
    `<li><a href="${url}" target="_blank" rel="noopener">${name} <small>${what}</small></a></li>`
  ).join('');
}

/* ---------- Showdown (tier competitivo) ---------- */

async function loadShowdown() {
  try {
    const res = await fetch(SHOWDOWN_DEX);
    if (!res.ok) return;
    state.showdown = await res.json();
    if (state.current) renderTags(state.current.species, state.current.pokemon);
  } catch {
    // sem problema: o tier é só um extra
  }
}

function showdownTier(pokemon, species) {
  if (!state.showdown) return null;
  const key = (s) => s.replace(/[^a-z0-9]/g, '');
  const entry = state.showdown[key(pokemon.name)] ?? state.showdown[key(species.name)];
  const tier = entry?.tier;
  if (!tier || tier === 'Illegal' || tier === 'Unreleased') return null;
  return tier.replace(/[()]/g, '');
}

/* ---------- Tradução da descrição ---------- */

function readTranslation(text) {
  try { return JSON.parse(localStorage.getItem('dex-tr') || '{}')[text] ?? null; } catch { return null; }
}
function saveTranslation(text, pt) {
  try {
    const all = JSON.parse(localStorage.getItem('dex-tr') || '{}');
    all[text] = pt;
    localStorage.setItem('dex-tr', JSON.stringify(all));
  } catch { /* armazenamento indisponível */ }
}
function showTranslation(pt) {
  el.flavor.textContent = pt;
  el.flavor.lang = 'pt-BR';
  el.flavorSource.textContent += ' Tradução automática.';
  el.translate.hidden = true;
}

async function translateFlavor() {
  const text = state.flavorEn;
  if (!text) return;
  el.translate.disabled = true;
  el.translate.textContent = 'Traduzindo...';
  try {
    const url = `${TRANSLATE}?q=${encodeURIComponent(text)}&langpair=${state.flavorLang}|pt-BR`;
    const data = await fetch(url).then((r) => r.json());
    const pt = data?.responseData?.translatedText;
    if (data.responseStatus !== 200 || !pt) throw new Error('falhou');
    if (state.flavorEn !== text) return; // trocou de Pokémon no meio
    saveTranslation(text, pt);
    showTranslation(pt);
  } catch {
    el.translate.disabled = false;
    el.translate.textContent = 'Tradução indisponível agora. Tentar de novo';
  }
}

/* ---------- Lista para o autocompletar ---------- */

async function loadNameList() {
  try {
    const [species, pokemon] = await Promise.all([
      getJSON(`${API}/pokemon-species?limit=2000`),
      getJSON(`${API}/pokemon?limit=2000`),
    ]);
    state.maxSpecies = species.count;
    const names = new Set(pokemon.results.map((p) => p.name));
    species.results.forEach((s) => names.add(s.name));
    el.list.innerHTML = [...names].sort().map((n) => `<option value="${n}">`).join('');
    if (state.current) el.next.disabled = state.speciesId >= state.maxSpecies;
  } catch {
    // o autocompletar é opcional
  }
}

/* ---------- Eventos ---------- */

el.form.addEventListener('submit', (e) => {
  e.preventDefault();
  const q = el.input.value;
  if (!q.trim()) return;
  load(q);
  el.input.value = '';
});

el.prev.addEventListener('click', () => {
  if (state.speciesId <= 1) return;
  state.dir = -1;
  load(state.speciesId - 1);
});
el.next.addEventListener('click', () => {
  if (state.speciesId >= state.maxSpecies) return;
  state.dir = 1;
  load(state.speciesId + 1);
});
el.random.addEventListener('click', () => load(1 + Math.floor(Math.random() * state.maxSpecies)));

document.addEventListener('keydown', (e) => {
  if (e.target.closest('input, textarea') || e.altKey || e.ctrlKey || e.metaKey) return;
  if (e.key === 'ArrowLeft') el.prev.click();
  if (e.key === 'ArrowRight') el.next.click();
});

// cliques em formas e evoluções
document.addEventListener('click', (e) => {
  const target = e.target.closest('[data-load]');
  if (target) load(target.dataset.load);
});

el.artButtons.forEach((btn) => {
  btn.setAttribute('aria-pressed', String(btn.dataset.art === state.art));
  btn.addEventListener('click', () => {
    state.art = btn.dataset.art;
    localStorage.setItem('dex-art', state.art);
    el.artButtons.forEach((b) => b.setAttribute('aria-pressed', String(b === btn)));
    if (state.current) renderSprite();
  });
});

el.shiny.addEventListener('click', () => {
  state.shiny = !state.shiny;
  el.shiny.setAttribute('aria-pressed', String(state.shiny));
  if (state.shiny) sparkleBurst();
  if (state.current) renderSprite();
});

el.cry.addEventListener('click', () => {
  const cries = state.current?.pokemon.cries;
  const url = cries?.latest || cries?.legacy;
  if (!url) return;
  const audio = new Audio(url);
  audio.volume = 0.4;
  const stopVisual = () => {
    el.cry.classList.remove('is-playing');
    el.speaker.classList.remove('is-playing');
  };
  el.cry.classList.add('is-playing');
  el.speaker.classList.add('is-playing');
  window.DexMusic?.duck(2000);
  audio.addEventListener('ended', stopVisual);
  audio.play().catch(() => {
    stopVisual();
    el.status.textContent = 'Seu navegador não conseguiu tocar o grito.';
  });
});

el.translate.addEventListener('click', translateFlavor);

window.addEventListener('hashchange', () => {
  const q = decodeURIComponent(location.hash.slice(1));
  if (q && q !== state.current?.pokemon.name) load(q, { updateHash: false });
});

/* ---------- Música de fundo ---------- */

function setMusic(on) {
  if (!window.DexMusic) return;
  if (on) window.DexMusic.start(); else window.DexMusic.stop();
  el.music.setAttribute('aria-pressed', String(on));
  el.musicLabel.textContent = on ? 'Desligar música' : 'Ligar música';
  try { localStorage.setItem('dex-music', on ? '1' : '0'); } catch { /* ignore */ }
}

el.music.addEventListener('click', () => setMusic(!window.DexMusic?.playing));

// navegadores só deixam tocar som depois de um clique; se a pessoa deixou
// a música ligada na última visita, ela volta no primeiro clique na página
if (localStorage.getItem('dex-music') === '1') {
  document.addEventListener('pointerdown', (e) => {
    if (!e.target.closest('#btn-music')) setMusic(true);
  }, { once: true });
}

/* ---------- Início ---------- */

if (!reducedMotion.matches) {
  el.dex.classList.add('is-booting');
  setTimeout(finishBoot, 950);
}

load(decodeURIComponent(location.hash.slice(1)) || 1);
loadNameList();
loadShowdown();
