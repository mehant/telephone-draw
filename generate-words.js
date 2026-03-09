const fs = require('fs');

const words = [];

// Animals - Mammals (~120)
const mammals = [
  "cat", "dog", "horse", "cow", "pig", "sheep", "goat", "rabbit", "mouse", "rat",
  "hamster", "gerbil", "guinea pig", "squirrel", "chipmunk", "beaver", "otter", "fox", "wolf", "bear",
  "deer", "moose", "elk", "buffalo", "bison", "zebra", "giraffe", "elephant", "rhinoceros", "hippopotamus",
  "lion", "tiger", "leopard", "cheetah", "jaguar", "panther", "cougar", "bobcat", "lynx", "hyena",
  "monkey", "gorilla", "chimpanzee", "orangutan", "baboon", "lemur", "sloth", "armadillo", "porcupine", "hedgehog",
  "bat", "raccoon", "skunk", "badger", "weasel", "ferret", "mink", "mongoose", "meerkat", "koala",
  "kangaroo", "wallaby", "platypus", "opossum", "chinchilla", "camel", "llama", "alpaca", "donkey", "mule",
  "pony", "stallion", "mare", "colt", "puppy", "kitten", "cub", "fawn", "lamb", "calf",
  "whale", "dolphin", "seal", "walrus", "manatee", "narwhal", "porpoise", "gazelle", "antelope", "ibex",
  "yak", "ox", "bull", "ram", "boar", "hog", "piglet", "panda", "polar bear", "grizzly bear",
  "wombat", "dingo", "jackal", "coyote", "reindeer", "caribou", "mammoth", "wolverine", "mole", "shrew",
  "chihuahua", "poodle", "dalmatian", "bulldog", "retriever", "collie", "beagle", "terrier", "husky", "mastiff"
];

// Animals - Birds (~100)
const birds = [
  "eagle", "hawk", "falcon", "owl", "vulture", "condor", "parrot", "parakeet", "macaw", "cockatoo",
  "robin", "sparrow", "finch", "cardinal", "bluejay", "crow", "raven", "magpie", "starling", "swallow",
  "hummingbird", "woodpecker", "toucan", "pelican", "flamingo", "heron", "crane", "stork", "ibis", "egret",
  "duck", "goose", "swan", "penguin", "ostrich", "emu", "kiwi", "peacock", "turkey", "chicken",
  "rooster", "hen", "chick", "dove", "pigeon", "seagull", "albatross", "puffin", "kingfisher", "canary",
  "oriole", "wren", "lark", "nightingale", "mockingbird", "catbird", "roadrunner", "quail", "pheasant", "grouse",
  "partridge", "ptarmigan", "sandpiper", "plover", "curlew", "avocet", "oystercatcher", "tern", "cormorant", "gannet",
  "osprey", "kestrel", "harrier", "buzzard", "kite", "swift", "martin", "cuckoo", "hoopoe", "bee-eater",
  "hornbill", "mynah", "budgerigar", "lovebird", "cockatiel", "lorikeet", "warbler", "thrush", "nuthatch", "chickadee",
  "goldfinch", "crossbill", "bunting", "tanager", "grosbeak", "siskin", "linnet", "rook", "jackdaw", "jay"
];

// Animals - Fish (~60)
const fish = [
  "goldfish", "salmon", "trout", "bass", "tuna", "swordfish", "marlin", "shark", "hammerhead", "stingray",
  "manta ray", "clownfish", "angelfish", "pufferfish", "seahorse", "catfish", "carp", "pike", "perch", "cod",
  "herring", "sardine", "anchovy", "mackerel", "barracuda", "piranha", "eel", "moray eel", "flounder", "halibut",
  "sole", "snapper", "grouper", "tilapia", "sturgeon", "paddlefish", "garfish", "blowfish", "lionfish", "zebrafish",
  "betta fish", "guppy", "tetra", "molly", "swordtail", "discus", "arowana", "koi", "sunfish", "bluegill",
  "walleye", "minnow", "goby", "wrasse", "parrotfish", "triggerfish", "boxfish", "flying fish", "lanternfish", "lamprey"
];

// Animals - Reptiles & Amphibians (~60)
const reptiles = [
  "snake", "cobra", "python", "viper", "rattlesnake", "boa", "anaconda", "lizard", "gecko", "iguana",
  "chameleon", "komodo dragon", "monitor lizard", "skink", "salamander", "newt", "axolotl", "frog", "toad", "treefrog",
  "bullfrog", "tadpole", "turtle", "tortoise", "sea turtle", "alligator", "crocodile", "caiman", "gavial", "tuatara",
  "horned lizard", "frilled lizard", "basilisk", "anole", "bearded dragon", "blue tongue", "garter snake", "coral snake", "king cobra", "mamba",
  "copperhead", "cottonmouth", "adder", "asp", "sidewinder", "milk snake", "corn snake", "ball python", "tree boa", "water snake",
  "box turtle", "snapping turtle", "painted turtle", "softshell", "terrapin", "glass frog", "poison dart frog", "caecilian", "mudpuppy", "hellbender"
];

// Animals - Insects & Bugs (~80)
const insects = [
  "butterfly", "moth", "bee", "wasp", "hornet", "ant", "termite", "beetle", "ladybug", "firefly",
  "dragonfly", "damselfly", "grasshopper", "cricket", "locust", "katydid", "mantis", "stick insect", "cockroach", "flea",
  "tick", "louse", "mosquito", "fly", "housefly", "horsefly", "mayfly", "stonefly", "caddisfly", "lacewing",
  "earwig", "silverfish", "centipede", "millipede", "scorpion", "spider", "tarantula", "black widow", "daddy longlegs", "mite",
  "caterpillar", "chrysalis", "cocoon", "larva", "maggot", "grub", "worm", "earthworm", "leech", "slug",
  "snail", "pillbug", "sowbug", "weevil", "aphid", "cicada", "leafhopper", "stink bug", "water strider", "dung beetle",
  "scarab", "june bug", "stag beetle", "rhinoceros beetle", "boll weevil", "bumblebee", "carpenter bee", "yellowjacket", "paper wasp", "mud dauber",
  "walking stick", "assassin bug", "water bug", "bedbug", "lacebug", "sawfly", "gnat", "midge", "crane fly", "robber fly"
];

// Animals - Sea Creatures (~50)
const seaCreatures = [
  "octopus", "squid", "jellyfish", "starfish", "sea urchin", "sea cucumber", "coral", "anemone", "sponge", "crab",
  "lobster", "shrimp", "prawn", "crawfish", "barnacle", "clam", "oyster", "mussel", "scallop", "conch",
  "nautilus", "cuttlefish", "sea slug", "sea horse", "sea lion", "sea otter", "hermit crab", "horseshoe crab", "king crab", "sand dollar",
  "sea fan", "man-of-war", "plankton", "krill", "sea snail", "abalone", "whelk", "limpet", "sea star", "brittle star",
  "sea dragon", "sea snake", "blue whale", "sperm whale", "humpback whale", "orca", "beluga", "dugong", "sea bass", "anglerfish"
];

// Food - Fruits (~60)
const fruits = [
  "apple", "banana", "orange", "grape", "strawberry", "blueberry", "raspberry", "blackberry", "cherry", "peach",
  "pear", "plum", "apricot", "nectarine", "mango", "pineapple", "coconut", "watermelon", "cantaloupe", "honeydew",
  "kiwi fruit", "papaya", "guava", "lychee", "pomegranate", "fig", "date", "passion fruit", "dragon fruit", "star fruit",
  "persimmon", "tangerine", "clementine", "grapefruit", "lime", "lemon", "avocado", "olive", "cranberry", "gooseberry",
  "boysenberry", "elderberry", "mulberry", "currant", "kumquat", "plantain", "jackfruit", "durian", "rambutan", "mangosteen",
  "quince", "loquat", "tamarind", "breadfruit", "soursop", "acai berry", "cactus fruit", "blood orange", "mandarin", "ugli fruit"
];

// Food - Vegetables (~60)
const vegetables = [
  "carrot", "potato", "tomato", "onion", "garlic", "broccoli", "cauliflower", "cabbage", "lettuce", "spinach",
  "kale", "celery", "cucumber", "zucchini", "squash", "pumpkin", "eggplant", "pepper", "chili pepper", "bell pepper",
  "corn", "peas", "green bean", "lima bean", "kidney bean", "lentil", "chickpea", "soybean", "edamame", "asparagus",
  "artichoke", "brussels sprout", "beet", "turnip", "radish", "parsnip", "rutabaga", "sweet potato", "yam", "taro",
  "ginger", "turmeric", "leek", "shallot", "scallion", "chive", "watercress", "arugula", "endive", "radicchio",
  "bok choy", "bamboo shoot", "bean sprout", "jicama", "okra", "fennel", "rhubarb", "horseradish", "wasabi", "mushroom"
];

// Food - Prepared Foods & Dishes (~120)
const preparedFoods = [
  "pizza", "hamburger", "hot dog", "sandwich", "taco", "burrito", "quesadilla", "nachos", "enchilada", "tamale",
  "sushi", "ramen", "noodle soup", "fried rice", "spring roll", "dumpling", "wonton", "egg roll", "stir fry", "curry",
  "pasta", "spaghetti", "lasagna", "ravioli", "macaroni", "fettuccine", "gnocchi", "risotto", "polenta", "bruschetta",
  "steak", "roast beef", "pot roast", "meatloaf", "meatball", "pork chop", "fried chicken", "chicken wing", "drumstick", "turkey leg",
  "fish stick", "fish taco", "crab cake", "shrimp cocktail", "lobster roll", "clam chowder", "gumbo", "jambalaya", "paella", "ceviche",
  "salad", "coleslaw", "potato salad", "caesar salad", "soup", "chili", "stew", "casserole", "pot pie", "shepherd's pie",
  "pancake", "waffle", "french toast", "crepe", "omelet", "scrambled eggs", "fried egg", "poached egg", "eggs benedict", "quiche",
  "grilled cheese", "club sandwich", "wrap", "pita", "falafel", "hummus", "guacamole", "salsa", "chips", "french fries",
  "onion ring", "hash brown", "baked potato", "mashed potato", "potato chip", "pretzel", "popcorn", "corn dog", "pulled pork", "ribs",
  "bacon", "sausage", "ham", "jerky", "pepperoni", "salami", "prosciutto", "chorizo", "bratwurst", "kielbasa",
  "tofu", "tempeh", "granola", "oatmeal", "cereal", "porridge", "congee", "dim sum", "satay", "kebab",
  "gyro", "shawarma", "biryani", "tikka masala", "pad thai", "pho", "bibimbap", "teriyaki", "tempura", "tonkatsu"
];

// Food - Baked Goods & Desserts (~80)
const bakedGoods = [
  "bread", "baguette", "croissant", "bagel", "muffin", "scone", "biscuit", "roll", "sourdough", "cornbread",
  "cake", "cupcake", "brownie", "cookie", "pie", "tart", "cheesecake", "tiramisu", "eclair", "cream puff",
  "donut", "cinnamon roll", "danish", "strudel", "baklava", "churro", "cannoli", "macaron", "meringue", "souffle",
  "ice cream", "gelato", "sorbet", "frozen yogurt", "milkshake", "sundae", "popsicle", "ice cream cone", "banana split", "parfait",
  "pudding", "custard", "mousse", "flan", "creme brulee", "panna cotta", "jello", "cobbler", "crumble", "crisp",
  "candy", "chocolate", "fudge", "caramel", "toffee", "taffy", "lollipop", "gummy bear", "licorice", "marshmallow",
  "cotton candy", "candy cane", "jelly bean", "gumdrop", "truffle", "bonbon", "praline", "nougat", "marzipan", "fondant",
  "granola bar", "energy bar", "rice cake", "graham cracker", "shortbread", "gingerbread", "fruitcake", "pound cake", "angel food cake", "bundt cake"
];

// Food - Dairy & Cheese (~30)
const dairy = [
  "milk", "cheese", "butter", "yogurt", "cream", "sour cream", "cottage cheese", "cream cheese", "whipped cream", "ice cream sandwich",
  "cheddar", "mozzarella", "parmesan", "brie", "gouda", "swiss cheese", "blue cheese", "feta", "ricotta", "provolone",
  "milkshake", "smoothie", "kefir", "buttermilk", "condensed milk", "evaporated milk", "powdered milk", "ghee", "custard pie", "cheese wheel"
];

// Drinks (~60)
const drinks = [
  "water", "coffee", "tea", "juice", "soda", "lemonade", "iced tea", "hot chocolate", "milkshake", "smoothie bowl",
  "beer", "wine", "champagne", "cocktail", "martini", "margarita", "mojito", "daiquiri", "sangria", "whiskey",
  "vodka", "rum", "gin", "tequila", "brandy", "bourbon", "sake", "mead", "cider", "ale",
  "espresso", "cappuccino", "latte", "mocha", "americano", "macchiato", "frappe", "cold brew", "matcha", "chai",
  "orange juice", "apple juice", "grape juice", "cranberry juice", "tomato juice", "carrot juice", "coconut water", "almond milk", "oat milk", "soy milk",
  "sparkling water", "tonic water", "ginger ale", "root beer", "energy drink", "sports drink", "punch", "eggnog", "horchata", "kombucha"
];

