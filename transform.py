import csv
import json
from collections import defaultdict
import re
from functools import reduce

def normalize_text(text):
    """Normalize text by fixing Unicode quotes and apostrophes to ASCII"""
    if not text:
        return text
    return (text.replace('\u2018', "'")  # Left single quote
                .replace('\u2019', "'")   # Right single quote
                .replace('\u201C', '"')   # Left double quote
                .replace('\u201D', '"'))  # Right double quote

def capitalize_garnish(text):
    """Properly capitalize garnish text"""
    if not text:
        return text
    
    # Split on commas and 'and' to handle multiple garnishes
    parts = []
    for part in re.split(r',\s*|\s+and\s+', text):
        words = part.strip().split()
        if not words:
            continue
            
        # Capitalize first word and any subsequent words unless they're articles/conjunctions
        result = [words[0].capitalize()]
        for word in words[1:]:
            if word.lower() in {'a', 'an', 'and', 'or', 'the', 'with', 'of'}:
                result.append(word.lower())
            else:
                result.append(word.capitalize())
        parts.append(' '.join(result))
    
    # Join parts back with commas and 'and'
    if len(parts) <= 1:
        return parts[0] if parts else text
    return ', '.join(parts[:-1]) + ' and ' + parts[-1]

def extract_garnish(instructions):
    """Extract garnish from instructions while preserving actionable instructions"""
    garnish = ""
    clean_instructions = instructions
    
    # Patterns for actionable garnish instructions that should be kept
    actionable_patterns = [
        r'[Ff]loat\s+[^.]+?\s+on\s+top',
        r'[Pp]lace\s+[^.]+?\s+(?:in|on)\s+(?:the\s+)?(?:glass|drink)',
        r'[Ss]tick\s+[^.]+?\s+(?:in|into|on)\s+(?:the\s+)?(?:glass|drink)',
        r'[Dd]rap[e]?\s+[^.]+?\s+over\s+(?:the\s+)?(?:glass|drink)',
        r'[Pp]ress\s+[^.]+?\s+(?:around|on)\s+(?:the\s+)?(?:glass|rim)',
        r'[Ss]pear\s+[^.]+?\s+(?:together|with)',
        r'[Ss]lide\s+[^.]+?\s+(?:down|into|on)',
        r'[Aa]rrange\s+[^.]+?\s+(?:on|in|around)',
        r'[Ee]xpress\s+[^.]+?\s+(?:oils?|peel)\s+(?:over|on)',
        r'[Rr]ub\s+[^.]+?\s+(?:around|on)\s+(?:the\s+)?rim'
    ]
    
    # Common garnish patterns for extraction
    garnish_patterns = [
        # GARNISH: prefix with no action
        r'(?:^|\. )GARNISH:\s*([^.]+?)(?=\s*(?:[Ss]hake|[Ss]tir|[Mm]uddle|[Ss]train|\.|$))',
        # Simple garnish with... format
        r'[Gg]arnish(?:ed)?\s+with\s+([^.]+?)(?=\s*(?:[Ss]hake|[Ss]tir|[Mm]uddle|[Ss]train|\.|$))',
        # For garnish
        r'(?:[Aa]dd\s+)?([^.]+?\s+(?:for|as)\s+garnish)(?=\s*(?:[Ss]hake|[Ss]tir|[Mm]uddle|[Ss]train|\.|$))',
        # Explicit garnish at end
        r'[Gg]arnish\s+with\s+([^.]+)\.?\s*$'
    ]
    
    # First, identify any actionable garnish instructions to keep
    actionable_instructions = []
    remaining_instructions = instructions
    
    for pattern in actionable_patterns:
        matches = re.finditer(pattern, instructions, re.IGNORECASE)
        for match in matches:
            actionable_instructions.append(match.group(0))
            # Don't remove from instructions - we'll keep these
    
    # Then find the garnish for the garnish field
    for pattern in garnish_patterns:
        match = re.search(pattern, instructions, re.IGNORECASE)
        if match:
            garnish = match.group(1).strip()
            start_pos = match.start()
            end_pos = match.end()
            
            # Only remove non-actionable garnish text
            is_actionable = any(re.search(action_pattern, garnish, re.IGNORECASE) 
                              for action_pattern in actionable_patterns)
            
            if not is_actionable:
                # If at start of instructions
                if start_pos == 0:
                    clean_instructions = instructions[end_pos:].strip()
                # If at end of instructions
                elif end_pos >= len(instructions) - 1 or instructions[end_pos:].strip() in {'.', ''}:
                    clean_instructions = instructions[:start_pos].strip()
                # If in middle, check if it's part of an actionable instruction
                else:
                    sentence = re.split(r'[.!?]+', instructions[max(0, start_pos-50):min(len(instructions), end_pos+50)])[0]
                    if not any(re.search(action_pattern, sentence, re.IGNORECASE) 
                             for action_pattern in actionable_patterns):
                        clean_instructions = instructions[:start_pos].strip()
            break
    
    # Extract any straw instructions
    straw_patterns = [
        r'[Ss]erve\s+with\s+(?:a\s+)?straw',
        r'[Aa]dd\s+(?:a\s+)?straw',
        r'[Pp]lace\s+(?:a\s+)?straw',
        r'[Ii]nsert\s+(?:a\s+)?straw'
    ]
    
    straw_instruction = ""
    for pattern in straw_patterns:
        match = re.search(pattern, garnish)
        if match:
            # Remove straw text from garnish
            garnish = re.sub(pattern, '', garnish).strip(' .,')
            straw_instruction = "Serve with a straw."
            break
    
    # Clean up instructions
    clean_instructions = re.sub(r'\s+', ' ', clean_instructions)  # Normalize whitespace
    clean_instructions = clean_instructions.strip()
    # Remove any "GARNISH:" prefix and numbers at start
    clean_instructions = re.sub(r'^(?:GARNISH:\s*)?(?:\d+[,\s]+)?', '', clean_instructions, flags=re.IGNORECASE)
    clean_instructions = re.sub(r'^[A-Z\s,]+(?=[A-Z][a-z])', '', clean_instructions)  # Remove all-caps prefixes
    
    if clean_instructions:
        clean_instructions = clean_instructions[0].upper() + clean_instructions[1:]  # Capitalize first letter
        if not clean_instructions.endswith('.'):
            clean_instructions += '.'
    
    # Add straw instruction if present
    if straw_instruction and straw_instruction not in clean_instructions:
        clean_instructions = clean_instructions + ' ' + straw_instruction
    
    return garnish, clean_instructions

