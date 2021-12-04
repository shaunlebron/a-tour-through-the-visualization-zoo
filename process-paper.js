const fs = require('fs')

const text = fs.readFileSync('paper.html', 'utf8')

const root = 'https://homes.cs.washington.edu/~jheer/files/zoo'

const localImg = s => 'img/' + s.replace(/\//g, '-')

const processHref = (text, href) => !href.startsWith('http') ? `href="${root}/${href}"` : text
const processSrc = (text, src) => !src.startsWith('http') ? `src="${localImg(src)}"` : text

const header = '_section-linkable version of: <https://homes.cs.washington.edu/~jheer/files/zoo/>_'

const newText = header + '\n\n' + text
  .replace(/href="([^"]*)"/g, processHref)
  .replace(/src="([^"]*)"/g, processSrc)

fs.writeFileSync('README.md', newText)

const imageNames = [...text.matchAll(/src="([^"]*)"/g)].map(m => m[1])
const wgetImage = src => `wget ${root}/${src} -O ${localImg(src)}`

fs.writeFileSync('get-images.sh', ['#!/bin/bash', ...imageNames.map(wgetImage)].join('\n'))
