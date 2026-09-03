/**
 * Tainted Grail: Song of a Dying World
 * Bestiary & Encounters data + renderer
 *
 * Each encounter was adapted from the board-game Encounter cards into the
 * TTRPG (Shadows of Esteren) framework used across this Help Document.
 *
 * Encounters and creatures share ONE difficulty scale (see UNIFIED MODEL below).
 * Encounter red tokens map to a Difficulty Threshold (1D10 + Domain + Way):
 *   1 token  = Easy (8)
 *   2 tokens = Standard (11)
 *   3 tokens = Complicated (14)
 *   4-5 tokens = Difficult (17+)   [Difficult and Very Difficult fold together]
 *
 * Fields:
 *   name       - encounter title
 *   diff       - number of red tokens (1-5)
 *   loc        - "Settlement" | "Road" | "Wyrdness"
 *   flavor     - italic descriptive text
 *   approaches - [{ name, roll }]  the ways to attempt/win the encounter
 *   stats      - optional combat stat block for a foe (if it turns to violence)
 *   win        - what success grants
 *   lose       - the consequence of failure
 */

const THRESHOLDS = { 1: 'Easy (8)', 2: 'Standard (11)', 3: 'Complicated (14)', 4: 'Difficult (17)', 5: 'Very Difficult (20)' };