// Household Objects (~300)
const householdObjects = [
  "lamp", "lightbulb", "candle", "chandelier", "lantern", "flashlight", "nightlight", "sconce", "torch", "spotlight",
  "clock", "alarm clock", "wall clock", "grandfather clock", "hourglass", "sundial", "stopwatch", "timer", "cuckoo clock", "pocket watch",
  "mirror", "picture frame", "painting", "poster", "calendar", "map", "globe", "sculpture", "vase", "figurine",
  "rug", "carpet", "doormat", "curtain", "blinds", "drape", "tapestry", "tablecloth", "placemat", "coaster",
  "pillow", "cushion", "blanket", "comforter", "quilt", "duvet", "sheet", "mattress", "sleeping bag", "hammock",
  "broom", "mop", "dustpan", "vacuum cleaner", "feather duster", "sponge", "bucket", "spray bottle", "trash can", "recycling bin",
  "iron", "ironing board", "clothespin", "clothesline", "laundry basket", "hamper", "washing machine", "dryer", "hanger", "lint roller",
  "door", "doorknob", "doorbell", "door knocker", "keyhole", "deadbolt", "padlock", "key", "key ring", "lock",
  "window", "windowsill", "window screen", "shutter", "skylight", "stained glass", "venetian blind", "roller shade", "awning", "storm door",
  "stairs", "staircase", "railing", "banister", "step stool", "ladder", "step ladder", "escalator", "elevator", "ramp",
  "fan", "ceiling fan", "desk fan", "space heater", "radiator", "thermostat", "air conditioner", "humidifier", "dehumidifier", "air purifier",
  "smoke detector", "fire extinguisher", "fire alarm", "carbon monoxide detector", "security camera", "doorbell camera", "motion sensor", "surge protector", "power strip", "extension cord",
  "light switch", "outlet", "plug", "fuse box", "circuit breaker", "dimmer switch", "night light", "lava lamp", "desk lamp", "floor lamp",
  "ashtray", "incense", "potpourri", "air freshener", "diffuser", "humidifier pad", "fly swatter", "mousetrap", "ant trap", "bug zapper",
  "umbrella stand", "coat rack", "hat rack", "shoe rack", "magazine rack", "wine rack", "spice rack", "towel rack", "pot rack", "drying rack",
  "welcome mat", "bath mat", "area rug", "runner rug", "throw rug", "sheepskin rug", "bamboo mat", "yoga mat", "exercise mat", "play mat",
  "fire poker", "fireplace screen", "firewood", "kindling", "matches", "lighter", "candle holder", "candlestick", "menorah", "oil lamp",
  "bookend", "paperweight", "snow globe", "music box", "jewelry box", "trinket box", "keepsake box", "treasure chest", "piggy bank", "coin jar",
  "plant pot", "flower pot", "window box", "terrarium", "aquarium", "fish tank", "bird cage", "pet bed", "dog bowl", "cat tree",
  "welcome sign", "house number", "mailbox", "doormat", "wind chime", "bird feeder", "bird bath", "garden gnome", "scarecrow", "weathervane",
  "plunger", "toilet brush", "dish rack", "cutting board", "corkscrew", "bottle opener", "can opener", "nutcracker", "garlic press", "peeler",
  "whisk", "spatula", "ladle", "tongs", "rolling pin", "colander", "strainer", "grater", "sieve", "funnel",
  "thermos", "water bottle", "sippy cup", "straw", "cozy", "trivet", "hot pad", "oven mitt", "apron", "chef hat",
  "napkin", "napkin ring", "place setting", "centerpiece", "fruit bowl", "bread basket", "serving tray", "cake stand", "gravy boat", "butter dish",
  "salt shaker", "pepper mill", "sugar bowl", "creamer", "teapot", "tea kettle", "coffee pot", "french press", "coffee grinder", "espresso machine",
  "toaster", "blender", "mixer", "food processor", "microwave", "slow cooker", "pressure cooker", "rice cooker", "waffle iron", "griddle",
  "stove", "oven", "refrigerator", "freezer", "dishwasher", "garbage disposal", "trash compactor", "ice maker", "water filter", "range hood",
  "frying pan", "saucepan", "stock pot", "dutch oven", "wok", "skillet", "baking sheet", "muffin tin", "cake pan", "pie dish",
  "plate", "bowl", "cup", "mug", "glass", "goblet", "wine glass", "champagne flute", "shot glass", "tumbler",
  "fork", "knife", "spoon", "chopsticks", "steak knife", "butter knife", "soup spoon", "dessert fork", "salad fork", "serving spoon"
];

// Furniture (~150)
const furniture = [
  "chair", "table", "desk", "sofa", "couch", "loveseat", "recliner", "rocking chair", "armchair", "bean bag",
  "stool", "bar stool", "bench", "ottoman", "futon", "daybed", "chaise lounge", "papasan chair", "folding chair", "high chair",
  "bed", "bunk bed", "canopy bed", "waterbed", "crib", "cradle", "bassinet", "trundle bed", "murphy bed", "loft bed",
  "dresser", "wardrobe", "armoire", "chest of drawers", "nightstand", "vanity", "hope chest", "cedar chest", "trunk", "hutch",
  "bookshelf", "bookcase", "shelf", "floating shelf", "corner shelf", "display case", "curio cabinet", "china cabinet", "buffet", "sideboard",
  "dining table", "kitchen table", "coffee table", "end table", "side table", "console table", "folding table", "card table", "picnic table", "patio table",
  "filing cabinet", "desk chair", "office chair", "swivel chair", "computer desk", "standing desk", "cubicle", "lectern", "podium", "reception desk",
  "tv stand", "entertainment center", "media console", "fireplace mantel", "hearth", "room divider", "folding screen", "partition", "murphy door", "pocket door",
  "porch swing", "glider", "adirondack chair", "lawn chair", "deck chair", "lounge chair", "beach chair", "camping chair", "director chair", "throne",
  "cot", "air mattress", "foam mattress", "box spring", "headboard", "footboard", "bed frame", "bed rail", "canopy", "mosquito net",
  "workbench", "sawhorse", "easel", "music stand", "coat stand", "plant stand", "umbrella stand", "hall tree", "entryway bench", "window seat",
  "bar cart", "kitchen island", "breakfast bar", "kitchen cabinet", "pantry shelf", "lazy susan", "spice cabinet", "wine cabinet", "linen closet", "storage bench",
  "toy chest", "toy box", "playpen", "changing table", "booster seat", "step stool", "footstool", "hassock", "pouf", "floor cushion",
  "grandfather clock case", "grandfather clock", "mantel clock", "wall shelf", "pegboard", "corkboard", "whiteboard", "chalkboard", "bulletin board", "memo board",
  "shoe bench", "mudroom bench", "garden bench", "park bench", "piano bench", "vanity stool", "dressing table", "makeup table", "jewelry armoire", "hat stand"
];

// Clothing & Accessories (~200)
const clothing = [
  "shirt", "t-shirt", "polo shirt", "dress shirt", "blouse", "tank top", "camisole", "tube top", "crop top", "halter top",
  "sweater", "cardigan", "pullover", "hoodie", "sweatshirt", "fleece", "vest", "turtleneck", "henley", "jersey",
  "jacket", "coat", "blazer", "suit jacket", "sport coat", "parka", "windbreaker", "raincoat", "trench coat", "overcoat",
  "pants", "jeans", "shorts", "skirt", "dress", "gown", "jumpsuit", "romper", "overalls", "leggings",
  "underwear", "boxers", "briefs", "bra", "undershirt", "slip", "nightgown", "pajamas", "bathrobe", "kimono",
  "socks", "stockings", "tights", "pantyhose", "leg warmers", "knee socks", "ankle socks", "tube socks", "compression socks", "toe socks",
  "shoe", "boot", "sneaker", "sandal", "flip flop", "slipper", "heel", "loafer", "moccasin", "oxford shoe",
  "cowboy boot", "hiking boot", "rain boot", "snow boot", "work boot", "combat boot", "ankle boot", "riding boot", "wellington boot", "galosh",
  "hat", "cap", "baseball cap", "beanie", "beret", "fedora", "top hat", "cowboy hat", "sun hat", "visor",
  "headband", "bandana", "turban", "hijab", "veil", "tiara", "crown", "headpiece", "hair clip", "hair bow",
  "scarf", "shawl", "stole", "poncho", "cape", "wrap", "necktie", "bow tie", "ascot", "cravat",
  "belt", "suspenders", "garter", "cummerbund", "sash", "waistband", "buckle", "clasp", "zipper", "button",
  "gloves", "mittens", "muff", "arm warmers", "wristband", "sweatband", "elbow pad", "knee pad", "shin guard", "shoulder pad",
  "sunglasses", "eyeglasses", "monocle", "goggles", "ski goggles", "safety glasses", "reading glasses", "contact lens", "eye patch", "blindfold",
  "purse", "handbag", "clutch", "tote bag", "messenger bag", "backpack", "fanny pack", "duffel bag", "garment bag", "suitcase",
  "wallet", "coin purse", "money clip", "passport holder", "luggage tag", "keychain", "lanyard", "badge", "name tag", "pin",
  "apron", "chef coat", "lab coat", "hazmat suit", "wetsuit", "swimsuit", "bikini", "swim trunks", "wetsuit", "life jacket",
  "uniform", "scrubs", "coveralls", "flight suit", "space suit", "tuxedo", "evening gown", "wedding dress", "prom dress", "cocktail dress",
  "tutu", "leotard", "unitard", "bodysuit", "catsuit", "onesie", "snowsuit", "ski jacket", "ski pants", "snow pants",
  "flip flops", "cleat", "ballet shoe", "tap shoe", "bowling shoe", "golf shoe", "tennis shoe", "running shoe", "climbing shoe", "water shoe"
];

// Nature - Plants, Trees, Flowers (~300)
const nature = [
  "tree", "oak tree", "maple tree", "pine tree", "palm tree", "willow tree", "birch tree", "cedar tree", "elm tree", "ash tree",
  "redwood", "sequoia", "cypress", "spruce", "fir tree", "hemlock", "juniper", "magnolia", "dogwood", "cherry blossom",
  "apple tree", "orange tree", "lemon tree", "peach tree", "pear tree", "plum tree", "fig tree", "olive tree", "walnut tree", "chestnut tree",
  "coconut palm", "date palm", "banana tree", "bamboo", "eucalyptus", "baobab", "acacia", "mahogany", "teak", "ebony",
  "flower", "rose", "daisy", "sunflower", "tulip", "lily", "orchid", "daffodil", "carnation", "chrysanthemum",
  "peony", "hydrangea", "lavender", "jasmine", "gardenia", "hibiscus", "marigold", "pansy", "petunia", "begonia",
  "geranium", "azalea", "rhododendron", "camellia", "wisteria", "bougainvillea", "clematis", "morning glory", "honeysuckle", "foxglove",
  "snapdragon", "zinnia", "dahlia", "aster", "cosmos", "poppy", "iris", "crocus", "hyacinth", "freesia",
  "lilac", "violet", "bluebell", "buttercup", "clover", "dandelion", "thistle", "goldenrod", "black-eyed susan", "coneflower",
  "lotus", "water lily", "cattail", "bulrush", "reed", "papyrus", "marsh grass", "moss", "lichen", "fern",
  "ivy", "vine", "creeper", "tendril", "hedge", "shrub", "bush", "bramble", "thicket", "undergrowth",
  "grass", "lawn", "meadow", "prairie", "field", "pasture", "hay", "straw", "wheat", "barley",
  "oat", "rye", "rice paddy", "corn stalk", "sugarcane", "cotton plant", "tobacco plant", "tea plant", "coffee plant", "cocoa tree",
  "cactus", "succulent", "aloe vera", "agave", "yucca", "prickly pear", "barrel cactus", "saguaro", "tumbleweed", "desert rose",
  "mushroom cap", "toadstool", "truffle mushroom", "chanterelle", "portobello", "shiitake", "oyster mushroom", "morel", "puffball", "bracket fungus",
  "seaweed", "kelp", "algae", "sea grass", "duckweed", "water hyacinth", "lily pad", "pond weed", "water lettuce", "water fern",
  "herb", "basil", "oregano", "thyme", "rosemary", "sage", "mint", "parsley", "cilantro", "dill",
  "mountain", "volcano", "hill", "valley", "canyon", "cliff", "ravine", "gorge", "mesa", "plateau",
  "river", "stream", "creek", "brook", "waterfall", "rapids", "delta", "estuary", "tributary", "fjord",
  "lake", "pond", "lagoon", "reservoir", "marsh", "swamp", "bog", "wetland", "oasis", "spring",
  "ocean", "sea", "bay", "gulf", "strait", "channel", "cove", "inlet", "harbor", "reef",
  "island", "peninsula", "cape", "archipelago", "atoll", "sandbar", "shoal", "isthmus", "continent", "coastline",
  "beach", "shore", "dune", "sand", "pebble", "boulder", "rock", "stone", "gravel", "cobblestone",
  "cave", "cavern", "grotto", "stalactite", "stalagmite", "sinkhole", "tunnel", "mine shaft", "quarry", "crater",
  "forest", "jungle", "rainforest", "woodland", "grove", "orchard", "thicket", "clearing", "glade", "canopy",
  "desert", "savanna", "tundra", "glacier", "iceberg", "ice cap", "permafrost", "snowfield", "avalanche", "landslide",
  "geyser", "hot spring", "mudflat", "tide pool", "mangrove", "coral reef", "kelp forest", "sea floor", "trench", "abyss",
  "rainbow", "aurora", "sunset", "sunrise", "horizon", "skyline", "constellation", "milky way", "nebula", "shooting star"
];

