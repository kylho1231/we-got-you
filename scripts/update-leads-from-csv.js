const fs = require("fs");
const path = require("path");

// Raw CSV text provided by the user
const rawCsv = `"WE GOT YOU  |  SAN JOSE, ANTIQUE — REPAIRER GPS DIRECTORY",,,,,,,,,,,,,,,,
Public research leads only • not a complete census • all provider coordinates require onboarding/field confirmation • as of 25 Oct 2026,,,,,,,,,,,,,,,,
Lead ID,Business / provider,Category,Listed repair/service work,Public address,Latitude,Longitude,Plus Code,GPS derivation,Map precision,Public business phone,Provider verification,Coordinate source URL,Business listing source URL,Google Maps GPS pin,Location caveats / follow-up,Google Maps name search
R001,EDE Engineering Enterprise,Appliance / aircon,Appliance repair; A/C; refrigeration; engineering,"Solana/Moscoso St., Brgy. 7",10.744527,121.9399467,,Indexed third-party map coordinates,Third-party map pin,0917 333 0247; 0951 321 4264,UNVERIFIED - onboarding needed,https://ug.maptons.com/p/10765240826,https://www.union.ph/service-center/,"https://www.google.com/maps?q=10.7445270,121.9399467",Search-result coordinates; source page access blocked; needs manual verification,https://www.google.com/maps/search/?api=1&query=EDE%20Engineering%20Enterprise%2C%20San%20Jose%20de%20Buenavista%2C%20Antique
R002,Antique Refrigeration & Airconditioning Service Center,Appliance / aircon,"Refrigeration, aircon, appliance service",Salazar Street,,,,Not resolved,Unresolved,0917 103 1240; 0915 257 0450,UNVERIFIED - onboarding needed,,https://condura.com/store-locator-and-accredited-services/,,,https://www.google.com/maps/search/?api=1&query=Antique%20Refrigeration%20%26%20Airconditioning%20Service%20Center%2C%20San%20Jose%20de%20Buenavista%2C%20Antique
R003,SNJ Electronics Ref & Aircon Service Center,Appliance / aircon,Electronics; refrigeration; aircon,Funda-Dalipe,,,,Not resolved,Unresolved,0949 678 2167; 0966 788 4102; 0905 813 4745,UNVERIFIED - onboarding needed,,https://myhanabishi.com/pages/store-locator,,,https://www.google.com/maps/search/?api=1&query=SNJ%20Electronics%20Ref%20%26%20Aircon%20Service%20Center%2C%20San%20Jose%20de%20Buenavista%2C%20Antique
R004,RAK Electronics & Ref/Aircon,Appliance / aircon,Ref/freezer; aircon; electronics repair,Atabay (QW3V+J6),10.7540625,121.9430625,QW3V+J6,Published Plus Code (decoded center),Map code cell center,0905 161 5868,UNVERIFIED - onboarding needed,https://www.google.com/maps/search/?api=1&query=RAK%20ELEC%20and%20REF/AIRCON%2C%20San%20Jose%20de%20Buenavista%2C%20Antique%2C%20Philippines,https://www.google.com/maps/search/?api=1&query=RAK%20ELEC%20and%20REF/AIRCON%2C%20San%20Jose%20de%20Buenavista%2C%20Antique%2C%20Philippines,"https://www.google.com/maps?q=10.7540625,121.9430625",Original research map location code; business pin not field-checked,https://www.google.com/maps/search/?api=1&query=RAK%20Electronics%20%26%20Ref/Aircon%2C%20San%20Jose%20de%20Buenavista%2C%20Antique
R005,RNJ Refrigeration & Air-Conditioning Services,Appliance / aircon,Aircon repair; refrigeration,"Cerdeña St., Brgy. 8",,,,Not resolved,Unresolved,0935 253 4810,UNVERIFIED - onboarding needed,,https://www.google.com/maps/search/?api=1&query=RNJ%20Refrigeration%20%26%20Air-Conditioning%20Services%2C%20San%20Jose%20de%20Buenavista%2C%20Antique%2C%20Philippines,,,https://www.google.com/maps/search/?api=1&query=RNJ%20Refrigeration%20%26%20Air-Conditioning%20Services%2C%20San%20Jose%20de%20Buenavista%2C%20Antique
R006,Pilakor Refrigeration & Airconditioning Services,Appliance / aircon,Aircon/refrigeration service,"Purok 1, Maybato Norte",10.7335375,121.9540781,PXM3+CJ8,Published Plus Code (decoded center),Map code cell center,0917 564 1371,UNVERIFIED - onboarding needed,https://faqet-e-verdha.cybo.com/PH/san-jose-xF9AJU/riparimi-i-makinave-,https://www.google.com/maps/search/?api=1&query=Pilakor%20Refrigeration%20%26%20Airconditioning%20Services%2C%20San%20Jose%20de%20Buenavista%2C%20Antique%2C%20Philippines,"https://www.google.com/maps?q=10.7335375,121.9540781",Cybo directory; business pin not field-checked,https://www.google.com/maps/search/?api=1&query=Pilakor%20Refrigeration%20%26%20Airconditioning%20Services%2C%20San%20Jose%20de%20Buenavista%2C%20Antique
R007,Cellu-Zite Cellphone Accessories and Repair Shop,Phone / gadget,Cellphone & gadget repair; accessories,"Villavert-Jimenez Street, Brgy. 6",10.74501,121.94019,,Published business GPS,Third-party map pin,0917 980 8488,UNVERIFIED - onboarding needed,https://philippines.worldplaces.me/view-place/73658258-cellu-zite-cellphone-accessories-and-repair-shop.html,https://philippines.worldplaces.me/view-place/73658258-cellu-zite-cellphone-accessories-and-repair-shop.html,"https://www.google.com/maps?q=10.7450100,121.9401900",WorldPlaces publishes coordinates for Villavert Jimenez St location,https://www.google.com/maps/search/?api=1&query=Cellu-Zite%20Cellphone%20Accessories%20and%20Repair%20Shop%2C%20San%20Jose%20de%20Buenavista%2C%20Antique
R008,Cellu-Zite Business Park Branch,Phone / gadget,Mobile phone/gadget repair,Business Park area (PWWR+GM3),10.7462625,121.9416719,PWWR+GM3,Published Plus Code (decoded center),Map code cell center,0917 980 8488 (shop number; confirm branch),UNVERIFIED - onboarding needed,https://www.google.com/maps/search/?api=1&query=Cellu-Zite%20Business%20Park%20Branch%2C%20San%20Jose%20de%20Buenavista%2C%20Antique%2C%20Philippines,https://www.google.com/maps/search/?api=1&query=Cellu-Zite%20Business%20Park%20Branch%2C%20San%20Jose%20de%20Buenavista%2C%20Antique%2C%20Philippines,"https://www.google.com/maps?q=10.7462625,121.9416719",Original research map location code; business pin not field-checked,https://www.google.com/maps/search/?api=1&query=Cellu-Zite%20Business%20Park%20Branch%2C%20San%20Jose%20de%20Buenavista%2C%20Antique
R009,Metro Mobile / Metro Mobile Phone Service Center,Phone / gadget,Mobile phone sales and possible servicing,C.O. Zaldivar St. (address inconsistent),10.74544,121.94285,,Published business GPS,Third-party map pin,0916 717 3548 (directory),UNVERIFIED - onboarding needed,https://philippines.worldplaces.me/view-place/64185047-metro-mobile-phone-service-center.html,https://www.google.com/maps/search/?api=1&query=Metro%20Mobile%20/%20Metro%20Mobile%20Phone%20Service%20Center%2C%20San%20Jose%20de%20Buenavista%2C%20Antique%2C%20Philippines,"https://www.google.com/maps?q=10.7454400,121.9428500",WorldPlaces describes GAISANO GRANDMALL site; earlier street listing inconsistent. Confirm actual branch; possible separate business-park / Gaisano Grandmall locations,https://www.google.com/maps/search/?api=1&query=Metro%20Mobile%20/%20Metro%20Mobile%20Phone%20Service%20Center%2C%20San%20Jose%20de%20Buenavista%2C%20Antique
R010,Hyun Gadgets Antique Laptop,Phone / gadget,Phones/laptops sales; ask about in-house repairs,General Fullon Street,,,,Not resolved,Unresolved,0924 135 8063,UNVERIFIED - onboarding needed,,https://www.google.com/maps/search/?api=1&query=Hyun%20Gadgets%20Antique%20Laptop%2C%20San%20Jose%20de%20Buenavista%2C%20Antique%2C%20Philippines,,,https://www.google.com/maps/search/?api=1&query=Hyun%20Gadgets%20Antique%20Laptop%2C%20San%20Jose%20de%20Buenavista%2C%20Antique
R011,"Salvenils Computer, Printer Sales & Services",Computer / printer,Computer repair; printer repair,"Brgy. 7, Capadocia Street",,,,Not resolved,Unresolved,0992 635 9030; 0927 248 7327,UNVERIFIED - onboarding needed,,https://www.google.com/maps/search/?api=1&query=Salvenils%20Computer%2C%20Printer%20Sales%20%26%20Services%2C%20San%20Jose%20de%20Buenavista%2C%20Antique%2C%20Philippines,,,https://www.google.com/maps/search/?api=1&query=Salvenils%20Computer%2C%20Printer%20Sales%20%26%20Services%2C%20San%20Jose%20de%20Buenavista%2C%20Antique
R012,Noypao's PC Repair,Computer / printer,PC repair,Bantayan Road (QWGP+FX3),10.7761375,121.9374219,QWGP+FX3,Published Plus Code (decoded center),Map code cell center,,UNVERIFIED - onboarding needed,https://www.cybo.com/PH/san-jose-central-luzon/computer-repair/,https://www.google.com/maps/search/?api=1&query=Noypao%27s%20PC%20Repair%2C%20San%20Jose%20de%20Buenavista%2C%20Antique%2C%20Philippines,"https://www.google.com/maps?q=10.7761375,121.9374219",Cybo listing; business pin not field-checked,https://www.google.com/maps/search/?api=1&query=Noypao%27s%20PC%20Repair%2C%20San%20Jose%20de%20Buenavista%2C%20Antique
R013,Megabit (computer repair listing),Computer / printer,Computer repair,PXP2+4PR,10.7353625,121.9517656,PXP2+4PR,Published Plus Code (decoded center),Map code cell center,,UNVERIFIED - onboarding needed,https://www.cybo.com/PH/san-jose-central-luzon/computer-repair/,https://www.google.com/maps/search/?api=1&query=Megabit%20%28computer%20repair%20listing%29%2C%20San%20Jose%20de%20Buenavista%2C%20Antique%2C%20Philippines,"https://www.google.com/maps?q=10.7353625,121.9517656",Cybo listing; business pin not field-checked; potentially overlaps another Megabit lead; confirm before publishing,https://www.google.com/maps/search/?api=1&query=Megabit%20%28computer%20repair%20listing%29%2C%20San%20Jose%20de%20Buenavista%2C%20Antique
R014,Megabit Technologies (Acer listed partner),Computer / printer,Acer authorized service contact / computing,"Robinsons Place Antique, Brgy. San Angel",,,,Not resolved,Unresolved,(036) 540 3865; 0998 070 2197,UNVERIFIED - onboarding needed,,https://www.acer.com/ph-en/support/contact-acer/service-contact,,; potentially overlaps another Megabit lead; confirm before publishing,https://www.google.com/maps/search/?api=1&query=Megabit%20Technologies%20%28Acer%20listed%20partner%29%2C%20San%20Jose%20de%20Buenavista%2C%20Antique
R015,Microworks Computer Store,Computer / printer,Computer retail; repairs in some listings,Ricarze Street (PWWR+C8X),10.7448,121.94065,,Published business GPS,Third-party map pin,0905 333 9575,UNVERIFIED - onboarding needed,https://philippines.worldplaces.me/review/87343480-microworks-computer-store.html,https://www.google.com/maps/search/?api=1&query=Microworks%20Computer%20Store%2C%20San%20Jose%20de%20Buenavista%2C%20Antique%2C%20Philippines,"https://www.google.com/maps?q=10.7448000,121.9406500",WorldPlaces publishes coordinates for Ricarze St location,https://www.google.com/maps/search/?api=1&query=Microworks%20Computer%20Store%2C%20San%20Jose%20de%20Buenavista%2C%20Antique
R016,Rapidé San Jose Antique,Car / mechanic,PMS; oil change; brakes; tires & battery services,General Fullon Street,,,,Not resolved,Unresolved,0999 429 4810; 0995 741 1177,UNVERIFIED - onboarding needed,,https://rapide.ph/branch-locator,,,https://www.google.com/maps/search/?api=1&query=Rapid%C3%A9%20San%20Jose%20Antique%2C%20San%20Jose%20de%20Buenavista%2C%20Antique
R017,F&E Autostore Antique,Car / mechanic,Auto repair; maintenance; cooling; brakes; tires,Bagumbayan (PWRX+JPC),10.7415625,121.9492656,PWRX+JPC,Published Plus Code (decoded center),Map code cell center,0997 902 0727,UNVERIFIED - onboarding needed,https://www.cybo.com/PH/san-jose-central-luzon/car-repair/,https://www.google.com/maps/search/?api=1&query=F%26E%20Autostore%20Antique%2C%20San%20Jose%20de%20Buenavista%2C%20Antique%2C%20Philippines,"https://www.google.com/maps?q=10.7415625,121.9492656",Cybo listing; business pin not field-checked,https://www.google.com/maps/search/?api=1&query=F%26E%20Autostore%20Antique%2C%20San%20Jose%20de%20Buenavista%2C%20Antique
R018,AUSPIN Automotive Care Services,Car / mechanic,Car repairs; parts; wheel alignment,Cemetery Road,,,,Not resolved,Unresolved,0981 270 0153,UNVERIFIED - onboarding needed,,https://www.google.com/maps/search/?api=1&query=AUSPIN%20Automotive%20Care%20Services%2C%20San%20Jose%20de%20Buenavista%2C%20Antique%2C%20Philippines,,,https://www.google.com/maps/search/?api=1&query=AUSPIN%20Automotive%20Care%20Services%2C%20San%20Jose%20de%20Buenavista%2C%20Antique
R019,Santolices Auto Repair (English Motors),Car / mechanic,Auto/body repair; bumper and panel work,Augusto Salazar Street (QW3M+WGP),10.7547375,121.9352969,QW3P+V4V,Published Plus Code (decoded center),Map code cell center,0927 609 7440,UNVERIFIED - onboarding needed,https://halaman-kuning.cybo.com/PH/san-jose-iOXB/pembaikan-komputer%C2%A0dan%C2%A0barang-barang-rumah/,https://www.google.com/maps/search/?api=1&query=Santolices%20Auto%20Repair%20%28English%20Motors%29%2C%20San%20Jose%20de%20Buenavista%2C%20Antique%2C%20Philippines,"https://www.google.com/maps?q=10.7547375,121.9352969","Cybo listing; business pin not field-checked; original research used QW3M+WGP, newer Cybo listing reports QW3P+V4V — conflicting pins",https://www.google.com/maps/search/?api=1&query=Santolices%20Auto%20Repair%20%28English%20Motors%29%2C%20San%20Jose%20de%20Buenavista%2C%20Antique
R020,Armel's Car Aircon,Car / mechanic,Vehicle aircon diagnostics/repair,Brgy. 8 (PWVW+6QW),10.7431125,121.9469531,PWVW+6QW,Published Plus Code (decoded center),Map code cell center,0910 105 2164,UNVERIFIED - onboarding needed,https://www.bizippines.com/armels-car-aircon-0910-105-2164,https://www.bizippines.com/armels-car-aircon-0910-105-2164,"https://www.google.com/maps?q=10.7431125,121.9469531",Bizippines / Cybo; business pin not field-checked,https://www.google.com/maps/search/?api=1&query=Armel%27s%20Car%20Aircon%2C%20San%20Jose%20de%20Buenavista%2C%20Antique
R021,Cepe Auto Electrical and Electronic Shop,Auto electrical / battery,Vehicle electrical troubleshooting,"Purok 2, San Fernando",,,,Not resolved,Unresolved,(036) 641 6007,UNVERIFIED - onboarding needed,,https://www.google.com/maps/search/?api=1&query=Cepe%20Auto%20Electrical%20and%20Electronic%20Shop%2C%20San%20Jose%20de%20Buenavista%2C%20Antique%2C%20Philippines,,,https://www.google.com/maps/search/?api=1&query=Cepe%20Auto%20Electrical%20and%20Electronic%20Shop%2C%20San%20Jose%20de%20Buenavista%2C%20Antique
R022,Eko Battery & Auto Electrical Shop,Auto electrical / battery,Battery and auto electrical repair,"T.A. Fornier St., Atabay",,,,Not resolved,Unresolved,0916 278 6386,UNVERIFIED - onboarding needed,,https://www.google.com/maps/search/?api=1&query=Eko%20Battery%20%26%20Auto%20Electrical%20Shop%2C%20San%20Jose%20de%20Buenavista%2C%20Antique%2C%20Philippines,,,https://www.google.com/maps/search/?api=1&query=Eko%20Battery%20%26%20Auto%20Electrical%20Shop%2C%20San%20Jose%20de%20Buenavista%2C%20Antique
R023,ARS Welding and Vulcanizing Shop,Tires / vulcanizing,Vulcanizing and welding,"Pag-asa St., San Pedro",,,,Not resolved,Unresolved,0968 251 2401,UNVERIFIED - onboarding needed,,https://www.google.com/maps/search/?api=1&query=ARS%20Welding%20and%20Vulcanizing%20Shop%2C%20San%20Jose%20de%20Buenavista%2C%20Antique%2C%20Philippines,,,https://www.google.com/maps/search/?api=1&query=ARS%20Welding%20and%20Vulcanizing%20Shop%2C%20San%20Jose%20de%20Buenavista%2C%20Antique
R024,Norbing's Vulcanizing Shop,Tires / vulcanizing,Vulcanizing/tire work,QWCW+MW,10.7716875,121.9473125,QWCW+MW,Published Plus Code (decoded center),Map code cell center,,UNVERIFIED - onboarding needed,https://www.cybo.com/PH/san-jose-central-luzon/car-repair/,https://www.google.com/maps/search/?api=1&query=Norbing%27s%20Vulcanizing%20Shop%2C%20San%20Jose%20de%20Buenavista%2C%20Antique%2C%20Philippines,"https://www.google.com/maps?q=10.7716875,121.9473125",Cybo listing; business pin not field-checked,https://www.google.com/maps/search/?api=1&query=Norbing%27s%20Vulcanizing%20Shop%2C%20San%20Jose%20de%20Buenavista%2C%20Antique
R025,REDJACk Tires Trading,Tires / vulcanizing,Tire sales; ask about puncture repair,E. Mayor Nietes Street,,,,Not resolved,Unresolved,0945 487 1007,UNVERIFIED - onboarding needed,,https://www.google.com/maps/search/?api=1&query=REDJACk%20Tires%20Trading%2C%20San%20Jose%20de%20Buenavista%2C%20Antique%2C%20Philippines,,,https://www.google.com/maps/search/?api=1&query=REDJACk%20Tires%20Trading%2C%20San%20Jose%20de%20Buenavista%2C%20Antique
R026,Yamaha 3S Shop - Des Marketing,Motorcycle,Yamaha motorcycle service and parts,"RMU Building 3, Dalipe Tradetown",,,,Not resolved,Unresolved,0917 581 8348,UNVERIFIED - onboarding needed,,https://www.google.com/maps/search/?api=1&query=Yamaha%203S%20Shop%20-%20Des%20Marketing%2C%20San%20Jose%20de%20Buenavista%2C%20Antique%2C%20Philippines,,,https://www.google.com/maps/search/?api=1&query=Yamaha%203S%20Shop%20-%20Des%20Marketing%2C%20San%20Jose%20de%20Buenavista%2C%20Antique
R027,Du Ek Sam - Antique Honda 3S,Motorcycle,Honda motorcycle servicing and parts,Bagumbayan Bridge area (PWRX+HQ6),10.7414125,121.9493906,PWRX+HQ6,Published Plus Code (decoded center),Map code cell center,0919 911 4792,UNVERIFIED - onboarding needed,https://www.google.com/maps/search/?api=1&query=Du%20Ek%20Sam%20-%20Antique%20Honda%203S%2C%20San%20Jose%20de%20Buenavista%2C%20Antique%2C%20Philippines,https://www.google.com/maps/search/?api=1&query=Du%20Ek%20Sam%20-%20Antique%20Honda%203S%2C%20San%20Jose%20de%20Buenavista%2C%20Antique%2C%20Philippines,"https://www.google.com/maps?q=10.7414125,121.9493906",Original research map location code; business pin not field-checked,https://www.google.com/maps/search/?api=1&query=Du%20Ek%20Sam%20-%20Antique%20Honda%203S%2C%20San%20Jose%20de%20Buenavista%2C%20Antique
R028,Guanzon - San Jose Antique,Motorcycle,Motorcycle repair/service and parts,"Tradetown, RMU 3 Building",,,,Not resolved,Unresolved,0917 123 3799,UNVERIFIED - onboarding needed,,https://www.google.com/maps/search/?api=1&query=Guanzon%20-%20San%20Jose%20Antique%2C%20San%20Jose%20de%20Buenavista%2C%20Antique%2C%20Philippines,,,https://www.google.com/maps/search/?api=1&query=Guanzon%20-%20San%20Jose%20Antique%2C%20San%20Jose%20de%20Buenavista%2C%20Antique
R029,Opao Motorcycle Repair Shop,Motorcycle,Motorcycle repairs,Bantayan Road (PWXR+R8X),10.7496125,121.9408594,PWXR+R8X,Published Plus Code (decoded center),Map code cell center,,UNVERIFIED - onboarding needed,https://yellowpages-tl.cybo.com/PH/san-jose-gitnang-luzon/sasakyan,https://yellowpages-tl.cybo.com/PH/san-jose-gitnang-luzon/sasakyan,"https://www.google.com/maps?q=10.7496125,121.9408594",Cybo listing; business pin not field-checked,https://www.google.com/maps/search/?api=1&query=Opao%20Motorcycle%20Repair%20Shop%2C%20San%20Jose%20de%20Buenavista%2C%20Antique
R030,Powerhouse / Authorized Yamaha Spare Parts,Motorcycle,Motorcycle parts; possible maintenance,Governor General Fullon Street,,,,Not resolved,Unresolved,(036) 540 9883,UNVERIFIED - onboarding needed,,https://www.google.com/maps/search/?api=1&query=Powerhouse%20/%20Authorized%20Yamaha%20Spare%20Parts%2C%20San%20Jose%20de%20Buenavista%2C%20Antique%2C%20Philippines,,,https://www.google.com/maps/search/?api=1&query=Powerhouse%20/%20Authorized%20Yamaha%20Spare%20Parts%2C%20San%20Jose%20de%20Buenavista%2C%20Antique
R031,Mors Motor Vehicle Parts & Accessories Shop,Motorcycle,Motorcycle parts retailer,"Bagumbayan Bridge, Brgy. 8",,,,Not resolved,Unresolved,,UNVERIFIED - onboarding needed,,https://www.google.com/maps/search/?api=1&query=Mors%20Motor%20Vehicle%20Parts%20%26%20Accessories%20Shop%2C%20San%20Jose%20de%20Buenavista%2C%20Antique%2C%20Philippines,,,https://www.google.com/maps/search/?api=1&query=Mors%20Motor%20Vehicle%20Parts%20%26%20Accessories%20Shop%2C%20San%20Jose%20de%20Buenavista%2C%20Antique
R032,Stone's Bike Shop,Bicycle,Bicycle repairs and parts,PWWR+4V9,10.7452875,121.9422344,PWWR+4V9,Published Plus Code (decoded center),Map code cell center,(036) 540 8856,UNVERIFIED - onboarding needed,https://www.cybo.com/PH/san-francisco-iVU/bicycles/,https://www.google.com/maps/search/?api=1&query=Stone%27s%20Bike%20Shop%2C%20San%20Jose%20de%20Buenavista%2C%20Antique%2C%20Philippines,"https://www.google.com/maps?q=10.7452875,121.9422344",Cybo listing; business pin not field-checked,https://www.google.com/maps/search/?api=1&query=Stone%27s%20Bike%20Shop%2C%20San%20Jose%20de%20Buenavista%2C%20Antique
R033,Fritz & Bryle Auto Refinishing Shop,Car / mechanic,Auto refinishing / detailing,Representative E. Nietes St.,,,,Not resolved,Unresolved,,UNVERIFIED - onboarding needed,,https://www.google.com/maps/search/?api=1&query=Fritz%20%26%20Bryle%20Auto%20Refinishing%20Shop%2C%20San%20Jose%20de%20Buenavista%2C%20Antique%2C%20Philippines,,,https://www.google.com/maps/search/?api=1&query=Fritz%20%26%20Bryle%20Auto%20Refinishing%20Shop%2C%20San%20Jose%20de%20Buenavista%2C%20Antique
R034,JE Slasher Auto Hub (social lead),Car / mechanic,Claimed vulcanizing/car-care offering,Maybato Norte,,,,Not resolved,Unresolved,,UNVERIFIED - onboarding needed,,https://www.facebook.com/je.slasher.54/videos/soon-to-open-je-slasher-auto-hub-your-auto-care-maintenance-partner-with-experie/1119475187072970/,,,https://www.google.com/maps/search/?api=1&query=JE%20Slasher%20Auto%20Hub%20%28social%20lead%29%2C%20San%20Jose%20de%20Buenavista%2C%20Antique
N001,Circle Compubiz Antique,Computer / printer,Computer sales and service; repair category,T.A. Fornier Street,10.74989,121.94137,,Published business GPS,Third-party map pin,0927 735 7150,UNVERIFIED - onboarding needed,https://philippines.worldplaces.me/review/85199875-circle-compubiz-antique.html,https://philippines.worldplaces.me/review/85199875-circle-compubiz-antique.html,"https://www.google.com/maps?q=10.7498900,121.9413700",Service scope needs direct confirmation,https://www.google.com/maps/search/?api=1&query=Circle%20Compubiz%20Antique%2C%20San%20Jose%20de%20Buenavista%2C%20Antique
N002,Jasmine's Electronic Gadgets & Computer Works,Phone / computer,Computer and gadget service business,Centillion Building,10.7522,121.941,,Published business GPS,Third-party map pin,0915 675 0544,UNVERIFIED - onboarding needed,https://philippines.worldplaces.me/review/91218229-jasmine-s-electronic-gadgets-and-computer-works.html,https://philippines.worldplaces.me/review/91218229-jasmine-s-electronic-gadgets-and-computer-works.html,"https://www.google.com/maps?q=10.7522000,121.9410000",Published source GPS; confirm operating address,https://www.google.com/maps/search/?api=1&query=Jasmine%27s%20Electronic%20Gadgets%20%26%20Computer%20Works%2C%20San%20Jose%20de%20Buenavista%2C%20Antique
N003,IF Motor Parts & Accessories,Motorcycle,Listed as motorcycle repair shop; description primarily parts retail,C.O. Zaldivar Street,10.7452,121.94276,,Published business GPS,Third-party map pin,,UNVERIFIED - onboarding needed,https://philippines.worldplaces.me/review/85143389-if-motor-parts-and-accessories.html,https://philippines.worldplaces.me/review/85143389-if-motor-parts-and-accessories.html,"https://www.google.com/maps?q=10.7452000,121.9427600",Actual repair acceptance unconfirmed; parts store,https://www.google.com/maps/search/?api=1&query=IF%20Motor%20Parts%20%26%20Accessories%2C%20San%20Jose%20de%20Buenavista%2C%20Antique
N004,JHM Motorcycle Parts and Accessories,Motorcycle,"Explicit motorcycle setups, repairs and painting",Gen. Fullon corner Cerdeña Street,10.74378,121.94385,,Published business GPS,Third-party map pin,(036) 540 1010,UNVERIFIED - onboarding needed,https://philippines.worldplaces.me/review/96892842-jhm-motorcycle-parts-and-accessories.html,https://philippines.worldplaces.me/review/96892842-jhm-motorcycle-parts-and-accessories.html,"https://www.google.com/maps?q=10.7437800,121.9438500",Website explicitly offers repairs,https://www.google.com/maps/search/?api=1&query=JHM%20Motorcycle%20Parts%20and%20Accessories%2C%20San%20Jose%20de%20Buenavista%2C%20Antique
N005,JB Bike Shop,Bicycle,Bicycle shop; repair availability unconfirmed,Cerdeña Street,10.7442375,121.9440469,PWVV+MJV,Published Plus Code (decoded center),Map code cell center,,UNVERIFIED - onboarding needed,https://www.cybo.com/PH/san-francisco-iVU/bicycles/,https://www.cybo.com/PH/san-francisco-iVU/bicycles/,"https://www.google.com/maps?q=10.7442375,121.9440469",Check bicycle repair offerings,https://www.google.com/maps/search/?api=1&query=JB%20Bike%20Shop%2C%20San%20Jose%20de%20Buenavista%2C%20Antique
N006,FC Antique,Computer / printer,Computer repair listing,3 Tobias A. Fornier Street,,,,Not resolved,Unresolved,(036) 268 3835,UNVERIFIED - onboarding needed,,https://www.cybo.com/PH/san-jose-central-luzon/computer-repair/,,Street-level address only; request storefront pin,https://www.google.com/maps/search/?api=1&query=FC%20Antique%2C%20San%20Jose%20de%20Buenavista%2C%20Antique
N007,S&J Motors,Car / automotive,Listed in automotive/car repair category,"QW3Q+Q7R, San Jose Antique",10.7544875,121.9381406,QW3Q+Q7R,Published Plus Code (decoded center),Map code cell center,,UNVERIFIED - onboarding needed,https://yellowpages-tl.cybo.com/PH/san-jose-gitnang-luzon/sasakyan,https://yellowpages-tl.cybo.com/PH/san-jose-gitnang-luzon/sasakyan,"https://www.google.com/maps?q=10.7544875,121.9381406",Confirm services and shop ownership,https://www.google.com/maps/search/?api=1&query=S%26J%20Motors%2C%20San%20Jose%20de%20Buenavista%2C%20Antique
N008,Lex Lan Auto Repair Shop,Car / automotive,Listed auto repair shop,"PWRX+GQ5, San Jose Antique",10.7412625,121.9494844,PWRX+GQ5,Published Plus Code (decoded center),Map code cell center,,UNVERIFIED - onboarding needed,https://halaman-kuning.cybo.com/PH/san-jose-iOXB/pembaikan-komputer%C2%A0dan%C2%A0barang-barang-rumah/,https://halaman-kuning.cybo.com/PH/san-jose-iOXB/pembaikan-komputer%C2%A0dan%C2%A0barang-barang-rumah/,"https://www.google.com/maps?q=10.7412625,121.9494844",Confirm currently operating,https://www.google.com/maps/search/?api=1&query=Lex%20Lan%20Auto%20Repair%20Shop%2C%20San%20Jose%20de%20Buenavista%2C%20Antique
N009,Kars,Car / automotive,Listed car repair category,"Bubog, QW6Q+JJ2",10.7615125,121.9390156,QW6Q+JJ2,Published Plus Code (decoded center),Map code cell center,,UNVERIFIED - onboarding needed,https://faqet-e-verdha.cybo.com/PH/san-jose-xF9AJU/riparimi-i-makinave-,https://faqet-e-verdha.cybo.com/PH/san-jose-xF9AJU/riparimi-i-makinave-,"https://www.google.com/maps?q=10.7615125,121.9390156",Generic business name; confirm identity,https://www.google.com/maps/search/?api=1&query=Kars%2C%20San%20Jose%20de%20Buenavista%2C%20Antique
N010,RJMB Welding Shop,Welding / automotive,Welding services,"QWVR+FJ3, San Jose Antique",10.7936375,121.9415469,QWVR+FJ3,Published Plus Code (decoded center),Map code cell center,,UNVERIFIED - onboarding needed,https://faqet-e-verdha.cybo.com/PH/san-jose-xF9AJU/riparimi-i-makinave-,https://faqet-e-verdha.cybo.com/PH/san-jose-xF9AJU/riparimi-i-makinave-,"https://www.google.com/maps?q=10.7936375,121.9415469",Confirm vehicle repair scope,https://www.google.com/maps/search/?api=1&query=RJMB%20Welding%20Shop%2C%20San%20Jose%20de%20Buenavista%2C%20Antique
N011,Exel Vulcanizing Shop,Tires / vulcanizing,Vulcanizing shop,"Tradetown, 3 Calle Uno de Mayo",,,,Not resolved,Unresolved,,UNVERIFIED - onboarding needed,,https://yellowpages-tl.cybo.com/PH/san-jose-gitnang-luzon/sasakyan,,No verified numeric storefront coordinates,https://www.google.com/maps/search/?api=1&query=Exel%20Vulcanizing%20Shop%2C%20San%20Jose%20de%20Buenavista%2C%20Antique
N012,Lopez Welding Shop,Welding / automotive,"Lopez Compound, Nietes Street, Brgy. 8",,,,Not resolved,Unresolved,,UNVERIFIED - onboarding needed,,https://faqet-e-verdha.cybo.com/PH/san-jose-xF9AJU/riparimi-i-makinave-,,No verified numeric storefront coordinates,https://www.google.com/maps/search/?api=1&query=Lopez%20Welding%20Shop%2C%20San%20Jose%20de%20Buenavista%2C%20Antique
N013,TRJ Auto Service Center,Car / automotive,Auto service center,"San Jose, Antique",,,,Not resolved,Unresolved,,UNVERIFIED - onboarding needed,,https://yellowpages-tl.cybo.com/PH/san-jose-gitnang-luzon/sasakyan,,No precise location published,https://www.google.com/maps/search/?api=1&query=TRJ%20Auto%20Service%20Center%2C%20San%20Jose%20de%20Buenavista%2C%20Antique
N014,Vernz Motorcycle Parts and Accessories Shop,Motorcycle,Parts and accessories; repair service unconfirmed,Cemetery Road,,,,Not resolved,Unresolved,,UNVERIFIED - onboarding needed,,https://yellowpages-tl.cybo.com/PH/san-jose-gitnang-luzon/sasakyan,,Consider only if parts retail is a supported category,https://www.google.com/maps/search/?api=1&query=Vernz%20Motorcycle%20Parts%20and%20Accessories%20Shop%2C%20San%20Jose%20de%20Buenavista%2C%20Antique`;