const encounters = [
    // ============ SETTLEMENT ENCOUNTERS ============
    {
        name: "Hostile Agent", diff: 2, loc: "Settlement",
        flavor: "Someone turned all these people against you. A whisper campaign has made the settlement a hostile place.",
        approaches: [
            { name: "Stop this Madness", roll: "Communication + Creativity vs Standard (11)" },
            { name: "Find the Perpetrator", roll: "Perception + Awareness vs Standard (11)" }
        ],
        win: "You expose the smear and win the crowd over: gain Experience and your standing in the settlement rises.",
        lose: "The mob turns on you. Your Reputation here is ruined and the crowd's ringleaders come to blows."
    },
    {
        name: "Insinuations in the Street", diff: 3, loc: "Settlement",
        flavor: "A harsh accusation is hurled at you and echoes off the buildings. Your very right to exist is questioned.",
        approaches: [
            { name: "Clear Suspicions", roll: "Communication + Reason vs Complicated (14)" },
            { name: "Maintain Conversation", roll: "Performance + Creativity vs Complicated (14)" },
            { name: "Gain His Trust", roll: "Compassion + Conviction vs Complicated (14)" }
        ],
        win: "You turn the accusation aside and win the street's respect: gain Experience and rising Reputation with the settlement.",
        lose: "The crowd believes the worst of you. Your standing here collapses and you are treated as an outsider and a threat."
    },
    {
        name: "Slighted Nobleman", diff: 3, loc: "Settlement",
        flavor: "You clash with one of the richest and most powerful people in the settlement.",
        approaches: [
            { name: "Calm Him", roll: "Communication + Conviction vs Complicated (14)" },
            { name: "Reach an Agreement", roll: "Communication + Reason vs Complicated (14)" }
        ],
        foeRef: "Seasoned Warrior",
        win: "You placate the nobleman: gain Experience and his grudging favor (Reputation with the local gentry).",
        lose: "He takes offense and sets his champion on you \u2014 the fight turns to the Seasoned Warrior (Complicated, tier 3)."
    },
    {
        name: "Frisked", diff: 1, loc: "Settlement",
        flavor: "Something's tugging at your pockets in the press of the crowd.",
        approaches: [
            { name: "Prove Your Innocence", roll: "Communication + Conviction vs Easy (8)" },
            { name: "Find the Culprit", roll: "Perception + Awareness vs Easy (8)" }
        ],
        win: "You clear your name and recover the pilfered goods: gain Reputation and keep your belongings.",
        lose: "The thief melts into the crowd with your Riches and a piece of your gear."
    },
    {
        name: "Robbed!", diff: 1, loc: "Settlement",
        flavor: "A thief finds time to lift some of your belongings and slips into the throng.",
        approaches: [
            { name: "Catch the Thieves", roll: "Feats + Combativeness vs Easy (8)" }
        ],
        foeRef: "Great Robber",
        win: "You run down the cutpurse and take back what was yours: recover your stolen Riches and gear.",
        lose: "The thief is gone into the throng, and your Riches and a piece of gear with them."
    },
    {
        name: "False Accusation", diff: 2, loc: "Settlement",
        flavor: "An outsider stands unable to prove their innocence before a suspicious crowd.",
        approaches: [
            { name: "Calm the Crowd", roll: "Leadership + Conviction vs Standard (11)" },
            { name: "Prove Your Innocence", roll: "Communication + Reason vs Standard (11)" }
        ],
        win: "You prove your innocence and calm the gathering: gain Experience and Reputation with the settlement.",
        lose: "The crowd hardens into a mob and comes for you (the fight turns to the Angry Mob, Complicated tier 3)."
    },
    {
        name: "Ordeal", diff: 2, loc: "Settlement",
        flavor: "A group of townsfolk decides to escort you out of the settlement — one way or another.",
        approaches: [
            { name: "Prove Gods Favor You", roll: "Religion + Conviction vs Standard (11)" },
            { name: "Deflect the Blame", roll: "Communication + Creativity vs Standard (11)" }
        ],
        win: "You pass their trial and leave with your dignity intact: recover Magic Points as the tension breaks.",
        lose: "Branded unwelcome, you are driven out \u2014 your Reputation with the settlement suffers and you must move on."
    },
    {
        name: "Jury of Peers", diff: 3, loc: "Settlement",
        flavor: "An outsider is invited to a ceremony to allocate court cases — an easy invitation to turn into a trap.",
        approaches: [
            { name: "Analyze Evidence", roll: "Erudition + Reason vs Complicated (14)" },
            { name: "Pass Your Judgment", roll: "Leadership + Conviction vs Complicated (14)" },
            { name: "Take Both Sides", roll: "Communication + Creativity vs Complicated (14)" }
        ],
        win: "Your verdict is respected by all parties: gain Experience and a notable rise in Reputation.",
        lose: "Your judgment satisfies no one; you leave the ceremony disgraced, your standing here undone."
    },
    {
        name: "Weeping Orphan", diff: 1, loc: "Settlement",
        flavor: "A child weeps in the street, waiting for someone kind — or foolish — enough to stop.",
        approaches: [
            { name: "Comfort", roll: "Compassion + Conviction vs Easy (8)" },
            { name: "Find New Guardians", roll: "Communication + Reason vs Easy (8)" }
        ],
        win: "You see the child safe: gain Experience and a little Reputation for your kindness.",
        lose: "You turn the child away, and word of it dims your standing in the settlement."
    },
    {
        name: "Press Gang", diff: 3, loc: "Settlement",
        flavor: "A group of Camelot's soldiers tries to catch outsiders and force them into service — or slavery.",
        approaches: [
            { name: "Escape", roll: "Feats + Combativeness vs Complicated (14)" },
            { name: "Trick Them", roll: "Communication + Creativity vs Complicated (14)" }
        ],
        foeRef: "Warrior",
        win: "You slip the gang and pocket a bribe meant to buy your silence: gain Experience, Reputation, and a little Riches.",
        lose: "You are pressed into service and hauled off \u2014 the ordeal turns to the Wyrdhold (Difficult, tier 4)."
    },
    {
        name: "Sick Fraudster", diff: 2, loc: "Settlement",
        flavor: "A con artist peddles a miracle healer's bargain to the desperate.",
        approaches: [
            { name: "Reveal the Forgery", roll: "Erudition + Reason vs Standard (11)" },
            { name: "Trick the Trickster", roll: "Communication + Creativity vs Standard (11)" }
        ],
        win: "You unmask the fraud before the crowd: gain Reputation, and the grateful marks press some Riches on you.",
        lose: "You are cheated, and the tainted 'remedy' leaves you cursed \u2014 resolve a Wyrdness encounter."
    },
    {
        name: "Disgraced Knight", diff: 2, loc: "Settlement",
        flavor: "In close quarters his problems mount — and now he becomes yours.",
        approaches: [
            { name: "Bring Him Up", roll: "Inspiration + Conviction vs Standard (11)" },
            { name: "Talk Him Down", roll: "Communication + Reason vs Standard (11)" }
        ],
        foeRef: "Lone Squire",
        win: "You steady the fallen knight and share his table: gain Reputation and a measure of provisions (Riches).",
        lose: "Your words cut too deep and he draws steel \u2014 the fight turns to the Lone Squire (Standard, tier 2)."
    },
    {
        name: "Murmurers", diff: 2, loc: "Settlement",
        flavor: "One of them mutters that this settlement is ripe for a night of plunder.",
        approaches: [
            { name: "Join the Crowd", roll: "Stealth + Awareness vs Standard (11)" },
            { name: "Comfort the Widow", roll: "Compassion + Conviction vs Standard (11)" }
        ],
        win: "You defuse the plot or console the grieving: gain Reputation with the settlement.",
        lose: "The plotters mark you as a threat and turn on you \u2014 you lose Riches and the fight goes to the Clansman (Complicated, tier 3)."
    },
    {
        name: "Curfew", diff: 2, loc: "Settlement",
        flavor: "After a recent crime, the local guards enforce an unfair curfew.",
        approaches: [
            { name: "Trick the Guards", roll: "Communication + Creativity vs Standard (11)" },
            { name: "Conceal Yourself", roll: "Stealth + Awareness vs Standard (11)" }
        ],
        foeRef: "Warrior",
        win: "You talk or slip your way past the watch: gain a little Reputation and pass freely.",
        lose: "The guards take you in: pay a fine in Riches, or spend the night detained (losing time and standing)."
    },
    {
        name: "Temptations", diff: 3, loc: "Settlement",
        flavor: "Visitors report heavy, changing visions at night — all of them enticing, none of them safe.",
        approaches: [
            { name: "Resist Yourself", roll: "Mental Resistance (Conviction) vs Complicated (14)" }
        ],
        win: "You master the visions and walk away clear-headed: gain Experience for the trial of will.",
        lose: "You give in to the temptation \u2014 losing Riches to your indulgence and a little standing with those who saw."
    },
    {
        name: "Plague", diff: 4, loc: "Settlement",
        flavor: "A powerful epidemic strikes the town and burns those it touches. It doesn't care who you are.",
        approaches: [
            { name: "Evade the Infected", roll: "Stealth + Awareness vs Difficult (17)" },
            { name: "Ask for Shelter", roll: "Communication + Conviction vs Difficult (17)" }
        ],
        foeRef: "Plagued",
        win: "You slip through the stricken town uninfected: gain Reputation for your composure under the plague.",
        lose: "The sickness takes hold: you contract the Red Death and the ordeal drains your Magic and your standing."
    },
    {
        name: "Law of Hospitality", diff: 2, loc: "Settlement",
        flavor: "The people here are cold, but old customs and laws still bind them — if you know how to invoke them.",
        approaches: [
            { name: "Enforce the Law", roll: "Erudition + Reason vs Standard (11)" }
        ],
        win: "The old laws bind them to host you: you gain shelter and provisions (Riches) for the night.",
        lose: "They turn you out regardless \u2014 you leave weary and diminished, moving on with nothing to show for it."
    },
    {
        name: "Suspicious Guard", diff: 3, loc: "Settlement",
        flavor: "A wary sentinel watches your every move. His trust — or ire — builds across the whole exchange (Affinity Track).",
        approaches: [
            { name: "Explain Yourself", roll: "Communication + Reason vs Complicated (14), repeated each round of the Affinity Track" },
            { name: "Strike (if the track bottoms out)", roll: "Close Combat + Combativeness vs his Defense 11" }
        ],
        foeRef: "Warrior",
        win: "Each success wins his trust; earn it fully and he grants you Reputation and safe passage.",
        lose: "Lose his trust entirely and he raises the alarm, turning the encounter into a fight."
    },

    // ============ ROAD ENCOUNTERS ============
    {
        name: "Hunt", diff: 2, loc: "Road",
        flavor: "Not a soul about the road, but a menacing shadow keeps pace just out of sight.",
        approaches: [
            { name: "Spot your pursuer", roll: "Perception + Awareness vs Standard (11) — roll 1D10 + Caution equivalent, fail under 7" },
            { name: "Outrun it (a Free-dweller!)", roll: "Travel + Awareness vs Standard (11) — roll 1D10 + Practicality equivalent, fail under 7" }
        ],
        foeRef: "Fore-dweller",
        win: "You shake the pursuer and continue on your way, gaining Experience for keeping your nerve.",
        lose: "The Fore-dweller runs you down \u2014 the encounter turns to a fight (see the Fore-dweller in the Bestiary)."
    },
    {
        name: "Last Resort", diff: 2, loc: "Road",
        flavor: "A group of desperate people bar the road and force you to trade with them.",
        approaches: [
            { name: "Talk Them Out", roll: "Communication + Conviction vs Standard (11)" },
            { name: "Try to Escape", roll: "Feats + Combativeness vs Standard (11)" }
        ],
        foeRef: "Vagabond",
        win: "You reach an understanding with the desperate band: gain Experience and a little Reputation.",
        lose: "Talks break down and they turn on you \u2014 the fight goes to the Seasoned Warrior (Complicated, tier 3)."
    },
    {
        name: "Mudlarks", diff: 3, loc: "Road",
        flavor: "Scavengers pick over the muddy roadside, and they've noticed your pack looks heavier than theirs.",
        approaches: [
            { name: "Reveal their Forgery", roll: "Perception + Reason vs Complicated (14)" },
            { name: "Frighten Them Off", roll: "Feats + Combativeness vs Complicated (14)" }
        ],
        win: "You see off the scavengers and salvage something of worth: gain Reputation and a little Riches.",
        lose: "The scavengers get the better of you and make off with some of your Riches."
    },

    // ============ WYRDNESS ENCOUNTERS ============
    {
        name: "A Feast to Devour", diff: 2, loc: "Wyrdness",
        flavor: "A strange host sets a bloodstained bowl of pottage before you and watches, waiting for you to eat.",
        approaches: [
            { name: "Restrain His Attention", roll: "Communication + Reason vs Standard (11)" },
            { name: "Reach an Agreement", roll: "Communication + Creativity vs Standard (11)" },
            { name: "Ask Dangerous Questions", roll: "Wyrdness Mysteries + Creativity vs Standard (11)" }
        ],
        win: "You navigate the strange host's game and leave enriched: gain Experience and a little Riches.",
        lose: "You buy your way out of the bargain, paying in Riches to leave the table unharmed."
    },
    {
        name: "Hallucination", diff: 3, loc: "Wyrdness",
        flavor: "The land shows an environmental wreck that repeats and folds together; figures drift toward it.",
        approaches: [
            { name: "Navigate the Crossroad", roll: "Wyrdness Mysteries + Reason vs Complicated (14)" },
            { name: "Play the Madman", roll: "Performance + Creativity vs Complicated (14)" }
        ],
        win: "You see through the illusion and draw on its power: gain Experience and recover Magic Points.",
        lose: "You lose yourself in the vision, wandering disoriented and shaken (a blow to standing and nerve)."
    },
    {
        name: "Breath of the Wyrdness", diff: 4, loc: "Wyrdness",
        flavor: "Wyrdness mist tunnels through the air and a hovel hangs at impossible angles. The Wyrdness is here.",
        approaches: [
            { name: "Navigate the anomaly", roll: "Wyrdness Mysteries + Spirituality vs Difficult (17) — roll 1D10 + Spirituality, fail under 4" },
            { name: "Avoid unnecessary attention", roll: "Stealth + Awareness vs Difficult (17) — roll 1D10 + Caution, fail under 3" }
        ],
        foeRef: "Wyrdness-Claimed",
        win: "You pass through the anomaly unchanged, gaining Experience for braving the raw Wyrdness.",
        lose: "The mist warps around you: you are drained of Magic and the Wyrdness-Claimed form to attack (see the Bestiary)."
    }
];

