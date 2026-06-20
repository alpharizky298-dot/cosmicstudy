/* ══════════════════════════════════════
   COSMIC.ID — database.js
   Planet & Moon Data (bilingual: id / en)
══════════════════════════════════════ */

const DB = {

  /* ── SUN ── */
  Sun: {
    col: '#ffaa00',
    id: {
      type: 'Bintang — Katai Kuning (G2V)',
      period: '—', dist: 'Pusat tata surya', distLbl: 'Posisi',
      diam: '1.392.700 km', temp: '5.500°C (permukaan)',
      facts: [
        'Matahari mengandung 99,86% massa seluruh tata surya.',
        'Cahaya butuh 8 menit 20 detik untuk mencapai Bumi dari Matahari.',
        'Inti Matahari mencapai 15 juta°C — cukup panas untuk fusi nuklir.',
        'Setiap detik membakar 600 juta ton hidrogen namun masih bersinar ~5 miliar tahun lagi.',
      ],
    },
    en: {
      type: 'Star — Yellow Dwarf (G2V)',
      period: '—', dist: 'Center of solar system', distLbl: 'Position',
      diam: '1,392,700 km', temp: '5,500°C (surface)',
      facts: [
        "The Sun contains 99.86% of the solar system's total mass.",
        'Light takes 8 minutes 20 seconds to travel from the Sun to Earth.',
        "The Sun's core reaches 15 million°C — hot enough for nuclear fusion.",
        'It burns 600 million tons of hydrogen per second yet will shine for ~5 billion more years.',
      ],
    },
  },

  /* ── MERCURY ── */
  Mercury: {
    col: '#aaaaaa', moons: null,
    id: {
      type: 'Planet Terestrial', period: '87.97 hari', dist: '0.39 AU',
      diam: '4.879 km', temp: '167°C',
      facts: [
        'Satu hari di Merkurius lebih lama dari satu tahunnya!',
        'Suhu bisa melonjak ke 430°C siang hari dan -180°C malam hari.',
        'Planet terkecil di tata surya.',
      ],
    },
    en: {
      type: 'Terrestrial Planet', period: '87.97 days', dist: '0.39 AU',
      diam: '4,879 km', temp: '167°C',
      facts: [
        'A day on Mercury is longer than its year!',
        'Temperatures swing from 430°C at noon to -180°C at midnight.',
        'Smallest planet in the solar system.',
      ],
    },
  },

  /* ── VENUS ── */
  Venus: {
    col: '#ffcc66', moons: null,
    id: {
      type: 'Planet Terestrial', period: '224.70 hari', dist: '0.72 AU',
      diam: '12.104 km', temp: '462°C',
      facts: [
        'Planet terpanas meski bukan yang terdekat ke Matahari — efek rumah kaca ekstrem.',
        'Berputar berlawanan arah, Matahari terbit dari barat di Venus.',
        'Satu hari di Venus lebih lama dari satu tahunnya.',
      ],
    },
    en: {
      type: 'Terrestrial Planet', period: '224.70 days', dist: '0.72 AU',
      diam: '12,104 km', temp: '462°C',
      facts: [
        'Hottest planet despite not being closest to the Sun — extreme greenhouse effect.',
        'Rotates backwards, so the Sun rises in the west on Venus.',
        'A day on Venus is longer than its year.',
      ],
    },
  },

  /* ── EARTH ── */
  Earth: {
    col: '#4499ff', moons: ['Moon'],
    id: {
      type: 'Planet Terestrial', period: '365.25 hari', dist: '1.00 AU',
      diam: '12.742 km', temp: '15°C',
      facts: [
        'Satu-satunya planet yang diketahui memiliki kehidupan.',
        '71% permukaan tertutup air.',
        'Medan magnet melindungi dari radiasi matahari berbahaya.',
      ],
    },
    en: {
      type: 'Terrestrial Planet', period: '365.25 days', dist: '1.00 AU',
      diam: '12,742 km', temp: '15°C',
      facts: [
        'The only planet known to harbor life.',
        '71% of the surface is covered by water.',
        'Its magnetic field shields life from harmful solar radiation.',
      ],
    },
  },

  /* ── MARS ── */
  Mars: {
    col: '#ff5544', moons: ['Phobos', 'Deimos'],
    id: {
      type: 'Planet Terestrial', period: '686.97 hari', dist: '1.52 AU',
      diam: '6.779 km', temp: '-65°C',
      facts: [
        'Olympus Mons — gunung terbesar di tata surya, setinggi 21 km.',
        'Sehari di Mars hanya 37 menit lebih lama dari Bumi.',
        'Memiliki dua bulan kecil: Phobos dan Deimos.',
      ],
    },
    en: {
      type: 'Terrestrial Planet', period: '686.97 days', dist: '1.52 AU',
      diam: '6,779 km', temp: '-65°C',
      facts: [
        "Olympus Mons — the tallest volcano in the solar system at 21 km.",
        "A Martian day is only 37 minutes longer than Earth's.",
        'Has two small moons: Phobos and Deimos.',
      ],
    },
  },

  /* ── JUPITER ── */
  Jupiter: {
    col: '#ff8833', moons: ['Europa'],
    id: {
      type: 'Planet Gas Raksasa', period: '11.86 tahun', dist: '5.20 AU',
      diam: '139.820 km', temp: '-110°C',
      facts: [
        'Semua planet lain bisa masuk ke dalam Jupiter sekaligus!',
        'Badai Great Red Spot sudah berlangsung 350+ tahun.',
        'Memiliki 95 bulan resmi.',
      ],
    },
    en: {
      type: 'Gas Giant', period: '11.86 years', dist: '5.20 AU',
      diam: '139,820 km', temp: '-110°C',
      facts: [
        'All other planets could fit inside Jupiter simultaneously!',
        'The Great Red Spot storm has raged for 350+ years.',
        'Has 95 officially recognized moons.',
      ],
    },
  },

  /* ── SATURN ── */
  Saturn: {
    col: '#ffee88', moons: ['Titan'],
    id: {
      type: 'Planet Gas Raksasa', period: '29.46 tahun', dist: '9.58 AU',
      diam: '116.460 km', temp: '-140°C',
      facts: [
        'Cincinnya membentang 282.000 km namun hanya setebal ~1 km.',
        'Densitas Saturn lebih rendah dari air — bisa mengapung!',
        'Titan punya danau metana cair di permukaannya.',
      ],
    },
    en: {
      type: 'Gas Giant', period: '29.46 years', dist: '9.58 AU',
      diam: '116,460 km', temp: '-140°C',
      facts: [
        'Its rings span 282,000 km yet are only ~1 km thick.',
        "Saturn's density is lower than water — it would float!",
        'Moon Titan has liquid methane lakes on its surface.',
      ],
    },
  },

  /* ── URANUS ── */
  Uranus: {
    col: '#88ddff', moons: null,
    id: {
      type: 'Planet Es Raksasa', period: '84.01 tahun', dist: '19.22 AU',
      diam: '50.724 km', temp: '-195°C',
      facts: [
        'Berputar "miring" 98° — seolah menggelinding mengelilingi Matahari.',
        'Memiliki cincin vertikal karena kemiringan ekstremnya.',
        'Salah satu planet terdingin meski bukan yang terjauh.',
      ],
    },
    en: {
      type: 'Ice Giant', period: '84.01 years', dist: '19.22 AU',
      diam: '50,724 km', temp: '-195°C',
      facts: [
        'Tilted 98° — it essentially rolls around the Sun on its side.',
        'Has vertical rings due to its extreme axial tilt.',
        'One of the coldest planets despite not being the farthest.',
      ],
    },
  },

  /* ── NEPTUNE ── */
  Neptune: {
    col: '#4466ff', moons: ['Triton'],
    id: {
      type: 'Planet Es Raksasa', period: '164.80 tahun', dist: '30.05 AU',
      diam: '49.244 km', temp: '-200°C',
      facts: [
        'Angin tercepat di tata surya — hingga 2.100 km/jam.',
        'Ditemukan secara matematis sebelum pernah diamati teleskop.',
        'Bulan Triton memiliki orbit retrograde yang sangat langka.',
      ],
    },
    en: {
      type: 'Ice Giant', period: '164.80 years', dist: '30.05 AU',
      diam: '49,244 km', temp: '-200°C',
      facts: [
        'Has the fastest winds in the solar system — up to 2,100 km/h.',
        'Was discovered mathematically before being observed through a telescope.',
        'Moon Triton has an extremely rare retrograde orbit.',
      ],
    },
  },

  /* ══ MOONS ══ */

  Moon: {
    col: '#cccccc',
    id: {
      type: 'Satelit Alami Bumi', period: '27.32 hari',
      dist: '384.400 km dari Bumi', distLbl: 'Jarak dari Bumi',
      diam: '3.474 km', temp: '-53°C rata-rata',
      facts: [
        'Bulan menjauh dari Bumi ~3,8 cm per tahun akibat gaya pasang surut.',
        'Selalu menampilkan sisi yang sama ke Bumi karena tidal locking.',
        'Tanpa Bulan, sumbu rotasi Bumi tidak stabil dan iklim jauh lebih ekstrem.',
        'Gravitasi Bulan menyebabkan pasang surut laut di seluruh Bumi.',
      ],
    },
    en: {
      type: "Natural Satellite of Earth", period: '27.32 days',
      dist: '384,400 km from Earth', distLbl: 'Distance from Earth',
      diam: '3,474 km', temp: '-53°C average',
      facts: [
        'The Moon drifts ~3.8 cm away from Earth each year due to tidal forces.',
        'It always shows the same face to Earth due to tidal locking.',
        "Without the Moon, Earth's axis would wobble causing extreme climate changes.",
        "The Moon's gravity is responsible for Earth's ocean tides.",
      ],
    },
  },

  Phobos: {
    col: '#aa8866',
    id: {
      type: 'Bulan Mars I', period: '0.319 hari',
      dist: '9.376 km dari Mars', distLbl: 'Jarak dari Mars',
      diam: '22.2 km', temp: '-40°C',
      facts: [
        'Phobos mengorbit begitu cepat hingga terbit di barat dan terbenam di timur!',
        'Dalam ~50 juta tahun akan hancur oleh gaya pasang surut Mars.',
      ],
    },
    en: {
      type: 'Mars Moon I', period: '0.319 days',
      dist: '9,376 km from Mars', distLbl: 'Distance from Mars',
      diam: '22.2 km', temp: '-40°C',
      facts: [
        'Phobos orbits so fast it rises in the west and sets in the east!',
        "In ~50 million years it will be torn apart by Mars's tidal forces.",
      ],
    },
  },

  Deimos: {
    col: '#998877',
    id: {
      type: 'Bulan Mars II', period: '1.263 hari',
      dist: '23.463 km dari Mars', distLbl: 'Jarak dari Mars',
      diam: '12.4 km', temp: '-40°C',
      facts: [
        'Salah satu bulan terkecil di tata surya.',
        'Permukaannya lebih halus dari Phobos karena tertutup debu tebal.',
      ],
    },
    en: {
      type: 'Mars Moon II', period: '1.263 days',
      dist: '23,463 km from Mars', distLbl: 'Distance from Mars',
      diam: '12.4 km', temp: '-40°C',
      facts: [
        'One of the smallest moons in the solar system.',
        'Its surface is smoother than Phobos because of a thick dust layer.',
      ],
    },
  },

  Europa: {
    col: '#aabbdd',
    id: {
      type: 'Bulan Jupiter II', period: '3.551 hari',
      dist: '671.100 km dari Jupiter', distLbl: 'Jarak dari Jupiter',
      diam: '3.121 km', temp: '-160°C',
      facts: [
        'Di bawah es Europa ada lautan air cair yang mungkin menyimpan kehidupan!',
        'Salah satu objek paling reflektif di tata surya.',
      ],
    },
    en: {
      type: 'Jupiter Moon II', period: '3.551 days',
      dist: '671,100 km from Jupiter', distLbl: 'Distance from Jupiter',
      diam: '3,121 km', temp: '-160°C',
      facts: [
        "Beneath Europa's icy crust lies a liquid water ocean that may harbor life!",
        'One of the most reflective objects in the solar system.',
      ],
    },
  },

  Titan: {
    col: '#ffaa44',
    id: {
      type: 'Bulan Saturn I (terbesar)', period: '15.945 hari',
      dist: '1.221.870 km dari Saturn', distLbl: 'Jarak dari Saturn',
      diam: '5.149 km', temp: '-179°C',
      facts: [
        'Satu-satunya bulan dengan atmosfer tebal dan danau metana cair.',
        'Lebih besar dari planet Merkurius.',
      ],
    },
    en: {
      type: 'Saturn Moon I (largest)', period: '15.945 days',
      dist: '1,221,870 km from Saturn', distLbl: 'Distance from Saturn',
      diam: '5,149 km', temp: '-179°C',
      facts: [
        'The only moon with a thick atmosphere and liquid methane lakes.',
        'Larger than the planet Mercury.',
      ],
    },
  },

  Triton: {
    col: '#88aacc',
    id: {
      type: 'Bulan Neptune I (terbesar)', period: '5.877 hari',
      dist: '354.760 km dari Neptune', distLbl: 'Jarak dari Neptune',
      diam: '2.707 km', temp: '-235°C',
      facts: [
        'Bergerak berlawanan arah orbit Neptunus — orbit retrograde yang sangat langka.',
        'Salah satu objek terdingin di tata surya.',
      ],
    },
    en: {
      type: 'Neptune Moon I (largest)', period: '5.877 days',
      dist: '354,760 km from Neptune', distLbl: 'Distance from Neptune',
      diam: '2,707 km', temp: '-235°C',
      facts: [
        'Orbits Neptune backwards — an extremely rare retrograde orbit.',
        'One of the coldest objects in the solar system.',
      ],
    },
  },

};