def capitalize_drink_name(name):
    lowercase_words = {'a', 'an', 'and', 'as', 'at', 'but', 'by', 'for', 'in', 'of', 'on', 'or', 'the', 'to', 'with'}
    
    words = name.strip().split()
    if not words:
        return name
        
    result = [words[0].capitalize()]
    
    for word in words[1:]:
        if word.lower() in lowercase_words:
            result.append(word.lower())
        elif "'" in word:
            result.append(word.title())
        else:
            result.append(word.capitalize())
            
    return ' '.join(result)

def load_csv(filename):
    drinks = defaultdict(lambda: {"ingredients": [], "name": "", "source": "", "instructions": "", "glass": "", "garnish": ""})
    current_drink = None
    current_instructions = []
    
    with open(filename, 'r') as f:
        reader = csv.DictReader(f)
        for row in reader:
            # Skip empty rows and section headers (all caps with no ingredients)
            if not row.get('name') or row['name'].strip() == '' or (
                row['name'].isupper() and not row.get('ingredient')):
                continue
                
            name = normalize_text(row['name'].strip())
            
            # If we have a new drink name
            if name and name != current_drink:
                # Process any accumulated instructions for the previous drink
                if current_drink and current_instructions:
                    full_instructions = ' '.join(current_instructions)
                    garnish, instructions = extract_garnish(full_instructions)
                    drinks[current_drink]["instructions"] = normalize_text(instructions)
                    if garnish:
                        drinks[current_drink]["garnish"] = garnish
                
                # Start new drink
                current_drink = name
                current_instructions = []
                drinks[name]["name"] = capitalize_drink_name(name)
                drinks[name]["source"] = "SC" if "SC.csv" in filename else "D&Co"
                
                # Handle instructions based on file type
                if "SC.csv" in filename:
                    if row.get('pageNum'):
                        drinks[name]["instructions"] = f"See page {row['pageNum']} in Smuggler's Cove book."
            
            # Accumulate instructions for D&Co file
            if "D&Co" in filename and row.get('instruction'):
                current_instructions.append(row['instruction'].strip())
            
            # Process ingredients
            if row.get('ingredient'):
                amount = "1"
                unit = "oz"
                
                ingredient_text = normalize_text(row['ingredient'])
                amount_match = re.match(r'^([\d./-]+)\s*', ingredient_text)
                if amount_match:
                    amount = amount_match.group(1)
                    ingredient_text = ingredient_text[amount_match.end():].strip()
                
                # Handle special unit cases
                unit_map = {
                    'oz': ['oz', 'ounce', 'ounces'],
                    'dash': ['dash', 'dashes'],
                    'barspoon': ['barspoon', 'bar spoon'],
                    'piece': ['piece', 'pieces', 'chunk', 'chunks'],
                    'leaf': ['leaf', 'leaves'],
                    'wedge': ['wedge', 'wedges']
                }
                
                for std_unit, variants in unit_map.items():
                    if any(variant in ingredient_text.lower() for variant in variants):
                        unit = std_unit
                        # Remove the unit text from ingredient name
                        for variant in variants:
                            ingredient_text = re.sub(rf'\b{variant}s?\b', '', ingredient_text, flags=re.IGNORECASE)
                        break
                
                ingredient = {
                    "name": ingredient_text.strip(),
                    "category": normalize_text(row.get('ingredientCategory', '').strip()),
                    "amount": amount,
                    "unit": unit
                }
                drinks[name]["ingredients"].append(ingredient)
    
    # Process instructions for the last drink
    if current_drink and current_instructions:
        full_instructions = ' '.join(current_instructions)
        garnish, instructions = extract_garnish(full_instructions)
        drinks[current_drink]["instructions"] = normalize_text(instructions)
        if garnish:
            drinks[current_drink]["garnish"] = garnish
                
    return drinks