/**
 * CREATURES — canonical foes, merged from the Reference Guide Bestiary.
 * Rated by Wyrdness level (the ambient corruption of the place they haunt).
 *
 * Fields:
 *   name    - creature name
 *   level   - Wyrdness level (0-4); "0" bucket also holds level 0-1 foes
 *   levelLabel - display label for the tier
 *   group   - typical numbers encountered
 *   stats   - [[label, value], ...]  compact stat line (Atk/Dmg/Def/Prot/Spd/HP)
 *   special - array of {name, text} special abilities
 */
// CREATURES — the canonical Song of a Dying World stat blocks. Monsters that
// also appeared as Foe cards have been FUSED here: the SoaDW stat block is the
// base, enriched with the card's faction, traits, and flavor, and the card's
// signature move folded into this creature's `special` list.
const creatures = [
    {
        name: "Enraged Beast", level: 0, levelLabel: "Wyrdness Level 0\u20131", group: "groups of 2\u201315",
        faction: "Beast", traits: [],
        flavor: "A wild animal driven to blind fury by the mist, striking anything that moves.",
        stats: [["Atk","8"],["Dmg","2"],["Def","10"],["Prot","0"],["Spd","8"],["HP","15/10/5/3"]],
        special: []
    },
    {
        name: "Roughneck", level: 0, levelLabel: "Wyrdness Level 0\u20131", group: "groups of 3\u201310",
        faction: "Humanoid", traits: [],
        flavor: "A brawler and cutthroat who preys on the weak along Avalon's roads.",
        stats: [["Atk","8"],["Dmg","2"],["Def","12"],["Prot","1"],["Spd","6"],["HP","19/15/10/5"]],
        special: [{ name: "Shiv", text: "On death, roll D10; on 1\u20132, it lands one last attack." }]
    },
    {
        name: "Plagued", level: 2, levelLabel: "Wyrdness Level 2", group: "groups of 3\u20135",
        faction: "Wyrdness", traits: [],
        flavor: "A victim of the Red Death, shambling in search of a cure, a quick end, or fresh victims.",
        stats: [["Atk","8"],["Dmg","0"],["Def","6"],["Spd","3"],["HP","10/5/3"]],
        special: [{ name: "Vector of Disease", text: "On hit, roll D10; on 1, the target makes a Complicated (14) Stamina roll or contracts the Red Death." }]
    },
    {
        name: "Wyrdness-Claimed", level: 2, levelLabel: "Wyrdness Level 2", group: "1\u20134",
        faction: "Wyrdness", traits: [],
        flavor: "A person the mist has broken and remade into something that no longer remembers being human.",
        stats: [["Atk","12"],["Dmg","2"],["Def","13"],["Prot","2"],["Spd","6"],["HP","25/15/10/5"]],
        special: [
            { name: "Dreadful", text: "Complicated (14) Mental Resistance or suffer \u22122 to all rolls for 1 Round." },
            { name: "Regeneration", text: "Recovers +1 HP per turn." }
        ]
    },
    {
        name: "Fore-dweller", level: 3, levelLabel: "Wyrdness Level 3", group: "groups of 3\u201310",
        faction: "Fore-dweller", traits: ["Guardian", "Defensive", "Feint", "Shatter"],
        flavor: "One of the four-armed titans that ruled Avalon before humankind. Elders among them have hardened through centuries of endless war.",
        stats: [["Atk","18"],["Dmg","5"],["Def","18"],["Prot","3"],["Spd","8"],["Pot","3"],["HP","25/15/10/5"]],
        special: [{ name: "Cross Strike", text: "Attacks twice per Round with its four arms. On a hit, the target's shield or armor loses 1 Protection until the fight ends (Shatter)." }]
    },
    {
        name: "Wyrdbear", level: 3, levelLabel: "Wyrdness Level 3", group: "solitary",
        faction: "Beast", traits: ["Guardian"],
        flavor: "A bear that found its feeding ground in the Wyrdness. It did not take long for the mist to remake it.",
        stats: [["Atk","16"],["Dmg","6"],["Def","12"],["Prot","1"],["Spd","8"],["HP","40/30/20/10"]],
        special: [
            { name: "Bloodthirsty", text: "+2 Atk and Feats while at Bad health or worse." },
            { name: "Feral Rampage", text: "On a hit, deals +6 extra damage." }
        ]
    },
    {
        name: "Scarlet Wyrm", level: 4, levelLabel: "Wyrdness Level 4", group: "solitary",
        faction: "Beast", traits: ["Guardian"],
        flavor: "An ancient serpent grown vast on the blood of Avalon, its scales the color of dried gore.",
        stats: [["Atk","16"],["Dmg","5"],["Def","16"],["Prot","4"],["Spd","10"],["HP","50/40/20/10"]],
        special: [
            { name: "Regeneration", text: "Recovers +2 HP per turn." },
            { name: "Constrict", text: "Immobilizes and deals 5 damage per Round; Exceptional (25) Feats roll to escape." }
        ]
    }
];

/**
 * FOES — combat foes adapted from the physical Encounter/Foe decks into
 * Song of a Dying World terms. Duplicates have been merged into one entry each.
 *
 *   - difficulty (tier) is read from the RED TOKENS at the top of the card.
 *   - flavor has been cleaned into readable prose.
 *   - Reward/Loot are intentionally omitted here; they are tailored to Song of
 *     a Dying World logic elsewhere.
 *   - every foe has a SPECIAL: a signature move/ability in SoaDW style.
 *
 * Fields:
 *   name    - foe name
 *   tier    - difficulty from red tokens (1-4 on the shared scale; 5 folds to 4)
 *   faction - "Fore-dweller" | "Wyrdness" | "Beast" | "Bandit" | "Knight"
 *             | "Humanoid" | "Traveler"
 *   traits  - array of combat keywords (Guardian, Defensive, Ambush, Rush,
 *             Horde, Fast, Feint, Shatter, Slow, Opportunist, Robber, Boss)
 *   flavor  - cleaned descriptive prose
 *   special - { name, text }  signature move / ability
 */