// Weather & Sky (~100)
const weather = [
  "sun", "moon", "star", "cloud", "rain", "snow", "hail", "sleet", "fog", "mist",
  "thunder", "lightning", "tornado", "hurricane", "cyclone", "typhoon", "blizzard", "sandstorm", "dust devil", "waterspout",
  "rainbow", "halo", "sundog", "mirage", "frost", "dew", "icicle", "snowflake", "raindrop", "puddle",
  "wind", "breeze", "gust", "gale", "storm", "tempest", "squall", "drizzle", "downpour", "shower",
  "cumulus cloud", "thunderhead", "cirrus cloud", "stratus cloud", "fog bank", "smog", "haze", "overcast", "partly cloudy", "clear sky",
  "full moon", "crescent moon", "half moon", "new moon", "eclipse", "lunar eclipse", "solar eclipse", "meteor", "comet", "asteroid",
  "north star", "big dipper", "little dipper", "orion", "venus", "mars", "jupiter", "saturn", "mercury", "neptune",
  "satellite", "space station", "rocket ship", "ufo", "flying saucer", "planet", "rings of saturn", "moon crater", "sunspot", "solar flare",
  "thermometer", "barometer", "weather vane", "anemometer", "rain gauge", "hygrometer", "weather balloon", "doppler radar", "wind sock", "weather map",
  "umbrella", "raincoat", "snow shovel", "ice scraper", "snow plow", "salt truck", "weather forecast", "storm shelter", "lightning rod", "wind turbine"
];

// Body Parts (~100)
const bodyParts = [
  "head", "face", "forehead", "temple", "cheek", "chin", "jaw", "skull", "brain", "scalp",
  "eye", "eyebrow", "eyelash", "eyelid", "pupil", "iris", "retina", "cornea", "tear duct", "eye socket",
  "ear", "earlobe", "ear canal", "eardrum", "nose", "nostril", "nasal bridge", "mouth", "lip", "tongue",
  "tooth", "molar", "canine tooth", "wisdom tooth", "gum", "palate", "uvula", "tonsil", "throat", "adam's apple",
  "neck", "shoulder", "arm", "elbow", "forearm", "wrist", "hand", "palm", "finger", "thumb",
  "fingernail", "knuckle", "fist", "index finger", "pinky finger", "ring finger", "middle finger", "cuticle", "fingerprint", "hangnail",
  "chest", "breast", "rib", "ribcage", "sternum", "collarbone", "shoulder blade", "spine", "backbone", "vertebra",
  "stomach", "belly", "navel", "waist", "hip", "pelvis", "groin", "buttock", "thigh", "leg",
  "knee", "kneecap", "shin", "calf", "ankle", "foot", "heel", "toe", "toenail", "sole",
  "arch", "instep", "achilles tendon", "hamstring", "bicep", "tricep", "muscle", "bone", "joint", "tendon"
];

// Vehicles & Transportation (~150)
const vehicles = [
  "car", "truck", "van", "bus", "taxi", "limousine", "ambulance", "fire truck", "police car", "tow truck",
  "pickup truck", "dump truck", "garbage truck", "cement mixer", "tanker truck", "flatbed truck", "moving van", "ice cream truck", "food truck", "mail truck",
  "motorcycle", "scooter", "moped", "dirt bike", "chopper", "sidecar", "trike", "quad bike", "snowmobile", "jet ski",
  "bicycle", "tricycle", "unicycle", "tandem bicycle", "mountain bike", "road bike", "bmx bike", "recumbent bike", "penny farthing", "rickshaw",
  "skateboard", "longboard", "roller skates", "inline skates", "scooter", "hoverboard", "segway", "electric scooter", "wagon", "wheelbarrow",
  "train", "locomotive", "caboose", "boxcar", "freight train", "passenger train", "subway", "monorail", "trolley", "cable car",
  "airplane", "helicopter", "blimp", "hot air balloon", "glider", "hang glider", "parachute", "jet", "biplane", "seaplane",
  "rocket", "space shuttle", "spacecraft", "satellite dish", "drone", "paraglider", "ultralight", "zeppelin", "propeller plane", "fighter jet",
  "boat", "ship", "sailboat", "yacht", "canoe", "kayak", "raft", "rowboat", "speedboat", "tugboat",
  "ferry", "cruise ship", "submarine", "aircraft carrier", "battleship", "destroyer", "frigate", "houseboat", "pontoon boat", "catamaran",
  "surfboard", "paddleboard", "windsurfer", "water ski", "inner tube", "life raft", "dinghy", "gondola", "barge", "tanker",
  "sled", "toboggan", "bobsled", "dogsled", "sleigh", "ski lift", "gondola lift", "chairlift", "tram", "funicular",
  "horse cart", "stagecoach", "chariot", "covered wagon", "buggy", "carriage", "pedicab", "rickshaw", "sedan chair", "litter",
  "forklift", "bulldozer", "excavator", "crane", "backhoe", "steamroller", "tractor", "combine harvester", "plow", "hay baler",
  "golf cart", "go kart", "bumper car", "dune buggy", "monster truck", "race car", "stock car", "dragster", "formula one car", "rally car"
];

// Buildings & Structures (~200)
const buildings = [
  "house", "apartment", "cabin", "cottage", "mansion", "palace", "castle", "fortress", "chateau", "villa",
  "igloo", "tepee", "yurt", "hut", "shack", "bungalow", "duplex", "townhouse", "penthouse", "condo",
  "skyscraper", "tower", "high rise", "office building", "warehouse", "factory", "mill", "plant", "refinery", "power plant",
  "church", "cathedral", "chapel", "mosque", "temple", "synagogue", "pagoda", "shrine", "monastery", "abbey",
  "school", "university", "library", "museum", "gallery", "theater", "cinema", "opera house", "concert hall", "auditorium",
  "hospital", "clinic", "pharmacy", "dentist office", "veterinary clinic", "nursing home", "hospice", "asylum", "sanatorium", "infirmary",
  "store", "shop", "mall", "market", "bazaar", "boutique", "supermarket", "grocery store", "bakery", "butcher shop",
  "restaurant", "cafe", "diner", "pub", "bar", "tavern", "nightclub", "bistro", "pizzeria", "food court",
  "hotel", "motel", "inn", "hostel", "resort", "lodge", "bed and breakfast", "campground", "trailer park", "vacation home",
  "bank", "post office", "courthouse", "city hall", "capitol building", "embassy", "consulate", "parliament", "white house", "pentagon",
  "prison", "jail", "police station", "fire station", "military base", "barracks", "bunker", "guard tower", "watchtower", "lookout tower",
  "bridge", "overpass", "underpass", "tunnel", "aqueduct", "dam", "levee", "pier", "dock", "wharf",
  "lighthouse", "windmill", "water tower", "clock tower", "bell tower", "minaret", "steeple", "spire", "dome", "cupola",
  "barn", "silo", "stable", "corral", "chicken coop", "doghouse", "greenhouse", "shed", "garage", "carport",
  "stadium", "arena", "colosseum", "amphitheater", "gymnasium", "swimming pool", "ice rink", "bowling alley", "tennis court", "basketball court",
  "airport", "train station", "bus station", "subway station", "harbor", "marina", "helipad", "runway", "control tower", "hangar",
  "fountain", "statue", "monument", "obelisk", "arch", "column", "pillar", "pyramid", "sphinx", "totem pole",
  "fence", "gate", "wall", "hedge", "railing", "guardrail", "barricade", "bollard", "turnstile", "drawbridge",
  "chimney", "smokestack", "antenna", "flagpole", "billboard", "signpost", "street sign", "traffic light", "street lamp", "fire hydrant",
  "gazebo", "pergola", "pavilion", "bandstand", "kiosk", "booth", "tent", "canopy", "awning", "marquee"
];

// Tools & Hardware (~200)
const tools = [
  "hammer", "screwdriver", "wrench", "pliers", "saw", "drill", "level", "tape measure", "ruler", "square",
  "nail", "screw", "bolt", "nut", "washer", "rivet", "staple", "pin", "tack", "brad",
  "handsaw", "hacksaw", "circular saw", "jigsaw", "band saw", "table saw", "chainsaw", "miter saw", "coping saw", "scroll saw",
  "chisel", "plane", "rasp", "file", "sandpaper", "sanding block", "grinder", "polisher", "buffer", "router",
  "axe", "hatchet", "maul", "sledgehammer", "pickaxe", "mattock", "crowbar", "pry bar", "wrecking bar", "nail puller",
  "clamp", "vise", "vice grip", "locking pliers", "needle nose pliers", "channel lock", "wire cutter", "wire stripper", "crimper", "soldering iron",
  "socket wrench", "allen wrench", "pipe wrench", "torque wrench", "adjustable wrench", "box wrench", "open end wrench", "ratchet", "socket set", "impact driver",
  "shovel", "spade", "rake", "hoe", "pitchfork", "trowel", "garden fork", "pruner", "hedge trimmer", "lawn mower",
  "wheelbarrow", "garden hose", "sprinkler", "watering can", "rain barrel", "compost bin", "leaf blower", "weed whacker", "edger", "post hole digger",
  "paintbrush", "paint roller", "paint tray", "paint bucket", "putty knife", "scraper", "caulk gun", "spray gun", "airbrush", "stencil",
  "ladder", "scaffolding", "jack", "car jack", "hydraulic jack", "bottle jack", "scissor jack", "jack stand", "creeper", "dolly",
  "toolbox", "tool belt", "tool chest", "pegboard", "magnetic strip", "utility knife", "box cutter", "razor blade", "scissors", "shears",
  "welding torch", "welding mask", "blowtorch", "heat gun", "glue gun", "staple gun", "nail gun", "rivet gun", "caulking gun", "grease gun",
  "multimeter", "voltage tester", "stud finder", "wire gauge", "caliper", "micrometer", "protractor", "compass", "plumb bob", "chalk line",
  "bench grinder", "belt sander", "orbital sander", "power drill", "hammer drill", "rotary tool", "oscillating tool", "reciprocating saw", "angle grinder", "die grinder",
  "pipe cutter", "tube bender", "flaring tool", "tap and die", "thread gauge", "deburring tool", "reamer", "countersink", "drill bit", "hole saw",
  "cleat", "bracket", "hinge", "latch", "hasp", "hook", "eye bolt", "turnbuckle", "shackle", "carabiner",
  "rope", "chain", "cable", "wire", "twine", "cord", "bungee cord", "zip tie", "duct tape", "electrical tape",
  "sandpaper", "steel wool", "wire brush", "bristle brush", "dust brush", "shop vac", "air compressor", "pressure washer", "generator", "welder",
  "sawhorse", "workbench", "clamp", "bench vise", "anvil", "forge", "bellows", "quenching tank", "grinding wheel", "whetstone"
];

// Musical Instruments (~80)
const instruments = [
  "guitar", "bass guitar", "electric guitar", "acoustic guitar", "ukulele", "banjo", "mandolin", "sitar", "lute", "harp",
  "violin", "viola", "cello", "double bass", "fiddle", "zither", "dulcimer", "balalaika", "bouzouki", "erhu",
  "piano", "keyboard", "organ", "harpsichord", "accordion", "concertina", "melodica", "synthesizer", "keytar", "celesta",
  "drum", "snare drum", "bass drum", "tom tom", "bongo", "conga", "djembe", "timpani", "tambourine", "cymbal",
  "xylophone", "marimba", "vibraphone", "glockenspiel", "steel drum", "hand drum", "cajon", "cowbell", "triangle", "gong",
  "flute", "piccolo", "clarinet", "oboe", "bassoon", "recorder", "fife", "pan flute", "ocarina", "harmonica",
  "trumpet", "trombone", "french horn", "tuba", "cornet", "bugle", "flugelhorn", "sousaphone", "euphonium", "didgeridoo",
  "saxophone", "bagpipe", "kazoo", "slide whistle", "vuvuzela", "whistle", "jaw harp", "kalimba", "music box", "turntable"
];

