/**
 * Tainted Grail: Song of a Dying World
 * Main Application JavaScript
 * 
 * Modules:
 * 1. Tab Switching (switchTab)
 * 2. Reference Guide (toggleChapter, toggleSection)
 * 3. Character Creator (cc* functions)
 *    - Data Constants (CC_ADVANTAGES, CC_DISADVANTAGES, CC_EQUIPMENT, etc.)
 *    - State Management (ccCharacter, ccCurrentStep)
 *    - Navigation (ccNextStep, ccPrevStep, ccGoToStep)
 *    - Validation (ccValidateWays, ccValidateSkills, ccValidateAdvDisadv)
 *    - UI Updates (ccUpdateOriginBonus, ccUpdateSkillPoints, ccUpdateXPDisplay)
 *    - Summary Generation (ccGenerateSummary, ccCopyToClipboard)
 * 4. Character Sheet (sheet* functions)
 *    - Circle Initialization (sheetInitCircles)
 *    - Load/Save/Clear (sheetLoad, sheetSave, sheetClear)
 *    - Load from Creator (sheetLoadFromCreator)
 *    - Export/Import (sheetExport, sheetImport)
 *    - Roll Modal (sheetAddRollButtons, openRollModal, executeSheetRoll)
 * 5. Color Recommendations (CC_COLOR_RECS, ccUpdateColorRecommendations)
 * 6. Page Load & Hash Navigation
 */

// ==================== TAB SWITCHING ====================
function switchTab(tabName) {
    document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.getElementById('tab-' + tabName).classList.add('active');
    // Mark the correct button as active
    document.querySelectorAll('.tab-btn').forEach(b => {
        if (tabName === 'reference' && b.textContent.includes('Reference')) b.classList.add('active');
        else if (tabName === 'creator' && b.textContent.includes('Character Creator')) b.classList.add('active');
        else if (tabName === 'roller' && b.textContent.includes('Dice')) b.classList.add('active');
        else if (tabName === 'sheet' && b.textContent.includes('Character Sheet')) b.classList.add('active');
    });
    if (tabName === 'sheet') sheetLoad();
}

// ==================== REFERENCE GUIDE JS ====================
function toggleChapter(header) {
    const content = header.nextElementSibling;
    const toggle = header.querySelector('.toggle');
    content.classList.toggle('active');
    toggle.textContent = content.classList.contains('active') ? '−' : '+';
}
function toggleSection(header) {
    const content = header.nextElementSibling;
    const toggle = header.querySelector('.toggle');
    content.classList.toggle('active');
    toggle.textContent = content.classList.contains('active') ? '−' : '+';
}

// Nav links in reference guide
document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('#tab-reference .nav-links a').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const content = target.querySelector('.chapter-content');
                const toggle = target.querySelector('.chapter-header .toggle');
                const header = target.querySelector('.chapter-header h2');
                // Open the chapter
                if (content && toggle && !content.classList.contains('active')) { content.classList.add('active'); toggle.textContent = '−'; }
                // Show current section indicator
                const sectionIndicator = document.getElementById('ref-current-section');
                const sectionName = document.getElementById('ref-current-section-name');
                if (sectionIndicator && sectionName && header) {
                    sectionName.textContent = header.textContent;
                    sectionIndicator.style.display = 'block';
                    sectionIndicator.style.animation = 'none';
                    sectionIndicator.offsetHeight; // reflow
                    sectionIndicator.style.animation = 'refSectionPulse 0.6s ease';
                }
                // Highlight the opened chapter briefly
                target.style.transition = 'box-shadow 0.3s ease';
                target.style.boxShadow = '0 0 0 3px var(--accent), 0 0 20px rgba(233,69,96,0.3)';
                setTimeout(() => { target.style.boxShadow = 'none'; }, 1500);
                // Scroll to it with offset for the sticky nav
                setTimeout(() => {
                    const navHeight = document.querySelector('.top-nav').offsetHeight || 60;
                    const targetPos = target.getBoundingClientRect().top + window.pageYOffset - navHeight - 10;
                    window.scrollTo({ top: targetPos, behavior: 'smooth' });
                }, 50);
            }
        });
    });
});

// ==================== CHARACTER CREATOR JS ====================
const CC_ADVANTAGES = [
    { name: "Bonded", cost: 10 },{ name: "Contact", cost: 10 },{ name: "Deep Faith", cost: 10 },
    { name: "Hardy*", cost: 10 },{ name: "Luchtaine's Touch*", cost: 10 },{ name: "Scholarly*", cost: 10 },
    { name: "Sixth Sense*", cost: 10 },{ name: "Unpredictable", cost: 10 },{ name: "Wealthy*", cost: 10 },
    { name: "Allmother's Favor", cost: 20 },{ name: "Dual Wielding", cost: 20 },{ name: "Herded", cost: 20 },
    { name: "Honorable*", cost: 20 },{ name: "Leader*", cost: 20 },{ name: "Lightning Strike", cost: 20 },
    { name: "Lucky Star*", cost: 20 },{ name: "Miracle Worker*", cost: 20 },{ name: "Mist-Embraced*", cost: 20 },
    { name: "Mistwalker", cost: 20 },{ name: "Radiant*", cost: 20 },{ name: "Reputation*", cost: 20 },
    { name: "Strong Mind", cost: 20 },{ name: "Tough*", cost: 20 },{ name: "Mentor", cost: 30 },
    { name: "Taliesin's Gift*", cost: 30 },{ name: "Lug's Grip*", cost: 40 },{ name: "Child of the Wyrdness*", cost: 40 },
    { name: "Ally", cost: 50 },{ name: "Companion", cost: 50 }
];
const CC_DISADVANTAGES = [
    { name: "Gullible", cost: 10 },{ name: "Honorless", cost: 10 },{ name: "Insubordinate", cost: 10 },
    { name: "Mabd's Ill Omen", cost: 10 },{ name: "Oathbound", cost: 10 },{ name: "Rumor", cost: 10 },
    { name: "Unbeliever", cost: 10 },{ name: "Unwell", cost: 10 },{ name: "Wyrdness-Tainted", cost: 10 },
    { name: "Animal Hostility", cost: 20 },{ name: "Arcane Frailty", cost: 20 },{ name: "Arthritis", cost: 20 },
    { name: "Clumsy", cost: 20 },{ name: "Craven", cost: 20 },{ name: "Forsaken", cost: 20 },
    { name: "Godforsaken", cost: 20 },{ name: "Lone Wolf", cost: 20 },{ name: "Oathbreaker", cost: 20 },
    { name: "Old Wound", cost: 20 },{ name: "Poor", cost: 20 },{ name: "Rattled", cost: 20 },
    { name: "Weakened", cost: 20 },{ name: "Weakness", cost: 20 },{ name: "Adversary", cost: 30 },
    { name: "Slow Recovery", cost: 30 },{ name: "Wyrdness Phobia", cost: 30 },{ name: "Crom Cruach's Glare", cost: 40 },
    { name: "Wretched Fortune", cost: 40 },{ name: "Hunted", cost: 50 },{ name: "Red Death", cost: 50 }
];
const CC_EQUIPMENT = {
    weapons: [
        { name: "Dagger", cost: 5 },{ name: "Short Sword", cost: 15 },{ name: "Long Sword", cost: 25 },
        { name: "Bastard Sword", cost: 35 },{ name: "Great Sword", cost: 45 },{ name: "Axe", cost: 20 },
        { name: "Battle Axe", cost: 30 },{ name: "Great Axe", cost: 40 },{ name: "Mace", cost: 15 },
        { name: "Warhammer", cost: 30 },{ name: "Spear", cost: 15 },{ name: "Lance", cost: 35 },
        { name: "Staff", cost: 10 },{ name: "Short Bow", cost: 20 },{ name: "Long Bow", cost: 35 },
        { name: "Crossbow", cost: 40 },{ name: "Sling", cost: 5 },{ name: "Throwing Knives (3)", cost: 10 },
        { name: "Javelins (3)", cost: 15 }
    ],
    armor: [
        { name: "Padded Armor", cost: 15 },{ name: "Leather Armor", cost: 25 },{ name: "Studded Leather", cost: 35 },
        { name: "Chain Shirt", cost: 50 },{ name: "Chainmail", cost: 70 },{ name: "Scale Mail", cost: 60 },
        { name: "Plate Armor", cost: 100 }
    ],
    shields: [
        { name: "Buckler", cost: 10 },{ name: "Round Shield", cost: 20 },{ name: "Kite Shield", cost: 30 },
        { name: "Tower Shield", cost: 40 }
    ],
    medicine: [
        { name: "Healing Herbs", cost: 5 },{ name: "Bandages", cost: 3 },{ name: "Antidote", cost: 10 },
        { name: "Poultice", cost: 8 },{ name: "Healer's Kit", cost: 20 },{ name: "Restorative Draught", cost: 15 }
    ],
    gear: [
        { name: "Rope (50ft)", cost: 5 },{ name: "Torch (3)", cost: 3 },{ name: "Lantern", cost: 10 },
        { name: "Oil Flask", cost: 3 },{ name: "Backpack", cost: 5 },{ name: "Bedroll", cost: 5 },
        { name: "Waterskin", cost: 3 },{ name: "Rations (7 days)", cost: 7 },{ name: "Flint & Steel", cost: 3 },
        { name: "Grappling Hook", cost: 8 },{ name: "Lock Picks", cost: 15 },{ name: "Compass", cost: 12 },
        { name: "Spyglass", cost: 20 },{ name: "Writing Kit", cost: 8 },{ name: "Musical Instrument", cost: 15 },
        { name: "Holy Symbol", cost: 10 },{ name: "Traveler's Clothes", cost: 5 },{ name: "Fine Clothes", cost: 20 },
        { name: "Horse", cost: 50 },{ name: "Saddle & Tack", cost: 15 }
    ]
};
const CC_DOMAINS_BY_WAY = {
    awareness: ['monsters', 'perception', 'stealth', 'travel'],
    combativeness: ['close-combat', 'feats', 'mounted-combat', 'shooting-throwing'],
    conviction: ['compassion', 'inspiration', 'leadership', 'religion'],
    creativity: ['communication', 'craft', 'performance', 'wyrdness-mysteries'],
    reason: ['erudition', 'healing', 'magic', 'natural-environment']
};
const CC_ORIGIN_BONUS_MAP = { 'Hinterlands': 'combativeness', 'North': 'conviction', 'South': 'awareness', 'Mists': 'creativity', 'Continent': 'reason' };
const CC_AGE_XP = { '15-20': 0, '21-30': 20, '31-40': 40, '41+': 60 };
const CC_AGE_DISADV_MIN = { '15-20': 0, '21-30': 0, '31-40': 10, '41+': 20 };

