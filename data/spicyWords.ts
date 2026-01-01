import { WordPair } from '../services/wordGenerator';

// AFTER DARK - 100+ Explicit/Spicy Words (Western)
export const SPICY_WORDS: WordPair[] = [
    // --- DATING & HOOKUP CULTURE ---
    { civilian: "Tinder", undercover: "Grindr", category: "Dating Apps" },
    { civilian: "Bumble", undercover: "Hinge", category: "Dating Apps" },
    { civilian: "Date", undercover: "Hookup", category: "Dating" },
    { civilian: "Kiss", undercover: "Make Out", category: "Actions" },
    { civilian: "Love", undercover: "Lust", category: "Feelings" },
    { civilian: "Affair", undercover: "Cheating", category: "Relationships" },
    { civilian: "Relationship", undercover: "Situationship", category: "Relationships" },
    { civilian: "Divorce", undercover: "Alimony", category: "Legal" },
    { civilian: "Honeymoon", undercover: "Sex Trip", category: "Events" },
    { civilian: "One Night Stand", undercover: "Booty Call", category: "Relationships" },
    { civilian: "Sneaky Link", undercover: "Side Piece", category: "Relationships" },
    { civilian: "Friends With Benefits", undercover: "No Strings", category: "Relationships" },
    { civilian: "Ex", undercover: "Toxic Ex", category: "Relationships" },
    { civilian: "Ghosting", undercover: "Breadcrumbing", category: "Dating" },
    { civilian: "Catfish", undercover: "Fake Profile", category: "Dating" },

    // --- PARTY & NIGHTLIFE ---
    { civilian: "Drunk", undercover: "Blackout", category: "State" },
    { civilian: "Strip Club", undercover: "Brothel", category: "Places" },
    { civilian: "Party", undercover: "Orgy", category: "Events" },
    { civilian: "High", undercover: "Tripping", category: "State" },
    { civilian: "Walk of Shame", undercover: "Uber of Shame", category: "Actions" },
    { civilian: "Wasted", undercover: "Hammered", category: "State" },
    { civilian: "Shots", undercover: "Body Shots", category: "Party" },
    { civilian: "VIP Section", undercover: "Champagne Room", category: "Places" },
    { civilian: "Bachelor Party", undercover: "Bachelorette", category: "Events" },
    { civilian: "Vegas", undercover: "What Happens There", category: "Places" },

    // --- CLOTHING & STATE ---
    { civilian: "Lingerie", undercover: "Nothing", category: "Clothing" },
    { civilian: "Thong", undercover: "G-String", category: "Clothing" },
    { civilian: "Commando", undercover: "Freeballing", category: "State" },
    { civilian: "Nude", undercover: "Naked", category: "State" },
    { civilian: "Bikini", undercover: "Topless", category: "Clothing" },
    { civilian: "Skinny Dipping", undercover: "Nude Beach", category: "Activities" },

    // --- ADULT INDUSTRY ---
    { civilian: "Stripper", undercover: "Escort", category: "Jobs" },
    { civilian: "Pornstar", undercover: "Camgirl", category: "Jobs" },
    { civilian: "OnlyFans", undercover: "Leaked", category: "Digital" },
    { civilian: "Happy Ending", undercover: "Extra Service", category: "Services" },
    { civilian: "Massage Parlor", undercover: "Rub and Tug", category: "Places" },
    { civilian: "Peep Show", undercover: "Live Show", category: "Entertainment" },

    // --- DIGITAL & SCANDALS ---
    { civilian: "Nudes", undercover: "Dick Pic", category: "Digital" },
    { civilian: "Sext", undercover: "Phone Sex", category: "Digital" },
    { civilian: "Secret", undercover: "Sex Tape", category: "Scandal" },
    { civilian: "Scandal", undercover: "Exposed", category: "Social" },
    { civilian: "Screenshot", undercover: "Leak", category: "Digital" },
    { civilian: "DMs", undercover: "Slide In", category: "Digital" },
    { civilian: "Private Account", undercover: "Burner", category: "Digital" },

    // --- BEHAVIOR & FEELINGS ---
    { civilian: "Obsessed", undercover: "Stalker", category: "Behavior" },
    { civilian: "Desperate", undercover: "Horny", category: "Feelings" },
    { civilian: "Hot", undercover: "Bangable", category: "Appearance" },
    { civilian: "Slutty", undercover: "Freaky", category: "Behavior" },
    { civilian: "Thirsty", undercover: "Down Bad", category: "Feelings" },
    { civilian: "Jealous", undercover: "Possessive", category: "Feelings" },

    // --- LIFE EVENTS & SAFETY ---
    { civilian: "Pregnant", undercover: "Knocked Up", category: "Life" },
    { civilian: "Condom", undercover: "Raw", category: "Safety" },
    { civilian: "Pill", undercover: "Plan B", category: "Safety" },
    { civilian: "Virgin", undercover: "First Time", category: "Status" },
    { civilian: "STD", undercover: "Herpes", category: "Health" },
    { civilian: "Clinic", undercover: "Walk of Shame 2.0", category: "Health" },

    // --- ARCHETYPES ---
    { civilian: "Body Count", undercover: "Triple Digits", category: "Status" },
    { civilian: "F*ckboy", undercover: "Manwhore", category: "Archetype" },
    { civilian: "Simp", undercover: "Cuck", category: "Archetype" },
    { civilian: "Sugar Daddy", undercover: "Sugar Baby", category: "Archetype" },
    { civilian: "Daddy Issues", undercover: "Mommy Issues", category: "Psych" },
    { civilian: "Gold Digger", undercover: "Trophy Wife", category: "Archetype" },
    { civilian: "MILF", undercover: "DILF", category: "Archetype" },
    { civilian: "Cougar", undercover: "Boy Toy", category: "Archetype" },
    { civilian: "Playboy", undercover: "Casanova", category: "Archetype" },

    // --- ACTIONS & INTIMACY ---
    { civilian: "Foreplay", undercover: "Skipping to Main", category: "Actions" },
    { civilian: "Quickie", undercover: "Marathon", category: "Actions" },
    { civilian: "Make Up Sex", undercover: "Hate Sex", category: "Actions" },
    { civilian: "Morning Sex", undercover: "Shower Sex", category: "Actions" },
    { civilian: "Car Sex", undercover: "Back Seat", category: "Actions" },
    { civilian: "Lap Dance", undercover: "Private Show", category: "Actions" },
    { civilian: "Pole Dance", undercover: "Twerk", category: "Actions" },
    { civilian: "Finish", undercover: "Fake It", category: "Actions" },
    { civilian: "69", undercover: "Mutual", category: "Actions" },

    // --- KINKS & PREFERENCES ---
    { civilian: "Roleplay", undercover: "Fantasy", category: "Kink" },
    { civilian: "Dominant", undercover: "Submissive", category: "Kink" },
    { civilian: "Top", undercover: "Bottom", category: "Kink" },
    { civilian: "Kinky", undercover: "Freaky", category: "Kink" },
    { civilian: "Vanilla", undercover: "Boring", category: "Kink" },
    { civilian: "Handcuffs", undercover: "Rope", category: "Kink" },
    { civilian: "Blindfold", undercover: "Gag", category: "Kink" },
    { civilian: "Spanking", undercover: "Whipping", category: "Kink" },
    { civilian: "Choking", undercover: "Hair Pulling", category: "Kink" },
    { civilian: "Biting", undercover: "Scratching", category: "Kink" },
    { civilian: "Safeword", undercover: "No Mercy", category: "Kink" },
    { civilian: "BDSM", undercover: "50 Shades", category: "Kink" },
    { civilian: "Fetish", undercover: "Kink", category: "Kink" },
    { civilian: "Foot Fetish", undercover: "Armpit Fetish", category: "Kink" },
    { civilian: "Voyeur", undercover: "Exhibitionist", category: "Kink" },

    // --- GROUP ACTIVITIES ---
    { civilian: "Threesome", undercover: "Foursome", category: "Group" },
    { civilian: "Gangbang", undercover: "Train", category: "Group" },
    { civilian: "Swinger", undercover: "Open Relationship", category: "Group" },
    { civilian: "Wife Swap", undercover: "Key Party", category: "Group" },
    { civilian: "Truth or Dare", undercover: "Spin the Bottle", category: "Games" },

    // --- PHYSIOLOGY ---
    { civilian: "Morning Wood", undercover: "Blue Balls", category: "Physiology" },
    { civilian: "Wet Dream", undercover: "Nocturnal", category: "Physiology" },
    { civilian: "Hard", undercover: "Soft", category: "Physiology" },
    { civilian: "Big", undercover: "Small", category: "Physiology" },
    { civilian: "Shaved", undercover: "Bush", category: "Grooming" },
    { civilian: "Waxed", undercover: "Natural", category: "Grooming" },

    // --- TOYS & ACCESSORIES ---
    { civilian: "Vibrator", undercover: "Dildo", category: "Toys" },
    { civilian: "Handcuffs", undercover: "Ball Gag", category: "Toys" },
    { civilian: "Whip", undercover: "Paddle", category: "Toys" },
    { civilian: "Lube", undercover: "Flavored", category: "Accessories" },
    { civilian: "Costume", undercover: "Nurse Outfit", category: "Accessories" },

    // --- PLACES ---
    { civilian: "Motel", undercover: "Hourly Rate", category: "Places" },
    { civilian: "Hotel Room", undercover: "Do Not Disturb", category: "Places" },
    { civilian: "Hot Tub", undercover: "Jacuzzi", category: "Places" },
    { civilian: "Beach", undercover: "Changing Room", category: "Places" },
    { civilian: "Office", undercover: "After Hours", category: "Places" },
    { civilian: "Elevator", undercover: "Stuck", category: "Places" },

    // --- SUBSTANCES ---
    { civilian: "Drunk", undercover: "Wine Drunk", category: "State" },
    { civilian: "Edibles", undercover: "Cross-faded", category: "Substances" },
    { civilian: "Molly", undercover: "Ecstasy", category: "Substances" },
    { civilian: "Aphrodisiac", undercover: "Oysters", category: "Substances" },
    { civilian: "Whiskey D***", undercover: "Beer Goggles", category: "Effects" },
];

