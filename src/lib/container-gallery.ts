export type ContainerFigure = {
  src: string;
  width: number;
  height: number;
  alt: string;
};

export const CONTAINER_BRAND: ContainerFigure = {
  src: "/containers/agron-stardome-brand.webp",
  width: 1800,
  height: 1013,
  alt: "AGRON and StarDome by AGRON over a harbour at dusk",
};

export const CONTAINER_UNITS: ContainerFigure[] = [
  {
    src: "/containers/stardome-harbor-black.webp",
    width: 1400,
    height: 934,
    alt: "Black StarDome by AGRON container on a harbour quay",
  },
  {
    src: "/containers/stardome-island-sand.webp",
    width: 1400,
    height: 933,
    alt: "Sand StarDome by AGRON container beside a private-island villa",
  },
  {
    src: "/containers/stardome-quay-white.webp",
    width: 1400,
    height: 933,
    alt: "White StarDome by AGRON container on a port apron",
  },
  {
    src: "/containers/stardome-deck-compact.webp",
    width: 1400,
    height: 933,
    alt: "Compact StarDome by AGRON shelter on a ship deck",
  },
];

export const CONTAINER_SITES_THREE: ContainerFigure = {
  src: "/containers/agron-sites-three.webp",
  width: 1800,
  height: 970,
  alt: "AGRON units at a marina, a commercial port, and a private island",
};

export const CONTAINER_SITES_FOUR: ContainerFigure = {
  src: "/containers/agron-sites-four.webp",
  width: 1800,
  height: 949,
  alt: "AGRON at a marina, a port, a private island, and a mobile van",
};

export const CONTAINER_HOME_TEASER = CONTAINER_UNITS[0];
