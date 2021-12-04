const fs = require('fs')

const text = fs.readFileSync('paper.html', 'utf8')

const root = 'https://homes.cs.washington.edu/~jheer/files/zoo'

const localImg = s => 'img/' + s.replace(/\//g, '-')

const processHref = (text, href) => !href.startsWith('http') ? `href="${root}/${href}"` : text
const processSrc = (text, src) => !src.startsWith('http') ? `src="${localImg(src)}"` : text

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
