// ================================================================
// 1. MASTER DATA – ISSUERS, PRODUCTS, NETWORKS, SUBNETWORKS
// ================================================================

const ISSUER_PRODUCTS = {
    "HDFC Bank": [
        "HDFC Infinia Metal Edition","HDFC Infinia Credit Card","HDFC Diners Club Black Metal Edition",
        "HDFC Diners Club Black","HDFC Diners Club Privilege","HDFC Regalia Gold","HDFC Regalia",
        "HDFC Millennia","HDFC MoneyBack+","HDFC Freedom","HDFC Bharat Cashback","HDFC IndianOil Credit Card",
        "HDFC IRCTC Credit Card","HDFC Swiggy Credit Card","HDFC Tata Neu Infinity","HDFC Tata Neu Plus",
        "HDFC Marriott Bonvoy","HDFC Biz Black","HDFC Biz Power","HDFC Biz Grow","HDFC Pixel Play",
        "HDFC Pixel Go","HDFC UPI RuPay Credit Card","HDFC Shoppers Stop Credit Card","HDFC Paytm Credit Card"
    ],
    "ICICI Bank": [
        "ICICI Emeralde Private Metal","ICICI Emeralde","ICICI Times Black","ICICI Sapphiro","ICICI Rubyx",
        "ICICI Coral","ICICI Rubyx American Express","ICICI HPCL Super Saver",
        "ICICI Amazon Pay Credit Card","ICICI MakeMyTrip Signature",
        "ICICI MakeMyTrip Platinum","ICICI Manchester United Signature","ICICI Manchester United Platinum",
        "ICICI Platinum Chip","ICICI Platinum Chip RuPay","ICICI Instant Platinum","ICICI Expressions Credit Card",
        "ICICI Mine Credit Card","ICICI Adani One Signature","ICICI Adani One Platinum","ICICI Emirates Emeralde",
        "ICICI Emirates Sapphiro","ICICI Emirates Rubyx","ICICI Diamant Credit Card"
    ],
    "SBI Card": [
        "SBI AURUM","SBI Elite","SBI Elite Advantage","SBI PRIME","SBI Pulse","SBI Cashback Card",
        "SBI SimplyCLICK","SBI SimplySAVE","SBI SimplySAVE Advantage","SBI Card Miles","SBI Card Miles Prime",
        "SBI Air India Signature","SBI Air India Platinum","SBI BPCL Octane","SBI BPCL","SBI IRCTC Premier",
        "SBI IRCTC RuPay","SBI UCO Bank Platinum","SBI Shaurya","SBI Unnati","SBI Doctor's Card",
        "SBI Lifestyle Home Centre","SBI Reliance Credit Card","SBI FBB StyleUP","SBI SimplyCLICK Advantage"
    ],
    "Axis Bank": [
        "Axis Magnus for Burgundy","Axis Magnus","Axis Reserve","Axis Atlas","Axis Horizon","Axis Select",
        "Axis ACE","Axis Neo","Axis MY ZONE","Axis Rewards","Axis Privilege","Axis IndianOil Premium",
        "Axis IndianOil","Axis Airtel","Axis Flipkart","Axis Samsung Infinite","Axis Samsung Signature",
        "Axis Vistara Infinite","Axis Vistara Signature","Axis Vistara Platinum","Axis LIC Signature",
        "Axis LIC Platinum","Axis Freecharge Plus","Axis Burgundy Private","Axis IOCL RuPay"
    ],
    "Kotak Mahindra Bank": [
        "Kotak White Reserve","Kotak Solitaire","Kotak Zen Signature","Kotak Royale Signature",
        "Kotak League Platinum","Kotak PVR INOX Platinum","Kotak Myntra","Kotak IndianOil",
        "Kotak Mojo Platinum","Kotak Essentia Platinum","Kotak Fortune Gold","Kotak Urbane Gold",
        "Kotak Delight Platinum","Kotak 811 Dream Different","Kotak Aqua Gold","Kotak UPI RuPay",
        "Kotak NRI Platinum","Kotak Corporate Platinum","Kotak Business Platinum","Kotak Privy League Signature"
    ],
    "IndusInd Bank": [
        "IndusInd Pioneer Heritage Metal","IndusInd Pioneer Heritage","IndusInd Pioneer Private",
        "IndusInd Legend","IndusInd EazyDiner Platinum","IndusInd EazyDiner Signature","IndusInd Nexxt",
        "IndusInd Platinum Aura Edge","IndusInd Platinum RuPay","IndusInd Platinum Visa","IndusInd Tiger Credit Card",
        "IndusInd Tiger RuPay","IndusInd Club Vistara Explorer","IndusInd Club Vistara Pioneer","IndusInd Crest",
        "IndusInd Duo Plus","IndusInd Celesta","IndusInd Avios Visa Infinite","IndusInd Avios Visa Platinum",
        "IndusInd Samman RuPay","IndusInd Business Gold","IndusInd Corporate Credit Card"
    ],
    "IDFC FIRST Bank": [
        "IDFC FIRST Ashva","IDFC FIRST Mayura","IDFC FIRST FIRST Private","IDFC FIRST Wealth",
        "IDFC FIRST Select","IDFC FIRST Millennia","IDFC FIRST Classic","IDFC FIRST WOW",
        "IDFC FIRST Power+","IDFC FIRST SWYP","IDFC FIRST Earn","IDFC FIRST Digital RuPay",
        "IDFC FIRST Club Vistara","IDFC FIRST LIC Classic","IDFC FIRST LIC Select",
        "IDFC FIRST Business Credit Card","IDFC FIRST Corporate Credit Card"
    ],
    "YES BANK": [
        "YES BANK Marquee","YES BANK Reserv","YES BANK Elite+","YES BANK Wellness Plus",
        "YES BANK Wellness","YES BANK Paisabazaar PaisaSave","YES BANK Paisabazaar PaisaSave Plus",
        "YES BANK BYOC","YES BANK Prosperity Rewards Plus","YES BANK Prosperity Cashback Plus",
        "YES BANK ACE","YES BANK FINBOOST","YES BANK Kiwi","YES BANK RuPay Credit Card","YES BANK Business Credit Card",
        "YES BANK Corporate Credit Card"
    ],
    "RBL Bank": [
        "RBL World Safari","RBL Insignia Preferred Banking","RBL Icon","RBL Platinum Maxima Plus",
        "RBL ShopRite","RBL Popcorn","RBL BookMyShow Play","RBL Bajaj Finserv SuperCard",
        "RBL Bajaj Finserv World Prime SuperCard","RBL Bajaj Finserv World Plus SuperCard",
        "RBL Bajaj Finserv Platinum Plus SuperCard","RBL IndianOil XTRA","RBL Duet Plus",
        "RBL Bank Credit Card","RBL RuPay Credit Card","RBL Corporate Credit Card"
    ],
    "HSBC India": [
        "HSBC Premier Metal","HSBC Premier","HSBC TravelOne","HSBC Live+","HSBC Platinum",
        "HSBC Visa Platinum","HSBC Cashback","HSBC Smart Value","HSBC Gold","HSBC Rewards",
        "HSBC Corporate Credit Card","HSBC Business Credit Card"
    ],
    "Standard Chartered Bank": [
        "Standard Chartered Ultimate","Standard Chartered Ultimate 2.0","Standard Chartered Smart",
        "Standard Chartered DigiSmart","Standard Chartered EaseMyTrip","Standard Chartered Emirates World",
        "Standard Chartered Emirates Platinum","Standard Chartered Platinum Rewards",
        "Standard Chartered Super Value Titanium","Standard Chartered Titanium",
        "Standard Chartered Manhattan Platinum","Standard Chartered Rewards",
        "Standard Chartered Priority Visa Infinite","Standard Chartered Visa Infinite",
        "Standard Chartered Platinum","Standard Chartered Corporate Card","Standard Chartered Business Card"
    ],
    "American Express": [
        "American Express Platinum Charge Card","American Express Platinum Reserve",
        "American Express Platinum Travel","American Express Gold Charge Card","American Express SmartEarn",
        "American Express Membership Rewards","American Express MRCC","American Express Green Card",
        "American Express Corporate Card","American Express Business Card","American Express Centurion",
        "American Express Gold Corporate","American Express Business Gold","American Express Corporate Platinum"
    ],
    "AU Small Finance Bank": [
        "AU Zenith+","AU Zenith","AU Vetta","AU Altura+","AU Altura","AU LIT","AU SPONT",
        "AU InstaPay RuPay","AU Kiwi","AU Xcite Ace","AU Xcite Ultra","AU NOMO","AU BizGrow","AU Corporate Credit Card"
    ],
    "Federal Bank": [
        "Federal Bank Celesta","Federal Bank Imperio","Federal Bank Signet","Federal Bank Scapia",
        "Federal Bank OneCard","Federal Bank Wave RuPay","Federal Bank RuPay Credit Card",
        "Federal Bank Visa Platinum","Federal Bank Mastercard Platinum",
        "Federal Bank Corporate Credit Card","Federal Bank Business Credit Card"
    ],
    "Bank of Baroda": [
        "BOB Eterna","BOB Premier","BOB Select","BOB Easy","BOB Prime","BOB ICAI Exclusive",
        "BOB IRCTC Credit Card","BOB HPCL ENERGIE","BOB Snapdeal","BOB CMA One","BOB Vikram",
        "BOB Defence","BOB RuPay Platinum","BOB UPI RuPay Credit Card","BOB OneCard","BOB Corporate Credit Card",
        "BOB Business Credit Card"
    ],
    "Punjab National Bank": [
        "PNB RuPay Platinum Credit Card","PNB RuPay Select Credit Card","PNB Visa Platinum Credit Card",
        "PNB Visa Gold Credit Card","PNB Global Platinum Credit Card","PNB Global Gold Credit Card",
        "PNB Kiwi","PNB Patanjali Credit Card","PNB Rakshak Credit Card","PNB Pride Credit Card","PNB Insta Credit Card",
        "PNB Corporate Credit Card","PNB Business Credit Card"
    ],
    "Canara Bank": [
        "Canara Visa Platinum Credit Card","Canara Visa Gold Credit Card","Canara Mastercard Platinum",
        "Canara Mastercard Gold","Canara RuPay Platinum Credit Card","Canara RuPay Select Credit Card",
        "Canara World Credit Card","Canara Signature Credit Card","Canara Premium Credit Card",
        "Canara Corporate Credit Card","Canara Business Credit Card"
    ],
    "Union Bank of India": [
        "Union Bank RuPay Platinum Credit Card","Union Bank RuPay Select Credit Card",
        "Union Bank Visa Platinum Credit Card","Union Bank Visa Signature Credit Card",
        "Union Bank Visa Gold Credit Card","Union Bank Mastercard Platinum",
        "Union Bank Signature Credit Card","Union Bank Premium Credit Card",
        "Union Bank Corporate Credit Card","Union Bank Business Credit Card"
    ],
    "Indian Bank": [
        "Indian Bank Visa Platinum Credit Card","Indian Bank Visa Gold Credit Card",
        "Indian Bank Mastercard Platinum","Indian Bank Mastercard Gold",
        "Indian Bank RuPay Platinum Credit Card","Indian Bank RuPay Select Credit Card",
        "Indian Bank OneCard","Indian Bank Premium Credit Card","Indian Bank Signature Credit Card",
        "Indian Bank Corporate Credit Card","Indian Bank Business Credit Card"
    ],
    "Bank of India": [
        "BOI Visa Platinum Credit Card","BOI Visa Gold Credit Card","BOI Mastercard Platinum",
        "BOI Mastercard Gold","BOI RuPay Platinum Credit Card","BOI RuPay Select Credit Card",
        "BOI Premium Credit Card","BOI Signature Credit Card","BOI Corporate Credit Card",
        "BOI Business Credit Card","BOI Global Credit Card"
    ],
    "Central Bank of India": [
        "Central Bank Visa Platinum Credit Card","Central Bank Visa Gold Credit Card",
        "Central Bank Mastercard Platinum","Central Bank Mastercard Gold",
        "Central Bank RuPay Platinum Credit Card","Central Bank RuPay Select Credit Card",
        "Central Bank World Credit Card","Central Bank Signature Credit Card",
        "Central Bank Premium Credit Card","Central Bank Corporate Credit Card",
        "Central Bank Business Credit Card"
    ],
    "UCO Bank": [
        "UCO Visa Platinum Credit Card","UCO Visa Gold Credit Card","UCO Mastercard Platinum",
        "UCO Mastercard Gold","UCO RuPay Platinum Credit Card","UCO RuPay Select Credit Card",
        "UCO IRCTC RuPay Credit Card","UCO Premium Credit Card","UCO Signature Credit Card",
        "UCO Corporate Credit Card","UCO Business Credit Card"
    ],
    "South Indian Bank": [
        "South Indian Bank OneCard","South Indian Bank Visa Platinum Credit Card",
        "South Indian Bank Visa Signature Credit Card","South Indian Bank Mastercard Platinum",
        "South Indian Bank RuPay Platinum Credit Card","South Indian Bank RuPay Select Credit Card",
        "South Indian Bank Premium Credit Card","South Indian Bank Signature Credit Card",
        "South Indian Bank Corporate Credit Card","South Indian Bank Business Credit Card"
    ],
    "Karnataka Bank": [
        "Karnataka Bank Visa Platinum Credit Card","Karnataka Bank Visa Signature Credit Card",
        "Karnataka Bank Mastercard Platinum","Karnataka Bank RuPay Platinum Credit Card",
        "Karnataka Bank RuPay Select Credit Card","Karnataka Bank Signature Credit Card",
        "Karnataka Bank Premium Credit Card","Karnataka Bank Corporate Credit Card",
        "Karnataka Bank Business Credit Card"
    ],
    "Karur Vysya Bank": [
        "KVB Visa Platinum Credit Card","KVB Visa Signature Credit Card","KVB Mastercard Platinum",
        "KVB RuPay Platinum Credit Card","KVB RuPay Select Credit Card","KVB Signature Credit Card",
        "KVB Premium Credit Card","KVB Corporate Credit Card","KVB Business Credit Card"
    ],
    "CSB Bank": [
        "CSB Visa Platinum Credit Card","CSB Visa Signature Credit Card","CSB Mastercard Platinum",
        "CSB RuPay Platinum Credit Card","CSB RuPay Select Credit Card","CSB OneCard","CSB Premium Credit Card",
        "CSB Signature Credit Card","CSB Corporate Credit Card","CSB Business Credit Card"
    ],
    "Dhanlaxmi Bank": [
        "Dhanlaxmi Visa Platinum Credit Card","Dhanlaxmi Visa Signature Credit Card",
        "Dhanlaxmi Mastercard Platinum","Dhanlaxmi RuPay Platinum Credit Card",
        "Dhanlaxmi RuPay Select Credit Card","Dhanlaxmi Premium Credit Card","Dhanlaxmi Signature Credit Card",
        "Dhanlaxmi Corporate Credit Card","Dhanlaxmi Business Credit Card"
    ],
    "Jammu & Kashmir Bank": [
        "J&K Bank Visa Platinum Credit Card","J&K Bank Visa Gold Credit Card","J&K Bank RuPay Platinum Credit Card",
        "J&K Bank RuPay Select Credit Card","J&K Bank Mastercard Platinum","J&K Bank Signature Credit Card",
        "J&K Bank Premium Credit Card","J&K Bank Corporate Credit Card","J&K Bank Business Credit Card"
    ],
    "DBS Bank India": [
        "DBS Vantage Credit Card","DBS Spark Credit Card","DBS Altitude Visa Signature",
        "DBS Black Visa Card","DBS Treasures Black Elite","DBS Insignia Card","DBS Live Fresh Card",
        "DBS Business Card","DBS Corporate Card"
    ],
    "Citi India": [
        "Citi Prestige","Citi PremierMiles","Citi Rewards","Citi Cashback","Citi Simplicity",
        "Citi IndianOil","Citi Air India Platinum","Citi Air India Signature","Citi Ultima",
        "Citi Corporate Card","Citi Business Card"
    ],
    "SBM Bank": [
        "SBM Visa Platinum Credit Card","SBM Visa Signature Credit Card","SBM Mastercard Platinum",
        "SBM RuPay Platinum Credit Card","SBM RuPay Select Credit Card","SBM OneCard","SBM Premium Credit Card",
        "SBM Signature Credit Card","SBM Corporate Credit Card","SBM Business Credit Card"
    ]
};

const COUNTRIES = [
    "India","United States","United Kingdom","United Arab Emirates","Singapore","Canada","Australia",
    "Germany","France","Switzerland","Netherlands","Hong Kong","Japan","China","South Korea",
    "Saudi Arabia","Qatar","Kuwait","Bahrain","Oman","South Africa","Nigeria","Kenya","Brazil",
    "Mexico","New Zealand","Ireland","Spain","Italy","Sweden","Norway","Denmark","Malaysia",
    "Indonesia","Thailand","Philippines","Vietnam","Sri Lanka","Bangladesh","Nepal","Russia","Turkey","Others"
];

const NETWORKS = {
    "Visa": ["Visa Classic","Visa Gold","Visa Platinum","Visa Signature","Visa Infinite","Visa Infinite Privilege","Visa Business","Visa Corporate","Visa Purchasing","Visa Commercial"],
    "Mastercard": ["Mastercard Standard","Mastercard Gold","Mastercard Platinum","World Mastercard","World Elite Mastercard","Titanium Mastercard","Business Mastercard","Corporate Mastercard"],
    "Maestro": ["Maestro Standard","Maestro Gold","Maestro Debit","Maestro International"],
    "RuPay": ["RuPay Classic","RuPay Platinum","RuPay Select","RuPay Platinum Plus","RuPay JCB","RuPay Business","RuPay Corporate","RuPay Credit on UPI"],
    "Amex": ["Green Card","Gold Card","Gold Charge","Membership Rewards","Platinum Travel","Platinum Reserve","Platinum Charge","Centurion","Business Gold","Corporate Platinum"],
    "Diners Club": ["Diners Club Privilege","Diners Club Black","Diners Club Black Metal","Diners Club Premium"],
    "JCB": ["JCB Standard","JCB Gold","JCB Platinum","JCB World"],
    "UnionPay": ["UnionPay Classic","UnionPay Platinum","UnionPay Diamond","UnionPay Business"],
    "Discover": ["Discover Standard","Discover Platinum","Discover Business"]
};

// ================================================================
// 2. CATEGORY → SUB CATEGORY → MERCHANT HIERARCHY
// ================================================================

const CATEGORY_HIERARCHY = {
    'Shopping': {
        subCategories: ['Fashion','Electronics','Home & Furniture','Beauty & Personal Care','Sports & Fitness','Jewellery','Books & Stationery','Toys & Baby Products','Luxury Shopping','Department Stores'],
        merchants: {
            'Fashion': ['Myntra','Ajio','Nykaa','Shoppers Stop','Lifestyle','Westside'],
            'Electronics': ['Reliance Digital','Croma','Vijay Sales','Apple Store','Samsung','Tata CLiQ'],
            'Home & Furniture': ['IKEA','Home Centre','Pepperfry'],
            'Beauty & Personal Care': ['Nykaa','Shoppers Stop','Lifestyle'],
            'Sports & Fitness': ['Decathlon'],
            'Jewellery': ['Tanishq','Kalyan Jewellers'],
            'Books & Stationery': ['Amazon','Flipkart'],
            'Toys & Baby Products': ['Hamleys','FirstCry'],
            'Luxury Shopping': ['Amazon Luxury','Flipkart Luxe'],
            'Department Stores': ['Shoppers Stop','Lifestyle','Westside']
        }
    },
    'Travel': {
        subCategories: ['Flights','Hotels','Bus','Train','Cab','Holiday Packages','Visa Services','Travel Insurance'],
        merchants: {
            'Flights': ['MakeMyTrip','EaseMyTrip','Yatra','Cleartrip','Goibibo','ixigo','Air India','IndiGo','Akasa Air','SpiceJet'],
            'Hotels': ['MakeMyTrip','EaseMyTrip','Yatra','Cleartrip','Goibibo','Marriott','Taj Hotels','ITC Hotels','OYO'],
            'Bus': ['RedBus','AbhiBus','Paytm Bus'],
            'Train': ['IRCTC','ConfirmTkt','RailYatri'],
            'Cab': ['Uber','Ola'],
            'Holiday Packages': ['MakeMyTrip','EaseMyTrip','Yatra','Cleartrip','Goibibo'],
            'Visa Services': ['VFS Global','Atlys'],
            'Travel Insurance': ['HDFC ERGO','ICICI Lombard','Bajaj Allianz','TATA AIG']
        }
    },
    'Dining': {
        subCategories: ['Restaurants','Cafe','Food Delivery','Fine Dining','Fast Food','Cloud Kitchen'],
        merchants: {
            'Restaurants': ['Zomato','Swiggy','Barbeque Nation','Mainland China'],
            'Cafe': ['Starbucks','Cafe Coffee Day'],
            'Food Delivery': ['Swiggy','Zomato'],
            'Fine Dining': ['Barbeque Nation','Mainland China'],
            'Fast Food': ['Domino\'s','Pizza Hut','McDonald\'s','Burger King','KFC','Subway'],
            'Cloud Kitchen': ['Zomato','Swiggy']
        }
    },
    'Grocery': {
        subCategories: ['Online Grocery','Supermarket','Hypermarket','Organic Store','Wholesale'],
        merchants: {
            'Online Grocery': ['BigBasket','Blinkit','Zepto','Instamart','JioMart'],
            'Supermarket': ['DMart','Reliance Fresh','More','Nature\'s Basket','Spencer\'s'],
            'Hypermarket': ['DMart','Reliance Fresh','More'],
            'Organic Store': ['Nature\'s Basket'],
            'Wholesale': ['DMart']
        }
    },
    'Fuel': {
        subCategories: ['Petrol','Diesel','CNG','EV Charging','FASTag Recharge'],
        merchants: {
            'Petrol': ['IndianOil','HPCL','BPCL','Shell','Nayara','Jio-bp'],
            'Diesel': ['IndianOil','HPCL','BPCL','Shell','Nayara','Jio-bp'],
            'CNG': ['Indraprastha Gas','Mahanagar Gas'],
            'EV Charging': ['Ather Grid','Tata Power EZ Charge','ChargeZone','Statiq'],
            'FASTag Recharge': ['ICICI FASTag','SBI FASTag','Paytm FASTag']
        }
    },
    'Movies': {
        subCategories: ['Movie Tickets','OTT','Cinema Food'],
        merchants: {
            'Movie Tickets': ['BookMyShow','Paytm Movies','PVR INOX','Cinepolis'],
            'OTT': ['Netflix','Amazon Prime Video','Disney+ Hotstar','Sony LIV','ZEE5'],
            'Cinema Food': ['PVR INOX','Cinepolis']
        }
    },
    'Entertainment': {
        subCategories: ['Music','Gaming','OTT','Events','Theme Parks'],
        merchants: {
            'Music': ['Spotify','JioSaavn','Gaana','YouTube Premium'],
            'Gaming': ['Dream11','Steam','PlayStation Store'],
            'OTT': ['Netflix','Prime Video','Disney+ Hotstar'],
            'Events': ['BookMyShow','Paytm Tickets'],
            'Theme Parks': ['Imagicaa','Wonderla']
        }
    },
    'Lounge': {
        subCategories: ['Domestic Airport','International Airport','Railway Lounge'],
        merchants: {
            'Domestic Airport': ['DreamFolks','Priority Pass','Visa Airport Companion','Mastercard Travel Pass','Adani Lounge','Plaza Premium','Encalm Lounge'],
            'International Airport': ['DreamFolks','Priority Pass','Plaza Premium','Visa Airport Companion','Mastercard Travel Pass'],
            'Railway Lounge': ['IRCTC Lounge']
        }
    },
    'Golf': {
        subCategories: ['Golf Courses','Golf Coaching','Golf Equipment'],
        merchants: {
            'Golf Courses': ['DLF Golf','Prestige Golfshire','KGA','Oxford Golf','Jaypee Greens'],
            'Golf Coaching': ['DLF Golf','Prestige Golfshire'],
            'Golf Equipment': ['Sports18','Decathlon']
        }
    },
    'Wallet': {
        subCategories: ['Mobile Wallet','UPI Wallet','Gift Wallet','Transit Wallet'],
        merchants: {
            'Mobile Wallet': ['Paytm','PhonePe','Amazon Pay','Mobikwik','Freecharge','PayZapp','Samsung Wallet'],
            'UPI Wallet': ['Google Wallet','PhonePe','Paytm','Amazon Pay'],
            'Gift Wallet': ['Amazon Pay','Paytm','Samsung Wallet'],
            'Transit Wallet': ['Google Wallet']
        }
    },
    'Insurance': {
        subCategories: ['Health','Life','Motor','Travel','Accident','Home'],
        merchants: {
            'Health': ['HDFC ERGO','ICICI Lombard','Bajaj Allianz','Star Health','Niva Bupa','ACKO','TATA AIG'],
            'Life': ['LIC','HDFC Life','ICICI Prudential','SBI Life'],
            'Motor': ['HDFC ERGO','ICICI Lombard','Bajaj Allianz','TATA AIG','ACKO'],
            'Travel': ['HDFC ERGO','ICICI Lombard','Bajaj Allianz','TATA AIG'],
            'Accident': ['HDFC ERGO','ICICI Lombard','Bajaj Allianz','TATA AIG'],
            'Home': ['HDFC ERGO','ICICI Lombard','Bajaj Allianz','TATA AIG']
        }
    },
    'Utilities': {
        subCategories: ['Electricity','Water','Gas','Broadband','Maintenance'],
        merchants: {
            'Electricity': ['Tata Power','Adani Electricity','BESCOM','MSEB'],
            'Water': ['Municipal Water Board'],
            'Gas': ['Indraprastha Gas','Mahanagar Gas','Adani Gas'],
            'Broadband': ['Airtel Xstream','JioFiber','ACT Fibernet'],
            'Maintenance': ['Sulekha','NoBroker','Urban Company']
        }
    },
    'Healthcare': {
        subCategories: ['Hospital','Pharmacy','Diagnostics','Health Checkup'],
        merchants: {
            'Hospital': ['Apollo Hospitals','Fortis','Max Healthcare'],
            'Pharmacy': ['MedPlus','Apollo Pharmacy','PharmEasy','1mg'],
            'Diagnostics': ['Redcliffe Labs','Lal PathLabs'],
            'Health Checkup': ['Apollo Hospitals','Fortis','Max Healthcare','Redcliffe Labs','Lal PathLabs']
        }
    },
    'Education': {
        subCategories: ['School Fees','College Fees','Online Learning','Books','Certification'],
        merchants: {
            'School Fees': ['School Direct','PayU'],
            'College Fees': ['College Direct','PayU'],
            'Online Learning': ['Byju\'s','Unacademy','Coursera','Udemy','upGrad','Physics Wallah','Vedantu'],
            'Books': ['Amazon','Flipkart'],
            'Certification': ['Coursera','Udemy','upGrad','Physics Wallah','Vedantu']
        }
    },
    'Online Shopping': {
        subCategories: ['Marketplace','Brand Store','Fashion','Electronics'],
        merchants: {
            'Marketplace': ['Amazon','Flipkart'],
            'Brand Store': ['Apple','Samsung','Croma'],
            'Fashion': ['Myntra','Ajio','Nykaa'],
            'Electronics': ['Reliance Digital','Croma','Vijay Sales','Apple','Samsung']
        }
    },
    'Offline Shopping': {
        subCategories: ['Mall','Supermarket','Retail Store','Luxury Store'],
        merchants: {
            'Mall': ['Shoppers Stop','Lifestyle','Westside'],
            'Supermarket': ['DMart','Reliance Fresh','More','Nature\'s Basket'],
            'Retail Store': ['Shoppers Stop','Lifestyle','Westside','Reliance Trends'],
            'Luxury Store': ['Shoppers Stop','Lifestyle','Westside']
        }
    },
    'EMI': {
        subCategories: ['No Cost EMI','Bank EMI','Merchant EMI','Consumer Durable EMI'],
        merchants: {
            'No Cost EMI': ['Amazon','Flipkart','Croma','Reliance Digital','Vijay Sales','Apple','Samsung'],
            'Bank EMI': ['HDFC Bank','ICICI Bank','Axis Bank','SBI Card'],
            'Merchant EMI': ['Amazon','Flipkart','Croma','Reliance Digital','Vijay Sales'],
            'Consumer Durable EMI': ['Amazon','Flipkart','Croma','Reliance Digital','Vijay Sales']
        }
    },
    'Government Payments': {
        subCategories: ['Taxes','Passport','Driving License','FASTag','Municipal Tax'],
        merchants: {
            'Taxes': ['Income Tax','GST Portal'],
            'Passport': ['Passport Seva'],
            'Driving License': ['Parivahan'],
            'FASTag': ['ICICI FASTag','SBI FASTag','Paytm FASTag'],
            'Municipal Tax': ['BBMP','GHMC']
        }
    },
    'Rent': {
        subCategories: ['House Rent','Office Rent','Hostel Rent'],
        merchants: {
            'House Rent': ['Housing.com','NoBroker','MagicBricks','Paytm Rent','Cred RentPay','RedGiraffe'],
            'Office Rent': ['Housing.com','NoBroker','MagicBricks','Paytm Rent'],
            'Hostel Rent': ['Housing.com','NoBroker','MagicBricks']
        }
    },
    'Telecom': {
        subCategories: ['Mobile Recharge','Postpaid','Broadband','DTH'],
        merchants: {
            'Mobile Recharge': ['Jio','Airtel','Vi','BSNL'],
            'Postpaid': ['Jio','Airtel','Vi','BSNL'],
            'Broadband': ['ACT','Airtel Xstream','JioFiber','BSNL'],
            'DTH': ['Tata Play','Dish TV','Sun Direct']
        }
    },
    'International': {
        subCategories: ['International Shopping','International Travel','International Dining','Foreign Currency'],
        merchants: {
            'International Shopping': ['Amazon US','AliExpress'],
            'International Travel': ['Booking.com','Expedia','Airbnb'],
            'International Dining': ['Uber Eats','Zomato','Swiggy'],
            'Foreign Currency': ['BookMyForex','Thomas Cook','ICICI Forex','HDFC Forex']
        }
    },
    'Others': {
        subCategories: ['Donations','Subscriptions','Professional Services','Miscellaneous'],
        merchants: {
            'Donations': ['CRED','Google Pay','PhonePe'],
            'Subscriptions': ['Google Play','Apple App Store','Microsoft','Adobe','Canva','GitHub','ChatGPT'],
            'Professional Services': ['Sulekha','NoBroker','Urban Company'],
            'Miscellaneous': ['CRED','Paytm','PhonePe']
        }
    }
};

// ================================================================
// 3. REWARD TYPE DEEP HIERARCHIES
// ================================================================

const REWARD_TYPE_FIELDS = {
    'Reward Points': [
        { id: 'rp_pointType', label: 'Point Type', options: ['Base Points','Accelerated Points','Bonus Points','Welcome Points','Milestone Points','Promotional Points'] },
        { id: 'rp_calc', label: 'Calculation Basis', options: ['Per ₹100 Spend','Per ₹150 Spend','Per ₹200 Spend','Fixed Points','Multiplier (2X)','Multiplier (3X)','Multiplier (5X)','Multiplier (10X)'] }
    ],
    'Cashback': [
        { id: 'cb_type', label: 'Cashback Type', options: ['Flat Cashback','Percentage Cashback','Tiered Cashback','Category Cashback','Merchant Cashback'] },
        { id: 'cb_credit', label: 'Credit Method', options: ['Statement Credit','Reward Balance','Direct Bank Credit','Wallet Credit'] },
        { id: 'cb_limit', label: 'Limit', options: ['Unlimited','₹100','₹250','₹500','₹1000','₹2000','Custom'] },
        { id: 'cb_freq', label: 'Frequency', options: ['Instant','Monthly','Quarterly','Annual'] }
    ],
    'Instant Discount': [
        { id: 'id_partner', label: 'Offer Partner', options: ['Amazon','Flipkart','Myntra','Croma','Reliance Digital','Apple','Samsung','Vijay Sales','Tata CLiQ','Ajio','Swiggy','Zomato','BookMyShow','EaseMyTrip','MakeMyTrip','Yatra'] },
        { id: 'id_discount', label: 'Discount Type', options: ['5%','10%','15%','20%','25%','Flat ₹100','Flat ₹500','Flat ₹1000','Custom'] },
        { id: 'id_paymode', label: 'Payment Mode', options: ['Credit Card','EMI','No Cost EMI','Full Swipe','Tap & Pay','UPI'] },
        { id: 'id_max', label: 'Maximum Discount', options: ['₹250','₹500','₹1000','₹1500','₹2000','₹5000','Custom'] }
    ],
    'Variable Discount': [
        { id: 'vd_slab', label: 'Spend Slab', options: ['₹500+','₹1000+','₹2000+','₹5000+','₹10000+','₹25000+','₹50000+','Custom'] },
        { id: 'vd_pct', label: 'Discount %', options: ['2%','5%','7.5%','10%','12.5%','15%','20%','Custom'] },
        { id: 'vd_max', label: 'Maximum Discount', options: ['₹100','₹250','₹500','₹1000','₹2000','₹5000','Unlimited'] }
    ],
    'Voucher': [
        { id: 'v_brand', label: 'Voucher Brand', options: ['Amazon','Flipkart','Myntra','Lifestyle','Shoppers Stop','Croma','Reliance Digital','Tata CLiQ','Ajio','Swiggy','Zomato','BookMyShow','BigBasket','Blinkit','Domino\'s','Pizza Hut','Starbucks'] },
        { id: 'v_type', label: 'Voucher Type', options: ['Gift Voucher','Gift Card','Promo Code','Coupon','E-Voucher','Physical Voucher'] },
        { id: 'v_value', label: 'Voucher Value', options: ['₹100','₹250','₹500','₹1000','₹2000','₹5000','Custom'] },
        { id: 'v_delivery', label: 'Delivery Mode', options: ['Email','SMS','App','Physical Delivery'] }
    ],
    'Air Miles': [
        { id: 'am_airline', label: 'Airline Partner', options: ['Air India','IndiGo','Vistara','Singapore Airlines','British Airways','Qatar Airways','Emirates','Etihad','Lufthansa','Virgin Atlantic','Air France'] },
        { id: 'am_program', label: 'Mileage Program', options: ['Flying Returns','Club Vistara','KrisFlyer','Executive Club','Privilege Club','Skywards','Guest','Miles & More','Flying Club','Flying Blue'] },
        { id: 'am_ratio', label: 'Conversion Ratio', options: ['1:1','2:1','3:1','4:1','5:2','Custom'] },
        { id: 'am_time', label: 'Transfer Time', options: ['Instant','24 Hours','48 Hours','3-5 Days','7 Days'] }
    ],
    'Hotel Points': [
        { id: 'hp_chain', label: 'Hotel Chain', options: ['Marriott','Hilton','IHG','Accor','Hyatt','Taj','ITC','Radisson','Choice Hotels','Best Western'] },
        { id: 'hp_program', label: 'Loyalty Program', options: ['Marriott Bonvoy','Hilton Honors','IHG One Rewards','ALL Accor Live Limitless','World of Hyatt','Taj InnerCircle','Club ITC','Radisson Rewards'] },
        { id: 'hp_ratio', label: 'Conversion Ratio', options: ['1:1','2:1','3:1','4:1','5:1','Custom'] },
        { id: 'hp_time', label: 'Transfer Time', options: ['Instant','24 Hours','48 Hours','3 Days','7 Days'] }
    ],
    'Coins': [
        { id: 'c_program', label: 'Coin Program', options: ['NeuCoins','Amazon Pay Balance','Flipkart SuperCoins','Paytm Cashback Points','PhonePe Rewards','CRED Coins','PayZapp CashPoints','Magicpin Coins'] },
        { id: 'c_type', label: 'Coin Type', options: ['Reward Coins','Cash Coins','Shopping Coins','Travel Coins','Lifestyle Coins'] },
        { id: 'c_conv', label: 'Conversion', options: ['1 Coin = ₹1','1 Coin = ₹0.50','1 Coin = ₹0.25','100 Coins = ₹100','Custom'] },
        { id: 'c_validity', label: 'Validity', options: ['No Expiry','6 Months','12 Months','24 Months','Custom'] }
    ]
};

