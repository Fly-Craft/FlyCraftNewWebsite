// Data for the five aircraft pages, extracted from the original
// flycraft-fleet-next tail pages. Photos live under public/assets/.
//
// The cabin-configuration day/night images (9new/9Divan for the 300s,
// 8new/8Divan for the 350s) get replaced in place under the same filename
// whenever the client sends updated art. Browsers cache the old bytes at
// that URL, so bump the "?v=" query param on those four `img` values below
// each time the underlying files are swapped.

export type Aircraft = {
  slug: string;
  pod: number;
  tail: string;
  model: string; // "300" | "350"
  about: string;
  stats: { value: string; label: string }[];
  yom: string;
  refurbished: string;
  tour: string;
  day: { headline: string; img: string };
  night: { headline: string; img: string };
  upper: string[];
  lower: string[];
  maps: { ny: string; mia: string; lax: string };
};

export const AIRCRAFT: Aircraft[] = [
  {
    "slug": "n971mc",
    "pod": 1,
    "tail": "N971MC",
    "model": "300",
    "about": "The finest aircraft in the super mid-size category. Renowned for its comfort, performance, and reliability — the Challenger 300 combines transcontinental range with a quiet, spacious cabin and the latest technology to deliver a refined travel experience.",
    "stats": [
      {
        "value": "6:30",
        "label": "Max Flight Time"
      },
      {
        "value": "3,000",
        "label": "Miles Range"
      },
      {
        "value": "470",
        "label": "Knots"
      },
      {
        "value": "2+1",
        "label": "Crew"
      },
      {
        "value": "45,000",
        "label": "Cruising Altitude"
      },
      {
        "value": "9",
        "label": "Passengers"
      }
    ],
    "yom": "2008",
    "refurbished": "2020",
    "tour": "https://my.matterport.com/show/?m=NHJRYx2xrUT",
    "day": {
      "headline": "9 Passengers",
      "img": "/assets/9new.png?v=3"
    },
    "night": {
      "headline": "1 Bed / Sleeps 2",
      "img": "/assets/9Divan.png?v=3"
    },
    "upper": [
      "/assets/N971MC%20photos/Upper%20gallery/_DSC3332.jpg",
      "/assets/N971MC%20photos/Upper%20gallery/_DSC3381.jpg",
      "/assets/N971MC%20photos/Upper%20gallery/_DSC3344.jpg",
      "/assets/N971MC%20photos/Upper%20gallery/_DSC3387.jpg",
      "/assets/N971MC%20photos/Upper%20gallery/_DSC3346.jpg",
      "/assets/N971MC%20photos/Upper%20gallery/_DSC3413.jpg",
      "/assets/N971MC%20photos/Upper%20gallery/_DSC3357.jpg",
      "/assets/N971MC%20photos/Upper%20gallery/_DSC3436.jpg",
      "/assets/N971MC%20photos/Upper%20gallery/_DSC3362.jpg"
    ],
    "lower": [
      "/assets/N971MC%20photos/Lower%20gallery/_DSC3399.jpg",
      "/assets/N971MC%20photos/Lower%20gallery/_DSC3331.jpg",
      "/assets/N971MC%20photos/Lower%20gallery/_DSC3357.jpg"
    ],
    "maps": {
      "ny": "/assets/MAP300NY.png",
      "mia": "/assets/MAP300MA.png",
      "lax": "/assets/MAP300LA.png"
    }
  },
  {
    "slug": "n150mb",
    "pod": 2,
    "tail": "N150MB",
    "model": "300",
    "about": "The finest aircraft in the super mid-size category. Renowned for its comfort, performance, and reliability — the Challenger 300 combines transcontinental range with a quiet, spacious cabin and the latest technology to deliver a refined travel experience.",
    "stats": [
      {
        "value": "6:30",
        "label": "Max Flight Time"
      },
      {
        "value": "3,000",
        "label": "Miles Range"
      },
      {
        "value": "470",
        "label": "Knots"
      },
      {
        "value": "2+1",
        "label": "Crew"
      },
      {
        "value": "45,000",
        "label": "Cruising Altitude"
      },
      {
        "value": "9",
        "label": "Passengers"
      }
    ],
    "yom": "2008",
    "refurbished": "2019",
    "tour": "https://my.matterport.com/show/?m=75SGQn5mAn3",
    "day": {
      "headline": "9 Passengers",
      "img": "/assets/9new.png?v=3"
    },
    "night": {
      "headline": "1 Bed / Sleeps 2",
      "img": "/assets/9Divan.png?v=3"
    },
    "upper": [
      "/assets/N150MB%20Photos/Upper%20gallery/_DSC0888.jpg",
      "/assets/N150MB%20Photos/Upper%20gallery/_DSC0965.jpg",
      "/assets/N150MB%20Photos/Upper%20gallery/_DSC0893.jpg",
      "/assets/N150MB%20Photos/Upper%20gallery/_DSC1086.jpg",
      "/assets/N150MB%20Photos/Upper%20gallery/_DSC0904.jpg",
      "/assets/N150MB%20Photos/Upper%20gallery/_DSC2331.jpg",
      "/assets/N150MB%20Photos/Upper%20gallery/_DSC0916.jpg",
      "/assets/N150MB%20Photos/Upper%20gallery/_DSC2839.jpg"
    ],
    "lower": [
      "/assets/N150MB%20Photos/Lower%20gallery/_DSC2901.jpg",
      "/assets/N150MB%20Photos/Lower%20gallery/_DSC0869.jpg",
      "/assets/N150MB%20Photos/Lower%20gallery/_DSC0904.jpg"
    ],
    "maps": {
      "ny": "/assets/MAP300NY.png",
      "mia": "/assets/MAP300MA.png",
      "lax": "/assets/MAP300LA.png"
    }
  },
  {
    "slug": "n251ft",
    "pod": 3,
    "tail": "N251FT",
    "model": "300",
    "about": "The finest aircraft in the super mid-size category. Renowned for its comfort, performance, and reliability — the Challenger 300 combines transcontinental range with a quiet, spacious cabin and the latest technology to deliver a refined travel experience.",
    "stats": [
      {
        "value": "6:30",
        "label": "Max Flight Time"
      },
      {
        "value": "3,000",
        "label": "Miles Range"
      },
      {
        "value": "470",
        "label": "Knots"
      },
      {
        "value": "2+1",
        "label": "Crew"
      },
      {
        "value": "45,000",
        "label": "Cruising Altitude"
      },
      {
        "value": "9",
        "label": "Passengers"
      }
    ],
    "yom": "2011",
    "refurbished": "2022",
    "tour": "https://my.matterport.com/show/?m=TQC6g1yZYDP",
    "day": {
      "headline": "9 Passengers",
      "img": "/assets/9new.png?v=3"
    },
    "night": {
      "headline": "1 Bed / Sleeps 2",
      "img": "/assets/9Divan.png?v=3"
    },
    "upper": [
      "/assets/N251FT%20Photos/Upper%20gallery/_DSC1201.jpg",
      "/assets/N251FT%20Photos/Upper%20gallery/_DSC0106.jpg",
      "/assets/N251FT%20Photos/Upper%20gallery/_DSC0743.jpg",
      "/assets/N251FT%20Photos/Upper%20gallery/_DSC3491.jpg",
      "/assets/N251FT%20Photos/Upper%20gallery/_DSC0274.jpg",
      "/assets/N251FT%20Photos/Upper%20gallery/_DSC1194.jpg",
      "/assets/N251FT%20Photos/Upper%20gallery/_DSC3468.jpg",
      "/assets/N251FT%20Photos/Upper%20gallery/_DSC1204.jpg",
      "/assets/N251FT%20Photos/Upper%20gallery/_DSC0138.jpg"
    ],
    "lower": [
      "/assets/N251FT%20Photos/Lower%20gallery/_DSC0741.jpg",
      "/assets/N251FT%20Photos/Lower%20gallery/_DSC0138.jpg",
      "/assets/N251FT%20Photos/Lower%20gallery/_DSC0284.jpg"
    ],
    "maps": {
      "ny": "/assets/MAP300NY.png",
      "mia": "/assets/MAP300MA.png",
      "lax": "/assets/MAP300LA.png"
    }
  },
  {
    "slug": "n395pd",
    "pod": 5,
    "tail": "N395PD",
    "model": "350",
    "about": "The finest aircraft in the super mid-size category. Renowned for its comfort, performance, and reliability — the Challenger 350 combines transcontinental range with a quiet, spacious cabin and the latest technology to deliver a refined travel experience.",
    "stats": [
      {
        "value": "7:00",
        "label": "Max Flight Time"
      },
      {
        "value": "3,200",
        "label": "Miles Range"
      },
      {
        "value": "470",
        "label": "Knots"
      },
      {
        "value": "2+1",
        "label": "Crew"
      },
      {
        "value": "45,000",
        "label": "Cruising Altitude"
      },
      {
        "value": "8",
        "label": "Passengers"
      }
    ],
    "yom": "2015",
    "refurbished": "—",
    "tour": "https://my.matterport.com/show/?m=5HCdwkMbfJd",
    "day": {
      "headline": "8 Passengers",
      "img": "/assets/8new.png?v=3"
    },
    "night": {
      "headline": "3 Beds / Sleeps 3",
      "img": "/assets/8Divan.png?v=3"
    },
    "upper": [
      "/assets/N395PD%20Photos/Upper%20gallery/_DSC3512.jpg",
      "/assets/N395PD%20Photos/Upper%20gallery/_DSC2074.jpg",
      "/assets/N395PD%20Photos/Upper%20gallery/_DSC2031.jpg",
      "/assets/N395PD%20Photos/Upper%20gallery/_DSC2128.jpg",
      "/assets/N395PD%20Photos/Upper%20gallery/_DSC3684.jpg",
      "/assets/N395PD%20Photos/Upper%20gallery/_DSC3539.jpg",
      "/assets/N395PD%20Photos/Upper%20gallery/_DSC2182.jpg",
      "/assets/N395PD%20Photos/Upper%20gallery/_DSC3525.jpg",
      "/assets/N395PD%20Photos/Upper%20gallery/_DSC2076.jpg"
    ],
    "lower": [
      "/assets/N395PD%20Photos/Lower%20gallery/_DSC2027.jpg",
      "/assets/N395PD%20Photos/Lower%20gallery/_DSC2090.jpg",
      "/assets/N395PD%20Photos/Lower%20gallery/_DSC2098.jpg"
    ],
    "maps": {
      "ny": "/assets/MAP350NY.png",
      "mia": "/assets/MAP350MA.png",
      "lax": "/assets/MAP350LA.png"
    }
  },
  {
    "slug": "n7pg",
    "pod": 6,
    "tail": "N7PG",
    "model": "350",
    "about": "The finest aircraft in the super mid-size category. Renowned for its comfort, performance, and reliability — the Challenger 350 combines transcontinental range with a quiet, spacious cabin and the latest technology to deliver a refined travel experience.",
    "stats": [
      {
        "value": "7:00",
        "label": "Max Flight Time"
      },
      {
        "value": "3,200",
        "label": "Miles Range"
      },
      {
        "value": "470",
        "label": "Knots"
      },
      {
        "value": "2+1",
        "label": "Crew"
      },
      {
        "value": "45,000",
        "label": "Cruising Altitude"
      },
      {
        "value": "8",
        "label": "Passengers"
      }
    ],
    "yom": "2014",
    "refurbished": "2017",
    "tour": "https://my.matterport.com/show/?m=7p6xPnqXRmJ",
    "day": {
      "headline": "8 Passengers",
      "img": "/assets/8new.png?v=3"
    },
    "night": {
      "headline": "3 Beds / Sleeps 3",
      "img": "/assets/8Divan.png?v=3"
    },
    "upper": [
      "/assets/N7PG%20Photos/Upper%20gallery/_DSC3026.jpg",
      "/assets/N7PG%20Photos/Upper%20gallery/_DSC3168.jpg",
      "/assets/N7PG%20Photos/Upper%20gallery/_DSC3064.jpg",
      "/assets/N7PG%20Photos/Upper%20gallery/_DSC3239.jpg",
      "/assets/N7PG%20Photos/Upper%20gallery/_DSC3054.jpg",
      "/assets/N7PG%20Photos/Upper%20gallery/_DSC3181.jpg",
      "/assets/N7PG%20Photos/Upper%20gallery/_DSC3684.jpg",
      "/assets/N7PG%20Photos/Upper%20gallery/_DSC3042.jpg",
      "/assets/N7PG%20Photos/Upper%20gallery/_DSC3215.jpg",
      "/assets/N7PG%20Photos/Upper%20gallery/_DSC3106.jpg",
      "/assets/N7PG%20Photos/Upper%20gallery/_DSC3211.jpg",
      "/assets/N7PG%20Photos/Upper%20gallery/_DSC3256.jpg",
      "/assets/N7PG%20Photos/Upper%20gallery/_DSC3055.jpg"
    ],
    "lower": [
      "/assets/N7PG%20Photos/Lower%20gallery/_DSC3266.jpg",
      "/assets/N7PG%20Photos/Lower%20gallery/_DSC3212.jpg",
      "/assets/N7PG%20Photos/Lower%20gallery/_DSC3215.jpg"
    ],
    "maps": {
      "ny": "/assets/MAP350NY.png",
      "mia": "/assets/MAP350MA.png",
      "lax": "/assets/MAP350LA.png"
    }
  }
];