const CC_DOMAIN_DESCRIPTIONS = {
    'monsters': 'Knowledge of creatures, their weaknesses, and behaviors. Used to identify and fight monsters (with Awareness instead of Combativeness).',
    'perception': 'Noticing details, spotting hidden things, detecting lies. Passive awareness of surroundings.',
    'stealth': 'Moving silently, hiding, avoiding detection. Contested against Perception.',
    'travel': 'Navigation, survival in the wild, finding paths through the Wyrdness.',
    'close-combat': 'Melee fighting with swords, axes, maces, and other hand weapons.',
    'feats': 'Climbing, jumping, swimming, lifting, breaking things. Raw physical prowess.',
    'mounted-combat': 'Fighting from horseback, controlling a mount in battle.',
    'shooting-throwing': 'Ranged attacks with bows, crossbows, slings, thrown weapons.',
    'compassion': 'Soothing others, moral support, treating Torments. Empathy and care.',
    'inspiration': 'Rallying fleeing allies, boosting morale in combat, motivating action.',
    'leadership': 'Giving orders in combat, organizing groups, strategic command.',
    'religion': 'Knowledge of faiths, performing rituals, invoking divine favor.',
    'communication': 'Persuasion, bartering, deception, social interaction.',
    'craft': 'Creating and repairing items, working with materials, artisan skills.',
    'performance': 'Singing, storytelling, acting. Entertaining and influencing through art.',
    'wyrdness-mysteries': 'Understanding the Wyrdness, navigating its effects, occult knowledge.',
    'erudition': 'Academic knowledge, reading, writing, history, languages.',
    'healing': 'Treating wounds, curing diseases, surgery. Medical knowledge.',
    'magic': 'Casting spells, understanding arcane forces, magical theory.',
    'natural-environment': 'Knowledge of plants, animals, weather, terrain. Wilderness lore.'
};

// State
let ccCurrentStep = 1;
const ccTotalSteps = 10;
let ccCharacter = { color: '', origin: '', ways: { awareness: 0, combativeness: 0, conviction: 0, creativity: 0, reason: 0 }, occupation: '', domains: {}, age: '', advantages: [], disadvantages: [], equipment: [], name: '', quality: '', flaw: '', personality: '', background: '', appearance: '' };
let ccBaseXP = 100;
let ccCurrentWealth = 100;

// Init
document.addEventListener('DOMContentLoaded', function() {
    ccSetupOptionCards();
    ccPopulateAdvantages();
    ccPopulateDisadvantages();
    ccPopulateEquipment();
    ccSetupCustomTraitToggle();
    ccUpdateProgressBar();
});

function ccSetupOptionCards() {
    document.querySelectorAll('#tab-creator .option-card').forEach(card => {
        card.addEventListener('click', function() {
            const group = this.closest('.option-group');
            const radio = this.querySelector('input[type="radio"]');
            if (radio) {
                group.querySelectorAll('.option-card').forEach(c => c.classList.remove('selected'));
                this.classList.add('selected');
                radio.checked = true;
                if (radio.name === 'color') ccCharacter.color = radio.value;
                if (radio.name === 'origin') { ccCharacter.origin = radio.value; ccUpdateOriginBonus(); }
                if (radio.name === 'age') { ccCharacter.age = radio.value; }
            }
        });
    });
}

function ccSetupCustomTraitToggle() {
    document.getElementById('char-quality').addEventListener('change', function() {
        document.getElementById('char-quality-custom').style.display = this.value === 'Custom' ? 'block' : 'none';
    });
    document.getElementById('char-flaw').addEventListener('change', function() {
        document.getElementById('char-flaw-custom').style.display = this.value === 'Custom' ? 'block' : 'none';
    });
}

// Navigation
function ccNextStep() {
    if (!ccValidateCurrentStep()) return;
    if (ccCurrentStep < ccTotalSteps) {
        document.getElementById('step-' + ccCurrentStep).classList.remove('active');
        ccCurrentStep++;
        document.getElementById('step-' + ccCurrentStep).classList.add('active');
        ccUpdateProgressBar();
        if (ccCurrentStep === 9) ccCalculateDerivedStats();
        if (ccCurrentStep === 10) ccGenerateSummary();
        document.getElementById('tab-creator').scrollTo(0, 0);
        window.scrollTo(0, 0);
    }
}
function ccPrevStep() {
    if (ccCurrentStep > 1) {
        document.getElementById('step-' + ccCurrentStep).classList.remove('active');
        ccCurrentStep--;
        document.getElementById('step-' + ccCurrentStep).classList.add('active');
        ccUpdateProgressBar();
        window.scrollTo(0, 0);
    }
}
function ccGoToStep(step) {
    if (step >= 1 && step <= ccTotalSteps) {
        document.getElementById('step-' + ccCurrentStep).classList.remove('active');
        ccCurrentStep = step;
        document.getElementById('step-' + ccCurrentStep).classList.add('active');
        ccUpdateProgressBar();
        if (ccCurrentStep === 9) ccCalculateDerivedStats();
        if (ccCurrentStep === 10) ccGenerateSummary();
        window.scrollTo(0, 0);
    }
}
function ccUpdateProgressBar() {
    const fill = document.querySelector('#tab-creator .progress-bar-fill');
    fill.style.width = (ccCurrentStep / ccTotalSteps * 100) + '%';
    document.querySelectorAll('#tab-creator .progress-step').forEach((step, i) => {
        step.classList.remove('active', 'completed');
        if (i + 1 === ccCurrentStep) step.classList.add('active');
        else if (i + 1 < ccCurrentStep) step.classList.add('completed');
    });
}
document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('#tab-creator .progress-step').forEach(step => {
        step.addEventListener('click', function() {
            const targetStep = parseInt(this.dataset.step);
            if (targetStep <= ccCurrentStep) ccGoToStep(targetStep);
        });
    });
});

// Validation
function ccValidateCurrentStep() {
    switch(ccCurrentStep) {
        case 1: if (!ccCharacter.color) { alert('Please select a Color.'); return false; } return true;
        case 2: if (!ccCharacter.origin) { alert('Please select an Origin.'); return false; } return true;
        case 3: return ccValidateWays(true);
        case 4: return ccValidateSkills();
        case 5: if (!ccCharacter.age) { alert('Please select an Age range.'); return false; } return true;
        case 6: return ccValidateAdvDisadv();
        default: return true;
    }
}
function ccValidateWays(showAlert) {
    const ways = ['awareness', 'combativeness', 'conviction', 'creativity', 'reason'];
    const values = ways.map(w => document.getElementById('way-' + w).value);
    const errorEl = document.getElementById('ways-error');
    if (values.includes('')) { errorEl.classList.add('show'); errorEl.textContent = 'Please assign a value to each Way.'; if (showAlert) alert('Please assign a value to each Way.'); ccUpdateWayDropdowns(); return false; }
    const unique = new Set(values);
    if (unique.size !== 5) { errorEl.classList.add('show'); errorEl.textContent = 'Each value (1-5) must be used exactly once.'; if (showAlert) alert('Each value (1-5) must be used exactly once.'); ccUpdateWayDropdowns(); return false; }
    errorEl.classList.remove('show');
    ways.forEach(w => { ccCharacter.ways[w] = parseInt(document.getElementById('way-' + w).value); });
    ccUpdateWayDropdowns();
    return true;
}
function ccUpdateWayDropdowns() {
    const ways = ['awareness', 'combativeness', 'conviction', 'creativity', 'reason'];
    const allValues = ['1', '2', '3', '4', '5'];
    const usedValues = {};
    ways.forEach(w => { const v = document.getElementById('way-' + w).value; if (v) usedValues[w] = v; });
    ways.forEach(w => {
        const sel = document.getElementById('way-' + w);
        const currentVal = sel.value;
        const otherUsed = Object.entries(usedValues).filter(([key]) => key !== w).map(([, val]) => val);
        sel.innerHTML = '<option value="">—</option>';
        allValues.forEach(v => {
            if (!otherUsed.includes(v) || v === currentVal) {
                const opt = document.createElement('option');
                opt.value = v; opt.textContent = v;
                if (v === currentVal) opt.selected = true;
                sel.appendChild(opt);
            }
        });
    });
}
function ccValidateSkills() {
    const remaining = ccGetSkillPointsRemaining();
    if (remaining < 0) { alert('You have spent more skill points than available.'); return false; }
    return true;
}
function ccValidateAdvDisadv() {
    if (ccCharacter.disadvantages.length > 5) { alert('You can have at most 5 Disadvantages.'); return false; }
    const minDisadv = CC_AGE_DISADV_MIN[ccCharacter.age] || 0;
    const disadvTotal = ccCharacter.disadvantages.reduce((sum, d) => sum + d.cost, 0);
    if (disadvTotal < minDisadv) { alert(`Your age requires at least ${minDisadv} points of Disadvantages.`); return false; }
    if (ccGetXPRemaining() < 0) { alert('You have spent more XP than available.'); return false; }
    return true;
}