// Sports & Games (~150)
const sports = [
  "baseball", "basketball", "football", "soccer ball", "tennis ball", "golf ball", "volleyball", "bowling ball", "rugby ball", "cricket ball",
  "baseball bat", "tennis racket", "golf club", "hockey stick", "lacrosse stick", "badminton racket", "ping pong paddle", "cricket bat", "polo mallet", "field hockey stick",
  "baseball glove", "boxing glove", "goalkeeper glove", "batting helmet", "football helmet", "hockey helmet", "ski helmet", "bike helmet", "riding helmet", "fencing mask",
  "basketball hoop", "soccer goal", "football goalpost", "tennis net", "volleyball net", "badminton net", "hockey net", "ping pong table", "pool table", "foosball table",
  "dartboard", "dart", "archery target", "bullseye", "scoreboard", "stopwatch", "whistle", "referee", "trophy", "medal",
  "chess board", "chess piece", "checkerboard", "backgammon", "dominoes", "dice", "playing cards", "poker chip", "roulette wheel", "slot machine",
  "surfboard", "snowboard", "skateboard", "wakeboard", "kiteboard", "bodyboard", "skimboard", "longboard", "penny board", "cruiser board",
  "ski", "ski pole", "ski boot", "snowshoe", "ice skate", "roller skate", "inline skate", "figure skate", "hockey skate", "speed skate",
  "fishing rod", "fishing reel", "fishing hook", "fishing net", "tackle box", "lure", "bobber", "fly rod", "fishing line", "sinker",
  "boxing ring", "punching bag", "speed bag", "jump rope", "resistance band", "dumbbell", "barbell", "kettlebell", "weight bench", "treadmill",
  "exercise bike", "elliptical", "rowing machine", "pull up bar", "medicine ball", "yoga ball", "foam roller", "balance beam", "parallel bars", "pommel horse",
  "trampoline", "diving board", "swimming lane", "swim goggles", "swim cap", "snorkel", "scuba tank", "flipper", "wetsuit top", "kickboard",
  "parachute", "hang glider", "paraglider", "climbing rope", "carabiner", "harness", "crampon", "ice axe", "piton", "chalk bag",
  "horseshoe", "frisbee", "boomerang", "kite", "yo-yo", "hula hoop", "pogo stick", "stilts", "slingshot", "catapult",
  "croquet mallet", "bocce ball", "shuffleboard", "cornhole board", "bean bag toss", "horseshoe pit", "tetherball", "hopscotch", "four square", "dodgeball"
];

// Professions & People (~250)
const professions = [
  "doctor", "nurse", "surgeon", "dentist", "pharmacist", "paramedic", "veterinarian", "therapist", "optometrist", "radiologist",
  "teacher", "professor", "principal", "tutor", "librarian", "counselor", "dean", "superintendent", "coach", "instructor",
  "chef", "cook", "baker", "butcher", "waiter", "waitress", "bartender", "barista", "sommelier", "caterer",
  "firefighter", "police officer", "detective", "sheriff", "marshal", "ranger", "lifeguard", "security guard", "bodyguard", "bouncer",
  "soldier", "sailor", "marine", "pilot", "navigator", "captain", "admiral", "general", "sergeant", "corporal",
  "farmer", "rancher", "fisherman", "lumberjack", "miner", "cowboy", "shepherd", "beekeeper", "gardener", "florist",
  "carpenter", "plumber", "electrician", "mechanic", "welder", "mason", "roofer", "painter", "glazier", "locksmith",
  "lawyer", "judge", "paralegal", "notary", "bailiff", "prosecutor", "attorney", "solicitor", "barrister", "magistrate",
  "artist", "sculptor", "painter", "photographer", "filmmaker", "animator", "illustrator", "graphic designer", "architect", "interior designer",
  "musician", "singer", "drummer", "guitarist", "pianist", "violinist", "conductor", "composer", "disc jockey", "sound engineer",
  "actor", "actress", "director", "producer", "screenwriter", "stunt double", "choreographer", "dancer", "ballerina", "mime",
  "writer", "author", "journalist", "reporter", "editor", "publisher", "blogger", "poet", "novelist", "columnist",
  "scientist", "chemist", "physicist", "biologist", "geologist", "astronomer", "archaeologist", "anthropologist", "meteorologist", "botanist",
  "engineer", "programmer", "developer", "data scientist", "systems analyst", "network admin", "web designer", "game designer", "roboticist", "inventor",
  "businessman", "accountant", "banker", "broker", "trader", "economist", "consultant", "manager", "executive", "entrepreneur",
  "salesperson", "realtor", "auctioneer", "cashier", "clerk", "receptionist", "secretary", "assistant", "intern", "volunteer",
  "truck driver", "bus driver", "taxi driver", "delivery driver", "chauffeur", "train conductor", "flight attendant", "air traffic controller", "ship captain", "harbor pilot",
  "clown", "magician", "juggler", "acrobat", "trapeze artist", "ringmaster", "fortune teller", "street performer", "ventriloquist", "puppeteer",
  "king", "queen", "prince", "princess", "knight", "jester", "wizard", "witch", "pirate", "ninja",
  "astronaut", "diver", "explorer", "mountaineer", "spelunker", "archaeologist", "paleontologist", "zoologist", "marine biologist", "ecologist",
  "monk", "nun", "priest", "bishop", "pope", "rabbi", "imam", "shaman", "druid", "oracle",
  "baby", "toddler", "child", "teenager", "adult", "elderly person", "bride", "groom", "grandmother", "grandfather",
  "cheerleader", "mascot", "referee", "umpire", "announcer", "commentator", "sports fan", "spectator", "audience", "crowd",
  "superhero", "villain", "sidekick", "spy", "samurai", "gladiator", "viking", "pharaoh", "emperor", "sultan",
  "scarecrow", "snowman", "mummy", "zombie", "vampire", "werewolf", "ghost", "skeleton", "robot", "alien"
];

// Technology & Electronics (~200)
const technology = [
  "computer", "laptop", "desktop", "tablet", "smartphone", "cell phone", "flip phone", "smartwatch", "fitness tracker", "pager",
  "monitor", "screen", "display", "projector", "touchscreen", "lcd screen", "led screen", "plasma screen", "curved monitor", "dual monitor",
  "keyboard", "mouse", "trackpad", "joystick", "game controller", "steering wheel", "flight stick", "trackball", "stylus", "graphics tablet",
  "printer", "scanner", "copier", "fax machine", "shredder", "laminator", "label maker", "paper cutter", "hole punch", "stapler",
  "camera", "video camera", "webcam", "security camera", "dash cam", "action camera", "film camera", "polaroid", "disposable camera", "camera lens",
  "television", "remote control", "cable box", "dvd player", "blu-ray player", "vcr", "streaming stick", "antenna", "dish", "set-top box",
  "speaker", "headphones", "earbuds", "microphone", "amplifier", "subwoofer", "soundbar", "record player", "turntable", "cassette player",
  "radio", "walkie talkie", "cb radio", "ham radio", "transistor radio", "boombox", "stereo", "receiver", "tuner", "equalizer",
  "battery", "charger", "power bank", "solar panel", "generator", "transformer", "inverter", "voltage regulator", "ups", "power supply",
  "usb drive", "hard drive", "ssd", "memory card", "cd", "dvd", "floppy disk", "tape drive", "flash drive", "external hard drive",
  "router", "modem", "switch", "hub", "access point", "ethernet cable", "fiber optic cable", "coaxial cable", "hdmi cable", "usb cable",
  "server", "rack", "data center", "mainframe", "supercomputer", "raspberry pi", "arduino", "circuit board", "motherboard", "graphics card",
  "chip", "processor", "ram stick", "heat sink", "cooling fan", "power cord", "adapter", "dongle", "splitter", "converter",
  "calculator", "cash register", "barcode scanner", "pos terminal", "atm", "vending machine", "jukebox", "arcade machine", "pinball machine", "claw machine",
  "gps device", "radar detector", "metal detector", "geiger counter", "oscilloscope", "spectrum analyzer", "logic analyzer", "signal generator", "multimeter", "voltmeter",
  "robot", "robotic arm", "drone", "3d printer", "cnc machine", "laser cutter", "soldering station", "oscillating fan", "desoldering pump", "heat gun",
  "vr headset", "ar glasses", "smart speaker", "smart thermostat", "smart lock", "smart plug", "smart bulb", "smart doorbell", "smart fridge", "smart mirror",
  "satellite", "telescope", "microscope", "binoculars", "magnifying glass", "periscope", "night vision goggles", "thermal camera", "x-ray machine", "mri machine",
  "traffic camera", "speed camera", "body camera", "ring light", "studio light", "strobe light", "laser pointer", "led strip", "neon sign", "digital clock",
  "smoke machine", "fog machine", "bubble machine", "snow machine", "popcorn machine", "cotton candy machine", "slushy machine", "soft serve machine", "espresso machine", "bread maker"
];

// Kitchen Items (~150) - many already in household, adding more specific ones
const kitchenItems = [
  "measuring cup", "measuring spoon", "mixing bowl", "salad bowl", "soup bowl", "cereal bowl", "rice bowl", "ramekin", "souffle dish", "casserole dish",
  "cookie sheet", "baking pan", "bundt pan", "springform pan", "loaf pan", "pizza stone", "pizza peel", "pizza cutter", "pastry brush", "pastry bag",
  "cookie cutter", "biscuit cutter", "melon baller", "apple corer", "cherry pitter", "egg slicer", "mandoline", "spiralizer", "juicer", "citrus reamer",
  "meat thermometer", "candy thermometer", "kitchen scale", "kitchen timer", "egg timer", "hourglass timer", "oven thermometer", "probe thermometer", "instant read thermometer", "meat probe",
  "ice cube tray", "popsicle mold", "candy mold", "chocolate mold", "silicone mold", "gelatin mold", "jello mold", "pudding mold", "ice cream scoop", "melon scoop",
  "cheese grater", "zester", "microplane", "box grater", "rotary grater", "potato masher", "potato ricer", "food mill", "mortar and pestle", "spice grinder",
  "corkscrew", "wine opener", "bottle stopper", "wine aerator", "decanter", "carafe", "pitcher", "water pitcher", "lemonade pitcher", "punch bowl",
  "tea infuser", "tea strainer", "coffee filter", "pour over", "aeropress", "moka pot", "percolator", "cold brew maker", "milk frother", "tea ball",
  "dish towel", "dish cloth", "scrub brush", "dish sponge", "steel wool pad", "dish soap", "drying mat", "dish drainer", "utensil holder", "knife block",
  "pepper grinder", "salt cellar", "oil cruet", "vinegar bottle", "soy sauce dish", "wasabi dish", "dipping bowl", "condiment tray", "lazy susan", "turntable",
  "wax paper", "parchment paper", "aluminum foil", "plastic wrap", "freezer bag", "sandwich bag", "vacuum sealer", "food storage container", "mason jar", "canning jar",
  "paper towel holder", "paper towel", "napkin holder", "toothpick holder", "straw dispenser", "sugar dispenser", "soap dispenser", "sponge holder", "sink strainer", "drain plug",
  "bread knife", "carving knife", "cleaver", "paring knife", "chef knife", "santoku knife", "fillet knife", "boning knife", "utility knife", "bread slicer",
  "vegetable peeler", "potato peeler", "julienne peeler", "y-peeler", "swivel peeler", "garlic crusher", "ginger grater", "corn stripper", "herb stripper", "avocado slicer",
  "egg cup", "egg poacher", "egg ring", "omelet pan", "crepe pan", "pancake griddle", "waffle maker", "donut maker", "sandwich press", "panini press"
];

// Toys & Games (~100)
const toys = [
  "doll", "teddy bear", "action figure", "toy soldier", "toy car", "toy truck", "toy train", "toy airplane", "toy boat", "toy robot",
  "building blocks", "lego", "lincoln logs", "tinker toys", "erector set", "model kit", "puzzle", "jigsaw puzzle", "rubik's cube", "tangram",
  "board game", "card game", "video game", "pinball machine", "arcade game", "slot machine", "claw machine", "whack-a-mole", "air hockey", "foosball",
  "yo-yo", "spinning top", "hula hoop", "jump rope", "pogo stick", "stilts", "slinky", "frisbee", "boomerang", "kite",
  "water gun", "nerf gun", "cap gun", "bb gun", "paintball gun", "laser tag", "toy sword", "toy shield", "toy crown", "toy wand",
  "puppet", "hand puppet", "finger puppet", "marionette", "ventriloquist dummy", "sock puppet", "paper doll", "paper airplane", "origami crane", "paper boat",
  "balloon", "bubble wand", "kaleidoscope", "viewmaster", "magic eight ball", "snow globe", "jack in the box", "wind up toy", "pull toy", "push toy",
  "rattle", "teething ring", "pacifier", "mobile", "play mat", "ball pit", "bouncy house", "swing set", "slide", "jungle gym",
  "sandbox", "sand castle", "bucket and shovel", "beach ball", "pool float", "pool noodle", "inflatable pool", "kiddie pool", "water slide", "sprinkler",
  "wagon", "tricycle", "balance bike", "training wheels", "scooter", "roller coaster", "merry-go-round", "ferris wheel", "bumper car", "carousel"
];