const foes = [
    // ===== WYRDNESS & FORE-DWELLERS =====
    { name: "Scourge", tier: 3, faction: "Wyrdness", traits: ["Guardian", "Horde"],
      flavor: "A rolling wall of cursed souls that sweeps across the land like a living swarm, dragging the weak into its churning mass.",
      special: { name: "Engulf", text: "At the start of each Round, every Character in reach makes a Complicated (14) Feats roll or is pulled 2 yards toward the Scourge and takes 3 damage." } },
    { name: "Fore-dweller Spirit", tier: 3, faction: "Fore-dweller", traits: ["Ambush", "Feint"],
      flavor: "The restless essence of a titan slain by Arthur's knights, bound to Avalon by an endless cycle of despair.",
      special: { name: "Vengeful Echo", text: "The first time it drops to Bad health, it strikes immediately as a free attack before it can be interrupted." } },
    { name: "Wyrd Titan", tier: 4, faction: "Fore-dweller", traits: ["Guardian"],
      flavor: "A towering aberration warped by the Wyrdness far beyond its original shape, still lashing out with a titan's strength.",
      special: { name: "Wyrd-Warped", text: "Ignores the first 3 points of any non-magical damage each Round; magical attacks strike it in full." } },
    { name: "Reclaimer", tier: 4, faction: "Wyrdness", traits: ["Guardian", "Defensive", "Fast"],
      flavor: "A remnant shard of Wyrdness sentience that hunts to reclaim what the mist has marked as its own.",
      special: { name: "Unmaking Touch", text: "On a hit, the target makes a Difficult (17) Mental Resistance roll or has one carried Item unravel into mist and vanish." } },
    { name: "Yr Hen Wraich", tier: 3, faction: "Wyrdness", traits: ["Ambush"],
      flavor: "A monstrous hag who creeps into homes by night to feed on the breath of sleepers.",
      special: { name: "Night Terror", text: "If it acts before a Character has acted this fight, that Character suffers \u22122 to their first roll (Complicated (14) Mental Resistance to negate)." } },
    { name: "Apparition", tier: 3, faction: "Wyrdness", traits: ["Fast", "Opportunist"],
      flavor: "Your own fears given shape by the mist, striking from where you least want to look.",
      special: { name: "Fade", text: "If it survives the Round, it may vanish and re-form; the next attack against it automatically misses." } },
    { name: "Devouring Voracity", tier: 3, faction: "Wyrdness", traits: ["Defensive", "Opportunist"],
      flavor: "When an indescribable hunger takes the Wyrdness, it turns first upon its own body, then upon everything else.",
      special: { name: "Consume", text: "Whenever it hits, it heals 3 Health. If reduced to 0 while it still has a target engaged, it makes one final Consume attack." } },
    { name: "Flesh Wraith", tier: 3, faction: "Wyrdness", traits: ["Feint"],
      flavor: "A creature of stitched flesh that gathers strength the longer a hunt drags on, pressing ever forward.",
      special: { name: "Mounting Dread", text: "Its Attack and damage increase by +1 each Round it remains in the fight (no maximum)." } },
    { name: "Dread Fowler", tier: 4, faction: "Wyrdness", traits: ["Shatter", "Slow"],
      flavor: "A once-revered corpse, buried with honor, that has reanimated as a shambling discharge of the mist.",
      special: { name: "Grave Rot", text: "On a hit, the target makes a Difficult (17) Stamina roll or suffers 2 ongoing damage each Round until magically healed." } },
    { name: "Wraithbird", tier: 3, faction: "Beast", traits: ["Guardian", "Opportunist"],
      flavor: "A carrion bird twisted by the Wyrdness into something that hunts the living as eagerly as the dead.",
      special: { name: "Shrieking Dive", text: "Once per fight it dives from above: unavoidable attack that ignores Defense but deals half damage." } },
    { name: "Wilderness Priestess", tier: 3, faction: "Wyrdness", traits: ["Guardian"],
      flavor: "A hedge-witch the wilds have claimed, cloaked in distant, watchful powers that guard her on the road.",
      special: { name: "Hex", text: "At the start of the fight, one Character makes a Complicated (14) Mental Resistance roll or suffers \u22121 to all rolls until she is defeated." } },
    { name: "Wyrd-Claimed", tier: 3, faction: "Wyrdness", traits: [],
      flavor: "A soul who ventured too far into the mist and came back as something the Wyrdness now wears.",
      special: { name: "Contagion of the Mist", text: "On a hit, roll D10; on 1\u20132 the Wyrdness level of the area rises by 1 for the rest of the encounter." } },
    { name: "Mist Stalker", tier: 3, faction: "Wyrdness", traits: ["Ambush"],
      flavor: "A hunter that haunts the grey expanse of the Wyrdness, striking before its prey knows it is there.",
      special: { name: "From the Mist", text: "Ambush: no Escape from Combat is possible until it has been dealt damage. Its first attack is made with +3." } },
    { name: "Interred Corpse", tier: 3, faction: "Wyrdness", traits: ["Opportunist"],
      flavor: "A survivor of the dread massacre, buried alive and dug back up by hatred and a thirst for revenge.",
      special: { name: "Undying Spite", text: "The first time it would be reduced to 0 Health, it instead survives with 1 Health and attacks immediately." } },
    { name: "Whisperer Wisp", tier: 1, faction: "Wyrdness", traits: [],
      flavor: "A drifting mote of mist that murmurs the place and hour of your death, hoping you draw near enough to hear.",
      special: { name: "Deathwhisper", text: "Each Round, one Character who can hear it makes an Easy (8) Mental Resistance roll or loses 1 point of Escape from Combat." } },
    { name: "Pyre", tier: 3, faction: "Wyrdness", traits: [],
      flavor: "A defensive-looking mound of embers and ash that burns everything foolish enough to draw near.",
      special: { name: "Blazing Aura", text: "Any Character who ends the Round in reach takes 2 fire damage automatically, ignoring Protection from non-metal armor." } },
    { name: "Verdict of the Wyrd", tier: 4, faction: "Wyrdness", traits: ["Boss"],
      flavor: "A judgment made flesh by the mist. It weighs every soul before it and metes out a sentence no mortal can appeal.",
      special: { name: "Attribute Track", text: "Boss fight run on an Attribute-Key track: place a Key on the Combat Table each Round; the number of Keys sets its attack. You cannot flee until at least one of its aspects is destroyed." } },

    // ===== BEASTS & WILDS =====
    { name: "Wyrmling", tier: 1, faction: "Beast", traits: ["Defensive", "Rush"],
      flavor: "A spined hatchling the size of a hound. Until you met one, you thought hedgehogs were harmless.",
      special: { name: "Quill Burst", text: "The first time it is struck in melee, the attacker takes 2 damage from its flared spines." } },
    { name: "Blight Hallett", tier: 3, faction: "Beast", traits: ["Guardian", "Defensive", "Shatter"],
      flavor: "A thicket-thing that stirs and rustles as if a chorus of voices lived within its tangled wood.",
      special: { name: "Rending Bark", text: "On a hit, the target's shield or worn armor loses 1 Protection for the rest of the fight (Shatter)." } },
    { name: "Fyxe", tier: 2, faction: "Beast", traits: ["Opportunist"],
      flavor: "A near-invisible island fox said to be the only creature the Wyrdness leaves untouched.",
      special: { name: "Slip Away", text: "When it would make an Opportunity attack, a Character may pay 1 Magic to ignore that attack entirely." } },
    { name: "Sun Wyrm", tier: 3, faction: "Beast", traits: ["Guardian", "Opportunist"],
      flavor: "The oldest and most majestic of wyrms, fond of basking and scratching its bulk against sun-baked stone.",
      special: { name: "Scorching Coils", text: "Whenever it hits the same Character twice in one fight, that Character suffers \u22122 Speed until the fight ends." } },
    { name: "Underground Wyrm", tier: 3, faction: "Beast", traits: ["Guardian", "Opportunist"],
      flavor: "A burrower driven into the deep tunnels ages ago, where it waits in the dark for prey to pass overhead.",
      special: { name: "Burst Ambush", text: "On the Round it appears, it erupts from below: its first attack is unavoidable and cannot be defended against." } },
    { name: "Giant Rustling", tier: 3, faction: "Beast", traits: ["Opportunist", "Slow"],
      flavor: "A lumbering giant whose kind once formed the first line of the Fore-dwellers' defense.",
      special: { name: "Ground Slam", text: "Once per fight it strikes the earth: every Character in reach makes a Complicated (14) Feats roll or is knocked prone (\u22122 Defense next Round)." } },
    { name: "Bog Maggot", tier: 3, faction: "Beast", traits: ["Slow"],
      flavor: "A bloated grub of the mire whose reek clings to everything it touches.",
      special: { name: "Mire Grip", text: "While engaged with it, Characters cannot use Escape from Combat; a Complicated (14) Feats roll breaks free." } },
    { name: "River Highfather", tier: 3, faction: "Beast", traits: ["Ambush"],
      flavor: "A winged frog with a serpent's head at the tip of its tail. The largest are as big as boats.",
      special: { name: "Tail Lash", text: "After it attacks, its tail-head makes a second Ambush strike against a different Character with \u22122 Attack." } },
    { name: "Alder Tree", tier: 2, faction: "Beast", traits: ["Ambush", "Guardian"],
      flavor: "A walking tree of many seasons at once: bare stone branches, budding limbs, and boughs in full bloom.",
      special: { name: "Sap the Weave", text: "At the start of the fight, each Character loses 1 Magic point (Complicated (14) Wyrdness Mysteries to resist)." } },
    { name: "Snek", tier: 2, faction: "Beast", traits: ["Guardian", "Ambush"],
      flavor: "A sharp-toothed sea-maiden that lurks in shallow, muddied water, waiting to drag victims under.",
      special: { name: "Drag Under", text: "On a hit against an engaged Character, that Character makes a Standard (11) Feats roll or is pulled into deep water and fights at \u22122 next Round." } },
    { name: "Wyrdbeak", tier: 2, faction: "Beast", traits: ["Guardian"],
      flavor: "A raptor that found a feeding ground in the Wyrdness; it did not take long for the mist to change it.",
      special: { name: "Rending Beak", text: "On a roll of a natural 10 to hit, it deals double damage as it tears in with its warped beak." } },
    { name: "Thorough Hunter", tier: 2, faction: "Beast", traits: ["Ambush", "Rush"],
      flavor: "A patient predator that can run down a stray sheep or a wandering child with equal ease.",
      special: { name: "Run Down", text: "If a Character attempts to Run Away, the Hunter makes an immediate free attack with +2 before they can flee." } },
    { name: "Flock of Puffins", tier: 1, faction: "Beast", traits: ["Horde"],
      flavor: "A swarm of clever seabirds that never forget a face, and never forgive an empty net.",
      special: { name: "Swarm Peck", text: "It attacks every engaged Character each Round for 1 damage each; the swarm ignores 1 point of Protection." } },
    { name: "Swarming", tier: 1, faction: "Beast", traits: ["Defensive", "Slow"],
      flavor: "A crawling mass of vermin too numerous to fight cleanly and too mindless to reason with.",
      special: { name: "Cling", text: "On a hit, the target discards 1 carried Item (dropped or fouled) unless they pass an Easy (8) Feats roll." } },
    { name: "Dire Boar", tier: 1, faction: "Beast", traits: ["Ambush", "Defensive", "Feint"],
      flavor: "A river-dwelling brute so aggressive you will think twice before stopping to drink again.",
      special: { name: "Goring Charge", text: "Its first attack each fight is a Feint that ignores the target's shield bonus to Defense." } },
    { name: "Pack of Strays", tier: 2, faction: "Beast", traits: ["Horde"],
      flavor: "When a far-off village dies out, packs of stray dogs claim its bones and remains as their own.",
      special: { name: "Pack Tactics", text: "It gains +2 Attack while more than one Character is engaged with it, as the pack swarms the outnumbered." } },
    { name: "Glade Hare", tier: 1, faction: "Beast", traits: ["Opportunist"],
      flavor: "Though at first no larger than a chicken, it is famed for its uncanny stubbornness.",
      special: { name: "Bounding Escape", text: "It may Run Away on any Round; if it does, it takes no Opportunity attacks as it flees." } },
    { name: "Frenzied Boar", tier: 2, faction: "Beast", traits: ["Rush"],
      flavor: "Panicked by the mist, it charges headlong at anything that so much as looks like an obstacle.",
      special: { name: "Blind Charge", text: "On the Round it engages, it deals +3 damage but suffers \u22122 Defense until its next turn." } },
    { name: "Royal Elk", tier: 2, faction: "Beast", traits: ["Fast"],
      flavor: "Strong as a bull and crowned with antlers that could pierce a plate of steel.",
      special: { name: "Antler Toss", text: "On a hit, the target makes a Standard (11) Feats roll or is thrown 2 yards and knocked prone." } },
    { name: "Fenris", tier: 3, faction: "Beast", traits: ["Fast"],
      flavor: "A wolf-beast of terrible size, its howl enough to scatter braver hearts than most.",
      special: { name: "Terrifying Howl", text: "At the start of the fight, each Character makes a Complicated (14) Mental Resistance roll or acts last next Round." } },
    // ===== KNIGHTS, HUMANOIDS & BANDITS =====
    { name: "Warrior", tier: 2, faction: "Humanoid", traits: ["Defensive", "Horde"],
      flavor: "Hired steel for some local lordling who gathers armed men and makes laws of his own.",
      special: { name: "Shield Wall", text: "While another Warrior or ally fights beside it, it gains +2 Defense." } },
    { name: "Aggressor", tier: 2, faction: "Humanoid", traits: ["Fast", "Opportunist"],
      flavor: "A townsman whose mind gave way to the madness that has settled over this place.",
      special: { name: "Wild Swing", text: "It attacks first every Round (Fast); on a miss, it still deals 1 damage to a random engaged Character." } },
    { name: "Rose Knight", tier: 4, faction: "Knight", traits: ["Defensive", "Fast"],
      flavor: "A wandering knight bound to a formalist creed that has cursed her to walk a lonely, bloody road.",
      special: { name: "Riposte", text: "The first time an attack misses her each Round, she makes an immediate free counterattack." } },
    { name: "Vanguard", tier: 4, faction: "Knight", traits: ["Guardian"],
      flavor: "It takes little to turn a frightened people against strangers, and less to make them follow a man in armor.",
      special: { name: "Rally", text: "While the Vanguard lives, any allied foes in the fight gain +1 Attack." } },
    { name: "Fallen Hero", tier: 4, faction: "Knight", traits: ["Ambush"],
      flavor: "Broken by a horror that nearly claimed his life, he lingers on\u2014resigned, bitter, yet willing to aid those he judges worthy.",
      special: { name: "One Last Stand", text: "Below Bad health he ignores all Health penalties and gains +3 Attack, fighting as though nothing is left to lose." } },
    { name: "Beast Master", tier: 3, faction: "Humanoid", traits: ["Fast", "Feint"],
      flavor: "He wears his raw weapons across his back and moves as though he were another kind of creature entirely.",
      special: { name: "Loose the Beast", text: "Once per fight he sets a Beast on the party: resolve a Wyrmling attack against a random Character before he acts." } },
    { name: "Knight Errant", tier: 2, faction: "Knight", traits: ["Guardian", "Opportunist", "Rush"],
      flavor: "Driven mad by his endless quest, this knight now sees a mortal enemy in every stranger he meets.",
      special: { name: "Zealous Charge", text: "On the Round he engages, his first attack ignores 2 points of the target's Protection." } },
    { name: "Enforcers", tier: 2, faction: "Humanoid", traits: ["Horde", "Opportunist"],
      flavor: "Zealots of the sects and grim religions that prey on Avalon's frightened and disappointed people.",
      special: { name: "Zealot Numbers", text: "Deal 1 unavoidable damage to one Character at the start of each Round while two or more Enforcers remain." } },
    { name: "Cutthroat Party", tier: 2, faction: "Bandit", traits: ["Horde"],
      flavor: "A band of like-minded cutthroats who ravage what they find and move on before anyone can answer for it.",
      special: { name: "Gang Up", text: "For each Character already engaged with the party, it gains +1 Attack against the newest arrival." } },
    { name: "Head Zealot", tier: 3, faction: "Humanoid", traits: ["Defensive", "Fast"],
      flavor: "A man of great spirit and ambition, beloved by his followers and certain that destiny is his alone.",
      special: { name: "Fanatic Sermon", text: "While he lives, allied Enforcers and Humanoids reroll failed Attack rolls once per Round." } },
    { name: "Seasoned Warrior", tier: 2, faction: "Humanoid", traits: ["Feint"],
      flavor: "Beware the old fighter in a young war; he has outlived every man who underestimated him.",
      special: { name: "Veteran Feint", text: "Once per fight, he feints: the target defends at \u22123 against his next attack." } },
    { name: "Cruel Raiders", tier: 3, faction: "Bandit", traits: ["Feint", "Robber"],
      flavor: "A band of opportunists, each one eager to prove himself the cruelest of a cruel company.",
      special: { name: "Plunder", text: "On a hit, roll D10; on 1\u20133 the target loses 1 Wealth or 1 random Item to the raiders (Robber)." } },
    { name: "Bowstrings", tier: 2, faction: "Humanoid", traits: ["Guardian", "Ambush"],
      flavor: "A follower of the ancient Bowfather; to her, every stranger is simply another mark.",
      special: { name: "Opening Volley", text: "She looses an Ambush shot before the fight begins: one Character takes 3 damage (Standard (11) Perception to dodge)." } },
    { name: "Lone Squire", tier: 2, faction: "Knight", traits: ["Defensive"],
      flavor: "A castoff of some ruined and disgraced house, more scarecrow than soldier, but still armed.",
      special: { name: "Dogged Guard", text: "The first hit against him each Round deals 2 less damage as he throws up a desperate parry." } },
    { name: "Great Robber", tier: 2, faction: "Bandit", traits: ["Fast", "Robber"],
      flavor: "A lifetime haunting these dreadful roads has taught her every dirty trick worth knowing.",
      special: { name: "Cutpurse", text: "On her first hit, the target loses 1 Wealth or 1 random Item (Standard (11) Perception to prevent)." } },
    { name: "Cruel Freebooter", tier: 2, faction: "Bandit", traits: ["Rush"],
      flavor: "It is hard not to lose your mind when the whole world has gone mad; he simply leaned into it.",
      special: { name: "Reckless Assault", text: "On the Round he engages, +2 Attack but he takes 1 damage for each of his own attacks." } },
    { name: "Vagabond", tier: 1, faction: "Humanoid", traits: ["Fast"],
      flavor: "Life on the trail teaches a hard lesson quickly: prey on the weaker before they prey on you.",
      special: { name: "Quick Feet", text: "It may attempt to Run Away on any Round and gains +2 on the roll to do so." } },
    { name: "Wilderness Pirates", tier: 1, faction: "Bandit", traits: ["Robber"],
      flavor: "Road-reavers who believe stolen fortune protects them, right up until the day it does not.",
      special: { name: "Shake Down", text: "At the start of the fight, each Character chooses to pay 1 Wealth or 1 Food, or fight the Pirates at \u22121 Defense." } },
    { name: "Clansman", tier: 2, faction: "Humanoid", traits: [],
      flavor: "Do not let the beady eyes and soft belly fool you; he has seen far more bloodshed than he lets on.",
      special: { name: "Dirty Fighter", text: "On a hit against a Character who has not yet acted this fight, he deals +2 damage." } },
    { name: "Wandering Preacher", tier: 1, faction: "Humanoid", traits: [],
      flavor: "A holy man who wandered too far into the mist and came back preaching to no one at all.",
      special: { name: "Maddening Litany", text: "Deals 1 unavoidable damage to one Character each Round unless silenced (defeated or a Standard (11) Communication roll)." } },
    { name: "Baron von Highworld", tier: 4, faction: "Humanoid", traits: ["Robber", "Guardian"],
      flavor: "A grasping lord, disgraced yet ever eager to seize whatever, and whoever, crosses into his claim.",
      special: { name: "Toll of the Baron", text: "On a hit, the target loses 1 Wealth (Robber); if they have none, they take 3 extra damage instead." } },

    // ===== TRAVELERS (non-combat encounters) =====
    { name: "Traveling Merchant", tier: 1, faction: "Traveler", traits: [],
      flavor: "A wandering trader who unpacks a bargain or two on the loneliest stretches of road.",
      special: { name: "Wares", text: "Draw 3 random Items. Buy any Craftable Item for 1 Wealth and any other Item for 2 Wealth; sell any of your Items for 1 Wealth each." } },
    { name: "Traveling Herbalist", tier: 1, faction: "Traveler", traits: [],
      flavor: "A root-and-remedy peddler who knows which of Avalon's plants will heal you and which will not.",
      special: { name: "Remedies", text: "Draw 3 random Items. Buy any Craftable Item for 1 Wealth and any other Item for 2 Wealth; sell any of your Items for 1 Wealth each." } }
];