// Origin Bonus
function ccUpdateOriginBonus() {
    Object.values(CC_DOMAINS_BY_WAY).flat().forEach(d => { const el = document.getElementById('bonus-' + d); if (el) el.textContent = ''; });
    const bonusWay = CC_ORIGIN_BONUS_MAP[ccCharacter.origin];
    if (bonusWay) { CC_DOMAINS_BY_WAY[bonusWay].forEach(d => { const el = document.getElementById('bonus-' + d); if (el) el.textContent = '(+1 Origin)'; }); }
}

// Skills
function ccUpdateOccupation() { ccCharacter.occupation = document.getElementById('occupation-select').value; ccUpdateSkillPoints(); }
function ccGetSkillPointsRemaining() { let spent = 0; Object.values(CC_DOMAINS_BY_WAY).flat().forEach(d => { spent += parseInt(document.getElementById('domain-' + d).value) || 0; }); return 20 - spent; }
function ccUpdateSkillPoints() {
    const remaining = ccGetSkillPointsRemaining();
    const el = document.getElementById('skill-points-remaining'); el.textContent = remaining;
    el.classList.toggle('over-budget', remaining < 0);
    const errorEl = document.getElementById('skills-error');
    if (remaining < 0) errorEl.classList.add('show'); else errorEl.classList.remove('show');
}

// XP / Advantages / Disadvantages
function ccGetXPRemaining() {
    const ageBonus = CC_AGE_XP[ccCharacter.age] || 0;
    const disadvXP = ccCharacter.disadvantages.reduce((sum, d) => sum + d.cost, 0);
    const advCost = ccCharacter.advantages.reduce((sum, a) => sum + a.cost, 0);
    return ccBaseXP + ageBonus + disadvXP - advCost;
}
function ccUpdateXPDisplay() {
    const ageBonus = CC_AGE_XP[ccCharacter.age] || 0;
    const disadvXP = ccCharacter.disadvantages.reduce((sum, d) => sum + d.cost, 0);
    const advCost = ccCharacter.advantages.reduce((sum, a) => sum + a.cost, 0);
    const remaining = ccBaseXP + ageBonus + disadvXP - advCost;
    document.getElementById('xp-remaining').textContent = remaining;
    document.getElementById('xp-base').textContent = ccBaseXP;
    document.getElementById('xp-age-bonus').textContent = ageBonus;
    document.getElementById('xp-from-disadv').textContent = disadvXP;
    document.getElementById('xp-spent').textContent = advCost;
    document.getElementById('xp-remaining').style.color = remaining < 0 ? 'var(--accent)' : 'var(--gold)';
    ccUpdateAgeDisadvNotice();
}
function ccUpdateAgeDisadvNotice() {
    const minDisadv = CC_AGE_DISADV_MIN[ccCharacter.age] || 0;
    const notice = document.getElementById('age-disadv-notice');
    if (minDisadv <= 0) { notice.style.display = 'none'; return; }
    notice.style.display = 'block';
    const disadvTotal = ccCharacter.disadvantages.reduce((sum, d) => sum + d.cost, 0);
    const met = disadvTotal >= minDisadv;
    document.getElementById('age-disadv-notice-text').textContent = `Your age requires at least ${minDisadv} points of Disadvantages (these do NOT grant bonus XP).`;
    document.getElementById('age-disadv-current').textContent = disadvTotal;
    document.getElementById('age-disadv-required').textContent = minDisadv;
    document.getElementById('age-disadv-icon').textContent = met ? '✅' : '⚠️';
    notice.style.borderColor = met ? 'var(--green)' : 'var(--accent)';
    notice.style.background = met ? 'rgba(78,205,196,0.1)' : 'rgba(233,69,96,0.1)';
    document.getElementById('age-disadv-current').style.color = met ? 'var(--green)' : 'var(--accent)';
}
function ccPopulateAdvantages() {
    document.getElementById('advantages-list').innerHTML = CC_ADVANTAGES.map((adv, i) => `<div class="adv-item" onclick="ccToggleAdvantage(${i}, this)"><input type="checkbox" id="adv-${i}"><span class="adv-name">${adv.name}</span><span class="adv-cost">-${adv.cost} XP</span></div>`).join('');
}
function ccPopulateDisadvantages() {
    document.getElementById('disadvantages-list').innerHTML = CC_DISADVANTAGES.map((dis, i) => `<div class="adv-item disadv-item" onclick="ccToggleDisadvantage(${i}, this)"><input type="checkbox" id="dis-${i}"><span class="adv-name">${dis.name}</span><span class="adv-cost">+${dis.cost} XP</span></div>`).join('');
}
function ccToggleAdvantage(index, el) {
    const adv = CC_ADVANTAGES[index]; const cb = el.querySelector('input[type="checkbox"]');
    if (el.classList.contains('selected')) { el.classList.remove('selected'); cb.checked = false; ccCharacter.advantages = ccCharacter.advantages.filter(a => a.name !== adv.name); }
    else { el.classList.add('selected'); cb.checked = true; ccCharacter.advantages.push(adv); }
    ccUpdateXPDisplay();
}
function ccToggleDisadvantage(index, el) {
    const dis = CC_DISADVANTAGES[index]; const cb = el.querySelector('input[type="checkbox"]');
    if (el.classList.contains('selected')) { el.classList.remove('selected'); cb.checked = false; ccCharacter.disadvantages = ccCharacter.disadvantages.filter(d => d.name !== dis.name); }
    else { if (ccCharacter.disadvantages.length >= 5) { alert('You can select at most 5 Disadvantages.'); return; } el.classList.add('selected'); cb.checked = true; ccCharacter.disadvantages.push(dis); }
    ccUpdateXPDisplay();
}

// Equipment
function ccPopulateEquipment() {
    ccPopulateEquipCategory('weapons-list', CC_EQUIPMENT.weapons);
    ccPopulateEquipCategory('armor-list', CC_EQUIPMENT.armor);
    ccPopulateEquipCategory('shields-list', CC_EQUIPMENT.shields);
    ccPopulateEquipCategory('medicine-list', CC_EQUIPMENT.medicine);
    ccPopulateEquipCategory('gear-list', CC_EQUIPMENT.gear);
}
function ccPopulateEquipCategory(containerId, items) {
    document.getElementById(containerId).innerHTML = items.map((item, i) => `<div class="equip-item"><span class="equip-name">${item.name}</span><span class="equip-cost">${item.cost} Obols</span><button onclick="ccBuyItem('${item.name.replace(/'/g, "\\'")}', ${item.cost})">Buy</button></div>`).join('');
}
function ccBuyItem(name, cost) {
    if (ccCurrentWealth < cost) { alert('Not enough Obols!'); return; }
    ccCurrentWealth -= cost;
    ccCharacter.equipment.push({ name, cost });
    ccUpdateWealthDisplay(); ccUpdateInventory();
}
function ccRemoveItem(index) {
    ccCurrentWealth += ccCharacter.equipment[index].cost;
    ccCharacter.equipment.splice(index, 1);
    ccUpdateWealthDisplay(); ccUpdateInventory();
}
function ccUpdateWealthDisplay() {
    const el = document.getElementById('wealth-remaining');
    el.textContent = ccCurrentWealth;
    el.style.color = ccCurrentWealth < 0 ? 'var(--accent)' : 'var(--gold)';
}
function ccUpdateInventory() {
    const container = document.getElementById('inventory-list');
    if (ccCharacter.equipment.length === 0) { container.innerHTML = '<em style="opacity:0.5">No items purchased yet.</em>'; return; }
    container.innerHTML = ccCharacter.equipment.map((item, i) => `<div class="inventory-item"><span>${item.name}</span><button class="remove-btn" onclick="ccRemoveItem(${i})" style="background:var(--accent);color:#fff;border:none;border-radius:4px;padding:2px 8px;cursor:pointer;font-size:0.8rem;">✕</button></div>`).join('');
}

