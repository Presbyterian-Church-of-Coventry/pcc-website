const fs = require('fs')
const path = require('path')

const contentDir = 'content/series'

function updateThumbnailUrls(filePath) {
  const content = fs.readFileSync(filePath, 'utf8')
  const updatedContent = content.replace(
    /thumbnail: \/content/g,
    'thumbnail: ..'
  )
  fs.writeFileSync(filePath, updatedContent, 'utf8')
}

function processDirectory(dirPath) {
  const files = fs.readdirSync(dirPath)
  files.forEach((file) => {
    const filePath = path.join(dirPath, file)
    const stat = fs.statSync(filePath)
    if (stat.isDirectory()) {
      processDirectory(filePath)
    } else if (path.extname(file) === '.md') {
      updateThumbnailUrls(filePath)
    }
  })
}

processDirectory('content/series')
processDirectory('content/events')