// ================================================================
// 4. HELPER FUNCTIONS
// ================================================================

function formatIndianNumber(value) {
    if (!value) return "";
    const digits = value.toString().replace(/[^\d]/g, "");
    return digits ? Number(digits).toLocaleString("en-IN") : "";
}

function getRawNumber(value) {
    return value.replace(/,/g, "");
}

function attachIndianNumberFormatting() {
    const inputs = document.querySelectorAll('#formPanel input[type="text"]');
    inputs.forEach(input => {
        const oninputAttr = input.getAttribute('oninput') || '';
        if (/replace\(\/\[\^0-9\]\/g/.test(oninputAttr) && !input.dataset.indianFormatted) {
            input.addEventListener('focus', function() {
                this.value = getRawNumber(this.value);
            });
            input.addEventListener('blur', function() {
                this.value = formatIndianNumber(this.value);
            });
            input.dataset.indianFormatted = 'true';
        }
    });
}

function createVisitOptions(selectedVal) {
    let opts = '';
    for(let i = 0; i <= 24; i++) {
        opts += `<option value="${i}" ${selectedVal == i ? 'selected' : ''}>${i}</option>`;
    }
    opts += `<option value="Unlimited" ${selectedVal == 'Unlimited' ? 'selected' : ''}>Unlimited</option>`;
    return opts;
}

// ================================================================
// 5. INITIAL PAGE & SEARCH
// ================================================================
function showInitialPage() {
    const container = document.getElementById('wizardContainer');
    let html = `
    <div id="searchPanel" class="p-3 bg-white rounded shadow-sm border">
        <h5 class="fw-bold mb-3"><i class="fas fa-search text-primary me-2"></i>Define / Retrieve Card</h5>
        <div class="row g-2 mb-3 align-items-end">
            <div class="col-md-4">
                <div class="form-floating">
                    <input type="text" id="search_card_id" class="form-control form-control-sm" placeholder="Card ID">
                    <label for="search_card_id">Card ID</label>
                </div>
            </div>
            <div class="col-md-8 d-flex align-items-center gap-2">
                <span class="text-muted small fw-bold">OR</span>
            </div>
        </div>
        <div class="row g-2 mb-3">
            <div class="col-md-2">${createSelectField('search_instrument', 'Type', ['Credit Card','Debit Card','UPI','Bank Account','Wallet','Digi Wallet','Crypto Wallet'])}</div>
            <div class="col-md-3">${createSelectField('search_issuer', 'Issuer/Bank', Object.keys(ISSUER_PRODUCTS))}</div>
            <div class="col-md-2">${createSelectField('search_product', 'Variant', [])}</div>
            <div class="col-md-3">${createSelectField('search_network', 'Network', Object.keys(NETWORKS))}</div>
            <div class="col-md-2">${createSelectField('search_subNetwork', 'Sub Network', [])}</div>
        </div>
        <div class="d-flex gap-2 justify-content-end">
            <button class="btn btn-outline-primary btn-sm" onclick="performSearch()"><i class="fas fa-download me-1"></i> Retrieve Existing</button>
            <button class="btn btn-success btn-sm" onclick="startNewCard()"><i class="fas fa-plus me-1"></i> Add New Card</button>
        </div>
    </div>
    <div id="formPanel" style="display:none;"></div>
    `;
    container.innerHTML = html;

    document.getElementById('search_issuer').addEventListener('change', function() {
        const products = ISSUER_PRODUCTS[this.value] || [];
        populateDropdown('search_product', products);
        document.getElementById('search_product').value = '';
    });
    document.getElementById('search_network').addEventListener('change', function() {
        const subNets = NETWORKS[this.value] || [];
        populateDropdown('search_subNetwork', subNets);
        document.getElementById('search_subNetwork').value = '';
    });
    document.getElementById('search_instrument').addEventListener('change', toggleSearchCardFields);
}

function startNewCard() {
    document.getElementById('searchPanel').style.display = 'none';
    document.getElementById('formPanel').style.display = 'block';
    document.getElementById('formPanel').innerHTML = buildFormPanel(null, [], false);
    attachAllListeners();
}

function performSearch() {
    document.getElementById('searchPanel').style.display = 'none';
    document.getElementById('formPanel').style.display = 'block';
    document.getElementById('formPanel').innerHTML = buildFormPanel(null, [], false);
    attachAllListeners();
}

// ================================================================
// 6. BUILD FORM PANEL (UPDATED with new detail fields)
// ================================================================
let offers = [];
let editingOfferIndex = -1;
let milestoneCount = 1;
let partnerCount = 1;

function buildFormPanel(cardData, offersData, importMode = false) {
    const data = cardData || {};
    const dataOffers = offersData || [];
    offers = dataOffers;
    editingOfferIndex = -1;
    milestoneCount = (data.benefits && data.benefits.milestoneDetails && data.benefits.milestoneDetails.length) ? data.benefits.milestoneDetails.length : 1;
    partnerCount = (data.benefits && data.benefits.partnerProgramDetails && data.benefits.partnerProgramDetails.length) ? data.benefits.partnerProgramDetails.length : 1;

    let html = '';
    
    // TOP ACTION BAR
    html += `
    <div class="row g-2 mb-3 border-bottom pb-2 bg-light p-2 rounded">
        <div class="col-md-3">
            <div class="form-floating">
                <input type="text" id="product_id" class="form-control form-control-sm" readonly value="${data.id || 'CARD-' + Date.now().toString().slice(-6)}">
                <label for="product_id">Card ID</label>
            </div>
        </div>
        <div class="col-md-9 d-flex align-items-end justify-content-end gap-2">
            ${importMode ? `
                <div class="import-btn-wrapper">
                    <span class="badge bg-info text-dark">Import Mode</span>
                    <button class="btn btn-outline-primary btn-sm" onclick="document.getElementById('excelFileInput').click()">
                        <i class="fas fa-file-import me-1"></i> Import Excel
                    </button>
                    <input type="file" id="excelFileInput" accept=".xlsx,.xls" style="display:none;" onchange="handleExcelImport(event)">
                </div>
            ` : ''}
            ${!importMode ? `<button class="btn btn-outline-success btn-sm" onclick="resetForm()"><i class="fas fa-plus me-1"></i> New Card</button>` : ''}
            <button class="btn btn-outline-secondary btn-sm" onclick="location.reload()"><i class="fas fa-redo-alt me-1"></i> Reset</button>
        </div>
    </div>`;

    // ============================================
    // SECTION 1: Card Details
    // ============================================
    html += `
    <div class="row g-3 mb-4">
        <div class="col-12">
            <div class="section-box">
                <h6><i class="fas fa-id-card me-2"></i> Card Details</h6>
                <div class="row g-2 mb-2">
                    <div class="col-md-2">${createSelectField('instrument_type', 'Type', ['Credit Card','Debit Card','UPI','Bank Account','Wallet','Digi Wallet','Crypto Wallet'], data.instrumentType)}</div>
                    <div class="col-md-3">${createSelectField('issuer', 'Issuer/Bank', Object.keys(ISSUER_PRODUCTS), data.issuer)}</div>
                    <div class="col-md-2">${createSelectField('product', 'Variant', data.issuer ? ISSUER_PRODUCTS[data.issuer] || [] : [], data.product)}</div>
                    <div class="col-md-2">${createSelectField('network', 'Network', Object.keys(NETWORKS), data.network)}</div>
                    <div class="col-md-3">${createSelectField('subNetwork', 'Sub Network', data.network ? NETWORKS[data.network] || [] : [], data.subNetwork)}</div>
                </div>
                <div class="row g-2 mt-2 pt-2 border-top">
                    <div class="col-12"><h6 class="text-primary small fw-bold mb-2"><i class="fas fa-images me-2"></i>Brand & Images</h6></div>
                    ${createUploadField('cardImg', 'Card Image')}
                    ${createUploadField('issuerImg', 'Issuer Image')}
                    ${createUploadField('networkImg', 'Network Image')}
                    ${createUploadField('onePager', 'One Pager')}
                </div>
                <div class="row g-2 mt-2">
                    <div class="col-md-4">${createSelectField('issuerCountry', 'Issuer Country', COUNTRIES, data.issuerCountry || 'India')}</div>
                    <div class="col-md-4">${createSelectField('cardStatus', 'Card Status', ['Active','Discontinued','Upcoming','ToBeDiscontinued'], data.cardStatus || '')}</div>
                    <div class="col-md-4" id="cardStatusDateWrapper" style="${(data.cardStatus === 'Upcoming' || data.cardStatus === 'ToBeDiscontinued' || data.cardStatus === 'Discontinued') ? '' : 'display:none;'}">
                        <div class="form-floating">
                            <input type="date" id="cardStatusDate" class="form-control form-control-sm" value="${data.cardStatusDate || ''}" placeholder="Effective Date">
                            <label for="cardStatusDate">Effective Date</label>
                        </div>
                    </div>
                </div>
                <div class="row g-2">
                    <div class="col-md-6">
                        <div class="form-floating">
                            <input type="url" id="cardWebLink" class="form-control form-control-sm" placeholder="https://..." pattern="https?://.+" oninput="validateUrl(this)" value="${data.webLink || ''}">
                            <label for="cardWebLink">Card Web Link</label>
                        </div>
                    </div>
                    <div class="col-md-6">
                        <div class="form-floating">
                            <input type="url" id="cardAltLink" class="form-control form-control-sm" placeholder="https://..." pattern="https?://.+" oninput="validateUrl(this)" value="${data.altLink || ''}">
                            <label for="cardAltLink">Application / Landing Page Link</label>
                        </div>
                    </div>
                </div>
                <div class="row g-2 mt-2 border-top pt-2">
                    <div class="col-md-3">
                        <div class="form-floating">
                            <input type="text" id="card_spend_per_point" class="form-control form-control-sm" value="${data.spendPerPoint || '100'}" oninput="this.value = this.value.replace(/[^0-9]/g, '').slice(0, 6);" onblur="validateMinMax(this, 2, 6)" placeholder="Spend per Reward Point (₹)">
                            <label for="card_spend_per_point">Spend per Reward Point (₹)</label>
                        </div>
                    </div>
                    <div class="col-md-3">
                        <div class="form-floating">
                            <input type="text" id="card_rp_conversion" class="form-control form-control-sm" value="${data.rpConversion || '0.25'}" oninput="this.value = this.value.replace(/[^0-9.]/g, '').slice(0, 6);" placeholder="RP Conversion Value (₹)">
                            <label for="card_rp_conversion">RP Conversion Value (₹)</label>
                        </div>
                    </div>
                    <div class="col-md-3">
                        <div class="form-floating">
                            <input type="text" id="card_apr" class="form-control form-control-sm" placeholder="e.g. 42" value="${data.apr || ''}" oninput="this.value = this.value.replace(/[^0-9.]/g, '').slice(0, 6);" title="Annual Percentage Rate charged on revolving/unpaid balance">
                            <label for="card_apr">APR %</label>
                        </div>
                    </div>
                    <div class="col-md-3">
                        ${createSelectField('card_bill_cycle_duration', 'Billing Cycle Duration', ['15 Days','18 Days','20 Days','25 Days','30 Days (Monthly)','Custom'], data.billingCycleDuration)}
                    </div>
                </div>
                <div class="row g-2">
                    <div class="col-md-4">
                        <div class="form-floating multi-select">
                            <select id="card_bill_date" class="form-select form-select-sm" multiple>
                                ${Array.from({length: 28}, (_, i) => i + 1).map(d => `<option value="${d}" ${data.billingDate && data.billingDate.split(',').includes(String(d)) ? 'selected' : ''}>${d}${d===1?'st':d===2?'nd':d===3?'rd':'th'}</option>`).join('')}
                            </select>
                            <label for="card_bill_date">Bill / Statement Date <small class="text-muted">(pick up to 5)</small></label>
                        </div>
                    </div>
                </div>
                <div class="row g-2 mt-2">
                    <div class="col-md-6">
                        <div class="form-floating">
                            <input type="text" id="cobrand" class="form-control form-control-sm" placeholder="Co-brand" value="${data.cobrand || ''}">
                            <label for="cobrand">Co-brand</label>
                        </div>
                    </div>
                    <div class="col-md-6">
                        <div class="form-floating">
                            <input type="text" id="rewardProgram" class="form-control form-control-sm" placeholder="Reward Program" value="${data.rewardProgram || ''}">
                            <label for="rewardProgram">Reward Program</label>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>`;

    // ============================================
    // SECTION 2: Eligibility, Benefits, and Detail Sections (UPDATED)
    // ============================================
    const elig = data.eligibility || {};
    html += `
    <div class="row g-3 mb-4">
        <!-- LEFT COLUMN -->
        <div class="col-md-6 d-flex flex-column order-md-1 order-2">
            <div class="section-box">
                <h6><i class="fas fa-check-circle me-2"></i> Eligibility</h6>
                <div class="row g-2 mb-2">
                    <div class="col-md-4">${createSelectField('ageMin', 'Age Min', ['All', '13+', '18+', '21+', '30+'], elig.ageMin)}</div>
                    <div class="col-md-4">${createSelectField('ageMax', 'Age Max', ['All', '<40', '<50', '<60', '<70', '<75', '<80'], elig.ageMax)}</div>
                    <div class="col-md-4">${createSelectField('creditScore', 'Credit Score', ['Any','<600','<650','<700','<750','<800','600+','650+','700+','750+','800+','850+'], elig.creditScore)}</div>
                </div>
                <div class="row g-2 mb-2">
                    <div class="col-md-4">${createSelectField('empType', 'Employment Type', ['Salaried','Business','Self Employed','All'], elig.empType)}</div>
                    <div class="col-md-4">${createSelectField('salary', 'Salary', ['NA','1.8L+','2.4L+','3L+','3.6L+','6L+','10L+','12L+','18L+','24L+','30L+'], elig.salary)}</div>
                    <div class="col-md-4">${createSelectField('productType', 'Product Type', ['General','Business','Corporate','FD backed','Invite Only','Others'], elig.productType)}</div>
                </div>
                <div class="row g-2">
                    <div class="col-md-4">${createSelectField('nationality', 'Nationality', ['Resident Indian','NRI','Foreign National','OCI / PIO','Any'], elig.nationality)}</div>
                </div>
            </div>

            <div id="feeBlockContainer" class="section-box benefit-fees-container">
                <div class="row g-2">
                    <div class="col-12 p-2 bg-light rounded border mb-2">
                        <h6 class="text-primary small fw-bold mb-1">Fees</h6>
                        <div class="row g-1">
                            <div class="col-md-4">
                                <div class="form-floating">
                                    <div class="input-group input-group-sm">
                                        <select id="fee_joining_type" class="form-select form-select-sm" style="max-width: 90px;" onchange="toggleJoiningFee()">
                                            <option value="Custom" ${data.fees && data.fees.joiningType === 'Custom' ? 'selected' : ''}>Custom</option>
                                            <option value="LTF" ${data.fees && data.fees.joiningType === 'LTF' ? 'selected' : ''}>LTF</option>
                                        </select>
                                        <input type="text" id="fee_joining" class="form-control form-control-sm" placeholder="0" value="${data.fees ? data.fees.joining : ''}" oninput="this.value = this.value.replace(/[^0-9]/g, '').slice(0, 6);" onblur="validateMinMax(this, 2, 6)">
                                    </div>
                                    <label for="fee_joining">Joining Fee</label>
                                </div>
                            </div>
                            <div class="col-md-4">
                                <div class="form-floating">
                                    <input type="text" id="fee_annual" class="form-control form-control-sm" placeholder="0" value="${data.fees ? data.fees.annual : ''}" oninput="this.value = this.value.replace(/[^0-9]/g, '').slice(0, 6);" onblur="validateMinMax(this, 2, 6)">
                                    <label for="fee_annual">Annual Fee</label>
                                </div>
                            </div>
                            <div class="col-md-4">
                                <div class="form-floating">
                                    <input type="text" id="fee_renewal" class="form-control form-control-sm" placeholder="0" value="${data.fees ? data.fees.renewal : ''}" oninput="this.value = this.value.replace(/[^0-9]/g, '').slice(0, 6);" onblur="validateMinMax(this, 2, 6)">
                                    <label for="fee_renewal">Renewal Fee</label>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="section-box">
                <div class="row g-2">
                    <div class="col-12 p-2 bg-light rounded border mb-2" id="benefit_feeWaiver_details">
                        <h6 class="text-primary small fw-bold mb-1">Fee Waiver Details</h6>
                        <div class="row g-1">
                            <div class="col-md-6">
                                <div class="form-floating">
                                    <input type="text" id="fee_waiver_spend" class="form-control form-control-sm" placeholder="e.g. 5000" value="${data.benefits && data.benefits.feeWaiverDetails ? data.benefits.feeWaiverDetails.spend : ''}" oninput="this.value = this.value.replace(/[^0-9]/g, '').slice(0, 6);" onblur="validateMinMax(this, 2, 6)">
                                    <label for="fee_waiver_spend">Spend Condition (₹)</label>
                                </div>
                            </div>
                            <div class="col-md-6">${createSelectField('fee_waiver_period', 'Period', ['Monthly','Quarterly','Half-Yearly','Yearly','Birthday','Anniversary','Festival'], data.benefits && data.benefits.feeWaiverDetails ? data.benefits.feeWaiverDetails.period : '')}</div>
                        </div>
                    </div>

                    <div class="col-12 p-2 bg-light rounded border mb-2" id="benefit_fuel_details">
                        <h6 class="text-primary small fw-bold mb-1">Fuel Surcharge Details</h6>
                        <div class="row g-1">
                            <div class="col-md-2">
                                <div class="form-floating">
                                    <input type="number" id="fuel_rate" class="form-control form-control-sm" placeholder="1" min="0" value="${data.benefits && data.benefits.fuelDetails ? data.benefits.fuelDetails.rate : ''}" oninput="if(parseFloat(this.value) < 0) this.value = 0;">
                                    <label for="fuel_rate">Fuel Waiver Rate (%)</label>
                                </div>
                            </div>
                            <div class="col-md-2">
                                <div class="form-floating">
                                    <input type="text" id="fuel_max_waiver" class="form-control form-control-sm" placeholder="500" value="${data.benefits && data.benefits.fuelDetails ? data.benefits.fuelDetails.maxWaiver : ''}" oninput="this.value = this.value.replace(/[^0-9]/g, '').slice(0, 6);" onblur="validateMinMax(this, 1, 6)">
                                    <label for="fuel_max_waiver">Max Waiver (₹)</label>
                                </div>
                            </div>
                            <div class="col-md-3">${createSelectField('fuel_period', 'Max Waiver Period', ['Monthly','Quarterly','Yearly'], data.benefits && data.benefits.fuelDetails ? data.benefits.fuelDetails.period : '')}</div>
                            <div class="col-md-3">
                                <div class="form-floating">
                                    <input type="text" id="fuel_min_tx" class="form-control form-control-sm" placeholder="500" value="${data.benefits && data.benefits.fuelDetails ? data.benefits.fuelDetails.minTx : ''}" oninput="this.value = this.value.replace(/[^0-9]/g, '').slice(0, 6);" onblur="validateMinMax(this, 1, 6)">
                                    <label for="fuel_min_tx">Min Tx (₹)</label>
                                </div>
                            </div>
                            <div class="col-md-2">
                                <div class="form-floating">
                                    <input type="text" id="fuel_max_tx" class="form-control form-control-sm" placeholder="4000" value="${data.benefits && data.benefits.fuelDetails ? data.benefits.fuelDetails.maxTx : ''}" oninput="this.value = this.value.replace(/[^0-9]/g, '').slice(0, 6);" onblur="validateMinMax(this, 1, 6)">
                                    <label for="fuel_max_tx">Max Tx (₹)</label>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="col-12 p-2 bg-light rounded border mb-2" id="benefit_welcome_details">
                        <h6 class="text-primary small fw-bold mb-1">Welcome Bonus Details</h6>
                        <div class="row g-1">
                            <div class="col-md-3">
                                <div class="form-floating">
                                    <input type="text" id="welcome_value" class="form-control form-control-sm" placeholder="500" value="${data.benefits && data.benefits.welcomeDetails ? data.benefits.welcomeDetails.value : ''}" oninput="this.value = this.value.replace(/[^0-9]/g, '').slice(0, 6);" onblur="validateMinMax(this, 2, 6)">
                                    <label for="welcome_value">Value</label>
                                </div>
                            </div>
                            <div class="col-md-3">${createSelectField('welcome_benefit_type', 'Type', ['Voucher','Rs','RP','Cashback'], data.benefits && data.benefits.welcomeDetails ? data.benefits.welcomeDetails.type : '')}</div>
                            <div class="col-md-6">
                                <div class="form-floating">
                                    <input type="text" id="welcome_free_text" class="form-control form-control-sm" placeholder="e.g., 5000 Spend in 90 Days" value="${data.benefits && data.benefits.welcomeDetails ? data.benefits.welcomeDetails.freeText : ''}">
                                    <label for="welcome_free_text">Free Text</label>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- RIGHT COLUMN -->
        <div class="col-md-6 d-flex flex-column order-md-2 order-1">
            <div class="section-box">
                <div class="d-flex justify-content-between align-items-center">
                    <h6><i class="fas fa-gift me-2"></i> Preferred Benefits</h6>
                    <button class="btn btn-outline-secondary btn-sm" onclick="document.getElementById('benefitExcelInput').click()">
                        <i class="fas fa-file-import me-1"></i> Import Preferred Benefits
                    </button>
                    <input type="file" id="benefitExcelInput" accept=".xlsx,.xls" style="display:none;" onchange="handleBenefitExcelImport(event)">
                </div>
                <div class="row g-2">
                    <div class="col-6">
                        ${createCheckbox('benefit_concierge', 'Concierge Service', data.benefits && data.benefits.concierge)}
                        ${createCheckbox('benefit_dining', 'Dining Discounts', data.benefits && data.benefits.dining)}
                        ${createCheckbox('benefit_golf', 'Golf Benefits', data.benefits && data.benefits.golf)}
                        ${createCheckbox('benefit_movie', 'Movie BOGO', data.benefits && data.benefits.movie)}
                        ${createCheckbox('benefit_spa', 'Spa/Wellness Privileges', data.benefits && data.benefits.spa)}
                        ${createCheckbox('benefit_insurance', 'Insurance Benefits', data.benefits && data.benefits.insurance)}
                        ${createCheckbox('benefit_fees', 'Fees', data.benefits && data.benefits.fees)}
                        ${createCheckbox('benefit_contactless', 'Contactless', data.benefits && data.benefits.contactless)}
                    </div>
                    <div class="col-6">
                        ${createCheckbox('benefit_welcome', 'Welcome Benefits/Bonus', data.benefits && data.benefits.welcome)}
                        ${createCheckbox('benefit_feeWaiver', 'Fee Waiver', data.benefits && data.benefits.feeWaiver)}
                        ${createCheckbox('benefit_fuel', 'Fuel Surcharge Waiver', data.benefits && data.benefits.fuel)}
                        ${createCheckbox('benefit_lounge', 'Lounge Access', data.benefits && data.benefits.lounge)}
                        ${createCheckbox('benefit_milestone', 'Milestone Bonus', data.benefits && data.benefits.milestone)}
                        ${createCheckbox('benefit_partnerProgram', 'Partner Program (Transfer Partners)', data.benefits && data.benefits.partnerProgram)}
                        ${createCheckbox('benefit_tokenEnabled', 'Token Enabled', data.benefits && data.benefits.tokenEnabled)}
                        ${createCheckbox('benefit_upiSupported', 'UPI Supported', data.benefits && data.benefits.upiSupported)}
                    </div>
                </div>
                <div id="benefitImportTables" style="margin-top: 10px;"></div>
            </div>

            <div class="section-box">
                <div class="row g-2">
                    <!-- CONCIERGE -->
                    <div class="col-12 p-2 bg-light rounded border mb-2" id="benefit_concierge_details">
                        <h6 class="text-primary small fw-bold mb-1">Concierge Service Details</h6>
                        <div class="row g-1">
                            <div class="col-12">
                                <div class="form-floating">
                                    <input type="text" id="concierge_notes" class="form-control form-control-sm" placeholder="e.g. 24/7 premium concierge" value="${data.benefits && data.benefits.conciergeDetails ? data.benefits.conciergeDetails.notes : ''}">
                                    <label for="concierge_notes">Description / Notes</label>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- DINING – updated with structured fields -->
                    <div class="col-12 p-2 bg-light rounded border mb-2" id="benefit_dining_details">
                        <h6 class="text-primary small fw-bold mb-1">Dining Discounts Details</h6>
                        <div class="row g-1">
                            <div class="col-md-3">
                                <div class="form-floating">
                                    <input type="text" id="dining_partner" class="form-control form-control-sm" placeholder="e.g. Zomato, Swiggy" value="${data.benefits && data.benefits.diningDetails ? data.benefits.diningDetails.partner : ''}">
                                    <label for="dining_partner">Partner</label>
                                </div>
                            </div>
                            <div class="col-md-2">
                                <div class="form-floating">
                                    <input type="text" id="dining_discount_type" class="form-control form-control-sm" placeholder="% or Flat" value="${data.benefits && data.benefits.diningDetails ? data.benefits.diningDetails.discountType : ''}">
                                    <label for="dining_discount_type">Discount Type</label>
                                </div>
                            </div>
                            <div class="col-md-2">
                                <div class="form-floating">
                                    <input type="text" id="dining_max_discount" class="form-control form-control-sm" placeholder="₹500" value="${data.benefits && data.benefits.diningDetails ? data.benefits.diningDetails.maxDiscount : ''}" oninput="this.value = this.value.replace(/[^0-9]/g, '').slice(0, 6);">
                                    <label for="dining_max_discount">Max Discount (₹)</label>
                                </div>
                            </div>
                            <div class="col-md-2">
                                <div class="form-floating">
                                    <input type="text" id="dining_frequency" class="form-control form-control-sm" placeholder="Monthly" value="${data.benefits && data.benefits.diningDetails ? data.benefits.diningDetails.frequency : ''}">
                                    <label for="dining_frequency">Frequency</label>
                                </div>
                            </div>
                            <div class="col-md-3">
                                <div class="form-floating">
                                    <input type="text" id="dining_min_spend" class="form-control form-control-sm" placeholder="₹1000" value="${data.benefits && data.benefits.diningDetails ? data.benefits.diningDetails.minSpend : ''}" oninput="this.value = this.value.replace(/[^0-9]/g, '').slice(0, 6);">
                                    <label for="dining_min_spend">Min Spend (₹)</label>
                                </div>
                            </div>
                            <div class="col-12">
                                <div class="form-floating">
                                    <input type="text" id="dining_notes" class="form-control form-control-sm" placeholder="Additional notes" value="${data.benefits && data.benefits.diningDetails ? data.benefits.diningDetails.notes : ''}">
                                    <label for="dining_notes">Notes</label>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- GOLF (unchanged) -->
                    <div class="col-12 p-2 bg-light rounded border mb-2" id="benefit_golf_details">
                        <h6 class="text-primary small fw-bold mb-1">Golf Benefits Details</h6>
                        <div class="row g-1">
                            <div class="col-md-4">${createSelectField('golf_courses', 'Golf Course/Program', ['DLF Golf','Prestige Golfshire','KGA','Oxford Golf','Jaypee Greens','All Partner Courses'], data.benefits && data.benefits.golfDetails ? data.benefits.golfDetails.courses : '')}</div>
                            <div class="col-md-4">
                                <div class="form-floating">
                                    <select id="golf_rounds" class="form-select form-select-sm">${createVisitOptions(data.benefits && data.benefits.golfDetails ? data.benefits.golfDetails.rounds : '')}</select>
                                    <label for="golf_rounds">Complimentary Rounds</label>
                                </div>
                            </div>
                            <div class="col-md-4">${createSelectField('golf_period', 'Period', ['Monthly','Quarterly','Half-Yearly','Yearly'], data.benefits && data.benefits.golfDetails ? data.benefits.golfDetails.period : '')}</div>
                            <div class="col-12">
                                <div class="form-floating">
                                    <input type="text" id="golf_notes" class="form-control form-control-sm" placeholder="e.g. Complimentary rounds at select courses" value="${data.benefits && data.benefits.golfDetails ? data.benefits.golfDetails.notes : ''}">
                                    <label for="golf_notes">Description / Notes</label>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- MOVIE – updated with structured fields -->
                    <div class="col-12 p-2 bg-light rounded border mb-2" id="benefit_movie_details">
                        <h6 class="text-primary small fw-bold mb-1">Movie BOGO Details</h6>
                        <div class="row g-1">
                            <div class="col-md-3">
                                <div class="form-floating">
                                    <input type="text" id="movie_partner" class="form-control form-control-sm" placeholder="e.g. BookMyShow, PVR" value="${data.benefits && data.benefits.movieDetails ? data.benefits.movieDetails.partner : ''}">
                                    <label for="movie_partner">Partner</label>
                                </div>
                            </div>
                            <div class="col-md-2">
                                <div class="form-floating">
                                    <input type="text" id="movie_discount_type" class="form-control form-control-sm" placeholder="BOGO, %" value="${data.benefits && data.benefits.movieDetails ? data.benefits.movieDetails.discountType : ''}">
                                    <label for="movie_discount_type">Discount Type</label>
                                </div>
                            </div>
                            <div class="col-md-2">
                                <div class="form-floating">
                                    <input type="text" id="movie_max_discount" class="form-control form-control-sm" placeholder="₹250" value="${data.benefits && data.benefits.movieDetails ? data.benefits.movieDetails.maxDiscount : ''}" oninput="this.value = this.value.replace(/[^0-9]/g, '').slice(0, 6);">
                                    <label for="movie_max_discount">Max Discount (₹)</label>
                                </div>
                            </div>
                            <div class="col-md-2">
                                <div class="form-floating">
                                    <input type="text" id="movie_frequency" class="form-control form-control-sm" placeholder="Monthly" value="${data.benefits && data.benefits.movieDetails ? data.benefits.movieDetails.frequency : ''}">
                                    <label for="movie_frequency">Frequency</label>
                                </div>
                            </div>
                            <div class="col-md-3">
                                <div class="form-floating">
                                    <input type="text" id="movie_ticket_limit" class="form-control form-control-sm" placeholder="2" value="${data.benefits && data.benefits.movieDetails ? data.benefits.movieDetails.ticketLimit : ''}" oninput="this.value = this.value.replace(/[^0-9]/g, '').slice(0, 2);">
                                    <label for="movie_ticket_limit">Ticket Limit</label>
                                </div>
                            </div>
                            <div class="col-md-4">
                                <div class="form-floating">
                                    <input type="text" id="movie_days" class="form-control form-control-sm" placeholder="Fri, Sat" value="${data.benefits && data.benefits.movieDetails ? data.benefits.movieDetails.days : ''}">
                                    <label for="movie_days">Applicable Days</label>
                                </div>
                            </div>
                            <div class="col-md-8">
                                <div class="form-floating">
                                    <input type="text" id="movie_notes" class="form-control form-control-sm" placeholder="Additional notes" value="${data.benefits && data.benefits.movieDetails ? data.benefits.movieDetails.notes : ''}">
                                    <label for="movie_notes">Notes</label>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- SPA – NEW structured fields -->
                    <div class="col-12 p-2 bg-light rounded border mb-2" id="benefit_spa_details">
                        <h6 class="text-primary small fw-bold mb-1">Spa/Wellness Privileges Details</h6>
                        <div class="row g-1">
                            <div class="col-md-4">
                                <div class="form-floating">
                                    <input type="text" id="spa_partner" class="form-control form-control-sm" placeholder="e.g. The Spa, Four Seasons" value="${data.benefits && data.benefits.spaDetails ? data.benefits.spaDetails.partner : ''}">
                                    <label for="spa_partner">Partner Spa</label>
                                </div>
                            </div>
                            <div class="col-md-2">
                                <div class="form-floating">
                                    <input type="text" id="spa_discount" class="form-control form-control-sm" placeholder="20%" value="${data.benefits && data.benefits.spaDetails ? data.benefits.spaDetails.discount : ''}">
                                    <label for="spa_discount">Discount (%)</label>
                                </div>
                            </div>
                            <div class="col-md-2">
                                <div class="form-floating">
                                    <input type="text" id="spa_max_discount" class="form-control form-control-sm" placeholder="₹1000" value="${data.benefits && data.benefits.spaDetails ? data.benefits.spaDetails.maxDiscount : ''}" oninput="this.value = this.value.replace(/[^0-9]/g, '').slice(0, 6);">
                                    <label for="spa_max_discount">Max Discount (₹)</label>
                                </div>
                            </div>
                            <div class="col-md-2">
                                <div class="form-floating">
                                    <input type="text" id="spa_frequency" class="form-control form-control-sm" placeholder="Monthly" value="${data.benefits && data.benefits.spaDetails ? data.benefits.spaDetails.frequency : ''}">
                                    <label for="spa_frequency">Frequency</label>
                                </div>
                            </div>
                            <div class="col-md-12">
                                <div class="form-floating">
                                    <input type="text" id="spa_notes" class="form-control form-control-sm" placeholder="Additional notes" value="${data.benefits && data.benefits.spaDetails ? data.benefits.spaDetails.notes : ''}">
                                    <label for="spa_notes">Notes</label>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- LOUNGE (unchanged) -->
                    <div class="col-12 p-2 bg-light rounded border mb-2" id="benefit_lounge_details">
                        <h6 class="text-primary small fw-bold mb-1">Lounge Access Details</h6>
                        <div class="row g-2 mb-2">
                            <div class="col-md-4">${createSelectField('lounge_program', 'Lounge Program', ['All','Priority Pass','DreamFolks','LoungeKey','Visa Airport Companion','Mastercard Airport Experiences','DragonPass'], data.benefits && data.benefits.loungeDetails ? data.benefits.loungeDetails.program : '')}</div>
                        </div>
                        <div class="row g-2 border-bottom pb-2 mb-2">
                            <div class="col-12"><span class="badge bg-secondary rounded-pill">Domestic Lounge</span></div>
                            <div class="col-md-3">
                                <div class="form-floating">
                                    <select id="lounge_dom_visits" class="form-select form-select-sm">${createVisitOptions(data.benefits && data.benefits.loungeDetails ? data.benefits.loungeDetails.domestic.visits : '')}</select>
                                    <label for="lounge_dom_visits">Visits</label>
                                </div>
                            </div>
                            <div class="col-md-3">${createSelectField('lounge_dom_period', 'Period', ['Monthly','Quarterly','Half-Yearly','Yearly'], data.benefits && data.benefits.loungeDetails ? data.benefits.loungeDetails.domestic.period : '')}</div>
                            <div class="col-md-3">
                                <div class="form-floating">
                                    <select id="lounge_dom_frequency" class="form-select form-select-sm">
                                        <option value="">Select</option>
                                        <option value="Monthly" ${data.benefits && data.benefits.loungeDetails && data.benefits.loungeDetails.domestic.frequency === 'Monthly' ? 'selected' : ''}>Monthly</option>
                                        <option value="Quarterly" ${data.benefits && data.benefits.loungeDetails && data.benefits.loungeDetails.domestic.frequency === 'Quarterly' ? 'selected' : ''}>Quarterly</option>
                                        <option value="Half-Yearly" ${data.benefits && data.benefits.loungeDetails && data.benefits.loungeDetails.domestic.frequency === 'Half-Yearly' ? 'selected' : ''}>Half-Yearly</option>
                                        <option value="Annually" ${data.benefits && data.benefits.loungeDetails && data.benefits.loungeDetails.domestic.frequency === 'Annually' ? 'selected' : ''}>Annually</option>
                                    </select>
                                    <label for="lounge_dom_frequency">Frequency</label>
                                </div>
                            </div>
                            <div class="col-md-3">
                                <div class="form-floating">
                                    <input type="text" id="lounge_dom_criteria" class="form-control form-control-sm" placeholder="Enter amount" value="${data.benefits && data.benefits.loungeDetails ? data.benefits.loungeDetails.domestic.criteria : ''}" oninput="this.value = this.value.replace(/[^0-9]/g, '').slice(0, 6);" onblur="validateMinMax(this, 2, 6)">
                                    <label for="lounge_dom_criteria">Spend Amount (₹)</label>
                                </div>
                            </div>
                        </div>
                        <div class="row g-2">
                            <div class="col-12"><span class="badge bg-secondary rounded-pill">International Lounge</span></div>
                            <div class="col-md-3">
                                <div class="form-floating">
                                    <select id="lounge_int_visits" class="form-select form-select-sm">${createVisitOptions(data.benefits && data.benefits.loungeDetails ? data.benefits.loungeDetails.international.visits : '')}</select>
                                    <label for="lounge_int_visits">Visits</label>
                                </div>
                            </div>
                            <div class="col-md-3">${createSelectField('lounge_int_period', 'Period', ['Monthly','Quarterly','Half-Yearly','Yearly'], data.benefits && data.benefits.loungeDetails ? data.benefits.loungeDetails.international.period : '')}</div>
                            <div class="col-md-3">
                                <div class="form-floating">
                                    <select id="lounge_int_frequency" class="form-select form-select-sm">
                                        <option value="">Select</option>
                                        <option value="Monthly" ${data.benefits && data.benefits.loungeDetails && data.benefits.loungeDetails.international.frequency === 'Monthly' ? 'selected' : ''}>Monthly</option>
                                        <option value="Quarterly" ${data.benefits && data.benefits.loungeDetails && data.benefits.loungeDetails.international.frequency === 'Quarterly' ? 'selected' : ''}>Quarterly</option>
                                        <option value="Half-Yearly" ${data.benefits && data.benefits.loungeDetails && data.benefits.loungeDetails.international.frequency === 'Half-Yearly' ? 'selected' : ''}>Half-Yearly</option>
                                        <option value="Annually" ${data.benefits && data.benefits.loungeDetails && data.benefits.loungeDetails.international.frequency === 'Annually' ? 'selected' : ''}>Annually</option>
                                    </select>
                                    <label for="lounge_int_frequency">Frequency</label>
                                </div>
                            </div>
                            <div class="col-md-3">
                                <div class="form-floating">
                                    <input type="text" id="lounge_int_criteria" class="form-control form-control-sm" placeholder="Enter amount" value="${data.benefits && data.benefits.loungeDetails ? data.benefits.loungeDetails.international.criteria : ''}" oninput="this.value = this.value.replace(/[^0-9]/g, '').slice(0, 6);" onblur="validateMinMax(this, 2, 6)">
                                    <label for="lounge_int_criteria">Spend Amount (₹)</label>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- MILESTONE (unchanged) -->
                    <div class="col-12 p-2 bg-light rounded border mb-2" id="benefit_milestone_details">
                        <div class="d-flex justify-content-between align-items-center mb-1">
                            <h6 class="text-primary small fw-bold m-0">Milestone Details</h6>
                            <button type="button" class="btn btn-outline-primary btn-sm py-0 px-2" onclick="addMilestoneSlab()"><i class="fas fa-plus me-1"></i>Additional Milestone</button>
                        </div>
                        <div id="milestoneSlabsContainer">
                            ${(data.benefits && data.benefits.milestoneDetails && data.benefits.milestoneDetails.length ? data.benefits.milestoneDetails : [null]).map((slab, i) => createMilestoneSlab(i + 1, slab)).join('')}
                        </div>
                    </div>

                    <!-- INSURANCE (unchanged) -->
                    <div class="col-12 p-2 bg-light rounded border mb-2" id="benefit_insurance_details">
                        <h6 class="text-primary small fw-bold mb-1">Insurance Benefits Details</h6>
                        <div class="row g-1 mb-1">
                            <div class="col-6">${createCheckbox('ins_travel', 'Travel Insurance', data.benefits && data.benefits.insuranceDetails && data.benefits.insuranceDetails.travel)}</div>
                            <div class="col-6">${createCheckbox('ins_purchaseProtection', 'Purchase Protection', data.benefits && data.benefits.insuranceDetails && data.benefits.insuranceDetails.purchaseProtection)}</div>
                            <div class="col-6">${createCheckbox('ins_personalAccident', 'Personal Accident Cover', data.benefits && data.benefits.insuranceDetails && data.benefits.insuranceDetails.personalAccident)}</div>
                            <div class="col-6">${createCheckbox('ins_extendedWarranty', 'Extended Warranty', data.benefits && data.benefits.insuranceDetails && data.benefits.insuranceDetails.extendedWarranty)}</div>
                            <div class="col-6">${createCheckbox('ins_lostCardLiability', 'Lost Card / Fraud Liability', data.benefits && data.benefits.insuranceDetails && data.benefits.insuranceDetails.lostCardLiability)}</div>
                        </div>
                        <div class="row g-1">
                            <div class="col-md-5">
                                <div class="form-floating">
                                    <input type="text" id="ins_provider" class="form-control form-control-sm" placeholder="e.g. TATA AIG, ICICI Lombard" value="${data.benefits && data.benefits.insuranceDetails ? data.benefits.insuranceDetails.provider : ''}">
                                    <label for="ins_provider">Insurance Provider</label>
                                </div>
                            </div>
                            <div class="col-md-4">
                                <div class="form-floating">
                                    <input type="text" id="ins_coverage" class="form-control form-control-sm" placeholder="e.g. 5000000" value="${data.benefits && data.benefits.insuranceDetails ? data.benefits.insuranceDetails.coverage : ''}" oninput="this.value = this.value.replace(/[^0-9]/g, '').slice(0, 9);">
                                    <label for="ins_coverage">Coverage Amount (₹)</label>
                                </div>
                            </div>
                            <div class="col-md-3">
                                <div class="form-floating">
                                    <input type="url" id="ins_policyLink" class="form-control form-control-sm" placeholder="https://..." value="${data.benefits && data.benefits.insuranceDetails ? data.benefits.insuranceDetails.policyLink : ''}">
                                    <label for="ins_policyLink">Policy Doc Link</label>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- PARTNER PROGRAM (unchanged) -->
                    <div class="col-12 p-2 bg-light rounded border mb-2" id="benefit_partnerProgram_details">
                        <div class="d-flex justify-content-between align-items-center mb-1">
                            <h6 class="text-primary small fw-bold m-0">Partner Program Details <small class="text-muted">(e.g. Marriott Bonvoy)</small></h6>
                            <button type="button" class="btn btn-outline-primary btn-sm py-0 px-2" onclick="addPartnerRow()"><i class="fas fa-plus me-1"></i>Add Partner</button>
                        </div>
                        <div id="partnerProgramContainer">
                            ${(data.benefits && data.benefits.partnerProgramDetails && data.benefits.partnerProgramDetails.length ? data.benefits.partnerProgramDetails : [null]).map((p, i) => createPartnerRow(i + 1, p)).join('')}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>`;

    // ============================================
    // SECTION 3: Offers / Rewards
    // ============================================
    html += `
    <div class="mt-3 border-top pt-3">
        <div class="d-flex justify-content-between align-items-center mb-3">
            <h5 class="fw-bold text-primary m-0"><i class="fas fa-tags me-2"></i> Manage Offers</h5>
            <div>
                <button type="button" class="btn btn-primary" onclick="addOfferRow()"><i class="fas fa-plus me-2"></i> Add Offer</button>
                <button type="button" class="btn btn-outline-secondary" onclick="importOffers()"><i class="fas fa-file-import me-2"></i> Import Offers</button>
                <input type="file" id="offerExcelInput" accept=".xlsx,.xls" style="display:none;" onchange="handleOfferExcelImport(event)">
            </div>
        </div>
        <div id="offersContainer"></div>
    </div>
    <div id="offerTableContainer" class="mt-3" style="display:none;">
        <h6 class="fw-bold text-dark mb-2">Saved Offers</h6>
        <div class="table-custom">
            <table class="table table-hover mb-0" id="offerTable">
                <thead><tr><th>#</th><th>Category</th><th>Reward Type</th><th>Min-Max Tx</th><th>Max Benefit</th><th>Date Range</th><th>Link</th><th>Actions</th></tr></thead>
                <tbody id="offerTableBody"></tbody>
            </table>
        </div>
    </div>
    <div class="mt-3 text-end">
        <button class="btn btn-success" onclick="saveAllToDatabase()"><i class="fas fa-save me-2"></i> Save Card & All Offers to Database</button>
    </div>`;

    return html;
}

// ================================================================
// 7. HELPER FUNCTIONS
// ================================================================

// Every dropdown option list renders alphabetically (number-aware, case-insensitive).
// "ALL" / "All" sentinels stay pinned to the top.
const cmpAlpha = (a, b) => String(a).localeCompare(String(b), undefined, { numeric: true, sensitivity: 'base' });
function sortOptions(options) {
    const pinned = v => (v === 'ALL' || v === 'All') ? 0 : 1;
    return [...options].sort((a, b) => pinned(a) - pinned(b) || cmpAlpha(a, b));
}

function createSelectField(id, label, options, value = '', onChange = '') {
    let opts = sortOptions(options).map(o => `<option value="${o}" ${value === o ? 'selected' : ''}>${o}</option>`).join('');
    let placeholderOpt = `<option value="" ${!value ? 'selected' : ''}></option>`;
    const changeAttr = onChange ? ` onchange="${onChange}"` : '';
    return `<div class="form-floating mb-1${value ? ' filled' : ''}">
        <select id="${id}" class="form-select form-select-sm"${changeAttr}>${placeholderOpt}${opts}</select>
        <label for="${id}">${label}</label>
    </div>`;
}

function createUploadField(id, label) {
    return `
    <div class="col-3">
        <div class="upload-zone" onclick="document.getElementById('file_${id}').click()">
            <button class="remove-btn" id="remove_${id}" onclick="event.stopPropagation(); removeImage('${id}')"><i class="fas fa-times"></i></button>
            <div id="preview_${id}" style="display:none;"><img id="img_${id}" style="max-width:100%;max-height:80px;"></div>
            <div id="placeholder_${id}" class="text-muted small"><i class="fas fa-cloud-upload-alt fa-2x mb-1"></i><br>${label}</div>
            <input type="file" id="file_${id}" accept="image/*" style="display:none;" onchange="previewImage(this, '${id}')">
        </div>
    </div>`;
}

function createCheckbox(id, label, isChecked) {
    return `<div class="form-check"><input class="form-check-input" type="checkbox" id="${id}" ${isChecked ? 'checked' : ''}><label class="form-check-label small fw-semibold" for="${id}">${label}</label></div>`;
}

function createMilestoneSlab(num, slabData = null) {
    return `
    <div class="row g-1 border-bottom pb-1 mb-1 milestone-slab-row" data-slab="${num}">
        <div class="col-12 d-flex justify-content-between align-items-center">
            <small class="fw-bold text-secondary">Slab ${num}</small>
            <button type="button" class="btn btn-outline-danger btn-sm py-0 px-1" onclick="removeMilestoneSlab(${num})" title="Delete this slab"><i class="fas fa-trash"></i></button>
        </div>
        <div class="col-md-3">
            <div class="form-floating">
                <input type="text" id="milestone_amt_${num}" class="form-control form-control-sm" placeholder="e.g. 100" value="${slabData ? slabData.amount : ''}" oninput="this.value = this.value.replace(/[^0-9]/g, '').slice(0, 7);" onblur="validateMinMax(this, 3, 7)">
                <label for="milestone_amt_${num}">Amount Spent</label>
            </div>
        </div>
        <div class="col-md-3">${createSelectField(`milestone_period_${num}`, 'Duration / Period', ['Monthly','Quarterly','Half-Yearly','Yearly'], slabData ? slabData.period : '')}</div>
        <div class="col-md-2">
            <div class="form-floating">
                <input type="text" id="milestone_benefit_val_${num}" class="form-control form-control-sm" placeholder="500" value="${slabData ? slabData.benefitValue : ''}" oninput="this.value = this.value.replace(/[^0-9]/g, '').slice(0, 7);" onblur="validateMinMax(this, 2, 7)">
                <label for="milestone_benefit_val_${num}">Value</label>
            </div>
        </div>
        <div class="col-md-2">${createSelectField(`milestone_benefit_type_${num}`, 'Type', ['Voucher','Rs','RP','Cashback'], slabData ? slabData.benefitType : '')}</div>
        <div class="col-md-2">
            <div class="form-floating">
                <input type="text" id="milestone_benefit_comment_${num}" class="form-control form-control-sm" placeholder="Free text" value="${slabData ? slabData.benefitComment : ''}">
                <label for="milestone_benefit_comment_${num}">Comment</label>
            </div>
        </div>
    </div>
    `;
}

function createPartnerRow(num, rowData = null) {
    const hotelPrograms = REWARD_TYPE_FIELDS['Hotel Points'][1].options;
    const airlinePrograms = REWARD_TYPE_FIELDS['Air Miles'][1].options;
    return `
    <div class="row g-1 border-bottom pb-1 mb-1 partner-row" data-partner="${num}">
        <div class="col-12 d-flex justify-content-between align-items-center">
            <small class="fw-bold text-secondary">Partner ${num}</small>
            <button type="button" class="btn btn-outline-danger btn-sm py-0 px-1" onclick="removePartnerRow(${num})" title="Delete this partner"><i class="fas fa-trash"></i></button>
        </div>
        <div class="col-md-4">${createSelectField(`partner_program_${num}`, 'Partner Program', ['', ...hotelPrograms, ...airlinePrograms, 'Amex Membership Rewards','Citi PremierMiles','Others'], rowData ? rowData.program : '')}</div>
        <div class="col-md-3">${createSelectField(`partner_ratio_${num}`, 'Conversion Ratio', ['1:1','2:1','3:1','4:1','5:1','5:2','Custom'], rowData ? rowData.ratio : '')}</div>
        <div class="col-md-3">
            <div class="form-floating">
                <input type="text" id="partner_minTransfer_${num}" class="form-control form-control-sm" placeholder="e.g. 1000" value="${rowData ? rowData.minTransfer : ''}" oninput="this.value = this.value.replace(/[^0-9]/g, '').slice(0, 7);">
                <label for="partner_minTransfer_${num}">Min Transfer (Points)</label>
            </div>
        </div>
        <div class="col-md-2">${createSelectField(`partner_transferTime_${num}`, 'Transfer Time', ['Instant','24 Hours','48 Hours','3-5 Days','7 Days'], rowData ? rowData.transferTime : '')}</div>
    </div>
    `;
}

function addPartnerRow() {
    partnerCount++;
    document.getElementById('partnerProgramContainer').insertAdjacentHTML('beforeend', createPartnerRow(partnerCount));
}

function removePartnerRow(num) {
    const row = document.querySelector(`.partner-row[data-partner="${num}"]`);
    if (row) row.remove();
}

function addMilestoneSlab() {
    const overlay = document.getElementById('milestoneModalOverlay');
    const input = document.getElementById('milestoneCountInput');
    input.value = 1;
    overlay.style.display = 'flex';
    input.focus();
}

function closeMilestoneModal() {
    document.getElementById('milestoneModalOverlay').style.display = 'none';
}

function confirmAddMilestones() {
    const input = document.getElementById('milestoneCountInput');
    const count = parseInt(input.value, 10);
    if (!count || count < 1) {
        input.classList.add('is-invalid');
        return;
    }
    const container = document.getElementById('milestoneSlabsContainer');
    for (let i = 0; i < count; i++) {
        milestoneCount++;
        container.insertAdjacentHTML('beforeend', createMilestoneSlab(milestoneCount));
    }
    closeMilestoneModal();
}

function removeMilestoneSlab(num) {
    const row = document.querySelector(`.milestone-slab-row[data-slab="${num}"]`);
    if (row) row.remove();
}

function validateMinMax(input, min, max) {
    const val = input.value;
    const len = val.length;
    if (val && (len < min || len > max)) {
        input.classList.add('is-invalid');
    } else {
        input.classList.remove('is-invalid');
    }
}

function validateUrl(input) {
    if (input.value && !input.value.match(/^https?:\/\/.+/)) {
        input.classList.remove('is-valid');
        input.classList.add('is-invalid');
    } else if (input.value) {
        input.classList.remove('is-invalid');
        input.classList.add('is-valid');
    } else {
        input.classList.remove('is-valid', 'is-invalid');
    }
}

function previewImage(input, id) {
    const file = input.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            document.getElementById(`img_${id}`).src = e.target.result;
            document.getElementById(`preview_${id}`).style.display = 'block';
            document.getElementById(`placeholder_${id}`).style.display = 'none';
            document.getElementById(`remove_${id}`).style.display = 'flex';
        };
        reader.readAsDataURL(file);
    }
}

