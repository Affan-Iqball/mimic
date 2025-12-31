import { WordPair } from './wordGenerator';

export const STATIC_WORD_PAIRS: WordPair[] = [
    // --- PLACES (PAKISTAN & GLOBAL) ---
    { civilian: 'Lahore', undercover: 'Karachi', category: 'Places', id: 'static_1' },
    { civilian: 'Islamabad', undercover: 'Rawalpindi', category: 'Places', id: 'static_2' },
    { civilian: 'Dubai', undercover: 'Doha', category: 'Places', id: 'static_3' },
    { civilian: 'London', undercover: 'New York', category: 'Places', id: 'static_4' },
    { civilian: 'Makkah', undercover: 'Madina', category: 'Places', id: 'static_5' },
    { civilian: 'Northern Areas', undercover: 'Switzerland', category: 'Places', id: 'static_6' },
    { civilian: 'Gym', undercover: 'Park', category: 'Places', id: 'static_7' },
    { civilian: 'Cinema', undercover: 'Netflix', category: 'Places', id: 'static_8' },
    { civilian: 'University', undercover: 'College', category: 'Places', id: 'static_9' },
    { civilian: 'Hospital', undercover: 'Clinic', category: 'Places', id: 'static_10' },

    // --- FOOD (DESI & FAST FOOD) ---
    { civilian: 'Biryani', undercover: 'Pulao', category: 'Food', id: 'static_11' },
    { civilian: 'Nihari', undercover: 'Paye', category: 'Food', id: 'static_12' },
    { civilian: 'Burger', undercover: 'Sandwich', category: 'Food', id: 'static_13' },
    { civilian: 'Pizza', undercover: 'Lasagna', category: 'Food', id: 'static_14' },
    { civilian: 'Chai', undercover: 'Coffee', category: 'Food', id: 'static_15' },
    { civilian: 'Lassi', undercover: 'Milkshake', category: 'Food', id: 'static_16' },
    { civilian: 'Samosa', undercover: 'Pakora', category: 'Food', id: 'static_17' },
    { civilian: 'Gol Gappay', undercover: 'Chana Chaat', category: 'Food', id: 'static_18' },
    { civilian: 'Dates (Khajoor)', undercover: 'Honey', category: 'Food', id: 'static_19' },
    { civilian: 'Mango', undercover: 'Orange', category: 'Food', id: 'static_20' },
    { civilian: 'Kebab', undercover: 'Tikka', category: 'Food', id: 'static_21' },
    { civilian: 'Shawarma', undercover: 'Wrap', category: 'Food', id: 'static_22' },

    // --- CONCEPTS & ABSTRACT (MATURE/FUN) ---
    { civilian: 'Love Marriage', undercover: 'Arranged Marriage', category: 'Concepts', id: 'static_23' },
    { civilian: 'Democracy', undercover: 'Dictatorship', category: 'Concepts', id: 'static_24' },
    { civilian: 'Salary', undercover: 'Pocket Money', category: 'Concepts', id: 'static_25' },
    { civilian: 'Dream', undercover: 'Nightmare', category: 'Concepts', id: 'static_26' },
    { civilian: 'Truth', undercover: 'Lie', category: 'Concepts', id: 'static_27' },
    { civilian: 'Secret', undercover: 'Rumor', category: 'Concepts', id: 'static_28' },
    { civilian: 'Fame', undercover: 'Money', category: 'Concepts', id: 'static_29' },
    { civilian: 'Talent', undercover: 'Hard Work', category: 'Concepts', id: 'static_30' },
    { civilian: 'Introvert', undercover: 'Extrovert', category: 'Concepts', id: 'static_31' },
    { civilian: 'Logic', undercover: 'Emotion', category: 'Concepts', id: 'static_32' },

    // --- TECH & MODERN LIFE ---
    { civilian: 'Instagram', undercover: 'Snapchat', category: 'Tech', id: 'static_33' },
    { civilian: 'Whatsapp', undercover: 'Telegram', category: 'Tech', id: 'static_34' },
    { civilian: 'iPhone', undercover: 'Samsung', category: 'Tech', id: 'static_35' },
    { civilian: 'Laptop', undercover: 'Tablet', category: 'Tech', id: 'static_36' },
    { civilian: 'Wifi', undercover: '4G Data', category: 'Tech', id: 'static_37' },
    { civilian: 'Uber', undercover: 'Careem', category: 'Tech', id: 'static_38' },
    { civilian: 'Foodpanda', undercover: 'Home Cooked', category: 'Tech', id: 'static_39' },
    { civilian: 'Spotify', undercover: 'YouTube Music', category: 'Tech', id: 'static_40' },
    { civilian: 'Zoom', undercover: 'Skype', category: 'Tech', id: 'static_41' },
    { civilian: 'Cryptocurrency', undercover: 'Gold', category: 'Concepts', id: 'static_42' },

    // --- CULTURE & LIFESTYLE ---
    { civilian: 'Eid-ul-Fitr', undercover: 'Eid-ul-Adha', category: 'Culture', id: 'static_43' },
    { civilian: 'Wedding (Shaadi)', undercover: 'Engagement', category: 'Culture', id: 'static_44' },
    { civilian: 'Joint Family', undercover: 'Nuclear Family', category: 'Culture', id: 'static_45' },
    { civilian: 'Cricket', undercover: 'Football', category: 'Sports', id: 'static_46' },
    { civilian: 'Ludo', undercover: 'Monopoly', category: 'Games', id: 'static_47' },
    { civilian: 'PubG', undercover: 'Call of Duty', category: 'Games', id: 'static_48' },
    { civilian: 'Shopping Mall', undercover: 'Bazaar', category: 'Places', id: 'static_49' },
    { civilian: 'Rickshaw', undercover: 'Bus', category: 'Transport', id: 'static_50' },
    { civilian: 'Charity (Zakat)', undercover: 'Tax', category: 'Concepts', id: 'static_51' },
    { civilian: 'Imran Khan', undercover: 'Nawaz Sharif', category: 'People', id: 'static_52' }, // Risky but fun? Maybe replace if too political
    { civilian: 'Atif Aslam', undercover: 'Arijit Singh', category: 'People', id: 'static_53' },
    { civilian: 'Babar Azam', undercover: 'Virat Kohli', category: 'People', id: 'static_54' },

    // --- OBJECTS ---
    { civilian: 'Sun', undercover: 'Moon', category: 'Nature', id: 'static_55' },
    { civilian: 'Gold', undercover: 'Diamond', category: 'Objects', id: 'static_56' },
    { civilian: 'Sword', undercover: 'Gun', category: 'Objects', id: 'static_57' },
    { civilian: 'Pen', undercover: 'Pencil', category: 'Objects', id: 'static_58' },
    { civilian: 'Mirror', undercover: 'Camera', category: 'Objects', id: 'static_59' },
    { civilian: 'Perfume', undercover: 'Deodorant', category: 'Objects', id: 'static_60' },
    { civilian: 'Glasses', undercover: 'Contacts', category: 'Objects', id: 'static_61' },

    // --- MORE ABSTRACT ---
    { civilian: 'Past', undercover: 'Future', category: 'Concepts', id: 'static_62' },
    { civilian: 'Hero', undercover: 'Villain', category: 'Concepts', id: 'static_63' },
    { civilian: 'Teacher', undercover: 'Student', category: 'People', id: 'static_64' },
    { civilian: 'Boss', undercover: 'Leader', category: 'People', id: 'static_65' },
    { civilian: 'Ghost', undercover: 'Alien', category: 'Fantasy', id: 'static_66' },
    { civilian: 'Zombie', undercover: 'Vampire', category: 'Fantasy', id: 'static_67' },
    { civilian: 'Heaven', undercover: 'Hell', category: 'Concepts', id: 'static_68' },

    // --- EVERYDAY ---
    { civilian: 'Traffic', undercover: 'Road Block', category: 'City', id: 'static_69' },
    { civilian: 'Rain', undercover: 'Storm', category: 'Nature', id: 'static_70' },
    { civilian: 'Winter', undercover: 'Summer', category: 'Nature', id: 'static_71' },
    { civilian: 'Sunday', undercover: 'Monday', category: 'Time', id: 'static_72' },
    { civilian: 'Morning', undercover: 'Night', category: 'Time', id: 'static_73' },
    { civilian: 'Gym', undercover: 'Diet', category: 'Lifestyle', id: 'static_74' },
    { civilian: 'Makeup', undercover: 'Filter', category: 'Modern', id: 'static_75' },
    { civilian: 'Influencer', undercover: 'Celebrity', category: 'Modern', id: 'static_76' },
    { civilian: 'Meme', undercover: 'Joke', category: 'Modern', id: 'static_77' },
    { civilian: 'Tiktok', undercover: 'Reels', category: 'Tech', id: 'static_78' }
];