// ==================== UNIFIED MODEL ====================
// One difficulty scale spans both datasets:
//   Tier 1 Easy        = encounter diff 1  |  creature level 0-1
//   Tier 2 Standard    = encounter diff 2  |  creature level 2
//   Tier 3 Complicated = encounter diff 3  |  creature level 3
//   Tier 4 Difficult   = encounter diff 4 & 5  |  creature level 4
const TIER_LABEL = { 1: 'Easy (8)', 2: 'Standard (11)', 3: 'Complicated (14)', 4: 'Difficult (17+)' };

function encounterTier(diff) { return diff >= 4 ? 4 : diff; }        // 4 and 5 both fold into 4
function creatureTier(level) { return level <= 1 ? 1 : level; } // 0/1->1, 2->2, 3->3, 4->4

// Build one combined, tier-tagged list. Encounters keep their location;
// creatures and foes are grouped under the pseudo-location "Creature".
function foeTier(tier) { return tier >= 4 ? 4 : tier; } // clamp 5 into 4 on the shared scale

const entries = []
    .concat(encounters.map(function (e) {
        return { type: 'encounter', tier: encounterTier(e.diff), loc: e.loc, data: e };
    }))
    .concat(creatures.map(function (c) {
        return { type: 'creature', tier: creatureTier(c.level), loc: 'Creature', data: c };
    }))
    .concat(foes.map(function (f) {
        return { type: 'foe', tier: foeTier(f.tier), loc: 'Creature', data: f };
    }));