function removeImage(id) {
    document.getElementById(`file_${id}`).value = '';
    document.getElementById(`preview_${id}`).style.display = 'none';
    document.getElementById(`placeholder_${id}`).style.display = 'block';
    document.getElementById(`remove_${id}`).style.display = 'none';
}

// ================================================================
// 8. LOGIC FUNCTIONS
// ================================================================

function toggleCardFields() {
    const instrument = document.getElementById('instrument_type').value;
    setFieldEnabled('issuer', true);
    setFieldEnabled('product', true);
    setFieldEnabled('network', true);
    setFieldEnabled('subNetwork', true);
    if (instrument === 'UPI') {
        setFieldEnabled('product', false); clearFieldValue('product');
        setFieldEnabled('network', false); clearFieldValue('network');
        setFieldEnabled('subNetwork', false); clearFieldValue('subNetwork');
    } else if (['Bank Account', 'Wallet', 'Digi Wallet', 'Crypto Wallet'].includes(instrument)) {
        setFieldEnabled('network', false); clearFieldValue('network');
        setFieldEnabled('subNetwork', false); clearFieldValue('subNetwork');
    }
}

function toggleSearchCardFields() {
    const instrument = document.getElementById('search_instrument').value;
    const product = document.getElementById('search_product');
    const network = document.getElementById('search_network');
    const subNetwork = document.getElementById('search_subNetwork');
    product.disabled = false;
    network.disabled = false;
    subNetwork.disabled = false;
    if (instrument === 'UPI') {
        product.disabled = true; product.value = '';
        network.disabled = true; network.value = '';
        subNetwork.disabled = true; subNetwork.value = '';
    } else if (['Bank Account', 'Wallet', 'Digi Wallet', 'Crypto Wallet'].includes(instrument)) {
        network.disabled = true; network.value = '';
        subNetwork.disabled = true; subNetwork.value = '';
    }
}

function toggleJoiningFee() {
    const type = document.getElementById('fee_joining_type').value;
    const joiningFeeInput = document.getElementById('fee_joining');
    const annualFeeInput = document.getElementById('fee_annual');
    const renewalFeeInput = document.getElementById('fee_renewal');
    const feeWaiverDetails = document.getElementById('benefit_feeWaiver_details');
    const fuelDetails = document.getElementById('benefit_fuel_details');
    const fuelCheckbox = document.getElementById('benefit_fuel');
    const feeWaiverCheckbox = document.getElementById('benefit_feeWaiver');
    if (type === 'LTF') {
        joiningFeeInput.disabled = true; joiningFeeInput.value = '';
        annualFeeInput.disabled = true; annualFeeInput.value = '';
        renewalFeeInput.disabled = true; renewalFeeInput.value = '';
        feeWaiverDetails.style.display = 'none';
        feeWaiverDetails.querySelectorAll('input, select').forEach(el => el.disabled = true);
        fuelDetails.style.display = 'none';
        fuelDetails.querySelectorAll('input, select').forEach(el => el.disabled = true);
    } else {
        joiningFeeInput.disabled = false;
        annualFeeInput.disabled = false;
        renewalFeeInput.disabled = false;
        toggleBenefitTable(feeWaiverCheckbox, feeWaiverDetails);
        toggleBenefitTable(fuelCheckbox, fuelDetails);
    }
}

let billDateChoicesInstance = null;

function initBillDateChoices(selectedValues = []) {
    const el = document.getElementById('card_bill_date');
    if (!el) return;
    if (billDateChoicesInstance) { billDateChoicesInstance.destroy(); billDateChoicesInstance = null; }
    if (typeof Choices !== 'undefined') {
        billDateChoicesInstance = new Choices(el, {
            removeItemButton: true,
            searchEnabled: true,
            searchPlaceholderValue: 'Search date...',
            placeholder: true,
            placeholderValue: '— Select up to 5 dates —',
            maxItemCount: 5,
            maxItemText: (max) => `Only ${max} bill dates can be selected`,
            shouldSort: false,
            allowHTML: true,
            itemSelectText: ''
        });
        if (selectedValues.length) billDateChoicesInstance.setChoiceByValue(selectedValues);
    } else if (selectedValues.length) {
        Array.from(el.options).forEach(o => { o.selected = selectedValues.includes(o.value); });
    }
}

const singleChoicesInstances = {};

function initSearchableSelect(id, placeholderText) {
    const el = document.getElementById(id);
    if (!el || typeof Choices === 'undefined') return null;
    if (singleChoicesInstances[id]) {
        try { singleChoicesInstances[id].destroy(); } catch (e) {}
        delete singleChoicesInstances[id];
    }
    singleChoicesInstances[id] = new Choices(el, {
        searchEnabled: true,
        searchPlaceholderValue: 'Search...',
        placeholder: true,
        placeholderValue: placeholderText || '',
        shouldSort: false,
        allowHTML: true,
        itemSelectText: ''
    });
    return singleChoicesInstances[id];
}

function setSelectOptions(id, options, selectedValue = '') {
    const choicesArr = [{ value: '', label: '', selected: !selectedValue }].concat(sortOptions(options).map(o => ({ value: o, label: o, selected: o === selectedValue })));
    const inst = singleChoicesInstances[id];
    if (inst) {
        inst.clearStore();
        inst.setChoices(choicesArr, 'value', 'label', true);
    } else {
        const el = document.getElementById(id);
        if (el) el.innerHTML = choicesArr.map(c => `<option value="${c.value}" ${c.selected ? 'selected' : ''}>${c.label}</option>`).join('');
    }
}

function setFieldEnabled(id, enabled) {
    const el = document.getElementById(id);
    const inst = singleChoicesInstances[id];
    if (inst) { enabled ? inst.enable() : inst.disable(); }
    if (el) el.disabled = !enabled;
}

function clearFieldValue(id) {
    const el = document.getElementById(id);
    const inst = singleChoicesInstances[id];
    if (inst) { inst.removeActiveItems(); }
    if (el) el.value = '';
}

function attachCardListeners() {
    document.getElementById('issuer').addEventListener('change', function() {
        const products = ISSUER_PRODUCTS[this.value] || [];
        setSelectOptions('product', products);
    });
    document.getElementById('network').addEventListener('change', function() {
        const subNets = NETWORKS[this.value] || [];
        setSelectOptions('subNetwork', subNets);
    });
    document.getElementById('instrument_type').addEventListener('change', toggleCardFields);
    document.getElementById('cardStatus').addEventListener('change', toggleCardStatusDate);
}

function toggleCardStatusDate() {
    const status = document.getElementById('cardStatus').value;
    const dateWrapper = document.getElementById('cardStatusDateWrapper');
    if (status === 'Upcoming' || status === 'ToBeDiscontinued' || status === 'Discontinued') {
        dateWrapper.style.display = '';
    } else {
        dateWrapper.style.display = 'none';
        document.getElementById('cardStatusDate').value = '';
    }
}

function toggleFeesBlock() {
    const checkbox = document.getElementById('benefit_fees');
    const feeBlock = document.getElementById('feeBlockContainer');
    if (!checkbox || !feeBlock) return;
    if (checkbox.checked) {
        feeBlock.classList.remove('benefit-hidden');
        feeBlock.querySelectorAll('input, select').forEach(el => el.disabled = false);
    } else {
        feeBlock.classList.add('benefit-hidden');
        feeBlock.querySelectorAll('input, select').forEach(el => el.disabled = true);
    }
}

function toggleBenefitTable(checkbox, container) {
    if (container.id === 'benefit_feeWaiver_details' && document.getElementById('fee_joining_type').value === 'LTF') {
        container.style.display = 'none';
        container.querySelectorAll('input, select').forEach(inp => inp.disabled = true);
        return;
    }
    if (checkbox.checked) {
        container.style.display = '';
        container.querySelectorAll('input, select').forEach(inp => inp.disabled = false);
    } else {
        container.style.display = 'none';
        container.querySelectorAll('input, select').forEach(inp => inp.disabled = true);
    }
}

function attachBenefitListeners() {
    const benefits = [
        { id: 'benefit_concierge', detailsId: 'benefit_concierge_details' },
        { id: 'benefit_dining', detailsId: 'benefit_dining_details' },
        { id: 'benefit_golf', detailsId: 'benefit_golf_details' },
        { id: 'benefit_movie', detailsId: 'benefit_movie_details' },
        { id: 'benefit_spa', detailsId: 'benefit_spa_details' },
        { id: 'benefit_feeWaiver', detailsId: 'benefit_feeWaiver_details' },
        { id: 'benefit_fuel', detailsId: 'benefit_fuel_details' },
        { id: 'benefit_lounge', detailsId: 'benefit_lounge_details' },
        { id: 'benefit_milestone', detailsId: 'benefit_milestone_details' },
        { id: 'benefit_welcome', detailsId: 'benefit_welcome_details' },
        { id: 'benefit_insurance', detailsId: 'benefit_insurance_details' },
        { id: 'benefit_partnerProgram', detailsId: 'benefit_partnerProgram_details' }
    ];
    benefits.forEach(b => {
        const checkbox = document.getElementById(b.id);
        const details = document.getElementById(b.detailsId);
        if (checkbox && details) {
            toggleBenefitTable(checkbox, details);
            checkbox.addEventListener('change', function() {
                toggleBenefitTable(checkbox, details);
            });
        }
    });
    const feesCheckbox = document.getElementById('benefit_fees');
    if (feesCheckbox) {
        toggleFeesBlock();
        feesCheckbox.addEventListener('change', toggleFeesBlock);
    }
}

function populateDropdown(id, options) {
    const el = document.getElementById(id);
    if(!el) return;
    el.innerHTML = '<option value=""></option>' + sortOptions(options).map(o => `<option value="${o}">${o}</option>`).join('');
}

function attachAllListeners() {
    attachCardListeners();
    attachBenefitListeners();
    attachIndianNumberFormatting();
    toggleJoiningFee();
    renderOfferTable();
    initBillDateChoices([]);
    initSearchableSelect('issuer', 'Search Issuer/Bank...');
    initSearchableSelect('product', 'Search Variant...');
    initSearchableSelect('network', 'Search Network...');
    initSearchableSelect('subNetwork', 'Search Sub Network...');
    initSearchableSelect('issuerCountry', 'Search Country...');
    initSearchableSelect('cardStatus', 'Select Status...');
    toggleCardFields();
    toggleFeesBlock();
    toggleCardStatusDate();
    if (offers.length > 0) {
        document.getElementById('offerTableContainer').style.display = 'block';
    }

    document.querySelectorAll('.form-floating select').forEach(sel => {
        sel.addEventListener('change', function() {
            this.closest('.form-floating').classList.toggle('filled', this.value !== '');
        });
        if (sel.value !== '') {
            sel.closest('.form-floating').classList.add('filled');
        }
    });
}

// ================================================================
// 9. OFFER ROW ENGINE
// ================================================================