// School & Office Supplies (~150)
const schoolSupplies = [
  "pencil", "pen", "marker", "crayon", "colored pencil", "highlighter", "chalk", "dry erase marker", "fountain pen", "quill",
  "eraser", "pencil sharpener", "pencil case", "pen holder", "ink bottle", "ink cartridge", "blotter", "correction tape", "white out", "correction fluid",
  "notebook", "binder", "folder", "portfolio", "planner", "journal", "diary", "ledger", "composition book", "spiral notebook",
  "paper", "lined paper", "graph paper", "construction paper", "cardstock", "tissue paper", "carbon paper", "tracing paper", "origami paper", "crepe paper",
  "ruler", "protractor", "compass", "triangle", "t-square", "french curve", "stencil", "template", "grid", "graph",
  "scissors", "tape", "glue", "glue stick", "paste", "rubber cement", "epoxy", "super glue", "hot glue", "double sided tape",
  "stapler", "paper clip", "binder clip", "push pin", "thumbtack", "rubber band", "fastener", "grommet", "eyelet", "brad fastener",
  "calculator", "abacus", "slide rule", "globe", "atlas", "encyclopedia", "dictionary", "textbook", "workbook", "flash card",
  "backpack", "book bag", "messenger bag", "pencil pouch", "lunch box", "lunch bag", "thermos", "water bottle", "lanyard", "id badge",
  "desk organizer", "inbox tray", "outbox tray", "file folder", "hanging folder", "file cabinet", "label", "index card", "divider tab", "sheet protector",
  "whiteboard", "chalkboard", "bulletin board", "cork board", "dry erase board", "easel pad", "flip chart", "poster board", "presentation board", "trifold board",
  "stamp", "stamp pad", "ink pad", "wax seal", "embosser", "letter opener", "mail sorter", "envelope", "postcard", "letterhead",
  "clipboard", "name plate", "desk calendar", "wall calendar", "day planner", "sticky note", "memo pad", "legal pad", "scratch pad", "post-it note",
  "magnifying glass", "bookmarks", "page flag", "reading light", "book stand", "book end", "document holder", "copy stand", "monitor stand", "laptop stand",
  "typewriter", "adding machine", "receipt book", "check book", "deposit slip", "business card", "rolodex", "address book", "phone book", "directory"
];

// Bathroom Items (~80)
const bathroomItems = [
  "bathtub", "shower", "shower head", "faucet", "sink", "toilet", "bidet", "urinal", "drain", "stopper",
  "towel", "bath towel", "hand towel", "washcloth", "loofah", "sponge", "bath brush", "back scrubber", "pumice stone", "bath bomb",
  "soap", "soap dish", "soap dispenser", "shampoo", "conditioner", "body wash", "bubble bath", "bath salt", "shower gel", "face wash",
  "toothbrush", "toothpaste", "dental floss", "mouthwash", "tongue scraper", "water pick", "electric toothbrush", "toothbrush holder", "dentures", "retainer",
  "razor", "shaving cream", "aftershave", "electric razor", "straight razor", "razor blade", "shaving brush", "styptic pencil", "tweezers", "nail clipper",
  "hair dryer", "curling iron", "flat iron", "hair brush", "comb", "hair pick", "hair roller", "bobby pin", "hair tie", "scrunchie",
  "mirror", "vanity mirror", "magnifying mirror", "medicine cabinet", "bathroom scale", "toilet paper", "tissue box", "cotton ball", "cotton swab", "q-tip",
  "deodorant", "perfume", "cologne", "lotion", "sunscreen", "moisturizer", "lip balm", "makeup", "mascara", "lipstick"
];

// Garden & Outdoor (~150)
const garden = [
  "flower pot", "planter", "raised bed", "garden bed", "window box", "hanging basket", "plant hanger", "trellis", "arbor", "pergola",
  "lawn mower", "weed trimmer", "leaf blower", "hedge clipper", "pruning shears", "loppers", "garden saw", "pole saw", "tree trimmer", "branch cutter",
  "garden hose", "sprinkler", "drip line", "soaker hose", "hose reel", "hose nozzle", "watering wand", "rain barrel", "irrigation pipe", "garden timer",
  "shovel", "spade", "garden fork", "hand trowel", "cultivator", "weeder", "dibble", "bulb planter", "soil scoop", "transplanter",
  "rake", "leaf rake", "garden rake", "bow rake", "thatch rake", "landscape rake", "hay fork", "manure fork", "compost fork", "broadfork",
  "wheelbarrow", "garden cart", "utility cart", "dump cart", "yard wagon", "plant dolly", "pot mover", "hand truck", "garden kneeler", "kneeling pad",
  "bird feeder", "bird house", "bird bath", "squirrel feeder", "hummingbird feeder", "suet feeder", "nesting box", "bat house", "bee hotel", "butterfly house",
  "garden gnome", "lawn ornament", "garden statue", "sundial", "gazing ball", "stepping stone", "garden path", "flagstone", "paver", "landscape rock",
  "fence post", "picket fence", "chain link fence", "privacy fence", "garden gate", "lattice panel", "fence panel", "post cap", "fence wire", "garden border",
  "fire pit", "chiminea", "outdoor grill", "barbecue", "smoker", "charcoal grill", "gas grill", "hibachi", "fire ring", "campfire",
  "patio chair", "patio table", "patio umbrella", "sun shade", "outdoor rug", "outdoor cushion", "hammock stand", "porch swing", "adirondack chair", "outdoor sofa",
  "pool", "hot tub", "above ground pool", "pool ladder", "pool pump", "pool filter", "pool cover", "pool skimmer", "pool float", "diving board",
  "mailbox", "house number", "welcome sign", "address plaque", "porch light", "path light", "solar light", "landscape light", "flood light", "motion light",
  "dog house", "dog run", "pet door", "invisible fence", "dog tie out", "pet fountain", "outdoor cat house", "rabbit hutch", "chicken run", "beehive",
  "compost bin", "rain gauge", "outdoor thermometer", "wind chime", "flag", "flagpole", "banner", "windsock", "pinwheel", "garden spinner"
];

// Weapons & Medieval (~100)
const weapons = [
  "sword", "dagger", "knife", "katana", "rapier", "broadsword", "claymore", "scimitar", "saber", "machete",
  "axe", "battle axe", "tomahawk", "halberd", "pike", "spear", "javelin", "lance", "trident", "pitchfork",
  "bow", "arrow", "crossbow", "quiver", "longbow", "compound bow", "recurve bow", "slingshot", "blowgun", "dart",
  "shield", "buckler", "round shield", "tower shield", "armor", "chain mail", "plate armor", "helmet", "gauntlet", "breastplate",
  "cannon", "catapult", "trebuchet", "battering ram", "siege tower", "ballista", "mortar", "bomb", "grenade", "dynamite",
  "gun", "rifle", "shotgun", "pistol", "revolver", "musket", "flintlock", "blunderbuss", "cannon ball", "bullet",
  "mace", "flail", "war hammer", "morning star", "club", "baton", "staff", "bo staff", "nunchucks", "throwing star",
  "whip", "lasso", "bolas", "net", "bear trap", "snare", "tripwire", "barbed wire", "land mine", "torpedo",
  "holster", "scabbard", "sheath", "bandolier", "ammo belt", "powder horn", "ramrod", "bayonet", "brass knuckles", "switchblade",
  "crown", "throne", "scepter", "orb", "coat of arms", "banner", "flag", "pennant", "crest", "heraldry"
];

// Fantasy & Mythology Creatures (~100)
const fantasy = [
  "dragon", "unicorn", "phoenix", "griffin", "pegasus", "centaur", "minotaur", "medusa", "cyclops", "hydra",
  "mermaid", "merman", "siren", "kraken", "leviathan", "sea serpent", "loch ness monster", "selkie", "kelpie", "charybdis",
  "fairy", "pixie", "sprite", "nymph", "dryad", "elf", "dwarf", "gnome", "goblin", "hobbit",
  "troll", "ogre", "giant", "titan", "golem", "gargoyle", "gorgon", "harpy", "banshee", "wraith",
  "werewolf", "vampire", "zombie", "mummy", "ghost", "phantom", "specter", "poltergeist", "demon", "imp",
  "angel", "cherub", "seraph", "archangel", "cupid", "grim reaper", "death", "fate", "muse", "oracle",
  "wizard", "witch", "warlock", "sorcerer", "enchantress", "necromancer", "alchemist", "druid", "shaman", "sage",
  "yeti", "bigfoot", "sasquatch", "chupacabra", "mothman", "thunderbird", "jackalope", "jersey devil", "wendigo", "skinwalker",
  "chimera", "manticore", "basilisk", "cockatrice", "wyvern", "drake", "wyrm", "salamander", "thunderbird", "roc",
  "leprechaun", "brownie", "changeling", "will-o-wisp", "djinn", "genie", "ifrit", "rakshasa", "yokai", "tengu"
];

// Shapes & Symbols (~80)
const shapes = [
  "circle", "square", "triangle", "rectangle", "oval", "diamond", "pentagon", "hexagon", "octagon", "star",
  "heart", "crescent", "cross", "arrow", "spiral", "helix", "infinity symbol", "peace sign", "yin yang", "ankh",
  "sphere", "cube", "cylinder", "cone", "pyramid shape", "prism", "torus", "tetrahedron", "dodecahedron", "icosahedron",
  "checkmark", "x mark", "question mark", "exclamation mark", "ampersand", "at sign", "hashtag", "dollar sign", "percent sign", "asterisk",
  "plus sign", "minus sign", "equals sign", "greater than", "less than", "parenthesis", "bracket", "curly brace", "slash", "backslash",
  "smiley face", "frown face", "skull and crossbones", "radioactive symbol", "biohazard symbol", "recycling symbol", "caduceus", "fleur de lis", "treble clef", "bass clef",
  "musical note", "double note", "sharp sign", "flat sign", "crescendo", "decrescendo", "fermata", "rest note", "time signature", "key signature",
  "crown symbol", "shield shape", "badge shape", "ribbon", "medal shape", "trophy shape", "laurel wreath", "olive branch", "caduceus staff", "rod of asclepius"
];

// Art & Craft Supplies (~100)
const artSupplies = [
  "paintbrush", "paint palette", "paint tube", "easel", "canvas", "sketch pad", "drawing paper", "watercolor paper", "charcoal stick", "graphite pencil",
  "oil paint", "acrylic paint", "watercolor", "tempera paint", "spray paint", "finger paint", "face paint", "fabric paint", "glass paint", "enamel paint",
  "colored pencil", "pastel", "oil pastel", "chalk pastel", "conte crayon", "charcoal pencil", "blending stump", "tortillon", "fixative spray", "gesso",
  "ink pen", "dip pen", "calligraphy pen", "brush pen", "felt tip pen", "gel pen", "ballpoint pen", "rollerball pen", "technical pen", "glass pen",
  "glitter", "sequin", "bead", "button", "ribbon", "yarn", "thread", "embroidery floss", "needle", "thimble",
  "sewing machine", "bobbin", "spool", "pin cushion", "seam ripper", "rotary cutter", "cutting mat", "pattern", "fabric scissors", "pinking shears",
  "knitting needle", "crochet hook", "loom", "spinning wheel", "drop spindle", "felting needle", "tapestry needle", "darning needle", "quilting hoop", "embroidery hoop",
  "pottery wheel", "kiln", "clay", "sculpting tool", "wire armature", "plaster mold", "slip", "glaze", "bisque", "ceramic tile",
  "wood carving tool", "linoleum cutter", "printing press", "brayer", "ink roller", "block print", "screen print", "stencil", "stamp", "rubber stamp",
  "mod podge", "decoupage", "papier mache", "tissue paper", "crepe paper", "contact paper", "washi tape", "masking tape", "painters tape", "craft knife"
];

// Medical Items (~100)
const medicalItems = [
  "stethoscope", "blood pressure cuff", "thermometer", "otoscope", "ophthalmoscope", "reflex hammer", "tongue depressor", "pulse oximeter", "heart monitor", "ekg machine",
  "syringe", "needle", "iv bag", "iv drip", "catheter", "scalpel", "forceps", "surgical scissors", "retractor", "clamp",
  "bandage", "gauze", "medical tape", "band-aid", "ace bandage", "tourniquet", "splint", "sling", "cast", "brace",
  "wheelchair", "crutch", "walker", "cane", "prosthetic", "hearing aid", "cochlear implant", "pacemaker", "defibrillator", "ventilator",
  "hospital bed", "gurney", "stretcher", "operating table", "examination table", "iv stand", "bedpan", "emesis basin", "specimen cup", "test tube",
  "microscope", "petri dish", "centrifuge", "pipette", "beaker", "flask", "graduated cylinder", "bunsen burner", "test tube rack", "lab coat",
  "face mask", "surgical mask", "n95 mask", "face shield", "latex glove", "surgical gown", "hair net", "shoe cover", "goggles", "safety glasses",
  "pill", "capsule", "tablet", "medicine bottle", "prescription pad", "pill box", "pill cutter", "mortar and pestle", "medicine dropper", "inhaler",
  "x-ray", "mri scan", "ct scan", "ultrasound", "ecg", "eeg", "mammogram", "dexa scan", "pet scan", "blood test",
  "first aid kit", "ice pack", "heating pad", "hot water bottle", "epinephrine pen", "insulin pen", "glucose meter", "oxygen tank", "nebulizer", "cpap machine"
];

