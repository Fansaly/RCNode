 const path = `
  M 19 3
  c 1.1 0 2 0.9 2 2
  v 4
  h -2
  V 5
  H 5
  v 14
  h 14
  v -4
  h 2
  v 4
  c 0 1.11 -0.9 2 -2 2
  H 5
  c -1.11 0 -2 -0.9 -2 -2
  V 5
  c 0 -1.1 0.89 -2 2 -2
  Z

  M 13.09 15.59
  L 14.5 17
  l 5 -5
  l -5 -5
  l -1.41 1.41
  L 15.67 11
  h -9.67
  v 2
  h 9.67
  l -2.58 2.59
  Z
`.replace(/\s{2,}/g, ' ').trim();

export default path;