def get_default_categories():
    return [
        'Agave (Mezcal)',
        'Agave (Tequila Blanco)',
        'Amaro (Campari)',
        'Bitters (Aromatic)',
        'Bitters (Creole)',
        'Bitters (Orange)',
        'Cream (Heavy)',
        'Egg',
        'Extract (Vanilla)',
        'Fruit (Cherry)',
        'Fruit (Lime)',
        'Fruit (Orange)',
        'Gin (American)',
        'Gin (London Dry)',
        'Juice (Lemon)',
        'Juice (Lime)',
        'Juice (Pineapple)',
        'Leaf (Mint)',
        'Liqueur (Almond)',
        'Liqueur (Falernum)',
        'Liqueur (Orange Blue)',
        'Liqueur (Orange)',
        'Milk (Sweetened Condensed)',
        'Milk (Whole)',
        'Mint',
        'Rum (Black Blended Overproof)',
        'Rum (Black Blended)',
        'Rum (Blended Aged)',
        'Rum (Blended Lightly Aged)',
        'Rum (Cane AOC Martinique Rhum Agricole Blanc)',
        'Rum (Column Still Aged)',
        'Rum (Column Still Lightly Aged)',
        'Rum (Demerara Overproof)',
        'Rum (Demerara)',
        'Rum (Pot Still Lightly Aged) (Overproof)',
        'Soda',
        'Spice (Ginger)',
        'Syrup (Agave Nectar)',
        'Syrup (Agave)',
        'Syrup (Demerara)',
        'Syrup (Grenadine)',
        'Syrup (Honey)',
        'Syrup (Mai Tai Rich Simple)',
        'Syrup (Maple)',
        'Syrup (Orgeat)',
        'Syrup (Passion Fruit)',
        'Syrup (Rich Simple)',
        'Syrup (Simple)',
        'Vermouth (Blanc)',
        'Vermouth (Dry)',
        'Vermouth (Sweet)',
        'Whiskey (Bourbon)',
        'Whiskey (Japanese)',
        'Whiskey (Rye)',
        'Wine (Red)',
    ]