// Containers (~80)
const containers = [
  "box", "crate", "chest", "trunk", "barrel", "keg", "drum", "tank", "cistern", "vat",
  "jar", "bottle", "jug", "canteen", "flask", "vial", "ampule", "test tube", "beaker", "carafe",
  "can", "tin", "bucket", "pail", "tub", "basin", "bowl", "pot", "cauldron", "crucible",
  "bag", "sack", "pouch", "purse", "wallet", "envelope", "packet", "parcel", "package", "bundle",
  "basket", "hamper", "pannier", "bushel", "cask", "hogshead", "carton", "case", "container", "bin",
  "drawer", "cabinet", "cupboard", "locker", "safe", "vault", "strongbox", "lockbox", "cash box", "deed box",
  "suitcase", "briefcase", "attaché case", "carry-on", "footlocker", "steamer trunk", "hat box", "cigar box", "tackle box", "tool box",
  "trash bag", "garbage bag", "grocery bag", "paper bag", "shopping bag", "gift bag", "gift box", "shipping box", "moving box", "storage bin"
];

// Fabrics & Materials (~80)
const fabrics = [
  "cotton", "silk", "wool", "linen", "denim", "leather", "suede", "velvet", "satin", "chiffon",
  "polyester", "nylon", "spandex", "rayon", "acrylic", "fleece", "flannel", "corduroy", "tweed", "cashmere",
  "burlap", "canvas", "muslin", "gauze", "cheesecloth", "felt", "organza", "tulle", "taffeta", "brocade",
  "lace", "crochet", "knit", "woven", "embroidery", "tapestry", "quilt", "patchwork", "applique", "cross stitch",
  "wood", "plywood", "particleboard", "mdf", "hardwood", "softwood", "lumber", "timber", "log", "plank",
  "metal", "steel", "iron", "copper", "brass", "bronze", "aluminum", "tin", "gold", "silver",
  "glass", "crystal", "porcelain", "ceramic", "terracotta", "stoneware", "earthenware", "bone china", "fiberglass", "plexiglass",
  "rubber", "silicone", "plastic", "foam", "styrofoam", "cardboard", "paperboard", "corrugated", "wax", "paraffin"
];

// Jewelry (~50)
const jewelry = [
  "ring", "engagement ring", "wedding ring", "class ring", "signet ring", "mood ring", "toe ring", "nose ring", "belly ring", "thumb ring",
  "necklace", "pendant", "choker", "chain", "locket", "medallion", "charm", "amulet", "talisman", "rosary",
  "bracelet", "bangle", "cuff", "charm bracelet", "friendship bracelet", "tennis bracelet", "link bracelet", "beaded bracelet", "leather bracelet", "wristwatch",
  "earring", "stud earring", "hoop earring", "drop earring", "chandelier earring", "clip-on earring", "ear cuff", "ear stud", "pearl earring", "diamond earring",
  "brooch", "pin", "cufflink", "tie pin", "tie clip", "lapel pin", "cameo", "fibula", "anklet", "body chain"
];

// Misc Common Nouns
const misc = [
  "fire", "smoke", "flame", "ember", "ash", "spark", "bonfire", "campfire", "firework", "explosion",
  "water", "ice", "steam", "bubble", "wave", "splash", "ripple", "whirlpool", "geyser", "fountain",
  "earth", "soil", "mud", "clay", "sand", "dust", "gravel", "pebble", "stone", "boulder",
  "air", "wind", "breeze", "tornado", "hurricane", "whirlwind", "cyclone", "vortex", "draft", "gust",
  "light", "shadow", "darkness", "glow", "beam", "ray", "prism", "spectrum", "reflection", "refraction",
  "sound", "echo", "vibration", "resonance", "harmony", "melody", "rhythm", "beat", "tempo", "pitch",
  "time", "clock face", "calendar page", "hourglass timer", "sundial face", "wristwatch face", "pocket watch face", "alarm", "countdown", "stopwatch face",
  "map", "compass rose", "treasure map", "world map", "road map", "star chart", "blueprint", "floor plan", "schematic", "diagram",
  "flag", "banner", "pennant", "streamer", "bunting", "garland", "wreath", "lei", "corsage", "boutonniere",
  "mask", "costume", "disguise", "wig", "fake mustache", "clown nose", "face paint", "body paint", "tattoo", "henna",
  "trophy", "medal", "ribbon", "award", "certificate", "diploma", "plaque", "badge", "star badge", "shield badge",
  "coin", "bill", "check", "credit card", "money", "piggy bank", "wallet", "safe", "vault door", "treasure chest",
  "ticket", "coupon", "gift card", "postage stamp", "passport", "license", "permit", "visa", "boarding pass", "receipt",
  "book", "magazine", "newspaper", "comic book", "graphic novel", "manga", "pamphlet", "brochure", "catalog", "menu",
  "letter", "postcard", "greeting card", "invitation", "thank you card", "birthday card", "valentine", "love letter", "note", "memo",
  "sign", "placard", "billboard", "marquee", "neon sign", "exit sign", "stop sign", "yield sign", "speed limit sign", "no parking sign",
  "road", "highway", "intersection", "roundabout", "cul-de-sac", "alley", "lane", "path", "trail", "sidewalk",
  "crosswalk", "speed bump", "pothole", "manhole", "storm drain", "curb", "gutter", "median", "shoulder", "overpass",
  "parking lot", "parking meter", "parking garage", "toll booth", "gas station", "car wash", "drive through", "loading dock", "bus stop", "taxi stand",
  "playground", "sandbox", "swing", "slide", "see-saw", "monkey bars", "merry-go-round", "jungle gym", "climbing wall", "zip line",
  "park", "garden", "courtyard", "plaza", "square", "promenade", "boardwalk", "pier", "dock", "marina",
  "cemetery", "tombstone", "gravestone", "mausoleum", "crypt", "coffin", "casket", "urn", "memorial", "headstone",
  "circus", "carnival", "fair", "amusement park", "theme park", "roller coaster", "ferris wheel", "carousel", "bumper car", "haunted house",
  "zoo", "aquarium", "terrarium", "vivarium", "aviary", "butterfly garden", "petting zoo", "wildlife reserve", "nature preserve", "botanical garden",
  "beach", "shoreline", "tide pool", "sand dune", "seashell", "sand castle", "driftwood", "sea glass", "coral piece", "starfish shell",
  "mountain peak", "summit", "ridge", "cliff face", "rock face", "ledge", "overhang", "cave mouth", "arch", "natural bridge",
  "rope bridge", "suspension bridge", "covered bridge", "stone bridge", "wooden bridge", "footbridge", "drawbridge", "viaduct", "overpass", "skybridge",
  "well", "cistern", "water pump", "windmill", "grain silo", "hay bale", "scarecrow", "tractor", "plow", "irrigation",
  "antenna tower", "cell tower", "radio tower", "transmission tower", "power line", "telephone pole", "street light", "traffic cone", "road barrier", "guard rail",
  "satellite dish", "radar dish", "observatory", "planetarium", "space needle", "control tower", "watchtower", "lookout", "observation deck", "viewing platform"
];

// Combine all categories
const allWords = [
  ...mammals, ...birds, ...fish, ...reptiles, ...insects, ...seaCreatures,
  ...fruits, ...vegetables, ...preparedFoods, ...bakedGoods, ...dairy, ...drinks,
  ...householdObjects, ...furniture, ...clothing,
  ...nature, ...weather, ...bodyParts,
  ...vehicles, ...buildings, ...tools, ...instruments,
  ...sports, ...professions, ...technology,
  ...kitchenItems, ...toys, ...schoolSupplies,
  ...bathroomItems, ...garden, ...weapons, ...fantasy,
  ...shapes, ...artSupplies, ...medicalItems,
  ...containers, ...fabrics, ...jewelry, ...misc
];

// Remove duplicates (case-insensitive)
const seen = new Set();
const unique = [];
for (const word of allWords) {
  const lower = word.toLowerCase().trim();
  if (lower && !seen.has(lower)) {
    seen.add(lower);
    unique.push(lower);
  }
}

console.log(`Total unique words: ${unique.length}`);

// If we have more than 5000, trim
if (unique.length > 5000) {
  console.log(`Trimming from ${unique.length} to 5000`);
  unique.length = 5000;
}