function addOfferRow(data = null) {
    const container = document.getElementById('offersContainer');
    const index = document.querySelectorAll('.offer-row').length;
    const isEdit = !!data;
    const row = document.createElement('div');
    row.className = 'offer-row';
    row.dataset.index = index;
    let html = `
    <div class="d-flex justify-content-between align-items-center mb-2 border-bottom pb-2">
        <h6 class="fw-bold text-success m-0">${isEdit ? 'Edit' : 'New'} Offer #${index + 1}</h6>
        <button class="btn btn-outline-danger btn-sm" onclick="removeOfferRow(${index})"><i class="fas fa-trash"></i></button>
    </div>
    <div class="row g-2 mb-2 align-items-end">
        <div class="col-md-2">${createSelectField(`payment_scope_${index}`, 'Apply Rule By', ['Category','Payment Mode','Location','Merchant'], data ? data.paymentScopeType : '')}</div>
        <div class="col-md-3">
            <div class="form-floating">
                <select id="scope_value_${index}" class="form-select form-select-sm" multiple></select>
                <label>Apply Value</label>
            </div>
        </div>
        <div class="col-md-2">${createSelectField(`global_rp_expiry_${index}`, 'RP Expiry', ['No Expiry','12 Months','24 Months','36 Months','Custom'], data ? data.rpExpiry : '')}</div>
    </div>
    <div class="row g-2 mb-2 align-items-end">
        <div class="col-md-4">${createSelectField(`offer_${index}_category`, 'Category', ['ALL', ...Object.keys(CATEGORY_HIERARCHY)], data ? data.category : '', `onOfferCategoryChange(${index})`)}</div>
        <div class="col-md-4">${createSelectField(`offer_${index}_subCategory`, 'Sub Category', [])}</div>
        <div class="col-md-4">${createSelectField(`offer_${index}_rewardType`, 'Reward Type', Object.keys(REWARD_TYPE_FIELDS), data ? data.rewardType : '', `onRewardTypeChange(${index})`)}</div>
    </div>
    <div id="offer_${index}_rewardFields"></div>
    <div class="row g-2 mb-2">
        <div class="col-md-2">${createSelectField(`offer_${index}_frequency`, 'Frequency', ['One Time','Monthly','Quarterly','Yearly'], data ? data.frequency : '')}</div>
        <div class="col-md-2">${createSelectField(`offer_${index}_status`, 'Status', ['Active','Inactive'], data ? data.status : '')}</div>
        <div class="col-md-3">${createSelectField(`offer_${index}_days`, 'Applicable Days', ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday','Weekdays','Weekends','All Days'], data ? data.days : '')}</div>
        <div class="col-md-2">${createSelectField(`offer_${index}_instance_period`, 'Instance Period', ['Per Transaction','Daily','Weekly','Monthly','Quarterly','Half-Yearly','Yearly'], data ? data.instancePeriod : '')}</div>
        <div class="col-md-3">${createSelectField(`offer_${index}_person`, 'Applicable Person', ['Primary','Family','Cardholder','Spouse','Children','All Members'], data ? data.person : '')}</div>
    </div>
    <div class="row g-2 mb-2">
        <div class="col-md-3">
            <div class="form-floating">
                <input type="text" id="offer_${index}_minTx" class="form-control form-control-sm" placeholder="0" value="${data ? data.minTx : ''}" oninput="this.value = this.value.replace(/[^0-9]/g, '').slice(0, 6);">
                <label for="offer_${index}_minTx">Min Transaction</label>
            </div>
        </div>
        <div class="col-md-3">
            <div class="form-floating">
                <input type="text" id="offer_${index}_maxTx" class="form-control form-control-sm" placeholder="999999" value="${data ? data.maxTx : ''}" oninput="this.value = this.value.replace(/[^0-9]/g, '').slice(0, 6);">
                <label for="offer_${index}_maxTx">Max Transaction</label>
            </div>
        </div>
        <div class="col-md-3">
            <div class="form-floating">
                <input type="text" id="offer_${index}_maxBenefit" class="form-control form-control-sm" placeholder="1000" value="${data ? data.maxBenefit : ''}" oninput="this.value = this.value.replace(/[^0-9]/g, '').slice(0, 6);">
                <label for="offer_${index}_maxBenefit">Max Benefit (₹)</label>
            </div>
        </div>
        <div class="col-md-3">
            <div class="form-floating">
                <input type="url" id="offer_${index}_weblink" class="form-control form-control-sm" placeholder="https://..." value="${data ? data.weblink : ''}">
                <label for="offer_${index}_weblink">Web Link</label>
            </div>
        </div>
    </div>
    <div class="row g-2 mb-2">
        <div class="col-md-3">
            <div class="form-floating">
                <input type="date" id="offer_${index}_startDate" class="form-control form-control-sm" value="${data ? data.startDate : ''}" placeholder="Start Date">
                <label for="offer_${index}_startDate">Start Date</label>
            </div>
        </div>
        <div class="col-md-3">
            <div class="form-floating">
                <input type="date" id="offer_${index}_endDate" class="form-control form-control-sm" value="${data ? data.endDate : ''}" placeholder="End Date">
                <label for="offer_${index}_endDate">End Date</label>
            </div>
        </div>
        <div class="col-md-3">
            <div class="form-floating">
                <input type="text" id="offer_${index}_couponCode" class="form-control form-control-sm" placeholder="e.g. SUMMER20" value="${data ? data.couponCode || '' : ''}">
                <label for="offer_${index}_couponCode">Coupon Code</label>
            </div>
        </div>
        <div class="col-md-3">${createSelectField(`offer_${index}_platform`, 'Platform', ['Zomato Gold','Smart Buy','Other'], data ? data.platform : '', `toggleCustomPlatform(${index})`)}</div>
    </div>
    <div class="row g-2 mb-2" id="offer_${index}_customPlatformRow" style="${data && data.platform === 'Other' ? '' : 'display:none;'}">
        <div class="col-md-3 offset-md-9">
            <div class="form-floating">
                <input type="text" id="offer_${index}_customPlatform" class="form-control form-control-sm" placeholder="Enter platform name" value="${data && data.platform === 'Other' ? (data.customPlatform || '') : ''}">
                <label for="offer_${index}_customPlatform">Custom Platform</label>
            </div>
        </div>
    </div>
    <H3><small class="text-muted">Optional Filters</small></H3>
    <div class="row g-2 mb-2 border-top pt-2">
        <div class="col-md-6">
            <div class="form-floating">
                <input type="text" id="offer_${index}_mcc" class="form-control form-control-sm" placeholder="e.g. 5411, 5812" value="${data ? (data.mcc || '') : ''}" onblur="validateMcc(this)">
                <label for="offer_${index}_mcc">MCC Code(s)</label>
            </div>
        </div>
        <div class="col-md-6">
            <div class="form-floating">
                <select id="offer_${index}_merchant" class="form-select form-select-sm" multiple></select>
                <label>Merchant</label>
            </div>
        </div>
        <div class="col-md-6 text-end align-self-center"></div>
        <div class="col-md-6 text-end align-self-center">
            <button class="btn btn-success btn-sm" onclick="saveOffer(${index})"><i class="fas fa-save me-1"></i> Save to List</button>
        </div>
    </div>`;
    row.innerHTML = html;
    container.appendChild(row);
    attachIndianNumberFormatting();
    initMerchantChoices(index);
    initScopeValueChoices(index);
    wireFloatingLabels(row);
    if (data) {
        document.getElementById(`payment_scope_${index}`).value = data.paymentScopeType || '';
        document.getElementById(`global_rp_expiry_${index}`).value = data.rpExpiry || 'No Expiry';
        const scopeValues = Array.isArray(data.paymentScopeValue) ? data.paymentScopeValue : (data.paymentScopeValue ? [data.paymentScopeValue] : []);
        updateScopeValue(index, scopeValues);
        const merchantValues = Array.isArray(data.merchant) ? data.merchant : (data.merchant ? [data.merchant] : []);
        onOfferCategoryChange(index, data.category, merchantValues);
        document.getElementById(`offer_${index}_subCategory`).value = data.subCategory;
        setMerchantOptions(index, data.category, data.subCategory, merchantValues);
        onRewardTypeChange(index, data.rewardType);
        applyRewardFieldValues(index, data.rewardType, data.rewardFields);
        toggleCustomPlatform(index);
        refreshFloatingLabels(row);
    } else {
        updateScopeValue(index);
    }
}

// Keeps the floating-label "filled" state in sync for dynamically injected rows.
function wireFloatingLabels(root) {
    if (!root) return;
    root.querySelectorAll('.form-floating select').forEach(sel => {
        if (sel.dataset.floatWired) return;
        sel.dataset.floatWired = 'true';
        sel.addEventListener('change', function() {
            const fl = this.closest('.form-floating');
            if (fl) fl.classList.toggle('filled', this.value !== '');
        });
    });
    refreshFloatingLabels(root);
}

function refreshFloatingLabels(root) {
    if (!root) return;
    root.querySelectorAll('.form-floating select').forEach(sel => {
        const fl = sel.closest('.form-floating');
        if (fl) fl.classList.toggle('filled', sel.value !== '');
    });
}

function toggleCustomPlatform(index) {
    const platformSelect = document.getElementById(`offer_${index}_platform`);
    const customRow = document.getElementById(`offer_${index}_customPlatformRow`);
    if (platformSelect.value === 'Other') {
        customRow.style.display = '';
    } else {
        customRow.style.display = 'none';
        document.getElementById(`offer_${index}_customPlatform`).value = '';
    }
}

function removeOfferRow(index) {
    const row = document.querySelector(`.offer-row[data-index="${index}"]`);
    if (merchantChoicesInstances[index]) {
        merchantChoicesInstances[index].destroy();
        delete merchantChoicesInstances[index];
    }
    if (scopeValueChoicesInstances[index]) {
        scopeValueChoicesInstances[index].destroy();
        delete scopeValueChoicesInstances[index];
    }
    if(row) row.remove();
}

const scopeValueChoicesInstances = {};
const merchantChoicesInstances = {};

function initScopeValueChoices(index) {
    const valSelect = document.getElementById(`scope_value_${index}`);
    if (!valSelect || typeof Choices === 'undefined') return;
    if (scopeValueChoicesInstances[index]) return;
    scopeValueChoicesInstances[index] = new Choices(valSelect, {
        removeItemButton: true,
        searchEnabled: true,
        searchPlaceholderValue: 'Search...',
        placeholder: true,
        placeholderValue: '— Select Value(s) —',
        shouldSort: false,
        allowHTML: true,
        itemSelectText: '',
        maxItemCount: 5,
        maxItemText: (max) => `Only ${max} values can be selected`,
        choices: []
    });
}

function updateScopeValue(index, selectedValues = []) {
    const scope = document.getElementById(`payment_scope_${index}`).value;
    const valSelect = document.getElementById(`scope_value_${index}`);
    let options = [];
    if (scope === 'Category') options = Object.keys(CATEGORY_HIERARCHY);
    else if (scope === 'Payment Mode') options = ['Credit Card','UPI','Wallet','EMI','Debit Card','Net Banking'];
    else if (scope === 'Location') options = ['Hyderabad', 'Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Kolkata', 'Pune', 'Ahmedabad', 'Goa', 'Kochi'];
    else if (scope === 'Merchant') {
        let m = new Set();
        Object.values(CATEGORY_HIERARCHY).forEach(cat => Object.values(cat.merchants).forEach(arr => arr.forEach(mName => m.add(mName))));
        options = Array.from(m);
    }
    options = sortOptions(options);
    const choicesArr = options.map(o => ({ value: o, label: o, selected: selectedValues.includes(o) }));
    const inst = scopeValueChoicesInstances[index];
    if (inst) {
        inst.clearStore();
        inst.setChoices(choicesArr, 'value', 'label', true);
    } else if (valSelect) {
        valSelect.innerHTML = options.map(o => `<option value="${o}" ${selectedValues.includes(o) ? 'selected' : ''}>${o}</option>`).join('');
    }
    const subSel = document.getElementById(`offer_${index}_subCategory`);
    if (scope === 'Merchant') {
        subSel.disabled = true;
        subSel.value = '';
        if (merchantChoicesInstances[index]) merchantChoicesInstances[index].disable();
    } else {
        subSel.disabled = false;
        if (merchantChoicesInstances[index]) merchantChoicesInstances[index].enable();
    }
}

function buildMerchantChoicesArray(category, subVal, selectedValues = []) {
    const arr = [{ value: 'ALL', label: 'All Merchants', selected: selectedValues.includes('ALL') }];
    const hierarchy = CATEGORY_HIERARCHY[category];
    if (!hierarchy) return arr;
    if (subVal && subVal !== 'ALL' && hierarchy.merchants[subVal]) {
        sortOptions(hierarchy.merchants[subVal]).forEach(m => arr.push({ value: m, label: m, selected: selectedValues.includes(m) }));
    } else {
        sortOptions(Object.keys(hierarchy.merchants)).forEach(sub => {
            const merchants = hierarchy.merchants[sub] || [];
            if (!merchants.length) return;
            arr.push({
                label: sub,
                id: sub,
                choices: sortOptions(merchants).map(m => ({ value: m, label: m, selected: selectedValues.includes(m) }))
            });
        });
    }
    return arr;
}

function initMerchantChoices(index) {
    const merchSel = document.getElementById(`offer_${index}_merchant`);
    if (!merchSel || typeof Choices === 'undefined') return;
    if (merchantChoicesInstances[index]) return;
    merchantChoicesInstances[index] = new Choices(merchSel, {
        removeItemButton: true,
        searchEnabled: true,
        searchPlaceholderValue: 'Search merchant...',
        placeholder: true,
        placeholderValue: '— Select Merchant(s) —',
        shouldSort: false,
        allowHTML: true,
        itemSelectText: '',
        choices: [{ value: 'ALL', label: 'All Merchants' }]
    });
}

function setMerchantOptions(index, category, subVal, selectedValues = []) {
    const choicesArr = buildMerchantChoicesArray(category, subVal, selectedValues);
    const inst = merchantChoicesInstances[index];
    if (inst) {
        inst.clearStore();
        inst.setChoices(choicesArr, 'value', 'label', true);
    } else {
        const merchSel = document.getElementById(`offer_${index}_merchant`);
        if (merchSel) merchSel.innerHTML = buildMerchantOptionsHtml(category, subVal);
    }
}

function buildMerchantOptionsHtml(category, subVal) {
    let html = '<option value="ALL">All Merchants</option>';
    const hierarchy = CATEGORY_HIERARCHY[category];
    if (!hierarchy) return html;
    if (subVal && subVal !== 'ALL' && hierarchy.merchants[subVal]) {
        html += sortOptions(hierarchy.merchants[subVal]).map(m => `<option value="${m}">${m}</option>`).join('');
    } else {
        sortOptions(Object.keys(hierarchy.merchants)).forEach(sub => {
            const merchants = hierarchy.merchants[sub] || [];
            if (!merchants.length) return;
            html += `<optgroup label="${sub}">` + sortOptions(merchants).map(m => `<option value="${m}">${m}</option>`).join('') + `</optgroup>`;
        });
    }
    return html;
}

function onOfferCategoryChange(index, setValue = null, selectedMerchants = []) {
    const category = document.getElementById(`offer_${index}_category`).value;
    const subSel = document.getElementById(`offer_${index}_subCategory`);
    if (category && CATEGORY_HIERARCHY[category]) {
        const subCategories = CATEGORY_HIERARCHY[category].subCategories || [];
        subSel.innerHTML = '<option value=""></option><option value="ALL">All</option>' + sortOptions(subCategories).map(o => `<option value="${o}">${o}</option>`).join('');
        if (setValue) subSel.value = setValue;
        subSel.onchange = function() {
            setMerchantOptions(index, category, this.value);
        };
        setMerchantOptions(index, category, subSel.value, selectedMerchants);
    } else {
        subSel.innerHTML = '<option value=""></option>';
        setMerchantOptions(index, category, null, selectedMerchants);
    }
}

function validateMcc(input) {
    const raw = input.value.split(',').map(s => s.trim()).filter(Boolean);
    const valid = raw.every(code => /^\d{4}$/.test(code));
    if (raw.length && !valid) {
        input.classList.add('is-invalid');
    } else {
        input.classList.remove('is-invalid');
    }
}

// True when a reward sub-field offers a free-text "Custom" choice.
function rewardFieldHasCustom(field) {
    return (field.options || []).some(o => String(o).trim().toLowerCase() === 'custom');
}

function isCustomValue(value) {
    return String(value || '').trim().toLowerCase() === 'custom';
}

// Opens the reward-specific dropdown panel for the chosen Reward Type.
function onRewardTypeChange(index, setValue = null) {
    const rewardSelect = document.getElementById(`offer_${index}_rewardType`);
    const container = document.getElementById(`offer_${index}_rewardFields`);
    if (!rewardSelect || !container) return;
    if (setValue !== null && setValue !== undefined && setValue !== '') {
        rewardSelect.value = setValue;
    }
    const rewardType = rewardSelect.value;
    container.innerHTML = '';
    const floating = rewardSelect.closest('.form-floating');
    if (floating) floating.classList.toggle('filled', rewardType !== '');
    if (!rewardType || !REWARD_TYPE_FIELDS[rewardType]) return;

    const fields = REWARD_TYPE_FIELDS[rewardType];
    let html = `<div class="bg-light p-2 rounded mb-2 border-start border-4 border-success reward-fields-panel">
        <div class="small fw-bold text-success mb-2"><i class="fas fa-sliders me-1"></i>${rewardType} Details</div>`;
    fields.forEach(f => {
        const supportsCustom = rewardFieldHasCustom(f);
        html += `<div class="row g-1 mb-1 align-items-start">
            <div class="col-md-6">${createSelectField(`offer_${index}_${f.id}`, f.label, f.options, '', `onRewardFieldChange(${index}, '${f.id}')`)}</div>`;
        if (supportsCustom) {
            html += `<div class="col-md-6 reward-custom-col" id="offer_${index}_${f.id}_customWrap" style="display:none;">
                <div class="form-floating mb-1">
                    <input type="text" id="offer_${index}_${f.id}_custom" class="form-control form-control-sm" placeholder="Enter ${f.label}">
                    <label for="offer_${index}_${f.id}_custom">Custom ${f.label}</label>
                </div>
            </div>`;
        }
        html += `</div>`;
    });
    html += `</div>`;
    container.innerHTML = html;
    wireFloatingLabels(container);
}

// Shows/hides the free-text box that belongs to a reward sub-field when "Custom" is picked.
function onRewardFieldChange(index, fieldId, focusInput = true) {
    const sel = document.getElementById(`offer_${index}_${fieldId}`);
    if (!sel) return;
    const floating = sel.closest('.form-floating');
    if (floating) floating.classList.toggle('filled', sel.value !== '');

    const wrap = document.getElementById(`offer_${index}_${fieldId}_customWrap`);
    const input = document.getElementById(`offer_${index}_${fieldId}_custom`);
    if (!wrap || !input) return;
    if (isCustomValue(sel.value)) {
        wrap.style.display = '';
        if (focusInput) input.focus();
    } else {
        wrap.style.display = 'none';
        input.value = '';
    }
}

// Restores saved sub-field values (including any Custom free text) into an open offer row.
function applyRewardFieldValues(index, rewardType, rewardFields) {
    if (!rewardFields || !REWARD_TYPE_FIELDS[rewardType]) return;
    Object.keys(rewardFields).forEach(key => {
        const el = document.getElementById(`offer_${index}_${key}`);
        if (el) el.value = rewardFields[key];
    });
    REWARD_TYPE_FIELDS[rewardType].forEach(f => onRewardFieldChange(index, f.id, false));
    // Re-apply custom text: the toggle above clears boxes whose select is not "Custom".
    REWARD_TYPE_FIELDS[rewardType].forEach(f => {
        if (!isCustomValue(rewardFields[f.id])) return;
        const el = document.getElementById(`offer_${index}_${f.id}_custom`);
        if (el) el.value = rewardFields[`${f.id}_custom`] || '';
    });
}

// Human-readable reward detail string; swaps "Custom" for whatever the user typed.
function rewardFieldsDisplay(offer) {
    const rf = offer && offer.rewardFields;
    if (!rf) return '';
    const fields = REWARD_TYPE_FIELDS[offer.rewardType];
    if (!fields) return Object.values(rf).filter(Boolean).join(' · ');
    return fields.map(f => {
        const v = rf[f.id];
        if (!v) return '';
        return isCustomValue(v) ? (rf[`${f.id}_custom`] || 'Custom') : v;
    }).filter(Boolean).join(' · ');
}

// ================================================================
// 10. SAVE OFFER TO TABLE
// ================================================================

function saveOffer(index) {
    const prefix = `offer_${index}`;
    const row = document.querySelector(`.offer-row[data-index="${index}"]`);
    if(!row) return;
    const merchantSelectEl = document.getElementById(`${prefix}_merchant`);
    const platformSelect = document.getElementById(`${prefix}_platform`);
    const platformValue = platformSelect.value;
    const customPlatform = platformValue === 'Other' ? document.getElementById(`${prefix}_customPlatform`).value : '';
    const offerData = {
        category: document.getElementById(`${prefix}_category`).value,
        subCategory: document.getElementById(`${prefix}_subCategory`).value,
        merchant: Array.from(merchantSelectEl.selectedOptions).map(o => o.value),
        mcc: document.getElementById(`${prefix}_mcc`).value,
        rewardType: document.getElementById(`${prefix}_rewardType`).value,
        frequency: document.getElementById(`${prefix}_frequency`).value,
        status: document.getElementById(`${prefix}_status`).value,
        days: document.getElementById(`${prefix}_days`).value,
        instancePeriod: document.getElementById(`${prefix}_instance_period`).value,
        person: document.getElementById(`${prefix}_person`).value,
        minTx: document.getElementById(`${prefix}_minTx`).value,
        maxTx: document.getElementById(`${prefix}_maxTx`).value,
        maxBenefit: document.getElementById(`${prefix}_maxBenefit`).value,
        startDate: document.getElementById(`${prefix}_startDate`).value,
        endDate: document.getElementById(`${prefix}_endDate`).value,
        weblink: document.getElementById(`${prefix}_weblink`).value,
        paymentScopeType: document.getElementById(`payment_scope_${index}`).value,
        paymentScopeValue: Array.from(document.getElementById(`scope_value_${index}`).selectedOptions).map(o => o.value),
        rpExpiry: document.getElementById(`global_rp_expiry_${index}`).value,
        couponCode: document.getElementById(`${prefix}_couponCode`).value,
        platform: platformValue,
        customPlatform: customPlatform,
        rewardFields: {}
    };
    if (REWARD_TYPE_FIELDS[offerData.rewardType]) {
        let missingCustom = null;
        REWARD_TYPE_FIELDS[offerData.rewardType].forEach(f => {
            const sel = document.getElementById(`${prefix}_${f.id}`);
            const val = sel ? sel.value : '';
            offerData.rewardFields[f.id] = val;
            if (isCustomValue(val)) {
                const customEl = document.getElementById(`${prefix}_${f.id}_custom`);
                const customVal = customEl ? customEl.value.trim() : '';
                offerData.rewardFields[`${f.id}_custom`] = customVal;
                if (!customVal && !missingCustom) missingCustom = f.label;
            }
        });
        if (missingCustom) {
            alert(`Please enter a value in the "Custom ${missingCustom}" box.`);
            return;
        }
    }
    if(!offerData.category || !offerData.rewardType) {
        alert("Please fill in Category and Reward Type.");
        return;
    }
    if (editingOfferIndex !== -1) {
        offers[editingOfferIndex] = offerData;
        editingOfferIndex = -1;
    } else {
        offerData.id = Date.now();
        offers.push(offerData);
    }
    renderOfferTable();
    row.remove();
}

function generateOfferSummary(o) {
    const merchants = Array.isArray(o.merchant) ? o.merchant : (o.merchant ? [o.merchant] : []);
    const merchantText = merchants.length ? (merchants.includes('ALL') ? 'All Merchants' : merchants.join(', ')) : 'Not specified';
    const rewardFieldsText = rewardFieldsDisplay(o);
    const platformText = o.platform === 'Other' ? (o.customPlatform || 'Other') : o.platform;
    return `
        <div class="p-2 small">
            <p class="mb-1"><strong>Earn:</strong> ${o.rewardType || '—'} ${rewardFieldsText ? `(${rewardFieldsText})` : ''}</p>
            <p class="mb-1"><strong>On:</strong> ${o.category || '—'} ${o.subCategory && o.subCategory !== 'ALL' ? '› ' + o.subCategory : ''} — Merchant(s): ${merchantText}</p>
            <p class="mb-1"><strong>MCC:</strong> ${o.mcc || 'Not specified'}</p>
            <p class="mb-1"><strong>Transaction Range:</strong> ₹${o.minTx || 0} – ₹${o.maxTx || 'No Limit'} &nbsp; | &nbsp; <strong>Max Benefit:</strong> ₹${o.maxBenefit || 0}</p>
            <p class="mb-1"><strong>Frequency:</strong> ${o.frequency || '—'} &nbsp; | &nbsp; <strong>Instance Period:</strong> ${o.instancePeriod || '—'} &nbsp; | &nbsp; <strong>Applicable Days:</strong> ${o.days || 'All Days'}</p>
            <p class="mb-1"><strong>Applicable To:</strong> ${o.person || '—'} &nbsp; | &nbsp; <strong>RP Expiry:</strong> ${o.rpExpiry || 'No Expiry'} &nbsp; | &nbsp; <strong>Status:</strong> ${o.status || '—'}</p>
            <p class="mb-1"><strong>Validity:</strong> ${o.startDate || 'N/A'} → ${o.endDate || 'N/A'}</p>
            <p class="mb-1"><strong>Coupon Code:</strong> ${o.couponCode || '—'} &nbsp; | &nbsp; <strong>Platform:</strong> ${platformText || '—'}</p>
            <p class="mb-0"><strong>Rule Applied By:</strong> ${o.paymentScopeType || '—'} ${(() => { const v = Array.isArray(o.paymentScopeValue) ? o.paymentScopeValue : (o.paymentScopeValue ? [o.paymentScopeValue] : []); return v.length ? '(' + v.join(', ') + ')' : ''; })()}</p>
        </div>`;
}

function toggleOfferReview(idx) {
    const el = document.getElementById(`offerReviewRow_${idx}`);
    if (el) el.style.display = el.style.display === 'none' ? 'table-row' : 'none';
}

function renderOfferTable() {
    const container = document.getElementById('offerTableContainer');
    const tbody = document.getElementById('offerTableBody');
    // The saved-offers table lives on the Add Reward Rule page. Saving from the
    // Import Offers page reaches here with that DOM absent — nothing to draw.
    if (!container || !tbody) return;
    if (offers.length > 0) {
        container.style.display = 'block';
        tbody.innerHTML = offers.map((o, idx) => {
            const merchants = Array.isArray(o.merchant) ? o.merchant : (o.merchant ? [o.merchant] : []);
            const merchantBadge = merchants.length ? (merchants.includes('ALL') ? 'All' : (merchants.length > 2 ? `${merchants.slice(0,2).join(', ')} +${merchants.length - 2}` : merchants.join(', '))) : '-';
            const platformText = o.platform === 'Other' ? (o.customPlatform || 'Other') : o.platform;
            return `
            <tr>
                <td>${idx + 1}</td>
                <td><span class="badge bg-primary-subtle text-primary">${o.category}</span> / ${o.subCategory}<br><small class="text-muted">${merchantBadge}${o.mcc ? ' · MCC: ' + o.mcc : ''}</small></td>
                <td><span class="badge bg-success-subtle text-success">${o.rewardType}</span></td>
                <td>₹${o.minTx || 0} - ₹${o.maxTx || 999999}</td>
                <td><strong>₹${o.maxBenefit || 0}</strong></td>
                <td>${o.startDate || 'N/A'} → ${o.endDate || 'N/A'}</td>
                <td><a href="${o.weblink}" target="_blank" class="text-primary small">${o.weblink ? 'Link' : '-'}</a></td>
                <td>
                    <button class="btn btn-outline-secondary btn-sm" title="Review" onclick="toggleOfferReview(${idx})"><i class="fas fa-eye"></i></button>
                    <button class="btn btn-outline-info btn-sm" onclick="editOffer(${idx})"><i class="fas fa-edit"></i></button>
                    <button class="btn btn-outline-danger btn-sm" onclick="deleteOffer(${idx})"><i class="fas fa-times"></i></button>
                </td>
            </tr>
            <tr id="offerReviewRow_${idx}" style="display:none;">
                <td colspan="8" class="bg-light">${generateOfferSummary(o)}</td>
            </tr>`;
        }).join('');
    } else {
        container.style.display = 'none';
    }
}

function editOffer(index) {
    editingOfferIndex = index;
    const data = offers[index];
    offers.splice(index, 1);
    renderOfferTable();
    addOfferRow(data);
}

function deleteOffer(index) {
    if (confirm('Delete this offer?')) {
        offers.splice(index, 1);
        renderOfferTable();
    }
}

function resetForm() {
    document.getElementById('formPanel').innerHTML = buildFormPanel(null, [], false);
    attachAllListeners();
}

// ================================================================
// 11. IMPORT OFFERS STANDALONE PAGE
// ================================================================

let importedOffersData = [];

const OFFER_GROUP_LABELS = {
    'offergrp-1': 'Core Info',
    'offergrp-2': 'Reward Rule',
    'offergrp-3': 'Limits',
    'offergrp-4': 'Validity & Link',
    'offergrp-5': 'Payment & Coupon',
    'offergrp-6': 'Reward Details'
};

const OFFER_GROUP_COLORS = {
    'offergrp-1': '#2563eb', 'offergrp-2': '#2563eb', 'offergrp-3': '#2563eb',
    'offergrp-4': '#2563eb', 'offergrp-5': '#2563eb', 'offergrp-6': '#16a34a'
};
const OFFER_GROUP_TEXTCOLORS = { 'offergrp-1': '#fff', 'offergrp-2': '#fff', 'offergrp-3': '#fff', 'offergrp-4': '#fff', 'offergrp-5': '#fff', 'offergrp-6': '#fff' };

// Every reward sub-field id declared in REWARD_TYPE_FIELDS, plus its "_custom" twin.
const REWARD_SUB_FIELD_IDS = (() => {
    const ids = new Set();
    Object.keys(REWARD_TYPE_FIELDS).forEach(rt => {
        REWARD_TYPE_FIELDS[rt].forEach(f => {
            ids.add(f.id);
            if (rewardFieldHasCustom(f)) ids.add(`${f.id}_custom`);
        });
    });
    return ids;
})();

function isRewardSubFieldColumn(key) {
    return REWARD_SUB_FIELD_IDS.has(String(key).trim());
}

function getOfferColumnGroup(key) {
    const groupMap = {
        'cardId': 'offergrp-1',
        'offerId': 'offergrp-1',
        'category': 'offergrp-1',
        'subCategory': 'offergrp-1',
        'rewardType': 'offergrp-2',
        'frequency': 'offergrp-2',
        'status': 'offergrp-2',
        'days': 'offergrp-2',
        'instancePeriod': 'offergrp-2',
        'person': 'offergrp-2',
        'minTx': 'offergrp-3',
        'maxTx': 'offergrp-3',
        'maxBenefit': 'offergrp-3',
        'startDate': 'offergrp-4',
        'endDate': 'offergrp-4',
        'weblink': 'offergrp-4',
        'paymentScopeType': 'offergrp-5',
        'paymentScopeValue': 'offergrp-5',
        'rpExpiry': 'offergrp-5',
        'couponCode': 'offergrp-5',
        'platform': 'offergrp-5',
        'customPlatform': 'offergrp-5'
    };
    if (groupMap[key]) return groupMap[key];
    if (isRewardSubFieldColumn(key)) return 'offergrp-6';
    return '';
}

// Reward sub-field columns actually worth showing, derived from the reward types
// present in the imported rows (in REWARD_TYPE_FIELDS declaration order).
function getRewardSubFieldColumns(data) {
    const rows = data || [];
    const typesPresent = new Set();
    rows.forEach(r => {
        const rt = String(genericVal(r, 'rewardType') || '').trim();
        if (REWARD_TYPE_FIELDS[rt]) typesPresent.add(rt);
    });
    const cols = [];
    Object.keys(REWARD_TYPE_FIELDS).forEach(rt => {
        if (!typesPresent.has(rt)) return;
        REWARD_TYPE_FIELDS[rt].forEach(f => {
            if (!cols.includes(f.id)) cols.push(f.id);
            if (!rewardFieldHasCustom(f)) return;
            const customKey = `${f.id}_custom`;
            const anyCustom = rows.some(r => String(genericVal(r, customKey) || '').trim() !== '');
            if (anyCustom && !cols.includes(customKey)) cols.push(customKey);
        });
    });
    return cols;
}

function getOfferImportColumns(data) {
    return OFFER_IMPORT_COLUMNS.concat(getRewardSubFieldColumns(data));
}

// ================================================================
// 11a. OFFER FIELD CATALOGUE — the single source of truth used by the
//      Excel template generator and by the column-mapping screen.
// ================================================================

const OFFER_COLUMN_LABELS = {
    cardId: 'Card ID', offerId: 'Offer ID', category: 'Category', subCategory: 'Sub Category',
    rewardType: 'Reward Type', frequency: 'Frequency', status: 'Status', days: 'Applicable Days',
    instancePeriod: 'Instance Period', person: 'Applicable Person', minTx: 'Min Transaction',
    maxTx: 'Max Transaction', maxBenefit: 'Max Benefit', startDate: 'Start Date',
    endDate: 'End Date', weblink: 'Web Link', paymentScopeType: 'Apply Rule By',
    paymentScopeValue: 'Apply Value', rpExpiry: 'RP Expiry', couponCode: 'Coupon Code',
    platform: 'Platform', customPlatform: 'Custom Platform'
};

// Allowed values for the base (non reward-specific) columns, mirroring the form dropdowns.
function getOfferBaseOptions() {
    return {
        category: ['ALL', ...Object.keys(CATEGORY_HIERARCHY)],
        rewardType: Object.keys(REWARD_TYPE_FIELDS),
        frequency: ['One Time', 'Monthly', 'Quarterly', 'Yearly'],
        status: ['Active', 'Inactive'],
        days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday', 'Weekdays', 'Weekends', 'All Days'],
        instancePeriod: ['Per Transaction', 'Daily', 'Weekly', 'Monthly', 'Quarterly', 'Half-Yearly', 'Yearly'],
        person: ['Primary', 'Family', 'Cardholder', 'Spouse', 'Children', 'All Members'],
        paymentScopeType: ['Category', 'Payment Mode', 'Location', 'Merchant'],
        rpExpiry: ['No Expiry', '12 Months', '24 Months', '36 Months', 'Custom'],
        platform: ['Zomato Gold', 'Smart Buy', 'Other']
    };
}

// Every field an Excel column can be mapped onto.
// rewardType is null for base columns, or the owning reward type for sub-fields.
function getOfferFieldCatalogue() {
    const baseOptions = getOfferBaseOptions();
    const list = OFFER_IMPORT_COLUMNS.map(k => ({
        key: k,
        label: OFFER_COLUMN_LABELS[k] || k,
        rewardType: null,
        options: baseOptions[k] || []
    }));
    Object.keys(REWARD_TYPE_FIELDS).forEach(rt => {
        REWARD_TYPE_FIELDS[rt].forEach(f => {
            list.push({ key: f.id, label: f.label, rewardType: rt, options: f.options.slice() });
            if (rewardFieldHasCustom(f)) {
                list.push({ key: `${f.id}_custom`, label: `Custom ${f.label}`, rewardType: rt, options: [] });
            }
        });
    });
    return list;
}

function normalizeHeaderKey(text) {
    return String(text === undefined || text === null ? '' : text).toLowerCase().replace(/[^a-z0-9]/g, '');
}