// ==================== RENDER ====================
const cardGrid = document.getElementById('cardGrid');
const searchBar = document.getElementById('searchBar');
let currentDiff = 'all';
let currentLoc = 'all';

function tokenString(n) {
    return '\u25CF'.repeat(n);
}

function creatureCardHTML(c, tier) {
    var statLine = c.stats.map(function (pair) {
        return '<span><strong>' + pair[0] + ':</strong> ' + pair[1] + '</span>';
    }).join('');
    var specials = '';
    if (c.special.length) {
        specials = '<div class="card-section-title">Special</div>' + c.special.map(function (s) {
            return '<div class="approach"><span class="a-name">' + s.name + '.</span> ' + s.text + '</div>';
        }).join('');
    }
    var traits = (c.traits && c.traits.length)
        ? '<div class="card-section-title">Traits</div><div class="approach">' + c.traits.join(' &middot; ') + '</div>'
        : '';
    var faction = c.faction || 'Creature';
    return '' +
        '<div class="card">' +
            '<div class="card-header">' +
                '<span class="card-name">' + c.name + '</span>' +
                '<span class="card-tokens" title="' + TIER_LABEL[tier] + '">' + tokenString(tier) + '</span>' +
            '</div>' +
            '<div class="card-meta">' +
                '<span class="card-loc">' + faction + '</span>' +
                '<span><strong>' + c.levelLabel + '</strong></span>' +
                '<span><strong>Encountered:</strong> ' + c.group + '</span>' +
            '</div>' +
            (c.flavor ? '<div class="card-flavor">' + c.flavor + '</div>' : '') +
            '<div class="stat-block"><div class="sb-name">' + c.name + '</div><div class="stat-line">' + statLine + '</div></div>' +
            traits +
            specials +
        '</div>';
}

