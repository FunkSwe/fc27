export type Teacher = {
  id: number;
  slug: string;
  name: string;
  country: string;
  img: string;
  title: string;
  subtitle: string;
  desc: string;
};

export const teacherData: Teacher[] = [
  {
    id: 6,
    slug: 'a-train',
    name: 'A-train',
    country: 'SWE',
    img: '/teachers/t3.png',
    title: 'Alexander Dam',
    subtitle: 'Funky 4 Brothers / Soul Sweat',
    desc: 'Alexander A-train Dam has practised dance professionally for over 15 years and is today working as a dancer and teacher based in Stockholm, Sweden. His training is based on techniques and experiences from streetdance, contemporary dance and contemporary circus, with a focus on freestyle/improvisation. He was co-founder of the groups Funky 4 Brothers and Soul Sweat. A-train started his artistic path in 2005 working within the Swedish street dance scene with subsequent national and international successes. While continuing to learn about the roots of the locking and streetdance culture and the soil from where it grew, A-train puts a lot of emphasis on groove, techniques and playfulness within his Locking classes.',
  },
  {
    id: 2,
    slug: 'khan',
    name: 'Khan',
    country: 'KR',
    img: '/teachers/t1.png',
    title: 'Khan',
    subtitle: 'Originality',
    desc: 'Khan, from Originality, is one of the most respected Locking dancers from the Korean scene, known for his groove, musicality, character, expression, and unmistakable style.He has been spreading Locking in Korea since the early 2000s and has helped push Korean Locking onto the international stage through battles, performances, workshops, and judging around the world.He was also a master student of Greg “Campbellock Jr.” Pope, carrying important knowledge from the roots of Locking into his own dance, teaching, and expression.His dance carries funk, feeling, and originality, not just steps, but presence.',
  },
  {
    id: 3,
    slug: 'p-lock',
    name: 'P-Lock',
    country: 'FR',
    img: '/teachers/t2.png',
    title: 'Patrick Pires',
    subtitle: 'Team Rockets',
    desc: 'P-Lock began his dance career in the 1990s specialising in b-boying and popping before discovering Locking, the style that gave him his name. Over a decade on and P-Lock is one of the world’s finest Lockers gaining respect and accolades internationally for his vibrant and powerful skills. P-Lock has been a member of top French crews the Vagabonds and The Boogie Lockers. Since then, P-Lock has formed his own companies, toured the world and performed extensively. He is also a highly sought after judge and teacher. P-Lock’s energy and precision make him an unmistakeable artist and unique performer.',
  },
  {
    id: 5,
    slug: 'willow',
    name: 'Willow',
    country: 'FR',
    img: '/teachers/t5.png',
    title: 'Willow Evann',
    subtitle: 'Team Rocket',
    desc: 'From the earliest age Willow Evann felt the need to express himself through dance. Lulled as a child by the reggae his father listened to, he has been immersed in the Hip Hop culture since the age of 10. He then turned to Locking and is considered today as an essential reference of this movement. At the same time, he developed his career as a photographer and focused his practice on capturing gesture and choreographic movement.',
  },
  {
    id: 4,
    slug: 'funky-asparagus',
    name: 'Funky Asparagus',
    country: 'SWE',
    img: '/teachers/t4.png',
    title: 'Manne Schutt',
    subtitle: 'Funkademics',
    desc: 'Manne is one of the first lockers in Sweden to have the fundamentals right. He was first what many call a self-taught dancer, but later learned the artform of locking from the pioneers. He has been teaching locking for a long time and is well known on the scene. He has been in numerous productions, taught at many of Sweden’s top schools and battled in numerous competitions. He has always been dedicated to locking and has a lot to share with the community.',
  },
   {
    id: 1,
    slug: 'tony-gogo',
    name: 'Tony Gogo',
    country: 'US',
    img: '/teachers/t6.png',
    title: 'Anthony Foster',
    subtitle: 'The Gogo Brothers',
    desc: 'Tony “Go-Go” Lewis is an original locking pioneer from the United States and one of the early members of The Go-Go Brothers, a legendary crew connected to the foundation of locking culture. He also performed with The Lockers, the iconic group that helped bring locking to the world stage in the 1970s. Now based in Japan, Tony has played a major role in spreading and teaching locking internationally, inspiring generations of dancers with his funk, groove, history, and original style. His legacy continues through his teaching, his influence on Japanese locking culture, and the next generation of Go-Go Brothers',
  },
];