// Header spellings teams commonly use, pointed at the field they mean.
const OFFER_HEADER_ALIASES = {
    persontype: 'person', applicableto: 'person', cardholder: 'person',
    applicabledays: 'days', validdays: 'days',
    validfrom: 'startDate', datefrom: 'startDate', offerstart: 'startDate',
    validto: 'endDate', validtill: 'endDate', dateto: 'endDate', offerend: 'endDate',
    link: 'weblink', url: 'weblink', offerlink: 'weblink', weburl: 'weblink',
    offerstatus: 'status', activestatus: 'status',
    mintxn: 'minTx', minspend: 'minTx', minamount: 'minTx',
    maxtxn: 'maxTx', maxspend: 'maxTx', maxamount: 'maxTx',
    maxcap: 'maxBenefit', cap: 'maxBenefit', benefitcap: 'maxBenefit',
    subcat: 'subCategory', subcategoryname: 'subCategory',
    reward: 'rewardType', rewardcategory: 'rewardType',
    coupon: 'couponCode', promocode: 'couponCode',
    applyruleby: 'paymentScopeType', scopetype: 'paymentScopeType',
    applyvalue: 'paymentScopeValue', scopevalue: 'paymentScopeValue',
    channel: 'platform'
};

// Guesses which catalogue field an Excel header refers to.
// Order: exact field id -> known alias -> "Reward Type Label" -> bare label (only when unambiguous).
function autoMatchOfferHeader(header, catalogue) {
    const n = normalizeHeaderKey(header);
    if (!n) return '';

    const byKey = catalogue.find(c => normalizeHeaderKey(c.key) === n);
    if (byKey) return byKey.key;

    const aliased = OFFER_HEADER_ALIASES[n];
    if (aliased && catalogue.some(c => c.key === aliased)) return aliased;

    const byQualified = catalogue.find(c => c.rewardType && normalizeHeaderKey(`${c.rewardType} ${c.label}`) === n);
    if (byQualified) return byQualified.key;

    // A bare label is only safe when exactly one field carries it — "Conversion Ratio"
    // belongs to both Air Miles and Hotel Points, so that one must stay unmapped.
    const byLabel = catalogue.filter(c => normalizeHeaderKey(c.label) === n);
    if (byLabel.length === 1) return byLabel[0].key;

    const contained = catalogue.filter(c => {
        const ln = normalizeHeaderKey(c.label);
        return ln.length >= 5 && n.includes(ln);
    });
    if (contained.length === 1) return contained[0].key;

    return '';
}

const OFFER_IMPORT_COLUMNS = [
    'cardId', 'offerId', 'category', 'subCategory', 'rewardType', 'frequency', 'status', 'days',
    'instancePeriod', 'person', 'minTx', 'maxTx', 'maxBenefit',
    'startDate', 'endDate', 'weblink', 'paymentScopeType', 'paymentScopeValue',
    'rpExpiry', 'couponCode', 'platform', 'customPlatform'
];

// Validates rewardType against REWARD_TYPE_FIELDS, plus each reward-type-specific
// sub-field (rp_pointType, cb_type, etc.) against its own option list when present.
function validateOfferRow(row) {
    const invalid = new Set();
    const rewardType = String(genericVal(row, 'rewardType') || '').trim();
    if (rewardType && !REWARD_TYPE_FIELDS[rewardType]) { invalid.add('rewardType'); return invalid; }
    if (rewardType && REWARD_TYPE_FIELDS[rewardType]) {
        REWARD_TYPE_FIELDS[rewardType].forEach(f => {
            const v = String(genericVal(row, f.id) || '').trim();
            if (v && !f.options.includes(v)) { invalid.add(f.id); return; }
            // "Custom" is only valid when the matching *_custom column carries a value.
            if (isCustomValue(v)) {
                const customVal = String(genericVal(row, `${f.id}_custom`) || '').trim();
                if (!customVal) { invalid.add(f.id); invalid.add(`${f.id}_custom`); }
            }
        });
    }
    return invalid;
}

function validateMccRow(row) {
    const invalid = new Set();
    const mcc = String(genericVal(row, 'MCC') || '').trim();
    if (mcc && !/^\d{4}$/.test(mcc)) invalid.add('MCC');
    return invalid;
}

// ===== Generic diff engine, reused by Offers / Benefits / MCC compare (Cards page
// has its own richer version above with column-group coloring) =====
function diffCompare(dataArr, dbArr, matchKeyFn, fieldKeys, getVal) {
    return dataArr.map(row => {
        const match = dbArr.find(dbRow => matchKeyFn(dbRow) === matchKeyFn(row));
        if (!match) return { ...row, _status: 'new', _dbMatch: null };
        const changed = fieldKeys.some(f => String(getVal(row, f)).trim() !== String(getVal(match, f)).trim());
        return { ...row, _status: changed ? 'updated' : 'unchanged', _dbMatch: match };
    });
}
function genericVal(row, col) {
    if (!row) return '';
    if (row[col] !== undefined && row[col] !== null) return row[col];
    const m = Object.keys(row).find(k => k.toLowerCase() === col.toLowerCase());
    return m ? (row[m] ?? '') : '';
}
function diffSummaryHtml(list, statusVarName, colVarName, columns, renderFn, clearFn, validateFn) {
    const n = list.filter(r => r._status === 'new').length;
    const u = list.filter(r => r._status === 'updated').length;
    const s = list.filter(r => r._status === 'unchanged' || !r._status).length;
    const invHtml = validateFn ? `<span><span class="badge bg-danger">Invalid</span> ${list.filter(r => validateFn(r).size > 0).length}</span>` : '';
    const invOption = validateFn ? `<option value="invalid">Invalid</option>` : '';
    return `<div class="d-flex gap-3 align-items-center flex-wrap">
        <span><span class="badge bg-success">New</span> ${n}</span>
        <span><span class="badge bg-warning text-dark">Updated</span> ${u}</span>
        <span><span class="badge bg-secondary">Unchanged</span> ${s}</span>
        ${invHtml}
        <select class="form-select form-select-sm" style="width:auto;" onchange="${statusVarName}=this.value; ${renderFn};">
            <option value="all">All</option><option value="new">New</option><option value="updated">Updated</option><option value="unchanged">Unchanged</option>${invOption}
        </select>
        <select class="form-select form-select-sm" style="width:auto;" onchange="${colVarName}=this.value; ${renderFn};">
            <option value="all">All Columns</option>${columns.map(c => `<option value="${c}">${c}</option>`).join('')}
        </select>
        <button class="btn btn-sm btn-outline-danger" onclick="${clearFn}">Clear Comparison</button>
    </div>`;
}
function diffRowsHtml(list, columns, hasStatus, validateFn, groupFn) {
    const fmt = (v) => { let d = (v === undefined || v === null) ? '' : v; if (typeof d === 'string' && d.length > 50) d = d.substring(0, 50) + '...'; return d; };
    const edgeCls = (i) => {
        if (!groupFn) return '';
        const g = groupFn(columns[i]);
        const prev = i > 0 ? groupFn(columns[i - 1]) : null;
        const next = i < columns.length - 1 ? groupFn(columns[i + 1]) : null;
        return `${g || ''} ${g !== prev ? 'grp-start ' : ''}${g !== next ? 'grp-end' : ''}`;
    };
    let html = '';
    list.forEach(row => {
        const dbRow = row._dbMatch;
        const showOld = (row._status === 'updated' || row._status === 'unchanged') && dbRow;
        const invalid = validateFn ? validateFn(row) : new Set();
        html += `<tr class="${showOld ? 'diff-new-row' : ''} ${invalid.size > 0 ? 'row-invalid' : ''}">`;
        if (hasStatus) html += `<td class="status-cell"><span class="badge bg-success">New</span></td>`;
        columns.forEach((col, i) => {
            const cellCls = invalid.has(col) ? 'cell-invalid' : '';
            html += `<td class="${edgeCls(i)} ${cellCls}" style="font-size:0.75rem;" title="${cellCls ? 'Invalid value — not in the allowed dropdown list' : ''}">${fmt(genericVal(row, col))}</td>`;
        });
        html += '</tr>';
        if (showOld) {
            html += `<tr class="diff-old-row">`;
            if (hasStatus) html += `<td class="status-cell"><span class="badge bg-secondary">Old</span></td>`;
            columns.forEach(col => {
                const newStr = String(genericVal(row, col)).trim();
                const oldVal = genericVal(dbRow, col);
                const oldStr = String(oldVal).trim();
                let cls = '';
                if (oldStr === '' && newStr !== '') cls = 'diff-added';
                else if (oldStr !== '' && newStr === '') cls = 'diff-removed';
                else if (oldStr !== newStr) cls = 'diff-changed';
                html += `<td class="${cls}" style="font-size:0.75rem;">${oldStr === '' ? '<span class="text-muted">—</span>' : fmt(oldVal)}</td>`;
            });
            html += '</tr>';
        }
    });
    return html;
}

// ---- Offers ----
let offerDatabaseData = [], offerStatusFilter = 'all', offerColumnFilter = 'all';
function getOfferMatchKey(row) {
    const oid = String(genericVal(row, 'offerId')).trim().toLowerCase();
    return oid ? 'oid:' + oid : 'combo:' + ['cardId', 'category', 'rewardType'].map(k => String(genericVal(row, k)).trim().toLowerCase()).join('|');
}
function compareOffersWithDatabase(silent) {
    if (importedOffersData.length === 0) { if (!silent) alert('No offers to compare. Import an Excel file first.'); return; }
    if (offerDatabaseData.length === 0) {
        offerDatabaseData = importedOffersData.slice(0, Math.min(2, importedOffersData.length)).map(r => ({ ...r }));
        if (offerDatabaseData[0]) {
            offerDatabaseData[0].maxBenefit = '';
            const s = genericVal(offerDatabaseData[0], 'status'); if (s) offerDatabaseData[0].status = s + ' (old)';
        }
        if (!silent) alert('Mock database populated. Click "Compare" again to see changes.');
        return;
    }
    const compareColumns = getOfferImportColumns(importedOffersData);
    importedOffersData = diffCompare(importedOffersData, offerDatabaseData, getOfferMatchKey, compareColumns, genericVal);
    renderOfferImportTable(importedOffersData);
    document.getElementById('offerComparisonSummary').innerHTML = diffSummaryHtml(importedOffersData, 'offerStatusFilter', 'offerColumnFilter', compareColumns, 'renderOfferImportTable(importedOffersData)', 'clearOfferComparison()', validateOfferRow);
    document.getElementById('offerComparisonSummary').style.display = 'block';
}
function clearOfferComparison() {
    importedOffersData = importedOffersData.map(r => { const c = { ...r }; delete c._status; delete c._dbMatch; return c; });
    offerStatusFilter = 'all'; offerColumnFilter = 'all';
    renderOfferImportTable(importedOffersData);
    document.getElementById('offerComparisonSummary').style.display = 'none';
}

// ---- MCC ----
let mccDatabaseData = [], mccStatusFilter = 'all', mccColumnFilter = 'all';
function getMccMatchKey(row) { return 'combo:' + ['Card', 'Offer ID', 'MCC'].map(k => String(genericVal(row, k)).trim().toLowerCase()).join('|'); }
function compareMccWithDatabase(silent) {
    if (importedMccData.length === 0) { if (!silent) alert('No MCC data to compare. Import an Excel file first.'); return; }
    if (mccDatabaseData.length === 0) {
        mccDatabaseData = importedMccData.slice(0, Math.min(2, importedMccData.length)).map(r => ({ ...r }));
        if (mccDatabaseData[0]) {
            mccDatabaseData[0]['Exclusion'] = '';
            const inc = genericVal(mccDatabaseData[0], 'Inclusion'); if (inc) mccDatabaseData[0]['Inclusion'] = inc + ' (old)';
        }
        if (!silent) alert('Mock database populated. Click "Compare" again to see changes.');
        return;
    }
    importedMccData = diffCompare(importedMccData, mccDatabaseData, getMccMatchKey, MCC_IMPORT_COLUMNS, genericVal);
    renderMccImportTable(importedMccData);
    document.getElementById('mccComparisonSummary').innerHTML = diffSummaryHtml(importedMccData, 'mccStatusFilter', 'mccColumnFilter', MCC_IMPORT_COLUMNS, 'renderMccImportTable(importedMccData)', 'clearMccComparison()', validateMccRow);
    document.getElementById('mccComparisonSummary').style.display = 'block';
}
function clearMccComparison() {
    importedMccData = importedMccData.map(r => { const c = { ...r }; delete c._status; delete c._dbMatch; return c; });
    mccStatusFilter = 'all'; mccColumnFilter = 'all';
    renderMccImportTable(importedMccData);
    document.getElementById('mccComparisonSummary').style.display = 'none';
}

// ---- Preferred Benefits (compares each card's main row; slabs/partners shown as-is) ----
let benefitDatabaseData = [];
function getBenefitMatchKey(row) { return String(genericVal(row, 'cardId') || genericVal(row, 'id')).trim().toLowerCase(); }
function compareBenefitsWithDatabase(silent) {
    if (!importedBenefitsData || !importedBenefitsData.mains || importedBenefitsData.mains.length === 0) {
        if (!silent) alert('No benefits to compare. Import an Excel file first.'); return;
    }
    if (benefitDatabaseData.length === 0) {
        benefitDatabaseData = importedBenefitsData.mains.slice(0, Math.min(2, importedBenefitsData.mains.length)).map(r => ({ ...r }));
        if (benefitDatabaseData[0]) {
            benefitDatabaseData[0].golf_notes = '';
            const lp = genericVal(benefitDatabaseData[0], 'lounge_program'); if (lp) benefitDatabaseData[0].lounge_program = lp + ' (old)';
        }
        if (!silent) alert('Mock database populated. Click "Compare" again to see changes.');
        return;
    }
    const benefitCols = ['lounge_program','lounge_dom_visits','lounge_dom_period','lounge_dom_frequency','lounge_dom_criteria','lounge_int_visits','lounge_int_period','lounge_int_frequency','lounge_int_criteria','golf_courses','golf_rounds','golf_period','golf_notes','ins_provider','ins_coverage','ins_policyLink','dining_partner','dining_notes','movie_partner','movie_notes','spa_partner','spa_notes'];
    importedBenefitsData.mains = diffCompare(importedBenefitsData.mains, benefitDatabaseData, getBenefitMatchKey, benefitCols, genericVal);
    renderBenefitImportTablesStandalone(importedBenefitsData);
    document.getElementById('benefitComparisonSummary').innerHTML = diffSummaryHtml(importedBenefitsData.mains, 'benefitStatusFilterNoop', 'benefitColumnFilterNoop', [], 'renderBenefitImportTablesStandalone(importedBenefitsData)', 'clearBenefitComparison()').replace(/<select[\s\S]*?<\/select>/g, '');
    document.getElementById('benefitComparisonSummary').style.display = 'block';
}
function clearBenefitComparison() {
    if (importedBenefitsData && importedBenefitsData.mains) {
        importedBenefitsData.mains = importedBenefitsData.mains.map(r => { const c = { ...r }; delete c._status; delete c._dbMatch; return c; });
    }
    renderBenefitImportTablesStandalone(importedBenefitsData);
    document.getElementById('benefitComparisonSummary').style.display = 'none';
}

// ---- Master button on the Cards/Import-From-Excel page: compares everything at once ----
function compareAllWithDatabase() {
    compareWithDatabase();
    compareOffersWithDatabase(true);
    compareBenefitsWithDatabase(true);
    compareMccWithDatabase(true);
}

function buildImportOffersPanel() {
    return `
    <div class="import-panel">
        <div class="row g-3 mb-4">
            <div class="col-12" style="margin-top: 0;">
                <div class="upload-layout">
                    <div class="upload-zone-button-wrapper">
                    <div>
                        <div class="upload-icon-badge"><i class="fas fa-cloud-arrow-up"></i></div>
                        <button class="btn btn-primary btn-upload" onclick="document.getElementById('offerExcelImportInput').click()">
                            <i class="fas fa-file-arrow-up me-2"></i> Choose Offer Excel File
                        </button>
                        <small class="text-muted d-block mt-1">Upload your Excel file to preview offer data</small>
                        <input type="file" id="offerExcelImportInput" accept=".xlsx,.xls" style="display:none;" onchange="handleOfferExcelImportTable(event)">
                        <button class="btn btn-outline-primary btn-sm mt-2" onclick="downloadOfferTemplate()"><i class="fas fa-file-excel me-1"></i> Download Excel Template</button>
                    </div>
                    </div>
                    ${DIFF_COLOR_LEGEND_HTML}
                </div>
            </div>
        </div>
        <div id="offerMappingPanel" style="display:none;" class="mb-4"></div>
        <div id="offerImportTableContainer"
            <div class="d-flex justify-content-between align-items-center mb-3">
                <h6 class="fw-bold">Imported Offers <span id="offerRecordCount" class="badge bg-primary">0 records</span></h6>
                <div class="d-flex gap-2">
                    <button class="btn btn-primary btn-sm" onclick="compareOffersWithDatabase()"><i class="fas fa-code-compare me-1"></i>Compare with Database</button>
                    <button class="btn btn-outline-success btn-sm" onclick="exportOfferImportData()"><i class="fas fa-download me-1"></i>Export CSV</button>
                    <span class="filter-icon-group">
                        <span class="filter-icon-box"><i class="fas fa-sliders"></i></span>
                        <select class="form-select form-select-sm" style="width:auto;" onchange="if(this.value==='show')showAllGroups(); else if(this.value==='hide')hideAllGroups(); this.selectedIndex=0;">
                            <option value="" selected disabled>Filter Sheet</option>
                            <option value="show">Show All Columns</option>
                            <option value="hide">Hide All Columns</option>
                        </select>
                    </span>
                    <button class="btn btn-outline-secondary btn-sm" onclick="clearOfferImportData()"><i class="fas fa-times me-1"></i>Clear</button>
                </div>
            </div>
            <div id="offerComparisonSummary" style="display:none;" class="mb-3"></div>
            <div class="mb-3">
                <input type="text" id="offerImportSearchInput" class="form-control form-control-sm" placeholder="Search imported offers..." oninput="filterOfferImportTable(this.value)">
            </div>
            <div id="offerGroupToggleBar" class="group-toggle-bar mb-3"></div>
            <div class="table-responsive" style="max-height: 500px; overflow-y: auto; border: 1px solid #e2e8f0; border-radius: 8px;">
                <table class="table table-bordered table-striped table-hover mb-0" id="offerImportTable">
                    <thead id="offerImportTableHead" class="sticky-top bg-white"></thead>
                    <tbody id="offerImportTableBody"></tbody>
                </table>
            </div>
            <div class="d-flex justify-content-end mt-3">
                <button class="btn btn-success" onclick="saveOfferImportData()"><i class="fas fa-save me-2"></i>Save Offers to Database</button>
            </div>
        </div>
    </div>
    `;
}

function renderOfferGroupToggleBar() {
    const bar = document.getElementById('offerGroupToggleBar');
    if (!bar) return;
    // "Reward Details" only makes sense once reward sub-field columns exist.
    const hasRewardDetailCols = getRewardSubFieldColumns(importedOffersData).length > 0;
    let html = '';
    Object.keys(OFFER_GROUP_LABELS).forEach(g => {
        if (g === 'offergrp-6' && !hasRewardDetailCols) return;
        const active = groupVisibility[g];
        const color = OFFER_GROUP_COLORS[g];
        const textcolor = OFFER_GROUP_TEXTCOLORS[g];
        const style = active
            ? `background-color:${color}; border-color:${color}; color:${textcolor};`
            : `border-color:${color};`;
        html += `<button type="button" class="btn btn-sm group-btn ${active ? 'is-active' : 'is-inactive'} me-2 mb-2" style="${style}" onclick="toggleColumnGroup('${g}')">
            <i class="fas ${active ? 'fa-eye' : 'fa-eye-slash'} me-1"></i>${OFFER_GROUP_LABELS[g]}
        </button>`;
    });
    bar.innerHTML = html;
}

function renderOfferImportTable(data) {
    renderOfferGroupToggleBar();
    const thead = document.getElementById('offerImportTableHead');
    const tbody = document.getElementById('offerImportTableBody');
    let filtered = data;
    if (offerStatusFilter === 'invalid') filtered = filtered.filter(r => validateOfferRow(r).size > 0);
    else if (offerStatusFilter !== 'all') filtered = filtered.filter(r => r._status === offerStatusFilter);
    if (offerColumnFilter !== 'all') filtered = filtered.filter(r => r._status === 'new' || !r._dbMatch || String(genericVal(r, offerColumnFilter)).trim() !== String(genericVal(r._dbMatch, offerColumnFilter)).trim());
    const hasStatus = data.some(r => r._status);

    // Columns come from the full imported set, so searching/filtering never drops a column.
    const columns = getOfferImportColumns(importedOffersData.length ? importedOffersData : data);
    const colCount = columns.length + (hasStatus ? 1 : 0);
    let theadHtml = hasStatus ? diffLegendStickyRow(colCount) : '';
    theadHtml += '<tr style="border:3px solid black;">';
    if (hasStatus) theadHtml += `<th class="status-col-header" style="font-size:0.75rem; font-weight:600; color:#475569;">Status</th>`;
    columns.forEach((col, i) => {
        const groupClass = getOfferColumnGroup(col);
        const isHidden = groupClass && !groupVisibility[groupClass];
        const prevGroup = i > 0 ? getOfferColumnGroup(columns[i - 1]) : null;
        const nextGroup = i < columns.length - 1 ? getOfferColumnGroup(columns[i + 1]) : null;
        const edge = (groupClass !== prevGroup ? 'grp-start ' : '') + (groupClass !== nextGroup ? 'grp-end' : '');
        theadHtml += `<th class="text-nowrap ${groupClass} ${edge} ${isHidden ? 'col-group-hidden' : ''}" style="font-size:0.75rem; font-weight:600; color:#475569; border-top:2px solid black;" title="${offerColumnTitle(col)}">${col}</th>`;
    });
    theadHtml += '</tr>';
    thead.innerHTML = theadHtml;
    thead.classList.toggle('has-legend-row', hasStatus);

    if (!filtered || filtered.length === 0) {
        tbody.innerHTML = `<tr><td colspan="${colCount}" class="text-center text-muted py-3">No offers to display. Please import an Excel file.</td></tr>`;
        return;
    }
    tbody.innerHTML = diffRowsHtml(filtered, columns, hasStatus, validateOfferRow, getOfferColumnGroup);
}

// Friendly hover text for reward sub-field headers (e.g. rp_calc -> "Reward Points › Calculation Basis").
function offerColumnTitle(col) {
    const base = String(col).replace(/_custom$/, '');
    for (const rt of Object.keys(REWARD_TYPE_FIELDS)) {
        const f = REWARD_TYPE_FIELDS[rt].find(x => x.id === base);
        if (f) return `${rt} › ${f.label}${col.endsWith('_custom') ? ' (custom value)' : ''}`;
    }
    return col;
}

// ================================================================
// 11b. COLUMN MAPPING SCREEN
// Excel headers rarely match our field ids exactly, so the upload lands here
// first: auto-match what we can, let the user fix the rest, then commit.
// ================================================================

let pendingOfferImport = null;   // { fileName, headers: [], rows: [], mapping: {header: fieldKey} }

function handleOfferExcelImportTable(event) {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const data = new Uint8Array(e.target.result);
            const workbook = XLSX.read(data, { type: 'array' });
            const json = smartSheetToJson(pickSheet(workbook, 'Offers'));
            if (json.length === 0) {
                alert('The Excel file is empty.');
                return;
            }
            startOfferColumnMapping(json, file.name);
            document.getElementById('offerExcelImportInput').value = '';
        } catch (err) {
            alert('Error reading Excel file: ' + err.message);
        }
    };
    reader.readAsArrayBuffer(file);
}

function startOfferColumnMapping(rows, fileName) {
    const catalogue = getOfferFieldCatalogue();
    const headers = [];
    rows.forEach(r => Object.keys(r).forEach(h => {
        const t = String(h).trim();
        if (t && !t.startsWith('__EMPTY') && !headers.includes(h)) headers.push(h);
    }));
    const mapping = {};
    const used = new Set();
    headers.forEach(h => {
        const guess = autoMatchOfferHeader(h, catalogue);
        // Never auto-assign the same target twice; the second one waits for the user.
        mapping[h] = (guess && !used.has(guess)) ? guess : '';
        if (mapping[h]) used.add(mapping[h]);
    });
    pendingOfferImport = { fileName: fileName || 'Uploaded file', headers, rows, mapping, catalogue };
    renderOfferMappingPanel();
}

function renderOfferMappingPanel() {
    const panel = document.getElementById('offerMappingPanel');
    if (!panel || !pendingOfferImport) return;
    const { headers, rows, mapping, catalogue, fileName } = pendingOfferImport;

    const optionsHtml = (selectedKey) => {
        const base = catalogue.filter(c => !c.rewardType);
        let html = `<option value="">— Ignore this column —</option>`;
        html += `<optgroup label="Offer Fields">` +
            base.map(c => `<option value="${c.key}" ${selectedKey === c.key ? 'selected' : ''}>${c.label} (${c.key})</option>`).join('') +
            `</optgroup>`;
        Object.keys(REWARD_TYPE_FIELDS).forEach(rt => {
            const group = catalogue.filter(c => c.rewardType === rt);
            html += `<optgroup label="${rt}">` +
                group.map(c => `<option value="${c.key}" ${selectedKey === c.key ? 'selected' : ''}>${c.label} (${c.key})</option>`).join('') +
                `</optgroup>`;
        });
        return html;
    };

    const sampleFor = (header) => {
        const hit = rows.find(r => String(r[header] ?? '').trim() !== '');
        const v = hit ? String(hit[header]) : '';
        return v.length > 28 ? v.slice(0, 28) + '…' : (v || '—');
    };

    const counts = { mapped: 0, ignored: 0 };
    headers.forEach(h => mapping[h] ? counts.mapped++ : counts.ignored++);
    const dupes = {};
    headers.forEach(h => { if (mapping[h]) dupes[mapping[h]] = (dupes[mapping[h]] || 0) + 1; });
    const hasDupes = Object.values(dupes).some(n => n > 1);
    const hasRewardType = Object.values(mapping).includes('rewardType');
    const hasCategory = Object.values(mapping).includes('category');

    let rowsHtml = headers.map(h => {
        const target = mapping[h];
        const isDupe = target && dupes[target] > 1;
        let badge = `<span class="badge bg-secondary-subtle text-secondary">Ignored</span>`;
        if (isDupe) badge = `<span class="badge bg-danger-subtle text-danger">Duplicate</span>`;
        else if (target) badge = `<span class="badge bg-success-subtle text-success">Mapped</span>`;
        const entry = catalogue.find(c => c.key === target);
        const owner = entry && entry.rewardType ? `<div class="text-muted" style="font-size:0.68rem;">applies to ${entry.rewardType}</div>` : '';
        return `<tr class="${isDupe ? 'table-danger' : (target ? '' : 'table-warning')}">
            <td class="fw-semibold" style="font-size:0.78rem;">${h}</td>
            <td class="text-muted" style="font-size:0.72rem;">${sampleFor(h)}</td>
            <td>
                <select class="form-select form-select-sm offer-map-select" data-header="${String(h).replace(/"/g, '&quot;')}" onchange="updateOfferColumnMapping(this)" style="font-size:0.75rem;">
                    ${optionsHtml(target)}
                </select>
                ${owner}
            </td>
            <td class="text-center">${badge}</td>
        </tr>`;
    }).join('');

    let warning = '';
    if (!hasRewardType || !hasCategory) {
        const miss = [!hasCategory ? 'Category' : '', !hasRewardType ? 'Reward Type' : ''].filter(Boolean).join(' and ');
        warning = `<div class="alert alert-warning py-2 px-3 mb-2" style="font-size:0.78rem;">
            <i class="fas fa-triangle-exclamation me-1"></i><strong>${miss}</strong> ${miss.includes('and') ? 'are' : 'is'} not mapped. Rows without ${miss.includes('and') ? 'them' : 'it'} cannot be saved to the database.</div>`;
    }
    if (hasDupes) {
        warning += `<div class="alert alert-danger py-2 px-3 mb-2" style="font-size:0.78rem;">
            <i class="fas fa-circle-exclamation me-1"></i>Two or more columns point at the same field. Fix the duplicates before loading.</div>`;
    }

    panel.innerHTML = `
    <div class="p-3 bg-white rounded border">
        <div class="d-flex justify-content-between align-items-center mb-2 flex-wrap gap-2">
            <div>
                <h6 class="fw-bold mb-0"><i class="fas fa-diagram-project text-primary me-2"></i>Map Excel Columns to Fields</h6>
                <small class="text-muted">${fileName} · ${rows.length} row(s) · ${headers.length} column(s)</small>
            </div>
            <div class="d-flex gap-2 align-items-center">
                <span class="badge bg-success-subtle text-success">${counts.mapped} mapped</span>
                <span class="badge bg-secondary-subtle text-secondary">${counts.ignored} ignored</span>
                <button class="btn btn-outline-secondary btn-sm" onclick="autoMatchOfferColumns()"><i class="fas fa-wand-magic-sparkles me-1"></i>Auto-match</button>
                <button class="btn btn-outline-danger btn-sm" onclick="cancelOfferColumnMapping()"><i class="fas fa-times me-1"></i>Cancel</button>
                <button class="btn btn-success btn-sm" ${hasDupes ? 'disabled' : ''} onclick="confirmOfferColumnMapping()"><i class="fas fa-check me-1"></i>Confirm &amp; Load</button>
            </div>
        </div>
        ${warning}
        <p class="text-muted mb-2" style="font-size:0.74rem;">
            Each row uses only the fields belonging to its own Reward Type — a Cashback row reads the Cashback fields, an Air Miles row reads the Air Miles fields.
            Values sitting under another reward type's column are ignored for that row.
        </p>
        <div class="table-responsive" style="max-height:380px; overflow-y:auto; border:1px solid #e2e8f0; border-radius:8px;">
            <table class="table table-sm table-hover mb-0">
                <thead class="sticky-top bg-light">
                    <tr>
                        <th style="font-size:0.72rem;">Excel Column</th>
                        <th style="font-size:0.72rem;">Sample Value</th>
                        <th style="font-size:0.72rem; width:38%;">Maps To</th>
                        <th style="font-size:0.72rem;" class="text-center">Status</th>
                    </tr>
                </thead>
                <tbody>${rowsHtml}</tbody>
            </table>
        </div>
    </div>`;
    panel.style.display = 'block';
}

function updateOfferColumnMapping(selectEl) {
    if (!pendingOfferImport) return;
    pendingOfferImport.mapping[selectEl.dataset.header] = selectEl.value;
    renderOfferMappingPanel();
}

function autoMatchOfferColumns() {
    if (!pendingOfferImport) return;
    const { headers, catalogue, mapping } = pendingOfferImport;
    const used = new Set();
    headers.forEach(h => {
        const guess = autoMatchOfferHeader(h, catalogue);
        mapping[h] = (guess && !used.has(guess)) ? guess : '';
        if (mapping[h]) used.add(mapping[h]);
    });
    renderOfferMappingPanel();
}

function cancelOfferColumnMapping() {
    pendingOfferImport = null;
    const panel = document.getElementById('offerMappingPanel');
    if (panel) { panel.style.display = 'none'; panel.innerHTML = ''; }
}

// Rewrites the raw rows into canonical field keys and drops sub-field values
// that belong to a reward type other than the row's own.
function confirmOfferColumnMapping() {
    if (!pendingOfferImport) return;
    const { headers, rows, mapping } = pendingOfferImport;
    const ownerOf = {};
    Object.keys(REWARD_TYPE_FIELDS).forEach(rt => {
        REWARD_TYPE_FIELDS[rt].forEach(f => {
            ownerOf[f.id] = rt;
            if (rewardFieldHasCustom(f)) ownerOf[`${f.id}_custom`] = rt;
        });
    });

    let strayCells = 0;
    const mapped = rows.map(raw => {
        const out = {};
        headers.forEach(h => {
            const target = mapping[h];
            if (!target) return;
            const val = raw[h];
            if (val === undefined || val === null || String(val).trim() === '') return;
            out[target] = typeof val === 'string' ? val.trim() : val;
        });
        const rowType = String(out.rewardType || '').trim();
        Object.keys(out).forEach(k => {
            const owner = ownerOf[k];
            if (owner && owner !== rowType) { delete out[k]; strayCells++; }
        });
        return out;
    }).filter(r => Object.keys(r).length > 0);

    if (mapped.length === 0) {
        alert('Nothing to load — every row came out empty. Check the column mapping.');
        return;
    }

    importedOffersData = mapped;
    offerStatusFilter = 'all';
    offerColumnFilter = 'all';
    const summaryEl = document.getElementById('offerComparisonSummary');
    if (summaryEl) summaryEl.style.display = 'none';
    renderOfferImportTable(importedOffersData);
    document.getElementById('offerRecordCount').textContent = `${mapped.length} records`;
    cancelOfferColumnMapping();

    if (strayCells > 0) {
        const note = document.getElementById('offerImportTableContainer');
        if (note) {
            const el = document.createElement('div');
            el.className = 'alert alert-info py-2 px-3 mb-3';
            el.style.fontSize = '0.78rem';
            el.innerHTML = `<i class="fas fa-circle-info me-1"></i>${strayCells} cell(s) were ignored because they sat under a reward type different from their row's Reward Type.`;
            note.prepend(el);
            setTimeout(() => el.remove(), 12000);
        }
    }
}

// ================================================================
// 11c. EXCEL TEMPLATE GENERATOR
// Three header rows (banner / label / field id) matching the convention
// smartSheetToJson already understands, plus an Allowed Values sheet that
// doubles as the source for the in-cell dropdowns.
// ================================================================

