export type TeacherVideo = {
  id: number;
  teacherName: string;
  teacherSlug?: string;
  country: string;
  title: string;
  subtitle: string;
  embedId: string;
  youtubeUrl: string;
};

export const teacherVideos: TeacherVideo[] = [
  {
    id: 1,
    teacherName: 'Funky Asparagus',
    teacherSlug: 'funky-asparagus',
    country: 'SWE',
    title: "Funky Asparagus Judge Solo",
    subtitle: "Who's Got The Funk 2025",
    embedId: 'VUP7I_85nCA',
    youtubeUrl: 'https://www.youtube.com/shorts/VUP7I_85nCA',
  },
  {
    id: 2,
    teacherName: 'Tony GoGo',
    teacherSlug: 'tony-gogo',
    country: 'USA/JPN',
    title: 'Tony GoGo / GoGo Family Judge Demo',
    subtitle: 'Locking judge demo',
    embedId: '3DHb4W-YoIs',
    youtubeUrl: 'https://www.youtube.com/watch?v=3DHb4W-YoIs',
  },
  {
    id: 3,
    teacherName: 'Khan',
    teacherSlug: 'khan',
    country: 'KOR',
    title: 'Khan Originality Crew Combo',
    subtitle: 'Locking tutorial / YAKfilms',
    embedId: 'KNKcNhAOseY',
    youtubeUrl: 'https://www.youtube.com/watch?v=KNKcNhAOseY',
  },
  {
    id: 4,
    teacherName: 'P-Lock',
    teacherSlug: 'p-lock',
    country: 'FR',
    title: 'P-Lock Locking Class',
    subtitle: 'Urban Dance Camp workshop',
    embedId: 'ZdKCo6lZ51k',
    youtubeUrl: 'https://www.youtube.com/watch?v=ZdKCo6lZ51k',
  },
  {
    id: 5,
    teacherName: 'A-Train',
    teacherSlug: 'a-train',
    country: 'SWE',
    title: 'Markus & Alex A-Train vs Ducky & Jay',
    subtitle: 'Juste Debout 2012 Final Locking',
    embedId: 'P9l4iCecYXY',
    youtubeUrl: 'https://www.youtube.com/watch?v=P9l4iCecYXY',
  },
  {
    id: 6,
    teacherName: 'Willow',
    teacherSlug: 'willow',
    country: 'FR',
    title: 'Willow vs Candyman',
    subtitle: 'Locking Forever / Summer Dance Forever',
    embedId: '-dDwxbyfsHM',
    youtubeUrl: 'https://www.youtube.com/watch?v=-dDwxbyfsHM',
  },
];