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