function buildOfferTemplateLayout() {
    const catalogue = getOfferFieldCatalogue();
    const columns = [];
    OFFER_IMPORT_COLUMNS.forEach(k => {
        const c = catalogue.find(x => x.key === k && !x.rewardType);
        columns.push({ key: k, label: c ? c.label : k, banner: OFFER_GROUP_LABELS[getOfferColumnGroup(k)] || 'Offer Fields', options: c ? c.options : [] });
    });
    Object.keys(REWARD_TYPE_FIELDS).forEach(rt => {
        REWARD_TYPE_FIELDS[rt].forEach(f => {
            columns.push({ key: f.id, label: f.label, banner: rt, options: f.options.slice() });
            if (rewardFieldHasCustom(f)) {
                columns.push({ key: `${f.id}_custom`, label: `Custom ${f.label}`, banner: rt, options: [] });
            }
        });
    });
    // Dropdowns in the exported template sort alphabetically, same as the website.
    return columns.map(c => ({ ...c, options: sortOptions(c.options) }));
}

const OFFER_TEMPLATE_BANNER_COLORS = {
    'Core Info': 'FF1E40AF', 'Reward Rule': 'FF1D4ED8', 'Limits': 'FF2563EB',
    'Validity & Link': 'FF3B82F6', 'Payment & Coupon': 'FF60A5FA',
    'Reward Points': 'FF15803D', 'Cashback': 'FF166534', 'Instant Discount': 'FF047857',
    'Variable Discount': 'FF059669', 'Voucher': 'FF0D9488', 'Air Miles': 'FF0F766E',
    'Hotel Points': 'FF115E59', 'Coins': 'FF14532D'
};

function offerTemplateExampleRows(columns) {
    const pick = (key, value) => value;
    const rowA = {
        cardId: 'CARD-100001', offerId: 'OFF-1001', category: 'Dining', subCategory: 'Restaurants',
        rewardType: 'Cashback', frequency: 'Monthly', status: 'Active', days: 'Weekends',
        instancePeriod: 'Per Transaction', person: 'Primary', minTx: '500', maxTx: '25000',
        maxBenefit: '1000', startDate: '2026-01-01', endDate: '2026-12-31',
        weblink: 'https://example.com/offer', paymentScopeType: 'Category', paymentScopeValue: 'Dining',
        rpExpiry: 'No Expiry', couponCode: 'DINE10', platform: 'Smart Buy', customPlatform: '',
        cb_type: 'Percentage Cashback', cb_credit: 'Statement Credit', cb_limit: 'Custom',
        cb_limit_custom: '7500 per month', cb_freq: 'Monthly'
    };
    const rowB = {
        cardId: 'CARD-100001', offerId: 'OFF-1002', category: 'Travel', subCategory: 'Flights',
        rewardType: 'Air Miles', frequency: 'One Time', status: 'Active', days: 'All Days',
        instancePeriod: 'Per Transaction', person: 'All Members', minTx: '5000', maxTx: '200000',
        maxBenefit: '10000', startDate: '2026-03-01', endDate: '2026-09-30',
        weblink: 'https://example.com/miles', paymentScopeType: 'Merchant', paymentScopeValue: 'IndiGo',
        rpExpiry: '24 Months', couponCode: '', platform: 'Other', customPlatform: 'Bank Travel Portal',
        am_airline: 'IndiGo', am_program: 'Flying Returns', am_ratio: '2:1', am_time: 'Instant'
    };
    return [rowA, rowB].map(r => columns.map(c => pick(c.key, r[c.key] !== undefined ? r[c.key] : '')));
}

function downloadOfferTemplate() {
    const columns = buildOfferTemplateLayout();
    if (typeof ExcelJS !== 'undefined') {
        downloadOfferTemplateRich(columns).catch(err => {
            console.warn('Rich template failed, using basic template:', err);
            downloadOfferTemplateBasic(columns);
        });
    } else {
        downloadOfferTemplateBasic(columns);
    }
}

function colLetter(n) {
    let s = '';
    while (n > 0) { const r = (n - 1) % 26; s = String.fromCharCode(65 + r) + s; n = Math.floor((n - 1) / 26); }
    return s;
}

// Full-fat template: coloured banners, frozen headers and real in-cell dropdowns.
async function downloadOfferTemplateRich(columns) {
    const DATA_ROWS = 500;
    const wb = new ExcelJS.Workbook();
    wb.creator = 'RewardGenius';

    const listSheet = wb.addWorksheet('Allowed Values');
    const listRanges = {};
    let listCol = 0;
    columns.forEach(c => {
        if (!c.options || c.options.length === 0) return;
        listCol++;
        const letter = colLetter(listCol);
        listSheet.getCell(`${letter}1`).value = c.key;
        listSheet.getCell(`${letter}1`).font = { bold: true, size: 10 };
        c.options.forEach((o, i) => { listSheet.getCell(`${letter}${i + 2}`).value = String(o); });
        listSheet.getColumn(listCol).width = Math.max(14, Math.min(34, c.key.length + 8));
        listRanges[c.key] = `'Allowed Values'!$${letter}$2:$${letter}$${c.options.length + 1}`;
    });

    const ws = wb.addWorksheet('Offers', { views: [{ state: 'frozen', xSplit: 5, ySplit: 3 }] });

    // Row 1 — banner, merged per group. Row 2 — human label. Row 3 — field id (the real header).
    columns.forEach((c, i) => {
        const n = i + 1;
        ws.getCell(1, n).value = c.banner;
        ws.getCell(1, n).font = { bold: true, color: { argb: 'FFFFFFFF' }, size: 10 };
        ws.getCell(1, n).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: OFFER_TEMPLATE_BANNER_COLORS[c.banner] || 'FF475569' } };
        ws.getCell(1, n).alignment = { horizontal: 'center', vertical: 'middle' };

        ws.getCell(2, n).value = c.label;
        ws.getCell(2, n).font = { bold: true, size: 10, color: { argb: 'FF1E293B' } };
        ws.getCell(2, n).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF1F5F9' } };
        ws.getCell(2, n).alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };

        ws.getCell(3, n).value = c.key;
        ws.getCell(3, n).font = { bold: true, size: 9, color: { argb: 'FF475569' } };
        ws.getCell(3, n).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFE2E8F0' } };
        ws.getCell(3, n).alignment = { horizontal: 'center' };
        ws.getColumn(n).width = Math.max(14, Math.min(26, c.label.length + 4));
    });

    // Merge each run of identical banners into one wide heading.
    let start = 1;
    for (let i = 1; i <= columns.length; i++) {
        const isLast = i === columns.length;
        if (isLast || columns[i].banner !== columns[start - 1].banner) {
            if (i > start) ws.mergeCells(1, start, 1, i);
            start = i + 1;
        }
    }

    offerTemplateExampleRows(columns).forEach((vals, r) => {
        vals.forEach((v, i) => {
            const cell = ws.getCell(4 + r, i + 1);
            cell.value = v === '' ? null : v;
            cell.font = { italic: true, color: { argb: 'FF94A3B8' }, size: 10 };
        });
    });

    columns.forEach((c, i) => {
        const letter = colLetter(i + 1);
        if (!listRanges[c.key]) return;
        for (let r = 4; r <= DATA_ROWS + 3; r++) {
            ws.getCell(`${letter}${r}`).dataValidation = {
                type: 'list', allowBlank: true, formulae: [listRanges[c.key]],
                showErrorMessage: true, errorStyle: 'warning',
                errorTitle: 'Value not in list',
                error: `Pick one of the allowed values for "${c.label}", or type Custom where offered.`
            };
        }
    });

    ws.autoFilter = { from: { row: 3, column: 1 }, to: { row: 3, column: columns.length } };

    const guide = wb.addWorksheet('How To Use');
    [
        ['RewardGenius — Offer Import Template'],
        [''],
        ['1.', 'Fill one row per offer, starting at row 4 of the "Offers" sheet. The two grey italic rows are examples — overwrite or delete them.'],
        ['2.', 'Row 1 is the section banner, row 2 is the friendly label, row 3 is the field id the importer reads. Do not delete or reorder rows 1–3.'],
        ['3.', 'Category and Reward Type are required. A row missing either is skipped when saving to the database.'],
        ['4.', 'Each reward type owns its own block of green columns. Fill ONLY the block matching that row\'s Reward Type and leave the other blocks blank.'],
        ['', 'Example: a Cashback row fills cb_type / cb_credit / cb_limit / cb_freq. An Air Miles row fills am_airline / am_program / am_ratio / am_time.'],
        ['5.', 'Where a dropdown offers "Custom", pick Custom and type the real value into the matching *_custom column (e.g. cb_limit = Custom, cb_limit_custom = 7500 per month).'],
        ['6.', 'Dates use YYYY-MM-DD. Apply Value accepts a comma separated list.'],
        ['7.', 'The "Allowed Values" sheet lists every valid option per column — it powers the dropdowns, so leave it in place.'],
        [''],
        ['After uploading, the app shows a mapping screen so your own column names can be pointed at these fields. Using this template means everything auto-matches.']
    ].forEach(r => guide.addRow(r));
    guide.getRow(1).font = { bold: true, size: 14, color: { argb: 'FF1E40AF' } };
    guide.getColumn(1).width = 5;
    guide.getColumn(2).width = 130;
    guide.getColumn(2).alignment = { wrapText: true, vertical: 'top' };

    const buf = await wb.xlsx.writeBuffer();
    saveBlobAs(new Blob([buf], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }), 'offer_import_template.xlsx');
}

// Fallback when ExcelJS isn't available — same layout, no in-cell dropdowns.
function downloadOfferTemplateBasic(columns) {
    const aoa = [
        columns.map(c => c.banner),
        columns.map(c => c.label),
        columns.map(c => c.key),
        ...offerTemplateExampleRows(columns)
    ];
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet(aoa);
    ws['!cols'] = columns.map(c => ({ wch: Math.max(14, Math.min(26, c.label.length + 4)) }));
    XLSX.utils.book_append_sheet(wb, ws, 'Offers');

    const maxOpts = Math.max(...columns.map(c => (c.options || []).length), 0);
    const listCols = columns.filter(c => (c.options || []).length);
    const listAoa = [listCols.map(c => c.key)];
    for (let i = 0; i < maxOpts; i++) listAoa.push(listCols.map(c => c.options[i] || ''));
    XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(listAoa), 'Allowed Values');

    XLSX.writeFile(wb, 'offer_import_template.xlsx');
}

function saveBlobAs(blob, filename) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function filterOfferImportTable(query) {
    if (!query || query.trim() === '') {
        renderOfferImportTable(importedOffersData);
        document.getElementById('offerRecordCount').textContent = `${importedOffersData.length} records`;
        return;
    }
    query = query.toLowerCase().trim();
    const filtered = importedOffersData.filter(row => {
        return Object.values(row).some(val => {
            if (val === null || val === undefined) return false;
            return String(val).toLowerCase().includes(query);
        });
    });
    renderOfferImportTable(filtered);
    document.getElementById('offerRecordCount').textContent = `${filtered.length} records (filtered)`;
}

function clearOfferImportData() {
    importedOffersData = [];
    document.getElementById('offerExcelImportInput').value = '';
    offerStatusFilter = 'all'; offerColumnFilter = 'all';
    document.getElementById('offerComparisonSummary').style.display = 'none';
    renderOfferImportTable([]);
    document.getElementById('offerRecordCount').textContent = '0 records';
    document.getElementById('offerImportSearchInput').value = '';
}

function exportOfferImportData() {
    if (importedOffersData.length === 0) {
        alert('No data to export.');
        return;
    }
    const headers = Object.keys(importedOffersData[0]);
    let csv = headers.join(',') + '\n';
    importedOffersData.forEach(row => {
        const vals = headers.map(h => {
            let val = row[h] !== undefined && row[h] !== null ? row[h] : '';
            if (typeof val === 'string' && (val.includes(',') || val.includes('"') || val.includes('\n'))) {
                val = '"' + val.replace(/"/g, '""') + '"';
            }
            return val;
        });
        csv += vals.join(',') + '\n';
    });
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'imported_offers.csv';
    a.click();
    URL.revokeObjectURL(url);
}

function saveOfferImportData() {
    if (importedOffersData.length === 0) {
        alert('No offers to save. Please import an Excel file first.');
        return;
    }
    const columnMap = {
        'cardId': 'cardId',
        'offerId': 'offerId',
        'category': 'category',
        'subCategory': 'subCategory',
        'rewardType': 'rewardType',
        'frequency': 'frequency',
        'status': 'status',
        'days': 'days',
        'instancePeriod': 'instancePeriod',
        'person': 'person',
        'minTx': 'minTx',
        'maxTx': 'maxTx',
        'maxBenefit': 'maxBenefit',
        'startDate': 'startDate',
        'endDate': 'endDate',
        'weblink': 'weblink',
        'paymentScopeType': 'paymentScopeType',
        'paymentScopeValue': 'paymentScopeValue',
        'rpExpiry': 'rpExpiry',
        'couponCode': 'couponCode',
        'platform': 'platform',
        'customPlatform': 'customPlatform'
    };
    const rewardFieldPatterns = ['rp_', 'cb_', 'id_', 'vd_', 'v_', 'am_', 'hp_', 'c_'];

    let addedCount = 0;
    importedOffersData.forEach(row => {
        const offer = {
            id: Date.now() + addedCount,
            cardId: '',
            offerId: '',
            category: '',
            subCategory: '',
            rewardType: '',
            frequency: '',
            status: 'Active',
            days: 'All Days',
            instancePeriod: '',
            person: '',
            minTx: '',
            maxTx: '',
            maxBenefit: '',
            startDate: '',
            endDate: '',
            weblink: '',
            paymentScopeType: '',
            paymentScopeValue: [],
            rpExpiry: 'No Expiry',
            couponCode: '',
            platform: '',
            customPlatform: '',
            rewardFields: {},
        };

        for (const [col, prop] of Object.entries(columnMap)) {
            const matchedKey = Object.keys(row).find(k => k.toLowerCase() === col.toLowerCase());
            if (matchedKey && row[matchedKey] !== undefined && row[matchedKey] !== null) {
                if (prop === 'paymentScopeValue') {
                    const val = String(row[matchedKey]);
                    offer.paymentScopeValue = val.split(',').map(s => s.trim()).filter(Boolean);
                } else {
                    offer[prop] = row[matchedKey];
                }
            }
        }

        for (const key of Object.keys(row)) {
            const trimmed = String(key).trim();
            // Normalise the Excel header to the canonical sub-field id (rp_calc, cb_limit, …)
            // so display, validation and edit all read the same keys regardless of header casing.
            const canonical = [...REWARD_SUB_FIELD_IDS].find(id => id.toLowerCase() === trimmed.toLowerCase());
            if (canonical) { offer.rewardFields[canonical] = row[key]; continue; }
            for (const pattern of rewardFieldPatterns) {
                if (trimmed.toLowerCase().startsWith(pattern)) {
                    offer.rewardFields[trimmed] = row[key];
                    break;
                }
            }
        }

        if (!offer.category || !offer.rewardType) return;

        offers.push(offer);
        addedCount++;
    });

    if (addedCount === 0) {
        alert('No valid offers found. Please ensure the Excel contains "category" and "rewardType" columns.');
    } else {
        alert(`✅ ${addedCount} offers saved to the main offers list!`);
        renderOfferTable();
        const savedTable = document.getElementById('offerTableContainer');
        if (savedTable) savedTable.style.display = 'block';
        clearOfferImportData();
    }
}

// ================================================================
// 12. IMPORT PREFERRED BENEFITS STANDALONE PAGE (UPDATED)
// ================================================================

let importedBenefitsData = null;

function buildImportBenefitsPanel() {
    return `
    <div class="import-panel">
        <div class="row g-3 mb-4">
            <div class="col-12" style="margin-top: 0;">
                <div class="upload-layout">
                    <div class="upload-zone-button-wrapper">
                    <div>
                        <div class="upload-icon-badge"><i class="fas fa-cloud-arrow-up"></i></div>
                        <button class="btn btn-primary btn-upload" onclick="document.getElementById('benefitExcelImportInput').click()">
                            <i class="fas fa-file-arrow-up me-2"></i> Choose Benefits Excel File
                        </button>
                        <small class="text-muted d-block mt-1">Upload your Excel file to preview benefit data</small>
                        <input type="file" id="benefitExcelImportInput" accept=".xlsx,.xls" style="display:none;" onchange="handleBenefitExcelImportTable(event)">
                    </div>
                    </div>
                    ${DIFF_COLOR_LEGEND_HTML}
                </div>
            </div>
        </div>
        <div id="benefitImportTableContainer">
            <div class="d-flex justify-content-between align-items-center mb-3">
                <h6 class="fw-bold">Imported Preferred Benefits</h6>
                <div class="d-flex gap-2">
                    <button class="btn btn-primary btn-sm" onclick="compareBenefitsWithDatabase()"><i class="fas fa-code-compare me-1"></i>Compare with Database</button>
                    <button class="btn btn-outline-secondary btn-sm" onclick="clearBenefitImportData()"><i class="fas fa-times me-1"></i>Clear</button>
                </div>
            </div>
            <div id="benefitComparisonSummary" style="display:none;" class="mb-3"></div>
            <div id="benefitImportTablesStandalone"></div>
            <div class="d-flex justify-content-end mt-3">
                <button class="btn btn-success" onclick="saveBenefitImportData()"><i class="fas fa-save me-2"></i>Save Benefits to Form</button>
            </div>
        </div>
    </div>
    `;
}

function renderBenefitImportTablesStandalone(data) {
    const container = document.getElementById('benefitImportTablesStandalone');
    if (!data) {
        container.innerHTML = '<p class="text-muted">No data imported yet.</p>';
        return;
    }
    // 'mains' = one row per card (Lounge/Golf/Insurance/etc. info); falls back to
    // wrapping a single legacy 'main' object so older callers still work.
    const mains = data.mains || (data.main ? [data.main] : []);
    const slabs = data.slabs || [];
    const partners = data.partners || [];

    let html = '';

    const yesNo = (val) => {
        if (val === undefined || val === null) return 'No';
        const v = String(val).toUpperCase();
        return (v === 'TRUE' || v === 'YES' || v === '1') ? 'Yes' : 'No';
    };
    const cid = (row) => row.cardId || row.id || '';
    const statusBadge = (row) => row._status ? ` <span class="badge bg-${row._status==='new'?'success':row._status==='updated'?'warning text-dark':'secondary'} ms-1" style="font-size:0.6rem;">${row._status}</span>` : '';
    const BENEFIT_VALID_OPTIONS = {
        golf_courses: ['DLF Golf','Prestige Golfshire','KGA','Oxford Golf','Jaypee Greens','All Partner Courses'],
        golf_period: ['Monthly','Quarterly','Half-Yearly','Yearly'],
        lounge_program: ['All','Priority Pass','DreamFolks','LoungeKey','Visa Airport Companion','Mastercard Airport Experiences','DragonPass'],
        lounge_dom_period: ['Monthly','Quarterly','Half-Yearly','Yearly'],
        lounge_int_period: ['Monthly','Quarterly','Half-Yearly','Yearly'],
    };
    const cellCls = (val, key) => (val && BENEFIT_VALID_OPTIONS[key] && !BENEFIT_VALID_OPTIONS[key].includes(val)) ? 'cell-invalid' : '';
    const rowHasInvalid = (main, keys) => keys.some(k => cellCls(main[k], k));
    const oldRow = (main, keys) => {
        if (!main._dbMatch || (main._status !== 'updated' && main._status !== 'unchanged')) return '';
        const db = main._dbMatch;
        let cells = `<td><span class="badge bg-secondary" style="font-size:0.65rem;">Old</span></td>`;
        keys.forEach(k => {
            const newStr = String(main[k] || '').trim();
            const oldVal = db[k] || '';
            const oldStr = String(oldVal).trim();
            let cls = '';
            if (oldStr === '' && newStr !== '') cls = 'diff-added';
            else if (oldStr !== '' && newStr === '') cls = 'diff-removed';
            else if (oldStr !== newStr) cls = 'diff-changed';
            cells += `<td class="${cls}">${oldStr === '' ? '<span class=\"text-muted\">—</span>' : oldVal}</td>`;
        });
        return `<tr class="diff-old-row">${cells}</tr>`;
    };

    // Lounge
    const loungeRows = mains.filter(m => m.lounge_program || m.lounge_dom_visits);
    if (loungeRows.length) {
        html += `
        <div class="mt-2">
            <h6 class="fw-bold text-primary"><i class="fas fa-plane me-1"></i> Lounge Access</h6>
            <table class="table table-bordered table-sm" style="font-size:0.75rem;">
                <thead><tr><th>Card ID</th><th>Program</th><th>Domestic Visits</th><th>Domestic Period</th><th>Domestic Frequency</th><th>Domestic Spend</th><th>International Visits</th><th>International Period</th><th>International Frequency</th><th>International Spend</th></tr></thead>
                <tbody>
                    ${loungeRows.map(main => `
                    <tr class="${rowHasInvalid(main, ['lounge_program','lounge_dom_period','lounge_int_period']) ? 'row-invalid' : ''}">
                        <td>${cid(main)}${statusBadge(main)}</td>
                        <td class="${cellCls(main.lounge_program,'lounge_program')}">${main.lounge_program || ''}</td>
                        <td>${main.lounge_dom_visits || ''}</td>
                        <td class="${cellCls(main.lounge_dom_period,'lounge_dom_period')}">${main.lounge_dom_period || ''}</td>
                        <td>${main.lounge_dom_frequency || ''}</td>
                        <td>${main.lounge_dom_criteria || ''}</td>
                        <td>${main.lounge_int_visits || ''}</td>
                        <td class="${cellCls(main.lounge_int_period,'lounge_int_period')}">${main.lounge_int_period || ''}</td>
                        <td>${main.lounge_int_frequency || ''}</td>
                        <td>${main.lounge_int_criteria || ''}</td>
                    </tr>` + oldRow(main, ['lounge_program','lounge_dom_visits','lounge_dom_period','lounge_dom_frequency','lounge_dom_criteria','lounge_int_visits','lounge_int_period','lounge_int_frequency','lounge_int_criteria'])).join('')}
                </tbody>
            </table>
        </div>`;
    }

    // Insurance
    const insuranceRows = mains.filter(m => ['ins_provider','ins_coverage','ins_policyLink'].some(f => m[f] !== undefined && m[f] !== ''));
    if (insuranceRows.length) {
        html += `
        <div class="mt-2">
            <h6 class="fw-bold text-primary"><i class="fas fa-shield-alt me-1"></i> Insurance Benefits</h6>
            <table class="table table-bordered table-sm" style="font-size:0.75rem;">
                <thead><tr><th>Card ID</th><th>Provider</th><th>Coverage</th><th>Policy Link</th></tr></thead>
                <tbody>
                    ${insuranceRows.map(main => `
                    <tr>
                        <td>${cid(main)}${statusBadge(main)}</td>
                        <td>${main.ins_provider || ''}</td>
                        <td>${main.ins_coverage || ''}</td>
                        <td>${main.ins_policyLink || ''}</td>
                    </tr>` + oldRow(main, ['ins_provider','ins_coverage','ins_policyLink'])).join('')}
                </tbody>
            </table>
        </div>`;
    }

    // Golf
    const golfRows = mains.filter(m => m.golf_courses || m.golf_notes);
    if (golfRows.length) {
        html += `
        <div class="mt-2">
            <h6 class="fw-bold text-primary"><i class="fas fa-golf-ball me-1"></i> Golf Benefits</h6>
            <table class="table table-bordered table-sm" style="font-size:0.75rem;">
                <thead><tr><th>Card ID</th><th>Courses</th><th>Rounds</th><th>Period</th><th>Notes</th></tr></thead>
                <tbody>
                    ${golfRows.map(main => `
                    <tr class="${rowHasInvalid(main, ['golf_courses','golf_period']) ? 'row-invalid' : ''}">
                        <td>${cid(main)}${statusBadge(main)}</td>
                        <td class="${cellCls(main.golf_courses,'golf_courses')}">${main.golf_courses || ''}</td>
                        <td>${main.golf_rounds || ''}</td>
                        <td class="${cellCls(main.golf_period,'golf_period')}">${main.golf_period || ''}</td>
                        <td>${main.golf_notes || ''}</td>
                    </tr>` + oldRow(main, ['golf_courses','golf_rounds','golf_period','golf_notes'])).join('')}
                </tbody>
            </table>
        </div>`;
    }

    // Dining
    const diningRows = mains.filter(m => m.dining_partner || m.dining_notes || m.benefit_dining !== undefined);
    if (diningRows.length) {
        html += `
        <div class="mt-2">
            <h6 class="fw-bold text-primary"><i class="fas fa-utensils me-1"></i> Dining Discounts</h6>
            <table class="table table-bordered table-sm" style="font-size:0.75rem;">
                <thead><tr><th>Card ID</th><th>Partner</th><th>Discount Type</th><th>Max Discount</th><th>Frequency</th><th>Min Spend</th><th>Notes</th></tr></thead>
                <tbody>
                    ${diningRows.map(main => `
                    <tr>
                        <td>${cid(main)}${statusBadge(main)}</td>
                        <td>${main.dining_partner || ''}</td>
                        <td>${main.dining_discount_type || ''}</td>
                        <td>${main.dining_max_discount || ''}</td>
                        <td>${main.dining_frequency || ''}</td>
                        <td>${main.dining_min_spend || ''}</td>
                        <td>${main.dining_notes || ''}</td>
                    </tr>` + oldRow(main, ['dining_partner','dining_discount_type','dining_max_discount','dining_frequency','dining_min_spend','dining_notes'])).join('')}
                </tbody>
            </table>
        </div>`;
    }

    // Movie
    const movieRows = mains.filter(m => m.movie_partner || m.movie_notes || m.benefit_movie !== undefined);
    if (movieRows.length) {
        html += `
        <div class="mt-2">
            <h6 class="fw-bold text-primary"><i class="fas fa-film me-1"></i> Movie BOGO</h6>
            <table class="table table-bordered table-sm" style="font-size:0.75rem;">
                <thead><tr><th>Card ID</th><th>Partner</th><th>Discount Type</th><th>Max Discount</th><th>Frequency</th><th>Ticket Limit</th><th>Days</th><th>Notes</th></tr></thead>
                <tbody>
                    ${movieRows.map(main => `
                    <tr>
                        <td>${cid(main)}${statusBadge(main)}</td>
                        <td>${main.movie_partner || ''}</td>
                        <td>${main.movie_discount_type || ''}</td>
                        <td>${main.movie_max_discount || ''}</td>
                        <td>${main.movie_frequency || ''}</td>
                        <td>${main.movie_ticket_limit || ''}</td>
                        <td>${main.movie_days || ''}</td>
                        <td>${main.movie_notes || ''}</td>
                    </tr>` + oldRow(main, ['movie_partner','movie_discount_type','movie_max_discount','movie_frequency','movie_ticket_limit','movie_days','movie_notes'])).join('')}
                </tbody>
            </table>
        </div>`;
    }

    // Spa
    const spaRows = mains.filter(m => m.spa_partner || m.spa_notes || m.benefit_spa !== undefined);
    if (spaRows.length) {
        html += `
        <div class="mt-2">
            <h6 class="fw-bold text-primary"><i class="fas fa-spa me-1"></i> Spa/Wellness</h6>
            <table class="table table-bordered table-sm" style="font-size:0.75rem;">
                <thead><tr><th>Card ID</th><th>Partner</th><th>Discount %</th><th>Max Discount</th><th>Frequency</th><th>Notes</th></tr></thead>
                <tbody>
                    ${spaRows.map(main => `
                    <tr>
                        <td>${cid(main)}${statusBadge(main)}</td>
                        <td>${main.spa_partner || ''}</td>
                        <td>${main.spa_discount || ''}</td>
                        <td>${main.spa_max_discount || ''}</td>
                        <td>${main.spa_frequency || ''}</td>
                        <td>${main.spa_notes || ''}</td>
                    </tr>` + oldRow(main, ['spa_partner','spa_discount','spa_max_discount','spa_frequency','spa_notes'])).join('')}
                </tbody>
            </table>
        </div>`;
    }

    // Milestone
    html += `
    <div class="mt-2">
        <h6 class="fw-bold text-primary"><i class="fas fa-flag-checkered me-1"></i> Milestone Bonus</h6>
        <table class="table table-bordered table-sm" style="font-size:0.75rem;">
            <thead><tr><th>Card ID</th><th>Slab #</th><th>Amount Spent</th><th>Period</th><th>Benefit Value</th><th>Benefit Type</th><th>Comment</th></tr></thead>
            <tbody>
                ${slabs.length ? slabs.map((s, idx) => `
                    <tr>
                        <td>${s.cardId || s.id || ''}</td>
                        <td>${s.slab_no || idx+1}</td>
                        <td>${s.milestone_amount || ''}</td>
                        <td>${s.milestone_period || ''}</td>
                        <td>${s.milestone_benefit_value || ''}</td>
                        <td>${s.milestone_benefit_type || ''}</td>
                        <td>${s.milestone_benefit_comment || ''}</td>
                    </tr>
                `).join('') : `<tr><td colspan="7" class="text-muted text-center">No slabs defined</td></tr>`}
            </tbody>
        </table>
    </div>`;

    // Partner Programs
    html += `
    <div class="mt-2">
        <h6 class="fw-bold text-primary"><i class="fas fa-handshake me-1"></i> Partner Programs</h6>
        <table class="table table-bordered table-sm" style="font-size:0.75rem;">
            <thead><tr><th>Card ID</th><th>#</th><th>Program</th><th>Conversion Ratio</th><th>Min Transfer</th><th>Transfer Time</th></tr></thead>
            <tbody>
                ${partners.length ? partners.map((p, idx) => `
                    <tr>
                        <td>${p.cardId || p.id || ''}</td>
                        <td>${p.partner_no || idx+1}</td>
                        <td>${p.partner_program || ''}</td>
                        <td>${p.partner_ratio || ''}</td>
                        <td>${p.partner_minTransfer || ''}</td>
                        <td>${p.partner_transferTime || ''}</td>
                    </tr>
                `).join('') : `<tr><td colspan="6" class="text-muted text-center">No partner programs</td></tr>`}
            </tbody>
        </table>
    </div>`;

    container.innerHTML = html;
}

function handleBenefitExcelImportTable(event) {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const data = new Uint8Array(e.target.result);
            const workbook = XLSX.read(data, { type: 'array' });
            const json = smartSheetToJson(pickSheet(workbook, 'Preferred Benefits'));
            if (json.length === 0) {
                alert('The Excel file is empty.');
                return;
            }
            // This is the bulk "Import Benefits" preview page — show every card in the
            // sheet, each correctly labeled by its own Card ID (not filtered to one card).
            const mainRows = json.filter(r => !r.slab_no && !r.partner_no);
            const slabRows = json.filter(r => r.slab_no);
            const partnerRows = json.filter(r => r.partner_no);

            importedBenefitsData = {
                main: mainRows[0] || {},   // kept for saveBenefitImportData() backward-compat (first card)
                mains: mainRows,           // full multi-card list used by the preview render
                slabs: slabRows,
                partners: partnerRows
            };
            renderBenefitImportTablesStandalone(importedBenefitsData);
            document.getElementById('benefitExcelImportInput').value = '';
        } catch (err) {
            alert('Error reading Excel file: ' + err.message);
        }
    };
    reader.readAsArrayBuffer(file);
}

function handleBenefitExcelImport(event) {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const data = new Uint8Array(e.target.result);
            const workbook = XLSX.read(data, { type: 'array' });
            const json = smartSheetToJson(pickSheet(workbook, 'Preferred Benefits'));
            if (json.length === 0) {
                alert('The Excel file is empty.');
                return;
            }
            const mainRow = json.find(r => !r.slab_no && !r.partner_no) || json[0];
            const cid = String(mainRow.cardId || mainRow.id || '').trim().toLowerCase();
            const sameCard = (r) => !cid || String(r.cardId || r.id || '').trim().toLowerCase() === cid;
            const slabRows = json.filter(r => r.slab_no && sameCard(r));
            const partnerRows = json.filter(r => r.partner_no && sameCard(r));
            importedBenefitsData = { main: mainRow, slabs: slabRows, partners: partnerRows };
            saveBenefitImportData();
            document.getElementById('benefitExcelInput').value = '';
        } catch (err) {
            alert('Error reading Excel file: ' + err.message);
        }
    };
    reader.readAsArrayBuffer(file);
}

function clearBenefitImportData() {
    importedBenefitsData = null;
    document.getElementById('benefitExcelImportInput').value = '';
    renderBenefitImportTablesStandalone(null);
}

