/**
 * Hand-tuned line icons — 24px grid, 1.5px stroke (set in CSS), round caps & joins.
 * Inner SVG markup only; rendered by Icon.astro.
 */
export const icons = {
  // UI
  'arrow-right': '<path d="M4.5 12h15M13.5 6l6 6-6 6"/>',
  'arrow-left': '<path d="M19.5 12h-15M10.5 6l-6 6 6 6"/>',
  'arrow-up-right': '<path d="M7 17 17 7M8.5 7H17v8.5"/>',
  'arrow-down': '<path d="M12 4.5v15M6 13.5l6 6 6-6"/>',
  'chevron-down': '<path d="m6 9.5 6 6 6-6"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  close: '<path d="M6 6l12 12M18 6 6 18"/>',
  menu: '<path d="M4 8h16M4 16h16"/>',
  phone:
    '<path d="M8.6 3.75H6.1a2.1 2.1 0 0 0-2.1 2.3 15.6 15.6 0 0 0 13.95 13.95 2.1 2.1 0 0 0 2.3-2.1v-2.5a1.4 1.4 0 0 0-1.06-1.36l-2.9-.73a1.4 1.4 0 0 0-1.42.47l-.9 1.12a11.2 11.2 0 0 1-4.9-4.9l1.12-.9a1.4 1.4 0 0 0 .47-1.42l-.73-2.9A1.4 1.4 0 0 0 8.6 3.75Z"/>',
  mail: '<rect x="3.25" y="5.25" width="17.5" height="13.5" rx="2.25"/><path d="m4 7 8 6 8-6"/>',
  download: '<path d="M12 4v11M7 10.5l5 5 5-5M5 19.5h14"/>',
  print:
    '<path d="M7 8V4h10v4M7 17H5.5A1.5 1.5 0 0 1 4 15.5v-5A2.5 2.5 0 0 1 6.5 8h11a2.5 2.5 0 0 1 2.5 2.5v5a1.5 1.5 0 0 1-1.5 1.5H17"/><path d="M7 14h10v6H7z"/>',
  external:
    '<path d="M14 4.5h5.5V10M19.5 4.5 11 13M17 14v4.5a1 1 0 0 1-1 1H5.5a1 1 0 0 1-1-1V8a1 1 0 0 1 1-1H10"/>',
  check: '<path d="m5 12.5 4.5 4.5L19 7.5"/>',
  quote: '<path d="M10 7.5c-3 .8-5 3.3-5 6.6V17h4.5v-4.5H6.8M19 7.5c-3 .8-5 3.3-5 6.6V17h4.5v-4.5h-2.7"/>',

  // Services
  exchange: '<path d="M4 8.5h14.5M15 5l3.5 3.5L15 12M20 15.5H5.5M9 12l-3.5 3.5L9 19"/>',
  compass: '<circle cx="12" cy="12" r="8.25"/><path d="m14.9 9.1-1.7 4.1-4.1 1.7 1.7-4.1 4.1-1.7Z"/>',
  growth: '<path d="M4 19.5h16M6.5 16v-3M10.5 16v-5.5M14.5 16V8.5M18.5 16V5.5"/>',
  report:
    '<path d="M14 3.75H7.25a1.5 1.5 0 0 0-1.5 1.5v13.5a1.5 1.5 0 0 0 1.5 1.5h9.5a1.5 1.5 0 0 0 1.5-1.5V8L14 3.75Z"/><path d="M14 3.75V8h4.25M9 16.5v-2M12 16.5v-4.5M15 16.5v-3"/>',
  key: '<circle cx="8.5" cy="12" r="4.25"/><path d="M12.75 12h7.5M17.25 12v3M20.25 12v2"/>',
  civic:
    '<path d="M3.75 20.25h16.5M5 9.25h14M12 3.75l7.5 4H4.5l7.5-4ZM6.75 9.25v8.25M10.25 9.25v8.25M13.75 9.25v8.25M17.25 9.25v8.25M4.5 17.5h15"/>',
  shield:
    '<path d="M12 3.75 5 6.5v5.2c0 4.1 2.9 7.4 7 8.55 4.1-1.15 7-4.45 7-8.55V6.5l-7-2.75Z"/><path d="m9 12 2.2 2.2L15.2 10"/>',
  gear: '<circle cx="12" cy="12" r="3"/><path d="M12 3.75v2.5M12 17.75v2.5M20.25 12h-2.5M6.25 12h-2.5M17.83 6.17l-1.77 1.77M7.94 16.06l-1.77 1.77M17.83 17.83l-1.77-1.77M7.94 7.94 6.17 6.17"/>',
  calendar:
    '<rect x="4" y="5.25" width="16" height="14.5" rx="2"/><path d="M4 10h16M8.5 3.5v3.5M15.5 3.5v3.5M8 14h2M14 14h2M8 17h2"/>',
  scales: '<path d="M12 4v16M8 20h8M5 7h14M7 7l-3 7a3 3 0 0 0 6 0L7 7ZM17 7l-3 7a3 3 0 0 0 6 0l-3-7Z"/>',
  percent: '<path d="M18 6 6 18"/><circle cx="7.5" cy="7.5" r="2.25"/><circle cx="16.5" cy="16.5" r="2.25"/>',

  // Misc
  building:
    '<path d="M5 20.25V5.5a1.5 1.5 0 0 1 1.5-1.5h7a1.5 1.5 0 0 1 1.5 1.5v14.75M15 9.5h3.5a1.5 1.5 0 0 1 1.5 1.5v9.25M3.5 20.25h17M8.5 8h2.5M8.5 11.5h2.5M8.5 15h2.5"/>',
  review: '<circle cx="10.5" cy="10.5" r="6.25"/><path d="m15 15 5 5M8 10.5l1.8 1.8 3.2-3.3"/>',
  person: '<circle cx="12" cy="8.5" r="3.75"/><path d="M5 20c.8-3.6 3.6-5.75 7-5.75S18.2 16.4 19 20"/>',
} as const;

export type IconName = keyof typeof icons;