function foeCardHTML(f, tier) {
    var traits = (f.traits && f.traits.length)
        ? '<div class="card-section-title">Traits</div><div class="approach">' + f.traits.join(' &middot; ') + '</div>'
        : '';
    var special = f.special
        ? '<div class="card-section-title">Special</div><div class="approach"><span class="a-name">' + f.special.name + '.</span> ' + f.special.text + '</div>'
        : '';
    return '' +
        '<div class="card">' +
            '<div class="card-header">' +
                '<span class="card-name">' + f.name + '</span>' +
                '<span class="card-tokens" title="' + TIER_LABEL[tier] + '">' + tokenString(tier) + '</span>' +
            '</div>' +
            '<div class="card-meta">' +
                '<span class="card-loc">' + f.faction + '</span>' +
                '<span><strong>Difficulty:</strong> ' + TIER_LABEL[tier] + '</span>' +
            '</div>' +
            (f.flavor ? '<div class="card-flavor">' + f.flavor + '</div>' : '') +
            traits +
            special +
        '</div>';
}

// Lookup of every Bestiary combatant (creatures + foes) by name, so encounters
// can reference a foe instead of carrying their own stat block.
var BESTIARY_BY_NAME = {};
creatures.forEach(function (c) { BESTIARY_BY_NAME[c.name] = { faction: c.faction || 'Creature', tier: creatureTier(c.level) }; });
foes.forEach(function (f) { BESTIARY_BY_NAME[f.name] = { faction: f.faction, tier: foeTier(f.tier) }; });

function encounterCardHTML(e, tier) {
    var approaches = e.approaches.map(function (a) {
        return '<div class="approach"><span class="a-name">' + a.name + '</span><br><span class="a-roll">' + a.roll + '</span></div>';
    }).join('');

    var foeRef = '';
    if (e.foeRef) {
        var ref = BESTIARY_BY_NAME[e.foeRef];
        var refMeta = ref ? ' <span style="color:var(--text-secondary);">(' + ref.faction + ' &middot; ' + TIER_LABEL[ref.tier] + ')</span>' : '';
        foeRef = '<div class="card-section-title">If it comes to blows</div>' +
            '<div class="approach">See the Bestiary: <span class="a-name">' + e.foeRef + '</span>' + refMeta + '</div>';
    }

    return '' +
        '<div class="card">' +
            '<div class="card-header">' +
                '<span class="card-name">' + e.name + '</span>' +
                '<span class="card-tokens" title="' + TIER_LABEL[tier] + '">' + tokenString(tier) + '</span>' +
            '</div>' +
            '<div class="card-meta">' +
                '<span class="card-loc">' + e.loc + '</span>' +
                '<span><strong>Threshold:</strong> ' + TIER_LABEL[tier] + '</span>' +
            '</div>' +
            '<div class="card-flavor">' + e.flavor + '</div>' +
            '<div class="card-section-title">Approaches (roll to win)</div>' +
            approaches +
            foeRef +
            '<div class="outcome"><span class="win">Success:</span> ' + e.win + '</div>' +
            '<div class="outcome"><span class="lose">Failure:</span> ' + e.lose + '</div>' +
        '</div>';
}

function renderEntries(list) {
    if (list.length === 0) {
        cardGrid.innerHTML = '<div class="no-results">No perils match your filters.</div>';
        return;
    }
    cardGrid.innerHTML = list.map(function (item) {
        if (item.type === 'creature') return creatureCardHTML(item.data, item.tier);
        if (item.type === 'foe') return foeCardHTML(item.data, item.tier);
        return encounterCardHTML(item.data, item.tier);
    }).join('');
}

function searchHaystack(item) {
    var d = item.data;
    if (item.type === 'foe') {
        return (d.name + ' ' + d.faction + ' creature ' +
            (d.traits || []).join(' ') + ' ' +
            (d.flavor || '') + ' ' +
            (d.special ? d.special.name + ' ' + d.special.text : '')).toLowerCase();
    }
    if (item.type === 'creature') {
        return (d.name + ' ' + (d.faction || '') + ' ' + d.levelLabel + ' ' + d.group + ' creature ' +
            (d.traits || []).join(' ') + ' ' + (d.flavor || '') + ' ' +
            d.stats.map(function (p) { return p[0] + ' ' + p[1]; }).join(' ') + ' ' +
            d.special.map(function (s) { return s.name + ' ' + s.text; }).join(' ')).toLowerCase();
    }
    return (d.name + ' ' + d.loc + ' ' + d.flavor + ' ' +
        d.approaches.map(function (a) { return a.name + ' ' + a.roll; }).join(' ') + ' ' +
        (d.foeRef || '') + ' ' + d.win + ' ' + d.lose).toLowerCase();
}