function saveBenefitImportData() {
    if (!importedBenefitsData || !importedBenefitsData.main) {
        alert('No benefit data to save. Please import an Excel file first.');
        return;
    }
    const main = importedBenefitsData.main;
    const slabs = importedBenefitsData.slabs || [];
    const partners = importedBenefitsData.partners || [];

    const parseBool = (val) => {
        if (val === undefined || val === null) return false;
        const v = String(val).toUpperCase();
        return (v === 'TRUE' || v === 'YES' || v === '1');
    };

    // Activate each benefit's checkbox + details panel based on whether its
    // own detail fields are present in the imported row (the old benefit_*
    // yes/no flags were removed from this sheet since Card Details already
    // has them - presence of detail data is now what turns a section on).

    // Golf
    if (main.golf_courses !== undefined || main.golf_notes !== undefined || main.benefit_golf !== undefined) {
        const golfDetails = document.getElementById('benefit_golf_details');
        if (golfDetails) {
            document.getElementById('benefit_golf').checked = true;
            golfDetails.style.display = '';
            golfDetails.querySelectorAll('input, select').forEach(el => el.disabled = false);
            const mapGolf = { 'golf_courses': 'golf_courses', 'golf_rounds': 'golf_rounds', 'golf_period': 'golf_period', 'golf_notes': 'golf_notes' };
            for (const [col, id] of Object.entries(mapGolf)) {
                const el = document.getElementById(id);
                if (el && main[col] !== undefined) el.value = main[col];
            }
        }
    }

    // Lounge
    if (main.lounge_program !== undefined || main.lounge_dom_visits !== undefined) {
        const loungeDetails = document.getElementById('benefit_lounge_details');
        if (loungeDetails) {
            document.getElementById('benefit_lounge').checked = true;
            loungeDetails.style.display = '';
            loungeDetails.querySelectorAll('input, select').forEach(el => el.disabled = false);
            const mapLounge = {
                'lounge_program': 'lounge_program',
                'lounge_dom_visits': 'lounge_dom_visits',
                'lounge_dom_period': 'lounge_dom_period',
                'lounge_dom_frequency': 'lounge_dom_frequency',
                'lounge_dom_criteria': 'lounge_dom_criteria',
                'lounge_int_visits': 'lounge_int_visits',
                'lounge_int_period': 'lounge_int_period',
                'lounge_int_frequency': 'lounge_int_frequency',
                'lounge_int_criteria': 'lounge_int_criteria'
            };
            for (const [col, id] of Object.entries(mapLounge)) {
                const el = document.getElementById(id);
                if (el && main[col] !== undefined) el.value = main[col];
            }
        }
    }

    // Milestone
    if (slabs.length > 0) {
        document.getElementById('benefit_milestone').checked = true;
        document.getElementById('benefit_milestone').dispatchEvent(new Event('change'));
        const milestoneContainer = document.getElementById('milestoneSlabsContainer');
        if (milestoneContainer) {
            milestoneContainer.innerHTML = '';
            window.milestoneCount = 0;
            slabs.forEach((s) => {
                window.milestoneCount++;
                const slabData = {
                    amount: s.milestone_amount || '',
                    period: s.milestone_period || '',
                    benefitValue: s.milestone_benefit_value || '',
                    benefitType: s.milestone_benefit_type || '',
                    benefitComment: s.milestone_benefit_comment || ''
                };
                milestoneContainer.insertAdjacentHTML('beforeend', createMilestoneSlab(window.milestoneCount, slabData));
            });
        }
    }

    // Partner Programs
    if (partners.length > 0) {
        document.getElementById('benefit_partnerProgram').checked = true;
        document.getElementById('benefit_partnerProgram').dispatchEvent(new Event('change'));
        const partnerContainer = document.getElementById('partnerProgramContainer');
        if (partnerContainer) {
            partnerContainer.innerHTML = '';
            window.partnerCount = 0;
            partners.forEach((p) => {
                window.partnerCount++;
                const rowData = {
                    program: p.partner_program || '',
                    ratio: p.partner_ratio || '',
                    minTransfer: p.partner_minTransfer || '',
                    transferTime: p.partner_transferTime || ''
                };
                partnerContainer.insertAdjacentHTML('beforeend', createPartnerRow(window.partnerCount, rowData));
            });
        }
    }

    // Insurance
    const insuranceFields = ['ins_provider', 'ins_coverage', 'ins_policyLink'];
    let hasInsurance = insuranceFields.some(f => main[f] !== undefined);
    if (hasInsurance) {
        const insDetails = document.getElementById('benefit_insurance_details');
        if (insDetails) {
            document.getElementById('benefit_insurance').checked = true;
            insDetails.style.display = '';
            insDetails.querySelectorAll('input, select').forEach(el => el.disabled = false);
            const textFields = ['ins_provider', 'ins_coverage', 'ins_policyLink'];
            textFields.forEach(id => {
                const el = document.getElementById(id);
                if (el && main[id] !== undefined) el.value = main[id];
            });
        }
    }

    // Fee Waiver
    if (main.fee_waiver_spend !== undefined || main.fee_waiver_period !== undefined) {
        const feeWaiverDetails = document.getElementById('benefit_feeWaiver_details');
        if (feeWaiverDetails) {
            document.getElementById('benefit_feeWaiver').checked = true;
            feeWaiverDetails.style.display = '';
            feeWaiverDetails.querySelectorAll('input, select').forEach(el => el.disabled = false);
            if (main.fee_waiver_spend !== undefined) document.getElementById('fee_waiver_spend').value = main.fee_waiver_spend;
            if (main.fee_waiver_period !== undefined) document.getElementById('fee_waiver_period').value = main.fee_waiver_period;
        }
    }

    // Fuel
    if (main.fuel_rate !== undefined || main.fuel_max_waiver !== undefined) {
        const fuelDetails = document.getElementById('benefit_fuel_details');
        if (fuelDetails) {
            document.getElementById('benefit_fuel').checked = true;
            fuelDetails.style.display = '';
            fuelDetails.querySelectorAll('input, select').forEach(el => el.disabled = false);
            const mapFuel = {
                'fuel_rate': 'fuel_rate',
                'fuel_max_waiver': 'fuel_max_waiver',
                'fuel_period': 'fuel_period',
                'fuel_min_tx': 'fuel_min_tx',
                'fuel_max_tx': 'fuel_max_tx'
            };
            for (const [col, id] of Object.entries(mapFuel)) {
                const el = document.getElementById(id);
                if (el && main[col] !== undefined) el.value = main[col];
            }
        }
    }

    // Welcome
    if (main.welcome_value !== undefined || main.welcome_benefit_type !== undefined || main.welcome_free_text !== undefined) {
        const welcomeDetails = document.getElementById('benefit_welcome_details');
        if (welcomeDetails) {
            document.getElementById('benefit_welcome').checked = true;
            welcomeDetails.style.display = '';
            welcomeDetails.querySelectorAll('input, select').forEach(el => el.disabled = false);
            if (main.welcome_value !== undefined) document.getElementById('welcome_value').value = main.welcome_value;
            if (main.welcome_benefit_type !== undefined) document.getElementById('welcome_benefit_type').value = main.welcome_benefit_type;
            if (main.welcome_free_text !== undefined) document.getElementById('welcome_free_text').value = main.welcome_free_text;
        }
    }

    // Concierge
    if (main.concierge_notes !== undefined) {
        const conciergeDetails = document.getElementById('benefit_concierge_details');
        if (conciergeDetails) {
            document.getElementById('benefit_concierge').checked = true;
            conciergeDetails.style.display = '';
            conciergeDetails.querySelectorAll('input, select').forEach(el => el.disabled = false);
            document.getElementById('concierge_notes').value = main.concierge_notes;
        }
    }

    // Dining
    const diningFields = ['dining_partner','dining_discount_type','dining_max_discount','dining_frequency','dining_min_spend','dining_notes'];
    if (diningFields.some(f => main[f] !== undefined)) {
        const diningDetails = document.getElementById('benefit_dining_details');
        if (diningDetails) {
            document.getElementById('benefit_dining').checked = true;
            diningDetails.style.display = '';
            diningDetails.querySelectorAll('input, select').forEach(el => el.disabled = false);
            diningFields.forEach(col => {
                const el = document.getElementById(col);
                if (el && main[col] !== undefined) el.value = main[col];
            });
        }
    }

    // Movie
    const movieFields = ['movie_partner','movie_discount_type','movie_max_discount','movie_frequency','movie_ticket_limit','movie_days','movie_notes'];
    if (movieFields.some(f => main[f] !== undefined)) {
        const movieDetails = document.getElementById('benefit_movie_details');
        if (movieDetails) {
            document.getElementById('benefit_movie').checked = true;
            movieDetails.style.display = '';
            movieDetails.querySelectorAll('input, select').forEach(el => el.disabled = false);
            movieFields.forEach(col => {
                const el = document.getElementById(col);
                if (el && main[col] !== undefined) el.value = main[col];
            });
        }
    }

    // Spa
    const spaFields = ['spa_partner','spa_discount','spa_max_discount','spa_frequency','spa_notes'];
    if (spaFields.some(f => main[f] !== undefined)) {
        const spaDetails = document.getElementById('benefit_spa_details');
        if (spaDetails) {
            document.getElementById('benefit_spa').checked = true;
            spaDetails.style.display = '';
            spaDetails.querySelectorAll('input, select').forEach(el => el.disabled = false);
            spaFields.forEach(col => {
                const el = document.getElementById(col);
                if (el && main[col] !== undefined) el.value = main[col];
            });
        }
    }

    alert('✅ Preferred Benefits saved to the form!');
    importedBenefitsData = null;
    document.getElementById('benefitExcelInput').value = '';
}

// ================================================================
// 13. IMPORT MCC STANDALONE PAGE
// ================================================================

let importedMccData = [];
const MCC_IMPORT_COLUMNS = ['Card', 'Offer ID', 'MCC', 'Inclusion', 'Exclusion'];

function buildImportMccPanel() {
    return `
    <div class="import-panel">
        <div class="row g-3 mb-4">
            <div class="col-12" style="margin-top: 0;">
                <div class="upload-layout">
                    <div class="upload-zone-button-wrapper">
                    <div>
                        <div class="upload-icon-badge"><i class="fas fa-cloud-arrow-up"></i></div>
                        <button class="btn btn-primary btn-upload" onclick="document.getElementById('mccExcelImportInput').click()">
                            <i class="fas fa-file-arrow-up me-2"></i> Choose MCC Excel File
                        </button>
                        <small class="text-muted d-block mt-1">Upload your Excel file with MCC data</small>
                        <input type="file" id="mccExcelImportInput" accept=".xlsx,.xls" style="display:none;" onchange="handleMccExcelImportTable(event)">
                    </div>
                    </div>
                    ${DIFF_COLOR_LEGEND_HTML}
                </div>
            </div>
        </div>
        <div id="mccImportTableContainer">
            <div class="d-flex justify-content-between align-items-center mb-3">
                <h6 class="fw-bold">Imported MCC Data <span id="mccRecordCount" class="badge bg-primary">0 records</span></h6>
                <div class="d-flex gap-2">
                    <button class="btn btn-primary btn-sm" onclick="compareMccWithDatabase()"><i class="fas fa-code-compare me-1"></i>Compare with Database</button>
                    <button class="btn btn-outline-success btn-sm" onclick="exportMccImportData()"><i class="fas fa-download me-1"></i>Export CSV</button>
                    <button class="btn btn-outline-secondary btn-sm" onclick="clearMccImportData()"><i class="fas fa-times me-1"></i>Clear</button>
                </div>
            </div>
            <div id="mccComparisonSummary" style="display:none;" class="mb-3"></div>
            <div class="mb-3">
                <input type="text" id="mccImportSearchInput" class="form-control form-control-sm" placeholder="Search MCC data..." oninput="filterMccImportTable(this.value)">
            </div>
            <div class="table-responsive" style="max-height: 500px; overflow-y: auto; border: 1px solid #e2e8f0; border-radius: 8px;">
                <table class="table table-bordered table-striped table-hover mb-0" id="mccImportTable">
                    <thead id="mccImportTableHead" class="sticky-top bg-white"></thead>
                    <tbody id="mccImportTableBody"></tbody>
                </table>
            </div>
            <div class="d-flex justify-content-end mt-3">
                <button class="btn btn-success" onclick="saveMccImportData()"><i class="fas fa-save me-2"></i>Save MCC Data</button>
            </div>
        </div>
    </div>
    `;
}

function renderMccImportTable(data) {
    const thead = document.getElementById('mccImportTableHead');
    const tbody = document.getElementById('mccImportTableBody');
    let filtered = data;
    if (mccStatusFilter === 'invalid') filtered = filtered.filter(r => validateMccRow(r).size > 0);
    else if (mccStatusFilter !== 'all') filtered = filtered.filter(r => r._status === mccStatusFilter);
    if (mccColumnFilter !== 'all') filtered = filtered.filter(r => r._status === 'new' || !r._dbMatch || String(genericVal(r, mccColumnFilter)).trim() !== String(genericVal(r._dbMatch, mccColumnFilter)).trim());
    const hasStatus = data.some(r => r._status);

    const colCount = MCC_IMPORT_COLUMNS.length + (hasStatus ? 1 : 0);
    let theadHtml = hasStatus ? diffLegendStickyRow(colCount) : '';
    theadHtml += '<tr>';
    if (hasStatus) theadHtml += `<th class="status-col-header" style="font-size:0.75rem; font-weight:600; color:#475569;">Status</th>`;
    MCC_IMPORT_COLUMNS.forEach(col => {
        theadHtml += `<th class="text-nowrap" style="font-size:0.75rem; font-weight:600; color:#475569;">${col}</th>`;
    });
    theadHtml += '</tr>';
    thead.innerHTML = theadHtml;
    thead.classList.toggle('has-legend-row', hasStatus);

    if (!filtered || filtered.length === 0) {
        tbody.innerHTML = `<tr><td colspan="${colCount}" class="text-center text-muted py-3">No MCC data to display. Please import an Excel file.</td></tr>`;
        return;
    }
    tbody.innerHTML = diffRowsHtml(filtered, MCC_IMPORT_COLUMNS, hasStatus, validateMccRow);
}

function handleMccExcelImportTable(event) {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const data = new Uint8Array(e.target.result);
            const workbook = XLSX.read(data, { type: 'array' });
            const json = smartSheetToJson(pickSheet(workbook, 'MCC'));
            if (json.length === 0) {
                alert('The Excel file is empty.');
                return;
            }
            const headers = Object.keys(json[0]);
            const mappedData = json.map(row => {
                const newRow = {};
                MCC_IMPORT_COLUMNS.forEach(col => {
                    const matchedKey = headers.find(h => h.toLowerCase() === col.toLowerCase());
                    newRow[col] = matchedKey ? row[matchedKey] : '';
                });
                return newRow;
            });
            importedMccData = mappedData;
            renderMccImportTable(importedMccData);
            document.getElementById('mccRecordCount').textContent = `${importedMccData.length} records`;
            document.getElementById('mccExcelImportInput').value = '';
        } catch (err) {
            alert('Error reading Excel file: ' + err.message);
        }
    };
    reader.readAsArrayBuffer(file);
}

function filterMccImportTable(query) {
    if (!query || query.trim() === '') {
        renderMccImportTable(importedMccData);
        document.getElementById('mccRecordCount').textContent = `${importedMccData.length} records`;
        return;
    }
    query = query.toLowerCase().trim();
    const filtered = importedMccData.filter(row => {
        return Object.values(row).some(val => {
            if (val === null || val === undefined) return false;
            return String(val).toLowerCase().includes(query);
        });
    });
    renderMccImportTable(filtered);
    document.getElementById('mccRecordCount').textContent = `${filtered.length} records (filtered)`;
}

function clearMccImportData() {
    importedMccData = [];
    document.getElementById('mccExcelImportInput').value = '';
    mccStatusFilter = 'all'; mccColumnFilter = 'all';
    document.getElementById('mccComparisonSummary').style.display = 'none';
    renderMccImportTable([]);
    document.getElementById('mccRecordCount').textContent = '0 records';
    document.getElementById('mccImportSearchInput').value = '';
}

function exportMccImportData() {
    if (importedMccData.length === 0) {
        alert('No data to export.');
        return;
    }
    const headers = MCC_IMPORT_COLUMNS;
    let csv = headers.join(',') + '\n';
    importedMccData.forEach(row => {
        const vals = headers.map(h => {
            let val = row[h] !== undefined && row[h] !== null ? row[h] : '';
            if (typeof val === 'string' && (val.includes(',') || val.includes('"') || val.includes('\n'))) {
                val = '"' + val.replace(/"/g, '""') + '"';
            }
            return val;
        });
        csv += vals.join(',') + '\n';
    });
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'imported_mcc.csv';
    a.click();
    URL.revokeObjectURL(url);
}

function saveMccImportData() {
    if (importedMccData.length === 0) {
        alert('No MCC data to save. Please import an Excel file first.');
        return;
    }
    console.log("--- SAVING MCC DATA TO DATABASE ---");
    console.log(JSON.stringify(importedMccData, null, 2));
    alert(`✅ ${importedMccData.length} MCC records saved to database!\nCheck console for details.`);
}

// ================================================================
// 14. COLUMN GROUP TOGGLES & DATA COMPARISON
// ================================================================

const groupVisibility = {};
for (let i = 1; i <= 11; i++) { groupVisibility[`cardgrp-${i}`] = true; }
for (let i = 1; i <= 6; i++) { groupVisibility[`offergrp-${i}`] = true; }

let currentStatusFilter = 'all';
let databaseData = [];

// Reads a FIXED_COLUMNS field from a raw imported row, matching by COLUMN_ALIASES
// (same lookup renderImportTable used to do inline — now shared so compare & render agree).
function getColVal(row, key) {
    if (!row) return '';
    const aliases = COLUMN_ALIASES[key] || [key];
    const excelColumns = Object.keys(row);
    for (const alias of aliases) {
        const matchedKey = excelColumns.find(colName => colName.toLowerCase() === alias.toLowerCase());
        if (matchedKey && row[matchedKey] !== undefined && row[matchedKey] !== null && row[matchedKey] !== '') {
            return row[matchedKey];
        }
    }
    if (row[key] !== undefined && row[key] !== null) return row[key];
    return '';
}

// Writes back to whichever actual Excel column name matched (via the same alias
// lookup getColVal uses), so an inline-edited value lands in the field the rest
// of the code already reads from — not a brand-new duplicate property.
function setColVal(row, key, newValue) {
    const aliases = COLUMN_ALIASES[key] || [key];
    const excelColumns = Object.keys(row);
    for (const alias of aliases) {
        const matchedKey = excelColumns.find(colName => colName.toLowerCase() === alias.toLowerCase());
        if (matchedKey) { row[matchedKey] = newValue; return; }
    }
    row[key] = newValue;
}

// Returns the correct dropdown option list for a field — including the
// Issuer->Product and Network->SubNetwork dependent pairs — so a click-to-fix
// dropdown always matches what the real card form would show.
function getFieldOptions(key, row) {
    if (key === 'product') return ISSUER_PRODUCTS[getColVal(row, 'issuer')] || [];
    if (key === 'subNetwork') return NETWORKS[getColVal(row, 'network')] || [];
    if (key === 'issuer') return Object.keys(ISSUER_PRODUCTS);
    if (key === 'network') return Object.keys(NETWORKS);
    if (key.startsWith('benefit_')) return ['Yes', 'No'];
    return IMPORT_VALID_OPTIONS[key] || [];
}

// Global row-reference table rebuilt on every renderImportTable() call so a
// click-to-fix dropdown can write straight back into the real importedData row.
let importRowRefs = [];

function openCellDropdown(td) {
    const idx = parseInt(td.dataset.rowIdx, 10);
    const key = td.dataset.colKey;
    const row = importRowRefs[idx];
    if (!row) return;
    const options = getFieldOptions(key, row);
    if (options.length === 0) return;
    const current = String(getColVal(row, key) || '');
    td.innerHTML = `<select class="form-select form-select-sm" style="font-size:0.72rem;"
        onclick="event.stopPropagation()" onchange="applyCellFix(this, ${idx}, '${key}')" onblur="renderImportTable(importedData)">
        <option value="">-- Select --</option>
        ${sortOptions(options).map(o => `<option value="${o}" ${o === current ? 'selected' : ''}>${o}</option>`).join('')}
    </select>`;
    td.querySelector('select').focus();
}

function applyCellFix(select, idx, key) {
    const row = importRowRefs[idx];
    if (!row) return;
    setColVal(row, key, select.value);
    renderImportTable(importedData);
}

// Matches a card to the database using Card ID first; falls back to
// Type + Issuer/Bank + Variant + Network + Sub Network when Card ID is missing.
function getRowMatchKey(row) {
    const id = String(getColVal(row, 'id')).trim().toLowerCase();
    if (id !== '') return 'id:' + id;
    const parts = ['instrument_type', 'issuer', 'product', 'network', 'subNetwork']
        .map(k => String(getColVal(row, k)).trim().toLowerCase());
    return 'combo:' + parts.join('|');
}

function toggleColumnGroup(groupId) {
    groupVisibility[groupId] = !groupVisibility[groupId];
    if (document.getElementById('view-import').classList.contains('active')) {
        renderImportTable(importedData);
        updateComparisonSummary();
    } else if (document.getElementById('view-importOffers').classList.contains('active')) {
        renderOfferImportTable(importedOffersData);
    }
}

function showAllGroups() {
    for (let key in groupVisibility) {
        groupVisibility[key] = true;
    }
    if (document.getElementById('view-import').classList.contains('active')) {
        renderImportTable(importedData);
        updateComparisonSummary();
    } else if (document.getElementById('view-importOffers').classList.contains('active')) {
        renderOfferImportTable(importedOffersData);
    }
}

function hideAllGroups() {
    for (let key in groupVisibility) {
        groupVisibility[key] = false;
    }
    if (document.getElementById('view-import').classList.contains('active')) {
        renderImportTable(importedData);
        updateComparisonSummary();
    } else if (document.getElementById('view-importOffers').classList.contains('active')) {
        renderOfferImportTable(importedOffersData);
    }
}

function compareWithDatabase() {
    if (importedData.length === 0) {
        alert('No data to compare. Please import an Excel file first.');
        return;
    }
    if (databaseData.length === 0) {
        const sampleSize = Math.min(3, importedData.length);
        databaseData = importedData.slice(0, sampleSize).map(row => ({ ...row }));
        // Demo tweak: alter the mock "old" DB rows a bit so Compare shows real
        // differences (yellow/green/red) instead of everything looking identical.
        databaseData.forEach((oldRow, i) => {
            if (i === 0) {
                const oldIssuer = getColVal(oldRow, 'issuer');
                if (oldIssuer) oldRow.issuer = oldIssuer + ' (old)';   // -> yellow (changed)
                oldRow.fee_annual = '';                                 // -> green (was blank, new adds it)
            } else if (i === 1) {
                oldRow.cardWebLink = '';                                // -> green (was blank, new adds it)
                const oldApr = getColVal(oldRow, 'apr');
                if (oldApr !== '') oldRow.apr = Number(oldApr) - 2;    // -> yellow (changed)
            }
            // i === 2 stays an exact clone -> genuinely unchanged, no colors, real-world case
        });
        alert('Mock database populated with sample data. Click "Compare" again to see changes.');
        return;
    }
    const fieldKeys = FIXED_COLUMNS.map(c => c.key);
    const comparedData = importedData.map(row => {
        const rowKey = getRowMatchKey(row);
        const match = databaseData.find(dbRow => getRowMatchKey(dbRow) === rowKey);
        if (!match) {
            return { ...row, _status: 'new', _dbMatch: null };
        }
        let isChanged = false;
        for (const f of fieldKeys) {
            if (String(getColVal(row, f)).trim() !== String(getColVal(match, f)).trim()) {
                isChanged = true;
                break;
            }
        }
        return { ...row, _status: isChanged ? 'updated' : 'unchanged', _dbMatch: match };
    });
    importedData = comparedData;
    renderImportTable(importedData);
    updateComparisonSummary();
    document.getElementById('comparisonSummary').style.display = 'block';
}

function updateComparisonSummary() {
    const summaryDiv = document.getElementById('comparisonSummary');
    if (!summaryDiv) return;
    const newCount = importedData.filter(r => r._status === 'new').length;
    const updatedCount = importedData.filter(r => r._status === 'updated').length;
    const unchangedCount = importedData.filter(r => r._status === 'unchanged' || !r._status).length;
    const invalidCount = importedData.filter(r => validateImportedRow(r).size > 0).length;
    summaryDiv.innerHTML = `
        <div class="d-flex gap-3 align-items-center">
            <span><span class="badge bg-success">New</span> ${newCount}</span>
            <span><span class="badge bg-warning text-dark">Updated</span> ${updatedCount}</span>
            <span><span class="badge bg-secondary">Unchanged</span> ${unchangedCount}</span>
            <span><span class="badge bg-danger">Invalid</span> ${invalidCount}</span>
            <select class="form-select form-select-sm" style="width:auto;" onchange="filterByStatus(this.value)">
                <option value="all">All</option>
                <option value="new">New</option>
                <option value="updated">Updated</option>
                <option value="unchanged">Unchanged</option>
                <option value="invalid">Invalid</option>
            </select>
            <button class="btn btn-sm btn-outline-danger" onclick="clearComparison()">Clear Comparison</button>
        </div>
    `;
}

function filterByStatus(status) {
    currentStatusFilter = status;
    renderImportTable(importedData);
}

function clearComparison() {
    importedData = importedData.map(row => {
        const newRow = { ...row };
        delete newRow._status;
        delete newRow._dbMatch;
        return newRow;
    });
    currentStatusFilter = 'all';
    renderImportTable(importedData);
    document.getElementById('comparisonSummary').style.display = 'none';
}

// ================================================================
// 15. MULTI-SHEET IMPORT HANDLER
// ================================================================

function handleMultiSheetExcelImport(event) {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const data = new Uint8Array(e.target.result);
            const workbook = XLSX.read(data, { type: 'array' });
            const sheetNames = workbook.SheetNames;
            if (sheetNames.length === 0) {
                alert('The Excel file contains no sheets.');
                return;
            }

            let cardData = [];
            let offerData = [];
            let benefitData = null;
            let mccData = [];

            const cardColumns = ['issuer', 'product', 'network', 'instrument_type'];
            const offerColumns = ['category', 'rewardType', 'minTx'];
            const benefitColumns = ['lounge_program', 'lounge_dom_visits', 'golf_courses', 'slab_no', 'milestone_amount', 'partner_program', 'ins_provider'];
            const mccColumns = ['mcc', 'card', 'inclusion', 'exclusion'];

            sheetNames.forEach(sheetName => {
                const sheet = workbook.Sheets[sheetName];
                const json = smartSheetToJson(sheet);
                if (json.length === 0) return;

                const headers = Object.keys(json[0]).map(h => h.toLowerCase());
                const isCard = cardColumns.some(col => headers.includes(col.toLowerCase()));
                const isOffer = offerColumns.some(col => headers.includes(col.toLowerCase()));
                const isBenefit = benefitColumns.some(col => headers.includes(col.toLowerCase()));
                const isMcc = mccColumns.some(col => headers.includes(col.toLowerCase()));

                if (isCard && !isOffer && !isBenefit && !isMcc) {
                    cardData = json;
                } else if (isOffer && !isCard && !isBenefit && !isMcc) {
                    offerData = json;
                } else if (isBenefit && !isCard && !isOffer && !isMcc) {
                    benefitData = json;
                } else if (isMcc && !isCard && !isOffer && !isBenefit) {
                    const mapped = json.map(row => {
                        const newRow = {};
                        MCC_IMPORT_COLUMNS.forEach(col => {
                            const matchedKey = Object.keys(row).find(k => k.toLowerCase() === col.toLowerCase());
                            newRow[col] = matchedKey ? row[matchedKey] : '';
                        });
                        return newRow;
                    });
                    mccData = mapped;
                } else {
                    console.warn(`Sheet "${sheetName}" could not be uniquely identified and was skipped.`);
                }
            });

            if (cardData.length > 0) {
                importedData = cardData;
                renderImportTable(importedData);
                document.getElementById('recordCount').textContent = `${cardData.length} records`;
            }

            if (offerData.length > 0) {
                importedOffersData = offerData;
                if (document.getElementById('view-importOffers').classList.contains('active')) {
                    renderOfferImportTable(importedOffersData);
                    document.getElementById('offerRecordCount').textContent = `${offerData.length} records`;
                }
            }

            if (benefitData) {
                // Same as the standalone Import Benefits page — show every card, not just one.
                const mainRows = benefitData.filter(r => !r.slab_no && !r.partner_no);
                const slabRows = benefitData.filter(r => r.slab_no);
                const partnerRows = benefitData.filter(r => r.partner_no);
                importedBenefitsData = { main: mainRows[0] || {}, mains: mainRows, slabs: slabRows, partners: partnerRows };
                if (document.getElementById('view-importBenefits').classList.contains('active')) {
                    renderBenefitImportTablesStandalone(importedBenefitsData);
                }
            }

            if (mccData.length > 0) {
                importedMccData = mccData;
                if (document.getElementById('view-importMcc').classList.contains('active')) {
                    renderMccImportTable(importedMccData);
                    document.getElementById('mccRecordCount').textContent = `${mccData.length} records`;
                }
            }

            if (document.getElementById('view-import').classList.contains('active')) {
                renderImportTable(importedData);
                document.getElementById('recordCount').textContent = `${importedData.length} records`;
            }

            alert(`✅ Import successful!\nCard Data: ${cardData.length} rows\nOffer Data: ${offerData.length} rows\nBenefits: ${benefitData ? benefitData.length + ' row(s)' : 'None'}\nMCC Data: ${mccData.length} rows`);
            document.getElementById('excelFileInputImport').value = '';
        } catch (err) {
            alert('Error reading Excel file: ' + err.message);
        }
    };
    reader.readAsArrayBuffer(file);
}

// ================================================================
// 16. IMPORT PANEL – MAIN
// ================================================================

let importedData = [];

function renderCardGroupToggleBar() {
    const bar = document.getElementById('cardGroupToggleBar');
    if (!bar) return;
    let html = '';
    Object.keys(CARD_GROUP_LABELS).forEach(g => {
        const active = groupVisibility[g];
        const color = CARD_GROUP_COLORS[g];
        const textcolor = CARD_GROUP_TEXTCOLORS[g];
        const style = active
            ? `background-color:${color}; border-color:${color}; color:${textcolor};`
            : `border-color:${color};`;
        html += `<button type="button" class="btn btn-sm group-btn ${active ? 'is-active' : 'is-inactive'} me-2 mb-2" style="${style}" onclick="toggleColumnGroup('${g}')">
            <i class="fas ${active ? 'fa-eye' : 'fa-eye-slash'} me-1"></i>${CARD_GROUP_LABELS[g]}
        </button>`;
    });
    bar.innerHTML = html;
}

// Shown on every import page (Cards, Offers, Preferred Benefits, MCC) — explains
// the Old-row diff colors used after "Compare with Database". Also repeated as a
// compact sticky strip inside each table's header (see DIFF_LEGEND_STICKY_ROW_HTML)
// so it stays visible while scrolling through rows, not just before you scroll.
const DIFF_COLOR_LEGEND_HTML = `
    <div class="diff-color-legend">
        <div class="legend-title"><i class="fas fa-circle-info me-1"></i>Color Guide — Compare with Database &amp; Validation</div>
        <div class="legend-items">
            <div class="legend-row"><span class="legend-swatch" style="background:#eab308;"></span>Yellow — value changed</div>
            <div class="legend-row"><span class="legend-swatch" style="background:#22c55e;"></span>Green — new data added (was blank)</div>
            <div class="legend-row"><span class="legend-swatch" style="background:#ef4444;"></span>Red — data removed (now blank)</div>
            <div class="legend-row"><span class="legend-swatch" style="background:#b91c1c;"></span>Dark Red (bold, blinking) — this value is invalid</div>
        </div>
    </div>`;

// Compact one-line version of the legend above, inserted as the first row of
// a table's <thead> (only once a comparison has run) so it scrolls together
// with the sticky column headers and stays visible the whole time you scroll.
function diffLegendStickyRow(colspan) {
    return `<tr class="diff-legend-sticky-row"><td colspan="${colspan}">
        <span class="legend-chip"><span class="dot" style="background:#eab308;"></span>Yellow = changed</span>
        <span class="legend-chip"><span class="dot" style="background:#22c55e;"></span>Green = added</span>
        <span class="legend-chip"><span class="dot" style="background:#ef4444;"></span>Red = removed</span>
        <span class="legend-chip"><span class="dot" style="background:#b91c1c;"></span>Dark Red = invalid value</span>
    </td></tr>`;
}

function buildImportPanel() {
    return `
    <div class="import-panel">
        <div class="row g-3 mb-4">
            <div class="col-12" style="margin-top: 0;">
                <div class="upload-layout">
                    <div class="upload-zone-button-wrapper">
                    <div>
                       <div class="upload-icon-badge"><i class="fas fa-cloud-arrow-up"></i></div>
                       <button class="btn btn-primary btn-upload" onclick="document.getElementById('excelFileInputImport').click()">
                            <i class="fas fa-file-arrow-up me-2"></i> Choose Excel File
                        </button>
                        <small class="text-muted d-block mt-1">Supports multiple sheets: Card Details, Offers, Preferred Benefits, MCC</small>
                        <input type="file" id="excelFileInputImport" accept=".xlsx,.xls" style="display:none;" onchange="handleMultiSheetExcelImport(event)">
                    </div>
                    </div>
                    ${DIFF_COLOR_LEGEND_HTML}
                </div>
            </div>
        </div>
        <div id="excelDataTableContainer">
            <div class="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
                <div>
                    <h6 class="fw-bold d-inline me-2">Imported Data</h6>
                    <span id="recordCount" class="badge bg-primary">0 records</span>
                </div>
                <div class="d-flex gap-2">
                    <button class="btn btn-primary btn-sm" onclick="compareAllWithDatabase()" title="Compares Cards + Offers + Benefits + MCC together"><i class="fas fa-code-compare me-1"></i>Compare with Database</button>
                    <button class="btn btn-outline-success btn-sm" onclick="exportImportData()"><i class="fas fa-download me-1"></i>Export CSV</button>
                    <span class="filter-icon-group">
                        <span class="filter-icon-box"><i class="fas fa-sliders"></i></span>
                        <select class="form-select form-select-sm" style="width:auto;" onchange="if(this.value==='show')showAllGroups(); else if(this.value==='hide')hideAllGroups(); this.selectedIndex=0;">
                            <option value="" selected disabled>Filter Sheet</option>
                            <option value="show">Show All Columns</option>
                            <option value="hide">Hide All Columns</option>
                        </select>
                    </span>
                    <button class="btn btn-outline-secondary btn-sm" onclick="clearImportData()"><i class="fas fa-times me-1"></i>Clear</button>
                </div>
            </div>
            <div id="comparisonSummary" style="display:none;" class="mb-3"></div>
            <div class="mb-3">
                <input type="text" id="importSearchInput" class="form-control form-control-sm" placeholder="Search imported data..." oninput="filterImportTable(this.value)">
            </div>
            <div id="cardGroupToggleBar" class="group-toggle-bar mb-3"></div>
            <div class="table-responsive" style="max-height: 600px; overflow-y: auto; border: 1px solid #0b0b0b; border-radius: 8px;">
                <table class="table table-bordered table-striped table-hover mb-0" id="excelDataTable">
                    <thead id="excelTableHead" class="sticky-top bg-white"></thead>
                    <tbody id="excelTableBody"></tbody>
                </table>
            </div>
            <div class="d-flex justify-content-end mt-3">
                <button class="btn btn-success" onclick="saveImportData()"><i class="fas fa-save me-2"></i>Save in Database</button>
            </div>
        </div>
    </div>
    `;
}