export const SPICY_STATIC_WORD_PAIRS: WordPair[] = [
    { civilian: 'Infidelity', undercover: 'Flirting', category: 'Taboo', id: 'spicy_1' },
    { civilian: 'Divorce', undercover: 'Breakup', category: 'Taboo', id: 'spicy_2' },
    { civilian: 'Ex-Girlfriend', undercover: 'Best Friend', category: 'Taboo', id: 'spicy_3' },
    { civilian: 'Affair', undercover: 'Scandal', category: 'Taboo', id: 'spicy_4' },
    { civilian: 'Bribery', undercover: 'Gift', category: 'Taboo', id: 'spicy_5' },
    { civilian: 'Banned', undercover: 'Censored', category: 'Taboo', id: 'spicy_6' },
    { civilian: 'Lies', undercover: 'Exaggeration', category: 'Taboo', id: 'spicy_7' },
    { civilian: 'Politics', undercover: 'Religion', category: 'Taboo', id: 'spicy_8' },
    { civilian: 'Revenge', undercover: 'Justice', category: 'Taboo', id: 'spicy_9' },
    { civilian: 'Bribe', undercover: 'Protocol', category: 'Taboo', id: 'spicy_10' },
    { civilian: 'Alcohol', undercover: 'Drugs', category: 'Taboo', id: 'spicy_11' },
    { civilian: 'Jealousy', undercover: 'Envy', category: 'Taboo', id: 'spicy_12' },
    { civilian: 'Debt', undercover: 'Loan', category: 'Taboo', id: 'spicy_13' },
    { civilian: 'Tax Evasion', undercover: 'Loophole', category: 'Taboo', id: 'spicy_14' },
    { civilian: 'Betrayal', undercover: 'Disloyalty', category: 'Taboo', id: 'spicy_15' },
    { civilian: 'Hookup', undercover: 'One Night Stand', category: 'Taboo', id: 'spicy_16' },
    { civilian: 'Manipulation', undercover: 'Persuasion', category: 'Taboo', id: 'spicy_17' },
    { civilian: 'Gambling', undercover: 'Investing', category: 'Taboo', id: 'spicy_18' },
    { civilian: 'Gossip', undercover: 'News', category: 'Taboo', id: 'spicy_19' },
    { civilian: 'Stalking', undercover: 'Following', category: 'Taboo', id: 'spicy_20' },
];

export function getRandomStaticWord(mode: 'standard' | 'spicy' = 'standard'): WordPair {
    const list = mode === 'spicy' ? SPICY_STATIC_WORD_PAIRS : STATIC_WORD_PAIRS;
    return list[Math.floor(Math.random() * list.length)];
}