def get_category_mapping():
    return {
        'Agave': ('Agave', ['Mezcal', 'Tequila Blanco']),
        'Gin': ('Spirit', ['American', 'London Dry']),
        'Rum': ('Spirit', ['Black Blended Overproof', 'Black Blended', 'Blended Aged', 'Blended Lightly Aged',
                          'Cane AOC Martinique Rhum Agricole Blanc', 'Column Still Aged', 'Column Still Lightly Aged',
                          'Demerara Overproof', 'Demerara', 'Pot Still Lightly Aged (Overproof)']),
        'Whiskey': ('Spirit', ['Bourbon', 'Japanese', 'Rye']),
        'Other Liquor': ('Spirit', ['Vodka', 'Absinthe', 'Brandy']),
        'Wine': ('Wine', ['Red', 'Fortified', 'Sparkling']),
        'Vermouth': ('Vermouth', ['Blanc', 'Dry', 'Sweet']),
        'Liqueur': ('Liqueur', ['Almond', 'Falernum', 'Orange Blue', 'Orange']),
        'Bitters': ('Bitters', ['Aromatic', 'Creole', 'Orange']),
        'Fruit': ('Fruit', ['Cherry', 'Lime', 'Orange']),
        'Juice': ('Juice', ['Lemon', 'Lime', 'Pineapple']),
        'Spices': ('Spice', ['Ginger']),
        'Syrups': ('Syrup', ['Agave Nectar', 'Agave', 'Demerara', 'Grenadine', 'Honey', 'Mai Tai Rich Simple',
                            'Maple', 'Orgeat', 'Passion Fruit', 'Rich Simple', 'Simple']),
        'Dairy': ('Dairy', ['Heavy Cream', 'Sweetened Condensed Milk', 'Whole Milk']),
    }

def clean_garnish_name(name):
    """Clean up garnish names"""
    # Convert to lowercase first for better pattern matching
    name = name.lower()
    
    # Remove instruction-like text
    instruction_patterns = [
        r'squeeze\s+[^,]+?\s+into',
        r'drop\s+[^,]+?\s+in',
        r'add\s+[^,]+?\s+to',
        r'place\s+[^,]+?\s+in',
        r'float\s+[^,]+?\s+on',
        r'short\b.*$',  # Remove 'short' and anything after it
    ]
    
    for pattern in instruction_patterns:
        name = re.sub(pattern, '', name, flags=re.IGNORECASE)
    
    # Remove common unnecessary words
    name = re.sub(r'\b(?:the|a|an|serve|with|using)\b', '', name, flags=re.IGNORECASE)
    name = re.sub(r'\b(?:and\s+)?(?:serve\s+with\s+)?(?:a\s+)?straw\b.*$', '', name, flags=re.IGNORECASE)
    # Remove trailing conjunctions
    name = re.sub(r'\s+(?:and|or)\s*$', '', name, flags=re.IGNORECASE)
    # Remove extra whitespace and punctuation
    name = re.sub(r'\s+', ' ', name).strip(' .,')
    
    # Proper title case
    words = name.split()
    if not words:
        return name
    
    # Words that should stay lowercase unless at start
    small_words = {'a', 'an', 'and', 'as', 'at', 'but', 'by', 'for', 'in', 'of', 'on', 'or', 'the', 'to', 'with'}
    # Words that should always be capitalized
    proper_nouns = {'angostura', 'peychaud', 'orange', 'lemon', 'lime', 'mint', 'cherry', 'pineapple'}
    
    result = []
    for i, word in enumerate(words):
        if word in proper_nouns:
            result.append(word.capitalize())
        elif i == 0 or word not in small_words:
            if "'" in word:  # Handle contractions
                result.append(word.title())
            else:
                result.append(word.capitalize())
        else:
            result.append(word.lower())
    
    return ' '.join(result)

