// Benefit Detail Architecture — from Credit_Card_Data_Capture_Specification_V3_Final
// Section 8 (per-benefit fields) + Section 4 (Preferred Benefits Matrix).
//
// Field spec: a plain string  -> type inferred from the name (num / date / bool /
//   url / mcc-list / text). A tuple [id, 'select'|'multi', vocabKey] -> a dropdown
//   whose options come from BENEFIT_VOCAB[vocabKey].
//
// window.BENEFIT_DETAIL_SPEC   { benefitKey: { label, fields:[...] } }
// window.BENEFIT_SPEC_COMMON   fields shared by every benefit sheet (spec §8 intro)
// window.PREFERRED_BENEFITS_MATRIX   card-level flags (spec §4)
// window.BENEFIT_VOCAB         controlled vocabularies (dropdown option lists)

(function () {

    const V = {
        period: ['Per Transaction', 'Per Visit', 'Daily', 'Weekly', 'Monthly', 'Quarterly', 'Half-Yearly', 'Yearly', 'Membership Year', 'Lifetime'],
        frequency: ['One Time', 'Per Transaction', 'Per Visit', 'Monthly', 'Quarterly', 'Half-Yearly', 'Yearly', 'Unlimited'],

        // --- doc-exact enums (from the master tables of the specification) ---
        benefit_status: ['AVAILABLE', 'CONDITIONAL', 'NOT_AVAILABLE', 'UNKNOWN'],           // §4
        value_band: ['0', '<1K', '1K–5K', '5K–10K', '10K–25K', '25K+'],                     // §4
        network: ['Any', 'Visa', 'Mastercard', 'Amex', 'RuPay', 'Diners'],                 // §5 (+ Any)
        card_status: ['ACTIVE', 'CLOSED', 'PAUSED', 'LEGACY'],                              // §5
        card_type: ['Credit', 'Charge', 'Prepaid', 'Debit'],                               // §5
        product_type: ['Consumer', 'Business', 'Corporate', 'Commercial'],                 // §5
        card_tier: ['Entry', 'Mass', 'Premium', 'Super Premium'],                          // §5
        physical_card_type: ['Physical', 'Virtual', 'Both'],                               // §5
        income_definition: ['Gross annual', 'Net annual', 'Gross monthly', 'Net monthly'], // §6
        employment_types: ['Salaried', 'Self-employed', 'Business owner', 'Retired', 'Student'], // §6
        application_channel: ['Online', 'Branch', 'Relationship Manager', 'DSA', 'Partner'], // §6
        fee_type: ['Joining', 'Annual', 'Renewal', 'Add-on', 'Reissue', 'Replacement', 'Cash advance', 'Foreign markup', 'Late payment', 'Overlimit', 'Reward redemption'], // §7
        fee_frequency: ['One-time', 'Annual', 'Monthly', 'Per event'],                     // §7
        fee_cycle_basis: ['Anniversary', 'Calendar year', 'Statement cycle'],              // §7
        redemption_type: ['Voucher', 'Cash', 'Travel', 'Transfer', 'Product', 'Statement credit', 'Reward balance'], // §10
        valuation_basis: ['Published', 'Market', 'Conservative', 'Realistic'],             // §10
        partner_type: ['Airline', 'Hotel', 'Voucher', 'Retail', 'Cashback'],              // §11
        cap_period: ['Monthly', 'Quarterly', 'Half-Yearly', 'Yearly', 'Statement cycle'], // §9/§11

        currency: ['INR', 'USD', 'EUR', 'GBP', 'AED', 'SGD'],
        delivery_method: ['Auto-credit', 'Statement credit', 'Voucher (email)', 'SMS code', 'In-app', 'Physical delivery', 'Reward points credit'],
        stacking_rule: ['Stackable', 'Not stackable', 'Best of'],
        online_offline: ['Online', 'Offline', 'Both'],
        yes_no_cond: ['Yes', 'No', 'Conditional'],

        // Lounge
        lounge_type: ['Airport', 'Railway', 'Both'],
        access_type: ['Complimentary', 'Spend-based', 'Paid', 'Membership', 'Pay-per-use'],
        dom_intl: ['Domestic', 'International', 'Both'],
        lounge_program: ['Priority Pass', 'DreamFolks', 'LoungeKey', 'Visa Airport Companion', 'Mastercard Travel Pass', 'Mastercard Airport Experiences', 'Diners Club', 'DragonPass', 'Adani Lounge', 'Encalm Lounge', 'Plaza Premium', 'Issuer own network'],
        guest_rule: ['Cardholder only', 'Cardholder + guest (free)', 'Cardholder + guest (paid)', 'Guest only via add-on'],

        // Dining
        dining_program: ['EazyDiner Prime', 'Swiggy Dineout', 'Dineout Passport', 'ICICI Culinary Treats', 'HDFC Good Food Trail', 'Issuer program', 'Direct merchant'],
        booking_platform: ['EazyDiner', 'Swiggy Dineout', 'Dineout', 'Zomato', 'Direct', 'Times Prime', 'Not required'],
        delivery_app: ['Swiggy', 'Zomato', 'EatClub', 'Not applicable'],
        meal_type: ['Breakfast', 'Lunch', 'Dinner', 'All day', 'Buffet', 'A la carte'],

        // Golf
        golf_benefit_type: ['Green fee waiver', 'Complimentary games', 'Golf lessons', 'Games + lessons'],
        golf_network: ['Issuer own network', 'Golftripz', 'MMT Golf', 'DLF Golf', 'Concierge-arranged'],

        // Milestone
        milestone_benefit_type: ['Voucher', 'Reward points', 'Cashback', 'Air miles', 'Membership', 'Fee waiver', 'Gift', 'Bonus points'],
        cumulative_incremental: ['Cumulative', 'Incremental'],
        reset_cycle: ['Monthly', 'Quarterly', 'Annually', 'Membership year', 'Never'],

        // Reward
        earn_category: ['Travel', 'Dining', 'Grocery', 'Fuel', 'Shopping', 'Utilities', 'Entertainment', 'Insurance', 'Education', 'Government', 'Rent', 'Wallet', 'Healthcare', 'Gold & Jewellery', 'Other', 'All spends'],
        redemption_portal: ['Gyftr', 'SmartBuy', 'Travel Edge', 'iShop', 'Amazon Pay', 'Flipkart', 'Yatra', 'Luxe', 'Postcard', 'Times Prime', 'Direct with issuer'],
        expense_mode: ['Online', 'POS', 'Contactless', 'UPI', 'Wallet', 'International', 'EMI', 'Subscription', 'Auto-debit'],

        // Fuel
        waiver_type: ['Percentage', 'Fixed amount', 'Full waiver'],

        // Welcome
        welcome_benefit_type: ['Voucher', 'Reward points', 'Membership', 'Cashback', 'Air miles', 'Gift', 'Fee waiver', 'Milestone accelerator'],
        activation_required: ['No (automatic)', 'Yes — first transaction', 'Yes — registration', 'Yes — minimum spend'],

        // Movie
        movie_platform: ['BookMyShow', 'Paytm Movies', 'District by Zomato', 'PVR INOX', 'INOX', 'Direct'],
        ticket_benefit_type: ['Buy one get one', 'Flat discount', 'Free tickets', 'Cashback'],

        // Spa / wellness
        spa_service_type: ['Spa', 'Salon', 'Massage', 'Wellness therapy', 'Gym / fitness', 'Ayurveda'],

        // Travel insurance / protection
        policy_type: ['Air accident', 'Travel', 'Purchase protection', 'Lost card liability', 'Baggage', 'Trip cancellation', 'Trip delay', 'Medical', 'Personal accident', 'Credit shield', 'Extended warranty'],
        activation_trigger: ['Automatic', 'Ticket booked on card', 'Full fare on card', 'Registration required', 'First transaction on card'],
        geo_coverage: ['India only', 'Worldwide', 'Worldwide excl. US/Canada', 'Domestic travel only', 'Asia only'],

        // Travel / hotel / airline
        booking_channel: ['Issuer travel portal', 'Partner website', 'Concierge', 'Any channel', 'Co-brand app'],
        hotel_program: ['Marriott Bonvoy', 'Hilton Honors', 'IHG One Rewards', 'Accor ALL', 'World of Hyatt', 'Taj InnerCircle', 'Club ITC', 'Radisson Rewards'],
        airline_program: ['Air India Flying Returns', 'Club Vistara', 'IndiGo 6E Rewards', 'KrisFlyer', 'Executive Club', 'Skywards', 'Privilege Club', 'Flying Blue', 'Miles & More'],

        // UPI
        upi_network: ['RuPay Credit on UPI', 'UPI (all)'],
        upi_app: ['Any', 'PhonePe', 'Google Pay', 'Paytm', 'CRED', 'BHIM', 'Bank app'],
        upi_txn_type: ['Merchant (P2M)', 'P2P', 'Both'],

        // OTT
        ott_platform: ['Netflix', 'Amazon Prime', 'Disney+ Hotstar', 'SonyLIV', 'ZEE5', 'Spotify', 'YouTube Premium', 'Times Prime', 'Swiggy One', 'Amazon Prime Lite'],
        subscription_duration: ['1 Month', '3 Months', '6 Months', '12 Months'],

        // Airport transfer
        transfer_type: ['Airport pickup', 'Airport drop', 'Pickup + drop', 'Limo', 'Cab'],

        // Status
        status_program: ['Marriott Bonvoy', 'Hilton Honors', 'IHG One Rewards', 'Accor ALL', 'Taj Epicure', 'ITC Culinaire', 'Club Vistara', 'Air India Maharaja Club', 'EazyDiner Prime', 'Other'],
        qualification_method: ['Automatic on card', 'Spend-based', 'Registration', 'Fee-linked'],
    };

    // Shared per-benefit fields (spec §8 common pattern).
    const COMMON = [
        'benefit_id', 'card_id', 'benefit_name', 'provider',
        'eligibility_condition',
        ['frequency_or_quantity_period', 'select', 'period'],
        'quantity_per_period', 'spend_requirement', 'spend_lookback_period',
        'monetary_value', 'realistic_user_value',
        'limits', 'exclusions', 'activation_or_booking_requirement',
        ['benefit_status', 'select', 'benefit_status'],
        'effective_from', 'effective_to', 'source_id',
    ];

    const SPEC = {
        Lounge: {
            label: 'Lounge',
            fields: [
                ['lounge_type', 'select', 'lounge_type'],
                ['access_type', 'select', 'access_type'],
                ['domestic_international', 'select', 'dom_intl'],
                'visits_per_period',
                ['lounge_program', 'select', 'lounge_program'],
                'eligible_airports', 'eligible_terminals',
                ['network_requirement', 'select', 'network'],
                'boarding_pass_required',
                ['cardholder_guest_rule', 'select', 'guest_rule'],
                'guest_fee', 'additional_visit_fee',
                'spend_threshold', 'spend_lookback_period',
            ],
        },
        Dining: {
            label: 'Dining',
            fields: [
                ['dining_program', 'select', 'dining_program'],
                'restaurant_name', 'restaurant_id',
                'discount_percent', 'cashback_percent',
                'minimum_bill', 'maximum_discount',
                'eligible_days',
                ['meal_type', 'select', 'meal_type'],
                ['booking_platform', 'select', 'booking_platform'],
                'reservation_required',
                ['delivery_app', 'select', 'delivery_app'],
                'dine_in_only', 'tip_excluded', 'tax_excluded',
            ],
        },
        Golf: {
            label: 'Golf',
            fields: [
                ['golf_benefit_type', 'select', 'golf_benefit_type'],
                'free_rounds',
                ['round_frequency', 'select', 'period'],
                'golf_course',
                ['golf_course_network', 'select', 'golf_network'],
                'lesson_available', 'lesson_count', 'caddie_included',
                'guest_allowed', 'booking_window', 'handicap_requirement',
                'additional_round_fee',
            ],
        },
        Milestone: {
            label: 'Milestone',
            fields: [
                'milestone_id',
                ['milestone_period', 'select', 'period'],
                'milestone_tier', 'spend_from', 'spend_to',
                ['milestone_benefit_type', 'select', 'milestone_benefit_type'],
                'milestone_benefit_value',
                ['cumulative_or_incremental', 'select', 'cumulative_incremental'],
                ['milestone_reset', 'select', 'reset_cycle'],
                'milestone_achievement_date',
                ['benefit_issuance_method', 'select', 'delivery_method'],
                ['stacking_rule', 'select', 'stacking_rule'],
            ],
        },
        'Reward Points': {
            label: 'Reward Points',
            fields: [
                'reward_rule_id',
                ['earn_category', 'select', 'earn_category'],
                'merchant',
                ['expense_mode', 'select', 'expense_mode'],
                'points_per_rupee', 'multiplier',
                'base_reward_rate', 'accelerated_reward_rate',
                'minimum_transaction',
                'monthly_cap_points', 'monthly_cap_spend', 'annual_cap_points',
                'excluded_mccs', 'excluded_transaction_types',
            ],
        },
        Fuel: {
            label: 'Fuel',
            fields: [
                'fuel_surcharge_rate', 'waiver_rate',
                ['waiver_type', 'select', 'waiver_type'],
                'minimum_fuel_transaction', 'maximum_fuel_transaction',
                'monthly_waiver_cap', 'annual_waiver_cap',
                'eligible_fuel_stations', 'eligible_mccs',
                'gst_reversal', 'gst_reversal_rate',
                'fuel_reward_rate', 'net_effective_fuel_benefit',
            ],
        },
        Welcome: {
            label: 'Welcome',
            fields: [
                'welcome_benefit_id',
                ['welcome_benefit_type', 'select', 'welcome_benefit_type'],
                'welcome_benefit_component', 'welcome_value',
                'joining_fee_linkage', 'minimum_spend',
                ['spend_period', 'select', 'period'],
                ['activation_required', 'select', 'activation_required'],
                'activation_deadline',
                ['benefit_delivery_method', 'select', 'delivery_method'],
                ['redemption_portal', 'select', 'redemption_portal'],
                'delivery_timeline', 'expiry_date', 'component_realistic_value',
            ],
        },
        'Renewal Benefit': {
            label: 'Renewal Benefit',
            fields: [
                'renewal_benefit_id',
                ['renewal_benefit_type', 'select', 'welcome_benefit_type'],
                'renewal_benefit_component', 'renewal_value',
                'renewal_fee_linkage',
                'minimum_spend_for_renewal_benefit',
                ['qualifying_period', 'select', 'period'],
                ['activation_required', 'select', 'activation_required'],
                ['benefit_delivery_method', 'select', 'delivery_method'],
                ['redemption_portal', 'select', 'redemption_portal'],
                'delivery_timeline', 'expiry_date', 'realistic_value',
            ],
        },
        'Fee Waiver': {
            label: 'Fee Waiver',
            fields: [
                ['fee_type', 'select', 'fee_type'],
                'fee_amount', 'waiver_amount', 'waiver_threshold',
                ['waiver_period', 'select', 'period'],
                'qualifying_spend_definition', 'exclusions',
                'automatic_waiver', 'waiver_qualification_date',
                'partial_waiver_allowed',
            ],
        },
        Movie: {
            label: 'Movie',
            fields: [
                ['movie_platform', 'select', 'movie_platform'],
                ['ticket_benefit_type', 'select', 'ticket_benefit_type'],
                'free_tickets', 'discount_percent', 'ticket_cap',
                'monthly_ticket_limit', 'monthly_benefit_cap', 'booking_fee',
                'eligible_days', 'eligible_cinemas', 'minimum_spend',
            ],
        },
        'SPA / Wellness': {
            label: 'SPA / Wellness',
            fields: [
                'spa_provider', 'spa_location',
                ['service_type', 'select', 'spa_service_type'],
                'free_sessions', 'session_value',
                ['frequency', 'select', 'period'],
                'discount_percent', 'minimum_spend', 'booking_required',
                'eligible_properties', 'guest_policy',
            ],
        },
        'Travel Insurance': {
            label: 'Travel Insurance',
            fields: [
                ['policy_type', 'select', 'policy_type'],
                'insurer', 'policy_number_reference',
                'coverage_amount',
                ['coverage_currency', 'select', 'currency'],
                ['activation_trigger', 'select', 'activation_trigger'],
                'minimum_ticket_spend', 'trip_duration_limit',
                ['geographical_coverage', 'select', 'geo_coverage'],
                'deductible', 'medical_cover', 'baggage_cover',
                'flight_delay_cover', 'cancellation_cover', 'exclusions',
                'claim_process_url', 'policy_document_url',
            ],
        },
        Travel: {
            label: 'Travel',
            fields: [
                'travel_provider',
                ['booking_channel', 'select', 'booking_channel'],
                'travel_discount', 'travel_reward_rate',
                'minimum_booking_value', 'maximum_discount',
                'eligible_products', 'blackout_period', 'coupon_code', 'travel_portal',
            ],
        },
        Hotel: {
            label: 'Hotel',
            fields: [
                'hotel_partner',
                ['hotel_program', 'select', 'hotel_program'],
                'discount_percent', 'room_upgrade', 'complimentary_night',
                'breakfast_included', 'early_checkin', 'late_checkout',
                'status_match', 'eligible_properties', 'blackout_dates',
            ],
        },
        Airline: {
            label: 'Airline',
            fields: [
                'airline_partner',
                ['airline_program', 'select', 'airline_program'],
                'discount_percent', 'miles_bonus', 'status_benefit',
                'upgrade_benefit', 'eligible_routes',
                ['booking_channel', 'select', 'booking_channel'],
                'minimum_fare', 'maximum_discount',
            ],
        },
        UPI: {
            label: 'UPI',
            fields: [
                'upi_enabled',
                ['upi_network', 'select', 'upi_network'],
                ['upi_app', 'select', 'upi_app'],
                ['upi_transaction_type', 'select', 'upi_txn_type'],
                'merchant_transaction_eligible', 'p2p_eligible',
                'upi_reward_rate', 'upi_reward_cap', 'upi_transaction_limit', 'upi_exclusions',
            ],
        },
        'Forex / International': {
            label: 'Forex / International',
            fields: [
                'forex_markup_rate', 'forex_gst_rate', 'effective_forex_cost_rate',
                'dcc_supported', 'international_reward_rate', 'international_reward_eligible',
                'international_atm_fee', 'cash_advance_rate', 'supported_countries',
            ],
        },
        'Airport Transfer': {
            label: 'Airport Transfer',
            fields: [
                'transfer_provider',
                ['transfer_type', 'select', 'transfer_type'],
                'free_transfers',
                ['transfer_frequency', 'select', 'period'],
                'meet_and_greet', 'meet_and_greet_count',
                ['meet_and_greet_frequency', 'select', 'period'],
                'eligible_airports', 'eligible_cities', 'minimum_spend',
                ['booking_channel', 'select', 'booking_channel'],
                'advance_booking', 'guest_policy',
            ],
        },
        Concierge: {
            label: 'Concierge',
            fields: [
                'concierge_provider', 'service_categories', 'availability',
                'operating_hours',
                ['booking_channel', 'select', 'booking_channel'],
                'international_support', 'premium_services', 'service_fee',
            ],
        },
        Shopping: {
            label: 'Shopping',
            fields: [
                'merchant', 'merchant_category',
                'discount_percent', 'cashback_percent',
                'minimum_transaction', 'maximum_discount', 'coupon_code',
                ['campaign_frequency', 'select', 'period'],
                ['online_offline', 'select', 'online_offline'],
                ['stacking_rule', 'select', 'stacking_rule'],
            ],
        },
        'OTT / Subscription': {
            label: 'OTT / Subscription',
            fields: [
                ['platform', 'select', 'ott_platform'],
                'subscription_type',
                ['subscription_duration', 'select', 'subscription_duration'],
                'subscription_value', 'monthly_value', 'annual_value',
                'activation_method', 'renewal_rule', 'minimum_spend',
            ],
        },
        'Insurance / Protection': {
            label: 'Insurance / Protection',
            fields: [
                ['policy_type', 'select', 'policy_type'],
                'insurer', 'coverage_amount',
                ['activation_trigger', 'select', 'activation_trigger'],
                'minimum_spend', 'deductible', 'covered_items',
                'exclusions', 'claim_process', 'claim_sla',
            ],
        },
        'Purchase Protection': {
            label: 'Purchase Protection',
            fields: [
                'purchase_protection_amount', 'coverage_period_days',
                'eligible_purchase_type', 'minimum_purchase_value',
                'deductible', 'claim_window', 'exclusions',
            ],
        },
        'Personal Accident': {
            label: 'Personal Accident',
            fields: [
                'accident_cover_amount', 'activation_condition',
                'travel_requirement', 'coverage_duration',
                'beneficiary_rule', 'exclusions',
            ],
        },
        'Roadside Assistance': {
            label: 'Roadside Assistance',
            fields: [
                'service_provider', 'free_service_count', 'service_types',
                'geographical_limit', 'response_time', 'additional_service_fee',
            ],
        },
        'Status Benefits': {
            label: 'Status Benefits',
            fields: [
                ['status_program', 'select', 'status_program'],
                'status_level',
                ['qualification_method', 'select', 'qualification_method'],
                'status_validity', 'upgrade_benefit', 'late_checkout',
                'breakfast', 'eligible_properties',
            ],
        },
    };

    // Preferred Benefits Matrix — card-level flags (spec §4).
    const MATRIX = [
        ['lounge', 'bool', 'Critical'], ['reward_points', 'bool', 'Critical'],
        ['welcome_benefit', 'bool', 'Critical'], ['fee_waiver', 'bool', 'Critical'],
        ['upi_enabled', 'bool', 'Critical'], ['ltf', 'bool', 'Critical'],
        ['dining', 'bool', 'High'], ['golf', 'bool', 'High'], ['milestone', 'bool', 'High'],
        ['fuel_surcharge_waiver', 'bool', 'High'], ['travel_insurance', 'bool', 'High'],
        ['forex_benefit', 'bool', 'High'], ['travel_benefit', 'bool', 'High'],
        ['hotel_benefit', 'bool', 'High'], ['cashback', 'bool', 'High'],
        ['reward_transfer', 'bool', 'High'], ['international_acceptance', 'bool', 'High'],
        ['movie', 'bool', 'High'], ['spa_wellness', 'bool', 'High'],
        ['benefit_status', 'select', 'Medium', 'benefit_status'],
        ['benefit_value_band', 'select', 'Medium', 'value_band'],
        ['offline_offers', 'bool', 'Medium'], ['extended_warranty', 'bool', 'Medium'],
        ['other_preferred_benefit', 'bool', 'Medium'], ['airline_benefit', 'bool', 'Medium'],
        ['airport_transfer', 'bool', 'Medium'], ['concierge', 'bool', 'Medium'],
        ['insurance', 'bool', 'Medium'], ['shopping', 'bool', 'Medium'],
        ['online_offers', 'bool', 'Medium'], ['ott_subscription', 'bool', 'Medium'],
        ['emi_benefit', 'bool', 'Medium'], ['contactless', 'bool', 'Medium'],
        ['purchase_protection', 'bool', 'Medium'], ['personal_accident_cover', 'bool', 'Medium'],
        ['premium_lifestyle', 'bool', 'Medium'], ['status_benefit', 'bool', 'Medium'],
        ['benefit_priority_score', 'num', 'Medium'],
    ];

    window.BENEFIT_VOCAB = V;
    window.BENEFIT_SPEC_COMMON = COMMON;
    window.BENEFIT_DETAIL_SPEC = SPEC;
    window.PREFERRED_BENEFITS_MATRIX = MATRIX;
})();
