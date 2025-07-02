import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  History,
  Factory,
  Lightbulb,
  Users,
  Leaf,
  Award,
  Info,
  CalendarDays,
  Building,
  FlaskConical,
  Trophy,
  Globe,
  DollarSign,
  MapPin,
  ScrollText,
  Hammer,
  Flame,
  Droplet,
  Zap,
  Package,
  ShieldCheck,
  Sparkles,
  Recycle,
  School,
  HeartHandshake,
  Briefcase,
  GraduationCap,
  Stethoscope,
  BookOpen,
  BarChart,
  Truck,
  Trash2,
  Car,
} from "lucide-react"

export function AboutMilestones() {
  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-4xl mx-auto shadow-lg">
        <CardHeader className="bg-gradient-to-r from-[#1A2B6B] to-[#2A52BE] text-white p-6 rounded-t-lg">
          <CardTitle className="text-4xl font-extrabold text-center flex items-center justify-center gap-3">
            <Building className="w-10 h-10" />
            About Tata Steel Kalinganagar
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-10">
          {/* Overview Section */}
          <section className="space-y-6 border-b pb-8 border-gray-200">
            <h2 className="text-2xl font-bold text-[#1A2B6B] flex items-center gap-2">
              <Info className="w-6 h-6" /> Overview
            </h2>
            <p className="text-gray-700 leading-relaxed">
              Tata Steel Limited, a pioneer in India’s industrial heritage, was established in 1907 as Asia’s first
              integrated private sector steel company by the visionary Jamsetji Tata. Today, it ranks among the top
              global steel companies, boasting an annual crude steel capacity of 35 million tonnes per annum (MTPA) as
              of the financial year ending March 31, 2025, with a consolidated turnover of approximately US$26 billion.
              Operating across 26 countries and maintaining a commercial presence in over 50 countries, the company
              employs over 78,000 people across five continents, earning recognition as a Great Place to Work-Certified™
              organization. Renowned as one of the world’s most geographically diversified steel producers, Tata Steel’s
              legacy of excellence is driven by its talented workforce, innovative technologies, and a steadfast
              commitment to sustainability, evidenced by its target of achieving Net Zero emissions by 2045.
            </p>
            <p className="text-gray-700 leading-relaxed">
              The company’s vision is to be the global steel industry benchmark for value creation and corporate
              citizenship. This is realized through fostering teamwork, nurturing talent, enhancing leadership with
              pace, pride, and passion; delivering premium products and services to become the supplier of choice;
              pioneering cutting-edge technological and product solutions; and maintaining high ethical standards while
              ensuring a safe workplace, environmental respect, and community care. Tata Steel’s mission, rooted in
              Jamsetji Tata’s values, focuses on strengthening India’s industrial base through high technology,
              productivity, and modern management practices. It views honesty and integrity as the foundation of a
              stable enterprise, with profitability as the economic catalyst, pursued in a fear-free atmosphere that
              reaffirms democratic principles.
            </p>
            <p className="text-gray-700 leading-relaxed">
              A flagship endeavor of Tata Steel’s growth strategy in India is the Kalinganagar steel plant, located in
              the Kalinganagar Industrial Complex, Duburi, Jajpur district, Odisha. This state-of-the-art facility,
              India’s largest Greenfield project, is designed as a 6 MTPA integrated steel plant, developed in two
              phases, each with a 3 MTPA capacity. With the recent inauguration of Phase II on May 22, 2025, by Hon’ble
              Chief Minister of Odisha Shri Mohan Charan Majhi, the plant’s capacity has expanded from 3 MTPA to 8 MTPA,
              supported by an investment of Rs 27,000 crore. Spanning six revenue villages—Gobaraghati, Chandia,
              Gadapur, Nuagaon, Khurunti, and Baragadia—in Sukinda Tehsil, the plant leverages Odisha’s rich mineral
              resources and strategic connectivity via roads, railways, and nearby ports. This expansion solidifies
              Kalinganagar as Tata Steel’s single largest investment destination in India and a vital engine of India’s
              industrial growth, aligning with the Atmanirbhar Bharat vision by producing world-class steel for sectors
              including defence, automotive, infrastructure, engineering, capital goods, oil & gas, renewable energy,
              and shipbuilding.
            </p>
            <p className="text-gray-700 leading-relaxed">
              The Kalinganagar project’s foundation was laid with a Memorandum of Understanding (MoU) signed with the
              Government of Odisha on November 17, 2004, securing 3,471.808 acres of land, with 2,500 acres allotted by
              the Industrial Development Corporation of Odisha (IDCO) in 2005. A technical collaboration MoU with Nippon
              Steel Corporation on August 28, 2005, ensured global expertise, while the Odisha Government committed to
              allocating an iron ore mine upon 25% project completion. The project’s journey included challenges, such
              as a 2006 incident of police firing and a subsequent road blockade by villagers, prompting Tata Steel to
              launch the “Tata Steel Parivar” Rehabilitation and Resettlement (R&R) initiative. This community-focused
              program, started in 2006, fostered trust, leading to the blockade’s withdrawal in 2008 and over 50%
              voluntary land contributions by 2009. Construction resumed with boundary wall work in 2010, and the Tata
              Steel Board approved a revised scheme in 2011, marking the start of site development.
            </p>
          </section>

          {/* Key Data Points Section */}
          <section className="space-y-6 border-b pb-8 border-gray-200">
            <h2 className="text-2xl font-bold text-[#1A2B6B] flex items-center gap-2">
              <BarChart className="w-6 h-6" /> Key Data Points
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="flex items-start gap-3">
                <CalendarDays className="w-6 h-6 text-[#2A52BE] flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-gray-800">Founded:</h3>
                  <p className="text-gray-700">1907, Asia’s first integrated private sector steel company.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Globe className="w-6 h-6 text-[#2A52BE] flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-gray-800">Global Reach:</h3>
                  <p className="text-gray-700">
                    Operations in 26 countries, commercial presence in 50+ countries, 78,000+ employees.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Factory className="w-6 h-6 text-[#2A52BE] flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-gray-800">Capacity:</h3>
                  <p className="text-gray-700">
                    35 MTPA crude steel globally; Kalinganagar: 8 MTPA (expanded from 3 MTPA in Phase II).
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <DollarSign className="w-6 h-6 text-[#2A52BE] flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-gray-800">FY25 Performance:</h3>
                  <p className="text-gray-700">US$26 billion turnover.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Package className="w-6 h-6 text-[#2A52BE] flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-gray-800">Kalinganagar Investment:</h3>
                  <p className="text-gray-700">Rs 27,000 crore (Phase II).</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="w-6 h-6 text-[#2A52BE] flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-gray-800">Land:</h3>
                  <p className="text-gray-700">3,471.808 acres (2,500 acres allotted in 2005).</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <ScrollText className="w-6 h-6 text-[#2A52BE] flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-gray-800">MoUs:</h3>
                  <p className="text-gray-700">Odisha Government (Nov 17, 2004), Nippon Steel (Aug 28, 2005).</p>
                </div>
              </div>
            </div>
          </section>

          {/* Major Facilities Section */}
          <section className="space-y-6 border-b pb-8 border-gray-200">
            <h2 className="text-2xl font-bold text-[#1A2B6B] flex items-center gap-2">
              <Hammer className="w-6 h-6" /> Major Facilities
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-start gap-3">
                <Flame className="w-6 h-6 text-[#2A52BE] flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-gray-800">Blast Furnace:</h3>
                  <p className="text-gray-700">5,870 m³, 3.2 MTPA.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Droplet className="w-6 h-6 text-[#2A52BE] flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-gray-800">SMS:</h3>
                  <p className="text-gray-700">3 MTPA.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Zap className="w-6 h-6 text-[#2A52BE] flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-gray-800">HSM:</h3>
                  <p className="text-gray-700">5.5 MTPA (supports 8 MTPA).</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Package className="w-6 h-6 text-[#2A52BE] flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-gray-800">Coke Oven:</h3>
                  <p className="text-gray-700">1.5 MTPA (2 x 88 ovens).</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <ShieldCheck className="w-6 h-6 text-[#2A52BE] flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-gray-800">Sinter Plant:</h3>
                  <p className="text-gray-700">5.75 MTPA (496 m²).</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <FlaskConical className="w-6 h-6 text-[#2A52BE] flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-gray-800">Lime Plant:</h3>
                  <p className="text-gray-700">0.4 MTPA (2 x 600 TPD).</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Package className="w-6 h-6 text-[#2A52BE] flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-gray-800">Coke Plant, Cold Rolling Mill:</h3>
                  <p className="text-gray-700">Phase II additions.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Zap className="w-6 h-6 text-[#2A52BE] flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-gray-800">Power Plant:</h3>
                  <p className="text-gray-700">202.5 MW (3 x 67.5 MW).</p>
                </div>
              </div>
            </div>
            <p className="text-gray-700 leading-relaxed mt-4">
              These facilities, complemented by a new 5,870 m³ Blast Furnace with eco-friendly design and long campaign
              life, enable maximum steel output with a minimal carbon footprint, embodying Tata Steel’s tribute to a
              sustainable new India. The plant’s strategic location and connectivity enhance its ability to exceed
              expectations, delivering advanced high-strength steels for diverse applications.
            </p>
          </section>

          {/* Innovations Section */}
          <section className="space-y-6 border-b pb-8 border-gray-200">
            <h2 className="text-2xl font-bold text-[#1A2B6B] flex items-center gap-2">
              <Lightbulb className="w-6 h-6" /> Innovations
            </h2>
            <p className="text-gray-700 leading-relaxed">
              Tata Steel Kalinganagar is at the forefront of the fourth industrial revolution, leveraging cutting-edge
              technologies and design solutions to transform processes, enhance efficiencies through digitalization, and
              elevate customer experiences. Innovations include:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-start gap-3">
                <Sparkles className="w-6 h-6 text-[#2A52BE] flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-gray-800">Going Digital:</h3>
                  <p className="text-gray-700">
                    A customized in-house e-auction tool for securing metallurgical coal supplies digitally.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <BookOpen className="w-6 h-6 text-[#2A52BE] flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-gray-800">S4 Hana:</h3>
                  <p className="text-gray-700">
                    First integrated steel plant in India to implement this platform, featuring a “Universal Journal”
                    architecture for enhanced stakeholder mobility.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Briefcase className="w-6 h-6 text-[#2A52BE] flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-gray-800">Re-engineering Procurement:</h3>
                  <p className="text-gray-700">
                    A digital catalogue-based buying platform with commodity price prediction, analytics-powered
                    negotiation tools, and end-to-end contract lifecycle management.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Truck className="w-6 h-6 text-[#2A52BE] flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-gray-800">On A Roll:</h3>
                  <p className="text-gray-700">
                    During the India lockdown, supplied over 140 isolation and quarantine cabins across the country
                    within three months.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Recycle className="w-6 h-6 text-[#2A52BE] flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-gray-800">Green Tech:</h3>
                  <p className="text-gray-700">
                    The CRM Bara pond in Jamshedpur harvested 82,320 m³ of rainwater in FY20, promoting sustainability.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Trash2 className="w-6 h-6 text-[#2A52BE] flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-gray-800">No Wasting Waste:</h3>
                  <p className="text-gray-700">
                    The Iron & Steel Making Division (IBMD) developed paver blocks from LD slag, enabling waste
                    utilization and environmental protection.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <FlaskConical className="w-6 h-6 text-[#2A52BE] flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-gray-800">Alternative Materials:</h3>
                  <p className="text-gray-700">
                    Exploration of Fiber Reinforced Polymers and Graphene for extraordinary strength, lightweight
                    properties, and corrosion resistance in electric vehicles and medical equipment.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Car className="w-6 h-6 text-[#2A52BE] flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-gray-800">Hyperform® Automotive Steel:</h3>
                  <p className="text-gray-700">
                    800 MPa strength, 20% lighter, designed to reduce vehicular CO2 emissions while ensuring safety,
                    developed in collaboration with partners.
                  </p>
                </div>
              </div>
            </div>
            <p className="text-gray-700 leading-relaxed mt-4">
              These innovations underscore Tata Steel’s leadership in digital steelmaking, earning Global Lighthouse
              recognition from the World Economic Forum for its Jamshedpur, Kalinganagar, and IJmuiden plants, and the
              2024 “Digital Enterprise of India – Steel” Award from Economic Times CIO.
            </p>
          </section>

          {/* Community Development Section */}
          <section className="space-y-6 border-b pb-8 border-gray-200">
            <h2 className="text-2xl font-bold text-[#1A2B6B] flex items-center gap-2">
              <Users className="w-6 h-6" /> Community Development
            </h2>
            <p className="text-gray-700 leading-relaxed">
              The plant’s community development activities reflect its corporate citizenship ethos, including:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-start gap-3">
                <HeartHandshake className="w-6 h-6 text-[#2A52BE] flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-gray-800">Training Farmers:</h3>
                  <p className="text-gray-700">Enhancing agricultural productivity and livelihoods.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <School className="w-6 h-6 text-[#2A52BE] flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-gray-800">Skill Development Centers:</h3>
                  <p className="text-gray-700">Establishing facilities for vocational training.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <GraduationCap className="w-6 h-6 text-[#2A52BE] flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-gray-800">Skill Development Training:</h3>
                  <p className="text-gray-700">Imparting employable skills to local youth.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <HeartHandshake className="w-6 h-6 text-[#2A52BE] flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-gray-800">Entrepreneurship Development:</h3>
                  <p className="text-gray-700">Supporting local entrepreneurs with resources and guidance.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <School className="w-6 h-6 text-[#2A52BE] flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-gray-800">'1000 Schools' Project:</h3>
                  <p className="text-gray-700">Improving educational infrastructure across the region.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Stethoscope className="w-6 h-6 text-[#2A52BE] flex-shrink-0" /> {/* Changed to Stethoscope */}
                <div>
                  <h3 className="font-semibold text-gray-800">Tata Steel - Medica Super Specialty Hospital:</h3>
                  <p className="text-gray-700">Providing advanced healthcare services.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <School className="w-6 h-6 text-[#2A52BE] flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-gray-800">Construction of Model Schools:</h3>
                  <p className="text-gray-700">Building modern educational facilities.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Trophy className="w-6 h-6 text-[#2A52BE] flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-gray-800">Jyoti Fellowship:</h3>
                  <p className="text-gray-700">Offering educational scholarships to deserving students.</p>
                </div>
              </div>
            </div>
            <p className="text-gray-700 leading-relaxed mt-4">
              These initiatives, part of the Tata Steel Parivar program, have strengthened community ties and supported
              regional development.
            </p>
          </section>

          {/* Global Impact Section */}
          <section className="space-y-6 border-b pb-8 border-gray-200">
            <h2 className="text-2xl font-bold text-[#1A2B6B] flex items-center gap-2">
              <Globe className="w-6 h-6" /> Global Impact
            </h2>
            <p className="text-gray-700 leading-relaxed">
              Tata Steel Kalinganagar’s global impact is evident in iconic projects like the Burj Khalifa (using
              ComFlor® 80 decking), Bandra-Worli Sea Link (with LRPC strands), and contributions to 8 metro rail
              networks and 32 modern airports with Tiscon ReadyBuild and Tata Structura steel sections. The plant also
              produces Tata Pravesh doors and windows, crafted for durability and sustainability, addressing
              environmentally-conscious customer needs.
            </p>
          </section>

          {/* Sustainability Section */}
          <section className="space-y-6 border-b pb-8 border-gray-200">
            <h2 className="text-2xl font-bold text-[#1A2B6B] flex items-center gap-2">
              <Leaf className="w-6 h-6" /> Sustainability
            </h2>
            <p className="text-gray-700 leading-relaxed">
              Sustainability is a core focus, with Kalinganagar designed for minimal carbon footprint, supported by
              certifications like ResponsibleSteel™ for over 90% of India’s steel production. The plant has received the
              2025 Steel Sustainability Champion award from worldsteel for eight consecutive years, the 2023 Climate
              Change Leadership Award from CDP, and rankings among the top 10 in the DJSI Corporate Sustainability
              Assessment since 2016. Additionally, the Gopalpur Industrial Park (GIP), set up by Tata Steel Special
              Economic Zone Limited, is driving green industrial transformation, with foundation stones laid by Hon’ble
              CM Shri Mohan Charan Majhi on June 5, 2025, for projects worth over ₹20,500 crore in green hydrogen, solar
              manufacturing, and specialty chemicals.
            </p>
          </section>

          {/* Leadership & Awards Section */}
          <section className="space-y-6 border-b pb-8 border-gray-200">
            <h2 className="text-2xl font-bold text-[#1A2B6B] flex items-center gap-2">
              <Award className="w-6 h-6" /> Leadership & Awards
            </h2>
            <p className="text-gray-700 leading-relaxed">
              Under the leadership of CEO & Managing Director T. V. Narendran, the Phase II expansion, inaugurated on
              May 22, 2025, marks a landmark moment for Odisha and India’s steel industry. This expansion, featuring
              India’s largest Blast Furnace and advanced technologies, reinforces Kalinganagar’s role in building a
              self-reliant India. Tata Steel’s accolades include the Prime Minister’s Trophy for 2016-17, “Most Ethical
              Company” 2021 from Ethisphere Institute, and “Best Corporate for Promotion of Sports” 2024 at Sportstar
              Aces Awards, reflecting its commitment to excellence and social impact.
            </p>
            <p className="text-gray-700 leading-relaxed">
              In essence, Tata Steel Limited, Kalinganagar, is more than a steel plant—it is a symbol of innovation,
              sustainability, and inclusive growth. With its state-of-the-art facilities, digital transformation, and
              community-centric approach, it embodies the spirit of #WeAlsoMakeTomorrow, shaping a future-ready
              industrial hub in Odisha and beyond.
            </p>
          </section>

          {/* Milestones Section */}
          <section className="space-y-6">
            <h2 className="text-2xl font-bold text-[#1A2B6B] flex items-center gap-2">
              <History className="w-6 h-6" /> Kalinganagar Milestones
            </h2>
            <div className="space-y-8">
              {[
                {
                  year: "2004",
                  icon: <CalendarDays className="w-5 h-5 text-[#2A52BE] flex-shrink-0" />,
                  points: [
                    "MoU signed with the Government of Odisha on November 17, 2004, for a 6 MTPA integrated steel plant at Kalinganagar Industrial Complex, Duburi, Jajpur district.",
                    "Initial investment estimated at Rs 15,400 crore for a 6 MTPA capacity, marking the beginning of Tata Steel’s most ambitious steel project in Odisha.",
                    "Land acquisition process initiated by the Industrial Development Corporation of Odisha (IDCO), targeting 3,471.808 acres across six revenue villages (Gobarghati, Chandia, Gadapur, Nuagaon, Khurunti, Baragadia).",
                  ],
                },
                {
                  year: "2005",
                  icon: <CalendarDays className="w-5 h-5 text-[#2A52BE] flex-shrink-0" />,
                  points: [
                    "2,500 acres of land allotted by IDCO to Tata Steel, laying the groundwork for site development.",
                    "Technical collaboration MoU signed with Nippon Steel Corporation on August 28, 2005, for world-class technical assistance.",
                  ],
                },
                {
                  year: "2006",
                  icon: <CalendarDays className="w-5 h-5 text-[#2A52BE] flex-shrink-0" />,
                  points: [
                    "Tata Steel Parivar Rehabilitation and Resettlement (R&R) initiative launched to support displaced families, focusing on livelihood, education, and infrastructure development.",
                    "Tragic mob violence incident on January 2, 2006, involving police firing that resulted in 13 tribal deaths during boundary wall construction, halting progress and prompting community protests.",
                    "Construction paused due to road blockades by affected villagers, highlighting social challenges.",
                  ],
                },
                {
                  year: "2008",
                  icon: <CalendarDays className="w-5 h-5 text-[#2A52BE] flex-shrink-0" />,
                  points: [
                    "Road blockade withdrawn by villagers, signaling a restoration of trust following Tata Steel Parivar initiatives and ongoing dialogue.",
                    "20 km of quality motorable roads and 32 km of drainage systems constructed in tribal-dominated villages (e.g., Trijanga, Sansailo, Gobarghati) under R&R program.",
                  ],
                },
                {
                  year: "2009",
                  icon: <CalendarDays className="w-5 h-5 text-[#2A52BE] flex-shrink-0" />,
                  points: [
                    "Over 50% of affected land acquired voluntarily, reflecting successful community engagement and the impact of Tata Steel Parivar.",
                    "993 out of 1,234 families relocated voluntarily by December 15, 2012, with zero dropout rate achieved at elementary school level in rehabilitation colonies.",
                    "Skill development training initiated, with 358 youths trained across various sectors in the last four years by 2018.",
                  ],
                },
                {
                  year: "2010",
                  icon: <CalendarDays className="w-5 h-5 text-[#2A52BE] flex-shrink-0" />,
                  points: [
                    "Boundary wall construction resumed, marking a key step toward resuming physical development after resolving earlier conflicts.",
                    "Ceremonial puja performed for a 200-bed hospital in Gobarghati rehabilitation colony, dedicated to affected families and surrounding villages.",
                  ],
                },
                {
                  year: "2011",
                  icon: <CalendarDays className="w-5 h-5 text-[#2A52BE] flex-shrink-0" />,
                  points: [
                    "Site construction began following Tata Steel Board approval of a revised project scheme.",
                    "Infrastructure development accelerated, including laying foundations for major facilities like the Coke Oven and Sinter Plant.",
                  ],
                },
                {
                  year: "2015",
                  icon: <CalendarDays className="w-5 h-5 text-[#2A52BE] flex-shrink-0" />,
                  points: [
                    "First phase of the steel plant commissioned on November 18, 2015, by Hon’ble Chief Minister Shri Naveen Patnaik, with an initial capacity of 3 MTPA.",
                    "Investment of approximately Rs 25,000 crore for Phase I, generating over 3,000 direct and 22,000 indirect jobs, with 59.62% of direct employees from Odisha.",
                  ],
                },
                {
                  year: "2016",
                  icon: <CalendarDays className="w-5 h-5 text-[#2A52BE] flex-shrink-0" />,
                  points: [
                    "Commercial production commenced in May 2016, achieving full 3 MTPA capacity within two years.",
                    "Kalinganagar plant recognized as India’s largest single-location Greenfield steel project, producing high-end flat products.",
                    "Generated employment for 21,955 persons, including 3,611 direct and 18,344 indirect jobs, with 22.76% (822) direct employees from Jajpur district.",
                  ],
                },
                {
                  year: "2018",
                  icon: <CalendarDays className="w-5 h-5 text-[#2A52BE] flex-shrink-0" />,
                  points: [
                    "Groundbreaking ceremony for Phase II expansion held on November 12, 2018, during the ‘Make in Odisha Conclave 2018’ by Hon’ble Chief Minister Shri Naveen Patnaik, targeting a 5 MTPA increase to reach 8 MTPA.",
                    "Investment of Rs 23,500 crore announced for Phase II, with a completion timeline of 48 months.",
                    "Tata Steel Kalinganagar included in the World Economic Forum’s Global Lighthouse Network for Industry 4.0 leadership.",
                  ],
                },
                {
                  year: "2019",
                  icon: <CalendarDays className="w-5 h-5 text-[#2A52BE] flex-shrink-0" />,
                  points: [
                    "Adivasi protest march held on January 2, 2019, commemorating the 2006 incident, with demands for government accountability and land settlement under the Odisha Survey and Settlement Act.",
                    "Continued focus on community development, with the ‘1000 Schools’ Project and construction of model schools underway.",
                  ],
                },
                {
                  year: "2021",
                  icon: <CalendarDays className="w-5 h-5 text-[#2A52BE] flex-shrink-0" />,
                  points: [
                    "Supply of Liquid Medical Oxygen (LMO) via Oxygen Express started on May 9, 2021, supporting healthcare during the pandemic.",
                    "Tata Steel Medica Super Specialty Hospital operational, providing advanced healthcare to the community.",
                  ],
                },
                {
                  year: "2022",
                  icon: <CalendarDays className="w-5 h-5 text-[#2A52BE] flex-shrink-0" />,
                  points: [
                    "12 transgender individuals onboarded as Crane Operator Trainees on February 21, 2022, reflecting diversity and inclusion efforts.",
                    "Kalinganagar plant received ResponsibleSteel™ Certification, aligning with sustainability goals.",
                  ],
                },
                {
                  year: "2024",
                  icon: <CalendarDays className="w-5 h-5 text-[#2A52BE] flex-shrink-0" />,
                  points: [
                    "India’s largest blast furnace (5,870 m³) commissioned on September 20, 2024, featuring four top combustion stoves and eco-friendly design.",
                    "Phase II expansion neared completion, with investments exceeding Rs 27,000 crore, enhancing capacity for advanced high-strength steels.",
                    "Kalinganagar recognized as Tata Steel’s largest investment destination in India, with over Rs 100,000 crore invested in Odisha over the decade.",
                  ],
                },
                {
                  year: "2025 (May 22)",
                  icon: <CalendarDays className="w-5 h-5 text-[#2A52BE] flex-shrink-0" />,
                  points: [
                    "Phase II inaugurated by Hon’ble Chief Minister Shri Mohan Charan Majhi, increasing capacity from 3 MTPA to 8 MTPA.",
                    "Event held in Jajpur district with senior leaders, including CEO & MD T. V. Narendran, marking a milestone in sustainability, technology, and inclusive growth.",
                    "New facilities like Pellet Plant, Coke Plant, and Cold Rolling Mill incorporated, featuring innovative evaporative cooling systems reducing water and power consumption by 20%.",
                    "Total investment across two phases exceeded Rs 50,000 crore, reinforcing Odisha’s role in India’s industrial ecosystem.",
                    "Foundation stones laid for Gopalpur Industrial Park (GIP) projects on June 5, 2025, worth over ₹20,500 crore in green hydrogen, solar manufacturing, and specialty chemicals.",
                    "Read the full press release: <Link href='https://www.tatasteel.com/newsroom/press-releases/india/2025/tata-steel-inaugurates-phase-ii-expansion-of-kalinganagar-operations/' className='text-blue-400 hover:underline' target='_blank' rel='noopener noreferrer'>Click here to know more</Link>",
                  ],
                },
                {
                  year: "Ongoing",
                  icon: <CalendarDays className="w-5 h-5 text-[#2A52BE] flex-shrink-0" />,
                  points: [
                    "Commitment to Net Zero by 2045, with Kalinganagar designed for minimal carbon footprint.",
                    "Collaboration with 50 technical institutes for long-term skill development relationships.",
                    "Continued community initiatives, including training farmers, entrepreneurship development, and the Jyoti Fellowship, benefiting over 200,000 people.",
                  ],
                },
              ].map((milestone) => (
                <div key={milestone.year} className="flex items-start gap-4">
                  <div className="flex-shrink-0 mt-1">{milestone.icon}</div>
                  <div>
                    <h3 className="text-xl font-semibold text-[#2A52BE] mb-2">{milestone.year}</h3>
                    <ul className="list-disc pl-5 space-y-1 text-gray-700">
                      {milestone.points.map((point, idx) => (
                        <li key={idx}>{point}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </CardContent>
      </Card>
    </div>
  )
}
