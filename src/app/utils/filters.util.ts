export const getEncoderByFilterList = (filters: string[]) => {
  const list = ['-af']
  const filtersAvailable = filterList()
  const enc = filters
    .map((f: keyof typeof filtersAvailable) => filtersAvailable[f])
    .join(',')
  list.push(enc)
  return list
}

export const validateFilter = (filters: string[]) => {
  return filters.filter((f) => getListFilterName().includes(f))
}

export const getListFilterName = () => {
  return Object.keys(filterList())
}

export const filterList = () => {
  // Filtros retirados de: https://github.com/Androz2091/discord-player/blob/master/src/utils/AudioFilters.ts
  const bass = (g: number) => `bass=g=${g}:f=110:w=0.3`

  return {
    bassboost_low: bass(15),
    bassboost: bass(20),
    bassboost_high: bass(30),
    '8D': 'apulsator=hz=0.09',
    vaporwave: 'aresample=48000,asetrate=48000*0.8',
    nightcore: 'aresample=48000,asetrate=48000*1.25',
    phaser: 'aphaser=in_gain=0.4',
    tremolo: 'tremolo',
    vibrato: 'vibrato=f=6.5',
    reverse: 'areverse',
    treble: 'treble=g=5',
    normalizer: 'dynaudnorm=g=101',
    normalizer2: 'acompressor',
    surrounding: 'surround',
    pulsator: 'apulsator=hz=1',
    subboost: 'asubboost',
    karaoke: 'stereotools=mlev=0.03',
    flanger: 'flanger',
    gate: 'agate',
    haas: 'haas',
    mcompand: 'mcompand',
    mono: 'pan=mono|c0=.5*c0+.5*c1',
    mstlr: 'stereotools=mode=ms>lr',
    mstrr: 'stereotools=mode=ms>rr',
    compressor: 'compand=points=-80/-105|-62/-80|-15.4/-15.4|0/-12|20/-7.6',
    expander:
      'compand=attacks=0:points=-80/-169|-54/-80|-49.5/-64.6|-41.1/-41.1|-25.8/-15|-10.8/-4.5|0/0|20/8.3',
    softlimiter:
      'compand=attacks=0:points=-80/-80|-12.4/-12.4|-6/-8|0/-6.8|20/-2.8',
    chorus: 'chorus=0.7:0.9:55:0.4:0.25:2',
    chorus2d: 'chorus=0.6:0.9:50|60:0.4|0.32:0.25|0.4:2|1.3',
    chorus3d: 'chorus=0.5:0.9:50|60|40:0.4|0.32|0.3:0.25|0.4|0.3:2|2.3|1.3',
    fadein: 'afade=t=in:ss=0:d=10',
    dim: `afftfilt="'real=re * (1-clip((b/nb)*b,0,1))':imag='im * (1-clip((b/nb)*b,0,1))'"`,
    earrape: 'channelsplit,sidechaingate=level_in=64'
  }
}