// UNDEFINED - Curated AI-Generated Pairs (To Be Reviewed)
// Each pair includes the AI model that generated it
export const UNDEFINED_WORDS: (WordPair & { ai: string })[] = [
    // === BATCH 1: groq/compound, groq/compound-mini, llama-3.1-8b-instant ===

    // From: groq/compound
    { civilian: "Bondage", undercover: "Shibari", category: "Kink", ai: "groq/compound" },
    { civilian: "Deepfake", undercover: "Face Swap", category: "Digital Scandals", ai: "groq/compound" },
    { civilian: "VIP Booth", undercover: "Bottle Service", category: "Nightlife", ai: "groq/compound" },

    // From: groq/compound-mini
    { civilian: "Speakeasy", undercover: "Dive Bar", category: "Nightlife", ai: "groq/compound-mini" },
    { civilian: "Rooftop Party", undercover: "Beach Bonfire", category: "Nightlife", ai: "groq/compound-mini" },

    // From: llama-3.1-8b-instant
    { civilian: "Lace", undercover: "Garter", category: "Clothing", ai: "llama-3.1-8b-instant" },
    { civilian: "Discreet", undercover: "Incognito", category: "Secret", ai: "llama-3.1-8b-instant" },

    // === BATCH 2: llama-3.3-70b-versatile, llama-4-maverick, llama-4-scout ===

    // From: llama-3.3-70b-versatile
    { civilian: "Revenge Porn", undercover: "Sextortion", category: "Digital Scandals", ai: "llama-3.3-70b-versatile" },
    { civilian: "Tinder Bio", undercover: "Grindr Profile", category: "Dating", ai: "llama-3.3-70b-versatile" },
    { civilian: "Vixen", undercover: "Siren", category: "Archetypes", ai: "llama-3.3-70b-versatile" },

    // From: meta-llama/llama-4-maverick-17b-128e-instruct
    { civilian: "Seductress", undercover: "Temptress", category: "Archetypes", ai: "llama-4-maverick-17b" },
    { civilian: "Dirty Dancing", undercover: "Twerking", category: "Nightlife", ai: "llama-4-maverick-17b" },
    { civilian: "Groupie", undercover: "Stalker Fan", category: "Archetypes", ai: "llama-4-maverick-17b" },

    // From: meta-llama/llama-4-scout-17b-16e-instruct
    { civilian: "Frat House", undercover: "Sorority", category: "Nightlife", ai: "llama-4-scout-17b" },
    { civilian: "Nympho", undercover: "Sexaholic", category: "Kink", ai: "llama-4-scout-17b" },
    { civilian: "Blackmail", undercover: "Extortion", category: "Digital Scandals", ai: "llama-4-scout-17b" },

    // === BATCH 3: kimi-k2-instruct, kimi-k2-instruct-0905, gpt-oss-120b ===

    // From: moonshotai/kimi-k2-instruct (EXCELLENT CREATIVE!)
    { civilian: "Safe Word", undercover: "Traffic Light", category: "Kink", ai: "kimi-k2-instruct" },
    { civilian: "Velcro Cuffs", undercover: "Silk Ties", category: "Kink", ai: "kimi-k2-instruct" },
    { civilian: "Read Receipts", undercover: "Typing Bubble", category: "Digital Scandals", ai: "kimi-k2-instruct" },
    { civilian: "Blocked", undercover: "Unmatched", category: "Digital Scandals", ai: "kimi-k2-instruct" },
    { civilian: "Bad Boy", undercover: "Fuckboy", category: "Archetypes", ai: "kimi-k2-instruct" },
    { civilian: "Edging", undercover: "Ruined", category: "Kink", ai: "kimi-k2-instruct" },
    { civilian: "Hotel", undercover: "Airbnb", category: "Places", ai: "kimi-k2-instruct" },

    // From: moonshotai/kimi-k2-instruct-0905 (EQUALLY CREATIVE!)
    { civilian: "Hickey", undercover: "Bite", category: "Mark", ai: "kimi-k2-instruct-0905" },
    { civilian: "Story", undercover: "DM", category: "Digital Scandals", ai: "kimi-k2-instruct-0905" },
    { civilian: "Jock", undercover: "Twink", category: "Archetypes", ai: "kimi-k2-instruct-0905" },
    { civilian: "Flash", undercover: "Peek", category: "Actions", ai: "kimi-k2-instruct-0905" },
    { civilian: "Crush", undercover: "Obsession", category: "Dating", ai: "kimi-k2-instruct-0905" },

    // From: openai/gpt-oss-120b
    { civilian: "Club Crawl", undercover: "Bar Hop", category: "Nightlife", ai: "gpt-oss-120b" },
    { civilian: "Latex Outfit", undercover: "Leather Outfit", category: "Kink", ai: "gpt-oss-120b" },
    { civilian: "Fetish Ball", undercover: "Costume Party", category: "Kink", ai: "gpt-oss-120b" },
    { civilian: "Erotic Novel", undercover: "Romance Novel", category: "Media", ai: "gpt-oss-120b" },
    { civilian: "Stripper Pole", undercover: "Pole Dancing Class", category: "Nightlife", ai: "gpt-oss-120b" },

    // === BATCH 4: gpt-oss-20b, qwen3-32b, arcee-ai/trinity-mini ===

    // From: openai/gpt-oss-20b
    { civilian: "Netflix & Chill", undercover: "Netflix & Snack", category: "Dating", ai: "gpt-oss-20b" },

    // From: qwen/qwen3-32b
    { civilian: "Spark", undercover: "Connection", category: "Dating", ai: "qwen3-32b" },
    { civilian: "Bartender", undercover: "Mixologist", category: "Nightlife", ai: "qwen3-32b" },
    { civilian: "Bouncer", undercover: "Security", category: "Nightlife", ai: "qwen3-32b" },

    // From: arcee-ai/trinity-mini
    { civilian: "Dating App", undercover: "Hookup App", category: "Dating", ai: "trinity-mini" },
    { civilian: "First Date", undercover: "Third Date", category: "Dating", ai: "trinity-mini" },
    { civilian: "Vibe", undercover: "Atmosphere", category: "Nightlife", ai: "trinity-mini" },
    { civilian: "Chaser", undercover: "Creeper", category: "Archetypes", ai: "trinity-mini" },

    // === BATCHES 5-7: 10 more models (gemma, llama-405b, mistral, kimi-k2, hermes) ===

    // From: google/gemma-3-12b-it
    { civilian: "Red Room", undercover: "Safe Word", category: "Kink", ai: "gemma-3-12b" },

    // From: google/gemma-3-27b-it
    { civilian: "Afterparty", undercover: "House Party", category: "Nightlife", ai: "gemma-3-27b" },
    { civilian: "Pantyhose", undercover: "Stockings", category: "Clothing", ai: "gemma-3-27b" },

    // From: google/gemma-3-4b-it
    { civilian: "Rizz", undercover: "Charm", category: "Dating", ai: "gemma-3-4b" },
    { civilian: "Boudoir", undercover: "Lair", category: "Places", ai: "gemma-3-4b" },

    // From: google/gemma-3n-e4b-it
    { civilian: "Forbidden", undercover: "Taboo", category: "Kink", ai: "gemma-3n-e4b" },
    { civilian: "Provocative", undercover: "Suggestive", category: "Dating", ai: "gemma-3n-e4b" },

    // From: meta-llama/llama-3.1-405b-instruct
    { civilian: "Webcam Girl", undercover: "Camboy", category: "Digital", ai: "llama-3.1-405b" },

    // From: meta-llama/llama-3.3-70b-instruct
    { civilian: "Stud", undercover: "Hunk", category: "Archetypes", ai: "llama-3.3-70b-instruct" },

    // From: mistralai/mistral-7b-instruct
    { civilian: "Cuckold", undercover: "Bull", category: "Kink", ai: "mistral-7b" },
    { civilian: "Chastity", undercover: "Cage", category: "Kink", ai: "mistral-7b" },
    { civilian: "Silk", undercover: "Lace", category: "Clothing", ai: "mistral-7b" },
    { civilian: "First Base", undercover: "Second Base", category: "Actions", ai: "mistral-7b" },

    // From: mistralai/mistral-small-3.1-24b-instruct
    { civilian: "Bar Hopping", undercover: "Pub Crawl", category: "Nightlife", ai: "mistral-small-24b" },
    { civilian: "Cuddle", undercover: "Spooning", category: "Actions", ai: "mistral-small-24b" },
    { civilian: "Seduction", undercover: "Temptation", category: "Actions", ai: "mistral-small-24b" },

    // From: moonshotai/kimi-k2
    { civilian: "Ghosted", undercover: "Blocked", category: "Dating", ai: "kimi-k2" },
    { civilian: "Exes", undercover: "Rebound", category: "Dating", ai: "kimi-k2" },
    { civilian: "Last Call", undercover: "Closing Time", category: "Nightlife", ai: "kimi-k2" },
    { civilian: "Stag", undercover: "Bull", category: "Archetypes", ai: "kimi-k2" },
    { civilian: "Pegging", undercover: "Strap-On", category: "Kink", ai: "kimi-k2" },
    { civilian: "DM", undercover: "Slide", category: "Digital", ai: "kimi-k2" },

    // From: nousresearch/hermes-3-llama-3.1-405b
    { civilian: "Mile High Club", undercover: "Glory Hole", category: "Places", ai: "hermes-3-405b" },
    { civilian: "Lubricant", undercover: "Massage Oil", category: "Accessories", ai: "hermes-3-405b" },

    // === FINAL BATCH: qwen3-coder, z-ai/glm-4.5-air ===

    // From: qwen/qwen3-coder
    { civilian: "Shot", undercover: "Jägerbomb", category: "Nightlife", ai: "qwen3-coder" },
    { civilian: "Wax Play", undercover: "Ice", category: "Kink", ai: "qwen3-coder" },
    { civilian: "Bar", undercover: "Speakeasy", category: "Nightlife", ai: "qwen3-coder" },
    { civilian: "VIP Room", undercover: "Back Room", category: "Nightlife", ai: "qwen3-coder" },
    { civilian: "Sugar Mommy", undercover: "Sugar Uncle", category: "Archetypes", ai: "qwen3-coder" },
    { civilian: "Stranger", undercover: "Regular", category: "Archetypes", ai: "qwen3-coder" },

    // From: z-ai/glm-4.5-air (MODERN SLANG!)
    { civilian: "Cuffing Season", undercover: "Celibacy", category: "Dating", ai: "glm-4.5-air" },
    { civilian: "Pet Names", undercover: "Collar", category: "Kink", ai: "glm-4.5-air" },
    { civilian: "Impact Play", undercover: "Sensation Play", category: "Kink", ai: "glm-4.5-air" },
    { civilian: "Wine Night", undercover: "Ladies Night", category: "Nightlife", ai: "glm-4.5-air" },
    { civilian: "Wingman", undercover: "Cockblock", category: "Nightlife", ai: "glm-4.5-air" },
    { civilian: "Creepshot", undercover: "Up-skirt", category: "Digital Scandals", ai: "glm-4.5-air" },
    { civilian: "Side Chick", undercover: "Main Chick", category: "Archetypes", ai: "glm-4.5-air" },
    { civilian: "Chad", undercover: "Becky", category: "Archetypes", ai: "glm-4.5-air" },
];