// If we have fewer than 5000, we need more words
if (unique.length < 5000) {
  const needed = 5000 - unique.length;
  console.log(`Need ${needed} more words`);

  // Additional words to fill the gap
  const extras = [
    // More animals
    "aardvark", "albatross", "alligator snapper", "angora rabbit", "antler", "baboon spider",
    "barn owl", "basset hound", "bengal tiger", "billy goat", "bison calf", "blue jay",
    "blue whale calf", "boston terrier", "brown bear", "bull shark", "butterfly fish",
    "canada goose", "cape buffalo", "carolina wren", "carpet python", "carolina parakeet",
    "cedar waxwing", "chow chow", "clam shell", "cocker spaniel", "common loon",
    "coral trout", "corn snake", "desert tortoise", "diamondback", "doberman",
    "eastern bluebird", "emperor penguin", "fennec fox", "fruit bat", "garden spider",
    "german shepherd", "giant squid", "gila monster", "golden eagle", "golden retriever",
    "great dane", "great white shark", "green iguana", "grey wolf", "grizzly cub",
    "ground squirrel", "guinea fowl", "hammerhead shark", "harp seal", "harvest mouse",
    "hermit crab shell", "house cat", "house mouse", "house sparrow", "humpback calf",
    "hyena pup", "irish setter", "ivory gull", "jack rabbit", "japanese macaque",
    "jellyfish sting", "jumping spider", "king penguin", "labrador", "leaf insect",
    "leopard gecko", "little owl", "macaw parrot", "malamute", "mandrill",
    "mountain goat", "mountain lion", "mud turtle", "musk ox", "ocelot",
    "orangutan baby", "painted lady", "peregrine falcon", "pigeon hawk", "pine marten",
    "pinto horse", "pit viper", "prairie dog", "praying mantis", "pronghorn",
    "pygmy goat", "quetzal", "rainbow trout", "red fox", "red panda",
    "ring-tailed lemur", "river otter", "robin redbreast", "rottweiler", "ruby-throated hummingbird",
    "saber-toothed tiger", "sand crab", "scarlet macaw", "sea anemone", "sea eagle",
    "siamese cat", "siberian husky", "snow leopard", "snowy owl", "spider monkey",
    "spotted hyena", "sugar glider", "swift fox", "tabby cat", "tapir",
    "timber wolf", "tree frog", "tuna fish", "vulture buzzard", "wandering albatross",
    "water buffalo", "white tiger", "wild boar", "wild horse", "woodchuck",
    "yellow jacket", "zebra finch",

    // More food items
    "acorn squash", "angel hair pasta", "apple pie", "apple sauce", "baby carrot",
    "baked beans", "baked ham", "banana bread", "banana pudding", "barbecue sauce",
    "bean dip", "beef stew", "beef jerky", "beet salad", "bell pepper ring",
    "berry smoothie", "birthday cake", "black bean", "blueberry muffin", "blueberry pie",
    "bread bowl", "bread pudding", "bread roll", "breakfast burrito", "broccoli soup",
    "brown rice", "brussel sprout", "butter cookie", "butternut squash", "butterscotch",
    "caesar wrap", "candy apple", "candy bar", "caramel apple", "carrot cake",
    "carrot stick", "celery stick", "cheese pizza", "cheese stick", "cherry pie",
    "cherry tomato", "chicken breast", "chicken noodle soup", "chicken salad", "chicken tender",
    "chili dog", "chili pepper flake", "chocolate cake", "chocolate chip", "chocolate milk",
    "cinnamon stick", "clam shell pasta", "club soda", "coconut cream", "coconut milk",
    "cooked rice", "cookie dough", "corn chip", "corn muffin", "corn on the cob",
    "crab leg", "cracker", "cream cheese bagel", "cream pie", "cream soup",
    "croissant sandwich", "cucumber roll", "cupcake frosting", "date fruit", "deviled egg",
    "dinner roll", "dipping sauce", "dried fruit", "dumpling wrapper", "dutch baby",
    "egg noodle", "egg salad", "egg white", "fig newton", "fish fillet",
    "fish sandwich", "flatbread", "french onion soup", "fresh bread", "fried plantain",
    "frozen dinner", "fruit cup", "fruit salad", "fruit tart", "garlic bread",
    "garlic knot", "ginger cookie", "ginger snap", "glazed donut", "goat cheese",
    "grain bowl", "grape jelly", "green salad", "green tea", "grilled chicken",
    "grilled fish", "grilled steak", "ground beef", "ham sandwich", "hash brown patty",
    "hawaiian pizza", "herb butter", "honey bun", "honey jar", "hot sauce",
    "hot wing", "iced coffee", "italian bread", "jam jar", "key lime pie",
    "kettle corn", "lamb chop", "layer cake", "lemon bar", "lemon cake",
    "lemon drop", "lemon meringue", "lemon slice", "lobster tail", "mac and cheese",
    "maple syrup", "meat pie", "meatball sub", "melon slice", "mint leaf",
    "mixed nuts", "mozzarella stick", "mushroom cap", "naan bread", "olive oil",
    "onion soup", "orange peel", "orange slice", "oyster shell", "pancake stack",
    "pasta salad", "peach cobbler", "peanut butter", "pear slice", "pecan pie",
    "pepper jack", "pickle", "pie crust", "pimento", "pineapple ring",
    "pita bread", "pizza box", "pizza slice", "pork belly", "pork bun",
    "pot sticker", "potato soup", "potato wedge", "pound cake slice", "power bar",
    "protein shake", "pumpkin pie", "pumpkin seed", "queso dip", "raisin",
    "raisin bread", "ranch dressing", "raw fish", "red velvet cake", "red wine",
    "rice bowl", "rice noodle", "rice pudding", "roast chicken", "roast turkey",
    "roasted almond", "roasted peanut", "rum cake", "rye bread", "salad bar",
    "salad dressing", "salmon fillet", "salt block", "scallion pancake", "scramble",
    "seed mix", "sesame seed", "shaved ice", "shrimp tempura", "slice of bread",
    "slider burger", "smoked salmon", "snack mix", "soda can", "sourdough loaf",
    "soy sauce", "spinach dip", "spring salad", "squash soup", "steamed bun",
    "stir fry noodle", "strawberry jam", "stuffed pepper", "sugar cookie", "sugar cube",
    "sushi roll", "sweet corn", "sweet roll", "taco shell", "toast",
    "tomato sauce", "tomato soup", "trail mix", "turkey sandwich", "vanilla ice cream",
    "vegetable soup", "veggie burger", "waffle cone", "walnut", "wheat bread",
    "whipped topping", "white bread", "white rice", "white wine", "whole grain",
    "yellow cake", "yogurt cup", "zucchini bread",

    // More household / misc objects
    "address label", "adhesive bandage", "air mattress", "alarm system", "baby bottle",
    "baby monitor", "baby stroller", "back brace", "balance scale", "ball of yarn",
    "bath robe", "beach towel", "bed sheet", "bike lock", "bird whistle",
    "birthday candle", "blender jar", "board eraser", "boat anchor", "body pillow",
    "bone saw", "book cover", "boot jack", "bottle cap", "bow and arrow",
    "bowling pin", "bread box", "bread maker", "broom handle", "brush stroke",
    "bug net", "bulletin pin", "butter churn", "candle wax", "candy dish",
    "car battery", "car door", "car engine", "car key", "car seat",
    "car tire", "car wheel", "card deck", "cargo net", "cash drawer",
    "cat collar", "chalk board eraser", "cheese board", "cheese knife", "chess clock",
    "child seat", "china plate", "chopstick rest", "cigar", "cigarette",
    "circuit breaker panel", "clay pot", "climbing rope", "clothespin bag", "coal",
    "coat button", "coat hanger", "coat pocket", "coffee bean", "coffee cup",
    "coffee mug", "coffee table book", "collar", "color wheel", "comb case",
    "compass needle", "computer case", "computer chip", "computer mouse pad", "cookie jar",
    "cooking spray", "cooling rack", "cork", "corner piece", "cotton candy stick",
    "cotton reel", "couch cushion", "cover plate", "craft paper", "crescent wrench",
    "cross pendant", "crystal ball", "cup holder", "curtain rod", "cutting torch",
    "dartboard cabinet", "desk drawer", "desk pad", "dial", "diamond gem",
    "dice cup", "dinner plate", "disco ball", "dish antenna", "dish soap bottle",
    "divot tool", "dog bone", "dog collar", "dog leash", "dog tag",
    "doll house", "door hinge", "door latch", "door lock", "door mat",
    "door panel", "door stopper", "doorstep", "double helix", "drain cover",
    "drawer handle", "drawer knob", "dream catcher", "dress form", "drill press",
    "drop cloth", "dry ice", "dust bunny", "dust mask", "dvd case",
    "ear muff", "electric fence", "electric plug", "emerald gem", "emery board",
    "entry door", "exhaust pipe", "eye chart", "eye dropper", "eye mask",
    "face cream", "fan blade", "feather", "feather boa", "feather pen",
    "fence gate", "file box", "filing tray", "finger splint", "fire escape",
    "fire hose", "fire pit ring", "fishing boat", "fishing lure", "flag pole",
    "flame thrower", "flannel shirt", "flash card stack", "flashlight beam", "flat tire",
    "flight jacket", "flip chart pad", "floor tile", "flour bag", "flower arrangement",
    "flower basket", "flower crown", "flower stem", "flute case", "fly paper",
    "foam finger", "fog horn", "folding fan", "food tray", "foot pedal",
    "footprint", "fork lift arm", "fossil", "frame corner", "frozen lake",
    "fruit basket", "frying pan handle", "fuel can", "fur coat", "garden arch",
    "garden glove", "garden hoe", "gas can", "gas mask", "gate latch",
    "gear", "gem stone", "gift bow", "gift wrap", "glass bottle",
    "glass jar", "glass pane", "glass shard", "globe stand", "glove box",
    "gold bar", "gold coin", "gold nugget", "golf bag", "golf tee",
    "gourd", "grandfather clock pendulum", "granite slab", "grape vine", "grass blade",
    "gravel path", "gravy ladle", "green house", "grill grate", "grout line",
    "guard dog", "guest book", "guitar case", "guitar pick", "guitar string",
    "gum ball", "gum ball machine", "gun holster", "gutter pipe", "gym bag",
    "hair band", "hair dryer nozzle", "hair net", "halogen bulb", "hand bell",
    "hand fan", "hand mirror", "hand print", "hand rail", "hand saw blade",
    "hand stamp", "handle bar", "handcuff", "hard hat", "harmonica case",
    "hay stack", "head lamp", "head rest", "heart locket", "heat lamp",
    "helmet visor", "herb garden", "hiking trail", "hoe blade", "honey comb",
    "hood ornament", "horse saddle", "horse shoe", "hose clamp", "hot plate",
    "house key", "house plant", "hub cap", "humming bird feeder", "hunting knife",
    "ice block", "ice bucket", "ice chest", "ice cream bar", "ice cream cake",
    "ice pick", "ice sculpture", "incense burner", "incense holder", "incense stick",
    "index finger pointing", "iron gate", "iron ore", "island map", "ivory tusk",
    "jack-o-lantern", "jade stone", "jail cell", "jam pot", "jar lid",
    "jewel box", "jingle bell", "journal cover", "juice box", "jump rope handle",
    "jungle vine", "kayak paddle", "key card", "key chain fob", "key hole plate",
    "king chess piece", "kitchen apron", "kitchen clock", "kitchen counter", "kitchen drawer",
    "kitchen faucet", "kitchen floor", "kitchen knife", "kitchen shelf", "kitchen sink",
    "kitchen towel", "kitchen window", "kite string", "kite tail", "knee brace",
    "knitting yarn", "knob", "lace curtain", "lace doily", "ladder rung",
    "lamp shade", "lantern light", "latch hook", "launch pad", "laundry bag",
    "laundry detergent", "lawn sprinkler", "lead pencil", "leaf pile", "leather belt",
    "leather boot", "leather glove", "leather jacket", "leather strap", "lens cap",
    "letter box", "library card", "lid", "life buoy", "life preserver",
    "light beam", "light fixture", "lighthouse beam", "limb", "line graph",
    "linen napkin", "lint trap", "lip gloss", "log cabin", "looking glass"
  ];

  for (const word of extras) {
    const lower = word.toLowerCase().trim();
    if (lower && !seen.has(lower)) {
      seen.add(lower);
      unique.push(lower);
      if (unique.length >= 5000) break;
    }
  }

  // If still not enough, add more
  if (unique.length < 5000) {
    const moreExtras = [
      "lunch tray", "machine gun", "magic carpet", "magic hat", "magic lamp",
      "magic wand", "magnet", "magnolia bloom", "mailing tube", "manhole cover",
      "maple leaf", "marble", "marble column", "marble floor", "marble statue",
      "marking pen", "mason jar lid", "massage table", "match box", "match stick",
      "measuring tape", "meat cleaver", "medal ribbon", "medicine bag", "medicine wheel",
      "megaphone", "melon rind", "memo board clip", "memory foam", "metal bucket",
      "metal chain", "metal detector wand", "metal file", "metal grate", "metal pipe",
      "metal plate", "metal rod", "metal sheet", "metal tray", "metronome",
      "milk bottle", "milk carton", "milk jug", "mineral", "mini fridge",
      "moat", "model airplane", "model boat", "model car", "model house",
      "model rocket", "model train", "money bag", "monkey wrench", "monocle lens",
      "moon rock", "moss ball", "motor", "motorcycle helmet", "mouse pad",
      "mouse trap spring", "mouth guard", "movie reel", "movie screen", "movie ticket",
      "mud brick", "mud pie", "muffin pan", "mug handle", "mulch",
      "museum display", "music sheet", "nail file", "name badge", "napkin fold",
      "nature trail", "naval ship", "navy hat", "neck brace", "neck pillow",
      "needle point", "neon light", "nest", "net bag", "night cap",
      "night sky", "night stand lamp", "notebook cover", "number pad", "nurse cap",
      "nut shell", "oak barrel", "oak leaf", "oar", "oar lock",
      "observation tower", "ocean wave", "oil barrel", "oil can", "oil drum",
      "oil lamp wick", "oil painting", "old book", "olive branch", "onion ring",
      "open book", "opera mask", "ore cart", "origami bird", "origami box",
      "origami flower", "ornament", "outdoor shower", "oven door", "oven rack",
      "owl pellet", "oxygen mask", "oyster pearl", "pack mule", "paddle",
      "padlock key", "page turner", "paint can", "paint chip", "paint splatter",
      "paint swatch", "palette knife", "palm frond", "pan handle", "pancake batter",
      "pane of glass", "panel door", "paneling", "paper bag", "paper chain",
      "paper cup", "paper fan", "paper lantern", "paper plate", "paper weight",
      "parachute cord", "parasol", "paring knife blade", "parking sign", "parrot feather",
      "party hat", "party horn", "party streamer", "patch", "patio stone",
      "paw print", "pea pod", "peach pit", "peacock feather", "peanut shell",
      "pearl", "pearl necklace", "pedal", "peg", "pen cap",
      "pen nib", "pencil eraser", "pencil lead", "pendant light", "pendulum",
      "penguin chick", "penny", "pepper shaker", "perch branch", "perfume bottle",
      "pet carrier", "petal", "phone case", "phone charger", "phone screen",
      "photo album", "piano key", "picket sign", "pickle jar", "picture hook",
      "pie plate", "pig pen", "pigeon hole", "pillar candle", "pillow case",
      "pilot hat", "pine cone", "pine needle", "ping pong ball", "pipe cleaner",
      "pipe fitting", "pipe wrench jaw", "pirate flag", "pirate hat", "pirate ship",
      "pistol grip", "pitch fork tine", "pizza oven", "place card", "plain bagel",
      "plan drawing", "plane wing", "plank bridge", "plant leaf", "plant root",
      "plant seed", "plant sprout", "plaster cast", "plastic bag", "plastic bottle",
      "plate rack", "platform shoe", "play button", "playing field", "plier handle",
      "plug socket", "pocket knife", "pointed hat", "poker card", "pole",
      "police badge", "police hat", "polish cloth", "polo ball", "pond lily",
      "pool ball", "pool cue", "pop can", "popsicle stick", "porcelain doll",
      "porch column", "porch railing", "porch step", "port hole", "post box",
      "post card stamp", "pot lid", "potato eye", "pottery bowl", "pottery jug",
      "pouch pocket", "powder puff", "power button", "power drill bit", "power outlet",
      "prayer beads", "press button", "pressure gauge", "pretzel stick", "price tag",
      "prism rainbow", "program booklet", "projector screen", "propeller", "puddle reflection",
      "pull handle", "pulley", "pump handle", "punch card", "puppet string",
      "purple cabbage", "push button", "puzzle piece", "quartz crystal", "queen chess piece",
      "quill feather", "quilt block", "quilt square", "rabbit ear", "rabbit foot",
      "racing flag", "rack mount", "raft paddle", "rag doll", "rain cloud",
      "rain drop", "rain gutter", "rain puddle", "ram horn", "ramp board",
      "ranch fence", "raw diamond", "reading lamp", "record album", "record needle",
      "red carpet", "red wagon", "reed basket", "reel to reel", "reflector",
      "remote antenna", "rescue boat", "reservoir dam", "resin", "ribbon bow",
      "ribbon curl", "ribbon spool", "rice grain", "riding crop", "rifle scope",
      "ring box", "ring stand", "river bank", "river bed", "river rock",
      "road cone", "road sign", "robe tie", "rocking horse", "rod and reel",
      "roller brush", "roller coaster car", "roof shingle", "roof tile", "roof top",
      "rooftop antenna", "room key", "root vegetable", "rose bud", "rose petal",
      "rose thorn", "round table", "row boat oar", "rubber ball", "rubber boot",
      "rubber duck", "rubber mallet", "rubber stamp", "ruby gem", "rudder",
      "ruler edge", "running track", "rustic fence", "saddle bag", "safe dial",
      "safety cone", "safety harness", "safety net", "safety pin", "safety vest",
      "sail", "sail boat mast", "sailor hat", "salad bowl wooden", "salad tongs",
      "salt crystal", "salt lamp", "sand bag", "sand box toy", "sand timer",
      "sandal strap", "sapphire gem", "sash window", "sauce pan", "saw blade",
      "saw dust", "scale model", "scarf knot", "school bell", "school bus",
      "scissors blade", "scoop net", "score board display", "scout badge", "scrap book",
      "screw cap", "screw head", "scroll", "sea foam", "sea shell",
      "seal stamp", "search light", "seat belt", "seat cushion", "seed packet",
      "serving bowl", "serving dish", "serving platter", "sewing basket", "sewing box",
      "sewing kit", "sewing pattern", "sewing pin", "shade umbrella", "shadow puppet",
      "shark fin", "shark tooth", "sheep wool", "shelf bracket", "shelf unit",
      "shell necklace", "shield emblem", "ship anchor", "ship bell", "ship deck",
      "ship helm", "ship mast", "ship porthole", "ship wheel", "shirt button",
      "shirt collar", "shirt pocket", "shirt sleeve", "shoe box", "shoe horn",
      "shoe lace", "shoe polish", "shoe sole", "shoe tree", "shop front",
      "shopping cart", "short sword", "shoulder bag", "shovel blade", "shower cap",
      "shower curtain", "shower door", "shower drain", "shuttle cock", "side mirror",
      "side pocket", "signal flare", "silk scarf", "silver bar", "silver coin",
      "sink basin", "sink drain", "sink faucet", "sink plug", "siren",
      "sketch book", "ski mask", "ski resort", "ski slope", "ski trail",
      "skillet handle", "skull cap", "sky lantern", "slab of stone", "slate tile",
      "sleeping mask", "sleeve cuff", "sliced bread", "sling bag", "slip knot",
      "slot car", "slot machine lever", "smoke ring", "smoke signal", "smoking pipe",
      "snack bowl", "snack tray", "snap button", "snare wire", "snow angel",
      "snow boot print", "snow cone", "snow fort", "snow globe base", "snow man hat",
      "snow shoe", "soap bar", "soap bubble", "soccer cleat", "socket plug",
      "soda bottle", "sofa arm", "sofa leg", "soil bag", "solar cell",
      "sole plate", "soup bowl spoon", "soup can", "soup kettle", "soup ladle",
      "soup pot", "soup tureen", "spark plug", "speaker cone", "speaker grill",
      "spear head", "spear tip", "speed boat hull", "spider web", "spike",
      "spindle", "spinning top base", "sponge mop", "spool of thread", "spoon rest",
      "sport jersey", "sports bag", "spot light beam", "spray can", "spring coil",
      "sprinkler head", "spy glass", "square knot", "squeeze bottle", "stable door",
      "stack of books", "stack of coins", "stage curtain", "stage light", "stain glass window",
      "stair rail", "stair step", "stair well", "stake", "stalk",
      "stamp collection", "stamp pad ink", "stand mixer", "standing lamp", "star fish arm",
      "station wagon", "statue base", "statue head", "steam engine", "steam iron",
      "steam pipe", "steam vent", "steel beam", "steel cable", "steel plate",
      "steering column", "stem cell", "step plate", "stepping stone path", "stereo speaker",
      "sticker", "stirrup", "stock pot lid", "stone arch", "stone column",
      "stone floor", "stone path", "stone slab", "stone tablet", "stone wall",
      "storage box", "storage chest", "storage closet", "storage crate", "storage jar",
      "storage rack", "storage shelf", "storm cloud", "stove burner", "stove pipe",
      "stove top", "straight pin", "strap buckle", "straw hat", "stream bed",
      "street corner", "stretch band", "string light", "stripe pattern", "studio apartment",
      "stump", "submarine hatch", "sugar cane", "sugar jar", "suit case handle",
      "sun dial face", "sun hat brim", "sun visor", "sundress", "sunflower seed",
      "surf wave", "surgeon mask", "swan lake", "sweater vest", "sweet pea",
      "swim ring", "swing chain", "swing seat", "switch plate", "swivel joint",
      "sword blade", "sword handle", "sword hilt", "table cloth edge", "table leg",
      "table runner", "table setting", "table top", "tack board", "tail feather",
      "tank top strap", "tape dispenser", "tape roll", "tar pit", "target board",
      "tartan plaid", "tassel", "tea bag", "tea cup", "tea leaf",
      "tea pot spout", "tea set", "telescope lens", "temple bell", "temple gate",
      "tennis court line", "tent pole", "tent stake", "terra cotta pot", "test tube holder",
      "thatch roof", "theater curtain", "theater mask", "thermal mug", "thick rope",
      "thin wire", "thread needle", "thread spool", "three ring binder", "ticket booth",
      "ticket stub", "tie dye shirt", "tile floor", "tile mosaic", "timber frame",
      "tin can", "tin foil", "tin roof", "tinsel", "tissue paper sheet",
      "toast rack", "toboggan trail", "toggle switch", "tomato vine", "tongue depressor stick",
      "tool bag", "tool handle", "tooth fairy", "top knot", "torch flame",
      "tote bag handle", "totem", "touch lamp", "tour bus", "tower crane",
      "toy block", "toy box lid", "toy drum", "toy horse", "toy piano",
      "track shoe", "trade bead", "traffic barrier", "trail marker", "train car",
      "train engine", "train platform", "train track", "training dummy", "trampoline net",
      "trap door", "travel bag", "travel mug", "tray table", "treasure box",
      "tree bark", "tree branch", "tree house", "tree limb", "tree ring",
      "tree root", "tree stump", "tree trunk", "trench", "triangle ruler",
      "tribal mask", "tripod", "trombone slide", "trophy base", "trophy cup",
      "tropical fish", "truck bed", "truck cab", "truck tire", "trumpet bell",
      "trunk lid", "tube sock", "tulip bulb", "tumble dryer", "tunnel entrance",
      "turkey feather", "turn signal", "turntable arm", "turquoise stone", "tusk",
      "tv antenna", "tv remote", "tv screen", "tv tray", "twig",
      "twine ball", "umbrella handle", "umbrella tip", "under shirt", "unicorn horn",
      "utility belt", "utility box", "vacuum bag", "vacuum hose", "valley floor",
      "valve", "valve handle", "van door", "vanity case", "vanity light",
      "vaulted ceiling", "vegetable garden", "velvet curtain", "vent cover", "vent pipe",
      "vest pocket", "video tape", "vine leaf", "vinyl record", "violin bow",
      "violin string", "visor cap", "volcanic rock", "volleyball court", "waffle pattern",
      "wagon wheel", "waist belt", "walking cane", "wall bracket", "wall clock face",
      "wall mount", "wall outlet", "wall panel", "wall paper", "wall plate",
      "wall sconce light", "wall socket", "wall tile", "wand tip", "war drum",
      "war paint", "wardrobe door", "wash basin", "wash board", "wash cloth",
      "waste basket", "watch band", "watch chain", "watch face", "watch tower window",
      "water barrel", "water bucket", "water can", "water cooler", "water cup",
      "water drop", "water fountain", "water glass", "water hose nozzle", "water jug",
      "water mill", "water pipe", "water pistol", "water spout", "water tank",
      "water tap", "water tower top", "water trough", "wave crest", "wax candle",
      "wax figure", "wax melt", "wax paper sheet", "weapon rack", "weather dial",
      "weather station", "weave pattern", "web cam lens", "wedge", "weed",
      "weight plate", "weight scale", "welding helmet", "well bucket", "well pump",
      "west wall", "wet floor sign", "whale tail", "wheat field", "wheat sheaf",
      "wheel spoke", "whisker", "whistle chain", "white board marker", "white fence",
      "white flag", "white glove", "wick", "wicker basket", "wicker chair",
      "wide brim hat", "wild flower", "willow branch", "wind mill blade", "wind vane",
      "window box planter", "window frame", "window glass", "window latch", "window ledge",
      "window lock", "window pane", "window shade", "wine barrel", "wine bottle",
      "wine cork", "wine glass stem", "wing mirror", "wing span", "wing tip",
      "winter coat", "winter glove", "winter hat", "wire fence", "wire frame",
      "wire hanger", "wire mesh", "wire spool", "wire wheel", "wishing well",
      "witch hat", "wok handle", "wood beam", "wood block", "wood board",
      "wood burning stove", "wood carving", "wood chip", "wood door", "wood fence",
      "wood floor", "wood frame", "wood grain", "wood handle", "wood knot",
      "wood panel", "wood peg", "wood pile", "wood plank bridge", "wood post",
      "wood shaving", "wood shelf", "wood shingle", "wood sign", "wood slab",
      "wood stake", "wood table top", "wood trim", "wooden boat", "wooden bowl",
      "wooden box", "wooden bridge", "wooden bucket", "wooden chair", "wooden crate",
      "wooden cross", "wooden deck", "wooden door knob", "wooden duck", "wooden fence post",
      "wooden flute", "wooden gate", "wooden ladder", "wooden mallet", "wooden mask",
      "wooden paddle", "wooden peg toy", "wooden rocking horse", "wooden ruler", "wooden shield",
      "wooden shoe", "wooden spoon", "wooden stool", "wooden sword", "wooden toy",
      "wooden tray", "wooden wagon", "wooden wheel", "wool blanket", "wool cap",
      "wool coat", "wool hat", "wool mitten", "wool scarf", "wool sock",
      "wool sweater", "work glove", "work lamp", "worm composting", "wrapping paper",
      "wreath hanger", "wrist guard", "wrist strap", "writing desk", "writing pad",
      "wrought iron", "wrought iron gate", "yacht sail", "yard stick", "yarn ball",
      "yarn needle", "yellow bus", "yoga block", "yoga strap", "yoke",
      "zipper pull", "zipper teeth", "zodiac sign", "zone marker"
    ];

    for (const word of moreExtras) {
      const lower = word.toLowerCase().trim();
      if (lower && !seen.has(lower)) {
        seen.add(lower);
        unique.push(lower);
        if (unique.length >= 5000) break;
      }
    }
  }

  console.log(`After extras: ${unique.length}`);
}