const Papa = require("papaparse");

const headerIndex = rawCsv.indexOf("Lead ID,");
const csvBody = headerIndex !== -1 ? rawCsv.substring(headerIndex) : rawCsv;

const parsed = Papa.parse(csvBody, {
  header: true,
  skipEmptyLines: true,
});

// Filter only rows that have a valid Lead ID starting with R or N
const leadRows = parsed.data.filter((row) => row["Lead ID"] && (row["Lead ID"].startsWith("R") || row["Lead ID"].startsWith("N")));

console.log(`Parsed ${leadRows.length} repairer leads from CSV.`);

// Standardize category name to match our system
function normalizeCategory(cat) {
  if (!cat) return "Other Services";
  const c = cat.toLowerCase();
  if (c.includes("appliance") || c.includes("aircon")) return "Appliance Repair";
  if (c.includes("phone") || c.includes("gadget")) return "Mobile Phone & Gadget Repair";
  if (c.includes("computer") || c.includes("printer")) return "Computer, Laptop & Printer Repair";
  if (c.includes("car") || c.includes("automotive")) return "Car & Automotive Services";
  if (c.includes("motorcycle")) return "Motorcycle Services";
  if (c.includes("tire") || c.includes("vulcanizing")) return "Roadside Assistance";
  if (c.includes("bicycle")) return "Motorcycle Services";
  if (c.includes("welding")) return "Roadside Assistance";
  return "Home Maintenance";
}