// Derived Stats
function ccCalculateDerivedStats() {
    const ways = ['awareness', 'combativeness', 'conviction', 'creativity', 'reason'];
    ways.forEach(w => { ccCharacter.ways[w] = parseInt(document.getElementById('way-' + w).value) || 0; });
    const aw = ccCharacter.ways.awareness, co = ccCharacter.ways.combativeness, cv = ccCharacter.ways.conviction, cr = ccCharacter.ways.creativity, re = ccCharacter.ways.reason;
    
    let defense = aw + re + 5;
    let speed = aw + co;
    let stamina = 10; if (ccCharacter.advantages.find(a => a.name === "Hardy*")) stamina += 2;
    let mentalRes = cv + 5; if (ccCharacter.advantages.find(a => a.name === "Strong Mind")) mentalRes += 2;
    let fp = 1; if (cr >= 2 && cr <= 4) fp = 2; if (cr >= 5) fp = 3;
    let survival = 3; if (ccCharacter.advantages.find(a => a.name === "Allmother's Favor")) survival += 1; if (ccCharacter.disadvantages.find(d => d.name === "Godforsaken")) survival -= 1;
    let health = 17; if (ccCharacter.advantages.find(a => a.name === "Tough*")) health += 1; if (ccCharacter.disadvantages.find(d => d.name === "Old Wound")) health -= 1;

    document.getElementById('stat-defense').textContent = defense;
    document.getElementById('stat-speed').textContent = speed;
    document.getElementById('stat-stamina').textContent = stamina;
    document.getElementById('stat-mental-resistance').textContent = mentalRes;
    document.getElementById('stat-fighting-potential').textContent = fp;
    document.getElementById('stat-survival').textContent = survival;
    document.getElementById('stat-health').textContent = health;
}

// Summary
function ccGenerateSummary() {
    ccCalculateDerivedStats();
    ccCharacter.name = document.getElementById('char-name').value || 'Unnamed';
    const qualitySelect = document.getElementById('char-quality').value;
    ccCharacter.quality = qualitySelect === 'Custom' ? document.getElementById('char-quality-custom').value : qualitySelect;
    const flawSelect = document.getElementById('char-flaw').value;
    ccCharacter.flaw = flawSelect === 'Custom' ? document.getElementById('char-flaw-custom').value : flawSelect;
    ccCharacter.personality = document.getElementById('char-personality').value;
    ccCharacter.background = document.getElementById('char-background').value;
    ccCharacter.appearance = document.getElementById('char-appearance').value;

    const allDomains = {};
    Object.entries(CC_DOMAINS_BY_WAY).forEach(([way, domains]) => {
        domains.forEach(d => {
            const base = parseInt(document.getElementById('domain-' + d).value) || 0;
            const bonusWay = CC_ORIGIN_BONUS_MAP[ccCharacter.origin];
            const hasBonus = (bonusWay === way) ? ' (+1 Origin)' : '';
            const bonusVal = (bonusWay === way) ? 1 : 0;
            allDomains[d] = { base, bonus: bonusVal, total: base + bonusVal, label: hasBonus };
        });
    });

    let html = `
        <div class="summary-section"><h3>Identity</h3>
            <div class="summary-row"><span class="label">Name</span><span class="value">${ccCharacter.name}</span></div>
            <div class="summary-row"><span class="label">Color</span><span class="value">${ccCharacter.color}</span></div>
            <div class="summary-row"><span class="label">Origin</span><span class="value">People of the ${ccCharacter.origin}</span></div>
            <div class="summary-row"><span class="label">Occupation</span><span class="value">${ccCharacter.occupation || 'None'}</span></div>
            <div class="summary-row"><span class="label">Age</span><span class="value">${ccCharacter.age}</span></div>
            <div class="summary-row"><span class="label">Quality</span><span class="value">${ccCharacter.quality || '—'}</span></div>
            <div class="summary-row"><span class="label">Flaw</span><span class="value">${ccCharacter.flaw || '—'}</span></div>
        </div>
        <div class="summary-section"><h3>Ways</h3>
            <div class="summary-row"><span class="label">Awareness</span><span class="value">${ccCharacter.ways.awareness}</span></div>
            <div class="summary-row"><span class="label">Combativeness</span><span class="value">${ccCharacter.ways.combativeness}</span></div>
            <div class="summary-row"><span class="label">Conviction</span><span class="value">${ccCharacter.ways.conviction}</span></div>
            <div class="summary-row"><span class="label">Creativity</span><span class="value">${ccCharacter.ways.creativity}</span></div>
            <div class="summary-row"><span class="label">Reason</span><span class="value">${ccCharacter.ways.reason}</span></div>
        </div>
        <div class="summary-section"><h3>Derived Attributes</h3>
            <div class="summary-row"><span class="label">Defense</span><span class="value">${document.getElementById('stat-defense').textContent}</span></div>
            <div class="summary-row"><span class="label">Speed</span><span class="value">${document.getElementById('stat-speed').textContent}</span></div>
            <div class="summary-row"><span class="label">Stamina</span><span class="value">${document.getElementById('stat-stamina').textContent}</span></div>
            <div class="summary-row"><span class="label">Mental Resistance</span><span class="value">${document.getElementById('stat-mental-resistance').textContent}</span></div>
            <div class="summary-row"><span class="label">Fighting Potential</span><span class="value">${document.getElementById('stat-fighting-potential').textContent}</span></div>
            <div class="summary-row"><span class="label">Survival Points</span><span class="value">${document.getElementById('stat-survival').textContent}</span></div>
            <div class="summary-row"><span class="label">Health Condition Boxes</span><span class="value">${document.getElementById('stat-health').textContent}</span></div>
        </div>
        <div class="summary-section"><h3>Domains</h3>
            ${Object.entries(CC_DOMAINS_BY_WAY).map(([way, domains]) => `<div style="margin-bottom:10px;"><strong style="color:var(--green);text-transform:capitalize;">${way}</strong>${domains.map(d => { const info = allDomains[d]; const dn = d.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()); const desc = CC_DOMAIN_DESCRIPTIONS[d] || ''; return `<div class="summary-row" style="flex-direction:column;align-items:flex-start;"><div style="display:flex;justify-content:space-between;width:100%;"><span class="label">${dn}</span><span class="value">${info.total}${info.label}</span></div>${desc ? `<div style="font-size:0.75rem;opacity:0.6;margin-top:2px;font-style:italic;">${desc}</div>` : ''}</div>`; }).join('')}</div>`).join('')}
        </div>
        <div class="summary-section"><h3>Advantages</h3>
            ${ccCharacter.advantages.length > 0 ? ccCharacter.advantages.map(a => `<div class="summary-row"><span class="label">${a.name}</span><span class="value">${a.cost} XP</span></div>`).join('') : '<div style="opacity:0.5">None</div>'}
        </div>
        <div class="summary-section"><h3>Disadvantages</h3>
            ${ccCharacter.disadvantages.length > 0 ? ccCharacter.disadvantages.map(d => `<div class="summary-row"><span class="label">${d.name}</span><span class="value">${d.cost} XP</span></div>`).join('') : '<div style="opacity:0.5">None</div>'}
        </div>
        <div class="summary-section"><h3>Equipment</h3>
            ${ccCharacter.equipment.length > 0 ? ccCharacter.equipment.map(e => `<div class="summary-row"><span class="label">${e.name}</span><span class="value">${e.cost} Obols</span></div>`).join('') : '<div style="opacity:0.5">None</div>'}
            <div class="summary-row" style="margin-top:8px;border-top:1px solid var(--border);padding-top:5px;"><span class="label"><strong>Remaining Wealth</strong></span><span class="value">${ccCurrentWealth} Obols</span></div>
        </div>
        ${ccCharacter.personality || ccCharacter.background || ccCharacter.appearance ? `<div class="summary-section"><h3>Description</h3>
            ${ccCharacter.personality ? `<div style="margin-bottom:10px;"><strong style="color:var(--gold);">Personality:</strong><br>${ccCharacter.personality}</div>` : ''}
            ${ccCharacter.background ? `<div style="margin-bottom:10px;"><strong style="color:var(--gold);">Background:</strong><br>${ccCharacter.background}</div>` : ''}
            ${ccCharacter.appearance ? `<div><strong style="color:var(--gold);">Appearance:</strong><br>${ccCharacter.appearance}</div>` : ''}
        </div>` : ''}`;
    document.getElementById('character-summary').innerHTML = html;
}