def parse_garnish_components(garnish_text):
    """Parse a garnish into its component parts"""
    components = []
    
    # Special handling for compound garnishes
    compound_patterns = [
        (r'(?:pineapple\s+and\s+cherry\s+flag)', 'Pineapple and Cherry Flag', 'flag'),
        (r'(?:orange\s+and\s+cherry\s+flag)', 'Orange and Cherry Flag', 'flag'),
        (r'(?:lemon\s+and\s+cherry\s+flag)', 'Lemon and Cherry Flag', 'flag'),
        (r'(?:brandied\s+cherry\s+flag)', 'Brandied Cherry Flag', 'flag')
    ]
    
    # Special cases that should not be split
    special_cases = [
        r'angostura\s+bitters',
        r'peychaud\'s\s+bitters',
        r'orange\s+bitters'
    ]
    
    # Clean and lowercase the text for matching
    clean_text = clean_garnish_name(garnish_text).lower()
    
    # Check for compound garnishes first
    for pattern, name, unit in compound_patterns:
        if re.search(pattern, clean_text):
            components.append({
                "amount": "1",
                "unit": unit,
                "name": name
            })
            return components
    
    # Split on commas and 'and', but preserve special cases
    parts = []
    current_part = clean_text
    
    # First, protect special cases by replacing them with placeholders
    protected_parts = {}
    for i, pattern in enumerate(special_cases):
        matches = re.finditer(pattern, current_part, re.IGNORECASE)
        for match in matches:
            placeholder = f"__PROTECTED_{i}_{len(protected_parts)}__"
            protected_parts[placeholder] = match.group(0)
            current_part = current_part.replace(match.group(0), placeholder)
    
    # Now split the text
    parts = re.split(r',\s*(?:and\s+)?|\s+and\s+', current_part)
    
    # Restore protected parts
    parts = [reduce(lambda s, kv: s.replace(kv[0], kv[1]), protected_parts.items(), part) 
            for part in parts]
    
    for part in parts:
        amount = "1"
        unit = "piece"
        name = clean_garnish_name(part)
        
        # Try to extract number at start
        amount_match = re.match(r'^(\d+)\s*,?\s*', name)
        if amount_match:
            amount = amount_match.group(1)
            name = name[amount_match.end():].strip()
        
        # Common garnish units
        unit_map = {
            'sprig': ['sprig', 'sprigs'],
            'wheel': ['wheel', 'wheels'],
            'twist': ['twist', 'twists'],
            'slice': ['slice', 'slices'],
            'wedge': ['wedge', 'wedges'],
            'leaf': ['leaf', 'leaves'],
            'piece': ['piece', 'pieces', 'chunk', 'chunks'],
            'dash': ['dash', 'dashes'],
            'flag': ['flag', 'flags']
        }
        
        for std_unit, variants in unit_map.items():
            if any(f" {variant}" in name.lower() for variant in variants):
                unit = std_unit
                # Remove the unit from the name
                for variant in variants:
                    name = re.sub(rf'\s+{variant}\b', '', name, flags=re.IGNORECASE)
                break
        
        name = clean_garnish_name(name)
        if name:  # Only add if we have a name after cleaning
            components.append({
                "amount": amount,
                "unit": unit,
                "name": name
            })
    
    return components