// Extract barangay if mentioned in address
function extractBarangay(address) {
  if (!address) return "San Jose de Buenavista";
  const a = address.toLowerCase();
  if (a.includes("brgy. 1") || a.includes("barangay 1")) return "Barangay 1 (Poblacion)";
  if (a.includes("brgy. 2") || a.includes("barangay 2")) return "Barangay 2 (Poblacion)";
  if (a.includes("brgy. 3") || a.includes("barangay 3")) return "Barangay 3 (Poblacion)";
  if (a.includes("brgy. 4") || a.includes("barangay 4")) return "Barangay 4 (Poblacion)";
  if (a.includes("brgy. 5") || a.includes("barangay 5")) return "Barangay 5 (Poblacion)";
  if (a.includes("brgy. 6") || a.includes("barangay 6")) return "Barangay 6 (Poblacion)";
  if (a.includes("brgy. 7") || a.includes("barangay 7")) return "Barangay 7 (Poblacion)";
  if (a.includes("brgy. 8") || a.includes("barangay 8")) return "Barangay 8 (Poblacion)";
  if (a.includes("atabay")) return "Atabay";
  if (a.includes("funda-dalipe") || a.includes("dalipe")) return "Funda-Dalipe";
  if (a.includes("maybato norte")) return "Maybato Norte";
  if (a.includes("maybato sur") || a.includes("maybato")) return "Maybato Sur";
  if (a.includes("san angel")) return "San Angel";
  if (a.includes("san fernando")) return "San Fernando";
  if (a.includes("san pedro")) return "San Pedro";
  if (a.includes("bagumbayan")) return "Bagumbayan";
  if (a.includes("bantayan")) return "Bantayan";
  if (a.includes("bubog")) return "Bubog";
  if (a.includes("malaiba") || a.includes("cemetery")) return "Malaiba";
  return "San Jose de Buenavista";
}