// Export
function ccCopyToClipboard() {
    const text = ccGenerateTextSummary();
    navigator.clipboard.writeText(text).then(() => { alert('Character sheet copied to clipboard!'); }).catch(() => {
        const textarea = document.createElement('textarea'); textarea.value = text; document.body.appendChild(textarea); textarea.select(); document.execCommand('copy'); document.body.removeChild(textarea); alert('Character sheet copied to clipboard!');
    });
}
function ccGenerateTextSummary() {
    const aw = ccCharacter.ways.awareness, co = ccCharacter.ways.combativeness, cv = ccCharacter.ways.conviction, cr = ccCharacter.ways.creativity, re = ccCharacter.ways.reason;
    const allDomains = {};
    Object.entries(CC_DOMAINS_BY_WAY).forEach(([way, domains]) => { domains.forEach(d => { const base = parseInt(document.getElementById('domain-' + d).value) || 0; const bonusVal = (CC_ORIGIN_BONUS_MAP[ccCharacter.origin] === way) ? 1 : 0; allDomains[d] = base + bonusVal; }); });

    let text = `═══════════════════════════════════════\nTAINTED GRAIL — CHARACTER SHEET\n═══════════════════════════════════════\n\nNAME: ${ccCharacter.name}\nCOLOR: ${ccCharacter.color}\nORIGIN: People of the ${ccCharacter.origin}\nOCCUPATION: ${ccCharacter.occupation || 'None'}\nAGE: ${ccCharacter.age}\nQUALITY: ${ccCharacter.quality || '—'}\nFLAW: ${ccCharacter.flaw || '—'}\n\n───────── WAYS ─────────\nAwareness:      ${aw}\nCombativeness:  ${co}\nConviction:     ${cv}\nCreativity:     ${cr}\nReason:         ${re}\n\n───────── DERIVED ATTRIBUTES ─────────\nDefense:              ${document.getElementById('stat-defense').textContent}\nSpeed:                ${document.getElementById('stat-speed').textContent}\nStamina:              ${document.getElementById('stat-stamina').textContent}\nMental Resistance:    ${document.getElementById('stat-mental-resistance').textContent}\nFighting Potential:   ${document.getElementById('stat-fighting-potential').textContent}\nSurvival Points:      ${document.getElementById('stat-survival').textContent}\nHealth Condition:     ${document.getElementById('stat-health').textContent}\n\n───────── DOMAINS ─────────`;
    Object.entries(CC_DOMAINS_BY_WAY).forEach(([way, domains]) => { text += `\n  [${way.toUpperCase()}]`; domains.forEach(d => { const dn = d.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()); text += `\n    ${dn.padEnd(22)} ${allDomains[d]}`; }); });
    text += `\n\n───────── ADVANTAGES ─────────`;
    if (ccCharacter.advantages.length > 0) ccCharacter.advantages.forEach(a => { text += `\n  ${a.name} (${a.cost} XP)`; }); else text += `\n  None`;
    text += `\n\n───────── DISADVANTAGES ─────────`;
    if (ccCharacter.disadvantages.length > 0) ccCharacter.disadvantages.forEach(d => { text += `\n  ${d.name} (${d.cost} XP)`; }); else text += `\n  None`;
    text += `\n\n───────── EQUIPMENT ─────────`;
    if (ccCharacter.equipment.length > 0) { ccCharacter.equipment.forEach(e => { text += `\n  ${e.name} (${e.cost} Obols)`; }); text += `\n  Remaining: ${ccCurrentWealth} Obols`; } else text += `\n  None`;
    if (ccCharacter.personality) text += `\n\n───────── PERSONALITY ─────────\n${ccCharacter.personality}`;
    if (ccCharacter.background) text += `\n\n───────── BACKGROUND ─────────\n${ccCharacter.background}`;
    if (ccCharacter.appearance) text += `\n\n───────── APPEARANCE ─────────\n${ccCharacter.appearance}`;
    text += `\n\n═══════════════════════════════════════`;
    return text;
}

// Initialize equipment on load
document.addEventListener('DOMContentLoaded', function() { ccPopulateEquipment(); });

// ==================== ORIGIN NOTICE FOR STEP 3 ====================
function ccUpdateOriginWayNotice() {
    const notice = document.getElementById('origin-way-notice');
    const noticeText = document.getElementById('origin-way-notice-text');
    if (!ccCharacter.origin) { notice.style.display = 'none'; return; }
    const bonusWay = CC_ORIGIN_BONUS_MAP[ccCharacter.origin];
    if (!bonusWay) { notice.style.display = 'none'; return; }
    const wayName = bonusWay.charAt(0).toUpperCase() + bonusWay.slice(1);
    notice.style.display = 'block';
    noticeText.textContent = `Your Origin (People of the ${ccCharacter.origin}) grants +1 to all ${wayName} Domains.`;
}
// Patch ccNextStep to update notice when entering step 3
const _origNextStep = typeof ccNextStep === 'function' ? ccNextStep : null;
function ccPatchStepTransition() {
    const panels = document.querySelectorAll('.step-panel');
    const observer = new MutationObserver(function() {
        const step3 = document.getElementById('step-3');
        if (step3 && step3.classList.contains('active')) { ccUpdateOriginWayNotice(); }
        ccUpdateColorRecommendations();
    });
    panels.forEach(p => observer.observe(p, { attributes: true, attributeFilter: ['class'] }));
}
document.addEventListener('DOMContentLoaded', ccPatchStepTransition);

// ==================== COLOR RECOMMENDATIONS ====================
const CC_COLOR_RECS = {
    Blue: {
        origin: '<span class="rec-header">Blue — Protector of Humanity</span><div class="rec-body">Strong fits: <strong>People of the Hinterlands</strong> (Combativeness bonus helps defend others) or <strong>People of the North</strong> (Conviction reinforces your selfless determination). Blue Guardians thrive where they can stand between danger and the innocent.</div>',
        ways: '<span class="rec-header">Blue — Recommended Ways</span><div class="rec-body">Prioritize <strong>Combativeness</strong> (4–5) to protect allies in combat and <strong>Conviction</strong> (4–5) to resist fear while shielding others. Blue characters benefit from high resilience — you\'ll be taking hits so others don\'t.</div>',
        occupation: '<span class="rec-header">Blue — Recommended Occupations</span><div class="rec-body">Strong choices: <strong>Knight</strong>, <strong>Soldier</strong>, or <strong>Healer</strong>. Knights and Soldiers give you the combat skills to defend your party. Healers let you protect through restoration. Blue is about sacrifice and standing firm — pick skills that keep others alive.</div>'
    },
    Brown: {
        origin: '<span class="rec-header">Brown — Seeker of Knowledge</span><div class="rec-body">Strong fits: <strong>People of the Continent</strong> (Reason bonus aligns with your scholarly nature) or <strong>People of the South</strong> (Awareness helps you uncover hidden truths). Brown Guardians are drawn to secrets — pick an origin that sharpens your perception or intellect.</div>',
        ways: '<span class="rec-header">Brown — Recommended Ways</span><div class="rec-body">Prioritize <strong>Reason</strong> (4–5) for academic and magical pursuits, and <strong>Awareness</strong> (4–5) for noticing what others miss. Brown characters are investigators and scholars — your mind is your greatest weapon.</div>',
        occupation: '<span class="rec-header">Brown — Recommended Occupations</span><div class="rec-body">Strong choices: <strong>Scholar</strong>, <strong>Magician</strong>, <strong>Augur</strong>, or <strong>Mistfarer</strong>. These give you access to Erudition, Magic, and perception-based skills. Brown thrives on uncovering mysteries — invest in knowledge-gathering domains.</div>'
    },
    Gray: {
        origin: '<span class="rec-header">Gray — Pursuit of Excellence</span><div class="rec-body">Strong fits: <strong>People of the Hinterlands</strong> (combat excellence) or <strong>People of the North</strong> (Conviction fuels your drive to lead). Gray Guardians aspire to be the best — choose an origin that supports your path to mastery, whether martial or social.</div>',
        ways: '<span class="rec-header">Gray — Recommended Ways</span><div class="rec-body">Prioritize <strong>Conviction</strong> (4–5) for unwavering leadership and <strong>Combativeness</strong> or <strong>Creativity</strong> (4–5) depending on whether you lead through martial prowess or inspiring charisma. Gray characters are natural leaders who push themselves and others to greatness.</div>',
        occupation: '<span class="rec-header">Gray — Recommended Occupations</span><div class="rec-body">Strong choices: <strong>Knight</strong>, <strong>Ruler</strong>, <strong>Advisor</strong>, or <strong>Soldier</strong>. Gray excels with Leadership, Inspiration, and combat mastery. Pick occupations that put you at the front — either on the battlefield or in command.</div>'
    },
    Green: {
        origin: '<span class="rec-header">Green — Nature and Balance</span><div class="rec-body">Strong fits: <strong>People of the Mists</strong> (Creativity bonus connects you to the Wyrdness and natural world) or <strong>People of the South</strong> (Awareness sharpens your bond with your surroundings). Green Guardians are attuned to Avalon itself — choose origins tied to the wild.</div>',
        ways: '<span class="rec-header">Green — Recommended Ways</span><div class="rec-body">Prioritize <strong>Awareness</strong> (4–5) to sense nature and danger, and <strong>Creativity</strong> (4–5) to commune with the living world. Green characters are travelers and naturalists — perception and adaptability serve you best.</div>',
        occupation: '<span class="rec-header">Green — Recommended Occupations</span><div class="rec-body">Strong choices: <strong>Hunter</strong>, <strong>Scout</strong>, <strong>Healer</strong>, or <strong>Mistfarer</strong>. These give you Natural Environment, Stealth, Travel, and Perception — the skills of someone who walks alongside nature rather than against it.</div>'
    },
    Red: {
        origin: '<span class="rec-header">Red — Agent of Change</span><div class="rec-body">Strong fits: <strong>People of the Mists</strong> (Creativity supports your unconventional approach) or <strong>People of the Hinterlands</strong> (Combativeness fuels your boldness). Red Guardians break rules and forge new paths — pick an origin that rewards independence and daring.</div>',
        ways: '<span class="rec-header">Red — Recommended Ways</span><div class="rec-body">Prioritize <strong>Creativity</strong> (4–5) for unpredictability and cunning, and <strong>Combativeness</strong> (4–5) for bold, decisive action. Red characters are wildcards — high Creativity gives you Fighting Potential and social agility, while Combativeness ensures you can back up your audacity.</div>',
        occupation: '<span class="rec-header">Red — Recommended Occupations</span><div class="rec-body">Strong choices: <strong>Thug</strong>, <strong>Bard</strong>, <strong>Courier</strong>, or <strong>Scout</strong>. Red thrives outside the system — Communication, Performance, Stealth, and Feats let you talk, sneak, or fight your way through anything unconventionally.</div>'
    }
};