// FIXED_COLUMNS – removed fuel detail columns, kept benefit_fuel
const FIXED_COLUMNS = [
    { key: 'id', label: 'Card ID' },
    { key: 'instrument_type', label: 'Type' },
    { key: 'issuer', label: 'Issuer/Bank' },
    { key: 'product', label: 'Variant' },
    { key: 'network', label: 'Network' },
    { key: 'subNetwork', label: 'Sub Network' },
    { key: 'issuerCountry', label: 'Issuer Country' },
    { key: 'cardStatus', label: 'Card Status' },
    { key: 'cardStatusDate', label: 'Effective Date' },
    { key: 'cardWebLink', label: 'Card Web Link' },
    { key: 'cardAltLink', label: 'Application/Landing Page' },
    { key: 'card_spend_per_point', label: 'Spend per Reward Point (₹)' },
    { key: 'card_rp_conversion', label: 'RP Conversion Value (₹)' },
    { key: 'apr', label: 'APR %' },
    { key: 'card_bill_cycle_duration', label: 'Cycle Date' },
    { key: 'card_bill_date', label: 'Bill/Statement Date' },
    { key: 'cobrand', label: 'Co-brand' },
    { key: 'rewardProgram', label: 'Reward Program' },
    { key: 'ageMin', label: 'Age Min' },
    { key: 'ageMax', label: 'Age Max' },
    { key: 'creditScore', label: 'Credit Score' },
    { key: 'empType', label: 'Employment Type' },
    { key: 'salary', label: 'Salary' },
    { key: 'productType', label: 'Product Type' },
    { key: 'nationality', label: 'Nationality' },
    { key: 'fee_joining_type', label: 'Joining Fee Type' },
    { key: 'fee_joining', label: 'Joining Fee' },
    { key: 'fee_annual', label: 'Annual Fee' },
    { key: 'fee_renewal', label: 'Renewal Fee' },
    { key: 'fee_waiver_spend', label: 'Fee Waiver Spend' },
    { key: 'fee_waiver_period', label: 'Fee Waiver Period' },
    { key: 'benefit_concierge', label: 'Concierge' },
    { key: 'benefit_dining', label: 'Dining' },
    { key: 'benefit_golf', label: 'Golf' },
    { key: 'benefit_movie', label: 'Movie' },
    { key: 'benefit_spa', label: 'Spa' },
    { key: 'benefit_insurance', label: 'Insurance' },
    { key: 'benefit_fees', label: 'Fees' },
    { key: 'benefit_contactless', label: 'Contactless' },
    { key: 'benefit_tokenEnabled', label: 'Token Enabled' },
    { key: 'benefit_upiSupported', label: 'UPI Supported' },
    { key: 'benefit_welcome', label: 'Welcome' },
    { key: 'benefit_feeWaiver', label: 'Fee Waiver' },
    { key: 'benefit_fuel', label: 'Fuel Surcharge' },
    { key: 'benefit_lounge', label: 'Lounge Access' },
    { key: 'benefit_milestone', label: 'Milestone' },
    { key: 'benefit_partnerProgram', label: 'Partner Program' }
];

// COLUMN_ALIASES – removed fuel detail aliases
const COLUMN_ALIASES = {
    'id': ['id', 'card_id', 'cardid'],
    'instrument_type': ['instrument_type', 'instrument', 'type'],
    'issuer': ['issuer', 'issuer/bank', 'bank', 'issuer_bank'],
    'product': ['product', 'variant', 'card_name', 'cardname'],
    'network': ['network', 'card_network'],
    'subNetwork': ['subNetwork', 'sub_network', 'subnetwork'],
    'issuerCountry': ['issuerCountry', 'issuer_country', 'country'],
    'cardStatus': ['cardStatus', 'card_status', 'status'],
    'cardStatusDate': ['cardStatusDate', 'card_status_date', 'status_date'],
    'cardWebLink': ['cardWebLink', 'card_web_link', 'weblink'],
    'cardAltLink': ['cardAltLink', 'card_alt_link', 'altlink', 'application_link'],
    'card_spend_per_point': ['card_spend_per_point', 'spend_per_point', 'spendperpoint'],
    'card_rp_conversion': ['card_rp_conversion', 'rp_conversion', 'rpvalue'],
    'apr': ['apr', 'APR %', 'APR%'],
    'card_bill_cycle_duration': ['card_bill_cycle_duration', 'cycle_date', 'billing cycle'],
    'card_bill_date': ['card_bill_date', 'bill_date', 'billingdate'],
    'cobrand': ['cobrand', 'co_brand'],
    'rewardProgram': ['rewardProgram', 'reward_program'],
    'ageMin': ['ageMin', 'age_min', 'minage'],
    'ageMax': ['ageMax', 'age_max', 'maxage'],
    'creditScore': ['creditScore', 'credit_score'],
    'empType': ['empType', 'emp_type', 'employment'],
    'salary': ['salary', 'income'],
    'productType': ['productType', 'product_type'],
    'nationality': ['nationality'],
    'fee_joining_type': ['fee_joining_type', 'joining_type', 'feetype'],
    'fee_joining': ['fee_joining', 'joining_fee'],
    'fee_annual': ['fee_annual', 'annual_fee'],
    'fee_renewal': ['fee_renewal', 'renewal_fee'],
    'fee_waiver_spend': ['fee_waiver_spend', 'waiver_spend'],
    'fee_waiver_period': ['fee_waiver_period', 'waiver_period'],
    'benefit_concierge': ['benefit_concierge', 'concierge_check'],
    'benefit_dining': ['benefit_dining', 'dining_check'],
    'benefit_golf': ['benefit_golf', 'golf_check'],
    'benefit_movie': ['benefit_movie', 'movie_check'],
    'benefit_spa': ['benefit_spa', 'spa_check'],
    'benefit_insurance': ['benefit_insurance', 'insurance_check'],
    'benefit_fees': ['benefit_fees', 'fees_check'],
    'benefit_contactless': ['benefit_contactless', 'contactless_check', 'contactless'],
    'benefit_tokenEnabled': ['benefit_tokenEnabled', 'token_check', 'token'],
    'benefit_upiSupported': ['benefit_upiSupported', 'upi_check', 'upi'],
    'benefit_welcome': ['benefit_welcome', 'welcome_check'],
    'benefit_feeWaiver': ['benefit_feeWaiver', 'feewaiver_check'],
    'benefit_fuel': ['benefit_fuel', 'fuel_check'],
    'benefit_lounge': ['benefit_lounge', 'lounge_check'],
    'benefit_milestone': ['benefit_milestone', 'milestone_check'],
    'benefit_partnerProgram': ['benefit_partnerProgram', 'partner_check']
};

// Extra keys used by Offers / Preferred Benefits / MCC sheets (not in COLUMN_ALIASES,
// which only covers the Cards sheet) — used below to recognize a valid header row.
const EXTRA_KNOWN_KEYS = [
    'cardid', 'offerid', 'category', 'subcategory', 'rewardtype', 'mintx', 'maxtx',
    'slab_no', 'partner_no', 'lounge_program', 'golf_courses', 'milestone_amount',
    'partner_program', 'ins_provider', 'mcc', 'card', 'inclusion', 'exclusion'
].concat([...REWARD_SUB_FIELD_IDS]);
const ALL_KNOWN_KEYS = new Set(
    Object.keys(COLUMN_ALIASES)
        .flatMap(k => COLUMN_ALIASES[k])
        .concat(Object.keys(COLUMN_ALIASES))
        .concat(EXTRA_KNOWN_KEYS)
        .map(k => String(k).toLowerCase())
);

// Reads a worksheet as JSON, auto-detecting where the real header row is.
// Normal sheets (Cards/Offers/MCC) have headers on row 1, so that's tried first.
// The "Preferred Benefits" template sheet has a colored section band on row 1 and a
// friendly label on row 2 — its real column keys (cardId, slab_no, ...) sit on row 3,
// with data starting row 4. If row-1 headers don't match anything we recognize, retry
// treating row 3 as the header (SheetJS 'range: 2' = 0-indexed row 3).
// Multi-sheet template workbooks lead with a "How To Use" sheet, so SheetNames[0]
// is prose, not data. Pick the sheet whose name matches (case-insensitive); fall
// back to the first sheet for plain single-sheet uploads.
function pickSheet(workbook, preferredName) {
    const want = String(preferredName).trim().toLowerCase();
    const hit = workbook.SheetNames.find(n => String(n).trim().toLowerCase() === want);
    return workbook.Sheets[hit || workbook.SheetNames[0]];
}

function smartSheetToJson(worksheet) {
    const firstTry = XLSX.utils.sheet_to_json(worksheet, { defval: '' });
    if (firstTry.length > 0) {
        const keys = Object.keys(firstTry[0]).map(k => String(k).toLowerCase());
        const matchCount = keys.filter(k => ALL_KNOWN_KEYS.has(k)).length;
        if (matchCount >= 2) return firstTry;
    }
    const templateTry = XLSX.utils.sheet_to_json(worksheet, { range: 2, defval: '' });
    return templateTry.length > 0 ? templateTry : firstTry;
}

// Named card groups
const CARD_GROUP_LABELS = {
    'cardgrp-1': 'Card Details',
    'cardgrp-2': 'Card Meta Data',
    'cardgrp-3': 'Pricing & Rewards',
    'cardgrp-4': 'Eligibility',
    'cardgrp-5': 'Fees',
    'cardgrp-11': 'Benefit Flags (Yes/No)'
};

const CARD_GROUP_COLORS = {
    'cardgrp-1': '#2563eb', 'cardgrp-2': '#2563eb', 'cardgrp-3': '#2563eb',
    'cardgrp-4': '#2563eb', 'cardgrp-5': '#2563eb', 'cardgrp-11': '#2563eb'
};
const CARD_GROUP_TEXTCOLORS = { 'cardgrp-1': '#fff', 'cardgrp-2': '#fff', 'cardgrp-3': '#fff', 'cardgrp-4': '#fff', 'cardgrp-5': '#fff', 'cardgrp-11': '#fff' };




function getColumnGroup(key) {
    const groupMap = {
        'id': 'cardgrp-1',
        'instrument_type': 'cardgrp-1',
        'issuer': 'cardgrp-1',
        'product': 'cardgrp-1',
        'network': 'cardgrp-1',
        'subNetwork': 'cardgrp-1',
        'issuerCountry': 'cardgrp-2',
        'cardStatus': 'cardgrp-2',
        'cardStatusDate': 'cardgrp-2',
        'cardWebLink': 'cardgrp-2',
        'cardAltLink': 'cardgrp-2',
        'card_spend_per_point': 'cardgrp-3',
        'card_rp_conversion': 'cardgrp-3',
        'apr': 'cardgrp-3',
        'card_bill_cycle_duration': 'cardgrp-3',
        'card_bill_date': 'cardgrp-3',
        'cobrand': 'cardgrp-3',
        'rewardProgram': 'cardgrp-3',
        'ageMin': 'cardgrp-4',
        'ageMax': 'cardgrp-4',
        'creditScore': 'cardgrp-4',
        'empType': 'cardgrp-4',
        'salary': 'cardgrp-4',
        'productType': 'cardgrp-4',
        'nationality': 'cardgrp-4',
        'id': '',
        'fee_joining_type': 'cardgrp-5',
        'fee_joining': 'cardgrp-5',
        'fee_annual': 'cardgrp-5',
        'fee_renewal': 'cardgrp-5',
        'fee_waiver_spend': 'cardgrp-5',
        'fee_waiver_period': 'cardgrp-5',
        'benefit_concierge': 'cardgrp-11',
        'benefit_dining': 'cardgrp-11',
        'benefit_golf': 'cardgrp-11',
        'benefit_movie': 'cardgrp-11',
        'benefit_spa': 'cardgrp-11',
        'benefit_insurance': 'cardgrp-11',
        'benefit_fees': 'cardgrp-11',
        'benefit_contactless': 'cardgrp-11',
        'benefit_tokenEnabled': 'cardgrp-11',
        'benefit_upiSupported': 'cardgrp-11',
        'benefit_welcome': 'cardgrp-11',
        'benefit_feeWaiver': 'cardgrp-11',
        'benefit_fuel': 'cardgrp-11',
        'benefit_lounge': 'cardgrp-11',
        'benefit_milestone': 'cardgrp-11',
        'benefit_partnerProgram': 'cardgrp-11'
    };
    return groupMap[key] !== undefined ? groupMap[key] : 'cardgrp-11';
}

// ===== Import validation: checks each imported row's dropdown-driven fields against
// the same option lists / dependent pairs (Issuer->Product, Network->SubNetwork) used
// in the actual card form. Returns a Set of FIXED_COLUMNS keys that are invalid. =====
const IMPORT_VALID_OPTIONS = {
    instrument_type: ['Credit Card','Debit Card','UPI','Bank Account','Wallet','Digi Wallet','Crypto Wallet'],
    cardStatus: ['Active','Discontinued','Upcoming','ToBeDiscontinued'],
    card_bill_cycle_duration: ['15 Days','18 Days','20 Days','25 Days','30 Days (Monthly)','Custom'],
    creditScore: ['Any','<600','<650','<700','<750','<800','600+','650+','700+','750+','800+','850+'],
    ageMin: ['All','13+','18+','21+','30+'],
    ageMax: ['All','<40','<50','<60','<70','<75','<80'],
    empType: ['Salaried','Business','Self Employed','All'],
    salary: ['NA','1.8L+','2.4L+','3L+','3.6L+','6L+','10L+','12L+','18L+','24L+','30L+'],
    productType: ['General','Business','Corporate','FD backed','Invite Only','Others'],
    nationality: ['Resident Indian','NRI','Foreign National','OCI / PIO','Any'],
    fee_joining_type: ['Custom','LTF'],
    fee_waiver_period: ['Monthly','Quarterly','Half-Yearly','Yearly','Birthday','Anniversary','Festival'],
    welcome_benefit_type: ['Voucher','Rs','RP','Cashback'],
};
function validateImportedRow(row) {
    const invalid = new Set();
    const val = (k) => String(getColVal(row, k) ?? '').trim();

    for (const key in IMPORT_VALID_OPTIONS) {
        const v = val(key);
        if (v && !IMPORT_VALID_OPTIONS[key].includes(v)) invalid.add(key);
    }
    FIXED_COLUMNS.forEach(col => {
        if (col.key.startsWith('benefit_')) {
            const v = val(col.key);
            if (v && !['Yes','No','TRUE','FALSE','true','false','1','0'].includes(v)) invalid.add(col.key);
        }
    });

    const issuer = val('issuer'), product = val('product');
    if (issuer && !ISSUER_PRODUCTS[issuer]) invalid.add('issuer');
    if (product && issuer && ISSUER_PRODUCTS[issuer] && !ISSUER_PRODUCTS[issuer].includes(product)) invalid.add('product');

    const network = val('network'), subNetwork = val('subNetwork');
    if (network && !NETWORKS[network]) invalid.add('network');
    if (subNetwork && network && NETWORKS[network] && !NETWORKS[network].includes(subNetwork)) invalid.add('subNetwork');

    return invalid;
}

function renderImportTable(data) {
    const thead = document.getElementById('excelTableHead');
    const tbody = document.getElementById('excelTableBody');

    let filteredData = data;
    if (currentStatusFilter === 'invalid') {
        filteredData = data.filter(row => validateImportedRow(row).size > 0);
    } else if (currentStatusFilter !== 'all') {
        filteredData = data.filter(row => row._status === currentStatusFilter);
    }

    renderCardGroupToggleBar();

    const hasStatus = data.some(row => row._status);
    const colCount = FIXED_COLUMNS.length + (hasStatus ? 1 : 0);
    let theadHtml = hasStatus ? diffLegendStickyRow(colCount) : '';
    theadHtml += '<tr>';
    if (hasStatus) {
        theadHtml += `<th class="status-col-header" style="font-size:0.75rem; font-weight:600; color:#475569;">Status</th>`;
    }
    FIXED_COLUMNS.forEach((col, i) => {
        const groupClass = getColumnGroup(col.key);
        const isHidden = groupClass && !groupVisibility[groupClass];
        const prevGroup = i > 0 ? getColumnGroup(FIXED_COLUMNS[i - 1].key) : null;
        const nextGroup = i < FIXED_COLUMNS.length - 1 ? getColumnGroup(FIXED_COLUMNS[i + 1].key) : null;
        const edge = (groupClass !== prevGroup ? 'grp-start ' : '') + (groupClass !== nextGroup ? 'grp-end' : '');
        theadHtml += `<th class="text-nowrap ${groupClass} ${edge} ${isHidden ? 'col-group-hidden' : ''}" style="font-size:0.75rem; font-weight:600; color:#475569;">
            ${col.label}
        </th>`;
    });
    theadHtml += '</tr>';
    thead.innerHTML = theadHtml;
    thead.classList.toggle('has-legend-row', hasStatus);

    if (!filteredData || filteredData.length === 0) {
        tbody.innerHTML = `<tr><td colspan="${colCount}" class="text-center text-muted py-3">No data to display. Please import an Excel file.</td></tr>`;
        return;
    }

    const fmt = (val) => {
        let display = (val === undefined || val === null) ? '' : val;
        if (typeof display === 'string' && display.length > 50) display = display.substring(0, 50) + '...';
        return display;
    };
    const boolLabel = (val) => {
        const b = (val === true || val === 'TRUE' || val === 'true' || val === '1' || val === 1 || String(val).toLowerCase() === 'yes');
        return b ? 'Yes' : 'No';
    };

    let tbodyHtml = '';
    importRowRefs = [];
    filteredData.forEach(row => {
        const rowIdx = importRowRefs.length;
        importRowRefs.push(row);
        const dbRow = row._dbMatch;
        const showOldRow = (row._status === 'updated' || row._status === 'unchanged') && dbRow;

        // ---- New / imported row ----
        const invalidFields = validateImportedRow(row);
        tbodyHtml += `<tr class="${showOldRow ? 'diff-new-row' : ''} ${invalidFields.size > 0 ? 'row-invalid' : ''}">`;
        if (hasStatus) {
            tbodyHtml += `<td class="status-cell"><span class="badge bg-success">New</span></td>`;
        }
        FIXED_COLUMNS.forEach((col, i) => {
            const groupClass = getColumnGroup(col.key);
            const isHidden = groupClass && !groupVisibility[groupClass];
            const prevGroup = i > 0 ? getColumnGroup(FIXED_COLUMNS[i - 1].key) : null;
            const nextGroup = i < FIXED_COLUMNS.length - 1 ? getColumnGroup(FIXED_COLUMNS[i + 1].key) : null;
            const edge = (groupClass !== prevGroup ? 'grp-start ' : '') + (groupClass !== nextGroup ? 'grp-end' : '');
            let val = getColVal(row, col.key);
            if (col.key.startsWith('benefit_')) val = boolLabel(val);
            const cellInvalid = invalidFields.has(col.key) ? 'cell-invalid' : '';
            const clickAttrs = cellInvalid ? `data-row-idx="${rowIdx}" data-col-key="${col.key}" onclick="openCellDropdown(this)" style="font-size:0.75rem; cursor:pointer;"` : `style="font-size:0.75rem;"`;
            tbodyHtml += `<td class="${groupClass} ${edge} ${isHidden ? 'col-group-hidden' : ''} ${cellInvalid}" ${clickAttrs} title="${cellInvalid ? 'Click to fix — pick a valid value' : ''}">${fmt(val)}</td>`;
        });
        tbodyHtml += '</tr>';

        // ---- Old / database row — cell colors show what changed vs the new row above ----
        // Yellow (diff-changed) = value updated | Green (diff-added) = was blank, new data added
        // | Red (diff-removed) = had data, new import blanks it out
        if (showOldRow) {
            tbodyHtml += `<tr class="diff-old-row">`;
            if (hasStatus) {
                tbodyHtml += `<td class="status-cell"><span class="badge bg-secondary">Old</span></td>`;
            }
            FIXED_COLUMNS.forEach((col, i) => {
                const groupClass = getColumnGroup(col.key);
                const isHidden = groupClass && !groupVisibility[groupClass];
                const prevGroup = i > 0 ? getColumnGroup(FIXED_COLUMNS[i - 1].key) : null;
                const nextGroup = i < FIXED_COLUMNS.length - 1 ? getColumnGroup(FIXED_COLUMNS[i + 1].key) : null;
                const edge = (groupClass !== prevGroup ? 'grp-start ' : '') + (groupClass !== nextGroup ? 'grp-end' : '');
                let newVal = getColVal(row, col.key);
                let oldVal = getColVal(dbRow, col.key);
                if (col.key.startsWith('benefit_')) {
                    newVal = boolLabel(newVal);
                    oldVal = boolLabel(oldVal);
                }
                const newStr = String(newVal).trim();
                const oldStr = String(oldVal).trim();
                let diffClass = '';
                if (oldStr === '' && newStr !== '') diffClass = 'diff-added';
                else if (oldStr !== '' && newStr === '') diffClass = 'diff-removed';
                else if (oldStr !== newStr) diffClass = 'diff-changed';
                const display = oldStr === '' ? '<span class="text-muted">—</span>' : fmt(oldVal);
                tbodyHtml += `<td class="${groupClass} ${edge} ${isHidden ? 'col-group-hidden' : ''} ${diffClass}" style="font-size:0.75rem;">${display}</td>`;
            });
            tbodyHtml += '</tr>';
        }
    });
    tbody.innerHTML = tbodyHtml;

    document.getElementById('recordCount').textContent = `${filteredData.length} records`;
}

function filterImportTable(query) {
    if (!query || query.trim() === '') {
        renderImportTable(importedData);
        return;
    }
    query = query.toLowerCase().trim();
    const filtered = importedData.filter(row => {
        return Object.values(row).some(val => {
            if (val === null || val === undefined) return false;
            return String(val).toLowerCase().includes(query);
        });
    });
    renderImportTable(filtered);
}

function clearImportData() {
    importedData = [];
    document.getElementById('excelFileInputImport').value = '';
    renderImportTable([]);
    document.getElementById('recordCount').textContent = '0 records';
    document.getElementById('importSearchInput').value = '';
    document.getElementById('comparisonSummary').style.display = 'none';
    databaseData = [];
    currentStatusFilter = 'all';
}

function exportImportData() {
    if (importedData.length === 0) {
        alert('No data to export.');
        return;
    }
    const headers = Object.keys(importedData[0]);
    let csv = headers.join(',') + '\n';
    importedData.forEach(row => {
        const vals = headers.map(h => {
            let val = row[h] !== undefined && row[h] !== null ? row[h] : '';
            if (typeof val === 'string' && (val.includes(',') || val.includes('"') || val.includes('\n'))) {
                val = '"' + val.replace(/"/g, '""') + '"';
            }
            return val;
        });
        csv += vals.join(',') + '\n';
    });
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'imported_data.csv';
    a.click();
    URL.revokeObjectURL(url);
}

function saveImportData() {
    if (importedData.length === 0) {
        alert('No data to save. Please import an Excel file first.');
        return;
    }
    const payload = {
        records: importedData,
        totalRecords: importedData.length,
        timestamp: new Date().toISOString()
    };
    console.log("--- SAVING IMPORTED DATA TO DATABASE ---");
    console.log(JSON.stringify(payload, null, 2));
    alert(`✅ ${importedData.length} records sent for approval / saved to database!\nCheck console for details.`);
}

function handleExcelImport(event) {
    // Legacy – kept for compatibility
}

// ================================================================
// 18. SAVE TO DATABASE (UPDATED with new fields)
// ================================================================

function saveAllToDatabase() {
    const cardData = {
        id: document.getElementById('product_id').value,
        issuer: document.getElementById('issuer').value,
        product: document.getElementById('product').value,
        network: document.getElementById('network').value,
        subNetwork: document.getElementById('subNetwork').value,
        issuerCountry: document.getElementById('issuerCountry').value,
        cardStatus: document.getElementById('cardStatus').value,
        cardStatusDate: document.getElementById('cardStatusDate').value,
        webLink: document.getElementById('cardWebLink').value,
        altLink: document.getElementById('cardAltLink').value,
        instrumentType: document.getElementById('instrument_type').value,
        spendPerPoint: document.getElementById('card_spend_per_point').value,
        rpConversion: document.getElementById('card_rp_conversion').value,
        apr: document.getElementById('card_apr').value,
        billingDate: Array.from(document.getElementById('card_bill_date').selectedOptions).map(o => o.value).join(','),
        billingCycleDuration: document.getElementById('card_bill_cycle_duration').value,
        cobrand: document.getElementById('cobrand').value,
        rewardProgram: document.getElementById('rewardProgram').value,
        eligibility: {
            ageMin: document.getElementById('ageMin').value,
            ageMax: document.getElementById('ageMax').value,
            creditScore: document.getElementById('creditScore').value,
            empType: document.getElementById('empType').value,
            salary: document.getElementById('salary').value,
            productType: document.getElementById('productType').value,
            nationality: document.getElementById('nationality').value
        },
        fees: {
            joiningType: document.getElementById('fee_joining_type').value,
            joining: document.getElementById('fee_joining').value,
            annual: document.getElementById('fee_annual').value,
            renewal: document.getElementById('fee_renewal').value
        },
        benefits: {
            concierge: document.getElementById('benefit_concierge').checked,
            conciergeDetails: document.getElementById('benefit_concierge').checked ? { notes: document.getElementById('concierge_notes').value } : null,
            dining: document.getElementById('benefit_dining').checked,
            diningDetails: document.getElementById('benefit_dining').checked ? {
                partner: document.getElementById('dining_partner').value,
                discountType: document.getElementById('dining_discount_type').value,
                maxDiscount: document.getElementById('dining_max_discount').value,
                frequency: document.getElementById('dining_frequency').value,
                minSpend: document.getElementById('dining_min_spend').value,
                notes: document.getElementById('dining_notes').value
            } : null,
            golf: document.getElementById('benefit_golf').checked,
            golfDetails: document.getElementById('benefit_golf').checked ? {
                courses: document.getElementById('golf_courses').value,
                rounds: document.getElementById('golf_rounds').value,
                period: document.getElementById('golf_period').value,
                notes: document.getElementById('golf_notes').value
            } : null,
            movie: document.getElementById('benefit_movie').checked,
            movieDetails: document.getElementById('benefit_movie').checked ? {
                partner: document.getElementById('movie_partner').value,
                discountType: document.getElementById('movie_discount_type').value,
                maxDiscount: document.getElementById('movie_max_discount').value,
                frequency: document.getElementById('movie_frequency').value,
                ticketLimit: document.getElementById('movie_ticket_limit').value,
                days: document.getElementById('movie_days').value,
                notes: document.getElementById('movie_notes').value
            } : null,
            spa: document.getElementById('benefit_spa').checked,
            spaDetails: document.getElementById('benefit_spa').checked ? {
                partner: document.getElementById('spa_partner').value,
                discount: document.getElementById('spa_discount').value,
                maxDiscount: document.getElementById('spa_max_discount').value,
                frequency: document.getElementById('spa_frequency').value,
                notes: document.getElementById('spa_notes').value
            } : null,
            feeWaiver: document.getElementById('benefit_feeWaiver').checked,
            feeWaiverDetails: document.getElementById('benefit_feeWaiver').checked ? {
                spend: document.getElementById('fee_waiver_spend').value,
                period: document.getElementById('fee_waiver_period').value
            } : null,
            fuel: document.getElementById('benefit_fuel').checked,
            fuelDetails: document.getElementById('benefit_fuel').checked ? {
                rate: document.getElementById('fuel_rate').value,
                maxWaiver: document.getElementById('fuel_max_waiver').value,
                period: document.getElementById('fuel_period').value,
                minTx: document.getElementById('fuel_min_tx').value,
                maxTx: document.getElementById('fuel_max_tx').value
            } : null,
            lounge: document.getElementById('benefit_lounge').checked,
            loungeDetails: document.getElementById('benefit_lounge').checked ? {
                domestic: {
                    visits: document.getElementById('lounge_dom_visits').value,
                    period: document.getElementById('lounge_dom_period').value,
                    frequency: document.getElementById('lounge_dom_frequency').value,
                    criteria: document.getElementById('lounge_dom_criteria').value
                },
                international: {
                    visits: document.getElementById('lounge_int_visits').value,
                    period: document.getElementById('lounge_int_period').value,
                    frequency: document.getElementById('lounge_int_frequency').value,
                    criteria: document.getElementById('lounge_int_criteria').value
                },
                program: document.getElementById('lounge_program').value
            } : null,
            milestone: document.getElementById('benefit_milestone').checked,
            milestoneDetails: document.getElementById('benefit_milestone').checked ?
                Array.from(document.querySelectorAll('#milestoneSlabsContainer .milestone-slab-row')).map(row => {
                    const n = row.dataset.slab;
                    return {
                        amount: document.getElementById(`milestone_amt_${n}`).value,
                        period: document.getElementById(`milestone_period_${n}`).value,
                        benefitValue: document.getElementById(`milestone_benefit_val_${n}`).value,
                        benefitType: document.getElementById(`milestone_benefit_type_${n}`).value,
                        benefitComment: document.getElementById(`milestone_benefit_comment_${n}`).value
                    };
                }) : null,
            insurance: document.getElementById('benefit_insurance').checked,
            insuranceDetails: document.getElementById('benefit_insurance').checked ? {
                travel: document.getElementById('ins_travel').checked,
                purchaseProtection: document.getElementById('ins_purchaseProtection').checked,
                personalAccident: document.getElementById('ins_personalAccident').checked,
                extendedWarranty: document.getElementById('ins_extendedWarranty').checked,
                lostCardLiability: document.getElementById('ins_lostCardLiability').checked,
                provider: document.getElementById('ins_provider').value,
                coverage: document.getElementById('ins_coverage').value,
                policyLink: document.getElementById('ins_policyLink').value
            } : null,
            welcome: document.getElementById('benefit_welcome').checked,
            welcomeDetails: document.getElementById('benefit_welcome').checked ? {
                value: document.getElementById('welcome_value').value,
                type: document.getElementById('welcome_benefit_type').value,
                freeText: document.getElementById('welcome_free_text').value
            } : null,
            partnerProgram: document.getElementById('benefit_partnerProgram').checked,
            partnerProgramDetails: document.getElementById('benefit_partnerProgram').checked ?
                Array.from(document.querySelectorAll('#partnerProgramContainer .partner-row')).map(row => {
                    const n = row.dataset.partner;
                    return {
                        program: document.getElementById(`partner_program_${n}`).value,
                        ratio: document.getElementById(`partner_ratio_${n}`).value,
                        minTransfer: document.getElementById(`partner_minTransfer_${n}`).value,
                        transferTime: document.getElementById(`partner_transferTime_${n}`).value
                    };
                }) : null,
            fees: document.getElementById('benefit_fees').checked,
            contactless: document.getElementById('benefit_contactless').checked,
            tokenEnabled: document.getElementById('benefit_tokenEnabled').checked,
            upiSupported: document.getElementById('benefit_upiSupported').checked
        },
        offers: offers
    };
    console.log("--- SENDING TO DATABASE ---");
    console.log(JSON.stringify(cardData, null, 2));
    alert("Mock Success! Check your browser's Developer Console (F12) to verify the complete JSON payload.");
}

// ================================================================
// 19. SIDEBAR TOGGLE
// ================================================================

function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    const mainContent = document.getElementById('mainContent');
    sidebar.classList.toggle('open');
    mainContent.classList.toggle('sidebar-open');
}

// ================================================================
// 20. PAGE NAVIGATION
// ================================================================

function showPage(pageId) {
    sessionStorage.setItem('currentPage', pageId);
    document.querySelectorAll('.page-view').forEach(el => el.classList.remove('active'));
    const target = document.getElementById('view-' + pageId);
    if (target) target.classList.add('active');

    const titles = {
        dataEntry: 'Card Details & Rewards',
        import: 'Import From Excel',
        importOffers: 'Import Offers',
        importBenefits: 'Import Preferred Benefits',
        importMcc: 'MCC Imports'
    };
    document.getElementById('pageTitle').innerText = titles[pageId] || 'RewardGenius';

    document.querySelectorAll('.sidebar .nav-link').forEach(link => link.classList.remove('active'));
    const navMap = {
        dataEntry: 'nav-dataEntry',
        import: 'nav-import',
        importOffers: 'nav-importOffers',
        importBenefits: 'nav-importBenefits',
        importMcc: 'nav-importMcc'
    };
    const navId = navMap[pageId];
    if (navId) document.getElementById(navId).classList.add('active');

    if (pageId === 'dataEntry') {
        showInitialPage();
    } else if (pageId === 'import') {
        const container = document.getElementById('importContainer');
        container.innerHTML = buildImportPanel();
        renderImportTable(importedData);
        if (importedData.some(r => r._status)) {
            updateComparisonSummary();
            document.getElementById('comparisonSummary').style.display = 'block';
        }
    } else if (pageId === 'importOffers') {
        const container = document.getElementById('importOffersContainer');
        container.innerHTML = buildImportOffersPanel();
        renderOfferImportTable(importedOffersData);
        document.getElementById('offerRecordCount').textContent = `${importedOffersData.length} records`;
    } else if (pageId === 'importBenefits') {
        const container = document.getElementById('importBenefitsContainer');
        container.innerHTML = buildImportBenefitsPanel();
        renderBenefitImportTablesStandalone(importedBenefitsData);
    } else if (pageId === 'importMcc') {
        const container = document.getElementById('importMccContainer');
        container.innerHTML = buildImportMccPanel();
        renderMccImportTable(importedMccData);
        document.getElementById('mccRecordCount').textContent = `${importedMccData.length} records`;
    }
}

// ================================================================
// 21. INIT
// ================================================================

document.addEventListener('DOMContentLoaded', () => {
    const savedPage = sessionStorage.getItem('currentPage') || 'dataEntry';
    showPage(savedPage);
});