const formattedLeads = leadRows.map((row) => {
  const latStr = row["Latitude"] ? row["Latitude"].trim() : "";
  const lngStr = row["Longitude"] ? row["Longitude"].trim() : "";
  const hasCoordinates = Boolean(latStr && lngStr && !isNaN(Number(latStr)) && !isNaN(Number(lngStr)));

  const coordinates = hasCoordinates
    ? { lat: Number(latStr), lng: Number(lngStr) }
    : null;

  return {
    id: row["Lead ID"],
    name: row["Business / provider"],
    category: normalizeCategory(row["Category"]),
    subcategory: row["Category"],
    services: row["Listed repair/service work"] || "",
    location: row["Public address"] || "San Jose de Buenavista",
    barangay: extractBarangay(row["Public address"]),
    municipality: "San Jose de Buenavista",
    phone: row["Public business phone"] || "",
    sourceType: row["GPS derivation"] || "Public directory",
    evidenceStrength: row["Map precision"] || "Unresolved",
    plusCode: row["Plus Code"] || "",
    gpsDerivation: row["GPS derivation"] || "Not resolved",
    mapPrecision: row["Map precision"] || "Unresolved",
    providerVerification: row["Provider verification"] || "UNVERIFIED - onboarding needed",
    coordinateSourceUrl: row["Coordinate source URL"] || "",
    listingUrl: row["Business listing source URL"] || "",
    googleMapsPinUrl: row["Google Maps GPS pin"] || "",
    locationCaveats: row["Location caveats / follow-up"] || "",
    googleMapsSearchUrl: row["Google Maps name search"] || "",
    coordinates,
    hasResolvedCoordinates: hasCoordinates,
    mobileRoadsideDispatch: "Not established",
    outreachStatus: "Not contacted",
    isPromotedToProvider: false,
  };
});

const withCoords = formattedLeads.filter((l) => l.hasResolvedCoordinates);
const withoutCoords = formattedLeads.filter((l) => !l.hasResolvedCoordinates);

console.log(`Formatted total leads: ${formattedLeads.length}`);
console.log(`With resolved GPS coordinates: ${withCoords.length}`);
console.log(`Needing storefront coordinates: ${withoutCoords.length}`);

// Write JSON
const outputPath = path.join(__dirname, "..", "data", "antique_provider_leads.json");
fs.writeFileSync(outputPath, JSON.stringify(formattedLeads, null, 2), "utf8");
console.log(`Saved updated leads to ${outputPath}`);

// Also copy or write data/antique_provider_leads.csv
const outputCsvPath = path.join(__dirname, "..", "data", "antique_provider_leads.csv");
if (fs.existsSync("c:/Users/jhonk/Downloads/We_Got_You_Repairers_Latitude_Longitude.csv")) {
  fs.copyFileSync("c:/Users/jhonk/Downloads/We_Got_You_Repairers_Latitude_Longitude.csv", outputCsvPath);
  console.log(`Synced latest CSV to ${outputCsvPath}`);
}