def create_garnish_ingredients(garnish_text, ingredient_counter, normalized, ingredient_map):
    """Create new ingredient entries for garnish components"""
    components = parse_garnish_components(garnish_text)
    garnish_ids = []
    
    for component in components:
        name = component["name"]
        
        # Check if this garnish component already exists
        existing_id = next((id for id, ing in normalized.items() 
                          if ing["name"].lower() == name.lower() and ing.get("isGarnish")), None)
        if existing_id:
            garnish_ids.append({
                "ingredientId": int(existing_id),
                "amount": component["amount"],
                "unit": component["unit"]
            })
            continue
        
        # Determine category based on common garnish types
        category_patterns = [
            (r'\bmint\b', 'Herb', 'Mint'),
            (r'\b(?:orange|lemon|lime)\s+(?:wheel|twist|peel|wedge)\b', 'Citrus', '{}'),
            (r'\b(?:orange|lemon|lime)\b', 'Citrus', '{}'),
            (r'\bcherry\b', 'Fruit', 'Cherry'),
            (r'\bpineapple\b', 'Fruit', 'Pineapple'),
            (r'\bnutmeg\b', 'Spice', 'Nutmeg'),
            (r'\bcinnamon\b', 'Spice', 'Cinnamon'),
            (r'flag$', 'Compound', 'Flag'),
            (r'\bflag\b', 'Compound', 'Flag')
        ]
        
        category = "Other"
        subcategory = "Garnish"
        
        for pattern, cat, subcat in category_patterns:
            match = re.search(pattern, name.lower())
            if match:
                category = cat
                if '{}' in subcat:
                    # Extract the specific type (orange, lemon, lime)
                    type_name = next(word for word in ['orange', 'lemon', 'lime'] 
                                   if word in name.lower()).capitalize()
                    subcategory = subcat.format(type_name)
                else:
                    subcategory = subcat
                break
        
        normalized[str(ingredient_counter)] = {
            "id": ingredient_counter,
            "name": name,
            "categoryId": 7,  # Garnish category
            "category": category,
            "subcategory": subcategory,
            "isGarnish": True
        }
        
        garnish_ids.append({
            "ingredientId": ingredient_counter,
            "amount": component["amount"],
            "unit": component["unit"]
        })
        
        ingredient_counter += 1
    
    return garnish_ids, ingredient_counter

def normalize_ingredients(ingredients_list):
    normalized = {}
    id_counter = 1
    
    default_categories = get_default_categories()
    category_mapping = get_category_mapping()
    
    categories = {
        "1": {"id": 1, "name": "Juice", "subcategories": ["Citrus", "Fruit"]},
        "2": {"id": 2, "name": "Syrup", "subcategories": ["Simple", "Complex", "Fruit"]},
        "3": {"id": 3, "name": "Spirit", "subcategories": ["Rum", "Gin", "Whiskey", "Agave", "Other"]},
        "4": {"id": 4, "name": "Liqueur", "subcategories": ["Fruit", "Herbal", "Cream"]},
        "5": {"id": 5, "name": "Bitters", "subcategories": ["Aromatic", "Citrus", "Spiced"]},
        "6": {"id": 6, "name": "Wine", "subcategories": ["Fortified", "Sparkling", "Still"]},
        "7": {"id": 7, "name": "Garnish", "subcategories": ["Citrus", "Fruit", "Herb", "Spice", "Compound", "Other"]},
        "8": {"id": 8, "name": "Fruit", "subcategories": ["Fresh", "Dried", "Juice"]},
        "9": {"id": 9, "name": "Vermouth", "subcategories": ["Sweet", "Dry", "Blanc"]},
        "10": {"id": 10, "name": "Dairy", "subcategories": ["Milk", "Cream", "Other"]}
    }
    
    ingredient_map = {}
    garnish_map = {}
    
    # First pass: map default categories
    for category in default_categories:
        if category not in ingredient_map:
            normalized[str(id_counter)] = {
                "id": id_counter,
                "name": category,
                "categoryId": next((cat_id for cat_id, cat in categories.items() 
                                  if any(cat["name"] in category for subcat in cat["subcategories"])), 10),
                "subcategory": category.split(" (")[1].rstrip(")") if " (" in category else category,
                "isGarnish": False
            }
            ingredient_map[category] = id_counter
            id_counter += 1
    
    # Second pass: process ingredients from drinks
    for drink in ingredients_list.values():
        # Process regular ingredients
        for ingredient in drink["ingredients"]:
            name = ingredient["name"]
            category = ingredient["category"]
            
            if name not in ingredient_map:
                main_category = next((k for k, v in category_mapping.items() 
                                    if category and k.lower() in category.lower()), None)
                
                if main_category:
                    cat_name, subcats = category_mapping[main_category]
                    cat_id = next((cid for cid, cat in categories.items() 
                                 if cat["name"] == cat_name), "10")
                    subcat = next((sub for sub in subcats 
                                 if sub.lower() in category.lower()), subcats[0])
                else:
                    cat_id = "10"
                    subcat = "Other"
                
                normalized[str(id_counter)] = {
                    "id": id_counter,
                    "name": normalize_text(name.title()),
                    "categoryId": int(cat_id),
                    "subcategory": subcat,
                    "isGarnish": False
                }
                ingredient_map[name] = id_counter
                id_counter += 1
        
        # Process garnish if present
        if drink.get("garnish"):
            garnish_text = drink["garnish"]
            if garnish_text not in garnish_map:
                garnish_components, id_counter = create_garnish_ingredients(
                    garnish_text, id_counter, normalized, ingredient_map)
                garnish_map[garnish_text] = garnish_components
                
    return normalized, ingredient_map, garnish_map, categories