function applyFilters() {
    var term = searchBar.value.toLowerCase();
    var filtered = entries.filter(function (item) {
        var matchesDiff = currentDiff === 'all' || String(item.tier) === currentDiff;
        var matchesLoc;
        if (currentLoc === 'all') {
            matchesLoc = true;
        } else if (currentLoc === 'Wyrdness') {
            // Wyrdness surfaces its encounters plus every Wyrdness-touched foe.
            matchesLoc = item.loc === 'Wyrdness' || isWyrdCombatant(item);
        } else {
            matchesLoc = item.loc === currentLoc;
        }
        var matchesSearch = !term || searchHaystack(item).indexOf(term) !== -1;
        return matchesDiff && matchesLoc && matchesSearch;
    });
    // Sort by tier ascending, then encounters before creatures, then by name.
    filtered.sort(function (a, b) {
        return a.tier - b.tier ||
            a.type.localeCompare(b.type) ||
            a.data.name.localeCompare(b.data.name);
    });
    renderEntries(filtered);
}

searchBar.addEventListener('input', applyFilters);

document.querySelectorAll('#diffFilters .filter-btn').forEach(function (btn) {
    btn.addEventListener('click', function () {
        document.querySelectorAll('#diffFilters .filter-btn').forEach(function (b) { b.classList.remove('active'); });
        btn.classList.add('active');
        currentDiff = btn.dataset.filter;
        applyFilters();
    });
});

document.querySelectorAll('#locFilters .filter-btn').forEach(function (btn) {
    btn.addEventListener('click', function () {
        document.querySelectorAll('#locFilters .filter-btn').forEach(function (b) { b.classList.remove('active'); });
        btn.classList.add('active');
        currentLoc = btn.dataset.loc;
        applyFilters();
    });
});

applyFilters();

// ==================== ENCOUNTER RANDOMIZER ====================
// Builds a balanced random encounter for a 1-4 player party. Each entry's tier
// (1 Easy .. 4 Difficult) doubles as its threat weight. The party is given a
// threat budget of players * 3, and foes/encounters are drawn until the budget
// is spent or a sensible group-size cap is reached.

var randCategory = 'Settlement';

// A combatant counts as "Wyrdness-touched" if it belongs to the Wyrdness or
// Fore-dweller factions, or is a Wyrd-warped beast (name begins with "Wyrd").
function isWyrdCombatant(item) {
    if (item.type !== 'creature' && item.type !== 'foe') return false;
    var f = item.data.faction || '';
    return f === 'Wyrdness' || f === 'Fore-dweller' || /^Wyrd/.test(item.data.name);
}

// Pools keyed by the randomizer category.
function randPool(category) {
    if (category === 'Creature') {
        return entries.filter(function (e) { return e.type === 'creature' || e.type === 'foe'; });
    }
    if (category === 'Wyrdness') {
        // Wyrdness draws from its diplomacy encounters AND every Wyrdness-touched
        // creature/foe (Fore-dwellers, Wyrd beasts, mist horrors, etc.).
        return entries.filter(function (e) {
            return (e.type === 'encounter' && e.loc === 'Wyrdness') || isWyrdCombatant(e);
        });
    }
    // Settlement / Road -> diplomacy encounters at that location.
    return entries.filter(function (e) { return e.type === 'encounter' && e.loc === category; });
}

function randInt(n) { return Math.floor(Math.random() * n); }
function randPick(arr) { return arr[randInt(arr.length)]; }

// Pick a balanced set of items from the pool for the given player count.
function rollEncounter(category, players) {
    var pool = randPool(category);
    if (!pool.length) return { picks: [], budget: 0, spent: 0 };

    var budget = players * 3;          // total threat to fill
    var cap = players + 2;             // max number of foes/cards
    // Creatures/foes can appear in numbers; unique encounters cannot repeat.
    var repeatable = function (item) { return item.type === 'creature' || item.type === 'foe'; };
    var picks = [];
    var spent = 0;
    var guard = 0;

    // Weakest available threat, so we know when the remaining budget is unspendable.
    var minTier = pool.reduce(function (m, e) { return Math.min(m, e.tier); }, 99);

    while (spent < budget && picks.length < cap && guard < 200) {
        guard++;
        var remaining = budget - spent;
        // Prefer entries that still fit the remaining budget; otherwise any.
        var fits = pool.filter(function (e) { return e.tier <= remaining; });
        var choice = randPick(fits.length ? fits : pool);
        // If we drew a non-repeatable encounter we already picked, try a fresh one.
        if (!repeatable(choice) && picks.indexOf(choice) !== -1) {
            var fresh = (fits.length ? fits : pool).filter(function (e) {
                return repeatable(e) || picks.indexOf(e) === -1;
            });
            if (!fresh.length) break;
            choice = randPick(fresh);
        }
        picks.push(choice);
        spent += choice.tier;
        if (remaining - choice.tier < minTier) break; // no weaker foe can fill the rest
    }

    if (!picks.length) picks.push(randPick(pool)); // always return something
    return { picks: picks, budget: budget, spent: picks.reduce(function (s, e) { return s + e.tier; }, 0) };
}

function renderRandom(result, category, players) {
    var summary = document.getElementById('randSummary');
    if (summary) {
        var label = category === 'Creature' ? 'Creature' : category;
        var noun = result.picks.length === 1 ? 'foe' : 'foes';
        summary.innerHTML = '<strong>' + players + '-player ' + label + ' encounter:</strong> ' +
            result.picks.length + ' ' + noun + ' &middot; total threat ' + result.spent +
            ' (budget ' + result.budget + '). <em>Reroll for a different draw.</em>';
        summary.classList.add('show');
    }
    // Render the picked cards, keeping tier order for readability.
    var ordered = result.picks.slice().sort(function (a, b) { return a.tier - b.tier; });
    cardGrid.innerHTML = ordered.map(function (item) {
        if (item.type === 'creature') return creatureCardHTML(item.data, item.tier);
        if (item.type === 'foe') return foeCardHTML(item.data, item.tier);
        return encounterCardHTML(item.data, item.tier);
    }).join('');
}

var randCatWrap = document.getElementById('randCats');
if (randCatWrap) {
    randCatWrap.querySelectorAll('.rand-cat').forEach(function (btn) {
        btn.addEventListener('click', function () {
            randCatWrap.querySelectorAll('.rand-cat').forEach(function (b) { b.classList.remove('active'); });
            btn.classList.add('active');
            randCategory = btn.dataset.cat;
        });
    });
}

var randGo = document.getElementById('randGo');
if (randGo) {
    randGo.addEventListener('click', function () {
        var players = parseInt(document.getElementById('randPlayers').value, 10) || 1;
        var result = rollEncounter(randCategory, players);
        renderRandom(result, randCategory, players);
    });
}

var randClear = document.getElementById('randClear');
if (randClear) {
    randClear.addEventListener('click', function () {
        var summary = document.getElementById('randSummary');
        if (summary) { summary.classList.remove('show'); summary.innerHTML = ''; }
        applyFilters(); // restore the full, filtered Bestiary listing
    });
}
