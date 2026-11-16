const defaultModul = [
    {
        id: 'mod-1',
        kategori: 'Pengenalan 3D',
        judul: 'Mengenal Dunia Animasi 3D untuk Anak',
        ringkasan: 'Mempelajari apa itu animasi 3D, perbedaan objek 2D dan 3D, serta bagaimana karakter kartun dibuat hidup.',
        konten: 'Animasi 3D (Tiga Dimensi) adalah objek digital yang memiliki panjang, lebar, dan kedalaman. Berbeda dengan gambar kertas (2D) biasa, karakter 3D bisa diputar dari berbagai sudut pandang, memiliki bentuk tubuh yang bervolume, dan dapat digerakkan menggunakan kerangka digital (rigging) layaknya boneka wayang modern.'
    },
    {
        id: 'mod-2',
        kategori: 'Alat & Perangkat',
        judul: 'Aplikasi & Pemodelan Bentuk Dasar',
        ringkasan: 'Mengenal perangkat lunak pembuat 3D interaktif dan bentuk-bentuk geometri dasar (Kubus, Bola, Silinder).',
        konten: 'Dalam membuat game atau animasi edukasi anak SD, kita menggunakan bentuk geometri dasar (Primitives) seperti bola untuk kepala karakter, silinder untuk tangan/kaki, dan kubus untuk badan. Bentuk-bentuk ini kemudian digabungkan dan dihaluskan (smooth) menjadi karakter hewan atau pahlawan cerita yang lucu.'
    },
    {
        id: 'mod-3',
        kategori: 'Gerakan & Warna',
        judul: 'Pewarnaan Ceria & Prinsip Gerakan (Rigging)',
        ringkasan: 'Pentingnya warna cerah, pencahayaan ceria, dan cara membuat animasi berjalan yang natural.',
        konten: 'Anak-anak sangat menyukai warna yang cerah dan kontras seperti hijau daun, biru langit, dan kuning ceria. Selain warna, pergerakan animasi (Keyframe Animation) harus dibuat lambat dan ekspresif agar mudah dipahami, seperti gerakan melompat, melambaikan tangan, atau tersenyum.'
    },
    {
        id: 'mod-4',
        kategori: 'Penerapan Belajar',
        judul: 'Media Pembelajaran Interaktif Berbasis 3D',
        ringkasan: 'Penerapan objek 3D dalam web dan game edukasi untuk meningkatkan minat belajar siswa SD.',
        konten: 'Penggunaan objek 3D interaktif di dalam browser web atau game edukasi membuat proses belajar matematika, sains, dan bahasa menjadi seperti bermain game. Siswa dapat memutar objek planet, bangun ruang, atau anatomi hewan secara langsung di layar komputer.'
    }
];

const bankSoalData = [
    {
        tanya: '1. Apa kepanjangan dari istilah 3D dalam dunia grafis dan animasi?',
        opsi: ['Tiga Detik', 'Tiga Dimensi', 'Tontonan Digital', 'Tata Dekorasi'],
        benar: 1,
        pembahasan: '3D singkatan dari Tiga Dimensi, yang berarti objek memiliki ukuran panjang, lebar, dan tinggi/kedalaman.'
    },
    {
        tanya: '2. Manakah di bawah ini yang merupakan bentuk geometri dasar (Primitive) dalam membuat model 3D?',
        opsi: ['Garis lurus kertas', 'Bola dan Kubus', 'Tinta warna hitam', 'Suara musik'],
        benar: 1,
        pembahasan: 'Bola, kubus, tabung, dan kerucut adalah bentuk geometri dasar pembangun objek 3D.'
    },
    {
        tanya: '3. Proses memberi warna, tekstur kulit, atau pakaian pada objek 3D disebut...',
        opsi: ['Rendering', 'Texturing / Coloring', 'Deleting', 'Printing'],
        benar: 1,
        pembahasan: 'Texturing atau pewarnaan berfungsi memberikan rupa, warna baju, atau corak pada permukaan objek 3D.'
    },
    {
        tanya: '4. Mengapa anak-anak tingkat sekolah dasar (SD) sangat menyukai visual animasi 3D yang cerah?',
        opsi: ['membuat mata cepat lelah, merangsang daya imajinasi dan menarik perhatian belajar, membuat bosan, tidak ada pengaruhnya'],
        benar: 1,
        pembahasan: 'Warna cerah dan bentuk 3D yang interaktif terbukti ampuh menarik perhatian dan merangsang imajinasi anak SD.'
    },
    {
        tanya: '5. Apa fungsi dari proses "Rigging" atau pembuatan kerangka pada karakter 3D?',
        opsi: ['Agar karakter bisa digerakkan dan berekspresi', 'Agar file komputer menjadi rusak', 'Menghapus warna karakter', 'Mengubah ukuran layar monitor'],
        benar: 0,
        pembahasan: 'Rigging adalah proses memasang tulang/kerangka digital di dalam karakter 3D agar bisa ditekuk, berjalan, dan berkedip.'
    },
    {
        tanya: '6. Perangkat lunak web atau game edukasi 3D untuk anak SD paling baik disajikan dengan cara...',
        opsi: ['Diam kaku tanpa interaksi', 'Bisa diputar, diklik, dan dimainkan secara interaktif', 'Dicetak di atas kertas koran', 'Hanya berupa teks hitam putih'],
        benar: 1,
        pembahasan: 'Fitur interaktif di mana anak bisa memutar dan mengeksplorasi objek 3D secara langsung membuat belajar jauh lebih seru.'
    }
];