-- ============================================================
-- Renames every existing card_id to the new CheckKar-registry scheme
-- (ISSUER-PRODUCT-NETWORK-VARIANT-SEQ), everywhere it's referenced.
-- Generated from cards_rows.csv — 743 cards actually change
-- (0 were already correctly formatted and are left alone).
-- Several separate statements, in order — paste this whole file and Run
-- once (Supabase's SQL editor runs multiple statements in one paste
-- sequentially, in the same transaction).
-- ============================================================

-- 0. One real table holding the map, used by every statement below so the
-- (issuer, product, network, sub_network, new_id) list is written ONCE,
-- not repeated per statement — a plain CTE can't be shared across separate
-- statements, but a real table persists across the whole transaction.
drop table if exists card_rename_map;
create table card_rename_map (issuer varchar, product varchar, network varchar, sub_network varchar, new_id varchar);
insert into card_rename_map (issuer, product, network, sub_network, new_id) values
    ($rgtxt$Axis Bank$rgtxt$, $rgtxt$Privilege$rgtxt$, $rgtxt$Amex$rgtxt$, $rgtxt$Privilege$rgtxt$, $rgtxt$UTIB-PRGE-AMX-PRIV-001$rgtxt$),
    ($rgtxt$Axis Bank$rgtxt$, $rgtxt$IndianOil Premium$rgtxt$, $rgtxt$Mastercard$rgtxt$, $rgtxt$Premium$rgtxt$, $rgtxt$UTIB-INDM-MST-PREM-001$rgtxt$),
    ($rgtxt$Axis Bank$rgtxt$, $rgtxt$My Zone$rgtxt$, $rgtxt$Mastercard$rgtxt$, $rgtxt$Standard$rgtxt$, $rgtxt$UTIB-MYZO-MST-STND-001$rgtxt$),
    ($rgtxt$Axis Bank$rgtxt$, $rgtxt$Flipkart$rgtxt$, $rgtxt$Mastercard$rgtxt$, $rgtxt$Standard$rgtxt$, $rgtxt$UTIB-FLIP-MST-STND-001$rgtxt$),
    ($rgtxt$Axis Bank$rgtxt$, $rgtxt$HORIZON$rgtxt$, $rgtxt$Mastercard$rgtxt$, $rgtxt$Standard$rgtxt$, $rgtxt$UTIB-HORI-MST-STND-001$rgtxt$),
    ($rgtxt$Axis Bank$rgtxt$, $rgtxt$INDIANOIL$rgtxt$, $rgtxt$Mastercard$rgtxt$, $rgtxt$Standard$rgtxt$, $rgtxt$UTIB-INDL-MST-STND-001$rgtxt$),
    ($rgtxt$Axis Bank$rgtxt$, $rgtxt$Neo$rgtxt$, $rgtxt$Mastercard$rgtxt$, $rgtxt$Standard$rgtxt$, $rgtxt$UTIB-NEO0-MST-STND-001$rgtxt$),
    ($rgtxt$Axis Bank$rgtxt$, $rgtxt$Scapia$rgtxt$, $rgtxt$Mastercard$rgtxt$, $rgtxt$Standard$rgtxt$, $rgtxt$UTIB-SCAP-MST-STND-001$rgtxt$),
    ($rgtxt$Axis Bank$rgtxt$, $rgtxt$Flipkart Super Elite$rgtxt$, $rgtxt$Mastercard$rgtxt$, $rgtxt$Super Elite$rgtxt$, $rgtxt$UTIB-FLIE-MST-SUP-001$rgtxt$),
    ($rgtxt$Axis Bank$rgtxt$, $rgtxt$Select$rgtxt$, $rgtxt$Mastercard$rgtxt$, $rgtxt$World$rgtxt$, $rgtxt$UTIB-SELE-MST-WRLD-001$rgtxt$),
    ($rgtxt$Axis Bank$rgtxt$, $rgtxt$MAGNUS$rgtxt$, $rgtxt$Mastercard$rgtxt$, $rgtxt$World$rgtxt$, $rgtxt$UTIB-MAGN-MST-WRLD-001$rgtxt$),
    ($rgtxt$Axis Bank$rgtxt$, $rgtxt$Reserve$rgtxt$, $rgtxt$Mastercard$rgtxt$, $rgtxt$World Elite$rgtxt$, $rgtxt$UTIB-RESE-MST-WELT-001$rgtxt$),
    ($rgtxt$Axis Bank$rgtxt$, $rgtxt$Olympus$rgtxt$, $rgtxt$Mastercard$rgtxt$, $rgtxt$World Elite$rgtxt$, $rgtxt$UTIB-OLYM-MST-WELT-001$rgtxt$),
    ($rgtxt$Axis Bank$rgtxt$, $rgtxt$Miles and More$rgtxt$, $rgtxt$Mastercard$rgtxt$, $rgtxt$World$rgtxt$, $rgtxt$UTIB-MILM-MST-WRLD-001$rgtxt$),
    ($rgtxt$Axis Bank$rgtxt$, $rgtxt$Miles & More World Select$rgtxt$, $rgtxt$Mastercard$rgtxt$, $rgtxt$World$rgtxt$, $rgtxt$UTIB-MILW-MST-WRLD-001$rgtxt$),
    ($rgtxt$Axis Bank$rgtxt$, $rgtxt$Airtel$rgtxt$, $rgtxt$RuPay$rgtxt$, $rgtxt$Platinum$rgtxt$, $rgtxt$UTIB-AIRT-RUP-PLAT-001$rgtxt$),
    ($rgtxt$Axis Bank$rgtxt$, $rgtxt$My Zone$rgtxt$, $rgtxt$RuPay$rgtxt$, $rgtxt$Platinum$rgtxt$, $rgtxt$UTIB-MYZO-RUP-PLAT-001$rgtxt$),
    ($rgtxt$Axis Bank$rgtxt$, $rgtxt$INDIANOIL$rgtxt$, $rgtxt$RuPay$rgtxt$, $rgtxt$Platinum$rgtxt$, $rgtxt$UTIB-INDL-RUP-PLAT-001$rgtxt$),
    ($rgtxt$Axis Bank$rgtxt$, $rgtxt$Neo$rgtxt$, $rgtxt$RuPay$rgtxt$, $rgtxt$Platinum$rgtxt$, $rgtxt$UTIB-NEO0-RUP-PLAT-001$rgtxt$),
    ($rgtxt$Axis Bank$rgtxt$, $rgtxt$IndiGo Premium$rgtxt$, $rgtxt$RuPay$rgtxt$, $rgtxt$Premium$rgtxt$, $rgtxt$UTIB-INGP-RUP-PREM-001$rgtxt$),
    ($rgtxt$Axis Bank$rgtxt$, $rgtxt$MY Zone Easy$rgtxt$, $rgtxt$RuPay$rgtxt$, $rgtxt$Secured$rgtxt$, $rgtxt$UTIB-MYZE-RUP-SECU-001$rgtxt$),
    ($rgtxt$Axis Bank$rgtxt$, $rgtxt$IndianOil Easy$rgtxt$, $rgtxt$RuPay$rgtxt$, $rgtxt$Secured$rgtxt$, $rgtxt$UTIB-INDE-RUP-SECU-001$rgtxt$),
    ($rgtxt$Axis Bank$rgtxt$, $rgtxt$Privilege Easy$rgtxt$, $rgtxt$RuPay$rgtxt$, $rgtxt$Secured$rgtxt$, $rgtxt$UTIB-PRGY-RUP-SECU-001$rgtxt$),
    ($rgtxt$Axis Bank$rgtxt$, $rgtxt$Select$rgtxt$, $rgtxt$RuPay$rgtxt$, $rgtxt$Select$rgtxt$, $rgtxt$UTIB-SELE-RUP-SELC-001$rgtxt$),
    ($rgtxt$Axis Bank$rgtxt$, $rgtxt$MAGNUS$rgtxt$, $rgtxt$RuPay$rgtxt$, $rgtxt$Select$rgtxt$, $rgtxt$UTIB-MAGN-RUP-SELC-001$rgtxt$),
    ($rgtxt$Axis Bank$rgtxt$, $rgtxt$super.money RuPay$rgtxt$, $rgtxt$RuPay$rgtxt$, $rgtxt$Standard$rgtxt$, $rgtxt$UTIB-SUPM-RUP-STND-001$rgtxt$),
    ($rgtxt$Axis Bank$rgtxt$, $rgtxt$Fibe$rgtxt$, $rgtxt$RuPay$rgtxt$, $rgtxt$Standard$rgtxt$, $rgtxt$UTIB-FIBE-RUP-STND-001$rgtxt$),
    ($rgtxt$Axis Bank$rgtxt$, $rgtxt$Google Pay Flex$rgtxt$, $rgtxt$RuPay$rgtxt$, $rgtxt$Standard$rgtxt$, $rgtxt$UTIB-GOOF-RUP-STND-001$rgtxt$),
    ($rgtxt$Axis Bank$rgtxt$, $rgtxt$IndiGo$rgtxt$, $rgtxt$RuPay$rgtxt$, $rgtxt$Standard$rgtxt$, $rgtxt$UTIB-INGO-RUP-STND-001$rgtxt$),
    ($rgtxt$Axis Bank$rgtxt$, $rgtxt$Kwik$rgtxt$, $rgtxt$RuPay$rgtxt$, $rgtxt$Standard$rgtxt$, $rgtxt$UTIB-KWIK-RUP-STND-001$rgtxt$),
    ($rgtxt$Axis Bank$rgtxt$, $rgtxt$Scapia$rgtxt$, $rgtxt$RuPay$rgtxt$, $rgtxt$Standard$rgtxt$, $rgtxt$UTIB-SCAP-RUP-STND-001$rgtxt$),
    ($rgtxt$Axis Bank$rgtxt$, $rgtxt$SpiceJet Voyage Black$rgtxt$, $rgtxt$Visa$rgtxt$, $rgtxt$Black$rgtxt$, $rgtxt$UTIB-SPIB-VIS-BLAK-001$rgtxt$),
    ($rgtxt$Axis Bank$rgtxt$, $rgtxt$Vistara Infinite$rgtxt$, $rgtxt$Visa$rgtxt$, $rgtxt$Infinite$rgtxt$, $rgtxt$UTIB-VISI-VIS-INFI-001$rgtxt$),
    ($rgtxt$Axis Bank$rgtxt$, $rgtxt$Primus$rgtxt$, $rgtxt$Visa$rgtxt$, $rgtxt$Infinite Privilege$rgtxt$, $rgtxt$UTIB-PRUS-VIS-INPR-001$rgtxt$),
    ($rgtxt$Axis Bank$rgtxt$, $rgtxt$Olympus$rgtxt$, $rgtxt$Visa$rgtxt$, $rgtxt$Infinite$rgtxt$, $rgtxt$UTIB-OLYM-VIS-INFI-001$rgtxt$),
    ($rgtxt$Axis Bank$rgtxt$, $rgtxt$Burgundy Private - The One$rgtxt$, $rgtxt$Visa$rgtxt$, $rgtxt$Infinite$rgtxt$, $rgtxt$UTIB-BURO-VIS-INFI-001$rgtxt$),
    ($rgtxt$Axis Bank$rgtxt$, $rgtxt$Samsung Infinite$rgtxt$, $rgtxt$Visa$rgtxt$, $rgtxt$Infinite$rgtxt$, $rgtxt$UTIB-SAMI-VIS-INFI-001$rgtxt$),
    ($rgtxt$Axis Bank$rgtxt$, $rgtxt$Pride Platinum$rgtxt$, $rgtxt$Visa$rgtxt$, $rgtxt$Platinum$rgtxt$, $rgtxt$UTIB-PRDP-VIS-PLAT-001$rgtxt$),
    ($rgtxt$Axis Bank$rgtxt$, $rgtxt$LIC Platinum$rgtxt$, $rgtxt$Visa$rgtxt$, $rgtxt$Platinum$rgtxt$, $rgtxt$UTIB-LICP-VIS-PLAT-001$rgtxt$),
    ($rgtxt$Axis Bank$rgtxt$, $rgtxt$Freecharge Plus$rgtxt$, $rgtxt$Visa$rgtxt$, $rgtxt$Plus$rgtxt$, $rgtxt$UTIB-FRGX-VIS-PLU-001$rgtxt$),
    ($rgtxt$Axis Bank$rgtxt$, $rgtxt$IndiGo Premium$rgtxt$, $rgtxt$Visa$rgtxt$, $rgtxt$Premium$rgtxt$, $rgtxt$UTIB-INGP-VIS-PREM-001$rgtxt$),
    ($rgtxt$Axis Bank$rgtxt$, $rgtxt$IndianOil Premium$rgtxt$, $rgtxt$Visa$rgtxt$, $rgtxt$Premium$rgtxt$, $rgtxt$UTIB-INDM-VIS-PREM-001$rgtxt$),
    ($rgtxt$Axis Bank$rgtxt$, $rgtxt$Airtel$rgtxt$, $rgtxt$Visa$rgtxt$, $rgtxt$Signature$rgtxt$, $rgtxt$UTIB-AIRT-VIS-SIGN-001$rgtxt$),
    ($rgtxt$Axis Bank$rgtxt$, $rgtxt$Privilege$rgtxt$, $rgtxt$Visa$rgtxt$, $rgtxt$Signature$rgtxt$, $rgtxt$UTIB-PRGE-VIS-SIGN-001$rgtxt$),
    ($rgtxt$Axis Bank$rgtxt$, $rgtxt$Select$rgtxt$, $rgtxt$Visa$rgtxt$, $rgtxt$Signature$rgtxt$, $rgtxt$UTIB-SELE-VIS-SIGN-001$rgtxt$),
    ($rgtxt$Axis Bank$rgtxt$, $rgtxt$Atlas$rgtxt$, $rgtxt$Visa$rgtxt$, $rgtxt$Signature$rgtxt$, $rgtxt$UTIB-ATLS-VIS-SIGN-001$rgtxt$),
    ($rgtxt$Axis Bank$rgtxt$, $rgtxt$Pride Signature$rgtxt$, $rgtxt$Visa$rgtxt$, $rgtxt$Signature$rgtxt$, $rgtxt$UTIB-PRDS-VIS-SIGN-001$rgtxt$),
    ($rgtxt$Axis Bank$rgtxt$, $rgtxt$VISTARA SIGNATURE$rgtxt$, $rgtxt$Visa$rgtxt$, $rgtxt$Signature$rgtxt$, $rgtxt$UTIB-VISS-VIS-SIGN-001$rgtxt$),
    ($rgtxt$Axis Bank$rgtxt$, $rgtxt$LIC Signature$rgtxt$, $rgtxt$Visa$rgtxt$, $rgtxt$Signature$rgtxt$, $rgtxt$UTIB-LICE-VIS-SIGN-001$rgtxt$),
    ($rgtxt$Axis Bank$rgtxt$, $rgtxt$Samsung Signature$rgtxt$, $rgtxt$Visa$rgtxt$, $rgtxt$Signature$rgtxt$, $rgtxt$UTIB-SAMS-VIS-SIGN-001$rgtxt$),
    ($rgtxt$Axis Bank$rgtxt$, $rgtxt$My Zone$rgtxt$, $rgtxt$Visa$rgtxt$, $rgtxt$Standard$rgtxt$, $rgtxt$UTIB-MYZO-VIS-STND-001$rgtxt$),
    ($rgtxt$Axis Bank$rgtxt$, $rgtxt$ACE$rgtxt$, $rgtxt$Visa$rgtxt$, $rgtxt$Standard$rgtxt$, $rgtxt$UTIB-ACE0-VIS-STND-001$rgtxt$),
    ($rgtxt$Axis Bank$rgtxt$, $rgtxt$REWARDS$rgtxt$, $rgtxt$Visa$rgtxt$, $rgtxt$Standard$rgtxt$, $rgtxt$UTIB-REWA-VIS-STND-001$rgtxt$),
    ($rgtxt$Axis Bank$rgtxt$, $rgtxt$AURA$rgtxt$, $rgtxt$Visa$rgtxt$, $rgtxt$Standard$rgtxt$, $rgtxt$UTIB-AURA-VIS-STND-001$rgtxt$),
    ($rgtxt$Axis Bank$rgtxt$, $rgtxt$Shoppers Stop$rgtxt$, $rgtxt$Visa$rgtxt$, $rgtxt$Standard$rgtxt$, $rgtxt$UTIB-SHOS-VIS-STND-001$rgtxt$),
    ($rgtxt$Axis Bank$rgtxt$, $rgtxt$Freecharge$rgtxt$, $rgtxt$Visa$rgtxt$, $rgtxt$Standard$rgtxt$, $rgtxt$UTIB-FRGE-VIS-STND-001$rgtxt$),
    ($rgtxt$Axis Bank$rgtxt$, $rgtxt$VISTARA$rgtxt$, $rgtxt$Visa$rgtxt$, $rgtxt$Standard$rgtxt$, $rgtxt$UTIB-VIST-VIS-STND-001$rgtxt$),
    ($rgtxt$Axis Bank$rgtxt$, $rgtxt$Cashback$rgtxt$, $rgtxt$Visa$rgtxt$, $rgtxt$Standard$rgtxt$, $rgtxt$UTIB-CASH-VIS-STND-001$rgtxt$),
    ($rgtxt$Axis Bank$rgtxt$, $rgtxt$HORIZON$rgtxt$, $rgtxt$Visa$rgtxt$, $rgtxt$Standard$rgtxt$, $rgtxt$UTIB-HORI-VIS-STND-001$rgtxt$),
    ($rgtxt$Axis Bank$rgtxt$, $rgtxt$IndiGo$rgtxt$, $rgtxt$Visa$rgtxt$, $rgtxt$Standard$rgtxt$, $rgtxt$UTIB-INGO-VIS-STND-001$rgtxt$),
    ($rgtxt$Axis Bank$rgtxt$, $rgtxt$INDIANOIL$rgtxt$, $rgtxt$Visa$rgtxt$, $rgtxt$Standard$rgtxt$, $rgtxt$UTIB-INDL-VIS-STND-001$rgtxt$),
    ($rgtxt$Axis Bank$rgtxt$, $rgtxt$Neo$rgtxt$, $rgtxt$Visa$rgtxt$, $rgtxt$Standard$rgtxt$, $rgtxt$UTIB-NEO0-VIS-STND-001$rgtxt$),
    ($rgtxt$Axis Bank$rgtxt$, $rgtxt$SpiceJet Voyage$rgtxt$, $rgtxt$Visa$rgtxt$, $rgtxt$Standard$rgtxt$, $rgtxt$UTIB-SPIV-VIS-STND-001$rgtxt$),
    ($rgtxt$Axis Bank$rgtxt$, $rgtxt$Titanium Smart Traveller$rgtxt$, $rgtxt$Visa$rgtxt$, $rgtxt$Standard$rgtxt$, $rgtxt$UTIB-TITT-VIS-STND-001$rgtxt$),
    ($rgtxt$Bank of Baroda$rgtxt$, $rgtxt$CORPORATE$rgtxt$, $rgtxt$Mastercard$rgtxt$, $rgtxt$Corporate$rgtxt$, $rgtxt$BARB-CORP-MST-CORP-001$rgtxt$),
    ($rgtxt$Bank of Baroda$rgtxt$, $rgtxt$EASY$rgtxt$, $rgtxt$Mastercard$rgtxt$, $rgtxt$Platinum$rgtxt$, $rgtxt$BARB-EASY-MST-PLAT-001$rgtxt$),
    ($rgtxt$Bank of Baroda$rgtxt$, $rgtxt$ETERNA$rgtxt$, $rgtxt$Mastercard$rgtxt$, $rgtxt$World$rgtxt$, $rgtxt$BARB-ETER-MST-WRLD-001$rgtxt$),
    ($rgtxt$Bank of Baroda$rgtxt$, $rgtxt$PREMIER$rgtxt$, $rgtxt$Mastercard$rgtxt$, $rgtxt$World$rgtxt$, $rgtxt$BARB-PREM-MST-WRLD-001$rgtxt$),
    ($rgtxt$Bank of Baroda$rgtxt$, $rgtxt$SELECT$rgtxt$, $rgtxt$Mastercard$rgtxt$, $rgtxt$World$rgtxt$, $rgtxt$BARB-SELE-MST-WRLD-001$rgtxt$),
    ($rgtxt$Bank of Baroda$rgtxt$, $rgtxt$CMA One$rgtxt$, $rgtxt$Mastercard$rgtxt$, $rgtxt$World$rgtxt$, $rgtxt$BARB-CMAO-MST-WRLD-001$rgtxt$),
    ($rgtxt$Bank of Baroda$rgtxt$, $rgtxt$ICAI Exclusive$rgtxt$, $rgtxt$Mastercard$rgtxt$, $rgtxt$World$rgtxt$, $rgtxt$BARB-ICAE-MST-WRLD-001$rgtxt$),
    ($rgtxt$Bank of Baroda$rgtxt$, $rgtxt$ICSI Diamond$rgtxt$, $rgtxt$Mastercard$rgtxt$, $rgtxt$World$rgtxt$, $rgtxt$BARB-ICSD-MST-WRLD-001$rgtxt$),
    ($rgtxt$Bank of Baroda$rgtxt$, $rgtxt$Micro Enterprise$rgtxt$, $rgtxt$RuPay$rgtxt$, $rgtxt$Business$rgtxt$, $rgtxt$BARB-MICE-RUP-BUSN-001$rgtxt$),
    ($rgtxt$Bank of Baroda$rgtxt$, $rgtxt$EMPOWER$rgtxt$, $rgtxt$RuPay$rgtxt$, $rgtxt$Business$rgtxt$, $rgtxt$BARB-EMPO-RUP-BUSN-001$rgtxt$),
    ($rgtxt$Bank of Baroda$rgtxt$, $rgtxt$PRAGATI BUPB$rgtxt$, $rgtxt$RuPay$rgtxt$, $rgtxt$Classic$rgtxt$, $rgtxt$BARB-PRAU-RUP-CLAS-001$rgtxt$),
    ($rgtxt$Bank of Baroda$rgtxt$, $rgtxt$PRAGATI BGGB$rgtxt$, $rgtxt$RuPay$rgtxt$, $rgtxt$Classic$rgtxt$, $rgtxt$BARB-PRAB-RUP-CLAS-001$rgtxt$),
    ($rgtxt$Bank of Baroda$rgtxt$, $rgtxt$PRAGATI BRKGB$rgtxt$, $rgtxt$RuPay$rgtxt$, $rgtxt$Classic$rgtxt$, $rgtxt$BARB-PRAR-RUP-CLAS-001$rgtxt$),
    ($rgtxt$Bank of Baroda$rgtxt$, $rgtxt$PM SVANidhi$rgtxt$, $rgtxt$RuPay$rgtxt$, $rgtxt$Classic$rgtxt$, $rgtxt$BARB-PSVA-RUP-CLAS-001$rgtxt$),
    ($rgtxt$Bank of Baroda$rgtxt$, $rgtxt$Uni GoldX$rgtxt$, $rgtxt$RuPay$rgtxt$, $rgtxt$Gold$rgtxt$, $rgtxt$BARB-UNIG-RUP-GOLD-001$rgtxt$),
    ($rgtxt$Bank of Baroda$rgtxt$, $rgtxt$PREMIER$rgtxt$, $rgtxt$RuPay$rgtxt$, $rgtxt$Platinum$rgtxt$, $rgtxt$BARB-PREM-RUP-PLAT-001$rgtxt$),
    ($rgtxt$Bank of Baroda$rgtxt$, $rgtxt$EASY$rgtxt$, $rgtxt$RuPay$rgtxt$, $rgtxt$Platinum$rgtxt$, $rgtxt$BARB-EASY-RUP-PLAT-001$rgtxt$),
    ($rgtxt$Bank of Baroda$rgtxt$, $rgtxt$HPCL Energie$rgtxt$, $rgtxt$RuPay$rgtxt$, $rgtxt$Platinum$rgtxt$, $rgtxt$BARB-HPCE-RUP-PLAT-001$rgtxt$),
    ($rgtxt$Bank of Baroda$rgtxt$, $rgtxt$PRAGATI BUPB$rgtxt$, $rgtxt$RuPay$rgtxt$, $rgtxt$Platinum$rgtxt$, $rgtxt$BARB-PRAU-RUP-PLAT-001$rgtxt$),
    ($rgtxt$Bank of Baroda$rgtxt$, $rgtxt$PRAGATI BGGB$rgtxt$, $rgtxt$RuPay$rgtxt$, $rgtxt$Platinum$rgtxt$, $rgtxt$BARB-PRAB-RUP-PLAT-001$rgtxt$),
    ($rgtxt$Bank of Baroda$rgtxt$, $rgtxt$PRAGATI BRKGB$rgtxt$, $rgtxt$RuPay$rgtxt$, $rgtxt$Platinum$rgtxt$, $rgtxt$BARB-PRAR-RUP-PLAT-001$rgtxt$),
    ($rgtxt$Bank of Baroda$rgtxt$, $rgtxt$Indian Navy VARUNAH Plus$rgtxt$, $rgtxt$RuPay$rgtxt$, $rgtxt$Platinum$rgtxt$, $rgtxt$BARB-INDX-RUP-PLAT-001$rgtxt$),
    ($rgtxt$Bank of Baroda$rgtxt$, $rgtxt$Indian Navy VARUNAH$rgtxt$, $rgtxt$RuPay$rgtxt$, $rgtxt$Platinum$rgtxt$, $rgtxt$BARB-INDV-RUP-PLAT-001$rgtxt$),
    ($rgtxt$Bank of Baroda$rgtxt$, $rgtxt$IRCTC$rgtxt$, $rgtxt$RuPay$rgtxt$, $rgtxt$Platinum$rgtxt$, $rgtxt$BARB-IRCT-RUP-PLAT-001$rgtxt$),
    ($rgtxt$Bank of Baroda$rgtxt$, $rgtxt$Nainital Bank RENAISSANCE$rgtxt$, $rgtxt$RuPay$rgtxt$, $rgtxt$Platinum$rgtxt$, $rgtxt$BARB-NAIR-RUP-PLAT-001$rgtxt$),
    ($rgtxt$Bank of Baroda$rgtxt$, $rgtxt$Snapdeal$rgtxt$, $rgtxt$RuPay$rgtxt$, $rgtxt$Platinum$rgtxt$, $rgtxt$BARB-SNAP-RUP-PLAT-001$rgtxt$),
    ($rgtxt$Bank of Baroda$rgtxt$, $rgtxt$Assam Rifles The SENTINEL$rgtxt$, $rgtxt$RuPay$rgtxt$, $rgtxt$Select$rgtxt$, $rgtxt$BARB-ASSS-RUP-SELC-001$rgtxt$),
    ($rgtxt$Bank of Baroda$rgtxt$, $rgtxt$ETERNA$rgtxt$, $rgtxt$RuPay$rgtxt$, $rgtxt$Select$rgtxt$, $rgtxt$BARB-ETER-RUP-SELC-001$rgtxt$),
    ($rgtxt$Bank of Baroda$rgtxt$, $rgtxt$SELECT$rgtxt$, $rgtxt$RuPay$rgtxt$, $rgtxt$Select$rgtxt$, $rgtxt$BARB-SELE-RUP-SELC-001$rgtxt$),
    ($rgtxt$Bank of Baroda$rgtxt$, $rgtxt$VIKRAM$rgtxt$, $rgtxt$RuPay$rgtxt$, $rgtxt$Select$rgtxt$, $rgtxt$BARB-VIKR-RUP-SELC-001$rgtxt$),
    ($rgtxt$Bank of Baroda$rgtxt$, $rgtxt$CMA One$rgtxt$, $rgtxt$RuPay$rgtxt$, $rgtxt$Select$rgtxt$, $rgtxt$BARB-CMAO-RUP-SELC-001$rgtxt$),
    ($rgtxt$Bank of Baroda$rgtxt$, $rgtxt$ICAI Exclusive$rgtxt$, $rgtxt$RuPay$rgtxt$, $rgtxt$Select$rgtxt$, $rgtxt$BARB-ICAE-RUP-SELC-001$rgtxt$),
    ($rgtxt$Bank of Baroda$rgtxt$, $rgtxt$ICSI Diamond$rgtxt$, $rgtxt$RuPay$rgtxt$, $rgtxt$Select$rgtxt$, $rgtxt$BARB-ICSD-RUP-SELC-001$rgtxt$),
    ($rgtxt$Bank of Baroda$rgtxt$, $rgtxt$Indian Army YODDHA$rgtxt$, $rgtxt$RuPay$rgtxt$, $rgtxt$Select$rgtxt$, $rgtxt$BARB-INDY-RUP-SELC-001$rgtxt$),
    ($rgtxt$Bank of Baroda$rgtxt$, $rgtxt$Indian Navy VARUNAH Premium$rgtxt$, $rgtxt$RuPay$rgtxt$, $rgtxt$Select$rgtxt$, $rgtxt$BARB-IPRE-RUP-SELC-001$rgtxt$),
    ($rgtxt$Bank of Baroda$rgtxt$, $rgtxt$Indian Coast Guard RAKSHAMAH$rgtxt$, $rgtxt$RuPay$rgtxt$, $rgtxt$Select$rgtxt$, $rgtxt$BARB-INDR-RUP-SELC-001$rgtxt$),
    ($rgtxt$Bank of Baroda$rgtxt$, $rgtxt$Scapia$rgtxt$, $rgtxt$RuPay$rgtxt$, $rgtxt$Signature$rgtxt$, $rgtxt$BARB-SCAP-RUP-SIGN-001$rgtxt$),
    ($rgtxt$Bank of Baroda$rgtxt$, $rgtxt$CORPORATE$rgtxt$, $rgtxt$Visa$rgtxt$, $rgtxt$Corporate$rgtxt$, $rgtxt$BARB-CORP-VIS-CORP-001$rgtxt$),
    ($rgtxt$Bank of Baroda$rgtxt$, $rgtxt$Uni GoldX$rgtxt$, $rgtxt$Visa$rgtxt$, $rgtxt$Gold$rgtxt$, $rgtxt$BARB-UNIG-VIS-GOLD-001$rgtxt$),
    ($rgtxt$Bank of Baroda$rgtxt$, $rgtxt$PRIME$rgtxt$, $rgtxt$Visa$rgtxt$, $rgtxt$Gold$rgtxt$, $rgtxt$BARB-PRIM-VIS-GOLD-001$rgtxt$),
    ($rgtxt$Bank of Baroda$rgtxt$, $rgtxt$ETERNA$rgtxt$, $rgtxt$Visa$rgtxt$, $rgtxt$Infinite$rgtxt$, $rgtxt$BARB-ETER-VIS-INFI-001$rgtxt$),
    ($rgtxt$Bank of Baroda$rgtxt$, $rgtxt$Etihad Guest Premium$rgtxt$, $rgtxt$Visa$rgtxt$, $rgtxt$Infinite$rgtxt$, $rgtxt$BARB-ETIP-VIS-INFI-001$rgtxt$),
    ($rgtxt$Bank of Baroda$rgtxt$, $rgtxt$TIARA$rgtxt$, $rgtxt$Visa$rgtxt$, $rgtxt$Infinite$rgtxt$, $rgtxt$BARB-TIAR-VIS-INFI-001$rgtxt$),
    ($rgtxt$Bank of Baroda$rgtxt$, $rgtxt$Cashback$rgtxt$, $rgtxt$Visa$rgtxt$, $rgtxt$Platinum$rgtxt$, $rgtxt$BARB-CASH-VIS-PLAT-001$rgtxt$),
    ($rgtxt$Bank of Baroda$rgtxt$, $rgtxt$EASY$rgtxt$, $rgtxt$Visa$rgtxt$, $rgtxt$Platinum$rgtxt$, $rgtxt$BARB-EASY-VIS-PLAT-001$rgtxt$),
    ($rgtxt$Bank of Baroda$rgtxt$, $rgtxt$Etihad Guest$rgtxt$, $rgtxt$Visa$rgtxt$, $rgtxt$Signature$rgtxt$, $rgtxt$BARB-ETIG-VIS-SIGN-001$rgtxt$),
    ($rgtxt$Bank of Baroda$rgtxt$, $rgtxt$PREMIER$rgtxt$, $rgtxt$Visa$rgtxt$, $rgtxt$Signature$rgtxt$, $rgtxt$BARB-PREM-VIS-SIGN-001$rgtxt$),
    ($rgtxt$Bank of Baroda$rgtxt$, $rgtxt$SELECT$rgtxt$, $rgtxt$Visa$rgtxt$, $rgtxt$Signature$rgtxt$, $rgtxt$BARB-SELE-VIS-SIGN-001$rgtxt$),
    ($rgtxt$Bank of Baroda$rgtxt$, $rgtxt$Scapia$rgtxt$, $rgtxt$Visa$rgtxt$, $rgtxt$Signature$rgtxt$, $rgtxt$BARB-SCAP-VIS-SIGN-001$rgtxt$),
    ($rgtxt$Bank of Baroda$rgtxt$, $rgtxt$One$rgtxt$, $rgtxt$Visa$rgtxt$, $rgtxt$Signature$rgtxt$, $rgtxt$BARB-ONE0-VIS-SIGN-001$rgtxt$),
    ($rgtxt$Bank of Baroda$rgtxt$, $rgtxt$CMA One$rgtxt$, $rgtxt$Visa$rgtxt$, $rgtxt$Signature$rgtxt$, $rgtxt$BARB-CMAO-VIS-SIGN-001$rgtxt$),
    ($rgtxt$Bank of Baroda$rgtxt$, $rgtxt$ICAI Exclusive$rgtxt$, $rgtxt$Visa$rgtxt$, $rgtxt$Signature$rgtxt$, $rgtxt$BARB-ICAE-VIS-SIGN-001$rgtxt$),
    ($rgtxt$Bank of Baroda$rgtxt$, $rgtxt$ICSI Diamond$rgtxt$, $rgtxt$Visa$rgtxt$, $rgtxt$Signature$rgtxt$, $rgtxt$BARB-ICSD-VIS-SIGN-001$rgtxt$),
    ($rgtxt$HDFC Bank$rgtxt$, $rgtxt$BizBlack Metal$rgtxt$, $rgtxt$Diners Club$rgtxt$, $rgtxt$Black$rgtxt$, $rgtxt$HDFC-BIZM-DIN-BLAK-001$rgtxt$),
    ($rgtxt$HDFC Bank$rgtxt$, $rgtxt$Diners Black$rgtxt$, $rgtxt$Diners Club$rgtxt$, $rgtxt$Black$rgtxt$, $rgtxt$HDFC-DIBK-DIN-BLAK-001$rgtxt$),
    ($rgtxt$HDFC Bank$rgtxt$, $rgtxt$Diners Black Metal Edition$rgtxt$, $rgtxt$Diners Club$rgtxt$, $rgtxt$Black$rgtxt$, $rgtxt$HDFC-DIBM-DIN-BLAK-001$rgtxt$),
    ($rgtxt$HDFC Bank$rgtxt$, $rgtxt$H.O.G Diners Club$rgtxt$, $rgtxt$Diners Club$rgtxt$, $rgtxt$Black$rgtxt$, $rgtxt$HDFC-HOGD-DIN-BLAK-001$rgtxt$),
    ($rgtxt$HDFC Bank$rgtxt$, $rgtxt$Flipkart Wholesale$rgtxt$, $rgtxt$Diners Club$rgtxt$, $rgtxt$Commercial$rgtxt$, $rgtxt$HDFC-FLIW-DIN-COMM-001$rgtxt$),
    ($rgtxt$HDFC Bank$rgtxt$, $rgtxt$InterMiles Diners Club$rgtxt$, $rgtxt$Diners Club$rgtxt$, $rgtxt$Gold$rgtxt$, $rgtxt$HDFC-INTD-DIN-GOLD-001$rgtxt$),
    ($rgtxt$HDFC Bank$rgtxt$, $rgtxt$Diners Black$rgtxt$, $rgtxt$Diners Club$rgtxt$, $rgtxt$Premium$rgtxt$, $rgtxt$HDFC-DIBK-DIN-PREM-001$rgtxt$),
    ($rgtxt$HDFC Bank$rgtxt$, $rgtxt$Diners Black Metal Edition$rgtxt$, $rgtxt$Diners Club$rgtxt$, $rgtxt$Premium$rgtxt$, $rgtxt$HDFC-DIBM-DIN-PREM-001$rgtxt$),
    ($rgtxt$HDFC Bank$rgtxt$, $rgtxt$Diners Club Miles$rgtxt$, $rgtxt$Diners Club$rgtxt$, $rgtxt$Premium$rgtxt$, $rgtxt$HDFC-DCMI-DIN-PREM-001$rgtxt$),
    ($rgtxt$HDFC Bank$rgtxt$, $rgtxt$Diners Club Premium$rgtxt$, $rgtxt$Diners Club$rgtxt$, $rgtxt$Premium$rgtxt$, $rgtxt$HDFC-DCPR-DIN-PREM-001$rgtxt$),
    ($rgtxt$HDFC Bank$rgtxt$, $rgtxt$Diners Club Rewardz$rgtxt$, $rgtxt$Diners Club$rgtxt$, $rgtxt$Premium$rgtxt$, $rgtxt$HDFC-DCRE-DIN-PREM-001$rgtxt$),
    ($rgtxt$HDFC Bank$rgtxt$, $rgtxt$Harley-Davidson Diners Club$rgtxt$, $rgtxt$Diners Club$rgtxt$, $rgtxt$Premium$rgtxt$, $rgtxt$HDFC-HARD-DIN-PREM-001$rgtxt$),
    ($rgtxt$HDFC Bank$rgtxt$, $rgtxt$Diners Club Miles$rgtxt$, $rgtxt$Diners Club$rgtxt$, $rgtxt$Privilege$rgtxt$, $rgtxt$HDFC-DCMI-DIN-PRIV-001$rgtxt$),
    ($rgtxt$HDFC Bank$rgtxt$, $rgtxt$Diners Club Premium$rgtxt$, $rgtxt$Diners Club$rgtxt$, $rgtxt$Privilege$rgtxt$, $rgtxt$HDFC-DCPR-DIN-PRIV-001$rgtxt$),
    ($rgtxt$HDFC Bank$rgtxt$, $rgtxt$Diners Club Rewardz$rgtxt$, $rgtxt$Diners Club$rgtxt$, $rgtxt$Privilege$rgtxt$, $rgtxt$HDFC-DCRE-DIN-PRIV-001$rgtxt$),
    ($rgtxt$HDFC Bank$rgtxt$, $rgtxt$Diners Privilege$rgtxt$, $rgtxt$Diners Club$rgtxt$, $rgtxt$Privilege$rgtxt$, $rgtxt$HDFC-DIPR-DIN-PRIV-001$rgtxt$),
    ($rgtxt$HDFC Bank$rgtxt$, $rgtxt$Marriott Bonvoy$rgtxt$, $rgtxt$Diners Club$rgtxt$, $rgtxt$Signature$rgtxt$, $rgtxt$HDFC-MARB-DIN-SIGN-001$rgtxt$),
    ($rgtxt$HDFC Bank$rgtxt$, $rgtxt$6E Rewards Indigo$rgtxt$, $rgtxt$Mastercard$rgtxt$, $rgtxt$Platinum$rgtxt$, $rgtxt$HDFC-6ERE-MST-PLAT-001$rgtxt$),
    ($rgtxt$HDFC Bank$rgtxt$, $rgtxt$6E Rewards Indigo XL$rgtxt$, $rgtxt$Mastercard$rgtxt$, $rgtxt$Platinum$rgtxt$, $rgtxt$HDFC-6ERL-MST-PLAT-001$rgtxt$),
    ($rgtxt$HDFC Bank$rgtxt$, $rgtxt$AllMiles$rgtxt$, $rgtxt$Mastercard$rgtxt$, $rgtxt$Platinum$rgtxt$, $rgtxt$HDFC-ALLM-MST-PLAT-001$rgtxt$),
    ($rgtxt$HDFC Bank$rgtxt$, $rgtxt$Best Price Save Max$rgtxt$, $rgtxt$Mastercard$rgtxt$, $rgtxt$Platinum$rgtxt$, $rgtxt$HDFC-BESM-MST-PLAT-001$rgtxt$),
    ($rgtxt$HDFC Bank$rgtxt$, $rgtxt$Best Price Save Smart$rgtxt$, $rgtxt$Mastercard$rgtxt$, $rgtxt$Platinum$rgtxt$, $rgtxt$HDFC-BESS-MST-PLAT-001$rgtxt$),
    ($rgtxt$HDFC Bank$rgtxt$, $rgtxt$Bharat CashBack$rgtxt$, $rgtxt$Mastercard$rgtxt$, $rgtxt$Platinum$rgtxt$, $rgtxt$HDFC-BHAC-MST-PLAT-001$rgtxt$),
    ($rgtxt$HDFC Bank$rgtxt$, $rgtxt$BizFirst$rgtxt$, $rgtxt$Mastercard$rgtxt$, $rgtxt$Platinum$rgtxt$, $rgtxt$HDFC-BIZF-MST-PLAT-001$rgtxt$),
    ($rgtxt$HDFC Bank$rgtxt$, $rgtxt$BizGrow$rgtxt$, $rgtxt$Mastercard$rgtxt$, $rgtxt$Platinum$rgtxt$, $rgtxt$HDFC-BIZG-MST-PLAT-001$rgtxt$),
    ($rgtxt$HDFC Bank$rgtxt$, $rgtxt$BizPower$rgtxt$, $rgtxt$Mastercard$rgtxt$, $rgtxt$Platinum$rgtxt$, $rgtxt$HDFC-BIZP-MST-PLAT-001$rgtxt$),
    ($rgtxt$HDFC Bank$rgtxt$, $rgtxt$Business Bharat CashBack$rgtxt$, $rgtxt$Mastercard$rgtxt$, $rgtxt$Platinum$rgtxt$, $rgtxt$HDFC-BUSC-MST-PLAT-001$rgtxt$),
    ($rgtxt$HDFC Bank$rgtxt$, $rgtxt$Business Freedom$rgtxt$, $rgtxt$Mastercard$rgtxt$, $rgtxt$Platinum$rgtxt$, $rgtxt$HDFC-BUSF-MST-PLAT-001$rgtxt$),
    ($rgtxt$HDFC Bank$rgtxt$, $rgtxt$Business Moneyback$rgtxt$, $rgtxt$Mastercard$rgtxt$, $rgtxt$Platinum$rgtxt$, $rgtxt$HDFC-BUSM-MST-PLAT-001$rgtxt$),
    ($rgtxt$HDFC Bank$rgtxt$, $rgtxt$Business Platinum$rgtxt$, $rgtxt$Mastercard$rgtxt$, $rgtxt$Platinum$rgtxt$, $rgtxt$HDFC-BUSP-MST-PLAT-001$rgtxt$),
    ($rgtxt$HDFC Bank$rgtxt$, $rgtxt$Business Program$rgtxt$, $rgtxt$Mastercard$rgtxt$, $rgtxt$Platinum$rgtxt$, $rgtxt$HDFC-BUSG-MST-PLAT-001$rgtxt$),
    ($rgtxt$HDFC Bank$rgtxt$, $rgtxt$Business Regalia First$rgtxt$, $rgtxt$Mastercard$rgtxt$, $rgtxt$Platinum$rgtxt$, $rgtxt$HDFC-BUST-MST-PLAT-001$rgtxt$),
    ($rgtxt$HDFC Bank$rgtxt$, $rgtxt$CSC Small Business MoneyBack$rgtxt$, $rgtxt$Mastercard$rgtxt$, $rgtxt$Platinum$rgtxt$, $rgtxt$HDFC-CSCM-MST-PLAT-001$rgtxt$),
    ($rgtxt$HDFC Bank$rgtxt$, $rgtxt$Doctor's Regalia$rgtxt$, $rgtxt$Mastercard$rgtxt$, $rgtxt$Platinum$rgtxt$, $rgtxt$HDFC-DOCR-MST-PLAT-001$rgtxt$),
    ($rgtxt$HDFC Bank$rgtxt$, $rgtxt$Doctors Superia$rgtxt$, $rgtxt$Mastercard$rgtxt$, $rgtxt$Platinum$rgtxt$, $rgtxt$HDFC-DOCS-MST-PLAT-001$rgtxt$),
    ($rgtxt$HDFC Bank$rgtxt$, $rgtxt$Easy EMI$rgtxt$, $rgtxt$Mastercard$rgtxt$, $rgtxt$Platinum$rgtxt$, $rgtxt$HDFC-EASE-MST-PLAT-001$rgtxt$),
    ($rgtxt$HDFC Bank$rgtxt$, $rgtxt$Equitas Elegance$rgtxt$, $rgtxt$Mastercard$rgtxt$, $rgtxt$Platinum$rgtxt$, $rgtxt$HDFC-ELEG-MST-PLAT-001$rgtxt$),
    ($rgtxt$HDFC Bank$rgtxt$, $rgtxt$Equitas Excite$rgtxt$, $rgtxt$Mastercard$rgtxt$, $rgtxt$Platinum$rgtxt$, $rgtxt$HDFC-EXCI-MST-PLAT-001$rgtxt$),
    ($rgtxt$HDFC Bank$rgtxt$, $rgtxt$Freedom$rgtxt$, $rgtxt$Mastercard$rgtxt$, $rgtxt$Platinum$rgtxt$, $rgtxt$HDFC-FREE-MST-PLAT-001$rgtxt$),
    ($rgtxt$HDFC Bank$rgtxt$, $rgtxt$GIGA Business$rgtxt$, $rgtxt$Mastercard$rgtxt$, $rgtxt$Platinum$rgtxt$, $rgtxt$HDFC-GIGB-MST-PLAT-001$rgtxt$),
    ($rgtxt$HDFC Bank$rgtxt$, $rgtxt$Indian Oil$rgtxt$, $rgtxt$Mastercard$rgtxt$, $rgtxt$Platinum$rgtxt$, $rgtxt$HDFC-INDL-MST-PLAT-001$rgtxt$),
    ($rgtxt$HDFC Bank$rgtxt$, $rgtxt$InterMiles Platinum$rgtxt$, $rgtxt$Mastercard$rgtxt$, $rgtxt$Platinum$rgtxt$, $rgtxt$HDFC-INTP-MST-PLAT-001$rgtxt$),
    ($rgtxt$HDFC Bank$rgtxt$, $rgtxt$InterMiles Signature$rgtxt$, $rgtxt$Mastercard$rgtxt$, $rgtxt$Platinum$rgtxt$, $rgtxt$HDFC-INTS-MST-PLAT-001$rgtxt$),
    ($rgtxt$HDFC Bank$rgtxt$, $rgtxt$IRCTC$rgtxt$, $rgtxt$Mastercard$rgtxt$, $rgtxt$Platinum$rgtxt$, $rgtxt$HDFC-IRCT-MST-PLAT-001$rgtxt$),
    ($rgtxt$HDFC Bank$rgtxt$, $rgtxt$Micro Enterprise$rgtxt$, $rgtxt$Mastercard$rgtxt$, $rgtxt$Platinum$rgtxt$, $rgtxt$HDFC-MICE-MST-PLAT-001$rgtxt$),
    ($rgtxt$HDFC Bank$rgtxt$, $rgtxt$Millennia$rgtxt$, $rgtxt$Mastercard$rgtxt$, $rgtxt$Platinum$rgtxt$, $rgtxt$HDFC-MILL-MST-PLAT-001$rgtxt$),
    ($rgtxt$HDFC Bank$rgtxt$, $rgtxt$MoneyBack$rgtxt$, $rgtxt$Mastercard$rgtxt$, $rgtxt$Platinum$rgtxt$, $rgtxt$HDFC-MONE-MST-PLAT-001$rgtxt$),
    ($rgtxt$HDFC Bank$rgtxt$, $rgtxt$MoneyBack+$rgtxt$, $rgtxt$Mastercard$rgtxt$, $rgtxt$Platinum$rgtxt$, $rgtxt$HDFC-MONX-MST-PLAT-001$rgtxt$),
    ($rgtxt$HDFC Bank$rgtxt$, $rgtxt$Paytm$rgtxt$, $rgtxt$Mastercard$rgtxt$, $rgtxt$Platinum$rgtxt$, $rgtxt$HDFC-PAYT-MST-PLAT-001$rgtxt$),
    ($rgtxt$HDFC Bank$rgtxt$, $rgtxt$Paytm Business$rgtxt$, $rgtxt$Mastercard$rgtxt$, $rgtxt$Platinum$rgtxt$, $rgtxt$HDFC-PAYU-MST-PLAT-001$rgtxt$),
    ($rgtxt$HDFC Bank$rgtxt$, $rgtxt$Paytm Digital$rgtxt$, $rgtxt$Mastercard$rgtxt$, $rgtxt$Platinum$rgtxt$, $rgtxt$HDFC-PAYD-MST-PLAT-001$rgtxt$),
    ($rgtxt$HDFC Bank$rgtxt$, $rgtxt$Paytm Select$rgtxt$, $rgtxt$Mastercard$rgtxt$, $rgtxt$Platinum$rgtxt$, $rgtxt$HDFC-PAYS-MST-PLAT-001$rgtxt$),
    ($rgtxt$HDFC Bank$rgtxt$, $rgtxt$Paytm Select Business$rgtxt$, $rgtxt$Mastercard$rgtxt$, $rgtxt$Platinum$rgtxt$, $rgtxt$HDFC-PAYB-MST-PLAT-001$rgtxt$),
    ($rgtxt$HDFC Bank$rgtxt$, $rgtxt$Pharmeasy$rgtxt$, $rgtxt$Mastercard$rgtxt$, $rgtxt$Platinum$rgtxt$, $rgtxt$HDFC-PHAR-MST-PLAT-001$rgtxt$),
    ($rgtxt$HDFC Bank$rgtxt$, $rgtxt$PhonePe Ultimo$rgtxt$, $rgtxt$Mastercard$rgtxt$, $rgtxt$Platinum$rgtxt$, $rgtxt$HDFC-PHOU-MST-PLAT-001$rgtxt$),
    ($rgtxt$HDFC Bank$rgtxt$, $rgtxt$PhonePe Uno$rgtxt$, $rgtxt$Mastercard$rgtxt$, $rgtxt$Platinum$rgtxt$, $rgtxt$HDFC-PHON-MST-PLAT-001$rgtxt$),
    ($rgtxt$HDFC Bank$rgtxt$, $rgtxt$Pine Labs$rgtxt$, $rgtxt$Mastercard$rgtxt$, $rgtxt$Platinum$rgtxt$, $rgtxt$HDFC-PINL-MST-PLAT-001$rgtxt$),
    ($rgtxt$HDFC Bank$rgtxt$, $rgtxt$Pine Labs Pro$rgtxt$, $rgtxt$Mastercard$rgtxt$, $rgtxt$Platinum$rgtxt$, $rgtxt$HDFC-PINP-MST-PLAT-001$rgtxt$),
    ($rgtxt$HDFC Bank$rgtxt$, $rgtxt$Platinum Edge$rgtxt$, $rgtxt$Mastercard$rgtxt$, $rgtxt$Platinum$rgtxt$, $rgtxt$HDFC-PTED-MST-PLAT-001$rgtxt$),
    ($rgtxt$HDFC Bank$rgtxt$, $rgtxt$Regalia$rgtxt$, $rgtxt$Mastercard$rgtxt$, $rgtxt$Platinum$rgtxt$, $rgtxt$HDFC-REGA-MST-PLAT-001$rgtxt$),
    ($rgtxt$HDFC Bank$rgtxt$, $rgtxt$Regalia Activ$rgtxt$, $rgtxt$Mastercard$rgtxt$, $rgtxt$Platinum$rgtxt$, $rgtxt$HDFC-REGV-MST-PLAT-001$rgtxt$),
    ($rgtxt$HDFC Bank$rgtxt$, $rgtxt$Regalia First$rgtxt$, $rgtxt$Mastercard$rgtxt$, $rgtxt$Platinum$rgtxt$, $rgtxt$HDFC-REGF-MST-PLAT-001$rgtxt$),
    ($rgtxt$HDFC Bank$rgtxt$, $rgtxt$Regalia Gold$rgtxt$, $rgtxt$Mastercard$rgtxt$, $rgtxt$Platinum$rgtxt$, $rgtxt$HDFC-REGG-MST-PLAT-001$rgtxt$),
    ($rgtxt$HDFC Bank$rgtxt$, $rgtxt$Retailio$rgtxt$, $rgtxt$Mastercard$rgtxt$, $rgtxt$Platinum$rgtxt$, $rgtxt$HDFC-RETA-MST-PLAT-001$rgtxt$),
    ($rgtxt$HDFC Bank$rgtxt$, $rgtxt$Shoppers Stop Black$rgtxt$, $rgtxt$Mastercard$rgtxt$, $rgtxt$Platinum$rgtxt$, $rgtxt$HDFC-SHOB-MST-PLAT-001$rgtxt$),
    ($rgtxt$HDFC Bank$rgtxt$, $rgtxt$Shoppers Stop$rgtxt$, $rgtxt$Mastercard$rgtxt$, $rgtxt$Platinum$rgtxt$, $rgtxt$HDFC-SHOS-MST-PLAT-001$rgtxt$),
    ($rgtxt$HDFC Bank$rgtxt$, $rgtxt$Small Business Moneyback$rgtxt$, $rgtxt$Mastercard$rgtxt$, $rgtxt$Platinum$rgtxt$, $rgtxt$HDFC-SMAM-MST-PLAT-001$rgtxt$),
    ($rgtxt$HDFC Bank$rgtxt$, $rgtxt$Snapdeal$rgtxt$, $rgtxt$Mastercard$rgtxt$, $rgtxt$Platinum$rgtxt$, $rgtxt$HDFC-SNAP-MST-PLAT-001$rgtxt$),
    ($rgtxt$HDFC Bank$rgtxt$, $rgtxt$Solitaire$rgtxt$, $rgtxt$Mastercard$rgtxt$, $rgtxt$Platinum$rgtxt$, $rgtxt$HDFC-SOLI-MST-PLAT-001$rgtxt$),
    ($rgtxt$HDFC Bank$rgtxt$, $rgtxt$Superia$rgtxt$, $rgtxt$Mastercard$rgtxt$, $rgtxt$Platinum$rgtxt$, $rgtxt$HDFC-SUPE-MST-PLAT-001$rgtxt$),
    ($rgtxt$HDFC Bank$rgtxt$, $rgtxt$Swiggy$rgtxt$, $rgtxt$Mastercard$rgtxt$, $rgtxt$Platinum$rgtxt$, $rgtxt$HDFC-SWIG-MST-PLAT-001$rgtxt$),
    ($rgtxt$HDFC Bank$rgtxt$, $rgtxt$Swiggy Ornge$rgtxt$, $rgtxt$Mastercard$rgtxt$, $rgtxt$Platinum$rgtxt$, $rgtxt$HDFC-SWOR-MST-PLAT-001$rgtxt$),
    ($rgtxt$HDFC Bank$rgtxt$, $rgtxt$Teacher's Platinum$rgtxt$, $rgtxt$Mastercard$rgtxt$, $rgtxt$Platinum$rgtxt$, $rgtxt$HDFC-TEAP-MST-PLAT-001$rgtxt$),
    ($rgtxt$HDFC Bank$rgtxt$, $rgtxt$Times Card Credit Platinum$rgtxt$, $rgtxt$Mastercard$rgtxt$, $rgtxt$Platinum$rgtxt$, $rgtxt$HDFC-TIMP-MST-PLAT-001$rgtxt$),
    ($rgtxt$HDFC Bank$rgtxt$, $rgtxt$Times Platinum$rgtxt$, $rgtxt$Mastercard$rgtxt$, $rgtxt$Platinum$rgtxt$, $rgtxt$HDFC-TIM2-MST-PLAT-001$rgtxt$),
    ($rgtxt$HDFC Bank$rgtxt$, $rgtxt$Times Titanium$rgtxt$, $rgtxt$Mastercard$rgtxt$, $rgtxt$Platinum$rgtxt$, $rgtxt$HDFC-TIMT-MST-PLAT-001$rgtxt$),
    ($rgtxt$HDFC Bank$rgtxt$, $rgtxt$Business Regalia$rgtxt$, $rgtxt$Mastercard$rgtxt$, $rgtxt$World$rgtxt$, $rgtxt$HDFC-BUSR-MST-WRLD-001$rgtxt$),
    ($rgtxt$HDFC Bank$rgtxt$, $rgtxt$Infinia$rgtxt$, $rgtxt$Mastercard$rgtxt$, $rgtxt$World$rgtxt$, $rgtxt$HDFC-INFI-MST-WRLD-001$rgtxt$),
    ($rgtxt$HDFC Bank$rgtxt$, $rgtxt$Infinia (Metal Edition)$rgtxt$, $rgtxt$Mastercard$rgtxt$, $rgtxt$World$rgtxt$, $rgtxt$HDFC-INFM-MST-WRLD-001$rgtxt$),
    ($rgtxt$HDFC Bank$rgtxt$, $rgtxt$Swiggy BLCK$rgtxt$, $rgtxt$Mastercard$rgtxt$, $rgtxt$World$rgtxt$, $rgtxt$HDFC-SWBK-MST-WRLD-001$rgtxt$),
    ($rgtxt$HDFC Bank$rgtxt$, $rgtxt$UPI RuPay Biz$rgtxt$, $rgtxt$RuPay$rgtxt$, $rgtxt$Commercial$rgtxt$, $rgtxt$HDFC-UPIB-RUP-COMM-001$rgtxt$),
    ($rgtxt$HDFC Bank$rgtxt$, $rgtxt$UPI RuPay$rgtxt$, $rgtxt$RuPay$rgtxt$, $rgtxt$Credit on UPI$rgtxt$, $rgtxt$HDFC-UPI0-RUP-CUPI-001$rgtxt$),
    ($rgtxt$HDFC Bank$rgtxt$, $rgtxt$UPI RuPay Mega Saver$rgtxt$, $rgtxt$RuPay$rgtxt$, $rgtxt$Credit on UPI$rgtxt$, $rgtxt$HDFC-UPIM-RUP-CUPI-001$rgtxt$),
    ($rgtxt$HDFC Bank$rgtxt$, $rgtxt$6E Rewards Indigo$rgtxt$, $rgtxt$RuPay$rgtxt$, $rgtxt$Platinum$rgtxt$, $rgtxt$HDFC-6ERE-RUP-PLAT-001$rgtxt$),
    ($rgtxt$HDFC Bank$rgtxt$, $rgtxt$6E Rewards Indigo XL$rgtxt$, $rgtxt$RuPay$rgtxt$, $rgtxt$Platinum$rgtxt$, $rgtxt$HDFC-6ERL-RUP-PLAT-001$rgtxt$),
    ($rgtxt$HDFC Bank$rgtxt$, $rgtxt$AllMiles$rgtxt$, $rgtxt$RuPay$rgtxt$, $rgtxt$Platinum$rgtxt$, $rgtxt$HDFC-ALLM-RUP-PLAT-001$rgtxt$),
    ($rgtxt$HDFC Bank$rgtxt$, $rgtxt$Best Price Save Max$rgtxt$, $rgtxt$RuPay$rgtxt$, $rgtxt$Platinum$rgtxt$, $rgtxt$HDFC-BESM-RUP-PLAT-001$rgtxt$),
    ($rgtxt$HDFC Bank$rgtxt$, $rgtxt$Best Price Save Smart$rgtxt$, $rgtxt$RuPay$rgtxt$, $rgtxt$Platinum$rgtxt$, $rgtxt$HDFC-BESS-RUP-PLAT-001$rgtxt$),
    ($rgtxt$HDFC Bank$rgtxt$, $rgtxt$Bharat CashBack$rgtxt$, $rgtxt$RuPay$rgtxt$, $rgtxt$Platinum$rgtxt$, $rgtxt$HDFC-BHAC-RUP-PLAT-001$rgtxt$),
    ($rgtxt$HDFC Bank$rgtxt$, $rgtxt$BizFirst$rgtxt$, $rgtxt$RuPay$rgtxt$, $rgtxt$Platinum$rgtxt$, $rgtxt$HDFC-BIZF-RUP-PLAT-001$rgtxt$),
    ($rgtxt$HDFC Bank$rgtxt$, $rgtxt$BizGrow$rgtxt$, $rgtxt$RuPay$rgtxt$, $rgtxt$Platinum$rgtxt$, $rgtxt$HDFC-BIZG-RUP-PLAT-001$rgtxt$),
    ($rgtxt$HDFC Bank$rgtxt$, $rgtxt$BizPower$rgtxt$, $rgtxt$RuPay$rgtxt$, $rgtxt$Platinum$rgtxt$, $rgtxt$HDFC-BIZP-RUP-PLAT-001$rgtxt$),
    ($rgtxt$HDFC Bank$rgtxt$, $rgtxt$BizBlack Metal$rgtxt$, $rgtxt$RuPay$rgtxt$, $rgtxt$Platinum$rgtxt$, $rgtxt$HDFC-BIZM-RUP-PLAT-001$rgtxt$),
    ($rgtxt$HDFC Bank$rgtxt$, $rgtxt$Business Bharat CashBack$rgtxt$, $rgtxt$RuPay$rgtxt$, $rgtxt$Platinum$rgtxt$, $rgtxt$HDFC-BUSC-RUP-PLAT-001$rgtxt$),
    ($rgtxt$HDFC Bank$rgtxt$, $rgtxt$Business Freedom$rgtxt$, $rgtxt$RuPay$rgtxt$, $rgtxt$Platinum$rgtxt$, $rgtxt$HDFC-BUSF-RUP-PLAT-001$rgtxt$),
    ($rgtxt$HDFC Bank$rgtxt$, $rgtxt$Business Moneyback$rgtxt$, $rgtxt$RuPay$rgtxt$, $rgtxt$Platinum$rgtxt$, $rgtxt$HDFC-BUSM-RUP-PLAT-001$rgtxt$),
    ($rgtxt$HDFC Bank$rgtxt$, $rgtxt$Business Platinum$rgtxt$, $rgtxt$RuPay$rgtxt$, $rgtxt$Platinum$rgtxt$, $rgtxt$HDFC-BUSP-RUP-PLAT-001$rgtxt$),
    ($rgtxt$HDFC Bank$rgtxt$, $rgtxt$Business Program$rgtxt$, $rgtxt$RuPay$rgtxt$, $rgtxt$Platinum$rgtxt$, $rgtxt$HDFC-BUSG-RUP-PLAT-001$rgtxt$),
    ($rgtxt$HDFC Bank$rgtxt$, $rgtxt$Doctors Superia$rgtxt$, $rgtxt$RuPay$rgtxt$, $rgtxt$Platinum$rgtxt$, $rgtxt$HDFC-DOCS-RUP-PLAT-001$rgtxt$),
    ($rgtxt$HDFC Bank$rgtxt$, $rgtxt$Easy EMI$rgtxt$, $rgtxt$RuPay$rgtxt$, $rgtxt$Platinum$rgtxt$, $rgtxt$HDFC-EASE-RUP-PLAT-001$rgtxt$),
    ($rgtxt$HDFC Bank$rgtxt$, $rgtxt$Equitas Elegance$rgtxt$, $rgtxt$RuPay$rgtxt$, $rgtxt$Platinum$rgtxt$, $rgtxt$HDFC-ELEG-RUP-PLAT-001$rgtxt$),
    ($rgtxt$HDFC Bank$rgtxt$, $rgtxt$Equitas Excite$rgtxt$, $rgtxt$RuPay$rgtxt$, $rgtxt$Platinum$rgtxt$, $rgtxt$HDFC-EXCI-RUP-PLAT-001$rgtxt$),
    ($rgtxt$HDFC Bank$rgtxt$, $rgtxt$Flipkart Wholesale$rgtxt$, $rgtxt$RuPay$rgtxt$, $rgtxt$Platinum$rgtxt$, $rgtxt$HDFC-FLIW-RUP-PLAT-001$rgtxt$),
    ($rgtxt$HDFC Bank$rgtxt$, $rgtxt$Freedom$rgtxt$, $rgtxt$RuPay$rgtxt$, $rgtxt$Platinum$rgtxt$, $rgtxt$HDFC-FREE-RUP-PLAT-001$rgtxt$),
    ($rgtxt$HDFC Bank$rgtxt$, $rgtxt$GIGA Business$rgtxt$, $rgtxt$RuPay$rgtxt$, $rgtxt$Platinum$rgtxt$, $rgtxt$HDFC-GIGB-RUP-PLAT-001$rgtxt$),
    ($rgtxt$HDFC Bank$rgtxt$, $rgtxt$Indian Oil$rgtxt$, $rgtxt$RuPay$rgtxt$, $rgtxt$Platinum$rgtxt$, $rgtxt$HDFC-INDL-RUP-PLAT-001$rgtxt$),
    ($rgtxt$HDFC Bank$rgtxt$, $rgtxt$IRCTC$rgtxt$, $rgtxt$RuPay$rgtxt$, $rgtxt$Platinum$rgtxt$, $rgtxt$HDFC-IRCT-RUP-PLAT-001$rgtxt$),
    ($rgtxt$HDFC Bank$rgtxt$, $rgtxt$Micro Enterprise$rgtxt$, $rgtxt$RuPay$rgtxt$, $rgtxt$Platinum$rgtxt$, $rgtxt$HDFC-MICE-RUP-PLAT-001$rgtxt$),
    ($rgtxt$HDFC Bank$rgtxt$, $rgtxt$Millennia$rgtxt$, $rgtxt$RuPay$rgtxt$, $rgtxt$Platinum$rgtxt$, $rgtxt$HDFC-MILL-RUP-PLAT-001$rgtxt$),
    ($rgtxt$HDFC Bank$rgtxt$, $rgtxt$MoneyBack$rgtxt$, $rgtxt$RuPay$rgtxt$, $rgtxt$Platinum$rgtxt$, $rgtxt$HDFC-MONE-RUP-PLAT-001$rgtxt$),
    ($rgtxt$HDFC Bank$rgtxt$, $rgtxt$MoneyBack+$rgtxt$, $rgtxt$RuPay$rgtxt$, $rgtxt$Platinum$rgtxt$, $rgtxt$HDFC-MONX-RUP-PLAT-001$rgtxt$),
    ($rgtxt$HDFC Bank$rgtxt$, $rgtxt$Paytm$rgtxt$, $rgtxt$RuPay$rgtxt$, $rgtxt$Platinum$rgtxt$, $rgtxt$HDFC-PAYT-RUP-PLAT-001$rgtxt$),
    ($rgtxt$HDFC Bank$rgtxt$, $rgtxt$Paytm Business$rgtxt$, $rgtxt$RuPay$rgtxt$, $rgtxt$Platinum$rgtxt$, $rgtxt$HDFC-PAYU-RUP-PLAT-001$rgtxt$),
    ($rgtxt$HDFC Bank$rgtxt$, $rgtxt$Paytm Digital$rgtxt$, $rgtxt$RuPay$rgtxt$, $rgtxt$Platinum$rgtxt$, $rgtxt$HDFC-PAYD-RUP-PLAT-001$rgtxt$),
    ($rgtxt$HDFC Bank$rgtxt$, $rgtxt$Paytm Select$rgtxt$, $rgtxt$RuPay$rgtxt$, $rgtxt$Platinum$rgtxt$, $rgtxt$HDFC-PAYS-RUP-PLAT-001$rgtxt$),
    ($rgtxt$HDFC Bank$rgtxt$, $rgtxt$Paytm Select Business$rgtxt$, $rgtxt$RuPay$rgtxt$, $rgtxt$Platinum$rgtxt$, $rgtxt$HDFC-PAYB-RUP-PLAT-001$rgtxt$),
    ($rgtxt$HDFC Bank$rgtxt$, $rgtxt$Pharmeasy$rgtxt$, $rgtxt$RuPay$rgtxt$, $rgtxt$Platinum$rgtxt$, $rgtxt$HDFC-PHAR-RUP-PLAT-001$rgtxt$),
    ($rgtxt$HDFC Bank$rgtxt$, $rgtxt$PhonePe Ultimo$rgtxt$, $rgtxt$RuPay$rgtxt$, $rgtxt$Platinum$rgtxt$, $rgtxt$HDFC-PHOU-RUP-PLAT-001$rgtxt$),
    ($rgtxt$HDFC Bank$rgtxt$, $rgtxt$PhonePe Uno$rgtxt$, $rgtxt$RuPay$rgtxt$, $rgtxt$Platinum$rgtxt$, $rgtxt$HDFC-PHON-RUP-PLAT-001$rgtxt$),
    ($rgtxt$HDFC Bank$rgtxt$, $rgtxt$Pine Labs$rgtxt$, $rgtxt$RuPay$rgtxt$, $rgtxt$Platinum$rgtxt$, $rgtxt$HDFC-PINL-RUP-PLAT-001$rgtxt$),
    ($rgtxt$HDFC Bank$rgtxt$, $rgtxt$Pine Labs Pro$rgtxt$, $rgtxt$RuPay$rgtxt$, $rgtxt$Platinum$rgtxt$, $rgtxt$HDFC-PINP-RUP-PLAT-001$rgtxt$),
    ($rgtxt$HDFC Bank$rgtxt$, $rgtxt$PIXEL Go$rgtxt$, $rgtxt$RuPay$rgtxt$, $rgtxt$Platinum$rgtxt$, $rgtxt$HDFC-PIXG-RUP-PLAT-001$rgtxt$),
    ($rgtxt$HDFC Bank$rgtxt$, $rgtxt$PIXEL Play$rgtxt$, $rgtxt$RuPay$rgtxt$, $rgtxt$Platinum$rgtxt$, $rgtxt$HDFC-PIXP-RUP-PLAT-001$rgtxt$),
    ($rgtxt$HDFC Bank$rgtxt$, $rgtxt$Platinum Edge$rgtxt$, $rgtxt$RuPay$rgtxt$, $rgtxt$Platinum$rgtxt$, $rgtxt$HDFC-PTED-RUP-PLAT-001$rgtxt$),
    ($rgtxt$HDFC Bank$rgtxt$, $rgtxt$Retailio$rgtxt$, $rgtxt$RuPay$rgtxt$, $rgtxt$Platinum$rgtxt$, $rgtxt$HDFC-RETA-RUP-PLAT-001$rgtxt$),
    ($rgtxt$HDFC Bank$rgtxt$, $rgtxt$Shoppers Stop Black$rgtxt$, $rgtxt$RuPay$rgtxt$, $rgtxt$Platinum$rgtxt$, $rgtxt$HDFC-SHOB-RUP-PLAT-001$rgtxt$),
    ($rgtxt$HDFC Bank$rgtxt$, $rgtxt$Shoppers Stop$rgtxt$, $rgtxt$RuPay$rgtxt$, $rgtxt$Platinum$rgtxt$, $rgtxt$HDFC-SHOS-RUP-PLAT-001$rgtxt$),
    ($rgtxt$HDFC Bank$rgtxt$, $rgtxt$Small Business Moneyback$rgtxt$, $rgtxt$RuPay$rgtxt$, $rgtxt$Platinum$rgtxt$, $rgtxt$HDFC-SMAM-RUP-PLAT-001$rgtxt$),
    ($rgtxt$HDFC Bank$rgtxt$, $rgtxt$Snapdeal$rgtxt$, $rgtxt$RuPay$rgtxt$, $rgtxt$Platinum$rgtxt$, $rgtxt$HDFC-SNAP-RUP-PLAT-001$rgtxt$),
    ($rgtxt$HDFC Bank$rgtxt$, $rgtxt$Solitaire$rgtxt$, $rgtxt$RuPay$rgtxt$, $rgtxt$Platinum$rgtxt$, $rgtxt$HDFC-SOLI-RUP-PLAT-001$rgtxt$),
    ($rgtxt$HDFC Bank$rgtxt$, $rgtxt$Superia$rgtxt$, $rgtxt$RuPay$rgtxt$, $rgtxt$Platinum$rgtxt$, $rgtxt$HDFC-SUPE-RUP-PLAT-001$rgtxt$),
    ($rgtxt$HDFC Bank$rgtxt$, $rgtxt$Tata Neu Infinity$rgtxt$, $rgtxt$RuPay$rgtxt$, $rgtxt$Platinum$rgtxt$, $rgtxt$HDFC-TNUI-RUP-PLAT-001$rgtxt$),
    ($rgtxt$HDFC Bank$rgtxt$, $rgtxt$Tata Neu Plus$rgtxt$, $rgtxt$RuPay$rgtxt$, $rgtxt$Platinum$rgtxt$, $rgtxt$HDFC-TNUX-RUP-PLAT-001$rgtxt$),
    ($rgtxt$HDFC Bank$rgtxt$, $rgtxt$Teacher's Platinum$rgtxt$, $rgtxt$RuPay$rgtxt$, $rgtxt$Platinum$rgtxt$, $rgtxt$HDFC-TEAP-RUP-PLAT-001$rgtxt$),
    ($rgtxt$HDFC Bank$rgtxt$, $rgtxt$Times Card Credit Platinum$rgtxt$, $rgtxt$RuPay$rgtxt$, $rgtxt$Platinum$rgtxt$, $rgtxt$HDFC-TIMP-RUP-PLAT-001$rgtxt$),
    ($rgtxt$HDFC Bank$rgtxt$, $rgtxt$Times Platinum$rgtxt$, $rgtxt$RuPay$rgtxt$, $rgtxt$Platinum$rgtxt$, $rgtxt$HDFC-TIM2-RUP-PLAT-001$rgtxt$),
    ($rgtxt$HDFC Bank$rgtxt$, $rgtxt$Times Titanium$rgtxt$, $rgtxt$RuPay$rgtxt$, $rgtxt$Platinum$rgtxt$, $rgtxt$HDFC-TIMT-RUP-PLAT-001$rgtxt$),
    ($rgtxt$HDFC Bank$rgtxt$, $rgtxt$UPI RuPay$rgtxt$, $rgtxt$RuPay$rgtxt$, $rgtxt$Select$rgtxt$, $rgtxt$HDFC-UPI0-RUP-SELC-001$rgtxt$),
    ($rgtxt$HDFC Bank$rgtxt$, $rgtxt$UPI RuPay Biz$rgtxt$, $rgtxt$RuPay$rgtxt$, $rgtxt$Select$rgtxt$, $rgtxt$HDFC-UPIB-RUP-SELC-001$rgtxt$),
    ($rgtxt$HDFC Bank$rgtxt$, $rgtxt$UPI RuPay Mega Saver$rgtxt$, $rgtxt$RuPay$rgtxt$, $rgtxt$Select$rgtxt$, $rgtxt$HDFC-UPIM-RUP-SELC-001$rgtxt$),
    ($rgtxt$HDFC Bank$rgtxt$, $rgtxt$Business Regalia$rgtxt$, $rgtxt$Visa$rgtxt$, $rgtxt$Infinite$rgtxt$, $rgtxt$HDFC-BUSR-VIS-INFI-001$rgtxt$),
    ($rgtxt$HDFC Bank$rgtxt$, $rgtxt$Infinia$rgtxt$, $rgtxt$Visa$rgtxt$, $rgtxt$Infinite$rgtxt$, $rgtxt$HDFC-INFI-VIS-INFI-001$rgtxt$),
    ($rgtxt$HDFC Bank$rgtxt$, $rgtxt$Infinia (Metal Edition)$rgtxt$, $rgtxt$Visa$rgtxt$, $rgtxt$Infinite$rgtxt$, $rgtxt$HDFC-INFM-VIS-INFI-001$rgtxt$),
    ($rgtxt$HDFC Bank$rgtxt$, $rgtxt$Swiggy BLCK$rgtxt$, $rgtxt$Visa$rgtxt$, $rgtxt$Infinite$rgtxt$, $rgtxt$HDFC-SWBK-VIS-INFI-001$rgtxt$),
    ($rgtxt$HDFC Bank$rgtxt$, $rgtxt$6E Rewards Indigo$rgtxt$, $rgtxt$Visa$rgtxt$, $rgtxt$Platinum$rgtxt$, $rgtxt$HDFC-6ERE-VIS-PLAT-001$rgtxt$),
    ($rgtxt$HDFC Bank$rgtxt$, $rgtxt$6E Rewards Indigo XL$rgtxt$, $rgtxt$Visa$rgtxt$, $rgtxt$Platinum$rgtxt$, $rgtxt$HDFC-6ERL-VIS-PLAT-001$rgtxt$),
    ($rgtxt$HDFC Bank$rgtxt$, $rgtxt$AllMiles$rgtxt$, $rgtxt$Visa$rgtxt$, $rgtxt$Platinum$rgtxt$, $rgtxt$HDFC-ALLM-VIS-PLAT-001$rgtxt$),
    ($rgtxt$HDFC Bank$rgtxt$, $rgtxt$Best Price Save Max$rgtxt$, $rgtxt$Visa$rgtxt$, $rgtxt$Platinum$rgtxt$, $rgtxt$HDFC-BESM-VIS-PLAT-001$rgtxt$),
    ($rgtxt$HDFC Bank$rgtxt$, $rgtxt$Best Price Save Smart$rgtxt$, $rgtxt$Visa$rgtxt$, $rgtxt$Platinum$rgtxt$, $rgtxt$HDFC-BESS-VIS-PLAT-001$rgtxt$),
    ($rgtxt$HDFC Bank$rgtxt$, $rgtxt$Bharat CashBack$rgtxt$, $rgtxt$Visa$rgtxt$, $rgtxt$Platinum$rgtxt$, $rgtxt$HDFC-BHAC-VIS-PLAT-001$rgtxt$),
    ($rgtxt$HDFC Bank$rgtxt$, $rgtxt$BizFirst$rgtxt$, $rgtxt$Visa$rgtxt$, $rgtxt$Platinum$rgtxt$, $rgtxt$HDFC-BIZF-VIS-PLAT-001$rgtxt$),
    ($rgtxt$HDFC Bank$rgtxt$, $rgtxt$BizGrow$rgtxt$, $rgtxt$Visa$rgtxt$, $rgtxt$Platinum$rgtxt$, $rgtxt$HDFC-BIZG-VIS-PLAT-001$rgtxt$),
    ($rgtxt$HDFC Bank$rgtxt$, $rgtxt$BizPower$rgtxt$, $rgtxt$Visa$rgtxt$, $rgtxt$Platinum$rgtxt$, $rgtxt$HDFC-BIZP-VIS-PLAT-001$rgtxt$),
    ($rgtxt$HDFC Bank$rgtxt$, $rgtxt$BizBlack Metal$rgtxt$, $rgtxt$Visa$rgtxt$, $rgtxt$Platinum$rgtxt$, $rgtxt$HDFC-BIZM-VIS-PLAT-001$rgtxt$),
    ($rgtxt$HDFC Bank$rgtxt$, $rgtxt$Business Bharat CashBack$rgtxt$, $rgtxt$Visa$rgtxt$, $rgtxt$Platinum$rgtxt$, $rgtxt$HDFC-BUSC-VIS-PLAT-001$rgtxt$),
    ($rgtxt$HDFC Bank$rgtxt$, $rgtxt$Business Freedom$rgtxt$, $rgtxt$Visa$rgtxt$, $rgtxt$Platinum$rgtxt$, $rgtxt$HDFC-BUSF-VIS-PLAT-001$rgtxt$),
    ($rgtxt$HDFC Bank$rgtxt$, $rgtxt$Business Moneyback$rgtxt$, $rgtxt$Visa$rgtxt$, $rgtxt$Platinum$rgtxt$, $rgtxt$HDFC-BUSM-VIS-PLAT-001$rgtxt$),
    ($rgtxt$HDFC Bank$rgtxt$, $rgtxt$Business Platinum$rgtxt$, $rgtxt$Visa$rgtxt$, $rgtxt$Platinum$rgtxt$, $rgtxt$HDFC-BUSP-VIS-PLAT-001$rgtxt$),
    ($rgtxt$HDFC Bank$rgtxt$, $rgtxt$Business Program$rgtxt$, $rgtxt$Visa$rgtxt$, $rgtxt$Platinum$rgtxt$, $rgtxt$HDFC-BUSG-VIS-PLAT-001$rgtxt$),
    ($rgtxt$HDFC Bank$rgtxt$, $rgtxt$CSC Small Business MoneyBack$rgtxt$, $rgtxt$Visa$rgtxt$, $rgtxt$Platinum$rgtxt$, $rgtxt$HDFC-CSCM-VIS-PLAT-001$rgtxt$),
    ($rgtxt$HDFC Bank$rgtxt$, $rgtxt$Doctors Superia$rgtxt$, $rgtxt$Visa$rgtxt$, $rgtxt$Platinum$rgtxt$, $rgtxt$HDFC-DOCS-VIS-PLAT-001$rgtxt$),
    ($rgtxt$HDFC Bank$rgtxt$, $rgtxt$Easy EMI$rgtxt$, $rgtxt$Visa$rgtxt$, $rgtxt$Platinum$rgtxt$, $rgtxt$HDFC-EASE-VIS-PLAT-001$rgtxt$),
    ($rgtxt$HDFC Bank$rgtxt$, $rgtxt$Equitas Elegance$rgtxt$, $rgtxt$Visa$rgtxt$, $rgtxt$Platinum$rgtxt$, $rgtxt$HDFC-ELEG-VIS-PLAT-001$rgtxt$),
    ($rgtxt$HDFC Bank$rgtxt$, $rgtxt$Equitas Excite$rgtxt$, $rgtxt$Visa$rgtxt$, $rgtxt$Platinum$rgtxt$, $rgtxt$HDFC-EXCI-VIS-PLAT-001$rgtxt$),
    ($rgtxt$HDFC Bank$rgtxt$, $rgtxt$Flipkart Wholesale$rgtxt$, $rgtxt$Visa$rgtxt$, $rgtxt$Platinum$rgtxt$, $rgtxt$HDFC-FLIW-VIS-PLAT-001$rgtxt$),
    ($rgtxt$HDFC Bank$rgtxt$, $rgtxt$Freedom$rgtxt$, $rgtxt$Visa$rgtxt$, $rgtxt$Platinum$rgtxt$, $rgtxt$HDFC-FREE-VIS-PLAT-001$rgtxt$),
    ($rgtxt$HDFC Bank$rgtxt$, $rgtxt$GIGA Business$rgtxt$, $rgtxt$Visa$rgtxt$, $rgtxt$Platinum$rgtxt$, $rgtxt$HDFC-GIGB-VIS-PLAT-001$rgtxt$),
    ($rgtxt$HDFC Bank$rgtxt$, $rgtxt$Indian Oil$rgtxt$, $rgtxt$Visa$rgtxt$, $rgtxt$Platinum$rgtxt$, $rgtxt$HDFC-INDL-VIS-PLAT-001$rgtxt$),
    ($rgtxt$HDFC Bank$rgtxt$, $rgtxt$InterMiles Platinum$rgtxt$, $rgtxt$Visa$rgtxt$, $rgtxt$Platinum$rgtxt$, $rgtxt$HDFC-INTP-VIS-PLAT-001$rgtxt$),
    ($rgtxt$HDFC Bank$rgtxt$, $rgtxt$IRCTC$rgtxt$, $rgtxt$Visa$rgtxt$, $rgtxt$Platinum$rgtxt$, $rgtxt$HDFC-IRCT-VIS-PLAT-001$rgtxt$),
    ($rgtxt$HDFC Bank$rgtxt$, $rgtxt$Micro Enterprise$rgtxt$, $rgtxt$Visa$rgtxt$, $rgtxt$Platinum$rgtxt$, $rgtxt$HDFC-MICE-VIS-PLAT-001$rgtxt$),
    ($rgtxt$HDFC Bank$rgtxt$, $rgtxt$Millennia$rgtxt$, $rgtxt$Visa$rgtxt$, $rgtxt$Platinum$rgtxt$, $rgtxt$HDFC-MILL-VIS-PLAT-001$rgtxt$),
    ($rgtxt$HDFC Bank$rgtxt$, $rgtxt$MoneyBack$rgtxt$, $rgtxt$Visa$rgtxt$, $rgtxt$Platinum$rgtxt$, $rgtxt$HDFC-MONE-VIS-PLAT-001$rgtxt$),
    ($rgtxt$HDFC Bank$rgtxt$, $rgtxt$MoneyBack+$rgtxt$, $rgtxt$Visa$rgtxt$, $rgtxt$Platinum$rgtxt$, $rgtxt$HDFC-MONX-VIS-PLAT-001$rgtxt$),
    ($rgtxt$HDFC Bank$rgtxt$, $rgtxt$Paytm$rgtxt$, $rgtxt$Visa$rgtxt$, $rgtxt$Platinum$rgtxt$, $rgtxt$HDFC-PAYT-VIS-PLAT-001$rgtxt$),
    ($rgtxt$HDFC Bank$rgtxt$, $rgtxt$Paytm Business$rgtxt$, $rgtxt$Visa$rgtxt$, $rgtxt$Platinum$rgtxt$, $rgtxt$HDFC-PAYU-VIS-PLAT-001$rgtxt$),
    ($rgtxt$HDFC Bank$rgtxt$, $rgtxt$Paytm Digital$rgtxt$, $rgtxt$Visa$rgtxt$, $rgtxt$Platinum$rgtxt$, $rgtxt$HDFC-PAYD-VIS-PLAT-001$rgtxt$),
    ($rgtxt$HDFC Bank$rgtxt$, $rgtxt$Paytm Select$rgtxt$, $rgtxt$Visa$rgtxt$, $rgtxt$Platinum$rgtxt$, $rgtxt$HDFC-PAYS-VIS-PLAT-001$rgtxt$),
    ($rgtxt$HDFC Bank$rgtxt$, $rgtxt$Paytm Select Business$rgtxt$, $rgtxt$Visa$rgtxt$, $rgtxt$Platinum$rgtxt$, $rgtxt$HDFC-PAYB-VIS-PLAT-001$rgtxt$),
    ($rgtxt$HDFC Bank$rgtxt$, $rgtxt$Pharmeasy$rgtxt$, $rgtxt$Visa$rgtxt$, $rgtxt$Platinum$rgtxt$, $rgtxt$HDFC-PHAR-VIS-PLAT-001$rgtxt$),
    ($rgtxt$HDFC Bank$rgtxt$, $rgtxt$PhonePe Ultimo$rgtxt$, $rgtxt$Visa$rgtxt$, $rgtxt$Platinum$rgtxt$, $rgtxt$HDFC-PHOU-VIS-PLAT-001$rgtxt$),
    ($rgtxt$HDFC Bank$rgtxt$, $rgtxt$PhonePe Uno$rgtxt$, $rgtxt$Visa$rgtxt$, $rgtxt$Platinum$rgtxt$, $rgtxt$HDFC-PHON-VIS-PLAT-001$rgtxt$),
    ($rgtxt$HDFC Bank$rgtxt$, $rgtxt$Pine Labs$rgtxt$, $rgtxt$Visa$rgtxt$, $rgtxt$Platinum$rgtxt$, $rgtxt$HDFC-PINL-VIS-PLAT-001$rgtxt$),
    ($rgtxt$HDFC Bank$rgtxt$, $rgtxt$Pine Labs Pro$rgtxt$, $rgtxt$Visa$rgtxt$, $rgtxt$Platinum$rgtxt$, $rgtxt$HDFC-PINP-VIS-PLAT-001$rgtxt$),
    ($rgtxt$HDFC Bank$rgtxt$, $rgtxt$PIXEL Go$rgtxt$, $rgtxt$Visa$rgtxt$, $rgtxt$Platinum$rgtxt$, $rgtxt$HDFC-PIXG-VIS-PLAT-001$rgtxt$),
    ($rgtxt$HDFC Bank$rgtxt$, $rgtxt$PIXEL Play$rgtxt$, $rgtxt$Visa$rgtxt$, $rgtxt$Platinum$rgtxt$, $rgtxt$HDFC-PIXP-VIS-PLAT-001$rgtxt$),
    ($rgtxt$HDFC Bank$rgtxt$, $rgtxt$Platinum Edge$rgtxt$, $rgtxt$Visa$rgtxt$, $rgtxt$Platinum$rgtxt$, $rgtxt$HDFC-PTED-VIS-PLAT-001$rgtxt$),
    ($rgtxt$HDFC Bank$rgtxt$, $rgtxt$Retailio$rgtxt$, $rgtxt$Visa$rgtxt$, $rgtxt$Platinum$rgtxt$, $rgtxt$HDFC-RETA-VIS-PLAT-001$rgtxt$),
    ($rgtxt$HDFC Bank$rgtxt$, $rgtxt$Shoppers Stop Black$rgtxt$, $rgtxt$Visa$rgtxt$, $rgtxt$Platinum$rgtxt$, $rgtxt$HDFC-SHOB-VIS-PLAT-001$rgtxt$),
    ($rgtxt$HDFC Bank$rgtxt$, $rgtxt$Shoppers Stop$rgtxt$, $rgtxt$Visa$rgtxt$, $rgtxt$Platinum$rgtxt$, $rgtxt$HDFC-SHOS-VIS-PLAT-001$rgtxt$),
    ($rgtxt$HDFC Bank$rgtxt$, $rgtxt$Small Business Moneyback$rgtxt$, $rgtxt$Visa$rgtxt$, $rgtxt$Platinum$rgtxt$, $rgtxt$HDFC-SMAM-VIS-PLAT-001$rgtxt$),
    ($rgtxt$HDFC Bank$rgtxt$, $rgtxt$Snapdeal$rgtxt$, $rgtxt$Visa$rgtxt$, $rgtxt$Platinum$rgtxt$, $rgtxt$HDFC-SNAP-VIS-PLAT-001$rgtxt$),
    ($rgtxt$HDFC Bank$rgtxt$, $rgtxt$Solitaire$rgtxt$, $rgtxt$Visa$rgtxt$, $rgtxt$Platinum$rgtxt$, $rgtxt$HDFC-SOLI-VIS-PLAT-001$rgtxt$),
    ($rgtxt$HDFC Bank$rgtxt$, $rgtxt$Superia$rgtxt$, $rgtxt$Visa$rgtxt$, $rgtxt$Platinum$rgtxt$, $rgtxt$HDFC-SUPE-VIS-PLAT-001$rgtxt$),
    ($rgtxt$HDFC Bank$rgtxt$, $rgtxt$Teacher's Platinum$rgtxt$, $rgtxt$Visa$rgtxt$, $rgtxt$Platinum$rgtxt$, $rgtxt$HDFC-TEAP-VIS-PLAT-001$rgtxt$),
    ($rgtxt$HDFC Bank$rgtxt$, $rgtxt$Times Card Credit Platinum$rgtxt$, $rgtxt$Visa$rgtxt$, $rgtxt$Platinum$rgtxt$, $rgtxt$HDFC-TIMP-VIS-PLAT-001$rgtxt$),
    ($rgtxt$HDFC Bank$rgtxt$, $rgtxt$Times Platinum$rgtxt$, $rgtxt$Visa$rgtxt$, $rgtxt$Platinum$rgtxt$, $rgtxt$HDFC-TIM2-VIS-PLAT-001$rgtxt$),
    ($rgtxt$HDFC Bank$rgtxt$, $rgtxt$Times Titanium$rgtxt$, $rgtxt$Visa$rgtxt$, $rgtxt$Platinum$rgtxt$, $rgtxt$HDFC-TIMT-VIS-PLAT-001$rgtxt$),
    ($rgtxt$HDFC Bank$rgtxt$, $rgtxt$Business Regalia First$rgtxt$, $rgtxt$Visa$rgtxt$, $rgtxt$Signature$rgtxt$, $rgtxt$HDFC-BUST-VIS-SIGN-001$rgtxt$),
    ($rgtxt$HDFC Bank$rgtxt$, $rgtxt$Doctor's Regalia$rgtxt$, $rgtxt$Visa$rgtxt$, $rgtxt$Signature$rgtxt$, $rgtxt$HDFC-DOCR-VIS-SIGN-001$rgtxt$),
    ($rgtxt$HDFC Bank$rgtxt$, $rgtxt$InterMiles Signature$rgtxt$, $rgtxt$Visa$rgtxt$, $rgtxt$Signature$rgtxt$, $rgtxt$HDFC-INTS-VIS-SIGN-001$rgtxt$),
    ($rgtxt$HDFC Bank$rgtxt$, $rgtxt$Regalia$rgtxt$, $rgtxt$Visa$rgtxt$, $rgtxt$Signature$rgtxt$, $rgtxt$HDFC-REGA-VIS-SIGN-001$rgtxt$),
    ($rgtxt$HDFC Bank$rgtxt$, $rgtxt$Regalia Activ$rgtxt$, $rgtxt$Visa$rgtxt$, $rgtxt$Signature$rgtxt$, $rgtxt$HDFC-REGV-VIS-SIGN-001$rgtxt$),
    ($rgtxt$HDFC Bank$rgtxt$, $rgtxt$Regalia First$rgtxt$, $rgtxt$Visa$rgtxt$, $rgtxt$Signature$rgtxt$, $rgtxt$HDFC-REGF-VIS-SIGN-001$rgtxt$),
    ($rgtxt$HDFC Bank$rgtxt$, $rgtxt$Regalia Gold$rgtxt$, $rgtxt$Visa$rgtxt$, $rgtxt$Signature$rgtxt$, $rgtxt$HDFC-REGG-VIS-SIGN-001$rgtxt$),
    ($rgtxt$HDFC Bank$rgtxt$, $rgtxt$Swiggy$rgtxt$, $rgtxt$Visa$rgtxt$, $rgtxt$Signature$rgtxt$, $rgtxt$HDFC-SWIG-VIS-SIGN-001$rgtxt$),
    ($rgtxt$HDFC Bank$rgtxt$, $rgtxt$Swiggy Ornge$rgtxt$, $rgtxt$Visa$rgtxt$, $rgtxt$Signature$rgtxt$, $rgtxt$HDFC-SWOR-VIS-SIGN-001$rgtxt$),
    ($rgtxt$HDFC Bank$rgtxt$, $rgtxt$Tata Neu Infinity$rgtxt$, $rgtxt$Visa$rgtxt$, $rgtxt$Signature$rgtxt$, $rgtxt$HDFC-TNUI-VIS-SIGN-001$rgtxt$),
    ($rgtxt$HDFC Bank$rgtxt$, $rgtxt$Tata Neu Plus$rgtxt$, $rgtxt$Visa$rgtxt$, $rgtxt$Signature$rgtxt$, $rgtxt$HDFC-TNUX-VIS-SIGN-001$rgtxt$),
    ($rgtxt$ICICI Bank$rgtxt$, $rgtxt$Business Ascent Amex$rgtxt$, $rgtxt$Amex$rgtxt$, $rgtxt$Business Gold$rgtxt$, $rgtxt$ICIC-BUSA-AMX-BGLD-001$rgtxt$),
    ($rgtxt$ICICI Bank$rgtxt$, $rgtxt$Business Essential Amex$rgtxt$, $rgtxt$Amex$rgtxt$, $rgtxt$Business Gold$rgtxt$, $rgtxt$ICIC-BUSE-AMX-BGLD-001$rgtxt$),
    ($rgtxt$ICICI Bank$rgtxt$, $rgtxt$Rubyx$rgtxt$, $rgtxt$Amex$rgtxt$, $rgtxt$Gold Card$rgtxt$, $rgtxt$ICIC-RUBX-AMX-GOLC-001$rgtxt$),
    ($rgtxt$ICICI Bank$rgtxt$, $rgtxt$Sapphiro$rgtxt$, $rgtxt$Amex$rgtxt$, $rgtxt$Gold Card$rgtxt$, $rgtxt$ICIC-SAPH-AMX-GOLC-001$rgtxt$),
    ($rgtxt$ICICI Bank$rgtxt$, $rgtxt$InterMiles Sapphiro$rgtxt$, $rgtxt$Amex$rgtxt$, $rgtxt$Gold Card$rgtxt$, $rgtxt$ICIC-INTO-AMX-GOLC-001$rgtxt$),
    ($rgtxt$ICICI Bank$rgtxt$, $rgtxt$Coral$rgtxt$, $rgtxt$Amex$rgtxt$, $rgtxt$Green Card$rgtxt$, $rgtxt$ICIC-CORL-AMX-GRCD-001$rgtxt$),
    ($rgtxt$ICICI Bank$rgtxt$, $rgtxt$HPCL Coral$rgtxt$, $rgtxt$Amex$rgtxt$, $rgtxt$Green Card$rgtxt$, $rgtxt$ICIC-HPCC-AMX-GRCD-001$rgtxt$),
    ($rgtxt$ICICI Bank$rgtxt$, $rgtxt$HPCL Coral American Express$rgtxt$, $rgtxt$Amex$rgtxt$, $rgtxt$Green Card$rgtxt$, $rgtxt$ICIC-HPC2-AMX-GRCD-001$rgtxt$),
    ($rgtxt$ICICI Bank$rgtxt$, $rgtxt$InterMiles Coral$rgtxt$, $rgtxt$Amex$rgtxt$, $rgtxt$Green Card$rgtxt$, $rgtxt$ICIC-INTC-AMX-GRCD-001$rgtxt$),
    ($rgtxt$ICICI Bank$rgtxt$, $rgtxt$Ascent Amex$rgtxt$, $rgtxt$Amex$rgtxt$, $rgtxt$Platinum$rgtxt$, $rgtxt$ICIC-ASCE-AMX-PLAT-001$rgtxt$),
    ($rgtxt$ICICI Bank$rgtxt$, $rgtxt$American Express Green$rgtxt$, $rgtxt$Amex$rgtxt$, $rgtxt$Platinum$rgtxt$, $rgtxt$ICIC-GREE-AMX-PLAT-001$rgtxt$),
    ($rgtxt$ICICI Bank$rgtxt$, $rgtxt$Big Bazaar Silver$rgtxt$, $rgtxt$Mastercard$rgtxt$, $rgtxt$Classic$rgtxt$, $rgtxt$ICIC-BIGR-MST-CLAS-001$rgtxt$),
    ($rgtxt$ICICI Bank$rgtxt$, $rgtxt$Big Bazaar Gold$rgtxt$, $rgtxt$Mastercard$rgtxt$, $rgtxt$Gold$rgtxt$, $rgtxt$ICIC-BIGG-MST-GOLD-001$rgtxt$),
    ($rgtxt$ICICI Bank$rgtxt$, $rgtxt$Coral$rgtxt$, $rgtxt$Mastercard$rgtxt$, $rgtxt$Platinum$rgtxt$, $rgtxt$ICIC-CORL-MST-PLAT-001$rgtxt$),
    ($rgtxt$ICICI Bank$rgtxt$, $rgtxt$HPCL Coral$rgtxt$, $rgtxt$Mastercard$rgtxt$, $rgtxt$Platinum$rgtxt$, $rgtxt$ICIC-HPCC-MST-PLAT-001$rgtxt$),
    ($rgtxt$ICICI Bank$rgtxt$, $rgtxt$Plus (Add-on)$rgtxt$, $rgtxt$Mastercard$rgtxt$, $rgtxt$Platinum$rgtxt$, $rgtxt$ICIC-PLUX-MST-PLAT-001$rgtxt$),
    ($rgtxt$ICICI Bank$rgtxt$, $rgtxt$Corporate Gold$rgtxt$, $rgtxt$Mastercard$rgtxt$, $rgtxt$Platinum$rgtxt$, $rgtxt$ICIC-CORG-MST-PLAT-001$rgtxt$),
    ($rgtxt$ICICI Bank$rgtxt$, $rgtxt$Corporate Platinum$rgtxt$, $rgtxt$Mastercard$rgtxt$, $rgtxt$Platinum$rgtxt$, $rgtxt$ICIC-CORM-MST-PLAT-001$rgtxt$),
    ($rgtxt$ICICI Bank$rgtxt$, $rgtxt$CTA$rgtxt$, $rgtxt$Mastercard$rgtxt$, $rgtxt$Platinum$rgtxt$, $rgtxt$ICIC-CTA0-MST-PLAT-001$rgtxt$),
    ($rgtxt$ICICI Bank$rgtxt$, $rgtxt$Dual Billing Purchase$rgtxt$, $rgtxt$Mastercard$rgtxt$, $rgtxt$Platinum$rgtxt$, $rgtxt$ICIC-PURD-MST-PLAT-001$rgtxt$),
    ($rgtxt$ICICI Bank$rgtxt$, $rgtxt$LEADTHENEW Coral$rgtxt$, $rgtxt$Mastercard$rgtxt$, $rgtxt$Platinum$rgtxt$, $rgtxt$ICIC-LEAC-MST-PLAT-001$rgtxt$),
    ($rgtxt$ICICI Bank$rgtxt$, $rgtxt$Platinum Business$rgtxt$, $rgtxt$Mastercard$rgtxt$, $rgtxt$Platinum$rgtxt$, $rgtxt$ICIC-PTBU-MST-PLAT-001$rgtxt$),
    ($rgtxt$ICICI Bank$rgtxt$, $rgtxt$Purchase$rgtxt$, $rgtxt$Mastercard$rgtxt$, $rgtxt$Platinum$rgtxt$, $rgtxt$ICIC-PURC-MST-PLAT-001$rgtxt$),
    ($rgtxt$ICICI Bank$rgtxt$, $rgtxt$Big Bazaar Shakti$rgtxt$, $rgtxt$Mastercard$rgtxt$, $rgtxt$Platinum$rgtxt$, $rgtxt$ICIC-BIGS-MST-PLAT-001$rgtxt$),
    ($rgtxt$ICICI Bank$rgtxt$, $rgtxt$CESC Co-Branded$rgtxt$, $rgtxt$Mastercard$rgtxt$, $rgtxt$Platinum$rgtxt$, $rgtxt$ICIC-CESB-MST-PLAT-001$rgtxt$),
    ($rgtxt$ICICI Bank$rgtxt$, $rgtxt$Indiatimes$rgtxt$, $rgtxt$Mastercard$rgtxt$, $rgtxt$Platinum$rgtxt$, $rgtxt$ICIC-INDI-MST-PLAT-001$rgtxt$),
    ($rgtxt$ICICI Bank$rgtxt$, $rgtxt$Megamart$rgtxt$, $rgtxt$Mastercard$rgtxt$, $rgtxt$Platinum$rgtxt$, $rgtxt$ICIC-MEGA-MST-PLAT-001$rgtxt$),
    ($rgtxt$ICICI Bank$rgtxt$, $rgtxt$Sarovar Hotels$rgtxt$, $rgtxt$Mastercard$rgtxt$, $rgtxt$Platinum$rgtxt$, $rgtxt$ICIC-SARH-MST-PLAT-001$rgtxt$),
    ($rgtxt$ICICI Bank$rgtxt$, $rgtxt$Unifare Bangalore Metro$rgtxt$, $rgtxt$Mastercard$rgtxt$, $rgtxt$Platinum$rgtxt$, $rgtxt$ICIC-UNIB-MST-PLAT-001$rgtxt$),
    ($rgtxt$ICICI Bank$rgtxt$, $rgtxt$Unifare$rgtxt$, $rgtxt$Mastercard$rgtxt$, $rgtxt$Platinum$rgtxt$, $rgtxt$ICIC-UNIF-MST-PLAT-001$rgtxt$),
    ($rgtxt$ICICI Bank$rgtxt$, $rgtxt$Unifare Mumbai Metro$rgtxt$, $rgtxt$Mastercard$rgtxt$, $rgtxt$Platinum$rgtxt$, $rgtxt$ICIC-UNIM-MST-PLAT-001$rgtxt$),
    ($rgtxt$ICICI Bank$rgtxt$, $rgtxt$Kingfisher Airlines Platinum$rgtxt$, $rgtxt$Mastercard$rgtxt$, $rgtxt$Platinum$rgtxt$, $rgtxt$ICIC-KINP-MST-PLAT-001$rgtxt$),
    ($rgtxt$ICICI Bank$rgtxt$, $rgtxt$MakeMyTrip$rgtxt$, $rgtxt$Mastercard$rgtxt$, $rgtxt$Platinum$rgtxt$, $rgtxt$ICIC-MAKE-MST-PLAT-001$rgtxt$),
    ($rgtxt$ICICI Bank$rgtxt$, $rgtxt$Emeralde Private$rgtxt$, $rgtxt$Mastercard$rgtxt$, $rgtxt$Signature$rgtxt$, $rgtxt$ICIC-EMEP-MST-SIGN-001$rgtxt$),
    ($rgtxt$ICICI Bank$rgtxt$, $rgtxt$Kingfisher Airlines Titanium$rgtxt$, $rgtxt$Mastercard$rgtxt$, $rgtxt$Titanium$rgtxt$, $rgtxt$ICIC-KINT-MST-TITN-001$rgtxt$),
    ($rgtxt$ICICI Bank$rgtxt$, $rgtxt$Rubyx$rgtxt$, $rgtxt$Mastercard$rgtxt$, $rgtxt$World$rgtxt$, $rgtxt$ICIC-RUBX-MST-WRLD-001$rgtxt$),
    ($rgtxt$ICICI Bank$rgtxt$, $rgtxt$Emeralde Private Metal$rgtxt$, $rgtxt$Mastercard$rgtxt$, $rgtxt$World Elite$rgtxt$, $rgtxt$ICIC-EMEM-MST-WELT-001$rgtxt$),
    ($rgtxt$ICICI Bank$rgtxt$, $rgtxt$Sapphiro$rgtxt$, $rgtxt$Mastercard$rgtxt$, $rgtxt$World$rgtxt$, $rgtxt$ICIC-SAPH-MST-WRLD-001$rgtxt$),
    ($rgtxt$ICICI Bank$rgtxt$, $rgtxt$Diamant$rgtxt$, $rgtxt$Mastercard$rgtxt$, $rgtxt$World Elite$rgtxt$, $rgtxt$ICIC-DIAM-MST-WELT-001$rgtxt$),
    ($rgtxt$ICICI Bank$rgtxt$, $rgtxt$Kingfisher Airlines World$rgtxt$, $rgtxt$Mastercard$rgtxt$, $rgtxt$World$rgtxt$, $rgtxt$ICIC-KINW-MST-WRLD-001$rgtxt$),
    ($rgtxt$ICICI Bank$rgtxt$, $rgtxt$Plus (Add-on)$rgtxt$, $rgtxt$RuPay$rgtxt$, $rgtxt$Platinum$rgtxt$, $rgtxt$ICIC-PLUX-RUP-PLAT-001$rgtxt$),
    ($rgtxt$ICICI Bank$rgtxt$, $rgtxt$Coral against FD$rgtxt$, $rgtxt$RuPay$rgtxt$, $rgtxt$Platinum$rgtxt$, $rgtxt$ICIC-CORF-RUP-PLAT-001$rgtxt$),
    ($rgtxt$ICICI Bank$rgtxt$, $rgtxt$Coral$rgtxt$, $rgtxt$RuPay$rgtxt$, $rgtxt$Select$rgtxt$, $rgtxt$ICIC-CORL-RUP-SELC-001$rgtxt$),
    ($rgtxt$ICICI Bank$rgtxt$, $rgtxt$HPCL Super Saver$rgtxt$, $rgtxt$RuPay$rgtxt$, $rgtxt$Select$rgtxt$, $rgtxt$ICIC-HPCR-RUP-SELC-001$rgtxt$),
    ($rgtxt$ICICI Bank$rgtxt$, $rgtxt$Rubyx$rgtxt$, $rgtxt$RuPay$rgtxt$, $rgtxt$Select$rgtxt$, $rgtxt$ICIC-RUBX-RUP-SELC-001$rgtxt$),
    ($rgtxt$ICICI Bank$rgtxt$, $rgtxt$Sapphiro$rgtxt$, $rgtxt$RuPay$rgtxt$, $rgtxt$Select$rgtxt$, $rgtxt$ICIC-SAPH-RUP-SELC-001$rgtxt$),
    ($rgtxt$ICICI Bank$rgtxt$, $rgtxt$Rubyx against FD$rgtxt$, $rgtxt$RuPay$rgtxt$, $rgtxt$Select$rgtxt$, $rgtxt$ICIC-RUBF-RUP-SELC-001$rgtxt$),
    ($rgtxt$ICICI Bank$rgtxt$, $rgtxt$LEADTHENEW Coral$rgtxt$, $rgtxt$RuPay$rgtxt$, $rgtxt$Select$rgtxt$, $rgtxt$ICIC-LEAC-RUP-SELC-001$rgtxt$),
    ($rgtxt$ICICI Bank$rgtxt$, $rgtxt$MakeMyTrip$rgtxt$, $rgtxt$RuPay$rgtxt$, $rgtxt$Select$rgtxt$, $rgtxt$ICIC-MAKE-RUP-SELC-001$rgtxt$),
    ($rgtxt$ICICI Bank$rgtxt$, $rgtxt$British Airways Classic$rgtxt$, $rgtxt$Visa$rgtxt$, $rgtxt$Classic$rgtxt$, $rgtxt$ICIC-BRIC-VIS-CLAS-001$rgtxt$),
    ($rgtxt$ICICI Bank$rgtxt$, $rgtxt$Parakram$rgtxt$, $rgtxt$Visa$rgtxt$, $rgtxt$Classic$rgtxt$, $rgtxt$ICIC-PARA-VIS-CLAS-001$rgtxt$),
    ($rgtxt$ICICI Bank$rgtxt$, $rgtxt$Business Advantage Blue$rgtxt$, $rgtxt$Visa$rgtxt$, $rgtxt$Classic$rgtxt$, $rgtxt$ICIC-BUSL-VIS-CLAS-001$rgtxt$),
    ($rgtxt$ICICI Bank$rgtxt$, $rgtxt$Business Micro$rgtxt$, $rgtxt$Visa$rgtxt$, $rgtxt$Classic$rgtxt$, $rgtxt$ICIC-BUSO-VIS-CLAS-001$rgtxt$),
    ($rgtxt$ICICI Bank$rgtxt$, $rgtxt$HPCL Silver$rgtxt$, $rgtxt$Visa$rgtxt$, $rgtxt$Classic$rgtxt$, $rgtxt$ICIC-HPCS-VIS-CLAS-001$rgtxt$),
    ($rgtxt$ICICI Bank$rgtxt$, $rgtxt$Airtel Silver$rgtxt$, $rgtxt$Visa$rgtxt$, $rgtxt$Classic$rgtxt$, $rgtxt$ICIC-AIRS-VIS-CLAS-001$rgtxt$),
    ($rgtxt$ICICI Bank$rgtxt$, $rgtxt$Classic Business$rgtxt$, $rgtxt$Visa$rgtxt$, $rgtxt$Classic$rgtxt$, $rgtxt$ICIC-CLAB-VIS-CLAS-001$rgtxt$),
    ($rgtxt$ICICI Bank$rgtxt$, $rgtxt$Federal Bank Silver$rgtxt$, $rgtxt$Visa$rgtxt$, $rgtxt$Classic$rgtxt$, $rgtxt$ICIC-FEDS-VIS-CLAS-001$rgtxt$),
    ($rgtxt$ICICI Bank$rgtxt$, $rgtxt$Future Silver$rgtxt$, $rgtxt$Visa$rgtxt$, $rgtxt$Classic$rgtxt$, $rgtxt$ICIC-FUTS-VIS-CLAS-001$rgtxt$),
    ($rgtxt$ICICI Bank$rgtxt$, $rgtxt$Preferred Silver$rgtxt$, $rgtxt$Visa$rgtxt$, $rgtxt$Classic$rgtxt$, $rgtxt$ICIC-PRES-VIS-CLAS-001$rgtxt$),
    ($rgtxt$ICICI Bank$rgtxt$, $rgtxt$Punjab & Sind Silver$rgtxt$, $rgtxt$Visa$rgtxt$, $rgtxt$Classic$rgtxt$, $rgtxt$ICIC-PUNS-VIS-CLAS-001$rgtxt$),
    ($rgtxt$ICICI Bank$rgtxt$, $rgtxt$Gold Business$rgtxt$, $rgtxt$Visa$rgtxt$, $rgtxt$Gold$rgtxt$, $rgtxt$ICIC-GOLB-VIS-GOLD-001$rgtxt$),
    ($rgtxt$ICICI Bank$rgtxt$, $rgtxt$HPCL Gold$rgtxt$, $rgtxt$Visa$rgtxt$, $rgtxt$Gold$rgtxt$, $rgtxt$ICIC-HPCG-VIS-GOLD-001$rgtxt$),
    ($rgtxt$ICICI Bank$rgtxt$, $rgtxt$Air Deccan Gold$rgtxt$, $rgtxt$Visa$rgtxt$, $rgtxt$Gold$rgtxt$, $rgtxt$ICIC-AIDG-VIS-GOLD-001$rgtxt$),
    ($rgtxt$ICICI Bank$rgtxt$, $rgtxt$Airtel Gold$rgtxt$, $rgtxt$Visa$rgtxt$, $rgtxt$Gold$rgtxt$, $rgtxt$ICIC-AIRG-VIS-GOLD-001$rgtxt$),
    ($rgtxt$ICICI Bank$rgtxt$, $rgtxt$Central Gold$rgtxt$, $rgtxt$Visa$rgtxt$, $rgtxt$Gold$rgtxt$, $rgtxt$ICIC-CENG-VIS-GOLD-001$rgtxt$),
    ($rgtxt$ICICI Bank$rgtxt$, $rgtxt$Federal Bank Gold$rgtxt$, $rgtxt$Visa$rgtxt$, $rgtxt$Gold$rgtxt$, $rgtxt$ICIC-FEDG-VIS-GOLD-001$rgtxt$),
    ($rgtxt$ICICI Bank$rgtxt$, $rgtxt$Future Gold$rgtxt$, $rgtxt$Visa$rgtxt$, $rgtxt$Gold$rgtxt$, $rgtxt$ICIC-FUTG-VIS-GOLD-001$rgtxt$),
    ($rgtxt$ICICI Bank$rgtxt$, $rgtxt$Preferred Gold$rgtxt$, $rgtxt$Visa$rgtxt$, $rgtxt$Gold$rgtxt$, $rgtxt$ICIC-PREG-VIS-GOLD-001$rgtxt$),
    ($rgtxt$ICICI Bank$rgtxt$, $rgtxt$Punjab & Sind Gold$rgtxt$, $rgtxt$Visa$rgtxt$, $rgtxt$Gold$rgtxt$, $rgtxt$ICIC-PUNG-VIS-GOLD-001$rgtxt$),
    ($rgtxt$ICICI Bank$rgtxt$, $rgtxt$Times Black$rgtxt$, $rgtxt$Visa$rgtxt$, $rgtxt$Infinite$rgtxt$, $rgtxt$ICIC-TIMB-VIS-INFI-001$rgtxt$),
    ($rgtxt$ICICI Bank$rgtxt$, $rgtxt$Accelero$rgtxt$, $rgtxt$Visa$rgtxt$, $rgtxt$Platinum$rgtxt$, $rgtxt$ICIC-ACCE-VIS-PLAT-001$rgtxt$),
    ($rgtxt$ICICI Bank$rgtxt$, $rgtxt$Adani One Platinum$rgtxt$, $rgtxt$Visa$rgtxt$, $rgtxt$Platinum$rgtxt$, $rgtxt$ICIC-ADAP-VIS-PLAT-001$rgtxt$),
    ($rgtxt$ICICI Bank$rgtxt$, $rgtxt$Amazon Pay$rgtxt$, $rgtxt$Visa$rgtxt$, $rgtxt$Platinum$rgtxt$, $rgtxt$ICIC-AMAZ-VIS-PLAT-001$rgtxt$),
    ($rgtxt$ICICI Bank$rgtxt$, $rgtxt$British Airways Premium$rgtxt$, $rgtxt$Visa$rgtxt$, $rgtxt$Platinum$rgtxt$, $rgtxt$ICIC-BRIP-VIS-PLAT-001$rgtxt$),
    ($rgtxt$ICICI Bank$rgtxt$, $rgtxt$Chennai Super Kings$rgtxt$, $rgtxt$Visa$rgtxt$, $rgtxt$Platinum$rgtxt$, $rgtxt$ICIC-CHEK-VIS-PLAT-001$rgtxt$),
    ($rgtxt$ICICI Bank$rgtxt$, $rgtxt$Emirates Skywards Rubyx$rgtxt$, $rgtxt$Visa$rgtxt$, $rgtxt$Platinum$rgtxt$, $rgtxt$ICIC-EMIR-VIS-PLAT-001$rgtxt$),
    ($rgtxt$ICICI Bank$rgtxt$, $rgtxt$Coral$rgtxt$, $rgtxt$Visa$rgtxt$, $rgtxt$Platinum$rgtxt$, $rgtxt$ICIC-CORL-VIS-PLAT-001$rgtxt$),
    ($rgtxt$ICICI Bank$rgtxt$, $rgtxt$Expressions$rgtxt$, $rgtxt$Visa$rgtxt$, $rgtxt$Platinum$rgtxt$, $rgtxt$ICIC-EXPR-VIS-PLAT-001$rgtxt$),
    ($rgtxt$ICICI Bank$rgtxt$, $rgtxt$HPCL Coral$rgtxt$, $rgtxt$Visa$rgtxt$, $rgtxt$Platinum$rgtxt$, $rgtxt$ICIC-HPCC-VIS-PLAT-001$rgtxt$),
    ($rgtxt$ICICI Bank$rgtxt$, $rgtxt$HPCL Super Saver$rgtxt$, $rgtxt$Visa$rgtxt$, $rgtxt$Platinum$rgtxt$, $rgtxt$ICIC-HPCR-VIS-PLAT-001$rgtxt$),
    ($rgtxt$ICICI Bank$rgtxt$, $rgtxt$Parakram Select$rgtxt$, $rgtxt$Visa$rgtxt$, $rgtxt$Platinum$rgtxt$, $rgtxt$ICIC-PARS-VIS-PLAT-001$rgtxt$),
    ($rgtxt$ICICI Bank$rgtxt$, $rgtxt$Platinum Chip$rgtxt$, $rgtxt$Visa$rgtxt$, $rgtxt$Platinum$rgtxt$, $rgtxt$ICIC-PTCI-VIS-PLAT-001$rgtxt$),
    ($rgtxt$ICICI Bank$rgtxt$, $rgtxt$Plus (Add-on)$rgtxt$, $rgtxt$Visa$rgtxt$, $rgtxt$Platinum$rgtxt$, $rgtxt$ICIC-PLUX-VIS-PLAT-001$rgtxt$),
    ($rgtxt$ICICI Bank$rgtxt$, $rgtxt$Alumni$rgtxt$, $rgtxt$Visa$rgtxt$, $rgtxt$Platinum$rgtxt$, $rgtxt$ICIC-ALUM-VIS-PLAT-001$rgtxt$),
    ($rgtxt$ICICI Bank$rgtxt$, $rgtxt$Business Advantage Black$rgtxt$, $rgtxt$Visa$rgtxt$, $rgtxt$Platinum$rgtxt$, $rgtxt$ICIC-BUSB-VIS-PLAT-001$rgtxt$),
    ($rgtxt$ICICI Bank$rgtxt$, $rgtxt$Coral against FD$rgtxt$, $rgtxt$Visa$rgtxt$, $rgtxt$Platinum$rgtxt$, $rgtxt$ICIC-CORF-VIS-PLAT-001$rgtxt$),
    ($rgtxt$ICICI Bank$rgtxt$, $rgtxt$Corporate Gold$rgtxt$, $rgtxt$Visa$rgtxt$, $rgtxt$Platinum$rgtxt$, $rgtxt$ICIC-CORG-VIS-PLAT-001$rgtxt$),
    ($rgtxt$ICICI Bank$rgtxt$, $rgtxt$Corporate Platinum$rgtxt$, $rgtxt$Visa$rgtxt$, $rgtxt$Platinum$rgtxt$, $rgtxt$ICIC-CORM-VIS-PLAT-001$rgtxt$),
    ($rgtxt$ICICI Bank$rgtxt$, $rgtxt$CTA$rgtxt$, $rgtxt$Visa$rgtxt$, $rgtxt$Platinum$rgtxt$, $rgtxt$ICIC-CTA0-VIS-PLAT-001$rgtxt$),
    ($rgtxt$ICICI Bank$rgtxt$, $rgtxt$Dual Billing Purchase$rgtxt$, $rgtxt$Visa$rgtxt$, $rgtxt$Platinum$rgtxt$, $rgtxt$ICIC-PURD-VIS-PLAT-001$rgtxt$),
    ($rgtxt$ICICI Bank$rgtxt$, $rgtxt$HPCL Coral Visa Contactless$rgtxt$, $rgtxt$Visa$rgtxt$, $rgtxt$Platinum$rgtxt$, $rgtxt$ICIC-HPC2-VIS-PLAT-001$rgtxt$),
    ($rgtxt$ICICI Bank$rgtxt$, $rgtxt$NRI Coral$rgtxt$, $rgtxt$Visa$rgtxt$, $rgtxt$Platinum$rgtxt$, $rgtxt$ICIC-NRIC-VIS-PLAT-001$rgtxt$),
    ($rgtxt$ICICI Bank$rgtxt$, $rgtxt$LEADTHENEW Coral$rgtxt$, $rgtxt$Visa$rgtxt$, $rgtxt$Platinum$rgtxt$, $rgtxt$ICIC-LEAC-VIS-PLAT-001$rgtxt$),
    ($rgtxt$ICICI Bank$rgtxt$, $rgtxt$Instant Platinum$rgtxt$, $rgtxt$Visa$rgtxt$, $rgtxt$Platinum$rgtxt$, $rgtxt$ICIC-INSP-VIS-PLAT-001$rgtxt$),
    ($rgtxt$ICICI Bank$rgtxt$, $rgtxt$Platinum Business$rgtxt$, $rgtxt$Visa$rgtxt$, $rgtxt$Platinum$rgtxt$, $rgtxt$ICIC-PTBU-VIS-PLAT-001$rgtxt$),
    ($rgtxt$ICICI Bank$rgtxt$, $rgtxt$Purchase$rgtxt$, $rgtxt$Visa$rgtxt$, $rgtxt$Platinum$rgtxt$, $rgtxt$ICIC-PURC-VIS-PLAT-001$rgtxt$),
    ($rgtxt$ICICI Bank$rgtxt$, $rgtxt$Utility Purchase$rgtxt$, $rgtxt$Visa$rgtxt$, $rgtxt$Platinum$rgtxt$, $rgtxt$ICIC-PURU-VIS-PLAT-001$rgtxt$),
    ($rgtxt$ICICI Bank$rgtxt$, $rgtxt$NRI Coral$rgtxt$, $rgtxt$Visa$rgtxt$, $rgtxt$Platinum$rgtxt$, $rgtxt$ICIC-NRIC-VIS-PLAT-002$rgtxt$),
    ($rgtxt$ICICI Bank$rgtxt$, $rgtxt$HPCL Platinum$rgtxt$, $rgtxt$Visa$rgtxt$, $rgtxt$Platinum$rgtxt$, $rgtxt$ICIC-HPCP-VIS-PLAT-001$rgtxt$),
    ($rgtxt$ICICI Bank$rgtxt$, $rgtxt$Amway$rgtxt$, $rgtxt$Visa$rgtxt$, $rgtxt$Platinum$rgtxt$, $rgtxt$ICIC-AMWA-VIS-PLAT-001$rgtxt$),
    ($rgtxt$ICICI Bank$rgtxt$, $rgtxt$Carbon$rgtxt$, $rgtxt$Visa$rgtxt$, $rgtxt$Platinum$rgtxt$, $rgtxt$ICIC-CARB-VIS-PLAT-001$rgtxt$),
    ($rgtxt$ICICI Bank$rgtxt$, $rgtxt$Ferrari Platinum$rgtxt$, $rgtxt$Visa$rgtxt$, $rgtxt$Platinum$rgtxt$, $rgtxt$ICIC-FERP-VIS-PLAT-001$rgtxt$),
    ($rgtxt$ICICI Bank$rgtxt$, $rgtxt$Gitanjali Jewellery$rgtxt$, $rgtxt$Visa$rgtxt$, $rgtxt$Platinum$rgtxt$, $rgtxt$ICIC-GITJ-VIS-PLAT-001$rgtxt$),
    ($rgtxt$ICICI Bank$rgtxt$, $rgtxt$HelpAge India Affinity$rgtxt$, $rgtxt$Visa$rgtxt$, $rgtxt$Platinum$rgtxt$, $rgtxt$ICIC-HELA-VIS-PLAT-001$rgtxt$),
    ($rgtxt$ICICI Bank$rgtxt$, $rgtxt$Jet Airways Business Advantage$rgtxt$, $rgtxt$Visa$rgtxt$, $rgtxt$Platinum$rgtxt$, $rgtxt$ICIC-JETA-VIS-PLAT-001$rgtxt$),
    ($rgtxt$ICICI Bank$rgtxt$, $rgtxt$Orchid on Ecotel$rgtxt$, $rgtxt$Visa$rgtxt$, $rgtxt$Platinum$rgtxt$, $rgtxt$ICIC-ORCE-VIS-PLAT-001$rgtxt$),
    ($rgtxt$ICICI Bank$rgtxt$, $rgtxt$PRU Life$rgtxt$, $rgtxt$Visa$rgtxt$, $rgtxt$Platinum$rgtxt$, $rgtxt$ICIC-PRUL-VIS-PLAT-001$rgtxt$),
    ($rgtxt$ICICI Bank$rgtxt$, $rgtxt$Punjab & Sind Blue$rgtxt$, $rgtxt$Visa$rgtxt$, $rgtxt$Platinum$rgtxt$, $rgtxt$ICIC-BLUE-VIS-PLAT-001$rgtxt$),
    ($rgtxt$ICICI Bank$rgtxt$, $rgtxt$Singapore Airlines Visa Platinum$rgtxt$, $rgtxt$Visa$rgtxt$, $rgtxt$Platinum$rgtxt$, $rgtxt$ICIC-SINP-VIS-PLAT-001$rgtxt$),
    ($rgtxt$ICICI Bank$rgtxt$, $rgtxt$XBOX360$rgtxt$, $rgtxt$Visa$rgtxt$, $rgtxt$Platinum$rgtxt$, $rgtxt$ICIC-XBOX-VIS-PLAT-001$rgtxt$),
    ($rgtxt$ICICI Bank$rgtxt$, $rgtxt$Platinum Identity$rgtxt$, $rgtxt$Visa$rgtxt$, $rgtxt$Platinum$rgtxt$, $rgtxt$ICIC-PTID-VIS-PLAT-001$rgtxt$),
    ($rgtxt$ICICI Bank$rgtxt$, $rgtxt$InterMiles Coral$rgtxt$, $rgtxt$Visa$rgtxt$, $rgtxt$Platinum$rgtxt$, $rgtxt$ICIC-INTC-VIS-PLAT-001$rgtxt$),
    ($rgtxt$ICICI Bank$rgtxt$, $rgtxt$MakeMyTrip Platinum$rgtxt$, $rgtxt$Visa$rgtxt$, $rgtxt$Platinum$rgtxt$, $rgtxt$ICIC-MAKP-VIS-PLAT-001$rgtxt$),
    ($rgtxt$ICICI Bank$rgtxt$, $rgtxt$Manchester United Platinum$rgtxt$, $rgtxt$Visa$rgtxt$, $rgtxt$Platinum$rgtxt$, $rgtxt$ICIC-MANP-VIS-PLAT-001$rgtxt$),
    ($rgtxt$ICICI Bank$rgtxt$, $rgtxt$Mine Credit Card by$rgtxt$, $rgtxt$Visa$rgtxt$, $rgtxt$Platinum$rgtxt$, $rgtxt$ICIC-MINB-VIS-PLAT-001$rgtxt$),
    ($rgtxt$ICICI Bank$rgtxt$, $rgtxt$Toyota Co-Branded$rgtxt$, $rgtxt$Visa$rgtxt$, $rgtxt$Platinum$rgtxt$, $rgtxt$ICIC-TOYB-VIS-PLAT-001$rgtxt$),
    ($rgtxt$ICICI Bank$rgtxt$, $rgtxt$Adani One Signature$rgtxt$, $rgtxt$Visa$rgtxt$, $rgtxt$Signature$rgtxt$, $rgtxt$ICIC-ADAS-VIS-SIGN-001$rgtxt$),
    ($rgtxt$ICICI Bank$rgtxt$, $rgtxt$Emirates Skywards Emeralde$rgtxt$, $rgtxt$Visa$rgtxt$, $rgtxt$Signature$rgtxt$, $rgtxt$ICIC-EMIE-VIS-SIGN-001$rgtxt$),
    ($rgtxt$ICICI Bank$rgtxt$, $rgtxt$Emirates Skywards Sapphiro$rgtxt$, $rgtxt$Visa$rgtxt$, $rgtxt$Signature$rgtxt$, $rgtxt$ICIC-EMIS-VIS-SIGN-001$rgtxt$),
    ($rgtxt$ICICI Bank$rgtxt$, $rgtxt$NRI Sapphiro$rgtxt$, $rgtxt$Visa$rgtxt$, $rgtxt$Signature$rgtxt$, $rgtxt$ICIC-NRIS-VIS-SIGN-001$rgtxt$),
    ($rgtxt$ICICI Bank$rgtxt$, $rgtxt$Rubyx against FD$rgtxt$, $rgtxt$Visa$rgtxt$, $rgtxt$Signature$rgtxt$, $rgtxt$ICIC-RUBF-VIS-SIGN-001$rgtxt$),
    ($rgtxt$ICICI Bank$rgtxt$, $rgtxt$Emeralde$rgtxt$, $rgtxt$Visa$rgtxt$, $rgtxt$Signature$rgtxt$, $rgtxt$ICIC-EMER-VIS-SIGN-001$rgtxt$),
    ($rgtxt$ICICI Bank$rgtxt$, $rgtxt$Rubyx$rgtxt$, $rgtxt$Visa$rgtxt$, $rgtxt$Signature$rgtxt$, $rgtxt$ICIC-RUBX-VIS-SIGN-001$rgtxt$),
    ($rgtxt$ICICI Bank$rgtxt$, $rgtxt$Sapphiro$rgtxt$, $rgtxt$Visa$rgtxt$, $rgtxt$Signature$rgtxt$, $rgtxt$ICIC-SAPH-VIS-SIGN-001$rgtxt$),
    ($rgtxt$ICICI Bank$rgtxt$, $rgtxt$Signature$rgtxt$, $rgtxt$Visa$rgtxt$, $rgtxt$Signature$rgtxt$, $rgtxt$ICIC-SIGN-VIS-SIGN-001$rgtxt$),
    ($rgtxt$ICICI Bank$rgtxt$, $rgtxt$Ferrari Signature$rgtxt$, $rgtxt$Visa$rgtxt$, $rgtxt$Signature$rgtxt$, $rgtxt$ICIC-FERS-VIS-SIGN-001$rgtxt$),
    ($rgtxt$ICICI Bank$rgtxt$, $rgtxt$InterMiles Rubyx$rgtxt$, $rgtxt$Visa$rgtxt$, $rgtxt$Signature$rgtxt$, $rgtxt$ICIC-INTR-VIS-SIGN-001$rgtxt$),
    ($rgtxt$ICICI Bank$rgtxt$, $rgtxt$InterMiles Sapphiro$rgtxt$, $rgtxt$Visa$rgtxt$, $rgtxt$Signature$rgtxt$, $rgtxt$ICIC-INTO-VIS-SIGN-001$rgtxt$),
    ($rgtxt$ICICI Bank$rgtxt$, $rgtxt$MakeMyTrip Signature$rgtxt$, $rgtxt$Visa$rgtxt$, $rgtxt$Signature$rgtxt$, $rgtxt$ICIC-MAKS-VIS-SIGN-001$rgtxt$),
    ($rgtxt$ICICI Bank$rgtxt$, $rgtxt$Manchester United Signature$rgtxt$, $rgtxt$Visa$rgtxt$, $rgtxt$Signature$rgtxt$, $rgtxt$ICIC-MANS-VIS-SIGN-001$rgtxt$),
    ($rgtxt$ICICI Bank$rgtxt$, $rgtxt$Titanium$rgtxt$, $rgtxt$Visa$rgtxt$, $rgtxt$Titanium$rgtxt$, $rgtxt$ICIC-TITA-VIS-TITN-001$rgtxt$),
    ($rgtxt$ICICI Bank$rgtxt$, $rgtxt$Diamant World$rgtxt$, $rgtxt$Visa$rgtxt$, $rgtxt$World$rgtxt$, $rgtxt$ICIC-DIAW-VIS-WRLD-001$rgtxt$),
    ($rgtxt$IDFC FIRST Bank$rgtxt$, $rgtxt$Club Vistara IDFC$rgtxt$, $rgtxt$Mastercard$rgtxt$, $rgtxt$World$rgtxt$, $rgtxt$IDFB-CLUV-MST-WRLD-001$rgtxt$),
    ($rgtxt$IDFC FIRST Bank$rgtxt$, $rgtxt$SWYP$rgtxt$, $rgtxt$Mastercard$rgtxt$, $rgtxt$World$rgtxt$, $rgtxt$IDFB-SWYP-MST-WRLD-001$rgtxt$),
    ($rgtxt$IDFC FIRST Bank$rgtxt$, $rgtxt$WOW! Black$rgtxt$, $rgtxt$Mastercard$rgtxt$, $rgtxt$World$rgtxt$, $rgtxt$IDFB-WOWB-MST-WRLD-001$rgtxt$),
    ($rgtxt$IDFC FIRST Bank$rgtxt$, $rgtxt$IndiGo IDFC$rgtxt$, $rgtxt$Mastercard$rgtxt$, $rgtxt$World$rgtxt$, $rgtxt$IDFB-INGO-MST-WRLD-001$rgtxt$),
    ($rgtxt$IDFC FIRST Bank$rgtxt$, $rgtxt$Mayura$rgtxt$, $rgtxt$Mastercard$rgtxt$, $rgtxt$World$rgtxt$, $rgtxt$IDFB-MAYU-MST-WRLD-001$rgtxt$),
    ($rgtxt$IDFC FIRST Bank$rgtxt$, $rgtxt$Digital RuPay$rgtxt$, $rgtxt$RuPay$rgtxt$, $rgtxt$Credit on UPI$rgtxt$, $rgtxt$IDFB-DIGI-RUP-CUPI-001$rgtxt$),
    ($rgtxt$IDFC FIRST Bank$rgtxt$, $rgtxt$WOW! Black$rgtxt$, $rgtxt$RuPay$rgtxt$, $rgtxt$Credit on UPI$rgtxt$, $rgtxt$IDFB-WOWB-RUP-CUPI-001$rgtxt$),
    ($rgtxt$IDFC FIRST Bank$rgtxt$, $rgtxt$Gaj Digital RuPay$rgtxt$, $rgtxt$RuPay$rgtxt$, $rgtxt$Credit on UPI$rgtxt$, $rgtxt$IDFB-GAJD-RUP-CUPI-001$rgtxt$),
    ($rgtxt$IDFC FIRST Bank$rgtxt$, $rgtxt$Power$rgtxt$, $rgtxt$RuPay$rgtxt$, $rgtxt$Platinum$rgtxt$, $rgtxt$IDFB-POWE-RUP-PLAT-001$rgtxt$),
    ($rgtxt$IDFC FIRST Bank$rgtxt$, $rgtxt$Power+$rgtxt$, $rgtxt$RuPay$rgtxt$, $rgtxt$Platinum$rgtxt$, $rgtxt$IDFB-POWX-RUP-PLAT-001$rgtxt$),
    ($rgtxt$IDFC FIRST Bank$rgtxt$, $rgtxt$EA₹N$rgtxt$, $rgtxt$RuPay$rgtxt$, $rgtxt$Platinum$rgtxt$, $rgtxt$IDFB-EARN-RUP-PLAT-001$rgtxt$),
    ($rgtxt$IDFC FIRST Bank$rgtxt$, $rgtxt$Fastag$rgtxt$, $rgtxt$RuPay$rgtxt$, $rgtxt$Platinum$rgtxt$, $rgtxt$IDFB-FAST-RUP-PLAT-001$rgtxt$),
    ($rgtxt$IDFC FIRST Bank$rgtxt$, $rgtxt$Hello Cashback$rgtxt$, $rgtxt$RuPay$rgtxt$, $rgtxt$Platinum$rgtxt$, $rgtxt$IDFB-HELC-RUP-PLAT-001$rgtxt$),
    ($rgtxt$IDFC FIRST Bank$rgtxt$, $rgtxt$IndiGo IDFC$rgtxt$, $rgtxt$RuPay$rgtxt$, $rgtxt$Platinum$rgtxt$, $rgtxt$IDFB-INGO-RUP-PLAT-001$rgtxt$),
    ($rgtxt$IDFC FIRST Bank$rgtxt$, $rgtxt$LIC Classic$rgtxt$, $rgtxt$RuPay$rgtxt$, $rgtxt$Platinum$rgtxt$, $rgtxt$IDFB-LICC-RUP-PLAT-001$rgtxt$),
    ($rgtxt$IDFC FIRST Bank$rgtxt$, $rgtxt$LIC Select$rgtxt$, $rgtxt$RuPay$rgtxt$, $rgtxt$Platinum$rgtxt$, $rgtxt$IDFB-LICS-RUP-PLAT-001$rgtxt$),
    ($rgtxt$IDFC FIRST Bank$rgtxt$, $rgtxt$Quantum$rgtxt$, $rgtxt$RuPay$rgtxt$, $rgtxt$Platinum$rgtxt$, $rgtxt$IDFB-QUAN-RUP-PLAT-001$rgtxt$),
    ($rgtxt$IDFC FIRST Bank$rgtxt$, $rgtxt$Corporate$rgtxt$, $rgtxt$Visa$rgtxt$, $rgtxt$Corporate$rgtxt$, $rgtxt$IDFB-CORP-VIS-CORP-001$rgtxt$),
    ($rgtxt$IDFC FIRST Bank$rgtxt$, $rgtxt$Ashva$rgtxt$, $rgtxt$Visa$rgtxt$, $rgtxt$Infinite$rgtxt$, $rgtxt$IDFB-ASHV-VIS-INFI-001$rgtxt$),
    ($rgtxt$IDFC FIRST Bank$rgtxt$, $rgtxt$Diamond Reserve$rgtxt$, $rgtxt$Visa$rgtxt$, $rgtxt$Infinite$rgtxt$, $rgtxt$IDFB-DIAR-VIS-INFI-001$rgtxt$),
    ($rgtxt$IDFC FIRST Bank$rgtxt$, $rgtxt$Private$rgtxt$, $rgtxt$Visa$rgtxt$, $rgtxt$Infinite$rgtxt$, $rgtxt$IDFB-PRIV-VIS-INFI-001$rgtxt$),
    ($rgtxt$IDFC FIRST Bank$rgtxt$, $rgtxt$Wealth$rgtxt$, $rgtxt$Visa$rgtxt$, $rgtxt$Infinite$rgtxt$, $rgtxt$IDFB-WEAL-VIS-INFI-001$rgtxt$),
    ($rgtxt$IDFC FIRST Bank$rgtxt$, $rgtxt$WOW!$rgtxt$, $rgtxt$Visa$rgtxt$, $rgtxt$Infinite$rgtxt$, $rgtxt$IDFB-WOWX-VIS-INFI-001$rgtxt$),
    ($rgtxt$IDFC FIRST Bank$rgtxt$, $rgtxt$Gaj$rgtxt$, $rgtxt$Visa$rgtxt$, $rgtxt$Infinite$rgtxt$, $rgtxt$IDFB-GAJ0-VIS-INFI-001$rgtxt$),
    ($rgtxt$IDFC FIRST Bank$rgtxt$, $rgtxt$Mayura$rgtxt$, $rgtxt$Visa$rgtxt$, $rgtxt$Infinite$rgtxt$, $rgtxt$IDFB-MAYU-VIS-INFI-001$rgtxt$),
    ($rgtxt$IDFC FIRST Bank$rgtxt$, $rgtxt$Business Multiplier$rgtxt$, $rgtxt$Visa$rgtxt$, $rgtxt$Platinum$rgtxt$, $rgtxt$IDFB-BMUL-VIS-PLAT-001$rgtxt$),
    ($rgtxt$IDFC FIRST Bank$rgtxt$, $rgtxt$Millennia$rgtxt$, $rgtxt$Visa$rgtxt$, $rgtxt$Platinum$rgtxt$, $rgtxt$IDFB-MILL-VIS-PLAT-001$rgtxt$),
    ($rgtxt$IDFC FIRST Bank$rgtxt$, $rgtxt$Classic$rgtxt$, $rgtxt$Visa$rgtxt$, $rgtxt$Platinum$rgtxt$, $rgtxt$IDFB-CLAS-VIS-PLAT-001$rgtxt$),
    ($rgtxt$IDFC FIRST Bank$rgtxt$, $rgtxt$Business$rgtxt$, $rgtxt$Visa$rgtxt$, $rgtxt$Platinum$rgtxt$, $rgtxt$IDFB-BUSI-VIS-PLAT-001$rgtxt$),
    ($rgtxt$IDFC FIRST Bank$rgtxt$, $rgtxt$Purchase$rgtxt$, $rgtxt$Visa$rgtxt$, $rgtxt$Purchasing$rgtxt$, $rgtxt$IDFB-PURC-VIS-PURC-001$rgtxt$),
    ($rgtxt$IDFC FIRST Bank$rgtxt$, $rgtxt$Business Max$rgtxt$, $rgtxt$Visa$rgtxt$, $rgtxt$Signature$rgtxt$, $rgtxt$IDFB-BMAX-VIS-SIGN-001$rgtxt$),
    ($rgtxt$IDFC FIRST Bank$rgtxt$, $rgtxt$Select$rgtxt$, $rgtxt$Visa$rgtxt$, $rgtxt$Signature$rgtxt$, $rgtxt$IDFB-SELE-VIS-SIGN-001$rgtxt$),
    ($rgtxt$Kotak Mahindra Bank$rgtxt$, $rgtxt$Privy League Signature$rgtxt$, $rgtxt$Mastercard$rgtxt$, $rgtxt$Signature$rgtxt$, $rgtxt$KOTA-PRIS-MST-SIGN-001$rgtxt$),
    ($rgtxt$Kotak Mahindra Bank$rgtxt$, $rgtxt$UPI RuPay$rgtxt$, $rgtxt$RuPay$rgtxt$, $rgtxt$Credit on UPI$rgtxt$, $rgtxt$KOTA-UPI0-RUP-CUPI-001$rgtxt$),
    ($rgtxt$Kotak Mahindra Bank$rgtxt$, $rgtxt$IndiGo$rgtxt$, $rgtxt$RuPay$rgtxt$, $rgtxt$Platinum$rgtxt$, $rgtxt$KOTA-INGO-RUP-PLAT-001$rgtxt$),
    ($rgtxt$Kotak Mahindra Bank$rgtxt$, $rgtxt$IndianOil$rgtxt$, $rgtxt$RuPay$rgtxt$, $rgtxt$Platinum$rgtxt$, $rgtxt$KOTA-INDL-RUP-PLAT-001$rgtxt$),
    ($rgtxt$Kotak Mahindra Bank$rgtxt$, $rgtxt$Kotak811 Super Money$rgtxt$, $rgtxt$RuPay$rgtxt$, $rgtxt$Platinum$rgtxt$, $rgtxt$KOTA-811S-RUP-PLAT-001$rgtxt$),
    ($rgtxt$Kotak Mahindra Bank$rgtxt$, $rgtxt$Cashback+$rgtxt$, $rgtxt$RuPay$rgtxt$, $rgtxt$Platinum$rgtxt$, $rgtxt$KOTA-CASX-RUP-PLAT-001$rgtxt$),
    ($rgtxt$Kotak Mahindra Bank$rgtxt$, $rgtxt$Biz Edge$rgtxt$, $rgtxt$RuPay$rgtxt$, $rgtxt$Platinum$rgtxt$, $rgtxt$KOTA-BIZE-RUP-PLAT-001$rgtxt$),
    ($rgtxt$Kotak Mahindra Bank$rgtxt$, $rgtxt$League Platinum$rgtxt$, $rgtxt$RuPay$rgtxt$, $rgtxt$Platinum$rgtxt$, $rgtxt$KOTA-LEAP-RUP-PLAT-001$rgtxt$),
    ($rgtxt$Kotak Mahindra Bank$rgtxt$, $rgtxt$IndiGo XL$rgtxt$, $rgtxt$RuPay$rgtxt$, $rgtxt$Select$rgtxt$, $rgtxt$KOTA-INGL-RUP-SELC-001$rgtxt$),
    ($rgtxt$Kotak Mahindra Bank$rgtxt$, $rgtxt$IndiGo Premium$rgtxt$, $rgtxt$RuPay$rgtxt$, $rgtxt$Select$rgtxt$, $rgtxt$KOTA-INGP-RUP-SELC-001$rgtxt$),
    ($rgtxt$Kotak Mahindra Bank$rgtxt$, $rgtxt$Cashback+ Prime$rgtxt$, $rgtxt$RuPay$rgtxt$, $rgtxt$Select$rgtxt$, $rgtxt$KOTA-CASP-RUP-SELC-001$rgtxt$),
    ($rgtxt$Kotak Mahindra Bank$rgtxt$, $rgtxt$Amazon Pay Business$rgtxt$, $rgtxt$Visa$rgtxt$, $rgtxt$Business$rgtxt$, $rgtxt$KOTA-AMAB-VIS-BUSN-001$rgtxt$),
    ($rgtxt$Kotak Mahindra Bank$rgtxt$, $rgtxt$Biz$rgtxt$, $rgtxt$Visa$rgtxt$, $rgtxt$Business$rgtxt$, $rgtxt$KOTA-BIZ0-VIS-BUSN-001$rgtxt$),
    ($rgtxt$Kotak Mahindra Bank$rgtxt$, $rgtxt$Purchase$rgtxt$, $rgtxt$Visa$rgtxt$, $rgtxt$Business$rgtxt$, $rgtxt$KOTA-PURC-VIS-BUSN-001$rgtxt$),
    ($rgtxt$Kotak Mahindra Bank$rgtxt$, $rgtxt$Biz Edge$rgtxt$, $rgtxt$Visa$rgtxt$, $rgtxt$Business$rgtxt$, $rgtxt$KOTA-BIZE-VIS-BUSN-001$rgtxt$),
    ($rgtxt$Kotak Mahindra Bank$rgtxt$, $rgtxt$Solitaire Business$rgtxt$, $rgtxt$Visa$rgtxt$, $rgtxt$Business$rgtxt$, $rgtxt$KOTA-SOLB-VIS-BUSN-001$rgtxt$),
    ($rgtxt$Kotak Mahindra Bank$rgtxt$, $rgtxt$811$rgtxt$, $rgtxt$Visa$rgtxt$, $rgtxt$Classic$rgtxt$, $rgtxt$KOTA-8110-VIS-CLAS-001$rgtxt$),
    ($rgtxt$Kotak Mahindra Bank$rgtxt$, $rgtxt$Corporate Platinum$rgtxt$, $rgtxt$Visa$rgtxt$, $rgtxt$Corporate Platinum$rgtxt$, $rgtxt$KOTA-CORM-VIS-CPLT-001$rgtxt$),
    ($rgtxt$Kotak Mahindra Bank$rgtxt$, $rgtxt$Purchase$rgtxt$, $rgtxt$Visa$rgtxt$, $rgtxt$Corporate$rgtxt$, $rgtxt$KOTA-PURC-VIS-CORP-001$rgtxt$),
    ($rgtxt$Kotak Mahindra Bank$rgtxt$, $rgtxt$Corporate Gold$rgtxt$, $rgtxt$Visa$rgtxt$, $rgtxt$Gold$rgtxt$, $rgtxt$KOTA-CORG-VIS-GOLD-001$rgtxt$),
    ($rgtxt$Kotak Mahindra Bank$rgtxt$, $rgtxt$PVR Gold$rgtxt$, $rgtxt$Visa$rgtxt$, $rgtxt$Gold$rgtxt$, $rgtxt$KOTA-PVRG-VIS-GOLD-001$rgtxt$),
    ($rgtxt$Kotak Mahindra Bank$rgtxt$, $rgtxt$PVR$rgtxt$, $rgtxt$Visa$rgtxt$, $rgtxt$Gold$rgtxt$, $rgtxt$KOTA-PVR0-VIS-GOLD-001$rgtxt$),
    ($rgtxt$Kotak Mahindra Bank$rgtxt$, $rgtxt$Urbane Gold$rgtxt$, $rgtxt$Visa$rgtxt$, $rgtxt$Gold$rgtxt$, $rgtxt$KOTA-URBG-VIS-GOLD-001$rgtxt$),
    ($rgtxt$Kotak Mahindra Bank$rgtxt$, $rgtxt$Solitaire$rgtxt$, $rgtxt$Visa$rgtxt$, $rgtxt$Infinite$rgtxt$, $rgtxt$KOTA-SOLI-VIS-INFI-001$rgtxt$),
    ($rgtxt$Kotak Mahindra Bank$rgtxt$, $rgtxt$Infinite$rgtxt$, $rgtxt$Visa$rgtxt$, $rgtxt$Infinite$rgtxt$, $rgtxt$KOTA-INFE-VIS-INFI-001$rgtxt$),
    ($rgtxt$Kotak Mahindra Bank$rgtxt$, $rgtxt$Private$rgtxt$, $rgtxt$Visa$rgtxt$, $rgtxt$Infinite$rgtxt$, $rgtxt$KOTA-PRIV-VIS-INFI-001$rgtxt$),
    ($rgtxt$Kotak Mahindra Bank$rgtxt$, $rgtxt$Solitaire Business$rgtxt$, $rgtxt$Visa$rgtxt$, $rgtxt$Infinite$rgtxt$, $rgtxt$KOTA-SOLB-VIS-INFI-001$rgtxt$),
    ($rgtxt$Kotak Mahindra Bank$rgtxt$, $rgtxt$White Reserve$rgtxt$, $rgtxt$Visa$rgtxt$, $rgtxt$Infinite$rgtxt$, $rgtxt$KOTA-WHIR-VIS-INFI-001$rgtxt$),
    ($rgtxt$Kotak Mahindra Bank$rgtxt$, $rgtxt$811 Dream Different$rgtxt$, $rgtxt$Visa$rgtxt$, $rgtxt$Platinum$rgtxt$, $rgtxt$KOTA-811D-VIS-PLAT-001$rgtxt$),
    ($rgtxt$Kotak Mahindra Bank$rgtxt$, $rgtxt$IndiGo$rgtxt$, $rgtxt$Visa$rgtxt$, $rgtxt$Platinum$rgtxt$, $rgtxt$KOTA-INGO-VIS-PLAT-001$rgtxt$),
    ($rgtxt$Kotak Mahindra Bank$rgtxt$, $rgtxt$IndianOil$rgtxt$, $rgtxt$Visa$rgtxt$, $rgtxt$Platinum$rgtxt$, $rgtxt$KOTA-INDL-VIS-PLAT-001$rgtxt$),
    ($rgtxt$Kotak Mahindra Bank$rgtxt$, $rgtxt$Air$rgtxt$, $rgtxt$Visa$rgtxt$, $rgtxt$Platinum$rgtxt$, $rgtxt$KOTA-AIR0-VIS-PLAT-001$rgtxt$),
    ($rgtxt$Kotak Mahindra Bank$rgtxt$, $rgtxt$811$rgtxt$, $rgtxt$Visa$rgtxt$, $rgtxt$Platinum$rgtxt$, $rgtxt$KOTA-8110-VIS-PLAT-001$rgtxt$),
    ($rgtxt$Kotak Mahindra Bank$rgtxt$, $rgtxt$Cashback+$rgtxt$, $rgtxt$Visa$rgtxt$, $rgtxt$Platinum$rgtxt$, $rgtxt$KOTA-CASX-VIS-PLAT-001$rgtxt$),
    ($rgtxt$Kotak Mahindra Bank$rgtxt$, $rgtxt$League Platinum$rgtxt$, $rgtxt$Visa$rgtxt$, $rgtxt$Platinum$rgtxt$, $rgtxt$KOTA-LEAP-VIS-PLAT-001$rgtxt$),
    ($rgtxt$Kotak Mahindra Bank$rgtxt$, $rgtxt$Mojo Platinum$rgtxt$, $rgtxt$Visa$rgtxt$, $rgtxt$Platinum$rgtxt$, $rgtxt$KOTA-MOJP-VIS-PLAT-001$rgtxt$),
    ($rgtxt$Kotak Mahindra Bank$rgtxt$, $rgtxt$PVR INOX$rgtxt$, $rgtxt$Visa$rgtxt$, $rgtxt$Platinum$rgtxt$, $rgtxt$KOTA-PVRI-VIS-PLAT-001$rgtxt$),
    ($rgtxt$Kotak Mahindra Bank$rgtxt$, $rgtxt$PVR Platinum$rgtxt$, $rgtxt$Visa$rgtxt$, $rgtxt$Platinum$rgtxt$, $rgtxt$KOTA-PVRP-VIS-PLAT-001$rgtxt$),
    ($rgtxt$Kotak Mahindra Bank$rgtxt$, $rgtxt$PVR$rgtxt$, $rgtxt$Visa$rgtxt$, $rgtxt$Platinum$rgtxt$, $rgtxt$KOTA-PVR0-VIS-PLAT-001$rgtxt$),
    ($rgtxt$Kotak Mahindra Bank$rgtxt$, $rgtxt$Corporate Wealth Signature$rgtxt$, $rgtxt$Visa$rgtxt$, $rgtxt$Signature$rgtxt$, $rgtxt$KOTA-CORS-VIS-SIGN-001$rgtxt$),
    ($rgtxt$Kotak Mahindra Bank$rgtxt$, $rgtxt$IndiGo XL$rgtxt$, $rgtxt$Visa$rgtxt$, $rgtxt$Signature$rgtxt$, $rgtxt$KOTA-INGL-VIS-SIGN-001$rgtxt$),
    ($rgtxt$Kotak Mahindra Bank$rgtxt$, $rgtxt$IndiGo Premium$rgtxt$, $rgtxt$Visa$rgtxt$, $rgtxt$Signature$rgtxt$, $rgtxt$KOTA-INGP-VIS-SIGN-001$rgtxt$),
    ($rgtxt$Kotak Mahindra Bank$rgtxt$, $rgtxt$Air+$rgtxt$, $rgtxt$Visa$rgtxt$, $rgtxt$Signature$rgtxt$, $rgtxt$KOTA-AIRX-VIS-SIGN-001$rgtxt$),
    ($rgtxt$Kotak Mahindra Bank$rgtxt$, $rgtxt$Air+ Prime$rgtxt$, $rgtxt$Visa$rgtxt$, $rgtxt$Signature$rgtxt$, $rgtxt$KOTA-AIRP-VIS-SIGN-001$rgtxt$),
    ($rgtxt$Kotak Mahindra Bank$rgtxt$, $rgtxt$Cashback+ Prime$rgtxt$, $rgtxt$Visa$rgtxt$, $rgtxt$Signature$rgtxt$, $rgtxt$KOTA-CASP-VIS-SIGN-001$rgtxt$),
    ($rgtxt$Kotak Mahindra Bank$rgtxt$, $rgtxt$NRI Royale Signature$rgtxt$, $rgtxt$Visa$rgtxt$, $rgtxt$Signature$rgtxt$, $rgtxt$KOTA-NRIR-VIS-SIGN-001$rgtxt$),
    ($rgtxt$Kotak Mahindra Bank$rgtxt$, $rgtxt$Privy League Signature$rgtxt$, $rgtxt$Visa$rgtxt$, $rgtxt$Signature$rgtxt$, $rgtxt$KOTA-PRIS-VIS-SIGN-001$rgtxt$),
    ($rgtxt$Kotak Mahindra Bank$rgtxt$, $rgtxt$Royale Signature$rgtxt$, $rgtxt$Visa$rgtxt$, $rgtxt$Signature$rgtxt$, $rgtxt$KOTA-ROYS-VIS-SIGN-001$rgtxt$),
    ($rgtxt$Kotak Mahindra Bank$rgtxt$, $rgtxt$White$rgtxt$, $rgtxt$Visa$rgtxt$, $rgtxt$Signature$rgtxt$, $rgtxt$KOTA-WHIT-VIS-SIGN-001$rgtxt$),
    ($rgtxt$Kotak Mahindra Bank$rgtxt$, $rgtxt$Zen$rgtxt$, $rgtxt$Visa$rgtxt$, $rgtxt$Signature$rgtxt$, $rgtxt$KOTA-ZEN0-VIS-SIGN-001$rgtxt$),
    ($rgtxt$RBL Bank$rgtxt$, $rgtxt$TVS Credit Gold$rgtxt$, $rgtxt$Mastercard$rgtxt$, $rgtxt$Gold$rgtxt$, $rgtxt$RBLB-TVSG-MST-GOLD-001$rgtxt$),
    ($rgtxt$RBL Bank$rgtxt$, $rgtxt$Apex$rgtxt$, $rgtxt$Mastercard$rgtxt$, $rgtxt$Platinum$rgtxt$, $rgtxt$RBLB-APEX-MST-PLAT-001$rgtxt$),
    ($rgtxt$RBL Bank$rgtxt$, $rgtxt$Binge$rgtxt$, $rgtxt$Mastercard$rgtxt$, $rgtxt$Platinum$rgtxt$, $rgtxt$RBLB-BING-MST-PLAT-001$rgtxt$),
    ($rgtxt$RBL Bank$rgtxt$, $rgtxt$Cookies$rgtxt$, $rgtxt$Mastercard$rgtxt$, $rgtxt$Platinum$rgtxt$, $rgtxt$RBLB-COOK-MST-PLAT-001$rgtxt$),
    ($rgtxt$RBL Bank$rgtxt$, $rgtxt$EasySaver$rgtxt$, $rgtxt$Mastercard$rgtxt$, $rgtxt$Platinum$rgtxt$, $rgtxt$RBLB-EASR-MST-PLAT-001$rgtxt$),
    ($rgtxt$RBL Bank$rgtxt$, $rgtxt$IndianOil XTRA$rgtxt$, $rgtxt$Mastercard$rgtxt$, $rgtxt$Platinum$rgtxt$, $rgtxt$RBLB-IXTR-MST-PLAT-001$rgtxt$),
    ($rgtxt$RBL Bank$rgtxt$, $rgtxt$IndianOil$rgtxt$, $rgtxt$Mastercard$rgtxt$, $rgtxt$Platinum$rgtxt$, $rgtxt$RBLB-INDL-MST-PLAT-001$rgtxt$),
    ($rgtxt$RBL Bank$rgtxt$, $rgtxt$IRCTC$rgtxt$, $rgtxt$Mastercard$rgtxt$, $rgtxt$Platinum$rgtxt$, $rgtxt$RBLB-IRCT-MST-PLAT-001$rgtxt$),
    ($rgtxt$RBL Bank$rgtxt$, $rgtxt$MoCash$rgtxt$, $rgtxt$Mastercard$rgtxt$, $rgtxt$Platinum$rgtxt$, $rgtxt$RBLB-MOCA-MST-PLAT-001$rgtxt$),
    ($rgtxt$RBL Bank$rgtxt$, $rgtxt$Monthly Treats$rgtxt$, $rgtxt$Mastercard$rgtxt$, $rgtxt$Platinum$rgtxt$, $rgtxt$RBLB-MONT-MST-PLAT-001$rgtxt$),
    ($rgtxt$RBL Bank$rgtxt$, $rgtxt$MyFirst$rgtxt$, $rgtxt$Mastercard$rgtxt$, $rgtxt$Platinum$rgtxt$, $rgtxt$RBLB-MYFI-MST-PLAT-001$rgtxt$),
    ($rgtxt$RBL Bank$rgtxt$, $rgtxt$Platinum Maxima$rgtxt$, $rgtxt$Mastercard$rgtxt$, $rgtxt$Platinum$rgtxt$, $rgtxt$RBLB-PTMI-MST-PLAT-001$rgtxt$),
    ($rgtxt$RBL Bank$rgtxt$, $rgtxt$Platinum Delight$rgtxt$, $rgtxt$Mastercard$rgtxt$, $rgtxt$Platinum$rgtxt$, $rgtxt$RBLB-PTDE-MST-PLAT-001$rgtxt$),
    ($rgtxt$RBL Bank$rgtxt$, $rgtxt$Platinum LifeEasy$rgtxt$, $rgtxt$Mastercard$rgtxt$, $rgtxt$Platinum$rgtxt$, $rgtxt$RBLB-PTLE-MST-PLAT-001$rgtxt$),
    ($rgtxt$RBL Bank$rgtxt$, $rgtxt$Platinum Edge$rgtxt$, $rgtxt$Mastercard$rgtxt$, $rgtxt$Platinum$rgtxt$, $rgtxt$RBLB-PTED-MST-PLAT-001$rgtxt$),
    ($rgtxt$RBL Bank$rgtxt$, $rgtxt$Platinum ShopDaily$rgtxt$, $rgtxt$Mastercard$rgtxt$, $rgtxt$Platinum$rgtxt$, $rgtxt$RBLB-PTSD-MST-PLAT-001$rgtxt$),
    ($rgtxt$RBL Bank$rgtxt$, $rgtxt$Platinum Plus$rgtxt$, $rgtxt$Mastercard$rgtxt$, $rgtxt$Platinum$rgtxt$, $rgtxt$RBLB-PTPX-MST-PLAT-001$rgtxt$),
    ($rgtxt$RBL Bank$rgtxt$, $rgtxt$Platinum TravelEasy$rgtxt$, $rgtxt$Mastercard$rgtxt$, $rgtxt$Platinum$rgtxt$, $rgtxt$RBLB-PTTE-MST-PLAT-001$rgtxt$),
    ($rgtxt$RBL Bank$rgtxt$, $rgtxt$Platinum ShopSmart$rgtxt$, $rgtxt$Mastercard$rgtxt$, $rgtxt$Platinum$rgtxt$, $rgtxt$RBLB-PTSS-MST-PLAT-001$rgtxt$),
    ($rgtxt$RBL Bank$rgtxt$, $rgtxt$Platinum ValuePlus$rgtxt$, $rgtxt$Mastercard$rgtxt$, $rgtxt$Platinum$rgtxt$, $rgtxt$RBLB-PTVX-MST-PLAT-001$rgtxt$),
    ($rgtxt$RBL Bank$rgtxt$, $rgtxt$Platinum Max$rgtxt$, $rgtxt$Mastercard$rgtxt$, $rgtxt$Platinum$rgtxt$, $rgtxt$RBLB-PTMA-MST-PLAT-001$rgtxt$),
    ($rgtxt$RBL Bank$rgtxt$, $rgtxt$Platinum Classic$rgtxt$, $rgtxt$Mastercard$rgtxt$, $rgtxt$Platinum$rgtxt$, $rgtxt$RBLB-PTCL-MST-PLAT-001$rgtxt$),
    ($rgtxt$RBL Bank$rgtxt$, $rgtxt$Platinum Prime$rgtxt$, $rgtxt$Mastercard$rgtxt$, $rgtxt$Platinum$rgtxt$, $rgtxt$RBLB-PTPR-MST-PLAT-001$rgtxt$),
    ($rgtxt$RBL Bank$rgtxt$, $rgtxt$Platinum Bonus$rgtxt$, $rgtxt$Mastercard$rgtxt$, $rgtxt$Platinum$rgtxt$, $rgtxt$RBLB-PTBO-MST-PLAT-001$rgtxt$),
    ($rgtxt$RBL Bank$rgtxt$, $rgtxt$Platinum Shopgain$rgtxt$, $rgtxt$Mastercard$rgtxt$, $rgtxt$Platinum$rgtxt$, $rgtxt$RBLB-PTSG-MST-PLAT-001$rgtxt$),
    ($rgtxt$RBL Bank$rgtxt$, $rgtxt$Platinum Advantage$rgtxt$, $rgtxt$Mastercard$rgtxt$, $rgtxt$Platinum$rgtxt$, $rgtxt$RBLB-PTAD-MST-PLAT-001$rgtxt$),
    ($rgtxt$RBL Bank$rgtxt$, $rgtxt$Platinum Choice$rgtxt$, $rgtxt$Mastercard$rgtxt$, $rgtxt$Platinum$rgtxt$, $rgtxt$RBLB-PTCH-MST-PLAT-001$rgtxt$),
    ($rgtxt$RBL Bank$rgtxt$, $rgtxt$Play$rgtxt$, $rgtxt$Mastercard$rgtxt$, $rgtxt$Platinum$rgtxt$, $rgtxt$RBLB-PLAY-MST-PLAT-001$rgtxt$),
    ($rgtxt$RBL Bank$rgtxt$, $rgtxt$DMI Finance$rgtxt$, $rgtxt$Mastercard$rgtxt$, $rgtxt$Platinum$rgtxt$, $rgtxt$RBLB-DMIF-MST-PLAT-001$rgtxt$),
    ($rgtxt$RBL Bank$rgtxt$, $rgtxt$Bankbazaar SaveMax$rgtxt$, $rgtxt$Mastercard$rgtxt$, $rgtxt$Platinum$rgtxt$, $rgtxt$RBLB-BANS-MST-PLAT-001$rgtxt$),
    ($rgtxt$RBL Bank$rgtxt$, $rgtxt$Bankbazaar SaveMax Pro$rgtxt$, $rgtxt$Mastercard$rgtxt$, $rgtxt$Platinum$rgtxt$, $rgtxt$RBLB-BANP-MST-PLAT-001$rgtxt$),
    ($rgtxt$RBL Bank$rgtxt$, $rgtxt$MoneyTap$rgtxt$, $rgtxt$Mastercard$rgtxt$, $rgtxt$Platinum$rgtxt$, $rgtxt$RBLB-MONP-MST-PLAT-001$rgtxt$),
    ($rgtxt$RBL Bank$rgtxt$, $rgtxt$Paisabazaar Duet$rgtxt$, $rgtxt$Mastercard$rgtxt$, $rgtxt$Platinum$rgtxt$, $rgtxt$RBLB-PAID-MST-PLAT-001$rgtxt$),
    ($rgtxt$RBL Bank$rgtxt$, $rgtxt$Paisabazaar Duet Plus$rgtxt$, $rgtxt$Mastercard$rgtxt$, $rgtxt$Platinum$rgtxt$, $rgtxt$RBLB-PAIX-MST-PLAT-001$rgtxt$),
    ($rgtxt$RBL Bank$rgtxt$, $rgtxt$Popcorn$rgtxt$, $rgtxt$Mastercard$rgtxt$, $rgtxt$Platinum$rgtxt$, $rgtxt$RBLB-POPC-MST-PLAT-001$rgtxt$),
    ($rgtxt$RBL Bank$rgtxt$, $rgtxt$Movies and More$rgtxt$, $rgtxt$Mastercard$rgtxt$, $rgtxt$Platinum$rgtxt$, $rgtxt$RBLB-MOVM-MST-PLAT-001$rgtxt$),
    ($rgtxt$RBL Bank$rgtxt$, $rgtxt$Blockbuster$rgtxt$, $rgtxt$Mastercard$rgtxt$, $rgtxt$Platinum$rgtxt$, $rgtxt$RBLB-BLOC-MST-PLAT-001$rgtxt$),
    ($rgtxt$RBL Bank$rgtxt$, $rgtxt$Fun+$rgtxt$, $rgtxt$Mastercard$rgtxt$, $rgtxt$Platinum$rgtxt$, $rgtxt$RBLB-FUNX-MST-PLAT-001$rgtxt$),
    ($rgtxt$RBL Bank$rgtxt$, $rgtxt$Shoprite$rgtxt$, $rgtxt$Mastercard$rgtxt$, $rgtxt$Platinum$rgtxt$, $rgtxt$RBLB-SHOR-MST-PLAT-001$rgtxt$),
    ($rgtxt$RBL Bank$rgtxt$, $rgtxt$TVS Credit$rgtxt$, $rgtxt$Mastercard$rgtxt$, $rgtxt$Platinum$rgtxt$, $rgtxt$RBLB-TVSC-MST-PLAT-001$rgtxt$),
    ($rgtxt$RBL Bank$rgtxt$, $rgtxt$Titanium Delight$rgtxt$, $rgtxt$Mastercard$rgtxt$, $rgtxt$Titanium$rgtxt$, $rgtxt$RBLB-TITD-MST-TITN-001$rgtxt$),
    ($rgtxt$RBL Bank$rgtxt$, $rgtxt$Aspire Banking$rgtxt$, $rgtxt$Mastercard$rgtxt$, $rgtxt$World$rgtxt$, $rgtxt$RBLB-ASPB-MST-WRLD-001$rgtxt$),
    ($rgtxt$RBL Bank$rgtxt$, $rgtxt$Icon$rgtxt$, $rgtxt$Mastercard$rgtxt$, $rgtxt$World$rgtxt$, $rgtxt$RBLB-ICON-MST-WRLD-001$rgtxt$),
    ($rgtxt$RBL Bank$rgtxt$, $rgtxt$Insignia Preferred Banking$rgtxt$, $rgtxt$Mastercard$rgtxt$, $rgtxt$World$rgtxt$, $rgtxt$RBLB-INSB-MST-WRLD-001$rgtxt$),
    ($rgtxt$RBL Bank$rgtxt$, $rgtxt$Lumière$rgtxt$, $rgtxt$Mastercard$rgtxt$, $rgtxt$World Elite$rgtxt$, $rgtxt$RBLB-LUMI-MST-WELT-001$rgtxt$),
    ($rgtxt$RBL Bank$rgtxt$, $rgtxt$Nova$rgtxt$, $rgtxt$Mastercard$rgtxt$, $rgtxt$World$rgtxt$, $rgtxt$RBLB-NOVA-MST-WRLD-001$rgtxt$),
    ($rgtxt$RBL Bank$rgtxt$, $rgtxt$iGlobe$rgtxt$, $rgtxt$Mastercard$rgtxt$, $rgtxt$World$rgtxt$, $rgtxt$RBLB-IGLO-MST-WRLD-001$rgtxt$),
    ($rgtxt$RBL Bank$rgtxt$, $rgtxt$MoneyTap Black$rgtxt$, $rgtxt$Mastercard$rgtxt$, $rgtxt$World$rgtxt$, $rgtxt$RBLB-MONB-MST-WRLD-001$rgtxt$),
    ($rgtxt$RBL Bank$rgtxt$, $rgtxt$Signature Banking$rgtxt$, $rgtxt$Mastercard$rgtxt$, $rgtxt$World$rgtxt$, $rgtxt$RBLB-SIGB-MST-WRLD-001$rgtxt$),
    ($rgtxt$RBL Bank$rgtxt$, $rgtxt$World Safari Plus$rgtxt$, $rgtxt$Mastercard$rgtxt$, $rgtxt$World$rgtxt$, $rgtxt$RBLB-WOSX-MST-WRLD-001$rgtxt$),
    ($rgtxt$RBL Bank$rgtxt$, $rgtxt$World Safari Lite$rgtxt$, $rgtxt$Mastercard$rgtxt$, $rgtxt$World$rgtxt$, $rgtxt$RBLB-WOSL-MST-WRLD-001$rgtxt$),
    ($rgtxt$RBL Bank$rgtxt$, $rgtxt$World Safari$rgtxt$, $rgtxt$Mastercard$rgtxt$, $rgtxt$World$rgtxt$, $rgtxt$RBLB-WOSA-MST-WRLD-001$rgtxt$),
    ($rgtxt$RBL Bank$rgtxt$, $rgtxt$World Prime$rgtxt$, $rgtxt$Mastercard$rgtxt$, $rgtxt$World$rgtxt$, $rgtxt$RBLB-WOPR-MST-WRLD-001$rgtxt$),
    ($rgtxt$RBL Bank$rgtxt$, $rgtxt$World Max$rgtxt$, $rgtxt$Mastercard$rgtxt$, $rgtxt$World$rgtxt$, $rgtxt$RBLB-WOMA-MST-WRLD-001$rgtxt$),
    ($rgtxt$RBL Bank$rgtxt$, $rgtxt$World Plus$rgtxt$, $rgtxt$Mastercard$rgtxt$, $rgtxt$World$rgtxt$, $rgtxt$RBLB-WOPX-MST-WRLD-001$rgtxt$),
    ($rgtxt$RBL Bank$rgtxt$, $rgtxt$QuickPay$rgtxt$, $rgtxt$RuPay$rgtxt$, $rgtxt$Credit on UPI$rgtxt$, $rgtxt$RBLB-QUIC-RUP-CUPI-001$rgtxt$),
    ($rgtxt$RBL Bank$rgtxt$, $rgtxt$SalarySe UP$rgtxt$, $rgtxt$RuPay$rgtxt$, $rgtxt$Credit on UPI$rgtxt$, $rgtxt$RBLB-SALU-RUP-CUPI-001$rgtxt$),
    ($rgtxt$RBL Bank$rgtxt$, $rgtxt$IndianOil XTRA$rgtxt$, $rgtxt$RuPay$rgtxt$, $rgtxt$Platinum$rgtxt$, $rgtxt$RBLB-IXTR-RUP-PLAT-001$rgtxt$),
    ($rgtxt$RBL Bank$rgtxt$, $rgtxt$IndianOil$rgtxt$, $rgtxt$RuPay$rgtxt$, $rgtxt$Platinum$rgtxt$, $rgtxt$RBLB-INDL-RUP-PLAT-001$rgtxt$),
    ($rgtxt$RBL Bank$rgtxt$, $rgtxt$IRCTC$rgtxt$, $rgtxt$RuPay$rgtxt$, $rgtxt$Platinum$rgtxt$, $rgtxt$RBLB-IRCT-RUP-PLAT-001$rgtxt$),
    ($rgtxt$RBL Bank$rgtxt$, $rgtxt$Jalsa$rgtxt$, $rgtxt$RuPay$rgtxt$, $rgtxt$Platinum$rgtxt$, $rgtxt$RBLB-JALS-RUP-PLAT-001$rgtxt$),
    ($rgtxt$RBL Bank$rgtxt$, $rgtxt$Patanjali Vishisht$rgtxt$, $rgtxt$RuPay$rgtxt$, $rgtxt$Platinum$rgtxt$, $rgtxt$RBLB-PATV-RUP-PLAT-001$rgtxt$),
    ($rgtxt$RBL Bank$rgtxt$, $rgtxt$TVS Credit Gold$rgtxt$, $rgtxt$RuPay$rgtxt$, $rgtxt$Platinum$rgtxt$, $rgtxt$RBLB-TVSG-RUP-PLAT-001$rgtxt$),
    ($rgtxt$RBL Bank$rgtxt$, $rgtxt$TVS Credit$rgtxt$, $rgtxt$RuPay$rgtxt$, $rgtxt$Platinum$rgtxt$, $rgtxt$RBLB-TVSC-RUP-PLAT-001$rgtxt$),
    ($rgtxt$RBL Bank$rgtxt$, $rgtxt$Patanjali Swarn$rgtxt$, $rgtxt$RuPay$rgtxt$, $rgtxt$Select$rgtxt$, $rgtxt$RBLB-PATS-RUP-SELC-001$rgtxt$),
    ($rgtxt$RBL Bank$rgtxt$, $rgtxt$Shoppers Stop Gold$rgtxt$, $rgtxt$Visa$rgtxt$, $rgtxt$Gold$rgtxt$, $rgtxt$RBLB-SHOG-VIS-GOLD-001$rgtxt$),
    ($rgtxt$RBL Bank$rgtxt$, $rgtxt$Insignia Preferred Banking$rgtxt$, $rgtxt$Visa$rgtxt$, $rgtxt$Infinite$rgtxt$, $rgtxt$RBLB-INSB-VIS-INFI-001$rgtxt$),
    ($rgtxt$RBL Bank$rgtxt$, $rgtxt$Lumière$rgtxt$, $rgtxt$Visa$rgtxt$, $rgtxt$Infinite$rgtxt$, $rgtxt$RBLB-LUMI-VIS-INFI-001$rgtxt$),
    ($rgtxt$RBL Bank$rgtxt$, $rgtxt$Binge$rgtxt$, $rgtxt$Visa$rgtxt$, $rgtxt$Platinum$rgtxt$, $rgtxt$RBLB-BING-VIS-PLAT-001$rgtxt$),
    ($rgtxt$RBL Bank$rgtxt$, $rgtxt$Cookies$rgtxt$, $rgtxt$Visa$rgtxt$, $rgtxt$Platinum$rgtxt$, $rgtxt$RBLB-COOK-VIS-PLAT-001$rgtxt$),
    ($rgtxt$RBL Bank$rgtxt$, $rgtxt$EasySaver$rgtxt$, $rgtxt$Visa$rgtxt$, $rgtxt$Platinum$rgtxt$, $rgtxt$RBLB-EASR-VIS-PLAT-001$rgtxt$),
    ($rgtxt$RBL Bank$rgtxt$, $rgtxt$Icon$rgtxt$, $rgtxt$Visa$rgtxt$, $rgtxt$Platinum$rgtxt$, $rgtxt$RBLB-ICON-VIS-PLAT-001$rgtxt$),
    ($rgtxt$RBL Bank$rgtxt$, $rgtxt$MoCash$rgtxt$, $rgtxt$Visa$rgtxt$, $rgtxt$Platinum$rgtxt$, $rgtxt$RBLB-MOCA-VIS-PLAT-001$rgtxt$),
    ($rgtxt$RBL Bank$rgtxt$, $rgtxt$Monthly Treats$rgtxt$, $rgtxt$Visa$rgtxt$, $rgtxt$Platinum$rgtxt$, $rgtxt$RBLB-MONT-VIS-PLAT-001$rgtxt$),
    ($rgtxt$RBL Bank$rgtxt$, $rgtxt$MyFirst$rgtxt$, $rgtxt$Visa$rgtxt$, $rgtxt$Platinum$rgtxt$, $rgtxt$RBLB-MYFI-VIS-PLAT-001$rgtxt$),
    ($rgtxt$RBL Bank$rgtxt$, $rgtxt$Platinum Maxima Plus$rgtxt$, $rgtxt$Visa$rgtxt$, $rgtxt$Platinum$rgtxt$, $rgtxt$RBLB-PTMX-VIS-PLAT-001$rgtxt$),
    ($rgtxt$RBL Bank$rgtxt$, $rgtxt$Platinum Delight$rgtxt$, $rgtxt$Visa$rgtxt$, $rgtxt$Platinum$rgtxt$, $rgtxt$RBLB-PTDE-VIS-PLAT-001$rgtxt$),
    ($rgtxt$RBL Bank$rgtxt$, $rgtxt$Platinum LifeEasy$rgtxt$, $rgtxt$Visa$rgtxt$, $rgtxt$Platinum$rgtxt$, $rgtxt$RBLB-PTLE-VIS-PLAT-001$rgtxt$),
    ($rgtxt$RBL Bank$rgtxt$, $rgtxt$Platinum Edge$rgtxt$, $rgtxt$Visa$rgtxt$, $rgtxt$Platinum$rgtxt$, $rgtxt$RBLB-PTED-VIS-PLAT-001$rgtxt$),
    ($rgtxt$RBL Bank$rgtxt$, $rgtxt$Platinum ShopDaily$rgtxt$, $rgtxt$Visa$rgtxt$, $rgtxt$Platinum$rgtxt$, $rgtxt$RBLB-PTSD-VIS-PLAT-001$rgtxt$),
    ($rgtxt$RBL Bank$rgtxt$, $rgtxt$Platinum Plus$rgtxt$, $rgtxt$Visa$rgtxt$, $rgtxt$Platinum$rgtxt$, $rgtxt$RBLB-PTPX-VIS-PLAT-001$rgtxt$),
    ($rgtxt$RBL Bank$rgtxt$, $rgtxt$Platinum TravelEasy$rgtxt$, $rgtxt$Visa$rgtxt$, $rgtxt$Platinum$rgtxt$, $rgtxt$RBLB-PTTE-VIS-PLAT-001$rgtxt$),
    ($rgtxt$RBL Bank$rgtxt$, $rgtxt$Platinum ShopSmart$rgtxt$, $rgtxt$Visa$rgtxt$, $rgtxt$Platinum$rgtxt$, $rgtxt$RBLB-PTSS-VIS-PLAT-001$rgtxt$),
    ($rgtxt$RBL Bank$rgtxt$, $rgtxt$Platinum ValuePlus$rgtxt$, $rgtxt$Visa$rgtxt$, $rgtxt$Platinum$rgtxt$, $rgtxt$RBLB-PTVX-VIS-PLAT-001$rgtxt$),
    ($rgtxt$RBL Bank$rgtxt$, $rgtxt$Platinum Shopgain$rgtxt$, $rgtxt$Visa$rgtxt$, $rgtxt$Platinum$rgtxt$, $rgtxt$RBLB-PTSG-VIS-PLAT-001$rgtxt$),
    ($rgtxt$RBL Bank$rgtxt$, $rgtxt$Platinum Choice$rgtxt$, $rgtxt$Visa$rgtxt$, $rgtxt$Platinum$rgtxt$, $rgtxt$RBLB-PTCH-VIS-PLAT-001$rgtxt$),
    ($rgtxt$RBL Bank$rgtxt$, $rgtxt$Shoppers Stop Platinum$rgtxt$, $rgtxt$Visa$rgtxt$, $rgtxt$Platinum$rgtxt$, $rgtxt$RBLB-SHOP-VIS-PLAT-001$rgtxt$),
    ($rgtxt$RBL Bank$rgtxt$, $rgtxt$Play$rgtxt$, $rgtxt$Visa$rgtxt$, $rgtxt$Platinum$rgtxt$, $rgtxt$RBLB-PLAY-VIS-PLAT-001$rgtxt$),
    ($rgtxt$RBL Bank$rgtxt$, $rgtxt$Bankbazaar SaveMax$rgtxt$, $rgtxt$Visa$rgtxt$, $rgtxt$Platinum$rgtxt$, $rgtxt$RBLB-BANS-VIS-PLAT-001$rgtxt$),
    ($rgtxt$RBL Bank$rgtxt$, $rgtxt$MoneyTap Black$rgtxt$, $rgtxt$Visa$rgtxt$, $rgtxt$Platinum$rgtxt$, $rgtxt$RBLB-MONB-VIS-PLAT-001$rgtxt$),
    ($rgtxt$RBL Bank$rgtxt$, $rgtxt$MoneyTap$rgtxt$, $rgtxt$Visa$rgtxt$, $rgtxt$Platinum$rgtxt$, $rgtxt$RBLB-MONP-VIS-PLAT-001$rgtxt$),
    ($rgtxt$RBL Bank$rgtxt$, $rgtxt$Paisabazaar Duet$rgtxt$, $rgtxt$Visa$rgtxt$, $rgtxt$Platinum$rgtxt$, $rgtxt$RBLB-PAID-VIS-PLAT-001$rgtxt$),
    ($rgtxt$RBL Bank$rgtxt$, $rgtxt$Shoprite$rgtxt$, $rgtxt$Visa$rgtxt$, $rgtxt$Platinum$rgtxt$, $rgtxt$RBLB-SHOR-VIS-PLAT-001$rgtxt$),
    ($rgtxt$RBL Bank$rgtxt$, $rgtxt$World Prime$rgtxt$, $rgtxt$Visa$rgtxt$, $rgtxt$Platinum$rgtxt$, $rgtxt$RBLB-WOPR-VIS-PLAT-001$rgtxt$),
    ($rgtxt$RBL Bank$rgtxt$, $rgtxt$World Plus$rgtxt$, $rgtxt$Visa$rgtxt$, $rgtxt$Platinum$rgtxt$, $rgtxt$RBLB-WOPX-VIS-PLAT-001$rgtxt$),
    ($rgtxt$RBL Bank$rgtxt$, $rgtxt$Nova$rgtxt$, $rgtxt$Visa$rgtxt$, $rgtxt$Signature$rgtxt$, $rgtxt$RBLB-NOVA-VIS-SIGN-001$rgtxt$),
    ($rgtxt$RBL Bank$rgtxt$, $rgtxt$Shoppers Stop Black$rgtxt$, $rgtxt$Visa$rgtxt$, $rgtxt$Signature$rgtxt$, $rgtxt$RBLB-SHOB-VIS-SIGN-001$rgtxt$),
    ($rgtxt$RBL Bank$rgtxt$, $rgtxt$World Safari$rgtxt$, $rgtxt$Visa$rgtxt$, $rgtxt$Signature$rgtxt$, $rgtxt$RBLB-WOSA-VIS-SIGN-001$rgtxt$),
    ($rgtxt$SBI Card$rgtxt$, $rgtxt$PRIME$rgtxt$, $rgtxt$Amex$rgtxt$, $rgtxt$Platinum$rgtxt$, $rgtxt$SBI1-PRIM-AMX-PLAT-001$rgtxt$),
    ($rgtxt$SBI Card$rgtxt$, $rgtxt$ELITE$rgtxt$, $rgtxt$Amex$rgtxt$, $rgtxt$World$rgtxt$, $rgtxt$SBI1-ELIT-AMX-WRLD-001$rgtxt$),
    ($rgtxt$SBI Card$rgtxt$, $rgtxt$Air India Platinum$rgtxt$, $rgtxt$Mastercard$rgtxt$, $rgtxt$Platinum$rgtxt$, $rgtxt$SBI1-AIPL-MST-PLAT-001$rgtxt$),
    ($rgtxt$SBI Card$rgtxt$, $rgtxt$Reliance$rgtxt$, $rgtxt$Mastercard$rgtxt$, $rgtxt$Platinum$rgtxt$, $rgtxt$SBI1-RELI-MST-PLAT-001$rgtxt$),
    ($rgtxt$SBI Card$rgtxt$, $rgtxt$SimplySAVE$rgtxt$, $rgtxt$Mastercard$rgtxt$, $rgtxt$Platinum$rgtxt$, $rgtxt$SBI1-SSAV-MST-PLAT-001$rgtxt$),
    ($rgtxt$SBI Card$rgtxt$, $rgtxt$Air India Signature$rgtxt$, $rgtxt$Mastercard$rgtxt$, $rgtxt$World$rgtxt$, $rgtxt$SBI1-AISI-MST-WRLD-001$rgtxt$),
    ($rgtxt$SBI Card$rgtxt$, $rgtxt$Reliance PRIME$rgtxt$, $rgtxt$Mastercard$rgtxt$, $rgtxt$World$rgtxt$, $rgtxt$SBI1-RELP-MST-WRLD-001$rgtxt$),
    ($rgtxt$SBI Card$rgtxt$, $rgtxt$ELITE$rgtxt$, $rgtxt$Mastercard$rgtxt$, $rgtxt$World$rgtxt$, $rgtxt$SBI1-ELIT-MST-WRLD-001$rgtxt$),
    ($rgtxt$SBI Card$rgtxt$, $rgtxt$MILES ELITE$rgtxt$, $rgtxt$Mastercard$rgtxt$, $rgtxt$World Elite$rgtxt$, $rgtxt$SBI1-MILI-MST-WELT-001$rgtxt$),
    ($rgtxt$SBI Card$rgtxt$, $rgtxt$PRIME$rgtxt$, $rgtxt$Mastercard$rgtxt$, $rgtxt$World$rgtxt$, $rgtxt$SBI1-PRIM-MST-WRLD-001$rgtxt$),
    ($rgtxt$SBI Card$rgtxt$, $rgtxt$PRIME Pro$rgtxt$, $rgtxt$Mastercard$rgtxt$, $rgtxt$World$rgtxt$, $rgtxt$SBI1-PRIP-MST-WRLD-001$rgtxt$),
    ($rgtxt$SBI Card$rgtxt$, $rgtxt$Reliance$rgtxt$, $rgtxt$RuPay$rgtxt$, $rgtxt$Platinum$rgtxt$, $rgtxt$SBI1-RELI-RUP-PLAT-001$rgtxt$),
    ($rgtxt$SBI Card$rgtxt$, $rgtxt$Vyapaar Unnati$rgtxt$, $rgtxt$RuPay$rgtxt$, $rgtxt$Platinum$rgtxt$, $rgtxt$SBI1-VYAU-RUP-PLAT-001$rgtxt$),
    ($rgtxt$SBI Card$rgtxt$, $rgtxt$Shaurya$rgtxt$, $rgtxt$RuPay$rgtxt$, $rgtxt$Platinum$rgtxt$, $rgtxt$SBI1-SHAU-RUP-PLAT-001$rgtxt$),
    ($rgtxt$SBI Card$rgtxt$, $rgtxt$SimplySAVE UPI$rgtxt$, $rgtxt$RuPay$rgtxt$, $rgtxt$Platinum$rgtxt$, $rgtxt$SBI1-SSAU-RUP-PLAT-001$rgtxt$),
    ($rgtxt$SBI Card$rgtxt$, $rgtxt$Tata Neu Plus$rgtxt$, $rgtxt$RuPay$rgtxt$, $rgtxt$Platinum$rgtxt$, $rgtxt$SBI1-TNUX-RUP-PLAT-001$rgtxt$),
    ($rgtxt$SBI Card$rgtxt$, $rgtxt$Reliance PRIME$rgtxt$, $rgtxt$RuPay$rgtxt$, $rgtxt$Select$rgtxt$, $rgtxt$SBI1-RELP-RUP-SELC-001$rgtxt$),
    ($rgtxt$SBI Card$rgtxt$, $rgtxt$MILES ELITE$rgtxt$, $rgtxt$RuPay$rgtxt$, $rgtxt$Select$rgtxt$, $rgtxt$SBI1-MILI-RUP-SELC-001$rgtxt$),
    ($rgtxt$SBI Card$rgtxt$, $rgtxt$Shaurya Select$rgtxt$, $rgtxt$RuPay$rgtxt$, $rgtxt$Select$rgtxt$, $rgtxt$SBI1-SHAS-RUP-SELC-001$rgtxt$),
    ($rgtxt$SBI Card$rgtxt$, $rgtxt$Tata Neu Infinity$rgtxt$, $rgtxt$RuPay$rgtxt$, $rgtxt$Select$rgtxt$, $rgtxt$SBI1-TNUI-RUP-SELC-001$rgtxt$),
    ($rgtxt$SBI Card$rgtxt$, $rgtxt$Titan$rgtxt$, $rgtxt$RuPay$rgtxt$, $rgtxt$Signature$rgtxt$, $rgtxt$SBI1-TITN-RUP-SIGN-001$rgtxt$),
    ($rgtxt$SBI Card$rgtxt$, $rgtxt$AURUM$rgtxt$, $rgtxt$Visa$rgtxt$, $rgtxt$Infinite$rgtxt$, $rgtxt$SBI1-AURM-VIS-INFI-001$rgtxt$),
    ($rgtxt$SBI Card$rgtxt$, $rgtxt$Air India Platinum$rgtxt$, $rgtxt$Visa$rgtxt$, $rgtxt$Platinum$rgtxt$, $rgtxt$SBI1-AIPL-VIS-PLAT-001$rgtxt$),
    ($rgtxt$SBI Card$rgtxt$, $rgtxt$Delhi Metro$rgtxt$, $rgtxt$Visa$rgtxt$, $rgtxt$Platinum$rgtxt$, $rgtxt$SBI1-DELM-VIS-PLAT-001$rgtxt$),
    ($rgtxt$SBI Card$rgtxt$, $rgtxt$Etihad Guest$rgtxt$, $rgtxt$Visa$rgtxt$, $rgtxt$Platinum$rgtxt$, $rgtxt$SBI1-ETIG-VIS-PLAT-001$rgtxt$),
    ($rgtxt$SBI Card$rgtxt$, $rgtxt$Fabindia$rgtxt$, $rgtxt$Visa$rgtxt$, $rgtxt$Platinum$rgtxt$, $rgtxt$SBI1-FABI-VIS-PLAT-001$rgtxt$),
    ($rgtxt$SBI Card$rgtxt$, $rgtxt$FBB Styleup$rgtxt$, $rgtxt$Visa$rgtxt$, $rgtxt$Platinum$rgtxt$, $rgtxt$SBI1-FBBS-VIS-PLAT-001$rgtxt$),
    ($rgtxt$SBI Card$rgtxt$, $rgtxt$OLA Money$rgtxt$, $rgtxt$Visa$rgtxt$, $rgtxt$Platinum$rgtxt$, $rgtxt$SBI1-OLAM-VIS-PLAT-001$rgtxt$),
    ($rgtxt$SBI Card$rgtxt$, $rgtxt$PSB SimplySAVE$rgtxt$, $rgtxt$Visa$rgtxt$, $rgtxt$Platinum$rgtxt$, $rgtxt$SBI1-PSBS-VIS-PLAT-001$rgtxt$),
    ($rgtxt$SBI Card$rgtxt$, $rgtxt$MILES$rgtxt$, $rgtxt$Visa$rgtxt$, $rgtxt$Platinum$rgtxt$, $rgtxt$SBI1-MILE-VIS-PLAT-001$rgtxt$),
    ($rgtxt$SBI Card$rgtxt$, $rgtxt$Unnati$rgtxt$, $rgtxt$Visa$rgtxt$, $rgtxt$Platinum$rgtxt$, $rgtxt$SBI1-UNNA-VIS-PLAT-001$rgtxt$),
    ($rgtxt$SBI Card$rgtxt$, $rgtxt$SimplyCLICK Advantage$rgtxt$, $rgtxt$Visa$rgtxt$, $rgtxt$Platinum$rgtxt$, $rgtxt$SBI1-SCLA-VIS-PLAT-001$rgtxt$),
    ($rgtxt$SBI Card$rgtxt$, $rgtxt$SimplyCLICK$rgtxt$, $rgtxt$Visa$rgtxt$, $rgtxt$Platinum$rgtxt$, $rgtxt$SBI1-SCLK-VIS-PLAT-001$rgtxt$),
    ($rgtxt$SBI Card$rgtxt$, $rgtxt$SimplySAVE Advantage$rgtxt$, $rgtxt$Visa$rgtxt$, $rgtxt$Platinum$rgtxt$, $rgtxt$SBI1-SSAA-VIS-PLAT-001$rgtxt$),
    ($rgtxt$SBI Card$rgtxt$, $rgtxt$SimplySAVE Merchant$rgtxt$, $rgtxt$Visa$rgtxt$, $rgtxt$Platinum$rgtxt$, $rgtxt$SBI1-SSAM-VIS-PLAT-001$rgtxt$),
    ($rgtxt$SBI Card$rgtxt$, $rgtxt$SimplySAVE$rgtxt$, $rgtxt$Visa$rgtxt$, $rgtxt$Platinum$rgtxt$, $rgtxt$SBI1-SSAV-VIS-PLAT-001$rgtxt$),
    ($rgtxt$SBI Card$rgtxt$, $rgtxt$South Indian Bank Platinum$rgtxt$, $rgtxt$Visa$rgtxt$, $rgtxt$Platinum$rgtxt$, $rgtxt$SBI1-SOUP-VIS-PLAT-001$rgtxt$),
    ($rgtxt$SBI Card$rgtxt$, $rgtxt$South Indian Bank SimplySAVE$rgtxt$, $rgtxt$Visa$rgtxt$, $rgtxt$Platinum$rgtxt$, $rgtxt$SBI1-SOUS-VIS-PLAT-001$rgtxt$),
    ($rgtxt$SBI Card$rgtxt$, $rgtxt$Tata Neu Plus$rgtxt$, $rgtxt$Visa$rgtxt$, $rgtxt$Platinum$rgtxt$, $rgtxt$SBI1-TNUX-VIS-PLAT-001$rgtxt$),
    ($rgtxt$SBI Card$rgtxt$, $rgtxt$Tata$rgtxt$, $rgtxt$Visa$rgtxt$, $rgtxt$Platinum$rgtxt$, $rgtxt$SBI1-TATA-VIS-PLAT-001$rgtxt$),
    ($rgtxt$SBI Card$rgtxt$, $rgtxt$Tata Croma$rgtxt$, $rgtxt$Visa$rgtxt$, $rgtxt$Platinum$rgtxt$, $rgtxt$SBI1-TCRO-VIS-PLAT-001$rgtxt$),
    ($rgtxt$SBI Card$rgtxt$, $rgtxt$Tata Star$rgtxt$, $rgtxt$Visa$rgtxt$, $rgtxt$Platinum$rgtxt$, $rgtxt$SBI1-TSTA-VIS-PLAT-001$rgtxt$),
    ($rgtxt$SBI Card$rgtxt$, $rgtxt$UCO Bank SimplySAVE$rgtxt$, $rgtxt$Visa$rgtxt$, $rgtxt$Platinum$rgtxt$, $rgtxt$SBI1-UCOS-VIS-PLAT-001$rgtxt$),
    ($rgtxt$SBI Card$rgtxt$, $rgtxt$Yatra$rgtxt$, $rgtxt$Visa$rgtxt$, $rgtxt$Platinum$rgtxt$, $rgtxt$SBI1-YATR-VIS-PLAT-001$rgtxt$),
    ($rgtxt$SBI Card$rgtxt$, $rgtxt$Central Select$rgtxt$, $rgtxt$Visa$rgtxt$, $rgtxt$Select$rgtxt$, $rgtxt$SBI1-SELE-VIS-SELC-001$rgtxt$),
    ($rgtxt$SBI Card$rgtxt$, $rgtxt$Air India Signature$rgtxt$, $rgtxt$Visa$rgtxt$, $rgtxt$Signature$rgtxt$, $rgtxt$SBI1-AISI-VIS-SIGN-001$rgtxt$),
    ($rgtxt$SBI Card$rgtxt$, $rgtxt$Central Bank of India ELITE$rgtxt$, $rgtxt$Visa$rgtxt$, $rgtxt$Signature$rgtxt$, $rgtxt$SBI1-CENE-VIS-SIGN-001$rgtxt$),
    ($rgtxt$SBI Card$rgtxt$, $rgtxt$Central Bank of India PRIME$rgtxt$, $rgtxt$Visa$rgtxt$, $rgtxt$Signature$rgtxt$, $rgtxt$SBI1-CENP-VIS-SIGN-001$rgtxt$),
    ($rgtxt$SBI Card$rgtxt$, $rgtxt$Club Vistara$rgtxt$, $rgtxt$Visa$rgtxt$, $rgtxt$Signature$rgtxt$, $rgtxt$SBI1-CLUV-VIS-SIGN-001$rgtxt$),
    ($rgtxt$SBI Card$rgtxt$, $rgtxt$Club Vistara PRIME$rgtxt$, $rgtxt$Visa$rgtxt$, $rgtxt$Signature$rgtxt$, $rgtxt$SBI1-CLUP-VIS-SIGN-001$rgtxt$),
    ($rgtxt$SBI Card$rgtxt$, $rgtxt$Etihad Guest Premier$rgtxt$, $rgtxt$Visa$rgtxt$, $rgtxt$Signature$rgtxt$, $rgtxt$SBI1-ETIR-VIS-SIGN-001$rgtxt$),
    ($rgtxt$SBI Card$rgtxt$, $rgtxt$Fabindia SELECT$rgtxt$, $rgtxt$Visa$rgtxt$, $rgtxt$Signature$rgtxt$, $rgtxt$SBI1-FABS-VIS-SIGN-001$rgtxt$),
    ($rgtxt$SBI Card$rgtxt$, $rgtxt$ELITE$rgtxt$, $rgtxt$Visa$rgtxt$, $rgtxt$Signature$rgtxt$, $rgtxt$SBI1-ELIT-VIS-SIGN-001$rgtxt$),
    ($rgtxt$SBI Card$rgtxt$, $rgtxt$ELITE Advantage$rgtxt$, $rgtxt$Visa$rgtxt$, $rgtxt$Signature$rgtxt$, $rgtxt$SBI1-ELIA-VIS-SIGN-001$rgtxt$),
    ($rgtxt$SBI Card$rgtxt$, $rgtxt$MILES PRIME$rgtxt$, $rgtxt$Visa$rgtxt$, $rgtxt$Signature$rgtxt$, $rgtxt$SBI1-MILP-VIS-SIGN-001$rgtxt$),
    ($rgtxt$SBI Card$rgtxt$, $rgtxt$PRIME$rgtxt$, $rgtxt$Visa$rgtxt$, $rgtxt$Signature$rgtxt$, $rgtxt$SBI1-PRIM-VIS-SIGN-001$rgtxt$),
    ($rgtxt$SBI Card$rgtxt$, $rgtxt$PRIME Advantage$rgtxt$, $rgtxt$Visa$rgtxt$, $rgtxt$Signature$rgtxt$, $rgtxt$SBI1-PRIA-VIS-SIGN-001$rgtxt$),
    ($rgtxt$SBI Card$rgtxt$, $rgtxt$PRIME Pro$rgtxt$, $rgtxt$Visa$rgtxt$, $rgtxt$Signature$rgtxt$, $rgtxt$SBI1-PRIP-VIS-SIGN-001$rgtxt$),
    ($rgtxt$SBI Card$rgtxt$, $rgtxt$PULSE$rgtxt$, $rgtxt$Visa$rgtxt$, $rgtxt$Signature$rgtxt$, $rgtxt$SBI1-PULS-VIS-SIGN-001$rgtxt$),
    ($rgtxt$SBI Card$rgtxt$, $rgtxt$PRIME NRI Secured$rgtxt$, $rgtxt$Visa$rgtxt$, $rgtxt$Signature$rgtxt$, $rgtxt$SBI1-PRIN-VIS-SIGN-001$rgtxt$),
    ($rgtxt$SBI Card$rgtxt$, $rgtxt$South Indian Bank Prime$rgtxt$, $rgtxt$Visa$rgtxt$, $rgtxt$Signature$rgtxt$, $rgtxt$SBI1-SPRI-VIS-SIGN-001$rgtxt$),
    ($rgtxt$SBI Card$rgtxt$, $rgtxt$Tata Neu Infinity$rgtxt$, $rgtxt$Visa$rgtxt$, $rgtxt$Signature$rgtxt$, $rgtxt$SBI1-TNUI-VIS-SIGN-001$rgtxt$),
    ($rgtxt$SBI Card$rgtxt$, $rgtxt$Tata Card SELECT$rgtxt$, $rgtxt$Visa$rgtxt$, $rgtxt$Signature$rgtxt$, $rgtxt$SBI1-TATS-VIS-SIGN-001$rgtxt$),
    ($rgtxt$SBI Card$rgtxt$, $rgtxt$Tata Croma Card SELECT$rgtxt$, $rgtxt$Visa$rgtxt$, $rgtxt$Signature$rgtxt$, $rgtxt$SBI1-TCRS-VIS-SIGN-001$rgtxt$),
    ($rgtxt$SBI Card$rgtxt$, $rgtxt$Tata Star Card SELECT$rgtxt$, $rgtxt$Visa$rgtxt$, $rgtxt$Signature$rgtxt$, $rgtxt$SBI1-TSTS-VIS-SIGN-001$rgtxt$),
    ($rgtxt$SBI Card$rgtxt$, $rgtxt$Titan$rgtxt$, $rgtxt$Visa$rgtxt$, $rgtxt$Signature$rgtxt$, $rgtxt$SBI1-TITN-VIS-SIGN-001$rgtxt$),
    ($rgtxt$SBI Card$rgtxt$, $rgtxt$UCO Bank ELITE$rgtxt$, $rgtxt$Visa$rgtxt$, $rgtxt$Signature$rgtxt$, $rgtxt$SBI1-UCOE-VIS-SIGN-001$rgtxt$),
    ($rgtxt$SBI Card$rgtxt$, $rgtxt$UCO Bank Prime$rgtxt$, $rgtxt$Visa$rgtxt$, $rgtxt$Signature$rgtxt$, $rgtxt$SBI1-UCOP-VIS-SIGN-001$rgtxt$),
    ($rgtxt$YES BANK$rgtxt$, $rgtxt$First Business$rgtxt$, $rgtxt$Mastercard$rgtxt$, $rgtxt$Business$rgtxt$, $rgtxt$YESB-FIRB-MST-BUSN-001$rgtxt$),
    ($rgtxt$YES BANK$rgtxt$, $rgtxt$Prosperity Business$rgtxt$, $rgtxt$Mastercard$rgtxt$, $rgtxt$Business$rgtxt$, $rgtxt$YESB-PROB-MST-BUSN-001$rgtxt$),
    ($rgtxt$YES BANK$rgtxt$, $rgtxt$Prosperity Rewards$rgtxt$, $rgtxt$Mastercard$rgtxt$, $rgtxt$Platinum$rgtxt$, $rgtxt$YESB-PROR-MST-PLAT-001$rgtxt$),
    ($rgtxt$YES BANK$rgtxt$, $rgtxt$Prosperity Cashback Plus$rgtxt$, $rgtxt$Mastercard$rgtxt$, $rgtxt$Titanium$rgtxt$, $rgtxt$YESB-PROX-MST-TITN-001$rgtxt$),
    ($rgtxt$YES BANK$rgtxt$, $rgtxt$Prosperity Cashback$rgtxt$, $rgtxt$Mastercard$rgtxt$, $rgtxt$Titanium$rgtxt$, $rgtxt$YESB-PROC-MST-TITN-001$rgtxt$),
    ($rgtxt$YES BANK$rgtxt$, $rgtxt$Private$rgtxt$, $rgtxt$Mastercard$rgtxt$, $rgtxt$World Elite$rgtxt$, $rgtxt$YESB-PRIV-MST-WELT-001$rgtxt$),
    ($rgtxt$YES BANK$rgtxt$, $rgtxt$Private Prime$rgtxt$, $rgtxt$Mastercard$rgtxt$, $rgtxt$World Elite$rgtxt$, $rgtxt$YESB-PRPR-MST-WELT-001$rgtxt$),
    ($rgtxt$YES BANK$rgtxt$, $rgtxt$RESERV$rgtxt$, $rgtxt$Mastercard$rgtxt$, $rgtxt$World$rgtxt$, $rgtxt$YESB-RESE-MST-WRLD-001$rgtxt$),
    ($rgtxt$YES BANK$rgtxt$, $rgtxt$ELITE+$rgtxt$, $rgtxt$Mastercard$rgtxt$, $rgtxt$World$rgtxt$, $rgtxt$YESB-ELIX-MST-WRLD-001$rgtxt$),
    ($rgtxt$YES BANK$rgtxt$, $rgtxt$First Preferred$rgtxt$, $rgtxt$Mastercard$rgtxt$, $rgtxt$World$rgtxt$, $rgtxt$YESB-FIRP-MST-WRLD-001$rgtxt$),
    ($rgtxt$YES BANK$rgtxt$, $rgtxt$Essence$rgtxt$, $rgtxt$Mastercard$rgtxt$, $rgtxt$World$rgtxt$, $rgtxt$YESB-ESSE-MST-WRLD-001$rgtxt$),
    ($rgtxt$YES BANK$rgtxt$, $rgtxt$Private Credit Card for NRI$rgtxt$, $rgtxt$Mastercard$rgtxt$, $rgtxt$World Elite$rgtxt$, $rgtxt$YESB-PRI2-MST-WELT-001$rgtxt$),
    ($rgtxt$YES BANK$rgtxt$, $rgtxt$RESERV Credit Card for NRI$rgtxt$, $rgtxt$Mastercard$rgtxt$, $rgtxt$World$rgtxt$, $rgtxt$YESB-RES2-MST-WRLD-001$rgtxt$),
    ($rgtxt$YES BANK$rgtxt$, $rgtxt$AI Inside RuPay$rgtxt$, $rgtxt$RuPay$rgtxt$, $rgtxt$Credit on UPI$rgtxt$, $rgtxt$YESB-AINS-RUP-CUPI-001$rgtxt$),
    ($rgtxt$YES BANK$rgtxt$, $rgtxt$Klick RuPay$rgtxt$, $rgtxt$RuPay$rgtxt$, $rgtxt$Credit on UPI$rgtxt$, $rgtxt$YESB-KLIC-RUP-CUPI-001$rgtxt$),
    ($rgtxt$YES BANK$rgtxt$, $rgtxt$Novio RuPay$rgtxt$, $rgtxt$RuPay$rgtxt$, $rgtxt$Credit on UPI$rgtxt$, $rgtxt$YESB-NOVI-RUP-CUPI-001$rgtxt$),
    ($rgtxt$YES BANK$rgtxt$, $rgtxt$RuPay$rgtxt$, $rgtxt$RuPay$rgtxt$, $rgtxt$Credit on UPI$rgtxt$, $rgtxt$YESB-RUPA-RUP-CUPI-001$rgtxt$),
    ($rgtxt$YES BANK$rgtxt$, $rgtxt$UNI RuPay$rgtxt$, $rgtxt$RuPay$rgtxt$, $rgtxt$Credit on UPI$rgtxt$, $rgtxt$YESB-UNI0-RUP-CUPI-001$rgtxt$),
    ($rgtxt$YES BANK$rgtxt$, $rgtxt$POP-CLUB$rgtxt$, $rgtxt$RuPay$rgtxt$, $rgtxt$Select$rgtxt$, $rgtxt$YESB-PCLU-RUP-SELC-001$rgtxt$),
    ($rgtxt$YES BANK$rgtxt$, $rgtxt$Paisabazaar PaisaSave RuPay$rgtxt$, $rgtxt$RuPay$rgtxt$, $rgtxt$Select$rgtxt$, $rgtxt$YESB-PPAI-RUP-SELC-001$rgtxt$),
    ($rgtxt$YES BANK$rgtxt$, $rgtxt$MARQUEE$rgtxt$, $rgtxt$Visa$rgtxt$, $rgtxt$Infinite$rgtxt$, $rgtxt$YESB-MARQ-VIS-INFI-001$rgtxt$),
    ($rgtxt$YES BANK$rgtxt$, $rgtxt$AI Inside$rgtxt$, $rgtxt$Visa$rgtxt$, $rgtxt$Platinum$rgtxt$, $rgtxt$YESB-AINS-VIS-PLAT-001$rgtxt$),
    ($rgtxt$YES BANK$rgtxt$, $rgtxt$FinBooster$rgtxt$, $rgtxt$Visa$rgtxt$, $rgtxt$Platinum$rgtxt$, $rgtxt$YESB-FINB-VIS-PLAT-001$rgtxt$),
    ($rgtxt$YES BANK$rgtxt$, $rgtxt$Novio$rgtxt$, $rgtxt$Visa$rgtxt$, $rgtxt$Platinum$rgtxt$, $rgtxt$YESB-NOVI-VIS-PLAT-001$rgtxt$),
    ($rgtxt$YES BANK$rgtxt$, $rgtxt$ACE$rgtxt$, $rgtxt$Visa$rgtxt$, $rgtxt$Platinum$rgtxt$, $rgtxt$YESB-ACE0-VIS-PLAT-001$rgtxt$),
    ($rgtxt$YES BANK$rgtxt$, $rgtxt$Wellness Plus$rgtxt$, $rgtxt$Visa$rgtxt$, $rgtxt$Platinum$rgtxt$, $rgtxt$YESB-WELX-VIS-PLAT-001$rgtxt$),
    ($rgtxt$YES BANK$rgtxt$, $rgtxt$Wellness$rgtxt$, $rgtxt$Visa$rgtxt$, $rgtxt$Platinum$rgtxt$, $rgtxt$YESB-WELL-VIS-PLAT-001$rgtxt$),
    ($rgtxt$YES BANK$rgtxt$, $rgtxt$Build Your Own Card (BYOC)$rgtxt$, $rgtxt$Visa$rgtxt$, $rgtxt$Platinum$rgtxt$, $rgtxt$YESB-BYOC-VIS-PLAT-001$rgtxt$),
    ($rgtxt$YES BANK$rgtxt$, $rgtxt$EMI$rgtxt$, $rgtxt$Visa$rgtxt$, $rgtxt$Platinum$rgtxt$, $rgtxt$YESB-EMI0-VIS-PLAT-001$rgtxt$),
    ($rgtxt$YES BANK$rgtxt$, $rgtxt$Paisabazaar PaisaSave$rgtxt$, $rgtxt$Visa$rgtxt$, $rgtxt$Platinum$rgtxt$, $rgtxt$YESB-PPAI-VIS-PLAT-001$rgtxt$),
    ($rgtxt$YES BANK$rgtxt$, $rgtxt$Anq Phi$rgtxt$, $rgtxt$Visa$rgtxt$, $rgtxt$Platinum$rgtxt$, $rgtxt$YESB-ANQP-VIS-PLAT-001$rgtxt$),
    ($rgtxt$YES BANK$rgtxt$, $rgtxt$FREO$rgtxt$, $rgtxt$Visa$rgtxt$, $rgtxt$Platinum$rgtxt$, $rgtxt$YESB-FREO-VIS-PLAT-001$rgtxt$),
    ($rgtxt$YES BANK$rgtxt$, $rgtxt$Uni$rgtxt$, $rgtxt$Visa$rgtxt$, $rgtxt$Platinum$rgtxt$, $rgtxt$YESB-UNI0-VIS-PLAT-001$rgtxt$),
    ($rgtxt$YES BANK$rgtxt$, $rgtxt$Niyo$rgtxt$, $rgtxt$Visa$rgtxt$, $rgtxt$Platinum$rgtxt$, $rgtxt$YESB-NIYO-VIS-PLAT-001$rgtxt$),
    ($rgtxt$YES BANK$rgtxt$, $rgtxt$Zagg$rgtxt$, $rgtxt$Visa$rgtxt$, $rgtxt$Platinum$rgtxt$, $rgtxt$YESB-ZAGG-VIS-PLAT-001$rgtxt$),
    ($rgtxt$YES BANK$rgtxt$, $rgtxt$SELECT$rgtxt$, $rgtxt$Visa$rgtxt$, $rgtxt$Signature$rgtxt$, $rgtxt$YESB-SELE-VIS-SIGN-001$rgtxt$),
    ($rgtxt$YES BANK$rgtxt$, $rgtxt$SELECT Credit Card for NRI$rgtxt$, $rgtxt$Visa$rgtxt$, $rgtxt$Signature$rgtxt$, $rgtxt$YESB-SEL2-VIS-SIGN-001$rgtxt$);

-- 1. Drop the 3 FKs that point at cards_pkey, so cards and its children can
-- be renamed independently without a referential-integrity error mid-way.
alter table card_benefits drop constraint if exists card_benefits_card_id_fkey;
alter table benefit_milestones drop constraint if exists benefit_milestones_card_id_fkey;
alter table benefit_partner_programs drop constraint if exists benefit_partner_programs_card_id_fkey;

-- 2. Rename card_id in every OTHER table while "cards" still holds the old
-- values -- "target" is a plain SELECT (never written to), so this chained
-- batch is safe, and none of these 39 tables has a uniqueness constraint on
-- card_id to begin with.
-- A handful of distinct original products collapse to the identical
-- (issuer, product, network, sub_network) after the earlier text cleanup
-- ("ICICI Bank NRI Coral" and "...NRI Coral Credit Card" both -> "NRI
-- Coral"). A plain tuple join can't tell those rows apart and matches every
-- live row against every map row sharing that tuple — row_number() on both
-- sides, in the same deterministic order, pairs them 1:1 instead.
with target as (
  select c.card_id as old_id, m.new_id
  from (select *, row_number() over (partition by issuer, product, network, sub_network order by card_id) as rn from cards) c
  join (select *, row_number() over (partition by issuer, product, network, sub_network order by new_id) as rn from card_rename_map) m
    on c.issuer = m.issuer and c.product = m.product
    and c.network = m.network and c.sub_network = m.sub_network and c.rn = m.rn
),
u1 as (
  update offers t set card_id = tg.new_id
  from target tg
  where t.card_id = tg.old_id
  returning 1
),
u2 as (
  update mcc_rules t set card_id = tg.new_id
  from target tg
  where t.card_id = tg.old_id
  returning 1
),
u3 as (
  update card_benefits t set card_id = tg.new_id
  from target tg
  where t.card_id = tg.old_id
  returning 1
),
u4 as (
  update benefit_milestones t set card_id = tg.new_id
  from target tg
  where t.card_id = tg.old_id
  returning 1
),
u5 as (
  update benefit_partner_programs t set card_id = tg.new_id
  from target tg
  where t.card_id = tg.old_id
  returning 1
),
u6 as (
  update wb_card_details t set card_id = tg.new_id
  from target tg
  where t.card_id = tg.old_id
  returning 1
),
u7 as (
  update wb_offers t set card_id = tg.new_id
  from target tg
  where t.card_id = tg.old_id
  returning 1
),
u8 as (
  update wb_mcc t set card_id = tg.new_id
  from target tg
  where t.card_id = tg.old_id
  returning 1
),
u9 as (
  update wb_lounge t set card_id = tg.new_id
  from target tg
  where t.card_id = tg.old_id
  returning 1
),
u10 as (
  update wb_airport_transfer t set card_id = tg.new_id
  from target tg
  where t.card_id = tg.old_id
  returning 1
),
u11 as (
  update wb_travel t set card_id = tg.new_id
  from target tg
  where t.card_id = tg.old_id
  returning 1
),
u12 as (
  update wb_hotel t set card_id = tg.new_id
  from target tg
  where t.card_id = tg.old_id
  returning 1
),
u13 as (
  update wb_airline t set card_id = tg.new_id
  from target tg
  where t.card_id = tg.old_id
  returning 1
),
u14 as (
  update wb_forex_international t set card_id = tg.new_id
  from target tg
  where t.card_id = tg.old_id
  returning 1
),
u15 as (
  update wb_reward_points t set card_id = tg.new_id
  from target tg
  where t.card_id = tg.old_id
  returning 1
),
u16 as (
  update wb_milestone t set card_id = tg.new_id
  from target tg
  where t.card_id = tg.old_id
  returning 1
),
u17 as (
  update wb_welcome t set card_id = tg.new_id
  from target tg
  where t.card_id = tg.old_id
  returning 1
),
u18 as (
  update wb_renewal_benefit t set card_id = tg.new_id
  from target tg
  where t.card_id = tg.old_id
  returning 1
),
u19 as (
  update wb_fee_waiver t set card_id = tg.new_id
  from target tg
  where t.card_id = tg.old_id
  returning 1
),
u20 as (
  update wb_partner_and_transfer t set card_id = tg.new_id
  from target tg
  where t.card_id = tg.old_id
  returning 1
),
u21 as (
  update wb_fuel t set card_id = tg.new_id
  from target tg
  where t.card_id = tg.old_id
  returning 1
),
u22 as (
  update wb_dining t set card_id = tg.new_id
  from target tg
  where t.card_id = tg.old_id
  returning 1
),
u23 as (
  update wb_golf t set card_id = tg.new_id
  from target tg
  where t.card_id = tg.old_id
  returning 1
),
u24 as (
  update wb_movie t set card_id = tg.new_id
  from target tg
  where t.card_id = tg.old_id
  returning 1
),
u25 as (
  update wb_spa_wellness t set card_id = tg.new_id
  from target tg
  where t.card_id = tg.old_id
  returning 1
),
u26 as (
  update wb_concierge t set card_id = tg.new_id
  from target tg
  where t.card_id = tg.old_id
  returning 1
),
u27 as (
  update wb_shopping t set card_id = tg.new_id
  from target tg
  where t.card_id = tg.old_id
  returning 1
),
u28 as (
  update wb_ott_subscription t set card_id = tg.new_id
  from target tg
  where t.card_id = tg.old_id
  returning 1
),
u29 as (
  update wb_insurance_protection t set card_id = tg.new_id
  from target tg
  where t.card_id = tg.old_id
  returning 1
),
u30 as (
  update wb_travel_insurance t set card_id = tg.new_id
  from target tg
  where t.card_id = tg.old_id
  returning 1
),
u31 as (
  update wb_purchase_protection t set card_id = tg.new_id
  from target tg
  where t.card_id = tg.old_id
  returning 1
),
u32 as (
  update wb_personal_accident t set card_id = tg.new_id
  from target tg
  where t.card_id = tg.old_id
  returning 1
),
u33 as (
  update wb_roadside_assistance t set card_id = tg.new_id
  from target tg
  where t.card_id = tg.old_id
  returning 1
),
u34 as (
  update wb_ltf_lifetime_free t set card_id = tg.new_id
  from target tg
  where t.card_id = tg.old_id
  returning 1
),
u35 as (
  update wb_status_benefits t set card_id = tg.new_id
  from target tg
  where t.card_id = tg.old_id
  returning 1
),
u36 as (
  update wb_upi t set card_id = tg.new_id
  from target tg
  where t.card_id = tg.old_id
  returning 1
),
u37 as (
  update wb_contactless t set card_id = tg.new_id
  from target tg
  where t.card_id = tg.old_id
  returning 1
),
u38 as (
  update wb_token_enabled t set card_id = tg.new_id
  from target tg
  where t.card_id = tg.old_id
  returning 1
),
u39 as (
  update wb_fees t set card_id = tg.new_id
  from target tg
  where t.card_id = tg.old_id
  returning 1
)
select
  (select count(*) from target) as matched_cards,
  (select count(*) from u1)::int as offers,
  (select count(*) from u2)::int as mcc_rules,
  (select count(*) from u3)::int as card_benefits,
  (select count(*) from u4)::int as benefit_milestones,
  (select count(*) from u5)::int as benefit_partner_programs,
  (select count(*) from u6)::int as wb_card_details,
  (select count(*) from u7)::int as wb_offers,
  (select count(*) from u8)::int as wb_mcc,
  (select count(*) from u9)::int as wb_lounge,
  (select count(*) from u10)::int as wb_airport_transfer,
  (select count(*) from u11)::int as wb_travel,
  (select count(*) from u12)::int as wb_hotel,
  (select count(*) from u13)::int as wb_airline,
  (select count(*) from u14)::int as wb_forex_international,
  (select count(*) from u15)::int as wb_reward_points,
  (select count(*) from u16)::int as wb_milestone,
  (select count(*) from u17)::int as wb_welcome,
  (select count(*) from u18)::int as wb_renewal_benefit,
  (select count(*) from u19)::int as wb_fee_waiver,
  (select count(*) from u20)::int as wb_partner_and_transfer,
  (select count(*) from u21)::int as wb_fuel,
  (select count(*) from u22)::int as wb_dining,
  (select count(*) from u23)::int as wb_golf,
  (select count(*) from u24)::int as wb_movie,
  (select count(*) from u25)::int as wb_spa_wellness,
  (select count(*) from u26)::int as wb_concierge,
  (select count(*) from u27)::int as wb_shopping,
  (select count(*) from u28)::int as wb_ott_subscription,
  (select count(*) from u29)::int as wb_insurance_protection,
  (select count(*) from u30)::int as wb_travel_insurance,
  (select count(*) from u31)::int as wb_purchase_protection,
  (select count(*) from u32)::int as wb_personal_accident,
  (select count(*) from u33)::int as wb_roadside_assistance,
  (select count(*) from u34)::int as wb_ltf_lifetime_free,
  (select count(*) from u35)::int as wb_status_benefits,
  (select count(*) from u36)::int as wb_upi,
  (select count(*) from u37)::int as wb_contactless,
  (select count(*) from u38)::int as wb_token_enabled,
  (select count(*) from u39)::int as wb_fees;

-- 3. Rename cards.card_id itself, through a temp placeholder first. Matched
-- on (issuer, product, network, sub_network) plus the same row_number()
-- tie-break — not card_id — so this also doubles as the repair for
-- anything still stuck on "TMPRENAME_..." from the earlier broken attempt.
with target as (
  select c.card_id as old_id, m.new_id
  from (select *, row_number() over (partition by issuer, product, network, sub_network order by card_id) as rn from cards) c
  join (select *, row_number() over (partition by issuer, product, network, sub_network order by new_id) as rn from card_rename_map) m
    on c.issuer = m.issuer and c.product = m.product
    and c.network = m.network and c.sub_network = m.sub_network and c.rn = m.rn
)
update cards c set card_id = 'TMPRENAME_' || c.card_id
from target t
where c.card_id = t.old_id;

with target as (
  select c.card_id as old_id, m.new_id
  from (select *, row_number() over (partition by issuer, product, network, sub_network order by card_id) as rn from cards) c
  join (select *, row_number() over (partition by issuer, product, network, sub_network order by new_id) as rn from card_rename_map) m
    on c.issuer = m.issuer and c.product = m.product
    and c.network = m.network and c.sub_network = m.sub_network and c.rn = m.rn
)
update cards c set card_id = t.new_id
from target t
where c.card_id = t.old_id;

-- 4. Recreate the 3 FKs, exactly as they were.
alter table card_benefits add constraint card_benefits_card_id_fkey
  foreign key (card_id) references cards (card_id) on delete cascade;
alter table benefit_milestones add constraint benefit_milestones_card_id_fkey
  foreign key (card_id) references cards (card_id) on delete cascade;
alter table benefit_partner_programs add constraint benefit_partner_programs_card_id_fkey
  foreign key (card_id) references cards (card_id) on delete cascade;

drop table card_rename_map;
