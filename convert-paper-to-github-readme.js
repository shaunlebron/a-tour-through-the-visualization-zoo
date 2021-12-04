const fs = require('fs')

const text = fs.readFileSync('paper.html', 'utf8')

const root = 'https://homes.cs.washington.edu/~jheer/files/zoo'

const localImg = s => 'img/' + s.replace(/\//g, '-')


// output of `identify img/*`
const imgSizes =
  Object.fromEntries(
`img/choropleth.png PNG 640x342 640x342+0+0 8-bit sRGB 34866B 0.000u 0:00.000
img/dorling.png PNG 640x340 640x340+0+0 8-bit sRGB 34235B 0.000u 0:00.000
img/ex-hierarchies-cluster-radial.png PNG 640x640 640x640+0+0 8-bit sRGB 323029B 0.000u 0:00.000
img/ex-hierarchies-icicle.png PNG 640x323 640x323+0+0 8-bit sRGB 45145B 0.000u 0:00.000
img/ex-hierarchies-indent.png PNG 194x3040 194x3040+0+0 8-bit sRGB 118003B 0.000u 0:00.000
img/ex-hierarchies-pack.png PNG 640x642 640x642+0+0 8-bit sRGB 215230B 0.000u 0:00.000
img/ex-hierarchies-sunburst.png PNG 640x660 640x660+0+0 8-bit sRGB 254355B 0.000u 0:00.000
img/ex-hierarchies-tree.png PNG 640x220 640x220+0+0 8-bit sRGB 92326B 0.000u 0:00.000
img/ex-hierarchies-treemap.png PNG 640x467 640x467+0+0 8-bit sRGB 120590B 0.000u 0:00.000
img/ex-networks-arc.png PNG 640x320 640x320+0+0 8-bit sRGB 164715B 0.000u 0:00.000
img/ex-networks-force.png PNG 640x434 640x434+0+0 8-bit sRGB 96379B 0.000u 0:00.000
img/ex-networks-matrix.png PNG 640x641 640x641+0+0 8-bit sRGB 199608B 0.000u 0:00.000
img/graduated_symbol.png PNG 640x328 640x328+0+0 8-bit sRGB 41551B 0.000u 0:00.000
img/horizon.png PNG 515x350 515x350+0+0 8-bit sRGB 22447B 0.000u 0:00.000
img/index.png PNG 640x406 640x406+0+0 8-bit sRGB 54982B 0.000u 0:00.000
img/napoleon.png PNG 690x400 690x400+0+0 8-bit sRGB 348087B 0.000u 0:00.000
img/parallel.png PNG 640x480 640x480+0+0 8-bit sRGB 371803B 0.000u 0:00.000
img/qq_plot.png PNG 640x242 640x242+0+0 8-bit sRGB 22412B 0.000u 0:00.000
img/scatter_plot.png PNG 530x530 530x530+0+0 8-bit sRGB 97120B 0.000u 0:00.000
img/small_multiples.png PNG 640x364 640x364+0+0 8-bit sRGB 38197B 0.000u 0:00.000
img/stacked_graph.png PNG 640x392 640x392+0+0 8-bit sRGB 94260B 0.000u 0:00.000
img/stem_and_leaf_plot.png PNG 520x240 520x240+0+0 8-bit sRGB 256c 4762B 0.000u 0:00.000`
  .split('\n')
  .map(line => {
    const [name,type,size] = line.split(' ')
    return [name,size.split('x')]
  }))

const processHref = (text, href) => !href.startsWith('http') ? `href="${root}/${href}"` : text
const processSrc = (text, src) => !src.startsWith('http') ? `src="${localImg(src)}" height="${imgSizes[localImg(src)][1]}"` : text

const tocHref = title => '#' + title.replace(/[()]/g, '').trim().replace(/\s+/g, '-').toLowerCase()
const tocLine = ([text, level, title]) => ({2:"",3:"  "}[level] + `* [${title}](${tocHref(title)})`)
const tocLines = [...text.matchAll(/<h([23])>([^<]*)</g)].map(tocLine)

const toc = `
## Table of Contents

${tocLines.join('\n')}`


const newText = `
**Disclaimer**: I am NOT the author of this paper.
This is reproduced from <https://homes.cs.washington.edu/~jheer/files/zoo/>,
but with a Table of Contents and section links for easier referencing
(permission pending).

${text
  .replace('<h2>', `${toc}\n\n<h2>`)
  .replace(/href="([^"]*)"/g, processHref)
  .replace(/src="([^"]*)"/g, processSrc)}`

fs.writeFileSync('README.md', newText)

const imageNames = [...text.matchAll(/src="([^"]*)"/g)].map(m => m[1])
const wgetImage = src => `wget ${root}/${src} -O ${localImg(src)}`

fs.writeFileSync('get-images.sh', ['#!/bin/bash', ...imageNames.map(wgetImage)].join('\n'))