def create_drink_objects(drinks_dict, ingredient_map, garnish_map):
    drinks = {}
    id_counter = 1
    
    for drink_name, drink_data in drinks_dict.items():
        drink_obj = {
            "id": id_counter,
            "name": drink_data["name"],
            "ingredients": [],
            "categoryIds": [3] if "RUM" in drink_name.upper() else [6],
            "instructions": drink_data["instructions"],
            "garnish": {
                "text": clean_garnish_name(drink_data["garnish"]),
                "components": garnish_map.get(drink_data["garnish"], [])
            } if drink_data.get("garnish") else None,
            "glass": drink_data["glass"] or "Coupe",
            "source": drink_data["source"]
        }
        
        for ingredient in drink_data["ingredients"]:
            if ingredient["name"] in ingredient_map:
                drink_obj["ingredients"].append({
                    "ingredientId": ingredient_map[ingredient["name"]],
                    "amount": ingredient["amount"],
                    "unit": ingredient["unit"]
                })
                
        drinks[str(id_counter)] = drink_obj
        id_counter += 1
        
    return drinks

def create_indexes(drinks, ingredients):
    indexes = {
        "byCategory": defaultdict(list),
        "byIngredient": defaultdict(list),
        "byGarnish": defaultdict(list)
    }
    
    # Index ingredients by category
    for ing_id, ing_data in ingredients.items():
        indexes["byCategory"][str(ing_data["categoryId"])].append(ing_data["id"])
        if ing_data.get("isGarnish"):
            indexes["byGarnish"][ing_data["category"]].append(ing_data["id"])
        
    # Index drinks by ingredient and garnish
    for drink_id, drink_data in drinks.items():
        # Index regular ingredients
        for ingredient in drink_data["ingredients"]:
            indexes["byIngredient"][str(ingredient["ingredientId"])].append(int(drink_id))
        
        # Index garnishes
        if drink_data.get("garnish") and drink_data["garnish"].get("components"):
            for component in drink_data["garnish"]["components"]:
                indexes["byGarnish"][str(component["ingredientId"])].append(int(drink_id))
            
    return {
        "byCategory": dict(indexes["byCategory"]),
        "byIngredient": dict(indexes["byIngredient"]),
        "byGarnish": dict(indexes["byGarnish"])
    }

def main():
    sc_drinks = load_csv('data/csv/SC.csv')
    dco_drinks = load_csv('data/csv/D&Co-2.csv')
    
    all_drinks = {**sc_drinks, **dco_drinks}
    
    ingredients, ingredient_map, garnish_map, categories = normalize_ingredients(all_drinks)
    
    drinks = create_drink_objects(all_drinks, ingredient_map, garnish_map)
    
    indexes = create_indexes(drinks, ingredients)
    
    output = {
        "version": 1,
        "categories": categories,
        "ingredients": ingredients,
        "drinks": drinks,
        "indexes": indexes
    }
    
    with open('drinks.json', 'w') as f:
        json.dump(output, f, indent=2)

if __name__ == "__main__":
    main() 