function ccUpdateColorRecommendations() {
    const color = ccCharacter.color;
    const step2 = document.getElementById('color-rec-step2');
    const step3 = document.getElementById('color-rec-step3');
    const step4 = document.getElementById('color-rec-step4');
    if (!color || !CC_COLOR_RECS[color]) {
        if (step2) step2.style.display = 'none';
        if (step3) step3.style.display = 'none';
        if (step4) step4.style.display = 'none';
        return;
    }
    const recs = CC_COLOR_RECS[color];
    if (step2 && document.getElementById('step-2').classList.contains('active')) { step2.innerHTML = recs.origin; step2.style.display = 'block'; }
    if (step3 && document.getElementById('step-3').classList.contains('active')) { step3.innerHTML = recs.ways; step3.style.display = 'block'; }
    if (step4 && document.getElementById('step-4').classList.contains('active')) { step4.innerHTML = recs.occupation; step4.style.display = 'block'; }
}

// ==================== DICE ROLLER ====================
let rollerMode = 'manual';
let rollerLastRoll = null;
let rollerRerollCount = 0;

function rollerSetMode(mode) {
    rollerMode = mode;
    document.querySelectorAll('#tab-roller .mode-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('#tab-roller .mode-btn').forEach(b => { if ((mode === 'manual' && b.textContent.includes('Manual')) || (mode === 'character' && b.textContent.includes('Character'))) b.classList.add('active'); });
    document.getElementById('roller-manual-mode').style.display = mode === 'manual' ? 'block' : 'none';
    document.getElementById('roller-character-mode').style.display = mode === 'character' ? 'block' : 'none';
}

function rollerUpdateDomainOptions() {
    const waySelect = document.getElementById('roller-way-select');
    const domainSelect = document.getElementById('roller-domain-select');
    const way = waySelect.value;
    domainSelect.innerHTML = '<option value="">— Select Domain —</option>';
    if (!way || !CC_DOMAINS_BY_WAY[way]) return;
    CC_DOMAINS_BY_WAY[way].forEach(d => {
        const dn = d.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
        const opt = document.createElement('option');
        opt.value = d; opt.textContent = dn;
        domainSelect.appendChild(opt);
    });
}

function rollerGetValues() {
    if (rollerMode === 'manual') {
        const domainVal = parseInt(document.getElementById('roller-domain-val').value) || 0;
        const wayVal = parseInt(document.getElementById('roller-way-val').value) || 0;
        return { domain: domainVal, way: wayVal };
    } else {
        const wayKey = document.getElementById('roller-way-select').value;
        const domainKey = document.getElementById('roller-domain-select').value;
        if (!wayKey || !domainKey) { alert('Please select a Way and Domain.'); return null; }
        const wayVal = ccCharacter.ways[wayKey] || parseInt(document.getElementById('way-' + wayKey).value) || 0;
        const domainBase = parseInt(document.getElementById('domain-' + domainKey).value) || 0;
        const bonusWay = CC_ORIGIN_BONUS_MAP[ccCharacter.origin];
        const bonusVal = (bonusWay === wayKey) ? 1 : 0;
        return { domain: domainBase + bonusVal, way: wayVal };
    }
}

function rollerRoll() {
    const values = rollerGetValues();
    if (!values) return;
    rollerRerollCount = 0;
    rollerExecuteRoll(values.domain, values.way);
}

function rollerExecuteRoll(domainVal, wayVal) {
    const modifier = parseInt(document.getElementById('roller-modifier').value) || 0;
    const difficulty = parseInt(document.getElementById('roller-difficulty').value) || 11;
    const roll = Math.floor(Math.random() * 10) + 1;

    rollerLastRoll = { domain: domainVal, way: wayVal, modifier, difficulty, roll };
    const total = domainVal + wayVal + roll + modifier;

    // Check for critical (double roll)
    let isCritSuccess = false;
    let isCritFail = false;
    let displayRoll = roll;
    let critRoll2 = null;

    if (roll === 10) {
        critRoll2 = Math.floor(Math.random() * 10) + 1;
        if (critRoll2 === 10) { isCritSuccess = true; displayRoll = '10 → 10'; }
        else { displayRoll = `10 (confirm: ${critRoll2}, not crit)`; }
    } else if (roll === 1) {
        critRoll2 = Math.floor(Math.random() * 10) + 1;
        if (critRoll2 === 1) { isCritFail = true; displayRoll = '1 → 1'; }
        else { displayRoll = `1 (confirm: ${critRoll2}, not crit)`; }
    }

    const resultEl = document.getElementById('roller-result');
    const dieEl = document.getElementById('roller-die-value');
    const breakdownEl = document.getElementById('roller-breakdown');
    const outcomeEl = document.getElementById('roller-outcome');
    const rerollSection = document.getElementById('roller-reroll-section');

    resultEl.classList.add('visible');
    dieEl.innerHTML = `<svg width="80" height="80" viewBox="0 0 100 100" style="vertical-align:middle;"><polygon points="50,5 95,35 82,90 18,90 5,35" fill="var(--bg-card)" stroke="var(--gold)" stroke-width="4"/><text x="50" y="62" text-anchor="middle" font-size="30" font-weight="bold" fill="var(--gold)">${typeof displayRoll === 'string' ? roll : displayRoll}</text></svg> <span style="font-size:1.2rem;vertical-align:middle;">${displayRoll}</span>`;
    dieEl.className = 'die-value';

    const modStr = modifier !== 0 ? ` + (${modifier > 0 ? '+' : ''}${modifier}) modifier` : '';
    breakdownEl.textContent = `${domainVal} (Domain) + ${wayVal} (Way) + ${roll} (D10)${modStr} = ${total} vs DC ${difficulty}`;

    if (isCritSuccess) {
        dieEl.classList.add('crit-success');
        outcomeEl.textContent = '⚡ CRITICAL SUCCESS!';
        outcomeEl.className = 'roll-outcome crit-success';
        rerollSection.style.display = 'none';
    } else if (isCritFail) {
        dieEl.classList.add('crit-fail');
        outcomeEl.textContent = '💀 CRITICAL FAILURE!';
        outcomeEl.className = 'roll-outcome crit-fail';
        rerollSection.style.display = 'block';
    } else if (total >= difficulty) {
        outcomeEl.textContent = '✓ SUCCESS';
        outcomeEl.className = 'roll-outcome success';
        rerollSection.style.display = 'none';
    } else {
        outcomeEl.textContent = '✗ FAILURE';
        outcomeEl.className = 'roll-outcome failure';
        rerollSection.style.display = 'block';
    }
}

function rollerReroll() {
    if (!rollerLastRoll) return;
    rollerRerollCount++;
    if (rollerRerollCount > 3) { alert('Maximum rerolls reached.'); return; }
    const r = rollerLastRoll;
    rollerExecuteRoll(r.domain, r.way);
}

// Mobile tooltip support (click to toggle)
document.addEventListener('DOMContentLoaded', function() {
    if ('ontouchstart' in window) {
        document.querySelectorAll('.domain-tooltip').forEach(el => {
            el.addEventListener('click', function(e) {
                e.stopPropagation();
                const tooltip = this.querySelector('.tooltip-text');
                const isVisible = tooltip.style.visibility === 'visible';
                document.querySelectorAll('.domain-tooltip .tooltip-text').forEach(t => { t.style.visibility = 'hidden'; t.style.opacity = '0'; });
                if (!isVisible) { tooltip.style.visibility = 'visible'; tooltip.style.opacity = '1'; }
            });
        });
        document.addEventListener('click', function() { document.querySelectorAll('.domain-tooltip .tooltip-text').forEach(t => { t.style.visibility = 'hidden'; t.style.opacity = '0'; }); });
    }
});

// ==================== CHARACTER SHEET ====================
function sheetInitCircles() {
    // Health circles
    document.querySelectorAll('.health-circles').forEach(container => {
        const count = parseInt(container.dataset.count);
        container.innerHTML = '';
        for (let i = 0; i < count; i++) {
            const c = document.createElement('span');
            c.className = 'h-circle';
            c.onclick = function() { this.classList.toggle('filled'); sheetAutoSave(); };
            container.appendChild(c);
        }
    });
    // Domain circles (5 per domain + way label)
    document.querySelectorAll('.domain-circles').forEach(container => {
        const way = container.dataset.way;
        container.innerHTML = '';
        for (let i = 0; i < 5; i++) {
            const c = document.createElement('span');
            c.className = 'd-circle';
            c.onclick = function() { this.classList.toggle('filled'); sheetAutoSave(); };
            container.appendChild(c);
        }
        const lbl = document.createElement('span');
        lbl.className = 'domain-way-label';
        lbl.textContent = '+(' + way + '   )';
        container.appendChild(lbl);
    });
    // Gauge circles (15 per segment = 5*3 segments shown as 13 per shown segment)
    document.querySelectorAll('.gauge-circles').forEach(container => {
        container.innerHTML = '';
        for (let i = 0; i < 15; i++) {
            const c = document.createElement('span');
            c.className = 'g-circle';
            c.onclick = function() { this.classList.toggle('filled'); sheetAutoSave(); };
            container.appendChild(c);
        }
    });
}
document.addEventListener('DOMContentLoaded', sheetInitCircles);

function sheetLoadFromCreator() {
    document.getElementById('s-name').value = ccCharacter.name || '';
    document.getElementById('s-age').value = ccCharacter.age || '';
    document.getElementById('s-origin').value = ccCharacter.origin ? 'People of the ' + ccCharacter.origin : '';
    document.getElementById('s-occupation').value = ccCharacter.occupation || '';
    document.getElementById('s-color').value = ccCharacter.color || '';
    document.getElementById('s-way-aw').value = ccCharacter.ways.awareness || '';
    document.getElementById('s-way-co').value = ccCharacter.ways.combativeness || '';
    document.getElementById('s-way-cr').value = ccCharacter.ways.creativity || '';
    document.getElementById('s-way-cv').value = ccCharacter.ways.conviction || '';
    document.getElementById('s-way-re').value = ccCharacter.ways.reason || '';
    // Derived
    const aw = ccCharacter.ways.awareness||0, co = ccCharacter.ways.combativeness||0, cv = ccCharacter.ways.conviction||0, cr = ccCharacter.ways.creativity||0, re = ccCharacter.ways.reason||0;
    document.getElementById('s-defense').value = aw + re + 5;
    document.getElementById('s-speed').value = aw + co;
    document.getElementById('s-stamina').value = 10;
    document.getElementById('s-mr').value = cv + 5;
    let fp = 1; if (cr >= 2 && cr <= 4) fp = 2; if (cr >= 5) fp = 3;
    document.getElementById('s-potential').value = fp;
    let sp = 3; if (ccCharacter.advantages.find(a => a.name === 'Allmother\'s Favor')) sp++; if (ccCharacter.disadvantages.find(d => d.name === 'Godforsaken')) sp--;
    document.getElementById('s-sp-cur').value = sp;
    document.getElementById('s-sp-max').value = sp;
    // Advantages
    for (let i = 1; i <= 5; i++) { document.getElementById('s-adv' + i).value = ccCharacter.advantages[i-1] ? ccCharacter.advantages[i-1].name : ''; }
    for (let i = 1; i <= 5; i++) { document.getElementById('s-dis' + i).value = ccCharacter.disadvantages[i-1] ? ccCharacter.disadvantages[i-1].name : ''; }
    // Domain circles
    const domainMap = { 'close-combat':'close-combat','erudition':'erudition','leadership':'leadership','natural-environment':'natural-environment','shooting-throwing':'shooting-throwing','communication':'communication','feats':'feats','magic':'magic','perception':'perception','stealth':'stealth','compassion':'compassion','healing':'healing','monsters':'monsters','performance':'performance','travel':'travel','craft':'craft','inspiration':'inspiration','mounted-combat':'mounted-combat','religion':'religion','wyrdness-mysteries':'wyrdness-mysteries' };
    document.querySelectorAll('.domain-circles').forEach(container => {
        const domain = container.dataset.domain;
        const val = parseInt(document.getElementById('domain-' + domain)?.value) || 0;
        const circles = container.querySelectorAll('.d-circle');
        circles.forEach((c, i) => { c.classList.toggle('filled', i < val); });
    });
    // Equipment
    const equips = ccCharacter.equipment.map(e => e.name).join(', ');
    if (document.getElementById('s-equip1')) document.getElementById('s-equip1').value = equips;
    document.getElementById('s-riches').value = ccCurrentWealth + ' Obols';
    alert('Sheet loaded from Character Creator!');
}

function sheetAutoSave() { sheetSave(); }
function sheetSave() {
    const data = {};
    // Save inputs with IDs
    document.querySelectorAll('#tab-sheet input[id]').forEach(inp => { data[inp.id] = inp.value; });
    // Save inputs without IDs by index
    document.querySelectorAll('#tab-sheet input:not([id])').forEach((inp, idx) => { data['_noid_' + idx] = inp.value; });
    // Save domain levels
    const domains = {};
    document.querySelectorAll('.domain-circles').forEach(container => {
        var domId = container.dataset.domain;
        if (domId) domains[domId] = container.querySelectorAll('.d-circle.filled').length;
    });
    data._domains = domains;
    // Save health/gauge circles
    const circles = {};
    document.querySelectorAll('#tab-sheet .h-circle, #tab-sheet .g-circle').forEach((c, i) => { circles[i] = c.classList.contains('filled'); });
    data._hgCircles = circles;
    localStorage.setItem('tg-sheet', JSON.stringify(data));
    // Visual feedback
    var btns = document.querySelectorAll('.sheet-toolbar-bar button');
    btns.forEach(function(b) { if (b.textContent === 'Save') { b.textContent = 'Saved!'; setTimeout(function(){ b.textContent = 'Save'; }, 1500); } });
}
function sheetLoad() {
    const raw = localStorage.getItem('tg-sheet');
    if (!raw) return;
    const data = JSON.parse(raw);
    // Restore inputs with IDs
    document.querySelectorAll('#tab-sheet input[id]').forEach(inp => {
        if (data[inp.id] !== undefined) inp.value = data[inp.id];
    });
    // Restore inputs without IDs by index
    document.querySelectorAll('#tab-sheet input:not([id])').forEach((inp, idx) => {
        if (data['_noid_' + idx] !== undefined) inp.value = data['_noid_' + idx];
    });
    // Fill domain circles
    if (data._domains) {
        Object.keys(data._domains).forEach(function(domainId) {
            var val = data._domains[domainId];
            var container = document.querySelector('.domain-circles[data-domain="' + domainId + '"]');
            if (container) {
                container.querySelectorAll('.d-circle').forEach(function(c, i) {
                    if (i < val) c.classList.add('filled');
                    else c.classList.remove('filled');
                });
            }
        });
    }
    // Fill health/gauge circles
    if (data._hgCircles) {
        document.querySelectorAll('#tab-sheet .h-circle, #tab-sheet .g-circle').forEach((c, i) => {
            if (data._hgCircles[String(i)]) c.classList.add('filled');
            else c.classList.remove('filled');
        });
    }
    // Legacy _circles support (from older saves)
    if (data._circles) {
        document.querySelectorAll('#tab-sheet .h-circle, #tab-sheet .d-circle, #tab-sheet .g-circle').forEach((c, i) => {
            if (data._circles[String(i)]) c.classList.add('filled');
        });
    }
}
function sheetClear() {
    if (!confirm('Clear all sheet data?')) return;
    document.querySelectorAll('#tab-sheet input').forEach(inp => { inp.value = ''; });
    document.querySelectorAll('#tab-sheet .h-circle, #tab-sheet .d-circle, #tab-sheet .g-circle').forEach(c => c.classList.remove('filled'));
    localStorage.removeItem('tg-sheet');
}
function printSheet() { window.print(); }
function sheetExport() {
    // Gather data directly without depending on localStorage
    var data = {};
    document.querySelectorAll('#tab-sheet input[id]').forEach(function(inp) { data[inp.id] = inp.value; });
    document.querySelectorAll('#tab-sheet input:not([id])').forEach(function(inp, idx) { data['_noid_' + idx] = inp.value; });
    // Domain levels
    var domains = {};
    document.querySelectorAll('.domain-circles').forEach(function(container) {
        var domId = container.dataset.domain;
        if (domId) domains[domId] = container.querySelectorAll('.d-circle.filled').length;
    });
    data._domains = domains;
    // Health/gauge circles
    var hgCircles = {};
    document.querySelectorAll('#tab-sheet .h-circle, #tab-sheet .g-circle').forEach(function(c, i) { hgCircles[i] = c.classList.contains('filled'); });
    data._hgCircles = hgCircles;

    var json = JSON.stringify(data, null, 2);
    var name = (document.getElementById('s-name').value || 'character').replace(/[^a-z0-9]/gi, '_');
    var a = document.createElement('a');
    a.href = 'data:application/json;charset=utf-8,' + encodeURIComponent(json);
    a.download = name + '_sheet.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}
function sheetImport(event) {
    var file = event.target.files[0];
    if (!file) return;
    var reader = new FileReader();
    reader.onload = function(e) {
        try {
            var data = JSON.parse(e.target.result);
            // Clear everything first
            document.querySelectorAll('#tab-sheet input').forEach(function(inp) { inp.value = ''; });
            document.querySelectorAll('#tab-sheet .h-circle, #tab-sheet .d-circle, #tab-sheet .g-circle').forEach(function(c) { c.classList.remove('filled'); });
            // Fill inputs with IDs
            document.querySelectorAll('#tab-sheet input[id]').forEach(function(inp) {
                if (data[inp.id] !== undefined) inp.value = data[inp.id];
            });
            // Fill inputs without IDs
            document.querySelectorAll('#tab-sheet input:not([id])').forEach(function(inp, idx) {
                if (data['_noid_' + idx] !== undefined) inp.value = data['_noid_' + idx];
            });
            // Fill domain circles
            if (data._domains) {
                Object.keys(data._domains).forEach(function(domainId) {
                    var val = data._domains[domainId];
                    var container = document.querySelector('.domain-circles[data-domain="' + domainId + '"]');
                    if (container) {
                        container.querySelectorAll('.d-circle').forEach(function(c, i) {
                            if (i < val) c.classList.add('filled');
                            else c.classList.remove('filled');
                        });
                    }
                });
            }
            // Fill health/gauge circles
            if (data._hgCircles) {
                document.querySelectorAll('#tab-sheet .h-circle, #tab-sheet .g-circle').forEach(function(c, i) {
                    if (data._hgCircles[String(i)]) c.classList.add('filled');
                    else c.classList.remove('filled');
                });
            }
            // Also save to localStorage for persistence
            try { localStorage.setItem('tg-sheet', JSON.stringify(data)); } catch(x) {}
            alert('Character imported successfully!');
        } catch(err) { alert('Invalid file. Please select a valid .json character export.'); }
    };
    reader.readAsText(file);
    event.target.value = '';
}
function populateSheet() { sheetLoadFromCreator(); }
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(function() {
        // Skip localStorage load if URL has character data (pregen import)
        var hasCharParam = new URLSearchParams(window.location.search).has('char');
        if (!hasCharParam) {
            sheetLoad();
        }
        // Handle hash-based navigation
        if (window.location.hash === '#tab-sheet') {
            document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
            document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            document.getElementById('tab-sheet').classList.add('active');
            document.querySelectorAll('.tab-btn').forEach(b => { if (b.textContent.includes('Character Sheet')) b.classList.add('active'); });
        } else if (window.location.hash === '#tab-creator') {
            switchTab('creator');
        }
    }, 700);
});