// Now categorize them for output with comments
// We'll just write all words in the organized format

// Build the output file content
let output = 'export const simpleWords = [\n';

// We need to organize back by category for the comments
const categories = [
  { name: 'Animals - Mammals', words: mammals },
  { name: 'Animals - Birds', words: birds },
  { name: 'Animals - Fish', words: fish },
  { name: 'Animals - Reptiles & Amphibians', words: reptiles },
  { name: 'Animals - Insects & Bugs', words: insects },
  { name: 'Animals - Sea Creatures', words: seaCreatures },
  { name: 'Food - Fruits', words: fruits },
  { name: 'Food - Vegetables', words: vegetables },
  { name: 'Food - Prepared Foods & Dishes', words: preparedFoods },
  { name: 'Food - Baked Goods & Desserts', words: bakedGoods },
  { name: 'Food - Dairy & Cheese', words: dairy },
  { name: 'Drinks', words: drinks },
  { name: 'Household Objects', words: householdObjects },
  { name: 'Furniture', words: furniture },
  { name: 'Clothing & Accessories', words: clothing },
  { name: 'Nature - Plants, Trees, Flowers, Landscapes', words: nature },
  { name: 'Weather & Sky', words: weather },
  { name: 'Body Parts', words: bodyParts },
  { name: 'Vehicles & Transportation', words: vehicles },
  { name: 'Buildings & Structures', words: buildings },
  { name: 'Tools & Hardware', words: tools },
  { name: 'Musical Instruments', words: instruments },
  { name: 'Sports & Games', words: sports },
  { name: 'Professions & People', words: professions },
  { name: 'Technology & Electronics', words: technology },
  { name: 'Kitchen Items', words: kitchenItems },
  { name: 'Toys & Games', words: toys },
  { name: 'School & Office Supplies', words: schoolSupplies },
  { name: 'Bathroom Items', words: bathroomItems },
  { name: 'Garden & Outdoor', words: garden },
  { name: 'Weapons & Medieval', words: weapons },
  { name: 'Fantasy & Mythology Creatures', words: fantasy },
  { name: 'Shapes & Symbols', words: shapes },
  { name: 'Art & Craft Supplies', words: artSupplies },
  { name: 'Medical Items', words: medicalItems },
  { name: 'Containers', words: containers },
  { name: 'Fabrics & Materials', words: fabrics },
  { name: 'Jewelry', words: jewelry },
  { name: 'Miscellaneous', words: misc },
];

// Track which words have been used to avoid duplicates in output
const usedInOutput = new Set();
let totalInOutput = 0;

for (const cat of categories) {
  output += `  // ${cat.name}\n`;
  for (const word of cat.words) {
    const lower = word.toLowerCase().trim();
    if (!usedInOutput.has(lower)) {
      usedInOutput.add(lower);
      output += `  "${lower}",\n`;
      totalInOutput++;
    }
  }
}

// Now add any extras that made it into unique but not into categories
if (totalInOutput < 5000) {
  output += `  // Additional drawable words\n`;
  for (const word of unique) {
    if (!usedInOutput.has(word)) {
      usedInOutput.add(word);
      output += `  "${word}",\n`;
      totalInOutput++;
      if (totalInOutput >= 5000) break;
    }
  }
}

// Remove trailing comma from last entry
output = output.replace(/,\n$/, '\n');
output += '];\n';

console.log(`Words in output: ${totalInOutput}`);

fs.writeFileSync('/Users/mbaid/telephone-draw/game/simple-words.ts', output);
console.log('File written successfully!');
