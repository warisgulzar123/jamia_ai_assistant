/**
 * Official Seed Dataset for Jamiatul Madina (دعوتِ اسلامی) - 50 Records
 */
const initialKnowledgeData = [
  {
    category: 'Overview',
    question: 'What is Jamiatul Madina? / جامعۃ المدینہ کیا ہے؟',
    answer: 'Jamiatul Madina is an international chain of Islamic educational institutes established by Dawat-e-Islami, providing traditional Islamic studies including Dars-e-Nizami (Alim Course) alongside modern education. جامعۃ المدینہ دعوتِ اسلامی کے تحت قائم ہونے والا ایک بین الاقوامی دینی تعلیمی ادارہ ہے جہاں درسِ نظامی (عالم کورس) اور عصری علوم کی تعلیم دی جاتی ہے۔',
    keywords: ['jamiatul madina', 'introduction', 'overview', 'what is', 'جامعۃ المدینہ', 'تعارف']
  },
  {
    category: 'History',
    question: 'When and where was the first Jamiatul Madina established? / پہلی جامعۃ المدینہ کب اور کہاں قائم کی گئی تھی؟',
    answer: 'The first Dars-e-Nizami class started in September 1994 in New Karachi, Godhra Colony, Karachi, with over 50 students. Initially called Madrasa-tul-Madinah, it was later renamed to Jamia-tul-Madinah. درسِ نظامی کی پہلی کلاس ستمبر 1994 میں نیو کراچی، گودھرا کالونی، کراچی میں شروع ہوئی جس میں 50 سے زائد طلبہ شریک تھے۔',
    keywords: ['established', 'history', 'first branch', '1994', 'godhra colony', 'تاریخ', 'قیام', 'گودھرا کالونی']
  },
  {
    category: 'Affiliation',
    question: 'Which educational board is Jamiatul Madina affiliated with? / جامعۃ المدینہ کس تعلیمی بورڈ سے الحاق شدہ ہے؟',
    answer: 'Jamiatul Madina is affiliated with the Kanz-ul-Madaris Board International (and Tanzeem-ul-Madaris). جامعۃ المدینہ کا الحاق کنز المدارس بورڈ انٹرنیشنل (اور تنظیم المدارس) سے ہے۔',
    keywords: ['board', 'affiliation', 'kanz ul madaris', 'tanzeem ul madaris', 'الحاق', 'کنز المدارس']
  },
  {
    category: 'Stats',
    question: 'How many branches of Jamiatul Madina exist worldwide? / دنیا بھر میں جامعۃ المدینہ کی کتنی شاخیں ہیں؟',
    answer: 'There are approximately 1,542 branches of Jamiatul Madina spread across 20 countries around the world. دنیا کے 20 سے زائد ممالک میں جامعۃ المدینہ کی تقریباً 1,542 شاخیں قائم ہیں۔',
    keywords: ['branches', 'countries', 'total branches', 'worldwide', 'شاخیں', 'ممالک', 'تعداد']
  },
  {
    category: 'Stats',
    question: 'How many total students are currently studying in Jamiatul Madina? / جامعۃ المدینہ میں اس وقت کل کتنے طلبہ زیرِ تعلیم ہیں؟',
    answer: 'There are approximately 136,252 active students enrolled in Jamiatul Madina branches globally. عالمی سطح پر جامعۃ المدینہ کی شاخوں میں تقریباً 136,252 طلبہ و طالبات زیرِ تعلیم ہیں۔',
    keywords: ['total students', 'enrollment', 'student strength', 'طلبہ', 'تعداد']
  },
  {
    category: 'Stats',
    question: 'How many total students have graduated from Jamiatul Madina? / اب تک کتنے طلبہ جامعۃ المدینہ سے فارغ التحصیل ہو چکے ہیں؟',
    answer: 'Approximately 36,003 students have successfully graduated (passed out) from Jamiatul Madina globally. اب تک تقریباً 36,003 طلبہ جامعۃ المدینہ سے کورس مکمل کر کے فارغ التحصیل (الماء/فاضل) ہو چکے ہیں۔',
    keywords: ['passout', 'graduates', 'alumni', 'فارغ التحصیل', 'اسناد']
  },
  {
    category: 'Courses',
    question: 'What is the primary course offered at Jamiatul Madina? / جامعۃ المدینہ میں بنیادی کورس کون سا ہے؟',
    answer: 'The primary course is Dars-e-Nizami (Shahadat-ul-Alimiyyah / Islamic Scholar Course) along with specialization courses (Takhassus). بنیادی کورس درسِ نظامی (شہادت العالمیہ / عالم کورس) ہے جس کے ساتھ تخصیصات بھی کروائی جاتی ہیں۔',
    keywords: ['courses', 'dars e nizami', 'alim course', 'programs', 'درس نظامی', 'عالم کورس']
  },
  {
    category: 'Courses',
    question: 'What is the total duration of the Dars-e-Nizami (Alim Course)? / درسِ نظامی (عالم کورس) کا کل دورانیہ کتنا ہے؟',
    answer: 'The complete Dars-e-Nizami course duration is 8 years divided into academic stages. درسِ نظامی کا مکمل کورس 8 سال پر مشتمل ہوتا ہے۔',
    keywords: ['duration', 'how many years', 'alim course length', 'دورانیہ', 'سال']
  },
  {
    category: 'Branches',
    question: 'Does Jamiatul Madina have separate campuses for boys and girls? / کیا طلبہ اور طالبات کے لیے الگ الگ کیمپس ہیں؟',
    answer: 'Yes, Jamiatul Madina operates separate campuses for boys (Boys) and girls (Lil-Banat) in Pakistan and internationally. جی ہاں، پاکستان اور بیرونِ ملک طلبہ (للبنین) اور طالبات (للبنات) کے لیے الگ الگ کیمپس موجود ہیں۔',
    keywords: ['boys', 'girls', 'lilbanat', 'separate branches', 'للبنین', 'للبنات']
  },
  {
    category: 'Admission',
    question: 'What are the basic admission requirements for Jamiatul Madina? / جامعۃ المدینہ میں داخلے کی بنیادی شرائط کیا ہیں؟',
    answer: 'Applicants generally need matriculation or Middle (with Hifz), clear an entry test/interview, and follow Madani environment rules. داخلے کے لیے میٹرک یا حفظ کے ساتھ مڈل پاس ہونا، ٹیسٹ اور انٹرویو پاس کرنا لازمی ہے۔',
    keywords: ['admission requirements', 'eligibility', 'criteria', 'داخلہ', 'شرائط', 'اہلیت']
  },
  {
    category: 'Departments',
    question: 'What is the role of the Examination Department? / امتحانات کا شعبہ (Examination Department) کیا کام کرتا ہے؟',
    answer: 'The Examination Department conducts transparent centralized examinations, evaluates papers, and manages results under Kanz-ul-Madaris. یہ شعبہ مرکزی شفاف امتحانات کا انعقاد اور نتائج کا اجراء کرتا ہے۔',
    keywords: ['examination department', 'exams', 'evaluation', 'امتحانات', 'شعبہ امتحانات']
  },
  {
    category: 'Departments',
    question: 'What is the role of the Education Department? / تعلیمی شعبہ (Education Department) کی کیا ذمہ داری ہے؟',
    answer: 'The Education Department designs curricula, oversees teaching methodologies, and maintains academic quality. تعلیمی شعبہ نصابِ تعلیم کی ترتیب اور تدریسی معیار کو مانیٹر کرتا ہے۔',
    keywords: ['education department', 'curriculum', 'academics', 'تعلیمی شعبہ', 'نصاب']
  },
  {
    category: 'Departments',
    question: 'What is the Digitalization & Media Department? / ڈیجیٹلائزیشن اور میڈیا ڈیپارٹمنٹ کا کیا کردار ہے؟',
    answer: 'It manages IT infrastructure, website updates, media coverage of convocation ceremonies, and digital publicity. یہ شعبہ آئی ٹی سسٹمز، ویب سائٹس اور تقریبات کی میڈیا کوریج سنبھالتا ہے۔',
    keywords: ['digitalization', 'media department', 'it department', 'ڈیجیٹلائزیشن', 'آئی ٹی']
  },
  {
    category: 'Contact',
    question: 'Where is the Head Office of Jamiatul Madina located? / جامعۃ المدینہ کا مرکزی دفتر کہاں واقع ہے؟',
    answer: 'The Global Markaz is located at Faizan-e-Madina, Main University Road, Karachi, Pakistan. مرکزی دفتر عالمی مدنی مرکز فیضانِ مدینہ، مین یونیورسٹی روڈ، کراچی میں واقع ہے۔',
    keywords: ['address', 'head office', 'location', 'karachi', 'مرکزی دفتر', 'پتہ', 'کراچی']
  },
  {
    category: 'Contact',
    question: 'What are the official contact numbers? / سرکاری رابطہ نمبر کیا ہیں؟',
    answer: 'You can reach out via +92 311 7864100 or +92 300 0220115. آپ دیے گئے ہیلپ لائن نمبرز پر رابطہ کر سکتے ہیں۔',
    keywords: ['phone number', 'helpline', 'contact number', 'رابطہ نمبر', 'ہیلپ لائن']
  },
  {
    category: 'Events',
    question: 'What is the Dastar-e-Fazilat Ceremony? / دستارِ فضیلت اجتماع کیا ہوتا ہے؟',
    answer: 'Dastar-e-Fazilat is the graduation convocation where graduating scholars receive turbans and certificates. یہ وہ وقار تقریب ہے جہاں فارغ التحصیل علما کو دستار باندھی جاتی ہے۔',
    keywords: ['dastar e fazilat', 'graduation ceremony', 'convocation', 'دستار فضیلت', 'تقریب']
  },
  {
    category: 'Structure',
    question: 'Is accommodation and food provided at Jamiatul Madina? / کیا جامعۃ المدینہ میں رہائش اور طعام کی سہولت ہے؟',
    answer: 'Yes, residential students are provided free hostel accommodation and meals (Food). جی ہاں، رہائشی طلبہ کے لیے ہاسٹل اور کھانے کا انتظام مفت ہوتا ہے۔',
    keywords: ['hostel', 'boarding', 'food', 'accommodation', 'ہاسٹل', 'کھانا', 'مفت']
  },
  {
    category: 'Structure',
    question: 'Is tuition fee charged at Jamiatul Madina? / کیا جامعۃ المدینہ میں فیس لی جاتی ہے؟',
    answer: 'Education is completely free (Fi Sabilillah) for deserving and regular students. مستحق اور باقاعدہ طلبہ کو تعلیم بالکل مفت فراہم کی جاتی ہے۔',
    keywords: ['fee structure', 'tuition fee', 'is it free', 'فیس', 'مفت تعلیم']
  },
  {
    category: 'Specialization',
    question: 'Does Jamiatul Madina offer Takhassus (Specialization)? / کیا تخصیصات (Specialization) کی سہولت موجود ہے؟',
    answer: 'Yes, in Fiqh (Ifta/Mufti course), Hadith, and Arabic literature after Dars-e-Nizami. جی ہاں، درسِ نظامی کے بعد فقہ (فتاویٰ/مفتی کورس) اور حدیث میں تخصیص کروائی جاتی ہے۔',
    keywords: ['takhassus', 'ifta course', 'mufti course', 'تخصیص', 'مفتی کورس']
  },
  {
    category: 'Language',
    question: 'In which languages are courses taught? / کورسز کس زبان میں پڑھائے جاتے ہیں؟',
    answer: 'Primary mediums are Urdu and Arabic, with English in international branches. بنیادی ذریعۂ تعلیم اردو اور عربی ہے، بیرونِ ملک انگریزی بھی استعمال ہوتی ہے۔',
    keywords: ['language', 'medium', 'arabic', 'urdu', 'زبان', 'اردو', 'عربی']
  },
  {
    category: 'Syllabus',
    question: 'What subjects are covered in Dars-e-Nizami? / درسِ نظامی میں کون سے مضامین شامل ہیں؟',
    answer: 'Grammar, Logic, Fiqh, Usul-ul-Fiqh, Tafseer, and Hadith are core subjects. صرف، نحو، منطق، فقہ، اصولِ فقہ، تفسیر اور حدیث کورس کے بنیادی مضامین ہیں۔',
    keywords: ['subjects', 'syllabus', 'mantiq', 'fiqh', 'hadith', 'مضامین', 'نصاب', 'فقہ']
  },
  {
    category: 'Library',
    question: 'Does Jamiatul Madina have library facilities? / کیا کتب خانہ (لائبریری) کی سہولت ہے؟',
    answer: 'Yes, every campus features a rich library with classical and modern Islamic books. ہر کیمپس میں کتب و رسائل پر مشتمل شاندار لائبریری موجود ہے۔',
    keywords: ['library', 'books', 'research', 'لائبریری', 'کتب خانہ']
  },
  {
    category: 'International',
    question: 'In which foreign countries are branches located? / بیرونِ ملک کن ممالک میں شاخیں ہیں؟',
    answer: 'UK, USA, India, UAE, South Africa, Bangladesh, and more. برطانیہ، امریکہ، بھارت، یو اے ای، جنوبی افریقہ اور بنگلہ دیش سمیت دیگر ممالک میں شاخیں ہیں۔',
    keywords: ['uk', 'usa', 'international', 'برطانیہ', 'امریکہ', 'بیرون ملک']
  },
  {
    category: 'Career',
    question: 'What career paths are available after graduation? / فراغت کے بعد کیا کیریئر کے مواقع ہیں؟',
    answer: 'Graduates serve as Imams, teachers, Muftis, scholars in Madani Channel, or administrators. طلبہ بطور امام، مدرس، مفتی، مبلغ اور مدنی چینل پر خدمت سرانجام دیتے ہیں۔',
    keywords: ['jobs', 'career', 'opportunities', 'کیریئر', 'روزگار', 'خدمات']
  },
  {
    category: 'Education System',
    question: 'How is moral training (Tarbiyyah) managed? / اخلاقی تربیت کا کیا نظام ہے؟',
    answer: 'Through daily congregational prayers, Sunnah-learning gatherings, and Madani Inamaat. باجماعت نمازوں، سنتوں بھرے اجتماعات اور مدنی انعامات کے ذریعے تربیت کی جاتی ہے۔',
    keywords: ['tarbiyat', 'moral training', 'ethics', 'تربیت', 'اخلاق', 'مدنی انعامات']
  },
  {
    category: 'Overview',
    question: 'Who is the founder and patron of Jamiatul Madina? / بانی اور سرپرست کون ہیں؟',
    answer: 'Ameer-e-Ahle-Sunnat Maulana Ilyas Attar Qadri. بانی امیرِ اہلسنت مولانا الیاس عطار قادری رضوی ہیں۔',
    keywords: ['founder', 'ilyas qadri', 'بانی', 'امیر اہلسنت']
  },
  {
    category: 'Courses',
    question: 'What is the age limit for admission (Boys)? / داخلے کے لیے عمر کی حد کیا ہے؟',
    answer: 'Generally 12 to 20 years for regular Dars-e-Nizami morning classes. عام طور پر 12 سے 20 سال تک کے طلبہ کے لیے داخلے ہوتے ہیں۔',
    keywords: ['age limit', 'eligibility age', 'عمر کی حد']
  },
  {
    category: 'Registration',
    question: 'Can I register online? / کیا آن لائن رجسٹریشن ہو سکتی ہے؟',
    answer: 'Yes, through the official website during admission seasons. جی ہاں، داخلہ سیزن میں آفیشل ویب سائٹ کے ذریعے فارم جمع ہوتے ہیں۔',
    keywords: ['online registration', 'apply online', 'آن لائن داخلہ']
  },
  {
    category: 'Kanz ul Madaris',
    question: 'What is Kanz-ul-Madaris Board? / کنز المدارس بورڈ کیا ہے؟',
    answer: 'The official educational board under Dawat-e-Islami for curriculum and exams. دعوتِ اسلامی کے تحت تعلیمی نظام اور امتحانات کو چلانے والا سرکاری تسلیم شدہ بورڈ ہے۔',
    keywords: ['kanz ul madaris board', 'کنز المدارس']
  },
  {
    category: 'Board Recognition',
    question: 'Is the degree equivalent to HEC standards? / کیا سند ایچ ای سی کے برابر تسلیم شدہ ہے؟',
    answer: 'Yes, Shahadat-ul-Alimiyyah is equivalent to M.A. Islamic Studies/Arabic. شہادت العالمیہ کی سند ایم اے اسلامیات/عربی کے مساوی ہے۔',
    keywords: ['degree recognition', 'hec', 'equivalence', 'مساوی', 'ایچ ای سی']
  },
  {
    category: 'Notice Board',
    question: 'Where to check exam results? / امتحان کے نتائج کہاں دیکھے جا سکتے ہیں؟',
    answer: 'On the official website notice board or Kanz-ul-Madaris portal. آفیشل ویب سائٹ یا نوٹس بورڈ پر نتائج جاری کیے جاتے ہیں۔',
    keywords: ['results', 'notice board', 'exam result', 'نتائج', 'نوٹس بورڈ']
  },
  {
    category: 'Courses',
    question: 'Are evening or short courses available? / کیا شام کے وقت یا شارٹ کورسز بھی ہیں؟',
    answer: 'Yes, Faizan-e-Shariat and evening diploma courses are offered. جی ہاں، فیضانِ شریعت اور شارٹ ڈپلومہ کورسز بھی کروائے جاتے ہیں۔',
    keywords: ['part time', 'evening course', 'short course', 'شارٹ کورس']
  },
  {
    category: 'Facilities',
    question: 'Are computer / IT labs available? / کیا کمپیوٹر لیب کی سہولت ہے؟',
    answer: 'Yes, modern campuses feature IT labs for student digital training. جدید کیمپسز میں طلبہ کی ڈیجیٹل تربیت کے لیے آئی ٹی لیبز موجود ہیں۔',
    keywords: ['computer lab', 'it training', 'آئی ٹی لیب']
  },
  {
    category: 'Departments',
    question: 'What is the Tarbiyyah Department? / شعبہ تربیت کیا کرتا ہے؟',
    answer: 'It monitors student discipline, punctuality in prayers, and Islamic values. طلبہ میں پابندیِ وقت، باجماعت نماز اور دینی اقدار کی نگرانی کرتا ہے۔',
    keywords: ['tarbiyyah department', 'discipline', 'شعبہ تربیت']
  },
  {
    category: 'Female Education',
    question: 'What is the duration of Alimat course for girls? / طالبات کے لیے عالمہ کورس کا دورانیہ کیا ہے؟',
    answer: 'Typically 5 to 6 years for female students. طالبات کے لیے عام طور پر 5 سے 6 سال کا کورس ہوتا ہے۔',
    keywords: ['alimat course', 'girls duration', 'عالمہ کورس دورانیہ']
  },
  {
    category: 'Syllabus',
    question: 'Which Arabic grammar books are taught? / عربی گرامر میں کون سی کتب پڑھائی جاتی ہیں؟',
    answer: 'Mizan-us-Sarf, Nahw Meer, Kafiyah, Hidayat-un-Nahw, etc. میزان الصرف, نحو میر, کافیہ, ہدایت النحو وغیرہ۔',
    keywords: ['kafiyah', 'nahw meer', 'sarf', 'صرف و نحو', 'کافیہ']
  },
  {
    category: 'Syllabus',
    question: 'Which books are taught for Logic (Mantiq)? / منطق میں کون سی کتب پڑھائی جاتی ہیں؟',
    answer: 'Isaghoji, Mirqat, Qutbi, etc. ایساغوجی, مرقات, قطبی وغیرہ۔',
    keywords: ['mirqat', 'logic books', 'mantiq', 'منطق', 'مرقات']
  },
  {
    category: 'Events',
    question: 'What happens in Annual Awards Ceremony? / سالانہ تقریبِ تقسیم انعامات میں کیا ہوتا ہے؟',
    answer: 'Position holders and high achievers receive shields, cash prizes, and medals. پوزیشن ہولڈرز طلبہ کو شیلڈز، نقد انعامات اور اسناد دی جاتی ہیں۔',
    keywords: ['annual awards', 'position holders', 'انعامات', 'سالانہ تقریب']
  },
  {
    category: 'Co-Curricular',
    question: 'Are speech competitions held? / کیا تقریری مقابلے ہوتے ہیں؟',
    answer: 'Weekly Bazm-e-Adab sessions train students in speech, Naat, and writing. ہفتہ وار بزمِ ادب میں نعت، تقریر اور تحریری مشقیں کروائی جاتی ہیں۔',
    keywords: ['bazm e adab', 'speech', 'naat', 'بزم ادب', 'تقریری مقابلے']
  },
  {
    category: 'Online Education',
    question: 'What is Faizan Online Academy? / فیضان آن لائن اکیڈمی کیا ہے؟',
    answer: 'An online platform for remote Islamic and Quranic learning worldwide. دنیا بھر کے افراد کے لیے گھر بیٹھے آن لائن دینی تعلیم حاصل کرنے کا ادارہ ہے۔',
    keywords: ['faizan online academy', 'online learning', 'فیضان آن لائن اکیڈمی']
  },
  {
    category: 'Administration',
    question: 'Who manages a campus? / شاخ کا نظام کون چلاتا ہے؟',
    answer: 'A Naazim (Administrator) and Sadr Mudarris (Principal) under Majlis. ناظم اور صدر مدرس مجلس کے تحت شاخ کے امور چلاتے ہیں۔',
    keywords: ['naazim', 'principal', 'administration', 'ناظم', 'صدر مدرس']
  },
  {
    category: 'Inclusion',
    question: 'Are courses available for New Muslims? / کیا نو مسلم افراد کے لیے کوئی کورس ہے؟',
    answer: 'Yes, dedicated modules and literature are available for new Muslims. نو مسلم افراد کی رہنمائی کے لیے خصوصی کورسز اور لٹریچر موجود ہے۔',
    keywords: ['new muslims', 'reverts', 'نو مسلم']
  },
  {
    category: 'Publications',
    question: 'Where to get textbooks? / نصابی کتب کہاں سے ملتی ہیں؟',
    answer: 'Published by Maktaba-tul-Madina and provided to campuses. مکتبۃ المدینہ کی شائع کردہ کتب تمام کیمپسز میں مہیا کی جاتی ہیں۔',
    keywords: ['maktaba tul madina', 'textbooks', 'مکتبۃ المدینہ', 'کتب']
  },
  {
    category: 'Specialization',
    question: 'What is Takhassus fil Adab? / تخصیص فی الادب کیا ہے؟',
    answer: 'An advanced course in Arabic literature, writing, and eloquence. عربی ادب، انشاء پردازی اور خطابت میں مہارت کا اعلیٰ کورس ہے۔',
    keywords: ['arabic literature', 'takhassus fil adab', 'عربی ادب', 'تخصیص']
  },
  {
    category: 'Academic Year',
    question: 'When does the academic year start? / تعلیمی سال کا آغاز کب ہوتا ہے؟',
    answer: 'Shortly after Shawwal and annual exam results. عید الفطر (شوال) کے فوراً بعد نئے تعلیمی سال کا آغاز ہوتا ہے۔',
    keywords: ['academic year', 'shawwal', 'تعلیمی سال', 'شوال']
  },
  {
    category: 'Rules',
    question: 'What is the student dress code? / طلبہ کے لیے لباس کی کیا پابندی ہے؟',
    answer: 'White Shalwar Kameez, Amamah (Turban), or Madani Cap following Sunnah. سفید شلوار قمیض، عمامہ شریف اور مدنی ٹوپی (سنت لباس) پہننا لازمی ہے۔',
    keywords: ['dress code', 'uniform', 'amamah', 'لباس', 'عمامہ', 'سفید لباس']
  },
  {
    category: 'Evaluation',
    question: 'When are exams conducted? / امتحانات کب منعقد ہوتے ہیں؟',
    answer: 'Mid-term exams and Annual Centralized Exams under Kanz-ul-Madaris. ششماہی اور سالانہ مرکزی امتحانات لیے جاتے ہیں۔',
    keywords: ['exam schedule', 'midterm', 'final exam', 'امتحان', 'ششماہی']
  },
  {
    category: 'Verification',
    question: 'How to verify a degree? / سند کی تصدیق کیسے کی جاتی ہے؟',
    answer: 'Online degree verification through the Kanz-ul-Madaris Board portal. کنز المدارس بورڈ کے آفیشل پورٹل کے ذریعے آن لائن تصدیق کی جاتی ہے۔',
    keywords: ['degree verification', 'verify', 'سند تصدیق', 'کنز المدارس']
  },
  {
    category: 'Social Service',
    question: 'Do students participate in community service or Qafilah? / کیا طلبہ دینی سفر یا خدمتِ خلق میں حصہ لیتے ہیں؟',
    answer: 'Yes, senior students participate in Madani Qafila preaching tours during vacations. جی ہاں, تعطیلات میں طلبہ مدنی قافلوں کے ذریعے تبلیغِ دین میں حصہ لیتے ہیں۔',
    keywords: ['madani qafilah', 'preaching', 'مدنی قافلہ', 'خدمت خلق']
  },
  {
    category: 'Support',
    question: 'How to donate or support Jamiatul Madina? / جامعۃ المدینہ کی مالی معاونت کیسے کی جا سکتی ہے؟',
    answer: 'Through official Dawat-e-Islami donation channels, Zakat, and Sadaqah. دعوتِ اسلامی کے آفیشل ڈونیشن سینٹرز، زکوٰۃ اور صدقات کے ذریعے معاونت کی جا سکتی ہے۔',
    keywords: ['donations', 'zakat', 'support', 'معاونت', 'زکوٰۃ', 'صدقات']
  }
];

module.exports = initialKnowledgeData;