// ==================== SHEET ROLLER MODAL ====================
const WAY_MAP = { 'COMB': 'co', 'CREA': 'cr', 'AWAR': 'aw', 'CONV': 'cv', 'REA': 're' };
const WAY_FULL = { 'COMB': 'Combativeness', 'CREA': 'Creativity', 'AWAR': 'Awareness', 'CONV': 'Conviction', 'REA': 'Reason' };

function sheetAddRollButtons() {
    document.querySelectorAll('#tab-sheet .domain-cell').forEach(cell => {
        if (cell.querySelector('.roll-domain-btn')) return;
        const h4 = cell.querySelector('h4');
        const circlesDiv = cell.querySelector('.domain-circles');
        const domainName = h4.textContent.trim();
        const wayAbbr = circlesDiv.dataset.way;
        const btn = document.createElement('button');
        btn.className = 'roll-domain-btn';
        btn.textContent = '🎲';
        btn.title = 'Roll ' + domainName;
        btn.onclick = function(e) {
            e.stopPropagation();
            const filled = circlesDiv.querySelectorAll('.d-circle.filled').length;
            const wayId = 's-way-' + WAY_MAP[wayAbbr];
            const wayVal = parseInt(document.getElementById(wayId).value) || 0;
            openRollModal(domainName, filled, WAY_FULL[wayAbbr], wayVal);
        };
        h4.style.position = 'relative';
        h4.appendChild(btn);
    });
}
document.addEventListener('DOMContentLoaded', function() { setTimeout(sheetAddRollButtons, 600); });

