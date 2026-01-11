import React, { useEffect, useMemo, useState } from 'react';
import {
  ChevronDown,
  ChevronUp,
  CheckCircle,
  BookOpen,
  XCircle,
  AlertCircle,
} from 'lucide-react';


type Phase = 'introEmoji' | 'introMessage' | 'quiz';

const LaserExamBooklet: React.FC = () => {
  // -----------------------------
  // INTRO / OPENING FLOW
  // -----------------------------
  const [phase, setPhase] = useState<Phase>('introEmoji');
  const [fadeIn, setFadeIn] = useState(false);
  const [blink, setBlink] = useState(false);

  useEffect(() => {
    // Quiz'de intro timer'ları çalışmasın
    if (phase === 'quiz') return;

    setFadeIn(true);

    let blinkOpenTimer: number | undefined;
    let blinkCloseTimer: number | undefined;
    let toMessageTimer: number | undefined;
    let autoToQuizTimer: number | undefined;

    if (phase === 'introEmoji') {
      // 1) Emoji: 1 kez göz kırp + ses
      blinkCloseTimer = window.setTimeout(() => {
        setBlink(true);

        try {
          const audio = new Audio('/blink.mp3');
          audio.volume = 0.5;
          void audio.play();
        } catch {
          // sessiz geç
        }

        // 120ms sonra göz tekrar aç
        blinkOpenTimer = window.setTimeout(() => setBlink(false), 120);
      }, 700);

      // 2) Emoji -> Mesaj
      toMessageTimer = window.setTimeout(() => {
        setFadeIn(false);
        window.setTimeout(() => {
          setPhase('introMessage');
          setFadeIn(true);
        }, 450);
      }, 1300);
    }

    if (phase === 'introMessage') {
      // 3) Mesaj ekranı: uzun süre sonra otomatik quiz
      autoToQuizTimer = window.setTimeout(() => {
        setFadeIn(false);
        window.setTimeout(() => {
          setPhase('quiz');
          setFadeIn(true);
        }, 500);
      }, 35000); // 35 saniye
    }

    return () => {
      if (blinkCloseTimer) window.clearTimeout(blinkCloseTimer);
      if (blinkOpenTimer) window.clearTimeout(blinkOpenTimer);
      if (toMessageTimer) window.clearTimeout(toMessageTimer);
      if (autoToQuizTimer) window.clearTimeout(autoToQuizTimer);
    };
  }, [phase]);

  const skipIntro = () => {
    setFadeIn(false);
    window.setTimeout(() => {
      setPhase('quiz');
      setFadeIn(true);
    }, 250);
  };

  // -----------------------------
  // QUIZ STATE
  // -----------------------------
  const [expandedQuestion, setExpandedQuestion] = useState<number | null>(null);
  const [selectedAnswers, setSelectedAnswers] = useState<
    Record<number, number>
  >({});

  const resetQuiz = () => {
    setSelectedAnswers({});
    setExpandedQuestion(null);
  };

  // ✅ Tüm sorular TEK dizide (1–35)
  const questions = useMemo(
    () =>
      [
        {
          id: 1,
          question:
            'Thedore Harold Maiman hakkında aşağıdakilerden hangisi doğrudur?',
          options: [
            'Lazer çalışmaları ile Nobel barış ödülünü almıştır',
            'Klas I-V kavite preparasyon sistemini bulmuştur',
            "MASER'i bulmuştur",
            'Diş hekimliğinde kullanılan ilk lazeri bulmuştur',
            'İlk gerçek diş hekimliği lazerini bulmuştur',
          ],
          correct: 3,
          explanation:
            'Theodore Maiman, 1960 yılında ilk çalışan ruby lazeri geliştirmiştir ve diş hekimliğinde kullanılan ilk lazer de budur.',
          wrongExplanations: [
            "Maiman Nobel ödülü almamıştır. Lazer teknolojisi için Nobel ödülü Charles Townes, Nikolay Basov ve Alexander Prokhorov'a verilmiştir.",
            'Klas I-V kavite preparasyon sistemi G.V. Black tarafından geliştirilmiştir, Maiman ile ilgisi yoktur.',
            "MASER (Microwave Amplification), lazerden önce 1954'te Charles Townes tarafından geliştirilmiştir.",
            null,
            "Maiman ilk pratik lazeri geliştirmiştir, ancak 'diş hekimliğinde kullanılan ilk lazer' ifadesi daha doğrudur.",
          ],
        },
        {
          id: 2,
          question: 'Er,Cr:YSGG lazerinin dalga boyu nedir?',
          options: ['514 nm', '2780 nm', '193 nm', '2940 nm', 'Hiçbiri'],
          correct: 1,
          explanation:
            "Er,Cr:YSGG lazerinin dalga boyu 2780 nm'dir. Bu dalga boyu suda yüksek absorpsiyon gösterir ve sert doku işlemlerinde idealdir.",
          wrongExplanations: [
            '514 nm Argon lazerinin dalga boyudur, Er,Cr:YSGG değil.',
            null,
            '193 nm Excimer lazerinin dalga boyudur, diş hekimliğinde kullanılmaz.',
            "2940 nm Er:YAG lazerinin dalga boyudur. Er,Cr:YSGG'den 160 nm farklıdır.",
            "Er,Cr:YSGG'nin belirli bir dalga boyu vardır: 2780 nm.",
          ],
        },
        {
          id: 3,
          question: 'Su tarafından emilime uğrayan lazer tipleri nelerdir?',
          options: [
            'Er, Cr:YSGG',
            'Nd:YAG',
            'Argon',
            'Diode',
            'B ve C şıkları',
          ],
          correct: 0,
          explanation:
            'Er,Cr:YSGG ve Er:YAG gibi erbium lazerler su tarafından yüksek oranda emilir. Bu özellik sert doku işlemlerinde hidrokinetik etki sağlar.',
          wrongExplanations: [
            null,
            'Nd:YAG lazeri su tarafından çok az emilir, pigmente dokular tarafından daha iyi emilir.',
            'Argon lazeri su tarafından zayıf emilir, hemoglobin tarafından güçlü emilir.',
            'Diod lazeri su tarafından düşük emilim gösterir, yumuşak doku için uygundur.',
            'Ne Nd:YAG ne de Argon lazeri su tarafından iyi emilir, bu yüzden bu şık yanlıştır.',
          ],
        },
        {
          id: 4,
          question: 'Lazer ile bir dokudan biyopsi alırken:',
          options: [
            'Geleneksel kesici aletler de kullanılabilir',
            'Geleneksel yöntemlere göre daha az kanama olur',
            'Sağlıklı doku ile sınırlı şekilde lezyon çıkartılır',
            'Isısal etkilenme sebebiyle patolojik analiz yapmak mümkün değildir',
            'A, B ve C şıkları',
          ],
          correct: 4,
          explanation:
            'Lazer biyopsisinde hem geleneksel aletler kullanılabilir, hem daha az kanama olur, hem de hassas kesim yapılabilir. Ancak ısısal hasar patolojik incelemeyi zorlaştırabilir.',
          wrongExplanations: [
            'Bu doğru bir ifade ancak eksik. Diğer avantajlar da vardır.',
            'Bu doğru bir ifade ancak eksik. Diğer avantajlar da vardır.',
            'Bu doğru bir ifade ancak eksik. Diğer avantajlar da vardır.',
            'Patolojik analiz mümkündür, ancak lazer ısısı kesit kenarlarını etkileyebilir. Bu tamamen imkansız kılmaz.',
            null,
          ],
        },
        {
          id: 5,
          question: 'Lazer ile ilgili teorileri ilk Thomas Edison bulmuştur.',
          options: ['Doğru', 'Yanlış'],
          correct: 1,
          explanation:
            "Yanlış. Lazer teorisinin temelleri Albert Einstein tarafından 1917'de 'uyarılmış emisyon' kavramıyla atılmıştır.",
          wrongExplanations: [
            "Thomas Edison elektrik ampulü ve fonograf gibi icatlarıyla tanınır, lazer teorisi ile ilgisi yoktur. Lazer teorisi Einstein'a aittir.",
            null,
          ],
        },
        {
          id: 6,
          question:
            "Er,Cr:YSGG lazeri, FDA'den hangi işlem için onay almamıştır ve kullanılması önerilmemektedir?",
          options: [
            'Yumuşak doku biyopsisi',
            'Periodontal tedavi',
            'Kavite preparasyonu',
            'Amalgam kesimi',
            'Kemik kesimi',
          ],
          correct: 3,
          explanation:
            'Er,Cr:YSGG lazeri amalgam kesimi için FDA onayı almamıştır çünkü civa buharı salınımı riski vardır.',
          wrongExplanations: [
            'Yumuşak doku biyopsisi için FDA onaylıdır ve güvenle kullanılabilir.',
            'Periodontal tedavi için FDA onaylıdır, kalkulus ve enfekte doku temizliğinde etkilidir.',
            'Kavite preparasyonu için FDA onaylıdır, çürük temizliğinde kullanılır.',
            null,
            'Kemik kesimi için FDA onaylıdır, minimal invaziv cerrahi için uygundur.',
          ],
        },
        {
          id: 7,
          question:
            'Er,Cr:YSGG lazerinin hasta için hangi avantajları olduğu gösterilmiştir?',
          options: [
            'Rahatlık',
            'Daha az travma',
            'İyileşme süresinde azalma',
            'Hepsi',
            'Hiçbiri',
          ],
          correct: 3,
          explanation:
            'Er,Cr:YSGG lazeri hasta konforunu artırır, daha az travma oluşturur ve iyileşme süresini kısaltır. Tüm bu avantajlar klinik çalışmalarla kanıtlanmıştır.',
          wrongExplanations: [
            'Bu doğru ancak tek avantaj değil. Diğer avantajlar da mevcuttur.',
            'Bu doğru ancak tek avantaj değil. Diğer avantajlar da mevcuttur.',
            'Bu doğru ancak tek avantaj değil. Diğer avantajlar da mevcuttur.',
            null,
            "Er,Cr:YSGG'nin birçok kanıtlanmış avantajı vardır, 'hiçbiri' yanlış bir ifadedir.",
          ],
        },
        {
          id: 8,
          question: 'Laser neyin kısaltılmışdır?',
          options: [
            'Light Amplification by Stimulated Emission of Radiation',
            'Light Assisted Stimulated Energy and Radiation',
            'Light Amplification by Stimulated Emission of Radar',
            'Light Amplified Stimulation of Radiation',
            'Hiçbiri',
          ],
          correct: 0,
          explanation:
            'LASER: Light Amplification by Stimulated Emission of Radiation (Işığın Uyarılmış Emisyonuyla Yükseltilmesi) anlamına gelir.',
          wrongExplanations: [
            null,
            'Bu tamamen uydurma bir kısaltmadır, doğru değildir.',
            "'Radar' kelimesi yanlış, doğrusu 'Radiation'dır.",
            'Bu kısaltma eksik ve yanlış ifade edilmiştir.',
            "LASER'ın kesin bir kısaltması vardır ve bilinmektedir.",
          ],
        },
        {
          id: 9,
          question: 'Dalga boyu nedir?',
          options: [
            'Belirli bir yönde hareket',
            'Bir tam devir süresi',
            'Belirli aralıklarla tekrarlayan bir frekans',
            'Bir dalganın en yüksek noktası ile diğer dalganın en yüksek noktası arasındaki mesafe',
            'Hiçbiri',
          ],
          correct: 3,
          explanation:
            'Dalga boyu, bir dalganın ardışık iki tepe noktası (ya da çukur noktası) arasındaki mesafedir ve nanometre (nm) ile ölçülür.',
          wrongExplanations: [
            'Bu dalga yönünü tanımlar, dalga boyunu değil.',
            'Bu periyot tanımıdır, dalga boyu değil.',
            'Bu frekans tanımına yakındır, dalga boyu mesafe ile ilgilidir.',
            null,
            'Dalga boyunun net bir tanımı vardır.',
          ],
        },
        {
          id: 10,
          question:
            'Er,Cr:YSGG lazerinin geleneksel kemik kesme tekniklerine göre hangi avantajı bulunmaktadır?',
          options: [
            'Kemiğin daha hassas kesilmesi',
            'Operasyon sonrası daha az ağrı',
            'Çevre dokularda daha az nekroz',
            'Isı transferine bağlı olarak en az travma',
            'Hepsi',
          ],
          correct: 4,
          explanation:
            'Er,Cr:YSGG lazeri kemik kesiminde tüm bu avantajları sağlar: hassas kesim, az ağrı, minimal nekroz ve düşük ısı travması.',
          wrongExplanations: [
            'Bu doğru ancak diğer avantajlar da vardır.',
            'Bu doğru ancak diğer avantajlar da vardır.',
            'Bu doğru ancak diğer avantajlar da vardır.',
            'Bu doğru ancak diğer avantajlar da vardır.',
            null,
          ],
        },
        {
          id: 11,
          question:
            'Hangi tip lazer kullanırken koruyucu gözlük kullanmak gereklidir?',
          options: [
            'Er,Cr:YSGG lazer',
            'Diod lazer',
            'Nd:YAG lazer',
            'Serbest titreşim modunda',
            'Hepsinde',
          ],
          correct: 4,
          explanation:
            'Tüm lazer tiplerinde göz güvenliği için koruyucu gözlük kullanılması zorunludur. Her lazer tipi için uygun dalga boyuna göre özel gözlükler kullanılır.',
          wrongExplanations: [
            'Sadece Er,Cr:YSGG değil, tüm lazerler için koruyucu gözlük gereklidir.',
            'Sadece Diod değil, tüm lazerler için koruyucu gözlük gereklidir.',
            'Sadece Nd:YAG değil, tüm lazerler için koruyucu gözlük gereklidir.',
            'Sadece belirli modlarda değil, tüm lazer kullanımlarında gözlük gereklidir.',
            null,
          ],
        },
        {
          id: 12,
          question:
            'Aşağıdakilerden hangisi yumuşak dokuda lazer kullanımının avantajlarından değildir?',
          options: [
            'Operasyon sonrası ağrı azalmaktadır',
            'Operasyon sırasında daha az kanama olmaktadır',
            'Anestezi hiçbir zaman gerekmez',
            'Operasyon sonrası şişme azalmaktadır',
            'Daha hassas çalışılır',
          ],
          correct: 2,
          explanation:
            "Lazer kullanımında genellikle daha az anestezi gerekse de, derin kesiler veya hassas bölgelerde anestezi hala gerekli olabilir. 'Hiçbir zaman gerekmez' ifadesi yanlıştır.",
          wrongExplanations: [
            'Bu lazer kullanımının gerçek bir avantajıdır.',
            'Koagülasyon etkisi sayesinde kanama gerçekten azalır.',
            null,
            'Lazer kullanımı ödem oluşumunu azaltır, bu doğru bir avantajdır.',
            'Lazer hassas ve kontrollü kesim sağlar.',
          ],
        },
        {
          id: 13,
          question:
            'Aşağıdakilerden hangisi lazerin yumuşak dokuda oluşturması istenen etkilerinden biri değildir?',
          options: [
            'Kesme',
            'Koagülasyon',
            'Hassas kesim',
            'Ödem',
            'Yukarıdakilerin hepsi istenen etkilerdir',
          ],
          correct: 3,
          explanation:
            'Ödem (şişlik) istenen bir etki değil, aksine lazer kullanımı ödem oluşumunu azaltır. Kesme, koagülasyon ve hassas kesim istenen etkilerdir.',
          wrongExplanations: [
            'Kesme lazerin temel istenen etkilerindendir.',
            'Koagülasyon (pıhtılaşma) kanama kontrolü için istenen bir etkidir.',
            'Hassas kesim lazerin en önemli avantajlarındandır.',
            null,
            "Ödem istenen bir etki değildir, bu yüzden 'hepsi' yanlıştır.",
          ],
        },
        {
          id: 14,
          question:
            'Nd:YAG lazer ile hem yumuşak hem de sert dokuda çalışılabilir.',
          options: ['Doğru', 'Yanlış'],
          correct: 1,
          explanation:
            'Yanlış. Nd:YAG lazer temelde yumuşak doku lazeridir. Su tarafından zayıf absorpsiyonu nedeniyle sert doku işlemlerinde etkili değildir. Sert doku için erbium lazerler kullanılır.',
          wrongExplanations: [
            'Nd:YAG sadece yumuşak doku için uygundur, sert dokuda kullanılmaz.',
            null,
          ],
        },
        {
          id: 15,
          question:
            'Lazer ışınının özellikleri doğal ışığın özelliklerinden farklıdır. Aşağıdakilerden hangisi yanlıştır?',
          options: [
            'Lazer ışınları genellikle koherandır',
            'Lazer ışınları çoğu zaman diverjandır',
            'Lazer ışını doğal ışığa göre zaman ve yer kavramları içinde daha öngörülebilirdir',
            'Lazer ışını monokratiktir',
            'Lazer ışınları paraleldir',
          ],
          correct: 1,
          explanation:
            "Yanlış ifade: 'Lazer ışınları çoğu zaman diverjandır.' Lazer ışınları aslında kollime edilmiştir, yani paralel ve minimum diverjansa sahiptir.",
          wrongExplanations: [
            'Bu doğrudur. Lazer ışınları koherandır (fazları uyumludur).',
            null,
            'Bu doğrudur. Lazer ışını öngörülebilir özelliklere sahiptir.',
            'Bu doğrudur. Lazer tek dalga boyunda yayar (monokromatik).',
            'Bu doğrudur. Lazer ışınları paralel ve kollimedir.',
          ],
        },
        {
          id: 16,
          question:
            'Er,Cr:YSGG lazer ile hem yumuşak hem de sert dokuda çalışılabilir.',
          options: ['Doğru', 'Yanlış'],
          correct: 0,
          explanation:
            'Doğru. Er,Cr:YSGG lazeri suda yüksek absorpsiyon gösterdiği için hem sert hem de yumuşak doku işlemlerinde etkili şekilde kullanılabilen çok yönlü bir lazerdir.',
          wrongExplanations: [
            null,
            'Er,Cr:YSGG gerçekten hem sert hem yumuşak dokuda kullanılabilir, bu ifade doğrudur.',
          ],
        },
        {
          id: 17,
          question: 'Su tarafından iyi emilemeyen lazerler neye sebep olur?',
          options: [
            'Karbonizasyon',
            'Kömürleşme',
            'Organik dokunun erimesi',
            'B ve C',
            'A ve B',
            'Hepsi',
          ],
          correct: 5,
          explanation:
            'Su tarafından iyi emilemeyen lazerler aşırı ısınmaya yol açar, bu da karbonizasyon, kömürleşme ve doku erimesine neden olur.',
          wrongExplanations: [
            'Karbonizasyon olur ancak bu tek etki değildir.',
            'Kömürleşme olur ancak erime de gerçekleşir.',
            'Erime olur ancak karbonizasyon da gerçekleşir.',
            'Karbonizasyon da gerçekleşir, sadece B ve C değil.',
            'Doku erimesi de olur, sadece A ve B değil.',
            null,
          ],
        },
        {
          id: 18,
          question: 'Foton nedir?',
          options: [
            'Kimyasal reaksiyona girebilen bir element',
            'Bir atomun iç enerjisi',
            'Yayılan bir enerjinin en ufak enerji birimi',
            'Elektriksel veya manyetik olarak yüklenmiş iki parçacığın birleşimi',
            'Hiçbiri',
          ],
          correct: 2,
          explanation:
            'Foton, ışığın ve diğer elektromanyetik radyasyonun temel enerji birimidir. Kütlesiz bir parçacıktır ve ışık hızında hareket eder.',
          wrongExplanations: [
            'Foton bir element değil, enerji parçacığıdır.',
            'Foton atomun içinden çıkan enerji olabilir ancak bu tam tanım değildir.',
            null,
            'Foton yüksüz bir parçacıktır, elektriksel veya manyetik yük taşımaz.',
            'Fotonun net bir tanımı vardır.',
          ],
        },
        {
          id: 19,
          question:
            'Lazerin tipine bağlı olarak, lazer enerjisi elektromanyetik spektrumun belirli bölümlerinden yayılmaktadır. Çoğu lazer, bu spektrumun hangi bölümlerinden yayılmaktadır?',
          options: [
            'Ultraviyole ve görünür ışık',
            'Görünür ışık',
            'Görünür ışık ve kızılötesi',
            'Ultraviyole',
            'Hepsi',
          ],
          correct: 2,
          explanation:
            'Diş hekimliğinde kullanılan çoğu lazer görünür ışık ve kızılötesi bölgeden yayılır. Örneğin Argon görünür, Er:YAG ve CO2 kızılötesidir.',
          wrongExplanations: [
            'Sadece ultraviyole ve görünür değil, kızılötesi de önemli bir bölgedir.',
            'Sadece görünür ışık değil, birçok lazer kızılötesi bölgededir.',
            null,
            'Sadece ultraviyole çok sınırlıdır, en yaygın bölge değildir.',
            'Her bölgeden eşit oranda değil, görünür ve kızılötesi daha yaygındır.',
          ],
        },
        {
          id: 20,
          question: 'Çürük lezyonunun temizlenmesinde sert doku lazeri,',
          options: [
            'Smear tabakasını kaldırır',
            'Sterilizasyon sağlar',
            'Bağlanma gücünü arttırır',
            'Hepsi',
            'Sadece A ve C',
          ],
          correct: 3,
          explanation:
            'Sert doku lazeri çürük temizliğinde smear tabakasını kaldırır, bakterisidal etki gösterir (sterilizasyon) ve mikro-retansiyonlar oluşturarak bağlanma gücünü artırır.',
          wrongExplanations: [
            'Bu doğru ancak diğer etkiler de vardır.',
            'Bu doğru ancak diğer etkiler de vardır.',
            'Bu doğru ancak diğer etkiler de vardır.',
            null,
            'Sterilizasyon etkisi de vardır, sadece A ve C değil.',
          ],
        },
        {
          id: 21,
          question: 'Diod lazeri hangi dalga boyunda çalışmaktadır?',
          options: ['750 nm', '810 nm', '980 nm', '2780 nm', 'Hiçbiri'],
          correct: 2,
          explanation:
            "Diod lazerler genellikle 810-980 nm dalga boyunda çalışır. En yaygın kullanılan 980 nm'dir. 810 nm de kullanılır.",
          wrongExplanations: [
            '750 nm diod lazerlerin çalışma aralığının altındadır.',
            '810 nm diod lazer dalga boyu olabilir ancak 980 nm daha yaygındır.',
            null,
            '2780 nm Er,Cr:YSGG lazerinin dalga boyudur, diod lazerin değil.',
            'Diod lazerinin belirli dalga boyu aralığı vardır.',
          ],
        },
        {
          id: 22,
          question:
            'Uyarılmış salma ile ışığın güçlendirilmesi (LASER) kimin tarafından ortaya atılmıştır?',
          options: [
            'Niels Bohr',
            'Albert Einstein',
            'Thomas Edison',
            'T.H. Maiman',
            'Leon Goldman',
          ],
          correct: 1,
          explanation:
            "Albert Einstein, 1917'de 'uyarılmış emisyon' teorisini ortaya atarak lazer teknolojisinin temelini oluşturmuştur.",
          wrongExplanations: [
            'Niels Bohr atom teorisi ile bilinir, lazer teorisi değil.',
            null,
            'Thomas Edison elektrik ve ampul ile bilinir, lazer teorisi değil.',
            'Maiman ilk çalışan lazeri yaptı ancak teoriyi Einstein ortaya attı.',
            'Leon Goldman lazeri tıpta kullanan öncülerden biridir ancak teoriyi o geliştirmedi.',
          ],
        },
        {
          id: 23,
          question:
            'Lazer ışınları biyolojik dokularla etkileşime girdiğinde oluşan yanıt aşağıdakilerden hangisinden etkilenir?',
          options: [
            'Lazer ışınının dalga boyu',
            'Dokunun optik özellikleri',
            'Lazer ışının uygulandığı süre',
            'Lazerin enerjisi',
            'Hepsi',
          ],
          correct: 4,
          explanation:
            'Lazer-doku etkileşimi dalga boyu, doku özellikleri (su içeriği, pigmentasyon), uygulama süresi ve enerji seviyesi gibi tüm faktörlerden etkilenir.',
          wrongExplanations: [
            'Bu önemli ancak tek faktör değil.',
            'Bu önemli ancak tek faktör değil.',
            'Bu önemli ancak tek faktör değil.',
            'Bu önemli ancak tek faktör değil.',
            null,
          ],
        },
        {
          id: 24,
          question:
            'Işığın spontan yayılımı dağınık ışık dalgalarına sebep olur.',
          options: ['Doğru', 'Yanlış'],
          correct: 0,
          explanation:
            'Doğru. Spontan emisyonda fotonlar rastgele yönlerde ve farklı fazlarda yayılır, bu da inkoheran (dağınık) ışığa neden olur. Lazer ışığı ise uyarılmış emisyon ile koherandır.',
          wrongExplanations: [
            null,
            'Spontan emisyon gerçekten dağınık ışık üretir, bu ifade doğrudur.',
          ],
        },
        {
          id: 25,
          question: 'Lazer gücü hangi birimle gösterilmektedir?',
          options: [
            'Joule (J)',
            'Hertz (H)',
            'Watt (W)',
            'Nanometre (nm)',
            'Yüzde (%)',
          ],
          correct: 2,
          explanation:
            'Lazer gücü Watt (W) birimi ile ölçülür. Enerji ise Joule (J) ile, dalga boyu nanometre (nm) ile ifade edilir.',
          wrongExplanations: [
            'Joule enerji birimidir, güç birimi değil.',
            'Hertz frekans birimidir, güç birimi değil.',
            null,
            'Nanometre dalga boyu birimidir, güç birimi değil.',
            'Yüzde bir oran birimidir, güç birimi değil.',
          ],
        },
        {
          id: 26,
          question:
            "1960'li yıllarda diş hekimliğinde kullanılan ilk lazer _____ lazerdir.",
          options: ['Lal', 'Elmas', 'Zümrüt', 'Yakut', 'Hiçbiri'],
          correct: 3,
          explanation:
            "İlk diş hekimliği lazeri, Maiman'ın geliştirdiği Ruby (Yakut) lazerdir (1960). Yakut kristali aktif ortam olarak kullanılmıştır.",
          wrongExplanations: [
            "Lal (Ruby'nin yanlış yazımı) yerine doğru ifade Yakut'tur.",
            'Elmas lazer için kullanılmamıştır.',
            'Zümrüt (Emerald) ilk diş hekimliği lazeri değildir.',
            null,
            'İlk lazer Ruby (Yakut) lazerdir, belirli bir cevap vardır.',
          ],
        },
        {
          id: 27,
          question:
            'Amerikan Periodontoloji Derneği tarafından yayınlanan lazer ile ilgili ilk yayınlar hangi tür lazer üzerine yoğunlaşmaktaydı?',
          options: ['Er,Cr:YSGG', 'Nd:YAG', 'Er:YAG', 'Diod', 'Argon'],
          correct: 1,
          explanation:
            'İlk periodontal lazer çalışmaları Nd:YAG lazer üzerine yoğunlaşmıştır. Yumuşak doku ve bakterisidal etkileri araştırılmıştır.',
          wrongExplanations: [
            'Er,Cr:YSGG daha sonra geliştirilmiştir.',
            null,
            "Er:YAG Nd:YAG'den sonra periodontal uygulamalarda kullanılmaya başlanmıştır.",
            'Diod lazerler daha sonraki dönemde yaygınlaşmıştır.',
            'Argon lazeri periodontolojide yaygın kullanılmamıştır.',
          ],
        },
        {
          id: 28,
          question: 'Lazer kullanımında lazerin yoğunluğu,',
          options: [
            'Watt/mg^2 birimi ile ölçülür',
            'Lazer ucunun boyutundan etkilenmez',
            'Doku ile arasındaki mesafeden etkilenir',
            'Fiber boyutu arttıkça artar',
            'Hiçbiri',
          ],
          correct: 2,
          explanation:
            'Lazer yoğunluğu (W/cm²), lazer ucunun boyutu ve dokuya olan mesafeden etkilenir. Mesafe arttıkça yoğunluk azalır (ters kare kanunu).',
          wrongExplanations: [
            "Doğru birim W/cm² veya W/mm²'dir, mg² değil.",
            'Lazer ucunun boyutu yoğunluğu doğrudan etkiler.',
            null,
            'Fiber boyutu arttıkça aynı güçte yoğunluk azalır, artar değil.',
            'Mesafe faktörü yoğunluğu etkiler, belirli bir cevap vardır.',
          ],
        },
        {
          id: 29,
          question: 'Lazer ışını, tek bir _____ dalga boyudur.',
          options: ['Atom', 'Proton', 'Nötron', 'Hiçbiri', 'Foton'],
          correct: 3,
          explanation:
            "Soru yapısı biraz karışık ancak anlatılmak istenen: Lazer ışını monokromatiktir, yani tek bir dalga boyunda yayılır. Boşluğa 'dalga boyu' kelimesi gelmeli.",
          wrongExplanations: [
            'Atom dalga boyu değil, parçacıktır.',
            'Proton dalga boyu değil, parçacıktır.',
            'Nötron dalga boyu değil, parçacıktır.',
            null,
            "Foton ışık parçacığıdır ancak boşluğa gelmesi gereken 'dalga boyu' ifadesidir.",
          ],
        },
        {
          id: 30,
          question: 'Lazer ışını doku ile temas ettiğinde,',
          options: ['Yansır', 'Dağılır', 'Emilime uğrar', 'Hepsi', 'Hiçbiri'],
          correct: 3,
          explanation:
            'Lazer ışını doku ile etkileştiğinde dört temel olay gerçekleşebilir: yansıma (reflection), saçılma (scattering), iletim (transmission) ve absorpsiyon (emilim). Bu sorudaki üç seçenek de doğrudur.',
          wrongExplanations: [
            'Yansıma olur ancak diğer etkileşimler de vardır.',
            'Saçılma olur ancak diğer etkileşimler de vardır.',
            'Emilim olur ancak diğer etkileşimler de vardır.',
            null,
            'Lazer-doku etkileşimi kesinlikle gerçekleşir.',
          ],
        },
        {
          id: 31,
          question:
            'Aşağıdakilerden hangisi diş hekimliğinde kullanılan bir lazer değildir?',
          options: [
            'Argon',
            'Karbondioksit',
            'Diod',
            'Er, Cr: YSGG',
            'Ksenon florür',
          ],
          correct: 4,
          explanation:
            'Ksenon florür (Excimer) lazeri diş hekimliğinde kullanılmaz. Daha çok oftalmoloji (göz cerrahisi) ve dermatololojide kullanılır.',
          wrongExplanations: [
            'Argon lazeri yumuşak doku için diş hekimliğinde kullanılır.',
            'CO2 (Karbondioksit) lazeri yumuşak doku cerrahisinde kullanılır.',
            'Diod lazeri diş hekimliğinde yaygın kullanılan bir lazerdir.',
            'Er,Cr:YSGG diş hekimliğinin en çok yönlü lazerlerinden biridir.',
            null,
          ],
        },
        {
          id: 32,
          question: 'Bir nanometre,',
          options: [
            '10^6 metre',
            '10^-6 metre',
            '10^9 metre',
            "10^-9 metre'dir",
            'Hiçbiri',
          ],
          correct: 3,
          explanation:
            "1 nanometre (nm) = 10⁻⁹ metre = 0.000000001 metre'dir. Nano ön eki milyarda bir anlamına gelir.",
          wrongExplanations: [
            '10^6 bir milyon demektir, nanometre milyarda birdir.',
            '10^-6 mikrometre (μm) değeridir, nanometre değil.',
            '10^9 bir milyar demektir, nanometre bunun tersidir.',
            null,
            'Nanometrenin kesin bir değeri vardır.',
          ],
        },
        {
          id: 33,
          question: 'Karbondioksit lazerin dalga boyu nedir?',
          options: ['488 nm', '2100 nm', '10600 nm', '337 nm', 'Hiçbiri'],
          correct: 2,
          explanation:
            "CO₂ (Karbondioksit) lazerinin dalga boyu 10600 nm (10.6 μm)'dir ve uzak kızılötesi bölgesindedir.",
          wrongExplanations: [
            '488 nm Argon lazerinin dalga boyudur.',
            '2100 nm Ho:YAG veya Tm:YAG lazerlerine yakındır.',
            null,
            '337 nm nitrojen lazer dalga boyudur.',
            'CO2 lazerinin bilinen bir dalga boyu vardır.',
          ],
        },
        {
          id: 34,
          question:
            "Er,Cr:YSGG ile Er:YAG arasındaki dalga boyu farkı 160 nm'dir.",
          options: ['Doğru', 'Yanlış'],
          correct: 0,
          explanation:
            'Doğru. Er,Cr:YSGG: 2780 nm, Er:YAG: 2940 nm. Fark: 2940 - 2780 = 160 nm',
          wrongExplanations: [
            null,
            'Matematiksel hesaplama doğrudur: 2940 - 2780 = 160 nm',
          ],
        },
        {
          id: 35,
          question:
            'Lazer ışınının özellikleri doğal ışığın özelliklerinden farklıdır. Aşağıdakilerden hangisi yanlıştır?',
          options: [
            'Lazer ışınları genellikle koherandır',
            'Lazer ışınları çoğu zaman diverjandır',
            'Lazer ışını doğal ışığa göre zaman ve yer kavramları içinde daha öngörülebilirdir',
            'Lazer ışını monokratiktir',
            'Lazer ışınları paraleldir',
          ],
          correct: 1,
          explanation:
            "Yanlış ifade: 'Lazer ışınları çoğu zaman diverjandır.' Lazer ışınları aslında kollime edilmiştir (paraleldir) ve minimum diverjansa sahiptir.",
          wrongExplanations: [
            'Bu doğrudur. Lazer ışınları koherandır (fazları uyumludur).',
            null,
            'Bu doğrudur. Lazer ışını öngörülebilir özelliklere sahiptir.',
            'Bu doğrudur. Lazer tek dalga boyunda yayar (monokromatik).',
            'Bu doğrudur. Lazer ışınları kollime edilmiştir ve paraleldir.',
          ],
        },
      ].sort((a, b) => a.id - b.id),
    []
  );

  const toggleQuestion = (id: number) => {
    setExpandedQuestion((prev) => (prev === id ? null : id));
  };

  const handleAnswerClick = (questionId: number, optionIndex: number) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: optionIndex,
    }));
  };

  const getAnswerStatus = (
    questionId: number,
    optionIndex: number
  ): 'correct' | 'wrong' | 'correct-answer' | null => {
    if (selectedAnswers[questionId] === undefined) return null;

    const question = questions.find((q) => q.id === questionId);
    if (!question) return null;

    const isSelected = selectedAnswers[questionId] === optionIndex;
    const isCorrect = optionIndex === question.correct;

    if (isSelected) return isCorrect ? 'correct' : 'wrong';
    if (selectedAnswers[questionId] !== question.correct && isCorrect)
      return 'correct-answer';

    return null;
  };

  const calculateScore = () => {
    let correct = 0;
    for (const q of questions) {
      if (selectedAnswers[q.id] === q.correct) correct++;
    }
    return correct;
  };

  const answeredCount = Object.keys(selectedAnswers).length;
  const score = calculateScore();

  // -----------------------------
  // INTRO SCREENS
  // -----------------------------
  if (phase === 'introEmoji') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 flex items-center justify-center p-6 font-sans">
        <div
          className={`text-center transition-opacity duration-700 ${
            fadeIn ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <div className="text-7xl md:text-8xl drop-shadow">
            {blink ? '😉' : '🙂'}
          </div>
        </div>
      </div>
    );
  }

  if (phase === 'introMessage') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 flex items-center justify-center p-6 font-sans">
        <div
          className={`w-full max-w-3xl transition-opacity duration-700 ${
            fadeIn ? 'opacity-100' : 'opacity-0'
          } space-y-6`}
        >
          {/* 1️⃣ EN ÜST BAŞLIK */}
          <div className="text-center">
            <h1 className="text-white text-2xl md:text-3xl font-extrabold tracking-tight">
              Diş Hekimliğinde Lazer Uygulamaları
            </h1>
          </div>

          {/* 2️⃣ ORTA BLOK – DEDICATION (TEK SATIR) */}
          <div className="bg-white/8 backdrop-blur rounded-2xl px-6 py-5 shadow-2xl ring-1 ring-white/10 text-center">
            <p className="text-white text-lg md:text-xl font-semibold whitespace-nowrap">
              Betül Yadigaroğlu Hanım&apos;larının özel istekleri üzerine inşa
              edilmiştir.
            </p>
          </div>

          {/* CTA */}
          <div className="flex flex-col items-center gap-3">
            <button
              onClick={skipIntro}
              className="px-7 py-3 rounded-2xl bg-white/15 hover:bg-white/25 active:bg-white/30 transition text-white font-extrabold ring-1 ring-white/20 shadow-xl"
            >
              Hemen başla
            </button>
          </div>

          {/* NETURA – AYRI, ALT, SPONSOR BLOĞU */}
          <div className="mt-16 pt-6 border-t border-white/10">
            <div className="bg-slate-900/70 backdrop-blur rounded-xl px-5 py-4 ring-1 ring-white/5">
              <p className="text-slate-300 text-sm font-medium">
                İnternetinizle ilgili yaşadığınız her türlü problem için
              </p>

              <p className="text-white font-extrabold mt-1">netura.com.tr</p>

              <a
                href="https://netura.com.tr"
                target="_blank"
                rel="noreferrer"
                className="inline-flex mt-3 px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition text-white text-sm font-semibold ring-1 ring-white/15"
              >
                Siteyi ziyaret et
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // -----------------------------
  // QUIZ UI
  // -----------------------------
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 p-4 md:p-8 font-sans">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 via-blue-600 to-indigo-700 rounded-2xl shadow-2xl p-8 md:p-10 mb-8 text-white ring-1 ring-white/10">
          <div className="flex items-center justify-between mb-6 gap-4">
            <div className="flex items-center">
              <div className="bg-white/20 p-4 rounded-full mr-4 backdrop-blur-sm">
                <BookOpen className="w-10 h-10" />
              </div>
              <div>
                <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-2">
                  Lazer Teknolojisi
                </h1>
                <p className="text-blue-100/90 text-base md:text-lg font-medium">
                  Diş Hekimliğinde Lazer Uygulamaları
                </p>
              </div>
            </div>

            {answeredCount > 0 && (
              <button
                onClick={resetQuiz}
                className="px-4 py-2 md:px-5 md:py-2.5 rounded-xl bg-white/15 hover:bg-white/25 active:bg-white/30 transition font-semibold text-white ring-1 ring-white/20 shadow-lg"
                title="Tüm cevapları sıfırla"
              >
                Sıfırla
              </button>
            )}
          </div>

          {/* Progress Bar */}
          <div className="mt-6">
            <div className="flex justify-between text-sm mb-2">
              <span>İlerleme</span>
              <span>
                {answeredCount} / {questions.length} soru
              </span>
            </div>
            <div className="w-full bg-white/15 rounded-full h-3 overflow-hidden backdrop-blur-sm ring-1 ring-white/10">
              <div
                className="bg-gradient-to-r from-green-400 to-emerald-500 h-full rounded-full transition-all duration-500 shadow-lg"
                style={{
                  width: `${
                    questions.length === 0
                      ? 0
                      : (answeredCount / questions.length) * 100
                  }%`,
                }}
              />
            </div>

            {answeredCount === questions.length && questions.length > 0 && (
              <div className="mt-4 text-center">
                <div className="inline-block bg-white/20 backdrop-blur-sm rounded-lg px-6 py-3">
                  <p className="text-2xl font-bold">
                    Skorunuz: {score} / {questions.length}{' '}
                    <span className="ml-2">
                      ({Math.round((score / questions.length) * 100)}%)
                    </span>
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Questions */}
        <div className="space-y-5">
          {questions.map((q) => {
            const isAnswered = selectedAnswers[q.id] !== undefined;
            const isCorrectAnswer = selectedAnswers[q.id] === q.correct;

            return (
              <div
                key={q.id}
                className={`bg-white/95 backdrop-blur rounded-2xl shadow-xl overflow-hidden transition-all duration-300 border ${
                  isAnswered
                    ? isCorrectAnswer
                      ? 'border-green-300 shadow-green-200/40'
                      : 'border-red-300 shadow-red-200/40'
                    : 'border-white/20 hover:border-indigo-200/70 hover:shadow-2xl'
                }`}
              >
                {/* Question Header */}
                <div
                  className="p-6 cursor-pointer bg-gradient-to-r from-white to-slate-50"
                  onClick={() => toggleQuestion(q.id)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <span className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-indigo-500 to-blue-600 text-white rounded-full font-bold shadow-md">
                          {q.id}
                        </span>

                        {isAnswered && (
                          <span
                            className={`px-3 py-1 rounded-full text-sm font-semibold ${
                              isCorrectAnswer
                                ? 'bg-green-100 text-green-700'
                                : 'bg-red-100 text-red-700'
                            }`}
                          >
                            {isCorrectAnswer ? '✓ Doğru' : '✗ Yanlış'}
                          </span>
                        )}
                      </div>

                      <p className="text-slate-900 leading-relaxed text-lg font-semibold">
                        {q.question}
                      </p>
                    </div>

                    <div className="ml-4 flex-shrink-0">
                      {expandedQuestion === q.id ? (
                        <ChevronUp className="w-6 h-6 text-indigo-600" />
                      ) : (
                        <ChevronDown className="w-6 h-6 text-gray-400" />
                      )}
                    </div>
                  </div>
                </div>

                {/* Options and Explanation */}
                {expandedQuestion === q.id && (
                  <div className="px-6 pb-6 bg-slate-50">
                    <div className="mt-4 space-y-3">
                      {q.options.map((option, index) => {
                        const status = getAnswerStatus(q.id, index);

                        return (
                          <button
                            key={index}
                            onClick={() =>
                              !isAnswered && handleAnswerClick(q.id, index)
                            }
                            disabled={isAnswered}
                            className={`w-full p-4 rounded-xl transition-all text-left font-semibold ${
                              status === 'correct'
                                ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-400 shadow-md'
                                : status === 'wrong'
                                ? 'bg-gradient-to-r from-red-50 to-pink-50 border-2 border-red-400 shadow-md'
                                : status === 'correct-answer'
                                ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-400 shadow-md'
                                : !isAnswered
                                ? 'bg-white border-2 border-slate-200/80 hover:border-indigo-300/70 hover:bg-indigo-50/60 cursor-pointer hover:shadow-lg'
                                : 'bg-white border-2 border-gray-200 opacity-60'
                            }`}
                          >
                            <div className="flex items-center">
                              <span
                                className={`flex items-center justify-center w-8 h-8 rounded-full font-bold mr-3 flex-shrink-0 ${
                                  status === 'correct' ||
                                  status === 'correct-answer'
                                    ? 'bg-green-500 text-white'
                                    : status === 'wrong'
                                    ? 'bg-red-500 text-white'
                                    : 'bg-gray-200 text-gray-700'
                                }`}
                              >
                                {String.fromCharCode(97 + index).toUpperCase()}
                              </span>

                              <span className="text-slate-900 flex-1">
                                {option}
                              </span>

                              {status === 'correct' && (
                                <div className="flex items-center text-green-600 ml-3">
                                  <CheckCircle className="w-6 h-6" />
                                </div>
                              )}

                              {status === 'wrong' && (
                                <div className="flex items-center text-red-600 ml-3">
                                  <XCircle className="w-6 h-6" />
                                </div>
                              )}

                              {status === 'correct-answer' && (
                                <div className="flex items-center text-green-600 ml-3">
                                  <CheckCircle className="w-6 h-6" />
                                </div>
                              )}
                            </div>
                          </button>
                        );
                      })}
                    </div>

                    {/* Explanations */}
                    {isAnswered && (
                      <div className="mt-6 space-y-4">
                        {!isCorrectAnswer &&
                          q.wrongExplanations &&
                          q.wrongExplanations[selectedAnswers[q.id]] && (
                            <div className="bg-gradient-to-r from-red-50 to-pink-50 border-l-4 border-red-500 rounded-lg p-5 shadow-md">
                              <div className="flex items-start">
                                <XCircle className="w-6 h-6 text-red-500 mr-3 flex-shrink-0 mt-0.5" />
                                <div>
                                  <p className="text-sm font-bold text-red-900 mb-2">
                                    Seçtiğiniz cevap neden yanlış:
                                  </p>
                                  <p className="text-sm text-red-800 leading-relaxed">
                                    {q.wrongExplanations[selectedAnswers[q.id]]}
                                  </p>
                                </div>
                              </div>
                            </div>
                          )}

                        <div
                          className={`bg-gradient-to-r ${
                            isCorrectAnswer
                              ? 'from-green-50 to-emerald-50 border-green-500'
                              : 'from-blue-50 to-indigo-50 border-blue-500'
                          } border-l-4 rounded-lg p-5 shadow-md`}
                        >
                          <div className="flex items-start">
                            {isCorrectAnswer ? (
                              <CheckCircle className="w-6 h-6 text-green-600 mr-3 flex-shrink-0 mt-0.5" />
                            ) : (
                              <AlertCircle className="w-6 h-6 text-blue-600 mr-3 flex-shrink-0 mt-0.5" />
                            )}

                            <div>
                              <p
                                className={`text-sm font-bold mb-2 ${
                                  isCorrectAnswer
                                    ? 'text-green-900'
                                    : 'text-blue-900'
                                }`}
                              >
                                {isCorrectAnswer
                                  ? 'Tebrikler! Doğru cevap.'
                                  : `Doğru cevap: ${String.fromCharCode(
                                      97 + q.correct
                                    ).toUpperCase()}) ${q.options[q.correct]}`}
                              </p>

                              <p
                                className={`text-sm leading-relaxed ${
                                  isCorrectAnswer
                                    ? 'text-green-800'
                                    : 'text-blue-800'
                                }`}
                              >
                                <strong>Açıklama:</strong> {q.explanation}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="mt-12 text-center pb-10 space-y-4">
          <div className="inline-block bg-white/95 rounded-lg shadow-lg px-8 py-4">
            <p className="text-gray-700 font-semibold">🎓 Başarılar dileriz!</p>
          </div>

          <p className="text-sm text-slate-300">
            Developed by{' '}
            <span className="font-semibold text-slate-100">Emirhan Göl</span>
          </p>

          {/* ✅ Kullanıcının istediği ek footer metni */}
          <p className="text-sm text-slate-300">
            Her türlü görüş ve önerileriniz için{' '}
            <span className="font-semibold text-slate-100">Emirhan Göl</span>
            &apos;e direkt ulaşım sağlayabilirsiniz:{' '}
            <a
              className="underline decoration-white/30 hover:decoration-white/70 text-slate-100 font-semibold"
              href="mailto:emirhnglbusiness@gmail.com"
            >
              emirhnglbusiness@gmail.com
            </a>{' '}
            ·{' '}
            <a
              className="underline decoration-white/30 hover:decoration-white/70 text-slate-100 font-semibold"
              href="tel:+905515534637"
            >
              +90 551 553 46 37
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LaserExamBooklet;