function openRollModal(domainName, domainVal, wayName, wayVal) {
    const modal = document.getElementById('roll-modal');
    document.getElementById('rm-domain-name').textContent = domainName;
    document.getElementById('rm-domain-val').textContent = domainVal;
    document.getElementById('rm-way-name').textContent = wayName;
    document.getElementById('rm-way-val').textContent = wayVal;
    document.getElementById('rm-result-area').style.display = 'none';
    document.getElementById('rm-die-container').className = 'rm-die-container';
    document.getElementById('rm-die-number').textContent = '?';
    modal.style.display = 'flex';
    modal.dataset.domainVal = domainVal;
    modal.dataset.wayVal = wayVal;
}

function closeRollModal() { document.getElementById('roll-modal').style.display = 'none'; }

function executeSheetRoll() {
    const modal = document.getElementById('roll-modal');
    const domainVal = parseInt(modal.dataset.domainVal) || 0;
    const wayVal = parseInt(modal.dataset.wayVal) || 0;
    const difficulty = parseInt(document.getElementById('rm-difficulty').value) || 0;
    const modifier = parseInt(document.getElementById('rm-modifier').value) || 0;
    const dieContainer = document.getElementById('rm-die-container');
    const dieNumber = document.getElementById('rm-die-number');
    const resultArea = document.getElementById('rm-result-area');

    // Roll immediately
    const roll = Math.floor(Math.random() * 10) + 1;
    dieNumber.textContent = roll;
    dieContainer.className = 'rm-die-container';

    // Check crits
    let isCritSuccess = false, isCritFail = false, finalRoll = roll;
    let critText = '';
    if (roll === 10) {
        const confirm = Math.floor(Math.random() * 10) + 1;
        if (confirm === 10) { isCritSuccess = true; finalRoll = 15; critText = ' → 10! (Critical Success!)'; }
        else { critText = ` (confirm: ${confirm}, no crit)`; }
    } else if (roll === 1) {
        const confirm = Math.floor(Math.random() * 10) + 1;
        if (confirm === 1) { isCritFail = true; critText = ' → 1! (Critical Failure!)'; }
        else { critText = ` (confirm: ${confirm}, no crit)`; }
    }

    const total = domainVal + wayVal + finalRoll + modifier;

    // Display results
    resultArea.style.display = 'block';
    document.getElementById('rm-breakdown').textContent = `${domainVal} (Domain) + ${wayVal} (Way) + ${roll} (D10) = ${total}`;
    document.getElementById('rm-vs').textContent = critText || '';

    const outcomeEl = document.getElementById('rm-outcome');
    if (isCritSuccess) {
        outcomeEl.textContent = '⚡ CRITICAL SUCCESS! (Total: ' + total + ')';
        outcomeEl.className = 'rm-outcome rm-crit-success';
        dieContainer.classList.add('crit-success');
    } else if (isCritFail) {
        outcomeEl.textContent = '💀 CRITICAL FAILURE!';
        outcomeEl.className = 'rm-outcome rm-crit-fail';
        dieContainer.classList.add('crit-fail');
    } else {
        outcomeEl.textContent = 'Total: ' + total;
        outcomeEl.className = 'rm-outcome';
    }
}

// ==================== PAGE LOAD & HASH NAVIGATION ====================
// Immediate hash/query check - runs after all DOM is parsed
(function() {
    var hash = window.location.hash;
    var params = new URLSearchParams(window.location.search);

    // Show correct tab if hash says so
    if (hash === '#tab-sheet' || hash === '#tab-creator' || params.has('char')) {
        var ref = document.getElementById('tab-reference');
        var targetId = (params.has('char') || hash === '#tab-sheet') ? 'tab-sheet' : 'tab-creator';
        var target = document.getElementById(targetId);
        if (ref) ref.classList.remove('active');
        if (target) target.classList.add('active');

        // If char data in URL, load it into the sheet inputs after circles init
        if (params.has('char')) {
            // Clear old data first
            localStorage.removeItem('tg-sheet');
            window.addEventListener('load', function() {
                setTimeout(function() {
                    try {
                        // Clear all existing sheet values
                        document.querySelectorAll('#tab-sheet input').forEach(function(inp) { inp.value = ''; });
                        document.querySelectorAll('#tab-sheet .h-circle, #tab-sheet .d-circle, #tab-sheet .g-circle').forEach(function(c) { c.classList.remove('filled'); });

                        var data = JSON.parse(params.get('char'));
                        // Fill text inputs
                        Object.keys(data).forEach(function(key) {
                            if (key === '_circles' || key === '_domains') return;
                            var el = document.getElementById(key);
                            if (el) el.value = data[key];
                        });
                        // Fill domain circles based on _domains data
                        if (data._domains) {
                            Object.keys(data._domains).forEach(function(domainId) {
                                var val = data._domains[domainId];
                                var container = document.querySelector('.domain-circles[data-domain="' + domainId + '"]');
                                if (container) {
                                    var dCircles = container.querySelectorAll('.d-circle');
                                    dCircles.forEach(function(c, i) {
                                        if (i < val) c.classList.add('filled');
                                        else c.classList.remove('filled');
                                    });
                                }
                            });
                        }
                        // Save to localStorage so it persists
                        localStorage.setItem('tg-sheet', JSON.stringify(data));
                    } catch(e) { /* silent */ }
                }, 800);
            });
        }
    }
})();
